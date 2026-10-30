#!/usr/bin/env node
/**
 * mobiliser.mjs — LES 13 VERDICTS D'UNE DEMANDE, ÉCRITS CHEZ LE PRODUIT (T4, item 2 de TF-1949, D-69 (a) et D-79 (c) du 26/10/2026).
 *
 * LE FAIT : sur 10 produits clos ou publiés, 2 portaient leurs 4 livrables de forge ; sur 7 jours, aucune trace de forge-audit sur
 * une douzaine de demandes d'audit, aucune de forge-data sur les demandes de données (diagnostic 20261026a, section d, T4).
 * Remarque humaine tenue : « sans figer les forges attendues […], avec des forges privilégiées ok, mais réalisant un check à chaque
 * fois en fonction du type de demande si chaque forge doit être sollicitée avec argumentation ».
 *
 * CE QUE FAIT L'ÉCRIVAIN : à chaque demande chez un produit, il ajoute UNE ligne à `forge/mobilisation.jsonl` : horodatage relevé à
 * l'écriture, type de demande (carte `references/CARTE-FORGES.json` du pilot), profil du produit (`forge/PROFIL.json`), et pour
 * chacune des 13 forges « mobilisee » ou « ecartee » avec son motif. Il rend la seule ligne que l'écran montre, « Je mobilise : … ».
 * Il refuse (exit 1, rien d'écrit) une forge sans verdict, un motif absent, de moins de 3 mots ou resté au gabarit, un type hors de
 * la carte, un profil non déclaré, et depuis D-99 (b) ops, websec ou data écartées d'une demande qui les vise sans un fait mesuré
 * (nombre, chemin ou commande citée). Le pilot est lu, jamais écrit.
 *
 *   node <pilot>/scripts/mobiliser.mjs --preparer --type <type>[,<type>] [--sortie <fichier.json>]
 *       le squelette des 13 verdicts : forges privilégiées et forges que le profil désigne proposées « mobilisee », les autres
 *       « ecartee », chaque motif au gabarit « <…> » à remplacer ;
 *   node <pilot>/scripts/mobiliser.mjs --type <type>[,<type>] --verdicts <fichier.json | JSON> [--demande "<résumé>"]
 *       écrit la ligne ; `--verdicts` accepte le squelette rempli (clé `verdicts`) ou l'objet des 13 verdicts ; le type peut venir
 *       du squelette ;
 *   node <pilot>/scripts/mobiliser.mjs --verifier
 *       avant « livré » : les livrables exigés des forges mobilisées à la dernière demande, présents ou manquants (la lecture du
 *       verrou S85) ; exit 0 rien ne manque, 1 un livrable manque, 2 aucune trace ;
 *   options : --profil domaine_public=oui|non,page_indexable=…,donnees_personnelles=…,agents=…,mise_en_production=…  (déclare ou
 *       revoit forge/PROFIL.json, puis l'emploie) ; --produit <dossier> (désigne le produit sans y être).
 * Sortie : une ligne JSON ; exit 0 = écrit (ou squelette rendu), 1 = refus motivé, 2 = usage, carte illisible ou hors d'un produit.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  CHEMIN_TRACE, FORGES, derniereDemande, ecartsSansFait, ecrireProfil, etatDesLivrables, ligneDeTrace, lireCarte, lireProfil, lireProfilTexte, squelette,
  typesDe, validerVerdicts,
} from "../oracles/lib-mobilisation.mjs";
import { produitDe } from "../oracles/hook-restitution.mjs";

const args = process.argv.slice(2);
const valeur = (nom) => { const i = args.indexOf(nom); return i >= 0 && i + 1 < args.length ? args[i + 1] : null; };
const sortie = (o, code) => { console.log(JSON.stringify(o)); process.exit(code); };
const OUTIL = "mobiliser";
const PROFIL_EXEMPLE = "--profil domaine_public=non,page_indexable=non,donnees_personnelles=non,agents=non,mise_en_production=oui";

if (!args.length || args.includes("--aide") || args.includes("--help"))
  sortie({ outil: OUTIL, usage: "node <pilot>/scripts/mobiliser.mjs --preparer --type <type> [--sortie <f>] | --type <type> --verdicts <f|JSON> [--demande \"…\"] [--profil …] [--produit <dossier>]" }, 2);

const { carte, erreur } = lireCarte();
if (erreur) sortie({ outil: OUTIL, verdict: "ERREUR", message: `${erreur} — node scripts/verifier-carte-forges.mjs au pilot` }, 2);

const produitDemande = valeur("--produit");
const produit = produitDemande ? resolve(produitDemande) : produitDe(process.cwd());
if (!produit || !existsSync(join(produit, "forge")))
  sortie({ outil: OUTIL, verdict: "ERREUR", message: "le dossier de travail n'est pas un produit (aucun forge/retours/ en remontant) : la trace vit chez le produit — désigne-le avec --produit <dossier>" }, 2);

// --verifier (item 3 de TF-1949) : avant « livré », les livrables exigés des forges mobilisées à la DERNIÈRE demande, présents ou
// manquants — la même lecture que le verrou S85 d'oracle-synthese. Exit 0 rien ne manque, 1 un livrable manque, 2 aucune trace.
if (args.includes("--verifier")) {
  const trace = derniereDemande(produit);
  if (!trace.derniere) sortie({ outil: OUTIL, verdict: "SANS_TRACE", message: `${trace.chemin} ${trace.existe ? "sans ligne lisible" : "absent"} : écris d'abord les 13 verdicts de la demande (--preparer, puis --verdicts)` }, 2);
  const d = trace.derniere;
  const { etats, manquants } = etatDesLivrables(produit, carte, d);
  sortie({ outil: OUTIL, verdict: manquants.length ? "MANQUE" : "PRESENT", derniere_demande: { ts: d.ts, type: d.type, demande: d.demande ?? null },
    exiges: etats.map((e) => ({ forge: e.forge, livrable: e.libelle, present: e.present, trouve: e.trouve, chemins: e.chemins })),
    manquants: manquants.map((m) => `${m.forge} → ${m.libelle} (${m.chemins.join(" ou ")})`),
    remede: manquants.length ? "produire chaque livrable manquant, ou écarter avec son motif la forge qui n'a pas servi dans une nouvelle ligne de trace (--verdicts)" : null }, manquants.length ? 1 : 0);
}

const DEMANDE_A_REMPLIR = "<résumé de la demande>";

// Les verdicts : un fichier ou un JSON en ligne ; le squelette rempli de --preparer porte aussi ses types et sa demande.
let fourni = null;
const brut = valeur("--verdicts");
if (brut) {
  try { fourni = JSON.parse(brut.trim().startsWith("{") ? brut : readFileSync(resolve(brut), "utf8").replace(/^﻿/, "")); }
  catch (e) { sortie({ outil: OUTIL, verdict: "REFUS", refus: [`verdicts illisibles (${brut.slice(0, 80)}) : ${e.message}`] }, 1); }
}
const idsTypes = String(valeur("--type") || (fourni && Array.isArray(fourni.types) ? fourni.types.join(",") : ""))
  .split(/[,+]/).map((s) => s.trim()).filter(Boolean);
if (!idsTypes.length) sortie({ outil: OUTIL, verdict: "REFUS", refus: [`type de demande absent : --type <${(carte.types || []).map((t) => t.id).join(" | ")}>`] }, 1);
const t = typesDe(carte, idsTypes);
if (t.inconnus) sortie({ outil: OUTIL, verdict: "REFUS", refus: [`type(s) hors de la carte : ${t.inconnus.join(", ")} (types connus : ${t.connus.join(", ")})`] }, 1);

// Le profil : --profil le déclare (ou le revoit) ; sinon forge/PROFIL.json.
let profil = null;
const profilTexte = valeur("--profil");
if (profilTexte) {
  const p = lireProfilTexte(profilTexte);
  if (p.erreur) sortie({ outil: OUTIL, verdict: "REFUS", refus: [`${p.erreur} — ${PROFIL_EXEMPLE}`] }, 1);
  profil = p.profil;
} else {
  const p = lireProfil(produit);
  if (!p.erreur) profil = p.profil;
  else if (!args.includes("--preparer"))
    sortie({ outil: OUTIL, verdict: "REFUS", refus: [`${p.erreur} : le profil se déclare une fois, et se revoit quand un signal change — ${PROFIL_EXEMPLE}`] }, 1);
}

if (args.includes("--preparer")) {
  // TF-2017 (RT-27, 29/10/2026) : le squelette porte `demande`, que --verdicts lit ; sans ce champ, la
  // session l'ajoutait au fichier et la trace sortait avec `demande: null`, sans un mot.
  const s = { types: t.types.map((x) => x.id), demande: DEMANDE_A_REMPLIR, profil, verdicts: squelette(carte, t.types, profil),
    consigne: "remplace « demande » par le résumé de la demande, chaque motif « <…> » par une raison de 3 mots au moins, passe une forge à « ecartee » ou à « mobilisee » selon la demande et le profil, puis : node <pilot>/scripts/mobiliser.mjs --verdicts <ce fichier>" };
  const f = valeur("--sortie");
  if (f) { writeFileSync(resolve(f), JSON.stringify(s, null, 2) + "\n", "utf8"); sortie({ outil: OUTIL, squelette: resolve(f), forges: FORGES.length, profil_connu: !!profil }, 0); }
  sortie({ outil: OUTIL, ...s }, 0);
}

if (!fourni) sortie({ outil: OUTIL, verdict: "REFUS", refus: ["verdicts absents : --verdicts <fichier.json | JSON> (squelette : --preparer --type <type>)"] }, 1);
const { refus, verdicts } = validerVerdicts(fourni.verdicts && typeof fourni.verdicts === "object" ? fourni.verdicts : fourni);
if (refus.length) sortie({ outil: OUTIL, verdict: "REFUS", refus }, 1);

if (profilTexte) ecrireProfil(produit, profil);
// La demande : --demande prime, sinon le champ du fichier. Le gabarit laissé tel quel est refusé ; une
// demande absente s'écrit, mais la sortie le dit (TF-2017 : un champ ignoré en silence est le défaut).
const demande = valeur("--demande") ?? (fourni && typeof fourni.demande === "string" ? fourni.demande.trim() || null : null);
if (demande === DEMANDE_A_REMPLIR)
  sortie({ outil: OUTIL, verdict: "REFUS", refus: [`demande laissée au gabarit (« ${DEMANDE_A_REMPLIR} ») : écris son résumé dans le fichier, ou passe --demande "<résumé>"`] }, 1);
const sansFait = ecartsSansFait(t.types, verdicts, demande);
if (sansFait.length) sortie({ outil: OUTIL, verdict: "REFUS", refus: sansFait }, 1);
const ligne = ligneDeTrace({ carte, types: t.types, profil, verdicts, demande });
mkdirSync(join(produit, "forge"), { recursive: true });
appendFileSync(join(produit, CHEMIN_TRACE), JSON.stringify(ligne) + "\n", "utf8");
sortie({ outil: OUTIL, verdict: "ECRIT", trace: join(produit, CHEMIN_TRACE), ts: ligne.ts, type: ligne.type, mobilisees: ligne.mobilisees,
  ligne_ecran: ligne.ligne, demande: ligne.demande ?? null, profil_declare: profilTexte ? join(produit, "forge", "PROFIL.json") : null,
  ...(demande ? {} : { avertissement: "demande absente : la trace porte « demande: null » — la renseigner dans le fichier (champ demande) ou par --demande" }) }, 0);
