#!/usr/bin/env node
/**
 * oracle-sidecars-arbre-lie.mjs — UN SIDECAR D'ORACLE SUIVI NE PORTE JAMAIS LE CHEMIN D'UN ARBRE LIÉ
 * (TF-2521, campagne du 16/11/2026 ; décision R-58 du 14/11/2026 : « un sidecar ne porte jamais le chemin absolu d'un arbre lié »).
 *
 * LE FAIT (14 et 15/11/2026). Le contrôle de lisibilité qui joue après l'édition d'un .md (`quality-oracles/scripts/run-oracles.mjs`, source
 * forge-agents) écrit son verdict à côté du document : `<doc>.oracles.json`, `<doc>.oracles-cache.json`, `<doc>.oracles-historique.jsonl`. Il y
 * inscrit le chemin ABSOLU de la cible (`cible`), et le chemin relatif au dossier courant (`file`, `release`, clés de `fichiers`). Quand
 * l'édition a lieu dans un arbre lié (`git worktree add`, ou `.claude\worktrees\agent-…` du harnais), ces chemins nomment l'arbre lié : le sidecar
 * commité à la fusion cite un dossier qui n'existera plus, et sa clé d'empreinte ne se résout plus depuis la racine du dépôt. Mesuré le
 * 16/11/2026 sur le pilot : 31 des 887 sidecars suivis portaient un tel chemin (`..\_wt-pilot-ph\ETAPE-MEP.md`, `…\.claude\worktrees\agent-ac83…\`,
 * `…\.claude\worktrees\c2-tf1821\`), dont `ETAPE-MEP.md.oracles.json` et `ETAPE-MEP.md.oracles-historique.jsonl` à la racine, suivis depuis d77329f9.
 *
 *   SL1 · aucun sidecar suivi ne porte, dans un champ qui désigne un chemin, celui d'un arbre lié : un arbre listé par `git worktree list` autre que
 *         le premier, un dossier frère `_wt-<nom>`, ou un dossier `.claude\worktrees\<nom>`. Les champs de prose (`detail`, `message`, `motif`…) ne
 *         sont pas jugés : un document qui parle d'arbres liés a le droit de le citer.
 *
 * LE REMÈDE EST JOUÉ PAR LE MÊME CODE. `--corriger` réécrit les sidecars fautifs : le chemin d'un arbre lié redevient celui du dépôt principal
 * (absolu) ou disparaît (relatif au dossier courant, qui est la racine du dépôt principal). Il ne touche ni un sidecar sain, ni un fichier qu'il ne
 * saurait resérialiser à l'octet près (indentation, échappements) : celui-là reste FAIL, nommé. Le banc joue ce remède et exige PASS ensuite.
 *
 * NON JUGÉ (déclaré). 1) Que le contrôle de lisibilité n'écrive plus ses sidecars dans l'arbre d'un dépôt autre que le pilot : le code qui les
 * écrit (`qo-gate-write.mjs`, `run-oracles.mjs`) vit dans forge-agents, pas ici. 2) Un arbre lié supprimé dont le dossier ne suit aucune des deux
 * conventions (`_wt-*`, `.claude\worktrees\*`) et que `git worktree list` ne nomme plus : il n'est pas reconnu. 3) Les sidecars non suivis par git.
 * 4) Le contenu des champs de prose.
 *
 * Usage : node oracles\oracle-sidecars-arbre-lie.mjs [--racine <dépôt>] [--json] [--corriger] · --self-test
 * Exit : 0 = PASS · 1 = FAIL (au moins un sidecar suivi nomme un arbre lié) · 2 = SKIP motivé (aucun sidecar suivi, ou dépôt illisible).
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
// Un sidecar : le verdict, son cache, son historique, et le journal d'un dossier (`_oracles-journal*.json*`, TF-1703).
const EST_SIDECAR = /(?:^|\/)(?:[^/]+\.oracles(?:-cache|-historique)?\.jsonl?|_oracles-journal[^/]*\.jsonl?)$/;
// Les champs de PROSE : un constat y cite un extrait du document, qui peut légitimement parler d'arbres liés.
const PROSE = new Set(["detail", "message", "motif", "perimetre_motif", "empreinte_motif", "note", "titre"]);
const SEP = "[\\\\/]";
const NOM = "[^\\\\/\\s\"]+";
const motif = (s) => new RegExp(s, "g");
const ARBRE_CLAUDE = motif(`\\.claude${SEP}worktrees${SEP}${NOM}${SEP}`);            // …\.claude\worktrees\agent-ac83…\  (dedans ou relatif)
const FRERE_ABSOLU = motif(`[A-Za-z]:${SEP}(?:[^\\\\/\\s":]+${SEP})*?_wt-${NOM}${SEP}`);  // C:\dev\_wt-pilot-ph\
const FRERE_RELATIF = motif(`(?:\\.\\.${SEP})+_wt-${NOM}${SEP}`);                      // ..\_wt-pilot-ph\
const echapper = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Le contexte d'un dépôt : sa racine principale (le premier arbre de `git worktree list`) et les arbres liés qu'il nomme. */
export function contexteDe(depot) {
  const r = spawnSync("git", ["-C", depot, "worktree", "list", "--porcelain"], { encoding: "utf8" });
  const arbres = r.status === 0 ? r.stdout.split(/\r?\n/).filter((l) => l.startsWith("worktree ")).map((l) => l.slice(9).trim()) : [];
  const natif = (p) => p.replace(/\//g, "\\");
  if (!arbres.length) return { principal: natif(resolve(depot)), lies: [] };
  return { principal: natif(arbres[0]), lies: arbres.slice(1).map(natif) };
}

/** Le chemin d'un arbre lié devient celui du dépôt principal (absolu) ou disparaît (relatif au dossier courant). Idempotent. */
export function normaliser(chaine, ctx) {
  let s = chaine;
  for (const lie of ctx.lies) {
    const forme = lie.split(/[\\/]+/).filter(Boolean).map(echapper).join(SEP);
    s = s.replace(new RegExp(`${forme}(?=${SEP})`, "gi"), (m) => (m.includes("/") ? ctx.principal.replace(/\\/g, "/") : ctx.principal));
  }
  s = s.replace(ARBRE_CLAUDE, "");
  s = s.replace(FRERE_ABSOLU, (m) => ctx.principal + (m.includes("/") ? "/" : "\\"));
  return s.replace(FRERE_RELATIF, "");
}

function marcher(v, f, cle = null) {
  if (typeof v === "string") return PROSE.has(cle) ? v : f(v);
  if (Array.isArray(v)) return v.map((x) => marcher(x, f, cle));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [f(k), marcher(x, f, k)]));
  return v;
}

const serialiser = (nom, valeurs, retourFinal) => (/\.jsonl$/.test(nom) ? valeurs.map((v) => JSON.stringify(v)).join("\n") : JSON.stringify(valeurs[0], null, 2)) + (retourFinal ? "\n" : "");

/**
 * Juge un sidecar : fautif ou non, les chemins fautifs (3 au plus), et le texte corrigé s'il se resérialise à l'octet près. La forme du parc est
 * celle que l'écrivain laisse puis que git adapte : fins de ligne CRLF dans l'arbre de travail (autocrlf), `.oracles.json` sans retour final.
 */
export function jugerSidecar(nom, texte, ctx) {
  const jsonl = /\.jsonl$/.test(nom);
  const crlf = texte.includes("\r\n");
  const lf = crlf ? texte.replace(/\r\n/g, "\n") : texte;
  const retourFinal = lf.endsWith("\n");
  let valeurs;
  try { valeurs = jsonl ? lf.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) : [JSON.parse(lf)]; } catch { return { lisible: false, fautif: false, chemins: [], corrige: null }; }
  const chemins = new Set();
  const corrigees = valeurs.map((v) => marcher(v, (s) => { const n = normaliser(s, ctx); if (n !== s) chemins.add(s); return n; }));
  const fautif = chemins.size > 0;
  const enFin = (s) => (crlf ? s.replace(/\n/g, "\r\n") : s);
  const fidele = enFin(serialiser(nom, valeurs, retourFinal)) === texte;   // on sait réécrire ce fichier sans en changer la forme
  return { lisible: true, fautif, chemins: [...chemins].slice(0, 3), corrige: fautif && fidele ? enFin(serialiser(nom, corrigees, retourFinal)) : null };
}

/** Les sidecars SUIVIS d'un dépôt (chemins relatifs, séparateur `/`). `null` si git ne répond pas. */
function sidecarsSuivis(depot) {
  const r = spawnSync("git", ["-C", depot, "ls-files", "-z"], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (r.status !== 0) return null;
  return r.stdout.split("\0").filter((f) => f && EST_SIDECAR.test(f));
}

export function jugerDepot(depot, { corriger = false } = {}) {
  const suivis = sidecarsSuivis(depot);
  if (suivis === null) return { verdict: "SKIP", motif: `${depot} n'est pas un dépôt git lisible`, fichiers: 0, findings: [], reecrits: [] };
  if (!suivis.length) return { verdict: "SKIP", motif: "aucun sidecar d'oracle suivi par git", fichiers: 0, findings: [], reecrits: [] };
  const ctx = contexteDe(depot);
  const findings = [], reecrits = [];
  for (const f of suivis) {
    const chemin = join(depot, f);
    if (!existsSync(chemin)) continue;   // supprimé de l'arbre, pas encore de l'index
    const texte = readFileSync(chemin, "utf8");
    const j = jugerSidecar(f, texte, ctx);
    if (!j.fautif) continue;
    if (corriger && j.corrige !== null) { writeFileSync(chemin, j.corrige, "utf8"); reecrits.push(f); continue; }
    findings.push({ regle: "SL1", statut: "FAIL", ou: f, message: `le sidecar nomme un arbre lié (« ${j.chemins.join(" » · « ").slice(0, 300)} »)`
      + (j.corrige === null ? " — et sa forme ne se resérialise pas à l'octet près : à corriger à la main, ou à régénérer depuis le dépôt principal"
        : " — remède : node oracles\\oracle-sidecars-arbre-lie.mjs --corriger (le chemin redevient celui du dépôt principal)") });
  }
  return { verdict: findings.length ? "FAIL" : "PASS", fichiers: suivis.length, findings, reecrits, principal: ctx.principal };
}

const NON_JUGE = ["que le contrôle de lisibilité n'écrive plus ses sidecars dans l'arbre d'un dépôt autre que le pilot : son code vit dans forge-agents (qo-gate-write.mjs, quality-oracles/scripts/run-oracles.mjs)",
  "un arbre lié supprimé, que `git worktree list` ne nomme plus et dont le dossier ne suit ni `_wt-*` ni `.claude\\worktrees\\*`", "les sidecars non suivis par git", "les champs de prose (detail, message, motif…)"];

const lanceEnDirect = process.argv[1] === fileURLToPath(import.meta.url);

if (lanceEnDirect && process.argv.includes("--self-test")) {
  const echecs = [];
  let n = 0;
  const verifier = (cas, ok, detail) => { n++; if (!ok) echecs.push(`${cas} : ${detail}`); };
  const racine = mkdtempSync(join(tmpdir(), "sidecars-arbre-lie-"));
  const git = (cwd, ...a) => spawnSync("git", ["-C", cwd, ...a], { encoding: "utf8" });
  const lancer = (depot, ...args) => { const r = spawnSync(process.execPath, [join(ICI, "oracle-sidecars-arbre-lie.mjs"), "--racine", depot, "--json", ...args], { encoding: "utf8" }); let j = null; try { j = JSON.parse(r.stdout); } catch { /* dit par le cas */ } return { code: r.status, verdict: j && j.verdict, j }; };
  const NATIF = (p) => p.replace(/\//g, "\\");
  const depotNeuf = (nom, fichiers) => {
    const d = join(racine, nom);
    mkdirSync(d, { recursive: true });
    git(d, "init", "-q"); git(d, "config", "user.email", "t@t"); git(d, "config", "user.name", "t");
    for (const [f, c] of Object.entries(fichiers)) { mkdirSync(dirname(join(d, f)), { recursive: true }); writeFileSync(join(d, f), c, "utf8"); }
    git(d, "add", "-A"); git(d, "commit", "-q", "-m", "essai");
    return d;
  };
  const sidecar = (cible, relatif, extra = {}) => JSON.stringify({ cible, verdict: "PASS", bilan_fichiers: { "jugé": [relatif] }, resultats: [{ file: relatif, verdict: "PASS", detail: "" }], ...extra }, null, 2) + "\n";
  try {
    const principal = join(racine, "p1");
    const P = NATIF(principal);
    // 1 ROUGE — chemin d'un arbre frère `_wt-*`, absolu et relatif (la forme mesurée sur ETAPE-MEP.md.oracles.json)
    const d1 = depotNeuf("p1", { "ETAPE-MEP.md": "x\n", "ETAPE-MEP.md.oracles.json": sidecar("C:\\dev\\_wt-pilot-ph\\ETAPE-MEP.md", "..\\_wt-pilot-ph\\ETAPE-MEP.md"),
      "ETAPE-MEP.md.oracles-historique.jsonl": JSON.stringify({ verdict: "FAIL", fails: ["Lisibilité d'un document (Markdown):..\\_wt-pilot-ph\\ETAPE-MEP.md"], empreinte: { release: "..\\_wt-pilot-ph\\ETAPE-MEP.md", fichiers: { "..\\_wt-pilot-ph\\ETAPE-MEP.md": "ab" } } }) + "\n" });
    const r1 = lancer(d1);
    verifier("1 ROUGE — un sidecar qui nomme un arbre frère _wt-* est refusé (absolu, relatif, fails, clé d'empreinte)", r1.code === 1 && r1.verdict === "FAIL" && r1.j.findings.length === 2, `code ${r1.code}, verdict ${r1.verdict}, ${r1.j && r1.j.findings.length} constat(s)`);
    verifier("1 bis — le message cite le chemin fautif et le remède --corriger", r1.j && r1.j.findings.every((f) => /_wt-pilot-ph/.test(f.message) && /--corriger/.test(f.message)), JSON.stringify(r1.j && r1.j.findings.map((f) => f.message)).slice(0, 300));
    // 2 REMÈDE JOUÉ — --corriger puis le même contrôle rend PASS ; le chemin redevient celui du dépôt, le reste du sidecar est intact
    const avant = JSON.parse(readFileSync(join(d1, "ETAPE-MEP.md.oracles.json"), "utf8"));
    const rc = lancer(d1, "--corriger");
    const apres = JSON.parse(readFileSync(join(d1, "ETAPE-MEP.md.oracles.json"), "utf8"));
    const histo = JSON.parse(readFileSync(join(d1, "ETAPE-MEP.md.oracles-historique.jsonl"), "utf8").trim());
    verifier("2 VERT — le remède joué : --corriger rend PASS (exit 0)", rc.code === 0 && rc.verdict === "PASS", `code ${rc.code}, verdict ${rc.verdict}`);
    verifier("2 bis — le chemin absolu redevient celui du dépôt principal, le relatif disparaît, le verdict et la forme sont intacts",
      apres.cible === `${P}\\ETAPE-MEP.md` && apres.bilan_fichiers["jugé"][0] === "ETAPE-MEP.md" && apres.resultats[0].file === "ETAPE-MEP.md" && apres.verdict === avant.verdict
      && readFileSync(join(d1, "ETAPE-MEP.md.oracles.json"), "utf8").endsWith("}\n"), JSON.stringify(apres).slice(0, 300));
    verifier("2 ter — l'historique : la ligne `fails`, `release` et la clé d'empreinte sont corrigées, la valeur de l'empreinte est conservée",
      histo.fails[0] === "Lisibilité d'un document (Markdown):ETAPE-MEP.md" && histo.empreinte.release === "ETAPE-MEP.md" && histo.empreinte.fichiers["ETAPE-MEP.md"] === "ab", JSON.stringify(histo).slice(0, 300));
    verifier("2 quater — idempotence : un second --corriger ne réécrit rien", (lancer(d1, "--corriger").j.reecrits || []).length === 0, "des fichiers réécrits au second passage");
    // 3 ROUGE — l'arbre du harnais `.claude\worktrees\<nom>\` (absolu dans le dépôt, puis relatif)
    const d3 = depotNeuf("p3", { "a.md.oracles.json": sidecar("C:\\dev\\digit-ai-factory\\.claude\\worktrees\\agent-ac83\\a.md", ".claude\\worktrees\\c2-tf1821\\a.md") });
    const r3 = lancer(d3);
    verifier("3 ROUGE — un sidecar qui nomme un arbre `.claude\\worktrees\\<nom>` est refusé", r3.code === 1 && r3.j.findings.length === 1 && /worktrees/.test(r3.j.findings[0].message), `code ${r3.code}`);
    lancer(d3, "--corriger");
    const a3 = JSON.parse(readFileSync(join(d3, "a.md.oracles.json"), "utf8"));
    verifier("3 bis VERT — corrigé : `C:\\dev\\digit-ai-factory\\a.md` et `a.md`", a3.cible === "C:\\dev\\digit-ai-factory\\a.md" && a3.resultats[0].file === "a.md" && lancer(d3).code === 0, JSON.stringify(a3).slice(0, 200));
    // 4 ROUGE — un VRAI arbre lié (`git worktree add`), de nom quelconque : reconnu par `git worktree list`, pas par la convention de nom
    const d4 = depotNeuf("p4", { "b.md.oracles.json": "{}\n" });
    const lie = join(racine, "arbre-quelconque");
    git(d4, "worktree", "add", "-q", lie, "-b", "essai-lie");
    writeFileSync(join(d4, "b.md.oracles.json"), sidecar(`${NATIF(lie)}\\b.md`, "b.md"), "utf8");
    git(d4, "add", "-A"); git(d4, "commit", "-q", "-m", "sidecar");
    writeFileSync(join(lie, "b.md.oracles.json"), sidecar(`${NATIF(lie)}\\b.md`, "b.md"), "utf8");
    git(lie, "add", "-A"); git(lie, "commit", "-q", "-m", "sidecar de l'arbre lié");
    const r4 = lancer(d4);
    verifier("4 ROUGE — le chemin d'un arbre lié réel (nom sans convention) est refusé, et jugé depuis l'arbre lié aussi", r4.code === 1 && lancer(lie).code === 1, `code dépôt ${r4.code}, code arbre lié ${lancer(lie).code}`);
    lancer(d4, "--corriger");
    verifier("4 bis VERT — corrigé : le chemin redevient celui du dépôt principal", JSON.parse(readFileSync(join(d4, "b.md.oracles.json"), "utf8")).cible === `${NATIF(d4)}\\b.md`, readFileSync(join(d4, "b.md.oracles.json"), "utf8").slice(0, 200));
    // 5 VERT — un sidecar sain, et un document qui PARLE d'arbres liés dans un champ de prose
    const d5 = depotNeuf("p5", { "c.md.oracles.json": sidecar("C:\\dev\\digit-ai-factory\\c.md", "c.md", { resultats: [{ file: "c.md", verdict: "PASS", detail: "le document cite C:\\dev\\_wt-essai\\ et .claude\\worktrees\\agent-x\\ en prose" }] }), "c.md.oracles-cache.json": "{}\n" });
    verifier("5 VERT — un sidecar sain, dont un champ de prose cite un arbre lié, passe", lancer(d5).code === 0 && lancer(d5).verdict === "PASS", `code ${lancer(d5).code}`);
    // 6 SKIP — aucun sidecar suivi : exit 2, jamais un PASS ; et un sidecar NON suivi n'est pas jugé
    const d6 = depotNeuf("p6", { "x.txt": "x\n" });
    writeFileSync(join(d6, "z.md.oracles.json"), sidecar("C:\\dev\\_wt-pilot-ph\\z.md", "z.md"), "utf8");
    verifier("6 SKIP — un dépôt sans sidecar suivi rend 2 ; le sidecar non suivi n'est pas jugé", lancer(d6).code === 2 && lancer(d6).verdict === "SKIP", `code ${lancer(d6).code}`);
    verifier("6 bis SKIP — un dossier qui n'est pas un dépôt git rend 2", lancer(join(racine, "absent")).code === 2, `code ${lancer(join(racine, "absent")).code}`);
    // 7 ROUGE non réécrit — un fichier que la resérialisation changerait (indentation à 4) reste FAIL, nommé, intact sur le disque
    const brut = JSON.stringify({ cible: "C:\\dev\\_wt-pilot-ph\\d.md", verdict: "PASS" }, null, 4) + "\n";
    const d7 = depotNeuf("p7", { "d.md.oracles.json": brut });
    const r7 = lancer(d7, "--corriger");
    verifier("7 ROUGE — un sidecar qu'on ne saurait resérialiser à l'octet près n'est pas réécrit : FAIL, nommé, fichier intact", r7.code === 1 && /octet près/.test(r7.j.findings[0].message) && readFileSync(join(d7, "d.md.oracles.json"), "utf8") === brut, `code ${r7.code}`);
    // 8 VERT — un sidecar sain n'est jamais réécrit par --corriger (octets intacts)
    const sain = readFileSync(join(d5, "c.md.oracles.json"), "utf8");
    lancer(d5, "--corriger");
    verifier("8 VERT — --corriger ne touche pas un sidecar sain", readFileSync(join(d5, "c.md.oracles.json"), "utf8") === sain, "octets changés");
    // 10 — la forme RÉELLE du parc (mesurée le 16/11/2026 : les 887 sidecars suivis) : fins de ligne CRLF dans l'arbre de travail (autocrlf) et `.oracles.json`
    // sans retour final. Sans cela, la première version refusait de réécrire les 887 (« à l'octet près »). La forme est conservée telle quelle.
    const forme = (cible) => JSON.stringify({ cible, verdict: "PASS" }, null, 2).replace(/\n/g, "\r\n");
    const d10 = depotNeuf("p10", { "e.md.oracles.json": forme("C:\\dev\\_wt-pilot-ph\\e.md"), "e.md.oracles-historique.jsonl": JSON.stringify({ release: "..\\_wt-pilot-ph\\e.md" }) + "\r\n" });
    const r10 = lancer(d10, "--corriger");
    verifier("10 VERT — la forme réelle du parc (CRLF, sans retour final) est corrigée et conservée à l'octet près, hors le chemin",
      r10.code === 0 && readFileSync(join(d10, "e.md.oracles.json"), "utf8") === forme(`${NATIF(d10)}\\e.md`) && readFileSync(join(d10, "e.md.oracles-historique.jsonl"), "utf8") === JSON.stringify({ release: "e.md" }) + "\r\n",
      `code ${r10.code}, ${JSON.stringify(readFileSync(join(d10, "e.md.oracles.json"), "utf8")).slice(0, 160)}`);
    // 9 le dépôt réel du pilot : la sonde sait lire ses propres sidecars (jamais SKIP faute de lecture)
    const reel = lancer(join(ICI, ".."));
    verifier("9 le pilot réel est lisible : verdict PASS ou FAIL, jamais SKIP", reel.verdict === "PASS" || reel.verdict === "FAIL", `verdict ${reel.verdict}`);
  } finally {
    spawnSync("git", ["-C", racine, "worktree", "prune"], { encoding: "utf8" });
    rmSync(racine, { recursive: true, force: true });
  }
  if (echecs.length) { console.error(`oracle-sidecars-arbre-lie --self-test : ${echecs.length} échec(s)\n  - ${echecs.join("\n  - ")}`); process.exit(1); }
  console.log(`oracle-sidecars-arbre-lie --self-test : ${n} PASS, 0 FAIL — rouge (arbre frère _wt-*, .claude\\worktrees, arbre lié réel), remède joué (--corriger rend PASS, idempotent, forme et verdict intacts), prose non jugée, SKIP, fichier non resérialisable laissé intact`);
  process.exit(0);
}

if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--racine");
  const depot = resolve(i >= 0 ? args[i + 1] : join(ICI, ".."));
  const r = jugerDepot(depot, { corriger: args.includes("--corriger") });
  const sortie = { oracle: "oracle-sidecars-arbre-lie", version: "1.0.0", regle: "TF-2521 (SL1)", verdict: r.verdict, fichiers_jugés: r.fichiers, findings: r.findings,
    ...(r.reecrits.length ? { reecrits: r.reecrits } : {}), ...(r.motif ? { motif: r.motif } : {}), non_juge: NON_JUGE };
  if (args.includes("--json")) console.log(JSON.stringify(sortie));
  else {
    console.log(`oracle-sidecars-arbre-lie : ${r.verdict} — ${r.fichiers} sidecar(s) suivi(s)${r.motif ? ` — ${r.motif}` : ""}${r.reecrits.length ? ` — ${r.reecrits.length} réécrit(s)` : ""}`);
    for (const f of r.findings.slice(0, 20)) console.log(`  ${f.regle} ${f.ou} : ${f.message}`);
    if (r.findings.length > 20) console.log(`  … et ${r.findings.length - 20} autre(s) (${r.findings.length} au total)`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SKIP" ? 2 : 0);
}
