---
destinataire: humain
---

# Synthèse Conseil — étude « Claude Code apprend de ses erreurs », lancée sur votre « A2 » (04/11/2026)

## 0. Synthèse d'ouverture

L'étude est rendue et recommande une option. Elle constate que la Factory enregistre déjà ses erreurs : 528 récidives sur 80 classes, une mémoire par projet. En revanche, elle ne les remet pas sous les yeux de l'agent au moment où il va les refaire : une leçon écrite dès la première fois a été mordue 12 fois. La recommandation : un seul contrôle, joué avant chaque commande. Il lit une liste de leçons tenue au pilot et chez chaque produit, rappelle la leçon qui correspond au geste, et refuse le geste si l'erreur revient après le rappel. Les produits la reçoivent sans que le pilot écrive chez eux. Le sujet est inscrit au registre ; c'est à vous de décider si on le construit.

Livré : [Étude d'opportunité sur l'apprentissage des erreurs](output/03-etudes/Digit-AI%20-%20%C3%89tude%20-%20Apprentissage%20des%20erreurs%20par%20les%20produits%20et%20la%20Factory%20-%2020261104b.md)

Livré : [Revue L99 du prompt, passe 4 comprise](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20apprentissage%20des%20erreurs%20passe%20au%20crible%20L99%20-%2020261104a.md)

## 1. En-tête d'identification

Run de conseil sur votre « A2 », au pilot `digit-ai-factory`. Période : 04/11/2026, relevés d'horloge du tour de 16:22 à 16:35, heure de Paris (UTC+01:00) ; le tour a commencé avant le premier relevé. Session pilote Claude Opus 5.5. Agents : 2 relecteurs aveugles et 1 vérificateur de clôture (`verificateur`), et 1 agent de recherche `general-purpose` lancé sans modèle ni effort déclarés, donc au modèle de la session, une dérogation au routage. Escalade de modèle : aucune.

Intention de la demande : corriger le prompt, le faire relire à l'aveugle, puis lancer l'étude pour que Claude apprenne de ses erreurs, par produit et à la Factory.

Test rétro : le résultat sert cette intention. Le prompt corrigé a été relu par 2 agents neufs. L'étude répond aux 6 mouvements de votre demande : enregistrer, annoter plusieurs solutions, ne plus reproduire, remonter, partager, mesurer. Le sujet est au registre, et la décision vous est posée.

## 2. Verdict en une ligne

Étude jugée PASS par `oracle-etude-opportunite` (E1 à E10), exit 0 à `oracle-ecriture`, PASS à `check_markdown.py`. Prompt de la passe 4 mesuré à 84 par les 2 relecteurs ; 11 lignes du contrat de sortie tenues sur 11.

## 3. Décisions attendues

> **D-172 — Faut-il construire le rappel des leçons au moment du geste, l'option O2 de l'étude du 04/11/2026 sur l'apprentissage des erreurs ?**
> - **De quoi s'agit-il** : un contrôle joué avant chaque commande de l'agent, qui lit une liste de leçons et rappelle celle qui correspond au geste, puis refuse le geste si l'erreur revient. Nom interne : option O2, sujet `TF-2150` du registre.
> - **Le problème** : la Factory consigne les erreurs, mais ne les rappelle qu'à l'ouverture de session, ou pas du tout. 80 classes ont récidivé, pour 528 récidives au total. La leçon des longues commandes de ce poste a été mordue 12 fois après avoir été écrite.
> - **Pourquoi vous** : c'est un contrôle de plus au noyau du pilot et chez tous les produits par l'héritage, donc de la doctrine.
> - **Recommandation : (a)** — c'est la seule option qui agit au moment du geste. La documentation de Claude Code le dit : la mémoire est un contexte, et seul ce type de contrôle peut bloquer. Source consultée : `output/03-etudes/Digit-AI - Étude - Apprentissage des erreurs par les produits et la Factory - 20261104b.md`, sections 1 (Q3) et 5.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Construire le rappel au geste (O2) | un contrôle unique et sa liste de leçons au pilot, puis chez les produits par leur hook ; une leçon qui récidive devient un refus | complexe · moyen ; aucun jeton à l'ouverture, 600 caractères au plus par rappel | retirer l'entrée du contrôle dans les réglages ; la liste reste comme document |
| (b) Construire d'abord la détection des erreurs en fin de tour (O4, sujet `TF-2141`), le rappel ensuite | le hook de fin de tour relève les corrections, refus et échecs du tour ; rien n'est rappelé avant le geste | moyen · court | retirer la règle du hook de fin de tour |
| (c) Ne rien construire (O0) | les récidives restent au rythme mesuré ; le sujet reste candidat | aucun | sans objet |

> **Sans réponse** : le sujet `TF-2150` reste au statut candidat et revient à la revue hebdomadaire des propositions.

## 4. Traité

- **Prompt corrigé et relu.** Les 5 corrections sont appliquées. Un vérificateur de clôture en a fermé 3, jugé 2 partielles et relevé 3 défauts créés, corrigés avant relecture. Les 2 relecteurs aveugles notent 84 et 84 et trouvent 6 majeurs nouveaux, absorbés à l'exécution. La passe et le prompt exécuté sont ajoutés à la revue.
- **Étape 0 remesurée** à 16:22 : 2 148 sujets, 227 classes, 528 récidives, 400 manques d'héritage, 43 règles, 2 patrons, 383 lots, mémoire 34 sur 44 et 22 sur 22. Au pilot, le profil 2 a 3 fichiers de mémoire contre 37 au profil 1, 1 seul en commun.
- **État de l'art** : 8 sources de moins de 24 mois, ouvertes une à une par l'agent de recherche. Parmi elles : la documentation de Claude Code sur la mémoire et les hooks, 4 articles de recherche, et le système de mémoire de GitHub Copilot.
- **Candidature** : `TF-2150`, classe `boucle-retour-sans-descente`, au statut candidat, écrite par `journaliser.mjs` après un essai à blanc ; `oracle-todo` PASS avant et après.
- **Jeu d'essai**, mené sur les 3 classes les plus récidivantes et 1 erreur de produit :
  - `oracle-faux-positif` (67 récidives) : un rappel à l'écriture d'un oracle, mais c'est une erreur de conception, peu couverte par O2 ;
  - `regle-ecrite-sans-oracle-qui-la-joue` (36) : un rappel à l'écriture d'une règle, puis un refus de toute règle sans mécanisme, couvert ;
  - `controle-vrai-sur-le-mauvais-invariant` (33) : aucun geste reconnaissable, hors d'O2 comme l'étude le dit ;
  - l'erreur de produit vient du lot de Produit-84 du 04/11/2026, 10:13:05 UTC. Il a fallu remonter de 2 lots pour la trouver. Une fiche y a été éditée à la main au lieu d'être reconstruite par son générateur. La leçon resterait au produit, rappelée à l'écriture de cette fiche, et ne remonterait pas.
- **Contrat de sortie, 11 lignes sur 11.** Les preuves :
  - nom : conformité sans constat sur l'étude, `grep` à 0 et `"findings"` à 1 ;
  - lignes 3, 4, 6, 7 et 8 : oracle d'étude PASS de E1 à E10 ;
  - lignes 2 et 5 : sections « Intention » et 0 bis de l'étude ;
  - ligne 9 : tableau des parades de la section 5 ;
  - ligne 10 : le hook pre-commit de l'enregistrement ;
  - ligne 11 : `TF-2150`.
- **Renommages** : la revue, son journal et la synthèse précédente dépassaient le plafond de longueur de chemin de R-4, de 7 à 9 caractères ; ils sont raccourcis, et les 3 renommages consignés dans `references/RENOMMAGES-LIVRABLES.jsonl`.
- **Relecture d'intention :** sans objet, motif : l'essai a franchi son plafond de jetons, constaté au relevé d'ouverture.

## 5. Non traité

- **L'enregistrement du registre et du registre des décisions** : motif, 51 événements d'autres sessions actives y sont non enregistrés, le dernier à 15:33 UTC ; les enregistrer avec les miens emporterait leur travail. `TF-2150` et `D-172` sont écrits et partiront avec leur prochain enregistrement.
- **La construction** : motif, elle attend votre réponse à D-172.
- **La publication du pilot** : motif, non demandée.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « faire relire par 2 relecteurs aveugles, puis lancer l'étude » | une relecture de contrôle hors du journal de boucle, puis l'étude | la règle d'extension refuse une 4e passe au journal après une passe sans gain |
| appliquer les 5 corrections | les 5, plus 6 points absorbés à l'exécution sans réécrire le prompt | les relecteurs ont trouvé 6 majeurs nouveaux, au même score de 84 |

## 7. Risques

- **Leçon fausse servie à tous.** Énoncé : une leçon générique erronée serait rappelée chez tous les produits. Signal : une récidive ou un refus injustifié signalé par un produit. Parade : seule une leçon décidée au registre et rejouée entre dans la liste du pilot, et sa preuve se vérifie avant chaque rappel.

## 8. Prochaines actions

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Construire le contrôle de rappel, sa liste de leçons et leur recette, après votre réponse à D-172 | TF-2150 | auto_ia | attend votre réponse à D-172 | étude 20261104b, section 5 | les récidives restent au rythme mesuré |
| A-2 | Enregistrer le registre et le registre des décisions quand les autres sessions auront enregistré les leurs | aucun | auto_ia | dépendance, travail d'autres sessions dans les mêmes fichiers | `git commit --only -- todo/TODO.jsonl decisions/REGISTRE.jsonl` | `TF-2150` et `D-172` restent locaux et non enregistrés |

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Apprentissage des erreurs par les produits et la Factory - 20261104b.md`.
- Revue, avec la passe 4 et le prompt exécuté : `output/03-etudes/Digit-AI - Revue - Prompt apprentissage des erreurs passe au crible L99 - 20261104a.md`, et son journal `.boucle.json` (PASS).
- Registre : `todo/TODO.jsonl`, création `TF-2150` ; décisions : `decisions/REGISTRE.jsonl`, `D-172` ; écrits, non enregistrés.
- Enregistrement : commit local `d6f565d6` au pilot, passé par le hook pre-commit sans retrait de nom ; non publié.
