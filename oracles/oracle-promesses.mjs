#!/usr/bin/env node
/**
 * oracle-promesses.mjs — une promesse écrite dans un commentaire de CODE est vérifiée (23/08/2026).
 *
 * POURQUOI, ET C'EST LA MOITIÉ ÉTENDUE D'UN CHOIX HUMAIN. La règle L22 du socle vérifie les
 * promesses écrites dans un commentaire de PAGE : un commentaire qui annonce « un titre par forme »
 * et un schéma qui n'en porte pas. Le choix du 23/08 a retenu la version étendue — les commentaires
 * de CODE aussi, parce que c'est là que vivent les générateurs de pages, et qu'un générateur qui
 * promet une classe qu'il n'écrit jamais produit des pages muettes sans qu'aucune page ne soit
 * fautive.
 *
 *   PR1 · un commentaire qui nomme une CLASSE (`.ma-classe`) ou un ATTRIBUT (`data-quelque-chose`)
 *         absent du fichier qui le porte. Avertissement, jamais bloquant : un commentaire peut
 *         parler d'une convention générale, et un contrôle bruyant s'apprend à être ignoré.
 *
 * TROIS GARDES, sans lesquelles la règle serait une nuisance :
 *   · seuls les fichiers qui ÉMETTENT du HTML sont lus — un commentaire qui nomme une classe dans
 *     un script qui n'écrit aucune page ne promet rien à personne ;
 *   · la NÉGATION est respectée : « pas de `.toc` ici », « au lieu de `data-vide` » documentent un
 *     choix ;
 *   · l'échappatoire déclarative `promesse-ok` sur la ligne.
 *
 * LE NIVEAU DU VERDICT EST UN CHOIX HUMAIN DATÉ, pas un réglage par défaut (23/08/2026). La
 * question a été posée avec ses deux options : armer la règle en gate bloquant maintenant, ou la
 * laisser avertir jusqu'au SECOND vrai constat. Réponse : **elle avertit**. La raison tient à la
 * doctrine maison — un contrôle passe en gate sur GAINS CONSTATÉS, et le gain constaté ne porte
 * pour l'instant que sur un cas, `data-src-format` chez le socle. Ce commentaire existe pour que le
 * choix ne soit pas re-débattu à chaque lecture, et pour dire ce qui le renverserait : *un deuxième
 * vrai constat, et la règle passe bloquante* — c'est écrit ici, pas laissé au ressenti du jour.
 *
 * ET LA BASCULE EST DÉJÀ AUTORISÉE (23/08/2026, fin de journée). Le pilote humain a validé l'action
 * par avance : au SECOND vrai constat, la règle passe bloquante et l'item est journalisé, sans
 * repasser par une question. Ce qui reste à juger est ce qu'aucun code ne juge — qu'un constat soit
 * VRAI, c'est-à-dire une promesse réellement non tenue et non un commentaire qui parle d'ailleurs.
 * L'autorisation est écrite ici pour que le tour qui la trouvera n'ait pas à la redemander.
 *
 * Usage : node oracle-promesses.mjs [racine-des-forges] [--json] · --self-test
 * Exit : 0 = PASS (avertissements possibles) · 2 = SKIP motivé. Jamais 1 : la règle avertit.
 */
// Exit : 0 = conforme · 1 = defaut MESURE. Aucun chemin « je ne peux pas mesurer » : cet oracle lit des fichiers du depot.
// Le declarer vaut mieux que de le taire — un contrat muet laisse lire un 1 comme une panne
// d'environnement (TF-0648).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const PILOT = join(ICI, "..");
const args = process.argv.slice(2);
const jsonOnly = args.includes("--json");

const F = [];
const ok = (regle, ou, message) => F.push({ regle, statut: "PASS", ou, message });
const av = (regle, ou, message) => F.push({ regle, statut: "AVERTISSEMENT", ou, message });
const so = (regle, ou, message) => F.push({ regle, statut: "SANS_OBJET", ou, message });

const NON_JUGE = [
  "les fichiers qui n'ont PAS adhéré (`promesses-verifiees` en tête) : ils ne sont pas jugés, et c'est le prix d'une précision totale sur ceux qui ont signé. Le balayage global rendait 1 constat vrai sur 8 — mesuré le 23/08 avant de choisir l'adhésion",
  "les promesses de PAGE : elles sont jugées par la règle L22 du socle, sur le HTML lui-même — ici on ne lit que du code",
  "une promesse formulée sans nommer de classe ni d'attribut (« l'infobulle est native », « le tableau se replie ») : elle est invisible à ce contrôle, et la rendre visible demanderait de comprendre la prose",
  "la JUSTESSE d'une promesse tenue : que la classe existe ne dit pas qu'elle fait ce que le commentaire annonce",
  "une classe qui porterait le NOM d'une extension connue (« .csv », « .map ») : elle est écartée sans être lue, faute de pouvoir distinguer « le fichier .csv » de « la classe .csv ». Deux faux positifs mesurés sur le parc le 23/08 l'ont imposé, et c'est le MÊME piège que « lib-vue-html.mjs » pris une troisième fois",
  "les fichiers qui n'émettent pas de HTML : un commentaire y nommant une classe ne promet rien à personne, et les lire produirait du bruit sans gain",
  "les VÉRIFICATEURS, tests et oracles : ils citent une classe parce qu'ils la CHERCHENT, pas parce qu'ils la promettent. Ils sont écartés par leur nom, et un générateur nommé comme un vérificateur échapperait donc au contrôle",
  "le BRUIT MESURÉ le 23/08 avant resserrage : 54 constats dont la plupart faux — extensions de fichier lues comme des classes, contrôleurs pris pour des générateurs. C'est pourquoi cette règle avertit et n'est PAS armée en gate : un contrôle bruyant s'apprend à être ignoré",
];

const NEGATIONS = /(aucun|aucune|pas de|ne pas|jamais|sans |retirer|supprim|au lieu de|plut[oô]t que|interdit|non |[ée]viter|obsol[èe]te|ancien)/i;
// EXTENSIONS DE FICHIER, et c'est le même piège pris TROIS FOIS : un commentaire qui parle d'un
// fichier écrit son extension, et le jeton de classe y ressemble trait pour trait. Le premier jet
// lisait « lib-vue-html.mjs » comme une classe ; le survol du parc du 23/08 en a rendu deux autres,
// « .csv » et « .gitkeep ». Une LISTE d'extensions vaut mieux qu'une heuristique de contexte : elle
// est fausse d'une façon connue, et ce prix est écrit en non_juge au lieu d'être découvert.
const EXTENSIONS_CONNUES = new Set([
  "csv", "json", "jsonl", "md", "html", "htm", "css", "svg", "png", "jpg", "jpeg", "webp", "ico",
  "txt", "yml", "yaml", "toml", "env", "lock", "log", "zip", "pdf", "xlsx", "docx", "sql", "sh",
  "ps1", "bat", "gitignore", "gitkeep", "gitattributes", "editorconfig", "npmrc", "venv", "mjs",
  "cjs", "tsx", "jsx", "ini", "cfg", "tmp", "bak", "map",
]);
const EXT = /\.(mjs|cjs|js|py)$/i;
const IGNORES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build", "generated", "vendor", "fixtures"]);
const DOSSIERS = ["scripts", "oracles", "tools", "todo", "skills"];

function* fichiers(dossier, prof = 0) {
  if (prof > 3 || !existsSync(dossier)) return;
  let entrees = [];
  try { entrees = readdirSync(dossier, { withFileTypes: true }); } catch { return; }
  for (const e of entrees) {
    if (IGNORES.has(e.name)) continue;
    const p = join(dossier, e.name);
    if (e.isDirectory()) yield* fichiers(p, prof + 1);
    else if (EXT.test(e.name)) yield p;
  }
}

/** Les lignes de commentaire d'un source, sans distinguer les langages : `//`, `#`, `*`. */
export function commentaires(source) {
  const out = [];
  source.split(/\r?\n/).forEach((l, i) => {
    const m = /(?:^|\s)(?:\/\/|#|\*)\s?(.*)$/.exec(l);
    if (m && m[1].trim()) out.push({ ligne: i + 1, texte: m[1] });
  });
  return out;
}

/** Un fichier ÉMET du HTML — et c'est différent d'en LIRE.
 *
 * Le premier jet répondait vrai pour un vérificateur de pages, parce qu'un vérificateur écrit
 * `class=["']` dans ses expressions de contrôle. Résultat : il citait `.card` dans un commentaire
 * pour dire qu'il la CHERCHE, et le contrôle y lisait une promesse. 54 constats, la plupart faux.
 *
 * Deux exigences cumulatives, donc : produire une SORTIE (écrire un fichier, ou toucher le DOM) ET
 * porter du balisage. Un vérificateur, un test, un oracle ne sont jamais des générateurs — leur nom
 * les déclare, et c'est l'indice le plus fiable du parc.
 */
export function emetDuHtml(source, nom = "") {
  if (/^(check_|oracle-|verifier-|self.test|test_|.*\.test\.)/i.test(nom)) return false;
  const produit = /writeFileSync|innerHTML|createElement|classList|\.write\(|open\([^)]*["']w["']/.test(source);
  const balise = /<(?:div|section|table|figure|span|ul|li|svg|details|nav|h[1-6])[\s>]/i.test(source);
  return produit && balise;
}

/** Le source PRIVÉ de ses commentaires : une promesse ne se prouve pas avec une autre promesse. */
export function sansCommentaires(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "")
    .split(/\r?\n/).map((l) => l.replace(/(?:^|\s)(?:\/\/|#)\s?.*$/, "")).join("\n");
}

/** Un fichier ADHÈRE au contrôle en le déclarant une fois, en tête. */
export function adhere(source) {
  return /promesses-verifiees/.test(source.slice(0, 4000));
}

export function juger(source, nom = "") {
  // ADHÉSION PAR FICHIER, et c'est la mesure qui l'a imposée : sur le parc entier, le balayage
  // rendait huit constats dont UN SEUL vrai. Les sept autres étaient un anti-patron décrit, un
  // « CSS attendu de la page hôte », et un mesureur citant un sélecteur qu'il cherche — trois
  // natures qu'aucune heuristique ne distingue d'une promesse. Une précision d'un sur huit
  // s'apprend à être ignorée. Un fichier qui veut être tenu à ses promesses le DÉCLARE.
  if (!adhere(source)) return [];
  if (!emetDuHtml(source, nom)) return [];
  // LE PIÈGE, trouvé par la recette : le jeton promis apparaît DANS le commentaire, entre accents
  // graves. En cherchant sa présence dans le source ENTIER, on trouvait le commentaire lui-même et
  // on concluait que la promesse était tenue. Une promesse qui se prouve toute seule est le défaut
  // exact que cette règle traque — elle l'a commis avant de le refuser.
  const net = sansCommentaires(source);
  const constats = [];
  for (const { ligne, texte } of commentaires(source)) {
    if (/promesse-ok/.test(texte)) continue;
    // Une classe ou un attribut NOMMÉ dans le commentaire. Les deux formes que le parc emploie :
    // `.ma-classe` entre accents graves ou nue, et `data-quelque-chose`.
    const jetons = new Set();
    for (const m of texte.matchAll(/(^|[\s`(«'"])\.([a-z][a-z0-9-]{2,})/gi)) {
      if (EXTENSIONS_CONNUES.has(m[2].toLowerCase())) continue;   // une extension de fichier, pas une classe
      jetons.add("." + m[2]);
    }
    for (const m of texte.matchAll(/`?(data-[a-z][a-z0-9-]{2,})`?/gi)) jetons.add(m[1]);
    for (const jeton of jetons) {
      const i = texte.indexOf(jeton.replace(/^\./, "."));
      const avant = texte.slice(Math.max(0, i - 60), i);
      if (NEGATIONS.test(avant)) continue;
      const nom = jeton.startsWith(".") ? jeton.slice(1) : jeton;
      // Présent AILLEURS que dans un commentaire ? On cherche la forme utile : une classe posée
      // ou visée, un attribut écrit.
      const utile = jeton.startsWith(".")
        ? new RegExp(`(class=["'\`][^"'\`]*\\b${nom}\\b|classList[^\\n]*["'\`]${nom}["'\`]|\\.${nom}\\s*[{,:]|["'\`]${nom}["'\`])`).test(net)
        : new RegExp(`(${nom}=|setAttribute\\(\\s*["'\`]${nom}|\\[${nom}\\]|["'\`]${nom}["'\`])`).test(net);
      if (utile) continue;
      constats.push({ ligne, jeton, extrait: texte.trim().slice(0, 110) });
    }
  }
  return constats;
}

// ---- recette : les deux sens ------------------------------------------------------------------
// GARDE DE LANCEMENT DIRECT, et elle a ete payee : sans elle, importer ce module pour le tester
// jouait tout le balayage puis appelait process.exit — la recette ne pouvait donc pas verifier ses
// propres fonctions sur un fichier reel. Un module qui ne peut pas etre lu par un test se juge
// tout seul, ce qui ne juge rien.
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");

if (lanceEnDirect && args.includes("--self-test")) {
  let pass = 0; const echecs = [];
  const att = (quoi, cond) => { if (cond) { pass++; console.log(`  [OK  ] ${quoi}`); } else { echecs.push(quoi); console.log(`  [ECHEC] ${quoi}`); } };
  console.log("Recette d'oracle-promesses — les deux sens\n");

  const SIGNE = "// promesses-verifiees\n";
  // Les fixtures ressemblent à de VRAIS générateurs : elles SIGNENT l'adhésion et elles ÉCRIVENT
  // un fichier. C'est le double resserrage imposé par le bruit mesuré — un vérificateur qui cite
  // une classe ne la promet pas, et un fichier qui n'a pas signé n'est pas jugé.
  const AVEC = SIGNE + 'const html = `<section class="chap">…</section>`;\nwriteFileSync(out, html);\n';
  att("une classe promise et JAMAIS posée est signalée",
    juger(AVEC + "// Le sommaire porte `.toc` et ses entrées.\n").length === 1);
  att("le constat NOMME le jeton promis",
    juger(AVEC + "// Le sommaire porte `.toc`.\n")[0].jeton === ".toc");
  att("la même classe POSÉE ne déclenche rien",
    juger(SIGNE + 'const html = `<nav class="toc">…</nav>`;\n// Le sommaire porte `.toc`.\n').length === 0);
  att("une classe VISÉE par une règle de style suffit",
    juger(AVEC + "const css = `.toc{margin:0}`;\n// Le sommaire porte `.toc`.\n").length === 0);
  att("un attribut promis et absent est signalé",
    juger(AVEC + "// Chaque ligne vide porte `data-tf-empty`.\n").length === 1);
  att("le même attribut écrit ne déclenche rien",
    juger(AVEC + 'el.setAttribute("data-tf-empty", "");\n// Chaque ligne vide porte `data-tf-empty`.\n').length === 0);
  att("une NÉGATION ne promet rien",
    juger(AVEC + "// Ici, pas de `.toc` : ce n'est pas un sommaire.\n").length === 0);
  att("l'échappatoire déclarative se respecte",
    juger(AVEC + "// Le sommaire porte `.toc`.   promesse-ok\n").length === 0);
  att("un fichier qui n'émet PAS de HTML n'est pas lu",
    juger(SIGNE + "// Le sommaire porte `.toc`.\nconst x = 1;\n").length === 0);
  att("un fichier qui n'a PAS ADHÉRÉ n'est pas jugé, même fautif",
    juger('const html = `<section class="chap">…</section>`;\nwriteFileSync(out, html);\n'
      + "// Le sommaire porte `.toc`.\n").length === 0);

  console.log(`\nRecette promesses : ${pass}/${pass + echecs.length} cas`);
  process.exit(echecs.length ? 1 : 0);
}

// ---- balayage du parc ------------------------------------------------------------------------
if (lanceEnDirect) {
  const racine = args.find((a) => !a.startsWith("--")) || process.env.FORGE_ROOT || join(PILOT, "..");
  if (!existsSync(racine)) {
    so("PR0", String(racine), "racine introuvable — rien à balayer");
  } else {
    const depots = readdirSync(racine, { withFileTypes: true })
      .filter((e) => e.isDirectory() && /^digit-ai/.test(e.name) && !/_old$|_vide$|\.bundle$|_client-a$/.test(e.name))
      .map((e) => e.name);
    let lus = 0;
    const trouves = [];
    for (const depot of depots) {
      const base = join(racine, depot);
      for (const dossier of [...DOSSIERS.map((d) => join(base, d)), join(base, ".claude", "skills")]) {
        for (const f of fichiers(dossier)) {
          let texte = "";
          try { texte = readFileSync(f, "utf8"); } catch { continue; }
          lus += 1;
          for (const c of juger(texte, f.split(/[\\/]/).pop())) {
            trouves.push({ ...c, ou: `${depot}/${relative(base, f).replaceAll("\\", "/")}:${c.ligne}` });
          }
        }
      }
    }
    if (!trouves.length) {
      ok("PR1", String(racine), `${lus} fichier(s) de code lus dans ${depots.length} dépôt(s) : ` +
        "aucune classe ni attribut promis en commentaire sans être posé");
    } else {
      for (const t of trouves.slice(0, 12)) {
        av("PR1", t.ou, `« ${t.jeton} » est promis en commentaire et n'est posé nulle part dans le ` +
          `fichier — « ${t.extrait} ». Une promesse de prose vaut preuve tant que rien ne la lit. ` +
          "Poser l'élément, écrire la négation si le choix est de ne pas le faire, ou déclarer par " +
          "« promesse-ok »");
      }
      if (trouves.length > 12) av("PR1", String(racine), `+ ${trouves.length - 12} autre(s) promesse(s) non tenue(s)`);
    }
  }

  console.log(JSON.stringify({ oracle: "oracle-promesses", version: "1.0.0", racine: String(racine),
    verdict: F.some((f) => f.statut === "AVERTISSEMENT") ? "AVERTISSEMENT" : "PASS",
    findings: F, non_juge: NON_JUGE }, null, jsonOnly ? 0 : 1));
  process.exit(0);
}
