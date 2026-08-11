#!/usr/bin/env node
/**
 * oracle-conformite-projet.mjs — vérifie qu'un projet produit respecte REGLES-PROJET.md
 * (26 règles — R-1..R-19 du 06-10/08, R-20..R-23 socle documentaire du 11/08 TF-0082,
 * R-24 URLs d'environnement du 11/08 TF-0090, R-25 types au registre du 11/08 TF-0084,
 * R-26 modèle de données ancré au schéma réel du 11/08 TF-0091 — socle à 8 fichiers
 * + projections HTML générées). Node pur, zéro dépendance, lecture seule (le registre
 * des types d'organization est LU, jamais écrit).
 *
 * Usage : node oracle-conformite-projet.mjs <racine-du-projet>
 * Sortie : JSON sur stdout — { oracle, version, cible, verdict, findings[], non_juge[] }
 *          finding = { regle: "R-<n>", statut: PASS|FAIL|SANS_OBJET, ou, message }
 * Exit : 0 = PASS · 1 = FAIL · 2 = l'oracle n'a pas pu juger.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename, relative, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cible = process.argv[2];
if (!cible || !existsSync(cible)) {
  console.log(JSON.stringify({ oracle: "oracle-conformite-projet", verdict: "ERREUR", message: "racine de projet introuvable" }));
  process.exit(2);
}

const findings = [];
const ok = (regle, ou, message) => findings.push({ regle, statut: "PASS", ou, message });
const ko = (regle, ou, message) => findings.push({ regle, statut: "FAIL", ou, message });
const so = (regle, message) => findings.push({ regle, statut: "SANS_OBJET", ou: "-", message });

const p = (...seg) => join(cible, ...seg);
const git = (...args) => spawnSync("git", ["-C", cible, ...args], { encoding: "utf8" });
const aGit = existsSync(p(".git"));

const MOTIF_DATE = / - \d{8}[a-z]?\.[\w.]+$/;
const EXT_CODE = new Set(["py", "js", "mjs", "cjs", "ts", "tsx", "jsx", "go", "rs", "java", "rb", "php", "cs"]);
const EXT_LIVRABLE = new Set(["md", "pdf", "html", "pptx", "docx", "xlsx", "zip", "png", "svg"]);
const EXCLUS_NOMMAGE = new Set(["README.md", "CLAUDE.md", "index.md"]);
const IGNORES_PARCOURS = new Set([".git", ".venv", "node_modules", "__pycache__", "generated", "dist", ".claude"]);

function* fichiers(dossier, prof = 0) {
  if (prof > 6 || !existsSync(dossier)) return;
  for (const e of readdirSync(dossier)) {
    if (IGNORES_PARCOURS.has(e)) continue;
    const chemin = join(dossier, e);
    const st = statSync(chemin);
    if (st.isDirectory()) yield* fichiers(chemin, prof + 1);
    else yield chemin;
  }
}
const rel = (f) => relative(cible, f).replaceAll("\\", "/");

// R-1..R-3 — structure
for (const [n, d] of [["R-1", "input"], ["R-2", "output"], ["R-3", "docs"]])
  existsSync(p(d)) ? ok(n, d + "/", "présent") : ko(n, d + "/", `dossier ${d}\\ absent de la racine`);

// R-18 — canal de retours forges (mandat du 06/08 : chaque projet prépare ses lots de retours)
existsSync(p("forge", "retours"))
  ? ok("R-18", "forge/retours/", "canal de retours présent")
  : ko("R-18", "forge/retours/", "dossier forge\\retours\\ absent — les retours vers les forges n'ont pas de canal");

// R-4 — nommage daté des livrables (output/ et docs/ ; input/ non jugé : entrants humains)
let r4 = true;
for (const d of ["output", "docs"]) {
  for (const f of fichiers(p(d))) {
    const nom = basename(f);
    const ext = nom.split(".").pop().toLowerCase();
    if (EXCLUS_NOMMAGE.has(nom) || !EXT_LIVRABLE.has(ext) || /\/Old\//i.test("/" + rel(f))) continue;
    if (/^docs[\/]projet[\/]/.test(rel(f))) continue; // socle documentaire R-20 : documents vivants à noms fixes, pas des livrables datés
    if (!MOTIF_DATE.test(nom)) { ko("R-4", rel(f), "livrable sans nommage « <Marque> - <Objet> - AAAAMMJJ<indice> »"); r4 = false; }
  }
}
if (r4) ok("R-4", "output/, docs/", "livrables au nommage daté (ou aucun livrable)");

// R-25 — le <Type> de tout livrable daté figure au registre des types (D-04 organization,
// encodé le 11/08 TF-0084). Le type est le premier mot du 2e segment ; comparaison
// insensible à la casse et aux accents (contrat du registre). Registre lu chez la forge
// organization (dépôt frère du pilot, $FORGE_ROOT sinon parent) — lecture seule.
const normeType = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const racineForges = process.env.FORGE_ROOT || join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const registreTypes = join(racineForges, "digit-ai-forge-organization", "registre-types.json");
if (!existsSync(registreTypes)) so("R-25", "registre-types.json d'organization introuvable — types non jugeables (poste non équipé ? node bootstrap.mjs)");
else {
  let admis;
  try {
    const reg = JSON.parse(readFileSync(registreTypes, "utf8"));
    admis = new Set(reg.types.flatMap((t) => [t.type, ...(t.alias || [])]).map(normeType));
  } catch { admis = null; }
  if (!admis) so("R-25", "registre-types.json illisible — types non jugeables");
  else {
    let r25 = true, vus = 0;
    for (const d of ["output", "docs"]) {
      for (const f of fichiers(p(d))) {
        const nom = basename(f);
        const ext = nom.split(".").pop().toLowerCase();
        if (EXCLUS_NOMMAGE.has(nom) || !EXT_LIVRABLE.has(ext) || /\/Old\//i.test("/" + rel(f))) continue;
        if (/^docs[\/]projet[\/]/.test(rel(f)) || !MOTIF_DATE.test(nom)) continue;
        const segs = nom.split(" - ");
        if (segs.length < 3) continue; // pas de segment type — déjà R-4
        vus++;
        const type = segs[1].split(" ")[0];
        if (!admis.has(normeType(type))) {
          ko("R-25", rel(f), `type « ${type} » absent du registre des types — un type nouveau s'ajoute au registre d'organization (commit motivé, D-04), jamais improvisé dans un nom`); r25 = false;
        }
      }
    }
    if (r25) vus ? ok("R-25", "output/, docs/", `${vus} livrable(s) daté(s) au type admis`) : so("R-25", "aucun livrable daté à typer");
  }
}

// R-6 — code : jamais de copie datée, jamais dans Old\
let r6 = true;
for (const f of fichiers(cible)) {
  const nom = basename(f);
  const ext = nom.split(".").pop().toLowerCase();
  if (!EXT_CODE.has(ext)) continue;
  if (MOTIF_DATE.test(nom)) { ko("R-6", rel(f), "fichier de code avec nommage daté — git est le magasin de versions du code"); r6 = false; }
  if (/(^|\/)[Oo]ld\//.test("/" + rel(f))) { ko("R-6", rel(f), "fichier de code dans un dossier Old\\ — interdit (C1)"); r6 = false; }
}
if (r6) ok("R-6", "*", "aucune copie datée de code, aucun code sous Old\\");

// R-7 — Old\ jamais versionné (C1)
const gitignore = existsSync(p(".gitignore")) ? readFileSync(p(".gitignore"), "utf8") : "";
const oldExiste = [...fichiers(cible)].some((f) => /(^|\/)[Oo]ld\//.test("/" + rel(f)));
if (!oldExiste) so("R-7", "aucun dossier Old\\ dans le projet");
else if (/^[Oo]ld\/$/m.test(gitignore) || /(^|\n)\*{0,2}\/?[Oo]ld\/(\n|$)/.test(gitignore)) ok("R-7", ".gitignore", "Old\\ présent et ignoré par git (C1)");
else ko("R-7", ".gitignore", "des dossiers Old\\ existent mais ne sont pas ignorés par git (décision C1 : Old pas dans git)");

// R-8 — git initialisé (C2)
aGit ? ok("R-8", ".git/", "dépôt git présent") : ko("R-8", ".git/", "pas de dépôt git — git init + commit initial exigés dès l'ouverture du run (C2)");

// R-9 — Conventional Commits (20 derniers, hors merge)
if (!aGit) so("R-9", "pas de git");
else {
  const log = git("log", "-20", "--format=%s");
  if (log.status !== 0 || !log.stdout.trim()) so("R-9", "aucun commit à juger");
  else {
    const mauvais = log.stdout.trim().split("\n").filter((s) => !/^Merge/.test(s) && !/^(feat|fix|docs|chore|refactor|test|perf|build|ci|style|revert)(\(.+\))?!?:/.test(s));
    mauvais.length ? ko("R-9", "git log", `${mauvais.length} commit(s) hors Conventional Commits, ex. « ${mauvais[0].slice(0, 60)} »`) : ok("R-9", "git log", "20 derniers commits conformes");
  }
}

// R-10 — .gitignore socle
if (!gitignore) ko("R-10", ".gitignore", "absent");
else if (!/^\.env$/m.test(gitignore)) ko("R-10", ".gitignore", "n'ignore pas .env");
else ok("R-10", ".gitignore", "présent, .env ignoré");

// R-11 — CLAUDE.md présent ET porteur de la table de routage forge (étendu le 06/08 :
// sans elle, les sessions ad hoc contournent les forges — constaté sur le correctif v0.2.0)
if (!existsSync(p("CLAUDE.md"))) ko("R-11", "CLAUDE.md", "absent — chaque produit naît avec son CLAUDE.md (gabarit pilot)");
else {
  const claude = readFileSync(p("CLAUDE.md"), "utf8");
  const manques = [];
  if (!/##\s*Routage forge/i.test(claude)) manques.push("section « Routage forge »");
  if (!/forge_tests/.test(claude)) manques.push("route tests (forge_tests)");
  if (!/run de version/i.test(claude)) manques.push("route évolution (run de version)");
  if (!/MEP/.test(claude)) manques.push("route déploiement (MEP)");
  manques.length
    ? ko("R-11", "CLAUDE.md", `présent mais sans routage forge complet — manque : ${manques.join(", ")}`)
    : ok("R-11", "CLAUDE.md", "présent, table de routage forge complète");
}
existsSync(p("README.md")) ? ok("R-12", "README.md", "présent") : ko("R-12", "README.md", "absent");

// R-13 — .env.example exhaustif (présence + ≥ 1 variable)
const envEx = [".env.example", ".env.exemple"].map((n) => p(n)).find((f) => existsSync(f));
if (!envEx) ko("R-13", ".env.example", "absent — toutes les variables attendues (applicatives + infra) doivent y être déclarées");
else if (!/^[A-Z][A-Z0-9_]*=/m.test(readFileSync(envEx, "utf8"))) ko("R-13", basename(envEx), "présent mais aucune variable déclarée");
else ok("R-13", basename(envEx), "présent avec variables déclarées");

// R-14 — .env jamais versionné
if (!aGit) so("R-14", "pas de git");
else {
  const suivi = git("ls-files", ".env");
  suivi.stdout.trim() ? ko("R-14", ".env", "VERSIONNÉ dans git — interdit, à retirer de l'index") : ok("R-14", ".env", "non versionné");
}

// R-16 — dossier de MEP copié dans output\ au nommage daté
if (!existsSync(p("forge", "DOSSIER-MEP.md"))) so("R-16", "pas de DOSSIER-MEP.md (étape MEP non atteinte)");
else {
  const copie = existsSync(p("output")) && readdirSync(p("output")).some((n) => /MEP/i.test(n) && MOTIF_DATE.test(n));
  copie ? ok("R-16", "output/", "dossier de MEP copié au nommage daté") : ko("R-16", "output/", "DOSSIER-MEP.md existe mais aucune copie datée dans output\\");
}

// R-17 — journaux d'oracles versionnés dans forge\ (C4)
const journaux = [...fichiers(p("forge"))].filter((f) => /\.oracles.*\.json/.test(basename(f)));
if (!journaux.length) so("R-17", "aucun journal d'oracle sous forge\\");
else if (!aGit) so("R-17", "pas de git");
else {
  const ignore = git("check-ignore", rel(journaux[0]));
  ignore.stdout.trim() ? ko("R-17", rel(journaux[0]), "journaux d'oracles ignorés par git — décision C4 : versionnés (preuves)") : ok("R-17", "forge/", `${journaux.length} journal(aux) d'oracles versionnables`);
}

// R-19 — versions_forges consignées au ledger (contrat §3, TF-0035) : chaque run_open porte
// versions_forges (objet non vide — avec quelles forges le produit a été construit) ; tout
// run_open ultérieur au premier (run de version) porte run_precedent (chaînage des runs).
const ledgerF = p("forge", "ledger.jsonl");
if (!existsSync(ledgerF)) so("R-19", "pas de forge\\ledger.jsonl (aucun run ouvert)");
else {
  const opens = readFileSync(ledgerF, "utf8").split("\n").filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter((e) => e && (e.type === "run_open" || e.ev === "run_open"));
  if (!opens.length) ko("R-19", "forge/ledger.jsonl", "ledger présent mais aucun run_open — le ledger s'ouvre par run_open");
  else {
    let r19 = true;
    opens.forEach((o, i) => {
      const v = o.versions_forges;
      if (!v || typeof v !== "object" || !Object.keys(v).length) {
        ko("R-19", `forge/ledger.jsonl (run_open #${i + 1})`, "run_open sans versions_forges — consigner la version de chaque forge (contrat §3, fraîcheur)"); r19 = false;
      }
      if (i > 0 && !o.run_precedent) {
        ko("R-19", `forge/ledger.jsonl (run_open #${i + 1})`, "run de version sans run_precedent — les runs se chaînent"); r19 = false;
      }
    });
    if (r19) ok("R-19", "forge/ledger.jsonl", `${opens.length} run_open avec versions_forges${opens.length > 1 ? " et chaînage run_precedent" : ""}`);
  }
}


// ---- D bis · Socle documentaire docs\projet\ (R-20..R-23 — TF-0082, 11/08) ----
const dp = p("docs", "projet");
const FICHIERS_DP = ["TECHNOS.md", "COMPOSANTS-OPS.md", "PARAMETRAGE.md", "ACCES-TEST.md", "COMMANDES.md", "FONCTIONNEL.md", "ARCHITECTURE.md", "MODELE-DONNEES.md"]; // FONCTIONNEL : TF-0087 · ARCHITECTURE + MODELE-DONNEES : TF-0091 (sources MD des vues générées)
const PROJECTIONS_DP = ["ARCHITECTURE.html", "MODELE-DONNEES.html"]; // vues générées, jamais saisies (scripts du pilot)
const frontmatter = (texte) => { const m = texte.match(/^---\r?\n([\s\S]*?)\r?\n---/); return m ? m[1] : null; };
if (!existsSync(dp)) ko("R-20", "docs\\projet\\", "dossier absent — socle documentaire du produit (TECHNOS, COMPOSANTS-OPS, PARAMETRAGE, ACCES-TEST, COMMANDES)");
else {
  let ok20 = true;
  for (const f of FICHIERS_DP) {
    const fp = join(dp, f);
    if (!existsSync(fp)) { ko("R-20", `docs\\projet\\${f}`, "fichier manquant"); ok20 = false; continue; }
    const front = frontmatter(readFileSync(fp, "utf8"));
    if (!front || !/^role\s*:/m.test(front) || !/^sources_de_verite\s*:/m.test(front) || !/^verifie_le\s*:/m.test(front)) {
      ko("R-20", `docs\\projet\\${f}`, "frontmatter YAML incomplet — role, sources_de_verite et verifie_le requis (contrat machine)"); ok20 = false;
    }
  }
  for (const f of PROJECTIONS_DP) {
    if (!existsSync(join(dp, f))) { ko("R-20", `docs\\projet\\${f}`, "projection générée manquante — régénérer via les scripts du pilot (generer-architecture / generer-modele-donnees)"); ok20 = false; }
  }
  if (ok20) ok("R-20", "docs\\projet\\", `${FICHIERS_DP.length} fichiers + ${PROJECTIONS_DP.length} projections présents, frontmatter machine complet`);

  // R-21 · fraîcheur TECHNOS ↔ lockfiles (loi 4 : une donnée volatile est une donnée)
  const tp = join(dp, "TECHNOS.md");
  if (existsSync(tp)) {
    const front = frontmatter(readFileSync(tp, "utf8")) || "";
    const bloc = front.match(/^versions\s*:\s*\r?\n((?:[ \t]+.+\r?\n?)*)/m);
    const paires = [];
    if (bloc) for (const l of bloc[1].split(/\r?\n/)) {
      const m = l.match(/^[ \t]+([\w@\/.–-]+)\s*:\s*"([^"]+)"/);
      if (m && !m[1].startsWith("#")) paires.push([m[1], m[2]]);
    }
    // TF-0088 : lockfiles cherchés dans TOUT l'arbre (monorepo : frontend/yarn.lock…),
    // plus seulement à la racine ; yarn.lock et pnpm-lock.yaml rejoignent la liste.
    const NOMS_LOCK = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "pyproject.toml", "poetry.lock", "uv.lock", "requirements.txt", "Cargo.lock", "go.sum", "composer.lock", "Gemfile.lock"]);
    const locks = [...fichiers(cible)].filter((f) => NOMS_LOCK.has(basename(f))).map((f) => readFileSync(f, "utf8"));
    if (!paires.length) so("R-21", "TECHNOS.md sans bloc versions: renseigné — fraîcheur non jugeable (déclarer les versions clés)");
    else if (!locks.length) so("R-21", "aucun lockfile/manifeste dans l'arbre du projet — fraîcheur non jugeable");
    else {
      let ok21 = true;
      for (const [nom, ver] of paires) {
        if (!locks.some((t) => t.includes(nom) && t.includes(ver))) {
          ko("R-21", "docs\\projet\\TECHNOS.md", `${nom}@${ver} introuvable dans les lockfiles — la vue a divergé de sa source de vérité`); ok21 = false;
        }
      }
      if (ok21) ok("R-21", "docs\\projet\\TECHNOS.md", `${paires.length} version(s) conformes aux lockfiles`);
    }
  }

  // R-22 · parité PARAMETRAGE ↔ .env.example (la liste qui fait foi reste R-13)
  const pp = join(dp, "PARAMETRAGE.md");
  if (existsSync(pp) && envEx) {
    const front = frontmatter(readFileSync(pp, "utf8")) || "";
    const bloc = front.match(/^variables\s*:\s*\r?\n((?:[ \t]+-\s+.+\r?\n?)*)/m);
    const doc = new Set();
    if (bloc) for (const l of bloc[1].split(/\r?\n/)) { const m = l.match(/-\s+([A-Z][A-Z0-9_]*)/); if (m) doc.add(m[1]); }
    const env = new Set([...readFileSync(envEx, "utf8").matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((m) => m[1]));
    const manqueDoc = [...env].filter((v) => !doc.has(v));
    const manqueEnv = [...doc].filter((v) => !env.has(v));
    if (manqueDoc.length) ko("R-22", "docs\\projet\\PARAMETRAGE.md", `variable(s) de .env.example non documentée(s) : ${manqueDoc.join(", ")}`);
    if (manqueEnv.length) ko("R-22", "docs\\projet\\PARAMETRAGE.md", `variable(s) documentée(s) absente(s) de .env.example : ${manqueEnv.join(", ")}`);
    if (!manqueDoc.length && !manqueEnv.length) ok("R-22", "docs\\projet\\PARAMETRAGE.md", `parité tenue (${env.size} variable(s))`);
  }

  // R-24 · URLs d'application par environnement : hôte préfixé <nom-appli>-{dev|qualif|production}
  // (décision humaine du 11/08, TF-0090 — ex. produit-02-production.up.railway.app).
  // Jugées : les URLs http(s) des lignes dev/qualif/staging/production de la table
  // « URLs & ports par environnement » de PARAMETRAGE.md. Placeholders <…>/{…} et ligne
  // locale non jugés ; hôtes sans schéma (BDD host:port) non jugés — pas des URLs d'appli.
  if (existsSync(pp)) {
    const corps = readFileSync(pp, "utf8");
    const lignes = corps.split(/\r?\n/).filter((l) => /^\|\s*(dev|qualif|staging|production|prod)\b/i.test(l.trim()));
    if (!lignes.length) so("R-24", "PARAMETRAGE.md sans table d'environnements hébergés — URLs non jugeables");
    else {
      let ok24 = true, jugees = 0;
      for (const l of lignes) {
        const env = l.trim().match(/^\|\s*(\w+)/)[1].toLowerCase();
        for (const [url] of l.matchAll(/https?:\/\/[^\s|)>}\]]+/g)) {
          if (/[<>{}]/.test(url)) continue; // placeholder
          jugees++;
          const hote = url.replace(/^https?:\/\//, "").split(/[/:]/)[0];
          const label = hote.split(".")[0];
          if (!/-(dev|qualif|production)$/.test(label)) {
            ko("R-24", "docs\\projet\\PARAMETRAGE.md", `URL ${env} « ${url.slice(0, 70)} » : le premier label d'hôte doit finir par -dev, -qualif ou -production (« ${label} » constaté)`); ok24 = false;
          } else if (env === "staging" && !label.endsWith("-qualif")) {
            ko("R-24", "docs\\projet\\PARAMETRAGE.md", `ligne staging : l'environnement de l'étape MEP se nomme qualif dans les URLs (« ${label} » constaté)`); ok24 = false;
          }
        }
      }
      if (ok24) jugees ? ok("R-24", "docs\\projet\\PARAMETRAGE.md", `${jugees} URL(s) d'environnement au motif <appli>-{dev|qualif|production}`) : so("R-24", "environnements hébergés en placeholders — URLs réelles non encore posées");
    }
  }

  // R-26 · modèle de données ancré au schéma réel (TF-0091) : chaque table déclarée dans
  // MODELE-DONNEES.md porte une provenance (fichier/dossier de schéma) qui EXISTE et qui
  // CONTIENT le nom de la table — jamais rédigé de mémoire (loi 4). Exemption explicite :
  // « sans objet — aucune persistance ». Placeholders {…} de squelette : non jugés.
  const mdp = join(dp, "MODELE-DONNEES.md");
  if (existsSync(mdp)) {
    const t = readFileSync(mdp, "utf8");
    if (/sans objet — aucune persistance/i.test(t)) so("R-26", "MODELE-DONNEES.md : « sans objet — aucune persistance » (exemption explicite)");
    else {
      const blocs = [...t.matchAll(/^## Table : (.+)$/gm)];
      const reels = blocs.filter((m) => !/[{}]/.test(m[1]));
      if (!blocs.length) ko("R-26", "docs\\projet\\MODELE-DONNEES.md", "ni table déclarée (## Table : …) ni exemption « sans objet — aucune persistance »");
      else if (!reels.length) so("R-26", "MODELE-DONNEES.md : squelette en placeholders — ancrage non jugeable");
      else {
        let ok26 = true;
        for (const m of reels) {
          const nom = m[1].trim();
          const fin = blocs.find((b) => b.index > m.index)?.index ?? t.length;
          const prov = (t.slice(m.index, fin).match(/^- provenance\s*:\s*(.+)$/m) || [])[1]?.trim();
          if (!prov || /[{}]/.test(prov)) { ko("R-26", `MODELE-DONNEES.md · table ${nom}`, "provenance absente ou en placeholder — chaque table déclare le fichier de schéma d'où elle se lit"); ok26 = false; continue; }
          const chemin = p(prov);
          if (!existsSync(chemin)) { ko("R-26", `MODELE-DONNEES.md · table ${nom}`, `provenance introuvable : ${prov}`); ok26 = false; continue; }
          const contenus = statSync(chemin).isDirectory()
            ? [...fichiers(chemin)].map((f) => readFileSync(f, "utf8"))
            : [readFileSync(chemin, "utf8")];
          if (!contenus.some((c) => c.toLowerCase().includes(nom.toLowerCase()))) {
            ko("R-26", `MODELE-DONNEES.md · table ${nom}`, `table introuvable dans sa provenance ${prov} — le modèle a divergé du schéma réel (ou a été rédigé de mémoire)`); ok26 = false;
          }
        }
        if (ok26) ok("R-26", "docs\\projet\\MODELE-DONNEES.md", `${reels.length} table(s) ancrée(s) à leur schéma de provenance`);
      }
    }
  }

  // R-23 · ACCES-TEST : démo locale seulement, zéro secret (R-14 + loi 2)
  const ap = join(dp, "ACCES-TEST.md");
  if (existsSync(ap)) {
    const t = readFileSync(ap, "utf8");
    let ok23 = true;
    if (!t.includes("comptes de démonstration locale — jamais valides hors MODE_DEMO")) {
      ko("R-23", "docs\\projet\\ACCES-TEST.md", "en-tête dur absent : « comptes de démonstration locale — jamais valides hors MODE_DEMO »"); ok23 = false;
    }
    if (/AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|sk-[a-zA-Z0-9]{20,}|BEGIN [A-Z ]*PRIVATE KEY|xox[bpors]-/.test(t)) {
      ko("R-23", "docs\\projet\\ACCES-TEST.md", "motif de secret réel détecté — aucun secret, jamais (R-14) ; les accès réels sont des références « # à fournir : »"); ok23 = false;
    }
    if (ok23) ok("R-23", "docs\\projet\\ACCES-TEST.md", "en-tête démo-locale présent, aucun motif de secret");
  }
}

const nonJuge = [
  "R-5 (pas d'écrasement de version) : invisible statiquement — jugé par revue de diff",
  "R-15 (marqueurs « à fournir » exhaustifs) : l'oracle ne sait pas quelles variables sont tierces",
  "input\\ non jugé en nommage : les entrants humains arrivent tels quels",
  "seule la PRÉSENCE de CLAUDE.md/README est jugée, pas la pertinence de leur contenu",
  "R-21 : correspondance nom+version par inclusion textuelle dans les lockfiles — pas de résolution sémantique de graphes de dépendances",
  "R-23 : motifs de secrets forts uniquement — un mot de passe réaliste inventé sans motif connu passe (revue humaine + gitleaks en CI)",
  "R-24 : seules les URLs http(s) des lignes d'environnement de PARAMETRAGE.md sont jugées — URLs documentaires du corps et hôtes sans schéma (BDD) hors périmètre ; la correspondance <nom-appli> ↔ nom réel du produit reste une revue humaine",
  "R-26 : ancrage par inclusion textuelle du nom de table dans la provenance — la complétude INVERSE (toute table du DDL figure au doc) et l'exactitude des colonnes ne sont pas jugées (revue de schéma) ; la fraîcheur des projections HTML n'est pas datée (régénération = discipline d'étape)",
];

const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({
  oracle: "oracle-conformite-projet", version: "1.0.0", cible: String(cible),
  verdict: echecs ? "FAIL" : "PASS", findings, non_juge: nonJuge,
}, null, 1));
process.exit(echecs ? 1 : 0);
