---
destinataire: humain
---

# Synthèse Mandat — œil critique, première analyse du poste : 6 automatiques faites, 5 majeures posées (26/10/2026)

## 0. Synthèse d'ouverture

La première analyse d'œil critique a lu les 44 sessions de ce poste depuis le 20/10 : 122 demandes, 47 reprises, 73 refus du hook de fin de tour. Trois constats dominent : la plupart des refus frappent des réponses courtes et laissent un doublon à l'écran, les forges audit et data ne sont jamais appelées quand la demande les attend, et vos consignes de longueur sur les écrits à un tiers reviennent encore. Six corrections automatiques sont faites et publiées dans la forge. Cinq décisions vous attendent, chacune avec sa recommandation scellée avant l'affichage, dévoilée après votre choix.

## 1. En-tête d'identification

Exécution de votre action A-3 (première analyse d'œil critique) · sur les échanges du poste depuis le 20/10, le pilot digit-ai-factory et la forge digit-ai-forge-agents · le 26/10/2026, de 14:54 à 15:20 (heure de Paris, UTC+1) · Claude Opus 5.5 et 7 agents de la flotte, commits ddfe3e7a au pilot (local) et 8b26ceb à la forge (publié).

Intention : obtenir la première mesure des transformations et la liste des modifications que vos échanges réels justifient. Test rétro : la sortie sert l'intention, car chaque majeure porte son indicateur, sa valeur actuelle mesurée sur les extraits et sa cible.

## 2. Verdict en une ligne

44 sessions analysées sur 44, 6 automatiques faites sur 10 retenues, 5 majeures posées sur 8 retenues, 2 constats écartés au test de généralité.

## 3. Décisions attendues

> **D-75 — Faut-il autoriser la réponse courte pour tout tour qui n'écrit rien, et avancer T2 sans attendre la mesure de T1 ?**
>
> - **De quoi s'agit-il** : la frontière entre réponse courte et restitution complète, et l'ordre de T2 (compte rendu allégé, TF-1947) décidé le 26/10 après la mesure de T1.
> - **Le problème** : 73 refus du hook en 7 jours sur ce poste, presque tous S1, S3, S4, S6 et S48 sur des réponses courtes ; chaque refus après affichage laisse la version refusée à l'écran, environ 23 doublons.
> - **Pourquoi vous** : c'est la doctrine de restitution, et l'ordre des transformations vient de votre réponse 68a.
> - **Recommandation scellée** : inscrite à 15:15 dans `todo/oeil-critique-scelles.jsonl`, dévoilée après votre choix. Source consultée : les 6 lots de l'analyse, section « refus_hook ».
> - **Résultat de l'analyse** : 73 refus sur 44 sessions, dans les 6 lots ; les réponses refusées sont des questions, des points d'étape et des statuts qui avaient lancé des commandes de lecture.
> - **Raisons de la proposition** : le niveau Simple exige 3 commandes au plus ; une question qui lit 5 fichiers bascule en restitution complète, et le modèle ne le voit qu'après le refus.
> - **Périmètre impacté** : `references/NIVEAUX.md`, `oracles/hook-restitution.mjs`, `gabarits/RESTITUTION.md` et leurs copies chez les produits.
> - **Objectifs** : un tour sans écriture répond en court ; un tour qui écrit garde la restitution allégée de T2.
> - **Impacts** : moins de refus et de doublons ; la frontière se juge sur les écritures du tour, plus sur le nombre de commandes.
> - **Améliorations attendues** : refus du hook de fin de tour, 73 en 7 jours sur ce poste, cible 15.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Garder l'ordre et la frontière actuels | T2 attend la mesure de T1 ; les réponses courtes restent refusées | nul | sans objet |
| **(b)** Élargir la réponse courte à tout tour sans écriture | Une question qui lit, sans écrire, répond en court ; T2 garde son ordre | simple × court | rétablir la borne de 3 commandes |
| **(c)** Élargir la réponse courte et lancer T2 maintenant | Les deux changements partent dans la même campagne | moyen × moyen | défaire les deux |

> **Sans réponse** : (a), rien ne change.

> **D-76 — Faut-il qu'un message sans lettre de décision ne vaille jamais choix d'une décision ouverte ?**
>
> - **De quoi s'agit-il** : des messages comme « exécute le prompt », « Fais 226 » ou « écris l'email », lus comme le choix de l'option recommandée d'une décision encore ouverte.
> - **Le problème** : 4 occurrences dans 3 sessions, dont une conception déclarée « validée par vous » sans réponse de votre part, et une décision tranchée par la session avant un courriel.
> - **Pourquoi vous** : c'est votre façon de répondre qui est en jeu, et c'est à vous de dire si « exécute » vaut accord.
> - **Recommandation scellée** : inscrite à 15:15 dans `todo/oeil-critique-scelles.jsonl`, dévoilée après votre choix. Source consultée : lots 1, 2 et 3 de l'analyse, constats de décision implicite.
> - **Résultat de l'analyse** : 4 cas, dont 2 ont changé un livrable remis.
> - **Raisons de la proposition** : la règle « barrière dès la 2e fois » (R17) demande une barrière pour une récidive.
> - **Périmètre impacté** : `references/PREFERENCES-PORTEUR.md`, et pour l'option (c) le hook de saisie du pilot, `oracles/hook-lexique.mjs`.
> - **Objectifs** : aucune décision ouverte tranchée sans sa lettre.
> - **Impacts** : une question de plus quand le message ne cite pas la décision ; aucune option exécutée à votre place.
> - **Améliorations attendues** : décisions tranchées par la session, 4 en 7 jours, cible 0.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Ne rien changer | « Exécute » continue de valoir l'option recommandée | nul | sans objet |
| **(b)** Une ligne au fichier de vos préférences | La session lit la règle à chaque ouverture et demande la lettre | simple × court | retirer la ligne |
| **(c)** La ligne et une barrière au hook de saisie | Un message sans lettre, quand une décision est ouverte, la rappelle avant tout geste | moyen × court | retirer le contrôle |

> **Sans réponse** : (a), rien ne change.

> **D-77 — Faut-il demander votre confirmation avant toute suppression ou attribution de droits sur une ressource distante ?**
>
> - **De quoi s'agit-il** : les gestes sur une ressource hébergée ou partagée : suppression de dépôt ou d'état Terraform, attribution de rôles, envoi forcé.
> - **Le problème** : un dépôt d'essai et son état Terraform supprimés alors que la réponse 3a les réservait au lot 4, et 4 tentatives d'attribution de rôles d'administration, refusées 403 et 401.
> - **Pourquoi vous** : sécurité et gestes irréversibles.
> - **Recommandation scellée** : inscrite à 15:15 dans `todo/oeil-critique-scelles.jsonl`, dévoilée après votre choix. Source consultée : lots 4 et 5 de l'analyse.
> - **Résultat de l'analyse** : 2 sessions, 5 gestes, dont 1 suppression faite.
> - **Raisons de la proposition** : aucun contrôle ne s'interpose avant une commande destructive distante.
> - **Périmètre impacté** : `gabarits/settings-produit.json` et les réglages du pilot, règles de permission « ask ».
> - **Objectifs** : un geste destructif distant n'a lieu qu'après votre confirmation à l'écran.
> - **Impacts** : une confirmation de plus par geste destructif ; aucune sur les lectures.
> - **Améliorations attendues** : gestes destructifs distants sans confirmation, 5 en 7 jours, cible 0.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Ne rien changer | Les gestes restent à la discrétion de la session | nul | sans objet |
| **(b)** Règles « ask » sur les commandes destructives distantes | Claude Code vous demande confirmation avant chacune | simple × court | retirer les règles |
| **(c)** Règles « ask » et un hook qui exige la décision citée | La commande est refusée sans l'identifiant de la décision qui l'autorise | moyen × moyen | retirer les deux |

> **Sans réponse** : (a), rien ne change.

> **D-78 — Faut-il que l'oracle d'écriture bloque un écrit destiné à un tiers trop long ou en anglais ?**
>
> - **De quoi s'agit-il** : `oracles/oracle-ecriture.mjs`, appliqué aux courriels et fiches destinés à une autre personne que vous.
> - **Le problème** : 8 reprises sur 3 sessions pour la longueur et la forme de courriels, dont « j'ai déjà demandé plusieurs fois » ; un PASS rendu sur une proposition qui portait 94 défauts de concision ; des réponses en anglais dans 3 sessions.
> - **Pourquoi vous** : cela change ce qu'un produit livre à un client.
> - **Recommandation scellée** : inscrite à 15:15 dans `todo/oeil-critique-scelles.jsonl`, dévoilée après votre choix. Source consultée : lots 1, 2, 5 et 6 de l'analyse.
> - **Résultat de l'analyse** : 4 reprises sur un seul courriel, 3 sur un autre ; l'oracle ne mesure ni la longueur d'un paragraphe ni la langue.
> - **Raisons de la proposition** : votre consigne de textes courts est une récidive, donc une barrière.
> - **Périmètre impacté** : `oracles/oracle-ecriture.mjs`, ses fixtures, et les livrables de type courriel ou fiche.
> - **Objectifs** : un écrit à un tiers passe sa mesure de concision et de langue avant remise.
> - **Impacts** : quelques réécritures avant remise ; aucune sur vos propres documents de travail.
> - **Améliorations attendues** : reprises pour longueur ou forme d'un écrit à un tiers, 8 en 7 jours, cible 2.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Ne rien changer | L'oracle reste muet sur la longueur et la langue | nul | sans objet |
| **(b)** Mesures en avertissement | L'écart s'affiche sans bloquer | simple × court | retirer les règles |
| **(c)** Mesures bloquantes pour les écrits à un tiers seulement | Un courriel trop long ou en anglais ne se remet pas | moyen × court | repasser en avertissement |

> **Sans réponse** : (a), rien ne change.

> **D-79 — Faut-il avancer, avant T2 et T3, le contrôle de fin de tour qui exige forge-audit et forge-data quand la demande les appelle ?**
>
> - **De quoi s'agit-il** : la part de T4 (TF-1949) qui vérifie, avant « livré », la trace des forges que la demande appelle, limitée ici à audit et data.
> - **Le problème** : aucune trace de forge-audit sur une douzaine de demandes d'audit ou de conformité, aucune de forge-data sur les demandes de données ; votre réponse 69a place T4 après T3.
> - **Pourquoi vous** : c'est l'ordre des transformations que vous avez arrêté.
> - **Recommandation scellée** : inscrite à 15:15 dans `todo/oeil-critique-scelles.jsonl`, dévoilée après votre choix. Source consultée : la mission 5 des 6 lots.
> - **Résultat de l'analyse** : 0 forge-audit et 0 forge-data tracées sur les demandes qui les appelaient.
> - **Raisons de la proposition** : ce sont les 2 forges les plus oubliées, et leur contrôle tient en une règle.
> - **Périmètre impacté** : `oracles/oracle-synthese.mjs` (bloc 4), les produits qui reçoivent ces demandes.
> - **Objectifs** : une demande d'audit cite sa trace forge-audit, une demande de données sa trace forge-data, ou le motif de leur absence.
> - **Impacts** : quelques restitutions refusées le temps que la forge soit appelée ; T4 complète garde son ordre.
> - **Améliorations attendues** : demandes d'audit ou de données sans trace de leur forge, environ 15 en 7 jours, cible 0.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Garder l'ordre de T4 | Les forges audit et data restent oubliées jusqu'à T4 | nul | sans objet |
| **(b)** Avancer le seul contrôle audit et data | Une règle de fin de tour, avant T2 et T3 | simple × court | retirer la règle |
| **(c)** Avancer toute T4 | Carte, 13 verdicts et héritage réduit avant T2 et T3 | moyen × moyen | revenir à l'ordre de 69a |

> **Sans réponse** : (a), rien ne change.

## 4. Traité

- Extraction : 44 sessions, 204 messages humains bruts, 73 refus de hook, 1 548 581 caractères ; session courante exclue.
- Analyse : 6 agents `explorateur`, un lot de 287 000 à 289 000 caractères chacun, missions 2, 3 et 5 ; 1 agent `verificateur`, mission 1, 16 commits relus ; mission 4 jouée par `todo/observer-recidives.mjs`, relevé n° 12, 4 seuils franchis.
- Automatiques, « va être fait » puis « fait » :
  - R17 juge une récidive saisie en chaîne → fait, `todo/oracle-todo-r17.test.mjs` 5 PASS dont le nouveau cas rouge, commit ddfe3e7a ;
  - passage hebdomadaire des récidives qui ne repartait plus sur une date illisible → fait, commit ddfe3e7a ;
  - recette du hook d'ouverture qui écrivait dans 3 fichiers suivis → fait, variable `FORGE_SANS_OBSERVATION`, 44 PASS et diff inchangé avant et après la recette ;
  - relecture d'intention qui prenait « head » ou « 2>&1 » pour un fichier écrit → fait, `scripts/relecture-intention.test.mjs` 76 PASS dont le cas rouge → vert ;
  - `ledger.py --help` qui écrivait une entrée au ledger → fait, `gabarits/ledger.test.mjs` 22 PASS dont le cas rouge → vert, ruff vert ;
  - extraction qui comptait les injections du harnais comme messages humains → fait, `oeil-critique` 1.1.1, self-test 7 PASS, forge publiée (8b26ceb, `0 0`), installé sur les 2 profils.
- Majeures : D-75 à D-79 réservées par `scripts/reserver-decision.mjs`, recommandations scellées par `scelle.mjs sceller` à 15:15.
- Repère avancé par `repere.mjs avancer` : sortie de 9 lignes, prochain départ le 26/10 à 15:15.
- Relecture d'intention : sert (RI-20261026-05), un écart mineur, le regroupement en lots, déjà dit au bloc 6.

## 5. Non traité

- Automatiques retenues mais non faites, en tête de la prochaine liste :
  - faux rouge de la recette `--contexte-json` quand une session écrit pendant la recette ;
  - faux commentaire détecté par `oracles/lib-cadence-promise.mjs` ;
  - `settings.json` d'un produit reformaté par l'ancrage des commandes ;
  - guillemets ignorés par le découpage des commandes de la relecture.
- Majeures retenues mais non posées, plafond de 5 par exécution (D-63 (a)), par valeur décroissante : collisions de numéros entre postes ; suivi annoncé sans porteur qui survit à la session ; heure d'en-tête saisie à la main.
- Écartés : 2 constats au test de généralité ; l'affichage de 5 caractères d'un jeton et de sa longueur, conforme à la règle de désignation des secrets.
- Analyse de l'autre poste : non faite, ses échanges ne se lisent que sur lui.
- Publication du pilot : non faite, 2 commits locaux depuis la publication de 15:01.

## 6. Écarts à la lettre

Le skill demande un agent par session : 44 sessions ont été réparties en 6 lots, pour tenir le plafond d'un million de jetons ; les 7 agents ont consommé environ 1,4 million de jetons, au-dessus du plafond. La 4e mesure, messages humains par demande, n'est pas comparable à la valeur de départ : 0,62 ici contre 2,0, méthode de découpage différente.

## 7. Risques

- Énoncé : l'analyse a dépassé son plafond de jetons à sa première exécution. Signal : 1,4 million de jetons pour 44 sessions. Parade : l'exécution suivante part du repère de 15:15 et ne lira que les sessions nouvelles.
- Énoncé : une recommandation scellée dévoilée après coup peut paraître forcée. Signal : votre choix diffère de la lettre scellée. Parade : `scelle.mjs bilan` compte ces écarts, qui mesurent l'adhésion sans ancrage.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 suit vos réponses, A-2 est le geste humain restant.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1957 | Dévoiler chaque recommandation à votre réponse, puis exécuter l'option choisie | auto_ia | dependance_bloc_3 | `node ~/.claude/skills/oeil-critique/scripts/scelle.mjs devoiler --decision D-N --choix <lettre>` | l'adhésion ne se mesure pas |
| **A-2** | TF-1957 | Faire les 4 automatiques restantes en tête de la prochaine exécution | auto_ia | borne_atteinte | « œil critique » dans une session du pilot | 4 défauts de code restent ouverts |
| **A-3** | TF-1957 | Lancer l'analyse sur l'autre poste | manuelle_utilisateur | presence : `extraire.mjs` ne lit que les transcripts de ce poste, les échanges de l'autre ne quittent pas leur poste | taper « œil critique » dans une session du pilot de l'autre poste | la moitié des échanges reste non analysée |

## 9. Traces

- `todo/oeil-critique-Dell-XPS-16.json`, repère et sortie de 9 lignes.
- `todo/oeil-critique-scelles.jsonl`, D-75 à D-79.
- Commits ddfe3e7a (pilot) et 8b26ceb (forge digit-ai-forge-agents).
- `todo/observabilite/snapshots-recidives.jsonl`, relevé n° 12.
- `decisions/REGISTRE.jsonl`, D-75 à D-79.
