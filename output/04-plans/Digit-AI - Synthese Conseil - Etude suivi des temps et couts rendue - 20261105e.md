---
destinataire: humain
---

# Synthèse Conseil — prompt corrigé puis étude « suivi des temps et des coûts par produit » rendue (05/11/2026)

## 0. Synthèse d'ouverture

L'étude est écrite et recommande O2 : un relevé des jetons et du temps à la fin de chaque session, écrit chez le produit. Aujourd'hui, seuls 5 runs sur 19 ont encore leurs jetons, car Claude Code efface les transcriptions au bout de 30 jours. Le pilot porte 41,4 % des 18,03 milliards de jetons relevés, sans produit rattaché. La recommandation est inscrite au registre comme candidat. Une décision vous revient : quelle lecture de la charge le suivi retient.

Livré : [Étude — Suivi des temps et des coûts par produit](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Suivi%20des%20temps%20et%20des%20couts%20par%20produit%20-%2020261105a.md)

## 1. En-tête d'identification

Run de conseil au pilot `digit-ai-factory`, suite de la revue L99 (analyse de prompt en 8 couches qui relisent le prompt d'origine) du 04/11/2026. Période : 05/11/2026 de 14:20 à 14:43, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; 5 agents : 1 vérificateur de clôture, 2 relecteurs aveugles et 1 relecteur d'intention, de type `verificateur`, et 1 `redacteur` pour la recherche en ligne ; escalade de modèle : aucune.

Intention de la demande : corriger le prompt de ses 10 défauts connus, le faire relire à l'aveugle, puis lancer l'étude.

Test rétro : le résultat sert cette intention. Les 10 corrections sont appliquées et relues par 2 relecteurs aveugles. L'étude répond aux 2 demandes du texte d'origine, dans leur ordre : ce qui manque pour suivre chaque projet, puis ce qu'il faut ajouter à la Factory.

## 2. Verdict en une ligne

Étude rendue, `oracle-etude-opportunite.mjs` et `oracle-ecriture.mjs` à exit 0, porte de publication acceptée ; la passe 3 du prompt est notée 84 et rejetée face aux 86 de la passe 1.

## 3. Décisions attendues

> **D-177 — Quelle lecture de la charge le suivi des produits retient-il : le nombre d'interventions humaines, le temps humain ou le temps agent ?**
>
> - **De quoi s'agit-il** : le mot « charges » de votre demande, que l'étude définit en section 1.1 de `output/03-etudes/` (fichier daté 20261105a).
> - **Le problème** : le mot a 3 sens, et chacun se mesure à une source différente ; le relevé à construire doit savoir lequel écrire.
> - **Pourquoi vous** : c'est le sens de votre propre demande ; l'étude ne pose aucun taux journalier ni montant de main-d'œuvre.
> - **Recommandation : (a)** — elle se lit déjà dans 10 journaux de run sur 11 et ne double pas la mesure du temps. Source consultée : `ledger.jsonl` des produits, 199 questions et 349 réponses humaines.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Le nombre d'interventions humaines | la charge compte les `question_humain` et `reponse_humain` du journal de run | simple : déjà écrit dans 10 journaux sur 11 | Possible : changer de lecture avant la construction |
| (b) Le temps humain | la charge additionne les écarts qui précèdent un message humain | moyen : la mesure mêle réflexion et absence, elle reste à valider | Possible : revenir à la première option |
| (c) Le temps agent | la charge reprend le temps actif des sessions et des sous-agents | nul : déjà calculé par la mesure du temps | Possible : changer de lecture |

> **Sans réponse** : (a), la construction de TF-2181 compte les interventions humaines.

## 4. Traité

Le tour a corrigé le prompt, l'a fait relire, puis a mesuré et rédigé l'étude.

- **Passe 3 du prompt.** Les 10 corrections de la revue ont été appliquées à la passe 1. Le vérificateur de clôture a jugé fermés 9/10 défauts visés ; le dernier restait ouvert par un défaut créé : `--projet <pseudonyme>`, exécuté tel quel, filtrait 0 dossier. Ce défaut a été recompté à la ligne 261 de `relever-flotte.mjs`, puis réparé avant la relecture. Les 2 relecteurs ont noté 84 et 84 avec 4 majeurs neufs, tous recomptés à la source ; la passe est rejetée pour régression. Le journal de boucle rend PASS à `oracle-boucle-l99.mjs` avec 3 passes.
- **Mesures de l'étude.** Elles ont été rejouées entre 14:23 et 14:35. Les journaux portent 19 runs, et non 12 : le `grep` du prompt manquait 7 lignes écrites avec une espace. Mesuré sur : `c:\dev\*\forge\ledger.jsonl`, relue à 14:30, périmètre 11 journaux. Le 95e centile des écarts entre messages vaut 24,85 s sur 108 856 écarts. 2 vérifications à la source sont faites, le prix d'Opus 5.5 et la rétention de 30, identiques au relevé de l'agent.
- **Preuve sur un run réel** de Produit-79, du 07/10/2026. Les décomptes A, en Node, et B, en Python, rendent tous deux 45 382 179 jetons. `relever-flotte.mjs` rend les mêmes jetons de sous-agent, à l'unité. Le temps actif vaut 1 511 s au seuil retenu, 977 s et 2 513 s aux seuils voisins. Au tarif public, ce run vaudrait 16,30 $, dont 55 % pour la lecture du cache. La règle d'attribution tient sur 2 sessions sur 3. Critère manqué : 2 sessions au lieu de 3.
- **Oracles de l'étude.** `oracle-etude-opportunite.mjs` rend PASS sur ses 10 règles, `oracle-ecriture.mjs` exit 0 après le passage d'un nombre en chiffres, `check_markdown.py` PASS ; la porte de publication a accepté l'enregistrement.
- **Registre.** TF-2181 est créé au statut `candidat`, de nature opportunité ; `oracle-todo` rend PASS avant et après. D-177 est réservée.
- **Relecture d'intention :** sert, gravité mineure (RI-20261105-06) : 2 écarts de nature choix humain, le prompt exécuté et la candidature, déclarés au bloc 6.

## 5. Non traité

- **La construction d'O2** — motif : hors_mandat, l'étude ne construit rien ; elle attend votre réponse à D-177 et votre « A1 ».
- **Le coût payé** — motif : decision, le montant de l'abonnement n'est écrit dans aucun fichier du pilot ; l'étude laisse ce coût sans valeur.
- **Le second poste** — motif : hors_mandat, ses transcriptions ne sont pas lisibles d'ici ; ses runs manquent à toutes les mesures.
- **La publication du pilot** — motif : hors_mandat, non demandée ; l'enregistrement reste local.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « A2 puis A1 » | l'étude part de la passe 3 corrigée de ses 4 majeurs, pas de la passe 1 notée 86 | c'est la seule version qui porte les 10 corrections que l'action A2 demandait ; ces 4 corrections n'ont pas été relues à l'aveugle |
| « Identifie … puis des éléments à rajouter » | une candidature au registre, TF-2181, en plus de l'étude | toute recommandation entre au registre comme candidat, et vous décidez |

## 7. Risques

- **Seuil d'inactivité trop bas.** Énoncé : le 95e centile, 24,85 s, compte comme inactif un appel d'outil plus long, et le temps actif varie du simple à plus du double selon le seuil. Signal : un écart de plus de 20 % entre ce temps et celui de la télémétrie de Claude Code sur une même session. Parade : la construction de TF-2181 relève les 3 seuils et compare une session à la télémétrie avant de figer le seuil.
- **Dépôts sans pseudonyme.** Énoncé : 4 dépôts qui portent un journal de run sont absents de la table des pseudonymes, et l'étude les désigne D-a à D-d. Signal : un nom de ces dépôts qui passe la porte de publication. Parade : l'action A-2.

## 8. Prochaines actions

Deux suites possibles ; A-1 d'abord, parce que chaque mois d'attente efface un mois de jetons.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Construire O2 : le relevé de fin de session, le marqueur du pilot et le référentiel de prix daté | TF-2181 | auto_ia | hors_mandat : la construction attend votre réponse à D-177 et votre « A1 » | `todo/TODO.jsonl`, TF-2181 ; étude, section 4 | si rien n'est fait, chaque mois efface encore un mois de jetons |
| A-2 | Inscrire les 4 dépôts sans pseudonyme à la table des pseudonymes | neuve | auto_ia | hors_mandat : attend votre « A2 » | table hors dépôt, sous `_confidentiel` | si rien n'est fait, la porte de publication ne protège pas leurs noms |

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Suivi des temps et des couts par produit - 20261105a.md`.
- Revue mise à jour : `output/03-etudes/Digit-AI - Revue - Prompt suivi des temps et couts des produits passe au crible L99 - 20261104c.md`, et son journal de boucle.
- Candidature : TF-2181 au registre `todo/TODO.jsonl` ; décision réservée D-177 au registre `decisions/REGISTRE.jsonl`.
- Relecture d'intention : RI-20261105-06 dans `todo/relectures-intention.jsonl`.
- Enregistrement : commit local a7282301 au pilot, non publié.
