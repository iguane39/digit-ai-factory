#!/usr/bin/env node
/**
 * fusionner-tables-confidentielles.test.mjs — recette du script de fusion des tables libres d'un
 * poste vers le canal confidentiel (D-28 (a), 07/09/2026). Les DEUX SENS sur un parc jetable :
 *   ROUGE : un conflit (même clé, autre pseudonyme) → exit 1, RIEN d'écrit, RIEN de renommé —
 *           même la table qui, elle, n'avait pas de conflit ;
 *   VERT  : sans conflit → les entrées absentes entrent au canal, les anciens fichiers sont
 *           renommés `*.fusionne-<date>.json`, exit 0 ;
 *   VERT  : sans ancien fichier → « rien à faire », exit 0.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "fusionner-tables-confidentielles.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (ok, msg) => { if (!ok) throw new Error(msg); };
const T = mkdtempSync(join(tmpdir(), "fusion-tables-"));

const parc = ({ anciens = true, conflit = false } = {}) => {
  const r = mkdtempSync(join(T, "parc-"));
  mkdirSync(join(r, "_confidentiel", "tables"), { recursive: true });
  writeFileSync(join(r, "_confidentiel", "tables", "produits-pseudonymes.json"), JSON.stringify({ produits: { "alpha-un": "Produit-01", "beta-deux": "Produit-02" } }), "utf8");
  writeFileSync(join(r, "_confidentiel", "tables", "noms-interdits.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
  if (anciens) {
    writeFileSync(join(r, "_produits-pseudonymes.json"), JSON.stringify({ produits: { "alpha-un": conflit ? "Produit-09" : "Produit-01", "gamma-trois": "Produit-03" } }), "utf8");
    writeFileSync(join(r, "_noms-interdits.json"), JSON.stringify({ noms: ["Zorglub", "Fictilabs"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A", Fictilabs: "Client-B" } }), "utf8");
  }
  return r;
};
const jouer = (r) => { const p = spawnSync(process.execPath, [OUTIL], { encoding: "utf8", env: { ...process.env, FORGE_ROOT: r, FORGE_CONFIDENTIEL: "", FORGE_NOMS_INTERDITS: "", FORGE_PRODUITS_PSEUDO: "" } }); let j = null; try { j = JSON.parse(p.stdout); } catch {} return { status: p.status, j, sortie: (p.stdout || "") + (p.stderr || "") }; };
const renommes = (r) => readdirSync(r).filter((n) => /\.fusionne-\d{4}-\d{2}-\d{2}\.json$/.test(n)).length;

try {
  check("ROUGE — un conflit sur une table bloque TOUT : exit 1, rien d'écrit, rien de renommé (même l'autre table)", () => {
    const r = parc({ conflit: true });
    const { status, j } = jouer(r);
    att(status === 1, `exit ${status} attendu 1`);
    att(j && j.conflits.length === 1 && /alpha-un/.test(j.conflits[0]), "le conflit n'est pas nommé");
    att(renommes(r) === 0, "un ancien fichier a été renommé malgré le conflit");
    const c = JSON.parse(readFileSync(join(r, "_confidentiel", "tables", "noms-interdits.json"), "utf8"));
    att(!c.noms.includes("Fictilabs"), "la table des clients a été écrite malgré le conflit sur celle des produits");
  });
  check("VERT — sans conflit, les entrées absentes entrent au canal et les anciens fichiers sont renommés", () => {
    const r = parc();
    const { status, j } = jouer(r);
    att(status === 0, `exit ${status} attendu 0`);
    att(j && j.ajouts === 3, `3 ajouts attendus, ${j && j.ajouts}`);
    const p = JSON.parse(readFileSync(join(r, "_confidentiel", "tables", "produits-pseudonymes.json"), "utf8"));
    att(p.produits["gamma-trois"] === "Produit-03" && p.produits["alpha-un"] === "Produit-01", "le canal ne porte pas l'ajout attendu ou a perdu une entrée");
    att(typeof p.date_derniere_extension === "string", "la date de dernière extension n'est pas posée");
    att(renommes(r) === 2, `2 anciens fichiers renommés attendus, ${renommes(r)}`);
  });
  check("VERT — sans ancien fichier, rien à faire, exit 0", () => {
    const r = parc({ anciens: false });
    const { status, j } = jouer(r);
    att(status === 0 && j && /rien à faire/.test(j.suite), "un parc sans ancien fichier n'est pas déclaré « rien à faire »");
  });
} finally { rmSync(T, { recursive: true, force: true }); }
console.log(`\nfusionner-tables-confidentielles (D-28 a) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
