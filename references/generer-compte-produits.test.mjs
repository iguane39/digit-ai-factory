#!/usr/bin/env node
/**
 * generer-compte-produits.test.mjs — recette de TF-1474 (02/10/2026).
 *
 * LE FAIT. `oracle-fraicheur-doc` (claim `produits-connus-du-registre`) accusait un écart entre
 * le chiffre écrit en prose dans `references\PRODUITS.md` (17) et le compte réel de pseudonymes
 * `Produit-NN` distincts du registre (23) — resté FAIL depuis le rapport du 28/09/2026, jamais
 * rejoué. Ce script recalcule le chiffre plutôt que de le laisser écrit à la main.
 *
 * Un pilot jetable (`--racine`) fabrique un registre à un nombre de produits CONNU, confronté à un
 * document qui en cite un FAUX nombre : --verifier doit échouer et nommer les deux chiffres, un
 * lancement sans --verifier doit corriger SEULEMENT le chiffre, et un second passage doit rendre
 * --verifier vert. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { compterProduitsDistincts } from "./generer-compte-produits.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "generer-compte-produits.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

/** Un pilot jetable : todo\TODO.jsonl avec un nombre de produits distincts connu, et
 *  references\PRODUITS.md citant le chiffre demandé. */
function pilotJetable(nProduits, chiffreCite) {
  const d = mkdtempSync(join(tmpdir(), "compte-produits-"));
  mkdirSync(join(d, "todo"), { recursive: true });
  mkdirSync(join(d, "references"), { recursive: true });
  const lignes = [];
  for (let i = 1; i <= nProduits; i++) {
    const n = String(i).padStart(2, "0");
    lignes.push(JSON.stringify({ ev: "creation", id: `TF-${9000 + i}`, demandeur: `Produit-${n}`, source: `lot Produit-${n}` }));
  }
  writeFileSync(join(d, "todo", "TODO.jsonl"), lignes.join("\n") + "\n", "utf8");
  writeFileSync(join(d, "todo", "TODO-ARCHIVE.jsonl"), "", "utf8");
  writeFileSync(join(d, "references", "PRODUITS.md"),
    `# Référentiel des produits suivis\n\nLe registre connaît **${chiffreCite} produits connus du registre** par leurs lots — texte inchangé par ailleurs.\n\n| Produit | ... |\n`,
    "utf8");
  return d;
}
const lancer = (racine, ...flags) =>
  spawnSync(process.execPath, [OUTIL, ...flags, "--racine", racine], { encoding: "utf8" });

check("compterProduitsDistincts compte les pseudonymes Produit-NN distincts, pas les créations", () => {
  const d = pilotJetable(5, 5);
  const n = compterProduitsDistincts(d);
  rmSync(d, { recursive: true, force: true });
  att(n === 5, `attendu 5, obtenu ${n}`);
});

check("TF-1474 rouge : --verifier échoue et nomme les deux chiffres quand le document a dérivé", () => {
  const d = pilotJetable(23, 17);
  const r = lancer(d, "--verifier");
  const texte = readFileSync(join(d, "references", "PRODUITS.md"), "utf8");
  rmSync(d, { recursive: true, force: true });
  att(r.status === 1, `exit ${r.status} attendu 1`);
  att(/cite 17, la source constate 23/.test(r.stderr || r.stdout), `les deux chiffres ne sont pas nommés : ${r.stderr}${r.stdout}`);
  att(/\*\*17 produits connus du registre\*\*/.test(texte), "--verifier a écrit alors qu'il ne doit rien écrire");
});

check("TF-1474 vert : sans --verifier, le chiffre est corrigé et RIEN D'AUTRE dans la phrase", () => {
  const d = pilotJetable(23, 17);
  const r = lancer(d);
  const texte = readFileSync(join(d, "references", "PRODUITS.md"), "utf8");
  rmSync(d, { recursive: true, force: true });
  att(r.status === 0, `exit ${r.status} attendu 0 : ${r.stderr}`);
  att(/\*\*23 produits connus du registre\*\*/.test(texte), `le chiffre n'a pas été corrigé : ${texte}`);
  att(/texte inchangé par ailleurs/.test(texte), "le reste de la phrase a été altéré");
});

check("TF-1474 borne : un document déjà conforme n'est pas réécrit, --verifier passe", () => {
  const d = pilotJetable(9, 9);
  const avant = readFileSync(join(d, "references", "PRODUITS.md"), "utf8");
  const r = lancer(d, "--verifier");
  const apres = readFileSync(join(d, "references", "PRODUITS.md"), "utf8");
  rmSync(d, { recursive: true, force: true });
  att(r.status === 0, `exit ${r.status} attendu 0 — déjà conforme : ${r.stderr}`);
  att(apres === avant, "un document déjà conforme a été modifié");
});

check("TF-1474 rouge → vert, sur le VRAI PRODUITS.md du pilot : --verifier passe après la correction réelle", () => {
  const r1 = spawnSync(process.execPath, [OUTIL, "--verifier"], { encoding: "utf8" });
  att(r1.status === 0, `--verifier échoue sur le PRODUITS.md réel après correction : ${r1.stdout}${r1.stderr}`);
  att(/conforme/.test(r1.stdout), `la sortie ne dit pas « conforme » : ${r1.stdout}`);
});

console.log(`\ngenerer-compte-produits (TF-1474) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
