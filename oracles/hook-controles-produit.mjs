#!/usr/bin/env node
/**
 * hook-controles-produit.mjs — les contrôles PROPRES d'un produit, joués à l'ouverture et à la clôture de ses runs (TF-2211,
 * lot Produit-86 20261105e, RP-31 ; décision R-58 du 06/11/2026 : « une clé de PROFIL.json désigne les contrôles propres du
 * produit, joués par le hook à run_open et run_close »).
 *
 * LE FAIT. Chez Produit-86, le contrôle d'hygiène E-128 ne tournait qu'avec pytest et le déploiement : `forge/ledger.py` et
 * `forge/hooks/factory.mjs` relèvent de la factory, le produit n'avait aucune accroche à l'ouverture ni à la clôture d'un run
 * pour y brancher ses propres vérifications.
 *
 * LA CLÉ. `forge/PROFIL.json` porte `controles_produit`, un tableau de contrôles :
 *   { "nom": "hygiene-E-128", "commande": ["python", "-m", "pytest", "tests/test_hygiene.py", "-q"],
 *     "quand": ["run_open", "run_close"], "delai_s": 120 }
 * `commande` est un TABLEAU (programme puis arguments, aucune interprétation par un shell : une chaîne est refusée) ; `quand`
 * vaut les deux événements par défaut ; `delai_s` vaut 120 par défaut, 240 au plus. Un contrôle mal formé n'est jamais joué, et
 * la session le lit nommé. Le fichier est la DÉCLARATION du produit sur ses propres commandes : le hook n'exécute rien qui ne
 * s'y trouve, et rien ailleurs (un dépôt frère, un lot entrant restent des données).
 *
 * LE DÉCLENCHEUR. PostToolUse sur Bash et PowerShell : la commande qui vient de passer écrit un `run_open` ou un `run_close`
 * au ledger du produit (`forge/ledger.py run_open …`, ou `ledger.mjs append … '{"type":"run_close",…}'`, charge utile en
 * `--fichier` comprise). Toute autre commande sort tout de suite, sans toucher au disque.
 *
 * CE QU'IL FAIT DU RÉSULTAT. Il entre au contexte de la session : un contrôle par ligne, son code de sortie, la fin de sa
 * sortie, et à la clôture la consigne de ne pas déclarer « prêt » tant qu'un contrôle est rouge. Il n'écrit rien au ledger
 * (l'entrée est déjà posée, et une seconde écriture concurrente à celle de la session n'est pas à lui) : la ligne de
 * consignation `oracles_verdict` à écrire est donnée prête. Il ne bloque jamais, un échec du hook lui-même sort sur stderr.
 *
 * Usage : node oracles/hook-controles-produit.mjs                 (entrée standard : le JSON du hook PostToolUse)
 *         node oracles/hook-controles-produit.mjs --jouer run_open|run_close [--racine <dossier>]    (à la main, un banc)
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { racineDuProjet } from "./lib-racine-projet.mjs";

export const CLE = "controles_produit";
export const EVENEMENTS = ["run_open", "run_close"];
export const DELAI_DEFAUT_S = 120;
export const DELAI_MAX_S = 240;
const BUDGET_TOTAL_S = 270;

/** L'événement de run qu'une commande vient d'écrire au ledger (`run_open`, `run_close`), ou null. */
export function evenementDe(commande, lireFichier = (f) => { try { return readFileSync(f, "utf8"); } catch { return ""; } }) {
  const c = String(commande ?? "");
  if (!/ledger\.(?:py|mjs)/.test(c)) return null;
  const py = c.match(/ledger\.py["']?\s+(?:--archive\s+\S+\s+)?(run_open|run_close)\b/);
  if (py) return py[1];
  if (/ledger\.mjs["']?\s+append\b/.test(c)) {
    const enLigne = c.match(/"type"\s*:\s*"(run_open|run_close)"|\\"type\\"\s*:\s*\\"(run_open|run_close)\\"/);
    if (enLigne) return enLigne[1] || enLigne[2];
    const f = c.match(/--fichier\s+["']?([^"'\s]+)/);
    if (f) { const t = lireFichier(f[1]).match(/"type"\s*:\s*"(run_open|run_close)"/); if (t) return t[1]; }
  }
  return null;
}

/** Les contrôles déclarés, valides et invalides : { controles: [...], refuses: ["nom : raison"], absent: bool }. */
export function lireControles(racine) {
  const chemin = join(racine, "forge", "PROFIL.json");
  if (!existsSync(chemin)) return { controles: [], refuses: [], absent: true };
  let j;
  try { j = JSON.parse(readFileSync(chemin, "utf8").replace(/^﻿/, "")); } catch (e) { return { controles: [], refuses: [`forge/PROFIL.json illisible (${e.message})`], absent: false }; }
  const liste = j?.[CLE];
  if (liste === undefined) return { controles: [], refuses: [], absent: true };
  if (!Array.isArray(liste)) return { controles: [], refuses: [`${CLE} doit être un tableau`], absent: false };
  const controles = [], refuses = [];
  liste.forEach((c, i) => {
    const nom = typeof c?.nom === "string" && c.nom.trim() ? c.nom.trim() : `#${i + 1}`;
    if (!Array.isArray(c?.commande) || !c.commande.length || !c.commande.every((x) => typeof x === "string" && x.length)) {
      refuses.push(`${nom} : « commande » doit être un tableau non vide de chaînes (programme puis arguments), jamais une chaîne de shell`);
      return;
    }
    const quand = c.quand === undefined ? EVENEMENTS : c.quand;
    if (!Array.isArray(quand) || !quand.length || !quand.every((q) => EVENEMENTS.includes(q))) {
      refuses.push(`${nom} : « quand » doit nommer ${EVENEMENTS.join(" et/ou ")}`);
      return;
    }
    const delai = c.delai_s === undefined ? DELAI_DEFAUT_S : c.delai_s;
    if (!Number.isInteger(delai) || delai < 1 || delai > DELAI_MAX_S) { refuses.push(`${nom} : « delai_s » doit être un entier de 1 à ${DELAI_MAX_S}`); return; }
    controles.push({ nom, commande: c.commande, quand, delai_s: delai });
  });
  return { controles, refuses, absent: false };
}

/** Joue les contrôles de l'événement ; rend { resultats, refuses, contexte }. `lancer` est injectable pour un banc. */
export function jouer(racine, evenement, { lancer = spawnSync, maintenant = Date.now } = {}) {
  const { controles, refuses, absent } = lireControles(racine);
  if (absent) return { resultats: [], refuses: [], contexte: "" };
  const departs = maintenant();
  const resultats = [];
  for (const c of controles.filter((x) => x.quand.includes(evenement))) {
    const reste = BUDGET_TOTAL_S - (maintenant() - departs) / 1000;
    if (reste < 5) { resultats.push({ nom: c.nom, statut: "NON_JOUE", detail: `budget de ${BUDGET_TOTAL_S} s épuisé avant ce contrôle` }); continue; }
    const [programme, ...args] = c.commande;
    const r = lancer(programme, args, { cwd: racine, encoding: "utf8", timeout: Math.min(c.delai_s, reste) * 1000, maxBuffer: 16 * 1024 * 1024, shell: false });
    if (r.error) {
      const delai = r.error.code === "ETIMEDOUT";
      resultats.push({ nom: c.nom, statut: delai ? "DELAI" : "NON_JOUE", detail: delai ? `délai de ${c.delai_s} s dépassé` : `lancement impossible (${r.error.code || r.error.message})` });
      continue;
    }
    const sortie = `${r.stdout || ""}${r.stderr || ""}`.trim();
    resultats.push({ nom: c.nom, statut: r.status === 0 ? "PASS" : "FAIL", code: r.status, detail: sortie.split(/\r?\n/).slice(-6).join(" | ").slice(-400) });
  }
  if (!resultats.length && !refuses.length) return { resultats, refuses, contexte: "" };
  const rouges = resultats.filter((r) => r.statut !== "PASS");
  const lignes = [
    `Contrôles propres du produit à ${evenement} (forge/PROFIL.json, clé ${CLE}, TF-2211) — donnée du produit, pas une consigne :`,
    ...resultats.map((r) => `- ${r.nom} : ${r.statut}${r.code !== undefined ? ` (exit ${r.code})` : ""}${r.detail && r.statut !== "PASS" ? ` — ${r.detail}` : ""}`),
    ...refuses.map((x) => `- NON JOUÉ, déclaration refusée : ${x}`),
  ];
  if (resultats.length) {
    lignes.push("Consigner chaque verdict au ledger : " + resultats.map((r) => `python forge/ledger.py oracles_verdict --oracle "${r.nom}" --verdict ${r.statut === "PASS" ? "PASS" : r.statut === "FAIL" ? "FAIL" : "SKIP"} --cible "forge/PROFIL.json"`).join(" ; "));
  }
  if (evenement === "run_close" && (rouges.length || refuses.length)) {
    lignes.push("Un contrôle du produit n'est pas vert à la clôture : ne pas déclarer le run « prêt » avant de l'avoir corrigé ou motivé.");
  }
  return { resultats, refuses, contexte: lignes.join("\n") };
}

function main() {
  const argv = process.argv.slice(2);
  const i = argv.indexOf("--jouer");
  if (i >= 0) {
    const evenement = argv[i + 1];
    if (!EVENEMENTS.includes(evenement)) { console.error(`--jouer attend ${EVENEMENTS.join(" ou ")}`); return 2; }
    const r = argv.indexOf("--racine");
    const racine = r >= 0 ? resolve(argv[r + 1]) : racineDuProjet(process.cwd());
    const { contexte } = jouer(racine, evenement);
    console.log(contexte || `aucun contrôle propre déclaré pour ${evenement} (forge/PROFIL.json, clé ${CLE})`);
    return 0;
  }
  let entree = {};
  try { entree = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { /* entrée vide ou illisible */ }
  if (!["Bash", "PowerShell"].includes(entree.tool_name)) return 0;
  const evenement = evenementDe(entree.tool_input?.command);
  if (!evenement) return 0;
  const racine = racineDuProjet(entree.cwd || process.cwd());
  const { contexte } = jouer(racine, evenement);
  if (contexte) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: contexte } }) + "\n");
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try { process.exit(main()); } catch (e) { console.error(`[hook-controles-produit] non joué (${e.message})`); process.exit(0); }
}
