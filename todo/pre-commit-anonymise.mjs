#!/usr/bin/env node
/**
 * pre-commit-anonymise.mjs — LE NOM EST RETIRÉ AVANT QUE LE COMMIT N'EXISTE (TF-0980).
 *
 * ============================================================================================
 * POURQUOI UNE BARRIÈRE DE PLUS, ET POURQUOI À CET ENDROIT
 * ============================================================================================
 *
 * Mesuré le 08/09/2026 : le dépôt du pilot ne portait QU'UN hook, `pre-push`. Conséquence
 * mécanique, et elle explique une part des vingt mentions de réécriture d'histoire du dépôt :
 * quand la porte parle, le nom est DÉJÀ dans un objet git. Le corriger demande alors de modifier
 * un commit existant — que ce soit un `--amend` local ou une réécriture complète, c'est la même
 * opération, seule l'ampleur diffère.
 *
 * La porte de publication ne peut pas empêcher ce qu'elle constate : elle arrive après.
 *
 * ============================================================================================
 * IL CORRIGE, IL NE REFUSE PAS — ET C'EST UN CHOIX, PAS UNE FACILITÉ
 * ============================================================================================
 *
 * Un contrôle bloquant qu'on rencontre dix fois par jour finit contourné : l'option existe, elle
 * est documentée dans le hameçon de publication lui-même, et un humain pressé l'apprend vite.
 * Un contrôle qui CORRIGE ne se contourne pas, parce qu'il n'y a rien à contourner. Le fichier
 * indexé est pseudonymisé et ré-indexé ; le commit part, propre, sans que personne ait décidé
 * quoi que ce soit.
 *
 * TROIS BORNES, chacune contre une façon dont ce geste pourrait mal tourner :
 *
 *   1. IL NE JUGE QUE L'INDEX, jamais l'histoire. C'est ce qui rend son coût nul — quelques
 *      fichiers au lieu de 909 révisions, quelques millisecondes au lieu de trois minutes ;
 *   2. IL JOURNALISE CHAQUE SUBSTITUTION. Une correction silencieuse et non tracée est
 *      indiscernable d'une corruption : qui relit son diff doit pouvoir savoir POURQUOI son
 *      fichier a changé, et le journal le dit, fichier par fichier ;
 *   3. IL REFUSE, BRUYAMMENT, DANS DEUX CAS SEULEMENT — quand les tables sont illisibles (un
 *      anonymiseur qui ne peut pas anonymiser arrête le convoi, même doctrine que la chaîne
 *      qu'il appelle), et quand c'est le NOM D'UN FICHIER indexé qui porte le nom réel.
 *
 * POURQUOI LE NOM DE FICHIER EST REFUSÉ ET NON CORRIGÉ, et c'est un écart assumé à la décision
 * qui demandait de « corriger au lieu de refuser » : renommer un fichier sous les pieds de
 * quelqu'un pendant son commit casserait son index et son éditeur ouvert. Le refus donne la
 * commande exacte, elle tient sur une ligne, et le cas est rare — le geste normal d'un lot
 * entrant passe désormais par l'accueil (TF-0981), qui renomme AVANT que le fichier soit
 * indexable.
 *
 * Usage : appelé par `.git/hooks/pre-commit`. Manuellement : node todo/pre-commit-anonymise.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { anonymiser } from "./anonymiser-entrant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");
const JOURNAL = join(RACINE, ".claude", "anonymisation-au-commit.jsonl");

/** Les extensions où couper un identifiant casse quelque chose (même liste que l'outil des suivis). */
const EST_CODE = /\.(m?[jt]sx?|cjs|py|rb|php|java|go|rs|cs|c|h|cc|cpp|sh|bash|ps1|sql|css|scss|html?|ya?ml|json|toml|ini|cfg)$/i;

const git = (...a) => execFileSync("git", a, { cwd: RACINE, encoding: "utf8", maxBuffer: 64e6 });
const gitDans = (racine, ...a) => execFileSync("git", a, { cwd: racine, encoding: "utf8", maxBuffer: 64e6 });

/** Les fichiers de l'INDEX, ajoutés ou modifiés — jamais les supprimés, ni l'histoire. */
export function fichiersIndexes() {
  return git("diff", "--cached", "--name-only", "--diff-filter=ACM")
    .split("\n").map((s) => s.trim()).filter(Boolean);
}

/**
 * Le geste : pour chaque fichier indexé, pseudonymise son CONTENU et le ré-indexe si besoin ;
 * relève à part les fichiers dont le NOM est porteur, qui se renomment à la main.
 */
export function passer({ fichiers, ecrire = true, racine = RACINE } = {}) {
  // La RACINE est un parametre, et c'est ce qui rend ce geste eprouvable : le banc lui donne un
  // depot jetable au lieu de celui-ci. Un module qui ne sait travailler que sur son propre depot
  // ne se teste que sur son propre depot, donc jamais dans les deux sens.
  const liste = fichiers ?? fichiersIndexes();
  const corriges = [], nomsPorteurs = [];
  for (const f of liste) {
    const abs = join(racine, f);
    if (!existsSync(abs)) continue;

    const nom = anonymiser(f);
    if (nom.texte !== f) nomsPorteurs.push({ fichier: f, propose: nom.texte });

    let brut;
    try { brut = readFileSync(abs, "utf8"); } catch { continue; }
    if (brut.includes("\0")) continue;                      // binaire : jamais réécrit
    const { texte, remplaces } = anonymiser(brut, { code: EST_CODE.test(f) });
    if (texte === brut) continue;

    if (ecrire) {
      writeFileSync(abs, texte, "utf8");
      gitDans(racine, "add", "--", f);
    }
    corriges.push({ fichier: f, termes: remplaces.length });
  }
  return { corriges, nomsPorteurs };
}

if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
    === process.argv[1].toLowerCase().replaceAll("\\", "/")) {
  let r;
  try { r = passer({ ecrire: !process.argv.includes("--essai") }); }
  catch (e) {
    // Tables illisibles : on arrête le convoi, on ne laisse pas passer.
    console.error("\nCOMMIT REFUSÉ — la chaîne d'anonymisation ne peut pas travailler.");
    console.error("  " + e.message);
    console.error("  Un anonymiseur qui ne peut pas anonymiser ne doit pas laisser passer.\n");
    process.exit(1);
  }

  for (const c of r.corriges) {
    console.error(`  [pseudonymisé et ré-indexé] ${c.fichier} — ${c.termes} terme(s)`);
    try {
      appendFileSync(JOURNAL, JSON.stringify({ ts: new Date().toISOString(), ...c }) + "\n", "utf8");
    } catch { /* le journal ne doit jamais bloquer un commit */ }
  }

  if (r.nomsPorteurs.length) {
    console.error("\nCOMMIT REFUSÉ — le NOM de ces fichiers porte un nom réel :");
    for (const n of r.nomsPorteurs) console.error(`  ${n.fichier}\n    → git mv -- "${n.fichier}" "${n.propose}"`);
    console.error("\n  Le contenu, lui, a été corrigé et ré-indexé. Renommer un fichier pendant votre");
    console.error("  commit casserait votre index : ce geste-là vous revient, et il tient sur une ligne.\n");
    process.exit(1);
  }
  process.exit(0);
}
