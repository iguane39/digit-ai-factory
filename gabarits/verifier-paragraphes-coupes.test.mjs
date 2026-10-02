#!/usr/bin/env node
/**
 * verifier-paragraphes-coupes.test.mjs — recette de TF-1534 (02/10/2026).
 *
 * LE FAIT. `gabarits\RESTITUTION.md` prescrit depuis sa v2.32.0 qu'un paragraphe de prose
 * s'écrit sur une seule ligne source (S54, règle de forme transverse n° 9) — et restait lui-même
 * coupé vers 100 caractères sur 112 paragraphes, hors des passages ajoutés le 01/10/2026. Un
 * gabarit que les sessions IMITENT doit tenir la règle qu'il prescrit.
 *
 * Deux sens : l'algorithme (identique à S54 d'oracles\oracle-synthese.mjs, dupliqué ici) détecte
 * une fixture fabriquée à coupure connue, et ne la détecte plus une fois reformatée — puis le
 * VRAI gabarits\RESTITUTION.md du dépôt est vérifié sans coupure, avec son contenu PRÉSERVÉ
 * (comparaison espaces normalisés contre une copie de référence). Jouée par `oracles\self-tests.mjs`
 * (I2).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { paragraphesCoupes, reformater } from "./verifier-paragraphes-coupes.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const FIXTURE_COUPEE = [
  "# Titre",
  "",
  "Un paragraphe de prose qui commence ici et qui se",
  "poursuit sur une deuxième ligne source, puis une",
  "troisième, avant de se terminer enfin.",
  "",
  "- une puce",
  "  qui continue sur une seconde ligne (admise, ce n'est pas de la prose)",
  "- une autre puce",
  "",
  "| a | b |",
  "|---|---|",
  "| 1 | 2 |",
  "",
  "> une citation",
  "> sur deux lignes",
  "",
  "```",
  "du code",
  "sur deux lignes",
  "```",
  "",
  "Un paragraphe sur une seule ligne, déjà conforme.",
  "",
].join("\n");

check("TF-1534 rouge : un paragraphe de prose coupé sur 3 lignes est détecté", () => {
  const c = paragraphesCoupes(FIXTURE_COUPEE);
  att(c.length === 1, `attendu 1 coupure, obtenu ${c.length}`);
  att(c[0].n === 3, `attendu 3 lignes fusionnées, obtenu ${c[0].n}`);
});

check("TF-1534 — listes, tableaux, citations et code ne sont JAMAIS comptés comme coupés", () => {
  const c = paragraphesCoupes(FIXTURE_COUPEE);
  att(c.length === 1, `une autre forme que la prose a été accusée : ${JSON.stringify(c)}`);
});

check("TF-1534 vert : la même fixture reformatée n'a plus aucune coupure", () => {
  const apres = reformater(FIXTURE_COUPEE);
  const c = paragraphesCoupes(apres);
  att(c.length === 0, `coupure(s) restante(s) après reformatage : ${JSON.stringify(c)}`);
  att(/^Un paragraphe de prose qui commence ici et qui se poursuit sur une deuxième ligne source, puis une troisième, avant de se terminer enfin\.$/m.test(apres),
    `le paragraphe reformaté ne tient pas sur une ligne ou son texte a changé : ${apres}`);
  att(/- une puce\n {2}qui continue sur une seconde ligne/.test(apres), "la continuation de liste a été altérée");
  att(/\| 1 \| 2 \|/.test(apres), "le tableau a été altéré");
  att(/> une citation\n> sur deux lignes/.test(apres), "la citation a été altérée");
  att(/du code\nsur deux lignes/.test(apres), "le bloc de code a été altéré");
});

check("TF-1534 — gabarits/RESTITUTION.md (le vrai fichier du dépôt) n'a plus aucun paragraphe coupé", () => {
  const texte = readFileSync(join(ICI, "RESTITUTION.md"), "utf8");
  const c = paragraphesCoupes(texte);
  att(c.length === 0, `${c.length} paragraphe(s) encore coupé(s) — le 1er à la ligne ${c[0] && c[0].ligne}`);
});

console.log(`\nverifier-paragraphes-coupes (TF-1534) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
