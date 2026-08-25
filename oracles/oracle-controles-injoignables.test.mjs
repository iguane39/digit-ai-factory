#!/usr/bin/env node
/**
 * oracle-controles-injoignables.test.mjs — recette du contrôle des contrôles (TF-0583).
 *
 * Les deux sens sur les deux règles, plus le faux positif mesuré sur le pilot avant livraison :
 * un chemin cité dans un COMMENTAIRE n'est pas un chemin codé en dur — c'est souvent l'inverse,
 * le commentaire décrit le défaut pour l'interdire. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { juger, SE_PRESENTE_COMME_UN_CONTROLE, EST_UN_TEST, CHEMIN_OUTIL_EN_DUR } from "./oracle-controles-injoignables.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };
const regle = (r, id) => r.findings.find((f) => f.regle === id) || {};

const T = mkdtempSync(join(tmpdir(), "controles-injoignables-"));
let n = 0;
const depot = (fichiers) => {
  const d = join(T, `d${++n}`);
  for (const [chemin, contenu] of Object.entries(fichiers)) {
    const p = join(d, chemin.replaceAll("/", "\\"));
    mkdirSync(join(p, ".."), { recursive: true });
    writeFileSync(p, contenu, "utf8");
  }
  return d;
};
const AS = String.fromCharCode(92);

try {
  check("CI1 rouge — un contrôle que RIEN ne cite est REFUSÉ, et nommé", () => {
    const r = juger(depot({ "build/check-contraste.mjs": "// un contrôle juste\nexport const x = 1;\n" }));
    att(regle(r, "CI1").statut === "FAIL", `statut ${regle(r, "CI1").statut}`);
    att(/check-contraste/.test(regle(r, "CI1").message), "le fichier orphelin n'est pas nommé");
    att(/c'est un fichier/.test(regle(r, "CI1").message), "le motif ne dit pas ce qu'est un contrôle que rien n'appelle");
  });

  check("CI1 vert — un contrôle CITÉ par un autre fichier passe", () => {
    const r = juger(depot({
      "build/check-contraste.mjs": "export const x = 1;\n",
      "package.json": '{ "scripts": { "verif": "node build/check-contraste.mjs" } }\n',
    }));
    att(regle(r, "CI1").statut === "PASS", `statut ${regle(r, "CI1").statut} : une citation légitime n'est pas vue`);
  });

  check("CI1 — une citation dans un WORKFLOW ou une documentation compte aussi", () => {
    for (const [nom, contenu] of [[".github/workflows/ci.yml", "run: node build/check-contraste.mjs\n"],
      ["docs/verification.md", "Jouer `build/check-contraste.mjs` avant chaque livraison.\n"]]) {
      const r = juger(depot({ "build/check-contraste.mjs": "export const x = 1;\n", [nom]: contenu }));
      att(regle(r, "CI1").statut === "PASS", `une citation dans ${nom} n'est pas vue`);
    }
  });

  check("CI1 — un dépôt à LANCEUR PAR DÉCOUVERTE fait SIGNALER, jamais accuser", () => {
    const r = juger(depot({
      "build/check-contraste.mjs": "export const x = 1;\n",
      "outils/lancer.mjs": 'import { readdirSync } from "node:fs";\nfor (const f of readdirSync("build")) if (f.startsWith("check")) run(f);\n',
    }));
    att(regle(r, "CI1").statut === "AVERTISSEMENT", `statut ${regle(r, "CI1").statut} : l'absence de citation ne prouve rien ici`);
    att(/DÉCOUVERTE/.test(regle(r, "CI1").message), "le motif du signalement n'est pas dit");
  });

  check("un fichier de TEST n'est pas un contrôle à brancher", () => {
    const r = juger(depot({ "tests/check-truc.mjs": "export const x = 1;\n" }));
    att(regle(r, "CI0").statut === "SANS_OBJET", "un fichier de test a été pris pour un contrôle");
    att(EST_UN_TEST("a/tests/x.mjs") && EST_UN_TEST("b/x.test.mjs") && !EST_UN_TEST("src/protest.mjs"),
      "le prédicat de fichier de test est faux dans un sens ou dans l'autre");
  });

  check("ce qui SE PRÉSENTE comme un contrôle est reconnu, et le reste ne l'est pas", () => {
    for (const nom of ["oracle-x.mjs", "check-y.mjs", "verifier-z.mjs", "valider-a.py", "truc-oracle.mjs"]) {
      att(SE_PRESENTE_COMME_UN_CONTROLE(nom), `non reconnu : ${nom}`);
    }
    for (const nom of ["index.mjs", "checkout.mjs", "verification.md", "oracles.json"]) {
      att(!SE_PRESENTE_COMME_UN_CONTROLE(nom), `reconnu à tort : ${nom}`);
    }
  });

  // ── CI2 : le chemin d'outil externe ──────────────────────────────────────
  check("CI2 rouge — un chemin de navigateur codé EN DUR est REFUSÉ, avec sa ligne", () => {
    const ligne = `const nav = "C:${AS}${AS}Program Files${AS}${AS}Edge${AS}${AS}msedge.exe";`;
    const r = juger(depot({ "build/check-a.mjs": `${ligne}\nexport const x = 1;\n`, "package.json": '{ "x": "build/check-a.mjs" }' }));
    att(regle(r, "CI2").statut === "FAIL", `statut ${regle(r, "CI2").statut}`);
    att(/check-a\.mjs:1/.test(regle(r, "CI2").message), "la LIGNE fautive n'est pas nommée");
    att(/bruyant/i.test(regle(r, "CI2").message), "la forme attendue n'est pas décrite");
  });

  check("CI2 — un chemin POSIX d'outil est vu aussi", () => {
    const r = juger(depot({ "build/check-b.mjs": 'const n = "/usr/bin/chromium-browser";\n', "p.json": "build/check-b.mjs" }));
    att(regle(r, "CI2").statut === "FAIL", "un chemin POSIX passe");
    att(CHEMIN_OUTIL_EN_DUR.test('"/opt/google/chrome/chrome"'), "le motif ne couvre pas /opt");
  });

  check("CI2 vert — la forme attendue passe : variable d'environnement puis repli", () => {
    const r = juger(depot({
      "build/check-c.mjs": 'const nav = process.env.CHROME_PATH || candidats.find(existe);\nif (!nav) throw new Error("aucun navigateur trouvé");\n',
      "p.json": "build/check-c.mjs",
    }));
    att(regle(r, "CI2").statut === "PASS", `statut ${regle(r, "CI2").statut} : la bonne forme est refusée`);
  });

  // ── LE FAUX POSITIF MESURÉ : un chemin dans un commentaire ────────────────
  check("un chemin cité dans un COMMENTAIRE n'est pas codé en dur — faux positif mesuré sur le pilot", () => {
    const r = juger(depot({
      "oracles/oracle-d.mjs": `// interdit : "C:${AS}${AS}Program Files${AS}${AS}Edge${AS}${AS}msedge.exe" codé en dur\nexport const x = 1;\n`,
      "p.json": "oracles/oracle-d.mjs",
    }));
    att(regle(r, "CI2").statut === "PASS",
      "la doctrine qui DÉCRIT le défaut pour l'interdire a été accusée — la façon la plus sûre de se faire désactiver");
  });

  check("un chemin volontairement littéral se marque, et le marqueur est respecté", () => {
    const ligne = `const n = "/usr/bin/node"; // outil-en-dur-ok : imposé par le paquet`;
    const r = juger(depot({ "build/check-e.mjs": `${ligne}\n`, "p.json": "build/check-e.mjs" }));
    att(regle(r, "CI2").statut === "PASS", "le marqueur d'exception n'est pas respecté");
  });

  check("aucun contrôle dans le dépôt → SANS_OBJET, jamais un échec", () => {
    const r = juger(depot({ "src/index.mjs": "export const x = 1;\n" }));
    att(r.verdict === "PASS" && regle(r, "CI0").statut === "SANS_OBJET", "un dépôt sans contrôle est mis en défaut");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\ncontroles-injoignables (TF-0583) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
