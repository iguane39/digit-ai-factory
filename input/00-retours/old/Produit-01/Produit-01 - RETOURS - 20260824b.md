# Retours forges — Produit-01 — 20260824b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : panne de l'ajout de documents constatée par un utilisateur sur l'environnement
  **Dev Azure**, corrigée par la PR 3682 (commit de fusion `ec9f94f`). Ce lot répond à une
  question posée par le propriétaire du produit : *« la forge aurait-elle vu ce problème,
  implémenté puis exécuté les tests ? »* La réponse est **non**, et les raisons sont
  mécaniques.
- **Références ledger** : `forge\ledger.jsonl` seq 57, 58, 59 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-24

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-21 consommés). Ce lot porte
RG-22 à RG-24.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## La mesure qui porte ce lot

Le défaut : `APPROVAL_CLAMAV_HOST` valait **`clamav`** — le nom du service dans
`docker-compose.yml` — recopié tel quel dans l'IaC, **six fois** (l'API, le worker et les
quatre tâches planifiées). Ce nom résout sur un poste de développement et **nulle part** dans
un environnement Azure Container Apps. Chaque téléversement levait
`socket.gaierror: [Errno -2] Name or service not known`.

**La question posée : la chaîne actuelle l'aurait-elle vu ?**

| Porte | Verdict | Pourquoi |
|---|---|---|
| `terraform validate` | non | `"clamav"` est une chaîne syntaxiquement valide |
| tests backend (406) | non | ils injectent `FakeAntivirus` — c'est le bon choix, mais il ne rencontre jamais le DNS |
| tests frontend (137) | non | hors périmètre |
| **recette e2e (28 tests, bloquante)** | **non, et structurellement** | elle s'exécute sur `docker compose`, **où `clamav` est la bonne valeur**. Une suite verte est ici la preuve du contraire de ce qu'on veut prouver |
| `gitleaks`, `ruff`, `mypy`, `eslint`, `tsc` | non | sans rapport |

**Le run de déploiement qui a mis ce défaut en service était vert de bout en bout**, recette
e2e comprise. Le défaut a été trouvé par un **utilisateur**, puis diagnostiqué en lisant les
journaux de l'API dans Log Analytics.

### Le fait générique

**Une valeur de configuration juste en local et fausse en cible est invisible pour toute porte
qui s'exécute en local.** Et c'est la totalité des portes de cette chaîne.

Le seul dispositif qui pourrait la voir — exercer un chemin fonctionnel **contre
l'environnement déployé** — n'existe nulle part dans le pipeline. L'étape `Deploy` se termine
sur ses migrations Alembic et **ne vérifie rien** :

```
Deploy → checkout → terraform plan then apply → Alembic migrations → (fin)
```

Le pan `qualif` de `forge_tests` est précisément fait pour cela (`FORGE_TESTS_QUALIF_URL`). Il
a été joué **une fois, à la main, sur une instance locale** (ledger seq 28, 8/8, zéro finding)
et n'a jamais été câblé sur Dev.

---

## development / mep (`digit-ai-forge-development`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-22 | bloquant | **Le pipeline déploie et ne vérifie jamais le déploiement.** L'étape `Deploy` d'`azure-pipelines.yml` s'achève sur `terraform apply` puis `alembic upgrade head` ; aucun chemin fonctionnel n'est exercé contre l'URL servie. Conséquence mesurée le 24/08 : `APPROVAL_CLAMAV_HOST = "clamav"` (nom du service `docker-compose`, recopié 6 fois dans l'IaC) a été mis en service par un run **vert de bout en bout, recette e2e bloquante comprise**, et a cassé 100 % des téléversements sur Dev. Le défaut a été signalé par un utilisateur et diagnostiqué en lisant `ContainerAppConsoleLogs` a posteriori. **Le point structurel** : toutes les portes s'exécutent en local, où la valeur fautive est la BONNE valeur — la recette e2e monte `docker compose`, dans lequel le service s'appelle littéralement `clamav`. Une suite verte y est la preuve du contraire de ce qu'on cherche. Aucune porte locale, si complète soit-elle, ne peut voir cette classe de défaut. | Une **étape de vérification post-déploiement**, bloquante, dans le pipeline : après `Deploy`, exercer contre l'URL réellement servie un jeu court de chemins qui **traversent chaque adaptateur d'infrastructure** — base, stockage blob, file de messages, antivirus, coffre de secrets. Pas un `/healthz`, qui ne prouve que le démarrage : un `/readyz` qui **tente une connexion à chaque dépendance et rend leur état**, plus un smoke fonctionnel. Le pan `qualif` de `forge_tests` est déjà cette chose et n'a jamais été câblé ailleurs qu'à la main (ledger seq 28). Contrainte à respecter : cette étape doit ÉCHOUER le run, sinon elle rejoint la famille des portes décoratives corrigée sur ce produit le 24/08. |

## development (`digit-ai-forge-development`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-23 | majeur | **Une réponse d'erreur émise hors de la pile CORS est illisible par le navigateur, qui la rapporte en perte de connexion.** Le `ServerErrorMiddleware` de Starlette est placé à l'EXTÉRIEUR de toute la pile utilisateur, donc de `CORSMiddleware`. Son 500 part sans `access-control-allow-origin` ; le navigateur refuse de lire la réponse, `fetch` rejette, et l'interface affiche « Connexion perdue. Vérifiez votre réseau puis réessayez. » **Un utilisateur dont le réseau allait parfaitement bien a été invité à le vérifier, pour une variable d'environnement fausse.** Vérifié sur pièces : la réponse 401 de la même route porte bien les en-têtes CORS (elle passe par `ExceptionMiddleware`, à l'intérieur) ; c'est le 500 non géré qui ne les porte pas. **C'est la deuxième occurrence en une journée de la famille remontée le matin même en RG-20** — la cause d'une erreur détruite à une frontière — et cette récurrence est l'argument : RG-20 était côté client, celui-ci est côté serveur, et il produit le même symptôme sur l'écran. | Deux contrôles chez development, tous deux mécanisables. (1) **Test de propriété du montage** : dans une application ASGI servant un client d'une autre origine, une exception NON PRÉVUE doit produire une réponse portant les en-têtes CORS. Un test suffit, il tient en dix lignes et il échoue si quelqu'un déplace le middleware — c'est celui qui a été écrit à la main ici (`backend/tests/test_antivirus_indisponible.py::test_meme_une_exception_IMPREVUE_reste_lisible_par_le_navigateur`). (2) **Contrôle statique de l'ordre des middlewares** : `add_middleware` empile à l'envers, le premier ajouté est le plus intérieur. Un filet à exceptions ajouté après CORS est inopérant, et rien ne le signale. La règle est vérifiable sans exécution. |

## conception (`digit-ai-forge-conception`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-24 | majeur | **Un port qui ne déclare que son cas nominal force les pannes d'adaptateur en exceptions non gérées.** `AntivirusPort.is_clean(content) -> bool` déclarait exactement deux issues : propre, ou infecté. La troisième — *l'analyse n'a pas eu lieu* — n'existait pas au contrat. L'adaptateur ClamAV n'avait donc **nulle part où la mettre** : `socket.gaierror` remontait nue jusqu'à l'ASGI. Or les deux cas sont opposés : un fichier infecté est un refus définitif (« ne pas insister »), un scanner injoignable est une panne transitoire (« réessayez »), et un booléen ne peut pas porter la différence. Le même trou existe sur les autres ports du produit qui parlent à une infrastructure — `StoragePort`, `QueuePort`, `SecretsPort`, `DirectoryPort` : tous déclarent leur signature heureuse et aucun ne déclare son mode de panne. **C'est le patron de RG-18 et RG-21 déplacé d'un cran** : là où RG-18 portait sur un déclencheur asynchrone sans clause de réponse et RG-21 sur une limite sans clause de restitution, celui-ci porte sur une dépendance externe sans clause d'indisponibilité. | Une **exigence-type portée par `cat-con-03`**, déclenchée non par le vocabulaire mais par la STRUCTURE : tout port dont un adaptateur franchit une frontière d'infrastructure — socket, HTTP, disque, base — doit déclarer son mode d'indisponibilité au contrat, et l'exigence doit dire ce qu'il advient du geste utilisateur quand il survient (refus ferme ou dégradé, et lequel). Mécanisable côté development en complément : un port `Protocol` dont aucune méthode ne documente d'exception, alors que l'un de ses adaptateurs ouvre une socket ou un client HTTP, est un contrat incomplet. Sur ce produit, cinq ports sont dans ce cas. |

## Confirmations positives

- **La télémétrie a rendu le diagnostic possible en une lecture.** `ContainerAppConsoleLogs`
  portait la trace complète avec le fichier, la ligne et le type d'exception. Sans elle, le
  seul symptôme disponible était « Connexion perdue » — c'est-à-dire une accusation portée
  contre le réseau de l'utilisateur. Le journal structuré `http_request` avec `request_id`,
  posé par `RequestContextMiddleware`, a permis de rattacher la trace à la requête exacte.
  À conserver tel quel, et à considérer comme le prérequis de RG-22 : une vérification
  post-déploiement sans journal exploitable ne dirait que « ça ne marche pas ».
- **Le correctif RG-20 du matin a fonctionné, et c'est ce qui a rendu ce défaut-ci
  diagnosticable.** Avant lui, l'écran affichait « Une erreur est survenue. Réessayez. » pour
  toute cause. Après lui, il affichait « **Connexion perdue** » — message faux quant à la
  cause, mais qui a immédiatement écarté les six refus serveur et orienté vers un échec de
  transport. Le tri a fonctionné dans le bon sens : un message plus précis a fait gagner le
  premier quart d'heure du diagnostic.

## Ordre recommandé

1. **RG-22** — le seul des trois qui aurait empêché la panne d'atteindre l'utilisateur. C'est
   aussi celui qui manque à toutes les chaînes, pas seulement à celle-ci : déployer sans
   vérifier le déploiement est un défaut de forme, indépendant du produit.
2. **RG-23** — dix lignes de test et une règle statique. Le meilleur rapport gain/effort du
   lot, et il ferme le symptôme qui a coûté le diagnostic. À traiter avec RG-20, dont il est
   le pendant serveur.
3. **RG-24** — durcissement de conception, sans dépendance. À embarquer avec RG-18 et RG-21
   si l'un des deux est ouvert : les trois sont la même mécanique d'exigence-type, sur trois
   déclencheurs différents.
