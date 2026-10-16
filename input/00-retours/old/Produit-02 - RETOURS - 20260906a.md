# Retours forges — Produit-02 — 20260906a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905j` (item de registre TF-0819 — trois
  artefacts hérités périmés : `forge\travaux\TRAVAUX-PILOT.md`, `forge\travaux\oracle-travaux.mjs`,
  `forge\retours\CLASSES.json`), reçu dans `input\00-travaux\` du produit et joué sur mandat humain
  du 06/09/2026 (« A51 »).
- **Références ledger** : aucune — le mandat interdisait d'écrire dans `forge\ledger.jsonl` du
  produit, dont la séquence appartient à sa session vivante du 05/09. La preuve tient au commit
  local `094364a` (non poussé : la publication est une décision du produit) et aux trois oracles
  rejoués, cités ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-06

## Ce que le lot de travaux a produit (TF-0819)

Le lot confiait un seul travail en trois parties, et les trois sont faites. Le nom réel du produit
n'apparaît nulle part ici : il est désigné par son pseudonyme `Produit-02`.

| Partie du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| (1) remise à niveau en un geste | `node <PILOT_ROOT>\scripts\recopier-heritage.mjs .` joué depuis le dépôt du produit, précédé d'un `--essai` pour lire ce qu'il toucherait avant qu'il ne l'écrive. | **3 copié(s), 4 déjà conforme(s), 6 laissé(s)** (modes personnalisés). Copiés : `forge\travaux\TRAVAUX-PILOT.md`, `forge\travaux\oracle-travaux.mjs`, `forge\retours\CLASSES.json` — exactement les trois artefacts du lot, aucun autre. `CLASSES.json` passe de **version 1.0.0, 32 classes, daté 2026-09-03** à **version 1.2.0, 37 classes, daté 2026-09-05**. |
| (2) rejouer le relevé | `node <PILOT_ROOT>\oracles\oracle-conformite-projet.mjs .` avant et après. | **Avant** : R-47 `FAIL` — « héritage du pilot non tenu — 0 absent(s), 3 périmé(s) », les trois du lot. **Après** : R-47 `PASS` — « 13 artefact(s) hérité(s) présent(s) et à jour ». Le reste du verdict est **inchangé au constat près** : mêmes règles en échec avant et après (R-16 ×1, R-2 ×9, R-25 ×7, R-26 ×1, R-32 ×3, R-4 ×5, R-42 ×1), toutes antérieures à ce lot et hors de son périmètre. |
| (3) commettre chez le produit, par le produit | Commit `094364a`, `git add` explicite fichier par fichier — les sept fichiers modifiés par la session vivante du 05/09 n'ont été ni commis, ni écrasés, ni annulés. | `3 files changed, 606 insertions(+), 1 deletion(-)`, dont `create mode 100644 forge/retours/CLASSES.json`. Non poussé. Et la vérification demandée : `node forge\travaux\oracle-travaux.mjs "<le lot>.md"` rend **PASS en six règles, T6 comprise** (`oracle-travaux-pilot 1.1.0`), là où la copie précédente en comptait cinq. |

**La ligne de statut du lot déposé** est passée de `a_traiter` à `traite le 2026-09-06` — un `diff`
avec l'original conservé au pilot (`output\06-travaux-confies\`) montre **cette seule ligne** de
différence, fins de ligne comprises.

## digit-ai-factory (`digit-ai-factory`)

Deux retours, tous deux nés d'une mesure faite pendant le lot, tous deux sur le dispositif
d'héritage lui-même (`scripts\relever-heritage.mjs` et `scripts\recopier-heritage.mjs`). Le premier
est la raison pour laquelle le mandat humain a dû prévenir la session, en prose, qu'elle
trouverait chez le produit des modifications non commises qui n'étaient pas les siennes.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-1 | majeur | générique | **R-47 juge l'ARBRE DE TRAVAIL ; le dépôt, lui, peut porter un héritage périmé, et rien ne le dit.** `relever-heritage.mjs` compare le contenu du fichier sur disque à la source du pilot — jamais l'état versionné. **Mesure du 06/09/2026 chez Produit-02, après la remise à niveau de TF-0819** : R-47 rend `PASS` (« 13 artefacts présents et à jour ») alors que **trois artefacts en `copie_conforme` divergent encore du pilot dans `HEAD`** — `forge\RESTITUTION.md` (dernier commit `3209608`, 01/09 : `HEAD` porte la **version 2.15.0**, l'arbre de travail la **2.16.0**), `forge\hooks\factory.mjs` (dernier commit `13146aa`, 26/08) et `forge\retours\GABARIT-LOT-RETOURS.md` (`3209608`, 01/09) ; `git diff` : `3 files changed, 57 insertions(+), 8 deletions(-)`. Ces trois copies ont été déposées par une session antérieure et jamais commises ; `recopier-heritage.mjs` les a lues « CONFORME » et n'a rien dit de leur état git. Conséquences mesurables : (a) un `git restore .` ramène silencieusement l'héritage de la veille après un relevé vert ; (b) un `git clone` du produit — ce que voit une CI ou un autre poste — porte les trois artefacts périmés ; (c) une session suivante ne peut pas distinguer ces recopies de travaux du produit, et arbitre à l'aveugle entre les commettre et les jeter. Le lot TF-0819 sait pourtant que le commit est un geste séparé, puisqu'il le demande en partie (3) : ce qui manque, c'est le contrôle et le signal, pas la règle. | Deux gestes, aucun n'écrit chez le produit. (1) `recopier-heritage.mjs` termine par l'état git des cibles qu'il vient d'écrire (`git status --porcelain -- <cibles>`) et dit en une ligne que la recopie n'est **tenue qu'une fois commise**, en nommant les fichiers restants — le geste unique doit rendre compte de ce qu'il laisse au dépôt. (2) `relever-heritage.mjs` distingue un troisième état, `conforme_non_commis` (le fichier est conforme sur disque et diverge de `HEAD`), compté à part comme l'est déjà `hors_racine` : ni périmé — le produit a fait le geste —, ni tenu — le dépôt ne le porte pas. R-47 peut rester `PASS` en le **disant**, ou basculer en avertissement : la décision est au pilot, le comptage à part est le préalable. |
| RV-2 | mineur | générique | **Le message d'attribution de divergence date la copie du produit par la date du COMMIT du pilot, et cette date contredit celle que porte le fichier.** `attribuerDivergence()` (`scripts\relever-heritage.mjs`, ~l. 225-240) parcourt `git log -n 30 --format=%H %cs` de la source et rend « votre copie correspond à la version publiée le `%cs` ». **Mesure du 06/09/2026** : pour `forge\retours\CLASSES.json`, R-47 a écrit « votre copie correspond à la version publiée le **2026-09-05** » alors que le fichier présent chez le produit portait `version: 1.0.0`, `date: 2026-09-03`, 32 classes — et que le lot TF-0819, lu dans la même minute, écrivait « votre copie correspond à la version du **03/09** ». Deux dates pour un même fichier dans les deux documents que le produit lit côte à côte ; celle de l'oracle est la plus récente des deux, ce qui est exactement le sens qui pousse à croire la copie fraîche. Le mécanisme n'est pas faux — le pilot a bien publié cette version-là dans un commit du 05/09 — mais la phrase dit « version publiée le X » là où elle mesure « version portée par le commit du X ». | Deux corrections indépendantes. (1) Nommer ce qui est mesuré : « votre copie correspond à l'état publié **par le commit du** `%cs` » — la date du commit n'est pas la version de l'artefact. (2) Quand l'artefact porte une version déclarée (`version` / `date` d'un JSON, en-tête versionné d'un `.md`), la citer en plus, des deux côtés : « votre copie : 1.0.0 du 03/09 · pilot : 1.2.0 du 05/09 ». Le lot de travaux, lui, cite déjà la bonne — c'est le message machine qui devrait la porter, pas seulement la prose humaine qui le double. |

**Portée** : *générique* pour les deux. Ni l'un ni l'autre ne dépend d'un contenu propre à
Produit-02 : RV-1 frappe tout produit qui recopie son héritage sans commettre dans la foulée —
c'est-à-dire tout produit dont la recopie est faite par une session qui n'a pas mandat de
commettre —, et RV-2 frappe tout artefact hérité dont la version déclarée diffère de la date du
commit qui l'a publiée.

## Remarques restées au produit

Deux constats sont restés dans le dépôt du produit, chacun avec son verdict de généralisation
écrit ; aucun n'a été corrigé au passage, tous deux étant hors du périmètre du lot et hors du
mandat.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `oracle-conformite-projet` rend `exit 1` sur le dépôt, avant comme après ce lot, sur des règles sans rapport avec l'héritage : R-2 (9), R-25 (7), R-4 (5), R-32 (3), R-16, R-26, R-42. | Pas corrigée — le lot dit explicitement « pas de rejeu de vos oracles produit : seuls trois artefacts hérités changent », et le mandat borne l'écriture aux fichiers recopiés. Non-régression **mesurée** plutôt que supposée : les deux sorties de l'oracle ont été comparées règle par règle, et la seule différence est R-47, `FAIL` → `PASS`. | non | Propre au produit, et déjà de son ressort : ce sont ses livrables et son socle documentaire, pas un défaut de forge. Aucune ligne de sidecar. |
| Les trois artefacts en `copie_conforme` recopiés par une session antérieure (`forge\RESTITUTION.md`, `forge\hooks\factory.mjs`, `forge\retours\GABARIT-LOT-RETOURS.md`) sont restés **non commis** dans l'arbre de travail du produit. | Pas commis — ce ne sont pas les fichiers recopiés par ce lot, et le mandat interdit de commettre ce qui n'est pas de ce lot : les commettre aurait signé le travail d'une autre session, les annuler aurait détruit une remise à niveau réelle. Le fait est remonté au pilot plutôt que réglé au passage. | oui | C'est le fait qui fonde RV-1, et sa classe est bien généralisable : *un contrôle d'héritage certifie un état que le dépôt ne porte pas*. Le produit décidera lui-même du sort de ces trois fichiers dans sa prochaine session — le signaler ici est le seul geste qui appartienne à un run mandaté. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le travail a consisté à recopier trois artefacts hérités,
à rejouer deux oracles et à commettre ; le seul fichier édité par ce run hors recopie est la ligne
de statut du lot de travaux reçu — une édition d'une ligne prévue par le gabarit `TRAVAUX-PILOT.md`
lui-même, et le lot dit qu'elle est la seule autorisée après coup. Aucun livrable n'a été dérivé de
`gabarits\documents\`.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce lot.

- **Le `--essai` de `recopier-heritage.mjs` a fait exactement son office.** Le dépôt portait sept
  fichiers modifiés par une session antérieure, dont trois artefacts en `copie_conforme` : l'essai
  a montré, avant toute écriture, qu'ils seraient lus « CONFORME » et laissés intacts, et que seuls
  les trois artefacts du lot seraient écrits. Sans lui, la seule façon de le savoir aurait été de
  lancer l'écriture.
- **Le partage `copie_conforme` / `presence` a protégé la personnalisation du produit.** Six
  artefacts ont été laissés au produit, dont `.claude\settings.json`, `CLAUDE.md`, `.gitignore` et
  `forge\travaux\ECARTS-ASSUMES.md` — c'est-à-dire tout ce qu'un écrasement aurait détruit.
- **Le lot de travaux a été jugé avant traitement, comme il le demande**, et la démonstration a
  fonctionné : cinq règles avant la remise à niveau, six après, sur le même fichier et à une minute
  d'intervalle. Un lot qui prouve sa propre thèse en une commande est plus convaincant que le
  paragraphe qui l'explique.

## Ordre recommandé

1. **RV-1** — il touche la fiabilité du relevé lui-même, donc la valeur de tout ce qui s'appuie
   dessus, y compris la campagne de descente en cours. Tant qu'il tient, « R-47 PASS » veut dire
   « à jour sur le disque de la session qui a mesuré », et non « à jour dans le dépôt » ; les
   produits de la campagne sont dans ce cas de figure par construction, puisque leur recopie et
   leur commit sont deux gestes séparés, parfois confiés à deux moments différents.
2. **RV-2** — une ligne de message et un champ de plus. À traiter dans la même passe que RV-1
   puisque les deux vivent dans `relever-heritage.mjs`, mais sans urgence propre : il induit en
   erreur, il ne masque rien.

## La règle qui aurait évité le retour (TF-0779)

Aucun des deux retours ne suit un retour humain : tous deux sont sortis d'une mesure exécutée
pendant le lot — la comparaison avant/après du relevé, et la lecture du `git status` exigée par le
mandat avant toute écriture.

- **RV-1** et **RV-2** sont rattachés à la classe existante `heritage-avertissement-tardif`
  (famille `heritage-produit`), dont la règle et l'oracle désignent exactement les modules en
  cause : « `oracles\hook-ouverture.mjs` section Héritage des produits », oracle
  « `scripts\relever-heritage.mjs` (R-47) ». Le rattachement est **exact pour RV-2** (le message
  d'héritage dit au produit une chose qui l'induit en erreur) et **par défaut pour RV-1** : le
  libellé de la classe vise le *moment* de l'avertissement (« à l'ingestion du lot au lieu de
  l'ouverture »), là où RV-1 vise un avertissement qui **n'existe pas** — « recopié, non commis ».
  Le pilot est invité à juger si une clé propre se justifie, par exemple
  *« un contrôle d'héritage certifie l'arbre de travail, jamais l'état versionné »*, dans la même
  famille. Une classe ne se crée jamais dans un sidecar, et le produit ne l'écrit pas à la place
  du pilot : les deux lignes portent donc la clé existante, et cette réserve est écrite ici.
- **Aucun des deux retours n'entre marqué récidive** au sens du fait : `heritage-avertissement-tardif`
  est fondée par TF-0762, dont la correction a produit l'avertissement d'ouverture — et
  l'avertissement d'ouverture fonctionne : c'est bien lui, en amont, qui a fait descendre cet
  héritage. Ce que les deux retours décrivent est le **cran suivant** du même dispositif, pas la
  répétition du défaut corrigé.
