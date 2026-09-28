#!/usr/bin/env node
/**
 * oracle-modeles-en-service.mjs — LA GÉNÉRATION DE MODÈLES SE MESURE, ELLE NE SE RECOPIE PAS
 * (décision humaine D-1 (a) du 25/09/2026, posée par la synthèse 20260924b).
 *
 * ============================================================================================
 * LE FAIT
 * ============================================================================================
 *
 * Le §4 de CONTRAT-INTERFACE.md nommait Fable 5 et Opus 5, épinglés le 10/08 et révisables « à
 * chaque changement de famille ». Fable 5.1 a piloté dès le 02/09, Opus 5.5 depuis le 23/09 : deux
 * versions DE LA MÊME FAMILLE, donc aucun déclencheur, et la règle de challenge (re-tester l'a
 * priori à chaque saut de génération) n'est jamais partie. Les agents suivaient les versions par
 * héritage ; la doctrine ne les suivait pas, et rien ne le disait.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ
 * ============================================================================================
 *
 *   MS1 · le référentiel `references/MODELES-EN-SERVICE.json` est lisible et complet : schéma
 *         connu, date, au moins une source, les 4 familles avec un identifiant de leur famille.
 *   MS2 · toute version SERVIE sur le poste se situe par rapport au référentiel. Elle se lit dans
 *         les transcripts de Claude Code, champ `message.model` des réponses, sessions et
 *         sous-agents compris. Une version de la génération courante passe. Une version PLUS
 *         ANCIENNE que la courante de sa famille, déclarée ou non, est signalée (AVERT), jamais en
 *         échec : elle dit qu'une session ou un agent épingle un identifiant complet. Une version
 *         PLUS RÉCENTE, ou d'une famille inconnue, est le déclencheur voulu par la décision :
 *         re-test de la règle de challenge dû, référentiel à dater. FAIL. Le rang se lit sur les
 *         numéros de l'identifiant (`claude-opus-4-8` < `claude-opus-5` < `claude-opus-5-5`).
 *         Premier passage réel, le 25/09/2026 : `claude-opus-4-8` y était lu « nouvelle
 *         version » ; c'était une version plus ancienne, servie à 2 sessions de produits.
 *   MS3 · un re-test dû (`re_test_regle_de_challenge.statut: "du"`) se dit à chaque passage,
 *         jusqu'à ce qu'une mesure le clôture (`clos_par`). AVERT, jamais un échec : un re-test
 *         attend un run qui porte 2 tranches comparables, pas une session.
 *
 * Normalisation d'un identifiant avant comparaison : le suffixe de contexte (`[1m]`), le préfixe
 * de plateforme (`anthropic.`) et l'instantané daté (`-20251001`) sont retirés ; `<synthetic>` et
 * tout nom hors de la forme `claude-…` sont ignorés.
 *
 * ============================================================================================
 * LECTURE BORNÉE, parce qu'elle se joue à chaque ouverture de session
 * ============================================================================================
 *
 * Racines lues par défaut : `CLAUDE_CONFIG_DIR`, puis tout dossier `~/.claude*` qui porte un
 * `projects/`. Fichiers `.jsonl` modifiés depuis 14 jours, 400 au plus, les plus récents
 * d'abord ; chacun se lit par la FIN, 512 Ko au plus, et une ligne n'est retenue que si elle porte
 * `"type":"assistant"`. Un texte cité dans une réponse est échappé dans le JSON (`\"model\"`) :
 * il ne peut pas se faire passer pour le champ lu. La durée de chaque passage est rendue dans la
 * sortie (`lecture.duree_ms`).
 *
 * Non jugé : la qualité ou le coût d'une version ; qu'une version servie soit la dernière publiée
 * par Anthropic. Seules les versions vues sur ce poste sont lues, et une version jamais servie ici
 * ne déclenche rien.
 *
 * Recette à double sens : `--self-test` (cas rouges étiquetés, dont la nouvelle version qui DOIT
 * échouer, et le passage de bout en bout par la ligne de commande).
 *
 * Usage : node oracles/oracle-modeles-en-service.mjs [--referentiel <fichier>]
 *           [--transcripts <dossier>]... [--modele <identifiant>]... [--jours <N>] [--json]
 *         node oracles/oracle-modeles-en-service.mjs --self-test
 * Sortie : exit 0 PASS · 1 FAIL · 2 erreur d'usage.
 */
import { readFileSync, readdirSync, statSync, existsSync, openSync, readSync, closeSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { homedir, tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const NOM = "oracle-modeles-en-service";
const VERSION = "1.0.0";
const SCHEMA = "pilot/modeles-en-service@1";
const REF_DEFAUT = join(ICI, "..", "references", "MODELES-EN-SERVICE.json");
const FAMILLES = ["fable", "opus", "sonnet", "haiku"];
const FIN_LUE = 512 * 1024;
const JOURS_DEFAUT = 14;
const MAX_FICHIERS = 400;
const NON_JUGE = [
  "la qualité ou le coût d'une version servie",
  "qu'une version servie soit la dernière publiée par Anthropic : seules les versions vues sur ce poste sont lues",
  "les transcripts au-delà de la fenêtre lue (jours, nombre de fichiers, fin de fichier)",
];

/** Identifiant comparable : sans suffixe de contexte, préfixe de plateforme ni instantané daté. */
export function normaliser(id) {
  if (typeof id !== "string") return null;
  let s = id.trim().toLowerCase().replace(/\[[^\]]*\]$/, "");
  s = s.replace(/^anthropic\./, "").replace(/[-@]20\d{6}$/, "");
  return /^claude-[a-z0-9][a-z0-9.-]*$/.test(s) ? s : null;
}

export function familleDe(id) {
  const m = /^claude-([a-z]+)-/.exec(id || "");
  return m ? m[1] : null;
}

/** Rang de deux versions d'une même famille : -1, 0, 1, ou null si l'un n'est pas numéroté. */
export function comparerVersions(a, b) {
  const numeros = (id) => { const m = /^claude-[a-z]+-(\d+(?:-\d+)*)$/.exec(id || ""); return m ? m[1].split("-").map(Number) : null; };
  const x = numeros(a);
  const y = numeros(b);
  if (!x || !y) return null;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d) return Math.sign(d);
  }
  return 0;
}

/** Racines de configuration de Claude Code présentes sur le poste. */
export function racinesParDefaut() {
  const racines = new Set();
  if (process.env.CLAUDE_CONFIG_DIR) racines.add(process.env.CLAUDE_CONFIG_DIR);
  const maison = homedir();
  let entrees = [];
  try { entrees = readdirSync(maison, { withFileTypes: true }); } catch { entrees = []; }
  for (const e of entrees) if (e.isDirectory() && /^\.claude/.test(e.name)) racines.add(join(maison, e.name));
  return [...racines].map((r) => join(r, "projects")).filter((p) => existsSync(p));
}

function* fichiersJsonl(dossier, profondeur = 4) {
  let entrees;
  try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    const p = join(dossier, e.name);
    if (e.isDirectory()) { if (profondeur > 0) yield* fichiersJsonl(p, profondeur - 1); }
    else if (e.name.endsWith(".jsonl")) yield p;
  }
}

/** Versions servies, lues par la fin des transcripts récents. Rend une Map id -> {reponses, derniere}. */
export function lireVersionsServies(dossiers, { jours = JOURS_DEFAUT, maxFichiers = MAX_FICHIERS, maintenant = Date.now() } = {}) {
  const debut = Date.now();
  const limite = maintenant - jours * 86400000;
  const candidats = [];
  for (const d of dossiers) for (const f of fichiersJsonl(d)) {
    let st; try { st = statSync(f); } catch { continue; }
    if (st.mtimeMs >= limite) candidats.push({ f, mtime: st.mtimeMs, taille: st.size });
  }
  candidats.sort((a, b) => b.mtime - a.mtime);
  const retenus = candidats.slice(0, maxFichiers);
  const vues = new Map();
  for (const { f, mtime, taille } of retenus) {
    const n = Math.min(FIN_LUE, taille);
    if (!n) continue;
    const tampon = Buffer.alloc(n);
    let fd;
    try { fd = openSync(f, "r"); readSync(fd, tampon, 0, n, taille - n); } catch { continue; } finally { if (fd !== undefined) closeSync(fd); }
    const lignes = tampon.toString("utf8").split("\n");
    if (n < taille) lignes.shift();
    for (const l of lignes) {
      if (!l.includes('"type":"assistant"')) continue;
      const m = /"model":"([^"]+)"/.exec(l);
      const id = m ? normaliser(m[1]) : null;
      if (!id) continue;
      const e = vues.get(id) || { reponses: 0, derniere: 0 };
      e.reponses += 1;
      e.derniere = Math.max(e.derniere, mtime);
      vues.set(id, e);
    }
  }
  return { vues, fichiers_lus: retenus.length, candidats: candidats.length, duree_ms: Date.now() - debut };
}

const jour = (ms) => (ms ? new Date(ms).toISOString().slice(0, 10) : "?");

/** Le jugement, pur : un référentiel (objet) et les versions servies (Map ou null). */
export function juger(ref, vues) {
  const findings = [];
  const manques = [];
  if (!ref || typeof ref !== "object") manques.push("référentiel illisible");
  else {
    if (ref.schema !== SCHEMA) manques.push(`schéma « ${ref.schema} » au lieu de « ${SCHEMA} »`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(ref.date || ""))) manques.push("date absente ou hors de la forme AAAA-MM-JJ");
    if (!Array.isArray(ref.sources) || !ref.sources.length) manques.push("aucune source");
    for (const f of FAMILLES) {
      const e = ref.generation_courante && ref.generation_courante[f];
      if (!e || familleDe(normaliser(e.identifiant)) !== f) manques.push(`famille ${f} sans identifiant de sa famille`);
    }
  }
  if (manques.length) findings.push({ regle: "MS1", statut: "FAIL", message: `référentiel incomplet : ${manques.join(" ; ")}` });
  else findings.push({ regle: "MS1", statut: "PASS", message: `référentiel daté du ${ref.date}, ${ref.sources.length} source(s), 4 familles nommées` });

  if (manques.length) findings.push({ regle: "MS2", statut: "SANS_OBJET", message: "référentiel incomplet : les versions servies ne se jugent pas contre lui" });
  else if (!vues || !vues.size) findings.push({ regle: "MS2", statut: "SANS_OBJET", message: "aucune version servie lue dans la fenêtre : rien à confronter au référentiel" });
  else {
    const courante = (f) => (FAMILLES.includes(f) ? normaliser(ref.generation_courante[f].identifiant) : null);
    const declarees = new Set((ref.versions_anterieures || []).map((v) => normaliser(v && v.identifiant)).filter(Boolean));
    const nouvelles = [];
    const anciennes = [];
    for (const [id, e] of vues) {
      const cur = courante(familleDe(id));
      if (id === cur) continue;
      const rang = cur ? comparerVersions(id, cur) : null;
      if (rang !== null && rang < 0) anciennes.push([id, e, declarees.has(id)]);
      else nouvelles.push([id, e, cur ? (rang === null ? "non comparable à la courante" : "plus récente que la courante") : "famille inconnue du référentiel"]);
    }
    for (const [id, e, pourquoi] of nouvelles) findings.push({ regle: "MS2", statut: "FAIL", message: `version servie ${pourquoi} : ${id} (${e.reponses} réponse(s) lues, fichier le plus récent du ${jour(e.derniere)}) ; nouvelle version : re-test de la règle de challenge dû (CONTRAT-INTERFACE.md §4) et référentiel à dater` });
    if (!nouvelles.length) findings.push({ regle: "MS2", statut: "PASS", message: `${vues.size} version(s) servie(s), aucune plus récente que la génération courante : ${[...vues.keys()].sort().join(", ")}` });
    for (const [id, e, declaree] of anciennes) findings.push({ regle: "MS2", statut: "AVERT", message: `version antérieure encore servie${declaree ? "" : ", non déclarée au référentiel"} : ${id} (${e.reponses} réponse(s), fichier le plus récent du ${jour(e.derniere)}) ; une session ou un agent l'épingle par identifiant complet, là où le nom de famille suivrait la version courante` });
  }

  const rt = ref && ref.re_test_regle_de_challenge;
  if (rt && rt.statut === "du") findings.push({ regle: "MS3", statut: "AVERT", message: `re-test de la règle de challenge dû depuis le ${rt.depuis} : ${rt.declencheur} ; protocole : ${rt.protocole}` });
  else findings.push({ regle: "MS3", statut: "PASS", message: rt && rt.clos_par ? `dernier re-test clos par ${rt.clos_par}` : "aucun re-test en attente" });

  return { verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings };
}

function lireArgs(argv) {
  const a = { referentiel: REF_DEFAUT, transcripts: [], modeles: [], jours: JOURS_DEFAUT, json: false, selfTest: false };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === "--referentiel") a.referentiel = argv[++i];
    else if (x === "--transcripts") a.transcripts.push(argv[++i]);
    else if (x === "--modele") a.modeles.push(argv[++i]);
    else if (x === "--jours") a.jours = Number(argv[++i]);
    else if (x === "--json") a.json = true;
    else if (x === "--self-test") a.selfTest = true;
    else return { erreur: `option inconnue : ${x}` };
  }
  if (!Number.isFinite(a.jours) || a.jours <= 0) return { erreur: "--jours attend un nombre positif" };
  if (a.transcripts.some((t) => !t) || a.modeles.some((m) => !m) || !a.referentiel) return { erreur: "option sans valeur" };
  return a;
}

export function executer(argv) {
  const a = lireArgs(argv);
  if (a.erreur) return { code: 2, sortie: `${NOM} : ${a.erreur}` };
  let ref = null;
  try { ref = JSON.parse(readFileSync(a.referentiel, "utf8")); } catch { ref = null; }
  let lecture;
  if (a.modeles.length) {
    const vues = new Map();
    for (const m of a.modeles) { const id = normaliser(m); if (id) vues.set(id, { reponses: (vues.get(id)?.reponses || 0) + 1, derniere: Date.now() }); }
    lecture = { vues, source: "--modele", fichiers_lus: 0, candidats: 0, duree_ms: 0, dossiers: [] };
  } else {
    const dossiers = a.transcripts.length ? a.transcripts : racinesParDefaut();
    lecture = { ...lireVersionsServies(dossiers, { jours: a.jours }), source: "transcripts", dossiers };
  }
  const { verdict, findings } = juger(ref, lecture.vues);
  const versions = [...lecture.vues.entries()].sort((x, y) => y[1].derniere - x[1].derniere)
    .map(([id, e]) => ({ identifiant: id, famille: familleDe(id), reponses: e.reponses, derniere: jour(e.derniere) }));
  const resume = `${NOM} — verdict ${verdict} : ${versions.length} version(s) servie(s) lue(s) sur ${lecture.fichiers_lus} fichier(s) en ${lecture.duree_ms} ms`;
  const rapport = {
    oracle: NOM, version: VERSION, cible: a.referentiel, verdict, resume,
    lecture: { source: lecture.source, dossiers: lecture.dossiers, jours: a.jours, fichiers_lus: lecture.fichiers_lus, candidats: lecture.candidats, duree_ms: lecture.duree_ms },
    versions_servies: versions, findings, non_juge: NON_JUGE,
  };
  const texte = a.json ? JSON.stringify(rapport, null, 1)
    : [resume, `verdict : ${verdict}`, ...findings.map((f) => `  [${f.statut}] ${f.regle} — ${f.message}`)].join("\n");
  return { code: verdict === "FAIL" ? 1 : 0, sortie: texte, rapport };
}

// ---- recette à double sens ---------------------------------------------------------------------
function selfTest() {
  const tmp = mkdtempSync(join(tmpdir(), "modeles-en-service-"));
  const refOk = {
    schema: SCHEMA, date: "2026-09-25",
    sources: [{ quoi: "fixture", ou: "recette", lu_le: "2026-09-25" }],
    generation_courante: {
      fable: { identifiant: "claude-fable-5-1" }, opus: { identifiant: "claude-opus-5-5" },
      sonnet: { identifiant: "claude-sonnet-5" }, haiku: { identifiant: "claude-haiku-4-5" },
    },
    versions_anterieures: [{ identifiant: "claude-opus-5", suivie_par: "claude-opus-5-5" }],
    re_test_regle_de_challenge: { statut: "du", depuis: "2026-09-25", declencheur: "fixture", protocole: "fixture", clos_par: null },
  };
  const ligne = (modele, texte = "ok") => JSON.stringify({ parentUuid: "p", isSidechain: false, message: { model: modele, id: "m", type: "message", role: "assistant", content: [{ type: "text", text: texte }] }, type: "assistant" });
  const dossier = (nom, lignes) => { const d = join(tmp, nom); mkdirSync(join(d, "session", "subagents"), { recursive: true }); writeFileSync(join(d, "session.jsonl"), lignes.join("\n") + "\n"); return d; };
  const vuesDe = (d) => lireVersionsServies([d]).vues;
  const statut = (r, regle) => r.findings.filter((f) => f.regle === regle).map((f) => f.statut);
  const cas = [];
  const verifier = (nom, ok) => cas.push({ nom, ok: !!ok });
  try {
    verifier("vert MS1 : référentiel complet, 4 familles", statut(juger(refOk, new Map()), "MS1")[0] === "PASS");
    verifier("rouge MS1 : référentiel sans source, doit échouer", statut(juger({ ...refOk, sources: [] }, new Map()), "MS1")[0] === "FAIL");
    verifier("rouge MS1 : famille opus portant un identifiant sonnet, doit échouer", statut(juger({ ...refOk, generation_courante: { ...refOk.generation_courante, opus: { identifiant: "claude-sonnet-5" } } }, new Map()), "MS1")[0] === "FAIL");
    const dVert = dossier("vert", [ligne("claude-opus-5-5[1m]"), ligne("claude-haiku-4-5-20251001"), ligne("<synthetic>"), JSON.stringify({ type: "user", message: { role: "user", content: "x" } })]);
    writeFileSync(join(dVert, "session", "subagents", "agent-a.jsonl"), ligne("claude-sonnet-5") + "\n");
    const vVert = vuesDe(dVert);
    verifier("vert MS2 : [1m], instantané daté, <synthetic> et sous-agent normalisés", juger(refOk, vVert).verdict === "PASS" && vVert.has("claude-opus-5-5") && vVert.has("claude-haiku-4-5") && vVert.has("claude-sonnet-5") && vVert.size === 3);
    const dRouge = dossier("rouge", [ligne("claude-opus-5-5"), ligne("claude-opus-6")]);
    const rRouge = juger(refOk, vuesDe(dRouge));
    verifier("rouge MS2 : une version inconnue (claude-opus-6) doit échouer, c'est le déclencheur", rRouge.verdict === "FAIL" && rRouge.findings.some((f) => f.regle === "MS2" && f.statut === "FAIL" && /claude-opus-6/.test(f.message)));
    const rAncienne = juger(refOk, vuesDe(dossier("ancienne", [ligne("claude-opus-5")])));
    verifier("vert MS2 : une version antérieure déclarée est signalée, jamais en échec", rAncienne.verdict === "PASS" && statut(rAncienne, "MS2").includes("AVERT"));
    const rNonDeclaree = juger(refOk, vuesDe(dossier("non-declaree", [ligne("claude-opus-4-8")])));
    verifier("vert MS2 : une version plus ancienne non déclarée (claude-opus-4-8) est signalée, jamais lue comme nouvelle", rNonDeclaree.verdict === "PASS" && rNonDeclaree.findings.some((f) => f.statut === "AVERT" && /non déclarée/.test(f.message)));
    const rFamille = juger(refOk, vuesDe(dossier("famille", [ligne("claude-mythos-5-1")])));
    verifier("rouge MS2 : une famille inconnue du référentiel doit échouer", rFamille.verdict === "FAIL" && rFamille.findings.some((f) => /famille inconnue/.test(f.message)));
    verifier("vert rang : claude-opus-4-8 < claude-opus-5 < claude-opus-5-5, et claude-fable-5-1 > claude-fable-5", comparerVersions("claude-opus-4-8", "claude-opus-5") === -1 && comparerVersions("claude-opus-5", "claude-opus-5-5") === -1 && comparerVersions("claude-fable-5-1", "claude-fable-5") === 1);
    const dCite = dossier("cite", [ligne("claude-opus-5-5", 'je cite "model":"claude-opus-9" dans ma réponse')]);
    const vCite = vuesDe(dCite);
    verifier("vert MS2 : un identifiant cité dans le texte d'une réponse n'est pas lu comme servi", vCite.size === 1 && vCite.has("claude-opus-5-5"));
    verifier("vert MS2 : aucune version lue rend MS2 sans objet, jamais un échec", juger(refOk, new Map()).verdict === "PASS" && statut(juger(refOk, new Map()), "MS2")[0] === "SANS_OBJET");
    verifier("vert MS3 : un re-test dû est dit (AVERT)", statut(juger(refOk, new Map()), "MS3")[0] === "AVERT");
    verifier("vert MS3 : un re-test clos ne se dit plus", statut(juger({ ...refOk, re_test_regle_de_challenge: { statut: "clos", clos_par: "fixture" } }, new Map()), "MS3")[0] === "PASS");
    const fRef = join(tmp, "ref.json");
    writeFileSync(fRef, JSON.stringify(refOk));
    const cli = (args) => spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...args], { encoding: "utf8" });
    const cRouge = cli(["--referentiel", fRef, "--transcripts", dRouge, "--jours", "30", "--json"]);
    let jRouge = null; try { jRouge = JSON.parse(cRouge.stdout); } catch { jRouge = null; }
    verifier("rouge de bout en bout : --referentiel --transcripts --jours --json sur une version inconnue, exit 1", cRouge.status === 1 && jRouge && jRouge.verdict === "FAIL");
    const cVert = cli(["--referentiel", fRef, "--modele", "claude-opus-5-5[1m]", "--json"]);
    let jVert = null; try { jVert = JSON.parse(cVert.stdout); } catch { jVert = null; }
    verifier("vert de bout en bout : --modele sur la génération courante, exit 0", cVert.status === 0 && jVert && jVert.verdict === "PASS");
    verifier("rouge d'usage : une option inconnue rend exit 2", cli(["--inconnue"]).status === 2);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
  for (const c of cas) console.log(`  [${c.ok ? "PASS" : "FAIL"}] ${c.nom}`);
  const ok = cas.filter((c) => c.ok).length;
  console.log(`${NOM} — recette à double sens : ${ok}/${cas.length} PASS`);
  return ok === cas.length ? 0 : 1;
}

const memeFichier = (a, b) => resolve(a).toLowerCase() === resolve(b).toLowerCase();
if (process.argv[1] && memeFichier(fileURLToPath(import.meta.url), process.argv[1])) {
  if (process.argv.includes("--self-test")) process.exit(selfTest());
  const r = executer(process.argv.slice(2));
  console.log(r.sortie);
  process.exit(r.code);
}
