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
const NL_TEST = String.fromCharCode(10);
const verte = mkdtempSync(join(tmpdir(), "conf-verte-"));
for (const d of ["input", "output", "docs", "forge", "forge/retours", "output/Old"]) mkdirSync(join(verte, d), { recursive: true });
writeFileSync(join(verte, "forge", "retours", "RETOURS-FORGES.md"), "gabarit\n");
writeFileSync(join(verte, "CLAUDE.md"),
  "# Produit\n## Routage forge — obligatoire\nvalider : forge_tests\névoluer : run de version\ndéployer : MEP\n");
writeFileSync(join(verte, "README.md"), "# Produit\nDémarrage : 2 commandes.\n");
writeFileSync(join(verte, ".env.example"), "# ne jamais renseigner de secret ici\nPORT=8000\nAPI_TIERCE_CLE= # à fournir :\n");
writeFileSync(join(verte, ".env"), "PORT=8000\n");
// C1 amendé (TF-0150, 13/08) : old\ versionné — la fixture verte ne l'ignore PLUS.
writeFileSync(join(verte, ".gitignore"), ".env\n.venv/\n__pycache__/\nnode_modules/\ngenerated/\n");
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
// TF-0128(c) : manifeste épinglé HORS nom canonique (cas réel BAV2 : azure/backend-requirements.txt) —
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

// TF-0330 — `forge\QUESTIONS.md` était prescrit par le contrat et jugé par RIEN. Double sens :
// absent, il est DÉCLARÉ et jamais mis en échec (une dette antérieure aux produits ne doit pas
// suspendre leur ouverture) ; présent, il est constaté PASS. Sans la seconde moitié, le
// « SANS_OBJET » aurait pu être rendu quoi qu'il arrive — un silence qui ressemble à un succès.
check("R-18 bis : forge/QUESTIONS.md absent → SANS_OBJET motivé, JAMAIS un FAIL (TF-0330)", () => {
  const { rapport } = lance(verte);
  const f18 = rapport.findings.filter((f) => f.regle === "R-18" && /QUESTIONS/.test(String(f.ou) + " " + String(f.message)));
  if (!f18.length) throw new Error("aucun finding R-18 sur QUESTIONS.md — la prescription resterait jugée par rien");
  if (f18[0].statut !== "SANS_OBJET") throw new Error(`statut ${f18[0].statut} — attendu SANS_OBJET`);
  if (!/prochain run de version/.test(f18[0].message)) throw new Error("le motif ne dit pas quand la dette se solde");
});

check("R-18 bis : forge/QUESTIONS.md présent → constaté PASS (TF-0330)", () => {
  writeFileSync(join(verte, "forge", "QUESTIONS.md"), "# Questions en attente\n\n- aucune\n");
  try {
    const { rapport } = lance(verte);
    const f18 = rapport.findings.filter((f) => f.regle === "R-18" && /QUESTIONS/.test(String(f.ou) + " " + String(f.message)));
    if (!f18.length || f18[0].statut !== "PASS") throw new Error(`statut ${f18[0] && f18[0].statut} — attendu PASS quand le fichier existe`);
  } finally {
    rmSync(join(verte, "forge", "QUESTIONS.md"), { force: true });
  }
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

// TF-0338 — la FRAÎCHEUR des deux projections sœurs. Double sens strict : la fixture verte
// vient d'être générée, donc à parité (PASS ci-dessus) ; ici on touche la SOURCE sans
// régénérer, ce qui est exactement l'état qu'une vue périmée présente — même nom, même
// apparence, autorité du généré sans sa fraîcheur. Sans cette moitié rouge, un R-26 bis
// toujours PASS aurait été indistinguable d'un contrôle absent.
check("R-26 bis : projection périmée (source modifiée sans régénération) → FAIL (TF-0338)", () => {
  const md = join(verte, "docs", "projet", "ARCHITECTURE.md");
  const avant = readFileSync(md, "utf8");
  try {
    writeFileSync(md, avant + NL_TEST + "## Ajout après génération" + NL_TEST);
    const { rapport } = lance(verte);
    const f26 = rapport.findings.filter((f) => f.regle === "R-26" && /ARCHITECTURE\.html/.test(String(f.ou)));
    if (!f26.length) throw new Error("aucun finding R-26 sur ARCHITECTURE.html — la fraîcheur resterait non jugée");
    if (f26[0].statut !== "FAIL") throw new Error(`statut ${f26[0].statut} — une projection périmée doit ÉCHOUER`);
    if (!/PERIMEE/.test(f26[0].message)) throw new Error("le motif ne nomme pas la péremption");
  } finally {
    writeFileSync(md, avant);
  }
});

check("R-26 bis : la même projection, source restaurée → PASS (le FAIL ci-dessus n'est pas systématique)", () => {
  const { rapport } = lance(verte);
  const f26 = rapport.findings.filter((f) => f.regle === "R-26" && /ARCHITECTURE\.html/.test(String(f.ou)));
  if (!f26.length || f26[0].statut !== "PASS") throw new Error(`statut ${f26[0] && f26[0].statut} — attendu PASS à parité rétablie`);
});

// ---- fixture ROUGE : défauts plantés, chaque règle dure doit se déclencher -------------------
const rouge = mkdtempSync(join(tmpdir(), "conf-rouge-"));
mkdirSync(join(rouge, "output", "Old"), { recursive: true });      // R-1 (input absent), R-3 (docs absent)
writeFileSync(join(rouge, "output", "rapport-final.md"), "x\n");    // R-4 : livrable non daté
writeFileSync(join(rouge, "output", "Produit - Grimoire Néant - 20260811a.md"), "x\n"); // R-25 : type improvisé (daté correct → R-4 muette dessus)
writeFileSync(join(rouge, "output", "Produit - Raport Fantome - 20260812a.md"), "x\n"); // R-25 (TF-0265) : typo proche d'un type admis (« Rapport »)
writeFileSync(join(rouge, "output", "Produit - Rapport Fantome - 20260813a.html"), "<html></html>\n"); // R-32 : HTML livré sans journal d'oracles sous forge\oracles\
writeFileSync(join(rouge, "robots.txt"), "User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n"); // R-27 : agent IA bloqué SANS décision consignée + llms.txt absent
writeFileSync(join(rouge, "output", "Old", "vieux - 20260101a.py"), "x = 1\n"); // R-6 : code sous Old
writeFileSync(join(rouge, "main - 20260806a.py"), "x = 1\n");       // R-6 : code daté
writeFileSync(join(rouge, "CLAUDE.md"), "# Produit\njuste des commandes pytest\n"); // R-11 : présent SANS routage forge
mkdirSync(join(rouge, "forge"), { recursive: true });
writeFileSync(join(rouge, "forge", "ledger.jsonl"), [
  JSON.stringify({ type: "run_open", ts: "2026-08-09T08:00:00Z" }),               // R-19 : sans versions_forges
  JSON.stringify({ type: "run_open", ts: "2026-08-10T08:00:00Z", versions_forges: { conception: "x" } }), // R-19 : version sans run_precedent
].join("\n") + "\n");

// R-7 INVERSÉE (TF-0150, 13/08) : old\ doit être VERSIONNÉ — le défaut est désormais un
// old\ gitignoré. Ce .gitignore minimal le plante, ET reste insuffisant pour le socle
// (R-10 : .env/.venv/… absents). Pas de git → R-8 ; pas de README → R-12 ; pas d'env.example → R-13.
writeFileSync(join(rouge, ".gitignore"), "Old/\n");

check("rouge : chaque règle attendue se déclenche, FAIL exit 1", () => {
  const { exit, rapport } = lance(rouge);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const declenchees = new Set(rapport.findings.filter((f) => f.statut === "FAIL").map((f) => f.regle));
  for (const attendue of ["R-1", "R-3", "R-4", "R-6", "R-7", "R-8", "R-10", "R-11", "R-12", "R-13", "R-18", "R-19", "R-25", "R-27", "R-32"])
    if (!declenchees.has(attendue)) throw new Error(`règle ${attendue} non déclenchée sur la fixture rouge`);
});

check("rouge : les findings sont localisants (jamais « quelque part »)", () => {
  const { rapport } = lance(rouge);
  for (const f of rapport.findings) if (!f.ou || !f.message) throw new Error(`finding ${f.regle} sans localisation ou message`);
});

check("rouge : R-25 cite les types admis et propose le plus proche (TF-0265)", () => {
  const { rapport } = lance(rouge);
  const r25 = rapport.findings.filter((f) => f.regle === "R-25" && f.statut === "FAIL");
  const surTypo = r25.find((f) => f.ou.includes("Raport"));
  const surLoin = r25.find((f) => f.ou.includes("Grimoire"));
  if (!surTypo) throw new Error("finding R-25 sur « Raport » introuvable");
  if (!/vouliez-vous dire.*Rapport.*distance 1/.test(surTypo.message))
    throw new Error(`typo proche non suggérée : ${surTypo.message}`);
  if (!surLoin) throw new Error("finding R-25 sur « Grimoire » introuvable");
  if (/vouliez-vous dire/.test(surLoin.message))
    throw new Error(`un type sans proximité réelle ne doit pas suggérer à tort : ${surLoin.message}`);
  for (const f of [surTypo, surLoin])
    if (!f.message.includes("types admis :") || !f.message.includes("Rapport") || !f.message.includes("Étude"))
      throw new Error(`liste des types admis absente ou incomplète : ${f.message}`);
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

// ---- fixture ROUGE-R24 (TF-0267) : le cas réel du 15/08 — l'URL de la ligne QUALIF portait
// un suffixe `-recette-production` (doublon d'environnement) et l'oracle rendait PASS, parce
// qu'il ne jugeait que la PRÉSENCE d'un suffixe connu, jamais son accord avec la ligne.
// Aggravant : le run avait documenté l'écart EN PROSE au lieu de corriger, sans aucun signal.
// Les trois cas sont plantés ensemble : doublon, suffixe discordant, prose d'écart. ----------
const rougeR24 = mkdtempSync(join(tmpdir(), "conf-rouge-r24-"));
mkdirSync(join(rougeR24, "docs", "projet"), { recursive: true });
writeFileSync(join(rougeR24, "docs", "projet", "PARAMETRAGE.md"),
  '---\nrole: parametrage\nsources_de_verite: [.env.example]\nverifie_le: 2026-08-15\nvariables:\n  - PORT\n---\n# Paramétrage\n\n' +
  '## URLs & ports par environnement\n\n' +
  '| Environnement | Front | Notes |\n|---|---|---|\n' +
  '| qualif | https://brasserie-du-lac-recette-production.up.railway.app | doublon service+environnement |\n' +
  '| production | https://brasserie-du-lac-qualif.up.railway.app | suffixe discordant avec sa ligne |\n\n' +
  "> Note : écart connu sur la convention de nommage R-24, à renommer plus tard.\n");

check("rouge-R24 : doublon + suffixe discordant + écart en prose → 3 constats R-24", () => {
  const { exit, rapport } = lance(rougeR24);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const r24 = rapport.findings.filter((f) => f.regle === "R-24" && f.statut === "FAIL");
  if (r24.length !== 3) throw new Error(`R-24 : 3 constats attendus (doublon, discordance, prose), ${r24.length} obtenu(s) : ${JSON.stringify(r24.map((f) => f.message))}`);
  if (!r24.some((f) => /doublon d'environnement/.test(f.message))) throw new Error("le doublon -recette-production n'est pas constaté — c'est le défaut parti en livraison le 15/08");
  if (!r24.some((f) => /suffixe discordant/.test(f.message))) throw new Error("le suffixe -qualif sur la ligne production n'est pas constaté");
  if (!r24.some((f) => /EN PROSE/.test(f.message))) throw new Error("l'écart documenté en prose ne signale rien — c'est l'aggravant du 15/08");
});

// ---- fixture VERTE-R24 (TF-0267) : l'écart s'accepte, mais UNIQUEMENT en champ structuré —
// et le doublon, lui, reste un défaut même déclaré : un hôte qui porte deux environnements se
// contredit, aucune décision ne le rend cohérent. -------------------------------------------
const ecartR24 = mkdtempSync(join(tmpdir(), "conf-ecart-r24-"));
mkdirSync(join(ecartR24, "docs", "projet"), { recursive: true });
const paramEcart = (lignes) =>
  '---\nrole: parametrage\nsources_de_verite: [.env.example]\nverifie_le: 2026-08-15\nvariables:\n  - PORT\n' +
  'ecarts_r24:\n  - url: https://ancienhote-legacy.up.railway.app\n    environnement: qualif\n' +
  '    motif: domaine créé avant la convention, renommage planifié au prochain run de version\n' +
  '    decide_le: 2026-08-15\n  - url: https://brasserie-du-lac-recette-production.up.railway.app\n' +
  '    environnement: qualif\n    motif: tentative d\'excuser un doublon — ne doit JAMAIS être acceptée\n' +
  '    decide_le: 2026-08-15\n---\n# Paramétrage\n\n## URLs & ports par environnement\n\n' +
  '| Environnement | Front | Notes |\n|---|---|---|\n' + lignes;

writeFileSync(join(ecartR24, "docs", "projet", "PARAMETRAGE.md"),
  paramEcart('| qualif | https://ancienhote-legacy.up.railway.app | écart déclaré en frontmatter |\n' +
             '| production | https://demoapp-production.up.railway.app | conforme |\n'));
check("écart-R24 : écart déclaré en champ structuré → plus de FAIL sur cette URL", () => {
  const { rapport } = lance(ecartR24);
  const r24 = rapport.findings.filter((f) => f.regle === "R-24" && f.statut === "FAIL");
  if (r24.length) throw new Error(`écart structuré non pris en compte : ${JSON.stringify(r24.map((f) => f.message))}`);
  const pass24 = rapport.findings.find((f) => f.regle === "R-24" && f.statut === "PASS");
  if (!pass24 || !/écart\(s\) déclaré\(s\) en champ structuré/.test(pass24.message)) throw new Error("l'écart accepté n'est pas dit au verdict — une exemption muette est indistinguable d'une absence de règle");
});

writeFileSync(join(ecartR24, "docs", "projet", "PARAMETRAGE.md"),
  paramEcart('| qualif | https://brasserie-du-lac-recette-production.up.railway.app | doublon pourtant déclaré |\n'));
check("écart-R24 : un DOUBLON déclaré en champ structuré reste un défaut", () => {
  const { exit, rapport } = lance(ecartR24);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1 — un doublon n'est jamais excusable`);
  const r24 = rapport.findings.filter((f) => f.regle === "R-24" && f.statut === "FAIL");
  if (!r24.some((f) => /doublon d'environnement/.test(f.message))) throw new Error("le doublon a été excusé par un écart déclaré — il ne doit jamais l'être");
});

// Un écart INCOMPLET (motif ou date manquants) n'est pas un écart : la déclaration doit être
// opposable, pas décorative.
writeFileSync(join(ecartR24, "docs", "projet", "PARAMETRAGE.md"),
  '---\nrole: parametrage\nsources_de_verite: [.env.example]\nverifie_le: 2026-08-15\nvariables:\n  - PORT\n' +
  'ecarts_r24:\n  - url: https://ancienhote-legacy.up.railway.app\n    environnement: qualif\n---\n' +
  '# Paramétrage\n\n## URLs & ports par environnement\n\n| Environnement | Front | Notes |\n|---|---|---|\n' +
  '| qualif | https://ancienhote-legacy.up.railway.app | écart déclaré sans motif ni date |\n');
check("écart-R24 : un écart sans motif ni date n'excuse rien", () => {
  const { exit, rapport } = lance(ecartR24);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1 — un écart incomplet n'est pas un écart`);
  if (!rapport.findings.some((f) => f.regle === "R-24" && f.statut === "FAIL")) throw new Error("l'écart incomplet a été accepté");
});

// ---- fixture ROUGE-LOCK (TF-0128) : reproduit le cas réel BAV2 — des versions SONT
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

// ---- fixtures R-2 LOCALISATION (TF-0319, verdict O3 du 17/08) : la frontière « livrable pour
// humain » se DÉCLARE. Deux canaux de marquage (frontmatter du document, `livrable_attendu` du
// ledger) et un invariant non négociable : ce qui n'est PAS marqué n'est JAMAIS jugé — c'est le
// verrou SANS_OBJET D-01 d'`oracle-conventions.mjs` (« distinguer les deux suppose de lire le
// CONTENU du dossier, pas son chemin ») que l'option O2 rouvrait au prix de faux positifs. -----
const MARQUE_HUMAIN = "---\nrole: rapport de campagne\ndestinataire: humain\nverifie_le: 2026-08-17\n---\n\n# Rapport\n";
const SANS_MARQUE = "---\nrole: doctrine du produit\nverifie_le: 2026-08-17\n---\n\n# Doctrine\n";
const ecrireDans = (base, chemin, contenu) => {
  const abs = join(base, ...chemin.split("/"));
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, contenu);
};

const rougeR2 = mkdtempSync(join(tmpdir(), "conf-rouge-r2-"));
// (1) marqué sous forge\etapes\ — le cas exact que R-2 laissait PASSER : « un rapport laissé
//     sous forge\etapes\ laisse R-2 en PASS » (non-recouvrement de l'étude, l.56)
ecrireDans(rougeR2, "forge/etapes/RAPPORT-REVUE.md", MARQUE_HUMAIN);
// (2) marqué en .html à la racine — l'en-tête tient lieu de frontmatter
ecrireDans(rougeR2, "Digit-AI - Rapport Racine - 20260817a.html",
  '<!DOCTYPE html>\n<html lang="fr"><head><meta name="destinataire" content="humain"><title>x</title></head><body>x</body></html>\n');
// (3) le ledger ANNONCE un livrable hors output\ (canal `livrable_attendu`, déjà en service)
ecrireDans(rougeR2, "forge/ledger.jsonl",
  JSON.stringify({ type: "run_open", ts: "2026-08-17T08:00:00Z", versions_forges: { "digit-ai-factory": "e0ffc25" }, livrable_attendu: "forge/etapes/RAPPORT-REVUE.md" }) + "\n");
// PIÈGES DE FAUX POSITIFS — tous doivent rester MUETS : un livrable DATÉ mais non marqué
// (c'est le contrôle par motif de nom, refusé en connaissance de cause), et quatre marqués en
// zones hors jugement par motif déclaré (entrant, porteurs de FORME, archive gelée).
ecrireDans(rougeR2, "Digit-AI - Rapport Date Non Marque - 20260804a.md", SANS_MARQUE);
ecrireDans(rougeR2, "input/Client - Rapport Entrant - 20260817a.md", MARQUE_HUMAIN);
ecrireDans(rougeR2, "gabarits/RESTITUTION.md", MARQUE_HUMAIN);
ecrireDans(rougeR2, "output/Old/Digit-AI - Rapport Ancien - 20260801a.md", MARQUE_HUMAIN);
ecrireDans(rougeR2, "tests/fixtures/violation-voulue.md", MARQUE_HUMAIN);

check("rouge-R2 : 3 constats de localisation (frontmatter .md, .html, livrable_attendu)", () => {
  const { exit, rapport } = lance(rougeR2);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const r2 = rapport.findings.filter((f) => f.regle === "R-2" && f.statut === "FAIL");
  if (r2.length !== 3) throw new Error(`3 constats R-2 attendus, ${r2.length} obtenu(s) : ${JSON.stringify(r2.map((f) => f.ou))}`);
  const ou = r2.map((f) => f.ou).join(" | ");
  for (const attendu of ["forge/etapes/RAPPORT-REVUE.md", "Digit-AI - Rapport Racine - 20260817a.html", "forge/ledger.jsonl → forge/etapes/RAPPORT-REVUE.md"])
    if (!ou.includes(attendu)) throw new Error(`« ${attendu} » non localisé : ${ou}`);
  // le constat doit dire les TROIS issues, dont celle de la règle 16 (marquer la copie remise)
  if (!r2.every((f) => /output\\/.test(f.message) && /D-06/.test(f.message) && /règle 16/.test(f.message)))
    throw new Error("un constat qui ne dit pas quoi faire renvoie le lecteur à la devinette");
});

check("rouge-R2 : ce qui n'est PAS marqué n'est JAMAIS jugé (verrou D-01, zéro faux positif)", () => {
  const { rapport } = lance(rougeR2);
  const r2 = rapport.findings.filter((f) => f.regle === "R-2").map((f) => `${f.ou} ${f.message}`).join(" | ");
  for (const piege of ["Date Non Marque", "input/", "gabarits/", "Old/", "fixtures/"])
    if (r2.includes(piege)) throw new Error(`« ${piege} » jugé — c'est le faux positif que l'option O2 rouvrait et qu'oracle-conventions avait refusé (SANS_OBJET D-01)`);
});

// VERTE-R2 : les deux canaux de marquage, rangés — `output\` (règle 2) et `docs\` (D-06).
const verteR2 = mkdtempSync(join(tmpdir(), "conf-verte-r2-"));
ecrireDans(verteR2, "output/03-etudes/20260817-etude-rangement.md", MARQUE_HUMAIN);
ecrireDans(verteR2, "docs/projet/NOTE-NORMATIVE.md", MARQUE_HUMAIN);
ecrireDans(verteR2, "forge/ledger.jsonl",
  JSON.stringify({ type: "run_open", ts: "2026-08-17T08:00:00Z", versions_forges: { "digit-ai-factory": "e0ffc25" }, livrable_attendu: "output/03-etudes/20260817-etude-rangement.md" }) + "\n");
check("verte-R2 : livrables marqués rangés → PASS R-2 qui DIT combien il en a vu", () => {
  const { rapport } = lance(verteR2);
  const r2 = rapport.findings.filter((f) => f.regle === "R-2");
  if (r2.some((f) => f.statut === "FAIL")) throw new Error(`FAIL inattendu : ${JSON.stringify(r2.filter((f) => f.statut === "FAIL").map((f) => f.ou))}`);
  const pass = r2.find((f) => f.statut === "PASS" && /artefact\(s\) marqué\(s\) destinataire-humain/.test(f.message));
  if (!pass) throw new Error("le verdict ne compte pas les artefacts marqués — un contrôle muet est indistinguable d'une absence de règle");
  if (!/^3 /.test(pass.message)) throw new Error(`3 artefacts marqués attendus (md output, md docs, livrable_attendu), message : ${pass.message}`);
});

// ---- fixtures R-19 FORME DES CLÉS (TF-0320, verdict O1 du 17/08) : la forme canonique de
// `versions_forges` est le nom de dépôt COMPLET (CONTRAT-INTERFACE.md §3). Mesuré sur pièces :
// Approval2 portait 5 clés courtes, SCC_ALX 14 complètes, les DEUX en PASS — aucun diff de
// versions n'était calculable. RÉTROACTIVITÉ : l'existant ne se réécrit pas, seuls les run_open
// du 2026-08-17 et après sont jugés sur la forme (`REGLES-PROJET.md` l.13). ------------------
const rougeR19 = mkdtempSync(join(tmpdir(), "conf-rouge-r19-"));
ecrireDans(rougeR19, "forge/ledger.jsonl", [
  // ANTÉRIORITÉ : 5 clés courtes, mais run_open du 11/08 — jamais réécrit, jamais jugé sur la forme
  JSON.stringify({ type: "run_open", ts: "2026-08-11T08:00:00Z", versions_forges: { conception: "aabc448", design: "d74c957", development: "c177c6a", tests: "18c3947", agents: "c650ae5" } }),
  // JUGÉ : le run_open d'après la doctrine, avec les mêmes 5 clés courtes → 5 constats
  JSON.stringify({ type: "run_open", ts: "2026-08-18T08:00:00Z", run_precedent: "run-20260811", versions_forges: { conception: "aabc448", design: "d74c957", development: "c177c6a", tests: "18c3947", agents: "c650ae5" } }),
].join("\n") + "\n");
check("rouge-R19 : 5 clés courtes après le 17/08 → 5 constats nommant la clé et sa forme attendue", () => {
  const { exit, rapport } = lance(rougeR19);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const formes = rapport.findings.filter((f) => f.regle === "R-19" && f.statut === "FAIL" && /nom court/.test(f.message));
  if (formes.length !== 5) throw new Error(`5 constats de forme attendus, ${formes.length} obtenu(s) : ${JSON.stringify(formes.map((f) => f.message))}`);
  const msgs = formes.map((f) => f.message).join(" | ");
  for (const cle of ["conception", "design", "development", "tests", "agents"]) {
    if (!msgs.includes(`clé « ${cle} »`)) throw new Error(`la clé « ${cle} » n'est pas nommée`);
    if (!msgs.includes(`« digit-ai-forge-${cle} »`)) throw new Error(`la forme attendue « digit-ai-forge-${cle} » n'est pas donnée`);
  }
  // rétroactivité : le run_open du 11/08 porte les MÊMES clés courtes et ne doit produire aucun constat
  if (formes.some((f) => f.ou.includes("#1"))) throw new Error("le run_open antérieur au 17/08 a été jugé sur la forme — l'existant historique ne se réécrit pas");
});

// VERTE-R19 : les 14 noms de dépôt complets, sur un run_open postérieur à la doctrine.
const verteR19 = mkdtempSync(join(tmpdir(), "conf-verte-r19-"));
const CLES_14 = ["pilot", "conception", "design", "development", "tests", "agents", "organization",
  "data", "ops", "observability", "audit", "seo", "agents-security", "websec"];
ecrireDans(verteR19, "forge/ledger.jsonl",
  JSON.stringify({ type: "run_open", ts: "2026-08-18T08:00:00Z",
    versions_forges: Object.fromEntries(CLES_14.map((c, i) => [`digit-ai-forge-${c}`, `sha${String(i).padStart(4, "0")}`])) }) + "\n");
check("verte-R19 : 14 clés au nom de dépôt complet → PASS, et le verdict le DIT", () => {
  const { rapport } = lance(verteR19);
  const r19 = rapport.findings.filter((f) => f.regle === "R-19");
  if (r19.some((f) => f.statut === "FAIL")) throw new Error(`FAIL inattendu : ${JSON.stringify(r19.filter((f) => f.statut === "FAIL").map((f) => f.message))}`);
  if (!r19.some((f) => f.statut === "PASS" && /au nom de dépôt complet/.test(f.message)))
    throw new Error("la forme tenue n'est pas dite au verdict — une exigence muette est indistinguable d'une absence de règle");
});

// ---- fixtures R-20 TODO-PRODUIT (TF-0318, verdict O3 du 17/08 — volet LECTURE seul) : le
// couple « source MD versionnée → projection HTML générée », au patron déjà tenu par R-20 pour
// ARCHITECTURE et MODELE-DONNEES. Trois états à prouver, dont l'ABSENCE : les produits nés avant
// le 17/08 n'auront la page qu'à leur prochain run de version, et un oracle ne doit pas lire
// cette dette déclarée comme un défaut de produit. -------------------------------------------
const gabaritTdp = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "gabarits", "docs-projet", "TODO-PRODUIT.md"), "utf8");
const genererTdp = (base) => sh("node", [join(dirname(fileURLToPath(import.meta.url)), "..", "todo", "generer-todo-produit.mjs"),
  join(base, "docs", "projet", "TODO-PRODUIT.md")], base);

// (a) SOURCE ABSENTE → SANS_OBJET motivé, jamais FAIL (la dette déclarée de l'étude).
check("R-20/TODO-PRODUIT : source absente → SANS_OBJET motivé, jamais un FAIL de produit", () => {
  const { rapport } = lance(rougeDocs); // fixture sans TODO-PRODUIT.md
  const f = rapport.findings.find((x) => x.regle === "R-20" && /TODO-PRODUIT\.md absent/.test(x.message));
  if (!f) throw new Error("aucun finding sur l'absence de TODO-PRODUIT.md — un contrôle qui ne se prononce pas n'existe pas");
  if (f.statut !== "SANS_OBJET") throw new Error(`statut ${f.statut} — attendu SANS_OBJET : la dette est déclarée, pas imputée au produit`);
  if (!/prochain run de version/.test(f.message)) throw new Error("le motif du SANS_OBJET ne dit pas quand la dette se solde");
});

// (b) VERTE : source + projection régénérée par le VRAI générateur → parité tenue.
const verteTdp = mkdtempSync(join(tmpdir(), "conf-verte-tdp-"));
ecrireDans(verteTdp, "docs/projet/TODO-PRODUIT.md", gabaritTdp);
genererTdp(verteTdp);
check("verte-TODO-PRODUIT : couple source→projection à parité (sceau), frontmatter machine complet", () => {
  const { rapport } = lance(verteTdp);
  const f = rapport.findings.filter((x) => x.regle === "R-20" && /TODO-PRODUIT/.test(x.ou || "") );
  const pass = f.find((x) => x.statut === "PASS" && /à parité \(sceau /.test(x.message));
  if (!pass) throw new Error(`parité non constatée : ${JSON.stringify(f.map((x) => [x.statut, x.message]))}`);
  // Le gabarit porte `destinataire: humain` et vit sous docs\ : zone de dépôt conforme (D-06),
  // donc la LOCALISATION de R-2 ne doit rien dire dessus — les deux règles neuves du 17/08 ne se
  // contredisent pas. (Le FAIL R-2 « dossier output\ absent » de cette fixture minimale, lui,
  // reste attendu : c'est la règle de PRÉSENCE, une autre question.)
  const loc = rapport.findings.filter((x) => x.regle === "R-2" && x.statut === "FAIL" && /livrable marqué pour l'humain/.test(x.message));
  if (loc.length) throw new Error(`R-2 accuse un document marqué qui vit pourtant dans docs\\ : ${JSON.stringify(loc.map((x) => x.ou))}`);
  const paireMarquee = rapport.findings.find((x) => x.regle === "R-2" && x.statut === "PASS" && /artefact\(s\) marqué\(s\)/.test(x.message));
  if (!paireMarquee || !/^2 /.test(paireMarquee.message))
    throw new Error(`la source ET sa projection doivent être vues marquées et conformes (2 attendus) : ${paireMarquee?.message}`);
});

check("verte-TODO-PRODUIT : générateur déterministe (2 exécutions = HTML identique)", () => {
  const lu = () => readFileSync(join(verteTdp, "docs", "projet", "TODO-PRODUIT.html"), "utf8");
  const avant = lu();
  genererTdp(verteTdp);
  const apres = lu();
  if (avant !== apres) throw new Error("HTML différent entre deux générations sur la même source");
  if (/https?:\/\/(?!www\.w3\.org)/.test(apres)) throw new Error("URL réseau détectée dans une vue générée (A1)");
  // R-30 : clair par défaut STRICT + bascule CÂBLÉE (une bascule sans effet est un défaut, loi 1)
  if (/prefers-color-scheme:\s*dark/.test(apres)) throw new Error("auto-sombre hérité de l'OS — retiré par l'amendement TF-0158");
  for (const attendu of ['id="theme-toggle"', "localStorage.setItem('digitai-theme'", "addEventListener('click'", 'data-theme="dark"'])
    if (!apres.includes(attendu)) throw new Error(`bascule R-30 non câblée : « ${attendu} » absent`);
  // RV-9 (14/08) : `color-scheme` FIGÉ à « light dark » faisait peindre au navigateur ses propres
  // surfaces en sombre sur un corps clair. Il doit SUIVRE le thème effectif — donc porté par les
  // deux blocs de tokens, jamais figé dans un <meta>.
  // (les commentaires HTML sont retirés d'abord : la page DOCUMENTE l'anti-pattern, elle ne le porte pas)
  if (/<meta\s+name="color-scheme"/i.test(apres.replace(/<!--[\s\S]*?-->/g, "")))
    throw new Error("color-scheme figé dans un <meta> — défaut relevé par RV-9 : il doit suivre le thème effectif");
  if (!/:root\{color-scheme:light/.test(apres) || !/:root\[data-theme="dark"\]\{color-scheme:dark/.test(apres))
    throw new Error("color-scheme absent des blocs de tokens — les surfaces du navigateur ne suivraient pas le thème (RV-9)");
  // volet ÉCRITURE refusé par le verdict O3 : la page ne doit porter AUCUNE surface de saisie
  if (/<(input|textarea|form|button[^>]*type="submit")/i.test(apres.replace(/<button id="theme-toggle"[\s\S]*?<\/button>/, "")))
    throw new Error("surface de saisie dans une page déclarée en lecture seule — la moitié ÉCRITURE est refusée en l'état (LLM01)");
});

// (c) ROUGE : la source a changé, la projection n'a pas été régénérée → sceau périmé.
const rougeTdp = mkdtempSync(join(tmpdir(), "conf-rouge-tdp-"));
ecrireDans(rougeTdp, "docs/projet/TODO-PRODUIT.md", gabaritTdp);
genererTdp(rougeTdp);
writeFileSync(join(rougeTdp, "docs", "projet", "TODO-PRODUIT.md"),
  gabaritTdp.replace("verifie_le: {AAAA-MM-JJ}", "verifie_le: 2026-08-18")); // source modifiée, vue NON régénérée
check("rouge-TODO-PRODUIT : source modifiée sans régénération → projection PÉRIMÉE dénoncée", () => {
  const { exit, rapport } = lance(rougeTdp);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1 — une vue périmée qui ressemble à une vue fraîche est le mensonge de TF-0151`);
  const f = rapport.findings.find((x) => x.regle === "R-20" && /PÉRIMÉE/.test(x.message));
  if (!f) throw new Error(`péremption non détectée : ${JSON.stringify(rapport.findings.filter((x) => x.regle === "R-20").map((x) => x.message))}`);
  if (!/generer-todo-produit\.mjs/.test(f.message)) throw new Error("le constat ne dit pas quelle commande rejouer");
});

// (d) ROUGE : projection absente alors que la source existe → couple rompu.
const rougeTdpNu = mkdtempSync(join(tmpdir(), "conf-rouge-tdp-nu-"));
ecrireDans(rougeTdpNu, "docs/projet/TODO-PRODUIT.md", gabaritTdp);
check("rouge-TODO-PRODUIT : source sans projection → couple rompu, constat localisant", () => {
  const { exit, rapport } = lance(rougeTdpNu);
  if (exit !== 1) throw new Error(`exit ${exit} attendu 1`);
  const f = rapport.findings.find((x) => x.regle === "R-20" && /projection générée manquante alors que sa source existe/.test(x.message));
  if (!f || f.ou !== "docs\\projet\\TODO-PRODUIT.html") throw new Error(`constat absent ou non localisant : ${JSON.stringify(f)}`);
});

for (const d of [verte, rouge, rougeDocs, rougeLock, rougeR24, ecartR24, rougeR2, verteR2, rougeR19, verteR19, verteTdp, rougeTdp, rougeTdpNu]) rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
console.log(`\nSelf-test conformité projet : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
