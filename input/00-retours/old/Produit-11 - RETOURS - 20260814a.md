# Retours forges — Produit-11 — 20260814a

- **Contexte** : rangement des dossiers de livrables après le run `20260814-bav2-completion`
  — un geste d'entretien, pas un audit. C'est en vérifiant ce que je pouvais déplacer sans
  casser une mesure que le constat est apparu.
- **Références ledger** : `forge\ledger.jsonl` seq 95
- **Remise au pilot** : copier ce fichier dans `<pilot>\input\00-retours\` — l'original reste
  ici (historique du produit).
- **Statut** : remis le 2026-08-14 (copie déposée dans `<pilot>\input\00-retours\`)

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-tests (`digit-ai-forge-tests`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-9 | majeur | **Le pan `interface` inventorie les LIVRABLES du projet audité, pas ses gabarits.** Ses 27 éléments viennent tous de `output/` — vérifié en dépouillant `elements_exerces` du rapport : `27 output`, `0` ailleurs. Le README annonce pourtant « gabarits `.html/.htm/.jinja/…` **hors artefacts** » ; or `output/` est le dossier d'artefacts par excellence, celui où la règle 16 fait copier tout livrable daté. Conséquences : (a) le pan mesure les ancres des dashboards produits par forge-tests **elle-même**, donc s'auto-audite — exactement ce que G-1 interdit à `--livrables` ; (b) son inventaire enfle avec le nombre de rapports générés, ce qui récompense l'accumulation ; (c) la mesure n'est **pas reproductible** — ranger `output/` selon la convention (`Old\`) fait varier l'inventaire. Sur ce produit, il est passé de 6 à 27 éléments entre deux audits sans qu'une seule ligne de gabarit change, uniquement parce que des livrables s'étaient accumulés. | Exclure de l'inventaire les dossiers d'artefacts que la convention du pilot nomme déjà : `output\`, `Old\`, et le dossier de livrables passé à `--livrables`. Le pan retrouverait alors les vrais gabarits du produit (`.visuel\*.html`, `frontend\index.html`), soit 6 sur celui-ci — chiffre stable et attribuable. |
| RT-11 | majeur | **Les routes non statiques ne sont jamais attribuables — faux négatif garanti.** Le rapport porte 4 éléments `route:` et ils se répartissent exactement selon leur forme : `/` et `/login` (statiques) « exercés par la suite », `/*` et `/login/reset-password/:token/:email` (motifs) « inventoriés, jamais exercés ». Or ce dernier **est visité** : `frontend/tests/e2e/10-navigation.spec.ts:49` fait `page.goto('/login/reset-password/<jeton>/<courriel>')` après avoir obtenu un vrai jeton par l'API. Le pan compare un motif de route déclaré à une URL concrète relevée dans la trace, sans le templater : `:token` ne s'apparie jamais à la valeur du jeton. Toute route paramétrée d'une SPA est donc déclarée non couverte, même exercée. Corrélation parfaite forme/résultat sur 4 éléments, plus une preuve de visite. | Apparier le motif et l'URL en convertissant les segments `:param` en joker (`[^/]+`) et le splat `/*` en `.*`, comme le fait le routeur lui-même. Sur ce produit, 1 des 2 faux négatifs disparaîtrait ; l'autre (`/*`) est un vrai trou de ma suite, que je comble. |
| RT-12 | majeur | **« Non joué » ne distingue pas une proposition jamais adoptée d'un test existant resté au repos.** Dans le dashboard, la colonne RÉSULTAT affiche `Non joué` sous la même légende que `⊘ Non testable` et `– Exclu`, qui sont des **mesures**. Pour un cas dérivé, « Non joué » n'est pas une mesure : c'est son état structurel et permanent, puisque le cahier pose que « la forge n'audite jamais ses propres cas ». **Preuve d'usage** : le lecteur destinataire a lu l'écran et a demandé « pourquoi ce type de tests n'est pas joué ? » — la question qu'un état mal nommé provoque. Second facteur, propre au dashboard : la colonne « CONSTAT MESURÉ — POURQUOI » ne porte que le constat de l'élément lui-même. Sur `qualif:effet:/:0:form` elle affiche « formulaire sans action ni écouteur », mais **pas** le `401` qui l'explique — celui-ci vit sur `qualif:route:/`, deux sous-chapitres plus loin. Le cahier, lui, imprime les deux ; c'est la mise en écran qui perd le lien. | Deux mots distincts : `Proposition (non adoptée)` pour un cas dérivé, `Non joué` réservé à un test existant qu'une exécution a sauté. Et faire remonter dans le « POURQUOI » d'un élément le constat de la route qui le porte, quand il existe. |
| RT-13 | majeur | **Aucun mécanisme d'adoption : une proposition ne peut jamais être retirée.** Recherche faite dans `digit-ai-forge-tests` (hors `.venv/` et `fixtures/`) : rien qui permette au produit de déclarer « ce cas dérivé est adopté, il vit ici ». Conséquence mesurable dès mon prochain audit : je m'apprête à écrire 11 tests qui couvrent exactement les axes *erreur* et *chargement* proposés par F1-3025-3 et F1-3025-4 ; le cahier suivant régénérera néanmoins les mêmes 100 cas en « Non joué ». Le lecteur ne pourra pas distinguer « pas fait » de « fait autrement », et la liste ne décroîtra jamais — un indicateur qui ne bouge pas quand le travail est fait cesse d'être lu. **La condition technique est déjà remplie** : j'ai comparé les identifiants de cas entre les audits `20260813a` et `20260814a` — 74 éléments communs, **0 identifiant changé**. Ils sont déterministes, donc citables depuis du code. | Une convention de rattachement légère, lue par le générateur : un marqueur dans le test (`// @cas F1-3025-3`) ou un `forge/cas-adoptes.jsonl` du projet. Le cas passerait à `adopté` avec le chemin du test en regard, et l'exhaustivité du cahier deviendrait un solde qui descend. |
| RT-10 | mineur | **Un dossier `Old\` non exclu ferait doubler l'inventaire.** La convention du socle fait migrer tout livrable remplacé dans `Old\` (« jamais versionné »). Sans exclusion côté auditeur, chaque archivage y déplace des HTML qui restent lisibles — donc inventoriés une seconde fois. Constaté en anticipation ici : le rangement de `output/` a été fait avec `Old\` ajouté au `.gitignore` du produit, mais rien n'empêche le pan de le lire. | Ajouter `Old\` à la liste d'exclusion de tous les pans qui parcourent des fichiers (`interface`, `securite`, `visuel`), au même titre que `node_modules\` et `.venv\`. |

## Confirmations positives

- **L'axe de dérivation a gagné sa place, et c'est mesurable.** En instruisant le cas
  F1-3025-3 (« état erreur — aucune trace technique n'est rendue à l'utilisateur ») j'ai trouvé
  un défaut produit que ni la mutation, ni les 56 tests de bout en bout, ni trois audits
  n'avaient vu : `ProtectedLayout.tsx:67` monte `<ErrorBoundary />` **sans enfants**, frère du
  contenu au lieu de l'envelopper. Un garde-fou React ne rattrape que ses descendants : celui-là
  ne protège rien, son écran de secours est du code mort, et son `componentDidCatch` a le corps
  commenté. L'élément sur lequel le cas était accroché était faux (RT-12), l'axe était juste.
  C'est l'argument le plus fort en faveur des cahiers dérivés.
- **Les identifiants de cas sont déterministes.** 74 éléments communs entre `20260813a` et
  `20260814a`, **0** identifiant modifié — malgré un inventaire passé de 75 à 78 éléments et un
  rangement de `output/` entre les deux. C'est ce qui rend RT-13 réalisable.
- **La liste `NON_JUGE` de `cahiers.py` est bien placée, et imprimée.** Les quatre limites
  arrivent au lecteur du livrable, dont « les états vide, erreur et chargement sont des
  DÉGRADATIONS génériques » et « c'est la limite de l'inventaire, pas celle du cahier ». Cette
  dernière a **prédit** le mode de défaillance constaté ici : 48 des 100 cas de F1 dérivent de
  12 éléments vus à travers un `401`, sans que le cahier soit en faute. J'allais remonter
  l'absence de provenance du constat : à tort, elle est servie 28 fois.
- **§4 ter (TF-0173, décidé la veille) tient à l'usage.** Appliqué pour la première fois sur
  l'audit du 14/08 : guetteur armé dès le lancement, chemin d'avancement annoncé, événement
  `relais_arme` consigné. Les six émissions de 3 minutes sont arrivées à l'humain, et la
  vérification *a posteriori* de `forge/avancement.jsonl` a montré six lignes concordantes.
  La règle a fait exactement ce qu'elle promettait — l'écart d'hier n'était pas reproductible.
- **Le pan `data` répond à l'effort.** 1/36 → 28/36 → **35/36** en deux campagnes de tests de
  violation. Sa règle (« une contrainte est exercée quand la suite la fait violer ») est
  exigeante mais juste, et elle a fait trouver trois absences de garde-fou dans le produit.
- **La mutation a tranché un désaccord que le raisonnement ne tranchait pas.** J'avais classé
  `03_post_advert:172` (retrait du `flush`) comme tuable ; deux tests écrits pour lui passent
  sans le tuer, parce que le `commit()` final rejoue le flush. Le mutant est équivalent, et
  c'est l'outil qui l'a établi.

## Ordre recommandé

Un principe de priorité s'est dégagé en instruisant ce lot : **un défaut d'inventaire a un effet
de levier de 4**, puisque chaque élément mal vu engendre 4 cas dérivés. Les 12 éléments `qualif`
aveuglés par le `401` ont produit 48 des 100 cas de F1. Corriger en amont vaut donc quatre fois
corriger en aval.

1. **RT-11** — faux négatif systématique sur toute route paramétrée, donc sur toute SPA. Preuve
   au dossier, correctif circonscrit (templater le motif avant appariement).
2. **RT-9** — il fausse un pan entier dans les deux sens : un projet sans livrables paraît moins
   couvert qu'un projet qui en accumule, et l'inventaire n'est pas reproductible d'un rangement
   à l'autre. Le correctif est une liste d'exclusion.
3. **RT-12** — le moins coûteux des trois majeurs (deux libellés) et le seul dont la preuve est
   un lecteur réel qui s'est mépris. À traiter avant que l'habitude ne s'installe.
4. **RT-13** — le plus structurant, donc le plus lourd : il touche au contrat entre le cahier
   et le projet audité. À arbitrer, pas à improviser.
5. **RT-10** — même correctif que RT-9, même liste ; à traiter dans le même geste.
