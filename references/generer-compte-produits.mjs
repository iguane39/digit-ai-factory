#!/usr/bin/env node
/**
 * generer-compte-produits.mjs — recalcule le compte de `references\PRODUITS.md` (TF-1474,
 * 02/10/2026) depuis le registre, au lieu de le laisser écrit à la main.
 *
 * LE FAIT. `oracle-fraicheur-doc` (claim `produits-connus-du-registre`) juge que le chiffre écrit
 * en prose — « **17 produits connus du registre** » — doit égaler le compte RÉEL de pseudonymes
 * `Produit-NN` distincts cités par un événement `creation` (champs `demandeur` ou `source`) de
 * `todo\TODO.jsonl` et `todo\TODO-ARCHIVE.jsonl`. Rejoué le 02/10/2026 : le document citait
 * toujours 17, la source en comptait 23 — resté FAIL depuis le rapport de l'agent « harnais » du
 * 28/09/2026 (campagne D-32 (a)), jamais rejoué depuis.
 *
 * CE QUE CE SCRIPT FAIT, ET RIEN DE PLUS : il recompte selon EXACTEMENT la même règle que la sonde
 * `compter_distincts_jsonl` d'`oracles\oracle-fraicheur-doc.mjs` (motif `Produit-\d{2}(?!\d)`), et
 * remplace le SEUL chiffre de la phrase « Le registre connaît **N produits connus du registre**… ».
 * Il ne touche PAS le tableau qui suit — une ligne par produit, première/dernière remontée, compte
 * de créations, état déclaré — dont la mise à jour reste un geste séparé et documenté par le
 * fichier lui-même (« le jour où un produit neuf remet son premier lot… sa ligne [s'ajoute] ici »).
 *
 * Usage : node references\generer-compte-produits.mjs [--verifier] [--racine <dépôt>]
 *   --verifier : n'écrit rien, exit 1 si le chiffre a dérivé (même esprit que --check ailleurs).
 *   --racine : dépôt à lire/écrire au lieu du pilot courant — c'est par là que la recette fabrique
 *   un pilot jetable, même idiome que `--racine` de todo\journaliser.mjs.
 * Exit : 0 = écrit ou conforme · 1 = dérive constatée en --verifier · 2 = registre illisible.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT_PAR_DEFAUT = join(ICI, "..");
const MOTIF_LIGNE = /(\*\*)(\d+)( produits connus du registre\*\*)/;

/** Le même calcul que la sonde `compter_distincts_jsonl` de oracle-fraicheur-doc.mjs, isolé pour
 *  être réutilisé ici sans dépendre de tout l'oracle. */
export function compterProduitsDistincts(racine = PILOT) {
  const motif = /Produit-\d{2}(?!\d)/g;
  const vus = new Set();
  for (const f of ["todo/TODO.jsonl", "todo/TODO-ARCHIVE.jsonl"]) {
    const chemin = join(racine, f);
    if (!existsSync(chemin)) continue;
    for (const ligne of readFileSync(chemin, "utf8").split("\n")) {
      if (!ligne.trim()) continue;
      let o;
      try { o = JSON.parse(ligne); } catch { continue; }
      if (!o || o.ev !== "creation") continue;
      for (const champ of ["demandeur", "source"]) {
        for (const m of String(o[champ] ?? "").matchAll(motif)) vus.add(m[0]);
      }
    }
  }
  return vus.size;
}

const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const VERIFIER = args.includes("--verifier");
  const iRacine = args.indexOf("--racine");
  const RACINE = iRacine >= 0 ? args[iRacine + 1] : PILOT_PAR_DEFAUT;
  const DOC = join(RACINE, "references", "PRODUITS.md");
  if (!existsSync(DOC)) { console.error(`introuvable : ${DOC}`); process.exit(2); }
  const texte = readFileSync(DOC, "utf8");
  const m = texte.match(MOTIF_LIGNE);
  if (!m) { console.error("la phrase « N produits connus du registre » n'est plus reconnue dans references\\PRODUITS.md — motif à relire"); process.exit(2); }
  const compte = compterProduitsDistincts(RACINE);
  const cite = Number(m[2]);
  if (cite === compte) {
    console.log(`references\\PRODUITS.md : conforme, ${compte} produits connus du registre`);
    process.exit(0);
  }
  if (VERIFIER) {
    console.error(`references\\PRODUITS.md : document cite ${cite}, la source constate ${compte} — relancer sans --verifier pour corriger`);
    process.exit(1);
  }
  const corrige = texte.replace(MOTIF_LIGNE, `$1${compte}$3`);
  writeFileSync(DOC, corrige, "utf8");
  console.log(`references\\PRODUITS.md : chiffre corrigé ${cite} → ${compte}`);
  process.exit(0);
}
