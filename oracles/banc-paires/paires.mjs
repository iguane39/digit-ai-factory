#!/usr/bin/env node
/**
 * paires.mjs — LE BANC DES PAIRES « FAUTIF, CORRIGÉ » TIRÉES DE L'HISTOIRE GIT (TF-1551, étape 1 de l'étude
 * `output\03-etudes\20261001-etude-opportunite-rsi-et-ssl.md`, gisement « historique git du pilot et des forges »).
 *
 * L'ÉTIQUETTE EST DANS LE MESSAGE DE COMMIT. Quand une session corrige un livrable qu'un oracle refusait, elle écrit
 * souvent « oracle-x FAIL -> PASS » dans son message. Le fichier tel qu'il était au parent du commit est le FAUTIF, le
 * fichier tel que le commit le pose est le CORRIGÉ. Personne n'annote : l'auteur du commit a étiqueté, et le juge de
 * l'époque confirme l'étiquette avant qu'elle entre au corpus.
 *
 * LA RÈGLE D'EXTRACTION, ÉCRITE (`regle` ci-dessous, rejouée par la recette) :
 *   P1  le message du commit, découpé en propositions (`;`, fin de phrase, fin de ligne), en a une qui nomme un oracle
 *       (`oracle-<nom>`) ET un sens rouge → vert : « FAIL -> PASS », « FAIL a PASS », « FAIL devient PASS », « FAIL
 *       avant … PASS apres », « PASS (il etait FAIL) », « rouge vers vert » — un motif entre parenthèses ou un compte
 *       peut séparer FAIL de la flèche. Un compte de cas de recette (« 20/20 -> 21/21 ») sans FAIL n'en est pas un.
 *   P2  l'oracle nommé existe comme script (`oracle-<nom>.mjs` ou `.py`) dans l'arbre du commit, au même dépôt.
 *   P3  le livrable est un fichier MODIFIÉ par le commit (statut M face au premier parent), autre que le script de
 *       l'oracle et sa recette.
 *   P4  le juge DE L'ÉPOQUE (le script de l'oracle tel que l'arbre du commit le porte, joué dans cet arbre) refuse le
 *       fautif et accepte le corrigé, tous deux recopiés hors de l'arbre sous leur nom de fichier. Sinon la paire est
 *       gardée au corpus avec son motif, mais non confirmée, et n'entre pas au taux. P4 écarte d'elle-même les
 *       oracles qui jugent un dossier ou le dépôt : le fichier passé en argument n'y change rien, fautif et corrigé
 *       reçoivent le même verdict.
 *
 * DEUX VERBES.
 *   --extraire  lit l'histoire des dépôts (pilot et forges sous `FORGE_ROOT`), applique P1 à P4 et écrit, HORS DU
 *               DÉPÔT, le corpus : un enregistrement par paire et les deux fichiers. Un livrable et un message de
 *               commit peuvent porter un nom de client : le corpus vit dans le canal confidentiel
 *               (`<racine>\_confidentiel\bancs\paires\`), jamais sous git.
 *   --rejouer   rejoue chaque paire confirmée devant le juge D'AUJOURD'HUI (le même oracle, au HEAD de son dépôt) et
 *               publie des COMPTES par oracle : fautif toujours refusé (détection tenue), corrigé toujours accepté,
 *               paire tenue (les deux). Aucun texte, aucun chemin de livrable.
 *
 * CE QUE LE BANC DIT, ET CE QU'IL NE DIT PAS. Un fautif accepté aujourd'hui est soit une règle assouplie depuis (légitime
 * si l'humain l'a décidé), soit une détection perdue (un défaut de juge) ; un corrigé refusé aujourd'hui est le plus
 * souvent une règle née depuis. Le banc LISTE les paires concernées, il ne tranche pas. Lecture seule sur les dépôts :
 * l'arbre d'un commit est extrait par `git archive` dans un dossier temporaire, aucun worktree n'est créé ailleurs.
 *
 * Usage : node paires.mjs --extraire [--depots <dossier>...] [--sortie <dossier>]
 *         node paires.mjs --rejouer [--corpus <dossier>] [--json]
 * Exit  : 0 = banc joué · 1 = aucune paire confirmée · 2 = usage.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { lireVerdict } from "../banc-mutation/banc-mutation.mjs";

export const VERSION = "1.0.0";
const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(join(ICI, "..", ".."));

// ---- P1 : la règle sur le message ----
const ORACLE = /\boracle-[a-z0-9]+(?:-[a-z0-9]+)*/gi;
/** Les formes du sens rouge → vert. Chacune est nommée : le corpus dit laquelle a mordu. */
export const SENS = [
  ["fleche", /\bFAIL\b(?:\s*\([^)]{0,80}\))?(?:\s+[\d/]+)?(?:\s+(?:sur|en|pour)\s[^;.]{0,40}?)?\s*(?:->|→|=>|\ba\b|\bà\b|\bdevient\b|\bpuis\b|\bvers\b)\s*(?:(?:un\s+)?verdict\s+)?PASS\b/i],
  ["avant-apres", /\bFAIL\b[^;.]{0,60}?\bavant\b[^;.]{0,60}?\bPASS\b[^;.]{0,20}?\bapr[eè]s\b/i],
  ["etait", /\bPASS\b\s*\((?:il\s+|elle\s+)?[eé]tait\s+FAIL\b/i],
  ["couleur", /\brouge\s*(?:->|→|=>|\ba\b|\bà\b|\bvers\b|\bpuis\b)\s*vert\b/i],
];
/**
 * Découpe un message en propositions : `;`, fin de phrase (point suivi d'un espace), ligne vide, puce. Un message de
 * commit est replié à 72 colonnes : une fin de ligne simple n'est PAS une fin de proposition (mesuré le 13/10/2026,
 * « oracle-empreintes … : FAIL (E2 …) -> PASS » coupé en deux lignes par le repli).
 */
export const propositions = (message) => String(message || "").replace(/\r\n/g, "\n")
  .split(/\n\s*\n|\n(?=\s*[-*•]\s)/).map((b) => b.replace(/\s*\n\s*/g, " "))
  .flatMap((b) => b.split(/;|\.\s+/)).map((s) => s.trim()).filter(Boolean);

/**
 * P1 sur un message : [{ oracle, forme, proposition }]. Pour chaque marque de sens rouge → vert, l'oracle retenu est le
 * plus proche AVANT la marque dans la même proposition (« oracle-x FAIL -> PASS, oracle-y PASS » ne retient que x), ou à
 * défaut celui qui est DANS la marque ou qui la suit introduit par « sous », « par » ou une parenthèse (« FAIL devient
 * PASS sous oracle-z ») — jamais un oracle cité plus loin pour son propre verdict (« Boite FAIL -> PASS, oracle-todo PASS »).
 */
export function regle(message) {
  const sortie = [];
  const vus = new Set();
  for (const p of propositions(message)) {
    const oracles = [...p.matchAll(ORACLE)].map((m) => ({ nom: m[0].toLowerCase(), i: m.index }));
    if (!oracles.length) continue;
    for (const [forme, re] of SENS) {
      for (const m of p.matchAll(new RegExp(re.source, "gi"))) {
        const fin = m.index + m[0].length;
        const avant = oracles.filter((o) => o.i < m.index).pop();
        const o = avant || oracles.find((x) => x.i >= m.index && (x.i < fin || /^\s*(?:sous|par|\()\s*`?$/.test(p.slice(fin, x.i))));
        if (!o || vus.has(o.nom)) continue;
        vus.add(o.nom);
        sortie.push({ oracle: o.nom, forme, proposition: p });
      }
    }
  }
  return sortie;
}

// ---- accès git, en lecture seule ----
const git = (depot, args, enc = "utf8") => {
  // `core.quotepath=false` : sinon un chemin accentué sort entre guillemets et en octal, et `git show` ne le retrouve pas.
  const r = spawnSync("git", ["-c", "core.quotepath=false", "-C", depot, ...args], { encoding: enc, maxBuffer: 1 << 28 });
  return r.status === 0 ? r.stdout : null;
};
export function commitsDe(depot) {
  const log = git(depot, ["log", "--no-merges", "--format=%H%x1f%P%x1f%B%x1e"]) || "";
  return log.split("\x1e").map((c) => c.replace(/^\s+/, "")).filter(Boolean).map((c) => { const [sha, parents, message] = c.split("\x1f"); return { sha, parent: (parents || "").split(" ")[0] || null, message: message || "" }; });
}
/** P2 : le chemin du script de l'oracle dans un arbre (liste de chemins), `oracles/` d'abord. */
export function trouverScript(chemins, oracle) {
  const c = chemins.filter((p) => new RegExp(`(^|/)${oracle.replace(/[-]/g, "\\-")}\\.(mjs|py)$`).test(p));
  return c.sort((a, b) => (a.startsWith("oracles/") ? 0 : 1) - (b.startsWith("oracles/") ? 0 : 1) || a.length - b.length)[0] || null;
}
/** P3 : les fichiers modifiés par le commit face au premier parent, hors script de l'oracle et sa recette. */
export function livrablesDe(lignesNameStatus, script) {
  const recette = script ? script.replace(/\.(mjs|py)$/, ".test.mjs") : null;
  return lignesNameStatus.split("\n").map((l) => l.split("\t")).filter(([s, p]) => s === "M" && p && p !== script && p !== recette).map(([, p]) => p);
}

// ---- jouer un oracle sur un fichier ----
function executer(script, fichier, cwd, env) {
  const py = extname(script) === ".py";
  const r = spawnSync(py ? "python" : process.execPath, [script, fichier], { cwd, encoding: "utf8", env: { ...env, PYTHONUTF8: "1" }, timeout: 120000, maxBuffer: 64 * 1024 * 1024 });
  return { status: r.status, stdout: r.stdout };
}
/** Juge un texte : recopié sous son nom de fichier dans un dossier temporaire neuf, puis joué. */
export function jugerTexte(juge, contenu, nom) {
  const d = mkdtempSync(join(tmpdir(), "paire-"));
  try {
    const f = join(d, nom);
    writeFileSync(f, contenu);
    return juge(f);
  } finally { rmSync(d, { recursive: true, force: true }); }
}
const jugeScript = (script, cwd, executeur = executer) => (fichier) => {
  const r = executeur(script, fichier, cwd, { ...process.env, FORGE_ROOT: process.env.FORGE_ROOT || dirname(PILOT) });
  return lireVerdict(r.status, r.stdout).verdict;
};

/** Extrait l'arbre d'un commit (sans input/, output/, old/) dans un dossier temporaire. */
function arbreDe(depot, sha) {
  const d = mkdtempSync(join(tmpdir(), "paire-arbre-"));
  const tar = join(d, "a.tar");
  const r = spawnSync("git", ["-C", depot, "archive", "-o", tar, sha, "--", ".", ":(exclude)input", ":(exclude)output", ":(exclude)old"], { encoding: "utf8" });
  if (r.status !== 0) { rmSync(d, { recursive: true, force: true }); return null; }
  const x = join(d, "t");
  mkdirSync(x);
  // Chemin RELATIF à dessein : le tar GNU livré avec Git pour Windows lit « C:\… » comme « hôte:chemin » (mesuré le
  // 13/10/2026, 211 extractions refusées) ; le tar de Windows et celui de Git acceptent tous deux « ..\a.tar ».
  const t = spawnSync("tar", ["-xf", join("..", "a.tar")], { cwd: x, encoding: "utf8" });
  rmSync(tar, { force: true });
  if (t.status !== 0) { rmSync(d, { recursive: true, force: true }); return null; }
  return { racine: x, nettoyer: () => rmSync(d, { recursive: true, force: true }) };
}

/**
 * Extrait les paires d'UN dépôt. `options.executeur` est injectable (recette). Rend { candidats, paires[] } ; chaque
 * paire porte ses deux contenus en `avant`/`apres` (Buffer), retirés à l'écriture du corpus.
 */
export function extraireDepot(depot, options = {}) {
  const nomDepot = basename(resolve(depot));
  const paires = [];
  let candidats = 0;
  for (const c of commitsDe(depot)) {
    const hits = regle(c.message);
    if (!hits.length || !c.parent) continue;
    candidats++;
    const chemins = (git(depot, ["ls-tree", "-r", "--name-only", c.sha]) || "").split("\n").filter(Boolean);
    const ns = git(depot, ["diff-tree", "--no-commit-id", "-r", "--name-status", c.parent, c.sha]) || "";
    let arbre = null;
    try {
      for (const h of hits) {
        const base = { depot: nomDepot, commit: c.sha, oracle: h.oracle, forme: h.forme, proposition: h.proposition };
        const script = trouverScript(chemins, h.oracle);
        if (!script) { paires.push({ ...base, id: `${nomDepot}@${c.sha.slice(0, 8)}:${h.oracle}`, confirmee: false, motif: "P2 : oracle absent de l'arbre du commit" }); continue; }
        const livrables = livrablesDe(ns, script);
        if (!livrables.length) { paires.push({ ...base, script, id: `${nomDepot}@${c.sha.slice(0, 8)}:${h.oracle}`, confirmee: false, motif: "P3 : aucun fichier modifié hors l'oracle" }); continue; }
        if (!arbre) arbre = arbreDe(depot, c.sha);
        for (const liv of livrables) {
          const id = `${nomDepot}@${c.sha.slice(0, 8)}:${h.oracle}:${livrables.indexOf(liv)}`;
          const avant = git(depot, ["show", `${c.parent}:${liv}`], "buffer");
          const apres = git(depot, ["show", `${c.sha}:${liv}`], "buffer");
          const p = { ...base, id, script, livrable: liv, avant, apres, confirmee: false };
          if (!avant || !apres) { p.motif = "P3 : contenu du fichier illisible au parent ou au commit"; delete p.avant; delete p.apres; paires.push(p); continue; }
          if (!arbre) { p.motif = "P4 : arbre du commit non extractible"; paires.push(p); continue; }
          const juge = jugeScript(join(arbre.racine, script), arbre.racine, options.executeur);
          p.epoque = { avant: jugerTexte(juge, avant, basename(liv)), apres: jugerTexte(juge, apres, basename(liv)) };
          p.confirmee = p.epoque.avant === "FAIL" && p.epoque.apres === "PASS";
          if (!p.confirmee) p.motif = `P4 : le juge de l'époque rend ${p.epoque.avant} sur le fautif et ${p.epoque.apres} sur le corrigé`;
          paires.push(p);
        }
      }
    } finally { if (arbre) arbre.nettoyer(); }
  }
  return { depot: nomDepot, candidats, paires };
}

/** Les dépôts par défaut : le pilot et les forges `digit-ai-forge-*` sous la racine. */
export function depotsParDefaut(env = process.env) {
  const racine = env.FORGE_ROOT || dirname(PILOT);
  const d = [];
  if (existsSync(join(racine, "digit-ai-factory", ".git"))) d.push(join(racine, "digit-ai-factory"));
  for (const n of (existsSync(racine) ? readdirSync(racine) : []).sort()) if (n.startsWith("digit-ai-forge-") && existsSync(join(racine, n, ".git"))) d.push(join(racine, n));
  return d;
}

export const cheminCorpusParDefaut = (env = process.env) =>
  join(env.FORGE_CONFIDENTIEL || join(env.FORGE_ROOT || join(PILOT, ".."), "_confidentiel"), "bancs", "paires");

/** Écrit le corpus : `corpus.jsonl` (sans les contenus) et, par paire, `fichiers/<n>/avant|apres/<nom>`. */
export function ecrireCorpus(paires, sortie) {
  mkdirSync(sortie, { recursive: true });
  rmSync(join(sortie, "fichiers"), { recursive: true, force: true });
  const lignes = paires.map((p, n) => {
    const { avant, apres, ...reste } = p;
    if (avant && apres) {
      for (const [k, v] of [["avant", avant], ["apres", apres]]) { const d = join(sortie, "fichiers", String(n), k); mkdirSync(d, { recursive: true }); writeFileSync(join(d, basename(p.livrable)), v); }
      reste.fichiers = join("fichiers", String(n));
    }
    return JSON.stringify(reste);
  });
  writeFileSync(join(sortie, "corpus.jsonl"), lignes.join("\n") + (lignes.length ? "\n" : ""), "utf8");
}

/** Le script d'aujourd'hui pour un oracle d'un dépôt : même chemin au HEAD, sinon le même nom ailleurs. */
export function scriptDAujourdhui(paire, env = process.env) {
  const racine = paire.depot === "digit-ai-factory" ? PILOT : join(env.FORGE_ROOT || dirname(PILOT), paire.depot);
  if (existsSync(join(racine, paire.script))) return { racine, script: join(racine, paire.script) };
  const chemins = (git(racine, ["ls-files"]) || "").split("\n").filter(Boolean);
  const s = trouverScript(chemins, paire.oracle);
  return s ? { racine, script: join(racine, s) } : null;
}

/**
 * Rejoue le corpus : `juge(paire, "avant"|"apres") → "PASS"|"FAIL"|"AUTRE"|null` (null = oracle retiré). Ne publie que
 * des comptes et des identifiants de paire (dépôt@commit:oracle:n), jamais un texte ni un chemin de livrable.
 */
export function rejouer(corpus, juge) {
  const par = {};
  const res = { version: VERSION, paires: corpus.length, confirmees: 0, non_confirmees: 0, motifs_non_confirmees: {}, oracle_retire: 0,
    tenues: 0, detections_tenues: 0, corriges_acceptes: 0, non_juges: 0, par_oracle: par, detections_perdues_ids: [], corriges_refuses_ids: [] };
  for (const p of corpus) {
    if (!p.confirmee) { res.non_confirmees++; const m = String(p.motif || "?").slice(0, 2); res.motifs_non_confirmees[m] = (res.motifs_non_confirmees[m] || 0) + 1; continue; }
    res.confirmees++;
    const o = (par[p.oracle] ||= { confirmees: 0, detections_tenues: 0, corriges_acceptes: 0, tenues: 0, non_juges: 0 });
    o.confirmees++;
    const a = juge(p, "avant"), b = a === null ? null : juge(p, "apres");
    if (a === null) { res.oracle_retire++; o.non_juges++; res.non_juges++; continue; }
    if (a === "AUTRE" || b === "AUTRE") { o.non_juges++; res.non_juges++; continue; }
    if (a === "FAIL") { o.detections_tenues++; res.detections_tenues++; } else res.detections_perdues_ids.push(p.id);
    if (b === "PASS") { o.corriges_acceptes++; res.corriges_acceptes++; } else res.corriges_refuses_ids.push(p.id);
    if (a === "FAIL" && b === "PASS") { o.tenues++; res.tenues++; }
  }
  const jugees = res.confirmees - res.non_juges;
  res.taux_detection = jugees ? res.detections_tenues / jugees : null;
  res.taux_tenues = jugees ? res.tenues / jugees : null;
  return res;
}

/** Le juge d'aujourd'hui, réel : l'oracle au HEAD de son dépôt, sur les fichiers du corpus. */
export function jugeReel(dossierCorpus, env = process.env) {
  const cache = new Map();
  return (p, cote) => {
    if (!cache.has(p.id)) cache.set(p.id, scriptDAujourdhui(p, env));
    const s = cache.get(p.id);
    if (!s) return null;
    const f = join(dossierCorpus, p.fichiers, cote, basename(p.livrable));
    return jugerTexte(jugeScript(s.script, s.racine), readFileSync(f), basename(p.livrable));
  };
}

export function tableauMarkdown(res) {
  const pct = (x) => (x === null ? "—" : `${Math.round(x * 100)} %`);
  const l = ["| Oracle | Paires confirmées | Fautif toujours refusé | Corrigé toujours accepté | Paires tenues | Non jugées |", "|---|---|---|---|---|---|"];
  for (const [id, o] of Object.entries(res.par_oracle).sort((a, b) => b[1].confirmees - a[1].confirmees)) l.push(`| \`${id}\` | ${o.confirmees} | ${o.detections_tenues} | ${o.corriges_acceptes} | ${o.tenues} | ${o.non_juges} |`);
  l.push(`| **Total** | ${res.confirmees} | ${res.detections_tenues} (${pct(res.taux_detection)}) | ${res.corriges_acceptes} | ${res.tenues} (${pct(res.taux_tenues)}) | ${res.non_juges} |`);
  return l.join("\n");
}

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const val = (o) => { const i = args.indexOf(o); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null; };
  if (args.includes("--extraire")) {
    const i = args.indexOf("--depots");
    const donnes = i >= 0 ? args.slice(i + 1).filter((a, k, t) => !a.startsWith("--") && t.slice(0, k).every((x) => !x.startsWith("--"))) : [];
    const depots = donnes.length ? donnes : depotsParDefaut();
    const sortie = val("--sortie") || cheminCorpusParDefaut();
    const toutes = [];
    let candidats = 0;
    for (const d of depots) { const r = extraireDepot(d); candidats += r.candidats; toutes.push(...r.paires); console.log(`  ${r.depot} : ${r.candidats} commit(s) retenu(s) par P1, ${r.paires.length} paire(s), ${r.paires.filter((p) => p.confirmee).length} confirmée(s)`); }
    ecrireCorpus(toutes, sortie);
    console.log(`banc des paires ${VERSION} : ${candidats} commit(s) retenu(s) par P1 dans ${depots.length} dépôt(s), ${toutes.length} paire(s), ${toutes.filter((p) => p.confirmee).length} confirmée(s) par le juge de l'époque → ${join(sortie, "corpus.jsonl")}`);
    process.exit(toutes.some((p) => p.confirmee) ? 0 : 1);
  }
  if (args.includes("--rejouer")) {
    const dossier = val("--corpus") || cheminCorpusParDefaut();
    const f = join(dossier, "corpus.jsonl");
    if (!existsSync(f)) { console.error(`corpus introuvable : ${f} — jouer d'abord --extraire`); process.exit(2); }
    const corpus = readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
    const res = rejouer(corpus, jugeReel(dossier));
    if (args.includes("--json")) console.log(JSON.stringify(res, null, 1));
    else {
      console.log(tableauMarkdown(res));
      console.log(`\nbanc des paires ${VERSION} — ${res.paires} paire(s), ${res.confirmees} confirmée(s) par le juge de l'époque, ${res.non_confirmees} non confirmée(s) ${JSON.stringify(res.motifs_non_confirmees)}`);
      if (res.detections_perdues_ids.length) console.log(`  fautifs acceptés aujourd'hui (détection perdue ou règle assouplie, à lire) : ${res.detections_perdues_ids.join(", ")}`);
      if (res.corriges_refuses_ids.length) console.log(`  corrigés refusés aujourd'hui (règle née depuis ou régression, à lire) : ${res.corriges_refuses_ids.join(", ")}`);
    }
    process.exit(res.confirmees ? 0 : 1);
  }
  console.error("usage : node paires.mjs --extraire [--depots <dossier>...] [--sortie <dossier>] | --rejouer [--corpus <dossier>] [--json]");
  process.exit(2);
}
