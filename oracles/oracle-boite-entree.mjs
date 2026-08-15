#!/usr/bin/env node
/**
 * oracle-boite-entree.mjs — la boîte d'entrée des retours produits est-elle vide de travail
 * non pris ?
 *
 * Pourquoi il existe. Le 14/08, un lot `Produit-10 - RETOURS - 20260814b` (5 candidatures) est
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

// Fins de ligne normalisées en LF AVANT hachage (TF-0253) : git peut réécrire un sidecar en
// CRLF au checkout (core.autocrlf) sans qu'aucun octet de contenu n'ait changé. Une empreinte
// prise sur les octets bruts diverge alors de celle consignée à l'ingestion (LF), et B1/B2
// signalent un travail non pris ou édité là où rien n'a bougé — 12 faux positifs constatés le
// 14/08 pour zéro édition réelle. Normaliser ici rend la comparaison indifférente à la fin de
// ligne, tout en laissant B2 détecter une VRAIE édition (le contenu normalisé diffère toujours).
function empreinte(chemin) {
  const brut = readFileSync(chemin, "utf8").replace(/\r\n/g, "\n");
  return createHash("sha256").update(brut).digest("hex");
}

// Compatibilité TF-0253 : les ingestions ANTÉRIEURES à la normalisation ont consigné le
// sha des octets BRUTS (CRLF compris). Sans cette forme, la migration créait le faux
// positif inverse — constaté le 15/08 sur `Produit-10 - RETOURS - 20260814b` : fichier
// identique bit à bit à son commit, B2 levé quand même. Un fichier est donc couvert si
// SON empreinte normalisée OU son empreinte brute est au registre — une vraie édition
// ne matche ni l'une ni l'autre.
function empreinteBrute(chemin) {
  return createHash("sha256").update(readFileSync(chemin, "utf8")).digest("hex");
}

function couvert(parSha, chemin) {
  return parSha.has(empreinte(chemin)) || parSha.has(empreinteBrute(chemin));
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

// Les dépôts d'insatisfaction déjà entrés au registre du circuit (TF-0287), par nom de
// fichier ET par dossier — le registre porte l'un ou l'autre selon la voie de dépôt.
function depotsInsatisfaction(registreIns) {
  const vus = new Set();
  if (!existsSync(registreIns)) return vus;
  for (const ligne of readFileSync(registreIns, "utf8").split("\n")) {
    if (!ligne.trim()) continue;
    let e; try { e = JSON.parse(ligne); } catch { continue; }
    if (e.ev !== "depot") continue;
    for (const champ of [e.dossier, e.fichier]) {
      if (champ) vus.add(String(champ).split(/[\\/]/).filter(Boolean).pop());
    }
  }
  return vus;
}

const PREFIXE_INS = "INSATISFACTION - ";

function juger(repertoire, registre, registreIns = join(ICI, "..", "insatisfactions", "REGISTRE.jsonl")) {
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
    if (couvert(parSha, join(repertoire, nom))) continue;

    // Un sidecar BRUT au format produit se normalise avant ingestion : c'est le dérivé qui
    // porte l'empreinte consignée. Le brut est donc couvert par son normalisé — sans quoi
    // l'oracle réclamerait éternellement l'ingestion d'un fichier dont le travail est fait.
    if (!nom.endsWith(SUFFIXE_NORMALISE)) {
      const derive = nom.slice(0, -SUFFIXE_SIDECAR.length) + SUFFIXE_NORMALISE;
      if (sidecars.includes(derive) && couvert(parSha, join(repertoire, derive))) continue;
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
    // Un dépôt d'insatisfaction n'a PAS de sidecar, et c'est voulu (TF-0287) : l'humain
    // dépose une phrase et des captures, l'instruction produira le reste. B3 le
    // réclamerait à tort — le circuit naîtrait avec son propre faux positif, la maladie
    // même que l'étude 20260815e documente. B4 prend le relais ci-dessous.
    if (nom.startsWith(PREFIXE_INS)) continue;
    const base = nom.slice(0, -3);
    if (sidecars.some((s) => s.startsWith(base))) continue;
    findings.push({ regle: "B3", statut: "FAIL", ou: nom,
      message: "lot remis SANS sidecar — aucun canal ne peut l'ingérer, il est invisible par construction (`node todo\\normaliser-lot.mjs` ou sidecar à réclamer au produit)" });
  }

  // B4 (TF-0287) — un dépôt d'insatisfaction qui n'est pas entré au registre du circuit
  // n'est vu par personne : même maladie que B1, autre canal. Ce qui est exigé n'est pas
  // un sidecar, c'est un identifiant INS et une instruction à venir.
  const deposes = depotsInsatisfaction(registreIns);
  for (const nom of fichiers.filter((f) => f.startsWith(PREFIXE_INS) && f.endsWith(".md"))) {
    if (deposes.has(nom) || deposes.has(nom.slice(0, -3))) continue;
    findings.push({ regle: "B4", statut: "FAIL", ou: nom,
      message: "insatisfaction déposée JAMAIS entrée au registre — elle n'a ni identifiant INS, ni instruction, et un « toujours pas » ne pourra se rattacher à rien (`insatisfactions\\REGISTRE.jsonl`, événement depot)" });
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

  // CRLF (TF-0253) : un sidecar ingéré en LF, réécrit en CRLF par git au checkout — contenu
  // inchangé. VERT attendu : la normalisation avant hachage ne doit PAS lever B1/B2.
  const crlfContenu = '{"titre":"a"}\n{"titre":"b"}\n';
  const crlf = join(boite, "CRLF - RETOURS - 20260101a.tf.jsonl");
  writeFileSync(crlf, crlfContenu);
  writeFileSync(reg, readFileSync(reg, "utf8") + JSON.stringify({
    ev: "ingestion", lot_sha: empreinte(crlf), fichier: "CRLF - RETOURS - 20260101a.tf.jsonl",
  }) + "\n");
  writeFileSync(crlf, crlfContenu.replace(/\n/g, "\r\n")); // git réécrit en CRLF, contenu identique
  r = juger(boite, reg);
  cas.push(["CRLF  — vert : réécrit en CRLF, contenu identique", !r.findings.some((f) => f.statut === "FAIL" && f.ou === "CRLF - RETOURS - 20260101a.tf.jsonl"), r.verdict]);

  // Contre-épreuve rouge : sous la même réécriture CRLF, une VRAIE édition doit rester détectée
  // (la normalisation neutralise la fin de ligne, jamais un octet de contenu différent).
  writeFileSync(crlf, crlfContenu.replace(/\n/g, "\r\n") + '{"titre":"ajoute apres coup"}\r\n');
  r = juger(boite, reg);
  cas.push(["CRLF  — rouge : édition réelle sous CRLF toujours détectée", r.findings.some((f) => f.regle === "B2" && f.statut === "FAIL" && f.ou === "CRLF - RETOURS - 20260101a.tf.jsonl"), r.verdict]);

  // Héritage (complément TF-0253, cas réel du 15/08) : une ingestion d'AVANT la
  // normalisation a consigné le sha des octets bruts d'un fichier CRLF. VERT attendu
  // tant que le fichier n'a pas bougé ; une vraie édition reste ROUGE (aucune des deux
  // formes ne matche plus).
  const legacyContenu = '{"titre":"legacy"}\r\n';
  const legacy = join(boite, "LEGACY - RETOURS - 20260101a.tf.jsonl");
  writeFileSync(legacy, legacyContenu);
  writeFileSync(reg, readFileSync(reg, "utf8") + JSON.stringify({
    ev: "ingestion", lot_sha: empreinteBrute(legacy), fichier: "LEGACY - RETOURS - 20260101a.tf.jsonl",
  }) + "\n");
  r = juger(boite, reg);
  cas.push(["HÉRIT — vert : sha brut d'avant TF-0253, fichier intact", !r.findings.some((f) => f.statut === "FAIL" && f.ou === "LEGACY - RETOURS - 20260101a.tf.jsonl"), r.verdict]);
  writeFileSync(legacy, legacyContenu + '{"titre":"ajoute"}\r\n');
  r = juger(boite, reg);
  cas.push(["HÉRIT — rouge : édition réelle d'un lot hérité détectée", r.findings.some((f) => f.regle === "B2" && f.statut === "FAIL" && f.ou === "LEGACY - RETOURS - 20260101a.tf.jsonl"), r.verdict]);

  // B4 (TF-0287) : un dépôt d'insatisfaction n'a pas de sidecar — B3 doit se taire, B4
  // doit exiger l'entrée au registre du circuit. Les deux sens sont prouvés ici.
  const regIns = join(base, "REGISTRE-INS.jsonl");
  const depotIns = join(boite, "INSATISFACTION - site - 20260101a.md");
  writeFileSync(depotIns, "le menu est compresse\n");
  writeFileSync(regIns, "");
  r = juger(boite, reg, regIns);
  const surIns = (f) => f.ou === "INSATISFACTION - site - 20260101a.md";
  cas.push(["B4    — insatisfaction déposée, jamais au registre",
    r.findings.some((f) => f.regle === "B4" && f.statut === "FAIL" && surIns(f)), r.verdict]);
  cas.push(["B4 bis— B3 se TAIT sur un dépôt d'insatisfaction (pas de sidecar : c'est voulu)",
    !r.findings.some((f) => f.regle === "B3" && surIns(f)), r.verdict]);
  writeFileSync(regIns, JSON.stringify({
    ev: "depot", ts: "2026-01-01T10:00:00Z", id: "INS-0001", produit: "site",
    fichier: "INSATISFACTION - site - 20260101a.md", resume: "le menu est compresse",
  }) + "\n");
  r = juger(boite, reg, regIns);
  cas.push(["B4    — vert : dépôt entré au registre, plus rien à dire",
    !r.findings.some((f) => f.statut === "FAIL" && surIns(f)), r.verdict]);

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
