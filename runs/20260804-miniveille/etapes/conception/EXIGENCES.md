<!-- Vue humaine dérivée de EXIGENCES.json. Toute modification se fait dans le JSON. -->

# EXIGENCES.md — MiniVeille

## 1. Origine

`ENTRANT.md` et `SURFACE.md` du présent dossier, tous deux datés du 2026-08-04, eux-mêmes issus
de `PRODUIT-TEST.md` (entrant idée) et de la consigne de cadrage du run.

## 2. Besoins

| id | énoncé |
|---|---|
| B-01 | Le consultant peut enregistrer un lien de veille accompagné d'un ou plusieurs tags. |
| B-02 | Le consultant peut consulter l'ensemble de ses liens enregistrés. |
| B-03 | Le consultant peut retrouver ses liens en filtrant par tag. |
| B-04 | Le consultant peut marquer un lien comme lu pour distinguer ce qui reste à traiter. |
| B-05 | Le consultant pilote sa veille depuis une page web unique qui s'appuie sur une API backend, sans authentification. |

## 3. Exigences par palier

### MVP

| id | besoin | énoncé | critère | statut | surface | ICE (i/c/e) |
|---|---|---|---|---|---|---|
| E-001 | B-01 | Le consultant enregistre un lien accompagné d'au moins un tag. | Le lien est enregistré avec un identifiant propre et au moins un tag associé. | fait constaté | S-01, S-03 | 5/5/2 |
| E-002 | B-01 | L'enregistrement d'un lien depuis le formulaire de la page web respecte un délai maximal. | Le temps entre l'ouverture du formulaire et la confirmation d'enregistrement est ≤ 10 s. | fait constaté | S-01, S-03, S-09 | 4/3/3 |
| E-003 | B-02 | Le consultant consulte la liste de l'ensemble de ses liens enregistrés. | La liste retourne tous les liens enregistrés, quel que soit leur statut de lecture. | fait constaté | S-01, S-04 | 5/4/2 |
| E-004 | B-03 | Le consultant filtre la liste des liens par un tag choisi. | La liste filtrée ne retourne que les liens portant le tag sélectionné. | fait constaté | S-01, S-05 | 5/4/2 |
| E-005 | B-04 | Le consultant marque un lien comme lu depuis la page web unique. | Le champ statut du lien retourne la valeur lu après l'action de marquage. | fait constaté | S-01, S-06 | 4/4/1 |
| E-006 | B-05 | Le consultant accède à l'ensemble des fonctions de veille depuis une même page web. | Le produit ne compte qu'1 écran pour l'ensemble des fonctions de veille. | fait constaté | S-07 | 3/4/2 |
| E-007 | B-05 | La page web unique récupère les données de veille par des appels à une API backend. | Aucun accès direct à une base de données depuis la page web n'existe : tout accès aux liens passe par l'API backend. | fait constaté | S-07, S-08 | 3/3/2 |
| E-008 | B-02 | La liste des liens affiche, pour chaque lien, le tag qui lui est associé. | Le tag associé à un lien est affiché à côté de ce lien dans la liste. | **hypothèse** | S-01, S-04 | 3/3/2 |
| E-009 | B-02 | La liste des liens indique le statut de lecture de chaque lien. | Le statut de lecture de chaque lien listé est affiché, sans valeur manquante. | **hypothèse** | S-01, S-04, S-06 | 3/3/1 |
| E-010 | B-02 | Un lien marqué lu reste présent dans la liste non filtrée. | Un lien marqué lu apparaît toujours dans la liste non filtrée. | **hypothèse** | S-01, S-04, S-06 | 2/3/1 |
| E-011 | B-05 | Le consultant accède à ses liens sans authentification préalable. | Un mécanisme d'authentification est absent de la page web unique et de l'API backend. | fait constaté | S-02, S-07, S-08 | 3/5/1 |

### V1

| id | besoin | énoncé | critère | statut | surface | ICE (i/c/e) |
|---|---|---|---|---|---|---|
| E-012 | B-01 | Le temps d'enregistrement d'un lien est mesuré pour objectiver le respect du délai cible. | Le temps d'enregistrement est journalisé pour 100 % des enregistrements effectués. | **hypothèse** | S-09 | 2/2/3 |
| E-013 | B-03 | Le consultant filtre la liste des liens par plusieurs tags combinés. | La liste retourne uniquement les liens portant tous les tags sélectionnés. | **hypothèse** | S-01, S-05 | 3/2/3 |
| E-014 | B-04 | La page web unique indique le nombre de liens au statut non lu. | Le nombre de liens au statut non lu est affiché sur la page unique. | **hypothèse** | S-01, S-06, S-07 | 2/2/2 |

## 4. Hypothèses

6 des 14 exigences (43 %) portent le statut `hypothèse` : E-008, E-009, E-010, E-012, E-013,
E-014. Cohérent avec le niveau de confiance « dégradé » déclaré en `ENTRANT.md` section 6 —
chacune ajoute un comportement non cité littéralement par l'entrant. Les 8 autres exigences sont
`fait constaté`, sourcées soit à `PRODUIT-TEST.md`, soit à la consigne de cadrage du run.

| id | mode de validation |
|---|---|
| E-008 | Affichage des tags dans la liste non cité littéralement par l'entrant ; à confirmer par relecture avec le consultant avant livraison du MVP. |
| E-009 | Affichage du statut de lecture dans la liste non cité littéralement par l'entrant ; à confirmer par relecture avec le consultant avant livraison du MVP. |
| E-010 | Comportement de la liste après marquage lu non cité par l'entrant ; à confirmer par relecture avec le consultant avant livraison du MVP. |
| E-012 | Monitoring anticipé pour objectiver le critère des 10 s en usage réel ; à mettre en place et confirmer après un mois d'utilisation, avant le palier V1. |
| E-013 | Besoin de filtrage multi-tags non cité par l'entrant, anticipé à partir de l'usage probable d'un outil de veille personnel ; à confirmer avec le consultant après une période d'usage du MVP. |
| E-014 | Compteur de liens non lus anticipé comme complément du marquage lu, non cité par l'entrant ; à confirmer avec le consultant avant le palier V1. |

## 5. Couverture de surface

**100 % (9/9)**, seuil applicable 95 %. Aucun élément non couvert.

| id | type | libellé | couvert par |
|---|---|---|---|
| S-01 | objet | Lien | E-001, E-002, E-003, E-004, E-005, E-008, E-009, E-010, E-013, E-014 |
| S-02 | role | Consultant (mono-utilisateur, sans authentification) | E-011 |
| S-03 | parcours | Enregistrement d'un lien avec tags | E-001, E-002 |
| S-04 | parcours | Consultation de la liste des liens | E-003, E-008, E-009, E-010 |
| S-05 | parcours | Filtrage des liens par tag | E-004, E-013 |
| S-06 | parcours | Marquage d'un lien comme lu | E-005, E-009, E-010, E-014 |
| S-07 | point-entree | Page web unique | E-006, E-007, E-011, E-014 |
| S-08 | point-entree | API backend (FastAPI) | E-007, E-011 |
| S-09 | regle | Enregistrement d'un lien en moins de 10 s | E-002, E-012 |

## 6. Relevé des oracles

Exécutés réellement (`node`, disponible dans cet environnement) contre `EXIGENCES.json`, une
seule passe, aucune correction nécessaire.

| Oracle | Verdict | Détail |
|---|---|---|
| `oracle-exigences` (E1–E6) | **PASS** | 84/84 constats PASS, 0 FAIL |
| `oracle-tracabilite` (T1–T4) | **PASS** | 47/47 PASS, 1 SANS_OBJET (T3 — aucune vue `--vue` fournie, non jugé) |
| `oracle-surface` (S1–S3) | **PASS** | 24/24 PASS — couverture 100 % (9/9), seuil 95 % |
| `oracle-claims` (A1–A2) | **PASS** | 19/19 PASS, 1 SANS_OBJET (A2 — critères hors périmètre par construction) |

Aucune deuxième passe n'a été nécessaire.

## 7. Ce que le référentiel ne dit pas

- **La pertinence produit des hypothèses** (E-008, E-009, E-010, E-012, E-013, E-014) : `non_juge`
  par les oracles. Rien ne garantit que le consultant a réellement besoin d'un compteur de liens
  non lus (E-014) ou d'un filtre multi-tags (E-013) — seul un usage réel du MVP le dira.
- **La justesse du palier** : le choix MVP vs V1 est un arbitrage humain, non vérifié
  mécaniquement. En particulier, E-008/E-009/E-010 sont classées MVP malgré leur statut
  `hypothèse`, parce qu'elles conditionnent l'utilisabilité même des parcours listage/filtre/
  marquage — un choix défendable mais discutable, à trancher par le commanditaire.
- **Le modèle de données, le schéma d'API et la stack de persistance** : rien n'est spécifié
  au-delà de « backend FastAPI ». C'est le travail de l'étape d'implémentation, pas de la
  conception.
- **La volumétrie** : aucun nombre de liens ou de tags attendu par utilisateur n'est posé, donc
  aucune exigence de performance sous charge n'est formulée.
- **Le nombre maximal de tags par lien, la longueur d'un lien, les doublons** : non traités —
  hors de portée de l'entrant idée (`ENTRANT.md` section 4).
- **L'atomicité sémantique des énoncés** (`non_juge` par `oracle-exigences` E6) et la complétude
  de l'inventaire de surface lui-même (`non_juge` par `oracle-surface`) : relues manuellement,
  jamais prouvées mécaniquement.
- **La régénérabilité de cette vue** (T3) : non jugée, faute d'exécution avec l'option `--vue` —
  ce fichier n'a pas été comparé à une empreinte de la source pour vérifier qu'il en est bien la
  copie exacte au moment de sa lecture.
