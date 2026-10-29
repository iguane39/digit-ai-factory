---
destinataire: humain
---

# Synthèse Mandat — bases de développement et de qualification : 3 compétences construites, 1 décision ouverte (29/10/2026)

## 0. Synthèse d'ouverture

Les forges savent maintenant faire 2 des 3 choses que vous demandiez. Elles fabriquent un jeu de données de test à partir du schéma d'une base, et le chargent pour de vrai. Elles vident et reconstruisent une base de développement ou de qualification à la demande, en refusant toute base de production. L'audit d'un produit vérifie en plus qu'aucune donnée personnelle de production ne traîne en clair hors de la production. Tout est publié. Reste une question qui vous revient : peut-on alimenter une base de qualification avec un extrait de production anonymisé ? Sans réponse, rien ne change et la question revient à la revue suivante.

## 1. En-tête d'identification

Exécution de vos choix « A1 & A2 » du 29/10/2026 : publication de l'étude du matin, puis revue des 4 propositions qu'elle a inscrites au registre. Sur le pilot `digit-ai-factory` et 3 forges (tests, ops, audit). Période : 29/10/2026 de 10:04 à 11:17, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, avec 2 agents constructeurs (Opus 5.5) et 1 agent de campagne (Sonnet).

Intention de la demande : que les forges couvrent les 3 scénarios de bases hors production, et que vous ne tranchiez que ce qui vous revient.

Test rétro : le résultat sert cette intention. 2 scénarios sont couverts au niveau le plus fort de l'étude, un script jugé par sa recette. Le troisième attend votre doctrine, et un contrôle d'audit protège déjà les données quelle que soit la réponse.

## 2. Verdict

3 propositions construites sur 3 décidées, 3 recettes rejouées vertes par la session, 4 dépôts publiés et 0 commit en avance après vérification.

## 3. Décisions attendues

> **D-91 — Une base de qualification d un produit peut-elle être alimentée par un extrait de sa production, une fois anonymisé et contrôlé ?**
>
> - **De quoi s'agit-il** : la règle qui dit d'où viennent les données des bases de développement et de qualification des produits.
> - **Le problème** : forge-tests a décidé « synthétiques uniquement » le 02/08/2026, et 2 produits ont déjà écrit leur propre extracteur anonymisé faute d'outil commun.
> - **Pourquoi vous** : c'est une règle de la Factory sur la donnée personnelle de vos clients, et la changer revient au porteur.
> - **Recommandation : (a)** — un jeu synthétique ne reproduit pas les pièges d'une donnée réelle : un des 2 produits avait déjà un classeur synthétique, et c'est l'extrait réel anonymisé qui gardait les cellules fusionnées que son parseur ratait. Source consultée : l'étude du 29/10/2026 sur les bases de développement et de qualification.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Admettre l'extrait anonymisé, sous contrôle | forge-data construit un outil de masquage par moteur de base, et un contrôle refuse tout extrait où une personne reste reconnaissable ; les jeux d'audit de forge-tests restent synthétiques ; une pseudonymisation par clé ne suffit jamais | Complexe × plusieurs jours | Possible : la règle se retire par un commit, les extraits déjà produits restent chez les produits |
| (b) Synthétique uniquement, partout | aucune donnée issue de la production n'entre en développement ou en qualification ; le générateur synthétique est la seule voie ; les extracteurs des 2 produits deviennent contraires à la règle, et le contrôle d'audit les signalera | Simple × court | Possible, par une nouvelle décision |
| (c) Ne rien trancher | la règle de forge-tests reste seule écrite, chaque produit continue de décider pour lui ; le sujet revient à la revue suivante | Nul | Sans objet |

> **Sans réponse** : (c), ne rien trancher.

## 4. Traité

- **Publication du pilot (A-1)** : push de 2b507dcc à 1c9cfb7d avec votre GO cité, 0 commit en avance après `git fetch`.
- **Revue des 4 propositions (A-2)** :
  - fiches de décision écrites par `journaliser.mjs`, D-91 réservée, dossier rendu par `revue-hebdo.mjs` ;
  - 1 décision vous revient (doctrine) ; 3 relèvent de R-58, la règle du 01/10/2026 qui ne réserve à l'humain que dépense, publication, irréversible, doctrine, arbitrage et produit.
- **TF-2012, générateur de données de test** (forge-tests, 28269f6 puis 77ee930) :
  - lecture des migrations SQL, jeu déterministe dans l'ordre des clés étrangères ;
  - chaque valeur passe le garde-fou des jeux existants ;
  - chargement réel sur base PostgreSQL éphémère ;
  - la session a corrigé une ligne trop longue datée du 19/10, qui tenait la recette rouge ;
  - preuve : `recette/verifier_corpus.py` rejouée par la session, 13 sections OK, S-01 TENU, exit 0.
- **TF-2013, remise à zéro d'une base hors production** (forge-ops, 6812c96 et fe717c2) :
  - verbe `reinitialiser-base`, qui rend un plan par défaut et n'exécute que sur Postgres en Docker local ;
  - refus en exit 2 de la production, d'un environnement non déclaré, et du même serveur qu'une production ;
  - preuve : `self-test.mjs` rejoué, 278 PASS, puis 287 PASS avec exercice réel sur conteneur, 0 conteneur restant.
- **TF-2014, contrôle d'audit CTL-D09-09** (forge-audit 1.21.0, 2368164) :
  - toute base hors production déclare la source de ses données et ne porte aucune donnée personnelle de production en clair ;
  - le contrôle ne tranche pas D-91 ;
  - preuve : test neuf rejoué, 15 sur 15 ; `verifier-profils.mjs` PASS sur 7 profils.
- **Publication des forges** : push de forge-tests, forge-ops et forge-audit sous R-38 §6 (GO permanent D-53 (b)), 0 commit en avance après `git fetch` sur chacune.
- **Catalogue des services** : `cat-tst-09` et `cat-ops-08` ajoutés, vues régénérées, `generer-vues.mjs --check` PASS.
- **Registre** :
  - TF-2012 à TF-2014 passés en `corrige`, avec la voie par laquelle chaque correction redescend chez les producteurs ;
  - TF-2015 inscrit en proposition ;
  - `oracle-todo` d'abord FAIL (règle R12 : clôture sans descente), PASS après ajout.

Relecture d'intention : sans objet. Les consignes des agents sont parties sans relecture préalable, car le rappel est arrivé après leur lancement. Chaque livrable a été rejoué par sa recette à la réception.

## 5. Non traité

- **TF-2011, outil de masquage d'un extrait de production** : motif `decision_humaine`, il attend D-91.
- **Nettoyage final d'un jeu chargé** : déclaré en dette chez forge-tests (`fabrique-donnees-007`), motif `hors_perimetre`.
- **Exécution Supabase** : la CLI est absente du poste, motif `hors_perimetre` ; les commandes sont lues dans la documentation du 29/10/2026, jamais jouées.
- **Constats des agents hors de leur périmètre**, motif `hors_perimetre` : compte de bindings du README azure périmé, renvoi erroné dans ADR0506, citations de normes à relire à la source.

## 6. Écarts à la lettre

Tous portent sur la manière d'exécuter ; aucun n'ajoute à vos produits un contenu que vous n'avez pas demandé.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| A2 : décider la construction | construit les 3 propositions hors de votre ressort, posé la seule question de doctrine | règle R-58 du 01/10/2026 |
| (contrôle d'audit) | criticité Fatal, bloquante pour l'audit | niveau des contrôles voisins sur la donnée personnelle |
| (remise à zéro) | refus étendu au même serveur, conteneur ou projet qu'une production | vider une base agit sur tout le serveur |

## 7. Risques

- **Criticité Fatal du contrôle d'audit** : un audit de produit peut tomber sur ce seul point.
  - Signal : un verdict d'audit rouge sur CTL-D09-09 seul.
  - Parade : le ramener à « bloquant ordinaire » en une ligne.
- **Déclaration de base sans consommateur** : aucun produit n'a encore écrit la déclaration que lit la remise à zéro.
  - Signal : le premier produit bute sur un champ.
  - Parade : la fixture verte de forge-ops sert de modèle.

## 8. Prochaines actions

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | TF-2011 | manuelle_utilisateur | D-91 est une décision de doctrine | répondre « D-91 a », « D-91 b » ou « D-91 c » | l'outil de masquage n'est pas construit, chaque produit continue seul |
| A-2 | TF-2015 | manuelle_utilisateur | décider la construction revient à la revue | revue hebdomadaire du registre | un catalogue peut porter 2 services sous le même numéro sans alerte |

## 9. Traces

- Dossier de revue : `output\04-plans\Digit-AI - Revue hebdomadaire - Propositions D-91 et bases de donnees - 20261029d.md`.
- Étude : `output\03-etudes\Digit-AI - Étude - Bases de donnees de dev et qualification - 20261029a.md`.
- Registre : `todo\TODO.jsonl`, TF-2011 à TF-2015 ; réservation de D-91 dans `decisions\REGISTRE.jsonl`.
- Catalogue : `catalogues\catalogue.jsonl`, `catalogues\CATALOGUES.md`.
- Forges, commits publiés : forge-tests 77ee930, forge-ops fe717c2, forge-audit 2368164.
