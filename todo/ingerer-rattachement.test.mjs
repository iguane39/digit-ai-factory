#!/usr/bin/env node
/**
 * ingerer-rattachement.test.mjs — TF-1432 (28/09/2026) : UN PRODUIT CONNU PAR SA RACINE NE REÇOIT PAS
 * UN SECOND PSEUDONYME.
 *
 * LE FAIT PAYÉ : un même produit est Produit-73 depuis le 27/09, sous la forme de son nom de dossier,
 * et Produit-76 depuis le 28/09, sous la forme de son préfixe de lot. Les règles qui comparent les
 * lots d'un même produit, comme LOT-IDS, n'en voient plus aucun. Le lot déclarait pourtant sa racine
 * (`racine_produit`, TF-0555), et le dossier de cette racine avait déjà son pseudonyme.
 *
 * Le cas est rejoué en miniature, sur des tables jetables et des noms inventés : la clé connue est la
 * forme du dossier dont le client est déjà pseudonymisé, comme celle de Produit-73 ; la racine
 * déclarée porte le nom du client en clair, comme le chemin qu'écrit le produit.
 *
 *   VERTE : table qui déclare le bloc `rattachements` → le préfixe neuf REJOINT le pseudonyme de sa
 *           racine, déclaré au bloc et daté ; aucun pseudonyme neuf ;
 *   GARDE : table sans ce bloc → le pseudonyme neuf est alloué comme avant, et le dédoublement est DIT,
 *           parce que la règle K5 du canal (« un pseudonyme, une clé ») refuserait l'alias non déclaré ;
 *   ROUGE : une racine dont le dossier n'a PAS de pseudonyme → rien n'est rattaché, rien n'est dit ;
 *   VERTE : un produit DÉJÀ dédoublé est dit à chaque lot, sans rien écrire ;
 *   GARDE : un essai sur registre jetable ne rattache pas plus qu'il n'alloue (TF-1431) ;
 *   UNITÉ : `pseudonymeDeRacine` lit le pseudonyme d'un dossier en deux passes, et seulement s'il est à
 *           la table.
 *
 * Exit : 0 = tous les sens tenus · 1 = au moins un sens perdu.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
let pass = 0, fail = 0;
const check = async (nom, fn) => { try { await fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (ok, msg) => { if (!ok) throw new Error(msg); };

const T = mkdtempSync(join(tmpdir(), "rattachement-"));
const LOT_CONFORME = "# lot\n\n## Remarques restées au produit\n\n"
  + "Aucune remarque n'est restée au produit — vérifié le 2026-09-28.\n\n"
  + "## Retours sur les documents produits\n\nAucun document produit depuis un gabarit.\n";
// Noms INVENTÉS : un client, la forme de dossier déjà pseudonymisée côté client, un préfixe de lot neuf.
const CLIENTS = { noms: ["Fictilabs"], identifiants: [], sigles: [], pseudonymes: { Fictilabs: "Client-Z" } };
const CLE_DOSSIER = "outil-compta-Client-Z";
const PREFIXE = "Ventilation de facture Fictilabs";

/** L'environnement d'une ingestion jetable : aucune variable de table héritée, puis les nôtres. */
const env = (extra = {}) => {
  const e = { ...process.env };
  for (const k of ["FORGE_NOMS_INTERDITS", "FORGE_PRODUITS_PSEUDO", "FORGE_CONFIDENTIEL", "FORGE_ROOT", "FORGE_REGISTRE_JETABLE"]) delete e[k];
  return { ...e, ...extra };
};

/** Un parc jetable : tables désignées, registre vide ; `table` complète la table des produits. */
const parc = (table) => {
  const r = mkdtempSync(join(T, "parc-"));
  writeFileSync(join(r, "noms.json"), JSON.stringify(CLIENTS), "utf8");
  writeFileSync(join(r, "produits.json"), JSON.stringify(table), "utf8");
  const registre = join(r, "TODO.jsonl");
  writeFileSync(registre, "", "utf8");
  return { r, registre, table: join(r, "produits.json"),
    env: env({ FORGE_ROOT: r, FORGE_NOMS_INTERDITS: join(r, "noms.json"), FORGE_PRODUITS_PSEUDO: join(r, "produits.json") }) };
};

let serie = 0;
const ingerer = (p, prefixe, racine, envImpose = null) => {
  const d = mkdtempSync(join(T, "lot-"));
  const base = `${prefixe} - RETOURS - 20260928${String.fromCharCode(97 + (serie++ % 26))}`;
  writeFileSync(join(d, `${base}.md`), LOT_CONFORME, "utf8");
  const ligne = (t) => JSON.stringify({ schema: 1, titre: `pilot : ${t}`, contenu: `constat ${t} remonté par le produit`, demandeur: prefixe,
    source: `lot ${base}`, date_demande: "2026-09-28", forges_cibles_initiales: ["digit-ai-factory"], preuve_du_cout: "mesuré sur pièce",
    classe: "anonymisation-portee-partielle", racine_produit: racine });
  writeFileSync(join(d, `${base}.tf.jsonl`), ligne("un") + "\n" + ligne("deux") + "\n", "utf8");
  const res = spawnSync(process.execPath, [OUTIL, join(d, `${base}.tf.jsonl`), "--registre", p.registre, "--sans-fetch"],
    { encoding: "utf8", timeout: 180000, env: envImpose || p.env });
  const lignes = readFileSync(p.registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  return { status: res.status, sortie: (res.stdout || "") + (res.stderr || ""), lignes, table: JSON.parse(readFileSync(p.table, "utf8")) };
};
const valeurs = (t) => Object.values(t.produits);
const racineConnue = (p) => join(p.r, "_Fictilabs", "outil-compta-Fictilabs");

try {
  await check("VERTE — table à bloc « rattachements » : le préfixe neuf rejoint le pseudonyme de sa racine, déclaré et daté", () => {
    const p = parc({ produits: { [CLE_DOSSIER]: "Produit-05" }, depuis: { [CLE_DOSSIER]: "2026-09-27" }, rattachements: {} });
    const { status, sortie, lignes, table } = ingerer(p, PREFIXE, racineConnue(p));
    att(status === 0, `ingestion refusée (exit ${status}) : ${sortie.slice(0, 400)}`);
    att(table.produits[PREFIXE] === "Produit-05", `le préfixe a reçu ${table.produits[PREFIXE]} au lieu de Produit-05 — un second pseudonyme pour le même produit`);
    att(!valeurs(table).includes("Produit-06"), `un pseudonyme neuf a été alloué : ${JSON.stringify(table.produits)}`);
    att(table.rattachements && table.rattachements[PREFIXE] && table.rattachements[PREFIXE].pseudonyme === "Produit-05",
      `le rattachement n'est pas déclaré au bloc : ${JSON.stringify(table.rattachements)}`);
    att(/^\d{4}-\d{2}-\d{2}$/.test(String((table.depuis || {})[PREFIXE] || "")), "la clé rattachée n'est pas datée au bloc depuis (K6)");
    const c = lignes.filter((l) => l.ev === "creation");
    att(c.length === 2 && c.every((x) => x.demandeur === "Produit-05"), `demandeurs attendus Produit-05 : ${JSON.stringify(c.map((x) => x.demandeur))}`);
    att(/\[RATTACHÉ\]/.test(sortie), "le rattachement n'est pas dit à la sortie");
  });

  await check("GARDE — table sans bloc « rattachements » : pseudonyme neuf alloué comme avant, et le dédoublement est DIT", () => {
    const p = parc({ produits: { [CLE_DOSSIER]: "Produit-05" }, depuis: { [CLE_DOSSIER]: "2026-09-27" } });
    const { status, sortie, table } = ingerer(p, PREFIXE, racineConnue(p));
    att(status === 0, `ingestion refusée (exit ${status}) : ${sortie.slice(0, 400)}`);
    att(table.produits[PREFIXE] === "Produit-06", `sans bloc déclaré, attendu l'allocation d'avant (Produit-06), reçu ${table.produits[PREFIXE]}`);
    att(!("rattachements" in table), "un bloc « rattachements » a été créé par l'écrivain : c'est une décision de table");
    att(/\[DEUX PSEUDONYMES\][^\n]*Produit-06[^\n]*Produit-05/.test(sortie), `le dédoublement n'est pas dit avec ses deux pseudonymes : ${sortie.slice(0, 600)}`);
  });

  await check("ROUGE — une racine dont le dossier n'a PAS de pseudonyme : rien n'est rattaché, rien n'est dit", () => {
    const p = parc({ produits: { [CLE_DOSSIER]: "Produit-05" }, depuis: { [CLE_DOSSIER]: "2026-09-27" }, rattachements: {} });
    const { status, sortie, table } = ingerer(p, PREFIXE, join(p.r, "_Fictilabs", "un-autre-outil"));
    att(status === 0, `ingestion refusée (exit ${status}) : ${sortie.slice(0, 400)}`);
    att(table.produits[PREFIXE] === "Produit-06", `un produit sans racine connue devait recevoir Produit-06, reçu ${table.produits[PREFIXE]}`);
    att(Object.keys(table.rattachements).length === 0, `un rattachement a été déclaré sans racine connue : ${JSON.stringify(table.rattachements)}`);
    att(!/\[RATTACHÉ\]|\[DEUX PSEUDONYMES\]/.test(sortie), "un rattachement ou un dédoublement est annoncé à tort");
  });

  await check("VERTE — un produit DÉJÀ dédoublé est dit à chaque lot, sans rien écrire à la table", () => {
    const t0 = { produits: { [CLE_DOSSIER]: "Produit-05", [PREFIXE]: "Produit-06" }, depuis: { [CLE_DOSSIER]: "2026-09-27", [PREFIXE]: "2026-09-28" } };
    const p = parc(t0);
    const avant = readFileSync(p.table, "utf8");
    const { status, sortie } = ingerer(p, PREFIXE, racineConnue(p));
    att(status === 0, `ingestion refusée (exit ${status}) : ${sortie.slice(0, 400)}`);
    att(readFileSync(p.table, "utf8") === avant, "la table a été réécrite pour un produit déjà connu");
    att(/\[DEUX PSEUDONYMES\][^\n]*Produit-06[^\n]*Produit-05/.test(sortie), `le dédoublement existant n'est pas dit : ${sortie.slice(0, 600)}`);
  });

  await check("GARDE — un essai sur registre jetable (TF-1431) ne rattache pas plus qu'il n'alloue", () => {
    const r = mkdtempSync(join(T, "essai-"));
    const tables = join(r, "_confidentiel", "tables");
    mkdirSync(tables, { recursive: true });
    writeFileSync(join(tables, "noms-interdits.json"), JSON.stringify(CLIENTS), "utf8");
    writeFileSync(join(tables, "produits-pseudonymes.json"), JSON.stringify({ produits: { [CLE_DOSSIER]: "Produit-05" }, depuis: { [CLE_DOSSIER]: "2026-09-27" }, rattachements: {} }), "utf8");
    const avant = readFileSync(join(tables, "produits-pseudonymes.json"), "utf8");
    const registre = join(r, "copie.jsonl");
    writeFileSync(registre, "", "utf8");
    const e = env({ FORGE_ROOT: r });
    delete e.FORGE_CONTEXTE_BANC;
    const p = { r, registre, table: join(tables, "produits-pseudonymes.json"), env: e };
    const { status } = ingerer(p, PREFIXE, join(r, "_Fictilabs", "outil-compta-Fictilabs"));
    att(status !== 0, "l'essai a abouti");
    att(readFileSync(join(tables, "produits-pseudonymes.json"), "utf8") === avant, "un essai sur registre jetable a écrit un rattachement dans la table « réelle »");
  });

  await check("UNITÉ — pseudonymeDeRacine : deux passes, et seulement un pseudonyme de la table", async () => {
    const p = parc({ produits: { [CLE_DOSSIER]: "Produit-05" }, depuis: { [CLE_DOSSIER]: "2026-09-27" } });
    process.env.FORGE_NOMS_INTERDITS = join(p.r, "noms.json");
    process.env.FORGE_PRODUITS_PSEUDO = join(p.r, "produits.json");
    const m = await import(pathToFileURL(join(ICI, "anonymiser-entrant.mjs")).href);
    att(typeof m.pseudonymeDeRacine === "function", "anonymiser-entrant n'exporte pas pseudonymeDeRacine");
    att(m.pseudonymeDeRacine(racineConnue(p)) === "Produit-05", "la forme en clair du dossier ne rejoint pas la clé à client pseudonymisé");
    att(m.pseudonymeDeRacine("C:/parc/_Client-Z/Produit-05") === "Produit-05", "un dossier déjà nommé par son pseudonyme n'est pas reconnu");
    att(m.pseudonymeDeRacine("C:/parc/_Client-Z/Produit-99") === null, "un pseudonyme absent de la table est rendu comme s'il désignait un produit");
    att(m.pseudonymeDeRacine(join(p.r, "_Fictilabs", "un-autre-outil")) === null, "un dossier inconnu reçoit un pseudonyme");
    att(m.pseudonymeDeRacine("") === null && m.pseudonymeDeRacine(undefined) === null, "une racine vide n'est pas sans objet");
    att(JSON.parse(readFileSync(p.table, "utf8")).produits[CLE_DOSSIER] === "Produit-05" && Object.keys(JSON.parse(readFileSync(p.table, "utf8")).produits).length === 1,
      "la lecture d'une racine a écrit dans la table");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\ningerer-rattachement (TF-1432) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
