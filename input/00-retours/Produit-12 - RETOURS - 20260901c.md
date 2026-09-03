# Retours forges — Produit-12 — 20260901c

- **Contexte** : clôture du run `Produit-12-20260901c` (v0.5.0, tranche A du brief
  « Génération documents » — page de génération de règles de stockage, statut
  `pret_production_en_attente_GO`). Deux frictions d'oracles mesurées en session, chacune
  ayant coûté une adaptation du produit ou d'une exigence pour obtenir un vert légitime.
- **Références ledger** : `forge\ledger.jsonl` seq 125 (conception, corrections E3/E8), seq 126
  (design, heuristiques de bascule), seq 130 (la remise)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-09-01 dans la boîte d'entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : la série RV s'arrêtait à RV-8 (lot 11), la série RC à RC-4 (lot 03).

---

## forge-conception (`digit-ai-forge-conception`)

Le cas tient en une phrase : **la garde des pronoms de l'oracle des exigences lit « elle » à
l'intérieur de « réelle »** — la frontière de mot du moteur d'expressions régulières de Node
est ASCII, et un accent y vaut frontière.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-5 | mineur | générique | **La règle E8 (absolus et pronoms non vérifiables) produit des faux positifs sur les mots français accentués.** Mesuré le 2026-09-01 sur le delta d'exigences v0.5.0 d'Produit-12 : le critère « exemples issus de l'arborescence réelle » est refusé pour « pronom : elle » — dans le moteur de Node, `\b` est ASCII, « é » vaut non-mot, donc `\belle\b` matche à l'intérieur de « réelle » (é‑elle). Même mécanique observée côté oracle-synthese du pilot : `\bmesur[ée]e?s?\b` ne matche JAMAIS « mesuré » (la frontière après « é » n'existe pas), une trace S21 légitime passe donc inaperçue. Deux oracles, deux sens du même défaut : l'un accuse à tort, l'autre absout à tort. Le contournement en session a été de réécrire des énoncés corrects (« arborescence analysée ») pour esquiver la garde | Remplacer les `\b` des gardes lexicales par des frontières Unicode explicites — `(?<![\p{L}])` et `(?![\p{L}])` avec le drapeau `u` — dans oracle-exigences (E8, E4) et, côté pilot, dans les motifs accentués d'oracle-synthese ; une fixture rouge par sens du défaut (« réelle » ne déclenche pas « elle » ; « mesuré » compte comme trace) |

## forge-design (`digit-ai-forge-design`)

Le cas tient en une phrase : **deux motifs JavaScript parfaitement légitimes — l'écouteur
délégué et la clé de stockage en constante — sont déclarés morts par les heuristiques de la
bascule**, et c'est le produit qui a dû se réécrire pour être vu.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-9 | mineur | produit+générique | **Les règles B-T2 et B-T3 de l'oracle de bascule ne voient ni un écouteur délégué ni une clé en constante.** Mesuré le 2026-09-01 sur le rendu réel d'Produit-12 : la bascule de thème vivait dans un `document.addEventListener("click", …closest("[data-action='theme']"))` avec `localStorage` sur une clé portée par `var CLE = "asdmm-theme"` — câblage fonctionnel depuis la v0.1.0, jugé « bascule morte » et « aucune persistance ». Le produit s'est adapté (écouteur attaché au bouton, clé en littéral, attribut `data-theme-toggle`) et l'adaptation a une vertu réelle — le câblage devient vérifiable de l'extérieur — mais la règle a jugé une CONVENTION d'écriture, pas la présence du comportement | Déclarer la convention comme telle : l'oracle documente que B-T2/B-T3 exigent un câblage STATIQUEMENT vérifiable (écouteur attaché après sélection du bouton, clé en littéral) et le dit dans son message de refus (« rendez le câblage lisible » plutôt que « bascule morte ») ; ou élargir l'heuristique aux deux motifs mesurés (délégation par `closest`, clé via constante du même fichier) avec fixtures |

## Remarques restées au produit

Une seule remarque reste au produit, avec son verdict écrit.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le stockage simulé (arbre de démonstration, très régulier) ne déclenche aucune proposition de règle : la page de génération rend son état vide en staging | rien — l'état vide est honnête et rendu ; les heuristiques sont prouvées par la suite d'exigences sur arborescence piégée | non | c'est le jeu de démonstration de CE produit ; l'enrichir (un dossier « Vrac » désordonné) est une amélioration locale, notée pour un prochain lot produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot —
vérifié par la session du 2026-09-01.

## Confirmations positives

- **La campagne forge-tests est passée de 67 minutes à une dizaine** entre la v0.4.0 et la
  v0.5.0 du même produit, la mutation devenant « à la demande » (variable
  `FORGE_TESTS_MUTATION`, décision humaine du 01/09) : c'est exactement la demande d'étude
  RT-20 du lot 07 qui a porté — et le rapport PROPOSE la mutation avant production au lieu de
  l'imposer, la décision restant humaine.
- **Le pan api a suivi le produit sans geste** : 497/497 dont les 5 couples route/code neufs
  du run, la porte du balayage ayant forcé leur couverture dès l'écriture.
- **La critique d'implémentation design sur rendu réel est jouable en session** : actifs
  incorporés au rendu, `run-oracles-design` rend un verdict exécutable sur l'écran du produit
  — c'est la réponse à la classe « le serveur est juste, l'écran ne le montre pas » des lots
  10 et 11, et elle a attrapé un vrai défaut (focus improvisé hors tokens).

## Ordre recommandé

1. **RC-5** — la frontière Unicode d'abord : le défaut a deux sens (accuser à tort, absoudre à
   tort) et le second est un contrôle qui rassure au lieu de juger, le pire état connu.
2. **RV-9** — une ligne de documentation ou deux motifs de plus ; le coût est faible et la
   règle cesse de pousser les produits à se réécrire sans comprendre pourquoi.
