#!/usr/bin/env node
/**
 * oracle-invariant-mesure.mjs — UN CONTRÔLE MESURE L'INVARIANT QU'IL PROTÈGE, PAS UNE GRANDEUR
 * QUI LUI EST SEULEMENT CORRÉLÉE
 * (classe `controle-vrai-sur-le-mauvais-invariant`, famille `regle-morte`).
 *
 * ============================================================================================
 * LE DÉFAUT EST DANGEREUX PARCE QUE SA MÉCANIQUE EST JUSTE
 * ============================================================================================
 *
 * Un contrôle qui compte les enregistrements d'un dépôt pour en déduire le plus grand identifiant
 * déjà frappé a raison tant que la corrélation tient. Le jour où elle se rompt — une histoire
 * réécrite, un dépôt recloné, un renommage en masse —, il rend un verdict FAUX avec un calcul
 * EXACT : donc incontestable, puisque son arithmétique est vérifiable. Deux aggravations le
 * rendent coûteux plutôt que gênant, et la classe les nomme toutes les deux : le remède qu'il
 * propose est dérivé de la mauvaise grandeur, donc parfois destructeur pour la situation réelle ;
 * et son échappatoire fait DÉCLARER à l'opérateur un état qui n'est pas le sien, ce qui laisse une
 * trace fausse dans un journal que quelqu'un relira comme un fait.
 *
 * ============================================================================================
 * CE QUI EST MESURÉ, ET CE QUE CET ORACLE NE PRÉTEND PAS FAIRE
 * ============================================================================================
 *
 * « Une grandeur corrélée » n'est pas mécanisable en général : reconnaître qu'un compte tient lieu
 * d'invariant demande de savoir ce que l'auteur protégeait. Cet oracle ne le prétend pas. Il juge
 * LA FORME FONDATRICE et LES DEUX AGGRAVATIONS, parce que ce sont les trois choses que la classe
 * décrit et que les trois se lisent dans la source :
 *
 *   IN1 · aucun IDENTIFIANT — un prochain, un maximum, un numéro, un indice — n'est dérivé d'un
 *         COMPTE. C'est la forme fondatrice, mot pour mot : « un nombre de commits pour un maximum
 *         d'identifiant ». La forme JUSTE existe à côté et sert de contre-exemple vivant dans ce
 *         dépôt : `todo\ingerer-lot.mjs` prend `Math.max(...ids) + 1`, l'invariant lui-même, et
 *         jamais `ids.length + 1`.
 *   IN2 · toute ÉCHAPPATOIRE d'un contrôle est EXPLIQUÉE dans le fichier qui l'offre — au moins
 *         une fois ailleurs que dans sa lecture d'argument. Une option de contournement qu'aucune
 *         phrase ne décrit fait sauter un contrôle sans que personne sache ce qui a été sauté.
 *   IN3 · aucune échappatoire ne fait DÉCLARER une SUPPOSITION. Une option dont le nom même porte
 *         l'hypothèse (`--assume…`, `--suppose…`, `--sans-verifier…`) demande à l'opérateur
 *         d'affirmer un état qu'il n'a pas constaté, et cette affirmation devient une trace.
 *
 * Recette à double sens : `oracles\oracle-invariant-mesure.test.mjs`.
 *
 * Usage : node oracles\oracle-invariant-mesure.mjs [<depot>] [--json]
 *   exit 0 PASS · exit 1 FAIL · exit 2 SANS OBJET — « je ne peux pas mesurer » a son code a lui,
 *   sans quoi une panne d'environnement se lit comme un defaut de l'artefact juge (TF-0648).
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

export const REPERTOIRES = ["oracles", "todo", "scripts"];

/**
 * UNE AFFECTATION SE LIT EN DEUX MORCEAUX, et c'est la calibration qui a coûté le plus cher :
 * juger la LIGNE entière rendait deux faux positifs sur ce dépôt le 22/09/2026 — une ligne où le
 * mot « suivant » nomme un titre de section et où `.length` compare deux niveaux de titre, et une
 * ligne où le compte sert de CONDITION (`if (x.length) …`) et où le mot « identifiant » n'est
 * qu'un morceau du nom d'une propriété. Le motif cherche donc un nom d'identifiant à GAUCHE d'un
 * `=` simple, et le compte à DROITE, jamais les deux n'importe où sur la ligne.
 */
export const RE_AFFECTATION = /^(?:(?:export|const|let|var)\s+)*([A-Za-z_$][\w$.]*)\s*=(?!=)\s*(.+)$/;
export const RE_NOM_IDENTIFIANT = /^(prochain|suivant|max|maximum|numero|num[ée]ro|indice|identifiant)[A-Za-z_$]*$/i;

/** Les formes qui COMPTENT. `rev-list --count` est la forme exacte du fait fondateur. */
export const RE_COMPTE = /rev-list[^\n]*--count|--count\b|\.length\b|wc\s+-l/;

/**
 * L'INDEXATION DU DERNIER ÉLÉMENT N'EST PAS UNE DÉRIVATION : `releves[releves.length - 1]` lit le
 * dernier relevé, il ne fabrique aucun identifiant.
 */
export const RE_INDEXATION = /\[\s*[\w.]+\.length\s*-\s*1\s*\]/;

/**
 * UNE OPTION EXISTE QUAND ELLE EST LUE, pas quand elle est nommée. La borne a été mesurée sur cet
 * oracle lui-même : le vocabulaire des échappatoires, écrit dans son propre code pour les
 * reconnaître, se faisait accuser d'OFFRIR trois options de contournement. Un vocabulaire n'offre
 * rien — seule une lecture d'argument offre. Le motif exige donc la forme de la lecture.
 */
export const RE_LECTURE_OPTION = /(?:includes|indexOf|has|startsWith)\(\s*["'`](--[\w-]+)["'`]/g;
export const MOTS_D_ECHAPPATOIRE = /^--(?:force|forcer|ignorer|sauter|skip|bypass|assume|assumer|suppose|supposer|sans-verifier|sans-v[ée]rifier)/;
export const MOTS_DE_SUPPOSITION = /^--(?:assume|assumer|suppose|supposer|sans-verifier|sans-v[ée]rifier)/;

export function derivationsFautives(texte) {
  return String(texte).split(/\r?\n/)
    .map((l, i) => ({ ligne: i + 1, texte: l.trim() }))
    .filter(({ texte: l }) => {
      if (l.startsWith("*") || l.startsWith("//")) return false;   // un commentaire n'exécute rien
      const m = l.match(RE_AFFECTATION);
      if (!m) return false;
      const [, nom, valeur] = m;
      if (!RE_NOM_IDENTIFIANT.test(nom)) return false;
      if (!RE_COMPTE.test(valeur)) return false;
      if (RE_INDEXATION.test(valeur)) return false;
      // UN COMPTE DANS UN PRÉDICAT N'EST PAS LA VALEUR AFFECTÉE. Calibration mesurée : une ligne
      // `const suivant = titres.find((x) => … .length <= …)` affecte un TITRE trouvé, et le compte
      // y compare deux niveaux de titre à l'intérieur de la fonction de recherche. Une dérivation
      // fautive — `ids.length + 1`, un `rev-list --count` — ne porte jamais de fonction flèche.
      if (/=>/.test(valeur)) return false;
      if (/Math\.max/.test(valeur)) return false;                   // la forme juste, prise sur l'invariant
      return true;
    });
}

/** Les options de contournement que ce fichier LIT réellement. */
export function echappatoiresLues(texte) {
  const lues = new Set();
  for (const m of String(texte).matchAll(RE_LECTURE_OPTION)) {
    if (MOTS_D_ECHAPPATOIRE.test(m[1])) lues.add(m[1]);
  }
  return [...lues];
}

export function fichiersDuDepot(depot) {
  const trouves = [];
  const marcher = (d) => {
    let entrees;
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!/^(node_modules|\.git|output|input|old)$/.test(e.name)) marcher(p); }
      else if (/\.mjs$/.test(e.name) && !/\.test\.mjs$/.test(e.name)) trouves.push(p);
    }
  };
  for (const r of REPERTOIRES) marcher(join(depot, r));
  return trouves;
}

export function juger(depot) {
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
  const rel = (p) => relative(depot, p) || p;

  const fichiers = fichiersDuDepot(depot);
  if (!fichiers.length) {
    return { verdict: "SANS_OBJET", findings: [{ regle: "IN0", statut: "SKIP", message: `aucun contrôle sous ${depot} — rien à juger` }], lus: 0 };
  }

  const derives = [], muettes = [], suppositions = [];
  for (const f of fichiers) {
    let t = "";
    try { t = readFileSync(f, "utf8"); } catch { continue; }
    for (const d of derivationsFautives(t)) derives.push({ f, ...d });
    for (const o of echappatoiresLues(t)) {
      if (t.split(o).length - 1 < 2) muettes.push({ f, o });
      if (MOTS_DE_SUPPOSITION.test(o)) suppositions.push({ f, o });
    }
  }

  // ---- IN1 -------------------------------------------------------------------------------------
  if (derives.length) {
    ko("IN1", derives.map((d) => `${rel(d.f)}:${d.ligne}`).join(", "),
      `${derives.length} identifiant(s) dérivé(s) d'un COMPTE au lieu de l'invariant : `
      + derives.map((d) => `${rel(d.f)}:${d.ligne} « ${d.texte.slice(0, 70)} »`).join(" ; ")
      + `. Tant que la corrélation tient, le calcul est exact et le verdict est faux sans que personne le voie ; `
      + `le jour où elle se rompt, le remède proposé est dérivé de la mauvaise grandeur. La forme juste est dans `
      + `ce dépôt : prendre le maximum des identifiants eux-mêmes, jamais leur nombre`);
  } else {
    ok("IN1", `aucun identifiant n'est dérivé d'un compte sur ${fichiers.length} contrôle(s) lus`);
  }

  // ---- IN2 -------------------------------------------------------------------------------------
  if (muettes.length) {
    ko("IN2", muettes.map((m) => rel(m.f)).join(", "),
      `${muettes.length} échappatoire(s) qu'aucune phrase du fichier n'explique : `
      + muettes.map((m) => `${rel(m.f)} offre ${m.o}`).join(" ; ")
      + ". Une option de contournement que rien ne décrit fait sauter un contrôle sans que personne sache ce "
      + "qui a été sauté — et c'est ce que le lecteur du journal croira vérifié");
  } else {
    ok("IN2", "toute échappatoire offerte est expliquée ailleurs que dans sa lecture d'argument");
  }

  // ---- IN3 -------------------------------------------------------------------------------------
  if (suppositions.length) {
    ko("IN3", suppositions.map((s) => rel(s.f)).join(", "),
      `${suppositions.length} échappatoire(s) font DÉCLARER une supposition : `
      + suppositions.map((s) => `${rel(s.f)} offre ${s.o}`).join(" ; ")
      + ". Une option dont le nom porte l'hypothèse demande à l'opérateur d'affirmer un état qu'il n'a pas "
      + "constaté ; l'affirmation devient une trace, et la trace sera relue comme un fait");
  } else {
    ok("IN3", "aucune échappatoire ne demande de déclarer un état supposé — ce qui se déclare se constate");
  }

  return {
    verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F,
    lus: fichiers.length, derivations: derives.length, echappatoires_muettes: muettes.length,
  };
}

export const NON_JUGE = [
  "la SUBSTITUTION D'INVARIANT en général : reconnaître qu'un contrôle mesure une grandeur seulement corrélée à ce qu'il protège demande de savoir ce que son auteur protégeait. Cet oracle juge la forme FONDATRICE — un identifiant dérivé d'un compte — et les deux aggravations que la classe nomme, jamais la famille entière. La borne est écrite parce qu'un oracle qui promettrait la famille entière rendrait un vert qui ne vaut rien",
  "la JUSTESSE du remède qu'un contrôle propose : IN1 constate la dérivation, il ne lit pas si le message qui suit conseille bien ou mal",
  "les contrôles écrits hors JavaScript : le même défaut y est possible et n'est pas mesuré ici",
  "une dérivation écrite sur PLUSIEURS lignes (un compte affecté d'abord, employé comme identifiant vingt lignes plus bas) : la mesure est faite ligne à ligne, et la forme multiligne lui échappe. Aucune n'a été trouvée sur ce dépôt, et la borne est déclarée plutôt que promise",
  "les recettes `*.test.mjs`, écartées par construction : une fixture écrit volontairement la forme fautive pour prouver que l'oracle sait échouer",
];

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const depot = resolve(args.find((a) => !a.startsWith("--")) || join(ICI, ".."));
  const r = juger(depot);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-invariant-mesure", version: "1.0.0", cible: depot, ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-invariant-mesure — ${depot}`);
    console.log(`verdict : ${r.verdict} (${r.lus ?? 0} contrôle(s) lus)`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
