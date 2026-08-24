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
import { readFileSync, appendFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// TF-0597 (24/08) — LES RÈGLES DE FORME NE VIVENT PLUS ICI. Elles vivent dans
// `gabarits\oracle-lot-retours.mjs`, que ce fichier IMPORTE et que l'héritage fait voyager
// jusqu'au produit (`forge\retours\oracle-lot.mjs`, mode copie_conforme). Un seul jeu de
// règles, deux endroits où le jouer : le produit AVANT de remettre, le pilot À LA PORTE.
// Deux implémentations de la même forme auraient donné deux vérités — c'est le défaut que
// TF-0474 a nommé sur les empreintes, où cinq mécanismes de scellement coexistaient sans
// format commun et où la même classe de défaut a été redécouverte forge par forge.
import { verifier as verifierFormeLot } from "../gabarits/oracle-lot-retours.mjs";

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

// ---- R-45 et R-46 : la FORME du lot remis, jugée par le module partagé ---------------------
// R-45 (21/08) exige que le lot DISE ce qu'il n'a pas remonté ; R-46 (22/08) ce que ses documents
// ont coûté au gabarit. Les deux valent au moment où le lot ENTRE, pas seulement quand il attend
// dans la boîte : une fois ingéré, il part en `old\` et `oracle-boite-entree` (B6, B7) ne le voit
// plus. Le constat et le refus se cumulent — l'un détecte ce qui traîne, l'autre empêche d'entrer.
//
// Le JUGEMENT est délégué au module partagé ; ce qui reste ici est ce qui n'appartient qu'à la
// porte : le rejet ATOMIQUE et la dérogation tracée. Portée inchangée — seuls les sidecars
// flanqués d'un `.md` homonyme sont concernés (une candidature hors lot n'a pas de lot).
{
  const lotMd = sidecarPath.replace(/\.normalise\.tf\.jsonl$/i, ".md").replace(/\.tf\.jsonl$/i, ".md");
  if (existsSync(lotMd)) {
    const forme = verifierFormeLot(lotMd);
    for (const c of forme.constats) {
      if (c.statut !== "FAIL") continue;
      if (derogee(c.regle, c.message)) continue;
      console.error(
        `[REJET ATOMIQUE] ${sidecarPath} — registre intact.\n` +
        `  - ${lotMd} : ${c.message} (${c.regle}).\n` +
        (c.remede ? `    REMÈDE : ${c.remede}\n` : "") +
        "    CE REFUS ÉTAIT ÉVITABLE, et c'est tout le point (TF-0597) : le produit peut jouer ce\n" +
        "    MÊME contrôle chez lui, AVANT de remettre son lot —\n" +
        `      node forge\\retours\\oracle-lot.mjs \"<son lot>.md\"\n` +
        "    TROIS CAUSES MESURÉES le 24/08 sur les trois produits émetteurs, et le remède diffère :\n" +
        "    (1) le produit écrit avec une COPIE du gabarit prise à la création de son run et jamais\n" +
        "        rafraîchie — les deux sections y sont entrées les 21 et 22/08. Recopier\n" +
        "        gabarits\\RETOURS-FORGES.md ET gabarits\\oracle-lot-retours.mjs dans forge\\retours\\ ;\n" +
        "    (2) le produit n'a JAMAIS reçu l'héritage — R-47 le nomme, et le geste est le même ;\n" +
        "    (3) le produit A le gabarit, à jour, et ne l'applique pas. C'est le cas le PLUS FRÉQUENT\n" +
        "        (quatre lots sur six ce jour-là) et le seul qu'aucune recopie ne répare : jouer le\n" +
        "        contrôle ci-dessus avant la remise est alors le seul remède.");
      process.exit(1);
    }
  }
}

// LES FORGES QUE LE PARC CONNAÎT, pour déduire une cible qu'un sidecar a oubliée (R-48). La table
// est ÉCRITE et non devinée : chaque motif dit ce qu'il reconnaît, et un nom hors table n'est pas
// deviné — le lot est alors refusé, ce qui est le comportement sûr.
const FORGES_CONNUES = [
  { depot: "digit-ai-factory", motif: /\b(factory|pilot|noyau|restitution|registre todo|todo-forge)\b/ },
  { depot: "digit-ai-forge-agents", motif: /\b(forge-agents|socle de rendu|page-html|check_html|render_page|skill)\b/ },
  { depot: "digit-ai-forge-tests", motif: /\b(forge-tests|plancher de rendu|pan |adaptateur)\b/ },
  { depot: "digit-ai-forge-conception", motif: /\b(forge-conception|conception|exigence)\b/ },
  { depot: "digit-ai-forge-development", motif: /\b(forge-development|development)\b/ },
  { depot: "digit-ai-forge-design", motif: /\b(forge-design|design|syst[èe]me de marque)\b/ },
  { depot: "digit-ai-forge-ops", motif: /\b(forge-ops|mep|d[ée]ploiement)\b/ },
  { depot: "digit-ai-forge-data", motif: /\b(forge-data|lineage|qualit[ée] de la donn[ée]e)\b/ },
  { depot: "digit-ai-forge-audit", motif: /\b(forge-audit|auditcore)\b/ },
  { depot: "digit-ai-forge-seo-geo", motif: /\b(forge-seo|seo|geo)\b/ },
];
const deductions = [];

// ---- validation intégrale AVANT toute écriture (rejet atomique) ----------------------------
const motifs = [];
const candidatures = lignes.map((l, i) => {
  let c;
  try { c = JSON.parse(l); } catch { motifs.push(`ligne ${i + 1} : JSON invalide`); return null; }
  if (c.schema !== 1) motifs.push(`ligne ${i + 1} : schema attendu 1, reçu ${c.schema}`);
  if (c.id) motifs.push(`ligne ${i + 1} : une candidature ne porte JAMAIS d'id (frappé à l'ingestion)`);
  for (const champ of ["titre", "contenu", "demandeur", "source", "date_demande"])
    if (!c[champ]) motifs.push(`ligne ${i + 1} : champ ${champ} manquant`);
  if (!Array.isArray(c.forges_cibles_initiales) || !c.forges_cibles_initiales.length) {
    // R-48 APPLIQUÉE À NOTRE PROPRE OUTIL (24/08) : « si deux personnes compétentes trancheraient
    // identiquement sans information supplémentaire, ce n'est pas une décision, c'est un défaut
    // d'automatisation ». Un lot dont chaque entrée NOMME sa cible dans son titre était refusé en
    // bloc, et le produit devait le remettre pour un champ que le texte disait déjà. Mesuré le
    // 24/08 : trois entrées d'un lot, les trois nommant la factory, rejet atomique.
    //
    // On DÉDUIT donc, et on le DIT — la déduction s'inscrit dans la source de la candidature, pour
    // qu'un lecteur sache que ce champ n'a pas été rempli par l'émetteur. Ce qui n'est PAS déductible
    // reste refusé : on ne devine jamais une cible qu'aucun mot ne nomme.
    // UN ALIAS DE CHAMP VAUT MIEUX QU'UN REJET, et c'est le cas réel qui l'a montré : le lot écrivait
    // `forge_cible: "pilot"` — au singulier, sans le suffixe `_initiales`. Le champ EXISTAIT, sous un
    // autre nom, et le lot était refusé en bloc pour une information qu'il portait. Deux lecteurs
    // compétents traduisent identiquement « pilot » en « digit-ai-factory » : c'est donc un défaut
    // d'automatisation, pas une décision (R-48). L'alias est lu d'abord, le texte en dernier recours.
    const alias = [c.forge_cible, c.forges_cibles, c.cible].filter(Boolean).flat()
      .map((x) => String(x).trim().toLowerCase())
      .map((x) => (/^(pilot|factory|noyau)$/.test(x) ? "digit-ai-factory"
        : /^forge-/.test(x) ? `digit-ai-${x}`
        : /^digit-ai/.test(x) ? x : null))
      .filter(Boolean);
    const texte = `${c.titre || ""} ${c.contenu || ""}`.toLowerCase();
    const deduites = alias.length ? alias
      : FORGES_CONNUES.filter(({ motif }) => motif.test(texte)).map(({ depot }) => depot);
    if (deduites.length) {
      c.forges_cibles_initiales = [...new Set(deduites)];
      c.source = `${c.source} · [déduit à l'ingestion] forges_cibles_initiales absent du sidecar, ` +
        `dérivé du texte de l'entrée : ${c.forges_cibles_initiales.join(", ")} (R-48 — la réponse se ` +
        `déduisait du contexte, la refuser aurait coûté un aller-retour pour un champ que le titre disait)`;
      deductions.push(`ligne ${i + 1} → ${c.forges_cibles_initiales.join(", ")}`);
    } else {
      motifs.push(`ligne ${i + 1} : forges_cibles_initiales manquant, et AUCUN mot de l'entrée ne nomme une forge — on ne devine pas une cible que rien ne nomme`);
    }
  }
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

// ---- POST-CONTRÔLE anti-collision (TF-0481, 22/08/2026) -----------------------------------
// Le préflight de TF-0394 regarde AVANT d'écrire : il refuse quand le distant a déjà avancé. Il ne
// peut rien contre la fenêtre qui s'ouvre PENDANT l'ingestion — deux sessions qui frappent les
// mêmes numéros avant que l'une ait poussé. Cette fenêtre a été payée TROIS FOIS, dont deux le
// 22/08 : cinq candidatures renumérotées le matin, un `TF-0514` frappé ici pendant qu'une autre
// session publiait le sien le soir.
//
// Ce post-contrôle ne la ferme pas — il la RACCOURCIT, en la faisant voir tout de suite au lieu de
// la découvrir à la main plus tard. Il ne peut pas échouer : l'écriture est faite, et annuler
// ferait perdre le travail d'ingestion. Il AVERTIT, nomme les ids en cause, et donne la commande
// qui répare. C'est la différence entre un défaut qu'on subit et un défaut qu'on voit.
if (!process.argv.includes("--sans-fetch") && nouvelles.length > 1) {
  const frappes = nouvelles.slice(0, -1).map((l) => { try { return JSON.parse(l).id; } catch { return null; } }).filter(Boolean);
  try {
    execFileSync("git", ["-C", todoDir, "fetch", "--quiet", "origin"], { stdio: "ignore", timeout: 20000 });
    const distant = execFileSync("git", ["-C", todoDir, "show", "origin/main:todo/TODO.jsonl"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const pris = frappes.filter((id) => distant.includes('"id":"' + id + '"'));
    if (pris.length) {
      console.error(`[COLLISION TF-0481] ${pris.length} id(s) frappé(s) ici sont DÉJÀ PRIS sur origin : ${pris.join(", ")}.\n` +
        "  Une autre session les a publiés pendant cette ingestion — le préflight ne pouvait pas le voir, il regarde AVANT.\n" +
        "  L'ingestion locale est écrite et n'est PAS annulée. Réparer avec, pour chaque id :\n" +
        pris.map((id) => `    node todo\\renumeroter.mjs ${id} TF-XXXX --motif "collision avec une session parallèle le <date>"`).join("\n") +
        "\n  Choisir XXXX au-delà du max des DEUX registres (local et origin), puis régénérer les vues.");
    }
  } catch {
    console.error("[post-contrôle TF-0481] comparaison origin impossible (hors ligne ? remote absent ?) — collision inter-sessions NON vérifiée après écriture");
  }
}

// ---- contrôles post-écriture ---------------------------------------------------------------
execFileSync("node", [join(ICI, "oracle-todo.mjs"), registre, archive], { encoding: "utf8" });
if (registre === resolve(join(ICI, "TODO.jsonl")))
  execFileSync("node", [join(ICI, "generer-vue.mjs")], { encoding: "utf8" });
// ---- R-47 à l'arrivée d'un lot : refermer le cercle (23/08/2026) ---------------------------
// Le diagnostic du 23/08, et c'est lui qui compte plus que la règle elle-même. Le défaut
// d'héritage d'Produit-02 était DÉJÀ VU par `oracle-conformite-projet` — R-43 rendait
// FAIL, mot pour mot : « précédence de la factory non câblée ». L'oracle existait, il voyait,
// et personne ne l'a joué. Il n'est déclenché qu'à l'OUVERTURE d'un run et à sa CLÔTURE ; entre
// les deux, le seul mécanisme qui pourrait le rejouer est le hook de la factory installé chez
// le produit — or ce hook fait partie des artefacts manquants. Le contrôle dépendait donc d'un
// artefact dont il était lui-même le seul juge : un cercle, et rien ne le rompait.
//
// Ce qui suit rompt le cercle en câblant le contrôle à un moment que le PILOT maîtrise, sans
// rien attendre de ce qui est installé ailleurs : un produit qui remet un lot se nomme. On joue
// alors la conformité de son héritage et on la DIT.
//
// AVERTISSEMENT, jamais blocage, et le motif tient en une phrase : refuser l'ingestion parce
// que le produit n'a pas ses gabarits punirait deux fois le même défaut — une fois à la porte,
// une fois sur le travail déjà fait. C'est exactement ce que les quinze candidatures refusées
// en trois jours ont coûté.
// Borne : R-47 ne parle que des LOTS DE RETOURS, dont le nom porte le produit. Une candidature
// hors lot n'a pas de produit a juger, et crier dessus apprendrait a ignorer le message.
const nomFichier = String(sidecarPath).split(/[\\\/]/).pop() || "";
if (nouvelles.length > 1 && nomFichier.includes(" - RETOURS - ")) {
  const projet = nomFichier.split(" - RETOURS - ")[0];
  const racine = process.env.FORGE_ROOT || join(ICI, "..", "..");
  let dossier = null;
  // LE SIDECAR PEUT DIRE OU IL HABITE, ET C'EST LA SEULE SOURCE SURE (TF-0555, 24/08). La
  // recherche ci-dessous DEVINE ; le produit, lui, SAIT. Un sidecar qui porte `racine_produit`
  // court-circuite donc toute heuristique — c'est la voie recommandee par le lot qui a signale le
  // defaut, et elle ne coute qu'un champ.
  const declaree = nouvelles.map((n) => n && n.racine_produit).find(Boolean);
  if (declaree) {
    const abs = isAbsolute(String(declaree)) ? String(declaree) : join(racine, String(declaree));
    if (existsSync(join(abs, "forge"))) dossier = abs;
    else console.error(`[R-47] le sidecar declare racine_produit = « ${declaree} », introuvable ou sans forge\ — on ne la suit pas les yeux fermes`);
  }
  try {
    // DEUX NIVEAUX, ET LE SECOND A ETE PAYE. La recherche ne regardait que les ENFANTS DIRECTS de
    // la racine. Or 22 produits du parc vivent sous un dossier de rangement client (`_Client-A\`) :
    // tous etaient hors de portee. Le lot qui a signale ce defaut portait un produit dans ce cas,
    // et le meme oracle pointe A LA MAIN sur son dossier rendait R-43 FAIL et R-47 FAIL avec deux
    // artefacts absents — le defaut que la regle devait rattraper etait donc VIVANT, et le
    // mecanisme cense le voir regardait ailleurs.
    const enfants = (d) => { try { return readdirSync(d, { withFileTypes: true }).filter((x) => x.isDirectory()); } catch { return []; } };
    const correspond = (nom) => nom.toLowerCase().startsWith(projet.toLowerCase());
    const candidats = [];
    for (const d1 of enfants(racine)) {
      const c1 = join(racine, d1.name);
      if (correspond(d1.name)) candidats.push(c1);
      // Un dossier de RANGEMENT n'est pas un produit : il n'a pas de `forge\`, et on descend d'un
      // cran. Borne a deux niveaux — au-dela, on balaierait le disque pour deviner.
      if (!existsSync(join(c1, "forge"))) {
        for (const d2 of enfants(c1)) if (correspond(d2.name)) candidats.push(join(c1, d2.name));
      }
    }
    dossier = dossier
      || candidats.find((c) => existsSync(join(c, "forge")))
      || candidats.map((c) => join(c, "projet")).find((c) => existsSync(join(c, "forge")))
      || null;
  } catch { /* racine illisible : on ne devine pas */ }
  if (!projet || !dossier) {
    // Silence assumé et DIT : un produit qu'on ne localise pas sur ce poste n'est pas un produit
    // en défaut. Le contraire ferait crier l'ingestion sur toutes les remises venues d'ailleurs.
    console.error(`[R-47] conformité de l'héritage NON vérifiée pour « ${projet || "?"} » — dossier introuvable sous ${racine}. Ce n'est pas un constat sur le produit, c'est l'absence d'une cible à juger.`);
    // UNE VÉRIFICATION NON FAITE QUI NE LAISSE PAS DE TRACE EST UNE VÉRIFICATION QU'ON CROIT FAITE
    // (TF-0555, 24/08). Le message ci-dessus partait au seul flux d'erreur : il disparaissait avec
    // la session. Le registre en garde donc une ligne, avec le nom cherché et la racine balayée —
    // de quoi savoir, six mois plus tard, que ce lot est entré sans que l'héritage soit jugé.
    // Même type d'événement que l'ingestion (le registre n'en accepte pas d'autre sans identifiant)
    // et SANS `creations` : cette ligne ne couvre aucune candidature, elle consigne un silence.
    appendFileSync(registre, JSON.stringify({
      ev: "ingestion", ts: new Date().toISOString(), lot_sha: lotSha, fichier: String(sidecarPath),
      heritage_non_verifie: { projet: projet || null, racine: String(racine),
        motif: "produit introuvable sur ce poste — cible absente, aucun constat sur le produit" },
    }) + "\n");
  } else {
    const r = spawnSync(process.execPath, [join(ICI, "..", "oracles", "oracle-conformite-projet.mjs"), dossier],
      { encoding: "utf8", timeout: 120000 });
    let f = null;
    try { const j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); f = (j.findings || []).find((x) => x.regle === "R-47"); } catch { /* verdict illisible */ }
    if (!f) console.error(`[R-47] verdict d'héritage illisible pour ${dossier} — non vérifié, jamais supposé bon`);
    else if (f.statut === "FAIL") console.error(`[R-47 — AVERTISSEMENT] ${projet} : ${f.message}\n  Le lot est INGÉRÉ quand même : refuser ici punirait deux fois le même défaut.`);
    else console.error(`[R-47] ${projet} : ${f.statut === "PASS" ? f.message : f.message}`);
  }
}

if (deductions.length) {
  // Loi n° 3 : une décision prise d'office se DIT. Sans cette ligne, un champ rempli par
  // déduction serait indiscernable d'un champ rempli par l'émetteur.
  console.error(`[R-48 · décidé d'office] forges_cibles_initiales DÉDUIT pour ${deductions.length} ` +
    `candidature(s), la déduction est écrite dans leur champ « source » : ${deductions.join(" · ")}`);
}
console.log(`[OK] ${nouvelles.length - 1} candidature(s) ingérée(s) en CANDIDAT (lot ${lotSha.slice(0, 12)}) — la décision reste humaine`);
