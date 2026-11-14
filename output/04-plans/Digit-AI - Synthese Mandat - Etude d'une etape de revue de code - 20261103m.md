---
destinataire: humain
---

# Synthèse Mandat — étude d'une étape de revue de code (03/11/2026)

## 0. Synthèse d'ouverture

L'étude est rendue, et sa réponse est non : une revue de code obligatoire avant chaque mise en production coûterait trop cher pour des failles dont on ne sait pas encore combien sont réelles. Elle recommande de garder la revue à votre demande, mais outillée : une consigne fixe, un plafond tenu par tranches de code et un rapport de même forme d'un produit à l'autre. Elle propose de refaire le point au 01/12, ou dès que le rejeu des failles du second produit aura mesuré la part de faux constats. Le choix de suivre cette voie vous revient.

Livré : [Étude d'une étape de revue de code](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20%C3%89tape%20de%20revue%20de%20code%20par%20un%20seul%20agent%20-%2020261103k.md)

## 1. En-tête d'identification

Mandat sur le pilot `digit-ai-factory`, exécution de votre réponse 153a. Période : 03/11/2026 de 15:25 à 15:40, heure de Paris, relevée par `date`. Session pilote Claude Opus 5.5 ; 1 agent `redacteur` en Sonnet pour l'étude, 1 agent `verificateur` en Haiku pour 3 relectures d'intention.

Intention de la demande : savoir, chiffres à l'appui, si la revue de code devient une étape de la Factory et sous quelles règles.

Test rétro : l'étude compare les 4 formes avec leur coût, leurs règles et ce qu'elles laissent passer, et rend un verdict.

## 2. Verdict en une ligne

Étude rendue, `oracle-etude-opportunite` et `oracle-ecriture` PASS ; verdict : revue sur demande outillée, étape obligatoire écartée à 250 000 à 300 000 jetons par mise en production.

## 3. Décisions attendues

**D-152** : correction des failles du second produit relu, posée le 02/11 à 17:12, inchangée.

> **D-162 — Faut-il outiller la revue de code sur demande comme l'étude le recommande, avec une consigne versionnée et une proposition à l'entrée de la mise en production ?**
>
> - **De quoi s'agit-il** : la revue de code par un seul agent, essayée sur 2 produits. L'étude `output/03-etudes/Digit-AI - Étude - Étape de revue de code par un seul agent - 20261103k.md` retient la revue sur demande outillée, et propose 3 suites : une consigne et un format de rapport dans les référentiels de `digit-ai-forge-websec`, une proposition de revue à l'entrée de l'étape de mise en production, et la reprise de la revue limitée aux zones sensibles après le rejeu des failles.
> - **Le problème** : les 2 essais ont coûté 545 163 jetons pour 28 constats, dont 6 seulement ont eu une seconde lecture et aucun n'est rejoué. Une étape obligatoire coûterait 250 000 à 300 000 jetons à chaque mise en production, et la forge de sécurité ne bloque jamais une mise en production par doctrine. Faute de compteur, l'étude elle-même a consommé 237 196 jetons pour un plafond de 150 000.
> - **Pourquoi vous** : la proposition à l'entrée de la mise en production change une étape commune à tous les produits, et chaque revue engage votre abonnement.
> - **Recommandation : (a)** — la voie outillée rend les revues comparables et mesure enfin les faux constats, sans rien imposer avant cette mesure. Source consultée : l'étude, section 5.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Revue outillée et proposée à la mise en production | La consigne et le format entrent dans la forge de sécurité, l'étape de mise en production propose une revue que vous acceptez ou non, et le point se refait au 01/12 | Moyen × court | Possible : retirer la proposition et la consigne |
| (b) Consigne seule | La consigne et le format entrent dans la forge de sécurité ; l'étape de mise en production ne change pas | Simple × court | Possible : retirer la consigne |
| (c) Rien de plus | La revue reste sur demande, comme aujourd'hui, et chaque rapport garde sa forme | Nul | Possible : reprendre l'étude plus tard |

> **Sans réponse** : (c), la revue reste sur demande, sans outil.

## 4. Traité

L'étude suit la consigne relue, et j'ai contrôlé ce qui engage le dépôt public.

- **Oracles** : rejoués par moi à 15:37 sur le fichier rendu, `oracle-etude-opportunite` et `oracle-ecriture` sortent en code 0, verdict PASS.
- **Dépôt public** : `grep` ne trouve dans l'étude aucun nom de produit, aucun nom de fichier de code ni aucune fonction des rapports ; les failles n'y sont que comptées.
- **Doctrine citée** : les lignes de `README.md` et `CLAUDE.md` de la forge de sécurité que l'étude cite disent bien « invocation sur mandat humain » et « jamais un blocage automatique d'une MEP », relues par `sed`.
- **Coût** : 237 196 jetons mesurés pour un plafond de 150 000, alors que l'agent s'estimait à 140 000. C'est le 2e dépassement d'un plafond de 150 000 dans ce fil, après l'essai du skill de logo à 184 090 : l'absence de compteur que l'étude décrit.
- **Registre** : verdict et décision notés à `TF-2057`.

Relecture d'intention : sert après 1 passe pour la consigne, sous RI-20261103-16 et RI-20261103-17, et sert à la réception de l'étude, sous RI-20261103-18. Ses 3 écarts mineurs : le sigle MEP sans glose, corrigé dans l'étude et oracles rejoués PASS ; la formule « sous quelles règles », qui reprend votre décision « tranchera le coût et les règles » ; la proposition à l'entrée de la mise en production, posée en D-162.

## 5. Non traité

- **Les 3 suites proposées par l'étude** — motif : decision, elles attendent D-162.
- **L'écart entre les plafonds de 250 000 et 300 000 jetons dans le rapport du second produit** — motif : hors_mandat, relevé par l'agent, sans effet sur l'étude.
- **L'écart de 3 973 contre 4 116 lignes pour le premier produit** — motif : hors_mandat, l'étude retient le chiffre du registre.

## 6. Écarts à la lettre

- Vous n'avez fixé aucun budget → j'ai posé 150 000 jetons, et l'agent l'a dépassé de 87 196 → je ne contrôle pas la dépense d'un agent pendant son exécution.
- La consigne demandait 3 pages au plus → l'étude fait 1 842 mots avec 4 tableaux, sans mesure en pages → l'agent l'a dit, et l'a coupée de 2 800 mots.

## 8. Prochaines actions

D-162 passe d'abord, puisque le point du 01/12 en dépend ; D-152 donnerait la mesure qui manque.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Choisir la suite de l'étude sur la revue de code | `TF-2057` | manuelle_utilisateur | decision : étape commune aux produits et dépense | `output/04-plans/Digit-AI - Synthese Mandat - Etude d'une etape de revue de code - 20261103m.md`, bloc 3 | si rien n'est fait : la revue reste sur demande, sans outil |
| A-2 | Décider de corriger les failles du second produit relu | `TF-2057` | manuelle_utilisateur | decision : écriture chez un produit | D-152 à `decisions/REGISTRE.jsonl` | si rien n'est fait : la version en attente garde ses failles, et la part de faux constats reste inconnue |

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Étape de revue de code par un seul agent - 20261103k.md`.
- Point d'étape : `output/04-plans/Digit-AI - Synthese Mandat - Point d'etape de l'etude d'une revue de code - 20261103l.md`.
- Relectures : RI-20261103-16 et RI-20261103-17 pour la consigne, RI-20261103-18 pour l'étude, dans `todo/relectures-intention.jsonl`.
- Registre : `TF-2057` dans `todo/TODO.jsonl` ; D-162 à `decisions/REGISTRE.jsonl`.
