#!/usr/bin/env node
/**
 * verifier-familles-mesure.mjs — N-10 : une mesure qui rend PLUSIEURS familles est LUE en entier,
 * ou son reste est déclaré (TF-0530, 23/08/2026).
 *
 * LE FAIT QUI IMPOSE CE CONTRÔLE. La mesure de rendu du socle produit une douzaine de familles de
 * constats — débordements, contraste, chevauchements, largeurs de lecture, alignements. Elle
 * tournait déjà sur les routes servies d'un produit depuis le 20/08, et rendait ces familles EN
 * MÊME TEMPS. Un seul appelant lisait le contraste ; **tout le reste était jeté**. Le trou n'a été
 * vu que le 23/08, en cherchant autre chose : trois familles bloquantes mesurées et perdues, dont
 * les débordements horizontaux qui avaient vécu deux mois en production.
 *
 * LA RÈGLE QUI EN SORT : un consommateur de mesure lit toutes les familles, ou porte une BRANCHE
 * PAR DÉFAUT qui rapporte celles qu'il ne connaît pas. Sans l'une des deux, une famille neuve
 * naît invisible — et personne ne l'apprendra, puisque rien n'échoue.
 *
 *   F1 · une famille produite et LUE PAR PERSONNE : avertissement, famille nommée. La règle se
 *        juge sur L'ENSEMBLE des consommateurs, et le premier passage sur le parc l'a imposé —
 *        le pan contraste lit le contraste, le pan plancher lit le reste : chacun pris seul
 *        « jette » neuf familles, et pourtant rien ne se perd. « Lue en entier » est une
 *        propriété de la CHAÎNE, pas de chaque maillon ;
 *   F2 · une famille CITÉE par un consommateur et plus produite : ÉCHEC — branche morte, elle
 *        donne l'illusion d'une couverture qui n'existe plus ;
 *   F3 · le relevé, par consommateur : combien de familles il nomme, et s'il porte une branche
 *        par défaut. Informatif — c'est la matière du verdict d'ensemble, pas un jugement.
 *
 * Usage : node scripts/verifier-familles-mesure.mjs [--json] · --self-test
 * Exit : 0 = PASS (avertissements possibles) · 1 = branche morte · 2 = SKIP motivé.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const PARC = process.env.FORGE_ROOT || join(PILOT, "..");
const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");

const F = [];
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const av = (regle, ou, message) => F.push({ regle, statut: "AVERTISSEMENT", ou, message });
const so = (regle, ou, message) => F.push({ regle, statut: "SANS_OBJET", ou, message });

const NON_JUGE = [
  "les familles produites AILLEURS que par la mesure du socle : ce contrôle a UNE source de production déclarée, il ne découvre pas les autres",
  "la JUSTESSE de la lecture : qu'un consommateur mentionne une famille ne prouve pas qu'il en fait quelque chose d'utile — seul le fait qu'il la NOMME est vérifié",
  "les consommateurs hors de la liste écrite ci-dessous : un appelant neuf reste invisible tant qu'il n'y figure pas, et c'est le prix d'une liste écrite plutôt que devinée",
  "la SÉVÉRITÉ que chaque consommateur donne à une famille : lire une famille bloquante comme un simple avertissement est une dérive que ce contrôle ne voit pas (elle a été payée le 23/08 chez forge-design)",
];

/** La SOURCE de production. Deux endroits, et le premier passage sur le parc a imposé le second :
 *  le littéral `issues = { … }` de la mesure, ET les familles ajoutées APRÈS coup côté Python
 *  (`setdefault("etat_muet", …)`). Ne lire que le littéral faisait accuser deux consommateurs de
 *  brancher sur une famille morte alors qu'elle est bel et bien produite. */
export function famillesProduites(source) {
  const out = new Set();
  const m = /issues\s*=\s*\{([\s\S]*?)\}\s*;/.exec(source);
  if (m) for (const x of m[1].matchAll(/([a-z][a-z0-9_]*)\s*:/gi)) out.add(x[1]);
  for (const x of source.matchAll(/setdefault\(\s*["']([a-z][a-z0-9_]*)["']/gi)) out.add(x[1]);
  return [...out];
}

/** Un consommateur MENTIONNE une famille dès qu'il écrit son nom, et porte une branche par défaut
 *  s'il rapporte ce qu'il ne connaît pas. Les deux se lisent dans le texte, sans exécution. */
export function lecture(source, familles) {
  const nommees = familles.filter((f) => new RegExp(`\\b${f}\\b`).test(source));
  const parDefaut = /\|\|\s*\{\s*regle:|FAMILLES\[[^\]]+\]\s*\|\||famille inconnue|render_page:\$\{|non connue/i.test(source);
  return { nommees, parDefaut };
}

// Les consommateurs, écrits une fois : chemin relatif au parc, et ce qu'ils sont censés faire.
const CONSOMMATEURS = [
  ["digit-ai-forge-tests/forge_tests/adaptateurs/plancher.py", "pan plancher de forge-tests (V1, V4, L2 sur instance servie)"],
  ["digit-ai-forge-tests/forge_tests/adaptateurs/contraste.py", "pan contraste de forge-tests (V2 sur instance servie)"],
  ["digit-ai-forge-design/oracles/rendu-comparatif.mjs", "comparatif avant/après de forge-design"],
  ["digit-ai-factory/scripts/verifier-rendu-instances.mjs", "contrôle de rendu des instances de gabarits (pilot)"],
];
const SOCLE = join(homedir(), ".claude", "skills", "digit-ai-page-html", "scripts", "render_page.py");

const sortir = (code) => {
  console.log(JSON.stringify({ outil: "verifier-familles-mesure",
    verdict: F.some((f) => f.statut === "FAIL") ? "FAIL"
      : F.every((f) => f.statut === "SANS_OBJET") ? "SANS_OBJET" : "PASS",
    findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
  process.exit(code);
};

// ---- recette : les deux sens, sur des sources fabriquées --------------------------------------
if (args.includes("--self-test")) {
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  console.log("Recette de verifier-familles-mesure — les deux sens\n");

  const MESURE = 'const issues = { v1_overflow: [], v2_contrast: [], l2_freres: [], etat_muet: [] };';
  const produites = famillesProduites(MESURE);
  att("les familles produites sont lues dans le littéral de la mesure",
    produites.length === 4 && produites.includes("etat_muet"));
  att("un littéral absent ne fait pas planter : aucune famille",
    famillesProduites("rien ici").length === 0);

  const partiel = lecture('for (const e of issues["v2_contrast"]) { rapporter(e); }', produites);
  att("un consommateur qui ne lit QU'UNE famille est vu comme tel",
    partiel.nommees.length === 1 && !partiel.parDefaut);
  const complet = lecture('const F = { v1_overflow: 1, v2_contrast: 1, l2_freres: 1, etat_muet: 1 };', produites);
  att("un consommateur qui nomme tout est vu comme complet", complet.nommees.length === 4);
  const defaut = lecture('const meta = FAMILLES[famille] || { regle: `render_page:${famille}` };', produites);
  att("une BRANCHE PAR DÉFAUT est reconnue : rien ne se perd en silence", defaut.parDefaut);

  // F2 · la branche morte : un consommateur qui nomme une famille que la mesure ne produit plus.
  const mort = lecture("compter(issues.v9_disparue)", produites);
  att("une famille nommée et NON produite n'apparaît pas comme lue (branche morte)",
    !mort.nommees.includes("v9_disparue"));

  console.log(`\nRecette familles-mesure : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

// ---- balayage réel ---------------------------------------------------------------------------
if (!existsSync(SOCLE)) {
  so("F0", SOCLE, "mesure du socle introuvable — sans source de production, il n'y a rien à confronter");
  sortir(2);
}
const produites = famillesProduites(readFileSync(SOCLE, "utf8"));
if (!produites.length) {
  so("F0", SOCLE, "aucun littéral de familles lu dans la mesure — la forme du fichier a changé, le contrôle se déclare aveugle plutôt que vert");
  sortir(2);
}
ok("F0", "socle", `${produites.length} famille(s) produites par la mesure : ${produites.join(", ")}`);

// LA RÈGLE SE JUGE SUR L'ENSEMBLE, et le premier passage l'a imposé : le pan contraste lit le
// contraste, le pan plancher lit le reste — chacun pris seul « jette » neuf familles, et pourtant
// rien ne se perd. « Une mesure lue en entier » est une propriété de la CHAÎNE de consommateurs.
const lecteursParFamille = new Map(produites.map((f) => [f, []]));
let auMoinsUneBrancheDefaut = false;
for (const [rel, quoi] of CONSOMMATEURS) {
  const chemin = join(PARC, rel);
  if (!existsSync(chemin)) { so("F1", rel, `${quoi} : fichier absent du poste — non confronté`); continue; }
  const source = readFileSync(chemin, "utf8");
  const { nommees, parDefaut } = lecture(source, produites);
  for (const f of nommees) lecteursParFamille.get(f).push(rel.split("/").pop());
  if (parDefaut) auMoinsUneBrancheDefaut = true;

  // F2 · une famille citée par le consommateur et absente de la production : branche morte.
  const citees = [...source.matchAll(/\b(v\d+_[a-z_]+|l2_[a-z_]+|etat_[a-z_]+|unmeasured)\b/g)].map((m) => m[1]);
  const mortes = [...new Set(citees)].filter((c) => !produites.includes(c) && c !== "v1_tronque");
  if (mortes.length) {
    ko("F2", rel, `${quoi} : ${mortes.length} famille(s) citée(s) et PLUS produites par la mesure ` +
      `(${mortes.join(", ")}) — branche morte : elle donne l'illusion d'une couverture qui n'existe plus`);
  }
  ok("F3", rel, `${quoi} : ${nommees.length}/${produites.length} famille(s) nommée(s)` +
    (parDefaut ? ", et une BRANCHE PAR DÉFAUT rapporte les autres" : ", sans branche par défaut"));
}

// F1 · le verdict d'ensemble : une famille que PERSONNE ne lit est une mesure jetée.
const orphelines = produites.filter((f) => !lecteursParFamille.get(f).length);
if (!orphelines.length) {
  ok("F1", "chaîne de consommateurs", `les ${produites.length} familles produites sont lues par au ` +
    `moins un consommateur (${CONSOMMATEURS.length} déclarés)` +
    (auMoinsUneBrancheDefaut ? ", et une branche par défaut rapporte l'inconnu" : ""));
} else {
  av("F1", "chaîne de consommateurs", `${orphelines.length} famille(s) MESURÉE(S) ET LUE(S) PAR ` +
    `PERSONNE — ${orphelines.join(", ")}. C'est le défaut exact du 23/08 : trois familles bloquantes ` +
    "étaient mesurées sur chaque route servie et jetées, dont les débordements qui avaient vécu deux " +
    "mois en production. Les lire dans un consommateur, ou déclarer pourquoi elles ne servent pas");
}
sortir(F.some((f) => f.statut === "FAIL") ? 1 : 0);
