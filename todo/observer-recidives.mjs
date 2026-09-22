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
 *         [--forge <racine forge-observability>] [--sans-derive] [--relire]
 *
 * TF-1308 / D-22 (22/09/2026) — LIRE UNE DERIVE NE DOIT PAS LA DEPLACER.
 *
 * LE FAIT MESURE : le releve d ouverture du 21/09 rendait une derive bloquante — dix-sept
 * recidives de plus, neuf classes de plus. En rejouant cet outil pour en LIRE le detail, le
 * verdict est passe au vert : chaque appel pose un snapshot DE PLUS, et la derive comparait
 * desormais deux points rapproches. Le controle deplacait sa propre reference, et transformait
 * un constat vrai en vert muet — trouve en le commettant.
 *
 * LE REMEDE : `--relire` joue la derive SEULE, sur le ledger tel qu il est, et n ecrit rien.
 * C est la meme discipline que le sceau des livrables (D-32) : la forme qui ECRIT ne doit pas
 * etre a un mot de la forme qui MESURE. Tout verdict de derive NOMME desormais la commande de
 * relecture, pour que personne n ait a la deviner.
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

export function jouer({ planPath = plan, snapPath = snapshots, forgePath = forge, cwd = PILOT, sansDerive = false, relire = false } = {}) {
  if (!forgePath) return { verdict: "SANS_OBJET", exit: 2, message: `forge-observability introuvable (${candidats.join(" ; ")}) — le plan n'est pas joué, et c'est dit` };
  // RELIRE NE POSE RIEN. L observation est sautee : la derive se calcule sur le ledger tel qu il
  // est, donc deux relectures successives rendent le MEME verdict. C est la propriete qui
  // manquait, et son absence effacait la derive qu on venait de lire.
  if (relire) {
    const d0 = spawnSync(process.execPath, [join(forgePath, "scripts", "derive.mjs"), planPath, snapPath], { encoding: "utf8", cwd, timeout: 60000 });
    let j0 = null; try { j0 = JSON.parse(d0.stdout.slice(d0.stdout.indexOf("{"))); } catch { /* sortie illisible */ }
    return { verdict: j0 ? j0.verdict : "DERIVE_ILLISIBLE", exit: d0.status ?? 2, observer: null, derive: j0, relu: true, message: j0 ? undefined : (d0.stderr || d0.stdout || "").slice(0, 400) };
  }
  const obs = spawnSync(process.execPath, [join(forgePath, "scripts", "observer.mjs"), planPath, snapPath], { encoding: "utf8", cwd, timeout: 120000 });
  let o = null; try { o = JSON.parse(obs.stdout.slice(obs.stdout.indexOf("{"))); } catch { /* sortie illisible */ }
  if (obs.status !== 0 || !o || o.verdict !== "OK") return { verdict: "OBSERVER_KO", exit: 2, message: `observer.mjs exit ${obs.status} : ${(obs.stderr || obs.stdout || "").slice(0, 400)}`, observer: o };
  if (sansDerive) return { verdict: "OBSERVE", exit: 0, observer: o };
  const der = spawnSync(process.execPath, [join(forgePath, "scripts", "derive.mjs"), planPath, snapPath], { encoding: "utf8", cwd, timeout: 60000 });
  let d = null; try { d = JSON.parse(der.stdout.slice(der.stdout.indexOf("{"))); } catch { /* sortie illisible */ }
  return { verdict: d ? d.verdict : "DERIVE_ILLISIBLE", exit: der.status ?? 2, observer: o, derive: d, message: d ? undefined : (der.stderr || der.stdout || "").slice(0, 400) };
}

if (process.argv[1] && /observer-recidives\.mjs$/.test(process.argv[1])) {
  const r = jouer({ sansDerive: process.argv.includes("--sans-derive"), relire: process.argv.includes("--relire") });
  // Le seq du dernier snapshot se LIT dans le ledger (contrat append-only), jamais déduit de la sortie d'observer.
  let seq = null; try { const l = readFileSync(snapshots, "utf8").trim().split("\n").filter(Boolean); seq = l.length ? JSON.parse(l[l.length - 1]).seq : null; } catch { seq = null; }
  console.log(JSON.stringify({ outil: "observer-recidives", plan, snapshots, forge: forge || null, verdict: r.verdict, message: r.message, snapshot_seq: seq,
    relu: r.relu === true,
    // LA VOIE DE RELECTURE SE NOMME DANS LA SORTIE : personne ne doit la deviner, et c est en la
    // devinant qu on rejoue la forme qui ecrit (TF-1308).
    pour_relire: "node todo\\observer-recidives.mjs --relire — rejoue la derive SANS poser de snapshot", derive: r.derive ? { verdict: r.derive.verdict, findings: (r.derive.findings || []).map((f) => `${f.sev || "?"} · ${f.where || "?"} · ${f.regle || ""} · ${f.msg || ""}`) } : null }, null, 1));
  process.exit(r.exit);
}
