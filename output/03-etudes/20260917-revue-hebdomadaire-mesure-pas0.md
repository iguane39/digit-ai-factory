---
role: annexe de mesure (pas 0) de l'étude d'opportunité « revue hebdomadaire de l'existant » du 17/09/2026 — chiffres relevés en lecture seule, commandes et script embarqués pour rejeu
sources_de_verite: [todo/TODO.jsonl, todo/TODO-ARCHIVE.jsonl, todo/RECIDIVES.md (état au 16/09/2026), todo/registre-dette.json, todo/CLASSES.json, scripts/relever-appelants.mjs, input/00-retours (noms de fichiers), transcriptions locales des sessions du pilot]
verifie_le: 2026-09-17
---

# Annexe de mesure — pas 0 de l'étude « revue hebdomadaire de l'existant »

Cette annexe donne les chiffres sur lesquels l'étude du 17/09/2026 fonde son verdict. Ce qu'ils
montrent : le pilot décide et clôt un item en moins d'un jour en médiane, et le retard se loge
dans la descente des corrections chez les produits, où 88 couples produit × classe sur 164 ne
sont pas atteints. Tout a été relevé le 17/09/2026 entre 07:48 et 07:56 (UTC+02:00), en lecture
seule, sur la fenêtre du 20/08/2026 au 17/09/2026 exclu, découpée en 4 semaines de 7 jours.

Le registre est vivant : une autre session y écrivait pendant le relevé. Entre le premier passage
et le rejeu, les items ouverts sont passés de 41 à 48. Les chiffres des semaines closes n'ont pas
bougé.

## 1. Débit du registre par semaine

Le registre absorbe ce qui entre : le stock de candidats en attente de décision ne dépasse pas 17.
Le stock d'items décidés mais non clos, lui, est passé de 3 à 40 en quatre semaines.

Le tableau se lit ligne par ligne, une semaine par ligne, dans l'ordre du temps. Les trois
premières colonnes comptent les premières entrées dans chaque statut ; les deux dernières donnent
le stock à la fin de la semaine. Commande : le script de la section 7, partie 1.

| Semaine | Créés | Décidés | Clos | Écartés | Candidats en stock | Décidés ou en cours, en stock |
|---|---|---|---|---|---|---|
| 20/08 → 27/08 | 289 | 278 | 275 | 8 | 6 | 3 |
| 27/08 → 03/09 | 106 | 105 | 101 | 1 | 6 | 7 |
| 03/09 → 10/09 | 214 | 203 | 171 | 0 | 17 | 39 |
| 10/09 → 17/09 | 150 | 166 | 162 | 3 | 1 | 40 |

## 2. Délais

Au pilot, la médiane de bout en bout est de 0,1 jour. Chez les produits, plus de la moitié des
descentes mesurables ne sont pas constatées.

Le tableau se lit ligne par ligne, un tronçon de la chaîne par ligne, dans l'ordre de la chaîne.
Base : les 709 items clos dans la fenêtre. Commande : script, partie 2.

| Tronçon | Médiane | 90e centile | Maximum |
|---|---|---|---|
| Entrée au registre → décision humaine | 0,0 j | 2,0 j | 6,5 j |
| Décision → clôture | 0,0 j | 1,3 j | 7,6 j |
| Entrée → clôture | 0,1 j | 3,5 j | 8,2 j |

- Items encore ouverts au 17/09 : 48 au rejeu, âge médian 5,4 jours, maximum 23,8 jours, dont 12
  de plus de 7 jours.
- Constat chez le produit → entrée au registre : non mesurable par le registre. La seule approche
  disponible est le silence des sources (section 6).
- Clôture au pilot → descente constatée chez le produit : lue dans `todo\RECIDIVES.md` section 2,
  état au 16/09/2026. Sur 87 classes, 75 sont déclarées non mesurables, parce que leur règle ne
  vit dans aucun artefact hérité ou qu'elles n'ont pas de clôture fondatrice. Les 12 classes
  mesurables donnent 164 couples produit × classe : 76 atteints, 88 non atteints. Le délai maximal
  des couples atteints va de 0 à 28 jours selon la classe. Commande : lecture de la section 2 par
  `node -e`, motif « N produit(s) atteint(s) en X–Y j ; M non atteint(s) ».
- Taux d'héritage au relevé du 16/09/2026, même fichier, section 3 : le gabarit de restitution
  hérité est conforme chez 0 produit sur 11, le gabarit de lot de retours chez 1 sur 11, le
  lanceur de hooks chez 3 sur 11.

## 3. Qualité du traitement

Depuis le 02/09, chaque clôture dit où sa correction est descendue. Avant, rien n'est exploitable
sans relecture.

- Clôtures depuis l'entrée en vigueur de R12 *(règle 12 du registre : une clôture porte sa
  descente)*, le 02/09/2026 à 15:00 Z : 355, dont 355 portent une descente. Répartition : 315
  nomment un oracle, 238 une règle, 11 un digest, 9 se déclarent non mécanisables, plusieurs
  mentions pouvant se cumuler.
- Clôtures antérieures, en prose : 737.
- Récidives : 178 items marqués selon la vue générée du 16/09 ; 185 au décompte du script le
  17/09. Le champ n'existe que depuis le 03/09 : 110 récidives sur 214 items créés la semaine du
  03/09, 75 sur 150 la semaine du 10/09.
- Délai entre la clôture d'un item et la récidive qui le répète : médiane 5,6 jours, maximum
  26,2 jours, sur 582 liens.

## 4. Existant dormant

Le dépôt du pilot porte peu d'objets que rien ne cite : 6 au total, très en dessous de ce que le
mot « nettoyage » laissait attendre.

- Contrôles sans appelant exécutable : 4 sur 55, par `node scripts/relever-appelants.mjs` →
  `verifier-avance-publication.mjs`, `verifier-secours.mjs` et `verifier-verdict-archive.mjs`
  (cités en doctrine seulement), `verifier-jeu-livrables.mjs` (cité nulle part). Le relevé en
  comptait 7 le 14/09/2026.
- Scripts, oracles et générateurs hors recettes : 112 ; cités par aucun autre fichier suivi : 0 ;
  cités par de la doctrine seulement : 1, `scripts/generer-avancement.mjs`.
- Références : 21 ; citée par aucun autre fichier : 1, `references/CONVENTION-RECETTES.md`.
- Gabarits : 18 fichiers sans citation, tous des sceaux d'oracles générés (`.oracles.json` et
  `.oracles-cache.json`). Ce sont des artefacts générés, pas des objets dormants.
- Registre de dette : 64 entrées, dont 15 à instruire et 49 assumées.
- Classe « règle écrite sans oracle qui la joue » : 15 items, dont 2 ouverts.
- Limite déclarée : « cité » ne veut pas dire « exécuté », et « non cité » ne veut pas dire
  « mort ». Un script lancé à la main n'apparaît dans aucune citation. Les forges n'ont pas été
  balayées : `relever-appelants` ne lit que le pilot.

## 5. Interventions humaines

L'humain tranche vite et en bloc. Le geste répété le plus visible est la relance « traite tous
les todos et retours », 3 fois par semaine.

- Passages de candidat à décidé dans la fenêtre : 756, répartis sur 24 jours. Ils passent par des
  mandats globaux et par des sélecteurs de décision.
- Messages humains des sessions du pilot conservées sur ce poste : 127, sur 20 sessions et 21
  jours distincts, du 20/08 au 17/09. Classement par motif, grossier et déclaré tel : 35
  sélecteurs de décision, 3 feux verts d'enregistrement ou de publication, 9 relances mécaniques,
  80 demandes de fond.
- Rapporté à la semaine : 3,0 relances mécaniques, 12,7 décisions ou feux verts.
- Ingestions de lots : 386 dans la fenêtre, dont 315 lots de retours et 70 sidecars de
  candidatures ; 91, 93, 122 puis 80 par semaine. Elles sont lancées par l'agent en session.
- Non mesuré : les ouvertures de session chez les produits, qui déclenchent la recopie des
  artefacts hérités, et les gestes humains dans les forges. Aucun journal ne les compte.

Carte des gestes de la chaîne, une ligne par geste, dans l'ordre de la chaîne. La colonne
« Famille » porte G pour un gate réservé à l'humain par les règles, M pour un geste mécanique,
J pour un jugement.

| Geste | Qui le fait aujourd'hui | Famille | Mesure |
|---|---|---|---|
| Ouvrir une session chez le produit pour qu'il émette ses retours | humain | M | non mesuré ; silence médian des sources 11 jours |
| Juger ce qui mérite d'être remonté | agent du produit | J | 169 lots en 4 semaines |
| Remettre le lot dans la boîte d'arrivée du pilot | agent du produit | M, déjà automatisé | — |
| Ouvrir une session au pilot et demander le traitement | humain | M | 3,0 par semaine |
| Accueillir, ingérer, rapprocher | agent du pilot, bloquant à l'ouverture | M, déjà automatisé | 386 ingestions |
| Décider candidat → décidé | humain | G | 756 passages, 12,7 messages par semaine |
| Donner mandat d'écrire dans une forge | humain | G | non compté séparément |
| Corriger, clore avec descente | agent | J puis M | 709 clôtures |
| Publier (push) | humain | G | 3 feux verts relevés |
| Déposer un lot de travaux chez le produit | agent du pilot, sur demande | M | non compté |
| Ouvrir une session chez le produit pour que la correction y descende | humain | M | non mesuré ; 88 couples sur 164 non atteints |
| Supprimer un fichier | humain | G | — |

## 6. Émission des retours par source

Les sources se taisent plus longtemps qu'au 30/08 : le silence médian est passé de 8 à 11 jours.

- Lots de retours datés dans la fenêtre : 169, venus de 23 sources.
- Sources n'ayant émis qu'un seul jour : 8 sur 23.
- Silence depuis le dernier lot, au 17/09 : médiane 11 jours, maximum 28 jours ; 16 sources sur 23
  se taisent depuis plus de 7 jours.
- Commande : lecture des noms de fichiers de `input\00-retours\` et de son sous-dossier `old\`
  par `node -e`. Limite : un produit sans activité n'a rien à remonter, et son silence n'est pas
  un défaut ; la mesure ne distingue pas les deux cas.

## 7. Script de mesure

Le script ne lit que des fichiers et lance `git ls-files`. Il se rejoue par
`node <script> <racine du pilot>`. Il a été joué deux fois le 17/09/2026 ; les semaines closes
rendent les mêmes chiffres, seuls les compteurs d'items ouverts ont bougé avec le registre.

```js
// Pas 0 — mesures de base de l'étude « revue hebdomadaire de l'existant ». LECTURE SEULE.
// Usage : node pas0.mjs <racine du pilot>
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";

const R = process.argv[2];
const DEB = "2026-08-20", FIN = "2026-09-17";
const lire = f => fs.readFileSync(path.join(R, f), "utf8").split("\n").filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const evs = [...lire("todo/TODO-ARCHIVE.jsonl"), ...lire("todo/TODO.jsonl")].filter(o => o.id).sort((a, b) => a.ts.localeCompare(b.ts));
const med = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) / 2)]; };
const q = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const jours = (a, b) => (new Date(b) - new Date(a)) / 864e5;

// Semaines de la fenêtre : 4 semaines glissantes de 7 jours finissant le 17/09 exclu.
const semaines = [];
for (let i = 0; i < 4; i++) { const d = new Date(DEB + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 7 * i); const f = new Date(d); f.setUTCDate(f.getUTCDate() + 7); semaines.push([d.toISOString().slice(0, 10), f.toISOString().slice(0, 10)]); }

// 1. DÉBIT — première entrée dans chaque statut, par item.
const items = new Map();
for (const e of evs) {
  const it = items.get(e.id) || { id: e.id, hist: [] };
  if (e.ev === "creation") { it.cree = e.ts; it.date_demande = e.date_demande; it.source = e.source; it.demandeur = e.demandeur; it.classe = e.classe; }
  if (e.classe) it.classe = e.classe;
  if (e.recidive_de) it.recidive_de = e.recidive_de;
  if (e.statut) { it.hist.push([e.ts, e.statut]); if (!it["t_" + e.statut]) it["t_" + e.statut] = e.ts; it.statut = e.statut; }
  if (e.descente) it.descente = e.descente;
  if (e.date_correction) it.date_correction = e.date_correction;
  items.set(e.id, it);
}
const tous = [...items.values()].filter(i => i.cree);
console.log("## 1. Débit par semaine (items du registre, actifs + archive) — total items :", tous.length);
console.log("semaine | créés | décidés | clos (corrige) | écartés | stock candidat fin de semaine | stock decide+en_cours fin de semaine");
const statutA = (it, t) => { let s = null; for (const [ts, st] of it.hist) if (ts < t) s = st; return s; };
for (const [a, b] of semaines) {
  const dans = t => t && t >= a && t < b;
  const stock = tous.filter(i => i.cree < b && statutA(i, b + "T00:00:00Z") === "candidat").length;
  const encours = tous.filter(i => ["decide", "en_cours"].includes(statutA(i, b + "T00:00:00Z"))).length;
  console.log(`${a} → ${b} | ${tous.filter(i => dans(i.cree)).length} | ${tous.filter(i => dans(i.t_decide)).length} | ${tous.filter(i => dans(i.t_corrige)).length} | ${tous.filter(i => dans(i.t_ecarte)).length} | ${stock} | ${encours}`);
}

// 2. DÉLAIS — sur les items clos dans la fenêtre.
const clos = tous.filter(i => i.t_corrige && i.t_corrige >= DEB && i.t_corrige < FIN);
const d1 = clos.filter(i => i.t_decide).map(i => jours(i.cree, i.t_decide));
const d2 = clos.filter(i => i.t_decide).map(i => jours(i.t_decide, i.t_corrige));
const d3 = clos.map(i => jours(i.cree, i.t_corrige));
const f = x => x == null ? "—" : x.toFixed(1);
console.log("\n## 2. Délais au pilot, items clos dans la fenêtre (n =", clos.length, "), en jours : médiane | 90e centile | max");
console.log("entrée au registre → décision humaine :", f(med(d1)), "|", f(q(d1, .9)), "|", f(Math.max(...d1)));
console.log("décision → clôture :", f(med(d2)), "|", f(q(d2, .9)), "|", f(Math.max(...d2)));
console.log("entrée → clôture :", f(med(d3)), "|", f(q(d3, .9)), "|", f(Math.max(...d3)));
const ouverts = tous.filter(i => ["candidat", "decide", "en_cours"].includes(i.statut));
const ages = ouverts.map(i => jours(i.cree, FIN + "T00:00:00Z"));
console.log("items encore ouverts au", FIN, ":", ouverts.length, "— âge médian", f(med(ages)), "j, max", f(Math.max(...ages)), "j ; dont > 7 j :", ages.filter(x => x > 7).length);

// 3. QUALITÉ DU TRAITEMENT
const depuisR12 = tous.filter(i => i.t_corrige && i.t_corrige >= "2026-09-02T15:00");
const avecDesc = depuisR12.filter(i => i.descente);
const types = {}; for (const i of avecDesc) { const k = typeof i.descente === "object" ? Object.keys(i.descente).filter(k => ["regle", "oracle", "digest", "non_mecanisable"].includes(k)).join("+") || "autre" : "autre"; types[k] = (types[k] || 0) + 1; }
console.log("\n## 3. Qualité du traitement");
console.log("clôtures depuis R12 (02/09 15:00Z) :", depuisR12.length, "— portant une descente :", avecDesc.length, JSON.stringify(types));
console.log("clôtures antérieures à R12 (prose) :", tous.filter(i => i.t_corrige && i.t_corrige < "2026-09-02T15:00").length);
const recid = tous.filter(i => i.recidive_de);
console.log("items marqués recidive_de :", recid.length, "— dont créés dans la fenêtre :", recid.filter(i => i.cree >= DEB && i.cree < FIN).length);
for (const [a, b] of semaines) console.log("  récidives créées", a, "→", b, ":", recid.filter(i => i.cree >= a && i.cree < b).length, "sur", tous.filter(i => i.cree >= a && i.cree < b).length, "créés");
// classes closes puis récidivées : délai clôture de l'item répété → création de la récidive
const dr = []; for (const i of recid) { const ids = Array.isArray(i.recidive_de) ? i.recidive_de : [i.recidive_de]; for (const x of ids) { const id = typeof x === "string" ? x : x && x.id; const o = id && items.get(id); if (o && o.t_corrige && o.t_corrige < i.cree) dr.push(jours(o.t_corrige, i.cree)); } }
console.log("délai clôture de l'item répété → récidive (n =", dr.length, ") : médiane", f(med(dr)), "j, max", f(dr.length ? Math.max(...dr) : null), "j");

// 4. EXISTANT DORMANT
console.log("\n## 4. Existant dormant");
const suivis = execSync("git ls-files", { cwd: R, encoding: "utf8", maxBuffer: 1e8 }).split("\n").filter(Boolean);
const texte = suivis.filter(p => /\.(mjs|js|json|md|py|yml|yaml|ps1|sh|html)$/.test(p) && !/^(input|output)\//.test(p) && !/TODO(-ARCHIVE)?\.(jsonl|html|md)$/.test(p));
const corpus = texte.map(p => { try { return [p, fs.readFileSync(path.join(R, p), "utf8")]; } catch { return [p, ""]; } });
const cibles = suivis.filter(p => /^(scripts|oracles|todo|gabarits)\/[^/]+\.(mjs|py)$/.test(p) && !/\.test\.mjs$/.test(p));
let sansCitation = [], citeParDocSeul = [];
for (const c of cibles) {
  const base = path.basename(c); const stem = base.replace(/\.(mjs|py)$/, "");
  const cit = corpus.filter(([p, t]) => p !== c && p !== c.replace(/\.mjs$/, ".test.mjs") && t.includes(stem));
  if (!cit.length) sansCitation.push(c);
  else if (cit.every(([p]) => /\.md$/.test(p))) citeParDocSeul.push(c);
}
console.log("scripts/oracles/todo/gabarits *.mjs|*.py hors recettes :", cibles.length);
console.log("  cités par AUCUN autre fichier suivi (hors leur recette) :", sansCitation.length, sansCitation.join(", "));
console.log("  cités par de la doctrine .md seulement (aucun code, hook ni config ne les nomme) :", citeParDocSeul.length);
console.log("   ", citeParDocSeul.join(", "));
const gab = suivis.filter(p => /^gabarits\/[^/]+\.(md|json)$/.test(p));
const gabOrph = gab.filter(g => !corpus.some(([p, t]) => p !== g && t.includes(path.basename(g))));
console.log("gabarits .md|.json :", gab.length, "— cités par aucun autre fichier suivi :", gabOrph.length, gabOrph.join(", "));
const refs = suivis.filter(p => /^references\/[^/]+\.md$/.test(p));
const refOrph = refs.filter(g => !corpus.some(([p, t]) => p !== g && t.includes(path.basename(g))));
console.log("references .md :", refs.length, "— citées par aucun autre fichier suivi :", refOrph.length, refOrph.join(", "));
const dette = JSON.parse(fs.readFileSync(path.join(R, "todo/registre-dette.json"), "utf8")).entrees;
console.log("registre de dette :", dette.length, "entrées —", dette.filter(e => e.statut === "todo").length, "todo,", dette.filter(e => e.statut === "assume").length, "assume");
const cl = JSON.parse(fs.readFileSync(path.join(R, "todo/CLASSES.json"), "utf8")).classes;
const parClasse = k => tous.filter(i => i.classe === k);
for (const k of ["regle-ecrite-sans-oracle-qui-la-joue", "controle-ecrit-non-cable-a-son-etape"]) { const a = parClasse(k); console.log("classe", k, ":", a.length, "items, dont ouverts", a.filter(i => ["candidat", "decide", "en_cours"].includes(i.statut)).length); }
console.log("classes au référentiel :", Array.isArray(cl) ? cl.length : Object.keys(cl).length);

// 5. INTERVENTIONS HUMAINES
console.log("\n## 5. Interventions humaines");
const dec = evs.filter(e => e.date_decision && e.decideur && e.ts >= DEB && e.ts < FIN && e.statut === "decide");
const parJour = {}; for (const e of dec) parJour[e.ts.slice(0, 10)] = (parJour[e.ts.slice(0, 10)] || 0) + 1;
console.log("(G) passages candidat → decide dans la fenêtre :", dec.length, "sur", Object.keys(parJour).length, "jours distincts ; décideurs :", JSON.stringify(dec.reduce((m, e) => (m[e.decideur.slice(0, 40)] = (m[e.decideur.slice(0, 40)] || 0) + 1, m), {})).slice(0, 600));
const ing = [...lire("todo/TODO-ARCHIVE.jsonl"), ...lire("todo/TODO.jsonl")].filter(e => e.ev === "ingestion" && e.ts >= DEB && e.ts < FIN);
console.log("ingestions de lots dans la fenêtre :", ing.length, "— dont retours produits (input/00-retours) :", ing.filter(e => /00-retours/.test(e.fichier || "")).length, ", candidatures (01-candidatures) :", ing.filter(e => /01-candidatures/.test(e.fichier || "")).length);
for (const [a, b] of semaines) console.log("  ingestions", a, "→", b, ":", ing.filter(e => e.ts >= a && e.ts < b).length);
// messages humains des sessions du pilot (transcriptions locales)
const dirT = path.join(os.homedir(), ".claude", "projects", "c--dev-digit-ai-factory");
let msgs = [];
for (const fn of fs.readdirSync(dirT).filter(f => f.endsWith(".jsonl"))) {
  for (const l of fs.readFileSync(path.join(dirT, fn), "utf8").split("\n")) {
    if (!l.includes('"type":"user"')) continue; let o; try { o = JSON.parse(l); } catch { continue; }
    if (o.type !== "user" || o.isSidechain || o.isMeta) continue; const c = o.message && o.message.content;
    let t = typeof c === "string" ? c : Array.isArray(c) ? c.filter(x => x.type === "text").map(x => x.text).join("\n") : "";
    if (Array.isArray(c) && c.some(x => x.type === "tool_result")) continue;
    t = t.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "").replace(/<ide_[\s\S]*?<\/ide_[a-z_]*>/g, "").trim();
    if (!t || /^<(command|local-command|task-notification)/.test(t) || /^\[Request interrupted/.test(t) || /^Base directory for this skill/.test(t) || /^This session is being continued/.test(t)) continue;
    msgs.push({ ts: o.timestamp, t, s: fn });
  }
}
msgs.sort((a, b) => a.ts.localeCompare(b.ts));
const SEL = /^\s*((d-?\s?)?\d{1,3}\s?\(?[a-c]\)?[\s,;.]*|a-?\d{1,3}[\s,;.]*)+$/i;
const G2 = /\b(go\b|pousse|push|enregistre|commit|publie|valide)/i;
const M = /^(continue|poursuis|reprends|traite (tout|tous|toutes)|r[ée]cup[èe]re et traite|ing[èe]re|relance|rejoue|ex[ée]cute (tout|les actions)|fais(-le| tout)|ok\b|oui\b|vas-y)/i;
const fam = m => SEL.test(m.t) ? "G-selecteur" : (m.t.length < 200 && G2.test(m.t)) ? "G-go" : (m.t.length < 200 && M.test(m.t)) ? "M-relance" : "J-demande";
const cpt = {}; for (const m of msgs) { const k = fam(m); cpt[k] = (cpt[k] || 0) + 1; }
console.log("messages humains des sessions du pilot conservées localement :", msgs.length, "— du", msgs[0] && msgs[0].ts.slice(0, 10), "au", msgs.at(-1) && msgs.at(-1).ts.slice(0, 10), "—", new Set(msgs.map(m => m.s)).size, "sessions");
console.log("  classement par motif (grossier, déclaré tel) :", JSON.stringify(cpt));
const jrs = new Set(msgs.map(m => m.ts.slice(0, 10))).size;
console.log("  jours couverts :", jrs, "— M-relance par semaine (extrapolé × 7 / jours) :", f((cpt["M-relance"] || 0) * 7 / jrs), "; G par semaine :", f(((cpt["G-selecteur"] || 0) + (cpt["G-go"] || 0)) * 7 / jrs));
console.log("  exemples M-relance :", msgs.filter(m => fam(m) === "M-relance").slice(0, 12).map(m => JSON.stringify(m.t.slice(0, 70))).join(" · "));
```
