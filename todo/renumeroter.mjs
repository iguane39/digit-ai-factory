#!/usr/bin/env node
/**
 * renumeroter.mjs — renumérote un id TF qui a COLLISIONNÉ avec une autre session (TF-0481).
 *
 * POURQUOI CET OUTIL EXISTE, et ce qu'il ne prétend pas être. Le préflight de TF-0394 refuse une
 * ingestion quand le registre distant a AVANCÉ — c'est juste, et ça reste. Mais c'est un
 * check-then-act : il voit une divergence DÉJÀ POUSSÉE, il ne peut rien contre deux sessions qui
 * frappent les mêmes numéros AVANT que l'une ait poussé. La fenêtre a été payée TROIS FOIS :
 *   · avant TF-0394 (première renumérotation manuelle, qui a motivé l'item) ;
 *   · le 22/08 au matin — cinq candidatures renumérotées, trois commits de rattrapage ;
 *   · le 22/08 au soir — `TF-0514` frappé ici pendant qu'une autre session publiait son propre
 *     `TF-0514`, renuméroté en `TF-0515` À LA MAIN, en éditant du JSON.
 *
 * Le coût mesuré n'est donc PAS la collision : c'est la RENUMÉROTATION MANUELLE. Cet outil la rend
 * bon marché et traçable — une commande au lieu d'une édition à la main, et le motif consigné DANS
 * l'item, parce qu'un identifiant qui change sans que la raison soit lisible vaut moins qu'un
 * identifiant absent.
 *
 * CE QU'IL NE FAIT PAS, et c'est déclaré : il ne FERME PAS la fenêtre. Les deux voies qui la
 * fermeraient ont été écartées et il vaut mieux dire pourquoi que les laisser croire possibles.
 *   · « frapper les ids au push » suppose que l'ingestion n'écrive plus de numéro, donc que tout
 *     l'outillage aval (vues, oracle, TODO-PRODUIT) sache travailler sur des lots sans id : ce
 *     n'est pas un correctif, c'est un changement de modèle ;
 *   · « réserver un bloc atomiquement sur origin » marcherait — la mise à jour d'une référence git
 *     EST un compare-and-swap — mais elle exige de POUSSER pendant l'ingestion, et R-38 réserve le
 *     push au GO humain. Un outil qui publie sans GO pour se protéger d'une collision échangerait
 *     un défaut contre une violation.
 *
 * Usage :
 *   node todo\renumeroter.mjs <ancien> <nouveau> --motif "<pourquoi>" [--registre <TODO.jsonl>]
 *   node todo\renumeroter.mjs --essai …      affiche ce qui serait réécrit, n'écrit rien
 *
 * Garanties :
 *   · REFUS si l'ancien id est absent, si le nouveau est DÉJÀ PRIS (registre actif ou archive),
 *     ou si le motif fait moins de 30 caractères — une renumérotation sans raison lisible est
 *     exactement le défaut qu'on veut éviter ;
 *   · le motif est consigné dans le champ `source` de l'événement de création, à la suite de ce
 *     qui y était : l'histoire ne se réécrit pas, elle s'annote ;
 *   · écriture ATOMIQUE au sens du verdict — si `oracle-todo` passait avant et échoue après, le
 *     fichier est remis exactement dans son état d'origine.
 *
 * Sortie : JSON {outil, ancien, nouveau, lignes_reecrites, verdict_avant, verdict_apres} · exit 0/1.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
const ESSAI = args.includes("--essai");
const REGISTRE = valeur("--registre") || join(ICI, "TODO.jsonl");
const ARCHIVE = join(dirname(REGISTRE), "TODO-ARCHIVE.jsonl");
const ORACLE = join(ICI, "oracle-todo.mjs");
const MOTIF_MIN = 30;

const positionnels = args.filter((a) => /^TF-\d{3,4}$/.test(a));
const [ancien, nouveau] = positionnels;
const motif = (valeur("--motif") || "").trim();

function sortir(code, corps) {
  process.stdout.write(JSON.stringify({ outil: "renumeroter", ...corps }, null, 1) + "\n");
  process.exit(code);
}

if (!ancien || !nouveau) {
  sortir(1, { message: 'usage : node renumeroter.mjs <TF-ancien> <TF-nouveau> --motif "<pourquoi>" [--registre <f>] [--essai]' });
}
if (ancien === nouveau) sortir(1, { message: "ancien et nouveau id identiques — rien à faire" });
if (motif.length < MOTIF_MIN) {
  sortir(1, {
    message: `motif absent ou trop court (${motif.length} caractères, minimum ${MOTIF_MIN}) — ` +
      "un identifiant qui change sans que la raison soit lisible vaut moins qu'un identifiant absent. " +
      "Dire QUI d'autre a pris le numéro, et QUAND.",
  });
}
if (!existsSync(REGISTRE)) sortir(1, { message: `registre introuvable : ${REGISTRE}` });

const lignesRegistre = readFileSync(REGISTRE, "utf8").split(/\r?\n/);
const lignesArchive = existsSync(ARCHIVE) ? readFileSync(ARCHIVE, "utf8").split(/\r?\n/) : [];
const porte = (lignes, id) => lignes.some((l) => l.includes(`"id":"${id}"`));

if (!porte(lignesRegistre, ancien)) sortir(1, { message: `${ancien} absent du registre actif — rien à renuméroter` });
if (porte(lignesRegistre, nouveau) || porte(lignesArchive, nouveau)) {
  sortir(1, { message: `${nouveau} est DÉJÀ PRIS (registre actif ou archive) — renuméroter dessus créerait la collision qu'on répare` });
}

const verdict = (f) => {
  const r = spawnSync(process.execPath, [ORACLE, f], { encoding: "utf8" });
  try { return JSON.parse(r.stdout || "{}").verdict || "ILLISIBLE"; } catch { return "ILLISIBLE"; }
};

let reecrites = 0;
const sorties = lignesRegistre.map((l) => {
  if (!l.trim() || !l.includes(`"id":"${ancien}"`)) return l;
  let o;
  try { o = JSON.parse(l); } catch { return l; }
  o.id = nouveau;
  // Le motif s'annote à la SOURCE de la création : c'est là qu'un lecteur cherche d'où vient
  // l'item, donc là qu'il doit lire pourquoi son numéro a changé.
  if (o.ev === "creation") {
    const suffixe = ` ; RENUMÉROTÉ de ${ancien} en ${nouveau} : ${motif}`;
    o.source = (o.source || "") + suffixe;
  }
  reecrites++;
  return JSON.stringify(o);
});

if (ESSAI) {
  sortir(0, { ancien, nouveau, lignes_reecrites: reecrites, message: "essai — rien écrit" });
}

const avant = verdict(REGISTRE);
const sauvegarde = REGISTRE + ".renum.bak";
copyFileSync(REGISTRE, sauvegarde);
writeFileSync(REGISTRE, sorties.join("\n"), "utf8");
const apres = verdict(REGISTRE);

if (avant === "PASS" && apres !== "PASS") {
  copyFileSync(sauvegarde, REGISTRE);
  unlinkSync(sauvegarde);
  sortir(1, {
    ancien, nouveau, lignes_reecrites: 0, verdict_avant: avant, verdict_apres: apres,
    message: `le registre passait et ne passe plus (${apres}) — renumérotation ANNULÉE, fichier repris à l'identique. ` +
      "Jouer `node todo\\oracle-todo.mjs` pour lire le constat.",
  });
}
unlinkSync(sauvegarde);
sortir(0, {
  ancien, nouveau, lignes_reecrites: reecrites, verdict_avant: avant, verdict_apres: apres,
  message: `${reecrites} ligne(s) réécrite(s) — penser à régénérer les vues (generer-vue.mjs, generer-page.mjs)` +
    (avant !== "PASS" ? ` — ATTENTION : le registre était déjà ${avant} avant cette écriture` : ""),
});
