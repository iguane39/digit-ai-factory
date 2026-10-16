# Retours forges — Produit-02.com — 20260826g

- **Contexte** : une vérification de production est passée au rouge après une poussée qui ne
  changeait qu'une chaîne de description. L'enquête a montré que le rouge était faux — et
  que le vert l'aurait été tout autant si le déploiement avait réellement échoué.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 71
  (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qu'un faux rouge a révélé

Ce chapitre existe parce que le défaut trouvé n'est pas celui qu'on cherchait.

À 09:52, la vérification de production a rendu **« la bannière s'affiche » en ÉCHEC**. Le
commit incriminé ne changeait qu'une chaîne de description : il ne pouvait pas casser un
bandeau de consentement. Le rejeu à 09:54, **sans un octet de différence**, est passé au
vert. Le rouge était donc faux, et la question devenait : pourquoi le contrôle a-t-il pu
partir avant que la production soit prête ?

Parce que la porte qui devait l'en empêcher ne garde rien. Et le même mécanisme qui produit
un faux rouge produirait un **faux vert** si un déploiement échouait vraiment — ce que ce
workflow existe précisément pour empêcher.

## `digit-ai-factory`

Un retour, sur une porte de fraîcheur qui ne distingue pas l'avant de l'après.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-56 | majeur | produit+générique | **Une porte de fraîcheur de déploiement clôturait sur une valeur qui ne change pas d'un déploiement à l'autre.** `build\ci\verif-prod.mjs` attendait que l'URL publique serve `consent.js?v=<ASSET_V>` avant de lancer ses contrôles navigateur. Mesure : **`ASSET_V` est resté à `0.13.0` sur les six poussées consécutives du 26/08** — la porte reconnaissait donc la version que servait encore **l'ancien conteneur**, écrivait « déploiement en ligne au bout de **1 essai** », et les contrôles partaient pendant le redémarrage. Constat direct le même jour : « la bannière s'affiche » en **ÉCHEC à 09:52**, la même vérification **VERTE au rejeu à 09:54**, code identique — vérifié en production, le balisage du bandeau était bien servi (`consent-accept`, `consent-banner`, `consent-refuse`, `consent-save`) et identique au build local. **Le faux rouge est le symptôme bénin ; le faux vert est le vrai risque** : une porte incapable de distinguer l'avant de l'après valide aussi bien un déploiement qui n'a pas eu lieu. C'est exactement le défaut que ce workflow porte en commentaire comme sa raison d'être — « le 15/08/2026, un `git push` n'a rien déclenché du tout et la production a servi l'ancienne version pendant cinq minutes sans que rien ne le signale ». | Une porte de fraîcheur doit clôturer sur une valeur qui **change par construction à chaque déploiement**. Corrigé ici en comparant l'**empreinte du HTML servi** à celle du HTML du dépôt — test négatif joué avant remise : avec un HTML local volontairement différent, la porte rend ÉCHEC en nommant les deux empreintes, là où la version restait identique et ne disait rien. La classe est générique : **tout jalon de déploiement indexé sur un numéro de version manuel a ce défaut**, puisqu'un numéro manuel ne bouge que quand on y pense. Deux généralisations possibles pour le socle : soit exiger que la valeur de fraîcheur soit **dérivée** (empreinte de contenu, identifiant de commit injecté à la génération), soit interdire qu'un jalon de déploiement s'appuie sur une valeur que le dépôt ne fait pas varier. |

## Ce que ce retour ne couvre pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

Le correctif traite les déploiements qui **changent le HTML servi**, c'est-à-dire la quasi-
totalité et les seuls qui portent un risque de contenu. **Un angle résiduel demeure** : une
poussée qui ne modifie ni le HTML ni les actifs — un changement de CI, par exemple, comme
celui qui porte ce correctif — laisse l'empreinte inchangée. La porte passe alors au premier
essai, légitimement, mais le conteneur redémarre quand même et les contrôles navigateur
peuvent de nouveau courir contre une production en cours de bascule.

Traiter cet angle demanderait autre chose qu'une porte : une **attente de disponibilité**
bornée sur les contrôles eux-mêmes, ou l'injection d'un identifiant de commit dans la sortie
générée. Les deux sont hors du périmètre de ce correctif et **ne sont pas faits** — c'est
dit ici plutôt que découvert au prochain faux rouge.

## Remarques restées au produit

Ce que le produit a corrigé chez lui, chacune avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La porte de fraîcheur interrogeait `/index.html`, qui répond 301 depuis ce matin | Bascule sur l'URL propre `/` | non | **Déjà REMONTÉ en RT-49** — un oracle qui vise une forme d'URL périmée. Ce lot n'ajoute qu'une occurrence de plus, dans un fichier que RT-49 ne citait pas. |
| Sur Windows, le `process.exit(1)` de la porte lève une assertion libuv et rend 127 au lieu de 1 | Non corrigée | non | **Rien de généralisable** — les deux codes sont non nuls, donc rouges en CI, et le contrôle tourne sous Linux. Consigné pour qu'un futur diagnostic local ne s'y arrête pas. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** Ce lot naît d'une
enquête sur un échec de CI ; il ne produit ni ne consomme de livrable. La section est
déclarée vide, elle n'est pas omise.

## Confirmations positives

- **Le workflow porte sa propre raison d'être, et c'est ce qui a permis de le juger.** Le
  commentaire d'en-tête de `verif-prod.mjs` raconte l'incident du 15/08 — « un `git push`
  n'a rien déclenché du tout » — et énonce la promesse : *la version attendue est LUE dans
  le dépôt, jamais saisie à la main*. La promesse était tenue à la lettre et manquée dans
  l'esprit : la version était bien lue dans le dépôt, mais elle n'y variait pas. Sans ce
  commentaire, l'écart entre l'intention et le mécanisme serait resté invisible.
- **L'échec a été bruyant, et c'est ce qu'on lui demande.** Un contrôle qui rend un faux
  rouge se fait enquêter ; un contrôle qui rend un faux vert ne se fait jamais lire. Le
  défaut a été trouvé parce que la mauvaise moitié du mécanisme s'est manifestée.
- **La séparation des deux workflows a tenu.** `Contrôles` et `Vérification de la
  production` sont restés indépendants pendant l'enquête : le premier est resté vert sur les
  six poussées, ce qui a immédiatement écarté l'hypothèse d'une régression du site.

## Ordre recommandé

1. **RT-56** — seul retour du lot. Il est peu coûteux à généraliser et il touche la dernière
   barrière avant la production : un jalon de déploiement qui ne sait pas dire si le
   déploiement a eu lieu est une barrière peinte sur le mur.
