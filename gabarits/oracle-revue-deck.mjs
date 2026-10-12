#!/usr/bin/env node
/**
 * oracle-revue-deck.mjs — juge la FORME de la revue de lecture écrite d'une présentation, avant sa remise
 * (TF-1388, lot Produit-68 20260926a, RP-64 ; décision du 02/10/2026 : étendre au deck la revue écrite
 * déjà exigée pour une page HTML).
 *
 * LE FAIT PAYÉ. Le skill de présentation prescrit « toujours vérifier visuellement le rendu avant de livrer »
 * et n'en garde ni la grille ni la trace. La restitution du 24/09/2026 déclarait les 20 captures relues une
 * à une ; un défaut d'alignement de 18 px à 1 920 px, visible sur la capture de la diapositive 10, n'a pas
 * été relevé, parce que la relecture cherchait débordements et chevauchements. Le 26/09, deux remises ont été
 * remplacées le jour même pour des défauts vus après coup.
 *
 * CE QUE CE CONTRÔLE EXIGE, et il n'exige que de la forme : un fichier `REVUE.md` à côté des captures, daté,
 * qui nomme chaque capture avec ses dimensions et juge chaque critère d'une grille FERMÉE.
 *   R1 · la revue est datée (AAAA-MM-JJ, avec l'heure si elle la porte) dans son titre ;
 *   R2 · la grille fermée est entière : les cinq critères du gabarit `gabarits\\REVUE-DECK.md` y ont chacun
 *        une ligne, avec un verdict parmi « conforme », « constat » ou « non applicable » ;
 *   R3 · un « non applicable » donne son motif ; un « constat » nomme au moins une diapositive et la suite
 *        décidée ;
 *   R4 · chaque capture est nommée avec ses dimensions (`- diapo-10.png — 1920 × 1080`), et celles de la
 *        revue sont celles du fichier lorsqu'un dossier de captures est donné ;
 *   R5 · avec un dossier de captures, aucune capture du dossier n'est absente de la revue : une diapositive
 *        non citée n'a pas été lue, quoi que la restitution déclare.
 *
 * CE QU'IL NE JUGE PAS (NON_JUGE) : que les captures aient été REGARDÉES, que chaque verdict « conforme »
 * soit JUSTE, et qu'une diapositive absente du dossier de captures n'ait pas été oubliée à la rastérisation.
 * Il rend la relecture écrite, datée et complète ; il ne la remplace pas.
 *
 * Usage : node oracle-revue-deck.mjs <REVUE.md> [--captures <dossier>] [--json]
 * Exit  : 0 = forme tenue · 1 = au moins un écart · 2 = fichier absent ou illisible.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

export const VERSION = "1.0.0";
export const ORACLE = "oracle-revue-deck";
export const DOMAINE = "Revue de lecture écrite d'une présentation avant remise";

/** La grille fermée : une clé, le libellé écrit dans la revue, et le mot qui le reconnaît. */
export const CRITERES = [
  { cle: "alignement", libelle: "Alignement des repères", re: /alignement/i },
  { cle: "debordements", libelle: "Débordements", re: /d[ée]bordement/i },
  { cle: "lisibilite", libelle: "Lisibilité à la projection", re: /lisibilit[ée]/i },
  { cle: "libelles", libelle: "Même libellé d'une diapositive à l'autre", re: /m[êe]me libell[ée]|libell[ée]s?\s+(?:identiques?|coh[ée]rents?)/i },
  { cle: "typographie", libelle: "Typographie aux coupures", re: /typographie|coupures?/i },
];
export const VERDICTS = ["conforme", "constat", "non applicable"];

export const NON_JUGE = [
  "que les captures aient été REGARDÉES : la revue est une déclaration, ce contrôle en vérifie la forme et l'exhaustivité nominale",
  "qu'un verdict « conforme » soit juste : un défaut de 18 px se voit à l'œil, pas à la forme d'un tableau",
  "qu'une diapositive manque au dossier de captures (rastérisation incomplète) : seules les captures présentes sont comptées",
];

const DATE = /(\d{4})-(\d{2})-(\d{2})(?:[ T]+(\d{2}):(\d{2}))?/;
const LIGNE_CAPTURE = /^\s*[-*|]\s*`?([\w.\-/\\]+\.png)`?\s*[—–|-]\s*(\d{2,5})\s*[x×*]\s*(\d{2,5})\b/gim;

/** Largeur et hauteur lues dans l'en-tête PNG (IHDR), ou `null`. */
export function dimensionsPng(chemin) {
  const b = readFileSync(chemin);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47 || b.toString("latin1", 12, 16) !== "IHDR") return null;
  return { largeur: b.readUInt32BE(16), hauteur: b.readUInt32BE(20) };
}

/** Les lignes de tableau (`| a | b |`) du texte, découpées en cellules rognées, séparateurs exclus. */
function lignesDeTableau(texte) {
  return texte.split("\n").filter((l) => /^\s*\|/.test(l) && !/^\s*\|[\s:|-]+\|\s*$/.test(l))
    .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
}

export function verifier(source, { captures = null } = {}) {
  const texte = String(source).replace(/\r\n/g, "\n");
  const constats = [];
  const ko = (regle, message, remede) => constats.push({ regle, statut: "FAIL", message, remede });
  const ok = (regle, message) => constats.push({ regle, statut: "PASS", message });

  // ---- R1 : datée --------------------------------------------------------------------------
  const titre = (texte.match(/^#\s+(.+)$/m) || [null, ""])[1];
  const d = DATE.exec(titre);
  const valide = d && +d[2] >= 1 && +d[2] <= 12 && +d[3] >= 1 && +d[3] <= 31;
  if (!titre) ko("R1", "la revue n'a pas de titre de niveau 1", "ouvrir par « # Revue de lecture du deck — <livrable> — AAAA-MM-JJ HH:MM »");
  else if (!valide) ko("R1", `le titre ne porte pas de date valide (AAAA-MM-JJ) : « ${titre.slice(0, 80)} »`, "dater la revue dans son titre, avec l'heure de la lecture");
  else ok("R1", `revue datée du ${d[1]}-${d[2]}-${d[3]}${d[4] ? ` ${d[4]}:${d[5]}` : ""}`);

  // ---- R2 / R3 : la grille fermée ---------------------------------------------------------
  const lignes = lignesDeTableau(texte);
  const trouves = new Map();
  for (const c of CRITERES) {
    const ligne = lignes.find((cells) => cells.length >= 2 && c.re.test(cells[0]));
    if (ligne) trouves.set(c.cle, ligne);
  }
  const manquants = CRITERES.filter((c) => !trouves.has(c.cle));
  if (manquants.length) ko("R2", `critère(s) absent(s) de la grille : ${manquants.map((c) => `« ${c.libelle} »`).join(" · ")}`, "ajouter une ligne par critère du gabarit gabarits\\REVUE-DECK.md, chacune avec son verdict");
  const sansVerdict = [];
  const detail = [];
  for (const c of CRITERES) {
    const cells = trouves.get(c.cle);
    if (!cells) continue;
    const verdict = VERDICTS.find((v) => cells.some((x) => x.toLowerCase().startsWith(v)));
    if (!verdict) { sansVerdict.push(c.libelle); continue; }
    const reste = cells.filter((x) => !c.re.test(x) && !x.toLowerCase().startsWith(verdict)).join(" ").trim();
    if (verdict === "non applicable" && reste.length < 10) detail.push(`« ${c.libelle} » : non applicable sans motif`);
    // Un constat nomme sa diapositive, et sa suite est la DERNIÈRE cellule de la ligne (« Suite »), non vide.
    const suite = cells.length >= 4 ? cells[cells.length - 1] : "";
    if (verdict === "constat" && !(/\b(?:diapo(?:sitive)?s?|slide)\s*\d+/i.test(reste) && suite.length >= 3 && !/^[—–-]+$/.test(suite)))
      detail.push(`« ${c.libelle} » : un constat nomme une diapositive (« diapo 10 ») et la suite décidée en dernière colonne`);
  }
  if (sansVerdict.length) ko("R2", `ligne(s) sans verdict (conforme, constat ou non applicable) : ${sansVerdict.map((l) => `« ${l} »`).join(" · ")}`, "écrire le verdict du critère dans la ligne");
  else if (!manquants.length) ok("R2", `la grille fermée est entière : ${CRITERES.length} critères, chacun avec un verdict`);
  if (detail.length) for (const m of detail) ko("R3", m, "motiver le « non applicable », ou nommer la diapositive et la suite du constat");
  else if (!manquants.length && !sansVerdict.length) ok("R3", "chaque « non applicable » est motivé et chaque constat nomme sa diapositive et sa suite");

  // ---- R4 / R5 : les captures --------------------------------------------------------------
  const citees = [...texte.matchAll(LIGNE_CAPTURE)].map((m) => ({ nom: basename(m[1]), l: +m[2], h: +m[3] }));
  if (!citees.length) ko("R4", "aucune capture n'est nommée avec ses dimensions (- diapo-10.png — 1920 × 1080)", "lister chaque capture lue, dimensions lues dans le fichier");
  else if (captures) {
    const faux = [];
    for (const c of citees) {
      const f = join(captures, c.nom);
      if (!existsSync(f)) { faux.push(`${c.nom} (introuvable dans ${captures})`); continue; }
      const dim = dimensionsPng(f);
      if (!dim) faux.push(`${c.nom} (en-tête PNG illisible)`);
      else if (dim.largeur !== c.l || dim.hauteur !== c.h) faux.push(`${c.nom} (revue : ${c.l} × ${c.h}, fichier : ${dim.largeur} × ${dim.hauteur})`);
    }
    if (faux.length) ko("R4", `capture(s) démentie(s) par le dossier : ${faux.join(" · ")}`, "relire les dimensions dans le fichier, jamais de mémoire");
    else ok("R4", `${citees.length} capture(s) nommée(s), dimensions conformes aux fichiers`);
  } else ok("R4", `${citees.length} capture(s) nommée(s) (dimensions non confrontées : aucun dossier de captures donné)`);

  if (captures) {
    const presentes = existsSync(captures) ? readdirSync(captures).filter((f) => /\.png$/i.test(f)) : [];
    const noms = new Set(citees.map((c) => c.nom));
    const oubliees = presentes.filter((f) => !noms.has(f));
    if (!presentes.length) ko("R5", `aucune capture dans ${captures}`, "rastériser le deck avant sa revue");
    else if (oubliees.length) ko("R5", `${oubliees.length} capture(s) sur ${presentes.length} absente(s) de la revue : ${oubliees.slice(0, 6).join(", ")}${oubliees.length > 6 ? ` … (+${oubliees.length - 6})` : ""}`, "lire et nommer chaque capture : une diapositive non citée n'a pas été lue");
    else ok("R5", `les ${presentes.length} captures du dossier sont toutes citées`);
  } else constats.push({ regle: "R5", statut: "SANS_OBJET", message: "aucun dossier de captures donné (--captures) : l'exhaustivité n'est pas confrontée" });

  return { version: VERSION, constats, verdict: constats.some((c) => c.statut === "FAIL") ? "FAIL" : "PASS", non_juge: NON_JUGE };
}

/** Le verdict au contrat JSON commun des oracles. */
export function enContrat(fichier, r) {
  return {
    oracle: ORACLE, domaine: DOMAINE, artefact: fichier, verdict: r.verdict,
    findings: r.constats.map((c) => ({
      sev: c.statut === "FAIL" ? "bloquant" : "info", regle: c.regle,
      msg: c.statut === "SANS_OBJET" ? `non jugé — ${c.message}` : c.remede ? `${c.message} — remède : ${c.remede}` : c.message,
      where: fichier,
    })),
    non_juge: r.non_juge,
  };
}

// ---- CLI --------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1] && process.argv[1].replaceAll("\\", "/").endsWith("oracle-revue-deck.mjs");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--captures");
  const captures = i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null;
  const fichier = args.find((a, k) => !a.startsWith("--") && args[k - 1] !== "--captures");
  if (!fichier || !existsSync(fichier)) {
    console.error("usage : node oracle-revue-deck.mjs <REVUE.md> [--captures <dossier>] [--json]");
    process.exit(2);
  }
  const r = verifier(readFileSync(fichier, "utf8"), { captures });
  if (args.includes("--json")) console.log(JSON.stringify(enContrat(fichier, r), null, 1));
  else {
    console.log(`oracle-revue-deck ${VERSION} — ${fichier}`);
    for (const c of r.constats) {
      console.log(`  [${c.statut}] ${c.regle} — ${c.message}`);
      if (c.statut === "FAIL" && c.remede) console.log(`      → ${c.remede}`);
    }
    console.log(`verdict : ${r.verdict}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
