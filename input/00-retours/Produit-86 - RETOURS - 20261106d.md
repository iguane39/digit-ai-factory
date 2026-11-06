# Retours forges — Produit-86 — 20261106d

- **Contexte** : sur la consigne « A1 & A2 sur https://Produit-84-dev.pages.dev/ de bout en bout », le porteur a fait jouer le premier job réel du mode client (run `20261106d`). Le job a abouti et ses constats concordent avec une mesure directe. Il a aussi révélé 4 défauts que 21 tests unitaires et le test de mise en production laissaient passer ; ils ont été corrigés d'office au run `20261106e` (`bb6a29a`). L'oracle des textes d'application a jugé la fiche servie en FAIL sur des définitions du glossaire.
- **Références ledger** : `forge\ledger.jsonl` seq 678 et 679 (entrées `type: retour`) ; seq 657 à 660 pour les anomalies ; seq 652 pour la consigne du porteur.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 06/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 06/11/2026 : `todo/CLASSES.json` du pilot, 254 classes, filtré sur `fixture|realis|rejou|faux positif|tooltip|glossaire`.

- **RP-49** se rattache à `oracle-faux-positif`, qui existe déjà.
- **RP-48** n'a pas de classe. La plus proche, `ecran-juge-sur-donnees-de-demonstration`, porte sur le rendu d'un écran, pas sur les réponses qu'un outil lit : RP-48 propose donc la sienne.

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-48 | majeur | générique | Le premier job réel du mode client, sur `Produit-84-dev.pages.dev` (application fermée par Cloudflare Access), a révélé 4 défauts que 21 tests unitaires et le test de mise en production laissaient passer :<br>(1) les constats sont recréés à chaque tour sur la même application ;<br>(2) le bilan du tour reste figé après les décisions de l'approbateur ;<br>(3) pendant le tour sans IA, la fiche dit « le modèle prépare » ;<br>(4) la preuve garde en clair la valeur du cookie de session posé par la cible et le jeton de l'URL de redirection.<br>Les bancs ne jouaient jamais deux tours sur la même mission, ni une réponse de cible réaliste : leurs réponses factices sont des `200` sans cookie. Chaque défaut est reproduit par un test rouge sur `422c0ff` (`backend/tests/test_premier_job_client.py`). Ledger seq 657 à 660 et 679. | Fournir aux produits qui lisent des réponses HTTP un jeu de réponses réalistes : redirection `302` vers une connexion SSO, `Set-Cookie` de session, jeton en paramètre d'URL, page unique qui répond `200` à tout chemin. Ajouter une règle « rejouer deux fois » pour tout traitement d'ingestion. |

## digit-ai-forge-design

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-49 | majeur | générique | `oracle-textes-application` (règle T4-1) juge comme messages d'erreur les définitions d'un glossaire portées par des infobulles (`span role="tooltip"`) et par des attributs `title`. Sur la fiche de mission servie de `pentests-socle:bb6a29a`, il rend FAIL avec 12 constats, dont 1 bloquant (« Un actif listé pour être interdit explicitement… », la définition du déni). Tous portent sur des définitions, aucun sur un message d'erreur. Les 3 textes neufs du run, passés seuls dans un fichier de chaînes, rendent PASS. Ledger seq 676 et 678. | Ne traiter en message d'erreur que `role="alert"`, `.error` et l'état vide déclaré. Tenir `role="tooltip"` et `title` pour des aides, jugées par les règles des aides de champ. |

## La règle qui aurait évité le retour

- `banc-sans-reponse-realiste` (RP-48, classe proposée) : un outil qui lit les réponses d'une cible tierce se teste aussi sur les formes réelles de ces réponses, et tout traitement d'ingestion se rejoue deux fois.
- `oracle-faux-positif` (RP-49) : un oracle se valide sur une fixture conforme qui porte la forme recommandée par sa propre forge, ici le glossaire en infobulle.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 4 défauts du premier job réel | Constats ouverts non recréés, bilan recalculé, message du tour sans IA, caviardage dans l'outil (commit `bb6a29a`). Il y a 4 tests neufs, la suite (593) passe, ainsi que les e2e (35/36) et le test de mise en production (58/58). | oui, la forme du banc | la leçon générique est RP-48 ; le code reste au produit |
| L'outil, anonyme, ne voit que la porte Cloudflare Access de l'application testée | Rien n'est corrigé : c'est une limite déclarée au rapport. Ouvrir l'application à l'outil relève du propriétaire (jeton de service ou règle d'accès). | non : propre à ce produit et à cette cible | reste au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261106c) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- La mesure indépendante, capteur et oracle d'exposition de forge-websec, a confirmé les constats du job sur ses 4 contrôles, sans écart.
- L'oracle statique de forge-websec a situé les constats : ils viennent de la porte Access, pas de l'application, dont le fichier `_headers` passe les 11 règles.
- R-61 bis a vérifié au `run_close` que le run déclaré prêt portait ses deux contrôles d'usage verts.
