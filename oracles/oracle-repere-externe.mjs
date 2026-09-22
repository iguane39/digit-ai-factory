#!/usr/bin/env node
/**
 * oracle-repere-externe.mjs — UNE FAMILLE DE LIVRABLES SANS REPÈRE EXTERNE SE DÉCLARE, ELLE NE
 * S'OUBLIE PAS.
 *
 * ============================================================================================
 * LE FAIT PAYÉ, ET POURQUOI AUCUN CONTRÔLE DE FORME NE L'ATTRAPE
 * ============================================================================================
 *
 * Les contrôles d'un livrable jugent sa FORME et sa TRAÇABILITÉ : le gabarit est tenu, les
 * sources sont citées, les règles de socle passent. Aucun ne juge son NIVEAU — « est-ce bon
 * comparé à ce qui se fait ailleurs ? ». C'est le rôle d'un REPÈRE EXTERNE, une référence
 * atteignable à laquelle on se compare, tenue au registre `la-barre`.
 *
 * LE PRÉCÉDENT EST MESURÉ : une direction artistique VERTE À TOUS SES CONTRÔLES a été rejetée en
 * bloc, faute d'un repère extérieur auquel la situer. Et au 22/09/2026, le registre ne porte
 * AUCUNE entrée pour un livrable de communication — les mots « propale », « communication » et
 * « marketing » y rendent zéro.
 *
 * CE QUI REND CE DÉFAUT INVISIBLE, et c'est ce que cet oracle corrige : une famille SANS repère
 * est indiscernable d'une famille qu'on a décidé de ne pas couvrir. Il n'y a pas de trace de la
 * décision, donc pas de rouge, donc personne ne revient dessus. Une machine ne peut pas décider
 * quelle famille MÉRITE un repère — cela dépend de l'enjeu et du lecteur. Elle peut, et doit,
 * exiger que la liste de ce qui n'est pas couvert soit ÉCRITE.
 *
 * ============================================================================================
 * CE QUI EST MESURÉ
 * ============================================================================================
 *
 *   BR1 · une entrée déclarée `ok` porte une RÉFÉRENCE RÉELLE et sa validation — un test
 *         d'existence daté en PASS, ou une validation humaine datée, ce que le registre exige
 *         lui-même en 4 points. Une entrée `ok` qui porte encore « à renseigner » sert une barre
 *         que personne ne peut ouvrir.
 *   BR2 · une entrée qui porte un RÉSERVOIR — « à renseigner », un gabarit entre chevrons — est
 *         en `todo`, jamais en `ok`. C'est la règle d'entrée du registre, et elle n'était jouée
 *         par rien.
 *   BR3 · le registre PUBLIE ce qu'il ne couvre pas : une section nommant les familles de
 *         livrables sans repère, et pourquoi. Sans elle, une famille sans repère est
 *         indiscernable d'un oubli — et c'est exactement ce qui est arrivé aux livrables de
 *         communication.
 *
 * Recette à double sens : `oracles\oracle-repere-externe.test.mjs`.
 *
 * Usage : node oracles\oracle-repere-externe.mjs [<racine du parc>] [--json]
 *   exit 0 PASS · exit 1 FAIL · exit 2 SANS OBJET — « je ne peux pas mesurer » a son code a lui,
 *   sans quoi une panne d'environnement se lit comme un defaut de l'artefact juge (TF-0648).
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

/** Le registre des repères, chez la forge d'outils. */
export const CHEMIN_REGISTRE = join(
  "digit-ai-forge-agents", ".claude", "skills", "la-barre", "references", "registre-barres.md",
);

/**
 * Un réservoir : ce qui reste à remplir. Il se lit sur la VALEUR d'un champ, jamais n'importe où
 * dans l'entrée — calibration mesurée le 22/09/2026 : un repère complet portait dans sa
 * justification l'exemple de prompt « Utilise <URL> pour… », et les chevrons de cette CITATION le
 * faisaient accuser d'être vide. Un réservoir ouvre la valeur d'un champ ; une citation vit au
 * milieu d'une phrase.
 */
export const RE_RESERVOIR_VALEUR = /^(?:à renseigner|à décomposer|—|<[^>\n]{3,}>)/i;

/** Les champs dont la valeur DOIT être remplie pour qu'un repère soit servi. */
export const CHAMPS_A_REMPLIR = ["reference", "localisateur", "test_existence", "dernier_test", "niveaux", "frontiere", "justification"];

/** Les champs d'une entrée dont la valeur est encore un réservoir. */
export function reservoirsDe(texteDeLEntree) {
  const trouves = [];
  for (const ligne of String(texteDeLEntree).split(/\r?\n/)) {
    const m = ligne.match(/^\s{1,4}([a-z_]+):\s*(.*)$/i);
    if (!m) continue;
    const [, champ, valeur] = m;
    if (!CHAMPS_A_REMPLIR.includes(champ.toLowerCase())) continue;
    if (RE_RESERVOIR_VALEUR.test(valeur.trim())) trouves.push(champ);
  }
  return trouves;
}

/** Une validation : un test d'existence daté en PASS, ou une validation humaine datée. */
export const RE_VALIDATION = /\b\d{4}-\d{2}-\d{2}\b[^\n]{0,40}\bPASS\b|valid[ée]e?\s+humain[^\n]{0,30}\d{2}\/\d{2}\/\d{4}/i;

/** La section qui publie ce que le registre NE couvre pas. */
export const RE_SECTION_COUVERTURE = /^#{2,4}\s*(?:couverture|familles?\s+(?:non\s+)?couvertes?|ce\s+que\s+ce\s+registre\s+ne\s+couvre\s+pas)/im;

/**
 * Les entrées du registre : les blocs qui ouvrent par `- cible:` APRÈS la section des entrées.
 * Le gabarit d'une entrée, sous la section de format, n'est pas une entrée — l'inclure ferait
 * accuser le registre de porter un réservoir dans son propre mode d'emploi.
 */
export function entreesDuRegistre(texte) {
  const lignes = String(texte).split(/\r?\n/);
  const debut = lignes.findIndex((l) => /^#{2,4}\s*Entrées\s*$/i.test(l.trim()));
  if (debut < 0) return [];
  const entrees = [];
  let courante = null;
  for (let i = debut + 1; i < lignes.length; i += 1) {
    const l = lignes[i];
    if (/^-\s+cible:/.test(l)) {
      if (courante) entrees.push(courante);
      courante = { ligne: i + 1, cible: l.replace(/^-\s+cible:\s*/, "").trim(), corps: [] };
      continue;
    }
    if (!courante) continue;
    if (/^#{1,4}\s/.test(l)) { entrees.push(courante); courante = null; continue; }
    courante.corps.push(l);
  }
  if (courante) entrees.push(courante);
  return entrees.map((e) => ({ ...e, texte: e.corps.join("\n") }));
}

export const statutDe = (entree) => {
  const m = String(entree.texte).match(/^\s*statut:\s*(\S+)/m);
  return m ? m[1].toLowerCase() : "";
};

export function juger(racineDuParc) {
  const F = [];
  const ok = (regle, message) => F.push({ regle, statut: "PASS", message });
  const ko = (regle, ou, message) => F.push({ regle, statut: "FAIL", ou, message });

  const chemin = join(racineDuParc, CHEMIN_REGISTRE);
  if (!existsSync(chemin)) {
    return {
      verdict: "SANS_OBJET", entrees: 0,
      findings: [{ regle: "BR0", statut: "SKIP", message: `registre des repères introuvable sous ${racineDuParc} — ce poste ne porte pas la forge d'outils, rien à mesurer ici` }],
    };
  }

  const texte = readFileSync(chemin, "utf8");
  const entrees = entreesDuRegistre(texte);
  if (!entrees.length) {
    return {
      verdict: "SANS_OBJET", entrees: 0,
      findings: [{ regle: "BR0", statut: "SKIP", message: "le registre ne porte aucune entrée sous sa section des entrées — rien à juger" }],
    };
  }

  const okSansPreuve = [], reservoirsEnOk = [];
  for (const e of entrees) {
    const statut = statutDe(e);
    const reservoirs = reservoirsDe(e.texte);
    if (statut.startsWith("ok")) {
      if (!RE_VALIDATION.test(e.texte)) okSansPreuve.push(e);
      if (reservoirs.length) reservoirsEnOk.push({ ...e, champs: reservoirs });
    }
  }

  // ---- BR1 -------------------------------------------------------------------------------------
  if (okSansPreuve.length) {
    ko("BR1", okSansPreuve.map((e) => `${CHEMIN_REGISTRE}:${e.ligne}`).join(", "),
      `${okSansPreuve.length} repère(s) déclaré(s) « ok » sans preuve de validation : `
      + okSansPreuve.map((e) => `« ${e.cible.slice(0, 60)} » (ligne ${e.ligne})`).join(" ; ")
      + ". Le registre exige 4 points avant un « ok », dont un test d'existence en PASS et une "
      + "validation humaine ; un « ok » sans l'un des deux sert une barre que personne n'a vérifiée");
  } else {
    ok("BR1", `les ${entrees.filter((e) => statutDe(e).startsWith("ok")).length} repère(s) « ok » portent chacun leur validation datée`);
  }

  // ---- BR2 -------------------------------------------------------------------------------------
  if (reservoirsEnOk.length) {
    ko("BR2", reservoirsEnOk.map((e) => `${CHEMIN_REGISTRE}:${e.ligne}`).join(", "),
      `${reservoirsEnOk.length} repère(s) « ok » portent encore un réservoir à remplir : `
      + reservoirsEnOk.map((e) => `« ${e.cible.slice(0, 50)} » (ligne ${e.ligne}, champ(s) ${e.champs.join(", ")})`).join(" ; ")
      + ". La règle d'entrée du registre dit que tant qu'un des 4 points manque, le statut reste "
      + "« todo » — un « ok » qui porte « à renseigner » fait servir au pas 1 une barre inouvrable");
  } else {
    ok("BR2", "aucun repère « ok » ne porte de réservoir : ce qui est servi est ouvrable");
  }

  // ---- BR3 -------------------------------------------------------------------------------------
  if (!RE_SECTION_COUVERTURE.test(texte)) {
    ko("BR3", CHEMIN_REGISTRE,
      "le registre ne PUBLIE PAS ce qu'il ne couvre pas : aucune section ne nomme les familles de "
      + "livrables sans repère externe, ni pourquoi. Une famille sans repère devient alors "
      + "indiscernable d'un oubli — mesuré le 22/09/2026 : les livrables de communication n'ont "
      + "aucune entrée, les mots « propale », « communication » et « marketing » rendent zéro, et "
      + "rien nulle part ne dit si c'est un choix. Une machine ne peut pas décider quelle famille "
      + "MÉRITE un repère ; elle peut exiger que la liste des non-couvertes soit écrite");
  } else {
    ok("BR3", "le registre publie la liste des familles qu'il ne couvre pas — une absence déclarée n'est plus un oubli");
  }

  return {
    verdict: F.some((f) => f.statut === "FAIL") ? "FAIL" : "PASS", findings: F,
    entrees: entrees.length, ok: entrees.filter((e) => statutDe(e).startsWith("ok")).length,
  };
}

export const NON_JUGE = [
  "QUELLE FAMILLE MÉRITE UN REPÈRE : cela dépend de l'enjeu du livrable et de son lecteur, et aucune lecture de fichier n'y répond. BR3 exige que la liste des familles NON couvertes soit écrite, jamais qu'une famille donnée en ait une. C'est la borne principale de cet oracle, et elle est choisie : une machine qui déciderait à la place de l'humain quelles familles doivent se comparer à l'extérieur produirait des rouges que personne ne pourrait fermer",
  "la LÉGITIMITÉ et la PERTINENCE d'une référence : le registre a son propre contrôle pour l'existence — `test_existence.py`, qui déclare lui-même ne juger ni l'une ni l'autre —, et le filtre de légitimité reste un pas humain du protocole",
  "la FRAÎCHEUR d'un repère : BR1 constate qu'une validation est datée, jamais qu'elle soit récente. Une référence peut mourir — page retirée, site refondu — et le registre prescrit de rejouer le test d'existence avant réutilisation ; cet oracle ne le rejoue pas",
  "les repères tenus AILLEURS que dans ce registre : un produit qui garderait ses propres références n'est pas vu ici, et la source unique est justement ce que le registre existe pour être",
  "le CONTENU d'un niveau décomposé — structure, jetons, composants, comportement : l'oracle lit leur présence quand un repère est « ok », jamais leur justesse",
];

// ---- CLI ---------------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && fileURLToPath(import.meta.url).toLowerCase().replaceAll("\\", "/")
     === process.argv[1].toLowerCase().replaceAll("\\", "/");
if (lanceEnDirect) {
  const racine = resolve(args.find((a) => !a.startsWith("--")) || process.env.FORGE_ROOT || join(ICI, "..", ".."));
  const r = juger(racine);
  if (args.includes("--json")) {
    console.log(JSON.stringify({ oracle: "oracle-repere-externe", version: "1.0.0", parc: racine, ...r, non_juge: NON_JUGE }, null, 1));
  } else {
    console.log(`oracle-repere-externe — ${racine}`);
    console.log(`verdict : ${r.verdict} (${r.entrees ?? 0} repère(s) au registre, dont ${r.ok ?? 0} en « ok »)`);
    for (const f of r.findings) console.log(`  [${f.statut}] ${f.regle} — ${f.message}`);
  }
  process.exit(r.verdict === "FAIL" ? 1 : r.verdict === "SANS_OBJET" ? 2 : 0);
}
