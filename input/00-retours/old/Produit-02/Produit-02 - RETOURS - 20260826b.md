# Retours forges — Produit-02.com — 20260826b

- **Contexte** : traitement du lot de travaux `pilot - TRAVAUX - 20260826b` (`TF-0626`,
  artefacts d'héritage). Sept artefacts recopiés, deux conditionnels déclarés en écart.
  Les deux retours ci-dessous sont nés **du traitement lui-même**.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 55, 56
  (entrées `type: retour`) — le ledger de ce projet vit sous `runs\<run-id>\`, divergence
  déjà remontée en **RT-6**.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce que le traitement de TF-0626 a révélé

Ce chapitre existe parce que les deux retours de ce lot ne viennent pas d'une revue mais de
l'application d'un lot de travaux : ce sont des frictions rencontrées en faisant, pas en
cherchant.

Le lot `TF-0626` relevait neuf artefacts d'héritage absents. Sept ont été recopiés depuis
`gabarits\`, en suivant les chemins **déclarés par le contrat** `HERITAGE.json` et non
déduits des cibles. Le relevé du pilot est passé de **9 manques à 2** sans aucun
`DIVERGENT`. Les deux restants sont les conditionnels `robots.txt` et `llms.txt`, et c'est
là que le premier retour commence.

## Les deux retours

Le premier porte sur une supposition de la sonde d'héritage, le second sur une règle qui
prescrit un emplacement inexistant.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-45 | majeur | **La sonde d'héritage suppose que la racine web est la racine du dépôt.** `robots.txt` et `llms.txt` sont comptés **ABSENT · majeur** pour ce projet. Ils ne le sont pas : ils existent en `site/robots.txt` et `site/llms.txt`, et répondent **200** en production sur `https://www.Produit-02.com/`. La racine web de ce produit est `site/` — c'est le répertoire servi par Railway (`SITE_DIR`, `serve site`). Le lot proposait deux lectures, « surface web et fichiers manquants » ou « pas de surface web, absence légitime » : **aucune des deux n'est vraie ici**. Conséquence si le travail était appliqué tel quel : deux fichiers déposés à la racine du dépôt, **jamais servis**, et une exigence qu'on croirait satisfaite. Le `llms.txt` réel est par ailleurs contrôlé par `build/check-llms.mjs`, qui le confronte aux sources du projet. | Un artefact à surface web se cherche à la **racine web déclarée du produit**, pas à la racine du dépôt. Le contrat `HERITAGE.json` gagnerait un champ — `racine_web`, déclaré par le produit, valant `.` par défaut. Là où le produit n'en déclare pas, la sonde le **dit** au lieu de conclure : c'est la discipline que **RT-32** demande aux recherches, appliquée ici à un relevé de conformité. Un troisième verdict manque à la sonde, à côté de « présent » et « absent » : **« cherché au mauvais endroit »**. |
| RT-46 | majeur | **Le carnet des « Écarts assumés » est prescrit et son emplacement n'existe pas.** `forge\travaux\TRAVAUX-PILOT.md` impose qu'un élément écarté « rejoigne les *Écarts assumés* du carnet du produit avec son motif et sa date (**R-20 bis**) », et ajoute — justement — qu'« un écart tu est indiscernable d'un oubli ». Mais **aucun gabarit ne crée ce carnet**, et `R-20 bis` n'est défini nulle part de trouvable : ni dans `gabarits\`, ni dans les documents du pilot accessibles depuis ce poste. Le seul endroit où la chaîne apparaît est la phrase qui l'invoque. Coût mesuré : pour déclarer le seul écart de ce lot, l'emplacement a dû être **déduit** — `forge\ECARTS-ASSUMES.md` — et le fichier porte lui-même la mention qu'il a été placé par défaut. | Ajouter le carnet aux artefacts d'héritage de `HERITAGE.json`, en mode `presence` : le gabarit crée un carnet vide portant sa consigne, et le relevé le compte comme les autres. Et définir `R-20 bis` là où les règles de socle se lisent. C'est exactement le motif de **RT-42** remonté la veille — *toute règle de socle exprimable comme un fichier doit être livrée comme un fichier* — attrapé ici sur un artefact du pilot lui-même, moins de vingt-quatre heures après. |

## Ce que ces retours ne couvrent pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

Le **contenu** des sept artefacts recopiés n'a pas été jugé : ils sont en mode
`copie_conforme`, leur forme est jugée au pilot, et les faire diverger casserait ce
jugement. Ce lot ne dit donc rien de leur qualité, seulement qu'ils sont désormais présents
et identiques.

## Remarques restées au produit

Ce que le produit a corrigé chez lui sans le remonter, chacune avec son verdict de
généralisation.

| Corrigé chez le produit | Verdict de généralisation |
|---|---|
| Les sept artefacts d'héritage recopiés, et le statut du lot de travaux passé à `traite le 2026-08-26` | **Rien de généralisable** — c'est l'application nominale de `TF-0626`, exactement ce que le lot demandait. |
| `forge\ECARTS-ASSUMES.md` créé pour porter l'écart `robots.txt`/`llms.txt` | **Généralisable → REMONTÉ en RT-46.** Le fichier reste chez le produit et se déplacera si un emplacement officiel est publié. |
| `.gitignore` complété (`__pycache__/`, `Old/`) et 29 archives `Old/` sorties du suivi git | **Généralisable → REMONTÉ en RT-42** (lot `20260826a`). |
| Les 16 faux positifs de `check-traductions` classés à la main, la liste d'exemptions n'étant pas encore écrite | **Généralisable → REMONTÉ en RT-43** (lot `20260826a`). Le tri reste manuel chez le produit tant que le mécanisme n'existe pas. |
| Le découpage du travail en trois commits (`fix` / `feat` / `chore`) plutôt qu'un seul | **Rien de généralisable** — la convention Conventional Commits du socle le couvre déjà. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit.** Aucun des six gabarits de
`gabarits\documents\` — `diagnostic-exploitation`, `dossier-architecture-technique`,
`dossier-exploitation`, `rapport-de-donnees` et leurs voisins — n'a servi sur ce projet :
aucun document du dépôt ne porte d'identifiant `gd-…`. La section est donc déclarée vide,
elle n'est pas omise.

Deux observations tombent **hors du périmètre de R-46**, qui vise les livrables issus de
`gabarits\documents\`, et sont consignées ici faute de canal plus juste — le pilot jugera
si elles relèvent d'ailleurs.

D'abord, les **treize lots de retours** `20260823a` → `20260826a` ont été produits sans le
gabarit de méthode `RETOURS-FORGES.md`, absent du dépôt jusqu'à `TF-0626`. Mesuré avec
`oracle-lot.mjs` le jour de son arrivée : **13 lots sur 13 en FAIL**, deux règles manquantes
chacun, tous refusables à l'ingestion — soit 45 retours écrits et aucun ingérable. Le pilot
l'avait déjà mesuré et `HERITAGE.json` le cite (« 15 candidatures refusées à l'ingestion »).
Les treize restent tels quels : *un fichier remis ne se modifie jamais*. Ce lot-ci est le
premier produit avec le gabarit.

Ensuite, un point de forme sur le gabarit lui-même : le chapitre **« Ce que ces retours ne
couvrent pas »** a été inventé indépendamment dans les treize lots, sans que le gabarit le
prévoie. Il déclare la **borne** du lot — ce que les retours ne prétendent pas traiter. Le
gabarit `TRAVAUX-PILOT.md` impose l'équivalent dans l'autre sens (« Ce que le pilot NE
demande PAS », vérifié par l'oracle T4). La symétrie manque peut-être.

## Confirmations positives

- **`oracle-lot.mjs` a payé dans la minute qui a suivi son arrivée.** Lancé sur le lot
  `20260826a` remis quelques minutes plus tôt, il a rendu FAIL avec les deux règles
  manquantes, leur motif et le geste de correction. Puis sur les douze précédents : treize
  sur treize. C'est exactement ce que le lot `TF-0626` annonçait — « sans lui, vous
  découvrez le refus après coup, ou jamais ».
- **Le lot de travaux est lucide sur son propre amorçage.** Il demande de jouer
  `forge\travaux\oracle-travaux.mjs` avant traitement, tout en sachant que cet oracle fait
  partie des artefacts qu'il livre — et il l'écrit : « Si ce fichier vous manque, l'héritage
  n'est pas tenu, et c'est précisément le sujet de ce lot. » Une dépendance circulaire
  déclarée n'en est plus une. L'oracle a été joué après copie : **PASS**, 5 règles tenues.
- **Le contrat `HERITAGE.json` déclare ses chemins source**, ce qui a permis de recopier sans
  jamais déduire une source d'une cible. Sur les sept artefacts, aucun `DIVERGENT` au
  relevé de contrôle.

## Ordre recommandé

1. **RT-45** — la sonde compte deux manques qui n'existent pas ; tant qu'elle regarde la
   racine du dépôt, tout produit dont la racine web diffère portera un écart permanent.
2. **RT-46** — le carnet, dont l'absence oblige chaque produit à inventer un emplacement
   différent, ce qui rend les écarts irrelevables à l'échelle de l'écosystème.
