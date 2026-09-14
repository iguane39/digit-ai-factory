#!/usr/bin/env node
/**
 * ingerer-doublon.test.mjs — TF-0956 : un doublon STRICT est refusé à la porte du registre.
 *
 * Le fait du 08/09 : deux lots renommés par la passe de pseudonymisation sont redevenus « jamais
 * ingérés » (l'idempotence reconnaît un lot à l'empreinte de son fichier) et ont été ingérés une
 * seconde fois — six candidatures au titre ET au contenu identiques à six autres, entrées sans que
 * rien ne bronche. `ingerer-lot.mjs` compare désormais chaque candidature, APRÈS anonymisation, aux
 * créations du registre (actifs et archive) et aux autres lignes du même lot.
 *
 * Double sens : l'identique est refusé (y compris aux espaces et à la casse près), UN mot de
 * différence passe — un quasi-doublon relève du rapprochement signalé, jamais du refus.
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

const T = mkdtempSync(join(tmpdir(), "doublon-"));
// Tables d'anonymisation JETABLES, comme pour la recette de rectification : la chaîne d'ingestion
// les exige, et les vraies feraient dépendre la recette d'un état hors dépôt.
writeFileSync(join(T, "_noms-interdits.json"), JSON.stringify({ noms: [], pseudonymes: {} }), "utf8");
writeFileSync(join(T, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
const ENV = {
  ...process.env,
  FORGE_NOMS_INTERDITS: join(T, "_noms-interdits.json"),
  FORGE_PRODUITS_PSEUDO: join(T, "_produits-pseudonymes.json"),
};

const TITRE = "pilot : un item de recette deja au registre";
const CONTENU = "le contenu exact deja ingere une premiere fois";
const ITEM_EXISTANT = JSON.stringify({
  ev: "creation", ts: "2026-09-01T10:00:00.000Z", id: "TF-0100", statut: "candidat",
  titre: TITRE, contenu: CONTENU, demandeur: "pilot (recette)", source: "fixture", date_demande: "2026-09-01",
  forges_cibles_initiales: ["digit-ai-factory"], score: { gain: 3, preuve: 3, effort: 3, valeur: 3 },
});
const CANDIDATURE = (sur = {}) => JSON.stringify({
  schema: 1, titre: TITRE, contenu: CONTENU, demandeur: "produit-recette", source: "lot de recette",
  date_demande: "2026-09-14", forges_cibles_initiales: ["digit-ai-factory"], ...sur,
});

let serie = 0;
const ingerer = (lignesSidecar) => {
  const dossier = join(T, `cas-${++serie}`);
  const registre = join(dossier, "TODO.jsonl");
  const sidecar = join(dossier, `candidature-recette-${serie}.tf.jsonl`);
  mkdirSync(dossier, { recursive: true });
  writeFileSync(registre, ITEM_EXISTANT + "\n", "utf8");
  writeFileSync(sidecar, lignesSidecar.join("\n") + "\n", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, "--sans-fetch"],
    { encoding: "utf8", env: ENV });
  const lignes = readFileSync(registre, "utf8").split("\n").filter((l) => l.trim());
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), lignes };
};

check("rouge — titre et contenu IDENTIQUES à un item du registre : rejet atomique, l'original nommé, registre intact", () => {
  const r = ingerer([CANDIDATURE()]);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 : ${r.sortie.slice(0, 200)}`);
  if (!/doublon STRICT de TF-0100/.test(r.sortie)) throw new Error(`le refus ne nomme pas l'original : ${r.sortie.slice(0, 200)}`);
  if (r.lignes.length !== 1) throw new Error("le registre a été touché malgré le refus");
});

check("rouge — le MÊME texte, espaces et casse changés : c'est toujours un doublon strict", () => {
  const r = ingerer([CANDIDATURE({ titre: "  Pilot : un item de recette  DEJA au registre", contenu: CONTENU.toUpperCase() })]);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — la normalisation ne tient pas`);
});

check("rouge — deux lignes identiques DANS le même lot : la seconde est nommée", () => {
  const neuve = CANDIDATURE({ titre: "pilot : une candidature neuve", contenu: "un fait neuf" });
  const r = ingerer([neuve, neuve]);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/doublon STRICT de la ligne 1 du même lot/.test(r.sortie)) throw new Error(`le refus ne nomme pas la ligne d'origine : ${r.sortie.slice(0, 200)}`);
  if (r.lignes.length !== 1) throw new Error("le registre a été touché malgré le refus");
});

check("verte — UN mot de différence dans le contenu : la candidature ENTRE (le quasi-doublon se signale, il ne se refuse pas)", () => {
  const r = ingerer([CANDIDATURE({ contenu: CONTENU + " — avec un fait neuf" })]);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  if (!r.lignes.some((l) => /"ev":"creation"/.test(l) && !/"TF-0100"/.test(l))) throw new Error("aucune création écrite");
});

try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
console.log(`\nTF-0956 (doublon strict à la porte) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
