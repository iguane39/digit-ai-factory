#!/usr/bin/env node
/**
 * hook-fiches.test.mjs — le hook SubagentStop écrit la fiche d'un agent, ne rend jamais de décision, et rend la main en moins de 300 ms
 * (D-219 (e) du 15/11/2026, TF-2563, mandat 20261115b, lot L1).
 *
 * Sens vert : un agent fini laisse une ligne au fichier désigné, exit 0, sortie standard vide. Sens rouge, « jamais un refus » : une
 * transcription absente ou illisible, une entrée illisible, une entrée sans agent, un second arrêt (`stop_hook_active`) sortent tous en 0
 * sans un mot sur la sortie standard ; les deux premiers écrivent une fiche partielle, les deux suivants n'écrivent rien. Budget :
 * médiane de 5 passages sous 300 ms sur des transcriptions synthétiques de la taille médiane (0,51 Mo) et du 99e centile (6,59 Mo) des
 * 350 transcriptions de sous-agents du poste au 15/11/2026, et par le lanceur d'un produit ; la taille maximale (30,34 Mo) est mesurée
 * et dite. Le banc n'écrit jamais au fichier des fiches du pilot. Tables de pseudonymes jetables. Joué par `oracles\self-tests.mjs` (I2).
 * Câblage (reste du lot L1, 15/11/2026) : au SubagentStop de `.claude/settings.json` du pilot, dans le groupe de `hook-remise-agent.mjs`
 * qui reste en place, en `async: true` ; sens rouge sur deux copies du réglage, l'une sans l'entrée, l'autre sans `async`.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-fiches.mjs");
const FICHES_DU_PILOT = join(ICI, "..", "todo", "observabilite", "fiches-agents.jsonl");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };
const etatDe = (f) => (existsSync(f) ? `${statSync(f).size}:${statSync(f).mtimeMs}` : "absent");
const avantPilot = etatDe(FICHES_DU_PILOT);

const base = mkdtempSync(join(tmpdir(), "hook-fiches-"));
writeFileSync(join(base, "_noms-interdits.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
writeFileSync(join(base, "_produits-pseudonymes.json"), JSON.stringify({ produits: { "produit-banc-fictif": "Produit-41" } }), "utf8");
const PRODUIT = join(base, "produit-banc-fictif");
mkdirSync(join(PRODUIT, "forge"), { recursive: true });
const DEST = join(base, "fiches.jsonl");
const ENV = { ...process.env, FORGE_FICHES_AGENTS: DEST, FORGE_NOMS_INTERDITS: join(base, "_noms-interdits.json"),
  FORGE_PRODUITS_PSEUDO: join(base, "_produits-pseudonymes.json"), FORGE_CONTEXTE_BANC: "1", CLAUDE_PROJECT_DIR: PRODUIT };

const T0 = Date.parse("2026-11-15T08:00:00Z");
const iso = (s) => new Date(T0 + s * 1000).toISOString();
/** Une transcription synthétique d'au moins `octets` : des lectures dont le résultat pèse 20 Ko, puis un rapport. */
function transcription(nom, octets = 0) {
  const bourre = "x".repeat(20000);
  const lignes = [JSON.stringify({ type: "user", isSidechain: true, timestamp: iso(0), message: { role: "user", content: "consigne du banc" } })];
  let taille = lignes[0].length, i = 0;
  do {
    i++;
    const a = JSON.stringify({ type: "assistant", isSidechain: true, timestamp: iso(i * 2), effort: "high", message: { id: `m${i}`, model: "claude-opus-5-5",
      content: [{ type: "tool_use", id: `t${i}`, name: "Read", input: { file_path: `f${i}` } }], stop_reason: "tool_use",
      usage: { input_tokens: 3, cache_creation_input_tokens: 200, cache_read_input_tokens: 50000, output_tokens: 120 } } });
    const u = JSON.stringify({ type: "user", isSidechain: true, timestamp: iso(i * 2 + 1), message: { role: "user", content: [{ type: "tool_result", tool_use_id: `t${i}`, content: bourre }] } });
    lignes.push(a, u);
    taille += a.length + u.length + 2;
  } while (taille < octets);
  lignes.push(JSON.stringify({ type: "assistant", isSidechain: true, timestamp: iso(i * 2 + 2), effort: "high",
    message: { id: "fin", model: "claude-opus-5-5", content: [{ type: "text", text: "Rapport." }], stop_reason: "end_turn", usage: { output_tokens: 300 } } }));
  const chemin = join(base, `agent-${nom}.jsonl`);
  writeFileSync(chemin, lignes.join("\n") + "\n", "utf8");
  return { chemin, appels: i };
}
const entree = (id, chemin, plus = {}) => ({ hook_event_name: "SubagentStop", session_id: "cafe0000-1111-4000-8000-000000000000", agent_id: id, agent_type: "explorateur",
  agent_transcript_path: chemin, cwd: PRODUIT, stop_hook_active: false, last_assistant_message: "Rapport.", ...plus });
const jouer = (stdin, { commande = [HOOK], env = ENV, cwd = undefined } = {}) => {
  const t0 = process.hrtime.bigint();
  const r = spawnSync(process.execPath, commande, { input: typeof stdin === "string" ? stdin : JSON.stringify(stdin), encoding: "utf8", env, cwd });
  return { code: r.status, out: r.stdout || "", err: r.stderr || "", ms: Number(process.hrtime.bigint() - t0) / 1e6 };
};
const lignes = () => (existsSync(DEST) ? readFileSync(DEST, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const sansDecision = (r) => r.code === 0 && r.out.trim() === "";

try {
  check("vert — un agent fini : une ligne ajoutée au fichier désigné, exit 0, sortie standard vide", () => {
    const t = transcription("fini");
    const avant = lignes().length;
    const r = jouer(entree("fini", t.chemin));
    att(sansDecision(r), `exit ${r.code}, sortie « ${r.out} » ${r.err}`);
    const l = lignes();
    att(l.length === avant + 1, `${l.length - avant} ligne(s) ajoutée(s)`);
    const f = l[l.length - 1];
    att(f.agent_id === "fini" && f.type === "explorateur" && f.cause_fin === "fini" && f.appels_outils === t.appels && f.projet === "Produit-41" && f.partielle === false, JSON.stringify(f));
  });
  check("rouge — transcription absente puis illisible : exit 0, aucune décision, une fiche partielle chacune", () => {
    const illisible = join(base, "agent-illisible.jsonl");
    writeFileSync(illisible, "pas du json\n", "utf8");
    for (const [id, chemin, lacune] of [["absente", join(base, "agent-absente.jsonl"), "transcription de l'agent introuvable"], ["illisible", illisible, "transcription vide"]]) {
      const avant = lignes().length;
      const r = jouer(entree(id, chemin, { last_assistant_message: "" }));
      att(sansDecision(r), `${id} : exit ${r.code}, sortie « ${r.out} »`);
      const f = lignes().slice(avant)[0];
      att(f && f.agent_id === id && f.partielle === true && f.lacunes.includes(lacune), `${id} : ${JSON.stringify(f)}`);
    }
  });
  check("rouge — entrée illisible, entrée sans agent : exit 0, aucune décision, aucune ligne", () => {
    const avant = lignes().length;
    for (const stdin of ["pas du json", "", JSON.stringify({ session_id: "s" }), "[1,2]"]) {
      const r = jouer(stdin);
      att(sansDecision(r), `« ${stdin} » : exit ${r.code}, sortie « ${r.out} »`);
    }
    att(lignes().length === avant, "une entrée sans agent a écrit une fiche");
  });
  check("rouge — second arrêt après un refus de remise (stop_hook_active) : jamais de décision, une seconde ligne qui mesure l'agent en entier", () => {
    const t = transcription("relance");
    const avant = lignes().length;
    att(sansDecision(jouer(entree("relance", t.chemin))) && sansDecision(jouer(entree("relance", t.chemin, { stop_hook_active: true }))), "une décision est rendue");
    const l = lignes().slice(avant);
    att(l.length === 2 && l.every((f) => f.agent_id === "relance" && f.appels_outils === t.appels), JSON.stringify(l));
  });
  check("rouge — une destination impossible (un dossier) : exit 0, aucune décision, la panne dite sur la sortie d'erreur", () => {
    const dossier = join(base, "un-dossier.jsonl");
    mkdirSync(dossier, { recursive: true });
    const r = jouer(entree("panne", transcription("panne").chemin), { env: { ...ENV, FORGE_FICHES_AGENTS: dossier } });
    att(sansDecision(r) && /fiche non écrite/.test(r.err), `exit ${r.code}, sortie « ${r.out} », erreur « ${r.err} »`);
  });

  // Le budget : 5 passages par taille, la médiane jugée. Les tailles sont celles mesurées le 15/11/2026 sur les 350 transcriptions de
  // sous-agents du poste (médiane 0,51 Mo, 99e centile 6,59 Mo, maximum 30,34 Mo).
  const mediane = (cmd, id, chemin, opts) => {
    const d = [];
    for (let k = 0; k < 5; k++) { const r = jouer(entree(id, chemin), opts); att(sansDecision(r), `${id} : exit ${r.code} ${r.err}`); d.push(r.ms); }
    d.sort((a, b) => a - b);
    return { mediane: Math.round(d[2]), max: Math.round(d[4]) };
  };
  check("budget — le hook rend la main en moins de 300 ms (médiane de 5) à la taille médiane et au 99e centile ; le maximum est mesuré et dit", () => {
    const tailles = [["mediane", 0.51], ["p99", 6.59], ["max", 30.34]].map(([id, mo]) => ({ id, mo, ...transcription(`budget-${id}`, mo * 1048576) }));
    const m = tailles.map((t) => ({ ...t, ...mediane(HOOK, `budget-${t.id}`, t.chemin) }));
    console.log(`  [MESURE] budget du hook, médiane de 5 passages : ${m.map((x) => `${String(x.mo).replace(".", ",")} Mo ${x.mediane} ms (max ${x.max})`).join(" ; ")}`);
    const trop = m.filter((x) => x.id !== "max" && x.mediane >= 300);
    att(!trop.length, `au-dessus de 300 ms : ${trop.map((x) => `${x.mo} Mo ${x.mediane} ms`).join(", ")}`);
  });
  check("budget — par le lanceur d'un produit (deux processus node), moins de 300 ms au 99e centile", () => {
    // Copie JETABLE du lanceur, à laquelle le banc ajoute le nom `fiches` tant que le gabarit ne le déclare pas : elle mesure le coût du
    // câblage produit sans toucher au gabarit.
    const source = readFileSync(join(ICI, "..", "gabarits", "hooks-factory.mjs"), "utf8");
    const copie = /"fiches"/.test(source) ? source : source.replace(/const NOMS = new Set\(\[/, 'const NOMS = new Set(["fiches", ');
    att(/"fiches"/.test(copie), "le lanceur ne déclare pas ses noms sous la forme attendue");
    mkdirSync(join(PRODUIT, "forge", "hooks"), { recursive: true });
    writeFileSync(join(PRODUIT, "forge", "hooks", "factory.mjs"), copie, "utf8");
    const t = transcription("lanceur", 6.59 * 1048576);
    const env = { ...ENV, FORGE_ROOT: resolve(ICI, "..", "..") };
    const avant = lignes().length;
    const m = mediane(null, "lanceur", t.chemin, { commande: [join(PRODUIT, "forge", "hooks", "factory.mjs"), "fiches"], env, cwd: PRODUIT });
    console.log(`  [MESURE] budget par le lanceur du produit, 6,59 Mo : médiane ${m.mediane} ms (max ${m.max})`);
    att(lignes().length === avant + 5, `${lignes().length - avant} ligne(s) par le lanceur au lieu de 5`);
    att(m.mediane < 300, `${m.mediane} ms`);
  });
  // Le câblage du pilot (reste du lot L1). `async: true` : la documentation (https://code.claude.com/docs/en/hooks, « Configure an async
  // hook ») dit « This field is only available on `type: "command"` hooks » et « Async hooks can't block or control Claude's behavior » :
  // la fiche s'écrit en tâche de fond et ne peut ni retenir l'agent, ni changer le verdict du hook de remise, qui reste dans le même groupe.
  const defautsDeCablage = (reglages) => {
    const groupes = reglages?.hooks?.SubagentStop || [];
    const groupe = groupes.find((g) => (g.hooks || []).some((h) => /hook-remise-agent\.mjs/.test(String(h.command))));
    if (!groupe) return ["hook-remise-agent.mjs absent du SubagentStop"];
    const fiches = (groupe.hooks || []).filter((h) => /oracles\/hook-fiches\.mjs/.test(String(h.command)));
    if (fiches.length !== 1) return [`${fiches.length} entrée(s) hook-fiches.mjs dans le groupe de hook-remise-agent.mjs, 1 attendue`];
    const h = fiches[0], d = [];
    if (h.type !== "command") d.push(`type « ${h.type} »`);
    if (h.async !== true) d.push("async absent");
    if (String(h.command) !== 'node "${CLAUDE_PROJECT_DIR}/oracles/hook-fiches.mjs"') d.push(`commande non ancrée : ${h.command}`);
    return d;
  };
  check("câblage — le hook est au SubagentStop de `.claude/settings.json` du pilot, à côté de hook-remise-agent.mjs, en async ; sans l'entrée ou sans async, le contrôle le dit", () => {
    const reglages = JSON.parse(readFileSync(join(ICI, "..", ".claude", "settings.json"), "utf8"));
    const d = defautsDeCablage(reglages);
    att(!d.length, d.join(" ; "));
    const sans = JSON.parse(JSON.stringify(reglages));
    for (const g of sans.hooks.SubagentStop) g.hooks = g.hooks.filter((x) => !/hook-fiches\.mjs/.test(String(x.command)));
    att(/0 entrée\(s\)/.test(defautsDeCablage(sans).join()), `copie sans l'entrée : ${defautsDeCablage(sans).join()}`);
    const synchrone = JSON.parse(JSON.stringify(reglages));
    for (const g of synchrone.hooks.SubagentStop) for (const x of g.hooks) if (/hook-fiches\.mjs/.test(String(x.command))) delete x.async;
    att(defautsDeCablage(synchrone).includes("async absent"), `copie sans async : ${defautsDeCablage(synchrone).join()}`);
  });
  check("rouge — le banc n'a rien écrit au fichier des fiches du pilot", () => {
    att(etatDe(FICHES_DU_PILOT) === avantPilot, `${FICHES_DU_PILOT} : ${avantPilot} → ${etatDe(FICHES_DU_PILOT)}`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

console.log(`\nhook-fiches : ${pass} PASS, ${fail} FAIL — cas rouges : transcription absente ou illisible, entrée illisible, second arrêt, destination impossible`);
process.exit(fail ? 1 : 0);
