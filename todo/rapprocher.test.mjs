#!/usr/bin/env node
/**
 * rapprocher.test.mjs — recette de `rapprocher.mjs` (TF-0618).
 *
 * Les deux sens sur chaque promesse : il TROUVE le doublon fondateur, il NE rapproche PAS deux
 * items qui n'ont en commun qu'un vocabulaire de métier, il ne regarde QUE les items clos, il
 * n'affirme jamais un doublon, et la seconde condition — celle que le corpus réel n'exerce pas —
 * est prouvée VIVANTE par une fixture construite exprès. Joué par `oracles\self-tests.mjs` (I2).
 */
import { rapprochements, itemsDuRegistre, termes, frequences, SEUIL_RECOUVREMENT, RARES_PARTAGES_MIN } from "./rapprocher.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

// ── le corpus de recette : deux items CLOS, plus du vocabulaire de métier partagé par tous ──
const METIER = "oracle controle recette mesure double sens verdict registre parc constat";
const CORPUS = [
  { id: "TF-0001", statut: "corrige", date: "2026-08-24",
    titre: "un fichier nomme null vit a la racine du parc",
    contenu: `${METIER} une redirection vers le puits de sortie jouee sous un shell windows ecrit un fichier nomme null a la racine du parc, hors de tout depot donc hors de tout gitignore` },
  { id: "TF-0002", statut: "corrige", date: "2026-08-23",
    titre: "la restitution impose une typographie au lecteur",
    contenu: `${METIER} les libelles de restitution imposaient une casse et une ponctuation que le destinataire n avait pas demandees, et la consigne le prescrivait sans mesure` },
  { id: "TF-0003", statut: "candidat", date: null,
    titre: "un fichier nomme null vit a la racine du parc, encore candidat",
    contenu: `${METIER} une redirection vers le puits de sortie jouee sous un shell windows ecrit un fichier nomme null a la racine du parc, hors de tout depot donc hors de tout gitignore` },
];
const df = frequences(CORPUS);

// ── 1. le sens VERT : le doublon est trouvé, au premier rang ─────────────────
check("le doublon fondateur est trouve, et au premier rang", () => {
  const entrant = "une redirection vers le puits de sortie sous un shell windows ecrit un fichier nomme null a la racine du parc, hors de tout depot";
  const r = rapprochements(entrant, CORPUS, { df });
  att(r.length >= 1, "aucun rapprochement rendu");
  att(r[0].id === "TF-0001", `premier rang ${r[0].id} au lieu de TF-0001`);
  att(r[0].score >= SEUIL_RECOUVREMENT, `score ${r[0].score} sous le seuil`);
});

// ── 2. le sens ROUGE : le vocabulaire de métier seul ne rapproche rien ───────
check("deux items qui ne partagent QUE du vocabulaire de metier ne sont PAS rapproches", () => {
  const entrant = `${METIER} aucune porte de mise en production ne surveille la bascule d un enregistrement dns vers un nouvel hebergeur`;
  const r = rapprochements(entrant, CORPUS, { df });
  att(r.length === 0, `${r.length} rapprochement(s) rendu(s) sur du vocabulaire partage : ${r.map((x) => x.id).join(", ")}`);
});

// ── 3. seuls les items CLOS sont rapprochés — un candidat n'est pas un travail tranché ──
check("un item CANDIDAT n'est jamais rendu : rapprocher a un candidat n'apprend rien", () => {
  const entrant = "une redirection vers le puits de sortie sous un shell windows ecrit un fichier nomme null a la racine du parc, hors de tout depot";
  const r = rapprochements(entrant, CORPUS, { df });
  att(!r.some((x) => x.id === "TF-0003"), "un item candidat a ete rendu");
});

// ── 4. LA SECONDE CONDITION, prouvée vivante par une fixture ────────────────
// Le corpus réel ne l'exerce pas : ses items sont longs, donc 0.16 de recouvrement implique déjà
// beaucoup de termes partagés. Deux items COURTS, eux, atteignent le seuil sur deux mots — et deux
// mots ne disent rien. Sans ce cas, la clause serait morte en se croyant vivante.
check("deux items COURTS qui partagent deux mots franchissent le seuil et sont pourtant ECARTES", () => {
  const court = [{ id: "TF-9001", statut: "corrige", date: "2026-08-20",
    titre: "", contenu: "gitignore depot racine" }];
  const entrant = "gitignore depot fichier";
  const sansCondition = rapprochements(entrant, court, { df: frequences(court), rares: 0 });
  att(sansCondition.length === 1, "la fixture ne franchit pas le seuil : elle ne prouve rien");
  att(sansCondition[0].score >= SEUIL_RECOUVREMENT, `score ${sansCondition[0].score} sous le seuil`);
  const avecCondition = rapprochements(entrant, court, { df: frequences(court), rares: RARES_PARTAGES_MIN });
  att(avecCondition.length === 0, "la seconde condition n'a pas ecarte le cas court contre court : elle est morte");
});

// ── 5. ce que le rapprochement REND : de quoi le contredire ─────────────────
check("chaque rapprochement porte son identifiant, son statut, sa date et ses termes communs", () => {
  const entrant = "une redirection vers le puits de sortie sous un shell windows ecrit un fichier nomme null a la racine du parc, hors de tout depot";
  const [premier] = rapprochements(entrant, CORPUS, { df });
  att(premier.statut === "corrige", "le statut manque");
  att(premier.date === "2026-08-24", "la date manque");
  att(Array.isArray(premier.communs) && premier.communs.length > 0, "les termes communs manquent");
  att(typeof premier.titre === "string" && premier.titre.length > 0, "le titre manque");
});

// ── 6. l'état COURANT d'un item, pas la somme de ses évènements ─────────────
check("un item qui a bouge trois fois compte UNE fois, avec son dernier statut", () => {
  const items = itemsDuRegistre([
    { ev: "creation", id: "TF-0050", titre: "t", contenu: "c" },
    { ev: "maj", id: "TF-0050", statut: "decide", date_decision: "2026-08-21" },
    { ev: "maj", id: "TF-0050", statut: "corrige", date_correction: "2026-08-22" },
    { ev: "ingestion", lot_sha: "abc" },
  ]);
  att(items.length === 1, `${items.length} items au lieu de 1`);
  att(items[0].statut === "corrige", `statut ${items[0].statut} au lieu de corrige`);
  att(items[0].date === "2026-08-22", `date ${items[0].date} au lieu de la derniere`);
  att(items[0].titre === "t", "le titre de la creation est perdu");
});

// ── 7. les termes : ni les mots courts, ni les accents comme frontière ──────
check("les termes ignorent les mots courts et normalisent les accents", () => {
  const t = termes("Le DÉPÔT et la RACINE du parc, un mot bref");
  att(t.has("depot"), "l'accent n'est pas normalise");
  att(t.has("racine"), "un terme plein manque");
  att(!t.has("bref"), "un mot de 4 lettres a ete retenu");
  att(!t.has("le"), "un mot de 2 lettres a ete retenu");
});

console.log(`\nrapprocher (TF-0618) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
