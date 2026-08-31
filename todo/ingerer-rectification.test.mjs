#!/usr/bin/env node
/**
 * ingerer-rectification.test.mjs — TF-0703 : le canal de rectification d'un lot remis.
 *
 * Un lot remis ne se modifie JAMAIS, et AUCUN champ du sidecar ne permettait de désigner un
 * retour antérieur pour le corriger : une affirmation fausse ingérée devenait un item
 * indiscernable d'un item exact, et le seul moyen de la contredire était un item CONCURRENT que
 * rien ne reliait au premier. Cas réel du 28/08 : un lot affirmait qu'une fiche était
 * « maintenue à la main » quand son générateur, versionné, vivait dans le dépôt depuis trois
 * jours — seule l'absence d'ingestion à ce moment-là a évité d'agir sur une cause fausse.
 *
 * Le canal : deux champs OPTIONNELS du sidecar, `rectifie` (id TF visé) et
 * `nature_de_la_rectification` (fait_errone | cause_erronee | annule). La ligne MARQUE l'item
 * visé (événement `maj` portant un bloc `rectification`) au lieu d'en créer un second sans
 * lien ; un id inconnu ou archivé est refusé en bloc, registre intact — une rectification qui
 * porte à côté ferait croire l'erreur d'origine corrigée quelque part.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "rectif-"));

// Tables d'anonymisation JETABLES : la chaîne d'ingestion les exige, et employer les vraies
// ferait dépendre la recette d'un état hors dépôt — voire l'étendrait avec des noms de fixture.
writeFileSync(join(T, "_noms-interdits.json"), JSON.stringify({ noms: [], pseudonymes: {} }), "utf8");
writeFileSync(join(T, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
const ENV = {
  ...process.env,
  FORGE_NOMS_INTERDITS: join(T, "_noms-interdits.json"),
  FORGE_PRODUITS_PSEUDO: join(T, "_produits-pseudonymes.json"),
};

// Un item EXISTANT du registre de fixture, complet au sens de R4 — la cible des rectifications.
const ITEM_CIBLE = JSON.stringify({
  ev: "creation", ts: "2026-08-30T10:00:00.000Z", id: "TF-0100", statut: "candidat",
  titre: "un item de recette", contenu: "le fait d'origine, possiblement faux",
  demandeur: "pilot (recette)", source: "fixture", date_demande: "2026-08-30",
  forges_cibles_initiales: ["digit-ai-factory"],
  score: { gain: 3, preuve: 3, effort: 3, valeur: 3 },
});

const RECTIF = (surcharges = {}) => JSON.stringify({
  schema: 1, titre: "rectification : le fait d'origine etait faux",
  contenu: "le generateur existe, versionne, cree le 25/08 — git log --diff-filter=A le montre",
  demandeur: "produit-recette", source: "lot de recette", date_demande: "2026-08-31",
  rectifie: "TF-0100", nature_de_la_rectification: "fait_errone", ...surcharges,
});

const CANDIDATURE = JSON.stringify({
  schema: 1, titre: "pilot : une candidature ordinaire", contenu: "c",
  demandeur: "produit-recette", source: "lot de recette", date_demande: "2026-08-31",
  forges_cibles_initiales: ["digit-ai-factory"],
});

let serie = 0;
const ingerer = (lignesSidecar, { archive = null } = {}) => {
  const dossier = join(T, `cas-${++serie}`);
  const registre = join(dossier, "TODO.jsonl");
  const sidecar = join(dossier, `candidature-recette-${serie}.tf.jsonl`);
  mkdirSync(dossier, { recursive: true });
  writeFileSync(registre, ITEM_CIBLE + "\n", "utf8");
  if (archive) writeFileSync(join(dossier, "TODO-ARCHIVE.jsonl"), archive, "utf8");
  writeFileSync(sidecar, lignesSidecar.join("\n") + "\n", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, sidecar, "--registre", registre, "--sans-fetch"],
    { encoding: "utf8", env: ENV });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""), registre };
};

check("verte — une rectification MARQUE l'item visé : maj avec bloc rectification, AUCUN id neuf", () => {
  const r = ingerer([RECTIF()]);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  const ev = readFileSync(r.registre, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
  const maj = ev.find((e) => e.ev === "maj" && e.id === "TF-0100");
  if (!maj || !maj.rectification) throw new Error("aucun événement maj porteur du bloc rectification");
  if (maj.rectification.nature !== "fait_errone") throw new Error("la nature de la rectification est perdue");
  if (ev.some((e) => e.ev === "creation" && e.id !== "TF-0100"))
    throw new Error("un id NEUF a été frappé — la rectification a créé le doublon qu'elle devait éviter");
  if (!/1 rectification\(s\) MARQUÉE/.test(r.sortie)) throw new Error("la sortie ne dit pas la marque posée");
});

check("verte — mélange candidature + rectification : l'événement ingestion compte les deux SÉPARÉMENT", () => {
  const r = ingerer([CANDIDATURE, RECTIF()]);
  if (r.code !== 0) throw new Error(`exit ${r.code} : ${r.sortie.slice(0, 300)}`);
  const ev = readFileSync(r.registre, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
  const ing = ev.find((e) => e.ev === "ingestion");
  if (ing.creations !== 1) throw new Error(`creations=${ing.creations} au lieu de 1 — les rectifications sont comptées comme des créations`);
  if (ing.rectifications !== 1) throw new Error("l'événement ingestion ne consigne pas la rectification");
});

check("rouge — rectifie vise un id INCONNU : rejet atomique, registre intact", () => {
  const r = ingerer([RECTIF({ rectifie: "TF-9999" })]);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/INCONNU/.test(r.sortie)) throw new Error(`le refus ne nomme pas la cause : ${r.sortie.slice(0, 200)}`);
  const ev = readFileSync(r.registre, "utf8").split("\n").filter((l) => l.trim());
  if (ev.length !== 1) throw new Error("le registre a été touché malgré le refus");
});

check("rouge — rectifie vise un id ARCHIVÉ : refusé, avec le remède nommé", () => {
  const archive = JSON.stringify({ ev: "creation", ts: "2026-08-01T10:00:00.000Z", id: "TF-0050",
    statut: "candidat", titre: "t", contenu: "c", demandeur: "pilot (recette)", source: "s",
    date_demande: "2026-08-01", forges_cibles_initiales: ["digit-ai-factory"],
    score: { gain: 1, preuve: 1, effort: 1, valeur: 1 } }) + "\n"
    + JSON.stringify({ ev: "maj", ts: "2026-08-02T10:00:00.000Z", id: "TF-0050", statut: "archive" }) + "\n";
  const r = ingerer([RECTIF({ rectifie: "TF-0050" })], { archive });
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/ARCHIVÉ/.test(r.sortie)) throw new Error(`le refus ne dit pas que l'item est archivé : ${r.sortie.slice(0, 200)}`);
});

check("rouge — nature_de_la_rectification hors des trois valeurs fermées : rejet motivé", () => {
  const r = ingerer([RECTIF({ nature_de_la_rectification: "petite_erreur" })]);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1`);
  if (!/fait_errone, cause_erronee ou annule/.test(r.sortie)) throw new Error("le refus n'énumère pas les natures admises");
});

check("rouge — rectifie mal formé (pas un TF-xxxx) : rejet motivé", () => {
  const r = ingerer([RECTIF({ rectifie: "RT-39" })]);
  if (r.code !== 1) throw new Error(`exit ${r.code} attendu 1 — un id de produit n'est pas un id du registre`);
  if (!/TF-xxxx/.test(r.sortie)) throw new Error("le refus ne dit pas la forme attendue");
});

check("borne — une rectification n'exige AUCUNE cible de forge : elle vise un item, pas une forge", () => {
  const r = ingerer([RECTIF()]);
  if (r.code !== 0) throw new Error(`exit ${r.code} — la rectification a été refusée pour un champ qui ne la concerne pas`);
  if (/forges_cibles_initiales manquant/.test(r.sortie)) throw new Error("le champ de cible a été exigé quand même");
});

try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
console.log(`\nTF-0703 (canal de rectification) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
