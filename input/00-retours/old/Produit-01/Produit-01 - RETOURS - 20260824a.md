# Retours forges — Produit-01 — 20260824a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : correctif du 24/08 sur l'ajout de documents d'Produit-01 (PR 3680, commit de
  fusion `d00b3fc`). Un utilisateur signale « une erreur sur l'ajout de fichiers » avec une
  capture d'écran ; le message affiché est **« Une erreur est survenue. Réessayez. »**
- **Références ledger** : `forge\ledger.jsonl` seq 55, 56 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-24

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-19 consommés). Ce lot porte
RG-20 et RG-21.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## La mesure qui porte ce lot

Le message affiché n'était pas le message de l'erreur. C'était le message **par défaut**,
affiché parce que la cause avait été perdue une couche plus bas :

```ts
if (!resp.ok) throw new Error(`upload failed: ${resp.status}`);   // erreur NUE
```

`errorKey()` ne reconnaît que le type `ApiError`. Une erreur nue retombe donc sur
`error.generic`. **Sept causes distinctes** arrivaient à l'écran sous une seule phrase :

| Cause réelle | Ce que l'utilisateur devait faire | Ce que l'écran disait |
|---|---|---|
| format non accepté (422 `unsupported_type`) | choisir un autre fichier | « Réessayez » |
| document > 100 Mo (422 `too_large`) | alléger ou découper | « Réessayez » |
| 11ᵉ document (422 `too_many`) | retirer un document | « Réessayez » |
| total > 1 Go (422 `total_too_large`) | retirer ou alléger | « Réessayez » |
| refus antivirus (422 `antivirus`) | ne pas insister | « Réessayez » |
| droits insuffisants (403) | demander l'accès | « Réessayez » |
| coupure réseau | **réessayer** | « Réessayez » |

**Dans six cas sur sept, l'instruction affichée était fausse.** Elle ne se contente pas de ne
rien dire : elle demande de rejouer exactement le geste qui ne peut pas aboutir, et conduit
l'utilisateur à conclure que l'application est cassée.

### Le fait qui rend ce retour générique, et non une anecdote produit

**Le même message a déjà masqué deux défauts sans rapport, et envoyé deux diagnostics dans la
mauvaise direction.** Dans le lot de recette du 18/08 :

- la **rubrique 18** rapporte « XLSX produit *Une erreur est survenue. Réessayez.* » — classée
  comme **under-build** d'un format exigé au cahier (retour RG-17) ;
- les **rubriques 27 et 28** rapportent « *Une erreur est survenue* puis reconnexion après F5
  avec perte du brouillon » — classée comme **lacune de spécification** sur le cycle de vie de
  session (retour RG-18).

Deux causes racines différentes, deux forges cibles différentes, **le même écran**. Le message
générique ne dégrade donc pas seulement l'expérience : il **corrompt le tri**. Chaque anomalie
qu'il recouvre doit être rouverte par lecture de code, et le 24/08 il a fallu vérifier que la
détection de type acceptait bien XLSX (`filetype` 1.2.0, testé sur conteneurs OOXML réels)
uniquement pour **éliminer** une piste que le message aurait dû exclure d'emblée.

### Ce qu'aucune porte ne voyait

Au moment du défaut, le produit passait `eslint`, `tsc -b`, 121 tests frontend, 395 tests
backend, `ruff`, `mypy`, et les seuils de couverture. La ligne fautive **était couverte** —
par les tests du chemin nominal. Aucune porte existante ne pose la question : *quand cet appel
échoue, l'utilisateur apprend-il quoi faire ?*

---

## development (`digit-ai-forge-development`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-20 | bloquant | **La cause d'une erreur est jetée à la frontière client, et le message par défaut porte une instruction fausse.** `frontend/src/api/demandes.ts` levait `new Error("upload failed: " + resp.status)` là où le reste du client lève une `ApiError` typée. Le mappeur `errorKey()` (`frontend/src/api.ts`) ne reconnaissant que le type, les sept causes du tableau ci-dessus arrivaient à l'écran sous « Une erreur est survenue. Réessayez. » — instruction fausse dans six cas sur sept. **Le point structurel** : cet appel est le SEUL qui ne pouvait pas passer par le client partagé `apiFetch`, parce qu'un envoi `multipart/form-data` interdit d'imposer le `Content-Type` (le navigateur doit poser sa frontière). **L'exception au client partagé est exactement l'endroit où le défaut a poussé** — et c'est vrai de tout produit : téléversement, téléchargement de binaire, flux, WebSocket. Aucune porte ne l'a vu : la ligne était couverte par les tests du chemin nominal, et `eslint`, `tsc`, `ruff`, `mypy`, les 516 tests et les seuils de couverture passaient tous. | Un **gate « erreurs adressables »** chez development, mécanisable en trois contrôles statiques et un dynamique : (1) dans un module client HTTP, un `throw new Error(...)` sur une réponse en échec est un défaut — l'erreur doit porter le type du produit ; (2) la branche par défaut d'un mappeur d'erreurs ne doit pas contenir de verbe à l'impératif (« réessayez », « retry ») : un défaut ne s'énonce pas comme une consigne quand la consigne peut être fausse ; (3) **contrôle bidirectionnel du contrat de codes** — tout code d'erreur émis par l'API doit avoir une entrée dans la table de correspondance de l'interface, et réciproquement. Le troisième est le seul qui casse en silence des deux côtés pris séparément, et c'est celui qui a été écrit à la main ici (`backend/tests/test_documents_codes_refus.py::test_les_codes_sont_ceux_que_le_client_connait`). Produit-01 fournit le corpus : 7 codes, une table `CLES_PAR_CODE`, 20 tests. |

## tests (`digit-ai-forge-tests`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-20 *(cible secondaire)* | bloquant | Voir ci-dessus. Le volet tests : **la couverture ne distingue pas un chemin d'erreur exercé d'un chemin d'erreur atteint.** La ligne `throw new Error(...)` était comptée comme couverte parce qu'un test passait par la fonction ; aucun test n'observait ce que l'échec **produit**. Le correctif a demandé 20 tests écrits à la main — un par code de refus, un pour la coupure réseau, un pour un corps illisible (une passerelle qui répond du HTML ne doit pas transformer une erreur lisible en exception de parsing), un pour un code futur inconnu du client. | Une exigence de `cat-tst-*` : **un test par branche de refus d'un appel exposé à l'utilisateur**, vérifiant la CLÉ DE MESSAGE obtenue et non seulement le fait qu'une erreur est levée. Générable : la liste des refus est celle des codes émis par l'API, déjà énumérable par le contrôle (3) de RG-20. |

## conception (`digit-ai-forge-conception`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-21 | majeur | **Une exigence dit ce qui est refusé, jamais ce que l'utilisateur apprend du refus.** Le cahier Approval §09 énumère les formats acceptés, la borne de 100 Mo, le plafond de 10 documents et le total d'1 Go — quatre refus **spécifiés**. Il ne dit nulle part ce que l'application affiche quand l'un survient, ni quel geste elle indique. Le développeur a implémenté exactement ce qui était écrit : les quatre refus existent côté serveur, avec leurs messages en anglais destinés aux journaux, et rien ne demandait de les rendre lisibles. C'est **le même patron que RG-18** (déclencheur asynchrone sans clause de réponse observable), appliqué cette fois aux refus : une contrainte énoncée sans sa contrepartie observable. Coût mesuré : 5 clés × 7 langues à rédiger après coup, un correctif transverse en trois couches, et deux anomalies antérieures mal classées (rubriques 18, 27-28) parce que leur symptôme était indiscernable. | Une **exigence-type obligatoire** portée par `cat-con-03` (Rédiger les exigences), déclenchée par le vocabulaire du refus — « accepté », « au plus », « ne doit pas dépasser », « rejeté », « interdit » : toute exigence qui pose une limite doit énoncer (a) ce que l'utilisateur voit quand la limite est atteinte, et (b) le geste qui le sort de la situation. Mécanisable dans l'oracle `ears` au même titre que RG-18 : une exigence qui pose une contrainte sans clause de restitution est incomplète. Règle de rédaction associée : **un message d'erreur par défaut ne porte pas d'instruction** — « réessayez » n'est juste que pour les erreurs transitoires, et une instruction fausse coûte davantage qu'une absence d'instruction. |

## Confirmations positives

- **Le typage de l'erreur avait été fait, et bien fait — c'est l'exception qui a échappé.**
  `ApiError` existe, porte son statut, expose une `messageKey` et distingue déjà six
  situations, dont la perte de connexion. Le patron était juste ; il n'a pas été appliqué au
  seul appel qui ne pouvait pas emprunter le client partagé. C'est ce qui rend le gate proposé
  en RG-20 étroit et donc réaliste : il n'y a pas de doctrine à inventer, seulement à vérifier
  qu'aucune sortie ne contourne celle qui existe.
- **Le test de parité des catalogues de langue a fait son travail sans qu'on le lui demande.**
  Les 5 nouvelles clés ont dû être écrites dans les sept langues, sous peine d'échec
  mécanique (`frontend/src/i18n/i18n.test.tsx`, « les sept langues portent exactement le même
  jeu de clés »). Aucune décision, aucun rappel, aucun oubli possible. C'est le modèle de ce
  que le contrôle bidirectionnel de codes demandé en RG-20 doit être.

## Ordre recommandé

1. **RG-20, contrôle (3) seul** — le contrat bidirectionnel de codes. C'est la partie qui casse
   en silence des deux côtés pris séparément, donc celle qu'aucune relecture ne rattrape, et
   elle est déjà écrite à la main sur Produit-01 : il y a un corpus, pas une conception à faire.
2. **RG-20, contrôles (1) et (2)** — analyse statique pure, sans exécution. Le (2) — « pas
   d'impératif dans un message par défaut » — est le moins coûteux du lot et porte sur la
   phrase exacte qui a coûté ce lot.
3. **RG-21** — durcissement de `cat-con-03`, sans dépendance aux précédents. À embarquer avec
   RG-18 si celui-ci est ouvert : c'est la même mécanique d'exigence-type déclenchée par le
   vocabulaire, sur un autre déclencheur.
4. **Volet tests de RG-20** — dépend du contrôle (3), qui fournit la liste des refus à couvrir.
