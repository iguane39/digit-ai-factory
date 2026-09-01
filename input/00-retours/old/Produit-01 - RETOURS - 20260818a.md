# Retours forges — Produit-01 — 20260818a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : étude des écarts du 18/08 entre le cahier des charges Approval V1.4 et le
  « Lot de corrections et évolutions issu de la recette utilisateur » (1271 lignes,
  53 rubriques). Livrable : `etudes\Client-A - APR - Etude des ecarts - CDC V1.4 vs Lot recette - 20260818a.md`
  (+ HTML autoportant). Le lot de recette est le **premier entrant de ce type** reçu par le
  produit : ni une idée, ni un CDC, ni un produit à reprendre — un retour d'usage humain.
- **Références ledger** : `forge\ledger.jsonl` seq 50, 51, 52, 53 (entrées `type: retour`),
  encadrées par l'étape `conception` seq 49 → 54
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-18

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-15 consommés). Ce lot porte
RG-16 à RG-19.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## La mesure qui porte ce lot

Les 49 rubriques fonctionnelles du lot de recette ont été classées une par une contre les
16 sections du cahier des charges. La répartition **par cause racine** est le fait à retenir :

| Famille de cause | Rubriques | Part | Détectable avant la recette ? |
|---|---|---|---|
| Défaut d'implémentation d'une exigence **écrite** au cahier | 22 | 45 % | **oui**, mécaniquement |
| Sur-livraison — construit sans être demandé | 2 | 4 % | **oui**, mécaniquement |
| Lacune de spécification — le cahier est muet | 12 | 24 % | oui, en conception |
| Évolution de doctrine produit — apprentissage réel de l'usage | 12 | 24 % | **non** |
| Mésusage du design system | 1 | 2 % | oui, par oracle |

**24 anomalies sur 49 (49 %) étaient des écarts entre un texte disponible et un code
disponible.** Leur détection ne demandait aucune intelligence produit. 12 seulement — un quart
— constituent l'apprentissage que seule la confrontation à l'usage réel produit, et qu'une
recette a vocation à remonter.

La cible n'est donc pas « zéro anomalie en recette ». C'est **zéro anomalie de ces deux
premières familles en recette**.

---

## conception (`digit-ai-forge-conception`)

Deux retours : l'entrant lui-même n'a pas de porte d'entrée, et deux sujets d'exigences
manquent systématiquement là où ils coûtent le plus cher.

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-16 | bloquant | **Un retour de recette n'entre dans aucune des cinq catégories d'entrant, et il n'existe aucun chemin pour le traiter.** `cat-con-01` (Qualifier l'entrant) porte une typologie explicitement **fermée à 5** : idée, CDC, produit à reprendre, produit à faire évoluer, tiers à répliquer. Un lot d'anomalies issu d'une recette humaine n'est aucun des cinq : il n'est ni le besoin, ni la spécification, ni le produit — c'est un **delta constaté à l'usage**, qui arbitre contre une spécification existante. Coût réel mesuré le 18/08 : 1271 lignes croisées à la main contre 16 sections, 49 rubriques classées, **9 contradictions** avec le cahier et **3 régressions** détectées par lecture de code, dont un test qui échouera à coup sûr (`backend/tests/test_decision_lock.py:26` affirme `can_edit(...) is False` après la première décision, règle que la rubrique 35 du lot renverse explicitement). Aucun oracle n'a pu être joué : il n'y avait pas d'artefact au format d'une forge. | Un service « **retour d'usage → delta** » chez conception, prenant un lot d'anomalies en langage naturel et produisant trois sorties : (1) un `DELTA.json` opposable à `oracle-delta.mjs`, (2) une matrice de classification concordante / extension / contradiction par rubrique, avec la référence de section du référentiel, (3) les cas de tests correspondants (passage à `cat-tst-02`). La 6e catégorie d'entrant de `cat-con-01` est le préalable. L'étude du 18/08 est le prototype manuel de ce service, donc sa spécification la plus complète disponible. |
| RG-18 | majeur | **Deux sujets d'exigences manquent systématiquement, et ils concentrent les anomalies les plus coûteuses.** Sur les 12 lacunes de spécification, 5 tiennent à deux sujets seulement, tous deux laissés vides par le cahier : (a) **propagation d'état asynchrone** — le cahier dit « conversion et consolidation asynchrones » (§08) et s'arrête ; il ne dit jamais comment l'interface apprend la fin d'un traitement, ni quel est l'état terminal d'un traitement échoué, ni son délai maximal. Résultat en recette : un fichier reste affiché « Conversion en cours » alors que la conversion est terminée, et ne passe à « Prêt » qu'après une action utilisateur sans rapport — **qualifié « bug critique » par la recette elle-même** (rubrique 20), plus l'absence de tout état terminal (21) et le cycle de vie des messages d'interface (22). (b) **cycle de vie de la session** — le cahier dit « SSO via Microsoft Entra ID / OIDC » (§11, §13) et s'arrête ; rien sur la durée applicative, le renouvellement silencieux, l'expiration, la restauration du contexte. Résultat : l'application affiche « Une erreur est survenue » puis exige une reconnexion après F5, avec perte du brouillon (rubriques 27, 28). Ces cinq anomalies ne viennent pas d'une erreur de développement : le développeur a implémenté exactement ce qui était écrit. | Des **exigences-types obligatoires** portées par `cat-con-02` (Énumérer la surface) et `cat-con-03` (Rédiger les exigences), déclenchées par le vocabulaire : dès qu'une exigence mentionne un traitement asynchrone, exiger les quatre réponses (notification de fin, état terminal d'échec, délai maximal, reprise) ; dès qu'elle mentionne une authentification, exiger les quatre autres (durée, renouvellement, détection d'expiration, restauration de contexte). Mécanisable dans l'oracle `ears` : une exigence dont le déclencheur est un événement asynchrone sans clause de réponse observable est incomplète, au même titre qu'une exigence sans critère testable. Ces deux sujets reviennent dans **toute** application de ce type — c'est un durcissement de la forge, pas un service nouveau. |

## development (`digit-ai-forge-development`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-17 | bloquant | **Le gate qui couvrait la moitié des anomalies de cette recette est celui qui n'a jamais tourné sur un produit réel.** `cat-dev-03` (Gate spec under/over-build) a pour intention catalogue exacte « détecter ce que le code sous-livre ou sur-livre par rapport à la spec », avec `SPEC_FINDINGS.md` en sortie, under-build bloquant et over-build consultatif. C'est précisément la définition des **24 anomalies** des deux premières familles ci-dessus. Exemples que rien ne rendait subtils : le glisser-déposer est **exigé nommément** au §08 du cahier (« dépôt multiple par glisser-déposer ou sélection classique ») et absent du produit (rubrique 16) ; XLSX est listé aux §08 **et** §09 avec sa règle de conversion, et produisait « Une erreur est survenue. Réessayez. » (rubrique 18) ; le prénom et le nom sont au modèle §05 et l'écran n'affichait que le nom de famille (rubriques 2 et 10). Côté over-build, le lot demande de **retirer** trois blocs d'accueil (« Terminées récemment », « Activité récente », « Urgences ») et un bouton « Envoyer » à l'étape 2 que **aucune section du cahier ne demande** : ils ont été construits en plus, et il faut maintenant payer leur retrait (rubriques 3 et 14). Or le catalogue déclare pour ce gate : statut `declare`, cycle de vie `experimental`, preuve « testé par la suite de la forge (fakes) — **jamais démontré sur produit réel** ». | Faire passer `cat-dev-03` de `declare` à `prouve` **sur Approval**, qui est le corpus de démonstration idéal et disponible : un cahier des charges structuré en 16 sections avec 24 critères d'acceptation en Étant donné / quand / alors, un code réel, et un jeu d'écarts **déjà connus et documentés** — les 31 écarts du commit `7fc01f3` et les 24 rubriques de familles B et C de l'étude du 18/08. Cela donne une validation à double sens : le gate doit trouver ces écarts, et ne doit pas en inventer sur les 12 rubriques d'évolution de doctrine, qui ne sont pas des écarts au cahier. Tant que le gate reste déclaré, la factory ne peut pas promettre de détecter l'under-build — et c'est la famille dominante des défauts que la recette humaine remonte. |

## organization (`digit-ai-forge-organization`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-19 | mineur | **Le nom de fichier d'un référentiel et sa version interne peuvent diverger, et cela a failli produire un arbitrage faux.** Le fichier de référence s'appelle `input/Approval-cahier-des-charges-V1.4.html`, mais son en-tête indique « Version 29 mai 2026 · V1.3 » et son pied de page « Brief de conception · Approval · version arbitrée **V1.3** du 29 mai 2026 ». Le lot de recette, lui, déclare primer sur « le cahier des charges **V1.3** ». Lu vite, cela fait deux référentiels dont un seul est arbitré par le lot, et laisse croire qu'il existe un V1.4 non couvert par la clause de préséance : l'ambiguïté a été relevée et portée à l'humain comme un risque de rouvrir les 31 écarts fermés la nuit précédente, avant que la lecture du pied de page ne montre qu'il n'existe **qu'un seul document**. Le commit `7fc01f3` du produit parle lui aussi de « Brief de conception Approval V1.4 du 29/05/2026 » — la confusion est donc déjà entrée dans l'historique. | Une règle de convention : la version portée par le **nom** d'un référentiel est la version portée par son **contenu**, et l'écart est un défaut détectable. C'est mécanisable pour les référentiels HTML et Markdown de la doctrine (lire la version dans le document, la comparer au nom du fichier), et cela rejoint le `gate-conventions` packagé (`cat-org-04`), qui contrôle déjà des règles de nommage. À défaut de gate : l'exiger dans la doctrine des conventions (`cat-org-01`) pour tout artefact versionné remis à un tiers. |

## Confirmations positives

- **La discipline `statut` / `preuve` du catalogue a tenu, et c'est elle qui rend RG-17
  formulable.** Le catalogue déclare `cat-dev-03` en `declare` avec la preuve « jamais
  démontré sur produit réel » au lieu de le présenter comme disponible. Un catalogue
  complaisant aurait produit exactement l'inverse de ce retour : la conviction que
  l'under-build était couvert, donc aucune enquête, donc la même recette au tour suivant.
  C'est le mécanisme qui permet de dire *où* la factory est faible sans avoir à le
  découvrir en production — à conserver tel quel.
- **La garantie append-only en base a forcé la bonne conception, au lieu de laisser passer la
  mauvaise.** La rubrique 41 du lot exige de distinguer l'auteur réel d'une action de la
  personne au nom de qui elle est faite — donc une colonne de plus sur `audit_event`. La
  migration `0011_audit_append_only.py` installe un trigger `BEFORE UPDATE OR DELETE` **et**
  révoque UPDATE/DELETE au rôle applicatif : la reprise rétroactive des lignes existantes est
  donc impossible, et la seule conception viable — colonne nullable, `NULL` signifiant
  « action en propre » — s'impose d'elle-même. Une garantie tenue par convention de code
  aurait laissé écrire un backfill silencieux qui détruisait la valeur probante du journal.
  Preuve que le verrou au bon niveau ne fait pas que protéger : il enseigne.
- **Nommer l'écart dans le test paie une deuxième fois, à retardement.**
  `backend/tests/test_ecarts_cahier.py` porte en docstring « chaque test nomme l'ecart qu'il
  verrouille ». C'est ce qui a rendu l'analyse de régression possible en lecture directe :
  identifier quelles assertions le nouveau lot redéfinit, au lieu de le découvrir à
  l'exécution. Le patron confirmé au lot `20260817d` (RG-14, critère b) vaut donc au-delà de
  la campagne où il est écrit.

## Ordre recommandé

1. **RG-17** — le meilleur rapport gain/effort du lot, et de loin : le gate **existe déjà**,
   il n'y a rien à concevoir. Il faut l'exercer une fois sur un produit réel dont les écarts
   sont connus, ce qui est exactement la situation d'Approval aujourd'hui. Gain immédiat pour
   le produit — il lève l'incertitude sur combien des 24 rubriques concordantes le commit
   `7fc01f3` a déjà fermées — et gain pour la forge, qui gagne sa preuve sur produit réel.
2. **RG-16** — le gain le plus élevé, mais un service à concevoir. Il se conçoit mieux **après**
   RG-17 : la sortie `SPEC_FINDINGS.md` du gate est précisément la matière que le service
   « retour d'usage → delta » doit consommer pour trier ce qui est déjà couvert de ce qui est
   nouveau. Et l'étude du 18/08 lui sert de spécification sans travail supplémentaire.
3. **RG-18** — durcissement de conception, sans dépendance aux deux précédents. À faire
   quand une évolution de `cat-con-03` est ouverte de toute façon : le coût marginal est
   faible, et les deux sujets sont universels.
4. **RG-19** — convention, effort minimal, gravité mineure. À embarquer dans la prochaine
   révision du `gate-conventions` plutôt qu'à traiter seul.
