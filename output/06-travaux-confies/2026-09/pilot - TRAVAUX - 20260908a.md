# Travaux confiés par le pilot — digit-ai-forge-agents — 20260908a

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — item TF-0887 (le hameçon de publication appelle la porte sans chemin de tables ; depuis le canal confidentiel, la porte rend SKIP et le hameçon refuse tout push), remonté par cette forge dans son lot de retours 20260907a (RC-1 : le constat sur le hameçon), classe `porte-sans-chemin-des-tables` (créée le 07/09) ; décidé le 08/09/2026 (D-31 (a)) ; confié sur mandat humain « 31a », action A-68 de la synthèse `output\04-plans\…20260907m.md`
- **Dépôt** : ce fichier a été déposé par le pilot dans `input\00-travaux\` de cette forge, sur mandat humain. L'original reste au pilot (`output\06-travaux-confies\`). Statut : `a_traiter` → `traite le <date>` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : `TF-0887@20260908` — deux lots portant la même empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.
- **Sidecar machine** : `pilot - TRAVAUX - 20260908a.tf.jsonl`, une ligne par élément.

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

### TF-0887 — La porte de publication connaît le canal confidentiel dans ses pistes par défaut, et le hameçon qui l'appelle lui passe les chemins · gravité bloquant

- **Le fait** : depuis le 07/09 (D-28 (a)), les deux tables de pseudonymisation vivent dans le canal confidentiel, un dépôt privé cloné en `<racine du parc>\_confidentiel\` (`tables\noms-interdits.json`, `tables\produits-pseudonymes.json`) ; les anciens fichiers libres `<racine>\_noms-interdits.json` et `_produits-pseudonymes.json` n'existent plus. Mesuré par vous le 07/09/2026 : les pistes par défaut de `oracle-nom-client-publie.mjs` (`<base>\_noms-interdits.json`, `<base>\..\_noms-interdits.json`, `FORGE_ROOT`) ne trouvent plus rien, la porte appelée sans `--referentiel` ni `--produits` rend SKIP, et le `pre-push` fabriqué par `installer-hamecon-publication.mjs` traite SKIP en refus : tout dépôt où le hameçon est posé refuse chaque push. Sur le poste du pilot, aucun clone ne porte le hameçon ; les deux variables `FORGE_NOMS_INTERDITS` et `FORGE_PRODUITS_PSEUDO`, que la porte lit en premier, y sont posées vers le canal en béquille.
- **Pourquoi cela vous concerne** : la porte est votre livrable le plus joué du parc, avant chaque push de chaque forge et de chaque produit ; une porte muette par défaut finit contournée avec l'option qui saute les hooks, ce qui est pire qu'une porte absente. Le canal est désormais l'emplacement de référence des tables pour les deux postes et tout nouveau clone.
- **Ce qui est demandé** : (1) dans `oracle-nom-client-publie.mjs`, ajouter aux pistes par défaut des deux tables, après les variables d'environnement et avant les anciens fichiers libres : `<racine>\_confidentiel\tables\noms-interdits.json` et `<racine>\_confidentiel\tables\produits-pseudonymes.json`, la racine étant `FORGE_ROOT`, sinon le parent du dépôt jugé, sinon le parent de la forge ; la piste retenue est nommée au `non_juge` (« table lue : … ») ; (2) dans `installer-hamecon-publication.mjs`, le `pre-push` fabriqué passe les chemins résolus à l'installation (`--referentiel`, `--produits`) ou, à défaut, laisse la porte les résoudre par (1) — et quand la porte rend SKIP, le hameçon répète son motif en clair (« porte SKIP : … ») avant de refuser ; (3) si un autre module de la forge lit les tables par leurs anciens chemins (anonymiseur, scripts), même pistes ; (4) fixtures double sens à la recette de `quality-oracles`, sur racine jetable : `_confidentiel\tables\` présent et aucun argument → la porte joue C1 à C5 et nomme la table lue ; aucune table nulle part → SKIP avec motif ; et à `self-test-hamecon-publication.mjs` : un `pre-push` fabriqué sur cette racine jetable laisse passer un dépôt propre et refuse un dépôt porteur, sans variable d'environnement posée.
- **Module producteur lu** : `installer-hamecon-publication.mjs` produit le `pre-push` (source : `.claude\skills\quality-oracles\scripts\installer-hamecon-publication.mjs`, en-tête lignes 2 à 36 : « Posé par installer-hamecon-publication »).
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : la porte jouée sans argument depuis un dépôt du parc (variables d'environnement retirées le temps de la mesure) rend un verdict C1 à C5 et nomme la table lue ; `self-test.mjs` de `quality-oracles` et `self-test-hamecon-publication.mjs` comptent les cas neufs ; la porte de publication sur cette forge est verte, le commit est publié.
- **Si ce n'est pas fait** : tout nouveau clone et l'autre poste, où le hameçon est posé, refusent chaque push jusqu'à ce que quelqu'un pose deux variables à la main.

## Ce que le pilot a déjà fait de son côté

- Le canal existe (`digit-ai-confidentiel`, privé), le bootstrap du pilot le clone et le tire à chaque ouverture ; `scripts\lib-confidentiel.mjs` du pilot résout les tables dans le même ordre (variables, canal, sinon ancien fichier en le disant) — même règle attendue de votre côté.
- Le LISEZMOI du canal dit aux postes de poser les deux variables ; ce lot rend cette béquille inutile.
- Votre histoire a été réécrite et publiée le 07/09 au soir avec les tables du canal (`0e0c223`) : la porte est verte sur `main`, vous publiez en avance rapide.
- Rien n'a été écrit dans le code de la forge ; la boîte `input\00-travaux\` est ignorée par votre `.gitignore`.

## Ce que le pilot NE demande PAS

- Pas de copie des tables ni du canal dans le dépôt : le canal reste privé et hors des dépôts publiés.
- Pas de changement des règles C1 à C5 ni du contrat de sortie `findings[]`.
- Pas de retrait des anciennes pistes (fichiers libres) : elles restent en dernier recours, après le canal.

## Ordre recommandé

1. **Les pistes de la porte d'abord**, parce que le hameçon n'a rien à passer tant que la porte ne sait pas où chercher, et que la plupart des appels sans argument viennent de là.
2. **Le hameçon ensuite**, parce qu'il ne fait que répéter ce que la porte sait dire.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-agents - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve (recettes, comptes, commit, porte, push) — le pilot clôt l'item sur gains constatés.
