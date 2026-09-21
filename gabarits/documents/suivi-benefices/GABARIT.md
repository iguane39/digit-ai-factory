# Gabarit — Suivi des bénéfices

**Famille** `gd-suivi-benefices` · **Version du gabarit** 1.0.0 · **Écrite le** 15/09/2026

## La règle qui commande toutes les autres

**Cette page ne porte aucun état.** Elle se **dérive** de l'état de mission (`MISSION.md` en
dépôt, fichier mémoire d'espace en conversation), qui reste la source de vérité unique. Un
artefact de cadence est une **vue d'assemblage datée** : s'il faut y saisir une information qui
n'est pas déjà dans l'état de mission, c'est l'état qu'on complète d'abord. *Un chiffre qui
n'existe que dans un suivi de bénéfices est un chiffre que la mission ne connaît pas.*

Le bandeau en tête de page le dit **à l'écran**, avec la date du relevé, et non seulement ici :
une vue d'assemblage sans date de source est une source de plus.

## Quand l'employer

Confronter, après la mise en service, ce qui était attendu à ce qui est constaté. Cadence usuelle :
mensuelle, sur une période d'observation **bornée** — déclarée à l'état de mission, et rappelée au
dernier chapitre du document.

## D'où la forme est tirée

Du contrat de contenu porté par `pilote-de-mission`, `references/artefacts-de-cadence.md` —
ligne « Suivi des bénéfices » : *mesures de succès — indicateur, cible, source*, avec un régime de
preuve en deux temps — **attendu et constaté, chacun avec sa source et sa date de relevé**. La
date est une colonne et non une note de bas de page : deux relevés de dates différentes ne se
comparent pas sans le dire.

*Sur l'objection du skill propriétaire.* `artefacts-de-cadence.md` écrit qu'il ne prescrit aucun
gabarit de mise en forme, au motif qu'« un gabarit de présentation figé aurait été un objet
durable de plus, sans juge ». Deux réponses, et la décision humaine D-10 (a) du 15/09/2026 qui
tranche : cette page **a** deux juges exécutés — `check_html.py` et `render_page.py` du socle — et
elle n'est **pas durable**, puisqu'elle se déclare dérivée et datée à chaque tirage. Le fond reste
chez le skill qui l'a écrit ; la bibliothèque donne la page.

## Structure — les chapitres sont dus

Les quatre chapitres séparent ce que les suivis de bénéfices mélangent : les nombres d'un côté,
leur lecture de l'autre, et ce qu'ils ne prouvent pas en troisième. *Comment lire ce tableau* :
une ligne par chapitre, dans l'ordre du document ; la dernière colonne est la borne, et c'est elle
qui empêche le suivi de devenir une plaidoirie sur l'effet de la mission.

| # | Chapitre | Ce qu'il porte | Ce qu'il ne porte pas |
|---|---|---|---|
| 1 | **Attendu et constaté** | Une ligne par mesure de succès : cible, valeur relevée, date du relevé, et où rejouer le nombre | Aucune lecture de l'écart |
| 2 | **Les écarts et leur lecture** | L'écart chiffré, sa lecture dans un vocabulaire fermé, et le fait qui l'explique | Ni cible ni source : elles vivent dans la ligne de l'indicateur |
| 3 | **Ce que ce suivi ne prouve pas** | Les limites connues : ce que les nombres ne séparent pas, et ce qu'aucun contrôle ne vérifie | Aucun indicateur |
| 4 | **La cadence** | La cadence, le relevé précédent, le prochain, et la **fin** de la période d'observation | Aucun engagement de valeur |

## Les vocabulaires fermés

- **Lecture** d'un écart : `tenu` · `en retard` · `hors d'atteinte` · `trop tôt pour dire`.
  Cette dernière valeur n'est pas une échappatoire : un indicateur relevé une seule fois n'a pas
  de trajectoire, et le déclarer tenu serait un mensonge poli.
- **Constaté sans date de relevé** : se marque « à vérifier », jamais sous-entendu.

## Ce que ce gabarit refuse

- **Un constat sans date de relevé.** Deux nombres relevés à deux dates différentes ne se
  comparent pas, et le tableau ne laisse pas de place pour l'oublier.
- **Une cible seule, ou un constat seul.** La première est une intention, le second un nombre sans
  échelle. Les deux vivent sur la même ligne, ou ne vivent pas.
- **Un lien de cause présenté comme établi.** Le chapitre 3 existe pour que le document dise
  lui-même ce qu'il ne prouve pas ; le taire coûte une décision prise sur une corrélation.

## Ce que ce gabarit ne juge pas

**La comparaison dans le TEMPS n'a aucun juge.** Les nombres d'un relevé sont vérifiables un par
un — chacun porte sa source et sa date. Mais rien ne contrôle qu'entre deux relevés, l'indicateur
a gardé le même périmètre, la même requête et la même unité : un indicateur dont la définition
change produit une trajectoire qui n'existe pas. C'est la seconde capacité nommée par la
cartographie du 18/08/2026 et non ouverte à ce jour ; le chapitre 3 du document la déclare à
l'écran plutôt que de la taire.

## Le lecteur se déclare

Tout document tiré de ce gabarit déclare son lecteur en tête — frontmatter en `md`, bloc
d'identification en `html` :

```
role_destinataire: {qui lit ce suivi des bénéfices, et pour quelle décision}
```

*Ajouté au report du 21/09/2026 : la règle D11 est née sur main le 15/09, pendant que cette
famille s'écrivait sur une branche qui ne la voyait pas.*

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas
dans ses décisions sort d'ici et vit dans le **document d'auteur** — un fichier distinct, tenu par
celui qui produit, cité en renvoi et jamais recopié :

- le **registre des arbitrages** encore ouverts, avec leur instance et leur état ;
- l'**historique des versions** du document et son statut de relecture ;
- les **notes de production** : sources à confirmer, sections à reprendre, questions à l'auteur.

**La frontière est un critère d'ACTION, pas de confort.** Une information qui change ce que le
lecteur FAIT reste chez lui, même quand elle est inconfortable : « cette règle n'est pas encore
opposable, appliquez-la et signalez tout écart » appartient au document du lecteur, parce qu'un
lecteur doit savoir sur quoi il s'engage. Une information qui ne change que ce que l'AUTEUR doit
encore obtenir part au document d'auteur. Le doute utile au lecteur se dit à l'endroit qui le
concerne ; le doute de l'auteur ne le suit pas.

**Un document long se découpe en VUES d'un fichier unique, pas en fichiers**, sauf demande
contraire de son lecteur : onze fichiers à partager sont un coût pour lui, jamais pour son auteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `check_html.py` du socle `digit-ai-page-html` — charte, accessibilité, lisibilité L1-L32 ;
- `render_page.py` du même socle — zéro défaut visuel aux six largeurs, dont **V18** (mesure de
  lecture), **V19** (une seule largeur de contenu) et **V16** (états discernables entre eux) ;
- `oracle-gabarits-documents.mjs` du pilot — G1 à G5 ;
- pour le **fond** : `oracle-claims` pour les chiffres. **La comparaison dans le temps n'a aucun juge** — voir ci-dessus.

## Boucle de retour

Le document produit porte `gabarit: gd-suivi-benefices` et sa version, **visiblement**, en tête de page. Un
retour sur la **forme** se remet au pilot ; un retour sur le **fond** — quel champ est dû, quel
régime de preuve s'applique — se remet à `pilote-de-mission`.
