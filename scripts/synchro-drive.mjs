#!/usr/bin/env node
/**
 * synchro-drive.mjs — LA MOITIÉ DRIVE DE « SYNCHRO » (TF-2795, D-238 (a) du 23/11/2026).
 *
 * LE FAIT. Le 23/11/2026, « /synchro » a été rendu « à jour » sur les seuls dépôts git : 8 fichiers du miroir
 * Drive d'output étaient en retard, et le script qui tenait ce miroir vivait dans le dossier temporaire d'une
 * session du 21/11. La moitié Drive se recomposait à la main ; elle s'écrit donc une fois, ici, et
 * `synchroniser.mjs` la joue après les dépôts.
 *
 * CE QUE FAIT LE SCRIPT, dans cet ordre :
 *   1. LE MIROIR D'OUTPUT. Chaque fichier d'`output/` suivi par git à la tête du pilot est comparé, octet pour
 *      octet, à sa copie sous `<dev du Drive>/_factory/output` (empreintes git des deux côtés, `git hash-object
 *      --no-filters`) ; ce qui manque ou diffère est recopié depuis l'objet git, puis réhaché. Un fichier du
 *      miroir que git ne suit plus est LISTÉ, jamais supprimé : la suppression reste un geste humain.
 *   2. CHAQUE PRODUIT QUI DÉCLARE `forge/REPRISE.json` sous la racine du parc : envoi vers le Drive par
 *      `oracle-reprise` (données, coffre de secrets clé par clé, mémoire Claude), sous le feu vert que le
 *      manifeste consigne ; puis le juge, dont seuls les constats de données sont repris (RP3 canal joignable,
 *      RP4 rien à restaurer, et les mêmes pour le coffre et la mémoire). Le pilot n'écrit JAMAIS chez un produit :
 *      ce que le Drive porte de plus récent revient au produit par son propre hook d'ouverture.
 *   3. CHAQUE DOSSIER sous `<dev du Drive>` (hors `_…`) reçoit une ligne : le produit et le mécanisme qui
 *      l'écrit (canal de reprise, script propre au produit, notice à suivre à la main, aucun), sa dernière
 *      écriture, et ses écarts au modèle de D-238 (a) : dossier sans suffixe, sous-dossiers `donnees`, `coffre`,
 *      `memoire-claude`, rien d'autre. Un dossier sans canal de reprise est `a_migrer` : il se dit, il ne bloque pas.
 *
 * NON JUGÉ (déclaré). Ce que le client Google Drive fait des fichiers une fois posés dans le miroir local
 * (envoi effectif, versions) ; un dossier du Drive écrit par un mécanisme propre au produit (il est nommé, pas
 * joué : le pilot n'exécute pas le code d'un produit) ; un produit absent de ce poste.
 *
 * Usage : node scripts/synchro-drive.mjs [--essai] [--drive-dev <dossier>] [--racine <parc>] [--pilot <dossier>]
 *   --essai       n'écrit rien : compare et dit ce qui serait fait
 * Sortie : JSON sur stdout. Exit : 0 tout est à jour · 1 au moins un écart bloquant · 2 argument invalide ou
 * dossier dev du Drive introuvable.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { lireManifeste, resoudreCanal, synchroniser as synchroniserReprise, verifier as verifierReprise, dedans } from "../oracles/oracle-reprise.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
export const CONFIG = join(ICI, "synchro-drive.json");
const developper = (p) => String(p).replace(/^~(?=$|[\\/])/, homedir());
const estDossier = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };

export function lireConfig(fichier = CONFIG) { return JSON.parse(readFileSync(fichier, "utf8")); }

/** Le dossier dev du Drive de ce poste : { dossier, essais }. */
export function resoudreDriveDev(cfg, { option = null, env = process.env } = {}) {
  const essais = [option, env[cfg.variable], ...(cfg.racines || [])].filter(Boolean).map((c) => resolve(developper(c)));
  return { dossier: essais.find(estDossier) || null, essais };
}

function git(cwd, argv, input) {
  const r = spawnSync("git", argv, { cwd, input, encoding: input === undefined ? "buffer" : undefined, windowsHide: true, maxBuffer: 1 << 30 });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`git ${argv.slice(0, 2).join(" ")} : ${String(r.stderr || "").trim().slice(0, 300)}`);
  return r.stdout;
}
/** Empreintes git de fichiers du disque, sans filtre (les octets tels quels), dans l'ordre donné. */
function empreintes(cwd, chemins) {
  if (!chemins.length) return [];
  const out = git(cwd, ["hash-object", "--no-filters", "--stdin-paths"], Buffer.from(chemins.join("\n") + "\n", "utf8"));
  return out.toString("utf8").trim().split(/\r?\n/);
}

function marcher(base, d = base, acc = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (estDossier(p)) marcher(base, p, acc); else acc.push(relative(base, p).split(sep).join("/"));
  }
  return acc;
}

/** 1. Le miroir d'output : à la tête du pilot, octet pour octet. */
export function miroirOutput({ pilot, cible, essai = false }) {
  const head = git(pilot, ["rev-parse", "--short", "HEAD"]).toString().trim();
  const arbre = git(pilot, ["ls-tree", "-r", "-z", "HEAD", "--", "output/"]).toString("utf8").split("\0").filter(Boolean)
    .map((l) => { const t = l.indexOf("\t"); const [, type, objet] = l.slice(0, t).split(" "); return { type, objet, rel: l.slice(t + 1).slice("output/".length) }; })
    .filter((x) => x.type === "blob");
  const presents = arbre.filter((x) => existsSync(join(cible, ...x.rel.split("/"))));
  const manquants = arbre.filter((x) => !existsSync(join(cible, ...x.rel.split("/"))));
  const h = empreintes(pilot, presents.map((x) => join(cible, ...x.rel.split("/"))));
  const differents = presents.filter((x, i) => h[i] !== x.objet);
  const suivis = new Set(arbre.map((x) => x.rel));
  const horsGit = estDossier(cible) ? marcher(cible).filter((r) => !suivis.has(r) && !/(^|\/)desktop\.ini$/i.test(r)) : [];
  const aCopier = [...manquants, ...differents];
  let encoreFaux = aCopier.map((x) => x.rel);
  if (!essai && aCopier.length) {
    for (const x of aCopier) {
      const dst = join(cible, ...x.rel.split("/"));
      mkdirSync(dirname(dst), { recursive: true });
      writeFileSync(dst, git(pilot, ["cat-file", "blob", x.objet]));
    }
    const h2 = empreintes(pilot, aCopier.map((x) => join(cible, ...x.rel.split("/"))));
    encoreFaux = aCopier.filter((x, i) => h2[i] !== x.objet).map((x) => x.rel);
  }
  return {
    cible, head, suivis: arbre.length, identiques: presents.length - differents.length,
    manquants: manquants.map((x) => x.rel), differents: differents.map((x) => x.rel),
    copies: essai ? 0 : aCopier.length - encoreFaux.length, hors_git: horsGit,
    statut: encoreFaux.length ? (essai ? "a_copier" : "echec") : "a_jour",
  };
}

/** Dernière écriture d'un dossier, sur deux niveaux (un dossier de 100 Gio ne se parcourt pas en entier). */
function derniereEcriture(d) {
  let max = 0;
  const voir = (p, prof) => {
    let st; try { st = statSync(p); } catch { return; }
    max = Math.max(max, st.mtimeMs);
    if (prof < 2 && st.isDirectory()) for (const n of readdirSync(p)) voir(join(p, n), prof + 1);
  };
  voir(d, 0);
  return max ? new Date(max).toISOString().slice(0, 10) : null;
}

/** Les écarts d'un dossier du Drive au modèle de D-238 (a). */
export function ecartsAuModele(cfg, nom, dossier) {
  const ecarts = [];
  if (cfg.suffixe_ancien && nom.endsWith(cfg.suffixe_ancien)) ecarts.push(`nom suffixé « ${cfg.suffixe_ancien.trim()} »`);
  const admis = new Set(Object.values(cfg.sous_dossiers));
  for (const n of readdirSync(dossier)) {
    if (admis.has(n) || /^desktop\.ini$/i.test(n)) continue;
    ecarts.push(new RegExp(cfg.a_retirer.motif_cache).test(n) ? `cache d'oracle « ${n} »` : `« ${n} » hors des sous-dossiers du modèle`);
  }
  return ecarts;
}

/** Les produits du parc qui déclarent un canal de reprise. */
export function produitsAvecCanal(racine) {
  const sortie = [];
  for (const n of readdirSync(racine)) {
    if (n.startsWith("_")) continue;
    const p = join(racine, n);
    if (estDossier(p) && existsSync(join(p, "forge", "REPRISE.json"))) sortie.push(p);
  }
  return sortie;
}

/** 2. Un produit au canal de reprise : envoi sous son feu vert, puis les constats de données du juge. */
function produitReprise(p, driveDev, essai) {
  const { m, erreur } = lireManifeste(p);
  if (!m) return { produit: p, mecanisme: "canal de reprise (forge/REPRISE.json)", statut: "echec", raisons: [erreur || "manifeste absent"] };
  const { canal } = resoudreCanal(m);
  const sousDev = canal ? dedans(driveDev, canal) : null;
  const ligne = { produit: p, dossier: sousDev ? sousDev.split("/")[0] : null, mecanisme: "canal de reprise (forge/REPRISE.json)", canal };
  if (!canal) return { ...ligne, statut: "canal_absent", raisons: ["aucun emplacement du canal n'existe sur ce poste"] };
  const raisons = [];
  if (!essai && m?.envoi?.actif) {
    const r = synchroniserReprise(p, "pousser", { budget: 120 });
    ligne.envoi = { envoyes: r.fait?.length || 0, conflits: r.conflits?.length || 0, reportes: r.reste || 0, refuses: r.refuses?.length || 0 };
    if (r.erreur) raisons.push(`envoi : ${r.erreur}`);
    else if (r.refuse) raisons.push(`envoi refusé : ${r.message}`);
    for (const [nom, x] of [["coffre", r.secrets], ["mémoire", r.memoire]]) {
      if (!x) continue;
      if (x.erreur || x.refus) raisons.push(`${nom} : ${x.erreur || x.refus}`);
      for (const f of x.fichiers || []) if (f.refus) raisons.push(`${nom} : ${f.fichier} — ${f.refus}`);
    }
  } else if (!m?.envoi?.actif) raisons.push("envoi non actif au manifeste : rien n'est poussé");
  const v = verifierReprise(p, {});
  const donnees = (v.findings || []).filter((f) => ["RP3", "RP4"].includes(f.regle));
  ligne.constats = donnees.map((f) => ({ regle: f.regle, flux: f.flux || "canal", statut: f.statut, message: String(f.message || "").slice(0, 300) }));
  // RP3 (un flux injoignable) bloque ; RP4 (le Drive porte plus récent que ce poste) se restaure au hook d'ouverture du produit
  const info = [];
  for (const f of donnees) if (f.statut === "FAIL") (f.regle === "RP3" ? raisons : info).push(`${f.regle}${f.flux ? " " + f.flux : ""} : ${String(f.message || "").slice(0, 200)}`);
  return { ...ligne, statut: raisons.length ? "a_traiter" : info.length ? "a_restaurer_a_l_ouverture" : "a_jour", raisons: [...raisons, ...info] };
}

export function synchroDrive({ pilot, racine, driveDev, essai = false, cfg = lireConfig() }) {
  const miroir = miroirOutput({ pilot, cible: join(driveDev, ...cfg.miroir_output.split("/")), essai });
  const lignes = produitsAvecCanal(racine).map((p) => {
    try { return produitReprise(p, driveDev, essai); }
    catch (e) { return { produit: p, mecanisme: "canal de reprise (forge/REPRISE.json)", statut: "echec", raisons: [String(e?.message || e).slice(0, 300)] }; }
  });
  const locaux = new Map(readdirSync(racine).filter((n) => estDossier(join(racine, n))).map((n) => [n.toLowerCase(), join(racine, n)]));
  const dossiers = [];
  for (const nom of readdirSync(driveDev).filter((n) => !n.startsWith("_") && estDossier(join(driveDev, n))).sort()) {
    const abs = join(driveDev, nom);
    const base = { dossier: nom, derniere_ecriture: derniereEcriture(abs), ecarts_d238: ecartsAuModele(cfg, nom, abs) };
    const l = lignes.find((x) => (x.dossier || "").toLowerCase() === nom.toLowerCase());
    if (l) { dossiers.push({ ...base, ...l }); continue; }
    const local = locaux.get(nom.replace(cfg.suffixe_ancien, "").toLowerCase()) || null;
    const mecanisme = local && existsSync(join(local, "build", "sauvegarde-drive.py")) ? "script propre au produit (build/sauvegarde-drive.py), non joué par le pilot"
      : existsSync(join(abs, "REPRISE.md")) ? "notice REPRISE.md, à suivre à la main"
      : "aucun mécanisme connu";
    dossiers.push({ ...base, produit: local, mecanisme, statut: "a_migrer", raisons: ["pas de canal de reprise : ce dossier ne suit pas d'un poste à l'autre sans geste"] });
  }
  // un produit dont le canal est absent, ou hors du dossier dev du Drive, garde sa ligne
  for (const l of lignes) if (!dossiers.some((d) => d.produit === l.produit)) dossiers.push(l);
  const bloquant = miroir.statut === "echec" || dossiers.some((d) => ["a_traiter", "canal_absent", "echec"].includes(d.statut));
  return {
    outil: "synchro-drive", decision: "D-238 (a) du 23/11/2026", drive_dev: driveDev, essai,
    miroir: { ...miroir, manquants: miroir.manquants.slice(0, 20), differents: miroir.differents.slice(0, 20), hors_git: miroir.hors_git.slice(0, 20), hors_git_total: miroir.hors_git.length },
    resume: Object.fromEntries([...new Set(dossiers.map((d) => d.statut))].map((s) => [s, dossiers.filter((d) => d.statut === s).length])),
    verdict: bloquant ? "A_TRAITER" : "OK", dossiers,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const a = process.argv.slice(2);
  const val = (n) => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : undefined; };
  const inconnus = a.filter((x, i) => x.startsWith("--") && !["--essai", "--drive-dev", "--racine", "--pilot"].includes(x) && !["--drive-dev", "--racine", "--pilot"].includes(a[i - 1]));
  if (inconnus.length) { process.stderr.write(`synchro-drive : argument inconnu : ${inconnus[0]}\n`); process.exit(2); }
  const cfg = lireConfig();
  const pilot = resolve(val("--pilot") || join(ICI, ".."));
  const racine = resolve(val("--racine") || process.env.FORGE_ROOT || dirname(pilot));
  const { dossier, essais } = resoudreDriveDev(cfg, { option: val("--drive-dev") });
  if (!dossier) { process.stderr.write(`synchro-drive : dossier dev du Drive introuvable ; essayés : ${essais.join(" ; ")}\n`); process.exit(2); }
  const r = synchroDrive({ pilot, racine, driveDev: dossier, essai: a.includes("--essai"), cfg });
  process.stdout.write(JSON.stringify(r, null, 1) + "\n");
  process.exit(r.verdict === "OK" ? 0 : 1);
}
