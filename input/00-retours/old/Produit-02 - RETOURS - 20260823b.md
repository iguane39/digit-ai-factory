# Retours forges — complément au lot 20260823a : localisation du correctif — 20260823b

- **Contexte** : lecture du code de `digit-ai-forge-tests` menée après la remise du lot
  `20260823a`, pour vérifier si le projet disposait d'un levier de configuration lui
  permettant de sortir `input\` du périmètre d'audit lui-même. Il n'en a aucun — et le
  correctif tient en deux constantes.
- **Références** : `forge_tests/adaptateurs/interface.py` l. 89-100,
  `forge_tests/adaptateurs/securite.py` l. 129-142, `forge_tests/disposition.py` l. 47-59.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Lot 20260823a non modifié** : un lot remis ne se réécrit pas ; la matière nouvelle vient
  par complément.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## forge-tests (`digit-ai-forge-tests`) — complément à RT-1 et RT-2

Ce chapitre apporte deux choses que le lot `20260823a` ne pouvait pas dire : d'abord que le
projet audité n'a aucun moyen de se défendre lui-même, ensuite que le correctif est déjà
écrit à 95 % dans la forge et qu'il ne lui manque qu'un mot.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-7 | majeur | **Aucun levier projet n'existe.** Les 37 clés `FORGE_TESTS_*` réellement lues par le code ont été relevées : aucune ne borne le périmètre de fichiers des pans `interface`, `securite` ou `prompts`. `FORGE_TESTS_SOURCES` désigne le **paquet Python** du produit et son parent devient la racine d'exécution — l'employer pour écarter `input\` détournerait un levier de disposition et déplacerait sept autres pans. `FORGE_TESTS_MUTATION_EXCLUT` ne porte que sur le pan `back`. Le manifeste projet `.forge\profile.toml` déclare `[racines] execution` et `front`, pas des exclusions. Conséquence : le retour RT-1 n'est **pas** une configuration que le projet aurait omise, c'est une capacité qui n'existe pas. Le `.env.forge-tests` que RT-4 demandait de pré-remplir n'aurait, sur ce point précis, rien pu contenir. | Le corollaire compte pour la Factory : quand un rapport reproche à un projet une configuration absente, vérifier que la clé existe. Ici, quatre pans FAIL renvoyaient le projet vers un `.env` qui n'a pas de mot pour dire ce qu'on lui demandait de dire. |
| RT-8 | majeur | **Le correctif est une entrée dans deux ensembles déjà écrits, et c'est la troisième fois.** `interface.py` porte `_EXCLUS` (l. 89-100) et `securite.py` porte `_EXCLUS_DEPENDANCES` (l. 129-142). Les deux contiennent déjà `output`, `old`, `Old`, `.oracles`, `forge` — et leurs commentaires nomment les retours qui les y ont mis : RT-9/RT-10 du lot `Produit-11 20260814a` (le pan inventoriait les dashboards produits par forge-tests elle-même, « 6 → 27 éléments entre deux audits sans qu'une ligne de gabarit change »), puis RT-4/TF-0218 du lot `COMPTA 20260814a` pour `forge\`. Le raisonnement y est déjà écrit noir sur blanc : *« un dossier jamais copié ne peut pas produire de finding »*. `input\` relève mot pour mot du même raisonnement, il n'a simplement jamais été ajouté. `disposition.py` connaît d'ailleurs une liste plus complète (`_HORS_SOURCES`, l. 53-59, qui inclut `docs`, `scripts`, `frontend`, `.github`) : **trois listes d'exclusion divergentes** coexistent dans la forge. | Ajouter `input` aux deux ensembles, plus `docs`, `runs`, et un filtre sur les artefacts de sauvegarde navigateur (`*_files\`, `*.téléchargement`, `*.download`). Correctif de fond, puisque c'est la troisième occurrence de la famille : **une seule** liste d'exclusion, partagée par les trois modules, dérivée de la convention de la Factory — au lieu de trois listes qu'on rallonge une par une à chaque retour. Le prochain dossier de convention oublié coûtera sinon un quatrième lot. |

## Confirmation positive

- **Le mécanisme d'exclusion fonctionne parfaitement là où il a été renseigné.** Aucun constat
  de l'audit ne porte sur `forge\`, `output\` ou `.oracles` — précisément les dossiers que les
  deux lots précédents ont fait inscrire. La preuve que le correctif marche est dans le même
  rapport que la preuve qu'il est incomplet.

## Ordre recommandé

1. **RT-8** — deux lignes, effet immédiat sur RT-1 et RT-2 du lot `20260823a`, et le
   regroupement des trois listes clôt la famille au lieu d'en repousser la quatrième occurrence.
2. **RT-7** — porte sur la manière dont un rapport formule un manque : à traiter avec RT-5
   du lot `20260823a`, dont il est un cas particulier.
