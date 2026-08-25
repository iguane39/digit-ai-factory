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
 *         amont, et le dire évite deux vérités sur le même objet. Et il rend l'état le plus
 *         GRAVE des trois que la présence porte — non ignoré < SUIVI < PUBLIÉ (TF-0619) —
 *         parce que le plus faible appelle un `git rm --cached` et le plus grave une ROTATION
 *         D'IDENTIFIANT : un libellé commun aux deux fait rendre le mauvais geste.
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
  "la PUBLICATION est jugée sur les références distantes du DISQUE : aucun `fetch` n'est joué, donc un porteur publié APRÈS le dernier fetch est vu « non publié ». Un contrôle hors ligne ne peut pas tenir une promesse de fraîcheur, et un dépôt sans aucune référence distante rend `publication_non_verifiee` plutôt que « non publié » (N-16)",
  "ce qu'un porteur PUBLIÉ contient réellement : l'état dit que le contenu est déposé, pas qu'il porte un secret valide. Juger cela exigerait de l'ouvrir, ce que ce contrôle ne fait jamais — la rotation est donc RECOMMANDÉE, et la décision reste humaine",
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

// TF-0619 (25/08) — LA PRÉSENCE PORTE TROIS ÉTATS, JAMAIS DEUX, et c'est N-26 sur l'autre face.
// N-26 dit qu'un objet ABSENT porte trois états et que le cran manquant ne se devine pas : il faut
// regarder AILLEURS pour le voir. La présence d'un porteur de secrets dans un dépôt en porte trois
// aussi, et la première version de SP2 ne lisait que le plus faible :
//
//     non ignoré  <  SUIVI par git  <  PUBLIÉ sur un dépôt distant
//
// LE FAIT : le 25/08, SP2 a signalé trois porteurs « dans un dépôt qui ne les ignore pas ». Vrai
// pour les trois. Mais l'un était SUIVI et son commit PRÉSENT sur `origin/main` chez Azure DevOps —
// donc son contenu est déposé, et le retirer du disque n'y change rien ; un autre était SUIVI sur
// deux commits, non publié. Un seul portait vraiment l'état le plus faible.
//
// UN CONTRÔLE QUI SOUS-ESTIME EST LE COUSIN DE CELUI QUI SUR-ESTIME, et il est plus dangereux :
// son constat est VRAI, donc rien n'alerte. « Non ignoré » se lit « pourrait être commité un jour »
// et appelle un `git rm --cached` ; « publié » se lit « le secret est parti » et appelle une
// ROTATION D'IDENTIFIANT — deux gestes différents, pour un même libellé. Le coût a été payé : une
// décision humaine a été rendue sur la lecture faible.
//
// LES DEUX BORNES, déclarées et non promises (N-16 : un négatif sur une ressource externe ne se
// prononce pas depuis une seule sonde) :
//   · un dépôt SANS aucune référence distante connue localement ne se juge pas « non publié » — il
//     se juge `publication_non_verifiee`. L'absence de preuve n'est pas la preuve de l'absence ;
//   · AUCUN `fetch` n'est joué. Les références distantes lues sont celles du disque, donc peut-être
//     périmées : un fichier publié APRÈS le dernier fetch est vu « non publié ». Le dire, plutôt
//     que de promettre une fraîcheur qu'un contrôle hors ligne ne peut pas tenir.
const ETATS = ["non_ignore", "suivi", "publication_non_verifiee", "publie"];
const GRAVITE = (e) => ETATS.indexOf(e);

/** Le porteur est-il SUIVI par git ? Une question à l'index, aucune lecture du fichier. */
function suiviParGit(depot, chemin) {
  return spawnSync("git", ["-C", depot, "ls-files", "--error-unmatch", chemin],
    { encoding: "utf8" }).status === 0;
}

/** Ce dépôt connaît-il au moins une référence distante ? Sinon la publication n'est pas jugeable. */
function aDesReferencesDistantes(depot) {
  const r = spawnSync("git", ["-C", depot, "for-each-ref", "--count=1", "refs/remotes"],
    { encoding: "utf8" });
  return r.status === 0 && String(r.stdout).trim().length > 0;
}

/**
 * L'état le plus GRAVE des trois, MESURÉ. Le fichier lui-même n'est jamais ouvert : on interroge
 * l'index, l'historique et les références distantes — jamais le contenu.
 */
function etatDansLeDepot(depot, chemin) {
  if (!suiviParGit(depot, chemin)) return { etat: "non_ignore" };
  if (!aDesReferencesDistantes(depot)) return { etat: "publication_non_verifiee" };
  const log = spawnSync("git", ["-C", depot, "log", "--format=%H", "--all", "--", chemin],
    { encoding: "utf8" });
  const commits = String(log.stdout || "").split("\n").map((x) => x.trim()).filter(Boolean);
  for (const sha of commits) {
    const b = spawnSync("git", ["-C", depot, "branch", "-r", "--contains", sha, "--format=%(refname:short)"],
      { encoding: "utf8" });
    const branches = String(b.stdout || "").split("\n").map((x) => x.trim()).filter(Boolean);
    // `git branch -r` liste aussi les pointeurs symboliques (`origin`, alias de `origin/HEAD`).
    // Les nommer rendrait « PUBLIÉ sur `origin` », un renvoi que le lecteur ne peut pas rouvrir :
    // il ne désigne aucune branche. On préfère une branche RÉELLE, et l'alias en dernier recours.
    const reelles = branches.filter((x) => x.includes("/") && !/\/HEAD$/.test(x));
    // La branche NOMMÉE est celle qui porte le plus loin : « publié sur `origin/main` » n'a pas la
    // même portée que « publié sur une branche de travail », et prendre la première de la liste
    // rendait l'une pour l'autre au hasard de l'ordre alphabétique. La principale d'abord, donc.
    const principale = reelles.find((x) => /\/(main|master|develop)$/.test(x));
    if (branches.length) {
      return { etat: "publie", sha, branche: (principale || reelles[0] || branches[0]),
        branches: reelles.length || branches.length };
    }
  }
  // Suivi, des références distantes existent, et aucun de ses commits n'y figure : non publié.
  return { etat: "suivi", commits: commits.length };
}

export function juger(racineParc) {
  const horsDepot = [];
  const dansDepotNonIgnore = [];
  let lus = 0;
  for (const p of porteurs(racineParc)) {
    lus += 1;
    const depot = depotDe(p);
    if (!depot) { horsDepot.push(p); continue; }
    if (!ignoreParSonDepot(depot, p)) {
      dansDepotNonIgnore.push({ p, depot, ...etatDansLeDepot(depot, p) });
    }
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
    // TF-0619 — L'ÉCHELLE DES TROIS ÉTATS, chacun joué sur un dépôt fabriqué exprès. Un état
    // dont la branche rouge n'est jamais jouée est une branche morte qui se croit vivante.
    att("SP2 — un porteur non ignoré et NON SUIVI rend l'état le plus FAIBLE",
      r.dansDepotNonIgnore.find((x) => basename(x.p) === "credentials.json").etat === "non_ignore");

    // Un dépôt SANS aucune référence distante : la publication n'est pas jugeable (N-16).
    const seul = join(base, "sans-remote");
    mkdirSync(seul, { recursive: true });
    execFileSync("git", ["-C", seul, "init", "-q"]);
    execFileSync("git", ["-C", seul, "config", "user.email", "recette@local"]);
    execFileSync("git", ["-C", seul, "config", "user.name", "recette"]);
    writeFileSync(join(seul, ".env"), "CLE=valeur\n", "utf8");
    execFileSync("git", ["-C", seul, "add", ".env"]);
    execFileSync("git", ["-C", seul, "commit", "-q", "-m", "suivi"]);
    const rSeul = juger(seul).dansDepotNonIgnore.find((x) => basename(x.p) === ".env");
    att("SP2 — un porteur SUIVI dans un dépôt sans référence distante rend `publication_non_verifiee`, jamais « non publié »",
      rSeul && rSeul.etat === "publication_non_verifiee");

    // Le même dépôt, cloné : le clone connaît des références distantes, et son `.env` y est PUBLIÉ.
    const clone = join(base, "clone");
    execFileSync("git", ["clone", "-q", seul, clone]);
    const rClone = juger(clone).dansDepotNonIgnore.find((x) => basename(x.p) === ".env");
    att("SP2 — un porteur suivi dont un commit vit sur une référence distante rend `publie`",
      rClone && rClone.etat === "publie" && typeof rClone.branche === "string");
    att("SP2 — l'état `publie` nomme le commit qui le prouve, pour que le lecteur puisse le contredire",
      rClone && /^[0-9a-f]{7,40}$/.test(String(rClone.sha)));

    // Le sens ROUGE de l'échelle : un porteur suivi dont AUCUN commit n'est publié reste `suivi`.
    writeFileSync(join(clone, "autre.key"), "x\n", "utf8");
    execFileSync("git", ["-C", clone, "config", "user.email", "recette@local"]);
    execFileSync("git", ["-C", clone, "config", "user.name", "recette"]);
    execFileSync("git", ["-C", clone, "add", "autre.key"]);
    execFileSync("git", ["-C", clone, "commit", "-q", "-m", "local seulement"]);
    const rLocal = juger(clone).dansDepotNonIgnore.find((x) => basename(x.p) === "autre.key");
    att("SP2 — un porteur suivi sur un commit LOCAL seulement rend `suivi`, pas `publie`",
      rLocal && rLocal.etat === "suivi" && rLocal.commits === 1);
    att("l'échelle est ORDONNÉE : publié est plus grave que suivi, lui-même plus grave que non ignoré",
      GRAVITE("publie") > GRAVITE("suivi") && GRAVITE("suivi") > GRAVITE("non_ignore"));

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
    // L'ÉTAT LE PLUS GRAVE OUVRE LE MESSAGE, et chaque ligne porte le sien : « non ignoré » appelle
    // un `git rm --cached`, « publié » appelle une ROTATION D'IDENTIFIANT. Un libellé commun aux
    // deux ferait rendre le mauvais geste, ce qui est exactement le coût payé le 25/08.
    const parGravite = [...dansDepotNonIgnore].sort((a, b) => GRAVITE(b.etat) - GRAVITE(a.etat));
    const LIBELLE = {
      publie: (x) => `PUBLIÉ sur \`${x.branche}\` (commit ${String(x.sha).slice(0, 7)}${x.branches > 1 ? `, et ${x.branches} branches distantes le contiennent` : ""}) — le contenu est DÉPOSÉ : ` +
        "le retirer du disque n'y change rien, seule une ROTATION de l'identifiant réduit le risque",
      publication_non_verifiee: () => "SUIVI par git, et sa publication n'est PAS VÉRIFIABLE ici — " +
        "ce dépôt ne connaît aucune référence distante, et une absence de preuve n'est pas une preuve d'absence (N-16)",
      suivi: (x) => `SUIVI par git sur ${x.commits} commit(s), non publié — un seul \`push\` suffirait, ` +
        "donc le retirer du suivi passe AVANT toute publication",
      non_ignore: () => "non ignoré, non suivi — l'état le plus faible des trois, sujet de R-14",
    };
    const pire = parGravite[0].etat;
    ko("SP2", String(racine), `${dansDepotNonIgnore.length} porteur(s) de secrets DANS un dépôt qui ne les IGNORE PAS, ` +
      `état le plus grave : ${pire.toUpperCase()}. ` +
      parGravite.map((x) => `${rel(x.p)} → ${LIBELLE[x.etat](x)}`).join(" · ") +
      ". La PRÉSENCE porte TROIS états et jamais deux (TF-0619, N-26 sur l'autre face) : non ignoré < " +
      "suivi < publié, et le plus faible appelle un autre geste que le plus grave. L'état `non_ignore` " +
      "reste le sujet de R-14 et de son oracle, qui en est le juge : ce constat le SIGNALE et le lui " +
      "renvoie, il ne le double pas — deux vérités sur le même objet en valent zéro");
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
  console.log(JSON.stringify({ oracle: "oracle-secrets-hors-perimetre", version: "1.1.0",
    racine: String(racine), verdict,
    bloquant: bloquants.length > 0,
    portee_du_blocage: "exit 1 SEULEMENT si un constat porte sur le pilot ou une forge — ailleurs le remède appartient au produit ou à l'humain",
    findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
  process.exit(bloquants.length ? 1 : 0);
}
