#!/usr/bin/env node
/**
 * oracle-reprise.mjs — reprise d'un produit sur tous les postes de son développeur (R-64, TF-1736).
 *
 * LE FAIT (lot Produit-12 20261014b, RS-33, décision humaine D-3 (b) du 15/10/2026). Le 03/10, le
 * développeur demande à reprendre son produit sur un autre poste ; un dossier Google Drive privé est
 * créé, avec une notice à suivre à la main. Il contient les 58 générateurs des pages d'exemple. Le
 * 14/10, une session de l'autre poste les déclare introuvables, et une session de ce poste laisse leur
 * transport à l'humain. Le canal tenait son contenu : c'est le geste qui l'applique qui manquait.
 *
 * LE CANAL SE DÉCLARE dans `forge/REPRISE.json` (gabarit `gabarits/REPRISE.json`) :
 *   canal.chemins   — les emplacements du dossier synchronisé, un par poste possible (« ~ » et
 *                     %VARIABLE% développés) ; la variable d'environnement REPRISE_CANAL prime ;
 *   elements        — chemins relatifs au produit (fichier ou dossier), au même chemin dans le canal ;
 *   exclusions      — motifs ajoutés aux exclusions dures ;
 *   regenerer       — [{ commande, produit }] : à la restauration, après la copie, la commande se joue depuis la
 *                     racine du produit quand `produit` (chemin relatif d'une base ignorée par git) manque ou est vide ;
 *   envoi           — { actif, go_publication: { decision, date, par } } : l'envoi vers le canal fait
 *                     partir des fichiers vers un service hébergé, il exige le feu vert R-38 consigné ;
 *   secrets         — (facultatif, D-224 (a) du 21/11/2026) le COFFRE : { fichiers, chemins, cles_attendues } —
 *                     les fichiers d'environnement du produit (`.env`, `stats/.env`), les emplacements du coffre
 *                     par poste (`<…>/<Produit> - Reprise/SECRETS`) et les NOMS des clés que le produit exige ;
 *   memoire         — (facultatif, D-224 (a)) { chemins } : les emplacements du dossier `MEMOIRE-CLAUDE` par poste.
 *
 * MODES
 *   --restaurer  canal → produit : ce qui manque ou a vieilli sur ce poste (hook d'ouverture, asynchrone) ;
 *                coffre → fichier d'environnement du poste, clé par clé ; dossier MEMOIRE-CLAUDE → mémoire
 *                Claude du projet. L'ouverture n'écrit que ce poste : rien ne part vers le service hébergé ;
 *   --pousser    produit → canal : ce qui a changé hors de git sur ce poste (hook de fin de tour) ; poste →
 *                coffre, clé par clé ; mémoire → MEMOIRE-CLAUDE. Le tout sous le même feu vert `envoi.go_publication` ;
 *   --prefere    avec --restaurer ou --pousser : `poste`, `coffre`, ou `CLE:poste,CLE2:coffre` — le CHOIX explicite
 *                qui tranche un conflit de valeur que la base ne tranche pas (garde D-208). Le hook ne le passe jamais ;
 *   --verifier   le juge (défaut) : RP1 manifeste valide · RP2 aucun secret déclaré · RP3 canal joignable
 *                sur ce poste · RP4 aucun écart non restauré · RP5 envoi actif sous feu vert consigné ·
 *                RP6 rien de ce que le canal poserait n'est commitable (TF-2441) · RP7 un feu vert de
 *                publication consigné au ledger qui vise un dossier synchronisé a son manifeste (TF-2623) ·
 *                RP8 une base dérivée ignorée par git est copiée, régénérée ou écartée à dessein (TF-2680) ·
 *                RP9 chaque clé de `secrets.cles_attendues` est présente et non vide au poste ET au coffre
 *                (D-224 (a), R-2 du diagnostic 20261121c : deux copies également incomplètes ne passent plus) ·
 *                RP10 le coffre et la mémoire sont hors du périmètre que le canal copie, et disjoints.
 *                Avec `secrets` ou `memoire`, RP3, RP4 et RP6 jugent aussi le coffre et la mémoire : un constat
 *                de plus par flux, préfixé « coffre : » ou « mémoire : », champ `flux`.
 *   Options : --racine <produit> (défaut : dossier courant), --budget <secondes>, --etat <dossier>,
 *   --profil <dossier de configuration Claude> (défaut : CLAUDE_CONFIG_DIR, sinon ~/.claude, lib-config-installee).
 *
 * DÉCISION FICHIER PAR FICHIER. Un état par poste et par produit, HORS du dépôt
 * (~/.digit-ai-forge/reprise/), garde l'empreinte de chaque fichier à la dernière synchronisation :
 *   - mêmes contenus des deux côtés → rien ;
 *   - seul le canal a changé depuis l'état → il se restaure ; seul le poste a changé → il se pousse ;
 *   - les deux ont changé, ou aucun état (premier passage sur ce poste) → le plus récent gagne, et la
 *     version écrasée est gardée en sauvegarde sous ~/.digit-ai-forge/reprise/sauvegardes/.
 *   La copie reporte la date de la source : après synchronisation, les deux côtés sont à égalité.
 *   Une restauration REFUSE de poser un fichier que git ni n'ignore ni ne suit (TF-2441, RT-150) : un
 *   dossier ignoré puis renommé revient du canal sous son ancien nom, que .gitignore ne couvre plus, et
 *   ses fichiers deviendraient commitables. Le refus se dit (`refuses`, RP6) ; son remède est de garder
 *   l'ancien chemin dans .gitignore. Un fichier déjà suivi par git se met à jour sans exposition nouvelle.
 *
 * EXCLUSIONS DURES, dans les deux sens : un secret ne transite jamais par le canal (garde-fou « les
 * .env ne transitent jamais », CLAUDE.md du pilot) — .env*, clés, certificats, coffres, fichiers dont
 * le nom porte secret, credential ou password, jetons en .token —, ni .git/ ni node_modules/.
 *
 * LE COFFRE DE SECRETS (D-224 (a) du 21/11/2026, qui remplace l'exception D-208 (a) du 12/11/2026). Le fait
 * (diagnostic 20261121c) : 4 mécanismes maison chez les produits, 9 fichiers de secrets sur 13 tenus par aucun
 * script, et un coffre à 2 clés de moins que le produit n'en exige dont le juge rendait PASS. Le coffre vit à
 * côté du canal, jamais dedans (RP10). Chaque fichier de `secrets.fichiers` se fusionne CLÉ PAR CLÉ avec sa
 * copie du coffre par `fusionner()` de `scripts/fusionner-env.mjs` :
 *   - une clé d'un seul côté passe de l'autre (union : aucune clé ne se perd, `clesPerdues` confronte chaque
 *     écriture au fichier relu juste avant ; écriture par un fichier temporaire voisin, puis renommage) ;
 *   - deux valeurs différentes : la BASE tranche — l'empreinte sha256 de chaque valeur à la dernière
 *     synchronisation de ce poste (`<cle>-secrets.json` du dossier d'état, jamais une valeur) ; la valeur qui a
 *     changé depuis la base gagne ;
 *   - sans base qui tranche (premier passage, ou les deux côtés ont changé) : REFUS du fichier entier, les clés
 *     nommées, rien n'est écrit — jamais de conflit tranché sans choix (garde D-208) ; `--prefere` est ce choix.
 *   Le fichier du poste doit être ignoré par git (`refusGit`) et ne jamais vivre sous le pilot (`dansLePilot`) ;
 *   le coffre vit hors du produit, du pilot et de tout dépôt git. Un fichier qui porte une ligne ni clé, ni
 *   commentaire, ni vide (valeur sur plusieurs lignes) est refusé : la fusion clé par clé la perdrait.
 *   JAMAIS UNE VALEUR : sorties, messages, état et compte rendu ne portent que des noms de clés et des comptes.
 *
 * LA MÉMOIRE CLAUDE DU PROJET (D-224 (a)) : `<profil>/projects/<racine du produit, non alphanumériques en
 * « - »>/memory`, le profil étant celui de la session (`racineConfigInstallee` : CLAUDE_CONFIG_DIR, sinon
 * ~/.claude). Un poste à deux profils (~/.claude et ~/.claude-b) : chaque profil se synchronise quand une de
 * ses sessions joue le hook, avec sa propre base, et les deux convergent par le même dossier MEMOIRE-CLAUDE.
 * Décision fichier par fichier, la règle d'empreinte du canal ; seul l'index MEMORY.md, en conflit, prend
 * l'union de ses lignes au lieu du plus récent, l'autre version restant sauvegardée. Les exclusions dures
 * s'appliquent : une note dont le nom ressemble à un secret reste sur son poste, et le compte rendu la nomme.
 *
 * NON JUGÉ, et c'est déclaré :
 *   - une SUPPRESSION ne se propage pas : un fichier effacé d'un côté revient de l'autre ;
 *   - ce que le canal fait du fichier une fois déposé (versions, partage) relève du fournisseur ;
 *   - deux postes qui écrivent le même fichier dans la même minute : le plus récent gagne, l'autre
 *     reste en sauvegarde, sans fusion de contenu ;
 *   - la validité d'un secret, et tout ce que la liste `NON_JUGE` ci-dessous déclare pour le coffre et la mémoire.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, utimesSync, renameSync, unlinkSync } from "node:fs";
import { join, resolve, dirname, sep, relative, isAbsolute, basename, posix } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { empreinteBinaire } from "../scripts/lib-empreinte.mjs";
import { analyser, fusionner, clesPerdues, refusGit, dansLePilot } from "../scripts/fusionner-env.mjs";
import { racineConfigInstallee } from "../scripts/lib-config-installee.mjs";

export const VERSION = "1.4.0";
export const MANIFESTE = join("forge", "REPRISE.json");

// Un motif par ligne : `*` vaut n'importe quel nom sans séparateur, et un motif sans « / » juge le
// NOM du fichier ou d'un de ses dossiers, à toute profondeur.
export const EXCLUSIONS_DURES = [
  ".env", ".env.*", "*.env", "*.pem", "*.key", "*.pfx", "*.p12", "*.kdbx", "id_rsa*", "id_ed25519*",
  "*secret*", "*credential*", "*.token", "*password*", "*motdepasse*", "*mot-de-passe*",
  ".git", "node_modules", ".reprise-*",
];

const versRegex = (motif) => new RegExp("^" + motif.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]") + "$", "i");
export function estExclu(rel, exclusions = []) {
  const parts = rel.replaceAll("\\", "/").split("/");
  for (const m of [...EXCLUSIONS_DURES, ...exclusions]) {
    const re = versRegex(m.replaceAll("\\", "/"));
    if (m.includes("/") ? re.test(parts.join("/")) : parts.some((p) => re.test(p))) return m;
  }
  return null;
}

const developper = (p) => String(p)
  .replace(/^~(?=$|[\\/])/, homedir())
  .replace(/%([A-Z0-9_]+)%/gi, (t, v) => process.env[v] ?? t)
  .replace(/\$\{?([A-Z0-9_]+)\}?/gi, (t, v) => process.env[v] ?? t);

export function lireManifeste(racine) {
  const f = join(racine, MANIFESTE);
  if (!existsSync(f)) return { absent: true };
  try { return { m: JSON.parse(readFileSync(f, "utf8").replace(/^﻿/, "")) }; }
  catch (e) { return { erreur: `${MANIFESTE} illisible : ${e.message}` }; }
}

export function defautsManifeste(m) {
  const d = [];
  if (!m || typeof m !== "object") return ["le manifeste n'est pas un objet JSON"];
  if (m.schema !== "factory/reprise@1") d.push("« schema » vaut « factory/reprise@1 »");
  const c = m.canal || {};
  if (!(Array.isArray(c.chemins) && c.chemins.length) && !process.env.REPRISE_CANAL) d.push("« canal.chemins » nomme au moins un emplacement du dossier synchronisé");
  if (!Array.isArray(m.elements) || !m.elements.length) d.push("« elements » nomme au moins un chemin du produit à reprendre");
  else for (const e of m.elements)
    if (typeof e !== "string" || !e.trim() || /^([a-z]:|[\\/])/i.test(e) || e.split(/[\\/]/).includes("..")) d.push(`élément « ${e} » : un chemin RELATIF au produit, sans « .. »`);
  if (m.exclusions !== undefined && !Array.isArray(m.exclusions)) d.push("« exclusions » est une liste de motifs");
  if (m.regenerer !== undefined) {
    if (!Array.isArray(m.regenerer)) d.push("« regenerer » est une liste de { commande, produit }");
    else for (const r of m.regenerer) {
      if (!r || typeof r !== "object" || typeof r.commande !== "string" || !r.commande.trim()) d.push(`« regenerer » : ${JSON.stringify(r)} n'est pas un objet { commande, produit } à commande non vide`);
      else if (typeof r.produit !== "string" || !r.produit.trim() || /^([a-z]:|[\\/])/i.test(r.produit) || r.produit.split(/[\\/]/).includes("..")) d.push(`« regenerer » : le produit de « ${r.commande} » est un chemin RELATIF au produit, sans « .. »`);
    }
  }
  // D-224 (a) : le coffre et la mémoire. Un constat ne recopie jamais une entrée de `cles_attendues` : une entrée qui
  // n'est pas un nom de clé est peut-être une valeur collée par erreur ; elle se désigne par son rang.
  const chemins = (c) => Array.isArray(c) && c.length > 0 && c.every((x) => typeof x === "string" && x.trim());
  if (m.secrets !== undefined) {
    const s = m.secrets;
    if (!s || typeof s !== "object" || Array.isArray(s)) d.push("« secrets » est un objet { fichiers, chemins, cles_attendues }");
    else {
      if (!Array.isArray(s.fichiers) || !s.fichiers.length) d.push("« secrets.fichiers » nomme au moins un fichier d'environnement du produit, ex. « .env »");
      else for (const f of s.fichiers) {
        if (!cheminRelatif(f)) d.push(`« secrets.fichiers » : « ${f} » est un chemin RELATIF au produit, sans « .. »`);
        else if (!FICHIER_ENV.test(basename(f)) || MODELE_ENV.test(f)) d.push(`« secrets.fichiers » : « ${f} » n'est pas un fichier d'environnement (« .env », « .env.<suffixe> » ou « <nom>.env », hors modèles versionnés .example, .sample, .template) : le coffre fusionne clé par clé, il ne porte que ces fichiers`);
      }
      if (!chemins(s.chemins)) d.push("« secrets.chemins » nomme au moins un emplacement du coffre, un par poste, ex. « G:/Mon Drive/<Produit> - Reprise/SECRETS »");
      if (!Array.isArray(s.cles_attendues) || !s.cles_attendues.length) d.push("« secrets.cles_attendues » nomme au moins une clé que le produit exige : des NOMS, jamais une valeur");
      else s.cles_attendues.forEach((k, i) => { if (typeof k !== "string" || !NOM_CLE.test(k)) d.push(`« secrets.cles_attendues » : l'entrée n° ${i + 1} n'est pas un nom de clé (lettres, chiffres, « _ », « . », « - ») ; elle n'est pas recopiée ici, une valeur s'y est peut-être glissée`); });
    }
  }
  if (m.memoire !== undefined && !(m.memoire && typeof m.memoire === "object" && !Array.isArray(m.memoire) && chemins(m.memoire.chemins)))
    d.push("« memoire » est un objet { chemins } qui nomme au moins un emplacement du dossier MEMOIRE-CLAUDE, un par poste");
  return d;
}

// ---- D-224 (a) : formes admises du coffre ----
/** Un nom de clé, la forme que lit `analyser()` de fusionner-env. */
export const NOM_CLE = /^[A-Za-z_][A-Za-z0-9_.-]*$/;
/** Un fichier d'environnement : `.env`, `.env.<suffixe>` ou `<nom>.env`. */
export const FICHIER_ENV = /^(\.env(\.[^\\/]+)?|[^\\/]+\.env)$/i;
const MODELE_ENV = /\.(example|sample|template|dist)$/i;
const cheminRelatif = (p) => typeof p === "string" && !!p.trim() && !/^([a-z]:|[\\/])/i.test(p) && !p.split(/[\\/]/).includes("..");

// TF-2680 (factory-digit-ai-fr 20261115zb) : une base dérivée, ignorée par git, ne voyage ni par git ni par le canal. Le 15/11/2026,
// sur un poste neuf restauré par le canal, data/site-v2.db était créée vide au démarrage local : 13 pages de forge rendaient 404 sans
// erreur, et seule l'image Docker savait la régénérer. Le manifeste porte donc `regenerer` : { commande, produit }, la commande étant
// rejouée à la restauration, depuis la racine du produit, quand `produit` manque ou est vide.
export const MOTIFS_BASES = ["*.db", "*.sqlite", "*.sqlite3", "*.duckdb"];
const etatBase = (racine, rel) => { try { const st = statSync(join(racine, rel)); return st.isFile() ? (st.size > 0 ? "présente" : "vide") : "absente"; } catch { return "absente"; } };

/** Rejoue la commande de chaque base absente ou vide ; rend [{ commande, produit, ok, detail }]. Jamais de sortie de la commande, hors la fin de son erreur. */
export function regenererBases(racine, m, restantMs = 200000) {
  const debut = Date.now(), rendu = [];
  for (const r of m.regenerer || []) {
    if (etatBase(racine, r.produit) === "présente") continue;
    const reste = restantMs - (Date.now() - debut);
    if (reste <= 0) { rendu.push({ commande: r.commande, produit: r.produit, ok: false, detail: "budget de temps atteint, reporté au prochain passage" }); continue; }
    const p = spawnSync(r.commande, { cwd: racine, shell: true, encoding: "utf8", timeout: Math.max(5000, reste), maxBuffer: 16 * 1024 * 1024 });
    const apres = etatBase(racine, r.produit);
    if (p.status === 0 && apres === "présente") { rendu.push({ commande: r.commande, produit: r.produit, ok: true }); continue; }
    const cause = p.error ? String(p.error.code || p.error.message) : p.status !== 0 ? `exit ${p.status}` : `${r.produit} reste ${apres}`;
    rendu.push({ commande: r.commande, produit: r.produit, ok: false, detail: `${cause}${p.stderr ? " : " + String(p.stderr).trim().slice(-160) : ""}` });
  }
  return rendu;
}

/** Les bases (.db, .sqlite…) que git ignore sur ce poste : { toutes, orphelines }, les orphelines étant celles que le manifeste ne couvre pas (ni élément, ni exclusion, ni régénération). */
export function basesIgnoreesDeGit(racine, m) {
  const env = { ...process.env };
  for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[k];
  const r = spawnSync("git", ["-C", racine, "ls-files", "-z", "--others", "--ignored", "--exclude-standard", "--", ...MOTIFS_BASES], { encoding: "utf8", env, maxBuffer: 256 * 1024 * 1024 });
  if (r.status !== 0) return { toutes: [], orphelines: [] };
  const elements = (m.elements || []).map((e) => e.replaceAll("\\", "/").replace(/\/+$/, ""));
  const produits = new Set((m.regenerer || []).map((x) => String(x.produit).replaceAll("\\", "/")));
  const toutes = r.stdout.split("\0").filter(Boolean).filter((rel) => !estExclu(rel, []));
  return { toutes, orphelines: toutes.filter((rel) => !estExclu(rel, m.exclusions || []) && !produits.has(rel) && !elements.some((e) => rel === e || rel.startsWith(e + "/"))) };
}

export const goComplet = (m) => {
  const g = m?.envoi?.go_publication;
  return !!(g && typeof g === "object" && String(g.decision || "").trim() && /^\d{4}-\d{2}-\d{2}$/.test(String(g.date || "")) && String(g.par || "").trim());
};

// TF-2623 (RP-30, lot Produit-79 20261112f) : un feu vert de publication consigné au ledger qui vise un dossier
// synchronisé est le signe d'un canal de reprise que personne n'a déclaré. Le 12/11/2026, un dossier Drive de reprise
// existait depuis le 11/10 ; go_publication aux seq 793 et 1178 ; aucun manifeste, donc un hook muet et RP4 rouge au
// premier passage. Le signe se lit dans le texte de l'entrée (cible, détail, citation), par les noms des fournisseurs.
export const FOURNISSEURS_SYNCHRONISES = /google\s*drive|\bdrive\b|onedrive|dropbox|sharepoint|icloud|dossier\s+synchronis/i;

/** Les entrées `go_publication` du ledger du produit dont le texte nomme un dossier synchronisé : [{ seq, citation }]. */
export function goVersDossierSynchronise(racine) {
  const trouves = [];
  for (const rel of [join("forge", "ledger.jsonl"), "ledger.jsonl"]) {
    const f = join(racine, rel);
    if (!existsSync(f)) continue;
    let texte = "";
    try { texte = readFileSync(f, "utf8"); } catch { continue; }
    for (const ligne of texte.split(/\r?\n/)) {
      if (!ligne.trim()) continue;
      let e; try { e = JSON.parse(ligne); } catch { continue; }
      if (e?.type === "go_publication" && FOURNISSEURS_SYNCHRONISES.test(ligne)) trouves.push({ seq: e.seq, citation: String(e.citation || "") });
    }
    if (trouves.length) break;
  }
  return trouves;
}
const listeSeq = (go) => go.map((g) => g.seq).join(", ");

export function resoudreCanal(m) {
  const candidats = [process.env.REPRISE_CANAL, ...((m?.canal?.chemins) || [])].filter(Boolean).map(developper);
  return { canal: candidats.find((c) => { try { return statSync(c).isDirectory(); } catch { return false; } }) || null, candidats };
}

function parcourir(base, rel, exclusions, sortie, exclus) {
  const abs = join(base, rel);
  let st; try { st = statSync(abs); } catch { return; }
  if (rel && estExclu(rel, exclusions)) { if (exclus) exclus.push(rel.replaceAll("\\", "/")); return; }
  if (st.isDirectory()) {
    for (const n of readdirSync(abs)) parcourir(base, rel ? join(rel, n) : n, exclusions, sortie, exclus);
  } else if (st.isFile()) sortie.set(rel.replaceAll("\\", "/"), { taille: st.size, mtime: Math.floor(st.mtimeMs) });
}
/** `exclus` (facultatif) reçoit les chemins écartés par une exclusion : la mémoire les nomme au compte rendu. */
export function inventaire(base, elements, exclusions, exclus) {
  const sortie = new Map();
  for (const e of elements) parcourir(base, e.replaceAll("/", sep), exclusions, sortie, exclus);
  return sortie;
}

// Les OCTETS exacts, par la fonction partagée du brut (references/EMPREINTES.md) : une synchronisation
// copie des octets, et un fichier passé de LF à CRLF a changé pour le poste qui le reçoit.
const empreinte = (f) => empreinteBinaire(f, 16);
const cleProduit = (racine) => createHash("sha256").update(resolve(racine).toLowerCase()).digest("hex").slice(0, 12);
const dossierEtat = (opt) => opt.etat || process.env.REPRISE_ETAT || join(homedir(), ".digit-ai-forge", "reprise");
function lireEtat(racine, opt) {
  try { return JSON.parse(readFileSync(join(dossierEtat(opt), `${cleProduit(racine)}.json`), "utf8")); } catch { return { fichiers: {} }; }
}
function ecrireEtat(racine, opt, etat) {
  mkdirSync(dossierEtat(opt), { recursive: true });
  writeFileSync(join(dossierEtat(opt), `${cleProduit(racine)}.json`), JSON.stringify({ ...etat, produit: resolve(racine), ecrit: new Date().toISOString() }, null, 1));
}

// L'empreinte d'un côté se relit seulement quand sa taille ou sa date a bougé depuis l'état : un
// produit de 9 662 fichiers ne se rehache pas à chaque fin de tour.
function sha(cote, rel, info, base, connu) {
  if (connu && connu.taille === info.taille && connu.mtime === info.mtime) return connu.sha;
  return empreinte(join(base, rel));
}

/**
 * Parmi des chemins relatifs au produit, ceux qu'un `git add .` du produit prendrait : ni suivis, ni
 * ignorés (TF-2441, RT-150). Un dossier ignoré puis renommé revient du canal sous son ancien nom, que
 * `.gitignore` ne couvre plus : poser ses fichiers les rend commitables. Un fichier SUIVI se met à jour
 * sans exposition nouvelle ; seul le fichier ni suivi ni ignoré est refusé.
 * Rend null quand le produit n'est pas un dépôt git (rien à juger, déclaré au NON_JUGE).
 */
export function visiblesDeGit(racine, rels) {
  const env = { ...process.env };
  for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[k];
  const git = (args, input) => spawnSync("git", ["-C", racine, ...args], { encoding: "utf8", env, input, maxBuffer: 256 * 1024 * 1024 });
  const dedans = git(["rev-parse", "--is-inside-work-tree"]);
  if (dedans.status !== 0 || dedans.stdout.trim() !== "true") return null;
  if (!rels.length) return new Set();
  const suivis = git(["ls-files", "-z"]);
  const ignores = git(["check-ignore", "-z", "--stdin"], rels.join("\0") + "\0");
  // check-ignore : 0 = au moins un ignoré, 1 = aucun ; 128 = erreur, auquel cas on ne peut rien affirmer
  if (suivis.status !== 0 || (ignores.status !== 0 && ignores.status !== 1)) return null;
  const poses = new Set([...suivis.stdout.split("\0"), ...ignores.stdout.split("\0")].filter(Boolean));
  return new Set(rels.filter((r) => !poses.has(r)));
}

/** La règle d'empreinte du canal, fichier par fichier : partagée par le canal et la mémoire Claude (D-224 (a)). */
function decider(loc, can, fichiers, baseLoc, baseCan) {
  const plan = [];
  for (const rel of new Set([...loc.keys(), ...can.keys()])) {
    const l = loc.get(rel), c = can.get(rel), e = fichiers[rel];
    if (l && !c) { plan.push({ rel, sens: "pousser", motif: "absent du canal" }); continue; }
    if (c && !l) { plan.push({ rel, sens: "restaurer", motif: "absent de ce poste" }); continue; }
    const sl = sha("l", rel, l, baseLoc, e?.local), sc = sha("c", rel, c, baseCan, e?.canal);
    if (sl === sc) { plan.push({ rel, sens: "egal", sl, sc, l, c }); continue; }
    if (e && sl === e.sha) plan.push({ rel, sens: "restaurer", motif: "le canal a changé" });
    else if (e && sc === e.sha) plan.push({ rel, sens: "pousser", motif: "ce poste a changé" });
    else plan.push({ rel, sens: c.mtime > l.mtime ? "restaurer" : "pousser", motif: e ? "les deux côtés ont changé, le plus récent gagne" : "premier passage sur ce poste, le plus récent gagne", conflit: true });
  }
  return plan;
}

/** Calcule ce que chaque fichier demande, sans rien écrire. */
export function planifier(racine, canal, m, opt = {}) {
  const exclusions = m.exclusions || [];
  const loc = inventaire(racine, m.elements, exclusions);
  const can = inventaire(canal, m.elements, exclusions);
  const etat = lireEtat(racine, opt);
  const plan = decider(loc, can, etat.fichiers, racine, canal);
  // Ce que le canal poserait sur ce poste sans que git l'ignore ni le suive : refusé (TF-2441).
  const visibles = visiblesDeGit(racine, plan.filter((p) => p.sens === "restaurer").map((p) => p.rel));
  if (visibles) for (const p of plan) if (p.sens === "restaurer" && visibles.has(p.rel)) p.refus = "non ignoré par git : le poser le rendrait commitable";
  return { plan, etat, git: visibles !== null };
}

function copier(src, dst, sauvegarde) {
  mkdirSync(dirname(dst), { recursive: true });
  if (sauvegarde && existsSync(dst)) { mkdirSync(dirname(sauvegarde), { recursive: true }); copyFileSync(dst, sauvegarde); }
  copyFileSync(src, dst);
  const st = statSync(src); utimesSync(dst, st.atime, st.mtime);
}

/** Applique le plan dans un sens ; rend le compte de ce qui a été fait et de ce qui reste. */
export function synchroniser(racine, sens, opt = {}) {
  const lu = lireManifeste(racine);
  if (lu.absent) {
    const go = goVersDossierSynchronise(racine);
    return { sans_objet: true, message: "aucun canal de reprise déclaré (forge/REPRISE.json absent)", ...(go.length ? { go_sans_manifeste: go } : {}) };
  }
  if (lu.erreur) return { erreur: lu.erreur };
  const m = lu.m, defauts = defautsManifeste(m);
  if (defauts.length) return { erreur: `manifeste invalide : ${defauts.join(" ; ")}` };
  if (sens === "pousser" && !(m.envoi?.actif && goComplet(m)))
    return { refuse: true, message: m.envoi?.actif ? "envoi actif sans feu vert de publication complet (decision, date, par) — rien n'est parti (R-38)" : "envoi non actif — rien ne part vers le canal" };
  // D-224 (a) : le coffre et la mémoire passent avant le canal, qui peut épuiser le budget ; un flux en panne n'arrête pas les autres.
  const flux = {};
  const panne = (quoi, e) => ({ erreur: `${quoi} : ${String(e?.code || e?.message || e).slice(0, 200)}` });
  if (m.secrets) { try { flux.secrets = synchroniserSecrets(racine, sens, m, opt); } catch (e) { flux.secrets = panne("coffre", e); } }
  if (m.memoire) { try { flux.memoire = synchroniserMemoire(racine, sens, m, opt); } catch (e) { flux.memoire = panne("mémoire", e); } }
  const { canal, candidats } = resoudreCanal(m);
  if (!canal) return { erreur: `canal introuvable sur ce poste (essayés : ${candidats.join(" ; ") || "aucun"}) — installer le client de synchronisation, ou exporter REPRISE_CANAL`, ...flux };
  const debut = Date.now(), budget = (opt.budget ?? 200) * 1000;
  const { plan, etat } = planifier(racine, canal, m, opt);
  const horodate = new Date().toISOString().replace(/[:.]/g, "-");
  const fait = [], conflits = [], refuses = [];
  let reste = 0;
  for (const p of plan) {
    if (p.sens === "egal") {
      etat.fichiers[p.rel] = { sha: p.sl, local: { ...p.l, sha: p.sl }, canal: { ...p.c, sha: p.sc } };
      continue;
    }
    if (p.sens !== sens) continue;
    if (p.refus) { refuses.push({ rel: p.rel, motif: p.refus }); continue; }
    if (Date.now() - debut > budget) { reste++; continue; }
    const [src, dst] = sens === "restaurer" ? [join(canal, p.rel), join(racine, p.rel)] : [join(racine, p.rel), join(canal, p.rel)];
    const sauvegarde = p.conflit ? join(dossierEtat(opt), "sauvegardes", cleProduit(racine), horodate, sens === "restaurer" ? "poste" : "canal", p.rel) : null;
    copier(src, dst, sauvegarde);
    const s = empreinte(dst), st = statSync(dst), info = { taille: st.size, mtime: Math.floor(st.mtimeMs), sha: s };
    etat.fichiers[p.rel] = { sha: s, local: info, canal: info };
    fait.push(p.rel);
    if (p.conflit) conflits.push({ rel: p.rel, motif: p.motif, sauvegarde });
  }
  ecrireEtat(racine, opt, etat);
  // TF-2680 : après la copie, les bases dérivées que le canal ne porte pas se régénèrent (restauration seulement).
  const regenere = sens === "restaurer" ? regenererBases(racine, m, budget - (Date.now() - debut)) : [];
  return { canal, sens, fait, conflits, refuses, regenere, reste, egaux: plan.filter((p) => p.sens === "egal").length, a_faire_autre_sens: plan.filter((p) => p.sens !== "egal" && p.sens !== sens).length, ...flux };
}

// =====================================================================================================
// D-224 (a) du 21/11/2026 : LE COFFRE DE SECRETS, CLÉ PAR CLÉ, ET LA MÉMOIRE CLAUDE DU PROJET
// =====================================================================================================

const sansVariablesGit = () => { const env = { ...process.env }; for (const k of ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete env[k]; return env; };
/** Le chemin d'`enfant` relatif à `parent` (« / »), "" s'ils sont égaux, null si `enfant` est hors de `parent`. */
export function dedans(parent, enfant) {
  const r = relative(resolve(parent), resolve(enfant));
  if (r === "") return "";
  return r === ".." || r.startsWith(".." + sep) || r.startsWith("../") || isAbsolute(r) ? null : r.replaceAll("\\", "/");
}

/** Le premier emplacement joignable : un dossier qui existe, sinon un dossier dont le parent existe (il naît au premier envoi). */
export function resoudreDossier(chemins) {
  const candidats = (chemins || []).filter(Boolean).map((c) => resolve(developper(c)));
  const estDossier = (c) => { try { return statSync(c).isDirectory(); } catch { return false; } };
  const present = candidats.find(estDossier);
  if (present) return { dossier: present, existe: true, candidats };
  return { dossier: candidats.find((c) => estDossier(dirname(c))) || null, existe: false, candidats };
}

/** null, ou ce qui interdit d'y poser des secrets ou la mémoire : sous le pilot, dans le produit, dans un dépôt git. */
export function gardeDossier(dossier, racine) {
  if (dansLePilot(join(dossier, "x"))) return "il est sous le pilot, qui ne porte aucun fichier d'environnement";
  if (dedans(racine, dossier) !== null) return "il est dans le produit : il vit sur le dossier synchronisé, hors du dépôt";
  let d = resolve(dossier);
  while (!existsSync(d) && dirname(d) !== d) d = dirname(d);
  const r = spawnSync("git", ["-C", d, "rev-parse", "--is-inside-work-tree"], { encoding: "utf8", env: sansVariablesGit() });
  if (r.status === 0 && r.stdout.trim() === "true") return "il est dans un dépôt git, qu'un `git add` embarquerait";
  return null;
}

/**
 * null quand le fichier du poste peut porter des secrets ; sinon le motif du refus. `dansLePilot` et `refusGit` de
 * fusionner-env ; quand le dossier du fichier n'existe pas encore sur ce poste, `refusGit` ne peut pas juger depuis
 * lui, et git juge le chemin depuis la racine du produit : un `stats/.env` qui naîtrait non ignoré est refusé aussi.
 */
export function refusPoste(racine, rel) {
  const chemin = join(racine, rel);
  if (dansLePilot(chemin)) return `${rel} est sous le pilot : le pilot ne porte aucun fichier d'environnement (.env jamais transmis)`;
  if (existsSync(dirname(chemin))) return refusGit(chemin);
  const env = sansVariablesGit();
  const depot = spawnSync("git", ["-C", racine, "rev-parse", "--is-inside-work-tree"], { encoding: "utf8", env });
  if (depot.status !== 0 || depot.stdout.trim() !== "true") return null;
  if (spawnSync("git", ["-C", racine, "check-ignore", "-q", "--", rel.replaceAll("\\", "/")], { encoding: "utf8", env }).status === 0) return null;
  return `${rel} n'est PAS ignoré par git : y mettre des secrets, c'est être à un commit de l'histoire. Ajouter le motif au .gitignore du produit (gabarits/gitignore-produit du pilot porte .env et .env.*), puis rejouer`;
}

/** `--prefere poste|coffre|CLE:poste,CLE2:coffre` → (clé) → "poste" | "coffre" | undefined ; null si la forme est fausse. */
export function lirePrefere(texte) {
  const t = String(texte ?? "").trim();
  if (t === "poste" || t === "coffre") return () => t;
  const choix = new Map();
  for (const morceau of t.split(",")) {
    const x = /^([A-Za-z_][A-Za-z0-9_.-]*):(poste|coffre)$/.exec(morceau.trim());
    if (!x) return null;
    choix.set(x[1], x[2]);
  }
  return choix.size ? (k) => choix.get(k) : null;
}

// L'empreinte d'une VALEUR de secret, jamais la valeur : la base qui tranche un conflit (references/EMPREINTES.md).
const empreinteValeur = (v) => createHash("sha256").update(String(v), "utf8").digest("hex");
// Un BOM en tête (éditeur Windows) masquerait la première clé : il se retire à la lecture, écrit en ASCII pour rester visible.
const lireEnv = (f) => { try { const t = readFileSync(f, "utf8"); return t.charCodeAt(0) === 0xfeff ? t.slice(1) : t; } catch { return ""; } };
const lignesNonCles = (texte) => analyser(texte).lignes.filter((l) => !l.nom && l.brut.trim() && !l.brut.trim().startsWith("#")).map((l) => l.i + 1);
const cache = (objet, champs) => { for (const [k, v] of Object.entries(champs)) Object.defineProperty(objet, k, { value: v, enumerable: false }); return objet; };

// L'état du coffre et de la mémoire, à côté de celui du canal ; droits 0600, écriture par un fichier temporaire renommé.
const fichierEtatFlux = (racine, opt, flux) => join(dossierEtat(opt), `${cleProduit(racine)}-${flux}.json`);
function lireEtatFlux(racine, opt, flux) {
  try { return JSON.parse(readFileSync(fichierEtatFlux(racine, opt, flux), "utf8")); } catch { return {}; }
}
function ecrireEtatFlux(racine, opt, flux, etat) {
  const f = fichierEtatFlux(racine, opt, flux), tmp = `${f}.${process.pid}.tmp`;
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(tmp, JSON.stringify({ ...etat, produit: resolve(racine), ecrit: new Date().toISOString() }, null, 1), { encoding: "utf8", mode: 0o600 });
  renameSync(tmp, f);
}

/**
 * Ce que demande UN fichier d'environnement entre ce poste et le coffre, clé par clé, sans rien écrire.
 * `base` : { CLE: sha256 de la valeur } à la dernière synchronisation de ce poste. Le compte rendu ne porte que des
 * noms ; les textes (le fusionné et les deux lus) sont des propriétés NON énumérables, qu'aucune sortie JSON n'emporte.
 */
export function planifierSecret(racine, coffre, rel, base = {}, prefere = null) {
  const r0 = { fichier: rel };
  const refus = refusPoste(racine, rel);
  if (refus) return { ...r0, refus, garde: "git" };
  const poste = join(racine, rel), distant = join(coffre, rel);
  if (!existsSync(poste) && !existsSync(distant)) return { ...r0, absent: true };
  const tP = lireEnv(poste), tC = lireEnv(distant);
  const malP = lignesNonCles(tP), malC = lignesNonCles(tC);
  if (malP.length || malC.length)
    return { ...r0, garde: "lecture", refus: `${rel} porte des lignes qui ne sont ni une clé, ni un commentaire, ni vides (${[malP.length ? `poste : ligne(s) ${malP.join(", ")}` : "", malC.length ? `coffre : ligne(s) ${malC.join(", ")}` : ""].filter(Boolean).join(" ; ")}) : la fusion clé par clé les perdrait, rien n'est écrit — une clé par ligne, sa valeur sur la même ligne` };
  const P = analyser(tP), C = analyser(tC);
  const gagnants = {}, sansBase = [], choix = [], baseApres = { ...base };
  for (const [k, lp] of P.cles) {
    const lc = C.cles.get(k);
    if (!lc || lc.valeur === lp.valeur) continue;
    const hp = empreinteValeur(lp.valeur), hc = empreinteValeur(lc.valeur);
    const voulu = prefere ? prefere(k) : undefined;
    // Le choix explicite devient la base : la valeur écartée est tenue pour l'ancienne, et la règle à trois points fait le reste.
    if (voulu) { baseApres[k] = voulu === "poste" ? hc : hp; choix.push(k); }
    if (baseApres[k] === hp) gagnants[k] = "coffre";
    else if (baseApres[k] === hc) gagnants[k] = "poste";
    else sansBase.push(k);
  }
  const compte = {
    ...r0,
    cles_au_coffre_seul: [...C.cles.keys()].filter((k) => !P.cles.has(k)),
    cles_au_poste_seul: [...P.cles.keys()].filter((k) => !C.cles.has(k)),
    pris_du_coffre: Object.keys(gagnants).filter((k) => gagnants[k] === "coffre"),
    pris_du_poste: Object.keys(gagnants).filter((k) => gagnants[k] === "poste"),
    identiques: [...P.cles.keys()].filter((k) => C.cles.has(k) && C.cles.get(k).valeur === P.cles.get(k).valeur).length,
    conflits_sans_base: sansBase, choix,
  };
  if (sansBase.length) {
    const outil = fileURLToPath(import.meta.url);
    return { ...compte, garde: "conflit", refus: `${sansBase.length} clé(s) portent deux valeurs différentes au poste et au coffre, et aucune synchronisation passée ne dit laquelle a changé (${sansBase.join(", ")}) : rien n'est écrit pour ${rel}, aucun conflit ne se tranche sans choix (garde D-208). Le choix, humain : \`node "${outil}" --racine "${resolve(racine)}" --restaurer --prefere ${sansBase[0]}:poste\` (la valeur de ce poste gagne) ou \`${sansBase[0]}:coffre\` (celle du coffre), une paire CLE:côté par clé, séparées par des virgules` };
  }
  // Le texte du poste, où chaque clé gagnée par le coffre prend la ligne du coffre ; puis l'union de fusionner().
  const lignes = P.lignes.map((l) => (l.nom && gagnants[l.nom] === "coffre" && P.cles.get(l.nom) === l ? C.cles.get(l.nom).brut : l.brut));
  const texte = fusionner(lignes.length ? lignes.join(P.eol) + P.eol : "", tC, { prefere: "poste" }).texte;
  return cache(compte, { texte, tP, tC, baseApres, poste, distant });
}

/** Écrit un fichier d'environnement sans perdre une clé : relu juste avant, confronté à `clesPerdues`, temporaire voisin puis renommage. */
function ecrireEnv(chemin, attendu, texte) {
  const avant = lireEnv(chemin);
  if (avant !== attendu) return "le fichier a changé pendant la synchronisation : rien n'est écrit, le prochain passage le reprend";
  const perdues = clesPerdues(avant, texte);
  if (perdues.length) return `l'écriture lui ôterait ${perdues.length} clé(s) (${perdues.join(", ")}) : rien n'est écrit`;
  mkdirSync(dirname(chemin), { recursive: true });
  const tmp = `${chemin}.reprise-${process.pid}.tmp`;
  try { writeFileSync(tmp, texte, { encoding: "utf8", mode: 0o600 }); renameSync(tmp, chemin); return null; }
  catch (e) { try { unlinkSync(tmp); } catch { /* absent */ } return `écriture impossible (${e.code || "erreur"}) : rien n'est écrit`; }
}

/** Le coffre : chaque fichier de `secrets.fichiers` fusionné clé par clé ; --restaurer n'écrit que le poste, --pousser que le coffre. */
export function synchroniserSecrets(racine, sens, m, opt = {}) {
  const { dossier: coffre, candidats } = resoudreDossier(m.secrets.chemins);
  if (!coffre) return { erreur: `coffre introuvable sur ce poste (essayés : ${candidats.join(" ; ")}) — ajouter l'emplacement de ce poste à « secrets.chemins », ou installer le client de synchronisation` };
  const garde = gardeDossier(coffre, racine);
  if (garde) return { coffre, refus: `coffre refusé, ${garde} : rien n'est lu ni écrit — déclarer dans « secrets.chemins » un dossier du Drive, hors du produit et de tout dépôt` };
  const etat = lireEtatFlux(racine, opt, "secrets");
  etat.fichiers = etat.fichiers || {};
  const fichiers = [];
  for (const rel of m.secrets.fichiers) {
    const p = planifierSecret(racine, coffre, rel, etat.fichiers[rel] || {}, opt.prefere || null);
    if (p.refus || p.absent) { fichiers.push(p); continue; }
    const [cible, avant] = sens === "restaurer" ? [p.poste, p.tP] : [p.distant, p.tC];
    let ecrit = false;
    if (p.texte !== avant) {
      const refus = ecrireEnv(cible, avant, p.texte);
      if (refus) { fichiers.push({ ...p, refus: `${rel} (${sens === "restaurer" ? "poste" : "coffre"}) : ${refus}` }); continue; }
      ecrit = true;
    }
    // La base : la valeur commune aux deux côtés après ce passage ; une clé qui diffère encore garde la sienne (et un choix explicite).
    const AP = analyser(sens === "restaurer" && ecrit ? p.texte : p.tP).cles, AC = analyser(sens === "pousser" && ecrit ? p.texte : p.tC).cles;
    const base = { ...p.baseApres };
    for (const [k, l] of AP) { const c = AC.get(k); if (c && c.valeur === l.valeur) base[k] = empreinteValeur(l.valeur); }
    etat.fichiers[rel] = base;
    fichiers.push({ ...p, ecrit });
  }
  ecrireEtatFlux(racine, opt, "secrets", etat);
  return { coffre, sens, fichiers };
}

/** Le profil Claude de la session : `--profil`, sinon la racine que la session charge (CLAUDE_CONFIG_DIR, sinon ~/.claude). */
export function profilClaude(opt = {}) {
  return opt.profil ? { racine: resolve(opt.profil), decidee_par: `--profil ${opt.profil}` } : racineConfigInstallee();
}
/** La mémoire Claude du projet : `<profil>/projects/<racine, non alphanumériques en « - »>/memory`, casse du dossier existant. */
export function dossierMemoireLocal(racine, profil) {
  const projets = join(profil, "projects"), cle = resolve(racine).replace(/[^A-Za-z0-9]/g, "-");
  let trouve = null;
  try { trouve = readdirSync(projets).find((n) => n.toLowerCase() === cle.toLowerCase()) || null; } catch { /* aucun projet encore */ }
  return join(projets, trouve || cle, "memory");
}
const INDEX_MEMOIRE = /^memory\.md$/i;
/** L'union des lignes de deux index : le texte retenu, puis chaque ligne de l'autre qu'il ne porte pas. */
export function unionLignes(retenu, autre) {
  const eol = retenu.includes("\r\n") ? "\r\n" : "\n";
  const vues = new Set(retenu.split(/\r?\n/).map((l) => l.trimEnd()));
  const ajout = [];
  for (const l of autre.split(/\r?\n/)) if (l.trim() && !vues.has(l.trimEnd())) { vues.add(l.trimEnd()); ajout.push(l); }
  if (!ajout.length) return retenu;
  return (retenu && !/\r?\n$/.test(retenu) ? retenu + eol : retenu) + ajout.join(eol) + eol;
}

/** Ce que la mémoire demande, sans rien écrire : la règle d'empreinte du canal, fichier par fichier. */
export function planifierMemoire(racine, distant, opt = {}, etat = lireEtatFlux(racine, opt, "memoire")) {
  const profil = profilClaude(opt);
  if (!profil.racine) return { erreur: `aucune racine de configuration Claude (${profil.decidee_par})` };
  const local = dossierMemoireLocal(racine, profil.racine);
  const ep = etat.profils?.[resolve(local).toLowerCase()] || { fichiers: {} };
  const exclus = [];
  const loc = inventaire(local, ["."], [], exclus), can = inventaire(distant, ["."], [], exclus);
  return { local, profil: profil.decidee_par, plan: decider(loc, can, ep.fichiers, local, distant), exclus: [...new Set(exclus)], ep };
}

/** La mémoire Claude du projet : --restaurer écrit la mémoire de ce profil, --pousser le dossier MEMOIRE-CLAUDE. */
export function synchroniserMemoire(racine, sens, m, opt = {}) {
  const { dossier: distant, candidats } = resoudreDossier(m.memoire.chemins);
  if (!distant) return { erreur: `dossier de la mémoire introuvable sur ce poste (essayés : ${candidats.join(" ; ")}) — ajouter l'emplacement de ce poste à « memoire.chemins »` };
  const garde = gardeDossier(distant, racine);
  if (garde) return { dossier: distant, refus: `dossier de la mémoire refusé, ${garde} : rien n'est copié` };
  const etat = lireEtatFlux(racine, opt, "memoire");
  const pm = planifierMemoire(racine, distant, opt, etat);
  if (pm.erreur) return { dossier: distant, erreur: pm.erreur };
  const { local, plan, exclus, ep } = pm;
  const debut = Date.now(), budget = (opt.budget ?? 200) * 1000;
  const horodate = new Date().toISOString().replace(/[:.]/g, "-");
  const fait = [], conflits = [], unions = [];
  let reste = 0;
  const info = (f) => { const st = statSync(f); return { taille: st.size, mtime: Math.floor(st.mtimeMs), sha: empreinte(f) }; };
  for (const p of plan) {
    if (p.sens === "egal") { ep.fichiers[p.rel] = { sha: p.sl, local: { ...p.l, sha: p.sl }, canal: { ...p.c, sha: p.sc } }; continue; }
    if (p.sens !== sens) continue;
    if (Date.now() - debut > budget) { reste++; continue; }
    const [src, dst] = sens === "restaurer" ? [join(distant, p.rel), join(local, p.rel)] : [join(local, p.rel), join(distant, p.rel)];
    const sauvegarde = p.conflit ? join(dossierEtat(opt), "sauvegardes", cleProduit(racine), horodate, sens === "restaurer" ? "memoire-poste" : "memoire-canal", p.rel) : null;
    if (p.conflit && INDEX_MEMOIRE.test(basename(p.rel))) {
      // L'index est le seul fichier que Claude charge : le plus récent seul ferait disparaître les entrées de l'autre côté.
      mkdirSync(dirname(sauvegarde), { recursive: true }); copyFileSync(dst, sauvegarde);
      const tmp = `${dst}.${process.pid}.tmp`;
      writeFileSync(tmp, unionLignes(readFileSync(src, "utf8"), readFileSync(dst, "utf8")), "utf8"); renameSync(tmp, dst);
      const iSrc = info(src), iDst = info(dst);
      // La base est la source : au passage suivant, le côté qui porte l'union est « celui qui a changé », et l'union repart vers l'autre.
      ep.fichiers[p.rel] = sens === "restaurer" ? { sha: iSrc.sha, local: iDst, canal: iSrc } : { sha: iSrc.sha, local: iSrc, canal: iDst };
      unions.push(p.rel);
    } else {
      copier(src, dst, sauvegarde);
      const i = info(dst);
      ep.fichiers[p.rel] = { sha: i.sha, local: i, canal: i };
    }
    fait.push(p.rel);
    if (p.conflit) conflits.push({ rel: p.rel, motif: p.motif, sauvegarde });
  }
  etat.profils = { ...(etat.profils || {}), [resolve(local).toLowerCase()]: ep };
  ecrireEtatFlux(racine, opt, "memoire", etat);
  return { dossier: distant, local, profil: pm.profil, sens, fait, conflits, unions, exclus, reste, a_faire_autre_sens: plan.filter((p) => p.sens !== "egal" && p.sens !== sens).length };
}

/** Le juge. */
export function verifier(racine, opt = {}) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const lu = lireManifeste(racine);
  if (lu.absent) {
    findings.push({ regle: "RP1", statut: "SANS_OBJET", message: "aucun canal de reprise déclaré (forge/REPRISE.json absent) — rien à juger ; un développeur qui travaille sur plusieurs postes le déclare (R-64)" });
    const go = goVersDossierSynchronise(racine);
    if (go.length) {
      ko("RP7", `le ledger consigne ${go.length} feu(x) vert(s) de publication qui vise(nt) un dossier synchronisé (seq ${listeSeq(go)}) et forge/REPRISE.json est absent : le hook \`reprise\` ne restaure rien. Écrire le manifeste depuis gabarits/REPRISE.json dans ce tour (emplacements du dossier sur chaque poste, éléments hors git à reprendre), puis \`node forge/hooks/factory.mjs reprise --restaurer\` ; RP4 se juge ensuite sur un canal restauré`);
      return { verdict: "FAIL", findings };
    }
    return { verdict: "PASS", findings };
  }
  if (lu.erreur) { ko("RP1", lu.erreur); return { verdict: "FAIL", findings }; }
  const m = lu.m, defauts = defautsManifeste(m);
  if (defauts.length) { ko("RP1", `manifeste invalide : ${defauts.join(" ; ")}`); return { verdict: "FAIL", findings }; }
  ok("RP1", `manifeste valide : ${m.elements.length} élément(s) déclaré(s)`);
  const goDrive = goVersDossierSynchronise(racine);
  if (goDrive.length) ok("RP7", `le feu vert de publication qui vise un dossier synchronisé (seq ${listeSeq(goDrive)}) a son manifeste`);
  const secrets = m.elements.filter((e) => estExclu(e, []));
  secrets.length
    ? ko("RP2", `${secrets.length} élément(s) déclaré(s) sont des secrets ou des dossiers techniques, que le canal ne transporte jamais : ${secrets.join(", ")} — les retirer de « elements » ; un fichier d'environnement se déclare dans « secrets.fichiers », et le coffre le porte clé par clé (D-224 (a))`)
    : ok("RP2", `aucun secret déclaré ; ${EXCLUSIONS_DURES.length} exclusions dures appliquées dans les deux sens`);
  const { canal, candidats } = resoudreCanal(m);
  if (!canal) ko("RP3", `canal introuvable sur ce poste (essayés : ${candidats.join(" ; ")}) — installer le client de synchronisation, ajouter l'emplacement de ce poste à « canal.chemins », ou exporter REPRISE_CANAL`);
  else {
    ok("RP3", `canal joignable : ${canal}`);
    const { plan, git } = planifier(racine, canal, m, opt);
    const ecarts = plan.filter((p) => p.sens === "restaurer" && !p.refus);
    ecarts.length
      ? ko("RP4", `${ecarts.length} fichier(s) du canal manquent ou ont vieilli sur ce poste, non restaurés : ${ecarts.slice(0, 3).map((p) => `${p.rel} (${p.motif})`).join(", ")} — \`node oracles/oracle-reprise.mjs --restaurer\` les reprend, et le hook d'ouverture le fait seul`)
      : ok("RP4", `aucun écart à restaurer (${plan.filter((p) => p.sens === "egal").length} fichier(s) identiques, ${plan.filter((p) => p.sens === "pousser").length} à envoyer)`);
    const refuses = plan.filter((p) => p.refus);
    if (refuses.length) {
      const dossier = (rel) => { const parts = rel.split("/"); return parts.length > 1 ? parts.slice(0, -1).join("/") + "/" : rel; };
      const motifs = [...new Set(refuses.map((p) => dossier(p.rel)))].slice(0, 3);
      ko("RP6", `${refuses.length} fichier(s) du canal seraient posés sur ce poste sans que git les ignore ni les suive, donc commitables : ${refuses.slice(0, 3).map((p) => p.rel).join(", ")} — rien n'a été posé. Un dossier ignoré a-t-il été renommé ? Garder l'ancien chemin dans le .gitignore du produit (ligne par dossier, ex. « ${motifs.join(" », « ")} »), ou retirer ces fichiers du canal`);
    } else ok("RP6", git ? "rien de ce que le canal poserait n'est commitable : tout est ignoré ou déjà suivi par git" : "produit hors dépôt git : le périmètre ignoré n'est pas jugé");
  }
  // RP8 (TF-2680) : une base dérivée ignorée par git se copie, se régénère ou s'écarte à dessein ; sinon elle manque sur le poste suivant.
  const regen = Array.isArray(m.regenerer) ? m.regenerer : [];
  const manque = regen.map((r) => ({ ...r, etat: etatBase(racine, r.produit) })).filter((r) => r.etat !== "présente");
  const { toutes: bases, orphelines } = basesIgnoreesDeGit(racine, m);
  if (manque.length)
    ko("RP8", `${manque.length} base(s) dérivée(s) à régénérer, absente(s) ou vide(s) sur ce poste : ${manque.slice(0, 3).map((r) => `${r.produit} (${r.etat}, « ${r.commande} »)`).join(", ")} — \`node oracles/oracle-reprise.mjs --restaurer\` joue la commande, et le hook d'ouverture le fait seul`
      + (orphelines.length ? ` ; ${orphelines.length} autre(s) base(s) ignorée(s) par git que rien ne couvre : ${orphelines.slice(0, 3).join(", ")}` : ""));
  else if (orphelines.length)
    findings.push({ regle: "RP8", statut: "AVERT", message: `${orphelines.length} base(s) ignorée(s) par git que le manifeste ne couvre pas, ni copiée(s) ni régénérée(s) : ${orphelines.slice(0, 3).join(", ")} — sur un autre poste elles manqueront, ou seront créées vides au démarrage. Les nommer dans « elements » (copie par le canal), dans « regenerer » ({ commande, produit }), ou dans « exclusions » si elles sont locales à dessein` });
  else if (regen.length || bases.length) ok("RP8", `${regen.length} base(s) dérivée(s) régénérable(s) par la commande déclarée, ${bases.length} base(s) ignorée(s) par git sur ce poste, toutes couvertes (copiées, régénérées ou écartées à dessein)`);
  if (m.envoi?.actif && !goComplet(m)) ko("RP5", "envoi actif sans feu vert de publication complet — « envoi.go_publication » porte decision, date (AAAA-MM-JJ) et par : envoyer vers le canal publie sur un service hébergé (R-38)");
  else if (m.envoi?.actif) ok("RP5", `envoi actif sous le feu vert « ${m.envoi.go_publication.decision} » du ${m.envoi.go_publication.date}`);
  else findings.push({ regle: "RP5", statut: "AVERT", message: "envoi non actif : ce qui change hors de git sur ce poste ne part pas vers le canal, et l'autre poste ne le verra pas"
    + (m.secrets || m.memoire ? " ; le coffre et la mémoire ne reçoivent rien non plus" : "") });
  // D-224 (a) : le coffre (RP3, RP6, RP4, RP9), la mémoire (RP3, RP6, RP4) et leur place hors du canal (RP10).
  if (m.secrets) jugerCoffre(racine, m, opt, findings);
  if (m.memoire) jugerMemoire(racine, m, opt, findings);
  if (m.secrets || m.memoire) jugerPerimetre(m, findings);
  return { verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings };
}

const OUTIL = "node oracles/oracle-reprise.mjs";

function jugerCoffre(racine, m, opt, findings) {
  const f = (regle, statut, message) => findings.push({ regle, statut, message: `coffre : ${message}`, flux: "coffre" });
  const s = m.secrets;
  const { dossier: coffre, existe, candidats } = resoudreDossier(s.chemins);
  if (!coffre) f("RP3", "FAIL", `introuvable sur ce poste (essayés : ${candidats.join(" ; ")}) — installer le client de synchronisation, ou ajouter l'emplacement de ce poste à « secrets.chemins »`);
  else f("RP3", "PASS", `joignable : ${coffre}${existe ? "" : " (le dossier naît au premier envoi : son parent existe)"}`);
  const garde = coffre ? gardeDossier(coffre, racine) : null;
  const refusFichiers = s.fichiers.map((rel) => ({ rel, motif: refusPoste(racine, rel) })).filter((x) => x.motif);
  if (garde) f("RP6", "FAIL", `${coffre} est refusé, ${garde} — déclarer dans « secrets.chemins » un dossier du Drive, hors du produit et de tout dépôt`);
  else if (refusFichiers.length) f("RP6", "FAIL", `${refusFichiers.length} fichier(s) d'environnement de ce poste ne peuvent pas porter de secrets (${refusFichiers.map((x) => x.rel).join(", ")}) : ${refusFichiers[0].motif}`);
  else f("RP6", "PASS", `les ${s.fichiers.length} fichier(s) d'environnement déclarés sont ignorés par git${coffre ? " ; le coffre vit hors du produit, du pilot et de tout dépôt git" : ""}`);
  const lisible = !!coffre && !garde;
  if (lisible) {
    const etat = lireEtatFlux(racine, opt, "secrets");
    const plans = s.fichiers.filter((rel) => !refusFichiers.some((x) => x.rel === rel)).map((rel) => planifierSecret(racine, coffre, rel, etat.fichiers?.[rel] || {}, null));
    const sains = plans.filter((p) => !p.refus && !p.absent);
    const aRestaurer = sains.filter((p) => p.cles_au_coffre_seul.length || p.pris_du_coffre.length);
    const bloques = plans.filter((p) => p.refus);
    if (aRestaurer.length || bloques.length) f("RP4", "FAIL", [
      aRestaurer.length ? `${aRestaurer.reduce((n, p) => n + p.cles_au_coffre_seul.length + p.pris_du_coffre.length, 0)} clé(s) du coffre manquent ou ont vieilli sur ce poste, non restaurées : ${aRestaurer.map((p) => `${p.fichier} (${[...p.cles_au_coffre_seul, ...p.pris_du_coffre].join(", ")})`).join(" ; ")} — \`${OUTIL} --restaurer\` les reprend, et le hook d'ouverture le fait seul` : "",
      ...bloques.map((p) => p.refus),
    ].filter(Boolean).join(" ; "));
    else f("RP4", "PASS", `aucun écart à restaurer (${sains.reduce((n, p) => n + p.identiques, 0)} clé(s) identiques, ${sains.reduce((n, p) => n + p.cles_au_poste_seul.length + p.pris_du_poste.length, 0)} à envoyer en fin de tour)`);
  }
  // RP9 (R-2 du diagnostic 20261121c) : le coffre se juge contre les clés que le produit EXIGE, pas contre le poste.
  const clesDe = (base) => {
    const pleines = new Set(), vides = new Set();
    for (const rel of s.fichiers) for (const [k, l] of analyser(lireEnv(join(base, rel))).cles) (l.valeur.trim() ? pleines : vides).add(k);
    return { pleines, vides };
  };
  const P = clesDe(racine), C = lisible ? clesDe(coffre) : null;
  const nom = (E, k) => `${k}${E.vides.has(k) ? " (vide)" : ""}`;
  const manqueP = s.cles_attendues.filter((k) => !P.pleines.has(k)), manqueC = C ? s.cles_attendues.filter((k) => !C.pleines.has(k)) : [];
  if (manqueP.length || manqueC.length) {
    const recevoir = manqueP.filter((k) => C?.pleines.has(k)), envoyer = manqueC.filter((k) => P.pleines.has(k));
    const nullePart = manqueP.filter((k) => !C?.pleines.has(k));
    f("RP9", "FAIL", `${new Set([...manqueP, ...manqueC]).size} clé(s) attendue(s) sur ${s.cles_attendues.length} manquent ou sont vides — ` + [
      recevoir.length ? `au poste, présentes au coffre : ${recevoir.map((k) => nom(P, k)).join(", ")} (\`${OUTIL} --restaurer\` les reprend)` : "",
      envoyer.length ? `au coffre, présentes au poste : ${envoyer.map((k) => nom(C, k)).join(", ")} (l'envoi de fin de tour les porte, sous le feu vert ; \`${OUTIL} --pousser\`)` : "",
      nullePart.length ? `${C ? "ni au poste ni au coffre" : "au poste"} : ${nullePart.map((k) => nom(P, k)).join(", ")} (les ranger sur ce poste, \`node forge/ranger-secret.mjs\`, valeur demandée à son émetteur ; l'envoi de fin de tour les porte ensuite au coffre)` : "",
      C ? "" : "le coffre n'est pas lisible sur ce poste (RP3, RP6) : son côté n'est pas jugé",
    ].filter(Boolean).join(" ; "));
  } else f("RP9", "PASS", `les ${s.cles_attendues.length} clé(s) attendue(s) sont présentes et non vides au poste${C ? " et au coffre" : " ; le coffre n'est pas lisible sur ce poste (RP3, RP6) : son côté n'est pas jugé"}`);
}

function jugerMemoire(racine, m, opt, findings) {
  const f = (regle, statut, message) => findings.push({ regle, statut, message: `mémoire : ${message}`, flux: "memoire" });
  const { dossier, existe, candidats } = resoudreDossier(m.memoire.chemins);
  if (!dossier) { f("RP3", "FAIL", `dossier introuvable sur ce poste (essayés : ${candidats.join(" ; ")}) — ajouter l'emplacement de ce poste à « memoire.chemins »`); return; }
  f("RP3", "PASS", `joignable : ${dossier}${existe ? "" : " (le dossier naît au premier envoi : son parent existe)"}`);
  const garde = gardeDossier(dossier, racine);
  if (garde) { f("RP6", "FAIL", `${dossier} est refusé, ${garde} — déclarer dans « memoire.chemins » un dossier du Drive, hors du produit et de tout dépôt`); return; }
  f("RP6", "PASS", "le dossier vit hors du produit, du pilot et de tout dépôt git");
  const pm = planifierMemoire(racine, dossier, opt);
  if (pm.erreur) { f("RP4", "SANS_OBJET", `${pm.erreur} : la mémoire de ce poste n'est pas jugée`); return; }
  const ecarts = pm.plan.filter((p) => p.sens === "restaurer");
  const exclus = pm.exclus.length ? ` ; ${pm.exclus.length} fichier(s) écarté(s) par les exclusions dures, qui restent sur leur poste : ${pm.exclus.slice(0, 3).join(", ")}` : "";
  ecarts.length
    ? f("RP4", "FAIL", `${ecarts.length} fichier(s) de ${dossier} manquent ou ont vieilli dans la mémoire de ce profil (${pm.local}, ${pm.profil}), non restaurés : ${ecarts.slice(0, 3).map((p) => `${p.rel} (${p.motif})`).join(", ")} — \`${OUTIL} --restaurer\` les reprend, et le hook d'ouverture le fait seul${exclus}`)
    : f("RP4", "PASS", `aucun écart à restaurer dans ${pm.local} (${pm.profil}) : ${pm.plan.filter((p) => p.sens === "egal").length} fichier(s) identiques, ${pm.plan.filter((p) => p.sens === "pousser").length} à envoyer${exclus}`);
}

// RP10 : le coffre et la mémoire vivent à côté du canal, jamais dans ce qu'il copie ; un dossier SECRETS du canal reste exclu par son nom.
function jugerPerimetre(m, findings) {
  const { canal } = resoudreCanal(m);
  const flux = [m.secrets ? ["le coffre", resoudreDossier(m.secrets.chemins).dossier] : null, m.memoire ? ["la mémoire", resoudreDossier(m.memoire.chemins).dossier] : null].filter(Boolean);
  const absents = flux.filter(([, d]) => !d).map(([q]) => q);
  if (!canal || absents.length === flux.length) {
    findings.push({ regle: "RP10", statut: "AVERT", message: `non jugé sur ce poste : ${!canal ? "le canal est introuvable" : `${absents.join(" et ")} introuvable(s)`} (RP3)` });
    return;
  }
  const elements = m.elements.map((e) => posix.normalize(e.replaceAll("\\", "/")).replace(/\/+$/, ""));
  const defauts = [];
  for (const [quoi, d] of flux) {
    if (!d) continue;
    const rel = dedans(canal, d);
    if (rel === null) continue;
    if (rel === "") { defauts.push(`${quoi} est le canal lui-même (${d}) : il vit à côté, ex. « <Produit> - Reprise/SECRETS » à côté de « <Produit> - Reprise/DONNEES-HORS-GIT »`); continue; }
    const couvrant = elements.find((e) => e === "." || rel === e || rel.startsWith(e + "/") || e.startsWith(rel + "/"));
    if (couvrant && !estExclu(rel, m.exclusions || [])) defauts.push(`${quoi} (« ${rel} » dans le canal) est sous l'élément « ${couvrant} », sans exclusion : le canal le copierait — ajouter « ${rel.split("/").pop()} » à « exclusions », ou le déplacer hors du canal`);
  }
  const [coffre, memoire] = [m.secrets ? flux[0][1] : null, m.memoire ? flux[flux.length - 1][1] : null];
  if (coffre && memoire && (dedans(coffre, memoire) !== null || dedans(memoire, coffre) !== null))
    defauts.push("le coffre et la mémoire se contiennent l'un l'autre : la mémoire copierait des secrets, ou le coffre des notes — deux dossiers voisins");
  // La mémoire se copie dossier entier : un canal logé dans son dossier partirait dans le profil Claude.
  if (memoire && dedans(memoire, canal)) defauts.push(`le canal est dans le dossier de la mémoire (${memoire}) : la mémoire copierait ses fichiers dans le profil Claude — deux dossiers voisins`);
  defauts.length
    ? findings.push({ regle: "RP10", statut: "FAIL", message: defauts.join(" ; ") })
    : findings.push({ regle: "RP10", statut: "PASS", message: `${flux.filter(([, d]) => d).map(([q]) => q).join(" et ")} hors du périmètre que le canal copie${absents.length ? ` ; ${absents.join(" et ")} non jugé(s), introuvable(s) sur ce poste (RP3)` : ""}` });
}

export const NON_JUGE = [
  "une suppression ne se propage pas : un fichier effacé d'un côté revient de l'autre",
  "deux postes qui écrivent le même fichier entre deux synchronisations : le plus récent gagne, l'autre reste en sauvegarde, sans fusion de contenu",
  "le périmètre ignoré d'un produit qui n'est pas un dépôt git : sans git, rien ne dit ce qui serait commitable, et la restauration ne refuse rien",
  "ce que le fournisseur du canal fait du fichier une fois déposé (versions, partage, rétention)",
  "que la commande de `regenerer` produise une base CORRECTE : le juge lit seulement que `produit` existe et n'est pas vide après son passage ; RP8 ne cherche que les extensions .db, .sqlite, .sqlite3 et .duckdb, une autre base dérivée ignorée par git n'est pas vue",
  "que le feu vert qui nomme un dossier synchronisé (RP7) soit bien pour une reprise : seul le texte de l'entrée `go_publication` du ledger sert d'indice (noms de fournisseurs), un partage de livrable sur Drive se lit aussi comme une reprise, et un feu vert consigné ailleurs que `forge/ledger.jsonl` n'est pas vu",
  "que le canal soit à jour du côté du fournisseur : le juge lit le miroir local, tel que le client de synchronisation l'a laissé",
  "la VALIDITÉ d'un secret (D-224 (a)) : RP9 lit qu'une clé attendue est présente et non vide au poste et au coffre ; seule l'API qui reçoit le jeton dit s'il est bon",
  "une clé SUPPRIMÉE d'un seul côté revient de l'autre (union clé par clé) : la retirer se fait au poste et au coffre, au même tour",
  "un secret qui n'est pas un fichier d'environnement de « secrets.fichiers » : un fichier d'identifiants désigné par une variable (GOOGLE_APPLICATION_CREDENTIALS, CLOUDSDK_CONFIG), une clé .pem, un coffre .kdbx ne voyagent pas par le coffre",
  "une valeur écrite sur plusieurs lignes, ou une ligne ni clé, ni commentaire, ni vide : la fusion refuse le fichier en nommant les lignes par leur numéro, elle ne sait pas la fusionner",
  "une valeur qui change de forme sans changer de sens (A=x et A=\"x\") est tenue pour égale, et un commentaire en fin de ligne pour une valeur différente : la règle d'`analyser()` de fusionner-env",
  "la mémoire d'un AUTRE profil Claude que celui de la session : le profil est CLAUDE_CONFIG_DIR, sinon ~/.claude (lib-config-installee) ; un second profil (~/.claude-b) se synchronise quand une de ses sessions joue le hook, et les deux convergent par le même dossier MEMOIRE-CLAUDE",
  "le dossier de la mémoire suit la règle de nommage de Claude Code (racine du projet, non alphanumériques en « - ») : un nom que Claude Code raccourcit ou complète pour un chemin très long n'est pas retrouvé",
  "deux postes qui changent la même note de mémoire entre deux synchronisations : la plus récente gagne et l'autre reste en sauvegarde ; seul l'index MEMORY.md prend l'union de ses lignes",
];

// ---- CLI ----
const opt = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const racine = resolve(opt("--racine") || process.cwd());
  const o = { budget: opt("--budget") ? Number(opt("--budget")) : undefined, etat: opt("--etat"), profil: opt("--profil") };
  const sens = process.argv.includes("--restaurer") ? "restaurer" : process.argv.includes("--pousser") ? "pousser" : null;
  if (process.argv.includes("--prefere")) {
    // Le choix humain qui tranche un conflit sans base (garde D-208) : seulement avec un sens, et sous une forme lisible.
    o.prefere = sens ? lirePrefere(opt("--prefere")) : null;
    if (!o.prefere) {
      console.log(JSON.stringify({ outil: "oracle-reprise", version: VERSION, usage: "--prefere poste|coffre|CLE:poste,CLE2:coffre, avec --restaurer ou --pousser" }));
      process.exit(2);
    }
  }
  if (sens) {
    const r = synchroniser(racine, sens, o);
    console.log(JSON.stringify({ outil: "oracle-reprise", version: VERSION, mode: sens, racine, ...r }, null, 1));
    const fluxEnEchec = [r.secrets, r.memoire].some((x) => x && (x.erreur || x.refus || (x.fichiers || []).some((f) => f.refus)));
    process.exit(r.erreur || fluxEnEchec ? 1 : 0);
  }
  const r = verifier(racine, o);
  console.log(JSON.stringify({ outil: "oracle-reprise", version: VERSION, cible: racine, ...r, non_juge: NON_JUGE }, null, 1));
  process.exit(r.verdict === "PASS" ? 0 : 1);
}
