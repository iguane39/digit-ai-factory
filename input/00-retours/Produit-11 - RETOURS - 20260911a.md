# Retours forges — Produit-11 — 20260911a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : mandat du 11/09/2026 — production d'un **plan de tests de sécurité (PenTest)** pour BAV2,
  puis trois retours humains successifs : (1) « le format du prompt de sortie n'est pas toujours respecté,
  corrige et remonte encore une fois à la Factory » ; (2) « la forge web sécurité n'a pas été utilisée,
  remonte pour que ce ne soit plus jamais le cas » ; (3) « un manque vis-à-vis de la Factory doit être
  remonté sans que l'humain ait à le demander — fais-le, et remonte le principe pour tous les projets ».
- **Références ledger** : `forge\ledger.jsonl` seq 171 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-09-11

**Numérotation** : BAV2 tient une séquence `RT-nn` ; RT-1 … RT-49 sont consommés. Ce lot
continue en RT-50 … RT-52.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Le fait mesuré, avant toute interprétation

Session ouverte à la racine **englobante** `c:\dev\_Client-A\BourseAuxVacants2`, config active
`CLAUDE_CONFIG_DIR=.claude-b`. Le produit instancié vit dans `bav-dev\` (et `Produit-11\`),
dont le `.claude\settings.json` câble **quatre** hooks de la doctrine : `SessionStart` (fraîcheur),
`Stop` (**restitution jugée à la fin de chaque tour**), `PostToolUse` (page-html), `UserPromptSubmit`
(lexique). Le `.claude\settings.json` posé le 09/09 à la racine englobante ne reprend **que**
`UserPromptSubmit` — les trois autres, dont la restitution, sont **volontairement** laissés de côté,
en attente de l'arbitrage **TF-0963** (constaté RA-02 du lot `Produit-11 - RETOURS - 20260909a`).

Conséquence observée sur ce mandat, mesurable :

| Symptôme | Preuve |
|---|---|
| Aucune restitution de fin de tour au format en dix blocs, aucun fichier de restitution écrit, aucun verdict | Aucun hook `Stop` ne s'est exécuté de tout le mandat — racine sans `.claude\` reprenant ce hook, et config `.claude-b` |
| Un livrable produit déposé hors convention dans `proposition-tests\livrables\` | Corrigé ensuite sur demande humaine — classe existante `emplacement-livrable-hors-convention` |
| Un contrôle de sécurité **écrit à la main par lecture de code** au lieu de l'oracle du domaine | La forge `digit-ai-forge-websec` (ASVS L1, WSTG, oracles SCA/exposition/DAST) existe et n'a pas été cherchée |
| Trois écarts vis-à-vis de la Factory remontés **seulement après relance humaine** | Le canal existe (ce lot), le déclencheur automatique — le hook `Stop` — ne s'est pas exécuté |

Les trois retours humains décrivent donc trois symptômes dont **deux partagent une racine** :
le juge de fin de tour ne tourne pas dans une session à racine englobante sous `.claude-b`.

---

## factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-50 | majeur | produit+générique | **Un contrôle de sécurité a été écrit à la main faute d'avoir cherché l'oracle du domaine.** Le plan de PenTest a été construit par lecture du code du produit, alors que `digit-ai-forge-websec` fournit deux référentiels curés (`referentiels\asvs-l1.md`, `referentiels\wstg-cas.md`) et trois oracles exécutés (`oracle-sca`, `oracle-exposition`, `oracle-dast`). C'est exactement la classe `oracle-remplace-par-controle-maison`, fondée par TF-0757 (RT-2 du 27/08, reproduite le 31/08) : **récidive**. Preuve du coût : un livrable entier réécrit dans sa provenance, un aller-retour humain, et l'exécution a posteriori de `oracle-sca` (SKIP motivé faute de `package-lock.json`) qui aurait dû précéder la rédaction. | Rendre le réflexe mécanique : avant tout livrable **de sécurité**, la loi `quality-oracles` doit imposer la consultation du **registre d'oracles** ET, pour ce domaine, nommer explicitement `digit-ai-forge-websec` comme oracle exécuté attendu. Un livrable de sécurité sans trace d'exécution d'au moins un oracle de la forge est un livrable non vérifié. |
| RT-51 | majeur | générique | **Une session ouverte à la racine ENGLOBANTE d'un produit échappe au juge de fin de tour, et livre donc une sortie non jugée.** Le hook `Stop` (restitution) vit dans le `.claude\settings.json` du produit ; la racine englobante ne le reprend pas (choix assumé, TF-0963 en attente) et `CLAUDE_CONFIG_DIR=.claude-b` détourne de toute façon la lecture des réglages du dépôt. Résultat : le format du prompt de sortie n'est ni imposé ni mesuré — **récidive** du défaut des 08/09 (seq 168-169, RT-43…47) et de TF-0963. | Deux voies, à trancher par le pilot : soit reprendre le hook `Stop` au niveau englobant (l'objet même de TF-0963), soit **détecter et refuser/avertir** l'ouverture d'une session à un niveau qui n'exécute aucun hook de la doctrine — « un hook qui ne s'exécute pas ne se distingue pas d'un hook qui approuve ». Classe existante la plus proche portée au sidecar : `boucle-retour-sans-descente`. Classe proposée au pilot : `session-englobante-echappe-au-jugement-de-fin-de-tour`. |
| RT-52 | majeur | générique | **Un écart vis-à-vis de la Factory détecté en cours de mandat n'est pas remonté tant qu'un humain ne le demande pas.** Sur ce mandat, trois écarts (emplacement, oracle non utilisé, format de sortie) ont été corrigés ou notés localement et remontés **seulement** après relance. Le seul déclencheur automatique de remontée est le hook `Stop`/restitution, via sa section « Remarques restées au produit » (R-45) — précisément le hook qui ne s'exécute pas ici. La remontée automatique **dépend donc d'un mécanisme qu'une session à racine englobante désactive**. | Rendre l'obligation de remontée **indépendante du hook** : inscrire dans la loi de socle (`quality-oracles` / `CLAUDE-PRODUIT.md`) qu'un écart socle détecté en cours de travail **s'écrit en retour dans le tour où il est détecté**, sans attendre la fin ni une relance humaine — une obligation de l'agent, pas seulement du hook. Puis, une fois ingérée au pilot, cette règle **redescend à tous les projets** de la Factory. Classe proche portée au sidecar : `boucle-retour-sans-descente`. Classe proposée : `ecart-socle-detecte-non-remonte-sans-relance-humaine`. |

**Portée** : *générique* — vaut pour tout projet employant la Factory ; *produit+générique* —
le produit l'a corrigé chez lui ET la classe vaut ailleurs.

---

## Remarques restées au produit

Ce que le produit a corrigé chez lui sur ce mandat, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le plan de tests de sécurité était déposé dans `proposition-tests\livrables\` (sortie de la forge de tests), pas dans le produit | Déplacé en `bav-dev\docs\projet\PLAN-TESTS-SECURITE.md`, nommé à la convention du dossier | **oui** | Classe existante `emplacement-livrable-hors-convention` (R-4). Corrigé localement ; le défaut a été commis, il vaut d'être compté |
| L'en-tête du plan revendiquait une rédaction « à la main, distincte des cahiers à sceau Forge » — un habillage du contournement de l'outillage | Réécrit pour pointer la provenance réelle : forge websec, référentiels ASVS/WSTG, oracles, dont `oracle-sca` déjà exécuté | non | Correction de formulation propre à ce livrable |
| Le réflexe « chercher l'oracle du domaine avant d'écrire un contrôle » n'a pas joué | Deux mémoires de travail écrites (forge websec pour la sécurité ; livrable produit hors dossier Factory) | **oui** | C'est RT-50 et RT-52 ci-dessus ; la mémoire locale ne remplace pas la règle de socle |

---

## Retours sur les documents produits

**aucun document produit depuis un gabarit** sur ce mandat : le seul document produit,
`docs\projet\PLAN-TESTS-SECURITE.md`, n'est **rattaché à aucune famille de gabarit** (aucun id
`gd-…`, aucune `version_du_gabarit`) ni à un oracle de forme — et c'est précisément le retour.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `docs\projet\PLAN-TESTS-SECURITE.md` | aucun — aucune famille de gabarit ne couvre un plan de tests de sécurité | un point d'entrée qui impose de **dériver** le plan des référentiels de `digit-ai-forge-websec` (ASVS L1 + WSTG) et d'y **exécuter** ses oracles, plutôt que de lire le code | le plan a d'abord été écrit sans identifiants ASVS/WSTG et sans exécution d'oracle — colonne de rattachement absente | provenance forge websec, mapping ASVS/WSTG à faire, exécution `oracle-sca` (SKIP motivé) | générique |

**Enseignement** : un livrable de sécurité est aujourd'hui le seul type produit sans gabarit ni
oracle de forme. Une famille de gabarit « plan de tests de sécurité », adossée aux référentiels
de la forge websec, fermerait la classe de RT-50 à la source.

---

## La règle qui aurait évité le retour

- **RT-50** — **couverte par une classe existante** : `oracle-remplace-par-controle-maison` (TF-0757).
  Le défaut est une **récidive** : la règle existe, elle n'a pas été rencontrée dans une session
  où aucun hook de fraîcheur ne s'est exécuté. Le remède n'est pas une nouvelle règle, c'est que
  la règle atteigne l'agent — voir RT-51.
- **RT-51** — **partiellement couverte par TF-0963** (arbitrage en attente sur la portée des hooks
  au niveau englobant). Ce lot en est une **récidive datée** : tant que TF-0963 n'est pas tranché,
  toute session à racine englobante livre une sortie non jugée. Classe dédiée proposée :
  `session-englobante-echappe-au-jugement-de-fin-de-tour`.
- **RT-52** — **aucune règle ne la couvre** : la remontée d'un écart socle repose aujourd'hui sur
  le seul hook de fin de tour, donc sur une condition d'environnement. La règle manquante fait de
  la remontée une **obligation de l'agent dans le tour**, indépendante du hook. Classe à créer au
  référentiel du pilot : `ecart-socle-detecte-non-remonte-sans-relance-humaine`.
