#!/usr/bin/env node
/**
 * oracle-synthese.mjs — juge la FORME d'un message de fin de traitement contre
 * `gabarits\RESTITUTION.md` v2 (14/08/2026).
 *
 * Pourquoi un oracle : la v1 de la consigne disait « sa tenue se vérifie à la relecture ».
 * C'est exactement ce que la loi transverse de l'écosystème refuse ailleurs — un ✓ sans
 * oracle exécuté n'est pas un ✓. Une consigne de FORME est le seul genre de règle qui se
 * contrôle entièrement à la machine : autant le faire.
 *
 * Ce qu'il ne juge PAS, et ne jugera jamais : la justesse du verdict, la pertinence d'un
 * risque, la sincérité d'un motif. Il tient la forme opposable, pas le fond — comme
 * oracle-etude-opportunite.
 *
 * Règles (chacune binaire) :
 *   S1  les 8 blocs de la structure sont présents (un bloc vide DOIT être dit, pas supprimé) ;
 *   S2  en-tête horodaté : une date ET une heure, avec fuseau ou mention explicite ;
 *   S3  verdict en une ligne, factuel — pas d'appréciation nue en guise de verdict ;
 *   S4  toute décision demandée est en choix FERMÉ (au moins deux options étiquetées) ;
 *   S5  chaque élément « non traité » porte un motif (la ligne n'est jamais seule) ;
 *   S6  les prochaines actions portent leurs deux classements : acteur ET ordre justifié ;
 *   S7  aucune profondeur de puce au-delà de 2 niveaux ;
 *   S8  aucun ✓ / « fait » sans preuve citée dans la même puce (verdict, compteur, chemin) ;
 *   S9  une SYNTHÈSE D'OUVERTURE en langage commanditaire précède le bloc 1 : l'état, ce
 *       que ça change, ce qui est attendu — SANS identifiant nu, chemin de fichier ni code
 *       (TF-0407, retour humain du 20/08 : « ton interlocuteur peut être pas assez
 *       technique pour comprendre tout ce que tu remontes »). Le détail vérifiable vient
 *       APRÈS — on ordonne, on ne supprime jamais.
 *   S10 aucun effort chiffré en JOURS sur une ligne de coût/estimation (TF-0408, 20/08 :
 *       avec l'IA un nombre de jours n'a pas de sens — complexité × durée, échelle du
 *       rapport d'audit). Les faits mesurés hors ligne de coût ne sont pas jugés.
 *   S11 toute action `auto_ia` NON EXÉCUTÉE porte son motif de non-exécution, pris dans un
 *       vocabulaire fermé (TF-0457) — sans quoi l'étiquette n'engage à rien ;
 *   S12 toute action `manuelle_dev` / `manuelle_utilisateur` porte sa raison d'impossibilité
 *       IA, vocabulaire fermé (TF-0458) — la loi transverse n° 5 l'exige depuis l'origine ;
 *   S13 toute action laissée à l'humain est EXÉCUTABLE : un chemin, une commande ou un
 *       libellé d'écran, dans le groupe de la puce (TF-0459) ;
 *   S14 toute action porte un identifiant stable, ou se déclare `neuve` (TF-0460) — sans
 *       identifiant, deux restitutions successives ne se comparent pas.
 *   S15 toute décision du bloc 3 RAPPELLE SON SUJET avant ses options : ≥ 25 mots, sans
 *       identifiant nu (22/08). Un identifiant ne désigne rien pour qui ne l'a pas écrit,
 *       et un titre court est une étiquette — or une décision mal écrite se tranche quand
 *       même, à l'aveugle. C'est S9 appliquée par décision.
 *   S16 toute décision porte sa RECOMMANDATION et la SOURCE consultée d'où elle sort — ou la
 *       déclaration qu'aucune source disponible ne répond (22/08). Une question dont la
 *       réponse est dans un document déjà fourni ne se pose pas : elle se répond.
 *   S17 un renvoi entre lignes nomme le SUJET ou son identifiant stable, JAMAIS une position
 *       (TF-0507, 22/08) — « ligne 8 », « point 5 » désignent autre chose au message suivant,
 *       la liste ayant été retriée. S14 exige un identifiant stable POUR l'item ; S17 exige
 *       qu'on s'en serve POUR RENVOYER. Un identifiant qui ne sert jamais à renvoyer ne sert
 *       à rien.
 *   S18 les tableaux d'un même bloc portent le MÊME en-tête (TF-0509, 22/08) — cinq mises en
 *       page pour le même contenu dans une seule session, dont un bloc à quatre formes de
 *       tableau distinctes. Une liste dont les colonnes changent ne se compare pas, même avec
 *       des identifiants stables : le bénéfice de S14 est annulé.
 *   S19 toute action du bloc 8 dit CE QUI SE PASSE SI ELLE N'EST PAS FAITE (TF-0510, 22/08) —
 *       symétrique de S16 côté actions. Une liste de restes sans conséquences est un
 *       inventaire, pas un outil d'arbitrage : c'est cette colonne qui permet de choisir ce
 *       qu'on laisse tomber.
 *   S21 second volet de S12 (« S12 bis ») : un motif `acces` ou `presence` porte, DANS LE MÊME
 *       GROUPE, la TRACE MESURÉE de la tentative — un code de réponse, un message d'erreur, une
 *       sortie de commande (TF-0526, 23/08/2026). S12 lit un jeton de vocabulaire ; elle ne peut
 *       pas voir la différence entre une impossibilité ÉPROUVÉE et une impossibilité SUPPOSÉE.
 *   S30 toute décision du bloc 3 porte un NUMÉRO, et les numéros sont DISTINCTS (28/08) — une
 *       décision se désigne pour se trancher. S4 compte des options et ne voit jamais que la
 *       QUESTION est insélectionnable ; le destinataire avait invente la numerotation avant de
 *       dire « je ne peux pas les sélectionner ». Formes admises, tiret compris : « D-5 — »,
 *       « D5 », « Décision 5 — ». DURCIE LE 01/09 : le numéro NU (« 5. », « 5) ») n'est plus
 *       admis, il ne dit pas à quelle des deux listes numérotées du message il appartient.
 *   S33 toute action du bloc 8 porte un SÉLECTEUR « A-N » distinct (01/09) — symétrique de S30
 *   S34 une action manuelle_utilisateur ne demande pas à l'humain de CRÉER/AJOUTER/ÉCRIRE une ligne, une
 *       variable ou un fichier — geste d'agent, loi n° 5 (02/09, TF-0766) ;
 *   S35 une preuve du bloc 4 est une sortie exécutée, jamais « préparé » ni « voir A-N » (02/09, TF-0766) ;
 *   S36 une page HTML citée comme livrée porte un verdict de critique d'implémentation (02/09, TF-0775) ;
 *   S37 une correction restituée porte son contrôle rouge → vert ou nomme sa classe (02/09, TF-0779) ;
 *       et né du même retour : « le 3 était pour les prochaines actions ». Deux familles
 *       numérotées pareil ne se désignent pas ; le sélecteur nomme la sienne.
 *   S31 chaque OPTION du bloc 3 porte son COÛT et CE QU'ELLE EXCLUT (30/08) — exigence écrite
 *       depuis le 13/08 et restée sans juge ; en TABLEAU, les colonnes suffisent (borne de S19 :
 *       une ligne se juge avec son en-tête). Sans elle, une liste d'options est un menu.
 *   S32 chaque DÉCISION nomme son OPTION PAR DÉFAUT (30/08) — ne pas trancher EST une décision,
 *       et la taire fait croire que ne rien faire est sans effet. Même origine que S31 : deux
 *       rendus du même bloc passaient le contrôle en ne se ressemblant pas.
 *   S20 un terme du référentiel `gabarits\JARGON-A-GLOSER.json` employé aux blocs 3 ou 8
 *       porte sa glose adjacente (TF-0511, 22/08) — S9 ne juge que l'OUVERTURE, or c'est aux
 *       blocs qu'on EXÉCUTE que le jargon coûte le plus : un jargon au bloc 0 fait perdre le
 *       fil, un jargon dans une action fait exécuter de travers ou pas du tout.
 *
 * Usage : node oracle-synthese.mjs <synthese.md>   → verdict JSON
 *         node oracle-synthese.mjs --self-test     → fixtures double sens
 * Exit : 0 PASS · 1 FAIL · 2 non jugeable.
 */
// Exit : 0 = conforme · 1 = defaut MESURE · 2 = JE NE PEUX PAS MESURER — la condition et
// son remede sont alors NOMMES. Un oracle qui ne distingue pas les deux fait passer une panne
// d'environnement pour un defaut du produit (TF-0648).
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Un bloc = son titre reconnu par un motif. Le libellé exact est libre : c'est la PRÉSENCE du
// bloc qui est opposable, pas sa formulation — imposer un mot à mot rendrait la consigne
// inapplicable aux sorties courtes.
// LE NUMÉRO SE SÉPARE COMME L'AUTEUR VEUT (TF-0566, 24/08). Le motif exigeait « N. » — un point,
// rien d'autre. Un titre « ## 1 - En-tête d'identification » plaçait donc « 1 - » entre le dièse et
// le mot-clé, et AUCUNE branche ne l'absorbait : les HUIT blocs étaient déclarés absents.
//
// MESURE PAR A/B DU 24/08, et c'est elle qui rend le défaut indiscutable : deux fichiers identiques
// au séparateur près, l'un titré « ## N. », l'autre « ## N - ». Le premier rend S1 PASS, le second
// S1 FAIL sur les huit blocs. Le coût n'est pas le refus, c'est le MESSAGE : « bloc(s) absent(s) »
// envoie l'auteur chercher du contenu manquant alors qu'il manque un point — un auteur a réécrit
// huit blocs pour changer une ponctuation. Aggravant : le tiret cadratin est la ponctuation que le
// GABARIT emploie lui-même dans ses titres.
//
// `NUM` absorbe donc toutes les formes qu'un humain écrit : « 1. », « 1 - », « 1 — », « 1) », « 1 : »,
// « 1 · », ou rien. Juger la ponctuation d'un titre n'a jamais été le sujet de S1.
const NUM = String.raw`(?:\d{1,2}\s*(?:[.)\-–—:·]\s*)?)?`;
const BLOCS = [
  [new RegExp(`(^|\n)#{1,4}\\s*${NUM}(en-t[êe]te|identification|contexte du traitement)`, "i"), "1. En-tête d'identification"],
  [new RegExp(`(^|\n)#{1,4}\\s*${NUM}verdict`, "i"), "2. Verdict en une ligne"],
  [new RegExp(`(^|\n)#{1,4}\\s*${NUM}d[ée]cisions?`, "i"), "3. Décisions attendues"],
  [new RegExp(`(^|\n)#{1,4}\\s*${NUM}trait[ée]`, "i"), "4. Traité"],
  [new RegExp(`(^|\n)#{1,4}\\s*${NUM}non\\s+trait[ée]`, "i"), "5. Non traité"],
  [new RegExp(`(^|\n)#{1,4}\\s*${NUM}[ée]carts?\\s+[àa]\\s+la\\s+lettre`, "i"), "6. Écarts à la lettre"],
  [new RegExp(`(^|\n)#{1,4}\\s*${NUM}risques?`, "i"), "7. Risques"],
  [new RegExp(`(^|\n)#{1,4}\\s*${NUM}(prochaines?\\s+actions?|suites?\\s+[àa]\\s+donner)`, "i"), "8. Prochaines actions"],
];

const MOTIFS_ABSENCE = /(aucun|rien|n[ée]ant|sans objet|non concern)/i;

// Les jetons de verdict sont cherchés en CASSE EXACTE, et ce n'est pas un détail : avec le
// drapeau insensible, `\bPASS\b` matche le mot français « passé » — en JavaScript `\b` est
// ASCII, donc « é » compte comme une frontière. « Tout s'est bien passé » passait alors pour
// un verdict mesuré, c'est-à-dire exactement la phrase que cette règle existe pour refuser.
// Faux positif trouvé par le self-test le 14/08.
const _JETONS = /\b(PASS|FAIL|SKIP|NA|TENU|OK|KO)\b/;
// S3 — UN COMPTE EST UN COMPTE, QUEL QUE SOIT CE QU'IL COMPTE (TF-0678, 26/08/2026).
//
// LE DÉFAUT, ET IL A EU L'EFFET INVERSE DE SON INTENTION. Ce motif n'acceptait un nombre que
// devant NEUF noms — test, finding, règle, cas, item, constat, élément, commit, pan. Mesure
// reproduite en le rejouant sur les verdicts qu'il avait refusés : « 70 pages modifiées, 70
// conformes en production, 0 en défaut » → FAIL ; « 446 fichiers, 7 essais » → FAIL ;
// « 4 tests négatifs » → PASS. **Deux des trois refus d'une session** venaient de là, sur des
// verdicts portant des comptes explicites et vérifiables.
//
// La règle existe pour refuser « tout s'est bien passé ». En imposant un lexique, elle poussait
// à HABILLER un compte réel en vocabulaire admis — c'est-à-dire à dégrader le verdict pour
// passer la porte.
//
// CE QUI EST RETENU : un nombre suivi d'un MOT d'au moins trois lettres. Trois bornes, chacune
// mesurée sur cas construit : le nombre ne doit pas être collé à un identifiant (`TF-0668`,
// `R-44`, `v2.1.0`, une date ISO) ; il ne doit pas suivre « version » ; et le mot qui suit ne
// doit pas être un MOIS, sans quoi « livré le 26 août » passerait pour une mesure.
//
// MESURE D'ENTRÉE sur le corpus réel du dépôt — 224 fichiers, 1 947 puces : l'ancien motif en
// reconnaissait 158, le nouveau 355. Les 197 qui basculent ont été échantillonnées une à une :
// « 7 forges publiées », « 23 PASS », « 21 événements », « 6 dépôts poussés », « 2 fichiers, 4
// insertions ». Aucune phrase vide dans le lot.
const _MOIS = "janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[ûu]t|septembre|octobre|novembre|d[ée]cembre";
const _CHIFFRES = new RegExp(
  String.raw`(\d+\s*/\s*\d+|\d+\s*%|(?<![\w.-])(?<!version\s)\d{1,6}\s+(?!(?:${_MOIS})\b)[a-zà-ÿ]{3,})`,
  "i");
// LA LISTE DES EXTENSIONS RECONNUES, ÉLARGIE LE 30/08 — et son étroitesse était un FAUX REFUS.
//
// LE FAIT, mesuré sur le rendu de référence d'un produit : une décision citait
// `.github/workflows/deploiement.yml` comme la source de sa recommandation — un fichier de chaîne
// d'intégration, une source parfaitement vérifiable — et S16 la refusait, parce que `yml` n'était
// pas dans la liste. Six extensions y figuraient, choisies au fil des besoins du pilot lui-même :
// `md`, `json`, `mjs`, `py`, `html`, `jsonl`. Un produit qui n'écrit ni en Python ni en Markdown
// ne pouvait donc citer aucune de ses propres sources.
//
// CE QUE COÛTAIT LE REFUS : le rédacteur n'a que deux issues, entourer la source d'accents graves
// pour tromper la reconnaissance, ou renoncer à la citer. La première apprend à contourner la
// règle, la seconde appauvrit la restitution — c'est exactement le dilemme que L1 posait sur un
// autre contrôle le 26/08, et il se tranche pareil : un contrôle dont la seule issue verte dégrade
// ce qu'il juge travaille contre son propre objet.
//
// EFFET DE BORD ASSUMÉ ET DÉCLARÉ : `_LOCALISATEURS` sert aussi de PREUVE à S3 et S8. Élargir la
// liste élargit donc ce qui compte comme preuve — citer un fichier de configuration vaut désormais
// localisateur au bloc 4. C'est cohérent (un chemin vérifiable EST un localisateur) mais ce n'est
// pas neutre, et le banc le vérifie : la fixture rouge doit continuer d'échouer sur S3 et S8.
const _LOCALISATEURS = /(`[^`]+`|\.(md|json|mjs|py|html|jsonl|ya?ml|jsx?|tsx?|css|scss|txt|csv|toml|ini|cfg|conf|sh|ps1|sql|xml|env|lock)\b|\b[a-f0-9]{7,40}\b)/;
const preuve = (s) => _JETONS.test(s) || _CHIFFRES.test(s) || _LOCALISATEURS.test(s);

// Une puce Markdown se POURSUIT sur les lignes suivantes quand elle dépasse la largeur. Juger
// ligne par ligne dénonçait donc une puce dont la preuve tombait sur la continuation — faux
// positif constaté le 14/08 en jugeant l'oracle sur sa propre restitution. On reconstitue la
// puce LOGIQUE : la puce, plus toutes les lignes qui la continuent (indentées, non-puces).
function puces(texte) {
  const sortie = [];
  let courante = null;
  for (const ligne of texte.split("\n")) {
    if (/^\s*[-*]\s+\S/.test(ligne)) {
      if (courante !== null) sortie.push(courante);
      courante = ligne;
    } else if (courante !== null && /^\s+\S/.test(ligne)) {
      courante += " " + ligne.trim();
    } else if (courante !== null) {
      sortie.push(courante);
      courante = null;
    }
  }
  if (courante !== null) sortie.push(courante);
  return sortie;
}

// Une ACTION du bloc 8 est une puce de premier niveau AVEC tout ce qui la suit : ses
// continuations et ses sous-puces. Juger la puce seule était le faux positif à ne pas
// reproduire (TF-0459) — la doctrine dit deux niveaux au plus, et c'est précisément au second
// que vivent le motif, le chemin et la commande. Grouper est donc la seule lecture juste.
//
// DEUXIÈME FORME, ajoutée le 22/08 (TF-0508) : la LIGNE DE TABLEAU. Le lecteur l'a réclamée
// trois fois dans une seule session — « pourquoi tout n'est pas dans un seul tableau ? », puis
// « Revois complètement ta présentation », puis « tableau !! ». Ne lire que les puces laissait
// donc un TROU BÉANT : un bloc 8 rendu en tableau rendait zéro groupe, S11 à S14 répondaient
// « aucune action concernée » et le bloc entier échappait au jugement. Une règle qui se
// DÉSACTIVE au moment où l'on adopte la forme demandée est pire qu'une règle absente : elle
// donne un vert en récompense du changement de forme.
function actionsGroupees(texte) {
  const groupes = [];
  for (const ligne of texte.split("\n")) {
    if (/^\s*\|/.test(ligne)) continue;            // les tableaux sont lus plus bas
    if (/^[-*]\s+\S/.test(ligne)) groupes.push(ligne);
    else if (groupes.length && /^\s+\S/.test(ligne)) groupes[groupes.length - 1] += " " + ligne.trim();
  }
  // Une ligne de tableau se juge AVEC SON EN-TETE, et c'est la correction du 22/08 (second
  // temps). En forme de PUCE, le motif d'une action vit dans la puce ; en forme de TABLEAU — la
  // forme que le lecteur a réclamée trois fois — il vit dans la COLONNE, donc dans l'en-tête. Sans
  // cette jonction, S19 refusait un tableau dont la dernière colonne s'appelait pourtant « si elle
  // n'est pas faite » : la règle exigeait de recopier la locution dans chacune des cinq cellules.
  //
  // MESURÉ SUR LA RESTITUTION DE CE MANDAT MÊME, la première rendue au format tableau : 5 actions
  // sur 5 refusées, alors que la colonne était là. Deux règles neuves du même jour se
  // contredisaient — S18 prescrit le tableau, S19 le rendait impossible à satisfaire proprement.
  // Une règle qui force à recopier la même locution cinq fois pousse au bruit, pas à la clarté.
  const entetes = entetesDeTableau(texte);
  const entete = entetes.length ? entetes[0] : "";
  return groupes.concat(lignesDeDonnees(texte).map((l) => entete + " " + l));
}

// UNE DÉCISION DU BLOC 3 SE LIT AUTREMENT QU'UNE ACTION DU BLOC 8 (TF-0568, 24/08). Le lecteur
// des restitutions l'a signalé et a demandé la généralisation du correctif : S15 et S16
// cherchaient le chapeau d'une décision DANS le groupe qui porte sa première option, et
// `actionsGroupees` ne réunit qu'une puce avec ses lignes de continuation indentées. Trois mises
// en page naturelles échouaient donc, alors qu'elles disent la MÊME décision :
//   · options en puces FILLES non indentées → chaque option devient un groupe à chapeau vide ;
//   · options en TABLEAU séparé par une ligne vide → la ligne vide coupe le groupe ;
//   · tableau SANS puce → aucun groupe ne contient « (a) ».
// La seule forme conforme était une puce unique portant chapeau + options + recommandation +
// source + option par défaut : un pavé de douze lignes au rendu. *Une règle qui n'admet qu'une
// mise en page ne juge plus le fond, elle impose une typographie* — et elle punit exactement le
// lecteur qui demande une présentation lisible.
//
// La lecture juste segmente au DÉBUT DE DÉCISION, pas à la puce : une ligne d'OPTION, une ligne
// de tableau, une ligne vide et une puce fille ne commencent jamais une décision, elles
// continuent celle en cours. Un segment sans ouverture — bloc qui démarre droit sur son tableau
// ou sa prose — s'ouvre implicitement, sinon la forme la plus dépouillée serait la seule muette.
const RE_LIGNE_OPTION = /^\s*(?:[-*+]\s+|\|\s*)?\**\(?[a-e]\)/;
// LE BLOC DE CITATION OUVRE UNE DÉCISION (30/08/2026), et son absence était la cause racine de
// tout le fil de ce jour.
//
// LE FAIT, mesuré sur le rendu de référence lui-même — le message qu'un produit a réellement
// affiché et que le destinataire a mis en regard trois fois en demandant « pourquoi ce format
// n'est pas appliqué ». Ses décisions s'écrivent en BLOC DE CITATION : trois lignes préfixées
// d'un chevron portent le titre, le rappel et la recommandation, puis le tableau des options vit
// au niveau du document, puis une dernière ligne citée porte le repli. Jugé par cet oracle, ce
// rendu rendait « 1 décision SANS NUMÉRO » là où il en porte DEUX, numérotées D-5 et D-6 : aucune
// ligne à chevron n'ouvrait de segment, les deux décisions fusionnaient en un seul bloc, et le
// numéro n'était plus en tête.
//
// CE QUE ÇA A COÛTÉ, et c'est le vrai sujet : le format que le destinataire demandait était
// REFUSÉ par le contrôle censé le faire respecter. Un agent qui satisfait l'oracle dérive donc
// mécaniquement vers la puce, et chaque « correction » du format l'éloignait de ce qui était
// demandé. Deux tours de ce fil ont été passés à corriger vers ce que l'oracle acceptait.
//
// N'OUVRE QUE LA TÊTE D'UNE DÉCISION : la ligne citée qui porte le repli (« > **Si rien n'est
// décidé** … ») doit rester RATTACHÉE à la décision, sinon elle deviendrait une décision sans
// options et S15 comme S32 crieraient sur une forme juste.
const RE_TETE_CITATION = /^>\s*\**\s*(?:d[ée]cision\s*)?(?:n[°ºo]\s*)?(?:D\s*-?\s*)?\d{1,2}\s*(?:[.)\-–—:·]|\*\*|\s)/i;
// Le préfixe d'une tête de décision, quelle que soit sa mise en page : chevron de citation,
// puce, ou titre de section. Retiré avant de lire le numéro et avant de compter le chapeau.
const TETE_DECISION = /^\s*(?:>\s*)?(?:[-*+]\s+|#{2,6}\s*)?/;

function decisionsDuBloc(texte) {
  const segs = [];
  for (const ligne of texte.split("\n")) {
    const ouvre = (/^[-*+]\s+\S/.test(ligne) || /^\s*#{2,6}\s/.test(ligne) || RE_TETE_CITATION.test(ligne))
      && !RE_LIGNE_OPTION.test(ligne) && !/^\s*\|/.test(ligne);
    if (ouvre) { segs.push(ligne); continue; }
    if (!segs.length) { if (ligne.trim()) segs.push(ligne); continue; }
    if (ligne.trim()) segs[segs.length - 1] += " " + ligne.trim();
  }
  return segs;
}

// Les lignes de DONNÉES d'un tableau markdown : ni l'en-tête (1re ligne du tableau), ni le
// séparateur `|---|`. Un bloc peut porter plusieurs tableaux — le compteur repart à zéro dès
// qu'une ligne non-tableau les sépare.
function lignesDeDonnees(texte) {
  const sortie = [];
  let rang = 0;
  for (const l of texte.split("\n")) {
    if (!/^\s*\|/.test(l)) { rang = 0; continue; }
    rang++;
    if (rang === 1) continue;                                    // en-tête
    if (/^\s*\|[\s|:.-]*\|\s*$/.test(l)) continue;                 // séparateur
    if (!l.replace(/[|\s]/g, "")) continue;                       // ligne vide
    sortie.push(l.trim());
  }
  return sortie;
}

// Les EN-TÊTES de tableau d'un bloc, dans l'ordre : première ligne de chaque tableau.
function entetesDeTableau(texte) {
  const sortie = [];
  let rang = 0;
  for (const l of texte.split("\n")) {
    if (!/^\s*\|/.test(l)) { rang = 0; continue; }
    rang++;
    if (rang === 1) sortie.push(l.trim().replace(/\s+/g, " ").toLowerCase());
  }
  return sortie;
}

// Le référentiel de jargon est une DONNÉE éditable et datée (loi n° 4) : son absence n'est pas
// une erreur d'oracle, c'est un SANS OBJET dit à voix haute. Un oracle qui plante faute de
// donnée annexe se fait retirer du chemin, et la règle meurt avec lui.
function chargerJargon() {
  const chemin = join(dirname(fileURLToPath(import.meta.url)), "..", "gabarits", "JARGON-A-GLOSER.json");
  if (!existsSync(chemin)) return [];
  try {
    const d = JSON.parse(readFileSync(chemin, "utf8"));
    return (d.termes || []).map((t) => t.terme).filter((t) => typeof t === "string" && t.length > 1);
  } catch { return []; }
}

function bloc(texte, motif) {
  const m = texte.match(motif);
  if (!m) return null;
  const debut = m.index + m[0].length;
  const suivant = texte.slice(debut).search(/\n#{1,4}\s/);
  return texte.slice(debut, suivant === -1 ? undefined : debut + suivant);
}

function juger(texte) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });

  // S1 — les 8 blocs
  const absents = BLOCS.filter(([re]) => !re.test(texte)).map(([, nom]) => nom);
  absents.length
    ? ko("S1", `bloc(s) absent(s) : ${absents.join(" · ")} — un bloc sans contenu se DIT en une ligne, il ne disparaît pas (loi n° 3)`)
    : ok("S1", "les 8 blocs de la structure sont présents");

  // S2 — horodatage : date ET heure
  const enTete = bloc(texte, BLOCS[0][0]) || texte.slice(0, 800);
  const aDate = /\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/.test(enTete);
  const aHeure = /\b\d{1,2}\s*[h:]\s*\d{2}\b/i.test(enTete);
  if (aDate && aHeure) ok("S2", "en-tête horodaté (date et heure)");
  else ko("S2", `en-tête sans ${!aDate ? "date" : ""}${!aDate && !aHeure ? " ni " : ""}${!aHeure ? "heure" : ""} — plusieurs traitements tombent le même jour, sans heure ils ne s'ordonnent pas`);

  // S3 — verdict factuel : au moins un fait mesurable dans le bloc verdict
  const bVerdict = bloc(texte, BLOCS[1][0]) || "";
  preuve(bVerdict)
    ? ok("S3", "le verdict porte un fait mesurable")
    : ko("S3", "verdict sans fait mesurable — « tout s'est bien passé » n'est pas un verdict, « 19/19 » l'est");

  // S4 — décisions en choix fermé
  const bDecisions = bloc(texte, BLOCS[2][0]) || "";
  if (MOTIFS_ABSENCE.test(bDecisions.split("\n")[0] || "") || MOTIFS_ABSENCE.test(bDecisions.trim().slice(0, 120))) {
    ok("S4", "aucune décision en attente — déclaré explicitement");
  } else {
    const options = (bDecisions.match(/\((?:a|b|c|d)\)|^\s*[-*]\s*\*\*\(?[a-d]\)?\*\*/gim) || []).length;
    options >= 2
      ? ok("S4", `décisions en choix fermé (${options} option(s) étiquetée(s))`)
      : ko("S4", "décision demandée sans choix fermé — l'humain tranche entre des options, il ne rédige pas la solution");
  }

  // S5 — chaque non-traité porte un motif
  const bNonTraite = bloc(texte, BLOCS[4][0]) || "";
  const lignesNonTraite = puces(bNonTraite);
  if (!lignesNonTraite.length) {
    MOTIFS_ABSENCE.test(bNonTraite)
      ? ok("S5", "rien de non traité — déclaré explicitement")
      : ko("S5", "bloc « non traité » vide et muet : ni élément, ni déclaration d'absence");
  } else {
    const sansMotif = lignesNonTraite.filter((l) => !/(motif|parce que|car\b|faute de|bloqu|hors mandat|[ée]cart|:\s*\S)/i.test(l));
    sansMotif.length
      ? ko("S5", `${sansMotif.length} élément(s) non traité(s) SANS motif — un reste sans motif est un silence`)
      : ok("S5", `${lignesNonTraite.length} élément(s) non traité(s), tous motivés`);
  }

  // S6 — prochaines actions : acteur ET ordre justifié
  const bActions = bloc(texte, BLOCS[7][0]) || "";
  if (MOTIFS_ABSENCE.test(bActions.trim().slice(0, 120))) {
    ok("S6", "aucune action suivante — déclaré explicitement");
  } else {
    const acteur = /(auto_ia|manuelle_dev|manuelle_utilisateur|\bIA\b|d[ée]veloppeur|utilisateur|humain)/i.test(bActions);
    const ordre = /(priorit|d'abord|en premier|impact|risque \d+|parce qu|car\b|levier)/i.test(bActions);
    if (acteur && ordre) ok("S6", "prochaines actions : acteur nommé et ordre justifié");
    else ko("S6", `prochaines actions sans ${!acteur ? "acteur" : ""}${!acteur && !ordre ? " ni " : ""}${!ordre ? "justification d'ordre" : ""} — une liste non ordonnée se lit dans l'ordre où elle a été écrite, pas dans celui qui sert`);
  }

  // S7 — profondeur de puces
  const trop = texte.split("\n").filter((l) => /^\s{6,}[-*]\s+\S/.test(l));
  trop.length
    ? ko("S7", `${trop.length} puce(s) au-delà du 2e niveau — au 3e, on ne lit plus, on scanne`)
    : ok("S7", "profondeur de puces tenue (2 niveaux au plus)");

  // S8 — pas de ✓ sans preuve dans la même puce
  //
  // S19 (22/08) a introduit une tournure NÉGATIVE qui contient le mot « fait » : « si rien n'est
  // fait », « si on ne le fait pas », « si elle n'est pas faite ». S8 y lisait une affirmation de
  // fait sans preuve — faux positif constaté LE JOUR MÊME en jouant S19 sur une restitution
  // réelle : quatre actions correctement conséquencées faisaient échouer S8. Une conséquence n'est
  // pas un ✓, et une règle neuve qui met une règle ancienne en défaut sur du texte conforme est un
  // défaut de la NOUVELLE, pas de l'ancienne. On retire donc la clause conditionnelle avant de
  // chercher l'affirmation ; la preuve, elle, reste cherchée dans la puce ENTIÈRE.
  const sansConditionnel = (l) => l
    .replace(/\bsi\b[^.;]*?\bfaite?\b/gi, " ")
    .replace(/\bne (?:le |la |les )?fait pas\b/gi, " ")
    .replace(/\bnon fait\b/gi, " ")
    // Le bloc 6 est PRESCRIT sous la forme « vous avez demandé → j'ai fait → pourquoi ». S8 y
    // lisait une affirmation de complétion sans preuve — sur la locution que le gabarit impose.
    // Un oracle qui refuse la formulation qu'un gabarit prescrit met le gabarit en défaut, jamais
    // l'auteur. La preuve d'un écart n'est pas un verdict d'oracle : c'est le « pourquoi ».
    .replace(/\bj(?:'|’)ai (?:aussi |également )?fait\b/gi, " ")
    // `\b` après « demandé » ne matche jamais : la frontière ASCII ne voit pas le « é ». La
    // tournure n'était donc pas retirée (trouvé par `oracle-pieges-regex`).
    .replace(/(?<![0-9A-Za-zÀ-ÿ])vous avez demandé(?![0-9A-Za-zÀ-ÿ])/gi, " ");
  // S8 EST BORNÉE AUX BLOCS QUI AFFIRMENT (22/08, second temps). Elle balayait le document
  // entier, et elle mordait donc sur deux formes que le gabarit PRESCRIT ailleurs :
  //   · bloc 6 — « vous avez demandé → j'ai fait → pourquoi » : la preuve d'un écart est le
  //     POURQUOI, jamais un verdict d'oracle. « J'ai aussi clos la demande » y était refusé ;
  //   · bloc 7 — un risque se dit en prose, et « un travail fait deux fois » n'affirme rien.
  // Les blocs 5, 6 et 7 parlent par construction de ce qui n'a PAS été fait, de ce qui a divergé
  // et de ce qui pourrait casser : y chercher un ✓ sans preuve est une erreur de domaine. S8 juge
  // donc le verdict, le traité et les actions — là où la complétion se CLAIME.
  const zonesAffirmantes = [bloc(texte, BLOCS[1][0]) || "", bloc(texte, BLOCS[3][0]) || "", bloc(texte, BLOCS[7][0]) || ""].join(String.fromCharCode(10));
  const nus = puces(zonesAffirmantes).filter((l) => {
    if (!/(✓|\bfait\b|\btermin[ée]|\bsold[ée]|\bclos\b)/i.test(sansConditionnel(l))) return false;
    return !preuve(l);
  });
  nus.length
    ? ko("S8", `${nus.length} affirmation(s) « fait » sans preuve citée — un ✓ sans oracle exécuté n'est pas un ✓`)
    : ok("S8", "chaque élément déclaré fait porte sa preuve");

  // S9 (TF-0407) — la synthèse d'ouverture, en langage commanditaire. Le retour qui l'a fait
  // naître est la mesure elle-même : le destinataire unique des restitutions dit qu'une partie
  // ne lui parvient pas — et une information remontée et non comprise a le même effet qu'une
  // information tue, avec le coût de lecture en plus. La règle est binaire : entre le titre et
  // le premier bloc, un paragraphe de prose d'au moins vingt mots, SANS identifiant TF nu, sans
  // chemin de fichier, sans span de code, sans sha. Le détail vérifiable ne disparaît pas : il
  // vient APRÈS — on ordonne, on ne supprime jamais (doctrine RL-1/RL-7 des rapports,
  // transposée à la conversation, la seule surface qui restait sans doctrine d'audience).
  // TF-0513 (22/08) — les deux retraits étaient ORDONNÉS et tous deux ancrés en `^` : titre
  // d'abord, frontmatter ensuite. Or le gabarit PRESCRIT le frontmatter `destinataire: humain`
  // depuis TF-0331, donc il vient EN PREMIER dans toute synthèse conforme : le retrait du titre
  // ne matchait rien, et LE TITRE RESTAIT dans l'ouverture. S9 jugeait alors le H1 comme de la
  // prose de bloc 0, et un titre daté selon la convention de nommage (« … — 20260822a ») s'y
  // faisait lire comme un sha court. Deux règles prescrites par le MÊME gabarit se
  // contredisaient, sur un document sans défaut et devant un hook `Stop` bloquant.
  //
  // Le remède ne réordonne pas : il boucle jusqu'à point fixe, donc il est INDIFFÉRENT à
  // l'ordre — frontmatter puis titre, titre puis frontmatter, ou l'un sans l'autre.
  //
  // TF-0567 (24/08) — UNE OUVERTURE PEUT PORTER UN TITRE, et c'est même le nom que le gabarit lui
  // donne : « bloc 0 ». S9 ne lisait l'ouverture qu'AVANT le premier titre de niveau 2 à 4 ; une
  // restitution qui la titrait « ### 0. Synthèse d'ouverture » — forme naturelle, prescrite en
  // toutes lettres — rendait donc une ouverture VIDE, et S9 échouait sur « 0 mot(s) ».
  // Le message était EXACT et TROMPEUR : vrai de ce que l'oracle avait lu, il faisait conclure à
  // l'auteur que sa prose manquait alors qu'elle était là, complète, trente mots au-dessus.
  // *Un message exact sur une lecture fausse coûte plus qu'un message absent* — l'auteur y croit.
  // On accepte les deux formes, et on garde la plus longue : celui qui titre son ouverture ET
  // écrit avant le titre ne doit être puni ni pour l'un ni pour l'autre.
  const RE_TITRE_OUVERTURE =
    /(^|\n)#{1,4}[ \t]*(?:0[ \t]*[.)\-–—:·]?[ \t]*)?(synth[èe]se d.ouverture|ouverture|bloc[ \t]*0)[^\n]*\n/i;
  const premierBloc = texte.search(/(^|\n)#{2,4}\s/);
  let ouverture = (premierBloc > 0 ? texte.slice(0, premierBloc) : "").trim();
  const mTitre = RE_TITRE_OUVERTURE.exec(texte);
  if (mTitre) {
    const apres = texte.slice(mTitre.index + mTitre[0].length);
    const fin = apres.search(/(^|\n)#{1,4}\s/);
    const titree = (fin >= 0 ? apres.slice(0, fin) : apres).trim();
    const compte = (t) => t.split(/\s+/).filter(Boolean).length;
    if (compte(titree) > compte(ouverture)) ouverture = titree;
  }
  for (let i = 0; i < 4; i++) {
    const avant = ouverture;
    ouverture = ouverture.replace(/^---[\s\S]*?\n---\s*/, "").replace(/^#[^\n]*\n?/, "").trim();
    if (ouverture === avant) break;
  }
  const mots = ouverture.split(/\s+/).filter(Boolean).length;
  const techniques = [
    [/\bTF-\d{3,4}\b/, "identifiant TF nu"],
    [/[\w-]+\.(?:md|mjs|py|json|jsonl|html|toml)\b/, "chemin ou nom de fichier"],
    [/`[^`]+`/, "span de code"],
    [/\b[a-f0-9]{7,40}\b/, "sha"],
  ].filter(([motif]) => motif.test(ouverture)).map(([, quoi]) => quoi);
  if (mots < 20) {
    ko("S9", `synthèse d'ouverture absente ou trop courte (${mots} mot(s) lu(s), en tête ou sous un titre d'ouverture) — ` +
      "l'état, ce que ça change et ce qui est attendu se disent en langage commanditaire AVANT le détail");
  } else if (techniques.length) {
    ko("S9", `la synthèse d'ouverture porte du vocabulaire technique nu (${techniques.join(", ")}) — ` +
      "ces éléments vont APRÈS, dans les blocs : on ordonne, on ne supprime jamais");
  } else {
    ok("S9", `synthèse d'ouverture en langage commanditaire (${mots} mots, sans identifiant nu)`);
  }

  // S10 (TF-0408) — l'effort parle en complexité × durée, jamais en jours : sur toute
  // ligne portant un marqueur de coût/estimation, une unité « j / jours / j-h » chiffrée
  // est un défaut. Même règle qu'E8 côté études — la restitution est l'autre surface où
  // une estimation se glisse.
  const lignesCout = texte.split("\n").filter((l) => /co[uû]t|estimation|effort estimé|charge estimée/i.test(l));
  const enJours = lignesCout.filter((l) => /(?:\d+(?:[.,]\d+)?|½)\s*(?:à\s*\d+(?:[.,]\d+)?\s*)?j(?:ours?)?\b|jours?[- ]hommes?/i.test(l));
  enJours.length
    ? ko("S10", `${enJours.length} ligne(s) de coût chiffrée(s) en JOURS — complexité (simple|moyen|complexe|très complexe) × durée (court|moyen|long|très long). Ex. : ${enJours[0].trim().slice(0, 90)}`)
    : ok("S10", "aucune estimation en jours — l effort parle en complexité × durée");

  // ---- S11 à S14 (TF-0457..TF-0460, 22/08) — le bloc 8 cesse d'être une liste d'étiquettes --
  //
  // Retour humain du 22/08 : « la liste des tâches est trop longue, trop complexe, sans assez
  // de détails sur les problèmes, les solutions possibles, menées par l'IA ou ne pouvant être
  // traitées que par moi ». Instruit sur les fichiers, il ne demandait presque RIEN de neuf :
  // les blocs 3 et 8 portaient déjà la doctrine, et la loi transverse n° 5 dit depuis l'origine
  // « l'IA fait, l'humain décide — la voie automatisée est le DÉFAUT ; l'action laissée à
  // l'humain se justifie ». Ce qui manquait n'était pas la règle mais son CONTRÔLE : S6 ne
  // teste que la PRÉSENCE d'un nom d'acteur, jamais ce que cette étiquette engage.
  //
  // Mesuré le 22/08 sur les 13 synthèses à bloc 8 de `output\04-plans\` : 15 lignes `auto_ia`,
  // dont 9 renvoyées à un mandat humain sans que rien ne le dise — le lecteur y lit neuf tâches
  // là où il y a une seule gate de gouvernance ; 6 `manuelle_dev` et 17 `manuelle_utilisateur`,
  // ZÉRO justification d'attribution ; ZÉRO identifiant d'action stable, donc aucune
  // comparaison possible d'un tour au suivant, donc la même ligne re-servie indéfiniment.
  //
  // Les vocabulaires sont FERMÉS et NON ACCENTUÉS, et ce n'est pas un détail de style : c'est
  // ce qui les rend comptables (« combien d'actions restent humaines par `acces` ? ») et ce qui
  // les empêche d'être touchés par hasard par de la prose française — « décision », « accès »,
  // « présence » portent leur accent et ne matchent pas les jetons `decision`, `acces`,
  // `presence`. Un motif hors vocabulaire n'est pas un refus valide : c'est un candidat à
  // l'automatisation, à verser au registre.
  const MOTIFS_IA = /\b(gate_gouvernance|dependance_bloc_3|garde_fou|borne_atteinte|dependance_externe|hors_mandat)\b/;
  // `hors_mandat` a été AJOUTÉ dans l'heure qui a suivi l'écriture de S11, sur un cas réel : trois
  // lots de retours sont arrivés dans la boîte d'entrée pendant le mandat du 22/08. Les ingérer
  // est du ressort de l'IA, mais d'un AUTRE mandat. Aucun des cinq motifs d'origine ne le disait,
  // et la seule issue était d'en choisir un faux ou de taire la ligne — c'est-à-dire exactement ce
  // que S11 existe pour empêcher. Une règle qui force à mentir est une règle à corriger, pas à
  // contourner. C'est aussi le motif le plus facile à ABUSER : apposé sur une action que le mandat
  // courant couvre, il contourne S11 au lieu de la satisfaire, et aucun oracle ne le voit — c'est
  // déclaré en `non_juge` plutôt que passé sous silence.
  const MOTIFS_HUMAIN = /\b(acces|decision|depense|presence|irreversible)\b/;
  const ID_STABLE = /\b[A-Z]{1,4}-\d{2,4}\b/;
  const DECLAREE_NEUVE = /\b(neuve|neuf|nouvelle|nouveau)\b/i;
  const ACTEURS = /\b(auto_ia|manuelle_dev|manuelle_utilisateur)\b/;
  const HUMAINS = /\b(manuelle_dev|manuelle_utilisateur)\b/;

  // Une action déclarée ABSENTE (« aucune action manuelle_utilisateur ») n'est pas une action :
  // la loi transverse n° 3 exige qu'on la DISE, pas qu'on la justifie.
  const groupes8 = actionsGroupees(bActions)
    .filter((g) => !MOTIFS_ABSENCE.test(g.replace(/^\s*[-*]\s+/, "").slice(0, 40)));

  const juger8 = (regle, cible, predicat, siKo, siOk) => {
    const concernes = groupes8.filter((g) => cible.test(g));
    if (!concernes.length) return ok(regle, `aucune action concernée — ${siOk}`);
    const fautifs = concernes.filter((g) => !predicat(g));
    fautifs.length
      ? ko(regle, `${fautifs.length} action(s) sur ${concernes.length} — ${siKo} Ex. : ${fautifs[0].replace(/\s+/g, " ").trim().slice(0, 110)}`)
      : ok(regle, `${concernes.length} action(s) concernée(s) — ${siOk}`);
  };

  juger8("S11", /\bauto_ia\b/, (g) => MOTIFS_IA.test(g),
    "une action `auto_ia` listée en RESTE sans motif de non-exécution : la voie automatisée est le défaut, " +
    "donc ce qui n'a pas été fait se justifie. Vocabulaire : gate_gouvernance, dependance_bloc_3, garde_fou, borne_atteinte, dependance_externe, hors_mandat.",
    "chaque action `auto_ia` non exécutée porte son motif");

  juger8("S12", HUMAINS, (g) => MOTIFS_HUMAIN.test(g),
    "une action laissée à l'humain sans raison d'impossibilité IA — loi transverse n° 5. " +
    "Vocabulaire : acces, decision, depense, presence, irreversible (non accentués).",
    "chaque action humaine porte sa raison d'impossibilité");

  // Le nom d'acteur est retiré avant la mesure : `manuelle_dev` est lui-même un span de code, et
  // le laisser rendrait la règle satisfaite par sa propre étiquette — la boucle la plus bête.
  juger8("S13", HUMAINS, (g) => _LOCALISATEURS.test(g.replace(ACTEURS, " ").replace(/`?\b(auto_ia|manuelle_dev|manuelle_utilisateur)\b`?/g, " ")),
    "une action laissée à l'humain sans chemin, commande ni libellé d'écran : le lecteur doit rouvrir le projet " +
    "pour savoir ce qu'on lui demande — c'est le coût que cette règle existe pour supprimer.",
    "chaque action humaine est exécutable telle quelle");

  // 01/09 — LE SÉLECTEUR D'UNE ACTION N'EST PAS UN IDENTIFIANT DE REGISTRE, et S14 les
  // confondrait comme S15 confondait « D-10 » avec un identifiant nu le 30/08 : `ID_STABLE`
  // reconnaît « une à quatre majuscules, un tiret, deux à quatre chiffres », donc `A-10` en est
  // un pour elle. Une action numérotée A-10 et SANS identifiant de registre passerait alors S14
  // par son seul sélecteur — la règle serait satisfaite par l'étiquette que S33 vient d'imposer,
  // et deux restitutions cesseraient de se comparer sans que rien ne crie. Le sélecteur est donc
  // retiré AVANT la mesure, exactement comme le nom d'acteur l'est pour S13.
  juger8("S14", ACTEURS, (g) => ID_STABLE.test(g.replace(/\bA\s*-?\s*\d{1,2}\b/g, " ")) || DECLAREE_NEUVE.test(g),
    "une action sans identifiant stable ni mention `neuve` : deux restitutions successives ne se comparent pas, " +
    "et la même ligne se re-sert d'une liste à l'autre.",
    "chaque action porte un identifiant stable ou se déclare neuve");

  // ---- S33 (01/09/2026) — UNE ACTION SE DÉSIGNE AUSSI, ET PAS DANS LA MÊME SUITE QUE LES
  // DÉCISIONS -----------------------------------------------------------------------------
  //
  // LE RETOUR EST LA MESURE, mot pour mot : « Il y a un problème de numérotation entre les
  // décisions et les prochaines actions. Tu confonds une fois l'un et une fois l'autre. Ici le 3
  // était pour les prochaines actions. » Le lecteur avait répondu « 3 » en désignant une action
  // du bloc 8 ; la réponse a été lue comme la décision 3 du bloc 3. Le message n'était pas
  // ambigu pour lui : il l'était pour qui devait le relire.
  //
  // POURQUOI S30 NE POUVAIT PAS LE VOIR, et c'est le même angle mort qu'elle corrigeait au bloc 3
  // huit jours plus tôt. S30 rend une décision SÉLECTIONNABLE — elle exige un numéro et sa
  // distinction — mais elle ne regarde qu'un seul bloc. Or une restitution porte DEUX listes
  // numérotées, et rien ne les distinguait : deux suites d'entiers, dans le même message, avec la
  // même écriture. Un numéro n'est un sélecteur que s'il désigne UNE chose ; deux familles qui
  // partagent leur numérotation en désignent deux, et le lecteur ne peut pas lever l'ambiguïté
  // puisqu'il répond en deux caractères — c'est précisément ce que le choix fermé lui promet.
  //
  // CE QUE COÛTE L'AMBIGUÏTÉ, et c'est plus cher que l'absence de numéro : un bloc non numéroté
  // se voit et fait rédiger en prose (S30) ; deux blocs numérotés PAREIL ne se voient pas, et la
  // mauvaise ligne est traitée en silence, avec l'air d'avoir obéi. Le défaut ne se découvre
  // qu'au tour suivant, quand le lecteur constate qu'on a répondu à côté.
  //
  // LA RÈGLE : le sélecteur NOMME SA FAMILLE. Une décision s'écrit « D-N » (ou « Décision N »),
  // une action « A-N » (ou « Action N ») ; un numéro NU — « 3. », « 3) » — n'appartient à aucune
  // des deux et cesse d'être admis, des deux côtés. C'est le durcissement que S30 reçoit le même
  // jour : elle acceptait « 1. » et « 1) », et cette tolérance est exactement la porte par
  // laquelle les deux suites se sont confondues.
  //
  // DOMAINE identique à S14 — les groupes du bloc 8 qui portent un nom d'acteur. Une ligne de
  // prose du bloc 8 (la clause qui justifie l'ordre, par exemple) n'est pas une action et ne se
  // numérote pas. En TABLEAU, le sélecteur est cherché EN TÊTE DE CELLULE, dans n'importe
  // laquelle : imposer la première colonne serait imposer une typographie, ce que TF-0568
  // interdit depuis le 24/08.
  //
  // AVERTISSANTE, comme toute règle neuve depuis la v2.5.0.
  const RE_SELECTEUR_ACTION = /^(?:\*\*|`|\s)*(?:action\s*(?:n[°ºo]\s*)?|A\s*-?\s*)(\d{1,2})\b/i;
  const selecteurDAction = (ligne) => {
    const candidats = /^\s*\|/.test(ligne)
      ? ligne.split("|").map((c) => c.trim()).filter(Boolean)
      : [ligne.replace(/^\s*[-*]\s+/, "")];
    for (const c of candidats) {
      const m = RE_SELECTEUR_ACTION.exec(c);
      if (m) return m[1];
    }
    return null;
  };
  // Le même découpage qu'`actionsGroupees`, mais qui CONSERVE la ligne d'origine à côté du groupe :
  // le groupe sert à décider si c'est une action (il porte l'acteur, et pour un tableau il porte
  // son en-tête) ; la LIGNE seule sert à lire le sélecteur, sinon l'en-tête d'un tableau nommant
  // sa colonne « A-N » vaudrait sélecteur pour toutes ses lignes.
  const actionsAvecLeurLigne = (t) => {
    const sortie = [];
    let dernier = null;
    for (const ligne of t.split("\n")) {
      if (/^\s*\|/.test(ligne)) continue;
      if (/^[-*]\s+\S/.test(ligne)) { dernier = { ligne, groupe: ligne }; sortie.push(dernier); }
      else if (dernier && /^\s+\S/.test(ligne)) dernier.groupe += " " + ligne.trim();
    }
    const entetes = entetesDeTableau(t);
    const entete = entetes.length ? entetes[0] : "";
    for (const l of lignesDeDonnees(t)) sortie.push({ ligne: l, groupe: entete + " " + l });
    return sortie;
  };
  {
    const actions33 = actionsAvecLeurLigne(bActions)
      .filter((a) => !MOTIFS_ABSENCE.test(a.groupe.replace(/^\s*[-*]\s+/, "").slice(0, 40)))
      .filter((a) => ACTEURS.test(a.groupe));
    if (!actions33.length) {
      ok("S33", "aucune action à désigner — bloc vide déclaré, ou aucun acteur nommé (S6)");
    } else {
      const selecteurs = actions33.map((a) => selecteurDAction(a.ligne));
      const sans = actions33.filter((a, i) => selecteurs[i] === null);
      const poses = selecteurs.filter(Boolean);
      const doublons = poses.filter((n, i) => poses.indexOf(n) !== i);
      if (sans.length) {
        ko("S33", `${sans.length} action(s) sur ${actions33.length} SANS SÉLECTEUR « A-N » — le lecteur a répondu « 3 » ` +
          "en désignant une action, et le « 3 » a été lu comme la décision 3. Deux listes numérotées dans le même message " +
          "ne se distinguent que si leur sélecteur NOMME sa famille : « A-1 » pour une action, « D-1 » pour une décision. " +
          `Formes admises : « **A-1** — », « A1 », « Action 1 ». Ex. : ${sans[0].ligne.replace(/\s+/g, " ").trim().slice(0, 110)}`);
      } else if (doublons.length) {
        ko("S33", `sélecteur(s) d'action en DOUBLE : ${[...new Set(doublons)].map((n) => `A-${n}`).join(", ")} — ` +
          "deux actions portant le même sélecteur ne se désignent pas mieux qu'aucune.");
      } else {
        ok("S33", `${actions33.length} action(s), chacune désignée et distincte (${poses.map((n) => `A-${n}`).join(", ")})`);
      }
    }
  }

  // ---- S34 à S37 (02/09/2026, lots du produit 02 — TF-0766, TF-0775, TF-0779) ------------------
  //
  // S34 — UNE ACTION LAISSÉE À L'HUMAIN NE LUI DEMANDE PAS D'ÉCRIRE À LA PLACE DE L'IA. Le fait :
  // une session a demandé de « coller un jeton sur la ligne GITHUB_JETON= déjà présente », ligne qui
  // n'existait pas ; deux heures plus tard une restitution annonçait des lignes « préparées »
  // inexistantes. Créer une ligne, ajouter une variable, écrire dans un fichier est un geste d'agent
  // (loi transverse n° 5 : la voie automatisée est le défaut) ; ce qui reste à l'humain est la
  // VALEUR secrète, jamais l'écriture. Les mots du geste d'écriture dans une action
  // manuelle_utilisateur sont donc un défaut — sauf si la ligne porte un motif `acces` prouvé (S21).
  {
    const bActions = bloc(texte, BLOCS[7][0]) || "";
    const humaines = puces(bActions).concat(bActions.split("\n").filter((l) => /^\s*\|/.test(l)))
      .filter((l) => /\bmanuelle_utilisateur\b/.test(l));
    const ECRITURE = /\b(cr[ée]er|ajouter|[ée]crire dans|coller|ins[ée]rer|renseigner)\b[^.;|]{0,60}\b(ligne|variable|fichier|cl[ée]|entr[ée]e|section)\b/i;
    const fautives = humaines.filter((l) => ECRITURE.test(l) && !/\bacces\b/.test(l));
    fautives.length
      ? ko("S34", `${fautives.length} action(s) manuelle_utilisateur demandent à l'humain de CRÉER, AJOUTER ou ÉCRIRE une ligne, une variable ou un fichier — c'est un geste d'agent (loi n° 5) ; ce qui lui reste est la valeur, jamais l'écriture : « ${fautives[0].trim().slice(0, 90)} »`)
      : ok("S34", "aucune action humaine ne demande un geste d'écriture que l'IA peut faire");
  }
  // S35 — UNE PREUVE DU BLOC 4 EST UNE SORTIE EXÉCUTÉE, JAMAIS UN RENVOI À UNE ACTION. « Préparé »,
  // « prêt à coller », « voir A-2 » ne prouvent rien : ils annoncent. Le fait du 02/09 : des lignes
  // « préparées » qui n'existaient pas, annoncées au bloc 4 d'une restitution.
  {
    const bTraite = bloc(texte, BLOCS[3][0]) || "";
    const renvois = puces(bTraite).filter((l) => /(pr[ée]par[ée]e?s?\b|pr[êe]te?s? [àa] (coller|poser|copier)|\bvoir A-\d+)/i.test(l) && !_JETONS.test(l));
    renvois.length
      ? ko("S35", `${renvois.length} puce(s) du bloc 4 ne PROUVENT pas, elles ANNONCENT (« préparé », « voir A-N ») — une preuve est une sortie exécutée, un verdict, un compteur : « ${renvois[0].trim().slice(0, 90)} »`)
      : ok("S35", "aucune puce du bloc 4 ne remplace sa preuve par un renvoi à une action");
  }
  // S36 — UN LIVRABLE HTML RESTITUÉ PORTE LE VERDICT DE LA CRITIQUE D'IMPLÉMENTATION. Le routage
  // « juger le rendu visuel → critique-le-design » est écrit au CLAUDE.md de tout produit ; trois
  // livraisons du 02/09 sont parties sans l'invoquer, revues « à l'œil » par la session auteur. Une
  // restitution qui cite une page .html livrée (hors fixture, gabarit, boilerplate) et ne porte
  // aucun verdict de critique d'implémentation est en défaut.
  {
    const zones = [bloc(texte, BLOCS[3][0]) || "", bloc(texte, /(^|\n)#{1,4}\s*9[.)]?\s*traces?/i) || ""].join("\n");
    const pagesLivrees = (zones.match(/[\w\-. \/\\]+\.html?\b/gi) || []).filter((p) => !/fixture|gabarit|boilerplate|template|temoin|\.oracles/i.test(p));
    const verdict = /(critique-le-design|critique d'impl[ée]mentation|revue graphique|revue visuelle|verdict design)/i.test(texte);
    pagesLivrees.length && !verdict
      ? ko("S36", `${pagesLivrees.length} page(s) HTML citée(s) comme livrées sans AUCUN verdict de critique d'implémentation (forge-design) dans la restitution — le routage « juger le rendu visuel » n'a pas été joué : ${pagesLivrees.slice(0, 2).join(", ")}`)
      : ok("S36", pagesLivrees.length ? "les pages HTML livrées portent un verdict de critique d'implémentation" : "aucune page HTML livrée citée");
  }
  // S37 — UNE CORRECTION SE RESTITUE AVEC SON CONTRÔLE ROUGE → VERT, SUR LA CLASSE. Le fait du
  // 02/09 : hauteur de ligne corrigée en cachant la période, largeur corrigée pour les tableaux
  // mais pas pour la prose, débordement reclassé acceptable — trois symptômes, aucune classe.
  {
    const bTraite = bloc(texte, BLOCS[3][0]) || "";
    const corrections = puces(bTraite).filter((l) => /\bcorrig[ée]/i.test(l));
    const sansClasse = corrections.filter((l) => !/(rouge|vert|fixture|recette|classe|self-test|banc|double sens|\d+\s*\/\s*\d+)/i.test(l));
    sansClasse.length
      ? ko("S37", `${sansClasse.length} correction(s) restituée(s) sans contrôle rouge → vert ni classe nommée — une correction après retour humain traite le symptôme, jamais la classe : « ${sansClasse[0].trim().slice(0, 90)} »`)
      : ok("S37", corrections.length ? "chaque correction restituée porte son contrôle rouge → vert ou nomme sa classe" : "aucune correction restituée");
  }

  // ---- S21 (TF-0526, 23/08) — « acces » et « presence » se PROUVENT, ils ne s'affirment pas ---
  //
  // LA MESURE QUI A FAIT NAÎTRE LA RÈGLE tient dans la COMPARAISON de deux cas du même relevé,
  // traités différemment le même jour.
  //   · CAS HONNÊTE — pour modifier une application d'authentification : l'appel a été TENTÉ et
  //     mesuré (« HTTP 403 Authorization_RequestDenied »), puis vérifié que le compte n'a aucun
  //     rôle d'annuaire. L'attribution à l'humain était fondée, et la trace le prouvait.
  //   · CAS FAUTIF — pour une porte d'approbation bloquée depuis 26 heures : le blocage a été
  //     AFFIRMÉ et le sujet renvoyé à l'humain, alors que la même classe de contrainte avait déjà
  //     été levée DEUX FOIS le jour même, avec l'accord du destinataire. Le motif « decision »
  //     était vrai ; L'ATTRIBUTION ÉTAIT FAUSSE.
  //
  // S12 ne peut pas voir la différence : elle lit un jeton de vocabulaire fermé, pas une tentative.
  // Le destinataire a contesté sept lignes sur neuf de ce relevé, dont plusieurs par « pourquoi ce
  // n'est pas déjà fait par l'IA ». Le coût d'une attribution non éprouvée n'est donc pas
  // théorique : c'est un aller-retour, et la confiance dans la liste entière.
  //
  // PORTÉE VOLONTAIREMENT ÉTROITE : seuls `acces` et `presence` sont concernés — ce sont les deux
  // motifs qui affirment un FAIT DU MONDE, donc les deux qui se mesurent. `decision`, `depense` et
  // `irreversible` relèvent d'un arbitrage, et exiger d'« essayer » une décision n'aurait aucun sens.
  const MOTIFS_MESURABLES = /\b(acces|presence)\b/;
  // La trace : un code de réponse, un message d'erreur, une sortie de commande. On exige un jeton
  // de TENTATIVE **et** une preuve au sens de S8 — la fonction est déjà écrite, comme le lot le
  // proposait. Les deux ensemble, parce qu'un chemin de fichier seul satisferait `preuve()` sans
  // rien prouver d'une tentative.
  // DEUX motifs, et la séparation n'est pas cosmétique : un CODE technique est sensible à la
  // casse, un mot français ne l'est pas. Un premier jet mettait tout dans une seule expression
  // avec le drapeau insensible, et le motif destiné aux codes du genre ENOTFOUND matchait alors
  // le mot « ecran ». La règle rendait PASS sur une action sans aucune trace : elle était MORTE
  // EN CROYANT VIVRE, et c'est le pire état pour un contrôle — il rassure au lieu de juger.
  const TRACE_CODE = /(HTTP\s*\d{3}|\b\d{3}\s+(?:Forbidden|Unauthorized|Denied|Conflict)\b|\bE[A-Z]{4,}\b|Authorization_\w+)/;
  const TRACE_MOT = /(exit\s*\d|permission denied|access denied|\btent[ée]e?s?\b|\bessay[ée]e?s?\b|\brefus[ée]e?s?\b|\bmesur[ée]e?s?\b)/i;
  const TRACE_TENTATIVE = { test: (g) => TRACE_CODE.test(g) || TRACE_MOT.test(g) };
  juger8("S21", MOTIFS_MESURABLES, (g) => TRACE_TENTATIVE.test(g) && preuve(g),
    "un motif `acces` ou `presence` SANS trace mesurée de la tentative : l'impossibilité est affirmée, " +
    "pas éprouvée. Ces deux motifs affirment un FAIT DU MONDE, donc ils se mesurent — un code de " +
    "réponse, un message d'erreur, une sortie de commande, dans le même groupe de puce. " +
    "`decision`, `depense` et `irreversible` relèvent d'un arbitrage et ne sont pas concernés.",
    "chaque motif `acces`/`presence` porte la trace mesurée de sa tentative");

  // ---- S22 (TF-0546, 24/08) — un NÉGATIF sur une ressource externe ne se prononce pas d'une
  // seule sonde ----------------------------------------------------------------------------------
  //
  // DEUX OCCURRENCES DE FORME IDENTIQUE DANS UNE MÊME SESSION, et c'est la répétition qui fait la
  // règle. (1) Une URL testée en HEAD a rendu 404 ; « la page est morte » a été annoncé. Un GET
  // répondait 200 — l'hébergeur renvoie 404 sur HEAD pour ses pages applicatives. (2) Un champ
  // d'API a rendu UN enregistrement DNS ; « non, le TXT n'a pas été mis » a été répondu à une
  // question directe. La console en exigeait deux, le second vivant dans un autre champ du MÊME
  // type — champs que l'introspection aurait énumérés, et l'introspection avait DÉJÀ servi plus tôt
  // dans la session. Ce n'était donc pas une lacune de connaissance : c'était un DÉCLENCHEUR
  // MANQUANT.
  //
  // CE QUI REND CES DEUX CAS INÉVITABLES SANS RÈGLE : aucune des deux réponses ne portait de
  // marqueur d'exhaustivité. Une liste ne dit pas qu'elle est complète ; un 404 ne dit pas quelle
  // méthode l'a produit. L'absence lue dans une source unique est donc une absence DANS CETTE
  // SOURCE, jamais une absence dans le monde — et la restitution la transforme en fait.
  //
  // LA FORME EXIGÉE : soit une SECONDE sonde de nature différente est nommée dans la même phrase,
  // soit l'énoncé se formule en « cette source me montre X » plutôt qu'en « il n'y a pas de X ».
  // Non bloquant : la règle apprend une tournure, elle ne refuse pas un travail juste.
  const NEGATIF_EXTERNE = /(n.existe pas|n.est pas (?:mis|pos[ée]|cr[éeé]{1,2}|configur[ée]|d[ée]clar[ée])|il n.y a (?:pas|aucun)|aucun(?:e)? (?:enregistrement|entr[ée]e|r[ée]ponse|trace|jeton|domaine|route|champ)|(?:page|url|ressource|route|endpoint) (?:morte|inexistante|absente)|\b404\b|pas (?:de|d.) (?:TXT|CNAME|enregistrement))/i;
  const SUJET_EXTERNE = /(API|DNS|TXT|CNAME|URL|https?:|GraphQL|OpenAPI|console|h[ée]bergeur|fournisseur|domaine|endpoint|OVH|Railway|Cloudflare|Google|Azure|GitHub)/i;
  const DEUX_SONDES = /(HEAD\s*(?:et|puis|\+)\s*GET|GET\s*(?:et|puis|\+)\s*HEAD|deux (?:sondes|m[ée]thodes|sources|appels)|introspection|seconde sonde|autre (?:m[ée]thode|point d.entr[ée]e|r[ée]solveur)|confirm[ée] par|recoup[ée])/i;
  const FORMULE_PRUDENTE = /(cette source (?:me )?montre|d.apr[èe]s cette source|la source interrog[ée]e (?:ne )?(?:montre|rend)|au vu de cette seule)/i;
  {
    const phrases = texte.split(/(?<=[.!?;])\s+|\n/).map((x) => x.trim()).filter(Boolean);
    const risquees = phrases.filter((x) => NEGATIF_EXTERNE.test(x) && SUJET_EXTERNE.test(x));
    const nues = risquees.filter((x) => !DEUX_SONDES.test(x) && !FORMULE_PRUDENTE.test(x));
    if (!risquees.length) ok("S22", "aucun négatif prononcé sur une ressource externe — rien à corroborer");
    else if (nues.length) ko("S22", `${nues.length} négatif(s) sur ${risquees.length} prononcé(s) sur une ressource EXTERNE depuis une seule sonde : ` +
      "une liste ne dit pas qu'elle est complète, un 404 ne dit pas quelle méthode l'a produit. Nommer une SECONDE sonde de nature différente, " +
      `ou écrire « cette source me montre X » plutôt que « il n'y a pas de X ». Ex. : ${nues[0].replace(/\s+/g, " ").slice(0, 110)}`);
    else ok("S22", `${risquees.length} négatif(s) externe(s), chacun corroboré par une seconde sonde ou formulé comme une lecture de source`);
  }

  // ---- S25 (TF-0606, 25/08) — une INCAPACITE affirmee nomme les CHEMINS essayes ---------------
  //
  // TROISIEME SOEUR DE S22, ET DISTINCTE DES DEUX AUTRES. S22 vise un negatif sur une RESSOURCE
  // externe (« il n'y a pas de TXT »), S24 une recherche par NOM qui ne trouve rien. Ici l'objet
  // n'est ni une ressource ni un catalogue : c'est une CAPACITE — « je ne peux pas deployer d'ici ».
  //
  // LE FAIT, de premiere main. Le CLI d'un hebergeur a rendu « Unauthorized. Please run login
  // again » ; son verbe de connexion ouvre un navigateur, donc hors de portee. Conclusion ecrite a
  // l'humain : « je ne peux pas deployer d'ici ». TROIS MINUTES plus tard, sur signalement de
  // l'humain, l'API GraphQL du meme hebergeur repondait DU PREMIER COUP avec un jeton present sur
  // le disque.
  //
  // POURQUOI S21 NE SUFFISAIT PAS, et c'est ce qui justifie une regle de plus : S21 exige la TRACE
  // de la tentative, et la trace etait la — « Unauthorized » est un message d'erreur mesure. Une
  // impossibilite peut donc etre EPROUVEE sur un chemin et FAUSSE sur la capacite. Le CLI n'est pas
  // la capacite de deployer : il en est une PORTE.
  //
  // AGGRAVANT, et il ne se controle pas ici : la documentation qui nommait l'autre porte etait DEJA
  // CHARGEE dans le contexte au moment de la conclusion. Ce n'etait pas une lacune de connaissance,
  // c'etait un declencheur manquant — meme diagnostic que S22.
  //
  // LA FORME EXIGEE : soit DEUX chemins au moins sont nommes, soit l'enonce declare qu'un seul
  // existe. Non bloquant : la regle apprend a chercher la seconde porte, elle ne refuse pas un
  // travail juste.
  // Le motif ne retient que les formulations SANS AMBIGUITE sur l'acces. « hors de portee » en
  // a ete RETIRE apres mesure : la fixture conforme du hook porte « hors de portee de ce
  // correctif », qui declare un PERIMETRE et non une incapacite d'agir. Une regle qui accuse un
  // travail juste se fait desactiver — et celle-ci apprend une tournure, elle ne refuse rien.
  const INCAPACITE = /(je ne (?:peux|pourrai) pas|impossible (?:depuis|d'ici)|pas (?:possible|faisable) (?:d'ici|depuis)|incapable de|bloqu[ée]{1,2} (?:pour|par) l'acc[èe]s)/i;
  const PLUSIEURS_CHEMINS = /(deux (?:chemins|voies|acc[èe]s|portes)|CLI (?:et|puis|\+) API|API (?:et|puis|\+) CLI|autre (?:chemin|voie|porte|point d'entr[ée]e|acc[èe]s)|ni .{2,40} ni |seule (?:voie|porte|acc[èe]s)|unique (?:chemin|voie|acc[èe]s)|aucun autre chemin)/i;
  {
    const phrases = texte.split(/(?<=[.!?;])\s+|\n/).map((x) => x.trim()).filter(Boolean);
    const risquees = phrases.filter((x) => INCAPACITE.test(x));
    const nues = risquees.filter((x) => !PLUSIEURS_CHEMINS.test(x));
    if (!risquees.length) ok("S25", "aucune incapacite affirmee — rien a corroborer");
    else if (nues.length) ko("S25", `${nues.length} incapacite(s) sur ${risquees.length} affirmee(s) sans nommer les CHEMINS essayes : ` +
      "un outil qui refuse n'est pas une capacite absente — un CLI non authentifie ne dit rien de l'API du meme service. " +
      "Nommer au moins DEUX chemins, ou declarer qu'un seul existe (« seule voie », « aucun autre chemin »). " +
      `Ex. : ${nues[0].replace(/\s+/g, " ").slice(0, 110)}`);
    else ok("S25", `${risquees.length} incapacite(s) affirmee(s), chacune adossee aux chemins essayes`);
  }

  // ---- S26 (TF-0617, 25/08) — un contrôle qui confirme une écriture NOMME le chemin ABSOLU
  // qu'il a vérifié -------------------------------------------------------------------------------
  //
  // LE FAIT, et c'est le plus instructif du lot qui l'a fait naître. Un agent devait ajouter deux
  // lignes au `.env` d'un produit. Il l'a écrit sans chemin absolu, depuis un répertoire de travail
  // qui n'était pas celui qu'il croyait — le fichier a été CRÉÉ dans le dossier parent du dépôt, et
  // un humain y a collé une clé d'API réelle. Puis il a VÉRIFIÉ, sincèrement :
  //
  //     git check-ignore -v .env        →  .gitignore:3:.env   .env
  //     git status --short | grep .env  →  (rien)
  //
  // LES DEUX RÉPONSES SONT VRAIES. Elles portent sur le `.env` du DÉPÔT, parce que la commande a
  // tourné depuis le dépôt. Le fichier écrit, lui, était ailleurs. *Le contrôle était juste ; son
  // objet était faux.* Il a rendu un vert sur un fichier que personne n'avait touché, et l'agent a
  // rapporté à l'humain que sa clé était en sécurité.
  //
  // C'EST PIRE QU'UN CONTRÔLE ABSENT : un contrôle absent laisse le doute, un contrôle qui se trompe
  // d'objet PRODUIT DE LA CONFIANCE. Et il est indétectable à la relecture — les deux commandes sont
  // correctes, la sortie est correcte, seule la variable cachée (le répertoire de travail) diffère
  // entre l'écriture et la vérification.
  //
  // LA RÈGLE EST S17 TRANSPOSÉE DU TEXTE AU SYSTÈME DE FICHIERS. S17 dit qu'un renvoi nomme son
  // SUJET et jamais une position, parce qu'une position désigne autre chose au message suivant. Ici
  // c'est la même chose : un chemin RELATIF désigne autre chose selon d'où on parle. « Le `.env` est
  // bien gitignoré » n'est pas une preuve ; « `c:\…\Produit-11\.env` est couvert par
  // `.gitignore:3` » en est une — et elle serait tombée en défaut TOUTE SEULE, parce que le lecteur
  // aurait lu un chemin qui n'était pas le sien. Le bénéfice est double : la vérification devient
  // opposable, et LE LECTEUR PEUT LA CONTREDIRE, ce qui est le seul contrôle qui ne se trompe jamais
  // deux fois de la même façon.
  //
  // NON BLOQUANTE, comme S22 et S24 : la règle apprend une tournure, elle ne refuse pas un travail.
  // LE RESSERRAGE, FAIT AVANT LIVRAISON ET POUR LA DEUXIÈME FOIS DE LA JOURNÉE. Le premier jet
  // acceptait « est bien couvert » comme une confirmation d'écriture. Joué sur les 336 documents
  // de `output\`, il a rendu 15 constats — TOUS FAUX : dans ce corpus, « couvert » veut dire
  // « couvert par un oracle » (« (a) est couvert par les oracles existants »), jamais « couvert
  // par un .gitignore ». Une règle à 0 % de précision sur le corpus réel n'est pas un contrôle.
  //
  // La forme retenue distingue donc DEUX familles de marqueurs :
  //   · les AUTOSUFFISANTS — `check-ignore`, `gitignore`, `git status` ne parlent que de fichiers ;
  //   · les FAIBLES — « a bien été créé », « est bien ignoré/protégé/en sécurité » — qui exigent
  //     EN PLUS un désignateur de fichier dans la même phrase, sans quoi ils attrapent la prose.
  // `git status` a QUITTÉ les marqueurs autosuffisants, et c'est le second resserrage. Le corpus
  // l'emploie massivement pour prouver que RIEN n'a été écrit — « `git status` de forge-data
  // inchangé, aucun fichier créé dans la forge ». C'est l'inverse exact du fait que cette règle
  // traque, et l'accuser reviendrait à punir la preuve de non-écriture, qui est la bonne pratique.
  // Cinq constats sur cinq étaient de cette forme.
  const MARQUEUR_FORT = /\b(check-ignore|gitignor)\b/i;
  //: Une déclaration d'ABSENCE n'est pas une confirmation d'écriture.
  const DECLARE_UNE_ABSENCE = /\b(inchang[ée]|aucun(?:e)?\s+(?:fichier|[ée]criture|d[ée]p[ôo]t)|propre\b|rien n(?:'|’)a|hors ce rapport)/i;
  const MARQUEUR_FAIBLE = /\ba (?:bien )?(?:[ée]t[ée] )?(?:cr[ée]{1,2}|[ée]crit|ajout[ée]|d[ée]pos[ée]|enregistr[ée])\b|\best (?:bien )?(?:ignor[ée]|prot[ée]g[ée]|en s[ée]curit[ée])\b/i;
  //: Un désignateur de FICHIER, et pas n'importe quel objet : la famille des porteurs de secrets
  //: et de configuration, plus le mot « fichier » lui-même. C'est ce qui empêche « la règle a été
  //: créée » ou « le contrôle est bien protégé » de déclencher.
  const DESIGNE_UN_FICHIER = /\.env\b|\.gitignore\b|\.(?:pem|key|npmrc)\b|\bcredentials?\b|\bsecrets?\b|\bfichier\b/i;
  const CONFIRME_UNE_ECRITURE = {
    // La déclaration d'ABSENCE est écartée d'abord : « aucun fichier `.env` n'a été créé » porte le
    // marqueur et le désignateur, et dit pourtant l'inverse de ce que la règle traque.
    test: (x) => !DECLARE_UNE_ABSENCE.test(x)
      && (MARQUEUR_FORT.test(x) || (MARQUEUR_FAIBLE.test(x) && DESIGNE_UN_FICHIER.test(x))),
  };
  //: Un chemin ABSOLU, sous les deux formes du parc : Windows (`c:\…`) et POSIX (`/…`).
  const CHEMIN_ABSOLU = /\b[A-Za-z]:[\\/][^\s`»]{3,}|(?:^|[\s`(])\/[A-Za-z_][\w./-]{3,}/;
  {
    const phrases = texte.split(/(?<=[.!?;])\s+|\n/).map((x) => x.trim()).filter(Boolean);
    const risquees = phrases.filter((x) => CONFIRME_UNE_ECRITURE.test(x));
    const nues = risquees.filter((x) => !CHEMIN_ABSOLU.test(x));
    if (!risquees.length) ok("S26", "aucune écriture confirmée — rien à localiser");
    else if (nues.length) ko("S26", `${nues.length} confirmation(s) d'écriture sur ${risquees.length} sans le chemin ABSOLU vérifié : ` +
      "un chemin relatif désigne autre chose selon d'où on parle, et un contrôle qui se trompe d'objet PRODUIT de la confiance " +
      "au lieu du doute. Mesuré le 25/08 : `git check-ignore .env` a rendu VRAI sur le `.env` du dépôt alors que le fichier écrit " +
      "était dans le dossier parent, avec une clé d'API réelle — le contrôle était juste, son objet était faux. Citer le chemin " +
      `absolu rend la vérification opposable, et surtout CONTREDISIBLE par le lecteur. Ex. : ${nues[0].replace(/\s+/g, " ").slice(0, 110)}`);
    else ok("S26", `${risquees.length} confirmation(s) d'écriture, chacune citant le chemin absolu vérifié`);
  }

  // ---- S27 (TF-0632, 25/08) — l'IDENTITÉ de deux artefacts s'établit par EMPREINTE, jamais par
  // une métadonnée -------------------------------------------------------------------------------
  //
  // QUATRIÈME SŒUR DE S22, et l'objet est encore différent des trois autres. S22 vise un négatif
  // sur une RESSOURCE externe, S24 une recherche par NOM, S25 une CAPACITÉ. Ici c'est une
  // IDENTITÉ : « ces deux fichiers sont le même ».
  //
  // LE FAIT, remonté par un produit et payé en PRODUCTION. Un site porte deux logos vectoriels
  // pour deux contextes : `logo.svg` coloré pour les fonds clairs, `logo-white.svg` entièrement
  // blanc pour le bandeau sombre. Les deux pesaient EXACTEMENT 19 922 octets et portaient la même
  // date — un `ls -la` les affichait sur deux lignes rigoureusement parallèles. Conclusion écrite à
  // l'exploitant comme un constat : c'est le même fichier dupliqué. Puis le contenu coloré a été
  // écrit dans les DEUX. Résultat servi en production : le logo du bandeau rendu en `#2d4047` sur
  // un fond `#2d4047` — un ratio de contraste de 1,0, un fantôme.
  //
  // POURQUOI LA COÏNCIDENCE N'A RIEN D'ÉTONNANT, et c'est ce qui rend l'indice si traître : ce sont
  // deux exports du même dessin où seule la valeur hexadécimale des couleurs change, à longueur de
  // chaîne égale. Les empreintes, elles, les séparaient en une seconde : `985f9811` contre
  // `395285e8`.
  //
  // LA FORME DE LA RÈGLE. Taille, date, nom et nombre de lignes sont des INDICES DE DIVERGENCE :
  // ils prouvent que deux artefacts diffèrent quand ils diffèrent, jamais qu'ils coïncident quand
  // ils coïncident. Une identité affirmée s'adosse donc à une empreinte, un `diff`, ou une
  // comparaison de contenu — trois choses dont le coût est nul.
  //
  // NON BLOQUANTE, comme ses trois sœurs : elle apprend un réflexe, elle ne refuse pas un travail.
  //
  // LE RESSERRAGE, FAIT AVANT LIVRAISON. Le premier jet déclenchait sur la seule présence d'un
  // indice de métadonnée. Joué sur les documents réels du dépôt, il accusait des phrases qui
  // CITENT une taille sans rien conclure (« un fichier `null` de 1892 octets à la racine ») —
  // c'est-à-dire l'usage normal et juste de la métadonnée. La règle exige donc la CONJONCTION :
  // une identité affirmée ET un indice de métadonnée dans la même phrase, sans empreinte. C'est
  // l'inférence qui est fautive, pas le fait de mesurer une taille.
  //: Affirmer que deux artefacts n'en sont qu'un. « copie conforme » en est EXCLU : le parc
  //: l'emploie comme un MODE de propagation (`HERITAGE.json`), pas comme une conclusion.
  const IDENTITE_AFFIRMEE = /\b(le m[êe]me fichier|m[êe]me contenu|fichiers? identiques?|sont identiques|un doublon|doublon de|dupliqu[ée]|duplicata|deux fois le m[êe]me)\b/i;
  //: L'indice qui ne prouve rien : ce qu'on lit AUTOUR du fichier, jamais dedans.
  const INDICE_METADONNEE = /\b(m[êe]mes? (?:taille|poids|date|horodatage|nom|nombre de lignes)|taille identique|\d[\d   ]*\s*octets|m[êe]me nombre de (?:lignes|octets))\b/i;
  //: Ce qui, lui, établit l'identité — et dont le coût est nul.
  const EMPREINTE = /\b(empreinte|sha-?\d*|hash|md5|checksum|somme de contr[ôo]le|diff\b|octet par octet|contenu compar[ée]|comparaison de contenu)\b/i;
  {
    const phrases = texte.split(/(?<=[.!?;])\s+|\n/).map((x) => x.trim()).filter(Boolean);
    const risquees = phrases.filter((x) => IDENTITE_AFFIRMEE.test(x) && INDICE_METADONNEE.test(x));
    const nues = risquees.filter((x) => !EMPREINTE.test(x));
    if (!risquees.length) ok("S27", "aucune identité d'artefacts affirmée depuis une métadonnée — rien à établir");
    else if (nues.length) ko("S27", `${nues.length} identité(s) sur ${risquees.length} affirmée(s) depuis une MÉTADONNÉE : ` +
      "taille, date, nom et nombre de lignes prouvent que deux artefacts DIFFÈRENT quand ils diffèrent, jamais qu'ils " +
      "COÏNCIDENT quand ils coïncident. Mesuré le 25/08 : deux logos de 19 922 octets à la même date, tenus pour un seul " +
      "fichier, puis écrasés par le même contenu — un logo `#2d4047` sur fond `#2d4047` servi en production, contraste 1,0. " +
      "Les empreintes les séparaient : 985f9811 contre 395285e8. Citer une empreinte, un `diff` ou une comparaison de " +
      `contenu — le coût en est nul. Ex. : ${nues[0].replace(/\s+/g, " ").slice(0, 110)}`);
    else ok("S27", `${risquees.length} identité(s) affirmée(s), chacune adossée à une empreinte ou une comparaison de contenu`);
  }

  // ---- S28 (TF-0635, 26/08) — METTRE UN OUTIL EN CAUSE EST UN CONSTAT, et se vérifie comme tel
  // ------------------------------------------------------------------------------------------------
  //
  // CINQUIÈME SŒUR DE S22, et l'objet change encore. S22 vise un négatif sur une RESSOURCE, S24 une
  // recherche par NOM, S25 une CAPACITÉ, S27 une IDENTITÉ. Ici : une IMPUTATION — « forge-seo-geo
  // aurait dû le voir ».
  //
  // LE FAIT, remonté par un produit. Une dérive de capacités a été annoncée à l'exploitant, tableau
  // comparatif à l'appui, et l'agent en a tiré qu'un outil de la forge aurait dû la détecter.
  // Vérification faite APRÈS : le fichier incriminé était RIGOUREUSEMENT CONFORME. Ce qui avait été
  // pris pour un minimum commercial était le seuil d'un filtre de recherche — deux notions
  // différentes, légitimement différentes. Il suffisait de suivre l'unique usage de la valeur pour
  // le voir. Résultat : une affirmation fausse livrée à l'exploitant, PUIS retournée contre un outil
  // de la forge sous forme d'une mise en cause infondée.
  //
  // POURQUOI C'EST PIRE QU'UNE ERREUR ORDINAIRE : une mise en cause d'un outil déclenche un travail
  // chez quelqu'un d'autre, et elle entame la confiance dans un contrôle qui, lui, faisait son
  // travail. Un outil accusé à tort finit désactivé « par prudence ».
  //
  // LA FORME EXIGÉE : la phrase qui met un outil en cause porte, dans la même phrase, la trace de
  // ce qui a été vérifié — rejoué, mesuré, exécuté, la sortie citée. Non bloquante, comme ses
  // quatre sœurs : elle apprend un réflexe, elle ne refuse pas un travail.
  //
  // MESURE D'ENTRÉE (N-23), dépôt entier, 387 fichiers et 61 589 phrases : **2** phrases portent
  // une mise en cause de cette forme, et les deux vivent dans des lots ENTRANTS, pas dans une
  // restitution. La règle a donc très peu de cibles — c'est une règle de prévention, et ses
  // fixtures sont ce qui prouve qu'elle fonctionne, puisque le corpus ne le prouvera pas.
  const MISE_EN_CAUSE = /\b(forge-[a-z-]+|l'oracle|le contr[ôo]le|le pan|l'outil|la sonde)\b[^.;!?]{0,90}\b(aurait d[ûu] (?:le |la |les |l')?(?:voir|d[ée]tecter|refuser|attraper)|n'(?:a|ont) pas (?:vu|d[ée]tect[ée]|refus[ée]|attrap[ée])|a laiss[ée] passer|est en d[ée]faut|est fauti[fv])\b/i;
  const VERIFICATION = /\b(v[ée]rifi[ée]|rejou[ée]|mesur[ée]|reproduit|jou[ée] sur|ex[ée]cut[ée]|preuve|sortie|exit \d|constat[ée] par)\b/i;
  {
    const phrases = texte.split(/(?<=[.!?;])\s+|\n/).map((x) => x.trim()).filter(Boolean);
    const risquees = phrases.filter((x) => MISE_EN_CAUSE.test(x));
    const nues = risquees.filter((x) => !VERIFICATION.test(x));
    if (!risquees.length) ok("S28", "aucun outil de l'écosystème mis en cause — rien à corroborer");
    else if (nues.length) ko("S28", `${nues.length} mise(s) en cause sur ${risquees.length} formulée(s) sans la trace de la vérification : ` +
      "une imputation à un outil est un CONSTAT, et se vérifie avant d'être écrite au même titre qu'un défaut. " +
      "Mesuré le 26/08 : un outil accusé de n'avoir pas vu une dérive, alors que le fichier incriminé était " +
      "RIGOUREUSEMENT conforme — deux valeurs comparées sans établir qu'elles mesuraient la même grandeur. " +
      "Un outil accusé à tort finit désactivé « par prudence ». Citer ce qui a été rejoué, mesuré ou exécuté. " +
      `Ex. : ${nues[0].replace(/\s+/g, " ").slice(0, 110)}`);
    else ok("S28", `${risquees.length} mise(s) en cause, chacune adossée à une vérification`);
  }

  // ---- S29 (TF-0661, 26/08) — DÉCLARER UN RISQUE N'EST PAS LE TRAITER -------------------------
  //
  // LE FAIT, et il est d'une netteté rare parce que le run avait tout bien fait sauf la dernière
  // chose. Sa restitution portait, en clair : « La relecture native n'a pas eu lieu. Environ 180
  // chaînes de corps de texte sont concernées, sur des pages publiques. C'est le seul endroit du
  // lot où le risque n'est pas couvert par un oracle. » Le risque était **vu, nommé, chiffré et
  // écrit**. Le run a ensuite poussé, déployé, et attendu.
  //
  // ONZE FAUTES D'ACCORD sont parties en production, et ont été trouvées **une demande de
  // l'exploitant plus tard** — la demande étant, mot pour mot, de faire ce que le run avait dit ne
  // pas avoir fait.
  //
  // LE DÉFAUT N'EST PAS D'AVOIR MANQUÉ LE RISQUE : c'est d'avoir traité **la déclaration du risque
  // comme son traitement**. Même faute de forme que R-45 corrige pour les remarques écartées — une
  // remarque sans verdict est invisible — appliquée ici à un risque sans destinataire.
  //
  // CE QUI EST JUGÉ, et rien de plus : la CONTRADICTION INTERNE. On ne peut pas écrire au bloc 7
  // « rien ne couvre ce risque » et au bloc 8 « aucune action ». L'une des deux phrases est fausse.
  // C'est le seul cas où un oracle peut trancher sans comprendre le risque — et c'est exactement le
  // cas fondateur.
  //
  // CE QUI N'EST PAS JUGÉ : qu'une action PORTE sur le risque déclaré. Rapprocher un risque de
  // l'action qui le traite demanderait de comprendre les deux ; exiger une correspondance par mots
  // ferait accuser des restitutions justes. Un bloc 8 non vide suffit donc — la règle attrape la
  // contradiction, pas la négligence fine.
  const RISQUE_DECOUVERT = /\b(n'est pas couvert|ne sont pas couverts?|rien ne (?:le |la |les )?couvre|aucun (?:oracle|contr[ôo]le|garde-fou) ne (?:le |la |les )?(?:couvre|voit)|n'a pas eu lieu|reste non couvert)\b/i;
  {
    const b7 = bloc(texte, /##\s*7\.\s*Risques/i) || "";
    const b8 = bloc(texte, /##\s*8\.\s*Prochaines actions/i) || "";
    const declares = b7.split(/\n(?=\s*[-*])/).map((x) => x.trim()).filter((x) => RISQUE_DECOUVERT.test(x));
    // Un bloc 8 « vide » au sens de cette règle : aucune ligne d'action numérotée ni pointée.
    const aUneAction = /^\s*(?:\d+\.|[-*])\s+\S/m.test(b8);
    if (!b7) findings.push({ regle: "S29", statut: "SANS_OBJET", message: "aucun bloc de risques — rien à confronter" });
    else if (!declares.length) ok("S29", "aucun risque déclaré non couvert — rien à passer la main");
    else if (aUneAction) ok("S29", `${declares.length} risque(s) déclaré(s) non couvert(s), et le bloc 8 passe la main`);
    else ko("S29", `${declares.length} risque(s) déclaré(s) NON COUVERT(s) et AUCUNE action au bloc 8 : `
      + "on ne peut pas écrire « rien ne couvre ce risque » et « rien n'est à faire » — l'une des deux phrases "
      + "est fausse. Mesuré le 26/08 : un run a écrit « la relecture native n'a pas eu lieu, c'est le seul "
      + "endroit où le risque n'est pas couvert », puis a poussé et attendu ; onze fautes sont parties en "
      + "production et ont été trouvées une demande de l'exploitant plus tard. DÉCLARER UN RISQUE N'EST PAS "
      + `LE TRAITER. Ex. : ${declares[0].replace(/\s+/g, " ").slice(0, 110)}`);
  }

  // ---- S24 (TF-0596, 24/08) — une recherche par NOM qui ne trouve rien n'établit que l'absence
  // du NOM -----------------------------------------------------------------------------------------
  //
  // SŒUR DE S22, ET DÉLIBÉRÉMENT DISTINCTE. S22 traite le négatif prononcé sur une ressource
  // EXTERNE depuis une seule sonde, et son acquittement est une SECONDE SONDE de nature différente.
  // Ici l'objet n'est pas une ressource externe mais un CATALOGUE DE NOMS interrogé par motif, et
  // l'acquittement n'est pas une seconde sonde : c'est une recherche par STRUCTURE. Les mêler
  // aurait donné une règle dont le message ne sait plus quoi demander — et un message qui prescrit
  // la moitié du geste conduit droit à une seconde violation (leçon de TF-0552).
  //
  // DEUX FAUX NÉGATIFS EN UNE JOURNÉE, tous deux rendus comme des faits d'absence.
  // (1) « Aucune table de transcodification » — conclu après avoir cherché DIX motifs de NOM DE
  // TABLE (`%transcod%`, `%corresp%`, `%mapping%`, `%codif%`…) sur trois schémas. La
  // correspondance existait, dans un schéma nommé `dl50` dont les tables s'appellent `customer` et
  // `owner` et dont les COLONNES s'appellent `COD_CLIENT_ALX` — hors d'atteinte des dix motifs, qui
  // portaient tous sur des noms de tables. La conclusion a fondé une demande d'évolution de schéma
  // qu'il a fallu suspendre.
  // (2) Interrogé sur un WORKSPACE nommé `..._D2`, un catalogue au nom contenant `_d2` a été
  // cherché, aucun n'a été trouvé, et « aucun environnement D2 » a été répondu — alors que le
  // nommage d'un workspace et celui de ses catalogues sont INDÉPENDANTS, et que le test ne portait
  // donc pas sur la question posée.
  //
  // CE QUI REND CES DEUX CAS INÉVITABLES SANS RÈGLE, et c'est exactement le mécanisme de S22 sur un
  // autre objet : *une recherche par nom qui ne trouve rien établit que LE NOM cherché n'existe
  // pas, jamais que LA CHOSE cherchée n'existe pas.* Énumérer ses dix motifs — ce que le premier
  // cas faisait scrupuleusement — ne répare rien : dix motifs de la même NATURE partagent le même
  // angle mort.
  //
  // LA FORME EXIGÉE : déclarer la recherche complémentaire par STRUCTURE — chercher des colonnes
  // plutôt que des tables, un motif de VALEURS plutôt qu'un motif de nom, une contrainte de clé
  // plutôt qu'un libellé — ou formuler « aucun objet dont le NOM porte X » plutôt que « aucun X ».
  // Non bloquant, comme S22 : la règle apprend une tournure, elle ne refuse pas un travail juste.
  const ABSENCE_TROUVEE = /(aucun(?:e)?\s|n.existe pas|introuvable|rien\s+(?:ne\s+)?(?:correspond|ressort|remonte)|pas\s+(?:de|d.)\s|z[ée]ro\s)/i;
  const OBJET_DE_CATALOGUE = /(table|colonne|sch[ée]ma|catalogue|workspace|entrep[ôo]t|vue|base de donn[ée]es|m[ée]tastore|espace de travail|environnement)/i;
  // La marque d'une recherche PAR NOM : un motif d'expression, un `LIKE`, un `grep`, ou le fait de
  // dire qu'on a cherché un nom. C'est cette marque qui distingue « aucune table de X » (une
  // conclusion tirée d'une recherche) de « aucune table n'est écrite » (un fait du produit).
  const RECHERCHE_PAR_NOM = /(%[\w]+%|LIKE\s|ILIKE\s|grep|motif|pattern|nom\s+(?:contenant|comportant|qui\s+contient)|contenant\s+`|par\s+nom|dont\s+le\s+nom)/i;
  // L'acquittement : la recherche par STRUCTURE est déclarée, ou l'énoncé se borne au NOM.
  const PAR_STRUCTURE = /(par\s+structure|structurel|des\s+colonnes\s+plut[ôo]t|motif\s+de\s+valeurs|par\s+valeurs|contrainte\s+de\s+cl[ée]|information_schema\.columns|recherche\s+compl[ée]mentaire|crois[ée]\s+avec)/i;
  const BORNE_AU_NOM = /(dont\s+le\s+NOM|aucun\s+objet\s+dont\s+le\s+nom|le\s+nom\s+cherch[ée]|au\s+vu\s+des\s+seuls\s+noms|sur\s+ce\s+seul\s+crit[èe]re\s+de\s+nom)/i;
  {
    const phrases = texte.split(/(?<=[.!?;])\s+|\n/).map((x) => x.trim()).filter(Boolean);
    const risquees = phrases.filter((x) =>
      ABSENCE_TROUVEE.test(x) && OBJET_DE_CATALOGUE.test(x) && RECHERCHE_PAR_NOM.test(x));
    const nues = risquees.filter((x) => !PAR_STRUCTURE.test(x) && !BORNE_AU_NOM.test(x));
    if (!risquees.length) ok("S24", "aucune absence conclue d'une recherche par nom — rien à borner");
    else if (nues.length) ko("S24", `${nues.length} absence(s) sur ${risquees.length} conclue(s) d'une recherche PAR NOM : ` +
      "une recherche par nom qui ne trouve rien établit que LE NOM cherché n'existe pas, jamais que LA CHOSE cherchée n'existe pas — " +
      "et énumérer dix motifs de la même nature ne répare rien, ils partagent le même angle mort. Déclarer la recherche complémentaire " +
      "par STRUCTURE (des colonnes plutôt que des tables, un motif de valeurs plutôt qu'un motif de nom), ou écrire « aucun objet dont le " +
      `NOM porte X ». Ex. : ${nues[0].replace(/\s+/g, " ").slice(0, 110)}`);
    else ok("S24", `${risquees.length} absence(s) conclue(s) d'une recherche par nom, chacune bornée au nom ou complétée par une recherche de STRUCTURE`);
  }

  // ---- S19 (TF-0510, 22/08) — une action dit ce qui se passe si elle n'est PAS faite -------
  //
  // Demande humaine du 22/08, littérale et SYMÉTRIQUE : « fournir des actions claires, les
  // impacts de ces actions, les recos sur ces actions, des décisions claires, les impacts de ces
  // décisions, les recos des décisions ». Le référentiel n'en couvrait qu'une moitié : au bloc 3,
  // S15 et S16 exigent le sujet, la recommandation et sa source ; au bloc 8, S11 à S14 exigent le
  // motif, la raison, l'exécutabilité et l'identifiant — et AUCUNE n'exige la conséquence.
  //
  // Or c'est cette colonne qui rend la liste arbitrable : une liste de restes sans conséquences
  // est un inventaire, pas un outil de décision. Constaté à l'usage la même session — les
  // tableaux portant « si on ne fait rien » ont été acceptés, les autres redemandés.
  //
  // La RECOMMANDATION, elle, n'est pas exigée ici : une action n'offre pas toujours un choix, et
  // l'imposer partout produirait du remplissage. C'est l'asymétrie assumée avec S16.
  const CONSEQUENCE = /(si (?:rien |on )?(?:n(?:'|’)est|ne (?:le|la|les) fait|n(?:'|’)y a)|si (?:elle|il|ce) n(?:'|’)est pas (?:fait|trait|men|pris)|si non fait|sans (?:cette )?action|à défaut|conséquence si|impact si|sinon\s*[:,])/i;
  juger8("S19", ACTEURS, (g) => CONSEQUENCE.test(g),
    "une action sans ce qui se passe si elle N'EST PAS faite : la liste devient un inventaire au lieu " +
    "d'un outil d'arbitrage — c'est cette colonne qui permet de choisir ce qu'on laisse tomber. " +
    "Formes admises : « si rien n'est fait », « si on ne le fait pas », « à défaut », « sinon : », « impact si … ».",
    "chaque action dit ce qu'il en coûte de ne pas la faire");

  // ---- S18 (TF-0509, 22/08) — la forme ne change pas d'un tableau au suivant ----------------
  //
  // Mesure du 22/08 sur UNE session : au moins cinq mises en page pour le même contenu — prose
  // mêlée de tableaux, trois sections par acteur, un tableau unique, six sections portant quatre
  // formes de tableau distinctes, des fiches en prose, un tableau à nouveau. Le lecteur a tranché
  // en trois mots (« tableau !! ») après avoir écrit « toujours pas claire, recommence » et
  // « Revois complètement ta présentation ».
  //
  // Le coût n'est pas esthétique : à chaque changement de forme, le lecteur RÉAPPREND la mise en
  // page avant de pouvoir lire, et il perd la comparaison avec le message précédent — ce qui
  // annule le bénéfice de S14. Une liste dont les colonnes changent ne se compare pas, même avec
  // des identifiants stables.
  //
  // CE QUI EST JUGÉ ICI, et pas plus : la cohérence INTRA-document, bloc par bloc. Un bloc qui
  // porte deux tableaux d'en-têtes différents est un défaut — c'est exactement le cas mesuré
  // (« six sections, quatre formes »). La stabilité d'un TOUR AU SUIVANT demanderait de garder
  // l'état du tour précédent : elle est déclarée en `non_juge` plutôt que faussement promise.
  const entetesIncoherents = [];
  for (const [nom, bloc3ou8] of [["3", bDecisions], ["8", bActions]]) {
    const e = [...new Set(entetesDeTableau(bloc3ou8))];
    if (e.length > 1) entetesIncoherents.push(`bloc ${nom} : ${e.length} formes de tableau`);
  }
  entetesIncoherents.length
    ? ko("S18", `${entetesIncoherents.join(" · ")} — une liste dont les colonnes changent ne se compare pas, ` +
      "même avec des identifiants stables : le bénéfice de S14 est annulé. Un acteur est une COLONNE, pas une section.")
    : ok("S18", "forme de tableau cohérente dans chaque bloc");

  // ---- S17 (TF-0507, 22/08) — un renvoi nomme son sujet, jamais une position ----------------
  //
  // Fait mesuré sur pièce : une restitution renvoyait « préalable : ligne 8 (droit IAM) puis
  // ligne 5 (merge) ». Réponse du lecteur, mot pour mot : « Que veut dire ligne 8 (droit IAM)
  // puis ligne 5 (merge). C'est incompréhensible. » Vérification : les deux numéros avaient
  // changé de sens entre deux messages, le tri par urgence ayant déplacé les lignes.
  //
  // C'est le pendant, au niveau du RENVOI, de ce que S14 corrige au niveau de l'ITEM. S14 exige
  // un identifiant stable POUR l'action ; rien n'interdisait de la DÉSIGNER par sa position. Un
  // identifiant stable qui ne sert jamais à renvoyer ne sert à rien.
  //
  // `bloc` est délibérément HORS du motif : « voir le bloc 3 » désigne une structure fixe du
  // gabarit, pas une position dans une liste retriable.
  const RENVOI_POSITION = /\b(lignes?|points?|items?|puces?|entrées?|numéros?)\s*(?:n[°o]\s*)?\d+/i;
  const renvois = [bDecisions, bActions].flatMap((b) => b.split("\n")).filter((l) => RENVOI_POSITION.test(l));
  renvois.length
    ? ko("S17", `${renvois.length} renvoi(s) par POSITION dans les blocs 3 et 8 — la liste est retriée d'un ` +
      `message au suivant, le numéro désigne alors autre chose. Nommer le sujet ou son identifiant stable. ` +
      `Ex. : ${renvois[0].replace(/\s+/g, " ").trim().slice(0, 100)}`)
    : ok("S17", "aucun renvoi par position — les renvois nomment leur sujet");

  // ---- S20 (TF-0511, 22/08) — le jargon des blocs 3 et 8 porte sa glose --------------------
  //
  // Mesure du 22/08 : le lecteur a demandé DEUX FOIS l'explication du même point — « détaille 5 »,
  // puis « Explique 5 ». La première version employait « justificatif fédéré », « identité
  // system-assigned », « UAMI », « constat H2 », « filet » sans les gloser ; la seconde, écrite
  // sans aucun de ces termes, a été acceptée immédiatement.
  //
  // Le raisonnement de S9 s'applique mot pour mot — « une information remontée et non comprise a
  // le même effet qu'une information tue, avec le coût de lecture en plus » — mais S9 ne juge que
  // l'OUVERTURE. Or c'est aux blocs qu'on EXÉCUTE que le coût est le plus élevé : un jargon au
  // bloc 0 fait perdre le fil, un jargon dans une action fait exécuter de travers, ou pas du tout.
  //
  // Le référentiel est une DONNÉE (loi n° 4), fermée et datée : `gabarits\JARGON-A-GLOSER.json`.
  // Une heuristique sur les sigles en majuscules aurait un taux de faux positifs rédhibitoire
  // dans ce corpus, où la MAJUSCULE sert l'emphase — et un oracle qui crie sur l'emphase se fait
  // désactiver dans la semaine. La liste n'attrape que ce qui a réellement coûté un aller-retour.
  const jargon = chargerJargon();
  if (!jargon.length) {
    ok("S20", "référentiel de jargon absent ou vide — aucun terme à exiger (SANS OBJET, dit plutôt que tu)");
  } else {
    const nus = [];
    for (const [nom, b] of [["3", bDecisions], ["8", bActions]]) {
      for (const g of actionsGroupees(b)) {
        const preuveInterne = /(preuve|source consult)/i.test(g);
        for (const t of jargon) {
          const re = new RegExp(`${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[(\u00ab]`, "i");
          if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(g) && !re.test(g) && !preuveInterne) {
            nus.push(`bloc ${nom} : « ${t} »`);
          }
        }
      }
    }
    const uniques = [...new Set(nus)];
    uniques.length
      ? ko("S20", `${uniques.length} terme(s) de jargon sans glose adjacente aux blocs 3/8 : ${uniques.slice(0, 4).join(" · ")} — ` +
        "une information remontée et non comprise a le même effet qu'une information tue, avec le coût de lecture en plus. " +
        "Glose = une parenthèse qui suit le terme dans le même groupe. Référentiel : `gabarits\\JARGON-A-GLOSER.json`.")
      : ok("S20", `aucun terme de jargon nu aux blocs 3/8 (${jargon.length} terme(s) au référentiel)`);
  }

  // ---- S15 (22/08) — une décision RAPPELLE SON SUJET, ou elle n'est pas décidable -----------
  //
  // Retour humain du 22/08, dans l'heure qui a suivi la livraison de S11-S14 : « dans tes
  // prompts, rappelle le contexte des décisions à prendre, je ne peux pas me rappeler TF-0469 et
  // vue portefeuille ». Les deux exemples cités disent les deux moitiés du défaut : un
  // IDENTIFIANT (« TF-0469 ») ne désigne rien pour qui ne l'a pas écrit, et un TITRE COURT
  // (« vue portefeuille ») n'est qu'une étiquette. Le bloc 3 avait exactement le défaut que S13
  // venait de corriger au bloc 8 — sauf qu'au bloc 3 il coûte plus cher : une action mal écrite
  // se re-demande, une DÉCISION mal écrite se tranche quand même, à l'aveugle.
  //
  // S4 ne voyait rien : elle compte des options étiquetées, jamais ce qu'elles arbitrent. La
  // restitution qui a déclenché ce retour portait deux décisions, PASS S4 — la première avec un
  // chapeau en jargon de session, la seconde avec un titre de quatre mots et rien d'autre.
  //
  // La règle est celle du bloc 0 (S9), appliquée par décision : un chapeau d'au moins 25 mots,
  // avant la première option, SANS identifiant nu. Différence assumée avec S9 : les chemins et
  // spans de code restent tolérés ici — le sujet d'une décision EST parfois un fichier, et
  // l'interdire ferait écrire des périphrases. L'identifiant, lui, n'est jamais le sujet : il est
  // le nom que la chose porte au registre, et le registre n'est pas dans la tête du lecteur.
  const groupesDecisions = decisionsDuBloc(bDecisions)
    .filter((g) => !MOTIFS_ABSENCE.test(g.replace(/^\s*[-*]\s+/, "").slice(0, 40)))
    .filter((g) => /\(a\)/.test(g)); // sans option étiquetée, c'est S4 qui parle, pas S15
  if (!groupesDecisions.length) {
    ok("S15", "aucune décision à rappeler — bloc vide déclaré, ou choix fermé absent (S4)");
  } else {
    // Le chapeau, c'est la PROSE avant la première option : on retire la puce ou le titre qui
    // ouvre le segment, et TOUTE cellule de tableau — sinon un en-tête de six mots posé au-dessus
    // d'un chapeau de quatre mots ferait un total de dix et l'on croirait avoir mis en contexte.
    // 30/08 — LE SÉLECTEUR D'UNE DÉCISION N'EST PAS UN IDENTIFIANT DE REGISTRE, et S15 les
    // confondait. S30 prescrit depuis la v2.13.0 la forme « D-10 — » ; or `ID_STABLE` reconnaît
    // « une à quatre majuscules, un tiret, deux à quatre chiffres » — donc `D-10` en est un pour
    // elle, et S15 accusait la décision de porter un identifiant nu DANS SON PROPRE TITRE. Deux
    // règles du même référentiel se contredisaient : l'une imposait l'écriture que l'autre
    // refusait, et l'anatomie prescrite était inapplicable le jour de son écriture.
    //
    // LE DÉFAUT AVAIT ÉCHAPPÉ AU BANC, et c'est instructif : sa fixture employait « D-5 », un
    // seul chiffre, quand `ID_STABLE` en exige deux. Elle passait par chance, pas par
    // conformité — elle porte désormais « D-12 », et elle attrape la collision.
    //
    // La carve-out est la même que celle de `TF-####` pour S23 : un sélecteur introduit dans le
    // MÊME message, et prescrit par une autre règle du même gabarit, n'est pas ce que S15 traque.
    // Elle vise l'identifiant écrit AILLEURS et AVANT, que le lecteur ne peut pas connaître.
    const sansSelecteur = (t) => t.replace(/\bD-\d{1,2}\b/g, " ");
    const chapeau = (g) => sansSelecteur(g.split("(a)")[0]
      .replace(TETE_DECISION, "").replace(/>\s*/g, " ").replace(/\|[^|]*/g, " ").replace(/\*\*/g, "")).trim();
    // TF-0573 (24/08) — UN DOSSIER DE PLUSIEURS DÉCISIONS A BESOIN D'UN ENDROIT POUR SON CONTEXTE
    // COMMUN. Le fait : onze décisions issues d'une même enquête, toutes filles du même problème.
    // S15 demandant 25 mots de rappel À CHACUNE, il ne restait que deux issues et les deux sont
    // mauvaises — RÉPÉTER le contexte onze fois, et le dossier devient illisible par sa longueur ;
    // ou le SUPPOSER connu et n'écrire que le delta, ce qui a été fait et a produit « aucune mise
    // en contexte ». Le bloc 0 ne résout pas la question : il tient l'état, la conséquence et
    // l'attendu en un paragraphe, pas l'exposé d'un problème et de sa chaîne causale.
    //
    // La demande humaine dit exactement le besoin : « l'humain doit pouvoir apprendre, comprendre,
    // se rappeler le contexte, les problèmes, les choix, les solutions ». Le bloc 3 admet donc un
    // CHAPEAU COMMUN : une prose de tête, avant la première décision, qui porte l'histoire une
    // fois. Présent et substantiel (40 mots), il abaisse le rappel dû par décision à 12 mots — le
    // delta suffit, puisque le contexte est écrit juste au-dessus et non supposé.
    const preambule = decisionsDuBloc(bDecisions)
      .slice(0, decisionsDuBloc(bDecisions).findIndex((g) => /\(a\)/.test(g)) < 0
        ? undefined : decisionsDuBloc(bDecisions).findIndex((g) => /\(a\)/.test(g)))
      .filter((g) => !/\(a\)/.test(g))
      .join(" ")
      .replace(TETE_DECISION, "").replace(/\|[^|]*/g, " ").trim();
    const motsPreambule = preambule.split(/\s+/).filter(Boolean).length;
    const chapeauCommun = motsPreambule >= 40 && !ID_STABLE.test(sansSelecteur(preambule));
    const SEUIL = chapeauCommun ? 12 : 25;
    const fautifs = groupesDecisions.filter((g) => {
      const c = chapeau(g);
      const mots = c.split(/\s+/).filter(Boolean).length;
      return mots < SEUIL || ID_STABLE.test(c);
    });
    fautifs.length
      ? ko("S15", `${fautifs.length} décision(s) sur ${groupesDecisions.length} sans rappel de leur sujet — un identifiant ne désigne rien pour qui ne l'a pas écrit, ` +
          `et un titre court est une étiquette : avant les options, ${SEUIL} mots au moins qui disent DE QUOI on parle, sans identifiant nu` +
          (chapeauCommun ? ` (seuil abaissé de 25 à 12 : le chapeau commun du bloc porte déjà l'histoire, en ${motsPreambule} mots)` :
            ` — ou un CHAPEAU COMMUN de 40 mots en tête du bloc, qui porte le contexte une fois pour toutes les décisions (TF-0573)`) +
          `. Ex. : ${chapeau(fautifs[0]).replace(/\s+/g, " ").slice(0, 110)}`)
      : ok("S15", `${groupesDecisions.length} décision(s), chacune rappelant son sujet avant ses options` +
          (chapeauCommun ? ` (chapeau commun de ${motsPreambule} mots en tête du bloc : le rappel par décision se limite au delta)` : ""));
  }

  // ---- S23 (TF-0572, 24/08) — UN DÉSIGNATEUR INVENTÉ PAR L'AGENT ÉCHAPPE À S15 COMME À S20 ---
  //
  // LE FAIT. Le dossier remis le 24/08 nommait ses objets par des codes que l'agent venait de créer
  // DANS LA MÊME SESSION — V1, V2, V3, V4 pour quatre contrôles de plausibilité géographique, A1,
  // B2, E2 pour les décisions. Réponse du destinataire, mot pour mot : « Rien compris à V1, V3, V4,
  // de quoi parle-t-on ? »
  //
  // POURQUOI LES DEUX RÈGLES EXISTANTES NE LE VOIENT PAS. S15 interdit l'identifiant nu comme SUJET
  // d'une décision, et son exemple est TF-0469 : un identifiant DE REGISTRE, écrit ailleurs et
  // avant. Elle vise ce que le lecteur ne peut pas connaître. Un code introduit par l'agent dans le
  // même message passe son test de forme dès qu'une phrase de sujet l'accompagne — et c'était le
  // cas. S20, elle, glose depuis un référentiel FERMÉ, alimenté par les termes du métier : un code
  // né du jour n'y est pas et n'y sera jamais.
  //
  // CE QUI A MANQUÉ : le code a servi de RACCOURCI dans les renvois, les tableaux et les blocs
  // suivants sans jamais redire ce qu'il désigne. La règle est donc sur l'USAGE, pas sur la
  // naissance : *un désignateur court employé plus d'une fois porte sa glose à son PREMIER emploi*
  // — entre parenthèses, après un tiret, après deux-points, ou en première cellule d'une ligne de
  // tableau. Quatre mots suffisent. Sans glose, il n'existe pas pour le lecteur, et l'écrire c'est
  // écrire pour soi.
  const RE_DESIGNATEUR = /\b([A-Z]{1,4})-?(\d{1,3})\b/g;
  const RE_DESIGNATEUR_UNIQUE = /^[A-Z]{1,4}-?\d{1,3}/;
  // TF est exclu, et c'est la SEULE exclusion : l'identifiant de registre est déjà tenu par S14 (il
  // est OBLIGATOIRE sur une action), par S15 (il est interdit comme sujet) et par S20 (il se glose).
  // Toute autre forme courte — R-52, V4, A1, EA6 — est opaque au lecteur tant qu'elle n'est pas
  // glosée, et l'exclure au motif qu'elle vit dans un de NOS référentiels serait raisonner depuis
  // l'auteur : le lecteur n'a pas nos référentiels sous les yeux.
  // 30/08 — LE SÉLECTEUR D'UNE DÉCISION REJOINT L'EXCLUSION, pour la raison même qui y met `TF` :
  // il est déjà tenu par d'autres règles du même gabarit. S30 le prescrit et le vérifie, S15
  // l'ignore comme sujet depuis ce matin, et la doctrine impose qu'il ouvre chaque décision.
  // Mesuré sur le rendu de référence : « D4 (2 emplois), D3 (2 emplois) » y étaient dénoncés alors
  // qu'ils renvoyaient à des décisions posées DANS LE MÊME FIL — c'est-à-dire l'usage exact que
  // S17 exige, un renvoi qui nomme son sujet au lieu d'une position. Deux règles se contredisaient.
  // 01/09 — LE SÉLECTEUR D'UNE ACTION rejoint l'exclusion pour la même raison que celui d'une
  // décision : S33 le prescrit et le vérifie, et la doctrine impose qu'il ouvre chaque action du
  // bloc 8. Sans cette exclusion, S23 dénoncerait « A-1 (3 emplois) » sur une restitution dont le
  // seul tort serait d'obéir — le renvoi par sélecteur est justement ce que S17 exige.
  const EXCLUS_S23 = /^(?:TF-?\d{3,4}|[DA]-?\d{1,2})$/;
  const occurrences = new Map();
  for (const m of texte.matchAll(RE_DESIGNATEUR)) {
    const brut = m[0];
    if (EXCLUS_S23.test(brut)) continue;
    const cle = `${m[1]}${m[2]}`;
    if (!occurrences.has(cle)) occurrences.set(cle, []);
    occurrences.get(cle).push(m.index);
  }
  /** Glosé : le token est suivi d'un ouvreur de glose, puis d'au moins quatre mots. */
  const estGlose = (i, brut) => {
    const apres = texte.slice(i + brut.length, i + brut.length + 200).replace(/^\*\*/, "");
    const m = /^\s*([(—–:|=§]|\bpour\b|\bdésigne\b|\bc'est\b)\s*([^)|\n.]{4,})/.exec(apres);
    return Boolean(m) && m[2].split(/\s+/).filter(Boolean).length >= 4;
  };
  const nonGloses = [...occurrences.entries()]
    .filter(([, positions]) => positions.length >= 2)
    .filter(([, positions]) => !positions.some((i) => estGlose(i, texte.slice(i).match(RE_DESIGNATEUR_UNIQUE)?.[0] || "")))
    .map(([cle, positions]) => `${cle} (${positions.length} emplois)`);
  if (!occurrences.size) {
    ok("S23", "aucun désignateur court employé — rien à gloser");
  } else if (nonGloses.length) {
    ko("S23", `${nonGloses.length} désignateur(s) employé(s) plusieurs fois sans jamais être glosé(s) : ` +
      `${nonGloses.join(", ")} — « rien compris à V1, V3, V4, de quoi parle-t-on ? » est la réponse ` +
      "que cette forme obtient. Quatre mots au premier emploi suffisent : « V1 (plausibilité de la " +
      'commune) », ou une ligne de tableau « | V1 | plausibilité de la commune | »');
  } else {
    ok("S23", `${occurrences.size} désignateur(s) court(s), chacun glosé à son premier emploi`);
  }

  // ---- S16 (22/08) — une question dont la réponse est DANS les documents ne se pose pas nue ---
  //
  // Retour humain du 22/08, sur une décision qui demandait de nommer un rôle : « tu aurais dû
  // être en capacité de déduire son nom du dossier que j'ai fourni, pourquoi ne l'as-tu pas
  // fait ? Fais en sorte que les prochaines fois, ce genre de questions soit répondu par l'IA
  // automatiquement, au moins préconisé a minima. » Le nom était à la PREMIÈRE LIGNE du dossier.
  //
  // Poser une question dont la réponse est sous la main a un coût asymétrique : elle coûte une
  // seconde à l'agent et un aller-retour au lecteur, qui doit rouvrir un document que l'agent
  // avait déjà. C'est le même défaut que S13 et S15 corrigent ailleurs — faire payer au lecteur
  // un travail que l'agent pouvait faire — mais au bloc 3, il est le plus cher : il transforme
  // une lecture en arbitrage.
  //
  // « Dérivable » ne se teste pas à la machine. Ce qui se teste, c'est la TRACE d'avoir cherché :
  // chaque décision porte sa RECOMMANDATION, et soit un localisateur (le document consulté d'où
  // sort la réponse proposée), soit la déclaration explicite qu'aucune source disponible ne
  // répond. Une décision sans recommandation est une question rendue telle quelle ; une
  // recommandation sans source est une opinion.
  if (groupesDecisions.length) {
    const RECO = /\brecommand|\bpréconis|\bpreconis|\bproposition\b/i;
    const RIEN_NE_REPOND = /(aucune?\s+(source|document|pièce|piece)|rien\s+dans\s+les\s+documents|non\s+dérivable|non\s+derivable)/i;
    const fautifs16 = groupesDecisions.filter((g) => !RECO.test(g) || !(_LOCALISATEURS.test(g) || RIEN_NE_REPOND.test(g)));
    fautifs16.length
      ? ko("S16", `${fautifs16.length} décision(s) sur ${groupesDecisions.length} posée(s) sans trace d'instruction — chacune porte sa RECOMMANDATION, ` +
          `et soit la source consultée d'où elle sort, soit la déclaration qu'aucune source disponible ne répond. ` +
          `Une question dont la réponse est dans un document déjà fourni ne se pose pas : elle se répond.`)
      : ok("S16", `${groupesDecisions.length} décision(s), chacune recommandée et sourcée`);
  } else {
    ok("S16", "aucune décision à instruire");
  }

  // ---- S30 (28/08/2026) — UNE DÉCISION SE SÉLECTIONNE, DONC ELLE PORTE UN NUMÉRO ------------
  //
  // LE RETOUR EST LA MESURE, mot pour mot : « Il n'y a pas de numéro sur les décisions, je ne
  // peux pas les sélectionner. » Et le plus instructif est ce qui l'a précédé : le destinataire
  // avait déjà répondu « 1b, 2a, 3a » à une restitution portant TROIS décisions non numérotées.
  // Il avait donc INVENTÉ la numérotation pour pouvoir répondre — l'ordre d'apparition faisant
  // office de numéro tacite. Ça a marché deux fois, et la troisième il a dit stop.
  //
  // POURQUOI S4 NE LE VOIT PAS, et c'est la même cécité que S15 corrigeait au niveau du sujet :
  // S4 compte des OPTIONS étiquetées `(a)`, `(b)`, `(c)` — elle vérifie que le choix est fermé,
  // jamais que la QUESTION est adressable. Un bloc à trois décisions parfaitement optionnées est
  // donc conforme à S4 et pourtant insélectionnable : « je prends (b) » ne dit pas laquelle.
  //
  // CE QUE COÛTE L'ABSENCE : soit le lecteur numérote lui-même et le risque d'un décalage est
  // sur lui, soit il rédige sa réponse en prose — c'est-à-dire exactement ce que le choix fermé
  // du bloc 3 existe pour lui épargner. Une décision qu'on ne peut pas désigner en deux
  // caractères n'est pas un choix fermé, c'est un questionnaire.
  //
  // LES NUMÉROS DOIVENT AUSSI ÊTRE DISTINCTS : deux décisions numérotées 1 ne se sélectionnent
  // pas davantage qu'aucune. C'est le second sens de la règle, et il se mesure aussi.
  //
  // LA FORME RESTE LIBRE, MAIS ELLE NOMME SA FAMILLE — durcissement du 01/09, et il vient d'un
  // défaut mesuré. Étaient acceptés jusque-là « **Décision 1 —** », « 1. », « **1)** », « D1 — »,
  // « D-1 — » : les deux formes NUES (« 1. », « 1) ») ont été retirées. Le retour qui les retire :
  // « Il y a un problème de numérotation entre les décisions et les prochaines actions. Tu confonds
  // une fois l'un et une fois l'autre. » Une restitution porte DEUX listes numérotées, et un entier
  // nu n'appartient à aucune des deux — le lecteur répond « 3 » en désignant une action, et le « 3 »
  // se lit comme la décision 3. Juger la typographie n'a jamais été le sujet ; désambiguïser deux
  // familles l'est. Restent admises : « **Décision 1 —** », « D1 », « D-1 — ». Symétrique : S33.
  //
  // LE TIRET A ÉTÉ AJOUTÉ LE 30/08, ET LE DÉFAUT VALAIT LA MESURE. La forme réellement employée
  // dans les rendus du parc est « **D-5 —** » — c'est celle que le destinataire a mise en regard
  // en demandant qu'elle devienne la référence. Or l'expression n'admettait `D` que COLLÉ à son
  // chiffre : `D5` passait, `D-5` était REFUSÉ, et `D-12` aussi. La règle écrite pour rendre une
  // décision sélectionnable refusait donc l'écriture qui la rend sélectionnable — et elle l'aurait
  // fait au moment précis où la doctrine allait la prescrire. Vérifié dans les deux sens au
  // self-test : `D-5` passe, une décision sans numéro échoue toujours.
  const numeroDeDecision = (g) => {
    const tete = g.replace(TETE_DECISION, "").replace(/^\*\*/, "").trim();
    const m = /^(?:d[ée]cision\s*(?:n[°ºo]\s*)?|D\s*-?\s*)(\d{1,2})\b/i.exec(tete);
    return m ? m[1] : null;
  };
  if (groupesDecisions.length) {
    const numeros = groupesDecisions.map(numeroDeDecision);
    const sansNumero = numeros.filter((n) => n === null).length;
    const poses = numeros.filter(Boolean);
    const doublons = poses.filter((n, i) => poses.indexOf(n) !== i);
    if (sansNumero) {
      ko("S30", `${sansNumero} décision(s) sur ${groupesDecisions.length} SANS NUMÉRO — une décision se désigne pour se trancher. ` +
        "Le destinataire a répondu « 1b, 2a, 3a » à un bloc non numéroté avant de dire « je ne peux pas les sélectionner » : " +
        "il inventait la numérotation. Formes admises : « **Décision 1 —** », « D1 — », « D-1 — » — le numéro NU (« 1. », « 1) ») ne dit pas à laquelle des deux listes du message il appartient (S33).");
    } else if (doublons.length) {
      ko("S30", `numéro(s) de décision en DOUBLE : ${[...new Set(doublons)].join(", ")} — deux décisions portant le même numéro ` +
        "ne se sélectionnent pas mieux qu'aucune.");
    } else {
      ok("S30", `${groupesDecisions.length} décision(s), chacune numérotée et distincte (${poses.join(", ")})`);
    }
  } else {
    ok("S30", "aucune décision à numéroter");
  }

  // ---- S31 et S32 (30/08/2026) — LES DEUX EXIGENCES DU BLOC 3 QUI N'AVAIENT AUCUN JUGE -------
  //
  // LE FAIT, mesuré le 30/08 en instruisant un écart de forme signalé par le destinataire. Le
  // bloc 3 énonce CINQ exigences depuis le 13/08 : rappeler le sujet, recommander en citant sa
  // source, proposer des options portant chacune SON COÛT ET CE QU'ELLE FERME, motiver la
  // recommandation, et NOMMER CE QUI SE PASSE SI RIEN N'EST DÉCIDÉ. Quatre règles étaient nées au
  // fil des retours — S4 le choix fermé, S15 le rappel du sujet, S16 la source, S30 le numéro.
  // Les deux dernières exigences, elles, n'ont jamais reçu de juge : comptage du 30/08 sur ce
  // fichier, ZÉRO occurrence de « coût », « exclut » et « si rien n'est décidé » hors commentaires.
  //
  // CE QUE L'ABSENCE A COÛTÉ, et c'est la mesure : deux rendus du même bloc, à deux jours d'écart,
  // passaient tous deux le contrôle en ne se ressemblant pas — l'un portait le coût, ce que chaque
  // option ferme et la ligne de repli, l'autre en avait perdu une partie en chemin. Le destinataire
  // a lu cette différence de forme comme une différence de VERSION, et a demandé pourquoi « le
  // format n'était pas appliqué ». Une exigence écrite que rien ne mesure tient tant que le
  // rédacteur y pense — c'est-à-dire pas longtemps, et c'est exactement ce que la v1 de ce
  // référentiel disait déjà d'elle-même.
  //
  // BORNE DE DOMAINE, REPRISE DE S19 : UNE LIGNE DE TABLEAU SE JUGE AVEC SON EN-TÊTE. En forme de
  // puce, le coût vit dans la puce ; en forme de TABLEAU — la forme par défaut depuis la v2.12.0 —
  // il vit dans la COLONNE. Exiger la locution dans chaque cellule pousserait au bruit et mettrait
  // deux règles du même référentiel en contradiction, comme S18 et S19 l'ont été le 22/08 : l'une
  // prescrivait le tableau que l'autre rendait impossible à satisfaire proprement.
  //
  // LA LIGNE DE REPLI N'EST PAS UNE OPTION : « sans décision : rien n'est publié » n'est pas un
  // choix qu'on retient, c'est ce qui arrive quand on n'en retient aucun. Elle est donc exclue du
  // décompte de S31 et devient l'objet de S32.
  //
  // AVERTISSANTES, comme toute règle neuve depuis la v2.5.0 : une option sans son coût rend
  // l'arbitrage moins sûr, elle ne le rend pas impossible.
  const lignesDeDecisions = (t) => {
    const segs = [];
    for (const ligne of t.split("\n")) {
      const ouvre = (/^[-*+]\s+\S/.test(ligne) || /^\s*#{2,6}\s/.test(ligne) || RE_TETE_CITATION.test(ligne))
        && !RE_LIGNE_OPTION.test(ligne) && !/^\s*\|/.test(ligne);
      if (ouvre) { segs.push([ligne]); continue; }
      if (!segs.length) { if (ligne.trim()) segs.push([ligne]); continue; }
      if (ligne.trim()) segs[segs.length - 1].push(ligne);
    }
    return segs;
  };
  // Les vocabulaires sont LARGES à dessein : ces deux règles apprennent une tournure, elles
  // n'imposent pas un mot. « coûte », « effort », « charge » disent le même prix ; « exclut »,
  // « renonce », « se prive », « empêche » disent la même fermeture.
  const COUT_OPTION = /(co[ûu]te?|effort|charge|budget|prix|gratuit)/i;
  const EXCLUSION_OPTION = /(exclu|renonc|se prive|interdi|emp[êe]che|ferme la porte|ce qu(?:'|’)elle ferme)/i;
  const OPTION_PAR_DEFAUT = /(si rien n(?:'|’)est d[ée]cid|sans d[ée]cision|[àa] d[ée]faut\s*[:,]|option par d[ée]faut|par d[ée]faut\s*[:,]|faute de d[ée]cision)/i;
  {
    const groupesLignes = lignesDeDecisions(bDecisions)
      .filter((g) => !MOTIFS_ABSENCE.test(g[0].replace(/^\s*[-*]\s+/, "").slice(0, 40)))
      .filter((g) => g.some((l) => /\(a\)/.test(l)));
    const fautives = [];
    let options = 0;
    for (const g of groupesLignes) {
      const entete = g.find((l) => /^\s*\|/.test(l)) || "";
      const enteteCout = COUT_OPTION.test(entete);
      const enteteExclut = EXCLUSION_OPTION.test(entete);
      for (const l of g) {
        if (!RE_LIGNE_OPTION.test(l)) continue;
        if (OPTION_PAR_DEFAUT.test(l)) continue;
        options++;
        const enTableau = /^\s*\|/.test(l);
        const aCout = COUT_OPTION.test(l) || (enTableau && enteteCout);
        const aExclut = EXCLUSION_OPTION.test(l) || (enTableau && enteteExclut);
        if (!aCout || !aExclut) fautives.push(l);
      }
    }
    if (!options) ok("S31", "aucune option à qualifier — bloc vide déclaré, ou choix fermé absent (S4)");
    else if (fautives.length) {
      ko("S31", `${fautives.length} option(s) sur ${options} sans son COÛT ou sans CE QU'ELLE EXCLUT — ` +
        "une liste d'options qui ne dit ni ce qu'elles coûtent ni ce qu'elles ferment n'est pas un choix fermé, " +
        "c'est un menu. L'exigence est écrite au bloc 3 depuis le 13/08 et n'avait aucun juge. En TABLEAU, " +
        "les colonnes suffisent — une ligne se juge avec son en-tête, comme pour S19. " +
        `Ex. : ${fautives[0].replace(/\s+/g, " ").trim().slice(0, 110)}`);
    } else ok("S31", `${options} option(s), chacune portant son coût et ce qu'elle exclut`);

    const sansRepli = groupesLignes.filter((g) => !g.some((l) => OPTION_PAR_DEFAUT.test(l)));
    if (!groupesLignes.length) ok("S32", "aucune décision — rien dont nommer l'option par défaut");
    else if (sansRepli.length) {
      ko("S32", `${sansRepli.length} décision(s) sur ${groupesLignes.length} sans OPTION PAR DÉFAUT nommée — ` +
        "l'option par défaut existe toujours : ne pas trancher EST une décision, et la taire fait croire " +
        "que ne rien faire est sans effet. Formes admises : « si rien n'est décidé », « sans décision », " +
        `« à défaut : », « par défaut : ». Ex. : ${sansRepli[0][0].replace(/\s+/g, " ").trim().slice(0, 110)}`);
    } else ok("S32", `${groupesLignes.length} décision(s), chacune nommant ce qui se passe si rien n'est décidé`);
  }

  return findings;
}

const verdictDe = (f) => (f.some((x) => x.statut === "FAIL") ? "FAIL" : "PASS");

const arg = process.argv[2];
if (arg === "--self-test") {
  const dir = mkdtempSync(join(tmpdir(), "restitution-"));
  const verte = `# Restitution — campagne de test

Le contrôle complet de la forge de tests est terminé et tout est au vert : chaque défaut que
nous avions volontairement planté a bien été détecté, ce qui prouve que la surveillance
fonctionne. Rien n'attend de correction ; la seule chose attendue de vous est la décision de
publication ci-dessous.

## 1. En-tête
Campagne · forge-tests · terminée le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot.

## 2. Verdict
Recette S-01 (banc rouge de la forge de tests) TENU — 19/19 défauts détectés au banc rouge, pytest 365.

Coût de la reprise proposée : complexité moyen · durée court.

## 3. Décisions attendues
- **Décision 1 —** Publier la version corrigée de la forge de tests ? Le banc rouge vient de tourner en entier :
  chaque défaut planté volontairement a été détecté, donc la surveillance fonctionne et la
  version est prête à sortir. Publier la rend visible aux autres projets ; ne pas publier la
  laisse sur ce poste, et personne d'autre n'en profite tant qu'on attend.
  - (a) taguer v1.12.0 maintenant — recommandé : le journal de recette \`recette-S01.md\` ne porte aucun défaut ouvert ; coût : effort simple × court ; exclut de grouper cette sortie avec le prochain lot ;
  - (b) attendre le prochain lot — coût : les 26 commits restent locaux ; exclut la publication cette semaine.
  - sans décision : rien n'est publié.

## 4. Traité
- Garde de précondition sur le pan qualif — preuve : 18 tests, 0 finding quand la garde s'active.

## 5. Non traité
- Regroupement par cause racine : motif — sa cause est traitée, critère de réouverture écrit.

## 6. Écarts à la lettre
Aucun écart : la demande a été suivie à la lettre.

## 7. Risques
- Le pack anglais ne se régénère plus.
  - signal : une source corrigée diverge de son pack au prochain assemblage ;
  - parade : traduire D17 en amont.

## 8. Prochaines actions
- **A-1** — d'abord TF-0220 (manuelle_dev) — parce qu'il débloque toute correction ultérieure du corpus.
  - pourquoi pas l'IA : decision — arbitrage normatif sur le seuil retenu ;
  - où : \`forge_tests\\corpus.py\`, puis relancer la recette S-01.
  - si rien n'est fait : les corrections suivantes du corpus restent bloquées derrière celle-là.
- **A-2** — ensuite TF-0221 (manuelle_utilisateur) — décision normative, impact sur 19 citations.
  - pourquoi pas l'IA : acces — publication TENTÉE le 14/08, \`HTTP 403 Authorization_RequestDenied\` ; le compte de l'agent ne porte aucun rôle sur le portail ;
  - où : écran « Publier la version », bouton \`Publier\`.
  - si rien n'est fait : les 19 citations continuent de pointer une version non publiée.
- **A-3** — enfin TF-0222 (auto_ia) — regrouper les constats par cause racine.
  - motif de non-exécution : dependance_bloc_3 — attend la décision de publication ci-dessus.
  - si rien n'est fait : les constats restent listés un par un, sans leur cause commune.
`;
  // Rouge : onze violations distinctes et indépendantes. Le bloc 8 porte DEUX tableaux de formes
  // différentes en plus des puces — c'est la forme réclamée par le lecteur le 22/08, et c'est
  // aussi celle qui rendait S11-S14 muettes avant TF-0508 : la fixture les tient désormais.
  const rouge = verte
    .replace(/## 8\. Prochaines actions[\s\S]*$/,
      "## 8. Prochaines actions\n" +
      "- d'abord regrouper les constats (auto_ia) — parce que c'est le plus rentable, préalable : ligne 8 (droit IAM).\n" +
      "- ensuite publier la version (manuelle_dev) — parce que tout est prouvé, il faut un UAMI.\n" +
      // TF-0606 : une incapacite affirmee sans nommer les chemins essayes. Le CLI a refuse,
      // l'API du meme service repondait — mais rien ici ne dit qu'un second chemin a ete tente.
      "- je ne peux pas deployer d'ici, le CLI rend Unauthorized.\n" +
      // S21 : un motif `acces` AFFIRMÉ, sans la moindre trace de tentative — c'est le cas fautif
      // mesuré le 23/08, où un blocage a été affirmé alors que la même classe de contrainte avait
      // déjà été levée deux fois le jour même. La ligne porte tout le reste (acteur, motif,
      // localisateur, conséquence) : seule la TRACE manque, et c'est cela seul que S21 juge.
      "- enfin ouvrir le portail (manuelle_utilisateur) — pourquoi pas l'IA : acces, le portail n'est pas ouvert a l'agent ; ou : `portail.html` ; si rien n'est fait : rien ne sort.\n" +
      "\n| id | acteur | action |\n|---|---|---|\n| A1 | manuelle_utilisateur | ouvrir le portail |\n| A2 | manuelle_utilisateur | créer la ligne GITHUB_JETON= dans le fichier .env et y coller le jeton |\n" +
      "\n| acteur | quoi |\n|---|---|\n| auto_ia | regrouper les constats |\n")
    .replace(/\n\nLe contrôle complet[\s\S]*?ci-dessous\./, "")  // S9 : plus d ouverture
    .replace("terminée le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot.", "terminée aujourd'hui.")
    .replace("- Regroupement par cause racine : motif — sa cause est traitée, critère de réouverture écrit.", "- Regroupement par cause racine")
    .replace("Coût de la reprise proposée : complexité moyen · durée court.", "Coût de la reprise proposée : 2-3 j.")
    .replace("Recette S-01 (banc rouge de la forge de tests) TENU — 19/19 défauts détectés au banc rouge, pytest 365.", "Tout s'est bien passé.")
    .replace(/— recommandé[^;]*;/, "—")
    .replace(/- \*\*Décision 1 —\*\* Publier la version corrigée[\s\S]*?tant qu'on attend\./, "- Publier TF-0220 ?")
    // S22 : un NÉGATIF prononcé sur une ressource EXTERNE depuis une seule sonde — la forme exacte
    // des deux cas du 24/08 (un 404 en HEAD lu comme une page morte, un champ d'API lu comme une
    // absence). La phrase est ajoutée au bloc 7 pour ne pas perturber les règles du bloc 8.
    // S23 : le designateur employe plusieurs fois et JAMAIS glose — la forme exacte du 24/08,
    // ou le lecteur a repondu « rien compris a V1, V3, V4, de quoi parle-t-on ? ».
    .replace("## 4. Traité", "## 4. Traité\n\n- Les controles V1 et V3 sont tenus ; V1 reste le plus couteux. — preuve : 4 cas.\n- Jeton préparé sur la ligne prévue — voir A-2.\n- Page console.html livrée — preuve : check_html PASS, 21 règles.\n- Hauteur de ligne corrigée en cachant la période.")
    // S24 : l'absence conclue d'une recherche PAR NOM — la forme exacte du 24/08, dix motifs de nom
    // de table joués sur trois schémas, et la correspondance qui vivait dans les COLONNES.
    // S27 : une IDENTITÉ affirmée depuis une MÉTADONNÉE — la forme exacte du 25/08, deux logos de
    // 19 922 octets à la même date tenus pour un seul fichier, puis écrasés par le même contenu.
    // La phrase porte la conjonction complète (identité + indice) et AUCUNE empreinte : c'est
    // l'inférence qui est jugée, pas le fait de citer une taille.
    .replace("## 7. Risques", "## 7. Risques\n\n- L'API du fournisseur ne rend aucun enregistrement TXT : il n'y a pas de TXT côté DNS.\n\n- Aucune table de transcodification : les motifs %transcod%, %corresp% et %mapping% ne remontent rien sur les trois schémas.\n\n- Le fichier .env a bien ete cree et il est bien ignore par git.\n\n- Les deux logos font 19 922 octets et portent la meme date : c'est le meme fichier duplique.\n\n- forge-seo-geo aurait du voir cette derive de capacites, et ne l'a pas signalee.\n");
  // TF-0567 — la branche « ouverture TITRÉE » a ses DEUX sens, sinon elle serait une porte ouverte :
  // titrée et conforme doit passer (c'est le défaut mesuré : 30 mots lus comme 0), titrée et
  // technique doit continuer d'échouer — un titre ne blanchit rien.
  const titree = verte.replace("\nLe contrôle complet", "\n### 0. Synthèse d'ouverture\n\nLe contrôle complet");
  const titreeSale = titree.replace("Rien n'attend de correction", "Rien n'attend de correction dans `oracle-synthese.mjs`");
  // TF-0699 — S30 DANS SES DEUX SENS. Le premier (aucun numero) est porte par la rouge. Le
  // second se mesure a part : deux decisions numerotees 1 ne se selectionnent pas mieux
  // qu'aucune, et un controle qui ne verrait que l'absence laisserait passer le doublon.
  const numeroDouble = verte.replace(
    "  - sans décision : rien n'est publié.",
    [
      "  - sans décision : rien n'est publié.",
      "- **Décision 1 —** Faut-il aussi publier le journal de recette de la forge de tests ? Il",
      "  porte le detail des 19 defauts plantes et de leur detection, ce que le verdict resume",
      "  en une seule ligne.",
      "  - (a) le publier avec la version — recommandé : `recette-S01.md` ne porte aucun défaut ouvert ;",
      "  - (b) le garder local — coût : le detail reste invisible aux autres projets.",
      "  - sans décision : le journal reste local.",
    ].join(String.fromCharCode(10)));
  writeFileSync(join(dir, "numero-double.md"), numeroDouble, "utf8");
  // 30/08 — S30 ADMET LE TIRET. La forme réellement employée dans les rendus du parc est
  // « **D-5 —** », et c'est celle que la doctrine prescrit depuis la v2.13.0. Elle était REFUSÉE :
  // l'expression n'admettait `D` que collé à son chiffre. Sans cette fixture, la correction serait
  // invérifiable et pourrait être défaite sans que rien ne le dise.
  // « D-12 » et non « D-5 » : à un seul chiffre, la fixture passait par CHANCE — `ID_STABLE`
  // exige deux chiffres, donc « D-5 » n'était pas lu comme un identifiant et la collision entre
  // S30 et S15 restait invisible. Deux chiffres, et le banc attrape ce que S15 refusait.
  const numeroTiret = verte.replace("- **Décision 1 —** Publier", "- **D-12 —** Publier");
  writeFileSync(join(dir, "numero-tiret.md"), numeroTiret, "utf8");
  // 30/08 — S31 ET S32 DANS LEURS DEUX SENS. La verte porte désormais, sur chaque option, son coût
  // et ce qu'elle exclut, ainsi que sa ligne de repli : elle est le sens VERT des deux règles. Les
  // deux fixtures ci-dessous en retirent chacune une moitié — sans quoi une règle qui ne crierait
  // jamais passerait pour tenue.
  const optionsNues = verte.replace(
    /  - \(a\) taguer[\s\S]*?exclut la publication cette semaine\.\n/,
    "  - (a) taguer v1.12.0 maintenant ;\n  - (b) attendre le prochain lot.\n");
  const sansRepli = verte.replace("  - sans décision : rien n'est publié.\n", "");
  writeFileSync(join(dir, "options-nues.md"), optionsNues, "utf8");
  writeFileSync(join(dir, "sans-repli.md"), sansRepli, "utf8");
  // 30/08 — LA FORME DE RÉFÉRENCE : LA DÉCISION EN BLOC DE CITATION, celle que les produits
  // affichent réellement et que la doctrine prescrit depuis la v2.14.0. Cet oracle en était
  // AVEUGLE : aucune ligne à chevron n'ouvrait de segment, deux décisions fusionnaient en une
  // seule, et le rendu de référence était jugé « 1 décision SANS NUMÉRO » quand il en porte deux.
  // Le format demandé était donc REFUSÉ par le contrôle censé le faire respecter — et un agent
  // qui satisfait l'oracle dérivait mécaniquement vers la puce. Sans cette fixture, la correction
  // se déferait au premier remaniement, et le fil du 30/08 se rejouerait à l'identique.
  const CITATION = [
    "> **D-7 — Publie-t-on la version corrigée de la forge de tests, ou attend-on le prochain lot ?**",
    "> Le banc rouge vient de tourner en entier : chaque défaut planté volontairement a été détecté,",
    "> donc la surveillance fonctionne et la version est prête à sortir sans autre vérification.",
    // La source est citée SANS accents graves et porte une extension qui n'entrait pas dans la
    // liste avant le 30/08 : la fixture tient donc les DEUX corrections du jour — la forme citée
    // et l'élargissement des localisateurs. Si l'une des deux se défait, S16 tombe ici.
    "> **Recommandation : (a).** Source consultée : la chaîne d'intégration .github/workflows/recette.yml, dont le dernier passage ne porte aucun défaut ouvert.",
    "",
    "| Option | Ce qu'elle coûte | Ce qu'elle exclut |",
    "|---|---|---|",
    "| **(a)** Taguer v1.12.0 maintenant | Effort simple × court | Exclut de grouper cette sortie avec le prochain lot |",
    "| **(b)** Attendre le prochain lot | Les 26 commits restent locaux | Exclut la publication cette semaine |",
    "",
    "> **Si rien n'est décidé** : (b) s'applique, rien n'est publié.",
  ].join(String.fromCharCode(10));
  const enCitation = verte.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/,
    `## 3. Décisions attendues\n\n${CITATION}\n\n`);
  writeFileSync(join(dir, "d3-citation.md"), enCitation, "utf8");
  // 01/09 — S33 DANS SON SECOND SENS, et S30 DANS SON DURCISSEMENT. Les deux fixtures qui
  // suivent tiennent le retour du 01/09 : « il y a un problème de numérotation entre les
  // décisions et les prochaines actions ; ici le 3 était pour les prochaines actions ».
  //   · selecteur-double : deux actions portant A-1 — l'absence est portée par la rouge, le
  //     DOUBLON ne se voit que si on le mesure à part, exactement comme pour S30 ;
  //   · numero-nu : la décision revient au numéro NU (« 1. »), la forme que S30 acceptait
  //     jusqu'ici et par laquelle les deux familles se sont confondues. Sans cette fixture, le
  //     durcissement se déferait au premier remaniement et le retour se rejouerait à l'identique.
  const selecteurDouble = verte.replace("- **A-2** — ensuite", "- **A-1** — ensuite");
  writeFileSync(join(dir, "selecteur-double.md"), selecteurDouble, "utf8");
  const numeroNu = verte.replace("- **Décision 1 —** Publier", "- **1.** Publier");
  writeFileSync(join(dir, "numero-nu.md"), numeroNu, "utf8");
  writeFileSync(join(dir, "verte.md"), verte, "utf8");
  writeFileSync(join(dir, "rouge.md"), rouge, "utf8");
  // TF-0661 — S29 a besoin de SA fixture : la rouge porte des actions au bloc 8, donc la
  // contradiction que S29 traque n'y existe pas. Ici, un risque déclaré NON COUVERT et un bloc 8
  // qui ne passe la main à personne — le cas fondateur, mot pour mot dans sa forme.
  const risqueOrphelin = verte
    .replace("## 7. Risques\n- Le pack anglais ne se régénère plus.",
      "## 7. Risques\n- La relecture native n'a pas eu lieu : environ 180 chaînes de corps de texte sont concernées, "
      + "sur des pages publiques. C'est le seul endroit du lot où le risque n'est pas couvert par un oracle.")
    .replace(/## 8\. Prochaines actions[\s\S]*$/, "## 8. Prochaines actions\n\nRien à faire.\n");
  // Et sa contre-épreuve : le MÊME risque, mais la main est passée. Sans elle, une règle qui
  // crierait sur tout risque déclaré passerait le cas rouge.
  const risqueRepris = risqueOrphelin.replace(
    "## 8. Prochaines actions\n\nRien à faire.\n",
    "## 8. Prochaines actions\n\n- d'abord faire relire les 180 chaînes par un natif (manuelle_utilisateur) — "
    + "parce que c'est le seul risque du lot qu'aucun oracle ne couvre.\n  - pourquoi pas l'IA : decision — "
    + "l'accord grammatical d'une langue étrangère se tranche à l'oreille ;\n  - où : `web/src/i18n/locales/`.\n"
    + "  - si rien n'est fait : les 180 chaînes partent en production sans relecture.\n");
  writeFileSync(join(dir, "risque-orphelin.md"), risqueOrphelin, "utf8");
  writeFileSync(join(dir, "risque-repris.md"), risqueRepris, "utf8");
  writeFileSync(join(dir, "titree.md"), titree, "utf8");
  writeFileSync(join(dir, "titree-sale.md"), titreeSale, "utf8");
  const moi = fileURLToPath(import.meta.url);
  const rv = spawnSync(process.execPath, [moi, join(dir, "verte.md")], { encoding: "utf8" });
  const rr = spawnSync(process.execPath, [moi, join(dir, "rouge.md")], { encoding: "utf8" });
  const casse = [];
  if (rv.status !== 0) casse.push("la fixture VERTE ne passe pas : " + rv.stdout);
  if (rr.status !== 1) casse.push("la fixture ROUGE ne FAIL pas");
  else {
    for (const regle of ["S2", "S3", "S5", "S9", "S10", "S11", "S12", "S13", "S14", "S15", "S16",
                         "S17", "S18", "S19", "S20", "S21", "S22", "S23", "S24", "S25", "S26", "S27", "S28", "S30", "S33", "S34", "S35", "S36", "S37"]) {
      if (!new RegExp(`"${regle}"[^}]*FAIL`).test(rr.stdout)) casse.push(`la rouge échoue mais pas sur ${regle}`);
    }
  }
  // TF-0661 — S29 dans SES DEUX SENS.
  const ro = spawnSync(process.execPath, [moi, join(dir, "risque-orphelin.md")], { encoding: "utf8" });
  const rrep = spawnSync(process.execPath, [moi, join(dir, "risque-repris.md")], { encoding: "utf8" });
  if (!/"S29"[^}]*FAIL/.test(ro.stdout))
    casse.push("S29 : un risque declare NON COUVERT avec un bloc 8 vide passe pour conforme — declarer un risque n'est pas le traiter");
  if (!/"S29"[^}]*PASS/.test(rrep.stdout))
    casse.push("S29 : le MEME risque, la main passee au bloc 8, est accuse — la regle crie sur un travail juste");
  // 01/09 — S33 dans ses DEUX sens, et le durcissement de S30 dans le sien.
  const rsd = spawnSync(process.execPath, [moi, join(dir, "selecteur-double.md")], { encoding: "utf8" });
  if (!/"S33"[^}]*FAIL/.test(rsd.stdout))
    casse.push("S33 : deux actions portant le MÊME sélecteur passent pour désignables — le doublon ne se voit pas");
  if (!/"S33"[^}]*PASS/.test(rv.stdout))
    casse.push("S33 : la verte, dont chaque action porte son sélecteur A-N, est accusée — la règle crie sur un travail juste : " +
      (/"S33"[sS]{0,180}/.exec(rv.stdout) || [""])[0].replace(/s+/g, " "));
  const rnn = spawnSync(process.execPath, [moi, join(dir, "numero-nu.md")], { encoding: "utf8" });
  if (!/"S30"[^}]*FAIL/.test(rnn.stdout))
    casse.push("S30 : un numéro NU (« 1. ») passe encore pour un sélecteur de décision — c'est par cette tolérance " +
      "que le « 3 » d'une action s'est lu comme la décision 3");
  const rnd = spawnSync(process.execPath, [moi, join(dir, "numero-double.md")], { encoding: "utf8" });
  if (!/"S30"[^}]*FAIL/.test(rnd.stdout))
    casse.push("S30 : deux décisions portant le MÊME numéro passent pour sélectionnables — le doublon ne se voit pas");
  // 30/08 — S30 admet « D-5 » ; S31 et S32 dans leurs deux sens.
  const rnt = spawnSync(process.execPath, [moi, join(dir, "numero-tiret.md")], { encoding: "utf8" });
  if (!/"S15"[^}]*PASS/.test(rnt.stdout))
    casse.push("S15 accuse le SÉLECTEUR de la décision : la forme « D-12 — » que S30 prescrit est lue comme un "
      + "identifiant de registre nu — deux règles du même gabarit se contredisent : " +
      (/"S15"[\s\S]{0,180}/.exec(rnt.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S30"[^}]*PASS/.test(rnt.stdout))
    casse.push("S30 : la forme « D-12 — », celle que la doctrine prescrit, est refusée : " +
      (/"S30"[\s\S]{0,180}/.exec(rnt.stdout) || [""])[0].replace(/\s+/g, " "));
  // La forme de référence doit être LUE, pas seulement tolérée : deux décisions distinctes ne se
  // comptent pas comme une, et un numéro derrière un chevron reste un numéro.
  const rct = spawnSync(process.execPath, [moi, join(dir, "d3-citation.md")], { encoding: "utf8" });
  for (const regle of ["S4", "S15", "S16", "S30", "S31", "S32"]) {
    if (!new RegExp(`"${regle}"[^}]*PASS`).test(rct.stdout)) {
      casse.push(`la DÉCISION EN BLOC DE CITATION — la forme de référence — échoue sur ${regle} : ` +
        (new RegExp(`"${regle}"[\\s\\S]{0,180}`).exec(rct.stdout) || [""])[0].replace(/\s+/g, " "));
    }
  }
  const ron = spawnSync(process.execPath, [moi, join(dir, "options-nues.md")], { encoding: "utf8" });
  if (!/"S31"[^}]*FAIL/.test(ron.stdout))
    casse.push("S31 : des options sans coût ni exclusion passent pour un choix fermé — la règle ne crie jamais");
  if (!/"S31"[^}]*PASS/.test(rv.stdout))
    casse.push("S31 : la verte, dont chaque option porte son coût et ce qu'elle exclut, est accusée — la règle crie sur un travail juste");
  const rsr = spawnSync(process.execPath, [moi, join(dir, "sans-repli.md")], { encoding: "utf8" });
  if (!/"S32"[^}]*FAIL/.test(rsr.stdout))
    casse.push("S32 : une décision sans option par défaut nommée passe — ne pas trancher est pourtant une décision");
  if (!/"S32"[^}]*PASS/.test(rv.stdout))
    casse.push("S32 : la verte, qui nomme son option par défaut, est accusée — la règle crie sur un travail juste");
  const rt = spawnSync(process.execPath, [moi, join(dir, "titree.md")], { encoding: "utf8" });
  const rts = spawnSync(process.execPath, [moi, join(dir, "titree-sale.md")], { encoding: "utf8" });
  if (!/"S9"[^}]*PASS/.test(rt.stdout)) {
    casse.push("une ouverture TITRÉE et conforme n'est pas lue par S9 : " + (/"S9"[\s\S]{0,200}/.exec(rt.stdout) || [""])[0]);
  }
  if (!/"S9"[^}]*FAIL/.test(rts.stdout)) casse.push("une ouverture titrée mais TECHNIQUE passe S9 — le titre ne doit rien blanchir");
  // TF-0568 — LES QUATRE MISES EN PAGE DE LA MEME DECISION. La mesure du 24/08 est celle-ci :
  // le meme arbitrage, ecrit quatre fois, doit rendre le meme verdict. Avant correctif, une seule
  // des quatre passait — la puce unique de douze lignes — et les trois autres rendaient S15 FAIL
  // sur un chapeau vide ou tronque. Le cinquieme cas est le SENS ROUGE : meme tableau, chapeau
  // reduit a quatre mots, S15 doit continuer d'echouer. Sans lui, l'elargissement serait une
  // porte ouverte, et l'on aurait remplace une regle trop etroite par une regle qui ne juge rien.
  const CHAPEAU = "Publier la version corrigee de la forge de tests ? Le banc rouge vient de tourner en entier : " +
    "chaque defaut plante volontairement a ete detecte, donc la surveillance fonctionne et la version est prete.";
  const OPT_A = "(a) taguer v1.12.0 maintenant — recommande : le journal de recette `recette-S01.md` ne porte aucun defaut ouvert ;";
  const OPT_B = "(b) attendre le prochain lot — cout : les 26 commits restent locaux.";
  const DEFAUT = "sans decision : rien n'est publie.";
  const MISES_EN_PAGE = {
    "puce unique": `- ${CHAPEAU}\n  - ${OPT_A}\n  - ${OPT_B}\n  - ${DEFAUT}\n`,
    "puces filles a plat": `- ${CHAPEAU}\n- ${OPT_A}\n- ${OPT_B}\n- ${DEFAUT}\n`,
    "tableau separe": `- ${CHAPEAU}\n\n| option | ce qu'elle coute |\n|---|---|\n| ${OPT_A} | — |\n| ${OPT_B} | — |\n| ${DEFAUT} | — |\n`,
    "tableau sans puce": `${CHAPEAU}\n\n| option | ce qu'elle coute |\n|---|---|\n| ${OPT_A} | — |\n| ${OPT_B} | — |\n| ${DEFAUT} | — |\n`,
  };
  for (const [forme, corps] of Object.entries(MISES_EN_PAGE)) {
    const f = join(dir, `d3-${forme.replace(/ /g, "-")}.md`);
    writeFileSync(f, verte.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/, `## 3. Décisions attendues\n${corps}\n`), "utf8");
    const r = spawnSync(process.execPath, [moi, f], { encoding: "utf8" });
    for (const regle of ["S15", "S16"]) {
      if (!new RegExp(`"${regle}"[^}]*PASS`).test(r.stdout)) {
        casse.push(`mise en page « ${forme} » : ${regle} n'est pas PASS — ` +
          (new RegExp(`"${regle}"[\\s\\S]{0,180}`).exec(r.stdout) || [""])[0].replace(/\s+/g, " "));
      }
    }
  }
  {
    // Sens rouge de l'elargissement : la forme la plus permissive, avec un chapeau qui ne dit rien.
    const f = join(dir, "d3-tableau-chapeau-nu.md");
    const corps = `Publier la forge ?\n\n| option | cout |\n|---|---|\n| ${OPT_A} | — |\n| ${DEFAUT} | — |\n`;
    writeFileSync(f, verte.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/, `## 3. Décisions attendues\n${corps}\n`), "utf8");
    const r = spawnSync(process.execPath, [moi, f], { encoding: "utf8" });
    if (!/"S15"[^}]*FAIL/.test(r.stdout)) casse.push("un chapeau de quatre mots au-dessus d'un tableau passe S15 — l'elargissement blanchirait tout");
  }
  // TF-0573 — LE CHAPEAU COMMUN, dans ses deux sens. Le fait : onze decisions issues d'une meme
  // enquete. S15 demandant 25 mots de rappel a chacune, il ne restait qu'a repeter le contexte onze
  // fois (illisible) ou a le supposer connu (ce qui a produit « aucune mise en contexte »). Le bloc
  // 3 admet donc une prose de tete qui porte l'histoire UNE FOIS ; presente et substantielle, elle
  // abaisse le rappel du par decision. Sens rouge : SANS elle, les memes rappels courts echouent —
  // sinon on aurait supprime S15 en croyant l'assouplir.
  {
    const COMMUN = "Onze annonces immobilieres se sont retrouvees rattachees a la mauvaise commune, "
      + "decouvertes en corrigeant une anomalie de recherche : la donnee de rattachement venait du "
      + "libelle saisi et non du code officiel, et rien ne le verifiait a l'entree. Les decisions "
      + "ci-dessous partagent toutes cette cause et se lisent dans cet ordre.";
    const TROIS = ["premiere", "deuxieme", "troisieme"].map((r) =>
      `- Corriger le rattachement de la ${r} annonce, celle que la recherche affiche sous une commune voisine depuis le 12 aout ?\n`
      + `  - (a) recalculer depuis le code officiel — recommande : le referentiel `+ String.fromCharCode(96) + `communes.json` + String.fromCharCode(96) + ` porte le code ;\n`
      + `  - (b) laisser en l'etat — cout : la recherche continue de mentir.\n`
      + `  - sans decision : rien ne bouge.\n`).join("");
    const avec = verte.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/,
      `## 3. Décisions attendues\n\n${COMMUN}\n\n${TROIS}\n`);
    const sans = verte.replace(/## 3\. Décisions attendues[\s\S]*?(?=## 4\.)/,
      `## 3. Décisions attendues\n\n${TROIS}\n`);
    const fA = join(dir, "d3-chapeau-commun.md");
    const fS = join(dir, "d3-sans-chapeau.md");
    writeFileSync(fA, avec, "utf8");
    writeFileSync(fS, sans, "utf8");
    const rA = spawnSync(process.execPath, [moi, fA], { encoding: "utf8" });
    const rS = spawnSync(process.execPath, [moi, fS], { encoding: "utf8" });
    if (!/"S15"[^}]*PASS/.test(rA.stdout)) {
      casse.push("trois decisions sous un CHAPEAU COMMUN de 40 mots echouent S15 : " +
        (/"S15"[\s\S]{0,200}/.exec(rA.stdout) || [""])[0].replace(/\s+/g, " "));
    }
    if (!/"S15"[^}]*FAIL/.test(rS.stdout)) {
      casse.push("les memes rappels courts SANS chapeau commun passent S15 — l'assouplissement aurait supprime la regle");
    }
  }
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test restitution : 13/13 PASS (verte PASS ; ouverture titrée lue (TF-0567) ; ouverture titrée mais technique FAIL ; les QUATRE mises en page d'une même décision au bloc 3 rendent le même verdict (TF-0568) ; la CINQUIÈME, la décision en BLOC DE CITATION qui est la forme de référence, est LUE — S4, S15, S16, S30, S31 et S32 PASS, là où deux décisions fusionnaient en une seule sans numéro et un chapeau de quatre mots au-dessus d'un tableau reste FAIL ; un CHAPEAU COMMUN de 40 mots abaisse le rappel dû par décision (TF-0573) et son absence le rétablit ; rouge FAIL sur S2 horodatage, S3 verdict non factuel, S5 reste sans motif, S9 ouverture absente, S10 coût en jours, S11 auto_ia sans motif, S12 action humaine sans raison, S13 action humaine non exécutable, S14 action sans identifiant, S15 décision sans rappel de son sujet, S16 décision sans recommandation sourcée, S17 renvoi par position, S18 deux formes de tableau dans un bloc, S19 action sans conséquence, S20 jargon sans glose, S21 motif `acces` sans trace de la tentative, S22 négatif externe prononcé d'une seule sonde, S23 désignateur employé plusieurs fois sans glose, S24 absence conclue d'une recherche par nom, S30 décision sans numéro, S33 action sans sélecteur ; S30 dans ses DEUX sens (aucun numéro, puis deux décisions portant le même) et la forme « D-5 — » ADMISE, celle que la doctrine prescrit ; S31 dans ses DEUX sens (options nues FAIL, options portant coût et exclusion PASS) ; S32 dans ses DEUX sens (décision sans option par défaut FAIL, décision la nommant PASS) ; S29 dans ses DEUX sens : un risque declare NON COUVERT avec un bloc 8 vide echoue, le meme risque avec la main passee passe ; S33 dans ses DEUX sens (deux actions portant le meme selecteur FAIL, la verte et ses A-1/A-2/A-3 PASS) ; et le DURCISSEMENT de S30 du 01/09 : le numero NU « 1. », qu'elle acceptait, FAIL desormais — c'est par cette tolerance que le « 3 » d'une action se lisait comme la decision 3)");
  process.exit(casse.length ? 1 : 0);
}

if (!arg || !existsSync(arg)) {
  console.log(JSON.stringify({ oracle: "oracle-synthese", verdict: "ERREUR", message: "synthèse introuvable — usage : node oracle-synthese.mjs <synthese.md> | --self-test" }));
  process.exit(2);
}
const findings = juger(readFileSync(arg, "utf8"));
const verdict = verdictDe(findings);
console.log(JSON.stringify({
  oracle: "oracle-synthese",
  version: "1.2.0",
  cible: arg,
  verdict,
  findings,
  non_juge: [
    "la JUSTESSE du verdict, la pertinence d'un risque, la sincérité d'un motif — cet oracle tient la forme opposable, jamais le fond",
    "la longueur de prose (≤ 400 mots) n'est pas mesurée ici : séparer récit et énumération demande une lecture, pas un compteur",
    "la SINCÉRITÉ d'un motif S11/S12 : `hors_mandat` apposé sur une action que le mandat courant couvre contourne S11 au lieu de la satisfaire, et aucun oracle ne peut le voir — seul un lecteur le peut",
    "S18 ne juge que la cohérence INTRA-document : deux tableaux d'en-têtes différents dans un même bloc. La stabilité d'un TOUR AU SUIVANT — le vrai défaut mesuré le 22/08, cinq mises en page pour un même contenu — demanderait de conserver l'état du tour précédent ; elle est déclarée ici plutôt que faussement promise",
    "S19 n'exige PAS de recommandation sur une action, à la différence de S16 sur une décision : une action n'offre pas toujours un choix, et l'exiger partout produirait du remplissage. L'asymétrie est voulue",
    "S20 ne voit QUE les termes du référentiel `gabarits\\JARGON-A-GLOSER.json` : un jargon qui n'a encore coûté aucun aller-retour n'est pas détecté. C'est le prix assumé du zéro faux positif — dans ce corpus la MAJUSCULE sert l'emphase, et une heuristique sur les sigles crierait sur « MESURE » et « AUCUNE ». Le canal de croissance de la liste est le retour humain, pas la devinette",
    "S20 ne juge pas la JUSTESSE d'une glose : la présence d'une parenthèse après le terme, jamais qu'elle explique vraiment",
    "S21 ne juge pas la SINCÉRITÉ d'une trace : un code de réponse recopié sans avoir été obtenu la satisfait. Elle rend le mensonge PLUS COÛTEUX — il faut inventer un code plausible — mais elle ne le rend pas impossible",
    "S21 ne couvre PAS `decision`, `depense` ni `irreversible` : ces trois motifs relèvent d'un arbitrage, pas d'un fait du monde, et exiger d'« essayer » une décision n'aurait aucun sens. Une attribution abusive sous `decision` reste donc invisible — c'est la limite assumée, et c'est exactement le cas fautif qui a fait naître la règle",
  ],
}, null, 1));
process.exit(verdict === "PASS" ? 0 : 1);
