#!/usr/bin/env node
/**
 * normaliser-lot.test.mjs — recette du convertisseur de sidecars (TF-0196, forme hybride 01/09).
 *
 * Le défaut mesuré le 01/09/2026 : `schema: 1` valait passe-droit — « déjà conforme » supposé,
 * jamais vérifié. Un lot réel à schema:1 mais sans `source` ni cible (des champs
 * `origine`/`destinataire` à la place) traversait le normalisateur avec un [OK], puis se
 * faisait rejeter par l'ingesteur strict : la conversion que TF-0196 devait outiller se
 * refaisait à la main, derrière un vert.
 *
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));

// ISOLATION DES TABLES D'ANONYMISATION (02/09/2026) : une recette qui joue l'ingesteur sans les
// isoler INSCRIT ses noms de fixture dans la table REELLE des pseudonymes du parc (« PROD » et
// 24 chemins Temp… y sont entrés ainsi). Tables jetables, donc, comme pour tout ce qui écrit.
{
  const _d = mkdtempSync(join(tmpdir(), "tables-anon-"));
  writeFileSync(join(_d, "_noms-interdits.json"), JSON.stringify({ noms: ["Zorglub"], identifiants: [], sigles: [], pseudonymes: { Zorglub: "Client-A" } }), "utf8");
  writeFileSync(join(_d, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
  process.env.FORGE_NOMS_INTERDITS = join(_d, "_noms-interdits.json");
  process.env.FORGE_PRODUITS_PSEUDO = join(_d, "_produits-pseudonymes.json");
}
const OUTIL = join(ICI, "normaliser-lot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "normaliser-"));
let serie = 0;
const jouer = (lignes) => {
  const src = join(T, `Produit - RETOURS - 2026090${++serie}a.tf.jsonl`);
  writeFileSync(src, lignes.map((l) => JSON.stringify(l)).join("\n") + "\n", "utf8");
  const r = spawnSync(process.execPath, [OUTIL, src], { encoding: "utf8" });
  const dest = src.replace(/\.tf\.jsonl$/, ".normalise.tf.jsonl");
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || ""),
    lignes: existsSync(dest) ? readFileSync(dest, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l)) : null };
};

const BASE = { schema: 1, titre: "un retour de recette", contenu: "le fait",
  demandeur: "produit-recette", date_demande: "2026-09-01" };

try {
  check("hybride — schema:1 sans source ni cible, destinataire connu : COMPLÉTÉ, pas passé tel quel", () => {
    const r = jouer([{ ...BASE, origine: "MonProduit", destinataire: "digit-ai-page-html" }]);
    att(r.code === 0, `exit ${r.code} : ${r.sortie.slice(0, 200)}`);
    const [l] = r.lignes;
    att(l.source && /dérivé par normaliser-lot/.test(l.source), "la source dérivée ne dit pas qu'elle l'est");
    att(/MonProduit/.test(l.source), "l'origine déclarée n'entre pas dans la source dérivée");
    att(Array.isArray(l.forges_cibles_initiales) && l.forges_cibles_initiales[0] === "digit-ai-forge-agents",
      `cible ${JSON.stringify(l.forges_cibles_initiales)} — le socle page-html est porté par forge-agents`);
  });

  check("hybride — destinataire « factory » et « pilot » vont au dépôt du pilot", () => {
    const r = jouer([{ ...BASE, destinataire: "digit-ai-factory" }, { ...BASE, destinataire: "pilot" }]);
    att(r.code === 0, `exit ${r.code}`);
    att(r.lignes.every((l) => l.forges_cibles_initiales[0] === "digit-ai-factory"), "le pilot n'est pas résolu");
  });

  check("conforme — schema:1 COMPLET passe inchangé : on ne retouche pas ce qui est conforme", () => {
    const complet = { ...BASE, source: "lot d'origine, seq 12", forges_cibles_initiales: ["digit-ai-forge-tests"] };
    const r = jouer([complet]);
    att(r.code === 0, `exit ${r.code}`);
    const [l] = r.lignes;
    att(l.source === complet.source, "une source présente a été réécrite");
    att(l.forges_cibles_initiales[0] === "digit-ai-forge-tests", "une cible présente a été réécrite");
  });

  check("hybride — schema:1 portant « origine »/« date » mais NI demandeur NI date_demande : COMPLÉTÉ", () => {
    const r = jouer([{ schema: 1, titre: "une demande d'étude", contenu: "le brief",
      origine: "MonProduit", date: "2026-08-31", forges_cibles_initiales: ["digit-ai-factory"] }]);
    att(r.code === 0, `exit ${r.code} : ${r.sortie.slice(0, 300)}`);
    const [l] = r.lignes;
    att(l.demandeur === "MonProduit", `demandeur « ${l.demandeur} » — l'origine déclarée ne descend pas`);
    att(l.date_demande === "2026-08-31", `date_demande « ${l.date_demande} » — la date déclarée ne descend pas`);
  });

  check("hybride — « ts » horodaté vaut date_demande, tronqué au jour", () => {
    const r = jouer([{ schema: 1, titre: "une demande", contenu: "le brief", demandeur: "P",
      ts: "2026-08-31T11:41:11.397Z", forges_cibles_initiales: ["digit-ai-factory"] }]);
    att(r.code === 0, `exit ${r.code} : ${r.sortie.slice(0, 300)}`);
    att(r.lignes[0].date_demande === "2026-08-31", `date_demande « ${r.lignes[0].date_demande} »`);
  });

  check("rouge — schema:1 sans demandeur NI origine : REFUS motivé, aucun « produit non nommé » inventé", () => {
    const r = jouer([{ schema: 1, titre: "une demande", contenu: "le brief", date: "2026-08-31",
      forges_cibles_initiales: ["digit-ai-factory"] }]);
    att(r.code === 1, `exit ${r.code} attendu 1 — un demandeur a été inventé`);
    att(/demandeur/.test(r.sortie), "le refus ne nomme pas le champ manquant");
    att(r.lignes === null, "un dérivé a été écrit malgré le refus");
  });

  check("rouge — destinataire INCONNU de la table : REFUS motivé, rien n'est écrit", () => {
    const r = jouer([{ ...BASE, destinataire: "un-service-fantome" }]);
    att(r.code === 1, `exit ${r.code} attendu 1 — une cible a été devinée`);
    att(/inconnu de la table/.test(r.sortie), "le refus ne dit pas sa cause");
    att(r.lignes === null, "un dérivé a été écrit malgré le refus");
  });

  check("forme produit historique — {reference, gravite, preuve, proposition} se convertit toujours", () => {
    const r = jouer([{ reference: "RT-9", gravite: "majeur", titre: "forge-tests : un cas de recette",
      preuve: "mesuré sur pièce", proposition: "une piste", origine: "MonProduit", ts: "2026-09-01T10:00:00Z" }]);
    att(r.code === 0, `exit ${r.code} : ${r.sortie.slice(0, 200)}`);
    const [l] = r.lignes;
    att(l.schema === 1 && /PREUVE : mesuré sur pièce/.test(l.contenu), "la conversion historique s'est défaite");
    att(l.forges_cibles_initiales[0] === "forge-tests", "la cible lue au titre s'est perdue");
  });

  check("rouge historique — un retour sans preuve reste refusé : la garde d'origine tient", () => {
    const r = jouer([{ reference: "RT-1", titre: "forge-tests : sans preuve", proposition: "p" }]);
    att(r.code === 1, `exit ${r.code} attendu 1`);
    att(/aucune preuve/.test(r.sortie), "le motif d'origine a disparu");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

// PAS DE DATE À BARRE OBLIQUE ICI : le cliquet lit le premier ratio « n/m » de cette ligne
// comme le compte de cas — « 01/09 » a été enregistré comme « 1 cas » au premier passage.
console.log(`\nnormaliser-lot (TF-0196, forme hybride du 1er septembre) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
