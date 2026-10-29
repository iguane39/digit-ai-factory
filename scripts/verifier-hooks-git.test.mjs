#!/usr/bin/env node
/**
 * verifier-hooks-git.test.mjs — une garde de pré-commit déclarée et jamais appelée est un FAIL
 * (TF-1041, part pilot). Dépôt git réel en dossier temporaire, deux gardes jouets.
 *
 * Rouges : aucun hook (le clone frais) ; un hook qui n'appelle qu'une garde (l'état qu'aurait
 * posé l'installeur de la forge des outils) ; une copie versionnée qui a dérivé. Remède JOUÉ
 * (TF-1013) : `--installer` sur un hook absent, puis PASS. Borne : `--installer` n'écrase jamais
 * un hook étranger. TF-1325 : il remplace une copie versionnée ANTÉRIEURE (fins de ligne du poste
 * comprises), et conserve un hook étranger même quand l'histoire porte plusieurs versions.
 * Hors dépôt : non jugeable (exit 2), jamais un vert.
 * Joué par `oracles\self-tests.mjs` (I2).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ICI = dirname(fileURLToPath(import.meta.url));
const OUTIL = join(ICI, "verifier-hooks-git.mjs");
let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};

const SOURCE = "#!/bin/sh\nnode \"$R/todo/pre-commit-a.mjs\" || exit $?\nnode \"$R/oracles/pre-commit-b.mjs\" || exit $?\n";
const depot = () => {
  const D = mkdtempSync(join(tmpdir(), "hooks-git-"));
  const g = (...a) => spawnSync("git", ["-C", D, ...a], { encoding: "utf8" });
  g("init", "-q", "-b", "main");
  for (const f of ["todo/pre-commit-a.mjs", "oracles/pre-commit-b.mjs", "oracles/pre-commit-b.test.mjs"]) {
    mkdirSync(join(D, dirname(f)), { recursive: true });
    writeFileSync(join(D, f), "// garde jouet\n", "utf8");
  }
  mkdirSync(join(D, "scripts", "hooks-git"), { recursive: true });
  writeFileSync(join(D, "scripts", "hooks-git", "pre-commit"), SOURCE, "utf8");
  g("add", ".");
  return D;
};
const lancer = (D, ...extra) => {
  const r = spawnSync(process.execPath, [OUTIL, "--depot", D, ...extra], { encoding: "utf8" });
  return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
};
const HOOK = (D) => join(D, ".git", "hooks", "pre-commit");

check("rouge — clone frais, aucun hook : les deux gardes déclarées sont nommées, jamais appelées", () => {
  const D = depot();
  const r = lancer(D);
  if (r.code !== 1 || !/AUCUN hook pre-commit installé/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  if (!/todo\/pre-commit-a\.mjs/.test(r.sortie) || !/oracles\/pre-commit-b\.mjs/.test(r.sortie)) throw new Error("les gardes ne sont pas nommées");
  if (/pre-commit-b\.test\.mjs/.test(r.sortie)) throw new Error("une recette est prise pour une garde");
  rmSync(D, { recursive: true, force: true });
});
check("rouge — hook qui n'appelle qu'une garde (celui de l'installeur externe) : la garde oubliée est nommée", () => {
  const D = depot();
  writeFileSync(HOOK(D), "#!/bin/sh\nnode \"$R/todo/pre-commit-a.mjs\"\n", "utf8");
  const r = lancer(D);
  if (r.code !== 1 || !/n'appelle pas 1 garde/.test(r.sortie) || !/oracles\/pre-commit-b\.mjs/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("remède joué — `--installer` sur un hook absent pose la copie versionnée, puis PASS sans option", () => {
  const D = depot();
  const r1 = lancer(D, "--installer");
  if (r1.code !== 0 || !/\[INSTALLÉ\]/.test(r1.sortie)) throw new Error(`exit ${r1.code} : ${r1.sortie}`);
  if (readFileSync(HOOK(D), "utf8") !== SOURCE) throw new Error("le hook posé n'est pas la copie versionnée");
  const r2 = lancer(D);
  if (r2.code !== 0) throw new Error(`après installation, exit ${r2.code} : ${r2.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("borne — `--installer` n'écrase JAMAIS un hook existant, même incomplet", () => {
  const D = depot();
  const etranger = "#!/bin/sh\necho hook du poste\n";
  writeFileSync(HOOK(D), etranger, "utf8");
  const r = lancer(D, "--installer");
  if (r.code !== 1 || !/CONSERVÉ/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  if (readFileSync(HOOK(D), "utf8") !== etranger) throw new Error("le hook existant a été écrasé");
  rmSync(D, { recursive: true, force: true });
});
check("remède joué (TF-1325) — une copie versionnée ANTÉRIEURE est remplacée par `--installer`, puis PASS", () => {
  const D = depot();
  const g = (...a) => spawnSync("git", ["-C", D, "-c", "user.name=recette", "-c", "user.email=recette@exemple.invalid", ...a], { encoding: "utf8" });
  const ancienne = "#!/bin/sh\nnode \"$R/todo/pre-commit-a.mjs\" || exit $?\n";
  writeFileSync(join(D, "scripts", "hooks-git", "pre-commit"), ancienne, "utf8");
  g("add", "."); g("commit", "-q", "-m", "version 1 de la copie versionnee");
  writeFileSync(join(D, "scripts", "hooks-git", "pre-commit"), SOURCE, "utf8");
  g("add", "."); g("commit", "-q", "-m", "version 2 : une garde de plus");
  writeFileSync(HOOK(D), ancienne.split("\n").join("\r\n"), "utf8"); // posée sur un poste en CRLF
  const r = lancer(D, "--installer");
  if (r.code !== 0 || !/\[MIS À JOUR\]/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  if (readFileSync(HOOK(D), "utf8") !== SOURCE) throw new Error("le hook n'est pas la version courante");
  rmSync(D, { recursive: true, force: true });
});
check("borne (TF-1325) — un hook ÉTRANGER reste conservé même quand l'histoire porte plusieurs versions", () => {
  const D = depot();
  const g = (...a) => spawnSync("git", ["-C", D, "-c", "user.name=recette", "-c", "user.email=recette@exemple.invalid", ...a], { encoding: "utf8" });
  g("commit", "-q", "-m", "version 1");
  const etranger = "#!/bin/sh\nnode \"$R/todo/pre-commit-a.mjs\" || exit $?\necho ajout local\n";
  writeFileSync(HOOK(D), etranger, "utf8");
  const r = lancer(D, "--installer");
  if (r.code !== 1 || !/CONSERVÉ/.test(r.sortie) || /MIS À JOUR/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  if (readFileSync(HOOK(D), "utf8") !== etranger) throw new Error("le hook étranger a été écrasé");
  rmSync(D, { recursive: true, force: true });
});
check("rouge — copie versionnée qui a dérivé (une garde en moins) : H2 la nomme", () => {
  const D = depot();
  writeFileSync(join(D, "scripts", "hooks-git", "pre-commit"), "#!/bin/sh\nnode \"$R/todo/pre-commit-a.mjs\"\n", "utf8");
  writeFileSync(HOOK(D), SOURCE, "utf8");
  const r = lancer(D);
  if (r.code !== 1 || !/\[FAIL\] H2/.test(r.sortie) || !/oracles\/pre-commit-b\.mjs/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("borne — hors dépôt git : non jugeable (exit 2), jamais un vert", () => {
  const D = mkdtempSync(join(tmpdir(), "hooks-hors-git-"));
  const r = lancer(D);
  if (r.code !== 2) throw new Error(`exit ${r.code} attendu 2`);
  if (existsSync(join(D, ".git"))) throw new Error("un dépôt a été créé");
  rmSync(D, { recursive: true, force: true });
});

// TF-1275 (12/10/2026) — H3 : le pre-push qui joue le contrôle d'avance (R-38 par. 5) est posé et l'appelle.
const PRE_COMMIT_OK = SOURCE;
const PRE_PUSH = (D) => join(D, ".git", "hooks", "pre-push");
const depotAvance = () => {
  const D = depot();
  writeFileSync(join(D, "scripts", "verifier-avance-publication.mjs"), "// contrôle d'avance jouet\n", "utf8");
  spawnSync("git", ["-C", D, "add", "."], { encoding: "utf8" });
  writeFileSync(HOOK(D), PRE_COMMIT_OK, "utf8"); // H1 et H2 vertes : seul H3 est en jeu
  return D;
};
const PRE_PUSH_COMPLET = "#!/bin/sh\ntrap '' PIPE\nnode \"$D/scripts/verifier-avance-publication.mjs\" || exit 1\nnode porte-des-noms.mjs\n";
check("rouge (TF-1275) — dépôt qui porte le contrôle d'avance, AUCUN pre-push : H3 le nomme, exit 1", () => {
  const D = depotAvance();
  const r = lancer(D);
  if (r.code !== 1 || !/\[FAIL\] H3/.test(r.sortie) || !/AUCUN hook pre-push/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("rouge (TF-1275) — pre-push posé par l'installeur SANS la section d'avance (repose qui l'efface) : H3 le nomme", () => {
  const D = depotAvance();
  writeFileSync(PRE_PUSH(D), "#!/bin/sh\nnode porte-des-noms.mjs\n", "utf8");
  const r = lancer(D);
  if (r.code !== 1 || !/\[FAIL\] H3/.test(r.sortie) || !/n'appelle pas scripts\/verifier-avance-publication\.mjs/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("remède joué (TF-1275) — la section d'avance rétablie dans le pre-push : H3 PASS, exit 0", () => {
  const D = depotAvance();
  writeFileSync(PRE_PUSH(D), "#!/bin/sh\nnode porte-des-noms.mjs\n", "utf8");
  if (lancer(D).code !== 1) throw new Error("l'état rouge n'est pas rouge");
  writeFileSync(PRE_PUSH(D), PRE_PUSH_COMPLET, "utf8");
  const r = lancer(D);
  if (r.code !== 0 || !/\[PASS\] H3/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("borne (TF-1275) — `--installer` ne pose JAMAIS de pre-push (c'est l'installeur externe) : H3 reste rouge", () => {
  const D = depotAvance();
  const r = lancer(D, "--installer");
  if (r.code !== 1 || !/\[FAIL\] H3/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  if (existsSync(PRE_PUSH(D))) throw new Error("un pre-push a été écrit");
  rmSync(D, { recursive: true, force: true });
});
check("vert (TF-1275) — dépôt SANS contrôle d'avance suivi et sans pre-push : aucune ligne H3, exit 0", () => {
  const D = depot();
  writeFileSync(HOOK(D), SOURCE, "utf8");
  const r = lancer(D);
  if (r.code !== 0 || /H3/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});

// TF-1400 (12/10/2026) — H4 : le pre-push rejoue les verdicts cités au commit ; sa section propre
// versionnée est posée par `--installer` dans une section VIDE du gabarit, jamais ailleurs.
const MARQUES = (milieu) => "#!/bin/sh\ntrap '' PIPE\n# >>> prolongement local >>>\n" + milieu + "# <<< prolongement local <<<\nnode porte-des-noms.mjs\n";
const SECTION = "node \"$D/scripts/verifier-avance-publication.mjs\" || exit 1\nnode \"$D/scripts/rejouer-verdicts-cites.mjs\" || exit 1\n";
const depotVerdicts = () => {
  const D = depotAvance();
  writeFileSync(join(D, "scripts", "rejouer-verdicts-cites.mjs"), "// rejeu jouet\n", "utf8");
  writeFileSync(join(D, "scripts", "hooks-git", "pre-push-prolongement-local"), SECTION, "utf8");
  spawnSync("git", ["-C", D, "add", "."], { encoding: "utf8" });
  return D;
};
check("rouge (TF-1400) — pre-push sans l'appel du rejeu ni marqueurs (le pre-push actuel du pilot) : H4 le nomme, exit 1", () => {
  const D = depotVerdicts();
  writeFileSync(PRE_PUSH(D), PRE_PUSH_COMPLET, "utf8");
  const r = lancer(D);
  if (r.code !== 1 || !/\[FAIL\] H4/.test(r.sortie) || !/pas les marqueurs/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("remède joué (TF-1400) — gabarit à section VIDE : `--installer` y pose la section versionnée, puis H3 et H4 PASS sans option", () => {
  const D = depotVerdicts();
  writeFileSync(PRE_PUSH(D), MARQUES(""), "utf8");
  const r0 = lancer(D);
  if (r0.code !== 1 || !/\[FAIL\] H4/.test(r0.sortie) || !/section propre est vide/.test(r0.sortie)) throw new Error(`état rouge : exit ${r0.code} : ${r0.sortie}`);
  const r1 = lancer(D, "--installer");
  if (r1.code !== 0 || !/\[INSTALLÉ\] section propre du pre-push/.test(r1.sortie)) throw new Error(`exit ${r1.code} : ${r1.sortie}`);
  if (readFileSync(PRE_PUSH(D), "utf8") !== MARQUES(SECTION)) throw new Error("la section n'est pas posée entre les marqueurs, ou le reste du hook a changé");
  const r2 = lancer(D);
  if (r2.code !== 0 || !/\[PASS\] H3/.test(r2.sortie) || !/\[PASS\] H4/.test(r2.sortie)) throw new Error(`après pose, exit ${r2.code} : ${r2.sortie}`);
  rmSync(D, { recursive: true, force: true });
});
check("borne (TF-1400) — section propre déjà REMPLIE sans le rejeu : `--installer` la conserve, H4 reste rouge", () => {
  const D = depotVerdicts();
  const rempli = MARQUES("echo section locale\n");
  writeFileSync(PRE_PUSH(D), rempli, "utf8");
  const r = lancer(D, "--installer");
  if (r.code !== 1 || !/\[FAIL\] H4/.test(r.sortie) || !/CONSERVÉ/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  if (readFileSync(PRE_PUSH(D), "utf8") !== rempli) throw new Error("la section remplie a été écrasée");
  rmSync(D, { recursive: true, force: true });
});
check("vert (TF-1400) — dépôt qui ne suit pas le rejeu : aucune ligne H4", () => {
  const D = depotAvance();
  writeFileSync(PRE_PUSH(D), PRE_PUSH_COMPLET, "utf8");
  const r = lancer(D);
  if (r.code !== 0 || /H4/.test(r.sortie)) throw new Error(`exit ${r.code} : ${r.sortie}`);
  rmSync(D, { recursive: true, force: true });
});

// TF-1952 (20/10/2026, récidive de TF-1555 : TF-1954) — UNE SECTION QUI LIT L'ENTRÉE DE GIT LA RENDAIT AUX SUIVANTES.
// Le 20/10, la section TF-1400 consommait l'entrée du hameçon dans sa boucle `while read` ; la section TF-1555 du gabarit,
// placée après, ne lisait plus rien, ARG_REVS restait vide et la porte des noms jugeait toute l'histoire du pilot (19 min
// au lieu de 46 s). La correction (16f22b51) n'avait AUCUN cas : rien n'aurait refusé la même régression. Ce cas joue la
// section PROPRE VERSIONNÉE pour de bon, suivie d'une sonde qui lit l'entrée comme la section TF-1555 la lit. VERT : la
// sonde reçoit la ligne envoyée par git. ROUGE : la même section sans sa ligne `exec <` (l'état d'avant le 20/10) laisse
// la sonde sans rien.
{
  const shell = spawnSync("sh", ["-c", "echo ok"], { encoding: "utf8" });
  if (shell.status !== 0) console.log("[NON JOUÉ] 1 cas — TF-1952 entrée de git rendue aux sections suivantes : sh absent de ce poste");
  else {
    const SECTION_PROPRE = readFileSync(join(ICI, "hooks-git", "pre-push-prolongement-local"), "utf8").replace(/\r\n/g, "\n");
    const SHA = "1".repeat(40), ZERO = "0".repeat(40);
    const jouerSection = (texteSection) => {
      const D = mkdtempSync(join(tmpdir(), "prepush-entree-"));
      spawnSync("git", ["-C", D, "init", "-q", "-b", "main"], { encoding: "utf8" });
      mkdirSync(join(D, "scripts"), { recursive: true });
      // La boucle TF-1400 ne tourne que si le rejeu des verdicts existe : une souche qui répond PASS suffit.
      writeFileSync(join(D, "scripts", "rejouer-verdicts-cites.mjs"), "process.exit(0);\n", "utf8");
      const script = join(D, "hook.sh");
      writeFileSync(script, texteSection + "\nread -r REF_SONDE SHA_SONDE SUITE_SONDE\nprintf 'SONDE:%s\\n' \"$SHA_SONDE\"\n", "utf8");
      const r = spawnSync("sh", [script.replace(/\\/g, "/")], { cwd: D, input: `refs/heads/main ${SHA} refs/heads/main ${ZERO}\n`, encoding: "utf8", timeout: 60000 });
      rmSync(D, { recursive: true, force: true });
      return { code: r.status, sortie: (r.stdout || "") + (r.stderr || "") };
    };
    check("vert (TF-1952) — la section propre du pre-push rend l'entrée de git à la section suivante", () => {
      const r = jouerSection(SECTION_PROPRE);
      if (r.code !== 0 || !r.sortie.includes(`SONDE:${SHA}`)) throw new Error(`la section suivante ne reçoit plus l'entrée (exit ${r.code}) : ${r.sortie.slice(0, 300)}`);
    });
    check("rouge (TF-1952) — la même section sans sa ligne `exec <` laisse la section suivante sans entrée : le garde sait échouer", () => {
      const sans = SECTION_PROPRE.split("\n").filter((l) => !/^exec < /.test(l)).join("\n");
      if (sans === SECTION_PROPRE) throw new Error("témoin mal construit : la ligne `exec <` n'a pas été retirée");
      const r = jouerSection(sans);
      if (r.sortie.includes(`SONDE:${SHA}`)) throw new Error("sans `exec <`, la sonde reçoit quand même l'entrée : le cas ne prouve rien");
    });
  }
}

console.log(`\nverifier-hooks-git (TF-1041) : ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
