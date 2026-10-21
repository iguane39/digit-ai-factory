---
lecteur: Sébastien, porteur de la Digit-AI Factory, qui décide des transformations
phase: 1 — diagnostic, lecture seule, proposition révisée
date: 2026-10-20
remplace: Digit-AI - Diagnostic Factory - Oeil critique - 20261020b.md
---

# Diagnostic de la Factory — œil critique, proposition révisée (20/10/2026)

**Ce qui change depuis la version b.** Vous avez validé le diagnostic, rejeté le gel d'un mois et la mise en sommeil des forges (D1-2 et D2-2 de la version b), et demandé un équivalent au compte rendu si son format change (D3-2 de la version b). Les options sont renumérotées ci-dessous ; les options écartées y restent, marquées comme telles. Vos réponses du 20/10 entre 16:19 et 16:44 fixent le cadre de cette version : compte rendu « complet allégé » avec les 9 blocs, blocs 2, 6 et 7 seulement s'ils ont un contenu ; tri des retours à l'entrée puis preuve de rejeu pour tout nouveau contrôle ; verrou au départ et à l'arrivée pour mobiliser les forges. La vérification des forges a renversé D2 : elles servent quand on les appelle, mais rien ne garantit qu'on les appelle. Sections modifiées : a, b (N3), c-D2, d, e, f, i.

Période étudiée : du 20/09 au 20/10/2026. Sources : 464 transcripts de session des deux profils (`~/.claude` et `~/.claude-b`), l'historique git du pilot et des 13 forges, le registre `todo/TODO.jsonl`. Aucun fichier du dépôt n'a été modifié ; les scripts d'analyse sont jetables, dans le répertoire de travail de la session, et sont listés en annexe.

Étiquettes : **[constat]** sourcé ou recalculé, **[hypothèse]** à éprouver, **[recommandation]** à décider. « À vérifier » signale une valeur que je n'ai pas pu rejouer.

## a. Thèse

La Factory livre juste dans la grande majorité des cas : au moins 83 % des demandes passent sans reprise, et les livrables tracés sont de bonne facture. Elle échoue à apprendre : un tiers des reprises répète une consigne déjà donnée, parce que chaque reproche devient un contrôle central qui n'atteint pas le travail suivant. Ces contrôles s'empilent et se paient sur chaque demande, environ 40 % de l'effort. Enfin, les forges servent quand on les appelle, mais rien ne garantit qu'on les appelle : un produit a pu se déclarer complet sans ses exigences, son design ni son audit de tests.

## b. Jugement par niveau

**N4, finalité.** La finalité déclarée (« créer un produit mobilisant les forges bout en bout ») ne couvre qu'une petite part du portefeuille du mois, sans être fausse : les forges servent aussi l'exploitation, les données et le site des produits existants. Sur 257 demandes nouvelles en 30 jours, une seule ressemble à la construction d'un produit neuf ; les autres sont du déploiement et de l'exploitation d'applications existantes, des documents, des présentations, du marketing et, pour 26 %, du travail sur la Factory elle-même **[constat, §c-D2]**. La finalité implicite, « que Sébastien obtienne vite un livrable juste sans se répéter », est servie au premier passage mais pas dans la durée **[constat, §c-D1]**.

**N3, système.** L'articulation pilot / forges / produits fait remonter chaque défaut d'un produit vers le pilot (419 items sur 681 naissent chez un produit, 15 seulement se corrigent chez lui) **[constat, recalcul du registre]**. Le pilot répond en ajoutant une règle, un oracle ou un hook, que l'héritage redescend chez tous les produits. Le système grossit à chaque reproche, sans que le comportement suivant change **[hypothèse causale, §c-D1]**. Les forges sont employées projet par projet, à une cadence plus longue que 30 jours ; leur mobilisation dépend de la mémoire de la session, et la déclaration « livré » ne vérifie pas leurs livrables **[constat, §c-D2]**.

**N2/N1, limité à ce qui pèse sur l'ensemble.** Dans 97 sessions, les hooks de la Factory n'ont pas tourné : 3 445 erreurs « Cannot find module » depuis le 20/09, invisibles pour vous **[constat, transcripts]**. Le hook de fin de tour a refusé 231 réponses, dont 70 % pour un compte rendu absent ; une réponse refusée reste affichée, d'où les doubles affichages signalés le 01/10, le 12/10 et revus le 20/10 **[constat]**. Un livrable a passé 43 règles d'oracle puis a été refusé par vous sur des conventions qu'aucun oracle ne portait **[constat, trace E16]**. Ces faits ne valent que comme preuves des diagnostics ci-dessous.

## c. Trois diagnostics systémiques

### D1 — La boucle d'amélioration convertit chaque reproche en contrôle central, et le reproche revient

**Preuves.**
- Sur 775 messages humains, 105 corrigent ou recadrent le travail rendu ; 35 d'entre eux disent « déjà demandé », « encore » ou « plusieurs fois » **[constat, classement des 775 messages, script `extract.py` puis lecture]**.
- Exemples de récidive datés : textes trop longs, signalés les 01/10 (#322, #326, #332) puis le 20/10 (#950, « j'ai déjà demandé plusieurs fois ») ; installation de la Factory qui pose des questions, signalée le 22/09 (#43) puis 2 fois le 14/10 (#525, #564) ; compte rendu affiché 2 fois, signalé le 01/10 (#312), le 12/10 (#432), et reproduit le 20/10 (trace E24) ; audit complet qui lance forge-tests au lieu de forge-audit, « demandé plusieurs fois » (#702) **[constat, transcripts]**.
- 42 de vos messages demandent explicitement de « remonter à la Factory » : vous faites vous-même l'aiguillage des défauts **[constat, recherche par motif]**.
- La remontée produit de la taille, pas un changement de comportement. Gabarit de compte rendu : 53,8 Ko le 01/09, 182,0 Ko le 20/10 (facteur 3,4). Fichiers de process au pilot : 277 ajoutés, 2 supprimés en 30 jours ; forges : 482 ajoutés, 0 supprimé. Lignes de process au pilot : +64 806, −5 788 **[constat, git, recalcul de la note : écart d'unités relevé, 52 Ko était en Kio]**.
- La préférence ne suit pas l'humain d'un produit à l'autre : la consigne « textes courts en puces » revient en E13, E14 et E15 sur 3 livrables en 3 jours **[constat, trace B]**.

**Hypothèse causale.** La Factory n'a qu'une réponse à un défaut : écrire une règle ou un oracle au pilot. Or vos reproches récurrents portent sur des préférences (longueur, structure, format, ne pas poser de question évitable) et sur des conventions d'un client. Une règle de plus dans un contexte déjà saturé ne les fait pas appliquer : à l'ouverture d'une session de produit, le hook injecte 19 144 caractères en médiane, en plus d'un fichier d'instructions hérité de 25,8 Ko **[constat pour les tailles ; hypothèse pour le lien causal]**.

**Ce qui la réfuterait.** Une baisse de la part des corrections répétées à mesure que les règles s'accumulent ; ou des récidives qui ne portent que sur des items encore ouverts au registre. Je n'ai pas mesuré cette tendance semaine par semaine (« à vérifier » au premier rejeu mensuel).

### D2 — Les forges servent quand on les appelle ; rien ne garantit qu'on les appelle, ni qu'un produit « livré » ait traversé ses forges

**Correction de la version b.** La version b concluait à des forges « sans usage » sur la foi de 30 jours de commits et de transcripts. Cette fenêtre était trop courte pour des forges employées projet par projet **[constat]** :
- Produit-10 : le ledger du run (13 au 26/08) cite forge-agents 24 fois et forge-data 12 fois ;
- Produit-62 : forge-data 49 fois, forge-agents 27, forge-audit 9, forge-design 5, sur des commits du 07 au 18/09 ;
- Produit-02.com : un run d'audit SEO le 15/08 (`runs/20260815-audit-seo-Produit-02/`).

Chaque ledger cite aussi chaque forge une fois à l'ouverture du run ; ces mentions d'inventaire sont exclues des comptes ci-dessus.

**Preuves du défaut d'aiguillage.**
- Produit-82, seul produit neuf du mois : le run ouvert le 14/10 à 11:40 clôt ses étapes P0 à P4 en 6 heures, avec 11 verdicts d'oracle ; un commit du 14/10 à 21:42 déclare « produit complet, seules les clés de fournisseurs restent à saisir » **[constat, `forge/ledger.jsonl` et git log du produit]**.
- Le dépôt ne contient ni `EXIGENCES.json` (forge-conception) ni `DESIGN.md` ou jetons (forge-design) **[constat, `git ls-files`]**. L'audit forge-tests est joué le 15/10 à 10:59, après vos messages #657 (08:15, « est-ce que l'application a été testée ? ») et #689 (09:10, « aucun des process de la Factory n'a été mis en œuvre ») **[constat]**.
- Le verrou existe sur le papier : le contrat « prêt client » de `references/ETAPES-RUN.md` exige oracles de conception verts, forge-tests en exit 0 et traçabilité exigences → tests à 100 %. La règle S72 du compte rendu demande d'écrire « N exigences sur M tenues » avant « livré ». Elle juge le texte du compte rendu, pas la présence des livrables **[constat]**.
- Rappel portefeuille des 257 demandes nouvelles : application 96 (surtout déploiement, pipelines, audit d'applications existantes), outillage de la Factory 66, document 46, marketing 20, présentation 9, skill 4, propale 3, veille 2, autre 11 **[constat, classement]**.
- Sur 30 jours, les 4 skills de la chaîne de conception ont été invoqués une fois chacun ; 5 sessions de produit sur 173 touchent forge-development, 7 forge-tests **[constat, transcripts]**. Ce chiffre ne dit pas que ces forges sont inutiles ; il dit que la session ne les appelle pas d'elle-même.
- Les reprises pour intention mal comprise se concentrent sur la connaissance d'un client : une quinzaine de recadrages chez un seul produit sur l'inscription Entra « comme sur toutes les applis » de ce client, ou l'absence de groupe de ressources `_TFSTATE` (#23 à #307, #8, #77) **[constat]**. Aucune forge ne porte ce savoir ; il vit dans votre tête et dans un projet commun du client.

**Hypothèse causale.** La mobilisation d'une forge dépend de ce que la session retient de la doctrine, dans un contexte d'ouverture déjà chargé de 19 144 caractères en médiane chez un produit. Aucune étape ne dit, au départ, quelles forges la demande appelle. Et la fin d'un run est jugée sur la forme du compte rendu, pas sur la présence des livrables de forge. Une session peut donc dérouler des étapes nominales, obtenir des oracles verts et déclarer « livré » sans avoir traversé la chaîne **[hypothèse ; le cas Produit-82 est un constat]**.

**Ce qui la réfuterait.** Que les autres produits clos ou publiés portent leurs livrables de forge, ce qui ferait d'Produit-82 un cas isolé. Relevé fait : sur 17 produits dotés d'un ledger, 10 portent au moins une clôture ou une publication, et 2 seulement ont les quatre livrables (exigences, design, rapport de tests, dossier MEP) **[constat, `git ls-files` et `forge/ledger.jsonl` de chaque produit]**. Limite : tous les produits n'ont pas à porter les quatre (un reporting de données n'a pas de design à produire) ; aucune carte ne dit aujourd'hui lesquels sont attendus selon le type, ce qui est précisément le manque.

### D3 — Le coût de l'appareil se paie sur chaque demande, quelle que soit sa taille

**Preuves.**
- Part des appels d'outils consacrée à l'appareil (registre, ledger, compte rendu, oracles de forme, lots de retours, index, publication) : 48 % par mots-clés sur 30 047 appels ; relue à la main, 37 % sur 695 appels (trace A) et 43 à 44 % sur 1 013 (trace C). Estimation retenue : environ 40 % **[constat, `traces.py`, validation manuelle à 62-69 % de précision]**.
- Demandes simples au gabarit complet : ajouter une diapositive de tarif, 92 minutes, 191 appels dont 132 d'appareil, compte rendu de 3 505 mots (E20) ; corriger une propale, compte rendu de 2 910 mots (E21) ; renommer un fichier, restitution complète avec ledger et oracles (E22) **[constat, trace C]**.
- Un tiers de vos reprises (35 sur 105) vise la Factory elle-même : verbosité, double affichage, installation, attente de 19 minutes à la publication, décisions posées à tort **[constat]**.
- 212 de vos 775 messages (27 %) répondent à une décision posée ; une demande sur l'outillage de la Factory porte 1,17 décision, contre 0,53 chez un produit ; dans la trace E10, 6 décisions sur 7 n'avaient pas à être posées **[constat]**.

**Hypothèse causale.** Le compte rendu de fin de tour est devenu le point où chaque contrôle s'applique (82 règles de forme). Son coût croît avec le nombre de règles, pas avec la taille de la demande. Le besoin d'origine est légitime : reprendre le contexte quand 6 à 10 sessions tournent en parallèle (#323). Ce besoin ne demande pas 182 Ko de gabarit.

**Ce qui la réfuterait.** Que les refus de fond du hook de fin de tour (environ 42 sur 231) aient arrêté des défauts que vous auriez vus ; ou que vous jugiez utile la restitution complète d'une demande d'une ligne. Ni l'un ni l'autre n'est mesuré.

### Test de H0

H0 (« la Factory optimise sa conformité au détriment de la valeur, et accumule des contrôles pour compenser une mauvaise compréhension de l'intention ») n'est vraie qu'à moitié.

- **Réfute H0.** Au moins 83 % des demandes passent sans reprise ; 120 sur 257 se règlent en un message ; propale, présentation et marketing ont peu de reprises (2 sur 32 demandes) **[constat]**. Les items du registre naissent surtout de vrais défauts rencontrés chez les produits (419 sur 681), pas d'une introspection gratuite **[constat]**. L'intention mal comprise ne cause qu'un tiers des reprises (37 sur 105), à égalité avec les défauts de livrable (33) et de process (35) **[constat]**. Les contrôles qui s'exécutent pendant l'écriture semblent arrêter des défauts : dans les sessions où les hooks étaient cassés, 13 défauts de livrable sur 79 demandes, contre 8 sur 178 ailleurs (effectifs faibles, sessions de types différents) **[constat, `natexp.py` ; lien causal : hypothèse]**.
- **Confirme H0.** Environ 40 % de l'effort va à l'appareil ; un tiers des reprises vise l'appareil ; les contrôles ne compensent pas la compréhension, puisque les récidives continuent **[constat]**.

Lecture retenue : le défaut n'est pas la conformité en soi, c'est l'unique réflexe d'ajout et la place du compte rendu comme lieu de tous les contrôles.

## d. Options par diagnostic

Échelle : coût de mise en œuvre et réversibilité en complexité (faible, moyenne, forte) ; confiance sur le gain attendu.

### D1 — boucle d'amélioration

| Option | Gain attendu | Risque | Coût | Réversibilité | Mesure de réussite | Confiance |
|---|---|---|---|---|---|---|
| D1-0 Ne rien changer | Aucun | Récidives à 35 par mois, croissance continue | Nul | Totale | — | Forte |
| D1-1 Un fichier unique de préférences et de conventions client, chargé partout, à la place de la règle au pilot pour ce qui relève du goût ou du client | Récidives divisées par 2 | Fichier qui grossit à son tour | Faible | Totale | Corrections répétées ≤ 17 par mois | Moyenne |
| **D1-2 Tri à l'entrée puis preuve de rejeu (votre choix « les deux »)** : chaque retour prend une voie parmi 3 ; une préférence ou une convention client va au fichier de D1-1 ; un défaut de livrable se corrige chez le produit, sans lot ; un défaut systémique devient un contrôle au pilot, qui n'entre que s'il rejoue le cas déclencheur (rouge avant, vert après) et retire autant qu'il ajoute | Récidives de préférence traitées à la source ; croissance du pilot limitée aux défauts systémiques | Un retour mal trié reste chez un produit alors qu'il était général | Moyen | Totale | Corrections répétées ≤ 17 par mois ; fichiers de process nets ≤ 0 par mois | Moyenne |
| D1-3 Gel d'un mois de tout nouveau contrôle (ancienne D1-2) | Croissance stoppée | Défauts réels non généralisés | Faible | Totale | — | Écartée par vous le 20/10 |
| D1-4 (soustractive radicale) Passer une fois le stock au crible de la preuve d'utilité : un contrôle bloquant qui n'a arrêté aucun défaut de fond en 30 jours passe en gel réversible, hors sécurité et hors contrôles d'écriture | Contexte et temps d'exécution allégés | Retirer un contrôle utile mais rare | Moyen | Totale (dégel) | Aucun défaut nouveau sur 30 jours dans la famille gelée | Faible tant que l'utilité n'est pas mesurée contrôle par contrôle |

**[recommandation]** D1-1 et D1-2 ensemble, en premier. D1-4 à la revue mensuelle suivante, seulement si D1-2 n'a pas suffi à contenir la croissance.

### D2 — architecture

| Option | Gain attendu | Risque | Coût | Réversibilité | Mesure de réussite | Confiance |
|---|---|---|---|---|---|---|
| D2-0 Ne rien changer | Aucun | Produits déclarés livrés sans leurs forges (8 sur 10 clos ou publiés sans les 4 livrables) | Nul | Totale | — | Forte |
| **D2-1 Verrou au départ et à l'arrivée (votre choix)** : une carte unique « type de demande → forges attendues → livrables attendus » ; au tour 1, la session annonce les forges que la demande mobilise ; à la fin, « livré » n'est possible qu'avec les livrables attendus présents. La carte et le verrou câblent le contrat « prêt client » existant au lieu d'en créer un ; la vérification du texte par S72 est retirée au profit de celle des fichiers | Plus de produit « complet » sans exigences ni tests ; reprises du type Produit-82 évitées | Carte mal calibrée qui exige un livrable inutile | Moyen | Totale | Part des produits clos ou publiés qui portent les livrables de leur type (2 sur 10 aujourd'hui) | Moyenne |
| D2-2 Donner une place première au contexte client (conventions, environnements, interlocuteurs), chargée par tout produit de ce client ; fusionné avec le fichier de D1-1 | Reprises d'intention sur l'exploitation divisées par 2 | Doublon avec le projet commun existant du client | Faible | Totale | Reprises pour intention chez ce client | Moyenne |
| D2-3 (soustractive radicale) Remplacer l'héritage uniforme des produits (`CLAUDE-PRODUIT.md`, 25,8 Ko) par la seule ligne de la carte qui correspond au type du produit, plus le noyau commun ; aucune forge n'est gelée | Contexte d'ouverture d'un produit allégé ; doctrine ciblée, donc mieux appliquée | Un produit qui change de type garde une carte périmée | Moyen | Totale | Taille du fichier hérité ≤ 6 Ko ; reprises stables | Moyenne |
| D2-4 Mise en sommeil des forges peu employées (ancienne D2-2) | — | Forges réellement employées, à une cadence plus longue que 30 jours | — | — | — | Écartée : fondée sur une fenêtre de mesure trop courte |

**[recommandation]** D2-1 et D2-3 ensemble : la même carte sert le verrou et l'allègement de l'héritage. D2-2 rejoint D1-1.

Carte de départ proposée, à valider (les types viennent du portefeuille mesuré) :

| Type de demande | Forges attendues | Livrables exigés avant « livré » |
|---|---|---|
| Produit neuf | conception, design, development, tests, ops | `EXIGENCES.json`, `DESIGN.md` et jetons, rapport forge-tests exit 0, `DOSSIER-MEP.md` |
| Évolution ou exploitation d'une application existante | development, tests, ops | rapport forge-tests sur le périmètre touché ; `DOSSIER-MEP.md` si mise en production |
| Audit complet | audit | rapport forge-audit |
| Site ou contenu web | design, seo-geo, websec | `DESIGN.md`, rapport seo-geo, verdict websec |
| Données ou reporting | data | lineage et rapport de qualité forge-data |
| Agent ou automatisation par agents | agents, agents-security | définitions d'agents et recette, verdict agents-security |
| Document, présentation, propale | design (marque) | verdict de l'oracle du format (page HTML, PPTX, DOCX) |

### D3 — coût de l'appareil

| Option | Gain attendu | Risque | Coût | Réversibilité | Mesure de réussite | Confiance |
|---|---|---|---|---|---|---|
| D3-0 Ne rien changer | Aucun | Coût de 40 % maintenu ; récidives de forme | Nul | Totale | — | Forte |
| **D3-1 Compte rendu « complet allégé » (votre choix)** : les 9 blocs restent ; les blocs 0, 1, 3, 4, 5, 8 et 9 sont toujours présents, car vous les jugez indispensables à la reprise de vos sessions parallèles ; les blocs 2, 6 et 7 n'apparaissent que s'ils ont un contenu. Le hook de fin de tour ne bloque plus que sur 2 motifs : un bloc indispensable absent, une décision sans ses options. Les autres règles de forme deviennent des consignes non bloquantes | Mêmes informations à l'écran ; refus de fin de tour réduits ; doubles affichages raréfiés | Forme plus inégale d'un tour à l'autre | Moyen | Totale | Refus de fin de tour par mois (231 aujourd'hui) ; reprises pour verbosité ou format ; votre jugement sur la reprise de contexte | Moyenne |
| D3-2 (soustractive radicale) Sortir du gabarit tout ce qui n'est pas le contrat de contenu : le préambule de 45,6 Ko (historique des versions) et les 152 justifications d'origine entre parenthèses partent dans un historique non chargé ; le gabarit ne garde que ce que chaque bloc doit porter | Gabarit ramené vers 130 Ko d'abord, sans aucune perte d'information affichée | Perdre la trace du « pourquoi » d'une règle | Faible | Totale (historique conservé à part) | Taille du gabarit | Forte |
| D3-3 Gabarit d'une page à 3 éléments, non bloquant (ancienne D3-2) | — | Perte d'informations nécessaires à la reprise multi-session | — | — | — | Écartée par vous : il faut un équivalent |
| D3-4 Poser par défaut les seules décisions qui relèvent de vous (règle R-58 existante), avec un compteur de décisions évitables | Messages de décision −30 % | Ajoute un contrôle | Faible | Totale | Décisions par demande | Faible |

**[recommandation]** D3-1 et D3-2 ensemble : D3-1 garde vos informations et allège le blocage, D3-2 allège le texte chargé sans rien changer à l'écran.

Le format complet allégé, bloc par bloc :

| Bloc | Présence | Bloquant si absent |
|---|---|---|
| 0. Synthèse d'ouverture | Toujours | Oui |
| 1. En-tête, intention, test rétro | Toujours | Oui |
| 2. Verdict | S'il y a un verdict | Non |
| 3. Décisions | Toujours ; « Aucune » si rien ne vous revient | Oui, et une décision sans options bloque |
| 4. Traité, avec preuves | Toujours | Oui |
| 5. Non traité, avec motifs | Toujours | Oui |
| 6. Écarts à la lettre | S'il y a un écart | Non |
| 7. Risques | S'il y a un risque | Non |
| 8. Prochaines actions | Toujours | Oui |
| 9. Traces | Toujours | Oui |

## e. Cadrage d'intention au tour 1

**Méthode.** Avant de produire, la session écrit en 2 lignes ce qu'elle a compris, sans attendre de réponse :

- « Je livre : <quoi, pour qui, où, quel format et quelle taille>. »
- « Je suppose : <une à trois hypothèses qui changeraient le livrable si elles étaient fausses>. Les exemples de votre demande illustrent ; ils ne bornent pas. »
- « Je mobilise : <les forges de la carte pour ce type de demande> ; avant de dire livré, j'aurai : <les livrables attendus>. »

La troisième ligne est le verrou de départ de D2-1. Sur Produit-82, elle aurait annoncé conception, design et tests dès le 14/10 à 11:40, au lieu du 15/10 après vos remarques **[hypothèse étayée par le constat du §c-D2]**.

Elle ne pose une question que si une hypothèse change le livrable et ne se déduit ni de vos préférences ni des conventions du client (§d, D1-1). Elle ne demande rien d'autre.

**Preuve tirée des traces.** Dans l'échantillon, 7 reprises pour intention mal comprise ; selon les traces, chacune aurait été évitée par une information donnée ou demandée au tour 1 **[constat, traces A à C]** :

- E02 : dépôt tiers en lecture seule, « je fais uniquement du coaching » ; l'hypothèse « je peux pousser » explicitée aurait été corrigée avant le push.
- E04 : règles du projet commun non lues ; l'hypothèse sur les gabarits était explicitable.
- E08 : verbosité des statuts, et non du compte rendu de reprise (#323).
- E17 : « automatiser la prospection », pas « expliquer ce qu'on fait » (#237) ; la phase 1 a coûté 113 appels d'outils.
- E19 : « une photo adaptée à chaque diapositive », pas seulement des photos du lieu (#345).

Hors échantillon, l'étude rejetée ce matin (#952) avait pris trois exemples pour le périmètre ; la ligne « les exemples illustrent » vise ce cas **[constat]**. La relecture d'intention a posteriori, en essai jusqu'au 01/11 (38 relectures, 3,26 millions de jetons), l'avait jugée conforme **[constat, relevé de flotte de l'ouverture de session]**. **[recommandation]** Le cadrage au tour 1 remplace cette relecture a posteriori à la fin de son essai, au lieu de s'y ajouter.

**[hypothèse]** Le cadrage n'évite pas les reprises de connaissance client (Entra) sans le fichier de conventions ; les deux vont ensemble.

## f. Règle anti-inflation

S'applique au pilot, aux forges, à l'héritage des produits et au dispositif de critique.

1. **Une entrée, une sortie.** Tout ajout de règle, d'oracle, de hook, de section de gabarit ou de fichier de process retire au moins autant dans la même famille, en fichiers et en octets. Mesure de départ : +277 fichiers de process et −2 au pilot en 30 jours, +482 et −0 dans les forges **[constat]**. Cible : solde net ≤ 0 par mois.
2. **Plafonds, dérivés de ce qui a tenu.** Le seul fichier plafonné, le `CLAUDE.md` du pilot (6 Ko), est resté stable pendant que les autres triplaient **[constat, note du 20/10 recalculée]** : le plafond marche. Je propose :
   - gabarit de compte rendu : ≤ 130 Ko dès D3-2 (182 Ko aujourd'hui, moins le préambule d'historique de 45,6 Ko et les justifications d'origine), puis ≤ 54 Ko, sa taille du 01/09, à la revue mensuelle suivante si les refus et les reprises ne montent pas ;
   - règles de forme actives ≤ 34, leur nombre du 01/09 (82 aujourd'hui) ; le chiffre de 34 est « à vérifier », la méthode de comptage au 01/09 n'est pas validée ;
   - fichier d'instructions hérité par un produit ≤ 6 Ko, le plafond du pilot (25,8 Ko aujourd'hui) ;
   - contexte injecté par le hook à l'ouverture d'un produit ≤ 9,6 Ko, la moitié de la médiane mesurée (19 144 caractères).
3. **Preuve d'utilité.** Un contrôle bloquant qui n'a arrêté aucun défaut de fond en 30 jours passe en gel. Un contrôle consultatif ne peut rien prouver par ses refus ; il se garde seulement s'il est cité dans une reprise évitée. Les gardes de sécurité ne se retirent jamais sur leur seul silence.
4. **Le dispositif de critique suit la même règle.** Aucun script, agent ni hook permanent ; scripts jetables hors dépôt. Une revue mensuelle tient sur une page. Le journal est plafonné à 12 pages, et les anciennes revues se résument au-delà. Le coût d'une revue reste sous celui de ce diagnostic, environ 1,4 million de jetons d'agents. La critique est retirée si elle ne fait rien décider en 2 revues.

## g. Trois indicateurs de pilotage

| Indicateur | Objet mesuré | Valeur de départ (20/09 au 20/10) | Recalcul |
|---|---|---|---|
| Demandes reprises | Adéquation au premier passage | 17,5 % (45 demandes sur 257 avec au moins une correction dans la session) ; c'est un plancher, car les reprises formulées en nouvelle demande échappent au découpage | Extraire les messages humains, les classer, les découper en demandes par session (scripts `extract.py` et `traces.py`) |
| Consignes répétées | Capacité à apprendre | 35 corrections par mois portant « déjà », « encore » ou « plusieurs fois » (33 % des corrections) | Même extraction, motif sur les corrections, relecture des cas retenus |
| Messages humains par demande, hors la demande elle-même | Interventions de Sébastien | 2,0 (518 messages pour 257 demandes), dont 0,65 réponse à une décision | Même extraction |

La part d'effort consacrée à l'appareil (environ 40 %) n'est pas un indicateur de pilotage ; elle sert à mesurer les transformations D3.

## h. Contre-analyse

- **Classement.** Les 961 messages ont été classés par 4 agents, sans double lecture ; les ids incertains sont marqués. Un classement indépendant pourrait déplacer la répartition des causes de 5 à 10 points (« à vérifier »).
- **Reprises sous-comptées.** Une reprise faite dans une autre session, ou formulée comme une nouvelle demande, n'est pas comptée (cas E15 et E16). Le taux réel est supérieur à 17,5 %.
- **Silence n'est pas satisfaction.** Un livrable sans reprise peut avoir été abandonné ou corrigé ailleurs. Je n'ai pas mesuré l'acceptation explicite.
- **Effet des contrôles.** L'expérience naturelle des hooks cassés suggère que les contrôles d'écriture arrêtent des défauts de livrable. Si cet effet est réel et fort, alléger le stock (D1-4) laisserait passer plus de défauts. C'est la raison de geler plutôt que supprimer, de garder les contrôles d'écriture hors de tout gel, et de ne toucher en D3-1 qu'au caractère bloquant du compte rendu, pas aux contrôles du livrable.
- **Fenêtre de mesure.** La version b a conclu trop vite à des forges « sans usage » sur 30 jours ; la même prudence vaut pour tout chiffre de cadence. Les forges transverses se jugent sur un trimestre au moins.
- **Le travail sur la Factory est aussi votre choix.** 66 demandes portent sur l'outillage de la Factory ; une partie est un investissement que vous décidez, pas un coût subi.
- **Période atypique.** La semaine du 04 au 10/10 ne compte que 18 messages humains ; le mois comprend aussi les trois études d'aujourd'hui sur le même sujet.
- **Non mesuré.** L'utilité réelle des 42 refus de fond du hook de fin de tour ; ce que chaque produit emploie de son héritage ; l'effet des règles de forme avant affichage.

## i. Décisions attendues

Défaut sans réponse : rien n'est transformé, la phase 2 ne démarre pas.

- **a.** Valider le diagnostic révisé, dont D2 renversé (recommandé) ; ou demander un complément sur un point de §h.
- **b.** Transformation T1 = D1-1 + D1-2 + D2-2 : fichier unique de vos préférences et des conventions de chaque client, chargé partout ; tri des retours à l'entrée en 3 voies ; preuve de rejeu et une-entre-une-sort pour tout nouveau contrôle (recommandé, en premier).
- **c.** Transformation T2 = D3-1 + D3-2 : compte rendu complet allégé (9 blocs, blocs 2, 6 et 7 s'ils ont un contenu, blocage sur 2 motifs) et gabarit réduit à son contrat de contenu, historique sorti (recommandé, en deuxième).
- **d.** Transformation T3 = cadrage au tour 1 en 3 lignes (je livre, je suppose, je mobilise), qui remplace la relecture d'intention a posteriori à la fin de son essai le 01/11 (recommandé, en troisième).
- **e.** Transformation T4 = D2-1 + D2-3 : carte « type de demande → forges → livrables », verrou « livré » câblé au contrat « prêt client », héritage des produits réduit à la ligne de leur type (recommandé, avec T3 dont elle partage la carte) ; valider ou corriger la carte de départ du §d.
- **f.** Adopter la règle anti-inflation §f et ses plafonds (recommandé).
- **g.** Retenir les 3 indicateurs §g et la revue mensuelle de la phase 3, sans tâche planifiée tant que vous ne l'avez pas demandée (recommandé).
- **h.** Réparer les hooks cassés de 97 sessions (« Cannot find module ») : c'est une correction N1, hors de ce diagnostic, à faire avant toute mesure avant / après (recommandé, sans attendre).

## Annexe — reproductibilité

Scripts jetables, dans le répertoire de travail de cette session, hors dépôt :

- `extract.py` : messages humains des deux profils, 20/09 au 20/10.
- `traces.py` : découpage en demandes, mesures par demande, échantillon de 25 (graine 20261020).
- `hooks.py` : refus de fin de tour, skills invoqués, contexte d'ouverture.
- `forges.py` : forges touchées par les sessions de produit.
- `hookerr.py` et `natexp.py` : erreurs de hooks et expérience naturelle.
- `mesures/` : recalcul des mesures de la note du 20/10 (registre, gabarit, refus, lignes).
- `traces/traces-A.md`, `traces-B.md`, `traces-C.md` : les 25 traces de bout en bout.

Note de départ revérifiée : `output/04-plans/Digit-AI - Note - Oeil critique des process a travailler - 20261020l.md`. Écarts relevés : 52 Ko était en Kio (53,8 Ko décimaux) ; 231 refus et non 250 ; 82 règles de forme et non 83 (S01 est un nom de fichier) ; 13,5 % de reprises par message sur 775 messages, et non 20 % sur 60 ; « 77 règles sans refus » est exact mais ne prouve rien, ces règles étant consultatives.
