#!/usr/bin/env node
/**
 * recopier-heritage.test.mjs — le geste unique de remise à niveau (TF-0711), dans les deux sens.
 *
 * Ce que la recette verrouille : il copie TOUT ce que le contrat déclare en copie_conforme, il
 * ne touche JAMAIS un mode personnalisé, il refuse un dépôt jamais instancié et le pilot
 * lui-même, et `--essai` n'écrit rien. Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "recopier-heritage.mjs");
const PILOT = join(ICI, "..");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (cond, message) => { if (!cond) throw new Error(message); };

const T = mkdtempSync(join(tmpdir(), "recopier-"));
const lancer = (cible, ...flags) => {
  const r = spawnSync(process.execPath, [OUTIL, cible, ...flags], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};

try {
  check("un produit instancié reçoit TOUTES les copies conformes du contrat, et R-47 les reconnaît", () => {
    const produit = join(T, "produit");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code} : ${r.sortie.slice(0, 200)}`);
    const contrat = JSON.parse(readFileSync(join(PILOT, "gabarits", "HERITAGE.json"), "utf8"));
    for (const a of contrat.artefacts.filter((x) => x.mode === "copie_conforme")) {
      const dst = join(produit, String(a.cible).replaceAll("/", "\\"));
      att(existsSync(dst), `${a.cible} non copié`);
      const norm = (s) => String(s).split("\r\n").join("\n").trimEnd();
      att(norm(readFileSync(dst, "utf8")) === norm(readFileSync(join(PILOT, a.source), "utf8")),
        `${a.cible} copié mais différent de sa source`);
    }
  });

  check("les modes PERSONNALISÉS ne sont jamais écrits — les écraser détruirait la personnalisation", () => {
    const produit = join(T, "produit-perso");
    mkdirSync(join(produit, "forge"), { recursive: true });
    mkdirSync(join(produit, ".claude"), { recursive: true });
    writeFileSync(join(produit, ".claude", "settings.json"), '{"perso":true}', "utf8");
    writeFileSync(join(produit, "CLAUDE.md"), "# mes consignes\n", "utf8");
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code}`);
    att(readFileSync(join(produit, ".claude", "settings.json"), "utf8") === '{"perso":true}',
      "settings.json personnalisé a été écrasé");
    att(readFileSync(join(produit, "CLAUDE.md"), "utf8") === "# mes consignes\n",
      "CLAUDE.md personnalisé a été écrasé");
    att(/LAISSÉ/.test(r.sortie), "les artefacts laissés au produit ne sont pas dits");
  });

  check("second passage : tout est CONFORME, rien n'est réécrit ni compté copié", () => {
    const produit = join(T, "produit");
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code}`);
    att(/^0 copié/m.test(r.sortie) || /\n0 copié/.test(r.sortie), `un second passage a recopié : ${r.sortie.slice(-200)}`);
  });

  check("--essai n'écrit RIEN", () => {
    const produit = join(T, "produit-essai");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const r = lancer(produit, "--essai");
    att(r.code === 0, `exit ${r.code}`);
    att(!existsSync(join(produit, "forge", "RESTITUTION.md")), "l'essai a écrit un artefact");
    att(/ESSAI — rien écrit/.test(r.sortie), "l'essai ne se déclare pas");
  });

  check("garde — un dépôt SANS forge\\ est refusé : l'instanciation est un run, pas une recopie", () => {
    const nu = join(T, "depot-nu");
    mkdirSync(nu, { recursive: true });
    const r = lancer(nu);
    att(r.code === 2, `exit ${r.code} attendu 2`);
    att(/jamais été instancié/.test(r.sortie), "le refus ne dit pas sa cause");
  });

  check("garde — le pilot lui-même est refusé", () => {
    const r = lancer(PILOT);
    att(r.code === 2, `exit ${r.code} attendu 2 — le pilot s'est recopié sur lui-même`);
  });

  // ── TF-0850 : un artefact PERSONNALISABLE **ABSENT** n'a rien à protéger ───────────────────
  // Mesure du 06/09, identique chez TROIS produits : le geste unique laissait QUATRE artefacts
  // absents et R-47 restait rouge — « remise à niveau EN UN GESTE » promettait la moitié du geste.
  check("TF-0850 — un artefact personnalisable ABSENT est INSTANCIÉ depuis son gabarit, et R-47 cesse de le compter absent", () => {
    const produit = join(T, "produit-absents");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code}`);
    att(existsSync(join(produit, "CLAUDE.md")), "CLAUDE.md, mode personnalisé et ABSENT, n'a pas été instancié");
    att(existsSync(join(produit, ".gitignore")), ".gitignore, mode personnalisé et ABSENT, n'a pas été instancié");
    att(/INSTANCIÉ/.test(r.sortie), "l'instanciation n'est pas dite");
  });

  check("TF-0850 borne — un artefact personnalisable PRÉSENT n'est JAMAIS écrasé : c'est la garde qui donne sa valeur au script", () => {
    const produit = join(T, "produit-absents");
    writeFileSync(join(produit, "CLAUDE.md"), "# mes consignes a moi\n", "utf8");
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code}`);
    att(readFileSync(join(produit, "CLAUDE.md"), "utf8") === "# mes consignes a moi\n",
      "un fichier personnalisé PRÉSENT a été écrasé — la personnalisation est perdue sans recours");
  });

  check("TF-0850 — un `.gitignore` PRÉSENT auquel il manque des motifs est COMPLÉTÉ en fin de fichier, et l'ORDRE est signalé", () => {
    const produit = join(T, "produit-motifs");
    mkdirSync(join(produit, "forge"), { recursive: true });
    writeFileSync(join(produit, ".gitignore"), "__pycache__/\n!forge/**\n", "utf8");
    const r = lancer(produit);
    const apres = readFileSync(join(produit, ".gitignore"), "utf8");
    att(/^__pycache__\/$/m.test(apres), "le contenu d'origine a été perdu — les motifs doivent s'AJOUTER, pas écraser");
    att(/node_modules\//.test(apres), "les motifs manquants du socle n'ont pas été ajoutés");
    att(/COMPLÉTÉ/.test(r.sortie), "la complétion n'est pas dite");
    att(/l'ORDRE décide du résultat/.test(r.sortie),
      "l'avertissement sur l'ordre manque — chez un produit, insérer une exclusion APRÈS `!forge/**` a re-ignoré onze fichiers");
  });

  // ── TF-0852 (b) : la garde git, qui vivait dans la PROSE d'un mandat humain ────────────────
  check("TF-0852 — une cible MODIFIÉE et non commise fait basculer le geste en essai, et demande --forcer", () => {
    const produit = join(T, "produit-git");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const g = (...a) => spawnSync("git", ["-C", produit, "-c", "user.email=t@t", "-c", "user.name=t", "-c", "commit.gpgsign=false", ...a], { encoding: "utf8" });
    g("init", "-q", "-b", "main");
    lancer(produit);                                   // premier passage : tout est écrit
    g("add", "-A"); g("commit", "-q", "-m", "socle");
    writeFileSync(join(produit, "forge", "travaux", "TRAVAUX-PILOT.md"), "# travail local non commis\n", "utf8");
    const r = lancer(produit);
    att(r.code === 0, `exit ${r.code}`);
    att(/\[GARDE\]/.test(r.sortie), "aucune garde n'a joué : le travail local a été écrasé en silence");
    att(/--forcer/.test(r.sortie), "la garde ne dit pas comment passer outre");
    att(readFileSync(join(produit, "forge", "travaux", "TRAVAUX-PILOT.md"), "utf8") === "# travail local non commis\n",
      "le fichier modifié a été écrasé malgré la garde");
  });

  check("TF-0852 borne — `--forcer` écrase, et c'est le SEUL moyen : le cas nominal n'est pas ralenti", () => {
    const produit = join(T, "produit-git");
    const r = lancer(produit, "--forcer");
    att(r.code === 0, `exit ${r.code}`);
    att(readFileSync(join(produit, "forge", "travaux", "TRAVAUX-PILOT.md"), "utf8") !== "# travail local non commis\n",
      "--forcer n'écrase pas — la porte de sortie n'existe pas");
  });

  // ── TF-0851 (2) : le geste rend compte de ce qu'il laisse au dépôt ─────────────────────────
  check("TF-0851 — le geste imprime la ligne `git add` des fichiers qu'il vient d'écrire", () => {
    const produit = join(T, "produit-add");
    mkdirSync(join(produit, "forge"), { recursive: true });
    const r = lancer(produit);
    att(/git add /.test(r.sortie), "le geste n'a pas proposé le commit de ce qu'il a écrit");
    att(/n'est TENUE qu'une fois commise/i.test(r.sortie),
      "le geste ne dit pas qu'une recopie hors de l'histoire ne tient rien — un clone neuf repartirait sans elle");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nrecopier-heritage (TF-0711) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
