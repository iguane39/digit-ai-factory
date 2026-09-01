# Retours forges — Produit-02.com — 20260826i

- **Contexte** : une poussée de correctif, ce jour à 11:47 UTC. La porte de fraîcheur de
  déploiement — **corrigée la veille au même endroit, par le lot 20260826g** — a de nouveau
  validé au premier essai un déploiement qui n'avait pas eu lieu. Le défaut a été pris sur le
  fait, par une requête directe sur la production au moment même où la porte disait vert.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 77
  (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Un correctif qui déplace un défaut au lieu de le supprimer

Ce chapitre existe parce que le lot d'hier a corrigé cette porte, et que la porte a rejoué le
même faux vert aujourd'hui.

Hier, la porte clôturait sur `consent.js?v=<ASSET_V>` — un **numéro de version saisi à la
main**, resté à `0.13.0` sur six poussées consécutives. Elle reconnaissait donc la version que
servait encore l'ancien conteneur. Le remède posé était juste dans son principe : clore sur une
valeur qui **change par construction**, en l'occurrence l'empreinte du HTML servi.

Le remède a été appliqué sur **une seule page**, `site/index.html`, et la conclusion a été
étendue aux **203**.

Aujourd'hui, la poussée de 11:47 UTC modifie **70 pages HTML** et **ne touche pas la page
d'accueil**. L'empreinte attendue était donc, à l'octet près, celle que l'ancien conteneur
servait déjà. La porte a écrit « déploiement en ligne au bout de **1 essai** », les contrôles
navigateur sont partis, et le rapport a conclu **PRODUCTION CONFORME** — pendant qu'une requête
directe sur `/reservation`, au même instant, servait encore le formulaire que la poussée venait
de supprimer.

**Une valeur qui ne varie jamais a été remplacée par une valeur qui ne varie que pour un
échantillon.** Le premier défaut était visible : on peut lire un numéro figé. Le second ne l'est
pas : une empreinte *a l'air* dérivée, et c'est ce qui la rend plus dangereuse que ce qu'elle
remplace.

## `digit-ai-factory`

Un retour, sur un jalon de déploiement qui échantillonne ce qu'il devrait totaliser.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-60 | bloquant | produit+générique | **La porte de fraîcheur empreinte UNE page et conclut sur les 203.** `build\ci\verif-prod.mjs` lit `site/index.html`, en calcule l'empreinte, et attend que l'URL publique serve la même. **Mesure prise sur la poussée de ce jour à 11:47 UTC** : 70 pages HTML modifiées, `index.html` **inchangé**, donc empreinte attendue identique à celle que servait encore l'**ancien conteneur**. Sortie de la porte : « déploiement en ligne au bout de **1 essai** », puis les dix contrôles navigateur au vert et **PRODUCTION CONFORME**. **Contre-mesure directe au même instant** : `GET /reservation` servait toujours le formulaire supprimé (`resa-search` présent), `GET /ville-dinan` toujours le surtitre en double. Le déploiement réel a atterri **environ 90 secondes plus tard** — 6 sondages de 15 s avant que `resa-search` disparaisse. **C'est strictement pire que l'angle résiduel déclaré au lot 20260826g**, qui ne prévoyait que le cas d'une poussée *sans* changement de contenu : ici le contenu a changé sur 70 pages, et la porte n'a rien vu. | **Un jalon de fraîcheur doit clore sur une valeur dérivée de TOUT ce qui est déployé, jamais d'un artefact échantillonné.** Deux formes tiennent la propriété : l'empreinte du **manifeste de l'arbre de sortie** — la liste triée des chemins et de leurs hachages, condensée en une valeur — qui change dès qu'un octet bouge n'importe où ; ou un **identifiant de commit injecté à la génération** dans une ressource servie, que la porte compare à celui du dépôt. La première n'exige rien du générateur, la seconde survit aux poussées qui ne changent pas le contenu. La règle générique derrière les deux : **la valeur de fraîcheur doit être une fonction de l'ensemble déployé, et cette propriété doit être énonçable en une phrase** — si on ne sait pas dire « elle change dès que *n'importe quoi* change », le jalon échantillonne. |

## Ce que ce retour ne couvre pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

**Le correctif n'est pas appliqué côté produit.** La porte est laissée telle quelle, avec son
défaut mesuré : corriger un jalon de déploiement engage la dernière barrière avant la
production, et l'arbitrage revient à l'exploitant, qui n'a pas encore été consulté sur ce point.
La classe est déclarée, elle n'est pas refermée.

**Le mécanisme d'attente lui-même n'est pas revu.** Même avec une valeur de fraîcheur correcte,
la porte reste une comparaison ponctuelle : elle dit qu'un artefact attendu est arrivé, pas que
le conteneur a fini de basculer. L'angle déclaré au lot précédent — une attente de disponibilité
bornée sur les contrôles eux-mêmes — reste ouvert et **n'est toujours pas traité**.

**Aucune mesure n'a été prise sur les autres produits du parc.** Ce lot établit le défaut sur ce
produit-ci. Si d'autres produits portent un jalon de déploiement indexé sur un artefact unique,
ils ont la même classe de défaut, et personne ne l'a vérifié.

## Remarques restées au produit

Ce que le produit a corrigé — ou délibérément pas — chez lui, chacune avec son verdict de
généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La vérification de production a rendu **PRODUCTION CONFORME** sur l'ancien conteneur, à 11:47 UTC | **Non corrigée.** Contournée pour ce run : la conformité réelle a été établie autrement, en interrogeant en ligne **les 70 pages modifiées, une par une** — 70 conformes, 0 en défaut — puis en rejouant la vérification une fois le déploiement réellement en place | oui | **Généralisable → remonté en RT-60.** La contre-mesure employée ici *est* la forme dégradée du remède proposé : vérifier ce qui a changé plutôt qu'un échantillon. |
| Le lot d'hier déclarait un angle résiduel — « une poussée qui ne modifie ni le HTML ni les actifs laisse l'empreinte inchangée » — et le cas rencontré aujourd'hui n'est **pas** celui-là | Rien à corriger : c'est une observation sur la **déclaration**, pas sur le code | oui | **Généralisable, et c'est le cœur de RT-60.** Déclarer un angle résiduel ne couvre que l'angle nommé. Ici la déclaration a donné un faux sentiment d'exhaustivité : le cas réel — contenu changé, échantillon inchangé — était plus probable que celui qui avait été prévu, et il n'avait pas été envisagé. |
| Les captures de contrôle du produit sont restées manuelles sur ce run | **Non corrigée** — la pièce technique manquante a toutefois été trouvée : la feuille de style du site rend déjà tous les blocs visibles quand le navigateur annonce préférer les animations réduites, ce qui dispense de simuler un défilement | non | **Déjà REMONTÉ en RT-58** (lot 20260826h). Ce lot n'ajoute que le moyen de le câbler, qui appartient au produit. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** Ce lot naît d'une
mesure prise en production pendant une poussée ; il ne produit ni ne consomme de livrable de la
bibliothèque. La section est **déclarée vide, elle n'est pas omise**.

## Confirmations positives

- **Le défaut a été pris sur le fait, et c'est reproductible.** L'écart n'a pas été déduit d'une
  relecture de code : la porte disait vert, et une requête sur la page corrigée renvoyait
  l'ancien contenu, à la même minute. Un faux vert qui laisse une trace opposable est un faux
  vert qu'on peut corriger.
- **Le commentaire d'en-tête posé hier a servi une seconde fois.** Il énonce en clair la
  propriété recherchée — « une valeur qui change par construction à chaque déploiement » — et
  c'est en la relisant qu'on voit qu'elle n'est pas tenue : l'empreinte change par construction
  quand *la page d'accueil* change, pas quand *le site* change. **Écrire la propriété visée à
  côté du mécanisme est ce qui permet de mesurer l'écart entre les deux.**
- **La séparation des deux workflows a de nouveau tenu.** Les contrôles de dépôt et la
  vérification de production sont restés indépendants, ce qui a permis d'attribuer le faux vert
  à la porte et non à une régression du site.

## Ordre recommandé

1. **RT-60** — seul retour du lot, et il porte la dernière barrière avant la production. Le
   traiter avant toute autre chose sur cette chaîne : tant qu'un jalon de déploiement peut
   valider un déploiement qui n'a pas eu lieu, **tout vert rendu après lui est indéterminé**, y
   compris ceux des contrôles qui, eux, fonctionnent.
