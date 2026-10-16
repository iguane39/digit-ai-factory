# Retours forges — digit-ai-forge-development — 20260905b

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905f` (item de registre TF-0820 — trois
  mentions d'un nom de produit réel dans deux fichiers courants), reçu dans `input\00-travaux\` de
  la forge et joué sur mandat humain du 05/09/2026 (« A45 »).
- **Références ledger** : aucune — le dépôt `digit-ai-forge-development` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient au commit
  `053fdaf`, poussé sur `main` en avance rapide, et aux recettes rejouées, citées ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-05

## Ce que le lot de travaux a produit (TF-0820)

Le lot confiait un seul travail en trois parties, et les trois sont faites : les remplacements, la
recherche de contrôle, la recette. Le tableau dit ce qui a été écrit et par quelle preuve exécutée
chaque partie se vérifie. Le nom réel n'est recopié nulle part ici : il est désigné par « le nom du
produit », et son pseudonyme est `Produit-09`.

| Partie du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| (1) remplacer les trois mentions par le pseudonyme, par un commit ordinaire | `conductor\catalog.py` : la docstring de `resolve_bricks` citait le lot fondateur en commentaire de décision ; le nom du produit y devient `Produit-09`, la date du lot (`20260820a`) est conservée. `tests\test_tf_0406_briques_t0_decidables.py` : même substitution dans la docstring de module et dans celle du cas fondateur. Trois lignes de PROSE changent, aucune instruction. | Commit `053fdaf` — `4 files changed, 57 insertions(+), 3 deletions(-)`, dont 3 insertions / 3 suppressions sur les deux fichiers de code (le reste est le lot de travaux déposé). Aucune réécriture d'historique : `main` avance de `00097b6` à `053fdaf`. |
| (2) vérifier qu'aucune autre mention ne vit dans l'arbre courant | Recherche du nom sur les fichiers SUIVIS par git, avant puis après, toutes extensions et pas seulement les cinq du lot, puis insensible à la casse, puis sur les NOMS de fichiers, puis sur l'arbre de travail entier hors `.git\`, `.venv\` et `.pytest_cache\`. | **Avant : 3 occurrences, 2 fichiers** (`conductor\catalog.py` 1, `tests\test_tf_0406_briques_t0_decidables.py` 2) — identique en insensible à la casse. **Après : 0** sur les quatre recherches. Aucun fichier non suivi et non ignoré ne porte le nom (les deux seuls sont le lot de travaux lui-même et son sidecar, qui écrivent `<nom du produit>`). |
| (3) rejouer la recette de la forge, sans changer le sens des tests | Recette du job `code` de `.github\workflows\double-gate.yml` rejouée en local dans l'ordre de la CI, plus la recette complète en CI sur le commit poussé. | `uv run ruff check .` → **All checks passed** (exit 0) · `uv run pytest` → **400 passed, 1 skipped** · `uv run python -m conductor.gates.ai_antipatterns_gate conductor pyproject.toml` → **PASS** (exit 0). Le catalogue résout les mêmes briques, la recette assert les mêmes choses. |

**La porte de publication, jouée avant le push** —
`oracle-nom-client-publie.mjs . --referentiel=/c/dev/_noms-interdits.json` rend **PASS** : « aucun
des 5 terme(s) du référentiel dans les contenus, les noms de fichiers ni les messages de commit ».
Elle ne juge que ce qui part à la publication (fichiers suivis) et ne connaît que les termes de son
référentiel — les deux limites sont déclarées par l'oracle lui-même, et la seconde est exactement le
motif de TF-0820.

**Ce que la mesure a fait apparaître autour du geste** — le nom du produit est une séquence de
**trois lettres majuscules**, et cette brièveté n'est pas un détail de forme. La même recherche,
jouée sur l'arbre de travail au lieu des fichiers suivis, rend **212 occurrences sur 15 fichiers** :
3 dans les deux fichiers visés, et **209 dans 13 fichiers de `.venv\Lib\site-packages\`** (`mypy`,
`mypyc`, `pygments`), où la séquence est un acronyme d'informatique parfaitement légitime. Le
verdict « trois occurrences » du lot est donc juste, et il n'est juste que parce que la mesure porte
sur les fichiers suivis. Ce constat est remonté ci-dessous : il conditionne la faisabilité de la
table des produits confiée séparément à la forge des outils.

**Un constat HORS PÉRIMÈTRE, remonté parce qu'il est plus grave que le lot** — la même recherche,
jouée par contrôle sur le dépôt du pilot pour vérifier que le compte rendu ne recopiait pas le nom,
y trouve **43 occurrences sur 9 fichiers SUIVIS par git**, et le dépôt `digit-ai-factory` est
**public** (`gh repo view` → `"visibility":"PUBLIC"`, mesuré le 05/09/2026). Rien n'a été écrit
ni corrigé là-bas : le mandat porte sur la forge, et écrire dans le dépôt du pilot depuis ici serait
exactement ce que les garde-fous interdisent. Le détail est en RV-23 ci-dessous.

**Ce qui n'a PAS été fait, et le motif** — trois points, tous bornés par le lot lui-même :

- **Aucune réécriture de l'historique.** Le lot l'exclut explicitement, `main` est protégée, et les
  mentions passées relèvent d'une autre décision. Elles restent dans l'histoire publiée : le
  correctif rend l'arbre courant propre, pas l'archive.
- **La porte de publication n'a pas été touchée.** Elle vit chez la forge des outils, et la question
  « doit-elle juger aussi les noms de produits » est déjà confiée là-bas dans un lot séparé.
- **La porte de mutation n'a pas été jouée en local.** `mutmut` ne tourne pas nativement sous
  Windows (limite déclarée dans `pyproject.toml`) ; elle a été jouée en CI, où elle est **verte**.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Un seul retour, et il ne rapporte pas un défaut neuf : il apporte une **contrainte de conception
mesurée** au travail déjà confié à cette forge (étendre la porte de publication aux noms de
produits). À fusionner dans cet item plutôt qu'à ouvrir en item neuf.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-22 | mineur | générique | Étendre `oracle-nom-client-publie` aux noms de produits ne se réduit pas à ajouter des termes au référentiel : **un nom de produit est souvent court**, là où un nom de client est long et distinctif. **Mesure du 05/09/2026** sur `digit-ai-forge-development` : le nom traité par TF-0820 est une séquence de trois lettres majuscules ; recherchée sur les fichiers SUIVIS, elle rend 3 occurrences (le défaut réel) ; recherchée sur l'arbre de travail, elle en rend **212**, dont **209 dans `.venv\Lib\site-packages\`** (`mypy\build.py` 122, `mypy\solve.py` 15, `mypy\semanal_main.py` 12, `pygments\lexers\foxpro.py` 5, et neuf autres fichiers), où les trois lettres sont un acronyme d'informatique sans rapport. Sur ce dépôt, la portée « fichiers suivis » de l'oracle absorbe seule tout le bruit — mais c'est une propriété du dépôt, pas de la règle : un terme de trois lettres reste à un `vendor\` suivi près de faire rendre au gate des dizaines de constats faux, et un gate bruyant se contourne. | Deux garde-fous quand la table des produits entre : (1) conserver explicitement la portée « fichiers suivis uniquement », déjà tenue et déjà déclarée en `non_juge` — l'écrire comme une propriété exigée, pas comme un effet de bord ; (2) permettre au référentiel de porter, pour un terme court, la **forme bornée** attendue (ici « <nom>-FR » et « <nom>.FR ») plutôt que la sous-chaîne nue, et joindre à chaque terme court une **fixture double sens** : rouge = le nom dans un identifiant de lot, verte = les mêmes lettres en acronyme légitime. Sans le cas vert, rien ne distingue un gate juste d'un gate qui ne bruite pas encore. |

**Portée** : *générique*. La contrainte ne dépend d'aucun contenu : elle frappe tout dépôt de
l'écosystème dès que le référentiel accueillera un terme court.

## digit-ai-factory (`digit-ai-factory`)

Un retour, trouvé par un contrôle joué pour une autre raison, et remonté tel quel : le pilot est le
seul à pouvoir en juger et le seul à pouvoir y écrire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-23 | majeur | générique | Le dépôt du pilot porte lui-même, dans ses fichiers SUIVIS par git, le nom de produit que TF-0820 fait retirer de la forge — et il est **public**. **Mesure du 05/09/2026** : `gh repo view iguane39/digit-ai-factory` rend `"isPrivate":false, "visibility":"PUBLIC"` ; la recherche du nom sur les fichiers suivis rend **43 occurrences réparties sur 9 fichiers** — `input\00-retours\old\Produit-09 - RETOURS - 20260820a.md` (9) et son sidecar (4), `output\03-etudes\20260820-etude-opportunite-rgaa.md` (3), `todo\TODO-ARCHIVE.jsonl` (7) et `todo\TODO-ARCHIVE.html` (7), `todo\anonymiser-entrant.mjs` (4), `todo\anonymiser-suivis.mjs` (3), `scripts\lib-pseudonyme-produit.mjs` (2) et son banc (2). Le lot TF-0820 écrit que la table des pseudonymes de produits vit « hors dépôt » ; quatre des neuf fichiers sont précisément les modules de pseudonymisation et leur banc, ce qui pose une question de conception distincte du simple oubli. La porte de publication n'a rien vu, pour la raison exacte de TF-0820 : elle ne connaît que la table des CLIENTS. Rien n'a été écrit dans le dépôt du pilot depuis ce run. | Séparer les deux cas avant de corriger : (1) les archives et livrables (`input\00-retours\old\`, `output\03-etudes\`, `todo\TODO-ARCHIVE.*`) relèvent de la passe de pseudonymisation ordinaire, y compris le renommage des fichiers dont le nom porte déjà `Produit-09` alors que le contenu porte le nom réel ; (2) les modules `anonymiser-*.mjs` et `lib-pseudonyme-produit.mjs` demandent une décision : soit le nom sort du code vers la donnée hors dépôt que le lot décrit déjà, soit les occurrences sont des fixtures de banc et doivent alors employer un nom FICTIF, jamais le vrai. Un banc qui se prouve avec la donnée qu'il existe pour cacher est un banc qui publie. |

**Portée** : *générique*. Le défaut ne dépend d'aucun contenu : il est la même classe que TF-0820,
mesurée sur un autre dépôt public de l'écosystème — et sur celui qui édicte la règle.

## Remarques restées au produit

Deux constats sont restés dans le dépôt de la forge, chacun avec son verdict de généralisation
écrit — aucun des deux n'a été corrigé au passage, l'un et l'autre étant hors du périmètre du lot.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `uv run mypy` rend **exit 1** sur le dépôt, avant comme après ce lot : `tests\test_tf_0375_cat_dev_03_approval.py:130 — Missing type arguments for generic type "dict"`. Le job `code` de `double-gate.yml` joue `uv run mypy` : la porte code est donc **rouge sur `main`**, et l'était déjà avant ce lot (exécutions CI en échec au même pas depuis le 27/08). | Pas corrigée — sans rapport avec TF-0820, et le lot dit de ne pas élargir. Non-régression MESURÉE plutôt que supposée : la recette a été rejouée sur la version `HEAD` des deux fichiers (mise de côté, mypy joué, remise) — **même erreur unique, même fichier, même ligne, 114 fichiers analysés** avant et après. | non | Déjà remonté dans le lot `digit-ai-forge-development - RETOURS - 20260905a`, avec le même verdict et la même absence de clé de classe. Répété ici parce que le fait est toujours vrai, pas parce qu'il est neuf : il ne fait pas de ligne de sidecar. |
| Le push sur `main` a réussi, mais le serveur a répondu `Bypassed rule violations for refs/heads/main` en nommant deux règles enfreintes : « Changes must be made through a pull request » et « 2 of 2 required status checks are expected ». Le mandat décrivait `main` comme « protégée, avance rapide seulement » ; la règle réellement configurée exige une demande de fusion ET deux contrôles verts, et le compte qui pousse la contourne d'office. | Pas corrigée — la configuration du dépôt hébergé est un geste humain, jamais une écriture d'agent, et le lot ne la demande pas. Le push a été fait en avance rapide (`00097b6..053fdaf`), sans forçage, conformément au mandat. | oui | Le fait est propre à ce dépôt, mais la CLASSE est générique : *une règle de branche annoncée dans un mandat diverge de la règle réellement configurée, et le contournement passe en silence*. Elle mérite d'être nommée, d'autant que la porte code est rouge : le passage par une demande de fusion aurait été REFUSÉ, et c'est le contournement qui l'a rendu possible. Aucune clé de `CLASSES.json` ne la couvre — voir « La règle qui aurait évité le retour ». |

## Retours sur les documents produits

Aucun document produit depuis un gabarit. Le travail a porté sur deux fichiers de code de la forge
(une docstring de fonction et deux docstrings de test) ; aucun livrable n'a été dérivé de
`gabarits\documents\`, et aucun gabarit n'a été sollicité.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce lot.

- **La portée « fichiers suivis » de la porte de publication s'est révélée juste sur un cas
  qu'elle n'avait pas été conçue pour rencontrer.** Un terme de trois lettres aurait rendu la porte
  inexploitable sur un arbre de travail ; elle est restée exacte parce qu'elle ne juge que ce qui
  part à la publication. Cette limite, écrite en `non_juge`, est ce qui a permis de lire la mesure
  sans la confondre avec un défaut.
- **Le lot de travaux a été jugé avant traitement, comme il le demande.**
  `oracle-travaux-pilot.mjs` rend **PASS** sur T1 à T6 en une seconde — le geste « une seconde » est
  tenu au pied de la lettre, et T6 a confirmé qu'aucun module producteur n'était à lire.
- **La non-régression a pu être PROUVÉE et pas seulement affirmée.** Rejouer la recette sur la
  version `HEAD` des deux fichiers seuls a permis de dire que l'unique erreur `mypy` est identique
  avant et après. Sans ce geste, « erreur préexistante » aurait été une déclaration ; c'est une
  mesure.

## Ordre recommandé

Deux retours, et l'ordre entre eux n'est pas indifférent : le second conditionne la qualité du
premier, mais le premier est le seul qui saigne aujourd'hui.

1. **RV-23 — les 43 occurrences dans le dépôt public du pilot.** Rang 1 sans concurrence : le
   travail que TF-0820 vient de faire chez la forge retire trois occurrences d'un dépôt public
   pendant que quarante-trois vivent dans un autre, celui-là même qui édicte la règle. Tant que
   c'est vrai, le geste fait ici ne réduit pas l'exposition, il la déplace. À décider avant
   RV-22, parce que la décision sur les modules de pseudonymisation (le nom sort-il du code ?)
   change ce que la table des produits devra contenir.
2. **RV-22 — les deux garde-fous de la table des produits.** À traiter EN MÊME TEMPS que
   l'extension de la porte de publication déjà confiée à la forge des outils, jamais après :
   ajoutée sans eux, la table des produits produira ses premiers faux constats au premier dépôt
   portant un `vendor\` suivi, et un gate qui bruite se contourne avant d'être corrigé. Le coût est
   celui d'un champ de référentiel et d'une fixture verte.

## La règle qui aurait évité le retour (TF-0779)

Aucun des deux retours ne suit un retour humain : tous deux ont été trouvés par une mesure exécutée
pendant le lot — la recherche de contrôle, jouée sur deux portées puis, par précaution, sur le dépôt
du pilot. La règle est nommée pour la classe, et une classe manquante est signalée au pilot plutôt
que créée ici.

- **RV-23** est couvert par une classe EXISTANTE : `anonymisation-portee-partielle` (famille
  `anonymisation`, oracle `oracle-nom-client-publie`), dont le libellé décrit le fait mot pour mot :
  « la passe d'anonymisation ne couvre qu'une partie des dépôts ». Le retour entre **marqué
  récidive** : la classe est fondée par des items clos, la règle existe, le module qui l'applique
  (`todo\anonymiser-suivis.mjs`) existe — et il porte lui-même le nom qu'il retire ailleurs. C'est
  l'information la plus utile du lot : une correction qui n'a pas atteint le dépôt d'où elle part.
- **RV-22** est couvert par la même classe EXISTANTE : `anonymisation-portee-partielle` (famille
  `anonymisation`, oracle `oracle-nom-client-publie`). Le rattachement est direct : la classe dit
  « la passe d'anonymisation ne couvre qu'une partie », et RV-22 dit à quelle condition l'extension
  de couverture aux produits tiendra. Le retour n'entre PAS marqué récidive au sens du fait — il
  est le complément de conception d'un travail déjà confié, et sa juste destination est cet item,
  pas un item neuf.
- **Aucune clé ne convient** pour le second constat resté au produit (la règle de branche annoncée
  qui diverge de la règle configurée, et le contournement silencieux). La famille `hook-ou-gate`
  couvre bien « un gate contourné », mais sa seule classe vise le gate d'écriture ; la famille
  `regle-morte` vise un contrôle qui rend PASS à tort, or ici le contrôle est correctement
  configuré — c'est le fait qu'un compte le franchisse sans trace côté producteur qui est le
  défaut, et le fait que le mandat en décrive une version plus permissive que la réalité. Le pilot
  est invité à créer la classe s'il la juge fondée : une classe ne se crée jamais dans un sidecar.
  Ce constat n'a donc **pas** de ligne de sidecar.
