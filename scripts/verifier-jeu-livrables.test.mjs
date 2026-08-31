#!/usr/bin/env node
/**
 * verifier-jeu-livrables.test.mjs — recette du contrôle de jeu de formats (TF-0702).
 *
 * La scène rejouée est celle des 25 et 27/08 : une fiche html d'une famille à deux formats,
 * remise SANS son pdf. Le contrôle doit la refuser sans rien savoir du générateur — et se
 * taire sur un jeu complet, sur un document sans marqueur, et sur une famille à un format.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-jeu-livrables.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "jeu-livrables-"));
const CATALOGUE = join(T, "catalogue.jsonl");
writeFileSync(CATALOGUE, [
  JSON.stringify({ schema: "pilot/gabarits-documents@1", version: "test" }),
  JSON.stringify({ id: "gd-fiche-securite", formats: ["html", "pdf"] }),
  JSON.stringify({ id: "gd-dossier-mep", formats: ["md"] }),
].join("\n") + "\n", "utf8");

const DOC = (id) => `<!doctype html><html><body><footer>Gabarit : ${id} · version du gabarit 1.0.0</footer></body></html>`;

let serie = 0;
const jouer = (poser) => {
  const d = join(T, `cas-${++serie}`);
  mkdirSync(d, { recursive: true });
  poser(d);
  const r = spawnSync(process.execPath, [OUTIL, d, "--catalogue", CATALOGUE, "--json"], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};

try {
  check("rouge — la scène du 25/08 : html d'une famille [html, pdf], remis SANS pdf → FAIL nommant le manquant", () => {
    const r = jouer((d) => writeFileSync(join(d, "Fiche - 20260825a.html"), DOC("gd-fiche-securite"), "utf8"));
    att(r.code === 1, `exit ${r.code} attendu 1`);
    att(/Fiche - 20260825a\.pdf/.test(r.sortie), "le format manquant n'est pas nommé avec son fichier attendu");
  });

  check("verte — le jeu complet [html, pdf] passe", () => {
    const r = jouer((d) => {
      writeFileSync(join(d, "Fiche - 20260825a.html"), DOC("gd-fiche-securite"), "utf8");
      writeFileSync(join(d, "Fiche - 20260825a.pdf"), "%PDF-1.4 factice", "utf8");
    });
    att(r.code === 0, `exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  });

  check("borne — une famille à UN format n'exige rien de plus qu'elle-même", () => {
    const r = jouer((d) => writeFileSync(join(d, "Dossier - 20260825a.md"), "Gabarit : gd-dossier-mep · version du gabarit 1.0.0\n", "utf8"));
    att(r.code === 0, `exit ${r.code} — un jeu d'un seul format complet a été refusé`);
  });

  check("borne — un document SANS marqueur de famille n'est pas jugé : SKIP dit, jamais vert silencieux", () => {
    const r = jouer((d) => writeFileSync(join(d, "notes.html"), "<p>libre</p>", "utf8"));
    att(r.code === 2, `exit ${r.code} attendu 2 (SKIP)`);
    att(/rien à juger/.test(r.sortie), "le SKIP ne dit pas son motif");
  });

  check("rouge — un marqueur qui se réclame d'une famille INCONNUE du catalogue est dénoncé", () => {
    const r = jouer((d) => writeFileSync(join(d, "doc.html"), DOC("gd-famille-fantome"), "utf8"));
    att(r.code === 1, `exit ${r.code} attendu 1`);
    att(/INCONNUE du catalogue/.test(r.sortie), "la famille fantôme n'est pas dénoncée");
  });

  check("borne — `old\\` est hors périmètre : une version retirée dépareillée ne crie pas", () => {
    const r = jouer((d) => {
      mkdirSync(join(d, "old"), { recursive: true });
      writeFileSync(join(d, "old", "Fiche - 20260701a.html"), DOC("gd-fiche-securite"), "utf8");
      writeFileSync(join(d, "Fiche - 20260825a.html"), DOC("gd-fiche-securite"), "utf8");
      writeFileSync(join(d, "Fiche - 20260825a.pdf"), "%PDF-1.4 factice", "utf8");
    });
    att(r.code === 0, `exit ${r.code} — le canal d'échappement old\\ a été jugé`);
  });

  check("borne — catalogue introuvable : SKIP motivé, jamais un verdict sans contrat", () => {
    const d = join(T, `cas-${++serie}`);
    mkdirSync(d, { recursive: true });
    writeFileSync(join(d, "Fiche - 20260825a.html"), DOC("gd-fiche-securite"), "utf8");
    const r = spawnSync(process.execPath, [OUTIL, d, "--catalogue", join(T, "absent.jsonl"), "--json"], { encoding: "utf8" });
    att(r.status === 2, `exit ${r.status} attendu 2`);
    att(/catalogue introuvable/.test((r.stdout || "") + (r.stderr || "")), "le SKIP ne nomme pas le catalogue absent");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nTF-0702 (jeu de livrables confronté au catalogue) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
