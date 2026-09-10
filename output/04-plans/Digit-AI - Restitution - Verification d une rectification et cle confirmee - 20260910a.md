---
destinataire: humain
---

# Restitution — la clé que la session voisine déclarait inexistante existe, et la réécriture d'hier était bien fondée (10/09/2026)

Une session voisine m'a annoncé qu'elle s'était trompée hier, et qu'un terme de trois lettres que j'avais retiré de toute l'histoire publiée ne figurait en réalité dans aucune table. Si c'était vrai, la réécriture d'hier aurait dépassé ce que vous aviez autorisé. J'ai vérifié avant de la croire : la clé existe bel et bien, la table n'a pas bougé depuis avant-hier soir, et deux sources indépendantes le confirment. Ce qui change pour vous : rien à défaire, le geste d'hier reste fondé et le dépôt public reste propre — mais une correction fausse était en train d'entrer dans le registre, et elle aurait conduit un lecteur à réintroduire ce nom. Ce qui reste attendu de vous : un seul arbitrage, celui d'hier sur deux dépôts frères, toujours ouvert.

## 1. En-tête d'identification

- **quoi** — vérification d'une rectification remontée par une session voisine, portant sur la portée de la réécriture d'historique exécutée la veille.
- **sur quoi** — la table des pseudonymes du canal confidentiel, et le dépôt publié du pilot déjà réécrit.
- **quand** — 2026-09-10 UTC+02:00 (Europe/Paris), durée courte, lecture seule ; aucune écriture, le dépôt étant tenu par la reconstruction en cours de la session voisine.
- **qui** — pilot digit-ai-factory, lecture directe de la table du canal et de l'historique du canal.

## 2. Verdict en une ligne

**La clé nue est PRÉSENTE dans la table canonique — `produits['Produit-09'] = 'Produit-09'` — et cinq clés la contiennent au lieu des trois annoncées ; la table n'a pas changé depuis le commit `7a070e0` du 08/09 à 19 h 13, donc elle était dans cet état pendant toute la réécriture ; deux sources indépendantes le confirment — la porte avait rendu 636 constats sur ce terme, et l'outil officiel de génération des règles avait émis la paire correspondante ; la rectification annoncée est donc fausse sur son point central, sa conclusion sur le faux positif reste juste mais pour une autre cause, et rien n'est à défaire de la réécriture publiée hier.**

## 3. Décisions attendues de l'humain

Une seule décision reste ouverte, et elle est celle d'hier : celle sur la reconstruction des copies locales a été tranchée par vous entre-temps, et la session voisine l'exécute.

> **D-33 — Deux dépôts frères portent peut-être le même passif dans leur histoire : leur applique-t-on la même passe, ou attend-on une mesure avant de décider ?**
>
> Le sondage rapide fait après la publication montre que les treize dépôts frères sont propres à leur tête, mais que deux d'entre eux — la forge des outils et la forge du design — ont respectivement un et trois commits qui touchent le terme dans leur passé. Ce chiffre vient d'une recherche large qui remonte aussi des correspondances fortuites dans des images ; il ne prouve pas un passif, il signale qu'il faut regarder. La vérification du jour rend cette question plus pressante, pas moins : le terme est confirmé comme un nom réel et protégé.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md`, paragraphe « Réécrire l'historique d'un dépôt », qui impose que la mesure décidant une réécriture se fasse sur un clone à branche unique de ce qui est publié — la troisième passe avait failli réécrire pour quatre-vingt-neuf constats qui vivaient dans une branche jamais poussée.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Mesurer d'abord les deux dépôts, puis décider sur le chiffre réel | Simple × court : deux exécutions de la porte sur des clones frais | Rien : c'est le préalable de (b) |
| (b) Réécrire les deux dépôts tout de suite, sans mesure préalable | Moyen × moyen, et deux reconstructions de clones sur les deux postes, peut-être pour rien | La possibilité de constater que le passif est nul |
| (c) Ne rien faire : ces deux dépôts restent en l'état | Nul aujourd'hui | La garantie que le parc entier est propre, alors que le pilot vient de l'obtenir |

> **Si rien n'est décidé** : (c) s'applique de fait — les deux dépôts gardent leur passé, et la question se reposera à la prochaine extension des tables.

## 4. Traité — avec sa preuve

- **La rectification annoncée est fausse sur son point central, et c'est mesuré et non argumenté.** Contrôle : lecture directe de la table canonique du canal confidentiel ; classe : une mesure faite avec un référentiel résolu ailleurs que là où il vit.
  - preuve : `produits['Produit-09'] = 'Produit-09'` ; **cinq** clés contiennent ce terme et non trois — deux d'entre elles avaient été omises ; `depuis` porte la date du 08/09 ; et le journal du canal montre que la table n'a pas été touchée depuis `7a070e0`, daté du 08/09 à 19 h 13, soit avant la réécriture.
- **Deux sources indépendantes confirment la lecture, et aucune ne vient de moi.** Contrôle : recoupement de deux mesures antérieures faites par des chemins différents.
  - preuve : la porte de publication, jouée avec les tables canoniques et le plafond d'affichage levé, avait rendu **636 constats** portant ce terme — impossible si la clé n'existait pas ; et l'outil officiel de génération des règles, qui résout les tables par la bibliothèque dédiée et non par une variable posée à la main, avait émis la paire correspondante dans son rappel de noms.
- **La conclusion de la session voisine sur le faux positif reste juste, mais pour une autre cause, et la nuance est reprise.** Contrôle : lecture de la règle de graphie littérale de la porte.
  - preuve : la graphie littérale d'une clé est bornée aux deux bouts depuis le 06/09 ; dans le mot incriminé le terme est précédé d'une lettre, donc la recherche en arrière échoue et aucune correspondance n'est possible. **Ce n'est pas que la clé n'existe pas : c'est que la frontière de mot a fait son travail.** La version fausse dit qu'il n'y a rien à protéger, la juste dit que la protection a fonctionné.
- **La session voisine est prévenue avec la mesure, avant que l'item ne fasse doctrine.** Contrôle rouge → vert : une correction fausse en cours d'entrée au registre → mesure remise avec ses trois preuves et l'énoncé du risque.
  - preuve : le risque nommé est concret — un lecteur du registre concluant que ce terme n'est pas protégé le réintroduirait, alors que la qualification de la veille a établi qu'il désigne un site public réel dont l'histoire du parc discutait la pile technique et le budget d'audit.

## 5. Non traité — avec son motif

- **Toute écriture dans le dépôt du pilot** : suspendue — motif : garde-fou, la session voisine y exécute la reconstruction du clone décidée par vous, et deux écrivains sur un dépôt en cours de réalignement se détruiraient mutuellement.
- **Le report de ma restitution dans un fichier du dépôt** : non fait — motif : même garde-fou ; cette restitution a été rédigée et jugée hors dépôt, et sera déposée quand la reconstruction sera finie.
- **La copie installée d'un référentiel d'oracles en avance de six lignes sur sa source, avec un nom de client en clair** : non traité — motif : hors mandat, la source vit chez une forge sœur, et la session voisine l'a déjà journalisé ; je n'ai touché ni à la copie installée ni à la source.
- **Le passif éventuel des deux dépôts frères** : c'est la décision D-33 — motif : dépendance à une décision humaine.

## 6. Écarts à la lettre

- **Une session voisine m'a annoncé une correction, et je ne l'ai pas reprise** → j'ai mesuré avant de la croire, puis je l'ai contredite avec les chiffres → pourquoi : la correction portait sur le fondement d'un geste irréversible que je venais d'exécuter, et l'accepter sur parole aurait laissé entrer au registre une affirmation qui conduit à réintroduire un nom de client.

## 7. Risques

- **Une correction fausse devenue doctrine** : signal = un item du registre affirmant qu'un terme protégé ne l'est pas ; parade = la mesure est remise à la session qui l'a écrite, avec ses trois preuves ; si l'item reste en l'état, le prochain lecteur réintroduira le nom.
- **Une mesure faite avec un référentiel résolu ailleurs qu'à sa place** : signal = une variable d'environnement vide posée sur une ligne de commande, et un verdict qui ne ressemble à aucun autre ; parade = la bibliothèque dédiée est le seul endroit qui sait où lire les tables, et tout écart de verdict entre deux sessions se vérifie d'abord là.
- **Un nom de client dans une copie installée que la prochaine propagation écrasera** : signal = l'écart entre copie installée et source versionnée sur un fichier de référentiel ; parade = le report doit passer par la chaîne de pseudonymisation, jamais par un copier-coller, sans quoi le remède publie ce qu'il prétend protéger.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-104 | Vérifier après la reconstruction que mon commit en attente est bien rejoué et que la porte est verte en local | `neuve` | auto_ia | `dependance_externe` : la reconstruction est en cours dans la session voisine | `git log --oneline` sur la branche rebâtie, puis `oracle-nom-client-publie .` avec les deux tables du canal | un commit portant le générateur corrigé et son banc pourrait être perdu sans que personne le voie |
| A-100 | Mesurer le passif réel des deux dépôts frères signalés, sur clones frais à branche unique | `neuve` | auto_ia | `dependance_bloc_3` — décision D-33 | `git clone --single-branch` puis `oracle-nom-client-publie .` avec les deux tables désignées par variables d'environnement | le parc reste sans mesure là où le pilot vient d'être assaini |
| A-101 | Rattacher le banc du générateur à un cliquet du pilot, pour qu'une régression le fasse rougir | TF-1004 | auto_ia | `gate_gouvernance` — la candidature n'est pas décidée | ajouter son exécution à la recette du pilot, puis la rejouer ici | un banc que rien n'exécute retombe à l'état d'absence de banc |
| A-103 | Restituer le champ des occurrences qui ont RÉSISTÉ à la substitution, et couvrir le message de commit | TF-0993 | auto_ia | `gate_gouvernance` — candidature non décidée, et le changement touche un contrat partagé entre deux dépôts | `passer()` rend `refuses` à côté de `corriges`, et le hameçon l'affiche en avertissant | un commit annoncé pseudonymisé peut porter un nom réel |
| A-67 | Sur l'autre poste, à sa prochaine ouverture : reconstruire ses clones, dont celui du pilot désormais réécrit | TF-0829 | manuelle_dev | `presence` : commandes à jouer sur l'autre machine — `git -C ../digit-ai-forge-development rev-list --count HEAD..@{u}` rend 0 ici, il ne mesure que ce poste | `node bootstrap.mjs --pull` puis `node bootstrap.mjs --rebatir <dépôt>` | l'autre poste travaillera sur une histoire incompatible et pourrait republier les noms |

Ordre : **A-104 en premier, parce qu'elle est la seule dont la fenêtre se ferme — un commit non rejoué se constate au moment de la reconstruction, pas trois jours après** ; A-100 ensuite, parce qu'elle informe la seule décision ouverte ; A-101 et A-103 quand leurs candidatures sont décidées ; A-67 à l'ouverture de l'autre poste.

## 9. Traces

- Canal confidentiel — `C:\dev\_confidentiel\tables\produits-pseudonymes.json`, 65 produits, commit `7a070e0` du 08/09 à 19 h 13, inchangé depuis.
- Dépôt public — `https://github.com/iguane39/digit-ai-factory`, `origin/main` `c96a32f`, réécrit et vérifié la veille : 14 termes cherchés, 0 occurrence en contenu, en nom de fichier et en message de commit.
- Sauvegardes de la réécriture — `c:\dev\_sauvegarde-avant-reecriture-20260909\` : paquet complet vérifié, patch du commit en attente, patch du travail non enregistré.
- Cette restitution — rédigée et jugée hors dépôt pendant la reconstruction, à déposer sous `output\04-plans\` dès qu'elle sera finie.
