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

const CHAMPS = ["question", "avantages", "inconvenients", "impacts", "options", "recommandation", "source"];

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
    if (!opt?.libelle || !opt?.cout || !opt?.exclusions) m.push(`options.${o}`);
  }
  if (f.recommandation && !["a", "b", "c"].includes(f.recommandation)) m.push("recommandation (a, b ou c)");
  return [...new Set(m)];
}

const valeurDe = (e) => Number(e.score?.valeur ?? 0);
const liste = (x) => (Array.isArray(x) ? x : [x]).map((s) => `${s}`.trim()).filter(Boolean).join(" ; ");

/** Une décision au format du bloc 3 : citation, tableau pleine largeur, repli. */
export function rendreDecision(n, e) {
  const f = e.fiche_decision;
  const q = f.question.trim().replace(/\s*\?*$/, " ?");
  const ligne = (o) => `| **(${o})**${f.recommandation === o ? " *(recommandée)*" : ""} ${f.options[o].libelle} | ${f.options[o].cout} | ${f.options[o].exclusions} |`;
  return [
    `> **D-${n} — ${q}**`,
    ">",
    `> ${f.rappel || e.titre}`,
    ">",
    `> **Avantages** : ${liste(f.avantages)}.`,
    `> **Inconvénients** : ${liste(f.inconvenients)}.`,
    `> **Impacts** : ${liste(f.impacts)}.`,
    ">",
    `> **Recommandation : (${f.recommandation}).** Source consultée : ${f.source}.${f.pourquoi ? ` ${f.pourquoi}` : ""}`,
    "",
    "| Option | Coût | Exclusions |",
    "|---|---|---|",
    ligne("a"), ligne("b"), ligne("c"),
    "",
    `> **Si rien n'est décidé** : (c) ${f.options.c.libelle}.`,
    "",
  ].join("\n");
}

export function construire({ texteRegistre, depuis, max = 7, jour }) {
  const candidats = [...etatCourant(texteRegistre).values()].filter((e) => e.statut === "candidat");
  const prets = candidats.filter((e) => !manques(e.fiche_decision).length).sort((x, y) => valeurDe(y) - valeurDe(x));
  const retenus = prets.slice(0, max);
  const reportes = prets.slice(max);
  const aInstruire = candidats.filter((e) => e.fiche_decision && manques(e.fiche_decision).length)
    .map((e) => ({ id: e.id, titre: e.titre, manques: manques(e.fiche_decision) }));
  const decisions = retenus.map((e, i) => ({ d: `D-${depuis + i}`, id: e.id }));
  const reponse = decisions.map((x) => `${x.d} a`).join(", ");
  const corps = [
    `# Revue hebdomadaire des propositions — ${jour}`,
    "",
    `${retenus.length} proposition(s) à trancher cette semaine, classées par valeur au registre. Chacune dit ses avantages, ses inconvénients et ses impacts, puis ses 3 options ; la colonne Coût dit la complexité et la durée, la colonne Exclusions ce que retenir l'option ferme.`,
    "",
    retenus.length ? `Pour répondre, une ligne suffit, par exemple : « ${reponse} ». Une décision sans réponse prend son option (c).` : "Aucune proposition n'a de fiche complète cette semaine : rien n'est à trancher.",
    "",
    ...retenus.map((e, i) => rendreDecision(depuis + i, e)),
    reportes.length ? `## Reportées à la semaine suivante\n\n${reportes.map((e) => `- ${e.titre}, valeur ${valeurDe(e)}`).join("\n")}\n` : "",
    aInstruire.length ? `## À instruire avant d'être présentées\n\n${aInstruire.map((x) => `- ${x.titre} — manque : ${x.manques.join(", ")}`).join("\n")}\n` : "",
  ].join("\n").replace(/\n{3,}/g, "\n\n");
  return { corps, decisions, reportes: reportes.map((e) => e.id), aInstruire };
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "revue-hebdo-"));
  const fiche = {
    question: "Faut-il mesurer le taux de détection des 10 oracles les plus sollicités",
    avantages: ["les défauts de juges se voient avant de coûter"], inconvenients: ["un catalogue de mutations à tenir"],
    impacts: ["pilot seul, aucune écriture chez les produits"],
    options: { a: { libelle: "Lancer le banc", cout: "moyen × court", exclusions: "aucune" },
      b: { libelle: "Le limiter à 3 oracles", cout: "simple × court", exclusions: "7 oracles non mesurés" },
      c: { libelle: "Reporter", cout: "nul", exclusions: "les défauts restent découverts après coup" } },
    recommandation: "a", source: "l'étude du 01/10/2026",
  };
  const reg = [
    { ev: "creation", id: "TF-9001", titre: "Banc de mutation des oracles", score: { valeur: 6 }, fiche_decision: fiche },
    { ev: "creation", id: "TF-9002", titre: "Proposition sans fiche complète", score: { valeur: 9 }, fiche_decision: { question: "Faut-il ?" } },
    { ev: "creation", id: "TF-9003", titre: "Déjà décidée", score: { valeur: 9 }, fiche_decision: fiche },
    { ev: "maj", id: "TF-9003", statut: "decide" },
  ].map((e) => JSON.stringify(e)).join("\n");
  const r = construire({ texteRegistre: reg, depuis: 40, max: 7, jour: "2026-10-01" });
  const casse = [];
  if (r.decisions.length !== 1 || r.decisions[0].d !== "D-40" || r.decisions[0].id !== "TF-9001") casse.push(`décisions attendues [D-40 → TF-9001], obtenu ${JSON.stringify(r.decisions)}`);
  for (const m of ["> **D-40 — Faut-il mesurer", "> **Avantages** :", "> **Inconvénients** :", "> **Impacts** :",
    "> **Recommandation : (a).** Source consultée :", "| Option | Coût | Exclusions |", "| **(a)** *(recommandée)* Lancer le banc |",
    "> **Si rien n'est décidé** : (c) Reporter.", "« D-40 a »"])
    if (!r.corps.includes(m)) casse.push(`le dossier ne porte pas « ${m} »`);
  if (r.corps.includes("Déjà décidée")) casse.push("une candidature déjà décidée est représentée");
  if (!/Proposition sans fiche complète — manque : avantages/.test(r.corps)) casse.push("la fiche incomplète n'est pas listée à instruire avec ses manques");
  writeFileSync(join(dir, "r.jsonl"), reg);
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ") : "Self-test revue-hebdo : PASS — 1 décision rendue au format du bloc 3 (avantages, inconvénients, impacts, recommandation, tableau, repli), la décidée écartée, l'incomplète listée à instruire avec ses manques");
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
  appendFileSync(journal, JSON.stringify({ ts: new Date().toISOString(), dossier: sortie, decisions: r.decisions, reportes: r.reportes }) + "\n");
  console.log(JSON.stringify({ outil: "revue-hebdo", dossier: sortie, decisions: r.decisions, a_instruire: r.aInstruire.map((x) => x.id) }));
}
