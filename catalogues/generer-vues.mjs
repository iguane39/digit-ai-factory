#!/usr/bin/env node
// Générateur des vues du catalogue de services — source unique : catalogue.jsonl.
// Vues produites : CATALOGUES.md (complète) + section balisée du README pilot (compacte).
// Usage : node catalogues/generer-vues.mjs [--check | --sceller]
//   --check   : ne rien écrire, exit 1 si une vue diverge de la source (utilisé par l'oracle).
//   --sceller : quand le CONTENU des services a changé depuis la dernière version scellée, monte la
//               version (mineure suivante) et la date `genere` de la méta, ajoute l'empreinte du
//               contenu à `versions.jsonl`, puis régénère les vues. Sans changement : ne fait rien.
//               TF-2667 : la version 1.8.0 du 19/08/2026 a porté 4 contenus (83, 91, 98 puis 111
//               services au registre git) ; un produit a vendu deux instantanés sous la même étiquette.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { empreinteTexte } from "../scripts/lib-empreinte.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, "..");
const SOURCE = join(ICI, "catalogue.jsonl");
const JOURNAL = join(ICI, "versions.jsonl");
const VUE_MD = join(ICI, "CATALOGUES.md");
const README = join(RACINE, "README.md");
const MARQUE_DEBUT = "<!-- CATALOGUE:DEBUT — section générée par catalogues/generer-vues.mjs, ne pas éditer -->";
const MARQUE_FIN = "<!-- CATALOGUE:FIN -->";

const ORDRE_FORGES = ["conception", "design", "development", "tests", "agents", "ops", "data", "observability", "audit", "seo-geo", "organization", "agents-security", "websec"];
const FAMILLES = {
  conception: "pipeline", design: "pipeline", development: "pipeline", tests: "pipeline",
  agents: "transverse", ops: "transverse", data: "transverse", observability: "transverse",
  audit: "sur mandat", "seo-geo": "sur mandat", organization: "sur mandat", "agents-security": "sur mandat",
  websec: "sur mandat",
};

export function lireCatalogue(chemin = SOURCE) {
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim());
  const meta = JSON.parse(lignes[0]);
  if (meta.schema !== "pilot/catalogue@1") throw new Error(`schéma inattendu : ${meta.schema}`);
  const services = lignes.slice(1).map((l) => JSON.parse(l));
  return { meta, services };
}

// ---- version scellée (TF-2667) ------------------------------------------------------------------
// Le contenu d'une version ne change pas : `versions.jsonl` (ajout seul) garde, par version, la date
// et l'empreinte des lignes de services. L'oracle (K9) refuse un contenu qui diffère de la version
// scellée à en-tête égal ; `--sceller` est le geste qui monte la version et ajoute la ligne.

/** Empreinte des seules lignes de SERVICES (méta exclue, fins de ligne normalisées) et leur nombre. */
export function empreinteServices(chemin = SOURCE) {
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim());
  return { empreinte: empreinteTexte(lignes.slice(1).join("\n")), services: lignes.length - 1 };
}

export function lireJournal(chemin = JOURNAL) {
  if (!existsSync(chemin)) return [];
  return readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim()).map((l) => JSON.parse(l));
}

/** Compare deux versions `x.y.z` : négatif si a < b, 0 si égales, positif si a > b. */
export function comparerVersions(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  return 0;
}

/**
 * Scelle le contenu courant. Rend { action: "inchange" | "retabli" | "scelle", version, genere }.
 * `inchange` : le contenu est celui de la dernière version scellée et la méta la nomme ; `retabli` :
 * même contenu, mais la méta avait été retouchée à la main, elle reprend la version scellée ; `scelle` :
 * contenu nouveau, version mineure suivante, date du jour, ligne ajoutée au journal.
 */
export function sceller({ source = SOURCE, journal = JOURNAL, jour = new Date().toISOString().slice(0, 10) } = {}) {
  const { empreinte, services } = empreinteServices(source);
  const entrees = lireJournal(journal);
  const derniere = entrees.at(-1);
  const brut = readFileSync(source, "utf8");
  const finPremiere = brut.search(/\r?\n/);
  const premiere = finPremiere === -1 ? brut : brut.slice(0, finPremiere);
  const reste = finPremiere === -1 ? "" : brut.slice(finPremiere);
  const meta = JSON.parse(premiere);
  const poserMeta = (version, genere) => {
    const neuve = premiere.replace(/"version"\s*:\s*"[^"]*"/, `"version": "${version}"`).replace(/"genere"\s*:\s*"[^"]*"/, `"genere": "${genere}"`);
    writeFileSync(source, neuve + reste, "utf8");
  };
  if (derniere && derniere.empreinte === empreinte) {
    if (meta.version === derniere.version && meta.genere === derniere.genere) return { action: "inchange", version: derniere.version, genere: derniere.genere };
    poserMeta(derniere.version, derniere.genere);
    return { action: "retabli", version: derniere.version, genere: derniere.genere };
  }
  const connue = [meta.version, ...entrees.map((e) => e.version)].sort(comparerVersions).at(-1);
  const [majeure, mineure] = connue.split(".").map(Number);
  const version = `${majeure}.${mineure + 1}.0`;
  poserMeta(version, jour);
  const ligne = JSON.stringify({ version, genere: jour, empreinte, services });
  writeFileSync(journal, (existsSync(journal) ? readFileSync(journal, "utf8").replace(/\r?\n?$/, "\n") : "") + ligne + "\n", "utf8");
  return { action: "scelle", version, genere: jour };
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
  L.push("Règles : source unique `catalogue.jsonl` (écrivain unique : pilot) · ids stables, évolution sous table de correspondance (CONTRAT-INTERFACE §3 bis) · toute correction ou ajout passe par candidature TODO-FORGE, jamais par édition directe · version et date changent avec le contenu, scellées par `generer-vues.mjs --sceller` dans `versions.jsonl` (TF-2667) · barre de niveau : Backstage Software Catalog (registre la-barre).");
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

// Fins de ligne normalisées AVANT comparaison (TF-0359, idiome TF-0253) : avec
// core.autocrlf=true — le défaut de l'installateur Git for Windows, ni le dépôt ni
// l'utilisateur ne l'ont demandé — le checkout pose des CRLF sur des vues que ce
// générateur émet en LF. La comparaison au byte accusait alors une désynchronisation que
// le contenu démentait (`git diff --ignore-cr-at-eol` vide), sur TOUT clone Windows et
// sans qu'aucune régénération ne puisse la solder durablement. Comparer normalisé rend le
// verdict indifférent à la fin de ligne, sans rien masquer : une vraie dérive de contenu
// diffère toujours après normalisation.
const normLf = (s) => s.split("\r\n").join("\n");

export function injecterSectionReadme(contenuReadme, section) {
  const debut = contenuReadme.indexOf(MARQUE_DEBUT);
  const fin = contenuReadme.indexOf(MARQUE_FIN);
  if (debut === -1 || fin === -1) return null; // marqueurs absents : le README n'est pas encore équipé
  return contenuReadme.slice(0, debut) + section + contenuReadme.slice(fin + MARQUE_FIN.length);
}

function principal() {
  const check = process.argv.includes("--check");
  if (process.argv.includes("--sceller")) {
    if (check) { console.error("--sceller écrit : incompatible avec --check"); process.exit(2); }
    const s = sceller();
    console.log(s.action === "inchange" ? `[ok] contenu inchangé : version ${s.version} (${s.genere}) déjà scellée`
      : s.action === "retabli" ? `[ok] méta rétablie à la version scellée ${s.version} (${s.genere})`
      : `[ok] contenu nouveau : version ${s.version} (${s.genere}) scellée dans versions.jsonl`);
  }
  const catalogue = lireCatalogue();
  const vueComplete = genererVueComplete(catalogue);
  const section = genererSectionReadme(catalogue);
  const readmeActuel = readFileSync(README, "utf8");
  const readmeAttendu = injecterSectionReadme(readmeActuel, section);

  if (check) {
    const ecarts = [];
    let vueActuelle = "";
    try { vueActuelle = readFileSync(VUE_MD, "utf8"); } catch { ecarts.push("CATALOGUES.md absent"); }
    if (vueActuelle && normLf(vueActuelle) !== normLf(vueComplete)) ecarts.push("CATALOGUES.md diverge de la source");
    if (readmeAttendu === null) ecarts.push("marqueurs CATALOGUE absents du README");
    else if (normLf(readmeAttendu) !== normLf(readmeActuel)) ecarts.push("section README diverge de la source");
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
  } else if (normLf(readmeAttendu) !== normLf(readmeActuel)) {
    writeFileSync(README, readmeAttendu, "utf8");
    console.log("[ok] section CATALOGUE du README régénérée");
  } else {
    console.log("[ok] section README déjà à jour");
  }
}

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (lanceEnDirect) principal();
