---
destinataire: humain
---

# Synthèse de mandat — pourquoi le bloc des décisions dérive d'un rendu à l'autre (30/08/2026)

Votre constat est exact, et la cause n'est pas où je l'aurais cherchée. Le texte de doctrine
exige cinq choses d'une décision ; le contrôle automatique n'en mesure que trois. Les deux qui
ne sont mesurées par personne sont précisément celles qui varient d'un rendu à l'autre : le coût
et ce qu'elle ferme, portés par chaque option, et la phrase qui dit ce qui se passe si vous ne
tranchez pas. Ce que j'ai inscrit ce matin a aggravé le flou plutôt que de le réduire : j'ai
prescrit le tableau des options sans fixer ce qui l'entoure, si bien que deux rendus peuvent tous
deux respecter la nouvelle version et ne pas se ressembler. Et mon propre message précédent a
dérivé le premier : ses trois décisions ont perdu la phrase de repli que le document déposé sur
disque, lui, portait bien. Rien n'a été modifié dans cette instruction ; trois arbitrages ferment
le sujet, et le premier suffit à rendre la dérive impossible.

## 1. En-tête d'identification

- **quoi** — instruction d'un écart de forme constaté par le destinataire entre deux rendus du bloc des décisions ; diagnostic seul, aucune modification.
- **sur quoi** — le pilot `digit-ai-factory`, son référentiel `gabarits\RESTITUTION.md` et son contrôle `oracles\oracle-synthese.mjs`.
- **quand** — fin le **30/08/2026 à 11:04 (UTC+02:00)**, durée **≈ 20 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail inchangé depuis le tour précédent.

## 2. Verdict en une ligne

Le bloc des décisions dérive parce que **le texte prescrit plus que le contrôle ne mesure** : 5 exigences écrites, 4 règles d'oracle sur les 24 appliquées au document, et 0 règle sur le coût par option, sur ce qu'elle exclut et sur l'option par défaut — vérifié par comptage, 0 occurrence de ces trois notions dans `oracles\oracle-synthese.mjs` hors commentaires.

## 3. Décisions attendues

**Chapeau commun.** Le bloc des décisions porte, depuis le 13/08, cinq exigences : rappeler le
sujet, recommander en citant sa source, proposer des options étiquetées portant chacune son coût
et ce qu'elle ferme, motiver la recommandation, et nommer ce qui se passe si rien n'est décidé.
Quatre règles d'oracle ont été ajoutées au fil des retours — le choix fermé, le rappel du sujet,
la recommandation sourcée, le numéro. Les trois exigences restantes n'ont jamais reçu de juge, et
c'est la définition même d'une règle qui décore : elle tient tant que celui qui rédige y pense.
S'y ajoute une seconde source de flou, découverte en instruisant : le contrôle juge le **message
affiché**, tandis que la doctrine prescrit d'écrire la synthèse **en fichier** puis de l'afficher
— deux objets, et rien qui vérifie qu'ils disent la même chose.

- **Décision 1 — Arme-t-on un juge sur les trois exigences du bloc des décisions qui n'en ont aucun ?** Il s'agit du coût porté par chaque option, de ce que chaque option exclut, et de la phrase nommant l'option par défaut. Recommandation instruite, et sa source consultée : le comptage des règles effectivement appliquées dans `oracles\oracle-synthese.mjs` — vingt-quatre règles distinctes, dont aucune ne cherche « coût », « exclut » ni « si rien n'est décidé » ailleurs que dans ses commentaires ; le texte, lui, les exige à la section du bloc 3 de `gabarits\RESTITUTION.md`.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Armer deux règles neuves — chaque option porte coût et exclusion, chaque décision nomme son option par défaut — en avertissantes, comme l'ont été toutes les règles récentes | Effort **moyen × court** ; il faut leur écrire un cas témoin dans les deux sens, sans quoi elles pourraient être mortes en croyant vivre | Exclut de laisser ces trois exigences à la vigilance du rédacteur |
| **(b)** N'écrire que la prose : préciser l'anatomie dans le référentiel, sans juge | Effort **simple × court** | Exclut la garantie : c'est exactement l'état actuel, et c'est lui qui a produit l'écart que vous constatez |
| **(c)** Ne rien faire | Effort nul | Exclut toute stabilité : chaque session continuera de rendre sa variante |

  - **Recommandation : (a), et pourquoi** — la doctrine dit d'elle-même qu'une consigne sans contrôle exécuté décore, et elle le dit à propos de sa propre version 1. Les deux règles visées sont mécaniques : une option est une ligne, on y cherche deux notions ; une décision est un groupe, on y cherche une phrase de repli. (b) répète l'erreur qu'on instruit.
  - **Si rien n'est décidé** : (c) s'applique, et le prochain rendu dérivera comme celui-ci.

- **Décision 2 — Fixe-t-on l'anatomie qui entoure le tableau, ou la laisse-t-on libre ?** Ce matin j'ai prescrit les trois colonnes sans fixer le reste : la forme du titre, la place de la recommandation, la présence de la ligne de repli. Les deux rendus que vous comparez respectent tous deux la version 2.12.0 et diffèrent sur ces trois points — le titre en question contre le groupe nominal, la recommandation avant le tableau contre après, la ligne de repli présente contre absente. Recommandation instruite, et sa source consultée : la section du bloc 3 de `gabarits\RESTITUTION.md`, qui énumère les cinq éléments **dans un ordre** mais ne dit pas que cet ordre s'impose.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Fixer l'anatomie complète comme défaut : titre en **question**, recommandation et source **avant** le tableau, tableau, puis ligne de repli | Effort **simple × court** ; aligne le référentiel sur le rendu que vous avez désigné | Exclut la variante que j'ai employée hier, dont la recommandation venait après le tableau |
| **(b)** Ne fixer que l'ordre, sans imposer la question au titre | Effort **simple × court** | Exclut l'uniformité des titres, qui est le premier repère visuel d'un bloc de décisions |
| **(c)** Laisser libre autour du tableau | Effort nul | Exclut de répondre à votre constat : c'est l'état qui l'a produit |

  - **Recommandation : (a), et pourquoi** — le rendu que vous avez mis en regard est celui dont la lecture vous convient, et l'anatomie qu'il emploie est déjà celle que le texte énumère ; la fixer ne fait qu'écrire ce qui marche. Le titre en question a un effet propre : il rend le sujet **répondable** avant même la lecture des options.
  - **Si rien n'est décidé** : (c) s'applique, l'anatomie reste au goût de chaque session.

- **Décision 3 — Que juge-t-on au juste, le message affiché ou le fichier déposé ?** Découvert en instruisant : le crochet de fin de tour lit le message affiché et le soumet au contrôle, tandis que la doctrine prescrit d'écrire la synthèse en fichier, de la faire juger, puis de l'afficher. Il y a donc deux objets. Mon message précédent en est la démonstration : le fichier portait les trois lignes de repli, le message affiché ne les portait plus, et rien n'a signalé l'écart. Recommandation instruite, et sa source consultée : l'en-tête de `oracles\hook-restitution.mjs`, qui décrit son entrée comme le chemin du journal de session et juge « le message final d'un tour de travail », contre la section « Appelants » de `gabarits\RESTITUTION.md` : « la synthèse s'écrit EN FICHIER […] et ne s'affiche qu'après son verdict — un message de chat ne passe devant aucun contrôle, un fichier si ».

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Le crochet compare le message affiché au dernier fichier de synthèse et refuse l'écart | Effort **moyen × moyen** ; suppose de désigner sans ambiguïté quel fichier fait foi | Exclut qu'un message abrégé s'écarte du document qui a été jugé |
| **(b)** Assumer que le juge est le **message**, et corriger la doctrine qui dit le contraire | Effort **simple × court** ; le fichier devient une trace, plus un livrable jugé | Exclut la trace opposable qu'un fichier déposé constitue |
| **(c)** Laisser les deux objets vivre séparément | Effort nul | Exclut de savoir lequel fait foi le jour où ils divergent — ce qui vient d'arriver |

  - **Recommandation : (b), et pourquoi** — c'est le message que vous lisez et sur lequel vous tranchez ; c'est donc lui qui doit être jugé, et il l'est déjà. La doctrine décrit un dispositif antérieur au crochet et n'a pas été mise à jour quand il est arrivé. (a) est plus complet mais paie une machinerie pour aligner deux objets dont un seul vous sert.
  - **Si rien n'est décidé** : (c) s'applique, et l'écart entre fichier et message restera invisible.

## 4. Traité — avec sa preuve

- **L'écart que vous constatez a été localisé sur pièce**, et il porte sur trois points nommés.
  - preuve : comparaison des deux rendus — titre en question contre groupe nominal ; recommandation et source placées **avant** le tableau contre **après** ; ligne « si rien n'est décidé » **présente** contre **absente**. Les deux rendus passent le contrôle.
- **La cause a été mesurée, et ce n'est pas la numérotation.**
  - preuve : la règle qui exige un numéro accepte explicitement quatre écritures — `**Décision 1 —**`, `1.`, `**1)**`, `D1 —` ; son commentaire le dit et son expression régulière le fait. Le numéro n'est donc pas le point de divergence.
- **Le déséquilibre entre ce qui est prescrit et ce qui est mesuré a été compté.**
  - preuve : le bloc des décisions énumère **cinq** exigences ; l'oracle applique **vingt-quatre** règles au document entier, dont **quatre** portent sur ce bloc — choix fermé, rappel du sujet, recommandation sourcée, numéro. Recherche des notions « coût », « exclut » et « si rien n'est décidé » dans le fichier de règles : **aucune occurrence hors commentaires**, la seule règle citant le coût étant celle qui interdit de le chiffrer en jours.
- **Ma modification de ce matin a prescrit la moitié du sujet**, et c'est une part de la cause.
  - preuve : la section ajoutée en version 2.12.0 fixe les trois colonnes du tableau et dit que le reste « vit hors du tableau », sans fixer ni la forme du titre, ni la place de la recommandation, ni le caractère obligatoire de la ligne de repli.
- **Mon message précédent a dérivé de son propre document**, et le contrôle ne pouvait pas le voir.
  - preuve : le fichier déposé porte les trois lignes « Si rien n'est décidé » et rend **PASS 30/30** ; le message affiché ne les portait plus et a été accepté — aucune règle ne mesure cette ligne.
- **Les deux objets jugés sont distincts**, ce qui n'était pas su avant cette instruction.
  - preuve : `oracles\hook-restitution.mjs` décrit son entrée comme `{ session_id, transcript_path, stop_hook_active }` et juge « le message final d'un tour de TRAVAIL », là où `gabarits\RESTITUTION.md` prescrit que la synthèse « s'écrit EN FICHIER » et « ne s'affiche qu'après son verdict ».

## 5. Non traité — avec son motif

- **L'armement des deux règles manquantes** : *dépendance à une décision humaine* — première décision ci-dessus ; écrire une règle sans son cas témoin dans les deux sens produirait une règle morte, et ce piège est déjà documenté dans le référentiel.
- **La fixation de l'anatomie du bloc** : *dépendance à une décision humaine* — deuxième décision ci-dessus.
- **L'alignement du fichier et du message** : *dépendance à une décision humaine* — troisième décision ci-dessus.
- **La correction de mon message précédent** : *écarté* — le réafficher corrigé coûterait au lecteur une seconde lecture de huit blocs pour trois lignes ; le fichier déposé, lui, est complet et fait foi. Réouverture si vous souhaitez le rendu complet.
- **Les huit décisions restées ouvertes aux trois tours précédents** : *hors mandat* — tables d'anonymisation, dépôts frères, ordre des tâches, câblage du contrôle d'héritage, produits sans pièce, banc de recettes rouge.

## 6. Écarts à la lettre

- **vous avez demandé** pourquoi le rendu ne respecte pas le format → **j'ai fait** un diagnostic mesuré et trois propositions, **sans modifier une ligne** du référentiel ni du contrôle → **pourquoi** : votre message est une question, et la réponse change selon l'arbitrage que vous rendrez sur le premier point. Corriger d'office aurait figé une anatomie que vous n'avez pas choisie.
- **Reconnaissance d'un écart de ma part, sans demande de votre part.** Mon message précédent a rendu trois décisions sans leur ligne de repli, alors que le document que j'avais fait juger les portait. Ce n'est pas le contrôle qui a manqué, c'est moi — et le contrôle ne pouvait pas rattraper, faute de règle. Les deux moitiés du défaut sont dites.
- Aucun autre écart.

## 7. Risques

- **Armer une règle sans la mettre à l'épreuve dans les deux sens produit une règle morte.**
  - signal : la règle rend vert sur un document qui viole manifestement ce qu'elle prétend juger.
  - parade : le référentiel raconte déjà ce piège payé le 23/08, où une expression insensible à la casse matchait le mot « ecran » et rendait vert sans rien juger ; le remède est un cas témoin rouge qui échoue sur la règle neuve, exigé avant publication.
- **Fixer l'anatomie peut refuser une mise en page légitime.**
  - signal : un rendu clair est repris par le contrôle pour une raison de typographie.
  - parade : garder l'anatomie en **défaut de rédaction** et non en règle d'oracle, comme la forme du tableau l'est déjà — c'est la leçon du 24/08, où une règle n'admettant qu'une mise en page ne jugeait plus le fond.
- **Le message et le fichier continueront de diverger tant que le troisième point n'est pas tranché.**
  - signal : un fichier rendu conforme et un message affiché qui n'en reprend qu'une partie, exactement le cas de ce matin.
  - parade : la troisième décision ; en attendant, le fichier déposé fait foi et son chemin est donné au dernier bloc.

## 8. Prochaines actions

Ordre de traitement : armer les juges vient en premier parce que c'est la seule action qui rende les deux autres **vérifiables** — fixer une anatomie que rien ne mesure, c'est réécrire la consigne qui vient d'échouer.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Écrire les deux règles manquantes dans `oracles\oracle-synthese.mjs` — coût et exclusion par option, option par défaut par décision — chacune avec son cas témoin rouge, puis rejouer `node oracles\oracle-synthese.mjs --self-test`. | `auto_ia` | `dependance_bloc_3` — attend le premier arbitrage ; le niveau, avertissant ou bloquant, en dépend. | Trois exigences écrites depuis le 13/08 restent à la vigilance du rédacteur, et la dérive que vous constatez se reproduira. |
| 2 | `neuve` | Inscrire l'anatomie retenue dans la section du bloc 3 de `gabarits\RESTITUTION.md`, en version 2.13.0 datée. | `auto_ia` | `dependance_bloc_3` — attend le deuxième arbitrage. | Deux rendus continueront de respecter la même version en ne se ressemblant pas. |
| 3 | `neuve` | Aligner la doctrine et le crochet sur l'objet réellement jugé, selon la voie retenue. | `auto_ia` | `dependance_bloc_3` — attend le troisième arbitrage. | Personne ne saura lequel du fichier ou du message fait foi le jour où ils divergent. |
| 4 | `neuve` | Trancher les huit décisions restées ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — elles portent des arbitrages de risque, de priorité et de gouvernance. | La boîte d'entrée reste fermée, le poste reste non prêt, et vingt-trois tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Pourquoi le bloc 3 derive - 20260830d.md`
- Documents cités : `gabarits\RESTITUTION.md` version 2.12.0, section du bloc 3 et section « Appelants » · `oracles\oracle-synthese.mjs`, vingt-quatre règles appliquées · `oracles\hook-restitution.mjs`, en-tête
- Rendu précédent, complet et conforme : `output\04-plans\Digit-AI - Synthese Mandat - Forme du bloc 3 et redescente aux produits - 20260830c.md`
- Dépôt : `66c76d2`, **aucune modification dans ce tour**
