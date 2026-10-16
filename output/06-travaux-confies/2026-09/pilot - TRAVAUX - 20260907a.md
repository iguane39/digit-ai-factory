# Travaux confiés par le pilot — digit-ai-forge-agents — 20260907a

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — items TF-0855 (la porte de publication rend FAIL sur `main` : cinq mentions réelles d'un nom de produit et d'un toponyme dans des fiches d'experts et un manifeste) et TF-0880 (la règle C5 cherche une clé courte sans frontière : trois faux positifs dans des blobs base64), tous deux remontés par cette forge dans son lot de retours 20260906a (RC-2 : le constat sur les cinq mentions ; RC-3 : le constat sur la frontière), classes `anonymisation-portee-partielle` (récidive marquée) et `porte-cle-courte-sans-frontiere` (créée le 07/09) ; décidés le 07/09/2026 (D-24 (a)) comme UN SEUL lot ; confiés sur mandat humain « traite … 58 », action A-58 de la synthèse `output\04-plans\…20260905m.md`
- **Dépôt** : ce fichier a été déposé par le pilot dans `input\00-travaux\` de cette forge, sur mandat humain. L'original reste au pilot (`output\06-travaux-confies\`). Statut : `a_traiter` → `traite le <date>` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : `TF-0855+TF-0880@20260907` — deux lots portant la même empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.
- **Sidecar machine** : `pilot - TRAVAUX - 20260907a.tf.jsonl`, une ligne par élément.
- **Ce qui suit ce lot** : une fois vos commits faits (pas de push, la porte est rouge sur l'histoire), le pilot réécrit l'histoire de cette forge avec les deux tables du canal confidentiel et publie en force, votre commit du jour `9454701` et celui de ce lot compris.

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

### TF-0855 — Cinq mentions réelles d'un nom de produit et d'un toponyme dans l'arbre courant, à remplacer par le pseudonyme par un commit ordinaire · gravité bloquant, récidive

- **Le fait** : mesuré par vous le 06/09/2026 sur `main` à `db3d391`, puis à l'identique après votre lot : la porte `oracle-nom-client-publie` avec les deux tables rend FAIL, 8 constats C5, tous dans le contenu de fichiers suivis. Cinq sont des mentions réelles du nom de `Produit-09` suivi d'un toponyme : `experts-forge\fiches\expert-seo-web.md` ligne 6, `experts-forge\fixtures\fixture-seo-web.md` ligne 9, `experts-forge\references\corpus-seo-web.md` ligne 3, `quality-oracles\fixtures\manifest.json` ligne 487, `quality-oracles\fixtures\parite-migration-red.txt` ligne 1 — un dépôt public les sert. La porte était verte le 05/09 parce que la table ne portait pas encore la forme courte, pas parce que le dépôt était propre.
- **Pourquoi cela vous concerne** : la forge qui porte la porte est la première à devoir la passer ; tant que ces cinq mentions vivent, votre commit du jour `9454701` (le contrat de sortie du lanceur) reste local, et le parc entier lit une porte que sa propre forge ne passe pas.
- **Ce qui est demandé** : (1) remplacer les cinq mentions par le pseudonyme `Produit-09` (le toponyme qui le suit se remplace par un nom de lieu inventé, la fiche d'expert restant lisible) ; (2) vérifier qu'aucune autre mention ne vit dans l'arbre courant, avec les tables du canal (`c:\dev\_confidentiel\tables\`) : `node .claude\skills\quality-oracles\scripts\oracle-nom-client-publie.mjs . --referentiel=c:\dev\_confidentiel\tables\noms-interdits.json --produits=c:\dev\_confidentiel\tables\produits-pseudonymes.json` ne doit plus rendre que les constats de l'HISTOIRE (messages ou contenus anciens), aucun sur l'arbre courant ; (3) rejouer les recettes que ces fichiers servent (fiches d'experts, manifeste des fixtures, parité de migration).
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : la porte jouée avec les tables du canal ne cite plus aucun fichier de l'arbre courant ; les recettes de la forge sont vertes ; le commit est fait, NON poussé (le pilot réécrit puis publie).
- **Si ce n'est pas fait** : la forge des outils publie sur une porte rouge, et le contrat de sortie du lanceur reste sur un seul poste.

### TF-0880 — La règle C5 cherche la clé littérale sans frontière : trois faux positifs sur huit dans des blobs base64 · gravité majeur

- **Le fait** : `porteProduit()` de `oracle-nom-client-publie.mjs` teste `hay.includes(clé)` pour la graphie littérale ; les variantes bornées par `(?<![A-Za-z0-9])…(?![A-Za-z0-9])` ne sont dérivées que si la clé porte au moins deux mots et huit lettres, donc une clé courte d'un seul mot n'a jamais de frontière. Mesuré par vous le 06/09/2026 : trois des huit constats C5 tombent sur la même sous-chaîne d'un blob base64 de police woff2 (`digit-ai-schemas\assets\exemple-reference.html` ligne 92, `template-modele-donnees.html` ligne 93, `template-multi-bandes.html` ligne 92) — 37,5 % de bruit, et un lecteur pressé qui voit trois constats faux décide que les cinq autres le sont aussi.
- **Pourquoi cela vous concerne** : la porte est jouée avant chaque push de tout le parc ; un faux positif à chaque clé courte est un bruit que chaque forge paiera, et le pilot vient de poser une clé courte de trois lettres comme alias dans la table.
- **Ce qui est demandé** : (1) appliquer à la graphie littérale la même frontière que celle déjà écrite pour les variantes (le code existe deux lignes plus haut dans le même fichier) ; (2) l'arbitrage que vous nommiez, tranché par le pilot : une clé purement alphanumérique se borne ; une clé qui contient déjà un séparateur (point, tiret, espace) se cherche telle quelle, bornée aux deux bouts par un non-alphanumérique — le comportement des variantes ne change pas ; (3) fixtures double sens à la recette de `quality-oracles` sur dépôt jetable : un blob base64 qui contient la clé → PASS ; la clé en mot entier dans un texte → FAIL ; la clé collée à des lettres (« ABCXYZ » pour une clé « XYZ ») → PASS ; (4) rejouer la porte sur la forge de développement à `4d81314` avec les tables du canal : attendu, plus aucun constat dans un blob.
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : la recette de `quality-oracles` compte les trois cas (221 → 224 au moins) ; la porte sur cette forge, tables du canal, ne cite plus `digit-ai-schemas\assets\` ; le contrat de sortie `findings[]` est inchangé.
- **Si ce n'est pas fait** : chaque clé courte de la table fait accuser des blobs et des mots entiers, et le vrai constat se perd dans le bruit.

## Ce que le pilot a déjà fait de son côté

- Les deux constats sont entrés au registre depuis votre lot 20260906a ; RC-3 par une classe créée le 07/09 (`porte-cle-courte-sans-frontiere`), tous deux décidés le 07/09 (D-24 (a)) en un seul lot, rangs 1 et 2.
- Les deux tables vivent désormais dans le canal confidentiel (dépôt privé cloné en `c:\dev\_confidentiel\`, D-28 (a)) ; les anciens fichiers libres de la racine sont renommés et ne se lisent plus. Votre porte reçoit encore les chemins en arguments (`--referentiel`, `--produits`) : le pilot ne change pas vos défauts, c'est votre lot (candidature à remonter si vous le jugez utile).
- Votre commit du jour `9454701` (TF-0824, contrat de sortie) est intact, local ; il partira avec la publication forcée que le pilot fera après ce lot.
- Rien n'a été écrit dans le code de la forge ; la boîte `input\00-travaux\` est ignorée par votre `.gitignore`.

## Ce que le pilot NE demande PAS

- Pas de réécriture d'historique par vous, pas de push : le pilot réécrit et publie après vos commits.
- Pas de changement des règles C1 à C4 ni du contrat de sortie `findings[]`.
- Pas de copie de la table des pseudonymes dans le dépôt : elle reste au canal, lue au moment du geste.
- Pas de changement du comportement des variantes multi-mots : seule la graphie littérale gagne sa frontière.

## Ordre recommandé

1. **TF-0880 (la frontière) d'abord**, parce qu'une fois posée, la mesure de TF-0855 ne porte plus que les cinq vrais constats, et que la vérification « plus aucun constat sur l'arbre courant » devient lisible.
2. **TF-0855 (les cinq mentions) ensuite**, parce que sa preuve est la porte corrigée jouée sur l'arbre.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-agents - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve (recette, comptes, commits — non poussés) — le pilot réécrit l'histoire, publie, puis clôt les deux items sur gains constatés.
