# Gabarit — Retour d'expérience de fin de mission

**Famille** `gd-rex-de-fin` · **Version du gabarit** 1.0.0 · **Écrite le** 15/09/2026

## La règle qui commande toutes les autres

**Cette page ne porte aucun état.** Elle se **dérive** de l'état de mission (`MISSION.md` en
dépôt, fichier mémoire d'espace en conversation), qui reste la source de vérité unique. Un
artefact de cadence est une **vue d'assemblage datée** : s'il faut y saisir une information qui
n'est pas déjà dans l'état de mission, c'est l'état qu'on complète d'abord. *Un chiffre qui
n'existe que dans un retour d'expérience est un chiffre que la mission ne connaît pas.*

Le bandeau en tête de page le dit **à l'écran**, avec la date du relevé, et non seulement ici :
une vue d'assemblage sans date de source est une source de plus.

## Quand l'employer

Clore une mission en transmettant : ce qu'elle a produit, ce qu'elle n'a pas produit et pourquoi,
les écarts entre le plan et l'exécution, et ce qui reste à faire, par qui. Cadence :
`fin-de-mission` — une fois, et jamais en cours de route.

## D'où la forme est tirée

Du contrat de contenu porté par `pilote-de-mission`, `references/artefacts-de-cadence.md` —
ligne « REX de fin de mission » : *journal des décisions, cycles d'adaptation, écarts entre plan
initial et exécution*, avec un régime de preuve emprunté tel quel au pilot — **blocs obligatoires,
verdict factuel, non-traité motivé, écarts à la lettre, risques, actions par acteur**. La forme de
cette page suit donc les blocs jugés par `oracle-synthese` S1-S8, et la table ci-dessous les
reprend chapitre par chapitre.

*Sur l'objection du skill propriétaire.* `artefacts-de-cadence.md` écrit qu'il ne prescrit aucun
gabarit de mise en forme, au motif qu'« un gabarit de présentation figé aurait été un objet
durable de plus, sans juge ». Deux réponses, et la décision humaine D-10 (a) du 15/09/2026 qui
tranche : cette page **a** deux juges exécutés — `check_html.py` et `render_page.py` du socle — et
elle n'est **pas durable**, puisqu'elle se déclare dérivée et datée à chaque tirage. Le fond reste
chez le skill qui l'a écrit ; la bibliothèque donne la page.

## Structure — les chapitres sont dus

Les six chapitres reprennent les blocs d'une restitution de mandat, dans le même ordre et pour la
même raison : le verdict d'abord, le non-livré juste après le livré — jamais relégué à la fin — et
la transmission en dernier. *Comment lire ce tableau* : une ligne par chapitre, dans l'ordre du
document ; la dernière colonne est la borne, et c'est elle qui empêche le retour d'expérience de
devenir un plaidoyer.

| # | Chapitre | Ce qu'il porte | Ce qu'il ne porte pas |
|---|---|---|---|
| 1 | **Le verdict** | Ce que la mission a produit, en une phrase factuelle, ses dates, et le périmètre livré rapporté à l'annoncé | Ni preuve ni motif |
| 2 | **Ce qui a été livré** | Une ligne par livrable **accepté**, avec sa preuve exécutée et sa date d'acceptation | Aucun livrable non accepté |
| 3 | **Ce qui n'a pas été fait** | Le périmètre annoncé et non livré, son motif, ce qu'il en coûte, et qui le reprend | Aucun livrable partiel : un livrable partiel est un livrable non accepté |
| 4 | **Les écarts** | Ce qui était prévu, ce qui s'est passé, le fait qui l'explique, et la règle transposable | Aucune appréciation sur les personnes |
| 5 | **Les risques résiduels** | Ce qui reste ouvert **après** la mission, son signal, sa parade, et le rôle qui la porte désormais | Aucun risque refermé pendant la mission |
| 6 | **Les actions par acteur** | Le geste restant, son acteur, son échéance | Les parades des risques : elles vivent dans la ligne du risque |

## Les vocabulaires fermés

- **Motif** d'un non-livré : `hors mandat` · `accès` · `décision non rendue` · `dépendance externe`
  · `arbitrage de périmètre`.
- **Acteur** d'une action restante : `commanditaire` · `exploitant` · `prestataire`.
- **Preuve** : une sortie **exécutée** ou un chemin vérifiable. « Préparé », « prêt » et « en
  cours » ne sont pas des preuves.

## Ce que ce gabarit refuse

- **Un non-livré relégué en annexe.** Il a le chapitre qui suit immédiatement le livré. Une
  mission dont le non-livré n'est pas écrit se referme sur un malentendu.
- **Un écart sans règle transposable.** C'est une anecdote. Et une règle sans l'écart qui l'a
  produite est un conseil que personne ne suit : la table demande les deux, sur la même ligne.
- **Une action sans acteur nommé.** Elle reste au prestataire qui s'en va, c'est-à-dire à personne.
- **Un risque résiduel passé sous silence.** Il ne disparaît pas : il change de propriétaire sans
  que le nouveau propriétaire le sache.

## Ce que ce gabarit ne juge pas

**Que le verdict soit juste.** `oracle-synthese` tient la forme opposable — des blocs présents, un
motif par non-traité, un acteur par action — jamais le fond. Un verdict flatteur sur une mission
manquée passe la forme. Le contrepoids n'est pas mécanique : c'est la colonne « preuve » du
chapitre 2, qui rend le mensonge coûteux sans le rendre impossible.

## Oracles

- `check_html.py` du socle `digit-ai-page-html` — charte, accessibilité, lisibilité L1-L32 ;
- `render_page.py` du même socle — zéro défaut visuel aux six largeurs, dont **V18** (mesure de
  lecture), **V19** (une seule largeur de contenu) et **V16** (états discernables entre eux) ;
- `oracle-gabarits-documents.mjs` du pilot — G1 à G5 ;
- pour le **fond** : `oracle-synthese` **S1-S8** du pilot, applicables tels quels — S4 (choix fermé) y vaut « aucune », déjà géré.

## Boucle de retour

Le document produit porte `gabarit: gd-rex-de-fin` et sa version, **visiblement**, en tête de page. Un
retour sur la **forme** se remet au pilot ; un retour sur le **fond** — quel champ est dû, quel
régime de preuve s'applique — se remet à `pilote-de-mission`.
