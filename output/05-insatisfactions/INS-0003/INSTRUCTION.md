# INS-0003 — « il manque des comptes de démo prêts à l'emploi »

**Produit** : produit-61 (le dépôt d'insatisfaction porte, dans son en-tête `produit:`, le
nom déclaré au dépôt — pseudonymisé ici, jamais recopié).
**Déposé** : 06/09/2026 à 18:53, par l'humain, une phrase (dépôt « b » du lot du jour, sans
capture ni URL).
**Instruit** : 14/09/2026 par le pilot, **en lecture seule** — aucun octet n'a été écrit chez
le produit ; instruction rétrospective, un correctif du produit lui-même étant intervenu entre
le dépôt et l'instruction (bloc e).

---

## a — Reproduction, aux conditions réelles

Le dépôt ne fournit ni URL ni identifiants à essayer ; la reproduction « aux conditions
réelles » n'est pas jouable ici. Ce chapitre reproduit **structurellement** : il compare ce que
le seed créait avant et après le correctif, sur les sources et sur la suite de tests du produit.

| Ce qui est vérifié | Comment | Résultat |
|---|---|---|
| L'état au moment du dépôt | lecture du parent du correctif, `backend/app/seed.py` | **deux** restaurants de démonstration seulement (`chez-demo` populé de 12 produits, `foodtruck-demo` avec 2 produits — donc jamais réellement « vide ») ; **aucun** compte vide pour l'essai manuel |
| L'emplacement des identifiants avant correctif | même fichier | `email`/`mot_de_passe` écrits en dur dans le dictionnaire `DEMO` du code — pas dans `.env` |
| L'état après correctif | lecture de l'état courant (identique au commit du correctif) | **trois** restaurants (`chez-demo` populé de produits et de six commandes à états variés, `essai-1` et `essai-2` sans aucun produit) ; identifiants lus depuis `DEMO_ACCOUNT_1_LOGIN`/`_PASSWORD` à `DEMO_ACCOUNT_3_*` dans `.env`, documentés dans `.env.example` |
| Le comportement au démarrage sans variable | lecture de `seed.py:semer()` après correctif | un compte dont la variable manque n'est pas créé (avertissement journalisé), jamais de valeur par défaut — comportement couvert par un test dédié (bloc e) |

## b — Cause racine côté produit

Ce chapitre nomme le fichier et la ligne où vivait le défaut, pas le symptôme qu'il produisait.

**`backend/app/seed.py`, dictionnaire `DEMO`** (avant correctif) : la liste ne comptait que deux
entrées, `chez-demo` (12 produits) et `foodtruck-demo` (2 produits) — aucune des deux n'était
vide, et il n'y en avait que deux, pas trois. Le second défaut, à la même ligne de source : les
couples `email`/`mot_de_passe` de ces comptes étaient des littéraux du fichier, pas des lectures
de `.env` — même défaut structurel que celui décrit par le dépôt « a » (INS-0002), sur le même
fichier, ce qui explique que les deux dépôts aient été corrigés par le même correctif.

## c — Gates en défaut : vérifiés, jamais présumés

Pour ce défaut, ce chapitre nomme le contrôle qui aurait dû le voir, dit lequel des trois cas
s'applique et l'appuie sur une preuve lue.

| Défaut | Quel contrôle aurait dû voir | Pourquoi il n'a pas vu | Preuve |
|---|---|---|---|
| Nombre et vacuité des comptes de démo (2 au lieu de 3, aucun vide) | un oracle de conformité au contrat fonctionnel déclaré | **inexistant** — à la date du dépôt, aucune exigence du référentiel ne fixait « trois comptes, le premier populé, les deux autres vides » : cette règle n'entre au référentiel qu'avec E-075, née du dépôt lui-même | `forge/etapes/conception/EXIGENCES.md`, ligne E-075, sous l'en-tête « Run de version 20260906 — retours humains » — l'exigence est postérieure au dépôt, donc rien ne pouvait la faire respecter avant lui |
| Identifiants en dur dans `seed.py` | M-5 propreté (MEP) | **aveugle** — le contrôle regarde l'image construite et les motifs de clé, pas un identifiant de démonstration volontairement lisible dans le code ; `docs/projet/ACCES-TEST.md` (avant correctif) qualifiait ces identifiants de « volontairement triviaux et notoires », donc hors de ce que M-5 est construit pour trouver | `forge/DOSSIER-MEP.md`, ligne M-5 avant le run de version ; `docs/projet/ACCES-TEST.md` avant correctif |

Ce chapitre partage sa deuxième ligne avec celle d'INS-0002 : c'est le même fichier, la même
cause, vue par deux dépôts humains différents — le dire évite de créer deux candidatures pour un
seul trou.

## d — Solutions, par destinataire

**PRODUIT (produit-61)** — déjà fait, remis par la voie du produit (bloc e) :
1. porter le nombre de comptes de démo à trois, un seul populé ;
2. sourcer chaque identifiant depuis une variable d'environnement dédiée.

**FORGES** — aucune candidature propre à ce dossier au-delà de celle déjà portée par INS-0002
(contrôle de secrets « triviaux » en source) : la même correction de gate couvre les deux
dépôts, il serait redondant d'en proposer une seconde.

**PILOT** — rien de neuf à consigner ici : le seul constat structurel (E-075 absente avant le
dépôt) est un cas normal de cycle exigence → retour → exigence, pas un défaut de doctrine.

## e — Correctif et release : CONSTATÉ, par la voie du produit

Le produit a livré ce correctif de lui-même, par un run de version régulier — rien n'a été
exécuté par cette instruction, seul l'état existant est constaté.

- **Commit** `a9d56b1` (06/09/2026 19:11), run de version 20260906, chaîné au run initial,
  exigence E-075 ajoutée au référentiel scellé ;
- **Tests** dédiés dans `backend/tests/test_version_20260906.py` :
  `test_E075_trois_comptes_depuis_les_variables_premier_popule` (trois restaurants créés, le
  premier avec ≥ 10 produits et ≥ 5 commandes, les deux autres à 0 produit, connexion possible
  aux trois) et `test_E075_mot_de_passe_realigne_et_compte_absent_sans_variable` (un mot de
  passe changé dans les variables s'applique au redémarrage suivant ; une variable absente
  laisse le compte non créé) ;
- **MEP** : `forge/DOSSIER-MEP.md`, section « Run de version 20260906 », M-3 smoke PASS
  17/17 et M-5 propreté PASS (six variables `DEMO_ACCOUNT_*` posées par l'API, valeurs jamais
  recopiées) ;
- **Confirmation indépendante et postérieure** : l'audit du 09/09/2026 mesure de nouveau la
  qualif servie sans régression signalée sur ce point ;
- **État courant** : `seed.py`, `config.py`, `.env.example` identiques entre le commit du
  correctif et l'état lu ce jour ;
- **Production** : toujours non déployée à ce jour (GO humain Q-01 ouverte).

## f — Retours aux forges

Aucun lot nouveau porté par ce dossier : la candidature de gate (secrets triviaux en source)
est déjà portée par INS-0002, sur le même fichier et la même cause — elle n'est pas dupliquée
ici.

---

## Verdict proposé

**`corrige`** — trois comptes existent, le premier populé et les deux autres vides, tous pilotés
par des variables d'environnement, avec un test qui prouve le réalignement du mot de passe et
l'absence de création sans variable. Réserve identique à INS-0002 : la preuve visuelle au
navigateur sur l'URL réelle n'a pas été rejouée par cette instruction.
