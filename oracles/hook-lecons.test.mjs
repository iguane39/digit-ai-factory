#!/usr/bin/env node
/**
 * hook-lecons.test.mjs — la leçon rappelée au geste qui la déclenche (TF-2150, D-172 (a) du 04/11/2026).
 *
 * Sens rouge (le hook parle) : sur la table RÉELLE du pilot, chaque leçon est servie sur un geste de sa forme mesurée
 * (heredoc long ou porteur d'antislashs, `git push` filtré, accent grave que Bash exécute, registre écrit par Write
 * ou par `>>`) ; le texte cite la leçon comme une donnée et tient sous 600 caractères ; une ligne entre au journal.
 * Sur un pilot jetable : une barrière est REFUSÉE au pilot (exit 2, motif et solution préférée) et AVERTIE chez un
 * produit (exit 0) ; une leçon du produit est servie chez lui ; la preuve morte tait la leçon ; un motif invalide, une
 * table illisible ou hors schéma ne bloquent rien ; 5 leçons qui correspondent n'en servent que 3.
 * Sens vert (rien n'est servi) : hors motif, chaîne citée, heredoc court (même suivi d'une longue commande qui porte un
 * chemin Windows : le motif est borné au corps du heredoc), push vers un fichier, lecture de
 * `.git/hooks/pre-push`, accent grave entre guillemets simples ou échappé, heredoc à délimiteur cité, fixture jetable
 * `$T/todo/TODO.jsonl`, outil hors liste, leçon suspendue, entrée illisible.
 * Remède JOUÉ (TF-1013) : la barrière du heredoc refuse le geste ; le contenu écrit par l'outil Write puis lancé par
 * son chemin passe et garde ses antislashs ; le `git push` vers un fichier passe la barrière du push filtré.
 * Lancement d'agent (TF-1947) : la leçon L-006 est servie à un lancement par l'outil Agent ou Task, d'un produit comme
 * du pilot (le journal garde la description comme geste), et pas à une relecture d'intention (description qui COMMENCE par
 * « Relecture d'intention », casse et espaces en tête sans effet) ni à un outil voisin ; le matcher de `.claude/settings.json`
 * et celui de `gabarits/settings-produit.json` couvrent Agent et Task ; la commande de sa solution préférée
 * (`hook-restitution.mjs --prejuger`) est jouée sur un brouillon et le refuse.
 * Durée : 20 appels du hook réel sur un geste qui sert une leçon, médiane sous 300 ms.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { nettoyer, texteLecon, PLAFOND_LECON } from "./hook-lecons.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-lecons.mjs");
const TABLE = JSON.parse(readFileSync(join(ICI, "..", "references", "LECONS.json"), "utf8"));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const base = mkdtempSync(join(tmpdir(), "hook-lecons-"));

/** Joue un hook (le réel par défaut) sur une entrée ; la racine du projet est `racine` (jamais le vrai pilot). */
function jouer(entree, racine, hook = HOOK) {
  const env = { ...process.env, CLAUDE_PROJECT_DIR: racine };
  const debut = process.hrtime.bigint();
  const r = spawnSync(process.execPath, [hook], { encoding: "utf8", cwd: racine, env, input: typeof entree === "string" ? entree : JSON.stringify({ cwd: racine, session_id: "S-test", ...entree }) });
  const ms = Number(process.hrtime.bigint() - debut) / 1e6;
  let contexte = "";
  try { contexte = JSON.parse(r.stdout || "{}").hookSpecificOutput?.additionalContext || ""; } catch { contexte = `<stdout illisible : ${r.stdout}>`; }
  return { code: r.status, out: r.stdout || "", err: r.stderr || "", contexte, ms };
}
const bash = (command) => ({ tool_name: "Bash", tool_input: { command } });
const ps = (command) => ({ tool_name: "PowerShell", tool_input: { command } });
const ecrit = (file_path, content = "x") => ({ tool_name: "Write", tool_input: { file_path, content } });
/** Un lancement d'agent : l'outil Agent (ou Task), sa description, son type et sa consigne. */
const agent = (description, outil = "Agent") => ({ tool_name: outil, tool_input: { description, subagent_type: "campagne", prompt: "Corrige le sujet et rends le rapport." } });
const lecons = (contexte) => [...contexte.matchAll(/Leçon (L-\d+)/g)].map((m) => m[1]);

/** Une racine en mode pilot (elle porte `todo/TODO.jsonl`) ou produit (elle porte `forge/`). */
function racinePilot(nom) {
  const p = join(base, nom);
  mkdirSync(join(p, "todo"), { recursive: true });
  mkdirSync(join(p, ".claude"), { recursive: true });
  writeFileSync(join(p, "todo", "TODO.jsonl"), "", "utf8");
  return p;
}
function racineProduit(nom, leconsProduit = null) {
  const p = join(base, nom);
  mkdirSync(join(p, "forge"), { recursive: true });
  if (leconsProduit) writeFileSync(join(p, "forge", "LECONS.jsonl"), leconsProduit.map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");
  return p;
}
/** Un pilot JETABLE : le hook copié à côté de sa table et de son registre de fixture. */
function piloteFixture(nom, { table, registre = ["TF-9001"], archive = [], fichiers = {} }) {
  const p = racinePilot(nom);
  mkdirSync(join(p, "oracles"), { recursive: true });
  mkdirSync(join(p, "references"), { recursive: true });
  for (const f of ["hook-lecons.mjs", "lib-racine-projet.mjs"]) copyFileSync(join(ICI, f), join(p, "oracles", f));
  writeFileSync(join(p, "references", "LECONS.json"), typeof table === "string" ? table : JSON.stringify(table, null, 2), "utf8");
  writeFileSync(join(p, "todo", "TODO.jsonl"), registre.map((id) => JSON.stringify({ ev: "creation", id, titre: "fixture" })).join("\n") + "\n", "utf8");
  writeFileSync(join(p, "todo", "TODO-ARCHIVE.jsonl"), archive.map((id) => JSON.stringify({ ev: "creation", id, titre: "fixture" })).join("\n") + "\n", "utf8");
  for (const [rel, contenu] of Object.entries(fichiers)) { mkdirSync(dirname(join(p, rel)), { recursive: true }); writeFileSync(join(p, rel), contenu, "utf8"); }
  return { racine: p, hook: join(p, "oracles", "hook-lecons.mjs") };
}
const lecon = (id, extra = {}) => ({
  id, classe: "oracle-faux-positif", symptome: `symptôme de la fixture ${id}`,
  declencheur: { outils: ["Bash"], sur: "commande", motif: `\\bgeste-${id.toLowerCase()}\\b` },
  solutions: [{ texte: `voie préférée de ${id}`, condition: "toujours", preferee: true }, { texte: `voie de repli de ${id}`, condition: "parfois", preferee: false }],
  preuve: { type: "registre", id: "TF-9001" }, portee: "generique", statut: "rappel", revue_le: "2099-01-01", source: "fixture de recette", ...extra,
});
const table = (...ls) => ({ schema: "lecons@1", version: "1.0.0", date: "2026-11-04", lecons: ls });

try {
  const rp = racinePilot("pilot-reel");
  const HEREDOC_WINDOWS = "cat > mesure.mjs <<'EOF'\nconst p = 'C:\\dev\\digit-ai-factory\\oracles';\nconsole.log(p);\nEOF";
  const HEREDOC_TF1300 = "cat > mesure.mjs <<'EOF'\nconst re = new RegExp(cle + \"\\\\b\");\nEOF";
  const HEREDOC_LONG = `cat > notes.txt <<'EOF'\n${"ligne sans antislash ni accent grave. ".repeat(90)}\nEOF`;

  // --- Sens rouge : la table RÉELLE du pilot, une forme mesurée par leçon ---------------------------------------
  const ROUGES = [
    [bash(HEREDOC_WINDOWS), "L-001", "heredoc qui porte un chemin Windows"],
    [bash(HEREDOC_TF1300), "L-001", "heredoc qui porte un antislash doublé (la forme de TF-1300)"],
    [bash(HEREDOC_LONG), "L-001", "heredoc de plus de 3 000 caractères sans antislash"],
    [bash("git push origin main 2>&1 | tail -5"), "L-002", "git push filtré par tail (forme du 02/11/2026)"],
    [bash("S=/tmp/x; git push origin main 2>&1 | tee \"$S/push.log\" | tail -5"), "L-002", "git push filtré par tee puis tail (forme du 29/10/2026)"],
    [bash("git -C \"C:/dev/un depot\" push 2>&1 | grep -v Writing"), "L-002", "git -C <chemin cité> push filtré"],
    [ps("git push origin main 2>&1 | Select-Object -Last 3"), "L-002", "git push filtré sous PowerShell"],
    [bash("node -e \"console.log(`date`)\""), "L-003", "accent grave dans un node -e entre guillemets doubles"],
    [bash("node -e 'const t = \"l'oracle\"; console.log(\"`node oracles/self-tests.mjs` PASS\")'"), "L-003", "accent grave après une apostrophe qui ferme la chaîne simple (forme du 29/10/2026)"],
    [bash("git commit -m \"corrige `hook-lecons.mjs`\""), "L-003", "accent grave dans un message de commit entre guillemets doubles"],
    [bash("cat > note.md <<EOF\nla commande `date` dit l'heure\nEOF"), "L-003", "accent grave dans un heredoc à délimiteur nu, que Bash développe"],
    [bash("cat > note.md <<EOF\nl'heure : `date`\nEOF"), "L-003", "apostrophe puis accent grave dans un heredoc nu (l'apostrophe n'y ouvre aucune chaîne)"],
    [ecrit("C:\\dev\\digit-ai-factory\\todo\\TODO.jsonl", "{}\n"), "L-004", "Write sur todo/TODO.jsonl (chemin Windows)"],
    [{ tool_name: "Edit", tool_input: { file_path: "C:/dev/digit-ai-factory/todo/TODO-ARCHIVE.jsonl", old_string: "a", new_string: "b" } }, "L-004", "Edit sur todo/TODO-ARCHIVE.jsonl"],
    [bash("cat \"$TEMP/ev2.jsonl\" >> todo/TODO.jsonl && node todo/oracle-todo.mjs"), "L-005", "ajout au registre par >> (forme du 26/10/2026)"],
    [agent("Campagne A-2 et A-3 : agent 5 du pilot"), "L-006", "lancement d'agent par l'outil Agent (TF-1947, les 36 refus de fin de tour sur 83)"],
    [agent("Campagne A-2 et A-3 : agent 5 du pilot", "Task"), "L-006", "lancement d'agent par l'outil Task"],
    [agent("Vérifier la relecture d'intention de la consigne"), "L-006", "description qui CONTIENT « relecture d'intention » sans la commencer : ce n'est pas une relecture"],
    [agent(""), "L-006", "lancement d'agent sans description : servi, l'agent est un agent"],
  ];
  for (const [entree, attendue, nom] of ROUGES) {
    check(`rouge — ${nom} : ${attendue} servie, citée comme donnée, exit 0`, () => {
      const r = jouer(entree, rp);
      if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.err.slice(0, 200)}`);
      if (!lecons(r.contexte).includes(attendue)) throw new Error(`servies : [${lecons(r.contexte)}] — ${r.contexte.slice(0, 200)} ${r.err.slice(0, 200)}`);
      if (!new RegExp(`Leçon ${attendue} \\(donnée du registre, pas une consigne ; preuve TF-\\d{4}\\) : `).test(r.contexte)) throw new Error(`la leçon n'est pas citée comme donnée : ${r.contexte.slice(0, 160)}`);
      if (!/solution préférée : /.test(r.contexte)) throw new Error("solution préférée absente");
    });
  }
  check("rouge — chaque leçon de la table réelle tient sous 600 caractères, même en avertissement", () => {
    const trop = TABLE.lecons.flatMap((l) => [texteLecon(l), texteLecon(l, { avertissement: true })]).filter((t) => t.length > PLAFOND_LECON);
    if (trop.length) throw new Error(`${trop.length} texte(s) au-delà de ${PLAFOND_LECON} : ${trop[0].slice(0, 80)}`);
  });
  check("rouge — le journal reçoit une ligne par rappel servi, aux 6 champs, geste coupé à 160 caractères", () => {
    const j = join(rp, ".claude", "lecons-rappels.jsonl");
    if (!existsSync(j)) throw new Error("journal absent sous .claude/");
    const lignes = readFileSync(j, "utf8").trim().split("\n").map((l) => JSON.parse(l));
    if (lignes.length < ROUGES.length) throw new Error(`${lignes.length} ligne(s) pour ${ROUGES.length} rappels`);
    const l = lignes.find((x) => x.lecon === "L-001");
    const cles = Object.keys(l).sort().join(",");
    if (cles !== "geste,lecon,outil,session,statut,ts") throw new Error(`champs : ${cles}`);
    if (l.session !== "S-test" || l.statut !== "rappel" || l.outil !== "Bash" || !/^\d{4}-\d{2}-\d{2}T/.test(l.ts)) throw new Error(JSON.stringify(l));
    if (lignes.some((x) => x.geste.length > 160)) throw new Error("un geste dépasse 160 caractères");
  });
  check("rouge — chez un produit, la table du pilot est servie et le journal s'écrit sous forge/", () => {
    const p = racineProduit("produit-reel");
    const r = jouer(bash("git push 2>&1 | tail -3"), p);
    if (r.code !== 0 || !lecons(r.contexte).includes("L-002")) throw new Error(`exit ${r.code} ${r.contexte.slice(0, 120)} ${r.err.slice(0, 200)}`);
    if (!existsSync(join(p, "forge", "lecons-rappels.jsonl"))) throw new Error("journal absent sous forge/");
  });

  check("rouge — chez un produit, le lancement d'un agent sert L-006 et le journal garde la description comme geste", () => {
    const p = racineProduit("produit-agent");
    const r = jouer(agent("Campagne du produit : agent 2"), p);
    if (r.code !== 0 || !lecons(r.contexte).includes("L-006")) throw new Error(`exit ${r.code} ${r.contexte.slice(0, 120)} ${r.err.slice(0, 200)}`);
    const l = readFileSync(join(p, "forge", "lecons-rappels.jsonl"), "utf8").trim().split("\n").map((x) => JSON.parse(x)).find((x) => x.lecon === "L-006");
    if (!l || l.outil !== "Agent" || l.geste !== "Campagne du produit : agent 2") throw new Error(JSON.stringify(l));
  });
  check("rouge — L-006 dit la règle : le tour qui a écrit se clôt par la restitution complète, préjugée, jamais par un message d'attente", () => {
    const t = jouer(agent("Campagne A-2"), rp).contexte;
    for (const motif of [/tour qui a écrit/, /restitution complète/, /hook-restitution\.mjs --prejuger <fichier>/, /jamais par un message d'attente/, /preuve TF-1947/]) {
      if (!motif.test(t)) throw new Error(`absent : ${motif} — ${t.slice(0, 300)}`);
    }
  });
  check("remède joué — la commande de la solution préférée de L-006 existe et juge un brouillon (JSON `hook-restitution --prejuger`, un brouillon sans bloc refusé)", () => {
    const brouillon = join(base, "brouillon-attente.md");
    writeFileSync(brouillon, "J'attends la fin des agents.\n", "utf8");
    const r = spawnSync(process.execPath, [join(ICI, "hook-restitution.mjs"), "--prejuger", brouillon], { encoding: "utf8", cwd: base, env: { ...process.env, CLAUDE_PROJECT_DIR: base } });
    let j = null;
    try { j = JSON.parse(r.stdout); } catch { /* sortie non JSON */ }
    if (!j || j.outil !== "hook-restitution --prejuger" || j.affichable !== false || r.status !== 1) throw new Error(`exit ${r.status} ${String(r.stdout).slice(0, 200)} ${String(r.stderr).slice(0, 200)}`);
  });

  // --- Câblage (TF-1947) : l'outil Agent et l'outil Task sont au matcher de hook-lecons, au pilot et au gabarit produit ---
  /** Un matcher de hook couvre un outil quand l'expression, ancrée, le reconnaît. */
  const couvre = (matcher, outil) => new RegExp(`^(?:${matcher})$`).test(outil);
  const matcherDe = (fichier, commande) => {
    const j = JSON.parse(readFileSync(join(ICI, "..", fichier), "utf8"));
    const groupe = (j.hooks?.PreToolUse || []).find((g) => (g.hooks || []).some((h) => commande.test(String(h.command || ""))));
    return groupe?.matcher ?? null;
  };
  check("rouge — l'ancien matcher (Bash|PowerShell|Write|Edit|MultiEdit) ne couvre ni Agent ni Task : le cas rouge du câblage", () => {
    const ancien = "Bash|PowerShell|Write|Edit|MultiEdit";
    if (couvre(ancien, "Agent") || couvre(ancien, "Task") || !couvre(ancien, "Bash")) throw new Error("la fonction couvre() ne distingue pas l'ancien matcher");
  });
  for (const [fichier, commande] of [[".claude/settings.json", /oracles\/hook-lecons\.mjs/], ["gabarits/settings-produit.json", /factory\.mjs\\?"? lecons\b/]]) {
    check(`vert — ${fichier} : le matcher du hook des leçons couvre Agent, Task et les 5 outils de départ`, () => {
      const m = matcherDe(fichier, commande);
      if (m === null) throw new Error("hook des leçons introuvable sous PreToolUse");
      for (const o of ["Bash", "PowerShell", "Write", "Edit", "MultiEdit", "Agent", "Task"]) if (!couvre(m, o)) throw new Error(`${o} non couvert par « ${m} »`);
    });
  }

  // --- Sens vert : la table réelle ne dit rien hors de ses formes ------------------------------------------------
  const VERTS = [
    [bash("cat > court.txt <<'EOF'\nbonjour\nEOF"), "heredoc court, sans antislash"],
    [bash(`cat > court.txt <<'EOF'\nbonjour\nEOF\nnode C:\\dev\\outil.mjs --note ${"z".repeat(3100)}`), "heredoc court suivi d'une longue commande et d'un chemin Windows HORS du heredoc (motif borné au corps)"],
    [bash("git push origin main > \"$S/push.log\" 2>&1; tail -5 \"$S/push.log\""), "git push vers un fichier, lu ensuite (le remède de L-002)"],
    [bash("git commit -m \"ne jamais faire git push | tail\""), "chaîne citée : git push | tail dans un message de commit"],
    [bash("git commit -F - <<'EOF'\nretire le filtre de git push | tail\nEOF"), "chaîne citée : git push | tail dans le corps d'un heredoc"],
    [bash("cat .git/hooks/pre-push | head -40"), "lecture de .git/hooks/pre-push filtrée (le faux positif mesuré du premier motif)"],
    [bash("git log --oneline -3 | cat"), "git log filtré, pas un push"],
    [bash("echo 'la commande `date` reste citée'"), "accent grave entre guillemets simples"],
    [bash("node -e \"console.log('\\`x\\`')\""), "accent grave échappé dans des guillemets doubles"],
    [bash("git commit -m \"$(cat <<'EOF'\ncorrige `hook-lecons.mjs`\nEOF\n)\""), "accent grave dans un heredoc à délimiteur cité, dans une substitution"],
    [ps("Write-Host \"a`tb\""), "accent grave de PowerShell (son échappement), hors Bash"],
    [ecrit("C:\\dev\\digit-ai-factory\\todo\\NOTES.md"), "Write hors du registre"],
    [bash("T=/tmp/f && mkdir -p $T/todo && : > $T/todo/TODO.jsonl"), "fixture jetable $T/todo/TODO.jsonl"],
    [{ tool_name: "Read", tool_input: { file_path: "C:/dev/digit-ai-factory/todo/TODO.jsonl" } }, "outil hors liste (Read)"],
    [agent("Relecture d'intention de la consigne de la campagne A-2 et A-3"), "relecture d'intention lancée par l'outil Agent : la leçon ne se déclenche pas"],
    [agent("  relecture d'intention : livrable de l'agent 4", "Task"), "relecture d'intention lancée par l'outil Task, casse et espaces en tête sans effet"],
    [{ tool_name: "SendMessage", tool_input: { description: "Campagne A-2", message: "x" } }, "outil voisin de l'agent (SendMessage) : hors liste"],
  ];
  for (const [entree, nom] of VERTS) {
    check(`vert — ${nom} : rien servi, exit 0`, () => {
      const r = jouer(entree, rp);
      if (r.code !== 0 || r.contexte) throw new Error(`exit ${r.code}, servies [${lecons(r.contexte)}] ${r.contexte.slice(0, 160)}`);
    });
  }
  check("vert — entrée illisible : exit 0, rien sur stdout", () => {
    const r = jouer("{ pas du json", rp);
    if (r.code !== 0 || r.out) throw new Error(`exit ${r.code} ${r.out.slice(0, 80)}`);
  });

  // --- Analyse des chaînes ---------------------------------------------------------------------------------------
  check("rouge — nettoyer : `retirees` ôte chaînes, corps de heredoc et commentaires ; `interpretees` garde ce que Bash développe", () => {
    const c = "git push | tail # git push | tail\necho 'a `b`' \"c `d`\"\ncat <<'EOF'\n`e`\nEOF\ncat <<EOF\n`f`\nEOF";
    const r = nettoyer(c, "retirees");
    if (/`/.test(r) || (r.match(/git push/g) || []).length !== 1) throw new Error(JSON.stringify(r));
    const i = nettoyer(c, "interpretees");
    if (!i.includes("\"c `d`\"") || !i.includes("`f`") || i.includes("`b`") || i.includes("`e`")) throw new Error(JSON.stringify(i));
    const p = nettoyer("Write-Host @'\ngit push | tail\n'@\n<# git push | tail #>\ngit status", "retirees", "powershell");
    if (/push/.test(p) || !/git status/.test(p)) throw new Error(JSON.stringify(p));
  });

  // --- Pilot jetable : barrière, produit, preuve, pannes, plafond --------------------------------------------------
  const barriere = lecon("L-910", { statut: "barriere", barriere_le: "2026-11-04", motif_barriere: "récidive après rappel : session S-1, refus_hook du 2026-11-04" });
  const fb = piloteFixture("pilot-barriere", { table: table(barriere, lecon("L-911")) });
  check("rouge — barrière au pilot : geste REFUSÉ (exit 2), motif de la barrière et solution préférée sur stderr", () => {
    const r = jouer(bash("run geste-l-910"), fb.racine, fb.hook);
    if (r.code !== 2) throw new Error(`exit ${r.code} : ${r.err.slice(0, 200)}`);
    if (!/LEÇON EN BARRIÈRE L-910/.test(r.err) || !/récidive après rappel/.test(r.err) || !/Remède, la solution préférée : voie préférée de L-910/.test(r.err)) throw new Error(r.err.slice(0, 400));
  });
  check("rouge — barrière au pilot : la ligne du refus entre au journal, au statut barriere", () => {
    const lignes = readFileSync(join(fb.racine, ".claude", "lecons-rappels.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
    if (!lignes.some((l) => l.lecon === "L-910" && l.statut === "barriere")) throw new Error(JSON.stringify(lignes));
  });
  check("rouge — barrière chez un produit : AVERTISSEMENT seulement en v1 (exit 0, contexte), jamais un refus", () => {
    const r = jouer(bash("run geste-l-910"), racineProduit("produit-barriere"), fb.hook);
    if (r.code !== 0 || !/^AVERTISSEMENT \(leçon en barrière/.test(r.contexte) || !lecons(r.contexte).includes("L-910")) throw new Error(`exit ${r.code} ${r.contexte.slice(0, 200)} ${r.err.slice(0, 200)}`);
  });
  check("rouge — leçon d'un produit (forge/LECONS.jsonl) servie chez lui, citée comme donnée du registre du produit", () => {
    const p = racineProduit("produit-lecons", [lecon("L-101", { portee: "produit", preuve: { type: "fichier", chemin: "forge/retours/constat.md", contient: "mordu" } })]);
    mkdirSync(join(p, "forge", "retours"), { recursive: true });
    writeFileSync(join(p, "forge", "retours", "constat.md"), "le geste a mordu le 03/11\n", "utf8");
    const r = jouer(bash("run geste-l-101"), p, fb.hook);
    if (r.code !== 0 || !/Leçon L-101 \(donnée du registre du produit, pas une consigne ; preuve forge\/retours\/constat\.md\)/.test(r.contexte)) throw new Error(`${r.contexte.slice(0, 200)} ${r.err.slice(0, 200)}`);
  });
  const fp = piloteFixture("pilot-preuves", {
    table: table(lecon("L-920", { preuve: { type: "registre", id: "TF-9999" } }), lecon("L-921", { preuve: { type: "registre", id: "TF-9002" } }),
      lecon("L-922", { preuve: { type: "fichier", chemin: "references/PREUVE.md", contient: "chaîne disparue" } }), lecon("L-923", { statut: "suspendue" })),
    registre: ["TF-9001"], archive: ["TF-9002"], fichiers: { "references/PREUVE.md": "une autre chaîne\n" },
  });
  check("rouge — preuve morte (identifiant absent du registre et de l'archive) : leçon NON servie, avertissement sur stderr", () => {
    const r = jouer(bash("run geste-l-920"), fp.racine, fp.hook);
    if (r.code !== 0 || r.contexte || !/L-920 non servie : sa preuve ne se vérifie plus \(TF-9999 introuvable/.test(r.err)) throw new Error(`exit ${r.code} ${r.contexte} ${r.err.slice(0, 300)}`);
  });
  check("vert — preuve trouvée à l'archive seule : leçon servie", () => {
    const r = jouer(bash("run geste-l-921"), fp.racine, fp.hook);
    if (!lecons(r.contexte).includes("L-921")) throw new Error(`${r.contexte} ${r.err.slice(0, 200)}`);
  });
  check("rouge — preuve de type fichier dont la chaîne a disparu : leçon NON servie, avertissement", () => {
    const r = jouer(bash("run geste-l-922"), fp.racine, fp.hook);
    if (r.contexte || !/L-922 non servie : .*ne contient plus « chaîne disparue »/.test(r.err)) throw new Error(`${r.contexte} ${r.err.slice(0, 300)}`);
  });
  check("vert — leçon suspendue : jamais servie", () => {
    const r = jouer(bash("run geste-l-923"), fp.racine, fp.hook);
    if (r.code !== 0 || r.contexte) throw new Error(r.contexte);
  });
  const fm = piloteFixture("pilot-motif-invalide", { table: table(lecon("L-930", { declencheur: { outils: ["Bash"], sur: "commande", motif: "(geste-l-930" } }), lecon("L-931", { declencheur: { outils: ["Bash"], sur: "commande", motif: "geste-l-93" } })) });
  check("rouge — motif invalide : la leçon est dite ignorée sur stderr, les autres restent servies, exit 0", () => {
    const r = jouer(bash("run geste-l-930"), fm.racine, fm.hook);
    if (r.code !== 0 || !/L-930 : motif invalide/.test(r.err) || !lecons(r.contexte).includes("L-931")) throw new Error(`exit ${r.code} ${r.contexte.slice(0, 120)} ${r.err.slice(0, 200)}`);
  });
  for (const [nom, contenu, motif] of [["illisible", "{ pas du json", /table des leçons illisible/], ["hors schéma", JSON.stringify({ schema: "autre@1", lecons: [] }), /hors schéma lecons@1/]]) {
    const f = piloteFixture(`pilot-table-${nom.replace(/\W/g, "")}`, { table: contenu });
    check(`rouge — table ${nom} : aucun blocage (exit 0), rien servi, la panne dite sur stderr`, () => {
      const r = jouer(bash("run geste-l-910"), f.racine, f.hook);
      if (r.code !== 0 || r.out || !motif.test(r.err)) throw new Error(`exit ${r.code} ${r.out.slice(0, 80)} ${r.err.slice(0, 200)}`);
    });
  }
  const longue = (id) => lecon(id, {
    declencheur: { outils: ["Bash"], sur: "commande", motif: "geste-commun" }, symptome: "un symptôme très long ".repeat(30),
    solutions: [{ texte: "solution préférée très longue ".repeat(15), condition: "toujours", preferee: true }, { texte: "autre ".repeat(40), condition: "parfois", preferee: false }],
  });
  const fl = piloteFixture("pilot-plafond", { table: table(longue("L-941"), longue("L-942"), longue("L-943"), longue("L-944"), longue("L-945")) });
  check("rouge — plafond : 5 leçons correspondent, 3 servies, chacune 600 caractères au plus, les 2 autres nommées", () => {
    const r = jouer(bash("run geste-commun"), fl.racine, fl.hook);
    const blocs = r.contexte.split("\n");
    const servies = blocs.filter((b) => /^Leçon L-\d+/.test(b));
    if (servies.length !== 3) throw new Error(`${servies.length} leçon(s) servies`);
    if (servies.some((b) => b.length > 600)) throw new Error(`longueurs ${servies.map((b) => b.length)}`);
    if (!/2 autre\(s\) leçon\(s\) correspondent aussi : L-944, L-945/.test(r.contexte)) throw new Error(blocs.at(-1));
  });

  // --- Le remède JOUÉ (TF-1013) : la solution préférée passe la barrière et donne le bon résultat -----------------
  const heredocBarriere = { ...TABLE.lecons.find((l) => l.id === "L-001"), statut: "barriere", barriere_le: "2026-11-04", motif_barriere: "récidive de banc" };
  const pushBarriere = { ...TABLE.lecons.find((l) => l.id === "L-002"), statut: "barriere", barriere_le: "2026-11-04", motif_barriere: "récidive de banc" };
  const fr = piloteFixture("pilot-remede", { table: table(heredocBarriere, pushBarriere), registre: ["TF-1300", "TF-1360"] });
  check("remède joué — heredoc en barrière refusé ; Write puis `node <chemin>` passent, et le fichier garde ses antislashs", () => {
    const contenu = "const p = 'C:\\\\dev\\\\digit-ai-factory';\nconsole.log(p);\n";
    const refus = jouer(bash(`cat > mesure.mjs <<'EOF'\n${contenu}EOF`), fr.racine, fr.hook);
    if (refus.code !== 2 || !/LEÇON EN BARRIÈRE L-001/.test(refus.err) || !/outil Write/.test(refus.err)) throw new Error(`exit ${refus.code} ${refus.err.slice(0, 200)}`);
    const cible = join(fr.racine, "mesure.mjs");
    const viaWrite = jouer(ecrit(cible, contenu), fr.racine, fr.hook);
    writeFileSync(cible, contenu, "utf8"); // ce que fait l'outil Write : les octets tels quels
    const lance = jouer(bash(`node "${cible}"`), fr.racine, fr.hook);
    if (viaWrite.code !== 0 || viaWrite.contexte || lance.code !== 0 || lance.contexte) throw new Error(`Write exit ${viaWrite.code}, node exit ${lance.code}`);
    const sortie = spawnSync(process.execPath, [cible], { encoding: "utf8" }).stdout.trim();
    if (sortie !== "C:\\dev\\digit-ai-factory") throw new Error(`le fichier a perdu ses antislashs : ${sortie}`);
  });
  check("remède joué — git push filtré en barrière refusé ; le même envoi vers un fichier passe", () => {
    const refus = jouer(bash("git push origin main 2>&1 | tail -5"), fr.racine, fr.hook);
    const remede = jouer(bash("git push origin main > push.log 2>&1; tail -5 push.log; git rev-list --count origin/main..HEAD"), fr.racine, fr.hook);
    if (refus.code !== 2 || !/LEÇON EN BARRIÈRE L-002/.test(refus.err)) throw new Error(`refus exit ${refus.code}`);
    if (remede.code !== 0 || remede.contexte) throw new Error(`remède exit ${remede.code} ${remede.err.slice(0, 200)}`);
  });

  // --- L-007 (TF-2416, RT-60 de Produit-84, 3e occurrence de RT-58) : UN CONTRÔLE ET UNE REMISE DANS LA MÊME COMMANDE, SUR LA TABLE RÉELLE ----------
  // Le fait : le 10/11/2026, `check_markdown.py`, `git commit` et `git push` joués dans une même commande, le contrôle rendant FAIL ; 2 copies de lot au sas, de même forme, les 04 et 09/11.
  // Rouge : la remise (commit, push, copie au sas) précédée d'un contrôle joué dans la commande est REFUSÉE au pilot (exit 2) et AVERTIE chez un produit (exit 0). Vert : le contrôle seul, la remise
  // seule, un nom de test seulement cité (`git add x.test.mjs`, un message de commit), la remise gardée par un `if … then`, la remise AVANT le contrôle, et le geste outillé `--remettre` ne sont pas touchés.
  const L007_ROUGES = [
    [bash("python scripts/check_markdown.py rapport.md ; git commit -m correctif ; git push"), "la forme du 10/11/2026 : check_markdown.py, commit et push joints par des points-virgules"],
    [bash("python scripts/check_markdown.py rapport.md && git commit -m correctif && git push origin main"), "les mêmes gestes joints par &&"],
    [bash("node forge/retours/oracle-lot.mjs lot.md ; cp lot.md input/00-retours/_arrivee/"), "la copie d'un lot au sas après son juge (la forme des 04 et 09/11)"],
    [bash("node oracles/hook-lecons.test.mjs\ngit commit -am suite"), "un test, puis un commit à la ligne suivante de la même commande"],
    [bash("node oracles/oracle-synthese.mjs f.md | tail -3 ; git -C C:/dev/depot push"), "un oracle filtré, puis git -C … push"],
    [ps("node oracles/oracle-x.mjs; Copy-Item lot.md input\\00-retours\\_arrivee\\"), "la copie au sas sous PowerShell"],
  ];
  for (const [entree, nom] of L007_ROUGES) {
    check(`rouge — L-007 en barrière au pilot : ${nom} → refus, exit 2`, () => {
      const r = jouer(entree, rp);
      if (r.code !== 2 || !/LEÇON EN BARRIÈRE L-007/.test(r.err)) throw new Error(`exit ${r.code} : ${r.err.slice(0, 200)} ${r.contexte.slice(0, 120)}`);
      if (!/jouer le contrôle seul/.test(r.err)) throw new Error("la solution préférée n'est pas dite au refus");
    });
  }
  check("rouge — chez un produit, la même remise est AVERTIE (exit 0), jamais refusée : L-007 est servie avec l'avertissement", () => {
    const p = racineProduit("produit-remise");
    const r = jouer(bash("python scripts/check_markdown.py rapport.md ; git commit -m correctif ; git push"), p);
    if (r.code !== 0 || !lecons(r.contexte).includes("L-007") || !/avertissement|barrière/i.test(r.contexte)) throw new Error(`exit ${r.code} ${r.contexte.slice(0, 200)} ${r.err.slice(0, 200)}`);
  });
  const L007_VERTS = [
    [bash("node oracles/oracle-synthese.mjs f.md"), "le contrôle joué seul (le remède : lire son verdict avant de remettre)"],
    [bash("git commit -F msg.txt"), "la remise jouée seule, après le verdict lu"],
    [bash("git add oracles/hook-lecons.test.mjs && git commit -F msg.txt"), "un fichier de test seulement NOMMÉ par git add, sans contrôle joué"],
    [bash("git commit -m \"corrige oracle-synthese.mjs, rejoué par node oracles/hook-x.test.mjs\""), "un contrôle seulement CITÉ dans le message de commit"],
    [bash("if node oracles/hook-lecons.test.mjs; then git commit -F msg.txt; fi"), "la remise gardée par un `if` sur le verdict (la forme du contrat, TF-1009)"],
    [bash("git push origin main > push.log 2>&1; node oracles/hook-lecons.test.mjs"), "la remise AVANT le contrôle : rien à garder"],
    [bash("node forge/retours/oracle-lot.mjs \"lot.md\" --remettre"), "le geste outillé --remettre, qui lie la copie au verdict (TF-2314)"],
  ];
  for (const [entree, nom] of L007_VERTS) {
    check(`vert — L-007 ne touche pas : ${nom}`, () => {
      const r = jouer(entree, rp);
      if (r.code !== 0 || lecons(r.contexte).includes("L-007") || /L-007/.test(r.err)) throw new Error(`exit ${r.code} ${r.contexte.slice(0, 160)} ${r.err.slice(0, 160)}`);
    });
  }
  check("remède joué — la remise refusée passe en deux gestes : le contrôle seul, puis la remise seule", () => {
    const refus = jouer(bash("python scripts/check_markdown.py rapport.md && git commit -F msg.txt"), rp);
    const controle = jouer(bash("python scripts/check_markdown.py rapport.md"), rp), remise = jouer(bash("git commit -F msg.txt"), rp);
    if (refus.code !== 2) throw new Error(`refus exit ${refus.code}`);
    if (controle.code !== 0 || remise.code !== 0 || /L-007/.test(controle.err + remise.err + controle.contexte + remise.contexte)) throw new Error(`contrôle exit ${controle.code}, remise exit ${remise.code}`);
  });

  // --- Durée : 20 appels du hook réel sur un geste qui sert une leçon ----------------------------------------------
  const rd = racinePilot("pilot-duree");
  const durees = Array.from({ length: 20 }, () => jouer(bash(HEREDOC_WINDOWS), rd).ms).sort((a, b) => a - b);
  const mediane = (durees[9] + durees[10]) / 2;
  const moyenne = durees.reduce((a, b) => a + b, 0) / durees.length;
  check(`vert — durée sur 20 appels du hook réel qui sert L-001 : médiane ${Math.round(mediane)} ms, moyenne ${Math.round(moyenne)} ms, max ${Math.round(durees[19])} ms (borne : médiane sous 300 ms)`, () => {
    if (mediane >= 300) throw new Error(`médiane ${Math.round(mediane)} ms`);
  });
} finally {
  try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ }
}

console.log(`\nhook-lecons : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
