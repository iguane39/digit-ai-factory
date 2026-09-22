#!/usr/bin/env node
/**
 * oracle-repere-externe.test.mjs — recette à DOUBLE SENS de son oracle.
 *
 * Cet oracle rend ROUGE sur le parc au jour de sa naissance, et c'est ce qu'on attend de lui : le
 * registre des repères ne publie pas ce qu'il ne couvre pas, si bien que l'absence de repère pour
 * les livrables de communication est indiscernable d'un oubli. Le sens VERT compte donc au moins
 * autant que le rouge — un oracle qui accuserait un registre bien tenu serait désactivé, et son
 * seul constat vrai disparaîtrait avec lui.
 *
 * Joué par `oracles\self-tests.mjs` (I1 via la table partagée, I2 comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { juger, NON_JUGE, CHEMIN_REGISTRE, entreesDuRegistre, reservoirsDe, statutDe } from "./oracle-repere-externe.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "repere-externe-"));
let n = 0;
/** Un parc jetable portant le registre des repères avec le contenu donné. */
const parc = (contenu) => {
  const d = join(T, `p${++n}`);
  const p = join(d, CHEMIN_REGISTRE);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, contenu, "utf8");
  return d;
};
const constat = (r, regle) => r.findings.find((x) => x.regle === regle);

const COUVERTURE = "\n## Couverture — ce que ce registre ne couvre pas\n\nLes livrables de communication n'ont aucun repère, et c'est un choix daté.\n";
const ENTREE_OK = [
  "## Entrées", "",
  "- cible: tableau de bord de résultats de tests",
  "  reference: Allure Report — démo publique",
  "  localisateur: https://demo.allurereport.org/",
  "  test_existence: PASS — HTTP 200 (exécuté le 13/08/2026)",
  "  dernier_test: 2026-08-13 — PASS",
  "  niveaux: structure, jetons, composants, comportement décomposés",
  "  frontiere: fixe le niveau de finition, ne reproduit pas l'identité",
  "  justification: la référence du domaine",
  "  statut: ok", "",
].join("\n");

// -- BR1 : un « ok » porte sa validation ---------------------------------------------------------
check("ROUGE — un repère « ok » sans validation datée est un FAIL", () => {
  const doc = ENTREE_OK.replace("  test_existence: PASS — HTTP 200 (exécuté le 13/08/2026)\n", "")
    .replace("  dernier_test: 2026-08-13 — PASS\n", "") + COUVERTURE;
  const f = constat(juger(parc(doc)), "BR1");
  if (f.statut !== "FAIL") throw new Error(`BR1 ${f.statut} — une barre que personne n'a vérifiée est servie`);
  if (!/tableau de bord/.test(f.message)) throw new Error("le constat ne NOMME pas la cible");
});

check("VERT — le même repère avec son test daté en PASS passe BR1", () => {
  const f = constat(juger(parc(ENTREE_OK + COUVERTURE)), "BR1");
  if (f.statut !== "PASS") throw new Error(`BR1 ${f.statut} : ${f.message}`);
});

check("VERT — une validation HUMAINE datée vaut preuve, comme le registre le prévoit", () => {
  const doc = ENTREE_OK.replace("  test_existence: PASS — HTTP 200 (exécuté le 13/08/2026)\n", "")
    .replace("  dernier_test: 2026-08-13 — PASS", "  statut_note: —")
    .replace("  statut: ok", "  statut: ok (validée humain, 11/08/2026 — pré-vol)") + COUVERTURE;
  const f = constat(juger(parc(doc)), "BR1");
  if (f.statut !== "PASS") throw new Error(`la voie que le registre prévoit est refusée : ${f.message}`);
});

// -- BR2 : un reservoir reste en « todo » --------------------------------------------------------
check("ROUGE — un repère « ok » dont la référence est à renseigner est un FAIL", () => {
  const doc = ENTREE_OK.replace("  reference: Allure Report — démo publique", "  reference: à renseigner — pas 2 non exécuté") + COUVERTURE;
  const f = constat(juger(parc(doc)), "BR2");
  if (f.statut !== "FAIL") throw new Error(`BR2 ${f.statut} — une barre inouvrable est servie au pas 1`);
  if (!/reference/.test(f.message)) throw new Error("le constat ne nomme pas le CHAMP vide");
});

check("VERT — le même réservoir en statut « todo » n'est pas accusé", () => {
  const doc = ENTREE_OK.replace("  reference: Allure Report — démo publique", "  reference: à renseigner")
    .replace("  statut: ok", "  statut: todo") + COUVERTURE;
  if (constat(juger(parc(doc)), "BR2").statut !== "PASS") throw new Error("un « todo » déclaré est accusé");
});

check("VERT — des chevrons CITÉS dans une justification ne sont pas un réservoir (calibration mesurée)", () => {
  const doc = ENTREE_OK.replace("  justification: la référence du domaine",
    "  justification: le niveau visé par « Utilise <URL> pour… »") + COUVERTURE;
  const f = constat(juger(parc(doc)), "BR2");
  if (f.statut !== "PASS") throw new Error("un repère complet est accusé d'être vide à cause d'une citation");
  if (reservoirsDe("  justification: le niveau visé par « Utilise <URL> pour… »").length) {
    throw new Error("le motif mord au milieu d'une phrase");
  }
});

check("un réservoir ouvre la VALEUR d'un champ, et seuls les champs à remplir comptent", () => {
  if (!reservoirsDe("  reference: à renseigner").includes("reference")) throw new Error("un vrai réservoir n'est pas vu");
  if (reservoirsDe("  cible: à renseigner").length) throw new Error("un champ hors liste est compté");
});

// -- BR3 : le registre publie ce qu il ne couvre pas ----------------------------------------------
check("ROUGE — un registre qui ne publie pas sa non-couverture est un FAIL", () => {
  const f = constat(juger(parc(ENTREE_OK)), "BR3");
  if (f.statut !== "FAIL") throw new Error(`BR3 ${f.statut} — une famille sans repère reste indiscernable d'un oubli`);
  if (!/communication/.test(f.message)) throw new Error("le constat ne cite pas le cas fondateur");
});

check("VERT — le même registre avec sa section de couverture passe BR3", () => {
  const f = constat(juger(parc(ENTREE_OK + COUVERTURE)), "BR3");
  if (f.statut !== "PASS") throw new Error(`BR3 ${f.statut} : ${f.message}`);
});

// -- portee et contrat -----------------------------------------------------------------------------
check("le GABARIT d'une entrée n'est pas une entrée", () => {
  const doc = "## Format d'une entrée\n\n- cible: <type de livrable>\n  reference: <artefact>\n  statut: todo | ok\n\n" + ENTREE_OK + COUVERTURE;
  const e = entreesDuRegistre(doc);
  if (e.length !== 1) throw new Error(`${e.length} entrée(s) lues — le mode d'emploi est compté comme une entrée`);
  if (statutDe(e[0]) !== "ok") throw new Error("le statut de l'entrée réelle n'est pas lu");
});

check("SANS OBJET — un parc sans registre est déclaré hors portée, jamais accusé", () => {
  const d = join(T, "vide");
  mkdirSync(d, { recursive: true });
  if (juger(d).verdict !== "SANS_OBJET") throw new Error("un parc sans forge d'outils est accusé");
});

check("SANS OBJET — un registre sans aucune entrée est déclaré, jamais accusé", () => {
  if (juger(parc("# Registre des barres\n\n## Entrées\n")).verdict !== "SANS_OBJET") {
    throw new Error("un registre vide est accusé au lieu d'être écarté");
  }
});

check("le verdict PUBLIE ce qu'il n'a pas jugé, dont ce qu'il ne DÉCIDE pas", () => {
  if (!Array.isArray(NON_JUGE) || NON_JUGE.length < 3) throw new Error("non_juge absent ou squelettique");
  if (!NON_JUGE.some((x) => /M[ÉE]RITE/i.test(x))) throw new Error("la borne principale — quelle famille mérite un repère — n'est pas déclarée");
});

console.log(`\noracle-repere-externe : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
