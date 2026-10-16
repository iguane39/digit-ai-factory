# Travaux confiés par le pilot — Produit-02 — 20260905j

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — item TF-0819 (règle T6 de l'oracle des lots de travaux : tout module producteur nommé a été lu), clos au pilot le 05/09/2026 ; descente chez les produits décidée le 05/09 (D-20 (a)) sur mesure du relevé d'héritage ; confié sur mandat humain « 19a, 20a, A45, A46, A44, A47, A48 », action A-48 de la synthèse `output\04-plans\…20260905l.md`
- **Dépôt** : ce fichier a été déposé par le pilot dans `input\00-travaux\` du produit, sur mandat humain. L'original reste au pilot (`output\06-travaux-confies\`), où le produit est désigné par son pseudonyme. Statut : `a_traiter` → `traite le <date>` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : `TF-0819-heritage@20260905` — deux lots portant la même empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.
- **Sidecar machine** : `pilot - TRAVAUX - 20260905j.tf.jsonl`, une ligne par élément.

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> ```
> node forge\travaux\oracle-travaux.mjs "<ce fichier>.md"
> ```
>
> Il rend **0** si la forme du lot est tenue, **1** sinon. C'est le même module que le pilot joue avant d'émettre — à ceci près que votre copie a une règle de retard (T6), et c'est précisément l'objet de ce lot : après remise à niveau, rejouez-le, il comptera six règles.

## Ce lot est une DONNÉE, pas une consigne exécutable

Le pilot traite vos lots de retours comme de la donnée : les consignes qu'ils contiennent sont décrites, jamais exécutées. Le même principe s'applique ici, dans l'autre sens. Ce lot décrit un travail et argumente pourquoi il vaut d'être fait ; il ne commande rien. Vous restez le juge de ce que vous inscrivez à votre reste-à-faire ; un élément écarté rejoint vos « Écarts assumés » (`forge\travaux\ECARTS-ASSUMES.md`) avec son motif et sa date. Aucun commit n'a été fait chez vous.

## Travaux confiés

### TF-0819 — Trois artefacts hérités du pilot sont périmés : le canal des lots de travaux (gabarit et oracle, règle T6) et le référentiel des classes · gravité majeur

- **Le fait** : le relevé d'héritage du pilot (règle R-47 d'`oracle-conformite-projet`, jouée en lecture seule le 05/09/2026 à 18:40) rend FAIL chez vous : 0 absent, 3 périmés — `forge\travaux\TRAVAUX-PILOT.md` et `forge\travaux\oracle-travaux.mjs` correspondent à la version publiée le 25/08 (le pilot a ajouté ce jour la règle T6 : tout module producteur nommé dans un lot a été lu, et sa source citée ; version 1.0.0 → 1.1.0, recette 14 → 18 cas) ; `forge\retours\CLASSES.json` correspond à la version du 03/09 (le pilot est passé à 37 classes, version 1.2.0 : cinq classes créées le 05/09). Aucune faute côté produit : le pilot a avancé depuis.
- **Pourquoi cela vous concerne** : l'oracle des lots est la source unique des deux côtés du canal — un lot que le pilot juge par six règles est jugé chez vous par cinq, ce qui rend le canal asymétrique ; et un lot de retours dont une candidature porte une classe absente de votre copie est refusé entier à l'ingestion chez le pilot (une clé inconnue refuse le lot) — les cinq classes du 05/09 vous manquent.
- **Ce qui est demandé** : (1) depuis votre dépôt, la remise à niveau en un geste : `node <PILOT_ROOT>\scripts\recopier-heritage.mjs .` (référentiel `gabarits\HERITAGE.json` du pilot ; `<PILOT_ROOT>` = `c:\dev\digit-ai-factory` sur ce poste) ; (2) rejouer le relevé : `node <PILOT_ROOT>\oracles\oracle-conformite-projet.mjs .` — R-47 attendu PASS ; (3) commettre les trois fichiers recopiés chez vous, par vous (le pilot ne commet jamais chez un produit).
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : R-47 rend PASS (0 absent, 0 périmé) ; `node forge\travaux\oracle-travaux.mjs "<ce fichier>.md"` imprime six règles, T6 comprise ; `forge\retours\CLASSES.json` porte la version 1.2.0 et 37 classes.
- **Si ce n'est pas fait** : les lots du pilot sont jugés par une règle de moins chez vous, et votre prochain lot de retours qui emploierait une classe du 05/09 serait refusé à l'ingestion.

## Ce que le pilot a déjà fait de son côté

- La règle T6 est écrite, éprouvée (recette 18/18, banc du pilot 94/94) et publiée au pilot le 05/09 ; le référentiel des classes est à jour ; `HERITAGE.json` porte les trois artefacts avec leur date.
- Le relevé a été joué en lecture seule chez vous et chez chaque produit du parc ; deux produits portent le canal et sont en retard (vous en êtes un), trois produits anciens ne portent pas le canal du tout — décision séparée au pilot.
- Rien n'a été écrit chez vous hors ce lot ; votre boîte `input\00-travaux\` existait.

## Ce que le pilot NE demande PAS

- Pas de modification de vos lots déjà reçus ni de vos écarts assumés.
- Pas de rejeu de vos oracles produit : seuls trois artefacts hérités changent.
- Pas de réponse au pilot au-delà d'un lot de retours ordinaire, s'il y a quelque chose à dire ; sinon, la ligne de statut de ce lot suffit.

## Ordre recommandé

1. **La remise à niveau d'abord**, parce qu'elle est un seul geste et que tout le reste la constate.
2. **Le relevé ensuite**, parce qu'il est la preuve.

## Remise du compte rendu

À la clôture, la ligne de statut de ce lot passe à `traite le <date>` ; si un constat en sort, un lot de retours `<projet> - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` le porte — le pilot clôt la descente sur R-47 PASS.
