# Retours forges — Produit-81 — 20261123b

- **Contexte** : support de présentation Design Authority de Produit-81 (indice d du 23/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 43 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-30 (majeur) — Un détail placé sous un total, qui n'en est pas la décomposition

**Le fait.** Le 23/11/2026, la diapositive 9 du support Design Authority de Produit-81 (indice c) affichait un tableau de 41 actions bloquantes, dont 28 ouvertes et 8 urgentes. Juste en dessous venaient « les trois constats bloquants de l'audit », dont un marqué clos. Le porteur a relevé l'incohérence : pourquoi 3 bloquants, dont 1 clos, quand le tableau en compte 28 ouverts ? Les 3 cartes étaient les 3 domaines en NO GO (niveau domaine), le tableau comptait les actions du plan (niveau action). La carte D04, marquée « clos par décision », cachait 5 actions bloquantes encore ouvertes dans ce domaine.

**Le coût, prouvé.** Un chiffre contredit par la diapositive même, dans un support destiné à la Design Authority, relevé par le porteur. Un indice de plus (d) pour refaire le bas de la diapositive.

**La règle qui aurait évité le retour.** Un détail placé sous un total en est la décomposition : la somme des éléments égale le total affiché. Sinon, le livrable dit en clair qu'il change de niveau et relie les deux. **Clé proposée** : `detail-sans-rapport-avec-le-total-affiche`, famille `gabarit-document`, libellé « Un livrable affiche un total puis, en dessous, un détail d'un autre niveau d'agrégation dont la somme ne le retrouve pas, sans le dire : le lecteur lit une contradiction ou un chiffre faux ».

**Juge proposé.** Cas rouge d'un oracle de livrable de synthèse : un nombre annoncé dans un intitulé (« LES 3 … », « 28 actions … ») est comparé au nombre d'éléments listés sous lui et à la somme des sous-totaux qu'ils portent ; un écart sans mention d'un changement de niveau est signalé.

## Rattachement

Registre interrogé le 23/11/2026 : `todo/CLASSES.json` du pilot (331 classes). La plus proche, `compte-total-hors-canal-des-constats`, vise un contrôle qui déclare son vrai total dans un canal secondaire ; ici le total et le détail sont sur la même page, mais à deux niveaux différents. D'où une clé neuve en `classe-a-creer`.

## Remarques restées au produit

- Diapositive 9 refaite à l'indice d (28 actions bloquantes ouvertes par domaine, 8 urgentes nommées) — généralisable : non (contenu propre à Produit-81 ; la règle générale est portée par RT-30).

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
