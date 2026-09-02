#!/usr/bin/env node
/**
 * ingerer-anonymise-fichier.test.mjs — L'ÉVÉNEMENT D'INGESTION PASSE PAR LA MÊME SUBSTITUTION QUE
 * LA CANDIDATURE (02/09/2026, retour du lot 20260831c du Produit-12).
 *
 * Le fait, mesuré deux fois par le produit : `ingerer-lot.mjs` anonymisait bien chaque candidature
 * — la sortie affichait « [ANONYMISÉ] … 3 nom(s) substitué(s) » — et écrivait ENSUITE
 * `{"ev":"ingestion","fichier":"input/00-retours/<client>-<projet> - RETOURS - …"}` tel quel.
 * Le registre est suivi par git, dans un dépôt public : deux occurrences d'un nom de client sont
 * entrées dans un commit pendant que l'outil annonçait propre. Même mécanisme dans l'événement
 * `heritage_non_verifie`, qui porte le nom du projet lu dans le nom du lot.
 *
 * Cette recette joue une ingestion réelle d'un lot dont le NOM DE FICHIER porte un nom interdit
 * et un nom de produit, avec des tables jetables, et exige un registre sans aucune des deux
 * graphies — événements d'ingestion compris. Le second sens : le pseudonyme, lui, doit y être.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
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

const T = mkdtempSync(join(tmpdir(), "ingerer-anon-"));
// Un parc VIDE : le produit n'y est pas, donc R-47 consigne `heritage_non_verifie` avec le nom
// du projet — exactement le second chemin de fuite.
const PARC = join(T, "parc");
mkdirSync(PARC, { recursive: true });
writeFileSync(join(T, "_noms-interdits.json"), JSON.stringify({
  noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" },
}), "utf8");
writeFileSync(join(T, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
const ENV = {
  ...process.env, FORGE_ROOT: PARC,
  FORGE_NOMS_INTERDITS: join(T, "_noms-interdits.json"), FORGE_PRODUITS_PSEUDO: join(T, "_produits-pseudonymes.json"),
};

const NOM = "Zorglub-Courrier - RETOURS - 20260101a";
const boite = join(T, "input", "00-retours");
mkdirSync(boite, { recursive: true });
const sidecar = join(boite, `${NOM}.tf.jsonl`);
// Deux candidatures : R-47 ne joue que sur un lot à plus d'une création (borne de l'ingesteur).
writeFileSync(sidecar, [
  JSON.stringify({ schema: 1, titre: "pilot : premier retour de Zorglub-Courrier", contenu: "c1", demandeur: "Zorglub-Courrier",
    source: "lot Zorglub-Courrier - RETOURS - 20260101a", date_demande: "2026-01-01", forges_cibles_initiales: ["digit-ai-factory"] }),
  JSON.stringify({ schema: 1, titre: "pilot : second retour", contenu: "c2", demandeur: "Zorglub-Courrier",
    source: "lot Zorglub-Courrier - RETOURS - 20260101a", date_demande: "2026-01-01", forges_cibles_initiales: ["digit-ai-factory"] }),
].join("\n") + "\n", "utf8");
// Lot daté d'avant R-45/R-46 : le .md n'a pas à porter les sections, ce n'est pas le sujet ici.
writeFileSync(join(boite, `${NOM}.md`), "# lot\n\n## pilot\n\ntable\n", "utf8");
const registre = join(T, "TODO.jsonl");
writeFileSync(registre, "", "utf8");

const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, "--sans-fetch"], { encoding: "utf8", env: ENV, timeout: 180000 });
const sortie = (r.stdout || "") + (r.stderr || "");
const contenu = readFileSync(registre, "utf8");
const evs = contenu.split("\n").filter(Boolean).map((l) => JSON.parse(l));

check("le lot est ingéré (exit 0, 2 créations, 1 ingestion, 1 héritage non vérifié)", () => {
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${sortie.slice(0, 400)}`);
  const ing = evs.filter((e) => e.ev === "ingestion");
  if (evs.filter((e) => e.ev === "creation").length !== 2) throw new Error("2 créations attendues");
  if (!ing.some((e) => e.creations === 2)) throw new Error("l'événement d'ingestion des créations manque");
  if (!ing.some((e) => e.heritage_non_verifie)) throw new Error("l'événement heritage_non_verifie manque — le parc vide devait le produire");
});

check("rouge → vert : AUCUNE graphie interdite dans le registre, événements d'ingestion compris", () => {
  if (/Zorglub/.test(contenu)) {
    const ou = evs.filter((e) => /Zorglub/.test(JSON.stringify(e))).map((e) => e.ev + (e.heritage_non_verifie ? "/heritage" : ""));
    throw new Error(`nom interdit présent dans : ${ou.join(", ")}`);
  }
});

check("second sens — le pseudonyme du produit EST dans le registre (fichier et projet)", () => {
  const ing = evs.find((e) => e.ev === "ingestion" && e.creations === 2);
  if (!/Produit-\d\d/.test(ing.fichier)) throw new Error(`fichier consigné sans pseudonyme : ${ing.fichier}`);
  const her = evs.find((e) => e.heritage_non_verifie);
  if (!/Produit-\d\d/.test(String(her.heritage_non_verifie.projet))) throw new Error(`projet consigné sans pseudonyme : ${her.heritage_non_verifie.projet}`);
});

check("la sortie de l'outil ne répète pas le nom réel du produit dans sa ligne [ANONYMISÉ]", () => {
  const ligne = sortie.split("\n").find((l) => /\[ANONYMIS/.test(l) && /produit/.test(l)) || "";
  if (/Zorglub-Courrier/.test(ligne)) throw new Error(`la ligne d'annonce porte le nom réel : ${ligne}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\ningerer-lot (l'événement d'ingestion est anonymisé comme la candidature) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
