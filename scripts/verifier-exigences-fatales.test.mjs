#!/usr/bin/env node
/**
 * verifier-exigences-fatales.test.mjs — les trois exigences fatales du référentiel d'audit que la
 * doctrine contredisait se voient au dossier de MEP, hors ligne (M-16, M-17, M-18 ; TF-1212 ; décision
 * humaine D-3 (a) du 17/10/2026).
 *
 * Rouges : le cas fondateur (un dossier qui ne dit rien de la chaîne, de la sauvegarde ni de
 * l'identité) ; un dossier qui prescrit `railway up` depuis le poste ; une chaîne nommée sans exécution
 * citée, ou qui ne déploie pas ; « aucun actif critique » chez un produit qui persiste des données ;
 * une déclaration de sauvegarde refusée par O-19 ou absente ; un fournisseur d'identité sans MFA ;
 * « aucun accès humain » chez un produit qui porte un champ mot de passe ; une authentification
 * locale sans procédure.
 * Verts : la chaîne nommée avec son exécution, ou la chaîne de l'hébergeur ; « aucun environnement
 * géré » motivé ; une dérogation adossée à une décision ; la déclaration de sauvegarde PASS à O-19 ;
 * « aucun actif critique » motivé sans persistance ; Entra ID et MFA ; le compte local de secours écrit.
 * Bornes : une commande directe sous un titre daté d'avant le 17/10/2026 n'est pas accusée ; un produit
 * sans dossier de MEP est sans objet ; `--regle` restreint le jugement.
 * Joué par `oracles\self-tests.mjs`.
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-exigences-fatales.mjs");
const { jugerProduit, commandesDirectes, dateDuTitre, oracleOps } = await import(pathToFileURL(OUTIL).href);
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
const produit = (fichiers) => {
  const D = mkdtempSync(join(tmpdir(), "exigences-fatales-"));
  for (const [chemin, contenu] of Object.entries(fichiers)) {
    mkdirSync(dirname(join(D, chemin)), { recursive: true });
    writeFileSync(join(D, chemin), contenu, "utf8");
  }
  return D;
};
const avec = (fichiers, fn) => { const D = produit(fichiers); try { fn(D); } finally { rmSync(D, { recursive: true, force: true }); } };
const statut = (r, regle) => { const f = r.findings.filter((x) => x.regle === regle); return f.length ? f.map((x) => x.statut).join(",") : "ABSENT"; };
const attendu = (r, regle, s) => { const v = statut(r, regle); if (v !== s) throw new Error(`${regle} : attendu ${s}, obtenu ${v} — ${JSON.stringify(r.findings.filter((x) => x.regle === regle)).slice(0, 400)}`); };

const D_MEP = "forge/DOSSIER-MEP.md";
const WORKFLOW = "name: deploiement\non: { push: { branches: [main] } }\njobs:\n  deployer:\n    environment: production\n    steps:\n      - run: npm test\n      - run: railway up --ci --service web\n";
const WORKFLOW_TESTS = "name: controles\non: [push]\njobs:\n  tester:\n    steps:\n      - run: npm test\n";
const jour = (decalage) => new Date(Date.now() - decalage * 86400000).toISOString().slice(0, 10);
const DECL_VERTE = JSON.stringify({ format: "forge-ops/sauvegarde@1", actifs: [{ nom: "base principale", rpo: "1h", rto: "4h",
  sauvegarde: { mecanisme: "restauration à un instant donné de la plateforme", frequence: "continue", configuration: "az postgres flexible-server show --query backup" },
  derniere_restauration: { date: jour(10), resultat: "succes", duree: "35 min", integrite: "comptes de lignes identiques" } }] });
const DECL_ROUGE = JSON.stringify({ format: "forge-ops/sauvegarde@1", actifs: [{ nom: "base principale", rto: "4h",
  sauvegarde: { mecanisme: "copie du volume", frequence: "24h", configuration: "copie.sh" } }] });

const CHAINE_OK = "## Chaîne de déploiement\n\nChaîne : `.github/workflows/deploiement.yml`, porte d'approbation de l'environnement production.\n"
  + "Exécution 15452 du 2026-10-17 : auteur iguane, version 6f78b88, cible production, résultat succès.\n";
const SAUVEGARDE_AUCUN = "## Sauvegarde et restauration\n\nAucun actif de données critique : site statique, le dépôt git est la source de tout le contenu servi.\n";
const IDENTITE_AUCUN = "## Fournisseur d'identité\n\nAucun accès humain authentifié : site public sans compte ni espace d'administration.\n";
const DOSSIER = (...s) => ["# Dossier de MEP", "", "Campagne de mutation proposée puis refusée.", "", ...s].join("\n");
const COMPLET = DOSSIER(CHAINE_OK, SAUVEGARDE_AUCUN, IDENTITE_AUCUN);

// ---- Le cas fondateur, et le remède ----------------------------------------------------------------
check("rouge fondateur : un dossier muet sur la chaîne, la sauvegarde et l'identité → PE-1, SR-1 et FI-1 refusés", () => avec({
  [D_MEP]: DOSSIER("## Production\n\nGO attendu."), ".github/workflows/deploiement.yml": WORKFLOW }, (D) => {
  const r = jugerProduit(D);
  attendu(r, "PE-1", "FAIL"); attendu(r, "SR-1", "FAIL"); attendu(r, "FI-1", "FAIL");
  if (!/CTL-D09-01/.test(r.findings.find((f) => f.regle === "PE-1").message)) throw new Error("PE-1 ne cite pas l'exigence d'audit");
  if (!/deploiement\.yml/.test(r.findings.find((f) => f.regle === "PE-1").message)) throw new Error("PE-1 ne nomme pas la chaîne relevée");
}));
check("vert : chaîne nommée avec exécution, aucun actif critique motivé, aucun accès humain motivé → PASS partout, exit 0", () => avec({
  [D_MEP]: COMPLET, ".github/workflows/deploiement.yml": WORKFLOW }, (D) => {
  const r = jugerProduit(D);
  attendu(r, "PE-2", "PASS"); attendu(r, "PE-3", "PASS"); attendu(r, "SR-2", "PASS"); attendu(r, "FI-2", "PASS");
  const c = lancer(D);
  if (c.code !== 0 || c.j?.verdict !== "PASS") throw new Error(`exit ${c.code} ${c.j?.verdict}`);
}));

// ---- M-16 : la chaîne exclusive ---------------------------------------------------------------------
check("rouge PE-3 : le dossier prescrit `railway up` depuis le poste → refus qui nomme la commande et sa ligne, exit 1", () => avec({
  [D_MEP]: DOSSIER(CHAINE_OK, "## Production : commandes exactes\n\n```bash\nrailway up --detach --service app --environment production\n```\n", SAUVEGARDE_AUCUN, IDENTITE_AUCUN),
  ".github/workflows/deploiement.yml": WORKFLOW }, (D) => {
  const r = jugerProduit(D);
  attendu(r, "PE-3", "FAIL");
  if (!/railway up.*ligne \d+/.test(r.findings.find((f) => f.regle === "PE-3").message)) throw new Error("commande ou ligne non nommée");
  if (lancer(D).code !== 1) throw new Error("le verbe ne sort pas en 1");
}));
check("rouge PE-3 : `docker compose up` sous un titre de production → refusé ; sous un titre de staging → non", () => {
  const prod = commandesDirectes("# D\n## Mise en production\n\n`docker compose up -d` sur l'hôte\n");
  const staging = commandesDirectes("# D\n## Mise en production\n### Staging local\n\n```\ndocker compose up -d\n```\n");
  if (prod.length !== 1 || staging.length !== 0) throw new Error(`prod ${prod.length}, staging ${staging.length}`);
});
check("borne PE-3 : une commande directe sous un titre daté d'avant le 17/10/2026 est comptée en antériorité, jamais accusée", () => avec({
  [D_MEP]: DOSSIER(CHAINE_OK, "## Run 20260906a — v0.7.0 (2026-10-03)\n\n### Production : commandes exactes\n\n```\nrailway up --detach\n```\n", SAUVEGARDE_AUCUN, IDENTITE_AUCUN),
  ".github/workflows/deploiement.yml": WORKFLOW }, (D) => {
  const r = jugerProduit(D);
  attendu(r, "PE-3", "PASS");
  if (r.mesure.commandes_anterieures !== 1 || r.mesure.commandes_directes !== 0) throw new Error(JSON.stringify(r.mesure));
}));
check("bornes de date : AAAA-MM-JJ, AAAAMMJJ d'un identifiant de run et JJ/MM/AAAA sont lues ; un titre sans date n'en a pas", () => {
  const v = [dateDuTitre("Run (2026-10-03)"), dateDuTitre("run 20260815a-bdl"), dateDuTitre("(15/08/2026)"), dateDuTitre("Production : commandes exactes")];
  if (v.join("|") !== "2026-10-03|2026-08-15|2026-08-15|") throw new Error(v.join("|"));
});
check("rouge PE-2 : la chaîne nommée sans exécution citée → refus (journal non localisé)", () => avec({
  [D_MEP]: DOSSIER("## Chaîne de déploiement\n\nChaîne : `.github/workflows/deploiement.yml`.\n", SAUVEGARDE_AUCUN, IDENTITE_AUCUN),
  ".github/workflows/deploiement.yml": WORKFLOW }, (D) => {
  const r = jugerProduit(D);
  attendu(r, "PE-2", "FAIL");
  if (!/EXÉCUTION/.test(r.findings.find((f) => f.regle === "PE-2").message)) throw new Error("motif absent");
}));
check("rouge PE-2 : la chaîne nommée ne déploie pas (elle ne fait que contrôler) → refus", () => avec({
  [D_MEP]: DOSSIER("## Chaîne de déploiement\n\nChaîne : `.github/workflows/controles.yml`, exécution 15452.\n", SAUVEGARDE_AUCUN, IDENTITE_AUCUN),
  ".github/workflows/controles.yml": WORKFLOW_TESTS }, (D) => attendu(jugerProduit(D), "PE-2", "FAIL")));
check("vert PE-2 : la chaîne de l'hébergeur déclenchée par la poussée, exécution citée → PASS", () => avec({
  [D_MEP]: DOSSIER("## Chaîne de déploiement\n\nL'hébergeur déploie à la poussée sur main, au vert des contrôles. Déploiement 6f78b88c du 2026-10-17, journal de l'hébergeur.\n", SAUVEGARDE_AUCUN, IDENTITE_AUCUN) }, (D) => attendu(jugerProduit(D), "PE-2", "PASS")));
check("vert PE-2 : « aucun environnement géré : motif » → PASS ; sans motif → refus", () => {
  avec({ [D_MEP]: DOSSIER("## Chaîne de déploiement\n\nAucun environnement géré : produit livré en conteneur local au poste de l'exploitant.\n", SAUVEGARDE_AUCUN, IDENTITE_AUCUN) }, (D) => attendu(jugerProduit(D), "PE-2", "PASS"));
  avec({ [D_MEP]: DOSSIER("## Chaîne de déploiement\n\nAucun environnement géré.\n", SAUVEGARDE_AUCUN, IDENTITE_AUCUN) }, (D) => attendu(jugerProduit(D), "PE-2", "FAIL"));
});
check("vert PE-2/PE-3 : une dérogation adossée à une décision couvre la commande directe (partiel au référentiel) ; sans décision, non", () => {
  const cmd = "## Production\n\n```\nrailway up --detach\n```\n";
  avec({ [D_MEP]: DOSSIER("## Chaîne de déploiement\n\nDérogation : hébergeur sans intégration de chaîne, décision humaine du 2026-10-17 (D-9).\n", cmd, SAUVEGARDE_AUCUN, IDENTITE_AUCUN) }, (D) => {
    const r = jugerProduit(D); attendu(r, "PE-2", "PASS"); attendu(r, "PE-3", "PASS");
    if (!/partiel/.test(r.findings.find((f) => f.regle === "PE-2").message)) throw new Error("la dérogation se dit conforme");
  });
  avec({ [D_MEP]: DOSSIER("## Chaîne de déploiement\n\nDérogation : pas le temps.\n", cmd, SAUVEGARDE_AUCUN, IDENTITE_AUCUN) }, (D) => {
    const r = jugerProduit(D); attendu(r, "PE-2", "FAIL"); attendu(r, "PE-3", "FAIL");
  });
});

// ---- M-17 : la sauvegarde -----------------------------------------------------------------------------
check("rouge SR-2 : « aucun actif critique » chez un produit qui ouvre une base SQLite → refus qui nomme le fichier", () => avec({
  [D_MEP]: COMPLET, "app/db.py": "import sqlite3\nconn = sqlite3.connect('/data/app.db')\n" }, (D) => {
  const r = jugerProduit(D);
  attendu(r, "SR-2", "FAIL");
  if (!/app\/db\.py/.test(r.findings.find((f) => f.regle === "SR-2").message)) throw new Error("fichier non nommé");
}));
check("rouge SR-2 : une déclaration citée mais absente du produit → refus", () => avec({
  [D_MEP]: DOSSIER(CHAINE_OK, "## Sauvegarde et restauration\n\nDéclaration : `forge/etapes/mep/SAUVEGARDE.json`.\n", IDENTITE_AUCUN) }, (D) => attendu(jugerProduit(D), "SR-2", "FAIL")));
const o19 = oracleOps();
check(`SR-3 : la déclaration citée est jugée par O-19 de forge-ops — rouge refusé, vert PASS${o19 ? "" : " (O-19 introuvable : non jugé, et dit)"}`, () => {
  const section = "## Sauvegarde et restauration\n\nDéclaration : `forge/etapes/mep/SAUVEGARDE.json`, jugée par O-19.\n";
  avec({ [D_MEP]: DOSSIER(CHAINE_OK, section, IDENTITE_AUCUN), "forge/etapes/mep/SAUVEGARDE.json": DECL_ROUGE }, (D) => {
    const r = jugerProduit(D);
    attendu(r, "SR-2", "PASS");
    if (o19) { attendu(r, "SR-3", "FAIL"); if (!/RPO non déclaré/.test(r.findings.find((f) => f.regle === "SR-3").message)) throw new Error("le constat d'O-19 n'est pas relayé"); }
    else if (!r.nonJuge.some((n) => /O-19 de forge-ops introuvable/.test(n))) throw new Error("l'absence d'O-19 n'est pas dite");
  });
  avec({ [D_MEP]: DOSSIER(CHAINE_OK, section, IDENTITE_AUCUN), "forge/etapes/mep/SAUVEGARDE.json": DECL_VERTE }, (D) => {
    const r = jugerProduit(D);
    if (o19) attendu(r, "SR-3", "PASS");
  });
});
check("SR-3 borne : O-19 introuvable → rien n'est refusé à tort, l'absence est déclarée au non-jugé", () => avec({
  [D_MEP]: DOSSIER(CHAINE_OK, "## Sauvegarde et restauration\n\nDéclaration : `SAUVEGARDE.json`.\n", IDENTITE_AUCUN), "SAUVEGARDE.json": DECL_ROUGE }, (D) => {
  const r = spawnSync(process.execPath, [OUTIL, D, "--regle", "sauvegarde"], { encoding: "utf8",
    env: { ...process.env, FORGE_OPS_ORACLE: join(D, "absent.mjs"), FORGE_ROOT: join(D, "nulle-part") } });
  const j = JSON.parse(r.stdout);
  if (r.status !== 0 || (j.findings || []).some((f) => f.regle === "SR-3")) throw new Error(`exit ${r.status} — un oracle absent a produit un verdict SR-3`);
  if (!(j.non_juge || []).some((n) => /O-19 de forge-ops introuvable/.test(n))) throw new Error("absence non dite au non-jugé");
  if (oracleOps({ FORGE_OPS_ORACLE: join(D, "absent.mjs") }) !== null) throw new Error("un oracle désigné et absent est remplacé en silence par un autre");
}));

// ---- M-18 : le fournisseur d'identité -------------------------------------------------------------
const ADMIN = "<form method=\"post\"><input name=\"email\"><input type=\"password\" name=\"mdp\"></form>\n";
check("rouge FI-2 : Entra ID nommé sans MFA → refus « partiel = délégation sans MFA »", () => avec({
  [D_MEP]: DOSSIER(CHAINE_OK, SAUVEGARDE_AUCUN, "## Fournisseur d'identité\n\nConnexion déléguée à Entra ID (OIDC).\n") }, (D) => {
  const r = jugerProduit(D); attendu(r, "FI-2", "FAIL");
  if (!/sans MFA/.test(r.findings.find((f) => f.regle === "FI-2").message)) throw new Error("motif absent");
}));
check("vert FI-2 : Entra ID et MFA par accès conditionnel → PASS", () => avec({
  [D_MEP]: DOSSIER(CHAINE_OK, SAUVEGARDE_AUCUN, "## Fournisseur d'identité\n\nConnexion déléguée à Entra ID (OIDC), MFA exigé par la stratégie d'accès conditionnel du locataire.\n") }, (D) => attendu(jugerProduit(D), "FI-2", "PASS")));
check("rouge FI-2 : aucun fournisseur nommé → refus", () => avec({
  [D_MEP]: DOSSIER(CHAINE_OK, SAUVEGARDE_AUCUN, "## Fournisseur d'identité\n\nLes administrateurs se connectent avec leur adresse et un mot de passe.\n") }, (D) => attendu(jugerProduit(D), "FI-2", "FAIL")));
check("rouge FI-3 : « aucun accès humain » chez un produit qui porte un champ mot de passe → refus qui nomme le fichier", () => avec({
  [D_MEP]: COMPLET, "app/templates/admin.html": ADMIN }, (D) => {
  const r = jugerProduit(D); attendu(r, "FI-3", "FAIL");
  if (!/admin\.html/.test(r.findings.find((f) => f.regle === "FI-3").message)) throw new Error("fichier non nommé");
}));
check("FI-3 : une authentification locale relevée exige la procédure du compte local — absente refusée, écrite PASS", () => {
  const idp = "## Fournisseur d'identité\n\nConnexion déléguée à Entra ID, MFA exigé.\n";
  avec({ [D_MEP]: DOSSIER(CHAINE_OK, SAUVEGARDE_AUCUN, idp), "app/auth.py": "import bcrypt\n" }, (D) => attendu(jugerProduit(D), "FI-3", "FAIL"));
  avec({ [D_MEP]: DOSSIER(CHAINE_OK, SAUVEGARDE_AUCUN, idp + "Comptes locaux : un seul compte de secours, procédure de bris de glace au coffre de l'exploitant.\n"), "app/auth.py": "import bcrypt\n" },
    (D) => attendu(jugerProduit(D), "FI-3", "PASS"));
});

// ---- Bornes de l'outil --------------------------------------------------------------------------------
check("borne : un produit sans dossier de MEP est sans objet (exit 2), jamais accusé", () => avec({ "README.md": "# p\n" }, (D) => {
  const c = lancer(D); if (c.code !== 2 || c.j?.verdict !== "SKIP") throw new Error(`exit ${c.code} ${c.j?.verdict}`);
}));
check("borne : --regle restreint le jugement à une exigence ; une règle inconnue sort en 2", () => avec({
  [D_MEP]: DOSSIER("## Production\n\nGO.") }, (D) => {
  const c = lancer(D, "--regle", "identite");
  const regles = new Set((c.j?.findings || []).map((f) => f.regle));
  if (c.code !== 1 || regles.size !== 1 || !regles.has("FI-1")) throw new Error(`exit ${c.code}, règles ${[...regles]}`);
  if (lancer(D, "--regle", "tout").code !== 2) throw new Error("règle inconnue acceptée");
}));

console.log(`\nverifier-exigences-fatales : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
