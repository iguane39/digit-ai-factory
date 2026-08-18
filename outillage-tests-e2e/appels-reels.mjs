// appels-reels — les trois appels que `orchestrer-boucle.mjs` n'avait pas (TF-0360, option O3).
//
// L'orchestrateur est livré depuis le 13/08 avec trois points d'injection — `auditer`,
// `reprendre`, `declencherDevelopment` — et AUCUN appelant : l'étude 20260817 a dû l'exhumer
// par `grep` plutôt que par le corpus. Ce fichier est l'appelant. Il ne réécrit rien de la
// boucle : il fournit ce qui lui manquait pour toucher le réel.
//
// LA FRONTIÈRE, arbitrée par l'étude `output\03-etudes\20260818-etude-opportunite-cablage-
// orchestrer-boucle.md` (verdict O3), et c'est le point qui compte :
//
//   · **forge-tests PORTE la boucle et sa définition de fin.** Les cinq points de TF-0352/0353
//     (portes à 0 · aucun xfail sans arbitrage daté · N ≥ 2 passages verts · chaque anomalie
//     corrigée ou assumée par écrit · dernier tour rejoué APRÈS son dernier correctif) vivent
//     dans `forge_tests/boucle.py` et sortent dans la section `boucle` de chaque rapport.
//   · **Le pilot LIT ce verdict et exécute le routage.** Il ne recalcule aucun des cinq points.
//     Le principe est celui déjà appliqué au mouvement chez forge-design (TF-0335) : la forge
//     qui PRESCRIT une règle est celle qui la JUGE.
//   · **La borne ≤ N reste au pilot**, et ce n'est pas une contradiction : c'est un plafond de
//     DÉPENSE (loi 5), jamais un critère de fin. On peut s'arrêter avant la fin ; on ne peut
//     pas décider que c'est fini.
//
// Rien ici n'écrit dans forge-tests ni dans forge-development : les deux sont invoquées par
// leur entrée CLI existante, depuis leur propre racine. Le seul fichier écrit est le journal
// de boucle, et il est écrit CHEZ LE PRODUIT — c'est sa campagne.

import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

/** Racine des forges : `$FORGE_ROOT`, sinon le parent de ce dépôt (même règle que le noyau). */
export function racineForges() {
  return process.env.FORGE_ROOT || dirname(join(ICI, ".."));
}

export const JOURNAL_BOUCLE = "forge/journal-boucle.jsonl";

/** Une commande, jouée pour de vrai. Le silence n'est jamais lu comme un succès. */
function lancer(commande, args, options = {}) {
  const r = spawnSync(commande, args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  if (r.error) {
    throw new Error(
      `${commande} injoignable (${r.error.code || r.error.message}) — l'appel n'a pas eu lieu, `
      + "ce n'est donc ni un succès ni un échec de la mesure"
    );
  }
  return r;
}

/**
 * `auditer` — un audit forge-tests COMPLET sur le produit, rapport JSON rendu tel quel.
 *
 * Exit de forge-tests : 0 PASS · 3 PARTIEL (pans non couverts) · 1 FAIL · 4 refus G-1. Aucun
 * n'est traité comme une erreur ici : c'est un VERDICT, et la boucle existe pour le traiter.
 * Seul un stdout non parsable l'est — un rapport illisible n'est pas un rapport vide.
 */
export function auditer(cibleProduit, { racine = racineForges(), pans = null } = {}) {
  const forgeTests = join(racine, "digit-ai-forge-tests");
  const args = ["run", "python", "-m", "forge_tests", cibleProduit, "--json"];
  if (pans?.length) args.push("--pans", ...pans);
  const r = lancer("uv", args, { cwd: forgeTests });
  return lireRapport(r, "audit complet");
}

/**
 * `reprendre` — le re-audit CIBLÉ de forge-tests (`--reprendre`), qui ne rejoue que les pans
 * non verts et fusionne avec la provenance de chaque élément.
 *
 * Le rapport précédent transite par un fichier temporaire, hors du produit : écrire chez
 * l'audité pour lui poser une question serait exactement le refus G-1 que forge-tests oppose.
 */
export function reprendre(cibleProduit, rapportPrecedent, { racine = racineForges() } = {}) {
  const forgeTests = join(racine, "digit-ai-forge-tests");
  const atelier = mkdtempSync(join(tmpdir(), "boucle-"));
  const chemin = join(atelier, "precedent.json");
  writeFileSync(chemin, JSON.stringify(rapportPrecedent), "utf8");
  const r = lancer(
    "uv",
    ["run", "python", "-m", "forge_tests", cibleProduit, "--json", "--reprendre", chemin],
    { cwd: forgeTests },
  );
  return lireRapport(r, "reprise ciblée");
}

function lireRapport(r, quoi) {
  const brut = (r.stdout || "").trim();
  if (!brut) {
    throw new Error(
      `${quoi} : forge-tests n'a rien écrit sur stdout (exit ${r.status}) — `
      + `stderr : ${(r.stderr || "").trim().slice(0, 400)}`
    );
  }
  try {
    return JSON.parse(brut);
  } catch (e) {
    throw new Error(
      `${quoi} : stdout non parsable en JSON (exit ${r.status}) — ${e.message}. `
      + "Un rapport illisible n'est pas un rapport vide : la boucle s'arrête ici."
    );
  }
}

/**
 * `declencherDevelopment` — l'appel vers forge-development pour une action `manuelle_dev`.
 *
 * DÉCLARÉ NON AUTOMATIQUE, et c'est un choix, pas un manque. Un run development engage des
 * gates et une dépense ; la loi 5 les laisse à l'humain. Cette fonction PRÉPARE donc l'appel
 * — elle en rend la commande exacte, vérifie que l'entrée existe réellement, et refuse de
 * prétendre l'avoir joué. `--executer` la joue, sur décision de l'appelant.
 */
export function declencherDevelopment(action, { racine = racineForges(), executer = false } = {}) {
  const forgeDev = join(racine, "digit-ai-forge-development", "digit-ai-forge-development");
  const commande = {
    binaire: "uv",
    args: ["run", "conductor", "--action", String(action?.finding_ref || action?.id || "")],
    cwd: forgeDev,
  };
  if (!existsSync(forgeDev)) {
    return { joue: false, motif: `forge-development absente de ${forgeDev}`, commande };
  }
  if (!executer) {
    return {
      joue: false,
      motif: "action `manuelle_dev` PRÉPARÉE, pas jouée — un run development engage des gates "
        + "et une dépense (loi 5). Rejouer avec `executer: true` sur décision humaine.",
      commande,
    };
  }
  const r = lancer(commande.binaire, commande.args, { cwd: commande.cwd });
  return { joue: true, exit: r.status, stdout: (r.stdout || "").slice(0, 4000), commande };
}

/**
 * Le verdict de fin, LU chez forge-tests — jamais recalculé ici.
 *
 * C'est la frontière d'O3 en une fonction. Si la section `boucle` manque (rapport d'une
 * version antérieure au 18/08), on ne devine pas : on le DIT, et la boucle retombe sur son
 * seul plafond de dépense. Deviner « terminé » sur une section absente serait le silence que
 * TF-0353 vient de fermer.
 */
export function finDeCampagne(rapport) {
  const boucle = rapport?.boucle;
  if (!boucle || typeof boucle !== "object") {
    return {
      connue: false,
      terminee: false,
      libelle: "rapport SANS section `boucle` — cette version de forge-tests est antérieure à "
        + "TF-0352/0353, la fin de campagne n'est pas jugeable. La boucle ne s'arrêtera que sur "
        + "sa borne de dépense, et le dira.",
    };
  }
  return {
    connue: true,
    terminee: boucle.statut === "terminee",
    manques: boucle.manques || [],
    convergence: boucle.convergence || null,
    libelle: boucle.libelle || "",
  };
}

/**
 * Le journal de boucle, écrit CHEZ LE PRODUIT — c'est sa campagne, et le journal doit lui
 * survivre. Une ligne par tour, au format que `forge_tests.boucle` relit (TF-0353).
 */
export function journaliserTour(cibleProduit, tour) {
  const dossier = join(cibleProduit, "forge");
  if (!existsSync(dossier)) mkdirSync(dossier, { recursive: true });
  appendFileSync(join(cibleProduit, JOURNAL_BOUCLE), `${JSON.stringify(tour)}\n`, "utf8");
  return join(cibleProduit, JOURNAL_BOUCLE);
}

/**
 * Le tour, dérivé du rapport plutôt que compté à la main — un chiffre saisi deux fois diverge.
 * `dernier_correctif` est le SEUL champ que l'appelant doit fournir : lui seul sait quand il a
 * fini d'écrire, et c'est précisément l'horodatage sur lequel TF-0353 refuse une clôture.
 */
export function tourDepuisRapport(numero, rapport, { dernierCorrectif = "", portes = {} } = {}) {
  const actions = rapport?.actions || [];
  const restantes = actions.filter((a) => a.categorie !== "auto_ia").length;
  return {
    tour: numero,
    anomalies_entrantes: actions.length,
    corrigees: actions.length - restantes,
    nouvelles: 0,
    restantes,
    dernier_correctif: dernierCorrectif,
    dernier_run_suite: new Date().toISOString(),
    portes,
    xfail_non_justifies: 0,
    passages_verts_consecutifs: 0,
    ecarts_assumes: [],
  };
}
