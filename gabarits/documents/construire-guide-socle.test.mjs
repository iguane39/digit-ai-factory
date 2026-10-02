#!/usr/bin/env node
/**
 * construire-guide-socle.test.mjs — recette de TF-1478 (02/10/2026).
 *
 * LE FAIT, lu dans le code le 28/09/2026 par l'agent « harnais », non rejoué : `socle_page_html`
 * de `gabarits\documents\guide-de-reference\generateur\construire-guide.py` retombait en SILENCE
 * sur le socle installé (CLAUDE_CONFIG_DIR ou ~/.claude) quand l'option `--socle` désignait un
 * emplacement qui ne porte pas `scripts\embarquer-composants.mjs` — l'appelant croyait son
 * `--socle` honoré alors qu'un autre socle, potentiellement d'une autre version, servait à son
 * insu.
 *
 * CE QUE CETTE RECETTE VÉRIFIE : un `--socle` explicite et invalide fait désormais imprimer un
 * AVERTISSEMENT sur stderr, nommant le chemin refusé, avant tout repli ; un `--socle` explicite et
 * VALIDE n'imprime rien de tel. Jouée via `--self-test`, qui traverse `socle_page_html` sans
 * dépendre d'un socle installé pour exister sur ce poste (SKIP sinon, jamais un FAIL muet). Jouée
 * par `oracles\self-tests.mjs` (I2, zone `gabarits/documents`, deux niveaux).
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(ICI, "guide-de-reference", "generateur", "construire-guide.py");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

function python(...args) {
  for (const exe of ["python", "python3"]) {
    const r = spawnSync(exe, [SCRIPT, ...args], { encoding: "utf8" });
    if (!r.error) return r;
  }
  return null;
}

const sonde = python("--self-test");
if (!sonde) {
  console.log("construire-guide-socle (TF-1478) : SKIP — aucun interpréteur Python trouvé sur ce poste (ni python ni python3)");
  process.exit(0);
}

check("TF-1478 rouge→vert — un --socle INVALIDE (sans embarquer-composants.mjs) imprime un AVERTISSEMENT nommé, avant tout repli", () => {
  const faux = mkdtempSync(join(tmpdir(), "socle-invalide-"));
  const r = python("--self-test", "--socle", faux);
  rmSync(faux, { recursive: true, force: true });
  att(/\[AVERTISSEMENT\]/.test(r.stderr || ""), `aucun avertissement sur stderr : ${(r.stderr || "").slice(0, 300)}`);
  att((r.stderr || "").includes("embarquer-composants.mjs"),
    `l'avertissement ne nomme pas le fichier attendu : ${(r.stderr || "").slice(0, 300)}`);
  att((r.stderr || "").includes(faux) || (r.stderr || "").includes(faux.replaceAll("/", "\\")),
    `l'avertissement ne nomme pas le chemin --socle refusé : ${(r.stderr || "").slice(0, 300)}`);
});

check("TF-1478 borne — un --socle VALIDE (portant embarquer-composants.mjs) n'imprime AUCUN avertissement", () => {
  const vrai = mkdtempSync(join(tmpdir(), "socle-valide-"));
  mkdirSync(join(vrai, "scripts"), { recursive: true });
  writeFileSync(join(vrai, "scripts", "embarquer-composants.mjs"), "// fixture\n", "utf8");
  const r = python("--self-test", "--socle", vrai);
  rmSync(vrai, { recursive: true, force: true });
  att(!/\[AVERTISSEMENT\]/.test(r.stderr || ""), `un socle valide déclenche quand même l'avertissement : ${(r.stderr || "").slice(0, 300)}`);
});

check("TF-1478 borne — sans --socle (résolution par défaut), aucun avertissement", () => {
  const r = python("--self-test");
  att(!/\[AVERTISSEMENT\]/.test(r.stderr || ""), `la résolution par défaut déclenche l'avertissement à tort : ${(r.stderr || "").slice(0, 300)}`);
});

console.log(`\nconstruire-guide-socle (TF-1478) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
