#!/usr/bin/env node
/**
 * indicateurs-agents.test.mjs — les quatre paires d'indicateurs des agents, calculées contre une base et un seuil lus au référentiel, dans
 * les deux sens (D-219 (e) du 15/11/2026, TF-2563, mandat 20261115b, lot L4).
 *   VERT  : les 8 indicateurs valent leur compte exact sur des fiches, frictions, ledger et relevé de suivi connus (fiche hors fenêtre
 *           écartée, médiane de relever-flotte, part au pilot comptée au délai et non au gardien) ; un seuil tenu à l'égalité du plancher ;
 *           une base absente rend « base à poser » sans évaluer un seuil relatif à la base ; la comparaison appariée ne tient que les types
 *           de la base ; le référentiel du dépôt se lit, porte les 4 paires et la base datée de la première mesure ; la page se réécrit à
 *           chaque appel, se déroute par FORGE_PAGE_INDICATEURS_AGENTS et ne cite aucun dossier de produit ; le relevé de suivi réel
 *           (un profil synthétique) donne P4 ; le point d'entrée rend 0 et du JSON.
 *   ROUGE : un plancher franchi rend ALERTE et une ligne d'alerte, en absolu comme à la base moins sa tolérance (5 points, 0 point) ;
 *           aucun verdict noté, aucune session, un relevé de suivi illisible et aucun agent des types de la base rendent « non mesurable »
 *           avec leur raison, jamais une valeur ; un référentiel absent, d'un autre schéma, à mesure inconnue, à seuil de délai ou à seuil
 *           invalide rend 2 sans écrire la page ; le référentiel n'est jamais réécrit ; option inconnue, --jours ou --depuis invalides : 2 ;
 *           un agent de 35 minutes sans point de suivi franchit le plancher de P4 ; le banc n'écrit aucun fichier réel du pilot.
 * Fichiers jetables sous le répertoire temporaire ; aucun fichier du pilot n'est écrit. Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { calculer, executer, lireFrictions, lireReferentiel, MESURES, PAGE, REFERENTIEL_DEFAUT, SCHEMA_REFERENTIEL, sourcesDesFrictions, VARIABLE_PAGE } from "./indicateurs-agents.mjs";
import { SCHEMA } from "../oracles/lib-fiches-agents.mjs";
import { SCHEMA_VERDICT } from "./noter-fiche.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const SCRIPT = join(ICI, "indicateurs-agents.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };
const pres = (a, b) => Math.abs(a - b) < 1e-9;
const etatDe = (f) => (existsSync(f) ? `${statSync(f).size}:${statSync(f).mtimeMs}` : "absent");
const REELS = [join(PILOT, "todo", "observabilite", "fiches-agents.jsonl"), join(PILOT, ".claude", "frictions.jsonl"), REFERENTIEL_DEFAUT, join(PILOT, ...PAGE.split("/"))];
const avantReels = REELS.map(etatDe);

const base = mkdtempSync(join(tmpdir(), "indicateurs-agents-"));
const ENV = { ...process.env, FORGE_CONTEXTE_BANC: "1" };
delete ENV.FORGE_FICHES_AGENTS;
delete ENV[VARIABLE_PAGE];
const MAINTENANT = new Date("2026-11-15T12:00:00.000Z");
const DEPUIS = "2026-11-01T12:00:00.000Z";
let n = 0;
const ecrire = (f, lignes) => { mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, lignes.map((l) => (typeof l === "string" ? l : JSON.stringify(l))).join("\n") + "\n", "utf8"); return f; };

/** Un référentiel jetable, à la forme de celui du dépôt ; `modif` le retouche. */
const REF = () => ({ schema: SCHEMA_REFERENTIEL, version: "0.0.1", date: "2026-11-15", fenetre_jours: 14, paires: [
  { id: "P1", delai: { id: "P1-delai", libelle: "Durée médiane", mesure: "duree_mediane_agent", base: null, seuil: null },
    qualite: { id: "P1-qualite", libelle: "Part PASS", mesure: "part_livrables_pass", base: null, seuil: { type: "plancher_base", tolerance_points: 0 } } },
  { id: "P2", delai: { id: "P2-delai", libelle: "Jetons médians", mesure: "jetons_medians_agent", base: null, seuil: null },
    qualite: { id: "P2-qualite", libelle: "Part sert", mesure: "part_relectures_sert", base: null, seuil: { type: "plancher_base", tolerance_points: 5 } } },
  { id: "P3", delai: { id: "P3-delai", libelle: "Frictions par session", mesure: "frictions_par_session", base: null, seuil: null },
    qualite: { id: "P3-qualite", libelle: "Part des frictions suivies", mesure: "part_frictions_suivies_retour", base: null, seuil: { type: "plancher", valeur: 0.5 } } },
  { id: "P4", delai: { id: "P4-delai", libelle: "Délai du premier point", mesure: "delai_premier_point_suivi", base: null, seuil: null },
    qualite: { id: "P4-qualite", libelle: "Part des agents suivis", mesure: "part_agents_suivis", base: null, seuil: { type: "plancher", valeur: 0.8 } } },
] });
const refFichier = (modif = () => {}) => { const r = REF(); modif(r); const f = join(base, `ref-${++n}.json`); writeFileSync(f, JSON.stringify(r, null, 1), "utf8"); return f; };
const paireDe = (r, id) => r.paires.find((p) => p.id === id);

/** Une fiche à la forme du lot L1 ; un verdict à la forme du lot L2. */
const fiche = (id, plus = {}) => ({ schema: SCHEMA, ts: "2026-11-10T09:00:00.000Z", session: "aaaa1111", session_source: "hook", agent_id: id, type: "campagne",
  modele: "claude-sonnet-5-5", effort: "high", duree_s: 60, jetons_entree: 1000, jetons_sortie: 100, appels_outils: 3, verdict_livrable: null, verdict_relecture: null,
  frictions: 0, cause_fin: "fini", projet: "digit-ai-factory", partielle: false, lacunes: [], ...plus });
const verdict = (id, vl, vr) => ({ schema: SCHEMA_VERDICT, ts: "2026-11-10T10:00:00.000Z", agent_id: id, verdict_livrable: vl, verdict_relecture: vr, session: "eeee5555", session_source: "hook" });
const friction = (session, ts) => ({ ts, session: `${session}-0000-4000-8000-000000000000`, type: "refus_hook", extrait: "banc", outil: "Bash" });
const agentSuivi = (verdict, points, premier, plus = {}) => ({ id: `s${++n}`, nom: "banc", courseMin: 30, fini: true, points: points.map((m) => `2026-11-15T10:${String(m).padStart(2, "0")}:00.000Z`),
  ecarts: premier === null ? [{ de: "lancement", a: "fin", min: 30 }] : [{ de: "lancement", a: "point", min: premier }, { de: "point", a: "fin", min: 10 }], verdict, cause: null, ...plus });
const suiviFichier = (agents) => { const f = join(base, `suivi-${++n}.json`); writeFileSync(f, JSON.stringify({ oracle: "oracle-suivi-agents", sessions: [{ agents }] }), "utf8"); return f; };

/** L'arbre de référence : un pilot et un produit au nom de banc, sous un parc jetable. */
const PARC = join(base, "parc");
const RACINE = join(PARC, "pilot-banc");
const PRODUIT = join(PARC, "produit-banc-confidentiel");
ecrire(join(RACINE, "todo", "observabilite", "fiches-agents.jsonl"), [
  fiche("a0", { ts: "2026-10-01T09:00:00.000Z", duree_s: 99999 }),
  fiche("a1", { duree_s: 100, jetons_entree: 1000, jetons_sortie: 100 }),
  fiche("a2", { duree_s: 300, jetons_entree: 3000, jetons_sortie: 300 }),
  fiche("a3", { session: "bbbb2222", type: "verificateur", duree_s: 200, jetons_entree: 2000, jetons_sortie: 200 }),
  fiche("a4", { session: "bbbb2222", type: "explorateur", duree_s: 50, jetons_entree: null, jetons_sortie: null, partielle: true }),
  verdict("a1", "PASS", "sert"), verdict("a2", "FAIL", "sert"), verdict("a3", "PASS", "derive"),
]);
ecrire(join(RACINE, ".claude", "frictions.jsonl"), [
  friction("aaaa1111", "2026-11-10T10:00:00.000Z"), friction("aaaa1111", "2026-11-10T11:00:00.000Z"),
  friction("cccc3333", "2026-11-10T11:00:00.000Z"), friction("aaaa1111", "2026-10-20T11:00:00.000Z"),
]);
ecrire(join(PRODUIT, "forge", "frictions.jsonl"), [
  friction("bbbb2222", "2026-11-12T10:00:00.000Z"), friction("bbbb2222", "2026-11-12T12:00:00.000Z"), friction("bbbb2222", "2026-11-10T08:00:00.000Z"),
]);
ecrire(join(PRODUIT, "forge", "ledger.jsonl"), [
  { seq: 1, ts: "2026-11-09T08:00:00Z", type: "retour", constat: "non signé" },
  { seq: 2, ts: "2026-11-11T09:00:00Z", type: "note", session: "zzzz9999", session_source: "session_start" },
  { seq: 3, ts: "2026-11-12T10:30:00Z", type: "retour", session: "bbbb2222", session_source: "session_start" },
  { seq: 4, ts: "2026-11-12T12:30:00Z", type: "retour", session: "dddd4444", session_source: "session_start" },
]);
const SUIVI = suiviFichier([agentSuivi("PASS", [14, 29], 14), agentSuivi("FAIL", [16], 16), agentSuivi("FAIL", [], null, { cause: "hook_absent" }),
  agentSuivi("PASS", [55], null), agentSuivi("SANS_OBJET", [], null)]);
const jouer = (args, { env = ENV, maintenant = MAINTENANT } = {}) => executer(["--json", "--racine", RACINE, "--parc", PARC, ...args], env, maintenant);
const indic = (r, id) => r.paires.flatMap((p) => [p.delai, p.qualite]).find((q) => q.id === id);

try {
  check("vert — les 8 indicateurs valent leur compte exact (fiche hors fenêtre écartée, médiane de relever-flotte, friction au pilot comptée au délai seul)", () => {
    const page = join(base, "page-1.md");
    const x = jouer(["--referentiel", refFichier(), "--suivi", SUIVI, "--page", page]);
    att(x.code === 0, `exit ${x.code} : ${x.sortie}`);
    const r = x.resultat;
    att(indic(r, "P1-delai").valeur === 200 && indic(r, "P1-delai").n === 4, `P1 délai : ${JSON.stringify(indic(r, "P1-delai"))}`);
    att(pres(indic(r, "P1-qualite").valeur, 2 / 3) && indic(r, "P1-qualite").n === 3, `P1 qualité : ${indic(r, "P1-qualite").valeur}`);
    att(indic(r, "P2-delai").valeur === 2200 && indic(r, "P2-delai").n === 3, `P2 délai : ${JSON.stringify(indic(r, "P2-delai"))}`);
    att(pres(indic(r, "P2-qualite").valeur, 2 / 3), `P2 qualité : ${indic(r, "P2-qualite").valeur}`);
    att(indic(r, "P3-delai").valeur === 2.5 && indic(r, "P3-delai").n === 2 && indic(r, "P3-delai").detail.frictions === 5, `P3 délai : ${JSON.stringify(indic(r, "P3-delai"))}`);
    const p3 = indic(r, "P3-qualite");
    att(p3.valeur === 0.5 && p3.n === 2 && p3.detail.suivies === 1 && p3.detail.au_pilot === 2 && p3.detail.produits_sans_signature === 1, `P3 qualité : ${JSON.stringify(p3)}`);
    att(indic(r, "P4-delai").valeur === 16 && indic(r, "P4-delai").n === 2, `P4 délai : ${JSON.stringify(indic(r, "P4-delai"))}`);
    att(indic(r, "P4-qualite").valeur === 0.75 && indic(r, "P4-qualite").n === 4, `P4 qualité : ${JSON.stringify(indic(r, "P4-qualite"))}`);
  });
  check("vert — un seuil tenu à l'égalité du plancher (P3 : 50 % pour un plancher de 50 %) ; rouge — P4 à 75 % sous 80 % : ALERTE et une ligne d'alerte", () => {
    const r = jouer(["--referentiel", refFichier(), "--suivi", SUIVI, "--page", join(base, "page-2.md")]).resultat;
    att(indic(r, "P3-qualite").etat === "tenu" && !indic(r, "P3-qualite").franchi, `P3 : ${indic(r, "P3-qualite").etat}`);
    att(indic(r, "P4-qualite").etat === "franchi" && r.verdict === "ALERTE" && r.seuils.franchis === 1, `P4 : ${indic(r, "P4-qualite").etat}, verdict ${r.verdict}`);
    att(/^indicateurs des agents \(D-219 \(e\).*\*\*1 seuil\(s\) franchi\(s\)\*\* — P4-qualite « Part des agents suivis » 75,0 % pour un plancher de 80,0 % \(4 agent\(s\) jugé\(s\)\).*commit motivé$/.test(r.ligne_alerte), r.ligne_alerte);
  });
  check("vert — P4 à 80 % exactement (4 suivis sur 5) : tenu, verdict TENU, aucune ligne d'alerte", () => {
    const s = suiviFichier([agentSuivi("PASS", [14], 14), agentSuivi("PASS", [15], 15), agentSuivi("PASS", [13], 13), agentSuivi("PASS", [40], null), agentSuivi("FAIL", [], null)]);
    const r = jouer(["--referentiel", refFichier(), "--suivi", s, "--page", join(base, "page-3.md")]).resultat;
    att(pres(indic(r, "P4-qualite").valeur, 0.8) && indic(r, "P4-qualite").etat === "tenu" && r.verdict === "TENU" && r.ligne_alerte === null, `${indic(r, "P4-qualite").valeur} ${indic(r, "P4-qualite").etat} ${r.verdict} ${r.ligne_alerte}`);
  });
  check("vert — une base absente rend « base à poser » : le seuil relatif à la base n'est pas évalué, rien n'est franchi (P1, P2)", () => {
    const r = jouer(["--referentiel", refFichier(), "--suivi", SUIVI, "--page", join(base, "page-4.md")]).resultat;
    for (const id of ["P1-delai", "P1-qualite", "P2-delai", "P2-qualite"]) att(indic(r, id).etat === "base à poser" && !indic(r, id).franchi && indic(r, id).plancher === null, `${id} : ${indic(r, id).etat}`);
  });
  check("rouge — plancher à la base moins 5 points (P2, 66,7 %) : base 70 % tenue, base 75 % franchie", () => {
    const tenu = jouer(["--referentiel", refFichier((r) => { paireDe(r, "P2").qualite.base = { valeur: 0.7, n: 3, mesuree_le: "2026-11-15T00:00:00.000Z" }; }), "--suivi", SUIVI, "--page", join(base, "page-5.md")]).resultat;
    att(indic(tenu, "P2-qualite").etat === "tenu" && pres(indic(tenu, "P2-qualite").plancher, 0.65), `base 70 % : ${indic(tenu, "P2-qualite").etat} plancher ${indic(tenu, "P2-qualite").plancher}`);
    const franchi = jouer(["--referentiel", refFichier((r) => { paireDe(r, "P2").qualite.base = { valeur: 0.75, n: 3, mesuree_le: "2026-11-15T00:00:00.000Z" }; }), "--suivi", SUIVI, "--page", join(base, "page-6.md")]).resultat;
    att(indic(franchi, "P2-qualite").etat === "franchi" && /P2-qualite/.test(franchi.ligne_alerte), `base 75 % : ${indic(franchi, "P2-qualite").etat}`);
  });
  check("rouge — plancher à la base sans tolérance (P1, 66,7 %) : base 66 % tenue, base 70 % franchie", () => {
    const tenu = jouer(["--referentiel", refFichier((r) => { paireDe(r, "P1").qualite.base = { valeur: 0.66, n: 3 }; }), "--suivi", SUIVI, "--page", join(base, "page-7.md")]).resultat;
    const franchi = jouer(["--referentiel", refFichier((r) => { paireDe(r, "P1").qualite.base = { valeur: 0.7, n: 3 }; }), "--suivi", SUIVI, "--page", join(base, "page-8.md")]).resultat;
    att(indic(tenu, "P1-qualite").etat === "tenu" && indic(franchi, "P1-qualite").etat === "franchi", `${indic(tenu, "P1-qualite").etat} / ${indic(franchi, "P1-qualite").etat}`);
  });
  check("vert — comparaison appariée : la base de type « campagne » ne compare que les agents campagne (300 s pour 150 s : +2 min 30 s)", () => {
    const r = jouer(["--referentiel", refFichier((x) => { paireDe(x, "P1").delai.base = { valeur: 150, n: 2, types: ["campagne"], mesuree_le: "2026-11-15T00:00:00.000Z" }; }), "--suivi", SUIVI, "--page", join(base, "page-9.md")]).resultat;
    const q = indic(r, "P1-delai");
    att(q.valeur === 200 && q.valeur_appariee === 300 && q.n_apparie === 2 && q.ecart === 150 && q.etat === "comparé à la base", JSON.stringify(q));
    att(/comparé à la base : \+2 min 30 s/.test(readFileSync(join(base, "page-9.md"), "utf8")), "la page ne dit pas l'écart à la base");
  });
  check("rouge — aucun agent des types de la base : « non mesurable » avec sa raison, jamais la valeur de toute la population", () => {
    const r = jouer(["--referentiel", refFichier((x) => { paireDe(x, "P1").delai.base = { valeur: 150, n: 2, types: ["redacteur"] }; }), "--suivi", SUIVI, "--page", join(base, "page-10.md")]).resultat;
    const q = indic(r, "P1-delai");
    att(q.etat === "non mesurable" && q.valeur_comparee === null && /aucun agent des types de la base \(redacteur\)/.test(q.raison), JSON.stringify(q));
  });
  check("rouge — aucun verdict noté, aucune session, relevé de suivi illisible : « non mesurable » avec sa raison, aucune valeur inventée", () => {
    const racine = join(base, "parc-vide", "pilot-sans-verdict");
    ecrire(join(racine, "todo", "observabilite", "fiches-agents.jsonl"), [fiche("v1", { session: null }), fiche("v2", { session: null })]);
    const suiviCasse = join(base, "suivi-casse.json"); writeFileSync(suiviCasse, "{ pas du json", "utf8");
    const page = join(base, "page-11.md");
    const r = executer(["--json", "--racine", racine, "--referentiel", refFichier(), "--suivi", suiviCasse, "--page", page], ENV, MAINTENANT).resultat;
    for (const id of ["P1-qualite", "P2-qualite", "P3-delai", "P3-qualite", "P4-delai", "P4-qualite"]) att(indic(r, id).etat === "non mesurable" && indic(r, id).valeur === null && indic(r, id).raison, `${id} : ${JSON.stringify(indic(r, id))}`);
    att(/aucun verdict de livrable/.test(indic(r, "P1-qualite").raison) && /aucune session/.test(indic(r, "P3-delai").raison) && /relevé de suivi désigné illisible/.test(indic(r, "P4-qualite").raison), "raisons");
    att(r.verdict === "NON_EVALUE" && r.ligne_alerte === null, `verdict ${r.verdict}`);
    att((readFileSync(page, "utf8").match(/\| non mesurable \|\n/g) || []).length === 6, "la page ne dit pas « non mesurable » à l'état de six indicateurs");
  });
  check("vert — P3 : un retour signé de la même session, à l'heure de la friction ou après, la suit ; un retour d'une autre session ou antérieur, non ; une friction d'avant la signature n'est pas jugée", () => {
    const fr = lireFrictions(sourcesDesFrictions({ racine: RACINE, parc: PARC }));
    att(fr.fichiers === 2 && fr.ledgers === 1 && fr.frictions.length === 7, JSON.stringify({ fichiers: fr.fichiers, ledgers: fr.ledgers, n: fr.frictions.length }));
    const r = calculer({ agents: [{ session: "bbbb2222", type: "campagne" }], frictions: fr.frictions, suivi: null, referentiel: REF(), depuisIso: DEPUIS, maintenant: MAINTENANT });
    const q = indic(r, "P3-qualite");
    att(q.n === 2 && q.detail.suivies === 1 && q.detail.produits_sans_signature === 1 && q.detail.au_pilot === 0, JSON.stringify(q));
  });
  check("rouge — un référentiel absent, d'un autre schéma, à mesure inconnue, à seuil de délai ou à seuil invalide rend 2, et la page n'est pas écrite", () => {
    const cas = [["absent", join(base, "absent.json")],
      ["schéma", refFichier((r) => { r.schema = "pilot/autre@1"; })],
      ["mesure inconnue", refFichier((r) => { paireDe(r, "P2").delai.mesure = "jetons_inventes"; })],
      ["seuil de délai", refFichier((r) => { paireDe(r, "P1").delai.seuil = { type: "plancher", valeur: 10 }; })],
      ["seuil invalide", refFichier((r) => { paireDe(r, "P3").qualite.seuil = { type: "plancher" }; })],
      ["base invalide", refFichier((r) => { paireDe(r, "P4").qualite.base = { valeur: "quatre-vingts" }; })]];
    for (const [nom, f] of cas) {
      const page = join(base, `page-refus-${nom.replace(/\W+/g, "-")}.md`);
      const x = jouer(["--referentiel", f, "--suivi", SUIVI, "--page", page]);
      att(x.code === 2 && /référentiel illisible/.test(x.sortie) && !existsSync(page), `${nom} : exit ${x.code}, page ${existsSync(page)} — ${x.sortie}`);
    }
  });
  check("rouge — le référentiel n'est jamais réécrit : mêmes octets et même date de modification après deux appels, base absente et valeur mesurable", () => {
    const f = refFichier();
    const avant = readFileSync(f), date = statSync(f).mtimeMs;
    jouer(["--referentiel", f, "--suivi", SUIVI, "--page", join(base, "page-12.md")]);
    jouer(["--referentiel", f, "--suivi", SUIVI, "--page", join(base, "page-12.md")], { maintenant: new Date("2026-11-16T12:00:00.000Z") });
    att(Buffer.compare(avant, readFileSync(f)) === 0 && statSync(f).mtimeMs === date, "le référentiel a été réécrit");
  });
  check("vert — la page se réécrit à chaque appel, se déroute par FORGE_PAGE_INDICATEURS_AGENTS, et ne cite aucun dossier de produit", () => {
    const deroutee = join(base, "deroutee", "page.md");
    const env = { ...ENV, [VARIABLE_PAGE]: deroutee };
    const x1 = executer(["--json", "--racine", RACINE, "--parc", PARC, "--referentiel", refFichier(), "--suivi", SUIVI], env, MAINTENANT);
    const t1 = readFileSync(deroutee, "utf8");
    const x2 = executer(["--json", "--racine", RACINE, "--parc", PARC, "--referentiel", refFichier(), "--suivi", SUIVI], env, new Date("2026-11-15T13:30:00.000Z"));
    const t2 = readFileSync(deroutee, "utf8");
    att(x1.resultat.page.ecrite && x2.resultat.page.ecrite && t1 !== t2 && /Mesure du 2026-11-15 \d\d:30/.test(t2), "la page n'est pas réécrite au second appel");
    att(!existsSync(join(RACINE, ...PAGE.split("/"))), "la page par défaut a été écrite malgré le déroutement");
    att(/^# Indicateurs des agents/.test(t2) && /\| Paire \| Rôle \| Indicateur \| Valeur \| Base \| Seuil \| État \|/.test(t2) && /\*\*Verdict : ALERTE\*\*/.test(t2), "forme de la page");
    att(!/produit-banc-confidentiel/.test(t2 + x2.sortie), "un dossier de produit est cité dans la page ou la sortie");
    const x3 = executer(["--racine", RACINE, "--parc", PARC, "--referentiel", refFichier(), "--suivi", SUIVI], ENV, MAINTENANT);
    att(existsSync(join(RACINE, ...PAGE.split("/"))) && new RegExp(`page : ${PAGE.replace(/\//g, "\\/")} réécrite`).test(x3.sortie), `sans déroutement, la page s'écrit sous la racine : ${x3.sortie.split("\n").pop()}`);
  });
  check("vert — le relevé de suivi réel, sur un profil synthétique : un agent de 35 minutes suivi à 15 et 30 minutes donne P4 à 100 % ; rouge — sans point, P4 franchit son plancher", () => {
    const profil = (nom, points) => {
      const p = join(base, `profil-${nom}`), d = join(p, "projects", "projet-banc"), sid = `banc-${nom}`;
      mkdirSync(join(d, sid, "subagents"), { recursive: true });
      const T0 = Date.now() - 40 * 60000, iso = (m) => new Date(T0 + m * 60000).toISOString();
      const lignes = [JSON.stringify({ type: "user", timestamp: iso(0), message: { role: "user", content: "Lance le banc." } })];
      for (const m of points) lignes.push(JSON.stringify({ type: "assistant", timestamp: iso(m), message: { role: "assistant", content: [{ type: "text", text: "Suivi agents\n- banc · actif (preuve de vie il y a 1 min) · faits : a · restants : b" }] } }));
      lignes.push(JSON.stringify({ type: "assistant", timestamp: iso(36), message: { role: "assistant", content: [{ type: "text", text: "Fini." }] } }));
      writeFileSync(join(d, `${sid}.jsonl`), lignes.join("\n") + "\n", "utf8");
      writeFileSync(join(d, sid, "subagents", "agent-banc01.jsonl"), [JSON.stringify({ type: "user", timestamp: iso(0.2), message: { role: "user", content: "banc" } }),
        JSON.stringify({ type: "assistant", timestamp: iso(35), message: { role: "assistant", content: [{ type: "text", text: "fini" }] } })].join("\n") + "\n", "utf8");
      writeFileSync(join(d, sid, "subagents", "agent-banc01.meta.json"), JSON.stringify({ description: "banc", agentType: "campagne", finished: true }), "utf8");
      return p;
    };
    const env = ENV;   // l'état du hook de suivi n'est que lu (lireEtat), jamais écrit : une session de banc n'en a aucun
    const maintenant = new Date();
    const suivi = executer(["--json", "--racine", RACINE, "--parc", PARC, "--referentiel", refFichier(), "--profils", profil("suivi", [15.3, 30.4]), "--page", join(base, "page-13.md")], env, maintenant).resultat;
    att(indic(suivi, "P4-qualite").valeur === 1 && indic(suivi, "P4-qualite").n === 1 && indic(suivi, "P4-qualite").etat === "tenu", JSON.stringify(indic(suivi, "P4-qualite")));
    att(Math.abs(indic(suivi, "P4-delai").valeur - 15.1) < 0.051, `délai du premier point : ${indic(suivi, "P4-delai").valeur}`);
    const muet = executer(["--json", "--racine", RACINE, "--parc", PARC, "--referentiel", refFichier(), "--profils", profil("muet", []), "--page", join(base, "page-14.md")], env, maintenant).resultat;
    att(indic(muet, "P4-qualite").valeur === 0 && indic(muet, "P4-qualite").etat === "franchi" && indic(muet, "P4-delai").etat === "non mesurable", JSON.stringify(indic(muet, "P4-qualite")));
    att(!/banc-muet|projet-banc/.test(JSON.stringify(muet)), "le relevé de suivi recopie un chemin ou un nom de transcription dans la sortie");
  });
  check("rouge — option inconnue, --jours 0 et --depuis illisible : 2, rien n'est calculé", () => {
    for (const args of [["--inconnue"], ["--jours", "0"], ["--depuis", "hier"], ["--referentiel"]]) {
      const x = executer(args, ENV, MAINTENANT);
      att(x.code === 2 && !x.resultat, `${args.join(" ")} : exit ${x.code}`);
    }
  });
  check("vert — le point d'entrée rend 0 et du JSON lisible ; rouge — une option inconnue y rend 2 sur la sortie d'erreur", () => {
    const ok = spawnSync(process.execPath, [SCRIPT, "--json", "--racine", RACINE, "--parc", PARC, "--referentiel", refFichier(), "--suivi", SUIVI, "--page", join(base, "page-15.md")], { encoding: "utf8", env: ENV });
    const j = JSON.parse(ok.stdout);
    att(ok.status === 0 && j.outil === "indicateurs-agents" && j.paires.length === 4 && j.verdict === "ALERTE", `exit ${ok.status} ${ok.stderr}`);
    const ko = spawnSync(process.execPath, [SCRIPT, "--inconnue"], { encoding: "utf8", env: ENV });
    att(ko.status === 2 && /option inconnue/.test(ko.stderr), `exit ${ko.status} : ${ko.stderr}`);
  });
  check("vert — le référentiel du dépôt se lit : 4 paires, une mesure connue par indicateur, aucun seuil de délai, la base datée du jour de la première mesure", () => {
    const lu = lireReferentiel(REFERENTIEL_DEFAUT);
    att(lu.ok, `référentiel du dépôt illisible : ${lu.motif}`);
    att(lu.ref.paires.map((p) => p.id).join(",") === "P1,P2,P3,P4", "paires");
    att(lu.ref.paires.map((p) => `${p.delai.mesure}/${p.qualite.mesure}`).join(",") === Object.keys(MESURES).reduce((acc, k, i, t) => (i % 2 ? acc : [...acc, `${k}/${t[i + 1]}`]), []).join(","), "mesures dans l'ordre de l'étude");
    for (const p of lu.ref.paires) for (const q of [p.delai, p.qualite]) {
      att(q.base && typeof q.base === "object" && /^\d{4}-\d{2}-\d{2}T/.test(String(q.base.mesuree_le)), `${q.id} : base sans date de mesure`);
      att(q.base.valeur !== null || (typeof q.base.non_mesurable === "string" && q.base.non_mesurable.length > 10), `${q.id} : base nulle sans raison de non-mesure`);
    }
    const jours = new Set(lu.ref.paires.flatMap((p) => [p.delai, p.qualite]).map((q) => String(q.base.mesuree_le).slice(0, 10)));
    att(jours.size === 1, `les bases portent ${jours.size} dates de mesure : ${[...jours].join(", ")}`);
  });
  check("rouge — le banc n'a écrit aucun fichier réel du pilot (fiches, frictions, référentiel, page)", () => {
    REELS.forEach((f, i) => att(etatDe(f) === avantReels[i], `${f} : ${avantReels[i]} → ${etatDe(f)}`));
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

console.log(`\nindicateurs-agents : ${pass} PASS, ${fail} FAIL — cas rouges : plancher franchi (absolu, base moins 5 points, base), non mesurable sans valeur inventée, référentiel refusé, référentiel jamais réécrit, usage invalide, agent sans point de suivi`);
process.exit(fail ? 1 : 0);
