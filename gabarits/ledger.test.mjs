#!/usr/bin/env node
/**
 * ledger.test.mjs — recette à double sens du gabarit `gabarits\ledger.py` (TF-1205). Joué par
 * `oracles\self-tests.mjs` (I2).
 *
 * LE DÉFAUT REJOUÉ. Sous une console Windows en cp1252, `python forge/ledger.py etape_close --resume "21/100 → 89/100"`
 * écrivait l'entrée puis levait `UnicodeEncodeError` à l'affichage : code de sortie 1 là où l'écriture avait réussi.
 * Le témoin ROUGE est le gabarit privé de ses deux protections (flux forcés en UTF-8, affichage de repli) : il doit
 * reproduire le défaut exact (entrée écrite ET sortie en échec). Le VERT est le gabarit lui-même, sous la même console.
 *
 * SANS python sur le poste, la recette se déclare NON JOUÉE et sort 0 : elle ne compte ni pour ni contre.
 */
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
// Fins de ligne normalisées : un poste qui extrait le gabarit en CRLF faisait manquer la chirurgie du
// rouge, écrite en LF (12/10/2026, harnais du pilot 2 FAIL sur ce seul motif).
const GABARIT = readFileSync(join(ICI, "ledger.py"), "utf8").replace(/\r\n/g, "\n");
const PYTHON = ["python", "python3", "py"].find((bin) => {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
});
if (!PYTHON) {
  console.log("\nledger.py : NON JOUÉ — aucun interpréteur python sur ce poste (ni pour ni contre)");
  process.exit(0);
}

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

// La console du défaut : cp1252, sans le mode UTF-8 de Python. PYTHONIOENCODING fixe l'encodage des flux standard.
const CONSOLE = { ...process.env, PYTHONIOENCODING: "cp1252", PYTHONUTF8: "0" };
const RESUME = "21/100 → 89/100";

/** Un produit jetable : `forge\ledger.py` du texte donné, run ouvert. */
function produit(texte) {
  const d = mkdtempSync(join(tmpdir(), "ledger-gabarit-"));
  mkdirSync(join(d, "forge"));
  writeFileSync(join(d, "forge", "ledger.py"), texte, "utf8");
  const script = join(d, "forge", "ledger.py");
  const ouvrir = spawnSync(PYTHON, [script, "run_open", "--run_id", "essai"], { encoding: "utf8", env: CONSOLE });
  att(ouvrir.status === 0, `run_open refusé : ${ouvrir.stderr}`);
  return { d, script };
}
const entrees = (d) => readFileSync(join(d, "forge", "ledger.jsonl"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

// Le témoin rouge : le gabarit privé de ses deux protections. La chirurgie est VÉRIFIÉE, sans quoi le rouge serait vide.
const sansFlux = GABARIT.replace(/for _flux in \(sys\.stdout, sys\.stderr\):[\s\S]*?pass\n/, "");
const MUTANT = sansFlux.replace("    afficher(ajouter(run, type_, **champs))", "    print(json.dumps(ajouter(run, type_, **champs), ensure_ascii=False))");

const dossiers = [];
try {
  check("témoin — la chirurgie du rouge a bien retiré les deux protections du gabarit", () => {
    att(sansFlux !== GABARIT && !/_flux\.reconfigure/.test(sansFlux), "le bloc des flux n'a pas été retiré");
    att(MUTANT !== sansFlux && !/afficher\(ajouter/.test(MUTANT), "l'affichage de repli n'a pas été retiré");
  });

  check("rouge — sans les protections, une flèche sous cp1252 écrit l'entrée PUIS sort en échec (le défaut du 13/09)", () => {
    const { d, script } = produit(MUTANT); dossiers.push(d);
    const r = spawnSync(PYTHON, [script, "etape_close", "--resume", RESUME], { encoding: "utf8", env: CONSOLE });
    att(r.status !== 0, `le mutant n'échoue pas (exit ${r.status}) : le test ne reproduit pas le défaut`);
    att(/UnicodeEncodeError/.test(r.stderr), `l'échec n'est pas l'erreur d'encodage : ${r.stderr.slice(-200)}`);
    const e = entrees(d);
    att(e.length === 2 && e[1].resume === RESUME, "l'entrée n'a pas été écrite avant l'échec : ce n'est pas le défaut décrit");
  });

  check("vert — le gabarit sous la même console écrit l'entrée et SORT 0, la flèche affichée en UTF-8", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const r = spawnSync(PYTHON, [script, "etape_close", "--resume", RESUME], { env: CONSOLE });
    att(r.status === 0, `exit ${r.status} : ${r.stderr}`);
    const sortie = JSON.parse(r.stdout.toString("utf8"));
    att(sortie.seq === 2 && sortie.resume === RESUME, `confirmation illisible : ${r.stdout.toString("utf8")}`);
    att(entrees(d).length === 2 && entrees(d)[1].resume === RESUME, "le ledger ne porte pas l'entrée exacte");
  });

  check("vert — rejouer une commande réussie ajoute UNE entrée de plus, jamais un doublon silencieux d'un échec", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    for (let i = 0; i < 2; i++) att(spawnSync(PYTHON, [script, "retour", "--resume", RESUME], { env: CONSOLE }).status === 0, "rejeu refusé");
    att(entrees(d).map((x) => x.seq).join() === "1,2,3", "seq non strictement croissants");
  });

  check("rouge → vert — « --help » et un type qui commence par un tiret n'écrivent rien au ledger (revue de l'œil critique, 26/10/2026)", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const avant = entrees(d).length;
    const aide = spawnSync(PYTHON, [script, "--help"], { env: CONSOLE });
    const tiret = spawnSync(PYTHON, [script, "--resume", RESUME], { env: CONSOLE });
    att(aide.status === 0, `--help exit ${aide.status}`);
    att(tiret.status !== 0, "un type « --resume » a été accepté");
    att(entrees(d).length === avant, `${entrees(d).length - avant} entrée(s) parasite(s) écrite(s)`);
  });

  check("vert — --verifier affiche ses accents (« INTÈGRE », « · ») sous cp1252 et sort 0", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    spawnSync(PYTHON, [script, "retour", "--resume", RESUME], { env: CONSOLE });
    const r = spawnSync(PYTHON, [script, "--verifier"], { env: CONSOLE });
    att(r.status === 0 && /INTÈGRE/.test(r.stdout.toString("utf8")), `exit ${r.status} : ${r.stderr}`);
  });

  check("vert — un flux qui refuse l'UTF-8 et ne sait pas se reconfigurer : repli ASCII échappé, entrée écrite, exit 0", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const harnais = join(d, "harnais.py");
    writeFileSync(harnais, [
      "import sys, runpy",
      "class Strict:",
      "    def __init__(self): self.sortie = []",
      "    def write(self, s):",
      "        s.encode('ascii')",
      "        self.sortie.append(s)",
      "        return len(s)",
      "    def flush(self): pass",
      "strict = Strict()",
      "reel = sys.stdout",
      "sys.stdout = strict",
      `sys.argv = ['ledger.py', 'retour', '--resume', ${JSON.stringify(RESUME)}]`,
      `runpy.run_path(${JSON.stringify(script)}, run_name='__main__')`,
      "reel.write(''.join(strict.sortie))",
    ].join("\n"), "utf8");
    const r = spawnSync(PYTHON, [harnais], { encoding: "utf8", env: CONSOLE });
    att(r.status === 0, `exit ${r.status} : ${r.stderr.slice(-300)}`);
    att(/\\u2192/.test(r.stdout), `le repli ASCII n'a pas été affiché : ${r.stdout}`);
    att(entrees(d).length === 2 && entrees(d)[1].resume === RESUME, "l'entrée n'est pas écrite telle quelle");
  });

  check("vert — un type inconnu est refusé sans rien écrire, et le gabarit garde le contrat (première entrée run_open)", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const r = spawnSync(PYTHON, [script, "inconnu"], { encoding: "utf8", env: CONSOLE });
    att(r.status !== 0 && entrees(d).length === 1, `exit ${r.status}, ${entrees(d).length} entrée(s)`);
  });

  // ---- TF-1575 (écriture concurrente : seq 283 porté deux fois le 22/09/2026) ------------------------
  const SANS_VERROU = GABARIT.replace("    prendre_verrou(verrou)\n", "");
  const SANS_NOMMER = GABARIT.replace(/        lignes_par_seq: dict = \{\}[\s\S]*?(?=        if e\[0\]\["type"\] != "run_open":)/, "");

  check("témoin — la chirurgie des rouges TF-1575 a bien retiré le verrou et le nommage du doublon", () => {
    att(SANS_VERROU !== GABARIT && !/\n    prendre_verrou\(verrou\)\n/.test(SANS_VERROU), "le verrou n'a pas été retiré");
    att(SANS_NOMMER !== GABARIT && !/lignes_par_seq/.test(SANS_NOMMER), "le nommage du doublon n'a pas été retiré");
  });

  check("vert — huit écritures SIMULTANÉES reçoivent huit seq distincts, consécutifs, sans verrou résiduel", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const harnais = join(d, "rafale.py");
    writeFileSync(harnais, [
      "import subprocess, sys",
      `ps = [subprocess.Popen([sys.executable, ${JSON.stringify(script)}, 'retour', '--resume', 'rafale ' + str(i)], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE) for i in range(8)]`,
      "codes = [p.wait() for p in ps]",
      "sys.exit(0 if all(c == 0 for c in codes) else 1)",
    ].join("\n"), "utf8");
    const r = spawnSync(PYTHON, [harnais], { encoding: "utf8", env: CONSOLE });
    att(r.status === 0, `une écriture de la rafale a échoué : ${r.stderr.slice(-300)}`);
    att(entrees(d).map((x) => x.seq).join() === "1,2,3,4,5,6,7,8,9", `seq : ${entrees(d).map((x) => x.seq).join()}`);
    att(!existsSync(join(d, "forge", "ledger.jsonl.lock")), "le verrou n'est pas libéré");
  });

  check("rouge — un verrou tenu par un autre écrivain REFUSE l'écriture (sortie non nulle, rien d'écrit) ; sans verrou dans le code, elle passait", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    writeFileSync(join(d, "forge", "ledger.jsonl.lock"), "", "utf8");
    const r = spawnSync(PYTHON, [script, "retour", "--resume", "x"], { encoding: "utf8", env: CONSOLE });
    att(r.status !== 0 && /verrou non obtenu/.test(r.stderr), `exit ${r.status} : ${r.stderr.slice(-200)}`);
    att(entrees(d).length === 1, "une entrée a été écrite malgré le verrou tenu");
    const m = produit(SANS_VERROU); dossiers.push(m.d);
    writeFileSync(join(m.d, "forge", "ledger.jsonl.lock"), "", "utf8");
    const rm = spawnSync(PYTHON, [m.script, "retour", "--resume", "x"], { encoding: "utf8", env: CONSOLE });
    att(rm.status === 0 && entrees(m.d).length === 2, "le mutant sans verrou aurait dû écrire malgré le verrou tenu : le témoin est vide");
  });

  check("vert — le seq vient de la FIN du fichier, pas du nombre de lignes", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const f = join(d, "forge", "ledger.jsonl");
    const premiere = readFileSync(f, "utf8");
    writeFileSync(f, premiere + premiere.replace('"seq": 1', '"seq": 5').replace('"seq":1', '"seq":5'), "utf8"); // 2 lignes, dernier seq 5
    const r = spawnSync(PYTHON, [script, "retour", "--resume", "x"], { encoding: "utf8", env: CONSOLE });
    att(r.status === 0 && entrees(d).pop().seq === 6, `seq attendu 6 : ${r.stdout}${r.stderr}`);
  });

  // ---- TF-1867 (18/10/2026) : numéroter après le PLUS GRAND seq déjà pris -------------------------
  // Chez un produit, la copie calculait `len(dejà) + 1` : 13 seq en double relevés le 15/10/2026 (RT-127).
  // Le gabarit calculait `dejà[-1]["seq"] + 1`, faux dès que la dernière ligne porte un numéro plus petit
  // qu'une précédente. Les deux mutants sont les deux calculs fautifs ; le vert est le gabarit.
  const SEQ_ACTUEL = '        seq = max((x["seq"] for x in dejà), default=0) + 1';
  const SEQ_DERNIERE = GABARIT.replace(SEQ_ACTUEL, '        seq = (dejà[-1]["seq"] if dejà else 0) + 1');
  const SEQ_NB_LIGNES = GABARIT.replace(SEQ_ACTUEL, '        seq = len(dejà) + 1');
  /** Écrit un journal aux seq donnés (le run_open porte le premier), à la suite du run_open de `produit()`. */
  const avecSeq = (d, seqs) => {
    const f = join(d, "forge", "ledger.jsonl");
    const lignes = seqs.map((n, i) => JSON.stringify({ seq: n, ts: "2026-10-15T08:00:00Z", type: i === 0 ? "run_open" : "retour", resume: "x" }));
    writeFileSync(f, lignes.join("\n") + "\n", "utf8");
  };
  const ajouterUne = (script) => spawnSync(PYTHON, [script, "retour", "--resume", "x"], { encoding: "utf8", env: CONSOLE });

  check("témoin — la chirurgie des rouges TF-1867 a bien remplacé le calcul du seq par les deux calculs fautifs", () => {
    att(GABARIT.includes(SEQ_ACTUEL), "le calcul attendu du gabarit (max + 1) est introuvable : la recette ne le vise plus");
    att(SEQ_DERNIERE !== GABARIT && !/default=0\) \+ 1/.test(SEQ_DERNIERE), "le mutant « dernière ligne + 1 » n'a pas été produit");
    att(SEQ_NB_LIGNES !== GABARIT && /len\(dejà\) \+ 1/.test(SEQ_NB_LIGNES), "le mutant « nombre de lignes + 1 » n'a pas été produit");
  });

  check("rouge — journal dont la dernière ligne porte un numéro inférieur au maximum (1,2,4,3) : « dernière ligne + 1 » redonne le 4 déjà pris", () => {
    const { d, script } = produit(SEQ_DERNIERE); dossiers.push(d);
    avecSeq(d, [1, 2, 4, 3]);
    att(ajouterUne(script).status === 0, "écriture refusée");
    const s = entrees(d).map((x) => x.seq);
    att(s.filter((n) => n === 4).length === 2, `le mutant ne reproduit pas le doublon (seq : ${s.join()})`);
  });
  check("rouge — journal à numéros sautés (1,5) : « nombre de lignes + 1 » écrit 3, sous le maximum (le défaut du produit)", () => {
    const { d, script } = produit(SEQ_NB_LIGNES); dossiers.push(d);
    avecSeq(d, [1, 5]);
    att(ajouterUne(script).status === 0, "écriture refusée");
    att(entrees(d).pop().seq === 3, `le mutant ne reproduit pas le défaut (seq : ${entrees(d).map((x) => x.seq).join()})`);
  });
  check("vert — dernière ligne inférieure au maximum (1,2,4,3) : le gabarit écrit 5, jamais un numéro déjà pris", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    avecSeq(d, [1, 2, 4, 3]);
    const r = ajouterUne(script);
    att(r.status === 0 && entrees(d).pop().seq === 5, `seq attendu 5 : ${r.stdout}${r.stderr}`);
  });
  check("vert — numéros sautés (1,5) : le gabarit écrit 6, strictement au-dessus du maximum", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    avecSeq(d, [1, 5]);
    const r = ajouterUne(script);
    att(r.status === 0 && entrees(d).pop().seq === 6, `seq attendu 6 : ${r.stdout}${r.stderr}`);
  });
  check("vert — journal sain : la suite reste 1,2,3 (le calcul ne change rien quand le journal est intègre)", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    att(ajouterUne(script).status === 0 && ajouterUne(script).status === 0, "écriture refusée");
    att(entrees(d).map((x) => x.seq).join() === "1,2,3", `seq : ${entrees(d).map((x) => x.seq).join()}`);
  });

  const avecDoublon = (d) => {
    const f = join(d, "forge", "ledger.jsonl");
    const l = readFileSync(f, "utf8").split("\n").filter(Boolean);
    const e = (n, t) => JSON.stringify({ seq: n, ts: "2026-09-22T20:21:01Z", type: t, resume: "x" });
    writeFileSync(f, [l[0], e(2, "retour"), e(3, "retour"), e(3, "question_humain"), e(4, "retour")].join("\n") + "\n", "utf8");
  };
  check("vert — --verifier NOMME le seq en double en tête des écarts (« seq 3 porté par 2 entrées, lignes 3, 4 »)", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    avecDoublon(d);
    const r = spawnSync(PYTHON, [script, "--verifier"], { env: CONSOLE });
    const sortie = r.stdout.toString("utf8").split("\n").filter((x) => /\[BLOQUANT\]/.test(x));
    att(r.status === 1, `exit ${r.status}`);
    att(/seq 3 porté par 2 entrées, lignes 3, 4/.test(sortie[0] || ""), `première rupture : ${sortie[0]}`);
  });
  check("rouge — sans le nommage, le doublon n'apparaît que comme « attendu » en cascade (le bruit de TF-1367)", () => {
    const { d, script } = produit(SANS_NOMMER); dossiers.push(d);
    avecDoublon(d);
    const r = spawnSync(PYTHON, [script, "--verifier"], { env: CONSOLE });
    att(!/porté par/.test(r.stdout.toString("utf8")), "le mutant nomme encore le doublon : le témoin est vide");
  });
  // TF-1892 (D-41 (a), 19/10/2026) : la copie héritée passe le lint du produit. Un produit lançait
  // `ruff check .` sur tout son dépôt et y lisait 7 erreurs, toutes dans forge/ledger.py (UP009, E401,
  // I001, F401 ×2, E741, UP017). Ruff n'est pas une dépendance du pilot : sans `uvx`, le cas se dit sauté.
  const RUFF = ["--from", "ruff@0.14.0", "ruff", "check", "--no-cache", "--select", "E4,E7,E9,F,I,UP", "--target-version", "py312"];
  const uvx = spawnSync("uvx", ["--version"], { encoding: "utf8" });
  if (uvx.status !== 0) console.log("  [SAUTÉ] TF-1892 — uvx absent du poste : le lint du gabarit n'est pas joué");
  else {
    const ruff = (texte) => {
      const d = mkdtempSync(join(tmpdir(), "ledger-ruff-")); dossiers.push(d);
      writeFileSync(join(d, "ledger.py"), texte, "utf8");
      return spawnSync("uvx", [...RUFF, join(d, "ledger.py")], { encoding: "utf8" });
    };
    check("TF-1892 vert — gabarits/ledger.py passe ruff aux règles d'un produit (E4, E7, E9, F, I, UP)", () => {
      const r = ruff(GABARIT);
      att(r.status === 0, `ruff exit ${r.status} : ${(r.stdout || "").split("\n").filter((x) => /^[A-Z]+\d+ /.test(x)).join(" ; ")}`);
    });
    check("TF-1892 rouge — un import groupé sur une ligne est refusé (le témoin voit l'erreur)", () => {
      const r = ruff(GABARIT.replace(/^import json\nimport os\n/m, "import json, os\n"));
      att(r.status === 1 && /E401/.test(r.stdout || ""), `le mutant passe : exit ${r.status}`);
    });
  }
  // TF-2018 (RT-28, 29/10/2026) : R-19 prescrit `rectification_versions_forges`, que ce gabarit
  // refusait comme type inconnu. Test croisé : tout type de rectification nommé par un oracle ou un
  // script du pilot, ou par `ledger.mjs` de forge-agents quand le dépôt frère est là, est accepté ici.
  const typesDe = (texte) => new Set([...texte.matchAll(/"(rectification_[a-z_]+)"/g)].map((m) => m[1]));
  const vocabulaire = (texte) => new Set([...(texte.match(/TYPES = \{([\s\S]*?)\}/) || ["", ""])[1].matchAll(/"([a-z_]+)"/g)].map((m) => m[1]));
  const prescrits = new Set();
  for (const dossier of ["oracles", "scripts"]) {
    const d = join(ICI, "..", dossier);
    for (const f of readdirSync(d).filter((x) => x.endsWith(".mjs") && !x.includes(".test.")))
      for (const t of typesDe(readFileSync(join(d, f), "utf8"))) prescrits.add(t);
  }
  const LEDGER_MJS = join(ICI, "..", "..", "digit-ai-forge-agents", ".claude", "skills", "forge-agents", "scripts", "ledger.mjs");
  if (existsSync(LEDGER_MJS)) for (const t of typesDe(readFileSync(LEDGER_MJS, "utf8"))) prescrits.add(t);
  check(`TF-2018 vert — les ${prescrits.size} types de rectification prescrits par le parc sont au vocabulaire du gabarit`, () => {
    const v = vocabulaire(GABARIT);
    const manquants = [...prescrits].filter((t) => !v.has(t));
    att(prescrits.size >= 2, `relevé vide (${prescrits.size}) : le test croisé ne voit rien`);
    att(!manquants.length, `hors vocabulaire : ${manquants.join(", ")}`);
  });
  check("TF-2018 rouge — sans rectification_versions_forges au vocabulaire, le test croisé le voit", () => {
    const mutant = GABARIT.replace(' "rectification_versions_forges",', "");
    att(mutant !== GABARIT, "chirurgie sans effet : le témoin est vide");
    att(!vocabulaire(mutant).has("rectification_versions_forges") && prescrits.has("rectification_versions_forges"), "le mutant passe");
  });
  check("TF-2018 vert — la rectification écrite en ligne de commande porte seq_vise en NOMBRE et --verifier ne la déclare pas", () => {
    const { d, script } = produit(GABARIT); dossiers.push(d);
    const r = spawnSync(PYTHON, [script, "rectification_versions_forges", "--seq_vise", "1", "--cause", "versions des forges non relevées à l ouverture du run"], { encoding: "utf8", env: CONSOLE });
    att(r.status === 0, `écriture refusée : ${r.stderr}`);
    const e = entrees(d).at(-1);
    att(e.type === "rectification_versions_forges" && e.seq_vise === 1, `entrée écrite : ${JSON.stringify(e)}`);
    const v = spawnSync(PYTHON, [script, "--verifier"], { encoding: "utf8", env: CONSOLE });
    att(v.status === 0 && !/DÉCLARÉ|DECLARE/.test(v.stdout), `--verifier : exit ${v.status} ${v.stdout}`);
  });
  check("TF-2018 vert — un run_open sans versions_forges est écrit, et l'oubli se dit sur la sortie d'erreur", () => {
    const d = mkdtempSync(join(tmpdir(), "ledger-gabarit-")); dossiers.push(d);
    mkdirSync(join(d, "forge"));
    writeFileSync(join(d, "forge", "ledger.py"), GABARIT, "utf8");
    const r = spawnSync(PYTHON, [join(d, "forge", "ledger.py"), "run_open", "--run_id", "essai"], { encoding: "utf8", env: { ...CONSOLE, PYTHONIOENCODING: "utf-8" } });
    att(r.status === 0 && entrees(d).length === 1, `exit ${r.status}`);
    att(/versions_forges/.test(r.stderr), `aucun rappel : ${r.stderr}`);
  });
} catch (e) { fail++; console.error(`  [FAIL] harnais — ${e.message}`); }
finally { for (const d of dossiers) if (existsSync(d)) rmSync(d, { recursive: true, force: true }); }

console.log(`\nledger.py (gabarit) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
