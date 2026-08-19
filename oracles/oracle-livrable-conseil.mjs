#!/usr/bin/env node
/**
 * oracle-livrable-conseil.mjs — juge les deux livrables d'un run de conseil
 * (references\RUN-CONSEIL.md, GO humain du 19/08/2026 — étude 20260819c) :
 * le diagnostic d'exploitation (gabarits\DIAGNOSTIC-EXPLOITATION.md) et la démarche
 * ROI (gabarits\DEMARCHE-ROI.md). Le type est détecté au titre.
 *
 * Règles (binaires) :
 *   LC1 sections du gabarit du type présentes ;
 *   LC2 tout montant (€) ou pourcentage (%) porte une source `[src: …]` ou la mention
 *       « à vérifier » sur sa ligne — un chiffre sans source ne vaut rien ;
 *   LC3 (diagnostic) chaque recommandation cite >= 1 mesure M-xx, et chaque M-xx cité
 *       existe au tableau des mesures — un avis sans mesure n'entre pas au livrable ;
 *   LC4 (démarche ROI) chaque lot porte ses trois critères (utile, utilisable, utilisé)
 *       non vides ET un jalon daté — sinon ce n'est pas un lot, c'est un chapitre ;
 *   LC5 plan de revue daté (AAAA-MM-JJ).
 *
 * Usage : node oracle-livrable-conseil.mjs <livrable.md>   → verdict JSON
 *         node oracle-livrable-conseil.mjs --self-test     → fixtures double sens (2 types)
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function lignesTableau(bloc) {
  return (bloc || "").split("\n")
    .filter((l) => /^\|/.test(l.trim()))
    .filter((l) => !/^\|[\s:|-]+\|?\s*$/.test(l.trim()))
    .slice(1);
}

function section(texte, re) {
  const m = texte.split(/\n(?=## )/).find((b) => re.test(b.split("\n")[0] || ""));
  return m || "";
}

function juger(texte) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });

  const estDiagnostic = /^#\s*Diagnostic d'exploitation/im.test(texte);
  const estRoi = /^#\s*D[ée]marche ROI/im.test(texte);
  if (!estDiagnostic && !estRoi) return null; // non jugeable

  // LC1 — sections du type
  const SECTIONS = estDiagnostic
    ? [[/sympt[ôo]me et p[ée]rim[èe]tre/i, "1. Symptôme et périmètre"],
       [/mesures ex[ée]cut[ée]es/i, "2. Mesures exécutées"],
       [/causes candidates/i, "3. Causes candidates"],
       [/recommandations/i, "4. Recommandations"],
       [/plan de revue/i, "5. Plan de revue"]]
    : [[/hypoth[èe]ses et sources/i, "1. Hypothèses et sources"],
       [/^## .*lots/im, "2. Lots"],
       [/trajectoire/i, "3. Trajectoire de construction et migration"],
       [/suivi des b[ée]n[ée]fices/i, "4. Suivi des bénéfices"],
       [/plan de revue/i, "5. Plan de revue"]];
  const absentes = SECTIONS.filter(([re]) => !re.test(texte)).map(([, n]) => n);
  absentes.length
    ? ko("LC1", `section(s) absente(s) : ${absentes.join(" · ")}`)
    : ok("LC1", `les ${SECTIONS.length} sections du gabarit ${estDiagnostic ? "diagnostic" : "ROI"} sont présentes`);

  // LC2 — chiffres sourcés (€ et %)
  const nues = texte.split("\n").filter((l) =>
    /(?:€|\d\s*%)/.test(l) && !/\[src:/.test(l) && !/[àa] v[ée]rifier/i.test(l));
  nues.length
    ? ko("LC2", `${nues.length} ligne(s) portant € ou % sans [src: …] ni « à vérifier » — un chiffre sans source ne vaut rien`)
    : ok("LC2", "tout montant et pourcentage est sourcé ou marqué « à vérifier »");

  // LC3 — recommandations ancrées aux mesures (diagnostic seulement)
  if (estDiagnostic) {
    const idsMesures = new Set(lignesTableau(section(texte, /mesures ex[ée]cut[ée]es/i))
      .map((l) => (l.split("|").map((c) => c.trim())[1] || "")).filter((id) => /^M-\d{2,}$/.test(id)));
    const recos = section(texte, /recommandations/i).split("\n")
      .filter((l) => /^\s*(?:[-*]|\d+[.)])\s+/.test(l));
    const sansMesure = recos.filter((l) => !/\bM-\d{2,}\b/.test(l));
    const citees = [...new Set((section(texte, /recommandations/i).match(/\bM-\d{2,}\b/g) || []))];
    const orphelines = citees.filter((id) => !idsMesures.has(id));
    if (!recos.length) ko("LC3", "aucune recommandation listée — le diagnostic ne recommande rien");
    else if (sansMesure.length) ko("LC3", `${sansMesure.length} recommandation(s) sans mesure M-xx — un avis sans mesure n'entre pas au livrable`);
    else if (orphelines.length) ko("LC3", `mesure(s) citée(s) inexistante(s) au tableau : ${orphelines.join(", ")}`);
    else ok("LC3", `${recos.length} recommandation(s), toutes ancrées à des mesures existantes`);
  }

  // LC4 — lots complets (ROI seulement)
  if (estRoi) {
    const lots = lignesTableau(section(texte, /^## .*lots/im));
    if (!lots.length) ko("LC4", "aucun lot au tableau — une démarche ROI sans lot ne lotit rien");
    else {
      const incomplets = lots.filter((l) => {
        const c = l.split("|").map((x) => x.trim());
        return (c[2] || "").length < 3 || (c[3] || "").length < 3 || (c[4] || "").length < 3
          || !/20\d{2}-\d{2}-\d{2}/.test(c[5] || "");
      });
      incomplets.length
        ? ko("LC4", `${incomplets.length} lot(s) sans les trois critères (utile, utilisable, utilisé) ou sans jalon daté — ce n'est pas un lot, c'est un chapitre`)
        : ok("LC4", `${lots.length} lot(s), chacun utile + utilisable + utilisé + jalonné`);
    }
  }

  // LC5 — plan de revue daté
  /plan de revue[\s\S]{0,300}?20\d{2}-\d{2}-\d{2}/i.test(texte)
    ? ok("LC5", "plan de revue daté")
    : ko("LC5", "plan de revue absent ou non daté — un conseil sans rendez-vous avec les faits ne se corrige jamais");

  return findings;
}

function verdictDe(findings) {
  return findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
}

const NON_JUGE = [
  "la justesse des mesures et la pertinence des recommandations — l'oracle tient la FORME opposable, pas le fond",
  "la lecture seule sur le SI étudié — discipline du run, hors de portée d'un contrôle du livrable",
  "le chiffrage commercial (TJM, montants de propale) — délégué à digit-ai-propale, jamais jugé ici",
];

const arg = process.argv[2];
if (arg === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "conseil-"));
  const diagVert = `# Diagnostic d'exploitation — test — 20260819a
## 1. Symptôme et périmètre
Temps de réponse rapportés > 3 s sur la recherche depuis juillet. Périmètre : prod, API.
## 2. Mesures exécutées
| id | mesure | valeur | source (commande/requête + date) |
|---|---|---|---|
| M-01 | p95 du endpoint /search | 3,4 s | requête APM archivée, 2026-08-19 |
| M-02 | requêtes SQL sans index | 12 | EXPLAIN rejoué, 2026-08-19 |
## 3. Causes candidates
Scan complet de table soutenu par M-02, cohérent avec M-01.
## 4. Recommandations
- Indexer les 12 requêtes relevées (M-02), effort 2 j — gain attendu 40 % [src: M-01 rejouée sur staging].
## 5. Plan de revue
Mesures rejouées le 2026-09-19.
`;
  const diagRouge = `# Diagnostic d'exploitation — test — 20260819a
## 1. Symptôme et périmètre
Le système est lent, coût estimé 50 000 € par an.
## 4. Recommandations
- Migrer vers une architecture plus performante.
## 5. Plan de revue
À planifier plus tard.
`;
  const roiVert = `# Démarche ROI — test — 20260819a
## 1. Hypothèses et sources
Coût actuel 120 000 € par an [src: facture hébergeur 2026-07]. Gain visé : à vérifier.
## 2. Lots
| lot | utile (besoin couvert) | utilisable (critère binaire de mise en service) | utilisé (mesure d'adoption, datée) | jalon (AAAA-MM-JJ) |
|---|---|---|---|---|
| L-01 | recherche rapide | p95 < 1 s en prod | 100 requêtes/j relevées au 2026-11-01 | 2026-10-15 |
## 3. Trajectoire de construction et migration
L-01 d'abord, migration de la base ensuite, rollback par bascule DNS.
## 4. Suivi des bénéfices
p95 relevé mensuellement, source APM archivée.
## 5. Plan de revue
Première revue des bénéfices le 2026-11-15 ; lot suspendu si p95 > 1 s.
`;
  const roiRouge = `# Démarche ROI — test — 20260819a
## 2. Lots
| lot | utile (besoin couvert) | utilisable (critère binaire de mise en service) | utilisé (mesure d'adoption, datée) | jalon (AAAA-MM-JJ) |
|---|---|---|---|---|
| L-01 | recherche rapide | | | bientôt |
Gain estimé 30 % dès le premier trimestre.
## 5. Plan de revue
Revue à caler.
`;
  const cas = [
    ["diag-vert.md", diagVert, 0, null],
    ["diag-rouge.md", diagRouge, 1, ["LC1", "LC2", "LC3", "LC5"]],
    ["roi-vert.md", roiVert, 0, null],
    ["roi-rouge.md", roiRouge, 1, ["LC1", "LC2", "LC4", "LC5"]],
  ];
  const moi = fileURLToPath(import.meta.url);
  const casse = [];
  for (const [nom, contenu, attendu, regles] of cas) {
    writeFileSync(join(dir, nom), contenu, "utf8");
    const r = spawnSync(process.execPath, [moi, join(dir, nom)], { encoding: "utf8" });
    if (r.status !== attendu) { casse.push(`${nom} : exit ${r.status}, attendu ${attendu}`); continue; }
    if (regles) {
      const enEchec = new Set([...r.stdout.matchAll(/"regle": "(LC\d)",\s*"statut": "FAIL"/g)].map((m) => m[1]));
      const muettes = regles.filter((x) => !enEchec.has(x));
      if (muettes.length) casse.push(`${nom} : règle(s) jamais déclenchée(s) : ${muettes.join(", ")}`);
    }
  }
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test livrable conseil : 4/4 PASS (diag vert/rouge, roi vert/rouge — LC1-LC5 double sens)");
  process.exit(casse.length ? 1 : 0);
}

if (!arg || !existsSync(arg)) {
  console.log(JSON.stringify({ oracle: "oracle-livrable-conseil", verdict: "ERREUR", message: "livrable introuvable — usage : node oracle-livrable-conseil.mjs <livrable.md> | --self-test" }));
  process.exit(2);
}
const texte = readFileSync(arg, "utf8").split("\r\n").join("\n");
const findings = juger(texte);
if (findings === null) {
  console.log(JSON.stringify({ oracle: "oracle-livrable-conseil", verdict: "ERREUR", message: "type non détecté — le titre doit commencer par « Diagnostic d'exploitation » ou « Démarche ROI »" }));
  process.exit(2);
}
const verdict = verdictDe(findings);
console.log(JSON.stringify({ oracle: "oracle-livrable-conseil", version: "1.0.0", cible: arg, verdict, findings, non_juge: NON_JUGE }, null, 1));
process.exit(verdict === "PASS" ? 0 : 1);
