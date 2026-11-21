# Retours forges — factory-digit-ai-fr — 20261114w

- **Contexte** : run `forge-digit-ai-fr-20261114a`, page de la forge des tests. Le créateur a rejeté la longueur du texte et ses phrases méta, et demande que le problème remonte à la Factory pour qu'il ne se répète pas.
- **Références ledger** : forge/ledger.jsonl seq 171, 175, 176, 177.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 14/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le texte de la page de la forge des tests faisait 1 910 mots dans la partie lue par le visiteur. Le créateur a cité une de ses phrases : « Ce type de phrase ne veut rien dire, ne sert à rien et perd le lecteur : "Cette solution est complète au sens précis suivant :". Une nouvelle passe est effectivement nécessaire pour réduire la quantité de texte, supprimer le superflu et se focaliser sur les phrases et termes importants. »

Trois causes se cumulent :

- l'oracle d'écriture du pilot ne voit pas ces phrases ;
- une règle de forme fait écrire des phrases sur les tableaux ;
- le prompt du run a fait définir un mot au lieu de le retirer, sans borner la longueur.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte deux retours : RP-28 pour l'oracle d'écriture, RP-29 pour la façon dont un prompt cadre un texte publié.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-28 | **majeur** | générique | **`oracle-ecriture.mjs` (1.1.0) rend PASS sur un texte que le créateur rejette pour ses phrases méta.** Sur 2 464 mots, la famille EC-1 `annonce-vide` compte 0 occurrence. La partie lue par le visiteur en porte au moins 4 : « Cette solution est complète au sens précis suivant : », « Voici ce que cette solution change pour votre décision de livrer. », « Les faits ci-dessous sont mesurés ou écrits… », « Le tableau suivant range chaque service… ». EC-14 (concision) est SKIP, car un texte de site n'a pas d'en-tête `destinataire:`. Preuve : sortie de l'oracle sur le texte d'avant la passe de réduction, lignes 21, 79, 93 et 103. | Ajouter à `annonce-vide` les motifs « au sens (précis) suivant », « voici ce que », « les … ci-dessous sont », « le tableau suivant (range, donne, dit, liste) ». Juger EC-14 sur tout texte qui déclare un lecteur (`lecteur:` au frontmatter) ou qui vit dans un dossier de contenus de site, avec un budget de mots par section. |
| RP-29 | **majeur** | générique | **Un prompt de run a fait définir un mot vague dans le texte publié, sans budget de longueur.** Le critère 4 de la revue L99 du 14/11/2026 (indice g) imposait « « complète » n'apparaît que défini sur la page ». Aucun budget de mots n'était fixé hors de la présentation. Le rédacteur a écrit une phrase de définition, et la page a atteint 1 910 mots, dont 863 pour les 6 étapes. Preuve : le prompt de la revue, critère 4 ; le comptage par section ; ledger seq 171. | Dans `prompt-analyzer-l99` et les gabarits de page : un mot vague du commanditaire se traduit en fait vérifiable, ou se retire du texte ; il ne se « définit » jamais dans le texte publié. Tout gabarit de page de contenu porte un budget de mots par section, mesuré par un oracle. |

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Ce chapitre porte un retour, RP-30 : une règle de forme des documents fait écrire, dans un texte de site, des phrases sur les tableaux.

Le tableau se lit comme le précédent.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-30 | **mineur** | générique | **La règle M10 de `check_markdown.py` (skill `digit-ai-page-html`) exige un mode d'emploi pour tout tableau de plus de 12 lignes.** Sur un texte destiné aux visiteurs d'un site, elle fait écrire « Le tableau suivant range chaque service… », une phrase que le créateur juge inutile. Preuve : texte de la page, ligne 103 ; `check_markdown.py`, lignes 249 à 267. | Exempter de M10 un Markdown de contenu de site, qui déclare `lecteur:` au frontmatter ou des titres imposés par un gabarit de page. À défaut, n'accepter comme mode d'emploi qu'une phrase qui porte un fait sur le contenu, jamais une phrase sur le tableau. |

## La règle qui aurait évité le retour

- RP-28 : la règle EC-1 du plancher d'écriture existe, mais sa liste ne couvre pas ces tournures, et EC-14 ne juge pas un texte de site. Classe : `regle-morte`.
- RP-29 : un critère de prompt qui demande de définir un mot dans le texte publié, et un gabarit de page sans budget de longueur. Classe : `gabarit-document`.
- RP-30 : une règle écrite pour les documents internes, appliquée à du contenu publié. Classe : `page-html-socle`.

## Remarques restées au produit

- Le texte de la page passe par une réduction (cible de 1 000 mots au plus, rédacteur en cours), puis son contrôle de compréhension est rejoué. Généralisable : oui, c'est l'objet des 3 retours ci-dessus.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
