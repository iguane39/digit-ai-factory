#!/usr/bin/env node
/**
 * recopier-heritage.test.mjs — le geste unique de remise à niveau (TF-0711), dans les deux sens.
 *
 * Ce que la recette verrouille : il copie TOUT ce que le contrat déclare en copie_conforme, il
 * ne touche JAMAIS un mode personnalisé, il refuse un dépôt jamais instancié et le pilot
 * lui-même, et `--essai` n'écrit rien. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "recopier-heritage.mjs");
const PILOT = join(ICI, "..");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "recopier-"));
const lancer = (cible, ...flags) => {
  const r = spawnSync(process.execPath, [OUTIL, cible, ...flags], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};

try {
  check("un produit instancié reçoit TOUTES les copies conformes du contrat, et R-47 les reconnaît", () => {
    const produit = join(T, "produit");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code} : ${r.sortie.slice(0, 200)}`);
    const contrat = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
    for (const a of contrat.artefacts.filter((x) => x.mode === "copie_conforme")) {
      const dst = join(produit, String(a.cible).replaceAll("/", "\\"));
      att(existsSync(dst), `${a.cible} non copié`);
      const norm = (s) => String(s).split("\r\n").join("\n").trimEnd();
      att(norm(readFileSync(dst, "utf8")) === norm(readFileSync(join(PILOT, a.source), "utf8")),
        `${a.cible} copié mais différent de sa source`);
    }
  });

  check("les modes PERSONNALISÉS ne sont jamais écrits — les écraser détruirait la personnalisation", () => {
    const produit = join(T, "produit-perso");
    mkdirSync(join(produit, "forge"), { recursive: true });
    mkdirSync(join(produit, ".claude"), { recursive: true });
    writeFileSync(join(produit, ".claude", "settings.json"), '{"perso":true}', "utf8");
    writeFileSync(join(produit, "CLAUDE.md"), "# mes consignes\n", "utf8");
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code}`);
    att(readFileSync(join(produit, ".claude", "settings.json"), "utf8") === '{"perso":true}',
      "settings.json personnalisé a été écrasé");
    att(readFileSync(join(produit, "CLAUDE.md"), "utf8") === "# mes consignes\n",
      "CLAUDE.md personnalisé a été écrasé");
    att(/LAISSÉ/.test(r.sortie), "les artefacts laissés au produit ne sont pas dits");
  });

  check("second passage : tout est CONFORME, rien n'est réécrit ni compté copié", () => {
    const produit = join(T, "produit");
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code}`);
    att(/^0 copié/m.test(r.sortie) || /\n0 copié/.test(r.sortie), `un second passage a recopié : ${r.sortie.slice(-200)}`);
  });

  check("--essai n'écrit RIEN", () => {
    const produit = join(T, "produit-essai");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const r = lancer(produit, "--essai");
    att(r.code === 0, `exit ${r.code}`);
    att(!existsSync(join(produit, "forge", "RESTITUTION.md")), "l'essai a écrit un artefact");
    att(/ESSAI — rien écrit/.test(r.sortie), "l'essai ne se déclare pas");
  });

  check("garde — un dépôt SANS forge\\ est refusé : l'instanciation est un run, pas une recopie", () => {
    const nu = join(T, "depot-nu");
    mkdirSync(nu, { recursive: true });
    const r = lancer(nu);
    att(r.code === 2, `exit ${r.code} attendu 2`);
    att(/jamais été instancié/.test(r.sortie), "le refus ne dit pas sa cause");
  });

  check("garde — le pilot lui-même est refusé", () => {
    const r = lancer(PILOT);
    att(r.code === 2, `exit ${r.code} attendu 2 — le pilot s'est recopié sur lui-même`);
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nrecopier-heritage (TF-0711) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
