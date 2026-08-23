#!/usr/bin/env node
/**
 * oracle-pieges-regex.mjs — les deux pièges qui ont rendu des règles MORTES EN CROYANT VIVRE.
 *
 * POURQUOI CET ORACLE EXISTE, et il ne sort pas d'une intuition : les deux mêmes pièges ont mordu
 * TROIS FOIS dans la même journée (23/08/2026), sur trois règles différentes, écrites par le même
 * auteur à quelques heures d'intervalle. Une règle atteinte ne se plaint pas : elle rend PASS. Elle
 * est donc pire qu'une règle absente — elle rassure au lieu de juger.
 *
 *   P1 · `\b` DE JAVASCRIPT EST ASCII. Entre une espace et « É », il n'y a AUCUNE frontière de mot :
 *        `\b(écart)` ne matche jamais un titre « Écarté », et `tranché\b` ne matche pas « tranché »
 *        (le « é » final n'est pas un caractère de mot). Mordu deux fois le 23/08 : la règle des
 *        écarts d'un relevé de barre externe était MORTE sur un relevé conforme — sans la
 *        contre-épreuve, elle aurait accusé tous les relevés bien faits, et seulement ceux-là.
 *
 *   P2 · UN DRAPEAU INSENSIBLE À LA CASSE SUR UNE CLASSE DE MAJUSCULES annule la classe.
 *        `/\bE[A-Z]{4,}\b/i` — destiné aux codes techniques du genre `ENOTFOUND` — matche aussi le piege-ok
 *        mot français « ecran ». Mordu le 23/08 sur la règle S21 : elle rendait PASS sur une action
 *        sans aucune trace de tentative, c'est-à-dire exactement ce qu'elle existait pour refuser.
 *
 * CE QUE L'ORACLE NE PEUT PAS FAIRE, et c'est écrit à son `non_juge` : il ne juge pas si une
 * expression est JUSTE. Il attrape deux formes dont on sait qu'elles trompent leur auteur. Une
 * expression peut être fausse de mille autres façons, et seule une fixture à double sens le dira.
 *
 * Usage : node oracle-pieges-regex.mjs [racine-des-forges] [--json] · --self-test
 * Sortie : JSON {oracle,verdict,findings[],non_juge[]} · exit 0 = PASS · 1 = FAIL · 2 = SKIP.
 */
import { existsSync, readFileSync, readdirSync, mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");

const F = [];
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });

const NON_JUGE = [
  "la JUSTESSE d'une expression : cet oracle attrape DEUX formes dont on sait qu'elles trompent leur auteur, pas les mille autres façons de se tromper — seule une fixture à double sens le dira",
  "les expressions construites par concaténation à l'exécution (`new RegExp(a + b)`) : leur texte final n'existe pas dans le fichier",
  "les expressions d'un langage autre que JavaScript : en Python, `\\b` suit la classe Unicode de l'expression, le piège P1 n'existe pas de la même façon",
  "les FAUX NÉGATIFS d'un mot accentué écrit sous forme échappée (`\\u00e9`) : la forme est licite et l'oracle ne la déchiffre pas",
];

// P1 : une frontière de mot ASCII collée à une lettre non ASCII, dans les deux sens.
const ACCENTS = "àâäåçéèêëîïìôöòõûüùÿñæœÀÂÄÅÇÉÈÊËÎÏÌÔÖÒÕÛÜÙŸÑÆŒ";
// Entre la frontiere et la lettre accentuee, il peut y avoir une ouverture de groupe ou une
// alternance : `\b(ecart|refus)`. Le premier jet ne lisait que le cas nu, et la recette l'a dit.
const P1_AVANT = new RegExp("\\\\b[(\\[|]*[" + ACCENTS + "]");        //  \bÉ…
// TROISIEME PIEGE, attrape par la fixture de cet oracle meme : `"[)\]|]*"` ne porte PAS le
// crochet fermant dans la classe — `\]` n'est pas un echappement de chaine JavaScript, donc la
// valeur devient `[)]|]*`, la classe se referme sur `)` et le `|` devient une ALTERNANCE :
// l'expression matchait alors `]*\\b` seul, c'est-a-dire n'importe quelle frontiere. Elle
// accusait tout. Le crochet fermant se double dans la chaine, toujours.
const P1_APRES = new RegExp("[" + ACCENTS + "][)\\]|]*\\\\b");        //  …é\b
// P2 : une classe qui ne contient QUE des majuscules (ou un littéral tout en majuscules de 3+
// lettres), dans une expression portant le drapeau insensible à la casse.
// P2 a ete RESSERRE apres son premier passage sur le parc : il accusait 6 emplois legitimes
// sur 41 constats — un litteral en majuscules sous drapeau insensible (`/MEP/i`, `/ADOPT[EE]/i`)
// est la facon NORMALE de matcher un mot quelle que soit sa casse. Le defaut est autre chose :
// une PLAGE de majuscules AVEC REPETITION, c'est-a-dire le motif d'un code technique, que le
// drapeau insensible transforme en motif de mot courant. C'est ce cas precis qui a mordu S21.
const P2_CLASSE = /\[A-Z(?:0-9|\\d)*\]\s*(?:\{\d|\+|\*)/;

const EXT = /\.(mjs|cjs|js)$/i;
const IGNORES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build", "generated", "vendor"]);
const DOSSIERS = ["oracles", "scripts", "tools", "todo", "skills"];

function* fichiers(dossier, prof = 0) {
  if (prof > 3 || !existsSync(dossier)) return;
  let entrees = [];
  try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    if (IGNORES.has(e.name)) continue;
    const p = join(dossier, e.name);
    if (e.isDirectory()) yield* fichiers(p, prof + 1);
    else if (EXT.test(e.name)) yield p;
  }
}

/** Les littéraux d'expression régulière d'un source, avec leur ligne et leurs drapeaux. */
export function litterauxRegex(source) {
  const out = [];
  const lignes = source.split(/\r?\n/);
  lignes.forEach((ligne, i) => {
    // Volontairement simple : `/…/drapeaux` sur une seule ligne, hors commentaire de fin de ligne
    // et hors chaîne. Une expression coupée sur deux lignes n'est pas lue — c'est au `non_juge`.
    for (const m of ligne.matchAll(/(?<![\\/*:])\/((?:[^/\\\n[]|\\.|\[(?:[^\]\\]|\\.)*\])+)\/([a-z]*)/g)) {
      out.push({ ligne: i + 1, corps: m[1], drapeaux: m[2], texte: ligne.trim() });
    }
  });
  return out;
}

// Une ligne qui MONTRE le piege — documentation, fixture, message d'erreur — porte le marqueur
// `piege-ok`. Sans cette echappatoire, cet oracle s'accuserait lui-meme a chaque exemple, et un
// controle qui crie sur sa propre documentation apprend a etre ignore.
export function juger(source) {
  const constats = [];
  for (const r of litterauxRegex(source)) {
    if (/piege-ok/.test(r.texte)) continue;
    if (P1_AVANT.test(r.corps) || P1_APRES.test(r.corps)) {
      constats.push({ piege: "P1", ligne: r.ligne, corps: r.corps,
        message: "frontière de mot ASCII collée à une lettre accentuée : `\\b` ne voit pas « é » comme " +
          "un caractère de mot, donc cette expression NE MATCHERA JAMAIS le mot qu'elle vise. " +
          "Retirer la frontière, ou viser la forme non accentuée en plus" });
    }
    if (r.drapeaux.includes("i") && P2_CLASSE.test(r.corps)) {
      constats.push({ piege: "P2", ligne: r.ligne, corps: r.corps,
        message: "drapeau insensible à la casse sur une classe ou un littéral de MAJUSCULES : la " +
          "distinction de casse est annulée, donc l'expression matche aussi des mots courants " +
          "(`E[A-Z]{4,}` avec `i` matche « ecran »). Séparer en deux expressions : les codes en " +
          "casse exacte, les mots en insensible" });
    }
  }
  return constats;
}

// ---- recette : les deux sens, sur des sources fabriquées -------------------------------------
if (args.includes("--self-test")) {
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  console.log("Recette d'oracle-pieges-regex — les deux sens\n");

  // P1 · le cas EXACT du 23/08 : la règle des écarts d'un relevé, morte sur un titre accentué.
  const p1 = juger('const ECARTE = /(^|\\n)\\s*#{2,}\\s*[^\\n]*\\b(écart|refus)\\b/i;');   // piege-ok
  att("P1 — `\\b` devant une lettre accentuée est attrapé", p1.some((c) => c.piege === "P1"));
  att("P1 — le constat dit POURQUOI l'expression ne matchera jamais",
    p1.some((c) => /NE MATCHERA JAMAIS/.test(c.message)));
  att("P1 — `\\b` APRÈS une lettre accentuée est attrapé aussi",
    juger("const QUI = /(tranché\\b|validé\\b)/i;").some((c) => c.piege === "P1"));
  att("P1 — la même expression SANS frontière est acceptée",
    juger("const ECARTE = /(écart|ecart|refus)/i;").length === 0);
  att("P1 — une frontière sur un mot ASCII reste acceptée",
    juger("const M = /\\b(exit|status)\\b/;").length === 0);

  // P2 · le cas EXACT du 23/08 : la règle S21, qui rendait PASS sur une action sans trace.
  const p2 = juger('const TRACE = /(HTTP\\s*\\d{3}|\\bE[A-Z]{4,}\\b|refusé)/i;');   // piege-ok
  att("P2 — classe de majuscules sous drapeau insensible attrapée", p2.some((c) => c.piege === "P2"));
  att("P2 — le constat propose la SÉPARATION en deux expressions",
    p2.some((c) => /Séparer en deux expressions/.test(c.message)));
  att("P2 — la même expression SANS le drapeau est acceptée",
    juger('const TRACE = /(HTTP\\s*\\d{3}|\\bE[A-Z]{4,}\\b)/;').length === 0);   // piege-ok
  att("P2 — un drapeau insensible sans classe de majuscules reste accepté",
    juger("const M = /(permission denied|access denied)/i;").length === 0);

  // Verrou de faux positif : une expression banale ne doit rien déclencher.
  att("aucun constat sur des expressions ordinaires",
    juger('const A = /^\\s*\\|/; const B = /\\.(md|json)$/i; const C = /(\\d+)\\s*%/;').length === 0);

  console.log(`\nRecette pieges-regex : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

// ---- balayage du parc ------------------------------------------------------------------------
// Le corps principal ne s'execute que si le fichier est LANCE, jamais s'il est importe : sans ce
// garde, un test qui importe `juger` declenche un balayage complet du parc et se lit comme une
// sortie d'oracle. Meme garde que `oracle-fraicheur-doc`.
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (!lanceEnDirect) { /* importe : on s'arrete ici */ } else {
const racine = args.find((a) => !a.startsWith("--")) || process.env.FORGE_ROOT || join(PILOT, "..");
if (!existsSync(racine)) {
  console.log(JSON.stringify({ oracle: "oracle-pieges-regex", verdict: "SKIP",
    findings: [{ regle: "P0", statut: "SANS_OBJET", ou: String(racine), message: "racine introuvable" }],
    non_juge: NON_JUGE }, null, 1));
  process.exit(2);
}
const depots = readdirSync(racine, { withFileTypes: true })
  // UNE SEULE EXCLUSION NOMMÉE SUBSISTE, ET SA CAUSE EST ÉCRITE (règle N-13) :
  // `digit-ai-forge-audit_client-a` est l'espace d'engagement CLIENT — privé, hors bootstrap,
  // et porteur de livrables et non d'outillage. Ce n'est pas une forge : le balayer
  // rendrait des constats sur des artefacts remis, que personne ne peut plus corriger.
  // Les alternatives `_old$`, `_vide$` et `.bundle$` ont été RETIRÉES le 23/08 : plus aucun
  // répertoire du parc ne les portait, et une alternative sans cible est une règle morte
  // qui donne l'illusion d'une protection. La convention qui les remplace est le PRÉFIXE
  // `_archive-` (voir references/CONVENTION-DEPOTS-MIS-DE-COTE.md) : un dépôt mis de côté
  // sort du motif `^digit-ai` par son NOM, une fois, au lieu d'être exclu dans chaque oracle.
  .filter((e) => e.isDirectory() && /^digit-ai/.test(e.name) && !/_client-a$/.test(e.name))
  .map((e) => e.name);

let lus = 0;
const trouves = [];
for (const depot of depots) {
  const base = join(racine, depot);
  const cibles = [...DOSSIERS.map((d) => join(base, d)), join(base, ".claude", "skills")];
  for (const dossier of cibles) {
    for (const f of fichiers(dossier)) {
      let texte = "";
      try { texte = readFileSync(f, "utf8"); } catch { continue; }
      lus += 1;
      for (const c of juger(texte)) {
        trouves.push({ ...c, ou: `${depot}/${relative(base, f).replaceAll("\\", "/")}:${c.ligne}` });
      }
    }
  }
}
for (const t of trouves) ko(t.piege, t.ou, `${t.message} — expression : /${t.corps.slice(0, 90)}/`);
if (!trouves.length) ok("P1+P2", String(racine), `${lus} fichier(s) de code lus dans ${depots.length} dépôt(s) : aucune expression atteinte par les deux pièges connus`);

console.log(JSON.stringify({ oracle: "oracle-pieges-regex", version: "1.0.0", racine: String(racine),
  verdict: trouves.length ? "FAIL" : "PASS", findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
process.exit(trouves.length ? 1 : 0);
}
