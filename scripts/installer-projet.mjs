#!/usr/bin/env node
/**
 * installer-projet.mjs — INSTALLE LA FACTORY SUR UN PROJET, SANS QUESTION, ET LE PROUVE.
 *
 * Le fait (TF-1637, 13/10/2026). Un développeur a écrit « Utilise
 * https://github.com/iguane39/digit-ai-factory pour ce projet ». La session lui a posé deux
 * questions avant toute installation : son intention, et la façon d'installer « node ≥ 18,
 * éventuellement uv/gh ». Trois causes, toutes chez nous :
 *   1. la phase 0 commençait par `node bootstrap.mjs`, qui ne peut pas dire que node manque ;
 *   2. les prompts canoniques disaient « liste les prérequis manquants, puis attends que je
 *      confirme », et listaient uv, gh et python, que l'installation n'exige pas ;
 *   3. sur un poste tiers, le dépôt privé du canal confidentiel rendait « Poste NON prêt » avec le
 *      remède « gh auth status ».
 * Installer un outil en portée utilisateur n'a ni coût, ni droit administrateur, ni effet
 * irréversible : c'est la voie automatique (loi n° 5), pas une décision humaine.
 *
 * Appelé par `installer.ps1` et `installer.sh` une fois git et node posés. Il :
 *   1. joue `bootstrap.mjs --pull` (pilot, forges, skills, entrée du dispositif au poste), sans
 *      fenêtre d'identifiants git ;
 *   2. installe le projet : dépôt git local s'il n'en a pas, adoption non destructive
 *      (`adopter-projet-existant.mjs`), README d'`input\` et `output\` ;
 *   3. VÉRIFIE par des contrôles exécutés, puis affiche une bannière : « FACTORY DIGIT-AI
 *      OPÉRATIONNELLE » si tous sont verts, « INSTALLATION INCOMPLÈTE » sinon, chaque défaut avec
 *      son remède. Jamais l'une à la place de l'autre.
 *
 * Usage : node <pilot>/scripts/installer-projet.mjs [<projet>] [--sans-bootstrap] [--json]
 *   <projet>          dossier du projet (défaut : dossier courant)
 *   --sans-bootstrap  ne joue pas le bootstrap (recette) : le poste est alors déclaré NON vérifié
 *   --json            rend le rapport en JSON sur stdout, sans bannière
 * Exit : 0 opérationnelle · 1 incomplète · 2 usage.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FORGES } from "./lib-parc.mjs";
import { skillsInstalles } from "./lib-config-installee.mjs";

const PILOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Sous Windows, c:dev et C:dev sont le même dossier : toute comparaison de chemins ignore la casse.
// Signatures d'un échec réseau passager dans la sortie de git (curl sous-jacent).
export const RESEAU_PASSAGER = /Empty reply from server|unable to access .*(?:timed out|Could not resolve|Connection reset|Failed to connect|Recv failure|SSL)|early EOF|RPC failed/i;
const meme = (a, b) => (process.platform === "win32" ? resolve(a).toLowerCase() === resolve(b).toLowerCase() : resolve(a) === resolve(b));

export function installer({ projet, racine = process.env.FORGE_ROOT || dirname(PILOT), sansBootstrap = false, env = process.env, log = () => {} }) {
  projet = resolve(projet);
  racine = resolve(racine);
  const controles = [];
  const ctl = (quoi, ok, detail, remede = "") => controles.push({ quoi, ok, detail, remede });
  const envGit = { ...env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never", FORGE_ROOT: racine };
  const jouer = (argv, cwd = projet) => {
    const r = spawnSync(argv[0], argv.slice(1), { cwd, env: envGit, encoding: "utf8", windowsHide: true });
    return { status: r.error ? 127 : r.status ?? 1, out: (r.stdout || "") + (r.stderr || "") };
  };
  const node = (script, ...a) => jouer([process.execPath, join(PILOT, script), ...a]);

  // 1. Le poste ------------------------------------------------------------------------------
  let sortieBootstrap = "";
  if (sansBootstrap) ctl("poste (bootstrap --pull)", null, "non joué (--sans-bootstrap) : poste NON vérifié");
  else {
    log("Mise à jour du pilot et des forges, propagation des skills (1 à 3 minutes au premier passage)…");
    // TF-1657 : l'installation sert un projet ; un défaut du parc (canal confidentiel) ne la rend pas incomplète.
    const bootstrap = () => jouer([process.execPath, join(PILOT, "bootstrap.mjs"), "--pull", "--racine", racine, "--pour-produit", "--sous-installateur"], PILOT);
    let b = bootstrap();
    // Un clone NEUF du pilot n'a pas de pre-push (`.git/hooks` ne voyage pas) : bootstrap le dit en
    // H3/H4 avec un remède entièrement mécanique, mesuré le 13/10 sur un poste tiers simulé. Le
    // poser ici est la voie automatique ; le pilot n'est pas encore cloné que bootstrap ne peut pas
    // le faire lui-même, la forge des outils qui porte l'installeur arrivant après lui.
    const poseur = join(racine, "digit-ai-forge-agents", ".claude", "skills", "quality-oracles", "scripts", "installer-hamecon-publication.mjs");
    if (b.status !== 0 && /\[FAIL\] H[34]\b/.test(b.out) && existsSync(poseur)) {
      const p = jouer([process.execPath, poseur, PILOT, "--seul=pre-push"], PILOT);
      const s = jouer([process.execPath, join(PILOT, "scripts", "verifier-hooks-git.mjs"), "--depot", PILOT, "--installer"], PILOT);
      log(`[pose] hook pre-push du pilot (installeur de forge-agents, exit ${p.status}) et sa section R-38 (exit ${s.status}) ; bootstrap rejoué`);
      b = bootstrap();
    }
    // Un incident réseau passager (« Empty reply from server », mesuré le 13/10 à 19:38 sur le clone
    // d'un dépôt privé, puis 3 refus d'accès normaux à la sonde suivante) ne doit pas faire échouer
    // l'installation d'un développeur : une seconde tentative, une seule, quand l'échec en porte la
    // signature. bootstrap est idempotent, la seconde passe ne refait que ce qui manque.
    if (b.status !== 0 && RESEAU_PASSAGER.test(b.out)) {
      log("[reprise] échec réseau passager au bootstrap : seconde tentative");
      b = bootstrap();
    }
    sortieBootstrap = b.out;
    const defauts = b.out.split(/\r?\n/).filter((l) => l.startsWith("[DEFAUT]"));
    ctl("poste (bootstrap --pull)", b.status === 0,
      b.status === 0 ? "Poste prêt : pilot et forges présents et à jour, skills alignés" : `${defauts.length} défaut(s) : ${defauts.join(" · ").slice(0, 600)}`,
      "appliquer le remède de chaque [DEFAUT] ci-dessus, puis relancer l'installateur");
  }
  const absentes = FORGES.filter((f) => !f.prive && !existsSync(join(racine, f.nom, f.preuve)));
  const publiques = FORGES.filter((f) => !f.prive).length;
  ctl("forges", absentes.length === 0, `${publiques - absentes.length}/${publiques} présentes sous ${racine}`
    + (absentes.length ? ` — absentes : ${absentes.map((f) => f.nom).join(", ")}` : ""), "node bootstrap.mjs --pull dans le pilot");
  const { chemin: skills } = skillsInstalles(env);
  const nbSkills = skills && existsSync(skills) ? readdirSync(skills).filter((d) => existsSync(join(skills, d, "SKILL.md"))).length : 0;
  const accueil = skills && existsSync(join(skills, "accueil-factory", "SKILL.md"));
  ctl("skills", Boolean(accueil), `${nbSkills} installé(s) sous ${skills || "(introuvable)"}${accueil ? ", dont l'accueil de la factory" : " — accueil-factory ABSENT"}`,
    "node bootstrap.mjs --pull dans le pilot (propage les skills)");

  // 2. Le projet -----------------------------------------------------------------------------
  let nature = "";
  const forge = FORGES.find((f) => meme(join(racine, f.nom), projet));
  if (!existsSync(projet) || !statSync(projet).isDirectory()) {
    ctl("projet", false, `${projet} n'existe pas`, "ouvrir la session dans le dossier du projet, puis relancer");
  } else if (meme(projet, homedir()) || meme(projet, parse(projet).root)) {
    ctl("projet", false, `${projet} est le dossier personnel ou une racine de disque, pas un projet : rien n'y est posé`,
      "ouvrir la session dans le dossier du projet (ou créer un dossier vide pour un nouveau produit), puis relancer");
  } else if (meme(projet, PILOT) || forge) {
    nature = meme(projet, PILOT) ? "pilot" : "forge";
    ctl("projet", true, `session ouverte dans ${nature === "pilot" ? "le pilot" : `la forge ${forge.nom}`} : rien à adopter, son CLAUDE.md fait foi`);
  } else {
    if (jouer(["git", "rev-parse", "--is-inside-work-tree"]).status !== 0) {
      const g = jouer(["git", "init", "--quiet"]);
      if (g.status === 0) log(`[pose] dépôt git local créé dans ${projet} (aucun dépôt distant, aucun envoi)`);
    }
    if (existsSync(join(projet, "forge"))) {
      nature = "instrumenté";
      ctl("projet", true, "déjà instrumenté (forge\\ présent) : son hook d'ouverture le remet à niveau à chaque session");
    } else {
      const a = node("scripts/adopter-projet-existant.mjs", projet);
      const verdict = (a.out.match(/^verdict : (.*)$/m) || [, ""])[1];
      // 14/10/2026 : « adopté » se relayait en « <projet> est maintenant adopté », phrase vide de sens
      // pour l'humain. Ce qui s'est passé : le socle de la Factory est posé, l'existant intact.
      nature = "socle Factory posé, aucun fichier existant modifié";
      ctl("adoption du projet", a.status === 0, verdict || a.out.trim().slice(0, 300),
        `node "${join(PILOT, "scripts", "adopter-projet-existant.mjs")}" "${projet}" et lire son refus`);
    }
    node("scripts/readme-dossiers.mjs", "--base", projet);
    const c = node("scripts/readme-dossiers.mjs", "--base", projet, "--check");
    ctl("README d'input\\ et output\\", c.status === 0, c.status === 0 ? "présents, rôles rédigés" : c.out.trim().slice(0, 300),
      `node "${join(PILOT, "scripts", "readme-dossiers.mjs")}" --base "${projet}"`);
    ctl("dépôt git local", jouer(["git", "rev-parse", "--is-inside-work-tree"]).status === 0, "présent, sans dépôt distant ajouté", "git init dans le projet");
    let cable = false;
    try { cable = readFileSync(join(projet, ".claude", "settings.json"), "utf8").includes("forge/hooks/factory.mjs"); } catch {}
    ctl("hameçons du projet", cable && existsSync(join(projet, "forge", "hooks", "factory.mjs")) && existsSync(join(projet, "CLAUDE.md")),
      cable ? ".claude/settings.json câblé sur forge/hooks/factory.mjs, CLAUDE.md posé" : ".claude/settings.json ne câble pas forge/hooks/factory.mjs",
      `compléter .claude/settings.json depuis "${join(PILOT, "gabarits", "settings-produit.json")}"`);
    // Le lanceur du produit résout le pilot SANS variable d'environnement dans cet ordre : parent
    // du produit, c:\dev, ~/.digit-ai-forge (gabarits/hooks-factory.mjs). Hors de ces chemins, une
    // session suivante ne trouverait pas le pilot si FORGE_ROOT n'est pas posée au poste.
    const trouvable = [dirname(projet), "c:\\dev", join(homedir(), ".digit-ai-forge")]
      .some((r) => existsSync(join(r, "digit-ai-factory", "bootstrap.mjs")) && meme(join(r, "digit-ai-factory"), PILOT));
    const remedeRacine = process.platform === "win32" ? `setx FORGE_ROOT "${racine}"` : `echo 'export FORGE_ROOT="${racine}"' >> ~/.profile`;
    let persistee = false;
    if (!trouvable && !env.FORGE_SANS_PATH_PERSISTANT) {
      // Voie automatique : une variable d'environnement UTILISATEUR, réversible, sans droit admin.
      persistee = process.platform === "win32"
        ? jouer(["setx", "FORGE_ROOT", racine]).status === 0
        : jouer(["sh", "-c", `grep -qs 'FORGE_ROOT=' ~/.profile || printf '\\nexport FORGE_ROOT="%s"\\n' "$1" >> ~/.profile`, "sh", racine]).status === 0;
    }
    ctl("pilot trouvable aux sessions suivantes", trouvable || persistee,
      trouvable ? `${PILOT}, par l'ordre de résolution du lanceur`
        : persistee ? `FORGE_ROOT=${racine} posée en variable utilisateur (prochaines sessions)` : `${PILOT} hors des chemins résolus sans variable`,
      remedeRacine);
  }
  const juges = controles.filter((c) => c.ok !== null);
  const operationnelle = juges.every((c) => c.ok) && controles.every((c) => c.ok !== null);
  return { projet, pilot: PILOT, racine, nature, operationnelle, controles, sortieBootstrap,
    version: spawnSync("git", ["describe", "--tags", "--always"], { cwd: PILOT, encoding: "utf8" }).stdout?.trim() || "",
    pathNeuf: (env.FORGE_PATH_NEUF || "").trim() };
}

function banniere(r) {
  const trait = "═".repeat(72);
  const L = [];
  if (r.sortieBootstrap) L.push(r.sortieBootstrap.trimEnd(), "");
  L.push(trait);
  L.push(r.operationnelle
    ? "  FACTORY DIGIT-AI OPÉRATIONNELLE — prête à être utilisée sur ce projet"
    : "  INSTALLATION INCOMPLÈTE — la factory n'est PAS encore opérationnelle");
  L.push(trait);
  L.push(`  Projet : ${r.projet}${r.nature ? ` (${r.nature})` : ""}`);
  L.push(`  Pilot  : ${r.pilot} (${r.version})`);
  for (const c of r.controles) {
    const m = c.ok === null ? "–" : c.ok ? "✓" : "✗";
    L.push(`  ${m} ${c.quoi} : ${c.detail}`);
    if (c.ok === false && c.remede) L.push(`      remède : ${c.remede}`);
  }
  const n = r.controles.filter((c) => c.ok !== null).length;
  L.push(`  ${r.controles.filter((c) => c.ok).length}/${n} contrôle(s) exécuté(s) verts.`);
  if (r.operationnelle) {
    L.push("");
    if (r.pathNeuf) L.push(`  Outils ajoutés au PATH utilisateur (${r.pathNeuf}) : les prochaines fenêtres VS Code et terminaux les verront.`);
    if (r.nature && r.nature !== "pilot" && r.nature !== "forge")
      L.push("  Les hameçons du projet s'activent à la prochaine ouverture de session Claude Code dans ce dossier.");
    L.push("  Pour commencer, dites ce que vous voulez obtenir, par exemple :");
    L.push("    « crée un site de réservation » · « fais évoluer ce produit » · « teste ce projet de bout en bout »");
    L.push("    « revois le design rendu » · « déploie en staging » · « audite le SEO du site en ligne »");
  }
  L.push(trait);
  return L.join("\n");
}

const lanceEnDirect = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (lanceEnDirect) {
  const args = process.argv.slice(2);
  const inconnus = args.filter((a) => a.startsWith("--") && !["--sans-bootstrap", "--json"].includes(a));
  if (inconnus.length) { console.error(`usage : node installer-projet.mjs [<projet>] [--sans-bootstrap] [--json] — option inconnue : ${inconnus.join(" ")}`); process.exit(2); }
  const json = args.includes("--json");
  const r = installer({
    projet: args.find((a) => !a.startsWith("--")) || process.cwd(),
    sansBootstrap: args.includes("--sans-bootstrap"),
    log: json ? () => {} : (m) => console.log(m),
  });
  console.log(json ? JSON.stringify({ ...r, sortieBootstrap: undefined }, null, 2) : banniere(r));
  process.exit(r.operationnelle ? 0 : 1);
}
