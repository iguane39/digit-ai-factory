# Retours forges — Produit-62 — 20260908l

- **Contexte** : même tour que le lot `20260908k` (rapprochement des colonnes affichées avec les extraits PVIZ), qui était déjà remis quand ce constat est apparu — un lot remis ne se réécrit jamais, d'où ce lot suivant à indice neuf. Le fait s'est produit sur la restitution du tour elle-même, au moment de la faire juger : `oracle-synthese` a refusé une action correctement motivée à cause du NOM d'une colonne de mon livrable.
- **Références ledger** : `forge\ledger.jsonl` seq 69 (retour humain et tour), seq 72 (ce constat et ce lot)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-09

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-13 | majeur | générique | **Le vocabulaire fermé des motifs de `oracle-synthese` est cherché dans TOUT le groupe de puce, y compris à l'intérieur des spans de code — donc un NOM DE DONNÉE peut se faire lire comme un motif, et la règle rougit sur une action irréprochable.** Fait mesuré, deux fois de suite sur la même restitution. L'action `A-16` du bloc 8 porte le motif `decision` et dit comment faire : « ouvrir le livrable et trier sur la colonne \`presence\` ». Le livrable est un fichier tableur dont une colonne s'appelle réellement `presence` — elle dit dans quels états locatifs un intitulé existe. `S21` (« un motif \`acces\` ou \`presence\` porte la trace mesurée de sa tentative ») a compté **2 actions concernées au lieu de 1** et rendu **FAIL sur 1 sur 2** : elle a lu le nom de la colonne comme un motif, sur une ligne dont le motif déclaré est `decision`, que S21 déclare pourtant explicitement hors de sa portée (« \`decision\`, \`depense\` et \`irreversible\` relèvent d'un arbitrage et ne sont pas concernés »). Le diagnostic a coûté la lecture de l'implémentation — `MOTIFS_MESURABLES = /\b(acces\|presence)\b/` appliquée au groupe de puce entier — et le contournement a été de RENOMMER la colonne du livrable en `etats_porteurs`, c'est-à-dire de laisser un oracle de forme dicter le schéma d'un livrable de données. La règle est par ailleurs exemplaire : sa portée étroite est écrite, ses deux traces sont séparées pour ne pas confondre un code technique et un mot français, et son commentaire raconte le faux PASS qu'un premier jet produisait. Le défaut n'est pas dans son intention, il est dans l'ASSIETTE de sa recherche. | Le motif se lit là où il est DÉCLARÉ, pas partout : (1) retirer les spans de code (`` `…` ``) et les blocs de code du texte avant toute recherche de vocabulaire fermé — un identifiant entre accents graves est une CITATION, jamais une déclaration d'intention, et cela vaut pour S11, S12 et S21 qui partagent le même mécanisme ; (2) mieux, chercher le motif dans la seule cellule « Motif / raison » quand le bloc 8 est rendu en tableau, ce que le gabarit prescrit comme forme par défaut depuis la v2.9.0 — la colonne existe, elle est nommée, et la lire supprime la question. Fixture double : une action `decision` citant une colonne nommée `presence` dans sa cellule « Comment » (PASS attendu, FAIL aujourd'hui), et la même action portant réellement le motif `presence` sans trace (FAIL attendu). C'est la classe `porte-cle-courte-sans-frontiere` sous un autre angle : la frontière de mot était bien là, c'est le PÉRIMÈTRE de lecture qui manquait — récidive du défaut que `RA-25` a signalé le 08/09 sur la règle L30 de `check_html`, où le terme était cherché en sous-chaîne. Deux règles, deux forges, même cause : *un vocabulaire fermé cherché dans un texte non délimité finit par trouver des mots que personne n'a écrits pour lui.* |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Une colonne du livrable de correspondance s'appelait `presence`, ce qui rendait la restitution du tour infalsifiablement rouge | colonne renommée `etats_porteurs`, ce qui est de toute façon plus explicite — elle nomme les états locatifs qui portent l'intitulé, là où « présence » ne disait pas présence de quoi ni où | oui | remontée dans RF-13 ; le renommage était le bon geste pour le livrable, il reste le mauvais geste comme remède à un faux positif d'oracle |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. La restitution du tour suit `gabarits\RESTITUTION.md` en version 2.20.0, recopié dans `forge\RESTITUTION.md` : c'est le document dont le juge a produit le faux positif, et le gabarit lui-même n'est pas en cause — sa prescription « le bloc 8 se rend en TABLEAU, l'acteur en colonne » est précisément ce qui rend la correction proposée possible.

## Confirmations positives

- `oracle-synthese` a rendu **41 règles jugées** sur cette restitution, et les cinq échecs réels du premier jet étaient tous fondés : bloc 8 sans justification d'ordre (S6), quatre actions `auto_ia` en reste sans motif (S11), deux actions humaines sans raison d'impossibilité (S12) ni chemin exécutable (S13), cinq actions sans identifiant stable (S14). Aucun n'était un faux positif, et les corriger a supprimé deux actions du bloc 8 en les EXÉCUTANT plutôt qu'en les listant — ce qui est exactement l'effet que S11 cherche.
- La séparation `TRACE_CODE` / `TRACE_MOT` de S21 fonctionne comme son commentaire l'annonce : la trace mesurée insérée dans l'action `A-31` (onglets listés, cinq filtres joués sur les 66 colonnes, comptes à zéro) a été lue du premier coup.
- `oracle-lot` a rendu PASS sur le lot `20260908k` sans aucune reprise de forme, pour la troisième fois consécutive sur ce produit.

## Ordre recommandé

1. RF-13 — seul item du lot ; il touche trois règles qui partagent le même mécanisme de lecture, et son remède le plus propre (lire la cellule « Motif / raison » du tableau) est aussi le plus simple.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RF-13** : classe `porte-cle-courte-sans-frontiere` — la clé est cherchée dans un texte dont le périmètre n'est pas délimité, et elle finit par matcher un mot que personne n'a écrit pour elle. La frontière de mot était présente ici, contrairement au cas de `RA-25` sur `check_html` ; ce qui manquait est l'exclusion des citations de code et, mieux, la lecture de la colonne où le motif est réellement déclaré.
