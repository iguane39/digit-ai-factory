// TF-0145 — Orchestrateur de boucle remédiation ↔ réexécution (plan e2e §4 phases 5-6).
//
// Pilote : audit → classe les actions (format R-29, aligné sur `forge_tests/actions.py` —
// categorie ∈ auto_ia / manuelle_dev / manuelle_utilisateur, etape_cible) → applique les
// actions IA / déclenche les actions development (APPELS documentés, injectés — jamais exécutés
// en dur ici) → réexécute (équivalent `--reprendre`) → mesure la tendance du triplet
// couverture/passage/mutation. BORNÉ ≤ N cycles (défaut 3, G-2 absolue).
//
// ÉTAT TERMINAL (jamais « jusqu'au vert ») : soit la cible est atteinte (triplet aux seuils, 0
// écart), soit N cycles sont épuisés — et alors on rend l'état MESURÉ avec les K écarts
// résiduels CLASSÉS. Ce module ne déclare jamais un verdict vert tant qu'un écart subsiste :
// `garantirHonnetete` le refuse explicitement (voir self-test).
//
// v0 : testée sur un FAUX forge-tests (fixtures de rapports JSON successifs, `fixtures/
// rapports-boucle/`) — jamais un vrai run. `auditer`/`reprendre` sont injectés par l'appelant
// (le pilot, au jalon d'intégration réelle) ; ici, en self-test, ils lisent des fixtures.

import { readFileSync } from "node:fs";

export const N_CYCLES_DEFAUT = 3; // G-2 absolue : jamais plus, jamais « jusqu'au vert »
export const CATEGORIES = ["auto_ia", "manuelle_dev", "manuelle_utilisateur"];

// ---------------------------------------------------------------------------------------------
// Lecture d'un rapport (format aligné sur la sortie `--json` de forge-tests)
// ---------------------------------------------------------------------------------------------

export function chargerRapport(chemin) {
  const donnees = JSON.parse(readFileSync(chemin, "utf8"));
  if (!donnees || typeof donnees !== "object" || !("triplet" in donnees)) {
    throw new Error(`${chemin} n'est pas un rapport de boucle exploitable (champ "triplet" attendu)`);
  }
  return donnees;
}

// ---------------------------------------------------------------------------------------------
// Classification des actions — invariant : tout finding a EXACTEMENT une action (miroir de
// l'invariant `forge_tests/actions.py`, vérifié ici plutôt que supposé).
// ---------------------------------------------------------------------------------------------

export function classerActions(rapport) {
  const findings = rapport.findings || [];
  const actions = rapport.actions || [];
  const refs = new Set(actions.map((a) => a.finding_ref));
  const orphelins = findings.filter((f) => !refs.has(f.id));
  const parCategorie = { auto_ia: [], manuelle_dev: [], manuelle_utilisateur: [], inconnue: [] };
  for (const action of actions) {
    (parCategorie[action.categorie] || parCategorie.inconnue).push(action);
  }
  return { actions, orphelins, parCategorie };
}

/** Refuse de continuer si un finding n'a aucune action classée : jamais un constat orphelin. */
function exigerAucunOrphelin(rapport, cycle) {
  const { orphelins } = classerActions(rapport);
  if (orphelins.length) {
    throw new Error(
      `cycle ${cycle} : ${orphelins.length} finding(s) sans action classée ` +
      `(${orphelins.map((f) => f.id).join(", ")}) — refus de boucler sur un constat orphelin`
    );
  }
}

// ---------------------------------------------------------------------------------------------
// Cible et honnêteté du verdict
// ---------------------------------------------------------------------------------------------

/** Triplet aux seuils ET zéro écart résiduel — les deux conditions, jamais l'une sans l'autre. */
export function cibleAtteinte(rapport) {
  const triplet = rapport.triplet || {};
  const seuils = rapport.seuils || {};
  const seuilsTenus = Object.keys(seuils).every((cle) => (triplet[cle] ?? 0) >= seuils[cle]);
  const ecarts = (rapport.actions || []).length;
  return seuilsTenus && ecarts === 0;
}

/**
 * Garde-fou : refuse explicitement de déclarer "cible_atteinte" si un écart subsiste. Existe
 * comme fonction séparée (et pas seulement comme comportement interne de la boucle) pour être
 * la preuve directe de l'oracle « ne déclare jamais vert avec écart » — un appelant qui essaie
 * de forcer le verdict est bloqué ici, pas seulement dissuadé par la doctrine.
 */
export function garantirHonnetete(verdictPropose, rapport) {
  if (verdictPropose === "cible_atteinte" && !cibleAtteinte(rapport)) {
    const n = (rapport.actions || []).length;
    throw new Error(
      `refus (G-2) : "cible_atteinte" proposé alors que ${n} écart(s) résiduel(s) subsiste(nt) — ` +
      "un vert forcé masquerait un test faible ou un bug réel, jamais toléré"
    );
  }
  return true;
}

// ---------------------------------------------------------------------------------------------
// Orchestrateur
// ---------------------------------------------------------------------------------------------

/**
 * @param {object} params
 * @param {object} params.rapportInitial premier audit (déjà exécuté)
 * @param {function} params.reprendre (rapportPrecedent, numeroCycle) -> Promise<rapport> ; le
 *   pilot y branchera `forge_tests --reprendre` au jalon d'intégration réelle
 * @param {function} [params.appliquerActionIA] (action) -> Promise<void> ; documenté, appelé
 *   pour chaque action `auto_ia` avant la réexécution
 * @param {function} [params.declencherDevelopment] (action) -> Promise<void> ; documenté, un
 *   APPEL (pas une exécution locale) vers un run development sous gate
 * @param {number} [params.nMax] borne G-2 (défaut 3)
 */
export async function orchestrerBoucle({
  rapportInitial,
  reprendre,
  appliquerActionIA = async () => {},
  declencherDevelopment = async () => {},
  nMax = N_CYCLES_DEFAUT,
  avancement = null,
}) {
  let rapport = rapportInitial;
  exigerAucunOrphelin(rapport, 0);
  const historique = [rapport];
  let cycle = 0;

  const etatTerminal = (statut) => {
    const { actions, parCategorie } = classerActions(rapport);
    return {
      statut,
      cycles: cycle,
      n_max: nMax,
      rapport,
      historique,
      ecarts: statut === "cible_atteinte" ? [] : actions,
      ecarts_par_categorie: statut === "cible_atteinte"
        ? { auto_ia: [], manuelle_dev: [], manuelle_utilisateur: [] }
        : { auto_ia: parCategorie.auto_ia, manuelle_dev: parCategorie.manuelle_dev, manuelle_utilisateur: parCategorie.manuelle_utilisateur },
    };
  };

  while (cycle < nMax) {
    if (cibleAtteinte(rapport)) {
      garantirHonnetete("cible_atteinte", rapport); // n'échoue jamais ici (cible réellement atteinte) — prouve le chemin sain
      return etatTerminal("cible_atteinte");
    }
    cycle += 1;
    avancement?.enCours(`cycle-${cycle}`, `${cycle}e sur ${nMax}`);

    const { parCategorie } = classerActions(rapport);
    for (const action of parCategorie.auto_ia) await appliquerActionIA(action);
    for (const action of parCategorie.manuelle_dev) await declencherDevelopment(action);
    // manuelle_utilisateur : jamais appliquée par la boucle — c'est la frontière humaine (phase 7).

    rapport = await reprendre(rapport, cycle);
    exigerAucunOrphelin(rapport, cycle);
    historique.push(rapport);
    avancement?.uniteFinie(`cycle-${cycle}`);
  }

  if (cibleAtteinte(rapport)) {
    garantirHonnetete("cible_atteinte", rapport);
    avancement?.final();
    return etatTerminal("cible_atteinte");
  }
  avancement?.final();
  return etatTerminal("cycles_epuises");
}

// ---------------------------------------------------------------------------------------------
// CLI (mode réel — le pilot y injectera les vrais `auditer`/`reprendre`/`declencherDevelopment`
// au jalon d'intégration ; ce fichier ne les fournit pas, il documente la forme attendue)
// ---------------------------------------------------------------------------------------------

function usage() {
  console.error(
    "usage: node orchestrer-boucle.mjs --rapport-initial <chemin.json> --sequence <a.json,b.json,...> [--n-max 3] [--json]\n" +
    "  mode fixtures uniquement (auditer/reprendre reels non cables ici — jalon d'integration e2e)."
  );
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (nom) => {
    const i = args.indexOf(nom);
    return i >= 0 ? args[i + 1] : null;
  };
  const cheminInitial = opt("--rapport-initial");
  const sequence = (opt("--sequence") || "").split(",").filter(Boolean);
  if (!cheminInitial) {
    usage();
    process.exit(2);
  }
  const nMax = Number(opt("--n-max") || N_CYCLES_DEFAUT);
  const rapportInitial = chargerRapport(cheminInitial);
  const file = sequence.map(chargerRapport);
  let index = 0;
  const reprendre = async () => {
    // Rejoue la séquence fournie ; en plateau au-delà (dernier rapport reconduit) — un
    // forge-tests réel ne "plafonne" jamais, mais une fixture épuisée doit rester silencieuse
    // sur ce qu'elle ne sait pas simuler plutôt que planter la démonstration CLI.
    const rapport = file[Math.min(index, file.length - 1)];
    index += 1;
    return rapport;
  };
  const resultat = await orchestrerBoucle({ rapportInitial, reprendre, nMax });
  if (args.includes("--json")) {
    console.log(JSON.stringify(resultat, null, 2));
  } else {
    console.log(`statut : ${resultat.statut} (cycles : ${resultat.cycles}/${resultat.n_max})`);
    console.log(`écarts résiduels : ${resultat.ecarts.length}`);
    for (const e of resultat.ecarts) console.log(`  - [${e.categorie}] ${e.finding_ref} : ${e.attendu}`);
  }
  process.exit(resultat.statut === "cible_atteinte" ? 0 : 3);
}

if ((process.argv[1] || "").replace(/\\/g, "/").endsWith("outillage-tests-e2e/orchestrer-boucle.mjs")) {
  main();
}
