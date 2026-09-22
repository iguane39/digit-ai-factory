#!/usr/bin/env node
/**
 * oracle-regle-sans-juge.test.mjs — recette à DOUBLE SENS de `oracle-regle-sans-juge.mjs`.
 *
 * POURQUOI UN FICHIER DÉDIÉ PLUTÔT QU'UN `--self-test` EMBARQUÉ, et c'est une mesure, pas un goût :
 * les fixtures de cet oracle inventent des numéros de règle (« R-70 », « R-71 ») pour éprouver ses
 * propres verdicts. Tant qu'elles vivaient DANS l'oracle, sa règle RJ2 les lisait comme des
 * accusations au nom de règles introuvables et rendait rouge sur lui-même — mesuré le 22/09/2026,
 * 2 faux positifs sur 5 constats. Un oracle qui se dénonce à cause de son propre banc apprend à
 * ses lecteurs que ses rouges sont du bruit.
 *
 * Joué par `oracles\self-tests.mjs` (I1, via la table DEDIES, et I2 comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { juger, NON_JUGE, collisions, declarations } from "./oracle-regle-sans-juge.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "regle-sans-juge-"));
let n = 0;
const depot = (regles, code, noyau = "# noyau\n") => {
  const d = join(T, `d${++n}`);
  mkdirSync(join(d, "oracles"), { recursive: true });
  writeFileSync(join(d, "REGLES-PROJET.md"), regles, "utf8");
  writeFileSync(join(d, "CLAUDE.md"), noyau, "utf8");
  writeFileSync(join(d, "oracles", "oracle-bidon.mjs"), code, "utf8");
  return d;
};
const regleDe = (num, titre) => `**R-${num}.** ${titre}\nLe texte de la règle, sur une ligne de plus.\n\n`;
const constat = (r, regle) => r.findings.find((x) => x.regle === regle);

// -- RJ1 : declaree, jouee par rien -------------------------------------------------------------
check("ROUGE — une règle déclarée que rien ne nomme est un FAIL", () => {
  const f = constat(juger(depot(regleDe(70, "une condition vérifiable"), "// rien\n")), "RJ1");
  if (f.statut !== "FAIL") throw new Error(`RJ1 ${f.statut} — la règle n'est jouée par rien`);
  if (!/R-70/.test(f.message)) throw new Error("le constat ne NOMME pas la règle");
});

check("VERT — la même règle citée par un exécutable passe RJ1", () => {
  const f = constat(juger(depot(regleDe(70, "une condition vérifiable"), "// joue R-70 sur le dépôt\n")), "RJ1");
  if (f.statut !== "PASS") throw new Error(`RJ1 ${f.statut} : ${f.message}`);
});

check("VERT — une règle qui se DIT non mécanisable est exemptée, et NOMMÉE au verdict", () => {
  const f = constat(juger(depot(regleDe(71, "ceci n'est pas mécanisable, et voici pourquoi"), "// rien\n")), "RJ1");
  if (f.statut !== "PASS") throw new Error(`RJ1 ${f.statut} — l'exemption écrite n'a pas été lue`);
  if (!/R-71/.test(f.message)) throw new Error("l'exemptée disparaît du verdict au lieu d'y être nommée");
});

check("ROUGE — l'exemption ne vaut que pour la règle qui la PORTE, pas pour sa voisine", () => {
  const doc = regleDe(71, "ceci n'est pas mécanisable, et voici pourquoi") + regleDe(72, "une autre condition");
  const f = constat(juger(depot(doc, "// rien\n")), "RJ1");
  if (f.statut !== "FAIL") throw new Error("la voisine a hérité d'une exemption qu'elle ne porte pas");
  if (/R-71/.test(f.message)) throw new Error("l'exemptée est accusée avec sa voisine");
});

check("VERT — une exemption écrite EN FIN DE SECTION est lue (calibration mesurée le 22/09)", () => {
  // La borne était à 12 lignes après le titre. Une exemption écrite à sa place naturelle — après
  // les volets de la règle — n'était pas vue, et l'oracle accusait une règle qui avait obéi.
  const loin = regleDe(74, "une condition") + "texte\n".repeat(30)
    + "Contrôle exécutable : AUCUN — cette règle n'est pas mécanisable, son objet est la qualité\nd'un raisonnement.\n";
  const f = constat(juger(depot(loin, "// rien\n")), "RJ1");
  if (f.statut !== "PASS") throw new Error(`l'exemption écrite loin du titre n'est pas lue : ${f.message}`);
  if (!/R-74/.test(f.message)) throw new Error("l'exemptée disparaît du verdict au lieu d'y être nommée");
});

check("ROUGE — l'exemption ne franchit pas la frontière de section", () => {
  // Une exemption écrite dans la section SUIVANTE ne couvre pas la règle précédente.
  const doc = regleDe(75, "une condition") + "## AZ. autre section\nnon mécanisable, dit-on ici\n";
  const f = constat(juger(depot(doc, "// rien\n")), "RJ1");
  if (f.statut !== "FAIL") throw new Error("une exemption d'une autre section a été prise pour la sienne");
});

check("ROUGE — citer la décision humaine qui a fondé une règle ne l'exempte PAS (calibration mesurée)", () => {
  // Le motif reconnaissait « décision humaine » et « geste humain ». Presque toute section de ce
  // corpus les porte en citant son origine : une règle entière pouvait s'exempter par ce seul mot.
  const doc = regleDe(76, "née de la décision humaine du 17/09, un geste humain la clôt");
  const f = constat(juger(depot(doc, "// rien\n")), "RJ1");
  if (f.statut !== "FAIL") throw new Error("l'origine d'une règle lui sert d'exemption");
});

check("VERT — une règle nommée par une RECETTE seulement compte comme nommée (RJ1)", () => {
  const d = depot(regleDe(73, "une condition"), "// rien\n");
  writeFileSync(join(d, "oracles", "oracle-bidon.test.mjs"), "// joue R-73\n", "utf8");
  const f = constat(juger(d), "RJ1");
  if (f.statut !== "PASS") throw new Error(`RJ1 ${f.statut} — un banc qui nomme la règle la nomme bien`);
});

// -- RJ2 : jouee, declaree nulle part -----------------------------------------------------------
check("ROUGE — une règle nommée par du code et déclarée nulle part est un FAIL", () => {
  const f = constat(juger(depot(regleDe(70, "t"), "// R-70 et aussi R-99, qui n'existe pas\n")), "RJ2");
  if (f.statut !== "FAIL") throw new Error(`RJ2 ${f.statut}`);
  if (!/R-99/.test(f.message)) throw new Error("le constat ne NOMME pas la règle introuvable");
});

check("VERT — un code qui ne cite que des règles déclarées passe RJ2", () => {
  if (constat(juger(depot(regleDe(70, "t"), "// R-70 seulement\n")), "RJ2").statut !== "PASS") {
    throw new Error("faux positif RJ2");
  }
});

check("VERT — un numéro inventé par une FIXTURE n'est pas une accusation (calibration mesurée)", () => {
  const d = depot(regleDe(70, "t"), "// R-70\n");
  writeFileSync(join(d, "oracles", "oracle-bidon.test.mjs"), "// fixture inventant R-98\n", "utf8");
  const f = constat(juger(d), "RJ2");
  if (f.statut !== "PASS") throw new Error(`le banc d'un oracle le fait se dénoncer : ${f.message}`);
});

// -- RJ3 : un numero, deux regles ---------------------------------------------------------------
check("ROUGE — un numéro portant DEUX titres différents est un FAIL", () => {
  const doc = "## AE. R-52 — une doctrine nomme ses consommateurs\ntexte\n\n## AE. R-52 — une sonde mesure sur le canal réel\ntexte\n";
  const f = constat(juger(depot(doc, "// R-52\n")), "RJ3");
  if (f.statut !== "FAIL") throw new Error(`RJ3 ${f.statut}`);
  if (!/R-52/.test(f.message)) throw new Error("le constat ne nomme pas le numéro ambigu");
});

check("VERT — un titre suivi de sa prose SANS titre est UNE règle, pas deux (calibration R-55)", () => {
  const doc = "## AE. R-55 — la factory a mandat permanent\ntexte\ntexte\n\n**R-55.**\n1. la suite de la même règle\n";
  const f = constat(juger(depot(doc, "// R-55\n")), "RJ3");
  if (f.statut !== "PASS") throw new Error(`faux positif mesuré sur le texte réel : ${f.message}`);
});

// -- portee et contrat ---------------------------------------------------------------------------
check("SANS OBJET — un dépôt sans texte opposable est déclaré hors portée, jamais accusé", () => {
  const d = join(T, "vide");
  mkdirSync(d, { recursive: true });
  const r = juger(d);
  if (r.verdict !== "SANS_OBJET") throw new Error(`verdict ${r.verdict} — juger le pilot ailleurs qu'au pilot est un faux positif`);
});

check("les trois formes de déclaration du texte réel sont reconnues", () => {
  const d = declarations("**R-1.** prose\n## AE. R-2 — titre\n| 3 | ligne de tableau |\n", "x.md");
  const formes = new Set(d.map((x) => x.forme));
  for (const f of ["prose", "titre", "tableau"]) if (!formes.has(f)) throw new Error(`forme ${f} non reconnue`);
});

check("une collision exige DEUX titres pleins et différents", () => {
  const memeTitre = [{ cle: "R-9", forme: "titre", titre: "a", doc: "x", ligne: 1 }, { cle: "R-9", forme: "prose", titre: "a", doc: "x", ligne: 9 }];
  if (collisions(memeTitre).length) throw new Error("deux écritures du MÊME titre comptent pour deux règles");
});

check("le verdict PUBLIE ce qu'il n'a pas jugé", () => {
  if (!Array.isArray(NON_JUGE) || NON_JUGE.length < 3) throw new Error("non_juge absent ou squelettique");
});

console.log(`\noracle-regle-sans-juge : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
