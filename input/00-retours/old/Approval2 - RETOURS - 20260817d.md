# Retours forges — Approval2 — 20260817d

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : campagne de correction du 17/08 sur Approval2 — les anomalies remontées
  par la stratégie de tests ont été **corrigées**, la stratégie **rejouée**, et les
  anomalies nées des correctifs corrigées à leur tour, jusqu'à extinction.
- **Références ledger** : `forge\ledger.jsonl` seq 43 et 44 (entrées `type: retour`),
  encadrées par l'étape `tests` seq 42 → 45
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-17

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-13 consommés). Ce lot
porte RG-14 et RG-15.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## tests (`digit-ai-forge-tests`) — ce que « exécuter la stratégie de tests » doit vouloir dire

Le lot `20260817c` a fait entrer la recette multi-profils dans la stratégie. Il manquait
l'essentiel : **ce que la demande d'exécution engage**. Aujourd'hui, « exécute la
stratégie de tests » se solde par un rapport d'anomalies. La campagne du 17/08 montre que
s'arrêter là laisse le produit exactement là où il était — et que s'arrêter au tour
suivant le laisse pire, avec une suite rouge.

**La mesure, tour par tour, sur une seule journée :**

| Tour | Ce qui a été fait | Anomalies découvertes |
|---|---|---|
| 1 | Stratégie exécutée | **4** anomalies produit (décision proposée hors tour, relance manuelle absente, export ouvert à tous, libellés homonymes) |
| 2 | Les 4 corrigées | **9 nouvelles** — 7 tests backend et 2 e2e, cassés *par les correctifs* (signature du port de messagerie, diffusion de clôture élargie, scission rappel/relance, export passé en 403, confirmation ajoutée sur l'approbation) |
| 3 | Les 9 corrigées | **1 nouvelle** — une course : l'approbation du second profil n'avait plus de barrière avant observation depuis un troisième |
| 4 | La dernière corrigée | **0** — et trois passages consécutifs verts |

Autrement dit : **69 % des anomalies de cette campagne n'existaient pas au tour 1.** Elles
sont nées des correctifs. Un mandat qui s'arrête au rapport en manque 4 sur 4 ; un mandat
qui s'arrête après avoir corrigé en laisse 10 sur 14, et rend une suite rouge.

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-14 | bloquant | **« Exécuter la stratégie de tests » n'engage aujourd'hui qu'à mesurer, jamais à traiter.** Rien dans le contrat ne dit qu'une campagne inclut la correction des anomalies remontées ni le rejeu jusqu'à extinction : le verdict `PARTIEL` avec 121 findings et 127 actions classées (ledger seq 28, campagne du 12/08) était donc une fin de mandat **conforme**, alors que le produit sortait inchangé. Preuve par l'inverse le 17/08 : la même stratégie, exécutée avec obligation de traiter, a fermé 4 anomalies produit et 3 faux verts, dont un dormant depuis le 12/08 — et a divisé par six la durée de la suite e2e (3,6 min → 36 s) en supprimant des attentes vaines. | Écrire la définition de fin dans le contrat de l'étape tests : une campagne est **terminée** quand (a) toutes les portes sortent en exit 0 — suites, lint, typage, e2e ; (b) il ne reste **aucun `xfail`/`test.fail` non justifié par un arbitrage humain daté** ; (c) la suite est **verte sur N passages consécutifs** (N ≥ 2, contre l'instabilité) ; (d) chaque anomalie remontée est soit corrigée, soit portée en écart **assumé et écrit**, jamais laissée implicite. Tant qu'un point manque, l'étape est `en_cours`, pas `termine_avec_ecarts`. |
| RG-15 | majeur | **La boucle n'est ni comptée ni tracée, donc rien n'empêche de clore sur un tour non rejoué.** Le ledger d'une campagne porte les findings du dernier rapport, pas l'histoire des tours : on ne peut donc pas distinguer « 0 anomalie parce que tout est traité » de « 0 anomalie parce qu'on n'a pas rejoué après le dernier correctif ». Les deux s'écrivent pareil. Sur cette campagne, le tour 3 n'a produit qu'**une** anomalie — mais c'était une course, la classe la plus coûteuse à retrouver plus tard : clore au tour 2 l'aurait laissée passer avec une suite pourtant verte au premier essai. | Exiger un **journal de boucle** par campagne : un tour = (anomalies entrantes, corrigées, nouvellement révélées, restantes), et interdire la clôture si le dernier tour n'a pas été rejoué **après** son dernier correctif. C'est mécanisable : un oracle compare l'horodatage du dernier commit de correctif à celui du dernier run de suite, et refuse la clôture si l'ordre est inversé. Le compteur de tours dit aussi quand s'arrêter pour de bonnes raisons : une campagne qui ne converge pas (tour N ≈ tour N-1) est un signal, pas un échec à masquer. |

## Confirmations positives

- **Le `xfail(strict=True)` a fait exactement le travail attendu, dans les deux sens.**
  Écrit le matin pour nommer deux cellules non tenues, il a forcé son propre retrait
  l'après-midi quand les écarts ont été corrigés : un XPASS est un échec, donc le test
  ne peut pas mentir par omission. C'est le mécanisme qui rend le critère (b) de RG-14
  **vérifiable** plutôt que déclaratif — à recommander comme patron, pas seulement comme
  astuce.
- **Le `test.fail()` de Playwright joue le même rôle côté interface.** Le défaut « décision
  proposée hors tour » a été consigné en test exécutable le matin, puis le marqueur retiré
  après correction. Sans lui, l'écart aurait vécu dans un rapport que personne ne rejoue.
- **La discipline `retries: 0` a encore payé.** C'est elle qui a fait apparaître la course
  du tour 3 : avec un seul rejeu automatique, la campagne se serait close sur un vert.
- **La contre-vérification avant dépôt a évité un faux retour.** Le retour RG-09 du lot
  `20260817b` allait accuser le pan qualif de « ne pas déclarer l'identité exercée » ;
  lecture faite, il la déclare (`qualif.py` l.216-254). Le retour a été réécrit sur la
  seule dimension réellement absente. À conserver comme réflexe : vérifier la forge avant
  de la corriger.

## Ordre recommandé

1. **RG-14** — c'est une définition à écrire, pas du code, et elle change ce qu'un mandat
   produit. Sans elle, RG-15 n'a rien à mesurer.
2. **RG-15** — l'oracle de convergence, une fois la définition posée. Mécanisable
   simplement (comparaison de deux horodatages), et c'est lui qui rend la règle opposable
   plutôt que relue.
