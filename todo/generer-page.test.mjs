#!/usr/bin/env node
/**
 * generer-page.test.mjs — LA PAGE DU REGISTRE NE PORTE AUCUN CARACTÈRE DE CONTRÔLE (TF-1067).
 *
 * Le fait, mesuré le 12/09 puis le 14/09 : le registre porte quatre échappements JSON
 * `\u0000`, nés d'un chemin « input\00-retours » écrit par un producteur dans une chaîne
 * Python non brute. `JSON.parse` les rend en octets nuls, et la page les recopiait tels quels :
 * binaire pour grep, FAIL d'oracle-caracteres-controle, invisible à l'écran.
 *
 * Les deux sens, sur un registre JETABLE (`TODO_PAGE_SOURCE` / `TODO_PAGE_SORTIE`) — jamais la
 * page réelle, qu'aucune recette n'a le droit de réécrire :
 *   ROUGE → VERT : un item dont le contenu porte un octet nul → la page n'en porte aucun, et le
 *                  pictogramme U+2400 le rend visible à sa place ;
 *   VERT         : un item ordinaire garde son texte, octet pour octet.
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

const T = mkdtempSync(join(tmpdir(), "generer-page-"));
const item = (id, contenu) => JSON.stringify({ ev: "creation", ts: "2026-09-10T10:00:00Z", id, titre: `titre de ${id}`, contenu,
  demandeur: "pilot (recette)", source: "generer-page.test.mjs", date_demande: "2026-09-10", statut: "candidat",
  forges_cibles_initiales: ["digit-ai-factory"], score: { gain: 2, preuve: 2, effort: 1, valeur: 4 } });
// L'octet nul est écrit en ÉCHAPPEMENT JSON, comme dans le registre réel : jamais en octet brut
// dans une source, sans quoi la recette porterait elle-même le défaut qu'elle garde.
const NUL = String.fromCharCode(0);
const source = join(T, "TODO.jsonl"), sortie = join(T, "TODO.html");
writeFileSync(source, [item("TF-9001", `un sas d'arrivee input${NUL}-retours_arrivee, ignore par git`),
  item("TF-9002", "un contenu ordinaire, sans rien de particulier")].join("\n") + "\n", "utf8");
const r = spawnSync(process.execPath, [join(ICI, "generer-page.mjs")], { encoding: "utf8",
  env: { ...process.env, TODO_PAGE_SOURCE: source, TODO_PAGE_ARCHIVE: join(T, "vide.jsonl"), TODO_PAGE_SORTIE: sortie } });

try {
  check("la génération sur le registre jetable aboutit (exit 0)", () => {
    if (r.status !== 0) throw new Error(`exit ${r.status} : ${(r.stderr || r.stdout).slice(0, 300)}`);
  });
  const html = readFileSync(sortie, "utf8");
  check("ROUGE → VERT — l'octet nul du registre n'entre pas dans la page, et son pictogramme le montre", () => {
    const controles = (html.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g) || []).length;
    if (controles) throw new Error(`${controles} caractère(s) de contrôle dans la page — elle est binaire pour grep`);
    if (!html.includes("input␀-retours_arrivee")) throw new Error("le pictogramme U+2400 n'est pas à la place de l'octet nul — le défaut est caché, pas montré");
  });
  check("VERT — un contenu ordinaire garde son texte", () => {
    if (!html.includes("un contenu ordinaire, sans rien de particulier")) throw new Error("le texte d'un item ordinaire a changé");
  });
  check("la page réelle n'est pas touchée par la recette", () => {
    if (sortie === join(ICI, "TODO.html")) throw new Error("la recette écrit la page réelle");
  });
} finally {
  rmSync(T, { recursive: true, force: true });
}
console.log(`\ngenerer-page (TF-1067) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
