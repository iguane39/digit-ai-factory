#!/usr/bin/env node
/**
 * hook-lecons.mjs — LA LEÇON RAPPELÉE AU GESTE QUI LA DÉCLENCHE (TF-2150, décision humaine D-172 (a) du 04/11/2026 ;
 * étude « Apprentissage des erreurs par les produits et la Factory » 20261104b, option O2).
 *
 * LE FAIT. La leçon « heredoc Bash long tronqué, antislash perdus » a été écrite dans la mémoire du poste dès sa
 * première morsure, puis mordue 12 fois : la mémoire se charge à l'ouverture, et rien ne la remet sous les yeux de
 * l'agent au moment du geste. Six classes d'erreur seulement ont un hook PreToolUse dédié (`.claude/settings.json`) ;
 * un hook par classe ne passe pas à 227 classes.
 *
 * CE QUE FAIT CE HOOK. Hook `PreToolUse` UNIQUE sur Bash, PowerShell, Write, Edit et MultiEdit. Il lit la table des
 * leçons du pilot, `references/LECONS.json` (schéma `lecons@1`, résolue depuis l'emplacement de ce fichier), et
 * `forge/LECONS.jsonl` de la racine du projet quand elle existe (les leçons propres d'un produit, même schéma, une
 * par ligne). Pour chaque leçon non suspendue dont un outil et le motif correspondent au geste :
 *   · il VÉRIFIE sa preuve : identifiant présent au registre ou à l'archive du pilot (`todo/TODO.jsonl`,
 *     `todo/TODO-ARCHIVE.jsonl`), ou fichier présent qui contient sa chaîne. Une preuve qui ne se vérifie plus :
 *     la leçon n'est pas servie, et un avertissement le dit sur stderr ;
 *   · statut `rappel` : il ajoute au contexte (`hookSpecificOutput.additionalContext`) un texte de 600 caractères au
 *     plus par leçon, 3 leçons au plus, qui CITE la leçon comme une donnée, jamais comme une consigne ; exit 0 ;
 *   · statut `barriere` : au pilot, REFUS (exit 2, motif et solution préférée sur stderr) ; chez un produit,
 *     AVERTISSEMENT seulement en v1, dans le même contexte : câbler un refus chez un produit est une règle neuve
 *     opposable, avertissement d'abord (même raisonnement que `hook-puits-windows.mjs`) ;
 *   · il écrit une ligne par leçon servie au journal `lecons-rappels.jsonl` (`.claude/` au pilot, `forge/` chez un
 *     produit) : `{ts, session, lecon, statut, outil, geste}`, le geste coupé à 160 caractères. `scripts/lecons.mjs
 *     --recidives` croise ce journal avec `frictions.jsonl` (TF-2141) ; `--appliquer` passe en barrière la leçon
 *     qui récidive après son rappel (« barrière dès la 2e fois », BOUCLE-AMELIORATION.md, section T1).
 *
 * CE QUE LE MOTIF VOIT. `sur: "chemin"` : le `file_path` de l'outil, antislashs changés en `/`, sans distinction de
 * casse (Windows). `sur: "commande"` : la commande, et le champ facultatif `chaines` dit quoi en retirer :
 *   · `retirees` (défaut) : ce qui est CITÉ — chaînes entre guillemets, corps de heredoc, here-strings, commentaires.
 *     Citer `git push | tail` dans un message de commit n'est pas le jouer ;
 *   · `interpretees` : seules les zones que Bash développe restent — guillemets doubles et heredoc à délimiteur nu ;
 *     guillemets simples, heredoc à délimiteur cité et commentaires sont retirés (une leçon sur l'accent grave exécuté) ;
 *   · `gardees` : la commande brute (une leçon sur la forme du heredoc lui-même).
 *
 * QUAND LE TEXTE ARRIVE. Table de décision PreToolUse de la documentation des hooks de Claude Code
 * (https://code.claude.com/docs/en/hooks, relue le 04/11/2026) : `additionalContext` est « added to Claude's context
 * alongside the tool result ». Le rappel accompagne donc le RÉSULTAT du geste : il sert à relire ce résultat et à ne
 * pas refaire le geste. Seul le refus d'une barrière arrête le geste avant son départ.
 *
 * NE BLOQUE JAMAIS SUR SA PROPRE ERREUR. Table illisible, motif invalide, journal impossible à écrire, panne du juge :
 * un message sur stderr et exit 0. La table n'est lue qu'à l'appel ; rien n'est chargé à l'ouverture de session.
 *
 * NON JUGÉ (déclaré). Un geste construit par variable, ou joué par un script dont le texte n'est pas dans la
 * commande ; une erreur de conception sans geste reconnaissable (l'étude l'exclut d'O2) ; la pertinence du rappel
 * pour l'intention du geste, le motif étant lexical ; la date `revue_le`, que juge `scripts/lecons.mjs --verifier` ;
 * l'analyse des guillemets est celle d'un lecteur simple, pas d'un shell : une `$(…)` imbriquée dans des guillemets
 * doubles peut en laisser fuir un morceau, sans autre effet qu'un rappel de trop.
 *
 * Usage : node oracles\hook-lecons.mjs      (stdin : JSON du hook PreToolUse)
 * Exit : 0 laisse passer (rappel éventuel sur stdout, en JSON) · 2 refuse une barrière au pilot (motif sur stderr).
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { racineDuProjet } from "./lib-racine-projet.mjs";

export const PILOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const OUTILS_COMMANDE = new Set(["Bash", "PowerShell"]);
export const OUTILS_CHEMIN = new Set(["Write", "Edit", "MultiEdit"]);
export const OUTILS = new Set([...OUTILS_COMMANDE, ...OUTILS_CHEMIN]);
export const MODES_CHAINES = new Set(["retirees", "interpretees", "gardees"]);
export const STATUTS = new Set(["rappel", "barriere", "suspendue"]);
export const PLAFOND_LECON = 600;
export const MAX_LECONS = 3;
export const PLAFOND_GESTE = 160;

/** Le pilot se reconnaît à son registre, comme dans `hook-gestes-distants.mjs`. */
export const estPilot = (racine) => existsSync(join(racine, "todo", "TODO.jsonl"));

/** Le journal des rappels servis : `.claude/` au pilot, `forge/` chez un produit. */
export const cheminJournal = (racine, auPilot = estPilot(racine)) =>
  join(racine, auPilot ? ".claude" : "forge", "lecons-rappels.jsonl");

// Heredoc Bash : `<<DELIM`, `<<-DELIM`, `<<'DELIM'`, `<<"DELIM"`, `<<\DELIM`, puis le corps jusqu'à la ligne
// qui ne porte que DELIM (ou jusqu'à la fin, s'il n'est pas fermé). Groupes : 1 antislash, 2 guillemet, 3 délimiteur,
// 4 reste de la ligne d'ouverture, 5 corps fermé, 6 corps non fermé. Un délimiteur cité rend le corps LITTÉRAL ;
// un délimiteur nu le fait développer.
const HEREDOC = /(?<!<)<<(?!<)-?[ \t]*(\\?)(["']?)([A-Za-z_][\w.-]*)\2([^\n]*)\n(?:((?:[\s\S]*?\n)?)[ \t]*\3[ \t]*(?=\n|$)|([\s\S]*))/g;
const RANGE = /\u0000(\d+)\u0000/g;

/**
 * La commande telle que le motif la juge. `mode` : `retirees` (défaut), `interpretees` ou `gardees` ;
 * `shell` : `bash` (antislash d'échappement, heredoc) ou `powershell` (accent grave d'échappement, here-strings).
 */
export function nettoyer(commande, mode = "retirees", shell = "bash") {
  const brute = String(commande ?? "");
  if (mode === "gardees") return brute;
  const garderDoubles = mode === "interpretees";
  const ranges = [];
  let s = brute.replace(RANGE, " ");
  if (shell === "powershell") {
    s = s.replace(/<#[\s\S]*?#>/g, " ")
      .replace(/@'[\s\S]*?'@/g, " ")
      .replace(/@"[\s\S]*?"@/g, (m) => (garderDoubles ? m : " "));
  } else {
    s = s.replace(HEREDOC, (_m, oblique, guillemet, _delim, reste, corps, ouvert) => {
      if (!garderDoubles || oblique || guillemet) return `<< ${reste}\n`;
      // Délimiteur nu : Bash développe le corps, et ses guillemets n'y sont pas des guillemets. Le corps est mis de
      // côté pendant l'analyse des chaînes, puis remis tel quel.
      ranges.push(corps ?? ouvert ?? "");
      return `<< ${reste}\n\u0000${ranges.length - 1}\u0000\n`;
    });
  }
  const echap = shell === "powershell" ? "`" : "\\";
  let out = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === echap && i + 1 < s.length) { out += c + s[i + 1]; i += 2; continue; }
    if (c === "#" && (i === 0 || /[\s;|&(]/.test(s[i - 1]))) {
      const fin = s.indexOf("\n", i);
      i = fin < 0 ? s.length : fin;
      continue;
    }
    const ansi = c === "$" && s[i + 1] === "'" && shell !== "powershell";
    if (c === "'" || ansi) {
      let j = i + (ansi ? 2 : 1);
      while (j < s.length && s[j] !== "'") { if (ansi && s[j] === "\\") j++; j++; }
      out += " ";
      i = Math.min(s.length, j + 1);
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      while (j < s.length && s[j] !== '"') { if (s[j] === echap) j++; j++; }
      const fin = Math.min(s.length, j + 1);
      out += garderDoubles ? s.slice(i, fin) : " ";
      i = fin;
      continue;
    }
    out += c;
    i++;
  }
  return ranges.length ? out.replace(RANGE, (_m, n) => ranges[Number(n)]) : out;
}

const COMPILES = new Map();
/** Le motif compilé (mis en cache) ; lève une erreur sur un motif invalide. */
export function compiler(motif, drapeaux = "") {
  const cle = `${drapeaux}/${motif}`;
  if (!COMPILES.has(cle)) COMPILES.set(cle, new RegExp(String(motif), drapeaux));
  return COMPILES.get(cle);
}

/** Ce que le motif d'une leçon juge dans l'entrée de l'outil : la commande ou le chemin, ou null. */
export function sujetDuGeste(entree, sur) {
  const ti = entree?.tool_input || {};
  if (sur === "chemin") return typeof ti.file_path === "string" && ti.file_path ? ti.file_path.replace(/\\/g, "/") : null;
  if (sur === "commande") return typeof ti.command === "string" && ti.command ? ti.command : null;
  return null;
}

/** Vrai si le déclencheur de la leçon correspond au geste. Lève une erreur si le motif est invalide. */
export function correspond(lecon, entree) {
  const d = lecon?.declencheur || {};
  const outil = entree?.tool_name;
  if (!Array.isArray(d.outils) || !d.outils.includes(outil)) return false;
  const sujet = sujetDuGeste(entree, d.sur);
  if (sujet === null) return false;
  if (d.sur === "chemin") return compiler(d.motif, "i").test(sujet);
  const shell = outil === "PowerShell" ? "powershell" : "bash";
  return compiler(d.motif, "").test(nettoyer(sujet, d.chaines || "retirees", shell));
}

/** La table du pilot (JSON). Rend { lecons, erreur }. */
export function chargerTablePilot(chemin) {
  let brut;
  try { brut = readFileSync(chemin, "utf8"); } catch (e) {
    return { lecons: [], erreur: `[hook-lecons] table des leçons introuvable (${chemin}) : ${e.code || e.message} — aucun rappel servi` };
  }
  try {
    const t = JSON.parse(brut);
    if (!t || t.schema !== "lecons@1" || !Array.isArray(t.lecons)) {
      return { lecons: [], erreur: `[hook-lecons] table des leçons hors schéma lecons@1 (${chemin}) — aucun rappel servi` };
    }
    return { lecons: t.lecons, erreur: null };
  } catch (e) {
    return { lecons: [], erreur: `[hook-lecons] table des leçons illisible (${chemin}) : ${String(e.message).slice(0, 160)} — aucun rappel servi` };
  }
}

/** La table d'un produit (JSONL, une leçon par ligne). Une ligne illisible est dite et sautée. */
export function chargerTableProduit(chemin) {
  const lecons = [];
  const erreurs = [];
  let brut = "";
  try { brut = readFileSync(chemin, "utf8"); } catch (e) {
    return { lecons, erreurs: [`[hook-lecons] table du produit illisible (${chemin}) : ${e.code || e.message}`] };
  }
  brut.split(/\r?\n/).forEach((ligne, n) => {
    if (!ligne.trim()) return;
    try { lecons.push(JSON.parse(ligne)); } catch {
      erreurs.push(`[hook-lecons] ${chemin}, ligne ${n + 1} illisible — leçon sautée`);
    }
  });
  return { lecons, erreurs };
}

function lire(chemin, cache) {
  if (cache?.has(chemin)) return cache.get(chemin);
  let texte = null;
  try { texte = readFileSync(chemin, "utf8"); } catch { /* absent : null */ }
  cache?.set(chemin, texte);
  return texte;
}

/**
 * La preuve d'une leçon se vérifie-t-elle encore ? `pilot` porte le registre ; `racineTable` résout le chemin
 * relatif d'une preuve de type fichier (le pilot pour sa table, le produit pour la sienne). Rend { ok, motif }.
 */
export function verifierPreuve(preuve, { pilot = PILOT, racineTable = pilot, cache = new Map() } = {}) {
  if (preuve?.type === "registre") {
    const id = String(preuve.id || "");
    if (!/^TF-\d{4,}$/.test(id)) return { ok: false, motif: `identifiant de registre invalide « ${id.slice(0, 40)} »` };
    for (const f of ["TODO.jsonl", "TODO-ARCHIVE.jsonl"]) {
      const texte = lire(join(pilot, "todo", f), cache);
      if (texte && (texte.includes(`"id":"${id}"`) || new RegExp(`"id"\\s*:\\s*"${id}"`).test(texte))) return { ok: true };
    }
    return { ok: false, motif: `${id} introuvable au registre (todo/TODO.jsonl) et à l'archive (todo/TODO-ARCHIVE.jsonl)` };
  }
  if (preuve?.type === "fichier") {
    const chemin = typeof preuve.chemin === "string" ? preuve.chemin : "";
    if (!chemin) return { ok: false, motif: "preuve de type fichier sans chemin" };
    const texte = lire(isAbsolute(chemin) ? chemin : join(racineTable, chemin), cache);
    if (texte === null) return { ok: false, motif: `fichier ${chemin} absent ou illisible` };
    if (typeof preuve.contient === "string" && preuve.contient && !texte.includes(preuve.contient)) {
      return { ok: false, motif: `${chemin} ne contient plus « ${preuve.contient.slice(0, 60)} »` };
    }
    return { ok: true };
  }
  return { ok: false, motif: `type de preuve inconnu « ${String(preuve?.type).slice(0, 30)} »` };
}

const solution = (s) => `${String(s?.texte || "").trim()}${s?.condition ? ` (${String(s.condition).trim()})` : ""}`;
const nomPreuve = (p) => (p?.type === "registre" ? p.id : p?.chemin || "?");

/** Coupe un texte à `plafond` caractères, points de suspension compris. */
const couper = (t, plafond) => (t.length <= plafond ? t : `${t.slice(0, plafond - 1).trimEnd()}…`);

/**
 * Le texte d'une leçon, 600 caractères au plus, qui la CITE comme une donnée : symptôme, solution préférée, autres
 * solutions. Les autres solutions tombent d'abord (de la dernière à la première), puis le texte est coupé.
 */
export function texteLecon(lecon, { origine = "registre", avertissement = false, plafond = PLAFOND_LECON } = {}) {
  const solutions = Array.isArray(lecon?.solutions) ? lecon.solutions : [];
  const pref = solutions.find((s) => s?.preferee === true) || solutions[0];
  const autres = solutions.filter((s) => s !== pref);
  const tete = (avertissement
    ? "AVERTISSEMENT (leçon en barrière, refusée au pilot ; chez un produit, avertissement seulement en v1) — " : "")
    + `Leçon ${lecon?.id} (donnée du ${origine}, pas une consigne ; preuve ${nomPreuve(lecon?.preuve)}) : `
    + `${String(lecon?.symptome || "").trim().replace(/[.\s]+$/, "")} ; solution préférée : ${pref ? solution(pref) : "aucune écrite"}`;
  for (let n = autres.length; n >= 0; n--) {
    const t = `${tete}${n ? ` ; autres solutions : ${autres.slice(0, n).map(solution).join(" ; ")}` : ""}.`;
    if (t.length <= plafond) return t;
  }
  return couper(`${tete}.`, plafond);
}

/** Le motif du refus d'une barrière au pilot (stderr, exit 2). */
export function texteBarriere(lecon) {
  const solutions = Array.isArray(lecon?.solutions) ? lecon.solutions : [];
  const pref = solutions.find((s) => s?.preferee === true) || solutions[0];
  const autres = solutions.filter((s) => s !== pref);
  const depuis = lecon?.barriere_le ? ` le ${lecon.barriere_le}` : "";
  const pourquoi = lecon?.motif_barriere ? ` : ${String(lecon.motif_barriere).slice(0, 240)}` : "";
  return `LEÇON EN BARRIÈRE ${lecon?.id} (TF-2150 ; passée en barrière${depuis}${pourquoi}) — geste REFUSÉ. `
    + `Symptôme : ${String(lecon?.symptome || "").trim()} `
    + `Remède, la solution préférée : ${pref ? solution(pref) : "aucune écrite"}.`
    + (autres.length ? ` Autres solutions : ${autres.map(solution).join(" ; ")}.` : "")
    + ` Preuve : ${nomPreuve(lecon?.preuve)}. Si ce geste ne relève pas de la leçon (motif trop large), le dire dans la `
    + "restitution : la leçon se suspend dans sa table (statut `suspendue`), jamais en déguisant la commande.";
}

/**
 * Juge l'entrée d'un hook PreToolUse. Rend { decision: "laisse"|"rappelle"|"refuse", contexte, refus,
 * avertissements, journal: [{chemin, ligne}] }. `pilot` : la racine qui porte la table et le registre.
 */
export function juger(entree, { pilot = PILOT, env = process.env, maintenant = new Date() } = {}) {
  const v = { decision: "laisse", contexte: "", refus: "", avertissements: [], journal: [] };
  const outil = entree?.tool_name;
  if (!OUTILS.has(outil)) return v;
  const racine = racineDuProjet(entree?.cwd, env);
  const auPilot = estPilot(racine);

  const tables = [];
  const tp = chargerTablePilot(join(pilot, "references", "LECONS.json"));
  if (tp.erreur) v.avertissements.push(tp.erreur);
  else tables.push({ origine: "registre", racineTable: pilot, lecons: tp.lecons });
  const cheminProduit = join(racine, "forge", "LECONS.jsonl");
  if (existsSync(cheminProduit)) {
    const t = chargerTableProduit(cheminProduit);
    v.avertissements.push(...t.erreurs);
    tables.push({ origine: "registre du produit", racineTable: racine, lecons: t.lecons });
  }

  const cache = new Map();
  const retenues = [];
  const vus = new Set();
  for (const { origine, racineTable, lecons } of tables) {
    for (const lecon of lecons) {
      if (!lecon || typeof lecon !== "object" || lecon.statut === "suspendue" || !STATUTS.has(lecon.statut)) continue;
      let ok = false;
      try { ok = correspond(lecon, entree); } catch (e) {
        v.avertissements.push(`[hook-lecons] ${lecon.id} : motif invalide (${String(e.message).slice(0, 120)}) — leçon ignorée`);
        continue;
      }
      if (!ok) continue;
      if (vus.has(lecon.id)) {
        v.avertissements.push(`[hook-lecons] ${lecon.id} : identifiant déjà servi par une autre table — leçon ignorée`);
        continue;
      }
      const p = verifierPreuve(lecon.preuve, { pilot, racineTable, cache });
      if (!p.ok) {
        v.avertissements.push(`[hook-lecons] ${lecon.id} non servie : sa preuve ne se vérifie plus (${p.motif}) — `
          + "la leçon est à revoir (`node scripts/lecons.mjs --verifier`)");
        continue;
      }
      vus.add(lecon.id);
      retenues.push({ lecon, origine });
    }
  }
  if (!retenues.length) return v;

  // Les barrières d'abord : le plafond de 3 leçons ne doit jamais taire un refus.
  retenues.sort((a, b) => (b.lecon.statut === "barriere") - (a.lecon.statut === "barriere"));
  const servies = retenues.slice(0, MAX_LECONS);
  const sujet = (l) => String(sujetDuGeste(entree, l.declencheur?.sur) || "");
  const ligne = (l) => ({
    ts: maintenant.toISOString(), session: entree?.session_id ?? null, lecon: l.id, statut: l.statut, outil,
    geste: sujet(l).replace(/\s+/g, " ").trim().slice(0, PLAFOND_GESTE),
  });
  const journal = cheminJournal(racine, auPilot);

  const barrieres = servies.filter((r) => r.lecon.statut === "barriere");
  if (auPilot && barrieres.length) {
    v.decision = "refuse";
    v.refus = barrieres.map((r) => texteBarriere(r.lecon)).join("\n");
    v.journal = barrieres.map((r) => ({ chemin: journal, ligne: ligne(r.lecon) }));
    return v;
  }
  const textes = servies.map((r) => texteLecon(r.lecon, { origine: r.origine, avertissement: r.lecon.statut === "barriere" }));
  if (retenues.length > MAX_LECONS) {
    textes.push(`(${retenues.length - MAX_LECONS} autre(s) leçon(s) correspondent aussi : ${retenues.slice(MAX_LECONS).map((r) => r.lecon.id).join(", ")}.)`);
  }
  v.decision = "rappelle";
  v.contexte = textes.join("\n");
  v.journal = servies.map((r) => ({ chemin: journal, ligne: ligne(r.lecon) }));
  return v;
}

/** Joue le hook sur l'entrée brute : rend { code, stdout, stderr } et écrit le journal. Ne lève jamais. */
export function executer(brut, options = {}) {
  let entree = {};
  try { entree = JSON.parse(brut || "{}"); } catch { return { code: 0, stdout: "", stderr: "" }; }
  let v;
  try { v = juger(entree, options); } catch (e) {
    return { code: 0, stdout: "", stderr: `[hook-lecons] panne du juge, geste laissé : ${String(e?.message || e).slice(0, 200)}\n` };
  }
  let stderr = v.avertissements.map((a) => `${a}\n`).join("");
  for (const { chemin, ligne } of v.journal) {
    if (!existsSync(dirname(chemin))) { stderr += `[hook-lecons] journal non écrit : dossier ${dirname(chemin)} absent\n`; continue; }
    try { appendFileSync(chemin, `${JSON.stringify(ligne)}\n`, "utf8"); } catch (e) {
      stderr += `[hook-lecons] journal non écrit (${chemin}) : ${e.code || e.message}\n`;
    }
  }
  if (v.decision === "refuse") return { code: 2, stdout: "", stderr: `${stderr}${v.refus}\n` };
  if (v.decision === "rappelle") {
    return { code: 0, stdout: `${JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: v.contexte } })}\n`, stderr };
  }
  return { code: 0, stdout: "", stderr };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  let brut = "";
  try { brut = readFileSync(0, "utf8"); } catch { /* pas de stdin */ }
  const r = executer(brut);
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  process.exit(r.code);
}
