---
destinataire: humain
---

# Synthèse Mandat — prompt « retravaille la cible » adapté au skill oeil-critique 1.1.0 (26/10/2026)

## 0. Synthèse d'ouverture

Le prompt réécrit reprend maintenant les 4 idées que l'autre session a intégrées au skill `oeil-critique` 1.1.0, sur votre décision D-72 (b). Le contrôle de portée de T1 n'a plus sa propre définition : c'est le test de généralité du skill, en 4 questions, plus le cas de vos préférences et des conventions client. Un défaut qui revient une 2e fois appelle une barrière et non un texte, et le prompt demande comment cette règle s'accorde avec T2. La version complète est en annexe ; il vous reste à dire « exécute le prompt ».

## 1. En-tête d'identification

Adaptation du prompt sur votre « OK, adapte le prompt » · sur le pilot digit-ai-factory · le 26/10/2026 à 13:51 (heure de Paris, UTC+1) · Claude Opus 5.5, lecture seule hors cette synthèse et une note ajoutée à l'analyse L99.

Intention : que le prompt exécuté produise une cible cohérente avec le skill tel qu'il est installé, sans deux définitions du même contrôle. Test rétro : la version adaptée sert l'intention, car chaque idée reprise par D-72 (b) y renvoie au skill au lieu d'être redéfinie.

## 2. Verdict en une ligne

4 idées sur 4 de la note de comparaison traitées : 2 intégrées à T1, 1 à la mesure, 1 écartée des décisions de la cible avec son motif.

## 3. Décisions attendues

Aucune décision nouvelle. Rappel : D-68, D-69 et D-70, amendées par vos remarques, seront reposées par l'exécution du prompt ; D-71, publication du pilot, posée à 10:22, inchangée.

## 4. Traité

- Note lue : `output/03-etudes/20261026-comparaison-task-observer-oeil-critique.md`, 4 idées.
- Skill relu : `digit-ai-forge-agents/.claude/skills/oeil-critique/SKILL.md` 1.1.0, étape 4 (« généralité », « barrière dès la 2e fois ») et règle de la recommandation scellée.
- Changements du prompt, chacun rattaché à son idée :
  - test de généralité : le contrôle de portée de T1 y renvoie, sans seconde définition ;
  - barrière dès la 2e fois : nouveau point 1c de T1, avec la consigne d'en dire l'accord avec T2 ;
  - refus de hook lus : la mesure du point 6 les lit, extraits à part par le skill 1.1.0 ;
  - recommandation scellée : D-68 à D-70 restent au format B ordinaire, la variante scellée étant réservée aux majeures de l'œil critique (commit b0cc03e7).
- Sources du prompt complétées par la note de comparaison et le skill 1.1.0 ; contrat de sortie ajusté sur T1.
- Note d'adaptation ajoutée en fin de `output/03-etudes/20261026-L99-oeil-critique-cible-retravaillee.md`.
- Relecture d'intention : sans objet, adaptation de prompt sans livrable de code.

## 5. Non traité

- Exécution du prompt : non faite, parce qu'elle attend votre « exécute le prompt ».

## 6. Écarts à la lettre

Comment lire : un écart par ligne, au-delà des 5 déjà listés dans la synthèse 20261026c, qui restent valables.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « adapte le prompt » | les règles de forme de T2 restent non bloquantes ; la barrière dès la 2e fois vise un défaut de fond, ou une règle de forme dont la récidive vous a fait intervenir | sans cette borne, la barrière rouvrirait les 82 règles bloquantes que T2 retire |

## 7. Risques

- Énoncé : la barrière dès la 2e fois et T2 tirent en sens contraires sur les règles de forme. Signal : une barrière proposée sur une règle de forme sans intervention de votre part. Parade : la borne du bloc 6, que le prompt fait expliciter.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 attend votre feu vert.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | aucun | Exécuter le prompt adapté, produire le diagnostic 20261026a et reposer D-68 à D-70 | auto_ia | gate_gouvernance | réponse « exécute le prompt » | la cible reste dans sa version du 21/10 |
| **A-2** | TF-1942 | Lancer la première analyse d'œil critique sur chaque poste | manuelle_utilisateur | decision : D-65 (a) laisse le lancement à votre geste | taper « œil critique » dans une session du pilot | aucune mesure de départ pour « rien d'oublié » |

## 9. Traces

- `output/03-etudes/20261026-comparaison-task-observer-oeil-critique.md`.
- `digit-ai-forge-agents`, commit c04d72d, skill `oeil-critique` 1.1.0.
- `output/04-plans/Digit-AI - Synthese Mandat - L99 cible oeil critique retravaillee - 20261026c.md`, version précédente du prompt.

## Annexe — prompt adapté

```text
Retravaille la cible d'œil critique : produis la version révisée du diagnostic,
« Digit-AI - Diagnostic Factory - Oeil critique - 20261026a.md » dans output\03-etudes\
(R-4 : le projet en tête ; R-25 : le type « Diagnostic » en premier mot du 2e segment),
qui remplace la version 20261021a pour les sections d, e, f, g et i, et intègre le
catalogue de l'annexe A5 de la synthèse 20261026b. Ne modifie aucun autre fichier de
doctrine : c'est une proposition.

Sources : le diagnostic 20261021a ; les synthèses 20261026a et 20261026b ; la note
output\03-etudes\20261026-comparaison-task-observer-oeil-critique.md ; le skill
oeil-critique 1.1.0 (digit-ai-forge-agents, D-72 (b)), étape 4 ; mes remarques
ci-dessous.

1. T1, retenue, avec 3 ajouts.
   a. Contrôle de portée : c'est le test de généralité du skill oeil-critique 1.1.0,
      sans seconde définition. Le constat vaut-il dans un autre projet, pour une autre
      tâche du même skill, révèle-t-il une règle manquante, a-t-il des chances de
      revenir ? Une majorité de « oui » le fait remonter à la Factory ; une majorité de
      « non » le laisse au produit. Une préférence de ma part ou une convention d'un
      client remonte toujours, vers le fichier de T1. La trace donne les 4 réponses.
   b. Forçage : si je demande de remonter à la Factory, la remontée se fait même si le
      test dit « produit ». Elle suit le format existant : ledger (type: retour),
      lot « <projet> - RETOURS - … » et sidecar .tf.jsonl déposés au sas _arrivee\,
      oracle-lot-retours vert. Les champs se remplissent depuis les traces ; une
      question ne se pose que pour un champ obligatoire qu'aucune trace ne permet de
      remplir, en une seule question groupée.
   c. Barrière dès la 2e fois : un défaut qui revient une 2e fois, sur la période ou au
      registre, appelle une barrière (hook qui refuse, contrôle d'oracle qui échoue,
      défaut qui rend le mauvais chemin indisponible, script qui fait le geste), jamais
      un texte reformulé ; la barrière passe la preuve de rejeu. Dis comment cette règle
      s'accorde avec T2 : les règles de forme restent non bloquantes ; une barrière vise
      un défaut de fond, ou une règle de forme dont la récidive m'a fait intervenir.

2. T2, retenue telle quelle.

3. T3, retenue, et la relecture d'intention gardée avec elle. Objectif : que la
   réponse corresponde à ma demande sans que j'intervienne, sauf sur un élément
   nouveau. Décris :
   - les 3 lignes du tour 1 (je livre, je suppose, je mobilise) deviennent le contrat
     contre lequel la relecture juge la réponse ;
   - la relecture corrige d'abord, par sa boucle de 2 passes, et ne me pose une
     question que pour un écart qui relève de mon choix ;
   - la prolongation au-delà du 01/11 annule le retrait 2 du 21/10 : pose-la en
     décision, avec un budget en jetons par jour mesuré sur l'essai.

4. T4, retenue, sans figer les forges. La carte donne des forges privilégiées par type.
   À chaque demande, chacune des 13 forges reçoit un verdict « mobilisée » ou
   « écartée » avec son motif, au regard de la demande et du profil du produit ;
   une forge mobilisée a aussi son motif. L'argumentation complète s'écrit dans un
   fichier de trace de la demande ; l'écran n'en montre qu'une ligne : les forges
   mobilisées, puis celles qui sortent de la carte, ajoutées ou écartées, avec leur
   motif. Le verrou « livré » vérifie les livrables des forges mobilisées.

5. A5, retenu, avec le même principe.
   - Chaque capacité du catalogue (skill, oracle, règle) porte une condition
     d'applicabilité lisible par un script : profil de produit, type de demande,
     présence d'un fichier ou d'un signal.
   - Le profil du produit est déclaré une fois et revu quand un signal change
     (domaine public, page indexable, données personnelles, agents).
   - À chaque demande, un script liste les capacités applicables ; à la fin, la trace
     dit, pour chacune, appliquée ou écartée avec motif. Une capacité applicable sans
     trace est un oubli, signalé avant « livré ».
   - Une capacité rare reste due : sa preuve d'utilité se compte sur les seules
     demandes où elle était applicable, jamais au calendrier. Remplace la règle de
     rétrogradation après 30 jours de silence de la synthèse 20261026b.

6. Mesure de « rien d'oublié » : la mission 5 du skill oeil-critique compare, pour
   chaque demande analysée, les forges et capacités applicables à celles appliquées.
   Elle lit aussi les refus de hook que le skill 1.1.0 extrait à part : un refus sur un
   livrable de forge manquant compte comme un oubli. Donne la valeur de départ si elle
   se mesure, sinon dis-le.

7. Chiffre chaque ajout : fichiers, octets chargés à l'ouverture (plafond 9,6 Ko),
   jetons par jour. Chaque ajout dit ce qu'il retire, ou pourquoi il n'entre pas
   dans la couche plafonnée.

8. Repose D-68, D-69 et D-70 en entier, au format B ordinaire (la variante à
   recommandation scellée est réservée aux majeures de l'œil critique), sur le texte
   révisé, option (a) = la version amendée ; ajoute la décision de prolonger la
   relecture (point 3). Réserve chaque nouvelle décision par
   scripts\reserver-decision.mjs. D-71 reste inchangée.

Contrat de sortie, à vérifier avant de rendre :
- le fichier existe au nom ci-dessus, avec un en-tête « remplace » et « ce qui change
  depuis 20261021a » ;
- les 5 points (T1, T2, T3, T4, A5) ont chacun : ce qui change, avantages,
  inconvénients, coût chiffré ;
- le contrôle de portée de T1 renvoie au test de généralité du skill, sans en écrire
  une seconde définition ;
- l'accord entre la barrière dès la 2e fois et T2 est écrit ;
- aucune règle de la version ne rétrograde une capacité au calendrier ;
- le tour 1 affiché tient en 3 lignes, quelle que soit la demande ;
- chaque chiffre porte sa source ou « à vérifier » ;
- oracle-ecriture PASS sur le diagnostic ; la synthèse passe
  hook-restitution --prejuger avant affichage.
```
