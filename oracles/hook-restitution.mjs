#!/usr/bin/env node
/**
 * hook-restitution.mjs — hook `Stop` de Claude Code : le message final d'un tour de TRAVAIL
 * est jugé par `oracle-synthese` (gabarits\RESTITUTION.md, S1-S10) AVANT d'être accepté.
 * S'il échoue, l'arrêt est refusé et l'assistant reçoit les règles en défaut : il réécrit.
 *
 * Pourquoi un hook (R-44, mandat humain du 20/08 — « plusieurs règles ne sont toujours pas
 * appliquées : le format de sortie, les indices sur les décisions et prochaines actions ») :
 * la consigne existait depuis le 13/08, l'oracle depuis le 14/08 — déclaré « informatif et
 * non bloquant ». Une règle qu'aucun mécanisme n'exécute décore. Ce hook est le mécanisme.
 *
 * Entrée (stdin, JSON Claude Code) : { session_id, transcript_path, stop_hook_active }.
 * Sortie : rien (exit 0) = arrêt accepté · {"decision":"block","reason":…} = réécrire.
 * Garde anti-boucle : si `stop_hook_active` est vrai (le hook a déjà refusé une fois dans ce
 * tour), l'arrêt est accepté — une seconde réécriture n'est pas imposée, le verdict est journalisé.
 *
 * Ce qui est un tour de TRAVAIL (et donc une restitution) : au moins une écriture (Write, Edit,
 * MultiEdit, NotebookEdit) ou au moins quatre commandes (Bash, PowerShell) depuis le dernier
 * message humain. Un tour de lecture ou de conversation n'est pas jugé.
 */
import { readFileSync, writeFileSync, mkdtempSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const ORACLE = join(ICI, "oracle-synthese.mjs");
const ECRITURES = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);
const COMMANDES = new Set(["Bash", "PowerShell"]);

function lireStdin() {
  try { return JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { return {}; }
}

export function analyserTranscript(texte) {
  const entrees = texte.split(/\r?\n/).filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter((e) => e && !e.isSidechain);
  const contenu = (e) => { const c = e.message?.content; return Array.isArray(c) ? c : typeof c === "string" ? [{ type: "text", text: c }] : []; };
  const estHumain = (e) => e.type === "user" && !e.isMeta && contenu(e).some((b) => b.type === "text") && !contenu(e).some((b) => b.type === "tool_result");
  let debut = -1;
  for (let i = entrees.length - 1; i >= 0; i--) if (estHumain(entrees[i])) { debut = i; break; }
  const tour = entrees.slice(debut + 1);
  let ecritures = 0, commandes = 0, dernierTexte = "";
  for (const e of tour) {
    if (e.type !== "assistant") continue;
    const blocs = contenu(e);
    for (const b of blocs) {
      if (b.type === "tool_use") { if (ECRITURES.has(b.name)) ecritures++; else if (COMMANDES.has(b.name)) commandes++; }
    }
    const textes = blocs.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    if (textes) dernierTexte = textes;
  }
  return { travail: ecritures >= 1 || commandes >= 4, ecritures, commandes, dernierTexte };
}

export function juger(texte) {
  const dir = mkdtempSync(join(tmpdir(), "restitution-"));
  const f = join(dir, "message.md");
  writeFileSync(f, texte, "utf8");
  const r = spawnSync(process.execPath, [ORACLE, f], { encoding: "utf8" });
  let rapport = {};
  try { rapport = JSON.parse(r.stdout); } catch { /* jugé par le code */ }
  return { code: r.status, fails: (rapport.findings || []).filter((x) => x.statut === "FAIL") };
}

// SÉVÉRITÉS (22/08, retour humain : « le prompt de résultat s'affiche 2 fois »). Un hook `Stop`
// juge APRÈS l'affichage : refuser force une réécriture, et la version refusée RESTE à l'écran.
// Le lecteur relit alors une restitution entière pour un défaut de détail — mesuré au journal :
// les trois refus en session réelle portaient tous sur S8 (une puce sans preuve), jamais sur la
// structure. Le gate reste, il devient proportionné :
//   · BLOQUANT — la restitution est inutilisable sans ça : blocs absents (S1), verdict non
//     factuel (S3), décision sans choix fermé (S4), actions non classées (S6). Le doublon est
//     alors justifié : mieux vaut lire deux fois qu'agir sur une restitution qu'on ne peut pas
//     utiliser.
//   · AVERTISSEMENT — tout le reste (S2, S5, S7, S8, S9, S10) : dit en une ligne sous la
//     réponse, journalisé, jamais réécrit. Une preuve manquante sur une puce ne vaut pas de
//     faire relire huit blocs.
//   · S11 à S14 (v2.6.0, 22/08) entrent en AVERTISSEMENT par le même raisonnement, et c'est
//     délibéré : une action `auto_ia` sans motif, une action humaine sans sa raison ou sans son
//     chemin rendent la liste MOINS UTILE, jamais illisible — le doublon d'affichage qu'un
//     blocage provoque coûterait plus que le défaut qu'il dénonce. Elles se durciront quand le
//     corpus sera propre, exactement comme la v2.0.0 est restée informative avant de bloquer.
const BLOQUANTES = new Set(["S1", "S3", "S4", "S6"]);

const RAPPEL = "Réécris ta réponse finale au format gabarits\\RESTITUTION.md : bloc 0 « synthèse d'ouverture » en langage commanditaire (≥ 20 mots, sans identifiant, chemin ni sha — l'état, ce que ça change, ce qui est attendu du lecteur), puis les 8 blocs numérotés, aucun omis (un bloc vide se dit en une ligne) : 1 en-tête (quoi · sur quoi · date ET heure avec fuseau + durée · qui avec version) · 2 verdict en une ligne FACTUEL (un chiffre, un compteur) · 3 décisions attendues de l'humain, EN TÊTE, en choix fermé (a)/(b)/(c) avec coût, exclusion, recommandation et option par défaut — ou « rien n'attend de décision » · 4 traité, chaque puce avec sa preuve (oracle, verdict, chiffre) · 5 non traité, chaque puce avec son motif · 6 écarts à la lettre (« vous avez demandé → j'ai fait → pourquoi », ou « aucun écart ») · 7 risques (énoncé + signal + parade) · 8 prochaines actions classées par acteur (auto_ia / manuelle_dev / manuelle_utilisateur) ET par ordre justifié. Puces ≤ 2 niveaux. Effort en complexité × durée, jamais en jours.";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const entree = lireStdin();
  const chemin = entree.transcript_path;
  if (!chemin || !existsSync(chemin)) process.exit(0); // rien à juger sans transcript
  const { travail, ecritures, commandes, dernierTexte } = analyserTranscript(readFileSync(chemin, "utf8"));
  if (!travail || !dernierTexte) process.exit(0);
  const { code, fails } = juger(dernierTexte);
  const bloquants = fails.filter((f) => BLOQUANTES.has(f.regle));
  const avertissements = fails.filter((f) => !BLOQUANTES.has(f.regle));
  const journal = join(ICI, "..", ".claude", "hooks-journal.jsonl");
  try {
    mkdirSync(dirname(journal), { recursive: true });
    appendFileSync(journal, JSON.stringify({
      ts: new Date().toISOString(), hook: "restitution", session: entree.session_id, ecritures, commandes,
      verdict: code === 0 ? "PASS" : (bloquants.length ? "FAIL" : "AVERTISSEMENT"),
      regles: fails.map((f) => f.regle), bloquantes: bloquants.map((f) => f.regle),
      deja_refuse: !!entree.stop_hook_active,
    }) + "\n");
  } catch { /* journal facultatif */ }
  if (code === 0) process.exit(0);
  // Avertissements seuls : dits sous la réponse, jamais réécrits — pas de doublon à l'écran.
  if (!bloquants.length) {
    console.log(JSON.stringify({
      systemMessage: `[restitution — R-44] avertissement${avertissements.length > 1 ? "s" : ""} non bloquant${avertissements.length > 1 ? "s" : ""} : ` +
        avertissements.map((f) => `${f.regle} — ${f.message}`).join(" · ") +
        " (structure conforme : rien n'est réécrit, le verdict est journalisé)",
    }));
    process.exit(0);
  }
  if (entree.stop_hook_active) process.exit(0); // déjà refusé une fois : on ne boucle pas, le verdict est journalisé
  const motifs = bloquants.map((f) => `${f.regle} — ${f.message}`).join("\n");
  const enPlus = avertissements.length ? `\n(à corriger au passage, non bloquant : ${avertissements.map((f) => f.regle).join(", ")})` : "";
  console.log(JSON.stringify({ decision: "block", reason: `[hook restitution — R-44] oracle-synthese FAIL BLOQUANT sur ta réponse finale :\n${motifs}${enPlus}\n\n${RAPPEL}` }));
  process.exit(0);
}
