#!/usr/bin/env node
/**
 * oracle-claude-md.mjs — plafond de taille du noyau CLAUDE.md + intégrité des références
 * (TF-0037/TF-0053). Règles :
 *  N1  CLAUDE.md ≤ 6144 octets (le noyau reste lisible en session — ×3,8 en 5 jours avant borne)
 *  N2  chaque fichier `references\<X>.md` cité par le noyau existe
 *  N3  chaque fichier de references\ est cité par le noyau (pas de référence orpheline)
 * Usage : node oracle-claude-md.mjs [racine]      — exit 0 PASS / 1 FAIL.
 *         node oracle-claude-md.mjs --self-test   — fixtures double sens.
 *
 * Le self-test est arrivé tard, et son absence était le défaut : cet oracle gardait le plafond
 * du noyau depuis TF-0037 sans que personne ait jamais prouvé qu'il SAIT échouer. Un gardien
 * qu'on n'a pas vu refuser est un gardien supposé. Trouvé le 15/08 par `self-tests.mjs` dès son
 * premier passage — c'est exactement ce qu'un agrégateur existe pour trouver.
 */
// Exit : 0 = conforme · 1 = defaut MESURE. Cet oracle n'a AUCUN chemin « je ne peux pas
// mesurer » : il ne depend d'aucun outil externe et lit des fichiers du depot. Le declarer
// vaut mieux que de le taire — un contrat muet laisse croire qu'un 1 peut etre une panne
// d'environnement (TF-0648).
import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const PLAFOND = 6144;

function juger(racine) {
  const findings = [];
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });

  const noyau = join(racine, "CLAUDE.md");
  if (!existsSync(noyau)) {
    ko("N1", "CLAUDE.md absent");
    return findings;
  }
  // TF-0417 (20/08) : octets comptés APRÈS normalisation CRLF→LF — sur un checkout Windows
  // (core.autocrlf) le même noyau pesait 98 octets de plus et le verdict dépendait du poste,
  // pas du contenu (idiome TF-0253/TF-0359 : le contenu se juge en LF).
  const taille = Buffer.byteLength(readFileSync(noyau, "utf8").split("\r\n").join("\n"), "utf8");
  taille <= PLAFOND
    ? ok("N1", `noyau ${taille} octets ≤ ${PLAFOND}`)
    : ko("N1", `noyau ${taille} octets > plafond ${PLAFOND} — déplacer le détail vers references\\`);

  const texte = readFileSync(noyau, "utf8");
  const citees = new Set([...texte.matchAll(/references\\([\w-]+\.md)/g)].map((m) => m[1]));
  for (const f of citees)
    existsSync(join(racine, "references", f))
      ? ok("N2", `references\\${f} cité et présent`)
      : ko("N2", `references\\${f} cité par le noyau mais ABSENT`);
  const refDir = join(racine, "references");
  if (existsSync(refDir))
    for (const f of readdirSync(refDir).filter((n) => n.endsWith(".md")))
      if (!citees.has(f)) ko("N3", `references\\${f} existe mais n'est pas cité par le noyau (orphelin)`);
  if (!findings.some((x) => x.regle === "N3")) ok("N3", "aucune référence orpheline");
  return findings;
}

// ---- self-test : chaque règle dans les DEUX sens ---------------------------------------------
function selfTest() {
  const cas = [];
  const monter = (noyauTexte, refs) => {
    const base = mkdtempSync(join(tmpdir(), "noyau-"));
    mkdirSync(join(base, "references"));
    writeFileSync(join(base, "CLAUDE.md"), noyauTexte);
    for (const [nom, contenu] of Object.entries(refs)) writeFileSync(join(base, "references", nom), contenu);
    return base;
  };
  const echoue = (findings, regle) => findings.some((f) => f.regle === regle && f.statut === "FAIL");

  // Vert : noyau court, une référence citée et présente, aucune orpheline.
  const vert = juger(monter("noyau bref citant `references\\ACCUEIL.md`.\n", { "ACCUEIL.md": "x" }));
  cas.push(["vert — noyau conforme", !vert.some((f) => f.statut === "FAIL")]);

  // N1 : le plafond. La règle la plus utile de l'oracle, et celle qui n'avait jamais échoué
  // sous les yeux de personne — un octet de trop DOIT suffire, sinon la borne est molle.
  const trop = juger(monter("x".repeat(PLAFOND + 1), {}));
  cas.push(["N1  — un seul octet au-dessus du plafond", echoue(trop, "N1")]);
  const pile = juger(monter("x".repeat(PLAFOND), {}));
  cas.push(["N1  — exactement au plafond (borne inclusive)", !echoue(pile, "N1")]);

  // N2 : une référence citée mais absente — le noyau promet une page qui n'existe pas.
  const absente = juger(monter("cite `references\\FANTOME.md`.\n", {}));
  cas.push(["N2  — référence citée mais absente", echoue(absente, "N2")]);

  // N3 : une page de references\ que le noyau ne cite pas — donc jamais chargée par un run.
  const orpheline = juger(monter("cite `references\\ACCUEIL.md`.\n", { "ACCUEIL.md": "x", "ORPHELINE.md": "y" }));
  cas.push(["N3  — page de references\\ non citée", echoue(orpheline, "N3")]);

  // Noyau absent : refus franc, jamais un PASS par défaut.
  const vide = juger(mkdtempSync(join(tmpdir(), "vide-")));
  cas.push(["N1  — CLAUDE.md absent", echoue(vide, "N1")]);

  let bons = 0;
  for (const [nom, tenu] of cas) {
    console.log(`  [${tenu ? "OK    " : "ECHEC "}] ${nom}`);
    if (tenu) bons += 1;
  }
  console.log(`Self-test oracle-claude-md : ${bons}/${cas.length}`);
  return bons === cas.length ? 0 : 1;
}

// ---- entrée -----------------------------------------------------------------------------------
if (process.argv.includes("--self-test")) process.exit(selfTest());

const racine = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), "..");
const findings = juger(racine);
const echecs = findings.filter((f) => f.statut === "FAIL").length;
console.log(JSON.stringify({ oracle: "oracle-claude-md", version: "1.1.0", verdict: echecs ? "FAIL" : "PASS", findings }, null, 1));
process.exit(echecs ? 1 : 0);
