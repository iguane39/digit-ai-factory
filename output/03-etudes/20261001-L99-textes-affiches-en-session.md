# Analyse L99 — étude d'opportunité sur les textes affichés en session Claude Code

Analyse du 01/10/2026, demandée par le porteur (« Améliore ce prompt »), produite par le skill `prompt-analyzer-l99`.

**Prompt analysé (verbatim).** « Construis une étude d'opportunités pour les textes générés dans les fenêtres de prompt Claude Code. Il y a très souvent trop de texte, trop de complexité, l'utilisation de termes trop techniques, trop pompeux, trop verbeux. Il faut raccourcir les textes, les simplifier, aller à l'essentiel, sans perdre les informations. »

Le prompt part d'un constat juste, mais il ignore que le pilot a déjà un dispositif d'écriture. Sans ce dispositif comme point de départ, l'étude redécouvrira des règles qui existent. Elle risque aussi de manquer la cause probable : une partie de la longueur vient des règles mêmes qui jugent chaque fin de tour.

## Chapitre 1 — OODA et étalon noté

**Observe.** Le prompt contient 3 éléments : un livrable (« une étude d'opportunités »), un objet (« les textes générés dans les fenêtres de prompt Claude Code ») et 5 défauts (« trop de texte, trop de complexité, […] trop techniques, trop pompeux, trop verbeux »). Il fixe un but avec une seule garde : « raccourcir […] sans perdre les informations ».

**Orient.** L'auteur est le porteur de la Factory, qui lit chaque fin de tour pour décider. Son objectif profond est de passer moins de temps à lire pour décider aussi bien. L'exécutant sera une session du pilot, soumise à `references\ECRITURE.md` (règles E-1 à E-12), à `oracle-ecriture`, au gabarit de restitution en 8 blocs (`gabarits\RESTITUTION.md`) et à `oracle-synthese` (règles de forme S1 à S56). Le niveau « Simple » de `references\NIVEAUX.md` est en essai jusqu'au 02/10/2026.

**Decide.** 3 stratégies sont possibles :
- un audit de style : relever les tics et réécrire des exemples ;
- une étude causale mesurée : mesurer la longueur par type de texte, imputer chaque mot à sa cause (règle, gabarit, modèle), chiffrer des options ;
- une refonte directe des règles, sans étude.

**Act.** La deuxième stratégie est recommandée. C'est la seule qui puisse conclure qu'une règle du pilot allonge les textes, et la seule dont le gain se mesure.

**Étalon.** Le prompt idéal délimite les textes visés, part de l'existant, impose une mesure avant et après sur les transcripts, définit « information » de façon testable, fixe le format et le nom de l'étude, et se plie lui-même à la sobriété qu'il réclame.

Le tableau note le prompt d'origine ; chaque ligne est une dimension, et les pertes les plus fortes portent sur l'ancrage et la vérifiabilité.

| Dimension | Note | Justification |
|---|---|---|
| Clarté de l'intention | 13/20 | Le but est net, mais « fenêtres de prompt » ne dit pas quels textes |
| Spécification | 6/20 | Ni lecteur, ni format d'étude, ni nom, ni longueur cible |
| Garde-fous | 5/15 | Une seule garde (« sans perdre les informations »), non définie |
| Ancrage | 3/15 | Ni ECRITURE.md, ni NIVEAUX.md, ni la restitution, ni les transcripts |
| Vérifiabilité | 3/15 | « trop » n'a pas de seuil, rien ne prouve le gain |
| Robustesse | 5/15 | Rien n'empêche une étude elle-même verbeuse, ni de viser le seul compte de mots |
| **Total** | **35/100** | Plafond de 40 atteint par 2 défauts bloquants (n° 1 et n° 2 du Ch3) |

## Chapitre 2 — Chainlogic

La chaîne implicite est : les textes sont trop longs → c'est un problème de style → on simplifie le style → on garde l'information. Elle rompt 2 fois. Le passage du constat à la cause n'est pas étayé : les 8 blocs, les gloses obligatoires (règle M18 : un identifiant porte son sens à son premier emploi) et les sources exigées ajoutent des mots à chaque tour, même quand le style est parfait. Ensuite, « raccourcir » et « sans perdre » entrent en collision tant que l'information n'est pas définie : l'exécutant tranchera seul, et gardera tout par prudence.

## Chapitre 3 — Angles morts (inventaire maître)

Chaque ligne est un défaut, classé du plus grave au moins grave ; les bloquants et majeurs sont tous corrigés au Ch8.

| N° | Défaut | Gravité |
|---|---|---|
| 1 | Le dispositif existant est ignoré (E-1 à E-12, `oracle-ecriture`, NIVEAUX en essai jusqu'au 02/10, RESTITUTION, S1-S56) : l'étude reproposera l'existant ou le contredira sans le savoir | bloquant |
| 2 | Aucune mesure de départ : « très souvent » n'est pas mesuré, alors que les transcripts permettent de compter les mots par tour et par type | bloquant |
| 3 | Périmètre flou : réponses finales, textes entre appels d'outils, questions posées, sorties de hooks (13,8 Ko à l'ouverture de cette session), synthèses sur disque | majeur |
| 4 | « Information » n'est pas définie : la perte n'est pas testable | majeur |
| 5 | La cause est supposée stylistique ; le prompt n'autorise pas l'étude à conclure qu'une règle du pilot allonge les textes | majeur |
| 6 | « Trop techniques » ne dit pas pour qui ; les identifiants internes (TF-, D-, R-, S15, noms d'oracles) en sont la cause probable | majeur |
| 7 | Ni le format de l'étude (options, coûts, verdict, décisions) ni son nom ne sont fixés | majeur |
| 8 | Biais du savoir de l'auteur : l'étude, écrite par le système, risque d'être aussi verbeuse que ce qu'elle critique ; aucune borne de longueur | majeur |
| 9 | Conflit entre options et juges : une restitution raccourcie se fait refuser par `oracle-synthese` (remonté du Ch5) | majeur |
| 10 | « Fenêtres de prompt » désigne en fait le panneau de conversation de l'extension VS Code | mineur |

## Chapitre 4 — Factcheck

Une prémisse est vérifiable : « il y a très souvent trop de texte ». Elle est vraie en partie, et mesurée pour un seul cas : `references\NIVEAUX.md` (§ « Ce qui change pour la session ») relève qu'une question courte recevait 1 813 mots en médiane, sur 165 tours du pilot au 25/09. Les autres types de texte ne sont pas mesurés ; le point est remonté au Ch3 n° 2. Aucune ressource distante n'est désignée : pas de prémisse d'accès à mesurer.

## Chapitre 5 — Premortem

L'étude a été livrée et elle déçoit ; voici les 5 causes probables, de la plus à la moins probable.

1. **Elle repropose E-1 à E-12** (escalade du n° 1). *Parade* : inventaire de l'existant d'abord, en disant pour chaque règle si elle est appliquée, jugée, efficace.
2. **Elle invoque le style sans preuve** (n° 2 et 5), sur des exemples choisis à la main. *Parade* : imputer les mots d'un échantillon de tours, en séparant ce qu'exige une règle et ce qui relève du modèle.
3. **Le gain se paie en traçabilité** (n° 4) : une décision perd son sujet, un chiffre sa source. *Parade* : un test de conservation (décisions, chiffres, chemins, actions présents avant et après).
4. **Les options heurtent les juges** (neuf, remonté en n° 9). *Parade* : chaque option nomme les règles qu'elle modifie.
5. **L'étude est elle-même trop longue** (n° 8). *Parade* : borne de longueur et tête d'une demi-page.

## Chapitre 6 — Wargame

- **Le porteur exigeant** veut des avant/après tirés de ses propres tours et un gain chiffré en temps de lecture ; le prompt ne le demande pas.
- **L'expert en langage clair** note que la norme ISO 24495-1 et l'ordre « réponse d'abord » jouent sur la structure plus que sur les mots : la longueur seule ne mesure pas la lisibilité, il faut aussi la place de la décision dans le texte.
- **Le contradicteur** voit 2 échappatoires : couper les gloses fait baisser le compte de mots en rendant le texte opaque ; un exécutant zélé peut réécrire tout de suite les gabarits, ce qui dépasse une étude.
- **Robustesse** : les sessions qui exécuteront le prompt sont soumises à des hooks qui imposent la longueur ; l'étude doit traiter la hiérarchie entre « sois bref » et le juge qui exige 8 blocs.

## Chapitre 7 — Effets de second ordre

La couche s'applique, car l'étude change des textes produits à chaque tour. Un plafond de mots devenu cible produit des textes courts et cryptiques : il faut juger la conservation autant que la longueur. Chaque règle de forme ajoutée au fil des retours allonge le texte et aucune n'est retirée : l'étude doit pouvoir en proposer le retrait. L'essai du niveau Simple finit le 02/10 : son bilan est la meilleure donnée disponible, l'étude doit l'utiliser plutôt que la doubler.

## Chapitre 8 — Synthèse et prompt réécrit

**Score : 35 → 87 (projeté)**, gain le plus fort sur l'ancrage (3 → 14) et la vérifiabilité (3 → 13).

**Diagnostic.** Le constat est juste et déjà mesuré en partie. Le prompt ignore le dispositif existant et ne dit ni quoi mesurer ni ce qu'est une information. Il suppose le style coupable et laisse de côté la structure imposée par les règles.

### Prompt réécrit

```
Étude d'opportunité : rendre plus courts et plus simples les textes que les sessions
Claude Code m'affichent, sans perte d'information.

LECTEUR : moi, le porteur, qui lis chaque fin de tour pour décider. Écris pour moi :
français courant, aucun identifiant interne sans sa glose.

PÉRIMÈTRE : tout texte affiché dans le panneau de conversation de l'extension VS Code :
- les réponses de fin de tour ;
- les textes entre les appels d'outils ;
- les questions qui me sont posées ;
- les sorties de hooks qui me sont affichées.
Hors périmètre : le code, les données, les fichiers livrés sur disque (sauf les synthèses
s'il faut les comparer).

ÉTAPE 1 : INVENTAIRE DE L'EXISTANT, AVANT TOUTE PROPOSITION.
Lis references\ECRITURE.md (E-1 à E-12), references\NIVEAUX.md (essai du niveau Simple
jusqu'au 02/10/2026), gabarits\RESTITUTION.md, oracles\oracle-ecriture.mjs et
oracles\oracle-synthese.mjs. Pour chaque règle qui joue sur la longueur ou le
vocabulaire : s'applique-t-elle au périmètre, un oracle la juge-t-il, raccourcit-elle
ou allonge-t-elle le texte ?

ÉTAPE 2 : MESURE.
Sur les transcripts des 2 profils (~\.claude et ~\.claude-b), échantillonne au moins
30 tours du 26/09 au 01/10/2026, répartis par niveau (Simple, Moyen, Complexe).
Par tour : mots affichés par type de texte ; place de la première décision ou réponse
(en mots depuis le début) ; nombre d'identifiants internes et part glosée.
Impute les mots : exigés par une règle (laquelle) ou laissés au modèle.
Reprends le bilan de l'essai du niveau Simple s'il existe.
Chaque chiffre porte sa source (fichier de transcript, commande).

ÉTAPE 3 : OPTIONS.
3 à 5 options, dont au moins une qui retire ou assouplit une règle du pilot. Pour
chacune : gain estimé (mots, position de la décision), règles et oracles modifiés,
risque de perte d'information, coût de mise en œuvre, 2 avant/après pris dans des
tours réels.

ÉTAPE 4 : VERDICT ET DÉCISIONS.
Une option recommandée, déployée par étapes. Les décisions qui me reviennent en choix
(a)/(b). N'applique aucune modification aux règles, gabarits ou oracles : l'étude
propose, je décide.

DÉFINITION DE L'INFORMATION (test de conservation) : dans tout avant/après, l'après garde
chaque décision posée, chaque action faite ou à faire, chaque chiffre avec sa source,
chaque chemin cité et chaque réserve (« non vérifié »).

FORME : en tête, une demi-page (150 mots au plus) : constat chiffré, option recommandée,
décisions. Corps de 2 500 mots au plus, hors annexes de mesure. Respecte E-1 à E-12 et
passe oracle-ecriture.

NOM ET EMPLACEMENT : output\03-etudes\, selon la convention du dossier
(« AAAAMMJJ-etude-opportunite-<objet>.md ») : 20261001-etude-opportunite-textes-affiches.md
```

### Contrat de sortie

- Tête de 150 mots au plus, avec constat chiffré, option recommandée et décisions.
- Inventaire de l'existant couvrant E-1 à E-12, NIVEAUX, RESTITUTION et les règles S d'oracle-synthese.
- Échantillon d'au moins 30 tours sur les 2 profils, chaque chiffre sourcé.
- 3 à 5 options, dont au moins une qui retire ou assouplit une règle.
- 2 avant/après réels par option, chacun passant le test de conservation.
- Aucun fichier de règle, de gabarit ou d'oracle modifié.
- `oracle-ecriture` PASS ; nom conforme à la convention du dossier.

### Protocole de tests du livrable

- **Type** : document texte. Juges : `oracle-ecriture`, plus le compte de mots de la tête (≤ 150) et du corps (≤ 2 500).
- **Conservation** : une liste de contrôle par avant/après (décisions, actions, chiffres, chemins, réserves).
- **Jeu d'essai** : un tour Simple, un tour Complexe à 8 blocs, un cas limite (sortie de hook longue, ou restitution qui pose une décision).
- **Boucle** : 3 itérations au plus, puis livraison avec les écarts restants.

### Changelog

Chaque ligne relie un ajout au défaut qu'il corrige.

| Ajout | Défaut corrigé |
|---|---|
| Lecteur nommé | Ch3 n° 6 |
| Périmètre listé | Ch3 n° 3 et n° 10 |
| Étape 1, inventaire de l'existant | Ch3 n° 1 (bloquant), Ch5 cause 1 |
| Étape 2, mesure et imputation | Ch3 n° 2 (bloquant) et n° 5, Ch4, Ch5 cause 2 |
| Option qui assouplit une règle | Ch3 n° 5 et n° 9, Ch7 |
| Test de conservation | Ch3 n° 4, Ch5 cause 3, Ch7 |
| Bornes de longueur, forme, nom | Ch3 n° 7 et n° 8, Ch5 cause 5 |
| Rien n'est appliqué, les décisions restent au porteur | Ch6, contradicteur |

### Écarts à la lettre

Chaque ligne est un endroit où le prompt réécrit s'écarte des mots du porteur, à valider un par un.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « Il faut raccourcir les textes » | L'étude propose et vous décidez ; rien n'est modifié pendant l'étude | Une étude d'opportunité ne s'applique pas seule ; les règles touchées relèvent de votre décision |
| « sans perdre les informations » | Une définition en 5 éléments | Sans définition, la garde n'est pas testable |
| « textes générés dans les fenêtres de prompt » | Textes affichés dans le panneau, sorties de hooks comprises, fichiers sur disque exclus | Les sorties de hooks sont affichées et longues ; les fichiers sont un autre sujet |

**Nom du livrable.** La règle L99 (TF-1441) prescrit R-4 et R-25, mais `gabarits\RESTITUTION.md` (v2.20.0) réserve la forme « AAAAMMJJ-… » à `output\03-etudes\`, et toutes les études du dossier la suivent. Le prompt réécrit suit la convention du dossier ; l'écart avec la règle L99 est remonté.
