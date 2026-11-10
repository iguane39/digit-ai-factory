## 0. Synthèse d'ouverture

La seconde campagne du 10/11 est finie : sur les 76 sujets décidés ce matin, 73 sont corrigés, rejoués par moi et publiés dans 8 dépôts. Il en reste 3 ouverts. Le premier attend un travail dans forge-agents. Les 2 autres portent une règle écrite mais pas encore de barrière exécutable, et le registre refuse de clore une récidive sans elle. Les restes des agents deviennent 9 nouveaux candidats. Trois décisions de doctrine vous reviennent ; elles portent sur 5 sujets laissés hors campagne. En attendant, rien n'est bloqué ailleurs.

## 1. En-tête d'identification

Synthèse du mandat « 190b puis A2 », sur le pilot et 7 forges, le 10/11/2026 à 16:39, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de corriger les candidats du jour sans laisser à l'humain ce qui ne lui revient pas. Test rétro : chaque sujet finit corrigé sur une recette rejouée par le pilot, ou laissé ouvert avec ce qui manque, ou posé à l'humain avec son motif.

## 3. Décisions attendues

Les 5 bloquants qui retiennent la suite sont des sujets de doctrine, laissés hors campagne. Chacun se lève par votre réponse à l'une des décisions ci-dessous :
- l'alerte des retours restés sans lot chez un produit, que personne ne compile (première décision) ;
- l'indice commun d'un lot de fiches et le nommage décidé pour un produit (deuxième décision, 2 sujets) ;
- la revue avant une séance datée et l'engagement d'un document sans livrable (troisième décision, 2 sujets).

> **D-191 — Le lot de retours d'un produit doit-il partir dans le tour même où un retour est écrit, au lieu de la clôture du run, avec un hook de fin de tour qui refuse un retour resté sans lot ?**
> - **De quoi s'agit-il** : les retours qu'un produit écrit à son `forge/ledger.jsonl` ne remontent au pilot qu'à la clôture d'un run, par un lot compilé.
> - **Le problème** : le produit marketing compte 104 retours sans lot, le plus ancien de 59 jours, avec 2 runs ouverts et aucune clôture. L'alerte s'est affichée à l'ouverture de 7 sessions du 09/11, sans qu'aucune compile le lot. Une restitution a même écrit « remontées à la Factory » pour des causes restées au ledger.
> - **Pourquoi vous** : c'est un changement de doctrine du contrat produit, qui fixe le moment où un retour part. Il ajoute aussi un refus de fin de tour chez tous les produits.
> - **Recommandation : (a)** — un retour qui attend une clôture qui ne vient pas n'arrive jamais. Source consultée : `gabarits/RETOURS-FORGES.md`, remise au sas, et la remise liée au verdict livrée ce jour.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lot dans le tour | le retour écrit part en lot dans le même tour, refusé en fin de tour s'il reste sans lot | 1 hook chez chaque produit, quelques secondes par tour qui écrit un retour | retirer le refus du hook |
| (b) Lot à la clôture, alerte durcie | la règle reste, l'ouverture refuse de démarrer un run au-delà d'un seuil de retours sans lot | un seuil à fixer, les retours d'un run jamais clos restent en attente | baisser ou retirer le seuil |
| (c) Rien ne change | l'alerte reste un affichage | les retours continuent de s'accumuler sans lot | sans objet |

> **Sans réponse** : la règle actuelle reste, et les retours sans lot continuent de s'accumuler chez les produits.

> **D-192 — Faut-il assouplir la règle de nommage des livrables : un indice commun pour un lot de fiches produit en un seul traitement, et une dérogation déclarée pour un produit dont le nommage a été décidé par vous ?**
> - **De quoi s'agit-il** : la règle de nommage, jugée par `oracles/oracle-conformite-projet.mjs`, impose un indice distinct par livrable et par jour, et lit le type dans le 2e segment du nom.
> - **Le problème** : un kit de 11 fiches faites ensemble doit porter 11 indices, de a à k, qui comptent des fichiers et ne disent aucune version. Chez le produit marketing, la forme que vous avez décidée le 30/09 met le client en 2e segment. Le contrôle y lit le type et refuse 11 livrables conformes à votre décision.
> - **Pourquoi vous** : c'est la doctrine de nommage du pilot, et le second cas met en face une décision que vous avez prise pour un produit.
> - **Recommandation : (a)** — un lot déclaré garde la règle lisible, et un nommage que vous avez décidé ne devrait pas rougir. Source consultée : `REGLES-PROJET.md`, règle de nommage et sa décision du 30/09 chez le produit.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Les 2 assouplissements | un lot déclaré au journal partage un indice, un produit déclare son préfixe et la place du type | 2 règles à écrire et à câbler dans le contrôle de conformité | retirer la déclaration |
| (b) Le lot seul | l'indice commun pour un lot déclaré, le nommage du produit reste refusé | 11 refus restent chez le produit marketing | retirer la déclaration |
| (c) La dérogation seule | le produit déclare son nommage, les fiches gardent un indice chacune | les kits gardent des indices qui comptent des fichiers | retirer la dérogation |
| (d) Rien ne change | la règle reste à la lettre | les 2 constats restent ouverts | sans objet |

> **Sans réponse** : la règle reste à la lettre, et les 11 refus du produit marketing restent au tableau de conformité.

> **D-193 — Faut-il ajouter 2 processus chez les produits : une revue de préparation déclenchée 5 jours avant toute séance datée, et un contrôle que chaque engagement d'un document client a son livrable ?**
> - **De quoi s'agit-il** : le calendrier d'un produit, tenu dans `donnees/echeances.md`, et les engagements écrits dans les documents remis à un client (pièce, temps, outil).
> - **Le problème** : la séance du 13/11 n'est inscrite dans aucun calendrier du produit, et sa revue de fond n'a eu lieu que sur votre demande, le 09/11. Des documents du 27 et du 28/10 ont annoncé un questionnaire, une satisfaction en formulaire et une skill, et aucune de ces pièces n'a été produite.
> - **Pourquoi vous** : ce sont 2 processus neufs chez tous les produits, donc de la doctrine. Ils ajoutent une revue à l'ouverture et un contrôle à chaque production.
> - **Recommandation : (a)** — les 2 défauts ont été vus par l'humain, aucun par la chaîne. Source consultée : `gabarits/CLAUDE-PRODUIT.md`, ouverture et production d'un livrable.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Les 2 processus | le hook d'ouverture nomme la revue à 5 jours, la production suivante juge chaque engagement | 1 rappel d'ouverture et 1 contrôle à écrire, un relevé des dates par produit | retirer le rappel ou le contrôle |
| (b) La revue seule | le rappel à 5 jours, les engagements restent non jugés | les pièces promises restent à voir à la main | retirer le rappel |
| (c) Le contrôle seul | les engagements jugés, sans rappel avant séance | une séance peut encore arriver sans revue | retirer le contrôle |
| (d) Rien ne change | ni revue ni contrôle | les 2 défauts se reproduiront à la prochaine séance | sans objet |

> **Sans réponse** : rien n'est ajouté, et la séance du 13/11 garde sa revue du 09/11 seule.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

La campagne a couru sur 9 agents et sur le pilot ; voici, lot par lot, ce qui est publié et ce que j'ai rejoué moi-même.
- Votre réponse D-190 (b) est consignée : l'alerte du relecteur sur la consigne de la veille compte comme infirmée.
- Tri des candidats du matin : 76 sujets décidés, 13 classes créées, 2 rattachements, et la consigne relue « sert » par un vérificateur.
- forge-ops (TF-2312) : l'application Terraform sonde la santé du projet avant d'appliquer ; self-test rejoué à 773 PASS, 0 FAIL.
- forge-websec (TF-2390) : l'adresse capturée est caviardée par position ; self-test rejoué à 168 PASS, 0 FAIL, 2 SKIP motivés.
- forge-organization (TF-2388) : types « Publication » et « Mesures » au registre des types, refusés avant (FAIL), admis après (PASS).
- forge-agents, skills de rendu : 12 sujets corrigés (communication, pptx 2.8.0, propale 1.4.0, schémas) ; self-tests rejoués verts, 6, 20, 4 et 31 contrôles.
- forge-agents, socle des pages : 8 sujets corrigés (docx 1.1.0, page-html 1.45.0, skill neuf digit-ai-cv-review 1.0.0) ; docx 25 cas verts, cv-review 10, les 26 cas neufs de page-html verts.
- forge-agents, quality-oracles 2.27.0 : 27 sujets des 2 lots d'oracles, dont 4 domaines neufs (rendu PDF, Word retouché, fidélité à la source, anonymisation d'un dossier) ; recette rejouée sur l'état fusionné, PASS à 730 contrôles.
- forge-design : 8 sujets corrigés, dont un oracle neuf du document imprimé (PPTX et PDF) ; recette complète rejouée à 1002 cas verts. Les 6 échecs vus par l'agent sous charge ne se reproduisent pas.
- forge-tests : 4 sujets corrigés (délais, animations, scripts Node sans paquet, recette du corpus) ; les 48 tests neufs rejoués verts.
- Pilot : 13 sujets corrigés, restitution 2.66.0 comprise. Rejoués sur la fusion : oracle-synthese 356/356, oracle-ecriture 117/117, gabarits 82/82, conformité 223 PASS, hook d'ouverture 75 PASS, hook de fin de tour 71/71 dans l'arbre principal.
- Le manifeste des versions livrées de forge-agents porte les 7 entrées de la campagne ; les 7 autres écarts restent au constat, ils relèvent d'autres travaux.
- 2 empreintes neuves sont déclarées à `references/EMPREINTES.md` ; l'oracle des empreintes passe de FAIL (E2) à PASS.
- La flotte de la campagne est relevée : 47 appels sur 48 vers un agent nommé (98 %), verdict AVERT pour une délégation Opus sans effort déclaré.
- Les restes des agents deviennent 9 candidats, de TF-2396 à TF-2404, dont un faux négatif de sécurité dans forge-tests : 4 avis connus ne sont pas vus en mode vif.

Relecture d'intention : sert.

## 5. Non traité

- TF-2340, l'exemption du dépôt émetteur dans la porte des noms de forge-agents — motif : borne_atteinte, l'agent du pilot n'avait pas ce dépôt dans son périmètre d'écriture.
- TF-2343 et TF-2349, laissés en cours avec leur règle écrite — motif : borne_atteinte, ce sont des récidives et aucun contrôle ne sait encore juger leur règle.
- Les 5 sujets de doctrine — motif : dependance_bloc_3, ils attendent vos réponses aux 3 décisions.

## 8. Prochaines actions

Trois actions suivent, dont une seule vous revient.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre aux 3 décisions de doctrine | D-191 | manuelle_utilisateur | decision | options au bloc 3 de `output/04-plans/Digit-AI - Synthese Mandat - Campagne A2 du 10-11 - 20261110b.md` ; répondre par la lettre de chaque décision, par exemple « 191a 192a 193a » | si rien n'est fait, les 5 sujets restent hors campagne et leurs défauts se reproduisent |
| A-2 | Écrire l'exemption du dépôt émetteur dans la porte des noms | TF-2340 | auto_ia | borne_atteinte : hors du périmètre de l'agent du pilot | `.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs` de `digit-ai-forge-agents` | si rien n'est fait, la porte accuse les fichiers d'un produit portant son propre nom |
| A-3 | Trier les 9 candidats neufs et chercher une barrière pour les 2 récidives restées en cours | TF-2396 | auto_ia | hors_mandat : nés de cette campagne, après le tri du matin | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, le faux négatif de sécurité de forge-tests reste ouvert |

Ordre : la décision d'abord, parce qu'elle seule vous revient et qu'elle lève 5 sujets ; puis l'exemption, qui touche une porte de publication ; le tri en dernier, parce qu'il ne bloque rien.

## 9. Traces

- `todo/TODO.jsonl` : 85 événements depuis le point d'étape de 11:40 (76 clôtures et passages en cours, 9 candidats), en plus des 91 du tri du matin ; oracle du registre PASS après chaque écriture.
- Pilot : la fusion de la campagne (faad37ff) et le commit de clôture, publiés avec cette synthèse. Le commit b537e65b de l'autre session, déjà enregistré, part avec eux.
- forge-agents : 8a88c54 pour les skills de rendu, 8d486a1 pour le socle des pages, 94566d9 pour quality-oracles, 7efb814 pour le manifeste. Mon premier envoi a publié seul le commit 31b9860 d'une autre session, déjà enregistré, avant la fusion.
- forge-design 4c3e04a, forge-tests 955454a, forge-ops 723f4ee, forge-websec e5681d8, forge-organization 9a7669c : publiés, chacun vérifié par `git rev-list --count origin/main..main` à 0.
- `todo/observabilite/flotte-campagnes.jsonl` : la ligne « campagne-a2-20261110 ».
