#!/usr/bin/env node
/**
 * oracle-conformite-projet.mjs — vérifie qu'un projet produit respecte REGLES-PROJET.md
 * (29 règles — R-1..R-19 du 06-10/08, R-20..R-23 socle documentaire du 11/08 TF-0082,
 * R-24 URLs d'environnement du 11/08 TF-0090, R-25 types au registre du 11/08 TF-0084,
 * R-26 modèle de données ancré au schéma réel du 11/08 TF-0091, R-27 surface web née
 * ouverte aux agents IA du 11/08 TF-0095 — socle à 8 fichiers
 * + projections HTML générées, R-32 gate aval des livrables HTML du 13/08 RV-4 ;
 * R-7 inversée le 13/08 par TF-0150 : old\ versionné ; R-42 INTÉGRITÉ du ledger du
 * 20/08 TF-0411 — le contrôle existait dans `ledger.mjs verify` et n'était câblé à aucun
 * déclencheur : ici il se joue là où le ledger est DÉJÀ lu). Node pur, zéro dépendance,
 * lecture seule (le registre des types d'organization est LU, jamais écrit).
 *
 * Campagne du 17/08 — trois volets neufs, tous à fixture double sens dans `self-test.mjs` :
 *  · R-2 gagne la LOCALISATION (TF-0319) : un artefact MARQUÉ destinataire-humain qui vit hors
 *    d'`output\`/`docs\` est un constat ; ce qui n'est pas marqué n'est JAMAIS jugé ;
 *  · R-19 gagne la FORME des clés `versions_forges` (TF-0320) : noms de dépôt COMPLETS, jugés
 *    à partir du 2026-08-17 seulement — l'existant reste une antériorité déclarée ;
 *  · R-20 gagne le couple `TODO-PRODUIT.md` → `.html` (TF-0318, volet LECTURE seul), tenu en
 *    PARITÉ par sceau sha256 ; source absente = SANS_OBJET motivé, jamais un défaut de produit.
 *
 * Usage : node oracle-conformite-projet.mjs <racine-du-projet>
 * Sortie : JSON sur stdout — { oracle, version, cible, verdict, findings[], non_juge[] }
 *          finding = { regle: "R-<n>", statut: PASS|FAIL|SANS_OBJET, ou, message }
 * Exit : 0 = PASS · 1 = FAIL · 2 = l'oracle n'a pas pu juger.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename, relative, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
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

// TF-0366 (18/08) — antécédences de jeu de règles, déclarées au `non_juge` plutôt qu'en échec.
// Raison : le livrable n'a rien fait de mal, c'est la RÈGLE qui a bougé. Transformer une
// évolution de règle en défaut de produit ferait rejouer tout l'historique à chaque ajout, et
// un gate qu'on apprend à contourner ne protège plus rien (R-33 bis). Même doctrine que
// TF-0266 pour les fichiers antérieurs à un mandat : liste nommée, jamais un total anonyme.
const antecedences = [];

/** Empreinte du jeu de règles de `check_html.py`, lue à la source. SKIP motivé si python manque. */
function empreinteReglesHtml() {
  const foyer = process.env.USERPROFILE || process.env.HOME || "";
  const script = join(foyer, ".claude", "skills", "digit-ai-page-html", "scripts", "check_html.py");
  if (!existsSync(script)) return { motif: `check_html.py introuvable (${script})` };
  for (const bin of ["python", "python3", "py"]) {
    const r = spawnSync(bin, [script, "--version-regles"], { encoding: "utf8" });
    if (r.error || r.status !== 0) continue;
    try {
      const lu = JSON.parse((r.stdout || "").trim());
      if (lu && lu.empreinte) return lu;
    } catch { /* interpréteur trouvé, sortie illisible : on essaie le suivant */ }
  }
  return { motif: "aucun interpréteur python n'a pu rendre --version-regles" };
}

const p = (...seg) => join(cible, ...seg);
const git = (...args) => spawnSync("git", ["-C", cible, ...args], { encoding: "utf8" });
const aGit = existsSync(p(".git"));

const MOTIF_DATE = / - \d{8}[a-z]?\.[\w.]+$/;
const EXT_CODE = new Set(["py", "js", "mjs", "cjs", "ts", "tsx", "jsx", "go", "rs", "java", "rb", "php", "cs"]);
const EXT_LIVRABLE = new Set(["md", "pdf", "html", "pptx", "docx", "xlsx", "zip", "png", "svg"]);
// LISEZMOI.md : index de dossier, pas un livrable daté (convention des familles numérotées
// d'`output\`/`input\`, 13/08). Ajouté avec `.oracles\` ci-dessous — TF-0197, 14/08.
const EXCLUS_NOMMAGE = new Set(["README.md", "CLAUDE.md", "index.md", "LISEZMOI.md"]);
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

// TF-0128 : recherche dédiée des lockfiles — 2 niveaux de descente au plus (racine, puis
// deux sous-niveaux), exclusions node_modules/.venv/dist/build (distincte de `fichiers()`,
// utilisée ailleurs à profondeur 6 pour les livrables).
const IGNORES_LOCK = new Set(["node_modules", ".venv", "dist", "build"]);
function* fichiersLock(dossier, prof = 0) {
  if (prof > 2 || !existsSync(dossier)) return;
  for (const e of readdirSync(dossier)) {
    if (IGNORES_LOCK.has(e)) continue;
    const chemin = join(dossier, e);
    const st = statSync(chemin);
    if (st.isDirectory()) yield* fichiersLock(chemin, prof + 1);
    else yield chemin;
  }
}

// TF-0128(c) : sources_de_verite du frontmatter peut lister un manifeste épinglé hors nom
// canonique (ex. azure/backend-requirements.txt) — lu en priorité, sans contrainte de nom.
const sourcesDeVerite = (front) => {
  const m = front.match(/^sources_de_verite\s*:\s*\[([^\]]*)\]/m);
  if (!m) return [];
  return m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
};

// Frontmatter YAML en tête de document — remonté ici (TF-0319) : la marque de destinataire
// s'y lit, et R-20..R-26 s'en servent plus bas. Une seule définition, deux usages.
const frontmatter = (texte) => { const m = texte.match(/^---\r?\n([\s\S]*?)\r?\n---/); return m ? m[1] : null; };

// ---- TF-0319 (verdict O3 du 17/08) · la frontière « livrable pour humain » se DÉCLARE ----
// Ce qui n'est PAS marqué n'est JAMAIS jugé. C'est le verrou que `oracle-conventions.mjs`
// d'organization avait documenté en SANS_OBJET D-01 (« distinguer les deux suppose de lire le
// CONTENU du dossier, pas son chemin — non mécanisable depuis un balayage de noms ») : un
// contrôle par MOTIF DE NOM a donc déjà été refusé en connaissance de cause, et le rouvrir
// condamnerait les entrants d'`input\`, les fixtures et les documents normatifs que D-06 place
// explicitement à la racine. La marque lève le verrou sans deviner le contenu d'un fichier.
//
// Deux canaux de marquage, et deux seulement :
//   1. le document se marque lui-même — `destinataire: humain` en frontmatter YAML (.md), ou
//      `<meta name="destinataire" content="humain">` pour un .html (son en-tête tient lieu de
//      frontmatter) ;
//   2. le ledger l'annonce — champ `livrable_attendu` d'un événement, DÉJÀ en service
//      (`_Client-A\Produit-10\forge\ledger.jsonl` seq 1 le porte depuis le 13/08).
const MARQUE_MD = /^destinataire\s*:\s*humain\s*$/im;
const MARQUE_HTML = /<meta\s+name=["']destinataire["']\s+content=["']humain["']\s*\/?>/i;
/** Zones OÙ LA MARQUE NE SE JUGE PAS — chacune avec son motif, jamais un silence :
 *  `input\` = entrant, donc donnée qui arrive telle quelle (même doctrine que le non_juge de
 *  R-4) · `gabarits\`/`fixtures\` = porteurs d'une FORME marquée, pas des livrables remis (une
 *  fixture rouge doit pouvoir violer la règle qu'elle prouve) · `old\` = archive gelée, jamais
 *  renommée (NON_JUGE d'`oracle-conventions`) · `.oracles\` = pièces de preuve d'oracle. */
const horsJugementMarque = (r) =>
  /^(input|gabarits)\//i.test(r) || /(^|\/)(old|fixtures?|\.oracles)\//i.test(r);
/** Zones de dépôt CONFORMES : `output\` (règle 2) et `docs\` (précision D-06 — un document
 *  normatif n'est pas une sortie et vit à la racine ou dans `docs\`). */
const zoneDeDepot = (r) => /^(output|docs)\//i.test(r);
const marqueHumain = (chemin, nom) => {
  const ext = nom.split(".").pop().toLowerCase();
  if (ext !== "md" && ext !== "html") return false;
  let t;
  try { t = readFileSync(chemin, "utf8"); } catch { return false; }
  if (ext === "html") return MARQUE_HTML.test(t.slice(0, 4096));
  const front = frontmatter(t);
  return !!front && MARQUE_MD.test(front);
};

// R-1..R-3 — structure
for (const [n, d] of [["R-1", "input"], ["R-2", "output"], ["R-3", "docs"]])
  existsSync(p(d)) ? ok(n, d + "/", "présent") : ko(n, d + "/", `dossier ${d}\\ absent de la racine`);

// R-2 (suite) · LOCALISATION du livrable marqué — TF-0319. R-2 jugeait la PRÉSENCE du dossier
// et jamais la localisation d'un livrable : un rapport laissé sous `forge\etapes\` laissait
// R-2 en PASS. Le constat est localisant (fichier + canal de marquage + où il est dû).
{
  const constats = [];
  let marques = 0;
  for (const f of fichiers(cible)) {
    const r = rel(f);
    if (horsJugementMarque(r) || !marqueHumain(f, basename(f))) continue;
    marques++;
    if (!zoneDeDepot(r)) constats.push({ ou: r, canal: "frontmatter « destinataire: humain »" });
  }
  const lg = p("forge", "ledger.jsonl");
  if (existsSync(lg)) for (const l of readFileSync(lg, "utf8").split("\n")) {
    if (!l.trim()) continue;
    let e;
    try { e = JSON.parse(l); } catch { continue; }
    const att = typeof e.livrable_attendu === "string" ? e.livrable_attendu.trim() : "";
    if (!att) continue;
    marques++;
    const chemin = att.replaceAll("\\", "/").replace(/^\.\//, "");
    if (!zoneDeDepot(chemin)) constats.push({ ou: `forge/ledger.jsonl → ${chemin}`, canal: "champ « livrable_attendu » du ledger" });
  }
  if (constats.length) for (const c of constats)
    ko("R-2", c.ou, `livrable marqué pour l'humain (${c.canal}) hors de output\\ — règle 2 : ` +
      "« tout livrable généré destiné à l'humain y vit ». Trois issues, aucune muette : le " +
      "déposer dans output\\ ; retirer la marque si c'est un document NORMATIF (doctrine, " +
      "gabarit, registre — précision D-06 : il vit à la racine ou dans docs\\) ; ou porter la " +
      "marque sur la COPIE remise et non sur l'original de travail (règle 16 : l'original " +
      "reste sous forge\\etapes\\, c'est la copie datée qui est marquée et déposée)");
  else if (marques) ok("R-2", "output/, docs/", `${marques} artefact(s) marqué(s) destinataire-humain, tous rangés dans output\\ ou docs\\`);
  else so("R-2", "aucun artefact marqué destinataire-humain (ni frontmatter, ni livrable_attendu au ledger) — la frontière se DÉCLARE : ce qui n'est pas marqué n'est jamais jugé (TF-0319)");
}

// R-18 — canal de retours forges (mandat du 06/08 : chaque projet prépare ses lots de retours)
existsSync(p("forge", "retours"))
  ? ok("R-18", "forge/retours/", "canal de retours présent")
  : ko("R-18", "forge/retours/", "dossier forge\\retours\\ absent — les retours vers les forges n'ont pas de canal");

// R-18 bis — canal des QUESTIONS en attente (TF-0330, 18/08). `CONTRAT-INTERFACE.md` prescrit
// `forge\QUESTIONS.md` depuis l'origine ; AUCUN oracle ne le regardait — une prescription sans
// contrôle, le motif exact de R-35. Mesure du 18/08 : aucun des produits porteurs d'un arbre
// `forge\` sur ce poste ne le porte. Conséquence concrète, celle que TF-0318 voulait traiter :
// un développement suspendu faute d'arbitrage est INVISIBLE, il ne vit que dans la mémoire de la
// session qui l'a suspendu. Déclaré en SANS_OBJET motivé et jamais en FAIL, comme R-20 pour
// TODO-PRODUIT : le fichier se crée au prochain run de version (règle existante), et un FAIL
// aujourd'hui suspendrait l'ouverture de tous les produits pour une dette qui les précède.
existsSync(p("forge", "QUESTIONS.md"))
  ? ok("R-18", "forge/QUESTIONS.md", "canal des questions en attente présent — un arbitrage suspendu y est visible hors session")
  : so("R-18", "forge\\QUESTIONS.md absent — les arbitrages en attente ne sont visibles nulle part hors de la session qui les a posés (`CONTRAT-INTERFACE.md` le prescrit, TF-0330) : dette DÉCLARÉE, à créer au prochain run de version de ce produit ; ce n'est pas un défaut de produit");

// R-4 — nommage daté des livrables (output/ et docs/ ; input/ non jugé : entrants humains)
let r4 = true;
for (const d of ["output", "docs"]) {
  for (const f of fichiers(p(d))) {
    const nom = basename(f);
    const ext = nom.split(".").pop().toLowerCase();
    if (EXCLUS_NOMMAGE.has(nom) || !EXT_LIVRABLE.has(ext) || /\/Old\//i.test("/" + rel(f))) continue;
    // `.oracles\` : captures produites PAR `render_page.py` à côté de la page auditée — ce
    // sont des pièces de preuve d'oracle, pas des livrables remis. Les nommer R-4 reviendrait
    // à dater un journal (TF-0197).
    if (/[\/]\.oracles[\/]/.test("/" + rel(f))) continue;
    if (/^docs[\/]projet[\/]/.test(rel(f))) continue; // socle documentaire R-20 : documents vivants à noms fixes, pas des livrables datés
    // TF-0197 (14/08) : le gabarit d'étude du pilot PRESCRIT lui-même « output\03-etudes\
    // <AAAAMMJJ>-etude-<objet>.md » (gabarits\ETUDE-OPPORTUNITE.md l.6) — date en tête, pour
    // que le dossier se lise dans l'ordre chronologique. Deux textes du pilot se
    // contredisaient : les 5 études sortaient en FAIL R-4 sans qu'aucune soit fautive. Le
    // nommage y reste CONTRAINT, mais par son propre motif : un préfixe daté obligatoire.
    if (/^output[\/]03-etudes[\/]/.test(rel(f))) {
      if (!/^\d{8}-/.test(nom)) { ko("R-4", rel(f), "étude sans préfixe daté « AAAAMMJJ-… » (gabarits\\ETUDE-OPPORTUNITE.md)"); r4 = false; }
      continue;
    }
    if (!MOTIF_DATE.test(nom)) { ko("R-4", rel(f), "livrable sans nommage « <Marque> - <Objet> - AAAAMMJJ<indice> »"); r4 = false; }
  }
}
if (r4) ok("R-4", "output/, docs/", "livrables au nommage daté (ou aucun livrable)");

// R-25 — le <Type> de tout livrable daté figure au registre des types (D-04 organization,
// encodé le 11/08 TF-0084). Le type est le premier mot du 2e segment ; comparaison
// insensible à la casse et aux accents (contrat du registre). Registre lu chez la forge
// organization (dépôt frère du pilot, $FORGE_ROOT sinon parent) — lecture seule.
const normeType = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
// TF-0265 : R-25 rendait son verdict SANS jamais dire quels types SONT admis — jusqu'à 10
// constats après coup, chacun laissant deviner le registre. distanceLevenshtein + plusProche
// donnent au message ce qu'un humain ferait à sa place : la liste, et la correction probable.
function distanceLevenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = a[i - 1] === b[j - 1]
        ? d[i - 1][j - 1]
        : 1 + Math.min(d[i - 1][j - 1], d[i - 1][j], d[i][j - 1]);
    }
  }
  return d[m][n];
}
/** Le type admis le plus proche (distance simple, sur formes normalisées), ou null si aucun
 *  n'est raisonnablement proche (seuil : au plus 40 % de la longueur du type saisi). */
function plusProche(type, typesAffiches) {
  const cible = normeType(type);
  let meilleur = null, meilleureDist = Infinity;
  for (const t of typesAffiches) {
    const dist = distanceLevenshtein(cible, normeType(t));
    if (dist < meilleureDist) { meilleureDist = dist; meilleur = t; }
  }
  const seuil = Math.max(1, Math.ceil(cible.length * 0.4));
  return meilleur && meilleureDist <= seuil ? { type: meilleur, distance: meilleureDist } : null;
}

const racineForges = process.env.FORGE_ROOT || join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const registreTypes = join(racineForges, "digit-ai-forge-organization", "registre-types.json");
if (!existsSync(registreTypes)) so("R-25", "registre-types.json d'organization introuvable — types non jugeables (poste non équipé ? node bootstrap.mjs)");
else {
  let admis, typesAffiches;
  try {
    const reg = JSON.parse(readFileSync(registreTypes, "utf8"));
    admis = new Set(reg.types.flatMap((t) => [t.type, ...(t.alias || [])]).map(normeType));
    // Formes canoniques (jamais les alias) pour l'affichage : lisibles, une seule par type.
    typesAffiches = reg.types.map((t) => t.type).sort((a, b) => a.localeCompare(b, "fr"));
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
          const suggestion = plusProche(type, typesAffiches);
          ko("R-25", rel(f),
            `type « ${type} » absent du registre des types` +
            (suggestion ? ` — vouliez-vous dire « ${suggestion.type} » (distance ${suggestion.distance}) ?` : "") +
            ` — types admis : ${typesAffiches.join(", ")}` +
            " — un type nouveau s'ajoute au registre d'organization (commit motivé, D-04), jamais improvisé dans un nom");
          r25 = false;
        }
      }
    }
    if (r25) vus ? ok("R-25", "output/, docs/", `${vus} livrable(s) daté(s) au type admis`) : so("R-25", "aucun livrable daté à typer");
  }
}

// R-27 — surface web née ouverte aux agents IA (TF-0095, pendant produit du nœud 58 seo) :
// un robots.txt présent n'interdit AUCUN agent IA de recherche sans ligne de décision
// consignée (commentaire « décision » à moins de 3 lignes au-dessus du User-agent) ;
// llms.txt vit à côté. Aucun robots.txt = surface web non déclarée → SANS_OBJET.
{
  const AGENTS_IA = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "ChatGPT-User", "Claude-Web"];
  const robots = [...fichiers(cible)].filter((f) => basename(f).toLowerCase() === "robots.txt");
  if (!robots.length) so("R-27", "aucun robots.txt — surface web non déclarée, agents IA non jugeables");
  else {
    let ok27 = true;
    for (const rb of robots) {
      const lignes = readFileSync(rb, "utf8").split(/\r?\n/);
      let uaCourant = null, uaLigne = 0;
      lignes.forEach((l, i) => {
        const mUA = l.match(/^\s*User-agent\s*:\s*(.+?)\s*$/i);
        if (mUA) { uaCourant = mUA[1]; uaLigne = i; return; }
        const mDis = l.match(/^\s*Disallow\s*:\s*(\S+)/i);
        if (mDis && uaCourant && AGENTS_IA.some((a) => uaCourant.toLowerCase() === a.toLowerCase())) {
          const avant = lignes.slice(Math.max(0, uaLigne - 3), uaLigne).join(" ");
          if (!/d[ée]cision/i.test(avant)) {
            ko("R-27", `${rel(rb)}:${i + 1}`, `agent IA « ${uaCourant} » bloqué sans décision consignée — la posture par défaut est AUTORISÉ ; bloquer se décide, se date et se motive dans le fichier`); ok27 = false;
          }
        }
      });
      const llms = join(dirname(rb), "llms.txt");
      if (!existsSync(llms)) {
        ko("R-27", rel(rb), "robots.txt sans llms.txt à côté — la carte du site pour les moteurs génératifs fait partie du socle web (gabarits\\web\\llms.txt)"); ok27 = false;
      }
    }
    if (ok27) ok("R-27", robots.map(rel).join(", "), `${robots.length} robots.txt ouverts aux agents IA (ou blocages consignés), llms.txt présent(s)`);
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

// R-7 — old\ VERSIONNÉ (C1 amendé le 13/08, TF-0150 : git garde l'histoire du rangement ;
// l'ancien arbitrage « jamais versionné » est caduc). Un old\ gitignoré retire des
// livrables déjà commités — c'est désormais LUI le défaut.
const gitignore = existsSync(p(".gitignore")) ? readFileSync(p(".gitignore"), "utf8") : "";
const oldExiste = [...fichiers(cible)].some((f) => /(^|\/)[Oo]ld\//.test("/" + rel(f)));
if (!oldExiste) so("R-7", "aucun dossier old\\ dans le projet");
else if (/^[Oo]ld\/$/m.test(gitignore) || /(^|\n)\*{0,2}\/?[Oo]ld\/(\n|$)/.test(gitignore))
  ko("R-7", ".gitignore", "old\\ est ignoré par git — C1 amendé (TF-0150, 13/08) : old\\ est un rangement de lisibilité VERSIONNÉ ; retirer la ligne du .gitignore");
else ok("R-7", ".gitignore", "old\\ présent et versionné (C1 amendé TF-0150)");

// R-32 — gate AVAL des livrables HTML (13/08, retour Produit-10 RV-4) : tout .html d'output\
// (hors old\) a son journal d'oracles sous forge\oracles\<basename>.json — la preuve que
// check_html.py ET render_page.py ont été exécutés avant remise. Le §2 bis du contrat
// couvre l'amont (gabarits des forges) ; sans R-32, un HTML écrit à la main ou par un
// gabarit non forgé sort sans jamais être mesuré (constaté : 31+21 bloquants livrés).
{
  const htmls = [...fichiers(p("output"))].filter(
    (f) => f.endsWith(".html") && !/(^|\/)old\//.test("/" + rel(f))
  );
  if (!htmls.length) so("R-32", "aucun livrable HTML dans output\\");
  else {
    let ok32 = true;
    for (const f of htmls) {
      const journal = p("forge", "oracles", basename(f, ".html") + ".json");
      if (!existsSync(journal)) {
        ko("R-32", rel(f), "livrable HTML sans journal d'oracles (attendu : forge\\oracles\\" +
          basename(f, ".html") + ".json) — exécuter check_html.py + render_page.py avant " +
          "remise et consigner les verdicts (règle R-32, gate aval)");
        ok32 = false;
      }
    }
    if (ok32) ok("R-32", "output/*.html", `${htmls.length} livrable(s) HTML avec journal d'oracles sous forge\\oracles\\`);

    // R-32 bis (TF-0366) — un journal existe, mais SOUS QUELLES RÈGLES ? Le 18/08, la règle
    // A3 met en échec un livrable DÉCLARÉ PASS le 14/08 et rejoué à l'identique : le fichier
    // n'a pas changé, la règle est postérieure. Le journal affirmait un PASS qui n'était plus
    // vrai, et rien ne permettait de le savoir sans tout rejouer.
    const courante = empreinteReglesHtml();
    if (!courante.empreinte) {
      antecedences.push(`R-32 bis non joué : ${courante.motif} — l'antériorité d'un journal reste indécidable`);
    } else {
      const perimes = [];
      let sans = 0;
      let lus = 0;
      for (const f of htmls) {
        const journal = p("forge", "oracles", basename(f, ".html") + ".json");
        if (!existsSync(journal)) continue;
        lus += 1;
        const vue = readFileSync(journal, "utf8").match(/"empreinte"[^"]*"([0-9a-f]{6,})"/);
        if (!vue) { sans += 1; continue; }
        if (vue[1] !== courante.empreinte) perimes.push(`${rel(f)} (journal ${vue[1]})`);
      }
      if (perimes.length) {
        antecedences.push(
          `R-32 bis — ${perimes.length} journal(aux) rendu(s) sous un JEU DE RÈGLES ANTÉRIEUR ` +
          `(courant ${courante.empreinte}, ${courante.nombre} règles) : ${perimes.join(" · ")}. ` +
          "Le livrable n'a pas changé, la règle a bougé : rejouer check_html.py pour savoir si " +
          "le PASS tient encore, et ne pas lire ces journaux comme des verdicts courants");
      } else if (sans) {
        antecedences.push(
          `R-32 bis — ${sans} journal(aux) SANS empreinte de règles, antérieurs à TF-0366 ` +
          "(18/08) : leur verdict n'est pas datable en jeu de règles ; le prochain passage de " +
          "check_html.py l'inscrira");
      } else if (lus) {
        ok("R-32 bis", "output/*.html",
          `journaux rendus sous le jeu de règles courant (${courante.empreinte}, ` +
          `${courante.nombre} règles)`);
      } else {
        // Aucun journal lu : R-32 l'a déjà dit en échec. Prononcer un PASS ici serait le
        // faux confort exact que cet item ferme — « rendus sous le jeu courant » sur zéro
        // journal. Défaut trouvé dans ce correctif même, en le jouant sur un projet réel.
        so("R-32 bis", "aucun journal d'oracles à dater en jeu de règles — R-32 l'a déjà dit");
      }
    }
  }
}

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

// R-43 — PRÉCÉDENCE de la factory (mandat humain du 20/08) : le CLAUDE.md du produit porte la
// clause « quand la factory est impliquée, ses règles priment » (gabarits\CLAUDE-PRODUIT.md), et
// les hooks de la factory sont installés chez le produit (R-44 : .claude\settings.json +
// forge\hooks\factory.mjs) — sans eux, la précédence est un vœu : aucun gate ne la joue.
{
  const claude = existsSync(p("CLAUDE.md")) ? readFileSync(p("CLAUDE.md"), "utf8") : "";
  const manques = [];
  if (!/pr[ée]c[ée]dence/i.test(claude) || !/R-43/.test(claude)) manques.push("clause de précédence (R-43) au CLAUDE.md");
  const reglages = p(".claude/settings.json");
  if (!existsSync(reglages)) manques.push(".claude/settings.json (gabarits\\settings-produit.json)");
  else if (!/forge\/hooks\/factory\.mjs/.test(readFileSync(reglages, "utf8"))) manques.push("hooks de la factory dans .claude/settings.json");
  if (!existsSync(p("forge/hooks/factory.mjs"))) manques.push("forge/hooks/factory.mjs (gabarits\\hooks-factory.mjs)");
  manques.length
    ? ko("R-43", "CLAUDE.md / .claude", `précédence de la factory non câblée — manque : ${manques.join(", ")} (socle d'ouverture, ETAPES-RUN)`)
    : ok("R-43", "CLAUDE.md / .claude", "clause de précédence présente, hooks de la factory installés");
}

// R-11 bis — LES RÉFÉRENTIELS DISPONIBLES, déclarés (TF-0373, 18/08). Coût du silence, mesuré :
// treize anomalies clients vivaient dans un board depuis le 29/07, six campagnes ont tourné
// entre le 11 et le 18/08, AUCUNE n'a su qu'elles existaient — et le sujet n'est apparu que
// parce qu'un humain a collé une URL dans une conversation. Le défaut n'est pas que la forge ne
// les ait pas trouvées (cinq relevaient d'exclusions écrites et légitimes) : c'est que leur
// absence n'a jamais été un TERME DÉCLARÉ de la mesure, alors qu'un SKIP muet est pire qu'un
// SKIP déclaré partout ailleurs dans cette factory.
//
// AVERTISSEMENT au `non_juge`, pas échec — pour la même raison que R-32 bis : un produit qui
// n'a pas encore répondu n'a rien fait de mal, la question est neuve. Et « absent » est une
// réponse VALIDE : ce qui est refusé est le silence, pas l'absence de référentiel.
{
  const claudeMd = existsSync(p("CLAUDE.md")) ? readFileSync(p("CLAUDE.md"), "utf8") : "";
  const attendus = ["exigences", "anomalies", "contrat"];
  const bloc = (claudeMd.match(/##\s*R[ée]f[ée]rentiels[^#]*/i) || [""])[0] || "";
  if (!bloc.trim()) {
    antecedences.push(
      "R-11 bis — aucune section « Référentiels » au CLAUDE.md du produit : ce sur quoi la mesure ne pouvait PAS s appuyer n est pas déclaré. Pour chacun — exigences, anomalies, contrat — son chemin, ou `absent` avec son motif. La question ne se pose qu une fois par produit, et sans elle un rapport peut dire « au vert » sans dire « au vert CONTRE QUOI »");
  } else {
    const manquants = attendus.filter((mot) => !new RegExp(mot, "i").test(bloc));
    if (manquants.length) {
      antecedences.push(
        `R-11 bis — section « Référentiels » présente mais incomplète : ${manquants.join(", ")} non déclaré(s). « absent » est une réponse valide ; le silence n en est pas une`);
    } else {
      ok("R-11 bis", "CLAUDE.md", "les trois référentiels sont déclarés (chemin ou « absent » motivé)");
    }
  }
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
//
// TF-0320 (17/08) : s'y ajoute la FORME des clés. RÉTROACTIVITÉ, choix explicite — l'existant
// historique ne se réécrit PAS : les deux ledgers mesurés (Produit-01 du 11/08, Produit-10 du
// 13/08) restent des antériorités déclarées, sur le modèle d'ANTERIORITE_R28 dans
// `oracle-ecosysteme.mjs`. Seuls les run_open ouverts À PARTIR du jour où la doctrine a été
// encodée au contrat sont jugés sur la forme — c'est le PROCHAIN run_open qui est opposable,
// et la politique d'entrée en vigueur de `REGLES-PROJET.md` l.13 (« au prochain run de version
// de chacun ») est ainsi tenue au lieu d'être contredite.
const DOCTRINE_CLES_COMPLETES = "2026-08-17";
// Le pilot est la seule exception nommée au motif depuis son renommage en digit-ai-factory
// (17/08 soir, gate humain — table : references\CORRESPONDANCE-RENOMMAGE-FACTORY.md).
const RE_CLE_DEPOT = /^(digit-ai-forge-[a-z0-9_-]+|digit-ai-factory)$/;
/** Nom de dépôt complet attendu pour une clé courte (« conception » → « digit-ai-forge-conception »,
 *  « pilot »/« factory » → « digit-ai-factory ») ; les préfixes partiels ne sont pas redoublés. */
const cleCanonique = (cle) => {
  const brut = String(cle).toLowerCase().replace(/^digit-ai-/, "").replace(/^forge-/, "");
  return (brut === "pilot" || brut === "factory") ? "digit-ai-factory" : "digit-ai-forge-" + brut;
};
const ledgerF = p("forge", "ledger.jsonl");
if (!existsSync(ledgerF)) so("R-19", "pas de forge\\ledger.jsonl (aucun run ouvert)");
else {
  const opens = readFileSync(ledgerF, "utf8").split("\n").filter((l) => l.trim()).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter((e) => e && (e.type === "run_open" || e.ev === "run_open"));
  if (!opens.length) ko("R-19", "forge/ledger.jsonl", "ledger présent mais aucun run_open — le ledger s'ouvre par run_open");
  else {
    let r19 = true, anteriorites = 0, jugesSurForme = 0;
    opens.forEach((o, i) => {
      const v = o.versions_forges;
      if (!v || typeof v !== "object" || !Object.keys(v).length) {
        ko("R-19", `forge/ledger.jsonl (run_open #${i + 1})`, "run_open sans versions_forges — consigner la version de chaque forge (contrat §3, fraîcheur)"); r19 = false;
      } else if (String(o.ts || "") >= DOCTRINE_CLES_COMPLETES) {
        // TF-0320 (17/08) : la forme CANONIQUE des clés est le nom de dépôt COMPLET
        // (CONTRAT-INTERFACE.md §3). Mesuré sur pièces le 17/08 : Produit-01 portait 5 clés en
        // noms courts (« conception », « design »…), Produit-10 14 clés complètes — les DEUX
        // rendaient PASS, et aucun diff de versions n'était calculable d'un run à l'autre.
        // R-19 jugeait la présence d'un point de comparaison, jamais sa comparabilité.
        jugesSurForme++;
        for (const cle of Object.keys(v)) {
          if (RE_CLE_DEPOT.test(cle)) continue;
          ko("R-19", `forge/ledger.jsonl (run_open #${i + 1})`,
            `versions_forges : clé « ${cle} » en nom court — la forme canonique est le nom de ` +
            `dépôt COMPLET, attendu « ${cleCanonique(cle)} » (CONTRAT-INTERFACE.md §3, TF-0320) ; ` +
            "deux conventions de clés ont cohabité en PASS jusqu'au 17/08, ce qui rendait le " +
            "diff de versions incalculable entre deux runs"); r19 = false;
        }
      } else anteriorites++;
      if (i > 0 && !o.run_precedent) {
        ko("R-19", `forge/ledger.jsonl (run_open #${i + 1})`, "run de version sans run_precedent — les runs se chaînent"); r19 = false;
      }
    });
    if (r19) ok("R-19", "forge/ledger.jsonl", `${opens.length} run_open avec versions_forges${opens.length > 1 ? " et chaînage run_precedent" : ""}` +
      (jugesSurForme ? `, dont ${jugesSurForme} au nom de dépôt complet (TF-0320)` : "") +
      (anteriorites ? ` — ${anteriorites} run_open antérieur(s) au ${DOCTRINE_CLES_COMPLETES} en antériorité déclarée sur la forme des clés (jamais réécrits)` : ""));
  }
}


// R-42 — INTÉGRITÉ du ledger (TF-0411, 20/08) : `seq` strictement croissant depuis 1,
// horodatages non décroissants, première entrée `run_open`. Le contrôle EXISTAIT depuis
// l'origine (`ledger.mjs verify`, contrat §3) et n'était câblé à aucun déclencheur : il
// n'apparaissait qu'au contrat « prêt client », en fin de run. Mesuré le 20/08 sur
// Produit-11 : deux horodatages en recul dans 138 entrées, publiés dans git, et le
// SECOND invisible parce que le vérificateur s'arrêtait au premier. Ici on ACCUMULE.
//
// Rectification déclarée : une entrée ultérieure `type: rectification_horodatage` portant
// `entrees: [{seq, ts_consigne, ts_reel_estime, cause}]` couvre des seq NOMMÉS et ANTÉRIEURS
// à elle. L'écart reste IMPRIMÉ (statut PASS, message « [RECTIFIÉ] ») — l'histoire ne se
// réécrit pas, elle se rectifie par ajout. Un écart non déclaré reste FAIL.
if (!existsSync(ledgerF)) so("R-42", "pas de forge\\ledger.jsonl — aucune intégrité à juger");
else {
  const lignes = readFileSync(ledgerF, "utf8").split("\n").filter((l) => l.trim());
  const entrees = lignes.map((l, i) => {
    try { return { n: i + 1, e: JSON.parse(l) }; } catch { return { n: i + 1, e: null }; }
  });
  const illisibles = entrees.filter((x) => !x.e).map((x) => x.n);
  // Les seq rectifiés : déclarés par une entrée de rectification, et seulement en amont d'elle.
  const rectifies = new Map();
  for (const { e } of entrees) {
    if (!e || (e.type || e.ev) !== "rectification_horodatage") continue;
    for (const d of (Array.isArray(e.entrees) ? e.entrees : [])) {
      const seq = Number(d && d.seq);
      if (Number.isFinite(seq) && (!Number.isFinite(Number(e.seq)) || seq < Number(e.seq))) {
        rectifies.set(seq, String((d && d.cause) || "cause non dite"));
      }
    }
  }
  const ecarts = [], notes = [];
  let avecSeq = 0;
  if (illisibles.length) ecarts.push(`ligne(s) JSON illisible(s) : ${illisibles.slice(0, 5).join(", ")}${illisibles.length > 5 ? " …" : ""}`);
  const lues = entrees.filter((x) => x.e).map((x) => x.e);
  if (lues.length) {
    const premier = lues[0];
    if ((premier.type || premier.ev) !== "run_open") ecarts.push(`première entrée de type « ${premier.type || premier.ev || "?"} » — run_open exigé (contrat §3)`);
    let seqAttendu = 1, tsMax = "";
    for (const e of lues) {
      const seq = Number(e.seq);
      if (Number.isFinite(seq)) {
        avecSeq++;
        if (seq !== seqAttendu) ecarts.push(`seq ${seq} là où ${seqAttendu} était attendu — append-only rompu`);
        seqAttendu = seq + 1;
      }
      const ts = String(e.ts || "");
      if (ts && tsMax && ts < tsMax) {
        const quoi = `seq ${Number.isFinite(seq) ? seq : "?"} : horodatage décroissant (${ts} après ${tsMax})`;
        if (rectifies.has(seq)) notes.push(`[RECTIFIÉ] ${quoi} — ${rectifies.get(seq)}`);
        else ecarts.push(quoi);
      }
      if (ts > tsMax) tsMax = ts;
    }
  }
  if (lues.length && !avecSeq) notes.push("aucune entree ne porte SEQ — la continuite d append n est PAS jugeable sur ce ledger (le contrat 3 l exige ; anteriorite, jamais reecrite) : seuls les horodatages et l ouverture le sont");
  const rectifiesNonVus = [...rectifies.keys()].filter((seq) => !notes.some((n) => n.includes(`seq ${seq} :`)));
  if (rectifiesNonVus.length) notes.push(`rectification(s) sans écart correspondant : seq ${rectifiesNonVus.join(", ")} — une rectification qui ne rectifie rien se retire`);
  if (ecarts.length) {
    ko("R-42", "forge/ledger.jsonl", `intégrité rompue — ${ecarts.length} écart(s) : ${ecarts.slice(0, 6).join(" · ")}${ecarts.length > 6 ? " …" : ""}` +
      (notes.length ? ` (par ailleurs : ${notes.join(" · ")})` : "") +
      ". L'histoire ne se réécrit pas : ajouter une entrée `type: rectification_horodatage` nommant les seq, le ts consigné, le ts réel estimé et la cause");
  } else {
    ok("R-42", "forge/ledger.jsonl", `intégrité tenue sur ${lues.length} entrée(s) — seq continu, horodatages non décroissants, ouverture par run_open` +
      (notes.length ? ` ; ${notes.join(" · ")}` : ""));
  }
}

// ---- D bis · Socle documentaire docs\projet\ (R-20..R-23 — TF-0082, 11/08) ----
const dp = p("docs", "projet");
const FICHIERS_DP = ["TECHNOS.md", "COMPOSANTS-OPS.md", "PARAMETRAGE.md", "ACCES-TEST.md", "COMMANDES.md", "FONCTIONNEL.md", "ARCHITECTURE.md", "MODELE-DONNEES.md"]; // FONCTIONNEL : TF-0087 · ARCHITECTURE + MODELE-DONNEES : TF-0091 (sources MD des vues générées)
const PROJECTIONS_DP = ["ARCHITECTURE.html", "MODELE-DONNEES.html"]; // vues générées, jamais saisies (scripts du pilot)
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
    // TF-0088 puis TF-0128(a)(b) : lockfiles cherchés sur 2 niveaux de descente au plus
    // (monorepo : frontend/yarn.lock…), exclusions node_modules/.venv/dist/build ; yarn.lock,
    // pnpm-lock.yaml et bun.lockb rejoignent la liste des noms canoniques.
    const NOMS_LOCK = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb", "pyproject.toml", "poetry.lock", "uv.lock", "requirements.txt", "Cargo.lock", "go.sum", "composer.lock", "Gemfile.lock"]);
    // TF-0128(c) : sources_de_verite déclarées lues en priorité, même sous un nom non
    // canonique (ex. azure/backend-requirements.txt) — le frontmatter les a déjà listées.
    const sourcesDeclarees = sourcesDeVerite(front)
      .map((s) => p(s))
      .filter((f) => existsSync(f) && statSync(f).isFile());
    const locks = [
      ...sourcesDeclarees.map((f) => readFileSync(f, "utf8")),
      ...[...fichiersLock(cible)].filter((f) => NOMS_LOCK.has(basename(f))).map((f) => readFileSync(f, "utf8")),
    ];
    if (!paires.length) so("R-21", "TECHNOS.md sans bloc versions: renseigné — fraîcheur non jugeable (déclarer les versions clés)");
    // TF-0128(d) : des versions SONT déclarées mais aucune source n'a pu les confronter —
    // FAIL de configuration, jamais SANS_OBJET (le silence ressemblait à un succès, cas
    // réel Produit-11 : 25 versions jamais confrontées).
    else if (!locks.length) ko("R-21", "docs\\projet\\TECHNOS.md", `${paires.length} version(s) déclarée(s) mais aucun lockfile/manifeste trouvé (arbre sur 2 niveaux, ni sources_de_verite résolvable) — FAIL de configuration, pas une absence d'objet`);
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
  //
  // TF-0267 (15/08) : le suffixe était jugé « présent », jamais « juste ». Une URL
  // `<appli>-recette-production.up.railway.app` posée sur la ligne QUALIF passait donc PASS
  // — c'est l'humain qui a relevé le défaut après livraison. Trois durcissements, à sévérité
  // inchangée (le périmètre était faux, pas la règle) :
  //   (a) le suffixe doit CORRESPONDRE à l'environnement de la ligne — dev→-dev,
  //       qualif/staging→-qualif, production/prod→-production ;
  //   (b) un DOUBLON d'environnement (`-recette-production`, `-qualif-production`…) est
  //       TOUJOURS un défaut : un hôte qui se contredit n'est jamais acceptable, et aucun
  //       écart déclaré ne l'excuse ;
  //   (c) un écart s'accepte UNIQUEMENT en champ structuré du frontmatter (`ecarts_r24`,
  //       4 champs requis), JAMAIS en prose : le run du 15/08 avait documenté l'écart en
  //       note de tableau, et rien n'avait signalé quoi que ce soit.
  const ENV_LIGNE = { dev: "dev", qualif: "qualif", staging: "qualif", production: "production", prod: "production" };
  // Vocabulaire d'environnement reconnu pour détecter un doublon : au-delà des trois noms
  // canoniques, les mots que les équipes emploient réellement (« recette », « preprod »…).
  // Vocabulaire volontairement borné : « demo », « test » ou « sandbox » sont aussi des noms
  // d'applications (`demoapp-production` est légitime), les inclure fabriquerait des faux
  // positifs. Un mot d'environnement hors de cette liste ne sera pas vu comme un doublon —
  // limite déclarée au non_juge.
  const MOTS_ENV = ["dev", "qualif", "qualification", "recette", "staging", "preprod", "prod", "production", "uat"];
  /** Écarts R-24 déclarés en champ STRUCTURÉ du frontmatter — jamais en prose.
   *  Forme attendue (les 4 champs sont requis, un écart incomplet n'existe pas) :
   *    ecarts_r24:
   *      - url: https://…
   *        environnement: qualif
   *        motif: domaine créé avant la convention, renommage planifié
   *        decide_le: 2026-08-15                                                          */
  const ecartsR24 = (front) => {
    const bloc = (front || "").match(/^ecarts_r24\s*:\s*\r?\n((?:[ \t]+.+\r?\n?)*)/m);
    if (!bloc) return [];
    const out = [];
    for (const l of bloc[1].split(/\r?\n/)) {
      const debut = l.match(/^[ \t]+-\s*url\s*:\s*(\S+)/);
      if (debut) { out.push({ url: debut[1] }); continue; }
      const champ = l.match(/^[ \t]+(environnement|motif|decide_le)\s*:\s*(.+?)\s*$/);
      if (champ && out.length) out[out.length - 1][champ[1]] = champ[2];
    }
    return out.filter((e) => e.url && e.environnement && e.motif && e.decide_le);
  };
  if (existsSync(pp)) {
    const corps = readFileSync(pp, "utf8");
    const front24 = frontmatter(corps) || "";
    const declares = ecartsR24(front24);
    const lignes = corps.split(/\r?\n/).filter((l) => /^\|\s*(dev|qualif|staging|production|prod)\b/i.test(l.trim()));
    if (!lignes.length) so("R-24", "PARAMETRAGE.md sans table d'environnements hébergés — URLs non jugeables");
    else {
      let ok24 = true, jugees = 0, excuses = 0;
      for (const l of lignes) {
        const env = l.trim().match(/^\|\s*(\w+)/)[1].toLowerCase();
        const attendu = ENV_LIGNE[env];
        for (const [url] of l.matchAll(/https?:\/\/[^\s|)>}\]]+/g)) {
          if (/[<>{}]/.test(url)) continue; // placeholder
          jugees++;
          const hote = url.replace(/^https?:\/\//, "").split(/[/:]/)[0];
          const label = hote.split(".")[0];
          const morceaux = label.split("-");
          // (b) doublon d'environnement — jugé AVANT tout, et jamais excusable.
          const queue = morceaux.slice(-2).map((m) => m.toLowerCase());
          if (queue.length === 2 && MOTS_ENV.includes(queue[0]) && MOTS_ENV.includes(queue[1])) {
            ko("R-24", "docs\\projet\\PARAMETRAGE.md", `URL ${env} « ${url.slice(0, 70)} » : doublon d'environnement dans l'hôte (« -${queue[0]}-${queue[1]} ») — un hôte qui porte deux environnements se contredit ; aucun écart déclaré ne l'excuse`); ok24 = false;
            continue;
          }
          const excuse = declares.find((e) => e.url === url || e.url === url.replace(/\/+$/, ""));
          if (!/-(dev|qualif|production)$/.test(label)) {
            if (excuse) { excuses++; continue; }
            ko("R-24", "docs\\projet\\PARAMETRAGE.md", `URL ${env} « ${url.slice(0, 70)} » : le premier label d'hôte doit finir par -dev, -qualif ou -production (« ${label} » constaté)`); ok24 = false;
          } else if (attendu && !label.endsWith(`-${attendu}`)) {
            // (a) le suffixe est présent mais ment sur l'environnement de sa ligne.
            if (excuse) { excuses++; continue; }
            ko("R-24", "docs\\projet\\PARAMETRAGE.md", `URL ${env} « ${url.slice(0, 70)} » : suffixe discordant — la ligne ${env} exige « -${attendu} » (« ${label} » constaté)${env === "staging" ? " ; l'environnement de l'étape MEP se nomme qualif dans les URLs" : ""}`); ok24 = false;
          }
        }
      }
      // (c) l'aggravant du 15/08 : l'écart documenté EN PROSE, sans champ structuré, ne
      // signalait rien. Une prose d'écart sans déclaration structurée est désormais un défaut.
      if (!declares.length) {
        const prose = corps.split(/\r?\n/).find((l) =>
          /(écart|ecart|dérogation|derogation|exception|non[- ]conforme|à renommer|a renommer)/i.test(l)
          && /(R-24|convention de nommage|suffixe|nommage)/i.test(l));
        if (prose) {
          ko("R-24", "docs\\projet\\PARAMETRAGE.md", `écart de nommage documenté EN PROSE (« ${prose.trim().slice(0, 80)} ») sans champ structuré — un écart s'accepte en frontmatter \`ecarts_r24\` (url, environnement, motif, decide_le), jamais en note : le 15/08 la prose n'a rien signalé et l'URL fausse est partie en livraison`); ok24 = false;
        }
      }
      if (ok24) jugees ? ok("R-24", "docs\\projet\\PARAMETRAGE.md", `${jugees} URL(s) d'environnement au motif <appli>-{dev|qualif|production}, suffixe accordé à sa ligne${excuses ? ` (${excuses} écart(s) déclaré(s) en champ structuré)` : ""}`) : so("R-24", "environnements hébergés en placeholders — URLs réelles non encore posées");
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

  // R-26 bis — FRAICHEUR des deux projections soeurs (TF-0338, 18/08). Elles n'etaient jugees
  // qu'en PRESENCE, et le non_juge de R-26 le disait lui-meme : « la fraicheur des projections
  // HTML n'est pas datee ». Une vue generee qui ment est pire qu'une vue absente — elle porte
  // l'autorite du genere sans sa fraicheur. Le mecanisme de sceau livre pour TODO-PRODUIT
  // s'etend ici a l'identique. MESURE PREALABLE, exigee par l'item avant tout durcissement
  // (patron de retroactivite R-19) : sur le seul produit du poste portant ces deux
  // projections, les DEUX sont fraiches — le durcissement ne fait donc FAIL aucun produit
  // existant. La forme est DUALE (normalise OU brut, TF-0359) parce que cette meme mesure a
  // montre que MODELE-DONNEES y est scelle sur la forme brute, sa source vivant en CRLF.
  for (const nom of PROJECTIONS_DP) {
    const srcMd = join(dp, nom.replace(/\.html$/, ".md"));
    const page = join(dp, nom);
    if (!existsSync(srcMd) || !existsSync(page)) continue; // la PRESENCE est deja jugee par R-20
    const texte = readFileSync(srcMd, "utf8").replace(/^\uFEFF/, "");
    const attendu = createHash("sha256").update(texte.split("\r\n").join("\n")).digest("hex").slice(0, 12);
    const attenduBrut = createHash("sha256").update(texte).digest("hex").slice(0, 12);
    const rendu = readFileSync(page, "utf8");
    const scelle = (rendu.match(/Sceau source <code>([0-9a-f]{12})<\/code>/i) || [])[1];
    if (!scelle) so("R-26", `docs\\projet\\${nom} sans sceau de source — page anterieure au mecanisme de sceau : fraicheur non jugeable, regeneration au prochain run de version de ce produit`);
    else if (scelle === attendu || scelle === attenduBrut) ok("R-26", `docs\\projet\\${nom}`, `projection a PARITE avec sa source (sceau ${scelle})`);
    else ko("R-26", `docs\\projet\\${nom}`, `projection PERIMEE — la page scelle ${scelle}, la source rend ${attendu} : la vue porte l'autorite du genere sans sa fraicheur (regenerer via le script du pilot, la source Markdown fait foi)`);
  }
      }
    }
  }

  // R-20 (suite) · TODO-PRODUIT : reste-à-faire et décisions attendues du produit, au patron
  // « source MD versionnée → projection HTML générée » (TF-0318, verdict O3 du 17/08 — volet
  // LECTURE seul : aucune saisie, aucun bouton d'envoi, aucun dossier écouté).
  //
  // Le couple n'est PAS exigé : les produits nés avant le 17/08 ne l'auront qu'à leur prochain
  // run de version (dette déclarée par l'étude, précisément pour qu'un oracle ne la lise pas
  // comme un défaut de produit). Absence de source = SANS_OBJET motivé, jamais FAIL.
  //
  // En revanche, dès que la source EXISTE, la projection est tenue — et tenue plus fermement que
  // ses deux sœurs : `ARCHITECTURE.html` et `MODELE-DONNEES.html` ne sont jugées qu'en PRÉSENCE
  // (le non_juge de R-26 le dit : « la fraîcheur des projections HTML n'est pas datée »). Ici la
  // PARITÉ est vérifiée par le sceau : le générateur scelle le sha256 de sa source dans la page,
  // donc une page régénérée depuis une autre version se dénonce elle-même. Une vue périmée qui
  // ressemble à une vue fraîche est le mensonge silencieux que TF-0151 a déjà payé.
  const tdp = join(dp, "TODO-PRODUIT.md");
  if (!existsSync(tdp)) so("R-20", "docs\\projet\\TODO-PRODUIT.md absent — reste-à-faire et décisions attendues du produit non projetés (TF-0318, 17/08) : dette déclarée pour les produits nés avant cette date, à créer au prochain run de version depuis gabarits\\docs-projet\\TODO-PRODUIT.md ; ce n'est pas un défaut de produit");
  else {
    // Même normalisation que le générateur : BOM retiré avant hachage, sinon la même source
    // rendrait deux empreintes selon l'outil Windows qui l'a écrite.
    const source = readFileSync(tdp, "utf8").replace(/^\uFEFF/, "");
    const front = frontmatter(source);
    // Deux formes acceptees (TF-0359) : le sceau NORMALISE en LF — celui que le generateur
    // scelle depuis le 18/08 — et le sceau BRUT des pages scellees avant. Une page vraiment
    // perimee ne matche ni l'une ni l'autre ; sans le repli, la normalisation aurait accuse
    // toutes les pages existantes le jour de sa mise en service.
    const attendu = createHash("sha256").update(source.split("\r\n").join("\n")).digest("hex").slice(0, 12);
    const attenduBrut = createHash("sha256").update(source).digest("hex").slice(0, 12);
    const proj = join(dp, "TODO-PRODUIT.html");
    let okTdp = true;
    if (!front || !/^role\s*:/m.test(front) || !/^sources_de_verite\s*:/m.test(front) || !/^verifie_le\s*:/m.test(front)) {
      ko("R-20", "docs\\projet\\TODO-PRODUIT.md", "frontmatter YAML incomplet — role, sources_de_verite et verifie_le requis (contrat machine du socle) ; un BOM en tête de fichier suffit à rendre le frontmatter illisible (Set-Content/Out-File en posent un par défaut)"); okTdp = false;
    }
    if (!existsSync(proj)) {
      ko("R-20", "docs\\projet\\TODO-PRODUIT.html", "projection générée manquante alors que sa source existe — régénérer via node <pilot>\\todo\\generer-todo-produit.mjs docs\\projet\\TODO-PRODUIT.md (la vue n'est JAMAIS éditée à la main)"); okTdp = false;
    } else if (!(() => { const p = readFileSync(proj, "utf8"); return p.includes(attendu) || p.includes(attenduBrut); })()) {
      ko("R-20", "docs\\projet\\TODO-PRODUIT.html", `projection PÉRIMÉE — le sceau de la source (${attendu}) est absent de la page : la source a changé sans que la vue soit régénérée. Rejouer node <pilot>\\todo\\generer-todo-produit.mjs docs\\projet\\TODO-PRODUIT.md`); okTdp = false;
    }
    if (okTdp) ok("R-20", "docs\\projet\\TODO-PRODUIT.md → .html", `couple source→projection à parité (sceau ${attendu}), frontmatter machine complet`);
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
  ...antecedences,
  "R-5 (pas d'écrasement de version) : invisible statiquement — jugé par revue de diff",
  "R-15 (marqueurs « à fournir » exhaustifs) : l'oracle ne sait pas quelles variables sont tierces",
  "input\\ non jugé en nommage : les entrants humains arrivent tels quels",
  "seule la PRÉSENCE de CLAUDE.md/README est jugée, pas la pertinence de leur contenu",
  "R-21 : correspondance nom+version par inclusion textuelle dans les lockfiles — pas de résolution sémantique de graphes de dépendances ; recherche bornée à 2 niveaux de descente (hors sources_de_verite déclarées, lues où qu'elles soient) — un lockfile plus profond que 2 niveaux et non déclaré reste invisible",
  "R-23 : motifs de secrets forts uniquement — un mot de passe réaliste inventé sans motif connu passe (revue humaine + gitleaks en CI)",
  "R-24 : seules les URLs http(s) des lignes d'environnement de PARAMETRAGE.md sont jugées — URLs documentaires du corps et hôtes sans schéma (BDD) hors périmètre ; la correspondance <nom-appli> ↔ nom réel du produit reste une revue humaine (le SUFFIXE d'environnement, lui, est jugé mécaniquement depuis TF-0267 : accord avec la ligne, et doublon toujours en défaut)",
  "R-24 (TF-0267) : le doublon d'environnement n'est vu que sur un vocabulaire borné (dev, qualif, qualification, recette, staging, preprod, prod, production, uat) — un mot d'environnement maison passera ; « demo », « test » et « sandbox » en sont volontairement absents, ce sont aussi des noms d'applications",
  "R-24 (TF-0267) : la prose d'écart n'est détectée que sur un vocabulaire explicite (écart, dérogation, exception, non conforme, à renommer) croisé avec R-24/nommage/suffixe — un écart raconté en d'autres mots ne sera pas vu ; c'est le champ structuré `ecarts_r24` qui fait foi, pas la détection de prose",
  "R-26 : ancrage par inclusion textuelle du nom de table dans la provenance — la complétude INVERSE (toute table du DDL figure au doc) et l'exactitude des colonnes ne sont pas jugées (revue de schéma) ; la fraîcheur des projections HTML EST jugée depuis le 18/08 (R-26 bis, sceau de source, TF-0338) — ce qui reste hors jugement est la fraîcheur d'une page ANTÉRIEURE au mécanisme de sceau : elle est déclarée, jamais mise en échec",
  "R-27 : jugé seulement si un robots.txt existe (surface web non déclarée = SANS_OBJET) ; blocages CDN/WAF et cohérence llms.txt ↔ sitemap hors périmètre statique (nœud 58 forge-seo-geo au run)",
  "R-2 localisation (TF-0319) : seul ce qui est MARQUÉ est jugé — un producteur qui oublie de marquer son livrable y échappe (faux négatif ASSUMÉ, mesuré à la revue du 17/09 par le rapport entre livrables marqués et livrables déposés) ; la JUSTESSE du marquage relève de la relecture, pas d'un contrôle de forme ; `input\\`, `gabarits\\`, `fixtures\\`, `old\\` et `.oracles\\` sont hors jugement par motif déclaré ; la marque est attendue sur la COPIE remise, pas sur l'original de travail de `forge\\etapes\\` (règle 16) — l'oracle ne rapproche pas un original de sa copie",
  "R-2 localisation (TF-0319) : la structure INTERNE d'`output\\` (familles numérotées uniques, une seule version courante par famille, graphie `old\\`, LISEZMOI.md de correspondance — D-15 al. a à e) n'est PAS jugée ici : sa mécanisation vit chez `oracle-conventions.mjs` d'organization et reste suspendue à un mandat humain d'écriture dans ce dépôt frère",
  "R-19 forme des clés (TF-0320) : seule la FORME des clés `versions_forges` est jugée, pas leur COMPLÉTUDE — un run_open qui ne relève que 5 forges sur 14 en noms complets reste PASS (Produit-01 en portait 5) ; un run_open sans `ts` n'est pas jugé sur la forme (pas de date, pas d'entrée en vigueur opposable) ; les run_open antérieurs au 2026-08-17 sont des antériorités déclarées, jamais réécrites",
];

const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({
  oracle: "oracle-conformite-projet", version: "1.0.0", cible: String(cible),
  verdict: echecs ? "FAIL" : "PASS", findings, non_juge: nonJuge,
}, null, 1));
process.exit(echecs ? 1 : 0);
