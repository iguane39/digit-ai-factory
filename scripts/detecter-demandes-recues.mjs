#!/usr/bin/env node
/**
 * detecter-demandes-recues.mjs — une demande d'évolution reçue d'un autre produit, non encore
 * enregistrée, ne reste pas invisible (TF-1522, 02/10/2026, canal §3 sexies de
 * CONTRAT-INTERFACE.md, TF-1491).
 *
 * POURQUOI CE FICHIER EXISTE. CONTRAT-INTERFACE.md le dit en toutes lettres : « rien ne le joue
 * encore : ni gabarit de demande, ni juge de forme…, ni détection d'une demande reçue et non
 * enregistrée ». Ce module est le TROISIÈME des trois outils manquants
 * (`gabarits\DEMANDE-PRODUIT.md` le gabarit, `gabarits\oracle-demande-produit.mjs` le juge de
 * forme, celui-ci la détection). MÊME CLASSE DE DÉFAUT que `oracles\oracle-boite-entree.mjs`
 * (TF-0908, 14/08/2026) sur le canal produit → pilot : « un registre à jour ne dit rien de ce
 * qui n'y est jamais entré » — un fichier posé dans `input\00-travaux\` n'est un travail PRIS
 * que lorsqu'une session l'a LU et enregistré ; rien avant ce module ne distinguait une demande
 * déposée hier d'une demande déposée il y a un mois et jamais ouverte.
 *
 * CE QUE CE MODULE VÉRIFIE, ET CE QU'IL NE VÉRIFIE PAS. Il énumère les fichiers
 * `<demandeur> - DEMANDE - AAAAMMJJ<indice>.md` d'`input\00-travaux\` du produit (JAMAIS les
 * lots `pilot - TRAVAUX - …`, un canal distinct déjà couvert par `oracle-travaux-pilot.mjs`) et
 * les confronte à `forge\ledger.jsonl` : chaque demande doit avoir une entrée
 * `{type: "demande_recue", fichier: "<nom>"}` consignée (§3 sexies, point 3). Une demande SANS
 * cette entrée est un FAIL, nommée avec son âge. Il ne juge PAS la forme de la demande (c'est
 * `oracle-demande-produit.mjs`) ni la DÉCISION prise sur elle (retenue ou écartée, qui reste au
 * produit) — seulement qu'une décision sur son sort a été consignée, quelle qu'elle soit.
 *
 * SANS OBJET, jamais un FAIL, quand le dossier `input\00-travaux\` n'existe pas (aucune demande
 * possible) ou quand `forge\ledger.jsonl` n'existe pas (le produit n'est pas encore instancié —
 * `oracle-conformite-projet` R-19 le dit déjà, ce n'est pas le sujet de ce module).
 *
 * Usage : node scripts\detecter-demandes-recues.mjs [--racine <produit>] [--json]
 * Exit : 0 = aucune demande en attente · 1 = au moins une demande non enregistrée · 2 = erreur
 *        d'argument.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

//: Une demande reçue d'un autre produit — jamais un lot du pilot (`pilot - TRAVAUX - …`).
const NOM_DEMANDE = /^(?!pilot - TRAVAUX - ).+ - DEMANDE - (\d{8})[a-z]?\.md$/i;

/** Les entrées `demande_recue` du ledger, par nom de fichier cité. Une ligne JSON illisible est
 *  ignorée plutôt que de faire échouer tout le relevé — ce module mesure l'ARRIVÉE, pas
 *  l'intégrité du ledger (R-42 s'en charge déjà). */
function demandesEnregistrees(ledger) {
  const vues = new Set();
  if (!existsSync(ledger)) return null;
  for (const ligne of readFileSync(ledger, "utf8").split("\n")) {
    if (!ligne.trim()) continue;
    let o;
    try { o = JSON.parse(ligne); } catch { continue; }
    if (o && o.type === "demande_recue" && typeof o.fichier === "string") vues.add(o.fichier);
  }
  return vues;
}

/** Rend `{ verdict, constats, non_juge }`. `verdict` ∈ PASS | FAIL | SANS_OBJET. */
export function verifier(racine) {
  const boite = join(racine, "input", "00-travaux");
  const ledger = join(racine, "forge", "ledger.jsonl");
  const constats = [];

  if (!existsSync(boite)) {
    return { verdict: "SANS_OBJET", constats: [], non_juge: [`${boite} absent — aucune demande possible`] };
  }
  const enregistrees = demandesEnregistrees(ledger);
  if (enregistrees === null) {
    return { verdict: "SANS_OBJET", constats: [], non_juge: [`${ledger} absent — produit non instancié (R-19 d'oracle-conformite-projet le mesure déjà)`] };
  }

  const fichiers = readdirSync(boite, { withFileTypes: true })
    .filter((f) => f.isFile() && NOM_DEMANDE.test(f.name))
    .map((f) => f.name)
    .sort();

  const nonEnregistrees = fichiers.filter((f) => !enregistrees.has(f));
  if (nonEnregistrees.length) {
    for (const f of nonEnregistrees) {
      const m = NOM_DEMANDE.exec(f);
      const date = m ? `${m[1].slice(0, 4)}-${m[1].slice(4, 6)}-${m[1].slice(6, 8)}` : "date illisible";
      constats.push({ statut: "FAIL", fichier: f,
        message: `${f} (déposée le ${date}) — aucune entrée « demande_recue » au ledger : cette demande n'a jamais été ouverte ni décidée`,
        remede: `consigner une entrée {type:"demande_recue", demandeur, fichier:"${f}", decision:"retenue"|"ecartee", motif} à forge\\ledger.jsonl, puis traiter ou écarter (§3 sexies, point 3)` });
    }
  } else if (fichiers.length) {
    constats.push({ statut: "PASS", message: `${fichiers.length} demande(s) dans la boîte, toutes enregistrées` });
  } else {
    constats.push({ statut: "PASS", message: "boîte vide — aucune demande en attente" });
  }

  return { verdict: constats.some((c) => c.statut === "FAIL") ? "FAIL" : "PASS", constats, non_juge: [] };
}

// ---- CLI --------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && import.meta.url.toLowerCase().endsWith(process.argv[1].toLowerCase().replaceAll("\\", "/").replace(/^[a-z]:/, "").replace(/^\//, ""));
if (lanceEnDirect || (process.argv[1] && process.argv[1].endsWith("detecter-demandes-recues.mjs"))) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--racine");
  const racine = resolve(i >= 0 && args[i + 1] ? args[i + 1] : ".");
  const r = verifier(racine);
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    console.log(`detecter-demandes-recues — ${racine}`);
    console.log(`verdict : ${r.verdict}`);
    for (const c of r.constats) console.log(`  [${c.statut}] ${c.message}`);
    for (const n of r.non_juge) console.log(`  (non jugé) ${n}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
