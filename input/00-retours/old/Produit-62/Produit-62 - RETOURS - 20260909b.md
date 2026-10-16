# Retours forges — Produit-62 — 20260909b

- **Contexte** : friction interne observée en séance, sans retour humain : une notification de tâche de fond échue est arrivée après coup, sans rien apporter de neuf. Le référentiel de restitution prévoit exactement ce cas et prescrit un accusé de réception bref ; son juge automatique a refusé cet accusé avec quatre constats bloquants et a exigé les neuf blocs. Le référentiel et son juge disent le contraire l'un de l'autre, et c'est le juge qui gagne parce qu'il est câblé.
- **Références ledger** : `forge\ledger.jsonl` seq 79 (friction observée), seq 80 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-09

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `gabarits\RESTITUTION.md` et `oracles\oracle-synthese.mjs`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-03 | majeur | générique | **Le référentiel de restitution déclare une exemption que son juge n'implémente pas : un tour sans nouveauté doit se solder par un accusé bref, et l'accusé bref est refusé.** Le texte, en version 2.20.0, est explicite : « un tour qui n'apporte rien de neuf (une notification de tâche de fond, un rapport reçu et rien d'autre) relève des exemptions du §Portée : un accusé de réception bref, jamais une restitution complète de plus ». Fait observé le 2026-09-09 : une notification de tâche de fond échue arrive, sans rien changer au dépôt — `git status` vide sur `output\`, aucun contrôle rejoué, aucun verdict déplacé. L'accusé bref rendu, de trois phrases, a été refusé par le hook `Stop` avec **quatre constats bloquants** : S1 sur les huit blocs absents, S3 sur le verdict sans fait mesurable, S4 sur la décision sans choix fermé, S6 sur les actions sans acteur. La restitution complète qu'il a fallu écrire à la place fait quatre-vingt-dix lignes pour dire qu'il ne s'est rien passé, et elle a coûté deux passages d'oracle. *Une exemption écrite dans le référentiel et absente de son juge n'existe pas : c'est le juge qui fait la règle, et le texte devient trompeur pour qui le lit.* | Deux voies, et la première est la moins coûteuse. **(1)** Le juge apprend l'exemption : `oracle-synthese` accepte un message court quand il ne porte NI verdict, NI décision, NI action neuve — trois absences mécanisables — et le hook `Stop` cesse alors de réclamer les neuf blocs. La forme de l'accusé se normalise en trois lignes obligatoires : ce qui est arrivé, ce que cela ne change pas, et ce qui reste attendu de l'humain. **(2)** À défaut, le référentiel retire l'exemption et l'assume : toute fin de tour rend les neuf blocs, y compris pour une notification. Ce qui n'est pas tenable, c'est l'état actuel, où le producteur qui suit le texte est refusé par le code. Fixture double sens indispensable : un accusé conforme aux trois lignes (PASS), un accusé qui glisse un verdict ou une action neuve (FAIL, il redevient une restitution). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Une sortie de commande échue est revenue plusieurs heures après son lancement, sur une page régénérée douze fois depuis | la sortie a été confrontée au journal d'oracles du livrable courant avant d'être citée, et déclarée confirmatoire | oui, mais mineur : c'est une conduite, pas une règle — versée en remarque plutôt qu'en item | resté au produit |
| La restitution complète d'un tour sans nouveauté noie les tours qui en portent une | le bloc 2 dit en compteurs que rien n'a bougé, ce qui se lit en une ligne | oui | remontée (RP-03) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le gabarit `RESTITUTION.md` du pilot est en cause non par son contenu mais par l'écart entre son texte et son juge, ce que la section précédente détaille.

## Confirmations positives

- Le hook `Stop` a rendu un message d'erreur exploitable : il nomme les quatre règles violées, cite le fichier jugé et prescrit le geste. Le refus n'a coûté qu'une réécriture, pas une enquête.
- La sortie échue, une fois relue, s'est révélée strictement confirmatoire des mesures du journal d'oracles : la traçabilité du produit a permis de le dire en une lecture, sans rejouer aucun contrôle.

## Ordre recommandé

1. RP-03 — un producteur qui suit le référentiel est refusé par le code ; tant que l'écart dure, chaque notification de tâche de fond coûte une restitution complète à tous les produits de la forge.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

L'item ne suit pas un retour humain mais une friction observée en séance. Classe : **RP-03** → `recette-verdict-non-prononcable` (famille `regle-morte`, correspondance APPROCHÉE : la classe vise un verdict qui dépend d'un outil non épinglé, ici c'est un texte normatif dont le juge ignore une clause, donc une règle écrite et morte ; classe candidate `exemption-declaree-non-implementee`, même famille, dont le libellé devrait être « un référentiel déclare une exemption que son juge n'applique pas : le texte devient trompeur et le producteur qui le suit est refusé »).
