#!/usr/bin/env node
/**
 * generer-recidives.test.mjs — le tableau de bord des récidives est DÉTERMINISTE, compte ce qui
 * est marqué, et DIT ce qu'il ne peut pas mesurer. Joué par `oracles\self-tests.mjs` (I2).
 * Sens vert : une récidive marquée apparaît sur sa ligne avec son produit ; deux générations
 * rendent le même octet. Sens rouge (du silence) : sans relevé d'héritage, la section 3 dit
 * « non mesurable encore » — jamais 0/0 ni une ligne vide.
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "generer-recidives.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const T = mkdtempSync(join(tmpdir(), "recidives-"));
const w = (n, c) => { const p = join(T, n); writeFileSync(p, c, "utf8"); return p; };
const classes = w("CLASSES.json", JSON.stringify({ version: "0.0.1", familles: [{ cle: "page-html-socle", libelle: "f" }], classes: [
  { cle: "page-html-polices-distantes", famille: "page-html-socle", libelle: "l", creee_le: "2026-09-03", fondee_par: ["TF-0001"], regle: "BEST-PRACTICES-HTML.md A1", oracle: "check_html A1", voisines: [] },
  { cle: "restitution-x", famille: "page-html-socle", libelle: "l", creee_le: "2026-09-03", fondee_par: ["TF-0001"], regle: "gabarits/RESTITUTION.md S34", oracle: "oracle-synthese", voisines: [] },
  { cle: "sans-fondateur", famille: "page-html-socle", libelle: "l", creee_le: "2026-08-30", fondee_par: [], regle: "-", oracle: "-", voisines: [] },
] }));
const heritage = w("HERITAGE.json", JSON.stringify({ artefacts: [{ source: "gabarits/RESTITUTION.md", cible: "forge/RESTITUTION.md", mode: "copie_conforme", familles_protegees: ["restitution-forme"] }] }));
const registre = w("TODO.jsonl", [
  JSON.stringify({ ev: "creation", ts: "2026-08-20T10:00:00.000Z", id: "TF-0001", titre: "t", contenu: "c", demandeur: "pilot", source: "s", date_demande: "2026-08-20", statut: "candidat", forges_cibles_initiales: ["digit-ai-factory"] }),
  JSON.stringify({ ev: "maj", ts: "2026-08-27T10:00:00.000Z", id: "TF-0001", statut: "corrige", date_correction: "2026-08-27", gains_constates: "g", corrections_realisees: "x" }),
  JSON.stringify({ ev: "creation", ts: "2026-09-03T10:00:00.000Z", id: "TF-0002", titre: "t", contenu: "c", demandeur: "produit-12", source: "lot", date_demande: "2026-09-03", statut: "candidat", forges_cibles_initiales: ["digit-ai-factory"], classe: "page-html-polices-distantes", recidive_de: ["TF-0001"] }),
  JSON.stringify({ ev: "creation", ts: "2026-09-03T10:00:01.000Z", id: "TF-0003", titre: "t", contenu: "c", demandeur: "produit-05", source: "lot", date_demande: "2026-09-03", statut: "candidat", forges_cibles_initiales: ["digit-ai-factory"], classe: "page-html-polices-distantes", recidive_de: null }),
].join("\n") + "\n");
const vide = w("vide.jsonl", "");
const generer = (releves, sortie) => spawnSync(process.execPath, [OUTIL, "--registre", registre, "--archive", vide, "--classes", classes, "--heritage", heritage, "--releves", releves, "--sortie", sortie], { encoding: "utf8" });

check("verte — la récidive marquée apparaît sur sa classe, avec son produit et son compte", () => {
  const out = join(T, "R1.md"); const r = generer(join(T, "aucun-releve.jsonl"), out);
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stderr}`);
  const md = readFileSync(out, "utf8");
  if (!/`page-html-polices-distantes` \| page-html-socle \| 2 \| 1 \| 1 \| 1\/2 \(sous 3 items/.test(md)) throw new Error("ligne de classe inattendue :\n" + md.split("\n").find((l) => l.includes("polices")));
  if (!/Produit-12 ×1/.test(md)) throw new Error("le produit récidiviste n'est pas nommé");
});
check("silence dit — sans relevé d'héritage, la section 3 dit « non mesurable encore » et la section 2 aussi pour la classe portée par un artefact", () => {
  const md = readFileSync(join(T, "R1.md"), "utf8");
  if (!/Non mesurable encore : aucun relevé d'héritage/.test(md)) throw new Error("section 3 muette");
  if (!/`restitution-x` \| 2026-08-27 \| forge\/RESTITUTION\.md \| non mesurable encore/.test(md)) throw new Error("section 2 : le délai non mesurable n'est pas dit");
  if (!/`page-html-polices-distantes` \| 2026-08-27 \| — \| non mesurable : la règle ne vit dans aucun artefact/.test(md)) throw new Error("section 2 : règle sans artefact non déclarée");
});
check("verte — avec un relevé postérieur où l'artefact est conforme chez un produit, le délai se mesure en jours", () => {
  const releves = w("RELEVES.jsonl", JSON.stringify({ ts: "2026-09-03T08:00:00.000Z", contrat: "1.8.0", produits: [
    { produit: "Produit-12", artefacts: [{ cible: "forge/RESTITUTION.md", etat: "conforme" }] },
    { produit: "Produit-05", artefacts: [{ cible: "forge/RESTITUTION.md", etat: "absent" }] },
  ] }) + "\n");
  const out = join(T, "R2.md"); const r = generer(releves, out);
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stderr}`);
  const md = readFileSync(out, "utf8");
  if (!/`restitution-x` \| 2026-08-27 \| forge\/RESTITUTION\.md \| 1 produit\(s\) atteint\(s\) en 7–7 j ; 1 non atteint\(s\) \(Produit-05\)/.test(md)) throw new Error("délai non mesuré :\n" + md.split("\n").find((l) => l.includes("restitution-x")));
  if (!/forge\/RESTITUTION\.md \| copie_conforme \| 1\/2 \| restitution-forme/.test(md)) throw new Error("taux d'héritage absent");
});
check("contre-métrique — la classe sans fondateur est nommée, et les semaines de création comptées", () => {
  const md = readFileSync(join(T, "R2.md"), "utf8");
  if (!/Classes sans clôture fondatrice : `sans-fondateur`/.test(md)) throw new Error("classe sans fondateur non nommée");
  if (!/\| 2026-S36 \| 2 \|/.test(md) || !/\| 2026-S35 \| 1 \|/.test(md)) throw new Error("semaines de création non comptées");
});
check("déterminisme — deux générations sur les mêmes sources rendent le même octet", () => {
  const a = join(T, "D1.md"), b = join(T, "D2.md");
  generer(join(T, "RELEVES.jsonl"), a); generer(join(T, "RELEVES.jsonl"), b);
  if (readFileSync(a, "utf8") !== readFileSync(b, "utf8")) throw new Error("les deux générations diffèrent");
});
rmSync(T, { recursive: true, force: true });
console.log(`\ngenerer-recidives : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
