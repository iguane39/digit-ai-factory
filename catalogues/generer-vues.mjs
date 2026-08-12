#!/usr/bin/env node
// Générateur des vues du catalogue de services — source unique : catalogue.jsonl.
// Vues produites : CATALOGUES.md (complète) + section balisée du README pilot (compacte).
// Usage : node catalogues/generer-vues.mjs [--check]
//   --check : ne rien écrire, exit 1 si une vue diverge de la source (utilisé par l'oracle).

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");
const SOURCE = join(ICI, "catalogue.jsonl");
const VUE_MD = join(ICI, "CATALOGUES.md");
const README = join(RACINE, "README.md");
const MARQUE_DEBUT = "<!-- CATALOGUE:DEBUT — section générée par catalogues/generer-vues.mjs, ne pas éditer -->";
const MARQUE_FIN = "<!-- CATALOGUE:FIN -->";

const ORDRE_FORGES = ["conception", "design", "development", "tests", "agents", "ops", "data", "observability", "audit", "seo", "organization", "agents-security"];
const FAMILLES = {
  conception: "pipeline", design: "pipeline", development: "pipeline", tests: "pipeline",
  agents: "transverse", ops: "transverse", data: "transverse", observability: "transverse",
  audit: "sur mandat", seo: "sur mandat", organization: "sur mandat", "agents-security": "sur mandat",
};

export function lireCatalogue(chemin = SOURCE) {
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim());
  const meta = JSON.parse(lignes[0]);
  if (meta.schema !== "pilot/catalogue@1") throw new Error(`schéma inattendu : ${meta.schema}`);
  const services = lignes.slice(1).map((l) => JSON.parse(l));
  return { meta, services };
}

function parForge(services) {
  const groupes = new Map();
  for (const f of ORDRE_FORGES) groupes.set(f, []);
  for (const s of services) {
    if (!groupes.has(s.forge)) groupes.set(s.forge, []);
    groupes.get(s.forge).push(s);
  }
  return groupes;
}

export function genererVueComplete({ meta, services }) {
  const groupes = parForge(services);
  const prouves = services.filter((s) => s.statut === "prouve").length;
  const L = [];
  L.push("# Catalogues de services des forges — vue générée");
  L.push("");
  L.push(`> **Vue générée** par \`catalogues/generer-vues.mjs\` depuis \`catalogue.jsonl\` (source unique, v${meta.version}, ${meta.genere}) — ne jamais éditer ce fichier.`);
  L.push(`> ${services.length} services · ${prouves} prouvés · ${services.length - prouves} déclarés. Un service **prouvé** a une preuve exécutée (oracle, CLI, run réel) ; un service **déclaré** n'a que sa méthode documentée — il est affiché comme tel, jamais promis.`);
  L.push("");
  for (const forge of ORDRE_FORGES) {
    const liste = groupes.get(forge) ?? [];
    if (!liste.length) continue;
    L.push(`## forge-${forge} (${FAMILLES[forge]}) — ${liste.length} services`);
    L.push("");
    L.push("| id | Service | Intention (« je veux… ») | Point d'entrée | Preuve | Statut | Cycle |");
    L.push("|---|---|---|---|---|---|---|");
    for (const s of liste) {
      const c = (v) => String(v).replaceAll("|", "\\|");
      L.push(`| ${s.id} | **${c(s.nom)}** | ${c(s.intention)} | \`${c(s.point_entree)}\` | ${c(s.preuve)} | ${s.statut} | ${s.cycle_de_vie} |`);
    }
    L.push("");
  }
  L.push("---");
  L.push("");
  L.push("Règles : source unique `catalogue.jsonl` (écrivain unique : pilot) · ids stables, évolution sous table de correspondance (CONTRAT-INTERFACE §3 bis) · toute correction ou ajout passe par candidature TODO-FORGE, jamais par édition directe · barre de niveau : Backstage Software Catalog (registre la-barre).");
  L.push("");
  return L.join("\n");
}

export function genererSectionReadme({ meta, services }) {
  const groupes = parForge(services);
  const L = [];
  L.push(MARQUE_DEBUT);
  L.push("");
  L.push(`Ce que chaque forge sait faire aujourd'hui — extrait de la source unique [catalogues/catalogue.jsonl](catalogues/catalogue.jsonl) (v${meta.version}, ${meta.genere}), détail complet : [catalogues/CATALOGUES.md](catalogues/CATALOGUES.md). **prouvé** = preuve exécutée (oracle, CLI, run réel) ; *déclaré* = méthode documentée seulement.`);
  L.push("");
  for (const forge of ORDRE_FORGES) {
    const liste = groupes.get(forge) ?? [];
    if (!liste.length) continue;
    const items = liste.map((s) => (s.statut === "prouve" ? `**${s.nom}**` : `*${s.nom} (déclaré)*`)).join(" · ");
    L.push(`- **forge-${forge}** (${FAMILLES[forge]}) : ${items}`);
  }
  L.push("");
  L.push(MARQUE_FIN);
  return L.join("\n");
}

export function injecterSectionReadme(contenuReadme, section) {
  const debut = contenuReadme.indexOf(MARQUE_DEBUT);
  const fin = contenuReadme.indexOf(MARQUE_FIN);
  if (debut === -1 || fin === -1) return null; // marqueurs absents : le README n'est pas encore équipé
  return contenuReadme.slice(0, debut) + section + contenuReadme.slice(fin + MARQUE_FIN.length);
}

function principal() {
  const check = process.argv.includes("--check");
  const catalogue = lireCatalogue();
  const vueComplete = genererVueComplete(catalogue);
  const section = genererSectionReadme(catalogue);
  const readmeActuel = readFileSync(README, "utf8");
  const readmeAttendu = injecterSectionReadme(readmeActuel, section);

  if (check) {
    const ecarts = [];
    let vueActuelle = "";
    try { vueActuelle = readFileSync(VUE_MD, "utf8"); } catch { ecarts.push("CATALOGUES.md absent"); }
    if (vueActuelle && vueActuelle !== vueComplete) ecarts.push("CATALOGUES.md diverge de la source");
    if (readmeAttendu === null) ecarts.push("marqueurs CATALOGUE absents du README");
    else if (readmeAttendu !== readmeActuel) ecarts.push("section README diverge de la source");
    if (ecarts.length) {
      console.error(`[check] FAIL : ${ecarts.join(" ; ")}`);
      process.exit(1);
    }
    console.log("[check] PASS : vues synchronisées avec catalogue.jsonl");
    return;
  }

  writeFileSync(VUE_MD, vueComplete, "utf8");
  console.log(`[ok] ${VUE_MD} régénéré`);
  if (readmeAttendu === null) {
    console.error("[attention] marqueurs CATALOGUE absents du README — section non injectée");
  } else if (readmeAttendu !== readmeActuel) {
    writeFileSync(README, readmeAttendu, "utf8");
    console.log("[ok] section CATALOGUE du README régénérée");
  } else {
    console.log("[ok] section README déjà à jour");
  }
}

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (lanceEnDirect) principal();
