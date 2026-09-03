# Retours forges — trois contrôles du pilot sans consommateur de leur propre remède — 20260902a

- **Contexte** : traitement du lot de travaux `pilot - TRAVAUX - 20260901a` (TF-0626, TF-0654,
  TF-0674, TF-0676, TF-0682, TF-0741) par la session produit du 01-02/09/2026.
- **Références ledger** : `forge\ledger.jsonl` seq 75, 79, 82 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

## Contrôle de complétude

Depuis la remise du lot précédent (20260901b, qui portait la seq 76), le ledger du produit
porte **trois** entrées `type: retour` : les seq 75, 79 et 82. Ce lot en porte les trois
candidatures. À noter : la seq 75 (20:47:31Z) est ANTÉRIEURE à la compilation du lot
20260901b, écrit par une session concurrente qui ne l'a pas vue — son contrôle de complétude
disait « une entrée : la seq 76 » alors que la 75 existait déjà. Rien n'est perdu : elle
voyage ici, et la classe du défaut (écriture concurrente du ledger) est précisément le
retour RT-67 ci-dessous.

## pilot (`digit-ai-factory`)

Le traitement du lot de travaux a révélé trois endroits où un contrôle du pilot prescrit un
geste — ou rend un verdict — dont rien ne consomme le résultat : le produit obéit, et le
constat revient inchangé.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-66 | majeur | générique | TF-0654 demande de DÉCLARER la racine web « sous une ligne `racine_web:` du frontmatter de `docs/projet/PARAMETRAGE.md` », critère de clôture : « `relever-heritage.mjs` cesse de compter cet artefact hors racine ». Déclaration faite le 01/09 ; le relevé rejoué rend toujours « 2 HORS RACINE ». Preuve : `grep racine_web` sur tout `c:\dev\digit-ai-factory` ne trouve que le gabarit d'émission (`todo/emettre-travaux.mjs:248`) et des archives — AUCUN script ne lit la déclaration demandée. Le critère de clôture est hors de portée du produit. | faire lire `racine_web` par `relever-heritage.mjs` (et l'oracle R-47) : un artefact `presence` trouvé sous la racine web déclarée compte conforme |
| RT-67 | majeur | générique | R-42 : deux sessions produit légitimes ont écrit au ledger dans la même fenêtre (01/09, 20:47-20:56Z), chacune calculant son `seq` depuis la même queue → deux seq 76 et deux seq 77, ts exacts. L'oracle prescrit « ajouter une entrée `type: rectification_horodatage` nommant les seq, le ts et la cause » ; l'entrée a été ajoutée (seq 78, aucune ligne réécrite) et l'oracle rend TOUJOURS le même FAIL « seq 76 là où 78 était attendu », avec le même message qui prescrit d'ajouter l'entrée déjà présente. Le remède prescrit ne solde pas le défaut qu'il vise. | (1) l'oracle CONSOMME les rectifications : un écart nommé par une rectification devient déclaré, pas fautif ; (2) le gabarit ledger prévoit l'écriture concurrente — deux sessions le même jour est le cas normal ; un seq attribué depuis la queue sans verrou collisionne par construction (piste : ts comme clef d'ordre, seq informatif) |
| RT-68 | mineur | générique | CI3 (`oracle-controles-injoignables`) rend PASS « chaque oracle déclare ses codes de sortie » sur ce dépôt, où DEUX contrôles (`build/stats/check-ecarts.py`, `check-ht-ttc.py`) n'ont AUCUN `sys.exit` conditionnel : leurs codes sont déclarés en commentaire mais aucun chemin d'échec n'existe — ils ne peuvent que crasher en traceback sur données absentes. Découvert le 02/09 en écrivant les recettes double-sens de TF-0682 : le sens rouge de ces deux contrôles n'existe pas. Être déclaré n'est pas être rendu. | CI3 vérifie qu'au moins une sortie non-zéro CONDITIONNELLE existe dans la source, ou déclare cette limite en `non_juge` |

## Remarques restées au produit

Ce que le produit a corrigé chez lui sans le remonter, chacune avec son verdict de
généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les scripts de capture photographiaient une page disparue (`gite-brittany.html`, supprimée à la localisation des identifiants) : le serveur de fixture rendait un 404 silencieux et la « pleine page » sortait blanche en 1440 × 900 | page réelle substituée + échec bruyant sur tout statut non-200 dans les deux scripts | non | la classe (verdict visuel sur capture d'une page inexistante) est déjà fermée par W2/W4 de l'oracle du pilot — c'est W4 qui l'a attrapée ici, voir Confirmations positives |
| `check-ecarts.py` et `check-ht-ttc.py` sans verdict conditionnel | limite documentée en tête de leurs recettes (`build/tests/`), sens rouge borné à « ne conclut pas à tort quand il ne peut pas mesurer » ; vrai verdict à donner côté produit | oui | la classe (un contrôle qui déclare ses codes sans chemin d'échec) est REMONTÉE : RT-68 ci-dessus |
| `seo/cadrage.md` (15/08) cadre encore la mission sur `Produit-02.fr` alors que la production est `www.Produit-02.com` depuis le 25/08 | non corrigée — consignée au reste-à-faire du produit (rejouer le cadrage après migration de domaine) | non | dérive de document propre à l'historique de ce produit ; la classe « fiche que rien ne confronte à ses sources » est déjà au registre (RT-40) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque (`gabarits\documents\`) sur ce
lot — les pièces produites sont des recettes, des scripts de capture, des données de
campagne et des entrées de console, jugés par les oracles du produit et ceux du pilot.

## Confirmations positives

- **W4 (`oracle-verdict-visuel`) a attrapé un vrai défaut dès son premier usage sur ce
  produit** : la « pleine page » blanche de 1440 × 900 issue du 404 silencieux — exactement
  la signature que la règle vise. Le correctif de la forge tient en conditions réelles.
- **La redescente automatique R-47 a fonctionné** : `hook-ouverture.mjs` a recopié
  `forge/RESTITUTION.md` et `forge/retours/GABARIT-LOT-RETOURS.md` divergents à l'ouverture
  de session, AVANT tout traitement — TF-0626 était résorbé sans geste du produit.
- **`oracle-travaux.mjs` PASS 5/5 à l'arrivée du lot** ; le lot était complet, borné, ordonné
  et motivé — aucun aller-retour n'a été nécessaire pour le comprendre.
- **`empreinte.mjs`/`verif-prod.mjs` (RT-60) tiennent la propriété « change dès que n'importe
  quoi change »** : test négatif joué le 01/09 sur un fichier quelconque, ÉCHEC rendu dans
  les deux sens en nommant les deux empreintes (preuve :
  `forge/etapes/TF-0674-test-negatif-20260901.md`).

## Ordre recommandé

1. **RT-66 d'abord** : il supprime deux constats « hors racine » à CHAQUE relevé de CE
   produit, et la classe vaut pour tout produit dont la racine web n'est pas la racine du
   dépôt — le contrôle indécis qui revient s'apprend à être ignoré, c'est le lot lui-même
   qui le dit.
2. **RT-67 ensuite** : l'écriture concurrente du ledger est le cas normal d'un produit
   actif ; tant qu'elle n'est pas prévue, chaque collision coûte un FAIL R-42 incurable.
3. **RT-68 enfin** : mineur, mais il ferme un faux vert de CI3 — le genre de règle qui
   rassure au lieu de juger.
