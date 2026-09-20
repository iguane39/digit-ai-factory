# Retours forges — digit-ai-marketing — 20260916a

- **Contexte** : autre — retour humain du 16/09/2026 sur le pitch « La Factory et ses forges sur Databricks » (indice a), deux termes déjà proscrits ailleurs revenus dans un livrable neuf.
- **Références ledger** : `forge\ledger.jsonl`, entrées `type: retour` écrites le 16/09/2026 à la suite de ce retour humain (étape « retour humain vocabulaire, pitch Factory Databricks »).
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

Retour humain, mot pour mot, les deux termes cités entre accents graves :

> Un travail sur la communication de la Factory a été mis en oeuvre sur le terme `Ce que` qui ne doit plus être utilisé. Pourquoi ça n'a pas été appliqué ?
> Idem pour le terme `grain` qui ne doit pas être utilisé pour la Data, mais « Granularité ». Pourquoi ceci n'est pas appliqué non plus ?

Mesure sur le livrable fautif (indice a, 13 diapositives) : 6 emplois de la tournure proscrite, dont 4 dans trois titres (entrée de sommaire, intercalaire, diapositive des limites) et 2 en libellé de carte ; 2 emplois de `grain` (`grain colonne`, `grain table`), recopiés de la doctrine de forge-data. Indice b : 0 et 0, contrôlés par extraction du texte du PPTX, notes comprises.

---

## Pilot (`digit-ai-factory`)

Le producteur n'a rencontré aucune des deux règles sur son chemin : ni à l'ouverture, ni à l'écriture, ni au jugement.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-01 | majeur | générique | **La proscription de la tournure `Ce que` n'est descendue nulle part.** Faits mesurés le 16/09/2026 : (1) le lot d'un autre produit daté du 15/09/2026, indice a (RT-15, 84 occurrences, retour humain « déjà demandé plusieurs fois ») est toujours dans `input\00-retours\_arrivee\`, non accueilli, aucun item au registre `todo\TODO.md` ; (2) `references\tics-redactionnels.json` ne porte aucune famille pour cette tournure, et son propre texte l'emploie (`un chapitre ouvre par ce que le lecteur apprend`) ; (3) `references\ECRITURE.md`, plancher d'écriture recopié dans chaque produit, l'emploie en titre de paragraphe (`Ce que le plancher n'est pas.`, `Ce que le plancher ne juge pas`) ; (4) le gabarit de restitution et le message du hook Stop prescrivent les en-têtes `Ce qu'elle coûte` et `Ce qu'elle exclut`, que la règle S31 d'`oracle-synthese` cite ; (5) le lexique du produit était vide. Conséquence : six emplois dans un pitch neuf, et la restitution du tour, conforme au gabarit, les reprenait. | La règle qui aurait évité le retour : aucune ne la couvre (E-5 du plancher vise l'annonce verbale, pas la nominalisation). **(1)** Accueillir RT-15 ; **(2)** ajouter la famille « annonce nominale » à `tics-redactionnels.json`, jouée par EC-1 d'`oracle-ecriture` sur tout produit, puisque le retour humain la dit transversale ; **(3)** réécrire `ECRITURE.md`, le gabarit de restitution, le message du hook et les libellés de S31 (« Coût », « Exclut ») ; **(4)** fixture double sens : un titre `Ce que X garantit` FAIL, « Les engagements de X » PASS. |
| RP-02 | majeur | générique | **Le lexique du destinataire est borné au produit, alors que le retour humain vise la Data entière.** Fait : `gabarits\LEXIQUE-PRODUIT.json` déclare (« pourquoi_chez_le_produit_et_pas_au_pilot ») que `grain` « n'est proscrit que là où un lecteur nommé a dit ne pas le lire ». Le terme a donc été corrigé chez un autre produit (TF-0936, TF-1045) et le lexique de ce produit, recopié le 16/09/2026, est arrivé vide (`"termes": []`, le terme figurant seulement comme `exemple_de_terme`). Le même humain a dû redemander le mot une troisième fois, sur un troisième livrable. | La règle qui aurait évité le retour : TF-1045 (lexique du client), dont la portée produit contredit ici la demande. Une liste de termes **transverses**, décidés par l'humain pour tous les produits (`grain` pour la Data, la tournure `Ce que` pour tout texte), portée par le pilot et recopiée par l'héritage, en plus du lexique propre à chaque client. Le produit a rempli son lexique le 16/09/2026 (trois entrées), mais cela ne protège aucun autre produit. |

## forge-data (`digit-ai-forge-data`)

La doctrine lue par les producteurs porte encore le terme que ses clients refusent.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-01 | majeur | générique | **`grain` reste dans la prose de la forge, et un producteur le recopie.** Mesure du 16/09/2026 : 19 lignes des fichiers Markdown de la forge portent le mot entier `grain`, contre 3 pour « granularité » (`grep -rn -w -i` sur `*.md`) ; le catalogue de services du README et le `CLAUDE.md` écrivent `grain colonne`, `grain table`, `au grain table`. Le pitch du 16/09 a repris `grain colonne` et `grain table` depuis ces deux fichiers. | La règle qui aurait évité le retour : RD-14 du lot `Produit-62 - RETOURS - 20260911a`, proposition (4), réécrire la doctrine avec « granularité ». La mener à terme sur le README et le `CLAUDE.md`, seules les clés JSON restant `grain` entre accents graves. |

## digit-ai-pptx et quality-oracles (`digit-ai-forge-agents`)

Le texte d'une présentation ne traverse aucun contrôle de vocabulaire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-01 | majeur | générique | **Le lexique du destinataire n'est joué que sur les `.md` et les restitutions ; le texte d'un PPTX n'y passe jamais.** Faits : EC-7 d'`oracle-ecriture` est appelé par le hook PostToolUse à l'écriture d'un `.md` ; S46 d'`oracle-synthese` juge les restitutions ; `oracle-pptx` et `oracle-charte-pptx-semantique` ne lisent aucun lexique. Même rempli, le lexique n'aurait pas arrêté les titres du pitch. | La règle qui aurait évité le retour : aucune pour les PPTX. Faire lire le lexique du produit (`forge\LEXIQUE.json`) par `oracle-charte-pptx-semantique` sur les textes et les notes des diapositives (règle S5), et par le skill `digit-ai-pptx` à la passe QA ; fixture double sens sur un titre portant `grain`. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Titres et libellés du pitch indice a | indice b régénéré, titres renommés (« Les angles morts d'un pipeline Databricks », « Les engagements de la Factory, et leurs limites ») ; version a rangée sous `old\` | oui | remontée ci-dessus : RP-01 et RA-01 |
| Lexique du produit vide | trois termes inscrits le 16/09/2026 dans `forge\LEXIQUE.json`, contrôlés sur six phrases types (« parce que » non signalé) | oui | remontée ci-dessus : RP-02 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Confirmations positives

Le mécanisme du lexique (`lib-lexique.mjs`, frontière Unicode) tient en conditions réelles : une fois les termes inscrits, il signale `Ce que la Factory garantit`, `ce qu'elle exclut` et `le grain colonne`, et laisse passer « parce que » et les citations entre accents graves.

## Ordre recommandé

1. RP-01, parce qu'il touche tous les produits et que le gabarit de restitution impose lui-même la tournure proscrite : tant qu'il n'est pas traité, le lexique d'un produit et son juge de restitution se contredisent.
2. RP-02, parce qu'une liste transverse évite le quatrième retour sur un autre produit.
3. RD-01, réécriture bornée à deux fichiers.
4. RA-01, dès qu'une deuxième présentation est produite.

## La règle qui aurait évité le retour

Chaque retour ci-dessus la nomme dans sa colonne « Proposition esquissée ». Deux trous du socle sont déclarés : la tournure nominale `Ce que` (aucune famille du plancher) et le texte des présentations (aucun contrôle de vocabulaire).
