---
role: analyse L99 du prompt de relance de l'étude sur les textes affichés en session (réponse du porteur à la décision D-42, 01/10/2026)
lecteur: le porteur de la Factory, qui fera exécuter le prompt réécrit
verifie_le: 2026-10-01
---

# Analyse L99 — relance de l'étude sur les textes affichés en session

**Prompt analysé (verbatim).** « 42 : Elargis les règles à plus que les étapes, les problèmes, les risques. Il y a beaucoup de sujets qui sont traités et qui sont très verbeux sans raison. Des sujets qui ressortent sous forme de paragraphe alors que des puces et sous-puces pourraient suffire. De la complexité insérée alors qu'elle pourrait être exprimée en termes clairs, simples et efficaces. C'est le sens de l'étude initiale. Relance l'étude complète pour prendre en considération tous ces éléments et fournir une vraie solution, pas simplement un patch sur 3 sujets. »

Le prompt dit clairement ce qu'il refuse : un correctif sur 3 sujets. Il dit moins bien ce qu'est une « vraie solution ». Il ignore aussi que la règle qu'il réclame pour les puces existe déjà, sans juge qui l'applique. Sans ces 2 précisions, l'étude relancée risque de reproduire les 2 versions précédentes.

## Chapitre 1 — OODA et étalon noté

- **Observe.** 3 défauts sont nommés :
  - « très verbeux sans raison » ;
  - des paragraphes là où « des puces et sous-puces pourraient suffire » ;
  - de la « complexité insérée ».

  Une exigence est posée : « une vraie solution, pas simplement un patch sur 3 sujets ». Le préfixe « 42 : » répond à la décision D-42 *(adopter 3 règles sur les statuts, actions et risques)* : ni (a) ni (b), on élargit.
- **Orient.** Le porteur pilote 6 à 10 sessions parallèles. Il a corrigé 2 fois la cible le même jour :
  - la version a voulait retirer des blocs, ce qui est refusé, car la restitution sert à reprendre le contexte ;
  - la version b ne traitait que 3 blocs, ce qui est jugé trop étroit.

  La cible juste est entre les deux : toute la restitution et tous les textes affichés, blocs conservés.
- **Decide.** 3 stratégies sont possibles :
  - étendre les 3 règles de la version b à chaque bloc ;
  - fixer une grammaire d'écriture d'écran commune à tous les textes, avec son juge ;
  - réécrire le gabarit de restitution.
- **Act.** Je recommande la grammaire commune. C'est la seule « vraie solution » au sens du porteur : une règle par défaut de forme, appliquée partout, avec un juge et une mesure. Réécrire le gabarit serait trop large, et il sert au porteur.

Le tableau note le prompt ; chaque ligne est une dimension, et les pertes portent sur la spécification et la vérifiabilité.

| Dimension | Note | Justification |
|---|---|---|
| Clarté de l'intention | 15/20 | Le refus du correctif est net ; « vraie solution » n'est pas défini |
| Spécification | 8/20 | Ni critère de « sans raison », ni règle d'arbitrage puces ou prose, ni livrable |
| Garde-fous | 6/15 | Rien ne rappelle les blocs à garder ni la conservation de l'information |
| Ancrage | 10/15 | Il s'appuie sur l'étude initiale, sans citer la règle E-11 qui existe déjà |
| Vérifiabilité | 4/15 | Aucune mesure de réussite |
| Robustesse | 6/15 | Une 3e version peut encore manquer la cible |
| **Total** | **49/100** | Pas de défaut bloquant ; 6 défauts majeurs |

## Chapitre 2 — Chainlogic

La chaîne est la suivante : les textes sont verbeux, sous forme de paragraphes et complexes → la cause est un défaut d'écriture général → il faut une solution générale. Elle rompt sur la cause. La version a a mesuré qu'une partie de la longueur vient des règles du pilot elles-mêmes, par exemple le rappel de 25 mots au moins pour chaque décision, ou la phrase « Comment lire le tableau ». Une vraie solution doit pouvoir toucher ces règles, sans retirer de bloc. Le prompt ne le dit pas.

## Chapitre 3 — Angles morts

Chaque ligne est un défaut, classé du plus grave au moins grave.

| N° | Défaut | Gravité |
|---|---|---|
| 1 | « Vraie solution » n'est pas défini. Il faut au minimum une grammaire écrite, un juge qui l'applique, un relais vers les sessions, une mesure avant et après. | majeur |
| 2 | La règle des puces existe déjà : E-11 de `references\ECRITURE.md` (« un paragraphe qui énumère devient une liste ; un raisonnement […] reste en prose »). Son juge pour les restitutions est « revue » : aucun script ne l'applique. L'étude doit expliquer pourquoi elle n'est pas tenue, plutôt que la réécrire. | majeur |
| 3 | Les puces partout casseraient les raisonnements (E-11). Il faut une règle d'arbitrage, et la profondeur reste à 2 niveaux (E-9). | majeur |
| 4 | « Complexité » n'est pas définie. Elle recouvre plusieurs choses mesurables : phrases longues, subordonnées en cascade, identifiants internes, vocabulaire du système, noms abstraits. | majeur |
| 5 | Les acquis des versions a et b ne sont pas rappelés : les blocs restent, et les 3 règles de la version b sont reprises, pas jetées. | majeur |
| 6 | Le sort des versions a et b n'est pas dit. Elles sont indexées sans commit, et une relance qui écrase le fichier les perd. | majeur |
| 7 | « 42 : » n'est pas un choix de l'option : la décision D-42 est donc remplacée, pas tranchée. | mineur |

## Chapitre 4 — Factcheck

Une prémisse est vérifiable : « des sujets qui ressortent sous forme de paragraphe alors que des puces […] pourraient suffire ». Elle est vraisemblable, mais pas mesurée. Les versions a et b n'ont compté ni les paragraphes énumératifs ni leur part. Je la remonte au Ch3 n° 1 comme mesure à faire. Aucune ressource distante n'est en jeu.

## Chapitre 5 — Premortem

L'étude relancée a déçu une 3e fois. Voici les causes probables, de la plus à la moins probable.

1. **Une liste de bonnes pratiques sans juge** (n° 1 et n° 2). Elle redit E-11 et E-12, qui existent sans être tenues. *Parade* : chaque règle nomme son juge, sinon elle n'entre pas.
2. **Des puces partout** (n° 3). Les raisonnements deviennent des fragments. *Parade* : la règle d'arbitrage et 2 exemples réels de chaque sens.
3. **Une étude elle-même verbeuse.** *Parade* : l'étude applique sa propre grammaire, et c'est jugé.
4. **Le gain mesuré sur les mots seulement.** Un texte en puces peut être plus long mais plus rapide à lire. *Parade* : mesurer aussi la place du premier fait et le nombre de mots par puce.
5. **Les sessions ignorent la règle.** Un statut affiché n'est jugé par personne (version b). *Parade* : un relais par le noyau `CLAUDE.md` et par les skills, et une mesure après coup.

## Chapitre 6 — Wargame

- **Le porteur exigeant** veut un avant/après sur un texte de chaque type : statut, chaque bloc, analyse L99, courriel. Il veut que la solution s'applique dès la session suivante, pas seulement au pilot.
- **L'expert en langage clair** note que la norme ISO 24495-1 et les guides de rédaction web s'accordent sur 4 leviers : l'essentiel d'abord, une idée par phrase, des listes pour les éléments parallèles, et le mot courant. Ces 4 leviers suffisent à une grammaire.
- **Le contradicteur** voit une conformité paresseuse possible : transformer chaque phrase en puce, ce qui augmente le nombre de lignes sans clarifier.
- **Robustesse.** La règle s'applique aux skills, aux forges et aux produits. Elle doit tenir en quelques lignes, sous peine d'alourdir à son tour le noyau, qui est limité à 6 Ko.

## Chapitre 7 — Effets de second ordre

- La règle sera lue à chaque tour par toutes les sessions. Chaque mot de la règle coûte donc autant que les mots qu'elle retire.
- Un juge de plus refuse des réponses de plus. Un démarrage en avertissement, mesuré, évite d'allonger les tours par des réécritures.
- La version a montrait qu'un rappel de refus de 2 434 mots est lui-même verbeux. Une vraie solution ne peut pas ignorer ce texte. Le porteur l'a écarté de la cible : à lui de le réintégrer ou non.

## Chapitre 8 — Synthèse et prompt réécrit

**Score : 49 → 88 (projeté).**

**Diagnostic.**
- Le refus du correctif est net, et la cible enfin juste : tout le texte, blocs conservés.
- « Vraie solution » et « complexité » ne sont pas définis, et la règle des puces existe déjà sans juge.
- Rien ne protège les versions précédentes.

### Prompt réécrit

```
Relance complète de l'étude sur les textes affichés en session (révision c), en
remplacement de la décision D-42.

AVANT TOUT : commite l'étude en révision b et l'analyse L99 du matin
(git commit --only), pour garder les versions a et b dans l'historique.

CIBLE : tous les textes que les sessions m'affichent. Cela comprend les statuts entre
les outils, chaque bloc de la restitution (0 à 9), les questions, les analyses comme
L99 et les messages rédigés pour des tiers.
Ce qui reste acquis :
- les blocs de la restitution restent, car ils me servent à reprendre le contexte
  entre 6 et 10 sessions ;
- les 3 règles de la révision b sont reprises dans la solution.

LES 3 DÉFAUTS À TRAITER :
1. Verbeux sans raison : une phrase qui n'apporte aucun fait au lecteur.
2. Paragraphe au lieu de puces : un paragraphe qui énumère des éléments parallèles.
3. Complexité insérée : phrase longue, subordonnées en cascade, identifiant interne
   sans glose, mot du système au lieu du mot courant, nom abstrait au lieu d'un verbe.

ÉTAPE 1 : POURQUOI LES RÈGLES ACTUELLES NE SUFFISENT PAS.
E-9, E-10, E-11 et E-12 de references\ECRITURE.md couvrent déjà ces défauts sur le
papier. Pour chacune, dis qui la juge aujourd'hui sur les textes affichés, et pourquoi
elle n'est pas tenue. Liste aussi les règles de gabarits\RESTITUTION.md qui imposent
des mots (rappels de 25 mots au moins, « Comment lire le tableau »…), avec leur coût
mesuré.

ÉTAPE 2 : MESURE, SUR LES TRANSCRIPTS DES 2 PROFILS, DU 26/09 AU 01/10/2026.
Mesure par type de texte :
- les paragraphes énumératifs (3 éléments parallèles ou plus dans un paragraphe) ;
- les phrases de plus de 25 mots ;
- les identifiants non glosés ;
- la place du premier fait.
Valide chaque motif à la main sur 12 exemples au moins, et rejette celui qui se
trompe plus d'une fois sur 3.

ÉTAPE 3 : LA SOLUTION, UNE GRAMMAIRE D'ÉCRAN.
Écris un jeu court de règles, 10 au plus, qui tient en 1 page. Chaque règle porte :
- son énoncé en une ligne ;
- 1 avant/après réel ;
- son juge : script existant, script à écrire, ou consigne seule si aucun script ne
  peut la voir.
La règle d'arbitrage puces / prose y figure : une énumération va en puces (2 niveaux
au plus), un raisonnement dont chaque pas dépend du précédent reste en prose courte.
Dis par où chaque règle atteint les sessions : noyau CLAUDE.md (6 Ko au plus),
gabarit, skills, hooks.

ÉTAPE 4 : PREUVE.
Réécris selon la grammaire 8 textes réels :
- 1 statut ;
- 3 blocs de restitution différents ;
- 1 restitution entière ;
- 1 chapitre d'analyse L99 ;
- 1 problème ;
- 1 texte pour un tiers.
Pour chacun, donne les mots avant et après, la place du premier fait avant et après,
et le test de conservation : décisions, actions, chiffres avec source, chemins et
réserves gardés.

ÉTAPE 5 : OPTIONS ET VERDICT.
Pose les options de déploiement (O0 à O4), dont une qui assouplit des règles de
RESTITUTION.md sans retirer de bloc. Recommande-en une, à déployer par étapes, avec
un avertissement avant tout blocage. N'applique rien : je décide.

FORME DE L'ÉTUDE : elle applique sa propre grammaire. Tête de 150 mots au plus,
corps de 2 500 mots au plus hors annexes. Elle passe oracle-etude-opportunite et
oracle-ecriture. Fichier : output\03-etudes\20261001-etude-opportunite-textes-affiches.md
(révision c), selon la convention du dossier.
```

### Contrat de sortie

- Les versions a et b sont commitées avant la réécriture.
- L'étape 1 couvre E-9 à E-12 et les règles du gabarit qui imposent des mots, chacune avec son juge actuel.
- Chaque motif de mesure est validé à la main sur 12 exemples au moins.
- La grammaire compte 10 règles au plus, chacune avec un avant/après réel et un juge ou la mention « consigne seule ».
- Les 8 textes réels sont réécrits, et chacun passe le test de conservation.
- Une option assouplit le gabarit sans retirer de bloc.
- L'étude passe `oracle-etude-opportunite` et `oracle-ecriture`, avec une tête de 150 mots au plus et un corps de 2 500 mots au plus.

### Protocole de tests du livrable

- **Juges** : `oracle-etude-opportunite` et `oracle-ecriture`, plus un compte de mots de la tête et du corps.
- **Conservation** : une liste de contrôle par texte réécrit.
- **Jeu d'essai** : les 8 textes de l'étape 4, dont 2 cas limites : un raisonnement qu'il ne faut pas passer en puces, et un texte pour un tiers.
- **Boucle** : 3 itérations au plus, puis livraison avec les écarts restants.

### Changelog

Chaque ligne relie un ajout au défaut qu'il corrige.

| Ajout | Défaut corrigé |
|---|---|
| Grammaire, juges, relais, mesure | Ch3 n° 1, Ch5 causes 1 et 5 |
| Étape 1 sur E-9 à E-12 | Ch3 n° 2 |
| Règle d'arbitrage puces / prose | Ch3 n° 3, Ch5 cause 2, Ch6 contradicteur |
| 5 composantes de la complexité | Ch3 n° 4, Ch4 |
| Acquis rappelés | Ch3 n° 5 |
| Commit d'abord | Ch3 n° 6 |
| « en remplacement de D-42 » | Ch3 n° 7 |
| Place du premier fait | Ch5 cause 4 |
| Option qui assouplit le gabarit | Ch2, Ch7 |

### Écarts à la lettre

Chaque ligne est un écart à valider.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « des puces et sous-puces » | Puces pour les énumérations, prose courte pour les raisonnements, 2 niveaux au plus | E-11 et E-9 le fixent déjà ; des puces partout cassent un raisonnement |
| « Relance l'étude complète » | Révision c du même fichier, les versions a et b commitées d'abord | Garder la trace des 2 premières versions |
| « une vraie solution » | Une grammaire de 10 règles au plus, avec juges, relais et mesure | Sans définition, la demande ne peut pas être vérifiée |
