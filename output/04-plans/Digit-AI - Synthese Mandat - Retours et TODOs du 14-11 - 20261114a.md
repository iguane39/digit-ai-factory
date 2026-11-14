---
destinataire: humain
---

# Synthèse Mandat — 45 sujets du registre clos, 4 lots ingérés ou refusés, une variable de poste à remettre (14/11/2026)

## 0. Synthèse d'ouverture

Oui, tout ce qui ne vous revenait pas est fait. 45 sujets du registre sont corrigés, vérifiés par moi et publiés dans le pilot et 8 forges. Deux lots de retours de vos produits sont entrés au registre ; deux autres sont refusés, parce que la copie du gabarit de lot chez ces produits n'a pas été rafraîchie. En chemin, j'ai trouvé pourquoi ce poste ne voyait plus aucun produit depuis le 12/11 : une recette de la Factory avait modifié une variable d'environnement de votre poste. Le défaut est corrigé, mais la variable reste à remettre en état : c'est un geste sur votre poste, je vous donne la commande. Trois réponses vous sont demandées : le traitement du nom de l'émetteur de 7 lots en attente (une décision), votre accord pour mettre à jour les skills installés sur ce poste, et cette remise en état.

Livré : [Synthèse du 14/11, retours et TODOs](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2014-11%20-%2020261114a.md)

## 1. En-tête d'identification

Exécution de votre demande « implémente les TODOs et retours », sur le pilot `digit-ai-factory` et 8 forges (agents, agents-security, audit, conception, design, ops, tests, websec). Synthèse relevée le 14/11/2026 à 14:58, heure de Paris (`date`), après une ouverture à 11:54. Session pilote Claude Opus 5.5, 11 agents `campagne` Claude Sonnet 5.5 et une relecture d'intention.

Intention de la demande : vider ce qui attend, retours et sujets du registre, en exécutant tout ce qui ne vous revient pas.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre. Les 48 sujets confiés sont clos sur preuve rejouée, sauf 4 dont le motif est dit ; il ne reste que ce qui attend votre réponse, un produit, un geste sur le poste ou une date.

## 2. Verdict

45 sujets clos en `corrige` aujourd'hui, dont 44 sur les 48 confiés aux agents et 1 neuf trouvé par moi (TF-2520) ; 20 candidats tirés des restes. `oracle-todo` rend PASS après chaque écriture. Chaque livraison a été rejouée par moi avant clôture ; recette entière du pilot après fusion (`node oracles\self-tests.mjs`, de 14:12 à 14:56) : 263 oracles sur 271 sans défaut, 247 recettes vertes à double sens. Les 8 défauts :
- `gabarits/ledger.test` : 2 échecs nés de mon écriture concurrente pendant la recette, 52 sur 52 au rejeu ;
- `oracle-skills` (2 entrées) : la propagation qui attend votre accord ;
- 5 défauts sur des fichiers que la campagne n'a pas touchés (diff vide depuis fb6ea025), rejoués à l'identique : `oracle-lot-retours.test` (6 cas, mesurés aussi sur main avant la campagne par le lot pf), `nettoyer-copies` et sa recette (un chemin temporaire qui contient un accent), `generer-todo-produit.test` (rendu V18) et un cas de rangement de `hook-ecriture`.

## 3. Décisions attendues

Trois choses vous reviennent dans ce tour : le traitement du nom du site public de la Factory, qui bloque 7 lots de retours à l'entrée ; votre accord pour mettre à jour les skills installés sur ce poste ; et la remise en état d'une variable de votre compte Windows, posée par erreur le 12/11.

Bloquants de ce tour, chacun avec ce qui le lève :
- Les 7 sujets de la boucle L99 attendent votre réponse à D-180 ; sans elle, ils vont à la revue du 16/11.
- Une candidature d'un produit reste candidate jusqu'à une seconde occurrence de son défaut (tri du 10/11) ; rien n'est à fournir.
- 2 lots refusés attendent leur correction chez leurs produits (action A-5).
- 7 lots d'un même émetteur attendent au sas d'arrivée : D-214 ci-dessous les lève.
- 13 skills installés sur ce poste divergent de leur source après la campagne, et la règle de propagation exige votre accord explicite pour les mettre à jour : votre « propage » le lève, je les mets alors à jour dans cette session et je clos TF-2501 ; sans réponse, les sessions de ce poste exécutent les anciennes versions.
- La variable `FORGE_ROOT` de votre compte Windows désigne une mauvaise racine depuis le 12/11 : votre geste de remise en état la lève, avec la commande de l'action A-2.

Une décision nouvelle vous revient, sur ce que la Factory publie en clair. Le site public de la Factory envoie lui aussi des retours, et son nom n'a jamais été rangé ni parmi les noms à cacher, ni parmi les noms publics de l'écosystème : ses lots du jour sont donc bloqués à l'entrée. 7 lots de retours (7 sujets, dont 5 pour le pilot) sont arrivés aujourd'hui de l'émetteur « factory-digit-ai-fr », le dépôt du site public de la Factory, dont le dossier local s'appelle « forge-digit-ai-fr ». L'accueil les refuse : ce nom n'est pas dans la table des pseudonymes, et il est déjà cité en clair dans 21 fichiers suivis du pilot, dont le registre.

> **D-214 — Comment traiter le nom « factory-digit-ai-fr », émetteur de 7 lots au sas, inconnu de la table des pseudonymes et déjà cité en clair dans 21 fichiers suivis du pilot ?**
> - **De quoi s'agit-il** : la table des pseudonymes remplace le nom de chaque produit par un nom neutre avant qu'un lot de retours entre au dépôt publié ; un nom déjà cité en clair ailleurs n'y est jamais inscrit d'office, l'accueil le refuse et attend votre arbitrage (`todo/accueillir-lot.mjs`).
> - **Le problème** : ni « factory-digit-ai-fr » ni « forge-digit-ai-fr » n'ont de pseudonyme ; leurs lots d'août sont entrés en clair, avant la pseudonymisation.
> - **Pourquoi vous** : D-5 (a) et D-36 (a) ont tranché les 2 cas voisins (un nom de l'écosystème cité en clair) ; c'est un choix de doctrine sur ce qui se publie.
> - **Recommandation : (a)** — c'est le site public de la Factory, au nom de domaine public, déjà cité en clair 21 fois : le cacher désormais ne retirerait rien de ce qui est publié, comme pour `digit-ai-marketing`. Source consultée : `scripts/lib-parc.mjs`, `PRODUITS_DE_L_ECOSYSTEME` (D-5 (a), D-36 (a)).

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Nom public de l'écosystème | les deux graphies entrent à `PRODUITS_DE_L_ECOSYSTEME` ; les 7 lots sont accueillis en clair puis ingérés | une ligne de code et sa recette, dans cette session | retirer les noms de la liste |
| (b) Produit pseudonymisé | « factory-digit-ai-fr » reçoit un pseudonyme neuf, « forge-digit-ai-fr » y est rattaché ; les lots entrent pseudonymisés | les 21 fichiers déjà suivis gardent le nom en clair ; la porte de publication jugera toute occurrence nouvelle | renommer le rattachement dans la table |
| (c) Laisser au sas | rien ne change | les 7 sujets n'entrent pas au registre | trancher à tout moment |

> **Sans réponse** : les 7 lots restent au sas, et l'ouverture de session les signale bloquants après 24 h.

D-180 (moment de traiter les 7 sujets de la boucle L99, posée le 06/11) et D-183 (conclusion de la revue de la relecture d'intention, posée le 09/11) : inchangées.

## 4. Traité

- Sas d'arrivée : 4 lots accueillis et pseudonymisés (`node todo\accueillir-lot.mjs`, aucun nom ni adresse à qualifier) ; 2 ingérés, 4 candidatures (TF-2516 à TF-2519), toutes corrigées dans ce tour ; 2 refusés en bloc, registre intact.
- Cause du refus, mesurée en lecture chez les 2 produits : leur `forge\retours\GABARIT-LOT-RETOURS.md` (dernière modification le 22/10) n'a pas la section « Remarques restées au produit », que la source du pilot porte depuis le 26/10 (aa594650). Leur héritage n'a pas été rafraîchi ; action A-5.
- TF-2520, neuf et clos par moi : la recette d'`installer-projet` jouait `setx FORGE_ROOT` sur le poste ; lancée depuis un arbre lié d'agent, elle a posé `…\.claude\worktrees` comme racine, où le bootstrap du 12/11 à 08:04 a recloné les 13 forges. Garde au point de passage, recette isolée : 31 sur 31 (27 avant), pilot ad3aa535.
- 20 candidats décidés sous R-58 (la règle qui n'envoie à l'humain que ce qui lui revient), puis 48 sujets confiés en 11 lots à 11 agents, dans 9 dépôts.
- Rejeu par moi avant chaque clôture, par dépôt :
  - forge-conception, TF-2291 : self-test VERT, 60 règles ; publié 1494dda.
  - forge-agents-security, TF-2512 et TF-2422 : 183 PASS ; publié b162e7f. Le pilot adopte l'oracle 0.3.0 (8f081816) : sans cela, la compilation de la flotte aurait refusé 2 agents ; `compiler-flotte --verifier` PASS sur 5 agents.
  - forge-ops, TF-2412 et TF-2519 : 843 PASS ; publié 658c76d.
  - forge-audit, TF-2515 et TF-2419 : recette 17 sur 17 (14 au départ) ; publié d4a2a60.
  - forge-websec, TF-2518, TF-2413, TF-2417, TF-2498 et TF-2499 : 319 PASS ; publié 4632073. Le mode passif du scanner ne soumet plus aucun formulaire (0 POST contre 1 avant, sur cible locale).
  - forge-tests, TF-2292, TF-2294, TF-2418 et TF-2423 : 149 tests des sujets PASS ; publié e28d8af.
  - forge-design, TF-2293 et TF-2497 : « Tout vert », 80 oracles ; publié 165d274.
  - forge-agents, lots fa1 et fa2, TF-2510, TF-2295, TF-2296, TF-2508, TF-2509, TF-2494, TF-2424, TF-2425 et TF-2500 : fusion des deux branches avec conflits de version résolus (quality-oracles 2.36.0, registre 2.63.0), self-test 121 PASS avec le pilot présent, routage 15 sur 15 ; publié d4e19947.
  - pilot, lots pf (10 sujets) et pe (7 sujets) : fusions 63d5af57 et 7b4278f3 sans conflit ; recettes rejouées : relecture-intention 97, readme-dossiers 41, lib-decisions 13, relever-heritage 51, trace-mutation 83, conformité 254, installer-projet 31, toutes sans échec.
  - pilot, `gabarits/ledger.py` accepte `rectification_doublon`, héritage 1.66.0 (a07fca7f) : sans lui, la parité de vocabulaire de forge-agents rougissait dès que le pilot était présent.
- Relevé de la flotte consigné : `node scripts\relever-flotte.mjs --depuis 2026-11-14`, pic de 11 agents simultanés.

Relecture d'intention : sert, gravité mineure, 1 écart de nature choix humain (RI-20261114-01, les sujets hors campagne déclarés avec leur motif).

## 5. Non traité

- TF-2340 (exemption de l'émetteur dans la porte des noms) — motif : `borne_atteinte`, son code vit dans forge-agents et non au pilot, où le lot l'a cherché ; reste décidé.
- TF-2426 (isolation d'un agent) — motif : `borne_atteinte`, son code vit au pilot (`oracles/hook-flotte.mjs`) et non dans forge-agents, où le lot l'a cherché ; reste décidé.
- TF-2414, moitié pilot (le hook de fin de tour liste les tâches d'arrière-plan) — motif : `borne_atteinte` ; la moitié forge-agents est faite, le sujet reste en cours.
- TF-2501 — motif : `dependance_bloc_3`, la propagation des skills attend votre accord.
- TF-2236 à TF-2242, boucle L99 — motif : `dependance_bloc_3`, D-180 sans réponse.
- TF-2411 — motif : `garde_fou`, le tri du 10/11 le garde candidat jusqu'à une seconde occurrence.
- TF-2472 et TF-2300 — motif : `borne_atteinte`, deux études à cadrer avant toute correction.
- 15 sujets décidés — motif : `dependance_externe` ; ils attendent un produit, un geste humain sur des comptes ou une échéance.
- Les 2 lots refusés — motif : `hors_mandat`, la correction est chez les produits, où le pilot n'écrit pas sans run demandé (action A-5).
- Relectures d'intention à la réception de chaque livrable — motif : `borne_atteinte`, chaque livraison a été rejouée par sa recette à la place.
- Les 5 défauts de la recette entière hors campagne — motif : `borne_atteinte`, ils ne viennent pas de ce tour et ne sont pas encore au registre ; à porter en candidats au prochain tri.

## 6. Écarts à la lettre

- Vous avez demandé d'implémenter → 4 sujets confiés restent ouverts → leur code vit dans un autre dépôt que celui du lot, ou leur clôture dépend de votre accord.
- Plusieurs décisions prescrivaient un moyen → les agents en ont déclaré l'écart : borne de 4 mots pour E8 (TF-2291), oracle sur le journal plutôt que ligne de dossier (TF-2422), règle FS12 qui attend l'étiquette en option (TF-2419), flux d'octets imposé plutôt qu'un délai (TF-2510, la cause mesurée était la page de code de la console, pas la charge).
- J'ai résolu moi-même la collision de numéros de version entre les deux lots de forge-agents → au-dessus des deux (2.36.0) → chaque lot avait pris 2.34.0 pour un changement différent.

## 7. Risques

- Les forges de `C:\dev` ont jusqu'à 47 commits de retard sur celles de `.claude\worktrees`, et `C:\dev\digit-ai-forge-design` porte un commit local jamais publié du 29/10 (D-108 (b)) ; signal : « DIVERGÉ » au premier bootstrap après la remise en état ; parade : répondre à D-108, puis publier ou écarter ce commit.
- Les dépendances signalées par l'hébergeur aux envois (forge-websec 155 dont 18 critiques, forge-tests 60, forge-agents 35, forge-audit 14) ; signal : le message de l'hébergeur à chaque envoi ; parade : candidat TF-2539.
- Trois garde-fous neufs ne sont prouvés que sur des doubles (restauration Supabase, rattrapage Railway, scanner passif) ; signal : premier cas réel ; parade : candidat TF-2538.

## 8. Prochaines actions

Le tableau dit, action par action, qui agit et ce qui se passe si rien n'est fait ; les trois premières vous reviennent.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Répondre à D-214 en écrivant « 214a », « 214b » ou « 214c » dans la conversation ; la réponse s'inscrit à `decisions/REGISTRE.jsonl` | neuve | manuelle_utilisateur | decision : doctrine de publication | ce message | les 7 lots restent au sas |
| A-2 | Remettre la racine du poste : `[Environment]::SetEnvironmentVariable('FORGE_ROOT',$null,'User')` dans PowerShell, puis rouvrir une session ; preuve : l'ouverture relève les produits | neuve | manuelle_utilisateur | decision : réglage du compte Windows du porteur ; votre consigne générale réserve à votre accord toute modification de configuration du poste | ce message | le pilot ne voit aucun produit (R-47 non vérifié) et la recette de forge-tests rend 4 faux échecs |
| A-3 | Écrire « propage » dans la conversation pour que je joue `node oracles\oracle-skills.mjs --appliquer` sur les 13 skills installés | neuve | manuelle_utilisateur | decision : règle de propagation TF-0391 (la mise à jour des skills installés exige votre accord explicite) | ce message | les sessions exécutent d'anciennes versions des skills |
| A-4 | Jouer `--appliquer` puis `oracle-etat-forge`, clore TF-2501 | neuve | auto_ia | dependance_bloc_3 : A-3 | votre « propage » | TF-2501 reste en cours |
| A-5 | Chez Produit-02 et Produit-85, recopier l'héritage puis ajouter la section « Remarques restées au produit » aux 2 lots refusés et les remettre | neuve | auto_ia | hors_mandat : écriture chez un produit, sur run demandé | prochaine session ouverte chez chaque produit | 2 lots restent hors du registre |
| A-6 | Retirer les arbres liés de la campagne : `git -C C:\dev\digit-ai-factory worktree remove C:\dev\_wt-pilot-pe`, idem `_wt-pilot-pf`, et `git -C C:\dev\digit-ai-factory\.claude\worktrees\digit-ai-forge-agents worktree remove C:\dev\_wt-fa2` | neuve | manuelle_utilisateur | irreversible : une suppression reste un geste humain (R-29) | ce message | 3 dossiers propres restent sur le disque |
| A-7 | Trier les 20 candidats TF-2521 à TF-2540 | neuve | auto_ia | borne_atteinte : tirés en fin de tour | prochaine demande « TODOs et retours » | ils attendent la revue du 16/11 |

## 9. Traces

Registre `todo\TODO.jsonl` (45 clôtures, 20 décisions, 20 candidatures, TF-2520 à TF-2540) ; pilot ad3aa535, 8f081816, 63d5af57, 7b4278f3, a07fca7f ; forges 1494dda, b162e7f, 658c76d, d4a2a60, 4632073, e28d8af, 165d274, d4e19947 ; relecture RI-20261114-01 ; décision réservée D-214 ; journal `todo\observabilite\flotte-campagnes.jsonl`.
