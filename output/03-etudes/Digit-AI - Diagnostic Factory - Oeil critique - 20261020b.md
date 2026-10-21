---
lecteur: Sébastien, porteur de la Digit-AI Factory, qui décide des transformations
phase: 1 — diagnostic, lecture seule
date: 2026-10-20
---

# Diagnostic de la Factory — œil critique (20/10/2026)

Période étudiée : du 20/09 au 20/10/2026. Sources : 464 transcripts de session des deux profils (`~/.claude` et `~/.claude-b`), l'historique git du pilot et des 13 forges, le registre `todo/TODO.jsonl`. Aucun fichier du dépôt n'a été modifié ; les scripts d'analyse sont jetables, dans le répertoire de travail de la session, et sont listés en annexe.

Étiquettes : **[constat]** sourcé ou recalculé, **[hypothèse]** à éprouver, **[recommandation]** à décider. « À vérifier » signale une valeur que je n'ai pas pu rejouer.

## a. Thèse

La Factory livre juste dans la grande majorité des cas : au moins 83 % des demandes passent sans reprise, et les livrables tracés sont de bonne facture. Elle échoue à apprendre : un tiers des reprises répète une consigne déjà donnée, parce que chaque reproche devient un contrôle central qui n'atteint pas le travail suivant. Ces contrôles s'empilent et se paient sur chaque demande, environ 40 % de l'effort. Enfin, la chaîne de production en 13 forges est organisée par phase de vie d'un produit, alors que les demandes réelles s'organisent par client et par type de livrable.

## b. Jugement par niveau

**N4, finalité.** La Factory poursuit une finalité déclarée (« créer un produit mobilisant les forges bout en bout ») qui ne correspond pas à son portefeuille réel. Sur 257 demandes nouvelles en 30 jours, une seule ressemble à la construction d'un produit neuf ; les autres sont du déploiement et de l'exploitation d'applications existantes, des documents, des présentations, du marketing et, pour 26 %, du travail sur la Factory elle-même **[constat, §c-D2]**. La finalité implicite, « que Sébastien obtienne vite un livrable juste sans se répéter », est servie au premier passage mais pas dans la durée **[constat, §c-D1]**.

**N3, système.** L'articulation pilot / forges / produits fait remonter chaque défaut d'un produit vers le pilot (419 items sur 681 naissent chez un produit, 15 seulement se corrigent chez lui) **[constat, recalcul du registre]**. Le pilot répond en ajoutant une règle, un oracle ou un hook, que l'héritage redescend chez tous les produits. Le système grossit à chaque reproche, sans que le comportement suivant change **[hypothèse causale, §c-D1]**. Les forges suivent le rythme du pilot ; 6 sur 13 ont fait 5 commits ou moins en 30 jours **[constat, git log]**.

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

### D2 — L'architecture en forges suit le cycle de vie d'un produit ; la demande suit le client et le type de livrable

**Preuves.**
- Portefeuille des 257 demandes nouvelles : application 96 (surtout déploiement, pipelines, audit d'applications existantes), outillage de la Factory 66, document 46, marketing 20, présentation 9, skill 4, propale 3, veille 2, autre 11 **[constat, classement]**.
- Les 4 skills de la chaîne de conception (`qualifie-l-entrant`, `enumere-la-surface`, `redige-les-exigences`, `derive-les-vues`) ont été invoqués une fois chacun en 30 jours ; forge-development compte 2 commits et 5 sessions de produit sur 173 la touchent ; forge-tests est touchée par 7 sessions de produit **[constat, transcripts et git]**.
- Le seul produit neuf du mois a été construit hors chaîne : « aucun des process de la Factory n'a été mis en œuvre » (#689), application non testée au point que la connexion échoue (#657) **[constat]**.
- Les reprises pour intention mal comprise se concentrent sur la connaissance d'un client : une quinzaine de recadrages chez un seul produit sur l'inscription Entra « comme sur toutes les applis » de ce client, ou l'absence de groupe de ressources `_TFSTATE` (#23 à #307, #8, #77) **[constat]**. Aucune forge ne porte ce savoir ; il vit dans votre tête et dans un projet commun du client.
- Forges presque à l'arrêt sur 30 jours : observability 0 commit, websec 1, agents-security 2, development 2, seo-geo 5, data 5 **[constat, git log]**.

**Hypothèse causale.** Les forges ont été découpées par phase (concevoir, designer, développer, tester, mettre en production) pour une Factory qui fabriquerait des produits neufs. La demande réelle est l'exploitation de produits existants pour quelques clients, et la production de documents. Le savoir qui sert (conventions d'un client, vos préférences) n'a pas de place dédiée ; la chaîne, qui en a une, n'est pas empruntée.

**Ce qui la réfuterait.** Une hausse des demandes de produits neufs dans les prochains mois ; ou un taux de reprise plus bas dans les sessions qui ont traversé la chaîne. Ce second point n'est pas mesurable sur 30 jours (1 seul cas).

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
| **D1-2 (soustractive radicale) Geler un mois la conversion des retours en contrôles : aucune nouvelle règle, aucun oracle ni hook hors sécurité ; un défaut se corrige dans le livrable, chez le produit** | Croissance stoppée ; coût des lots de retours supprimé | Un défaut systémique non généralisé revient ailleurs | Faible | Totale (dégel) | Corrections répétées et reprises ne montent pas ; zéro fichier de process net ajouté | Moyenne |
| D1-3 Règle « une entre, une sort » seule (voir §f) | Croissance bornée | N'agit pas sur les récidives | Faible | Totale | Fichiers de process nets ≤ 0 par mois | Forte sur la taille, faible sur les récidives |

**[recommandation]** D1-1 et D1-2 ensemble : elles visent la même cause par deux côtés.

### D2 — architecture

| Option | Gain attendu | Risque | Coût | Réversibilité | Mesure de réussite | Confiance |
|---|---|---|---|---|---|---|
| D2-0 Ne rien changer | Aucun | Héritage lourd, forges dormantes à maintenir | Nul | Totale | — | Forte |
| D2-1 Donner une place première au contexte client (conventions, environnements, interlocuteurs) chargée par tout produit de ce client | Reprises d'intention sur l'exploitation divisées par 2 | Doublon avec le projet commun existant du client | Moyen | Totale | Reprises pour intention chez ce client | Moyenne |
| **D2-2 (soustractive radicale) Mettre en sommeil les forges sans usage (observability, development, seo-geo, data), sortir la chaîne conception → MEP de l'héritage par défaut et la réserver au « run produit » demandé ; ramener le fichier hérité de 25,8 Ko à 6 Ko** | Contexte des produits allégé ; moins de maintenance | Une demande de produit neuf trouve une forge gelée | Moyen | Forte (dégel documenté) | Taille du contexte à l'ouverture d'un produit ; reprises stables | Moyenne |
| D2-3 Imposer la chaîne complète à chaque produit | Produits neufs mieux construits | Coût multiplié sur 95 % des demandes, qui n'en ont pas besoin | Fort | Moyenne | — | Faible |

Les forges de sécurité (websec, agents-security) restent hors du gel : leur couverture n'est pas négociable.

**[recommandation]** D2-2, avec D2-1 pour le client qui concentre les reprises d'exploitation.

### D3 — coût de l'appareil

| Option | Gain attendu | Risque | Coût | Réversibilité | Mesure de réussite | Confiance |
|---|---|---|---|---|---|---|
| D3-0 Ne rien changer | Aucun | Coût de 40 % maintenu ; récidives de forme | Nul | Totale | — | Forte |
| D3-1 Compte rendu proportionné : une demande courte reçoit une réponse courte ; le format complet ne s'applique qu'en fin de demande longue ou de session | Effort d'appareil ramené vers 20 % | Perte de contexte en reprise multi-session | Moyen | Totale | Part d'appareil ; reprises « verbosité » | Moyenne |
| **D3-2 (soustractive radicale) Retirer le caractère bloquant du hook de fin de tour et geler les 82 règles de forme ; garder un gabarit d'une page, non bloquant, à 3 éléments : ce qui est livré avec son lien, ce qui vous revient, l'étape suivante** | 231 refus par mois supprimés ; gabarit ÷ 10 | Comptes rendus plus inégaux | Faible | Totale | Reprises pour verbosité ou format ; votre jugement sur la reprise de contexte | Moyenne |
| D3-3 Poser par défaut les seules décisions qui relèvent de vous (règle R-58 existante), avec un compteur de décisions évitables | Messages de décision −30 % | Ajoute un contrôle | Faible | Totale | Décisions par demande | Faible |

**[recommandation]** D3-2 : la soustraction rend D3-1 et D3-3 en grande partie inutiles.

## e. Cadrage d'intention au tour 1

**Méthode.** Avant de produire, la session écrit en 2 lignes ce qu'elle a compris, sans attendre de réponse :

- « Je livre : <quoi, pour qui, où, quel format et quelle taille>. »
- « Je suppose : <une à trois hypothèses qui changeraient le livrable si elles étaient fausses>. Les exemples de votre demande illustrent ; ils ne bornent pas. »

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
   - gabarit de compte rendu ≤ 54 Ko, sa taille du 01/09 (182 Ko aujourd'hui) ;
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
- **Effet des contrôles.** L'expérience naturelle des hooks cassés suggère que les contrôles d'écriture arrêtent des défauts de livrable. Si cet effet est réel et fort, D1-2 et D3-2 laisseraient passer plus de défauts. C'est la raison de geler plutôt que supprimer, et de garder les contrôles d'écriture hors du gel de D3-2.
- **Le travail sur la Factory est aussi votre choix.** 66 demandes portent sur l'outillage de la Factory ; une partie est un investissement que vous décidez, pas un coût subi.
- **Période atypique.** La semaine du 04 au 10/10 ne compte que 18 messages humains ; le mois comprend aussi les trois études d'aujourd'hui sur le même sujet.
- **Non mesuré.** L'utilité réelle des 42 refus de fond du hook de fin de tour ; ce que chaque produit emploie de son héritage ; l'effet des règles de forme avant affichage.

## i. Décisions attendues

Défaut sans réponse : rien n'est transformé, la phase 2 ne démarre pas.

- **a.** Valider le diagnostic et la thèse, qui corrige H0 (recommandé) ; ou demander un complément sur un point de §h.
- **b.** Transformation T1 = D1-1 + D1-2 : fichier unique de préférences et de conventions client, et gel d'un mois de la conversion des retours en contrôles hors sécurité (recommandé, en premier).
- **c.** Transformation T2 = D3-2 : hook de fin de tour non bloquant et gel des 82 règles de forme, gabarit d'une page à 3 éléments ; contrôles d'écriture conservés (recommandé, en deuxième).
- **d.** Transformation T3 = cadrage d'intention au tour 1 (§e), qui remplace la relecture d'intention a posteriori à la fin de son essai le 01/11 (recommandé, en troisième).
- **e.** Transformation T4 = D2-2 : mise en sommeil de 4 forges (observability, development, seo-geo, data) et chaîne conception → MEP retirée de l'héritage par défaut (recommandé après mesure de T1 à T3) ; option alternative D2-1 seule.
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
