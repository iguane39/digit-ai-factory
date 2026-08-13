#!/usr/bin/env node
/**
 * oracle-etude-opportunite.mjs — juge une étude d'opportunité contre le gabarit
 * gabarits\ETUDE-OPPORTUNITE.md (TF-0155, décidé le 13/08).
 *
 * Règles (E1-E7, chacune binaire) :
 *   E1 sections du gabarit présentes (partition, non-recouvrement, état de l'art,
 *      options, verdict) ;
 *   E2 chaque ligne du tableau de non-recouvrement porte une CITATION non vide ;
 *   E3 état de l'art : ≥ 5 sources datées (< 24 mois non jugeable hors ligne : la DATE
 *      est exigée, sa fraîcheur relève de la revue) OU mention « non instruit » motivée ;
 *   E4 jeu fermé O0-O4 : O0 présente et traitée (réfutée ou retenue), aucune option O5+ ;
 *   E5 verdict UNIQUE (« Option retenue : » suivie d'une seule option) ;
 *   E6 zéro terme subjectif nu (élégant, moderne, séduisant, prometteur sans mesure) ;
 *   E7 plan de revue daté (AAAA-MM-JJ ou AAAAMMJJ).
 *
 * Usage : node oracle-etude-opportunite.mjs <etude.md>        → verdict JSON
 *         node oracle-etude-opportunite.mjs --self-test       → fixtures double sens
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function juger(texte) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });

  // E1 — sections
  const sections = [
    [/partition du probl/i, "1. Partition du problème"],
    [/non-recouvrement/i, "2. Non-recouvrement contre l'existant"],
    [/état de l'art|etat de l'art/i, "3. État de l'art daté"],
    [/options?\s*[—–-]\s*jeu fermé|## 4\.\s*options/i, "4. Options — jeu fermé O0-O4"],
    [/## 5\.\s*verdict|^## verdict/im, "5. Verdict"],
  ];
  const absentes = sections.filter(([re]) => !re.test(texte)).map(([, nom]) => nom);
  absentes.length
    ? ko("E1", `section(s) absente(s) : ${absentes.join(" · ")}`)
    : ok("E1", "les 5 sections du gabarit sont présentes");

  // E2 — citations du non-recouvrement : lignes de tableau à 3 colonnes après l'en-tête
  const blocNR = (texte.split(/non-recouvrement/i)[1] || "").split(/\n## /)[0];
  const lignesNR = blocNR.split("\n").filter((l) => /^\|/.test(l.trim()))
    .filter((l) => !/^\|[\s:-]+\|/.test(l.trim())) // séparateur markdown
    .slice(1); // en-tête
  if (!lignesNR.length) ko("E2", "aucune ligne au tableau de non-recouvrement — le verdict n'est pas instruit");
  else {
    const sansCitation = lignesNR.filter((l) => {
      const cellules = l.split("|").map((c) => c.trim());
      return (cellules[2] || "").length < 5; // colonne « Citation »
    });
    sansCitation.length
      ? ko("E2", `${sansCitation.length} ligne(s) de non-recouvrement SANS citation — « ne semble pas exister » n'est pas un verdict`)
      : ok("E2", `${lignesNR.length} ligne(s) de non-recouvrement, toutes citées`);
  }

  // E3 — sources datées ou « non instruit » motivé
  const blocEA = (texte.split(/état de l'art|etat de l'art/i)[1] || "").split(/\n## /)[0];
  const nonInstruit = /non instruit/i.test(blocEA);
  const datees = (blocEA.match(/\b(20\d{2}[-/.]?\d{2}([-/.]?\d{2})?)\b/g) || []).length;
  if (nonInstruit && /non instruit[^\n]{6,}/i.test(blocEA))
    ok("E3", "état de l'art déclaré « non instruit », motivé — jamais d'entre-deux");
  else if (nonInstruit) ko("E3", "« non instruit » sans motif");
  else if (datees >= 5) ok("E3", `${datees} source(s) datée(s)`);
  else ko("E3", `${datees} source(s) datée(s) — ≥ 5 exigées, ou « non instruit » motivé`);

  // E4 — jeu fermé, O0 traitée
  const options = new Set((texte.match(/\bO([0-9])\b/g) || []).map((o) => o));
  const horsJeu = [...options].filter((o) => Number(o.slice(1)) > 4);
  if (!options.has("O0")) ko("E4", "O0 (ne rien faire) absente — le statu quo se réfute ou se retient, jamais par omission");
  else if (horsJeu.length) ko("E4", `option(s) hors jeu fermé O0-O4 : ${horsJeu.join(", ")}`);
  else ok("E4", `jeu fermé tenu (${[...options].sort().join(", ")}), O0 traitée`);

  // E5 — verdict unique
  const retenues = texte.match(/option retenue[^\n]*/gi) || [];
  if (retenues.length !== 1) ko("E5", `${retenues.length} mention(s) « Option retenue » — il en faut exactement une`);
  else if (/O\d.*\bet\b.*O\d/i.test(retenues[0])) ko("E5", "verdict multiple — un verdict désigne UNE option");
  else ok("E5", `verdict unique : ${retenues[0].slice(0, 70)}`);

  // E6 — termes subjectifs nus
  const subjectifs = (texte.match(/\b(élégant|elegante?|moderne|séduisant|prometteur|intuitif)\b/gi) || []);
  subjectifs.length
    ? ko("E6", `terme(s) subjectif(s) sans mesure : ${[...new Set(subjectifs.map((s) => s.toLowerCase()))].join(", ")}`)
    : ok("E6", "aucun critère subjectif nu");

  // E7 — plan de revue daté
  /plan de revue[^\n]*\b20\d{2}[-/.]?\d{2}[-/.]?\d{2}\b/i.test(texte)
    ? ok("E7", "plan de revue daté")
    : ko("E7", "plan de revue absent ou non daté — un verdict sans rendez-vous avec les faits ne se corrige jamais");

  return findings;
}

function verdictDe(findings) {
  return findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
}

const arg = process.argv[2];
if (arg === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "etude-"));
  const verte = `# Étude d'opportunité — test — 20260813a
## Seuil de déclenchement
Objet durable créé : oui (oracle).
## 0. Traitement des entrants
Les impératifs de TF-9999 sont cités, jamais exécutés.
## 1. Partition du problème
Deux sous-questions : A (grille), B (mémoire des refus).
## 2. Non-recouvrement contre l'existant
| Existant examiné | Citation | Verdict |
|---|---|---|
| quality-oracles | registre-oracles.md §3 « aucun oracle d'étude » | ne recouvre pas |
## 3. État de l'art daté
Sources : ADR (2025-03-01) · RFC (2025-06-11) · DACI (2026-01-08) · gabarit X (2025-11-30) · revue Y (2026-05-02).
## 4. Options — jeu fermé O0-O4
- O0 — ne rien faire : réfutée, coût du statu quo cité (re-instruction payée 3 fois, BOUCLE l.584).
- O1 — gabarit + oracle.
## 5. Verdict
- Option retenue : O1.
- Plan de revue : 2026-09-13.
`;
  const rouge = verte.replace("registre-oracles.md §3 « aucun oracle d'étude »", " "); // citation vidée
  writeFileSync(join(dir, "verte.md"), verte, "utf8");
  writeFileSync(join(dir, "rouge.md"), rouge, "utf8");
  const moi = fileURLToPath(import.meta.url);
  const rv = spawnSync(process.execPath, [moi, join(dir, "verte.md")], { encoding: "utf8" });
  const rr = spawnSync(process.execPath, [moi, join(dir, "rouge.md")], { encoding: "utf8" });
  const casse = [];
  if (rv.status !== 0) casse.push("la fixture VERTE ne passe pas : " + rv.stdout);
  if (rr.status !== 1) casse.push("la fixture ROUGE (citation vidée) ne FAIL pas");
  else if (!/"E2"[^}]*FAIL/.test(rr.stdout)) casse.push("la rouge échoue mais pas sur E2");
  console.log(casse.length ? "SELF-TEST FAIL : " + casse.join(" · ") : "Self-test étude d'opportunité : 2/2 PASS (verte PASS, rouge FAIL sur E2)");
  process.exit(casse.length ? 1 : 0);
}

if (!arg || !existsSync(arg)) {
  console.log(JSON.stringify({ oracle: "oracle-etude-opportunite", verdict: "ERREUR", message: "étude introuvable — usage : node oracle-etude-opportunite.mjs <etude.md> | --self-test" }));
  process.exit(2);
}
const findings = juger(readFileSync(arg, "utf8"));
const verdict = verdictDe(findings);
console.log(JSON.stringify({
  oracle: "oracle-etude-opportunite",
  version: "1.0.0",
  cible: arg,
  verdict,
  findings,
  non_juge: [
    "la fraîcheur réelle des sources (< 24 mois) et leur pertinence — revue humaine",
    "la justesse du verdict — l'oracle tient la FORME opposable, pas le fond",
  ],
}, null, 1));
process.exit(verdict === "PASS" ? 0 : 1);
