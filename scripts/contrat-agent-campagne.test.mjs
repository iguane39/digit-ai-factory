#!/usr/bin/env node
/**
 * contrat-agent-campagne.test.mjs — les phrases du contrat d'agent (`gabarits/AGENT-CAMPAGNE.md`) que des décisions ont ajoutées
 * se lisent encore au contrat, dans les deux sens : vert sur le fichier réel, rouge sur le même fichier privé de la phrase.
 *   TF-2619 (16/11/2026) : une copie de dossier exclut les fichiers d'environnement, et leur absence se vérifie.
 *   TF-2625 (16/11/2026) : la critique d'implémentation sur l'instance servie pour tout écran écrit, et la rubrique
 *     `relecture_independante` du rapport (déclarée absente quand aucune relecture indépendante n'a eu lieu).
 *   TF-2621 (16/11/2026) : le marqueur d'occupation d'une copie de travail (le code vit dans `oracles/hook-flotte.mjs`).
 *   TF-2663 (16/11/2026) : les quatre rubriques d'une consigne d'agent, contrôlées par `relecture-intention.mjs --preparer consigne`.
 * Un contrat sans sa phrase redevient muet sur le défaut : la phrase est la seule preuve que l'agent sait.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRAT = readFileSync(join(RACINE, "gabarits", "AGENT-CAMPAGNE.md"), "utf8").replace(/\r\n/g, "\n");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const vrai = (c, m) => { if (!c) throw new Error(m); };

/** Le contrat privé du paragraphe ou de la section qui porte `motif` (jusqu'au titre ou paragraphe suivant). */
const sansBloc = (texte, motif) => texte.split(/\n{2,}/).filter((b) => !motif.test(b)).join("\n\n");

// ---- TF-2619 : la copie récursive d'un dossier ----------------------------------------------------------------------
const COPIE = {
  section: /^## Une copie de dossier n'emporte aucun fichier d'environnement \(TF-2619/m,
  exclusion: /Toute copie de dossier exclut les fichiers d'environnement/,
  motifs: /`\.env` et `\.env\.\*`/,
  verification: /L'absence se vérifie après la copie/,
  commande: /Get-ChildItem -Recurse -Force -Filter "\.env\*"/,
  chemin_seul: /son chemin seul, jamais son contenu, entre aux `restes`/,
};
check("vert (TF-2619) — le contrat exclut les fichiers d'environnement de toute copie de dossier et en vérifie l'absence", () => {
  for (const [nom, motif] of Object.entries(COPIE)) vrai(motif.test(CONTRAT), `le contrat ne porte plus « ${nom} » (${motif})`);
});
check("rouge (TF-2619) — le contrat privé de la règle ne la porte plus : le contrôle voit la différence", () => {
  const mutant = sansBloc(CONTRAT, /Toute copie de dossier exclut/);
  vrai(mutant !== CONTRAT, "la chirurgie n'a rien retiré");
  vrai(!COPIE.exclusion.test(mutant), "la règle d'exclusion subsiste dans le mutant");
});

console.log(`\ncontrat-agent-campagne.test : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
