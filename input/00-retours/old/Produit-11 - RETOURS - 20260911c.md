# Retours forges — Produit-11 — 20260911c

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : suite directe du lot `20260911b`. Celui-ci portait ce que la **correction** de
  l'audit tiers avait révélé ; ce lot-ci porte ce que le **redéploiement** a révélé — trois runs
  d'intégration continue (14572, 14583, 14589), tous rouges, aucun sur un défaut du produit.
- **Références ledger** : `forge\ledger.jsonl` seq 175
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le sas d'arrivée du pilot
  `digit-ai-factory\input\00-retours\_arrivee\` — l'original reste ici (historique du produit).
- **Statut** : a_remettre

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "forge\retours\Produit-11 - RETOURS - 20260911c.md"
> ```

**Numérotation** : BAV2 tient une séquence `RT-nn`. RT-1 … RT-62 sont consommés au 11/09, la
collision signalée en RT-62 comprise. Ce lot continue en **RT-63 … RT-64**.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou
*produit+générique*.

---

## Le fait mesuré, avant toute interprétation

Une suite de bout en bout de 93 spécifications rend **93 vertes en local**, six exécutions de
suite, avec la commande exacte de la chaîne. La même suite, sur l'agent d'intégration continue,
rend **92 sur 93** — deux fois, sur la même spécification.

L'instantané de page archivé au second de ces deux runs donne la réponse en une lecture : au
moment même de l'échec, l'écran affichait le message que la spécification attendait du serveur.
Le produit avait fait exactement ce qui lui était demandé. C'est le **test** qui posait son
écoute réseau *après* l'action qu'elle devait observer, et l'aller-retour s'achevait, sur une
machine où les trois conteneurs partagent l'hôte, avant que l'écoute ne soit en place.

**Deux faits séparés se cachent là-dedans, et c'est ce qui fait ce lot.** Le premier est le
défaut lui-même — un test qui mesure la vitesse de la machine et non le produit, invisible tant
qu'il ne change pas de machine. Le second est **ce qu'il a coûté** : le premier run rouge n'a
rien laissé à lire, parce que l'étape qui archive les pièces de la recette n'avait, depuis sa
naissance, jamais produit son artefact — et qu'un `continueOnError` avalait son échec. Il a
fallu un run entier pour réparer l'archivage, et un autre pour obtenir la réponse.

---

## digit-ai-forge-development et digit-ai-forge-tests (socle des suites de bout en bout)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-63 | majeur | générique | **Une attente d'événement posée APRÈS l'action qu'elle observe mesure la vitesse de la machine, pas le produit — et le défaut est invisible jusqu'au jour où la suite change de machine.** Mesure : `frontend/tests/e2e/09-import-en-masse.spec.ts` posait `page.waitForResponse(...)` après `click()`. Sur poste, 93/93, six exécutions de suite ; sur l'agent, où le front, le relais et l'API sont trois conteneurs du même hôte, l'aller-retour s'achevait avant l'abonnement : **deux runs rouges sur deux** (14583, 14589), sur un délai de 30 s dépassé. L'instantané archivé prouve que le produit avait répondu correctement — l'écran affichait déjà le motif attendu du serveur. Les **cinq autres** attentes du même fichier posaient déjà leur promesse avant l'action : l'écart était un accident d'écriture, sans rien pour le voir. Aucune règle du socle, aucun lint, aucun oracle ne juge cet ordre, alors que la documentation Playwright l'écrit noir sur blanc. | Règle de socle, avec son contrôle **statique** — c'est ce qui la rend applicable sans exécuter quoi que ce soit : **toute attente d'événement se déclare avant l'action qui le déclenche**. Le motif fautif est reconnaissable à la lecture : un `await page.waitFor*(` qui suit, dans le même bloc, un `await`  d'action (`click`, `fill`, `press`, `setInputFiles`). Une règle ESLint de dépôt suffit, ou une passe de l'oracle de tests. Le symétrique vaut aussi et coûte un run : une attente déclarée et **jamais attendue** laisse une promesse rejetée orpheline. Classe proposée : `attente-posee-apres-l-action-observee`. |
| RT-64 | **bloquant** | générique | **Une étape d'archivage de preuves qui n'a jamais produit son artefact, sous `continueOnError`, est une porte qui ne mesure rien — et on ne s'en aperçoit que le jour où l'on en a besoin.** Mesure : l'étape « Archiver les résultats de la recette » publiait `frontend/tests/e2e/resultats.json`. Ce fichier n'a **jamais existé**, à aucun run : l'option `--reporter=list` passée en ligne de commande **remplace** le tableau de rapporteurs de la configuration au lieu de s'y ajouter, et la configuration était seule à demander le rapporteur JSON. L'étape échouait donc à chaque exécution avec `Not found PathtoPublish`, et `continueOnError: true` la rendait verte. Constaté dans le même run : une seconde étape d'archivage, sur un autre chemin, dans le même état. Conséquence chiffrée : le premier échec réel de la recette n'a laissé **ni trace, ni capture d'écran, ni instantané de page** — il a fallu un run entier pour réparer l'archivage avant de pouvoir diagnostiquer quoi que ce soit. | Deux règles jumelles. (1) **Une étape d'archivage prouve au moins une fois qu'elle produit son artefact**, sinon elle n'est pas une étape d'archivage : contrôle mécanique en fin de run — tout `PublishBuildArtifacts` dont le chemin est absent est un **échec**, jamais un avertissement, quel que soit `continueOnError`. (2) **Les pièces d'un échec s'archivent, pas seulement son résumé** : traces, captures et contextes de page, sous `succeededOrFailed()`. C'est le prolongement direct de RT-59 (« une porte est un contrôle qui peut être rouge ») appliqué à l'outillage du diagnostic : *un archivage qui ne peut pas échouer n'archive rien*. Classe voisine : `controle-sans-fixture-double-sens`. |

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Trois étages de la chaîne installaient encore Node 20 après le correctif, ceux que l'échec n'avait pas fait rougir | contrôle `ME-04` écrit et versé au référentiel d'audit Client-A, puis les six étages alignés | non **ici** | La classe est générique — « corriger là où la panne pointe laisse en place ce qu'elle n'a pas atteint » — mais la règle de parité entre la version de la chaîne et celle de l'image est **déjà** portée par RT-61 du lot `20260911b`. Y ajouter une ligne ferait doublon ; le fait nouveau (le correctif partiel) est signalé dans la proposition de RT-61 plutôt qu'en retour séparé. |
| Le manifeste d'inventaire des endpoints avait dérivé sur quinze entrées sans que rien ne s'en aperçoive | le contrôle qui le confronte au code a été armé, et il l'a vu | non | Le contrôle existait déjà et fait exactement son travail. Ce qui manquait, c'est qu'il soit **appelé** — et c'est RT-60 du lot précédent, mot pour mot : un outil déclaré et non appelé est un outil qui n'existe pas. |
| Deux générateurs de livrables lisaient leur gabarit dans un dossier exclu par `.gitignore` : verts sur un poste, rouges sur l'agent | repointés sur la copie versionnée, avec message d'absence explicite | non | Cas particulier d'une classe déjà remontée (`C-03`, le kit invisible à la chaîne), et déjà corrigée à sa racine. Le reste est une conséquence à nettoyer chez le produit, pas une règle neuve. |
| Le générateur d'un livrable HTML ne posait pas les composants du socle : chaque régénération les perdait en silence | le générateur les pose lui-même en fin de production | **oui, et c'est déjà écrit** | Un générateur dont la sortie n'est pas livrable sans un geste mémorisé n'est pas un générateur. La règle appartient au socle des pages produites ; elle est couverte par la doctrine `embarquer-composants.mjs --constat` que le squelette fournit déjà — le produit ne l'appelait pas. Rien à ajouter : l'outil existe, il n'était pas câblé. |

## Retours sur les documents produits

Un document a été produit sur ce lot depuis le squelette `gd-rapport-donnees` : le ré-audit
`20260911b`. Aucun défaut de forme nouveau à signaler — les trois règles demandées au lot
précédent (listing unique, largeur suivant le nombre de colonnes, largeur homogène) tiennent, et
les quatre domaines d'oracles passent. Le seul défaut trouvé sur ce document est celui des
composants perdus à la régénération, traité ci-dessus comme remarque restée au produit.

## Confirmations positives

- **L'archivage corrigé a rendu sa réponse au premier run suivant.** L'instantané de page
  Playwright, une fois publié, a fait passer le diagnostic de « non reproductible » à « cause
  établie » en une lecture. Le retour sur investissement d'une étape d'archivage qui fonctionne
  se mesure en runs entiers.
- **La règle « une porte est un contrôle qui peut être rouge » a tenu trois fois de suite.** Les
  portes armées au lot précédent ont refusé le déploiement à chacun des trois runs, et à chaque
  fois sur un défaut réel. Aucune n'a été desserrée pour faire passer le lot.
- **Le contrôle neuf a mordu dès sa première exécution**, sur un défaut que l'échec qui l'avait
  inspiré n'avait pas révélé. C'est exactement ce qu'on attend d'un contrôle écrit après une
  panne : qu'il en trouve plus que la panne.

## Ordre recommandé

1. **RT-64 d'abord.** Il ne coûte presque rien — une vérification de chemin en fin de run — et
   il conditionne la capacité à diagnostiquer tous les autres. Tant qu'un échec ne laisse rien à
   lire, chaque question coûte un run.
2. **RT-63 ensuite.** La règle est écrite dans la documentation de l'outil ; ce qui manque est un
   contrôle qui la joue. Une règle de lint de dépôt suffit, et elle vaut pour toute suite de bout
   en bout, quel que soit le harnais.

## La règle qui aurait évité le retour (TF-0779)

**Pour RT-63**, la règle existe — chez l'éditeur de l'outil, pas au socle. Playwright documente
explicitement que l'attente se déclare avant l'action ; aucun référentiel Factory ne la reprend,
et aucun oracle ne la joue. C'est le cas de figure § 4 de `quality-oracles` : la règle est
connue, elle n'est jugée par personne. Classe retenue : `regle-ecrite-sans-oracle-qui-la-joue`,
en attendant la classe propre proposée ci-dessus.

**Pour RT-64**, la règle la plus proche est `controle-sans-fixture-double-sens` — un contrôle
qui n'a jamais été vu rouge n'est pas un contrôle. Le cas présent en est la variante la plus
coûteuse : un contrôle qui n'a jamais été vu **vert**, et qui rendait vert quand même. Je retiens
cette classe pour ne pas bloquer l'ingestion, et je propose au pilot d'y adjoindre le cas
symétrique : **une étape dont la sortie n'a jamais été produite une seule fois**.
