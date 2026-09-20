#!/usr/bin/env node
/**
 * generer-recidives.test.mjs — le tableau de bord des récidives est DÉTERMINISTE, compte ce qui
 * est marqué, et DIT ce qu'il ne peut pas mesurer. Joué par `oracles\self-tests.mjs` (I2).
 * Sens vert : une récidive marquée apparaît sur sa ligne avec son produit ; deux générations
 * rendent le même octet. Sens rouge (du silence) : sans relevé d'héritage, la section 3 dit
 * « non mesurable encore » — jamais 0/0 ni une ligne vide.
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from "node:fs";
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
// La boîte des lots est TOUJOURS passée : sans `--retours`, l'outil lirait la vraie boîte du pilot et la recette
// dépendrait du jour où on la joue (TF-1163).
const retours = join(T, "retours"); mkdirSync(join(retours, "old"), { recursive: true });
writeFileSync(join(retours, "Produit-12 - RETOURS - 20260901a.md"), "x", "utf8");
writeFileSync(join(retours, "old", "Produit-12 - RETOURS - 20260825a.md"), "x", "utf8");
writeFileSync(join(retours, "README.md"), "x", "utf8");
const generer = (releves, sortie, { reg = registre, ret = retours, json = null } = {}) => spawnSync(process.execPath, [OUTIL, "--registre", reg, "--archive", vide, "--classes", classes, "--heritage", heritage, "--releves", releves, "--retours", ret, "--sortie", sortie, ...(json ? ["--json", json] : [])], { encoding: "utf8" });

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
// ---- sections 5 à 7 (TF-1163, TF-1164, 17/09/2026) — tout se date contre l'état des sources, jamais l'horloge ----
check("sous le seuil — à 7 jours de retard le produit est NOMMÉ en section 5 mais n'est pas proposé à la relance, et rien n'est vieux ni muet", () => {
  const md = readFileSync(join(T, "R2.md"), "utf8");
  if (!/\| Produit-05 \| 0 \| 1 \| 7 \| `restitution-x` \(2026-08-27\) \|/.test(md)) throw new Error("section 5 : ligne du produit en retard inattendue :\n" + md.split("\n").find((l) => l.startsWith("| Produit-05")));
  if (!/\| Produit-12 \| 1 \| 0 \| — \|/.test(md)) throw new Error("section 5 : le produit atteint n'est pas compté");
  if (!/Produits en retard de plus de 7 jours : aucun\./.test(md)) throw new Error("section 5 : un retard de 7 jours ne franchit pas le seuil");
  if (/Relance PROPOSÉE/.test(md)) throw new Error("section 5 : relance proposée sous le seuil");
  if (!/Stock : 2 candidat\(s\) en attente de décision, 0 item\(s\) décidé/.test(md)) throw new Error("section 6 : stock inattendu");
  if (!/Ouverts depuis plus de 7 jours : 0\./.test(md)) throw new Error("section 6 : un item de 0 jour compté vieux");
  if (!/\| Produit-12 \| 2026-09-01 \| 2 \|/.test(md)) throw new Error("section 7 : le dernier lot n'est pas le plus récent des deux dossiers");
  if (!/Sources muettes depuis plus de 7 jours : 0 sur 1\./.test(md)) throw new Error("section 7 : silence de 2 jours compté muet");
});
check("au-dessus du seuil — l'état des sources avance de 9 jours : le produit est proposé à la relance, les items sont vieux, la source est muette, et le JSON le compte", () => {
  const reg2 = w("TODO2.jsonl", readFileSync(registre, "utf8") + JSON.stringify({ ev: "maj", ts: "2026-09-12T10:00:00.000Z", id: "TF-0001", note: "n" }) + "\n");
  const out = join(T, "R3.md"), js = join(T, "R3.json"); const r = generer(join(T, "RELEVES.jsonl"), out, { reg: reg2, json: js });
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stderr}`);
  const md = readFileSync(out, "utf8");
  if (!/\| Produit-05 \| 0 \| 1 \| 16 \|/.test(md)) throw new Error("section 5 : retard non recalculé :\n" + md.split("\n").find((l) => l.startsWith("| Produit-05")));
  if (!/Produits en retard de plus de 7 jours : Produit-05\./.test(md) || !/Relance PROPOSÉE, jamais jouée d'office/.test(md)) throw new Error("section 5 : la relance n'est pas proposée");
  if (!/Ouverts depuis plus de 7 jours : 2 — TF-0002 \(candidat, 9 j\), TF-0003 \(candidat, 9 j\)\./.test(md)) throw new Error("section 6 : items vieux non nommés");
  if (!/\| 2026-S36 \| 2 \| 0 \|/.test(md)) throw new Error("section 6 : débit émises/tranchées absent");
  if (!/Sources muettes depuis plus de 7 jours : 1 sur 1\./.test(md)) throw new Error("section 7 : la source muette n'est pas comptée");
  const c = JSON.parse(readFileSync(js, "utf8"));
  const attendu = { couples_non_atteints: 1, produits_en_retard: 1, stock_candidats: 2, stock_decides_non_clos: 0, items_ouverts_vieux: 2, sources_silencieuses: 1 };
  for (const [k, v] of Object.entries(attendu)) if (c[k] !== v) throw new Error(`compteur ${k} = ${c[k]}, attendu ${v}`);
});
check("silence dit — sans boîte de retours ni relevé, les sections 5 et 7 disent « non mesurable » et leurs compteurs sont null, jamais 0", () => {
  const out = join(T, "R4.md"), js = join(T, "R4.json"); const r = generer(join(T, "aucun-releve.jsonl"), out, { ret: join(T, "boite-absente"), json: js });
  if (r.status !== 0) throw new Error(`exit ${r.status} : ${r.stderr}`);
  const md = readFileSync(out, "utf8");
  if (!/## 5\. Descente par produit[^\n]*\n\nNon mesurable encore/.test(md)) throw new Error("section 5 muette");
  if (!/## 7\. Silence des sources de retours\n\nNon mesurable : la boîte/.test(md)) throw new Error("section 7 muette");
  const c = JSON.parse(readFileSync(js, "utf8"));
  if (c.couples_non_atteints !== null || c.sources_silencieuses !== null) throw new Error(`compteurs non mesurables rendus ${c.couples_non_atteints} / ${c.sources_silencieuses}`);
});
check("tranchée — un item sorti de candidat compte dans la semaine de sa décision, et passe au stock des décidés non clos", () => {
  const reg3 = w("TODO3.jsonl", readFileSync(registre, "utf8") + JSON.stringify({ ev: "maj", ts: "2026-09-04T10:00:00.000Z", id: "TF-0002", statut: "decide", decideur: "humain", date_decision: "2026-09-04" }) + "\n");
  const out = join(T, "R5.md"); generer(join(T, "RELEVES.jsonl"), out, { reg: reg3 });
  const md = readFileSync(out, "utf8");
  if (!/\| 2026-S36 \| 2 \| 1 \|/.test(md)) throw new Error("débit : la décision n'est pas comptée tranchée");
  if (!/Stock : 1 candidat\(s\) en attente de décision, 1 item\(s\) décidé/.test(md)) throw new Error("stock : le décidé non clos n'est pas compté");
});
rmSync(T, { recursive: true, force: true });
console.log(`\ngenerer-recidives : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
