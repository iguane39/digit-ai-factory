#!/usr/bin/env node
/**
 * ingerer-lot.mjs — ingère un sidecar de candidatures (*.tf.jsonl) dans le registre TODO-FORGE.
 *
 * Contrat (campagne du 08/08) :
 *  - les candidatures arrivent SANS id : les ids TF sont frappés ICI (écrivain unique) ;
 *  - validation de TOUTES les lignes AVANT toute écriture — une ligne invalide = rejet
 *    ATOMIQUE et motivé du fichier entier, registre intact ;
 *  - IDEMPOTENT : l'empreinte sha256 du sidecar est consignée en événement `ingestion` —
 *    ré-ingérer le même lot ne crée rien ;
 *  - tout entre en statut CANDIDAT : l'automatique s'arrête là, la décision reste humaine ;
 *  - après écriture : oracle-todo rejoué + vue régénérée (registre par défaut uniquement).
 *
 * Usage : node ingerer-lot.mjs <sidecar.tf.jsonl> [--registre <TODO.jsonl>]
 * Exit : 0 = ingéré (ou déjà ingéré, 0 création) · 1 = sidecar rejeté · 2 = erreur.
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const sidecarPath = process.argv[2];
const iReg = process.argv.indexOf("--registre");
const registre = resolve(iReg > 0 ? process.argv[iReg + 1] : join(ICI, "TODO.jsonl"));
const archive = join(dirname(registre), "TODO-ARCHIVE.jsonl");
if (!sidecarPath || !existsSync(sidecarPath)) { console.error("usage : ingerer-lot.mjs <sidecar.tf.jsonl> [--registre <TODO.jsonl>] [--sans-fetch] [--derogation \"<motif>\"]"); process.exit(2); }

// ---- dérogation TRACÉE aux règles de FORME du lot (décision humaine du 22/08, option b3) ---
// Deux lots Produit-05 rédigés AVANT la publication de R-45 restaient hors du registre : la règle
// se juge sur la date du NOM du lot, jamais sur ce que le produit pouvait savoir. L'arbitrage
// humain a refusé d'amender R-45 — elle reste intacte, et elle a raison sur le fond — et a
// retenu une dérogation tracée, cas par cas.
//
// Ce que la dérogation couvre : R-45 et R-46 SEULEMENT, les règles de FORME du lot remis.
// Ce qu'elle ne couvre JAMAIS : la validation des candidatures (rejet atomique), l'unicité des
// ids, l'idempotence, le préflight anti-collision. Une dérogation qui ouvrirait tout ne serait
// pas une dérogation, ce serait un interrupteur.
//
// Ce qu'elle exige : un motif ÉCRIT et substantiel, consigné dans l'événement `ingestion` du
// registre. Une dérogation sans motif est un contournement silencieux ; le seuil de longueur
// ne mesure aucune qualité, il rend seulement le geste coûteux à poser sans réfléchir.
const iDero = process.argv.indexOf("--derogation");
const MOTIF_MIN = 30;
let derogationMotif = null;
if (iDero > 0) {
  derogationMotif = (process.argv[iDero + 1] || "").trim();
  if (!derogationMotif || derogationMotif.startsWith("--")) {
    console.error("[REFUS] --derogation exige un motif écrit : ce qui est dérogé, pourquoi, et sur quelle décision.\n" +
      "  Une dérogation sans motif ne se distingue pas d'un contournement.");
    process.exit(2);
  }
  if (derogationMotif.length < MOTIF_MIN) {
    console.error(`[REFUS] motif de dérogation trop court (${derogationMotif.length} caractères, minimum ${MOTIF_MIN}).\n` +
      "  Le motif est la SEULE trace qui restera : il nomme la règle dérogée et la décision qui l'autorise.");
    process.exit(2);
  }
}
const reglesDerogees = [];
// Rend true si la règle est dérogée — et le DIT, fort : un refus qui devient un passage se voit.
const derogee = (regle, quoi) => {
  if (!derogationMotif) return false;
  reglesDerogees.push(regle);
  console.error(`[DÉROGATION ${regle}] ${quoi}\n  motif : ${derogationMotif}\n` +
    "  La règle reste INTACTE : ce lot passe, le suivant sera refusé de la même façon.");
  return true;
};

// ---- préflight anti-collision inter-sessions (TF-0394, revue du 19/08) --------------------
// Deux sessions pilot parallèles ont frappé les mêmes ids TF depuis la même base (19/08 :
// TF-0383/0384/0385 doublement frappés) : l'écrivain unique ne l'est que PAR SESSION, et la
// collision ne s'est vue qu'au push — payée en renumérotation manuelle du registre. Avant
// toute frappe d'ids, le registre distant est confronté au local : s'il porte des commits
// sur TODO.jsonl / TODO-ARCHIVE.jsonl absents du local, le max local est faux et les ids
// séquentiels re-frapperaient des numéros déjà pris ailleurs — REFUS, pull d'abord.
// Hors git ou hors ligne : constat déclaré, jamais silencieux. `--sans-fetch` assume.
if (!process.argv.includes("--sans-fetch")) {
  const todoDir = dirname(registre);
  const git = (args) => execFileSync("git", ["-C", todoDir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  let dansGit = false;
  try { dansGit = git(["rev-parse", "--is-inside-work-tree"]) === "true"; } catch { /* registre nu : rien à confronter */ }
  if (dansGit) {
    try {
      execFileSync("git", ["-C", todoDir, "fetch", "--quiet", "origin"], { stdio: "ignore", timeout: 20000 });
      const enRetard = Number(git(["rev-list", "--count", "HEAD..origin/main", "--", "TODO.jsonl", "TODO-ARCHIVE.jsonl"]));
      if (enRetard > 0) {
        console.error(`[REFUS PRÉFLIGHT TF-0394] le registre distant a avancé : ${enRetard} commit(s) touchant TODO.jsonl/TODO-ARCHIVE.jsonl absents du local — les ids séquentiels repartiraient du mauvais max. git pull --rebase, puis ré-ingérer. (--sans-fetch pour assumer explicitement le hors-ligne)`);
        process.exit(1);
      }
    } catch {
      console.error("[préflight TF-0394] fetch/comparaison origin impossible (hors ligne ? remote absent ?) — unicité inter-sessions NON vérifiée, ingestion locale assumée");
    }
  }
}

const contenu = readFileSync(sidecarPath, "utf8");
// Empreinte NORMALISEE en LF (idiome TF-0253, etendu par TF-0359) : avec core.autocrlf=true,
// git repose un sidecar en CRLF au checkout sans qu'un octet de contenu ait bouge. Une
// empreinte prise sur les octets bruts ne reconnait alors plus le lot deja ingere, et
// l'idempotence tombe : le meme lot recree ses candidatures en doublon — l'incident du
// 13/08 (32 doublons) par un autre chemin. La forme brute reste acceptee en lecture pour
// les ingestions ANTERIEURES a cette normalisation, jamais ecrite pour les nouvelles.
const lotSha = createHash("sha256").update(contenu.split("\r\n").join("\n")).digest("hex");
const lotShaBrut = createHash("sha256").update(contenu).digest("hex");
const lignes = contenu.split("\n").filter((l) => l.trim());

// ---- R-45 (21/08) : un lot remis DIT ce qu'il n'a pas remonté ------------------------------
// La règle vaut au moment où le lot ENTRE, pas seulement quand il attend dans la boîte : une
// fois ingéré, il part en `old\` et `oracle-boite-entree` B6 ne le voit plus. Le constat et le
// refus se cumulent — l'un détecte ce qui traîne, l'autre empêche d'entrer.
//
// Ce qui est exigé : la section « Remarques restées au produit » du gabarit, et sous elle un
// verdict de généralisation, ou la phrase déclarant qu'aucune remarque n'est restée. Ce qui
// n'est PAS jugé : la justesse du verdict — un raisonnement écrit peut être faux, un
// raisonnement absent est perdu pour tout le monde.
//
// Portée : seuls les sidecars flanqués d'un `.md` homonyme sont concernés (une candidature
// hors lot n'a pas de lot), et seuls ceux datés du 21/08 ou après (antériorité déclarée,
// R-33 bis).
{
  const SEUIL_R45 = "20260821";
  const date = /(\d{8})[a-z]?\.tf\.jsonl$/i.exec(sidecarPath.split("\\").join("/").split("/").pop() || "");
  const lotMd = sidecarPath.replace(/\.normalise\.tf\.jsonl$/i, ".md").replace(/\.tf\.jsonl$/i, ".md");
  if (date && date[1] >= SEUIL_R45 && existsSync(lotMd)) {
    const texteLot = readFileSync(lotMd, "utf8");
    const SECTION = /^##\s+Remarques\s+rest[ée]es?\s+au\s+produit\s*$/im;
    if (!SECTION.test(texteLot)) {
      if (!derogee("R-45", "le lot n'a pas de section « Remarques restées au produit »")) {
        console.error(
          `[REJET ATOMIQUE] ${sidecarPath} — registre intact.\n` +
          `  - le lot ${lotMd} n'a pas de section « Remarques restées au produit » (R-45).\n` +
          "    Ce qu'un produit corrige chez lui sans le remonter emporte la CLASSE du défaut\n" +
          "    avec lui. Gabarit : gabarits\\RETOURS-FORGES.md.\n" +
          "    CAUSE LA PLUS FREQUENTE (TF-0502, 22/08) : le produit ecrit avec une COPIE du\n" +
          "    gabarit prise a la CREATION de son run et jamais rafraichie. Les deux sections y\n" +
          "    sont entrees le 21/08 ; une copie plus ancienne ne les porte pas. Recopier\n" +
          "    gabarits\\RETOURS-FORGES.md dans forge\\retours\\ du produit, puis reprendre le lot.");
        process.exit(1);
      }
    }
    const suite = (texteLot.split(SECTION)[1] || "").split(/^## /m)[0] || "";
    if (!/g[ée]n[ée]ralisab/i.test(suite) && !/aucune\s+remarque\s+n['’]est\s+rest[ée]e?\s+au\s+produit/i.test(suite)) {
      if (!derogee("R-45", "la section « Remarques restées au produit » ne porte ni verdict ni déclaration")) {
        console.error(
          `[REJET ATOMIQUE] ${sidecarPath} — registre intact.\n` +
          `  - la section « Remarques restées au produit » de ${lotMd} ne porte ni verdict de\n` +
          "    généralisation, ni la phrase déclarant qu'aucune remarque n'est restée au produit.\n" +
          "    Une section vide se lit comme un oubli : l'omission ne vaut pas décision (R-45).");
        process.exit(1);
      }
    }
  }
}

// ---- R-46 (22/08) : un lot remis DIT ce que ses documents ont coûté au gabarit -------------
// Pendant de R-45 côté LIVRABLES. R-45 demande ce que le projet a corrigé chez lui ; R-46
// demande ce qui a manqué, gêné ou dû être ajouté à la main dans un document produit depuis un
// gabarit de la bibliothèque. Un gabarit ne vieillit pas en s'usant : il vieillit parce que la
// réalité des projets le dépasse et que personne ne le dit.
//
// Même architecture que R-45, et pour la même raison : le refus ferme la porte, `B7` constate ce
// qui attend dans la boîte, et les deux se cumulent parce qu'un lot ingéré part en `old\`.
{
  const SEUIL_R46 = "20260822";
  const dateR46 = /(\d{8})[a-z]?\.tf\.jsonl$/i.exec(sidecarPath.split("\\").join("/").split("/").pop() || "");
  const lotMdR46 = sidecarPath.replace(/\.normalise\.tf\.jsonl$/i, ".md").replace(/\.tf\.jsonl$/i, ".md");
  if (dateR46 && dateR46[1] >= SEUIL_R46 && existsSync(lotMdR46)) {
    const texteLot = readFileSync(lotMdR46, "utf8");
    const SECTION = /^##\s+Retours\s+sur\s+les\s+documents\s+produits\s*$/im;
    if (!SECTION.test(texteLot)) {
      if (!derogee("R-46", "le lot n'a pas de section « Retours sur les documents produits »")) {
        console.error(
          `[REJET ATOMIQUE] ${sidecarPath} — registre intact.\n` +
          `  - le lot ${lotMdR46} n'a pas de section « Retours sur les documents produits » (R-46).\n` +
          "    Ce qu'un document a coûté au gabarit — section manquante, champ non prévu, ajout à\n" +
          "    la main — est le seul canal par lequel la bibliothèque s'améliore.\n" +
          "    Gabarit : gabarits\\RETOURS-FORGES.md.");
        process.exit(1);
      }
    }
    const suite = (texteLot.split(SECTION)[1] || "").split(/^## /m)[0] || "";
    if (!/gd-[a-z-]+|version[_ ]du[_ ]gabarit/i.test(suite)
        && !/aucun\s+document\s+produit\s+depuis\s+un\s+gabarit/i.test(suite)) {
      if (!derogee("R-46", "la section « Retours sur les documents produits » ne rattache aucun retour à un gabarit")) {
        console.error(
          `[REJET ATOMIQUE] ${sidecarPath} — registre intact.\n` +
          `  - la section « Retours sur les documents produits » de ${lotMdR46} ne rattache aucun\n` +
          "    retour à un gabarit (id `gd-…` ou version du gabarit), et ne déclare pas non plus\n" +
          "    qu'aucun document n'en est issu. Un retour qui ne nomme pas sa source ne s'applique\n" +
          "    à rien : « il manquait une section » ne se rattache à aucune famille (R-46).");
        process.exit(1);
      }
    }
  }
}

// ---- validation intégrale AVANT toute écriture (rejet atomique) ----------------------------
const motifs = [];
const candidatures = lignes.map((l, i) => {
  let c;
  try { c = JSON.parse(l); } catch { motifs.push(`ligne ${i + 1} : JSON invalide`); return null; }
  if (c.schema !== 1) motifs.push(`ligne ${i + 1} : schema attendu 1, reçu ${c.schema}`);
  if (c.id) motifs.push(`ligne ${i + 1} : une candidature ne porte JAMAIS d'id (frappé à l'ingestion)`);
  for (const champ of ["titre", "contenu", "demandeur", "source", "date_demande"])
    if (!c[champ]) motifs.push(`ligne ${i + 1} : champ ${champ} manquant`);
  if (!Array.isArray(c.forges_cibles_initiales) || !c.forges_cibles_initiales.length)
    motifs.push(`ligne ${i + 1} : forges_cibles_initiales manquant ou vide`);
  return c;
});
if (motifs.length) {
  console.error(`[REJET ATOMIQUE] ${sidecarPath} — registre intact. Motifs :\n  - ${motifs.join("\n  - ")}`);
  process.exit(1);
}

// ---- idempotence : lot déjà ingéré ? ------------------------------------------------------
const lireEv = (f) => (existsSync(f) ? readFileSync(f, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) : []);
const evenements = lireEv(registre);
if (evenements.some((e) => e.ev === "ingestion" && (e.lot_sha === lotSha || e.lot_sha === lotShaBrut))) {
  console.log(`[DÉJÀ INGÉRÉ] empreinte ${lotSha.slice(0, 12)} — 0 création (idempotence)`);
  process.exit(0);
}

// ---- frappage des ids à la suite (actifs + archive, jamais réutilisés) ---------------------
const ids = [...evenements, ...lireEv(archive)].filter((e) => e.id).map((e) => parseInt(e.id.slice(3), 10));
let prochain = (ids.length ? Math.max(...ids) : 0) + 1;
const ts = new Date().toISOString();
const nouvelles = candidatures.map((c) => {
  const score = c.score && [c.score.gain, c.score.preuve, c.score.effort].every((v) => typeof v === "number")
    ? { ...c.score, valeur: Math.round((c.score.gain * c.score.preuve / c.score.effort) * 10) / 10 }
    : { gain: 3, preuve: 1, effort: 3, valeur: 1, par_defaut: true };
  return JSON.stringify({
    ev: "creation", ts, id: `TF-${String(prochain++).padStart(4, "0")}`,
    titre: c.titre, contenu: c.contenu, demandeur: c.demandeur, source: c.source,
    date_demande: c.date_demande, statut: "candidat",
    forges_cibles_initiales: c.forges_cibles_initiales, forges_cibles_reelles: null,
    score, preuve_du_cout: c.preuve_du_cout ?? null,
    decideur: null, date_decision: null, date_correction: null, corrections_realisees: null,
    gains_constates: null, version_forge_corrigee: null, produits_beneficiaires: null,
  });
});
// La dérogation se CONSIGNE au registre, jamais seulement à l'écran : un lot entré par
// dérogation doit rester reconnaissable des années plus tard, avec la règle contournée et le
// motif. C'est le prix de b3 — la règle reste dure, le passage reste tracé.
if (derogationMotif && !reglesDerogees.length) {
  console.error("[AVERTISSEMENT] --derogation posé mais aucune règle de forme ne refusait ce lot —\n" +
    "  dérogation inutile, non consignée. Une trace décorative brouille les vraies.");
}
const evIngestion = { ev: "ingestion", ts, lot_sha: lotSha, fichier: String(sidecarPath), creations: nouvelles.length };
if (reglesDerogees.length) {
  evIngestion.derogation = { regles: [...new Set(reglesDerogees)], motif: derogationMotif, decision: "humaine" };
}
nouvelles.push(JSON.stringify(evIngestion));
appendFileSync(registre, nouvelles.join("\n") + "\n");

// ---- contrôles post-écriture ---------------------------------------------------------------
execFileSync("node", [join(ICI, "oracle-todo.mjs"), registre, archive], { encoding: "utf8" });
if (registre === resolve(join(ICI, "TODO.jsonl")))
  execFileSync("node", [join(ICI, "generer-vue.mjs")], { encoding: "utf8" });
console.log(`[OK] ${nouvelles.length - 1} candidature(s) ingérée(s) en CANDIDAT (lot ${lotSha.slice(0, 12)}) — la décision reste humaine`);
