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

  // ---- CI3 : « je ne peux pas mesurer » n'est pas « la mesure est mauvaise » (TF-0648) --------
  //
  // Un oracle a échoué en local sur « Failed to launch the browser process », stderr VIDE, parce
  // que 81 navigateurs étaient déjà ouverts. Le même oracle passait au vert en intégration
  // continue. Il a fallu un diagnostic entier pour établir que ce n'était PAS une régression, puis
  // rapporter le contrôle « ni passé ni échoué » — un verdict qu'aucune étape ne sait consommer.
  check("CI3 : un oracle qui ne déclare pas ses codes de sortie est signalé", () => {
    const r = juger(depot({
      "oracles/oracle-muet.mjs": "// un oracle sans contrat de sortie\nprocess.exit(1);\n",
      "p.json": "oracles/oracle-muet.mjs",
    }));
    att(regle(r, "CI3").statut === "FAIL", "un oracle au contrat muet passe pour conforme");
    att(/oracle-muet/.test(regle(r, "CI3").message || ""), "l'oracle fautif n'est pas NOMMÉ");
  });

  check("CI3 : la forme employée par la maison est reconnue — « exit 0/1/2 »", () => {
    // Le motif est calé sur ce que le dépôt ÉCRIT. Un premier jet exigeait la déclaration en TÊTE
    // de ligne et rejetait treize oracles conformes, parce que la maison l'écrit après
    // « Sortie : » ou « Contrat : ». Une règle qui impose une forme que le dépôt n'emploie pas ne
    // mesure pas la conformité : elle mesure l'écart à son auteur.
    const r = juger(depot({
      "oracles/oracle-poli.mjs": "// Contrat : JSON {oracle,verdict} · exit 0/1/2.\nprocess.exit(0);\n",
      "p.json": "oracles/oracle-poli.mjs",
    }));
    att(regle(r, "CI3").statut === "PASS", `la forme maison est rejetée : ${regle(r, "CI3").message}`);
  });

  check("CI3 BORNE : déclarer qu'il n'y a AUCUN chemin « je ne peux pas mesurer » suffit", () => {
    // C'est même la forme la plus utile : elle interdit de lire un 1 comme une panne d'environnement.
    const r = juger(depot({
      "oracles/oracle-sobre.mjs": "// Exit : 0 = conforme · 1 = defaut mesure. Aucun chemin « je ne peux pas mesurer ».\n",
      "p.json": "oracles/oracle-sobre.mjs",
    }));
    att(regle(r, "CI3").statut === "PASS", "un oracle sans dépendance externe est accusé alors qu'il l'a DIT");
  });

  // ---- CI5 : être DÉCLARÉ n'est pas être RENDU (TF-0795, 05/09) ----------------------------
  //
  // Le cas réel : deux contrôles Python d'un produit déclaraient « exit 0/1 » en en-tête et
  // n'avaient aucun sys.exit — CI3 PASS, aucun sens rouge. La règle lit la SOURCE, pas l'en-tête.
  check("CI5 rouge — un contrôle qui DÉCLARE ses codes mais n'a AUCUNE sortie non nulle est REFUSÉ, et nommé", () => {
    const r = juger(depot({
      "build/stats/check-ecarts.py": "# Exit : 0 = OK · 1 = ecart. \nimport json\nd = json.load(open('x.json'))\nprint('ecarts', len(d))\n",
      "p.json": "build/stats/check-ecarts.py",
    }));
    att(regle(r, "CI3").statut !== "FAIL", "CI3 devrait tenir : les codes SONT déclarés — c'est CI5 qui juge l'existence");
    att(regle(r, "CI5").statut === "FAIL", "un contrôle sans chemin d'échec passe pour conforme : il rassure au lieu de juger");
    att(/check-ecarts\.py/.test(regle(r, "CI5").message || ""), "le contrôle sans chemin d'échec n'est pas NOMMÉ");
  });

  check("CI5 vert — une sortie non nulle sous condition, en Python comme en Node, suffit", () => {
    const r = juger(depot({
      "build/stats/check-ht-ttc.py": "import sys\nko = 1\nsys.exit(1 if ko else 0)\n",
      "oracles/oracle-net.mjs": "// exit 0/1\nconst echecs = 2;\nprocess.exit(echecs ? 1 : 0);\n",
      "p.json": "build/stats/check-ht-ttc.py oracles/oracle-net.mjs",
    }));
    att(regle(r, "CI5").statut === "PASS", `un chemin d'échec écrit est accusé : ${regle(r, "CI5").message}`);
  });

  check("CI5 BORNE — un exit non nul cité seulement en COMMENTAIRE ne compte pas ; exitCode compte", () => {
    const r = juger(depot({
      "oracles/oracle-commente.mjs": "// on devrait faire process.exit(1) un jour\nconsole.log('ok');\n",
      "oracles/oracle-code.mjs": "// exit 0/1\nprocess.exitCode = defauts.length ? 1 : 0;\n",
      "p.json": "oracles/oracle-commente.mjs oracles/oracle-code.mjs",
    }));
    att(regle(r, "CI5").statut === "FAIL" && /oracle-commente/.test(regle(r, "CI5").message || ""), "un exit en commentaire a été compté comme un chemin d'échec");
    att(!/oracle-code/.test(regle(r, "CI5").message || ""), "process.exitCode = … n'est pas reconnu comme chemin d'échec");
  });

  // ---- CI4 : être CITÉ n'est pas être JOUÉ (TF-0679) -------------------------------------
  //
  // Deux scripts d'audit portaient TROIS défauts dormants : ils pilotaient un panneau retiré de
  // la page — donc ils levaient une exception AVANT tout verdict —, leur liste de pages nommait
  // en français des pages à identifiants localisés — dix codes 404 par exécution —, et un hôte
  // tiers comptait comme panne réseau à chaque audit local. Un contrôle qui crie toujours ne dit
  // plus rien. Ils étaient CITÉS par la chaîne d'intégration, donc CI1 les trouvait joignables.

  check("CI4 rouge — un contrôle cité par la chaîne d'intégration mais qu'AUCUNE recette n'exerce", () => {
    const r = juger(depot({
      "build/check-pages.mjs": "// exit 0/1/2\nprocess.exit(0);\n",
      ".github/ci.yml": "run: node build/check-pages.mjs",
    }));
    att(regle(r, "CI1").statut === "PASS", "le contrôle devrait être CITÉ — sinon CI4 ne prouve rien de neuf");
    att(regle(r, "CI4").statut === "FAIL", "un contrôle sans recette passe pour exercé");
    att(/check-pages/.test(regle(r, "CI4").message || ""), "le contrôle nu n'est pas NOMMÉ");
  });

  check("CI4 vert — une recette qui NOMME le contrôle suffit à l'exercer", () => {
    const r = juger(depot({
      "build/check-pages.mjs": "// exit 0/1/2\nprocess.exit(0);\n",
      "tests/check-pages.test.mjs": "import '../build/check-pages.mjs';\n",
    }));
    att(regle(r, "CI4").statut === "PASS", `un contrôle avec sa recette est accusé : ${regle(r, "CI4").message}`);
  });

  check("CI4 vert — la forme MAISON est reconnue : `self-test-<nom>.mjs` et la recette interne", () => {
    // Premier jet mesuré sur ce dépôt : `oracle-ecosysteme.mjs` accusé de n'avoir aucune recette
    // alors que `self-test-ecosysteme.mjs` le joue dans les deux sens et le nomme. Une règle qui
    // impose une forme que le dépôt n'emploie pas mesure l'écart à son auteur.
    const r = juger(depot({
      "oracles/oracle-machin.mjs": "// exit 0/1/2\nprocess.exit(0);\n",
      "oracles/self-test-machin.mjs": "const o = 'oracle-machin.mjs';\n",
      "oracles/oracle-truc.mjs": '// exit 0/1/2\nif (process.argv.includes("--self-test")) process.exit(0);\n',
      "p.json": "oracles/oracle-machin.mjs oracles/oracle-truc.mjs",
    }));
    att(regle(r, "CI4").statut === "PASS", `la forme maison est rejetée : ${regle(r, "CI4").message}`);
  });

  check("CI4 BORNE — une RECETTE n'est pas elle-même un contrôle à exercer", () => {
    // Sans cette borne, chaque recette ajoutée réclamerait sa propre recette, et la règle
    // exigerait une régression infinie au lieu d'une couverture.
    const r = juger(depot({
      "oracles/oracle-x.mjs": '// exit 0/1/2\nif (process.argv.includes("--self-test")) process.exit(0);\n',
      "oracles/oracle-x.test.mjs": "import './oracle-x.mjs';\n",
    }));
    att(regle(r, "CI4").statut === "PASS", "une recette est comptée comme un contrôle à exercer");
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
