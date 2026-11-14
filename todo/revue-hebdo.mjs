#!/usr/bin/env node
/**
 * revue-hebdo.mjs — rend le dossier de la REVUE HEBDOMADAIRE ACCÉLÉRÉE des propositions du registre.
 *
 * Pourquoi (demande humaine du 01/10/2026) : « Mets un système en place de validation accélérée, plus
 * fréquent, toutes les semaines, mais avec un affichage des propositions claires, simples, précis, sur
 * les avantages/inconvénients et impacts + choix de décisions, type a, b, & c comme les décisions du
 * format des prompts de sortie. » L'étude `output\03-etudes\20261001-etude-opportunite-rsi-et-ssl.md`
 * fait entrer chaque amélioration proposée en `candidat` ; sans revue groupée, chaque proposition
 * coûterait un tour humain isolé. Mode opératoire : `references\TODO-FORGE.md`, § « Revue hebdomadaire
 * accélérée ».
 *
 * Ce qu'il fait : il lit `todo\TODO.jsonl`, garde les candidatures qui portent une `fiche_decision`
 * complète (question, avantages, inconvénients, impacts, options a/b/c, recommandation, source), les
 * classe par valeur décroissante, en rend au plus `--max` (7 par défaut) en décisions au format du bloc
 * 3 de `gabarits\RESTITUTION.md`, et nomme les autres. Il n'invente rien : une candidature sans fiche
 * complète est listée « à instruire », avec les champs qui lui manquent.
 *
 * Ce qu'il ne fait pas : décider. La réponse humaine (« D-40 a, D-41 c ») se consigne ensuite par
 * `todo\journaliser.mjs` ; le dossier garde la correspondance D-N → TF-#### dans le journal des revues.
 *
 * Les modèles des fournisseurs tiers (TF-2116) : le dossier joue aussi `oracles\oracle-modeles-tiers.mjs` (borné à 120 s) et
 * ajoute une section avec les identifiants arrêtés, ceux qui s'arrêtent bientôt et l'âge du référentiel ; quand MT4 avertit, la
 * section nomme le geste de session qui le rafraîchit. Cadence MENSUELLE (réponse humaine « A2 & A3 : Tous les mois suffit » du
 * 04/11/2026) : l'oracle ne se rejoue que si le dernier contrôle mesuré du journal a 30 jours ou plus ; sinon la section dit la date
 * du dernier et celle du prochain. `--modeles-tiers-forcer` le rejoue quand même ; `--sans-modeles-tiers` saute la section ;
 * `--modeles-racine`, `--modeles-referentiel` et `--modeles-date` passent leurs options à l'oracle (recette).
 *
 * Usage : node todo\revue-hebdo.mjs --depuis <N> [--max 7] [--registre <TODO.jsonl>] [--sortie <dossier.md>]
 *           [--journal <revues-hebdo.jsonl>] [--sans-modeles-tiers | --modeles-tiers-forcer]
 *         node todo\revue-hebdo.mjs --self-test
 * Sortie : JSON {outil, dossier, decisions[], a_instruire[]} · exit 0, ou 2 si l'entrée manque.
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdtempSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const valeur = (nom, defaut = null) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : defaut; };

/**
 * LE FORMAT B (décision humaine du 17/10/2026, `gabarits\RESTITUTION.md` v2.41.0, règle S78) : une
 * décision se comprend et se tranche sans rien d'autre qu'elle-même. La fiche porte donc l'objet nommé
 * (`de_quoi`, une valeur sensible masquée, première et dernière lettre visibles), ce qui est en jeu
 * (`probleme`, un ou deux chiffres), le motif qui revient à l'humain (`pourquoi_vous`), et pour chaque
 * option ce qui se passe (`effet`), son coût (`cout`) et son retour arrière (`retour`). Les fiches
 * d'avant, à avantages, inconvénients, impacts et exclusions, restent au registre et se listent « à
 * instruire » avec ce qui leur manque : rien n'est rendu qu'on n'ait écrit.
 */
const CHAMPS = ["question", "de_quoi", "probleme", "pourquoi_vous", "options", "recommandation", "source", "ressort"];

/**
 * LE TRI AVANT LA REVUE (règle humaine du 01/10/2026, R-58) : « Je souhaite que les décisions soient
 * analysées à chaque fois pour s'assurer que seules celles où je dois répondre me soient posées. Les
 * autres doivent être mises en oeuvre sans mon intervention, je dois juste être informé des traitements
 * / décisions qui vont être réalisés ou qui ont été réalisés, pour information. » La fiche porte donc
 * `ressort` : {humain: true, motif} quand la décision revient au porteur, {humain: false, pourquoi}
 * sinon. Mesuré sur la première revue du même jour : 6 décisions sur 7 n'avaient pas à être posées.
 */
export const MOTIFS_HUMAINS = {
  depense: "engage une dépense",
  publication: "publie ou pousse hors du poste (R-38)",
  irreversible: "supprime ou fait un geste qu'on ne défait pas",
  doctrine: "crée ou change une règle opposable aux produits, au noyau ou à la gouvernance",
  arbitrage: "choisit entre des options réellement concurrentes, sur une préférence du porteur et non sur un fait",
  produit: "écrit chez un produit autonome, hors run demandé",
};

/** État courant de chaque id : la création, puis chaque `maj` fusionnée dans l'ordre. */
export function etatCourant(texte) {
  const etat = new Map();
  for (const l of texte.split("\n")) {
    if (!l.trim()) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (!e.id) continue;
    if (e.ev === "creation") etat.set(e.id, { statut: "candidat", ...e });
    else if (e.ev === "maj" && etat.has(e.id)) etat.set(e.id, { ...etat.get(e.id), ...e });
  }
  return etat;
}

/** Les champs qui manquent à une fiche pour être rendue sans rien inventer. */
export function manques(f) {
  if (!f || typeof f !== "object") return ["fiche_decision"];
  const m = CHAMPS.filter((c) => f[c] === undefined || f[c] === null || f[c] === "" || (Array.isArray(f[c]) && !f[c].length));
  for (const o of ["a", "b", "c"]) {
    const opt = f.options?.[o];
    if (!opt?.libelle || !opt?.effet || !opt?.cout || !opt?.retour) m.push(`options.${o}`);
  }
  if (f.recommandation && !["a", "b", "c"].includes(f.recommandation)) m.push("recommandation (a, b ou c)");
  if (f.ressort && typeof f.ressort === "object") {
    if (f.ressort.humain === true && !MOTIFS_HUMAINS[f.ressort.motif]) m.push(`ressort.motif (${Object.keys(MOTIFS_HUMAINS).join(", ")})`);
    else if (f.ressort.humain === false && !String(f.ressort.pourquoi || "").trim()) m.push("ressort.pourquoi");
    else if (f.ressort.humain !== true && f.ressort.humain !== false) m.push("ressort.humain (true ou false)");
  }
  return [...new Set(m)];
}

const valeurDe = (e) => Number(e.score?.valeur ?? 0);

/** Une décision au format B du bloc 3 : citation à trois lignes titrées, tableau pleine largeur, repli. */
export function rendreDecision(n, e) {
  const f = e.fiche_decision;
  const q = f.question.trim().replace(/\s*\?*$/, " ?");
  const point = (s) => `${s}`.trim().replace(/[.\s]*$/, ".");
  const cellule = (s) => { const c = `${s}`.trim().replace(/\|/g, "\\|"); return c.charAt(0).toUpperCase() + c.slice(1); };
  const ligne = (o) => `| (${o})${f.recommandation === o ? " *(recommandée)*" : ""} ${cellule(f.options[o].libelle)} | ${cellule(f.options[o].effet)} | ${cellule(f.options[o].cout)} | ${cellule(f.options[o].retour)} |`;
  return [
    `> **D-${n} — ${q} (${e.id})**`,
    ">",
    `> - **De quoi s'agit-il** : ${point(f.de_quoi)}`,
    `> - **Le problème** : ${point(f.probleme)}`,
    `> - **Pourquoi vous** : ${point(f.pourquoi_vous)}`,
    `> - **Recommandation : (${f.recommandation})**${f.pourquoi ? ` — ${point(f.pourquoi)}` : "."} Source consultée : ${point(f.source)}`,
    "",
    "| Option | Ce qui se passe | Coût | Retour arrière |",
    "|---|---|---|---|",
    ligne("a"), ligne("b"), ligne("c"),
    "",
    `> **Sans réponse** : (c), ${point(f.options.c.libelle.charAt(0).toLowerCase() + f.options.c.libelle.slice(1))}`,
    "",
  ].join("\n");
}

export function construire({ texteRegistre, depuis, max = 7, jour }) {
  const candidats = [...etatCourant(texteRegistre).values()].filter((e) => e.statut === "candidat");
  const prets = candidats.filter((e) => !manques(e.fiche_decision).length).sort((x, y) => valeurDe(y) - valeurDe(x));
  const automatiques = prets.filter((e) => e.fiche_decision.ressort.humain === false);
  const humains = prets.filter((e) => e.fiche_decision.ressort.humain === true);
  const retenus = humains.slice(0, max);
  const reportes = humains.slice(max);
  const ligneAuto = (e) => {
    const f = e.fiche_decision;
    return `- ${f.de_quoi || f.rappel || e.titre} Option appliquée : ${f.options[f.recommandation].libelle}. Pourquoi sans vous : ${f.ressort.pourquoi}.`;
  };
  const aInstruire = candidats.filter((e) => e.fiche_decision && manques(e.fiche_decision).length)
    .map((e) => ({ id: e.id, titre: e.titre, manques: manques(e.fiche_decision) }));
  const decisions = retenus.map((e, i) => ({ d: `D-${depuis + i}`, id: e.id }));
  const reponse = decisions.map((x) => `${x.d} a`).join(", ");
  const corps = [
    `# Revue hebdomadaire des propositions — ${jour}`,
    "",
    `${retenus.length} proposition(s) vous reviennent cette semaine, classées par valeur au registre. Chacune dit de quoi il s'agit, le problème et pourquoi il vous revient, puis ses 3 options : ce qui se passe après chaque choix, son coût en complexité et durée, et si l'on peut revenir en arrière.`,
    "",
    retenus.length ? `Pour répondre, une ligne suffit, par exemple : « ${reponse} ». Une décision sans réponse prend son option (c).` : "Aucune proposition ne vous revient cette semaine : rien n'est à trancher.",
    "",
    automatiques.length ? [
      "## Mises en œuvre sans vous, pour information",
      "",
      "Ces propositions ne relèvent d'aucun motif qui vous revienne (dépense, publication, geste irréversible, doctrine, arbitrage de préférence, écriture chez un produit) : la session applique l'option recommandée et vous en rend compte. Vous pouvez revenir sur chacune.",
      "",
      ...automatiques.map(ligneAuto),
      "",
    ].join("\n") : "",
    ...retenus.map((e, i) => rendreDecision(depuis + i, e)),
    reportes.length ? `## Reportées à la semaine suivante\n\n${reportes.map((e) => `- ${e.titre}, valeur ${valeurDe(e)}`).join("\n")}\n` : "",
    aInstruire.length ? `## À instruire avant d'être présentées\n\n${aInstruire.map((x) => `- ${x.titre} — manque : ${x.manques.join(", ")}`).join("\n")}\n` : "",
  ].join("\n").replace(/\n{3,}/g, "\n\n");
  return { corps, decisions, automatiques: automatiques.map((e) => ({ id: e.id, option: e.fiche_decision.recommandation })), reportes: reportes.map((e) => e.id), aInstruire };
}

// ---- TF-2116 (04/11/2026) — LES MODÈLES DES FOURNISSEURS TIERS SE CONTRÔLENT À LA REVUE, AVEC L'ÂGE DU RÉFÉRENTIEL --------------
//
// LE FAIT. `oracles/oracle-modeles-tiers.mjs` (TF-2109, 03/11/2026) croise le calendrier des modèles d'OpenAI et de Gemini
// (`references/MODELES-TIERS.json`) avec les identifiants écrits dans le parc. Il se jouait à la main, et son avertissement MT4
// (référentiel de plus de 30 jours) ne se lisait que si quelqu'un le lançait : un calendrier périmé rend un vert qui ne vaut plus.
// Durée mesurée le 03/11/2026 : 49 s sur 57 dépôts, donc pas au hook d'ouverture, qui doit répondre en moins de 45 s.
//
// LA RÈGLE. La revue hebdomadaire joue l'oracle (processus fils borné à 120 s) et ajoute à son dossier une section qui rend les
// identifiants arrêtés (MT1), ceux qui s'arrêtent bientôt (MT2) et l'âge du référentiel (MT4). Quand MT4 avertit, la section NOMME le
// geste : relire les pages des fournisseurs et redater le référentiel. Ce geste reste celui d'une session, la revue ne le fait pas.
// Un contrôle qui ne s'est pas joué (dépôt introuvable, plus de 120 s, oracle absent) est dit « non mesuré » avec sa raison : la
// section ne se tait jamais.
//
// LA CADENCE (réponse humaine « A2 & A3 : Tous les mois suffit » du 04/11/2026, à l'action A-3 de la synthèse 20261103r). Le
// contrôle coûte 49 à 75 s, et le référentiel n'est déclaré périmé (MT4) qu'à 30 jours : le rejouer chaque semaine ne disait rien de
// plus trois fois sur quatre. La revue lit donc son journal : elle rejoue l'oracle si aucun contrôle MESURÉ n'y figure, ou si le
// dernier a 30 jours ou plus ; sinon la section dit la date du dernier contrôle et celle du prochain, sans jouer l'oracle. Un
// contrôle « non mesuré » ne compte pas : la revue suivante le rejoue.
const ORACLE_MODELES_TIERS = join(ICI, "..", "oracles", "oracle-modeles-tiers.mjs");
export const DELAI_MODELES_TIERS_MS = 120000;
export const CADENCE_MODELES_TIERS_JOURS = 30;

const JOUR_MS = 86400000;
const enClair = (iso) => iso.slice(0, 10).split("-").reverse().join("/");

/** Le contrôle est-il dû ? Lit le journal des revues ; rend { du, dernier, prochain } (dates ISO ou null). Pur. */
export function controleModelesDu({ texteJournal = "", maintenant = new Date(), cadenceJours = CADENCE_MODELES_TIERS_JOURS } = {}) {
  let dernier = null;
  for (const l of texteJournal.split("\n")) {
    if (!l.trim()) continue;
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (e?.modeles_tiers?.mesure === true && e.ts && (!dernier || e.ts > dernier)) dernier = e.ts;
  }
  if (!dernier) return { du: true, dernier: null, prochain: null };
  const prochain = new Date(Date.parse(dernier) + cadenceJours * JOUR_MS).toISOString();
  return { du: maintenant.getTime() >= Date.parse(prochain), dernier, prochain };
}

/** La section quand le contrôle n'est pas dû : elle dit les deux dates, et comment forcer. Pur. */
export function sectionModelesTiersNonDue({ dernier, prochain }) {
  const titre = "## Modèles des fournisseurs tiers, pour information (oracle-modeles-tiers, TF-2116)";
  return { texte: [titre, "", `Contrôle non rejoué cette semaine : la cadence est mensuelle. Dernier contrôle mesuré le ${enClair(dernier)} ; prochain à la première revue à partir du ${enClair(prochain)}. Le forcer : \`--modeles-tiers-forcer\`, ou \`node oracles/oracle-modeles-tiers.mjs\`.`, ""].join("\n"),
    mesure: false, saute: true, dernier, prochain, mt1: null, mt2: null, mt4: null, rafraichir: false };
}

/** Joue l'oracle des modèles tiers en processus fils. Rend { mesure, rapport | raison, duree_s }. */
export function jouerModelesTiers({ racine = null, referentiel = null, date = null, oracle = ORACLE_MODELES_TIERS, delaiMs = DELAI_MODELES_TIERS_MS } = {}) {
  const debut = Date.now();
  const argv = [oracle, "--json", ...(racine ? ["--racine", racine] : []), ...(referentiel ? ["--referentiel", referentiel] : []), ...(date ? ["--date", date] : [])];
  const r = spawnSync(process.execPath, argv, { encoding: "utf8", timeout: delaiMs, maxBuffer: 64 * 1024 * 1024 });
  const duree_s = Math.round((Date.now() - debut) / 1000);
  if (r.error) return { mesure: false, raison: r.error.code === "ETIMEDOUT" ? `l'oracle a dépassé ${delaiMs / 1000} s et a été interrompu` : `l'oracle n'a pas pu être lancé (${r.error.message})`, duree_s };
  let rapport = null;
  try { rapport = JSON.parse(r.stdout); } catch { /* sortie illisible, dite plus bas */ }
  if (!rapport) return { mesure: false, raison: `sortie illisible de l'oracle (code ${r.status}) : ${String(r.stderr || r.stdout || "").trim().slice(0, 160)}`, duree_s };
  if (rapport.verdict === "SKIP") return { mesure: false, raison: rapport.resume || "aucun dépôt à mesurer", duree_s };
  let ref = null;
  try { ref = JSON.parse(readFileSync(rapport.referentiel, "utf8")); } catch { /* un référentiel illisible est déjà un FAIL MT0 du rapport */ }
  return { mesure: true, rapport, ref, duree_s };
}

/** La section du dossier sur les modèles tiers, et ce qu'elle porte pour le journal. Pur. */
export function sectionModelesTiers(m) {
  const titre = "## Modèles des fournisseurs tiers, pour information (oracle-modeles-tiers, TF-2116)";
  if (!m || !m.mesure) {
    return { texte: [titre, "", `**Non mesuré** : ${m?.raison || "le contrôle n'a pas été joué"}. Le calendrier des modèles d'OpenAI et de Gemini n'a donc pas été croisé avec le parc cette semaine ; rejouer \`node oracles/oracle-modeles-tiers.mjs\`.`, ""].join("\n"),
      mesure: false, mt1: null, mt2: null, mt4: null, rafraichir: false };
  }
  const { rapport, ref } = m;
  const trouves = (regle, statut) => (rapport.findings || []).filter((f) => f.regle === regle && (!statut || f.statut === statut));
  const mt1 = trouves("MT1", "FAIL"), mt2 = trouves("MT2", "AVERT"), mt4 = trouves("MT4", "AVERT");
  const lignes = [titre, "",
    `Contrôle joué en ${m.duree_s} s : verdict ${rapport.verdict}, ${rapport.compte?.depots_lus ?? "?"} dépôt(s) lu(s), référentiel \`references/MODELES-TIERS.json\` ${ref?.date ? `du ${ref.date}` : "non daté"}.`, ""];
  if (mt1.length) lignes.push(`- **${mt1.length} identifiant(s) arrêté(s) cité(s) dans le code** (bloquant, l'appel échoue à l'exécution) :`, ...mt1.map((f) => `  - ${f.message}`));
  else lignes.push("- Aucun identifiant arrêté n'est cité dans le code ou la configuration du parc.");
  if (mt2.length) lignes.push(`- **${mt2.length} identifiant(s) déprécié(s) s'arrêtent dans moins de 90 jours** :`, ...mt2.map((f) => `  - ${f.message}`));
  else lignes.push("- Aucun identifiant déprécié ne s'arrête dans les 90 prochains jours.");
  if (mt4.length) {
    const pages = Object.entries(ref?.fournisseurs || {}).map(([nom, f]) => `${nom} : ${f.calendrier || f.documentation || "page non nommée"}`);
    lignes.push(`- **Le référentiel est périmé (MT4)** : ${mt4.map((f) => f.message).join(" ; ")}.`, "",
      "**Geste à jouer par une session, avant la prochaine revue** : relire les pages de calendrier des fournisseurs" + (pages.length ? ` (${pages.join(" ; ")})` : "")
      + ", reporter les changements dans `references/MODELES-TIERS.json` (date du fichier, `lu_le` de chaque fournisseur, états et dates d'arrêt), puis rejouer `node oracles/oracle-modeles-tiers.mjs`. La revue nomme ce geste, elle ne le fait pas : il lit des pages externes.");
  } else lignes.push("- Le référentiel et les lectures des pages ont moins de 30 jours : rien à rafraîchir.");
  return { texte: lignes.join("\n") + "\n", mesure: true, mt1: mt1.length, mt2: mt2.length, mt4: mt4.length, rafraichir: mt4.length > 0 };
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "revue-hebdo-"));
  const fiche = {
    question: "Faut-il mesurer le taux de détection des 10 oracles les plus sollicités",
    de_quoi: "un banc qui plante des défauts dans les 10 oracles les plus sollicités et compte ceux qu'ils voient",
    probleme: "aucun de ces oracles n'a de taux de détection mesuré ; un juge aveugle ne se voit qu'après coup",
    pourquoi_vous: "le banc coûte des exécutions et choisit quels oracles passer d'abord",
    options: { a: { libelle: "Lancer le banc", effet: "les 10 oracles sont mesurés, chacun avec son taux", cout: "moyen × court", retour: "Possible" },
      b: { libelle: "Le limiter à 3 oracles", effet: "3 oracles mesurés, 7 restent sans mesure", cout: "simple × court", retour: "Possible" },
      c: { libelle: "Reporter", effet: "les défauts de juge restent découverts après coup", cout: "nul", retour: "Sans objet" } },
    recommandation: "a", pourquoi: "les 10 oracles portent la plupart des refus", source: "l'étude du 01/10/2026", ressort: { humain: true, motif: "arbitrage" },
  };
  // L'ancienne fiche, d'avant le format B : elle reste au registre, et elle se liste à instruire.
  const ficheAncienne = {
    question: "Faut-il garder l'ancienne fiche", avantages: ["a"], inconvenients: ["b"], impacts: ["c"],
    options: { a: { libelle: "Oui", cout: "nul", exclusions: "aucune" }, b: { libelle: "Non", cout: "nul", exclusions: "aucune" },
      c: { libelle: "Plus tard", cout: "nul", exclusions: "aucune" } },
    recommandation: "a", source: "le registre", ressort: { humain: true, motif: "arbitrage" },
  };
  const ficheAuto = { ...fiche, question: "Faut-il corriger le motif local", ressort: { humain: false, pourquoi: "défaut reproduit, correction réversible, sans dépense ni doctrine" } };
  const reg = [
    { ev: "creation", id: "TF-9001", titre: "Banc de mutation des oracles", score: { valeur: 6 }, fiche_decision: fiche },
    { ev: "creation", id: "TF-9002", titre: "Proposition sans fiche complète", score: { valeur: 9 }, fiche_decision: { question: "Faut-il ?" } },
    { ev: "creation", id: "TF-9003", titre: "Déjà décidée", score: { valeur: 9 }, fiche_decision: fiche },
    { ev: "maj", id: "TF-9003", statut: "decide" },
    { ev: "creation", id: "TF-9004", titre: "Correctif sans arbitrage", score: { valeur: 20 }, fiche_decision: ficheAuto },
    { ev: "creation", id: "TF-9005", titre: "Fiche sans ressort", score: { valeur: 9 }, fiche_decision: { ...fiche, ressort: undefined } },
    { ev: "creation", id: "TF-9006", titre: "Fiche d'avant le format B", score: { valeur: 9 }, fiche_decision: ficheAncienne },
  ].map((e) => JSON.stringify(e)).join("\n");
  const r = construire({ texteRegistre: reg, depuis: 40, max: 7, jour: "2026-10-01" });
  const casse = [];
  if (r.decisions.length !== 1 || r.decisions[0].d !== "D-40" || r.decisions[0].id !== "TF-9001") casse.push(`décisions attendues [D-40 → TF-9001], obtenu ${JSON.stringify(r.decisions)}`);
  for (const m of ["> **D-40 — Faut-il mesurer le taux de détection des 10 oracles les plus sollicités ? (TF-9001)**",
    "> - **De quoi s'agit-il** : un banc qui plante", "> - **Le problème** : aucun de ces oracles", "> - **Pourquoi vous** : le banc coûte",
    "> - **Recommandation : (a)** — les 10 oracles portent la plupart des refus. Source consultée :",
    "| Option | Ce qui se passe | Coût | Retour arrière |", "| (a) *(recommandée)* Lancer le banc | Les 10 oracles sont mesurés, chacun avec son taux | Moyen × court | Possible |",
    "> **Sans réponse** : (c), reporter.", "« D-40 a »"])
    if (!r.corps.includes(m)) casse.push(`le dossier ne porte pas « ${m} »`);
  if (r.corps.includes("Déjà décidée")) casse.push("une candidature déjà décidée est représentée");
  if (!/Proposition sans fiche complète — manque : de_quoi/.test(r.corps)) casse.push("la fiche incomplète n'est pas listée à instruire avec ses manques");
  if (!/Fiche d'avant le format B — manque : de_quoi, probleme, pourquoi_vous, options\.a/.test(r.corps) || r.decisions.some((x) => x.id === "TF-9006"))
    casse.push("une fiche d'avant le format B est posée au lieu d'être listée à instruire avec ce qui lui manque");
  if (r.decisions.some((x) => x.id === "TF-9004")) casse.push("une proposition qui ne relève pas de l'humain lui est posée");
  if (!/## Mises en œuvre sans vous, pour information[\s\S]*Option appliquée : Lancer le banc/.test(r.corps) || r.automatiques[0]?.id !== "TF-9004") casse.push("la proposition hors du ressort humain n'est pas rendue pour information");
  if (!/Fiche sans ressort — manque : ressort/.test(r.corps)) casse.push("une fiche sans ressort n'est pas listée à instruire");
  writeFileSync(join(dir, "r.jsonl"), reg);
  // TF-2116 — les modèles tiers à la revue : vert (référentiel jeune), rouge MT4 (périmé : le geste est nommé), rouge MT1 (arrêté cité),
  // « non mesuré » dit dans ses trois formes (aucun dépôt, oracle absent, délai dépassé), et le câblage de la ligne de commande.
  const FIX = join(ICI, "..", "oracles", "fixtures", "modeles-tiers");
  const REF = join(FIX, "referentiel-vert.json");
  const parc = (nom, contenu) => {
    const racine = join(dir, nom), d = join(racine, "depot-a");
    mkdirSync(d, { recursive: true });
    const g = (...a) => spawnSync("git", ["-c", "core.longpaths=true", ...a], { cwd: d, encoding: "utf8" });
    g("init", "-q"); writeFileSync(join(d, "x.mjs"), contenu, "utf8"); g("add", "-f", "-A");
    return racine;
  };
  const parcSain = parc("parc-sain", "export const a = 1;\n"), parcRouge = parc("parc-rouge", "const m = \"modele-a-arrete\";\n");
  const jour = (date, racine = parcSain) => jouerModelesTiers({ racine, referentiel: REF, date });
  const vert = sectionModelesTiers(jour("2026-11-03"));
  if (!vert.mesure || vert.rafraichir || vert.mt1 !== 0 || !/rien à rafraîchir/.test(vert.texte) || /Geste à jouer/.test(vert.texte))
    casse.push(`modèles tiers, référentiel jeune sur un parc sain : attendu mesuré, rien à rafraîchir, aucun geste nommé — obtenu ${JSON.stringify({ ...vert, texte: vert.texte.slice(0, 200) })}`);
  const perime = sectionModelesTiers(jour("2026-12-20"));
  if (!perime.rafraichir || perime.mt4 < 1 || !/Geste à jouer par une session/.test(perime.texte) || !perime.texte.includes("https://exemple.invalid/doc/deprecations") || !/elle ne le fait pas/.test(perime.texte))
    casse.push(`modèles tiers, référentiel de 47 jours : attendu l'âge remonté (MT4) et le geste de session nommé avec la page à relire — obtenu ${perime.texte.slice(0, 300)}`);
  const arrete = sectionModelesTiers(jour("2026-11-03", parcRouge));
  if (arrete.mt1 !== 1 || !arrete.texte.includes("modele-a-arrete") || !arrete.texte.includes("x.mjs"))
    casse.push(`modèles tiers, un identifiant arrêté cité dans le parc : attendu 1 MT1 nommant l'identifiant et le fichier — obtenu ${arrete.texte.slice(0, 300)}`);
  const vide = join(dir, "parc-vide"); mkdirSync(vide, { recursive: true });
  const sansDepot = sectionModelesTiers(jouerModelesTiers({ racine: vide, referentiel: REF, date: "2026-11-03" }));
  const sansOracle = sectionModelesTiers(jouerModelesTiers({ racine: parcSain, oracle: join(dir, "absent.mjs") }));
  const tropLong = sectionModelesTiers(jouerModelesTiers({ racine: parcSain, referentiel: REF, date: "2026-11-03", delaiMs: 1 }));
  for (const [nom, s] of [["aucun dépôt sous la racine", sansDepot], ["oracle absent", sansOracle], ["délai dépassé", tropLong]])
    if (s.mesure || !/\*\*Non mesuré\*\*/.test(s.texte) || s.rafraichir) casse.push(`modèles tiers, ${nom} : attendu « Non mesuré » dit avec sa raison, jamais un vert silencieux — obtenu ${s.texte.slice(0, 200)}`);
  const cli = (extra) => spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--depuis", "40", "--registre", join(dir, "r.jsonl"), "--journal", join(dir, "j.jsonl"), ...extra], { encoding: "utf8" });
  const c1 = cli(["--sortie", join(dir, "d1.md"), "--modeles-racine", parcSain, "--modeles-referentiel", REF, "--modeles-date", "2026-12-20"]);
  const d1 = existsSync(join(dir, "d1.md")) ? readFileSync(join(dir, "d1.md"), "utf8") : "";
  const journalise = existsSync(join(dir, "j.jsonl")) ? readFileSync(join(dir, "j.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l)) : [];
  if (c1.status !== 0 || !/## Modèles des fournisseurs tiers/.test(d1) || !/Geste à jouer par une session/.test(d1) || !/> \*\*D-40 /.test(d1) || journalise[0]?.modeles_tiers?.rafraichir !== true)
    casse.push(`modèles tiers, la ligne de commande : attendu la section dans le dossier (décisions comprises) et l'âge au journal — code ${c1.status}, journal ${JSON.stringify(journalise[0]?.modeles_tiers)}`);
  const c2 = cli(["--sortie", join(dir, "d2.md"), "--sans-modeles-tiers"]);
  const d2 = existsSync(join(dir, "d2.md")) ? readFileSync(join(dir, "d2.md"), "utf8") : "";
  if (c2.status !== 0 || /Modèles des fournisseurs tiers/.test(d2) || !/> \*\*D-40 /.test(d2)) casse.push("modèles tiers, --sans-modeles-tiers : attendu le dossier sans la section");
  // Cadence mensuelle (04/11/2026) : la fonction pure sur 4 journaux, puis la ligne de commande sur le journal que c1 vient d'écrire.
  const ligne = (ts, mesure) => JSON.stringify({ ts, decisions: [], modeles_tiers: mesure === undefined ? null : { mesure } });
  const auJour = new Date("2026-11-04T12:00:00Z");
  const cadence = [
    ["journal vide", "", true],
    ["contrôle mesuré il y a 10 jours", ligne("2026-10-25T08:00:00Z", true), false],
    ["contrôle mesuré il y a 31 jours", ligne("2026-10-04T08:00:00Z", true), true],
    ["contrôle récent non mesuré, mesuré il y a 31 jours", [ligne("2026-10-04T08:00:00Z", true), ligne("2026-11-01T08:00:00Z", false), ligne("2026-11-02T08:00:00Z")].join("\n"), true],
  ];
  for (const [nom, texteJournal, attendu] of cadence) {
    const c = controleModelesDu({ texteJournal, maintenant: auJour });
    if (c.du !== attendu) casse.push(`cadence des modèles tiers, ${nom} : attendu ${attendu ? "dû" : "non dû"}, obtenu ${JSON.stringify(c)}`);
  }
  const nonDue = sectionModelesTiersNonDue(controleModelesDu({ texteJournal: ligne("2026-10-25T08:00:00Z", true), maintenant: auJour }));
  if (!/le 25\/10\/2026/.test(nonDue.texte) || !/à partir du 24\/11\/2026/.test(nonDue.texte) || !/--modeles-tiers-forcer/.test(nonDue.texte) || nonDue.mesure || !nonDue.saute)
    casse.push(`cadence des modèles tiers, section non due : attendu les dates du dernier et du prochain contrôle et le moyen de forcer — obtenu ${nonDue.texte.slice(0, 300)}`);
  const c3 = cli(["--sortie", join(dir, "d3.md"), "--modeles-racine", parcSain, "--modeles-referentiel", REF, "--modeles-date", "2026-12-20"]);
  const d3 = existsSync(join(dir, "d3.md")) ? readFileSync(join(dir, "d3.md"), "utf8") : "";
  const j3 = readFileSync(join(dir, "j.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l)).pop();
  if (c3.status !== 0 || !/la cadence est mensuelle/.test(d3) || /Contrôle joué en/.test(d3) || j3?.modeles_tiers?.saute !== true)
    casse.push(`cadence des modèles tiers, revue une semaine après un contrôle mesuré : attendu l'oracle non rejoué, dit au dossier et au journal — code ${c3.status}, journal ${JSON.stringify(j3?.modeles_tiers)}`);
  const c4 = cli(["--sortie", join(dir, "d4.md"), "--modeles-racine", parcSain, "--modeles-referentiel", REF, "--modeles-date", "2026-12-20", "--modeles-tiers-forcer"]);
  const d4 = existsSync(join(dir, "d4.md")) ? readFileSync(join(dir, "d4.md"), "utf8") : "";
  if (c4.status !== 0 || !/Contrôle joué en/.test(d4)) casse.push(`cadence des modèles tiers, --modeles-tiers-forcer : attendu l'oracle rejoué malgré un contrôle récent — code ${c4.status}`);
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ") : "Self-test revue-hebdo : PASS — cadence mensuelle des modèles tiers (04/11/2026) : dû sur un journal vide, sur un contrôle de 31 jours et quand le dernier contrôle récent n'a pas été mesuré, non dû sur un contrôle de 10 jours, dates et moyen de forcer dits au dossier, oracle non rejoué une semaine après et rejoué par --modeles-tiers-forcer ; modèles tiers joués à la revue (TF-2116) : parc sain et référentiel jeune sans geste, référentiel de 47 jours remonté avec le geste de session nommé, identifiant arrêté cité nommé, « non mesuré » dit pour un parc sans dépôt, un oracle absent et un délai dépassé, ligne de commande câblée au dossier et au journal ; et, d'avant : 1 décision rendue au format B du bloc 3 (de quoi il s agit, le problème, pourquoi vous, recommandation, tableau à retour arrière, repli « Sans réponse »), 1 fiche d avant le format B listée à instruire, 1 proposition hors du ressort humain rendue pour information et non posée, cas rouges : la décidée écartée, l'incomplète et celle sans ressort refusées comme décision et listées à instruire");
  process.exit(casse.length ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (args.includes("--self-test")) selfTest();
  const depuis = Number(valeur("--depuis"));
  if (!Number.isInteger(depuis) || depuis < 1) {
    console.log(JSON.stringify({ outil: "revue-hebdo", erreur: "--depuis <N> exigé : le numéro de la première décision, qui continue la suite des D-N" }));
    process.exit(2);
  }
  const registre = valeur("--registre", join(ICI, "TODO.jsonl"));
  const journal = valeur("--journal", join(ICI, "observabilite", "revues-hebdo.jsonl"));
  const jour = new Date().toISOString().slice(0, 10);
  const r = construire({ texteRegistre: readFileSync(registre, "utf8"), depuis, max: Number(valeur("--max", 7)), jour });
  // TF-2116 : l'oracle des modèles tiers se joue ici, jamais à l'ouverture (49 s mesurés, borne du hook d'ouverture 45 s), et une
  // fois par mois : le journal dit si le dernier contrôle mesuré a 30 jours.
  const cadence = controleModelesDu({ texteJournal: existsSync(journal) ? readFileSync(journal, "utf8") : "" });
  const modeles = args.includes("--sans-modeles-tiers") ? null
    : !cadence.du && !args.includes("--modeles-tiers-forcer") ? sectionModelesTiersNonDue(cadence)
    : sectionModelesTiers(jouerModelesTiers({ racine: valeur("--modeles-racine"), referentiel: valeur("--modeles-referentiel"), date: valeur("--modeles-date") }));
  const corps = modeles ? r.corps + "\n\n" + modeles.texte : r.corps;
  const sortie = valeur("--sortie");
  if (sortie) writeFileSync(sortie, corps + "\n", "utf8");
  else process.stdout.write(corps + "\n\n");
  const bilanModeles = !modeles ? null : modeles.saute ? { mesure: false, saute: true, dernier: modeles.dernier, prochain: modeles.prochain }
    : { mesure: modeles.mesure, mt1: modeles.mt1, mt2: modeles.mt2, mt4: modeles.mt4, rafraichir: modeles.rafraichir };
  appendFileSync(journal, JSON.stringify({ ts: new Date().toISOString(), dossier: sortie, decisions: r.decisions, automatiques: r.automatiques, reportes: r.reportes, modeles_tiers: bilanModeles }) + "\n");
  console.log(JSON.stringify({ outil: "revue-hebdo", dossier: sortie, decisions: r.decisions, automatiques: r.automatiques, a_instruire: r.aInstruire.map((x) => x.id), modeles_tiers: bilanModeles }));
}
