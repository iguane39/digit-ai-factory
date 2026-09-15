# Gabarit — Rapport d'avancement

**Famille** `gd-rapport-avancement` · **Version du gabarit** 1.0.0 · **Écrite le** 15/09/2026

## La règle qui commande toutes les autres

**Cette page ne porte aucun état.** Elle se **dérive** de l'état de mission (`MISSION.md` en
dépôt, fichier mémoire d'espace en conversation), qui reste la source de vérité unique. Un
artefact de cadence est une **vue d'assemblage datée** : s'il faut y saisir une information qui
n'est pas déjà dans l'état de mission, c'est l'état qu'on complète d'abord. *Un chiffre qui
n'existe que dans un rapport d'avancement est un chiffre que la mission ne connaît pas.*

Le bandeau en tête de page le dit **à l'écran**, avec la date du relevé, et non seulement ici :
une vue d'assemblage sans date de source est une source de plus.

## Quand l'employer

Dire où en est la mission à une date, et pourquoi elle n'est pas ailleurs. Cadence usuelle :
hebdomadaire. La cadence est une donnée d'instance — elle se déclare à l'état de mission, jamais
dans ce gabarit.

## D'où la forme est tirée

Du contrat de contenu porté par `pilote-de-mission`, `references/artefacts-de-cadence.md` —
ligne « Rapport d'avancement » : *statuts d'étapes, chemin critique, hypothèses ayant bougé*, et
un régime de preuve tenant en quatre mots — **aucun chiffre sans sa source**, troisième critère
d'acceptation de TF-0324. Ce gabarit le rend opposable : la source est une **colonne**, pas une
bonne intention. « 4 étapes sur 9 » se lit dans l'état, et le rapport dit où.

*Sur l'objection du skill propriétaire.* `artefacts-de-cadence.md` écrit qu'il ne prescrit aucun
gabarit de mise en forme, au motif qu'« un gabarit de présentation figé aurait été un objet
durable de plus, sans juge ». Deux réponses, et la décision humaine D-10 (a) du 15/09/2026 qui
tranche : cette page **a** deux juges exécutés — `check_html.py` et `render_page.py` du socle — et
elle n'est **pas durable**, puisqu'elle se déclare dérivée et datée à chaque tirage. Le fond reste
chez le skill qui l'a écrit ; la bibliothèque donne la page.

## Structure — les chapitres sont dus

Les quatre chapitres suivent la question que pose un commanditaire, dans son ordre : où en
sommes-nous, qu'est-ce qui commande la date de fin, qu'est-ce qui a changé depuis la dernière
fois, et quand se reparle-t-on. *Comment lire ce tableau* : une ligne par chapitre, dans l'ordre du
document ; la dernière colonne est la borne, et c'est elle qui empêche le rapport de devenir une
revue de risques.

| # | Chapitre | Ce qu'il porte | Ce qu'il ne porte pas |
|---|---|---|---|
| 1 | **Où en sont les étapes** | Une ligne par étape, son statut, son avancement **constaté**, et la ligne de l'état où le relire | Ni cause de retard ni décision |
| 2 | **Le chemin critique** | Les maillons dont le retard déplace la fin, et le fait qui a bougé chaque échéance | Les étapes hors chemin critique : elles coûtent du confort, pas une date |
| 3 | **Les hypothèses qui ont bougé** | Ce qui était supposé, ce que la mesure en a fait, ce que cela change au plan | Les hypothèses restées stables |
| 4 | **La cadence** | La cadence déclarée, la date du rapport précédent et celle du prochain | Tout engagement de contenu pour le prochain |

## Les vocabulaires fermés

- **Statut** d'une étape : `à faire` · `engagée` · `terminée` · `bloquée`.
- **État** d'une hypothèse : `confirmée` · `infirmée` · `toujours ouverte`.
- **Source** : une section et une ligne de l'état de mission, ou une requête rejouable. Jamais
  « voir avec l'équipe ».

## Ce que ce gabarit refuse

- **Un chiffre sans sa source.** C'est le seul refus qui fait exister ce gabarit : sans lui, le
  rapport devient un second porteur d'état, et deux vérités se contredisent au mois suivant.
- **Un avancement espéré.** La colonne dit ce qui est *constaté* ; une étape « bientôt finie »
  est une étape engagée.
- **Un chapitre des risques.** Les risques ont leur artefact ; les mêmes lignes dans deux
  documents divergent en deux semaines.

## Ce que ce gabarit ne juge pas

**Qu'une source citée dise bien ce qu'on lui fait dire.** `oracle-claims` vérifie qu'un chiffre
porte une source ; il ne rouvre pas la source. Un renvoi vers une ligne qui dit autre chose
satisfait la forme. La parade n'est pas mécanique : elle est que la source soit **rejouable en un
geste** — d'où l'exigence d'une section et d'une ligne, et non d'un nom de fichier seul.

## Oracles

- `check_html.py` du socle `digit-ai-page-html` — charte, accessibilité, lisibilité L1-L32 ;
- `render_page.py` du même socle — zéro défaut visuel aux six largeurs, dont **V18** (mesure de
  lecture), **V19** (une seule largeur de contenu) et **V16** (états discernables entre eux) ;
- `oracle-gabarits-documents.mjs` du pilot — G1 à G5 ;
- pour le **fond** : `oracle-claims` — aucun chiffre sans sa source.

## Boucle de retour

Le document produit porte `gabarit: gd-rapport-avancement` et sa version, **visiblement**, en tête de page. Un
retour sur la **forme** se remet au pilot ; un retour sur le **fond** — quel champ est dû, quel
régime de preuve s'applique — se remet à `pilote-de-mission`.
