#!/usr/bin/env node
/**
 * compiler-flotte.mjs — LA COMPILATION DE LA FLOTTE JOUE oracle-scan-agentdef ET REFUSE UN FAIL NON DÉCLARÉ (TF-2487, 13/11/2026).
 *
 * LE FAIT. Mesuré le 13/11/2026 par l'agent du lot as, rejoué par le lot pc sur l'oracle 0.2.0 de forge-agents-security : 4 des
 * 5 agents compilés de `.claude/agents/` échouent à `oracle-scan-agentdef` (constructeur CAP-1, redacteur CAP-1, explorateur
 * CAP-3, verificateur CAP-3 ; `campagne` passe). Rien ne les jouait : la commande de compilation de `gabarits/flotte/README.md`
 * écrivait les agents sans jamais les juger, et le FAIL a vécu jusqu'à ce qu'un agent d'une autre campagne le rencontre.
 *
 * CE QUE FAIT CE SCRIPT. Il compile `gabarits/flotte/*.yaml` par `compile-agent-def.mjs` de forge-agents DANS UN TAMPON, joue
 * `oracle-scan-agentdef.mjs` de forge-agents-security sur chaque agent compilé, et n'installe dans `.claude/agents/` que si
 * chaque FAIL est DÉCLARÉ. Un refus n'écrit rien. Deux issues légitimes pour un constat CAP : retirer de la définition l'outil
 * que le rôle n'emploie pas, ou le DÉCLARER dans la définition de l'agent, par une ligne de commentaire de son `.yaml` :
 *
 *     # scan-agentdef CAP-3 : <motif — la mesure qui montre que le rôle emploie l'outil, et ce qui borne le risque>
 *
 * Une déclaration est refusée (FAIL) si son motif fait moins de 60 caractères, si elle vise une règle qui ne se déclenche plus
 * (déclaration périmée : l'outil a été retiré, la ligne reste et masquerait le prochain constat), ou si la ligne est mal formée.
 * Le compilateur de forge-agents ignore les commentaires : aucune clé ne s'ajoute à `agent.def`, il n'y a donc rien à y changer.
 *
 * Usage : node scripts\compiler-flotte.mjs               compile dans un tampon, juge, installe si rien n'est refusé
 *         node scripts\compiler-flotte.mjs --verifier    juge les agents DÉJÀ installés, sans compiler ni écrire (état du parc, I4)
 *         options : --json (verdict JSON) · --sources <dossier> · --agents <dossier> · --oracle <oracle-scan-agentdef.mjs> · --compilateur <compile-agent-def.mjs>
 * Exit : 0 PASS · 1 FAIL (rien n'est installé) · 2 non jugeable (oracle ou compilateur introuvable, option inconnue).
 * NON JUGÉ (déclaré) : la justesse d'un motif (sa longueur seule est contrôlée, pas sa vérité : la relecture humaine le juge) ;
 * le calibrage de l'oracle lui-même (il se corrige à sa forge, forge-agents-security) ; un agent de `.claude/agents/` hors flotte
 * est jugé, mais sans déclaration possible faute de source `.yaml`.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const VERSION = "1.0.0";
export const MOTIF_MIN = 60;
const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE_PILOT = resolve(ICI, "..");
const GRAVES = new Set(["bloquant", "majeur"]);
const LIGNE_DECLARATION = /^\s*#\s*scan-agentdef\b(.*)$/;
const FORME_DECLARATION = /^\s+(CAP-[1-4])\s*:\s*(\S.*)$/;

/** Les déclarations d'une source `.yaml` : { declarations: [{regle, motif, ligne}], illisibles: [{ligne, texte}] }. */
export function lireDeclarations(texteYaml) {
  const declarations = [], illisibles = [];
  texteYaml.split(/\r?\n/).forEach((brut, i) => {
    const m = LIGNE_DECLARATION.exec(brut);
    if (!m) return;
    const f = FORME_DECLARATION.exec(m[1]);
    if (f) declarations.push({ regle: f[1], motif: f[2].trim(), ligne: i + 1 });
    else illisibles.push({ ligne: i + 1, texte: brut.trim().slice(0, 120) });
  });
  return { declarations, illisibles };
}

/**
 * Le jugement d'UN agent : le verdict de l'oracle (`scan`) confronté aux déclarations de sa source.
 * Rend des constats { sev, regle, msg } ; `bloquant` = refus.
 */
export function jugerAgent({ id, scan, declarations = [], illisibles = [] }) {
  const constats = [];
  for (const il of illisibles)
    constats.push({ sev: "bloquant", regle: "DECLARATION", msg: `${id} : ligne ${il.ligne} de la source, déclaration illisible (forme attendue « # scan-agentdef CAP-n : motif ») — « ${il.texte} »` });
  if (!scan || !Array.isArray(scan.findings))
    return [...constats, { sev: "bloquant", regle: "SCAN", msg: `${id} : l'oracle n'a rendu aucun verdict lisible` }];
  if (scan.verdict === "SKIP")
    return [...constats, { sev: "bloquant", regle: "SCAN", msg: `${id} : l'oracle n'a pas pu juger l'agent (SKIP) — fail-closed` }];
  const graves = scan.findings.filter((f) => GRAVES.has(f.sev));
  const regles = new Set(graves.map((f) => f.regle));
  for (const f of graves) {
    const d = declarations.find((x) => x.regle === f.regle);
    if (!d) {
      constats.push({ sev: "bloquant", regle: f.regle, msg: `${id} : FAIL non déclaré — ${f.msg} Remède : retirer l'outil que le rôle n'emploie pas, ou ajouter à gabarits/flotte/${id}.yaml la ligne « # scan-agentdef ${f.regle} : <motif> » (motif de ${MOTIF_MIN} caractères au moins).` });
    } else if (d.motif.length < MOTIF_MIN) {
      constats.push({ sev: "bloquant", regle: f.regle, msg: `${id} : ${f.regle} déclaré (ligne ${d.ligne}) avec un motif de ${d.motif.length} caractères, ${MOTIF_MIN} au moins : un motif dit la mesure qui montre que le rôle emploie l'outil` });
    } else {
      constats.push({ sev: "info", regle: f.regle, msg: `${id} : ${f.regle} déclaré (ligne ${d.ligne}) — ${d.motif}` });
    }
  }
  for (const d of declarations)
    if (!regles.has(d.regle))
      constats.push({ sev: "bloquant", regle: d.regle, msg: `${id} : déclaration périmée (ligne ${d.ligne}) — l'oracle ne relève plus ${d.regle} sur cet agent ; retirer la ligne, qui masquerait le prochain constat` });
  return constats;
}

/** Le dépôt frère `nom` : `$FORGE_ROOT\nom`, sinon le voisin du pilot. */
export function depotFrere(nom, env = process.env, racinePilot = RACINE_PILOT) {
  const bases = [env.FORGE_ROOT, dirname(racinePilot)].filter(Boolean);
  return bases.map((b) => join(b, nom)).find((p) => existsSync(p)) ?? null;
}

export function oracleParDefaut(env = process.env) {
  const d = depotFrere("digit-ai-forge-agents-security", env);
  const p = d && join(d, "oracles", "oracle-scan-agentdef.mjs");
  return p && existsSync(p) ? p : null;
}
export function compilateurParDefaut(env = process.env) {
  const d = depotFrere("digit-ai-forge-agents", env);
  const p = d && join(d, ".claude", "skills", "forge-agents", "scripts", "compile-agent-def.mjs");
  return p && existsSync(p) ? p : null;
}

function scanner(oracle, fichier) {
  const r = spawnSync(process.execPath, [oracle, fichier, "--json-only"], { encoding: "utf8" });
  try { return JSON.parse(r.stdout); } catch { return null; }
}

/** Juge tous les `.md` d'un dossier d'agents ; les déclarations viennent de `<sources>/<id>.yaml`. */
export function jugerFlotte({ agents, sources, oracle }) {
  const constats = [];
  const fichiers = readdirSync(agents).filter((f) => f.endsWith(".md")).sort();
  for (const f of fichiers) {
    const id = f.slice(0, -3);
    const src = join(sources, `${id}.yaml`);
    const { declarations, illisibles } = existsSync(src) ? lireDeclarations(readFileSync(src, "utf8")) : { declarations: [], illisibles: [] };
    constats.push(...jugerAgent({ id, scan: scanner(oracle, join(agents, f)), declarations, illisibles }));
  }
  if (!fichiers.length) constats.push({ sev: "bloquant", regle: "FLOTTE", msg: `aucun agent .md dans ${agents}` });
  const refus = constats.filter((c) => c.sev === "bloquant");
  return { verdict: refus.length ? "FAIL" : "PASS", agents: fichiers.length, constats };
}

const sansCR = (t) => t.replace(/\r\n/g, "\n");

/** Compile dans un tampon, juge, installe seulement si rien n'est refusé. */
export function compiler({ sources, agents, oracle, compilateur }) {
  const tampon = mkdtempSync(join(tmpdir(), "flotte-compil-"));
  try {
    const yamls = readdirSync(sources).filter((f) => f.endsWith(".yaml")).sort().map((f) => join(sources, f));
    const c = spawnSync(process.execPath, [compilateur, ...yamls, "--out", tampon], { encoding: "utf8" });
    if (c.status !== 0) return { verdict: "FAIL", agents: 0, installes: [], constats: [{ sev: "bloquant", regle: "COMPILATION", msg: `compile-agent-def a refusé (exit ${c.status}) : ${(c.stderr || c.stdout || "").trim().slice(0, 300)}` }] };
    const r = jugerFlotte({ agents: tampon, sources, oracle });
    if (r.verdict !== "PASS") return { ...r, installes: [] };
    const installes = [];
    for (const f of readdirSync(tampon).filter((x) => x.endsWith(".md"))) {
      const neuf = readFileSync(join(tampon, f), "utf8"), cible = join(agents, f);
      if (existsSync(cible) && sansCR(readFileSync(cible, "utf8")) === sansCR(neuf)) continue;
      writeFileSync(cible, neuf);
      installes.push(f);
    }
    return { ...r, installes };
  } finally { rmSync(tampon, { recursive: true, force: true }); }
}

function principal(argv) {
  const opt = (nom) => { const i = argv.indexOf(nom); return i >= 0 ? argv[i + 1] : undefined; };
  const connues = new Set(["--verifier", "--json", "--sources", "--agents", "--oracle", "--compilateur"]);
  const inconnue = argv.find((a, i) => a.startsWith("--") && !connues.has(a));
  if (inconnue) { console.error(`option inconnue : ${inconnue}`); return 2; }
  const sources = resolve(opt("--sources") ?? join(RACINE_PILOT, "gabarits", "flotte"));
  const agents = resolve(opt("--agents") ?? join(RACINE_PILOT, ".claude", "agents"));
  const oracle = opt("--oracle") ?? oracleParDefaut();
  const verifier = argv.includes("--verifier");
  const compilateur = opt("--compilateur") ?? compilateurParDefaut();
  const sortie = (verdict, corps, code) => {
    if (argv.includes("--json")) console.log(JSON.stringify({ outil: "compiler-flotte", version: VERSION, verdict, ...corps }, null, 2));
    else {
      console.log(`compiler-flotte ${VERSION} — ${verdict}${corps.agents ? ` · ${corps.agents} agent(s) jugé(s)` : ""}`);
      for (const c of corps.constats ?? []) console.log(`  [${c.sev}] ${c.regle} — ${c.msg}`);
      if (corps.installes) console.log(corps.installes.length ? `  installé : ${corps.installes.join(", ")}` : "  rien à installer, .claude/agents est à jour");
      if (corps.motif) console.log(`  ${corps.motif}`);
    }
    return code;
  };
  if (!oracle || !existsSync(oracle)) return sortie("SKIP", { motif: "oracle-scan-agentdef introuvable (digit-ai-forge-agents-security absent sous FORGE_ROOT et voisin du pilot) : flotte non jugée" }, 2);
  if (!verifier && (!compilateur || !existsSync(compilateur))) return sortie("SKIP", { motif: "compile-agent-def introuvable (digit-ai-forge-agents absent) : rien n'est compilé ni installé" }, 2);
  const r = verifier ? jugerFlotte({ agents, sources, oracle }) : compiler({ sources, agents, oracle, compilateur });
  return sortie(r.verdict, r, r.verdict === "PASS" ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(principal(process.argv.slice(2)));
