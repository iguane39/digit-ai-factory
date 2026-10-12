#!/usr/bin/env node
/**
 * ingerer-personnes.test.mjs — le relevé des noms de personnes (TF-1357) se joue aussi à
 * l'INGESTION d'un sidecar, pas seulement à l'accueil (TF-1405, campagne du 12/10/2026).
 *
 * Le doute de TF-1405 : `ingerer-lot.mjs` est aussi le chemin des sidecars que le pilot écrit lui-même
 * et de tout lot qui n'est pas passé par le sas ; un nom de personne y entrerait au registre, suivi et
 * publié, sans avoir été nommé à l'écran. Le code l'appelait déjà (apport de 2ef00ef) mais aucune
 * recette ne le jouait de bout en bout : celle-ci le joue sur un registre jetable.
 * Rouge : un sidecar qui nomme une personne (noms INVENTÉS) est relevé, nommé à l'écran et compté à
 * l'événement d'ingestion, sans que le nom y soit écrit, et sans refus (exit 0). Vert : un sidecar
 * sans personne ne déclenche rien.
 *
 * Tables JETABLES posées ici (TF-0957). Joué par `oracles\self-tests.mjs` (I2).
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

const T = mkdtempSync(join(tmpdir(), "ingerer-personnes-"));
const PARC = join(T, "parc");
mkdirSync(PARC, { recursive: true });
writeFileSync(join(T, "_noms-interdits.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
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
  const sidecar = join(T, `revue-personnes-2026101${serie}a.tf.jsonl`);
  writeFileSync(sidecar, JSON.stringify({ schema: 1, titre: "pilot : un retour de recette", contenu, demandeur: "pilot", source: "banc", date_demande: "2026-10-12", forges_cibles_initiales: ["digit-ai-factory"] }) + "\n", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, "--sans-fetch"], { encoding: "utf8", env: ENV });
  const evs = readFileSync(registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), ing: evs.find((e) => e.ev === "ingestion") };
};

check("rouge — un sidecar ingéré directement qui nomme une personne est relevé, nommé à l'écran, compté à l'événement", () => {
  const r = ingerer("Le contrôle croisé a été mené par Marie DUPONTEL, qui a relu le lot.");
  if (r.code !== 0) throw new Error(`exit ${r.code} attendu 0 (avertissement, jamais un refus) : ${r.sortie.slice(0, 300)}`);
  if (!/\[NOMS DE PERSONNES À QUALIFIER\] 1 /.test(r.sortie)) throw new Error(`relevé absent : ${r.sortie.slice(0, 400)}`);
  if (!/Marie DUPONTEL/.test(r.sortie)) throw new Error("la forme n'est pas nommée à l'écran");
  if (!r.ing || r.ing.noms_de_personnes_a_qualifier !== 1) throw new Error(`événement d'ingestion : ${JSON.stringify(r.ing)}`);
  if (JSON.stringify(r.ing).includes("DUPONTEL")) throw new Error("l'événement d'ingestion porte le NOM — il ne doit porter que le nombre");
});
check("vert — un sidecar sans personne ne déclenche aucun relevé", () => {
  const r = ingerer("Le contrôle croisé a été rejoué par le pilot sur les 14 lots du jour.");
  if (/NOMS DE PERSONNES À QUALIFIER/.test(r.sortie)) throw new Error(`faux positif : ${r.sortie.slice(0, 300)}`);
  if (r.ing && r.ing.noms_de_personnes_a_qualifier) throw new Error("le compteur est posé à tort");
});

rmSync(T, { recursive: true, force: true });
console.log(`\ningerer-personnes (TF-1405) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
