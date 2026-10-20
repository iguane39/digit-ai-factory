#!/usr/bin/env node
/**
 * verifications-lundi.test.mjs — le jugement des relevés du lundi, dans les deux sens (D-42 (a), 19/10/2026).
 *   VERT  : aucune dérive, revue récente, aucune revue datée due → pas d'alerte ; une revue due sans proposition
 *           prête n'alerte pas ; le stock sans classe se dit sans alerter ;
 *   ROUGE : une dérive de récidives, un relevé illisible, une revue hebdomadaire due avec une proposition prête,
 *           une revue datée due → alerte, chacune nommée dans les motifs.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { juger, derniereRevue } from "./verifications-lundi.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };
const assert = (c, m) => { if (!c) throw new Error(m); };

const opt = (l) => ({ libelle: l, effet: "e", cout: "nul", retour: "Possible" });
const fiche = { question: "q ?", de_quoi: "x", probleme: "x", pourquoi_vous: "x", options: { a: opt("A"), b: opt("B"), c: opt("C") },
  recommandation: "a", source: "s", ressort: { humain: true, motif: "depense" } };
const ligne = (o) => JSON.stringify({ ev: "creation", ...o });
const registre = (...l) => l.join("\n");
const JOUR = "2026-10-26";
const VERT = { verdict: "PASS", snapshot_seq: 11 };

check("vert : rien à signaler", () => {
  const r = juger({ recidives: VERT, texteRegistre: registre(ligne({ id: "TF-1", titre: "a", classe: "c" })), revueTs: "2026-10-24T08:00:00Z", jour: JOUR });
  assert(!r.alerte, `alerte inattendue : ${r.motifs}`);
});
check("vert : revue due sans proposition prête, pas d'alerte", () => {
  const r = juger({ recidives: VERT, texteRegistre: registre(ligne({ id: "TF-1", titre: "a", classe: "c" })), revueTs: "2026-10-01T08:00:00Z", jour: JOUR });
  assert(!r.alerte, `alerte inattendue : ${r.motifs}`);
  assert(r.lignes.some((l) => l.includes("rien à trancher")), "la ligne « rien à trancher » manque");
});
check("vert : le stock sans classe se dit sans alerter", () => {
  const r = juger({ recidives: VERT, texteRegistre: registre(ligne({ id: "TF-9", titre: "sans classe" })), revueTs: "2026-10-24T08:00:00Z", jour: JOUR });
  assert(!r.alerte, "le stock a alerté");
  assert(r.lignes.some((l) => l.includes("TF-9")), "TF-9 absent de la ligne de stock");
});
check("rouge : une dérive de récidives alerte et se nomme", () => {
  const r = juger({ recidives: { verdict: "DERIVE", derive: { findings: ["haute · classe-x · R1 · +3"] } }, texteRegistre: "", revueTs: "2026-10-24T08:00:00Z", jour: JOUR });
  assert(r.alerte && r.motifs[0].includes("DERIVE"), `motifs : ${r.motifs}`);
  assert(r.lignes.some((l) => l.includes("classe-x")), "le constat de dérive n'est pas rendu");
});
check("rouge : un relevé illisible alerte", () => {
  const r = juger({ recidives: null, texteRegistre: "", revueTs: "2026-10-24T08:00:00Z", jour: JOUR });
  assert(r.alerte && r.motifs.includes("récidives non jouées"), `motifs : ${r.motifs}`);
});
check("rouge : forge d'observabilité absente (SANS_OBJET) alerte", () => {
  const r = juger({ recidives: { verdict: "SANS_OBJET", message: "forge-observability introuvable" }, texteRegistre: "", revueTs: "2026-10-24T08:00:00Z", jour: JOUR });
  assert(r.alerte, "SANS_OBJET n'a pas alerté");
});
check("rouge : revue hebdomadaire due avec une proposition prête", () => {
  const r = juger({ recidives: VERT, texteRegistre: registre(ligne({ id: "TF-2", titre: "b", classe: "c", fiche_decision: fiche })), revueTs: "2026-10-01T08:00:00Z", jour: JOUR });
  assert(r.alerte && r.motifs.some((m) => m.startsWith("revue hebdomadaire due")), `motifs : ${r.motifs}`);
});
check("rouge : revue datée due", () => {
  const r = juger({ recidives: VERT, texteRegistre: registre(ligne({ id: "TF-3", titre: "c", classe: "c", revue_le: "2026-10-20", revue_commande: "node x.mjs" })), revueTs: "2026-10-24T08:00:00Z", jour: JOUR });
  assert(r.alerte && r.motifs.some((m) => m.includes("datée")), `motifs : ${r.motifs}`);
  assert(r.lignes.some((l) => l.includes("node x.mjs")), "la commande de mesure manque");
});
check("bornes : journal vide → revue jamais jouée ; dernière ligne lue", () => {
  assert(derniereRevue("") === null, "journal vide");
  assert(derniereRevue('{"ts":"a"}\n{"ts":"b"}\n') === "b", "dernière ligne");
});

console.log(fail ? `verifications-lundi : ${pass} PASS, ${fail} FAIL` : `verifications-lundi : ${pass} PASS, 0 FAIL — 3 cas verts, 5 cas rouges, 1 borne`);
process.exit(fail ? 1 : 0);
