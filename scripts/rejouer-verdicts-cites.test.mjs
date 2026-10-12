#!/usr/bin/env node
/**
 * rejouer-verdicts-cites.test.mjs — un verdict cité se rejoue sur une copie PROPRE du commit (TF-1400).
 * Dépôt git réel en dossier temporaire. Le cas fondateur : une porte qui lit un fichier IGNORÉ par git
 * est verte dans l'arbre de travail et rouge sur la copie propre ; le message qui cite « exit 0 » doit
 * être refusé. Remède joué (TF-1013) : le message qui cite le verdict de la copie propre passe.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const OUTIL = join(dirname(fileURLToPath(import.meta.url)), "rejouer-verdicts-cites.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const PORTE = "import { existsSync } from 'node:fs';\nconsole.log(existsSync('local.txt') ? 'lu 19/19' : 'source absente 18/19');\nprocess.exit(existsSync('local.txt') ? 0 : 1);\n";
const depot = () => {
  const D = mkdtempSync(join(tmpdir(), "vcites-"));
  const g = (...a) => spawnSync("git", ["-C", D, "-c", "user.name=recette", "-c", "user.email=recette@exemple.invalid", ...a], { encoding: "utf8" });
  g("init", "-q", "-b", "main");
  writeFileSync(join(D, "porte.mjs"), PORTE, "utf8");
  writeFileSync(join(D, ".gitignore"), "local.txt\n", "utf8");
  writeFileSync(join(D, "local.txt"), "present sur le poste, absent de l'histoire\n", "utf8");
  g("add", "porte.mjs", ".gitignore");
  return { D, g };
};
const lancer = (D, ...extra) => {
  const r = spawnSync(process.execPath, [OUTIL, "--depot", D, "--plage", "HEAD~1..HEAD", ...extra], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};
const deuxCommits = (message) => {
  const { D, g } = depot();
  g("commit", "-q", "-m", "socle");
  writeFileSync(join(D, "suite.txt"), "x\n", "utf8");
  g("add", "suite.txt");
  g("commit", "-q", "-m", message);
  return D;
};

check("le piège est réel : la porte est VERTE dans l'arbre de travail (exit 0), c'est ce qui trompait", () => {
  const { D } = depot();
  const r = spawnSync(process.execPath, ["porte.mjs"], { cwd: D, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`exit ${r.status} dans l'arbre de travail`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge — « exit 0 » cité, copie propre en exit 1 (source ignorée par git) : FAIL, commit et écart nommés", () => {
  const D = deuxCommits("feat: suite\n\nVerdict: node porte.mjs => exit 0");
  const r = lancer(D);
  if (r.code !== 1 || !/\[FAIL\]/.test(r.sortie) || !/cité « exit 0 »/.test(r.sortie) || !/exit 1/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge — « contient 19/19 » cité alors que la copie propre rend 18/19 : FAIL même à code égal", () => {
  const D = deuxCommits("feat: suite\n\nVerdict: node porte.mjs => exit 1 ; contient \"19/19\"");
  const r = lancer(D);
  if (r.code !== 1 || !/sans « 19\/19 »/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge — une commande qui ne s'exécute pas dans la copie propre est un écart, jamais un vert", () => {
  const D = deuxCommits("feat: suite\n\nVerdict: commande-inexistante-xyz => exit 0");
  const r = lancer(D);
  if (r.code !== 1) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("remède joué — le message qui cite le verdict de la copie propre (exit 1, 18/19) PASSE", () => {
  const D = deuxCommits("feat: suite\n\nVerdict: node porte.mjs => exit 1 ; contient \"18/19\"");
  const r = lancer(D);
  if (r.code !== 0 || !/\[CONFIRMÉ\]/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("vert — un verdict qui se confirme sur la copie propre (fichier suivi) passe", () => {
  const D = deuxCommits("feat: suite\n\nVerdict: node -e \"process.exit(0)\" => exit 0");
  const r = lancer(D);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("borne — aucun verdict cité par la convention : PASS, et le dit (jamais un faux « tout confirmé »)", () => {
  const D = deuxCommits("feat: suite\n\nPortes : perimetre 19/19, banc 9/9");
  const r = lancer(D);
  if (r.code !== 0 || !/aucun verdict cité/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("borne — plage illisible : exit 2, non jugeable, jamais un vert", () => {
  const { D } = depot();
  const r = spawnSync(process.execPath, [OUTIL, "--depot", D, "--plage", "inexistante..HEAD"], { encoding: "utf8" });
  if (r.status !== 2) throw new Error(`exit ${r.status} attendu 2`);
  rmSync(D, { recursive: true, force: true });
});
check("borne — la copie propre est retirée après le jeu : aucun worktree résiduel", () => {
  const D = deuxCommits("feat: suite\n\nVerdict: node -e \"process.exit(0)\" => exit 0");
  lancer(D);
  const l = spawnSync("git", ["-C", D, "worktree", "list", "--porcelain"], { encoding: "utf8" }).stdout;
  if ((l.match(/^worktree /gm) || []).length !== 1) throw new Error(`worktrees : ${l}`);
  rmSync(D, { recursive: true, force: true });
});

console.log(`\nrejouer-verdicts-cites (TF-1400) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
