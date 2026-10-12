#!/usr/bin/env node
/**
 * oracle-source-contenu.mjs — UNE DÉDUCTION NE SE PUBLIE PAS COMME UN FAIT (R-59 point 1, TF-1581, RT-107).
 *
 * LE FAIT, mesuré chez un produit le 27/09/2026. Les livrets d'un exploitant, destinés à son client
 * final, écrivaient « Studio de plain-pied : pas d'escalier […] C'est le plus accessible des cinq
 * gîtes ». Au journal du produit, l'accessibilité était « DÉDUITE de la composition » ; dans le
 * livrable, la marque d'hypothèse avait disparu. La page du gîte sur le site de l'exploitant dit « il
 * se trouve au 1er étage ». Affirmation fausse sur l'accessibilité, servie en production du 25 au
 * 27/09, sur la page que lit l'assistant de la plateforme. Le lecteur final ne pouvait pas distinguer
 * la déduction d'une mesure.
 *
 * CE QUE L'ORACLE JUGE. Une source de contenu destinée au client final est une liste d'entrées
 * `{ id, texte, _source?, statut? }` (JSON, ou une entrée JSON par ligne). Trois contrôles :
 *
 *   SC1 · COMPTE les entrées sans `_source` non vide et sans statut `hypothese` / `question`. C'est
 *         une mesure, jamais un échec à elle seule : toute entrée n'engage pas l'exploitant.
 *   SC2 · une entrée qui affirme un SUJET SENSIBLE (gabarits\AFFIRMATIONS-SENSIBLES.json, donnée
 *         éditable et datée, loi n° 4) et ne porte ni `_source` ni statut d'hypothèse est ROUGE.
 *   SC3 · avec `--livrable <fichier>` : une entrée en statut `hypothese` ou `question` dont le texte
 *         figure dans le livrable est ROUGE — l'hypothèse doit être RETENUE hors du livrable et posée
 *         en question à l'exploitant, pas servie.
 *
 * NON JUGÉ, et dit : que la `_source` citée dise vraiment ce que l'entrée affirme (seule une relecture
 * de la source le montre) ; les sujets absents de la liste ; une affirmation sensible reformulée sans
 * aucun des motifs. Sans `--livrable`, SC3 n'est pas jouée et le dit.
 *
 * Usage : node oracles\oracle-source-contenu.mjs <source.json|.jsonl> [--livrable <fichier>] [--json]
 * Exit  : 0 PASS · 1 FAIL · 2 SANS OBJET (source illisible ou vide : « je ne peux pas mesurer »).
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const NON_JUGE = [
  "que la `_source` citée dise vraiment ce que l'entrée affirme : seule la relecture de la source le montre",
  "les sujets sensibles absents de gabarits\\AFFIRMATIONS-SENSIBLES.json, et une affirmation sensible reformulée sans aucun de leurs motifs",
  "la rétention d'une hypothèse hors du livrable quand `--livrable` n'est pas fourni (SC3 non jouée, et dit)",
];

const STATUTS_RETENUS = new Set(["hypothese", "hypothèse", "question"]);

export function chargerSensibles(chemin = join(dirname(fileURLToPath(import.meta.url)), "..", "gabarits", "AFFIRMATIONS-SENSIBLES.json")) {
  if (!existsSync(chemin)) return null;
  try {
    const d = JSON.parse(readFileSync(chemin, "utf8"));
    return (d.domaines || []).filter((x) => x && x.nom && Array.isArray(x.motifs) && x.motifs.length)
      .map((x) => ({ nom: x.nom, re: new RegExp(x.motifs.join("|"), "iu") }));
  } catch { return null; }
}

/** Lit un JSON (tableau ou { entrees: [...] }) ou un JSONL ; rend null si illisible. */
export function lireEntrees(texte) {
  const t = String(texte).replace(/^\uFEFF/, "").trim();
  if (!t) return null;
  try {
    const j = JSON.parse(t);
    const liste = Array.isArray(j) ? j : j && Array.isArray(j.entrees) ? j.entrees : null;
    return liste && liste.every((e) => e && typeof e === "object") ? liste : null;
  } catch { /* peut-être un JSONL */ }
  try {
    const liste = t.split(/\r?\n/).filter((l) => l.trim()).map((l) => JSON.parse(l));
    return liste.every((e) => e && typeof e === "object") ? liste : null;
  } catch { return null; }
}

const normaliser = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const aSource = (e) => typeof e._source === "string" && e._source.trim().length > 0;
const retenue = (e) => STATUTS_RETENUS.has(String(e.statut || "").trim().toLowerCase());
const nom = (e, i) => (e.id !== undefined ? String(e.id) : `#${i + 1}`);

export function juger(entrees, { sensibles = chargerSensibles(), livrable = null } = {}) {
  const F = [];
  if (!Array.isArray(entrees) || !entrees.length)
    return { verdict: "SANS_OBJET", findings: [{ regle: "SC0", statut: "SKIP", message: "source de contenu illisible ou vide — rien à mesurer" }] };
  if (!sensibles)
    return { verdict: "SANS_OBJET", findings: [{ regle: "SC0", statut: "SKIP", message: "référentiel gabarits\\AFFIRMATIONS-SENSIBLES.json absent ou illisible — aucun sujet sensible à confronter" }] };

  const sansSource = entrees.map((e, i) => ({ e, i })).filter(({ e }) => !aSource(e) && !retenue(e));
  F.push({ regle: "SC1", statut: "PASS",
    message: `${sansSource.length} entrée(s) sans source ni statut d'hypothèse sur ${entrees.length}`
      + (sansSource.length ? ` (${sansSource.slice(0, 5).map(({ e, i }) => nom(e, i)).join(", ")}${sansSource.length > 5 ? ", …" : ""})` : "") });

  const sensiblesSansSource = sansSource.map(({ e, i }) => ({ e, i, d: sensibles.find((s) => s.re.test(String(e.texte || ""))) })).filter((x) => x.d);
  F.push(sensiblesSansSource.length
    ? { regle: "SC2", statut: "FAIL",
      message: `${sensiblesSansSource.length} entrée(s) affirment un sujet sensible sans source ni statut d'hypothèse : `
        + sensiblesSansSource.slice(0, 5).map(({ e, i, d }) => `${nom(e, i)} (${d.nom})`).join(", ")
        + ". Le 27/09/2026, « studio de plain-pied, le plus accessible des cinq gîtes » a été servi deux jours au client final alors que le gîte est au 1er étage (TF-1581). "
        + "Renseigne `_source` (adresse ou pièce relue, avec sa date), ou pose `statut: \"hypothese\"` pour retenir l'entrée hors du livrable et la poser en question à l'exploitant." }
    : { regle: "SC2", statut: "PASS", message: "aucune affirmation sensible sans source ni statut d'hypothèse" });

  if (livrable === null) {
    F.push({ regle: "SC3", statut: "SKIP", message: "aucun livrable fourni (--livrable) : la rétention des hypothèses hors du livrable n'est pas jouée" });
  } else {
    const nl = normaliser(livrable);
    const servies = entrees.map((e, i) => ({ e, i })).filter(({ e }) => retenue(e) && String(e.texte || "").trim() && nl.includes(normaliser(e.texte)));
    F.push(servies.length
      ? { regle: "SC3", statut: "FAIL",
        message: `${servies.length} entrée(s) en statut d'hypothèse ou de question figurent dans le livrable : ${servies.slice(0, 5).map(({ e, i }) => nom(e, i)).join(", ")}. `
          + "Une hypothèse se retient hors du livrable et se pose en question à l'exploitant ; la servir, c'est la publier comme un fait." }
      : { regle: "SC3", statut: "PASS", message: "aucune hypothèse ni question retenue ne figure dans le livrable" });
  }
  return { verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const iL = args.indexOf("--livrable");
  const cheminLivrable = iL >= 0 ? args[iL + 1] : null;
  const source = args.find((a, i) => !a.startsWith("--") && (iL < 0 || i !== iL + 1));
  let r;
  if (!source || !existsSync(source)) {
    r = { verdict: "SANS_OBJET", findings: [{ regle: "SC0", statut: "SKIP", message: "usage : oracle-source-contenu.mjs <source.json|.jsonl> [--livrable <fichier>] [--json] — source introuvable" }] };
  } else {
    const livrable = cheminLivrable && existsSync(cheminLivrable) ? readFileSync(cheminLivrable, "utf8") : null;
    r = juger(lireEntrees(readFileSync(source, "utf8")), { livrable });
  }
  r.non_juge = NON_JUGE;
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    console.log(`oracle-source-contenu : ${r.verdict}`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
    console.log("Non jugé : " + NON_JUGE.join(" ; "));
  }
  process.exit(r.verdict === "PASS" ? 0 : r.verdict === "FAIL" ? 1 : 2);
}
