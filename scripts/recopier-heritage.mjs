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
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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
let copies = 0, dejaConformes = 0, laisses = 0;
for (const a of contrat.artefacts) {
  const src = join(PILOT, String(a.source).replaceAll("/", "\\"));
  const dst = join(cible, String(a.cible).replaceAll("/", "\\"));
  if (a.mode !== "copie_conforme") {
    laisses += 1;
    console.log(`[LAISSÉ ] ${a.cible} — mode ${a.mode} : personnalisé par le produit, ` +
      (existsSync(dst) ? "présent" : "ABSENT (à créer par le produit depuis " + a.source + ")"));
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
  if (ESSAI) { console.log(`[COPIERAIT] ${a.cible} ← ${a.source}`); copies += 1; continue; }
  mkdirSync(dirname(dst), { recursive: true });
  writeFileSync(dst, contenu, "utf8");
  copies += 1;
  console.log(`[COPIÉ  ] ${a.cible} ← ${a.source}`);
}
console.log(`\n${ESSAI ? "ESSAI — rien écrit. " : ""}${copies} copié(s), ${dejaConformes} déjà conforme(s), ` +
  `${laisses} laissé(s) au produit (modes personnalisés).\n` +
  "Vérifier ensuite : node <PILOT_ROOT>\\oracles\\oracle-conformite-projet.mjs .  (R-47 doit passer)");
process.exit(0);
