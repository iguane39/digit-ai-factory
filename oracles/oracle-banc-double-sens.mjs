#!/usr/bin/env node
/**
 * oracle-banc-double-sens.mjs — UN CONTRÔLE EN SERVICE A UN BANC, ET SON EN-TÊTE NE DIT PAS LE
 * CONTRAIRE DE CE QUI EXISTE (classe `controle-sans-fixture-double-sens`, candidature du 08/09).
 *
 * ============================================================================================
 * CE QUE LE HARNAIS FAIT DÉJÀ, ET CE QU'IL NE FAIT PAS
 * ============================================================================================
 *
 * `self-tests.mjs` porte l'invariant I1 : tout `oracle-*` et tout `hook-*` est couvert par un
 * `--self-test` ou par une entrée de la table des recettes dédiées. Cet oracle ne rejoue pas I1 —
 * deux vérités sur le même objet valent moins qu'une. Il juge les trois choses que I1 ne regarde
 * pas, et que la classe nomme :
 *
 *   BD1 · un en-tête qui AFFIRME un banc — « recette », « banc », « fixtures », « 23 cas » — est
 *         confronté à ce qui existe. La classe dit exactement cela : « son en-tête affirme parfois
 *         en avoir ». Une affirmation d'en-tête se vérifie par le banc, jamais sur parole, parce
 *         que le lecteur qui la croit cesse de chercher.
 *   BD2 · un banc porte au moins une marque de SENS ROUGE — un cas qui déclare que quelque chose
 *         doit échouer. Un banc entièrement vert ne prouve rien : une règle qui cesse de mordre ne
 *         signale rien, et personne ne s'en aperçoit avant que le défaut passe. Le harnais mesure
 *         déjà le sens rouge sur la SORTIE des recettes, en AVERTISSEMENT ; ici la mesure porte sur
 *         la SOURCE du banc et elle est BLOQUANTE, parce qu'un banc dont aucun cas n'est écrit pour
 *         échouer ne le deviendra pas par hasard.
 *   BD3 · un en-tête qui ANNONCE `--self-test` le LIT vraiment. Annoncer un geste qu'on n'offre
 *         pas envoie le lecteur jouer une commande qui ne fait rien — et « rien » ressemble à
 *         « tout va bien ».
 *
 * LA TABLE DES RECETTES DÉDIÉES EST LUE, JAMAIS RECOPIÉE : elle vient de
 * `oracles\lib-recettes-dediees.mjs`, la même source que le harnais. Deux tables auraient divergé
 * au premier ajout, et cet oracle aurait accusé un contrôle que le harnais sait éprouvé.
 *
 * Recette à double sens : `oracles\oracle-banc-double-sens.test.mjs`.
 *
 * Usage : node oracles\oracle-banc-double-sens.mjs [<depot>] [--json]
 *   exit 0 PASS · exit 1 FAIL · exit 2 SANS OBJET — « je ne peux pas mesurer » a son code a lui,
 *   sans quoi une panne d'environnement se lit comme un defaut de l'artefact juge (TF-0648).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DEDIES } from "./lib-recettes-dediees.mjs";
import { MOTIFS_SENS_ROUGE } from "./lib-sens-rouge.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

/** Un CONTRÔLE : un oracle ou un hameçon. Les recettes et les bibliothèques n'en sont pas. */
export const EST_UN_CONTROLE = (nom) => /^(?:oracle|hook)-.*\.mjs$/.test(nom) && !/\.test\.mjs$/.test(nom);

/** La hauteur d'en-tête où une affirmation de banc se lit — le commentaire de tête, pas le corps. */
export const HAUTEUR_ENTETE = 4000;

/** Les mots par lesquels un en-tête AFFIRME porter un banc. */
export const RE_AFFIRME_UN_BANC = /\brecette\b|\bbanc\b|\bfixtures?\b|\bdouble\s+sens\b|\b\d+\s+cas\b/i;

/** Le banc d'un contrôle : la forme dédiée d'abord (table partagée), le voisin ensuite. */
export function bancDe(chemin, nom, dedies = DEDIES) {
  const repertoire = dirname(chemin);
  if (dedies[nom]) {
    const p = join(repertoire, dedies[nom]);
    return existsSync(p) ? p : null;
  }
  const voisin = chemin.replace(/\.mjs$/, ".test.mjs");
  return existsSync(voisin) ? voisin : null;
}

/** Un `--self-test` LU, c'est-à-dire présent comme littéral dans le code, pas seulement annoncé. */
export const litSonSelfTest = (texte) => /["'`]--self-test["'`]/.test(String(texte));

/** Une marque de sens rouge dans la SOURCE d'un banc : un cas écrit pour échouer. */
export const porteUnSensRouge = (texte) => MOTIFS_SENS_ROUGE.some(({ motif }) => motif.test(String(texte)));

/** Les familles de sens rouge reconnues dans un banc — nommées, pour que le verdict le soit aussi. */
export const famillesDeSensRouge = (texte) =>
  MOTIFS_SENS_ROUGE.filter(({ motif }) => motif.test(String(texte))).map(({ nom }) => nom);

export function controlesDuDepot(depot) {
  const trouves = [];
  for (const d of ["oracles", "todo", "scripts"]) {
    let entrees;
    try { entrees = readdirSync(join(depot, d), { withFileTypes: true }); } catch { continue; }
    for (const e of entrees) if (e.isFile() && EST_UN_CONTROLE(e.name)) trouves.push({ chemin: join(depot, d, e.name), nom: e.name });
  }
  return trouves;
}

export function juger(depot, { dedies = DEDIES } = {}) {
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
  const rel = (p) => relative(depot, p) || p;

  const controles = controlesDuDepot(depot);
  if (!controles.length) {
    return { verdict: "SANS_OBJET", findings: [{ regle: "BD0", statut: "SKIP", message: `aucun contrôle sous ${depot} — rien à juger` }], lus: 0 };
  }

  const menteurs = [], sansRouge = [], selfTestAnnonceNonLu = [];
  let avecBanc = 0;

  for (const { chemin, nom } of controles) {
    let t = "";
    try { t = readFileSync(chemin, "utf8"); } catch { continue; }
    const entete = t.slice(0, HAUTEUR_ENTETE);
    const banc = bancDe(chemin, nom, dedies);
    const selfTest = litSonSelfTest(t);

    if (RE_AFFIRME_UN_BANC.test(entete) && !banc && !selfTest) menteurs.push({ chemin, nom });
    if (/--self-test/.test(entete) && !selfTest) selfTestAnnonceNonLu.push({ chemin, nom });
    if (banc) {
      avecBanc++;
      let b = "";
      try { b = readFileSync(banc, "utf8"); } catch { /* illisible : compté au même titre qu'un banc sans rouge */ }
      if (!porteUnSensRouge(b)) sansRouge.push({ chemin, nom, banc });
    }
  }

  // ---- BD1 -------------------------------------------------------------------------------------
  if (menteurs.length) {
    ko("BD1", menteurs.map((m) => rel(m.chemin)).join(", "),
      `${menteurs.length} contrôle(s) dont l'en-tête AFFIRME un banc qui n'existe pas : `
      + menteurs.map((m) => rel(m.chemin)).join(", ")
      + ". Une affirmation d'en-tête se vérifie par le banc, jamais sur parole : le lecteur qui la croit "
      + "cesse de chercher, et aucune règle du contrôle n'est alors éprouvée");
  } else {
    ok("BD1", `${controles.length} contrôle(s) lus : aucune affirmation d'en-tête ne promet un banc absent`);
  }

  // ---- BD2 -------------------------------------------------------------------------------------
  if (sansRouge.length) {
    ko("BD2", sansRouge.map((s) => rel(s.banc)).join(", "),
      `${sansRouge.length} banc(s) dont AUCUN cas ne déclare un sens rouge : `
      + sansRouge.map((s) => `${rel(s.banc)} (banc de ${rel(s.chemin)})`).join(", ")
      + ". Un banc entièrement vert ne prouve pas que le contrôle sait échouer — une règle qui cesse de "
      + "mordre ne signale rien, et une règle qui se met à mordre sur un artefact conforme bloque tout le "
      + "monde sans qu'on sache pourquoi. Le remède est un cas, pas une promesse d'en-tête");
  } else {
    ok("BD2", `les ${avecBanc} banc(s) trouvé(s) déclarent chacun au moins un cas écrit pour échouer`);
  }

  // ---- BD3 -------------------------------------------------------------------------------------
  if (selfTestAnnonceNonLu.length) {
    ko("BD3", selfTestAnnonceNonLu.map((s) => rel(s.chemin)).join(", "),
      `${selfTestAnnonceNonLu.length} contrôle(s) annoncent \`--self-test\` sans le lire : `
      + selfTestAnnonceNonLu.map((s) => rel(s.chemin)).join(", ")
      + ". Le lecteur joue une commande qui ne fait rien, et « rien » ressemble à « tout va bien »");
  } else {
    ok("BD3", "tout contrôle qui annonce `--self-test` le lit réellement");
  }

  return {
    verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F,
    lus: controles.length, avec_banc: avecBanc, sans_sens_rouge: sansRouge.length,
  };
}

export const NON_JUGE = [
  "la COUVERTURE d'un banc : BD2 constate qu'au moins un cas est écrit pour échouer, jamais que toutes les règles du contrôle soient éprouvées. Un banc à trente cas verts et un rouge passe, et c'est une borne assumée — mesurer la couverture demanderait de savoir quelles règles le contrôle porte",
  "l'EXISTENCE d'un banc en elle-même : c'est l'invariant I1 de `oracles\\self-tests.mjs`, et le rejouer ici ferait deux vérités sur le même objet. BD1 ne juge que l'ÉCART entre ce que l'en-tête affirme et ce qui existe",
  "le sens rouge est reconnu par des MOTS dans la source du banc — « rouge », « double sens », « doit échouer ». Un banc qui joue un cas rouge sans le dire est compté comme sans rouge, et c'est délibéré : un cas rouge que son auteur ne nomme pas ne se relit pas non plus",
  "les contrôles des FORGES et des produits : chaque dépôt a son harnais, et R-43 dit que ses règles priment chez lui",
  "les contrôles écrits hors JavaScript, et les bibliothèques `lib-*` : une bibliothèque n'est pas un contrôle en service, elle est éprouvée par les contrôles qui l'emploient",
];

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const depot = resolve(args.find((a) => !a.startsWith("--")) || join(ICI, ".."));
  const r = juger(depot);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-banc-double-sens", version: "1.0.0", cible: depot, ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-banc-double-sens — ${depot}`);
    console.log(`verdict : ${r.verdict} (${r.lus ?? 0} contrôle(s) lus, ${r.avec_banc ?? 0} avec banc)`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
