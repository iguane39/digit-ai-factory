#!/usr/bin/env node
/**
 * bancs-isoles.mjs — TOUT BANC QUI TOUCHE LA CHAÎNE D'ANONYMISATION POSE SES PROPRES TABLES.
 *
 * ============================================================================================
 * POURQUOI CE CONTRÔLE PLUTÔT QU'UNE GARDE DE PLUS DANS LA CHAÎNE (TF-0957, 08/09/2026)
 * ============================================================================================
 *
 * Le 08/09, les 46 bancs du dépôt ont été joués d'affilée avec `FORGE_NOMS_INTERDITS` et
 * `FORGE_PRODUITS_PSEUDO` pointant sur les tables RÉELLES du canal confidentiel — ce que fait
 * n'importe quelle session ouverte. Cinq bancs ne posaient pas leurs propres tables jetables :
 * leurs produits jouets sont entrés dans le référentiel de PRODUCTION, y recevant neuf
 * pseudonymes consécutifs, et la porte de publication a refusé le dépôt sur 81 constats — tous
 * portant sur des noms qui ne sont le nom de personne.
 *
 * Deux gardes ont été posées dans `anonymiser-entrant.mjs` le même jour, et il faut dire ce
 * qu'elles couvrent VRAIMENT :
 *
 *   1. le refus d'étendre une table hors du répertoire temporaire quand le point d'entrée du
 *      processus est un banc — elle attrape un banc qui appelle la chaîne LUI-MÊME ;
 *   2. un marqueur d'environnement hérité par les sous-processus — mais il n'est posé qu'à
 *      l'IMPORT du module, et les cinq bancs fautifs ne l'importent pas : ils lancent
 *      `ingerer-lot.mjs` en sous-processus. MESURÉ le 08/09, isolation retirée d'un de ces
 *      bancs : la table de production est réécrite malgré les deux gardes.
 *
 * Il n'existe aucun point de passage commun à tous les bancs où poser le marqueur, et remonter
 * l'arbre des processus se devine au lieu de se mesurer. La prévention est donc bornée, et c'est
 * écrit plutôt que promis. Ce qui ferme réellement le cas est ce module : un CONTRÔLE qui refuse
 * un banc non isolé, joué avec les autres recettes du dossier. Il ne devine rien — il lit le
 * texte des bancs et cherche deux choses : est-ce que ce banc touche la chaîne, et est-ce qu'il
 * désigne ses tables avant.
 *
 * Usage : node todo/bancs-isoles.mjs [--json]   ·   exit 0 si tous isolés, 1 sinon.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");

/** Les dossiers où vivent des bancs susceptibles de toucher la chaîne. */
const DOSSIERS = ["todo", "scripts", "oracles", "gabarits", "."];

/**
 * Le banc touche-t-il la chaîne d'anonymisation, directement ou par un module qui l'appelle ?
 *
 * LE MOTIF CHERCHE UN APPEL, JAMAIS UNE MENTION, et ça s'est payé au premier jeu du contrôle :
 * écrit sur les seuls noms de modules, il accusait un banc qui cite « emettre-travaux » DANS UNE
 * CHAÎNE DE TEST — il éprouve la lecture d'une ligne de rapport, et ne touche rien. Un contrôle
 * qui crie sur une occurrence en prose se fait désactiver, exactement comme celui qu'il protège.
 * D'où deux formes admises et deux seulement : le nom de module avec son extension (un import ou
 * un sous-processus le porte toujours), ou la fonction d'inscription suivie de sa parenthèse.
 */
const TOUCHE_LA_CHAINE = /(?:anonymiser-entrant|anonymiser-suivis|ingerer-lot|reempreinter-lot|emettre-travaux)\.mjs|pseudoProduit\s*\(|pseudonymeProduit\s*\(/;

/** Le banc DÉSIGNE-t-il ses tables ? Les deux variables, posées avant tout appel. */
const DESIGNE_SES_TABLES = /FORGE_PRODUITS_PSEUDO/;

/** … et sous le répertoire temporaire, jamais un chemin en dur du parc. */
const TABLES_JETABLES = /mkdtempSync|tmpdir\(\)/;

export function relever(racine = RACINE) {
  const bancs = [];
  for (const d of DOSSIERS) {
    let noms = [];
    try { noms = readdirSync(join(racine, d)); } catch { continue; }
    for (const n of noms) {
      if (!/\.test\.mjs$/i.test(n)) continue;
      const chemin = join(racine, d, n);
      let txt = "";
      try { txt = readFileSync(chemin, "utf8"); } catch { continue; }
      if (!TOUCHE_LA_CHAINE.test(txt)) continue;
      const rel = relative(racine, chemin).replaceAll("\\", "/");
      const designe = DESIGNE_SES_TABLES.test(txt);
      const jetables = TABLES_JETABLES.test(txt);
      bancs.push({ fichier: rel, designe, jetables, isole: designe && jetables });
    }
  }
  return bancs.sort((a, b) => a.fichier.localeCompare(b.fichier));
}

export function verifier(racine = RACINE) {
  const bancs = relever(racine);
  const nus = bancs.filter((b) => !b.isole);
  return {
    oracle: "bancs-isoles", regle: "TF-0957",
    cible: relative(process.cwd(), racine).replaceAll("\\", "/") || ".",
    bancs_touchant_la_chaine: bancs.length,
    isoles: bancs.length - nus.length,
    constats: nus.map((b) => ({
      statut: "FAIL", fichier: b.fichier,
      message: b.designe
        ? "désigne ses tables mais PAS sous le répertoire temporaire — un chemin en dur du parc reste le référentiel de production"
        : "touche la chaîne d'anonymisation sans désigner ses tables : il hérite des variables de la session, "
          + "et écrit ses noms de fixtures dans le référentiel RÉEL",
      remede: "poser des tables jetables sous `mkdtempSync(join(tmpdir(), …))` et les désigner par "
        + "`process.env.FORGE_NOMS_INTERDITS` et `process.env.FORGE_PRODUITS_PSEUDO` AVANT tout appel — "
        + "les sous-processus en héritent",
    })),
    verdict: nus.length ? "FAIL" : "PASS",
    non_juge: [
      "les bancs qui ne touchent PAS la chaîne : ils n'ont rien à isoler",
      "la PRÉVENTION dans la chaîne elle-même : les deux gardes de `anonymiser-entrant.mjs` couvrent le banc "
        + "qui l'appelle directement, jamais celui qui lance un sous-processus — limite mesurée le 08/09 et écrite ici",
      "l'ORDRE des instructions : ce contrôle voit que les tables sont désignées, pas qu'elles le sont avant le premier appel",
    ],
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
    === process.argv[1].toLowerCase().replaceAll("\\", "/")) {
  const r = verifier();
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    for (const c of r.constats) console.log(`  [FAIL] ${c.fichier} — ${c.message}`);
    console.log(`\nBancs isolés (TF-0957) : ${r.isoles}/${r.bancs_touchant_la_chaine} touchant la chaîne, ${r.constats.length} FAIL`);
  }
  process.exit(r.verdict === "PASS" ? 0 : 1);
}
