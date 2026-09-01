# Retours forges — Client-A-POC-to-Prod — 20260831c

- **Contexte** : troisième lot du jour, et il n'était pas prévu. Il est né **du geste d'ingestion
  lui-même** : en poussant les deux lots précédents au registre du pilot, la chaîne a laissé le
  nom du client dans un fichier **suivi par git**, dans un dépôt **public**.
- **Références** : ingestions du 2026-08-31 (lots `6e7977d09093` et `9ffd13eccaf0`,
  candidatures TF-0704 à TF-0711) ; sorties de `todo/ingerer-lot.mjs` et de
  `oracles/oracle-boite-entree.mjs` citées ci-dessous.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : **remis le 2026-08-31**

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Ce que ce lot documente.** L'anonymisation à l'entrée fonctionne — sur la candidature. Elle
laisse passer le **nom du fichier source**, recopié tel quel dans la ligne d'événement
`ingestion` du registre. Deux lignes, deux occurrences du nom du client, dans un fichier
versionné d'un dépôt public. Le module `anonymiser-entrant.mjs` énonce lui-même la règle que ce
défaut viole : *« anonymiser à moitié serait pire que ne pas anonymiser, parce que le registre
passerait pour propre »*. C'est exactement ce qui s'est produit : la sortie affichait
`[ANONYMISÉ] 3 nom(s) substitué(s)`, et le nom était dans le fichier deux lignes plus bas.

---

## digit-ai-factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-11 | **bloquant** | générique | **L'anonymisation à l'entrée couvre la candidature, pas l'événement d'ingestion — et l'événement porte le nom du client, dans un fichier suivi par git.** Mesuré à l'instant, deux fois. `todo/ingerer-lot.mjs` appelle bien `anonymiserCandidature()` sur chaque candidature : la sortie affiche `[ANONYMISÉ] produit « <client>-<projet> » → Produit-12` et `3 nom(s) substitué(s) avant écriture au registre`. Mais la ligne `{"ev":"ingestion",…,"fichier":"input/00-retours/<client>-<projet> - RETOURS - 20260831a.tf.jsonl",…}` est écrite **sans passer par la substitution**, et `input/00-retours/` est certes hors git — `todo/TODO.jsonl`, lui, **est suivi**. Deux occurrences du nom du client se sont donc retrouvées à un `git commit` d'un dépôt public. C'est la classe d'incident du 27/08, celle qui a coûté la réécriture de dix dépôts, 115 fichiers et 648 occurrences — et le mécanisme censé l'empêcher était en place et actif. **Un contrôle qui annonce « anonymisé » pendant qu'il laisse fuir est pire qu'un contrôle absent** : il retire au relecteur la raison de regarder. | Faire passer le champ `fichier` de l'événement par la même substitution que la candidature — une ligne. Mieux : **n'y consigner que ce dont l'idempotence a besoin**, c'est-à-dire le `lot_sha`, plus le nom déjà pseudonymisé ; le chemin d'origine n'apporte rien que le sha n'apporte, et il porte tout le risque. Et une fixture double sens : un lot dont le NOM DE FICHIER porte un nom interdit doit sortir un registre propre. Aucune des fixtures actuelles ne teste ce chemin, sinon le défaut serait rouge. |
| RT-12 | majeur | générique | **L'avertissement R-47 sur l'héritage arrive à l'ingestion — c'est-à-dire après la remise, chez celui qui ne peut plus rien en faire.** L'ingestion a rendu : `[R-47 — AVERTISSEMENT] héritage du pilot non tenu — 7 absent(s)`, dont `forge/retours/oracle-lot.mjs` (source `gabarits/oracle-lot-retours.mjs`), `forge/retours/RETOURS-FORGES.md`, `forge/hooks/factory.mjs`, et 3 périmés. **C'est la cause concrète et mesurée de RT-2**, remonté le 27/08 : je n'avais pas l'oracle de lot sous la main, donc je n'ai pas pu vérifier mes lots avant de les remettre — et je l'ai appris en les remettant. Le pilot, lui, le savait : il tient le référentiel `gabarits/HERITAGE.json` et sait dire à la porte ce qui manque. L'information existe, elle circule dans le mauvais sens. | Faire **descendre** le contrôle : que R-47 s'exécute chez le produit — au premier `forge/` créé, ou par un hook de session — et pas seulement à la porte du pilot. C'est le même geste que RT-7 du lot `20260831b` demande pour les retours : le pilot sait des choses que le produit devrait savoir *avant* d'agir, et il ne les lui dit qu'après. Un avertissement juste, arrivé trop tard, est un avertissement perdu. |

**Portée** (R-45) : les deux retours sont de portée *générique*. RT-11 concerne tout produit qui
remet un lot ; RT-12 tout produit qui hérite du pilot.

## Confirmations — ce qui a bien fonctionné

| Objet | Constat |
|---|---|
| **L'anonymisation de la candidature** | Elle marche, et bien : le produit a reçu un pseudonyme stable (`Produit-12`), la table s'est **étendue toute seule** sur un produit qu'elle ne connaissait pas, et les tables vivent hors des dépôts comme la doctrine l'exige. Le défaut de RT-11 n'est pas de conception, c'est un chemin d'écriture oublié. |
| **L'ingestion elle-même** | Validation atomique, ids frappés par un écrivain unique, idempotence par empreinte du sidecar, tout en statut `candidat` — *« l'automatique s'arrête là, la décision reste humaine »*. Huit candidatures créées, registre cohérent, oracle de boîte d'entrée repassé à **PASS**. Rien à redire. |
| **Le refus de punir deux fois** | `Le lot est INGÉRÉ quand même : refuser ici punirait deux fois le même défaut` — sur l'avertissement d'héritage. C'est un bon arbitrage, écrit dans le code, et il évite le blocage circulaire où un produit mal outillé ne peut plus rien remonter. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| J'ai neutralisé à la main les deux champs `fichier` des événements d'ingestion dans `todo/TODO.jsonl` du pilot, en y substituant le pseudonyme que la chaîne avait elle-même attribué. Le `lot_sha` et le compte de créations sont conservés : l'idempotence et la traçabilité restent entières. | Redaction ciblée, 2 lignes, registre revérifié — 82 lignes JSON valides, 8 candidatures intactes, zéro nom de client ou de produit dans les fichiers suivis. | **oui** | Geste de mise en sécurité, pas de correction : **le défaut est dans la chaîne et se reproduira au prochain lot remis par n'importe quel produit**. Remonté en RT-11. Le nom du fichier de CE lot-ci le reproduira d'ailleurs à son ingestion. |
| Mon dépôt ne tient pas l'héritage du pilot : 7 fichiers absents, 3 périmés. | Non corrigé — porté au registre du produit. | non | Défaut de mon dépôt, pas de la forge. Ce qui est généralisable, c'est le **moment** où on l'apprend : remonté en RT-12. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** — ce lot ne produit pas de livrable, il documente un
défaut rencontré en poussant deux lots au registre. La famille de gabarit manquante pour les
livrables de ce projet est déjà remontée en **RT-6** du lot `20260831a`.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| *(aucun — lot d'incident)* | sans objet | Une **fixture double sens sur le nom de fichier** : aucun test ne couvre le chemin par lequel le nom a fui. | Sans objet : le défaut a été trouvé par un contrôle que le produit a écrit après l'ingestion, pas par un lecteur. | Un contrôle de fuite après ingestion — six motifs cherchés dans les fichiers suivis par git. Il devrait vivre dans la chaîne, pas chez moi. | **générique** |
