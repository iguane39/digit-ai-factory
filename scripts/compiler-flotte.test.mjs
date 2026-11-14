#!/usr/bin/env node
/**
 * compiler-flotte.test.mjs — la compilation de la flotte juge chaque agent et refuse un FAIL non déclaré (TF-2487, 13/11/2026).
 *   VERT  : un agent sans constat grave passe ; un FAIL déclaré par une ligne `# scan-agentdef CAP-n : motif` de sa source passe,
 *           motif repris en information ; un shell seul (note « mineur ») ne bloque pas ; une compilation propre installe, puis
 *           ne réinstalle rien ; le remède que le refus propose (déclarer, ou retirer l'outil) est JOUÉ et rend PASS ;
 *   ROUGE : un FAIL non déclaré est refusé, nomme la règle et le remède ; un motif de moins de 60 caractères, une déclaration
 *           périmée, une ligne illisible, un oracle sans verdict ou en SKIP sont refusés ; un refus à la compilation n'écrit RIEN
 *           dans le dossier des agents ; une option inconnue rend 2 ; sans oracle, SKIP et rien d'installé ;
 *   RÉEL  : si forge-agents et forge-agents-security sont sur le poste, le même double sens est joué avec le VRAI compilateur et le
 *           VRAI oracle (CAP-1 : réseau + écriture + lecture) ; absents, la section se déclare NON JOUÉE.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MOTIF_MIN, compiler, compilateurParDefaut, jugerAgent, jugerFlotte, lireDeclarations, oracleParDefaut } from "./compiler-flotte.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const egal = (a, b, m) => { if (a !== b) throw new Error(`${m ?? "écart"} : attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)}`); };
const vrai = (c, m) => { if (!c) throw new Error(m); };

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "compiler-flotte.mjs");
const T = mkdtempSync(join(tmpdir(), "compiler-flotte-"));
const MOTIF = "WebFetch lit la documentation officielle : 190 appels relevés le 13/11/2026 sur 57 sous-agents, aucune écriture réseau";
const graves = (cs) => cs.filter((c) => c.sev === "bloquant");

// Un faux oracle et un faux compilateur, déterministes : le premier rend CAP-1 quand l'agent porte WebFetch ET Write.
const FAUX_ORACLE = join(T, "faux-oracle.mjs");
writeFileSync(FAUX_ORACLE, `import { readFileSync } from "node:fs";
const t = readFileSync(process.argv[2], "utf8");
const outils = (/^tools:\\s*(.*)$/m.exec(t) || [, ""])[1].split(",").map((s) => s.trim());
const f = [];
if (outils.includes("WebFetch") && outils.includes("Write")) f.push({ sev: "bloquant", regle: "CAP-1", msg: "réseau + écriture + lecture cumulées", where: "outils" });
if (outils.includes("Bash")) f.push({ sev: "mineur", regle: "CAP-1", msg: "shell sans outil réseau déclaré", where: "outils" });
console.log(JSON.stringify({ verdict: f.some((x) => x.sev === "bloquant") ? "FAIL" : "PASS", findings: f }));
process.exit(f.some((x) => x.sev === "bloquant") ? 1 : 0);
`);
const FAUX_COMPILATEUR = join(T, "faux-compilateur.mjs");
writeFileSync(FAUX_COMPILATEUR, `import { readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
const a = process.argv.slice(2), out = a[a.indexOf("--out") + 1];
for (const y of a.filter((x) => x.endsWith(".yaml"))) {
  const t = readFileSync(y, "utf8");
  const outils = /^outils:\\s*\\[(.*)\\]\\s*$/m.exec(t)[1];
  writeFileSync(join(out, basename(y, ".yaml") + ".md"), "---\\nname: " + basename(y, ".yaml") + "\\ntools: " + outils + "\\n---\\n");
}
console.log("[OK] compilé");
`);

let n = 0;
/** Un jeu neuf : sources/ et agents/ ; chaque agent = [outils, lignes de commentaire de sa source]. */
function jeu(agentsDef) {
  const d = join(T, `jeu-${++n}`), sources = join(d, "sources"), agents = join(d, "agents");
  mkdirSync(sources, { recursive: true }); mkdirSync(agents, { recursive: true });
  for (const [id, [outils, commentaires = []]] of Object.entries(agentsDef)) {
    writeFileSync(join(sources, `${id}.yaml`), [...commentaires, `id: ${id}`, `outils: [${outils}]`, ""].join("\n"));
    writeFileSync(join(agents, `${id}.md`), `---\nname: ${id}\ntools: ${outils}\n---\n`);
  }
  return { sources, agents };
}
const decl = (regle, motif = MOTIF) => `# scan-agentdef ${regle} : ${motif}`;
const cli = (args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });

console.log("Lecture des déclarations");
check("une ligne bien formée est lue, avec sa règle, son motif et son numéro de ligne", () => {
  const r = lireDeclarations(`# autre commentaire\n${decl("CAP-3")}\nid: x\n`);
  egal(r.declarations.length, 1); egal(r.declarations[0].regle, "CAP-3"); egal(r.declarations[0].motif, MOTIF); egal(r.declarations[0].ligne, 2);
  egal(r.illisibles.length, 0);
});
check("une ligne CRLF est lue de la même façon", () => egal(lireDeclarations(`${decl("CAP-1")}\r\nid: x\r\n`).declarations[0].motif, MOTIF));
check("une règle hors CAP-1..4, un deux-points manquant ou un motif vide sont des lignes illisibles", () => {
  const r = lireDeclarations("# scan-agentdef CAP-9 : motif\n# scan-agentdef CAP-1 motif sans deux-points\n# scan-agentdef CAP-2 :\n");
  egal(r.declarations.length, 0); egal(r.illisibles.length, 3);
});

console.log("Jugement d'un agent");
const FAIL_CAP1 = { verdict: "FAIL", findings: [{ sev: "bloquant", regle: "CAP-1", msg: "réseau + écriture + lecture." }] };
check("VERT : aucun constat grave, un shell « mineur » ne bloque pas", () =>
  egal(graves(jugerAgent({ id: "a", scan: { verdict: "PASS", findings: [{ sev: "mineur", regle: "CAP-1", msg: "shell" }] } })).length, 0));
check("VERT : un FAIL déclaré avec un motif suffisant passe, motif repris en information", () => {
  const r = jugerAgent({ id: "a", scan: FAIL_CAP1, declarations: [{ regle: "CAP-1", motif: MOTIF, ligne: 4 }] });
  egal(graves(r).length, 0); egal(r.filter((c) => c.sev === "info" && c.msg.includes(MOTIF)).length, 1);
});
check("ROUGE : un FAIL non déclaré est refusé, avec la règle et le remède", () => {
  const r = graves(jugerAgent({ id: "a", scan: FAIL_CAP1 }));
  egal(r.length, 1); egal(r[0].regle, "CAP-1"); vrai(/non déclaré/.test(r[0].msg) && /# scan-agentdef CAP-1 :/.test(r[0].msg) && /retirer l'outil/.test(r[0].msg), r[0].msg);
});
check("ROUGE : un motif de moins de " + MOTIF_MIN + " caractères est refusé", () => {
  const r = graves(jugerAgent({ id: "a", scan: FAIL_CAP1, declarations: [{ regle: "CAP-1", motif: "le rôle en a besoin", ligne: 4 }] }));
  egal(r.length, 1); vrai(/19 caractères/.test(r[0].msg), r[0].msg);
});
check("ROUGE : une déclaration d'une AUTRE règle ne couvre pas le FAIL", () =>
  egal(graves(jugerAgent({ id: "a", scan: FAIL_CAP1, declarations: [{ regle: "CAP-3", motif: MOTIF, ligne: 4 }] })).filter((c) => /non déclaré/.test(c.msg)).length, 1));
check("ROUGE : une déclaration périmée (la règle ne se déclenche plus) est refusée", () => {
  const r = graves(jugerAgent({ id: "a", scan: { verdict: "PASS", findings: [] }, declarations: [{ regle: "CAP-1", motif: MOTIF, ligne: 4 }] }));
  egal(r.length, 1); vrai(/périmée/.test(r[0].msg), r[0].msg);
});
check("ROUGE : une ligne illisible est refusée", () =>
  egal(graves(jugerAgent({ id: "a", scan: { verdict: "PASS", findings: [] }, illisibles: [{ ligne: 3, texte: "# scan-agentdef CAP-9 : x" }] })).length, 1));
check("ROUGE : un oracle sans verdict lisible, ou en SKIP, est refusé (fail-closed)", () => {
  egal(graves(jugerAgent({ id: "a", scan: null })).length, 1);
  egal(graves(jugerAgent({ id: "a", scan: { verdict: "SKIP", findings: [{ sev: "info", regle: "—", msg: "cible introuvable" }] } })).length, 1);
});

console.log("Jugement de la flotte (faux oracle)");
check("VERT : une flotte sans constat grave passe", () => {
  const { sources, agents } = jeu({ lecteur: ["Read, Grep"], shell: ["Read, Bash"] });
  const r = jugerFlotte({ agents, sources, oracle: FAUX_ORACLE });
  egal(r.verdict, "PASS"); egal(r.agents, 2);
});
check("ROUGE puis VERT : le FAIL non déclaré est refusé ; la déclaration lue dans la SOURCE le fait passer", () => {
  const rouge = jeu({ web: ["Read, Write, WebFetch"] });
  const r1 = jugerFlotte({ agents: rouge.agents, sources: rouge.sources, oracle: FAUX_ORACLE });
  egal(r1.verdict, "FAIL"); egal(graves(r1.constats)[0].regle, "CAP-1");
  const vert = jeu({ web: ["Read, Write, WebFetch", [decl("CAP-1")]] });
  egal(jugerFlotte({ agents: vert.agents, sources: vert.sources, oracle: FAUX_ORACLE }).verdict, "PASS");
});
check("le remède « retirer l'outil » est JOUÉ : sans WebFetch, le même agent passe", () => {
  const { sources, agents } = jeu({ web: ["Read, Write"] });
  egal(jugerFlotte({ agents, sources, oracle: FAUX_ORACLE }).verdict, "PASS");
});
check("ROUGE : la déclaration d'un agent dont l'outil a été retiré est périmée, donc refusée", () => {
  const { sources, agents } = jeu({ web: ["Read, Write", [decl("CAP-1")]] });
  const r = jugerFlotte({ agents, sources, oracle: FAUX_ORACLE });
  egal(r.verdict, "FAIL"); vrai(/périmée/.test(graves(r.constats)[0].msg), "périmée attendue");
});
check("ROUGE : un dossier d'agents vide est refusé", () => {
  const { sources, agents } = jeu({});
  egal(jugerFlotte({ agents, sources, oracle: FAUX_ORACLE }).verdict, "FAIL");
});

console.log("Compilation (faux compilateur, faux oracle)");
check("ROUGE : un refus n'écrit RIEN dans le dossier des agents", () => {
  const { sources, agents } = jeu({ web: ["Read, Write, WebFetch"] });
  const avant = readFileSync(join(agents, "web.md"), "utf8");
  writeFileSync(join(sources, "web.yaml"), "id: web\noutils: [Read, Write, WebFetch, Grep]\n");
  const r = compiler({ sources, agents, oracle: FAUX_ORACLE, compilateur: FAUX_COMPILATEUR });
  egal(r.verdict, "FAIL"); egal(r.installes.length, 0); egal(readFileSync(join(agents, "web.md"), "utf8"), avant, "agent modifié malgré le refus");
});
check("VERT : une source déclarée s'installe, puis une seconde compilation ne réinstalle rien", () => {
  const { sources, agents } = jeu({ web: ["Read, Write, WebFetch", [decl("CAP-1")]] });
  writeFileSync(join(sources, "web.yaml"), [decl("CAP-1"), "id: web", "outils: [Read, Write, WebFetch, Grep]", ""].join("\n"));
  const r1 = compiler({ sources, agents, oracle: FAUX_ORACLE, compilateur: FAUX_COMPILATEUR });
  egal(r1.verdict, "PASS"); egal(r1.installes.join(), "web.md"); vrai(readFileSync(join(agents, "web.md"), "utf8").includes("Grep"), "agent non installé");
  const r2 = compiler({ sources, agents, oracle: FAUX_ORACLE, compilateur: FAUX_COMPILATEUR });
  egal(r2.verdict, "PASS"); egal(r2.installes.length, 0);
});
check("ROUGE : un compilateur qui refuse (exit 1) refuse la compilation, sans rien installer", () => {
  const refus = join(T, "compilateur-refus.mjs"); writeFileSync(refus, "console.error('[REFUS] champ inconnu'); process.exit(1);\n");
  const { sources, agents } = jeu({ a: ["Read"] });
  const r = compiler({ sources, agents, oracle: FAUX_ORACLE, compilateur: refus });
  egal(r.verdict, "FAIL"); vrai(/champ inconnu/.test(r.constats[0].msg), r.constats[0].msg);
});
check("le tampon de compilation est retiré (aucun dossier flotte-compil- laissé)", () =>
  egal(readdirSync(tmpdir()).filter((f) => f.startsWith("flotte-compil-") && existsSync(join(tmpdir(), f, "web.md"))).length, 0));

console.log("Ligne de commande");
check("une option inconnue rend 2", () => egal(cli(["--inconnue"]).status, 2));
check("sans oracle, SKIP (2) et rien n'est installé", () => {
  const { sources, agents } = jeu({ a: ["Read"] });
  const r = cli(["--verifier", "--sources", sources, "--agents", agents, "--oracle", join(T, "absent.mjs")]);
  egal(r.status, 2); vrai(/SKIP/.test(r.stdout), r.stdout);
});
check("--verifier rend 1 sur un FAIL non déclaré, 0 une fois déclaré (faux oracle)", () => {
  const rouge = jeu({ web: ["Read, Write, WebFetch"] });
  egal(cli(["--verifier", "--sources", rouge.sources, "--agents", rouge.agents, "--oracle", FAUX_ORACLE]).status, 1);
  const vert = jeu({ web: ["Read, Write, WebFetch", [decl("CAP-1")]] });
  egal(cli(["--verifier", "--sources", vert.sources, "--agents", vert.agents, "--oracle", FAUX_ORACLE]).status, 0);
});
check("--json rend un verdict JSON lisible", () => {
  const { sources, agents } = jeu({ a: ["Read"] });
  const j = JSON.parse(cli(["--verifier", "--json", "--sources", sources, "--agents", agents, "--oracle", FAUX_ORACLE]).stdout);
  egal(j.verdict, "PASS"); egal(j.outil, "compiler-flotte");
});

console.log("Réel (vrai compilateur, vrai oracle)");
const oracleReel = oracleParDefaut(), compilateurReel = compilateurParDefaut();
if (!oracleReel || !compilateurReel) {
  console.log("  [NON JOUÉ] forge-agents ou forge-agents-security absent du poste : le double sens du réel n'est pas rejoué ici");
} else {
  const ENTETE = ["arbitre:", '  - "Le contrat est lu en première action"', "entrees:", "  - { artefact: consigne, de: orchestrateur }", "sorties:", "  - { artefact: rapport, vers: orchestrateur }", "modele: sonnet", ""].join("\n");
  const source = (outils, commentaires = []) => [...commentaires, "id: reseau", 'mandat: "Écrit dans un dépôt et lit la documentation officielle"', `outils: [${outils}]`, ENTETE].join("\n");
  check("ROUGE : le vrai oracle relève CAP-1 sur réseau + écriture + lecture, la compilation refuse et n'écrit rien", () => {
    const d = join(T, "reel-rouge"), sources = join(d, "sources"), agents = join(d, "agents");
    mkdirSync(sources, { recursive: true }); mkdirSync(agents, { recursive: true });
    writeFileSync(join(sources, "reseau.yaml"), source("Read, Grep, Edit, Write, WebFetch"));
    const r = compiler({ sources, agents, oracle: oracleReel, compilateur: compilateurReel });
    egal(r.verdict, "FAIL"); vrai(r.constats.some((c) => c.sev === "bloquant" && c.regle === "CAP-1" && /non déclaré/.test(c.msg)), JSON.stringify(r.constats).slice(0, 300));
    egal(readdirSync(agents).length, 0, "agents écrits malgré le refus");
  });
  check("VERT : la même source déclarée s'installe ; sans l'outil réseau, elle passe sans déclaration", () => {
    const d = join(T, "reel-vert"), sources = join(d, "sources"), agents = join(d, "agents");
    mkdirSync(sources, { recursive: true }); mkdirSync(agents, { recursive: true });
    writeFileSync(join(sources, "reseau.yaml"), source("Read, Grep, Edit, Write, WebFetch", [decl("CAP-1")]));
    const r = compiler({ sources, agents, oracle: oracleReel, compilateur: compilateurReel });
    egal(r.verdict, "PASS", JSON.stringify(r.constats).slice(0, 300)); egal(r.installes.join(), "reseau.md");
    writeFileSync(join(sources, "reseau.yaml"), source("Read, Grep, Edit, Write"));
    egal(compiler({ sources, agents, oracle: oracleReel, compilateur: compilateurReel }).verdict, "PASS");
  });
}

// ---- TF-2554 et TF-2549 (14/11/2026) : ce que deux agents de la flotte NE FONT PAS se tient par leur définition, pas par la consigne -----
// Le fait : 2 relecteurs génériques sur 2 ont écrit des fichiers temporaires malgré « aucune écriture » (TF-2554), et un `verificateur` a écrit
// l'entrée 84 d'un ledger en testant son écrivain (TF-2549). Le `relecteur` n'a donc NI Write, NI Edit, NI shell (un shell écrit par redirection) ;
// l'arbitre du `verificateur` lui interdit d'exécuter un écrivain de ledger. Joués sur les VRAIES définitions du dépôt (source et agent installé).
{
  const RACINE = join(ICI, "..");
  const lire = (...p) => readFileSync(join(RACINE, ...p), "utf8").replace(/\r\n/g, "\n");
  const outilsSource = (t) => (/^outils:\s*\[(.*)\]\s*$/m.exec(t) || [, ""])[1].split(",").map((s) => s.trim()).filter(Boolean);
  const outilsInstalles = (t) => (/^tools:\s*(.*)$/m.exec(t) || [, ""])[1].split(",").map((s) => s.trim()).filter(Boolean);
  const INTERDITS_RELECTEUR = ["Write", "Edit", "NotebookEdit", "Bash", "PowerShell"];
  const ecrivains = (t) => INTERDITS_RELECTEUR.filter((o) => t.includes(o));
  const LIGNE_LEDGER = /Aucun écrivain de ledger n'est exécuté/;
  check("TF-2554 vert — le relecteur n'a ni Write, ni Edit, ni shell, dans sa source ET dans l'agent installé ; il lit (Read, Grep, Glob)", () => {
    const src = outilsSource(lire("gabarits", "flotte", "relecteur.yaml")), inst = outilsInstalles(lire(".claude", "agents", "relecteur.md"));
    vrai(ecrivains(src).length === 0 && ecrivains(inst).length === 0, `outils d'écriture ou de shell : source ${src}, installé ${inst}`);
    vrai(["Read", "Grep", "Glob"].every((o) => src.includes(o) && inst.includes(o)), `le relecteur ne lit plus : ${src} / ${inst}`);
    vrai(src.join() === inst.join(), `la source et l'agent installé divergent : ${src} / ${inst}`);
  });
  check("TF-2554 rouge — un relecteur qui regagne Write, Edit ou un shell est refusé par le contrôle (le témoin voit la chirurgie)", () => {
    const src = lire("gabarits", "flotte", "relecteur.yaml");
    for (const outil of ["Write", "Edit", "Bash", "PowerShell"]) {
      const mutant = src.replace(/^outils:\s*\[(.*)\]\s*$/m, (_m, o) => `outils: [${o}, ${outil}]`);
      vrai(mutant !== src, "chirurgie sans effet : le témoin est vide");
      vrai(ecrivains(outilsSource(mutant).join()).includes(outil), `${outil} regagné sans que le contrôle le voie`);
    }
  });
  check("TF-2549 vert — le verificateur interdit d'exécuter un écrivain de ledger, dans sa source ET dans l'agent installé, et garde son shell", () => {
    vrai(LIGNE_LEDGER.test(lire("gabarits", "flotte", "verificateur.yaml")), "la source ne porte pas l'interdiction");
    vrai(LIGNE_LEDGER.test(lire(".claude", "agents", "verificateur.md")), "l'agent installé ne porte pas l'interdiction : recompiler (node scripts\\compiler-flotte.mjs)");
    vrai(outilsInstalles(lire(".claude", "agents", "verificateur.md")).includes("Bash"), "le verificateur a perdu son shell : rejouer une recette est son rôle");
  });
  check("TF-2549 rouge — sans la ligne de l'arbitre, le contrôle voit l'interdiction manquer", () => {
    const mutant = lire("gabarits", "flotte", "verificateur.yaml").replace(/^ {2}- "Aucun écrivain de ledger n'est exécuté[^\n]*\n/m, "");
    vrai(mutant !== lire("gabarits", "flotte", "verificateur.yaml") && !LIGNE_LEDGER.test(mutant), "la chirurgie n'a pas retiré la ligne");
  });
}

rmSync(T, { recursive: true, force: true });
console.log(`\ncompiler-flotte.test : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
