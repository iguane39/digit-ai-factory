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

const kpi = (label, valeur, aide, accent) =>
  `      <div class="kpi${accent ? " kpi-" + accent : ""}"><span class="kpi-label">${esc(label)}</span><span class="kpi-value">${valeur}</span><span class="kpi-hint">${esc(aide)}</span></div>`;

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<!-- S-G1 (1/4, R-30 amendé TF-0158 le 13/08) — pose data-theme avant la 1re peinture (zéro
     flash). CLAIR PAR DÉFAUT STRICT : l'auto-sombre hérité de l'OS est retiré ; un livrable
     circule et doit s'ouvrir identique chez tous ses lecteurs. Le sombre est un choix du
     lecteur, persisté. Sans defer : l'exception assumée qui évite le flash. -->
<script>
(function () {
  var s = null;
  try { s = localStorage.getItem('digitai-theme'); } catch (e) {}
  document.documentElement.setAttribute('data-theme', s === 'dark' ? 'dark' : 'light');
})();
</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(titre)}</title>
  <meta name="description" content="Reste-à-faire et décisions attendues du produit — vue générée depuis docs\\projet\\TODO-PRODUIT.md (la source fait foi). Lecture seule.">
  <meta name="theme-color" content="#2563EB">
  <!-- Pas de <meta name="color-scheme" content="light dark"> : FIGÉ à « light dark », le
       navigateur peignait ses propres surfaces (ascenseurs, contrôles) en sombre sur un corps
       clair — défaut relevé par l'amendement RV-9 (14/08, lot Produit-10). Ici la propriété CSS
       color-scheme est portée par les deux blocs de tokens : elle SUIT donc le thème effectif,
       juste dans les deux états, sans script à tenir. -->
  <meta name="destinataire" content="humain">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563EB'/%3E%3Ctext x='32' y='44' font-family='Segoe UI,Roboto,sans-serif' font-size='38' font-weight='700' fill='white' text-anchor='middle'%3E${esc((titre.trim()[0] || "T").toUpperCase())}%3C/text%3E%3C/svg%3E">
  <style>
    :root{color-scheme:light;
      --blue:#2563EB;--bg:#FAFBFF;--surface:#FFFFFF;--ink:#0F172A;--muted:#64748B;
      --faint:#94A3B8;--line:#E6EAF2;--teal:#0E9488;--teal-fill:#EFFDFB;--amber:#B45309;
      --amber-fill:#FFFBEB;--r:12px;--r-sm:8px;
      --head:"Roboto",system-ui,-apple-system,"Segoe UI",sans-serif;
      --sans:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
      --mono:"JetBrains Mono",ui-monospace,"Consolas",monospace}
    /* S-G1 (2/4, R-30) — tokens sombres : une source, deux projections. */
    :root[data-theme="dark"]{color-scheme:dark;
      --bg:#0B1220;--surface:#121B2E;--ink:#EEF2F8;--muted:#A9B4C4;
      --faint:#7C8AA0;--line:#263248;--blue:#7DA2F5;--teal:#5FD3C4;--teal-fill:#0E2A28;
      --amber:#FBBF6D;--amber-fill:#2B2210}
    *{box-sizing:border-box} html{-webkit-text-size-adjust:100%}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.55;font-size:16px}
    .wrap{max-width:clamp(75vw,1680px,92vw);margin:0 auto;padding:32px 24px 64px}
    .colonne{max-width:75ch;margin:0 auto}
    h1,h2,h3{font-family:var(--head);font-weight:800;line-height:1.2}
    h1{font-size:1.7rem;margin:0} h2{font-size:1.25rem;font-weight:700;margin:1.5em 0 .4em}
    h3{font-size:1.02rem;font-weight:700;margin:1.1em 0 .3em}
    code{font-family:var(--mono);font-size:.9em}
    .meta{color:var(--muted);font-size:.85rem;margin:.2em 0 0;overflow-wrap:anywhere}
    .entete{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}
    .entete>div{flex:1 1 260px}
    .theme-toggle{appearance:none;border:1px solid var(--line);background:var(--surface);color:var(--ink);
      border-radius:var(--r-sm);width:44px;height:44px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
    .theme-toggle:focus-visible,a:focus-visible{outline:3px solid var(--blue);outline-offset:2px}
    .theme-toggle .icon-sun{display:none} :root[data-theme="dark"] .theme-toggle .icon-moon{display:none}
    :root[data-theme="dark"] .theme-toggle .icon-sun{display:inline}
    .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:20px 0 6px}
    .kpi{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px 16px;display:flex;flex-direction:column;gap:4px;break-inside:avoid}
    .kpi-amber{border-color:var(--amber);background:var(--amber-fill)}
    .kpi-teal{border-color:var(--teal);background:var(--teal-fill)}
    .kpi-label{font-family:var(--head);font-weight:700;font-size:.82rem;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}
    .kpi-value{font-family:var(--head);font-weight:800;font-size:1.9rem;line-height:1}
    .kpi-hint{color:var(--muted);font-size:.8rem}
    blockquote{margin:14px 0;padding:10px 16px;border-left:3px solid var(--blue);background:var(--surface);border-radius:0 var(--r-sm) var(--r-sm) 0;color:var(--muted)}
    blockquote p{margin:0}
    .scroll{overflow-x:auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);margin:10px 0}
    table{border-collapse:collapse;width:100%;font-size:.92rem}
    th{font-family:var(--head);font-weight:700;text-align:left;padding:9px 12px;border-bottom:2px solid var(--line)}
    td{padding:7px 12px;border-bottom:1px solid var(--line);vertical-align:top;overflow-wrap:anywhere}
    tr:last-child td{border-bottom:none}
    ul{margin:.4em 0;padding-left:1.3em}
    .etat-vide{background:var(--surface);border:1px dashed var(--line);border-radius:var(--r);padding:16px;color:var(--muted)}
    footer{margin-top:40px;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:14px;overflow-wrap:anywhere}
    @media (max-width:640px){.wrap{padding:16px 12px 48px} h1{font-size:1.3rem}}
    @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @page{margin:14mm}
    /* S-G1 (2/4 suite, R-30.2) — impression toujours claire, quel que soit le thème écran */
    @media print{
      :root,:root[data-theme="dark"]{color-scheme:light;
        --bg:#FFFFFF;--surface:#FFFFFF;--ink:#0F172A;--muted:#64748B;
        --faint:#94A3B8;--line:#E6EAF2;--blue:#2563EB;--teal:#0E9488;--teal-fill:#EFFDFB;
        --amber:#B45309;--amber-fill:#FFFBEB}
      .theme-toggle{display:none} .scroll{overflow:visible;border:none} tr{break-inside:avoid}
    }
  </style>
</head>
<body>
  <div class="wrap"><div class="colonne">
    <header class="entete">
      <div>
        <h1>${esc(titre)}</h1>
        <p class="meta">rôle : ${esc(front.role || "—")} · sources de vérité : <code>${esc(front.sources_de_verite || "—")}</code> · vérifié le ${esc(front.verifie_le || "—")} · sceau source <code>${sceau}</code></p>
      </div>
      <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Bascule thème sombre" aria-pressed="false">
        <svg class="icon-moon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        <svg class="icon-sun" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </header>
    <div class="kpis">
${kpi("Décisions attendues", decisions.length, decisions.length ? "un développement suspendu faute d'arbitrage" : "aucun arbitrage en attente", decisions.length ? "amber" : null)}
${kpi("À décider", aDecider, "améliorations constatées, non arbitrées")}
${kpi("En cours", enCours, "travaux ouverts sur le produit", enCours ? "teal" : null)}
${kpi("Écarts assumés", ecarts.length, "décidés de ne pas faire, avec motif")}
    </div>
${vide ? `    <p class="etat-vide">Aucune décision attendue, aucune amélioration, aucun écart renseigné à ce jour — la source <code>docs\\projet\\TODO-PRODUIT.md</code> ne porte que son gabarit. Un état vide se dit : il ne veut pas dire « rien à faire », il veut dire « rien n'a encore été relevé ».</p>` : ""}
    <main>
${mdVersHtml(corps.replace(/^# .+$\r?\n/m, ""))}
    </main>
    <footer>Vue générée par <code>todo/generer-todo-produit.mjs</code> — NE PAS ÉDITER (la source <code>docs/projet/TODO-PRODUIT.md</code> fait foi ; la régénérer via le script du pilot). Page en <strong>lecture seule</strong> : une décision humaine revient au pilot par un lot <code>&lt;projet&gt; - RETOURS - &lt;AAAAMMJJ&gt;&lt;indice&gt;</code> et son sidecar (règle R10), jamais par cette page. Sceau source <code>${sceau}</code>.</footer>
  </div></div>
  <!-- S-G1 (4/4, R-30) — câblage : persistance + aria-pressed, aucune bascule muette -->
  <script>
  (function () {
    var bouton = document.getElementById('theme-toggle');
    var racine = document.documentElement;
    function appliquer(theme) {
      racine.setAttribute('data-theme', theme);
      try { localStorage.setItem('digitai-theme', theme); } catch (e) {}
      bouton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    bouton.setAttribute('aria-pressed', racine.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    bouton.addEventListener('click', function () {
      appliquer(racine.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  })();
  </script>
</body>
</html>
`;
const cible = join(dirname(src), "TODO-PRODUIT.html");
writeFileSync(cible, html);
console.log(`TODO-PRODUIT.html générée — ${decisions.length} décision(s) attendue(s), ${ameliorations.length} amélioration(s) (dont ${aDecider} à décider, ${enCours} en cours), ${ecarts.length} écart(s) assumé(s) — sceau ${sceau}`);
