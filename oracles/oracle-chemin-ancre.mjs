#!/usr/bin/env node
/**
 * oracle-chemin-ancre.mjs — UN CONTRÔLE QUI JUGE UNE COPIE INSTALLÉE RÉSOUT SA RACINE PAR LA
 * VARIABLE DE LA PLATEFORME, PAS PAR UN CHEMIN CODÉ EN DUR
 * (classe `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas`, fondée par TF-0995).
 *
 * ============================================================================================
 * DEUX FAITS PAYÉS, ET LE SECOND EST PIRE QUE LE PREMIER
 * ============================================================================================
 *
 * TF-0995 (15/09/2026) — un contrôle mesurait le répertoire de configuration par défaut alors
 * que la session en chargeait un autre, désigné par `CLAUDE_CONFIG_DIR`. Il rendait PASS sur un
 * parc que personne n'avait chargé : les artefacts étaient bien là, alignés, à jour, et aucun
 * n'était lu. Le défaut est invisible par construction, parce que le verdict ne NOMMAIT pas le
 * répertoire mesuré — rien dans la sortie ne permettait de s'apercevoir qu'on regardait ailleurs.
 *
 * TF-1297 (22/09/2026) — trouvé par la simulation du circuit hébergé, et c'est la forme AGGRAVÉE.
 * `oracle-controle-maison.mjs` résout `homedir()` AU CHARGEMENT DU MODULE, hors de tout try : sur
 * un runner sans répertoire personnel, il lève `SystemError ERR_SYSTEM_ERROR, uv_os_homedir
 * returned ENOENT` avant d'avoir produit quoi que ce soit. Il ne rend alors ni PASS, ni FAIL, ni
 * SKIP — il ne rend RIEN, et son consommateur lit cette absence comme un échec de sa propre règle.
 * Le défaut se paie chez un TIERS, et il est invisible sur le poste où tout le monde le joue :
 * la même recette rend 14 cas verts sur 14 ici, et échoue en isolement.
 *
 * ============================================================================================
 * CE QUI EST MESURÉ
 * ============================================================================================
 *
 *   CA1 · tout fichier qui résout une RACINE DE CONFIGURATION (le répertoire personnel joint à un
 *         dossier de configuration) passe par la fonction partagée `scripts\lib-config-installee.mjs`,
 *         qui rend le chemin ET la variable qui l'a décidé. Une résolution maison rend un chemin
 *         sans provenance, et un verdict sans provenance ne se conteste pas.
 *   CA2 · aucune résolution du répertoire personnel ne se fait au NIVEAU MODULE. Au niveau module,
 *         l'échec précède le verdict : il n'y a plus d'oracle, seulement une trace de pile. La
 *         résolution vit dans une fonction, et l'absence de répertoire personnel se déclare
 *         SANS OBJET avec son motif, jamais en plantant.
 *   CA3 · la fonction partagée rend bien les DEUX choses — le chemin et la variable qui l'a
 *         décidé. Si elle cesse de rendre la provenance, tous ses consommateurs la perdent en
 *         silence, et le remède de TF-0995 redevient le défaut de TF-0995.
 *
 * Recette à double sens : `oracles\oracle-chemin-ancre.test.mjs`.
 *
 * Usage : node oracles\oracle-chemin-ancre.mjs [<depot>] [--json]
 *   exit 0 PASS · exit 1 FAIL · exit 2 SANS OBJET — « je ne peux pas mesurer » a son code a lui,
 *   sans quoi une panne d'environnement se lit comme un defaut de l'artefact juge (TF-0648).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

export const LIB_PARTAGEE = join("scripts", "lib-config-installee.mjs");
export const REPERTOIRES = ["oracles", "todo", "scripts"];
export const FICHIERS = ["bootstrap.mjs"];

/** Le répertoire personnel, sous les deux formes que le parc emploie. */
export const RE_HOME = /\bhomedir\(\)|process\.env\.(?:HOME|USERPROFILE)\b/;

/**
 * Une RACINE DE CONFIGURATION, et pas n'importe quel chemin sous le répertoire personnel : le
 * répertoire personnel joint à un dossier de configuration d'agent. Un script qui écrit un
 * fichier temporaire sous le répertoire personnel ne juge aucune copie installée.
 */
export const RE_RACINE_CONFIG = /homedir\(\)\s*,\s*["'`]\.claude/;

/**
 * Une résolution AU NIVEAU MODULE : une déclaration de premier niveau — donc sans indentation —
 * dont la valeur touche le répertoire personnel. L'indentation est le discriminant, parce qu'une
 * déclaration indentée vit dans une fonction, et qu'une fonction ne s'exécute pas au chargement.
 */
export function resolutionsAuNiveauModule(texte) {
  return String(texte).split(/\r?\n/)
    .map((l, i) => ({ ligne: i + 1, texte: l }))
    .filter(({ texte: l }) => /^(?:export\s+)?(?:const|let|var)\s+[\w{[]/.test(l) && RE_HOME.test(l));
}

export function fichiersDuDepot(depot) {
  const trouves = [];
  const marcher = (d) => {
    let entrees;
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!/^(node_modules|\.git|output|input|old)$/.test(e.name)) marcher(p); }
      else if (/\.mjs$/.test(e.name)) trouves.push(p);
    }
  };
  for (const r of REPERTOIRES) marcher(join(depot, r));
  for (const f of FICHIERS) { const p = join(depot, f); if (existsSync(p)) trouves.push(p); }
  return trouves;
}

export function juger(depot) {
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
  const rel = (p) => relative(depot, p) || p;

  const fichiers = fichiersDuDepot(depot);
  if (!fichiers.length) {
    return { verdict: "SANS_OBJET", findings: [{ regle: "CA0", statut: "SKIP", message: `aucun fichier exécutable sous ${depot} — rien à juger` }], lus: 0 };
  }

  const cheminLib = join(depot, LIB_PARTAGEE);
  const libPresente = existsSync(cheminLib);
  const sansLib = [], auModule = [];

  for (const f of fichiers) {
    if (rel(f).replaceAll("\\", "/") === LIB_PARTAGEE.replaceAll("\\", "/")) continue; // la lib EST la résolution
    if (/\.test\.mjs$/i.test(f)) continue;                                             // un banc pose ses propres racines
    let t = "";
    try { t = readFileSync(f, "utf8"); } catch { continue; }
    if (!RE_HOME.test(t)) continue;
    if (RE_RACINE_CONFIG.test(t) && !/lib-config-installee/.test(t)) sansLib.push(f);
    for (const r of resolutionsAuNiveauModule(t)) auModule.push({ f, ...r });
  }

  // ---- CA1 -------------------------------------------------------------------------------------
  if (sansLib.length) {
    ko("CA1", sansLib.map(rel).join(", "),
      `${sansLib.length} fichier(s) résolvent une racine de configuration SANS la fonction partagée : `
      + sansLib.map(rel).join(", ")
      + `. Elle rend le chemin ET la variable qui l'a décidé (${LIB_PARTAGEE}) ; une résolution maison rend `
      + `un chemin sans provenance, et un verdict qui ne dit pas où il a regardé ne se conteste pas (TF-0995)`);
  } else {
    ok("CA1", `toute résolution de racine de configuration passe par ${LIB_PARTAGEE}`);
  }

  // ---- CA2 -------------------------------------------------------------------------------------
  if (auModule.length) {
    ko("CA2", auModule.map((a) => `${rel(a.f)}:${a.ligne}`).join(", "),
      `${auModule.length} résolution(s) du répertoire personnel AU NIVEAU MODULE : `
      + auModule.map((a) => `${rel(a.f)}:${a.ligne}`).join(", ")
      + `. Sans répertoire personnel — un runner hébergé, un conteneur — le module lève avant d'avoir `
      + `produit un verdict : ni PASS, ni FAIL, ni SKIP, rien, et son consommateur lit cette absence comme `
      + `un échec de sa propre règle. La résolution vit dans une fonction, et l'absence se déclare SANS OBJET (TF-1297)`);
  } else {
    ok("CA2", "aucune résolution du répertoire personnel au chargement d'un module — l'échec ne précède jamais le verdict");
  }

  // ---- CA3 -------------------------------------------------------------------------------------
  if (!libPresente) {
    ko("CA3", LIB_PARTAGEE, `la fonction partagée ${LIB_PARTAGEE} est ABSENTE — le remède de TF-0995 n'existe plus, `
      + "et CA1 n'a plus de cible à recommander");
  } else {
    const lib = readFileSync(cheminLib, "utf8");
    const rendChemin = /chemin/i.test(lib);
    const rendVariable = /decide_par|variable/i.test(lib) && /CLAUDE_CONFIG_DIR/.test(lib);
    if (rendChemin && rendVariable) {
      ok("CA3", `${LIB_PARTAGEE} rend le chemin ET la variable qui l'a décidé — la provenance survit chez tous ses consommateurs`);
    } else {
      ko("CA3", LIB_PARTAGEE, `${LIB_PARTAGEE} ne rend plus les deux choses qu'elle existe pour rendre : `
        + `chemin ${rendChemin ? "oui" : "NON"}, variable décidante ${rendVariable ? "oui" : "NON"}. Ses consommateurs `
        + "perdent la provenance en silence, et le remède de TF-0995 redevient le défaut de TF-0995");
    }
  }

  return {
    verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F,
    lus: fichiers.length, sans_lib: sansLib.length, au_module: auModule.length,
  };
}

export const NON_JUGE = [
  "les chemins codés en dur AUTRES que la racine de configuration : un script qui écrit sous `%TEMP%` ou sous un dossier de travail ne juge aucune copie installée, et l'accuser ferait du bruit sur la totalité du dépôt",
  "que la fonction partagée résolve JUSTE : cet oracle constate qu'on passe par elle et qu'elle rend deux choses, jamais que son ordre de résolution soit le bon. C'est son propre banc qui en répond",
  "les résolutions faites par du code NON JavaScript (Python du socle, scripts shell) : le même défaut y est possible, et aucune mesure n'est faite ici. La borne est déclarée, pas comblée",
  "les recettes `*.test.mjs`, écartées par construction : un banc pose ses propres racines jetables, et c'est exactement ce qu'on lui demande de faire",
  "CA2 discrimine par l'INDENTATION — une déclaration de premier niveau est au niveau module. Une résolution écrite dans une expression immédiatement invoquée au premier niveau échapperait à la mesure ; aucune n'a été trouvée sur ce dépôt, et la forme est déclarée plutôt que promise",
];

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const depot = resolve(args.find((a) => !a.startsWith("--")) || join(ICI, ".."));
  const r = juger(depot);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-chemin-ancre", version: "1.0.0", cible: depot, ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-chemin-ancre — ${depot}`);
    console.log(`verdict : ${r.verdict} (${r.lus ?? 0} fichier(s) lus)`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
