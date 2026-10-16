---
destinataire: humain
---

# Vos deux décisions sont exécutées, et la troisième question a maintenant ses chiffres

Les cinq pages dont vous demandiez la nature sont les cinq études d'opportunité écrites depuis le
sept septembre ; elles vous sont adressées nommément, et c'est ce qui rend votre choix mieux fondé
que ma recommandation. Elles existent désormais, produites par une commande plutôt qu'à la main, et
un contrôle refuse la prochaine étude qui sortirait sans la sienne. Votre mandat d'écriture chez
les forges voisines est ouvert et un premier correctif y est posé. Reste la question des vues du
registre : je l'avais mal présentée, le coût réel est ailleurs que là où je l'avais mis, et elle
vous revient plus bas avec ce qui se perd dans chaque voie.

## 1. En-tête

- **Quoi** : exécution des décisions D-1 (b) et D-3 (a) · **sur quoi** : le socle de pages du pilot,
  le registre d'améliorations et le skill des oracles de qualité.
- **Quand** : le 2026-09-16, de 11h20 à 14h05 (Europe/Paris), durée 2 h 45.
- **Qui** : pilot, doctrine de restitution v2.22.0, socle de pages v1.11.0.

## 2. Verdict

5 pages produites et jugées PASS par les deux oracles du socle, 6 défauts de la bibliothèque
partagée corrigés, 2 règles neuves, 1 correctif posé chez une forge voisine sous mandat, harnais
122/123 — le seul défaut est le contrôle des skills, qui voit la source en avance sur la copie
installée et attend la propagation. 44 items restent ouverts, dont 21 débloqués par votre mandat.

Coût du reste sous mandat : complexité complexe × durée très long.

## 3. Décisions attendues de vous

**Bloquants à lever pour avancer** — chacun dit ce qu'il arrête, ce qu'il faut fournir, et ce qui
se passe si rien ne vient :

- **le sort des vues du registre reste à l'arrêt** ; il faut choisir entre les sortir du suivi, les
  nettoyer de l'histoire, faire les deux, ou assumer ; sans ce choix, le coût d'un futur nettoyage
  de nom reste multiplié par deux et demi ;
- **la propagation du correctif écrit chez la forge des agents est à l'arrêt** ; elle se fait au
  prochain démarrage de session, qui rejoue la fraîcheur du poste ; jusque-là le contrôle des
  skills reste en défaut sur un fichier, la source étant en avance sur la copie installée ;
- **le dernier des six volets d'oracle reste à l'arrêt** ; il lui faut une spécification
  exécutable, que son lot ne donne pas — ni où la règle vit, ni quel contrôle la porterait ; sans
  elle, écrire la règle reviendrait à parier sur une lecture, ce que le volet précédent vient
  d'éviter de justesse.
- **le contrôle de vocabulaire jouable sur les fichiers de données de la forge data est à
  l'arrêt** ; c'est un objet durable neuf, et la règle d'admission du parc exige qu'une étude
  d'opportunité l'instruise avant sa naissance ; sans elle, le mot que le client a refusé continue
  de vivre dans les commentaires de schéma et les messages d'outil, que son équipe lit.

> **D-4 — Que fait-on des vues du registre, maintenant que leur coût est mesuré ? (remplace D-2)**
>
> Je vous avais mis en avant un compteur de révisions qui donnait au sujet une gravité qu'il n'a
> pas. Les vues pèsent huit virgule huit mégaoctets compressés sur les deux cent quatre-vingts du
> dépôt, soit trois pour cent : ce n'est pas un sujet de place. Le coût réel est celui du
> nettoyage. Un identifiant écrit une seule fois dans la source vit dans cinquante révisions de
> cette source, cinquante de la vue lisible et trente-deux de la page : cent trente-deux au total,
> dont quatre-vingt-deux dues aux seules vues. Effacer un nom de client de l'histoire coûte donc
> deux fois et demie le travail nécessaire. Et les deux remèdes que je vous avais présentés comme
> concurrents ne le sont pas : sortir les vues du suivi arrête l'amplification à venir sans rien
> nettoyer du passé, réécrire l'histoire nettoie le passé sans rien arrêter pour la suite.
>
> **Recommandation : (a).** Source consultée : la mesure ci-dessus, rejouée ce jour sur le dépôt, et
> `REGLES-PROJET.md`, qui ne tranche nulle part le cas d'un contenu dérivé publié. Ce qu'on perd en
> sortant les vues du suivi tient en une ligne et rien d'autre : elles cessent d'être lisibles sur
> l'hébergeur sans cloner. Aucun outil du parc ne les lit depuis l'historique — vérifié fichier par
> fichier —, elles restent produites sur disque à chaque passage, et toute version passée se
> régénère depuis la source de son époque.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) sortir les vues du suivi, les régénérer à la demande | effort simple × court ; la lecture sur l'hébergeur se perd, et rien d'autre | exclut de nettoyer les quatre-vingt-deux révisions déjà écrites |
| (b) sortir les vues du suivi ET nettoyer l'histoire au prochain passage | effort complexe × long ; toutes les empreintes changent, et les cent six citées au registre deviennent orphelines | exclut de garder l'histoire telle qu'elle est, et impose un reclonage du parc |
| (c) assumer et écrire le coût au registre de dette | effort simple × court ; le facteur deux et demi reste payé à chaque nettoyage | exclut toute réduction, aujourd'hui comme plus tard |

> **Si rien n'est décidé** : (c) — rien ne bouge, et le coût continue d'être payé sans être écrit.

## 4. Traité

- Les cinq pages que vous demandiez à identifier : ce sont les cinq études d'opportunité écrites
  depuis l'entrée de la doctrine — préparation d'une mission data, forge communication et marketing,
  conception documentaire en amont, personas par phase, inventaire des composants — preuve : leur
  en-tête nomme leur audience, « le pilote de l'écosystème, qui décide des mandats ».
- Décision D-3 (a) exécutée, et votre lecture était la bonne — preuve : les cinq pages existent et
  rendent `check_html` PASS 5/5 et `render_page` PASS 5/5 aux six largeurs de la grille.
  - un générateur plutôt que cinq pages à la main : cinq pages écrites une fois seraient cinq
    dettes, et la sixième étude repartirait sans la sienne ;
  - le mode dossier a débordé à son premier usage — soixante-cinq pages là où votre décision en
    couvrait cinq — et porte depuis ses deux bornes, le rôle et la date d'entrée de la doctrine ;
  - la règle G9 (le contrôle de la page homonyme d'un livrable) refuse désormais une proposition,
    trajectoire, étude ou conseil postérieur au sept septembre sans sa page ; antérieur, elle le
    déclare hors de portée plutôt que de l'accuser.
- Six défauts de la bibliothèque partagée trouvés par les oracles du socle et corrigés, donc pour
  les quatre générateurs qui s'en servent — preuve : recette de la bibliothèque 8 puis 13 cas,
  chacun dans ses deux sens.
  - les liens de la source n'étaient pas rendus du tout : toutes les pages générées du parc
    affichaient leur syntaxe et leurs adresses en clair, et ces adresses insécables poussaient le
    document au-delà de la fenêtre ;
  - un tuyau échappé n'était pas reconnu comme tel : deux lignes rendaient cinq cellules pour un
    en-tête de trois, et les valeurs glissaient de colonne sans jamais déborder ;
  - la mesure de lecture est passée du texte au conteneur, le premier remède ayant été refusé dans
    la minute par la règle voisine, dont le message portait le remède juste ;
  - la colonne de lecture est centrée, le rythme vertical unifié, les en-têtes de tableau passent
    en bloc sur mobile, et la coupure de mot est restée dans le périmètre autorisé après un premier
    essai trop large, refusé aussitôt.
- Les schèmes de lien sont en liste fermée, et ce qu'elle refuse reste visible — preuve : recette à
  cinq cas, un lien exécutable n'est jamais fabriqué et sa syntaxe brute n'est jamais retirée en
  silence.
- Mandat D-1 (b) ouvert et exercé une première fois chez la forge des agents, sur TF-1006 — preuve :
  commit `f7311cf`, la règle de remontée nomme désormais le fichier à éditer et dit pourquoi l'autre
  disparaît ; un défaut de lisibilité antérieur du même fichier passe de FAIL à PASS.
- Une colonne nommée « Classement » a failli faire renommer une colonne de livrable pour satisfaire
  un contrôle de forme — preuve : c'est la classe corrigée le matin même sur le juge des
  restitutions ; la sortie retenue est une note d'auteur reliée à l'en-tête, pas un renommage.

## 5. Non traité

- Vingt et un items désormais couverts par votre mandat et non encore traités : motif
  `borne_atteinte` — un seul l'a été dans ce tour, et les traiter tous demande plusieurs sessions
  par dépôt.
- Le contrôle de vocabulaire jouable sur les fichiers de données de la forge data : motif
  `gate_gouvernance` — c'est un objet durable neuf, et la règle d'admission exige une étude
  d'opportunité avant sa naissance.
- La propagation du correctif écrit chez la forge des agents : motif `dependance_externe` — elle se
  joue au démarrage de session suivant, et jusque-là le contrôle des skills reste en défaut sur ce
  seul fichier.
- Le dernier des six volets d'oracle : motif `dependance_bloc_3` — sans spécification exécutable,
  l'écrire reviendrait à parier sur une lecture.
- Le sort des vues du registre : motif `dependance_bloc_3` — il attend la décision ci-dessus.

## 6. Écarts à la lettre

Vous avez demandé « 3a » et ce que sont ces cinq pages → j'ai produit les cinq pages et répondu →
en ajoutant un générateur et un contrôle que vous n'aviez pas demandés, parce que cinq pages écrites
à la main auraient laissé la sixième étude sans la sienne et la règle sans juge. Vous avez demandé
« 1b » → j'ai ouvert le mandat et traité un seul item chez une forge voisine → parce que les vingt
et un autres demandent plusieurs sessions et que les entamer tous en aurait laissé vingt et un à
moitié faits.

## 7. Risques

- La bibliothèque de rendu a changé pour quatre générateurs, et trois n'ont pas été rejoués sur
  leurs pages réelles.
  - signal : une page d'un autre générateur sort avec une mise en page modifiée sans que personne
    l'ait voulu ;
  - parade : la recette de la bibliothèque est passée de huit à treize cas, et les trois autres
    générateurs sont joués par le harnais.
- Le contrôle des skills est en défaut tant que la propagation n'a pas eu lieu — vérifié en le
  rejouant : il nomme une seule divergence, sur un seul fichier, celui qui vient d'être corrigé.
  - signal : une session lit ce défaut comme une régression du tour, alors qu'il en est la
    conséquence normale ;
  - parade : la cause et son remède d'une commande sont écrits au registre, sur l'item concerné.
- Le mandat ouvre l'écriture sur quatorze dépôts à la fois.
  - signal : un arbre de travail laissé modifié chez un dépôt voisin, qu'une autre session
    commiterait sans le savoir ;
  - parade : un seul dépôt a été touché, son arbre est propre et son commit est nommé.

## 8. Prochaines actions

Trois travaux que le pilot mène seul dès la prochaine session, et trois gestes qui vous reviennent —
un arbitrage et deux feux verts. Les premiers sont listés d'abord.

| Sélecteur | Action | Acteur | Identifiant | Motif / raison | Où | Si rien n'est fait |
|---|---|---|---|---|---|---|
| **A-1** | Traiter les vingt et un items des forges voisines, un dépôt à la fois | `auto_ia` | neuve | `borne_atteinte` — un dépôt par session, hors de ce que ce tour pouvait porter | dépôts voisins, en commençant par celui qui porte le plus d'items | le mandat reste ouvert sans être exercé, et la file ne se vide pas |
| **A-2** | Rejouer les trois autres générateurs sur leurs pages réelles après le changement de bibliothèque | `auto_ia` | neuve | `borne_atteinte` — le harnais joue leurs recettes, pas leurs pages de production | `scripts\generer-architecture.mjs`, `scripts\generer-modele-donnees.mjs`, `todo\generer-todo-produit.mjs` | une page d'un autre générateur sort modifiée sans que personne l'ait voulu |
| **A-3** | Instruire le dernier volet d'oracle avant de l'écrire | `auto_ia` | TF-0923 | `dependance_bloc_3` — ni le lieu de la règle ni son contrôle ne sont spécifiés | `gabarits\ETUDE-OPPORTUNITE.md`, livrable sous `output\03-etudes\` | la règle reste écrite et jouée par personne |
| **A-4** | Trancher D-4, le sort des vues du registre | `manuelle_utilisateur` | TF-0983 | `decision` — trois voies dont aucune n'est prescrite par un texte | bloc 3 de cette synthèse, option (a) recommandée | le coût du nettoyage reste multiplié par deux et demi |
| **A-5** | Donner le feu vert de publication du dépôt du pilot | `manuelle_utilisateur` | neuve | `decision` — la porte du dépôt réserve la publication au mot humain | `FORGE_PUSH_GO="<motif>" git push` depuis `c:\dev\digit-ai-factory` | les produits ne reçoivent ni la doctrine à jour ni les pages |
| **A-6** | Donner le feu vert de publication de la forge des agents | `manuelle_utilisateur` | TF-1006 | `decision` — même porte, autre dépôt | `FORGE_PUSH_GO="<motif>" git push` depuis `c:\dev\digit-ai-forge-agents` | la règle de remontée corrigée reste locale, et le défaut qu'elle prévient peut se reproduire |

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Decisions 1b et 3a executees et cout des vues mesure - 20260916c.md`
- `output\03-etudes\` — les cinq pages homonymes et leurs sources
- `scripts\generer-page-etude.mjs`, `scripts\lib-vue-html.mjs`, `scripts\lib-vue-html.test.mjs`
- `oracles\oracle-gabarits-documents.mjs` — règles G8 et G9
- `todo\TODO.jsonl`, `todo\TODO.md`, `todo\RECIDIVES.md`
- `digit-ai-forge-agents` — commit `f7311cf`, règle de remontée du skill des oracles de qualité
