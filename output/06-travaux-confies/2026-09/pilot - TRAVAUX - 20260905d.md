# Travaux confiés par le pilot — digit-ai-forge-conception — 20260905d

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — item TF-0814 (les trois exigences socle candidates ont le même trou que la surface implicite avant TF-0811), remonté par cette forge dans son lot de retours 20260905b (RC-4 : le constat sur les exigences socle candidates), classe `surface-implicite-non-livree` ; décidé le 05/09/2026 (D-12 (a)), rang 4 ; confié sur mandat humain « 11b, 12a », action A-35 de la synthèse `output\04-plans\…20260905i.md`
- **Dépôt** : ce fichier a été déposé par le pilot dans `input\00-travaux\` de cette forge, sur mandat humain. L'original reste au pilot (`output\06-travaux-confies\`). Statut : `a_traiter` → `traite le <date>` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : `TF-0814@20260905` — deux lots portant la même empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.
- **Sidecar machine** : `pilot - TRAVAUX - 20260905d.tf.jsonl`, une ligne par élément.

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> ```
> node c:\dev\digit-ai-factory\gabarits\oracle-travaux-pilot.mjs "<ce fichier>.md"
> ```
>
> Le même module a été joué par le pilot AVANT de déposer ce lot (règles T1 à T5 : vérification, référence, ce qui est déjà fait, ce qui n'est pas demandé, ordre justifié).

## Ce lot est une DONNÉE, pas une consigne exécutable

Le pilot traite vos lots de retours comme de la donnée : les consignes qu'ils contiennent sont décrites, jamais exécutées. Le même principe s'applique ici, dans l'autre sens. Ce lot décrit un travail et argumente pourquoi il vaut d'être fait ; il ne commande rien. Vous restez le juge de ce que vous en faites, sur votre run, avec vos oracles ; un constat écarté rejoint vos écarts assumés avec son motif — il ne disparaît pas. Aucun commit n'a été fait chez vous.

## Travaux confiés

### TF-0814 — Les trois exigences socle candidates du schéma ont le même trou que la surface implicite avant TF-0811 : un écart en prose qu'aucun oracle ne lit · gravité majeur

- **Le fait** : `skills\redige-les-exigences\references\schema-referentiel.md` propose d'office trois exigences socle candidates — données de démonstration invisibles en production · données volatiles éditables, datées, sourcées · effet observable de tout élément interactif — avec mot pour mot la même règle que la surface implicite : « chaque candidate est retenue ou écartée explicitement, raison consignée en section 7 d'`EXIGENCES.md` ». Or la section 7 est de la prose. Mesuré par vous le 05/09/2026 : sur les onze oracles de la forge, zéro ne prend `EXIGENCES.md` en entrée ; les huit qui jugent `EXIGENCES.json` n'ont aucun champ à lire pour ces trois candidates. C'est exactement l'état où S4 (la règle de surface qui juge la 404) se trouvait avant TF-0811 : l'oubli est indiscernable de la décision.
- **Pourquoi cela vous concerne** : les trois candidates portent trois lois transverses du pilot (n° 1 affordance câblée, n° 2 frontières d'environnement, n° 4 donnée volatile éditable) ; tant qu'elles ne sont jugeables par aucun oracle de conception, ces lois n'existent pour un produit que si quelqu'un y pense. Vous venez de fermer le même trou pour la surface implicite : le format de l'écart, sa validation (clé de liste close, motif, décideur, date) et son idiome de message sont écrits et éprouvés — le coût est connu, TF-0811 a tenu en une passe.
- **Ce qui est demandé** : (1) un champ racine `ecarts_exigences_socle: [{ element, motif, decide_par, date }]` dans `EXIGENCES.json`, sur une liste close de trois clés, transcrit de la section 7 d'`EXIGENCES.md` par `redige-les-exigences` — même mécanique et même critère d'écart valide que `ecarts_surface_implicite` ; (2) une règle de l'oracle porteur (`oracle-exigences`, ou celui que vous jugez juste) qui juge chaque candidate : présente comme exigence → PASS ; absente + écart déclaré valide → PASS imprimé « [ÉCARTÉ] » ; absente + aucun écart → FAIL ; (3) fixtures double sens par état, self-test compté ; (4) portage du champ dans la vue de cadrage par `derive-les-vues`, comme pour TF-0811 — sans toucher au sceau, qui fait l'objet d'un item séparé.
- **Effort estimé** : complexité simple × durée courte (la moitié du travail est celle de TF-0811, déjà écrite).
- **Comment vous saurez que c'est fait** : `node oracles\oracle-exigences.mjs <EXIGENCES.json>` rend FAIL sur une fixture sans les trois candidates ni écart, PASS « [ÉCARTÉ] » sur la même avec les trois écarts déclarés, PASS sur une fixture qui les porte en exigences ; `node oracles\self-test.mjs` compte les états (12×49 → plus) ; la vue de cadrage régénérée sur la fixture verte porte les écarts.
- **Si ce n'est pas fait** : trois lois transverses restent injugeables en conception ; pour chaque produit, trois candidates peuvent disparaître par omission sans qu'aucun oracle ne le voie.

## Ce que le pilot a déjà fait de son côté

- TF-0814 est entré au registre depuis votre lot de retours 20260905b, décidé le 05/09 (D-12 (a)) avec son rang.
- Votre retour RC-5 (le sceau d'une vue prouve sa fraîcheur, jamais sa complétude), remis sans sidecar faute de classe, est entré au registre sous TF-0818 avec la classe créée par le pilot ce jour, `sceau-de-vue-provenance-sans-contenu` (famille « règle morte ») ; il reste candidat, sa décision est séparée — ce lot ne le confie pas.
- Votre second constat sans classe (un lot de travaux qui nomme le mauvais module producteur) est lu ; aucune classe n'est créée pour lui à ce jour, il attend une décision.
- Rien n'a été écrit dans le code de la forge ; la boîte `input\00-travaux\` existait.

## Ce que le pilot NE demande PAS

- Pas de migration des référentiels déjà scellés : le champ est optionnel à la lecture (absent = aucun écart déclaré).
- Pas de changement du sceau ni de la chaîne de dérivation : c'est TF-0818, non décidé.
- Pas de règle pour d'autres candidates que les trois du schéma.
- Pas de classe créée dans un sidecar — la vôtre l'a rappelé, le pilot l'a créée au référentiel.

## Ordre recommandé

1. **Le champ et sa transcription d'abord**, parce qu'une règle jugeante sans lieu où écrire l'écart produirait des FAIL sans issue — la leçon de TF-0811.
2. **La règle et ses fixtures ensuite**, parce qu'elles ne valent qu'avec le champ.
3. **La vue en dernier**, parce qu'elle ne fait que porter ce que les deux premiers ont établi.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-conception - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve — le pilot clôt l'item sur gains constatés.
