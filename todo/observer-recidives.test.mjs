#!/usr/bin/env node
/**
 * observer-recidives.test.mjs — la surveillance des récidives (TF-0790) est prouvée par le geste,
 * rouge et vert, sur un plan isolé : deux relevés identiques → PASS ; un compteur de récidives qui
 * monte d'une unité → FAIL (seuil max_delta 0) ; un seul relevé → données insuffisantes, dit, jamais
 * un vert. Joué par `oracles\self-tests.mjs` (I2). La forge est résolue comme en production ; si elle
 * est absente du poste, la recette le DIT et rend SANS_OBJET — pas un PASS.
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { jouer } from "./observer-recidives.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const FORGE = process.env.FORGE_ROOT ? join(process.env.FORGE_ROOT, "digit-ai-forge-observability") : join(resolve(ICI, "..", ".."), "digit-ai-forge-observability");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

if (!existsSync(join(FORGE, "scripts", "derive.mjs"))) {
  console.log(`observer-recidives : SANS_OBJET — forge-observability introuvable (${FORGE}) ; rien n'est prouvé, et c'est dit`);
  process.exit(0);
}
const T = mkdtempSync(join(tmpdir(), "obs-recidives-"));
const compteurs = join(T, "compteurs.json");
const ecrire = (recidives) => writeFileSync(compteurs, JSON.stringify({ recidives, classes: 30, classes_sans_fondateur: 2, retours_classe_suspecte: 0, produits_non_equipes: 5, manques_heritage: 81 }), "utf8");
// Une sonde `commande` qui rend le JSON des compteurs, comme generer-recidives --json le fait en production.
const sonde = join(T, "sonde.mjs");
writeFileSync(sonde, `import { readFileSync } from "node:fs"; process.stdout.write(readFileSync(${JSON.stringify(compteurs)}, "utf8"));`, "utf8");
const planPath = join(T, "plan.json");
writeFileSync(planPath, JSON.stringify({
  format: "forge-observability/plan@1", nom: "recidives-recette",
  sondes: [
    { nom: "recidives-regeneration", type: "commande", cadence: "hebdomadaire", commande: ["node", sonde], champ_valeur: "recidives", seuils: { max_delta: 0 } },
    { nom: "recidives-compteurs", type: "rapport_json", cadence: "hebdomadaire", fichier: compteurs, champs: ["recidives", "classes", "produits_non_equipes"], seuils: { recidives: { max_delta: 0 }, classes: { max_delta: 0 }, produits_non_equipes: { max_delta: 0 } } },
  ],
}), "utf8");
const snap = join(T, "snapshots.jsonl");
// Le nombre de releves du ledger est la MESURE de ce que l outil ecrit : c est par lui que se
// prouve qu une relecture ne pose rien (TF-1308).
const lignes = (p) => { try { return readFileSync(p, "utf8").trim().split("\n").filter(Boolean).length; } catch { return 0; } };

check("premier passage — un seul relevé : données insuffisantes (exit 2), dit, jamais un vert", () => {
  ecrire(0);
  const r = jouer({ planPath, snapPath: snap, forgePath: FORGE, cwd: T });
  if (r.exit !== 2 || r.verdict !== "donnees_insuffisantes") throw new Error(`verdict ${r.verdict} exit ${r.exit}`);
});
check("verte — second relevé identique : PASS exit 0", () => {
  const r = jouer({ planPath, snapPath: snap, forgePath: FORGE, cwd: T });
  if (r.exit !== 0 || r.verdict !== "PASS") throw new Error(`verdict ${r.verdict} exit ${r.exit} : ${JSON.stringify(r.derive?.findings || r.message).slice(0, 300)}`);
});
check("rouge — une récidive de plus depuis le relevé précédent : FAIL exit 1, la sonde est nommée", () => {
  ecrire(1);
  const r = jouer({ planPath, snapPath: snap, forgePath: FORGE, cwd: T });
  if (r.exit !== 1 || r.verdict !== "FAIL") throw new Error(`verdict ${r.verdict} exit ${r.exit}`);
  const txt = JSON.stringify(r.derive.findings);
  if (!/recidives/.test(txt)) throw new Error(`la dérive ne nomme pas la sonde : ${txt.slice(0, 300)}`);
});
check("forge absente — SANS_OBJET dit, exit 2, jamais un PASS", () => {
  const r = jouer({ planPath, snapPath: snap, forgePath: null, cwd: T });
  if (r.verdict !== "SANS_OBJET" || r.exit !== 2) throw new Error(`verdict ${r.verdict}`);
});
// ---- TF-1308 / D-22 (22/09/2026) : LIRE UNE DERIVE NE LA DEPLACE PAS ------------------------
//
// LE FAIT, trouve en le commettant : le releve d ouverture du 21/09 rendait une derive bloquante ;
// en rejouant l outil pour en LIRE le detail, le verdict est passe au vert, parce que l appel
// avait pose un snapshot DE PLUS et que la derive comparait desormais deux points rapproches.
// Les 2 cas tiennent les 2 sens : la forme qui OBSERVE deplace la reference (c est son travail),
// la forme qui RELIT ne la deplace pas (c est ce qui manquait).
check("ROUGE — la forme qui OBSERVE pose un releve : deux appels de suite EFFACENT la derive", () => {
  const avant = lignes(snap);
  const un = jouer({ planPath, snapPath: snap, forgePath: FORGE, cwd: T });
  const deux = jouer({ planPath, snapPath: snap, forgePath: FORGE, cwd: T });
  if (lignes(snap) !== avant + 2) throw new Error(`${lignes(snap) - avant} releve(s) pose(s), 2 attendus`);
  if (un.verdict === deux.verdict && un.verdict === "FAIL") throw new Error("le second appel rend encore FAIL : le cas fondateur n est plus reproduit, ce banc ne prouve plus rien");
});

check("VERT — --relire rejoue la derive SANS rien poser, et deux relectures rendent le MEME verdict", () => {
  const avant = lignes(snap);
  const a = jouer({ planPath, snapPath: snap, forgePath: FORGE, cwd: T, relire: true });
  const b = jouer({ planPath, snapPath: snap, forgePath: FORGE, cwd: T, relire: true });
  if (lignes(snap) !== avant) throw new Error(`la relecture a pose ${lignes(snap) - avant} releve(s) — elle deplace la reference qu elle lit`);
  if (a.verdict !== b.verdict) throw new Error(`deux relectures rendent ${a.verdict} puis ${b.verdict}`);
  if (a.relu !== true) throw new Error("la relecture ne se declare pas dans sa sortie");
  if (a.observer !== null) throw new Error("la relecture a joue l observateur");
});

rmSync(T, { recursive: true, force: true });
console.log(`\nobserver-recidives : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
