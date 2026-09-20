#!/usr/bin/env node
/**
 * recette-pilot-hebergee.test.mjs — banc à double sens de ci/hebergee/recette-pilot.yml (TF-1018).
 *
 * Pourquoi CE dossier. Le fichier vérifié vit sous `ci\hebergee\`, hors de `.github\workflows\`
 * (R-38 : activation = geste humain distinct), et `oracles\self-tests.mjs` (I2) ne DÉCOUVRE que
 * les `*.test.mjs` posés DIRECTEMENT sous un dossier de premier niveau — un fichier posé sous
 * `ci\hebergee\` (deux niveaux) resterait invisible à I2, exactement le défaut que I2 lui-même a
 * été créé pour éteindre (TF-0413, commentaire de self-tests.mjs). Ce banc vit donc sous
 * `scripts\`, DIRECTEMENT, et vérifie un fichier posé ailleurs (`ci\hebergee\recette-pilot.yml`)
 * — la cible que le mandat de campagne autorisait explicitement comme second emplacement.
 *
 * Ce que ça prouve. Le workflow est INACTIF par construction (posé hors `.github\workflows\`) :
 * aucune CI ne le rejoue tant qu'un humain ne l'y déplace pas. Ce banc est donc la SEULE preuve,
 * avant activation, que le fichier fait ce qu'il prétend : un YAML structurellement valide, sans
 * secret, qui déclenche sur push/pull_request vers main sous Node 20+ et appelle bien
 * `node oracles/self-tests.mjs` et `node todo/self-test.mjs`.
 *
 * LIMITE ASSUMÉE (déclarée plutôt que masquée) : aucun parseur YAML n'est disponible dans ce
 * dépôt (pas de node_modules, aucune dépendance nouvelle autorisée par le mandat de campagne).
 * La validité structurelle est donc vérifiée par LECTURE LIGNE À LIGNE (tabulations interdites,
 * guillemets équilibrés, indentation cohérente hors bloc scalaire) — une passe plus étroite
 * qu'un vrai parseur : elle laisserait passer une construction YAML exotique, mais attrape les
 * erreurs grossières qui rendraient le fichier illisible par un runner (tabulation, guillemet
 * non fermé). Elle ne remplace pas un `yamllint` ni un `js-yaml`.
 *
 * Sens rouge : un workflow qui n'appelle pas les deux commandes, qui référence un secret, ou
 * qui contient une tabulation, DOIT échouer les vérifications correspondantes ci-dessous.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { lireCircuit, defautsDeSortie, verdictDesPas } from "./simuler-recette-hebergee.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");
const CHEMIN_WORKFLOW = join(RACINE, "ci", "hebergee", "recette-pilot.yml");
const CHEMIN_ACTIVER = join(RACINE, "ci", "hebergee", "ACTIVER.md");
const SIMULATEUR = join(RACINE, "scripts", "simuler-recette-hebergee.mjs");
// TF-1133 : ce que la recette lit HORS du pilot. Le registre des types d'organization (R-25) et le
// socle HTML de forge-agents (check_html) ; les deux dépôts sont publics, donc clonables sans secret.
const FRERES = ["digit-ai-forge-organization", "digit-ai-forge-agents"];

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

// ── Le vérificateur structurel (sans parseur YAML — limite déclarée en en-tête) ──────────────
function verifierStructureYaml(texte) {
  const motifs = [];
  const lignes = texte.split(/\r\n|\n/);

  lignes.forEach((ligne, i) => {
    const n = i + 1;
    if (ligne.includes("\t")) motifs.push(`ligne ${n} : tabulation interdite en YAML`);
    const guillemets = (ligne.match(/"/g) || []).length;
    if (guillemets % 2 !== 0) motifs.push(`ligne ${n} : guillemet double non refermé`);
  });

  // Indentation : chaque ligne non vide/non commentaire doit être indentée par des espaces en
  // nombre pair (convention du fichier lui-même). Les blocs scalaires (`|`, `>`) sont exemptés
  // — leur contenu a une indentation libre — pour rester une passe étroite plutôt qu'une source
  // de faux positifs.
  let dansBlocScalaire = false;
  lignes.forEach((ligne, i) => {
    const n = i + 1;
    if (/^\s*#/.test(ligne) || ligne.trim() === "") return;
    if (/:\s*[|>][+-]?\s*$/.test(ligne)) { dansBlocScalaire = true; return; }
    if (dansBlocScalaire) {
      if (/^\s+/.test(ligne)) return;
      dansBlocScalaire = false;
    }
    const indent = (ligne.match(/^ */) || [""])[0].length;
    if (indent % 2 !== 0) motifs.push(`ligne ${n} : indentation impaire (${indent} espaces) — suspect en YAML`);
  });

  return motifs;
}

// ── Le vérificateur de contenu attendu (déclencheurs, recette, absence de secret) ────────────
function verifierRecette(texte) {
  const motifs = verifierStructureYaml(texte);
  if (!/^on:\s*$/m.test(texte)) motifs.push("aucun déclencheur `on:` trouvé (bloc attendu)");
  if (!/\bpush:/.test(texte)) motifs.push("déclencheur `push` absent");
  if (!/\bpull_request:/.test(texte)) motifs.push("déclencheur `pull_request` absent");
  if (!/branches:\s*\[\s*main\s*\]/.test(texte)) motifs.push("aucune branche `main` déclarée sous push/pull_request");
  if (!/node\s+oracles\/self-tests\.mjs/.test(texte)) motifs.push("n'appelle pas `node oracles/self-tests.mjs`");
  if (!/node\s+todo\/self-test\.mjs/.test(texte)) motifs.push("n'appelle pas `node todo/self-test.mjs`");
  if (/secrets\./.test(texte)) motifs.push("référence un `secrets.*` — le mandat interdit tout secret");
  if (!/node-version:\s*['"]?(2\d|[3-9]\d)/.test(texte)) motifs.push("aucune version Node 20+ déclarée (`node-version`)");
  // TF-1133 — le banc jugeait le fichier, jamais ce que le runner aurait sous la main. Rejoué sur un
  // clone frais, le premier jet rendait 9 recettes en défaut sur 115 : pilot seul, profondeur 1.
  const c = lireCircuit(texte);
  if (!c.principal || c.principal.profondeur !== 0)
    motifs.push("le pilot n'est pas récupéré avec son historique complet (`fetch-depth: 0`) — relever-heritage lit l'historique, un clone de profondeur 1 le fait échouer");
  for (const f of FRERES)
    if (!c.freres.some((x) => x.nom === f)) motifs.push(`le dépôt frère public ${f} n'est pas récupéré à côté du pilot`);
  if (!c.env.FORGE_ROOT) motifs.push("FORGE_ROOT n'est pas posé sur la racine commune du pilot et de ses frères");
  if (c.principal && !c.principal.path && c.freres.length)
    motifs.push("le pilot est récupéré à la racine de l'espace de travail : ses frères seraient DANS lui, pas à côté (poser `path:`)");
  return motifs;
}

// TF-1133 — la simulation se joue AVANT le geste : ACTIVER.md la cite, et avant la ligne du geste.
function simulationAvantGeste(texte) {
  const iSim = texte.indexOf("simuler-recette-hebergee.mjs");
  const iGeste = texte.indexOf("Geste d'activation");
  if (iSim < 0) return "ACTIVER.md ne fait pas jouer `scripts/simuler-recette-hebergee.mjs`";
  if (iGeste < 0) return "ACTIVER.md ne nomme plus le geste d'activation";
  if (iSim > iGeste) return "ACTIVER.md cite la simulation APRÈS le geste d'activation — un verdict rendu après le geste n'éclaire plus rien";
  return null;
}

// ── Fixture VERTE : le fichier réel ───────────────────────────────────────────────────────────
check("ci/hebergee/recette-pilot.yml existe et est lisible", () => { readFileSync(CHEMIN_WORKFLOW, "utf8"); });

check("recette-pilot.yml n'est PAS sous .github/workflows/ (posé en ci/hebergee/, R-38)", () => {
  if (!CHEMIN_WORKFLOW.replace(/\\/g, "/").includes("/ci/hebergee/")) {
    throw new Error("le fichier attendu n'est pas sous ci/hebergee/");
  }
});

check(".github/workflows/ n'existe pas encore (aucune copie active posée sans GO humain)", () => {
  const cheminActif = join(RACINE, ".github", "workflows");
  if (existsSync(cheminActif)) throw new Error(`${cheminActif} existe déjà — vérifier qu'aucun geste d'activation n'a été fait ici`);
});

check("YAML structurellement valide (lecture ligne à ligne — sans parseur, limite déclarée en en-tête)", () => {
  const texte = readFileSync(CHEMIN_WORKFLOW, "utf8");
  const motifs = verifierStructureYaml(texte);
  if (motifs.length) throw new Error(motifs.join(" ; "));
});

check("déclenche sur push/pull_request vers main, Node 20+, sans secret, et appelle les deux recettes", () => {
  const texte = readFileSync(CHEMIN_WORKFLOW, "utf8");
  const motifs = verifierRecette(texte);
  if (motifs.length) throw new Error(motifs.join(" ; "));
});

// ── Fixtures ROUGES : le banc doit refuser pour la bonne raison ──────────────────────────────
check("(rouge) un workflow qui n'appelle aucune des deux recettes est rejeté, les deux motifs nommés", () => {
  const mauvais = [
    "name: mauvais", "on:", "  push:", "    branches: [main]",
    "jobs:", "  x:", "    runs-on: ubuntu-latest", "    steps:",
    "      - run: echo bonjour",
  ].join("\n") + "\n";
  const motifs = verifierRecette(mauvais);
  if (!motifs.some((m) => m.includes("self-tests.mjs"))) throw new Error("l'absence de self-tests.mjs n'a pas été détectée");
  if (!motifs.some((m) => m.includes("todo/self-test.mjs"))) throw new Error("l'absence de todo/self-test.mjs n'a pas été détectée");
});

check("(rouge) une tabulation d'indentation est rejetée", () => {
  const mauvais = "on:\n\tpush:\n    branches: [main]\n";
  const motifs = verifierStructureYaml(mauvais);
  if (!motifs.some((m) => m.includes("tabulation"))) throw new Error("la tabulation n'a pas été détectée");
});

check("(rouge) un secret référencé est rejeté", () => {
  const mauvais = [
    "on:", "  push:", "    branches: [main]",
    "  pull_request:", "    branches: [main]",
    "jobs:", "  x:", "    runs-on: ubuntu-latest",
    "    steps:",
    "      - run: node oracles/self-tests.mjs",
    "      - run: node todo/self-test.mjs",
    "      - env:", "          TOKEN: ${{ secrets.MON_TOKEN }}",
    "        run: echo hop",
  ].join("\n") + "\n";
  const motifs = verifierRecette(mauvais);
  if (!motifs.some((m) => m.includes("secrets"))) throw new Error("le secret n'a pas été détecté");
});

check("(rouge) une version Node antérieure à 20 est rejetée", () => {
  const mauvais = [
    "on:", "  push:", "    branches: [main]",
    "  pull_request:", "    branches: [main]",
    "jobs:", "  x:", "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/setup-node@v4",
    "        with:", "          node-version: \"18\"",
    "      - run: node oracles/self-tests.mjs",
    "      - run: node todo/self-test.mjs",
  ].join("\n") + "\n";
  const motifs = verifierRecette(mauvais);
  if (!motifs.some((m) => m.includes("Node 20"))) throw new Error("la version Node < 20 n'a pas été détectée");
});

check("(rouge) une branche autre que main sans main déclarée est rejetée", () => {
  const mauvais = [
    "on:", "  push:", "    branches: [develop]",
    "jobs:", "  x:", "    runs-on: ubuntu-latest",
    "    steps:",
    "      - run: node oracles/self-tests.mjs",
    "      - run: node todo/self-test.mjs",
  ].join("\n") + "\n";
  const motifs = verifierRecette(mauvais);
  if (!motifs.some((m) => m.includes("pull_request"))) throw new Error("l'absence de pull_request n'a pas été détectée");
  if (!motifs.some((m) => m.includes("branche `main`"))) throw new Error("l'absence de branche main n'a pas été détectée");
});

// ── TF-1133 : ce que le runner reçoit, et la simulation qui le rejoue avant le geste ──────────
check("(rouge, TF-1133) le premier jet du circuit — pilot seul, profondeur 1, sans FORGE_ROOT — est rejeté, chaque manque nommé", () => {
  const premierJet = [
    "on:", "  push:", "    branches: [main]", "  pull_request:", "    branches: [main]",
    "jobs:", "  recette:", "    runs-on: ubuntu-latest", "    steps:",
    "      - name: Récupérer le dépôt", "        uses: actions/checkout@v4",
    "      - uses: actions/setup-node@v4", "        with:", "          node-version: \"20\"",
    "      - run: node oracles/self-tests.mjs", "      - run: node todo/self-test.mjs",
  ].join("\n") + "\n";
  const motifs = verifierRecette(premierJet);
  for (const attendu of ["fetch-depth: 0", ...FRERES, "FORGE_ROOT"])
    if (!motifs.some((m) => m.includes(attendu))) throw new Error(`manque non nommé : ${attendu} (motifs : ${motifs.join(" ; ")})`);
});

check("(rouge, TF-1133) un circuit qui clone les frères sans `path:` pour le pilot est rejeté (les frères seraient dans le pilot)", () => {
  const imbrique = readFileSync(CHEMIN_WORKFLOW, "utf8").replace(/\n\s*path: digit-ai-factory/, "");
  if (!verifierRecette(imbrique).some((m) => m.includes("path:"))) throw new Error("un pilot posé à la racine de l'espace de travail n'est pas détecté");
});

check("(vert) le simulateur lit dans le circuit RÉEL ce que le runner fera : historique complet, deux frères à côté, FORGE_ROOT, deux commandes dans le pilot", () => {
  if (!existsSync(SIMULATEUR)) throw new Error("scripts/simuler-recette-hebergee.mjs absent");
  const c = lireCircuit(readFileSync(CHEMIN_WORKFLOW, "utf8"));
  if (!c.principal || c.principal.profondeur !== 0 || c.principal.path !== "digit-ai-factory") throw new Error(`pilot lu : ${JSON.stringify(c.principal)}`);
  for (const f of FRERES) if (!c.freres.some((x) => x.nom === f && x.path === f)) throw new Error(`frère ${f} non lu à côté du pilot : ${JSON.stringify(c.freres)}`);
  if (!/github\.workspace/.test(c.env.FORGE_ROOT || "")) throw new Error(`FORGE_ROOT lu : ${c.env.FORGE_ROOT}`);
  if (c.commandes.length !== 2 || c.commandes.some((x) => x.dossier !== "digit-ai-factory")) throw new Error(`commandes lues : ${JSON.stringify(c.commandes)}`);
});

check("ACTIVER.md fait jouer la simulation AVANT le geste d'activation", () => {
  const motif = simulationAvantGeste(readFileSync(CHEMIN_ACTIVER, "utf8"));
  if (motif) throw new Error(motif);
});

check("(rouge) une notice qui cite la simulation APRÈS le geste, ou pas du tout, est rejetée", () => {
  if (!simulationAvantGeste("Geste d'activation : déplacer.\nPuis jouer scripts/simuler-recette-hebergee.mjs.")) throw new Error("simulation après le geste non détectée");
  if (!simulationAvantGeste("Geste d'activation : déplacer, puis publier.")) throw new Error("absence de simulation non détectée");
});

check("(rouge) le verdict de simulation nomme les échecs du harnais, et un code non nul muet ne se tait pas", () => {
  const sortie = "  [OK    ] a.mjs  3/3\n  [ECHEC ] todo/self-test.mjs  Self-test TODO-FORGE : 49 PASS, 6 FAIL\n  [CAS PERDUS] b.mjs : 11 → 9 cas\n";
  const d = defautsDeSortie(sortie, 1);
  if (d.length !== 2 || !d[0].includes("todo/self-test.mjs") || !d[1].includes("CAS PERDUS")) throw new Error(`défauts lus : ${JSON.stringify(d)}`);
  if (defautsDeSortie("rien de lisible\n", 1).length !== 1) throw new Error("un pas en échec sans ligne de défaut est passé sous silence");
  if (verdictDesPas([{ nom: "p1", code: 0, defauts: [] }, { nom: "p2", code: 1, defauts: ["x"] }]).verdict !== "ROUGE") throw new Error("un pas rouge rend un verdict VERT");
});

check("(vert) une sortie verte à code 0 ne rend aucun défaut, et le verdict est VERT seulement si chaque pas sort à 0", () => {
  if (defautsDeSortie("  [OK    ] a.mjs  3/3\n  115/115 recettes jouées et vertes\n", 0).length) throw new Error("défaut inventé sur une sortie verte");
  if (verdictDesPas([{ nom: "p1", code: 0, defauts: [] }, { nom: "p2", code: 0, defauts: [] }]).verdict !== "VERT") throw new Error("deux pas verts ne rendent pas VERT");
});

console.log(`\nBanc recette-pilot-hebergee (ci/hebergee) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
