#!/usr/bin/env node
/**
 * verifier-portes-du-jour.test.mjs — un feu vert de lancement qui repose sur le verdict de la veille
 * des portes à base externe se voit (M-10, TF-1498). Produits construits en dossier temporaire : une
 * chaîne `azure-pipelines.yml` qui joue `npm audit` et `trivy`, et un `DOSSIER-MEP.md` au format de
 * ETAPE-MEP.md § 3 nonies.
 *
 * Rouges : le cas fondateur du 30/09/2026 (portes datées de la qualification, la veille) ; une porte
 * de la chaîne absente du feu vert ; une porte rejouée sur un autre commit ; un objet nommé « idem » ;
 * un feu vert sans date ni objet ; un lancement qui glisse au lendemain ; une porte d'un script de
 * package.json oubliée. Verts : le feu vert du jour ; le remède joué après le glissement ; les dates
 * à la française et un commit long comparé par préfixe. Bornes : un commentaire de chaîne ne joue
 * rien ; un produit sans dossier ; un gabarit d'un autre dépôt, signalé comme non lu.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-portes-du-jour.mjs");
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
const regles = (r, regle) => (r.j?.findings || []).filter((f) => f.regle === regle && f.statut === "FAIL");

const CHAINE = [
  "trigger: none",
  "steps:",
  "  - script: npm ci",
  "  - script: npm audit --audit-level=high",
  "    displayName: Avis de sécurité des dépendances",
  "  # npm audit fix est interdit sur cette branche",
  "  - script: trivy image --severity HIGH,CRITICAL --exit-code 1 produit:$(Build.BuildId)",
  "",
].join("\n");
const feuVert = ({ date = "2026-09-30", npm = "2026-09-30 09:12", trivy = "2026-09-30 09:20", objetNpm = "630f874", sansTrivy = false, entete = true } = {}) => [
  "# Dossier de MEP — Produit-03",
  "",
  "## Feu vert de lancement",
  "",
  entete ? `Lancement : ${date} · Objet lancé : 630f874 (env/prd)` : "Les contrôles du jour sont faits.",
  "",
  "| Porte | Base externe jugée | Rejouée le | Objet jugé | Verdict |",
  "|---|---|---|---|---|",
  `| \`npm audit --audit-level=high\` | avis de sécurité npm | ${npm} | ${objetNpm} | 0 vulnérabilité haute |`,
  ...(sansTrivy ? [] : [`| \`trivy image --severity HIGH,CRITICAL\` | base de vulnérabilités | ${trivy} | image construite sans cache depuis 630f874 | 0 |`]),
  "",
  "## Commande de mise en production",
  "",
  "Lancer la chaîne de production sur env/prd.",
  "",
].join("\n");
const produit = ({ chaine = CHAINE, dossier = feuVert(), paquet = null } = {}) => {
  const D = mkdtempSync(join(tmpdir(), "portes-du-jour-"));
  if (chaine !== null) writeFileSync(join(D, "azure-pipelines.yml"), chaine, "utf8");
  if (paquet) writeFileSync(join(D, "package.json"), JSON.stringify(paquet, null, 2), "utf8");
  if (dossier !== null) {
    mkdirSync(join(D, "forge", "etapes", "mep"), { recursive: true });
    writeFileSync(join(D, "forge", "etapes", "mep", "DOSSIER-MEP.md"), dossier, "utf8");
  }
  return D;
};
const nettoyer = (D) => rmSync(D, { recursive: true, force: true });

check("vert — portes de la chaîne rejouées le jour du lancement, sur l'objet lancé : PASS, exit 0", () => {
  const D = produit();
  const r = lancer(D);
  if (r.code !== 0 || r.j.verdict !== "PASS" || r.j.mesure.portes_feu_vert !== 2 || r.j.mesure.portes_chaine !== 2) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — le cas fondateur : portes datées de la qualification, la VEILLE du lancement : PJ-2 refuse les deux, exit 1", () => {
  const D = produit({ dossier: feuVert({ npm: "2026-09-29 18:40", trivy: "2026-09-29 18:52" }) });
  const r = lancer(D);
  const pj2 = regles(r, "PJ-2");
  if (r.code !== 1 || pj2.length !== 2 || !pj2.every((f) => /PRÉCÈDE/.test(f.message)) || !/npm audit/.test(pj2[0].message)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — une porte que la chaîne joue manque au feu vert : PJ-1 la nomme, avec son fichier et sa ligne", () => {
  const D = produit({ dossier: feuVert({ sansTrivy: true }) });
  const r = lancer(D);
  const pj1 = regles(r, "PJ-1");
  if (r.code !== 1 || pj1.length !== 1 || !/trivy/.test(pj1[0].message) || !/azure-pipelines\.yml:7/.test(pj1[0].message)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — porte rejouée le jour même, mais sur un AUTRE commit que l'objet lancé : PJ-3", () => {
  const D = produit({ dossier: feuVert({ objetNpm: "main @ 2e4dd72" }) });
  const r = lancer(D);
  if (r.code !== 1 || regles(r, "PJ-3").length !== 1 || regles(r, "PJ-2").length) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — objet jugé écrit « idem » : il ne nomme rien, PJ-3", () => {
  const D = produit({ dossier: feuVert({ objetNpm: "idem" }) });
  const r = lancer(D);
  if (r.code !== 1 || !/idem/.test(JSON.stringify(regles(r, "PJ-3")))) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — feu vert sans date de lancement ni objet lancé : PJ-0 refuse les deux manques", () => {
  const D = produit({ dossier: feuVert({ entete: false }) });
  const r = lancer(D);
  const pj0 = regles(r, "PJ-0");
  if (r.code !== 1 || pj0.length !== 2 || !/date du lancement/.test(pj0[0].message) || !/objet lancé/.test(pj0[1].message)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge puis vert — le lancement GLISSE au lendemain : refusé avec --lancement, puis le REMÈDE joué (portes rejouées ce jour-là) passe", () => {
  const D = produit();
  const r1 = lancer(D, "--lancement", "2026-10-01");
  if (r1.code !== 1 || regles(r1, "PJ-2").length !== 2) throw new Error(`glissement non vu : ${r1.brut.slice(0, 300)}`);
  nettoyer(D);
  const R = produit({ dossier: feuVert({ date: "2026-10-01", npm: "2026-10-01 08:05", trivy: "2026-10-01 08:11" }) });
  const r2 = lancer(R, "--lancement", "2026-10-01");
  if (r2.code !== 0 || r2.j.lancement !== "2026-10-01") throw new Error(`le remède ne passe pas : ${r2.brut.slice(0, 300)}`);
  nettoyer(R);
});
check("vert — dates à la française (« 30/09/2026 à 09h12 ») et commit long comparé par préfixe à l'objet lancé", () => {
  const dossier = feuVert({ npm: "30/09/2026 à 09h12", trivy: "30/09/2026 à 09h20", objetNpm: "630f874a1b2c3d4e5f60" })
    .replace("## Feu vert de lancement", "## Feu vert de lancement du 30/09/2026")
    .replace("Lancement : 2026-09-30 · ", "");
  const D = produit({ dossier });
  const r = lancer(D);
  if (r.code !== 0 || r.j.lancement !== "2026-09-30") throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("rouge — une porte nommée par un script de package.json manque au feu vert : PJ-1 cite le script", () => {
  const D = produit({ chaine: null, paquet: { name: "produit", scripts: { audit: "npm audit --audit-level=high", test: "node --test" } },
    dossier: feuVert({ sansTrivy: true }).replace(/^\| `npm audit[^\n]*\n/m, "| `trivy image` | base de vulnérabilités | 2026-09-30 09:20 | 630f874 | 0 |\n") });
  const r = lancer(D);
  const pj1 = regles(r, "PJ-1");
  if (r.code !== 1 || pj1.length !== 1 || !/package\.json › scripts\.audit/.test(pj1[0].message)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("borne — une porte seulement COMMENTÉE dans la chaîne ne joue rien : sans porte ni au dossier, rien à juger (exit 2)", () => {
  const D = produit({ chaine: "steps:\n  - script: npm ci\n  # - script: npm audit --audit-level=high\n", dossier: "# Dossier de MEP\n\nBuild, healthcheck et smoke tests verts.\n" });
  const r = lancer(D);
  if (r.code !== 2 || r.j.verdict !== "SKIP" || r.j.mesure.portes_chaine !== 0) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("borne — produit sans dossier de MEP : rien à juger (exit 2), jamais un vert", () => {
  const D = produit({ dossier: null });
  const r = lancer(D);
  if (r.code !== 2 || r.j.verdict !== "SKIP") throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});
check("borne — chaîne tirée d'un gabarit d'un AUTRE dépôt : ses portes non lues sont DITES (NON_JUGE), jamais tenues pour absentes", () => {
  const D = produit({ chaine: "resources:\n  repositories:\n    - repository: commun\nextends:\n  template: chaines/livraison.yml@commun\n", dossier: "# Dossier de MEP\n\nRien.\n" });
  const r = lancer(D);
  const nj = (r.j?.findings || []).filter((f) => f.statut === "NON_JUGE");
  if (r.code !== 2 || nj.length !== 1 || !/livraison\.yml@commun/.test(nj[0].message)) throw new Error(r.brut.slice(0, 400));
  nettoyer(D);
});

console.log(`\nverifier-portes-du-jour (M-10, TF-1498) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
