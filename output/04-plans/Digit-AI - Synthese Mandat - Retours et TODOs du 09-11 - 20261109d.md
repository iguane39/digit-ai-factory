---
destinataire: humain
---

# Synthèse Mandat — 14 sujets du registre clos, boîte des retours vide (09/11/2026)

## 0. Synthèse d'ouverture

Oui, il restait du travail : aucun lot de retours n'attendait, mais 13 sujets du registre étaient prêts, plus un essai resté ouvert. Les 14 sont corrigés et vérifiés, et les 5 forges touchées sont publiées. Une session lancée sans interface est maintenant arrêtée si elle tente de finir sur un message d'attente, y compris depuis l'éditeur. Les produits Python verrouillés par uv ou poetry voient leurs dépendances auditées, et un corpus d'experts couvre GitHub. Une décision nouvelle vous revient : comment conclure la revue de la relecture d'intention, due hier, dont le critère repose sur vos réponses.

Livré : [Synthèse du 09/11, retours et TODOs](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Retours%20et%20TODOs%20du%2009-11%20-%2020261109d.md)

## 1. En-tête d'identification

Exécution de votre demande « est-ce qu'il y a d'autres retours et TODOs à traiter ? Si oui, fais les », puis de votre choix « A1 » au point d'étape. Sur le pilot `digit-ai-factory` et 5 forges. Synthèse relevée le 09/11/2026 à 17:06, heure de Paris, après une ouverture à 14:12. Session pilote Claude Opus 5.5, 6 agents de campagne Claude Sonnet 5.5 et une relecture d'intention.

Intention de la demande : vider ce qui reste à traiter, en exécutant tout ce qui ne vous revient pas.

Test rétro : la synthèse sert cette intention. Les 14 sujets prêts sont clos sur preuve rejouée, et seuls restent ce qui attend votre réponse, un produit ou une date.

## 2. Verdict

14 sujets clos en `corrige` sur 14 traités, 6 candidats tirés des restes. `oracle-todo` rend PASS après chaque écriture. Chaque livraison a été rejouée par le pilot avant clôture.

## 3. Décisions attendues

Bloquants de ce tour, chacun avec ce qui le lève :
- Les 7 sujets de la boucle L99 attendent votre réponse à D-180 ; sans réponse, ils vont à la revue du 16/11.
- La revue de la relecture d'intention attend votre réponse à D-183 ; sans réponse, elle est rappelée le 16/11.
- 11 sujets décidés attendent un produit, un geste humain sur des comptes, la prochaine mise en production ou le point du 01/12 ; rien n'est à fournir ici, ils restent décidés.
- La maquette scellée d'un produit garde son défaut de facette ; une exception déclarable à l'oracle la lèverait, proposée en candidat ; sans elle, l'oracle la refuse toujours.

Une décision nouvelle vous revient. La revue prévue le 08/11 devait juger la relecture d'intention par type de travail, sur la part des alertes que vous confirmez. Le relevé de ce jour compte 196 relectures et 65 alertes, dont 2 jugées par vous : 1 confirmée, 1 infirmée.

> **D-183 — Comment conclure la revue du 08/11 de la relecture d'intention, dont le critère principal repose sur vos réponses alors que vous en avez donné 2 sur 65 alertes ?**
> - **De quoi s'agit-il** : la relecture d'intention, un relecteur qui vérifie qu'un travail sert votre demande et non sa lettre, `scripts/relecture-intention.mjs` ; elle tourne en service depuis D-73 (b).
> - **Le problème** : le critère de la revue, au moins 1 alerte sur 2 confirmée par vous pour garder un type, ne se calcule pas sur 2 réponses ; appliqué à la lettre, il ferait passer tous les types à 2 relecteurs sans preuve.
> - **Pourquoi vous** : le critère porte sur votre jugement et sur la dépense de relecture ; le changer est un choix de doctrine.
> - **Recommandation : (a)** — 20 réponses suffisent à estimer la part confirmée par type, pour 10 minutes de votre temps, sans jetons de plus. Source consultée : `references/RELECTURE-INTENTION.md`, « Critères de la revue ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Échantillon de 20 alertes | je tire 20 alertes au hasard, vous répondez oui ou non à chacune, la revue conclut par type | environ 10 minutes de votre temps | élargir l'échantillon ensuite |
| (b) Second relecteur | un second relecteur juge les 65 alertes, la revue mesure l'accord entre eux | environ 2,6 millions de jetons, estimés à 40 000 par relecture | revenir à vos réponses |
| (c) Reporter la revue | rien ne change, la revue est reportée au 16/11 avec la revue hebdomadaire | aucun | conclure à tout moment |

> **Sans réponse** : la relecture continue telle quelle et la revue est rappelée le 16/11.

D-180 : moment de traiter les 7 sujets de la boucle L99, le mode boucle du skill qui améliore un prompt, posée le 06/11 à 16:13, inchangée.

## 4. Traité

- Boîte des retours : `oracle-boite-entree` PASS, 80 lots présents, tous ingérés, sas d'arrivée vide.
- 13 sujets décidés sous R-58 (la règle qui n'envoie à l'humain que ce qui lui revient) (TF-2278 à TF-2290), puis confiés à 6 agents ou faits par le pilot.
- Pilot, par moi :
  - loi n° 8 inscrite au noyau (TF-2289) : `oracle-claude-md` PASS, 6 124 octets sur 6 144 ; un premier essai qui retirait « seulement » a été refusé par la garde des quantificateurs ;
  - citation du tarif de restauration à la minute rectifiée sur la page relue ce jour (TF-2282) : `oracle-reglages-surs --pages` sans constat sur cette entrée, recette 36 sur 36.
- Pilot, agent A6, reporté par moi puis rejoué :
  - session `claude -p` lancée depuis l'éditeur reconnue par `turnOrigin` (TF-2280) : recette du hook 69 sur 69 ; l'agent a écarté la piste `promptSource`, présente dans les 243 sessions interactives relevées ;
  - essai réel en session `claude -p` (TF-2255) : refus du message d'attente à 14:59, session restée vivante, fin en succès ;
  - vérification du ledger Python alignée sur l'écriture (TF-2284) : 47 PASS ;
  - 3 pages d'études historiques passent la règle des facettes (TF-2288) : 8 pages sur 8 en PASS, recomptées par moi avec `oracle-filtres-tableau`.
- forge-agents, agent A1 : corpus d'experts GitHub admis par son juge (TF-2278), 9 réglages classés sur 9 (justesse du classement non mesurée hors du registre), recette 17 sur 17 ; audit des verrous uv et poetry (TF-2281), recette de quality-oracles 623 contrôles en PASS.
- forge-tests, agent A2 : tableau de bord sans G12 (TF-2279), 28 classes de constats dotées d'une règle d'action (TF-2285), suite e2e rouge rendue en échec nommé (TF-2286) ; les 3 fichiers de tests de la campagne passent, 81 cas.
- forge-design, agent A3 : 23 oracles dérivent leur plage de règles de leur liste, dont 9 plages périmées corrigées (TF-2287) ; verrou 52 vérifications, recette de l'oracle 73 PASS.
- forge-conception, agent A4 : la règle E8 (pronoms et absolus non vérifiables) admet une valeur d'API citée (TF-2283), recette verte.
- forge-agents-security, agent A5 : l'oracle des appels d'outils redevient du texte pour git et ne plante plus sur une ligne `null` (TF-2290), 127 sur 127.
- Publication : 5 forges à 0 commit d'écart après `git fetch`, vérifié par `rev-list`. Le pilot l'est aussi, poussé par une autre session du poste.
- Copie installée des skills remise à niveau, `oracle-skills --appliquer` PASS.

Relecture d'intention : dérive sur la consigne, 1 écart de nature choix humain (RI-20261109-01), les 7 sujets que D-180 réserve, rappelée au bloc 3.

## 5. Non traité

- TF-2236 à TF-2242, la boucle L99 — motif : `dependance_bloc_3`, D-180 sans réponse, défaut (a).
- La revue du 08/11 de la relecture d'intention — motif : `dependance_bloc_3`, D-183.
- 11 sujets au statut décidé — motif : `dependance_externe` ; lus un par un, ils attendent un produit (5 lots de travaux déposés), un geste humain sur des comptes, la prochaine mise en production ou le point du 01/12.
- 66 sujets en cours — motif : `borne_atteinte`, non relus un par un dans ce tour.
- Relectures d'intention à la réception des 6 livrables — motif : `borne_atteinte`, chaque livraison a été rejouée par son oracle à la place.
- La maquette scellée d'un produit du 15/08 garde son défaut de facette — motif : `garde_fou`, la modifier casserait son sceau ; candidat TF-2296.

## 6. Écarts à la lettre

- La consigne demandait de détecter la session par `promptSource` ou `querySource` → l'agent a détecté par `turnOrigin` → les deux premiers champs auraient refusé toutes vos sessions interactives.
- Vous avez demandé de tout traiter → j'ai reporté les commits de A6 sans l'index `output/LISEZMOI.md` → une autre session avait indexé ce fichier ; l'index se régénère.
- Les agents ont élargi 2 sujets : A3 a corrigé 22 oracles de plus que l'oracle nommé, A4 a ajouté les guillemets français à l'exemption.

## 7. Risques

- L'exemption de la règle E8 couvre aussi une phrase entière mise entre guillemets ; signal : une exigence non vérifiable qui passe parce qu'elle est citée ; parade : le candidat TF-2291 la borne.
- Une suite e2e qui ne démarre pas rend désormais un échec « suite entière » au lieu d'un SKIP ; signal : un rapport de tests qui passe à FAIL sans test nommé ; parade : le message nomme la suite et l'action revient au développeur.

## 8. Prochaines actions

Ordre : A-1 et A-2 d'abord parce qu'elles vous reviennent ; A-3 suit au prochain run.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Répondre à D-183 sur la façon de conclure la revue de la relecture d'intention | neuve | manuelle_utilisateur | decision : doctrine du critère de revue | `decisions/REGISTRE.jsonl` (D-183) : répondre « 183a », « 183b » ou « 183c » | si rien n'est fait, la revue reste sans conclusion jusqu'au 16/11 |
| A-2 | Répondre à D-180 sur le moment de traiter les 7 sujets de la boucle L99 | TF-2236 | manuelle_utilisateur | decision : arbitrage de périmètre contre l'échéance de l'étude | `decisions/REGISTRE.jsonl` (D-180) : répondre « 180a » ou « 180b » | si rien n'est fait, les 7 sujets attendent la revue du 16/11 |
| A-3 | Décider et corriger les 6 candidats tirés des restes de la campagne | TF-2291 | auto_ia | borne_atteinte : tour de 5 heures, ils entrent au registre pour le prochain run | `todo/TODO.jsonl` | si rien n'est fait, une phrase citée échappe encore à la règle E8 |

## 9. Traces

- `todo/TODO.jsonl` : décisions R-58, 14 clôtures, candidats TF-2291 à TF-2296
- `todo/relectures-intention.jsonl` (RI-20261109-01), `todo/observabilite/flotte-campagnes.jsonl` (retours-todos-20261109)
- `decisions/REGISTRE.jsonl` : D-183
- Pilot : 2a850901, 2b61f40c, 2e287ced, 2836af56
- Forges publiées : forge-agents-security 43623b9 ; forge-conception 8b51807 ; forge-tests 1a6d47a ; forge-design ae96d64 ; forge-agents 399298a
