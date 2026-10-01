#!/usr/bin/env node
/**
 * verifier-garde-fous.test.mjs — un déploiement conçu sans relever les garde-fous de la plateforme,
 * ni relire les contraintes déjà connues du produit, se voit (M-11, TF-1495 et TF-1496). Produits
 * construits en dossier temporaire : une infrastructure Azure (`provider "azurerm"`), un fichier de
 * variables de qualification qui porte un commentaire « Obligatoire ici », et un `DOSSIER-MEP.md` au
 * format de ETAPE-MEP.md § 1 ter.
 *
 * Rouges : le cas fondateur du 21/09/2026 (dossier sans section des garde-fous, contrainte de la
 * qualification jamais relue) ; une section sans relevé ; un relevé non daté ; une contrainte
 * promue GF-01 que le dossier ne cite pas ; un registre de la factory non lu ; une parole de l'humain
 * reformulée sans ses mots ; un registre qui porte un identifiant, un client nommé, une entrée sans
 * lot ; un identifiant en double. Verts : le dossier conforme ; la contrainte citée par son seul
 * identifiant ; le registre RÉEL du pilot, jugé à chaque recette. Bornes : sans dossier ; ni Azure ni
 * contrainte ; « obligatoire » dans un commentaire ordinaire n'est pas une contrainte apprise.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-garde-fous.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const lancer = (...c) => {
  const r = spawnSync(process.execPath, [OUTIL, ...c], { encoding: "utf8" });
  let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible */ }
  return { code: r.status, j, brut: r.stdout + r.stderr };
};
const refus = (r, regle) => (r.j?.findings || []).filter((f) => f.regle === regle && f.statut === "FAIL");

const TFVARS = (id = "") => [
  "app_name = \"produit\"",
  `# Obligatoire ici${id ? ` (${id})` : ""} : stratégie de la souscription, authentification de la Web App exigée`,
  "easy_auth_enabled = true",
  "",
].join("\n");
const SECTION = ({ releve = "Relevé du 2026-09-21 : `az policy assignment list --scope <portée> --disable-scope-strict-match`, puis la règle de chacune.",
  registre = "Registre des garde-fous de la factory lu le 2026-09-21 : GFP-001, GFP-002.",
  cite = "relevé du 2026-09-21 ; infra/hpr.tfvars ; GFP-001",
  parole = "parole du commanditaire, 21/09/2026 : « formulaire Entra traité par l'administrateur Entra »" } = {}) => [
  "# Dossier de MEP — Produit-03",
  "",
  "Campagne de mutation proposée puis écartée pour ce passage.",
  "",
  "## Garde-fous de la plateforme et contraintes connues",
  "",
  releve,
  registre,
  "",
  "| Id | Garde-fou ou contrainte | Source | Étape concernée | Verdict |",
  "|---|---|---|---|---|",
  `| GF-01 | stratégie Deny : une Web App sans authentification ne s'écrit pas | ${cite} | S-04 amorçage | rend impossible l'amorçage sans authentification |`,
  `| GF-02 | inscription d'application par formulaire du client | ${parole} | S-07 | compatible : demandée par le formulaire |`,
  "",
].join("\n");
const produit = ({ dossier = SECTION(), tfvars = TFVARS(), azure = true } = {}) => {
  const D = mkdtempSync(join(tmpdir(), "garde-fous-"));
  mkdirSync(join(D, "infra"), { recursive: true });
  if (azure) writeFileSync(join(D, "infra", "main.tf"), "provider \"azurerm\" {\n  features {}\n}\n", "utf8");
  if (tfvars !== null) writeFileSync(join(D, "infra", "hpr.tfvars"), tfvars, "utf8");
  if (dossier !== null) {
    mkdirSync(join(D, "forge", "etapes", "mep"), { recursive: true });
    writeFileSync(join(D, "forge", "etapes", "mep", "DOSSIER-MEP.md"), dossier, "utf8");
  }
  return D;
};
const nettoyer = (D) => rmSync(D, { recursive: true, force: true });

check("vert — relevé daté, contrainte de la qualification relue, registre lu, parole citée mot pour mot : PASS, exit 0", () => {
  const D = produit();
  const r = lancer(D);
  if (r.code !== 0 || r.j.verdict !== "PASS" || r.j.mesure.contraintes_connues !== 1 || !r.j.mesure.cible_azure) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — le cas fondateur : dossier SANS section des garde-fous, contrainte « Obligatoire ici » jamais relue : GF-1 et GF-2", () => {
  const D = produit({ dossier: "# Dossier de MEP — Produit-03\n\nAmorçage de production sans authentification au premier passage.\n" });
  const r = lancer(D);
  const gf2 = refus(r, "GF-2");
  if (r.code !== 1 || refus(r, "GF-1").length !== 1 || gf2.length !== 1 || !/infra\/hpr\.tfvars:2/.test(gf2[0].ou)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — section présente mais SANS relevé des stratégies de la portée cible : GF-1", () => {
  const D = produit({ dossier: SECTION({ releve: "Les stratégies ont été vues avec l'équipe plateforme." }) });
  const r = lancer(D);
  const gf1 = refus(r, "GF-1");
  if (r.code !== 1 || gf1.length !== 1 || !/az policy assignment list/.test(gf1[0].message)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — relevé NON DATÉ : GF-1 le dit", () => {
  const D = produit({ dossier: SECTION({ releve: "Relevé : `az policy assignment list --scope <portée>`.", registre: "Registre des garde-fous lu : GFP-001.", parole: "parole du commanditaire : « formulaire Entra »" }) });
  const r = lancer(D);
  if (r.code !== 1 || !/DATÉ/.test(JSON.stringify(refus(r, "GF-1")))) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — contrainte promue GF-01 dans le fichier d'environnement, absente du dossier : GF-2 nomme l'identifiant", () => {
  const D = produit({ tfvars: TFVARS("GF-01"), dossier: SECTION({ cite: "relevé du 2026-09-21" }).replace("| GF-01 |", "| — |") });
  const r = lancer(D);
  const gf2 = refus(r, "GF-2");
  if (r.code !== 1 || gf2.length !== 1 || !/identifiant GF-01/.test(gf2[0].message)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("vert — la contrainte promue GF-01 citée par son seul identifiant suffit : PASS", () => {
  const D = produit({ tfvars: TFVARS("GF-01"), dossier: SECTION({ cite: "relevé du 2026-09-21 ; GFP-001" }) });
  const r = lancer(D);
  if (r.code !== 0) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — le registre de la factory n'est pas lu : GF-3", () => {
  const D = produit({ dossier: SECTION({ registre: "", cite: "relevé du 2026-09-21 ; infra/hpr.tfvars" }) });
  const r = lancer(D);
  if (r.code !== 1 || refus(r, "GF-3").length !== 1) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — un processus décrit par le commanditaire, reformulé sans ses mots : GF-4", () => {
  const D = produit({ dossier: SECTION({ parole: "décrit par le commanditaire le 21/09, équivaut à l'assistant du portail" }) });
  const r = lancer(D);
  const gf4 = refus(r, "GF-4");
  if (r.code !== 1 || gf4.length !== 1 || !/SES mots/.test(gf4[0].message)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("borne — produit sans dossier de MEP : rien à juger (exit 2), jamais un vert", () => {
  const D = produit({ dossier: null });
  const r = lancer(D);
  if (r.code !== 2 || r.j.verdict !== "SKIP") throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("borne — ni cible Azure ni contrainte connue, dossier sans section : M-11 sans objet (exit 2)", () => {
  const D = produit({ azure: false, tfvars: null, dossier: "# Dossier de MEP\n\nConteneur local.\n" });
  const r = lancer(D);
  if (r.code !== 2 || r.j.mesure.cible_azure !== null) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("borne — « obligatoire » dans un commentaire ordinaire (« variable obligatoire ») n'est pas une contrainte apprise", () => {
  const D = produit({ tfvars: "# variable obligatoire pour le module\napp_name = \"produit\"\n", dossier: SECTION({ cite: "relevé du 2026-09-21 ; GFP-001" }) });
  const r = lancer(D);
  if (r.code !== 0 || r.j.mesure.contraintes_connues !== 0) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("vert — le registre RÉEL du pilot (references/GARDE-FOUS-PLATEFORME.json) passe GR-1 à GR-3 : il est jugé à chaque recette", () => {
  const r = lancer("--registre");
  if (r.code !== 0 || r.j.verdict !== "PASS" || r.j.mesure.entrees < 1) throw new Error(r.brut.slice(0, 400));
});
check("rouge — registre qui porte un identifiant de souscription, un client nommé et une entrée sans lot : GR-2 et GR-1", () => {
  const D = mkdtempSync(join(tmpdir(), "garde-fous-registre-"));
  const f = join(D, "registre.json");
  writeFileSync(f, JSON.stringify({ format: "pilot/garde-fous-plateforme@1", garde_fous: [{
    id: "GFP-001", client: "Societe Exemple", plateforme: "azure", mecanisme: "Azure Policy", effet: "Deny",
    portee: "/subscriptions/0f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b", vise: "Microsoft.Web/sites/config", refuse: "x", consequence: "y",
    source: "un échange oral", verifiee_par: "z", inscrite_le: "2026-10-01", verifiee_le: "2026-09-29", constatee: [{ produit: "Produit-03", le: "2026-09-29" }],
  }] }), "utf8");
  const r = lancer("--registre", f);
  const gr2 = refus(r, "GR-2");
  if (r.code !== 1 || gr2.length < 2 || !/Client-X/.test(JSON.stringify(gr2)) || !/lot de retours/.test(JSON.stringify(refus(r, "GR-1")))) throw new Error(r.brut.slice(0, 500));
  nettoyer(D);
});
check("rouge — deux entrées sous le même identifiant : GR-3", () => {
  const D = mkdtempSync(join(tmpdir(), "garde-fous-double-"));
  const f = join(D, "registre.json");
  const e = { id: "GFP-007", client: "Client-A", plateforme: "azure", mecanisme: "Azure Policy", effet: "Deny", portee: "souscription", vise: "v", refuse: "r",
    consequence: "c", source: "lot « Produit-03 - RETOURS - 20260929d »", verifiee_par: "relevé", inscrite_le: "2026-10-01", verifiee_le: "2026-09-29", posee_le: null, constatee: [{ produit: "Produit-03", le: "2026-09-29" }] };
  writeFileSync(f, JSON.stringify({ format: "pilot/garde-fous-plateforme@1", garde_fous: [e, e] }), "utf8");
  const r = lancer("--registre", f);
  if (r.code !== 1 || refus(r, "GR-3").length !== 1 || refus(r, "GR-1").length) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});

console.log(`\nverifier-garde-fous (M-11, TF-1495 et TF-1496) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
