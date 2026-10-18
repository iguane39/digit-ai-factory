#!/usr/bin/env node
/**
 * reserver-decision.mjs — RÉSERVER UN NUMÉRO DE DÉCISION (D-N) AVANT DE L'AFFICHER (TF-1872, D-32 (a) du 18/10/2026).
 *
 * UNE SEULE FAÇON DE RÉSERVER, au pilot comme chez chaque produit : l'outil rend le prochain numéro libre ET l'inscrit, sous un
 * verrou, en une seule opération — c'est ce qui réduit la fenêtre entre deux sessions qui posent chacune une décision.
 *
 *   node scripts/reserver-decision.mjs --question "<la question posée, avec son point d'interrogation>"
 *       au PILOT (le dossier de travail est le dépôt du pilot) : inscrit D-N à `decisions/REGISTRE.jsonl` ;
 *       chez un PRODUIT (un `forge/retours/` en remontant depuis le dossier de travail) : inscrit D-N à SON `forge/ledger.jsonl`,
 *       entrée `question_humain` (champ `decisions_posees`), par SON écrivain — `forge/ledger.py`, sinon `ledger.mjs` de forge-agents.
 *       Depuis un produit : `node <pilot>/scripts/reserver-decision.mjs --question "…"` (le pilot est lu, jamais écrit).
 *   node scripts/reserver-decision.mjs --prochain          lecture seule : le prochain numéro libre, sans rien inscrire.
 *   node scripts/reserver-decision.mjs --verifier          lecture seule : les numéros pris deux fois pour des questions différentes.
 *   node scripts/reserver-decision.mjs --reformuler D-N --question "<la question réécrite ?>"   (pilot) la MÊME décision, reposée avec un libellé réécrit : elle garde son numéro.
 *   Options : --produit <dossier> (désigne le produit sans y être), --depuis <N> (le prochain numéro dépasse N : plancher quand le produit
 *   a déjà affiché des numéros que son ledger ne nomme pas), --registre-pilot <fichier> (essais).
 *
 * Sortie : une ligne JSON { reserve: "D-34", question, registre, ... } ; exit 0 = numéro inscrit, 1 = refus (message), 2 = usage.
 * Le libellé réservé est celui qu'on AFFICHE : « > **D-34 — <cette question>** ». Le contrôle RÉSERVATION du hook de fin de tour
 * (oracles/hook-restitution.mjs) compare le sens, par les mots, et refuse une D-N absente du registre ou prise pour une autre question.
 *
 * CE QUE CET OUTIL NE COUVRE PAS (dit, non tu) :
 *   · une session qui prend un numéro SANS lui : le verrou n'arbitre que ses utilisateurs ; le contrôle de restitution rattrape le numéro au moment d'afficher ;
 *   · deux POSTES qui réservent chacun de leur côté : le registre voyage par git, la collision n'apparaît qu'à la fusion (`--verifier`) ;
 *   · une question réservée puis non posée : le numéro reste pris, un trou n'est pas une erreur.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  REGISTRE_PILOT, lireRegistrePilot, reserverAuPilot, reformulerAuPilot, reserverChezProduit, estAuPilot, numerosDuLedger, doublonsDuRegistre,
} from "../oracles/lib-decisions.mjs";
import { produitDe } from "../oracles/hook-restitution.mjs";

const args = process.argv.slice(2);
const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 && i + 1 < args.length ? args[i + 1] : null; };
const sortie = (o, code) => { console.log(JSON.stringify(o)); process.exit(code); };

if (!args.length || args.includes("--aide") || args.includes("--help"))
  sortie({ outil: "reserver-decision", usage: "node scripts/reserver-decision.mjs --question \"<la question ?>\" [--produit <dossier>] [--depuis <N>] | --prochain | --verifier" }, 2);

const cwd = process.cwd();
const registrePilot = valeur("--registre-pilot") || REGISTRE_PILOT;
const produitDemande = valeur("--produit");
const produit = produitDemande ? resolve(produitDemande) : (estAuPilot(cwd) ? null : produitDe(cwd));
if (produitDemande && !existsSync(resolve(produitDemande, "forge")))
  sortie({ outil: "reserver-decision", verdict: "ERREUR", message: `${resolve(produitDemande)} n'est pas un produit (pas de dossier forge/)` }, 2);
if (!produit && !estAuPilot(cwd) && !valeur("--registre-pilot"))
  sortie({ outil: "reserver-decision", verdict: "ERREUR", message: "le dossier de travail n'est ni le pilot ni un produit (aucun forge/retours/ en remontant) : désigne le produit avec --produit <dossier>" }, 2);
const plancher = Number(valeur("--depuis")) || 0;

try {
  if (args.includes("--verifier")) {
    if (produit) {
      const l = numerosDuLedger(produit);
      sortie({ outil: "reserver-decision --verifier", cible: "produit", ledger: l.fichier, existe: l.existe, numeros: l.numeros.size, plus_grand: l.max,
        verdict: "PASS", message: "chez un produit, l'unicité d'un numéro se lit au ledger : un numéro nommé par plusieurs entrées question_humain se vérifie à la main" }, 0);
    }
    const reg = lireRegistrePilot(registrePilot);
    const doublons = doublonsDuRegistre(reg);
    sortie({ outil: "reserver-decision --verifier", cible: "pilot", registre: reg.fichier, existe: reg.existe, entrees: reg.entrees.length, plus_grand: reg.max,
      lignes_illisibles: reg.illisibles, doublons, verdict: doublons.length || reg.illisibles ? "FAIL" : "PASS",
      message: doublons.length ? "des numéros sont pris pour des questions différentes : renuméroter la plus récente AVANT la réponse humaine, et le dire" : "aucun numéro pris deux fois" }, doublons.length || reg.illisibles ? 1 : 0);
  }
  if (args.includes("--prochain")) {
    if (produit) { const l = numerosDuLedger(produit); sortie({ outil: "reserver-decision --prochain", cible: "produit", prochain: "D-" + (Math.max(l.max, plancher) + 1), ledger: l.fichier, ecrit: false }, 0); }
    const reg = lireRegistrePilot(registrePilot);
    sortie({ outil: "reserver-decision --prochain", cible: "pilot", prochain: "D-" + (Math.max(reg.max, plancher) + 1), registre: reg.fichier, existe: reg.existe, ecrit: false }, 0);
  }
  const question = valeur("--question");
  if (valeur("--reformuler")) {
    if (produit) sortie({ outil: "reserver-decision", verdict: "ERREUR", message: "--reformuler ne vaut qu'au pilot : chez un produit le contrôle ne compare pas le sens, une D-N inscrite au ledger se reposera telle quelle" }, 2);
    if (!question) sortie({ outil: "reserver-decision", verdict: "ERREUR", message: "--reformuler D-N exige --question \"<la question réécrite ?>\"" }, 2);
    const r = reformulerAuPilot({ n: valeur("--reformuler"), question, fichier: registrePilot });
    sortie({ outil: "reserver-decision", verdict: "PASS", reformule: r.id, n: r.n, cible: "pilot", question: r.question, registre: r.registre, ecrit_par: r.ecrit_par,
      a_faire: `afficher « > **${r.id} — ${r.question}** » : la décision garde son numéro, son libellé réécrit est inscrit` }, 0);
  }
  if (!question) sortie({ outil: "reserver-decision", verdict: "ERREUR", message: "--question \"<la question posée ?>\" est exigée" }, 2);
  const r = produit
    ? reserverChezProduit({ produit, question, plancher })
    : reserverAuPilot({ question, fichier: registrePilot, plancher });
  sortie({ outil: "reserver-decision", verdict: "PASS", reserve: r.id, n: r.n, cible: produit ? "produit" : "pilot", question: r.question, registre: r.registre, ecrit_par: r.ecrit_par,
    a_faire: `afficher « > **${r.id} — ${r.question}** » tel quel (le libellé réservé est celui qu'on affiche)` }, 0);
} catch (e) {
  sortie({ outil: "reserver-decision", verdict: "FAIL", message: e.message }, 1);
}
