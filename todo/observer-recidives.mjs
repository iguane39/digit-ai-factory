#!/usr/bin/env node
/**
 * observer-recidives.mjs — joue le plan de surveillance des récidives (TF-0790) avec les scripts de
 * forge-observability, DEPUIS le pilot : un snapshot de plus au ledger, puis la dérive depuis le
 * relevé précédent. Rien n'est écrit chez la forge (dépôt frère = donnée) ; elle est RÉSOLUE
 * comme le lanceur des hooks (`$FORGE_ROOT`, sinon le parent du pilot).
 *
 * Ce qu'il rend : le JSON de derive.mjs sur stdout, exit 0 (PASS), 1 (FAIL — une dérive), 2
 * (données insuffisantes : premier passage, un seul snapshot — ce n'est pas un défaut, c'est
 * l'état d'un compteur qui vient de naître ; le second passage dira la dérive).
 *
 * POURQUOI un lanceur et pas une consigne (N-1, TF-0790) : « la cadence est documentaire en v0,
 * la récurrence vient de qui invoque » — sans invocateur, le plan est une intention. L'invocateur
 * est le hook d'ouverture du pilot (au plus une fois par semaine), et ce script, à la demande.
 *
 * Usage : node todo\observer-recidives.mjs [--plan <plan.json>] [--snapshots <ledger.jsonl>]
 *         [--forge <racine forge-observability>] [--sans-derive]
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(ICI, "..");
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const plan = resolve(arg("--plan", join(ICI, "observabilite", "plan-recidives.json")));
const snapshots = resolve(arg("--snapshots", join(ICI, "observabilite", "snapshots-recidives.jsonl")));
const candidats = [arg("--forge", null), process.env.FORGE_ROOT && join(process.env.FORGE_ROOT, "digit-ai-forge-observability"), join(dirname(PILOT), "digit-ai-forge-observability")].filter(Boolean);
const forge = candidats.find((c) => existsSync(join(c, "scripts", "observer.mjs")) && existsSync(join(c, "scripts", "derive.mjs")));

export function jouer({ planPath = plan, snapPath = snapshots, forgePath = forge, cwd = PILOT, sansDerive = false } = {}) {
  if (!forgePath) return { verdict: "SANS_OBJET", exit: 2, message: `forge-observability introuvable (${candidats.join(" ; ")}) — le plan n'est pas joué, et c'est dit` };
  const obs = spawnSync(process.execPath, [join(forgePath, "scripts", "observer.mjs"), planPath, snapPath], { encoding: "utf8", cwd, timeout: 120000 });
  let o = null; try { o = JSON.parse(obs.stdout.slice(obs.stdout.indexOf("{"))); } catch { /* sortie illisible */ }
  if (obs.status !== 0 || !o || o.verdict !== "OK") return { verdict: "OBSERVER_KO", exit: 2, message: `observer.mjs exit ${obs.status} : ${(obs.stderr || obs.stdout || "").slice(0, 400)}`, observer: o };
  if (sansDerive) return { verdict: "OBSERVE", exit: 0, observer: o };
  const der = spawnSync(process.execPath, [join(forgePath, "scripts", "derive.mjs"), planPath, snapPath], { encoding: "utf8", cwd, timeout: 60000 });
  let d = null; try { d = JSON.parse(der.stdout.slice(der.stdout.indexOf("{"))); } catch { /* sortie illisible */ }
  return { verdict: d ? d.verdict : "DERIVE_ILLISIBLE", exit: der.status ?? 2, observer: o, derive: d, message: d ? undefined : (der.stderr || der.stdout || "").slice(0, 400) };
}

if (process.argv[1] && /observer-recidives\.mjs$/.test(process.argv[1])) {
  const r = jouer({ sansDerive: process.argv.includes("--sans-derive") });
  // Le seq du dernier snapshot se LIT dans le ledger (contrat append-only), jamais déduit de la sortie d'observer.
  let seq = null; try { const l = readFileSync(snapshots, "utf8").trim().split("\n").filter(Boolean); seq = l.length ? JSON.parse(l[l.length - 1]).seq : null; } catch { seq = null; }
  console.log(JSON.stringify({ outil: "observer-recidives", plan, snapshots, forge: forge || null, verdict: r.verdict, message: r.message, snapshot_seq: seq, derive: r.derive ? { verdict: r.derive.verdict, findings: (r.derive.findings || []).map((f) => `${f.sev || "?"} · ${f.where || "?"} · ${f.regle || ""} · ${f.msg || ""}`) } : null }, null, 1));
  process.exit(r.exit);
}
