#!/usr/bin/env node
/**
 * oracle-verrou-unique.test.mjs — recette à DOUBLE SENS de son oracle (R-41).
 *
 * L'oracle rend VERT sur le dépôt au jour de sa naissance : aucun verrou maison n'y existe. Ses
 * fixtures rouges sont donc la seule preuve qu'il sait échouer. Le sens VERT porte autant : un
 * oracle qui accuserait un verrou de gestionnaire de paquets serait désactivé dans la semaine,
 * et c'est exactement ainsi qu'un contrôle meurt.
 *
 * Joué par `oracles\self-tests.mjs` (I1 via la table partagée, I2 comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { juger, NON_JUGE, artefactsDeVerrou, VERROUS_DE_PAQUETS, RE_NOM_DE_VERROU } from "./oracle-verrou-unique.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "verrou-unique-"));
let n = 0;
/** Un dépôt jetable : toujours un fichier de code, plus les fichiers qu'on lui donne. */
const depot = (fichiers = {}) => {
  const d = join(T, `d${++n}`);
  mkdirSync(join(d, "scripts"), { recursive: true });
  writeFileSync(join(d, "scripts", "outil.mjs"), "export function faire() { return 1; }\n", "utf8");
  for (const [rel, contenu] of Object.entries(fichiers)) {
    const p = join(d, rel);
    mkdirSync(join(p, ".."), { recursive: true });
    writeFileSync(p, contenu, "utf8");
  }
  return d;
};
const constat = (r, regle) => r.findings.find((x) => x.regle === regle);

// -- VU1 : un artefact de verrou pose -------------------------------------------------------------
check("ROUGE — un fichier de verrou maison est un FAIL", () => {
  const f = constat(juger(depot({ "travaux/campagne.lock": "pris par la session A\n" })), "VU1");
  if (f.statut !== "FAIL") throw new Error(`VU1 ${f.statut} — une seconde vérité vit dans le dépôt`);
  if (!/campagne\.lock/.test(f.message)) throw new Error("le constat ne NOMME pas l'artefact");
});

check("ROUGE — un répertoire ou un fichier nommé LOCK est un FAIL", () => {
  if (constat(juger(depot({ "LOCK": "x\n" })), "VU1").statut !== "FAIL") throw new Error("la forme nue échappe");
});

check("VERT — un verrou de gestionnaire de paquets n'est PAS accusé", () => {
  const f = constat(juger(depot({ "uv.lock": "x\n", "package-lock.json": "{}\n" })), "VU1");
  if (f.statut !== "PASS") throw new Error(`l'oracle serait désactivé dans la semaine : ${f.message}`);
});

check("VERT — un dépôt sans aucun artefact de verrou passe VU1", () => {
  if (constat(juger(depot()), "VU1").statut !== "PASS") throw new Error("faux positif VU1");
});

check("l'exemption est NOMMÉE, jamais devinée par motif", () => {
  if (!VERROUS_DE_PAQUETS.has("uv.lock")) throw new Error("un verrou de paquet courant manque à la liste");
  if (VERROUS_DE_PAQUETS.has("campagne.lock")) throw new Error("la liste exempte un verrou de travail");
  if (!RE_NOM_DE_VERROU.test("campagne.lock")) throw new Error("le motif ne voit pas un verrou de travail");
  if (RE_NOM_DE_VERROU.test("blocklist.json")) throw new Error("le motif mord sur un mot qui contient « lock »");
});

// -- VU2 : le code qui POSE un verrou -------------------------------------------------------------
check("ROUGE — un code qui écrit un verrou est un FAIL, même s'il le retire ensuite", () => {
  const src = 'writeFileSync(join(T, "campagne.lock"), "pris");\nunlinkSync(join(T, "campagne.lock"));\n';
  const f = constat(juger(depot({ "scripts/poser.mjs": src })), "VU2");
  if (f.statut !== "FAIL") throw new Error(`VU2 ${f.statut} — le jour où il s'arrête avant de retirer, le verrou reste`);
  if (!/:1/.test(f.message)) throw new Error("le constat ne donne pas la LIGNE");
});

check("VERT — un COMMENTAIRE qui décrit un verrou n'en pose pas", () => {
  const src = '// on pourrait écrire un fichier campagne.lock ici — R-41 l\'interdit\nexport const x = 1;\n';
  const f = constat(juger(depot({ "scripts/poser.mjs": src })), "VU2");
  if (f.statut !== "PASS") throw new Error("un commentaire pédagogique est accusé de poser un verrou");
});

check("VERT — un code qui écrit un fichier ordinaire passe VU2", () => {
  const src = 'writeFileSync(join(T, "rapport.json"), "{}");\n';
  if (constat(juger(depot({ "scripts/poser.mjs": src })), "VU2").statut !== "PASS") throw new Error("faux positif VU2");
});

check("VERT — un fichier SOURCE nommé d'après la règle n'est pas un verrou (calibration mesurée)", () => {
  // Premier essai du motif : `oracle-verrou-unique.mjs` et sa recette se dénonçaient eux-mêmes.
  const f = constat(juger(depot({ "oracles/oracle-verrou-unique.mjs": "export const x = 1;\n" })), "VU1");
  if (f.statut !== "PASS") throw new Error("un fichier source nommé d'après la règle est pris pour un verrou");
  if (RE_NOM_DE_VERROU.test("oracle-verrou-unique.mjs")) throw new Error("le motif mord sur un nom de source");
});

check("VERT — une DÉFINITION de motif n'écrit rien (calibration mesurée sur cet oracle)", () => {
  const src = "export const RE = /(?:writeFileSync|appendFileSync)[^\\n]{0,70}[\"'`].lock/;\n";
  const f = constat(juger(depot({ "scripts/vocabulaire.mjs": src })), "VU2");
  if (f.statut !== "PASS") throw new Error("un vocabulaire est pris pour une écriture");
});

check("VERT — écrire un verrou de PAQUET dans une fixture n'est pas poser un verrou", () => {
  const src = 'writeFileSync(join(T, "frontend", "yarn.lock"), "left-pad@^1.3.0:");\n';
  const f = constat(juger(depot({ "scripts/fabriquer.mjs": src })), "VU2");
  if (f.statut !== "PASS") throw new Error("figer des versions est pris pour verrouiller du travail");
});

check("VERT — une RECETTE qui écrit un verrou à dessein n'est pas accusée par VU2", () => {
  const src = 'writeFileSync(join(T, "campagne.lock"), "pris");\n';
  const f = constat(juger(depot({ "scripts/poser.test.mjs": src })), "VU2");
  if (f.statut !== "PASS") throw new Error("la fixture rouge d'un banc est prise pour du code de production");
});

// -- portee et contrat -----------------------------------------------------------------------------
check("SANS OBJET — un dépôt introuvable est déclaré hors portée, jamais accusé", () => {
  if (juger(join(T, "inexistant")).verdict !== "SANS_OBJET") throw new Error("un chemin absent est accusé");
});

check("les répertoires de dépendances sont écartés de la recherche", () => {
  const d = depot();
  mkdirSync(join(d, "node_modules", "paquet"), { recursive: true });
  writeFileSync(join(d, "node_modules", "paquet", "x.lock"), "x\n", "utf8");
  if (artefactsDeVerrou(d).length) throw new Error("un verrou de dépendance est accusé");
});

check("le verdict PUBLIE ce qu'il n'a pas jugé, dont le second volet de la règle", () => {
  if (!Array.isArray(NON_JUGE) || NON_JUGE.length < 3) throw new Error("non_juge absent ou squelettique");
  if (!NON_JUGE.some((x) => /re[çc]u/i.test(x))) throw new Error("le volet « pas de reçu, pas de done » n'est pas déclaré non mesuré");
});

console.log(`\noracle-verrou-unique : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
