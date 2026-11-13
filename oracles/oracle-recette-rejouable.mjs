#!/usr/bin/env node
/**
 * oracle-recette-rejouable.mjs — UNE RECETTE QUI CONSOMME UN ÉTAT BORNÉ DANS LE TEMPS CRÉE SON PROPRE ÉTAT, OU DÉCLARE SA PÉRIODE DE REJEU
 * (TF-2438, 12/11/2026 ; règle écrite dans `references\CONVENTION-RECETTES.md`, section « Une recette qui consomme un état borné »).
 *
 * LE FAIT. Le 10/11/2026 à 22:28 UTC, la recette d'un produit sur une base de recette qui persiste a rendu 2 contrôles en FAIL (429
 * `budget_exceeded`) : la recette de 15:47 UTC avait consommé le budget d'un client, 90 jetons sur 24 h glissantes, et la base ne repart
 * pas de zéro entre deux passages (la commande `make test` repart d'une base vide et rendait PASS). Une recette rouge à lire et à
 * disculper, un rejeu reporté au lendemain : la recette n'était pas rejouable dans la fenêtre du budget qu'elle consomme.
 *
 * LA RÈGLE. Une recette qui consomme un état borné dans le temps (budget, quota, limite de débit, plafond sur une fenêtre) :
 *   · crée son PROPRE état à chaque passage (un client, un compte ou un jeton neuf, nommé du passage), ou
 *   · déclare sa PÉRIODE DE REJEU : le temps avant lequel un second passage sur la même base n'est pas jugé.
 * La déclaration est une ligne du fichier de la recette : `Rejeu : état créé à chaque passage` ou `Rejeu : période 24 h` (nombre et unité s, min, h ou j).
 *
 *   RJ1 · un fichier de recette qui porte le vocabulaire d'un état borné dans le temps (budget, quota, limite de débit, 429, fenêtre glissante,
 *         « par jour/heure », plafond journalier…) porte aussi une déclaration de rejeu bien formée. Sinon FAIL, avec les deux remèdes.
 *   RJ2 · une ligne `Rejeu :` qui ne dit ni « état créé à chaque passage » ni une période chiffrée est refusée (une déclaration qui ne dit rien).
 *
 * NON JUGÉ (déclaré). Que la déclaration soit VRAIE : « état créé à chaque passage » ne se lit pas dans un fichier, seul un second passage sur la même
 * base le prouve (c'est le cas rouge de la recette de forge-tests). Qu'une recette consomme un état borné SANS le vocabulaire ci-dessus : elle n'est
 * pas vue. Les fichiers qui ne sont pas des recettes (le code du produit). Le rejeu lui-même : cet oracle lit, il ne joue rien.
 *
 * Usage : node oracles/oracle-recette-rejouable.mjs <fichier ou dossier de recette>... [--json] · --self-test
 * Exit : 0 = PASS · 1 = FAIL · 2 = SKIP motivé (aucun fichier de recette à juger).
 */
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

// Un fichier de recette : test nommé comme tel, script de recette, Makefile, ou document de commandes qui décrit la recette.
const EST_RECETTE = /(?:\.(?:test|spec)\.(?:mjs|cjs|js|ts)$|(?:^|[\\/])test_[^\\/]*\.py$|_test\.py$|(?:^|[\\/])Makefile$|\.mk$|(?:^|[\\/])recette[^\\/]*\.(?:sh|mjs|py|md|ya?ml)$|(?:^|[\\/])COMMANDES\.md$)/i;
const SAUTES = new Set(["node_modules", ".git", ".venv", "__pycache__", "dist", "build", "old", "coverage"]);
// Le vocabulaire d'un état borné dans le temps. Volontairement étroit : un faux positif oblige à écrire une ligne, un faux négatif laisse le défaut.
const ETAT_BORNE = /\bbudget(?:_exceeded)?\b|\bquotas?\b|\brate[ _-]?limit|\btoo many requests\b|(?<![\d.])429(?![\d.])|\bfen[êe]tre glissante\b|\b\d+\s?h glissantes?\b|\bglissantes?\b|\b(?:par|per)\s+(?:jour|heure|minute|mois|day|hour|minute|month)\b|\bplafond\s+(?:journalier|horaire|mensuel)\b|\b(?:daily|hourly|monthly) (?:limit|cap)\b/i;
const DECLARATION = /^[\s#*>\/\-|]*Rejeu\s*:\s*(.*)$/im;
const FORME_VALIDE = /^(?:[ée]tat cr[ée]{2} [àa] chaque passage|p[ée]riode\s*[:=]?\s*\d+(?:[.,]\d+)?\s*(?:s|min|h|j)\b)/i;

export function juger(fichier, texte) {
  const m = ETAT_BORNE.exec(texte);
  if (!m) return { regle: "RJ1", statut: "SANS_OBJET", ou: fichier, message: "aucun état borné dans le temps nommé : rien à déclarer" };
  const d = DECLARATION.exec(texte);
  if (!d) return { regle: "RJ1", statut: "FAIL", ou: fichier, message: `le fichier de recette nomme un état borné dans le temps (« ${m[0]} ») sans déclarer son rejeu : ajoute la ligne `
    + "« Rejeu : état créé à chaque passage » (un client, un compte ou un jeton neuf à chaque passage) ou « Rejeu : période 24 h » (le temps avant lequel un second passage sur la même base n'est pas jugé)" };
  if (!FORME_VALIDE.test(d[1].trim())) return { regle: "RJ2", statut: "FAIL", ou: fichier, message: `la ligne « Rejeu : ${d[1].trim().slice(0, 60)} » ne dit ni « état créé à chaque passage » ni une période chiffrée (nombre et unité s, min, h ou j)` };
  return { regle: "RJ1", statut: "PASS", ou: fichier, message: `état borné (« ${m[0]} ») et rejeu déclaré : ${d[1].trim().slice(0, 60)}` };
}

function fichiersDe(cible, profondeur = 0, out = []) {
  if (!existsSync(cible)) return out;
  if (statSync(cible).isFile()) { if (EST_RECETTE.test(cible)) out.push(cible); return out; }
  if (profondeur > 4) return out;
  for (const e of readdirSync(cible, { withFileTypes: true })) {
    if (SAUTES.has(e.name)) continue;
    const c = join(cible, e.name);
    if (e.isDirectory()) fichiersDe(c, profondeur + 1, out); else if (EST_RECETTE.test(c)) out.push(c);
  }
  return out;
}

export function jugerCibles(cibles) {
  const fichiers = cibles.flatMap((c) => fichiersDe(c));
  const findings = fichiers.map((f) => juger(f, readFileSync(f, "utf8")));
  const verdict = !fichiers.length ? "SKIP" : findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS";
  return { verdict, fichiers: fichiers.length, findings };
}

const NON_JUGE = ["que la déclaration soit vraie (« état créé à chaque passage » se prouve par un second passage sur la même base : cas rouge de la recette de forge-tests)",
  "une recette qui consomme un état borné sans le vocabulaire de RJ1 : elle n'est pas vue", "les fichiers qui ne sont pas des recettes", "le rejeu lui-même : cet oracle lit, il ne joue rien"];

const lanceEnDirect = process.argv[1] === fileURLToPath(import.meta.url);
if (lanceEnDirect && process.argv.includes("--self-test")) {
  const echecs = [];
  const racine = mkdtempSync(join(tmpdir(), "recette-rejouable-"));
  const poser = (nom, contenu) => { const p = join(racine, nom); mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, contenu, "utf8"); return p; };
  const verdictDe = (nom, contenu) => jugerCibles([poser(nom, contenu)]);
  let n = 0;
  const attendu = (cas, v, f, extrait = null) => {
    n++;
    if (v.verdict !== f || (extrait && !v.findings.some((x) => extrait.test(x.message)))) echecs.push(`${cas} : attendu ${f}${extrait ? ` ${extrait}` : ""}, obtenu ${v.verdict} ${JSON.stringify(v.findings.map((x) => x.message)).slice(0, 200)}`);
  };
  try {
    const CONSOMME = "// recette : le client a un budget de 90 jetons sur 24 h glissantes\nassert.equal(appel().status, 429); // budget_exceeded\n";
    attendu("1 ROUGE — une recette qui consomme un budget sur 24 h glissantes sans déclarer son rejeu", verdictDe("a/budget.test.mjs", CONSOMME), "FAIL", /Rejeu : état créé à chaque passage/);
    attendu("1 bis — le message propose les DEUX remèdes", verdictDe("a2/budget.test.mjs", CONSOMME), "FAIL", /Rejeu : période 24 h/);
    attendu("2 VERT — le remède joué : « Rejeu : état créé à chaque passage »", verdictDe("b/budget.test.mjs", "// Rejeu : état créé à chaque passage\n" + CONSOMME), "PASS", /rejeu déclaré/);
    attendu("3 VERT — le remède joué : « Rejeu : période 24 h »", verdictDe("c/budget.test.mjs", "# Rejeu : période 24 h\n" + CONSOMME), "PASS");
    attendu("3 bis VERT — période en minutes, dans un Makefile", verdictDe("d/Makefile", "test:\n\t# Rejeu : période 90 min (quota par heure)\n\tpytest\n"), "PASS");
    attendu("4 ROUGE — une déclaration qui ne dit rien est refusée (RJ2)", verdictDe("e/budget.test.mjs", "// Rejeu : plus tard\n" + CONSOMME), "FAIL", /ne dit ni/);
    attendu("4 bis ROUGE — une période sans unité est refusée", verdictDe("e2/budget.test.mjs", "// Rejeu : période 24\n" + CONSOMME), "FAIL", /ne dit ni/);
    attendu("5 VERT — une recette sans état borné n'a rien à déclarer", verdictDe("f/simple.test.mjs", "assert.equal(1 + 1, 2);\n"), "PASS", /rien à déclarer/);
    attendu("6 ROUGE — le quota d'un document de commandes (COMMANDES.md) est jugé comme une recette", verdictDe("g/COMMANDES.md", "## Tester\n\nLa recette consomme le quota de 100 requêtes par jour du client.\n"), "FAIL");
    attendu("7 le code du produit n'est pas une recette : le même texte dans app.js n'est pas jugé", jugerCibles([poser("h/app.js", CONSOMME)]), "SKIP");
    attendu("8 SKIP — un dossier sans fichier de recette", jugerCibles([join(racine, "inexistant")]), "SKIP");
    const dossier = jugerCibles([join(racine, "a")]);
    attendu("9 un dossier se parcourt : la recette fautive qu'il contient est vue", dossier, "FAIL");
    attendu("10 un faux positif de nombre : 1429 ou 4,29 ne sont pas 429", verdictDe("i/prix.test.mjs", "assert.equal(prix, 1429);\nassert.equal(total, '4,29');\n"), "PASS", /rien à déclarer/);
    // TF-2466 (13/11/2026) — L'APPEL. Le contrôle n'avait aucun appelant : l'étape 5 de `references\ETAPES-RUN.md` le prescrit désormais,
    // sur la racine du produit. Ces cas prouvent l'appel : la commande est LUE dans le document, puis JOUÉE telle qu'écrite (processus
    // fils, codes de sortie 1, 0 et 2), sur une racine de produit jetable. Le document sans la prescription est le sens rouge de la sonde.
    const ICI = dirname(fileURLToPath(import.meta.url));
    const commandeDe = (doc) => { const m = /`(node oracles\\oracle-recette-rejouable\.mjs <racine-produit>)`/.exec(doc); return m ? m[1] : null; };
    const verifier = (cas, ok, detail) => { n++; if (!ok) echecs.push(`${cas} : ${detail}`); };
    const prescrite = commandeDe(readFileSync(join(ICI, "..", "references", "ETAPES-RUN.md"), "utf8"));
    verifier("11 ROUGE puis VERT — l'étape 5 de ETAPES-RUN.md prescrit « node oracles\\oracle-recette-rejouable.mjs <racine-produit> »", prescrite !== null, "la commande n'est pas écrite dans references\\ETAPES-RUN.md");
    verifier("11 bis SENS ROUGE de la sonde — un document sans la prescription n'en rend aucune", commandeDe("## 5. Étape tests\n\n`uv run python -m forge_tests <racine-produit> --json`\n") === null, "la sonde trouve une commande dans un document qui n'en porte pas");
    const jouerPrescrite = (racineProduit) => {
      const [, script, ...reste] = (prescrite || "node oracles\\absente.mjs <racine-produit>").split(" ");
      const r = spawnSync(process.execPath, [join(ICI, "..", script.replaceAll("\\", "/")), ...reste.map((a) => (a === "<racine-produit>" ? racineProduit : a))], { encoding: "utf8" });
      let j = null; try { j = JSON.parse(r.stdout); } catch { /* sortie illisible : dite par le cas */ }
      return { code: r.status, verdict: j && j.verdict };
    };
    poser("p-rouge/tests/budget.test.mjs", CONSOMME);
    poser("p-vert/tests/budget.test.mjs", "// Rejeu : état créé à chaque passage\n" + CONSOMME);
    mkdirSync(join(racine, "p-vide"), { recursive: true });
    const rouge = jouerPrescrite(join(racine, "p-rouge")), vert = jouerPrescrite(join(racine, "p-vert")), vide = jouerPrescrite(join(racine, "p-vide"));
    verifier("12 ROUGE — la commande prescrite, jouée sur un produit dont la recette consomme un budget sans rejeu, sort en 1", rouge.code === 1 && rouge.verdict === "FAIL", `code ${rouge.code}, verdict ${rouge.verdict}`);
    verifier("13 VERT — la même commande sur un produit qui déclare « Rejeu : état créé à chaque passage » sort en 0", vert.code === 0 && vert.verdict === "PASS", `code ${vert.code}, verdict ${vert.verdict}`);
    verifier("14 SKIP — la même commande sur un produit sans fichier de recette sort en 2, jamais en 0", vide.code === 2 && vide.verdict === "SKIP", `code ${vide.code}, verdict ${vide.verdict}`);
  } finally { rmSync(racine, { recursive: true, force: true }); }
  if (echecs.length) { console.error(`oracle-recette-rejouable --self-test : ${echecs.length} échec(s)\n  - ${echecs.join("\n  - ")}`); process.exit(1); }
  console.log(`oracle-recette-rejouable --self-test : ${n} PASS, 0 FAIL — rouge sans déclaration, remèdes joués (état créé à chaque passage, période en h et en min), déclaration vide refusée, recette sans état borné, code non jugé, SKIP, dossier, faux positif de nombre, appel de l'étape 5 (commande lue dans ETAPES-RUN.md et jouée : exit 1, 0 et 2)`);
  process.exit(0);
}

if (lanceEnDirect) {
  const cibles = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const r = jugerCibles(cibles);
  console.log(JSON.stringify({ oracle: "oracle-recette-rejouable", version: "1.0.1", regle: "TF-2438 (references/CONVENTION-RECETTES.md)", verdict: r.verdict, fichiers_jugés: r.fichiers,
    findings: r.findings.filter((f) => f.statut !== "SANS_OBJET"), sans_objet: r.findings.filter((f) => f.statut === "SANS_OBJET").length,
    ...(r.verdict === "SKIP" ? { motif: "aucun fichier de recette (test, Makefile, script de recette, COMMANDES.md) sous la cible" } : {}), non_juge: NON_JUGE }));
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SKIP" ? 2 : 0);
}
