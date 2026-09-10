# Synthèse de mandat — l'histoire publiée du pilot est réécrite, republiée, et ne porte plus aucun nom de client ni de produit (09/09/2026)

Vos deux décisions sont exécutées. Le terme de trois lettres sur lequel un doute pesait a été qualifié : c'est un nom réel, celui d'un site public français, et aucune de ses six cent trente-six occurrences n'était un hasard de lettres — le doute est levé, pas contourné. L'histoire entière du dépôt public a donc été réécrite avec la portée que vous avez arbitrée, tous les termes des tables et pas seulement ceux qui mordaient, puis republiée. Ce qui a changé pour vous : le dépôt ouvert à tous ne porte plus aucun nom de client ni de produit, ni dans les contenus, ni dans les noms de fichiers, ni dans les messages de commit, et c'est vérifié terme par terme contre l'hébergeur. Ce qui reste attendu de vous : deux arbitrages sans urgence, l'un sur deux dépôts frères qui portent peut-être le même passif, l'autre sur le moment de reconstruire les copies locales — car ce poste et l'autre travaillent encore sur l'ancienne histoire, et une autre session est en train d'écrire ici.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-32 (b) et D-30 (a) : qualification du terme douteux, puis cinquième réécriture d'historique du parc, avec publication forcée.
- **sur quoi** — le dépôt publié `digit-ai-factory`, ses 641 commits et ses 43 références ; le générateur des règles de réécriture ; le registre du pilot.
- **quand** — 2026-09-09 15:55 UTC+02:00 (Europe/Paris), durée ≈ 1 h 20, relevée à l'horloge (14 h 35 → 15 h 55) et non estimée.
- **qui** — pilot digit-ai-factory b161170 (local, sur l'ancienne histoire) ; `scripts\generer-remplacements-historique.mjs`, `oracle-nom-client-publie`, `git filter-repo`, `todo\oracle-todo.mjs`.

## 2. Verdict en une ligne

**Porte de publication sur l'histoire réécrite : 939 constats → PASS, mesuré plafond d'affichage levé ; vérification indépendante sur les objets de l'origine après publication — 14 termes cherchés, 0 occurrence en contenu, 0 en nom de fichier, 0 en message de commit ; 641 commits et 43 références conservés, `git fsck` propre, 67 chemins binaires comparés entre l'ancienne et la nouvelle histoire et aucun modifié ; `origin/main` 5968e28 → c96a32f, dépôt toujours PUBLIC ; générateur des règles corrigé de 2 défauts dont 1 présent depuis son origine, et doté du banc qu'il n'avait pas — 11 PASS dont 2 cas négatifs ; sauvegarde complète vérifiée par `git bundle verify` avant le geste, plus deux patches ; registre 166 clos, 27 décidés, 12 en cours, 17 candidats, 57 classes, `oracle-todo` PASS ; et le juge des restitutions corrigé d'un plafond à deux chiffres qui rendait indésignable toute action au-delà de la centième — recette des oracles rejouée ICI, **103/103 vertes**.**

## 3. Décisions attendues de l'humain

Deux décisions attendent, aucune urgente : le dépôt public est propre.

> **D-33 — Deux dépôts frères portent peut-être le même passif dans leur histoire : leur applique-t-on la même passe, ou attend-on une mesure avant de décider ?**
>
> Le sondage rapide fait après la publication montre que les treize dépôts frères sont propres à leur tête, mais que deux d'entre eux — la forge des outils et la forge du design — ont respectivement un et trois commits qui touchent le terme de trois lettres dans leur passé. Ce chiffre vient d'une recherche large qui remonte aussi des correspondances fortuites dans des images ; il ne prouve donc pas un passif, il signale seulement qu'il faut regarder. Une mesure propre coûte une exécution de la porte par dépôt, soit quelques minutes chacune.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md`, paragraphe « Réécrire l'historique d'un dépôt », qui impose que la mesure décidant une réécriture se fasse sur un clone à branche unique de ce qui est publié — la troisième passe avait failli réécrire pour quatre-vingt-neuf constats qui vivaient dans une branche locale jamais poussée. Motif du choix : réécrire sans mesure reproduirait exactement cette erreur, et mesurer ne coûte presque rien.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Mesurer d'abord les deux dépôts, puis décider sur le chiffre réel | Simple × court : deux exécutions de la porte sur des clones frais | Rien : c'est le préalable de (b) |
| (b) Réécrire les deux dépôts tout de suite, sans mesure préalable | Moyen × moyen, et deux reconstructions de clones sur les deux postes, peut-être pour rien | La possibilité de constater que le passif est nul et qu'il n'y avait rien à faire |
| (c) Ne rien faire : ces deux dépôts restent en l'état | Nul aujourd'hui | La garantie que le parc entier est propre, alors que le pilot vient de l'obtenir |

> **Si rien n'est décidé** : (c) s'applique de fait — les deux dépôts gardent leur passé, et la question se reposera à la prochaine extension des tables.

> **D-34 — Les copies locales des deux postes travaillent encore sur l'ancienne histoire, et une session écrit en ce moment dans celle de ce poste : quand la reconstruit-on ?**
>
> Une réécriture rend toute copie locale incompatible : elle se reconstruit, elle ne se fusionne pas. L'outil qui le fait refuse un arbre de travail sale, et celui de ce poste porte vingt-huit fichiers modifiés non enregistrés qui appartiennent à une autre session, toujours active. Les reconstruire de force ferait perdre ce travail. Rien ne presse : tant que la reconstruction n'a pas eu lieu, aucune publication n'est possible depuis ces copies, ce qui est une protection et non une panne.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md`, qui prescrit `bootstrap.mjs --rebatir` et précise que l'outil sauvegarde, exporte le delta propre au poste en patches et les rejoue — et le garde-fou du projet qui réserve à l'humain tout geste destructeur (R-29). Motif : l'ordre « la session finit, puis on reconstruit » est le seul qui ne perde rien, et il ne coûte qu'une attente.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Laisser l'autre session finir et enregistrer son travail, puis reconstruire les deux postes par l'outil | Une attente, puis simple × court par poste | Rien |
| (b) Reconstruire ce poste maintenant, en enregistrant d'abord le travail en cours à sa place | Simple × court, mais on enregistre le travail d'autrui sans savoir s'il est fini | La possibilité pour cette session de finir proprement ce qu'elle a commencé |
| (c) Reconstruire sans rien enregistrer | Très court, et le travail non enregistré est perdu | Tout : c'est la seule option irréversible du tableau |

> **Si rien n'est décidé** : (a) s'applique de fait, mais sans échéance — les deux postes restent bloqués en publication, et l'écart entre eux et l'origine grandit à chaque commit local.

## 4. Traité — avec sa preuve

- **D-30 (a) — le terme de trois lettres est qualifié, et le doute est levé par lecture et non par jugement.** Contrôle : toutes les occurrences distinctes du terme relevées dans l'histoire entière, puis lues en contexte ; classe : une décision lourde prise sur un faux positif supposé.
  - preuve : le terme apparaît comme le nom d'un site public français dont l'histoire discute l'obligation légale d'accessibilité, la pile technique et le budget d'audit ; il est inscrit au canal comme produit, avec son pseudonyme ; **aucun emploi homographe n'existe** — les 636 constats sont tous authentiques, et l'affaire n'était donc pas divisible par deux comme la veille l'espérait.
- **D-32 (b) — l'histoire publiée est réécrite et republiée, avec la portée que vous avez arbitrée.** Contrôle rouge → vert : porte de publication 939 constats → **PASS**, mesurée sur un clone du dépôt réécrit, plafond d'affichage levé.
  - preuve : `origin/main` passe de 5968e28 à c96a32f ; 641 commits et 43 références **conservés** (aucun perdu) ; `git fsck` sans anomalie ; et la vérification faite **après** publication, sur les objets rapatriés depuis l'hébergeur : 14 termes cherchés un par un, **0 occurrence** dans les contenus de toute l'histoire, **0** nom de fichier, **0** message de commit.
- **Aucun fichier binaire n'a été touché, et c'est mesuré et non espéré.** Contrôle : les ensembles de versions binaires de chaque chemin comparés entre l'histoire d'avant et celle d'après ; classe : une substitution d'octets qui corrompt une image en silence.
  - preuve : 67 chemins binaires vus dans l'histoire, **0 dont l'ensemble des versions diffère**. Le risque était réel : le terme de trois lettres se trouve par hasard d'octets dans des images de ce dépôt, ce qu'une recherche large remontait la veille.
- **Le générateur des règles de réécriture est corrigé de deux défauts, et doté du banc qu'il n'avait pas.** Contrôle rouge → vert : banc neuf, **11 PASS**, dont les deux cas qui sont ROUGES contre la version d'avant ; classe : `controle-sans-fixture-double-sens`.
  - preuve : premier défaut — la variante de graphie manquait aux NOMS DE FICHIERS, ce qui a laissé exactement **un** constat sur 939 (« Produit-11 » dans un nom de rapport contre la clé « Produit-11 ») ; second défaut, **présent depuis l'origine du script** — la substitution des noms était littérale, sans frontière de mot, donc `Zorgon.mjs` devenait `Produit-92on.mjs` dès qu'une clé « Zorg » existait, et la vraie table porte des clés de trois lettres. **C'est un cas NÉGATIF du banc qui a trouvé le second** ; aucun cas positif ne pouvait le voir, et cinq réécritures s'étaient jouées sans que personne le sache.
- **La sauvegarde précède le geste, et elle est vérifiée.** Contrôle : `git bundle verify` → « The bundle records a complete history ».
  - preuve : `c:\dev\_sauvegarde-avant-reecriture-20260909\` — paquet complet de 98 Mo vérifié, plus le patch de mon commit local et le patch des vingt-huit fichiers modifiés non enregistrés de l'autre session, exportés avant toute action.
- **Deux défauts sont versés au registre, dont un observé sur mon propre commit.** Contrôle : `oracle-todo` PASS après écriture ; 57 classes.
  - preuve : TF-1004 (le générateur sans banc, et son banc désormais rattaché à aucun cliquet) ; et une mise à jour de TF-0993 qui le documente **en conditions réelles** — le hook de pré-commit a annoncé « pseudonymisé, 2 termes » sur un fichier où une troisième occurrence est restée en place, collée à des soulignés, sans que rien ne le dise ; la même occurrence vivait dans le message de commit, qu'aucun hook ne couvre, et seule une relecture l'a vue.
- **Le juge des restitutions ne pouvait plus désigner une action au-delà de la centième.** Contrôle rouge → vert : la règle des sélecteurs déclarait « 4 actions sur 5 SANS SÉLECTEUR » sur cette synthèse → PASS ; classe : une règle dont le motif contredit la doctrine que le même fichier énonce.
  - preuve : le motif de lecture d'un sélecteur plafonnait à deux chiffres alors que le référentiel interdit de remettre la numérotation à zéro ; six emplacements corrigés, et la recette complète des oracles rejouée ICI rend **103/103 recettes vertes**, ce qui vaut aussi contrôle de non-régression sur les modifications en cours de l'autre session dans ce même fichier.
- **L'autre session travaillant sur ce dépôt est prévenue, et elle a répondu.** Contrôle rouge → vert : deux écrivains sans protocole → échange établi dans les deux sens, avec l'empreinte d'avant et d'après, l'interdiction de pousser en force et l'emplacement des sauvegardes ; classe : deux écrivains dans le même dépôt, chacun ignorant ce que l'autre modifie.
  - preuve : elle confirme écrire dans l'arbre — vingt-huit fichiers qui sont son travail en cours et non des restes — et elle remonte deux mesures qui me concernent. **Un faux positif de la porte sur mon propre commit** : un exemple entre guillemets, dans le commentaire qui documente précisément ce piège, où la porte lit un sigle interdit sans frontière de mot — et le constat est localisé à une ligne qui n'est pas celle du terme, ce qui est plus coûteux que le faux positif lui-même puisqu'il envoie corriger un texte innocent. **Et un canal fermé par la réécriture** : le préflight d'ingestion compte des COMMITS pour protéger un invariant qui est un MAXIMUM D'IDENTIFIANT, donc sur une histoire réécrite il refuse pour toujours, et sa seule issue oblige à déclarer un hors-ligne faux. Les deux sont journalisés par elle sous **TF-1002** (le faux positif et sa localisation fausse, cible la forge des outils) et **TF-1003** (le préflight, cible le pilot) ; classe commune : un contrôle dont la mesure ne dit pas ce que son lecteur croit.

## 5. Non traité — avec son motif

- **La reconstruction des copies locales des deux postes** : c'est la décision D-34 — motif : garde-fou, l'outil refuse un arbre sale et celui-ci porte le travail non enregistré d'une session active.
- **Le passif éventuel des deux dépôts frères** : c'est la décision D-33 — motif : dépendance à une décision humaine, et une mesure préalable est prescrite par le mode opératoire.
- **Le rattachement du banc neuf à un cliquet** : journalisé en TF-1004, non fait — motif : une candidature se décide avant d'être corrigée, et celle-ci vient de naître.
- **Le faux positif de la porte sur mon commit** : non corrigé — motif : hors mandat au sens strict, la porte vit chez une forge sœur ; et il ne FAUT pas corriger le commentaire incriminé, qui est juste — c'est la porte qui doit apprendre à lire une frontière de mot, ce que la fonction écrite ce matin lui fournit déjà toute faite.
- **L'enregistrement de mes écritures au registre** : non fait — motif : dépendance externe, l'arbre appartient à une autre session encore active ; mes deux événements sont ajoutés au registre, qui est en ajout seul, et attendent qu'un enregistrement soit possible.

## 6. Écarts à la lettre

- **Vous avez décidé « 32b, 30a » → j'ai d'abord fait 30a, puis vous ai demandé la portée de 32b avant de l'exécuter** → pourquoi : la qualification a changé l'ampleur du geste, et D-30 (a) réservait explicitement cet arbitrage — réécrire pour un seul des deux noms réels aurait imposé une seconde passe et une seconde reconstruction des clones.
- **J'ai écrit une table de substitution maison alors que l'outil existait** → j'ai jeté ma copie et repris `scripts\generer-remplacements-historique.mjs` → pourquoi c'est une faute et pas un détour : c'est la classe `oracle-remplace-par-controle-maison` que ce projet documente, ma copie ignorait les leçons de quatre passes antérieures, et je ne l'ai découvert qu'en lisant un commentaire de la porte qui citait l'outil. Le mode opératoire l'imposait, dans un document que je n'avais pas ouvert avant d'agir.
- **J'ai absorbé cinq fichiers d'une autre session dans mon commit** → je l'ai défait par un `reset` et n'ai réenregistré que mes deux fichiers → pourquoi : ils étaient arrivés par un `git add` trop large, et les publier sous mon message aurait attribué à mon geste un travail qui n'est pas le mien.
- **J'ai laissé un nom de client dans mon propre message de commit** → repris en une passe, l'exemple remplacé par un libellé neutre → pourquoi : le hook ne juge que l'index, jamais le message, et j'ai écrit ce message en connaissant ce trou puisque je venais de le journaliser.

## 7. Risques

- **Une republication de l'ancienne histoire par l'autre poste ou l'autre session** : signal = un `git push --force` depuis une copie non reconstruite ; parade = les deux sont prévenus, la reconstruction passe par l'outil, et la porte refuserait le push — mais un `--no-verify` la contournerait, ce qui rend la décision D-34 utile.
- **Un contenu public déjà copié avant le geste** : signal = le nom réapparaît dans un cache tiers ou un fork ; acceptation déclarée — le dépôt a été public avec ces noms, et retirer un contenu public ne le rappelle pas ; le geste supprime l'exposition présente et future, pas le passé de la copie.
- **Un banc neuf que rien n'exécute** : signal = une modification du générateur qui ne fait rougir personne ; parade = TF-1004, qui demande son rattachement à un cliquet ; sans quoi il retombera à l'état d'absence de banc en quelques semaines.
- **Deux écrivains dans le même fichier** : signal = j'ai édité le juge des restitutions que l'autre session modifiait au même moment ; parade = édition en place et non remplacement, ses changements sont intacts, la recette complète rejouée après rend 103/103, et je le lui ai dit avec les six lignes touchées.
- **Un remède de contrôle plus dangereux que son défaut** : signal = un préflight qui, pour se débloquer, prescrit le geste que le mode opératoire de réécriture interdit ; parade = l'autre session a vérifié l'invariant réel des deux côtés avant de passer outre, plutôt que d'obéir ; l'item est journalisé.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-100 | Mesurer le passif réel des deux dépôts frères signalés, sur clones frais à branche unique | `neuve` | auto_ia | `dependance_bloc_3` — décision D-33 | `git clone --single-branch` puis `oracle-nom-client-publie .` avec les deux tables désignées par variables d'environnement | le parc reste sans mesure là où le pilot vient d'être assaini |
| A-101 | Rattacher le banc du générateur à un cliquet du pilot, pour qu'une régression le fasse rougir | TF-1004 | auto_ia | `gate_gouvernance` — la candidature vient de naître et n'est pas décidée | ajouter son exécution à la recette du pilot, puis la rejouer ici | un banc que rien n'exécute retombe à l'état d'absence de banc |
| A-102 | Reconstruire la copie locale de ce poste sur la nouvelle histoire, puis rejouer mon commit en attente | `neuve` | auto_ia | `dependance_bloc_3` — décision D-34, et l'outil refuse un arbre sale | `node bootstrap.mjs --rebatir c:\dev\digit-ai-factory` (essai par `--essai`), puis `git am` du patch conservé | ce poste ne peut plus rien publier, et l'écart avec l'origine grandit |
| A-103 | Restituer le champ des occurrences qui ont RÉSISTÉ à la substitution, et couvrir le message de commit | TF-0993 | auto_ia | `gate_gouvernance` — candidature non décidée, et le changement touche un contrat partagé entre deux dépôts | `passer()` rend `refuses` à côté de `corriges`, et le hook l'affiche en avertissant | un commit annoncé pseudonymisé peut porter un nom réel, comme celui de ce tour |
| A-67 | Sur l'autre poste, à sa prochaine ouverture : reconstruire ses clones, dont celui du pilot désormais réécrit | TF-0829 | manuelle_dev | `presence` : commandes à jouer sur l'autre machine — `git -C ../digit-ai-forge-development rev-list --count HEAD..@{u}` rend 0 ici, il ne mesure que ce poste | `node bootstrap.mjs --pull` puis `node bootstrap.mjs --rebatir <dépôt>` | l'autre poste travaillera sur une histoire incompatible et pourrait republier les noms |

Ordre : **A-100 en premier, parce qu'elle est la seule qui informe une décision ouverte et qu'elle ne coûte qu'une mesure** ; A-101 ensuite, parce qu'elle protège le geste qui vient d'être fait ; A-102 dès que l'autre session a enregistré son travail ; A-103 quand la candidature est décidée ; A-67 à l'ouverture de l'autre poste.

## 9. Traces

- Dépôt public — `https://github.com/iguane39/digit-ai-factory`, `origin/main` 5968e28 → **c96a32f**, visibilité PUBLIC, 641 commits, 43 références.
- Sauvegardes — `c:\dev\_sauvegarde-avant-reecriture-20260909\` : paquet complet vérifié, patch de mon commit local, patch des vingt-huit fichiers non enregistrés de l'autre session.
- Pilot local — `scripts\generer-remplacements-historique.mjs` (corrigé) et `scripts\generer-remplacements-historique.test.mjs` (neuf, 11 cas), commit b161170 sur l'ancienne histoire, à rejouer après reconstruction ; `todo\TODO.jsonl` (166 clos, 27 décidés, 12 en cours, 17 candidats), `todo\CLASSES.json` (57 classes).
- Mesures — porte sur le clone réécrit : PASS ; porte sur l'histoire d'avant, plafond levé : 939 constats ; comparaison des binaires : 67 chemins, 0 modifié ; vérification post-publication sur les objets de l'origine : 14 termes, 0 occurrence.
