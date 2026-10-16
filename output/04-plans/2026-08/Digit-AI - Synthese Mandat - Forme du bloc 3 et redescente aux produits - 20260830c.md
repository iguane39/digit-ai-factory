---
destinataire: humain
---

# Synthèse de mandat — forme par défaut du bloc 3, et redescente de la doctrine aux produits (30/08/2026)

La forme que vous préférez est désormais inscrite comme forme par défaut dans le référentiel du
pilot : à contenu égal, les options d'une décision se rendent en tableau. Votre seconde question
appelait une mesure plutôt qu'une opinion, et elle a renversé ce que je vous avais dit une heure
plus tôt : le contrôle qui détecte une copie de doctrine périmée chez un produit **existe**, il
fonctionne, et il vient de désigner le produit concerné en nommant son remède. Ce qui manque
n'est donc pas le contrôle mais son **déclenchement** — il ne se joue qu'au moment où un produit
renvoie un lot de retours, jamais à l'ouverture d'une session produit. Sur les six produits
instanciés de cette machine, deux seulement portent les trois pièces de la doctrine ; les quatre
autres n'en portent aucune, et aucun d'eux ne peut donc rien recevoir. La suite tient à trois
arbitrages, dont le premier suffit à rendre la redescente automatique.

## 1. En-tête d'identification

- **quoi** — application de l'arbitrage « b » (forme par défaut du bloc 3), puis instruction mesurée de la question de la redescente aux produits.
- **sur quoi** — le pilot `digit-ai-factory`, son référentiel `gabarits\RESTITUTION.md` et le mécanisme d'héritage `gabarits\HERITAGE.json`.
- **quand** — fin le **30/08/2026 à 10:12 (UTC+02:00)**, durée **≈ 25 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail non committé.

## 2. Verdict en une ligne

Forme par défaut **INSCRITE** (`gabarits\RESTITUTION.md` passé en version 2.12.0, self-test de l'oracle de restitution **11/11 PASS**, oracle des gabarits **PASS**) — et la redescente est **mesurée non aléatoire mais structurelle** : la règle d'héritage ne se joue qu'à l'ingestion d'un lot, six produits sont instanciés, **deux** portent la doctrine, **quatre** n'en portent aucune pièce.

## 3. Décisions attendues

**Chapeau commun.** Une doctrine du pilot n'arrive chez un produit que par une COPIE, et cette
copie n'est faite par personne d'office : le pilot n'écrit pas chez les produits, et le produit ne
sait pas qu'une version neuve existe. La règle d'héritage a été écrite pour fermer ce trou — elle
compare, fichier par fichier, la copie du produit à la source du pilot, et pour le texte de
doctrine elle exige une copie **identique**. Elle fonctionne : jouée à l'instant sur le produit du
dernier run, elle rend échec en nommant le fichier divergent et le geste qui le répare. Tout le
problème est **quand** elle se joue.

- **Décision 1 — le moment où la conformité de l'héritage est vérifiée chez un produit.** Mesuré sur les fichiers : le crochet d'ouverture d'une session produit joue la fraîcheur des dépôts et rappelle la doctrine, mais **n'appelle jamais** la règle d'héritage ; celle-ci n'est appelée qu'à l'ingestion d'un lot de retours par le pilot, et par une commande lancée à la main. Un produit qui consomme la Factory sans jamais renvoyer de lot n'est donc jamais contrôlé. Recommandation instruite, et sa source consultée : `oracles\hook-ouverture.mjs`, qui ne mentionne ni la règle d'héritage ni l'oracle de conformité, contre `todo\ingerer-lot.mjs` qui l'appelle explicitement à l'arrivée d'un lot.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Le crochet d'ouverture joue la conformité de l'héritage et **signale** les copies périmées, en nommant le fichier et le geste | Effort **simple × court** ; ajoute quelques secondes à l'ouverture d'une session produit | Exclut que la copie se répare toute seule : un humain ou une session doit encore recopier |
| **(b)** Idem, **et le crochet recopie lui-même** les artefacts déclarés en copie identique | Effort **moyen × court** ; une session produit verrait des fichiers changer sous elle à l'ouverture, ce qui doit être dit dans le compte rendu du crochet | Exclut que le produit garde une variante locale d'un artefact que la doctrine dit non personnalisable — c'est justement ce que le mode « copie identique » interdit déjà |
| **(c)** Ne rien changer | Effort nul | Exclut toute garantie : la redescente reste suspendue au trafic de retours de chaque produit |

  - **Recommandation : (b), et pourquoi** — l'argument qui aurait interdit (b) est que le pilot n'écrit pas chez les produits ; il ne s'applique pas ici, parce que ce crochet **s'exécute dans le produit**, lancé par la configuration du produit. C'est le produit qui écrit chez lui, ce que la doctrine autorise. (a) laisse un rouge que quelqu'un doit voir et traiter, et l'expérience de ce parc est que personne ne le traite : quatre produits sur six sont dans ce cas depuis des jours.
  - **Si rien n'est décidé** : (c) s'applique, et la prochaine version de doctrine restera dans le pilot.

- **Décision 2 — les quatre produits qui portent un dossier de forge mais aucune pièce de la doctrine.** Balayage des six produits instanciés de cette machine : deux portent les trois pièces — le texte, le juge et le câblage — et quatre n'en portent aucune. Ces quatre ont été commencés puis laissés en plan : leurs sessions ne reçoivent ni consigne ni juge, et leurs messages de fin de tour ne sont ni jugés ni refusés. Recommandation instruite, et sa source consultée : la section « Portée » de `gabarits\RESTITUTION.md`, qui décrit ce cas exact — cinq produits instanciés, un seul portant le juge, zéro portant le texte — et le tableau des trois pièces qu'elle donne.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Leur confier un lot de travaux par le canal du pilot vers le produit, décrivant les pièces à installer | Effort **simple × court** côté pilot ; l'installation reste à faire par chaque produit, à son rythme | Exclut de les considérer comme hors doctrine : ils redeviennent des produits sous contrôle |
| **(b)** Déclarer ces quatre dépôts **hors doctrine** tant qu'un run n'y est pas demandé | Effort nul, mais un dossier de forge subsiste chez eux et continue de suggérer le contraire | Exclut de recevoir leurs retours par le canal normal |
| **(c)** Ne rien faire | Effort nul | Exclut de savoir, la prochaine fois, si leur silence vient d'un produit sain ou d'un produit sans juge |

  - **Recommandation : (a), et pourquoi** — le canal qui dépose un travail chez un produit existe déjà et n'écrit que dans une boîte d'entrée ; c'est exactement son usage, et il laisse au produit la décision d'installer. (b) est honnête mais fige un demi-état, et (c) laisse quatre dépôts qui ressemblent à des produits sans l'être.
  - **Si rien n'est décidé** : (c) s'applique, les quatre restent muets.

- **Décision 3 — une recette du dépôt rendue rouge par la version précédente de la doctrine, avant mon intervention.** Le banc du crochet de restitution échoue sur trois de ses cas, tous pour la même cause : la règle qui exige un numéro sur chaque décision a été livrée le 28/08 sans que les cas témoins du banc soient mis à jour, si bien qu'ils déclarent une décision sans numéro et se font désormais reprendre. Recommandation instruite, et sa source consultée : la recette `oracles\hook-restitution.test.mjs` ne lit pas le fichier de doctrine (zéro occurrence), et son dernier commit `63b3059` est antérieur à `a04fef5`, celui qui a livré la règle — le rouge est donc antérieur à ma modification et n'en vient pas.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Corriger les trois cas témoins maintenant | Effort **simple × court** | Exclut de laisser un banc rouge qui masquerait la prochaine vraie régression |
| **(b)** Verser le constat au registre comme candidat, et le traiter dans l'ordre des autres tâches | Effort nul maintenant ; le banc reste rouge en attendant | Exclut la correction immédiate |
| **(c)** Ne rien faire | Effort nul | Exclut que ce banc serve encore à quelque chose : un rouge permanent finit par se lire comme du bruit |

  - **Recommandation : (a), et pourquoi** — trois cas témoins à renuméroter, et un banc rouge est précisément l'état dans lequel une régression réelle passe inaperçue. (b) est acceptable si vous préférez grouper, (c) ne l'est pas.
  - **Si rien n'est décidé** : (c) s'applique, le banc reste rouge.

## 4. Traité — avec sa preuve

- **La forme par défaut du bloc 3 est inscrite au référentiel**, arbitrage « b ».
  - preuve : `gabarits\RESTITUTION.md` porte désormais « **version 2.12.0, 30/08/2026** » et une section dédiée sous la clause des quatre mises en page ; le tableau à trois colonnes y est donné comme modèle, et la présente restitution l'emploie.
  - preuve de non-régression : `node oracles\oracle-synthese.mjs --self-test` → **11/11 PASS**, dont le cas qui vérifie que les quatre mises en page rendent le même verdict ; `node oracles\oracle-gabarits-documents.mjs` → **PASS**.
- **Le défaut est écrit comme défaut, pas comme règle** — les trois autres mises en page restent admises et l'oracle continue de les accepter.
  - preuve : aucune règle n'a été ajoutée à `oracles\oracle-synthese.mjs`, dont le compte de règles reste à trente ; la limite est déclarée dans la section elle-même.
- **Mon affirmation d'il y a une heure était fausse, et la mesure la corrige** : j'avais écrit qu'aucun contrôle ne signale qu'une copie de doctrine a pris du retard sur sa source.
  - preuve : `node oracles\oracle-conformite-projet.mjs c:\dev\Produit-02.com` rend **FAIL R-47** — la règle d'héritage — avec le message « 0 absent(s), 1 périmé(s) ou incomplet(s) : forge/RESTITUTION.md diverge de gabarits/RESTITUTION.md. Recopier depuis le pilot ». Le contrôle existe, il est exact, et il nomme son remède.
- **Le moment de déclenchement a été mesuré sur les fichiers**, et c'est là qu'est le trou.
  - preuve : `oracles\hook-ouverture.mjs` ne contient **aucune** occurrence de la règle d'héritage ni de l'oracle de conformité ; `todo\ingerer-lot.mjs` en contient huit et appelle l'oracle à l'arrivée d'un lot. Le crochet d'ouverture d'une session produit joue la fraîcheur des dépôts et rappelle la doctrine — il ne vérifie pas que le produit la porte.
- **L'état réel du parc a été relevé**, plutôt que supposé.
  - preuve : six produits portent un dossier de forge ; deux portent les trois pièces (texte, juge, câblage), quatre n'en portent aucune. Des deux qui les portent, **les deux** ont une copie de doctrine divergente de la source depuis ma modification, et l'un l'était déjà de quatre jours (version 2.10.0 contre 2.11.0).
- **Le rouge du banc de recettes a été attribué à sa vraie cause**, et non à ma modification.
  - preuve : `oracles\hook-restitution.test.mjs` ne lit pas le fichier de doctrine (zéro occurrence) ; son dernier commit `63b3059` est un ancêtre de `a04fef5`, celui qui a livré la règle de numérotation — vérifié par `git merge-base --is-ancestor`.

## 5. Non traité — avec son motif

- **Le câblage de la règle d'héritage à l'ouverture d'une session produit** : *dépendance à une décision humaine* — c'est la première décision ci-dessus, et le choix entre signaler et réparer change le code écrit.
- **La recopie de la doctrine chez les deux produits qui la portent** : *bloqué par un garde-fou* — écrire chez un produit exige un mandat humain nommé, et aucun n'est déclaré dans cette session ; la règle d'héritage nomme déjà le geste, elle attend son exécutant.
- **Les quatre produits sans aucune pièce** : *dépendance à une décision humaine* — deuxième décision ci-dessus.
- **La correction du banc de recettes rouge** : *dépendance à une décision humaine* — troisième décision ci-dessus.
- **Les vingt-trois tâches du registre** : *hors mandat* — le mandat de ce tour portait sur la forme du bloc 3 et sur la redescente ; leur ordre d'exécution reste la décision que je vous ai posée au tour précédent et qui n'a pas été tranchée.
- **La reconstruction des deux tables d'anonymisation** : *hors mandat* — posée au tour précédent, non tranchée ; la boîte d'entrée reste fermée en attendant.

## 6. Écarts à la lettre

- **vous avez demandé** « b » — inscrire la forme en tableau comme forme par défaut → **j'ai fait** exactement cela, **sans ajouter de règle d'oracle** → **pourquoi** : c'est ce que l'option (b) disait — « les trois autres restant admises » —, et une règle binaire aurait refusé les trois autres, ce que la clause des quatre mises en page a corrigé le 24/08 précisément pour ne pas imposer une typographie. La contrepartie est nommée dans le texte : rien ne mesure que le défaut est suivi.
- **Correction d'une affirmation du tour précédent.** J'ai écrit « aucun contrôle ne signale qu'une copie a pris du retard sur sa source ». C'est **faux** : la règle d'héritage le fait, en mode copie identique, depuis le 24/08, et elle vient de le prouver sur le produit du dernier run. Le constat que je vous proposais de verser au registre n'a donc pas lieu d'être — le vrai constat est ailleurs, dans le moment de déclenchement, et c'est la première décision ci-dessus.
- Aucun autre écart.

## 7. Risques

- **La forme par défaut ne sera pas suivie, faute de contrôle qui la mesure.**
  - signal : une prochaine restitution, ici ou chez un produit, rend ses options en puces alors que le texte prescrit le tableau.
  - parade : acceptation déclarée — écrire une règle binaire reviendrait à refuser trois mises en page que la doctrine admet à bon droit ; ce qui change est que le défaut est désormais dérivable d'une source écrite, et non du goût d'une session.
- **Ma modification vient de faire passer au rouge les deux seuls produits qui portaient la doctrine à jour.**
  - signal : la règle d'héritage rendra échec sur eux au prochain lot ingéré, en nommant le fichier divergent.
  - parade : c'est le mécanisme voulu, et il est réversible d'une recopie ; mais tant que la première décision n'est pas rendue, ce rouge n'apparaîtra qu'au prochain lot, pas à l'ouverture de leur session.
- **Un produit peut rester des jours sans savoir qu'il travaille sans juge.**
  - signal : une session produit rend plusieurs messages de fin de tour sans structure et sans qu'aucun ne soit refusé — c'est le fait qui a fait naître la section « Portée » du référentiel, découvert cinq heures et onze décisions trop tard.
  - parade : la première décision, option (a) ou (b) ; en attendant, aucune.

## 8. Prochaines actions

Ordre de traitement : câbler le contrôle à l'ouverture vient en premier parce que c'est la seule action qui rende les suivantes **inutiles à répéter** — une fois le contrôle joué à chaque session, toute doctrine future redescend sans qu'on ait à y penser.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Câbler la règle d'héritage dans `oracles\hook-ouverture.mjs` selon la voie retenue — signaler seul, ou signaler et recopier — puis le prouver en ouvrant une session sur un produit dont la copie diverge. | `auto_ia` | `dependance_bloc_3` — attend la première décision ; le choix entre signaler et réparer change le code écrit. | Toute doctrine future reste dans le pilot, et la redescente continue de dépendre du trafic de retours de chaque produit. |
| 2 | `neuve` | Déposer chez les quatre produits sans pièce un lot de travaux décrivant les trois artefacts à installer, par le canal du pilot vers le produit. | `auto_ia` | `dependance_bloc_3` — attend la deuxième décision. | Quatre dépôts continuent de ressembler à des produits sans être jugés, et leurs messages de fin de tour ne sont ni contrôlés ni refusés. |
| 3 | `neuve` | Renuméroter les trois cas témoins de `oracles\hook-restitution.test.mjs` pour qu'ils portent un numéro de décision, puis rejouer `node oracles\hook-restitution.test.mjs`. | `auto_ia` | `dependance_bloc_3` — attend la troisième décision. | Un banc rouge en permanence, dans lequel la prochaine vraie régression passera inaperçue. |
| 4 | `neuve` | Recopier `gabarits\RESTITUTION.md` vers `forge\RESTITUTION.md` chez les deux produits qui le portent, puis rejouer `node oracles\oracle-conformite-projet.mjs <produit>` pour vérifier le passage au vert. | `manuelle_utilisateur` | `decision` — écrire chez un produit relève du produit, et le pilot nomme le geste sans l'exécuter ; un mandat de votre part lèverait cette réserve. | Les deux seuls produits sous doctrine restent sur une version périmée, et l'un d'eux l'est depuis le 26/08. |
| 5 | `neuve` | Trancher les trois décisions restées ouvertes au tour précédent : les tables d'anonymisation, les neuf dépôts frères, l'ordre d'exécution des tâches. | `manuelle_utilisateur` | `decision` — les trois portent des arbitrages de risque ou de priorité. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et vingt-trois tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Forme du bloc 3 et redescente aux produits - 20260830c.md`
- Référentiel modifié : `gabarits\RESTITUTION.md` — version 2.11.0 → **2.12.0**, section neuve sous la clause des quatre mises en page
- Contrôles exécutés : `oracles\oracle-synthese.mjs --self-test` (11/11) · `oracles\oracle-gabarits-documents.mjs` (PASS) · `oracles\oracle-conformite-projet.mjs` sur le produit du dernier run (FAIL R-47, remède nommé) · `oracles\hook-restitution.test.mjs` (rouge antérieur, cause attribuée)
- Référentiel d'héritage consulté : `gabarits\HERITAGE.json` version 1.5.0 du 25/08 — le texte de doctrine y est déclaré en mode copie identique depuis le 24/08
- Dépôt : `66c76d2`, arbre de travail non committé
