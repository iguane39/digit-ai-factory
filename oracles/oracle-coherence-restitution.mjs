#!/usr/bin/env node
/**
 * oracle-coherence-restitution.mjs — LES TROIS PORTEURS DE LA VERSION DE RESTITUTION.MD
 * S'ACCORDENT, OU LE DISENT (TF-1375, campagne D-37 (a) du 01/10/2026).
 *
 * LE FAIT (01/10/2026). `gabarits\RESTITUTION.md` porte sa version en tête (`**version X.Y.Z**`).
 * Deux porteurs la RÉPÈTENT en prose, chacun pour un usage différent : l'étiquette `(vX.Y.Z)` du
 * rappel qu'`oracles\hook-restitution.mjs` sert quand il refuse une restitution hors forme, et la
 * première version citée par la ligne des gates actifs qu'`oracles\hook-ouverture.mjs` imprime à
 * CHAQUE ouverture de session. Rien ne confrontait les trois : mesuré le 01/10/2026, le gabarit
 * était passé de 2.28.0 à 2.32.0 (cinq versions, TF-1427 à TF-1503) sans qu'aucun des deux
 * porteurs suive — l'étiquette du rappel annonçait encore « v2.28.0 », la ligne des gates
 * s'arrêtait au même endroit — et l'écart n'a été vu qu'à la lecture humaine (TF-1531, corrigé
 * dans la même campagne que cet oracle). *Un rappel qui cite une version périmée laisse l'agent
 * agir sur une forme qui n'est plus celle que le juge bloquant mesure réellement.*
 *
 * CE QUE CET ORACLE JUGE, ET CE QU'IL NE JUGE PAS :
 *   RC1 · les TROIS versions extraites — gabarit, étiquette du rappel de hook-restitution.mjs,
 *         première version citée par la ligne des gates de hook-ouverture.mjs — sont IDENTIQUES.
 * Il ne juge PAS le CONTENU des trois porteurs : qu'ils décrivent correctement les règles
 * vivantes de leur version est une autre question, qu'aucune extraction de numéro ne peut voir
 * (c'est le defaut que TF-1531 a corrigé à la main, une fois).
 *
 * Usage : node oracles\oracle-coherence-restitution.mjs [--racine <dépôt>] [--json]
 *         node oracles\oracle-coherence-restitution.mjs --self-test → double sens, parc fabriqué
 * Exit : 0 = conforme (les trois s'accordent) · 1 = défaut MESURÉ (un écart) · 2 = porteur absent
 */
import { existsSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

// Les trois motifs d'extraction, un par porteur — chacun tiré de la FORME réelle du fichier
// aujourd'hui, pas d'une forme supposée : un motif trop large lirait la mauvaise version dans un
// fichier qui en cite plusieurs (hook-ouverture et hook-restitution portent tout l'historique).
const RE_GABARIT = /\*\*version (\d+\.\d+\.\d+),/;
const RE_RAPPEL = /RESTITUTION\.md\s*\(v(\d+\.\d+\.\d+)\)/;
// hook-ouverture.mjs cite RESTITUTION.md UNE fois puis égrène tout l'historique des versions
// ensuite : la PREMIÈRE version après la mention du gabarit est la version courante — [\s\S]*?
// non gourmand, pour ne pas sauter par-dessus elle jusqu'à une version plus ancienne citée après.
const RE_GATES = /RESTITUTION\.md[\s\S]*?\bv(\d+\.\d+\.\d+)\s*\(/;

/** Les trois porteurs, relatifs à la racine du dépôt jugé. */
export const PORTEURS = {
  gabarit: { chemin: "gabarits/RESTITUTION.md", regex: RE_GABARIT, nom: "gabarits\\RESTITUTION.md (en-tête)" },
  rappel: { chemin: "oracles/hook-restitution.mjs", regex: RE_RAPPEL, nom: "oracles\\hook-restitution.mjs (étiquette du RAPPEL)" },
  gates: { chemin: "oracles/hook-ouverture.mjs", regex: RE_GATES, nom: "oracles\\hook-ouverture.mjs (ligne des gates)" },
};

/** La version de chaque porteur présent et lisible ; `null` pour un porteur absent ou sans motif. */
export function versionsPorteurs(racine) {
  const out = {};
  for (const [cle, p] of Object.entries(PORTEURS)) {
    const f = join(racine, ...p.chemin.split("/"));
    if (!existsSync(f)) { out[cle] = null; continue; }
    const m = p.regex.exec(readFileSync(f, "utf8"));
    out[cle] = m ? m[1] : null;
  }
  return out;
}

const resumeVersions = (v) => Object.entries(v).map(([c, x]) => `${PORTEURS[c].nom} = ${x ?? "illisible"}`).join(" · ");

export function juger(racine) {
  const findings = [];
  const v = versionsPorteurs(racine);
  const absents = Object.entries(v).filter(([, val]) => val === null).map(([c]) => PORTEURS[c].nom);
  if (absents.length) {
    findings.push({ regle: "RC1", statut: "SANS_OBJET",
      message: `porteur(s) absent(s) ou version illisible, confrontation impossible : ${absents.join(", ")}` });
    return { verdict: "SANS_OBJET", findings };
  }
  const distinctes = [...new Set(Object.values(v))];
  if (distinctes.length === 1) {
    findings.push({ regle: "RC1", statut: "PASS",
      message: `les trois porteurs citent la même version (${distinctes[0]}) : ${resumeVersions(v)}` });
    return { verdict: "PASS", findings };
  }
  findings.push({ regle: "RC1", statut: "FAIL",
    message: `les trois porteurs divergent : ${resumeVersions(v)} — le gabarit (${v.gabarit}) fait foi, les deux autres se mettent à jour` });
  return { verdict: "FAIL", findings };
}

// ---- self-test (TF-1375) — DOUBLE SENS sur un parc fabriqué, jamais sur le dépôt réel : le but
// est de prouver que la règle SAIT échouer, pas de mesurer l'état du jour (c'est le CLI, plus bas).
function selfTest() {
  const casse = [];
  const poser = (versions) => {
    const d = mkdtempSync(join(tmpdir(), "coherence-restitution-"));
    mkdirSync(join(d, "gabarits"), { recursive: true });
    mkdirSync(join(d, "oracles"), { recursive: true });
    if (versions.gabarit !== undefined)
      writeFileSync(join(d, "gabarits", "RESTITUTION.md"),
        `Référentiel versionné — **version ${versions.gabarit}, 01/10/2026** : du texte.\n`, "utf8");
    if (versions.rappel !== undefined)
      writeFileSync(join(d, "oracles", "hook-restitution.mjs"),
        `const RAPPEL = "Réécris ta réponse finale au format gabarits\\\\RESTITUTION.md (v${versions.rappel}) : du texte.";\n`, "utf8");
    if (versions.gates !== undefined)
      writeFileSync(join(d, "oracles", "hook-ouverture.mjs"),
        `"… suit gabarits\\\\RESTITUTION.md — bloc 0 + 8 blocs. v${versions.gates} (01/10) : du texte. v1.0.0 (ancien) : du vieux texte.";\n`, "utf8");
    return d;
  };

  // VERT : les trois s'accordent.
  const vert = poser({ gabarit: "2.33.0", rappel: "2.33.0", gates: "2.33.0" });
  const rVert = juger(vert);
  if (rVert.verdict !== "PASS") casse.push(`vert : attendu PASS, obtenu ${rVert.verdict} — ${rVert.findings[0]?.message}`);
  rmSync(vert, { recursive: true, force: true, maxRetries: 5 });

  // ROUGE, le défaut d'origine : le rappel ET les gates restent en arrière du gabarit.
  const rouge = poser({ gabarit: "2.33.0", rappel: "2.28.0", gates: "2.28.0" });
  const rRouge = juger(rouge);
  if (rRouge.verdict !== "FAIL") casse.push(`rouge : attendu FAIL, obtenu ${rRouge.verdict}`);
  else if (!/2\.33\.0/.test(rRouge.findings[0].message) || !/2\.28\.0/.test(rRouge.findings[0].message))
    casse.push(`rouge : le constat ne nomme pas les DEUX versions en écart : ${rRouge.findings[0].message}`);
  rmSync(rouge, { recursive: true, force: true, maxRetries: 5 });

  // ROUGE borné : un SEUL porteur en écart (le rappel) suffit à faire échouer — pas de pardon
  // à la majorité.
  const partiel = poser({ gabarit: "2.33.0", rappel: "2.33.0", gates: "2.30.0" });
  const rPartiel = juger(partiel);
  if (rPartiel.verdict !== "FAIL") casse.push(`rouge partiel : un seul porteur en écart (les gates) doit suffire à faire échouer, obtenu ${rPartiel.verdict}`);
  rmSync(partiel, { recursive: true, force: true, maxRetries: 5 });

  // SANS_OBJET : un porteur absent ne se juge pas en silence, et n'est jamais compté PASS.
  const absent = poser({ gabarit: "2.33.0", rappel: "2.33.0" }); // hook-ouverture.mjs non écrit
  const rAbsent = juger(absent);
  if (rAbsent.verdict !== "SANS_OBJET") casse.push(`porteur absent : attendu SANS_OBJET, obtenu ${rAbsent.verdict}`);
  else if (!/hook-ouverture/.test(rAbsent.findings[0].message)) casse.push(`porteur absent : le constat ne nomme pas le porteur manquant : ${rAbsent.findings[0].message}`);
  rmSync(absent, { recursive: true, force: true, maxRetries: 5 });

  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test coherence-restitution : 4/4 PASS (les trois porteurs accordés → PASS ; les deux "
      + "porteurs restés en arrière du gabarit → FAIL nommant les deux versions ; un seul porteur "
      + "en écart → FAIL, pas de pardon à la majorité ; un porteur absent → SANS_OBJET nommé, "
      + "jamais un PASS silencieux)");
  process.exit(casse.length ? 1 : 0);
}

// ---- CLI --------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  if (args[0] === "--self-test") selfTest();
  else {
    const iRacine = args.indexOf("--racine");
    const racine = iRacine >= 0 && args[iRacine + 1] ? args[iRacine + 1] : join(ICI, "..");
    const r = juger(racine);
    if (args.includes("--json")) {
      console.log(JSON.stringify({ oracle: "oracle-coherence-restitution", version: "1.0.0",
        racine, ...r }, null, 1));
    } else {
      console.log(`oracle-coherence-restitution — ${racine}`);
      console.log(`verdict : ${r.verdict}`);
      for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
    }
    process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
  }
}
