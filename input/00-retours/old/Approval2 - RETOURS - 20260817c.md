# Retours forges — Approval2 — 20260817c

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : construction, exécution et stabilisation d'une recette **multi-profils** sur
  Approval2 (17/08), à la demande humaine. Livré : 5 identités outillées, 15 tests backend de
  matrice des droits, 5 tests e2e de workflow inter-profils. État final : backend exit 0
  (238 passés / 2 xfail stricts), e2e 20/20 sur trois passages consécutifs, ruff + mypy + tsc +
  vitest verts.
- **Références ledger** : `forge\ledger.jsonl` seq 37 à 40 (entrées `type: retour`), encadrées
  par l'étape `tests` seq 36 → 41
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-17

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-09 consommés). Ce lot porte
RG-10 à RG-13.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## tests (`digit-ai-forge-tests`) — ce qui manque à la stratégie de tests

Quatre règles, toutes **payées en réel** sur cette campagne, et toutes généralisables : aucune
n'est propre à Approval2. La première est structurante, les trois suivantes sont des pièges à
faux vert que la campagne a rencontrés l'un après l'autre — chacun avait rendu un test vert
pour une mauvaise raison.

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-10 | bloquant | **Rien n'exige une recette multi-profils, alors qu'un produit à rôles n'est pas vérifiable sans elle.** Approval2 a passé un audit 12 pans le 12/08 avec « pan qualif 8/8, ratio 1,00, ZERO finding » et « e2e 10/10 verte » — le tout sous UNE identité, qui se désignait elle-même approbateur. Le cas NOMINAL du cahier (un approbateur décide, le suivant est sollicité) n'avait donc jamais été exécuté, et le rôle « en copie » n'était exercé par aucun test. Le trou n'a pas été trouvé par l'outillage mais par une question humaine, cinq jours plus tard. Mesure après correction : la seule recette inter-profils a révélé **un défaut produit réel** (l'écran de revue propose la décision à un approbateur hors tour — le serveur refuse en 409, mais l'IHM invite au rejet) et **deux défauts d'ergonomie**, tous invisibles à une suite mono-identité par construction. | Faire de la recette multi-profils une **exigence de socle** dès qu'un produit déclare des rôles : autant d'identités outillées que de rôles, et un `storageState` par profil. Deux acquis à capitaliser : (1) la matrice des droits comme artefact exécutable (RG-11) ; (2) au moins un test de workflow où deux identités **coexistent** et où l'on observe ce qu'un profil voit PENDANT qu'un autre agit. Corollaire pour le pan qualif : voir RG-09 (lot 20260817b). |
| RG-11 | majeur | **La matrice des droits reste un tableau de documentation, jamais un artefact exécutable.** Le cahier d'Approval2 porte une matrice de 10 actions × 4 profils ; la suite existante en couvrait les règles dispersées dans 13 fichiers, sous l'angle de chaque service — donc sans jamais dire quelles CASES n'étaient pas couvertes. Deux l'étaient effectivement pas (le profil « en copie » n'apparaissait que comme destinataire servant à faire échouer un envoi ; aucun test n'instanciait d'admin sur une décision), et deux cases du cahier ne sont carrément pas tenues par le produit (relance manuelle absente, export des demandes non réservé aux admins) sans qu'aucun test ne le dise. | Poser le patron : **une action × un profil = une cellule = une assertion**, dans UN fichier dédié qui parcourt les six profils par action et compare le code HTTP au contrat. Les cellules non tenues s'écrivent en `xfail(strict=True)` — jamais omises, jamais commentées : le test échoue pour la bonne raison, et le jour du correctif il passe en XPASS, que `strict` transforme en échec et qui force à retirer le marqueur. Coût mesuré sur Approval2 : 15 tests, ~340 lignes, 2 écarts rendus exécutables. |
| RG-12 | majeur | **Trois pièges à faux vert rencontrés le même jour, aucun détecté par un oracle.** (1) *Assertion d'absence sans preuve de présence* : `toHaveCount(0)` passe sur une page encore en chargement — le test du passage de main était vert en isolation et rouge en exécution complète, pour cette seule raison. (2) *Motif satisfait par le déclencheur de l'action* : `getByText(/Refused|Refus/i)` matche le BOUTON « Refuse » ; l'assertion « le refus est enregistré » passait donc AVANT toute décision, supprimant la barrière de synchronisation — instabilité un run sur deux, et 30 s de timeout par occurrence (suite complète 3,6 min → **36 s** après correction, sur trois passages verts consécutifs). Le même défaut dormait dans un spec antérieur, vert depuis le 12/08. (3) *Cellule mutante jugée sur un objet partagé* : dans la matrice des droits, l'approbation réussie du profil N faisait avancer le circuit et ouvrait le tour du profil N+1, qui rendait 201 au lieu de 409 — faux échec, puis correction du patron par un objet neuf par cellule. | Trois règles à écrire, et si possible à **mécaniser** dans un oracle de revue de tests : toute assertion d'ABSENCE est précédée d'une assertion de PRÉSENCE sur le même écran ; aucun motif d'assertion ne doit pouvoir être satisfait par le déclencheur de l'action qu'il vérifie (interdire les regexes qui matchent le libellé du bouton cliqué) ; toute cellule dont le succès mute l'état exige un objet neuf. La deuxième est la plus rentable : elle est détectable statiquement (un motif d'assertion qui est un préfixe du libellé cliqué dans le même test). |
| RG-13 | mineur | **Une donnée de test volumineuse dupliquée d'un spec à l'autre s'est corrompue silencieusement.** Le PNG de référence (3 316 caractères base64) était recopié dans chaque spec. En le reprenant pour la suite inter-profils, 80 caractères ont sauté : le fichier gardait sa signature PNG et sa taille plausible, mais le worker sortait « broken data stream when reading image file » et l'envoi restait bloqué — quatre tests en timeout pour une cause invisible à la lecture du diff. | Règle : **une donnée de test partagée se référence, elle ne se recopie pas** — un module dédié, importé. Et si elle est générée, la **valider à la génération** plutôt que de faire confiance au littéral : sur Approval2 le module produit est désormais écrit par un script qui ouvre l'image et vérifie ses dimensions avant d'écrire. Candidat à mécaniser : détecter deux littéraux longs quasi identiques entre fichiers de tests. |

## Confirmations positives

- **La discipline `retries: 0` du socle a payé, exactement comme annoncé.** Le commentaire du
  projet — « un test e2e qui ne passe qu'au 2e essai est un test qui ment » — a interdit de
  masquer l'instabilité par un rejeu. C'est ce qui a mené aux deux faux verts de RG-12, dont un
  dormait depuis le 12/08. À conserver sans exception.
- **L'échappatoire `PLAYWRIGHT_CHROMIUM` du socle a débloqué la campagne.** `npx playwright
  install chromium` n'a rien téléchargé pendant plus de 10 minutes sur ce poste ; pointer un
  Chromium déjà présent a permis de jouer les 20 tests. Sans cette variable, la campagne
  s'arrêtait là. Bon exemple de garde-fou d'environnement qui sert.
- **Le mécanisme de configuration d'exécution (`window.__APP_CONFIG__`) s'est révélé le bon
  point d'entrée** pour paramétrer une instance de recette sans rebuild — la valeur runtime
  primant sur la valeur de build, un script de 30 lignes suffit à reposer la configuration que
  `npm run build` écrase à chaque fois.
- **La garde de précondition du pan qualif (RT-16 / TF-0211) n'a rien imputé à tort au produit**
  pendant toute la campagne. Rappelé ici parce que le retour RG-09 du lot précédent porte sur
  une limite de ce pan, et qu'il serait injuste de le lire sans cette confirmation.

## Ordre recommandé

1. **RG-12** — meilleur rapport gain/effort du lot : trois règles à écrire, dont une
   mécanisable statiquement, et un gain déjà mesuré (×6 sur la durée de suite, instabilité
   supprimée). Vaut pour tous les produits, indépendamment de leur domaine.
2. **RG-11** — le patron de la matrice exécutable, reproductible tel quel ; il transforme une
   promesse de cahier en tests, et rend visibles les cases non tenues.
3. **RG-10** — le plus structurant, donc le plus coûteux : il touche le socle de la pile de
   test. À instruire par une étude d'opportunité (TF-0155) puisqu'il crée un objet durable.
4. **RG-13** — petite règle, petit coût, à greffer sur la revue de tests existante.
