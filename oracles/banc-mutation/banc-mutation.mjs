#!/usr/bin/env node
/**
 * banc-mutation.mjs — LE TAUX DE DÉTECTION DE CHAQUE ORACLE, MESURÉ PAR MUTATION (TF-1551, étape 1 de l'étude
 * `output\03-etudes\20261001-etude-opportunite-rsi-et-ssl.md`, décision R-58 du 01/10/2026).
 *
 * CE QUE LE BANC FAIT. Pour chaque oracle du manifeste : (1) il joue l'oracle sur son livrable VERT et exige un
 * PASS — un banc dont le vert n'est pas vert ne mesure rien ; (2) il applique à ce livrable chaque mutation que
 * le manifeste déclare PERTINENTE pour cet oracle (`mutations.mjs`) ; (3) il rejoue l'oracle sur le mutant.
 * Un FAIL est une DÉTECTION, un PASS est un SURVIVANT. Le taux de détection d'un oracle est
 * détectés ÷ mutations pertinentes appliquées. Aucun appel de modèle : deux passages donnent le même résultat.
 *
 * CE QU'IL NE FAIT PAS. Il ne dit pas si un survivant est un angle mort du juge ou une mutation hors du
 * périmètre qu'il déclare : le survivant est LISTÉ avec les règles que l'oracle a jouées, et un humain ou une
 * session le lit. Il ne modifie jamais un oracle (garde-fou P-D de l'étude : la session qui propose ne touche pas
 * au juge qui la note) ; l'empreinte de chaque script d'oracle est relevée avant et après le passage, et un
 * écart fait échouer le banc. Il ne mesure pas les oracles qui jugent un DOSSIER (conformité d'un produit) : le
 * manifeste le déclare dans `hors_banc`.
 *
 * LE CRITÈRE D'ARRÊT DE L'ÉTUDE : moins de 5 mutations pertinentes APPLIQUÉES pour un oracle, signe que son
 * catalogue ne vaut rien — le banc sort alors en échec. Aucun seuil de taux n'est fixé par l'étude : le taux se
 * publie, il ne conditionne pas le verdict (`--seuil <0..1>` le fait, à la demande).
 *
 * Usage : node banc-mutation.mjs [--manifeste <json>] [--sortie <dossier>] [--seuil <0..1>] [--json]
 * Exit  : 0 = banc tenu · 1 = vert invalide, critère d'arrêt, seuil non tenu ou oracle modifié · 2 = usage.
 */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { resoudre } from "./mutations.mjs";
import { empreinteFichier } from "../../scripts/lib-empreinte.mjs";

export const VERSION = "1.0.0";
export const MIN_MUTATIONS_PERTINENTES = 5;
const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(join(ICI, "..", ".."));

/** Lit le verdict d'un oracle, JSON ou texte : { verdict: "PASS"|"FAIL"|"AUTRE", regles } — jamais un échec muet. */
export function lireVerdict(code, stdout) {
  const sortie = String(stdout || "");
  const f = new Set();
  try {
    const j = JSON.parse(sortie);
    const v = String(j.verdict || "").toUpperCase();
    for (const x of j.findings || j.constats || []) if (x.statut === "FAIL" || x.sev === "bloquant") f.add(String(x.regle || x.id || "?"));
    if (v === "PASS" || v === "FAIL") return { verdict: v, regles: [...f] };
    return { verdict: "AUTRE", regles: [...f], brut: v || "sans verdict" };
  } catch { /* pas du JSON : sortie texte */ }
  for (const m of sortie.matchAll(/\[FAIL\]\s+([A-Za-z0-9_.-]+)/g)) f.add(m[1]);
  const m = /verdict\s*:?\s*(PASS|FAIL)\b/i.exec(sortie);
  if (m) return { verdict: m[1].toUpperCase(), regles: [...f] };
  if (code === 0) return { verdict: "PASS", regles: [] };
  if (code === 1) return { verdict: "FAIL", regles: [...f] };
  return { verdict: "AUTRE", regles: [...f], brut: `exit ${code}` };
}

/** Joue un oracle sur un fichier. `executer` est injectable (recette) : (script, args, env) → { status, stdout }. */
export function jouer(entree, fichier, racine, executer = executerReel) {
  const args = entree.args.map((a) => a.replaceAll("{FICHIER}", fichier).replaceAll("{DOSSIER}", dirname(fichier)).replaceAll("{VERT_DOSSIER}", dirname(resolve(racine, entree.vert))));
  const r = executer(resolve(racine, entree.script), args, { ...process.env, FORGE_ROOT: process.env.FORGE_ROOT || dirname(racine) });
  return { code: r.status, ...lireVerdict(r.status, r.stdout) };
}
function executerReel(script, args, env) {
  const r = spawnSync(process.execPath, [script, ...args], { encoding: "utf8", env, timeout: 120000, maxBuffer: 64 * 1024 * 1024 });
  return { status: r.status, stdout: r.stdout };
}

export const empreinte = (chemin) => empreinteFichier(chemin);

/** Mesure un oracle : { vert_ok, appliquees, detectes, survivants[], non_jugees[], taux, arret }. */
export function mesurerOracle(entree, racine, executer = executerReel) {
  const vert = resolve(racine, entree.vert);
  const dossier = mkdtempSync(join(tmpdir(), "banc-mutation-"));
  try {
    const sortie = { id: entree.id, script: entree.script, vert: entree.vert, sollicitation: entree.sollicitation || null,
      vert_ok: false, pertinentes: entree.pertinentes, appliquees: 0, non_applicables: [], detectes: [], survivants: [], non_jugees: [], taux: null, arret: false };
    const rv = jouer(entree, vert, racine, executer);
    sortie.verdict_vert = rv.verdict;
    sortie.vert_ok = rv.verdict === "PASS";
    if (!sortie.vert_ok) return sortie;
    // Le TÉMOIN COPIÉ : le vert, recopié tel quel sous le nom et l'emplacement des mutants. Si l'oracle le refuse, il
    // juge l'EMPLACEMENT (lots voisins, dossier de dépôt) et non le texte : toute « détection » serait un faux signal.
    const texte = readFileSync(vert, "utf8").replace(/\r\n/g, "\n");
    const temoin = join(dossier, "temoin", basename(vert));
    mkdirSync(dirname(temoin), { recursive: true });
    writeFileSync(temoin, texte, "utf8");
    const rt = jouer(entree, temoin, racine, executer);
    sortie.verdict_temoin = rt.verdict;
    if (rt.verdict !== "PASS") { sortie.vert_ok = false; sortie.motif_vert = `le témoin recopié sous un autre emplacement est refusé (${rt.verdict}) : l'oracle juge l'emplacement, pas le texte`; return sortie; }
    for (const id of entree.pertinentes) {
      const m = resoudre(id);
      if (!m) { sortie.non_jugees.push({ mutation: id, motif: "mutation inconnue du catalogue" }); continue; }
      const mute = m.appliquer(texte);
      if (mute === null || mute === undefined || mute === texte) { sortie.non_applicables.push(id); continue; }
      const f = join(dossier, "m" + entree.pertinentes.indexOf(id), basename(vert)); // même nom que le vert : certains oracles lisent la date ou l'objet du nom
      mkdirSync(dirname(f), { recursive: true });
      writeFileSync(f, mute, "utf8");
      const r = jouer(entree, f, racine, executer);
      if (r.verdict === "FAIL") { sortie.appliquees++; sortie.detectes.push({ mutation: id, regles: r.regles }); }
      else if (r.verdict === "PASS") { sortie.appliquees++; sortie.survivants.push({ mutation: id, libelle: m.libelle }); }
      else sortie.non_jugees.push({ mutation: id, motif: r.brut || "verdict illisible" });
    }
    sortie.taux = sortie.appliquees ? sortie.detectes.length / sortie.appliquees : null;
    sortie.arret = sortie.appliquees < MIN_MUTATIONS_PERTINENTES;
    return sortie;
  } finally { rmSync(dossier, { recursive: true, force: true }); }
}

/** Mesure tout le manifeste. L'empreinte de chaque script est relevée avant et après : un oracle ne se touche pas. */
export function mesurer(manifeste, racine = PILOT, executer = executerReel, { seuil = null } = {}) {
  const avant = new Map(manifeste.oracles.map((o) => [o.script, empreinte(resolve(racine, o.script))]));
  const resultats = manifeste.oracles.map((o) => mesurerOracle(o, racine, executer));
  const modifies = manifeste.oracles.filter((o) => empreinte(resolve(racine, o.script)) !== avant.get(o.script)).map((o) => o.script);
  const defauts = [];
  for (const r of resultats) {
    if (!r.vert_ok) defauts.push(`${r.id} : ${r.motif_vert || `le livrable vert ne passe pas (${r.verdict_vert})`} — rien n'est mesuré`);
    else if (r.arret) defauts.push(`${r.id} : ${r.appliquees} mutation(s) pertinente(s) appliquée(s), moins de ${MIN_MUTATIONS_PERTINENTES} — critère d'arrêt de l'étude`);
    else if (seuil !== null && r.taux < seuil) defauts.push(`${r.id} : taux ${(r.taux * 100).toFixed(0)} % sous le seuil ${(seuil * 100).toFixed(0)} %`);
  }
  for (const s of modifies) defauts.push(`${s} : le script d'un oracle a changé pendant le banc — le banc ne touche jamais le juge`);
  const jouees = resultats.reduce((n, r) => n + r.appliquees, 0);
  const detectees = resultats.reduce((n, r) => n + r.detectes.length, 0);
  return {
    version: VERSION, date: new Date().toISOString().slice(0, 10), oracles: resultats,
    total: { mutations: jouees, detectees, survivants: jouees - detectees, taux: jouees ? detectees / jouees : null },
    hors_banc: manifeste.hors_banc || [], defauts, verdict: defauts.length ? "FAIL" : "PASS",
  };
}

export function tableauMarkdown(res) {
  const pct = (x) => (x === null ? "—" : `${Math.round(x * 100)} %`);
  const l = ["| Oracle | Mutations pertinentes jouées | Détectées | Survivants | Taux de détection |", "|---|---|---|---|---|"];
  for (const r of res.oracles) l.push(`| \`${r.id}\` | ${r.vert_ok ? r.appliquees : "vert invalide"} | ${r.detectes.length} | ${r.survivants.length} | ${pct(r.taux)} |`);
  l.push(`| **Total** | ${res.total.mutations} | ${res.total.detectees} | ${res.total.survivants} | ${pct(res.total.taux)} |`);
  const s = res.oracles.filter((r) => r.survivants.length);
  if (s.length) {
    l.push("", "Survivants (mutation jouée, oracle resté au PASS) :", "");
    for (const r of s) for (const x of r.survivants) l.push(`- \`${r.id}\` — ${x.mutation} : ${x.libelle}`);
  }
  return l.join("\n");
}

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const val = (o) => { const i = args.indexOf(o); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null; };
  const chemin = val("--manifeste") || join(ICI, "manifeste-mutation.json");
  if (!existsSync(chemin)) { console.error(`manifeste introuvable : ${chemin}`); process.exit(2); }
  const seuil = val("--seuil") !== null ? Number(val("--seuil")) : null;
  const res = mesurer(JSON.parse(readFileSync(chemin, "utf8")), PILOT, executerReel, { seuil });
  const sortie = val("--sortie");
  if (sortie) {
    mkdirSync(sortie, { recursive: true });
    writeFileSync(join(sortie, "resultat-mutation.json"), JSON.stringify(res, null, 1) + "\n", "utf8");
    writeFileSync(join(sortie, "resultat-mutation.md"), tableauMarkdown(res) + "\n", "utf8");
  }
  if (args.includes("--json")) console.log(JSON.stringify(res, null, 1));
  else {
    console.log(tableauMarkdown(res));
    for (const d of res.defauts) console.log(`  [DÉFAUT] ${d}`);
    console.log(`\nbanc de mutation ${VERSION} : ${res.verdict} — ${res.total.mutations} mutation(s) jouée(s) sur ${res.oracles.length} oracle(s), ${res.total.detectees} détectée(s)`);
  }
  process.exit(res.verdict === "FAIL" ? 1 : 0);
}
