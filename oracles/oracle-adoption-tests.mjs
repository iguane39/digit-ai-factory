#!/usr/bin/env node
/**
 * oracle-adoption-tests.mjs — le SOLDE D'ADOPTION des cas de tests dérivés, rendu opposable
 * (R-40, `REGLES-PROJET.md` §T ; item TF-0349, étude 20260817j verdict O3).
 *
 * Pourquoi. `forge-tests --livrables` dérive des « Cahiers de tests » qui se déclarent
 * eux-mêmes PROPOSITIONS (`forge_tests\livrables\cahiers.py` l.20-23). Mesuré sur pièces le
 * 17/08 : **971 cas dérivés / 0 adopté** sur Produit-11, **680 / 0** sur COMPTA. Un
 * cahier de 971 cas remis à un client atteste une couverture que rien n'a jouée — c'est la
 * définition du contrôle jamais joué (R-35). Le solde était DÉJÀ calculable : le contrat
 * d'adoption `<projet>\forge\cas-adoptes.jsonl` existe depuis RT-13 (`adoption.py` l.13-28) et
 * personne ne l'opposait. Cet oracle l'oppose.
 *
 * Ce qu'il calcule, CAHIER PAR CAHIER (R-40 al. 1) :
 *
 *     solde = dérivés − adoptés − non_testables motivés − écartés par décision nommée
 *     solde nul  → PASS ;  solde positif → FAIL nommant le cahier, le solde, les trois issues.
 *
 * Les deux contrats lus, tous deux en LECTURE SEULE (G-1 — l'auditeur n'écrit pas chez
 * l'audité) :
 *
 *     <racine>\forge\cas-adoptes.jsonl   {"cas": "F1-3025-3", "test": "e2e/10-nav.spec.ts"}
 *         contrat EXISTANT de forge-tests (`adoption.py` l.15-16) ; la déclaration est
 *         vérifiée comme là-bas : le test cité doit exister, sinon l'adoption est REFUSÉE et
 *         ne solde rien — sans quoi le solde descendrait sur du vide (`adoption.py` l.21-23).
 *     <racine>\forge\cas-ecartes.jsonl   {"cas": …, "statut": "non_testable",
 *                                         "champs_requis": ["…"], "motif": "…"}
 *                                        {"cas": …, "statut": "ecarte",
 *                                         "qui": "…", "quand": "…", "pourquoi": "…"}
 *         sidecar des DEUX AUTRES issues de R-40. R-40 ne nommait aucun fichier pour elles ;
 *         il n'entrent pas dans `cas-adoptes.jsonl`, dont `adoption.py` refuserait chaque
 *         ligne sans `test` (l.74-78) — les mélanger aurait fabriqué du bruit de refus.
 *         Un `non_testable` sans `champs_requis[]` reprend l'idiome RT-6 : il se répare en
 *         FOURNISSANT, pas en écrivant un test — donc sans champs, il n'est pas motivé.
 *
 * Règles (chacune binaire) :
 *   A1  inventaire — les cahiers dérivés sont trouvés sous la cible ; aucun cahier jugeable
 *       = SANS_OBJET MOTIVÉ, jamais un PASS silencieux ;
 *   A2  contrat d'adoption — un cahier qui porte des cas dérivés sans contrat d'adoption
 *       lisible est en défaut (c'est le cas réel « 971 / 0 ») ; une adoption dont le test cité
 *       est introuvable est REFUSÉE et nommée ; une déclaration d'écartement fourvoyée dans
 *       `cas-adoptes.jsonl` est renvoyée vers son sidecar ; un cahier qui affiche ADOPTÉ un
 *       cas que le contrat ne déclare plus signale un contrat périmé ;
 *   A3  solde — le solde de chaque cahier jugé est NUL ; sinon FAIL nommant le cahier, le
 *       solde et les trois issues de R-40 (aucun quatrième état) ;
 *   A4  motifs — un `non_testable` porte ses `champs_requis[]`, un `ecarte` porte sa décision
 *       nommée (qui, quand, pourquoi) ; le champ manquant est NOMMÉ, jamais un « mal motivé »
 *       anonyme. Une issue non motivée ne solde rien : elle reste au reste-à-faire ;
 *   A5  rétroactivité — les cahiers ANTÉRIEURS au 17/08 (jour où R-40 est entrée au contrat)
 *       sont des antériorités DÉCLARÉES, jamais jugées : le rattrapage se fait au prochain run
 *       de chaque produit (`REGLES-PROJET.md` l.13, R-37 al. 3), et l'existant ne se réécrit
 *       pas. Patron repris de DOCTRINE_CLES_COMPLETES (`oracle-conformite-projet.mjs` l.415-467).
 *
 * Appelants (R-35 — une règle sans appelant nommé est une décoration) :
 *   - le pas de l'étape 5 de `references\ETAPES-RUN.md` : la boucle de fermeture bornée ne se
 *     clôt pas tant que le solde d'un cahier est non nul (bornes inchangées : ≤ 5 cycles
 *     extensibles à 7, G-2 absolue) ;
 *   - le contrat « prêt client » (`references\ETAPES-RUN.md`) : « traçabilité exigences→tests
 *     100 % » s'entend en cas EXÉCUTÉS — ce verdict en est le critère mesurable ;
 *   - `oracles\self-tests.mjs` pour sa recette à double sens (invariant I1).
 *
 * Usage : node oracle-adoption-tests.mjs <racine-projet>   → verdict JSON, exit 0/1/2
 *         node oracle-adoption-tests.mjs --self-test       → fixtures double sens
 */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { tmpdir } from "node:os";

// Jour où R-40 est entrée au contrat (`REGLES-PROJET.md` §T, 17/08). Tout cahier antérieur est
// une antériorité déclarée : la règle s'oppose au PROCHAIN cahier, jamais au passé réécrit.
const DOCTRINE_R40 = "2026-08-17";
const CONTRAT_ADOPTIONS = "forge/cas-adoptes.jsonl";
const CONTRAT_ECARTES = "forge/cas-ecartes.jsonl";
const RE_CAHIER = /cahier de tests .*- (\d{4})(\d{2})(\d{2})[a-z]?\.md$/i;
const RE_REF_CAS = /^\*\*([A-Z][A-Z0-9]*-\d{4}-\d+) — /;
const IGNORES = new Set(["node_modules", ".git", "old", "dist", "build", "coverage",
  "__pycache__", ".venv", "venv", ".next", ".pytest_cache", "target"]);
const TROIS_ISSUES = "trois issues et pas une quatrième (R-40 al. 1) : ADOPTER le cas " +
  `(l'écrire, l'exécuter, le déclarer dans ${CONTRAT_ADOPTIONS}), le déclarer non_testable ` +
  `AVEC ses champs_requis[] dans ${CONTRAT_ECARTES}, ou l'ÉCARTER par décision humaine nommée ` +
  "(qui, quand, pourquoi) — le silence n'est pas un état";

const NON_JUGE = [
  "la QUALITÉ d'un cas adopté : un test faible fait descendre le solde et se fait prendre " +
    "ailleurs, par les seuils de mutation de forge-tests (`seuils.py` l.48-70)",
  "la SINCÉRITÉ d'un motif de non_testable ou d'une décision d'écartement — les champs sont " +
    "vérifiés présents, leur bien-fondé reste un jugement humain",
  "l'EXÉCUTION RÉELLE des cas adoptés : cet oracle constate une déclaration et l'existence du " +
    "fichier de test cité, jamais que la suite a tourné ni qu'elle est verte — c'est la recette " +
    "du produit (forge-tests exit 0/3, seuils tenus) qui le prouve",
  "les cahiers antérieurs au " + DOCTRINE_R40 + " et ceux rangés sous `old\\` : antériorités, " +
    "rattrapées au prochain run de leur produit (R-37 al. 3), jamais jugées ici",
  "le contenu du rapport d'exécution attendu dans la famille `XX-tests` d'`output\\` (R-39, " +
    "R-36) : sa forme relève de `oracle-synthese`, pas de ce solde",
];

// ── lecture des cahiers dérivés ────────────────────────────────────────────────────
/** Cahiers dérivés sous la cible, `old\` exclu — profondeur bornée (un produit n'enterre pas
 *  ses livrables à dix niveaux, et un walk sans borne sur `C:\dev` ne revient pas). */
function trouverCahiers(racine, profondeur = 0, trouves = []) {
  if (profondeur > 6 || !existsSync(racine)) return trouves;
  let entrees = [];
  try { entrees = readdirSync(racine, { withFileTypes: true }); } catch { return trouves; }
  for (const e of entrees) {
    const chemin = join(racine, e.name);
    if (e.isDirectory()) {
      if (IGNORES.has(e.name.toLowerCase()) || e.name.startsWith(".")) continue;
      trouverCahiers(chemin, profondeur + 1, trouves);
    } else if (RE_CAHIER.test(e.name)) trouves.push(chemin);
  }
  return trouves;
}

/** Un cahier lu comme une VUE : ses cas, leurs statuts affichés, son tableau d'exhaustivité.
 *  Le format est celui que `cahiers.py` écrit (l.555-566 pour les cas, l.631-634 pour le
 *  tableau) — le lire, c'est refuser de redemander au produit ce que le cahier porte déjà. */
function lireCahier(chemin) {
  const texte = readFileSync(chemin, "utf8");
  const lignes = texte.split(/\r?\n/);
  const sceau = texte.match(/genere_le:\s*(\d{4}-\d{2}-\d{2})/);
  const nom = basename(chemin);
  const mille = nom.match(RE_CAHIER);
  const date = sceau ? sceau[1] : mille ? `${mille[1]}-${mille[2]}-${mille[3]}` : "";
  const refs = [];
  const statuts = new Map();
  let courant = null;
  let tableau = null;
  for (let i = 0; i < lignes.length; i += 1) {
    const l = lignes[i];
    const ref = l.match(RE_REF_CAS);
    if (ref) { courant = ref[1]; refs.push(courant); continue; }
    if (l.startsWith("- Statut : ") && courant) {
      const statut = /\*\*ADOPT[ÉE]\*\*/i.test(l) ? "adopte"
        : /adoption REFUS[ÉE]E/i.test(l) ? "refuse" : "proposition";
      statuts.set(courant, statut);
      courant = null;
      continue;
    }
    if (l.startsWith("| éléments inventoriés")) {
      const chiffres = (lignes[i + 2] || "").split("|").map((c) => c.trim()).filter(Boolean);
      if (chiffres.length >= 4 && chiffres.every((c) => /^\d+$/.test(c))) {
        tableau = {
          elements: Number(chiffres[0]), derives: Number(chiffres[1]),
          adoptes: Number(chiffres[2]), elements_non_couverts: Number(chiffres[3]),
        };
      }
    }
  }
  return { chemin, nom, date, refs, statuts, tableau };
}

// ── lecture des deux contrats (LECTURE SEULE, G-1) ─────────────────────────────────
function lireJsonl(fichier) {
  if (!existsSync(fichier)) return null;
  return readFileSync(fichier, "utf8").split(/\r?\n/).map((l, i) => ({ ligne: i + 1, brut: l }))
    .filter((e) => e.brut.trim())
    .map((e) => { try { return { ...e, ...JSON.parse(e.brut) }; } catch { return { ...e, invalide: true }; } });
}

/** Adoptions déclarées par le PROJET, vérifiées comme `adoption.py` les vérifie. */
function lireAdoptions(racine) {
  const entrees = lireJsonl(join(racine, CONTRAT_ADOPTIONS));
  if (entrees === null) return null;
  const adoptions = new Map();
  const anomalies = [];
  for (const e of entrees) {
    if (e.invalide) { anomalies.push({ ligne: e.ligne, message: "ligne non-JSON — déclaration illisible, donc inexistante" }); continue; }
    const ref = String(e.cas || "").trim();
    if (!ref) { anomalies.push({ ligne: e.ligne, message: "déclaration sans champ « cas » — aucune référence à solder" }); continue; }
    const statutDeclare = String(e.statut || "").trim();
    if (statutDeclare && statutDeclare !== "adopte") {
      anomalies.push({ ligne: e.ligne, message: `« ${ref} » déclaré « ${statutDeclare} » dans ${CONTRAT_ADOPTIONS} — ce fichier ne porte QUE des adoptions (adoption.py refuserait la ligne, faute de test cité) ; les non_testable et les écartés se déclarent dans ${CONTRAT_ECARTES}` });
      continue;
    }
    const test = String(e.test || "").trim();
    if (!test) { adoptions.set(ref, { statut: "refuse", test: "", motif: "aucun test cité — une adoption sans support ne se vérifie pas (adoption.py l.74-78)" }); continue; }
    if (!existsSync(join(racine, test))) {
      adoptions.set(ref, { statut: "refuse", test, motif: `le test cité est introuvable (${test}) — adoption refusée, sans quoi le solde descendrait sur du vide (adoption.py l.21-23)` });
      continue;
    }
    adoptions.set(ref, { statut: "adopte", test, motif: "" });
  }
  return { adoptions, anomalies };
}

/** Les deux autres issues de R-40, avec leurs motifs — le champ manquant est nommé. */
function lireEcartes(racine) {
  const entrees = lireJsonl(join(racine, CONTRAT_ECARTES));
  if (entrees === null) return { ecartes: new Map(), anomalies: [] };
  const ecartes = new Map();
  const anomalies = [];
  for (const e of entrees) {
    if (e.invalide) { anomalies.push({ ligne: e.ligne, message: "ligne non-JSON — déclaration illisible, donc inexistante" }); continue; }
    const ref = String(e.cas || "").trim();
    if (!ref) { anomalies.push({ ligne: e.ligne, message: "déclaration sans champ « cas » — aucune référence à solder" }); continue; }
    const statut = String(e.statut || "").trim();
    if (statut === "non_testable") {
      const champs = Array.isArray(e.champs_requis) ? e.champs_requis.filter((c) => String(c || "").trim()) : [];
      ecartes.set(ref, champs.length
        ? { statut: "non_testable", motive: true, detail: `champs_requis : ${champs.join(", ")}` }
        : { statut: "non_testable", motive: false, detail: "champs_requis[] absent ou vide — l'idiome RT-6 se répare en FOURNISSANT les champs, pas en écrivant un test ; sans eux, le cas n'est pas motivé et ne solde rien" });
      continue;
    }
    if (statut === "ecarte") {
      const manquants = ["qui", "quand", "pourquoi"].filter((c) => !String(e[c] || "").trim());
      ecartes.set(ref, manquants.length
        ? { statut: "ecarte", motive: false, detail: `décision humaine incomplète — champ(s) manquant(s) : ${manquants.join(", ")} (R-40 al. 1 exige qui, quand, pourquoi)` }
        : { statut: "ecarte", motive: true, detail: `écarté par ${e.qui} le ${e.quand}` });
      continue;
    }
    anomalies.push({ ligne: e.ligne, message: `« ${ref} » porte le statut « ${statut || "(absent)"} » — attendus : « non_testable » ou « ecarte »` });
  }
  return { ecartes, anomalies };
}

/** Racine du PRODUIT (celle qui porte `forge\`). Cas réel Produit-11 : les cahiers sont déposés hors
 *  du produit (G-1) dans un dossier frère, et la cible passée au run est le dossier PARENT des
 *  deux — le contrat d'adoption vit alors un cran plus bas. Il se trouve, il ne se devine pas :
 *  plusieurs candidats = défaut nommé, jamais un choix arbitraire. */
function racineProduit(cible) {
  if (existsSync(join(cible, "forge"))) return { racine: cible, candidats: [cible] };
  let candidats = [];
  try {
    candidats = readdirSync(cible, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !IGNORES.has(e.name.toLowerCase()) && !e.name.startsWith("."))
      .map((e) => join(cible, e.name))
      .filter((d) => existsSync(join(d, "forge")));
  } catch { /* cible illisible : traitée comme sans forge\ */ }
  return { racine: candidats.length === 1 ? candidats[0] : cible, candidats };
}

// ── jugement ───────────────────────────────────────────────────────────────────────
function juger(cible) {
  const findings = [];
  const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
  const ok = (regle, ou, message) => findings.push({ regle, statut: "PASS", ou, message });
  const so = (regle, message) => findings.push({ regle, statut: "SANS_OBJET", ou: "-", message });
  const bref = (chemin) => { const r = relative(cible, chemin); return r && !r.startsWith("..") ? r : chemin; };
  /** Un cahier de 971 cas ne produit pas 971 findings : les cas sont nommés, puis comptés. */
  const echantillon = (liste, n = 5) => liste.slice(0, n).join(", ") + (liste.length > n ? ` … et ${liste.length - n} autre(s)` : "");

  if (!existsSync(cible)) {
    return { verdict: "SANS_OBJET", findings, mesure: null,
      motif: `cible introuvable : ${cible} — usage : node oracle-adoption-tests.mjs <racine-projet>` };
  }

  const { racine, candidats } = racineProduit(cible);
  if (candidats.length > 1) {
    ko("A2", bref(cible), `${candidats.length} racines produit candidates (chacune porte un forge\\) : ${candidats.map(bref).join(", ")} — le contrat d'adoption à opposer ne se devine pas, viser la racine du produit`);
  }

  // ── A1 · inventaire, et A5 · antériorités déclarées ───────────────────────────────
  const tous = trouverCahiers(cible).map(lireCahier);
  const anteriorites = tous.filter((c) => !c.date || c.date < DOCTRINE_R40);
  const juges = tous.filter((c) => c.date && c.date >= DOCTRINE_R40);
  if (anteriorites.length) {
    so("A5", `${anteriorites.length} cahier(s) antérieur(s) au ${DOCTRINE_R40} en antériorité DÉCLARÉE, jamais jugée — rattrapage au prochain run de ce produit (R-37 al. 3) : ${echantillon(anteriorites.map((c) => `${c.nom} (${c.date || "date illisible"}, ${c.refs.length} cas)`), 3)}`);
  }
  if (!tous.length) {
    return { verdict: "SANS_OBJET", findings, racine, mesure: { cahiers: 0, anteriorites: 0 },
      motif: `aucun cahier de tests dérivé sous ${cible} — R-40 s'applique aux cas DÉRIVÉS par forge-tests ; sans cahier, il n'y a pas de solde à opposer (et non : pas de solde nul)` };
  }
  if (!juges.length) {
    return { verdict: "SANS_OBJET", findings, racine,
      mesure: { cahiers: tous.length, anteriorites: anteriorites.length, juges: 0 },
      motif: `${tous.length} cahier(s) trouvé(s), tous ANTÉRIEURS au ${DOCTRINE_R40} : antériorités déclarées, jamais jugées — R-40 s'oppose au prochain cahier dérivé, l'existant ne se réécrit pas` };
  }
  ok("A1", bref(cible), `${juges.length} cahier(s) jugé(s) (dérivé(s) le ${DOCTRINE_R40} ou après)${anteriorites.length ? `, ${anteriorites.length} antériorité(s) déclarée(s)` : ""}`);

  // ── A2 · les contrats ─────────────────────────────────────────────────────────────
  const lu = lireAdoptions(racine);
  const adoptions = lu ? lu.adoptions : new Map();
  const { ecartes, anomalies: anomaliesEcartes } = lireEcartes(racine);
  const derivesTotal = juges.reduce((n, c) => n + c.refs.length, 0);
  if (!lu) {
    if (derivesTotal) {
      ko("A2", `${bref(racine)}\\${CONTRAT_ADOPTIONS.replace("/", "\\")}`,
        `aucun contrat d'adoption : les ${derivesTotal} cas dérivés des cahiers jugés sont tous restés PROPOSITIONS — c'est le cas réel du 17/08 (Produit-11 : 971 dérivés / 0 adopté) que R-40 ferme. Créer le contrat côté PROJET (la forge ne le remplit jamais à sa place, G-1) : une ligne {"cas": "<ref>", "test": "<chemin>"} par cas écrit et exécuté`);
    } else so("A2", `pas de contrat d'adoption, mais aucun cas dérivé à solder dans les cahiers jugés`);
  } else ok("A2", `${bref(racine)}\\${CONTRAT_ADOPTIONS.replace("/", "\\")}`, `contrat d'adoption lu : ${[...adoptions.values()].filter((a) => a.statut === "adopte").length} adoption(s) vérifiée(s) sur ${adoptions.size} déclaration(s)`);
  for (const a of lu ? lu.anomalies : []) ko("A2", `${CONTRAT_ADOPTIONS} ligne ${a.ligne}`, a.message);
  for (const a of anomaliesEcartes) ko("A2", `${CONTRAT_ECARTES} ligne ${a.ligne}`, a.message);
  const refuses = [...adoptions.entries()].filter(([, a]) => a.statut === "refuse");
  for (const [ref, a] of refuses.slice(0, 5)) ko("A2", `${CONTRAT_ADOPTIONS} → ${ref}`, `adoption REFUSÉE : ${a.motif}`);
  if (refuses.length > 5) ko("A2", CONTRAT_ADOPTIONS, `${refuses.length - 5} autre(s) adoption(s) refusée(s), même motif de fond : une déclaration sans support vérifiable ne solde rien`);

  // ── A3 · le solde, cahier par cahier · A4 · motifs des issues non adoptées ────────
  const parCahier = [];
  const refsJugees = new Set(juges.flatMap((c) => c.refs));
  const nonMotives = [];
  for (const cahier of juges) {
    const refs = cahier.refs;
    const adoptes = refs.filter((r) => adoptions.get(r)?.statut === "adopte");
    const nt = refs.filter((r) => ecartes.get(r)?.statut === "non_testable" && ecartes.get(r).motive);
    const ec = refs.filter((r) => ecartes.get(r)?.statut === "ecarte" && ecartes.get(r).motive);
    const boiteux = refs.filter((r) => ecartes.get(r) && !ecartes.get(r).motive);
    nonMotives.push(...boiteux.map((r) => ({ ref: r, cahier: cahier.nom, detail: ecartes.get(r).detail })));
    // Un cahier qui AFFICHE « ADOPTÉ » un cas que le contrat ne déclare plus : la vue a été
    // dérivée quand la déclaration existait, elle a disparu depuis. Nommé, jamais silencieux.
    const perimes = refs.filter((r) => cahier.statuts.get(r) === "adopte" && adoptions.get(r)?.statut !== "adopte");
    if (perimes.length) {
      ko("A2", bref(cahier.chemin), `${perimes.length} cas affiché(s) ADOPTÉ dans le cahier alors que ${CONTRAT_ADOPTIONS} ne le(s) déclare plus : ${echantillon(perimes)} — contrat périmé ou déclaration retirée ; le cahier est une VUE, c'est la source qui fait foi`);
    }
    const solde = refs.length - adoptes.length - nt.length - ec.length;
    parCahier.push({ cahier: bref(cahier.chemin), date: cahier.date, derives: refs.length,
      adoptes: adoptes.length, non_testables_motives: nt.length, ecartes_nommes: ec.length,
      issues_non_motivees: boiteux.length, solde,
      tableau_du_cahier: cahier.tableau });
    if (solde > 0) {
      const restants = refs.filter((r) => adoptions.get(r)?.statut !== "adopte" && !(ecartes.get(r)?.motive));
      ko("A3", bref(cahier.chemin), `solde d'adoption NON NUL : ${solde} cas sur ${refs.length} dérivés ne sont ni adoptés (${adoptes.length}), ni non_testable motivés (${nt.length}), ni écartés par décision nommée (${ec.length}) — ce cahier porte un reste-à-faire, pas un livrable clos (R-40 al. 1). Cas en attente : ${echantillon(restants)}. ${TROIS_ISSUES}`);
    } else if (solde < 0) {
      ko("A3", bref(cahier.chemin), `solde NÉGATIF (${solde}) : plus de déclarations que de cas dérivés pour ce cahier — un cas est déclaré deux fois, ou le cahier a été édité à la main (son sceau le dirait)`);
    } else {
      ok("A3", bref(cahier.chemin), `solde nul : ${refs.length} dérivés = ${adoptes.length} adoptés + ${nt.length} non_testable motivés + ${ec.length} écartés nommés`);
    }
  }
  for (const m of nonMotives.slice(0, 5)) ko("A4", `${CONTRAT_ECARTES} → ${m.ref}`, `issue non motivée, donc ne solde rien : ${m.detail}`);
  if (nonMotives.length > 5) ko("A4", CONTRAT_ECARTES, `${nonMotives.length - 5} autre(s) issue(s) non motivée(s)`);
  if (!nonMotives.length && ecartes.size) ok("A4", `${bref(racine)}\\${CONTRAT_ECARTES.replace("/", "\\")}`, `${ecartes.size} issue(s) non-adoption motivée(s) : champs_requis[] ou décision nommée présents`);

  // Références déclarées qu'aucun cahier jugé ne porte : déclarées, jamais silencieuses —
  // elles signalent un cas renommé ou un contrat périmé (`adoption.py` l.100-102).
  const inconnues = [...adoptions.keys(), ...ecartes.keys()].filter((r) => !refsJugees.has(r)).sort();

  const mesure = {
    racine_produit: racine,
    cahiers_juges: juges.length,
    cahiers_anteriorites: anteriorites.length,
    derives_total: derivesTotal,
    adoptes_total: parCahier.reduce((n, c) => n + c.adoptes, 0),
    non_testables_motives_total: parCahier.reduce((n, c) => n + c.non_testables_motives, 0),
    ecartes_nommes_total: parCahier.reduce((n, c) => n + c.ecartes_nommes, 0),
    solde_total: parCahier.reduce((n, c) => n + c.solde, 0),
    par_cahier: parCahier,
    references_declarees_inconnues: inconnues,
  };
  const fail = findings.some((f) => f.statut === "FAIL");
  return { verdict: fail ? "FAIL" : "PASS", findings, racine, mesure };
}

// ── self-test : fixtures double sens ───────────────────────────────────────────────
function selfTest() {
  const base = mkdtempSync(join(tmpdir(), "adoption-"));
  const cas = [];

  /** Cahier au FORMAT EXACT de `cahiers.py` (sceau, tableau d'exhaustivité, blocs de cas). */
  const cahier = ({ produit = "demo", date = "2026-08-17", famille = "fonctionnels", refs }) => {
    const adoptes = refs.filter((r) => r.statut === "adopte").length;
    const lignes = [
      "<!-- SCEAU FORGE-TESTS", `  produit: ${produit}`, `  genere_le: ${date}`,
      "  rapport_source: rapport-forge-tests.json", "-->", "",
      `# ${produit} — cahier de tests ${famille}`, "",
      "## Exhaustivité — définition opposable", "",
      "| éléments inventoriés | cas dérivés | cas adoptés par le projet | éléments non couverts (déclarés) |",
      "| --- | --- | --- | --- |",
      `| ${refs.length} | ${refs.length} | ${adoptes} | 0 |`, "",
      "## F1 — Parcours bout en bout", "",
    ];
    for (const r of refs) {
      const statut = r.statut === "adopte" ? `**ADOPTÉ** par le projet — test : \`${r.test}\``
        : r.statut === "refuse" ? "**adoption REFUSÉE** — le test cité est introuvable"
        : "**Proposition (non adoptée)** — ce cas n'est pas « non joué » : il n'appartient pas encore à la suite du projet";
      lignes.push(`**${r.ref} — cas dérivé de démonstration**`, "", `- Statut : ${statut}`,
        "- Préconditions : le jeu nominal est chargé", "- Étapes :", "  1. exercer l'élément",
        "- Résultat attendu : l'effet est observable", "");
    }
    return lignes.join("\n");
  };

  /** Un projet de fixture : cahiers déposés, contrats écrits, tests réels créés si demandé. */
  const projet = (nom, { cahiers = [], adoptions = null, ecartes = null, tests = [], sousDossierCahiers = "proposition-tests/livrables", produitDans = "" } = {}) => {
    const cible = join(base, nom);
    const racine = produitDans ? join(cible, produitDans) : cible;
    mkdirSync(join(cible, sousDossierCahiers), { recursive: true });
    mkdirSync(join(racine, "forge"), { recursive: true });
    for (const c of cahiers) {
      writeFileSync(join(cible, sousDossierCahiers, `demo - Cahier de tests ${c.famille || "fonctionnels"} - ${(c.date || "2026-08-17").replace(/-/g, "")}a.md`), cahier(c));
    }
    for (const t of tests) {
      mkdirSync(join(racine, t.split("/").slice(0, -1).join("/")), { recursive: true });
      writeFileSync(join(racine, t), "// test réel de fixture\n");
    }
    if (adoptions) writeFileSync(join(racine, "forge", "cas-adoptes.jsonl"), adoptions.map((l) => typeof l === "string" ? l : JSON.stringify(l)).join("\n") + "\n");
    if (ecartes) writeFileSync(join(racine, "forge", "cas-ecartes.jsonl"), ecartes.map((l) => JSON.stringify(l)).join("\n") + "\n");
    return cible;
  };

  const prop = (ref) => ({ ref, statut: "proposition" });
  const aFail = (r, regle, fragment) => r.findings.some((f) => f.regle === regle && f.statut === "FAIL" && (!fragment || f.message.includes(fragment)));

  // ── vert · le solde se solde par les TROIS issues, et il tombe à zéro ─────────────
  let r = juger(projet("vert-solde-nul", {
    cahiers: [{ refs: [prop("F1-0001-1"), prop("F1-0001-2"), prop("F1-0002-1"), prop("F1-0003-1")] }],
    tests: ["e2e/10-navigation.spec.ts"],
    adoptions: [{ cas: "F1-0001-1", test: "e2e/10-navigation.spec.ts" }, { cas: "F1-0001-2", test: "e2e/10-navigation.spec.ts" }],
    ecartes: [
      { cas: "F1-0002-1", statut: "non_testable", champs_requis: ["FORGE_TESTS_DSN"], motif: "aucune base joignable ici" },
      { cas: "F1-0003-1", statut: "ecarte", qui: "Nicolas (mandat humain)", quand: "2026-08-17", pourquoi: "écran retiré du MVP" },
    ],
  }));
  cas.push(["vert  — solde nul par les trois issues (2 adoptés, 1 non_testable, 1 écarté)",
    r.verdict === "PASS" && r.mesure.solde_total === 0, r.verdict]);
  cas.push(["vert  — mesure publiée : le solde est LISIBLE par cahier",
    r.mesure.par_cahier.length === 1 && r.mesure.par_cahier[0].derives === 4 && r.mesure.par_cahier[0].adoptes === 2, r.verdict]);

  // ── rouge · le cas réel de Produit-11, à chiffres réduits : cahier dérivé, contrat absent ─
  r = juger(projet("rouge-971-sur-0", {
    cahiers: [{ refs: Array.from({ length: 9 }, (_, i) => prop(`F1-0001-${i + 1}`)) }],
  }));
  cas.push(["A2    — cas réel Produit-11 réduit (9 dérivés / 0 adopté) : contrat d'adoption ABSENT",
    aFail(r, "A2", "aucun contrat d'adoption") && aFail(r, "A2", "971"), r.verdict]);
  cas.push(["A3    — le même : solde 9 nommé avec le cahier et les trois issues R-40",
    aFail(r, "A3", "solde d'adoption NON NUL : 9 cas") && aFail(r, "A3", "trois issues")
      && r.findings.some((f) => f.regle === "A3" && f.statut === "FAIL" && f.ou.includes("Cahier de tests")), r.verdict]);

  // ── rouge A2 · une adoption dont le test n'existe pas ne solde RIEN ───────────────
  r = juger(projet("rouge-test-fantome", {
    cahiers: [{ refs: [prop("F1-0001-1")] }],
    adoptions: [{ cas: "F1-0001-1", test: "e2e/jamais-ecrit.spec.ts" }],
  }));
  cas.push(["A2    — adoption refusée : le test cité est introuvable (solde sur du vide)",
    aFail(r, "A2", "jamais-ecrit.spec.ts") && aFail(r, "A3", "solde d'adoption NON NUL : 1 cas"), r.verdict]);

  // ── rouge A4 · non_testable sans champs_requis : l'idiome RT-6 n'est pas tenu ─────
  r = juger(projet("rouge-non-testable-nu", {
    cahiers: [{ refs: [prop("F1-0001-1")] }],
    adoptions: [],
    ecartes: [{ cas: "F1-0001-1", statut: "non_testable", motif: "compliqué" }],
  }));
  cas.push(["A4    — non_testable sans champs_requis[] : non motivé, ne solde rien",
    aFail(r, "A4", "champs_requis[] absent ou vide") && aFail(r, "A3"), r.verdict]);

  // ── rouge A4 · un écartement sans décision nommée : le champ manquant est NOMMÉ ───
  r = juger(projet("rouge-ecarte-anonyme", {
    cahiers: [{ refs: [prop("F1-0001-1")] }],
    adoptions: [],
    ecartes: [{ cas: "F1-0001-1", statut: "ecarte", quand: "2026-08-17", pourquoi: "hors périmètre" }],
  }));
  cas.push(["A4    — écartement sans décision nommée : champ « qui » nommé au finding",
    aFail(r, "A4", "champ(s) manquant(s) : qui"), r.verdict]);

  // ── rouge A2 · une issue de R-40 fourvoyée dans le contrat d'adoption ─────────────
  r = juger(projet("rouge-sidecar-confondu", {
    cahiers: [{ refs: [prop("F1-0001-1")] }],
    adoptions: [{ cas: "F1-0001-1", statut: "non_testable", champs_requis: ["DSN"] }],
  }));
  cas.push(["A2    — déclaration d'écartement dans cas-adoptes.jsonl : renvoyée au sidecar",
    aFail(r, "A2", "cas-ecartes.jsonl"), r.verdict]);

  // ── rouge A2 · le cahier affiche ADOPTÉ ce que le contrat ne déclare plus ─────────
  r = juger(projet("rouge-contrat-perime", {
    cahiers: [{ refs: [{ ref: "F1-0001-1", statut: "adopte", test: "e2e/10-navigation.spec.ts" }] }],
    adoptions: [],
  }));
  cas.push(["A2    — cahier affichant ADOPTÉ un cas que le contrat ne déclare plus",
    aFail(r, "A2", "affiché(s) ADOPTÉ dans le cahier"), r.verdict]);

  // ── vert A5 · MÊME cahier rouge, daté de la veille : antériorité, jamais jugée ────
  r = juger(projet("vert-anteriorite", {
    cahiers: [{ date: "2026-08-14", refs: Array.from({ length: 9 }, (_, i) => prop(`F1-0001-${i + 1}`)) }],
  }));
  cas.push(["A5    — contre-épreuve : les 9 mêmes cas datés du 14/08 → SANS_OBJET, jamais FAIL",
    r.verdict === "SANS_OBJET" && !r.findings.some((f) => f.statut === "FAIL")
      && r.findings.some((f) => f.regle === "A5" && f.statut === "SANS_OBJET"), r.verdict]);

  // ── vert A1 · aucun cahier : SANS_OBJET MOTIVÉ, jamais un PASS silencieux ─────────
  r = juger(projet("vert-sans-cahier", {}));
  cas.push(["A1    — aucun cahier dérivé : SANS_OBJET motivé (pas un solde nul)",
    r.verdict === "SANS_OBJET" && /aucun cahier de tests dérivé/.test(r.motif || ""), r.verdict]);

  // ── vert · forme réelle de Produit-11 : cahiers hors produit, contrat un cran plus bas ──
  r = juger(projet("vert-forme-bav2", {
    produitDans: "Produit-11",
    cahiers: [{ refs: [prop("F1-0001-1")] }],
    tests: ["e2e/10-navigation.spec.ts"],
    adoptions: [{ cas: "F1-0001-1", test: "e2e/10-navigation.spec.ts" }],
  }));
  cas.push(["vert  — forme Produit-11 : cahiers déposés hors produit (G-1), contrat trouvé sous le produit",
    r.verdict === "PASS" && r.mesure.solde_total === 0 && r.mesure.racine_produit.endsWith("Produit-11"), r.verdict]);

  let ok = 0;
  for (const [nom, tenu, verdict] of cas) {
    console.log(`  [${tenu ? "OK    " : "ECHEC "}] ${nom} (verdict ${verdict})`);
    if (tenu) ok += 1;
  }
  console.log(`self-test adoption-tests : ${ok}/${cas.length}`);
  return ok === cas.length ? 0 : 1;
}

// ── entrée ─────────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.includes("--self-test")) process.exit(selfTest());

const cible = args.find((a) => !a.startsWith("--"));
if (!cible) {
  process.stdout.write(JSON.stringify({
    oracle: "oracle-adoption-tests", version: "1.0.0", verdict: "SANS_OBJET",
    motif: "aucune cible : usage — node oracle-adoption-tests.mjs <racine-projet> | --self-test",
    findings: [], non_juge: NON_JUGE,
  }, null, 2) + "\n");
  process.exit(2);
}
const res = juger(cible);
process.stdout.write(JSON.stringify({
  oracle: "oracle-adoption-tests", version: "1.0.0", cible,
  regle: "R-40 (REGLES-PROJET.md §T, TF-0349)",
  verdict: res.verdict, findings: res.findings, mesure: res.mesure,
  ...(res.motif ? { motif: res.motif } : {}), non_juge: NON_JUGE,
}, null, 2) + "\n");
process.exit(res.verdict === "PASS" ? 0 : res.verdict === "FAIL" ? 1 : 2);
