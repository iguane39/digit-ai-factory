#!/usr/bin/env node
/**
 * lecons.mjs — LA TABLE DES LEÇONS JUGÉE, ET LA LEÇON QUI RÉCIDIVE APRÈS SON RAPPEL PASSÉE EN BARRIÈRE (TF-2150,
 * décision humaine D-172 (a) du 04/11/2026 ; règle « barrière dès la 2e fois », BOUCLE-AMELIORATION.md, section T1).
 *
 * LE FAIT. `oracles/hook-lecons.mjs` rappelle une leçon au geste qui la déclenche et écrit chaque rappel servi au
 * journal `lecons-rappels.jsonl` ; le hook de fin de tour écrit les frictions du tour (correction humaine, refus de
 * hook, oracle en échec) au journal `frictions.jsonl` (TF-2141). Une leçon rappelée puis suivie d'une friction dans la
 * même session a récidivé : un texte de plus n'y suffit pas, il lui faut une barrière (T1).
 *
 * TROIS MODES.
 *   --verifier   juge la table du pilot (`references/LECONS.json`) et, à la racine d'un produit, `forge/LECONS.jsonl` :
 *     V1  schéma `lecons@1` : `schema`, `version` x.y.z, `date` AAAA-MM-JJ, tableau `lecons` ; chez un produit, une
 *         leçon JSON par ligne ;
 *     V2  identifiant `L-NNN`, unique, sans collision entre la table du pilot et celle du produit ;
 *     V3  classe existante de `todo/CLASSES.json` ;
 *     V4  symptôme et source écrits ;
 *     V5  déclencheur : outils connus, `sur` (`commande`, `chemin` ou `agent`, ce dernier pour les outils Agent et Task,
 *         TF-1947) accordé aux outils, `chaines` connu, motif qui se compile ;
 *     V6  solutions : au moins une, chacune avec son texte et sa condition, une seule préférée ;
 *     V7  preuve vérifiable : identifiant au registre ou à l'archive du pilot, ou fichier au chemin RELATIF présent qui
 *         contient sa chaîne (un chemin absolu ne vaut que sur un poste) ;
 *     V8  portée : `generique` dans la table du pilot, `produit` dans celle d'un produit ;
 *     V9  statut `rappel`, `barriere` ou `suspendue` ; une barrière porte `barriere_le` et `motif_barriere` ;
 *     V10 `revue_le` : une date valide, non dépassée au jour du jugement (`--au AAAA-MM-JJ`, défaut : aujourd'hui).
 *   --recidives  (lecture seule) croise les deux journaux de la racine (`.claude/` au pilot, `forge/` chez un produit) :
 *     une leçon récidive quand, dans une session où elle a été rappelée (ligne au statut `rappel`), une friction de
 *     la même session SUIT le rappel ; une friction qui nomme son outil ne compte que pour une leçon rappelée sur ce
 *     même outil. Sans `frictions.jsonl`, il le DIT et ne conclut rien (exit 2).
 *   --appliquer  passe ces leçons de `rappel` à `barriere` dans la table qui les porte, en y écrivant `barriere_le`
 *     (la date du jour) et `motif_barriere` (la session, le rappel, la friction) ; la version de la table monte d'un
 *     cran mineur et sa date devient celle du jour. La table réécrite est rejugée : si elle compte plus de constats
 *     qu'avant, elle est rétablie à l'octet près et rien n'est passé en barrière (exit 1).
 *
 * NON JUGÉ : voir `NON_JUGE`, rendu par `--json`.
 *
 * Usage : node scripts/lecons.mjs --verifier  [--racine <dossier>] [--pilot <dossier>] [--au AAAA-MM-JJ] [--json]
 *         node scripts/lecons.mjs --recidives [--racine <dossier>] [--pilot <dossier>] [--json]
 *         node scripts/lecons.mjs --appliquer [--racine <dossier>] [--pilot <dossier>] [--au AAAA-MM-JJ]
 * Exit : 0 conforme, ou rien à passer en barrière · 1 constat de --verifier, ou réécriture annulée · 2 rien à conclure
 *        (`frictions.jsonl` absent).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  MODES_CHAINES, OUTILS, OUTILS_AGENT, OUTILS_CHEMIN, OUTILS_COMMANDE, PILOT, STATUTS, chargerTableProduit, estPilot, verifierPreuve,
} from "../oracles/hook-lecons.mjs";
import { racineDuProjet } from "../oracles/lib-racine-projet.mjs";

export const NON_JUGE = [
  "la JUSTESSE d'une leçon : V7 vérifie que sa preuve existe encore, pas qu'elle établit ce que dit le symptôme",
  "la PRÉCISION d'un motif sur les gestes réels : elle se mesure sur les transcriptions (champ facultatif `mesure`), pas ici",
  "le lien de CAUSE entre un rappel et la friction qui le suit : --recidives compte une friction postérieure de la même session, même outil quand elle le nomme ; une friction sans rapport avec la leçon compte aussi",
  "les récidives d'une leçon générique chez les AUTRES produits : --recidives lit les journaux d'une seule racine",
];

const JOUR = /^\d{4}-\d{2}-\d{2}$/;
const dateValide = (d) => typeof d === "string" && JOUR.test(d) && new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) === d;
const ecrit = (x) => typeof x === "string" && x.trim().length > 0;
const aujourdHui = () => new Date().toISOString().slice(0, 10);

/** Les chemins des journaux d'une racine. */
export function journaux(racine) {
  const dossier = estPilot(racine) ? ".claude" : "forge";
  return { rappels: join(racine, dossier, "lecons-rappels.jsonl"), frictions: join(racine, dossier, "frictions.jsonl") };
}

/** Les tables à juger : celle du pilot, et celle du produit quand la racine en porte une. */
export function lireTables({ pilot = PILOT, racine = pilot } = {}) {
  const tables = [];
  const cheminPilot = join(pilot, "references", "LECONS.json");
  let brut = null;
  try { brut = readFileSync(cheminPilot, "utf8"); } catch { /* absente : V1 le dira */ }
  let contenu = null, erreur = null;
  if (brut === null) erreur = "table absente";
  else { try { contenu = JSON.parse(brut); } catch (e) { erreur = `JSON illisible (${String(e.message).slice(0, 120)})`; } }
  tables.push({ chemin: cheminPilot, portee: "generique", racineTable: pilot, brut, contenu, erreur, lecons: Array.isArray(contenu?.lecons) ? contenu.lecons : [] });
  const cheminProduit = join(racine, "forge", "LECONS.jsonl");
  if (resolve(racine) !== resolve(pilot) && existsSync(cheminProduit)) {
    const t = chargerTableProduit(cheminProduit);
    tables.push({ chemin: cheminProduit, portee: "produit", racineTable: racine, brut: readFileSync(cheminProduit, "utf8"), erreurs: t.erreurs, lecons: t.lecons });
  }
  return tables;
}

/** Juge les tables (règles V1 à V10). Rend { verdict, au, tables, constats }. */
export function verifier({ pilot = PILOT, racine = pilot, au = aujourdHui() } = {}) {
  const tables = lireTables({ pilot, racine });
  const constats = [];
  const dire = (regle, t, l, message) => constats.push({ regle, table: relative(pilot, t.chemin) || t.chemin, lecon: l?.id ?? null, message });
  let classes = null;
  try { classes = new Set(JSON.parse(readFileSync(join(pilot, "todo", "CLASSES.json"), "utf8")).classes.map((c) => c.cle)); } catch {
    constats.push({ regle: "V3", table: "todo/CLASSES.json", lecon: null, message: "référentiel des classes illisible : aucune classe ne peut être jugée" });
  }
  const idsPilot = new Set();
  const cache = new Map();
  for (const t of tables) {
    if (t.portee === "generique") {
      if (t.erreur) { dire("V1", t, null, t.erreur); continue; }
      const c = t.contenu;
      if (c?.schema !== "lecons@1") dire("V1", t, null, `schéma « ${c?.schema} » au lieu de « lecons@1 »`);
      if (!/^\d+\.\d+\.\d+$/.test(String(c?.version))) dire("V1", t, null, `version « ${c?.version} » hors forme x.y.z`);
      if (!dateValide(c?.date)) dire("V1", t, null, `date « ${c?.date} » hors forme AAAA-MM-JJ`);
      if (!Array.isArray(c?.lecons)) { dire("V1", t, null, "tableau `lecons` absent"); continue; }
    } else {
      for (const e of t.erreurs || []) dire("V1", t, null, e.replace(/^\[hook-lecons\] /, ""));
    }
    const vus = new Set();
    for (const l of t.lecons) {
      if (!l || typeof l !== "object") { dire("V1", t, null, "une leçon n'est pas un objet"); continue; }
      // V2 — l'identifiant.
      if (!/^L-\d{3,}$/.test(String(l.id))) dire("V2", t, l, `identifiant « ${l.id} » hors forme L-NNN`);
      if (vus.has(l.id)) dire("V2", t, l, `identifiant ${l.id} en double dans la table`);
      if (t.portee === "produit" && idsPilot.has(l.id)) dire("V2", t, l, `identifiant ${l.id} déjà pris par la table du pilot`);
      vus.add(l.id);
      if (t.portee === "generique") idsPilot.add(l.id);
      // V3 — la classe.
      if (classes && !classes.has(l.classe)) dire("V3", t, l, `classe « ${l.classe} » absente de todo/CLASSES.json`);
      // V4 — symptôme et source.
      if (!ecrit(l.symptome)) dire("V4", t, l, "symptôme non écrit");
      if (!ecrit(l.source)) dire("V4", t, l, "source non écrite");
      // V5 — le déclencheur.
      const d = l.declencheur || {};
      const outils = Array.isArray(d.outils) ? d.outils : [];
      if (!outils.length) dire("V5", t, l, "déclencheur sans outil");
      const inconnus = outils.filter((o) => !OUTILS.has(o));
      if (inconnus.length) dire("V5", t, l, `outil(s) inconnu(s) : ${inconnus.join(", ")} (attendus : ${[...OUTILS].join(", ")})`);
      if (d.sur === "commande") {
        const hors = outils.filter((o) => OUTILS.has(o) && !OUTILS_COMMANDE.has(o));
        if (hors.length) dire("V5", t, l, `\`sur: commande\` avec un outil sans commande : ${hors.join(", ")}`);
        if (d.chaines !== undefined && !MODES_CHAINES.has(d.chaines)) dire("V5", t, l, `\`chaines\` « ${d.chaines} » inconnu (attendus : ${[...MODES_CHAINES].join(", ")})`);
      } else if (d.sur === "chemin") {
        const hors = outils.filter((o) => OUTILS.has(o) && !OUTILS_CHEMIN.has(o));
        if (hors.length) dire("V5", t, l, `\`sur: chemin\` avec un outil sans chemin : ${hors.join(", ")}`);
        if (d.chaines !== undefined) dire("V5", t, l, "`chaines` ne vaut que pour `sur: commande`");
      } else if (d.sur === "agent") {
        const hors = outils.filter((o) => OUTILS.has(o) && !OUTILS_AGENT.has(o));
        if (hors.length) dire("V5", t, l, `\`sur: agent\` avec un outil qui ne lance pas d'agent : ${hors.join(", ")}`);
        if (d.chaines !== undefined) dire("V5", t, l, "`chaines` ne vaut que pour `sur: commande`");
      } else dire("V5", t, l, `\`sur\` « ${d.sur} » au lieu de « commande », « chemin » ou « agent »`);
      if (!ecrit(d.motif)) dire("V5", t, l, "motif non écrit");
      else { try { new RegExp(d.motif, d.sur === "chemin" || d.sur === "agent" ? "i" : ""); } catch (e) { dire("V5", t, l, `motif invalide : ${String(e.message).slice(0, 120)}`); } }
      // V6 — les solutions.
      const sols = Array.isArray(l.solutions) ? l.solutions : [];
      if (!sols.length) dire("V6", t, l, "aucune solution");
      sols.forEach((s, k) => {
        if (!ecrit(s?.texte)) dire("V6", t, l, `solution ${k + 1} sans texte`);
        if (!ecrit(s?.condition)) dire("V6", t, l, `solution ${k + 1} sans condition d'emploi`);
        if (typeof s?.preferee !== "boolean") dire("V6", t, l, `solution ${k + 1} : \`preferee\` n'est pas un booléen`);
      });
      const pref = sols.filter((s) => s?.preferee === true).length;
      if (sols.length && pref !== 1) dire("V6", t, l, `${pref} solution(s) préférée(s) au lieu d'une seule`);
      // V7 — la preuve.
      if (l.preuve?.type === "fichier" && typeof l.preuve.chemin === "string" && isAbsolute(l.preuve.chemin)) {
        dire("V7", t, l, `preuve au chemin absolu ${l.preuve.chemin} : elle ne vaut que sur un poste, un chemin relatif à la racine de la table est attendu`);
      } else {
        const p = verifierPreuve(l.preuve, { pilot, racineTable: t.racineTable, cache });
        if (!p.ok) dire("V7", t, l, `preuve qui ne se vérifie pas : ${p.motif}`);
      }
      // V8 — la portée.
      if (l.portee !== t.portee) dire("V8", t, l, `portée « ${l.portee} » au lieu de « ${t.portee} » dans cette table`);
      // V9 — le statut.
      if (!STATUTS.has(l.statut)) dire("V9", t, l, `statut « ${l.statut} » inconnu (attendus : ${[...STATUTS].join(", ")})`);
      if (l.statut === "barriere") {
        if (!dateValide(l.barriere_le)) dire("V9", t, l, "barrière sans date `barriere_le` valide");
        if (!ecrit(l.motif_barriere)) dire("V9", t, l, "barrière sans `motif_barriere`");
      }
      // V10 — la date de revue.
      if (!dateValide(l.revue_le)) dire("V10", t, l, `revue_le « ${l.revue_le} » hors forme AAAA-MM-JJ`);
      else if (l.revue_le < au) dire("V10", t, l, `revue_le ${l.revue_le} dépassée au ${au} : la leçon est à revoir`);
    }
  }
  return { verdict: constats.length ? "FAIL" : "PASS", au, tables: tables.map((t) => ({ chemin: relative(pilot, t.chemin) || t.chemin, lecons: t.lecons.length })), constats };
}

function lireJournal(chemin) {
  if (!existsSync(chemin)) return null;
  const lignes = [];
  let illisibles = 0;
  for (const l of readFileSync(chemin, "utf8").split(/\r?\n/)) {
    if (!l.trim()) continue;
    try { lignes.push(JSON.parse(l)); } catch { illisibles++; }
  }
  return { lignes, illisibles };
}

/** Croise rappels et frictions (lecture seule). Rend { journaux, absent, recidives: [{ id, statut, table, preuves }] }. */
export function recidives({ pilot = PILOT, racine = pilot } = {}) {
  const j = journaux(racine);
  const rappels = lireJournal(j.rappels);
  const frictions = lireJournal(j.frictions);
  const base = { journaux: j, lus: { rappels: rappels?.lignes.length ?? null, frictions: frictions?.lignes.length ?? null }, illisibles: (rappels?.illisibles || 0) + (frictions?.illisibles || 0) };
  if (!frictions) return { ...base, absent: "frictions", recidives: [] };
  if (!rappels) return { ...base, absent: "rappels", recidives: [] };
  const tables = lireTables({ pilot, racine });
  const ou = new Map();
  for (const t of tables) for (const l of t.lecons) if (l?.id && !ou.has(l.id)) ou.set(l.id, { statut: l.statut, table: t });
  const instant = (ts) => { const n = Date.parse(ts); return Number.isNaN(n) ? null : n; };
  const parLecon = new Map();
  for (const r of rappels.lignes) {
    if (r?.statut !== "rappel" || !r.lecon || !r.session) continue;
    const t0 = instant(r.ts);
    if (t0 === null) continue;
    const suite = frictions.lignes
      .filter((f) => f?.session === r.session && instant(f.ts) !== null && instant(f.ts) > t0 && (!f.outil || f.outil === r.outil))
      .sort((a, b) => instant(a.ts) - instant(b.ts))[0];
    if (!suite) continue;
    const preuves = parLecon.get(r.lecon) || [];
    if (!preuves.some((p) => p.session === r.session)) {
      preuves.push({ session: r.session, rappel_ts: r.ts, outil: r.outil, friction: { type: suite.type, ts: suite.ts, extrait: String(suite.extrait || "").slice(0, 200), outil: suite.outil ?? null } });
    }
    parLecon.set(r.lecon, preuves);
  }
  const liste = [...parLecon.entries()].map(([id, preuves]) => ({
    id, statut: ou.get(id)?.statut ?? "absente de la table", table: ou.has(id) ? (relative(pilot, ou.get(id).table.chemin) || ou.get(id).table.chemin) : null, preuves,
  })).sort((a, b) => a.id.localeCompare(b.id));
  return { ...base, absent: null, recidives: liste };
}

const montee = (v) => { const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(v)); return m ? `${m[1]}.${Number(m[2]) + 1}.0` : v; };
const motifDe = (r) => {
  const p = r.preuves[0];
  return `récidive après rappel (« barrière dès la 2e fois », BOUCLE-AMELIORATION.md, section T1) : session ${String(p.session).slice(0, 12)}, `
    + `rappel du ${p.rappel_ts} sur ${p.outil}, puis ${p.friction.type} du ${p.friction.ts}`
    + (p.friction.extrait ? ` « ${p.friction.extrait.slice(0, 120)} »` : "")
    + (r.preuves.length > 1 ? ` ; ${r.preuves.length - 1} autre(s) session(s)` : "");
};

/** Passe en barrière les leçons qui récidivent. Rend { absent, passees, annulee, tables }. */
export function appliquer({ pilot = PILOT, racine = pilot, au = aujourdHui() } = {}) {
  const rec = recidives({ pilot, racine });
  if (rec.absent) return { ...rec, passees: [], annulee: false };
  const aPasser = rec.recidives.filter((r) => r.statut === "rappel");
  if (!aPasser.length) return { ...rec, passees: [], annulee: false };
  const avant = verifier({ pilot, racine, au }).constats.length;
  const tables = lireTables({ pilot, racine });
  const touchees = [];
  for (const t of tables) {
    const ids = new Set(aPasser.filter((r) => t.lecons.some((l) => l?.id === r.id)).map((r) => r.id));
    if (!ids.size) continue;
    for (const l of t.lecons) {
      if (!ids.has(l?.id) || l.statut !== "rappel") continue;
      l.statut = "barriere";
      l.barriere_le = au;
      l.motif_barriere = motifDe(aPasser.find((r) => r.id === l.id));
    }
    if (t.portee === "generique") {
      const versionAvant = t.contenu.version;
      t.contenu.version = montee(t.contenu.version);
      t.contenu.date = au;
      writeFileSync(t.chemin, `${JSON.stringify(t.contenu, null, 2)}\n`, "utf8");
      touchees.push({ t, ids: [...ids], versions: `${versionAvant} → ${t.contenu.version}` });
    } else {
      writeFileSync(t.chemin, t.lecons.map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");
      touchees.push({ t, ids: [...ids], versions: null });
    }
  }
  const apres = verifier({ pilot, racine, au });
  if (apres.constats.length > avant) {
    for (const { t } of touchees) writeFileSync(t.chemin, t.brut, "utf8");
    return { ...rec, passees: [], annulee: true, constats: apres.constats };
  }
  return { ...rec, passees: touchees.flatMap(({ t, ids, versions }) => ids.map((id) => ({ id, table: relative(pilot, t.chemin) || t.chemin, versions }))), annulee: false, verdict_apres: apres.verdict };
}

function option(args, nom) { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : undefined; }

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  const pilot = resolve(option(args, "--pilot") || PILOT);
  const racine = resolve(option(args, "--racine") || racineDuProjet(process.cwd()));
  const au = option(args, "--au") || aujourdHui();
  const json = args.includes("--json");
  if (!dateValide(au)) { console.error(`lecons : --au « ${au} » hors forme AAAA-MM-JJ`); process.exit(1); }
  if (args.includes("--verifier")) {
    const v = verifier({ pilot, racine, au });
    if (json) console.log(JSON.stringify({ ...v, non_juge: NON_JUGE }, null, 1));
    else {
      for (const c of v.constats) console.log(`  [${c.regle}] ${c.lecon ?? "(table)"} — ${c.table} : ${c.message}`);
      console.log(`lecons --verifier : ${v.verdict} — ${v.tables.map((t) => `${t.chemin} (${t.lecons} leçon(s))`).join(", ")}, jugé au ${au}, ${v.constats.length} constat(s)`);
    }
    process.exit(v.verdict === "PASS" ? 0 : 1);
  }
  if (args.includes("--recidives") || args.includes("--appliquer")) {
    const appl = args.includes("--appliquer");
    const r = appl ? appliquer({ pilot, racine, au }) : recidives({ pilot, racine });
    if (json) console.log(JSON.stringify(r, null, 1));
    const mode = appl ? "--appliquer" : "--recidives";
    if (r.absent === "frictions") {
      if (!json) console.log(`lecons ${mode} : RIEN À CONCLURE — ${r.journaux.frictions} absent : le relevé des frictions du tour (TF-2141) n'y a rien écrit ; aucune récidive n'est conclue, dans un sens ni dans l'autre${appl ? ", et rien n'est passé en barrière" : ""}.`);
      process.exit(2);
    }
    if (r.absent === "rappels") {
      if (!json) console.log(`lecons ${mode} : aucun rappel servi — ${r.journaux.rappels} absent ; aucune leçon à examiner.`);
      process.exit(0);
    }
    if (!json) {
      console.log(`lecons ${mode} — rappels : ${r.journaux.rappels} (${r.lus.rappels} ligne(s)) ; frictions : ${r.journaux.frictions} (${r.lus.frictions} ligne(s))${r.illisibles ? ` ; ${r.illisibles} ligne(s) illisible(s) sautée(s)` : ""}`);
      for (const x of r.recidives) {
        const p = x.preuves[0];
        console.log(`  ${x.id} (${x.statut}) : récidive dans ${x.preuves.length} session(s) — session ${String(p.session).slice(0, 12)} : rappel ${p.rappel_ts} (${p.outil}), puis ${p.friction.type} ${p.friction.ts}${p.friction.extrait ? ` « ${p.friction.extrait.slice(0, 100)} »` : ""}`);
      }
      const aPasser = r.recidives.filter((x) => x.statut === "rappel").map((x) => x.id);
      if (!appl) console.log(aPasser.length ? `lecons --recidives : ${aPasser.length} leçon(s) à passer en barrière : ${aPasser.join(", ")} (node scripts/lecons.mjs --appliquer)` : "lecons --recidives : aucune leçon au statut rappel n'a récidivé");
      else if (r.annulee) console.log(`lecons --appliquer : RÉÉCRITURE ANNULÉE — la table rejugée compte plus de constats qu'avant ; rien n'est passé en barrière :\n${r.constats.map((c) => `  [${c.regle}] ${c.lecon ?? "(table)"} : ${c.message}`).join("\n")}`);
      else console.log(r.passees.length ? `lecons --appliquer : ${r.passees.length} leçon(s) passée(s) en barrière — ${r.passees.map((p) => `${p.id} (${p.table}${p.versions ? `, ${p.versions}` : ""})`).join(", ")} ; table rejugée : ${r.verdict_apres}` : "lecons --appliquer : aucune leçon au statut rappel n'a récidivé, rien n'est changé");
    }
    process.exit(appl && r.annulee ? 1 : 0);
  }
  console.error("Usage : node scripts/lecons.mjs --verifier | --recidives | --appliquer  [--racine <dossier>] [--pilot <dossier>] [--au AAAA-MM-JJ] [--json]");
  process.exit(1);
}
