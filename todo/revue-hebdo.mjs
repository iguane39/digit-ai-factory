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
 * Usage : node todo\revue-hebdo.mjs --depuis <N> [--max 7] [--registre <TODO.jsonl>] [--sortie <dossier.md>]
 *           [--journal <revues-hebdo.jsonl>]
 *         node todo\revue-hebdo.mjs --self-test
 * Sortie : JSON {outil, dossier, decisions[], a_instruire[]} · exit 0, ou 2 si l'entrée manque.
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdtempSync } from "node:fs";
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
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ") : "Self-test revue-hebdo : PASS — 1 décision rendue au format B du bloc 3 (de quoi il s agit, le problème, pourquoi vous, recommandation, tableau à retour arrière, repli « Sans réponse »), 1 fiche d avant le format B listée à instruire, 1 proposition hors du ressort humain rendue pour information et non posée, cas rouges : la décidée écartée, l'incomplète et celle sans ressort refusées comme décision et listées à instruire");
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
  const sortie = valeur("--sortie");
  if (sortie) writeFileSync(sortie, r.corps + "\n", "utf8");
  else process.stdout.write(r.corps + "\n\n");
  appendFileSync(journal, JSON.stringify({ ts: new Date().toISOString(), dossier: sortie, decisions: r.decisions, automatiques: r.automatiques, reportes: r.reportes }) + "\n");
  console.log(JSON.stringify({ outil: "revue-hebdo", dossier: sortie, decisions: r.decisions, automatiques: r.automatiques, a_instruire: r.aInstruire.map((x) => x.id) }));
}
