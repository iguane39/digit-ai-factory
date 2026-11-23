#!/usr/bin/env node
/**
 * boussole.mjs — LA BOUSSOLE DU NOUVEAU VENU : son niveau, sa note sur 100 et l'état du projet ouvert,
 * calculés sur les traces, jamais déclarés (étude 20261121h, démarche 20261121i, GO du porteur « Go L01 à L06 »
 * du 21/11/2026, lots L-01 à L-06 ; référence : references/BOUSSOLE.md).
 *
 * LE FAIT. Après la bannière « FACTORY DIGIT-AI OPÉRATIONNELLE », un nouvel utilisateur lit « Pour commencer,
 * dites ce que vous voulez obtenir » et doit deviner la suite ; sa progression est éparse dans des journaux de
 * run qu'il ne lit pas ; et chaque nouveau projet le traiterait en débutant. Mesuré le 21/11/2026 : 50 sessions
 * de produit sur 76 avaient leur premier tour refusé (journal des hooks du pilot, 22/10 au 21/11).
 *
 * CE QUE FAIT CE MODULE, en lecture seule sur les projets :
 *   · il lit les journaux de run (`forge/ledger.jsonl`) de TOUS les projets instrumentés du poste, plus le
 *     projet ouvert, dédoublonnés par leur début (copies d'un même projet), et en tire 30 jalons datés ;
 *   · niveau prouvé (5 niveaux), note = jalons prouvés / 30, ramenée sur 100 ; un niveau ANNONCÉ par
 *     l'utilisateur change ce que la boussole dit, jamais la note ;
 *   · il garde la progression de l'UTILISATEUR (pas d'un projet) dans `~/.digit-ai/progression.json`, sans nom
 *     de projet ni chemin, et la synchronise avec un dossier synchronisé déclaré (`canal.json`), sur le modèle
 *     du canal de reprise R-64 : union des jalons, un jalon prouvé ne se perd jamais ;
 *   · il rend les lignes du relevé d'ouverture et le détail de « où en suis-je ? ».
 *
 * Usage :
 *   node scripts/boussole.mjs                 lignes du relevé d'ouverture (défaut)
 *   node scripts/boussole.mjs --detail        détail « où en suis-je ? »
 *   node scripts/boussole.mjs --json          état complet
 *   node scripts/boussole.mjs --annoncer <1-5> | --debutant | --contredire
 *   node scripts/boussole.mjs --declarer-canal <dossier synchronisé> | --recuperer
 *   node scripts/boussole.mjs --noter <J-xx>  jalon prouvé par un autre hook (ex. J-07, skill appelé)
 * Options : --pilot <dossier> --cwd <dossier> --racine <dossier des projets> ; FORGE_UTILISATEUR_DIR remplace
 * `~/.digit-ai` (recettes) ; FORGE_TRANSCRIPTS_DIR remplace `~/.claude/projects`, où J-07 se prouve par un appel de
 * skill passé (recettes) ; FORGE_SANS_OBSERVATION=1 n'écrit rien.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
export const PILOT_PAR_DEFAUT = resolve(ICI, "..");
export const SCHEMA = "progression-utilisateur/1";
export const FICHIER_CANAL = "digit-ai-progression.json";

export const FORGES = ["conception", "design", "development", "tests", "ops", "data", "observability", "agents",
  "seo-geo", "audit", "organization", "agents-security", "websec"];
export const ETAPES = ["conception", "design", "development", "tests", "mep"];
export const TYPES_RUN = ["complet", "version", "mandat", "conseil"];

/** Les 30 jalons, dans l'ordre où la boussole propose le suivant. */
export const JALONS = [
  { id: "J-01", libelle: "premier livrable vert", famille: "geste", court: "un livrable vert", apport: "un livrable jugé conforme par ses oracles, prêt à être remis" },
  { id: "J-02", libelle: "première décision tranchée", famille: "geste", court: "une décision tranchée", apport: "vous gardez la main sur ce que la Factory ne tranche jamais seule" },
  { id: "J-03", libelle: "premier run clos", famille: "geste", court: "un run clos", apport: "un run mené jusqu'à sa synthèse, avec ses retours remontés" },
  { id: "J-04", libelle: "premier lot de retours remis", famille: "geste", court: "un lot de retours", apport: "ce que votre projet a appris améliore la Factory pour les suivants" },
  { id: "J-05", libelle: "premier audit complet", famille: "geste", court: "un audit complet", apport: "un état chiffré de votre produit et la liste de ses corrections" },
  { id: "J-06", libelle: "première publication sur GO", famille: "geste", court: "une publication sur GO", apport: "un livrable mis en ligne sous votre accord explicite" },
  { id: "J-07", libelle: "premier skill appelé par sa formule", famille: "geste", court: "un skill appelé par sa formule", apport: "une tâche courante lancée en une phrase, sans détailler la méthode" },
  { id: "J-08", libelle: "second run ouvert", famille: "geste", court: "un second run", apport: "votre progression vous suit d'un projet à l'autre" },
  ...ETAPES.map((e, i) => ({ id: `J-${String(9 + i).padStart(2, "0")}`, libelle: `première étape ${e === "mep" ? "de mise en production" : e} close`, famille: "etape", cle: e,
    court: `l'étape ${e === "mep" ? "de mise en production" : e}`, apport: "une étape du parcours menée jusqu'à ses oracles verts" })),
  ...TYPES_RUN.map((t, i) => ({ id: `J-${14 + i}`, libelle: `premier run ${t === "complet" ? "complet (nouveau produit)" : `de ${t}`}`, famille: "type", cle: t,
    court: `un run ${t === "complet" ? "complet" : `de ${t}`}`, apport: "un autre usage de la Factory, avec sa propre séquence" })),
  ...FORGES.map((f, i) => ({ id: `J-${18 + i}`, libelle: `forge-${f} mobilisée`, famille: "forge", cle: f, court: `forge-${f}`, apport: `les services de forge-${f} sur votre projet` })),
];
export const POINTS_PAR_JALON = Math.round(100 / JALONS.length);
const PAR_ID = new Map(JALONS.map((j) => [j.id, j]));
const idEtape = (e) => JALONS.find((j) => j.famille === "etape" && j.cle === e).id;
const idType = (t) => JALONS.find((j) => j.famille === "type" && j.cle === t).id;
const idForge = (f) => JALONS.find((j) => j.famille === "forge" && j.cle === f).id;

export const NIVEAUX = [
  null,
  { n: 1, nom: "Découverte", passage: "J-01" },
  { n: 2, nom: "Premiers résultats", passage: "J-02" },
  { n: 3, nom: "Décideur", passage: "J-03" },
  { n: 4, nom: "Praticien", passage: "J-04 ou J-08" },
  { n: 5, nom: "Autonome", passage: null },
];

// ---------------------------------------------------------------------------------------------------------
// Normalisation des traces (L-03) : les journaux passés ne sont jamais réécrits, ils se LISENT normalisés.
// ---------------------------------------------------------------------------------------------------------
const sansAccent = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Le nom normalisé d'une étape close, ou null : `etape_norme` d'abord, puis le premier mot de `etape`. */
export function normaliserEtape(entree) {
  const brut = sansAccent(entree?.etape_norme || entree?.etape);
  if (!brut) return null;
  const tete = brut.split(/[^a-z-]+/).filter(Boolean)[0] || "";
  if (tete === "developpement") return "development";
  return ETAPES.includes(tete) ? tete : null;
}

/** Le type d'un run à son ouverture : `type_run` d'abord, puis ce que disent ses champs. */
export function typeDeRun(entree) {
  const declare = sansAccent(entree?.type_run);
  if (TYPES_RUN.includes(declare)) return declare;
  const t = sansAccent(JSON.stringify(entree || {}));
  if (/run de conseil|run-conseil/.test(t)) return "conseil";
  if (/run de mandat|run-mandat|mandat transverse/.test(t)) return "mandat";
  if (/run de version|run-version/.test(t)) return "version";
  if (/nouveau produit|run complet|prompt-produit\.md/.test(t)) return "complet";
  return null;
}

/** Les forges nommées dans une chaîne ou une liste (« digit-ai-forge-audit (…) », « conception »…). */
export function forgesNommees(valeur) {
  const textes = (Array.isArray(valeur) ? valeur : [valeur]).map((v) => sansAccent(typeof v === "string" ? v : JSON.stringify(v)));
  const trouvees = new Set();
  for (let t of textes) {
    t = t.replace(/(digit-ai-)?forge-/g, " ");
    for (const f of [...FORGES].sort((a, b) => b.length - a.length)) {
      const re = new RegExp(`(^|[^a-z-])${f.replace("-", "\\-")}(?![a-z-])`);
      if (re.test(t)) { trouvees.add(f); t = t.replace(new RegExp(f.replace("-", "\\-"), "g"), " "); }
    }
  }
  return [...trouvees];
}

// ---------------------------------------------------------------------------------------------------------
// Lecture des projets du poste
// ---------------------------------------------------------------------------------------------------------
function lireJsonl(chemin) {
  try {
    return readFileSync(chemin, "utf8").split(/\r?\n/).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
const jour = (ts) => { const d = new Date(ts); return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10); };
function plusTot(carte, id, le, preuve) {
  if (!le || !PAR_ID.has(id)) return;
  const avant = carte.get(id);
  if (!avant || le < avant.le) carte.set(id, { le, preuve });
}

/** Les jalons prouvés par UN projet : son journal de run, sa mobilisation, ses lots de retours, son audit. */
export function jalonsDuProjet(dossier) {
  const carte = new Map();
  const journal = lireJsonl(join(dossier, "forge", "ledger.jsonl"));
  const ouvertures = [];
  for (const e of journal) {
    const le = jour(e.ts);
    if (!le) continue;
    if (e.type === "oracles_verdict" && Array.isArray(e.oracles) && e.oracles.length && e.oracles.every((o) => /PASS/i.test(String(o?.verdict || ""))))
      plusTot(carte, "J-01", le, "oracles_verdict PASS");
    else if (e.type === "oracles_verdict" && typeof e.verdict === "string" && /^PASS/i.test(e.verdict)) plusTot(carte, "J-01", le, "oracles_verdict PASS");
    if (e.type === "reponse_humain") plusTot(carte, "J-02", le, "reponse_humain");
    if (e.type === "run_close") plusTot(carte, "J-03", le, "run_close");
    if (e.type === "lot_remis") plusTot(carte, "J-04", le, "lot_remis");
    if (e.type === "go_publication") plusTot(carte, "J-06", le, "go_publication");
    if (e.type === "run_open") {
      ouvertures.push(e.ts);
      const t = typeDeRun(e);
      if (t) plusTot(carte, idType(t), le, `run_open ${t}`);
      for (const f of forgesNommees(e.forges_mobilisees || [])) plusTot(carte, idForge(f), le, "run_open forges_mobilisees");
      if (/audit complet|audit de la plateforme|chef de file forge-audit/.test(sansAccent(JSON.stringify(e)))) plusTot(carte, "J-05", le, "run_open audit");
    }
    if (e.type === "invocation" && e.forge) for (const f of forgesNommees(e.forge)) plusTot(carte, idForge(f), le, "invocation");
    if (e.type === "etape_close") { const et = normaliserEtape(e); if (et) plusTot(carte, idEtape(et), le, `etape_close ${et}`); }
  }
  for (const m of lireJsonl(join(dossier, "forge", "mobilisation.jsonl"))) {
    const le = jour(m.ts);
    for (const [f, v] of Object.entries(m.verdicts || {})) if (/^mobilis/.test(String(v?.verdict || ""))) for (const g of forgesNommees(f)) plusTot(carte, idForge(g), le, "mobilisation");
  }
  const retours = join(dossier, "forge", "retours");
  try {
    for (const n of readdirSync(retours)) if (/ - RETOURS - \d{8}/.test(n)) plusTot(carte, "J-04", jour(statSync(join(retours, n)).mtime), "lot de retours");
  } catch { /* pas de lots */ }
  const audit = join(dossier, "forge", "audit");
  try { if (readdirSync(audit).length) plusTot(carte, "J-05", jour(statSync(audit).mtime), "forge/audit"); } catch { /* pas d'audit */ }
  return { carte, ouvertures };
}

/** Les projets instrumentés : sous-dossiers directs de la racine portant `forge/ledger.jsonl`, plus `extra`, dédoublonnés. */
export function projetsDuPoste(racine, extra = []) {
  const candidats = [];
  try { for (const d of readdirSync(racine, { withFileTypes: true })) if (d.isDirectory() && !d.name.startsWith(".")) candidats.push(join(racine, d.name)); } catch { /* racine illisible */ }
  for (const e of extra) if (e) candidats.push(resolve(e));
  const vus = new Set(), empreintes = new Set(), garde = [];
  for (const c of candidats) {
    const cle = resolve(c).toLowerCase();
    if (vus.has(cle)) continue;
    vus.add(cle);
    const j = join(c, "forge", "ledger.jsonl");
    if (!existsSync(j)) continue;
    let debut = "";
    try { debut = readFileSync(j, "utf8").split(/\r?\n/).slice(0, 3).join("\n"); } catch { continue; }
    const h = createHash("sha1").update(debut).digest("hex");
    if (empreintes.has(h)) continue;
    empreintes.add(h);
    garde.push(c);
  }
  return garde;
}

/** Les jalons du poste : union des projets, la date la plus ancienne gagne ; J-08 au second run ouvert. */
export function jalonsDuPoste(projets) {
  const carte = new Map();
  const ouvertures = [];
  for (const p of projets) {
    const r = jalonsDuProjet(p);
    for (const [id, v] of r.carte) plusTot(carte, id, v.le, v.preuve);
    ouvertures.push(...r.ouvertures);
  }
  const triees = ouvertures.map(jour).filter(Boolean).sort();
  if (triees.length >= 2) plusTot(carte, "J-08", triees[1], "second run_open");
  return carte;
}

// ---------------------------------------------------------------------------------------------------------
// Niveau et note
// ---------------------------------------------------------------------------------------------------------
export function niveauProuve(ids) {
  const a = (id) => ids.has(id);
  if (!a("J-01")) return 1;
  if (!a("J-02")) return 2;
  if (!a("J-03")) return 3;
  if (!(a("J-04") || a("J-08"))) return 4;
  return 5;
}
export const noteSur100 = (n) => Math.round((n * 100) / JALONS.length);

// ---------------------------------------------------------------------------------------------------------
// Progression de l'utilisateur et canal synchronisé (L-02, L-04)
// ---------------------------------------------------------------------------------------------------------
export const dossierUtilisateur = (env = process.env) => env.FORGE_UTILISATEUR_DIR || join(homedir(), ".digit-ai");
const vide = () => ({ schema: SCHEMA, mise_a_jour: null, jalons: [] });

export function lireProgression(chemin) {
  try { const p = JSON.parse(readFileSync(chemin, "utf8")); return p && p.schema === SCHEMA ? { ...vide(), ...p, jalons: Array.isArray(p.jalons) ? p.jalons : [] } : vide(); }
  catch { return vide(); }
}

/** Union de deux progressions : jalons par id (le plus ancien gagne), annonce la plus récente, question la plus ancienne. */
export function fusionner(a, b) {
  const carte = new Map();
  for (const j of [...(a.jalons || []), ...(b.jalons || [])]) if (j?.id && PAR_ID.has(j.id) && (!carte.has(j.id) || j.le < carte.get(j.id).le)) carte.set(j.id, { id: j.id, libelle: PAR_ID.get(j.id).libelle, le: j.le, preuve: j.preuve });
  const annonces = [a, b].filter((p) => p.niveau_annonce).sort((x, y) => String(y.annonce_le || "").localeCompare(String(x.annonce_le || "")));
  const questions = [a.question_posee_le, b.question_posee_le].filter(Boolean).sort();
  const r = { schema: SCHEMA, mise_a_jour: [a.mise_a_jour, b.mise_a_jour].filter(Boolean).sort().pop() || null,
    jalons: [...carte.values()].sort((x, y) => x.id.localeCompare(y.id)) };
  const lus = [a.historique_lu_le, b.historique_lu_le].filter(Boolean).sort();
  if (lus.length) r.historique_lu_le = lus.pop();
  if (annonces[0]) { r.niveau_annonce = annonces[0].niveau_annonce; r.annonce_le = annonces[0].annonce_le; }
  if (questions[0]) r.question_posee_le = questions[0];
  if (a.debutant || b.debutant) r.debutant = true;
  return r;
}

function ecrireJson(chemin, objet) {
  if (process.env.FORGE_SANS_OBSERVATION === "1") return false;
  try { mkdirSync(dirname(chemin), { recursive: true }); writeFileSync(chemin, JSON.stringify(objet, null, 2) + "\n", "utf8"); return true; }
  catch { return false; }
}
export function lireCanal(dir) {
  try { const c = JSON.parse(readFileSync(join(dir, "canal.json"), "utf8")); return typeof c?.dossier === "string" && c.dossier.trim() ? c.dossier : null; }
  catch { return null; }
}

// ---------------------------------------------------------------------------------------------------------
// J-07 prouvé par l'historique (GO du porteur « A1 » du 22/11/2026, synthèse 20261122a)
// ---------------------------------------------------------------------------------------------------------
/**
 * LE FAIT. Le hook du lexique ne note J-07 que depuis le 21/11/2026 et ne tient aucun journal des appels plus anciens :
 * un utilisateur qui appelle des skills chaque jour voyait « Prochain jalon : premier skill appelé par sa formule ».
 * Un appel du skill (`"name":"Skill","input":{"skill":…`) dans une transcription de session du poste le prouve.
 * Le poste en porte 1,2 Go (mesuré le 22/11/2026) : la lecture va du plus ancien au plus récent, s'arrête au premier
 * appel, ne dépasse pas `budgetMs` par ouverture, et reprend la fois suivante après le dernier fichier lu en entier
 * (`historique_lu_le`). Seuls une date et un nom de fichier anonyme sont gardés, jamais le contenu.
 */
export const dossierTranscripts = (env = process.env) => env.FORGE_TRANSCRIPTS_DIR || join(homedir(), ".claude", "projects");
const MARQUE_SKILL = '"name":"Skill","input":{"skill":"';
export function skillDansHistorique(dossier, depuis = null, budgetMs = 400) {
  const fichiers = [];
  try {
    for (const d of readdirSync(dossier, { withFileTypes: true })) {
      const sous = d.isDirectory() ? join(dossier, d.name) : null;
      const noms = sous ? readdirSync(sous).map((n) => join(sous, n)) : [join(dossier, d.name)];
      for (const f of noms) {
        if (!f.endsWith(".jsonl")) continue;
        try { const m = statSync(f).mtime.toISOString(); if (!depuis || m > depuis) fichiers.push({ f, m }); } catch { /* disparu */ }
      }
    }
  } catch { return { trouve: null, lu_jusqu_au: depuis }; }
  fichiers.sort((x, y) => x.m.localeCompare(y.m));
  const debut = Date.now();
  let lu = depuis;
  for (const { f, m } of fichiers) {
    if (Date.now() - debut > budgetMs) break;
    let texte = "";
    try { texte = readFileSync(f, "utf8"); } catch { continue; }
    const i = texte.indexOf(MARQUE_SKILL);
    if (i >= 0) {
      const fin = texte.indexOf("\n", i);
      const ligne = texte.slice(texte.lastIndexOf("\n", i) + 1, fin < 0 ? undefined : fin);
      let le = null;
      try { le = jour(JSON.parse(ligne).timestamp); } catch { /* ligne illisible */ }
      return { trouve: { le: le || m.slice(0, 10) }, lu_jusqu_au: m };
    }
    lu = m;
  }
  return { trouve: null, lu_jusqu_au: lu };
}

/**
 * Le prochain jalon, choisi par pertinence (synthèse 20261122a). Jusqu'au niveau 3, l'ordre de la liste : les gestes
 * de base d'abord, c'est le vrai pas suivant d'un débutant. À partir du niveau 4 : d'abord un jalon que le projet
 * ouvert peut prouver, puis une forge jamais mobilisée, puis le reste, les gestes de débutant en dernier.
 */
const PROUVABLES = {
  run: ["J-09", "J-10", "J-11", "J-12", "J-13", "J-03"],
  existant: ["J-15", "J-05", "J-16"],
  neuf: ["J-14"],
  pilot: ["J-17", "J-16"],
};
export function prochainJalon(manquants, niveau, situation) {
  if (!manquants.length) return null;
  if (niveau < 4) return manquants[0];
  const ids = new Set(manquants.map((j) => j.id));
  const ici = (PROUVABLES[situation] || []).find((id) => ids.has(id));
  if (ici) return PAR_ID.get(ici);
  return manquants.find((j) => j.famille === "forge") || manquants.find((j) => j.famille !== "geste") || manquants[0];
}

// ---------------------------------------------------------------------------------------------------------
// État du projet ouvert, phrases d'intention, services utiles
// ---------------------------------------------------------------------------------------------------------
const HORS_CODE = new Set([".git", "forge", "input", "output", ".claude", "node_modules", ".vscode", ".idea"]);
export function etatProjet(cwd, pilot) {
  const ici = resolve(cwd);
  if (ici.toLowerCase() === resolve(pilot).toLowerCase()) return { situation: "pilot", texte: "le pilot de la Factory" };
  const journal = lireJsonl(join(ici, "forge", "ledger.jsonl"));
  let profil = null;
  try { const p = JSON.parse(readFileSync(join(ici, "forge", "PROFIL.json"), "utf8")); profil = p.type || p.profil || null; } catch { /* sans profil */ }
  const ouverts = [];
  for (const e of journal) {
    if (e.type === "run_open") ouverts.push(e.run || "run");
    if (e.type === "run_close") ouverts.pop();
  }
  if (ouverts.length) return { situation: "run", texte: `run en cours (${ouverts[ouverts.length - 1]})`, profil };
  let fichiers = 0;
  try { for (const d of readdirSync(ici)) if (!HORS_CODE.has(d) && !/^(README|LISEZMOI|CLAUDE|AGENTS)\.md$/i.test(d) && !d.startsWith(".")) fichiers++; } catch { /* illisible */ }
  if (journal.length) return { situation: "existant", texte: "produit existant, aucun run ouvert", profil };
  return fichiers ? { situation: "existant", texte: "code présent, aucun run ouvert", profil } : { situation: "neuf", texte: "neuf, aucun run ouvert", profil };
}

const MOTIFS_SITUATION = {
  neuf: [/^cr[ée]er un produit/i, /^concevoir pour un type/i, /^obtenir un conseil/i],
  existant: [/^faire [ée]voluer/i, /^auditer le produit/i, /^tester et corriger/i],
  run: [/^tester et corriger/i, /^revoir le design/i, /^d[ée]ployer/i],
  pilot: [/^cr[ée]er un produit/i, /^obtenir un conseil/i, /^auditer le produit/i],
};
/** Trois phrases d'intention LUES dans le tableau de routage de references/ACCUEIL.md, jamais recopiées ici. */
export function phrasesIntention(pilot, situation) {
  let texte = "";
  try { texte = readFileSync(join(pilot, "references", "ACCUEIL.md"), "utf8"); } catch { return []; }
  const section = texte.split(/\n(?=## )/).find((b) => /^## Routage intention/m.test(b)) || "";
  const intentions = section.split(/\r?\n/).filter((l) => /^\|/.test(l) && !/^\|[\s:|-]+\|?\s*$/.test(l)).slice(1)
    .map((l) => l.split("|")[1].replace(/\*\*/g, "").trim());
  const motifs = MOTIFS_SITUATION[situation] || MOTIFS_SITUATION.neuf;
  return motifs.map((m) => intentions.find((i) => m.test(i))).filter(Boolean)
    .map((i) => `« Je veux ${i.split(/\s[(—]/)[0].replace(/[,;.]\s*$/, "").trim()} : … »`);
}

/** Cinq services prouvés du catalogue, pris dans les forges que l'utilisateur n'a pas encore mobilisées. */
export function servicesUtiles(pilot, ids, n = 5) {
  const deja = new Set(FORGES.filter((f) => ids.has(idForge(f))));
  const pris = new Set(), r = [];
  for (const s of lireJsonl(join(pilot, "catalogues", "catalogue.jsonl"))) {
    if (!s.id || !s.forge || !/^prouv/i.test(String(s.statut || ""))) continue;
    const f = forgesNommees(s.forge)[0];
    if (!f || deja.has(f) || pris.has(f)) continue;
    pris.add(f);
    r.push({ id: s.id, forge: f, nom: s.nom, intention: s.intention });
    if (r.length >= n) break;
  }
  return r;
}

// ---------------------------------------------------------------------------------------------------------
// Calcul complet
// ---------------------------------------------------------------------------------------------------------
export function calculer({ pilot = PILOT_PAR_DEFAUT, cwd = process.cwd(), racine = null, dir = dossierUtilisateur(), ecrire = true, transcripts = dossierTranscripts() } = {}) {
  const projets = projetsDuPoste(racine || dirname(resolve(pilot)), [cwd]);
  const carte = jalonsDuPoste(projets);
  const fichier = join(dir, "progression.json");
  const locale = lireProgression(fichier);
  const canal = lireCanal(dir);
  let distante = vide(), canalEtat = null;
  if (canal) {
    const f = join(canal, FICHIER_CANAL);
    if (existsSync(f)) { distante = lireProgression(f); canalEtat = "lu"; } else canalEtat = existsSync(canal) ? "vide" : "introuvable";
  }
  const duPoste = { ...vide(), jalons: [...carte].map(([id, v]) => ({ id, le: v.le, preuve: v.preuve })) };
  const avant = new Set((locale.jalons || []).map((j) => j.id));
  let p = fusionner(fusionner(locale, distante), duPoste);
  const luAvant = p.historique_lu_le || null;
  if (transcripts && !p.jalons.some((j) => j.id === "J-07")) {
    const h = skillDansHistorique(transcripts, luAvant);
    if (h.trouve) { carte.set("J-07", { le: h.trouve.le, preuve: "appel de skill (transcription de session)" }); p = fusionner(p, { jalons: [{ id: "J-07", le: h.trouve.le, preuve: "appel de skill (transcription de session)" }] }); }
    if (h.lu_jusqu_au) p.historique_lu_le = h.lu_jusqu_au;
  }
  const prouvesIci = new Set(carte.keys());
  const repris = p.jalons.filter((j) => !prouvesIci.has(j.id) && (distante.jalons || []).some((d) => d.id === j.id)).length;
  const ids = new Set(p.jalons.map((j) => j.id));
  const prouve = niveauProuve(ids);
  let niveau = prouve, statut = repris && niveauProuve(prouvesIci) < prouve ? "prouvé sur un autre poste" : "prouvé";
  if (p.niveau_annonce && p.niveau_annonce > prouve) { niveau = p.niveau_annonce; statut = "annoncé"; }
  const vierge = !ids.size && !p.niveau_annonce && !p.debutant && !canal;
  const poserQuestion = vierge && !p.question_posee_le;
  if (poserQuestion) p.question_posee_le = new Date().toISOString();
  p.niveau = niveau;
  p.note = noteSur100(ids.size);
  const change = poserQuestion || p.jalons.some((j) => !avant.has(j.id)) || locale.niveau !== p.niveau || locale.note !== p.note
    || (locale.historique_lu_le || null) !== (p.historique_lu_le || null);
  if (change) p.mise_a_jour = new Date().toISOString();
  let ecrit = false, envoye = false;
  if (ecrire && (change || !existsSync(fichier))) ecrit = ecrireJson(fichier, p);
  if (ecrire && canal && existsSync(canal) && (change || canalEtat !== "lu")) envoye = ecrireJson(join(canal, FICHIER_CANAL), p);
  const etat = etatProjet(cwd, pilot);
  const manquants = JALONS.filter((j) => !ids.has(j.id));
  return { pilot, projets: projets.length, progression: p, ids, niveau, prouve, statut, note: p.note, jalons_prouves: ids.size,
    repris, canal, canal_etat: canalEtat, ecrit, envoye, poser_question: poserQuestion, etat, manquants, prochain: prochainJalon(manquants, niveau, etat.situation),
    phrases: phrasesIntention(pilot, etat.situation), services: servicesUtiles(pilot, ids) };
}

// ---------------------------------------------------------------------------------------------------------
// Rendus
// ---------------------------------------------------------------------------------------------------------
const enSlash = (p) => String(p).replace(/\\/g, "/");
/**
 * Ce que la boussole dit, selon le niveau (synthèse 20261122a, GO « A1 » du 22/11/2026). Le fait : au niveau 5 et à
 * 87/100, la boussole expliquait encore comment formuler une demande, parce que les phrases d'exemple s'affichaient dans
 * tout produit neuf ou existant, quel que soit le niveau. Désormais : niveaux 1 et 2, phrases d'exemple ; niveau 3, la
 * façon de trancher ; niveau 4, les services des forges jamais mobilisées ; niveau 5, une seule ligne.
 */
export function ligneBoussole(e) {
  const statut = e.statut === "prouvé" ? "" : ` (${e.statut})`;
  if (e.niveau >= 5) {
    const reste = e.manquants || [];
    const liste = reste.length ? `reste : ${reste.slice(0, 3).map((j) => j.court || j.libelle).join(", ")}${reste.length > 3 ? ` et ${reste.length - 3} autres` : ""}` : "tous les jalons sont prouvés";
    return [`Boussole — niveau 5${statut} · ${e.note}/100 · ${liste}.`];
  }
  const lignes = [`Boussole — vous : niveau ${e.niveau}${statut} · ${e.note}/100. Ce projet : ${e.etat.texte}.`];
  if (e.niveau === 2) lignes.push("Dans chaque compte rendu, lisez d'abord le bloc 0 (ce qui a été fait) et le bloc 3 (ce que vous décidez) ; vos livrables sont dans output/.");
  if (e.niveau <= 2 && e.phrases.length) lignes.push(`Dites par exemple : ${e.phrases.join(" · ")}`);
  if (e.niveau === 3) lignes.push("Une décision se tranche par sa lettre collée au numéro, par exemple « 3a ».");
  if (e.niveau === 4 && e.services.length) lignes.push(`Services utiles pour aller plus loin : ${e.services.map((s) => `${s.nom} (forge-${s.forge})`).join(" · ")}.`);
  if (e.prochain) lignes.push(`Prochain jalon : ${e.prochain.libelle} (+${POINTS_PAR_JALON})${e.niveau <= 1 && e.prochain.apport ? ` : ${e.prochain.apport}` : ""}.`);
  return lignes;
}

/** Les lignes du relevé d'ouverture : la boussole à recopier, puis la consigne pour la session. */
export function lignesReleve(e) {
  const cmd = `node "${enSlash(join(e.pilot, "scripts", "boussole.mjs"))}"`;
  const out = ["", "## Boussole de l'utilisateur (references/BOUSSOLE.md, lots L-01 à L-06 du 21/11/2026)", ...ligneBoussole(e).map((l) => `> ${l}`),
    `- Reprends ces lignes « Boussole — … » telles quelles en tête de ta première réponse de la session, puis réponds. « où en suis-je ? » appelle le skill \`ou-en-suis-je\` (\`${cmd} --detail\`).`,
    `- L'utilisateur annonce son niveau (« j'ai déjà mené trois runs ») : joue \`${cmd} --annoncer <1-5>\` ; il demande de récupérer sa progression : \`${cmd} --recuperer\`, et \`--declarer-canal "<dossier synchronisé>"\` s'il nomme son dossier Drive, OneDrive ou Dropbox.`];
  if (e.poser_question) out.push(`- **Poste vierge** (aucune trace, aucune progression) : pose UNE fois, dans ta première réponse, la question « Avez-vous déjà utilisé la Factory ailleurs ? Répondez « non », « oui, niveau <1 à 5> », ou « oui, récupère ma progression » », puis joue \`--debutant\`, \`--annoncer <n>\` ou \`--recuperer\` selon la réponse. Elle ne sera plus posée.`);
  if (e.canal && e.canal_etat === "introuvable") out.push(`- Dossier de progression synchronisé introuvable sur ce poste : ${enSlash(e.canal)} — rien n'a été lu ni envoyé.`);
  return out;
}

export function detail(e) {
  const p = e.progression;
  const l = [`Où en êtes-vous — ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`, "",
    `Niveau ${e.niveau} sur 5 — ${NIVEAUX[e.niveau].nom}${e.statut === "prouvé" ? "" : ` (${e.statut})`} · note ${e.note}/100 (${e.jalons_prouves} jalons prouvés sur ${JALONS.length}).`,
    `Ce projet : ${e.etat.texte}.`, "", "Jalons prouvés :"];
  for (const j of p.jalons) l.push(`  · ${j.id} ${PAR_ID.get(j.id).libelle} — le ${j.le} (${j.preuve})`);
  if (!p.jalons.length) l.push("  · aucun pour l'instant");
  if (e.prochain) l.push("", `Prochain jalon : ${e.prochain.libelle} (+${POINTS_PAR_JALON})${e.prochain.apport ? ` : ${e.prochain.apport}` : ""}.`);
  if (e.services.length) l.push("", "Services utiles pour vos prochains jalons :", ...e.services.map((s) => `  · ${s.nom} (forge-${s.forge}) : ${s.intention}`));
  if (e.niveau <= 2 && e.phrases.length) l.push("", `Pour commencer sur ce projet, dites par exemple : ${e.phrases.join(" · ")}`);
  l.push("", e.canal ? `Progression synchronisée avec : ${enSlash(e.canal)} (${e.canal_etat}).` : "Progression non synchronisée : dites « récupère ma progression depuis <dossier Drive> » pour la partager entre vos postes.");
  return l.join("\n");
}

/**
 * L-06 — LES PRÉFÉRENCES DE L'UTILISATEUR REMPLACENT CELLES DU PORTEUR quand il en a écrit (GO « Go L01 à L06 » du 21/11/2026).
 * Le fait : `references/PREFERENCES-PORTEUR.md` se chargeait à chaque ouverture, au pilot et chez les produits, quel que soit
 * l'utilisateur du poste ; un nouveau venu héritait de règles personnelles du porteur (« seul le compte du porteur publie »).
 * Le fichier de l'utilisateur vit hors de tout dépôt, dans son dossier `~/.digit-ai` : il ne voyage pas avec le pilot.
 */
export function fichierPreferences(pilot, dir = dossierUtilisateur()) {
  const perso = join(dir, "PREFERENCES-UTILISATEUR.md");
  if (existsSync(perso)) return { chemin: perso, titre: `Préférences de l'utilisateur (L-06, ${enSlash(perso)})`, utilisateur: true };
  const porteur = join(pilot, "references", "PREFERENCES-PORTEUR.md");
  return existsSync(porteur) ? { chemin: porteur, titre: "Préférences du porteur (T1, TF-1946 — references\\PREFERENCES-PORTEUR.md)", utilisateur: false } : null;
}

// ---------------------------------------------------------------------------------------------------------
// Gestes de l'utilisateur
// ---------------------------------------------------------------------------------------------------------
function modifier(dir, f) {
  const chemin = join(dir, "progression.json");
  const p = lireProgression(chemin);
  f(p);
  p.mise_a_jour = new Date().toISOString();
  ecrireJson(chemin, p);
  return p;
}
export const annoncer = (dir, n) => modifier(dir, (p) => { p.niveau_annonce = Math.max(1, Math.min(5, Number(n) || 1)); p.annonce_le = new Date().toISOString(); delete p.debutant; });
export const debutant = (dir) => modifier(dir, (p) => { p.debutant = true; delete p.niveau_annonce; });
/** Une annonce contredite par l'usage redescend d'un niveau ; elle disparaît quand elle rejoint le prouvé. */
export function contredire(dir, prouve) {
  return modifier(dir, (p) => {
    if (!p.niveau_annonce) return;
    p.niveau_annonce -= 1;
    if (p.niveau_annonce <= prouve) delete p.niveau_annonce;
    p.contredit_le = new Date().toISOString();
  });
}
export function noter(dir, id, preuve = "hook") {
  if (!PAR_ID.has(id)) throw new Error(`jalon inconnu : ${id}`);
  return modifier(dir, (p) => { if (!p.jalons.some((j) => j.id === id)) p.jalons.push({ id, libelle: PAR_ID.get(id).libelle, le: new Date().toISOString().slice(0, 10), preuve }); });
}
export function declarerCanal(dir, dossier) {
  if (!existsSync(dossier)) throw new Error(`dossier synchronisé introuvable : ${dossier}`);
  return ecrireJson(join(dir, "canal.json"), { dossier: resolve(dossier), declare_le: new Date().toISOString() });
}

// ---------------------------------------------------------------------------------------------------------
// Ligne de commande
// ---------------------------------------------------------------------------------------------------------
const EST_CLI = Boolean(process.argv[1]) && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (EST_CLI) {
  const a = process.argv.slice(2);
  const val = (o) => { const i = a.indexOf(o); return i >= 0 ? a[i + 1] : null; };
  const pilot = val("--pilot") || PILOT_PAR_DEFAUT;
  const cwd = val("--cwd") || process.cwd();
  const racine = val("--racine");
  const dir = dossierUtilisateur();
  try {
    if (a.includes("--annoncer")) { annoncer(dir, val("--annoncer")); }
    if (a.includes("--debutant")) debutant(dir);
    if (a.includes("--declarer-canal")) declarerCanal(dir, val("--declarer-canal"));
    if (a.includes("--noter")) noter(dir, val("--noter"), val("--preuve") || "hook");
    if (a.includes("--contredire")) { const e0 = calculer({ pilot, cwd, racine, dir, ecrire: false, transcripts: null }); contredire(dir, e0.prouve); }
    const e = calculer({ pilot, cwd, racine, dir });
    if (a.includes("--json")) process.stdout.write(JSON.stringify({ ...e, ids: [...e.ids] }, null, 1) + "\n");
    else if (a.includes("--detail") || a.includes("--recuperer")) {
      if (a.includes("--recuperer") && !e.canal) process.stdout.write("Aucun dossier synchronisé déclaré : nommez-le (« récupère ma progression depuis <dossier> »), la session jouera --declarer-canal \"<dossier>\".\n\n");
      process.stdout.write(detail(e) + "\n");
    } else if (a.some((x) => ["--annoncer", "--debutant", "--contredire", "--noter", "--declarer-canal"].includes(x))) process.stdout.write(ligneBoussole(e).join("\n") + "\n");
    else process.stdout.write(lignesReleve(e).join("\n") + "\n");
    process.exit(0);
  } catch (err) {
    process.stderr.write(`[boussole] ${String(err?.message || err)}\n`);
    process.exit(1);
  }
}
