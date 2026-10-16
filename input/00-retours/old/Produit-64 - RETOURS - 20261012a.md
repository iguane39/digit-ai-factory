# Lot de retours — Produit-64 → digit-ai-forge-agents (digit-ai-page-html) — 2026-10-12, indice a

**Émetteur** : produit `Produit-64` · **Cible** : `digit-ai-forge-agents`, skill
`digit-ai-page-html` (`scripts/check_html.py`, règles L3 bis et L8) · **Origine** : retour du porteur
du 12/10/2026 sur la page « Comparatif des pipelines », indice `20261012a`, capture à l'appui :
« On a déjà dit que des tooltips qui ne font que reprendre du texte déjà présent ailleurs n'avait
aucun intérêt. »

> **Note de réception du pilot (12/10/2026)** : le produit numérotait ce retour RT-31, déjà défini par son lot `20261001b`. Le pilot l'a renuméroté RT-32, premier numéro libre, au .md et au sidecar, avant l'ingestion.

Ce lot porte **1 retour**, mesuré sur la page fautive et sur sa correction. Il **se rapporte à
`TF-1593`** (corrigé le 03/10/2026), dont il mesure la limite : la correction juge une infobulle
contre son voisinage immédiat et à l'identique, et le défaut relevé ce jour vit ailleurs.

- **Contexte** : synthèse comparative des pipelines du guide développeur, d'IA Essentials et de
  Cockpit IA, générée par un script de session, jugée par les quatre familles d'oracles du socle
  avant remise. Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar copiés dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-12** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées
  des deux côtés après la copie. L'original reste ici, historique du produit.

---

## digit-ai-forge-agents (`digit-ai-page-html`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-32 | majeur | générique | **Une infobulle qui recopie un texte affiché AILLEURS sur la page passe `check_html`, et deux règles du socle poussent à l'écrire.** Mesuré le 12/10/2026 sur `output/old/03-Syntheses/Client-A - Comparatif des pipelines - Guide, IA Essentials, Cockpit IA - 20261012a.html` : `check_html.py` PASS sur 43 règles (empreinte `319a59adaf68`), `render_page.py` PASS, `run-oracles-design.mjs` PASS 8 sur 8. Pourtant **73 liens de code sur 73** (`a.ref`, href `#r-<code>`) portent un `title` égal, mot pour mot, au texte de l'entrée de glossaire qu'ils désignent (`dd` qui suit `dt#r-<code>`) ; **62 pastilles de statut sur 62** (`span.st`) portent un `title` égal à leur définition, déjà publiée dans la légende du chapitre 2 ; et les 5 liens `#mod-nn` portent un `title` qui recopie le début de la cellule « Modification » de la ligne visée. Un quatrième cas est une **paraphrase** du voisinage : sur la ligne PC-11, le `title` « Appliquer avant de fusionner » répète la cellule « l'application précède la fusion », en d'autres mots. Cause : la boucle L3 bis de `TF-1593` compare la forme normalisée de l'aide aux textes de `_voisinage(cible, n)` seulement, à l'égalité. Elle ne voit ni la cible d'un lien interne, ni une légende publiée dans un autre chapitre. Et deux règles **poussent** au défaut : L8 exige d'un lien interne à libellé court un `title` d'au moins 12 caractères « décrivant la cible », ce que la recopie de la cible satisfait ; L3 exige une légende des pastilles et l'accepte sous forme d'infobulle. Correction faite chez ce produit : indice `20261012b`, infobulles réécrites (niveau, condition concrète, conséquence, coût de ne pas faire), pastilles sans infobulle ; contrôle croisé « 80 infobulles, 0 présente dans le texte visible », `check_html` PASS. | Étendre L3 bis à deux cibles mécaniques : le `title` d'un `a[href^="#"]` comparé au texte de l'élément visé (et de son `dd` quand la cible est un `dt`) ; le `title` d'un élément comparé au texte des légendes de la page qui définissent sa classe ou sa valeur. Dans L8, accepter `aria-label` ou un `title` qui DIFFÈRE du texte de la cible, et le dire dans le message. La paraphrase n'est pas mécanisable : l'ajouter au gabarit de revue de lecture, « une infobulle apprend-elle quelque chose que la page n'écrit pas ? ». Fixtures : une rouge pour chacune des trois formes (lien vers glossaire, pastille légendée, lien vers une ligne), une verte où l'infobulle porte un niveau ou une conséquence absents de la page. |

**Portée** : générique — toute page du socle qui a un glossaire, une légende de statuts ou des liens
internes vers des lignes de tableau y est exposée.

## Rattachement — RT-32 se rapporte à `TF-1593`

`TF-1593` (corrigé le 03/10/2026, `digit-ai-forge-agents 9be4cf9`) a étendu L3 bis aux infobulles hors
tableau et au voisinage immédiat. RT-32 ne le rouvre pas : sa correction tient sur ce qu'elle vise.
RT-32 décrit le cas qu'elle laisse passer, la copie d'un texte affiché ailleurs que dans le voisinage,
et la poussée de L8. À l'ingestion, RT-32 gagne à ouvrir un item qui cite `TF-1593`.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le générateur de la page posait par construction l'infobulle d'un code égale à son libellé de glossaire, et celle d'une pastille égale à sa légende | deux tables distinctes dans le générateur : le libellé au glossaire, le détail (niveau, condition, conséquence) en infobulle ; pastilles sans infobulle | oui | remonté : RT-32, la même construction est permise par le socle à tout générateur |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la page est générée par un
script de session, sur les jetons de la charte Client-A et les composants embarqués du socle
(`table-filters.js`, `table-filters.css`, `find-in-page.js`, parité vérifiée par
`embarquer-composants.mjs --constat`).

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : les lectures Azure DevOps du jour (environnements
et contrôles d'environnement du projet APP-IA) ont toutes répondu, et rien n'a été refusé.

## Documents mûrs

Aucun document mûr nouveau sur ce lot. Relevé `LOT-MURS` du 12/10/2026
(`node forge/retours/oracle-lot.mjs --murs .`) : les mêmes documents d'`output/` à 5 versions datées
ou plus qu'au lot `Produit-64 - RETOURS - 20261001c`.

## Confirmations positives

- La règle L3 de lisibilité des infobulles longues a mordu sur la correction : 4 infobulles de plus de
  200 caractères écrites en paragraphe ont été refusées, puis acceptées une fois écrites en liste, une
  phrase par ligne.
- `run-oracles-design.mjs` a refusé deux défauts réels de la première version de la page, glyphes
  dans l'interface (S6) et espacements hors échelle de 4 pt (T3), corrigés avant remise.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-32** — aucune classe existante ne convient. Clé proposée `infobulle-qui-recopie-la-page`,
  famille `page-html-socle`, libellé « Une infobulle recopie un texte que la page affiche déjà, hors
  de son voisinage immédiat (la cible d'un lien interne, une légende d'un autre chapitre) ou en le
  paraphrasant : elle passe la règle qui juge la redite, parce que celle-ci ne regarde que les
  voisins et l'égalité, et une règle de forme qui exige une infobulle pousse à l'écrire ainsi ».

## Ordre recommandé

1. RT-32 — un seul item ; la règle L8 pousse au défaut dans chaque page à liens internes.
