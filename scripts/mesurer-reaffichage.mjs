#!/usr/bin/env node
/**
 * mesurer-reaffichage.mjs — LA PÉRIODE DE MESURE DU CONTRÔLE RÉAFFICHAGE ET SON CRITÈRE DE BASCULE (TF-2690, 22/11/2026).
 *
 * LE FAIT. Le contrôle RÉAFFICHAGE (TF-2672, 16/11/2026) avertit quand le message final d'une demande ne repose pas en entier une décision
 * restée ouverte. Il est avertissant à son entrée, `BLOQUANTES_DATEES` permet de le rendre bloquant, et aucune échéance n'était armée : ni période
 * de mesure, ni critère. Un contrôle avertissant sans mesure reste avertissant pour toujours, ou bascule sans preuve. Le passage en blocage est
 * une décision de l'humain (doctrine) ; ce script rend ce qui l'éclaire, sur le journal du hook de fin de tour (`.claude\hooks-journal.jsonl`,
 * champ `reaffichage` de chaque tour où le contrôle s'applique).
 *
 * LE CRITÈRE, déclaré dans `MESURE_REAFFICHAGE` (hook-restitution.mjs) et lu ici, jamais recopié :
 *   · 14 jours écoulés depuis le début de la mesure (16/11/2026, jour de l'entrée du contrôle) ;
 *   · 20 tours au moins où le contrôle s'applique, de quoi juger ;
 *   · aucune décision réclamée plus de 2 fois dans une même session : c'est le signe d'un faux positif, le cas de D-83 réclamée 6 fois alors qu'elle
 *     était répondue au ledger (TF-2779). Les décisions répondues au ledger ne sont plus réclamées depuis TF-2779 ; une répétition qui subsiste dit
 *     un autre défaut du contrôle.
 * Les trois tenus, la mesure se dit PRÊTE et la bascule se pose à l'humain. Sinon elle se dit EN COURS (avec ce qui manque) ou REFUSÉE (répétitions).
 *
 * Usage : node scripts/mesurer-reaffichage.mjs [--journal <fichier>] [--aujourd-hui AAAA-MM-JJ] [--json]
 * Exit  : 0 mesure rendue (quel que soit son verdict, le critère ne bloque rien) ; 2 journal introuvable ou option invalide.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MESURE_REAFFICHAGE } from "../oracles/hook-restitution.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const JOURNAL_PAR_DEFAUT = join(ICI, "..", ".claude", "hooks-journal.jsonl");
const JOUR = 86_400_000;

/**
 * Pure. `entrees` : les lignes du journal du hook (objets). Rend { verdict: "EN_COURS" | "PRETE" | "REFUSEE", ... } avec les compteurs et ce qui manque.
 * Seules comptent les lignes du hook `restitution` à partir de `depuis`, portant un champ `reaffichage` (le contrôle s'appliquait) ; un journal de recette (`prejuge`) ne compte pas.
 */
export function mesurer(entrees, { aujourdhui = new Date().toISOString().slice(0, 10), mesure = MESURE_REAFFICHAGE } = {}) {
  const depuis = Date.parse(mesure.depuis + "T00:00:00Z");
  const lues = entrees.filter((e) => e && e.hook === "restitution" && e.reaffichage && !e.prejuge && Number.isFinite(Date.parse(e.ts)) && Date.parse(e.ts) >= depuis);
  const echecs = lues.filter((e) => e.reaffichage.verdict === "FAIL");
  // Une décision réclamée plusieurs fois dans une même session : { session, decision, fois }.
  const parSession = new Map();
  for (const e of echecs) for (const n of e.reaffichage.manquantes || []) {
    const cle = `${e.session || "?"}|${n}`;
    parSession.set(cle, (parSession.get(cle) || 0) + 1);
  }
  const repetitions = [...parSession].filter(([, fois]) => fois > mesure.repetitions_max).map(([cle, fois]) => ({ session: cle.split("|")[0], decision: `D-${cle.split("|")[1]}`, fois }));
  const jours = Math.floor((Date.parse(aujourdhui + "T00:00:00Z") - depuis) / JOUR);
  const manque = [];
  if (jours < mesure.jours) manque.push(`${mesure.jours - jours} jour(s) de mesure (${jours} sur ${mesure.jours})`);
  if (lues.length < mesure.tours_min) manque.push(`${mesure.tours_min - lues.length} tour(s) où le contrôle s'applique (${lues.length} sur ${mesure.tours_min})`);
  const verdict = repetitions.length ? "REFUSEE" : manque.length ? "EN_COURS" : "PRETE";
  return { verdict, depuis: mesure.depuis, aujourdhui, jours_ecoules: jours, tours_applicables: lues.length, tours_en_avertissement: echecs.length,
    sessions: new Set(lues.map((e) => e.session)).size, repetitions, manque,
    message: verdict === "PRETE"
      ? "critère tenu : la bascule en blocage peut se poser — c'est une décision de l'humain (doctrine), pas de la session"
      : verdict === "REFUSEE"
        ? `une décision est réclamée plus de ${mesure.repetitions_max} fois dans une même session : faux positif probable, le contrôle ne bascule pas avant sa correction`
        : `mesure en cours — il manque ${manque.join(" et ")}` };
}

/** Lit un journal JSONL ; une ligne illisible est ignorée, comptée. */
export function lireJournal(fichier) {
  const entrees = []; let illisibles = 0;
  for (const l of readFileSync(fichier, "utf8").split(/\r?\n/)) {
    if (!l.trim()) continue;
    try { entrees.push(JSON.parse(l)); } catch { illisibles++; }
  }
  return { entrees, illisibles };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 && i + 1 < args.length ? args[i + 1] : null; };
  const fichier = resolve(valeur("--journal") || JOURNAL_PAR_DEFAUT);
  const aujourdhui = valeur("--aujourd-hui") || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(aujourdhui)) { console.error(`--aujourd-hui attend AAAA-MM-JJ, reçu « ${aujourdhui} »`); process.exit(2); }
  if (!existsSync(fichier)) { console.error(`journal du hook introuvable : ${fichier}`); process.exit(2); }
  const { entrees, illisibles } = lireJournal(fichier);
  const r = { journal: fichier, lignes: entrees.length, illisibles, ...mesurer(entrees, { aujourdhui }) };
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    console.log(`mesure RÉAFFICHAGE depuis le ${r.depuis} : ${r.verdict} — ${r.message}`);
    console.log(`  ${r.tours_applicables} tour(s) où le contrôle s'applique, dont ${r.tours_en_avertissement} en avertissement, sur ${r.sessions} session(s), ${r.jours_ecoules} jour(s) écoulés (${r.lignes} lignes lues, ${r.illisibles} illisible(s))`);
    for (const x of r.repetitions) console.log(`  répétition : ${x.decision} réclamée ${x.fois} fois dans la session ${x.session}`);
  }
}
