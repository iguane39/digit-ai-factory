# Retours forges — Produit-86 — 20261105b

- **Contexte** : revue du porteur du 05/11/2026 sur la préproduction, run 20261105a-evolution-revue-porteur : « On a l'impression que l'application n'a pas été testée et mes demandes de correction pas prise en compte » ; quatre remarques (mission brouillon invisible à l'approbateur, alerte de perte de saisie sans modification, recherche des filtres inopérante, identifiants et dates dans les valeurs de filtre) et demande d'analyse des causes côté projet et côté factory
- **Références ledger** : `forge\ledger.jsonl` seq 450 (demande mot pour mot), 443 et 453 à 458 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 : `todo/CLASSES.json` du pilot, 227 classes, filtré sur `filtre`, `profil|persona|croise`, `ledger|vocabul|type`, `contre|negat|positif`, `version|servi|commit`, `l99|boucle|relecteur`. Classes existantes retenues : `page-html-filtres-tableau` (RP-15), `oracle-faux-negatif-sur-rendu` (RP-16, RP-19), `exigences-tenues-sans-parcours-des-personas` (RP-17), `type-prescrit-hors-vocabulaire-de-l-ecrivain` (RP-18), `oracle-faux-positif` (RP-20). Deux retours n'en trouvent aucune et proposent la leur (RP-21, RP-22).

## Ce que la revue a relevé, et ce que le run en a fait

Trois remarques reproduites et corrigées en local, sur une branche, avec un test rouge sur HEAD puis vert : la garde de saisie compare désormais des états (E-097) ; la recherche du panneau filtre valeurs et lignes ; la valeur de filtre est la valeur métier (E-112). La quatrième (mission brouillon) attend une décision du porteur (D-112). Étude : `output/Produit-86 - Étude - Causes des anomalies de la revue du porteur du 05-11 - 20261105b.md`. R4 est la troisième apparition de la même classe (03/11, 04/11, 05/11).

## pilot (socle `digit-ai-page-html`, `quality-oracles`, gabarits)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-15 | bloquant | générique | Composant `table-filters` du socle : la valeur de facette est le `textContent` entier de la cellule (`valeur()`), et `.tf-opts label { display: flex }` annule le `hidden` de la recherche. Préproduction Produit-86 : filtre Mission 84 valeurs pour 84 lignes (« créée par » inclus), filtre Agent 67 valeurs pour 3 agents ; « Juice » saisi, 84 valeurs restent affichées. Ledger seq 453. | `valeur()` lit `data-tf-valeur` ; `.tf-opts label[hidden] { display: none }` ; la saisie filtre valeurs et lignes. Corrigé dans la copie du produit, à porter au socle et à documenter dans L4. |
| RP-16 | majeur | générique | `oracle-filtres-tableau` juge la présence et le câblage (G1-G9), pas l'utilité des valeurs : 4 PASS (seq 261, 278, 355, 392) sur des filtres à une valeur par ligne. Ledger seq 454. | Règle statique : cellule d'une colonne filtrable avec élément secondaire (`<br>`, `.faible`) sans `data-tf-valeur` refusée ; règle de rendu : valeurs distinctes = lignes au-delà de 15 lignes, avertissement. |
| RP-18 | majeur | générique | Gabarit `forge/ledger.py` : `demande_humain` absent de `TYPES`. La revue du 04/11 n'a été consignée qu'en résumé (seq 374) et en retour reformulé (seq 375) ; l'exigence née de ce retour (E-112) a corrigé la seule colonne citée. 2 entrées `demande_humain` sur 458 au ledger. Ledger seq 456. | Ajouter `demande_humain` au vocabulaire du gabarit et croiser ce vocabulaire avec celui de `ledger.mjs` par la recette du gabarit. |
| RP-22 | majeur | générique | Skill `prompt-analyzer-l99`, mode boucle : une note hors JSON d'un relecteur (« le mot pour mot est en seq 373 ») reprise sans recompte est devenue un bloquant à la passe 2 (40 contre 72) ; la règle de rejet par régression a livré la passe 1, avec 9 majeurs que la passe 2 fermait. Ledger seq 443. | Recompter toute note de relecteur comme un défaut avant de l'intégrer ; sur régression due à un seul défaut créé et recompté, autoriser une passe de reprise qui ne corrige que lui. |

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-17 | bloquant | générique | Ni contre-épreuve ni parcours croisé exigés, et les e2e sautés ne comptent pas : la garde E-097 n'avait que son cas positif (alerte reçue sans rien modifier) ; aucun test ne vérifiait ce que l'approbateur voit d'une mission créée par l'opérateur ; la suite e2e saute en silence sans `PENTEST_E2E_URL`. Troisième revue qui demande les parcours par profil (seq 193, 241, 450) ; rappel du retour seq 245 (lot 20261103c). Ledger seq 455. | Pan `parcours-personas` : matrice objet × profil (qui crée, qui voit, où) et contre-épreuve pour toute exigence de garde, d'alerte ou de confirmation ; nombre d'e2e SKIPPED dans le verdict. |

## digit-ai-forge-design

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-19 | majeur | générique | Critique d'implémentation : la file d'approbation, PASS le 04/11 (seq 415), rend 13/15 avec 25 demandes (V7, V25, bulle de visite dans la page statique), mêmes écarts sur HEAD et sur la branche corrigée, mesurés sur les mêmes données. Ledger seq 457. | Exiger un volume minimal de lignes pour juger un écran de données ; neutraliser la visite guidée dans le rendu statique. |
| RP-20 | mineur | générique | `oracle-textes-application` classe le bouton « Aucun » du panneau de filtre en état vide sans invitation : 4 T4-2 bloquants par écran filtrable, identiques sur HEAD. Ledger seq 457. | Exclure les boutons d'action du composant de filtres de la classe « état vide ». |

## digit-ai-forge-ops

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-21 | mineur | générique | La version servie n'est pas lisible : l'empreinte `VERSION_STATIQUE` servie (`23ea38d71963`) ne correspond à aucun des 25 derniers commits (LF et CRLF recalculés) ; `forge/DOSSIER-MEP.md` cite deux commits servis (l. 10 et 195) ; seule l'étiquette de l'image (`ef30cc7`) le dit. Ledger seq 458. | La chaîne passe le commit à l'image, `/healthz` le rend, le dossier MEP le lit là. |

## La règle qui aurait évité le retour

- `version-servie-illisible` (RP-21) : une instance servie dit le commit qu'elle sert, lisible par une requête ; une session n'a jamais à le reconstituer.
- `note-de-relecteur-integree-sans-recompte` (RP-22) : toute affirmation d'un relecteur, dans son JSON ou hors de lui, se recompte à la source avant d'entrer dans une correction.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le `run_open` seq 449 est parti sans identifiant de run (`forge/ledger.py` consomme `--run`) | rectification seq 452 par `ledger.mjs` | oui, déjà remonté (RP-14 du lot 20261105a) | non remonté de nouveau |
| Des données synthétiques locales portaient un code d'action inventé (`scan_web_passif`), relevé par `oracle-exploitabilite` X3 | remplacé par un code réel (`scan-entetes`) avant la critique | non | erreur de la session, corrigée |
| Le pan `parcours-personas` de forge-tests rendait « sans objet » : le produit ne déclarait aucun profil (ni `personas` au référentiel, ni `forge/matrice-droits.json`) | `forge/matrice-droits.json` déclarée (operateur, approbateur) : pan 2/2 | oui, porté par RP-17 (la forge pourrait refuser un produit à plusieurs comptes de test sans profils déclarés) | remonté |
| Les tests e2e existants créent des missions sur la préproduction à chaque passage (133 brouillons) | nouveaux tests marqués `PENTEST_E2E_ECRITURE` ; anciens à migrer | oui, porté par RP-17 | remonté |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261105a) |

## Garde-fou de plateforme relevé

GFP-005 (stratégie de contrôle d'application Windows) heurté de nouveau le 05/11 : `uv run uvicorn` dans un environnement virtuel neuf (arbre séparé `Produit-86-base-0511`) a échoué sur « Une stratégie de contrôle d'application a bloqué ce fichier. (os error 4551) ». Contournement : `uv run python -m uvicorn …`. Aucun garde-fou nouveau.

## Confirmations positives

- La reproduction par profil dans un navigateur, sur l'instance servie, a tranché ce que la lecture du code laissait ouvert : R2 n'apparaît pas en ouvrant puis quittant une fiche, il apparaît en cochant puis décochant une carte.
- La mesure de référence sur HEAD, avec les mêmes données, a séparé les écarts préexistants de la critique d'implémentation des régressions possibles : aucune régression.

## Ordre recommandé

RP-15 et RP-17 d'abord (bloquants, troisième apparition de la classe), puis RP-16 et RP-18, qui empêchent la récidive, puis le reste.
