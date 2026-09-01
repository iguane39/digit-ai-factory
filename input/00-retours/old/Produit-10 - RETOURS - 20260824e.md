# Retours forges — Produit-10 — 20260824e

- **Contexte** : mandat humain du 24/08 — « **construis les retours pour la Factory afin
  d'améliorer à partir des erreurs passées** ». Les erreurs en question sont les miennes, faites
  dans cette session, et chacune a une cause qui n'est pas propre à ce produit. Le même mandat
  demandait d'enrichir le socle documentaire du produit ; c'est fait, et ce que cet
  enrichissement révèle **manque au socle lui-même** — c'est l'objet de `RV-16`.
- **Références ledger** : `forge\ledger.jsonl` seq 71, 74, 75.
- **Remise au pilot** : copié dans `<PILOT_ROOT>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-08-24

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `Produit-10 - RETOURS - 20260824d`, remis le même jour. La séquence d'ids
continue en **`RV-16`**. Les trois lots précédents du jour portaient sur un **oracle** ; celui-ci
porte sur la **doctrine** : le socle documentaire, la traçabilité des mesures, et la méthode
d'analyse.

---

## Les trois erreurs, et ce qu'elles ont en commun

| # | L'erreur commise | Ce qui l'a rendue possible |
|---|---|---|
| 1 | J'ai recommandé une **évolution de schéma** sur la foi d'un seul document, alors que le projet détenait déjà les mesures du socle du groupe qui la rendaient discutable | rien dans la méthode n'oblige à confronter un constat au **paysage voisin** avant d'en tirer une demande |
| 2 | Interrogé sur un **workspace** nommé `…_D2`, j'ai testé la présence d'un **catalogue** dont le nom contiendrait `_d2`, puis conclu « aucun environnement D2 » | deux nommages indépendants, et aucune règle ne dit qu'un résultat de recherche par nom n'est pas un fait d'absence |
| 3 | Aucun de mes documents ne nommait le workspace mesuré, et aucune de mes 60+ mesures archivées ne portait le sien | le socle documentaire n'a **aucun porteur** pour les environnements de données, et `forge-data` n'exige pas qu'une mesure porte sa cible |

**Le point commun est un seul mot : le *où*.** La doctrine outille magnifiquement le *quoi*
(quel chiffre) et le *comment* (quelle requête). Elle ne demande jamais **sur quoi** — et dès
qu'il existe plus d'un environnement joignable, l'omission produit des réponses fausses avec
l'apparence de la rigueur.

## factory (`digit-ai-factory`) — socle documentaire R-20

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-16 | **majeur** | générique | **Le socle `docs\projet\` n'a aucun document où déclarer les environnements de données interrogés.** R-20 prescrit huit fichiers à noms fixes. `COMPOSANTS-OPS.md` y est défini comme « hiérarchie/noms/types/IDs/URLs/IPs des **composants déployés** — depuis `ops etat`/plans/DOSSIER-MEP ». Un produit qui **ne déploie rien** mais **lit plusieurs workspaces** n'a donc, en toute conformité, qu'à y écrire « aucun composant déployé » — ce que ce produit faisait depuis le 13/08, en une ligne, avec pour seule trace un identifiant d'hôte nu dans un tableau de « dépendance externe ». **Coût mesuré le 24/08** : l'humain donne un nom de workspace, `CL3_APP_ABK_WRKSP_D2` ; ce nom ne se rapproche d'**aucun** élément du dépôt ; la réponse produite est fausse, et l'humain doit écrire « si tu ne sais déjà pas de quoi on parle, forcément tu ne peux pas aller très loin ». Le fichier qui aurait dû porter ce rapprochement existait, conforme, et vide de l'information. **La classe est générique** : tout produit d'analyse de données a des environnements et aucun composant déployé. | **Élargir la définition de `COMPOSANTS-OPS.md`** — ou créer un neuvième document — pour couvrir les **environnements de données**, avec un contenu prescrit : par environnement, le **nom d'affichage**, l'hôte, l'identifiant, le metastore, le profil de connexion, l'entrepôt employé, et **les catalogues avec leur mode d'accès** (lu / écrit / jamais ouvert). Deux exigences que ce produit vient d'éprouver et qui méritent d'être dans le gabarit : (1) une section pour les environnements **connus par documents interposés** — un catalogue dont on parle sans l'avoir jamais joint, avec la liste des documents qui en portent la connaissance et leur péremption éventuelle ; (2) un mode d'emploi **« retrouver un workspace à partir d'un fragment de nom »**, qui dise noir sur blanc que le nommage d'un workspace et celui de ses catalogues sont indépendants. Le fichier produit ici peut servir de gabarit : `docs\projet\COMPOSANTS-OPS.md`, version du 24/08. |

## factory (`digit-ai-factory`) — doctrine de mesure, et `digit-ai-forge-data`

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-17 | **majeur** | générique | **Une mesure archivée porte sa requête et jamais sa cible : dès qu'il existe deux environnements joignables, deux mesures identiques y sont indiscernables.** La doctrine `forge-data` exige qu'un chiffre soit remontable à sa source — `oracle-restituer` réclame le marqueur, `oracle-tracer` le lineage. Les deux vérifient le **quoi** et le **comment**. Aucun ne réclame le **où**. Vérifié dans ce produit : l'outil de mesure archivait `id`, `sql`, `colonnes`, `lignes`, `nb_lignes`, `statement_id` — **et rien d'autre**. Plus de 60 mesures ont été prises ainsi depuis le 13/08. Le poste porte **deux** profils de connexion vers **deux** workspaces distincts, qui exposent tous deux un catalogue nommé `catalog_any_bronze_d1` : la même requête, sur l'un et sur l'autre, produit deux résultats différents et **deux archives strictement indiscernables**. Corrigé ici le 24/08 : chaque mesure porte désormais `profil`, `hote` et `warehouse_id`. | **Faire porter à toute archive de mesure l'identité de sa cible**, et à `oracle-tracer` de la vérifier : un `lineage.json` dont une source ne dit pas sur quel workspace elle a été lue est un lineage incomplet. Le champ coûte trois lignes de code — la version corrigée de `scripts\dbx_sql.py` de ce produit est disponible comme référence. Corollaire à écrire dans la doctrine : **deux catalogues homonymes sur deux workspaces sont la règle, pas l'exception** — les environnements d'un même groupe portent les mêmes noms de catalogues par construction. |

## factory (`digit-ai-factory`) — méthode d'analyse

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-18 | majeur | générique | **Deux faux négatifs en une journée, tous deux produits par une recherche par NOM, tous deux présentés comme des faits d'absence.** Cas 1 : le mapping conclut « **aucune table de transcodification** » après avoir cherché dix motifs de nom de table (`%transcod%`, `%corresp%`, `%mapping%`…) sur trois schémas. La correspondance existe pourtant, dans un schéma nommé `dl50` dont les tables s'appellent `customer` et `owner` et dont les colonnes s'appellent `COD_CLIENT_ALX` — hors d'atteinte des dix motifs. Cas 2 : interrogé sur un workspace, je cherche un catalogue au nom contenant `_d2`, n'en trouve aucun, et réponds « aucun environnement D2 » — alors que les deux nommages sont indépendants et que mon test ne portait pas sur la question. **Dans les deux cas, une recherche infructueuse a été rendue comme une absence établie.** | **Une règle d'une ligne, à porter au prompt d'analyse et au socle de méthode** : *une recherche par nom qui ne trouve rien établit que le nom cherché n'existe pas — jamais que la chose cherchée n'existe pas.* Deux conséquences opérationnelles : (1) toute conclusion d'absence énumère **ce qui a été cherché et comment**, ce que le mapping faisait déjà, **et déclare la recherche complémentaire par STRUCTURE** — chercher des colonnes plutôt que des tables, un motif de valeurs plutôt qu'un motif de nom ; (2) ajouter à la méthode d'analyse une **étape E0 — déclarer l'environnement** : sur quel workspace on travaille, comment il s'identifie, et comment un chiffre lui sera attribuable. La méthode actuelle résout les noms de catalogue, de schéma et de table dès son étape 1 ; elle ne demande jamais **sur quel workspace**. |

**Portée** (R-45) : *générique* pour les trois — aucun n'est propre à ce produit.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `docs\projet\COMPOSANTS-OPS.md` ne portait qu'une ligne de déploiement absent et un identifiant d'hôte nu | réécrit le 24/08 : trois environnements décrits — deux joignables, un connu par documents interposés — avec nom, hôte, identifiant, metastore, profil, entrepôt, catalogues et mode d'accès, plus un mode d'emploi de recherche de workspace | **oui** | Le manque est dans la **définition R-20** du fichier, pas dans notre application → **`RV-16`** |
| L'outil de mesure n'archivait pas son environnement | trois champs ajoutés — `profil`, `hote`, `warehouse_id` — vérifiés sur une mesure neuve | **oui** | La doctrine `forge-data` ne l'exige nulle part → **`RV-17`** |
| J'ai recommandé une évolution de schéma sans consulter le socle du groupe | demande suspendue, complément d'analyse émis, puis borné à l'environnement réellement mesuré | **oui** | La méthode n'oblige pas à confronter au paysage voisin, et ne fait pas déclarer l'environnement → **`RV-18`**, seconde conséquence |
| Le nom d'affichage du workspace reste inconnu | trois tentatives tracées, et le rapprochement renvoyé à l'interface Databricks | **non** | Limite de droits sur ce compte, sans classe généralisable |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `docs\projet\COMPOSANTS-OPS.md` | gabarit du socle `docs-projet`, R-20 | **toute la matière** : le gabarit couvre les composants **déployés**, et n'a aucune place pour les environnements de données **interrogés** | le destinataire a écrit « tu ne cites même pas le Workspace sur lequel tu as travaillé, comment peut-on alors remettre dans le contexte » | trois tableaux d'environnements, la distinction lu/écrit par catalogue, la section des environnements connus par documents interposés, et un mode d'emploi de recherche de workspace | **générique** — c'est l'objet de `RV-16` de ce lot |

**Aucun document produit depuis un gabarit** de `gabarits\documents\` : ce projet est une analyse de données et la bibliothèque n'en porte pas de gabarit. Le tableau ci-dessus rapporte donc ce qui a manqué **faute de gabarit**, ce qui est l'autre moitié du même signal.

## Confirmations positives

- **Le mandat humain a produit le bon geste dans le bon ordre** : enrichir le socle du produit
  **puis** remonter ce que l'enrichissement révèle. C'est exactement la boucle que `R-45` décrit,
  et elle a fonctionné sans qu'on ait à la rappeler.
- **`oracle-conformite-projet` ne pouvait pas voir ce manque, et ce n'est pas un défaut de sa
  part** : il vérifie la **présence** des huit fichiers du socle et le frontmatter, jamais la
  pertinence de leur contenu — il le déclare lui-même dans ses limites. `RV-16` porte sur la
  **définition** du fichier, pas sur son contrôle.
- **Les trois erreurs ont toutes été trouvées par l'humain, pas par un oracle.** C'est le
  quatrième lot du jour, et le seul dont la source soit une lecture humaine attentive. Aucune
  proposition de ce lot ne vise à remplacer cette lecture — seulement à lui épargner les cas
  qu'une règle écrite aurait suffi à éviter.

## Ordre recommandé

**`RV-17` d'abord** — trois lignes de code, et il rend jugeable tout ce qui suit. **`RV-16`**
ensuite : c'est le plus structurant, et le gabarit existe déjà. **`RV-18`** en dernier, parce
qu'une règle de méthode ne vaut que si les deux précédentes lui donnent de quoi se vérifier.
