---
destinataire: humain
---

# Synthèse Mandat — l'œil critique des process est étudié, son premier cycle explique les 19 minutes et inscrit 3 constats (20/10/2026)

## 0. Synthèse d'ouverture

L'attente de 19 minutes s'explique, et elle est déjà réparée. Le 12/10 au soir, une correction de la garde des noms a été annulée 5 minutes plus tard par une autre modification du même hook. Pendant 8 jours, la garde a donc rejugé toute l'histoire du pilot à chaque envoi : 25 envois, au moins 141 minutes perdues. Une autre session l'a corrigé ce matin à 10:44 (TF-1937) ; je mesure maintenant 35 à 47 s par envoi. Le vrai défaut est ailleurs : cette correction avait été close sur une mesure faite à blanc, et rien ne l'a remesurée en service. Le même schéma revient ailleurs : un contrôle ajouté le 14/10 échoue dans 30 sessions sur 55. L'étude recommande donc des sondes automatiques plutôt qu'un agent, en commençant par une sentinelle qui remesure chaque correction une semaine après sa clôture. Une décision vous revient, D-58 : la mettre en service.

## 1. En-tête d'identification

Exécution du prompt réécrit de l'analyse L99 (`output/03-etudes/20261020-L99-oeil-critique-des-process.md`, chapitre 8), sur votre réponse « exécute le prompt », lue comme D-56 (a) avec ses 7 écarts acceptés. Pilot digit-ai-factory, poste Dell-XPS-16. Période : 20/10/2026, de 11:29 à 11:43, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5. Agents délégués : 2 `explorateur` (relevés des hooks et des avertissements) et 1 `verificateur` (relecture d'intention), sans escalade de modèle.

Intention de la demande : faire voir et corriger les incohérences des process de la Factory, des forges et des produits, au service de l'utilisateur, sans attendre que l'humain les découvre lui-même.

Test rétro : le résultat sert cette intention. Le premier cycle a trouvé la cause de votre exemple, puis 2 autres incohérences de la même famille. La forme retenue (des sondes et non un agent) s'écarte de votre lettre « un agent (à confirmer) » ; elle vous est soumise en D-58, avec l'agent en option (b).

## 2. Verdict en une ligne

Étude PASS par `oracle-etude-opportunite` (E1 à E10) et par `oracle-ecriture` ; verdict O3, des sondes « service » dans forge-observability ; 3 constats inscrits au registre (TF-1939, TF-1940, TF-1941) ; indicateur de départ : 395 min d'attente sur les envois git au premier plan du 06/10 au 20/10.

## 3. Décisions attendues

1 décision neuve, au format B. Elle se lit seule : les 3 lignes disent de quoi il s'agit, le problème et pourquoi elle vous revient ; dans le tableau, une ligne par option, avec ce qui se passe, son coût en complexité × durée, et si l'on peut revenir en arrière ; la dernière ligne dit ce qui s'applique sans réponse.

> **D-58 — Faut-il mettre en service l'œil critique sous la forme de sondes « service » dans forge-observability, en commençant par la sentinelle de gain ?**
>
> - **De quoi s'agit-il** : la forme durable de l'œil critique que vous avez demandé. Des scripts sans modèle relèveraient, à chaque ouverture de session et chaque semaine, les durées des envois et des hooks, les avertissements qui survivent à leur correction, et les contrôles qui ne trouvent jamais rien. Une sentinelle remesurerait chaque correction close une semaine après, en service.
> - **Le problème** : sans dispositif, la régression du pre-push a duré du 12/10 au 20/10 et c'est vous qui l'avez vue. Les 3 constats de ce cycle viennent de scripts déterministes, pas du jugement d'un agent. Un agent coûte des jetons à chaque passage, et l'un de ses 2 chiffres recomptés s'écartait de la source.
> - **Pourquoi vous** : vous avez demandé « un agent (à confirmer) » ; l'étude retient une autre forme, et ce choix de forme vous revient. La mise en service crée aussi un objet durable dans une forge (R-31).
> - **Recommandation : (a)**. Sources consultées :
>   - `output/03-etudes/20261020-etude-opportunite-oeil-critique-des-process.md`, sections 1 bis, 4 et 5 ;
>   - les durées des envois dans les transcripts des 2 profils, relevées par les scripts de la session ;
>   - les items TF-1448, TF-1555 et TF-1937 de `todo/TODO.jsonl`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Sondes « service » dans forge-observability, sentinelle de gain en premier | Les scripts de ce cycle deviennent des sondes jouées à l'ouverture de session et chaque semaine ; TF-1939 et TF-1940 se traitent par la sentinelle, TF-1941 par le chronométrage des domaines ; revue le 17/11/2026 | Moyen × court ; 0 jeton par passage | Possible : retirer le plan de sondes |
| (b) Un agent de la flotte lancé à l'ouverture de session ou sur demande | Un `explorateur` relève et un `verificateur` juge, sur la grille des 6 classes ; il voit aussi les classes non nommées | Moyen × court ; environ 157 000 jetons par cycle, mesurés dans ce cycle | Possible |
| (c) Seulement durcir la règle de clôture | Un gain se constate en service, sur l'objet installé ; rien ne tourne en continu | Simple × court | Possible |

> **Sans réponse** : rien n'est mis en service ; TF-1939, TF-1940 et TF-1941 restent candidats au registre.

## 4. Traité

Chaque élément du contrat de sortie du prompt, avec ce qui le prouve.

- **Étude au gabarit, jugée.** Preuve : `node oracles/oracle-etude-opportunite.mjs` rend PASS (E1 à E10) ; `node oracles/oracle-ecriture.mjs` rend PASS. Fichier : `output/03-etudes/20261020-etude-opportunite-oeil-critique-des-process.md`.
- **Intention citée mot pour mot.** Preuve : section « Intention de l'utilisateur » de l'étude.
- **Cause des durées de la garde des noms, mesurée.** Le hook a rejugé toute l'histoire du 12/10 à 21:02 jusqu'au 20/10 à 10:44, parce que la section ajoutée par TF-1400 lisait l'entrée de git avant la garde. Preuves :
  - 277 appels `git push` relevés dans les transcripts du 06/10 au 20/10 ;
  - 25 envois du pilot pendant la régression, dont 9 coupés par le délai de 600 s de l'outil ;
  - chronométrage à blanc à 11:33 : 35 s sur 5 enregistrements, 44 s sur 30, 47 s sur 100.
- **Non-recouvrement.** Les 7 dispositifs du prompt et la règle de clôture sur gains constatés sont examinés, chacun avec sa citation et son angle mort. Preuve : section 2 de l'étude, contrôle E2 « 8 ligne(s), toutes citées ».
- **3 constats prioritaires, chacun au registre.** Preuve : `node todo/journaliser.mjs` rend « 3 événement(s) journalisé(s) », `oracle-todo` PASS avant et après l'écriture :
  - TF-1939 : gain mesuré à blanc, récidive de TF-1555 ;
  - TF-1940 : « Visibilité NON mesurée » dans 30 des 55 sessions depuis la correction de TF-1676 ;
  - TF-1941 : 4 domaines d'oracle sans échec sur 662 passages.
- **Chiffres d'agents recomptés à la source (S76).** Les refus du hook de fin de tour : 149 refus dans 77 sessions pour mon recompte, 144 dans 76 pour l'agent ; je retiens mon recompte. La visibilité : 30 sessions sur 55 pour mon recompte, « 30 sur 30 » pour l'agent ; je retiens 30 sur 55.
- **Jetons dépensés.** Sous-agents : 231 163 jetons (60 300, 96 459 et 74 404). Session principale : non relevée par appel ; environ 100 000 jetons de contexte au compteur du harnais. Total sous le budget de 400 000.
- **D-58 réservée au registre.** Preuve : `node scripts/reserver-decision.mjs` rend « D-58 ».
- **Relecture d'intention : sert (RI-20261020-12, gravité mineure).** Le relecteur relève 2 écarts. Le premier est le choix d'une sonde plutôt qu'un agent ; il vous est posé en D-58. Le second est l'inscription au registre, que demandait le point 5 du contrat du prompt accepté.

## 5. Non traité

- **La classe 6 (décision posée à l'humain qui relevait de l'IA).** Motif : il faudrait juger chaque décision du registre contre la règle R-58 ; l'étude la déclare non mesurée.
- **Le double appel de `verifier-avance-publication.mjs` dans le pre-push.** Motif : environ 1 s par envoi, sous le seuil d'un item ; il figure dans l'étude, classe 2.
- **La relecture d'intention des 2 consignes d'agents de relevé.** Motif : je ne l'ai pas jouée avant leur lancement ; le hook la rappelle sans bloquer, et les consignes ne demandaient que des comptages.
- **La mise en service des sondes.** Motif : elle attend D-58.

## 6. Écarts à la lettre

| Vous avez écrit | J'ai fait | Pourquoi |
|---|---|---|
| « un "agent" (à confirmer) » | L'étude retient des sondes sans modèle ; l'agent reste l'option (b) de D-58 | Les 3 constats prioritaires de ce cycle viennent de scripts ; vous aviez laissé la forme ouverte |
| « exécute le prompt » | Exécuté dans cette session, et non dans une session neuve comme le prompt le prévoyait | Votre demande visait cette session |

## 7. Risques

- **Les sondes ne voient que ce qu'elles nomment.**
  - Énoncé : une incohérence d'une classe nouvelle leur échappe, comme l'exemple fondateur échappait aux dispositifs existants.
  - Signal : vous signalez une incohérence qu'aucune sonde n'a levée.
  - Parade : la revue du 17/11/2026 remesure l'option agent si plus de la moitié des incohérences signalées par vous échappent aux sondes.
- **Les transcripts changent de forme.**
  - Énoncé : 4 classes sur 6 se lisent dans les transcripts de Claude Code, dont le format n'est pas un contrat.
  - Signal : une sonde rend 0 envoi ou 0 hook sur une semaine active.
  - Parade : une sonde qui ne lit rien rend un verdict « données insuffisantes », comme `derive.mjs` le fait déjà.

## 8. Prochaines actions

Ordre : les gestes de l'IA d'abord, votre décision ensuite ; A-1 attend D-58.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1939 | Écrire le plan de sondes « service » et la sentinelle de gain dans forge-observability, puis les brancher au relevé d'ouverture | auto_ia | dependance_bloc_3 : attend D-58 | Scripts du cycle dans le dossier temporaire de la session, à reprendre comme sondes `commande` | La prochaine régression se découvre encore à l'usage |
| **A-2** | `neuve` | Enregistrer l'étude, l'analyse, la synthèse et les 3 items du registre | auto_ia | hors_mandat : enregistrement non demandé dans ce tour | `git commit --only -- <chemins>` | Les 3 constats ne sont pas visibles depuis l'autre poste |
| **A-3** | `neuve` | Trancher D-58 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `58a` | Rien n'est mis en service |

## 9. Traces

- Étude : `output/03-etudes/20261020-etude-opportunite-oeil-critique-des-process.md`
- Analyse L99 : `output/03-etudes/20261020-L99-oeil-critique-des-process.md`
- Registre : `todo/TODO.jsonl`, TF-1939 à TF-1941 ; `decisions/REGISTRE.jsonl`, D-58 réservée ; relecture `RI-20261020-12` dans `todo/relectures-intention.jsonl`
- Scripts de relevé, dans le dossier temporaire de la session : `pushes.mjs`, `cout-regression.mjs`, `chrono-garde.sh`, `chrono-plages.sh`, `domaines-muets.mjs`, `recompte-refus.mjs`, `recompte-visibilite.mjs`
- Rien n'est enregistré ni poussé.
