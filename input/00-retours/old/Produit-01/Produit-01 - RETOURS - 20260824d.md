# Retours forges — Produit-01 — 20260824d

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : mise en œuvre complète de la stratégie de tests Front et e2e d'Produit-01
  (branche `test/mesure-couverture-par-fichier`), demandée le 24/08 après qu'un défaut
  d'affichage d'erreur eut été signalé **par une capture d'écran d'utilisateur** et non par un
  test. La construction de cette stratégie a mis au jour trois défauts non pas du produit,
  mais de la **manière dont une stratégie de tests est demandée, exécutée et rapportée**.
- **Références ledger** : `forge\ledger.jsonl` seq 62, 63, 64 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-24

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-26 consommés). Ce lot porte
RG-27, RG-28 et RG-29.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## La mesure qui porte ce lot

Une stratégie de tests avait été demandée pour ce produit, puis construite, puis validée. Le
24/08, le propriétaire du produit a posé la question qui ouvre ce lot :

> « J'avais demandé la construction et l'**exécution complète** de la stratégie de tests,
> pourquoi les tests Front n'ont pas été implémentés ? »

La réponse était embarrassante et instructive : **ils ne l'avaient pas été parce que rien, dans
la demande comme dans le rendu, ne disait qu'ils manquaient.** Le backend affichait 423 tests
et 87,9 % de couverture ; le Front affichait 137 tests et « 75 % », au-dessus du seuil. Toutes
les portes étaient vertes. La stratégie était donc réputée *exécutée*.

Elle ne l'était pas. Ce qui suit est ce que la mise en œuvre réelle a trouvé, en trois familles.

### (1) Le dénominateur n'était pas déclaré

`coverage.exclude` listait ce qu'on retire ; personne n'avait déclaré ce qu'on mesure. `e2e/**`
et `public/**` entraient donc dans le calcul, **comptés à 0 %**.

| | Chiffre affiché | Chiffre réel (périmètre `src/`) |
|---|---|---|
| Instructions | 75,33 % | **84,68 %** |
| Fonctions | 61,5 % | **62,92 %** |

Neuf points d'écart. Le sens de l'erreur importe peu : une couverture pouvait **monter** parce
qu'un fichier de recette avait été supprimé. Un chiffre dont le dénominateur n'est pas déclaré
n'est pas une mesure — c'est un nombre.

### (2) Le seuil global ne peut pas échouer sur un écran non testé

Le seuil était global : 70 % d'instructions, 60 % de fonctions sur tout `src/`. Il était vert.
Derrière ce vert :

| Fichier | Instructions | Ce que c'est |
|---|---|---|
| `Gouvernance.tsx` | **1,88 %** | délégations et accès partagés — du fonctionnel réel, écrit et livré |
| `CallbackPage.tsx` | **12,5 %** | le passage obligé de **toute** session |
| `DemandeCreate.tsx` | 82 % / **43,9 % de fonctions** | l'assistant de création — dont la branche d'erreur où vivait le défaut du jour |

Un seuil global ne voit pas une page à 1,9 % : les modules bien couverts, nombreux et petits,
compensent arithmétiquement les écrans, rares et gros. **Il n'existe aucune valeur de seuil
global qui aurait signalé `Gouvernance.tsx`** sans faire échouer tout le reste.

### (3) L'indicateur rapporté n'était pas celui qui portait le risque

`ActionsDemande.tsx` : **90,6 % d'instructions, 37,5 % de fonctions**. Les boutons étaient
*rendus*, presque aucun n'était *cliqué*. `OuEstLAction.tsx` : 33,3 % de fonctions.
`AdminConsole.tsx` : 25 % — trois quarts des gestionnaires de l'écran le plus sensible du
produit (export d'audit, réassignation d'approbation) jamais appelés.

Le rapport mettait les instructions en avant. C'est l'indicateur qu'un simple rendu suffit à
faire monter, donc celui qui rassure le plus et prouve le moins.

### Ce que la mise en œuvre a produit, une fois ces trois défauts corrigés

| | Avant | Après |
|---|---|---|
| Tests unitaires Front | 137 | **239** |
| Instructions / fonctions | 84,68 % / 62,92 % | **97,51 % / 87,22 %** |
| Écrans sous 50 % d'instructions | 2 | **0** |
| Tests e2e | 28 (dont 1 sauté en silence) | **33, zéro sauté** |
| Parcours e2e couvrant un **refus** | **0** | 5 |

Le dernier chiffre est le plus parlant. **La recette couvrait exclusivement les parcours qui
aboutissent.** Or le défaut signalé ce matin-là par capture d'écran était un refus mal
affiché — et il était structurellement hors d'atteinte de la suite.

---

## conception (`digit-ai-forge-conception`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-27 | bloquant | **Une demande de « stratégie de tests » n'a pas de périmètre imposé ni de critère de complétude : elle est réputée honorée quand un document existe, pas quand les tests existent et s'exécutent.** Sur Produit-01, la stratégie demandée a produit un backend réellement testé (423 tests, 87,9 %) et un Front **planifié** : 137 tests hérités, deux écrans à 1,88 % et 12,5 %, aucun parcours de refus, et un seuil vert au-dessus de tout cela. Rien n'était faux dans le rendu ; il manquait seulement la moitié du produit, et **aucune porte ni aucun rapport ne pouvait le dire**. Le défaut qui en est sorti — tout échec d'ajout de document affichant « Une erreur est survenue. Réessayez. », conseil faux dans six cas sur sept — a été signalé par un utilisateur avec une **capture d'écran**, jamais par la chaîne. **Point structurel** : c'est la quatrième instance du patron RG-18 / RG-21 / RG-25 — une intention énoncée sans sa contrepartie observable. Ici l'intention est « une stratégie de tests » et la contrepartie manquante est : *sur quels périmètres, et à quoi reconnaît-on qu'elle est faite ?* | Une **exigence-type dans `cat-con-03`** déclenchée par le vocabulaire des tests (« stratégie de tests », « couverture », « recette », « plan de tests »). Toute demande de stratégie doit énumérer ses **périmètres** et, pour chacun, l'un de **deux états seulement** : *implémenté et exécuté* (avec la mesure), ou *exclu* (avec le motif). Il n'existe pas de troisième état : **un plan n'est pas un test**. La liste minimale des périmètres, tirée de ce qui manquait ici : (a) chaque couche exécutable du produit — backend, front, workers ; (b) les **parcours de refus**, distinctement des parcours qui aboutissent ; (c) l'**accessibilité** ; (d) les chemins d'**erreur d'infrastructure** (indisponibilité, panne transitoire). Le point (b) mérite d'être obligatoire et non recommandé : c'est là que les utilisateurs se bloquent, et c'est le seul périmètre qui était à **zéro** ici alors que tout le reste était vert. |

## tests (`digit-ai-forge-tests`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-28 | majeur | **Un seuil de couverture GLOBAL ne peut pas échouer sur un écran non testé, et le dénominateur du calcul n'est jamais exigé d'être déclaré.** Trois faits mesurés sur Produit-01, tous sous un seuil vert : (1) `coverage.exclude` sans `include` faisait entrer `e2e/**` et `public/**` dans le dénominateur, **comptés à 0 %** — la couverture affichée était de 75,33 % là où le périmètre réel donnait **84,68 %**, soit neuf points de brouillard **dans les deux sens** : le chiffre pouvait monter parce qu'on avait supprimé un fichier de recette. (2) Le seuil global 70 % / 60 % était vert pendant que `Gouvernance.tsx` (délégations, accès partagés — du fonctionnel livré) vivait à **1,88 %** et `CallbackPage.tsx`, passage obligé de toute session, à **12,5 %**. Aucune valeur de seuil global n'aurait signalé ces deux fichiers sans faire échouer tout le reste. (3) L'indicateur mis en avant était les **instructions**, celui qu'un simple rendu suffit à faire monter : `ActionsDemande.tsx` affichait **90,6 % d'instructions et 37,5 % de fonctions** — les boutons étaient rendus, presque aucun n'était cliqué ; `AdminConsole.tsx` était à **25 % de fonctions** sur l'écran qui porte l'export d'audit et la réassignation d'approbation. | Trois règles `cat-tst-*`, toutes mécanisables et toutes vérifiables sur le fichier de configuration lui-même : **(a) le périmètre de mesure se déclare en positif** — un `include` explicite ; une configuration de couverture sans périmètre déclaré est un défaut, parce que son dénominateur dérive à chaque fichier ajouté ou retiré. **(b) le seuil porte PAR FICHIER** (`perFile`, ou l'équivalent de l'outil), afin qu'un écran neuf naisse au-dessus du plancher ou ne passe pas ; le seuil global peut rester, il ne suffit pas. **(c) le seuil sur les FONCTIONS est obligatoire à côté de celui sur les instructions**, et c'est lui qu'on rapporte en premier sur du code d'interface : une ligne couverte par un rendu ne prouve rien d'un geste utilisateur. Complément de doctrine, appris en posant le cliquet : **le plancher se cale sous le niveau atteint, pas dessus.** Un cliquet à ras de la mesure casse au premier remaniement légitime, et une porte qui casse pour rien finit désarmée — ici, niveau atteint 97,5 % / 87,2 %, plancher posé à 80 % / 60 %. |
| RG-29 | majeur | **Le reporting de tests rend invisibles les tests qui NE s'exécutent PAS — et un exécuteur qui ne trouve rien peut sortir en succès.** Quatre occurrences distinctes sur ce produit, toutes vertes : (1) trois tests d'intégration (Azurite, OIDC) **silencieusement ignorés en CI pendant des mois** — leurs gardes `skipif` les faisaient disparaître et `pytest -q` noyait les trois « s » dans 364 points ; l'un d'eux existait *parce qu'une régression réelle était déjà passée*. (2) Un `test.skip` **conditionnel** dans la recette d'accessibilité : le rapport disait « 27 passés, 1 sauté » et personne ne regardait lequel — un test qui peut cesser de tester sans le dire ment sur la couverture. (3) `npx playwright test` a rendu une fois **« No tests found » avec un code de sortie 0** (conflit de motif entre deux exécuteurs) : une suite entière absente, rapportée comme un succès. (4) Le rapport de couverture n'énumérait aucun périmètre **non couvert** — il rapportait ce qui avait été mesuré, jamais ce qui n'avait pas été tenté ; c'est ainsi qu'aucun parcours de refus n'a manqué à personne. | Deux règles et un ajout au gabarit de rapport. **Règles `cat-tst-*` :** (a) un exécuteur qui **collecte zéro test** sort en **échec** — jamais en succès ; c'est vrai de tout exécuteur, et c'est le défaut le plus silencieux de la famille. (b) Un saut **conditionnel** (`skipif` évalué à l'exécution, `test.skip(condition)`) est interdit en intégration continue : ou le préalable est garanti par le harnais, ou l'absence de préalable est un **échec explicite qui nomme ce qui manque**. Un saut *inconditionnel et motivé* reste licite — c'est une décision lisible, pas une disparition. **Ajout au gabarit de rapport :** le rendu d'une campagne affiche systématiquement le **nombre de tests sautés avec leur nom**, et la **liste des périmètres déclarés non couverts**. Un rapport qui ne peut pas dire ce qu'il n'a pas testé laisse croire qu'il a tout testé. |

## Confirmations positives

- **Le cliquet par fichier a été vérifié DANS LES DEUX SENS avant d'être posé** : sortie 1 sous
  le seuil, sortie 0 au-dessus. C'est exactement le contrôle qui manquait à toutes les portes
  de ce lot — chacune affichait vert sans qu'on ait jamais prouvé qu'elle savait rougir. La
  règle mérite d'être écrite : **une porte neuve se valide en la faisant échouer une fois.**
- **Trois des défauts remontés ici ont été trouvés en ÉCRIVANT les tests, pas en les
  exécutant.** Le test de `config.ts` a révélé que la mémorisation du profil de recette était un
  *effet de bord* de la lecture d'une propriété — une écriture qu'un remaniement aurait
  supprimée sans le vouloir. Écrire un test sur du code déjà livré reste l'inspection la moins
  chère et la plus rentable du catalogue.
- **La distinction « refusé » / « pas lu » a survécu jusqu'à l'écran.** Un document refusé par
  l'antivirus (422) et un antivirus injoignable (503) produisent deux messages différents, et
  un seul des deux invite à réessayer. Trois niveaux de tests le vérifient désormais — API,
  unitaire, bout en bout — parce qu'aucun des trois seul ne prouve que la chaîne complète
  aboutit au bon texte.

## Ordre recommandé

1. **RG-28** — trois règles portant sur un fichier de configuration, vérifiables par simple
   lecture, sans exécution. Le meilleur rapport gain/effort du lot, et il ferme la porte qui a
   laissé passer les deux autres.
2. **RG-29** — la règle « zéro test collecté = échec » est une ligne dans chaque gabarit de
   pipeline et supprime la classe de défaut la plus silencieuse qui soit.
3. **RG-27** — durcissement de conception, à embarquer avec **RG-18**, **RG-21** et **RG-25** :
   les quatre sont la même mécanique d'exigence-type déclenchée par le vocabulaire, sur quatre
   déclencheurs différents (asynchrone, limite, identité déléguée, tests). Les traiter ensemble
   coûte moins que quatre fois séparément — et rend enfin le patron visible, ce qui est
   probablement le vrai enseignement de la journée.
