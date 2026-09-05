#!/usr/bin/env node
/**
 * oracle-travaux-pilot.mjs — juge la FORME d'un lot de travaux confiés par le pilot à un produit.
 *
 * ============================================================================================
 * POURQUOI CE FICHIER EXISTE (TF-0627, 25/08/2026)
 * ============================================================================================
 *
 * LE CONSTAT QUI L'A FAIT NAÎTRE, et il vient d'une question humaine : « les produits n'ont pas
 * une TODO List dans laquelle on pourrait leur fournir les travaux à réaliser ? » La réponse
 * mesurée est OUI pour le carnet — `docs\projet\TODO-PRODUIT.md`, porté par cinq produits sur
 * sept, trois mis à jour le jour même — et NON pour le chemin : le pilot n'avait AUCUN écrivain
 * vers lui. Tout ce qu'il possédait autour était en lecture (la projection HTML) ou en contrôle
 * (R-20). *Le flux était à sens unique* : le canal produit → pilot est complet et outillé (lot de
 * retours, sidecar, rejet atomique, dérogation tracée), le canal pilot → produit n'existait pas.
 *
 * CE QUE LA LACUNE COÛTAIT, mesuré : le relevé du 25/08 rend 38 artefacts d'héritage absents chez
 * sept produits, dont le gabarit de restitution et son hook chez cinq. AUCUN des sept ne le
 * savait, parce qu'aucune voie ne permettait de le lui dire. *Un état mesuré qui n'atteint pas son
 * destinataire ne devient pas un travail fait.*
 *
 * LE CANAL EST SYMÉTRIQUE, ET C'EST LA CONDITION DE SON ACCEPTABILITÉ. Le pilot dépose un lot
 * dans la BOÎTE D'ENTRÉE du produit (`input\00-travaux\`) — pas dans son carnet, pas dans son
 * code. Le produit l'ingère lui-même, décide ce qu'il retient, et écarte le reste avec son motif.
 * La règle « seuls les produits se modifient eux-mêmes » est donc tenue à la lettre : le pilot
 * n'écrit rien que le produit n'ait choisi.
 *
 * IL NAÎT AVEC SON JUGE DES DEUX CÔTÉS, plutôt que de re-payer la leçon du canal inverse. Là-bas,
 * la forme était écrite en PROSE chez l'émetteur et jugée en CODE chez le destinataire : six lots
 * en une journée ont dû passer par dérogation. Ce module est la SOURCE unique des deux côtés — le
 * pilot l'importe avant d'émettre, le produit en reçoit une copie conforme par l'héritage.
 *
 * ============================================================================================
 * CE QUI EST JUGÉ, ET CE QUI NE L'EST PAS
 * ============================================================================================
 *
 * T1 · chaque élément confié porte son **moyen de vérification** — la commande à rejouer ou le
 *      fait à constater. *Un travail confié sans le moyen de constater qu'il est fait est une
 *      intention, pas un travail* : c'est l'exigence que le pilot s'impose à lui-même à la
 *      clôture de ses items (`gains_constates`), et il n'y a aucune raison qu'elle s'allège
 *      quand il confie plutôt qu'il fait.
 * T2 · chaque élément cite l'item du registre dont il vient (`TF-xxxx`). Sans cela, le produit ne
 *      peut pas retrouver le raisonnement, et le pilot ne sait plus ce qu'il a confié à qui.
 * T3 · le lot porte la section **« Ce que le pilot a déjà fait de son côté »**, ou déclare qu'il
 *      n'y a rien. Sans elle, le produit ne peut pas savoir si le travail confié est le reste d'un
 *      problème traité ou le problème entier. C'est le symétrique exact de R-45.
 * T4 · le lot porte la section **« Ce que le pilot NE demande PAS »**, ou déclare qu'il n'y a
 *      rien. C'est ce qui distingue un lot BORNÉ d'une liste de souhaits : sans borne déclarée,
 *      un produit ne sait pas si le silence sur un sujet vaut accord ou oubli (loi n° 3).
 * T5 · l'ordre recommandé est **justifié**. Une liste non ordonnée se lit dans l'ordre où elle a
 *      été écrite, pas dans celui qui sert — même règle que S6 sur les restitutions.
 * T6 · tout MODULE PRODUCTEUR nommé a été LU (TF-0819, 05/09/2026). Quand « ce qui est demandé »
 *      dit qu'un artefact est « transcrit / produit / écrit / dérivé / généré / porté par
 *      `<module>` », le lot porte une ligne « **Module producteur lu** : `<module>` … » qui cite
 *      la source lue (un chemin, un SKILL.md, un en-tête). Le fait payé : le lot 20260905b
 *      attribuait à `derive-les-vues` l'écriture d'un champ que ce verbe ne produit jamais ; la
 *      forge a dû répartir le travail elle-même, et l'écart n'avait aucune classe où entrer.
 *      *Nommer un producteur sans l'avoir lu, c'est confier une tâche à quelqu'un qui n'existe
 *      pas.* T6 exige la lecture DÉCLARÉE, pas sa justesse (même borne que T1).
 *
 * NON JUGÉ, et c'est délibéré :
 *   · la JUSTESSE de ce qui est demandé — un contrôle de forme ne juge pas un fond, et un
 *     raisonnement écrit peut être faux et se corriger ; un raisonnement absent est perdu ;
 *   · si le produit ACCEPTE le travail : ce n'est pas au juge de forme d'en décider, et c'est
 *     précisément ce que le canal laisse au produit ;
 *   · la VÉRACITÉ d'un moyen de vérification : T1 exige qu'il soit écrit, pas qu'il soit exact.
 *     Vérifier cela demanderait de jouer la commande chez le produit, ce que le pilot ne fait pas.
 *
 * Usage : node oracle-travaux-pilot.mjs <lot.md> [--json]
 * Exit : 0 = forme tenue · 1 = forme en défaut · 2 = lot illisible.
 */
import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";

export const VERSION = "1.1.0";

const SECTION_TRAVAUX = /^##\s+Travaux\s+confi[ée]s\s*$/im;
const SECTION_DEJA_FAIT = /^##\s+Ce\s+que\s+le\s+pilot\s+a\s+d[ée]j[àa]\s+fait\s+de\s+son\s+c[ôo]t[ée]\s*$/im;
const SECTION_PAS_DEMANDE = /^##\s+Ce\s+que\s+le\s+pilot\s+NE\s+demande\s+PAS\s*$/im;
const SECTION_ORDRE = /^##\s+Ordre\s+recommand[ée]\s*$/im;

//: Un élément confié : un sous-titre `### TF-xxxx — …`. C'est le seul découpage du lot.
const ELEMENT = /^###\s+(TF-\d{3,4})\b([^\n]*)$/gim;
//: Le moyen de vérification, sous l'une des deux formes que le gabarit propose.
const VERIFICATION = /comment\s+vous\s+saurez\s+que\s+c['’]est\s+fait|moyen\s+de\s+v[ée]rification/i;
//: Le vocabulaire d'une justification d'ordre — le même que S6 des restitutions.
const ORDRE_JUSTIFIE = /(parce\s+qu|car\b|d['’]abord|priorit|impact|risque|d[ée]pendance|levier)/i;
//: Les déclarations d'absence : une section vide se DIT, elle ne se devine pas (loi n° 3).
const AUCUN_DEJA_FAIT = /rien\s+n['’]a\s+[ée]t[ée]\s+corrig[ée]\s+au\s+pilot|aucun\s+travail\s+pr[ée]alable/i;
const AUCUNE_BORNE = /aucune\s+borne|rien\s+n['’]est\s+[ée]cart[ée]\s+de\s+ce\s+lot/i;
//: T6 — un module PRODUCTEUR nommé dans « ce qui est demandé » : « transcrit … par `x` », « produit par `x` »…
const PRODUCTEUR_NOMME = /(?:transcri|produi|[ée]cri|d[ée]riv|g[ée]n[ée]r|port|r[ée]g[ée]n[ée]r)[a-zéèê]*\s+(?:[^`\n]{0,60}?\s)?par\s+`([^`\n]+)`/gi;
//: T6 — la lecture déclarée du producteur : « **Module producteur lu** : `x` … » (une ligne par module).
const LECTURE_PRODUCTEUR = /module\s+producteur\s+lu[^\n]*?`([^`\n]+)`/gi;

/** Le corps d'un élément : du sous-titre au sous-titre suivant, ou à la section suivante. */
function corpsDesElements(texte) {
  const bornes = [];
  ELEMENT.lastIndex = 0;
  let m;
  while ((m = ELEMENT.exec(texte)) !== null) bornes.push({ id: m[1], titre: m[2].trim(), debut: m.index });
  return bornes.map((b, i) => {
    const finSection = texte.slice(b.debut).search(/\n##\s+/);
    const finElement = i + 1 < bornes.length ? bornes[i + 1].debut - b.debut : Infinity;
    const fin = Math.min(finSection < 0 ? Infinity : finSection, finElement);
    return { ...b, corps: texte.slice(b.debut, b.debut + (fin === Infinity ? texte.length : fin)) };
  });
}

/** Une section porte-t-elle du contenu, ou seulement son titre ? Une section vide vaut absente. */
function contenuDeSection(texte, motif) {
  const m = texte.match(motif);
  if (!m) return null;
  const apres = texte.slice(m.index + m[0].length);
  const fin = apres.search(/\n##\s+/);
  return (fin < 0 ? apres : apres.slice(0, fin))
    .split("\n").filter((l) => l.trim() && !l.trim().startsWith("<!--")).join("\n").trim();
}

export function verifier(cheminOuTexte, nomFichier) {
  const estChemin = typeof cheminOuTexte === "string" && existsSync(cheminOuTexte);
  const texte = estChemin ? readFileSync(cheminOuTexte, "utf8") : String(cheminOuTexte);
  const nom = nomFichier || (estChemin ? basename(cheminOuTexte) : "<texte>");
  const constats = [];
  const ko = (regle, message, remede) => constats.push({ regle, statut: "FAIL", message, remede });
  const ok = (regle, message) => constats.push({ regle, statut: "PASS", message });

  const elements = corpsDesElements(texte);

  // ---- T2 : chaque élément cite son item d'origine ----------------------------------------
  // Jugé AVANT T1 : sans découpage en éléments, T1 n'a rien à juger, et un lot dont la section
  // « Travaux confiés » existe mais ne porte aucun élément est un lot vide qui se croit plein.
  if (!SECTION_TRAVAUX.test(texte)) {
    ko("T2", "section « Travaux confiés » absente — sans elle, un lot ne dit pas ce qu'il confie",
      "ajouter « ## Travaux confiés », puis un bloc `### TF-xxxx — <titre>` par élément");
  } else if (!elements.length) {
    const declare = /aucun\s+travail\s+confi[ée]\s+dans\s+ce\s+lot/i.test(contenuDeSection(texte, SECTION_TRAVAUX) || "");
    if (declare) ok("T2", "aucun travail confié, et c'est DÉCLARÉ — un lot vide est licite s'il le dit");
    else {
      ko("T2", "la section « Travaux confiés » ne porte AUCUN élément `### TF-xxxx` — un lot vide qui ne se déclare pas vide est indiscernable d'un lot mal écrit",
        "écrire un bloc `### TF-xxxx — <titre>` par élément, ou déclarer « aucun travail confié dans ce lot »");
    }
  } else {
    ok("T2", `${elements.length} élément(s) confié(s), chacun rattaché à son item du registre`);
  }

  // ---- T1 : chaque élément porte son moyen de vérification --------------------------------
  const sansVerif = elements.filter((e) => !VERIFICATION.test(e.corps));
  if (elements.length && sansVerif.length) {
    ko("T1", `${sansVerif.length} élément(s) sur ${elements.length} sans moyen de vérification (${sansVerif.map((e) => e.id).join(", ")}) — `
      + "un travail confié sans le moyen de constater qu'il est fait est une intention, pas un travail",
      "ajouter à chaque élément « - **Comment vous saurez que c'est fait** : <commande à rejouer ou fait à constater> »");
  } else if (elements.length) {
    ok("T1", `les ${elements.length} élément(s) portent leur moyen de vérification`);
  }

  // ---- T3 : ce que le pilot a déjà fait, ou la déclaration qu'il n'y a rien ---------------
  const dejaFait = contenuDeSection(texte, SECTION_DEJA_FAIT);
  if (dejaFait === null) {
    ko("T3", "section « Ce que le pilot a déjà fait de son côté » absente — sans elle, le produit ne peut pas savoir si le travail confié est le RESTE d'un problème traité ou le problème ENTIER",
      "ajouter la section. Rien à y mettre ? L'écrire : « rien n'a été corrigé au pilot pour ce lot »");
  } else if (!dejaFait && !AUCUN_DEJA_FAIT.test(texte)) {
    ko("T3", "la section « Ce que le pilot a déjà fait de son côté » est VIDE — une section vide se lit comme un oubli (loi n° 3)",
      "y écrire ce qui a été corrigé au pilot, ou « rien n'a été corrigé au pilot pour ce lot »");
  } else {
    ok("T3", "le lot dit ce que le pilot a fait de son côté, ou déclare qu'il n'y a rien");
  }

  // ---- T4 : la borne du lot --------------------------------------------------------------
  const borne = contenuDeSection(texte, SECTION_PAS_DEMANDE);
  if (borne === null) {
    ko("T4", "section « Ce que le pilot NE demande PAS » absente — c'est elle qui distingue un lot BORNÉ d'une liste de souhaits : sans borne déclarée, le silence sur un sujet ne se lit ni comme un accord ni comme un oubli",
      "ajouter la section. Rien à y mettre ? L'écrire : « rien n'est écarté de ce lot »");
  } else if (!borne && !AUCUNE_BORNE.test(texte)) {
    ko("T4", "la section « Ce que le pilot NE demande PAS » est VIDE — une borne non écrite n'est pas une borne",
      "y écrire ce qui est hors du lot avec son motif, ou « rien n'est écarté de ce lot »");
  } else {
    ok("T4", "le lot déclare sa borne : ce qu'il ne demande pas est écrit");
  }

  // ---- T5 : l'ordre recommandé est justifié ----------------------------------------------
  const ordre = contenuDeSection(texte, SECTION_ORDRE);
  if (elements.length > 1) {
    if (ordre === null) {
      ko("T5", "section « Ordre recommandé » absente alors que le lot confie plusieurs travaux — une liste non ordonnée se lit dans l'ordre où elle a été écrite, pas dans celui qui sert",
        "ajouter la section avec un ordre et son motif (impact, dépendance, risque)");
    } else if (!ORDRE_JUSTIFIE.test(ordre)) {
      ko("T5", "l'ordre recommandé n'est pas JUSTIFIÉ — un ordre sans motif est un rangement, et le produit ne peut ni l'adopter en confiance ni le contredire",
        "dire pourquoi cet ordre : « parce que », « d'abord … car », impact, dépendance, risque");
    } else {
      ok("T5", "l'ordre recommandé porte son motif");
    }
  } else {
    ok("T5", "un seul travail confié (ou aucun) — aucun ordre à justifier");
  }

  // ---- T6 : tout module producteur nommé a été lu (TF-0819) --------------------------------
  const lus = new Set();
  LECTURE_PRODUCTEUR.lastIndex = 0;
  for (let l; (l = LECTURE_PRODUCTEUR.exec(texte)) !== null;) lus.add(l[1].trim().toLowerCase());
  const nonLus = [];
  for (const e of elements) {
    PRODUCTEUR_NOMME.lastIndex = 0;
    for (let p; (p = PRODUCTEUR_NOMME.exec(e.corps)) !== null;) {
      const module = p[1].trim();
      if (!lus.has(module.toLowerCase())) nonLus.push(`${e.id} → \`${module}\``);
    }
  }
  const nonLusUniques = [...new Set(nonLus)];
  if (nonLusUniques.length) {
    ko("T6", `${nonLusUniques.length} module(s) producteur(s) nommé(s) sans lecture déclarée (${nonLusUniques.join(", ")}) — `
      + "nommer un producteur sans l'avoir lu, c'est confier une tâche à quelqu'un qui n'existe peut-être pas (lot 20260905b : un verbe chargé d'un champ qu'il ne produit jamais)",
      "ajouter, par module, une ligne « - **Module producteur lu** : `<module>` produit <artefact> (source : <chemin ou SKILL.md lu>) »");
  } else {
    ok("T6", elements.length && lus.size ? `${lus.size} module(s) producteur(s) nommé(s), chacun lu et sa source citée`
      : "aucun module producteur nommé — rien à lire");
  }

  return { fichier: nom, version: VERSION, constats,
    verdict: constats.some((c) => c.statut === "FAIL") ? "FAIL" : "PASS" };
}

// ---- CLI --------------------------------------------------------------------------------
const lanceEnDirect = process.argv[1]
  && import.meta.url.toLowerCase().endsWith(process.argv[1].toLowerCase().replaceAll("\\", "/").replace(/^[a-z]:/, "").replace(/^\//, ""));
if (lanceEnDirect || (process.argv[1] && process.argv[1].endsWith("oracle-travaux-pilot.mjs")) || (process.argv[1] && process.argv[1].endsWith("oracle-travaux.mjs"))) {
  const cible = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!cible || !existsSync(cible)) {
    console.error("usage : node oracle-travaux.mjs <lot.md> [--json]");
    process.exit(2);
  }
  const r = verifier(cible);
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 1));
  else {
    console.log(`oracle-travaux-pilot ${VERSION} — ${cible}`);
    console.log(`verdict : ${r.verdict}`);
    for (const c of r.constats) {
      console.log(`  [${c.statut}] ${c.regle} — ${c.message}`);
      if (c.remede) console.log(`      → ${c.remede}`);
    }
    if (r.verdict === "FAIL") {
      console.log("\nCe lot serait REFUSÉ. Le corriger ici coûte une minute ; le laisser partir");
      console.log("coûte au produit une lecture qu'il ne peut pas exploiter.");
    }
  }
  process.exit(r.verdict === "FAIL" ? 1 : 0);
}
