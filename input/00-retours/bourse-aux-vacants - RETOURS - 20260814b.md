# Retours forges — bourse-aux-vacants — 20260814b

- **Contexte** : boucle de fermeture `auto_ia` (ETAPES-RUN §5, borne 5 extensible à 7). Sur les
  19 actions `auto_ia` du rapport, une seule est routée `forge` — mais elle est bloquante et son
  mécanisme est désormais identifié, ce qui n'était pas le cas quand RT-5 a été remis.
- **Références ledger** : `forge\ledger.jsonl` seq 109
- **Lot précédent** : `RETOURS-20260814a.md`, remis et donc immuable. D'où ce lot neuf.
- **Statut** : remis le 2026-08-14 — copie déposée dans le dossier `input\00-retours\` du pilot

---

## forge-tests (`digit-ai-forge-tests`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-14 | **bloquant** | **Le pan `data` fabrique une contrainte fantôme `IF` à partir de l'idiome de rejouabilité — et c'est le pan `migrations` qui impose cet idiome.** Le rapport porte `contrainte:IF`, classée `element-non-exerce`, **sévérité `bloquant`, risque 75**, localisée dans `backend/migrations/0001_schema_initial.sql`. Aucune contrainte de ce nom n'existe : le fichier contient **6** occurrences de `ALTER TABLE … DROP CONSTRAINT IF EXISTS <nom_reel>;` et l'analyseur retient le mot qui suit `CONSTRAINT`, soit `IF`, au lieu du nom réel. Preuve de l'ampleur : le pan ne rapporte **qu'une seule** contrainte en finding, et c'est celle-ci — les vraies contraintes nommées, elles, sont bien exercées (35/36). **Le conflit est interne à la forge** : le pan `migrations` exige les trois sens (aller/rejeu/retour), donc `DROP CONSTRAINT IF EXISTS` ; le pan `data` transforme ensuite cet idiome en défaut bloquant. Un projet ne peut pas satisfaire les deux. Conséquence sur la boucle : cette action est `auto_ia` / `tests-suite`, or la satisfaire demanderait de **fabriquer une contrainte inexistante** pour qu'un test la fasse tomber. C'est du truquage, refusé au titre de G-2. C'est le motif pour lequel un `auto_ia` reste au rapport final. | Dans l'analyseur du pan `data` : après `CONSTRAINT`, consommer l'éventuel `IF EXISTS` / `IF NOT EXISTS` avant de lire le nom. Le même filtre vaut pour `CREATE TABLE IF NOT EXISTS` et `CREATE EXTENSION IF NOT EXISTS`, présents 40 fois dans ce fichier. Ignorer aussi les lignes de commentaire : ici, la ligne 5 est un commentaire qui contient littéralement « DROP CONSTRAINT IF EXISTS ». |
| RT-15 | majeur | **Trois mutants d'un chemin que le déploiement ne peut pas exécuter sont routés `auto_ia` / `tests-suite`.** `06_bulk_import:79`, `06_bulk_import:607` et `04_put_advert:363` reçoivent une action « renforcer l'assertion qui laisse survivre le mutant », comme s'il s'agissait d'une faiblesse de la suite. Or : `azure/standalone_backend.py` — le point d'entrée réellement déployé — **redéfinit les trois routes d'import** (`/c13s/file-import/template` l.472, `/c13s/file-import` l.594, `/c13s/insert-adverts` l.629). La ligne 607 vit dans `_extract_prepared_data_from_excel`, auxiliaire du module c13s que le déploiement supplante ; la 79 est la branche d'erreur S3 de la route de gabarit, elle aussi redéfinie. Quant à `04_put_advert:363` (nettoyage des photos), il dépend d'un stockage objet **littéralement désactivé** : `"buckets:\n  name: disabled\n  blob_advert_pictures: disabled"`, avec un commentaire « disabled until Azure Blob Storage is added later ». Les tuer demanderait d'exercer du code que le produit livré n'atteint jamais — donc d'ajouter de la surface de test sans ajouter de protection. **La taxonomie du contrat prévoit déjà le cas** : ETAPES-RUN §5 nomme la « dépendance à une action humaine préalable, p. ex. configuration absente » comme motif légitime, et `mep-config` comme étape cible pour ce qui relève d'une variable. Le routeur ne l'applique pas. | Router vers `mep-config` (ou vers un état `bloque_par_configuration`) un mutant dont le module est redéfini par le point d'entrée déployé, ou dont la branche dépend d'une configuration désactivée. À défaut de le détecter automatiquement, permettre au projet de le déclarer une fois pour toutes — c'est la même mécanique que RT-13 pour l'adoption des cas. |

## Précision sur RT-5 (lot `20260813b`, déjà remis)

RT-5 signalait la contrainte fantôme sans en donner la cause — je l'avais qualifiée de
« fantôme de l'auditeur » sans savoir d'où elle venait. Le mécanisme ci-dessus la remplace :
ce n'est pas un aléa, c'est un défaut d'analyse syntaxique reproductible, et il touchera **tout
projet dont les migrations sont rejouables** — c'est-à-dire tout projet conforme au pan
`migrations`. RT-14 est donc à traiter avec RT-5, pas à sa place.

## Confirmation positive

- **Le pan `interface` n'est pas reproductible du tout, et le chiffre le dit mieux que RT-9.**
  Son inventaire a fait **6 → 27 → 335 → 0** sur quatre audits du même produit, sans qu'une
  seule ligne de gabarit change. Au quatrième, il annonce « aucun gabarit exploitable ». Un pan
  qui rapporte 335/335 = 100 % puis « surface non énumérable » sur un code identique ne mesure
  rien d'attribuable au produit. C'est le même défaut que RT-9, avec une amplitude qui l'établit.
- **La boucle `auto_ia` fonctionne comme annoncée, et elle a produit.** Sur les 18 actions
  `auto_ia` de mutation, la relecture ligne par ligne en a rendu **5 tuables** que j'avais
  moi-même déclarées équivalentes la veille — les journaux d'incident et d'acte destructeur.
  Ma propre réserve écrite le disait déjà (« équivalent vaut pour le comportement, pas pour
  l'exploitation ») ; la boucle a forcé à la relire. L'ancienne borne de 3 cycles aurait laissé
  ces actions au rapport final : le passage à 5 (TF-0185) est ce qui les a fait traiter.
- **Une action `auto_ia` a produit mieux qu'un mutant tué.** En cherchant à tuer
  `03_post_advert:138`, la mesure a établi que le chemin du jeton hérité **échoue à l'écriture**
  (`adverts.advert_owner` est un `integer`, l'identité vaut une adresse). Cet écart figurait
  dans la stratégie comme « échouerait » ; il est désormais mesuré : il échoue. Le mutant, lui,
  est **équivalent sur le chemin atteignable** — l'unique instruction qui suit le `rollback`
  échoue pour une raison indépendante. Une équivalence mesurée valait mieux qu'un mutant tué.
