#!/usr/bin/env node
/**
 * oracle-catalogues.mjs — intégrité du catalogue de services (source unique + vues générées).
 * Règles :
 *  K1  catalogues\catalogue.jsonl existe, 1re ligne méta `pilot/catalogue@1`, JSONL valide
 *  K2  chaque service porte tous les champs requis, non vides (dont challenge_date — nullable interdit)
 *  K3  ids uniques, format `cat-<3 lettres>-<2 chiffres>` — jamais réutilisés (CONTRAT-INTERFACE §3 bis)
 *  K4  statut ∈ {prouve, declare} ; cycle_de_vie ∈ {experimental, production, deprecated}
 *  K5  les dix forges sont couvertes (au moins un service chacune)
 *  K6  vues synchronisées avec la source (generer-vues.mjs --check, exit 0)
 *  K7  chaque forge du catalogue est routée par CONTRAT-INTERFACE.md (cohérence points d'entrée)
 *  K8  chaque script cité en point d'entrée (node x.mjs, python x.py) existe dans le dépôt de sa forge (TF-2015)
 *  K9  la version et la date du catalogue disent son contenu : le contenu des services est celui que `versions.jsonl`
 *      a scellé sous cette version (TF-2667 ; la version 1.8.0 du 19/08 a porté 83, 91, 98 puis 111 services)
 *  K10 un service « prouve » ne dit pas, dans sa preuve, que l'exécution réelle n'a pas eu lieu (TF-2719, TF-2702, TF-2718)
 *  K11 chaque ligne du tableau « Catalogue de services » du README d'une forge a sa ligne au catalogue (TF-2710 à TF-2717)
 *  K12 AVERT : le tableau du README d'une forge est à la version du catalogue et porte tous ses services ; seule la forge
 *      le réécrit, la commande `generer-vues.mjs --forge <nom>` imprime la section à coller
 *  K13 une `challenge_date` ne dépasse pas la date du fichier qui la porte (TF-2713 : cat-agt-13, 12/11 dans un fichier du 06/11)
 *  K14 AVERT : un exécutable que le README d'une forge nomme et que son dépôt porte, ou une ligne de son « Catalogue v0 », sans
 *      ligne au catalogue
 * K8, K11, K12 et K14 lisent les dépôts du parc sous FORGE_ROOT (sinon le parent du pilot) ; un dépôt absent n'est jamais jugé.
 * Usage : node oracle-catalogues.mjs [racine] | --self-test  — exit 0 PASS / 1 FAIL / 2 erreur.
 */
import { readFileSync, existsSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { empreinteServices, lireJournal, comparerVersions, sceller, defautsDeSens, genererSectionForge } from "../catalogues/generer-vues.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const CHAMPS = ["id", "forge", "nom", "intention", "entrees", "sorties", "point_entree", "preuve", "statut", "cycle_de_vie", "challenge_date"];
const STATUTS = new Set(["prouve", "declare"]);
const CYCLES = new Set(["experimental", "production", "deprecated"]);
// TF-0412 (20/08) : `seo` renommée `seo-geo` le 19/08 (TF-0390) — la clé suit le nom courant
// de la forge, le fait de couverture est inchangé. Une clé périmée ici rend K5 rouge en permanence.
const DIX_FORGES = ["conception", "design", "development", "tests", "agents", "ops", "data", "audit", "seo-geo", "organization"];

/** Valide un fichier catalogue (règles K1-K5). forgesAttendues paramétrable pour le self-test. */
export function validerCatalogue(chemin, forgesAttendues = DIX_FORGES) {
  const findings = [];
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });

  if (!existsSync(chemin)) { ko("K1", `${chemin} absent`); return findings; }
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim());
  let meta;
  try { meta = JSON.parse(lignes[0]); } catch { ko("K1", "1re ligne : JSON invalide"); return findings; }
  if (meta.schema !== "pilot/catalogue@1") { ko("K1", `schéma méta inattendu : ${meta.schema}`); return findings; }
  ok("K1", `méta valide (v${meta.version}, ${lignes.length - 1} services)`);

  const services = [];
  for (const [i, l] of lignes.slice(1).entries()) {
    try { services.push(JSON.parse(l)); }
    catch { ko("K1", `ligne ${i + 2} : JSON invalide`); }
  }

  let k2 = 0, k4 = 0;
  const ids = new Map();
  for (const s of services) {
    for (const c of CHAMPS) {
      const v = s[c];
      const vide = v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length);
      if (vide) { ko("K2", `${s.id ?? "?"} : champ « ${c} » manquant ou vide`); k2++; }
    }
    if (!/^cat-[a-z]{3}-\d{2}$/.test(s.id ?? "")) ko("K3", `id non conforme : ${s.id}`);
    ids.set(s.id, (ids.get(s.id) ?? 0) + 1);
    if (!STATUTS.has(s.statut)) { ko("K4", `${s.id} : statut « ${s.statut} » hors {prouve, declare}`); k4++; }
    if (!CYCLES.has(s.cycle_de_vie)) { ko("K4", `${s.id} : cycle_de_vie « ${s.cycle_de_vie} » hors référentiel`); k4++; }
  }
  if (!k2) ok("K2", "tous les champs requis présents et non vides");
  const doublons = [...ids.entries()].filter(([, n]) => n > 1);
  doublons.length
    ? doublons.forEach(([id, n]) => ko("K3", `id dupliqué : ${id} (${n} occurrences)`))
    : ok("K3", `${ids.size} ids uniques au format cat-xxx-nn`);
  if (!k4) ok("K4", "statuts et cycles de vie dans les référentiels fermés");

  const couvertes = new Set(services.map((s) => s.forge));
  const manquantes = forgesAttendues.filter((f) => !couvertes.has(f));
  manquantes.length
    ? ko("K5", `forges sans service au catalogue : ${manquantes.join(", ")}`)
    : ok("K5", `${forgesAttendues.length} forges couvertes`);
  return findings;
}

/**
 * K8 (TF-2015, 29/10/2026) — un script cité en point d'entrée (`node <x>.mjs`, `python <x>.py`) existe
 * dans le dépôt de sa forge. Deux fois le 29/10, un antislash mangé par le shell a écrit
 * « node oraclesoracle-exposition-statique.mjs » et « node scriptsanonymiser.mjs », et --check rendait PASS :
 * il juge la synchronisation des vues, jamais ce qu'elles disent. Un chemin à accolades ou à chevrons
 * (`oracle-{a,b}.mjs`, `<artefact>`) n'est pas résolu ; une forge dont le dépôt est absent du parc est
 * comptée non jugée, jamais PASS ni FAIL.
 */
export function validerPointsEntree(services, racineParc) {
  const findings = [];
  let juges = 0, nonJuges = 0;
  const casses = [];
  for (const s of services) {
    const depot = join(racineParc, `digit-ai-forge-${s.forge}`);
    for (const m of String(s.point_entree ?? "").matchAll(/\b(?:node|python)\s+([^\s<>{}|;·]+\.(?:mjs|js|py))(?=\s|$)/g)) {
      if (!existsSync(depot)) { nonJuges++; continue; }
      juges++;
      if (!existsSync(join(depot, m[1].replaceAll("\\", "/")))) casses.push(`${s.id} : « ${m[1]} » introuvable dans digit-ai-forge-${s.forge}`);
    }
  }
  for (const c of casses) findings.push({ regle: "K8", statut: "FAIL", message: `${c} — séparateur de dossier perdu, ou script renommé` });
  if (!casses.length) findings.push({ regle: "K8", statut: juges ? "PASS" : "SKIP", message: `${juges} script(s) de point d'entrée résolu(s) dans le dépôt de leur forge${nonJuges ? `, ${nonJuges} non jugé(s) : dépôt de forge absent du parc` : ""}` });
  return findings;
}

/**
 * K9 (TF-2667, 16/11/2026) — un catalogue change de contenu sans changer de version ni de date : les deux
 * instantanés vendus à un produit (83 services le 24/08, 111 le 15/11) portaient la même étiquette
 * « v1.8.0 du 19/08/2026 ». `versions.jsonl` (ajout seul) scelle, par version, l'empreinte des lignes de
 * services. Le contenu courant doit être celui de la version que la méta nomme, et cette version la dernière
 * scellée ; les versions du journal montent strictement et leurs dates ne reculent pas. Le remède est dans
 * le message : `node catalogues/generer-vues.mjs --sceller`.
 */
export function validerVersions(chemin, journal) {
  const findings = [];
  const ko = (message) => findings.push({ regle: "K9", statut: "FAIL", message });
  const REMEDE = "node catalogues/generer-vues.mjs --sceller monte la version, date le contenu et régénère les vues";
  let entrees;
  try { entrees = lireJournal(journal); } catch (e) { ko(`journal des versions illisible (${journal}) : ${e.message}`); return findings; }
  if (!entrees.length) { ko(`journal des versions absent ou vide (${journal}) : ${REMEDE}`); return findings; }
  const SEMVER = /^\d+\.\d+\.\d+$/;
  const ISO = /^\d{4}-\d{2}-\d{2}$/;
  entrees.forEach((e, i) => {
    if (!e || !SEMVER.test(e.version ?? "") || !ISO.test(e.genere ?? "") || !/^[0-9a-f]{64}$/.test(e.empreinte ?? "") || !Number.isInteger(e.services)) ko(`versions.jsonl ligne ${i + 1} : version, genere, empreinte (sha256) ou services mal formés`);
    else if (i > 0 && comparerVersions(entrees[i - 1].version, e.version) >= 0) ko(`versions.jsonl ligne ${i + 1} : version ${e.version} réutilisée ou en recul après ${entrees[i - 1].version} — une version ne se rejoue jamais`);
    else if (i > 0 && e.genere < entrees[i - 1].genere) ko(`versions.jsonl ligne ${i + 1} : date ${e.genere} antérieure à celle de la version précédente (${entrees[i - 1].genere})`);
  });
  if (findings.length) return findings;
  let meta;
  try { meta = JSON.parse(readFileSync(chemin, "utf8").split(/\r?\n/)[0]); } catch { ko("1re ligne du catalogue illisible"); return findings; }
  const derniere = entrees.at(-1);
  if (meta.version !== derniere.version) ko(`le catalogue porte la version ${meta.version}, la dernière version scellée est ${derniere.version} : ${REMEDE}`);
  else if (meta.genere !== derniere.genere) ko(`le catalogue porte la date ${meta.genere}, la version ${derniere.version} a été scellée le ${derniere.genere} : ${REMEDE}`);
  else {
    const { empreinte, services } = empreinteServices(chemin);
    if (empreinte !== derniere.empreinte) ko(`le contenu diffère de la version ${meta.version} scellée le ${derniere.genere} (${derniere.services} services scellés, ${services} aujourd'hui) à en-tête égal : ${REMEDE}`);
  }
  if (!findings.length) findings.push({ regle: "K9", statut: "PASS", message: `contenu conforme à la version ${meta.version} scellée le ${meta.genere} (${derniere.services} services, ${entrees.length} version(s) au journal)` });
  return findings;
}

/**
 * K10 et K13 (TF-2719, TF-2702, TF-2718, TF-2713) — le catalogue ne contredit ni sa propre preuve ni sa date.
 * K10 : un service « prouve » dont la preuve dit l'exécution réelle non faite (cat-con-08 et cat-con-09
 * « pas encore de run réel », DAST « exécution ZAP réelle non prouvée », le feu vert GitHub et les plans
 * Supabase d'ops) ; le cartouche d'une page de forge affichait 9 prouvés sur 9, il en valait 7. K13 : une
 * `challenge_date` postérieure à la date du fichier (cat-agt-13, 12/11, dans un fichier du 06/11). Le
 * générateur de vues refuse les mêmes défauts : une seule définition (`defautsDeSens`).
 */
export function validerSens(chemin) {
  const lignes = readFileSync(chemin, "utf8").split(/\r?\n/).filter((l) => l.trim());
  const meta = JSON.parse(lignes[0]);
  const services = lignes.slice(1).map((l) => JSON.parse(l));
  const defauts = defautsDeSens({ meta, services });
  const findings = defauts.map((d) => ({ regle: d.regle, statut: "FAIL", message: d.message }));
  if (!defauts.some((d) => d.regle === "K10")) findings.push({ regle: "K10", statut: "PASS", message: `${services.filter((s) => s.statut === "prouve").length} services prouvés, aucune preuve ne dit l'exécution réelle non faite` });
  if (!defauts.some((d) => d.regle === "K13")) findings.push({ regle: "K13", statut: "PASS", message: `aucune date de contrôle postérieure à la date du fichier (${meta.genere})` });
  return findings;
}

// ---- couverture des README de forge (TF-2710 à TF-2717) -----------------------------------------
// Le README d'une forge porte un tableau « Catalogue de services » : un instantané du 13/08/2026 (v1.6.0),
// que rien ne tenait. Neuf contrôles de la forge data, `oracle-pep-impact`, « Parité oracle filtres-tableau »,
// « Migrer une étude vers la grille courante » y vivaient sans ligne au catalogue ; les pages de forge du
// site, écrites depuis le catalogue, ne pouvaient pas les citer. Source de vérité : ce que la forge exécute,
// donc les services que SON README présente et les exécutables qui existent dans son dépôt.
const SANS_ACCENT = (t) => String(t).normalize("NFD").replace(/\p{M}/gu, "");
const NORME = (t) => SANS_ACCENT(t).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
// Infrastructure d'une forge, jamais un service : recette, découverte, bibliothèques.
const INFRASTRUCTURE = /^(?:self-test.*|decouvrir-oracles|lib-.*|autotest|recette)$/;

/** Noms de fichiers d'un texte, sans extension : exécutables (`x.mjs|py|js`), référentiels et corpus (`x.md|json|jsonl`), et `oracle-{a,b}.mjs` développé. */
export function stemsExecutables(texte) {
  const brut = String(texte).replaceAll("\\", "/");
  const stems = new Set();
  for (const m of brut.matchAll(/([A-Za-z0-9_-]+)\.(?:mjs|py|js|jsonl?|md)\b/g)) stems.add(m[1]);
  for (const m of brut.matchAll(/([A-Za-z0-9_-]*)\{([^{}]+)\}\.(?:mjs|py|js)\b/g)) {
    for (const alt of m[2].split(",")) {
      const nom = alt.trim().split(/\s+/)[0].replace(/\.(?:mjs|py|js)$/, "");
      if (nom) stems.add(m[1] + nom);
    }
  }
  return stems;
}

/** Tableaux de services d'un README de forge : version citée, lignes (première cellule, texte entier, n° de ligne). */
export function lireTableauxServices(readme) {
  const lignes = String(readme).split(/\r?\n/);
  const rendu = { version: null, ligneVersion: null, rangs: [] };
  let section = null;
  let tableDeServices = false;
  for (let i = 0; i < lignes.length; i++) {
    const l = lignes[i];
    if (/^#{2,3}\s/.test(l)) { if (/^##\s/.test(l)) section = /^##\s+Catalogue(?: de services| v0)/i.test(l) ? l : null; tableDeServices = false; }
    if (!section) continue;
    if (rendu.version === null) {
      const v = l.match(/\(v(\d+\.\d+\.\d+)/);
      if (v && /^>/.test(l)) { rendu.version = v[1]; rendu.ligneVersion = i + 1; }
    }
    if (!/^\|/.test(l) || /^\|\s*:?-{2,}/.test(l)) continue;
    // Une ligne suivie d'un filet est l'entête d'un tableau ; seuls ceux dont la 1re colonne est « Service » listent des services
    // (les règles, les modes ou les champs qu'un README détaille sous le catalogue n'en sont pas).
    if (/^\|\s*:?-{2,}/.test(lignes[i + 1] ?? "")) { tableDeServices = /^\|\s*Service\s*\|/i.test(l); continue; }
    if (!tableDeServices) continue;
    const cellule = l.split("|")[1] ?? "";
    rendu.rangs.push({ cellule: cellule.replace(/[*`]/g, "").trim(), texte: l, ligne: i + 1, v0: /Catalogue v0/i.test(section) });
  }
  return rendu;
}

/** Les services d'une forge, vus du catalogue : noms normalisés et exécutables cités. */
function empreinteCatalogueForge(services, forge) {
  const liste = services.filter((s) => s.forge === forge);
  const noms = new Set(liste.map((s) => NORME(s.nom)));
  const stems = stemsExecutables(liste.map((s) => [s.nom, s.point_entree, s.preuve, ...(s.entrees ?? []), ...(s.sorties ?? [])].join(" ")).join(" "));
  return { liste, noms, stems };
}

/**
 * K11 (FAIL), K12 et K14 (AVERT). K11 : chaque ligne d'un tableau de services du README d'une forge a sa
 * ligne au catalogue — par son nom, ou parce que TOUS les exécutables qu'elle nomme y sont cités. Le remède
 * est au pilot : ajouter la ligne au catalogue. K12 : le tableau « Catalogue de services » de la forge
 * retarde sur le catalogue (version citée, services absents du tableau) ; seule la forge réécrit son README,
 * donc un avertissement qui nomme la commande (`generer-vues.mjs --forge <nom>`) et la ligne. K14 : des
 * exécutables que le README nomme et que le dépôt porte, sans citation au catalogue ; un avertissement
 * aussi, car le README les cite parfois comme outils de la recette et non comme services. Une forge dont
 * le dépôt est absent du parc n'est jamais jugée (SKIP).
 */
export function validerCouvertureReadme(meta, services, racineParc) {
  const findings = [];
  const forges = [...new Set(services.map((s) => s.forge))];
  let jugees = 0, rangsJuges = 0, absentes = 0;
  const ko = [], avert12 = [], avert14 = [];
  for (const forge of forges) {
    const depot = join(racineParc, `digit-ai-forge-${forge}`);
    const chemin = join(depot, "README.md");
    if (!existsSync(chemin)) { absentes++; continue; }
    jugees++;
    const readme = readFileSync(chemin, "utf8");
    const { liste, noms, stems } = empreinteCatalogueForge(services, forge);
    const { version, ligneVersion, rangs } = lireTableauxServices(readme);
    for (const r of rangs) {
      rangsJuges++;
      const nom = NORME(r.cellule);
      // même nom, ou nom qui contient l'autre (« Livrables de tests dérivés (cas à adopter) » pour « Livrables de tests dérivés »)
      if (nom && [...noms].some((n) => n === nom || (Math.min(n.length, nom.length) >= 12 && (n.includes(nom) || nom.includes(n))))) continue;
      const tous = [...stemsExecutables(r.texte)];
      const stemsRang = tous.filter((x) => !INFRASTRUCTURE.test(x));
      if (tous.length && !stemsRang.length) continue; // la ligne ne présente que la recette de la forge
      if (stemsRang.some((x) => stems.has(x))) continue;
      const dit = `forge-${forge}, README.md:${r.ligne} : « ${r.cellule.slice(0, 80)} » est présenté comme un service et n'a aucune ligne au catalogue`;
      // Le « Catalogue v0 » est le tableau que la forge tient seule : il avertit, il ne bloque pas. La section « Catalogue de services » est celle du pilot : elle refuse.
      (r.v0 ? avert14 : ko).push(r.v0 ? `${dit} (tableau « Catalogue v0 » de la forge)` : `${dit} — ajouter la ligne (le pilot écrit le catalogue, la forge ne le contredit pas)`);
    }
    const dansTableau = new Set(rangs.map((r) => NORME(r.cellule)));
    const stemsTableau = new Set(rangs.flatMap((r) => [...stemsExecutables(r.texte)]));
    const absentsDuTableau = liste.filter((s) => !dansTableau.has(NORME(s.nom)) && ![...stemsExecutables(`${s.nom} ${s.point_entree}`)].filter((x) => !INFRASTRUCTURE.test(x)).some((x) => stemsTableau.has(x)));
    if ((version !== null && version !== meta.version) || absentsDuTableau.length) {
      avert12.push(`forge-${forge}, README.md:${ligneVersion ?? "?"} : tableau à la v${version ?? "?"}, catalogue à la v${meta.version}, ${absentsDuTableau.length} service(s) du catalogue absent(s) du tableau (${absentsDuTableau.slice(0, 4).map((s) => s.id).join(", ")}${absentsDuTableau.length > 4 ? ", …" : ""}) — la forge colle \`node catalogues/generer-vues.mjs --forge ${forge}\``);
    }
    const existants = new Set();
    for (const d of ["oracles", "scripts", "tools"]) {
      const base = join(depot, d);
      if (!existsSync(base)) continue;
      const marche = (p, prof) => {
        for (const e of readdirSync(p, { withFileTypes: true })) {
          if (e.isDirectory()) { if (prof < 1 && !["node_modules", "fixtures", "__pycache__"].includes(e.name)) marche(join(p, e.name), prof + 1); }
          else { const m = e.name.match(/^(.+)\.(?:mjs|py|js)$/); if (m) existants.add(m[1]); }
        }
      };
      marche(base, 0);
    }
    const nommes = [...stemsExecutables(readme)].filter((x) => existants.has(x) && !INFRASTRUCTURE.test(x));
    const sansLigne = nommes.filter((x) => !stems.has(x));
    if (sansLigne.length) avert14.push(`forge-${forge} : ${sansLigne.length} exécutable(s) que le README nomme et que le dépôt porte, sans citation au catalogue (${sansLigne.slice(0, 6).join(", ")}${sansLigne.length > 6 ? ", …" : ""})`);
  }
  if (!jugees) { findings.push({ regle: "K11", statut: "SKIP", message: `aucun dépôt de forge sous ${racineParc} : README non jugés` }); return findings; }
  for (const m of ko) findings.push({ regle: "K11", statut: "FAIL", message: m });
  if (!ko.length) findings.push({ regle: "K11", statut: "PASS", message: `${rangsJuges} ligne(s) de tableaux de services de ${jugees} README de forge, chacune a sa ligne au catalogue${absentes ? ` (${absentes} forge(s) absente(s) du parc, non jugée(s))` : ""}` });
  for (const m of avert12) findings.push({ regle: "K12", statut: "AVERT", message: m });
  if (!avert12.length) findings.push({ regle: "K12", statut: "PASS", message: `les tableaux « Catalogue de services » des ${jugees} README sont à la version ${meta.version} et portent tous les services du catalogue` });
  for (const m of avert14) findings.push({ regle: "K14", statut: "AVERT", message: m });
  if (!avert14.length) findings.push({ regle: "K14", statut: "PASS", message: `chaque exécutable que les README nomment est cité au catalogue` });
  return findings;
}

/** Règles K6-K9 (environnement réel uniquement). */
function validerEnvironnement(racine) {
  const findings = [];
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });

  const generateur = join(racine, "catalogues", "generer-vues.mjs");
  const check = spawnSync(process.execPath, [generateur, "--check"], { encoding: "utf8" });
  check.status === 0
    ? ok("K6", "vues synchronisées avec la source (generer-vues.mjs --check exit 0)")
    : ko("K6", `vues désynchronisées : ${(check.stderr || check.stdout || "").trim()}`);

  const contrat = join(racine, "CONTRAT-INTERFACE.md");
  if (!existsSync(contrat)) ko("K7", "CONTRAT-INTERFACE.md absent");
  else {
    const texte = readFileSync(contrat, "utf8").toLowerCase();
    const lignes = readFileSync(join(racine, "catalogues", "catalogue.jsonl"), "utf8").split(/\r?\n/).filter((l) => l.trim()).slice(1);
    const forges = new Set(lignes.map((l) => JSON.parse(l).forge));
    const absentes = [...forges].filter((f) => !texte.includes(f));
    absentes.length
      ? ko("K7", `forges du catalogue absentes du CONTRAT-INTERFACE : ${absentes.join(", ")}`)
      : ok("K7", `${forges.size} forges du catalogue routées par le contrat`);
  }
  const services = readFileSync(join(racine, "catalogues", "catalogue.jsonl"), "utf8").split(/\r?\n/).filter((l) => l.trim()).slice(1).map((l) => JSON.parse(l));
  // Le parc se lit sous FORGE_ROOT (CLAUDE.md : « racine = $FORGE_ROOT, sinon le parent de ce dépôt ») : une
  // copie de travail du pilot hors du parc juge alors les mêmes forges que le dépôt d'origine.
  const parc = process.env.FORGE_ROOT || join(racine, "..");
  findings.push(...validerPointsEntree(services, parc));
  findings.push(...validerVersions(join(racine, "catalogues", "catalogue.jsonl"), join(racine, "catalogues", "versions.jsonl")));
  findings.push(...validerSens(join(racine, "catalogues", "catalogue.jsonl")));
  const meta = JSON.parse(readFileSync(join(racine, "catalogues", "catalogue.jsonl"), "utf8").split(/\r?\n/)[0]);
  findings.push(...validerCouvertureReadme(meta, services, parc));
  return findings;
}

function selfTest() {
  const dossier = mkdtempSync(join(tmpdir(), "oracle-catalogues-"));
  const meta = JSON.stringify({ schema: "pilot/catalogue@1", version: "0.0.1", genere: "2026-08-12" });
  const service = (sur) => JSON.stringify({
    id: "cat-aaa-01", forge: "alpha", nom: "N", intention: "I", entrees: ["e"], sorties: ["s"],
    point_entree: "p", preuve: "pr", statut: "prouve", cycle_de_vie: "production", challenge_date: "2026-08-12", ...sur,
  });
  const resultats = [];

  // fixture VERTE : catalogue minimal conforme (2 forges attendues, 2 couvertes) → PASS attendu
  const verte = join(dossier, "verte.jsonl");
  writeFileSync(verte, [meta, service({}), service({ id: "cat-bbb-01", forge: "beta" })].join("\n"), "utf8");
  const fVerte = validerCatalogue(verte, ["alpha", "beta"]);
  resultats.push({ fixture: "verte", attendu: "PASS", obtenu: fVerte.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS" });

  // fixture ROUGE : id dupliqué + statut hors référentiel + challenge_date null + forge non couverte → FAIL sur K2, K3, K4, K5
  const rouge = join(dossier, "rouge.jsonl");
  writeFileSync(rouge, [meta, service({}), service({ statut: "certifie", challenge_date: null })].join("\n"), "utf8");
  const fRouge = validerCatalogue(rouge, ["alpha", "beta"]);
  const reglesTouchees = new Set(fRouge.filter((f) => f.statut === "FAIL").map((f) => f.regle));
  for (const r of ["K2", "K3", "K4", "K5"])
    resultats.push({ fixture: `rouge/${r}`, attendu: "FAIL", obtenu: reglesTouchees.has(r) ? "FAIL" : "PASS" });

  // K8 (TF-2015) : un parc jetable avec un dépôt de forge qui porte oracles/oracle-x.mjs. Le chemin
  // juste PASS ; le même dont l'antislash est perdu FAIL (le cas réel du 29/10) ; un chemin à
  // accolades n'est pas résolu ; une forge absente du parc n'est jamais FAIL.
  const parc = join(dossier, "parc");
  mkdirSync(join(parc, "digit-ai-forge-alpha", "oracles"), { recursive: true });
  writeFileSync(join(parc, "digit-ai-forge-alpha", "oracles", "oracle-x.mjs"), "", "utf8");
  const k8 = (point_entree, forge = "alpha") => validerPointsEntree([{ id: "cat-aaa-01", forge, point_entree }], parc)[0];
  resultats.push({ fixture: "K8/chemin juste", attendu: "PASS", obtenu: k8("node oracles\\oracle-x.mjs <f>").statut });
  resultats.push({ fixture: "K8/antislash perdu", attendu: "FAIL", obtenu: k8("node oraclesoracle-x.mjs <f>").statut });
  resultats.push({ fixture: "K8/accolades non résolues", attendu: "SKIP", obtenu: k8("node oracles\\oracle-{x,y}.mjs").statut });
  resultats.push({ fixture: "K8/forge absente du parc", attendu: "SKIP", obtenu: k8("node oraclesoracle-x.mjs", "beta").statut });

  // TF-2246 (06/11/2026) : l'oracle de l'arrêt d'urgence rejoué en course (forge-agents-security, TF-2217)
  // était livré et découvert par sa forge, mais absent du catalogue du pilot. Le catalogue RÉEL le cite.
  const reel = readFileSync(join(ICI, "..", "catalogues", "catalogue.jsonl"), "utf8").split(/\r?\n/).filter((l) => l.trim()).slice(1).map((l) => JSON.parse(l));
  resultats.push({ fixture: "catalogue réel/oracle-arret-en-course de forge-agents-security (TF-2246)", attendu: "PASS",
    obtenu: reel.some((s) => s.forge === "agents-security" && /oracle-arret-en-course\.mjs/.test(s.point_entree)) ? "PASS" : "FAIL" });

  // K9 (TF-2667) : deux instantanés à en-tête égal (version et date identiques) dont le contenu diffère.
  // Le journal scelle l'instantané A ; B ajoute un service sans monter la version → FAIL. Le remède que le
  // message recommande (`sceller`) est JOUÉ sur B et doit faire passer K9 ; le rejouer ne change plus rien.
  const ecrire = (nom, lignes) => { const f = join(dossier, nom); writeFileSync(f, lignes.join("\n") + "\n", "utf8"); return f; };
  const metaK9 = JSON.stringify({ schema: "pilot/catalogue@1", version: "0.0.1", genere: "2026-08-12" });
  const svcB = service({ id: "cat-bbb-01", forge: "beta" });
  const instA = ecrire("k9-a.jsonl", [metaK9, service({})]);
  const instB = ecrire("k9-b.jsonl", [metaK9, service({}), svcB]);
  const ligneJ = (version, genere, source) => JSON.stringify({ version, genere, ...empreinteServices(source) });
  const journalA = ecrire("k9-journal-a.jsonl", [ligneJ("0.0.1", "2026-08-12", instA)]);
  const k9 = (cat, jr, motif) => { const f = validerVersions(cat, jr); return f.some((x) => x.statut === "FAIL" && (!motif || motif.test(x.message))) ? "FAIL" : f.every((x) => x.statut === "PASS") ? "PASS" : "?"; };
  resultats.push({ fixture: "K9/vert : contenu = version scellée", attendu: "PASS", obtenu: k9(instA, journalA) });
  resultats.push({ fixture: "K9/rouge : 2 instantanés à en-tête égal, contenu différent", attendu: "FAIL", obtenu: k9(instB, journalA, /le contenu diffère de la version 0\.0\.1 .*à en-tête égal.*--sceller/) });
  resultats.push({ fixture: "K9/rouge : version montée à la main sans scellé", attendu: "FAIL", obtenu: k9(ecrire("k9-v.jsonl", [metaK9.replace("0.0.1", "0.0.2"), service({})]), journalA, /dernière version scellée est 0\.0\.1/) });
  resultats.push({ fixture: "K9/rouge : journal en recul (0.0.2 puis 0.0.1)", attendu: "FAIL", obtenu: k9(instA, ecrire("k9-journal-r.jsonl", [ligneJ("0.0.2", "2026-08-13", instA), ligneJ("0.0.1", "2026-08-14", instA)]), /réutilisée ou en recul/) });
  resultats.push({ fixture: "K9/rouge : journal absent", attendu: "FAIL", obtenu: k9(instA, join(dossier, "absent.jsonl"), /absent ou vide/) });
  const instC = ecrire("k9-c.jsonl", [metaK9, service({}), svcB]);
  const journalC = ecrire("k9-journal-c.jsonl", [ligneJ("0.0.1", "2026-08-12", instA)]);
  const scelle = sceller({ source: instC, journal: journalC, jour: "2026-11-16" });
  resultats.push({ fixture: "K9/remède : --sceller monte la version (0.1.0) et date le contenu", attendu: "scelle 0.1.0 2026-11-16", obtenu: `${scelle.action} ${scelle.version} ${scelle.genere}` });
  resultats.push({ fixture: "K9/remède : après --sceller, K9 passe", attendu: "PASS", obtenu: k9(instC, journalC) });
  resultats.push({ fixture: "K9/remède : --sceller rejoué ne change plus rien", attendu: "inchange", obtenu: sceller({ source: instC, journal: journalC, jour: "2026-12-01" }).action });
  resultats.push({ fixture: "K9/catalogue réel : contenu = dernière version scellée", attendu: "PASS", obtenu: k9(join(ICI, "..", "catalogues", "catalogue.jsonl"), join(ICI, "..", "catalogues", "versions.jsonl")) });

  // K10 et K13 (TF-2719, TF-2702, TF-2718, TF-2713) : chaque tournure de la liste fermée a sa fixture rouge ; la portée limitée
  // (« applications riches non prouvées ») et un service « declare » passent ; le remède (passer en « declare ») est joué.
  const metaSens = { genere: "2026-11-16" };
  const sens = (sur, meta = metaSens) => defautsDeSens({ meta, services: [{ id: "cat-aaa-01", statut: "prouve", challenge_date: "2026-11-16", preuve: "pr", ...sur }] }).map((d) => d.regle).join(",") || "aucun";
  resultats.push({ fixture: "K10/rouge : « pas encore de run réel » (cat-con-08, cat-con-09)", attendu: "K10", obtenu: sens({ preuve: "GO du 19/08 : self-test double sens — pas encore de run réel" }) });
  resultats.push({ fixture: "K10/rouge : « aucune exécution réelle » (cat-ops-11)", attendu: "K10", obtenu: sens({ preuve: "self-test 326 PASS ; aucune exécution réelle" }) });
  resultats.push({ fixture: "K10/rouge : « jamais exécutée sur un dépôt réel » (cat-ops-10)", attendu: "K10", obtenu: sens({ preuve: "self-test 316 PASS ; garde jamais exécutée sur un dépôt réel" }) });
  resultats.push({ fixture: "K10/rouge : « exécution ZAP réelle non prouvée » (cat-wsc-05)", attendu: "K10", obtenu: sens({ preuve: "7 verrous. Exécution ZAP réelle NON prouvée : binaire absent du poste" }) });
  resultats.push({ fixture: "K10/vert : l'exécution réelle est datée, la portée limitée est dite", attendu: "aucun", obtenu: sens({ preuve: "passe passive réelle le 14/08, balayage actif le 12/11 ; applications riches et authentifiées non prouvées" }) });
  resultats.push({ fixture: "K10/vert : un service « declare » peut dire qu'il n'a pas de run réel", attendu: "aucun", obtenu: sens({ statut: "declare", preuve: "pas encore de run réel" }) });
  resultats.push({ fixture: "K10/remède joué : la rouge passée en « declare » ne rend plus rien", attendu: "aucun", obtenu: sens({ statut: "declare", preuve: "self-test 316 PASS ; garde jamais exécutée sur un dépôt réel" }) });
  resultats.push({ fixture: "K13/rouge : date de contrôle du 17/11 dans un fichier du 16/11 (cat-agt-13)", attendu: "K13", obtenu: sens({ challenge_date: "2026-11-17" }) });
  resultats.push({ fixture: "K13/vert : date de contrôle du jour du fichier", attendu: "aucun", obtenu: sens({ challenge_date: "2026-11-16" }) });
  const ecritK = (nom, lignes) => { const f = join(dossier, nom); writeFileSync(f, lignes.join("\n") + "\n", "utf8"); return f; };
  const metaK10 = JSON.stringify({ schema: "pilot/catalogue@1", version: "0.0.1", genere: "2026-08-12" });
  resultats.push({ fixture: "K10/oracle : un catalogue dont un service prouvé dit « pas encore de run réel » échoue", attendu: "FAIL", obtenu: validerSens(ecritK("k10-rouge.jsonl", [metaK10, service({ preuve: "pas encore de run réel" })])).some((f) => f.regle === "K10" && f.statut === "FAIL") ? "FAIL" : "PASS" });
  resultats.push({ fixture: "K13/oracle : une challenge_date postérieure à la date du fichier échoue", attendu: "FAIL", obtenu: validerSens(ecritK("k13-rouge.jsonl", [metaK10, service({ challenge_date: "2026-09-01" })])).some((f) => f.regle === "K13" && f.statut === "FAIL") ? "FAIL" : "PASS" });
  resultats.push({ fixture: "K10 et K13/oracle : le catalogue de la fixture verte passe", attendu: "PASS", obtenu: validerSens(ecritK("k10-vert.jsonl", [metaK10, service({})])).every((f) => f.statut === "PASS") ? "PASS" : "FAIL" });

  // K11, K12, K14 (TF-2710 à TF-2717) : un parc jetable, une forge « alpha » dont le README porte son tableau « Catalogue de services ».
  const parcR = join(dossier, "parc-readme");
  const depotR = join(parcR, "digit-ai-forge-alpha");
  mkdirSync(join(depotR, "oracles"), { recursive: true });
  for (const x of ["oracle-x", "oracle-z", "self-test"]) writeFileSync(join(depotR, "oracles", `${x}.mjs`), "", "utf8");
  const readme = (version, lignes, extra = "") => ["# forge alpha", "", "## Catalogue de services", "", `> Section proposée par la campagne (v${version}, challengée).`, "", "| Service | Intention | Point d'entrée | Statut |", "|---|---|---|---|", ...lignes, "", extra].join("\n");
  const ligneTab = (nom, pe) => `| **${nom}** | intention | \`${pe}\` | prouvé |`;
  const metaR = { version: "0.0.2", genere: "2026-11-16" };
  const svcR = (sur) => ({ id: "cat-aaa-01", forge: "alpha", nom: "Service alpha", intention: "i", entrees: ["e"], sorties: ["s"], point_entree: "node oracles\\oracle-x.mjs <f>", preuve: "pr", statut: "prouve", cycle_de_vie: "experimental", challenge_date: "2026-11-16", ...sur });
  const jugerR = (texteReadme, services) => { writeFileSync(join(depotR, "README.md"), texteReadme, "utf8"); return validerCouvertureReadme(metaR, services, parcR); };
  const statutR = (f, regle) => f.filter((x) => x.regle === regle).map((x) => x.statut).join("+");
  const vertR = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>")]), [svcR({})]);
  resultats.push({ fixture: "K11-K14/vert : README à la version du catalogue, ses lignes au catalogue", attendu: "PASS PASS PASS", obtenu: `${statutR(vertR, "K11")} ${statutR(vertR, "K12")} ${statutR(vertR, "K14")}` });
  const rougeR = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>"), ligneTab("Parité oracle filtres-tableau", "node oracles\\oracle-y.mjs")]), [svcR({})]);
  resultats.push({ fixture: "K11/rouge : un service du README sans ligne au catalogue (cas « Parité oracle filtres-tableau »)", attendu: "FAIL", obtenu: rougeR.some((f) => f.regle === "K11" && f.statut === "FAIL" && /README\.md:\d+ : « Parité oracle filtres-tableau »/.test(f.message)) ? "FAIL" : "PASS" });
  const remedeR = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>"), ligneTab("Parité oracle filtres-tableau", "node oracles\\oracle-y.mjs")]), [svcR({}), svcR({ id: "cat-aaa-02", nom: "Parité oracle filtres-tableau", point_entree: "node oracles\\oracle-y.mjs" })]);
  resultats.push({ fixture: "K11/remède joué : la ligne ajoutée au catalogue, K11 passe", attendu: "PASS", obtenu: statutR(remedeR, "K11") });
  const nomContenu = jugerR(readme("0.0.2", [ligneTab("Livrables de tests dérivés (cas à adopter et exécuter)", "uv run x")]), [svcR({ nom: "Livrables de tests dérivés", point_entree: "uv run x" })]);
  resultats.push({ fixture: "K11/vert : le README précise le nom d'un service, le catalogue le porte (« Livrables de tests dérivés »)", attendu: "PASS", obtenu: statutR(nomContenu, "K11") });
  const infra = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>"), ligneTab("Rejouer toutes les preuves", "node oracles/self-test.mjs")]), [svcR({})]);
  resultats.push({ fixture: "K11/vert : la ligne qui ne présente que la recette de la forge n'est pas un service", attendu: "PASS", obtenu: statutR(infra, "K11") });
  const regles = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>")], ["### Règles", "", "| Règle | Détecte |", "|---|---|", "| CAP-1 | une combinaison |", "| CAP-2 | un outil absent |"].join("\n")), [svcR({})]);
  resultats.push({ fixture: "K11/vert : un tableau de règles sous le catalogue (1re colonne « Règle ») n'est pas un tableau de services", attendu: "PASS", obtenu: statutR(regles, "K11") });
  const v0 = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>")], ["## Catalogue v0", "", "| Service | Statut |", "|---|---|", "| `oracles/oracle-y.mjs` — un scan | prouvé |"].join("\n")), [svcR({})]);
  resultats.push({ fixture: "K14/avertit : un service du tableau « Catalogue v0 » de la forge sans ligne au catalogue n'échoue pas", attendu: "PASS AVERT", obtenu: `${statutR(v0, "K11")} ${statutR(v0, "K14")}` });
  const retard = jugerR(readme("0.0.1", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>")]), [svcR({}), svcR({ id: "cat-aaa-02", nom: "Service neuf", point_entree: "node oracles\\oracle-n.mjs" })]);
  resultats.push({ fixture: "K12/avertit : tableau à la v0.0.1 quand le catalogue est à la v0.0.2, un service absent du tableau", attendu: "AVERT", obtenu: retard.some((f) => f.regle === "K12" && f.statut === "AVERT" && /v0\.0\.1.*v0\.0\.2.*1 service\(s\).*cat-aaa-02.*--forge alpha/.test(f.message)) ? "AVERT" : statutR(retard, "K12") });
  // le remède que K12 recommande est joué : la section que `--forge` imprime, collée au README, rend K11 et K12 PASS
  const sectionColle = genererSectionForge({ meta: { version: "0.0.2", genere: "2026-11-16" }, services: [svcR({}), svcR({ id: "cat-aaa-02", nom: "Service neuf", point_entree: "node oracles\\oracle-n.mjs" })] }, "alpha");
  const apresRemede = jugerR(`# forge alpha\n\n${sectionColle}\n`, [svcR({}), svcR({ id: "cat-aaa-02", nom: "Service neuf", point_entree: "node oracles\\oracle-n.mjs" })]);
  resultats.push({ fixture: "K12/remède joué : la section générée par --forge, collée au README, est à la version et complète", attendu: "PASS PASS", obtenu: `${statutR(apresRemede, "K11")} ${statutR(apresRemede, "K12")}` });
  const nommeZ = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>")], "Voir aussi `oracle-z.mjs` pour la recette."), [svcR({})]);
  resultats.push({ fixture: "K14/avertit : un exécutable que le README nomme et que le dépôt porte, sans citation au catalogue", attendu: "AVERT", obtenu: nommeZ.some((f) => f.regle === "K14" && f.statut === "AVERT" && /oracle-z/.test(f.message)) ? "AVERT" : statutR(nommeZ, "K14") });
  const citeZ = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-x.mjs <f>")], "Voir aussi `oracle-z.mjs` pour la recette."), [svcR({ point_entree: "node oracles\\oracle-x.mjs <f> · node oracles\\oracle-z.mjs" })]);
  resultats.push({ fixture: "K14/remède joué : la citation ajoutée au catalogue, K14 passe", attendu: "PASS", obtenu: statutR(citeZ, "K14") });
  const braces = jugerR(readme("0.0.2", [ligneTab("Service alpha", "node oracles\\oracle-{x,z}.mjs <f>")], "Voir `oracle-z.mjs`."), [svcR({ point_entree: "node oracles\\oracle-{x,z}.mjs <f>" })]);
  resultats.push({ fixture: "K14/vert : un chemin à accolades (oracle-{x,z}.mjs) cite chacun de ses exécutables", attendu: "PASS", obtenu: statutR(braces, "K14") });
  const sansDepotR = validerCouvertureReadme(metaR, [svcR({ forge: "beta" })], parcR);
  resultats.push({ fixture: "K11/SKIP : forge absente du parc, jamais FAIL ni PASS", attendu: "SKIP", obtenu: statutR(sansDepotR, "K11") });

  rmSync(dossier, { recursive: true, force: true });
  const rates = resultats.filter((r) => r.attendu !== r.obtenu);
  console.log(JSON.stringify({ oracle: "oracle-catalogues", mode: "self-test", verdict: rates.length ? "FAIL" : "PASS", resultats }, null, 1));
  process.exit(rates.length ? 1 : 0);
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  if (process.argv.includes("--self-test")) selfTest();
  const racine = process.argv[2] || join(ICI, "..");
  let findings;
  try {
    findings = [
      ...validerCatalogue(join(racine, "catalogues", "catalogue.jsonl")),
      ...validerEnvironnement(racine),
    ];
  } catch (e) {
    console.log(JSON.stringify({ oracle: "oracle-catalogues", verdict: "ERREUR", message: String(e) }, null, 1));
    process.exit(2);
  }
  const echecs = findings.filter((f) => f.statut === "FAIL").length;
  console.log(JSON.stringify({
    oracle: "oracle-catalogues", version: "1.2.0", verdict: echecs ? "FAIL" : "PASS", findings,
    non_juge: [
      "la véracité métier des preuves citées (relève des oracles des forges)", "la qualité des intentions rédigées",
      "les comptes écrits en prose d'une preuve (« 20 entrées d'oracle, 61 règles ») : ils se recomptent à la main sur le self-test de la forge, aucun contrôle ne les rejoue",
      "les services qu'un README décrit en prose sans nommer un exécutable ni les présenter en tableau",
    ],
  }, null, 1));
  process.exit(echecs ? 1 : 0);
}
