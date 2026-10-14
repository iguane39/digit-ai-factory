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
import { spawnSync } from "node:child_process";
import { adopter, relever, estVivant, blocEcartInitial, contratHeritage, REPERTOIRES,
  TYPE_DOCUMENTAIRE, CONDITION_SITE, CARNET, signauxLogicielOuSite, typeProjetDeclare, declarerType, verifierDepotTiers } from "./adopter-projet-existant.mjs";

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

  // TF-1470 (02/10/2026) : la commande prescrite omettait --base ., et la garde de TF-1201
  // la refuse depuis le dossier d'un produit (écriture hors du dépôt déclaré).
  // TF-0957 (bancs-isoles) : le nom du script suivi de son extension est lu comme un APPEL à la
  // chaîne, même en prose — le nom et l'extension sont donc tenus séparés dans ce fichier.
  check("TF-1470 — la commande readme-dossiers (générateur d'index) citée porte --base . (sans quoi la garde de TF-1201 la refuse)", () => {
    const r = adopter(projet({ "src/a.js": "1\n" }), { pilot: PILOT });
    att(r.non_juge.some((l) => new RegExp("readme-dossiers" + "\\.mjs --base \\.").test(l)),
      "la commande citée dans r.non_juge omet --base . — relancée depuis le dossier du produit, la garde de TF-1201 la refuserait");
  });

  // ── TF-1439 : le type « documentaire » — posé, déclaré, et refusé à un projet qui a du code ─
  // Le fait (lot Produit-78 20260928a, RP-5) : sur un projet sans logiciel ni site, l'adoption posait
  // robots.txt et llms.txt, que le contrat ne doit qu'au « produit à surface web », et R-13 a fait
  // déclarer une variable que le projet ne lit pas. Les artefacts écartés se LISENT au contrat.
  const conditionnels = contratHeritage(PILOT).filter((a) => a.conditionnel === CONDITION_SITE).map((a) => a.cible);

  check("VERT documentaire — les artefacts dus au seul « produit à surface web » ne sont PAS posés, et sont nommés ÉCARTÉS", () => {
    const d = projet({ "notes/etude.md": "# Étude\n", "README.md": "# Dossier documentaire\n" });
    const r = adopter(d, { pilot: PILOT, type: TYPE_DOCUMENTAIRE, quand: "2026-09-28" });
    att(r.verdict === "ADOPTE" && r.type === TYPE_DOCUMENTAIRE, `verdict ${r.verdict}, type ${r.type} — ${r.motif || ""}`);
    att(conditionnels.length >= 2, `le contrat ne déclare plus d'artefact conditionnel « ${CONDITION_SITE} » : ${conditionnels.join(", ")}`);
    for (const c of conditionnels) {
      att(!existsSync(join(d, c)), `${c} a été posé sur un projet documentaire`);
      const f = r.faits.find((x) => x.cible === c);
      att(f && /ÉCARTÉ/.test(f.action), `${c} n'est pas nommé écarté : ${JSON.stringify(f)}`);
    }
    for (const a of contratHeritage(PILOT).filter((x) => !x.conditionnel)) att(existsSync(join(d, a.cible)), `artefact non conditionnel absent : ${a.cible}`);
    att(r.ecartes === conditionnels.length, `compte des écartés : ${r.ecartes}`);
  });

  check("VERT documentaire — le carnet porte `type_projet: documentaire` en EN-TÊTE et l'écart avec ses 4 champs ; le lecteur le relit", () => {
    const d = projet({ "notes/etude.md": "# Étude\n" });
    adopter(d, { pilot: PILOT, type: TYPE_DOCUMENTAIRE, quand: "2026-09-28" });
    const t = readFileSync(join(d, ...CARNET.split("/")), "utf8");
    const entete = (/^---\r?\n([\s\S]*?)\r?\n---/.exec(t) || [])[1] || "";
    att(/^type_projet: documentaire\s*$/m.test(entete), "la déclaration n'est pas dans l'en-tête du carnet");
    att((t.match(/^type_projet\s*:/gm) || []).length === 1, "la déclaration est écrite plus d'une fois");
    att(/^## Type de projet : documentaire/m.test(t), "l'écart « Type de projet : documentaire » n'est pas consigné");
    for (const champ of ["objet", "motif", "date", "reouverture"]) att(new RegExp(`\\*\\*${champ}\\*\\* :`).test(t), `champ « ${champ} » absent de l'écart`);
    for (const c of conditionnels) att(t.includes(`\`${c}\``), `l'écart ne nomme pas ${c}`);
    const lu = typeProjetDeclare(d);
    att(lu && lu.type === TYPE_DOCUMENTAIRE && lu.ou === CARNET, `relu : ${JSON.stringify(lu)}`);
  });

  check("REFUS documentaire — un projet qui porte du code et un manifeste ne se déclare pas documentaire, et RIEN n'est écrit", () => {
    const d = projet({ "src/server.js": "console.log(1)\n", "package.json": "{}\n", "notes/a.md": "# a\n" });
    const avant = readdirSync(d).sort().join(",");
    const r = adopter(d, { pilot: PILOT, type: TYPE_DOCUMENTAIRE });
    att(r.verdict === "REFUS", `verdict ${r.verdict}`);
    att(/src\/server\.js \(code\)/.test(r.motif) && /package\.json \(manifeste\)/.test(r.motif), `le motif ne nomme pas les signaux : ${r.motif}`);
    att(/sans `--type`/.test(r.motif), "le remède n'est pas nommé");
    att(readdirSync(d).sort().join(",") === avant, "le refus a écrit sur le disque");
  });

  check("REFUS documentaire — un fichier de SITE suffit : robots.txt préexistant contredit la déclaration", () => {
    const r = adopter(projet({ "robots.txt": "User-agent: *\n", "notes/a.md": "# a\n" }), { pilot: PILOT, type: TYPE_DOCUMENTAIRE });
    att(r.verdict === "REFUS" && /robots\.txt \(fichier de site\)/.test(r.motif), `verdict ${r.verdict} — ${r.motif}`);
  });

  check("REFUS — un type inconnu est refusé, jamais deviné", () => {
    const r = adopter(projet({ "notes/a.md": "# a\n" }), { pilot: PILOT, type: "docu" });
    att(r.verdict === "REFUS" && /« docu » inconnu/.test(r.motif), `verdict ${r.verdict} — ${r.motif}`);
  });

  check("ESSAI documentaire — rien n'est écrit, et les écartés sont déjà nommés", () => {
    const d = projet({ "notes/a.md": "# a\n" });
    const avant = readdirSync(d).sort().join(",");
    const r = adopter(d, { pilot: PILOT, type: TYPE_DOCUMENTAIRE, essai: true });
    att(r.verdict === "ESSAI" && r.ecartes === conditionnels.length, `verdict ${r.verdict}, écartés ${r.ecartes}`);
    att(readdirSync(d).sort().join(",") === avant, "l'essai a écrit sur le disque");
  });

  check("borne — sans type, rien ne change : les conditionnels sont posés et aucun type n'est déclaré", () => {
    const d = projet({ "notes/a.md": "# a\n" });
    const r = adopter(d, { pilot: PILOT });
    att(r.type === null && r.ecartes === 0, `type ${r.type}, écartés ${r.ecartes}`);
    for (const c of conditionnels) att(existsSync(join(d, c)), `${c} n'est plus posé sans type`);
    att(typeProjetDeclare(d) === null, "un type est déclaré alors qu'aucun n'a été demandé");
  });

  check("signaux — forge\\ et input\\ ne comptent pas ; un fichier de site, un manifeste et une racine web déclarée comptent", () => {
    const neutre = projet({ "forge/hooks/factory.mjs": "x\n", "input/client/script.py": "x\n", "docs/a.md": "# a\n", "output/Doc - Etude - 20260928a.html": "<p>x</p>\n" });
    att(signauxLogicielOuSite(neutre).length === 0, `faux signaux : ${signauxLogicielOuSite(neutre).join(", ")}`);
    const web = projet({ "site/sitemap.xml": "<urlset/>\n", "Dockerfile": "FROM x\n",
      "docs/projet/PARAMETRAGE.md": "---\nrole: parametrage\nracine_web: site\n---\n# P\n" });
    const s = signauxLogicielOuSite(web);
    att(s.some((x) => /sitemap\.xml \(fichier de site\)/.test(x)) && s.some((x) => /Dockerfile \(manifeste\)/.test(x))
      && s.some((x) => /racine web déclarée : site/.test(x)), `signaux manqués : ${s.join(", ")}`);
  });

  // TF-1614 (13/10/2026) : ce que l'adoption a posée elle-même n'est pas un site que le projet a bâti.
  check("TF-1614 vert : robots.txt et llms.txt posés par l'adoption (identiques au gabarit) ne comptent pas comme signaux de site", () => {
    const d = projet({ "notes/a.md": "# a\n" });
    const r = adopter(d, { pilot: PILOT });
    att(r.verdict === "ADOPTE" && existsSync(join(d, "robots.txt")) && existsSync(join(d, "llms.txt")), `adoption sans type : ${r.verdict} — robots/llms non posés`);
    att(signauxLogicielOuSite(d).length === 0, `signaux sur un projet fraîchement adopté : ${signauxLogicielOuSite(d).join(", ")}`);
  });
  check("TF-1614 rouge : les mêmes fichiers MODIFIÉS (instanciés par le projet) redeviennent des signaux de site", () => {
    const d = projet({ "notes/a.md": "# a\n" });
    adopter(d, { pilot: PILOT });
    writeFileSync(join(d, "llms.txt"), "# Mon site\n\n> Une vraie carte.\n", "utf8");
    writeFileSync(join(d, "robots.txt"), readFileSync(join(d, "robots.txt"), "utf8") + "Disallow: /prive\n", "utf8");
    const s = signauxLogicielOuSite(d);
    att(s.some((x) => /^llms\.txt \(fichier de site\)/.test(x)) && s.some((x) => /^robots\.txt \(fichier de site\)/.test(x)), `signaux manqués : ${s.join(", ")}`);
  });

  check("typeProjetDeclare ne lit que l'EN-TÊTE du carnet — une mention dans le corps n'est pas une déclaration", () => {
    const d = projet({ [CARNET]: "---\nrole: carnet\n---\n\n# Carnet\n\ntype_projet: documentaire\n" });
    att(typeProjetDeclare(d) === null, "une ligne du corps est lue comme une déclaration");
  });

  check("declarerType garde les fins de ligne du carnet et ne double jamais la déclaration", () => {
    const crlf = "---\r\nrole: carnet\r\nverifie_le: 2026-08-26\r\n---\r\n# C\r\n";
    const une = declarerType(crlf);
    att(/verifie_le: 2026-08-26\r\ntype_projet: documentaire\r\n---\r\n/.test(une), `en-tête CRLF mal écrit : ${JSON.stringify(une)}`);
    att((declarerType(une).match(/type_projet/g) || []).length === 1, "une seconde déclaration a été ajoutée");
    att(/^---\ntype_projet: documentaire\n---\n# sans/.test(declarerType("# sans en-tête\n")), "un carnet sans en-tête n'en reçoit pas");
  });

  // ── TF-1659 : la surface web va sous la racine SERVIE ───────────────────────────────────────
  // Le fait du 13/10 : dépôt à deux sous-projets, `FRONT/` servi depuis `FRONT/public/`, et l'essai
  // annonçait robots.txt et llms.txt à la racine du dépôt, où ils ne seront jamais servis.
  check("TF-1659 rouge → vert — dépôt multi-projets servi depuis FRONT/public : la surface web y est posée, jamais à la racine du dépôt", () => {
    const d = projet({ "FRONT/package.json": "{}\n", "FRONT/public/index.html": "<p>x</p>\n", "FRONT/src/App.jsx": "x\n", "BACK/Api.csproj": "<Project/>\n" });
    const r = adopter(d, { pilot: PILOT });
    att(r.verdict === "ADOPTE", `verdict ${r.verdict}`);
    att(!existsSync(join(d, "robots.txt")) && !existsSync(join(d, "llms.txt")), "robots.txt ou llms.txt posé à la racine du dépôt, où il ne sera jamais servi (défaut d'origine)");
    att(existsSync(join(d, "FRONT", "public", "robots.txt")) && existsSync(join(d, "FRONT", "public", "llms.txt")), "la surface web n'est pas posée sous la racine servie");
    att(/racine servie relevée sous `FRONT\/public`/.test(readFileSync(join(d, CARNET), "utf8")) && /racine_web: FRONT\/public/.test(readFileSync(join(d, CARNET), "utf8")), "le carnet ne dit pas la racine relevée ni la déclaration à faire");
  });
  check("TF-1659 — deux racines servies candidates : rien n'est posé, l'ambiguïté est consignée", () => {
    const d = projet({ "web/public/index.html": "x\n", "admin/wwwroot/index.html": "x\n" });
    const r = adopter(d, { pilot: PILOT });
    att(!existsSync(join(d, "robots.txt")) && !existsSync(join(d, "web", "public", "robots.txt")) && !existsSync(join(d, "admin", "wwwroot", "robots.txt")), "un robots.txt a été posé malgré l'ambiguïté");
    att(r.faits.some((f) => /NON POSÉ — racines servies multiples/.test(f.action)), "l'ambiguïté n'est pas dite");
    att(/racine servie AMBIGUË/.test(readFileSync(join(d, CARNET), "utf8")), "l'ambiguïté n'est pas consignée au carnet");
  });
  check("TF-1659 sens inverse — sans racine servie relevée, la surface web reste posée à la racine (comportement d'avant)", () => {
    const d = projet({ "notes/a.md": "# a\n" });
    adopter(d, { pilot: PILOT });
    att(existsSync(join(d, "robots.txt")) && existsSync(join(d, "llms.txt")), "la règle mord trop large : plus rien à la racine d'un projet sans racine servie");
  });

  // ── TF-1658 : le dépôt d'un TIERS (audit, coaching) n'est jamais écrit ──────────────────────
  // Le fait du 13/10 : 25 écritures annoncées dans l'arbre d'un dépôt client géré par un autre
  // développeur, et une démarche qui allait jusqu'au commit. En mode `--hors-depot`, le socle vit à
  // côté, sous git local, et le clone du tiers est relevé comme entrant en lecture seule.
  {
    const tiers = projet({ "src/app.js": "x\n", "README.md": "# Le projet du tiers\n" });
    const g = (...a) => spawnSync("git", ["-C", tiers, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8" });
    g("init", "-q"); g("add", "-A"); g("commit", "-q", "-m", "tiers");
    const socle = join(T, "socle-hors-depot");
    const r = adopter(tiers, { pilot: PILOT, horsDepot: socle });
    check("TF-1658 rouge → vert — en mode --hors-depot, le clone du tiers reste intact : aucune écriture, git status vide", () => {
      att(r.verdict === "ADOPTE", `verdict ${r.verdict} — ${r.motif || ""}`);
      att(g("status", "--porcelain").stdout.trim() === "", `écritures sous le dépôt du tiers : ${g("status", "--porcelain").stdout.trim()}`);
      att(!existsSync(join(tiers, "forge")) && !existsSync(join(tiers, "CLAUDE.md")) && !existsSync(join(tiers, "robots.txt")), "le socle a été posé dans le dépôt du tiers (défaut d'origine)");
    });
    check("TF-1658 — le socle vit à côté, sous git local, avec le relevé du tiers (chemin, commit) et l'écart au carnet", () => {
      att(existsSync(join(socle, ".git")) && existsSync(join(socle, "forge", "retours")) && existsSync(join(socle, "CLAUDE.md")), "socle incomplet ou sans git local");
      const t = JSON.parse(readFileSync(join(socle, "forge", "DEPOT-TIERS.json"), "utf8"));
      att(t.chemin === tiers && t.commit === g("rev-parse", "HEAD").stdout.trim(), "chemin ou commit du tiers mal relevés");
      att(/Dépôt d'un tiers en lecture seule/.test(readFileSync(join(socle, CARNET), "utf8")), "le mode n'est pas consigné au carnet");
      att(!existsSync(join(socle, "robots.txt")), "une surface web est posée dans le socle d'un dépôt tiers");
    });
    check("TF-1658 — la règle du mode : PASS sur un tiers intact, FAIL dès qu'un fichier y est écrit (sens rouge)", () => {
      att(verifierDepotTiers(socle).verdict === "PASS", `verdict ${verifierDepotTiers(socle).verdict} sur un tiers intact`);
      writeFileSync(join(tiers, "ecrit-par-la-session.md"), "x\n", "utf8");
      const v = verifierDepotTiers(socle);
      att(v.verdict === "FAIL" && /ecrit-par-la-session\.md/.test(v.message), `écriture sous le tiers non vue : ${v.verdict} — ${v.message}`);
      rmSync(join(tiers, "ecrit-par-la-session.md"));
      att(verifierDepotTiers(join(T, "p1")).verdict === "SANS_OBJET", "un projet ordinaire est jugé comme un mode hors dépôt");
    });
    check("TF-1658 — REFUS : un socle DANS le dépôt du tiers", () => {
      const x = adopter(tiers, { pilot: PILOT, horsDepot: join(tiers, "socle") });
      att(x.verdict === "REFUS" && /DANS le dépôt du tiers/.test(x.motif), `verdict ${x.verdict}`);
      att(!existsSync(join(tiers, "socle")), "le refus a quand même créé le dossier");
    });
  }
} finally {
  try { rmSync(T, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* verrou toléré */ }
}

console.log(`\nadopter-projet-existant (TF-1286) : ${pass} PASS, ${fail} FAIL — couverture à double sens sur les gardes, l'essai, la pose, la non-destruction, l'idempotence et le carnet`);
process.exit(fail ? 1 : 0);
