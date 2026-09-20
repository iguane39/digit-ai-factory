#!/usr/bin/env node
/**
 * ingerer-identifiants.test.mjs — un identifiant technique inconnu des tables se fait QUALIFIER à
 * l'ingestion (TF-0966, 15/09/2026).
 *
 * Le cas fondateur en miniature, avec des noms INVENTÉS : un lot cite une table `MAJUSCULES_SOULIGNÉES`
 * et un objet `schema.table` qu'aucune table de pseudonymisation ne connaît. L'ingestion doit les
 * NOMMER à l'écran et en compter le nombre à l'événement d'ingestion, sans jamais écrire leur nom
 * dans ce dernier. Deux sens verts : un identifiant inscrit à la table est substitué (plus rien à
 * qualifier), et un identifiant du vocabulaire public du pilot n'est pas relevé.
 *
 * Tables JETABLES posées ici (TF-0957) : un banc n'hérite jamais des tables réelles du canal.
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

const T = mkdtempSync(join(tmpdir(), "ingerer-ident-"));
const PARC = join(T, "parc");
mkdirSync(PARC, { recursive: true });
writeFileSync(join(T, "_noms-interdits.json"), JSON.stringify({
  noms: [], identifiants: ["ZRG_TABLE_CONNUE"], sigles: [], pseudonymes: { ZRG_TABLE_CONNUE: "TABLE-A" },
}), "utf8");
writeFileSync(join(T, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
const ENV = {
  ...process.env, FORGE_ROOT: PARC,
  FORGE_NOMS_INTERDITS: join(T, "_noms-interdits.json"), FORGE_PRODUITS_PSEUDO: join(T, "_produits-pseudonymes.json"),
};
const REGISTRE_BASE = JSON.stringify({ ev: "creation", ts: "2026-08-20T10:00:00.000Z", id: "TF-0001", titre: "t", contenu: "c", demandeur: "pilot", source: "s", date_demande: "2026-08-20", statut: "candidat", forges_cibles_initiales: ["digit-ai-factory"], score: { gain: 3, preuve: 1, effort: 1, valeur: 3 } }) + "\n";
let serie = 0;
const ingerer = (contenu) => {
  const registre = join(T, `reg-${++serie}.jsonl`);
  writeFileSync(registre, REGISTRE_BASE, "utf8");
  const sidecar = join(T, `revue-identifiants-2026091${serie}a.tf.jsonl`);
  writeFileSync(sidecar, JSON.stringify({ schema: 1, titre: "pilot : un retour de recette", contenu, demandeur: "pilot", source: "banc", date_demande: "2026-09-15", forges_cibles_initiales: ["digit-ai-factory"] }) + "\n", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, "--sans-fetch"], { encoding: "utf8", env: ENV });
  const evs = readFileSync(registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), ing: evs.find((e) => e.ev === "ingestion"), brut: readFileSync(registre, "utf8") };
};

check("rouge — deux identifiants inconnus des tables (MAJUSCULES et schema.table) : nommés à l'écran, comptés à l'événement", () => {
  const r = ingerer("La vue ZRG_FACTU_LIGNE lit crm_prod.clients_actifs chaque nuit.");
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 (avertissement, jamais un refus) : ${r.sortie.slice(0, 300)}`);
  if (!/\[IDENTIFIANTS À QUALIFIER\] 2 /.test(r.sortie)) throw new Error(`relevé absent ou faux : ${r.sortie.slice(0, 400)}`);
  if (!/ZRG_FACTU_LIGNE/.test(r.sortie) || !/crm_prod\.clients_actifs/.test(r.sortie)) throw new Error("les identifiants ne sont pas nommés");
  if (!r.ing || r.ing.identifiants_a_qualifier !== 2) throw new Error(`événement d'ingestion : ${JSON.stringify(r.ing)}`);
  if (JSON.stringify(r.ing).includes("ZRG_FACTU_LIGNE")) throw new Error("l'événement d'ingestion porte un NOM — il ne doit porter que le nombre");
});
check("vert — un identifiant INSCRIT à la table est substitué avant le relevé : rien à qualifier", () => {
  const r = ingerer("La vue ZRG_TABLE_CONNUE est lue chaque nuit.");
  if (/\[IDENTIFIANTS À QUALIFIER\]/.test(r.sortie)) throw new Error("un identifiant déjà qualifié est redemandé");
  if (!/TABLE-A/.test(r.brut) || /ZRG_TABLE_CONNUE/.test(r.brut)) throw new Error("la substitution de la table n'a pas eu lieu");
  if (r.ing && r.ing.identifiants_a_qualifier) throw new Error("le compteur est posé à tort");
});
check("vert — le vocabulaire PUBLIC du pilot (une variable de ses propres scripts) n'est pas relevé", () => {
  const r = ingerer("Poser FORGE_NOMS_INTERDITS avant de juger un clone, et lire todo.jsonl pour le détail.");
  if (/\[IDENTIFIANTS À QUALIFIER\]/.test(r.sortie)) throw new Error(`faux positif sur le vocabulaire public : ${r.sortie.slice(0, 300)}`);
});

rmSync(T, { recursive: true, force: true });
console.log(`\ningerer-identifiants (TF-0966) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
