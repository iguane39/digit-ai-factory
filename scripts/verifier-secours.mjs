#!/usr/bin/env node
/**
 * verifier-secours.mjs — une procédure de secours se RELIT avant d'être crue (TF-0512, 22/08/2026).
 *
 * LE FAIT QUI A FAIT NAÎTRE CET OUTIL. Un mode de test conçu pour imprimer sa commande de retour
 * arrière AVANT le geste risqué — précaution voulue, pour que la restauration soit déjà consignée
 * si l'étape casse au milieu — a bien imprimé la commande… avec l'adresse de l'émetteur remplacée
 * par `***`. Le moteur de pipeline avait pris l'URL du tenant pour un secret et l'avait masquée.
 *
 * La commande était donc INUTILISABLE telle quelle, et elle l'était PRÉCISÉMENT dans le seul
 * scénario où on irait la chercher : l'urgence. Une précaution qui s'annule au moment où elle sert
 * n'est pas une précaution, c'est une croyance.
 *
 * Ce n'est propre à aucun moteur : tout secours imprimé dans un journal est exposé au même effet, et
 * le masquage est IMPRÉVISIBLE par nature — il dépend de ce que le moteur a appris à masquer. La
 * seule parade est de RELIRE, dans le canal où on irait chercher la procédure. C'est le geste que
 * M-4 exige déjà pour l'EXÉCUTION d'un rollback, appliqué à sa LISIBILITÉ.
 *
 * Usage :
 *   node scripts\verifier-secours.mjs <fichier> [<fichier>…]      → verdict JSON, exit 0/1
 *   node scripts\verifier-secours.mjs --stdin                     → relit une sortie de journal
 *
 * Ce qu'il REFUSE, et rien d'autre : une valeur masquée ou vide DANS UNE LIGNE DE COMMANDE. Le
 * texte explicatif peut parler de `***` sans que ce soit un défaut — c'est la différence entre
 * DÉCRIRE un masquage et EN SUBIR un, et confondre les deux ferait crier sur cette page même.
 */
import { readFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);

// Les formes de masquage rencontrées dans les moteurs de pipeline usuels. C'est une DONNÉE, elle
// grossira : chaque moteur a son masque, et aucun ne prévient.
const MASQUES = [
  ["***", "masque de pipeline (trois astérisques)"],
  ["[REDACTED]", "masque explicite entre crochets"],
  ["<REDACTED>", "masque explicite entre chevrons"],
  ["[MASKED]", "masque explicite (anglais)"],
  ["[hidden]", "masque explicite (minuscules)"],
  ["$(echo ***)", "masque au milieu d'une substitution"],
];

// Une LIGNE DE COMMANDE : ce qu'on copierait pour agir. On ne juge que celles-là.
const EST_COMMANDE = /^\s*(?:[$>]\s*)?(?:sudo\s+)?(?:node|npm|npx|python|py|docker|kubectl|helm|git|az|aws|gcloud|ssh|scp|curl|wget|systemctl|make|sh|bash|pwsh|powershell|terraform|ansible)\b/;
// Un bloc de code encadré compte aussi comme zone de commande, même sans verbe reconnu : c'est là
// que vivent les commandes composées.
const CLOTURE = /^\s*```/;

function juger(nom, texte) {
  const findings = [];
  let dansBloc = false;
  const lignes = texte.split(/\r?\n/);
  lignes.forEach((l, i) => {
    if (CLOTURE.test(l)) { dansBloc = !dansBloc; return; }
    const estCommande = dansBloc || EST_COMMANDE.test(l);
    if (!estCommande) return;
    for (const [masque, quoi] of MASQUES) {
      if (l.includes(masque)) {
        findings.push({
          regle: "S-1", severite: "bloquant", ou: `${nom}:${i + 1}`,
          message: `valeur MASQUÉE dans une ligne de commande — ${quoi} : « ${l.trim().slice(0, 100)} ». ` +
            "La commande est inutilisable telle quelle, et elle l'est dans le seul scénario où on " +
            "irait la chercher. Composer la commande de valeurs non masquables (tag d'image, " +
            "identifiant de version, nom de service), ou nommer la variable dont la valeur se lit ailleurs.",
        });
      }
    }
    // Une variable vide est le même défaut, en plus discret : `--url=` ou `--url ""`.
    const vide = l.match(/(--?[\w-]+)\s*(?:=\s*(?:""|''|)?$|\s+(?:""|'')\s*(?:$|\\))/);
    if (vide) {
      findings.push({
        regle: "S-2", severite: "bloquant", ou: `${nom}:${i + 1}`,
        message: `option SANS VALEUR dans une ligne de commande — « ${vide[1]} » : « ${l.trim().slice(0, 100)} ». ` +
          "Une valeur perdue en route ne se voit pas à la lecture rapide, et la commande échouera au pire moment.",
      });
    }
  });
  return findings;
}

const NON_JUGE = [
  "la JUSTESSE de la procédure : cet outil relit sa LISIBILITÉ, jamais qu'elle restaure vraiment — " +
  "l'exécution est le domaine de M-4",
  "le TEXTE EXPLICATIF n'est pas jugé : une page peut parler de `***` sans le subir, et confondre " +
  "décrire un masquage avec en subir un ferait crier sur la doctrine elle-même",
  "les masques HORS liste : chaque moteur a le sien et aucun ne prévient. La liste est une donnée, " +
  "elle grossit par les incidents — pas par la devinette",
  "un secours qui n'existe PAS du tout : cet outil juge un fichier qu'on lui donne, il ne va pas " +
  "chercher si la procédure manque (c'est M-4 qui l'exige)",
];

let cibles = [];
let corpus = [];
if (args.includes("--stdin")) {
  corpus = [["<stdin>", readFileSync(0, "utf8")]];
} else {
  cibles = args.filter((a) => !a.startsWith("--"));
  if (!cibles.length) {
    process.stdout.write(JSON.stringify({
      outil: "verifier-secours", verdict: "ERREUR",
      message: "usage : node scripts\\verifier-secours.mjs <fichier> [<fichier>…] | --stdin",
    }, null, 1) + "\n");
    process.exit(2);
  }
  for (const c of cibles) {
    if (!existsSync(c)) {
      process.stdout.write(JSON.stringify({
        outil: "verifier-secours", verdict: "ERREUR", message: `fichier introuvable : ${c}`,
      }, null, 1) + "\n");
      process.exit(2);
    }
    corpus.push([c, readFileSync(c, "utf8")]);
  }
}

const findings = corpus.flatMap(([nom, texte]) => juger(nom, texte));
const verdict = findings.length ? "FAIL" : "PASS";
process.stdout.write(JSON.stringify({
  outil: "verifier-secours", version: "1.0.0",
  cibles: corpus.map(([n]) => n), verdict,
  findings: findings.length ? findings : [{
    regle: "S-1/S-2", severite: "info", ou: "-",
    message: "aucune valeur masquée ni option vide dans les lignes de commande — la procédure est lisible",
  }],
  non_juge: NON_JUGE,
  remede: "composer la commande de valeurs non masquables, ou nommer la variable dont la valeur se lit ailleurs (ETAPE-MEP §2 bis)",
}, null, 1) + "\n");
process.exit(verdict === "PASS" ? 0 : 1);
