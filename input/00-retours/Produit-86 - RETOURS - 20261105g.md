# Retours forges — Produit-86 — 20261105g

- **Contexte** : clôture du run `20261105c-evolution-tests-e2e-manquants` : 11 tests de bout en bout manquants écrits (D-475 a), préproduction redéployée sur la lettre « 476a » du porteur, 33 tests de bout en bout sur 34 passés en préproduction (1 sauté : base neuve, joué en local), 4 défauts réels du produit trouvés par ces tests et par le contrôle d'hygiène, chacun corrigé avec son test rouge puis vert.
- **Références ledger** : `forge\ledger.jsonl` seq 568, 569 et 572 (entrées `type: retour`) ; seq 573 pour les défauts restés au produit ; retours antérieurs cités : RP-24 (faux positif de forge-tests), RP-27 à RP-33 (lot 20261105e).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 : `todo/CLASSES.json` du pilot, 241 classes, filtré sur `boucle|attente|zéro|course|arrêt d'urgence|kill|déploi|préprod|GO humain|staging`. Aucune classe ne décrit un test dont la boucle d'assertions tourne zéro fois, un interrupteur d'arrêt jamais rejoué en course, ni un GO humain exigé pour un redéploiement local réversible. `etape-de-deploiement-hors-de-la-chaine` ne s'applique pas à RP-38 : le redéploiement passe bien par la chaîne du produit. Chaque retour propose donc sa classe.

## digit-ai-forge-tests

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-36 | majeur | générique | Deux tests de bout en bout passaient pour verts sans rien vérifier. Le premier filtrait les cartes d'approbation sur un bouton replié, donc caché : sa boucle tournait sur zéro carte, et 0 action en attente était approuvée par tour. Le second attendait un libellé jamais servi, tournait 120 s à vide, puis lisait le message quand même. forge-tests ne voit ni une boucle d'assertions exécutée zéro fois, ni une attente bornée qui expire sans échouer. Mesure : 135 s ramenées à 19 s, 0 action approuvée par tour ramenée à 1, dans `backend/tests/e2e/test_parcours_profils.py` et `test_parcours_complet.py`. Ledger seq 568. | Un pan, ou une règle d'écriture des tests, qui refuse une boucle d'assertions exécutée zéro fois, et une attente bornée qui se termine sans que sa condition soit vraie. |

## pilot (sécurité, mise en production)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-37 | majeur | générique | Un défaut de l'arrêt d'urgence n'était couvert par aucun oracle : un job autorisé avant l'arrêt de sa mission démarrait 0,3 s après lui (audit de préproduction : arrêt à 16:26:15.760, début du job J-55cb25a2 à 16:26:16.07). forge-agents-security juge l'injection et les appels d'outils du modèle, forge-websec l'exposition web ; seul un test de bout en bout écrit à la main l'a trouvé. Ledger seq 569. | Un oracle de forge-agents-security qui rejoue l'arrêt d'urgence pendant un tour d'agent, et vérifie qu'aucun job ne démarre ni ne finit son travail après lui. |
| RP-38 | majeur | générique | Le redéploiement de la préproduction LOCALE (conteneurs Docker du poste, réversible par l'image précédente conservée) a été posé en décision humaine D-476, alors que la demande en cours en dépendait. Le porteur : « cette décision devrait être validée automatiquement, puisque nous sommes sur un environnement local et que cette màj est nécessaire pour finaliser ma demande ». La route « Déploiement » du `CLAUDE.md` produit (GO humain sur `DOSSIER-MEP.md`) ne distingue pas la préproduction locale de la production. Un tour humain de plus. Ledger seq 572. | Dans `CLAUDE-PRODUIT-DETAIL` et le gabarit `CLAUDE.md` produit, réserver le GO humain à la production et aux environnements partagés ou distants. Un redéploiement de la préproduction locale par la chaîne du produit, réversible, se fait d'office quand la demande en cours en dépend, et se dit au bloc 4. |

## La règle qui aurait évité le retour

- `assertion-de-test-executee-zero-fois` (RP-36) : un test qui n'a rien vérifié échoue, il ne passe pas.
- `interrupteur-d-arret-sans-oracle-en-course` (RP-37) : un interrupteur d'arrêt se prouve pendant une action en cours, pas seulement au repos.
- `go-humain-exige-pour-un-geste-local-reversible` (RP-38) : le GO humain porte sur l'irréversible et le partagé, pas sur la préproduction du poste.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les constats d'un job de l'agent IA tirés par la page de la mission restaient sans interprétation | `Socle._surveiller` range les constats neufs par agent demandeur, et le suivi les relit sous verrou (commit `8f55d8e`, test rouge puis vert) | non : propre à l'ingestion de ce produit | reste au produit, parce que la cause est sa propre conception de l'ingestion ; consigné au ledger seq 573 |
| Le conteneur d'un job tué ou expiré restait sur le poste (`pentests-job-J-010ae819`, Exited 137) | l'exécuteur demande au lanceur l'arrêt puis le retrait (commit `2299897`, test rouge puis vert) | oui, mais déjà couvert | reste au produit, parce que le contrôle d'hygiène proposé au lot 20261105e (classe `inventaire-de-composants-sans-controle-de-fraicheur`) est celui qui l'a trouvé ; consigné au ledger seq 573 |
| forge-tests rend PARTIEL sur la page « adresse inconnue » voulue par un test | aucune correction côté produit | oui | déjà remonté (RP-24) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261105f) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Le contrôle d'hygiène du produit (E-128), lancé avant chaque déploiement, a trouvé un vrai résidu : un conteneur de job laissé sur le poste. C'est la règle proposée au lot 20261105e, prouvée sur un cas réel.
- Les 11 tests de bout en bout écrits sur l'étude de couverture ont trouvé 4 défauts réels du produit, dont 2 touchent l'arrêt d'urgence, avant que le porteur ne les voie.

## Ordre recommandé

RP-37 d'abord (sécurité), puis RP-36, puis RP-38.
