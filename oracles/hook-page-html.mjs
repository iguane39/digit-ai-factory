#!/usr/bin/env node
/**
 * hook-page-html.mjs — LES RÈGLES DE SOCLE D'UNE PAGE HTML SE JOUENT CHEZ LE PRODUIT, AU MOMENT
 * OÙ IL L'ÉCRIT — pas au pilot, trois livraisons plus tard.
 *
 * LE FAIT (lot du produit 02 du 02/09, TF-0765). Le brief d'une console de données exigeait « tri et
 * filtres » sans nommer la règle L4 ni le composant de filtres du socle ; les hooks du produit ne
 * jouaient pas `oracle-filtres-tableau` ; la console est partie avec un tri maison hors en-tête,
 * jugée conforme par ses propres oracles, et l'humain a dû redemander « comme demandé par la
 * factory ». Une règle que le producteur ne rencontre pas au moment où il produit n'existe pas
 * pour lui (TF-0757, R12 : la boucle de retour doit REDESCENDRE).
 *
 * CE QUE FAIT CE HOOK. Hook `PostToolUse` (Write | Edit) lancé DANS le produit par
 * `forge/hooks/factory.mjs page-html` (gabarits/settings-produit.json). Il lit sur stdin l'entrée
 * du tool, ne s'intéresse qu'aux fichiers `.html` existants, et joue dessus les contrôles de socle
 * installés sur le poste : `oracle-filtres-tableau.mjs` (quality-oracles, G1-G6 : un tableau de
 * données porte ses filtres de colonne ou son exemption motivée). Verdict imprimé, exit 0 TOUJOURS :
 * il AVERTIT au moment de l'écriture, il ne bloque pas — bloquer une édition est le rôle du gate
 * d'écriture du poste (C7), et une page se construit en plusieurs écritures.
 *
 * BORNES : rien si le poste n'a pas le skill (dit, jamais tu) ; rien hors `.html` ; un oracle qui ne
 * rend pas de JSON est rapporté ILLISIBLE, pas ignoré.
 *
 * Usage : node oracles/hook-page-html.mjs [--fichier <page.html>] [--self-test]   (stdin : JSON du hook)
 */
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { homedir, tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SKILLS = process.env.FORGE_SKILLS_INSTALLES || join(homedir(), ".claude", "skills");
const ORACLE_FILTRES = join(SKILLS, "quality-oracles", "scripts", "oracle-filtres-tableau.mjs");

/** Le fichier visé par l'entrée du hook (Write/Edit), ou null. */
export function fichierVise(entree) {
  try {
    const j = typeof entree === "string" ? JSON.parse(entree || "{}") : (entree || {});
    const p = j?.tool_input?.file_path || j?.tool_input?.path || null;
    return p && /\.html?$/i.test(p) ? p : null;
  } catch { return null; }
}

/** Joue les contrôles de socle sur une page ; rend des lignes à imprimer. */
export function jouer(page, oracle = ORACLE_FILTRES) {
  const lignes = [];
  if (!existsSync(page)) return lignes;
  if (!existsSync(oracle)) {
    lignes.push(`[page-html] règles de socle NON jouées sur ${page} : ${oracle} absent de ce poste — installer les skills (bootstrap.mjs --pull)`);
    return lignes;
  }
  const r = spawnSync(process.execPath, [oracle, page], { encoding: "utf8", timeout: 60000 });
  let j = null;
  try { j = JSON.parse((r.stdout || "").slice((r.stdout || "").indexOf("{"))); } catch { /* illisible */ }
  if (!j) { lignes.push(`[page-html] oracle-filtres-tableau ILLISIBLE sur ${page} (exit ${r.status}) — ce n'est pas un constat sur la page`); return lignes; }
  const fails = (j.findings || []).filter((f) => f.statut === "FAIL");
  if (j.verdict === "PASS" || j.verdict === "SKIP" || j.verdict === "SANS_OBJET") {
    lignes.push(`[page-html] ${page} : filtres de tableau ${j.verdict} (${(j.findings || []).length} contrôle(s))`);
  } else {
    lignes.push(`[page-html] ${page} : filtres de tableau ${j.verdict} — ${fails.length} règle(s) de socle en défaut (L4 / G1-G6 de digit-ai-page-html) :`,
      ...fails.slice(0, 6).map((f) => `  - ${f.regle} : ${String(f.message || "").slice(0, 160)}`),
      "  Règle de socle : un tableau de données porte ses filtres de colonne (composant table-filters du skill) ou son exemption motivée — c'est ce que le brief doit citer (CLAUDE-PRODUIT « Règles de socle applicables »).");
  }
  return lignes;
}

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "hook-page-html-"));
  const casse = [];
  // Un faux oracle : FAIL sur une page qui porte « sans-filtres », PASS sinon.
  const faux = join(dir, "oracle.mjs");
  writeFileSync(faux, `import { readFileSync } from "node:fs";
const t = readFileSync(process.argv[2], "utf8");
const fail = t.includes("sans-filtres");
console.log(JSON.stringify({ verdict: fail ? "FAIL" : "PASS", findings: fail ? [{ regle: "G1", statut: "FAIL", message: "tableau sans marquage de filtres" }] : [{ regle: "G1", statut: "PASS" }] }));
process.exit(fail ? 1 : 0);
`, "utf8");
  const rouge = join(dir, "rouge.html"); writeFileSync(rouge, "<table class='sans-filtres'></table>", "utf8");
  const verte = join(dir, "verte.html"); writeFileSync(verte, "<table data-filtres='oui'></table>", "utf8");
  const r = jouer(rouge, faux), v = jouer(verte, faux);
  if (!r.some((l) => /FAIL/.test(l) && /G1/.test(r.join(" ")))) casse.push("une page en défaut n'est pas signalée avec sa règle");
  if (!v.some((l) => /PASS/.test(l))) casse.push("une page conforme n'est pas déclarée PASS");
  if (jouer(join(dir, "absente.html"), faux).length) casse.push("un fichier absent produit une sortie");
  if (!jouer(rouge, join(dir, "nulle-part.mjs")).some((l) => /NON jouées/.test(l))) casse.push("un oracle absent du poste est tu au lieu d'être dit");
  if (fichierVise(JSON.stringify({ tool_input: { file_path: "c:/x/page.html" } })) !== "c:/x/page.html") casse.push("le fichier .html du hook n'est pas reconnu");
  if (fichierVise(JSON.stringify({ tool_input: { file_path: "c:/x/notes.md" } })) !== null) casse.push("un fichier non-HTML est pris pour une page");
  if (fichierVise("{pas du json") !== null) casse.push("une entrée illisible n'est pas ignorée");
  rmSync(dir, { recursive: true, force: true });
  console.log(casse.length ? `Self-test hook-page-html : ${casse.length} DÉFAUT(S)\n - ${casse.join("\n - ")}`
    : "Self-test hook-page-html : 7/7 PASS (page en défaut signalée avec sa règle ; page conforme PASS ; fichier absent silencieux ; oracle absent DIT ; entrée .html reconnue ; .md ignoré ; JSON illisible ignoré)");
  return casse.length ? 1 : 0;
}

const lanceEnDirect = process.argv[1] && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/") === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) process.exit(selfTest());
  let page = null;
  const i = args.indexOf("--fichier");
  if (i >= 0) page = args[i + 1];
  else { let stdin = ""; try { stdin = readFileSync(0, "utf8"); } catch { /* pas de stdin */ } page = fichierVise(stdin); }
  if (!page) process.exit(0);
  const lignes = jouer(resolve(page));
  if (lignes.length) console.log(lignes.join("\n"));
  process.exit(0);
}
