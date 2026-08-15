#!/usr/bin/env node
/**
 * oracle-boite-entree.mjs — la boîte d'entrée des retours produits est-elle vide de travail
 * non pris ?
 *
 * Pourquoi il existe. Le 14/08, un lot `SCC_ALX - RETOURS - 20260814b` (5 candidatures) est
 * resté dans `input\00-retours\` sans être ingéré, pendant qu'un autre lot du même jour l'était.
 * Rien ne l'a signalé. Il a été découvert par hasard, en listant les fichiers non suivis avant
 * de poser un tag. Le noyau prescrit de consulter le TODO-FORGE à l'ouverture de tout run ; il
 * ne prescrivait nulle part de vérifier que la boîte est vide — or un registre à jour ne dit
 * rien de ce qui n'y est jamais entré.
 *
 * C'est la même classe de défaut que la consigne RESTITUTION v1 (écrite, citée par aucun run)
 * et que `ruff` dans forge-tests (configuré, exécuté par aucun pas) : un dispositif qui existe
 * sans être joué. Ici le dispositif manquait tout court.
 *
 * Règles (binaires) :
 *   B1  tout sidecar `*.tf.jsonl` du répertoire porte une empreinte présente en événement
 *       `ingestion` du registre — sinon il n'a jamais été pris ;
 *   B2  un sidecar dont le NOM a été ingéré mais dont l'empreinte a changé a été édité APRÈS
 *       son ingestion : le registre et le fichier ne disent plus la même chose ;
 *   B3  un lot `*.md` sans aucun sidecar est ingérable par aucun canal — invisible par
 *       construction, quel que soit le soin qu'on met à regarder la boîte.
 *
 * Ce qu'il ne juge PAS : la valeur des candidatures, la justesse d'un retour, l'opportunité
 * de les traiter. Il dit qu'un travail est arrivé et n'a pas été pris, jamais s'il le mérite.
 *
 * Canal d'échappement respecté : `old\` est hors périmètre — un lot déjà traité par un autre
 * canal y part sans ingestion, c'est la convention du mode opératoire (references\TODO-FORGE.md).
 *
 * Usage : node oracle-boite-entree.mjs [<repertoire>] [--registre <TODO.jsonl>]
 *         node oracle-boite-entree.mjs --self-test
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const VERSION = "1.0.0";
const ORACLE = "oracle-boite-entree";
const ICI = dirname(fileURLToPath(import.meta.url));
const NON_JUGE = [
  "la VALEUR des candidatures d'un lot — cet oracle dit qu'un travail est arrivé sans être pris, jamais s'il le mérite",
  "les lots remis par un canal autre que le répertoire (message, dépôt frère) — il ne voit que ce qui est déposé",
  "le contenu de `old\\`, canal d'échappement documenté pour un lot déjà traité ailleurs",
];

const SUFFIXE_SIDECAR = ".tf.jsonl";
const SUFFIXE_NORMALISE = ".normalise.tf.jsonl";

function empreinte(chemin) {
  return createHash("sha256").update(readFileSync(chemin, "utf8")).digest("hex");
}

/** Les ingestions déjà consignées, par empreinte ET par nom de fichier. */
function ingestions(registre) {
  const archive = join(dirname(registre), "TODO-ARCHIVE.jsonl");
  const lignes = [registre, archive]
    .filter((f) => existsSync(f))
    .flatMap((f) => readFileSync(f, "utf8").split("\n"))
    .filter((l) => l.trim());
  const parShaSet = new Set();
  const parNom = new Set();
  for (const ligne of lignes) {
    let e;
    try { e = JSON.parse(ligne); } catch { continue; }
    if (e.ev !== "ingestion") continue;
    if (e.lot_sha) parShaSet.add(e.lot_sha);
    if (e.fichier) parNom.add(String(e.fichier).split(/[\\/]/).pop());
  }
  return { parSha: parShaSet, parNom };
}

function juger(repertoire, registre) {
  const findings = [];
  if (!existsSync(repertoire)) {
    return { verdict: "SKIP", findings, motif: `répertoire absent : ${repertoire}` };
  }
  const fichiers = readdirSync(repertoire, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name);
  const { parSha, parNom } = ingestions(registre);
  const sidecars = fichiers.filter((f) => f.endsWith(SUFFIXE_SIDECAR));

  for (const nom of sidecars) {
    const sha = empreinte(join(repertoire, nom));
    if (parSha.has(sha)) continue;

    // Un sidecar BRUT au format produit se normalise avant ingestion : c'est le dérivé qui
    // porte l'empreinte consignée. Le brut est donc couvert par son normalisé — sans quoi
    // l'oracle réclamerait éternellement l'ingestion d'un fichier dont le travail est fait.
    if (!nom.endsWith(SUFFIXE_NORMALISE)) {
      const derive = nom.slice(0, -SUFFIXE_SIDECAR.length) + SUFFIXE_NORMALISE;
      if (sidecars.includes(derive) && parSha.has(empreinte(join(repertoire, derive)))) continue;
    }

    findings.push(
      parNom.has(nom)
        ? { regle: "B2", statut: "FAIL", ou: nom,
            message: "sidecar ÉDITÉ après son ingestion — le registre porte ce nom, mais plus ce contenu ; ce qui a été ajouté depuis n'est entré nulle part" }
        : { regle: "B1", statut: "FAIL", ou: nom,
            message: "sidecar JAMAIS ingéré — le travail est arrivé et n'a pas été pris (`node todo\\ingerer-lot.mjs <fichier>`)" },
    );
  }

  for (const nom of fichiers.filter((f) => f.endsWith(".md"))) {
    const base = nom.slice(0, -3);
    if (sidecars.some((s) => s.startsWith(base))) continue;
    findings.push({ regle: "B3", statut: "FAIL", ou: nom,
      message: "lot remis SANS sidecar — aucun canal ne peut l'ingérer, il est invisible par construction (`node todo\\normaliser-lot.mjs` ou sidecar à réclamer au produit)" });
  }

  const vues = new Set(findings.map((f) => f.regle));
  for (const [regle, message] of [
    ["B1", `${sidecars.length} sidecar(s) présent(s), tous ingérés`],
    ["B2", "aucun sidecar édité après ingestion"],
    ["B3", "aucun lot sans sidecar"],
  ]) {
    if (!vues.has(regle)) findings.push({ regle, statut: "PASS", message });
  }
  findings.sort((a, b) => a.regle.localeCompare(b.regle) || (a.statut === "FAIL" ? -1 : 1));
  return { verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings };
}

// ---- self-test : chaque règle prouvée dans les DEUX sens -------------------------------------
function selfTest() {
  const base = mkdtempSync(join(tmpdir(), "boite-"));
  const reg = join(base, "TODO.jsonl");
  const boite = join(base, "00-retours");
  mkdirSync(boite);

  const ingere = join(boite, "PRODUIT - RETOURS - 20260101a.tf.jsonl");
  writeFileSync(ingere, '{"titre":"x"}\n');
  writeFileSync(join(boite, "PRODUIT - RETOURS - 20260101a.md"), "# lot\n");
  writeFileSync(reg, JSON.stringify({
    ev: "ingestion", lot_sha: empreinte(ingere), fichier: "PRODUIT - RETOURS - 20260101a.tf.jsonl",
  }) + "\n");

  const cas = [];
  const vert = juger(boite, reg);
  cas.push(["vert  — boîte à jour", vert.verdict === "PASS", vert.verdict]);

  // B1 : un sidecar neuf, jamais ingéré (le défaut réel du 14/08).
  const neuf = join(boite, "AUTRE - RETOURS - 20260101a.tf.jsonl");
  writeFileSync(neuf, '{"titre":"jamais pris"}\n');
  let r = juger(boite, reg);
  cas.push(["B1    — sidecar jamais ingéré", r.findings.some((f) => f.regle === "B1" && f.statut === "FAIL"), r.verdict]);

  // Contre-épreuve du normalisé : le brut est couvert par son dérivé ingéré, pas réclamé deux fois.
  const norm = join(boite, "AUTRE - RETOURS - 20260101a.normalise.tf.jsonl");
  writeFileSync(norm, '{"titre":"normalise"}\n');
  writeFileSync(reg, readFileSync(reg, "utf8") + JSON.stringify({ ev: "ingestion", lot_sha: empreinte(norm), fichier: "AUTRE - RETOURS - 20260101a.normalise.tf.jsonl" }) + "\n");
  r = juger(boite, reg);
  cas.push(["B1 bis— brut couvert par son normalisé", !r.findings.some((f) => f.statut === "FAIL" && f.ou.startsWith("AUTRE")), r.verdict]);

  // B2 : un sidecar déjà ingéré, puis complété — le nom est connu, le contenu ne l'est plus.
  writeFileSync(ingere, '{"titre":"x"}\n{"titre":"ajoute apres coup"}\n');
  r = juger(boite, reg);
  cas.push(["B2    — sidecar édité après ingestion", r.findings.some((f) => f.regle === "B2" && f.statut === "FAIL"), r.verdict]);

  // B3 : un lot déposé sans sidecar.
  writeFileSync(join(boite, "ORPHELIN - RETOURS - 20260101a.md"), "# lot sans sidecar\n");
  r = juger(boite, reg);
  cas.push(["B3    — lot sans sidecar", r.findings.some((f) => f.regle === "B3" && f.statut === "FAIL"), r.verdict]);

  let ok = 0;
  for (const [nom, tenu, verdict] of cas) {
    console.log(`  [${tenu ? "OK    " : "ECHEC "}] ${nom} (verdict ${verdict})`);
    if (tenu) ok += 1;
  }
  console.log(`self-test : ${ok}/${cas.length}`);
  return ok === cas.length ? 0 : 1;
}

// ---- entrée -----------------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.includes("--self-test")) process.exit(selfTest());

const iReg = args.indexOf("--registre");
const registre = resolve(iReg > 0 ? args[iReg + 1] : join(ICI, "..", "todo", "TODO.jsonl"));
const cible = resolve(args.find((a) => !a.startsWith("--") && a !== args[iReg + 1]) ?? join(ICI, "..", "input", "00-retours"));

const { verdict, findings, motif } = juger(cible, registre);
process.stdout.write(JSON.stringify({ oracle: ORACLE, version: VERSION, cible, verdict, motif, findings, non_juge: NON_JUGE }, null, 1) + "\n");
process.exit(verdict === "FAIL" ? 1 : verdict === "SKIP" ? 2 : 0);
