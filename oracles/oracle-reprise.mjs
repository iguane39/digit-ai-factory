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
 *   envoi           — { actif, go_publication: { decision, date, par } } : l'envoi vers le canal fait
 *                     partir des fichiers vers un service hébergé, il exige le feu vert R-38 consigné.
 *
 * MODES
 *   --restaurer  canal → produit : ce qui manque ou a vieilli sur ce poste (hook d'ouverture, asynchrone) ;
 *   --pousser    produit → canal : ce qui a changé hors de git sur ce poste (hook de fin de tour) ;
 *   --verifier   le juge (défaut) : RP1 manifeste valide · RP2 aucun secret déclaré · RP3 canal joignable
 *                sur ce poste · RP4 aucun écart non restauré · RP5 envoi actif sous feu vert consigné ·
 *                RP6 rien de ce que le canal poserait n'est commitable (TF-2441).
 *   Options : --racine <produit> (défaut : dossier courant), --budget <secondes>, --etat <dossier>.
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
 * NON JUGÉ, et c'est déclaré :
 *   - une SUPPRESSION ne se propage pas : un fichier effacé d'un côté revient de l'autre ;
 *   - ce que le canal fait du fichier une fois déposé (versions, partage) relève du fournisseur ;
 *   - deux postes qui écrivent le même fichier dans la même minute : le plus récent gagne, l'autre
 *     reste en sauvegarde, sans fusion de contenu.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync, utimesSync } from "node:fs";
import { join, resolve, dirname, sep } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { empreinteBinaire } from "../scripts/lib-empreinte.mjs";

export const VERSION = "1.1.0";
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
  return d;
}

export const goComplet = (m) => {
  const g = m?.envoi?.go_publication;
  return !!(g && typeof g === "object" && String(g.decision || "").trim() && /^\d{4}-\d{2}-\d{2}$/.test(String(g.date || "")) && String(g.par || "").trim());
};

export function resoudreCanal(m) {
  const candidats = [process.env.REPRISE_CANAL, ...((m?.canal?.chemins) || [])].filter(Boolean).map(developper);
  return { canal: candidats.find((c) => { try { return statSync(c).isDirectory(); } catch { return false; } }) || null, candidats };
}

function parcourir(base, rel, exclusions, sortie) {
  const abs = join(base, rel);
  let st; try { st = statSync(abs); } catch { return; }
  if (rel && estExclu(rel, exclusions)) return;
  if (st.isDirectory()) {
    for (const n of readdirSync(abs)) parcourir(base, rel ? join(rel, n) : n, exclusions, sortie);
  } else if (st.isFile()) sortie.set(rel.replaceAll("\\", "/"), { taille: st.size, mtime: Math.floor(st.mtimeMs) });
}
export function inventaire(base, elements, exclusions) {
  const sortie = new Map();
  for (const e of elements) parcourir(base, e.replaceAll("/", sep), exclusions, sortie);
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

/** Calcule ce que chaque fichier demande, sans rien écrire. */
export function planifier(racine, canal, m, opt = {}) {
  const exclusions = m.exclusions || [];
  const loc = inventaire(racine, m.elements, exclusions);
  const can = inventaire(canal, m.elements, exclusions);
  const etat = lireEtat(racine, opt);
  const plan = [];
  for (const rel of new Set([...loc.keys(), ...can.keys()])) {
    const l = loc.get(rel), c = can.get(rel), e = etat.fichiers[rel];
    if (l && !c) { plan.push({ rel, sens: "pousser", motif: "absent du canal" }); continue; }
    if (c && !l) { plan.push({ rel, sens: "restaurer", motif: "absent de ce poste" }); continue; }
    const sl = sha("l", rel, l, racine, e?.local), sc = sha("c", rel, c, canal, e?.canal);
    if (sl === sc) { plan.push({ rel, sens: "egal", sl, sc, l, c }); continue; }
    if (e && sl === e.sha) plan.push({ rel, sens: "restaurer", motif: "le canal a changé" });
    else if (e && sc === e.sha) plan.push({ rel, sens: "pousser", motif: "ce poste a changé" });
    else plan.push({ rel, sens: c.mtime > l.mtime ? "restaurer" : "pousser", motif: e ? "les deux côtés ont changé, le plus récent gagne" : "premier passage sur ce poste, le plus récent gagne", conflit: true });
  }
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
  if (lu.absent) return { sans_objet: true, message: "aucun canal de reprise déclaré (forge/REPRISE.json absent)" };
  if (lu.erreur) return { erreur: lu.erreur };
  const m = lu.m, defauts = defautsManifeste(m);
  if (defauts.length) return { erreur: `manifeste invalide : ${defauts.join(" ; ")}` };
  if (sens === "pousser" && !(m.envoi?.actif && goComplet(m)))
    return { refuse: true, message: m.envoi?.actif ? "envoi actif sans feu vert de publication complet (decision, date, par) — rien n'est parti (R-38)" : "envoi non actif — rien ne part vers le canal" };
  const { canal, candidats } = resoudreCanal(m);
  if (!canal) return { erreur: `canal introuvable sur ce poste (essayés : ${candidats.join(" ; ") || "aucun"}) — installer le client de synchronisation, ou exporter REPRISE_CANAL` };
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
  return { canal, sens, fait, conflits, refuses, reste, egaux: plan.filter((p) => p.sens === "egal").length, a_faire_autre_sens: plan.filter((p) => p.sens !== "egal" && p.sens !== sens).length };
}

/** Le juge. */
export function verifier(racine, opt = {}) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const lu = lireManifeste(racine);
  if (lu.absent) {
    findings.push({ regle: "RP1", statut: "SANS_OBJET", message: "aucun canal de reprise déclaré (forge/REPRISE.json absent) — rien à juger ; un développeur qui travaille sur plusieurs postes le déclare (R-64)" });
    return { verdict: "PASS", findings };
  }
  if (lu.erreur) { ko("RP1", lu.erreur); return { verdict: "FAIL", findings }; }
  const m = lu.m, defauts = defautsManifeste(m);
  if (defauts.length) { ko("RP1", `manifeste invalide : ${defauts.join(" ; ")}`); return { verdict: "FAIL", findings }; }
  ok("RP1", `manifeste valide : ${m.elements.length} élément(s) déclaré(s)`);
  const secrets = m.elements.filter((e) => estExclu(e, []));
  secrets.length
    ? ko("RP2", `${secrets.length} élément(s) déclaré(s) sont des secrets ou des dossiers techniques, que la reprise ne transporte jamais : ${secrets.join(", ")} — les retirer du manifeste ; un secret se ressaisit sur chaque poste`)
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
  if (m.envoi?.actif && !goComplet(m)) ko("RP5", "envoi actif sans feu vert de publication complet — « envoi.go_publication » porte decision, date (AAAA-MM-JJ) et par : envoyer vers le canal publie sur un service hébergé (R-38)");
  else if (m.envoi?.actif) ok("RP5", `envoi actif sous le feu vert « ${m.envoi.go_publication.decision} » du ${m.envoi.go_publication.date}`);
  else findings.push({ regle: "RP5", statut: "AVERT", message: "envoi non actif : ce qui change hors de git sur ce poste ne part pas vers le canal, et l'autre poste ne le verra pas" });
  return { verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings };
}

export const NON_JUGE = [
  "une suppression ne se propage pas : un fichier effacé d'un côté revient de l'autre",
  "deux postes qui écrivent le même fichier entre deux synchronisations : le plus récent gagne, l'autre reste en sauvegarde, sans fusion de contenu",
  "le périmètre ignoré d'un produit qui n'est pas un dépôt git : sans git, rien ne dit ce qui serait commitable, et la restauration ne refuse rien",
  "ce que le fournisseur du canal fait du fichier une fois déposé (versions, partage, rétention)",
  "que le canal soit à jour du côté du fournisseur : le juge lit le miroir local, tel que le client de synchronisation l'a laissé",
];

// ---- CLI ----
const opt = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const racine = resolve(opt("--racine") || process.cwd());
  const o = { budget: opt("--budget") ? Number(opt("--budget")) : undefined, etat: opt("--etat") };
  const sens = process.argv.includes("--restaurer") ? "restaurer" : process.argv.includes("--pousser") ? "pousser" : null;
  if (sens) {
    const r = synchroniser(racine, sens, o);
    console.log(JSON.stringify({ outil: "oracle-reprise", version: VERSION, mode: sens, racine, ...r }, null, 1));
    process.exit(r.erreur ? 1 : 0);
  }
  const r = verifier(racine, o);
  console.log(JSON.stringify({ outil: "oracle-reprise", version: VERSION, cible: racine, ...r, non_juge: NON_JUGE }, null, 1));
  process.exit(r.verdict === "PASS" ? 0 : 1);
}
