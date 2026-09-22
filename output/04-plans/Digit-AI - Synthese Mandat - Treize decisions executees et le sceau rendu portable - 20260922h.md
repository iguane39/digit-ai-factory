---
role: restitution de fin de tour, mandat transverse du 22/09/2026, huitième tour
sources_de_verite: todo/TODO.jsonl · oracles/self-tests.mjs · scripts/verifier-jugement.mjs · git log
verifie_le: 2026-09-22
---

# Digit-AI — Synthèse de mandat — 13 décisions exécutées et le sceau rendu portable — 22/09/2026

## 0. Synthèse d'ouverture

Vous avez tranché les 13 décisions en un seul message, et les gestes qu'elles commandaient sont
faits. 8 dossiers sont clos avec leur preuve rejouée, 3 restent ouverts et disent pourquoi. Le
plus important pour vous : le sceau des livrables est désormais portable d'un poste à l'autre, ce
qui était la dernière cause connue du circuit d'intégration fermé, et la forge de tests ne porte
plus aucun test rouge — elle redevient opposable à ce qu'elle juge. La simulation du circuit
d'intégration rend VERT pour la première fois, sans aucun défaut : le sceau était bien la
dernière cause de son blocage. Deux remèdes que je croyais
justes ont été écartés par la mesure avant d'être retenus, et chacun a coûté un rejeu : c'est la
mesure qui a tranché, pas mon idée de départ. J'ai aussi trouvé et corrigé un défaut que j'avais
introduit moi-même ce matin, et que le harnais a attrapé le jour même : une constante supprimée
dont le nom restait écrit ailleurs, ce qui empêchait un générateur de produire la moindre page.
Ce qui est attendu de vous : rien d'obligatoire pour avancer, et 3 arbitrages qui débloqueraient
le reste.

## 1. En-tête d'identification

- **quoi** — exécution des 13 décisions arbitrées, des 12 candidatures de valeur 15 ou plus
  jusqu'au calcul du sceau.
- **sur quoi** — le pilotage `digit-ai-factory`, et 3 forges sous mandat d'écriture permanent :
  `digit-ai-forge-audit`, `digit-ai-forge-agents`, `digit-ai-forge-tests`.
- **quand** — fin le 22/09/2026 à 18:50 (UTC+02:00), durée 1 h 25 depuis votre message.
- **qui** — session du pilotage, `v1.17.30-699-g5c86b6c`.
- **intention** — votre message ne portait que des sélecteurs de décision : il tranche et commande
  la PREUVE EXÉCUTÉE des gestes que ces options portaient, jamais une analyse de plus. **Test
  rétro** : servie pour 10 des 13 — chacune porte sa mesure au bloc 4. Les 3 autres sont au bloc 5
  avec leur motif mesuré, et l'une d'elles est suspendue à une autre par une raison de fond.

## 2. Verdict en une ligne

8 dossiers passent de décidé à corrigé sur preuve rejouée, la simulation du circuit
d'intégration passe de 1 défaut à 0 et rend VERT, le vérificateur de sceaux rend PASS sur 44
scellés et 0 écart, la suite de la forge de tests passe de 1 échec à 0, 3 recettes gagnent 12
cas, et 1 défaut que j'avais introduit ce matin est corrigé.

## 3. Décisions attendues de l'humain

Aucune décision neuve n'est posée ce tour. Les 3 bloquants qui restent sont ceux que vous
connaissez, et chacun est énoncé ici sur place.

- **Le registre des repères externes attend une liste que vous seul pouvez donner.** Le contrôle
  né hier exige que les familles de livrables sans repère extérieur soient NOMMÉES, et il ne peut
  pas composer cette liste : choisir ce qui ne se compare à rien engage le niveau de qualité visé.
  Pour le lever, il faut me dire quelles familles n'auront pas de repère, et pourquoi. Si rien
  n'est fourni, le contrôle reste rouge et une absence de repère reste indiscernable d'un oubli.
- **Le contrôle des empreintes rend rouge sur le parc réel depuis le 17 septembre.** Un site de
  scellement est apparu dans une forge sans être déclaré à la table. Pour le lever, il faut dire
  si ce site se déclare ou se retire. Si rien n'est fourni, le harnais garde un rouge permanent,
  et un rouge que rien ne répare s'apprend à ignorer.
- **Le palier de publication du produit de communication attend 3 valeurs.** Le contrôle du palier
  rend 3 règles rouges avec le message « valeur humaine absente : gouvernance, etat_de_depart,
  temps_humain ». Pour le lever, il faut me donner la gouvernance des comptes, l'état de départ
  exporté depuis l'écran de statistiques du réseau, et le temps humain hebdomadaire en minutes.
  Si rien n'est fourni, le palier reste ouvert sans pouvoir publier.

## 4. Traité — chaque point avec sa preuve exécutée

- **La simulation du circuit d'intégration rend VERT, et c'est la première fois.** Preuve : les 2
  pas qu'elle rejoue sur un clone frais rendent 0, aucun défaut, aucune écriture des recettes dans
  le clone — là où elle rendait ROUGE avec 1 défaut il y a 3 heures, et 2 défauts ce matin. Le pas
  qui échouait était le vérificateur de sceaux sur le parc réel : c'est bien la portabilité du
  sceau qui tenait ce circuit fermé.
- **Le sceau des livrables est portable d'un poste à l'autre.** Il empreintait les octets de
  l'arbre de travail, que git réécrit à chaque extraction. Preuve mesurée sur un même livrable :
  octets du disque `e7d248ac56987055`, octets du dépôt `e7758dc3f2dc1284`, contenu normalisé
  `e7758dc3f2dc1284` des DEUX côtés, et sceau posé `e7758dc3f2dc1284`. La normalisation est bornée
  aux formats que git réécrit ; un document imprimable reste haché octet pour octet.
- **Les 44 sceaux existants ont été reposés une fois, après mesure.** Preuve avant le geste : 17
  déjà conformes, 27 reposables sans perte parce que leur empreinte égalait encore les octets
  bruts du fichier, et 0 contenu réellement modifié. Après : `verifier-jugement` rend PASS, 44
  vérifiés, 0 écart. Un sceau posé avant la normalisation se dit désormais tel, au lieu d'accuser
  le livrable d'une modification qui n'a pas eu lieu.
- **Un scellement réel n'accepte plus qu'un fichier nommé.** Preuve : la commande exacte de
  l'incident du matin rend REFUSÉ, exit 2, et n'écrit aucun sceau ; la mesure et la simulation
  gardent le dossier, puisqu'elles n'écrivent rien. Le banc a attrapé un manque que ce garde
  introduisait : la simulation devenait la seule voie pour obtenir la liste à nommer, et elle ne
  la rendait pas. Recette : 14 cas avant, 19 après.
- **Lire une dérive de récidives ne la déplace plus.** Chaque appel posait un relevé de plus, si
  bien que le second regard rendait vert ce que le premier montrait rouge. Preuve : 3 relectures
  de suite rendent le MÊME verdict, le dernier relevé reste au numéro 5 et le journal reste à 5
  lignes. Recette : 4 cas avant, 6 après, dont un cas rouge qui reproduit le défaut fondateur.
- **Le point d'entrée de chaque service « prouvé » résout dans la forge qui le porte.** La règle
  neuve a MESURÉ ce que le dossier déclarait non mesuré : 10 chemins morts et non 2, chacun
  retrouvé sur le disque par son nom de base — dont un qui portait un saut de ligne réel là où son
  chemin portait un antislash. Preuve rouge puis verte : `oracle-chemin-prescrit` passe de FAIL à
  PASS, 63 points d'entrée résolvent tous. Recette : 24 cas avant, 29 après.
- **Le tableau de routage hérité par chaque produit nomme enfin la forge d'audit.** Preuve : la
  ligne existe dans `gabarits/CLAUDE-PRODUIT.md` avec sa commande, son référentiel de 175
  contrôles sur 18 dimensions et le mandat humain qu'elle exige ; l'oracle des gabarits reste
  vert, et la section obligatoire est intacte.
- **Écrire dans un dépôt où l'on n'est pas se déclare.** Preuve dans les deux sens : lancé depuis
  une autre forge, le générateur d'index refuse et nomme les 2 dépôts au lieu de réécrire ceux
  du pilotage ; lancé chez lui, il dit « README à jour dans `C:/dev/digit-ai-factory` ». La sortie
  nomme le dépôt écrit même quand il n'y a rien à régénérer.
- **Le moteur de rapport de la forge d'audit reconnaît la dimension à sa forme.** Quatre
  expressions la bornaient à la seizième alors que le référentiel en porte dix-sept et qu'un autre
  fichier du même dépôt l'acceptait déjà. Preuve : recette neuve de 3 cas — une action de
  gouvernance de la dix-septième dimension est rattachée, reçoit son identifiant et entre dans le
  contrat remis à la forge de développement ; une dimension mal formée reste hors contrat ; les
  deux suivantes sont reconnues, donc la borne n'a pas été déplacée d'un cran. Le contrôle complet
  de la forge rend 13 étapes vertes sur 13 et 151 tests verts.
- **Une clôture d'étape dit désormais ce qu'elle ferme.** Le contrat nommait `etape` et `resume`,
  rien ne les exigeait à l'écriture, et le journal en ajout seul gardait l'entrée vide. Preuve :
  recette de la forge des agents, 30 cas avant, 32 après, les deux sens joués — une clôture vide
  est refusée en nommant les deux champs, une clôture complète passe.
- **La suite de la forge de tests ne porte plus aucun échec.** Preuve : la suite entière rend 0
  échec, là où un test de rendu échouait avant comme après la campagne du 20 septembre. 2 remèdes
  ont été écartés PAR LA MESURE, chacun payé d'un rejeu : déplacer la piste hors du dessin ne
  change rien, la capture voit les mêmes pixels ; la retirer est pire, le dessin devient blanc sur
  blanc. La mesure porte sur la BOÎTE de l'actif, donc c'est la piste qui doit tenir le seuil :
  elle est mesurée à 3,14 pour 1 contre la carte claire et 3,18 pour 1 contre la carte sombre.
- **Le domaine public de la marque est clos sur la preuve du matin.** Table relue ce jour : 67
  entrées, AUCUNE clé en forme de domaine, et l'indice retiré est réservé avec sa date pour qu'il
  ne soit jamais ré-attribué.
- **Un défaut que j'avais introduit ce matin est corrigé.** La résolution paresseuse avait
  supprimé une constante sans toucher au paramètre par défaut qui la nommait encore : toute
  lecture d'élément graphique levait une erreur de référence, et le générateur de pages d'étude ne
  produisait plus une seule page. Preuve rouge puis verte : sa recette passe de l'erreur à 7 cas
  verts sur 7.

## 5. Non traité — chaque point avec son motif

- La collision de numéro sur le socle des pages : motif `garde_fou` — le geste demandé est une
  fusion entre 2 dépôts dont la publication attend un GO humain, et la mener à la hâte en fin
  de tour créerait une TROISIÈME lignée, c'est-à-dire exactement le défaut décrit.
- La forme qui ne sait pas déclarer un calque : motif `dependance_bloc_3` — son remède s'écrit
  dans le fichier même dont deux lignées portent le même numéro. Y écrire maintenant produirait
  une troisième version sous ce numéro.
- Le verdict annoncé sur un périmètre réduit : motif `garde_fou` — son remède est une règle de
  l'oracle qui juge les restitutions, et cet oracle est un blocage de fin de tour. L'écrire en fin
  de tour ferait courir le risque d'arrêter tous les tours suivants sur un faux positif ; elle
  s'écrit en ouverture de run, éprouvée dans ses deux sens.
- Le registre des repères externes, le contrôle des empreintes et le palier de publication : les
  3 bloquants du bloc 3, inchangés.

## 6. Écarts à la lettre

- Vous avez décidé 12 candidatures « à traiter ». J'en ai traité 9 et laissé 3 ouvertes. Pourquoi :
  2 d'entre elles touchent un fichier dont deux lignées portent aujourd'hui le même numéro de
  version, et la troisième demande d'écrire une règle dans le contrôle qui bloque la fin de chaque
  tour. Les traiter ce soir aurait fabriqué le défaut qu'elles décrivent.
- Le dossier du journal de produit nommait un fichier chez un produit. Je ne l'ai pas touché : le
  pilotage n'écrit pas chez un produit. J'ai posé le remède à la source que le contrat cite, le
  vérificateur de référence dont chaque produit hérite, ce qui le fait porter plus loin que le cas
  constaté.
- J'ai corrigé un défaut qu'aucune décision ne nommait, celui de la constante supprimée. Pourquoi :
  il venait d'un geste que j'ai fait ce matin, il empêchait un générateur de produire quoi que ce
  soit, et le laisser aurait signifié livrer 2 fois un outil cassé dans la même journée.
- Le livrable ne contient rien d'autre que ce périmètre : aucune décision prise à votre place,
  aucun contrôle désactivé, aucune publication vers un service hébergé sans votre feu vert.

## 7. Risques

- **Un remède plausible peut être faux, et seule la mesure le dit.** 2 des 3 remèdes que j'avais
  retenus pour le test rouge de la forge de tests étaient inopérants, et l'un aggravait le
  constat.
  - signal : une correction retenue sur un raisonnement, sans rejeu entre l'idée et la livraison.
  - parade : chaque remède a été rejoué avant d'être gardé, et les 2 écartés sont écrits au
    registre avec leur mesure, pour que personne ne les repropose.
- **Un garde qui protège d'un geste peut supprimer une voie nécessaire.** Refuser un dossier au
  scellement a rendu la simulation seule capable de fournir la liste à nommer, et elle ne la
  fournissait pas.
  - signal : un refus dont le message prescrit une commande de rattrapage jamais éprouvée.
  - parade : le banc l'a attrapé le jour même ; la simulation rend désormais la liste, et son cas
    l'exige.
- **Une correction posée dans une forge peut diverger de sa copie installée.** Le contrôle des
  skills est passé rouge dès la modification du vérificateur de référence.
  - signal : un contrôle de parc qui rougit juste après une écriture dans une forge.
  - parade : la propagation a été jouée et le contrôle est revenu vert ; c'est un pas à ne pas
    oublier, jamais un défaut de la correction.
- **2 lignées d'un même fichier sous le même numéro se re-divergent chaque jour.** Le dépôt
  distant a déjà réimplémenté une règle de son côté.
  - signal : un numéro de version identique des deux côtés avec des contenus différents.
  - parade : la fusion est nommée comme un travail à elle seule, et 2 dossiers y sont explicitement
    suspendus plutôt que traités par-dessus.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-51** | Fusionner les 2 lignées du socle des pages, puis reprendre la forme qui doit déclarer un calque | `auto_ia` | TF-1307 | `garde_fou` — la publication attend un feu vert humain (règle 38 de la doctrine, qui réserve toute publication hébergée à un accord humain) | les 2 lignées re-divergent chaque jour, et 2 dossiers décidés restent bloqués derrière |
| **A-52** | Écrire la règle qui exige de nommer le périmètre mesuré quand une preuve cite un verdict, éprouvée dans ses 2 sens : `node oracles/oracle-synthese.mjs <fixture>` | `auto_ia` | TF-1262 | `garde_fou` — l'oracle visé bloque la fin de chaque tour, la règle s'ouvre en début de run | un verdict vert continue de se lire comme une absence de limite |
| **A-53** | Publier les 3 forges corrigées après votre feu vert : `git push` depuis `digit-ai-forge-audit`, `digit-ai-forge-agents`, `digit-ai-forge-tests` | `auto_ia` | TF-1207 | `gate_gouvernance` — publier attend un feu vert humain (règle 38) | 3 corrections restent locales, et les postes qui consomment ces forges gardent le défaut |
| **A-44** | Écrire au registre des repères la section qui nomme les familles de livrables sans repère, à partir de la liste que vous m'aurez donnée | `auto_ia` | TF-1028 | `dependance_bloc_3` — attend A-45 | le contrôle reste rouge, et une absence de repère reste indiscernable d'un oubli |
| **A-54** | Publier le travail du pilotage : `git push origin main` | `manuelle_utilisateur` | TF-1312 | `decision` — publier engage ce que les autres postes recevront | le sceau (empreinte du contenu d'un livrable, posée une fois qu'il est relu) portable et les 8 corrections restent sur ce poste |
| **A-45** | Me dire quelles familles de livrables n'auront pas de repère externe, et pourquoi | `manuelle_utilisateur` | TF-1028 | `decision` — choisir ce qui ne se compare pas à l'extérieur engage le niveau de qualité visé | la liste reste vide et le contrôle rouge |
| **A-55** | Trancher le site de scellement non déclaré : il se déclare à la table, ou il se retire | `manuelle_utilisateur` | TF-0980 | `decision` — retirer un site est un geste irréversible sur un référentiel partagé | le harnais garde un rouge permanent depuis le 17 septembre |
| **A-18** | Me donner les 3 valeurs du palier : gouvernance des comptes, état de départ exporté depuis l'écran de statistiques du réseau, temps humain hebdomadaire en minutes | `manuelle_utilisateur` | TF-1160 | `acces` — trace mesurée : le contrôle du palier rend 3 règles rouges, message « valeur humaine absente : gouvernance, etat_de_depart, temps_humain » | le palier reste ouvert sans pouvoir publier |

L'ordre suit l'effet de levier : `A-51` débloque 2 dossiers décidés en même temps qu'elle-même,
`A-52` ferme la dernière décision de ce tour restée ouverte, et `A-53` porte aux autres postes
des corrections déjà prouvées ici.

## 9. Traces

- Livrable de ce tour : [Digit-AI - Synthese Mandat - Treize decisions executees et le sceau rendu portable - 20260922h.md](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Treize%20decisions%20executees%20et%20le%20sceau%20rendu%20portable%20-%2020260922h.md)
- Registre : [TODO.jsonl](todo/TODO.jsonl) — contrôle du registre PASS ; 87 dossiers ouverts, dont
  8 décidés et 10 en cours.
- Vérificateur de sceaux : [verifier-jugement.mjs](scripts/verifier-jugement.mjs) — 19 cas de
  recette, PASS sur `output/` avec 44 scellés et 0 écart.
- Contrôles passés de rouge à vert : [oracle-chemin-prescrit.mjs](oracles/oracle-chemin-prescrit.mjs),
  [generer-page-etude.mjs](scripts/generer-page-etude.mjs),
  [observer-recidives.mjs](todo/observer-recidives.mjs).
- Forges corrigées, enregistrées en local : `digit-ai-forge-audit` (13 étapes vertes sur 13),
  `digit-ai-forge-agents` (32 cas verts sur 32), `digit-ai-forge-tests` (suite entière verte).
- Simulation du circuit d'intégration : [simuler-recette-hebergee.mjs](scripts/simuler-recette-hebergee.mjs)
  — verdict VERT, 2 pas à 0 défaut, jouée sur un clone du dépôt à l'enregistrement `5c86b6c`.
- Remontée à la factory : sans objet — ce tour s'est joué au pilotage et dans 3 forges, jamais
  chez un produit.
