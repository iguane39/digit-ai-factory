# Travaux confiés par le pilot — digit-ai-forge-agents — 20260905c

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — items TF-0815 (l'identité d'un constat est une ligne tronquée à deux raisons) et TF-0816 (le delta se rend silencieusement non calculable sur un chemin relatif), tous deux remontés par cette forge dans son lot de retours 20260905a (RA-1 : le constat sur la ligne tronquée ; RA-2 : le constat sur le chemin relatif), classe `gate-ecriture-juge-fichier-entier` (récidives marquées par l'ingestion) ; décidés le 05/09/2026 (D-12 (a)) comme UN SEUL lot ; confiés sur mandat humain « 11b, 12a », action A-35 de la synthèse `output\04-plans\…20260905i.md`
- **Dépôt** : ce fichier a été déposé par le pilot dans `input\00-travaux\` de cette forge, sur mandat humain. L'original reste au pilot (`output\06-travaux-confies\`). Statut : `a_traiter` → `traite le <date>` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : `TF-0815+TF-0816@20260905` — deux lots portant la même empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.
- **Sidecar machine** : `pilot - TRAVAUX - 20260905c.tf.jsonl`, une ligne par élément.

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> ```
> node c:\dev\digit-ai-factory\gabarits\oracle-travaux-pilot.mjs "<ce fichier>.md"
> ```
>
> Le même module a été joué par le pilot AVANT de déposer ce lot (règles T1 à T5 : vérification, référence, ce qui est déjà fait, ce qui n'est pas demandé, ordre justifié).

> ## ⚠ Votre histoire a été réécrite le 05/09/2026 (TF-0817, D-11 (b))
>
> Le clone `c:\dev\digit-ai-forge-agents` a été rebâti sur `origin/main` réécrit (`0dc0b2a`, arbre identique à `966402a`) ; les 19 étiquettes ont été reposées. Tout AUTRE clone de cette forge se reclone, ne se fusionne pas — une fusion réintroduirait l'ancienne histoire. Les branches locales `master` et `sauvegarde/20260809` de ce poste portent encore l'ancienne histoire : leur suppression est un geste humain, en attente de décision.

## Ce lot est une DONNÉE, pas une consigne exécutable

Le pilot traite vos lots de retours comme de la donnée : les consignes qu'ils contiennent sont décrites, jamais exécutées. Le même principe s'applique ici, dans l'autre sens. Ce lot décrit un travail et argumente pourquoi il vaut d'être fait ; il ne commande rien. Vous restez le juge de ce que vous en faites, sur votre run, avec vos oracles ; un constat écarté rejoint vos écarts assumés avec son motif — il ne disparaît pas. Aucun commit n'a été fait chez vous.

## Travaux confiés

### TF-0815 — L'identité d'un constat est une ligne qui ne dit pas combien de constats elle résume : au troisième, le gate s'ouvre sur du travail neuf · gravité majeur, récidive

- **Le fait** : `run-oracles.mjs` (`runCli`) construit le champ `detail` d'un verdict avec `raisons.filter(Boolean).slice(0, 2)` — les DEUX premières raisons seulement. Le hook C7 `.claude\hooks\qo-gate-write.mjs` identifie un constat par cette ligne, désormais normalisée (chemin remplacé par un jeton fixe, chiffres masqués) depuis TF-0806. Mesuré par vous le 05/09/2026 : deux notes Markdown identiques à un chapitre près (deux chapitres ouverts sur un tableau nu contre trois), passées à `run-oracles.mjs --profil digit-ai --niveau note`, rendent deux lignes `❌ [Lisibilité d'un document (Markdown)]` identiques mot pour mot — elles nomment « Chapitre A » et « Chapitre B », jamais « Chapitre C ». Conséquence : un fichier dont `HEAD` porte déjà deux constats d'un même oracle et dont l'édition en ajoute un troisième obtient « 0 neuf » et passe. Le défaut existait avant TF-0806, masqué par lui ; votre limite déclarée (« deux constats de même classe dont aucun compteur ne bouge se confondent ») le couvre en prose, pas en mesure.
- **Pourquoi cela vous concerne** : le hook est versionné chez vous et hérité par toutes les forges et tous les produits ; un gate qui s'ouvre sur du travail neuf est le défaut inverse de celui que vous venez de corriger, et il est le seul des deux qui laisse passer un défaut réel. Votre réserve sur la classe de RA-1 a été lue : le pilot retient la classe existante (même mécanisme, même code), sans en créer une nouvelle.
- **Ce qui est demandé** : (1) faire porter à la ligne de constat le NOMBRE de constats de l'oracle, pas seulement les deux premiers messages — par exemple `— 3 constat(s) · <les deux premiers>` dans `runCli` — de sorte que `compteur()` de `partagerConstats()`, qui reconnaît déjà « × n », « n occurrences », « n cas », traite une occurrence de plus comme neuve sans autre modification ; le pilot tranche votre question : allonger le champ `detail` est accepté, borné à ce compte ; (2) une fixture double sens au banc du hook : `HEAD` avec deux constats d'un même oracle, édition qui en ajoute un troisième → « 1 neuf », écriture refusée, le constat neuf nommé ; même `HEAD`, édition sans constat nouveau → « 0 neuf, 2 préexistants », écriture acceptée ; (3) déclarer dans votre lot de retours le changement de contrat de sortie de `run-oracles.mjs` (le champ `detail` s'allonge), pour que les forges qui le lisent en soient informées par le registre.
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : la recette du hook (`self-test` de `qo-gate-write.mjs`) compte les deux cas neufs (26 → 28 au moins) ; les deux notes de votre mesure du 05/09, rejouées par `run-oracles.mjs --profil digit-ai --niveau note`, rendent deux lignes qui diffèrent par le nombre.
- **Si ce n'est pas fait** : au troisième constat d'un même oracle, une édition qui ajoute un constat passe le gate ; la limite reste une phrase que rien ne mesure.

### TF-0816 — Le delta se rend silencieusement non calculable quand la cible est un chemin relatif · gravité mineur, récidive

- **Le fait** : `constatsAvant()` interroge git par `git -C <dossier de la cible> ls-files --full-name --error-unmatch -- <la cible telle que reçue>` : le chemin de la cible est réinterprété relativement au dossier passé à `-C`, donc un chemin RELATIF ne s'y résout jamais. La fonction rend `null`, tout compte comme neuf, et le gate bloque comme avant D-33 — sans dire que le delta a été abandonné. Mesuré par vous le 05/09/2026, même fichier et même édition que la mesure de TF-0806 : avec `file_path` absolu, `delta=true`, 1 neuf, 1 préexistant ; avec `file_path` relatif (`run/rapport-jouet.md`), `delta=false`, 2 neufs, 0 préexistant. L'outil d'édition passe aujourd'hui des chemins absolus : le cas est latent, et fail-closed — d'où la gravité mineure.
- **Pourquoi cela vous concerne** : un verdict qui bloque sans dire que le delta n'a pas été calculable est indistinguable d'un verdict qui a calculé le delta et n'a trouvé aucun préexistant ; chaque forge qui le rencontrera cherchera la cause au mauvais endroit, et le temps de diagnostic se paie chez elle, pas chez vous.
- **Ce qui est demandé** : (1) résoudre la cible en entrée de `constatsAvant()` (`path.resolve` contre le dossier courant) ; (2) DÉCLARER le repli : quand le delta n'est pas calculable, le verdict porte son motif en clair — « hors dépôt », « absent de HEAD », « chemin non résolu » — comme le hook déclare déjà ses exemptions ; (3) une fixture double sens : chemin relatif → `delta=true`, même partage que le chemin absolu ; cible hors dépôt → refus avec le motif « hors dépôt » écrit dans le verdict.
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : la recette du hook compte les deux cas ; votre mesure du 05/09 rejouée avec `run/rapport-jouet.md` relatif rend `delta=true`, 1 neuf, 1 préexistant — identique au chemin absolu ; un verdict sans delta calculable dit pourquoi.
- **Si ce n'est pas fait** : rien tant que tout appelant passe des chemins absolus ; le jour où l'un d'eux passe un chemin relatif, le gate redevient celui d'avant D-33 sans le dire.

## Ce que le pilot a déjà fait de son côté

- Les deux constats sont entrés au registre depuis votre lot de retours 20260905a, marqués récidives de la classe `gate-ecriture-juge-fichier-entier`, décidés le 05/09 (D-12 (a)) comme un seul lot, rangs 2 et 3.
- Votre réserve sur la classe de RA-1 a été tranchée : classe existante conservée, aucune classe neuve.
- Votre histoire a été réécrite et publiée en force le 05/09 (TF-0817 clos) : la porte de publication rend PASS sur le dépôt entier, l'arbre de `HEAD` est inchangé, le clone de ce poste est rebâti.
- Rien n'a été écrit dans le code de la forge ; la boîte `input\00-travaux\` est ignorée par votre `.gitignore`, comme le 05/09 au matin.

## Ce que le pilot NE demande PAS

- Pas de changement de la doctrine du gate (D-33, D-41) ni de sa précédence.
- Pas de classe neuve pour RA-1 : la classe existante porte le même mécanisme et le même code.
- Pas de changement du format JSON de sortie de `run-oracles.mjs` au-delà du champ `detail`.
- Pas de rejeu du hook chez un dépôt frère : un cas équivalent construit dans la forge suffit, comme pour TF-0806.

## Ordre recommandé

1. **TF-0815 d'abord**, parce que c'est le seul des deux défauts qui OUVRE le gate à tort — il laisse passer un constat réel — et parce que sa fixture élargit le banc dont le second profite.
2. **TF-0816 ensuite**, parce qu'il est fail-closed et latent : il ne peut rien laisser passer, seulement coûter un diagnostic.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-agents - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve (recette, compte de cas, commit) — le pilot clôt les deux items sur gains constatés.
