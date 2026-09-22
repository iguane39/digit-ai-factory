#!/usr/bin/env node
/**
 * oracle-chemin-prescrit.mjs — UN CHEMIN D'USAGE PRESCRIT SE JOUE SUR LA CIBLE QU'IL NOMME
 * (classe `oracle-chemin-prescrit-inoperant-sur-sa-cible`, TF-1282, lot
 * Produit-64 - RETOURS - 20260921b du 21/09/2026).
 *
 * ============================================================================================
 * LE FAIT PAYÉ
 * ============================================================================================
 *
 * Le socle des pages HTML PRESCRIT un geste pour produire la matière de sa revue de lecture
 * obligatoire : une capture, par `--sections` et `--selector`. Mesuré le 21/09/2026 chez
 * Produit-64 : sur un panneau masqué — la cible même que le geste nomme — les deux options
 * rendent `TimeoutError` et AUCUNE image, et la capture de page est perdue au passage. Le message
 * d'échec prescrit alors un remède sans effet. L'auteur de bonne foi fabrique un contournement
 * pour obéir, et ce contournement n'est pas le livrable.
 *
 * LA CLASSE SE DISTINGUE DE SA VOISINE, et l'auteur du lot l'a écrit : `regle-qui-interdit-son-
 * propre-remede` décrit un contrôle qui REFUSE la correction qu'il recommande. Ici le contrôle ne
 * refuse rien — il prescrit un chemin qui n'atteint pas sa cible.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET POURQUOI SUR LES DOCUMENTS
 * ============================================================================================
 *
 * L'objet jugé est la PRESCRIPTION, c'est-à-dire la commande qu'un document du dépôt met devant
 * un producteur : une ligne `node <script> [--options]` dans une référence, un gabarit ou une
 * règle de projet. C'est là que vit le défaut — un producteur ne lit pas le code de l'oracle, il
 * lit la commande qu'on lui dit de jouer.
 *
 *   CP1 · toute commande prescrite RÉSOUT vers un fichier qui existe. La résolution suit l'ordre
 *         que la doctrine des chemins écrit elle-même : le dépôt du document d'abord, puis la
 *         RACINE DU PARC et ses dépôts frères — une référence du pilot prescrit légitimement un
 *         script de `digit-ai-forge-websec`, et l'accuser serait un faux positif. Mesuré : sur
 *         les 58 commandes que les documents du pilot prescrivent, 3 ne résolvaient que dans une
 *         forge sœur (`scripts\capturer.mjs`, `oracles\oracle-exposition.mjs`,
 *         `oracles\rendu-comparatif.mjs`) — la prescription était juste, la mesure trop étroite.
 *   CP2 · toute OPTION prescrite avec cette commande est DÉCLARÉE par le script qu'elle
 *         accompagne — présente dans sa source. Une option prescrite que le script ne connaît pas
 *         est un chemin d'usage inexistant : il échoue, ou il ignore l'option en silence, ce qui
 *         est pire.
 *   CP3 · toute option prescrite est JOUÉE par le banc du script, quand ce banc existe. C'est la
 *         règle que le fait fondateur réclame : *la fixture du remède est aussi obligatoire que la
 *         fixture du défaut.* Une option prescrite que la recette ne joue jamais n'a jamais été
 *         vue fonctionner, et le producteur est le premier à l'essayer.
 *
 * ============================================================================================
 * LES EXCLUSIONS, ÉCRITES ET MESURÉES — un faux positif sur une prescription fait désactiver
 * l'oracle, et la leçon N4 du noyau dit ce qui arrive ensuite
 * ============================================================================================
 *
 *   · un chemin de CONVENTION D'ACCUEIL (`forge\…`, `.claude\…`, `~\…`) : un gabarit destiné à
 *     être copié chez un produit prescrit un chemin qui n'a de sens que CHEZ SON HÔTE futur.
 *     Mesuré : `gabarits\RETOURS-FORGES.md` prescrit `forge\retours\oracle-lot.mjs`,
 *     `gabarits\AGENT-CAMPAGNE.md` prescrit un script sous `.claude\skills\` ;
 *   · un chemin sous un PLACEHOLDER (`<racine>`, `<produit>`, `<pilot>`, `$FORGE_ROOT`) : la
 *     prescription est paramétrée, et résoudre un paramètre serait l'inventer ;
 *   · les documents de `output\` et `input\` : ce sont des LIVRABLES et des ENTRANTS datés, pas
 *     des prescriptions. Un plan du 30/08 cite l'outillage du 30/08, et le corriger réécrirait
 *     l'histoire au lieu de cesser d'en produire (patron R-42).
 *
 * Usage : node oracles\oracle-chemin-prescrit.mjs [dépôt] [--parc <racine>] [--json]
 * Exit : 0 = PASS · 1 = FAIL · 2 = SANS OBJET (aucun document à juger).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

const SAUTES = new Set([".git", "node_modules", ".venv", "__pycache__", "dist", "build_out",
  ".next", "vendor", ".pytest_cache", ".ruff_cache", "old", "Old", "output", "input", "_arrivee"]);

/**
 * La PRESCRIPTION reconnue : une commande `node <script>` suivie de ses options. Le motif est
 * volontairement étroit — `node`, et rien d'autre. Reconnaître « lancez le script X » en prose
 * demanderait de deviner, et un faux positif sur une prescription est le plus cher de tous :
 * il accuse la doctrine qui décrit un défaut pour l'interdire.
 */
export const RE_PRESCRIPTION = /node\s+((?:[A-Za-z]:)?[\w.$<>/\\-]*[\w>-]+\.(?:mjs|cjs|js|py))((?:\s+--[\w-]+)*)/g;

/** Un chemin qui n'a de sens que chez l'hôte futur d'un gabarit, ou sous un paramètre. */
export const HORS_PORTEE = [
  /^~[\\/]/, /^forge[\\/]/, /^\.claude[\\/]/, /^\.\.[\\/]/,
  /[<>]/, /\$FORGE_ROOT/i, /%[A-Z_]+%/,
];

/**
 * UN NOM NU DONT LE CHEMIN COMPLET EST ÉCRIT DANS LE MÊME DOCUMENT EST UN RACCOURCI, PAS UNE
 * PRESCRIPTION — et les deux bornes de cette règle sont mesurées.
 *
 * Le cas à écarter : `CONTRAT-INTERFACE.md` écrit `node ledger.mjs verify <ledger.jsonl>` à la
 * ligne 153, et donne le chemin complet six lignes plus haut, à la 107
 * (`digit-ai-forge-agents/.claude/skills/forge-agents/scripts/ledger.mjs`). Le producteur qui lit
 * le paragraphe a le chemin ; accuser le raccourci ferait crier l'oracle sur une doctrine juste.
 *
 * Le cas à NE PAS écarter, et c'est le premier jet qui l'a montré : écarter TOUT nom sans
 * séparateur a retiré 76 prescriptions de la mesure d'un coup, dont `node bootstrap.mjs --pull`
 * — le geste de fraîcheur que le noyau prescrit à chaque ouverture, un script qui vit bel et bien
 * à la racine du dépôt. Une exclusion qui fait tomber la matière de moitié n'est pas une
 * précision, c'est un aveuglement. La condition porte donc sur le VOISINAGE du chemin complet
 * dans le même document, jamais sur la forme du nom.
 */
export function estUnRaccourci(chemin, texteDuDocument = "") {
  const c = String(chemin);
  if (/[\\/]/.test(c)) return false;
  const echappe = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`[\\w.-]+[\\\\/]${echappe}`).test(String(texteDuDocument));
}

export const estHorsPortee = (chemin, texteDuDocument = "") =>
  HORS_PORTEE.some((re) => re.test(chemin)) || estUnRaccourci(chemin, texteDuDocument);

/**
 * UNE VUE GÉNÉRÉE N'EST PAS UNE PRESCRIPTION, C'EST UNE DÉRIVATION. Mesuré : `todo\RECIDIVES.md`
 * — ignoré par git depuis D-4 (a), régénéré à chaque écriture au registre — recopie les
 * prescriptions du référentiel des classes. Les juger ici les compterait deux fois et
 * attribuerait le défaut au dérivé au lieu de sa source. Le marqueur est celui que le dépôt écrit
 * lui-même en tête de ses vues, jamais une liste de noms à tenir à jour.
 *
 * LE MARQUEUR DOIT DIRE « CE DOCUMENT-CI EST GÉNÉRÉ », et rien de plus large. DEUX jets l'ont
 * montré, et une exclusion trop large est le plus dangereux des faux négatifs — elle rend
 * l'oracle vert EN SILENCE, et le silence ne se relit pas :
 *
 *   1. `NE PAS ÉDITER|jamais éditée` dans le motif : `references\TODO-FORGE.md` écarté, document
 *      rédigé à la main dont la ligne 7 dit d'une VUE VOISINE qu'elle n'est « jamais éditée » ;
 *   2. la formule cherchée dans les 1200 premiers octets : `TODO-FORGE.md` écarté de nouveau,
 *      cette fois sur sa ligne 5 — « vue générée `TODO.md` », qui nomme un AUTRE fichier.
 *
 * La marque est donc cherchée là où un générateur l'écrit : dans les TROIS PREMIÈRES LIGNES, ou
 * dans un commentaire HTML d'en-tête. `catalogues\CATALOGUES.md` la porte à sa ligne 1,
 * `todo\RECIDIVES.md` dans son commentaire de ligne 3 ; aucun document rédigé du dépôt ne la
 * porte là.
 *
 * ET LA GARDE DE DÉBUT DE MOT NE PEUT PAS ÊTRE `\b` — troisième jet, attrapé par la recette.
 * En expression régulière JavaScript, `\w` est ASCII : « é » n'est PAS un caractère de mot, donc
 * `\b` se déclenche À L'INTÉRIEUR de « régénéré », entre le « é » et le « g ». « Un README.md par
 * dossier, régénéré par hook » du noyau faisait donc écarter `CLAUDE.md` lui-même. La garde est
 * une antécédence négative qui compte les lettres accentuées, puisque le texte jugé est français.
 */
export const RE_VUE_GENEREE = /(?<![A-Za-zÀ-ÿ])(?:vue\s+g[ée]n[ée]r[ée]e?|g[ée]n[ée]r[ée]e?\s+par)(?![A-Za-zÀ-ÿ])/i;

export function estUneVueGeneree(texte) {
  const t = String(texte);
  const troisLignes = t.split(/\r?\n/).slice(0, 3).join("\n");
  if (RE_VUE_GENEREE.test(troisLignes)) return true;
  const commentaires = (t.slice(0, 1200).match(/<!--[\s\S]*?-->/g) || []).join("\n");
  return RE_VUE_GENEREE.test(commentaires);
}

/** La racine du parc : `--parc`, sinon `$FORGE_ROOT`, sinon le parent du dépôt jugé. */
export function racineDuParc(depot, argv = []) {
  const i = argv.indexOf("--parc");
  if (i >= 0 && argv[i + 1]) return resolve(argv[i + 1]);
  if (process.env.FORGE_ROOT) return resolve(process.env.FORGE_ROOT);
  return resolve(depot, "..");
}

/** Les dépôts frères du parc — la doctrine des chemins les nomme comme second candidat. */
export function depotsDuParc(racine) {
  if (!existsSync(racine)) return [];
  try {
    return readdirSync(racine)
      .filter((n) => !n.startsWith("_") && !SAUTES.has(n))
      .map((n) => join(racine, n))
      .filter((p) => { try { return statSync(p).isDirectory(); } catch { return false; } });
  } catch { return []; }
}

export function documents(d, out = []) {
  let noms = [];
  try { noms = readdirSync(d); } catch { return out; }
  for (const nom of noms) {
    if (SAUTES.has(nom)) continue;
    const p = join(d, nom);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) documents(p, out);
    else if (/\.md$/i.test(nom)) out.push(p);
  }
  return out;
}

/** Le numéro de ligne d'un décalage dans un texte — un constat sans ligne ne se répare pas. */
const ligneDe = (texte, index) => texte.slice(0, index).split(/\r?\n/).length;

/**
 * Les prescriptions d'un dépôt : `{ document, ligne, chemin, options, resolu }`.
 * `resolu` est le chemin absolu trouvé, ou `null`.
 */
export function prescriptions(depot, racineParc) {
  const freres = depotsDuParc(racineParc);
  const out = [];
  for (const doc of documents(depot)) {
    const texte = readFileSync(doc, "utf8");
    if (estUneVueGeneree(texte)) continue;
    for (const m of texte.matchAll(RE_PRESCRIPTION)) {
      const brut = m[1];
      const chemin = brut.replaceAll("\\", "/");
      const options = (m[2] || "").trim().split(/\s+/).filter((o) => o.startsWith("--"));
      const entree = { document: doc, ligne: ligneDe(texte, m.index), chemin: brut, options, resolu: null, horsPortee: estHorsPortee(brut, texte) };
      if (!entree.horsPortee) {
        const candidats = [
          resolve(dirname(doc), chemin),
          resolve(depot, chemin),
          ...freres.map((f) => resolve(f, chemin)),
          resolve(racineParc, chemin),
        ];
        entree.resolu = candidats.find((c) => existsSync(c) && (() => { try { return statSync(c).isFile(); } catch { return false; } })()) || null;
      }
      out.push(entree);
    }
  }
  return out;
}

export function juger(depot, { racineParc = null } = {}) {
  const racine = racineParc || racineDuParc(depot);
  const F = [];
  const ok = (regle, message, ou = "-") => F.push({ regle, statut: "PASS", ou, message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
  const rel = (p) => relative(depot, p).replaceAll("/", "\\") || p;

  const toutes = prescriptions(depot, racine);
  const jugeables = toutes.filter((p) => !p.horsPortee);
  if (!toutes.length) {
    return {
      verdict: "SANS_OBJET", findings: [{
        regle: "CP0", statut: "SANS_OBJET", ou: depot,
        message: "aucun document du dépôt ne prescrit de commande `node <script>` — il n'y a pas de prescription à juger",
      }], prescriptions: 0,
    };
  }

  // ── CP1 — la commande prescrite résout ──────────────────────────────────────────────────────
  const mortes = jugeables.filter((p) => !p.resolu);
  if (!mortes.length) {
    ok("CP1", `${jugeables.length} commande(s) prescrite(s) résolvent toutes — dans le dépôt ou dans un dépôt frère du parc (${racine})`);
  } else {
    ko("CP1", mortes.map((m) => `${rel(m.document)}:${m.ligne}`).join(", "),
      `${mortes.length} commande(s) prescrite(s) sur ${jugeables.length} ne résolvent NULLE PART — ni dans le dépôt, ni dans un dépôt frère du parc (${racine}) : `
      + mortes.map((m) => `${rel(m.document)}:${m.ligne} prescrit « ${m.chemin} »`).join(" ; ")
      + ". Un producteur qui joue cette commande obtient « module introuvable », pas un verdict. "
      + "Écrire le script, corriger le chemin, ou retirer la prescription — mais pas la laisser devant lui");
  }

  // ── CP2 — l'option prescrite est déclarée par le script ────────────────────────────────────
  const inconnues = [];
  const sources = new Map();
  const lire = (p) => { if (!sources.has(p)) { try { sources.set(p, readFileSync(p, "utf8")); } catch { sources.set(p, ""); } } return sources.get(p); };
  for (const p of jugeables) {
    if (!p.resolu || !p.options.length) continue;
    const src = lire(p.resolu);
    for (const o of p.options) if (!src.includes(o)) inconnues.push({ ...p, option: o });
  }
  const avecOptions = jugeables.filter((p) => p.resolu && p.options.length);
  const totalOptions = avecOptions.reduce((a, p) => a + p.options.length, 0);
  if (!inconnues.length) {
    ok("CP2", `${totalOptions} option(s) prescrite(s) sont toutes déclarées par le script qu'elles accompagnent`);
  } else {
    ko("CP2", inconnues.map((i) => `${rel(i.document)}:${i.ligne}`).join(", "),
      `${inconnues.length} option(s) prescrite(s) sur ${totalOptions} sont INCONNUES du script : `
      + inconnues.map((i) => `${rel(i.document)}:${i.ligne} prescrit ${i.option} à « ${i.chemin} », qui ne la déclare pas`).join(" ; ")
      + ". Le script échoue sur cette option, ou l'ignore en silence — et le silence est pire : le producteur croit avoir obéi");
  }

  // ── CP3 — l'option prescrite est jouée par le banc du script ───────────────────────────────
  const nonJouees = [];
  let avecBanc = 0;
  for (const p of avecOptions) {
    const banc = String(p.resolu).replace(/\.(mjs|cjs|js)$/i, ".test.mjs");
    if (!existsSync(banc)) continue;
    const src = lire(banc);
    for (const o of p.options) { avecBanc++; if (!src.includes(o)) nonJouees.push({ ...p, option: o, banc }); }
  }
  if (!avecBanc) {
    F.push({ regle: "CP3", statut: "SANS_OBJET", ou: "-",
      message: "aucune option prescrite n'accompagne un script qui porte un banc — CP3 n'a rien à mesurer ici, et ne le maquille pas en PASS" });
  } else if (!nonJouees.length) {
    ok("CP3", `${avecBanc} option(s) prescrite(s) sont jouées par le banc de leur script — la fixture du remède existe`);
  } else {
    ko("CP3", nonJouees.map((n) => `${rel(n.document)}:${n.ligne}`).join(", "),
      `${nonJouees.length} option(s) prescrite(s) sur ${avecBanc} ne sont JOUÉES PAR AUCUN CAS du banc de leur script : `
      + nonJouees.map((n) => `${rel(n.document)}:${n.ligne} prescrit ${n.option} ; ${rel(n.banc)} ne la joue pas`).join(" ; ")
      + ". La fixture du remède est aussi obligatoire que la fixture du défaut : une option prescrite que la recette "
      + "ne joue jamais n'a jamais été vue fonctionner, et le producteur est le premier à l'essayer (TF-1282)");
  }

  return {
    verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F,
    prescriptions: toutes.length, jugeables: jugeables.length, horsPortee: toutes.length - jugeables.length,
  };
}

export const NON_JUGE = [
  "la prescription en PROSE (« lancez le script de capture », « relancez l'oracle ») : seule la forme `node <script>` est reconnue, parce que deviner une prescription accuserait la doctrine qui décrit un défaut pour l'interdire — le faux positif le plus cher de tous",
  "les chemins de CONVENTION D'ACCUEIL (`forge\\…`, `.claude\\…`, `~\\…`) et les chemins sous PLACEHOLDER (`<racine>`, `$FORGE_ROOT`) sont écartés par construction : un gabarit prescrit un chemin qui n'a de sens que chez son hôte futur, et résoudre un paramètre serait l'inventer",
  "les documents de `output\\` et `input\\` : livrables et entrants datés, jamais des prescriptions. Un plan du 30/08 cite l'outillage du 30/08, et le corriger réécrirait l'histoire au lieu de cesser d'en produire (R-42)",
  "CP2 juge la PRÉSENCE du libellé de l'option dans la source du script, jamais que le script en fasse quelque chose de juste : une option lue et jetée passe CP2, et c'est le banc — donc CP3 — qui a une chance de l'attraper",
  "CP3 ne mesure QUE les scripts qui portent un banc nommé `<script>.test.mjs`. Un script sans banc n'est pas accusé ici : son juge est l'invariant I1 de `oracles\\self-tests.mjs`, et deux vérités sur le même objet valent moins qu'une",
  "CP3 constate qu'un CAS cite l'option, jamais qu'il la joue BIEN ni sur la cible que la prescription nomme. Le défaut fondateur — `--sections` qui rend TimeoutError sur un panneau MASQUÉ — demanderait d'exécuter le geste sur une instance servie : c'est la classe `controle-joue-sur-fichier-pas-sur-instance-servie`, un autre dispositif sur un autre objet. La borne est déclarée, pas comblée",
  "les options courtes (`-x`) et les arguments positionnels : hors du motif, faute d'une façon fiable de les distinguer d'un fragment de prose",
  "les RÉFÉRENTIELS de données (`.jsonl`, `.json`) qui portent eux aussi des points d'entrée : seuls les documents `.md` sont lus. La borne a un coût mesuré le 22/09, et il est écrit plutôt que tu — `catalogues\\catalogue.jsonl` annonce deux services en statut « prouvé » dont le point d'entrée a perdu un segment de chemin (`output\\composant-filtres-tableau\\…` au lieu de `output\\02-composants\\composant-filtres-tableau\\…`) : le défaut est exactement de cette classe, et cet oracle ne le voit pas. Consigné en candidature, pas absous",
];

// ---- CLI --------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const depot = resolve(args.find((a) => !a.startsWith("--")) || join(ICI, ".."));
  const iParc = args.indexOf("--parc");
  const racine = iParc >= 0 && args[iParc + 1] ? resolve(args[iParc + 1]) : racineDuParc(depot, args);
  const r = juger(depot, { racineParc: racine });
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-chemin-prescrit", version: "1.0.0",
      cible: depot, parc: racine, ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-chemin-prescrit — ${depot} (parc : ${racine})`);
    console.log(`verdict : ${r.verdict} (${r.jugeables ?? 0} prescription(s) jugée(s), ${r.horsPortee ?? 0} hors portée)`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
