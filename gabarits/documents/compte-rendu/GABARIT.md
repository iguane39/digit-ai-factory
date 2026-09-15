# Gabarit — Compte rendu de réunion

**Famille** `gd-compte-rendu` · **Version du gabarit** 1.0.0 · **Écrite le** 15/09/2026

## La règle qui commande toutes les autres

**Cette page ne porte aucun état.** Elle se **dérive** de l'état de mission (`MISSION.md` en
dépôt, fichier mémoire d'espace en conversation), qui reste la source de vérité unique. Un
artefact de cadence est une **vue d'assemblage datée** : s'il faut y saisir une information qui
n'est pas déjà dans l'état de mission, c'est l'état qu'on complète d'abord. *Un chiffre qui
n'existe que dans un compte rendu est un chiffre que la mission ne connaît pas.*

Le bandeau en tête de page le dit **à l'écran**, avec la date du relevé, et non seulement ici :
une vue d'assemblage sans date de source est une source de plus.

## Quand l'employer

Garder trace de ce qui a été décidé pendant une séance, par qui, et de ce que chacun repart
faire. Cadence usuelle : hebdomadaire, ou par réunion.

## D'où la forme est tirée

Du contrat de contenu porté par `pilote-de-mission`, `references/artefacts-de-cadence.md` —
ligne « Compte rendu de réunion » : *présents · décisions · actions **avec porteur et
échéance***, et la phrase qui commande le reste — « une décision sans décideur n'est pas une
décision ». Ce gabarit ajoute une colonne que le contrat n'imposait pas : **« portée à l'état »**,
qui dit où la décision est reportée. Sans elle, le compte rendu devient la seule trace d'une
décision, c'est-à-dire un second porteur d'état — ce que la règle qui commande interdit.

*Sur l'objection du skill propriétaire.* `artefacts-de-cadence.md` écrit qu'il ne prescrit aucun
gabarit de mise en forme, au motif qu'« un gabarit de présentation figé aurait été un objet
durable de plus, sans juge ». Deux réponses, et la décision humaine D-10 (a) du 15/09/2026 qui
tranche : cette page **a** deux juges exécutés — `check_html.py` et `render_page.py` du socle — et
elle n'est **pas durable**, puisqu'elle se déclare dérivée et datée à chaque tirage. Le fond reste
chez le skill qui l'a écrit ; la bibliothèque donne la page.

## Structure — les chapitres sont dus

Les quatre chapitres suivent le déroulé d'une séance et se lisent dans l'ordre inverse : on
ouvre un compte rendu aux actions. *Comment lire ce tableau* : une ligne par chapitre, dans
l'ordre du document ; la dernière colonne est la borne, et c'est elle qui empêche le compte rendu
de devenir un verbatim.

| # | Chapitre | Ce qu'il porte | Ce qu'il ne porte pas |
|---|---|---|---|
| 1 | **Le cadre** | Objet, date, durée, lieu, date de la suivante, et une ligne par rôle convoqué avec sa présence | Aucune décision |
| 2 | **Les décisions prises** | Ce qui a été tranché, par quel rôle, ce que cela ferme, et où c'est reporté à l'état | Aucune décision différée : elle est un point ouvert |
| 3 | **Les actions ouvertes** | Le geste, son porteur, son échéance, et où c'est reporté à l'état | Les actions ouvertes avant la séance |
| 4 | **Ce qui n'a pas été tranché** | Le point, ce qui manquait pour le trancher, le geste qui le lèvera, et la séance où il revient | Les points non abordés |

## Les vocabulaires fermés

- **Présence** : `présent` · `excusé` · `absent`. « Absent » se déclare : un blanc n'est pas une
  réponse — c'est la loi transverse n° 3 appliquée à une liste de convoqués.
- **Rôles** : toujours un rôle, jamais un nom de personne.

## Ce que ce gabarit refuse

- **Un verbatim.** Ce qui a été *dit* n'engage personne ; ce qui a été *décidé* engage. Un compte
  rendu qui restitue la conversation oblige son lecteur à la refaire.
- **Une décision sans décideur.** Elle n'est pas une décision, c'est un consensus supposé — et il
  se défait au premier désaccord.
- **Un point tu parce qu'il n'a pas été tranché.** Un point abordé et laissé de côté revient à la
  séance suivante comme s'il était neuf. Le chapitre 4 existe exactement pour ça.

## Ce que ce gabarit ne juge pas

**Que les présents aient été d'accord.** Un compte rendu enregistre une décision et son décideur ;
il ne prouve pas l'adhésion des autres. C'est voulu : la trace d'un désaccord est un **point
ouvert**, pas une nuance dans une ligne de décision.

## Oracles

- `check_html.py` du socle `digit-ai-page-html` — charte, accessibilité, lisibilité L1-L32 ;
- `render_page.py` du même socle — zéro défaut visuel aux six largeurs, dont **V18** (mesure de
  lecture), **V19** (une seule largeur de contenu) et **V16** (états discernables entre eux) ;
- `oracle-gabarits-documents.mjs` du pilot — G1 à G5 ;
- pour le **fond** : **aucun oracle à ce jour.** La complétude des champs d'un compte rendu est une capacité
  **nommée** par la cartographie du 18/08/2026 et **non ouverte au registre** — limite déclarée
  par `artefacts-de-cadence.md`, reprise ici plutôt que tue.

## Boucle de retour

Le document produit porte `gabarit: gd-compte-rendu` et sa version, **visiblement**, en tête de page. Un
retour sur la **forme** se remet au pilot ; un retour sur le **fond** — quel champ est dû, quel
régime de preuve s'applique — se remet à `pilote-de-mission`.
