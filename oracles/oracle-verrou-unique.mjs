#!/usr/bin/env node
/**
 * oracle-verrou-unique.mjs — L'HISTORIQUE EST LE VERROU, ET IL N'Y EN A PAS DE SECOND (**R-41**).
 *
 * ============================================================================================
 * CE QUE LA RÈGLE DIT, ET POURQUOI UN SECOND VERROU EST PIRE QU'AUCUN
 * ============================================================================================
 *
 * R-41 pose que réclamer une unité de travail se matérialise par un déplacement suivi d'un
 * commit : **l'historique EST le verrou et la piste d'audit**. Elle interdit tout mécanisme de
 * verrou parallèle, et son motif est le seul qui compte — *un second verrou est une seconde
 * vérité, et c'est celui qu'on oublie de relâcher*. Un verrou orphelin ne se voit pas : il ne
 * casse rien, il bloque quelqu'un plus tard, et personne ne sait qui l'a posé ni quand.
 *
 * Corollaire directement utile, écrit dans la règle : la question « qui est l'écrivain unique »
 * n'a pas à être tranchée si le verrou est le commit.
 *
 * Écrite en août, la règle n'était jouée par RIEN — mesuré le 22/09/2026 par
 * `oracle-regle-sans-juge`. La décision humaine D-18 (a) a tranché : écrire le contrôle.
 *
 * IL REND VERT SUR LE PARC au jour de sa naissance, et c'est un CLIQUET : aucun verrou maison n'y
 * existe, et le contrôle est là pour que le premier qui apparaîtra soit nommé le jour même.
 *
 * ============================================================================================
 * CE QUI EST MESURÉ
 * ============================================================================================
 *
 *   VU1 · aucun ARTEFACT de verrou ne vit dans le parc, hors des verrous de GESTIONNAIRE DE
 *         PAQUETS, qui ne verrouillent pas du travail mais des versions de dépendances. La liste
 *         des exemptés est COURTE et écrite — l'élargir par un motif large laisserait passer
 *         exactement ce qu'on cherche.
 *   VU2 · aucun code n'ÉCRIT un tel artefact. VU1 constate un verrou posé ; VU2 attrape le code
 *         qui le posera au prochain passage, y compris s'il le retire ensuite. C'est le seul des
 *         deux qui voie venir le défaut plutôt que de le constater.
 *
 * Recette à double sens : `oracles\oracle-verrou-unique.test.mjs`.
 *
 * Usage : node oracles\oracle-verrou-unique.mjs [<depot>] [--json]
 *   exit 0 PASS · exit 1 FAIL · exit 2 SANS OBJET — « je ne peux pas mesurer » a son code a lui,
 *   sans quoi une panne d'environnement se lit comme un defaut de l'artefact juge (TF-0648).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

/**
 * Un nom d'artefact de verrou.
 *
 * LE MOTIF ÉTAIT TROP LARGE, ET IL A ACCUSÉ CE FICHIER-CI. Premier essai : tout nom portant
 * « lock », « verrou » ou « claim » entre séparateurs. Résultat mesuré le 22/09/2026 :
 * `oracle-verrou-unique.mjs` et sa recette se dénonçaient eux-mêmes, parce qu'ils sont NOMMÉS
 * d'après la règle qu'ils jouent. Un oracle qui s'accuse apprend à ses lecteurs que ses rouges
 * sont du bruit.
 *
 * Un artefact de verrou n'est pas un fichier source : c'est un fichier dont le nom EST le verrou —
 * un suffixe `.lock` ou `.lck`, un `LOCK` nu, ou un nom sans extension qui dit qu'il réserve.
 */
export const RE_NOM_DE_VERROU = /\.(?:lock|lck)$|^LOCK$|^(?:verrou|claim|reservation)(?:\.[a-z0-9]{1,6})?$/i;

/**
 * Les verrous de GESTIONNAIRE DE PAQUETS. Ils ne verrouillent pas du travail : ils figent des
 * versions de dépendances, et leur présence est une bonne pratique, pas une seconde vérité.
 * La liste est écrite nommément plutôt que devinée par motif — un motif large sur « lock »
 * laisserait passer exactement ce que VU1 cherche.
 */
export const VERROUS_DE_PAQUETS = new Set([
  "package-lock.json", "npm-shrinkwrap.json", "yarn.lock", "pnpm-lock.yaml",
  "uv.lock", "poetry.lock", "Pipfile.lock", "requirements.lock",
  "Cargo.lock", "Gemfile.lock", "composer.lock", "go.sum", "flake.lock",
]);

/** Le code qui ÉCRIT un verrou : une écriture de fichier dont le chemin porte un nom de verrou. */
export const RE_ECRITURE_DE_VERROU = /(?:writeFileSync|appendFileSync|openSync|mkdirSync|createWriteStream|open\s*\(|touch\s)[^\n]{0,70}["'`][^"'`\n]{0,60}(?:\.lock\b|\.lck\b|[\\/]LOCK\b|verrou)/i;

export function artefactsDeVerrou(racine) {
  const trouves = [];
  const marcher = (d) => {
    let entrees;
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!/^(node_modules|\.git|\.venv|venv|dist|build|__pycache__)$/.test(e.name)) marcher(p); continue; }
      if (VERROUS_DE_PAQUETS.has(e.name)) continue;
      if (RE_NOM_DE_VERROU.test(e.name)) trouves.push(p);
    }
  };
  marcher(racine);
  return trouves;
}

export function fichiersDeCode(racine) {
  const trouves = [];
  const marcher = (d) => {
    let entrees;
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!/^(node_modules|\.git|\.venv|venv|dist|build|__pycache__|output|input|old)$/.test(e.name)) marcher(p); }
      else if (/\.(mjs|cjs|js|py|sh)$/.test(e.name) && !/\.test\.mjs$/.test(e.name)) trouves.push(p);
    }
  };
  marcher(racine);
  return trouves;
}

export function juger(depot) {
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
  const rel = (p) => relative(depot, p) || p;

  if (!existsSync(depot)) {
    return { verdict: "SANS_OBJET", findings: [{ regle: "VU0", statut: "SKIP", message: `${depot} introuvable — rien à mesurer` }], lus: 0 };
  }

  const artefacts = artefactsDeVerrou(depot);
  const code = fichiersDeCode(depot);
  if (!code.length && !artefacts.length) {
    return { verdict: "SANS_OBJET", findings: [{ regle: "VU0", statut: "SKIP", message: `aucun code ni artefact sous ${depot} — rien à mesurer` }], lus: 0 };
  }

  const poseurs = [];
  for (const f of code) {
    let t = "";
    try { t = readFileSync(f, "utf8"); } catch { continue; }
    String(t).split(/\r?\n/).forEach((l, i) => {
      if (/^\s*(?:\/\/|\*|#)/.test(l)) return;                        // un commentaire n'écrit rien
      // UN VOCABULAIRE N'ÉCRIT RIEN. Mesuré sur ce fichier même : la définition du motif ci-dessus
      // contient les noms des fonctions d'écriture et se faisait accuser d'écrire un verrou.
      if (/^\s*(?:export\s+)?const\s+\w+\s*=\s*\//.test(l)) return;
      if (!RE_ECRITURE_DE_VERROU.test(l)) return;
      // UN VERROU DE PAQUET ÉCRIT PAR UNE FIXTURE N'EN EST PAS UN. Mesuré : `oracles\self-test.mjs`
      // fabrique un `yarn.lock` pour éprouver un autre contrôle, et il fige des versions, pas du travail.
      const cible = (l.match(/["'`]([^"'`\n]{1,80})["'`]/g) || []).join(" ");
      if ([...VERROUS_DE_PAQUETS].some((v) => cible.includes(v))) return;
      poseurs.push({ rel: rel(f), ligne: i + 1, texte: l.trim().slice(0, 70) });
    });
  }

  // ---- VU1 -------------------------------------------------------------------------------------
  if (artefacts.length) {
    ko("VU1", artefacts.map(rel).join(", "),
      `${artefacts.length} artefact(s) de verrou hors de l'historique : ${artefacts.map(rel).join(", ")}. `
      + "R-41 pose que l'historique EST le verrou : un second verrou est une seconde vérité, et c'est celui "
      + "qu'on oublie de relâcher. Un verrou orphelin ne casse rien le jour où il est posé — il bloque "
      + "quelqu'un plus tard, sans que personne sache qui l'a posé ni quand");
  } else {
    ok("VU1", `aucun artefact de verrou hors de l'historique ; ${VERROUS_DE_PAQUETS.size} noms de verrous de `
      + "gestionnaire de paquets sont exemptés nommément, parce qu'ils figent des versions et non du travail");
  }

  // ---- VU2 -------------------------------------------------------------------------------------
  if (poseurs.length) {
    ko("VU2", poseurs.map((p) => `${p.rel}:${p.ligne}`).join(", "),
      `${poseurs.length} ligne(s) de code ÉCRIVENT un verrou : `
      + poseurs.map((p) => `${p.rel}:${p.ligne} « ${p.texte} »`).join(" ; ")
      + ". Un code qui pose un verrou le posera au prochain passage, même s'il le retire ensuite — "
      + "et le jour où il s'arrête avant de le retirer, le verrou reste");
  } else {
    ok("VU2", `aucune des ${code.length} unité(s) de code lues n'écrit un artefact de verrou`);
  }

  return { verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F, lus: code.length, artefacts: artefacts.length };
}

export const NON_JUGE = [
  "« PAS DE REÇU, PAS DE DONE » — le second volet de R-41, qui exige que la complétion se prouve par un artefact structuré. Cet oracle ne le mesure PAS : juger qu'un reçu existe demanderait de savoir quelle unité de travail vient d'être close, ce qu'aucune lecture de fichier ne dit. La borne est écrite plutôt que promise, et le volet reste opposable en revue humaine",
  "les verrous posés AILLEURS que dans un fichier : une clé en base, un enregistrement distant, un verrou consultatif de système de fichiers qui ne laisse aucune trace sur disque. VU1 lit une arborescence, et cette limite est structurelle",
  "les verrous de GESTIONNAIRE DE PAQUETS, exemptés NOMMÉMENT et non par motif : ils figent des versions de dépendances, jamais du travail. Un nom absent de cette liste courte sera accusé, et c'est voulu — un motif large sur « lock » laisserait passer exactement ce que la règle cherche",
  "que l'historique soit RÉELLEMENT employé comme verrou : l'oracle constate l'absence de second verrou, jamais la présence du premier. Son contraire est pourtant certain — là où un verrou maison existe, l'historique a cessé d'être la seule vérité",
  "les recettes `*.test.mjs`, écartées de VU2 par construction : une fixture écrit le défaut à dessein pour prouver que l'oracle sait échouer",
];

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const depot = resolve(args.find((a) => !a.startsWith("--")) || join(ICI, ".."));
  const r = juger(depot);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-verrou-unique", version: "1.0.0", regle: "R-41", cible: depot, ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-verrou-unique (R-41) — ${depot} (${basename(depot)})`);
    console.log(`verdict : ${r.verdict} (${r.lus ?? 0} unité(s) de code lues)`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
