#!/usr/bin/env node
/**
 * mesurer-reaffichage.test.mjs — la période de mesure du contrôle RÉAFFICHAGE, dans les deux sens (TF-2690, 22/11/2026).
 * Rouge : trop peu de jours, trop peu de tours, une décision réclamée 3 fois dans une même session. Vert : le critère tenu rend PRÊTE,
 * et ne bascule rien (la décision reste à l'humain). La CLI est jouée sur un journal d'essai ; le journal du poste n'est jamais lu.
 */
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mesurer } from "./mesurer-reaffichage.mjs";
import { MESURE_REAFFICHAGE } from "../oracles/hook-restitution.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (cond, msg) => { if (!cond) throw new Error(msg); };
const ligne = (jour, session, verdict = "PASS", manquantes = [], extra = {}) => ({ ts: `${jour}T10:00:00.000Z`, hook: "restitution", session,
  reaffichage: { verdict, ouvertes: manquantes, manquantes }, prejuge: false, ...extra });
/** n tours répartis sur des sessions distinctes, tous en PASS sauf indication. */
const tours = (n, jour = "2026-11-17") => Array.from({ length: n }, (_, i) => ligne(jour, `s-${i}`));

console.log("mesurer-reaffichage — période de mesure et critère de bascule (TF-2690)\n");

check("la mesure déclare son critère : 14 jours, 20 tours, 2 réclamations au plus par décision et par session (le critère vit au hook, une seule fois)", () => {
  att(MESURE_REAFFICHAGE.jours === 14 && MESURE_REAFFICHAGE.tours_min === 20 && MESURE_REAFFICHAGE.repetitions_max === 2 && MESURE_REAFFICHAGE.depuis === "2026-11-16", JSON.stringify(MESURE_REAFFICHAGE));
});
check("rouge — trop peu de jours : EN_COURS, et le message dit combien de jours manquent", () => {
  const r = mesurer(tours(25), { aujourdhui: "2026-11-22" });
  att(r.verdict === "EN_COURS" && /8 jour\(s\)/.test(r.message) && r.jours_ecoules === 6, JSON.stringify(r));
});
check("rouge — trop peu de tours : EN_COURS, et le message dit combien de tours manquent", () => {
  const r = mesurer(tours(5), { aujourdhui: "2026-12-05" });
  att(r.verdict === "EN_COURS" && /15 tour\(s\)/.test(r.message) && r.tours_applicables === 5, JSON.stringify(r));
});
check("rouge — une décision réclamée 3 fois dans une même session (le cas D-83) : REFUSEE, la répétition est nommée", () => {
  const e = [...tours(25), ...[1, 2, 3].map(() => ligne("2026-11-18", "s-83", "FAIL", ["83"]))];
  const r = mesurer(e, { aujourdhui: "2026-12-05" });
  att(r.verdict === "REFUSEE" && r.repetitions.length === 1 && r.repetitions[0].decision === "D-83" && r.repetitions[0].fois === 3, JSON.stringify(r));
});
check("vert — le critère tenu : PRETE, et le message dit que la bascule est une décision de l'humain", () => {
  const e = [...tours(25), ligne("2026-11-18", "s-1", "FAIL", ["7"]), ligne("2026-11-19", "s-1", "FAIL", ["7"])];   // 2 réclamations : à la limite, tenu
  const r = mesurer(e, { aujourdhui: "2026-12-05" });
  att(r.verdict === "PRETE" && /décision de l'humain/.test(r.message) && r.tours_en_avertissement === 2, JSON.stringify(r));
});
check("bornes — un tour d'avant le début, un tour sans contrôle, un journal de recette (prejuge) et un autre hook ne comptent pas", () => {
  const e = [ligne("2026-11-10", "avant"), { ts: "2026-11-18T10:00:00.000Z", hook: "restitution", session: "x" }, ligne("2026-11-18", "pj", "PASS", [], { prejuge: true }),
    { ts: "2026-11-18T10:00:00.000Z", hook: "ouverture", session: "y", reaffichage: { verdict: "PASS" } }, ligne("2026-11-18", "ok")];
  const r = mesurer(e, { aujourdhui: "2026-12-05" });
  att(r.tours_applicables === 1, `${r.tours_applicables} tour(s) comptés au lieu de 1`);
});
check("CLI — sur un journal d'essai : rend le verdict en clair, exit 0 ; un journal absent : exit 2", () => {
  const d = mkdtempSync(join(tmpdir(), "mes-reaff-"));
  try {
    const f = join(d, "journal.jsonl");
    writeFileSync(f, [...tours(25), "{ pas du json"].map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join("\n") + "\n", "utf8");
    const script = join(dirname(fileURLToPath(import.meta.url)), "mesurer-reaffichage.mjs");
    const r = spawnSync(process.execPath, [script, "--journal", f, "--aujourd-hui", "2026-12-05"], { encoding: "utf8" });
    att(r.status === 0 && /PRETE/.test(r.stdout) && /1 illisible/.test(r.stdout), `exit ${r.status} ${r.stdout}${r.stderr}`);
    const absent = spawnSync(process.execPath, [script, "--journal", join(d, "absent.jsonl")], { encoding: "utf8" });
    att(absent.status === 2 && /introuvable/.test(absent.stderr), `exit ${absent.status} ${absent.stderr}`);
  } finally { rmSync(d, { recursive: true, force: true }); }
});

console.log(`\nmesurer-reaffichage (TF-2690) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
