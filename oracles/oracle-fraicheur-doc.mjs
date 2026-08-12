#!/usr/bin/env node
/**
 * oracle-fraicheur-doc.mjs — fraîcheur des documents de pilotage contre les sources vérifiables.
 * v2 (TF-0115) : moteur générique piloté par `fraicheur-claims.json` — chaque claim confronte
 * une affirmation comptable d'un document (INVENTAIRE, fiches) à une sonde exécutable :
 *   - claim `extraire` + sonde numérique : le nombre cité == le nombre constaté ;
 *   - claim `interdit` + sonde booléenne : le document ne doit pas affirmer X si la sonde le réfute.
 * Sondes : compter_fichiers (glob simple), extraire_doc (regex sur un fichier source),
 * grep_sources (présence d'un motif dans les sources .py/.mjs/.js d'un dossier).
 * Usage : node oracle-fraicheur-doc.mjs [racine-forges] | --self-test  — exit 0/1/2.
 */
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));

function chercherDansSources(dossier, motif) {
  const pile = [dossier];
  while (pile.length) {
    const d = pile.pop();
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!/^(\.|node_modules|\.venv|dist|build|__pycache__)/.test(e.name)) pile.push(join(d, e.name));
      } else if (/\.(py|mjs|js)$/.test(e.name)) {
        if (readFileSync(join(d, e.name), "utf8").includes(motif)) return true;
      }
    }
  }
  return false;
}

export function executerSonde(sonde, racineForges) {
  const depot = join(racineForges, sonde.depot);
  if (sonde.type === "compter_fichiers")
    return readdirSync(join(depot, sonde.dossier)).filter((n) => n.startsWith(sonde.prefixe) && n.endsWith(sonde.suffixe)).length;
  if (sonde.type === "extraire_doc") {
    const m = readFileSync(join(depot, sonde.fichier), "utf8").match(new RegExp(sonde.motif));
    return m ? Number(m[1]) : null;
  }
  if (sonde.type === "grep_sources")
    return chercherDansSources(join(depot, sonde.dossier), sonde.motif);
  throw new Error(`type de sonde inconnu : ${sonde.type}`);
}

export function jugerClaim(claim, texteDoc, valeurSonde) {
  const id = claim.id;
  if (claim.extraire) {
    const m = texteDoc.match(new RegExp(claim.extraire));
    if (!m) return { regle: id, statut: "FAIL", message: `le document ne porte plus le motif « ${claim.extraire} » — claim à réviser` };
    if (valeurSonde === null) return { regle: id, statut: "SANS_OBJET", message: "sonde inopérante (motif source introuvable)" };
    const cite = Number(m[1]);
    return cite === valeurSonde
      ? { regle: id, statut: "PASS", message: `${cite} cité == ${valeurSonde} constaté` }
      : { regle: id, statut: "FAIL", message: `document cite ${cite}, la source constate ${valeurSonde}` };
  }
  if (claim.interdit) {
    const nie = new RegExp(claim.interdit).test(texteDoc);
    if (valeurSonde && nie) return { regle: id, statut: "FAIL", message: `le document affirme « ${claim.interdit} » que la source réfute` };
    return { regle: id, statut: "PASS", message: nie ? "affirmation présente mais non réfutée par la source" : "affirmation absente — rien à réfuter" };
  }
  return { regle: id, statut: "FAIL", message: "claim sans « extraire » ni « interdit »" };
}

function jugerTout(racinePilot, racineForges, cheminClaims) {
  const spec = JSON.parse(readFileSync(cheminClaims, "utf8"));
  if (spec.schema !== "pilot/fraicheur-claims@1") throw new Error(`schéma claims inattendu : ${spec.schema}`);
  const docs = new Map();
  const findings = [];
  for (const claim of spec.claims) {
    if (!docs.has(claim.doc)) docs.set(claim.doc, readFileSync(join(racinePilot, claim.doc), "utf8"));
    let valeur;
    try { valeur = executerSonde(claim.sonde, racineForges); }
    catch (e) { findings.push({ regle: claim.id, statut: "FAIL", message: `sonde en erreur : ${e.message}` }); continue; }
    findings.push(jugerClaim(claim, docs.get(claim.doc), valeur));
  }
  return findings;
}

function selfTest() {
  const dossier = mkdtempSync(join(tmpdir(), "fraicheur-"));
  const forges = join(dossier, "forges"); const pilot = join(dossier, "pilot");
  mkdirSync(join(forges, "forge-x", "oracles"), { recursive: true });
  mkdirSync(pilot, { recursive: true });
  writeFileSync(join(forges, "forge-x", "oracles", "oracle-a.mjs"), "// a");
  writeFileSync(join(forges, "forge-x", "oracles", "oracle-b.mjs"), "// b");
  writeFileSync(join(forges, "forge-x", "README.md"), "porte 7 contrôles au total");
  mkdirSync(join(forges, "forge-x", "src"), { recursive: true });
  writeFileSync(join(forges, "forge-x", "src", "cli.py"), 'parser.add_argument("--sortie")');
  const claims = (invTexte, clms) => {
    writeFileSync(join(pilot, "INV.md"), invTexte);
    writeFileSync(join(dossier, "claims.json"), JSON.stringify({ schema: "pilot/fraicheur-claims@1", claims: clms }));
    return jugerTout(pilot, forges, join(dossier, "claims.json"));
  };
  const C1 = { id: "x-oracles", doc: "INV.md", extraire: "(\\d+) oracles", sonde: { type: "compter_fichiers", depot: "forge-x", dossier: "oracles", prefixe: "oracle-", suffixe: ".mjs" } };
  const C2 = { id: "x-controles", doc: "INV.md", extraire: "(\\d+) contrôles", sonde: { type: "extraire_doc", depot: "forge-x", fichier: "README.md", motif: "(\\d+) contrôles" } };
  const C3 = { id: "x-sortie", doc: "INV.md", interdit: "aucune option --sortie", sonde: { type: "grep_sources", depot: "forge-x", dossier: "src", motif: '"--sortie"' } };
  const resultats = [];
  const attendre = (nom, attendu, findings) =>
    resultats.push({ fixture: nom, attendu, obtenu: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS" });
  attendre("verte", "PASS", claims("2 oracles ici, 7 contrôles là, rapport persistable", [C1, C2, C3]));
  attendre("rouge/compte-fichiers", "FAIL", claims("3 oracles ici, 7 contrôles là", [C1, C2]));
  attendre("rouge/compte-doc", "FAIL", claims("2 oracles ici, 9 contrôles là", [C1, C2]));
  attendre("rouge/negation-refutee", "FAIL", claims("2 oracles ici, 7 contrôles là, aucune option --sortie", [C1, C2, C3]));
  rmSync(dossier, { recursive: true, force: true });
  const rates = resultats.filter((r) => r.attendu !== r.obtenu);
  console.log(JSON.stringify({ oracle: "oracle-fraicheur-doc", mode: "self-test", verdict: rates.length ? "FAIL" : "PASS", resultats }, null, 1));
  process.exit(rates.length ? 1 : 0);
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  if (process.argv.includes("--self-test")) selfTest();
  try {
    const racinePilot = join(ICI, "..");
    const racineForges = process.argv[2] || process.env.FORGE_ROOT || join(racinePilot, "..");
    const findings = jugerTout(racinePilot, racineForges, join(ICI, "fraicheur-claims.json"));
    const echecs = findings.filter((f) => f.statut === "FAIL").length;
    console.log(JSON.stringify({
      oracle: "oracle-fraicheur-doc", version: "2.0.0", verdict: echecs ? "FAIL" : "PASS", findings,
      non_juge: ["les affirmations non couvertes par un claim (l'ajout d'un claim suit chaque dérive constatée)", "la véracité des sources elles-mêmes (README des forges)"],
    }, null, 1));
    process.exit(echecs ? 1 : 0);
  } catch (e) {
    console.log(JSON.stringify({ oracle: "oracle-fraicheur-doc", verdict: "ERREUR", message: String(e) }, null, 1));
    process.exit(2);
  }
}
