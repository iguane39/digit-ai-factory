#!/usr/bin/env node
/**
 * ingerer-registre-jetable.test.mjs — TF-1431 (28/09/2026) : UN ESSAI SUR REGISTRE JETABLE N'ÉTEND
 * PAS LA TABLE RÉELLE DES PSEUDONYMES.
 *
 * LE FAIT PAYÉ : le 28/09 à 07:45:43Z, un essai d'ingestion joué avec `--registre` sur une COPIE du
 * registre, sans `FORGE_PRODUITS_PSEUDO`, a inscrit un produit dans la table RÉELLE du canal
 * confidentiel. Le registre réel est resté intact, la table non. La garde d'`anonymiser-entrant` ne
 * reconnaît un banc qu'à son point d'entrée (`*.test.mjs`, `--self-test`) ou au marqueur qu'un banc
 * transmet à ses sous-processus : un essai lancé à la main n'est ni l'un ni l'autre.
 *
 * L'ESSAI EST REJOUÉ TEL QUEL, sur des tables JETABLES qui jouent la table réelle. Elles sont posées
 * là où la chaîne cherche le canal, `<FORGE_ROOT>\_confidentiel\tables\`, sans `FORGE_PRODUITS_PSEUDO`,
 * et le marqueur de banc est retiré de l'environnement de l'essai : un essai à la main n'en porte pas.
 *
 *   ROUGE : l'essai du 28/09 → refusé AVANT toute écriture, table « réelle » et copie du registre
 *           intactes, et le refus nomme la variable à poser ;
 *   VERTE : le même essai, tables jetables désignées par FORGE_NOMS_INTERDITS et FORGE_PRODUITS_PSEUDO
 *           → ingéré, seule la table jetable s'étend ;
 *   VERTE : un produit DÉJÀ connu de la table « réelle » → l'essai passe en lecture seule ;
 *   VERTE : sans registre jetable, c'est-à-dire l'ingestion réelle, l'écrivain étend la table comme
 *           avant. Ce cas se joue au module : un banc n'écrit jamais dans le registre par défaut.
 *
 * Exit : 0 = les quatre sens tenus · 1 = au moins un sens perdu.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (ok, msg) => { if (!ok) throw new Error(msg); };

const T = mkdtempSync(join(tmpdir(), "registre-jetable-"));
const LOT_CONFORME = "# lot\n\n## Remarques restées au produit\n\n"
  + "Aucune remarque n'est restée au produit — vérifié le 2026-09-28.\n\n"
  + "## Retours sur les documents produits\n\nAucun document produit depuis un gabarit.\n";

// Le contrat entre `ingerer-lot.mjs` et `anonymiser-entrant.mjs` : le nom du marqueur est écrit ici en
// clair, pour qu'un renommage d'un seul côté se voie.
const MARQUEUR_REGISTRE_JETABLE = "FORGE_REGISTRE_JETABLE";

/** L'environnement d'un ESSAI À LA MAIN : aucune variable de table héritée, aucun marqueur de banc. */
const envEssai = (extra = {}) => {
  const e = { ...process.env };
  for (const k of ["FORGE_NOMS_INTERDITS", "FORGE_PRODUITS_PSEUDO", "FORGE_CONFIDENTIEL", "FORGE_ROOT",
    "FORGE_CONTEXTE_BANC", MARQUEUR_REGISTRE_JETABLE]) delete e[k];
  return { ...e, ...extra };
};

/** Un parc jetable : son canal porte la table qui joue la table RÉELLE ; la copie du registre est vide. */
const parc = (produitsReels = {}) => {
  const r = mkdtempSync(join(T, "parc-"));
  const tables = join(r, "_confidentiel", "tables");
  mkdirSync(tables, { recursive: true });
  writeFileSync(join(tables, "noms-interdits.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
  writeFileSync(join(tables, "produits-pseudonymes.json"), JSON.stringify({ produits: produitsReels }), "utf8");
  const copie = join(r, "copie", "TODO.jsonl");
  mkdirSync(dirname(copie), { recursive: true });
  writeFileSync(copie, "", "utf8");
  return { r, tableReelle: join(tables, "produits-pseudonymes.json"), copie };
};

let serie = 0;
const lot = (produit) => {
  const d = mkdtempSync(join(T, "lot-"));
  const base = `${produit} - RETOURS - 20260928${String.fromCharCode(97 + serie++)}`;
  writeFileSync(join(d, `${base}.md`), LOT_CONFORME, "utf8");
  const ligne = (t) => JSON.stringify({ schema: 1, titre: `pilot : ${t}`, contenu: `constat ${t} remonté par ${produit}`, demandeur: produit,
    source: `lot ${base}`, date_demande: "2026-09-28", forges_cibles_initiales: ["digit-ai-factory"], preuve_du_cout: "mesuré sur pièce",
    classe: "banc-etend-referentiel-production" });
  const sidecar = join(d, `${base}.tf.jsonl`);
  writeFileSync(sidecar, ligne("un") + "\n" + ligne("deux") + "\n", "utf8");
  return sidecar;
};

const essayer = (sidecar, p, extra = {}) => {
  const res = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", p.copie, "--sans-fetch"],
    { encoding: "utf8", timeout: 180000, env: envEssai({ FORGE_ROOT: p.r, ...extra }) });
  return { status: res.status, sortie: (res.stdout || "") + (res.stderr || "") };
};
const creations = (registre) => readFileSync(registre, "utf8").split("\n").filter(Boolean)
  .map((l) => JSON.parse(l)).filter((e) => e.ev === "creation");

try {
  check("ROUGE — l'essai du 28/09 rejoué (copie du registre, table réelle, sans FORGE_PRODUITS_PSEUDO) est refusé avant toute écriture", () => {
    const p = parc();
    const avant = readFileSync(p.tableReelle, "utf8");
    const { status, sortie } = essayer(lot("ProduitEssaiNeuf"), p);
    att(readFileSync(p.tableReelle, "utf8") === avant, `la table « réelle » a été étendue par un essai : ${readFileSync(p.tableReelle, "utf8")}`);
    att(status !== 0, `l'essai a abouti (exit ${status}) : ${sortie.slice(0, 300)}`);
    att(readFileSync(p.copie, "utf8") === "", "la copie du registre a reçu des lignes alors que l'essai est refusé");
    att(/FORGE_PRODUITS_PSEUDO/.test(sortie), `le refus ne nomme pas la variable à poser : ${sortie.slice(0, 300)}`);
  });

  check("VERTE — le même essai, tables jetables DÉSIGNÉES : ingéré, seule la table jetable s'étend", () => {
    const p = parc();
    const avant = readFileSync(p.tableReelle, "utf8");
    const jet = join(p.r, "jetables");
    mkdirSync(jet);
    writeFileSync(join(jet, "noms.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
    writeFileSync(join(jet, "produits.json"), JSON.stringify({ produits: {} }), "utf8");
    const { status, sortie } = essayer(lot("ProduitEssaiNeuf"), p,
      { FORGE_NOMS_INTERDITS: join(jet, "noms.json"), FORGE_PRODUITS_PSEUDO: join(jet, "produits.json") });
    att(status === 0, `essai refusé (exit ${status}) : ${sortie.slice(0, 400)}`);
    att(readFileSync(p.tableReelle, "utf8") === avant, "la table « réelle » a bougé alors que les tables jetables étaient désignées");
    const t = JSON.parse(readFileSync(join(jet, "produits.json"), "utf8"));
    att(t.produits.ProduitEssaiNeuf === "Produit-01", `la table jetable n'a pas reçu le produit : ${JSON.stringify(t.produits)}`);
    const c = creations(p.copie);
    att(c.length === 2 && c.every((x) => x.demandeur === "Produit-01"), `2 créations pseudonymisées attendues : ${JSON.stringify(c.map((x) => x.demandeur))}`);
  });

  check("VERTE — un produit DÉJÀ connu de la table réelle : l'essai passe en lecture seule, rien n'y est écrit", () => {
    const p = parc({ ProduitDejaConnu: "Produit-07" });
    const avant = readFileSync(p.tableReelle, "utf8");
    const { status, sortie } = essayer(lot("ProduitDejaConnu"), p);
    att(status === 0, `essai refusé alors qu'il n'étend rien (exit ${status}) : ${sortie.slice(0, 400)}`);
    att(readFileSync(p.tableReelle, "utf8") === avant, "la table « réelle » a été réécrite par une lecture");
    const c = creations(p.copie);
    att(c.length === 2 && c.every((x) => x.demandeur === "Produit-07"), `demandeurs attendus Produit-07 : ${JSON.stringify(c.map((x) => x.demandeur))}`);
  });

  check("VERTE — sans registre jetable (l'ingestion réelle), l'écrivain étend la table ; avec le marqueur, il refuse", () => {
    const p = parc();
    const url = pathToFileURL(join(ICI, "anonymiser-entrant.mjs")).href;
    const code = `import { pseudoProduit } from ${JSON.stringify(url)};`
      + "try { process.stdout.write(String(pseudoProduit(process.argv[1]))); } catch (e) { process.stdout.write('REFUS:' + e.message); }";
    const enfant = (extra) => spawnSync(process.execPath, ["--input-type=module", "-e", code, "ProduitReelNeuf"],
      { encoding: "utf8", env: envEssai({ FORGE_ROOT: p.r, ...extra }) }).stdout;
    const avant = readFileSync(p.tableReelle, "utf8");
    const refus = enfant({ [MARQUEUR_REGISTRE_JETABLE]: p.copie });
    att(/^REFUS:.*FORGE_PRODUITS_PSEUDO/s.test(refus), `marqueur posé, l'écrivain n'a pas refusé : « ${refus} »`);
    att(readFileSync(p.tableReelle, "utf8") === avant, "le refus a laissé une écriture dans la table");
    const reel = enfant({});
    att(reel === "Produit-01", `hors registre jetable, l'écrivain rend « ${reel} » au lieu de Produit-01 — la garde mord sur l'ingestion réelle`);
    att(JSON.parse(readFileSync(p.tableReelle, "utf8")).produits.ProduitReelNeuf === "Produit-01", "l'ingestion réelle n'a pas inscrit le produit");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\ningerer-registre-jetable (TF-1431) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
