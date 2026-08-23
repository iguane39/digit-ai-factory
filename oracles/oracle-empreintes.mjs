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
 *      horodatage lisible, et au moins un fichier haché en sha256 hexadécimal.
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
];

const REGISTRE = join(PILOT, "references", "EMPREINTES.md");
const MOTIF_HACHAGE = /createHash\(\s*["']sha256["']\s*\)|hashlib\.sha256\(/;
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
        && !/_old$|_vide$|\.bundle$|_client-a$/.test(e.name))
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

const echecs = F.filter((f) => f.statut === "FAIL").length;
sortir(echecs ? "FAIL" : "PASS", echecs ? 1 : 0);
