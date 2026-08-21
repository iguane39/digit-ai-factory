#!/usr/bin/env node
/**
 * ingerer-r45.test.mjs — R-45 : un lot remis DIT ce qu'il n'a pas remonté.
 *
 * Le fait fondateur : un lot du 20/08 écrivait « Le lot ne remonte pas ces défauts, qui
 * appartiennent au produit ». Le tri était honnête et le raisonnement juste — et invisible.
 * Les défauts de forme les plus coûteux de l'écosystème (largeur de lecture, tableaux
 * illisibles au mobile, états vides absents) ont tous commencé leur vie comme « un défaut de
 * ce livrable-là ». Ce qui se perd n'est pas le défaut, c'est sa CLASSE.
 *
 * Ce que ces cas verrouillent : le refus À L'INGESTION (la porte), les deux formes de
 * déclaration acceptées, et les deux bornes qui empêchent la règle de mettre l'existant en
 * échec — antériorité datée, et candidature hors lot. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "r45-"));
const CANDIDATURE = JSON.stringify({
  schema: 1, titre: "pilot : un retour de recette", contenu: "c", demandeur: "produit-recette",
  source: "lot de recette", date_demande: "2026-08-21",
  forges_cibles_initiales: ["digit-ai-factory"],
});

let serie = 0;
/** Pose un lot (sidecar + .md optionnel) et tente son ingestion. */
const ingerer = ({ nomLot, md }) => {
  const registre = join(T, `reg-${++serie}.jsonl`);
  writeFileSync(registre, "", "utf8");
  const sidecar = join(T, `${nomLot}.tf.jsonl`);
  writeFileSync(sidecar, CANDIDATURE + "\n", "utf8");
  if (md !== null) writeFileSync(join(T, `${nomLot}.md`), md, "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), registre };
};

const SECTION = "## Remarques restées au produit";

check("rouge — lot du 21/08 SANS la section : refusé, registre intact", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260821a", md: "# lot\n\n## pilot\n\ntable\n" });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/R-45/.test(r.sortie)) throw new Error("le refus ne cite pas la règle");
  if (readFileSync(r.registre, "utf8").length !== 0) throw new Error("le registre a été touché malgré le refus");
});

check("rouge — section PRÉSENTE mais vide : une section vide se lit comme un oubli", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260821b", md: `# lot\n\n${SECTION}\n\n(rien)\n` });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/ni verdict de/.test(r.sortie)) throw new Error("le motif du refus n'est pas dit");
});

check("verte — déclaration explicite qu'aucune remarque n'est restée au produit", () => {
  const md = `# lot\n\n${SECTION}\n\nAucune remarque n'est restée au produit sur ce lot — vérifié par X, le 2026-08-21.\n`;
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260821c", md });
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
});

check("verte — un verdict de généralisation écrit par remarque", () => {
  const md = `# lot\n\n${SECTION}\n\n| Remarque | Corrigée comment | Généralisable ? | Verdict |\n|---|---|---|---|\n| tri cassé | index ajouté | non | propre au schéma de ce produit |\n`;
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260821d", md });
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 200)}`);
});

check("borne — lot ANTÉRIEUR au seuil : antériorité déclarée, jamais réécrite (R-33 bis)", () => {
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260819a", md: "# lot ancien\n\n## pilot\n\ntable\n" });
  if (r.code !== 0) throw new Error(`un lot du 19/08 a été refusé — le contrôle met l'existant en échec (exit ${r.code})`);
});

check("borne — candidature HORS lot (aucun .md homonyme) : rien à exiger", () => {
  const r = ingerer({ nomLot: "candidature-hors-lot - 20260821a", md: null });
  if (r.code !== 0) throw new Error(`exit ${r.code} : une candidature sans lot n'a pas de section à porter`);
});

check("la section est reconnue quelle que soit sa casse et son accentuation", () => {
  const md = `# lot\n\n## REMARQUES RESTEES AU PRODUIT\n\nAucune remarque n'est restée au produit — vérifié le 2026-08-21.\n`;
  const r = ingerer({ nomLot: "PROD - RETOURS - 20260821e", md });
  if (r.code !== 0) throw new Error(`exit ${r.code} : la reconnaissance de la section est trop stricte`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\nR-45 (ingestion) : ${pass} PASS, ${fail} FAIL`);
if (!existsSync(OUTIL)) console.error("outil introuvable");
process.exit(fail ? 1 : 0);
