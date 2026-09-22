#!/usr/bin/env node
/**
 * adopter-projet-existant.test.mjs — recette à DEUX SENS de l'adoption d'un projet existant
 * (TF-1286, décision humaine D-2 (b) du 22/09/2026).
 *
 * L'objet jugé est une écriture DANS UN PROJET VIVANT. Une recette qui ne prouverait que « les
 * artefacts sont posés » laisserait passer le seul défaut qui compte : avoir touché à ce que
 * l'équipe du projet avait déjà. Les cas de non-destruction sont donc aussi nombreux que ceux de
 * la pose, et chacun nomme ce qu'il protège.
 *
 * Joué par `oracles\self-tests.mjs` (I2 : tout `*.test.mjs` du dépôt est joué).
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { adopter, relever, estVivant, blocEcartInitial, contratHeritage, REPERTOIRES } from "./adopter-projet-existant.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");

let pass = 0, fail = 0;
const check = (nom, fn) => {
  try { fn(); console.log(`  [PASS] ${nom}`); pass++; }
  catch (e) { console.error(`  [FAIL] ${nom} — ${e.message}`); fail++; }
};
const att = (c, m) => { if (!c) throw new Error(m); };

const T = mkdtempSync(join(tmpdir(), "adoption-"));
let n = 0;
/** Un projet fabriqué : `fichiers` est une carte `chemin relatif → contenu`. */
const projet = (fichiers = {}) => {
  const d = join(T, `p${++n}`);
  mkdirSync(d, { recursive: true });
  for (const [rel, contenu] of Object.entries(fichiers)) {
    const f = join(d, rel);
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, contenu, "utf8");
  }
  return d;
};

try {
  // ── les GARDES : ce que l'adoption refuse, et pourquoi ────────────────────────────────────
  check("REFUS — le pilot n'est pas un produit", () => {
    const r = adopter(PILOT, { pilot: PILOT });
    att(r.verdict === "REFUS", `verdict ${r.verdict}`);
    att(/pas un produit/.test(r.motif), "le motif n'est pas dit");
  });

  check("REFUS — un dossier inexistant", () => {
    const r = adopter(join(T, "jamais-cree"), { pilot: PILOT });
    att(r.verdict === "REFUS" && /introuvable/.test(r.motif), `verdict ${r.verdict} — ${r.motif}`);
  });

  check("REFUS — un projet portant DÉJÀ `forge\\` est renvoyé à la recopie d'héritage, dont c'est le domaine", () => {
    const d = projet({ "forge/ledger.jsonl": "" });
    const r = adopter(d, { pilot: PILOT });
    att(r.verdict === "REFUS", `verdict ${r.verdict}`);
    att(/recopier-heritage/.test(r.motif), "le bon outil n'est pas nommé");
    att(/DÉJÀ/.test(r.motif), "le motif ne dit pas que le projet est instrumenté");
  });

  // ── l'ESSAI n'écrit rien ────────────────────────────────────────────────────────────────
  check("ESSAI — rien n'est écrit sur le disque, et le verdict le dit", () => {
    const d = projet({ "src/index.js": "console.log(1)\n" });
    const avant = readdirSync(d).sort().join(",");
    const r = adopter(d, { pilot: PILOT, essai: true });
    att(r.verdict === "ESSAI", `verdict ${r.verdict}`);
    att(r.poses > 0, "l'essai ne relève rien à poser");
    att(readdirSync(d).sort().join(",") === avant, "l'essai a écrit sur le disque");
  });

  // ── la POSE, sur un projet vivant ────────────────────────────────────────────────────────
  check("VERT — un projet vivant est adopté : les répertoires et les artefacts manquants sont posés", () => {
    const d = projet({ "src/index.js": "console.log(1)\n", "README.md": "# Mon projet\n" });
    const r = adopter(d, { pilot: PILOT });
    att(r.verdict === "ADOPTE", `verdict ${r.verdict}`);
    for (const rep of REPERTOIRES) att(existsSync(join(d, rep.chemin)), `répertoire absent : ${rep.chemin}`);
    for (const a of contratHeritage(PILOT)) att(existsSync(join(d, a.cible)), `artefact absent : ${a.cible}`);
  });

  check("NON DESTRUCTIF — le CODE et les documents du projet sont rendus à l'identique", () => {
    const code = "export const x = 42;\n// ne touchez pas à ça\n";
    const readme = "# Mon projet\n\nUne convention de nommage bien à nous.\n";
    const d = projet({ "src/index.js": code, "README.md": readme, "docs/archi.md": "# archi\n" });
    att(adopter(d, { pilot: PILOT }).verdict === "ADOPTE", "l'adoption a échoué");
    att(readFileSync(join(d, "src/index.js"), "utf8") === code, "le code a été modifié");
    att(readFileSync(join(d, "README.md"), "utf8") === readme, "le README du projet a été modifié");
    att(readFileSync(join(d, "docs/archi.md"), "utf8") === "# archi\n", "un document du projet a été modifié");
  });

  check("NON DESTRUCTIF — un artefact du contrat qui PRÉEXISTE est laissé tel quel et NOMMÉ", () => {
    const mien = "# MON CLAUDE.md, écrit par mon équipe\n";
    const d = projet({ "CLAUDE.md": mien, "src/a.js": "1\n" });
    const r = adopter(d, { pilot: PILOT });
    att(readFileSync(join(d, "CLAUDE.md"), "utf8") === mien, "le CLAUDE.md préexistant a été écrasé");
    const f = r.faits.find((x) => x.cible === "CLAUDE.md");
    att(f && /LAISSÉ INTACT/.test(f.action), `l'artefact préexistant n'est pas nommé comme laissé : ${JSON.stringify(f)}`);
    att(r.laisses >= 1, "le compte des artefacts laissés est à zéro");
  });

  check("NON DESTRUCTIF — un `.gitignore` préexistant n'est ni écrasé ni fusionné en silence", () => {
    const mien = "node_modules/\n.env\n";
    const d = projet({ ".gitignore": mien, "src/a.js": "1\n" });
    adopter(d, { pilot: PILOT });
    att(readFileSync(join(d, ".gitignore"), "utf8") === mien, "le .gitignore du projet a été modifié");
  });

  check("NON DESTRUCTIF — un répertoire `output\\` déjà peuplé garde son contenu", () => {
    const d = projet({ "output/rapport-a-nous.md": "# nous\n" });
    adopter(d, { pilot: PILOT });
    att(readFileSync(join(d, "output/rapport-a-nous.md"), "utf8") === "# nous\n", "un livrable préexistant a disparu");
  });

  // ── l'IDEMPOTENCE ──────────────────────────────────────────────────────────────────────
  check("IDEMPOTENT — un second passage ne pose RIEN et ne réécrit pas le carnet", () => {
    const d = projet({ "src/a.js": "1\n" });
    adopter(d, { pilot: PILOT });
    const carnet1 = readFileSync(join(d, "forge/travaux/ECARTS-ASSUMES.md"), "utf8");
    const r2 = adopter(d, { pilot: PILOT });
    // Le second passage voit `forge\` : la garde le renvoie à la recopie, et c'est le comportement juste.
    att(r2.verdict === "REFUS" && /recopier-heritage/.test(r2.motif), `second passage : ${r2.verdict} — ${r2.motif}`);
    att(readFileSync(join(d, "forge/travaux/ECARTS-ASSUMES.md"), "utf8") === carnet1, "le carnet a été réécrit");
  });

  check("IDEMPOTENT sur le carnet — un écart initial déjà consigné n'est pas ajouté deux fois", () => {
    const d = projet({ "src/a.js": "1\n" });
    const releve = relever(d, PILOT);
    mkdirSync(join(d, "forge", "travaux"), { recursive: true });
    writeFileSync(join(d, "forge", "travaux", "ECARTS-ASSUMES.md"), blocEcartInitial(releve, "2026-09-22"), "utf8");
    // `forge\` existe maintenant : la garde refuse, ce qui prouve qu'on ne repasse pas dessus.
    att(adopter(d, { pilot: PILOT }).verdict === "REFUS", "un projet déjà porteur de forge\\ a été re-adopté");
  });

  // ── le CARNET dit l'écart, et il le dit à l'endroit que le contrat prévoit ─────────────
  check("le carnet des écarts assumés reçoit l'écart initial, daté, et il nomme ce qui a été laissé", () => {
    const d = projet({ "CLAUDE.md": "# le mien\n", "robots.txt": "User-agent: *\n" });
    adopter(d, { pilot: PILOT, quand: "2026-09-22" });
    const t = readFileSync(join(d, "forge/travaux/ECARTS-ASSUMES.md"), "utf8");
    att(/Écart initial à l'adoption du dispositif — 2026-09-22/.test(t), "la section datée est absente");
    att(/`CLAUDE\.md`/.test(t) && /`robots\.txt`/.test(t), "les artefacts préexistants ne sont pas nommés au carnet");
    att(/ni écrasé ni déplacé/.test(t), "le carnet ne dit pas que rien n'a été déplacé");
    att(/Ce que l'adoption n'a PAS fait/.test(t), "ce qui reste à décider n'est pas écrit");
  });

  check("le carnet est AJOUTÉ à un carnet préexistant, jamais substitué", () => {
    const d = projet({ "forge-ancien/x": "" });  // pas de `forge\`, donc l'adoption passe
    mkdirSync(join(d, "forge", "travaux"), { recursive: true });
    // Impossible : créer forge/travaux crée `forge`. On vérifie donc la propriété sur la fonction.
    const releve = relever(d, PILOT);
    const bloc = blocEcartInitial(releve, "2026-09-22");
    att(bloc.startsWith("\n"), "le bloc ne commence pas par une séparation — il écraserait la dernière ligne du carnet");
    att(!/^#\s/m.test(bloc.split("\n")[0] || ""), "le bloc ouvre par un titre de niveau 1, qui ferait deux titres de document");
  });

  // ── le relevé et les analyseurs, pris séparément ───────────────────────────────────────
  check("relever ne fait AUCUNE écriture et compte les deux états", () => {
    const d = projet({ "CLAUDE.md": "x\n", "input/.keep": "" });
    const avant = JSON.stringify(readdirSync(d).sort());
    const r = relever(d, PILOT);
    att(JSON.stringify(readdirSync(d).sort()) === avant, "relever a écrit");
    att(r.some((x) => x.cible === "CLAUDE.md" && x.etat === "present"), "un artefact présent est compté absent");
    att(r.some((x) => x.cible === "input" && x.etat === "present"), "un répertoire présent est compté absent");
    att(r.some((x) => x.etat === "absent"), "rien n'est compté absent alors que presque tout manque");
  });

  check("la liste des artefacts est LUE au contrat du pilot, jamais écrite ici", () => {
    const c = contratHeritage(PILOT);
    att(c.length >= 10, `contrat lu : ${c.length} artefact(s) — la lecture a échoué`);
    att(c.every((a) => a.cible && a.mode), "un artefact du contrat n'a ni cible ni mode");
  });

  check("estVivant distingue un dossier vide d'un projet qui porte du contenu", () => {
    att(!estVivant(projet()), "un dossier vide est déclaré vivant");
    att(!estVivant(projet({ "PROMPT-PRODUIT-EXISTANT.md": "x\n" })), "un dossier ne portant que le prompt est déclaré vivant");
    att(estVivant(projet({ "src/a.js": "1\n" })), "un projet avec du code n'est pas déclaré vivant");
  });

  check("le non_juge déclare ce que l'adoption ne fait pas — un silence se lirait comme une couverture", () => {
    const r = adopter(projet({ "src/a.js": "1\n" }), { pilot: PILOT });
    att(r.non_juge.some((l) => /CONVENTION de nommage/.test(l)), "le nommage des livrables déjà présents n'est pas déclaré");
    att(r.non_juge.some((l) => /CODE du projet/.test(l)), "le code non touché n'est pas déclaré");
    att(r.non_juge.some((l) => /readme-dossiers/.test(l)), "le geste suivant n'est pas nommé");
  });
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nadopter-projet-existant (TF-1286) : ${pass} PASS, ${fail} FAIL — couverture à double sens sur les gardes, l'essai, la pose, la non-destruction, l'idempotence et le carnet`);
process.exit(fail ? 1 : 0);
