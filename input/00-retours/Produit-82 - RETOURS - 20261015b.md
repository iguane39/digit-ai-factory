# Retours forges — Produit-82 — 20261015b

> **Note de réception du pilot (15/10/2026, R-49)** : les familles proposées `recette` et `outillage` n'existent pas au référentiel des classes. RT-15 garde sa clé `recette-sans-parcours-reel-dans-le-navigateur` en famille `regle-morte` (une recette verte sur ce qu'elle existe pour refuser). RT-16 et RT-17 se rattachent à la classe existante `oracle-faux-positif` : dans les deux cas, l'outil rend un rouge sur ce qui marche.

- **Contexte** : première connexion humaine au portail Produit-82 sur Railway, après une restitution qui annonçait les parcours des personas au vert ; brief `Digit-AI - Brief Gateway LLM - Fiche produit et socle agentgateway - 20261014b`, run `Produit-82-20261014-ouverture`.
- **Références ledger** : `forge\ledger.jsonl` seq 73, 74, 75, 76
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-15

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le retour porte sur ce qu'une recette doit avoir joué avant qu'une restitution dise « fonctionnel ».

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-15 | bloquant | générique | Le 15/10/2026 à 09:35, une restitution annonçait 5 parcours de personas au vert, en local et sur Railway. La première connexion humaine au portail Railway a rendu la page « Application failed to respond » du proxy. Un identifiant inconnu faisait planter la branche anti-énumération (`TypeError`), et la connexion se coupait sans réponse. Les tests appelaient le portail par le réseau privé, en http, avec des saisies attendues seulement. Question humaine : « Est-ce que l'application a été testée ? Vu l'erreur basique, on peut se demander. » Le correctif a ajouté un test de robustesse (chaque route, 3 profils, saisies hostiles) et un parcours en navigateur réel sur l'adresse publique. Ces 2 tests ont reproduit l'incident (rouge) avant correctif. Ledger seq 73 et 74. **RT-15** : clé proposée `recette-sans-parcours-reel-dans-le-navigateur`. | La recette d'un produit à interface joue chaque parcours dans un vrai navigateur, sur l'adresse publique de l'instance déployée, avec au moins une saisie inattendue par formulaire. Une restitution ne dit « fonctionnel » qu'avec la trace de cette exécution. |

## forge-tests (`digit-ai-forge-tests`)

Le retour porte sur le périmètre que l'audit juge.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-16 | majeur | générique | Le 15/10/2026, `forge_tests` lancé sur la racine du produit a inventorié et jugé `vendor-check/`, clone du code amont ignoré par git et hors du produit. Il en a tiré 493 constats, presque tous sur les tests et l'interface amont. Seule la mutation accepte une exclusion (`FORGE_TESTS_MUTATION_EXCLUT`). L'audit a dû être rejoué sur une copie propre du dépôt (`git worktree`). Ledger seq 75. **RT-16** : clé proposée `audit-hors-perimetre-du-produit`. | Exclure par défaut ce que git ignore, ou offrir une exclusion générale, nominative et publiée au rapport. |
| RT-17 | majeur | générique | Le 15/10/2026, le pan qualif n'a pas ouvert de session sur le portail. Son sélecteur de soumission, « button[type=submit], input[type=submit], button », rend le premier bouton dans l'ordre du DOM. Ici, c'est le bouton de bascule de thème de l'en-tête (`type=button`), placé avant le formulaire. Les 5 routes de l'espace ont été jugées refusées, alors que le même compte se connecte dans un navigateur (parcours en navigateur, 24 étapes PASS). Ledger seq 76. **RT-17** : clé proposée `mire-soumise-par-le-mauvais-bouton`. | Chercher le bouton de soumission dans le formulaire qui porte le champ mot de passe, en préférant `type=submit`. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Identifiant inconnu : `bcrypt.checkpw` recevait une chaîne au lieu d'octets, et l'exception coupait la connexion | empreinte factice en octets ; toute exception rend une page d'erreur ; test `P-ROB` et parcours navigateur rouges avant, verts après | oui, tout serveur HTTP Python sans filet d'exception | corrigé au produit |
| Un corps annoncé plus long qu'envoyé retenait le serveur sans réponse | lecture bornée à 10 secondes, réponse 400 | oui | corrigé au produit |
| Aucun lien d'évitement sur les 9 routes du portail (RGAA 12.7), relevé par le pan clavier | lien « Aller au contenu » en tête de page | oui, tout gabarit de page à navigation | corrigé au produit |
| 3 modèles désignés par un alias mouvant (`mistral-small-latest`, `gpt-4o-mini`, `claude-haiku-4-5`), relevé par le pan prompts | versions datées dans `config/fournisseurs.json` | non | corrigé au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le parcours navigateur a reproduit l'incident sur la version déployée avant correctif (502 sur l'identifiant inconnu), puis l'a vu vert après redéploiement : 24 étapes sur 24.

## Ordre recommandé

1. RT-15 : un humain a trouvé en un clic ce que 39 tests n'avaient pas joué.
2. RT-16 : un audit noyé sous 493 constats d'un autre code ne juge pas le produit.
3. RT-17 : un pan qui ne se connecte pas juge refusées des pages qui marchent.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit une question humaine. La règle qui l'aurait évité : avant de dire « fonctionnel », la recette joue chaque parcours dans un vrai navigateur, sur l'adresse publique, avec des saisies inattendues. Classe proposée : **RT-15** : `recette-sans-parcours-reel-dans-le-navigateur`, famille `recette`, libellé « Une recette verte n'a jamais joué le parcours d'un utilisateur dans un navigateur sur l'adresse publique de l'instance ».
