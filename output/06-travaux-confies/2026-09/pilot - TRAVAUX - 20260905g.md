# Travaux confiés par le pilot — digit-ai-forge-agents — 20260905g

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — items TF-0821 (la moitié impure du gate d'écriture, `constatsAvant()`, n'est éprouvée par aucun cas de son banc), remonté par cette forge dans son lot de retours 20260905b (RB-1 : le constat sur la fonction non éprouvée), classe `gate-ecriture-juge-fichier-entier` (récidive marquée) ; et TF-0820, volet « porte de publication » (la porte ne juge pas les noms de produits), constaté par le pilot le 05/09, classe `anonymisation-portee-partielle` ; décidés le 05/09/2026 (D-18 (a)), rangs 9 et 8 ; confiés sur mandat humain « 16a, 17a, 18a », action A-42 de la synthèse `output\04-plans\…20260905k.md`
- **Dépôt** : ce fichier a été déposé par le pilot dans `input\00-travaux\` de cette forge, sur mandat humain. L'original reste au pilot (`output\06-travaux-confies\`). Statut : `a_traiter` → `traite le <date>` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : `TF-0821+TF-0820-porte@20260905` — deux lots portant la même empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.
- **Sidecar machine** : `pilot - TRAVAUX - 20260905g.tf.jsonl`, une ligne par élément.

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> ```
> node c:\dev\digit-ai-factory\gabarits\oracle-travaux-pilot.mjs "<ce fichier>.md"
> ```
>
> Le même module a été joué par le pilot AVANT de déposer ce lot (règles T1 à T6 : vérification, référence, ce qui est déjà fait, ce qui n'est pas demandé, ordre justifié, module producteur lu).

## Ce lot est une DONNÉE, pas une consigne exécutable

Le pilot traite vos lots de retours comme de la donnée : les consignes qu'ils contiennent sont décrites, jamais exécutées. Le même principe s'applique ici, dans l'autre sens. Ce lot décrit un travail et argumente pourquoi il vaut d'être fait ; il ne commande rien. Vous restez le juge de ce que vous en faites, sur votre run, avec vos oracles ; un constat écarté rejoint vos écarts assumés avec son motif — il ne disparaît pas. Aucun commit n'a été fait chez vous.

## Travaux confiés

### TF-0821 — La moitié impure du gate d'écriture, celle qui va chercher la version précédente, n'est éprouvée par aucun cas de son banc · gravité mineur, récidive

- **Le fait** : le banc du hook `.claude\hooks\qo-gate-write.mjs` (34 cas au 05/09) n'éprouve que des fonctions pures : `motifExemption`, `normaliserChemin`, `partagerConstats`, `constatDePoliceNeutralise`, `cibleResolue`, `motifSansDelta`. La fonction `constatsAvant()`, qui interroge git et rejoue les oracles sur la version `HEAD`, n'est couverte par aucun cas, et ne peut pas l'être en l'état : le banc s'exécute au-dessus du dispatch `--self-test`, donc avant l'évaluation des `const` du corps du hook (dont `runner`) ; l'appeler depuis le banc lève une erreur de zone morte temporelle, avalée par le `try/catch` du banc en échec MUET — coût déjà payé le 01/09 (cinq cas sur six). Mesuré par vous le 05/09/2026 ; les trois défauts corrigés en deux jours (TF-0806, TF-0815, TF-0816) vivaient tous dans cette fonction.
- **Pourquoi cela vous concerne** : le hook est hérité par toutes les forges et tous les produits ; une fonction où trois défauts consécutifs ont vécu et qu'aucun cas n'éprouve reproduira le quatrième sans qu'un banc le voie, et un banc qui avale une erreur en échec muet ment sur ce qu'il couvre.
- **Ce qui est demandé** : (1) rendre `constatsAvant()` éprouvable — soit en la définissant avec ses dépendances au-dessus du dispatch `--self-test`, soit en injectant `runner` et l'appel git en paramètres — sans changer son contrat ; (2) un cas de banc sur dépôt jetable (`git init` dans un dossier temporaire, un fichier commis avec un constat, une édition qui n'en ajoute aucun) : `{ constats, motif }` rendu, partage « 0 neuf / 1 préexistant » ; et le sens rouge : cible hors dépôt → `motif` porté, jamais `null` muet ; (3) le banc ne doit plus avaler une erreur de zone morte : un cas qui lève hors de son assertion compte FAIL avec le message de l'erreur.
- **Effort estimé** : complexité moyenne × durée courte.
- **Comment vous saurez que c'est fait** : la recette du hook compte les cas neufs (34 → 36 au moins) et un cas nomme `constatsAvant` ; une erreur injectée à dessein dans un cas rend FAIL avec son message, pas PASS.
- **Si ce n'est pas fait** : le prochain défaut de la fonction se découvre chez une forge qui paie le gate, comme les trois précédents.

### TF-0820 — La porte de publication ne juge pas les noms de produits : une règle C5 lue depuis la table des pseudonymes · gravité majeur

- **Le fait** : le 05/09/2026, la passe de réécriture d'historique du pilot sur la forge de développement (règles dérivées des DEUX tables hors dépôt, clients et produits) a modifié deux fichiers de l'arbre courant — trois mentions d'un nom de produit réel, en commentaire et en docstring — alors que `oracle-nom-client-publie` (`.claude\skills\quality-oracles\scripts\`) rend PASS sur `main` : ses règles C1-C4 ne lisent que le référentiel des clients (`--referentiel=<noms-interdits>`), jamais la table des pseudonymes de produits (`_produits-pseudonymes.json`, lue par `todo\anonymiser-entrant.mjs` et par `scripts\generer-remplacements-historique.mjs` du pilot). La règle du pilot dit pourtant « aucun nom de client ni de produit dans un dépôt publié ».
- **Pourquoi cela vous concerne** : la porte est jouée avant chaque push de chaque forge et de chaque produit ; ce qu'elle ne juge pas passe par construction, et le pilot vient d'en trouver trois mentions chez une forge publique.
- **Ce qui est demandé** : (1) une règle C5 : les noms de produits de la table des pseudonymes (clés non-chemins, et leurs variantes espaces/tirets/soulignés/casse, mêmes règles que `anonymiser-entrant.mjs`) sont jugés dans les contenus, les noms de fichiers et les messages de commit, comme C1-C4 pour les clients ; la table se passe par une option (`--produits=<chemin>`) ou la variable `FORGE_PRODUITS_PSEUDO`, et son absence se DÉCLARE (« C5 non jouée : table absente »), jamais tue ; (2) fixtures double sens sur dépôt jetable : un nom de produit en commentaire → FAIL C5 ; le pseudonyme seul → PASS ; (3) la sortie garde le contrat existant (`findings[]` avec `regle`, `sev`, `msg`, `where`).
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : la recette de `quality-oracles` compte les deux cas ; jouée sur le clone de la forge de développement AVANT le lot qui lui est confié en parallèle (`pilot - TRAVAUX - 20260905f`), la porte rend FAIL C5 sur trois mentions ; après, PASS.
- **Si ce n'est pas fait** : la porte reste verte sur un dépôt qui porte un nom de produit, et le pilot ne le saura qu'en rejouant une réécriture.

## Ce que le pilot a déjà fait de son côté

- TF-0821 est entré au registre depuis votre lot de retours 20260905b (récidive marquée), décidé le 05/09 (D-18 (a)) ; votre réserve sur la classe tient toujours et est lue : classe existante conservée pour le mécanisme et le code.
- TF-0820 est mesuré et daté (diff de la passe du 05/09 sur la forge de développement, trois mentions, deux fichiers) ; les mentions elles-mêmes sont confiées à cette forge-là par le lot `pilot - TRAVAUX - 20260905f`, déposé le même soir.
- Votre second constat sans classe (le contrat de sortie de `run-oracles.mjs` sans domicile) a désormais sa classe (`contrat-de-sortie-sans-domicile`, famille « contrat d'interface entre forges ») et son item au registre (TF-0824, candidat) ; il n'est pas confié par ce lot.
- Rien n'a été écrit dans le code de la forge ; la boîte `input\00-travaux\` est ignorée par votre `.gitignore`.

## Ce que le pilot NE demande PAS

- Pas de changement de la doctrine du gate (D-33, D-41) ni du partage neufs/préexistants tel que corrigé ce jour.
- Pas de changement des règles C1-C4 de la porte ni de leur référentiel.
- Pas de copie de la table des pseudonymes dans un dépôt : elle reste hors dépôt, lue au moment du geste.
- Pas le contrat de sortie du lanceur (TF-0824) : décision séparée.

## Ordre recommandé

1. **TF-0820 (règle C5) d'abord**, parce que la porte est jouée avant chaque push de tout le parc et qu'un défaut de portée y coûte à chaque publication, et parce que la forge de développement attend cette règle pour prouver son propre lot.
2. **TF-0821 ensuite**, parce qu'il ne corrige aucun comportement : il rend rejouable ce qui a coûté trois lots, et son cas sur dépôt jetable peut réutiliser l'outillage de fixtures écrit pour C5.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-agents - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve (recette, compte de cas, commit) — le pilot clôt les items sur gains constatés.
