#!/usr/bin/env node
/**
 * generer-recidives.mjs — génère todo/RECIDIVES.md, le TABLEAU DE BORD des récidives et de la
 * descente. Vue GÉNÉRÉE, jamais éditée (même contrat que generer-vue.mjs) : déterministe —
 * l'horodatage affiché est le ts max des sources, jamais l'horloge ; deux générations sur les
 * mêmes sources rendent le même fichier.
 *
 * LE FAIT (mandat d'amélioration continue du 03/09/2026). Le registre consignait et corrigeait,
 * et personne ne pouvait répondre en dix secondes à : est-ce la deuxième fois ? chez qui ? depuis
 * combien de temps la correction existe-t-elle sans être appliquée ? Trois mesures et une
 * contre-métrique, lues ensemble :
 *   1. le TAUX DE RÉCIDIVE par classe et par produit — créations marquées `recidive_de` ;
 *   2. le DÉLAI clôture au pilot → descente CONSTATÉE chez le produit — la date de correction
 *      d'une classe, contre le premier relevé d'héritage (todo/HERITAGE-RELEVES.jsonl, écrit par
 *      hook-ouverture) où l'artefact porteur de la règle est conforme chez le produit ;
 *   3. le TAUX D'HÉRITAGE par artefact (règle) — dernier relevé, produits conformes / relevés ;
 *   4. CONTRE-MÉTRIQUE : classes créées par semaine, et classes sans clôture fondatrice — parce
 *      que la façon la moins chère de faire baisser un compteur de récidives est d'inventer des
 *      clés neuves (Ch7 de l'analyse L99 du 03/09).
 * Ce qui n'est pas mesurable se DIT (« non mesurable encore »), jamais mis à zéro.
 *
 * Usage : node todo\generer-recidives.mjs [--registre <TODO.jsonl>] [--archive <…>] [--classes <…>]
 *          [--releves <…>] [--heritage <…>] [--sortie <RECIDIVES.md>]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { empreinteFichier } from "../scripts/lib-empreinte.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const SRC = arg("--registre", join(ICI, "TODO.jsonl"));
const ARC = arg("--archive", join(ICI, "TODO-ARCHIVE.jsonl"));
const CLS = arg("--classes", join(ICI, "CLASSES.json"));
const REL = arg("--releves", join(ICI, "HERITAGE-RELEVES.jsonl"));
const HER = arg("--heritage", join(ICI, "..", "gabarits", "HERITAGE.json"));
const OUT = arg("--sortie", join(ICI, "RECIDIVES.md"));
const lire = (f) => (existsSync(f) ? readFileSync(f, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) : []);
// Le sceau passe par la fonction PARTAGÉE (N-7, references/EMPREINTES.md) — un sixième mécanisme de hachage
// maison est exactement ce que l'oracle des empreintes existe pour refuser.
const sha = (f) => (existsSync(f) ? empreinteFichier(f, 12) : "absent");

const ref = existsSync(CLS) ? JSON.parse(readFileSync(CLS, "utf8")) : { familles: [], classes: [] };
const heritage = existsSync(HER) ? JSON.parse(readFileSync(HER, "utf8")) : { artefacts: [] };
const classes = new Map((ref.classes || []).map((c) => [c.cle, c]));
const familles = new Map((ref.familles || []).map((f) => [f.cle, f.libelle]));

// ---- états du registre (actifs + archive), date de correction relevée à la clôture ----------
const etats = new Map();
let tsMax = "";
for (const e of [...lire(ARC), ...lire(SRC)]) {
  if (e.ts && e.ts > tsMax) tsMax = e.ts;
  if (!e.id) continue;
  if (e.ev === "creation") etats.set(e.id, { ...e, _corrige: null });
  else if (e.ev === "maj" && etats.has(e.id)) {
    const s = etats.get(e.id); Object.assign(s, e);
    if (e.statut === "corrige") s._corrige = e.date_correction || String(e.ts || "").slice(0, 10);
  }
}
const produitDe = (s) => {
  const m = `${s.demandeur || ""} ${s.source || ""}`.match(/produit-(\d+)/i);
  if (m) return `Produit-${m[1].padStart(2, "0")}`;
  return /^(pilot|campagne|revue|humain|mandat|etude|session|digit|forge)/i.test(s.demandeur || "") ? "pilot" : (s.demandeur || "?");
};
const items = [...etats.values()];
const avecClasse = items.filter((s) => s.classe);
const recidives = avecClasse.filter((s) => Array.isArray(s.recidive_de) && s.recidive_de.length);

// ---- 1. récidives par classe × produit ------------------------------------------------------
const parClasse = new Map();
for (const s of avecClasse) {
  const k = s.classe; const p = produitDe(s);
  const r = parClasse.get(k) || { items: 0, recidives: 0, produits: new Map(), derniere: "" };
  r.items++;
  if (Array.isArray(s.recidive_de) && s.recidive_de.length) {
    r.recidives++; r.produits.set(p, (r.produits.get(p) || 0) + 1);
    if ((s.date_demande || "") > r.derniere) r.derniere = s.date_demande || "";
  }
  parClasse.set(k, r);
}
for (const [k, c] of classes) if (!parClasse.has(k)) parClasse.set(k, { items: 0, recidives: 0, produits: new Map(), derniere: "", fondateurs: (c.fondee_par || []).length });

// ---- 2. délai clôture → descente constatée --------------------------------------------------
const releves = lire(REL);
const artefactDe = (c) => {
  // l'artefact hérité porteur de la règle : cité par le nom de sa source dans `regle` ou `oracle`
  const texte = `${c.regle || ""} ${c.oracle || ""}`;
  return (heritage.artefacts || []).find((a) => texte.includes(basename(a.source)) || texte.includes(basename(a.cible)));
};
const CONFORME = (etat) => !["absent", "divergent", "incomplet", "hors_racine"].includes(etat);
const delais = [];
for (const [k, c] of classes) {
  const dates = (c.fondee_par || []).map((id) => etats.get(id)?._corrige).filter(Boolean).sort();
  const dateCorrection = dates[0] || null;
  const art = artefactDe(c);
  if (!dateCorrection) { delais.push({ classe: k, correction: "—", artefact: art ? art.cible : "—", constat: "non mesurable : aucune clôture fondatrice au registre" }); continue; }
  if (!art) { delais.push({ classe: k, correction: dateCorrection, artefact: "—", constat: "non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul" }); continue; }
  const apres = releves.filter((r) => (r.ts || "") >= dateCorrection);
  if (!apres.length) { delais.push({ classe: k, correction: dateCorrection, artefact: art.cible, constat: "non mesurable encore : aucun relevé d'héritage postérieur à la correction" }); continue; }
  const produits = new Map();
  for (const r of apres) for (const p of (r.produits || [])) {
    const a = (p.artefacts || []).find((x) => x.cible === art.cible);
    if (!a) continue;
    if (CONFORME(a.etat) && !produits.has(p.produit)) produits.set(p.produit, Math.round((Date.parse(r.ts) - Date.parse(dateCorrection)) / 86400000));
    else if (!produits.has(p.produit)) produits.set(p.produit, null);
  }
  const mesures = [...produits.values()].filter((v) => v !== null);
  const enAttente = [...produits.entries()].filter(([, v]) => v === null).map(([p]) => p);
  delais.push({ classe: k, correction: dateCorrection, artefact: art.cible,
    constat: `${mesures.length} produit(s) atteint(s)${mesures.length ? ` en ${Math.min(...mesures)}–${Math.max(...mesures)} j` : ""} ; ${enAttente.length} non atteint(s)${enAttente.length ? ` (${enAttente.join(", ")})` : ""}` });
}

// ---- 3. taux d'héritage par artefact (dernier relevé) ---------------------------------------
const dernier = releves[releves.length - 1] || null;
const tauxHeritage = [];
if (dernier) for (const a of (heritage.artefacts || [])) {
  const lignes = (dernier.produits || []).map((p) => (p.artefacts || []).find((x) => x.cible === a.cible)).filter(Boolean);
  const conformes = lignes.filter((x) => CONFORME(x.etat)).length;
  tauxHeritage.push({ artefact: a.cible, mode: a.mode, conformes, total: lignes.length, familles: (a.familles_protegees || []).join(", ") || "—" });
}

// ---- 4. contre-métrique ----------------------------------------------------------------------
const semaine = (d) => { const t = new Date(d); const j = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate())); const jour = j.getUTCDay() || 7; j.setUTCDate(j.getUTCDate() + 4 - jour); const an = new Date(Date.UTC(j.getUTCFullYear(), 0, 1)); return `${j.getUTCFullYear()}-S${String(Math.ceil((((j - an) / 86400000) + 1) / 7)).padStart(2, "0")}`; };
const parSemaine = new Map();
for (const c of classes.values()) if (c.creee_le) parSemaine.set(semaine(c.creee_le), (parSemaine.get(semaine(c.creee_le)) || 0) + 1);
const sansFondateur = [...classes.values()].filter((c) => !(c.fondee_par || []).length).map((c) => c.cle);
const suspectes = items.filter((s) => s.classe_suspecte).map((s) => `${s.id} (${s.classe})`);

// ---- rendu -----------------------------------------------------------------------------------
const L = [];
L.push(`# Récidives et descente — tableau de bord`, ``,
  `<!-- VUE GÉNÉRÉE par todo/generer-recidives.mjs — NE PAS ÉDITER. Sources scellées : registre ${sha(SRC)} · archive ${sha(ARC)} · classes ${sha(CLS)} · relevés ${sha(REL)} · héritage ${sha(HER)}. État au ${tsMax || "(registre vide)"} (ts max des sources, jamais l'horloge). -->`, ``,
  `Ce tableau de bord répond à trois questions que le registre seul ne savait pas poser : est-ce la deuxième fois, chez qui, et depuis combien de temps la correction existe sans être appliquée. Il se lit avec sa contre-métrique : un compteur de récidives qui baisse pendant que le nombre de classes monte est un compteur contourné, pas un progrès.`, ``,
  `**Périmètre mesuré** : ${items.length} item(s) au registre (actifs et archive), ${avecClasse.length} portant une classe, ${recidives.length} marqué(s) récidive ; référentiel de ${classes.size} classe(s) en ${familles.size} famille(s) (v${ref.version || "?"}) ; ${releves.length} relevé(s) d'héritage.`, ``);

L.push(`## 1. Récidives par classe`, ``,
  `Comment lire : une ligne par classe du référentiel, triée par récidives décroissantes puis par clé. *Items* compte les retours portant la classe au registre ; *fondateurs* les clôtures qui l'ont créée (elles ne comptent pas comme items) ; *récidives* les retours entrés marqués \`recidive_de\` ; le *taux* rapporte les récidives aux items classés — il n'a pas de sens sous trois items et le dit. *Produits* nomme qui a récidivé, avec le compte.`, ``,
  `| Classe | Famille | Items | Fondateurs | Récidives | Taux | Produits ayant récidivé | Dernière |`, `|---|---|---|---|---|---|---|---|`);
const lignesClasses = [...parClasse.entries()].sort((a, b) => b[1].recidives - a[1].recidives || a[0].localeCompare(b[0]));
for (const [k, r] of lignesClasses) {
  const c = classes.get(k);
  const taux = r.items >= 3 ? `${Math.round(100 * r.recidives / r.items)} %` : (r.items ? `${r.recidives}/${r.items} (sous 3 items, taux non significatif)` : "—");
  L.push(`| \`${k}\` | ${c ? c.famille : "(hors référentiel)"} | ${r.items} | ${r.fondateurs ?? (c ? (c.fondee_par || []).length : 0)} | ${r.recidives} | ${taux} | ${[...r.produits.entries()].map(([p, n]) => `${p} ×${n}`).join(", ") || "—"} | ${r.derniere || "—"} |`);
}
if (!lignesClasses.length) L.push(`| (aucune classe) | | | | | | | |`);
L.push(``);

L.push(`## 2. Délai clôture au pilot → descente constatée chez le produit`, ``,
  `Comment lire : une ligne par classe fondée par une clôture ; *correction* est la date de la première clôture fondatrice lue au registre ; *artefact* est la pièce héritée (R-47) où la règle vit ; le *constat* compte les produits chez qui cet artefact est conforme dans un relevé d'héritage postérieur à la correction, avec le délai en jours. Ce qui n'est pas mesurable le dit — un relevé d'héritage est écrit à chaque ouverture du pilot, la mesure se remplit avec le temps.`, ``,
  `| Classe | Correction | Artefact porteur | Constat |`, `|---|---|---|---|`);
for (const d of delais.sort((a, b) => a.classe.localeCompare(b.classe))) L.push(`| \`${d.classe}\` | ${d.correction} | ${d.artefact} | ${d.constat} |`);
if (!delais.length) L.push(`| (aucune classe) | | | |`);
L.push(``);

L.push(`## 3. Taux d'héritage par règle (dernier relevé)`, ``);
if (!dernier) L.push(`Non mesurable encore : aucun relevé d'héritage dans \`todo/HERITAGE-RELEVES.jsonl\`. Le relevé s'écrit à chaque ouverture du pilot (hook d'ouverture, R-47).`, ``);
else {
  L.push(`Comment lire : une ligne par artefact hérité déclaré dans \`gabarits/HERITAGE.json\`, état au relevé du ${dernier.ts} sur ${(dernier.produits || []).length} produit(s) ; *conformes* compte les produits chez qui l'artefact est présent et à jour ; *familles* dit de quelles familles de défaut cet artefact protège.`, ``,
    `| Artefact | Mode | Conformes | Familles protégées |`, `|---|---|---|---|`);
  for (const t of tauxHeritage) L.push(`| ${t.artefact} | ${t.mode} | ${t.conformes}/${t.total} | ${t.familles} |`);
  L.push(``);
}

L.push(`## 4. Contre-métrique : classes créées`, ``,
  `Comment lire : le nombre de classes créées par semaine ISO, puis les classes sans clôture fondatrice et les retours entrés sous une classe signalée suspecte. Une semaine qui crée plus de classes qu'elle ne clôt de récidives demande une relecture du référentiel, pas une félicitation.`, ``,
  `| Semaine | Classes créées |`, `|---|---|`);
for (const [s, n] of [...parSemaine.entries()].sort()) L.push(`| ${s} | ${n} |`);
if (!parSemaine.size) L.push(`| (aucune) | |`);
L.push(``, `- Classes sans clôture fondatrice : ${sansFondateur.length ? sansFondateur.map((k) => `\`${k}\``).join(", ") : "aucune"}`,
  `- Retours entrés sous une classe suspecte : ${suspectes.length ? suspectes.join(", ") : "aucun"}`, ``);

L.push(`## Ce que cette vue ne juge pas`, ``,
  `- la JUSTESSE d'une classe déclarée par un producteur : un retour mal classé est une récidive manquée, et seule une revue des classes (BOUCLE-AMELIORATION.md) la voit ;`,
  `- la descente d'une règle qui ne vit dans aucun artefact hérité : elle est déclarée non mesurable, jamais supposée faite ;`,
  `- les items antérieurs au 03/09/2026 sans classe : ils ne comptent ni comme items ni comme récidives — la mesure du pas 0 (output/03-etudes) les a lus une fois, à la main.`, ``);
writeFileSync(OUT, L.join("\n"), "utf8");
console.log(`${OUT} : ${classes.size} classe(s), ${recidives.length} récidive(s), ${releves.length} relevé(s) — état au ${tsMax || "(vide)"}`);
