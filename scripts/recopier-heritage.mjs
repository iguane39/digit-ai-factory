#!/usr/bin/env node
/**
 * recopier-heritage.mjs — LE GESTE UNIQUE qui remet l'héritage d'un produit à niveau
 * (TF-0711, 01/09/2026).
 *
 * QUI L'EXÉCUTE, ET C'EST LA FRONTIÈRE : **le produit, jamais le pilot.** « Seuls les produits
 * se modifient eux-mêmes » (mandat humain du 23/08) — ce script est un outil que le pilot MET À
 * DISPOSITION, comme il met ses oracles ; une session produit le lance depuis son propre dépôt :
 *
 *   node <PILOT_ROOT>\scripts\recopier-heritage.mjs .          (depuis la racine du produit)
 *   node <PILOT_ROOT>\scripts\recopier-heritage.mjs . --essai  (montre, n'écrit rien)
 *
 * POURQUOI IL EXISTE. Avant lui, « recopier depuis le pilot » était une consigne en prose au
 * message de R-47 : le produit recopiait artefact par artefact, à la main, et deux dérives du
 * même gabarit en une heure ont été mesurées le 30/08 — la copie posée à 08:56 était périmée à
 * 09:12. Un geste unique qui recopie TOUT ce que HERITAGE.json déclare rend la remise à niveau
 * aussi rapide que la dérive.
 *
 * CE QU'IL COPIE, ET RIEN D'AUTRE : les artefacts en mode `copie_conforme` — ceux que le
 * produit ne personnalise JAMAIS. Les modes `presence` et `presence_et_motif(s)` sont
 * légitimement adaptés au projet : les écraser détruirait la personnalisation, ils sont LISTÉS
 * avec leur état et laissés intacts.
 *
 * GARDES : refuse un dossier sans `forge\` (un dépôt jamais instancié n'hérite de rien —
 * l'instanciation est un run, pas une recopie) ; refuse de s'exécuter sur le pilot lui-même.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { estCouvertParPlusLarge } from "./relever-heritage.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(join(ICI, ".."));
const args = process.argv.slice(2);
const ESSAI = args.includes("--essai");
const dossier = args.find((a) => !a.startsWith("--"));

if (!dossier || !existsSync(dossier)) {
  console.error("usage : node <PILOT_ROOT>\\scripts\\recopier-heritage.mjs <racine du produit> [--essai]\n" +
    "  À lancer PAR LE PRODUIT, depuis son dépôt — le pilot n'écrit jamais chez un produit.");
  process.exit(2);
}
const cible = resolve(dossier);
if (cible === PILOT) {
  console.error("[REFUS] la cible est le pilot lui-même — ce geste remet un PRODUIT à niveau, il ne recopie pas le pilot sur le pilot.");
  process.exit(2);
}
if (!existsSync(join(cible, "forge"))) {
  console.error(`[REFUS] ${cible} ne porte pas de forge\\ — ce dépôt n'a jamais été instancié par le pilot, il n'hérite de rien.\n` +
    "  L'instanciation est un RUN (socle projet, git, oracle de conformité), pas une recopie d'artefacts.");
  process.exit(2);
}

const contrat = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
const norm = (s) => String(s).split("\r\n").join("\n").trimEnd();

// ---- TF-0852 (b) · UNE GARDE QUI VIT DANS UN MANDAT NE PROTÈGE QUE LA SESSION QUI L'A REÇU ----
//
// Ce script écrivait (`writeFileSync`) sans consulter ni les modifications non commises, ni les
// fichiers non suivis. La garde EXISTAIT — dans la PROSE du mandat humain qui accompagnait le lot
// du 05/09 : « si le script veut écraser un fichier modifié localement, arrête-toi ». Donc chez
// l'opérateur, pas dans l'outil. Le mode `--essai` faisait déjà le travail et RIEN ne l'appelait
// avant le geste, ni le message de R-47 ni le lot. Désormais : une cible modifiée-non-commise, ou
// non suivie et divergente, fait basculer le geste entier en essai — il liste, il n'écrit pas — et
// demande `--forcer`. Le cas nominal n'est pas ralenti d'une milliseconde.
const FORCER = args.includes("--forcer");
const gitProduit = (...a) => spawnSync("git", ["-C", cible, ...a], { encoding: "utf8", timeout: 20000 });
const aGitProduit = existsSync(join(cible, ".git")) && gitProduit("rev-parse", "--git-dir").status === 0;
/** Une cible risque-t-elle de PERDRE du travail si on l'écrase ? Le motif est rendu, jamais deviné. */
function risqueDEcrasement(dst) {
  if (!aGitProduit || !existsSync(dst)) return null;
  const rel = relative(cible, dst).replaceAll("\\", "/");
  if (gitProduit("ls-files", "--error-unmatch", "--", rel).status !== 0) {
    return `${rel} — présent et NON SUIVI par git : rien ne le rattraperait après écrasement`;
  }
  if (gitProduit("diff", "--quiet", "HEAD", "--", rel).status === 1) {
    return `${rel} — MODIFIÉ et non commis : l'écraser perd un travail qui n'est dans aucune histoire`;
  }
  return null;
}
const risques = contrat.artefacts
  .map((a) => risqueDEcrasement(join(cible, String(a.cible).replaceAll("/", "\\"))))
  .filter(Boolean);
let ESSAI_FORCE = false;
if (risques.length && !FORCER && !ESSAI) {
  ESSAI_FORCE = true;
  console.log(`[GARDE] ${risques.length} cible(s) porteraient une perte à l'écrasement — le geste passe en ESSAI :\n  - ` +
    risques.join("\n  - ") +
    "\n  Lire la différence, la commettre ou la jeter, puis relancer. Pour écraser malgré tout : --forcer.\n");
}
const SANS_ECRITURE = ESSAI || ESSAI_FORCE;

let copies = 0, dejaConformes = 0, laisses = 0, instancies = 0, completes = 0;
const ecrits = [];   // TF-0851 : ce que ce geste laisse au dépôt, nommé pour être commis
for (const a of contrat.artefacts) {
  const src = join(PILOT, String(a.source).replaceAll("/", "\\"));
  const dst = join(cible, String(a.cible).replaceAll("/", "\\"));
  if (a.mode !== "copie_conforme") {
    // ---- TF-0850 · UN ARTEFACT PERSONNALISABLE **ABSENT** N'A RIEN À PROTÉGER --------------
    //
    // Le script listait et LAISSAIT tous les modes personnalisés, y compris quand le fichier
    // était ABSENT chez le produit — c'est-à-dire quand il n'y avait aucune personnalisation à
    // préserver. Le message de R-47 promettait pourtant « remise à niveau EN UN GESTE » : joué,
    // le geste laissait R-47 en FAIL. Mesure du 06/09, identique chez TROIS produits traités
    // l'un après l'autre : « 7 copiés, 0 déjà conformes, 6 laissés » — et QUATRE des six laissés
    // maintenaient R-47 rouge. Coût direct : 12 gestes manuels, dont une édition de `.gitignore`
    // où l'ORDRE des lignes décide du résultat.
    //
    // NE RIEN ÉCRASER DÈS QU'UN FICHIER EST PRÉSENT RESTE LA RÈGLE : c'est la garde qui donne sa
    // valeur au script. Ce qui change est le cas ABSENT — l'instancier depuis le gabarit est
    // strictement correct, et c'est exactement ce que le produit refaisait à la main.
    if (!existsSync(dst) && existsSync(src)) {
      if (SANS_ECRITURE) { console.log(`[INSTANCIERAIT] ${a.cible} ← ${a.source} (absent : rien à préserver)`); instancies += 1; continue; }
      mkdirSync(dirname(dst), { recursive: true });
      writeFileSync(dst, readFileSync(src, "utf8"), "utf8");
      instancies += 1;
      ecrits.push(a.cible);
      console.log(`[INSTANCIÉ] ${a.cible} ← ${a.source} (mode ${a.mode}, absent chez le produit : rien à préserver — à personnaliser ensuite)`);
      continue;
    }
    // Mode `presence_et_motifs` PRÉSENT mais incomplet : les motifs manquants s'AJOUTENT en fin
    // de fichier, jamais par écrasement. L'avertissement sur l'ORDRE n'est pas décoratif — chez
    // un produit, insérer trois graphies APRÈS `!forge/**` aurait ré-ignoré onze fichiers que le
    // dépôt portait déjà (TF-0850).
    if (a.mode === "presence_et_motifs" && existsSync(dst)) {
      const lignes = new Set(readFileSync(dst, "utf8").split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith("#")));
      const absents = (a.motifs_exiges || []).filter((m) => !lignes.has(m) && !estCouvertParPlusLarge(m, lignes));
      if (absents.length) {
        if (SANS_ECRITURE) { console.log(`[COMPLÉTERAIT] ${a.cible} — ${absents.length} motif(s) du socle à AJOUTER en fin de fichier : ${absents.join(", ")}`); completes += 1; continue; }
        const avant = readFileSync(dst, "utf8");
        writeFileSync(dst, avant.replace(/\s*$/, "\n") + `\n# socle du pilot (HERITAGE.json), ajouté le ${new Date().toISOString().slice(0, 10)}\n`
          + absents.join("\n") + "\n", "utf8");
        completes += 1;
        ecrits.push(a.cible);
        console.log(`[COMPLÉTÉ] ${a.cible} — ${absents.length} motif(s) AJOUTÉ(S) en fin de fichier : ${absents.join(", ")}`);
        console.log("           ATTENTION : dans un .gitignore, l'ORDRE décide du résultat — une exclusion posée APRÈS une ré-inclusion (`!forge/**`) la referme. Relire la fin du fichier.");
        continue;
      }
    }
    laisses += 1;
    console.log(`[LAISSÉ ] ${a.cible} — mode ${a.mode} : personnalisé par le produit, présent`);
    continue;
  }
  if (!existsSync(src)) { console.error(`[SOURCE ABSENTE] ${a.source} — rien à copier, le contrat est en avance sur le pilot`); continue; }
  const contenu = readFileSync(src, "utf8");
  if (existsSync(dst) && norm(readFileSync(dst, "utf8")) === norm(contenu)) {
    dejaConformes += 1;
    console.log(`[CONFORME] ${a.cible}`);
    continue;
  }
  // TF-0710 : une copie conforme sous l'ALIAS de transition n'est pas un défaut — elle est
  // dite, et la migration vers le nom canonique reste le choix du produit (retirer l'ancien
  // fichier est un geste git qui lui appartient).
  if (!existsSync(dst) && a.alias_accepte) {
    const alias = join(cible, String(a.alias_accepte).replaceAll("/", "\\"));
    if (existsSync(alias) && norm(readFileSync(alias, "utf8")) === norm(contenu)) {
      dejaConformes += 1;
      console.log(`[CONFORME] ${a.alias_accepte} (alias de transition de ${a.cible} — migrer vers le nom canonique quand vous le déciderez)`);
      continue;
    }
  }
  if (SANS_ECRITURE) { console.log(`[COPIERAIT] ${a.cible} ← ${a.source}`); copies += 1; continue; }
  mkdirSync(dirname(dst), { recursive: true });
  writeFileSync(dst, contenu, "utf8");
  copies += 1;
  ecrits.push(a.cible);
  console.log(`[COPIÉ  ] ${a.cible} ← ${a.source}`);
}
console.log(`\n${SANS_ECRITURE ? (ESSAI ? "ESSAI — rien écrit. " : "GARDE — rien écrit (relancer avec --forcer, ou traiter les cibles listées). ") : ""}` +
  `${copies} copié(s), ${instancies} instancié(s) depuis leur gabarit, ${completes} complété(s), ` +
  `${dejaConformes} déjà conforme(s), ${laisses} laissé(s) au produit (présents et personnalisés).`);

// ---- TF-0851 (2) · LE GESTE REND COMPTE DE CE QU'IL LAISSE AU DÉPÔT --------------------------
//
// Un artefact recopié arrive sur le DISQUE ; rien ne le fait entrer dans l'histoire git, et le
// relevé qui juge le produit lit ce même disque. Un produit peut donc rendre PASS pendant des
// mois alors qu'aucune ligne de son dépôt ne porte l'héritage — et un clone neuf repartirait en
// défaut. Le commit reste la décision du produit ; ce qui manquait, c'est qu'il soit PROPOSÉ. Le
// script sait déjà nommer ce qu'il a écrit : il le liste.
if (ecrits.length && !SANS_ECRITURE) {
  const rels = ecrits.map((c) => `"${c}"`).join(" ");
  console.log(`\nUNE RECOPIE N'EST TENUE QU'UNE FOIS COMMISE — ce geste a écrit ${ecrits.length} fichier(s) sur le disque ;`);
  console.log(`votre dépôt ne les porte pas encore :\n  git add ${rels}\n  git commit -m "Heritage du pilot remis a niveau (HERITAGE.json v${contrat.version})"`);
  if (aGitProduit) {
    const etat = gitProduit("status", "--porcelain", "--", ...ecrits.map((c) => c.replaceAll("/", "\\")));
    const lignes = (etat.stdout || "").split(/\r?\n/).filter(Boolean);
    if (lignes.length) console.log(`  état git des cibles écrites :\n    ${lignes.join("\n    ")}`);
  }
}
console.log("\nVérifier ensuite : node <PILOT_ROOT>\\oracles\\oracle-conformite-projet.mjs .  (R-47 doit passer)");
process.exit(0);
