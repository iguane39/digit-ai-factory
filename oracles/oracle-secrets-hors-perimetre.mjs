#!/usr/bin/env node
/**
 * oracle-secrets-hors-perimetre.mjs — « est-il au BON ENDROIT ? », la question qui précède R-14.
 *
 * ============================================================================================
 * POURQUOI CE CONTRÔLE EXISTE (TF-0616, retour Produit-11 du 25/08/2026)
 * ============================================================================================
 *
 * LE FAIT, tel que le produit l'a rapporté sans l'enjoliver. Un agent devait ajouter deux lignes
 * au `.env` d'un produit. Il a écrit `cat >> .env` SANS CHEMIN ABSOLU, depuis un répertoire de
 * travail qui n'était pas celui qu'il croyait. Le fichier a été **créé** — pas modifié, créé —
 * dans le dossier PARENT du dépôt. Un humain y a collé une clé d'abonnement d'API RÉELLE.
 * L'application, elle, lit le `.env` du dépôt : la clé était dans un fichier que rien ne consulte.
 *
 * R-14 N'A PAS ÉTÉ VIOLÉE — ELLE A ÉTÉ CONTOURNÉE PAR LA GÉOGRAPHIE. La règle impose qu'un `.env`
 * réel soit gitignoré et qu'aucun secret ne soit committé ; son oracle juge UN DÉPÔT. Ce fichier
 * n'était dans aucun dépôt : ni `.gitignore` pour le couvrir, ni oracle pour le voir, ni
 * `git status` pour le signaler. *R-14 demande « est-il ignoré ? », question qui n'a de sens que
 * dans un dépôt. La question qui manquait est antérieure : est-il au BON ENDROIT ?*
 *
 * CE QUI A EMPÊCHÉ LA FUITE N'EST PAS UN MÉCANISME, C'EST UNE COÏNCIDENCE : le dossier parent se
 * trouvait ne pas être un dépôt git. S'il l'avait été — cas courant, un dossier de travail qui
 * porte plusieurs projets et un dépôt de notes — la clé se serait retrouvée PRÊTE À ÊTRE
 * COMMITTÉE, dans un dépôt dont le `.gitignore` n'a aucune raison de prévoir un `.env` à sa racine.
 * C'est pourquoi le produit a coté ce retour BLOQUANT sur la classe, et non sur le coût payé.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET COMMENT
 * ============================================================================================
 *
 *   SP1 · un porteur de secrets qui ne vit DANS AUCUN DÉPÔT est un défaut. Il est hors de portée
 *         de tout `.gitignore`, de tout `git status`, de toute recherche de secret jouée sur un
 *         dépôt, et du champ de tout oracle. C'est le cas fondateur, exactement.
 *   SP2 · un porteur de secrets qui vit dans un dépôt mais que ce dépôt N'IGNORE PAS est signalé
 *         et RENVOYÉ à R-14, qui est son juge. Ce contrôle ne la double pas : il la complète en
 *         amont, et le dire évite deux vérités sur le même objet.
 *
 * AUCUNE LECTURE DE CONTENU, JAMAIS — c'est le troisième point de la demande, et il est structurel :
 * un contrôle qui ouvrirait ces fichiers pour « vérifier » deviendrait lui-même un chemin de fuite
 * (journal, message d'erreur, sortie d'oracle). Ici tout se décide sur des NOMS et des CHEMINS.
 *
 * LA RACINE DÉCLARÉE. Un porteur de secrets est légitime DANS un dépôt qui l'ignore. Le périmètre
 * n'est donc pas « le pilot » mais « un dépôt, quel qu'il soit » — ce qui couvre le pilot, les
 * forges et les produits sans avoir à les énumérer, et sans qu'un produit neuf échappe au contrôle
 * faute d'être dans une liste.
 *
 * Usage : node oracle-secrets-hors-perimetre.mjs [racine-du-parc] [--json]
 * Sortie : JSON {oracle,verdict,findings[],non_juge[]} · exit 0 = PASS · 1 = FAIL · 2 = SKIP.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");
const racine = args.find((a) => !a.startsWith("--")) || process.env.FORGE_ROOT || join(PILOT, "..");

const F = [];
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });

/**
 * LA FAMILLE « PORTEUR DE SECRETS », liste FERMÉE et lisible. Elle vient de la demande du produit,
 * et elle est volontairement étroite : un contrôle qui attraperait tout fichier de configuration
 * crierait sur la moitié du parc, et une règle bruyante se fait contourner au lieu de se corriger.
 * `.env.example` et `.env.exemple` en sont EXCLUS nommément — ce sont des gabarits sans valeur,
 * versionnés exprès, et les confondre avec un porteur réel ferait accuser la bonne pratique.
 */
export const PORTEUR_DE_SECRETS = (nom) => {
  if (/^\.env\.(example|exemple|sample|template|dist)$/i.test(nom)) return false;
  if (/\.(example|exemple|sample|template)$/i.test(nom)) return false;
  return /^\.env$/i.test(nom)
    || /^\.env\./i.test(nom)
    || /\.(pem|key|p12|pfx|jks)$/i.test(nom)
    || /^credentials/i.test(nom)
    || /^secrets?[.\-_]/i.test(nom)
    || /^secrets?$/i.test(nom)
    || /^\.npmrc$/i.test(nom)
    || /^\.databrickscfg$/i.test(nom);
};

export const NON_JUGE = [
  "le CONTENU d'un porteur de secrets : ce contrôle ne l'ouvre JAMAIS. Il juge un emplacement, pas une valeur — un contrôle qui lirait ces fichiers pour les vérifier deviendrait lui-même un chemin de fuite (journal, message d'erreur, sortie d'oracle)",
  "la famille est une liste FERMÉE de noms : un porteur de secrets nommé autrement (`ma-cle.txt`) n'est pas vu. La liste étroite est un choix — un contrôle qui attraperait tout fichier de configuration crierait sur la moitié du parc et se ferait désactiver",
  "SP2 SIGNALE sans juger : qu'un porteur soit correctement ignoré par son dépôt est le travail de R-14 (`oracle-conformite-projet`), et deux vérités sur le même objet en valent zéro",
  "la PROFONDEUR est bornée à 3 niveaux sous la racine du parc : un porteur enfoui plus profond dans un dossier hors dépôt n'est pas vu — déclaré plutôt que promis",
  "les dossiers que git ignore DANS un dépôt (`node_modules`, `.venv`) ne sont pas parcourus : un porteur de secrets d'une dépendance tierce n'est pas notre sujet et le signaler noierait les vrais",
];

const IGNORES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next", "vendor", ".pytest_cache", ".ruff_cache", ".mypy_cache"]);

/** Le dépôt qui CONTIENT ce chemin, en remontant. `null` si aucun — c'est le défaut SP1. */
function depotDe(chemin) {
  let d = dirname(chemin);
  for (let i = 0; i < 12; i += 1) {
    if (existsSync(join(d, ".git"))) return d;
    const parent = dirname(d);
    if (parent === d) return null;
    d = parent;
  }
  return null;
}

/** Les porteurs de secrets sous `dir`, par leur NOM seul. Aucun contenu n'est lu. */
function* porteurs(dir, prof = 0) {
  if (prof > 3 || !existsSync(dir)) return;
  let entrees = [];
  try { entrees = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    if (IGNORES.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* porteurs(p, prof + 1);
    else if (PORTEUR_DE_SECRETS(e.name)) yield p;
  }
}

/** Ce dépôt ignore-t-il ce chemin ? Une seule question à git, aucune lecture du fichier. */
function ignoreParSonDepot(depot, chemin) {
  const r = spawnSync("git", ["-C", depot, "check-ignore", "-q", chemin], { encoding: "utf8" });
  return r.status === 0;
}

export function juger(racineParc) {
  const horsDepot = [];
  const dansDepotNonIgnore = [];
  let lus = 0;
  for (const p of porteurs(racineParc)) {
    lus += 1;
    const depot = depotDe(p);
    if (!depot) { horsDepot.push(p); continue; }
    if (!ignoreParSonDepot(depot, p)) dansDepotNonIgnore.push({ p, depot });
  }
  return { lus, horsDepot, dansDepotNonIgnore };
}

// ---- recette : les DEUX SENS, sur une arborescence fabriquée --------------------------------
if (args.includes("--self-test")) {
  const { mkdtempSync, writeFileSync, mkdirSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { execFileSync } = await import("node:child_process");
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  const base = mkdtempSync(join(tmpdir(), "secrets-perimetre-"));
  try {
    // Un dépôt qui ignore son `.env` — la forme SAINE, celle qui ne doit rien déclencher.
    const depot = join(base, "produit");
    mkdirSync(depot, { recursive: true });
    execFileSync("git", ["-C", depot, "init", "-q"]);
    writeFileSync(join(depot, ".gitignore"), ".env\n", "utf8");
    writeFileSync(join(depot, ".env"), "CLE=valeur\n", "utf8");
    // LE CAS FONDATEUR : un `.env` dans le dossier PARENT, qui n'est pas un dépôt.
    writeFileSync(join(base, ".env"), "CLE=valeur\n", "utf8");
    // Un gabarit versionné exprès : il ne doit JAMAIS être accusé.
    writeFileSync(join(depot, ".env.example"), "CLE=\n", "utf8");
    // Un porteur DANS un dépôt mais NON ignoré : SP2, signalé et renvoyé à R-14.
    writeFileSync(join(depot, "credentials.json"), "{}", "utf8");

    const r = juger(base);
    att("SP1 — le cas FONDATEUR est attrapé : un porteur hors de tout dépôt",
      r.horsDepot.length === 1 && basename(r.horsDepot[0]) === ".env");
    att("SP1 — le `.env` correctement ignoré PAR SON DÉPÔT n'est pas accusé",
      !r.horsDepot.some((p) => p.includes("produit")) && !r.dansDepotNonIgnore.some((x) => basename(x.p) === ".env"));
    att("borne — un `.env.example` versionné exprès n'est JAMAIS un porteur",
      !PORTEUR_DE_SECRETS(".env.example") && !PORTEUR_DE_SECRETS(".env.exemple"));
    att("SP2 — un porteur dans un dépôt qui ne l'ignore pas est SIGNALÉ",
      r.dansDepotNonIgnore.some((x) => basename(x.p) === "credentials.json"));
    att("la famille reconnaît les formes usuelles",
      [".env", ".env.local", "cle.pem", "id.key", "credentials.json", "secrets.yaml", ".npmrc", ".databrickscfg"]
        .every(PORTEUR_DE_SECRETS));
    att("la famille NE reconnaît PAS ce qui n'en est pas",
      ![ "README.md", "package.json", "tokens.css", "environnement.md" ].some(PORTEUR_DE_SECRETS));
    // Le second sens de SP1 : plus de porteur hors dépôt une fois le fichier retiré.
    rmSync(join(base, ".env"));
    att("SP1 — le constat DISPARAÎT quand le fichier est retiré (le contrôle n'est pas figé)",
      juger(base).horsDepot.length === 0);
  } finally {
    try { rmSync(base, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou git résiduel toléré */ }
  }
  console.log(`\nRecette secrets-hors-perimetre : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

// ---- balayage du parc ------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  if (!existsSync(racine)) {
    console.log(JSON.stringify({ oracle: "oracle-secrets-hors-perimetre", verdict: "SKIP",
      findings: [{ regle: "SP0", statut: "SANS_OBJET", ou: String(racine), message: "racine du parc introuvable" }],
      non_juge: NON_JUGE }, null, 1));
    process.exit(2);
  }
  const { lus, horsDepot, dansDepotNonIgnore } = juger(racine);
  const rel = (p) => relative(racine, p).replaceAll("\\", "/");

  if (horsDepot.length) {
    ko("SP1", String(racine), `${horsDepot.length} porteur(s) de secrets HORS DE TOUT DÉPÔT : ` +
      `${horsDepot.map(rel).join(", ")}. Ni \`.gitignore\` pour le couvrir, ni \`git status\` pour le ` +
      "signaler, ni recherche de secret pour le trouver — la règle R-14 n'est pas violée, elle est " +
      "CONTOURNÉE PAR LA GÉOGRAPHIE. Vérifier le contenu, déplacer ce qui doit l'être dans le dépôt " +
      "qui l'ignore, puis supprimer (supprimer est un geste HUMAIN, R-29). Cas fondateur du 25/08 : " +
      "une clé d'API réelle collée dans un `.env` créé au dossier PARENT d'un dépôt, par un " +
      "`cat >> .env` lancé depuis un répertoire de travail qui n'était pas celui qu'on croyait");
  } else {
    ok("SP1", String(racine), `${lus} porteur(s) de secrets lus par leur NOM (aucun contenu ouvert) : tous vivent dans un dépôt`);
  }

  if (dansDepotNonIgnore.length) {
    ko("SP2", String(racine), `${dansDepotNonIgnore.length} porteur(s) de secrets DANS un dépôt qui ne les IGNORE PAS : ` +
      `${dansDepotNonIgnore.map((x) => rel(x.p)).join(", ")}. Celui-là est le sujet de R-14 et de son ` +
      "oracle, qui en est le juge : ce constat le SIGNALE et le lui renvoie, il ne le double pas — " +
      "deux vérités sur le même objet en valent zéro");
  } else {
    ok("SP2", String(racine), "aucun porteur de secrets non ignoré par son dépôt");
  }

  // IL NOMME, ET IL NE BLOQUE QUE CE QU'IL PEUT FAIRE RÉPARER — même arbitrage qu'
  // `oracle-portee-doctrine` : « un contrôle qui bloque sur ce qu'il ne peut pas faire réparer
  // apprend à être contourné ». La quasi-totalité des porteurs de secrets du parc vit dans des
  // dossiers PRODUIT, et le pilot n'y écrit pas : le remède appartient au produit ou à l'humain
  // (supprimer est un geste humain, R-29). Le code de sortie est donc 1 SEULEMENT si un constat
  // porte sur le pilot ou sur une forge — ce que le pilot peut, lui, corriger dans l'heure.
  const AUTONOME = /^(digit-ai|_archive-)/;
  const dansNotrePerimetre = (chemin) =>
    AUTONOME.test(relative(racine, chemin).replaceAll("\\", "/").split("/")[0]);
  const bloquants = [...horsDepot, ...dansDepotNonIgnore.map((x) => x.p)].filter(dansNotrePerimetre);
  const verdict = F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  console.log(JSON.stringify({ oracle: "oracle-secrets-hors-perimetre", version: "1.0.0",
    racine: String(racine), verdict,
    bloquant: bloquants.length > 0,
    portee_du_blocage: "exit 1 SEULEMENT si un constat porte sur le pilot ou une forge — ailleurs le remède appartient au produit ou à l'humain",
    findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
  process.exit(bloquants.length ? 1 : 0);
}
