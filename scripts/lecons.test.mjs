#!/usr/bin/env node
/**
 * lecons.test.mjs — la table des leçons jugée, et la leçon qui récidive après son rappel passée en barrière
 * (TF-2150, D-172 (a) du 04/11/2026 ; « barrière dès la 2e fois », BOUCLE-AMELIORATION.md, T1).
 *
 * --verifier, double sens : une table de fixture conforme passe ; une fixture rouge par règle (V1 à V11) échoue sur
 * SA règle ; la table réelle du pilot passe sur sa structure (V1 à V9 et V11), et sa date de revue (V10) est seulement dite :
 * un passage de date ne doit pas rendre rouge le harnais de tout le pilot, c'est `--verifier` joué à la revue qui la juge.
 * --recidives : sans `frictions.jsonl`, il le DIT et ne conclut rien (exit 2) ; une friction de la même session qui
 * SUIT le rappel fait récidiver la leçon ; une friction antérieure, d'une autre session ou d'un autre outil, non.
 * --appliquer : la leçon qui récidive passe en barrière, datée et motivée, la version de la table monte, la table
 * rejugée passe ; sans frictions, rien n'est écrit. La boucle entière est jouée sur un pilot jetable : le hook rappelle
 * et journalise, une friction suit, --appliquer pose la barrière, le hook REFUSE le même geste.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { appendFileSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prescritAttenteAvantPlan } from "./lecons.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "lecons.mjs");
const PILOT_REEL = join(ICI, "..");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const base = mkdtempSync(join(tmpdir(), "lecons-"));

function lancer(args) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env: { ...process.env, CLAUDE_PROJECT_DIR: "" } });
  let json = null;
  if (args.includes("--json")) { try { json = JSON.parse(r.stdout); } catch { /* sortie non JSON */ } }
  return { code: r.status, out: r.stdout || "", err: r.stderr || "", json };
}
const lecon = (id, extra = {}) => ({
  id, classe: "oracle-faux-positif", symptome: `symptôme de ${id}`,
  declencheur: { outils: ["Bash"], sur: "commande", motif: `\\bgeste-${id.toLowerCase()}\\b` },
  solutions: [{ texte: `voie préférée de ${id}`, condition: "toujours", preferee: true }, { texte: "repli", condition: "parfois", preferee: false }],
  preuve: { type: "registre", id: "TF-9001" }, portee: "generique", statut: "rappel", revue_le: "2099-01-01", source: "fixture", ...extra,
});
const table = (lecons, extra = {}) => ({ schema: "lecons@1", version: "1.0.0", date: "2026-11-04", lecons, ...extra });

/** Un pilot jetable : table, classes, registre et archive de fixture ; le hook copié quand `avecHook`. */
function pilote(nom, { t = table([lecon("L-901")]), fichiers = {}, avecHook = false } = {}) {
  const p = join(base, nom);
  for (const d of ["references", "todo", ".claude", "oracles"]) mkdirSync(join(p, d), { recursive: true });
  writeFileSync(join(p, "references", "LECONS.json"), typeof t === "string" ? t : `${JSON.stringify(t, null, 2)}\n`, "utf8");
  writeFileSync(join(p, "todo", "CLASSES.json"), JSON.stringify({ classes: [{ cle: "oracle-faux-positif" }, { cle: "garde-contournee-par-sortie-rompue" }] }), "utf8");
  writeFileSync(join(p, "todo", "TODO.jsonl"), `${JSON.stringify({ ev: "creation", id: "TF-9001", titre: "x" })}\n`, "utf8");
  writeFileSync(join(p, "todo", "TODO-ARCHIVE.jsonl"), `${JSON.stringify({ ev: "creation", id: "TF-9002", titre: "x" })}\n`, "utf8");
  for (const [rel, c] of Object.entries(fichiers)) { mkdirSync(dirname(join(p, rel)), { recursive: true }); writeFileSync(join(p, rel), c, "utf8"); }
  if (avecHook) for (const f of ["hook-lecons.mjs", "lib-racine-projet.mjs"]) copyFileSync(join(ICI, "..", "oracles", f), join(p, "oracles", f));
  return p;
}
const verifierFixture = (p, au = "2026-11-04") => lancer(["--verifier", "--pilot", p, "--racine", p, "--json", "--au", au]);
const regles = (r) => (r.json?.constats || []).map((c) => c.regle);

try {
  // --- --verifier : la table réelle, puis le double sens de chaque règle -----------------------------------------
  const reel = lancer(["--verifier", "--pilot", PILOT_REEL, "--racine", PILOT_REEL, "--json"]);
  const horsRevue = (reel.json?.constats || []).filter((c) => c.regle !== "V10");
  const revue = (reel.json?.constats || []).filter((c) => c.regle === "V10");
  check(`vert — la table réelle du pilot passe V1 à V9 et V11 (${reel.json?.tables?.[0]?.lecons ?? "?"} leçons) ; V10, sa date de revue : ${revue.length ? `${revue.length} leçon(s) à revoir, dites ici sans échec` : "aucune leçon à revoir"}`, () => {
    if (!reel.json) throw new Error(`sortie illisible : ${reel.out.slice(0, 200)} ${reel.err.slice(0, 200)}`);
    if (horsRevue.length) throw new Error(horsRevue.map((c) => `[${c.regle}] ${c.lecon} ${c.message}`).join(" ; "));
  });
  check("vert — table de fixture conforme : PASS, exit 0", () => {
    const r = verifierFixture(pilote("conforme"));
    if (r.code !== 0 || r.json?.verdict !== "PASS") throw new Error(`exit ${r.code} ${JSON.stringify(r.json?.constats)}`);
  });
  const ROUGES = [
    ["V1", "schéma inconnu", { t: table([lecon("L-901")], { schema: "autre@1" }) }],
    ["V1", "JSON illisible", { t: "{ pas du json" }],
    ["V1", "version hors forme x.y.z", { t: table([lecon("L-901")], { version: "1.0" }) }],
    ["V2", "identifiant hors forme", { t: table([lecon("L-1")]) }],
    ["V2", "identifiant en double", { t: table([lecon("L-901"), lecon("L-901")]) }],
    ["V3", "classe inconnue du référentiel", { t: table([lecon("L-901", { classe: "classe-inventee" })]) }],
    ["V4", "symptôme vide", { t: table([lecon("L-901", { symptome: " " })]) }],
    ["V5", "outil inconnu", { t: table([lecon("L-901", { declencheur: { outils: ["Bash", "Teleporte"], sur: "commande", motif: "x" } })]) }],
    ["V5", "`sur: commande` sur un outil d'écriture", { t: table([lecon("L-901", { declencheur: { outils: ["Write"], sur: "commande", motif: "x" } })]) }],
    ["V5", "motif invalide", { t: table([lecon("L-901", { declencheur: { outils: ["Bash"], sur: "commande", motif: "(x" } })]) }],
    ["V5", "`chaines` inconnu", { t: table([lecon("L-901", { declencheur: { outils: ["Bash"], sur: "commande", chaines: "toutes", motif: "x" } })]) }],
    ["V5", "`sur: agent` sur un outil de commande", { t: table([lecon("L-901", { declencheur: { outils: ["Bash"], sur: "agent", motif: "x" } })]) }, /sur: agent.*ne lance pas d'agent : Bash/],
    ["V5", "`sur: commande` sur l'outil Agent", { t: table([lecon("L-901", { declencheur: { outils: ["Agent"], sur: "commande", motif: "x" } })]) }, /sur: commande.*sans commande : Agent/],
    ["V5", "`chaines` sur un déclencheur `sur: agent`", { t: table([lecon("L-901", { declencheur: { outils: ["Agent", "Task"], sur: "agent", chaines: "retirees", motif: "x" } })]) }, /`chaines` ne vaut que pour/],
    ["V5", "motif invalide d'un déclencheur `sur: agent`", { t: table([lecon("L-901", { declencheur: { outils: ["Agent"], sur: "agent", motif: "(x" } })]) }, /motif invalide/],
    ["V6", "aucune solution préférée", { t: table([lecon("L-901", { solutions: [{ texte: "a", condition: "b", preferee: false }] })]) }],
    ["V6", "deux solutions préférées", { t: table([lecon("L-901", { solutions: [{ texte: "a", condition: "b", preferee: true }, { texte: "c", condition: "d", preferee: true }] })]) }],
    ["V6", "solution sans condition", { t: table([lecon("L-901", { solutions: [{ texte: "a", condition: "", preferee: true }] })]) }],
    ["V7", "identifiant absent du registre et de l'archive", { t: table([lecon("L-901", { preuve: { type: "registre", id: "TF-9999" } })]) }],
    ["V7", "fichier de preuve absent", { t: table([lecon("L-901", { preuve: { type: "fichier", chemin: "references/ABSENT.md" } })]) }],
    ["V7", "fichier de preuve sans sa chaîne", { t: table([lecon("L-901", { preuve: { type: "fichier", chemin: "references/P.md", contient: "mordu" } })]), fichiers: { "references/P.md": "autre chose\n" } }],
    ["V7", "fichier de preuve au chemin absolu", { t: table([lecon("L-901", { preuve: { type: "fichier", chemin: "/poste/preuve.md" } })]) }],
    ["V8", "portée produit dans la table du pilot", { t: table([lecon("L-901", { portee: "produit" })]) }],
    ["V9", "statut inconnu", { t: table([lecon("L-901", { statut: "active" })]) }],
    ["V9", "barrière sans date ni motif", { t: table([lecon("L-901", { statut: "barriere" })]) }],
    ["V10", "revue_le dépassée", { t: table([lecon("L-901", { revue_le: "2026-11-03" })]) }],
    ["V10", "revue_le hors forme", { t: table([lecon("L-901", { revue_le: "15/12/2026" })]) }],
    ["V11", "solution qui prescrit l'attente en avant-plan avec un délai explicite (le texte de L-006 avant TF-2479)", { t: table([lecon("L-901", { solutions: [{ texte: "se clore par la restitution complète", condition: "tour qui a écrit", preferee: true }, { texte: "jouer l'attente en avant-plan, avec un délai explicite, puis relire le résultat des agents avant de rendre la main", condition: "résultat d'agent dû dans le tour", preferee: false }] })]) }, /solution 2 : prescrit une attente en avant-plan avec délai explicite.*TF-2463/],
    ["V11", "solution qui lance une commande au premier plan avec un délai", { t: table([lecon("L-901", { solutions: [{ texte: "lancer la recette au premier plan avec un délai de 600 s", condition: "toujours", preferee: true }] })]) }, /solution 1 : prescrit une attente en avant-plan/],
  ];
  ROUGES.forEach(([regle, nom, opts, message], k) => {
    check(`rouge — ${regle} ${nom} : FAIL sur ${regle}, exit 1`, () => {
      const r = verifierFixture(pilote(`rouge-${k}`, opts));
      if (r.code !== 1 || r.json?.verdict !== "FAIL" || !regles(r).includes(regle)) throw new Error(`exit ${r.code} règles [${regles(r)}] ${r.out.slice(0, 200)}`);
      if (message && !(r.json?.constats || []).some((c) => c.regle === regle && message.test(c.message))) throw new Error(`échoue, mais pas pour la bonne raison : ${JSON.stringify((r.json?.constats || []).map((c) => c.message))}`);
    });
  });
  check("vert — V11 : le remède de TF-2479 (arrière-plan d'emblée, fin annoncée, tranches bornées) et une phrase qui proscrit l'avant-plan passent", () => {
    const solutions = [{ texte: "lancer l'attente d'emblée en arrière-plan, sa fin annoncée, et l'attendre par tranches bornées (150 s au plus), puis relire le résultat des agents", condition: "résultat d'agent dû dans le tour", preferee: true },
      { texte: "ne jamais attendre en avant-plan avec un délai explicite : le harnais bascule la commande vers 175 s", condition: "toujours", preferee: false }];
    const r = verifierFixture(pilote("v11-vert", { t: table([lecon("L-901", { solutions })]) }));
    if (r.code !== 0 || r.json?.verdict !== "PASS") throw new Error(`exit ${r.code} ${JSON.stringify(r.json?.constats)}`);
    if (prescritAttenteAvantPlan(solutions[0].texte) || prescritAttenteAvantPlan(solutions[1].texte)) throw new Error("prescritAttenteAvantPlan refuse un texte conforme");
    if (!prescritAttenteAvantPlan("attendre en avant-plan") || prescritAttenteAvantPlan(undefined)) throw new Error("prescritAttenteAvantPlan : cas nus");
  });
  check("vert — V5 : déclencheur `sur: agent` sur les outils Agent et Task : PASS", () => {
    const r = verifierFixture(pilote("agent-vert", { t: table([lecon("L-901", { declencheur: { outils: ["Agent", "Task"], sur: "agent", motif: "^(?!Relecture d'intention)" } })]) }));
    if (r.code !== 0 || r.json?.verdict !== "PASS") throw new Error(`exit ${r.code} ${JSON.stringify(r.json?.constats)}`);
  });
  check("vert — V7 : preuve trouvée à l'archive seule, et fichier relatif qui contient sa chaîne : PASS", () => {
    const p = pilote("preuves-vertes", { t: table([lecon("L-901", { preuve: { type: "registre", id: "TF-9002" } }), lecon("L-902", { preuve: { type: "fichier", chemin: "references/P.md", contient: "mordu" } })]), fichiers: { "references/P.md": "le geste a mordu\n" } });
    const r = verifierFixture(p);
    if (r.code !== 0) throw new Error(JSON.stringify(r.json?.constats));
  });
  check("vert — V10 : la même leçon jugée avant sa date de revue passe (--au)", () => {
    const r = verifierFixture(pilote("revue-verte", { t: table([lecon("L-901", { revue_le: "2026-11-03" })]) }), "2026-11-02");
    if (r.code !== 0) throw new Error(JSON.stringify(r.json?.constats));
  });
  const produit = (nom, lecons) => {
    const p = join(base, nom);
    mkdirSync(join(p, "forge"), { recursive: true });
    writeFileSync(join(p, "forge", "LECONS.jsonl"), lecons.map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");
    return p;
  };
  const pp = pilote("pilot-du-produit");
  check("vert — table d'un produit conforme (portée produit, identifiant libre) : PASS, les deux tables jugées", () => {
    const r = lancer(["--verifier", "--pilot", pp, "--racine", produit("produit-ok", [lecon("L-101", { portee: "produit" })]), "--json", "--au", "2026-11-04"]);
    if (r.code !== 0 || r.json?.tables?.length !== 2) throw new Error(`exit ${r.code} ${JSON.stringify(r.json)}`);
  });
  check("rouge — table d'un produit : portée generique (V8) et identifiant pris par le pilot (V2), FAIL", () => {
    const r = lancer(["--verifier", "--pilot", pp, "--racine", produit("produit-ko", [lecon("L-901", { portee: "generique" })]), "--json", "--au", "2026-11-04"]);
    if (r.code !== 1 || !regles(r).includes("V8") || !regles(r).includes("V2")) throw new Error(`exit ${r.code} [${regles(r)}]`);
  });

  // --- --recidives ----------------------------------------------------------------------------------------------
  const rappel = (session, ts, outil = "Bash", lecon = "L-901", statut = "rappel") => JSON.stringify({ ts, session, lecon, statut, outil, geste: "run geste-l-901" });
  const friction = (session, ts, outil) => JSON.stringify({ ts, session, type: "refus_hook", extrait: "refus du hook au même geste", ...(outil ? { outil } : {}) });
  const journaux = (p, rappels, frictions) => {
    if (rappels) writeFileSync(join(p, ".claude", "lecons-rappels.jsonl"), rappels.join("\n") + "\n", "utf8");
    if (frictions) writeFileSync(join(p, ".claude", "frictions.jsonl"), frictions.join("\n") + "\n", "utf8");
  };
  const pa = pilote("sans-frictions");
  journaux(pa, [rappel("S-1", "2026-11-04T10:00:00.000Z")], null);
  check("rouge — --recidives sans frictions.jsonl : le DIT (RIEN À CONCLURE, chemin nommé), ne conclut rien, exit 2", () => {
    const r = lancer(["--recidives", "--pilot", pa, "--racine", pa]);
    if (r.code !== 2 || !/RIEN À CONCLURE/.test(r.out) || !/frictions\.jsonl absent/.test(r.out) || /à passer en barrière/.test(r.out)) throw new Error(`exit ${r.code} ${r.out}`);
  });
  check("vert — --recidives sans journal des rappels : aucune leçon à examiner, exit 0", () => {
    const p = pilote("sans-rappels");
    journaux(p, null, [friction("S-1", "2026-11-04T10:00:00Z")]);
    const r = lancer(["--recidives", "--pilot", p, "--racine", p]);
    if (r.code !== 0 || !/aucun rappel servi/.test(r.out)) throw new Error(`exit ${r.code} ${r.out}`);
  });
  const CROISEMENTS = [
    ["rouge", "friction de la même session APRÈS le rappel", [rappel("S-1", "2026-11-04T10:00:00Z")], [friction("S-1", "2026-11-04T10:05:00Z")], ["L-901"]],
    ["rouge", "friction sans outil après le rappel (elle vaut pour tout outil)", [rappel("S-1", "2026-11-04T10:00:00Z", "Bash")], [friction("S-1", "2026-11-04T10:05:00Z", null)], ["L-901"]],
    ["vert", "friction de la même session AVANT le rappel", [rappel("S-1", "2026-11-04T10:00:00Z")], [friction("S-1", "2026-11-04T09:55:00Z")], []],
    ["vert", "friction d'une AUTRE session", [rappel("S-1", "2026-11-04T10:00:00Z")], [friction("S-2", "2026-11-04T10:05:00Z")], []],
    ["vert", "friction d'un AUTRE outil", [rappel("S-1", "2026-11-04T10:00:00Z", "Bash")], [friction("S-1", "2026-11-04T10:05:00Z", "PowerShell")], []],
    ["vert", "ligne de journal au statut barriere (déjà une barrière)", [rappel("S-1", "2026-11-04T10:00:00Z", "Bash", "L-901", "barriere")], [friction("S-1", "2026-11-04T10:05:00Z")], []],
  ];
  CROISEMENTS.forEach(([sens, nom, r1, f1, attendues], k) => {
    check(`${sens} — --recidives, ${nom} : ${attendues.length ? `${attendues.join(", ")} récidive` : "aucune récidive"}`, () => {
      const p = pilote(`croisement-${k}`);
      journaux(p, r1, f1);
      const r = lancer(["--recidives", "--pilot", p, "--racine", p, "--json"]);
      const ids = (r.json?.recidives || []).map((x) => x.id);
      if (r.code !== 0 || ids.join(",") !== attendues.join(",")) throw new Error(`exit ${r.code} [${ids}] ${r.out.slice(0, 200)}`);
      if (attendues.length && !r.json.recidives[0].preuves[0].friction?.type) throw new Error("preuve de récidive sans friction");
    });
  });

  // --- --appliquer ----------------------------------------------------------------------------------------------
  check("vert — --appliquer sans frictions.jsonl : rien n'est écrit (table identique à l'octet), exit 2", () => {
    const avant = readFileSync(join(pa, "references", "LECONS.json"), "utf8");
    const r = lancer(["--appliquer", "--pilot", pa, "--racine", pa, "--au", "2026-11-05"]);
    if (r.code !== 2 || readFileSync(join(pa, "references", "LECONS.json"), "utf8") !== avant) throw new Error(`exit ${r.code} ${r.out}`);
  });
  check("rouge — --appliquer : la leçon qui récidive passe en barrière, datée et motivée, version 1.0.0 → 1.1.0, table rejugée PASS", () => {
    const p = pilote("appliquer", { t: table([lecon("L-901"), lecon("L-902")]) });
    journaux(p, [rappel("S-1", "2026-11-04T10:00:00Z")], [friction("S-1", "2026-11-04T10:05:00Z")]);
    const r = lancer(["--appliquer", "--pilot", p, "--racine", p, "--au", "2026-11-05"]);
    const t = JSON.parse(readFileSync(join(p, "references", "LECONS.json"), "utf8"));
    const l1 = t.lecons.find((l) => l.id === "L-901"), l2 = t.lecons.find((l) => l.id === "L-902");
    if (r.code !== 0 || !/1 leçon\(s\) passée\(s\) en barrière — L-901/.test(r.out) || !/table rejugée : PASS/.test(r.out)) throw new Error(`exit ${r.code} ${r.out}`);
    if (l1.statut !== "barriere" || l1.barriere_le !== "2026-11-05" || !/session S-1/.test(l1.motif_barriere) || !/refus_hook/.test(l1.motif_barriere)) throw new Error(JSON.stringify(l1));
    if (l2.statut !== "rappel" || t.version !== "1.1.0" || t.date !== "2026-11-05") throw new Error(`L-902 ${l2.statut}, version ${t.version}, date ${t.date}`);
    if (lancer(["--verifier", "--pilot", p, "--racine", p, "--au", "2026-11-05"]).code !== 0) throw new Error("la table réécrite ne passe pas --verifier");
  });

  // --- La boucle entière : rappel, friction, barrière, refus ------------------------------------------------------
  check("rouge — boucle entière sur un pilot jetable : le hook rappelle et journalise, une friction suit, --appliquer pose la barrière, le hook REFUSE le même geste", () => {
    const p = pilote("boucle", { avecHook: true });
    const hook = (session) => spawnSync(process.execPath, [join(p, "oracles", "hook-lecons.mjs")], { encoding: "utf8", env: { ...process.env, CLAUDE_PROJECT_DIR: p },
      input: JSON.stringify({ tool_name: "Bash", cwd: p, session_id: session, tool_input: { command: "run geste-l-901" } }) });
    const premier = hook("S-boucle");
    if (premier.status !== 0 || !/Leçon L-901/.test(premier.stdout)) throw new Error(`premier geste : exit ${premier.status} ${premier.stdout.slice(0, 160)} ${premier.stderr.slice(0, 160)}`);
    appendFileSync(join(p, ".claude", "frictions.jsonl"), `${JSON.stringify({ ts: new Date(Date.now() + 60000).toISOString(), session: "S-boucle", type: "correction_humaine", extrait: "le même geste, encore" })}\n`, "utf8");
    const a = lancer(["--appliquer", "--pilot", p, "--racine", p]);
    if (a.code !== 0 || !/passée\(s\) en barrière — L-901/.test(a.out)) throw new Error(`--appliquer : exit ${a.code} ${a.out}`);
    const second = hook("S-boucle");
    if (second.status !== 2 || !/LEÇON EN BARRIÈRE L-901/.test(second.stderr) || !/correction_humaine/.test(second.stderr)) throw new Error(`second geste : exit ${second.status} ${second.stderr.slice(0, 200)}`);
  });
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ }
}

console.log(`\nlecons : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
