#!/usr/bin/env node
/**
 * hook-renommage-livrable.test.mjs — un livrable sous output/ ne se renomme pas par `mv` : le hook refuse, le script renomme (TF-2737, D-236 (a) du 23/11/2026).
 *
 * Sens rouge : chaque forme de renommage d'un livrable que le hook déclare refuser (liste de son en-tête) est refusée, avec le motif qui nomme le script et la commande exacte construite sur
 * la source et la destination de la commande refusée : `mv`, `git mv` (dont `-C` et `cd`), `mv -t`, un motif `*.md`, `Move-Item` et `Rename-Item` (nommés, positionnels, alias, liste), un tuyau
 * qui lit sous output/, un code en ligne (`node -e`, `python -c`, `[System.IO.File]::Move`), `bash -c`, `cmd /c`, `powershell -Command`, un chemin absolu Windows ou Git Bash, un dossier de travail
 * déjà sous output/. Sens vert : un `mv` hors output/, un fichier DÉPOSÉ sous output/, une copie, le script lui-même, un message de commit ou un document ici qui CITE « mv output/… »,
 * un `echo` ou un `grep`, un README, un dossier. Le remède est JOUÉ (TF-1013) : la commande du motif de refus, exécutée dans un dépôt jetable, renomme, trace et laisse un renvoi qui se suit,
 * et elle passe le hook. Câblage : au pilot (`.claude/settings.json`), chez les produits (`gabarits/settings-produit.json` et le lanceur `gabarits/hooks-factory.mjs`).
 * Aucun renommage réel hors du dépôt jetable : le hook décide sur le texte. Joué par `oracles\self-tests.mjs` (I2).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decouper } from "./hook-fichiers-env.mjs";
import { fautesRenommageLivrable, juger, livrableSousOutput, SCRIPT_RENOMMAGE } from "./hook-renommage-livrable.mjs";
import { suivreRenommage } from "./lib-renommages-livrables.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-renommage-livrable.mjs");
const RACINE = join(ICI, "..");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (c, m) => { if (!c) throw new Error(m); };

const CWD = "C:/dev/produit";
const refuse = (commande, outil = "Bash", cwd = CWD) => juger({ tool_name: outil, cwd, tool_input: { command: commande } });

// ---- Sens rouge : [commande, outil, source attendue dans la commande exacte, cwd, nom] ----
const ROUGES = [
  ["mv \"output/04-plans/Produit - Etude - 20261123a.md\" output/04-plans/old/", "Bash", "output/04-plans/Produit - Etude - 20261123a.md", CWD, "mv vers old/ (nom à espaces entre guillemets)"],
  ["mv -f -- output/a.md output/b.md", "Bash", "output/a.md", CWD, "mv -f --"],
  ["mv -v output/a.md output/b.md", "Bash", "output/a.md", CWD, "mv -v"],
  ["mv -t output/old output/a.md output/b.md", "Bash", "output/a.md", CWD, "mv -t (deux sources)"],
  ["mv --target-directory=old output/a.md", "Bash", "output/a.md", CWD, "mv --target-directory="],
  ["mv output/*.md output/old/", "Bash", "output/*.md", CWD, "mv d'un motif de fichiers"],
  ["mv output/$f old/", "Bash", "output/$f", CWD, "mv d'une variable"],
  ["mv \"output/Produit - Étude - 20261123a.md\" \"output/Produit - Étude - 20261123b.md\"", "Bash", "output/Produit - Étude - 20261123a.md", CWD, "mv entre guillemets, nom accentué et à espaces"],
  ["git mv output/a.md output/b.md", "Bash", "output/a.md", CWD, "git mv"],
  ["git mv -f output/04-plans/a.md output/04-plans/old/", "Bash", "output/04-plans/a.md", CWD, "git mv -f vers old/"],
  ["git -C output/04-plans mv a.md old/", "Bash", "a.md", CWD, "git -C <dossier sous output> mv"],
  ["git -c core.quotepath=off mv output/a.md output/b.md", "Bash", "output/a.md", CWD, "git -c … mv"],
  ["cd output/04-plans && git mv a.md b.md", "Bash", "a.md", CWD, "cd output/… puis git mv"],
  ["cd output && mv a.md b.md", "Bash", "a.md", CWD, "cd output puis mv"],
  ["(cd output/04-plans; mv a.md b.md)", "Bash", "a.md", CWD, "sous-shell"],
  ["mv a.md b.md", "Bash", "a.md", "C:/dev/produit/output/04-plans", "mv relatif, dossier de travail sous output/"],
  ["mv /c/dev/produit/output/04-plans/a.md /c/dev/produit/output/old/", "Bash", "/c/dev/produit/output/04-plans/a.md", "C:/dev/autre", "mv, chemins Git Bash"],
  ["mv C:/dev/produit/output/a.md /tmp/", "Bash", "C:/dev/produit/output/a.md", "C:/dev/autre", "mv d'un livrable VERS l'extérieur"],
  ["Move-Item -Path output\\a.md -Destination output\\old\\", "PowerShell", "output\\a.md", CWD, "Move-Item -Path -Destination"],
  ["Move-Item -LiteralPath \"output\\a [1].md\" -Destination output\\old", "PowerShell", "output\\a [1].md", CWD, "Move-Item -LiteralPath"],
  ["Move-Item output\\a.md output\\b.md -Force", "PowerShell", "output\\a.md", CWD, "Move-Item positionnel"],
  ["mi output\\a.md old\\", "PowerShell", "output\\a.md", CWD, "alias mi"],
  ["move output\\a.md old\\", "PowerShell", "output\\a.md", CWD, "alias move"],
  ["Move-Item -Path output\\a.md,output\\b.md -Destination old\\", "PowerShell", "output\\b.md", CWD, "Move-Item, liste de deux livrables"],
  ["Move-Item -Pa:output\\a.md -De:old", "PowerShell", "output\\a.md", CWD, "Move-Item, paramètres abrégés avec deux-points"],
  ["Move-Item C:\\dev\\produit\\output\\04-plans\\a.md C:\\dev\\produit\\old\\", "PowerShell", "C:\\dev\\produit\\output\\04-plans\\a.md", "C:\\dev\\autre", "Move-Item, chemin absolu Windows"],
  ["Rename-Item -Path output\\a.md -NewName b.md", "PowerShell", "output\\a.md", CWD, "Rename-Item -Path -NewName"],
  ["Rename-Item output\\a.md b.md", "PowerShell", "output\\a.md", CWD, "Rename-Item positionnel"],
  ["rni -LiteralPath output\\a.md -NewName b.md", "PowerShell", "output\\a.md", CWD, "alias rni"],
  ["ren output\\a.md b.md", "PowerShell", "output\\a.md", CWD, "alias ren"],
  ["Get-ChildItem output\\*.md | Move-Item -Destination old", "PowerShell", "output\\*.md", CWD, "tuyau qui lit sous output/ puis Move-Item"],
  ["Get-ChildItem output\\04-plans | ForEach-Object { Move-Item $_.FullName old }", "PowerShell", "output\\04-plans", CWD, "ForEach-Object { Move-Item }"],
  ["ls output | xargs -I{} mv {} old/", "Bash", "output", CWD, "xargs mv"],
  ["node -e \"require('fs').renameSync('output/a.md', 'output/b.md')\"", "Bash", "output/a.md", CWD, "node -e renameSync"],
  ["python -c \"import os; os.rename('output/a.md', 'output/b.md')\"", "Bash", "output/a.md", CWD, "python -c os.rename"],
  ["python3 -c \"import shutil; shutil.move('output/a.md', 'old/a.md')\"", "Bash", "output/a.md", CWD, "python -c shutil.move"],
  ["[System.IO.File]::Move('C:\\dev\\produit\\output\\a.md', 'C:\\dev\\produit\\b.md')", "PowerShell", "C:\\dev\\produit\\output\\a.md", CWD, "[System.IO.File]::Move"],
  ["bash -c 'mv output/a.md b.md'", "Bash", "output/a.md", CWD, "mv sous bash -c"],
  ["cmd /c move output\\a.md b.md", "PowerShell", "output\\a.md", CWD, "move sous cmd /c"],
  ["powershell -Command \"Move-Item output\\a.md b.md\"", "PowerShell", "output\\a.md", CWD, "Move-Item sous powershell -Command"],
  ["git add -A && git mv output/a.md output/b.md && git status", "Bash", "output/a.md", CWD, "git mv au milieu d'une chaîne"],
];
for (const [commande, outil, source, cwd, nom] of ROUGES) {
  check(`rouge (TF-2737) — ${nom} : refusé, la commande exacte du remplacement nomme la source`, () => {
    const f = fautesRenommageLivrable(commande, cwd);
    att(f.length > 0, `aucune faute pour « ${commande} »`);
    const v = refuse(commande, outil, cwd);
    att(v.decision === "refuse" && /RENOMMAGE D'UN LIVRABLE REFUSÉ \(TF-2737, D-236 \(a\)/.test(v.motif), `pas de refus motivé : ${JSON.stringify(v).slice(0, 200)}`);
    att(v.motif.includes("renommer-livrable.mjs") && v.motif.includes(`--de "${source}"`) && /--vers "/.test(v.motif) && /--motif "<pourquoi>"/.test(v.motif), `commande exacte absente : ${v.motif.slice(-500)}`);
  });
}
check("rouge — la destination de la commande refusée entre dans la commande exacte (mv, git mv, Rename-Item) ; une destination inconnue reste un marqueur", () => {
  const dest = (c, o = "Bash") => refuse(c, o).motif;
  att(dest("mv output/a.md output/old/").includes('--vers "output/old/"'), "mv : destination");
  att(dest("git mv output/a.md output/b.md").includes('--vers "output/b.md"'), "git mv : destination");
  att(dest("Rename-Item -Path output\\a.md -NewName b.md", "PowerShell").includes('--vers "output\\b.md"') || dest("Rename-Item -Path output\\a.md -NewName b.md", "PowerShell").includes('--vers "output/b.md"'), "Rename-Item : destination");
  att(dest("ls output | xargs -I{} mv {} old/").includes('--vers "<destination>"'), "tuyau : destination inconnue");
});

// ---- Sens vert ----
const VERTS = [
  "mv src/a.md src/b.md", "git mv docs/a.md docs/b.md", "mv a.md b.md", "git mv scripts/x.mjs scripts/y.mjs", "mv -t old src/a.md",
  "Move-Item C:\\tmp\\a.md C:\\tmp\\b.md", "Rename-Item -Path C:\\tmp\\a.md -NewName b.md", "mi docs\\a.md old\\", "ren docs\\a.md b.md", "move docs\\a.md old\\",
  "mv /tmp/a.md output/04-plans/a.md", "mv ../Downloads/a.md output/a.md", "git mv src/a.md output/a.md", "Move-Item C:\\tmp\\a.md output\\a.md",
  "cp output/a.md /tmp/a.md", "Copy-Item output\\a.md C:\\tmp\\", "cat output/a.md", "ls output", "Get-ChildItem output\\*.md", "git status -- output/", "git log --oneline -- output/", "git diff output/a.md",
  "git add output/a.md && git commit -m \"Livrable déposé\"", "rm output/tmp.md", "echo \"mv output/a.md output/b.md\"", "echo git mv output/a.md b.md",
  "git commit -m \"Le hook refuse mv output/a.md et git mv output/a.md\"", "grep -rn \"git mv output\" scripts/", "grep -n \"Move-Item output\" oracles/*.mjs",
  "git commit -F - <<'EOF'\nUn correctif.\nmv output/a.md output/b.md\ngit mv output/a.md b.md\nMove-Item output\\a.md x\nEOF",
  "cat <<EOF > notes.md\nmv output/a.md old/\nEOF",
  "node scripts/renommer-livrable.mjs --de output/04-plans/a.md --vers output/04-plans/old/ --motif \"version remplacée\"",
  `node "${SCRIPT_RENOMMAGE}" --de "output/a.md" --vers "output/b.md" --motif "indice repris"`, `node "${SCRIPT_RENOMMAGE}" --suivre output/a.md`,
  "mv output/README.md /tmp/", "mv output/LISEZMOI.md /tmp/", "mv output/04-plans/old output/04-plans/old2", "git mv output/2026-09 output/2026-10",
  "node -e \"console.log('output/a.md')\"", "python -c \"print('output/a.md')\"", "node -e \"require('fs').renameSync('tmp/a.md', 'tmp/b.md')\"",
  "mv output.md old/", "mv my-output/a.md old/", "mv outputs/a.md old/", "cd src && mv a.md b.md", "Get-Content output\\liste.txt",
];
for (const commande of VERTS) check(`vert (TF-2737) — « ${commande.replace(/\n/g, "⏎").slice(0, 70)} » : laisse passer`, () => {
  const f = fautesRenommageLivrable(commande, CWD);
  att(f.length === 0, `faux refus : ${JSON.stringify(f)}`);
  att(juger({ tool_name: commande.includes("\\") ? "PowerShell" : "Bash", cwd: CWD, tool_input: { command: commande } }).decision === "laisse", "le hook refuse");
});
check("vert — un dossier de travail hors output/ ne rend pas un `mv` relatif suspect ; le même `mv` sous output/ l'est", () => {
  att(fautesRenommageLivrable("mv a.md b.md", "C:/dev/produit/src").length === 0, "faux refus hors output/");
  att(fautesRenommageLivrable("mv a.md b.md", "C:/dev/produit/output/03-etudes").length === 1, "pas de refus sous output/");
  att(fautesRenommageLivrable("cd ../src && mv a.md b.md", "C:/dev/produit/output").length === 0, "un cd sorti de output/ est ignoré");
});
check("livrableSousOutput — un livrable est un fichier sous output/ (extension, motif ou variable) : un dossier, un README et un chemin hors output/ n'en sont pas", () => {
  att(livrableSousOutput("output/04-plans/x.md", CWD) === "output/04-plans/x.md" && livrableSousOutput("C:\\dev\\p\\output\\x.html", "") === "output/x.html", "fichier");
  att(livrableSousOutput("output/04-plans", CWD) === null && livrableSousOutput("output", CWD) === null && livrableSousOutput("output/", CWD) === null, "dossier");
  att(livrableSousOutput("output/README.md", CWD) === null && livrableSousOutput("src/output.md", CWD) === null && livrableSousOutput("../x/y.md", CWD) === null, "non livrable");
  att(livrableSousOutput("output/../src/a.md", CWD) === null, "un `..` qui sort d'output/ est résolu");
});
check("hors périmètre — un outil étranger, une entrée vide ou un type inattendu : laissé passer", () => {
  att(juger({ tool_name: "Read", tool_input: { file_path: "output/a.md", command: "mv output/a.md b" } }).decision === "laisse", "Read jugé");
  att(juger({ tool_name: "Bash", tool_input: { command: "   " } }).decision === "laisse" && juger({ tool_name: "Bash", tool_input: {} }).decision === "laisse" && juger({}).decision === "laisse" && juger(null).decision === "laisse", "entrée vide jugée");
  att(juger({ tool_name: "Bash", tool_input: { command: 42 } }).decision === "laisse", "commande non texte jugée");
});

// ---- Le remède joué : la commande du motif de refus, exécutée dans un dépôt jetable ----
check("remède joué (TF-1013) — la commande exacte du motif, exécutée telle quelle dans un dépôt jetable, renomme, trace et laisse un renvoi ; elle passe le hook ; le renvoi se suit", () => {
  const base = mkdtempSync(join(tmpdir(), "hook-renommage-"));
  try {
    const depot = join(base, "pilote");
    mkdirSync(join(depot, "output", "04-plans"), { recursive: true });
    mkdirSync(join(depot, "todo"), { recursive: true }); writeFileSync(join(depot, "todo", "TODO.jsonl"), "");
    mkdirSync(join(depot, "references"), { recursive: true }); writeFileSync(join(depot, "references", "RENOMMAGES-LIVRABLES.jsonl"), "");
    const ancien = "output/04-plans/Produit - Revue - 20261114g.md", nouveau = "output/04-plans/Produit - Revue - 20261114k.md";
    writeFileSync(join(depot, ...ancien.split("/")), "# revue\n");
    const g = (...a) => spawnSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", ...a], { cwd: depot, encoding: "utf8" });
    g("init", "-q"); g("add", "-A"); g("commit", "-q", "-m", "départ");
    const commande = `mv "${ancien}" "${nouveau}"`;
    const v = juger({ tool_name: "Bash", cwd: depot, tool_input: { command: commande } });
    att(v.decision === "refuse", "le mv n'est pas refusé");
    const remede = v.motif.split("\n").find((l) => l.startsWith("node \""));
    att(remede, `aucune commande dans le motif : ${v.motif}`);
    att(juger({ tool_name: "Bash", cwd: depot, tool_input: { command: remede } }).decision === "laisse", "le remède est refusé par le hook");
    const mots = decouper(remede.replace("<pourquoi>", "indice repris (D-236 a)"))[0][0];
    att(mots[0] === "node" && mots[1] === SCRIPT_RENOMMAGE, `commande inattendue : ${JSON.stringify(mots).slice(0, 200)}`);
    const r = spawnSync(process.execPath, mots.slice(1), { cwd: depot, encoding: "utf8" });
    att(r.status === 0 && /RENOMMÉ : /.test(r.stdout), `le remède échoue : ${r.status} ${r.stdout} ${r.stderr}`);
    att(!existsSync(join(depot, ...ancien.split("/"))) && existsSync(join(depot, ...nouveau.split("/"))), "le fichier n'a pas été renommé");
    const s = suivreRenommage(depot, ancien);
    att(s && s.chemin === nouveau && existsSync(s.complet), `le renvoi ne se suit pas : ${JSON.stringify(s)}`);
    att(readFileSync(join(depot, "references", "RENOMMAGES-LIVRABLES.jsonl"), "utf8").includes("indice repris"), "le motif n'est pas tracé");
    const apres = juger({ tool_name: "Bash", cwd: depot, tool_input: { command: `mv "${nouveau}" "${ancien}"` } });
    att(apres.decision === "refuse", "le renommage inverse n'est pas refusé");
  } finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* verrou toléré */ } }
});

// ---- Câblage ----
check("câblage — le hook est au PreToolUse de `.claude/settings.json` du pilot, sur Bash ET PowerShell (une affordance câblée ou inexistante)", () => {
  const reglages = JSON.parse(readFileSync(join(RACINE, ".claude", "settings.json"), "utf8"));
  const groupe = (reglages.hooks?.PreToolUse || []).find((g) => (g.hooks || []).some((h) => /hook-renommage-livrable\.mjs/.test(h.command || "")));
  att(groupe, "hook-renommage-livrable.mjs n'est câblé à aucun PreToolUse");
  att(/\bBash\b/.test(groupe.matcher) && /\bPowerShell\b/.test(groupe.matcher), `le matcher « ${groupe.matcher} » ne couvre pas Bash et PowerShell`);
});
check("câblage — chez un produit : le gabarit de réglages câble `forge/hooks/factory.mjs renommage-livrable` sur Bash ET PowerShell, le lanceur connaît le nom, et l'héritage l'exige", () => {
  const gabarit = JSON.parse(readFileSync(join(RACINE, "gabarits", "settings-produit.json"), "utf8"));
  const groupe = (gabarit.hooks?.PreToolUse || []).find((g) => (g.hooks || []).some((h) => /factory\.mjs"? renommage-livrable/.test(h.command || "")));
  att(groupe && /\bBash\b/.test(groupe.matcher) && /\bPowerShell\b/.test(groupe.matcher), "settings-produit.json ne câble pas renommage-livrable sur Bash et PowerShell");
  att(/"renommage-livrable"/.test(readFileSync(join(RACINE, "gabarits", "hooks-factory.mjs"), "utf8")), "le lanceur ne connaît pas le hook");
  const heritage = JSON.parse(readFileSync(join(RACINE, "gabarits", "HERITAGE.json"), "utf8"));
  const a = heritage.artefacts.find((x) => x.source === "gabarits/settings-produit.json");
  att(a.motif_exige.includes("forge/hooks/factory.mjs renommage-livrable"), "HERITAGE.json n'exige pas le motif");
});
check("hook en ligne de commande : exit 2 et motif sur stderr au refus, exit 0 muet pour une commande permise, un outil étranger, une entrée illisible ou vide", () => {
  const jouer = (stdin) => spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: stdin });
  const r = jouer(JSON.stringify({ tool_name: "PowerShell", cwd: CWD, tool_input: { command: "Move-Item output\\a.md old\\" } }));
  att(r.status === 2 && /TF-2737/.test(r.stderr) && /renommer-livrable\.mjs/.test(r.stderr), `refus : exit ${r.status} ${r.stderr.slice(0, 120)}`);
  for (const ok of [JSON.stringify({ tool_name: "Bash", cwd: CWD, tool_input: { command: "mv src/a.md src/b.md" } }), JSON.stringify({ tool_name: "Read", tool_input: { file_path: "x" } }), "{pas du json", "", JSON.stringify({ tool_name: "Bash", tool_input: { command: "   " } })]) {
    const s = jouer(ok); att(s.status === 0 && !s.stdout.trim() && !s.stderr.trim(), `« ${ok.slice(0, 40)} » : exit ${s.status} ${s.stderr.slice(0, 80)}`);
  }
});

console.log(`\nhook-renommage-livrable (TF-2737, D-236 (a)) : ${pass} PASS, ${fail} FAIL — cas rouges : mv, git mv, Move-Item, Rename-Item, tuyaux, codes en ligne, shells imbriqués, chemins absolus, dossier de travail sous output/`);
process.exit(fail ? 1 : 0);
