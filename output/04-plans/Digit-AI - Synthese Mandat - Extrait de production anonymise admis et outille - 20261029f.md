---
destinataire: humain
---

# Synthèse Mandat — extrait de production anonymisé : règle écrite, outil construit et publié (29/10/2026)

## 0. Synthèse d'ouverture

Votre choix est appliqué de bout en bout. Une base de développement ou de qualification d'un produit peut désormais recevoir un extrait de sa production, s'il est anonymisé puis mesuré. forge-data sait le faire : elle masque l'extrait colonne par colonne et refuse tout résultat où une personne reste reconnaissable. Une pseudonymisation par clé ou par hachage y est refusée. Les 3 scénarios de votre question du matin sont maintenant couverts par un outil jugé. Une réserve est écrite dans la règle : l'extrait reste juridiquement une donnée personnelle, donc la base qui le reçoit reste à accès restreint.

## 1. En-tête d'identification

Exécution de votre réponse « 91a » du 29/10/2026 à la décision D-91, sur le pilot `digit-ai-factory`, forge-data et forge-tests. Période : 29/10/2026 de 13:19 à 14:21, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, avec 1 agent constructeur (Opus 5.5) et 1 relecteur d'intention.

Intention de la demande : ouvrir aux produits la voie de l'extrait de production anonymisé, sans jamais laisser passer une personne reconnaissable.

Test rétro : le résultat sert cette intention. La voie est ouverte par une règle, et le contrôle qui la rend opposable est construit et rejoué par la session.

## 2. Verdict

TF-2011 construit et clos : le self-test de forge-data passe de 382 à 444 PASS, 0 FAIL, rejoué par la session ; 3 dépôts publiés, 0 commit en avance après vérification.

## 3. Décisions attendues

Aucune décision ne vous est demandée.

## 4. Traité

- **Décision au registre** : TF-2011 passe en `decide` avec votre réponse citée, puis en `corrige` avec sa voie de descente. `oracle-todo` rend PASS.
- **Règle R-65 (origine des données hors production), au pilot** (`REGLES-PROJET.md`, section AT) :
  - un extrait de production peut alimenter une base hors production s'il est anonymisé puis mesuré ;
  - une pseudonymisation n'est jamais une anonymisation, ni par clé, ni par hachage ;
  - le contrôle juge l'extrait masqué selon les 3 critères de l'avis 05/2014 du groupe de l'article 29 : individualisation, corrélation, inférence ;
  - les jeux d'audit de forge-tests et les fixtures des forges restent synthétiques, et la voie synthétique reste le défaut ;
  - la base qui reçoit l'extrait reste à accès restreint (point 6, voir les écarts).
- **forge-data, verbe « anonymiser »** (commit 0c524c6, construit par l'agent) :
  - une déclaration `forge-data/masquage@1` classe chaque colonne et lui donne une stratégie : supprimer, généraliser, remplacer, bruiter, agréger ou conserver avec motif ;
  - `scripts/anonymiser.mjs` masque un extrait CSV ou JSONL par table, de façon déterministe, sans garder la graine, et garde les clés étrangères valides ;
  - `oracles/oracle-anonymiser.mjs` mesure l'extrait masqué en 10 règles, de AN1 à AN10, dont le k-anonymat (k ≥ 5), la l-diversité (l ≥ 2) et le refus du hachage ;
  - les profils PostgreSQL et Supabase portent les commandes d'extraction et de rechargement, lues dans leur documentation le 29/10/2026 ;
  - preuve rejouée par la session : self-test 444 PASS, 0 FAIL ; les 4 fixtures rouges refusées, exit 1 ; exercice réel sur PostgreSQL 16 en conteneur, PASS, 47 conteneurs avant et 47 après.
- **forge-tests** (commit a0f79ac) : la décision (c) du 02/08/2026 garde sa lettre pour les jeux de la forge, et sa portée est précisée. Recette rejouée : 13 sections OK, S-01 TENU, exit 0.
- **Catalogue des services** : `cat-dat-14` ajouté, vues régénérées, `generer-vues.mjs --check` PASS.
- **Registre des empreintes** : `oracle-empreintes` rendait FAIL sur un script du pilot publié le 26/10 sans déclaration. Ce site est déclaré, et l'oracle rend PASS.
- **Publication** : forge-data et forge-tests poussées sous le GO permanent des forges (D-53 (b) du 03/10), le pilot sous le sien (D-54 (b) du 03/10).

Relecture d'intention : sert, gravité mineure, verdict consigné sous RI-20261029-05. L'écart relevé : le script ne s'adapte pas lui-même à chaque moteur de base. Cette part est livrée par les profils PostgreSQL et Supabase et par l'exercice réel.

## 5. Non traité

- **Dette du verbe**, motif `hors_perimetre`, déclarée par l'agent dans forge-data :
  - les clés composites ne sont pas prises en charge ;
  - k se mesure table par table, jamais sur le profil d'une personne à travers plusieurs tables ;
  - la forme JSONL n'est pas exercée sur le moteur ;
  - Supabase hébergé n'est pas exercé, faute de CLI sur le poste.
- **Self-test de forge-data hors de `C:\dev`** : 1 cas échoue sur un clone isolé, déjà avant ce tour (commit 3c14112), motif `hors_perimetre`.

## 6. Écarts à la lettre

Ces écarts portent sur la manière d'exécuter. Le point 6 de la règle ajoute une exigence pour les produits, et se retire en une ligne si vous le jugez de trop.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| (a) : admettre l'extrait anonymisé | ajouté à R-65 que la base qui le reçoit reste à accès restreint | l'avis 05/2014 (§2.2.2) tient l'extrait pour personnel tant que le produit garde sa production |
| un contrôle qui refuse toute personne reconnaissable | corrélation tolérée jusqu'à 1 % si elle est déclarée, nulle par défaut | sans lien conservé, une coïncidence de valeurs ne se distingue pas d'un vrai lien |

## 7. Risques

- **Plancher k = 5** : il vaut pour une base d'équipe.
  - Signal : un extrait chargé dans une base partagée au-delà de l'équipe.
  - Parade : relever k dans la déclaration de masquage, l'oracle mesure le seuil déclaré.
- **Antislash perdu dans une commande écrite au shell** : la session l'a reproduit sur `cat-dat-14`, et `--check` a rendu PASS.
  - Signal : un point d'entrée sans séparateur de dossier dans la vue du catalogue.
  - Parade : corrigé par un script écrit hors du shell ; la preuve est ajoutée à TF-2015.

## 8. Prochaines actions

Ordre : une seule action reste, car rien n'en dépend.

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | TF-2015 | manuelle_utilisateur | `decision` : la construction se décide en revue hebdomadaire | revue hebdomadaire du registre | si rien n'est fait, un point d'entrée cassé ou un identifiant en double passent `--check` |

## 9. Traces

- Règle : `REGLES-PROJET.md`, section AT, R-65.
- Registre : `todo\TODO.jsonl`, TF-2011 et TF-2015 ; relecture RI-20261029-05 dans `todo\relectures-intention.jsonl`.
- forge-data : commit 0c524c6, `..\digit-ai-forge-data\scripts\anonymiser.mjs`, `..\digit-ai-forge-data\oracles\oracle-anonymiser.mjs`.
- forge-tests : commit a0f79ac, décision (c) du cahier des charges du 02/08/2026.
- Catalogue : `catalogues\catalogue.jsonl`, `catalogues\CATALOGUES.md` ; empreintes : `references\EMPREINTES.md`.
