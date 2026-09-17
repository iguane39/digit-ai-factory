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
 *   5-7. (TF-1163, TF-1164, étude du 17/09/2026) la descente PAR PRODUIT avec la relance proposée,
 *      le STOCK des items ouverts avec sa contre-mesure (émises contre tranchées), et le SILENCE
 *      des sources de retours — le pilot décide et clôt en moins d'un jour en médiane, le retard
 *      mesuré vit dans ces trois grandeurs, qu'aucune sonde ne lisait.
 * Ce qui n'est pas mesurable se DIT (« non mesurable encore »), jamais mis à zéro.
 *
 * Usage : node todo\generer-recidives.mjs [--registre <TODO.jsonl>] [--archive <…>] [--classes <…>]
 *          [--releves <…>] [--heritage <…>] [--retours <dossier>] [--sortie <RECIDIVES.md>] [--json <…>]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
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
// `--retours <dossier>` (TF-1163, 17/09/2026) : la boîte des lots de retours, lue par ses NOMS de
// fichiers seulement (`<source> - RETOURS - AAAAMMJJ<indice>.md`, racine et `old/`) — le silence
// d'une source se mesure contre l'état des sources (ts max), jamais contre l'horloge.
const RET = arg("--retours", join(ICI, "..", "input", "00-retours"));
const SEUIL_JOURS = 7; // seuil commun des sections 5 à 7 — à régler après deux passages (TF-1163)
// `--json <fichier>` (TF-0790, 03/09/2026) : les compteurs du tableau de bord dans un JSON que la sonde
// `rapport_json` de forge-observability sait lire — et sur stdout, pour la sonde `commande`. La vue
// Markdown reste générée dans le même passage : un seul calcul, deux formes.
const JSON_OUT = arg("--json", null);
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
  if (e.ev === "creation") etats.set(e.id, { ...e, _corrige: null, _cree: e.ts || null, _tranche: null });
  else if (e.ev === "maj" && etats.has(e.id)) {
    const s = etats.get(e.id); Object.assign(s, e);
    // première sortie de `candidat` (décidé ou écarté) : la date où la candidature a été TRANCHÉE
    if (!s._tranche && ["decide", "ecarte"].includes(e.statut)) s._tranche = e.ts || null;
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
// TF-1164 (17/09/2026) : la même mesure, retournée PAR PRODUIT — « quel produit ouvrir en premier ».
const descenteParProduit = new Map();
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
  for (const [p, v] of produits) {
    const pp = descenteParProduit.get(p) || { atteints: 0, enRetard: [] };
    if (v === null) pp.enRetard.push({ classe: k, correction: dateCorrection, artefact: art.cible }); else pp.atteints++;
    descenteParProduit.set(p, pp);
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

// ---- 5 à 7. descente par produit, stock des items ouverts, silence des sources (TF-1163, TF-1164) ----
// L'étude du 17/09/2026 a mesuré que le retard de la boucle ne se loge pas dans la décision (médiane
// inférieure à un jour) mais dans la descente chez les produits, dans le stock d'items décidés non
// clos et dans le silence des sources — trois grandeurs qu'aucune sonde ne lisait. Tout se date contre
// `tsMax` (l'état des sources), jamais contre l'horloge : la vue reste déterministe.
const jourRef = tsMax ? tsMax.slice(0, 10) : null;
const joursDepuis = (d) => (jourRef && d ? Math.round((Date.parse(jourRef) - Date.parse(String(d).slice(0, 10))) / 86400000) : null);
const lignesProduits = [...descenteParProduit.entries()].map(([p, v]) => ({ produit: p, atteints: v.atteints, enRetard: v.enRetard,
  retardMax: v.enRetard.length ? Math.max(...v.enRetard.map((x) => joursDepuis(x.correction) ?? 0)) : 0 }))
  .sort((a, b) => b.retardMax - a.retardMax || b.enRetard.length - a.enRetard.length || a.produit.localeCompare(b.produit));
const couplesNonAtteints = lignesProduits.reduce((n, l) => n + l.enRetard.length, 0);
const produitsARelancer = lignesProduits.filter((l) => l.retardMax > SEUIL_JOURS);

const OUVERTS = ["candidat", "decide", "en_cours"];
const ouverts = items.filter((s) => OUVERTS.includes(s.statut));
const stockCandidats = ouverts.filter((s) => s.statut === "candidat").length;
const stockDecides = ouverts.length - stockCandidats;
const ouvertsAges = ouverts.map((s) => ({ id: s.id, statut: s.statut, age: joursDepuis(s._cree) })).filter((s) => s.age !== null && s.age > SEUIL_JOURS).sort((a, b) => b.age - a.age || a.id.localeCompare(b.id));
const fluxParSemaine = new Map();
for (const s of items) {
  if (s._cree) { const k = semaine(s._cree); const f = fluxParSemaine.get(k) || { emises: 0, tranchees: 0 }; f.emises++; fluxParSemaine.set(k, f); }
  if (s._tranche) { const k = semaine(s._tranche); const f = fluxParSemaine.get(k) || { emises: 0, tranchees: 0 }; f.tranchees++; fluxParSemaine.set(k, f); }
}
const dernieresSemaines = [...fluxParSemaine.entries()].sort().slice(-4);

const dernierLot = new Map();
let retoursLus = false;
for (const d of [RET, join(RET, "old")]) {
  if (!existsSync(d)) continue;
  retoursLus = true;
  for (const f of readdirSync(d)) {
    const m = f.match(/^(.+?) - RETOURS - (\d{4})(\d{2})(\d{2})[a-z]*\.md$/);
    if (!m) continue;
    const date = `${m[2]}-${m[3]}-${m[4]}`;
    if (!dernierLot.has(m[1]) || dernierLot.get(m[1]) < date) dernierLot.set(m[1], date);
  }
}
const silences = [...dernierLot.entries()].map(([source, date]) => ({ source, date, silence: joursDepuis(date) })).filter((s) => s.silence !== null)
  .sort((a, b) => b.silence - a.silence || a.source.localeCompare(b.source));
const sourcesSilencieuses = silences.filter((s) => s.silence > SEUIL_JOURS);

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

L.push(`## 5. Descente par produit — quel produit ouvrir en premier`, ``);
if (!lignesProduits.length) L.push(`Non mesurable encore : aucune classe ne porte à la fois une clôture fondatrice, un artefact hérité et un relevé d'héritage postérieur à sa correction.`, ``);
else {
  L.push(`Comment lire : la section 2 retournée par produit. Une ligne par produit relevé, triée par retard décroissant ; *en retard* compte les classes corrigées au pilot dont l'artefact porteur n'est pas conforme chez ce produit ; le *retard* est l'âge en jours de la plus ancienne de ces corrections, mesuré contre l'état des sources. La recopie de l'héritage se fait à l'ouverture d'une session chez le produit : cette liste dit lequel ouvrir.`, ``,
    `| Produit | Classes atteintes | Classes en retard | Retard max (j) | Classes en retard, de la plus ancienne à la plus récente |`, `|---|---|---|---|---|`);
  for (const l of lignesProduits) L.push(`| ${l.produit} | ${l.atteints} | ${l.enRetard.length} | ${l.enRetard.length ? l.retardMax : "—"} | ${l.enRetard.sort((a, b) => a.correction.localeCompare(b.correction) || a.classe.localeCompare(b.classe)).map((x) => `\`${x.classe}\` (${x.correction})`).join(", ") || "—"} |`);
  L.push(``, `- Couples produit × classe non atteints : ${couplesNonAtteints}.`,
    `- Produits en retard de plus de ${SEUIL_JOURS} jours : ${produitsARelancer.length ? produitsARelancer.map((l) => l.produit).join(", ") : "aucun"}.`);
  if (produitsARelancer.length) L.push(`- Relance PROPOSÉE, jamais jouée d'office : \`node todo\\emettre-travaux.mjs --produit <nom> --essai\` rend le lot sans rien écrire ; sans \`--essai\`, le lot est déposé dans la boîte d'entrée du produit, et rien d'autre n'est écrit chez lui. L'ouverture de la session reste un geste humain.`);
  L.push(``);
}

L.push(`## 6. Stock des items ouverts et contre-mesure du débit`, ``,
  `Comment lire : le stock à l'état des sources, puis les items ouverts depuis plus de ${SEUIL_JOURS} jours, puis le débit des 4 dernières semaines ISO — *émises* compte les items entrés au registre, *tranchées* ceux qui sont sortis de \`candidat\` (décidés ou écartés). Un stock qui monte deux semaines de suite demande une relecture du dispositif, pas une sonde de plus.`, ``,
  `- Stock : ${stockCandidats} candidat(s) en attente de décision, ${stockDecides} item(s) décidé(s) ou en cours, non clos.`,
  `- Ouverts depuis plus de ${SEUIL_JOURS} jours : ${ouvertsAges.length}${ouvertsAges.length ? ` — ${ouvertsAges.map((s) => `${s.id} (${s.statut}, ${s.age} j)`).join(", ")}` : ""}.`, ``,
  `| Semaine | Émises | Tranchées |`, `|---|---|---|`);
for (const [s, f] of dernieresSemaines) L.push(`| ${s} | ${f.emises} | ${f.tranchees} |`);
if (!dernieresSemaines.length) L.push(`| (aucune) | | |`);
L.push(``);

L.push(`## 7. Silence des sources de retours`, ``);
if (!retoursLus) L.push(`Non mesurable : la boîte des lots de retours est introuvable (\`--retours\`).`, ``);
else {
  L.push(`Comment lire : une ligne par source ayant remis au moins un lot, triée par silence décroissant ; le *silence* est le nombre de jours entre son dernier lot et l'état des sources. Une source sans activité n'a rien à remonter : la mesure ne distingue pas ce cas d'un oubli, et le dit.`, ``,
    `| Source | Dernier lot | Silence (j) |`, `|---|---|---|`);
  for (const s of silences) L.push(`| ${s.source} | ${s.date} | ${s.silence} |`);
  if (!silences.length) L.push(`| (aucune source) | | |`);
  L.push(``, `- Sources muettes depuis plus de ${SEUIL_JOURS} jours : ${sourcesSilencieuses.length} sur ${silences.length}.`, ``);
}

L.push(`## Ce que cette vue ne juge pas`, ``,
  `- qu'un produit en retard soit FAUTIF : un produit que personne n'a ouvert depuis la correction n'a pas pu la recevoir — la section 5 nomme, elle ne condamne pas ;`,
  `- qu'une source muette ait quelque chose à remonter : la section 7 lit des noms de fichiers, pas l'activité du produit ;`,
  `- la JUSTESSE d'une classe déclarée par un producteur : un retour mal classé est une récidive manquée, et seule une revue des classes (BOUCLE-AMELIORATION.md) la voit ;`,
  `- la descente d'une règle qui ne vit dans aucun artefact hérité : elle est déclarée non mesurable, jamais supposée faite ;`,
  `- les items antérieurs au 03/09/2026 sans classe : ils ne comptent ni comme items ni comme récidives — la mesure du pas 0 (output/03-etudes) les a lus une fois, à la main.`, ``);
writeFileSync(OUT, L.join("\n"), "utf8");
if (JSON_OUT) {
  // Les compteurs que la sonde surveille. `produits_non_equipes` = produits du dernier relevé sans
  // lanceur de hooks (ils ne reçoivent aucune descente) ; `manques_heritage` = total des manques.
  const produitsNonEquipes = dernier ? (dernier.produits || []).filter((p) => (p.artefacts || []).some((a) => /hooks\/factory\.mjs$/.test(a.cible || "") && a.etat === "absent")).length : null;
  const manques = dernier ? (dernier.produits || []).reduce((n, p) => n + (p.absents || 0) + (p.divergents || 0) + (p.incomplets || 0), 0) : null;
  const compteurs = {
    outil: "generer-recidives", etat_au: tsMax || null,
    items: items.length, items_classes: avecClasse.length, recidives: recidives.length,
    classes: classes.size, familles: familles.size, classes_sans_fondateur: sansFondateur.length, retours_classe_suspecte: suspectes.length,
    releves: releves.length, produits_releves: dernier ? (dernier.produits || []).length : null,
    produits_non_equipes: produitsNonEquipes, manques_heritage: manques,
    // TF-1163 (17/09/2026) : les grandeurs où l'étude a mesuré le retard — `null` quand non mesurable.
    couples_non_atteints: lignesProduits.length ? couplesNonAtteints : null,
    produits_en_retard: lignesProduits.length ? produitsARelancer.length : null,
    stock_candidats: stockCandidats, stock_decides_non_clos: stockDecides, items_ouverts_vieux: ouvertsAges.length,
    sources_silencieuses: retoursLus ? sourcesSilencieuses.length : null,
    // TF-1166 (D-3 (a), 17/09/2026) : les noms, pour la ligne du relevé d'ouverture du pilot — la sonde ne lit que le compte.
    sources_muettes: retoursLus ? sourcesSilencieuses.map((s) => ({ source: s.source, silence: s.silence })) : null,
    seuil_jours: SEUIL_JOURS,
  };
  writeFileSync(JSON_OUT, JSON.stringify(compteurs, null, 1) + "\n", "utf8");
  console.log(JSON.stringify(compteurs));
} else {
  console.log(`${OUT} : ${classes.size} classe(s), ${recidives.length} récidive(s), ${releves.length} relevé(s) — état au ${tsMax || "(vide)"}`);
}
