# Gabarit — Revue RAID

**Famille** `gd-revue-raid` · **Version du gabarit** 1.0.0 · **Écrite le** 15/09/2026

## La règle qui commande toutes les autres

**Cette page ne porte aucun état.** Elle se **dérive** de l'état de mission (`MISSION.md` en
dépôt, fichier mémoire d'espace en conversation), qui reste la source de vérité unique. Un
artefact de cadence est une **vue d'assemblage datée** : s'il faut y saisir une information qui
n'est pas déjà dans l'état de mission, c'est l'état qu'on complète d'abord. *Un chiffre qui
n'existe que dans une revue est un chiffre que la mission ne connaît pas.*

Le bandeau en tête de page le dit **à l'écran**, avec la date du relevé, et non seulement ici :
une vue d'assemblage sans date de source est une source de plus.

## Quand l'employer

Suivre à cadence les risques, actions, incidents et décisions d'une mission, et **rendre visible
ce qui n'avance pas**. Cadence usuelle : hebdomadaire. La cadence est une donnée d'instance — elle
se déclare à l'état de mission, jamais dans ce gabarit.

## D'où la forme est tirée

Du contrat de contenu porté par `pilote-de-mission`,
`references/artefacts-de-cadence.md` — table des cinq artefacts, ligne « Revue RAID » : *le R,
chaque risque coté (probabilité, impact) avec propriétaire et parade ; A/I/D, porteur et échéance
nommés*. Ce gabarit-ci ne duplique pas ce contrat : il en fournit la **forme HTML**, qui
n'existait nulle part.

*Sur l'objection du skill propriétaire.* `artefacts-de-cadence.md` écrit qu'il ne prescrit aucun
gabarit de mise en forme, au motif qu'« un gabarit de présentation figé aurait été un objet
durable de plus, sans juge ». Deux réponses, et la décision humaine D-10 (a) du 15/09/2026 qui
tranche : cette page **a** deux juges exécutés — `check_html.py` et `render_page.py` du socle — et
elle n'est **pas durable**, puisqu'elle se déclare dérivée et datée à chaque tirage. Le fond reste
chez le skill qui l'a écrit ; la bibliothèque donne la page.

## Structure — les cinq chapitres sont dus

Les cinq chapitres suivent l'ordre de lecture d'un commanditaire, jamais l'ordre du sigle : ce qui
peut encore arriver d'abord, ce qui est déjà arrivé ensuite, ce qui ne bouge pas en dernier — parce
que c'est celui-là qu'on vient chercher. *Comment lire ce tableau* : une ligne par chapitre, dans
l'ordre du document ; la dernière colonne est la borne, et c'est elle qui empêche la revue de
devenir un rapport d'avancement.

| # | Chapitre | Ce qu'il porte | Ce qu'il ne porte pas |
|---|---|---|---|
| 1 | **Les risques** | Le **R** : chaque risque ouvert, coté probabilité × impact, avec propriétaire et parade datée | Aucun risque réalisé — il devient un incident |
| 2 | **Les actions** | Le **A** : porteur, échéance, état | Les parades des risques : elles vivent dans la ligne du risque |
| 3 | **Les incidents** | Le **I** : ce qui est survenu, sa date, son effet sur la mission, son traitement | Aucun risque non réalisé |
| 4 | **Les décisions** | Le **D** : ce qui a été tranché depuis la revue précédente, par quel rôle, et ce que cela ferme | Aucune décision en attente : elle est une action |
| 5 | **Ce qui n'avance pas** | Les étapes en dépassement d'échéance, avec l'écart, sa cause et ce qui la débloque | Aucune étape à l'heure |

## Les vocabulaires fermés

- **Probabilité** d'un risque : `forte` · `moyenne` · `faible`.
- **Impact** d'un risque : `majeur` · `modéré` · `mineur`.
- **État** d'une action : `ouverte` · `engagée` · `close`.
- **Propriétaire, porteur, décideur** : toujours un **rôle**, jamais un nom de personne — une revue
  circule et survit aux personnes.

## Ce que ce gabarit refuse

- **Un risque sans propriétaire.** Il n'est pas coté, il est constaté — et personne ne le porte.
- **Une action sans porteur ni échéance.** Elle n'est pas ouverte, elle est souhaitée.
- **Une étape en dépassement passée sous silence parce que sa cause est connue.** C'est le
  dépassement qui se déclare, pas son excuse.
- **Un chapitre « divers ».** Ce qui n'entre dans aucun des cinq n'appartient pas à la revue.

## Ce que ce gabarit ne juge pas

**La sincérité d'une cote.** Une probabilité `faible` apposée sur un risque que la mission sait
fort satisfait la forme et trompe le lecteur. Aucun oracle ne peut le voir — seul un relecteur le
peut, et c'est pourquoi la colonne « parade » demande une **date** : une parade datée se vérifie.

## Oracles

- `check_html.py` du socle `digit-ai-page-html` — charte, accessibilité, lisibilité L1-L32 ;
- `render_page.py` du même socle — zéro défaut visuel aux six largeurs, dont **V18** (mesure de
  lecture), **V19** (une seule largeur de contenu) et **V16** (états discernables entre eux) ;
- `oracle-gabarits-documents.mjs` du pilot — G1 à G5 ;
- pour le **fond** : `oracle-plan-de-mission` **W5** couvre le R. **A, I et D ne sont pas
  outillés à ce jour** — limite déclarée par `artefacts-de-cadence.md`, reprise ici plutôt que tue.

## Boucle de retour

Le document produit porte `gabarit: gd-revue-raid` et sa version, **visiblement**, en tête de page.
Un retour sur la **forme** se remet au pilot ; un retour sur le **fond** — quel champ est dû, quel
régime de preuve s'applique — se remet à `pilote-de-mission`.
