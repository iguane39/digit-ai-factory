# Pourquoi faut-il réécrire l'histoire à chaque fois, et comment cesser

**Étude courte — pilot digit-ai-factory — 08/09/2026**
**Question posée** : pourquoi doit-on réécrire l'histoire à chaque fois ? Qu'est-ce qui provoque cela ? Comment le prévenir ou l'anticiper ? Comment l'automatiser pour qu'il n'y ait ni demande manuelle ni impact sur les développements en cours ?

## Ce que ce document apprend

Que la réécriture d'histoire n'est pas la rançon d'une erreur humaine répétée, mais la conséquence mécanique de quatre choix de conception, tous mesurables et tous corrigibles. Et que le parc a **déjà inventé deux fois** le mécanisme qui l'éteindrait, sans l'appliquer là où il compte.

## Ce que ce document contient

Le fait chiffré, les quatre causes mesurées une par une, le remède propre à chacune, puis l'architecture cible et ce qu'elle change pour le cas du jour. Les quatre causes sont indépendantes : chacune suffit à provoquer une réécriture, et corriger l'une n'éteint pas les autres.

---

## 1. Le fait

Vingt mentions de réécriture d'histoire dans l'historique du seul dépôt du pilot. Trois épisodes en douze jours : le 27/08 (dix dépôts, 115 fichiers, 648 occurrences), le 06/09, le 07/09. Un quatrième est posé en décision aujourd'hui.

Ce n'est pas un accident qui se répète. C'est un régime permanent.

## 2. Les quatre causes, mesurées

### Cause 1 — La barrière est au push, donc toujours après le commit

Mesure : le dépôt du pilot porte **un seul hook, `pre-push`**. Aucun `pre-commit`.

Conséquence mécanique : quand la porte parle, le nom est déjà dans un objet git. Le corriger ne peut plus se faire par une édition — il faut modifier un commit existant. Que ce soit un `--amend` local ou une réécriture complète, c'est la même opération, seule l'ampleur diffère.

**La porte ne peut pas empêcher ce qu'elle constate. Elle arrive après.**

### Cause 2 — Le lot sale arrive dans un répertoire versionné

Mesure : `input/00-retours/` est **suivi par git**, 394 fichiers. Les lots de retours y sont déposés tels qu'ils arrivent, nom de fichier compris.

Aujourd'hui, six lots sont arrivés portant un nom réel dans leur nom de fichier. Chacun a passé un temps non nul dans un répertoire versionné avant que la pseudonymisation ne soit jouée. Un `git add -A` dans cette fenêtre — et c'est le geste normal — embarque le nom. C'est arrivé, et il a fallu un `--amend` avant publication.

**Il existe une fenêtre où le fichier sale est indexable. Sa durée dépend de l'attention de qui travaille.**

### Cause 3 — La table s'étend, et rend le passé fautif rétroactivement

C'est la cause du jour, et la plus contre-intuitive.

Mesure : les deux tables portent **une seule date globale**, `date_derniere_extension`. Aucune entrée ne porte sa propre date d'entrée.

Ce qui s'est passé aujourd'hui : les deux cents occurrences relevées dans l'histoire **n'ont pas bougé d'un octet**. Ce qui a changé, c'est la table (64 → 65 clés) et l'angle de la porte. Du contenu écrit, commité et publié en toute conformité est devenu fautif sans que personne n'y touche.

Tant qu'une table s'étend à la découverte — et elle le doit, c'est sa raison d'être — **chaque extension crée mécaniquement un passif dans l'histoire**. La réécriture n'est alors pas la réparation d'une faute : c'est le prix payé pour avoir appris quelque chose.

### Cause 4 — Les vues générées amplifient chaque occurrence

Mesure : les trois vues dérivées du registre sont versionnées, et totalisent **1 173 révisions** — 395 pour la source, 399 et 379 pour deux vues qui la recopient.

Effet mesuré aujourd'hui : une occurrence présente dans le registre apparaît dans **25 révisions** de chacune des deux vues, soit 75 occurrences dans l'histoire pour un seul nom écrit une seule fois. Sur les 194 occurrences historiques, 75 viennent de cette amplification.

**Un contenu dérivé versionné multiplie par le nombre de régénérations le coût de toute erreur dans sa source.**

---

## 3. Les remèdes, un par cause

### Remède 1 — Déplacer la barrière, et la faire corriger au lieu de refuser

Un `pre-commit` qui juge **l'index seulement** — les fichiers du commit en cours, pas l'histoire. Le coût s'effondre : quelques fichiers au lieu de 909 révisions, donc quelques millisecondes au lieu de trois à cinq minutes.

Et surtout : il **pseudonymise et ré-indexe** au lieu de refuser. L'outil existe déjà et sait le faire sur une liste de fichiers nommés. Le développeur ne voit rien, ne décide rien, n'est jamais interrompu. Le fichier entre propre.

Un refus aurait été le mauvais geste : un contrôle bloquant qu'on rencontre dix fois par jour finit contourné. Un contrôle qui corrige silencieusement ne se contourne pas, parce qu'il n'y a rien à contourner.

Le `pre-push` garde son rôle de dernière barrière, mais devient l'exception plutôt que le mécanisme de détection principal.

### Remède 2 — Le sale n'entre jamais dans l'index

Le répertoire d'arrivée devient ignoré par git. L'ingestion pseudonymise le lot, **puis** le dépose dans le répertoire suivi. Il n'existe aucun instant où un fichier porteur d'un nom réel est indexable.

La fenêtre ne se réduit pas : elle disparaît.

### Remède 3 — Dater chaque entrée de table, et borner la porte à cette date

C'est le remède central, et le parc l'a déjà inventé deux fois :

- l'oracle du registre déclare que « les événements antérieurs au 2026-08-20 ne sont pas jugés — antériorité mesurée » ;
- la règle T8 du juge des lots, écrite ce matin, se borne à sa date d'entrée en vigueur, avec ce motif : *un lot déposé ne se modifie jamais, et un juge qui condamne ce qu'aucun geste licite ne peut réparer finit par se lire comme du bruit.*

Le même raisonnement vaut mot pour mot pour les tables. Chaque entrée porte sa date d'inscription. La porte ne juge l'histoire d'un terme qu'**à partir de cette date**. Avant elle, c'est une antériorité déclarée — pas une faute, pas un silence, une ligne écrite dans le rapport.

Effet : une extension de table cesse de créer un passif. Elle protège l'avenir, elle ne condamne plus le passé.

### Remède 4 — Ne pas versionner ce qui se régénère

Les vues sont dérivées : elles se reconstruisent de la source en une commande. Les sortir du suivi supprime les deux tiers de l'amplification.

Cela demande un arbitrage — elles sont publiées pour être lues. Trois voies : les publier ailleurs que dans l'histoire du dépôt, les régénérer à la lecture, ou accepter le coût en le sachant. C'est le seul des quatre remèdes qui appelle une décision plutôt qu'une correction.

---

## 4. L'architecture cible

Quatre barrières, chacune à sa place, du plus tôt au plus tard :

| Quand | Quoi | Coût | Ce qu'elle empêche |
|---|---|---|---|
| À l'arrivée du lot | le répertoire d'arrivée est ignoré ; l'ingestion pseudonymise puis dépose | nul | qu'un fichier sale soit seulement indexable |
| Au commit | `pre-commit` sur l'index, qui **corrige et ré-indexe** | quelques millisecondes | qu'un nom entre dans un objet git |
| Au push | `pre-push` sur l'arbre, les messages, et l'histoire **bornée par la date de chaque terme** | trois minutes, et l'allègement du jour le ramène à deux | qu'un nom parte chez l'hébergeur |
| En veille | un contrôle non bloquant qui balaie l'histoire entière et **produit une candidature**, jamais un refus | hors chemin critique | qu'un passif s'installe sans que personne le sache |

Ce que cette architecture change : la réécriture d'histoire redevient ce qu'elle devrait être — **l'exception, pour un vrai oubli**, décidée à froid sur un dépôt au repos. Elle cesse d'être la conséquence normale d'avoir appris un nom de plus.

## 5. Ce que cela change pour le cas du jour

Avec la table datée, les 194 occurrences historiques sont **antérieures à l'inscription des termes qui les révèlent**. Elles deviennent des antériorités déclarées, nommées dans le rapport de la porte, et la porte repasse au vert sans qu'une ligne d'histoire soit réécrite.

L'option qui ressemblait à un assouplissement arbitraire — « déclarer ces occurrences hors périmètre » — devient une règle motivée, datée et opposable, identique à celle que le registre et le juge des lots appliquent déjà.

## 6. Ce que cette étude ne dit pas

- **Elle ne dit pas si les trois noms en cause sont réellement confidentiels.** Un terme de trois lettres en majuscules, versé sans forme bornée, peut être un acronyme homographe. La question reste ouverte et une lecture la tranche.
- **Elle ne chiffre pas le coût de mise en œuvre.** Les remèdes 1 à 3 sont bornés à trois fichiers et une structure de données ; le remède 4 touche à ce qui est publié, donc à un arbitrage.
- **Elle ne juge pas les épisodes passés.** Les trois réécritures de ce mois-ci ont été rendues nécessaires par l'état du système à ce moment-là ; elles n'auraient pas été évitées par une attention plus soutenue.
