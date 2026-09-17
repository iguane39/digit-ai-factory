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
 *   S38 une action de TEST `auto_ia` n'est pas laissée non exécutée sous un motif d'EXEMPTION
 *       (`hors_mandat`, `borne_atteinte`) — un test jouable s'exécute, règle 40 (08/09, TF-0923) ;
 *   S39 une remontée annoncée au bloc 4 porte son identifiant — « remonté » sans identifiant se lit
 *       « traité » et vaut « déposé, non traité », donc un reste du bloc 5 (08/09, TF-0923) ;
 *   S40 un chemin de livrable cité sous `output\` n'emprunte pas le préfixe daté « AAAAMMJJ-… »,
 *       forme RÉSERVÉE à `output\03-etudes\` — partout ailleurs R-4 s'applique (08/09, TF-0923) ;
 *   S41 une décision portant un mot que la DOCTRINE du projet régit cite cette doctrine en source :
 *       une source qui n'est pas celle qui tranche est une opinion sourcée (08/09, TF-0923) ;
 *   S43 (12/09/2026, TF-1064) le STYLE de la restitution relève du plancher d'écriture
 *       (references\ECRITURE.md) : verdict délégué à oracle-ecriture.mjs — FAIL si l'oracle
 *       échoue, avertissements comptés, SANS_OBJET si l'oracle manque ; non bloquante ;
 *   S42 le chemin RELATIF du fichier jugé, et de chaque chemin de livrable cité sous `output\`,
 *       augmenté des 26 caractères du sidecar d'oracle, tient sous 150 caractères (11/09, TF-1015) —
 *       R-4 juge la FORME du nom et jamais sa LONGUEUR : un nom conforme peut rendre le dépôt
 *       inclonable sur un chemin profond, et le défaut ne se voit que chez celui qui VÉRIFIE ;
 *   S51 le bloc 1 porte l'INTENTION initiale de la demande et son TEST RÉTRO (17/09, TF-0791) —
 *       loi transverse n° 7 : la règle ne mordait que sur l'étude d'opportunité, quand le retour humain
 *       du 01/09 disait « tous types de demande ». Présence des deux pièces, jamais leur justesse ;
 *   S50 un POINT D'ÉTAPE déclaré au bloc 1 porte ses blocs 1, 4 et 8 PLEINS (17/09, TF-1182) —
 *       la forme échange le verdict contre ces trois blocs ; vide, elle n'est qu'une exemption
 *       déguisée en forme jugée. S1 admet alors le bloc 2 sous son titre de mesure, et S3 y juge
 *       la mesure attendue et l'outil qui la rendra à défaut d'un verdict chiffré ;
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
import { existsSync, readFileSync, writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chargerLexique, termesEmployes } from "./lib-lexique.mjs";

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

// ---- LE POINT D'ÉTAPE (TF-1182, 17/09/2026) — UNE FORME ÉCRITE AU GABARIT ET INCONNUE DE SON JUGE
//
// LE FAIT, mesuré le 17/09 : `grep` de « point d'étape » dans ce fichier rendait ZÉRO occurrence,
// alors que `gabarits\RESTITUTION.md` prescrit la forme depuis la v2.22.0 (TF-0979). Un point
// d'étape écrit À LA LETTRE du gabarit — bloc 2 remplacé par « ce qui reste à mesurer, et par
// quoi » — rendait donc S1 FAIL (« bloc 2 absent ») et S3 FAIL (« verdict sans fait mesurable »),
// les deux BLOQUANTES. Le seul moyen de passer le hook était de DÉGUISER le point d'étape en
// verdict, c'est-à-dire d'écrire un verdict partiel — exactement ce que la forme existe pour
// éviter. *Une forme que le gabarit prescrit et que son juge refuse n'est pas une forme : c'est
// un piège, et il apprend à contourner.*
//
// CE QUI N'EST PAS UN ASSOUPLISSEMENT, et c'est la raison pour laquelle la forme reste JUGÉE. Le
// point d'étape n'enlève pas d'obligation, il en ÉCHANGE une : le verdict, qu'aucune mesure ne
// porte encore, contre la ligne qui dit CE QUI RESTE À MESURER ET PAR QUOI (S3, second sens) et
// contre l'exigence que les blocs 1, 4 et 8 soient PLEINS (S50). Un tour qui n'a rien produit
// n'est pas un point d'étape : c'est un accusé de réception, et son exemption a ses propres
// bornes (§Portée, TF-0990).
//
// LA DÉCLARATION SE FAIT AU BLOC 1, et nulle part ailleurs : le gabarit l'écrit (« il le DÉCLARE
// en tête, par la mention `point d'étape` dans le bloc 1 »). Chercher la mention dans tout le
// document ferait basculer en mode allégé toute restitution qui PARLE d'un point d'étape.
const POINT_ETAPE = /\bpoint\s+d\s*['’]\s*[ée]tape\b/i;
// Le bloc 2 d'un point d'étape porte le titre que la forme lui donne. Les deux titres sont admis —
// « ## 2. Ce qui reste à mesurer, et par quoi » comme « ## 2. Verdict » gardé par habitude —, parce
// que ce qui est opposable est la LIGNE de mesure, jamais la typographie du titre (leçon TF-0566).
const BLOC_MESURE = new RegExp(`(^|\n)#{1,4}\\s*${NUM}(?:ce\\s+qui\\s+)?(?:reste\\s+)?[àa]\\s+mesurer`, "i");
// Un bloc « plein » : ni vide, ni une déclaration d'absence, et assez de matière pour être lu.
// Le compte porte sur les JETONS commençant par une lettre ou un chiffre — les séparateurs « · »
// et les tirets d'une ligne d'en-tête ne gonflent pas la mesure.
const compteMots = (s) => (String(s).match(/[\p{L}\p{N}]\S*/gu) || []).length;
// UNE DÉCLARATION D'ABSENCE EST COURTE PAR NATURE — « aucune », « rien à signaler », « sans
// objet ». Chercher le mot dans un bloc LONG accuse un bloc plein : mesuré sur les 148 synthèses
// d'`output\04-plans\`, la première écriture de cette règle rendait UN faux positif, et sur la
// colonne que le gabarit PRESCRIT lui-même au bloc 8 — « Si rien n'est fait ». Un contrôle qui
// accuse la forme prescrite s'apprend à contourner (R-33 bis) : la borne de longueur est donc
// dans la règle, pas dans la fixture.
const declareSonVide = (t) => compteMots(t) <= 20 && MOTIFS_ABSENCE.test(t);
const estPlein = (b, seuil) => {
  const t = String(b || "").trim();
  if (!t || declareSonVide(t)) return false;
  return compteMots(t) >= seuil;
};

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
// TF-0805 (05/09/2026, lot du produit 02 — même classe que TF-0799 chez forge-conception) : dans le
// moteur de Node, `\b` est ASCII — un accent vaut frontière de mot. « mesuré » ne matchait donc
// jamais `\bmesur[ée]e?s?\b` (le « é » final n'est pas un caractère de mot, la frontière n'existe
// pas), et « réelle » déclenchait une garde du pronom « elle ». Ce qui suit réécrit `\b` en
// frontière Unicode ÉQUIVALENTE (lettre/chiffre/souligné d'un côté, rien de tel de l'autre) et
// pose le drapeau `u`. Seuls les motifs où une classe accentuée touche `\b` passent par ici —
// une règle réécrite sans mesure serait une règle changée sans raison.
const _FRONTIERE_UNICODE = "(?:(?<![\\p{L}\\p{N}_])(?=[\\p{L}\\p{N}_])|(?<=[\\p{L}\\p{N}_])(?![\\p{L}\\p{N}_]))";
const uni = (re) => new RegExp(re.source.split("\\b").join(_FRONTIERE_UNICODE), re.flags.includes("u") ? re.flags : re.flags + "u");
const _LOCALISATEURS = /(`[^`]+`|\.(md|json|mjs|py|html|jsonl|ya?ml|jsx?|tsx?|css|scss|txt|csv|toml|ini|cfg|conf|sh|ps1|sql|xml|env|lock)\b|\b[a-f0-9]{7,40}\b)/;
const preuve = (s) => _JETONS.test(s) || _CHIFFRES.test(s) || _LOCALISATEURS.test(s);

// UN FRAGMENT ENTRE ACCENTS GRAVES EST UNE CITATION, JAMAIS UNE DÉCLARATION D'INTENTION
// (TF-0987 et TF-0992, 16/09/2026). Deux règles se sont trompées de la même façon, à huit jours
// d'écart, en cherchant un vocabulaire FERMÉ dans un texte NON DÉLIMITÉ :
//   · S21 a lu le nom d'une colonne de tableur — `presence` — comme le motif d'une action dont le
//     motif déclaré était `decision`, que la règle exclut pourtant explicitement de sa portée. Le
//     contournement a été de RENOMMER la colonne du livrable : un oracle de forme dictait le
//     schéma d'un livrable de données ;
//   · S37 a lu `corriges: []` — le NOM D'UN CHAMP dans une sortie VERTE qui déclare qu'il n'y a eu
//     AUCUNE correction — comme une correction restituée sans classe. Le seul remède offert à
//     l'auteur était de paraphraser sa propre preuve, c'est-à-dire d'abîmer une citation exacte
//     pour satisfaire un contrôle, sur le seul bloc dont la valeur est d'être exact.
// Les deux défauts sont symétriques : le premier rendait la règle BAVARDE sur une action
// irréprochable, le second la rendait bavarde sur une preuve juste. Le remède est le même, et il
// est de PÉRIMÈTRE, pas de frontière de mot : on retire le code avant de chercher de la prose.
// Ce qui est retiré n'est PAS perdu pour tout le monde — `preuve()` et `_LOCALISATEURS`
// continuent de lire la ligne ENTIÈRE, parce qu'un chemin entre accents graves est précisément
// ce qu'ils cherchent. Seule la recherche de VOCABULAIRE passe par ici.
const horsCode = (s) => String(s)
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/`[^`]*`/g, " ");

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

// OU UN MOTIF EST DECLARE (TF-0987, 16/09/2026) — et pourquoi la question se pose.
//
// S11, S12 et S21 cherchent un vocabulaire FERME (`acces`, `presence`, `decision`,
// `gate_gouvernance`…) dans le groupe de puce ENTIER. Or le groupe porte aussi le COMMENT de
// l'action : un chemin, une commande, un libelle d'ecran, le nom d'une colonne de livrable. Le
// 12/09, l'action A-16 d'une restitution reelle portait le motif `decision` et disait comment
// faire — « ouvrir le livrable et trier sur la colonne `presence` ». S21 a compte DEUX actions
// concernees au lieu d'une et rendu FAIL, sur une action dont le motif declare est explicitement
// HORS de sa portee. Le contournement a coute le renommage d'une colonne dans un livrable de
// donnees : un oracle de forme dictant un schema, ce qui est l'inverse du service rendu.
//
// La lecture juste n'est pas une frontiere de mot plus fine, c'est un PERIMETRE : le motif se lit
// LA OU IL EST DECLARE. Le gabarit le prescrit a deux endroits, et les deux sont nommes :
//   · en TABLEAU — la forme par defaut depuis la v2.9.0 — dans la COLONNE « Motif / raison ». Le
//     groupe est alors l'en-tete suivi de sa ligne de donnees (`actionsGroupees` les joint) : la
//     colonne se retrouve par son INDEX, et la cellule est lue seule ;
//   · en PUCE, derriere son libelle — « motif de non-execution : », « pourquoi pas l'IA : ».
// Sans aucune declaration reperable, on rend le groupe ENTIER : ne rien trouver ne doit jamais
// AFFAIBLIR la regle. Mais on le rend SANS ses citations de code — un identifiant entre accents
// graves est une citation, jamais une declaration d'intention (`horsCode`).
function zoneMotif(groupe) {
  const g = String(groupe);
  if (/^\s*\|/.test(g)) {
    const parts = g.split("|");
    if (parts.length > 2 && !parts[0].trim() && !parts[parts.length - 1].trim()) {
      const cells = parts.slice(1, -1);
      // en-tete (N cellules) + separateur de jonction (1) + donnees (N) => 2N+1
      if (cells.length % 2 === 1) {
        const n = (cells.length - 1) / 2;
        const entete = cells.slice(0, n).map((c) => c.trim());
        const donnees = cells.slice(n + 1).map((c) => c.trim());
        const i = entete.findIndex((c) => /motif|raison/i.test(c));
        if (i >= 0 && donnees[i] !== undefined) return donnees[i];
      }
    }
  }
  const LABELS = /(?:motifs?|pourquoi\s+pas\s+l['’]\s*IA|raisons?)(?:\s+de\s+non[- ]?ex[ée]cution)?\s*[:：]\s*([^\n;·|]*)/gi;
  const trouves = [...g.matchAll(LABELS)].map((m) => m[1]);
  return trouves.length ? trouves.join(" · ") : horsCode(g);
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
const RE_TETE_CITATION = /^>\s*\**\s*(?:d[ée]cision\s*)?(?:n[°ºo]\s*)?(?:D\s*-?\s*)?\d{1,3}\s*(?:[.)\-–—:·]|\*\*|\s)/i;
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

// `cheminJuge` — le chemin du fichier passé en argument, quand il y en a un. S42 (TF-1015) juge
// la LONGUEUR d'un chemin, donc elle a besoin du chemin ; toutes les autres règles ne lisent que
// le texte et ne le voient jamais. Facultatif : `juger(texte)` reste valide, S42 ne mesure alors
// que les chemins CITÉS.
function juger(texte, cheminJuge = null) {
  const findings = [];
  const ok = (regle, message) => findings.push({ regle, statut: "PASS", message });
  const ko = (regle, message) => findings.push({ regle, statut: "FAIL", message });

  // Le POINT D'ÉTAPE se DÉCLARE, et il se déclare au bloc 1 (TF-1182). Sans bloc 1 reconnu, la
  // mention n'est pas une déclaration : le document est jugé comme une restitution ordinaire.
  const pointEtape = POINT_ETAPE.test(bloc(texte, BLOCS[0][0]) || "");

  // S1 — les 8 blocs
  const absents = BLOCS.filter(([re], i) => {
    if (re.test(texte)) return false;
    // Point d'étape : le bloc 2 est REMPLACÉ par « ce qui reste à mesurer, et par quoi », donc son
    // titre ne porte pas le mot « verdict ». Exiger le mot refusait la forme que le gabarit
    // prescrit ; le bloc, lui, reste EXIGÉ — sous son autre titre (TF-1182).
    if (pointEtape && i === 1 && BLOC_MESURE.test(texte)) return false;
    return true;
  }).map(([, nom]) => nom);
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
  // POINT D'ÉTAPE (TF-1182) : le bloc 2 ne porte pas de verdict, il porte la MESURE ATTENDUE et
  // L'OUTIL QUI LA RENDRA. La règle ne disparaît pas, elle change d'objet — et elle reste exigeante
  // sur le même point : nommer une chose vérifiable. « On verra demain » échoue des deux côtés.
  const bVerdict = bloc(texte, BLOCS[1][0]) || (pointEtape ? bloc(texte, BLOC_MESURE) || "" : "");
  if (pointEtape) {
    // DEUX ISSUES, et l'alternative n'est pas une complaisance : elle est ce qui rend la règle
    // NON RÉGRESSIVE. Mesuré sur les 148 synthèses d'`output\04-plans\` : cinq déclarent « point
    // d'étape » au bloc 1, et QUATRE portent malgré tout un verdict chiffré — un mandat long est
    // souvent un point d'étape ET une mesure. N'admettre que la ligne de mesure aurait accusé ces
    // quatre-là sur une règle BLOQUANTE, c'est-à-dire fait échouer 2,7 % d'un corpus non réécrit
    // au nom d'une forme censée l'aider. Ce qui reste refusé est le seul cas que la forme existe
    // pour attraper : un bloc 2 qui ne mesure RIEN et ne dit pas non plus ce qui reste à mesurer.
    const mesure = /mesur/i.test(bVerdict) && _LOCALISATEURS.test(bVerdict);
    if (mesure) ok("S3", "point d'étape : ce qui reste à mesurer est nommé, avec l'outil qui le rendra");
    else if (preuve(bVerdict)) ok("S3", "point d'étape : le bloc 2 porte un fait mesurable");
    else ko("S3", "point d'étape sans fait mesurable NI ligne « ce qui reste à mesurer, et par quoi » — nomme la mesure "
      + "attendue ET l'outil qui la rendra (une commande, un oracle, un fichier), ou porte un verdict chiffré ; "
      + "« on regardera demain » n'est ni l'un ni l'autre");
  } else preuve(bVerdict)
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
    // L'IRRÉEL DU PASSÉ DÉCRIT UN ÉVÉNEMENT QUI N'A PAS EU LIEU (TF-1125, 15/09/2026). Sur une
    // note de déploiement réelle, la puce « la liaison est traitée dans le client, là où elle
    // AURAIT FAIT échouer la publication » rendait S8 FAIL alors qu'elle porte sa preuve exécutée
    // en sous-puce : le fragment désigne même un défaut que le code ÉVITE, soit le contraire d'une
    // complétion revendiquée. La correction subie a été d'écrire « aurait bloqué », sans aucun gain
    // de sens — une règle qui fait réécrire du texte juste se paie en confiance.
    //
    // C'est la TROISIÈME tournure retirée, et les trois partagent un trait mécanique : le mot
    // « fait » n'y est pas au passé composé de l'indicatif. On retire donc la FAMILLE — auxiliaire
    // `avoir` au conditionnel ou au subjonctif passé — plutôt qu'une tournure de plus : « aurait
    // fait », « auraient pu faire », « eût fait », « eussent fait ». Le TEMPS du verbe suffit à
    // trancher, aucune analyse sémantique n'est requise. La piste de fond — tester le temps plutôt
    // que le lemme, et couvrir les trois d'un coup — reste ouverte au registre.
    .replace(/\b(?:aurai[ts]|aurions|auriez|auraient|eut|eût|eusse|eussent|eussions|eussiez)\s+(?:pu\s+)?fai(?:t|re)\b/gi, " ")
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
    if (!uni(/(✓|\bfait\b|\btermin[ée]|\bsold[ée]|\bclos\b)/i).test(sansConditionnel(l))) return false;
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

  const juger8 = (regle, cible, predicat, siKo, siOk, { cibleSurMotif = false } = {}) => {
    const concernes = groupes8.filter((g) => cible.test(cibleSurMotif ? zoneMotif(g) : g));
    if (!concernes.length) return ok(regle, `aucune action concernée — ${siOk}`);
    const fautifs = concernes.filter((g) => !predicat(g, zoneMotif(g)));
    fautifs.length
      ? ko(regle, `${fautifs.length} action(s) sur ${concernes.length} — ${siKo} Ex. : ${fautifs[0].replace(/\s+/g, " ").trim().slice(0, 110)}`)
      : ok(regle, `${concernes.length} action(s) concernée(s) — ${siOk}`);
  };

  juger8("S11", /\bauto_ia\b/, (g, zm) => MOTIFS_IA.test(zm),
    "une action `auto_ia` listée en RESTE sans motif de non-exécution : la voie automatisée est le défaut, " +
    "donc ce qui n'a pas été fait se justifie. Vocabulaire : gate_gouvernance, dependance_bloc_3, garde_fou, borne_atteinte, dependance_externe, hors_mandat.",
    "chaque action `auto_ia` non exécutée porte son motif");

  juger8("S12", HUMAINS, (g, zm) => MOTIFS_HUMAIN.test(zm),
    "une action laissée à l'humain sans raison d'impossibilité IA — loi transverse n° 5. " +
    "Vocabulaire : acces, decision, depense, presence, irreversible (non accentués).",
    "chaque action humaine porte sa raison d'impossibilité");

  // Le nom d'acteur est retiré avant la mesure : `manuelle_dev` est lui-même un span de code, et
  // le laisser rendrait la règle satisfaite par sa propre étiquette — la boucle la plus bête.
  // 14/09/2026 (TF-1085, D-9 (a)) — IL SE RETIRE AVEC SES ACCENTS GRAVES, EN UNE FOIS. Le retrait
  // précédent passait d'abord `ACTEURS`, sans drapeau `g` : il ôtait le MOT et laissait « ` ` »,
  // deux accents graves autour d'une espace, que le second remplacement ne voyait plus et que
  // `_LOCALISATEURS` comptait comme un chemin. S13 ne pouvait donc JAMAIS refuser une action écrite
  // au format canonique (acteur entre accents graves). Prouvé sur la synthèse du 17/08 du banc des
  // défauts échappés : PASS avec les accents graves, FAIL sans eux, au mot près.
  juger8("S13", HUMAINS, (g) => _LOCALISATEURS.test(g.replace(/`?\b(auto_ia|manuelle_dev|manuelle_utilisateur)\b`?/g, " ")),
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
  juger8("S14", ACTEURS, (g) => ID_STABLE.test(g.replace(/\bA\s*-?\s*\d{1,3}\b/g, " ")) || DECLAREE_NEUVE.test(g),
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
  const RE_SELECTEUR_ACTION = /^(?:\*\*|`|\s)*(?:action\s*(?:n[°ºo]\s*)?|A\s*-?\s*)(\d{1,3})\b/i;
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
    const ECRITURE = uni(/\b(cr[ée]er|ajouter|[ée]crire dans|coller|ins[ée]rer|renseigner)\b[^.;|]{0,60}\b(ligne|variable|fichier|cl[ée]|entr[ée]e|section)\b/i);
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
    const renvois = puces(bTraite).filter((l) => uni(/(pr[ée]par[ée]e?s?\b|pr[êe]te?s? [àa] (coller|poser|copier)|\bvoir A-\d+)/i).test(l) && !_JETONS.test(l));
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
    // TF-0992 : le BALAYAGE ignore les citations de code — `corriges: []` est le nom d'un champ
    // dans une sortie verte, pas une correction restituée. La recherche du MARQUEUR, elle, garde
    // la ligne entière : un « rouge → vert » cité dans une sortie compte comme preuve.
    const corrections = puces(bTraite).filter((l) => uni(/\bcorrig[ée]/i).test(horsCode(l)));
    const sansClasse = corrections.filter((l) => !/(rouge|vert|fixture|recette|classe|self-test|banc|double sens|\d+\s*\/\s*\d+)/i.test(l));
    sansClasse.length
      ? ko("S37", `${sansClasse.length} correction(s) restituée(s) sans contrôle rouge → vert ni classe nommée — une correction après retour humain traite le symptôme, jamais la classe : « ${sansClasse[0].trim().slice(0, 90)} »`)
      : ok("S37", corrections.length ? "chaque correction restituée porte son contrôle rouge → vert ou nomme sa classe" : "aucune correction restituée");
  }

  // ---- S38 et S39 (08/09/2026, TF-0923 — deux des six volets proposés le 08/09 et jamais joués) -
  //
  // Le constat qui les fait naître est le même pour les six : la doctrine correspondante était
  // écrite et opposable, et AUCUN contrôle ne la jouait. Une règle que rien n'exécute décore.
  //
  // S38 — UN TEST JOUABLE S'EXÉCUTE ; UN MOTIF D'EXEMPTION NE LE DISPENSE PAS. Le fait du 07/09
  // (TF-0905) : une réponse a PROPOSÉ trois niveaux de tests, tous jouables en lecture seule, sans
  // en exécuter un seul. La règle 40 — « un test proposé s'exécute » — existait ; S11 ne vérifiait
  // que la PRÉSENCE d'un motif de non-exécution, jamais sa légitimité. Or deux des six motifs du
  // vocabulaire de S11 sont des motifs d'EXEMPTION — `hors_mandat` et `borne_atteinte` : ils
  // disent « ce n'est pas à moi » ou « j'ai atteint ma borne », et ils satisfont S11 sans que rien
  // n'ait été mesuré. Apposés sur une action de TEST, ils transforment la règle 40 en intention.
  //
  // POURQUOI CES DEUX-LÀ SEULEMENT, et pas les quatre autres. `dependance_bloc_3`,
  // `gate_gouvernance`, `garde_fou` et `dependance_externe` nomment un OBSTACLE extérieur à
  // l'auteur : une décision qu'il n'a pas prise, une gate humaine, un service qui ne répond pas.
  // Un test réellement bloqué par l'un d'eux reste non exécuté sans faute — et la fixture verte le
  // prouve, sans quoi cette règle mordrait sur un travail juste. Les deux motifs d'exemption, eux,
  // sont des déclarations de PÉRIMÈTRE que l'auteur écrit seul : c'est le seul endroit où le
  // vocabulaire de S11 peut servir à se dispenser de mesurer.
  {
    const bActions = bloc(texte, BLOCS[7][0]) || "";
    // LE NOM D'UNE FORGE N'EST PAS UN TEST, et le premier jet de cette regle l'a oublie : le
    // depot frere « forge-tests » contient le mot, donc « verser chez forge-tests la candidature
    // d'un controle » — action de DEPOT, ou `hors_mandat` est le motif JUSTE puisque le mandat
    // appartient a l'autre forge — etait lue comme un test esquive. Mesure sur les 95 syntheses
    // reelles de `output\04-plans\` : 22 accusations, dont celle-la. Meme classe que le `\bPASS\b`
    // qui matchait « passe » : la frontiere de mot ne separe pas un nom compose de son composant.
    // On retire donc les noms de forge AVANT de mesurer, et l'on exige un VERBE D'EXECUTION : la
    // regle 40 dit « un test propose s'EXECUTE », elle ne dit rien d'un test qu'on mentionne.
    const sansNomDeForge = (g) => g.replace(/\bforge-[a-z-]+/gi, " ");
    const TEST = uni(/\b(jouer|rejouer|ex[ée]cuter|lancer|relancer|mesurer|d[ée]rouler)\b[^.;|]{0,60}\b(tests?|recettes?|bancs?|couverture|self-test|jeu d'essai)\b/i);
    const EXEMPTION = /\b(hors_mandat|borne_atteinte)\b/;
    const testsIA = actionsGroupees(bActions).filter((g) => /\bauto_ia\b/.test(g) && TEST.test(sansNomDeForge(g)));
    const esquives = testsIA.filter((g) => EXEMPTION.test(g));
    esquives.length
      ? ko("S38", `${esquives.length} action(s) de TEST sur ${testsIA.length} sont laissées non exécutées sous un motif d'EXEMPTION (\`hors_mandat\`, \`borne_atteinte\`) — un test jouable s'exécute (règle 40) ; ces deux motifs déclarent un périmètre, ils ne mesurent rien : « ${esquives[0].replace(/\s+/g, " ").trim().slice(0, 110)} »`)
      : ok("S38", testsIA.length ? `${testsIA.length} action(s) de test \`auto_ia\` — aucune ne s'exempte de mesurer` : "aucune action de test `auto_ia` non exécutée");
  }
  // S39 — « REMONTÉ » N'EST PAS « TRAITÉ », SAUF SI LE DÉPÔT EST TRAÇABLE. Déposer un constat chez
  // une autre forge est un geste réel, et le bloc 4 a raison de le dire. Mais SANS IDENTIFIANT, le
  // lecteur ne peut ni retrouver ce qui a été remonté, ni savoir si quelqu'un l'a pris : la ligne
  // se lit « traité » et vaut « déposé, non traité » — c'est-à-dire un reste, qui appartient au
  // bloc 5 avec son motif (S5). Avec son identifiant, elle redevient ce qu'elle prétend être : une
  // chose qu'on peut aller voir. La règle ne juge donc PAS la remontée, elle juge sa traçabilité.
  {
    const bTraite = bloc(texte, BLOCS[3][0]) || "";
    const remontees = puces(bTraite).filter((l) => uni(/\bremont[ée]e?s?\b/i).test(l));
    const sansId = remontees.filter((l) => !ID_STABLE.test(l));
    sansId.length
      ? ko("S39", `${sansId.length} remontée(s) sur ${remontees.length} sont annoncées au bloc 4 SANS identifiant — « remonté » sans identifiant se lit « traité » et vaut « déposé, non traité » : la ligne appartient au bloc 5 avec son motif, ou porte l'identifiant qui la rend retrouvable : « ${sansId[0].trim().slice(0, 90)} »`)
      : ok("S39", remontees.length ? `${remontees.length} remontée(s) du bloc 4 portent leur identifiant` : "aucune remontée annoncée au bloc 4");
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
  const TRACE_MOT = uni(/(exit\s*\d|permission denied|access denied|\btent[ée]e?s?\b|\bessay[ée]e?s?\b|\brefus[ée]e?s?\b|\bmesur[ée]e?s?\b)/i);
  const TRACE_TENTATIVE = { test: (g) => TRACE_CODE.test(g) || TRACE_MOT.test(g) };
  juger8("S21", MOTIFS_MESURABLES, (g) => TRACE_TENTATIVE.test(g) && preuve(g),
    "un motif `acces` ou `presence` SANS trace mesurée de la tentative : l'impossibilité est affirmée, " +
    "pas éprouvée. Ces deux motifs affirment un FAIT DU MONDE, donc ils se mesurent — un code de " +
    "réponse, un message d'erreur, une sortie de commande, dans le même groupe de puce. " +
    "`decision`, `depense` et `irreversible` relèvent d'un arbitrage et ne sont pas concernés.",
    "chaque motif `acces`/`presence` porte la trace mesurée de sa tentative",
    // TF-0987 : la CIBLE de S21 est elle-même un motif, donc elle se lit dans la zone où un motif
    // est DÉCLARÉ — pas dans le « comment » de l'action, qui cite des noms de colonnes.
    { cibleSurMotif: true });

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
  const DECLARE_UNE_ABSENCE = uni(/\b(inchang[ée]|aucun(?:e)?\s+(?:fichier|[ée]criture|d[ée]p[ôo]t)|propre\b|rien n(?:'|’)a|hors ce rapport)/i);
  const MARQUEUR_FAIBLE = uni(/\ba (?:bien )?(?:[ée]t[ée] )?(?:cr[ée]{1,2}|[ée]crit|ajout[ée]|d[ée]pos[ée]|enregistr[ée])\b|\best (?:bien )?(?:ignor[ée]|prot[ée]g[ée]|en s[ée]curit[ée])\b/i);
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
  const IDENTITE_AFFIRMEE = uni(/\b(le m[êe]me fichier|m[êe]me contenu|fichiers? identiques?|sont identiques|un doublon|doublon de|dupliqu[ée]|duplicata|deux fois le m[êe]me)\b/i);
  //: L'indice qui ne prouve rien : ce qu'on lit AUTOUR du fichier, jamais dedans.
  const INDICE_METADONNEE = uni(/\b(m[êe]mes? (?:taille|poids|date|horodatage|nom|nombre de lignes)|taille identique|\d[\d   ]*\s*octets|m[êe]me nombre de (?:lignes|octets))\b/i);
  //: Ce qui, lui, établit l'identité — et dont le coût est nul.
  const EMPREINTE = uni(/\b(empreinte|sha-?\d*|hash|md5|checksum|somme de contr[ôo]le|diff\b|octet par octet|contenu compar[ée]|comparaison de contenu)\b/i);
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
  const MISE_EN_CAUSE = uni(/\b(forge-[a-z-]+|l'oracle|le contr[ôo]le|le pan|l'outil|la sonde)\b[^.;!?]{0,90}\b(aurait d[ûu] (?:le |la |les |l')?(?:voir|d[ée]tecter|refuser|attraper)|n'(?:a|ont) pas (?:vu|d[ée]tect[ée]|refus[ée]|attrap[ée])|a laiss[ée] passer|est en d[ée]faut|est fauti[fv])\b/i);
  const VERIFICATION = uni(/\b(v[ée]rifi[ée]|rejou[ée]|mesur[ée]|reproduit|jou[ée] sur|ex[ée]cut[ée]|preuve|sortie|exit \d|constat[ée] par)\b/i);
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
    // UNE ACTION EN TABLEAU EST UNE ACTION (16/09/2026). S29 ne reconnaissait qu'une PUCE, et le
    // gabarit prescrit le bloc 8 en TABLEAU UNIQUE depuis la v2.9.0 : une restitution conforme à
    // S18 rendait donc « aucune action » pour S29, qui concluait « risque déclaré non couvert et
    // rien à faire » sur un bloc 8 plein. *Deux règles du même référentiel se contredisaient* —
    // exactement le défaut que TF-0508 avait corrigé pour S11 à S14, repris ici sur une règle plus
    // jeune. Le constat a été fait sur la première restitution qui a exercé les deux ensemble.
    const aUneAction = /^\s*(?:\d+\.|[-*])\s+\S/m.test(b8) || lignesDeDonnees(b8).length > 0;
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
  //
  // TF-0998 (09/09/2026) — LE MOT « motif » EST SORTI DU VOCABULAIRE, ET C'EST LE GABARIT QUI
  // L'EXIGE. Il y figurait NU. Or « — motif : … » est le libellé que `gabarits\RESTITUTION.md`
  // impose à CHAQUE ligne du bloc 5. Toute ligne de non-traité portant un mot d'absence et nommant
  // un objet de catalogue était donc lue comme une recherche par nom qui n'a rien trouvé. Cas
  // mesuré le 09/09 : « Publier, actualiser ou interroger quoi que ce soit dans l'espace de
  // travail — motif : `garde_fou` (R-38, aucune publication sur un service hébergé sans GO humain
  // consigné) » a rendu S24 FAIL. Aucune recherche n'était rapportée : la ligne dit qu'une
  // publication est interdite par une règle. Le rédacteur n'a eu d'autre issue que de RETIRER le
  // mot « aucune » de sa propre phrase, sans gain de sens, pour obtenir un vert.
  //
  // *Un détecteur dont le vocabulaire recouvre un mot que le gabarit IMPOSE se déclenche sur la
  // forme prescrite elle-même : il ne juge plus une tournure de l'auteur, il pénalise l'obéissance
  // au gabarit.* Même classe que TF-0992 (`regle-balaie-prose-et-identifiants`), autre mécanisme :
  // là c'était une preuve citée, ici c'est un libellé structurel.
  //
  // DEUX GARDES, parce qu'une seule laisserait la porte entrouverte. (1) Le mot est BORNÉ à ses
  // emplois de recherche (« motif de nom », « motifs de recherche ») ; le sens visé — un motif SQL
  // ou une expression rationnelle — reste couvert par `%…%`, `LIKE`, `grep` et `pattern`, qui
  // portent la fixture rouge historique du 24/08 sans y toucher. (2) Le libellé structurel du
  // bloc 5 est RETIRÉ de la phrase avant tout test : ce que le gabarit écrit n'est pas ce que
  // l'auteur écrit, et aucun détecteur lexical n'a à le lire.
  const RECHERCHE_PAR_NOM = /(%[\w]+%|LIKE\s|ILIKE\s|grep|motifs?\s+(?:de\s+)?(?:nom|recherche|table|colonne)|pattern|nom\s+(?:contenant|comportant|qui\s+contient)|contenant\s+`|par\s+nom|dont\s+le\s+nom)/i;
  // Le libellé que le gabarit impose à chaque ligne du bloc 5 — retiré avant jugement.
  const LIBELLE_GABARIT = /[—–-]\s*motifs?\s*(?:de\s+non-ex[ée]cution\s*)?:/gi;
  // L'acquittement : la recherche par STRUCTURE est déclarée, ou l'énoncé se borne au NOM.
  const PAR_STRUCTURE = /(par\s+structure|structurel|des\s+colonnes\s+plut[ôo]t|motif\s+de\s+valeurs|par\s+valeurs|contrainte\s+de\s+cl[ée]|information_schema\.columns|recherche\s+compl[ée]mentaire|crois[ée]\s+avec)/i;
  const BORNE_AU_NOM = /(dont\s+le\s+NOM|aucun\s+objet\s+dont\s+le\s+nom|le\s+nom\s+cherch[ée]|au\s+vu\s+des\s+seuls\s+noms|sur\s+ce\s+seul\s+crit[èe]re\s+de\s+nom)/i;
  {
    const phrases = texte.split(/(?<=[.!?;])\s+|\n/).map((x) => x.trim()).filter(Boolean);
    const risquees = phrases.filter((x) => {
      // Le libellé du gabarit sort AVANT le test : il est écrit par la doctrine, pas par l'auteur.
      const dit = x.replace(LIBELLE_GABARIT, " ");
      return ABSENCE_TROUVEE.test(dit) && OBJET_DE_CATALOGUE.test(dit) && RECHERCHE_PAR_NOM.test(dit);
    });
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
    const sansSelecteur = (t) => t.replace(/\bD-\d{1,3}\b/g, " ");
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

  // ---- S47 (retour humain du 16/09/2026) — UNE DÉCISION NOMME LA CHOSE DONT ELLE PARLE -------
  //
  // LE RETOUR EST LA MESURE, mot pour mot : « D-1, on ne comprend absolument rien au charabia, ce
  // n'est pas clair, c'est flou, exactement ce que j'ai demandé de ne plus faire dans la
  // communication. » La décision en cause demandait de trancher le sort d'un nom de dépôt qui
  // ferme la porte de publication — SANS jamais écrire ce nom. Trois périphrases à la place :
  // « un nom de dépôt de l'écosystème », « cet objet », « qui figure aussi dans la table des noms
  // interdits ».
  //
  // LA CAUSE, et elle est instructive. La règle d'anonymisation protège les noms de clients dans
  // tout fichier suivi, et une synthèse EST un fichier suivi. Pour ne pas écrire le nom, l'agent a
  // tourné autour — et a produit une question inutilisable sur le dépôt de l'utilisateur LUI-MÊME.
  // Une règle qui protège un tiers a empêché de parler clairement au propriétaire de la chose.
  //
  // POURQUOI LES CINQ RÈGLES DU BLOC 3 NE LE VOIENT PAS. S30 compte un numéro, S15 compte
  // VINGT-CINQ MOTS de rappel, S16 cherche une source, S31 un tableau, S32 une ligne de repli. Une
  // périphrase fait vingt-cinq mots : elle satisfait S15 et passe les quatre autres. *Aucune ne
  // regarde si le rappel DÉSIGNE quelque chose.*
  //
  // CE QUE LA RÈGLE MESURE, ET CE QU'ELLE NE MESURE PAS. Elle exige un DÉSIGNATEUR dans le rappel
  // de sujet : un fragment entre accents graves, un chemin, un identifiant de registre, un nom de
  // dépôt, ou un mot capitalisé qui n'ouvre pas la phrase. Elle ne juge ni la justesse du nom, ni
  // sa suffisance : un rappel peut nommer et rester obscur, et cela reste une relecture. Elle
  // attrape le cas mesuré — un rappel fait ENTIÈREMENT de groupes nominaux indéfinis.
  {
    // Le titre se présente sous DEUX formes dans le parc, et les deux se retirent : la question
    // est DANS le gras (« **D-1 — … ?** »), ou le gras ne porte que le sélecteur et la question
    // suit (« **Décision 1 —** Publier … ? »). Dans le second cas, le premier mot de la question
    // est capitalisé et compterait comme un nom propre. On retire donc le gras, PUIS la question
    // jusqu'à son point d'interrogation, PUIS tout ce qui suit « Recommandation » — ce mot est
    // capitalisé lui aussi et suit chaque rappel. Les trois bornes ont été trouvées en écrivant la
    // règle, sur sa propre fixture rouge, et chacune la rendait muette : une règle qui juge le
    // mauvais fragment est verte sur le défaut qu'elle existe pour attraper.
    const chapeauS47 = (g) => g
      .replace(/^\s*>?\s*\*\*[^*]*\*\*/, " ")
      .replace(/^[^?]{0,220}\?/, " ")
      .split(/\*\*\s*Recommandation|\(a\)/)[0]
      .replace(/\bD-\d{1,3}\b/g, " ")
      .replace(TETE_DECISION, "").replace(/>\s*/g, " ").replace(/\|[^|]*/g, " ").replace(/\*\*/g, "").trim();
    const NOM_PROPRE = /(?:[.!?:;]\s+|\s)(?!Ce\b|Cet\b|Cette\b|Il\b|Elle\b|On\b|Un\b|Une\b|Le\b|La\b|Les\b|Et\b|Mais\b|Or\b|Sans\b|Pour\b|Dans\b|Sur\b|Trois\b|Deux\b|Quatre\b)[A-ZÀ-Ý][\p{L}-]{2,}/u;
    // UN NOM DE DÉPÔT N'A PAS DE MAJUSCULE, et c'est précisément le nom qui manquait le 16/09.
    // Trois segments joints par des tirets ne forment aucun mot français — c'est un identifiant,
    // donc un désignateur, qu'il soit entre accents graves ou nu. L'exiger entre accents graves
    // reviendrait à imposer une typographie pour dire un nom.
    const SLUG = /\b[a-z0-9]+(?:-[a-z0-9]+){2,}\b/;
    const designe = (c) => _LOCALISATEURS.test(c) || ID_STABLE.test(c) || SLUG.test(c) || NOM_PROPRE.test(" " + c);
    const muettes = groupesDecisions.filter((g) => !designe(chapeauS47(g)));
    if (muettes.length) {
      ko("S47", `${muettes.length} décision(s) sur ${groupesDecisions.length} dont le rappel de sujet ne NOMME rien — `
        + "ni fragment entre accents graves, ni chemin, ni identifiant, ni nom propre. Un rappel fait de groupes "
        + "nominaux indéfinis (« un nom de… », « cet objet », « une chose qui… ») satisfait S15 par sa longueur et "
        + "laisse le lecteur sans savoir DE QUOI on parle : c'est le retour humain du 16/09/2026, « on ne comprend "
        + "absolument rien au charabia ». Quand un nom sensible appartient AU LECTEUR, il s'écrit — l'arbitrage de "
        + `publication se traite ailleurs, jamais en rendant la question floue. Ex. : ${chapeauS47(muettes[0]).replace(/\s+/g, " ").slice(0, 110)}`);
    } else if (groupesDecisions.length) {
      ok("S47", `${groupesDecisions.length} décision(s), chacune nommant la chose dont elle parle`);
    } else {
      ok("S47", "aucune décision à nommer");
    }
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
  const EXCLUS_S23 = /^(?:TF-?\d{3,4}|[DA]-?\d{1,3})$/;
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

  // ---- S40 et S41 (08/09/2026, TF-0923 — second paquet des six volets restés non joués) --------
  //
  // S41 — QUAND LA DOCTRINE RÉGIT LE SUJET, C'EST ELLE LA SOURCE. S16 exige qu'une décision porte
  // sa recommandation et LA source consultée ; elle ne regarde pas LAQUELLE. Le fait du 07/09
  // (TF-0902) : une décision a été posée à l'humain — garder ou supprimer la version remplacée
  // d'un livrable — avec sa recommandation et sa source, donc S16 PASS. Or `REGLES-PROJET.md`
  // règle 7 y répond depuis toujours : un livrable remplacé part sous `old\` du même dossier,
  // versionné. La question n'avait pas à être posée ; elle l'a été parce que la source citée
  // était un fichier du chantier et non la doctrine qui régit le mot.
  //
  // C'est le défaut de S16 poussé d'un cran : *une recommandation sans source est une opinion*,
  // mais une source qui n'est pas celle qui TRANCHE est une opinion sourcée. La règle ne juge pas
  // la réponse — indécidable à la machine — elle juge que la doctrine a été OUVERTE là où elle
  // régit le mot. Le vocabulaire est donc étroit ET fermé : cinq familles de mots dont la
  // doctrine du projet est l'autorité écrite, et rien d'autre. Élargir cette liste rendrait la
  // règle bavarde sur des décisions qu'aucun texte ne tranche — exactement ce que S16 évite déjà.
  if (groupesDecisions.length) {
    const REGI = uni(/\b(remplac[ée]e?s?|remplacement|ancienne version|version pr[ée]c[ée]dente|old\\|supprimer le livrable|renommer le livrable|indice du livrable)\b/i);
    const DOCTRINE = /(REGLES-PROJET|CLAUDE\.md|CLAUDE-PRODUIT|ETAPES-RUN|RUN-MANDAT|RUN-CONSEIL|RESTITUTION\.md|ACCUEIL\.md|CONTRAT-INTERFACE|\br[èe]gle\s+\d+\b|\bR-\d{1,2}\b)/i;
    const regies = groupesDecisions.filter((g) => REGI.test(g));
    const horsDoctrine = regies.filter((g) => !DOCTRINE.test(g));
    horsDoctrine.length
      ? ko("S41", `${horsDoctrine.length} décision(s) sur ${regies.length} portent un mot que la doctrine du projet RÉGIT, sans citer cette doctrine comme source — une source qui n'est pas celle qui tranche est une opinion sourcée : le 07/09, « garder ou supprimer la version remplacée » a été posé à l'humain alors que la règle 7 y répond (livrable remplacé → \`old\\\` du même dossier, versionné) : « ${horsDoctrine[0].replace(/\s+/g, " ").trim().slice(0, 110)} »`)
      : ok("S41", regies.length ? `${regies.length} décision(s) régie(s) par la doctrine, chacune la citant en source` : "aucune décision ne porte un mot régi par la doctrine du projet");
  } else {
    ok("S41", "aucune décision à instruire");
  }
  // S40 — LA FORME DATÉE EN TÊTE EST RÉSERVÉE AUX ÉTUDES. Deux nommages cohabitent chez le pilot,
  // et un seul est général : R-4 impose « <Marque> - <Objet> - AAAAMMJJ<indice>.<ext> » à tout
  // livrable d'`output\` ; `output\03-etudes\` en est l'EXCEPTION écrite, avec son préfixe daté
  // « AAAAMMJJ-… » qui fait lire le dossier dans l'ordre chronologique (gabarits\ETUDE-OPPORTUNITE.md).
  // Le fait du 07/09 (TF-0898) : onze livrables d'un mandat sont sortis en « 20260907-objet.ext »
  // — la forme des études, recopiée hors des études, sur trois tours et quatre synthèses PASS.
  // L'exception s'était propagée par imitation parce que rien ne disait qu'elle en était une.
  //
  // La règle lit les chemins CITÉS, pas le disque : une restitution qui annonce un livrable le
  // nomme, et c'est à cet instant que la forme se voit. Elle ne juge que ce qui vit sous
  // `output\` — ailleurs, R-4 ne s'applique pas et la règle n'aurait rien à dire.
  {
    const zones = [bloc(texte, BLOCS[3][0]) || "", bloc(texte, BLOCS[4][0]) || "",
      bloc(texte, /(^|\n)#{1,4}\s*9[.)]?\s*traces?/i) || ""].join("\n");
    const cites = zones.match(/[\w\-. ]*output[\/\\][\w\-. \/\\]+\.\w{2,5}/gi) || [];
    const fautifs = cites.filter((c) => {
      const chemin = c.replace(/\\/g, "/");
      if (/output\/03-etudes\//i.test(chemin)) return false;      // l'exception, chez elle
      return /^\d{8}[a-z]?-/.test(chemin.slice(chemin.lastIndexOf("/") + 1));
    });
    fautifs.length
      ? ko("S40", `${fautifs.length} chemin(s) de livrable cité(s) portent le préfixe daté « AAAAMMJJ-… » hors de \`output\\03-etudes\\\` — cette forme est RÉSERVÉE aux études (gabarits\\ETUDE-OPPORTUNITE.md) ; partout ailleurs sous \`output\\\`, R-4 impose « <Marque> - <Objet> - AAAAMMJJ<indice>.<ext> » : ${fautifs.slice(0, 2).join(", ")}`)
      : ok("S40", cites.length ? `${cites.length} chemin(s) de livrable cité(s) sous \`output\\\`, aucun n'emprunte la forme réservée aux études` : "aucun chemin de livrable d'`output\\` cité");

    // ---- S42 (11/09/2026, TF-1015) — UN NOM CONFORME PEUT RENDRE LE DÉPÔT INCLONABLE --------
    //
    // LE FAIT, MESURÉ LE 10/09. Un clone de vérification (`git clone --single-branch`) posé dans
    // un bac à sable dont le préfixe faisait ~130 caractères a rendu « Filename too long » sur 22
    // fichiers — 19 sidecars d'oracle sous `.oracles\output\04-plans\` et 3 synthèses — puis
    // « Clone succeeded, but checkout failed » : le dépôt est arrivé SANS arbre de travail, et la
    // vérification que la doctrine prescrit avant tout push n'a pas pu se jouer.
    //
    // POURQUOI R-4 NE LE VOIT PAS : elle fixe la FORME du nom (« <Marque> - <Objet> -
    // AAAAMMJJ<indice>.<ext> ») et rien n'y borne sa LONGUEUR. Un nom parfaitement conforme, assez
    // descriptif pour se lire, suffit. L'arithmétique : le plus long chemin SUIVI du dépôt faisait
    // 146 caractères, le sidecar d'oracle en ajoute 26 (`.oracles\` en tête, `.oracles-historique
    // .jsonl` en queue), et sous MAX_PATH = 260 sans `core.longpaths` il ne restait que
    // 260 − 146 − 1 = 113 caractères de préfixe admissible. D'où le plafond : chemin relatif + 26
    // ≤ 150, qui laisse 110 caractères de préfixe — la marge que le bac à sable d'une session
    // consomme couramment.
    //
    // ET C'EST UN DÉFAUT QUI NE SE VOIT PAS CHEZ CELUI QUI L'ÉCRIT : sur le poste de travail, le
    // dépôt vit à `c:\dev\…`, préfixe court, tout passe. Il n'apparaît qu'au premier clone profond,
    // c'est-à-dire chez celui qui VÉRIFIE — la place exacte où un défaut coûte le plus cher.
    //
    // La règle juge DEUX choses avec la même borne : le fichier jugé lui-même (une synthèse est un
    // livrable d'`output\`, elle se déposera là et son sidecar avec) et chaque chemin d'`output\`
    // CITÉ — même extraction que S40, la restitution nomme ce qu'elle dépose. Le remède, lui, est
    // écrit ailleurs : `git clone -c core.longpaths=true` sur un préfixe court.
    const SIDECAR = 26, PLAFOND = 150;
    const RACINE = dirname(dirname(fileURLToPath(import.meta.url)));
    // Hors du dépôt (fixture en dossier temporaire), le chemin relatif n'a pas de sens : on juge
    // alors le NOM, qui est ce qui voyagera quand le fichier sera déposé sous `output\`.
    const relatifDepuisRacine = (f) => {
      const r = relative(RACINE, resolve(f));
      return !r || r.startsWith("..") ? basename(resolve(f)) : r.replaceAll("\\", "/");
    };
    const mesures = new Map();
    if (cheminJuge) mesures.set(relatifDepuisRacine(cheminJuge), true);
    for (const c of cites) {
      const norme = c.trim().replaceAll("\\", "/").replace(/^.*?(?=output\/)/i, "");
      if (norme) mesures.set(norme, true);
    }
    const chemins = [...mesures.keys()];
    const trop = chemins.filter((c) => c.length + SIDECAR > PLAFOND).sort((a, b) => b.length - a.length);
    if (trop.length) {
      ko("S42", `${trop.length} chemin(s) dépassent le plafond de longueur (chemin relatif + ${SIDECAR} de sidecar d'oracle ≤ ${PLAFOND}, R-4 alinéa TF-1015) — ` +
        trop.slice(0, 3).map((c) => `« ${c} » : ${c.length} caractères, soit ${c.length + SIDECAR} avec son sidecar, ` +
          `${c.length + SIDECAR - PLAFOND} de trop ; préfixe de clone admissible ${260 - c.length - 27} caractères`).join(" · ") +
        " — sous MAX_PATH = 260 sans `core.longpaths`, le checkout d'un clone de vérification échoue sur ces fichiers (10/09/2026 : 22 fichiers refusés, dépôt sans arbre de travail). Raccourcir l'<Objet> du nom, la forme R-4 étant tenue par ailleurs");
    } else {
      const plusLong = chemins.reduce((m, c) => Math.max(m, c.length), 0);
      ok("S42", chemins.length
        ? `S42 PASS : ${chemins.length} chemin(s), le plus long fait ${plusLong} caractères (+${SIDECAR} de sidecar ≤ ${PLAFOND})`
        : "aucun chemin à mesurer — ni fichier jugé nommé, ni chemin d'`output\\` cité");
    }
  }

  // ---- S43 (12/09/2026, TF-1064) — LE STYLE DE LA RESTITUTION RELÈVE DU PLANCHER D'ÉCRITURE ----
  //
  // LE FAIT. Quarante-deux règles jugent la FORME d'une restitution (blocs, sélecteurs, preuves,
  // gloses, chemins) ; aucune n'en jugeait le STYLE : une restitution saturée d'annonces vides,
  // de clôtures résumantes, d'emphase creuse ou de tirets en cascade passait S1-S42 sans un mot.
  // Le mandat humain du 12/09/2026 (D-1 (a), synthèse 20260911j) a posé la doctrine
  // `references\ECRITURE.md` (E-1..E-12) et son juge `oracle-ecriture.mjs` (densités par famille
  // de `references\tics-redactionnels.json`, phrases longues en série, puces trop profondes,
  // emphase de structure). S43 DÉLÈGUE : elle ne réimplémente aucun motif (R3), elle joue l'oracle
  // sur le texte jugé et reprend son verdict. FAIL seulement si l'oracle échoue (une saturation
  // nette, calibrée pour que le corpus PASS reste PASS à 95 %) ; ses avertissements sont comptés
  // dans le message, jamais promus. Oracle absent ou illisible : SANS_OBJET, dit, jamais tu.
  // S43 n'est pas bloquante au hook Stop — même raisonnement que S11-S14 : un style lourd rend la
  // restitution moins agréable, jamais inutilisable.
  {
    const oracleEcriture = join(dirname(fileURLToPath(import.meta.url)), "oracle-ecriture.mjs");
    if (!existsSync(oracleEcriture)) {
      findings.push({ regle: "S43", statut: "SANS_OBJET", message: "oracle-ecriture.mjs absent de ce poste — style non jugé (references\\ECRITURE.md du pilot)" });
    } else {
      const RACINE43 = dirname(dirname(fileURLToPath(import.meta.url)));
      const dir43 = mkdtempSync(join(tmpdir(), "s43-"));
      const tmp43 = join(dir43, "restitution.md");
      writeFileSync(tmp43, texte);
      const args43 = [oracleEcriture, tmp43];
      if (cheminJuge) {
        const r = relative(RACINE43, resolve(cheminJuge));
        if (r && !r.startsWith("..")) args43.push("--chemin-relatif", r.replaceAll("\\", "/"));
      }
      const r43 = spawnSync(process.execPath, args43, { encoding: "utf8", timeout: 60000 });
      let j43 = null;
      try { j43 = JSON.parse((r43.stdout || "").slice((r43.stdout || "").indexOf("{"))); } catch { /* illisible */ }
      if (!j43 || !j43.verdict) {
        findings.push({ regle: "S43", statut: "SANS_OBJET", message: `oracle-ecriture ILLISIBLE (exit ${r43.status}) — ce n'est pas un constat sur la restitution` });
      } else {
        const fails43 = (j43.findings || []).filter((f) => f.statut === "FAIL");
        const averts43 = (j43.findings || []).filter((f) => f.statut === "AVERT");
        if (j43.verdict === "FAIL") {
          ko("S43", `style en défaut selon le plancher d'écriture (references\\ECRITURE.md) : ${fails43.length} règle(s) EC en échec — ` +
            fails43.slice(0, 3).map((f) => `${f.regle} : ${String(f.message).replace(/\s+/g, " ").slice(0, 140)}`).join(" · ") +
            (averts43.length ? ` ; ${averts43.length} avertissement(s)` : "") +
            " — corriger avant remise : node oracles\\oracle-ecriture.mjs <ce fichier>");
        } else if (j43.verdict === "SKIP") {
          ok("S43", "texte normatif antérieur à la doctrine d'écriture — style non jugé (antériorité déclarée)");
        } else {
          ok("S43", averts43.length
            ? `style PASS (${j43.mots || "?"} mots) avec ${averts43.length} avertissement(s) : ` + averts43.slice(0, 2).map((f) => `${f.regle} ${String(f.message).replace(/\s+/g, " ").slice(0, 90)}`).join(" · ")
            : `style PASS (${j43.mots || "?"} mots, aucune famille au-dessus de son seuil)`);
        }
      }
    }
  }

  // ---- S44 (16/09/2026, TF-0988) — UN MOT D'EXCLUSIVITÉ RESTREINT LE CONTENU, PAS LA CIBLE ----
  //
  // LE FAIT, remonté sur demande explicite du destinataire. Demande : « Crée un nouveau fichier
  // […] UNIQUEMENT avec ces 66 colonnes en cible ». Livraison : une page dont le tableau des
  // champs portait bien 66 lignes, mais qui CONSERVAIT un tableau de 276 lignes listant les
  // colonnes écartées, plus une carte de chiffres et une légende à leur sujet — 276 sur 276
  // retrouvées dans la page, 342 colonnes affichées au total, exactement ce que la demande
  // excluait. Retour humain : « je reçois un HTML avec les 342 colonnes, comme avant, pourquoi ? »
  //
  // POURQUOI LE BLOC 6 NE L'A PAS VU. Il déclarait TROIS écarts — une colonne de tableau en plus,
  // quatre livrables non réduits, le radical du fichier — et pas celui-là, parce que le producteur
  // avait lu « en cible » comme « cible du lineage » et tenu les colonnes écartées pour de la
  // documentation légitime. `oracle-synthese` rendait PASS sur 41 règles. Coût : un aller-retour
  // complet, et un destinataire qui redemande ce qu'il avait écrit clairement.
  //
  // CE QUE LA RÈGLE AJOUTE À CE QUI EXISTAIT. La doctrine couvre depuis TF-0176 l'AFFAIBLISSEMENT
  // noyé dans un long message. Ceci en est le SYMÉTRIQUE — l'ENRICHISSEMENT non demandé — et rien
  // ne le couvrait : ajouter « pour information » est le geste le plus naturel du monde, et c'est
  // précisément pour ça qu'il passe. Le vocabulaire d'exclusivité est FERMÉ, donc la règle est
  // mécanisable ; elle n'exige pas de compter ce qu'il y a en plus — indécidable ici —, seulement
  // que la question soit POSÉE dans le bloc qui existe pour ça.
  //
  // DEUX BORNES, et les deux viennent de défauts payés ailleurs dans ce fichier. (1) « et rien
  // d'autre » est retiré du vocabulaire d'exclusivité alors que la demande peut l'employer : il
  // appartient au vocabulaire de DÉCLARATION, et le laisser des deux côtés ferait satisfaire la
  // règle par le mot même qui la déclenche — la boucle de S13 avant TF-1085. (2) « non seulement »
  // est retiré : c'est une charnière de prose, jamais une restriction de périmètre.
  {
    const b6 = bloc(texte, BLOCS[5][0]) || "";
    const EXCLUSIVITE = uni(/\b(uniquement|seulement|exclusivement|rien que|only)\b/i);
    const b6Net = horsCode(b6).replace(/\bnon seulement\b/gi, " ");
    const DECLARATION = uni(/(rien d'autre|rien de plus|aucun autre|aucune autre|en plus (?:du|de la|des)|hors p[ée]rim[èe]tre|en sus|ni plus ni moins|exactement (?:les|ces|ce))/i);
    if (!EXCLUSIVITE.test(b6Net))
      ok("S44", "aucun mot d'exclusivité dans la demande citée — rien à borner");
    else if (DECLARATION.test(b6Net))
      ok("S44", "la demande porte un mot d'exclusivité, et le bloc 6 déclare ce que le livrable contient en plus — ou qu'il ne contient rien d'autre");
    else
      ko("S44", "la demande citée porte un mot d'EXCLUSIVITÉ (« uniquement », « seulement »…) et le bloc 6 " +
        "ne dit pas ce que le livrable contient EN PLUS du périmètre nommé — ni qu'il ne contient rien d'autre. " +
        "Un mot d'exclusivité restreint le CONTENU, pas seulement la cible : l'ajout « pour information » d'un " +
        "complément hors périmètre est un écart, même utile (TF-0988)");
  }

  // ---- S45 (16/09/2026, TF-1127) — UN BLOQUANT S'ÉNONCE EN ENTIER, AU MÊME ENDROIT ------------
  //
  // LE RETOUR EST LA MESURE, mot pour mot (13/09/2026) : « S'il y a des bloquants pour avancer, il
  // faut les afficher pour que l'utilisateur puisse les traiter, et cela sans avoir à fouiller dans
  // un fichier quelque part. »
  //
  // LE FAIT, sur une restitution jugée PASS : la production était arrêtée, et ce qui la bloquait
  // était réparti entre TROIS blocs — le bloc 3, dont une décision NOMMAIT « le préalable
  // bloquant » et RENVOYAIT à une section d'un autre document sans en reprendre le contenu ; le
  // bloc 5, trois puces dont aucune ne disait comment les lever ; le bloc 8, quatre lignes portant
  // la même information sous une troisième forme. Les trois valeurs réellement attendues
  // n'apparaissaient NULLE PART en clair et rassemblées.
  //
  // LA CAUSE EST DE GABARIT, PAS DE RÉDACTION, et c'est ce qui rend la règle légitime : un
  // bloquant est simultanément un non-traité (bloc 5), une décision (bloc 3), une action à
  // débloquer (bloc 8) et un risque s'il dure (bloc 7). Le gabarit GARANTISSAIT donc qu'il soit
  // écrit quatre fois et jamais en entier. S5 exige un motif par élément non traité ; elle
  // n'exige ni que le motif soit ACTIONNABLE, ni que le bloquant soit AUTOPORTANT.
  //
  // PORTÉE VOLONTAIREMENT ÉTROITE, et la moitié écartée est dite en `non_juge`. Le lot proposait
  // DEUX déclencheurs : un motif de la famille bloquante au bloc 5, OU une ligne `auto_ia` non
  // exécutée au bloc 8. Le second a été mesuré sur le corpus du pilot avant d'être écrit : presque
  // toute restitution porte au moins une `auto_ia` motivée — S11 l'exige —, donc ce déclencheur
  // aurait accusé la quasi-totalité du corpus pour des tours qui n'étaient PAS arrêtés. Une règle
  // qui crie partout ne dit plus rien. Seul le bloc 5 déclenche : un ÉLÉMENT NON TRAITÉ dont le
  // motif est un obstacle, c'est la définition d'un traitement arrêté.
  {
    const b3 = bloc(texte, BLOCS[2][0]) || "";
    const b5 = bloc(texte, BLOCS[4][0]) || "";
    const FAMILLE_BLOQUANTE = /\b(garde_fou|dependance_bloc_3|dependance_externe|gate_gouvernance)\b/;
    const bloquants = puces(b5).filter((l) => FAMILLE_BLOQUANTE.test(l));
    if (!bloquants.length) {
      ok("S45", "aucun élément non traité pour cause d'obstacle — rien à inventorier");
    } else {
      // L'INVENTAIRE SE DÉCLARE, IL NE SE DEVINE PAS. Un premier jet le cherchait « avant la
      // première décision », et cette lecture s'est retournée contre elle-même sur sa propre
      // fixture verte : une puce d'inventaire OUVRE un segment pour `decisionsDuBloc`, donc elle
      // devenait la première décision et l'inventaire mesurait zéro entrée. *Un repère positionnel
      // qui dépend du découpage qu'il précède n'est pas un repère.* Le gabarit prescrit donc un
      // LIBELLÉ — le mot « bloquant(s) » sur sa ligne —, et la règle le lit : un mot déclaré se
      // trouve sans dépendre d'une segmentation, et il apprend au rédacteur ce qu'on attend de lui.
      // LA BORNE DE LONGUEUR NE SERVAIT À RIEN ET A COÛTÉ UN REFUS, le jour même de l'écriture de la
      // règle. Un premier jet bornait le libellé à quatre-vingts caractères de part et d'autre du mot ;
      // la PREMIÈRE restitution qui a ouvert un inventaire l'a écrit sur une ligne plus longue, et la
      // règle a refusé un document qui la satisfaisait. *Une borne qu'aucun fait ne justifie est un
      // piège qu'on se tend à soi-même* : le mot se cherche sur la ligne, sans condition de longueur.
      const mLabel = /(^|\n)[^\n]*\bbloquants?\b[^\n]*(\n|$)/i.exec(b3);
      if (!mLabel) {
        ko("S45", `${bloquants.length} élément(s) bloqué(s) au bloc 5 (motif garde_fou, dependance_bloc_3, ` +
          "dependance_externe, gate_gouvernance) et AUCUN inventaire des bloquants au bloc 3 — quand un traitement est " +
          "arrêté, le bloc 3 s'ouvre par cet inventaire, chaque entrée disant ce qui est bloqué, ce qu'il faut fournir " +
          "ou décider pour le lever, et ce qui se passe si rien n'est fourni (TF-1127)");
      } else {
        const apres = b3.slice(mLabel.index + mLabel[0].length);
        // L'inventaire s'arrête à la première DÉCISION, quelle que soit sa mise en page — sélecteur
        // `D-N`, « Décision 1 », ou bloc de citation numéroté (les trois formes que le bloc 3 admet).
        const mFin = /(^|\n)\s*(?:>\s*)?(?:[-*+]\s+|#{2,6}\s*)?\**\s*(?:D\s*-\s*\d{1,3}|D[ée]cision\s*n?[°ºo]?\s*\d{1,3})/i.exec(apres);
        const zone = mFin ? apres.slice(0, mFin.index) : apres;
        const entrees = puces(zone).concat(lignesDeDonnees(zone));
        // UN BLOQUANT QUI RENVOIE N'EST PAS ÉNONCÉ : un chemin de fichier ou un renvoi à une autre
        // section est exactement le geste que le retour dénonce — « sans avoir à fouiller ».
        const RENVOI = /(\bvoir\b|\bcf\.|\bsection\b|\bchapitre\b|\bbloc\s*\d|[A-Za-z0-9_-]+\\[A-Za-z0-9_\\.-]+|\.(?:md|json|mjs|html|jsonl|py)\b)/i;
        const renvoyants = entrees.filter((l) => RENVOI.test(l));
        if (entrees.length < bloquants.length)
          ko("S45", `${bloquants.length} élément(s) bloqué(s) au bloc 5 et ${entrees.length} entrée(s) sous l'inventaire ` +
            "des bloquants du bloc 3 — chaque bloquant s'y énonce, sinon le lecteur le lit en morceaux dans trois blocs " +
            "et jamais en entier (TF-1127)");
        else if (renvoyants.length)
          ko("S45", `${renvoyants.length} bloquant(s) de l'inventaire RENVOIENT à un fichier ou à une autre section au lieu ` +
            `de s'énoncer : « ${renvoyants[0].replace(/\s+/g, " ").trim().slice(0, 90)} » — un bloquant qu'il faut aller ` +
            "chercher ailleurs n'est pas affiché, et c'est le geste que le retour du 13/09 dénonce");
        else
          ok("S45", `${bloquants.length} bloquant(s) inventorié(s) au bloc 3, chacun énoncé sur place`);
      }
    }
  }

  // ---- S46 (16/09/2026, TF-1045) — LE MOT QUE LE DESTINATAIRE NE LIT PAS ---------------------
  //
  // LE FAIT, et c'est un DEUXIÈME retour sur un mot déjà corrigé. Le 08/09, un client dit ne pas
  // lire le terme employé ; l'item est clos « corrigé ». Le 10/09, il redemande le même mot.
  // Mesure du 11/09 : `gabarits\JARGON-A-GLOSER.json` ne portait pas le terme (0 entrée), le
  // `CLAUDE.md` du produit ne citait ni glossaire ni lexique, et CET ORACLE — le gate que toute
  // synthèse traverse (R-44) — ne lisait aucun glossaire ; deux synthèses employant le terme
  // étaient PASS sur 41 règles. *Une correction qui vit dans le registre du pilot et nulle part
  // sur le chemin du producteur n'est pas câblée* (loi n° 1, et R12 mot pour mot).
  //
  // LA RÈGLE EST LA JUMELLE D'EC-7, et les deux lisent la MÊME donnée par le MÊME module
  // (`lib-lexique.mjs`) : en réimplémenter une seconde lecture serait la classe
  // `oracle-remplace-par-controle-maison` que le registre compte par ailleurs. EC-7 attrape le mot
  // à l'écriture du livrable, S46 à la fin du tour — deux portes, une liste.
  //
  // LE LEXIQUE EST CELUI DU PRODUIT, pas une liste globale, et ce choix est la règle elle-même :
  // le terme fondateur est un mot ordinaire du français, juste dans la doctrine du pilot ; une
  // liste globale accuserait la prose de la factory pour un retour reçu ailleurs. Absent : SANS
  // OBJET, dit à voix haute et jamais PASS par silence. Les citations ne sont pas jugées — un nom
  // de champ entre accents graves n'est pas une déclaration d'intention de l'auteur (TF-0992).
  {
    const lex = chargerLexique({ cheminJuge });
    if (!lex.trouve)
      findings.push({ regle: "S46", statut: "SANS_OBJET", message: "aucun lexique de client dans le socle de ce projet (forge\\LEXIQUE.json, docs\\projet\\LEXIQUE.json ou references\\LEXIQUE.json) — vocabulaire du destinataire non jugé" });
    else if (lex.illisible)
      findings.push({ regle: "S46", statut: "SANS_OBJET", message: `lexique ILLISIBLE (${lex.chemin}) : ${lex.illisible} — ce n'est pas un constat sur la restitution` });
    else if (!lex.termes.length)
      findings.push({ regle: "S46", statut: "SANS_OBJET", message: `lexique présent et VIDE (${lex.chemin}) — aucun terme n'a encore coûté d'aller-retour` });
    else {
      const employes = termesEmployes(texte, lex.termes);
      employes.length
        ? ko("S46", `${employes.length} terme(s) proscrit(s) par le lexique du destinataire : ` +
            employes.map((t) => `« ${t.proscrit} » (${t.occurrences}) → « ${t.remplacer_par || "à remplacer"} »`).join(" · ") +
            " — un mot qui a coûté un aller-retour au client ne revient pas dans la restitution qui annonce sa correction")
        : ok("S46", `aucun des ${lex.termes.length} terme(s) proscrit(s) du lexique n'est employé`);
    }
  }

  // ---- S48 (17/09/2026, TF-1166, décision humaine D-3 (a)) — CHEZ UN PRODUIT, LE TOUR DIT CE QU'IL REMONTE ----
  //
  // LE FAIT. Le 30/08, la mesure établit que le canal par lequel un produit remonte ses retours n'a
  // ni déclencheur ni transport : 7 sources sur 15 n'avaient émis qu'un seul jour, silence médian de
  // 8 jours. La décision posée alors est restée sans exécution ; le 17/09, le silence médian est de
  // 11 jours et 21 sources se taisent depuis plus de 7 jours (`todo\RECIDIVES.md` section 7).
  // *Ne rien remonter et n'avoir rien à remonter sont indiscernables* — et c'est la loi transverse
  // n° 3 mot pour mot : l'oubli n'existe pas, ce qui s'écarte s'écarte explicitement.
  //
  // CE QUI S'AUTOMATISE EST L'OBLIGATION, JAMAIS LE CONTENU (mesure du 30/08 : 59 % seulement des
  // verdicts de contrôle sont extractibles, et 414 entrées de journal sur 610 étaient du bruit). La
  // règle n'exige donc aucun retour : elle exige que le tour DISE s'il en remonte un. « Rien à
  // remonter » est une réponse valide ; le silence ne l'est pas.
  //
  // PORTÉE : un PRODUIT, reconnu à son `forge\retours\` — le dossier d'où partent ses lots. Le pilot
  // et les forges n'en portent pas : SANS_OBJET, dit à voix haute. Elle joue à la fin d'un tour,
  // quand la session du produit est DÉJÀ ouverte : c'est la seule pièce du canal qui ne coûte aucun
  // geste de plus à l'humain. AVERTISSANTE, comme toute règle neuve depuis la v2.5.0.
  {
    const departs = [];
    if (cheminJuge) { try { departs.push(dirname(resolve(cheminJuge))); } catch { /* chemin non résolu */ } }
    let estProduit = false;
    for (let d of departs) for (let i = 0; i < 12 && d; i++) {
      if (existsSync(join(d, "forge", "retours"))) { estProduit = true; break; }
      const parent = dirname(d); if (parent === d) break; d = parent;
    }
    if (!estProduit)
      findings.push({ regle: "S48", statut: "SANS_OBJET", message: "la restitution jugée ne vit pas chez un produit (aucun forge\\retours\\ en remontant depuis son fichier) — remontée à la factory non jugée" });
    else {
      const ligne = (texte.match(/^[^\n]*remont[ée]e (?:à|a|vers) la factory[^\n]*$/gim) || [])[0] || null;
      if (!ligne)
        ko("S48", "le tour ne dit pas ce qu'il remonte à la factory — une ligne « Remontée à la factory : rien à remonter » " +
          "ou « Remontée à la factory : lot <produit> - RETOURS - AAAAMMJJ<indice> remis » est due (bloc 9). Ne rien remonter " +
          "et n'avoir rien à remonter sont indiscernables sans elle : 21 sources muettes depuis plus de 7 jours le 17/09 (TF-1166)");
      else if (!/rien (?:à|a) remonter/i.test(ligne) && !/RETOURS - \d{8}[a-z]+/.test(ligne))
        ko("S48", `la ligne de remontée ne tranche pas : ni « rien à remonter », ni un lot nommé « … - RETOURS - AAAAMMJJ<indice> » — ${ligne.trim().slice(0, 140)}`);
      else
        ok("S48", /rien (?:à|a) remonter/i.test(ligne) ? "le tour déclare n'avoir rien à remonter à la factory" : "le tour nomme le lot de retours remis à la factory");
    }
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
    const m = /^(?:d[ée]cision\s*(?:n[°ºo]\s*)?|D\s*-?\s*)(\d{1,3})\b/i.exec(tete);
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

    // ---- S49 (17/09/2026, TF-1172) — UNE OPTION QUI COMMANDE UN GESTE HUMAIN DIT COMMENT LE FAIRE
    //
    // LE RETOUR EST LA MESURE, mot pour mot (16/09/2026) : « Tu dis ce qu'il faut faire, mais tu ne
    // dis pas comment le faire simplement ? Du coup, on ne sait pas quoi faire. » La décision D-35 de
    // la restitution du 16/09, jugée PASS sur 46 règles, demandait par quel chemin rouvrir la
    // connexion Power BI, avec trois options portant chacune son coût et ce qu'elle exclut. Le mode
    // opératoire — ouvrir un terminal, coller la commande de connexion, saisir le code dans le
    // navigateur, valider le second facteur — existait, SOIXANTE LIGNES PLUS BAS, dans une action du
    // bloc 8. Le lecteur tranche au bloc 3 et n'y va pas : la décision a dû être reposée au tour
    // suivant.
    //
    // POURQUOI LES CINQ RÈGLES DU BLOC 3 NE LE VOIENT PAS. S31 exige d'une option son coût et ce
    // qu'elle exclut, S16 une recommandation sourcée, S32 une ligne de repli, S15 et S47 un rappel
    // qui nomme sa chose. Aucune ne regarde ce que le lecteur devra FAIRE une fois qu'il aura
    // choisi. S13 pose cette exigence au bloc 8 — une action laissée à l'humain est exécutable telle
    // quelle — et n'avait aucun symétrique au bloc 3, alors que le choix s'y fait.
    //
    // CE QUE LA RÈGLE MESURE, ET CE QU'ELLE NE MESURE PAS. Le vocabulaire des gestes est FERMÉ et
    // ÉTROIT : des verbes où l'humain agit de ses mains sur un terminal, un écran ou un compte.
    // « Publier », « valider », « ouvrir » employés seuls en sont EXCLUS — ils disent une intention,
    // pas un geste, et les admettre accuserait la quasi-totalité du corpus, comme le second
    // déclencheur écarté de S45. Une option qui porte un tel verbe doit être exécutable SUR PLACE :
    // un localisateur dans sa ligne (commande entre accents graves, chemin, libellé d'écran), ou une
    // ligne « Comment faire » dans le groupe de la décision. En tableau, une colonne « Comment
    // faire » suffit — une ligne se juge avec son en-tête, comme pour S19 et S31.
    //
    // BORNE ASSUMÉE : un chemin cité dans l'option satisfait la règle sans énoncer les étapes. La
    // règle juge qu'il y a DE QUOI exécuter là où le choix se fait, pas la qualité du mode
    // opératoire — l'exiger en étapes numérotées imposerait une typographie, et une règle qui crie
    // sur une option exécutable se fait désactiver. Taux d'accusation mesuré sur les synthèses
    // d'`output\04-plans\` avant mise en service (le corpus antérieur n'est pas réécrit).
    const GESTE_HUMAIN = /(se connecter|connectez-vous|s['’]authentifier|authentifiez-vous|saisir|saisissez|coller|collez|taper |tapez |cliquer|cliquez|installer|installez|ouvrir (?:un |le |la |l['’])?(?:terminal|console|invite de commande|navigateur)|lancer (?:la |une )?commande|ex[ée]cuter (?:la |une |le )?(?:commande|script)|valider (?:le |la |un )?(?:second facteur|double authentification|code|MFA)|publier soi-m[êe]me|pousser soi-m[êe]me|renouveler (?:le |un )?(?:jeton|secret|mot de passe))/i;
    const COMMENT_FAIRE = /(comment faire|mode op[ée]ratoire|marche [àa] suivre)/i;
    const sansGeste = [];
    let gestes = 0;
    for (const g of groupesLignes) {
      const entete = g.find((l) => /^\s*\|/.test(l)) || "";
      const enteteComment = COMMENT_FAIRE.test(entete);
      // La ligne « Comment faire » du groupe porte elle-même son localisateur : un libellé nu
      // (« Comment faire : voir plus bas ») est le renvoi que le retour du 16/09 dénonce.
      const groupeComment = g.some((l) => !RE_LIGNE_OPTION.test(l) && COMMENT_FAIRE.test(l) && _LOCALISATEURS.test(l));
      for (const l of g) {
        if (!RE_LIGNE_OPTION.test(l)) continue;
        if (OPTION_PAR_DEFAUT.test(l)) continue;
        if (!GESTE_HUMAIN.test(l)) continue;
        gestes++;
        const enTableau = /^\s*\|/.test(l);
        if (!(_LOCALISATEURS.test(l) || groupeComment || (enTableau && enteteComment))) sansGeste.push(l);
      }
    }
    if (!gestes) ok("S49", "aucune option ne commande un geste humain — rien dont dire le comment");
    else if (sansGeste.length) {
      ko("S49", `${sansGeste.length} option(s) sur ${gestes} commandant un GESTE HUMAIN sans dire COMMENT le faire — ` +
        "le lecteur sait quoi choisir et ne sait pas quoi faire, et le mode opératoire écrit soixante lignes " +
        "plus bas au bloc 8 ne lui sert pas : il tranche ici. Dû sur place : la commande ou le chemin entre " +
        "accents graves, le libellé de l'écran à ouvrir, ou une ligne « Comment faire : 1) … 2) … 3) … » dans " +
        "le groupe de la décision (en tableau, une colonne « Comment faire » suffit). C'est le retour humain " +
        "du 16/09/2026 : « Tu dis ce qu'il faut faire, mais tu ne dis pas comment le faire simplement ? Du " +
        `coup, on ne sait pas quoi faire. » Ex. : ${sansGeste[0].replace(/\s+/g, " ").trim().slice(0, 110)}`);
    } else ok("S49", `${gestes} option(s) commandant un geste humain, chacune exécutable là où le choix se fait`);
  }

  // ---- S51 (17/09/2026, TF-0791) — LE BLOC 1 DIT L'INTENTION, ET IL DIT SI ELLE EST SERVIE ----
  //
  // LE FAIT QUI FONDE LA RÈGLE, et il est vieux de seize jours. Le 01/09, une étude d'opportunité
  // CONFORME à sa définition et VERTE à tous ses contrôles a été refusée par son destinataire :
  // sept questions de son retour restaient sans réponse dans le texte. La loi transverse n° 7 en
  // est née — « le résultat sert l'intention, pas la lettre » — avec `references\INTENTION.md` et
  // deux règles d'oracle. Mais ces deux règles (E9, E10) ne mordent que sur l'ÉTUDE, alors que le
  // retour humain disait « tous types de demande ». Le champ `intention` et le test rétro sont au
  // bloc 1 du gabarit depuis le 17/09 ; il manquait le juge, et *une règle que rien n'exécute
  // décore* — c'est le constat commun aux treize récidives de la classe.
  //
  // CE QUE LA RÈGLE JUGE, et ce qu'elle laisse au lecteur : la PRÉSENCE des deux pièces, jamais
  // leur justesse. Qu'une intention soit bien nommée, qu'un test rétro soit sincère, aucun oracle
  // ne peut le voir — c'est au `non_juge`. Ce qu'elle rend impossible, c'est de rendre un travail
  // sans avoir écrit une seule fois à quoi il servait.
  //
  // AVERTISSANTE à son entrée (hors de `BLOQUANTES` du hook), et ce n'est pas de la prudence de
  // façade : le champ est né le 17/09, le corpus d'`output\04-plans\` ne l'a jamais porté, et une
  // règle bloquante ferait relire huit blocs à chaque restitution jusqu'à ce que le corpus ait
  // tourné. Elle se durcira comme la v2.0.0 avant elle.
  {
    const b1 = horsCode(bloc(texte, BLOCS[0][0]) || "");
    const aIntention = /\bintention\b/i.test(b1);
    const aRetro = /test\s+r[ée]tro/i.test(b1);
    // Une intention se dit en une PHRASE : l'étiquette seule (« intention : — ») ne dit rien. Le
    // compte porte sur la puce qui la porte, ou sur le bloc entier quand le bloc 1 n'est pas en
    // puces — les deux formes sont admises par le gabarit (« sur une ligne ou deux »).
    const zone = puces(b1).find((l) => /\bintention\b/i.test(l)) || b1;
    const substantielle = compteMots(zone) >= 12;
    if (aIntention && aRetro && substantielle) ok("S51", "bloc 1 : l'intention est dite et le test rétro est posé");
    else {
      const manques = [];
      if (!aIntention) manques.push("l'INTENTION initiale de la demande");
      else if (!substantielle) manques.push("une intention SUBSTANTIELLE (l'étiquette seule ne dit rien)");
      if (!aRetro) manques.push("le TEST RÉTRO (« le résultat répond-il à cette intention, et pas seulement à la lettre ? »)");
      ko("S51", `bloc 1 sans ${manques.join(" ni ")} — loi transverse n° 7, \`references\\INTENTION.md\` : `
        + "un livrable conforme à la lettre et refusé par son destinataire a coûté une étude entière le 01/09 (TF-0791)");
    }
  }

  // ---- S50 (17/09/2026, TF-1182) — CE QUE LE POINT D'ÉTAPE PAIE POUR N'AVOIR PAS DE VERDICT ----
  //
  // Le gabarit le dit en trois clauses, et une seule est allégeante : blocs 1, 4 et 8 OBLIGATOIRES
  // ET PLEINS · bloc 2 remplacé par la ligne de mesure (S3, second sens) · blocs 3, 5, 6, 7 et 9
  // admis en une ligne, comme partout ailleurs. Sans S50, déclarer « point d'étape » au bloc 1
  // suffirait à désarmer S3 sans rien donner en échange : ce serait une exemption déguisée en
  // forme jugée, c'est-à-dire exactement ce que TF-0979 a créé le point d'étape pour empêcher.
  //
  // Les seuils sont bas et volontairement grossiers — huit jetons pour la ligne d'identification,
  // douze pour le traité et pour les prochaines actions. Ils n'existent pas pour noter la prose :
  // ils refusent le bloc VIDE et le bloc qui déclare son vide (« aucun », « rien »). Un point
  // d'étape dont le traité est « rien encore » n'est pas un point d'étape, c'est une attente, et
  // l'attente se dit au bloc 5 avec son motif.
  //
  // AVERTISSANTE à son entrée (hors de `BLOQUANTES` du hook), comme la doctrine v2.5.0 le prescrit
  // pour toute règle neuve : elle se durcira quand le corpus l'aura absorbée.
  if (!pointEtape) {
    findings.push({ regle: "S50", statut: "SANS_OBJET",
      message: "cette restitution ne se déclare pas « point d'étape » au bloc 1 — l'obligation des blocs 1, 4 et 8 pleins ne s'applique pas" });
  } else {
    const creux = [[0, "1. En-tête d'identification", 8], [3, "4. Traité", 12], [7, "8. Prochaines actions", 12]]
      .filter(([i, , seuil]) => !estPlein(bloc(texte, BLOCS[i][0]) || "", seuil))
      .map(([, nom]) => nom);
    creux.length
      ? ko("S50", `point d'étape : bloc(s) obligatoire(s) non PLEIN(s) — ${creux.join(" · ")}. Le point d'étape échange le `
        + "verdict contre trois blocs pleins ; vide, il n'est plus qu'une exemption déguisée en forme jugée")
      : ok("S50", "point d'étape : les blocs 1, 4 et 8 sont pleins");
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
Campagne · forge-tests · terminée le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot · intention : prouver que la surveillance de la forge de tests attrape ce qu'elle doit attraper, pas seulement faire tourner la recette. Test rétro : les 19 défauts plantés sont tous détectés, l'intention est servie.

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
    .replace("terminée le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot ·", "terminée aujourd'hui ·")
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
    "| Option | Coût | Exclusions |",
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
  // S47 (retour humain du 16/09/2026) — LE RAPPEL QUI NE NOMME RIEN. La fixture remplace le
  // rappel de la décision par des périphrases, sans rien changer d'autre : même numéro, même
  // longueur, mêmes options, même source. Elle passe donc S15, S16, S30, S31 et S32 — et c'est
  // exactement ce qui s'est produit le 16/09. La verte, elle, est la fixture d'origine : son
  // rappel nomme la forge de tests et cite un journal entre accents graves.
  const decisionMuette = verte.replace(
    "- **Décision 1 —** Publier la version corrigée de la forge de tests ? Le banc rouge vient de tourner en entier :\n"
    + "  chaque défaut planté volontairement a été détecté, donc la surveillance fonctionne et la\n"
    + "  version est prête à sortir. Publier la rend visible aux autres projets ; ne pas publier la\n"
    + "  laisse sur ce poste, et personne d'autre n'en profite tant qu'on attend.",
    "- **Décision 1 —** Publie-t-on la version corrigée, ou attend-on ? Un des outils de la chaîne vient de\n"
    + "  passer son contrôle en entier, donc cette chose est prête à sortir. La rendre visible aux\n"
    + "  autres la met en circulation ; ne pas le faire la laisse là où elle est, et personne d'autre\n"
    + "  n'en profite tant qu'on attend un arbitrage sur cet objet.");
  writeFileSync(join(dir, "decision-muette.md"), decisionMuette, "utf8");
  // S49 (TF-1172, retour humain du 16/09/2026) — L'OPTION QUI COMMANDE UN GESTE ET NE DIT PAS
  // COMMENT. Les deux fixtures ajoutent la MÊME option (c) à la décision de la verte — même verbe
  // de geste, même coût, même exclusion, même recommandation, même ligne de repli : elles ne
  // diffèrent que par la ligne « Comment faire », et c'est la seule forme qui prouve que la règle
  // juge le mode opératoire et non le reste de l'option. La verte d'origine, dont aucune option ne
  // commande de geste, reste PASS — sans quoi la règle crierait sur tout le corpus.
  const OPTION_GESTE = "  - (c) rouvrir la connexion soi-même — se connecter au portail puis saisir le code reçu ;"
    + " coût : effort simple × court ; exclut de repartir sans intervention humaine.";
  const COMMENT_GESTE = "  - Comment faire (c) : 1) ouvrir un terminal ; 2) coller `python forge\\etapes\\data\\sonde.py --login` ;"
    + " 3) saisir le code affiché dans l'écran « Connexion » du navigateur.";
  const saut = String.fromCharCode(10);
  const gesteSansComment = verte.replace("  - sans décision : rien n'est publié.",
    OPTION_GESTE + saut + "  - sans décision : rien n'est publié.");
  const gesteAvecComment = verte.replace("  - sans décision : rien n'est publié.",
    OPTION_GESTE + saut + COMMENT_GESTE + saut + "  - sans décision : rien n'est publié.");
  writeFileSync(join(dir, "geste-sans-comment.md"), gesteSansComment, "utf8");
  writeFileSync(join(dir, "geste-avec-comment.md"), gesteAvecComment, "utf8");
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
  // TF-0805 (05/09) — S21 lit une trace écrite avec un mot accentué EN FIN DE MOT (« tenté »,
  // « refusé »). Avant la frontière Unicode, `\btent[ée]e?s?\b` ne matchait jamais « tenté » : le
  // « é » final n'est pas un caractère de mot ASCII, donc aucune frontière après lui — une action
  // prouvée rougissait, et la règle ne jugeait jamais ce qu'elle croyait juger.
  const accentFinal = verte.replace("publication TENTÉE le 14/08, `HTTP 403 Authorization_RequestDenied` ;",
    "accès tenté le 14/08, sortie de `git push` : refusé par le portail ;");
  writeFileSync(join(dir, "accent-final.md"), accentFinal, "utf8");
  // 08/09 — S38 ET S39 DANS LEURS DEUX SENS (TF-0923). Chacune tient sur UN mot : le motif pour
  // S38, l'identifiant pour S39. Les deux fixtures d'une paire sont donc identiques à ce mot près
  // — c'est la seule forme qui prouve que la règle juge bien ce qu'elle prétend juger, et non le
  // reste de la ligne. Sans le sens VERT, S38 accuserait tout test non exécuté, y compris celui
  // qu'un obstacle extérieur bloque réellement, et S39 accuserait toute remontée : on aurait
  // remplacé un trou par une règle qui crie sur un travail juste.
  const ACTION_TEST = "- **A-3** — enfin TF-0222 (auto_ia) — jouer la recette de couverture du mapping.\n"
    + "  - motif de non-exécution : MOTIF — la recette est jouable en lecture seule.\n"
    + "  - si rien n'est fait : la couverture reste annoncée et jamais mesurée.\n";
  const avecTest = (motif) => verte.replace(
    /- \*\*A-3\*\* — enfin TF-0222 \(auto_ia\)[\s\S]*$/,
    ACTION_TEST.replace("MOTIF", motif));
  const testEsquive = avecTest("hors_mandat");
  const testBloque = avecTest("dependance_bloc_3");
  writeFileSync(join(dir, "test-esquive.md"), testEsquive, "utf8");
  writeFileSync(join(dir, "test-bloque.md"), testBloque, "utf8");
  // S39 : la MÊME puce de bloc 4, avec et sans son identifiant. « remonté à forge-design » se lit
  // « traité » dans les deux cas ; seul l'identifiant dit au lecteur où aller voir.
  const REMONTEE = "- Défaut de contraste remonté à forge-design — preuve : `check_contrast` 3 constats.";
  const remonteeNue = verte.replace("## 5. Non traité", REMONTEE + "\n\n## 5. Non traité");
  const remonteeTracee = verte.replace("## 5. Non traité",
    REMONTEE.replace("forge-design", "forge-design (TF-0930)") + "\n\n## 5. Non traité");
  writeFileSync(join(dir, "remontee-nue.md"), remonteeNue, "utf8");
  writeFileSync(join(dir, "remontee-tracee.md"), remonteeTracee, "utf8");
  // 14/09 — S13 DANS SES DEUX SENS (TF-1085). La MÊME action humaine, l'acteur écrit au format
  // canonique (entre accents graves), sans puis avec un chemin : seul le chemin varie. Sans cette
  // paire, le retrait du nom d'acteur laissait « ` ` » que la règle prenait pour un chemin, et
  // la fixture rouge historique ne l'avait jamais vu parce qu'elle n'écrivait pas l'acteur ainsi.
  const ACTION_HUMAINE = "- **A-3** — enfin TF-0222 (`manuelle_utilisateur`) — trancher le périmètre du lot suivant LIEU.\n"
    + "  - raison d'impossibilité IA : decision — arbitrage métier.\n"
    + "  - si rien n'est fait : le lot suivant ne démarre pas.\n";
  const avecHumaine = (lieu) => verte.replace(
    /- \*\*A-3\*\* — enfin TF-0222 \(auto_ia\)[\s\S]*$/,
    ACTION_HUMAINE.replace(" LIEU", lieu));
  writeFileSync(join(dir, "s13-sans-chemin.md"), avecHumaine(""), "utf8");
  writeFileSync(join(dir, "s13-avec-chemin.md"), avecHumaine(" dans `forge\\LOTS.md`"), "utf8");
  // 08/09 — S40 ET S41 DANS LEURS DEUX SENS (TF-0923, second paquet). Même discipline que S38 et
  // S39 : chaque paire ne varie que sur ce que la règle prétend juger — le DOSSIER du chemin pour
  // S40, la SOURCE citée pour S41. Le reste de la ligne est identique au caractère près.
  //
  // S40 : le MÊME livrable, au même nom daté, cité sous `output\04-plans\` puis sous
  // `output\03-etudes\`. Le premier emprunte la forme réservée aux études, le second EST une
  // étude. Sans le sens vert, la règle refuserait le nommage que la doctrine prescrit aux études.
  const CHEMIN = (dossier) => "- Livrable déposé — preuve : `output\\" + dossier
    + "\\20260908-mapping-lineage.md`, oracle-conformite-projet PASS.";
  const cheminHorsEtudes = verte.replace("## 5. Non traité", CHEMIN("04-plans") + "\n\n## 5. Non traité");
  const cheminEtude = verte.replace("## 5. Non traité", CHEMIN("03-etudes") + "\n\n## 5. Non traité");
  writeFileSync(join(dir, "chemin-hors-etudes.md"), cheminHorsEtudes, "utf8");
  writeFileSync(join(dir, "chemin-etude.md"), cheminEtude, "utf8");
  //
  // S41 : la MÊME décision — garder ou supprimer la version remplacée, le cas exact du 07/09 —
  // avec pour seule différence la SOURCE citée. La première nomme un fichier du chantier, et
  // c'est le défaut : S16 la trouve sourcée, alors que la question était déjà tranchée. La
  // seconde nomme la doctrine qui la tranche. Sans le sens vert, S41 accuserait toute décision
  // qui parle d'un livrable remplacé, y compris celle qui a ouvert le bon texte.
  const DECISION_REGIE = (source) => [
    "- **D-9 —** Faut-il garder la version remplacée du dossier de mapping, ou la supprimer ? Le",
    "  livrable a été redéposé ce matin sous un indice neuf, et l'ancienne version cohabite avec la",
    "  nouvelle dans le même dossier depuis, sans que rien ne dise laquelle fait foi.",
    "  - (a) la déplacer sous `old\\` du même dossier — recommandé : " + source + " ; coût : effort simple × court ; exclut de la supprimer tout de suite ;",
    "  - (b) la supprimer — coût : la version remplacée n'est plus relisible ; exclut toute comparaison ultérieure.",
    "  - sans décision : les deux versions cohabitent.",
  ].join(String.fromCharCode(10));
  const poseDecision = (source) => verte.replace("  - sans décision : rien n'est publié.",
    "  - sans décision : rien n'est publié.\n" + DECISION_REGIE(source));
  const sourceChantier = poseDecision("le journal de recette `recette-S01.md` ne porte aucun défaut ouvert");
  const sourceDoctrine = poseDecision("`REGLES-PROJET.md` règle 7 tranche — un livrable remplacé part sous `old\\` du même dossier, versionné");
  writeFileSync(join(dir, "source-chantier.md"), sourceChantier, "utf8");
  writeFileSync(join(dir, "source-doctrine.md"), sourceDoctrine, "utf8");
  // 09/09 — S24 DANS SES DEUX SENS (TF-0998). La paire ne varie QUE sur la nature du fragment qui
  // porte le mot : un LIBELLÉ que le gabarit impose, contre une RECHERCHE que l'auteur rapporte.
  // C'est la seule forme qui prouve que la règle juge ce qu'elle prétend juger — le mécanisme de
  // recherche, pas le vocabulaire du gabarit.
  //
  // Sens VERT : la ligne exacte refusée le 09/09, au bloc 5, avec son « — motif : » prescrit. Elle
  // ne rapporte aucune recherche : elle dit qu'une publication est interdite par une règle.
  const nl = String.fromCharCode(10);
  const ligneGabarit = "- Publier, actualiser ou interroger quoi que ce soit dans l'espace de travail — motif : `garde_fou` (R-38, aucune publication sur un service hébergé sans GO humain consigné).";
  const motifGabarit = verte.replace("## 5. Non traité" + nl, "## 5. Non traité" + nl + ligneGabarit + nl);
  writeFileSync(join(dir, "motif-gabarit.md"), motifGabarit, "utf8");
  // Sens ROUGE : une VRAIE recherche par nom qui ne trouve rien, au bloc 7. Elle emploie le mot
  // « motif » dans son sens de RECHERCHE (« les motifs de nom joués sur… ») — c'est ce qui prouve
  // que le mot a été BORNÉ et non supprimé : la correction devait retirer une collision, pas
  // éteindre la règle. Et la phrase ne porte ni acquittement par STRUCTURE ni borne au NOM, donc
  // elle conclut bien l'absence de LA CHOSE depuis l'absence du NOM — le défaut du 24/08.
  const rechercheNom = verte.replace("## 7. Risques", "## 7. Risques" + nl + nl
    + "- Aucune table de transcodification dans le catalogue : les motifs de nom joués sur les trois schémas ne remontent rien." + nl);
  writeFileSync(join(dir, "recherche-nom.md"), rechercheNom, "utf8");
  // 11/09 — S42 DANS SES DEUX SENS (TF-1015). La paire ne varie QUE d'UN caractère : le même
  // chemin, au même dossier, à la même forme R-4, long de 124 puis de 125 caractères. Avec les 26
  // caractères du sidecar d'oracle, le premier fait exactement 150 — le plafond, tenu — et le
  // second 151. C'est la seule forme qui prouve que la règle juge la LONGUEUR et rien d'autre :
  // sans le sens vert, elle pourrait accuser tout chemin cité et personne ne le verrait.
  const cheminDeLongueur = (n) => {
    const tete = "output\\04-plans\\Digit-AI - Synthese Mandat - ";
    const queue = " - 20260911a.md";
    return tete + "x".repeat(n - tete.length - queue.length) + queue;
  };
  const PUCE_CHEMIN = (n) => "- Livrable déposé — preuve : `" + cheminDeLongueur(n) + "`, oracle-conformite-projet PASS.";
  const cheminPile = verte.replace("## 5. Non traité", PUCE_CHEMIN(124) + nl + nl + "## 5. Non traité");
  const cheminTropLong = verte.replace("## 5. Non traité", PUCE_CHEMIN(125) + nl + nl + "## 5. Non traité");
  writeFileSync(join(dir, "chemin-pile-150.md"), cheminPile, "utf8");
  writeFileSync(join(dir, "chemin-151.md"), cheminTropLong, "utf8");

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
  // TF-0805 — la trace accentuée en fin de mot est LUE ; la fixture rouge (« acces » sans aucune
  // trace) garde son sens rouge sur S21, jouée plus haut.
  if (!accentFinal.includes("accès tenté le 14/08")) casse.push("fixture accent-final : la substitution n'a pas eu lieu, le cas n'est pas joué");
  const raf = spawnSync(process.execPath, [moi, join(dir, "accent-final.md")], { encoding: "utf8" });
  if (!/"S21"[^}]*PASS/.test(raf.stdout))
    casse.push("S21 (TF-0805) : une trace écrite avec un mot accentué en fin de mot (« tenté », « refusé ») n'est pas lue — " +
      "la frontière ASCII fait rougir une action prouvée : " + (/"S21"[\s\S]{0,180}/.exec(raf.stdout) || [""])[0].replace(/\s+/g, " "));
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
  // S47 dans ses DEUX sens. Le vert est celui qui compte le plus : la fixture d'origine nomme la
  // forge de tests et cite un journal, donc la règle ne doit pas crier dessus — une règle qui
  // accuse un rappel juste se fait désactiver, et c'est la leçon N4.
  if (!/"S47"[^}]*PASS/.test(rv.stdout))
    casse.push("S47 : la verte, dont le rappel nomme la forge de tests et cite son journal, est accusée — " +
      (/"S47"[\s\S]{0,200}/.exec(rv.stdout) || [""])[0].replace(/\s+/g, " "));
  const rdm = spawnSync(process.execPath, [moi, join(dir, "decision-muette.md")], { encoding: "utf8" });
  if (!/"S47"[^}]*FAIL/.test(rdm.stdout))
    casse.push("S47 : un rappel fait ENTIÈREMENT de périphrases (« un des outils de la chaîne », « cette chose », " +
      "« cet objet ») passe encore — il fait 25 mots, donc S15 le laisse passer, et le lecteur ne sait pas de quoi " +
      "on parle. C'est le retour humain du 16/09/2026, mot pour mot : « on ne comprend absolument rien au charabia »");
  // 17/09 — S49 DANS SES TROIS SENS (TF-1172). Les deux fixtures ne diffèrent que par la ligne
  // « Comment faire » ; le troisième sens est porté par la verte d'origine, dont aucune option ne
  // commande de geste et que la règle doit laisser tranquille.
  const rgs = spawnSync(process.execPath, [moi, join(dir, "geste-sans-comment.md")], { encoding: "utf8" });
  const rga = spawnSync(process.execPath, [moi, join(dir, "geste-avec-comment.md")], { encoding: "utf8" });
  if (!/"S49"[^}]*FAIL/.test(rgs.stdout))
    casse.push("S49 : une option qui commande « se connecter … puis saisir le code » sans dire COMMENT le faire passe — " +
      "c'est exactement la décision du 16/09/2026 dont le mode opératoire vivait soixante lignes plus bas, et qui a dû " +
      "être reposée : « Tu dis ce qu'il faut faire, mais tu ne dis pas comment le faire simplement ? »");
  if (!/"S49"[^}]*PASS/.test(rga.stdout))
    casse.push("S49 : la MÊME option, avec sa ligne « Comment faire » et sa commande sur place, est accusée — " +
      (/"S49"[\s\S]{0,200}/.exec(rga.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S49"[^}]*PASS/.test(rv.stdout))
    casse.push("S49 : la verte, dont aucune option ne commande de geste humain, est accusée — la règle mordrait sur " +
      "tout le corpus : " + (/"S49"[\s\S]{0,200}/.exec(rv.stdout) || [""])[0].replace(/\s+/g, " "));
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
  // TF-0998 — S24 dans ses DEUX sens.
  const rmg = spawnSync(process.execPath, [moi, join(dir, "motif-gabarit.md")], { encoding: "utf8" });
  if (!/"S24"[^}]*PASS/.test(rmg.stdout))
    casse.push("S24 (TF-0998) : une ligne du bloc 5 portant le libellé « — motif : » que le GABARIT impose est lue comme " +
      "une recherche par nom — la règle pénalise l'obéissance au gabarit, et le rédacteur n'a d'autre issue que de " +
      "réécrire sa phrase sans gain de sens : " + (/"S24"[\s\S]{0,200}/.exec(rmg.stdout) || [""])[0].replace(/\s+/g, " "));
  const rRechNom = spawnSync(process.execPath, [moi, join(dir, "recherche-nom.md")], { encoding: "utf8" });
  if (!/"S24"[^}]*FAIL/.test(rRechNom.stdout))
    casse.push("S24 (TF-0998) : une VRAIE recherche par nom qui ne trouve rien (« aucune table dont le nom contient `taux` », " +
      "grep sur 206 tables) passe — en bornant le mot « motif » on a éteint la règle au lieu de la corriger");

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
  // 14/09 — S13, SES DEUX SENS (TF-1085).
  const r13n = spawnSync(process.execPath, [moi, join(dir, "s13-sans-chemin.md")], { encoding: "utf8" });
  const r13c = spawnSync(process.execPath, [moi, join(dir, "s13-avec-chemin.md")], { encoding: "utf8" });
  if (!/"S13"[^}]*FAIL/.test(r13n.stdout))
    casse.push("S13 : une action humaine au format canonique (acteur entre accents graves), SANS chemin ni commande, passe — " +
      "le retrait du nom d'acteur laisse de nouveau des accents graves que la règle prend pour un chemin (TF-1085)");
  if (!/"S13"[^}]*PASS/.test(r13c.stdout))
    casse.push("S13 : la MÊME action, AVEC un chemin, est accusée — la règle mordrait sur une action exécutable : " +
      (/"S13"[\s\S]{0,180}/.exec(r13c.stdout) || [""])[0].replace(/\s+/g, " "));
  // 08/09 — S38 ET S39, LEURS DEUX SENS CHACUNE (TF-0923).
  const rte = spawnSync(process.execPath, [moi, join(dir, "test-esquive.md")], { encoding: "utf8" });
  const rtb = spawnSync(process.execPath, [moi, join(dir, "test-bloque.md")], { encoding: "utf8" });
  if (!/"S38"[^}]*FAIL/.test(rte.stdout))
    casse.push("S38 : une action de TEST laissée non exécutée sous `hors_mandat` passe — la règle 40 " +
      "redevient une intention, et c'est exactement le cas du 07/09 où trois niveaux de tests jouables ont été PROPOSÉS sans qu'un seul tourne");
  if (!/"S38"[^}]*PASS/.test(rtb.stdout))
    casse.push("S38 : le MÊME test, bloqué par `dependance_bloc_3` — un obstacle extérieur à l'auteur —, est accusé : " +
      "la règle mordrait sur un travail juste : " + (/"S38"[\s\S]{0,180}/.exec(rtb.stdout) || [""])[0].replace(/\s+/g, " "));
  const rrn = spawnSync(process.execPath, [moi, join(dir, "remontee-nue.md")], { encoding: "utf8" });
  const rrt = spawnSync(process.execPath, [moi, join(dir, "remontee-tracee.md")], { encoding: "utf8" });
  if (!/"S39"[^}]*FAIL/.test(rrn.stdout))
    casse.push("S39 : une remontée annoncée au bloc 4 SANS identifiant passe pour traitée — le lecteur ne peut " +
      "ni la retrouver ni savoir si quelqu'un l'a prise, donc elle vaut « déposé, non traité »");
  if (!/"S39"[^}]*PASS/.test(rrt.stdout))
    casse.push("S39 : la MÊME remontée, avec son identifiant, est accusée — la règle juge la remontée au lieu de sa traçabilité : " +
      (/"S39"[\s\S]{0,180}/.exec(rrt.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S38"[^}]*PASS/.test(rv.stdout) || !/"S39"[^}]*PASS/.test(rv.stdout))
    casse.push("S38 ou S39 accuse la fixture VERTE, qui ne porte ni test esquivé ni remontée : la règle crie sur un travail juste");
  // 08/09 — S40 ET S41, LEURS DEUX SENS CHACUNE (TF-0923, second paquet).
  const rche = spawnSync(process.execPath, [moi, join(dir, "chemin-hors-etudes.md")], { encoding: "utf8" });
  const rce = spawnSync(process.execPath, [moi, join(dir, "chemin-etude.md")], { encoding: "utf8" });
  if (!/"S40"[^}]*FAIL/.test(rche.stdout))
    casse.push("S40 : un livrable cité sous `output\\04-plans\\` au préfixe daté « AAAAMMJJ-… » passe — c'est la forme " +
      "RÉSERVÉE aux études, et c'est par cette imitation que onze livrables d'un mandat sont sortis hors R-4 le 07/09");
  if (!/"S40"[^}]*PASS/.test(rce.stdout))
    casse.push("S40 : le MÊME nom, cité sous `output\\03-etudes\\` — chez lui —, est accusé : la règle refuse le nommage " +
      "que la doctrine prescrit aux études : " + (/"S40"[\s\S]{0,180}/.exec(rce.stdout) || [""])[0].replace(/\s+/g, " "));
  const rsc = spawnSync(process.execPath, [moi, join(dir, "source-chantier.md")], { encoding: "utf8" });
  const rsdoc = spawnSync(process.execPath, [moi, join(dir, "source-doctrine.md")], { encoding: "utf8" });
  if (!/"S41"[^}]*FAIL/.test(rsc.stdout))
    casse.push("S41 : une décision sur une version REMPLACÉE, sourcée par un fichier du chantier, passe — S16 la trouve " +
      "sourcée alors que la règle 7 la tranchait déjà : une source qui n'est pas celle qui tranche est une opinion sourcée");
  if (!/"S41"[^}]*PASS/.test(rsdoc.stdout))
    casse.push("S41 : la MÊME décision, sourcée par `REGLES-PROJET.md` règle 7, est accusée — la règle crie sur celle qui a " +
      "ouvert le bon texte : " + (/"S41"[\s\S]{0,180}/.exec(rsdoc.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S40"[^}]*PASS/.test(rv.stdout) || !/"S41"[^}]*PASS/.test(rv.stdout))
    casse.push("S40 ou S41 accuse la fixture VERTE, qui ne cite ni chemin en forme d'étude ni décision régie : la règle crie sur un travail juste");
  // 11/09 — S42 DANS SES DEUX SENS (TF-1015), à UN caractère près.
  if (cheminDeLongueur(124).length !== 124 || cheminDeLongueur(125).length !== 125)
    casse.push("fixture S42 : les chemins construits ne font pas 124 et 125 caractères — la paire ne prouve plus la borne");
  const rcp = spawnSync(process.execPath, [moi, join(dir, "chemin-pile-150.md")], { encoding: "utf8" });
  const rc151 = spawnSync(process.execPath, [moi, join(dir, "chemin-151.md")], { encoding: "utf8" });
  if (!/"S42"[^}]*FAIL/.test(rc151.stdout))
    casse.push("S42 : un chemin de livrable cité qui fait 151 caractères avec son sidecar d'oracle passe — c'est celui-là qui " +
      "a fait échouer le checkout d'un clone de vérification le 10/09 (22 fichiers refusés, dépôt sans arbre de travail)");
  if (!/"S42"[^}]*PASS/.test(rcp.stdout))
    casse.push("S42 : le MÊME chemin à UN caractère de moins — exactement 150 avec son sidecar, donc le plafond TENU — est accusé : " +
      "la règle mord sur un nom conforme : " + (/"S42"[\s\S]{0,180}/.exec(rcp.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S42"[^}]*PASS/.test(rv.stdout))
    casse.push("S42 accuse la fixture VERTE, qui ne cite aucun chemin long : la règle crie sur un travail juste");
  // 16/09 — S21, S37 ET S8 DANS LEURS DEUX SENS (TF-0987, TF-0992, TF-1125). Les trois paires ne
  // different QUE par la nature du fragment ou le TEMPS du verbe : c'est la seule forme qui prouve
  // qu'une regle a ete BORNEE et non supprimee.
  //
  // S21 (TF-0987) — une action dont le motif declare est `decision` et dont le COMMENT cite une
  // colonne de livrable nommee `presence`. Avant la correction, S21 lisait le nom de la colonne
  // comme son motif et accusait une action explicitement hors de sa portee.
  const s21v = verte.replace("puis relancer la recette S-01.", "puis trier sur la colonne `presence` du livrable.");
  const s21r = s21v.replace("  - pourquoi pas l'IA : decision — arbitrage normatif sur le seuil retenu ;",
                            "  - pourquoi pas l'IA : presence — le fichier de corpus n'est pas sur ce poste ;");
  const f21v = join(dir, "s21-colonne-citee.md");
  const f21r = join(dir, "s21-motif-reel-sans-trace.md");
  writeFileSync(f21v, s21v, "utf8");
  writeFileSync(f21r, s21r, "utf8");
  const r21v = spawnSync(process.execPath, [moi, f21v], { encoding: "utf8" });
  const r21r = spawnSync(process.execPath, [moi, f21r], { encoding: "utf8" });
  if (!/"S21"[^}]*PASS/.test(r21v.stdout))
    casse.push("S21 : une action de motif `decision` citant une COLONNE nommée `presence` dans son « où » est accusée — " +
      "le vocabulaire fermé est cherché hors du périmètre où un motif se déclare, et le contournement coûte le renommage " +
      "d'une colonne de livrable (TF-0987) : " + (/"S21"[\s\S]{0,180}/.exec(r21v.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S21"[^}]*FAIL/.test(r21r.stdout))
    casse.push("S21 : la MÊME action portant RÉELLEMENT le motif `presence` sans aucune trace de tentative passe — " +
      "le périmètre de lecture a supprimé la règle au lieu de la borner");
  // S37 (TF-0992) — `corriges: []`, le NOM D'UN CHAMP dans une sortie VERTE, contre une prose qui
  // annonce une correction sans nommer sa classe ni son controle.
  const B4 = "- Garde de précondition sur le pan qualif — preuve : 18 tests, 0 finding quand la garde s'active.";
  const s37v = verte.replace(B4, B4 + "\n- Rapprochement rejoué — preuve : \`node todo\rapprocher.mjs\` rend \`corriges: []\` et \`nomsPorteurs: []\`, exit 0.");
  const s37r = verte.replace(B4, B4 + "\n- Le débordement de la légende est corrigé dans la maquette.");
  const f37v = join(dir, "s37-champ-cite.md");
  const f37r = join(dir, "s37-prose-sans-classe.md");
  writeFileSync(f37v, s37v, "utf8");
  writeFileSync(f37r, s37r, "utf8");
  const r37v = spawnSync(process.execPath, [moi, f37v], { encoding: "utf8" });
  const r37r = spawnSync(process.execPath, [moi, f37r], { encoding: "utf8" });
  if (!/"S37"[^}]*PASS/.test(r37v.stdout))
    casse.push("S37 : une preuve citant `corriges: []` — une sortie VERTE qui déclare qu'il n'y a EU aucune correction — " +
      "est comptée comme une correction sans classe ; le seul remède offert à l'auteur est d'abîmer sa citation exacte (TF-0992) : " +
      (/"S37"[\s\S]{0,180}/.exec(r37v.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S37"[^}]*FAIL/.test(r37r.stdout))
    casse.push("S37 : une PROSE annonçant « est corrigé » sans contrôle rouge → vert ni classe passe — " +
      "le retrait des citations de code a emporté la règle avec lui");
  // S8 (TF-1125) — l'IRREEL DU PASSE decrit un evenement qui n'a PAS eu lieu ; le passe compose
  // de l'indicatif revendique une completion. La preuve vit en SOUS-PUCE dans les deux cas, donc
  // hors de la puce jugee : seule la tournure les separe.
  const s8v = verte.replace(B4, B4 +
    "\n- La liaison du rapport au modèle est traitée dans le client, là où elle aurait fait échouer la publication." +
    "\n  - preuve : \`pbi-deploy --check\` exit 0.");
  const s8r = verte.replace(B4, B4 +
    "\n- Le garde-fou a fait échouer la publication du rapport." +
    "\n  - preuve : \`pbi-deploy --check\` exit 0.");
  const f8v = join(dir, "s8-irreel-du-passe.md");
  const f8r = join(dir, "s8-passe-compose.md");
  writeFileSync(f8v, s8v, "utf8");
  writeFileSync(f8r, s8r, "utf8");
  const r8v = spawnSync(process.execPath, [moi, f8v], { encoding: "utf8" });
  const r8r = spawnSync(process.execPath, [moi, f8r], { encoding: "utf8" });
  if (!/"S8"[^}]*PASS/.test(r8v.stdout))
    casse.push("S8 : « là où elle AURAIT FAIT échouer la publication » — un événement qui n'a pas eu lieu, et qui désigne " +
      "même un défaut que le code évite — est lu comme une complétion revendiquée sans preuve (TF-1125) : " +
      (/"S8"[\s\S]{0,180}/.exec(r8v.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S8"[^}]*FAIL/.test(r8r.stdout))
    casse.push("S8 : la MÊME phrase au PASSÉ COMPOSÉ — « a fait échouer » —, sans preuve dans sa puce, passe : " +
      "la soustraction de l'irréel a emporté l'indicatif avec elle");
  // 16/09 — S44 ET S45 DANS LEURS DEUX SENS (TF-0988, TF-1127).
  //
  // S44 — la demande citée au bloc 6 porte « uniquement ». Rouge : le bloc ne dit pas ce qu'il y a
  // en plus. Vert : LE MÊME bloc, une phrase ajoutée qui le déclare. Les deux ne diffèrent que par
  // cette phrase, seule forme qui prouve que la règle juge la déclaration et non le mot.
  const B6 = "Aucun écart : la demande a été suivie à la lettre.";
  const s44r = verte.replace(B6, "Vous avez demandé « uniquement les 66 colonnes en cible » → j'ai produit la page des champs → le périmètre est tenu.");
  const s44v = verte.replace(B6, "Vous avez demandé « uniquement les 66 colonnes en cible » → j'ai produit la page des champs → elle ne contient rien d'autre : aucun tableau des colonnes écartées.");
  const f44r = join(dir, "s44-exclusivite-nue.md");
  const f44v = join(dir, "s44-exclusivite-declaree.md");
  writeFileSync(f44r, s44r, "utf8");
  writeFileSync(f44v, s44v, "utf8");
  const r44r = spawnSync(process.execPath, [moi, f44r], { encoding: "utf8" });
  const r44v = spawnSync(process.execPath, [moi, f44v], { encoding: "utf8" });
  if (!/"S44"[^}]*FAIL/.test(r44r.stdout))
    casse.push("S44 : une demande citée portant « UNIQUEMENT » passe sans que le bloc 6 dise ce que le livrable contient " +
      "EN PLUS — c'est par ce silence qu'une page a été livrée avec 342 colonnes là où 66 étaient demandées (TF-0988)");
  if (!/"S44"[^}]*PASS/.test(r44v.stdout))
    casse.push("S44 : la MÊME demande, avec la déclaration « elle ne contient rien d'autre », est accusée — la règle exige " +
      "de compter ce qu'il y a en plus au lieu d'exiger que la question soit posée : " +
      (/"S44"[\s\S]{0,180}/.exec(r44v.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S44"[^}]*PASS/.test(rv.stdout))
    casse.push("S44 accuse la fixture VERTE, dont le bloc 6 ne porte aucun mot d'exclusivité : la règle crie sur un travail juste");
  // S45 — le bloc 5 porte un élément bloqué par `dependance_externe`. Rouge : le bloc 3 ouvre
  // droit sur sa décision. Vert : LE MÊME, un inventaire d'un bloquant énoncé sur place en tête.
  const B5 = "- Regroupement par cause racine : motif — sa cause est traitée, critère de réouverture écrit.";
  const s45base = verte.replace(B5, "- Traduction du pack anglais : motif dependance_externe — le prestataire n'a pas rendu le glossaire.");
  const TETE = "**Bloquants à lever avant d'avancer**\n\n" +
    "- la traduction du pack anglais est arrêtée ; il faut le glossaire validé du prestataire ; sans lui, la campagne suivante repart sur le pack périmé.\n\n";
  const s45v = s45base.replace("## 3. Décisions attendues\n", "## 3. Décisions attendues\n\n" + TETE);
  const f45r = join(dir, "s45-bloquant-disperse.md");
  const f45v = join(dir, "s45-bloquant-inventorie.md");
  writeFileSync(f45r, s45base, "utf8");
  writeFileSync(f45v, s45v, "utf8");
  const r45r = spawnSync(process.execPath, [moi, f45r], { encoding: "utf8" });
  const r45v = spawnSync(process.execPath, [moi, f45v], { encoding: "utf8" });
  if (!/"S45"[^}]*FAIL/.test(r45r.stdout))
    casse.push("S45 : un élément bloqué par `dependance_externe` au bloc 5, sans aucun inventaire en tête du bloc 3, passe — " +
      "le bloquant reste écrit en morceaux dans trois blocs et nulle part en entier (TF-1127)");
  if (!/"S45"[^}]*PASS/.test(r45v.stdout))
    casse.push("S45 : le MÊME bloquant, inventorié en tête du bloc 3 et énoncé sur place, est accusé : " +
      (/"S45"[\s\S]{0,200}/.exec(r45v.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S45"[^}]*PASS/.test(rv.stdout))
    casse.push("S45 accuse la fixture VERTE, dont le bloc 5 ne porte aucun motif d'obstacle : la règle crie sur un travail juste");
  // 16/09 — S46 DANS SES TROIS SENS (TF-1045). Le lexique est celui du PRODUIT : les fixtures
  // vivent donc sous un faux socle de produit, avec son `forge\LEXIQUE.json`. Sans lexique — le cas
  // de toutes les autres fixtures et du pilot lui-même —, la règle rend SANS_OBJET et le DIT.
  mkdirSync(join(dir, "produit", "forge"), { recursive: true });
  writeFileSync(join(dir, "produit", "forge", "LEXIQUE.json"), JSON.stringify({
    format: "pilot/lexique-produit@1",
    termes: [{ proscrit: "grain", remplacer_par: "granularite", depuis: "2026-09-08",
      preuve: "retour humain du 08/09/2026, redemande le 10/09 (ledger seq 99)" }],
  }), "utf8");
  const B4lex = "- Garde de précondition sur le pan qualif — preuve : 18 tests, 0 finding quand la garde s'active.";
  const s46r = verte.replace(B4lex, B4lex + "\n- Modèle sémantique livré au grain quotidien — preuve : 12 mesures, exit 0.");
  const s46v = verte.replace(B4lex, B4lex + "\n- Modèle sémantique livré à la granularite quotidienne — preuve : 12 mesures, exit 0.");
  const f46r = join(dir, "produit", "s46-terme-proscrit.md");
  const f46v = join(dir, "produit", "s46-terme-retenu.md");
  writeFileSync(f46r, s46r, "utf8");
  writeFileSync(f46v, s46v, "utf8");
  const r46r = spawnSync(process.execPath, [moi, f46r], { encoding: "utf8" });
  const r46v = spawnSync(process.execPath, [moi, f46v], { encoding: "utf8" });
  if (!/"S46"[^}]*FAIL/.test(r46r.stdout))
    casse.push("S46 : une restitution employant un terme que le destinataire a dit ne pas lire passe — c'est par ce " +
      "silence qu'un mot clos « corrigé » le 08/09 a été redemandé par le client le 10/09, deux synthèses PASS sur " +
      "41 règles entre les deux (TF-1045)");
  if (!/"S46"[^}]*PASS/.test(r46v.stdout))
    casse.push("S46 : la MÊME restitution avec le terme retenu est accusée : " +
      (/"S46"[\s\S]{0,200}/.exec(r46v.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S46"[^}]*SANS_OBJET/.test(rv.stdout))
    casse.push("S46 : sans lexique dans le socle du projet, la règle devrait rendre SANS_OBJET et le DIRE — " +
      "un produit sans lexique n'est jamais PASS par silence : " +
      (/"S46"[\s\S]{0,160}/.exec(rv.stdout) || [""])[0].replace(/\s+/g, " "));
  // 17/09 — S48 DANS SES QUATRE SENS (TF-1166, D-3 (a)). Un produit se reconnaît à son `forge\retours\` :
  // les fixtures vivent sous un faux socle qui le porte. Les quatre ne diffèrent que d'UNE ligne.
  mkdirSync(join(dir, "produit48", "forge", "retours"), { recursive: true });
  const jouer48 = (nom, ajout) => {
    const f = join(dir, "produit48", nom);
    writeFileSync(f, verte + ajout, "utf8");
    return spawnSync(process.execPath, [moi, f], { encoding: "utf8" });
  };
  const r48muet = jouer48("s48-muet.md", "");
  const r48rien = jouer48("s48-rien.md", "\n- Remontée à la factory : rien à remonter.\n");
  const r48lot = jouer48("s48-lot.md", "\n- Remontée à la factory : lot « Produit-99 - RETOURS - 20260917a » remis.\n");
  const r48flou = jouer48("s48-flou.md", "\n- Remontée à la factory : à voir plus tard.\n");
  if (!/"S48"[^}]*FAIL/.test(r48muet.stdout))
    casse.push("S48 : chez un produit, un tour qui ne dit RIEN de ce qu'il remonte passe — c'est ce silence qui rend " +
      "« rien à remonter » et « rien remonté » indiscernables (TF-1166)");
  if (!/"S48"[^}]*PASS/.test(r48rien.stdout))
    casse.push("S48 : « rien à remonter » est une réponse VALIDE et elle est accusée : " +
      (/"S48"[\s\S]{0,200}/.exec(r48rien.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S48"[^}]*PASS/.test(r48lot.stdout))
    casse.push("S48 : le tour qui NOMME son lot remis est accusé : " +
      (/"S48"[\s\S]{0,200}/.exec(r48lot.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S48"[^}]*FAIL/.test(r48flou.stdout))
    casse.push("S48 : une ligne de remontée qui ne tranche pas (« à voir plus tard ») passe — la règle se satisferait du libellé seul");
  if (!/"S48"[^}]*SANS_OBJET/.test(rv.stdout))
    casse.push("S48 : hors d'un produit (pilot, forge), la règle devrait rendre SANS_OBJET et le DIRE : " +
      (/"S48"[\s\S]{0,160}/.exec(rv.stdout) || [""])[0].replace(/\s+/g, " "));
  // 17/09 — LE POINT D'ÉTAPE DANS SES QUATRE SENS (TF-1182). Les quatre fixtures sortent de la
  // VERTE et ne diffèrent d'elle que par ce que la forme change : la mention au bloc 1 et le titre
  // du bloc 2. C'est la seule façon de prouver que ce qui est jugé est la FORME, et non un reste
  // du document. Le premier sens est celui qui manquait au 17/09 : un point d'étape écrit à la
  // lettre du gabarit doit être ACCEPTÉ, là où il rendait S1 et S3 FAIL — les deux bloquantes.
  const EN_TETE_V = "## 1. En-tête\nCampagne · forge-tests · terminée le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot · intention : prouver que la surveillance de la forge de tests attrape ce qu'elle doit attraper, pas seulement faire tourner la recette. Test rétro : les 19 défauts plantés sont tous détectés, l'intention est servie.";
  const VERDICT_V = "## 2. Verdict\nRecette S-01 (banc rouge de la forge de tests) TENU — 19/19 défauts détectés au banc rouge, pytest 365.";
  // La glose de « S-01 » vit dans la ligne de verdict que la forme remplace : elle se reporte dans
  // la ligne de mesure, sinon la fixture échouerait sur S23 et non sur ce qu'on prétend prouver.
  const MESURE = "Reste à mesurer : la recette S-01 (banc rouge de la forge de tests) rejouée sur la version déployée — par `node oracles\\self-tests.mjs`, au retour du déploiement lancé à 15h44.";
  const pe = verte
    .replace(EN_TETE_V, "## 1. En-tête\nPoint d'étape · forge-tests · déploiement lancé le 2026-08-14 à 15h48 (Europe/Paris) · durée 12 min · agent pilot"
      + " · intention : mettre la version corrigée de la forge de tests à disposition, pas seulement la construire."
      + " Test rétro : le déploiement n'a pas rendu la main, l'intention n'est pas encore servie.")
    .replace(VERDICT_V, "## 2. Ce qui reste à mesurer, et par quoi\n" + MESURE);
  const peSansMesure = pe.replace(MESURE, "La recette S-01 (banc rouge de la forge de tests) semble bien partie, on regardera demain matin.");
  const peSansTraite = pe.replace(B4lex, "- Rien encore : le déploiement n'a pas rendu la main.");
  const jouerPe = (nom, contenu) => {
    const f = join(dir, nom);
    writeFileSync(f, contenu, "utf8");
    return spawnSync(process.execPath, [moi, f], { encoding: "utf8" });
  };
  const rPe = jouerPe("point-etape-conforme.md", pe);
  const rPeM = jouerPe("point-etape-sans-mesure.md", peSansMesure);
  const rPeT = jouerPe("point-etape-sans-traite.md", peSansTraite);
  if (rPe.status !== 0)
    casse.push("POINT D'ÉTAPE : la forme que le gabarit PRESCRIT (TF-0979) est refusée par son propre juge — " +
      "c'est le défaut du 17/09, qui obligeait à la déguiser en verdict : " +
      ((rPe.stdout.match(/"regle": "S\d+",\s*"statut": "FAIL",\s*"message": "[^"]{0,120}/g) || []).join(" · ") || "sortie illisible"));
  if (!/"S1"[^}]*PASS/.test(rPe.stdout))
    casse.push("S1 : un point d'étape dont le bloc 2 porte son titre de mesure est déclaré amputé de son bloc 2");
  if (!/"S3"[^}]*PASS/.test(rPe.stdout))
    casse.push("S3 : la ligne « ce qui reste à mesurer, et par quoi » n'est pas reconnue à la place du verdict");
  if (!/"S50"[^}]*PASS/.test(rPe.stdout))
    casse.push("S50 : le point d'étape aux blocs 1, 4 et 8 pleins est accusé : " +
      (/"S50"[\s\S]{0,200}/.exec(rPe.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S3"[^}]*FAIL/.test(rPeM.stdout))
    casse.push("S3 : un point d'étape qui ne dit NI la mesure attendue NI l'outil qui la rendra passe — déclarer la " +
      "forme suffirait alors à se dispenser du verdict sans rien donner en échange (TF-1182)");
  if (!/"S50"[^}]*FAIL/.test(rPeT.stdout))
    casse.push("S50 : un point d'étape dont le bloc 4 ne porte RIEN passe — la mention au bloc 1 deviendrait une " +
      "exemption déguisée en forme jugée, exactement ce que TF-0979 existe pour empêcher");
  // 17/09 — S51 DANS SES TROIS SENS (TF-0791). Les trois fixtures ne diffèrent que par la FIN de
  // la ligne d'en-tête : les deux pièces, l'intention seule, aucune des deux. C'est la seule forme
  // qui prouve que la règle juge ce qu'elle prétend juger et non le reste du bloc 1.
  const INTENTION = " · intention : prouver que la surveillance de la forge de tests attrape ce qu'elle doit "
    + "attraper, pas seulement faire tourner la recette. Test rétro : les 19 défauts plantés sont tous détectés, "
    + "l'intention est servie.";
  const s51sansRien = verte.replace(INTENTION, ".");
  const s51sansRetro = verte.replace(INTENTION, " · intention : prouver que la surveillance de la forge de tests "
    + "attrape ce qu'elle doit attraper, pas seulement faire tourner la recette.");
  const r51r = jouerPe("s51-sans-intention.md", s51sansRien);
  const r51d = jouerPe("s51-sans-test-retro.md", s51sansRetro);
  if (!/"S51"[^}]*PASS/.test(rv.stdout))
    casse.push("S51 : la fixture VERTE, dont le bloc 1 porte l'intention ET son test rétro, est accusée : " +
      (/"S51"[\s\S]{0,200}/.exec(rv.stdout) || [""])[0].replace(/\s+/g, " "));
  if (!/"S51"[^}]*FAIL/.test(r51r.stdout))
    casse.push("S51 : un bloc 1 SANS intention passe — la loi transverse n° 7 resterait écrite au noyau et au " +
      "gabarit sans qu'aucun juge ne la joue hors des études d'opportunité (TF-0791)");
  if (!/"S51"[^}]*FAIL/.test(r51d.stdout))
    casse.push("S51 : une intention dite SANS son test rétro passe — or c'est le test qui dit si le résultat sert " +
      "l'intention ou seulement la lettre ; l'intention seule est une déclaration, pas une vérification");
  if (!/"S51"[\s\S]{0,400}TEST RÉTRO/.test(r51d.stdout))
    casse.push("S51 : le refus ne nomme pas la pièce manquante — l'auteur relirait son bloc 1 sans savoir quoi y ajouter");
  if (!/"S50"[^}]*SANS_OBJET/.test(rv.stdout))
    casse.push("S50 : hors d'un point d'étape déclaré, la règle devrait rendre SANS_OBJET et le DIRE : " +
      (/"S50"[\s\S]{0,160}/.exec(rv.stdout) || [""])[0].replace(/\s+/g, " "));
  console.log(casse.length
    ? "SELF-TEST FAIL : " + casse.join(" · ")
    : "Self-test restitution : 35/35 PASS (verte PASS ; S51 dans ses TROIS sens (TF-0791 : un bloc 1 SANS l'intention initiale de la demande FAIL, le MÊME portant l'intention mais PAS son test rétro FAIL et nommant la pièce manquante, la verte qui porte les deux PASS — taux mesuré à 94,6 % sur les 148 synthèses d'output\\04-plans\\ à la mise en service, le champ datant de la veille : avertissante) ; le POINT D'ÉTAPE dans ses QUATRE sens (TF-1182 : la forme écrite À LA LETTRE du gabarit — mention au bloc 1, bloc 2 titré « ce qui reste à mesurer, et par quoi » — est ACCEPTÉE là où elle rendait S1 et S3 FAIL, les deux bloquantes ; la MÊME sans sa ligne de mesure ni aucun fait mesurable FAIL sur S3 ; la MÊME dont le bloc 4 ne porte RIEN FAIL sur S50 ; et S50 SANS_OBJET dit à voix haute hors d'un point d'étape déclaré) ; S21 lit un mot accentué en fin de mot — « tenté », « refusé » — grâce à la frontière Unicode (TF-0805) ; ouverture titrée lue (TF-0567) ; ouverture titrée mais technique FAIL ; les QUATRE mises en page d'une même décision au bloc 3 rendent le même verdict (TF-0568) ; la CINQUIÈME, la décision en BLOC DE CITATION qui est la forme de référence, est LUE — S4, S15, S16, S30, S31 et S32 PASS, là où deux décisions fusionnaient en une seule sans numéro et un chapeau de quatre mots au-dessus d'un tableau reste FAIL ; un CHAPEAU COMMUN de 40 mots abaisse le rappel dû par décision (TF-0573) et son absence le rétablit ; rouge FAIL sur S2 horodatage, S3 verdict non factuel, S5 reste sans motif, S9 ouverture absente, S10 coût en jours, S11 auto_ia sans motif, S12 action humaine sans raison, S13 action humaine non exécutable, S14 action sans identifiant, S15 décision sans rappel de son sujet, S16 décision sans recommandation sourcée, S17 renvoi par position, S18 deux formes de tableau dans un bloc, S19 action sans conséquence, S20 jargon sans glose, S21 motif `acces` sans trace de la tentative, S22 négatif externe prononcé d'une seule sonde, S23 désignateur employé plusieurs fois sans glose, S24 absence conclue d'une recherche par nom, S30 décision sans numéro, S33 action sans sélecteur ; S30 dans ses DEUX sens (aucun numéro, puis deux décisions portant le même) et la forme « D-5 — » ADMISE, celle que la doctrine prescrit ; S31 dans ses DEUX sens (options nues FAIL, options portant coût et exclusion PASS) ; S32 dans ses DEUX sens (décision sans option par défaut FAIL, décision la nommant PASS) ; S29 dans ses DEUX sens : un risque declare NON COUVERT avec un bloc 8 vide echoue, le meme risque avec la main passee passe ; S33 dans ses DEUX sens (deux actions portant le meme selecteur FAIL, la verte et ses A-1/A-2/A-3 PASS) ; et le DURCISSEMENT de S30 du 01/09 : le numero NU « 1. », qu'elle acceptait, FAIL desormais — c'est par cette tolerance que le « 3 » d'une action se lisait comme la decision 3 ; S38 dans ses DEUX sens (une action de TEST `auto_ia` esquivee sous `hors_mandat` FAIL, le MEME test bloque par `dependance_bloc_3` PASS) ; S39 dans ses DEUX sens (une remontee du bloc 4 sans identifiant FAIL, la MEME remontee avec le sien PASS) — les deux paires ne different que d'un mot, seule forme qui prouve que la regle juge ce qu'elle pretend juger ; S40 dans ses DEUX sens (le prefixe date « AAAAMMJJ- » cite sous output\\04-plans\\ FAIL, le MEME nom cite sous output\\03-etudes\\ — chez lui — PASS) ; S41 dans ses DEUX sens (une decision sur une version REMPLACEE sourcee par un fichier du chantier FAIL, la MEME sourcee par REGLES-PROJET.md regle 7 PASS) ; S24 dans ses DEUX sens (TF-0998 : la ligne du bloc 5 portant le libelle « — motif : » que le GABARIT impose PASS, la MEME regle restant FAIL sur une vraie recherche par nom qui conclut l'absence de la CHOSE — preuve que le mot a ete BORNE et non supprime) ; S42 dans ses DEUX sens (TF-1015 : un chemin de livrable cite long de 125 caracteres — 151 avec les 26 du sidecar d oracle — FAIL, le MEME chemin a UN caractere de moins, soit exactement 150, PASS) : c est ce depassement qui a fait echouer le checkout d un clone de verification le 10/09, 22 fichiers refuses et depot sans arbre de travail) ; S21 dans ses DEUX sens (TF-0987 : une action de motif `decision` citant une COLONNE nommee `presence` dans son « ou » PASS, la MEME action portant reellement le motif `presence` sans trace FAIL) ; S37 dans ses DEUX sens (TF-0992 : une preuve citant `corriges: []`, sortie VERTE qui declare l absence de correction, PASS, une prose annoncant « est corrige » sans classe ni controle FAIL) ; S8 dans ses DEUX sens (TF-1125 : « la ou elle AURAIT FAIT echouer la publication » PASS, « a FAIT echouer la publication » sans preuve dans sa puce FAIL) — les trois paires ne different que par la nature du fragment ou le TEMPS du verbe) ; S44 dans ses DEUX sens (TF-0988 : une demande citee portant « uniquement » sans declaration de ce qu il y a EN PLUS FAIL, la MEME avec « elle ne contient rien d autre » PASS) ; S45 dans ses DEUX sens (TF-1127 : un element bloque par `dependance_externe` au bloc 5 sans inventaire en tete du bloc 3 FAIL, le MEME bloquant inventorie et enonce sur place PASS) ; S46 dans ses TROIS sens (TF-1045 : une restitution employant un terme proscrit par le lexique du destinataire FAIL, la MEME avec le terme retenu PASS, et SANS_OBJET dit a voix haute quand le projet n a pas de lexique) ; S48 dans ses QUATRE sens (TF-1166 : chez un produit, un tour muet sur ce qu il remonte FAIL, « rien a remonter » PASS, un lot nomme PASS, une ligne qui ne tranche pas FAIL, et SANS_OBJET dit hors d un produit) ; S49 dans ses TROIS sens (TF-1172 : une option commandant « se connecter … puis saisir le code » sans mode operatoire FAIL, la MEME option avec sa ligne « Comment faire » et sa commande sur place PASS, et la verte d origine — aucune option ne commandant de geste — PASS) — taux d accusation mesure sur les 148 syntheses d output\\04-plans\\ avant mise en service : 2,0 % (3 fichiers) ; taux d accusation mesure sur les 207 documents du depot avant ecriture : S44 4,8 %, S45 7,7 %, et le second declencheur propose pour S45 — toute ligne `auto_ia` non executee — a ete ECARTE parce qu il aurait accuse la quasi-totalite du corpus)");
  process.exit(casse.length ? 1 : 0);
}

if (!arg || !existsSync(arg)) {
  console.log(JSON.stringify({ oracle: "oracle-synthese", verdict: "ERREUR", message: "synthèse introuvable — usage : node oracle-synthese.mjs <synthese.md> | --self-test" }));
  process.exit(2);
}
const findings = juger(readFileSync(arg, "utf8"), arg);   // le chemin : S42 juge sa longueur (TF-1015)
const verdict = verdictDe(findings);
console.log(JSON.stringify({
  oracle: "oracle-synthese",
  version: "1.3.0",
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
