#!/usr/bin/env node
/**
 * oracle-depense-voie-par-defaut.test.mjs — recette à DOUBLE SENS de son oracle (R-34).
 *
 * Cet oracle rend VERT sur le parc au jour de sa naissance : aucun appel payant n'y a été trouvé.
 * C'est un CLIQUET, et un cliquet dont personne n'a vu le rouge est indiscernable d'un contrôle
 * mort. Les fixtures ci-dessous sont donc la SEULE preuve qu'il sait échouer, et le sens vert
 * compte autant : un oracle qui punirait un appel payant correctement gardé ferait fermer la
 * seule voie que la règle autorise.
 *
 * Joué par `oracles\self-tests.mjs` (I1 via la table partagée, I2 comme tout `*.test.mjs`).
 */
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { juger, NON_JUGE, appelsAuNiveauModule, RE_APPEL_PAYANT } from "./oracle-depense-voie-par-defaut.mjs";

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const T = mkdtempSync(join(tmpdir(), "depense-voie-"));
let n = 0;
/** Un parc jetable portant une forge d'audit et un fichier. */
const parc = (source, { nom = "pan.mjs", depot = "digit-ai-forge-audit" } = {}) => {
  const d = join(T, `p${++n}`);
  mkdirSync(join(d, depot, "oracles"), { recursive: true });
  writeFileSync(join(d, depot, "oracles", nom), source, "utf8");
  return d;
};
const constat = (r, regle) => r.findings.find((x) => x.regle === regle);

const GARDE = 'if (args.includes("--pans")) {\n';
const PUBLIE = "// le rapport publie les jetons consommés et le plafond\n";

// -- DP1 : un appel payant atteignable sans option ----------------------------------------------
check("ROUGE — un appel payant AU NIVEAU MODULE est un FAIL", () => {
  const src = 'import Anthropic from "@anthropic-ai/sdk";\n' + PUBLIE;
  const f = constat(juger(parc(src)), "DP1");
  if (f.statut !== "FAIL") throw new Error(`DP1 ${f.statut} — l'appel part au chargement`);
  if (!/:1/.test(f.message)) throw new Error("le constat ne donne pas la LIGNE");
});

check("ROUGE — un appel payant dans un fichier qui ne lit AUCUNE option est un FAIL", () => {
  const src = PUBLIE + "function pan() {\n  const c = process.env.ANTHROPIC_API_KEY;\n  return c;\n}\n";
  const f = constat(juger(parc(src)), "DP1");
  if (f.statut !== "FAIL") throw new Error(`DP1 ${f.statut} — rien ne garde cet appel`);
  if (!/aucune option/.test(f.message)) throw new Error(`cause inattendue : ${f.message}`);
});

check("VERT — le même appel gardé par une option explicite passe DP1", () => {
  const src = PUBLIE + GARDE + "  const c = process.env.ANTHROPIC_API_KEY;\n}\n";
  const f = constat(juger(parc(src)), "DP1");
  if (f.statut !== "PASS") throw new Error(`DP1 ${f.statut} — l'oracle ferme la seule voie que la règle autorise : ${f.message}`);
});

check("VERT — un dépôt sans aucun appel payant passe DP1", () => {
  const f = constat(juger(parc("export function pan() { return 1; }\n")), "DP1");
  if (f.statut !== "PASS") throw new Error("faux positif sur un fichier qui ne dépense rien");
});

check("VERT — un COMMENTAIRE qui cite une clé d'API n'est pas un appel", () => {
  const src = PUBLIE + GARDE + "  // ne jamais écrire ANTHROPIC_API_KEY en clair\n}\n";
  if (appelsAuNiveauModule("// ANTHROPIC_API_KEY\n").length) throw new Error("un commentaire est pris pour un appel");
  const f = constat(juger(parc(src)), "DP1");
  if (f.statut !== "PASS") throw new Error("un commentaire pédagogique est accusé de dépenser");
});

// -- DP2 : publier ce qu on consomme --------------------------------------------------------------
check("ROUGE — un fichier qui dépense sans publier sa consommation est un FAIL", () => {
  const src = GARDE + "  const c = process.env.OPENAI_API_KEY;\n}\n";
  const f = constat(juger(parc(src)), "DP2");
  if (f.statut !== "FAIL") throw new Error(`DP2 ${f.statut} — le plafond devient invérifiable`);
});

check("VERT — le même fichier qui publie ses jetons passe DP2", () => {
  const src = PUBLIE + GARDE + "  const c = process.env.OPENAI_API_KEY;\n}\n";
  const f = constat(juger(parc(src)), "DP2");
  if (f.statut !== "PASS") throw new Error(`DP2 ${f.statut} : ${f.message}`);
});

check("VERT — un parc sans appel payant passe DP2 en le DISANT, jamais en se taisant", () => {
  const f = constat(juger(parc("export function pan() { return 1; }\n")), "DP2");
  if (f.statut !== "PASS") throw new Error("faux positif DP2");
  if (!/aucun appel payant/.test(f.message)) throw new Error("le vert ne dit pas POURQUOI il est vert");
});

// -- portee et contrat -----------------------------------------------------------------------------
check("VERT — une RECETTE qui écrit le défaut à dessein n'est pas accusée", () => {
  const d = parc("export function pan() { return 1; }\n");
  writeFileSync(join(d, "digit-ai-forge-audit", "oracles", "pan.test.mjs"), 'import Anthropic from "@anthropic-ai/sdk";\n', "utf8");
  if (constat(juger(d), "DP1").statut !== "PASS") throw new Error("la fixture rouge d'un banc est prise pour du code de production");
});

check("SANS OBJET — un parc sans dépôt auditeur est déclaré hors portée, jamais accusé", () => {
  const d = join(T, "vide");
  mkdirSync(d, { recursive: true });
  if (juger(d).verdict !== "SANS_OBJET") throw new Error("un parc sans forge d'audit est accusé au lieu d'être écarté");
});

check("un PRODUIT qui appellerait un modèle payant n'est pas jugé ici", () => {
  const d = parc('import Anthropic from "@anthropic-ai/sdk";\n', { depot: "un-produit" });
  if (juger(d).verdict !== "SANS_OBJET") throw new Error("la portée déborde sur les produits, que R-34 ne vise pas");
});

check("le motif d'appel payant est court et ne mord pas sur n'importe quelle API", () => {
  if (RE_APPEL_PAYANT.test("const url = 'https://api.exemple.fr/v1/donnees';")) throw new Error("le motif est trop large");
  if (!RE_APPEL_PAYANT.test("process.env.ANTHROPIC_API_KEY")) throw new Error("le motif est trop étroit");
});

check("le verdict PUBLIE ce qu'il n'a pas jugé, dont le plafond de dépense", () => {
  if (!Array.isArray(NON_JUGE) || NON_JUGE.length < 3) throw new Error("non_juge absent ou squelettique");
  if (!NON_JUGE.some((x) => /plafond/i.test(x))) throw new Error("la borne principale n'est pas déclarée");
});

console.log(`\noracle-depense-voie-par-defaut : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
