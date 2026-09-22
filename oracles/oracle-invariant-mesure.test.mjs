#!/usr/bin/env node
/**
 * oracle-invariant-mesure.test.mjs — recette à DOUBLE SENS de `oracle-invariant-mesure.mjs`.
 *
 * Le sens VERT porte ici autant que le rouge, et plus encore : cet oracle rend vert sur le dépôt
 * réel, parce que la forme fautive n'y est pas — il est un cliquet, pas un constat. Un cliquet
 * dont on n'a jamais vu le rouge est indiscernable d'un contrôle mort. Les fixtures rouges sont
 * donc la SEULE preuve qu'il sait échouer, et elles reproduisent le fait fondateur ligne pour
 * ligne : un nombre pris pour un maximum d'identifiant.
 *
 * Joué par `oracles\self-tests.mjs` (I1 via DEDIES, I2 comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { juger, NON_JUGE, derivationsFautives, echappatoiresLues } from "./oracle-invariant-mesure.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "invariant-mesure-"));
let n = 0;
const depot = (source) => {
  const d = join(T, `d${++n}`);
  mkdirSync(join(d, "oracles"), { recursive: true });
  writeFileSync(join(d, "oracles", "oracle-bidon.mjs"), source, "utf8");
  return d;
};
const constat = (r, regle) => r.findings.find((x) => x.regle === regle);

// -- IN1 : la forme fondatrice, les deux sens ---------------------------------------------------
check("ROUGE — un prochain identifiant dérivé d'un COMPTE est un FAIL (le fait fondateur)", () => {
  const f = constat(juger(depot("const prochain = ids.length + 1;\n")), "IN1");
  if (f.statut !== "FAIL") throw new Error(`IN1 ${f.statut} — la forme fondatrice passe`);
  if (!/:1/.test(f.message)) throw new Error("le constat ne donne pas la LIGNE");
});

check("ROUGE — un maximum dérivé d'un compte de commits est un FAIL", () => {
  const src = 'const max = execSync("git rev-list --count HEAD");\n';
  if (constat(juger(depot(src)), "IN1").statut !== "FAIL") throw new Error("le nombre de commits passe pour un maximum");
});

check("VERT — la forme JUSTE, le maximum des identifiants eux-mêmes, passe", () => {
  const f = constat(juger(depot("const prochain = (ids.length ? Math.max(...ids) : 0) + 1;\n")), "IN1");
  if (f.statut !== "PASS") throw new Error(`l'oracle punit la forme juste : ${f.message}`);
});

check("VERT — indexer le DERNIER élément n'est pas dériver un identifiant (calibration mesurée)", () => {
  const f = constat(juger(depot("const dernier = releves[releves.length - 1];\n")), "IN1");
  if (f.statut !== "PASS") throw new Error("9 faux positifs mesurés le 22/09 reviennent");
});

check("VERT — un COMMENTAIRE qui décrit la forme fautive n'est pas la forme fautive", () => {
  const f = constat(juger(depot("// const prochain = ids.length + 1; — ce qu'il ne faut pas faire\n")), "IN1");
  if (f.statut !== "PASS") throw new Error("un commentaire pédagogique est accusé d'être du code");
});

check("VERT — un compte DANS UN PRÉDICAT n'est pas la valeur affectée (calibration mesurée)", () => {
  const src = "const suivant = titres.find((x) => x.l.match(/^#+/)[0].length <= n);\n";
  const f = constat(juger(depot(src)), "IN1");
  if (f.statut !== "PASS") throw new Error("le dernier faux positif du 22/09 revient : un titre trouvé pris pour un identifiant dérivé");
});

check("le discriminant est la LIGNE, pas le fichier", () => {
  const d = derivationsFautives("const a = 1;\nconst prochain = ids.length + 1;\n");
  if (d.length !== 1 || d[0].ligne !== 2) throw new Error(`localisation fausse : ${JSON.stringify(d)}`);
});

// -- IN2 : une echappatoire s'explique, les deux sens -------------------------------------------
check("ROUGE — une échappatoire qu'aucune phrase n'explique est un FAIL", () => {
  const f = constat(juger(depot('if (argv.includes("--forcer")) return;\n')), "IN2");
  if (f.statut !== "FAIL") throw new Error(`IN2 ${f.statut} — un contournement muet passe`);
  if (!/--forcer/.test(f.message)) throw new Error("le constat ne NOMME pas l'option");
});

check("VERT — la même échappatoire expliquée ailleurs dans le fichier passe", () => {
  const src = '// `--forcer` saute la vérification du sceau, et le dit au journal.\nif (argv.includes("--forcer")) return;\n';
  const f = constat(juger(depot(src)), "IN2");
  if (f.statut !== "PASS") throw new Error(`IN2 ${f.statut} — l'explication n'a pas été lue`);
});

// -- IN3 : une echappatoire ne fait pas declarer une supposition --------------------------------
check("ROUGE — une option dont le NOM porte l'hypothèse est un FAIL", () => {
  const src = '// `--assume-propre` déclare le dépôt propre.\nif (argv.includes("--assume-propre")) return;\n';
  const f = constat(juger(depot(src)), "IN3");
  if (f.statut !== "FAIL") throw new Error(`IN3 ${f.statut} — l'opérateur déclare un état qu'il n'a pas constaté`);
  if (!/assume/.test(f.message)) throw new Error("le constat ne nomme pas l'option");
});

check("VERT — une échappatoire qui ne suppose rien passe IN3", () => {
  const src = '// `--forcer` saute le sceau et le journalise.\nif (argv.includes("--forcer")) return;\n';
  if (constat(juger(depot(src)), "IN3").statut !== "PASS") throw new Error("faux positif IN3");
});

check("VERT — un VOCABULAIRE d'options n'est pas une offre d'options (calibration mesurée sur cet oracle)", () => {
  const vocabulaire = 'const MOTS = /--(?:forcer|assume|suppose)[\\w-]*/;\n';
  const r = juger(depot(vocabulaire));
  if (constat(r, "IN2").statut !== "PASS" || constat(r, "IN3").statut !== "PASS") {
    throw new Error("l'oracle s'accuse d'offrir les options que son propre motif nomme");
  }
  if (echappatoiresLues(vocabulaire).length) throw new Error("une expression régulière est prise pour une lecture d'argument");
});

check("une option n'existe QUE si elle est lue", () => {
  if (!echappatoiresLues('args.includes("--forcer")').includes("--forcer")) throw new Error("une lecture réelle n'est pas vue");
  if (echappatoiresLues('// on pourrait ajouter --forcer un jour').length) throw new Error("une mention en prose compte pour une option");
});

// -- portee et contrat ---------------------------------------------------------------------------
check("SANS OBJET — un dépôt sans contrôle est déclaré hors portée, jamais accusé", () => {
  const d = join(T, "vide");
  mkdirSync(d, { recursive: true });
  if (juger(d).verdict !== "SANS_OBJET") throw new Error("un dépôt vide est accusé au lieu d'être écarté");
});

check("VERT — une RECETTE qui écrit la forme fautive à dessein n'est pas accusée", () => {
  const d = depot("// rien\n");
  writeFileSync(join(d, "oracles", "oracle-bidon.test.mjs"), "const prochain = ids.length + 1;\n", "utf8");
  if (constat(juger(d), "IN1").statut !== "PASS") throw new Error("la fixture rouge d'un banc est prise pour du code de production");
});

check("le verdict PUBLIE ce qu'il n'a pas jugé, et dit ce qu'il NE PRÉTEND PAS mesurer", () => {
  if (!Array.isArray(NON_JUGE) || NON_JUGE.length < 3) throw new Error("non_juge absent ou squelettique");
  if (!NON_JUGE.some((x) => /corr[ée]l/i.test(x))) throw new Error("la borne principale — la famille entière — n'est pas déclarée");
});

console.log(`\noracle-invariant-mesure : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
