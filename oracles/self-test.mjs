#!/usr/bin/env node
/**
 * self-test.mjs — recette à double sens de oracle-conformite-projet :
 * une fixture VERTE construite conforme PASSE (exit 0), une fixture ROUGE à défauts plantés
 * ÉCHOUE (exit 1) en déclenchant chacune des règles attendues. Fixtures construites en
 * dossier temporaire (git réel inclus) — rien n'est écrit dans le dépôt.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const oracle = join(dirname(fileURLToPath(import.meta.url)), "oracle-conformite-projet.mjs");
// Pas de shell : sous Windows, shell:true re-découpe les arguments contenant des espaces
// (constaté : le message de commit éclaté en pathspecs). git/node sont des exécutables directs.
const sh = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8" });
const lance = (projet) => {
  try { return { exit: 0, rapport: JSON.parse(sh("node", [oracle, projet])) }; }
  catch (e) { return { exit: e.status, rapport: JSON.parse(String(e.stdout || "{}")) }; }
};

let pass = 0, fail = 0;
const check = (nom, fn) => { try { fn(); console.log(`  [PASS] ${nom}`); pass++; } catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; } };

// ---- fixture VERTE : projet conforme aux 17 règles ------------------------------------------
const verte = mkdtempSync(join(tmpdir(), "conf-verte-"));
for (const d of ["input", "output", "docs", "forge", "forge/retours", "output/Old"]) mkdirSync(join(verte, d), { recursive: true });
writeFileSync(join(verte, "forge", "retours", "RETOURS-FORGES.md"), "gabarit\n");
writeFileSync(join(verte, "CLAUDE.md"),
  "# Produit\n## Routage forge — obligatoire\nvalider : forge_tests\névoluer : run de version\ndéployer : MEP\n");
writeFileSync(join(verte, "README.md"), "# Produit\nDémarrage : 2 commandes.\n");
writeFileSync(join(verte, ".env.example"), "# ne jamais renseigner de secret ici\nPORT=8000\nAPI_TIERCE_CLE= # à fournir :\n");
writeFileSync(join(verte, ".env"), "PORT=8000\n");
writeFileSync(join(verte, ".gitignore"), ".env\n.venv/\n__pycache__/\nnode_modules/\ngenerated/\nOld/\n");
writeFileSync(join(verte, "output", "Digit-AI - Rapport Test - 20260806a.md"), "rapport\n");
writeFileSync(join(verte, "forge", "audit.oracles.json"), "{}\n");
writeFileSync(join(verte, "forge", "ledger.jsonl"), [
  JSON.stringify({ type: "run_open", ts: "2026-08-09T08:00:00Z", versions_forges: { conception: "951d46e", design: "2ae8517", development: "b65ff31", tests: "d0abbd6", agents: "9d3b3a5" } }),
  JSON.stringify({ type: "run_close", ts: "2026-08-09T18:00:00Z" }),
  JSON.stringify({ type: "run_open", ts: "2026-08-10T08:00:00Z", run_precedent: "run-20260809", versions_forges: { conception: "951d46e" } }),
].join("\n") + "\n"); // R-19 verte : versions_forges partout + chaînage du run de version
writeFileSync(join(verte, "app.py"), "print('produit')\n");
// R-27 verte : surface web ouverte aux agents IA + llms.txt à côté (un blocage CONSIGNÉ
// reste conforme — la décision datée au-dessus de la règle)
writeFileSync(join(verte, "robots.txt"),
  "# décision du 2026-08-11 (humain) : contenu propriétaire hors corpus d'entraînement\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: *\nAllow: /\n");
writeFileSync(join(verte, "llms.txt"), "# Produit test\n> Gère des annonces de démonstration.\n\n## Pages principales\n- [Accueil](/): liste des annonces\n");

// R-20..R-23 verte : docs\projet\ complet, versions = lockfile, parité env, ACCES démo
mkdirSync(join(verte, "docs", "projet"), { recursive: true });
writeFileSync(join(verte, "package-lock.json"), JSON.stringify({ packages: { "node_modules/express": { version: "5.1.0" } } }, null, 1).replace('"version": "5.1.0"', '"express"\n   : { "version": "5.1.0" }') + "\n"); // contient "express" et "5.1.0"
writeFileSync(join(verte, "docs", "projet", "TECHNOS.md"),
  '---\nrole: technos\nsources_de_verite: [package-lock.json]\nverifie_le: 2026-08-11\nversions:\n  express: "5.1.0"\n---\n# Technos\n');
writeFileSync(join(verte, "docs", "projet", "COMPOSANTS-OPS.md"),
  '---\nrole: composants\nsources_de_verite: ["ops.mjs etat"]\nverifie_le: 2026-08-11\n---\n# Composants\n');
writeFileSync(join(verte, "docs", "projet", "PARAMETRAGE.md"),
  '---\nrole: parametrage\nsources_de_verite: [.env.example]\nverifie_le: 2026-08-11\nvariables:\n  - PORT\n  - API_TIERCE_CLE\n---\n# Paramétrage\n\n' +
  '## URLs & ports par environnement\n\n' + // R-24 verte : hôtes <appli>-{env}, locale et placeholders hors périmètre
  '| Environnement | Front | Back/API | BDD | Notes |\n|---|---|---|---|---|\n' +
  '| locale | http://localhost:5173 | http://localhost:8080 | localhost:5432 | réel local OK |\n' +
  '| qualif | https://demoapp-qualif.up.railway.app | https://demoapp-api-qualif.up.railway.app | <HOTE_BDD_QUALIF> | staging de la MEP |\n' +
  '| production | https://demoapp-production.up.railway.app | {<URL_API_PROD>} | <HOTE_BDD_PROD> | GO humain |\n');
writeFileSync(join(verte, "docs", "projet", "ACCES-TEST.md"),
  '---\nrole: acces de test\nsources_de_verite: ["seed MODE_DEMO"]\nverifie_le: 2026-08-11\n---\n# Accès\n> comptes de démonstration locale — jamais valides hors MODE_DEMO\n\n| admin | admin@demo.local | demo-admin |\n');
writeFileSync(join(verte, "docs", "projet", "COMMANDES.md"),
  '---\nrole: commandes\nsources_de_verite: [package.json]\nverifie_le: 2026-08-11\n---\n# Commandes\n```bash\nnpm ci\n```\n');
writeFileSync(join(verte, "docs", "projet", "FONCTIONNEL.md"), // TF-0087 : la vue métier fait partie du socle
  '---\nrole: vue fonctionnelle\nsources_de_verite: [forge/EXIGENCES.json]\nverifie_le: 2026-08-11\n---\n# Fonctionnel\nGère des annonces de démonstration pour des visiteurs anonymes.\n');
// TF-0091 : couples source→vue ARCHITECTURE et MODELE-DONNEES ; le modèle s'ancre au
// schéma RÉEL (migrations/001_init.sql contient les deux tables → R-26 verte)
mkdirSync(join(verte, "migrations"), { recursive: true });
writeFileSync(join(verte, "migrations", "001_init.sql"),
  "CREATE TABLE annonces (id uuid PRIMARY KEY, titre text NOT NULL, auteur_id uuid NOT NULL);\nCREATE TABLE utilisateurs (id uuid PRIMARY KEY, email text NOT NULL UNIQUE);\n");
writeFileSync(join(verte, "docs", "projet", "ARCHITECTURE.md"),
  "---\nrole: architecture technique\nsources_de_verite: [docker-compose.yml]\nverifie_le: 2026-08-11\n---\n# Architecture — Test\n\n## Vue d'ensemble\n\nUn front parle à une api qui persiste en bdd.\n\n## Composant : api\n\n- role: règles métier\n- techno: FastAPI\n\n## Composant : bdd\n\n- role: persistance\n- techno: PostgreSQL 16\n\n## Flux\n\n| De | Vers | Protocole | Mode | Donnée portée |\n|---|---|---|---|---|\n| api | bdd | SQL | synchrone | objets métier |\n");
writeFileSync(join(verte, "docs", "projet", "MODELE-DONNEES.md"),
  "---\nrole: modèle de données\nsources_de_verite: [migrations/001_init.sql]\nverifie_le: 2026-08-11\n---\n# Modèle de données — Test\n\n## Table : annonces\n\n- role: un local vacant publié\n- provenance: migrations/001_init.sql\n\n| Colonne | Type | Nullable | Clé |\n|---|---|---|---|\n| id | uuid | non | PK |\n| auteur_id | uuid | non | FK |\n\nLiens sortants :\n\n| Colonne | Cible | Cardinalité |\n|---|---|---|\n| auteur_id | utilisateurs.id | n-1 |\n\n## Table : utilisateurs\n\n- role: un compte\n- provenance: migrations/001_init.sql\n\n| Colonne | Type | Nullable | Clé |\n|---|---|---|---|\n| id | uuid | non | PK |\n");
// les projections sont GÉNÉRÉES par les scripts réels du pilot — jamais écrites à la main
const scripts = join(dirname(fileURLToPath(import.meta.url)), "..", "scripts");
const genere = (script, cible) => sh("node", [join(scripts, script), join(verte, "docs", "projet", cible)], verte);
genere("generer-architecture.mjs", "ARCHITECTURE.md");
genere("generer-modele-donnees.mjs", "MODELE-DONNEES.md");
// TF-0088 : lockfile HORS racine (monorepo) — R-21 doit le trouver et y vérifier left-pad
mkdirSync(join(verte, "frontend"), { recursive: true });
writeFileSync(join(verte, "frontend", "yarn.lock"), 'left-pad@^1.3.0:\n  version "1.3.0"\n');
// TF-0128(a) : bun.lockb rejoint la liste des noms canoniques, retrouvé par le scan seul.
writeFileSync(join(verte, "bun.lockb"), 'esbuild@0.21.0\n');
// TF-0128(c) : manifeste épinglé HORS nom canonique (cas réel Produit-11 : azure/backend-requirements.txt) —
// non trouvable par le scan (nom pas dans NOMS_LOCK), lu uniquement parce que sources_de_verite le déclare.
mkdirSync(join(verte, "azure"), { recursive: true });
writeFileSync(join(verte, "azure", "backend-requirements.txt"), "Flask==3.0.3\n");
writeFileSync(join(verte, "docs", "projet", "TECHNOS.md"),
  '---\nrole: technos\nsources_de_verite: [package-lock.json, frontend/yarn.lock, azure/backend-requirements.txt]\nverifie_le: 2026-08-11\nversions:\n  express: "5.1.0"\n  left-pad: "1.3.0"\n  esbuild: "0.21.0"\n  Flask: "3.0.3"\n---\n# Technos\n');
sh("git", ["init", "-q", "-b", "main"], verte);
sh("git", ["-c", "user.email=t@t", "-c", "user.name=t", "add", "-A"], verte);
sh("git", ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "feat: socle initial du produit"], verte);

check("verte : projet conforme → PASS exit 0", () => {
  const { exit, rapport } = lance(verte);
  if (exit !== 0) throw new Error(`exit ${exit}, findings FAIL : ${JSON.stringify(rapport.findings.filter((f) => f.statut === "FAIL"))}`);
  if (rapport.verdict !== "PASS") throw new Error("verdict != PASS");
  if (!rapport.non_juge.length) throw new Error("non_juge vide — un oracle sans limites déclarées ne juge rien");
});

check("verte : générateurs déterministes (2 exécutions = HTML identiques)", () => {
  const lireHtml = (n) => readFileSync(join(verte, "docs", "projet", n), "utf8");
  const avant = [lireHtml("ARCHITECTURE.html"), lireHtml("MODELE-DONNEES.html")];
  genere("generer-architecture.mjs", "ARCHITECTURE.md");
  genere("generer-modele-donnees.mjs", "MODELE-DONNEES.md");
  const apres = [lireHtml("ARCHITECTURE.html"), lireHtml("MODELE-DONNEES.html")];
  if (avant[0] !== apres[0] || avant[1] !== apres[1]) throw new Error("HTML différents entre deux générations sur la même source");
  if (/https?:\/\/(?!www\.w3\.org)/.test(apres[0] + apres[1])) throw new Error("URL réseau détectée dans une vue générée (A1)");
});

// ---- fixture ROUGE : défauts plantés, chaque règle dure doit se déclencher -------------------
const rouge = mkdtempSync(join(tmpdir(), "conf-rouge-"));
mkdirSync(join(rouge, "output", "Old"), { recursive: true });      // R-1 (input absent), R-3 (docs absent)
writeFileSync(join(rouge, "output", "rapport-final.md"), "x\n");    // R-4 : livrable non daté
writeFileSync(join(rouge, "output", "Produit - Grimoire Néant - 20260811a.md"), "x\n"); // R-25 : type improvisé (daté correct → R-4 muette dessus)
writeFileSync(join(rouge, "robots.txt"), "User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n"); // R-27 : agent IA bloqué SANS décision consignée + llms.txt absent
writeFileSync(join(rouge, "output", "Old", "vieux - 20260101a.py"), "x = 1\n"); // R-6 : code sous Old
writeFileSync(join(rouge, "main - 20260806a.py"), "x = 1\n");       // R-6 : code daté
writeFileSync(join(rouge, "CLAUDE.md"), "# Produit\njuste des commandes pytest\n"); // R-11 : présent SANS routage forge
mkdirSync(join(rouge, "forge"), { recursive: true });
writeFileSync(join(rouge, "forge", "ledger.jsonl"), [
  JSON.stringify({ type: "run_open", ts: "2026-08-09T08:00:00Z" }),               // R-19 : sans versions_forges
  JSON.stringify({ type: "run_open", ts: "2026-08-10T08:00:00Z", versions_forges: { conception: "x" } }), // R-19 : version sans run_precedent
].join("\n") + "\n");

// pas de .gitignore → R-7 (Old non ignoré) + R-10 ; pas de git → R-8 ; pas de README → R-12 ; pas d'env.example → R-13

check("rouge : chaque règle attendue se déclenche, FAIL exit 1", () => {
  const { exit, rapport } = lance(rouge);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const declenchees = new Set(rapport.findings.filter((f) => f.statut === "FAIL").map((f) => f.regle));
  for (const attendue of ["R-1", "R-3", "R-4", "R-6", "R-7", "R-8", "R-10", "R-11", "R-12", "R-13", "R-18", "R-19", "R-25", "R-27"])
    if (!declenchees.has(attendue)) throw new Error(`règle ${attendue} non déclenchée sur la fixture rouge`);
});

check("rouge : les findings sont localisants (jamais « quelque part »)", () => {
  const { rapport } = lance(rouge);
  for (const f of rapport.findings) if (!f.ou || !f.message) throw new Error(`finding ${f.regle} sans localisation ou message`);
});


// ---- fixture ROUGE-DOCS : défauts du socle documentaire R-20..R-23 (fixture dédiée :
// la rouge principale doit garder docs\ absent pour continuer de prouver R-3) ----
const rougeDocs = mkdtempSync(join(tmpdir(), "conf-rouge-docs-"));
// R-20..R-23 rouge : COMPOSANTS-OPS manquant (R-20), version divergente (R-21),
// parité rompue (R-22 — .env.example présent mais VIDE : R-13 reste déclenchée),
// ACCES sans en-tête + faux AKIA (R-23)
mkdirSync(join(rougeDocs, "docs", "projet"), { recursive: true });
writeFileSync(join(rougeDocs, ".env.example"), "# ne jamais renseigner de secret ici\n"); // 0 variable → R-13 toujours FAIL
writeFileSync(join(rougeDocs, "package-lock.json"), '{ "express": { "version": "5.1.0" } }\n');
writeFileSync(join(rougeDocs, "docs", "projet", "TECHNOS.md"),
  '---\nrole: technos\nsources_de_verite: [package-lock.json]\nverifie_le: 2026-08-11\nversions:\n  express: "4.18.0"\n---\n# Technos périmées\n'); // R-21
writeFileSync(join(rougeDocs, "docs", "projet", "PARAMETRAGE.md"),
  '---\nrole: parametrage\nsources_de_verite: [.env.example]\nverifie_le: 2026-08-11\nvariables:\n  - PORT\n---\n# Paramétrage\n\n' + // R-22 : PORT documenté, absent de .env.example
  '## URLs & ports par environnement\n\n' + // R-24 : hôte sans préfixe d'env + « staging » au lieu de qualif
  '| Environnement | Front | Notes |\n|---|---|---|\n' +
  '| staging | https://demoapp-staging.up.railway.app | mauvais vocabulaire |\n' +
  '| production | https://demoapp.up.railway.app | aucun préfixe |\n');
writeFileSync(join(rougeDocs, "docs", "projet", "ACCES-TEST.md"),
  '---\nrole: acces\nsources_de_verite: [seed]\nverifie_le: 2026-08-11\n---\n# Accès\naws_key = "AKIAIOSFODNN7EXAMPLE"\n'); // R-23 : en-tête absent + motif AKIA
writeFileSync(join(rougeDocs, "docs", "projet", "COMMANDES.md"), "# sans frontmatter\n"); // R-20 : frontmatter incomplet
writeFileSync(join(rougeDocs, "docs", "projet", "MODELE-DONNEES.md"), // R-26 : table fantôme — provenance inexistante
  "---\nrole: modèle\nsources_de_verite: [migrations/absente.sql]\nverifie_le: 2026-08-11\n---\n# Modèle\n\n## Table : fantome\n\n- role: n'existe nulle part\n- provenance: migrations/absente.sql\n\n| Colonne | Type | Nullable | Clé |\n|---|---|---|---|\n| id | uuid | non | PK |\n");


check("rouge-docs : R-20..R-24 + R-26 se déclenchent, localisantes", () => {
  const { exit, rapport } = lance(rougeDocs);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const declenchees = new Set(rapport.findings.filter((f) => f.statut === "FAIL").map((f) => f.regle));
  for (const attendue of ["R-20", "R-21", "R-22", "R-23", "R-24", "R-26"])
    if (!declenchees.has(attendue)) throw new Error(`règle ${attendue} non déclenchée sur rouge-docs`);
  const r24 = rapport.findings.filter((f) => f.regle === "R-24" && f.statut === "FAIL");
  if (r24.length !== 2) throw new Error(`R-24 : 2 constats attendus (sans préfixe + staging), ${r24.length} obtenu(s)`);
  for (const f of rapport.findings) if (!f.ou || !f.message) throw new Error(`finding ${f.regle} sans localisation`);
});

// ---- fixture ROUGE-LOCK (TF-0128) : reproduit le cas réel Produit-11 — des versions SONT
// déclarées dans TECHNOS.md mais aucune source ne les confronte : ni dans les 2 niveaux de
// descente autorisés (un décoy à 3 niveaux, hors périmètre, ne compte pas), ni dans un
// dossier exclu (node_modules), ni via sources_de_verite (chemin déclaré introuvable).
// Avant TF-0128 ce cas rendait SANS_OBJET — un silence qui ressemblait à un succès. ----
const rougeLock = mkdtempSync(join(tmpdir(), "conf-rouge-lock-"));
mkdirSync(join(rougeLock, "docs", "projet"), { recursive: true });
mkdirSync(join(rougeLock, "node_modules", "django-decoy"), { recursive: true }); // exclu (b)
writeFileSync(join(rougeLock, "node_modules", "django-decoy", "package-lock.json"), 'django "5.0.6"\n');
mkdirSync(join(rougeLock, "niveau1", "niveau2", "niveau3"), { recursive: true }); // 3 niveaux : hors périmètre (b)
writeFileSync(join(rougeLock, "niveau1", "niveau2", "niveau3", "package-lock.json"), 'django "5.0.6"\n');
writeFileSync(join(rougeLock, "docs", "projet", "TECHNOS.md"),
  '---\nrole: technos\nsources_de_verite: [chemin/qui-n-existe-pas.txt]\nverifie_le: 2026-08-11\nversions:\n  django: "5.0.6"\n---\n# Technos\n');

check("rouge-lock : versions déclarées sans source atteignable → FAIL R-21, jamais SANS_OBJET", () => {
  const { exit, rapport } = lance(rougeLock);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const r21 = rapport.findings.filter((f) => f.regle === "R-21");
  if (r21.length !== 1) throw new Error(`R-21 : 1 constat attendu, ${r21.length} obtenu(s)`);
  if (r21[0].statut !== "FAIL") throw new Error(`R-21 statut ${r21[0].statut} — attendu FAIL (décoys node_modules et 3 niveaux doivent rester invisibles, sources_de_verite introuvable)`);
  if (!r21[0].ou || !r21[0].message) throw new Error("R-21 sans localisation ou message");
});

for (const d of [verte, rouge, rougeDocs, rougeLock]) rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
console.log(`\nSelf-test conformité projet : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
