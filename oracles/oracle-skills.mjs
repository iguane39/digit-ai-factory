#!/usr/bin/env node
/**
 * oracle-skills.mjs — les skills qui S'EXÉCUTENT sont-ils ceux que les dépôts VERSIONNENT ?
 *
 * Pourquoi il existe. Un skill vit en deux exemplaires : la source, versionnée dans une forge,
 * et la copie installée sous `~/.claude/skills/`, qui est celle que la session invoque
 * réellement. Rien ne les liait. Mesure du 15/08, en livrant la règle L14 : sur 20 skills
 * versionnés, **4 divergeaient et 5 n'étaient pas installés du tout**. Autrement dit, neuf
 * skills sur vingt n'étaient pas ce que le dépôt croyait livrer — dont `quality-oracles`, cité
 * comme loi transversale : la version qui s'exécutait n'était pas la version versionnée.
 *
 * C'est la maladie de R-35 d'un cran plus haut : non pas un contrôle que rien n'appelle, mais
 * un correctif livré qui n'atteint jamais l'endroit où il servirait. Une règle corrigée dans un
 * dépôt et absente de la copie installée n'a strictement aucun effet.
 *
 * Règles (binaires) :
 *   K1  tout skill versionné dans une forge est installé ;
 *   K2  la copie installée est IDENTIQUE à sa source (hors artefacts d'atelier et fins de ligne) ;
 *   K3  deux forges ne revendiquent pas le même nom de skill — sinon « la » source n'existe pas ;
 *   K4  un skill installé SANS source versionnée est DÉCLARÉ, jamais mis en échec : il
 *       appartient à l'humain, l'oracle n'a pas à en juger ;
 *   K5  une copie installée EN AVANCE sur sa source (version déclarée plus haute) interdit
 *       l'application : c'est le dépôt qui est en retard, pas la copie.
 *
 * Ce qu'il ne juge PAS : le contenu d'un skill, sa qualité, son opportunité. Et il ne peut pas
 * EMPÊCHER une édition de la copie installée — il la voit au run suivant, il ne la verrouille
 * pas. Un verrou réel demanderait un lien symbolique, écarté le 15/08 : 20 sources dans 3
 * dépôts vers un seul dossier, des jonctions qui cassent au premier déplacement de dépôt.
 *
 * Usage : node oracle-skills.mjs [--racine <dossier des forges>] [--installes <dossier>]
 *         node oracle-skills.mjs --appliquer   # copie source → installé (K1 et K2 seulement)
 *         node oracle-skills.mjs --self-test
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
import {
  existsSync, readFileSync, readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync,
  mkdtempSync,
} from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir, tmpdir } from "node:os";

const VERSION = "1.0.0";
const ORACLE = "oracle-skills";
const ICI = dirname(fileURLToPath(import.meta.url));

// Artefacts d'atelier : produits par l'exécution, jamais par l'auteur. Les comparer ferait
// diverger deux copies identiques dès qu'on a joué un oracle d'un côté.
const IGNORES = new Set(["__pycache__", ".oracles", ".pytest_cache", "node_modules", ".venv"]);
// Sauvegardes laissées à côté d'un fichier édité (`SKILL.md.bak-20260407`). Elles n'ont rien à
// faire dans un dépôt et ne sont pas non plus un défaut de la copie : on ne les compare pas, et
// surtout on ne les EFFACE pas — c'est un fichier de l'humain, pas un artefact de la forge.
const IGNORE_MOTIF = /\.bak(?:[-.]\w+)?$/i;
// Deux conventions de chemin coexistent : forge-agents publie sous `.claude/skills/`,
// conception et design sous `skills/`. Les deux sont lues — imposer l'une des deux serait un
// autre chantier, et l'oracle n'a pas à trancher une convention pour pouvoir mesurer.
const SOUS_CHEMINS = [join(".claude", "skills"), "skills"];

const NON_JUGE = [
  "le CONTENU d'un skill, sa qualité, son opportunité — cet oracle compare deux copies, il ne lit pas",
  "les skills personnels de l'humain (sans source versionnée) : déclarés par K4, jamais jugés",
  "une édition FUTURE de la copie installée — l'oracle la verra au run suivant, il ne la verrouille pas",
];

function racineForges() {
  return process.env.FORGE_ROOT || resolve(ICI, "..", "..");
}

function listeSkills(dossier) {
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dossier, d.name, "SKILL.md")))
    .map((d) => d.name);
}

/** Toutes les sources versionnées : nom -> [chemins], pour que K3 puisse voir un doublon. */
function sources(racine) {
  const par_nom = new Map();
  if (!existsSync(racine)) return par_nom;
  for (const depot of readdirSync(racine, { withFileTypes: true })) {
    if (!depot.isDirectory() || !depot.name.startsWith("digit-ai-forge-")) continue;
    for (const sous of SOUS_CHEMINS) {
      const base = join(racine, depot.name, sous);
      for (const nom of listeSkills(base)) {
        if (!par_nom.has(nom)) par_nom.set(nom, []);
        par_nom.get(nom).push(join(base, nom));
      }
    }
  }
  return par_nom;
}

/** Version déclarée en frontmatter du SKILL.md, si elle existe. */
function version(dossier) {
  const f = join(dossier, "SKILL.md");
  if (!existsSync(f)) return null;
  const m = readFileSync(f, "utf8").match(/^\s*version:\s*"?([\d]+(?:\.[\d]+)*)"?/m);
  return m ? m[1] : null;
}

/** -1, 0, 1 — comparaison numérique segment par segment (« 2.10.0 » > « 2.9.0 »). */
function comparerVersions(a, b) {
  const xa = a.split(".").map(Number), xb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(xa.length, xb.length); i += 1) {
    const d = (xa[i] || 0) - (xb[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
}

function fichiers(dossier, prefixe = "") {
  const out = [];
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    if (IGNORES.has(e.name) || IGNORE_MOTIF.test(e.name)) continue;
    const rel = prefixe ? `${prefixe}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...fichiers(join(dossier, e.name), rel));
    else out.push(rel);
  }
  return out.sort();
}

/** Identiques ? Les fins de ligne ne comptent pas : git les normalise, l'auteur n'y est pour rien. */
function memeContenu(a, b) {
  const x = readFileSync(a);
  const y = readFileSync(b);
  if (x.equals(y)) return true;
  const texte = (buf) => buf.toString("utf8").replace(/\r\n/g, "\n");
  return texte(x) === texte(y);
}

function ecarts(src, dst) {
  const fs_src = fichiers(src);
  const fs_dst = existsSync(dst) ? fichiers(dst) : [];
  const set_dst = new Set(fs_dst);
  const differents = [];
  for (const f of fs_src) {
    if (!set_dst.has(f)) { differents.push(`${f} (absent de la copie)`); continue; }
    if (!memeContenu(join(src, f), join(dst, f))) differents.push(f);
  }
  const set_src = new Set(fs_src);
  for (const f of fs_dst) if (!set_src.has(f)) differents.push(`${f} (en trop dans la copie)`);
  return differents;
}

function copier(src, dst) {
  for (const f of fichiers(src)) {
    const cible = join(dst, f);
    mkdirSync(dirname(cible), { recursive: true });
    copyFileSync(join(src, f), cible);
  }
}

function juger(racine, installes, appliquer = false) {
  const findings = [];
  const par_nom = sources(racine);
  if (par_nom.size === 0) {
    return { verdict: "SKIP", findings, motif: `aucune source de skill sous ${racine}` };
  }
  const applique = [];

  // K3 d'abord : sans source unique, K1 et K2 n'ont pas de sens pour ce nom.
  const ambigus = new Set();
  for (const [nom, chemins] of par_nom) {
    if (chemins.length > 1) {
      ambigus.add(nom);
      findings.push({
        regle: "K3", statut: "FAIL", ou: nom,
        message: `revendiqué par ${chemins.length} sources (${chemins.map((c) => relative(racine, c)).join(", ")}) — « la » source n'existe pas, la copie installée ne peut pas être arbitrée`,
      });
    }
  }

  for (const [nom, chemins] of [...par_nom].sort()) {
    if (ambigus.has(nom)) continue;
    const src = chemins[0];
    const dst = join(installes, nom);
    if (!existsSync(dst)) {
      if (appliquer) { copier(src, dst); applique.push(`${nom} (installé)`); continue; }
      findings.push({
        regle: "K1", statut: "FAIL", ou: nom,
        message: `versionné dans ${relative(racine, src)} mais JAMAIS installé — la session ne peut pas l'invoquer (\`--appliquer\` pour l'installer)`,
      });
      continue;
    }
    const diff = ecarts(src, dst);
    if (diff.length) {
      // K5 — GARDE-FOU, et il a servi le jour même de son écriture. `prompt-analyzer-l99`
      // installé était en 2.2.0 quand la source du dépôt en était à 2.1.0 : un
      // `--appliquer` naïf aurait ÉCRASÉ une version par une plus ancienne, c'est-à-dire
      // détruit du travail au nom de la synchronisation. La copie installée n'est pas
      // toujours la copie en retard, et l'oracle ne doit jamais le présumer.
      const vs = version(src), vd = version(dst);
      if (vs && vd && comparerVersions(vd, vs) > 0) {
        findings.push({
          regle: "K5", statut: "FAIL", ou: nom,
          message: `la copie installée est EN AVANCE (${vd} > ${vs}) — c'est le DÉPÔT qui est en retard ; \`--appliquer\` refuse d'écraser une version par une plus ancienne, la source doit être mise à jour d'abord`,
        });
        continue;
      }
      if (appliquer) { copier(src, dst); applique.push(`${nom} (${diff.length} fichier(s) remis à niveau)`); continue; }
      findings.push({
        regle: "K2", statut: "FAIL", ou: nom,
        message: `la copie installée DIVERGE de ${relative(racine, src)} sur ${diff.length} fichier(s) : ${diff.slice(0, 4).join(", ")}${diff.length > 4 ? "…" : ""} — c'est la copie qui s'exécute`,
      });
    }
  }

  // K4 : ce qui est installé sans source versionnée appartient à l'humain. Déclaré, pas jugé.
  const personnels = listeSkills(installes).filter((n) => !par_nom.has(n));

  const vues = new Set(findings.map((f) => f.regle));
  const total = par_nom.size;
  for (const [regle, message] of [
    ["K1", `${total} skill(s) versionné(s), tous installés`],
    ["K2", "chaque copie installée est identique à sa source"],
    ["K3", "aucun nom de skill revendiqué par deux forges"],
    ["K5", "aucune copie installée en avance sur sa source"],
  ]) if (!vues.has(regle)) findings.push({ regle, statut: "PASS", message });
  findings.push({
    regle: "K4", statut: "PASS",
    message: personnels.length
      ? `${personnels.length} skill(s) personnel(s) sans source versionnée, déclarés et non jugés : ${personnels.join(", ")}`
      : "aucun skill installé sans source versionnée",
  });
  findings.sort((a, b) => a.regle.localeCompare(b.regle) || (a.statut === "FAIL" ? -1 : 1));

  return {
    verdict: findings.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS",
    findings,
    applique: appliquer ? applique : undefined,
  };
}

// ---- self-test : chaque règle dans les DEUX sens ----------------------------------------------
function selfTest() {
  const base = mkdtempSync(join(tmpdir(), "skills-"));
  const racine = join(base, "forges");
  const inst = join(base, "installes");
  const poser = (chemin, contenu) => { mkdirSync(dirname(chemin), { recursive: true }); writeFileSync(chemin, contenu); };

  const src = join(racine, "digit-ai-forge-agents", ".claude", "skills");
  poser(join(src, "alpha", "SKILL.md"), "# alpha\n");
  poser(join(src, "alpha", "scripts", "x.py"), "print(1)\n");
  poser(join(inst, "alpha", "SKILL.md"), "# alpha\n");
  poser(join(inst, "alpha", "scripts", "x.py"), "print(1)\n");

  const cas = [];
  const echoue = (r, regle) => r.findings.some((f) => f.regle === regle && f.statut === "FAIL");

  let r = juger(racine, inst);
  cas.push(["vert  — source et copie identiques", r.verdict === "PASS"]);

  // K2 bis : les fins de ligne ne sont PAS un écart — git les normalise, pas l'auteur.
  writeFileSync(join(inst, "alpha", "SKILL.md"), "# alpha\r\n");
  r = juger(racine, inst);
  cas.push(["K2    — CRLF vs LF n'est pas un écart", !echoue(r, "K2")]);

  // K2 : un vrai écart de contenu.
  writeFileSync(join(inst, "alpha", "scripts", "x.py"), "print(2)\n");
  r = juger(racine, inst);
  cas.push(["K2    — copie installée divergente", echoue(r, "K2")]);

  // --appliquer remet à niveau, et le verdict repasse au vert.
  juger(racine, inst, true);
  r = juger(racine, inst);
  cas.push(["      — --appliquer remet la copie à niveau", r.verdict === "PASS"]);

  // K1 : versionné, jamais installé.
  poser(join(src, "beta", "SKILL.md"), "# beta\n");
  r = juger(racine, inst);
  cas.push(["K1    — skill versionné non installé", echoue(r, "K1")]);
  juger(racine, inst, true);
  cas.push(["      — --appliquer l'installe", existsSync(join(inst, "beta", "SKILL.md"))]);

  // K3 : deux forges revendiquent le même nom.
  poser(join(racine, "digit-ai-forge-design", "skills", "beta", "SKILL.md"), "# beta bis\n");
  r = juger(racine, inst);
  cas.push(["K3    — même nom dans deux forges", echoue(r, "K3")]);
  // …et --appliquer REFUSE de trancher : la copie ne doit pas bouger.
  const avant = readFileSync(join(inst, "beta", "SKILL.md"), "utf8");
  juger(racine, inst, true);
  cas.push(["K3 bis— --appliquer n'arbitre pas un doublon",
            readFileSync(join(inst, "beta", "SKILL.md"), "utf8") === avant]);

  // K5 : la copie installée est EN AVANCE. C'est le cas réel du 15/08 —
  // prompt-analyzer-l99 installé en 2.2.0, source du dépôt en 2.1.0. Les deux sens comptent :
  // en avance -> refus d'appliquer ET contenu préservé ; en retard -> comportement normal.
  const frontmatter = (v, titre) => ["---", `version: "${v}"`, "---", `# ${titre}`, ""].join("\n");
  poser(join(src, "gamma", "SKILL.md"), frontmatter("1.0.0", "gamma"));
  poser(join(inst, "gamma", "SKILL.md"), frontmatter("2.2.0", "gamma ameliore"));
  r = juger(racine, inst);
  cas.push(["K5    — copie installée en avance sur sa source", echoue(r, "K5")]);
  const avantG = readFileSync(join(inst, "gamma", "SKILL.md"), "utf8");
  juger(racine, inst, true);
  cas.push(["K5 bis— --appliquer n'écrase PAS une version plus récente",
            readFileSync(join(inst, "gamma", "SKILL.md"), "utf8") === avantG]);
  // Sens inverse : source en avance, l'application se fait normalement.
  poser(join(src, "gamma", "SKILL.md"), frontmatter("3.0.0", "gamma refondu"));
  juger(racine, inst, true);
  cas.push(["K5 ter— source en avance : l'application se fait",
            /3\.0\.0/.test(readFileSync(join(inst, "gamma", "SKILL.md"), "utf8"))]);

  // Une sauvegarde laissée dans la copie n'est ni comparée ni effacée — cas réel :
  // `SKILL.md.bak-20260407` traînait à côté de prompt-analyzer-l99.
  poser(join(inst, "alpha", "SKILL.md.bak-20260407"), "# vieille version\n");
  r = juger(racine, inst);
  cas.push(["      — une sauvegarde .bak n'est pas un écart",
            !r.findings.some((f) => f.regle === "K2" && f.statut === "FAIL" && f.ou === "alpha")]);

  // K4 : un skill personnel est déclaré, jamais mis en échec.
  poser(join(inst, "perso", "SKILL.md"), "# perso\n");
  r = juger(racine, inst);
  cas.push(["K4    — skill personnel déclaré, non jugé",
            !r.findings.some((f) => f.regle === "K4" && f.statut === "FAIL")
            && r.findings.some((f) => f.regle === "K4" && /perso/.test(f.message))]);

  let bons = 0;
  for (const [nom, tenu] of cas) {
    console.log(`  [${tenu ? "OK    " : "ECHEC "}] ${nom}`);
    if (tenu) bons += 1;
  }
  console.log(`Self-test oracle-skills : ${bons}/${cas.length}`);
  return bons === cas.length ? 0 : 1;
}

// ---- entrée -----------------------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.includes("--self-test")) process.exit(selfTest());

const lire = (drapeau, defaut) => {
  const i = args.indexOf(drapeau);
  return i >= 0 && args[i + 1] ? resolve(args[i + 1]) : defaut;
};
const racine = lire("--racine", racineForges());
const installes = lire("--installes", join(homedir(), ".claude", "skills"));
const appliquer = args.includes("--appliquer");

const { verdict, findings, motif, applique } = juger(racine, installes, appliquer);
process.stdout.write(JSON.stringify(
  { oracle: ORACLE, version: VERSION, racine, installes, verdict, motif, applique, findings, non_juge: NON_JUGE },
  null, 1) + "\n");
process.exit(verdict === "FAIL" ? 1 : verdict === "SKIP" ? 2 : 0);
