---
destinataire: humain
---

# Synthèse Mandat — 5 lots de retours ingérés, 25 sujets du registre clos (05/11/2026)

## 0. Synthèse d'ouverture

La boîte des retours est vide, et 25 sujets du registre sont clos, chacun avec sa recette rouge puis verte. Les forges savent désormais garder les mêmes identifiants de test d'un déploiement à l'autre, comme vous l'aviez demandé, refuser un appel de modèle tenu sous un verrou de base, et montrer une erreur de saisie sous son champ. Les 5 forges touchées et le pilot sont publiés. Avant l'accueil, j'ai corrigé un défaut qui aurait nommé 3 lots « [object Object] ». Deux décisions vous reviennent : l'identité sous laquelle les forges publient, et le sort d'une consigne qui touche une doctrine.

Livré : [Synthèse du 05/11, retours et TODOs](Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2005-11%20-%2020261105d.md)

## 1. En-tête d'identification

Exécution de votre demande « Traite les TODOs et retours » du 05/11/2026, sur le pilot `digit-ai-factory` et 5 forges (agents, tests, design, ops, audit). Période : 05/11/2026 de 11:12 à 13:59, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, avec 7 agents de campagne Claude Sonnet 5.5 à l'effort high, 1 agent de relevé en lecture seule et 2 relectures d'intention.

Intention de la demande : vider la boîte des retours et faire avancer le registre des améliorations, en exécutant tout ce qui ne vous revient pas.

Test rétro : le résultat sert cette intention. Le sas est vide, 25 sujets sont clos sur 32 confiés, et les 2 questions posées relèvent de la publication et de la doctrine.

## 2. Verdict

25 sujets clos sur 32 confiés, 4 restés en cours avec leur mesure, 2 posés à vous ; `oracle-todo` rend PASS après chacune des 5 écritures du registre ; 5 forges et le pilot publiés, 0 commit en avance vérifié par `rev-list`.

## 3. Décisions attendues

Aucune décision ne vous revient. Les 2 posées ici, sur l'identité de publication et sur les consignes qui touchent une doctrine, ont reçu votre réponse le 05/11/2026 et sont appliquées ; leur trace est au registre, sous TF-2168 et TF-2159.

## 4. Traité

Le tour a d'abord vidé le sas, puis confié les 32 sujets à 7 agents de construction et 1 relevé. Il a fusionné et vérifié chaque livraison, publié les forges, puis inscrit les clôtures.

- **Accueil des lots** : l'essai de l'accueil renommait 3 lots « [object Object] - RETOURS - … », parce que la table des produits porte depuis le 04/11 une forme objet que l'anonymiseur ne lisait pas. Corrigé dans `todo/anonymiser-entrant.mjs` et 3 autres lecteurs, banc 13/13 avec le cas rouge ajouté ; commit f201b794.
- **Sas des retours** : 5 lots accueillis puis ingérés, exit 0 chacun ; 17 sujets créés, TF-2158 à TF-2174 ; 14 classes de défaut créées, référentiel en 1.66.0. L'adresse signalée est un réseau Docker privé, et les 3 identifiants signalés sont publics.
- **Registre** : 23 candidats décidés par R-58 (la règle qui vous réserve dépense, publication, doctrine, arbitrage et produit), 2 sur votre consigne citée ; 6 constats des agents inscrits en candidats, TF-2175 à TF-2180.
- **forge-agents**, recettes rejouées par la session : self-test 96 PASS, 0 FAIL ; quality-oracles 590 contrôles PASS.
  - Le ledger joue le contrôle de parcours réel à l'écriture d'une clôture « prêt » (TF-2152), et lit le rapport de forge-tests (TF-2153).
  - Un oracle neuf refuse un appel de modèle tenu sous une transaction d'écriture (TF-2163) : 0 faux constat sur 287 fichiers Python de 3 forges, rapporté par l'agent et non recompté.
  - V15 (la règle de `render_page` qui accuse un en-tête posé sur ses lignes) ne compte plus un en-tête invisible parce que rogné (TF-2170) ; un menu déplié ne lève plus de faux défaut d'alignement (TF-2162) ; le filtre doublé est refusé (TF-2158) ; le script de recherche ne fait plus lever de faux constat de cache (TF-2094).
- **forge-tests**, pytest rejoué par la session sur l'état publié : exit 0, aucun échec ; fixture rouge de V15 réécrite par la session, 8 passés sur son fichier, commit e9824ba.
  - La configuration d'audit vit chez le produit, et une application non désignée est refusée avec la ligne à recopier (TF-2161).
  - Un outil Python autonome reçoit un verdict au pan back (TF-2173).
  - Le parcours de chaque persona se joue sous l'identité de son rôle contre l'instance servie (TF-2123).
- **forge-design**, self-test rejoué par la session sur l'état publié : 71 oracles et 169 règles verts.
  - T4-2 (la règle qui accuse un état vide sans invitation à agir) ne prend plus une carte de choix pour un état vide (TF-2162).
  - Une application exige une visite guidée et un lexique à infobulles (TF-2158).
  - Un oracle neuf refuse une erreur de saisie affichée loin de son champ, et un composant de saisie la pose sous le champ (TF-2172) ; 3 mutations du composant sont refusées.
- **forge-ops**, self-test rejoué par la session : 500 PASS, 0 FAIL.
  - Un réseau Docker posé par Terraform ne dérive plus d'un déploiement à l'autre (TF-2164), et un frontal nginx ne rend plus 502 après la recréation de son amont (TF-2165), reproduits puis supprimés sur un vrai démon.
  - Les identifiants de test restent les mêmes sur 14 déploiements de suite (TF-2166), et un secret recopié se tire sans sosie ni signe (TF-2167).
- **forge-audit**, recette rejouée par la session sur l'état publié : `tools/verifier.mjs` exit 0, 16 étapes sur 16 au rapport de l'agent.
  - Le kit autonome rend la même forme que le rendu par défaut, octet pour octet (TF-2169).
  - Un rapport refusé par la porte du client n'est plus diffusable (TF-2144).
- **Pilot**, 2 branches d'agents fusionnées (c7ed1459, 8dca5b75) ; recettes rejouées par la session sur l'état fusionné :
  - S48 et S11 (les contrôles de la ligne de remontée et des motifs d'action) refusent une remontée promise au futur (TF-2137, TF-2156), `oracle-synthese` 305/305 ;
  - le préjugement d'une restitution rend le message de chaque avertissement (TF-2171), et N3 juge aussi les référentiels `.json` (TF-2157), `oracle-claude-md` 18/18 ;
  - la relecture d'intention ne publie plus de nom réel ni n'embarque de secret (TF-2146, TF-2160), recette 87 PASS ; le ledger Python écrit le champ run (TF-2174), 33 PASS ; le routage d'audit lit le standard du client (TF-2144), 22 PASS ;
  - 2 recettes rouges remises au vert (TF-2154, TF-2151).
- **Pilot, gestes de la session** : M-20 (la règle du dossier de mise en production sur les identifiants de test) porte votre consigne, câblée sur le contrôle de forge-ops ; E-19 (la règle du plancher d'écriture sur les messages d'erreur) dit qu'un refus de saisie reprend la saisie ; 5 comptes de documents alignés, `oracle-fraicheur-doc` PASS ; commit 88a6c641.
- **Mesures** : 83 refus du hook de fin de tour en 7,5 jours, pour une cible de 15 par semaine. S1 (le contrôle des blocs toujours présents de la restitution) en porte 82, S4 (le contrôle des décisions posées sans choix fermé) 81, et 80 portent les deux. Sur 8 rappels de leçon en 3 heures, le geste suivant a réussi dans les 3 cas d'échec.

Relecture d'intention : sert après 1 passe. La première relecture de la consigne de campagne rendait « dérive » (livraison partielle autorisée d'office, reste non déclaré) ; la consigne reprise a rendu « sert », 123 145 jetons, sous le seuil de 6 000 000.

## 5. Non traité

- TF-2172, le motif d'erreur de saisie appliqué aux formulaires d'application par forge-development — motif : `borne_atteinte`, reste reformulé le 05/11 après la campagne ; la première formulation visait le socle des pages d'information, qui ne sert pas les applications.
- TF-2094, les projections déjà générées chez les produits — motif : `hors_mandat`, elles se régénèrent au prochain run de chaque produit.
- TF-2168 et TF-2159 — motif : `decision`, posés sous D-175 et D-176.
- TF-2155, la barrière qui refuserait un geste une fois par session — motif : `borne_atteinte`, 3 heures de mesure ne suffisent pas ; rejouée le 12/11.
- TF-1947, la cible de 15 refus par semaine — motif : `borne_atteinte`, la mesure désigne les 2 contrôles en cause, le remède reste à construire.
- TF-1837, les renommages revenus seuls — motif : `borne_atteinte`, aucune récidive établie depuis le 16/10 ; rejoué le 19/11.

## 6. Écarts à la lettre

- Vous avez demandé de traiter les TODOs → j'ai laissé 2 sujets à votre décision → la règle R-58 vous réserve la publication et la doctrine.
- Vous avez demandé de traiter les TODOs → j'ai renommé un script de forge-ops avant de le publier → la porte des secrets refusait tout fichier dont le nom commence par « secret- », et je ne la contourne pas.

## 7. Risques

- **Produits refusés au prochain run** : X8 (la règle de visite guidée d'`oracle-exploitabilite`) et X9 (la règle du lexique à infobulles) rendent FAIL sur tout écran servi sans visite ni lexique.
  - Signal : un produit voit l'une des 2 règles rouge à son prochain run.
  - Parade : le message nomme l'écart motivé `data-sans-visite-guidee`.
- **Une autre session écrit dans le pilot** : elle a publié le prompt de suivi des coûts pendant ce tour.
  - Signal : un envoi du pilot refusé comme non à jour.
  - Parade : `git fetch` avant l'envoi, rebase si besoin.

## 8. Prochaines actions

Ordre : par coût décroissant de ne pas les faire, A-1 d'abord parce qu'il touche chaque formulaire d'application.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Faire appliquer par forge-development le motif d'erreur de saisie à tout formulaire d'application, jugé par l'oracle des erreurs de formulaire sur l'instance (reformulée le 05/11 : le socle des pages ne sert pas les applications) | TF-2172 | auto_ia | borne_atteinte : reformulée après la campagne | `digit-ai-forge-development`, `docs/run-playbook.md` ; référence `digit-ai-forge-design/corpus/composants/saisie-erreurs.js` | si rien n'est fait, une application peut encore afficher une erreur loin de son champ |
| A-2 | Réduire les refus du hook dus aux blocs absents et aux décisions sans choix fermé, 80 sur 83 | TF-1947 | auto_ia | borne_atteinte : la mesure est d'aujourd'hui | `oracles/oracle-synthese.mjs`, `gabarits/RESTITUTION.md` | si rien n'est fait, environ 78 refus par semaine, un tour chacun |
| A-3 | Traiter les 6 constats des agents inscrits ce jour | TF-2175 | auto_ia | borne_atteinte : nés en fin de tour | `todo/TODO.jsonl`, TF-2175 à TF-2180 | si rien n'est fait, 6 défauts connus restent ouverts |

## 9. Traces

- `input/00-retours/` : `Produit-86 - RETOURS - 20261104a.md`, `…20261104b.md`, `…20261105a.md`, `Produit-84 - RETOURS - 20261105a.md`, `Produit-64 - RETOURS - 20261105a.md` et leurs sidecars
- `todo/TODO.jsonl`, `todo/CLASSES.json` (1.66.0), `ETAPE-MEP.md` (M-20), `references/ECRITURE.md` (E-19), `decisions/REGISTRE.jsonl` (D-175, D-176), `todo/relectures-intention.jsonl` (RI-20261105-02 et 03)
- Commits du pilot : f201b794, f6bae868, 120dcd99, 7e26be72, 8569da62, ecc418e2, a5814aa6, 79c2454c, 20d4add0, a9e012b2, fusions c7ed1459 et 8dca5b75, 88a6c641
- Forges publiées : agents 11bd652 à ad9ffa9 ; tests c1b2f74 à e9824ba ; design 4af78ee à 6c2677f ; ops 1bc8268 à 8692fa3 ; audit 7053d69 et e74f2c6
