# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20261001h

- **Contexte** : septième retour humain du 01/10/2026, sur le message remis à l'exploitant de production. Il refond la forme des demandes posée le matin (lot `20261001c`, `RA-59`), et rappelle une règle du porteur déjà remise à la factory le 15/09 (`RT-15`).
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026, au sas d'arrivée du pilot

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — la forme des demandes, refondue par l'humain, et la tournure « Ce que… » qui passe les contrôles

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-65 | majeur | produit+générique | **La forme des demandes de `RA-59` est refondue.** Le commanditaire, vers 15h20, sur le message remis à l'exploitant : « Change "Ce que je demande" par "Prochaines étapes" + ne dis pas ce qui ne sera pas fait. Donc pas "Ni contrôles, ni...". Change "Pourquoi" par "Statut et impacts des actions" + explique succinctement pourquoi il y a un identifiant provisoire et ce que ça provoque. Et remplace étage par étape. Supprime le paragraphe "Ce que cela permet" […] Change "Ce qui se passera ensuite" par "Etapes suivantes" + N'utilise pas le terme "commanditaire", utilise l'infinitif avec "Ouvrir l'adresse..." et mettre la vraie adresse […] Change "Vérification" par "Vérification finale" ». La forme de `RA-59` (5 parties, remise le matin) disait aussi ce que l'objet ne permet pas : le commanditaire l'avait déjà refusé. Le contrôle du produit refuse le message de 14h25 sur 13 écarts, et admet sa version corrigée | (1) Remplacer la forme de `RA-59` par 4 parties : Prochaines étapes ; Statut et impacts des actions ; Étapes suivantes ; Vérification finale. (2) Ajouter 5 exclusions : la tournure « Ce que… » ; la liste des gestes qui n'auront pas lieu (« ni …, ni … », « rien de plus », « sans secret ») ; « le commanditaire » comme sujet d'une étape, l'étape s'écrivant à l'infinitif ; une adresse abrégée ; « étage » au lieu d'« étape ». (3) Remplacer « le geste ou le compte imposé » par « un compte imposé, ou une commande à jouer avec un compte personnel » : pour une demande d'exécution, les gestes sont la demande |
| RA-66 | majeur | générique | **`RT-15` ne mord que sur les titres.** La consigne de restitution l'enfreint elle-même. Le commanditaire, vers 15h20 : « Et j'avais demandé à ne plus utiliser la formulation "Ce que..." ». La règle est remise à la factory depuis le 15/09 (lot `Produit-64 - RETOURS - 20260915a`, « Arrête d'utiliser le terme "Ce que" ») et jouée par la famille `annonce-nominalisee`. Mesuré le 01/10 : `oracle-ecriture` rend `PASS` sur un témoin « Ce que je demande : … » hors titre. Il ne voit pas non plus les parties « Ce que je demande » et « Ce que cela permet » d'une demande écrite en bloc de texte. Et la consigne de restitution impose la tournure : `S53` refuse toute étape de guide qui ne se clôt pas par « ce que vous devez voir » (`/ce que vous (?:devez\|allez\|devriez) voir/`). Les 3 restitutions de ce produit à guide, ce jour, la portent 6 fois | (1) Étendre `annonce-nominalisee` au corps du texte et aux blocs de texte destinés à un lecteur humain (demande, prompt), pas seulement aux titres. (2) Réécrire `S53` sur une formule sans « Ce que », par exemple « Résultat attendu : … », et l'accepter seule. (3) Mesurer le corpus avant mise en service, comme pour chaque règle |

## La règle qui aurait évité le retour

`RT-15` existait depuis le 15/09, et elle n'a pas évité `RA-65` : elle ne juge que les titres, et la consigne de restitution prescrit la tournure qu'elle interdit. Aucune règle ne fixait la forme en 4 parties : elle naît de ce retour.


> **Note de réception du pilot (01/10/2026, avant ingestion).** Le sidecar propose une classe que le référentiel `todo/CLASSES.json` ne porte pas encore ; elles sont nommées ici, comme l'exige l'ingestion (TF-1128). La ligne 1 citait `demande-tierce-hors-forme`, proposée par TF-1517 et pas encore créée : elle passe en `classe-a-creer` avec la même proposition :
> - `demande-tierce-hors-forme` (famille `restitution-forme`) : Une demande remise a une equipe tierce ne suit aucune forme fixee : elle omet pourquoi l objet debloque la situation, ce qu il permet et la verification qui fera foi, ou elle porte un nom de personne, une demande de droits d administration, la situation d un autre projet ou une ligne sans valeur.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le message remis à l'exploitant à 14h25 | réécrit en 4 parties ; republié au même endroit, dans la demande de fusion 4025, à 15h26 | oui | remonté ci-dessus en `RA-65` |
| Le contrôle des demandes ne voyait pas « étage » | frontière Unicode : en JavaScript, `\b` ne voit pas une lettre accentuée ; classe déjà connue de la factory (`garde-lexicale-frontiere-ascii`) | non | traité au produit |
| La procédure de l'exploitant disait « étage » | « étape », sur `env/dev` par la demande de fusion 4004 et sur `env/prd` par la 4027 | non | traité au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont une demande, une procédure et un contrôle du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus.

## Confirmations positives

- Le contrôle exécuté a servi d'oracle avant la republication : le message corrigé n'est reparti qu'une fois jugé conforme sur ses 21 contrôles.

## Ordre recommandé

1. `RA-66` (2) : la consigne de restitution qui prescrit la tournure interdite.
2. `RA-65` (1) à (3) : la forme des demandes.
3. `RA-66` (1) : l'extension de la famille, après mesure du corpus.
