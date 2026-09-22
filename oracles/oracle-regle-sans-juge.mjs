#!/usr/bin/env node
/**
 * oracle-regle-sans-juge.mjs — UNE RÈGLE ÉCRITE DANS UN TEXTE OPPOSABLE EST JOUÉE PAR QUELQUE
 * CHOSE D'EXÉCUTABLE, OU ELLE DÉCORE (classe `regle-ecrite-sans-oracle-qui-la-joue`).
 *
 * ============================================================================================
 * POURQUOI CETTE CLASSE A ATTENDU UN JUGE PLUS LONGTEMPS QUE TOUTE AUTRE
 * ============================================================================================
 *
 * Au 22/09/2026 elle porte 12 candidatures ouvertes — le plus gros paquet du registre — et son
 * champ `oracle` disait « a creer par cas ». « Par cas » est exactement ce qui l'a laissée sans
 * juge : tant que chaque règle attend SON oracle, aucune ne l'obtient, et le compteur monte. Ce
 * qui manquait n'était pas un oracle par règle, c'était un oracle sur la RELATION entre le corpus
 * opposable et le code — une relation qui, elle, se mesure d'un coup.
 *
 * La loi n° 1 du noyau dit « toute affordance est câblée ou n'existe pas ». Une règle est une
 * affordance de gouvernance : elle promet qu'un défaut sera nommé. Si rien ne la joue, elle tient
 * à la discipline de celui qui l'applique — c'est-à-dire à rien d'opposable — et le jour où elle
 * est enfreinte, rien ne le dit avant que le mal soit fait.
 *
 * ============================================================================================
 * CE QUI EST MESURÉ, ET CE QUE LA MESURE VAUT
 * ============================================================================================
 *
 *   RJ1 · toute règle DÉCLARÉE dans le corpus opposable est NOMMÉE par au moins un fichier
 *         exécutable du dépôt. C'est une borne basse, et elle est assumée : être nommé n'est pas
 *         être joué. Mais l'inverse est certain — une règle que AUCUN exécutable ne nomme n'est
 *         jouée par rien, et c'est précisément le défaut de la classe.
 *   RJ2 · toute règle NOMMÉE par un exécutable est DÉCLARÉE dans le corpus. Le défaut symétrique
 *         coûte autant : un contrôle qui accuse au nom de « R-99 » oppose au producteur une règle
 *         qu'il ne peut lire nulle part, donc ni contester ni appliquer par avance.
 *   RJ3 · un numéro de règle désigne UNE règle. Deux déclarations portant le même numéro et deux
 *         titres différents rendent toute citation ambiguë : le lecteur d'un verdict « R-52 » ne
 *         sait pas laquelle des deux on lui oppose.
 *
 * L'EXEMPTION EST DÉCLARÉE, JAMAIS DEVINÉE. Une règle dont le texte dit lui-même qu'elle n'est pas
 * mécanisable — « geste humain », « décision humaine », « non mécanisable » — sort de RJ1 en étant
 * NOMMÉE au verdict, pas en disparaissant. Deviner qu'une règle « n'a pas de condition
 * vérifiable » reviendrait à écrire l'exemption à la place de son auteur.
 *
 * Usage :
 *   node oracles\oracle-regle-sans-juge.mjs [<depot>] [--json]
 *   node oracles\oracle-regle-sans-juge.test.mjs         (recette a double sens, 14 cas)
 *   exit 0 PASS · exit 1 FAIL · exit 2 SANS OBJET — « je ne peux pas mesurer » a son code a lui,
 *   sans quoi une panne d'environnement se lit comme un defaut de l'artefact juge (TF-0648).
 */
import { readFileSync, readdirSync, existsSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

/** Les textes OPPOSABLES du pilot : ceux qu'un producteur peut se voir opposer. */
export const CORPUS_OPPOSABLE = ["REGLES-PROJET.md", "CLAUDE.md"];

/** Les répertoires où vit ce qui EXÉCUTE. Un document ne joue pas une règle : il la répète. */
export const REPERTOIRES_EXECUTABLES = ["oracles", "todo", "scripts"];
export const FICHIERS_EXECUTABLES = ["bootstrap.mjs"];

/**
 * Une règle qui déclare elle-même son impossibilité de mécanisation sort de RJ1, en étant nommée.
 *
 * LE MOTIF ÉTAIT TROP LARGE, et son banc l'a montré le 22/09/2026 : il reconnaissait « décision
 * humaine » et « geste humain ». Or ces mots disent QUI TRANCHE, jamais si la règle est
 * mécanisable — presque toute section de ce corpus les porte, ne serait-ce qu'en citant la
 * décision qui l'a fondée. Une règle entière pouvait donc s'exempter par la seule mention de son
 * origine. Le motif exige désormais une déclaration portant sur LE CONTRÔLE lui-même.
 */
export const RE_NON_MECANISABLE = /contr[ôo]le\s+ex[ée]cutable\s*:?\s*aucun|n[e']?\s*(?:est|sont)\s+pas\s+m[ée]canisables?|(?:^|[^a-z])(?:pas|non)\s+m[ée]canisables?\b|non\s+m[ée]canis[ée]e?s?\b/i;

/**
 * Les trois formes sous lesquelles une règle se DÉCLARE dans ce corpus, relevées sur le texte réel :
 * la prose numérotée, le titre de section, et la ligne de tableau des règles 1 à 27.
 */
export function declarations(texte, nomDuDocument) {
  const trouvees = [];
  const lignes = String(texte).split(/\r?\n/);
  lignes.forEach((l, i) => {
    let m;
    if ((m = l.match(/^\*\*(R-\d+)(?:\s*bis)?\.\*\*\s*(.{0,80})/))) trouvees.push({ cle: m[1], doc: nomDuDocument, ligne: i + 1, forme: "prose", titre: m[2].trim() });
    else if ((m = l.match(/^#+\s*(?:[A-Z]+\.\s*)?(R-\d+)\s*[—–-]\s*(.{0,80})/))) trouvees.push({ cle: m[1], doc: nomDuDocument, ligne: i + 1, forme: "titre", titre: m[2].trim() });
    else if ((m = l.match(/^\|\s*(\d{1,2})\s*\|\s*(.{0,80})/))) trouvees.push({ cle: `R-${Number(m[1])}`, doc: nomDuDocument, ligne: i + 1, forme: "tableau", titre: m[2].trim() });
  });
  return trouvees;
}

/**
 * LA SECTION d'une déclaration : de sa ligne jusqu'au prochain titre ou à la prochaine règle en
 * prose. C'est là que se lit une exemption écrite.
 *
 * LA BORNE ÉTAIT À 12 LIGNES, ET ELLE A COÛTÉ UN FAUX POSITIF LE MÊME JOUR. La décision humaine
 * D-19 (b) du 22/09/2026 a fait écrire, dans le texte de la règle de l'écart déclaré, le motif
 * pour lequel elle n'est pas mécanisable. Le motif a été écrit à sa place NATURELLE — en fin de
 * section, après les deux volets de la règle — et l'oracle ne l'a pas vu : il s'arrêtait 12 lignes
 * après le titre. Il accusait donc une règle dont l'exemption était écrite noir sur blanc, ce qui
 * est la pire forme du faux positif : elle punit exactement le remède qu'elle recommande.
 *
 * Le plafond de 400 lignes n'est pas une borne de sens, c'est une garde contre un document sans
 * titres, où la « section » avalerait tout le fichier.
 */
export function paragraphe(texte, ligne) {
  const lignes = String(texte).split(/\r?\n/);
  const debut = ligne - 1;
  let fin = debut + 1;
  while (fin < lignes.length && fin - debut < 400) {
    if (/^#+\s/.test(lignes[fin]) || /^\*\*R-\d+(?:\s*bis)?\.\*\*/.test(lignes[fin])) break;
    fin += 1;
  }
  return lignes.slice(debut, fin).join("\n");
}

/**
 * RJ3 — DEUX DÉCLARATIONS NE SE COLLISIONNENT QUE SI TOUTES DEUX PORTENT UN TITRE. Mesuré sur le
 * texte réel : R-55 s'écrit en un titre de section suivi, huit lignes plus bas, de sa prose
 * numérotée dont la ligne de titre est vide — une seule règle, écrite en deux temps. R-52, lui,
 * porte deux titres pleins et différents à 178 lignes d'écart : là, le numéro désigne deux règles.
 */
export function collisions(toutes) {
  const par = new Map();
  for (const d of toutes) {
    if (d.forme === "tableau" || !d.titre) continue;
    if (!par.has(d.cle)) par.set(d.cle, []);
    par.get(d.cle).push(d);
  }
  return [...par.entries()].filter(([, v]) => {
    const titres = new Set(v.map((x) => x.titre.toLowerCase().slice(0, 40)));
    return v.length > 1 && titres.size > 1;
  });
}

export function fichiersExecutables(depot) {
  const trouves = [];
  const marcher = (d) => {
    let entrees;
    try { entrees = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entrees) {
      const p = join(d, e.name);
      if (e.isDirectory()) { if (!/^(node_modules|\.git|output|input|old)$/.test(e.name)) marcher(p); }
      else if (/\.(mjs|cjs|js)$/.test(e.name)) trouves.push(p);
    }
  };
  for (const r of REPERTOIRES_EXECUTABLES) marcher(join(depot, r));
  for (const f of FICHIERS_EXECUTABLES) { const p = join(depot, f); if (existsSync(p)) trouves.push(p); }
  return trouves;
}

export function juger(depot) {
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });
  const rel = (p) => relative(depot, p) || p;

  const docs = CORPUS_OPPOSABLE.map((d) => ({ nom: d, chemin: join(depot, d) })).filter((d) => existsSync(d.chemin));
  if (!docs.length) {
    return { verdict: "SANS_OBJET", findings: [{ regle: "RJ0", statut: "SKIP", message: `aucun texte opposable trouvé dans ${depot} — cet oracle juge le pilot, pas n'importe quel dépôt` }], declarees: 0, citees: 0 };
  }

  const textes = new Map(docs.map((d) => [d.nom, readFileSync(d.chemin, "utf8")]));
  const toutes = docs.flatMap((d) => declarations(textes.get(d.nom), d.nom));
  const parCle = new Map();
  for (const d of toutes) { if (!parCle.has(d.cle)) parCle.set(d.cle, []); parCle.get(d.cle).push(d); }

  // RJ2 ne moissonne PAS les fichiers de recette, et la calibration a été mesurée sur cet oracle
  // lui-même : ses fixtures inventent deux numéros de règle inexistants pour éprouver RJ2, et
  // RJ2 les accusait comme des règles introuvables. Une fixture n'accuse personne ; elle éprouve.
  // RJ1, lui, garde les recettes : une règle nommée par un banc est bien nommée par un exécutable.
  const sources = fichiersExecutables(depot);
  const estUneRecette = (f) => /\.test\.mjs$/i.test(f) || /[\\/]fixtures[\\/]/i.test(f);
  const citees = new Map();          // RJ1 : nommée par QUOI QUE CE SOIT d'exécutable, recettes comprises
  const accusations = new Map();     // RJ2 : nommée par du code qui ACCUSE, recettes exclues
  for (const f of sources) {
    let t = "";
    try { t = readFileSync(f, "utf8"); } catch { continue; }
    for (const m of t.matchAll(/\bR-(\d{1,3})(?![0-9])/g)) {
      const cle = `R-${Number(m[1])}`;
      if (!citees.has(cle)) citees.set(cle, []);
      if (!citees.get(cle).includes(f)) citees.get(cle).push(f);
      if (estUneRecette(f)) continue;
      if (!accusations.has(cle)) accusations.set(cle, []);
      if (!accusations.get(cle).includes(f)) accusations.get(cle).push(f);
    }
  }

  // ---- RJ1 : declaree, jouee par rien ---------------------------------------------------------
  const nonCitees = [...parCle.keys()].filter((c) => !citees.has(c));
  const exemptees = [], muettes = [];
  for (const cle of nonCitees) {
    const d = parCle.get(cle)[0];
    const para = paragraphe(textes.get(d.doc), d.ligne);
    (RE_NON_MECANISABLE.test(para) ? exemptees : muettes).push({ cle, d });
  }
  if (muettes.length) {
    ko("RJ1", muettes.map((m) => `${m.d.doc}:${m.d.ligne}`).join(", "),
      `${muettes.length} règle(s) déclarée(s) que AUCUN fichier exécutable ne nomme : `
      + muettes.map((m) => `${m.cle} (${m.d.doc}:${m.d.ligne})`).join(", ")
      + `. Une règle que rien ne joue tient à la discipline de celui qui l'applique, c'est-à-dire à rien `
      + `d'opposable. Deux issues, et une seule est un remède : écrire le contrôle qui la joue, ou écrire `
      + `dans son texte qu'elle n'est pas mécanisable — cet oracle lit cette mention et l'exempte en la nommant`);
  } else {
    ok("RJ1", `${parCle.size - exemptees.length} règle(s) déclarée(s) sont nommées par au moins un exécutable`
      + (exemptees.length ? ` ; ${exemptees.length} exemptée(s) parce que leur propre texte les dit non mécanisables : ${exemptees.map((e) => e.cle).join(", ")}` : ""));
  }

  // ---- RJ2 : jouee, declaree nulle part -------------------------------------------------------
  const orphelines = [...accusations.keys()].filter((c) => !parCle.has(c));
  if (orphelines.length) {
    ko("RJ2", orphelines.map((c) => rel(accusations.get(c)[0])).join(", "),
      `${orphelines.length} règle(s) nommée(s) par un exécutable et déclarée(s) dans AUCUN texte opposable : `
      + orphelines.map((c) => `${c} (${accusations.get(c).length} fichier(s), dont ${rel(accusations.get(c)[0])})`).join(", ")
      + `. Un contrôle qui accuse au nom d'un numéro introuvable oppose au producteur une règle qu'il ne peut `
      + `ni lire, ni contester, ni appliquer par avance`);
  } else {
    ok("RJ2", `${accusations.size} règle(s) nommée(s) par un exécutable qui accuse sont toutes déclarées au corpus opposable`);
  }

  // ---- RJ3 : un numero, deux regles -----------------------------------------------------------
  const doubles = collisions(toutes);
  if (doubles.length) {
    ko("RJ3", doubles.map(([, v]) => `${v[0].doc}:${v[0].ligne}`).join(", "),
      `${doubles.length} numéro(s) de règle désignant DEUX règles différentes : `
      + doubles.map(([c, v]) => `${c} — ${v.map((x) => `${x.doc}:${x.ligne} « ${x.titre.slice(0, 50)} »`).join(" et ")}`).join(" ; ")
      + `. Le lecteur d'un verdict qui cite ce numéro ne sait pas laquelle des deux on lui oppose`);
  } else {
    ok("RJ3", `${parCle.size} numéro(s) de règle désignent chacun une seule règle`);
  }

  return {
    verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F,
    declarees: parCle.size, citees: citees.size, exemptees: exemptees.length, sources: sources.length,
  };
}

export const NON_JUGE = [
  "la JUSTESSE du contrôle qui nomme une règle : RJ1 mesure une CITATION, pas une exécution. Un oracle qui écrit « R-38 » dans un commentaire et ne joue rien passe RJ1. La borne est basse et assumée — elle est choisie parce que son contraire est certain : une règle que personne ne nomme n'est jouée par personne",
  "les règles écrites dans les GABARITS et les références (`gabarits\\`, `references\\`) : le corpus jugé s'arrête aux deux textes que le noyau désigne comme opposables. Une règle de gabarit non jouée est le même défaut et cet oracle ne la voit pas — la borne est déclarée, pas comblée",
  "les règles des FORGES et des produits : un dépôt frère a ses propres textes et son propre outillage, et R-43 dit que ses règles priment chez lui. Les juger d'ici inventerait une hiérarchie que la doctrine ne pose pas",
  "la CONDITION d'une règle : l'oracle ne lit pas si une règle pose une condition vérifiable, il constate qu'on la nomme ou non. Deviner qu'une règle « n'a rien à jouer » reviendrait à écrire son exemption à sa place — c'est pourquoi l'exemption doit être ÉCRITE dans le texte de la règle",
  "les règles citées dans un COMMENTAIRE de code par simple renvoi historique (« patron R-42 ») : elles comptent comme citation, faute d'un moyen fiable de distinguer un renvoi d'un contrôle sans lire l'intention de l'auteur",
];

// La recette de cet oracle vit dans `oracles\oracle-regle-sans-juge.test.mjs`, et c'est une
// MESURE, pas un goût : ses fixtures inventent des numéros de règle pour éprouver RJ2, et tant
// qu'elles vivaient ici, RJ2 les lisait comme des accusations au nom de règles introuvables —
// l'oracle se dénonçait lui-même, 2 faux positifs sur 5 constats le 22/09/2026. Inscrit à la
// table DEDIES de `oracles\self-tests.mjs`, il est donc couvert par I1 comme par I2.

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const depot = resolve(args.find((a) => !a.startsWith("--")) || join(ICI, ".."));
  const r = juger(depot);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-regle-sans-juge", version: "1.0.0", cible: depot, ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-regle-sans-juge — ${depot}`);
    console.log(`verdict : ${r.verdict} (${r.declarees ?? 0} règle(s) déclarée(s), ${r.citees ?? 0} nommée(s) par un exécutable, ${r.sources ?? 0} fichier(s) lus)`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
