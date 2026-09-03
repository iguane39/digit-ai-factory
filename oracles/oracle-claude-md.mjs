#!/usr/bin/env node
/**
 * oracle-claude-md.mjs — plafond de taille du noyau CLAUDE.md + intégrité des références
 * (TF-0037/TF-0053). Règles :
 *  N1  CLAUDE.md ≤ 6144 octets (le noyau reste lisible en session — ×3,8 en 5 jours avant borne)
 *  N2  chaque fichier `references\<X>.md` cité par le noyau existe
 *  N3  chaque fichier de references\ est cité par le noyau, directement ou PAR UN DOCUMENT QUE LE
 *      NOYAU CITE (l'index `references\INDEX.md`, décision D-3 (b) du 03/09/2026 : le noyau est au
 *      plafond, sept références restaient orphelines et le contrôle rouge finissait par être ignoré) ;
 *      une citation transitive ne vaut que si le document citant est lui-même atteint depuis le
 *      noyau. N2 vaut aussi pour les entrées de l'index : un document cité et absent est un défaut.
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

  const refDir = join(racine, "references");
  // Une citation est `references\X.md` en tête de chemin : `skills\…\references\X.md` désigne le
  // dossier d'un AUTRE dépôt (trouvé le 03/09 dans ETAPES-RUN.md dès la première lecture transitive).
  const RE_CITATION = /(?<![\\/\w])references\\([\w-]+\.md)/g;
  const citer = (contenu) => new Set([...contenu.matchAll(RE_CITATION)].map((m) => m[1]));
  // Clôture des citations depuis le noyau (D-3 (b), 03/09/2026) : un document atteint est lu à son
  // tour, et ce qu'il cite devient atteint — l'index n'est pas un cas spécial, c'est une référence
  // citée qui cite. Une référence que seul un document NON atteint cite reste orpheline.
  const citees = citer(readFileSync(noyau, "utf8"));
  const parQui = new Map([...citees].map((f) => [f, "le noyau"]));
  const aLire = [...citees];
  while (aLire.length) {
    const f = aLire.shift();
    const chemin = join(refDir, f);
    if (!existsSync(chemin)) continue;
    for (const g of citer(readFileSync(chemin, "utf8")))
      if (!citees.has(g)) { citees.add(g); parQui.set(g, `references\\${f}`); aLire.push(g); }
  }
  for (const f of citees)
    existsSync(join(refDir, f))
      ? ok("N2", `references\\${f} cité par ${parQui.get(f)} et présent`)
      : ko("N2", `references\\${f} cité par ${parQui.get(f)} mais ABSENT`);
  if (existsSync(refDir))
    for (const f of readdirSync(refDir).filter((n) => n.endsWith(".md")))
      if (!citees.has(f)) ko("N3", `references\\${f} existe mais n'est cité ni par le noyau ni par un document qu'il cite (orphelin)`);
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

  // N3 transitif (D-3 (b), 03/09) : une page citée seulement par l'index, lui-même cité par le
  // noyau, est ATTEINTE ; la même page citée par un index que le noyau ne cite pas reste orpheline
  // — et l'index aussi. Une entrée d'index vers un fichier absent tombe sous N2.
  const parIndex = juger(monter("cite `references\\INDEX.md`.\n", { "INDEX.md": "cite `references\\ACCUEIL.md`", "ACCUEIL.md": "x" }));
  cas.push(["N3  — page citée par l'index que le noyau cite (transitif)", !echoue(parIndex, "N3") && !echoue(parIndex, "N2")]);
  const indexOrphelin = juger(monter("rien.\n", { "INDEX.md": "cite `references\\ACCUEIL.md`", "ACCUEIL.md": "x" }));
  cas.push(["N3  — index non cité par le noyau : lui et ce qu'il cite restent orphelins", echoue(indexOrphelin, "N3")]);
  const entreeMorte = juger(monter("cite `references\\INDEX.md`.\n", { "INDEX.md": "cite `references\\FANTOME.md`" }));
  cas.push(["N2  — entrée d'index vers un fichier absent", echoue(entreeMorte, "N2")]);

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
console.log(JSON.stringify({ oracle: "oracle-claude-md", version: "1.2.0", verdict: echecs ? "FAIL" : "PASS", findings }, null, 1));
process.exit(echecs ? 1 : 0);
