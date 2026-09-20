#!/usr/bin/env node
/**
 * ingerer-controle.test.mjs — UN CARACTÈRE DE CONTRÔLE N'ENTRE PAS AU REGISTRE (TF-1067).
 *
 * Quatre octets nuls sont entrés au registre par des lots dont un chemin Windows avait été écrit
 * dans une chaîne Python non brute ; la page du registre les recopiait, et le registre étant
 * append-only, la seule place où les arrêter est l'ingestion. Les deux sens, sur un registre et
 * des tables jetables (TF-0957) :
 *   ROUGE : un contenu portant un octet nul (échappement JSON, comme dans le cas réel) → rejet
 *           atomique, champ et code nommés, registre intact ;
 *   VERT  : le même chemin écrit correctement (antislash doublé) → ingéré.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

const T = mkdtempSync(join(tmpdir(), "ingerer-controle-"));
writeFileSync(join(T, "_noms.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
writeFileSync(join(T, "_prod.json"), JSON.stringify({ produits: {} }), "utf8");
const ENV = { ...process.env, FORGE_NOMS_INTERDITS: join(T, "_noms.json"), FORGE_PRODUITS_PSEUDO: join(T, "_prod.json") };
const registre = join(T, "TODO.jsonl");
writeFileSync(registre, "", "utf8");
// JSON.stringify écrit l'octet nul en échappement, exactement comme le sidecar du cas réel.
const ligne = (contenu) => JSON.stringify({ schema: 1, titre: "pilot : un sas mal nommé", contenu, demandeur: "pilot (recette)",
  source: "ingerer-controle.test.mjs", date_demande: "2026-09-14", forges_cibles_initiales: ["pilot"], score: { gain: 1, preuve: 1, effort: 1 } });
const ingerer = (nom, l) => {
  const p = join(T, nom);
  writeFileSync(p, l + "\n", "utf8");
  const r = spawnSync(process.execPath, [join(ICI, "ingerer-lot.mjs"), p, "--registre", registre, "--sans-fetch"], { encoding: "utf8", env: ENV, timeout: 180000 });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};

try {
  check("ROUGE — un octet nul dans le contenu : rejet atomique, champ et code nommés, registre intact", () => {
    const r = ingerer("rouge.tf.jsonl", ligne(`un sas input${String.fromCharCode(0)}-retours_arrivee`));
    if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — l'octet nul entre au registre`);
    if (!/« contenu »/.test(r.sortie) || !/U\+0000/.test(r.sortie)) throw new Error(`le refus ne nomme ni le champ ni le code : ${r.sortie.slice(0, 300)}`);
    if (readFileSync(registre, "utf8").trim()) throw new Error("le registre a été écrit malgré le refus");
  });
  check("VERT — le même chemin écrit correctement (antislash conservé) : ingéré", () => {
    const r = ingerer("verte.tf.jsonl", ligne("un sas input\\00-retours\\_arrivee"));
    if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  });
} finally {
  rmSync(T, { recursive: true, force: true });
}
console.log(`\ningerer-controle (TF-1067) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
