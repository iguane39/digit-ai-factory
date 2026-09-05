#!/usr/bin/env node
/**
 * ingerer-emetteur-forge.test.mjs — TF-0807 (05/09/2026) : UN LOT REMIS PAR UNE FORGE GARDE LE NOM
 * DE LA FORGE ; un lot remis par un produit est pseudonymisé. Double sens sur dépôts jetables.
 *
 * LE FAIT PAYÉ : le 05/09, quatre forges ont remis leur compte rendu au pilot (gabarit RETOURS-FORGES,
 * « les forges aussi peuvent déposer un lot… préfixé du nom de la forge émettrice »). L'ingestion a
 * dérivé le produit du préfixe, l'a inscrit à la table des pseudonymes (« Produit-60 », « -61 »,
 * « -62 »), a substitué le nom de la forge dans les candidatures et a joué R-47 sur une cible qui
 * n'en est pas une. Le registre disait « demandeur : Produit-60 » pour un constat de la forge de
 * développement — une forge est PUBLIQUE, son nom ne se cache pas.
 *
 *   VERTE  : lot « digit-ai-forge-essai - RETOURS - … » → demandeur conservé, table SANS entrée
 *            neuve, message [ÉMETTEUR FORGE], R-47 déclaré sans objet ;
 *   ROUGE  : lot « ProduitEssai - RETOURS - … » → demandeur pseudonymisé « Produit-01 », table
 *            enrichie (le comportement voulu pour un produit ne bouge pas).
 *
 * Exit : 0 = les deux sens tenus · 1 = au moins un sens perdu.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "ingerer-lot.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const att = (ok, msg) => { if (!ok) throw new Error(msg); };

const T = mkdtempSync(join(tmpdir(), "emetteur-forge-"));
const LOT_CONFORME = "# lot\n\n## Remarques restées au produit\n\n"
  + "Aucune remarque n'est restée au produit — vérifié le 2026-09-05.\n\n"
  + "## Retours sur les documents produits\n\nAucun document produit depuis un gabarit.\n";

/** Un parc jetable : tables vides, registre vide, classes copiées du pilot. */
const parc = () => {
  const r = mkdtempSync(join(T, "parc-"));
  writeFileSync(join(r, "_noms-interdits.json"), JSON.stringify({ noms: [], identifiants: [], sigles: [], pseudonymes: {} }), "utf8");
  writeFileSync(join(r, "_produits-pseudonymes.json"), JSON.stringify({ produits: {} }), "utf8");
  const registre = join(r, "TODO.jsonl");
  writeFileSync(registre, "", "utf8");
  return { r, registre };
};

let serie = 0;
const ingerer = (emetteur, { r, registre }) => {
  const d = mkdtempSync(join(T, "lot-"));
  const base = `${emetteur} - RETOURS - 2026090${++serie}a`;
  writeFileSync(join(d, `${base}.md`), LOT_CONFORME, "utf8");
  // Deux lignes : R-47 ne se joue que sur un lot d'au moins deux candidatures.
  const ligne = (t) => JSON.stringify({ schema: 1, titre: `pilot : ${t}`, contenu: `constat ${t} remonté par ${emetteur}`, demandeur: emetteur,
    source: `lot ${base}`, date_demande: "2026-09-05", forges_cibles_initiales: ["digit-ai-factory"], preuve_du_cout: "mesuré sur pièce", classe: "emplacement-livrable-hors-convention" });
  writeFileSync(join(d, `${base}.tf.jsonl`), ligne("un") + "\n" + ligne("deux") + "\n", "utf8");
  const res = spawnSync(process.execPath, [OUTIL, join(d, `${base}.tf.jsonl`), "--registre", registre, "--sans-fetch"], {
    encoding: "utf8", env: { ...process.env, FORGE_ROOT: r, FORGE_PRODUITS_PSEUDO: join(r, "_produits-pseudonymes.json"), FORGE_NOMS_INTERDITS: join(r, "_noms-interdits.json") },
  });
  const table = JSON.parse(readFileSync(join(r, "_produits-pseudonymes.json"), "utf8"));
  const lignes = readFileSync(registre, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  return { sortie: (res.stdout || "") + (res.stderr || ""), status: res.status, table, lignes };
};

try {
  check("VERTE — un lot remis par une FORGE garde son nom : pas d'entrée à la table, demandeur conservé, R-47 sans objet", () => {
    const p = parc();
    const { sortie, status, table, lignes } = ingerer("digit-ai-forge-essai", p);
    att(status === 0, `ingestion refusée (exit ${status}) : ${sortie.slice(0, 400)}`);
    att(Object.keys(table.produits).length === 0, `la forge a été inscrite à la table : ${JSON.stringify(table.produits)}`);
    const creations = lignes.filter((l) => l.ev === "creation");
    att(creations.length === 2, `2 créations attendues, ${creations.length}`);
    att(creations.every((c) => c.demandeur === "digit-ai-forge-essai"), `demandeur réécrit : ${creations.map((c) => c.demandeur).join(", ")}`);
    att(/ÉMETTEUR FORGE/.test(sortie), "la sortie ne dit pas que l'émetteur est une forge");
    att(/SANS OBJET \(TF-0807\)/.test(sortie), "R-47 n'est pas déclaré sans objet pour un lot de forge");
    att(!/dossier introuvable/.test(sortie), "R-47 a encore cherché un produit pour une forge");
  });

  check("ROUGE — un lot remis par un PRODUIT est toujours pseudonymisé : entrée à la table, demandeur substitué", () => {
    const p = parc();
    const { sortie, status, table, lignes } = ingerer("ProduitEssai", p);
    att(status === 0, `ingestion refusée (exit ${status}) : ${sortie.slice(0, 400)}`);
    att(table.produits["ProduitEssai"] === "Produit-01", `le produit n'a pas été inscrit : ${JSON.stringify(table.produits)}`);
    const creations = lignes.filter((l) => l.ev === "creation");
    att(creations.every((c) => c.demandeur === "Produit-01"), `demandeur non pseudonymisé : ${creations.map((c) => c.demandeur).join(", ")}`);
    att(/ANONYMISÉ\] produit du lot → Produit-01/.test(sortie), "la sortie n'annonce plus la pseudonymisation d'un produit");
  });
} finally {
  rmSync(T, { recursive: true, force: true });
}
console.log(`\ningerer-emetteur-forge (TF-0807) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
