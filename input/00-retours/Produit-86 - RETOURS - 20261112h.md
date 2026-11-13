# Retours forges — Produit-86 — 20261112h

- **Contexte** : run `20261112a-comptes-et-ecritures`. Produit-86 est mis au format d'oracle-dast 0.2.0 (forge-websec ebada36) pour jouer les sondes actives du lot 3 sur le poste.
- **Références ledger** : `forge\ledger.jsonl`, seq 986 et 987 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 12/11/2026 est `todo/CLASSES.json` du pilot.

- RP-70 se rattache à `oracle-chemin-prescrit-inoperant-sur-sa-cible` : la forme `zap.bat` que l'oracle prescrit sur Windows ne se lance pas sur le poste même où elle est prescrite.
- RP-71 se rattache à `oracle-chemin-prescrit-inoperant-sur-sa-cible` : la borne de débit que l'oracle applique rend son propre délai fixe intenable, et le balayage finit sans rapport.

## digit-ai-forge-websec

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-70 | bloquant | générique | `oracles/oracle-dast.mjs` 0.2.0, ligne 462, lance ZAP par `spawnSync(commande, argv, { shell: false })`. Sur Windows, la forme prescrite est `zap.bat`. Node 24 refuse de lancer un `.bat` ou un `.cmd` sans shell. Mesuré le 12/11/2026 sur le poste de Produit-86, Node v24.16.0 : `spawnSync("essai.bat", ["-v"], { shell: false })` rend `status: null, error: EINVAL`. L'oracle rend alors SKIP avec « ZAP lancé mais aucun rapport exploitable produit : sortie vide » : le message dit « lancé » et tait `r.error`. De plus, `zap.bat` exige le dossier de ZAP comme dossier courant, et l'oracle ne passe ni `cwd` ni `-dir`. Les sondes actives du lot 3 de Produit-86 ne peuvent pas partir. | Lancer `zap.bat` par `cmd.exe /d /s /c` avec les arguments échappés, ou par `java -jar zap-<version>.jar` ; passer `cwd` au dossier de ZAP et `-dir` vers un dossier de travail désigné ; citer `r.error.code` dans le SKIP ; ajouter au self-test un cas `.bat` réel sur Windows. |
| RP-71 | majeur | générique | La même ligne 462 borne ZAP à 30 min (`timeout: 1800000`), quel que soit `debit_max_requetes_par_seconde`. Le mandat de Produit-86 borne la charge à 10 requêtes par minute : l'oracle espace alors 2 requêtes de 6 025 ms, soit environ 299 requêtes en 30 min. Le banc de forge-websec en a mesuré 891 pour une cible de 4 routes. Le balayage serait coupé avant son rapport, et finirait en SKIP. Déduit du code et des chiffres du CHANGELOG, pas encore mesuré sur une cible réelle. | Dériver le délai du débit et d'un plafond de requêtes déclaré, ou accepter `duree_max_minutes` dans l'autorisation (bornée par la fenêtre) ; quand le délai coupe ZAP, le dire dans le SKIP. |

## La règle qui aurait évité le retour

- `oracle-chemin-prescrit-inoperant-sur-sa-cible` (RP-70) : la recette de l'oracle joue la forme qu'il prescrit sur chaque plateforme qu'il nomme, avec le vrai binaire.
- `oracle-chemin-prescrit-inoperant-sur-sa-cible` (RP-71) : une borne que l'oracle impose (débit) se combine à ses autres bornes (durée) dans sa recette, au débit le plus bas qu'il accepte.

## Remarques restées au produit

| Réf. ledger | Gravité | Remarque | Motif du maintien au produit |
|---|---|---|---|
| ce lot | majeur | La page `Produit-84-dev.pages.dev` est derrière Cloudflare Access, qui exige 2 en-têtes pour un jeton de service ; oracle-dast n'en porte qu'un. Produit-86 refuse l'export pour cette cible (`ACCES_DEUX_EN_TETES`). | Cloudflare documente une option d'application qui lit le jeton en un seul en-tête : c'est un réglage de Produit-84, à demander entre produits. Généralisable : non. |
| ce lot | mineur | Le PEP de Produit-86 accepte encore une demande de sondes sur la page derrière Cloudflare Access ; son job attendrait jusqu'à la fin de la fenêtre. | Évolution du produit. Généralisable : non. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261109b, 20261112e et 20261112g) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé : le refus de Node 24 de lancer un `.bat` sans shell est un comportement documenté de la plateforme d'exécution, que RP-70 demande à l'oracle de respecter ; aucun refus n'a été contourné.

## Confirmations positives

- Le mode actif d'oracle-dast 0.2.0 a validé du premier coup le fichier d'autorisation exporté par Produit-86 : en-tête `apikey` lu d'une variable d'environnement et masqué, débit de 0,166 requête par seconde, 18 exclusions.
- Avec le ZAP simulé de forge-websec, les exclusions en préfixes écartent bien une fonction de la famille `cdc_remplacer_` absente du fichier.
