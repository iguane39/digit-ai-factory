#!/usr/bin/env node
/**
 * oracle-empreintes.mjs — la convention d'empreinte tient, ou elle se re-paie (TF-0474, 23/08/2026).
 *
 * POURQUOI CET ORACLE EXISTE. L'écosystème hache du contenu pour juger la fraîcheur d'un artefact
 * en au moins cinq endroits, chacun avec son format. Le coût est établi au registre : SEPT items
 * de la même classe, traités isolément, aucun n'ayant produit de convention — dont DEUX
 * redécouvertes strictes. Le défaut de fins de ligne de TF-0072 (forge-seo) a été rejoué en
 * TF-0253 (pilot) ; le trou de scellement de TF-0288 a été rejoué en TF-0298, dans la MÊME forge,
 * sur le second chemin de promotion.
 *
 * UNE CLASSE DE DÉFAUT SANS CONVENTION SE RE-PAIE AUTANT DE FOIS QU'IL Y A DE SITES. Le format le
 * plus mûr existait déjà (`forge-ops/empreinte@1`, le seul déclaré ET versionné) : l'enjeu n'était
 * pas d'en construire un neuf, c'était de le promouvoir et d'armer ce contrôle.
 *
 *   E1 chaque site DÉCLARÉ dans `references/EMPREINTES.md` existe encore et hache toujours —
 *      un registre qui garde un site mort donne une fausse impression de couverture ;
 *   E2 aucun site de scellement NON DÉCLARÉ dans les emplacements connus. C'est la règle qui fait
 *      tenir la convention : sans elle, le sixième mécanisme naîtrait comme les cinq premiers ;
 *   E3 `--verifier <fichier.json>` : une empreinte au format `@1` porte ses quatre champs, un
 *      horodatage lisible, et au moins un fichier haché en sha256 hexadécimal ;
 *   E4 un site qui hache LE CONTENU D'UN FICHIER NORMALISE ses fins de ligne — par la fonction
 *      partagée `scripts/lib-empreinte.mjs`, ou en le faisant lui-même et visiblement. C'est la
 *      règle qui manquait, et son absence a été payée une cinquième fois (TF-0615, 25/08) : E1 et
 *      E2 tiennent la LISTE des sites, pas leur CONTENU. Trois générateurs de vues du registre
 *      étaient dûment déclarés à la table ET hachaient les octets bruts — donc un sceau différent
 *      sur un poste en CRLF et un poste en LF, pour un registre identique. Un registre qui
 *      déclare empêche d'OUBLIER un site ; il n'empêche pas d'en écrire un mal.
 *
 * Usage : node oracle-empreintes.mjs [racine-des-forges] [--verifier <empreinte.json>] [--json]
 * Sortie : JSON {oracle,version,verdict,findings[],non_juge[]} · exit 0 = PASS · 1 = FAIL · 2 = SKIP.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");
const iVerif = args.indexOf("--verifier");
const aVerifier = iVerif > -1 ? args[iVerif + 1] : null;
const racine = args.find((a) => !a.startsWith("--") && a !== aVerifier)
  || process.env.FORGE_ROOT || join(PILOT, "..");

const F = [];
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
const so = (regle, ou, message) => F.push({ regle, statut: "SANS_OBJET", ou, message });

const NON_JUGE = [
  "la JUSTESSE d'un scellement : que l'empreinte corresponde vraiment au contenu se vérifie sur place, par l'oracle qui la lit — jamais d'ici",
  "les USAGES INTERNES (clé de cache, identifiant de trace, empreinte de jeu de règles) ne jugent aucune fraîcheur d'artefact : ils sont DÉCLARÉS pour ne pas être redécouverts comme des oublis, et ils ne sont pas tenus au format",
  "les sites hors des emplacements connus (scripts/, oracles/, tools/, todo/, scripts de skills, profondeur bornée) restent invisibles — déclaré plutôt que promis",
  "les dépôts frères NON CLONÉS sur le poste ne sont pas jugés : l'absence d'un dépôt n'est pas l'absence d'un site",
  "la GRANULARITÉ d'un sceau (sha256 complet, tronqué à 12 ou 16 hex) n'est pas jugée hors du format `@1` : un sceau court dans une vue générée est une convention locale légitime, déclarée au registre",
  "E4 juge LA LIGNE du hachage, pas le flot : une normalisation faite à la ligne d'avant, ou dans une fonction auxiliaire, n'est pas vue. C'est le prix ASSUMÉ de la précision — le premier jet testait le fichier entier et rendait 3 faux positifs sur 6, dont le site du défaut FONDATEUR de la classe, qui l'avait corrigé avant tout le monde. Le remède est d'employer la fonction partagée, ou de laisser la marque de normalisation sur la ligne",
  "E4 ne juge une ligne que si elle LIT un fichier en BRUT (`readFileSync`, `read_bytes`, `open(…,\"rb\")`). En Python, `read_text()` fait la traduction universelle des fins de ligne À LA LECTURE : la normalisation y est faite par le langage, et l\'exiger en plus serait accuser du code juste",
  "E4 accepte un hachage brut DÉCLARÉ À L'USAGE par le marqueur `empreinte-brute-ok` sur sa ligne : marque de LIGNE et non exclusion par nom de fichier, elle ne couvre que la ligne où quelqu'un a réfléchi, jamais une faute future du même fichier. Ce qui n'est PAS jugé, c'est la JUSTESSE de la raison invoquée — elle se lit à la revue",
  "E4 ne voit pas hacher une chaîne construite EN MÉMOIRE (état git, clé de cache, identifiant de trace) : il n\'y a pas de fin de ligne à normaliser, et ces usages sont déjà déclarés hors format au registre",
];

const REGISTRE = join(PILOT, "references", "EMPREINTES.md");
// TF-0615 : un site qui DÉLÈGUE à la fonction partagée est toujours un site de scellement, et
// E1 le voyait comme mort. Constaté en centralisant : sept sites déclarés ont disparu du
// balayage d'un coup, parce qu'ils avaient cessé d'écrire `createHash` — c'est-à-dire parce
// qu'ils venaient d'être CORRIGÉS. Un contrôle qui accuse une correction est pire qu'absent.
const MOTIF_HACHAGE = /createHash\(\s*["']sha256["']\s*\)|hashlib\.sha256\(|empreinte(?:Fichier|Texte|Binaire)\s*\(/;
// Les emplacements lus. La liste a été CORRIGÉE par le premier passage sur le parc : elle oubliait
// `skills/` — forge-design y range ses scripts et n'emploie pas `.claude/skills/` — et la RACINE
// d'un dépôt, où vit `bootstrap.mjs`. Un balayage trop étroit ne rate pas seulement des sites : il
// ACCUSE le registre d'être périmé sur des sites parfaitement vivants, ce qui est pire.
const DOSSIERS_LUS = ["scripts", "oracles", "tools", "todo", "skills"];
const EXT = /\.(mjs|cjs|js|py)$/i;
const IGNORES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build", "generated", "fixtures", "tests", "test"]);

/** Fichiers de code d'un dossier, profondeur bornée (3 niveaux : un skill vit à `.claude/skills/<nom>/scripts/`). */
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

const sortir = (verdict, code) => {
  console.log(JSON.stringify({
    oracle: "oracle-empreintes", version: "1.0.0", racine: String(racine),
    verdict, findings: F, non_juge: NON_JUGE,
  }, null, jsonOnly ? 0 : 1));
  process.exit(code);
};

// ---- recette interne : les DEUX SENS de E3, sur des empreintes fabriquées --------------------
// E1 et E2 se jouent sur le parc réel (I4 de la recette du pilot) : ils n'ont pas de fixture, leur
// matière EST le parc. E3, lui, juge un artefact — donc il se prouve dans les deux sens, ici, sans
// dépendre d'aucun dépôt.
if (args.includes("--self-test")) {
  const { mkdtempSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const base = mkdtempSync(join(tmpdir(), "empreintes-"));
  const HACHE = "a".repeat(64);
  let pass = 0; const echecs = [];
  const jouer = (nom, contenu) => {
    const f = join(base, nom);
    writeFileSync(f, typeof contenu === "string" ? contenu : JSON.stringify(contenu), "utf8");
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--verifier", f, "--json"],
      { encoding: "utf8" });
    try { return JSON.parse(r.stdout.trim()); } catch { return { verdict: "ILLISIBLE" }; }
  };
  const attendre = (quoi, attendu, rapport, motif = null) => {
    const okVerdict = rapport.verdict === attendu;
    const okMotif = !motif || (rapport.findings || []).some((f) => motif.test(f.message || ""));
    if (okVerdict && okMotif) { pass++; console.log(`  [OK  ] ${quoi}`); }
    else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi} — verdict ${rapport.verdict}` +
      (okMotif ? "" : ` ; motif attendu ${motif} absent`)); }
  };

  console.log("Recette d'oracle-empreintes — les deux sens de E3\n");
  attendre("une empreinte complète au format @1 → PASS", "PASS",
    jouer("vert.json", { format: "forge-ops/empreinte@1", release: "v1.2.0",
      ts: "2026-08-23T09:00:00.000Z", fichiers: { "app/main.mjs": HACHE } }),
    /complète : release/);
  attendre("un FORMAT étranger est refusé, et le message dit lequel a été lu", "FAIL",
    jouer("format.json", { format: "maison/empreinte@3", release: "v1", ts: "2026-08-23T09:00:00.000Z",
      fichiers: { "a.mjs": HACHE } }),
    /maison\/empreinte@3/);
  attendre("sans `release`, l'empreinte est ORPHELINE et ne prouve rien", "FAIL",
    jouer("release.json", { format: "forge-ops/empreinte@1", ts: "2026-08-23T09:00:00.000Z",
      fichiers: { "a.mjs": HACHE } }),
    /orpheline/);
  attendre("sans horodatage lisible, deux scellements ne se distinguent plus", "FAIL",
    jouer("ts.json", { format: "forge-ops/empreinte@1", release: "v1", ts: "hier",
      fichiers: { "a.mjs": HACHE } }),
    /ne se distinguent plus/);
  attendre("`fichiers` vide : un haché global dit qu'il y a une différence, jamais laquelle", "FAIL",
    jouer("vide.json", { format: "forge-ops/empreinte@1", release: "v1",
      ts: "2026-08-23T09:00:00.000Z", fichiers: {} }),
    /jamais laquelle/);
  attendre("un haché tronqué n'est pas un sha256 — et le champ fautif est NOMMÉ", "FAIL",
    jouer("court.json", { format: "forge-ops/empreinte@1", release: "v1",
      ts: "2026-08-23T09:00:00.000Z", fichiers: { "app/main.mjs": "abc123" } }),
    /app\/main\.mjs/);
  attendre("un JSON invalide est refusé, jamais ignoré", "FAIL", jouer("casse.json", "{ceci n'est pas"),
    /illisible/);

  rmSync(base, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  console.log(`\nRecette empreintes : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

// ---- E3 · une empreinte au format @1 se relit -------------------------------------------------
if (aVerifier) {
  if (!existsSync(aVerifier)) {
    ko("E3", aVerifier, "empreinte introuvable — un scellement dont le fichier n'existe pas ne prouve rien");
    sortir("FAIL", 1);
  }
  let e = null;
  try { e = JSON.parse(readFileSync(aVerifier, "utf8")); }
  catch { ko("E3", aVerifier, "empreinte illisible (JSON invalide)"); sortir("FAIL", 1); }
  const manques = [];
  if (e.format !== "forge-ops/empreinte@1") manques.push(`format attendu « forge-ops/empreinte@1 », lu « ${e.format} » — un lecteur qui rencontre une autre version doit savoir qu'il ne sait pas lire`);
  if (!e.release) manques.push("`release` absent : une empreinte orpheline ne dit pas CE QU'ELLE scelle");
  if (!e.ts || Number.isNaN(Date.parse(e.ts))) manques.push("`ts` absent ou illisible : deux scellements du même contenu ne se distinguent plus");
  const f = e.fichiers && typeof e.fichiers === "object" ? Object.entries(e.fichiers) : [];
  if (!f.length) manques.push("`fichiers` vide : un haché global dit qu'il y a une différence, jamais laquelle");
  const mauvais = f.filter(([, h]) => !/^[0-9a-f]{64}$/i.test(String(h)));
  if (mauvais.length) manques.push(`${mauvais.length} haché(s) hors format sha256 hexadécimal (ex. ${mauvais[0][0]})`);
  if (manques.length) ko("E3", aVerifier, `empreinte incomplète — ${manques.join(" ; ")}`);
  else ok("E3", aVerifier, `empreinte ${e.format} complète : release « ${e.release} », ${f.length} fichier(s) hachés, scellée le ${e.ts}`);
  sortir(manques.length ? "FAIL" : "PASS", manques.length ? 1 : 0);
}

// ---- lecture du registre --------------------------------------------------------------------
if (!existsSync(REGISTRE)) {
  ko("E0", "references/EMPREINTES.md", "registre des empreintes absent — la convention n'existe que si elle est écrite quelque part (TF-0474)");
  sortir("FAIL", 1);
}
const registre = readFileSync(REGISTRE, "utf8");
// Les chemins déclarés vivent dans les cellules de la table, entre accents graves.
const declares = new Set();
for (const ligne of registre.split(/\r?\n/)) {
  if (!/^\s*\|/.test(ligne)) continue;
  for (const m of ligne.matchAll(/`([^`]+\.(?:mjs|cjs|js|py))`/g)) declares.add(basename(m[1]));
}
if (!declares.size) {
  ko("E0", "references/EMPREINTES.md", "aucun site déclaré dans le registre — une table vide n'est pas une convention");
  sortir("FAIL", 1);
}

// ---- balayage du parc ----------------------------------------------------------------------
const depots = existsSync(racine)
  ? readdirSync(racine, { withFileTypes: true })
      .filter((e) => e.isDirectory() && /^digit-ai/.test(e.name)
        // L'EXCLUSION NOMMÉE « digit-ai-forge-seo » A DISPARU D'ICI LE 23/08, ET C'EST LA LEÇON
        // (TF-0533) : ce dépôt était un CLONE PÉRIMÉ du dépôt renommé en forge-seo-geo, et il
        // avait été contourné ICI, nommément, plutôt que traité à la racine. Un contournement
        // local règle un symptôme et laisse le doublon fausser toutes les autres mesures du parc
        // — celle des promesses annonçait « 16 dépôts » pour 15. Le dossier est désormais sorti
        // du balayage par son nom (`_archive-…`, hors du motif `^digit-ai`) et bootstrap DÉCLARE
        // tout clone d'avant un renommage. Une exclusion nommée est le signe qu'une cause n'a
        // pas été traitée : elle vaut d'être relue à chaque fois qu'on en écrit une.
        // PLUS AUCUNE EXCLUSION NOMMÉE (27/08). Le motif portait le nom d'un client, et un nom
        // de client dans un oracle publié est une fuite : il a été remplacé par la CONVENTION
        // qu'il encodait. Un dépôt `digit-ai…` portant un SUFFIXE `_<engagement>` est un espace
        // d'engagement CLIENT — privé, hors bootstrap, porteur de livrables et non d'outillage.
        // Ce n'est pas une forge : le balayer rendrait des constats sur des artefacts remis, que
        // personne ne peut plus corriger. Aucune forge du parc ne porte de `_` : le motif est
        // donc exact, et il couvre tout engagement futur sans qu'on ait à l'écrire ici.
        // Les alternatives `_old$`, `_vide$` et `.bundle$` ont été RETIRÉES le 23/08 : plus aucun
        // répertoire du parc ne les portait, et une alternative sans cible est une règle morte
        // qui donne l'illusion d'une protection. La convention qui les remplace est le PRÉFIXE
        // `_archive-` (voir references/CONVENTION-DEPOTS-MIS-DE-COTE.md) : un dépôt mis de côté
        // sort du motif `^digit-ai` par son NOM, une fois, au lieu d'être exclu dans chaque oracle.
        && !/_/.test(e.name))
      .map((e) => e.name)
  : [];
if (!depots.length) {
  so("E1", String(racine), "aucun dépôt du parc trouvé sous cette racine — rien à balayer");
  sortir("SKIP", 2);
}

const trouves = new Map();   // nom de fichier -> chemins relatifs
for (const depot of depots) {
  const base = join(racine, depot);
  const cibles = [...DOSSIERS_LUS.map((d) => join(base, d)), join(base, ".claude", "skills")];
  // La RACINE du dépôt, sans descendre : `bootstrap.mjs` et quelques outils y vivent. Oubli du
  // premier jet, et il ne se contentait pas de rater des sites — il ACCUSAIT le registre d'être
  // périmé sur deux sites parfaitement vivants.
  let aLaRacine = [];
  try {
    aLaRacine = readdirSync(base, { withFileTypes: true })
      .filter((e) => e.isFile() && EXT.test(e.name)).map((e) => join(base, e.name));
  } catch { /* dépôt illisible : les dossiers connus restent balayés */ }
  for (const dossier of [...cibles, null]) {
    for (const f of dossier === null ? aLaRacine : fichiers(dossier)) {
      let texte = "";
      try { texte = readFileSync(f, "utf8"); } catch { continue; }
      if (!MOTIF_HACHAGE.test(texte)) continue;
      const nom = basename(f);
      const liste = trouves.get(nom) || [];
      liste.push(`${depot}/${relative(base, f).replaceAll("\\", "/")}`);
      trouves.set(nom, liste);
    }
  }
}

// E1 · un site déclaré qui ne hache plus (ou n'existe plus) laisse croire à une couverture.
const morts = [...declares].filter((nom) => !trouves.has(nom));
if (morts.length) {
  ko("E1", "references/EMPREINTES.md", `${morts.length} site(s) DÉCLARÉ(s) qui ne hachent plus ou n'existent plus : ` +
    `${morts.join(", ")}. Un registre qui garde un site mort donne une fausse impression de couverture — ` +
    "retirer la ligne, ou dire ce qui a remplacé le mécanisme");
} else {
  ok("E1", "references/EMPREINTES.md", `${declares.size} site(s) déclaré(s), tous présents et hachant encore`);
}

// E2 · LA RÈGLE QUI FAIT TENIR LA CONVENTION : aucun site non déclaré.
const inconnus = [...trouves.entries()].filter(([nom]) => !declares.has(nom));
if (inconnus.length) {
  ko("E2", `${racine}`, `${inconnus.length} site(s) de scellement NON DÉCLARÉ(s) : ` +
    inconnus.map(([nom, ou]) => `${nom} (${ou[0]}${ou.length > 1 ? ` +${ou.length - 1}` : ""})`).join(", ") +
    `. Chacun doit rejoindre la table de references\\EMPREINTES.md — avec ce qu'il scelle et son format. ` +
    "C'est la seule chose qui empêche le sixième mécanisme de naître comme les cinq premiers : " +
    "sept items du registre relèvent déjà de cette classe, dont deux redécouvertes strictes du même défaut");
} else {
  ok("E2", `${racine}`, `${trouves.size} site(s) de scellement trouvé(s) dans ${depots.length} dépôt(s), ` +
    "tous déclarés au registre");
}

// E4 · UN SITE DÉCLARÉ PEUT ÊTRE MAL ÉCRIT, et E1/E2 ne le voient pas. Ils tiennent la LISTE des
// sites ; ils ne regardent jamais COMMENT chacun hache. Payé le 25/08 : `todo\generer-vue.mjs`,
// `todo\generer-page.mjs` et `todo\generer-archive.mjs` étaient tous trois à la table, tous trois
// hachaient `readFileSync` sans normaliser, et produisaient donc un sceau différent selon que le
// checkout du poste est en CRLF ou en LF — onze fichiers générés qui rebasculent à chaque
// aller-retour entre deux sessions, et un sceau qui ne prouve plus rien.
//
// CE QUI EST JUGÉ : un fichier qui hache ET qui lit un fichier doit porter, près de son hachage,
// soit l'emploi de la fonction partagée, soit une normalisation visible. La lecture est
// TEXTUELLE et sa limite est au `non_juge` — mieux vaut manquer un cas tordu que crier sur du
// code sain, puisqu'un contrôle bruyant se fait contourner au lieu de se corriger (R-33 bis).
// CE QUI EST JUGE, ET LE RESSERRAGE QUI A ETE NECESSAIRE DES LE PREMIER USAGE REEL. Le premier
// jet testait la presence des deux motifs DANS LE FICHIER — un hachage quelque part, une lecture
// de fichier quelque part — sans verifier qu'ils se PARLENT. Joue sur le parc, il a rendu SIX
// constats dont TROIS FAUX, soit une precision de 50 % :
//
//   · `forge-seo-geo/scripts/grille.py` normalise deja, et le DIT en citant TF-0072 — mais sous la
//     forme Python `read_bytes().replace(b"\r\n", b"\n")`, que le motif ne connaissait pas ;
//   · `forge-seo-geo/scripts/gabarits.py` hache une CHAINE lue par `read_text()`. En Python, le
//     mode texte fait la traduction universelle des fins de ligne A LA LECTURE : `\r\n` y devient
//     `\n` sans que personne l'ecrive. La normalisation est donc faite, par le langage ;
//   · `forge-conception/oracles/self-test.mjs` hache une variable qui s'appelle `contenuLF` et qui
//     est LF par construction — la lecture de fichier du meme fichier appartient a une fixture qui
//     n'a rien a voir.
//
// Une regle a 50 % de precision n'est pas un controle, c'est une nuisance qui s'apprend a etre
// ignoree — et celle-ci aurait ete ignoree en accusant `grille.py`, c'est-a-dire le site du defaut
// FONDATEUR de la classe, qui l'avait corrige avant tout le monde. Le test porte donc desormais
// sur LA LIGNE DU HACHAGE : ce qui est passe a `update(...)` ou a `sha256(...)`. La limite est
// ecrite au `non_juge` — une normalisation faite a la ligne d'avant n'est pas vue, et c'est le
// prix assume de la precision.
const LIGNE_HACHE = /createHash\s*\(\s*["']sha256["']\s*\)\s*\.update\s*\(|hashlib\.sha256\s*\(/;
// Une lecture de fichier BRUTE, sur la ligne meme du hachage. `read_text()` de Python n'y est PAS :
// le mode texte normalise les fins de ligne a la lecture, c'est le langage qui fait le travail.
const LECTURE_BRUTE = /readFileSync\s*\(|\.read_bytes\s*\(|open\s*\([^)]*["']rb["'][^)]*\)/;
// La normalisation, sous toutes les formes rencontrees dans le parc — JavaScript et Python.
const NORMALISE = /lib-empreinte|empreinteFichier|empreinteTexte|normaliserLignes|split\(\s*["']\\r\\n["']\s*\)|replace\(\s*\/\\r\\n\/g|replace\(\s*["']\\r\\n["']|replace\(\s*b["']\\r\\n["']/;

// Les usages qui n'ont AUCUNE fin de ligne a normaliser, NOMMES plutot que devines : ils hachent
// des octets binaires par nature, ou une chaine construite en memoire. Ce ne sont pas des
// exclusions de complaisance — chacun est deja declare hors format au registre des empreintes.
const HORS_SUJET_E4 = new Set([
  "hook-produits-intacts.mjs",   // hache la sortie de `git status --porcelain`, pas un fichier
  "verifier-jugement.mjs",       // sceau de jugement : sha par livrable, format `pilot/jugement@1`
  "bootstrap.mjs",               // compare un skill versionne a sa copie installee, octet a octet
  "run-oracles.mjs",             // cle de cache interne, declaree hors format au registre
  "otlp-project.mjs",            // identifiant de trace, declare hors format
  "check_html.py",               // empreinte du JEU DE REGLES, pas d'un contenu
]);
const malEcrits = [];
for (const [nom, ou] of trouves.entries()) {
  if (HORS_SUJET_E4.has(nom)) continue;
  for (const chemin of ou) {
    const abs = join(racine, chemin);
    let texte = "";
    try { texte = readFileSync(abs, "utf8"); } catch { continue; }
    // Un hachage VOLONTAIREMENT brut se déclare À L'USAGE, sur sa ligne, avec sa raison — même
    // idiome que le `piege-ok` d'`oracle-pieges-regex`. C'est l'inverse d'une exclusion par NOM de
    // fichier : celle-ci aveuglerait le contrôle sur tout le fichier, y compris sur une faute
    // future, là où une marque de ligne ne couvre que la ligne où quelqu'un a réfléchi.
    const fautives = texte.split(/\r?\n/)
      .map((l, i) => ({ n: i + 1, l }))
      .filter(({ l }) => LIGNE_HACHE.test(l) && LECTURE_BRUTE.test(l)
        && !NORMALISE.test(l) && !/empreinte-brute-ok/.test(l));
    for (const { n } of fautives) malEcrits.push(`${chemin}:${n}`);
  }
}
// LA PORTÉE D'E4 EST BORNÉE AU PILOT, et le motif est écrit plutôt que subi. La fonction partagée
// vit chez le pilot : une forge ne peut l'adopter qu'une fois le pilot publié, et chacun de ses
// sites demande son propre jugement — un scelleur de RELEASE hache peut-être des binaires à bon
// droit, et normaliser les siens casserait sa vérification de déploiement. Les sites des autres
// forges sont donc NOMMÉS sans bloquer, pas exclus : une exclusion nommée signale une cause non
// traitée (règle N-13), un signal nommé ouvre un travail. Ils sont instruits au registre.
const estDuPilot = (chemin) => chemin.startsWith("digit-ai-factory/");
const aInstruire = malEcrits.filter((c) => !estDuPilot(c));
const aCorriger = malEcrits.filter(estDuPilot);
if (aInstruire.length) {
  so("E4", `${racine}`, `${aInstruire.length} site(s) d'AUTRES FORGES hachent un fichier sans normaliser, ` +
    `nommés et non bloqués : ${aInstruire.join(", ")}. La fonction partagée vit chez le pilot — une ` +
    "forge ne l'adopte qu'après publication, et chaque site demande son jugement : un scelleur de " +
    "release hache peut-être des binaires à bon droit. Instruits au registre plutôt qu'exclus par leur nom");
}
if (aCorriger.length) {
  ko("E4", `${racine}`, `${aCorriger.length} site(s) DU PILOT qui hachent le contenu d'un FICHIER sans normaliser ` +
    `les fins de ligne : ${aCorriger.join(", ")}. Avec core.autocrlf, git repose un fichier en CRLF ` +
    "sur un poste et en LF sur un autre SANS qu'un octet de contenu ait bougé : le sceau diffère " +
    "alors pour un contenu identique, et il cesse de prouver quoi que ce soit. Employer " +
    "`scripts\\lib-empreinte.mjs` (`empreinteFichier`, `empreinteTexte`) — la classe a été payée " +
    "CINQ fois (TF-0072, TF-0253, TF-0359, TF-0474, TF-0615), et la cinquième parce que les quatre " +
    "premières avaient produit un registre et un contrôle, mais pas de fonction");
} else {
  ok("E4", `${racine}`, "tous les sites DU PILOT qui hachent un fichier normalisent leurs fins de ligne " +
    `(${HORS_SUJET_E4.size} usages sans fin de ligne à normaliser, déclarés ; ` +
    `${aInstruire.length} site(s) d'autres forges nommés au constat SANS_OBJET ci-dessus)`);
}

const echecs = F.filter((f) => f.statut === "FAIL").length;
sortir(echecs ? "FAIL" : "PASS", echecs ? 1 : 0);
