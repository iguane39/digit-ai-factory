#!/usr/bin/env node
/**
 * oracle-modeles-tiers.mjs — UN IDENTIFIANT DE MODÈLE TIERS SE CROISE AVEC LE CALENDRIER DE SON
 * FOURNISSEUR, IL NE SE RECOPIE PAS DE MÉMOIRE (loi n° 4 de la Factory ; TF-2109, décision humaine
 * « A2 » du 03/11/2026, posée par la synthèse 20261103n).
 *
 * ============================================================================================
 * LE FAIT
 * ============================================================================================
 *
 * L'étude du 03/11/2026 (« Compétences OpenAI et Gemini », ligne C2) a croisé à la main les pages de
 * dépréciation des deux fournisseurs avec le parc : un produit épingle un instantané d'OpenAI qui
 * s'arrête le 14/01/2027, et un script de la forge de design garde en repli deux modèles d'image de
 * Google arrêtés depuis le 25/06/2026. Rien ne le disait avant : le calendrier vivait dans deux pages
 * externes, le parc dans des fichiers de configuration, et aucun contrôle ne les rapprochait.
 * `references/MODELES-TIERS.json` porte le calendrier daté et sourcé ; cet oracle le croise avec
 * les identifiants écrits dans les dépôts.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ
 * ============================================================================================
 *
 *   MT0 · le référentiel est lisible et bien formé : schéma connu, date, fournisseurs, et pour chaque
 *         entrée un identifiant, un état connu, une citation de la page, des dates en AAAA-MM-JJ ;
 *         un modèle `arrete` porte sa date d'arrêt et cette date n'est pas future. FAIL si mal formé
 *         (un oracle qui croiserait des données illisibles rendrait un vert sans objet). Un modèle
 *         `deprecie` dont la date d'arrêt est passée se lit comme arrêté et se signale (AVERT).
 *         Ajout à la lettre de la consigne, qui ne nomme que MT1 à MT4.
 *   MT1 · BLOQUANT : un identifiant `arrete` est cité dans un fichier de code ou de configuration
 *         d'un dépôt du parc. Un appel qui vise un modèle éteint échoue à l'exécution.
 *   MT2 · AVERTISSANT : un identifiant `deprecie` dont l'arrêt tombe dans moins de 90 jours (strictement
 *         après la date du jour, strictement avant le 90e jour) est cité dans un fichier de code ou de
 *         configuration. Le délai de migration se compte, pas se devine.
 *   MT3 · INFORMATIF : un identifiant `deprecie` sans date d'arrêt est cité dans un fichier de code ou
 *         de configuration. Rien n'est daté, mais le fournisseur a nommé un remplaçant.
 *   MT4 · AVERTISSANT : le référentiel, ou la lecture de la page d'un fournisseur, date de plus de
 *         30 jours. Un calendrier périmé rend un vert qui ne vaut plus.
 *
 * Les fichiers de fixtures et de tests sont comptés à part, jamais en MT1 : ils écrivent un défaut à
 * dessein. Les fichiers documentaires (Markdown, texte, registres .jsonl, HTML) sont comptés à part
 * aussi : citer un modèle arrêté pour en parler n'est pas l'appeler. Un `deprecie` dont l'arrêt est
 * au-delà de 90 jours n'a pas de règle : il est compté (`compte.deprecies_arret_lointain`) et listé
 * en JSON (`hors_fenetre`), jamais tu.
 *
 * ============================================================================================
 * COMMENT LA RECHERCHE SE FAIT, ET CE QU'ELLE VAUT
 * ============================================================================================
 *
 * Les dépôts se trouvent par leur `.git` (dossier ou fichier de worktree), jusqu'à 4 niveaux sous la
 * racine, hors `node_modules`, sans descendre dans un dépôt trouvé. Dans chacun, UN `git grep -F -l -f`
 * liste les fichiers SUIVIS qui portent la racine d'un identifiant `deprecie` ou `arrete` (`gpt-`,
 * `gemini-`…), puis chaque fichier retenu se lit ligne à ligne. Écart assumé à la consigne, qui disait
 * « git grep -F de chaque identifiant » : un motif par identifiant coûtait 59 s sur le seul pilot et
 * plus d'une minute par dépôt volumineux, parce que git relit chaque ligne une fois par motif ; la
 * racine est un préfixe, donc un sur-ensemble, et la lecture rend l'exactitude. Les fichiers
 * d'environnement réels (`.env`, `.env.local`, `.env.production`…) sont exclus de la lecture par
 * pathspec, `.env.example` reste lu. Chaque ligne trouvée est revérifiée : l'identifiant doit être
 * entier, ni précédé ni suivi d'un caractère d'identifiant (`gpt-4o` ne se lit pas dans `gpt-4o-mini`,
 * `x-5` pas dans `x-5.6`), et un identifiant d'un seul mot (`o3`, `ada`) n'est retenu que s'il est
 * entre guillemets. Un fichier de plus de 64 Mo n'est pas lu et se signale (AVERT). Le contenu des
 * lignes n'est jamais rendu, seulement chemin et numéro.
 *
 * Une recherche ne vaut que pour l'identifiant exact : `non_juge` le dit.
 *
 * Usage : node oracles/oracle-modeles-tiers.mjs [--racine <dossier>] [--referentiel <fichier>]
 *           [--date AAAA-MM-JJ] [--json]
 *   --racine       défaut : le parent du pilot ($FORGE_ROOT si posé)
 *   --referentiel  défaut : references/MODELES-TIERS.json
 *   --date         date du jour pour le calcul des délais (défaut : aujourd'hui) ; sert aux recettes
 * Sortie : exit 0 PASS · 1 FAIL · 2 SKIP (rien à mesurer : aucun dépôt sous la racine) ou erreur d'usage.
 * Recette à double sens : oracles/oracle-modeles-tiers.test.mjs (fixtures sous oracles/fixtures/modeles-tiers/).
 */
import { readFileSync, readdirSync, existsSync, mkdtempSync, writeFileSync, rmSync, statSync } from "node:fs";
import { join, dirname, resolve, relative, sep } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
export const NOM = "oracle-modeles-tiers";
export const VERSION = "1.0.0";
export const SCHEMA = "pilot/modeles-tiers@1";
export const REF_DEFAUT = join(ICI, "..", "references", "MODELES-TIERS.json");
export const FENETRE_MT2_JOURS = 90;
export const AGE_MT4_JOURS = 30;
export const PROFONDEUR = 4;
const ETATS = ["courant", "deprecie", "arrete"];
const ETATS_BIBLIOTHEQUE = ["courante", "depreciee"];
const RE_ISO = /^\d{4}-\d{2}-\d{2}$/;

export const NON_JUGE = [
  "les identifiants que le calendrier du fournisseur ne liste pas : un alias sans date (un nom court qui pointe vers un instantané), un modèle que la page omet, une famille entière non recopiée au référentiel. Seul l'identifiant exact écrit dans le référentiel est cherché",
  "les identifiants construits à l'exécution (concaténation, variable d'environnement, valeur lue en base ou en ligne de commande) : un appelant qui compose le nom du modèle échappe à toute recherche de texte",
  "la casse et l'orthographe : la recherche est exacte, `GPT-4o` n'est pas `gpt-4o`",
  "l'usage réel d'une occurrence : une citation dans un commentaire, un message d'erreur ou une liste de refus compte comme une occurrence en code ou en configuration. Seule la nature du fichier (extension) les sépare du documentaire",
  "les fichiers non suivis par git, les fichiers d'environnement réels (.env, .env.local, .env.production…, exclus de la lecture), les dépôts à plus de 4 niveaux sous la racine et ceux imbriqués dans un autre dépôt",
  "l'effet d'un arrêt : certains identifiants déprécient sans s'arrêter (redirection automatique vers le remplaçant, mentionnée en note du référentiel) ; l'oracle date, il ne mesure pas le comportement du fournisseur",
  "l'exactitude de la page du fournisseur et la complétude du référentiel : il reflète la page relue à sa date, pas la liste réelle des modèles servis",
  "les bibliothèques officielles et leurs versions : données du référentiel, non confrontées aux manifestes (package.json, requirements) du parc",
];

// ---- classement des fichiers ---------------------------------------------------------------------
const EXT_CODE = new Set(["mjs", "cjs", "js", "jsx", "ts", "tsx", "py", "sh", "ps1", "bat", "cmd", "json", "jsonc", "yaml", "yml", "toml", "ini", "cfg", "conf", "properties", "env"]);
const RE_MOT_TEST = /(?:^|[._-])(?:test|tests|spec|specs|e2e|fixture|fixtures|mock|mocks)(?:[._-]|$)/i;

/** « tests » (fixture ou recette), « code » (code ou configuration) ou « doc » (le reste). */
export function classerFichier(chemin) {
  const segments = chemin.split(/[\\/]/);
  const base = segments[segments.length - 1];
  if (segments.slice(0, -1).some((s) => RE_MOT_TEST.test(s) || /^__(?:tests|fixtures|mocks)__$/.test(s)) || RE_MOT_TEST.test(base)) return "tests";
  const ext = /\.([A-Za-z0-9]+)$/.exec(base);
  if (/^\.env(?:\.|$)/.test(base) || /^Dockerfile/.test(base)) return "code";
  if (ext && EXT_CODE.has(ext[1].toLowerCase())) return "code";
  return "doc";
}

// ---- jours -----------------------------------------------------------------------------------------
const estIso = (s) => typeof s === "string" && RE_ISO.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && new Date(`${s}T00:00:00Z`).toISOString().slice(0, 10) === s;
/** Nombre de jours entiers de a à b (b - a), dates AAAA-MM-JJ. */
export function joursEntre(a, b) { return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000); }
const aujourdhui = () => new Date().toISOString().slice(0, 10);

// ---- le référentiel ----------------------------------------------------------------------------
/**
 * MT0 : forme du référentiel. Rend { defauts, avertissements, entrees } ; `entrees` est la liste à
 * chercher : [{ fournisseur, id, genre: "modele"|"api", etat: "deprecie"|"arrete", arret, remplacant, note }],
 * l'état étant l'état EFFECTIF au jour donné (une date d'arrêt atteinte vaut arrêté).
 */
export function lireReferentiel(ref, date) {
  const defauts = [];
  const avertissements = [];
  const entrees = [];
  const jour = (v) => (v === null || v === undefined || estIso(v));
  if (!ref || typeof ref !== "object" || Array.isArray(ref)) return { defauts: ["référentiel illisible ou absent"], avertissements, entrees };
  if (ref.schema !== SCHEMA) defauts.push(`schéma « ${ref.schema} » au lieu de « ${SCHEMA} »`);
  if (!estIso(ref.date)) defauts.push("date absente ou hors de la forme AAAA-MM-JJ");
  else if (ref.date > date) defauts.push(`date du référentiel (${ref.date}) postérieure au jour du contrôle (${date})`);
  const fournisseurs = ref.fournisseurs && typeof ref.fournisseurs === "object" ? Object.entries(ref.fournisseurs) : [];
  if (!fournisseurs.length) defauts.push("aucun fournisseur");
  const vus = new Set();
  for (const [nom, f] of fournisseurs) {
    if (!f || typeof f !== "object") { defauts.push(`${nom} : fournisseur illisible`); continue; }
    if (!f.calendrier || typeof f.calendrier !== "string") defauts.push(`${nom} : adresse du calendrier absente`);
    if (!f.documentation || typeof f.documentation !== "string") defauts.push(`${nom} : adresse de la documentation absente`);
    if (!estIso(f.lu_le)) defauts.push(`${nom} : lu_le absent ou hors de la forme AAAA-MM-JJ`);
    if (!Array.isArray(f.modeles)) { defauts.push(`${nom} : liste de modèles absente`); continue; }
    f.modeles.forEach((m, i) => {
      const ou = `${nom}.modeles[${i}]${m && m.id ? ` « ${m.id} »` : ""}`;
      if (!m || typeof m.id !== "string" || !m.id.trim()) { defauts.push(`${ou} : identifiant absent`); return; }
      if (vus.has(`${nom}/${m.id}`)) defauts.push(`${ou} : identifiant en double chez ${nom}`);
      vus.add(`${nom}/${m.id}`);
      if (!ETATS.includes(m.etat)) { defauts.push(`${ou} : état « ${m.etat} » hors de ${ETATS.join(", ")}`); return; }
      if (typeof m.famille !== "string" || !m.famille.trim()) defauts.push(`${ou} : famille absente`);
      if (typeof m.citation !== "string" || !m.citation.trim()) defauts.push(`${ou} : citation de la page absente`);
      if (!jour(m.depreciation)) defauts.push(`${ou} : depreciation « ${m.depreciation} » hors de la forme AAAA-MM-JJ`);
      if (!jour(m.arret)) { defauts.push(`${ou} : arret « ${m.arret} » hors de la forme AAAA-MM-JJ`); return; }
      const arret = m.arret || null;
      if (m.etat === "arrete" && !arret) { defauts.push(`${ou} : modèle arrêté sans date d'arrêt`); return; }
      if (m.etat === "arrete" && arret > date) { defauts.push(`${ou} : déclaré arrêté, mais la date d'arrêt ${arret} est postérieure au ${date}`); return; }
      if (m.etat === "courant" && arret) defauts.push(`${ou} : modèle courant portant une date d'arrêt`);
      if (m.etat === "courant") return;
      let etat = m.etat;
      if (etat === "deprecie" && arret && arret <= date) {
        etat = "arrete";
        avertissements.push(`${ou} : déclaré déprécié, mais l'arrêt du ${arret} est atteint au ${date} ; lu comme arrêté, état à mettre à jour`);
      }
      entrees.push({ fournisseur: nom, id: m.id, genre: "modele", etat, arret, remplacant: m.remplacant || null, note: m.note || null });
    });
    if (f.api !== undefined && !Array.isArray(f.api)) defauts.push(`${nom} : api n'est pas une liste`);
    (Array.isArray(f.api) ? f.api : []).forEach((a, i) => {
      const ou = `${nom}.api[${i}]${a && a.id ? ` « ${a.id} »` : ""}`;
      if (!a || typeof a.id !== "string" || !a.id.trim()) { defauts.push(`${ou} : identifiant absent`); return; }
      if (!ETATS.includes(a.etat)) { defauts.push(`${ou} : état « ${a.etat} » hors de ${ETATS.join(", ")}`); return; }
      if (typeof a.citation !== "string" || !a.citation.trim()) defauts.push(`${ou} : citation de la page absente`);
      if (!jour(a.arret)) { defauts.push(`${ou} : arret « ${a.arret} » hors de la forme AAAA-MM-JJ`); return; }
      if (a.etat === "arrete" && !a.arret) { defauts.push(`${ou} : arrêté sans date d'arrêt`); return; }
      if (a.etat === "arrete" && a.arret > date) { defauts.push(`${ou} : déclaré arrêté, mais la date d'arrêt ${a.arret} est postérieure au ${date}`); return; }
      if (a.litteraux !== undefined && !Array.isArray(a.litteraux)) { defauts.push(`${ou} : litteraux n'est pas une liste`); return; }
      if (a.etat === "courant") return;
      const etat = a.etat === "deprecie" && a.arret && a.arret <= date ? "arrete" : a.etat;
      for (const lit of a.litteraux || []) if (typeof lit === "string" && lit.trim()) entrees.push({ fournisseur: nom, id: lit, genre: "api", etat, arret: a.arret || null, remplacant: a.remplacant || null, note: a.id });
    });
    if (f.bibliotheques !== undefined) {
      if (!Array.isArray(f.bibliotheques)) defauts.push(`${nom} : bibliotheques n'est pas une liste`);
      else f.bibliotheques.forEach((b, i) => {
        if (!b || typeof b.paquet !== "string" || !b.paquet.trim() || !ETATS_BIBLIOTHEQUE.includes(b.etat)) defauts.push(`${nom}.bibliotheques[${i}] : paquet absent ou état hors de ${ETATS_BIBLIOTHEQUE.join(", ")}`);
      });
    }
  }
  return { defauts, avertissements, entrees };
}

// ---- les dépôts ------------------------------------------------------------------------------------
/** Dépôts git sous la racine : `.git` (dossier ou fichier) jusqu'à `profondeur` niveaux, sans descendre dans un dépôt. */
export function trouverDepots(racine, profondeur = PROFONDEUR) {
  const trouves = [];
  const marcher = (d, niveau) => {
    if (existsSync(join(d, ".git"))) { trouves.push(d); return; }
    if (niveau >= profondeur) return;
    let entrees;
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees.sort((a, b) => (a.name < b.name ? -1 : 1))) {
      if (!e.isDirectory() || e.name === "node_modules" || e.name === ".git") continue;
      marcher(join(d, e.name), niveau + 1);
    }
  };
  marcher(racine, 0);
  return trouves;
}

const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const MOT_ISOLE = /^[a-z]+\d*$/i;

/** Motif d'un identifiant ENTIER : ni précédé ni suivi d'un caractère d'identifiant ; un mot isolé exige des guillemets. */
export function motifIdentifiant(id) {
  const avant = /^[A-Za-z0-9]/.test(id) ? "(?<![A-Za-z0-9_-])" : "";
  const apres = /[A-Za-z0-9]$/.test(id) ? "(?![A-Za-z0-9_-]|\\.[A-Za-z0-9])" : "";
  if (MOT_ISOLE.test(id)) return new RegExp(`(?<=["'\`])${echapper(id)}(?=["'\`])`);
  return new RegExp(`${avant}${echapper(id)}${apres}`);
}

const TAILLE_MAX_FICHIER = 64 * 1024 * 1024;
const PATHSPEC_EXCLUS = [".env", ".env.local", ".env.*.local", ".env.production*", ".env.development*", ".env.staging*", ".env.test*"]
  .map((p) => `:(exclude,glob)**/${p}`);

/**
 * Ce que `git grep -F` cherche pour un identifiant : sa racine (`gpt-` pour tous les `gpt-…`), jamais
 * un motif par identifiant. Avec 230 motifs fixes, git relit chaque ligne une fois par motif (mesuré
 * le 03/11/2026 : 59 s sur le seul pilot, 14 s sur un dépôt de 3 Mo) ; `-l` s'arrête au premier
 * motif trouvé par fichier (0,09 s sur ce même dépôt). La racine est un préfixe de l'identifiant,
 * donc un sur-ensemble : la lecture ligne à ligne des seuls fichiers retenus rend l'exactitude.
 */
export function racineGit(id) {
  const m = /^([A-Za-z]{3,})-/.exec(id);
  return m ? `${m[1]}-` : id;
}

/** Recherche, dans un dépôt, des identifiants donnés. Rend { occurrences: [{ id, fichier, ligne }], erreur } ; aucune ligne de contenu n'est conservée. */
export function chercherDansDepot(depot, ids, dossierTemp) {
  if (!ids.length) return { occurrences: [], erreur: null };
  const motifs = new Map(ids.map((id) => [id, motifIdentifiant(id)]));
  const fichierMotifs = join(dossierTemp, `motifs-${Math.abs(depot.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))}.txt`);
  // Un mot isolé (`ada`, `o3`) n'est cherché qu'entre guillemets : nu, il tombe dans « metadata » ou
  // « Canada » et git rend des centaines de milliers de lignes à revérifier.
  const motifsGit = [...new Set(ids.flatMap((id) => (MOT_ISOLE.test(id) ? [`"${id}"`, `'${id}'`, `\`${id}\``] : [racineGit(id)])))];
  writeFileSync(fichierMotifs, motifsGit.join("\n") + "\n", "utf8");
  const r = spawnSync("git", ["-c", "core.quotepath=off", "-C", depot, "grep", "-l", "-z", "-I", "-F", "--no-color", "-f", fichierMotifs, "--", ".", ...PATHSPEC_EXCLUS],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, timeout: 180000 });
  if (r.error) return { occurrences: [], erreur: `git indisponible ou délai dépassé : ${r.error.message}` };
  if (r.status === 1) return { occurrences: [], erreur: null };
  if (r.status !== 0) return { occurrences: [], erreur: `git grep a rendu ${r.status} : ${(r.stderr || "").split("\n")[0].slice(0, 200)}` };
  const occurrences = [];
  const nonLus = [];
  const prefiltre = new RegExp(motifsGit.map(echapper).join("|"));
  for (const fichier of r.stdout.split("\0").filter(Boolean)) {
    let texte;
    try {
      if (statSync(join(depot, fichier)).size > TAILLE_MAX_FICHIER) { nonLus.push(`${fichier} (plus de ${TAILLE_MAX_FICHIER / 1048576} Mo)`); continue; }
      texte = readFileSync(join(depot, fichier), "utf8");
    } catch { continue; }
    const lignes = texte.split("\n");
    for (let i = 0; i < lignes.length; i++) {
      const l = lignes[i];
      if (!prefiltre.test(l)) continue;
      for (const [id, re] of motifs) if (l.includes(id) && re.test(l)) occurrences.push({ id, fichier, ligne: i + 1 });
    }
  }
  return { occurrences, erreur: null, nonLus };
}

// ---- le jugement ---------------------------------------------------------------------------------
const lieux = (occ, max = 12) => {
  const liste = occ.slice(0, max).map((o) => `${o.depot}/${o.fichier}:${o.ligne}`);
  return liste.join(", ") + (occ.length > max ? ` (+${occ.length - max} autres, ${occ.length} au total)` : "");
};

/**
 * Le jugement, pur. `ref` : l'objet lu ; `occurrences` : [{ depot, fichier, ligne, id }] ; `date` : le jour.
 * `exclus` : chemins (depot/fichier, séparateur /) à ignorer, dont le référentiel lui-même.
 */
export function juger({ ref, occurrences = [], date, depotsLus = 0, depotsIllisibles = [], fichiersNonLus = [], exclus = [] }) {
  const findings = [];
  const lu = lireReferentiel(ref, date);
  if (lu.defauts.length) findings.push({ regle: "MT0", statut: "FAIL", message: `référentiel mal formé : ${lu.defauts.join(" ; ")}` });
  else findings.push({ regle: "MT0", statut: "PASS", message: `référentiel du ${ref.date} : ${Object.keys(ref.fournisseurs).length} fournisseur(s), ${lu.entrees.length} identifiant(s) déprécié(s) ou arrêté(s) cherché(s)` });
  for (const a of lu.avertissements) findings.push({ regle: "MT0", statut: "AVERT", message: a });
  for (const d of depotsIllisibles) findings.push({ regle: "MT0", statut: "AVERT", message: `dépôt non lu : ${d.depot} — ${d.erreur}` });
  if (fichiersNonLus.length) findings.push({ regle: "MT0", statut: "AVERT", message: `${fichiersNonLus.length} fichier(s) porteur(s) d'une racine d'identifiant non lu(s) pour leur taille : ${fichiersNonLus.join(", ")}` });

  const compte = { depots_lus: depotsLus, depots_illisibles: depotsIllisibles.length, identifiants_cherches: lu.entrees.length, mt1: 0, mt2: 0, mt3: 0, deprecies_arret_lointain: 0, tests_fixtures: { occurrences: 0, fichiers: 0, identifiants: 0 }, documentaire: { occurrences: 0, fichiers: 0, identifiants: 0 } };
  const horsFenetre = [];
  if (!lu.defauts.length) {
    const parId = new Map(lu.entrees.map((e) => [e.id, e]));
    const code = new Map();
    const tests = [];
    const docs = [];
    const exclusSet = new Set(exclus.map((x) => x.replaceAll("\\", "/").toLowerCase()));
    for (const o of occurrences) {
      if (exclusSet.has(`${o.depot}/${o.fichier}`.replaceAll("\\", "/").toLowerCase())) continue;
      if (!parId.has(o.id)) continue;
      const genre = classerFichier(o.fichier);
      if (genre === "tests") tests.push(o);
      else if (genre === "doc") docs.push(o);
      else { if (!code.has(o.id)) code.set(o.id, []); code.get(o.id).push(o); }
    }
    const resume = (liste) => ({ occurrences: liste.length, fichiers: new Set(liste.map((o) => `${o.depot}/${o.fichier}`)).size, identifiants: new Set(liste.map((o) => o.id)).size });
    compte.tests_fixtures = resume(tests);
    compte.documentaire = resume(docs);
    for (const [id, occ] of [...code].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
      const e = parId.get(id);
      const ctx = e.genre === "api" ? `${e.fournisseur}, ${e.note}` : e.fournisseur;
      const rempl = e.remplacant ? `, remplaçant « ${e.remplacant} »` : "";
      const nbFichiers = new Set(occ.map((o) => `${o.depot}/${o.fichier}`)).size;
      const base = `${e.genre === "api" ? "littéral" : "identifiant"} « ${id} » (${ctx})`;
      if (e.etat === "arrete") {
        compte.mt1 += 1;
        findings.push({ regle: "MT1", statut: "FAIL", id, arret: e.arret, ou: lieux(occ), message: `${base} arrêté depuis le ${e.arret}${rempl}, cité dans ${nbFichiers} fichier(s) de code ou de configuration : ${lieux(occ)}` });
      } else if (e.arret) {
        const reste = joursEntre(date, e.arret);
        if (reste < FENETRE_MT2_JOURS) {
          compte.mt2 += 1;
          findings.push({ regle: "MT2", statut: "AVERT", id, arret: e.arret, jours_restants: reste, ou: lieux(occ), message: `${base} s'arrête le ${e.arret} (dans ${reste} jour(s))${rempl}, cité dans ${nbFichiers} fichier(s) de code ou de configuration : ${lieux(occ)}` });
        } else {
          compte.deprecies_arret_lointain += 1;
          horsFenetre.push({ id, arret: e.arret, jours_restants: reste, occurrences: occ.length, fichiers: nbFichiers });
        }
      } else {
        compte.mt3 += 1;
        findings.push({ regle: "MT3", statut: "INFO", id, ou: lieux(occ), message: `${base} déprécié sans date d'arrêt annoncée${rempl}, cité dans ${nbFichiers} fichier(s) de code ou de configuration : ${lieux(occ)}` });
      }
    }
    const ordre = { MT1: 0, MT2: 1, MT3: 2 };
    findings.sort((a, b) => (ordre[a.regle] ?? -1) - (ordre[b.regle] ?? -1));
    if (!compte.mt1) findings.push({ regle: "MT1", statut: "PASS", message: "aucun identifiant arrêté n'est cité dans un fichier de code ou de configuration" });
    if (!compte.mt2) findings.push({ regle: "MT2", statut: "PASS", message: `aucun identifiant déprécié ne s'arrête dans moins de ${FENETRE_MT2_JOURS} jours dans le code ou la configuration` });
  }

  // MT4 — l'âge du calendrier
  if (estIso(ref && ref.date)) {
    const age = joursEntre(ref.date, date);
    if (age > AGE_MT4_JOURS) findings.push({ regle: "MT4", statut: "AVERT", message: `référentiel daté du ${ref.date}, soit ${age} jours : au-delà de ${AGE_MT4_JOURS} jours, les pages des fournisseurs sont à relire et le référentiel à redater` });
    for (const [nom, f] of Object.entries((ref && ref.fournisseurs) || {})) {
      if (f && estIso(f.lu_le)) {
        const ageF = joursEntre(f.lu_le, date);
        if (ageF > AGE_MT4_JOURS) findings.push({ regle: "MT4", statut: "AVERT", message: `page de ${nom} lue le ${f.lu_le}, soit ${ageF} jours : au-delà de ${AGE_MT4_JOURS} jours` });
      }
    }
    if (!findings.some((f) => f.regle === "MT4")) findings.push({ regle: "MT4", statut: "PASS", message: `référentiel et lectures des pages de moins de ${AGE_MT4_JOURS} jours (daté du ${ref.date})` });
  }

  const verdict = findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  return { verdict, findings, compte, hors_fenetre: horsFenetre };
}

// ---- exécution -----------------------------------------------------------------------------------
function lireArgs(argv) {
  const a = { racine: null, referentiel: REF_DEFAUT, date: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "--racine") a.racine = argv[++i];
    else if (x === "--referentiel") a.referentiel = argv[++i];
    else if (x === "--date") a.date = argv[++i];
    else if (x === "--json") a.json = true;
    else return { erreur: `option inconnue : ${x}` };
  }
  if (a.racine === undefined || !a.referentiel) return { erreur: "option sans valeur" };
  if (a.date !== null && !estIso(a.date)) return { erreur: "--date attend AAAA-MM-JJ" };
  return a;
}

export function executer(argv) {
  const a = lireArgs(argv);
  if (a.erreur) return { code: 2, sortie: `${NOM} : ${a.erreur}` };
  const racine = resolve(a.racine || process.env.FORGE_ROOT || join(ICI, "..", ".."));
  const date = a.date || aujourdhui();
  const refChemin = resolve(a.referentiel);
  let ref = null;
  let erreurLecture = null;
  try { ref = JSON.parse(readFileSync(refChemin, "utf8")); } catch (e) { erreurLecture = e.message; }
  const lu = ref ? lireReferentiel(ref, date) : { entrees: [] };
  const depots = existsSync(racine) ? trouverDepots(racine) : [];
  const occurrences = [];
  const illisibles = [];
  const nonLus = [];
  const exclus = [];
  const temp = mkdtempSync(join(tmpdir(), "modeles-tiers-"));
  try {
    const ids = lu.defauts && lu.defauts.length ? [] : [...new Set(lu.entrees.map((e) => e.id))];
    for (const depot of depots) {
      const nom = relative(racine, depot).split(sep).join("/") || ".";
      const r = chercherDansDepot(depot, ids, temp);
      if (r.erreur) { illisibles.push({ depot: nom, erreur: r.erreur }); continue; }
      for (const o of r.occurrences) occurrences.push({ ...o, depot: nom });
      for (const f of r.nonLus || []) nonLus.push(`${nom}/${f}`);
      const relRef = relative(depot, refChemin);
      if (!relRef.startsWith("..") && !/^[A-Za-z]:/.test(relRef)) exclus.push(`${nom}/${relRef.split(sep).join("/")}`);
    }
  } finally { rmSync(temp, { recursive: true, force: true }); }

  const j = juger({ ref, occurrences, date, depotsLus: depots.length - illisibles.length, depotsIllisibles: illisibles, fichiersNonLus: nonLus, exclus });
  if (erreurLecture) j.findings[0].message = `référentiel illisible (${refChemin}) : ${erreurLecture}`;
  let verdict = j.verdict;
  if (erreurLecture) verdict = "FAIL";
  else if (!depots.length && verdict === "PASS") verdict = "SKIP";
  const resume = verdict === "SKIP"
    ? `${NOM} — verdict SKIP : aucun dépôt git sous ${racine} (jusqu'à ${PROFONDEUR} niveaux), rien à mesurer`
    : `${NOM} — verdict ${verdict} : ${j.compte.depots_lus} dépôt(s) lu(s) sous ${racine}, ${j.compte.identifiants_cherches} identifiant(s) déprécié(s) ou arrêté(s) cherché(s), référentiel du ${(ref && ref.date) || "?"}, jour du contrôle ${date}`;
  const rapport = { oracle: NOM, version: VERSION, verdict, racine, referentiel: refChemin, date, resume, compte: j.compte, findings: j.findings, hors_fenetre: j.hors_fenetre, depots: depots.map((d) => relative(racine, d).split(sep).join("/") || "."), non_juge: NON_JUGE };
  let sortie;
  if (a.json) sortie = JSON.stringify(rapport, null, 1);
  else {
    const c = j.compte;
    sortie = [resume, `verdict : ${verdict}`,
      ...j.findings.map((f) => `  [${f.statut}] ${f.regle} — ${f.message}`),
      `  [INFO] tests et fixtures (comptés à part, jamais en MT1) : ${c.tests_fixtures.occurrences} occurrence(s) dans ${c.tests_fixtures.fichiers} fichier(s), ${c.tests_fixtures.identifiants} identifiant(s)`,
      `  [INFO] documentaire (comptés à part) : ${c.documentaire.occurrences} occurrence(s) dans ${c.documentaire.fichiers} fichier(s), ${c.documentaire.identifiants} identifiant(s)`,
      `  [INFO] identifiants dépréciés à arrêt au-delà de ${FENETRE_MT2_JOURS} jours cités dans le code ou la configuration : ${c.deprecies_arret_lointain}${j.hors_fenetre.length ? ` (${j.hors_fenetre.map((h) => `${h.id} le ${h.arret}`).join(", ")})` : ""}`,
      "non jugé :", ...NON_JUGE.map((n) => `  - ${n}`)].join("\n");
  }
  return { code: verdict === "FAIL" ? 1 : verdict === "SKIP" ? 2 : 0, sortie, rapport };
}

const memeFichier = (a, b) => resolve(a).toLowerCase() === resolve(b).toLowerCase();
if (process.argv[1] && memeFichier(fileURLToPath(import.meta.url), process.argv[1])) {
  const r = executer(process.argv.slice(2));
  console.log(r.sortie);
  process.exit(r.code);
}
