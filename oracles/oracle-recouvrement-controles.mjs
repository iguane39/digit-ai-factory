#!/usr/bin/env node
/**
 * oracle-recouvrement-controles.mjs — CE QUE LA CI JOUE EST ATTEIGNABLE EN LOCAL (R-50, TF-0545, 24/08/2026).
 *
 * LE FAIT, MESURÉ SUR UN DÉPÔT RÉEL. L'intégration continue jouait deux contrôles ; en local, la
 * session en jouait quatre autres. **Six contrôles, deux ensembles, recouvrement NUL** — et le
 * contrôle de la CI n'appelait aucun des locaux. Valider en local ne disait donc rien de la CI, et
 * réciproquement. Conséquence : une régression est passée jusqu'à la branche principale, la CI est
 * sortie rouge avec douze contrôles en échec, et la bascule de domaine a été bloquée plusieurs heures.
 *
 * CE QUI NE MARCHE PAS, ET IL FAUT LE DIRE : documenter la liste des contrôles. Une liste écrite à la
 * main dérive au premier ajout, et personne ne le voit — c'est le défaut que ce parc a déjà payé trois
 * fois (les zones de la recette, la liste des empreintes, les exclusions par suffixe). La liste se
 * DÉRIVE : on lit le workflow, et on exige que chacune de ses commandes soit atteignable localement.
 *
 *   RC1 · toute commande `run:` du workflow est atteignable par une cible locale déclarée
 *         (`package.json` scripts, `Makefile`, `justfile`, `tasks.py`). Une étape de CI qu'aucune
 *         commande locale ne rejoue est un contrôle qu'on ne peut pas passer avant de pousser.
 *   RC2 · il existe une cible AGRÉGÉE — une seule commande qui joue l'ensemble. Sans elle, le
 *         recouvrement dépend de la mémoire de qui pousse, et la mémoire n'est pas un mécanisme.
 *
 * CE QUE CET ORACLE NE FAIT PAS : jouer les contrôles. Il juge l'ATTEIGNABILITÉ, pas le résultat —
 * et il ne prétend pas qu'une cible locale fait la même chose que l'étape de CI qu'elle nomme. Cette
 * équivalence-là ne se lit pas dans un fichier ; ce qui se lit, c'est le trou béant du départ.
 *
 * Usage : node oracle-recouvrement-controles.mjs <racine-du-depot> [--json] · --self-test
 * Exit : 0 = PASS · 1 = FAIL · 2 = SKIP motivé (ni workflow ni cibles locales : rien à comparer).
 */
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");

const F = [];
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
const so = (regle, ou, message) => F.push({ regle, statut: "SANS_OBJET", ou, message });

const NON_JUGE = [
  "l'ÉQUIVALENCE entre une cible locale et l'étape de CI qu'elle nomme : cet oracle juge l'atteignabilité, pas le résultat. Une cible qui porte le bon nom et ne fait rien passerait — le trou qu'il ferme est celui du recouvrement NUL, mesuré, pas celui du contrôle menteur",
  "les étapes de CI qui ne sont pas des CONTRÔLES : installer une dépendance, publier un artefact, se connecter à un fournisseur. Elles n'ont pas à être rejouables en local, et exiger qu'elles le soient produirait du bruit",
  "les workflows d'un autre hébergeur que GitHub : la lecture est bornée à `.github/workflows/`, et un dépôt qui a sa CI ailleurs rend SANS_OBJET plutôt qu'un faux vert",
  "le fait qu'une cible locale soit RÉELLEMENT jouée avant de pousser : aucun fichier ne le dit. RC2 exige qu'elle EXISTE, ce qui est la condition nécessaire",
];

/** La CHARPENTE d'un script shell n'est pas une commande. Mesuré sur forge-audit le 24/08 : un bloc
 * `run: |` avec une boucle produisait trois « commandes » — « for f in … ; do », « fi », « done ».
 * Un contrôle qui compte des accolades pour des contrôles se décrédibilise en une lecture. */
const CHARPENTE_SHELL = /^(for|done|do|if|fi|then|else|elif|while|case|esac)\b|^[{};#]|^;;/;

/** Une étape de CI qui n'est pas un contrôle : rien à rejouer en local. */
const PAS_UN_CONTROLE = /^(npm|yarn|pnpm)\s+(ci|install)\b|^(pip|python -m pip)\s+install\b|^apt-get|^sudo |^docker (login|push|build)|^gh (release|auth)|^git (config|clone|fetch)|^echo |^mkdir |^cp |^curl -fsSL|^actions\//i;

/** Les fichiers qui déclarent des cibles locales. */
const PORTEURS = ["package.json", "Makefile", "makefile", "justfile", "Justfile", "tasks.py", "noxfile.py", "package-scripts.js"];

export function ciblesLocales(racine) {
  const cibles = new Set();
  const textes = [];
  for (const nom of PORTEURS) {
    const p = join(racine, nom);
    if (!existsSync(p)) continue;
    const brut = readFileSync(p, "utf8");
    textes.push(brut);
    if (nom === "package.json") {
      try {
        const j = JSON.parse(brut);
        for (const k of Object.keys(j.scripts || {})) cibles.add(k);
      } catch { /* un package.json cassé n'est pas notre sujet */ }
    } else {
      for (const m of brut.matchAll(/^([A-Za-z0-9_.-]+):(?!=)/gm)) cibles.add(m[1]);
      for (const m of brut.matchAll(/^\s*def\s+([a-z0-9_]+)\s*\(/gm)) cibles.add(m[1]);
    }
  }
  return { cibles, corpus: textes.join("\n") };
}

export function etapesCI(brut) {
  // On lit les `run:` — en ligne comme en bloc `|`. Pas de dépendance YAML : le parc n'en a pas, et
  // en ajouter une pour lire trois lignes coûterait plus que ça ne rapporte.
  const lignes = brut.split(/\r?\n/);
  const cmds = [];
  for (const [i, l] of lignes.entries()) {
    const enLigne = /^\s*-?\s*run:\s*(\S.*)$/.exec(l);
    if (enLigne && !/^[|>]/.test(enLigne[1].trim())) { cmds.push(enLigne[1].trim()); continue; }
    if (/^\s*-?\s*run:\s*[|>]/.test(l)) {
      const indent = (l.match(/^\s*/) || [""])[0].length;
      for (let k = i + 1; k < lignes.length; k++) {
        const suite = lignes[k];
        if (!suite.trim()) continue;
        if ((suite.match(/^\s*/) || [""])[0].length <= indent) break;
        cmds.push(suite.trim());
      }
    }
  }
  return cmds.filter((c) => !PAS_UN_CONTROLE.test(c) && !CHARPENTE_SHELL.test(c));
}

/** Une commande de CI est atteignable si une cible locale la nomme, ou si le corpus local la porte. */
export function atteignable(cmd, cibles, corpus) {
  const nu = cmd.replace(/^(npm|yarn|pnpm)\s+(run\s+)?/, "").split(/\s+/)[0];
  if (cibles.has(nu)) return true;
  // La commande elle-même écrite dans une cible locale (un `make` qui appelle le script directement).
  const noyau = cmd.replace(/\s+/g, " ").trim();
  if (noyau.length > 8 && corpus.includes(noyau)) return true;
  // Le FICHIER joué par la commande : si une cible locale le nomme, l'étape est rejouable.
  const fichier = (cmd.match(/[\w./-]+\.(py|mjs|cjs|js|sh|ps1)/) || [])[0];
  return Boolean(fichier && corpus.includes(fichier));
}

export function juger(racine) {
  const dossier = join(racine, ".github", "workflows");
  if (!existsSync(dossier)) return { skip: "aucun `.github/workflows/` — la CI de ce dépôt vit ailleurs ou n'existe pas" };
  const workflows = readdirSync(dossier).filter((f) => /\.ya?ml$/i.test(f));
  if (!workflows.length) return { skip: "`.github/workflows/` présent mais vide" };
  const { cibles, corpus } = ciblesLocales(racine);
  if (!cibles.size && !corpus) return { skip: "aucun porteur de cible locale (package.json, Makefile, justfile…) — rien à comparer" };

  const orphelines = [];
  let total = 0;
  for (const w of workflows) {
    for (const cmd of etapesCI(readFileSync(join(dossier, w), "utf8"))) {
      total += 1;
      if (!atteignable(cmd, cibles, corpus)) orphelines.push(`${w} → ${cmd.slice(0, 80)}`);
    }
  }
  // `test` compte comme cible agrégée : c'est la convention npm, et sur le parc réel elle joue
  // effectivement lint + validation + golden + tests. Exiger un nom maison aurait accusé un dépôt
  // qui fait exactement ce que la règle demande, sous le nom que tout l'écosystème emploie.
  const AGREGEE = /^(verifier|verify|check|ci|all|controles|qualite|lint-test|validate|test|test:ci)$/i;
  const agregee = [...cibles].find((c) => AGREGEE.test(c));
  return { total, orphelines, agregee, cibles: cibles.size };
}

// ---- recette : les deux sens ------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");

if (lanceEnDirect && args.includes("--self-test")) {
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  console.log("Recette de oracle-recouvrement-controles — les deux sens\n");

  const base = mkdtempSync(join(tmpdir(), "recouvrement-"));
  const faire = (nom, workflow, pkg) => {
    const d = join(base, nom);
    mkdirSync(join(d, ".github", "workflows"), { recursive: true });
    writeFileSync(join(d, ".github", "workflows", "ci.yml"), workflow, "utf8");
    if (pkg) writeFileSync(join(d, "package.json"), JSON.stringify(pkg), "utf8");
    return d;
  };

  const WF_DEUX = "jobs:\n  x:\n    steps:\n      - run: npm ci\n      - run: python build/ci/verif-pages.py\n      - run: node build/ci/oracle-consent.mjs\n";
  const rouge = faire("rouge", WF_DEUX, { scripts: { "check-seo": "node check-seo.mjs", "check-links": "node check-links.mjs" } });
  const r1 = juger(rouge);
  att("le recouvrement NUL mesuré le 24/08 est signalé", r1.orphelines.length === 2);
  att("l'installation de dépendances n'est PAS comptée comme un contrôle", r1.total === 2);
  att("le constat nomme la commande orpheline", /verif-pages\.py/.test(r1.orphelines.join(" ")));
  att("l'absence de cible agrégée est vue", !r1.agregee);

  const vert = faire("vert", WF_DEUX, {
    scripts: {
      verifier: "npm run verif-pages && npm run consent && npm run check-seo",
      "verif-pages": "python build/ci/verif-pages.py",
      consent: "node build/ci/oracle-consent.mjs",
      "check-seo": "node check-seo.mjs",
    },
  });
  const r2 = juger(vert);
  att("chaque étape de CI atteignable par une cible locale ne déclenche rien", r2.orphelines.length === 0);
  att("la cible AGRÉGÉE est reconnue", r2.agregee === "verifier");

  const sansCI = join(base, "sansci"); mkdirSync(sansCI, { recursive: true });
  att("un dépôt sans workflow rend SANS_OBJET plutôt qu'un faux vert", Boolean(juger(sansCI).skip));

  const makefile = join(base, "make"); mkdirSync(join(makefile, ".github", "workflows"), { recursive: true });
  writeFileSync(join(makefile, ".github", "workflows", "ci.yml"), "jobs:\n  x:\n    steps:\n      - run: |\n          python build/ci/verif-pages.py\n          node autre.mjs\n", "utf8");
  writeFileSync(join(makefile, "Makefile"), "verifier:\n\tpython build/ci/verif-pages.py\n\tnode autre.mjs\n", "utf8");
  const r3 = juger(makefile);
  att("un bloc `run: |` multiligne est lu ligne par ligne", r3.total === 2);
  att("un Makefile porte aussi bien les cibles qu'un package.json", r3.orphelines.length === 0 && r3.agregee === "verifier");

  rmSync(base, { recursive: true, force: true });
  console.log(`\nRecette recouvrement-controles : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

if (lanceEnDirect) {
  const cibles = args.filter((a) => !a.startsWith("--"));
  if (!cibles.length) so("RC0", "(aucun argument)", "aucune racine — cet oracle juge un dépôt qu'on lui passe");
  for (const racine of cibles) {
    if (!existsSync(racine)) { so("RC0", racine, "racine introuvable — non vérifiée, jamais accusée"); continue; }
    const r = juger(racine);
    if (r.skip) { so("RC0", racine, r.skip); continue; }
    r.orphelines.length
      ? ko("RC1", racine, `${r.orphelines.length} commande(s) de CI sur ${r.total} qu'aucune cible locale ne rejoue : ` +
        `${r.orphelines.slice(0, 4).join(" · ")}. Valider en local ne dit alors rien de la CI — mesuré le 24/08 : ` +
        "six contrôles, deux ensembles, recouvrement nul, une régression passée jusqu'à la branche principale")
      : ok("RC1", racine, `les ${r.total} commande(s) de contrôle de la CI sont atteignables par une cible locale`);
    r.agregee
      ? ok("RC2", racine, `une cible agrégée existe : « ${r.agregee} » — le recouvrement ne dépend pas de la mémoire de qui pousse`)
      : ko("RC2", racine, `aucune cible AGRÉGÉE parmi les ${r.cibles} cibles locales : le recouvrement dépend de la mémoire de qui pousse, ` +
        "et la mémoire n'est pas un mécanisme. Une seule commande doit jouer l'ensemble");
  }
  const verdict = F.some((f) => f.statut === "FAIL") ? "FAIL"
    : F.every((f) => f.statut === "SANS_OBJET") ? "SKIP" : "PASS";
  console.log(JSON.stringify({ oracle: "oracle-recouvrement-controles", version: "1.0.0", verdict,
    findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
  process.exit(verdict === "FAIL" ? 1 : verdict === "SKIP" ? 2 : 0);
}
