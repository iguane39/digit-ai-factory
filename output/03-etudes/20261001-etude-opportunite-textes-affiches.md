---
role: étude d'opportunité (gabarit gabarits\ETUDE-OPPORTUNITE.md, TF-0155) — raccourcir et simplifier les textes que les sessions Claude Code affichent au porteur, sans perte d'information ; demande humaine du 01/10/2026, prompt réécrit par l'analyse output\03-etudes\20261001-L99-textes-affiches-en-session.md
sources_de_verite: [demande humaine du 01/10/2026, references/ECRITURE.md, references/NIVEAUX.md, gabarits/RESTITUTION.md, oracles/oracle-synthese.mjs, oracles/hook-restitution.mjs, oracles/oracle-ecriture.mjs, transcripts des profils ~/.claude et ~/.claude-b du 26/09 au 01/10/2026]
verifie_le: 2026-10-01
lecteur: le porteur de la Factory, qui lit chaque fin de tour pour décider
---

# Étude d'opportunité — textes affichés en session Claude Code — 20261001b

Révision b du 01/10/2026 : le porteur a recadré la cible après la version a. La restitution en blocs reste, puisqu'elle sert à reprendre le contexte entre 6 et 10 sessions parallèles. La cible devient les statuts, les prochaines étapes et les problèmes.

## En tête : ce qu'il faut retenir

Sur 175 tours mesurés du 26/09 au 01/10, les textes de statut entre les appels d'outils font 143 885 mots. Un mot sur 5 y raconte le geste en cours (« je lance », « puis je commite ») au lieu de dire un résultat. Les prochaines étapes prennent 56 mots par action en médiane. Aucun bloc des risques ne tient en une ligne (0 sur 103), et une même phrase de risque revient jusqu'à 15 tours de suite.

Option recommandée, O2 : un statut dit un résultat ou se tait ; une action tient en 25 mots hors commande ; un risque est propre au tour, sinon une ligne suffit. Sur des textes réels, une action passe de 55 à 29 mots, sans information perdue.

Décision attendue : adopter O2.

## Seuil de déclenchement (vérifié avant écriture)

Le seuil est atteint 2 fois (`gabarits\ETUDE-OPPORTUNITE.md`, section « Seuil »). Le sujet touche le noyau, puisque la restitution de fin de tour est une règle du pilot (R-44 : toute fin de tour suit le gabarit de restitution). Il touche aussi toutes les forges et tous les produits, où le même juge tourne.

## Intention de l'utilisateur (loi n° 7, TF-0791)

La demande d'origine, mot pour mot :

> « Construis une étude d'opportunités pour les textes générés dans les fenêtres de prompt Claude Code. Il y a très souvent trop de texte, trop de complexité, l'utilisation de termes trop techniques, trop pompeux, trop verbeux. Il faut raccourcir les textes, les simplifier, aller à l'essentiel, sans perdre les informations. »

Elle a été réécrite par l'analyse L99 du jour, puis le porteur a demandé « exécute le prompt ». La version a reconstruisait l'intention comme « lire moins chaque fin de tour », et recommandait d'afficher moins de blocs. Le porteur l'a corrigée le même jour :

> « Je ne parle pas du prompt de restitution qui permet de se remettre dans le contexte lorsqu'on gère 6 à 10 sessions Claude Code en parallèle, mais des textes de statut, des prochaines étapes, des problèmes qui sont très verbeux, parfois pour ne rien dire... »

L'intention retenue : que chaque phrase de statut, d'action ou de problème apporte un fait au lecteur, sans retirer de bloc à la restitution. L'étude propose, elle ne modifie aucune règle.

## 0. Traitement des entrants

La demande est la seule entrée ; ses impératifs (« il faut raccourcir ») sont pris comme objectif de l'étude, pas comme ordre d'exécution. Les transcripts sont des données : les textes humains qu'ils contiennent sont comptés, jamais suivis. Aucun nom de produit ni de personne lu dans les transcripts n'est cité ici.

## 1. Partition du problème

Le sujet se découpe en 5 sous-questions disjointes ; chaque option de la section 4 dit lesquelles elle traite.

- **P-A, volume** : combien de mots sont affichés, et par quel type de texte ?
- **P-B, place de la réponse** : combien de mots faut-il lire avant le verdict et avant la décision ?
- **P-C, vocabulaire** : combien d'identifiants internes (TF-, D-, S…), et quelle part est expliquée ?
- **P-D, cause** : quelle part de la longueur une règle du pilot exige-t-elle, et quelle part vient du modèle ?
- **P-E, conservation** : comment prouver qu'un texte raccourci n'a rien perdu ?

### Mesure (P-A à P-D)

La mesure porte sur 170 tours humains ouverts dans l'extension VS Code entre le 26/09 et le 01/10/2026, sur les 2 profils (55 sur `~\.claude`, 115 sur `~\.claude-b`), hors sessions de bac à sable et hors tour en cours. Script : `mesure-textes.mjs` puis `agrege.mjs`, rejoués dans le répertoire temporaire de la session le 01/10/2026 entre 16h05 et 17h40. Un mot est une suite de lettres ou de chiffres. Le tableau se lit ligne par ligne : chaque ligne est un type de texte affiché, classé du plus gros au plus petit volume.

| Type de texte affiché | Mots sur 6 jours | Part | Médiane par tour |
|---|---|---|---|
| Réponse de fin de tour | 230 809 | 43 % | 1 465 (2 190 pour une restitution complète) |
| Textes entre les appels d'outils | 140 218 | 26 % | 234 |
| Sorties de hooks (surtout à l'ouverture de session) | 105 231 | 20 % | 0 (738 sur `~\.claude`) |
| Rappels du juge de fin de tour après un refus | 54 879 | 10 % | 2 386 en moyenne par refus |
| Questions posées par l'outil de question | 4 661 | 1 % | 0 |
| **Total** | **535 798** | 100 % | 2 741 |

Les 4 constats suivants en découlent.

- **P-B, place de la réponse.** Dans une restitution complète, le verdict arrive après 296 mots et la première décision après 368 mots, en médiane sur 100 tours. Le bloc 0 (synthèse d'ouverture) et le bloc 2 (verdict) ne pèsent que 7 % des mots.
- **P-C, vocabulaire.** Les textes portent 1,2 identifiant interne pour 100 mots, et 34 % sont suivis d'une explication entre parenthèses ou après deux-points. Cette part est mesurée par motif, donc approchée.
- **P-D, cause.** Le rappel du juge est imposé à 100 % : c'est un texte fixe de 2 434 mots (constante `RAPPEL`, ligne 655 de `oracles\hook-restitution.mjs`), qui empile 14 versions datées du gabarit. Pour la réponse finale, la structure en 9 blocs est imposée, la longueur ne l'est pas : la restitution conforme rendue à 16h00 ce jour, avec 1 décision et 3 actions, tenait en 670 mots, soit 31 % de la médiane.
- **Le niveau « Simple »** (réponse directe de 150 mots au plus, en essai depuis le 26/09) n'a servi qu'à 1 tour sur 170, et ce tour a quand même été refusé une fois. L'essai fournira peu de données à son bilan du 02/10.

### Densité des statuts, des actions et des problèmes (révision b)

Cette seconde mesure porte sur 175 tours (même fenêtre, relevée plus tard dans la journée) avec `densite.mjs`, `motifs.mjs` et `bloc8.mjs`. Une phrase « porte un fait » si elle contient un chiffre, un chemin, du code, une citation ou un identifiant. Un échantillon de 36 phrases sans fait, lu à la main, montre que ce motif sur-compte le vide : 5 statuts sur 12 informent quand même. Les chiffres retenus ci-dessous viennent donc de 2 motifs plus étroits, vérifiés sur l'échantillon. Le tableau se lit ligne par ligne : chaque ligne est un type de texte visé par le porteur, avec le motif de verbosité mesuré.

| Texte | Volume mesuré | Motif de verbosité | Mesure |
|---|---|---|---|
| Statuts entre les appels d'outils | 2 047 textes, 143 885 mots | Narration du geste (« je lance », « puis je commite », « je vérifie ») au lieu d'un résultat | 20 % des phrases, 24 727 mots ; 332 textes ne sont faits que de narration |
| Prochaines actions (bloc 8) | 628 lignes, 40 897 mots | Ligne qui redit le contexte de l'action | 56 mots par ligne en médiane, jusqu'à 154 ; 5 actions par tour |
| Risques (bloc 7) | 914 phrases, 13 558 mots | Risque recopié d'un tour à l'autre, signal et parade compris | 108 phrases reviennent dans au moins 3 tours, une dans 15 tours ; 0 bloc sur 103 tient en une ligne ; 123 mots en médiane |
| Problèmes signalés dans les statuts | 440 phrases | Problème annoncé sans cause ni conséquence | 32 % sans aucun fait concret (motif large) |
| Non traité (bloc 5) | 488 puces | Puce longue | 23 mots en médiane, proche de la cible |

Le constat principal : la restitution n'est pas verbeuse par sa structure, mais par ce qu'on met dans 3 de ses blocs et entre les outils. Les blocs 0 à 4 ne sont pas visés.

## 2. Non-recouvrement contre l'existant

Chaque ligne est une règle existante qui joue sur la longueur ou le vocabulaire ; la dernière colonne dit si elle couvre déjà le défaut mesuré.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Règles d'écriture | `references\ECRITURE.md`, E-1 à E-15 (15 règles) : phrase de 35 mots au plus (E-2), sigle expliqué au premier emploi (E-10), vocabulaire du lecteur (E-12) | ne recouvre pas : aucune règle ne borne la longueur d'un texte ni la place de la décision |
| Niveaux de réponse | `references\NIVEAUX.md`, niveau Simple en essai jusqu'au 02/10/2026, niveau Moyen « attend l'étape 2 » | recouvre en partie : les questions courtes, 1 tour sur 170 |
| Gabarit de restitution | `gabarits\RESTITUTION.md` (19 551 mots), règle v2.17.0 : « CE MESSAGE EST LE FICHIER JUGÉ […] la LONGUEUR n'est pas un motif de condensation » | ne recouvre pas, et s'oppose : il interdit d'afficher moins que le fichier |
| Juge de fin de tour | `oracles\oracle-synthese.mjs`, règles S1 à S56 ; `oracles\hook-restitution.mjs`, constante `RAPPEL` | ne recouvre pas : il juge la présence des blocs, jamais leur longueur, et son propre rappel fait 2 434 mots |
| Juge d'écriture | `oracles\oracle-ecriture.mjs`, règles EC-1 à EC-10, dont la famille `annonce-vide` (E-5) | recouvre en partie : il repère l'annonce dans un fichier, jamais dans un statut affiché, qu'aucun juge ne voit avant affichage |
| Écriture des actions et risques | `gabarits\RESTITUTION.md`, bloc 7 « énoncé + signal + parade », bloc 8 aux 7 colonnes | ne recouvre pas : le rappel du juge ne porte aucune borne de longueur par ligne, et le signal et la parade sont exigés même pour un risque reconduit |

## 3. État de l'art daté

État de l'art : non instruit. Motif : le défaut mesuré est interne. 71 % des mots affichés sont des restitutions au format imposé, des rappels du juge ou des sorties de hooks ; aucune source externe ne tranche entre ces règles. Le principe « réponse d'abord » de la norme ISO 24495-1 (langage clair, 2023) est cité sans être instruit, car il a plus de 24 mois.

## 4. Options — jeu fermé O0-O4

Chaque option est éprouvée sur des textes réels des transcripts. Le test de conservation vérifie que l'après garde chaque décision, chaque action, chaque chiffre avec sa source, chaque chemin et chaque réserve.

**O0 — ne rien faire.** Réfutée. Le statu quo se mesure sur 6 jours : 24 727 mots de narration dans les statuts, des lignes d'action de 56 mots en médiane, et des risques recopiés jusqu'à 15 tours de suite.

**O1 — Un statut dit un résultat, ou se tait.**
- *Contenu* : entre 2 appels d'outils, une phrase au plus, qui dit ce qui a été trouvé ou fait, avec son fait. Pas d'annonce du geste suivant. Un problème dit sa cause et sa conséquence, ou attend d'être compris. Porté par une règle E-16 de `references\ECRITURE.md` et une ligne du noyau `CLAUDE.md`. Aucun juge ne voit un statut avant son affichage : la règle se mesure après coup, par `motifs.mjs`, à chaque revue.
- *Avant/après 1*, statut réel d'un produit : « Je commite la mise à jour, puis je rédige la restitution de ce tour, jugée avant affichage comme la précédente. » (20 mots). Après : rien ; le commit est prouvé au bloc 4.
- *Avant/après 2*, statut réel de cette session : « Script de mesure écrit ; je le lance sur les transcripts du 26/09 au 01/10. » (16 mots). Après : « 170 tours mesurés, 535 798 mots affichés. » (7 mots, dit une fois le résultat connu).
- *Conservation* : tenue ; le geste annoncé est prouvé ailleurs, le résultat est dit.
- *Gain* : jusqu'à 18 % des mots de statut, soit environ 24 700 mots sur 6 jours.
- *Coût* : simple × court.
- *Exclut* : rien. Pendant un traitement long, un statut sert à montrer que la session avance ; une ligne de résultat le fait aussi.

**O2 — O1, plus des actions et des risques compacts. Recommandée.**
- *Contenu* : une ligne d'action tient en 25 mots hors commande et hors chemin ; elle garde ses 7 colonnes. Un risque reconduit d'un tour précédent tient en une ligne datée (« toujours ouvert depuis le 28/09 : … ») ; signal et parade ne s'écrivent qu'à sa première apparition. « Aucun risque nouveau » est admis en une ligne. Porté par `gabarits\RESTITUTION.md` (blocs 7 et 8) et par une règle d'avertissement de `oracles\oracle-synthese.mjs`, bloquante après 2 semaines si la revue la confirme.
- *Avant/après 1*, action réelle du pilot, 28/09 (55 mots) : « Clore : lot de retours remis au pilot, journal fermé, synthèse finale en 8 blocs jugée par l'oracle de synthèse (neuve) | auto_ia | lot de retours au gabarit de la forge ; `oracle-lot.mjs`, `oracle-synthese.mjs` | `dependance_bloc_3` : attend D-1 ; à défaut, ce que le travail apprend ne remonte pas à la forge | simple × court ». Après (29 mots) : « Clore le run : lot de retours, journal fermé, synthèse jugée (neuve) | auto_ia | `oracle-lot.mjs`, `oracle-synthese.mjs` | attend D-1 ; sinon rien ne remonte à la forge | simple × court ».
- *Avant/après 2*, risque réel d'un produit, recopié dans 15 tours : « Le déploiement local ne peut pas s'ouvrir tant que l'étape design reste ouverte. », avec son signal et sa parade. Après, du 2e au 15e tour : « Toujours ouvert depuis le premier tour : déploiement local bloqué par l'étape design. »
- *Conservation* : tenue sur les 2 exemples ; acteur, motif, commande et coût de l'abandon restent dans l'action, et le risque reste visible à chaque tour.
- *Gain* : 47 % de mots en moins sur l'action éprouvée ; appliqué au bloc 8, environ 19 000 mots sur 6 jours. Les signaux et parades des 108 phrases récurrentes disparaissent après leur 1re apparition.
- *Coût* : moyen × court.
- *Exclut* : rien ; la restitution garde ses blocs, que le porteur utilise pour reprendre le contexte.

**O3 — O2, plus un rappel court du juge après un refus.**
- *Contenu* : le juge n'affiche que les règles en échec et le chemin du gabarit, au lieu de 2 434 mots (constante `RAPPEL` de `oracles\hook-restitution.mjs`), 23 fois en 6 jours.
- *Avant/après* : refus de 15h58 ce jour, 2 558 mots, et refus du 28/09 sur un produit, 2 390 mots ; après, environ 60 mots chacun.
- *Exclut* : hors de la cible fixée par le porteur le 01/10 (« Je ne parle pas du prompt de restitution »). Cette option reste disponible s'il la demande.

**O4 — Écran réduit aux blocs 0, 2, 3 et 8, le reste dans un fichier (recommandation de la version a).**
- *Avant/après* : un tour du pilot du 28/09 passait de 2 138 à 876 mots.
- *Exclut* : la reprise de contexte sur 6 à 10 sessions parallèles, que le porteur a nommée le 01/10 comme la raison d'être de la restitution. Elle est impossible sous cette contrainte.

## 5. Verdict

- **Option retenue** : O2.
- **Coût** : moyen × court ; une règle d'écriture, une ligne du noyau, 2 blocs du gabarit, une règle d'avertissement du juge, avec leurs tests.
- **Candidature(s) émise(s)** : aucune avant la décision ; une candidature à journaliser après elle.
- **Plan de revue** : le 2026-10-15, rejouer `motifs.mjs` et `bloc8.mjs` sur la quinzaine. Critères : narration sous 8 % des phrases de statut ; ligne d'action à 30 mots au plus en médiane ; phrases de risque récurrentes sous 3 % ; pas plus de refus du juge par tour refusé qu'aujourd'hui (23 refus pour 21 tours).
- **Test rétro** :
  - Opérationnel : l'action éprouvée passe de 55 à 29 mots en gardant acteur, commande, motif et coût.
  - Tactique : chaque statut et chaque ligne d'action porte un fait ; un risque déjà connu ne se relit pas en entier.
  - Stratégie : la restitution garde sa structure, et seul le vide à l'intérieur part.
  - Intention : des statuts, prochaines étapes et problèmes qui disent quelque chose, comme le demande la correction du porteur.
  - Les questions de la demande, une à une : « trop de texte » et « trop verbeux » sont traités par O1 et O2. « Pour ne rien dire » est traité par la règle « un résultat ou rien ». « Sans perdre les informations » est tenu par le test de conservation. « Termes trop techniques » n'est pas traité : 1,2 identifiant pour 100 mots, déjà visé par E-10 et E-12, et ce n'est pas la cible nommée par la correction.

## Question à l'humain

Adopter O2 ? Le choix est posé en décision dans la restitution du tour.
