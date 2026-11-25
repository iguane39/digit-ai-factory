---
destinataire: humain
---

# Synthèse Mandat — retours du 25/11, lot de tests d'intrusion d'abord (25/11/2026)

## 0. Synthèse d'ouverture

Le lot du produit de tests d'intrusion est traité en entier. Ses sondes actives peuvent maintenant explorer une API : l'outil de balayage part de la définition de l'API que le produit fournit, après contrôle de chaque adresse contre le périmètre autorisé. Sa règle de rectification du journal a aussi un remède jouable. Les 32 lots reçus sont au registre. 21 des 34 sujets neufs sont clos, corrigés dans le pilot et 5 forges, toutes publiées, ou écartés. Votre choix sur la protection des branches est appliqué : une session de produit peut désormais créer ces protections, sans pouvoir les modifier ni les retirer. Rien ne vous est demandé de neuf. 13 sujets restent ouverts, dont 1 en cours, chacun avec sa raison.

Livré : [Synthèse des retours du 25/11](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2025-11%20-%2020261125a.md)

## 1. En-tête d'identification

Exécution de votre demande « Traite les retours et TODOs dont lot Produit-86 - RETOURS - 20261125a en priorité », puis de votre réponse « 245a ». Dépôts touchés : le pilot `digit-ai-factory`, le canal confidentiel, forge-websec, forge-agents, forge-conception, forge-development et forge-tests. Période : 25/11/2026 de 14:14 à 16:10, heure de Paris. Session pilote Claude Opus 5.5, avec 1 agent constructeur (Opus) et 2 agents de campagne (Sonnet 5.5).

Intention : vider la boîte des retours et faire avancer le registre, le lot de tests d'intrusion d'abord, en exécutant tout ce qui ne vous revient pas.

Test rétro : le résultat sert cette intention. Le lot prioritaire est clos sur ses 2 sujets, avec une preuve sur le vrai outil de balayage. Chaque sujet clos porte sa recette rejouée par la session. Les 13 restants sont nommés avec leur cause.

## 2. Verdict

32 lots ingérés et 34 candidats créés (TF-2852 à TF-2885) ; 21 clos (16 corrigés, 5 écartés) et 1 en cours, mesurés au registre ; recettes rejouées vertes par la session ; 7 dépôts publiés, 0 commit d'avance mesuré par `git rev-list` ; oracle du registre PASS à chacune des 7 écritures.

## 3. Décisions attendues

Aucune décision neuve ne vous revient. D-245 est tranchée (a) et appliquée (bloc 4).

- D-221 : rouvrir l'exclusion « Pas de vidéo » de RUN-RESEAU, posée le 16/11 à 15:06, inchangée.
- D-231 : confier dès maintenant à Codex et Antigravity le code borné, posée le 21/11 à 17:36, inchangée.
- D-90 : réécrire l'historique public de forge-audit pour un nom protégé, posée le 28/10 à 11:55, inchangée.

## 4. Traité

- **Lot prioritaire, RP-74** (TF-2853, forge-websec) : oracle-dast 0.5.0 accepte `--openapi-fichier`. La définition est lue une fois, puis jugée : chaque serveur doit être sur une origine autorisée et aucun chemin sous une exclusion, sinon le lancement est refusé et rien n'est émis. En passif, seules les lectures (GET, HEAD) partent, sans attaque.
  - Preuve, recette rejouée par la session : 419 PASS, 0 FAIL, contre 360 avant ; le bloc neuf rend 57 FAIL sur 0.4.0 et 59 PASS sur 0.5.0.
  - Preuve, vrai ZAP sur une fixture locale : 1 site exploré au lieu de 0, 2 requêtes GET en passif.
  - Publié : 9e3a714.
- **Lot prioritaire, RP-73** (TF-2852, pilot) : R-19 (la règle qui exige le chaînage des runs au journal) lit et prescrit `champ_vise`, le nom que l'écrivain admet. Son message imprime la commande à jouer, et un test croisé joue cette commande à travers l'écrivain.
  - Preuve : `gabarits/ledger.test.mjs` 89 PASS, le test croisé rouge sur l'ancien message ; `oracles/self-test.mjs` 310 PASS.
- **Votre choix 245a** (TF-2878) : la garde des gestes distants laisse passer la création des 6 politiques de branche typées. La politique générique `--config`, la mise à jour et la suppression restent refusées. Preuve : `hook-gestes-distants.test.mjs` 233 PASS, 0 FAIL ; les 2 cas neufs, dont celui du 23/11, étaient refusés par la garde d'avant.
- **Faux défaut au relevé d'ouverture** (canal confidentiel) : l'oracle déclarait vacant l'indice du produit de tests d'intrusion, inscrit sous une forme objet qu'il ne lisait pas. Preuve : recette 14 PASS, 2 cas neufs rouges avant ; oracle sur la table réelle exit 0 ; publié.
- **Hook de fin de tour et pré-jugement** (pilot) :
  - TF-2855 : un retour signé d'une autre session vivante n'accuse plus le tour. Preuve : cas 75 rouge sur l'ancienne bibliothèque, puis suite du hook 81 sur 81.
  - TF-2869 : S36 ne compte qu'une page écrite dans le tour, S26 accepte au bloc 0 une confirmation dont le chemin absolu figure ailleurs. Preuve : 2 cas rouges sur l'ancien moteur, verts sur le nouveau.
  - TF-2883 : la recette de S93 (le rappel des décisions ouvertes) échouait sur l'horloge, sa date fictive étant relative. Elle est datée en absolu. Preuve : auto-test d'oracle-synthese complet, exit 0, aucun échec.
- **Forge-conception** (TF-2854) : quand l'entrant nomme un outil à remplacer, la surface inventorie ses fonctions de base, chacune retenue ou écartée avec motif (oracle-surface 1.8.0, règle S7). Preuve, rejouée : SELF-TEST VERT ; 14 cas sur 17 rouges sur l'ancien oracle. Publié : 30fe119.
- **Forge-development** : 2 disciplines et 2 contrôles neufs, rejoués par la session (818 tests, exit 0). Publiés : ec4dbb6, 823b1f2.
  - TF-2860 : un job planifié se constate échu au premier passage sur base neuve, et une période lue avec un défaut forcé à 0 est refusée.
  - TF-2863 : la version servie se lit à une seule source.
- **Forge-tests** (TF-2862) : un `replace` converti en nombre n'est plus bloquant pour semgrep, et le rapport dit si un constat est neuf par la règle ou par le code. Preuve : 38 tests ciblés rejoués, exit 0. Publié : 388d709.
- **Forge-agents** : vérifié par la session (lanceur 21 PASS, en-têtes des 28 skills recevables, V29 rejouée sur ses fixtures), puis publié (1b6a0eb).
  - TF-2856 : un agent tiers qui dépasse son délai après avoir écrit ses livrables rend PARTIEL, plus FAIL. Le skill, refusé à la propagation pour une description de 1181 caractères, en fait 1014.
  - TF-2872 : une glose qui commence par une élision n'est plus déclarée absente.
  - TF-2882 et TF-2874 (doublon) : une règle neuve, V29 (borne haute de la taille du texte), refuse la police asservie à la largeur de fenêtre.
- **Règles écrites** :
  - TF-2864 et TF-2865 : 2 règles d'exploitation à `ETAPE-MEP.md`, l'envoi Railway réduit au build et `MSYS_NO_PATHCONV=1` devant `docker run`.
  - TF-2871, avec TF-2879 en doublon : gabarit DAT 1.2.0, avec une voie écrite quand une source de vérité manque. Preuve : `oracle-gabarits-documents` PASS ; la critique d'implémentation rend les mêmes constats avant et après la retouche.
- **Écartés** : TF-2857 et TF-2885, réglés chez leur produit avant remise ; TF-2875, constat d'efficacité d'une garde.
- **Sas** : 32 lots accueillis, pseudonymisés et ingérés, chacun PASS sur sa forme.
  - Mesuré sur : les sorties de `todo/accueillir-lot.mjs` et `todo/ingerer-lot.mjs`, relues à 15:57, périmètre 64 fichiers.
- Relecture d'intention : sert ; les 3 rapports d'agents relus par la session contre la demande, chaque correction rejouée par elle avant publication.

## 5. Non traité

- **TF-2870**, en cours : la part forge-agents est faite. Il reste à vérifier que le poseur de sceau du pilot refuse un livrable sans compagnon `.oracles.json` PASS, et à corriger le skill Client-A.
- **TF-2880 et TF-2881** (boilerplate et gabarit des skills Client-A) : ces 2 skills sont synchronisés depuis votre compte claude.ai, hors de tout dépôt. Une correction locale serait écrasée à la synchro suivante.
- **TF-2866 et TF-2867** (S61 qui juge le verbe, pré-jugement qui ignore les refus du hook Stop) : ils demandent une règle heuristique neuve et une lecture des refus dans la transcription, à concevoir à part.
- **TF-2876 et TF-2877** (supports de Design Authority) : leur oracle vit chez un produit, sans mandat d'écriture déclaré.
- **TF-2858 et TF-2859** : propres à la recette d'un produit, sans proposition pour une forge.
- **TF-2861, TF-2868 et TF-2873** : une conception à faire d'abord, un geste qui passe une clé sans l'afficher, un oracle neuf et un squelette au rendu du client.
- **TF-2884**, inscrit ce jour : les scripts natifs de ZAP tirent une image à étiquette mobile.
- **Installation des skills mis à jour** sur le poste (`oracle-skills --appliquer`) : lancée à 15:54 et pas revenue à 16:10. Les copies installées restent en retard jusqu'à sa fin.
- **Constats antérieurs** du squelette DAT à la critique d'implémentation (oracle-tokens 17, oracle-surcouche 2) : hors du périmètre des retours.

## 7. Risques

- **Garde assouplie par 245a** : une politique typée créée à tort, par exemple une validation de build qui bloque une branche, gênerait le produit sans retirer de droit. Signal : un produit qui ne peut plus fusionner sur une branche protégée. Parade : `az repos policy delete`, qui reste un geste gardé.

## 8. Prochaines actions

Ordre : d'abord ce qui fige l'état du poste (A-1), puis ce qui ferme un sujet à moitié fait (A-2), puis les conceptions.

| Sél. | Action | Identifiant | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Vérifier la fin de l'installation des skills mis à jour sur ce poste | neuve | auto_ia | programmée, départ : fin de la commande lancée à 15:54 ; reprise : notification de fin de tâche | `node oracles/oracle-skills.mjs --appliquer` | si rien n'est fait, les sessions du poste gardent les anciennes versions des 4 skills modifiés |
| A-2 | Vérifier que le poseur de sceau (la marque qui fige un livrable jugé) refuse un livrable sans verdict complet d'oracles | TF-2870 | auto_ia | borne_atteinte | `scripts/verifier-jugement.mjs` | si rien n'est fait, un livrable HTML peut encore être scellé sans le lanceur complet |
| A-3 | Préparer une copie corrigée des 2 skills Client-A, à charger ensuite dans le compte | TF-2880, TF-2881 | auto_ia | borne_atteinte | `C:\Users\iguan\.claude\skills\synced\` (copie synchronisée, lecture seule) | si rien n'est fait, chaque page Client-A échoue encore au lanceur complet |
| A-4 | Concevoir la règle qui juge une action humaine groupée et le pré-jugement qui lit les refus du hook | TF-2866, TF-2867 | auto_ia | borne_atteinte | `oracles/oracle-synthese.mjs` | à défaut, une action vague laissée au porteur passe encore |

## 9. Traces

- Lots : `input/00-retours/` (32 lots accueillis) ; registre : `todo/TODO.jsonl` ; décisions : `decisions/REGISTRE.jsonl` (D-245, réponse a)
- Pilot : `oracles/oracle-conformite-projet.mjs`, `gabarits/ledger.test.mjs`, `oracles/hook-restitution.mjs`, `oracles/lib-retours-produit.mjs`, `oracles/oracle-synthese.mjs`, `oracles/hook-gestes-distants.mjs`, `ETAPE-MEP.md`, `gabarits/documents/dossier-architecture-technique/GABARIT.md`
- Commits du pilot publiés : 0389d973, 6447937a, 6544b611, et celui de cette synthèse
- Forges publiées : forge-websec 9e3a714 ; forge-conception 30fe119 ; forge-development ec4dbb6 et 823b1f2 ; forge-tests 388d709 ; forge-agents 6dcbcfc, ec60259, e929e39, 1b6a0eb
- Canal confidentiel : `oracle-confidentiel.mjs` 1.2.1, publié
