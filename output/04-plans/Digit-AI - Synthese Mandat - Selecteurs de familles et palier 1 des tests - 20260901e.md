---
destinataire: humain
---

# Synthèse de mandat — les sélecteurs de familles, et le premier palier de la stratégie de tests

Le message de fin de tour que vous receviez mélangeait deux listes numérotées, et vous venez
d'en payer le prix : le numéro que vous donniez pour désigner une action a été lu comme une
décision. Les deux listes portent maintenant des étiquettes distinctes, et un contrôle refuse
désormais les numéros qui ne disent pas à laquelle des deux ils appartiennent. En amont, la
cause pour laquelle les évolutions récentes de la mise en forme n'arrivaient jamais jusqu'à
l'écran a été trouvée et corrigée. Le premier palier de la stratégie de tests est écrit, mesuré
et livré, mais il reste éteint tant qu'une vérification n'a pas été jouée sur un vrai projet.
Deux choix vous attendent, et rien d'autre.

## 1. En-tête

Mandat de session · pilot digit-ai-factory et forge digit-ai-forge-tests · terminé le
2026-09-01 à 11h40 (Europe/Paris) · durée 1 h 10 · agent pilot, commits 5a1495a et 4672f7a.

## 2. Verdict

Trois chantiers tenus : 81/81 recettes vertes au pilot, 13/13 au banc de l'oracle de forme
(11 avant), 1 179 tests verts à la forge de tests dont 6 neufs, et le surcoût fixe par mutant
mesuré à 0,386 s contre un seuil d'abandon posé à 10 s.

## 3. Décisions attendues

Le premier palier de la stratégie de tests est écrit et mesuré ; l'étude qui l'a fait naître
lui oppose une condition qu'aucune machine de ce poste ne peut satisfaire — la campagne
accélérée doit rendre exactement la même liste de survivants que la campagne complète, ce qui
demande un projet réel. Par ailleurs, le texte de doctrine que les produits embarquent a cinq
versions de retard, et rien ne le leur dira tant qu'ils ne remettront pas de lot.

> **D-34 — Le rejeu ciblé des tests doit-il rester éteint jusqu'à sa vérification, ou passer par défaut tout de suite ?**
> Le rejeu ciblé consiste à ne relancer, pour chaque altération de code testée, que les tests
> qui touchent la ligne altérée, au lieu de la suite entière. Il divise le poste le plus lourd
> d'une campagne d'audit par un facteur mesuré à plusieurs dizaines. La contrepartie est qu'un
> défaut de sélection ne se voit pas : il rend un vert au lieu d'un rouge, ce qui est la seule
> erreur qu'un banc de tests ne doit jamais faire.
> **Recommandation : (a).** Source consultée : le fichier d'étude
> output/03-etudes/20260901-etude-opportunite-strategie-tests.md, qui pose la condition de
> non-perte comme opposable à chaque palier et interdit qu'un palier tienne sa cible en
> réduisant ce qui est mesuré. Le gain est réel et il attendra une campagne : il ne se perd pas.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** rester éteint, et jouer la vérification au prochain audit d'un projet réel | une campagne d'audit à jouer deux fois, complexité simple × durée courte | exclut tout gain de durée d'ici là |
| **(b)** passer par défaut maintenant | gratuit à poser, et le risque d'un vert imprévu non détecté | exclut de pouvoir attribuer un futur écart de verdict à autre chose |
| **(c)** retirer le palier et attendre la parallélisation | l'effort déjà consenti, complexité moyenne × durée moyenne | exclut la correction de la cause, et fige le coût unitaire |

> **Si rien n'est décidé** : (a) s'applique — le rejeu ciblé reste derrière son drapeau, la
> campagne garde sa durée actuelle, et le sujet revient au prochain audit.

> **D-35 — Comment le texte de doctrine à jour arrive-t-il chez les produits qui en portent une version périmée ?**
> Le fichier de doctrine que chaque produit embarque pour savoir quelle forme donner à ses
> messages de fin de tour a cinq versions de retard sur les trois produits instanciés du poste.
> Le contrôle qui compare les deux ne se joue qu'au moment où un produit remet un lot de
> retours : un produit qui travaille sans rien remettre ne l'apprend jamais, et c'est
> exactement celui qui en aurait le plus besoin.
> **Recommandation : (b).** Source consultée : le référentiel d'héritage
> gabarits/HERITAGE.json, qui déclare ce fichier en copie conforme, et l'oracle de portée
> oracles/oracle-portee-doctrine.mjs, qui déclare lui-même ne pas juger la fraîcheur des
> pièces. Le pilot n'écrit jamais chez un produit : les trois options passent par le produit.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** un mandat de mise à jour demandé à chacun des trois produits | trois runs courts à ouvrir, complexité simple × durée courte | exclut de traiter le prochain produit qui prendra du retard |
| **(b)** un contrôle de fraîcheur à l'ouverture de session du produit, joué par le mécanisme déjà installé chez lui | complexité moyenne × durée courte, et un avertissement de plus à l'ouverture | exclut le silence : un produit périmé le saura avant son premier message |
| **(c)** ne rien faire | gratuit | exclut la comparaison de deux messages entre eux, et fait relire un écart de forme comme un écart de version |

> **Si rien n'est décidé** : (c) s'applique — les produits continuent de rendre leurs messages
> dans une forme de cinq versions antérieure à la vôtre.

## 4. Traité — avec sa preuve

- Le texte que l'agent lit pour corriger un message refusé portait la doctrine du 20 août alors
  que le référentiel en était à sa dixième version postérieure ; il porte désormais la forme du
  jour, ainsi que la ligne affichée à chaque ouverture de session.
  - preuve : la chaîne fautive n'avait plus changé depuis le commit 6d45638 du 20 août, quand le
    référentiel de forme changeait dix fois ; les deux fichiers passent la batterie du pilot.
- Le sélecteur d'une action est né, celui d'une décision se durcit : deux listes numérotées ne
  partagent plus leur numérotation, et le numéro nu est refusé des deux côtés.
  - preuve : le banc de l'oracle de forme rend 13/13, contre 11/11 avant, avec deux fixtures
    neuves — deux actions portant le même sélecteur échouent, une décision numérotée sans sa
    famille échoue.
- Les deux contrôles voisins qui se seraient contredits ont reçu leur exception, exactement
  comme le 30 août pour le sélecteur de décision.
  - preuve : la règle qui exige un identifiant de registre retire le sélecteur avant de le
    chercher, celle qui traque les codes non expliqués ne dénonce plus les sélecteurs ; batterie
    du pilot 81/81, aucun cas perdu.
- La mesure que l'étude de la stratégie de tests déclarait manquante est jouée : le coût fixe
  d'un rejeu, avant tout test, vaut 0,386 s.
  - preuve : trois répétitions (0,361 · 0,386 · 0,414) sur une suite de 1 174 tests, mêmes
    options que le code d'audit, code de sortie 0 ; seuil d'abandon de l'étude à 10 s.
- Le rejeu ciblé par ligne altérée est implémenté à la forge de tests, derrière un drapeau
  absent par défaut, avec deux replis conservateurs vers la suite entière.
  - preuve : 6 tests neufs verts, et le banc rouge joué à la main — 4 d'entre eux tombent quand
    l'implémentation est cassée volontairement ; suite entière 1 179 verts.

## 5. Non traité — avec son motif

- La condition de non-perte de l'étude, qui compare les deux campagnes : motif — impossible à
  prouver ici, l'outil de couverture est absent de l'environnement de la forge et le banc
  d'essai n'a pas d'environnement installé. Déclarée au rapport de l'adaptateur plutôt que
  supposée tenue.
- Les paliers suivants de l'étude — cache de verdicts, sélection d'impact, parallélisation,
  distribution : motif — hors du mandat du jour, qui portait sur l'enclenchement ; l'étude les
  ordonne après le premier.
- Le test rouge trouvé à la forge de tests, dont la référence externe a durci sa règle : motif —
  hors mandat, consigné au registre avec sa cause.
- La mise à jour du texte de doctrine chez les trois produits : motif — bloqué par un garde-fou,
  le pilot n'écrit jamais chez un produit ; c'est l'objet de la seconde décision ci-dessus.

## 6. Écarts à la lettre

- Vous avez demandé de revoir la numérotation des actions avec des étiquettes. → J'ai aussi
  durci la règle des décisions, qui acceptait jusqu'ici le numéro nu. → Sans cela, la moitié du
  défaut restait ouverte : c'est le numéro sans famille qui rend les deux listes confusibles, et
  le corriger d'un seul côté aurait laissé l'autre le reproduire.
- Vous avez demandé d'enclencher l'implémentation de la stratégie de tests. → J'ai livré la
  mesure préalable et le premier palier, éteint par défaut. → L'étude conditionne l'activation à
  une comparaison que ce poste ne peut pas jouer ; l'allumer sans elle aurait été une promesse,
  pas une preuve.

## 7. Risques

- Le rejeu ciblé pourrait rendre un vert là où la campagne complète voyait un rouge, si la carte
  des tests par ligne était incomplète.
  - signal : la campagne complète, jouée périodiquement, nomme un survivant que la campagne
    accélérée n'avait pas listé.
  - parade : le drapeau est absent par défaut, les deux replis renvoient à la suite entière dès
    que la carte manque, et le rapport publie que la vérification n'a pas été jouée.
- Le durcissement du contrôle des décisions peut faire échouer d'anciens messages conformes à
  la règle d'hier, sur les projets qui rejouent l'oracle sur un historique.
  - signal : un avertissement sur un document non modifié depuis avant ce jour.
  - parade : la règle entre en avertissante et jamais en bloquante, elle ne réécrit rien ; la
    montée en version est datée au référentiel.
- Les produits restés en version antérieure vont continuer de rendre une forme différente de
  celle du pilot, et l'écart se relira comme un écart de version.
  - signal : deux messages du même jour, sur deux dépôts, dont les blocs de décision ne se
    ressemblent pas.
  - parade : c'est l'objet de la seconde décision ; sans elle, le repli déclaré s'applique.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, chacune ouverte par son étiquette ; l'acteur
dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne dit
ce que coûte l'attente. **Ordre de traitement** : le tri des candidats d'abord, parce qu'il
conditionne les deux décisions du jour et qu'il est le moins cher ; puis les décisions par coût
d'attente décroissant.

| Action | Identifiant | Quoi | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| **A-1** | TF-0745, TF-0746, TF-0747, TF-0748 | Trier les quatre candidats entrés aujourd'hui au registre : la doctrine dictée à l'envers, le texte périmé chez les produits, le test rouge de la forge de tests, le premier palier livré éteint. Le registre se lit dans todo/TODO.md. | manuelle_utilisateur | decision — tout entre en candidat par construction, la décision de prise est humaine. | Quatre constats mesurés restent sans suite, et le premier palier reste sans porteur au registre. |
| **A-2** | neuve | Trancher la première décision ci-dessus, puis, si l'option (a) est retenue, jouer la campagne d'audit deux fois sur un projet réel — une fois telle quelle, une fois avec `FORGE_TESTS_MUTATION_CIBLAGE=1` — et comparer les deux listes de survivants du rapport. | manuelle_utilisateur puis auto_ia | decision puis dependance_bloc_3 — la seconde moitié attend la première. | Le rejeu ciblé reste éteint, et la campagne d'audit garde sa durée d'aujourd'hui. |
| **A-3** | neuve | Trancher la seconde décision ci-dessus, puis poser le contrôle retenu, soit dans `oracles/hook-ouverture.mjs` pour l'option (b), soit par un mandat ouvert chez chacun des trois produits pour l'option (a). | manuelle_utilisateur puis auto_ia | decision puis dependance_bloc_3. | Les trois produits continuent de rendre leurs messages dans une forme antérieure de cinq versions. |
| **A-4** | TF-0747 | Reprendre la garde du masquage dans la page d'essai de la forge de tests, puis rejouer sa suite entière par la commande pytest tests -q dans le dépôt digit-ai-forge-tests. | auto_ia | hors_mandat — du ressort de l'IA, mais d'un mandat propre à la forge de tests, que celui du jour ne couvre pas. | La suite de la forge de tests reste rouge à son premier échec, et toute mesure de durée entière y est invalide. |
| **A-5** | neuve | Publier les deux commits du jour sur leurs dépôts distants : `git push` dans `c:/dev/digit-ai-factory`, puis dans `c:/dev/digit-ai-forge-tests`. | manuelle_utilisateur | decision — la publication est un geste humain, aucune tentative n'a été faite. | Le travail du jour reste sur ce poste, et les autres projets n'en bénéficient pas. |
| **A-6** | neuve | Trancher les quatre décisions ouvertes d'hier et d'avant-hier : leurs tableaux d'options sont dans `output/04-plans/Digit-AI - Synthese Mandat - Retours pris et propagation mesurable - 20260901a.md`. | manuelle_utilisateur | decision — arbitrages restés ouverts, leurs replis s'appliquent depuis. | Les portes restées fermées le restent, et la demande d'étude d'un produit reste sans réponse. |

## 9. Traces

- Cette synthèse : output/04-plans/Digit-AI - Synthese Mandat - Selecteurs de familles et palier 1 des tests - 20260901e.md
- Commits : 5a1495a au pilot · 4672f7a à la forge de tests — locaux, non publiés
- Référentiel de forme : gabarits/RESTITUTION.md version 2.15.0
- Juges de forme : oracles/oracle-synthese.mjs · oracles/hook-restitution.mjs · oracles/hook-ouverture.mjs
- Registre : todo/TODO.jsonl — TF-0745 à TF-0748 créés, 32 actifs
- Bancs : oracles/self-tests.mjs 81/81 · oracles/oracle-synthese.mjs en autotest 13/13 · oracles/hook-restitution.test.mjs 7/7
- Forge de tests : forge_tests/adaptateurs/mutation.py · tests/test_palier1_ciblage_mutation.py
- Étude d'origine : output/03-etudes/20260901-etude-opportunite-strategie-tests.md
