# Retours forges — bourse-aux-vacants — 20260817a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : rejeu de l'audit forge-tests sur BAV2 le 17/08, cette fois **avec un compte
  fourni au pan `qualif`** — ce que les lots précédents réclamaient sans pouvoir le faire. Les
  identifiants d'environnement ont été mis à disposition le 17/08. C'est donc la première
  exécution où la précondition du pan pouvait être satisfaite, et c'est ce qui rend les trois
  constats ci-dessous mesurables plutôt que supposés.
- **Références ledger** : `forge\ledger.jsonl` seq 128
- **Lots précédents** : `RETOURS-20260814a/b/c.*`, remis et donc immuables. Le lot `c` a été
  ingéré (TF-0211 corrigé, TF-0212 écarté, TF-0213 corrigé) — voir les confirmations.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-17

**Numérotation** : BAV2 tient une séquence `RT-nn` ; RT-1 … RT-18 sont consommés. Ce lot
continue en RT-19 / RT-20 / RT-21. Aucun id réutilisé.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-tests (`digit-ai-forge-tests`)

Les trois constats sont **la même panne vue de trois côtés** : le pan ne parvient pas à ouvrir
une session sur une SPA, il ne le sait pas, et il en accuse l'opérateur. Corriger RT-19 seul
rend le pan opérationnel ; RT-20 et RT-21 évitent que la prochaine panne d'ouverture se
travestisse à nouveau en configuration manquante.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-19 | **bloquant** | **Le pan `qualif` lit la mire à `domcontentloaded` : sur une SPA le formulaire n'existe pas encore, et le pan conclut qu'il n'y a pas de mire.** `_connecter()` (`forge_tests/adaptateurs/qualif.py:879`) fait `page.goto(..., wait_until="domcontentloaded")` puis `query_selector` immédiatement. Séquence rejouée **à l'identique** contre l'instance servie de BAV2 (React 18 + Ant Design, `http://localhost:8092/login`) : `input[type=password]` **ABSENT**, champ identifiant **ABSENT**, et même le sélecteur `button[type=submit], input[type=submit], button` **ABSENT** — à cet instant le DOM est vide, le bundle n'a pas encore rendu. La boucle épuise ses candidats et sort sur « aucune mire de connexion trouvée ». **Contre-épreuve** : la même mire, avec une simple attente d'apparition du champ, s'ouvre — deux cookies JWT posés, redirection sur `/trouver-une-annonce`. **Effet mesuré sur le rapport** : compte fourni et valide → pan `SKIP`, **0 élément inventorié**, 6 `non_testables`. La **même** session passée par `FORGE_TESTS_QUALIF_STORAGE_STATE` → **91 éléments inventoriés, 84 exercés (92 %)** et 8 constats portant enfin sur des écrans authentifiés. Le pan cible les applications servies ; la SPA en est le cas majoritaire. | Attendre l'apparition du champ mot de passe avant de conclure à l'absence de mire : `page.wait_for_selector("input[type=password]", timeout=…)`, et ne déclarer « aucune mire » qu'après expiration. `domcontentloaded` ne dit rien du rendu d'une application qui rend en JavaScript. |
| RT-20 | majeur | **La provenance de session est DÉDUITE de la configuration, jamais CONSTATÉE — le rapport a affirmé une session qui n'existait pas.** Dans le **même** rapport, `non_juge[0]` = « PROVENANCE DE SESSION — session ouverte **PAR LA FORGE elle-même**, en rejouant la mire formulaire avec FORGE_TESTS_QUALIF_LOGIN ; ce que le pan voit est exactement ce que ce compte voit », et `non_juge[1]` = « aucune mire de connexion trouvée ». Les deux se contredisent, et c'est la première qui se lit en tête. `provenance_session()` (`qualif.py:212`) ne consulte que `config` : elle ne peut pas savoir. C'est exactement l'exigence que TF-0222 a posée pour les sessions **capturées** — une session fournie et refusée doit être dite refusée — non étendue au cas formulaire. | Faire dépendre la phrase de provenance du **résultat** de `_connecter` (ouverte / tentée et échouée / aucune), et **constater** l'ouverture — au moins un cookie posé, ou une route protégée qui rend son marqueur — plutôt que la déduire d'un clic émis. |
| RT-21 | majeur | **`champs_requis` demande de fournir ce qui est déjà fourni : le pan ne distingue pas « pas de compte » de « compte fourni, connexion échouée ».** Les 6 `non_testables[]` publient `champs_requis: ["FORGE_TESTS_QUALIF_LOGIN","FORGE_TESTS_QUALIF_PASSWORD"]` alors que les deux variables étaient renseignées **et valides** — la contre-épreuve les a fait ouvrir. `pour_couvrir` ajoute « déclarer FORGE_TESTS_QUALIF_CONNEXION » : elle valait déjà `/login`, la bonne route. Un opérateur qui suit le rapport à la lettre refait trois gestes déjà faits, puis conclut que son compte est mauvais. Le mécanisme manquant existe pourtant à côté : `CHAMPS_REQUIS_SESSION_FOURNIE` (TF-0222) sait dire « la session fournie a été refusée, recapture-la ». | Un troisième état — `CHAMPS_REQUIS_CONNEXION_ECHOUEE` — dont le motif dit **ce qui a été tenté et où ça s'est arrêté** (route essayée, sélecteur non trouvé). L'information est déjà produite par `_connecter` ; elle est seulement diluée dans `non_juge`, hors du champ que l'opérateur lit pour réparer. |

## Confirmations positives

- **RT-16 / TF-0211 tient, et le gain est exactement celui annoncé.** La garde de précondition
  a fonctionné en conditions réelles : sans session établie, le pan a rendu **0 constat
  produit** et **6 `non_testables`** nommant chacun son motif. Là où l'audit du 14/08 tirait
  **13 findings** du même aveuglement — 39 % du rapport, tous à risque 27, qu'il a fallu un
  fichier de contestation entier pour démentir — il n'en tire plus aucun. C'est le retour au
  meilleur rendement de toute la série.
- **La contestation est devenue inutile sur ces 13 constats.** Les douze lignes `qualif:*` de
  `forge/constats-contestes.jsonl` visaient des findings qui ne sont **plus émis**. Le fichier
  n'a plus à porter que le constat `data/contrainte:IF`.
- **Une fois la session réellement ouverte, le pan fait ce qu'on attendait de lui.** Inventaire
  passé de 24 à **91 éléments**, couverture de 50 % à **92 %**, et les constats portent sur les
  écrans métier — un formulaire de filtres sans écouteur de soumission, un lien de pagination
  sans `href`, un marqueur absent sur `/mes-alertes`. Vrais ou faux positifs, ce sont des
  constats **sur le produit**, ce qui n'avait jamais été le cas de ce pan sur ce projet.
- **Le canal de session capturée (TF-0222) est ce qui a sauvé cet audit.**
  `FORGE_TESTS_QUALIF_STORAGE_STATE` a permis de contourner RT-19 sans toucher au produit ni
  assouplir quoi que ce soit, et la provenance publiée dit correctement, dans ce cas-là, que la
  session vient d'ailleurs. La porte de sortie prévue par TF-0222 pour les IdP d'entreprise
  sert aussi de porte de secours quand la mire ordinaire n'est pas rejouable.

## Ordre recommandé

1. **RT-19** — une attente de sélecteur rend le pan opérationnel sur toute la famille SPA, qui
   est sa cible majoritaire. C'est la différence entre 0 et 91 éléments inventoriés.
2. **RT-21** — sans lui, la prochaine panne d'ouverture renverra l'opérateur sur une fausse
   piste, et le temps perdu sera le même qu'aujourd'hui.
3. **RT-20** — le moins urgent des trois, le plus structurant : un rapport qui affirme une
   provenance qu'il n'a pas constatée est un rapport dont on ne peut plus rien croire sur ce
   point. À instruire avec RT-21, dont il partage la source (le résultat de `_connecter`).
