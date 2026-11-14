---
destinataire: humain
---

# Synthèse Mandat — revue de code proposée à la mise en production (03/11/2026)

## 0. Synthèse d'ouverture

La revue de code est outillée comme vous l'avez choisi, et l'étape de mise en production la propose désormais. Une consigne type, un plafond de 300 000 jetons tenu par tranches de 2 000 lignes et un rapport au format fixe vivent dans la forge de sécurité. À l'entrée de chaque mise en production, la session vous propose la revue avec sa dépense ; vous l'acceptez ou non, et rien ne bloque. Une question de méthode vous revient : le moment de la revue dans l'étape. Les 2 commits restent sur le poste, en attente de publication.

## 1. En-tête d'identification

Mandat sur le pilot `digit-ai-factory` et la forge `digit-ai-forge-websec`, exécution de votre réponse 162a. Période : 03/11/2026 de 16:58 à 17:16, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5 ; 1 agent `verificateur` en Haiku pour la relecture d'intention.

Intention de la demande : que la revue de code se commande toujours de la même façon, à coût borné, et qu'elle vous soit proposée au bon moment sans rien imposer.

Test rétro : une session qui ouvre une mise en production sait quand proposer la revue, avec quelle consigne et quel plafond, et le dossier dit ce qu'il en est advenu.

## 2. Verdict en une ligne

Option (a) exécutée : référentiel de la revue de code dans la forge de sécurité (self-test 83 PASS), proposition à l'entrée de la mise en production et règle d'avertissement dans l'oracle de l'étape (banc 49/49).

## 3. Décisions attendues

**D-152** : correction des failles du second produit relu, posée le 02/11 à 17:12, inchangée. Son rejeu donnerait la première mesure de la part de faux constats, que le point du 01/12 attend.

> **D-164 — La revue de code proposée à la mise en production se joue-t-elle en parallèle des premiers contrôles de l'étape, comme l'étude le prévoit, ou avant eux ?**
>
> - **De quoi s'agit-il** : le moment de la revue dans l'étape, écrit au § 1 quater de `ETAPE-MEP.md` : « La revue tourne en parallèle de M-1 à M-5 et son rapport se verse avant le GO. »
> - **Le problème** : la relecture d'intention relève que votre réponse ne fixait pas ce moment. La phrase reprend l'étude, section 4, qui joue la revue à l'entrée de l'étape, en parallèle des 5 premiers contrôles (build, santé, tests de staging, retour arrière, propreté), rapport versé avant le GO. Jouée avant, la revue retarde la construction et les tests de staging de la durée de ses tranches.
> - **Pourquoi vous** : c'est l'ordre de l'étape commune à tous les produits.
> - **Recommandation : (a)** — en parallèle, la revue n'allonge pas l'étape, et son rapport arrive quand même avant votre GO. Source consultée : l'étude d'opportunité du 03/11, section 4.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) En parallèle des premiers contrôles | La phrase reste ; build, santé, tests de staging et revue avancent ensemble, le rapport se verse avant le GO | Nul | Possible : déplacer la phrase |
| (b) Avant les premiers contrôles | La revue se joue et se relit d'abord ; un constat élevé peut être corrigé avant le build | Simple × court | Possible : revenir au parallèle |

> **Sans réponse** : (a), la revue reste en parallèle des premiers contrôles.

## 4. Traité

Les 3 suites de l'étude retenues par votre réponse sont en place, chacune jugée par son oracle ou son banc.

- **Consigne et format** : `referentiels/revue-de-code.md` 1.0.0 dans la forge de sécurité. Il porte la consigne type de l'agent, le plafond par tranches (la suivante part si le cumul relevé laisse 130 000 jetons de marge), le format du rapport et 4 statuts de constat : lu, relu, rejoué, non confirmé. `oracle-ecriture` PASS ; README, CLAUDE.md et journal de la forge le citent ; self-test de la forge à 83 PASS, 0 FAIL, 2 SKIP motivés.
- **Proposition à l'entrée de la mise en production** : `ETAPE-MEP.md` § 1 quater, sur le modèle de la mutation. La revue se propose quand le produit n'a aucune revue notée ou 10 commits depuis la dernière, avec ses lignes, ses tranches et sa dépense attendue. Un constat élevé non écarté se pose au GO. Contrôle M-19 ajouté, compte de la table remis à 19.
- **Câblage** : règle TM14 (section « Revue de code » exigée au dossier) d'`oracle-trace-mutation-mep`, en avertissement. Le dossier dit la revue jouée, avec rapport, constats et jetons, ou refusée. Banc rouge et vert à 49/49. Rejouée sur les 9 dossiers de mise en production du poste : 9 avertissements, puisqu'aucun ne porte encore la section ; la règle ne rend jamais d'échec, donc aucun verdict d'ensemble ne change.
- **Point du 01/12** : noté à `TF-2057` avec les seuils proposés par l'étude, non fixés.
- **Fins de ligne** : le README de la forge était parti en fins de ligne Windows, 702 lignes touchées pour 12 ajoutées. Remis en fins de ligne Unix dans le commit local, avant tout envoi : 12 lignes au diff.

Relecture d'intention : dérive, sous RI-20261103-23, sur 2 écarts. Le premier, les sources du référentiel et sa mention au journal, est laissé tel quel : un référentiel naît daté et sourcé (`REGLES-PROJET.md`, corollaire de R-31), et le journal de la forge consigne chaque ajout. Le second, le moment de la revue dans l'étape, vous revient : posé en D-164.

## 5. Non traité

- **Publication des 2 commits** (`cfa70286` au pilot, `6df125b` dans la forge de sécurité) — motif : hors_mandat, chaque dépôt porte devant les miens des commits non publiés d'une autre session, 14 au pilot et 1 dans la forge, qu'elle publiera elle-même.
- **Les seuils de la mesure** (10 constats rejoués, 50 % et 80 %) — motif : decision, ils se fixent avec vous avant la mesure du 01/12, comme l'étude le prévoit.
- **La revue limitée aux zones sensibles** — motif : decision, elle se réexamine au point du 01/12.
- **Le compte de 77 contrôles écrit au README de la forge, contre 83 mesurés** — motif : hors_mandat, écart antérieur laissé tel quel.

## 6. Écarts à la lettre

- Votre choix dit « l'étape de mise en production propose une revue » → la proposition ne revient qu'après 10 commits depuis la dernière revue → c'est la règle de la mutation : une proposition à chaque passage devient du bruit et se fait ignorer.
- L'étude ne nommait aucun contrôle → j'ai ajouté la règle TM14 à l'oracle de l'étape → sans exécutant, la proposition n'aurait aucun moment où se vérifier (loi transverse n° 1 : toute affordance est câblée ou n'existe pas).

## 8. Prochaines actions

Votre réponse sur D-152 passe d'abord : son rejeu donne la mesure que le point du 01/12 lit.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Décider de corriger les failles du second produit relu | `TF-2057` | manuelle_utilisateur | decision : écriture chez un produit | D-152 à `decisions/REGISTRE.jsonl` | si rien n'est fait : la version en attente garde ses failles, et la part de faux constats reste inconnue |
| A-2 | Choisir le moment de la revue dans l'étape de mise en production | `TF-2057` | manuelle_utilisateur | decision : ordre d'une étape commune aux produits | D-164 au bloc 3 de cette synthèse | si rien n'est fait : la revue reste en parallèle des premiers contrôles |
| A-3 | Refaire le point de la revue de code : statuts des rapports rendus, seuils à fixer avec vous | `TF-2057` | auto_ia | hors_mandat : votre réponse 162a le fixe au 2026-12-01, ou au retour du rejeu des failles s'il vient avant | `referentiels/revue-de-code.md` de la forge de sécurité, section du point du 2026-12-01 | si rien n'est fait : la revue reste sur demande sans qu'aucune mesure ne tranche |

## 9. Traces

- Forge de sécurité : commit `6df125b`, `referentiels/revue-de-code.md`, `README.md`, `CLAUDE.md`, `CHANGELOG.md`.
- Pilot : commit `cfa70286`, `ETAPE-MEP.md` et `oracles/oracle-trace-mutation-mep.mjs`.
- Registre : note du 03/11 à `TF-2057` dans `todo/TODO.jsonl`, non enregistrée, avec 4 lignes d'une autre session ; D-164 à `decisions/REGISTRE.jsonl`.
- Relecture : RI-20261103-23 dans `todo/relectures-intention.jsonl`.
- Étude source : `output/03-etudes/Digit-AI - Étude - Étape de revue de code par un seul agent - 20261103k.md`.
