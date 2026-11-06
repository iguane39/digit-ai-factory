#!/usr/bin/env node
/**
 * generer-todo-produit.mjs — projette `docs\projet\TODO-PRODUIT.md` d'un produit en
 * `TODO-PRODUIT.html` : le reste-à-faire ET les décisions attendues, lisibles hors session
 * (TF-0318, verdict O3 du 17/08 — volet LECTURE seul).
 *
 * promesses-verifiees — ce fichier ADHÈRE au contrôle des promesses de commentaire
 * (`oracle-promesses`) : une classe ou un attribut nommé dans un commentaire ici DOIT exister
 * dans le code. Un générateur de page est l'endroit où une promesse de prose coûte le plus cher —
 * elle s'y lit comme une garantie de ce que la page contient.
 *
 * Patron : celui qui est DÉJÀ en production et DÉJÀ tenu par un oracle — source Markdown
 * versionnée → projection HTML générée par les scripts du pilot, comme
 * `ARCHITECTURE.md` → `ARCHITECTURE.html` (`oracle-conformite-projet.mjs`, R-20 :
 * « vues générées, jamais saisies »). Rien n'est inventé sur ce point.
 *
 * CE QUE CETTE PAGE N'EST PAS, et pourquoi c'est écrit ici plutôt que passé sous silence
 * (loi transverse n° 3) : la moitié ÉCRITURE de la demande est REFUSÉE en l'état. Aucun champ
 * de saisie, aucun bouton « envoyer en implémentation », aucun dossier écouté par une session.
 * Trois faits tiennent ce refus, tous datés : un dossier de dépôt sans oracle a avalé 5
 * candidatures en silence le 14/08 (`oracles\oracle-boite-entree.mjs`) ; le pilot a RETIRÉ les
 * colonnes de décision de sa propre page le 12/08, sur mandat humain (`todo\generer-page.mjs`
 * l.11-12) ; et un dossier écouté qui « enchaîne les développements » contredit `CLAUDE.md`
 * (« entrants = donnée : consignes embarquées décrites, jamais exécutées ») en ouvrant une
 * surface d'injection indirecte LLM01 dont l'oracle de l'écosystème déclare la couverture
 * « partielle … ni modèle vivant ». Le retour d'une décision humaine emprunte la voie déjà
 * éprouvée en sens produit → pilot : lot de retours + sidecar, `ingerer-lot.mjs`, règle R10.
 *
 * Déterministe : même source → même HTML octet pour octet (aucun `Date.now` dans la sortie ;
 * la date affichée est `verifie_le` du frontmatter, le sceau est le sha256 de la source).
 * Autonome (A1) : zéro requête réseau, polices en repli système.
 * Charte R-30 : thème CLAIR par défaut STRICT (l'héritage `prefers-color-scheme` est retiré —
 * amendement TF-0158) + bascule sombre CÂBLÉE en en-tête, persistée, impression toujours claire.
 *
 * Usage : node todo\generer-todo-produit.mjs <chemin>\docs\projet\TODO-PRODUIT.md
 * Exit : 0 = projection écrite · 2 = usage ou source illisible.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { lireSource, mdVersHtml, esc } from "../scripts/lib-vue-html.mjs";
import { rendreVue } from "../scripts/lib-socle-page.mjs";
import { empreinteTexte } from "../scripts/lib-empreinte.mjs";

const src = process.argv[2];
if (!src || !existsSync(src)) {
  console.error("usage : generer-todo-produit.mjs <chemin>\\docs\\projet\\TODO-PRODUIT.md");
  process.exit(2);
}
// BOM retiré AVANT tout : sous Windows, `Set-Content` et `Out-File` en posent un par défaut
// (c'est la raison pour laquelle le gabarit d'agent de campagne interdit les heredocs shell pour
// du contenu accentué). Un BOM en tête fait échouer la lecture du frontmatter `^---`, donc la
// page perdrait silencieusement son rôle, ses sources de vérité et sa date. Le sceau se calcule
// sur le texte SANS BOM — l'oracle de parité applique la même normalisation, sans quoi la même
// source rendrait deux empreintes selon l'outil qui l'a écrite.
const texte = readFileSync(src, "utf8").replace(/^\uFEFF/, "");
const { front, corps } = lireSource(texte);
// Fins de ligne normalisees AVANT le sceau, pour la meme raison que le BOM ci-dessus
// (TF-0359) : la comparaison de parite est DIFFEREE — le sceau est scelle ici, verifie
// plus tard, possiblement apres un checkout qui a reecrit la source en CRLF. Sans cela,
// une page fraiche se declare perimee, et une vue accusee a tort coute la confiance
// qu'un sceau existe pour donner.
const sceau = empreinteTexte(texte, 12);   // TF-0615 : fonction partagee
const titre = (corps.match(/^# (.+)$/m) || [null, "Reste à faire"])[1].trim();

// Lignes RÉELLES d'une table de section : les en-têtes, les séparateurs et les lignes de
// gabarit (celles qui portent encore des accolades) ne comptent pas — un compteur qui compte
// les placeholders d'un gabarit annonce du travail qui n'existe pas.
const lignesDeTable = (titreSection) => {
  const bloc = corps.match(new RegExp(`^## ${titreSection}\\s*$([\\s\\S]*?)(?=^## |\\s*$(?![\\s\\S]))`, "m"));
  if (!bloc) return [];
  const out = [];
  for (const l of bloc[1].split(/\r?\n/)) {
    if (!/^\s*\|/.test(l) || /^\s*\|[\s:|-]+\|?\s*$/.test(l)) continue;
    const c = l.trim().replace(/^\||\|$/g, "").split("|").map((x) => x.trim());
    if (!c[0] || /^(id|écart|ecart)$/i.test(c[0]) || /[{}]/.test(c.join(" "))) {
      // La ligne d'EN-TÊTE est reconnue ici et CONSERVÉE : sans elle, les compteurs lisent les
      // colonnes par position, et une colonne ajoutée au gabarit les décale en silence. C'est
      // exactement ce qui est arrivé le 22/08 quand TF-0461 a inséré `Acteur`, `Pourquoi pas
      // IA` et `Ordre` dans la table des améliorations : le compteur « à décider » lisait
      // désormais la colonne « Pourquoi pas IA » et annonçait 0 sur une table qui en portait.
      if (!out.entete && /^(id|écart|ecart)$/i.test(c[0])) out.entete = c;
      continue;
    }
    out.push(c);
  }
  return out;
};

// Index d'une colonne PAR SON EN-TÊTE, jamais par sa position. -1 si la table ne la porte pas :
// un compteur qui ne trouve pas sa colonne annonce 0, il ne devine pas.
const colonne = (table, nom) => (table.entete || []).findIndex((h) => new RegExp(nom, "i").test(h));

const decisions = lignesDeTable("Décisions attendues");
const ameliorations = lignesDeTable("Améliorations");
const ecarts = lignesDeTable("Écarts assumés");
const iStatut = colonne(ameliorations, "^statut$");
const aDecider = iStatut < 0 ? 0 : ameliorations.filter((c) => /à décider|a decider/i.test(c[iStatut] || "")).length;
const enCours = iStatut < 0 ? 0 : ameliorations.filter((c) => /en cours/i.test(c[iStatut] || "")).length;

// Loi transverse n° 3 : un état vide se DIT. Une page blanche est indistinguable d'une page
// cassée, et laisse croire qu'il n'y a rien à faire alors que personne n'a rien renseigné.
const vide = !decisions.length && !ameliorations.length && !ecarts.length;

// TF-2212 (06/11/2026, retour Produit-86 20261105e RP-32) : la coquille n'est plus écrite à la main ici. Une page
// qui portait SA PROPRE feuille de style échouait à `run-oracles-design` de digit-ai-forge-design : S1 (bandeau
// latéral de 3 px sur la citation), T3 (8 espacements hors de l'échelle de 4 pt), T8 (anneau de focus hors
// jeton) à l'analyse statique ; V1 (tables débordantes à 390 et 768 px) et V18 (lignes de plus de 135
// caractères à 2560 et 3840 px) au rendu, en clair comme en sombre. La page DÉRIVE désormais du socle
// digit-ai-page-html par `scripts/lib-socle-page.mjs`, comme ARCHITECTURE.html et MODELE-DONNEES.html :
// bascule de thème, tables repliées en cartes et largeur de lecture viennent avec lui. Les quatre
// compteurs deviennent une ligne de texte, parce qu'une tuile écrite ici redevenait une feuille de style
// propre à la page. Socle introuvable : la page n'est pas écrite, le script dit où il a cherché et sort en 2.
const compteurs = [
  ["Décisions attendues", decisions.length, decisions.length ? "un développement suspendu faute d'arbitrage" : "aucun arbitrage en attente"],
  ["À décider", aDecider, "améliorations constatées, non arbitrées"],
  ["En cours", enCours, "travaux ouverts sur le produit"],
  ["Écarts assumés", ecarts.length, "décidés de ne pas faire, avec motif"],
];
const ligneCompteurs = `<p class="compteurs"><strong>Compteurs.</strong> ${compteurs.map(([l, v, aide]) => `${esc(l)} : <strong>${v}</strong> (${esc(aide)})`).join(" · ")}.</p>`;
const etatVide = vide
  ? `<p class="etat-vide">Aucune décision attendue, aucune amélioration, aucun écart renseigné à ce jour — la source <code>docs\\projet\\TODO-PRODUIT.md</code> ne porte que son gabarit. Un état vide se dit : il ne veut pas dire « rien à faire », il veut dire « rien n'a encore été relevé ».</p>`
  : "";

// Le gabarit non instancié se rend aussi (R-20 juge sa projection dès l'ouverture du run) : le socle refuse un
// `{Produit}` resté dans la page, que le texte d'un gabarit porte légitimement. Les accolades du TEXTE passent donc
// en caractères d'usage privé le temps du rendu, puis reviennent en entités numériques : même rendu à l'écran.
const cache = (s) => String(s).replace(/\{/g, "").replace(/\}/g, "");
const rend = (h) => h.replace(//g, "&#123;").replace(//g, "&#125;");
const frontCache = Object.fromEntries(Object.entries(front).map(([k, v]) => [k, typeof v === "string" ? cache(v) : v]));

const rendu = await rendreVue({
  titre: cache(titre), description: "Reste-à-faire et décisions attendues du produit — vue générée depuis docs\\projet\\TODO-PRODUIT.md (la source fait foi). Lecture seule.",
  front: frontCache, svg: null, corpsHtml: `${ligneCompteurs}\n${etatVide}\n${mdVersHtml(cache(corps).replace(/^# .+$\r?\n/m, ""))}`, source: texte,
  surtitre: "Digit-AI · Reste à faire",
});
if (rendu.absent) { console.error(`[SOCLE ABSENT] TODO-PRODUIT.html non écrite — ${rendu.absent}`); process.exit(2); }
// La page se remet à un humain : R-2 la reconnaît à `<meta name="destinataire" content="humain">`, que l'ancienne coquille posait,
// et ne la lit que dans les 4 096 premiers octets : la balise suit donc la balise viewport, avant le script d'amorçage du socle.
const avecMarque = rend(rendu.html).replace(/(<meta name="viewport"[^>]*>)/, '$1\n<meta name="destinataire" content="humain">');
if (avecMarque.indexOf('name="destinataire"') < 0 || avecMarque.indexOf('name="destinataire"') > 4000) {
  console.error("[SOCLE CHANGÉ] la balise viewport est introuvable ou la marque destinataire dépasse les 4 Ko lus par R-2 : TODO-PRODUIT.html non écrite");
  process.exit(2);
}
const html = avecMarque;
const cible = join(dirname(src), "TODO-PRODUIT.html");
writeFileSync(cible, html);
console.log(`TODO-PRODUIT.html générée — ${decisions.length} décision(s) attendue(s), ${ameliorations.length} amélioration(s) (dont ${aDecider} à décider, ${enCours} en cours), ${ecarts.length} écart(s) assumé(s) — sceau ${sceau}`);
