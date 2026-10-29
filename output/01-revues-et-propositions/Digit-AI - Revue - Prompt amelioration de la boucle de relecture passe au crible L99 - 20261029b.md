# Revue L99 du prompt « améliorer encore le score de la boucle de relecture »

Analyse faite le 29/10/2026 à 19:52, heure de Paris, sur le pilot `digit-ai-factory`, par la session pilote (Claude Opus 5.5), niveau L99, 8 couches.

Prompt analysé, cité mot pour mot :

> et qu'est-ce qu'on pourrait mettre en place pour améliorer encore ce score ? Des relecteurs qui ne seraient pas nouveaux, et reprendraient une relecture avec contexte ? Et / ou à chaque tour, un nouveau relecteur et un ancien relecteur ? Et / ou 3 ou 4 relecteurs plutôt que 2 ? Analyse et identifie les axes d'amélioration à mettre en place. Profite de ce cas pratique pour tester ce qui marche pour améliorer le score existant.

Contexte nécessaire pour le lire. « Ce score » est le score mesuré du prompt de stratégie de lancement des agents, revue `20261029a` du même jour : 40, 69, 72, 76 puis 78 sur 5 passes. Chaque passe était notée par 2 relecteurs neufs et aveugles, le score retenu était la plus basse des deux notes, et seul un défaut vu par les deux entrait dans la correction suivante. Le journal de ces 5 passes est `Digit-AI - Revue - Prompt strategie de lancement des agents passe au crible L99 - 20261029a.md.boucle.json`.

---

## Chapitre 1 — OODA : cadrage et étalon noté

Le prompt pose les bonnes questions, mais il confond deux choses : améliorer le prompt, et améliorer la note que les relecteurs lui donnent. Changer de relecteurs change l'instrument de mesure ; sans juge fixe, un score plus haut ne prouve plus rien. Il obtient 40 sur 100, plafonné par ce défaut bloquant.

**Observe.** Une question ouverte (« qu'est-ce qu'on pourrait mettre en place pour améliorer encore ce score ? »), trois pistes nommées (relecteurs avec contexte ; un nouveau et un ancien à chaque tour ; 3 ou 4 relecteurs au lieu de 2), deux verbes de livraison (« Analyse et identifie les axes ») et une demande d'expérience (« tester ce qui marche »). Aucun budget, aucun critère de réussite, aucune forme de livrable.

**Orient.** L'auteur est le porteur de la Factory. Il vient de voir les passes 4 et 5 ne rapporter que 6 points, contre 32 pour les passes 2 et 3, et cherche la cause du plafond. Le destinataire est la session pilote, qui a conduit les 5 passes et dispose de leur journal complet.

**Decide.** Trois stratégies :

1. Répondre par l'analyse seule, sans expérience. Rapide, mais la demande dit « tester ».
2. Tester les trois pistes nommées en les notant chacune par leur propre configuration de relecteurs. C'est la lecture littérale ; elle compare des scores pris avec des règles différentes.
3. Exploiter d'abord le journal existant, qui contient déjà 10 notes et 34 défauts, puis tester les variantes sur le prompt de la passe 5 en les faisant toutes noter par un même jury fixe.

**Act.** La stratégie 3. Elle répond aux trois pistes, sépare ce qui améliore le prompt de ce qui change la note, et commence par ce qui ne coûte rien.

**Étalon.** Le prompt idéal pour cette intention :

- distingue la qualité du prompt (ce qu'on veut améliorer) de la note (ce qu'on mesure), et fixe le juge avant de comparer ;
- part du journal des 5 passes, gratuit, avant toute nouvelle dépense ;
- teste les trois pistes nommées, et celles que le journal suggère, contre ce juge fixe ;
- borne la dépense en jetons et dit qui décide au-delà ;
- dit ce qui est livré : un constat chiffré, puis la règle changée dans le skill si une piste gagne ;
- fixe ce qui compte comme une amélioration : un gain plus grand que l'écart entre deux notes du même prompt.

Comment lire le tableau suivant : une ligne par dimension de la rubrique, la note obtenue et sa raison ; le total est le score de départ du chapitre 8.

| Dimension | Points | Note | Raison |
|---|---|---|---|
| Clarté de l'intention | 20 | 14 | l'intention est nette, mais « ce score » mêle qualité du prompt et note |
| Spécification | 20 | 7 | trois pistes nommées, aucune forme de livrable ni budget |
| Garde-fous et contraintes | 15 | 3 | rien sur le coût, ni sur la comparabilité des mesures |
| Ancrage et contexte | 15 | 11 | le cas pratique et son journal existent dans la même session |
| Vérifiabilité de la sortie | 15 | 3 | « ce qui marche » n'a pas de seuil |
| Robustesse | 15 | 6 | « améliorer ce score » se gagne en adoucissant le juge |
| **Total** | 100 | **44, plafonné à 40** | le défaut bloquant n° 1 plafonne le score à 40 |

---

## Chapitre 2 — Chainlogic : la chaîne implicite

Le prompt suppose : de meilleurs relecteurs donnent de meilleures notes, donc un meilleur prompt. Le premier maillon est vrai pour les défauts trouvés, faux pour la note.

- **Si** un relecteur garde le contexte des passes précédentes **alors** il vérifie mieux que les défauts sont fermés : vrai. Mais il juge aussi la progression, et tend à noter l'effort fourni plutôt que le prompt.
- **Si** on passe de 2 à 4 relecteurs **alors** on trouve plus de défauts : vrai. Mais avec la règle actuelle, le score retenu est le minimum des notes : plus de notes, minimum plus bas, sans que le prompt ait changé.
- **Donc** l'amélioration se mesure avec un jury fixe, séparé des relecteurs qui alimentent la correction. Le prompt ne fait pas cette séparation.

---

## Chapitre 3 — Blindspots : inventaire maître

Ce chapitre est la liste de référence des défauts ; chaque défaut bloquant ou majeur est fermé au chapitre 8.

Comment lire le tableau : une ligne par défaut, classée par sévérité puis par ordre d'apparition ; la colonne « Fermé par » renvoie à la partie du prompt réécrit qui le corrige.

| N° | Défaut | Sévérité | Fermé par |
|---|---|---|---|
| 1 | Mesure non comparable : chaque piste change le juge, donc la note ; un gain peut venir d'un juge plus doux | bloquant | Étape 1, jury fixe |
| 2 | Bruit de mesure ignoré : deux notes du même prompt diffèrent de 1 à 20 points dans le journal ; un gain plus petit que ce bruit n'est pas un gain | majeur | Étape 1, seuil de signification |
| 3 | Budget absent : une passe coûte environ 200 000 jetons, une expérience à 4 variantes peut dépasser 2 millions | majeur | Garde-fous, plafond de jetons |
| 4 | Le journal existant, gratuit, n'est pas exploité avant de dépenser | majeur | Étape 0 |
| 5 | La règle de retenue « vu par les deux » n'est pas citée comme piste, alors que le journal la désigne (voir chapitre 4) | majeur | Étape 0 et variante B |
| 6 | La qualité de la correction n'est pas citée : les corrections de l'auteur créent des défauts neufs | majeur | Étape 2, variante C |
| 7 | Livrable non défini : axes en prose, expérience chiffrée, règle changée dans le skill | majeur | Étape 4 |
| 8 | « tester ce qui marche » sans critère d'arrêt ni de choix | majeur | Contrat de sortie |
| 9 | Le relecteur « avec contexte » contredit la règle du skill « le juge n'est jamais l'auteur » sans dire comment la tenir | majeur | Variante C, rôles séparés |
| 10 | Longueur non surveillée : le prompt est passé de 681 à 1 537 mots en 5 passes | mineur | Étape 2, garde de longueur |
| 11 | Aucune date de revue de la règle qui sortira de l'expérience | mineur | Étape 4 |

---

## Chapitre 4 — Factcheck : ce que le journal dit déjà

Le prompt ne contient pas de prémisse fausse, mais il en suppose une : que le plafond vient du nombre ou de la fraîcheur des relecteurs. Le journal des 5 passes, relu à 19:52, montre une autre cause.

- **Défauts écartés** : 14 défauts vus par un seul relecteur ont été écartés sur les 5 passes. Le recompte à la source n'en a démenti qu'un (« todo/TODO.jsonl porterait 2 lignes d'une autre session »). Les 13 autres tenaient.
- **Défauts revenus** : plusieurs écartés sont revenus plus tard. « Le modèle optimise le plus long agent, pas la durée de bout en bout » et « D-47 (a) impose aussi une relecture par livrable », écartés à la passe 4, ont été retenus à la passe 5. « L'isolation de l'outil Agent ne copie que le dépôt de la session », vu par un seul relecteur à la passe 3 puis à la passe 5, n'a jamais été retenu.
- **Accord entre relecteurs** : écart de 20 points à la passe 1 (60 et 40), puis de 1 à 3 points ensuite.
- **Défauts créés par la correction** : la règle « durée marginale b inférieure à a », écrite à la passe 5 pour fermer un défaut de la passe 4, est elle-même un majeur retenu à la passe 5.

Conclusion remontée au chapitre 3 (défauts n° 5 et n° 6) : la règle « vu par les deux » retarde des défauts réels d'au moins une passe, et le recompte suffit à filtrer les faux. Ce constat est tiré d'un seul cas : il se vérifie par l'expérience, il ne se généralise pas tel quel.

Prémisse d'accès : le journal et les prompts des passes sont des fichiers locaux, lus à 19:52 ; aucune ressource distante.

---

## Chapitre 5 — Premortem : cinq façons d'échouer

Imaginons l'expérience faite et jugée inutile un mois plus tard. Voici les causes les plus probables.

1. **Un score gonflé par le juge.** Le relecteur avec contexte note 88 ; on adopte la piste ; à l'aveugle, le prompt vaut toujours 78. Mécanisme : ancrage sur la progression. Parade : toute variante est notée par le même jury aveugle.
2. **Un gain dans le bruit.** La variante gagne 2 points, on la déclare gagnante. Mécanisme : deux notes du même prompt diffèrent déjà de 3 points à la passe 5 (81 et 78). Parade : seuil de gain fixé avant, au-dessus de l'écart mesuré sur un même prompt.
3. **Une dépense sans plafond.** 4 variantes de 2 passes à 4 relecteurs, plus le jury : plusieurs millions de jetons. Parade : plafond écrit, et analyse gratuite du journal d'abord.
4. **La vraie cause non testée.** On teste les trois pistes nommées, pas la règle de retenue ni la qualité de la correction ; le plafond reste. Parade : variantes B et C ajoutées.
5. **Un constat qui ne change rien.** L'expérience conclut, mais le skill reste tel quel. Parade : la règle gagnante s'écrit dans `references/boucle.md`, avec sa recette et une date de revue.

---

## Chapitre 6 — Wargame : trois attaques

L'étalon résiste, mais l'expert du domaine rappelle une limite de fond : un seul cas pratique ne fonde pas une règle générale.

**L'utilisateur exigeant.** Il veut savoir quoi changer dans le skill, et combien de points cela rapporte. Le livrable doit finir sur une recommandation chiffrée, pas sur une liste d'idées.

**L'expert du domaine.** Trois points. Plus de relecteurs avec la règle « minimum des notes » fait baisser le score mécaniquement : il faut passer à la médiane si le nombre change. Un relecteur qui voit l'historique mesure la clôture, pas la qualité : il est utile pour vérifier qu'un défaut est fermé, pas pour noter. Un seul prompt, c'est un seul cas : la règle qui en sort part en avertissement, avec une revue datée après d'autres boucles.

**Le contradicteur.** Trois conformités paresseuses. Rendre une liste d'axes sans rien tester. Tester, mais noter chaque variante par sa propre configuration et conclure sur des scores non comparables. Ou annoncer « 4 relecteurs : +5 points » quand le gain vient du passage du minimum à la médiane.

**Lentille robustesse.** Le prompt réécrit lance des agents et modifie un skill réutilisé. Il entre en collision avec deux règles du skill : « le juge n'est jamais l'auteur » et le contrôle `oracle-boucle-l99.mjs`, dont les règles B2 et B5 supposent des relecteurs aveugles et la retenue à deux. Toute règle changée doit l'être aussi dans l'oracle et sa recette.

---

## Chapitre 7 — Deepthink : effets à l'échelle

La règle qui sortira s'appliquera à toutes les boucles L99, ouvertes d'office depuis le 29/10/2026. Trois effets.

- **Le coût par analyse.** Passer de 2 à 4 relecteurs double le coût de chaque passe, environ 400 000 jetons. À plusieurs analyses par jour, le seuil de 4 000 000 de jetons par jour des relectures se franchit vite.
- **La retenue à l'union.** Retenir tout défaut recompté, même vu par un seul, ferme les défauts une passe plus tôt. Mais la correction grossit plus vite : la garde de longueur de 15 % devient le vrai frein.
- **Le relecteur de clôture.** Un vérificateur avec contexte, qui dit seulement si chaque défaut est fermé et si la correction en crée un neuf, coûte peu et attaque la cause n° 6. Il peut servir hors de L99, à toute boucle de correction de la Factory.

---

## Chapitre 8 — Synthèse et prompt réécrit

Le prompt passe de 40 à 75 sur 100, score mesuré par des relecteurs indépendants en 4 passes. La boucle s'arrête sur une régression : la passe 4 vaut 75, la passe 3 valait 77. Quatre défauts majeurs restent ouverts ; ils sont nommés plus bas, et le prompt n'est pas présenté comme fini.

### Pourquoi la boucle a été ouverte, puis prolongée

Mode boucle ouvert d'office (**TF-2022** *(règle du skill du 29/10/2026 : relecture indépendante sans mot-clé dans trois cas)*) : l'analyse relève un défaut bloquant, et le prompt réécrit lance des agents puis modifie un skill réutilisé. Boucle prolongée après la passe 3 sous **TF-2024** *(extension jusqu'à 5 passes quand la dernière gagne au moins 3 points avec des défauts graves ouverts)* : la passe 3 gagnait 4 points et gardait 3 majeurs.

### Score

Comment lire le tableau : une ligne par passe ; le score retenu est la plus basse des deux notes, et seul un défaut vu par les deux relecteurs est retenu, après vérification dans les fichiers.

| Passe | Mots | Notes des 2 relecteurs | Score retenu | Gain | Majeurs retenus | Vus par un seul | Décision |
|---|---|---|---|---|---|---|---|
| 1 | 813 | 69 et 68 | 68 | — | 6 | 1 | continuer |
| 2 | 1 163 | 73 et 76 | 73 | +5 | 4 | 3 | continuer |
| 3 | 1 330 | 80 et 77 | 77 | +4 | 3 | 2 | continuer, extension à 5 |
| 4 | 1 448 | 75 et 77 | **75 (mesuré)** | −2 | 4 | 4 | arrêter : gain inférieur à 3 |

Le score de départ, 40, est celui de l'étalon du chapitre 1, plafonné par le défaut bloquant. Le journal des passes est à côté de cette revue, en `.boucle.json`, et l'oracle `oracle-boucle-l99.mjs` le juge PASS. Le prompt livré est celui de la passe 4, comme la règle d'arrêt l'impose ; celui de la passe 3, mieux noté de 2 points, est dans le journal.

### Ce que les deux boucles du jour montrent déjà

Votre question demandait ce qui ferait monter le score. Avant toute expérience, les 9 passes du jour (5 sur le prompt de stratégie, 4 sur celui-ci) donnent quatre constats. Ils viennent de deux prompts seulement : ce sont des hypothèses solides, pas encore des règles.

1. **La règle « vu par les deux » jette des défauts réels.** Sur la première boucle, 14 défauts vus par un seul relecteur ont été écartés et le recompte n'en a démenti qu'un. Dans les deux boucles, des défauts écartés sont revenus, vus par les deux, une passe plus tard : 2 dans la première, 2 dans la seconde. Chaque retour coûte une passe, environ 200 000 jetons. Piste : retenir tout défaut vu par au moins un relecteur s'il tient au recompte, qui filtre déjà les faux.
2. **La correction crée des défauts, et rien ne la vérifie.** La règle « b inférieur à a » de la première boucle et le devis à 4 correcteurs de cette boucle sont nés d'une correction et ont été retenus à la passe suivante. Ici, la passe 4 a régressé de 2 points. Pistes : un vérificateur avec contexte qui dit seulement si chaque défaut est fermé et si la correction en crée un neuf ; et une passe qui régresse est rejetée, on garde la précédente. La règle actuelle et son oracle imposent au contraire de livrer la dernière passe.
3. **Le seuil de gain est au niveau du bruit.** Les deux relecteurs d'une même passe s'écartent de 1 à 3 points sur 8 passes, et de 20 points à la passe 1 de la première boucle. Un gain de 3 points, le minimum actuel, est donc indiscernable du bruit. Piste : noter par la médiane d'un jury fixe et fixer le seuil au-dessus du bruit mesuré.
4. **Vos trois pistes, à leur place.** Un relecteur repris avec contexte s'ancre sur la progression : il sert à vérifier la clôture (point 2), pas à noter. Un nouveau et un ancien à chaque tour, c'est le même rôle, joué par un agent de plus. Passer à 3 ou 4 relecteurs double le coût d'une passe ; avec le score « le plus bas », plus de notes baissent mécaniquement le score. Ces pistes se testent après les points 1 et 2, qui ne coûtent presque rien.

Le prompt réécrit ci-dessous teste ces pistes contre un même jury, pour séparer ce qui améliore le prompt de ce qui change la note.

### Diagnostic

Bonne intuition : le plafond vient bien du dispositif de relecture. Mais le prompt d'origine testait le juge en même temps que le prompt, sans jury fixe ni seuil de bruit, et ignorait ce que le journal désignait déjà : la règle « vu par les deux » et les défauts créés par la correction.

### Majeurs ouverts à l'arrêt

Ces quatre défauts, vus par les deux relecteurs de la passe 4, restent dans le prompt livré. Celui qui l'exécute doit les trancher en premier :

1. **Devis faux** : A, B et C demandent 3 correcteurs, pas 4 ; 18 agents à environ 100 000 jetons font 1,8 million, pas 1,7. Correction proposée : recompter, donner un prix par rôle et la marge sous le plafond.
2. **Plafond et variantes E et D** : E et D font monter le total à environ 3 millions ; le contrat exige pourtant de rester sous 2 millions. Correction proposée : le plafond porte sur la base, A, B et C ; l'accord humain sur E et D fixe leur propre plafond.
3. **Dossier de l'expérience non situé** : s'il tombe dans le dossier temporaire interdit au jury, celui-ci ne peut plus lire le fichier jugé. Correction proposée : un dossier nommé sous `output/` du pilot.
4. **Champ `regle_de_retenue` dit neuf** : il existe déjà, en texte libre, dans les 5 passes du journal de la première boucle. Correction proposée : un champ distinct, ou une règle muette sur le texte libre, avec une fixture tirée d'un journal ancien.

### Prompt réécrit (passe 4, score mesuré 75)

```text
Objet : trouver ce qui ferait monter la qualité des prompts réécrits par la boucle L99 au-delà
du plafond observé le 29/10/2026, et le mettre en place dans le skill prompt-analyzer-l99.
Cas pratique : le prompt de stratégie de lancement des agents, revue
`output/01-revues-et-propositions/Digit-AI - Revue - Prompt strategie de lancement des agents passe au crible L99 - 20261029a.md`,
scores retenus 40, 69, 72, 76, 78 sur 5 passes, chacun le plus bas de 2 notes.

ENTRÉES, toutes dans le journal `<revue 20261029a>.md.boucle.json` :
- le texte du prompt de chaque passe : champ `passes[].texte` (passes 1 à 5) ;
- la consigne et la rubrique des relecteurs : champs `consigne_relecteur` et `rubrique_relecteur` ;
- les défauts de chaque passe, avec `statut` (retenu, ecarte), `vu_par` et leur recompte.
Copie ces trois entrées dans un dossier de l'expérience avant l'étape 1 : le jury s'en sert sans
les modifier.

PRINCIPE. On veut améliorer le PROMPT, pas la note. Toute variante est notée par un jury de même
configuration, fixée avant l'expérience : 3 agents NEUFS par prompt jugé (la base, puis chaque
variante), même modèle, même effort, même consigne ; aucun juré ne lit deux prompts ; score du
jury = médiane des 3 notes.
Consigne du jury : `consigne_relecteur`, avec ces changements et eux seuls :
- le chemin « …\prompt-pN.md (le prompt de la passe N, champ passes[].texte) » devient le chemin du
  prompt jugé ;
- le chemin de la rubrique devient celui de sa copie dans le dossier de l'expérience ;
- l'interdit « « prompt-p » autre que prompt-p1.md » devient « tout autre prompt que le fichier
  jugé » ;
- une ligne d'interdits s'ajoute : le dossier de l'expérience, sauf le fichier jugé et la rubrique,
  et le dossier temporaire de la session d'origine
  `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\c99958e9-5fa3-4254-8894-59d90c6dce0c\`.
Écris une consigne instanciée par prompt jugé, avant l'étape 1. Les relecteurs qui
alimentent la correction sont distincts du jury. Chaque correction est écrite par un agent neuf
(même modèle, même effort), qui reçoit le prompt de la passe 5 et les seuls défauts retenus de sa
variante, et rend un fichier par variante (`variante-A.md`…).

ÉTAPE 0 — CE QUE LE JOURNAL DIT DÉJÀ (lecture seule, sans dépense).
Rends, chacun avec sa commande :
- les défauts écartés (`statut` ecarte), combien le recompte a démentis ;
- l'écart entre les deux notes de chaque passe (`scores_relecteurs`) ;
- les défauts créés par la correction : pour chaque défaut retenu à la passe de champ `n`, coupe
  sa citation sur « [...] », normalise les blancs, et cherche chaque fragment dans le texte de la
  passe `n` et dans celui de la passe `n` - 1. Créé par la correction = tous les fragments présents
  en `n`, au moins un absent en `n` - 1. Une citation introuvable dans sa propre passe est classée
  à part, « non classée », et comptée ;
- les défauts écartés qui reviennent à une passe suivante : appariement fait à la main, liste
  fournie et déclarée comme jugement ;
- la croissance du prompt en mots.
Puis le DEVIS, à environ 100 000 jetons par relecteur (mesure du 29/10/2026), recompté sur le
plan réel. Estimation : la base et les variantes A, B et C demandent 14 relecteurs (3 jurés pour la
base, 2 relecteurs partagés, 9 jurés), plus 4 correcteurs et 1 vérificateur, soit environ
1,7 million de jetons ; E et D demandent chacune environ 600 000 jetons de plus (relecteurs propres,
3 jurés, 1 correcteur). Joue la base, A, B et C sous le plafond ; E et D ne se jouent qu'après
l'accord de l'humain, à qui tu poses la suite avec le devis recompté et les résultats de A, B et C.

ÉTAPE 1 — LA BASE ET LE BRUIT.
Fais noter le prompt de la passe 5 par le jury. Sa médiane est la base M0. Le bruit est l'écart
maximal entre ces 3 notes et les 2 notes de la passe 5 (81 et 78). Une variante « marche » si sa
médiane de jury dépasse M0 d'au moins max(bruit, 3 points). Le score 78 reste affiché pour
information, jamais comme base.

ÉTAPE 2 — LES VARIANTES, une passe de correction chacune, toutes à partir du prompt de la passe 5,
dans cet ordre : A, B, C, E, D. Pour économiser, A, B et C partagent les mêmes 2 relecteurs neufs ;
E ajoute 2 relecteurs à ces 2.
- A, témoin : retenue « vu par les deux » (règle actuelle).
- B, union recomptée : tout défaut vu par au moins un relecteur est retenu s'il tient au recompte.
- C, clôture vérifiée : C reprend `variante-B.md`. Un vérificateur AVEC contexte lit les défauts
  retenus de B et ce fichier (pas l'analyse), et dit pour chaque défaut s'il est fermé et si la
  correction en crée un neuf ; il ne note pas. Un correcteur neuf, même modèle et même effort,
  applique ses seuls signalements, une fois, et rend `variante-C.md`, que le jury note.
- E, quatre relecteurs : les 4 relecteurs, retenue comme B.
- D, ancien et nouveau, en reprise simulée, retenue comme B : un relecteur neuf, et un relecteur
  qui reçoit en contexte le prompt de la passe 4 et les défauts graves de la passe 4 dont `vu_par`
  contient 1, puis juge le prompt de la passe 5. Le journal ne garde ni identifiant d'agent, ni
  note, ni mineurs : une vraie reprise est impossible depuis une autre session, la reprise ne voit
  qu'une partie de ce que le relecteur avait rendu, et le tableau le dit.
Garde de longueur : une correction qui grossit de plus de 15 % sans fermer de majeur est rejetée.
Jetons : somme des usages rendus par chaque agent, attribuée à sa variante ; les relecteurs
partagés sont comptés une fois, à part.

ÉTAPE 3 — LECTURE DES RÉSULTATS.
Pour chaque variante : médiane du jury, gain sur M0, défauts graves restants selon le jury,
jetons, mots. Une variante gagne si son gain dépasse le seuil de l'étape 1 ; à gain égal, la
moins chère gagne. Un seul cas pratique ne fonde pas une règle : dis-le.

ÉTAPE 4 — MISE EN PLACE.
- Si une variante gagne, écris-la dans `references/boucle.md` du skill prompt-analyzer-l99 de
  digit-ai-forge-agents, avec les champs neufs du journal (`jury` : notes et médiane ;
  `regle_de_retenue` : intersection ou union_recomptee ; rôle `verificateur_cloture`).
  Dans `scripts/oracle-boucle-l99.mjs` : B, E → une règle neuve qui vérifie `vu_par` et le recompte
  selon `regle_de_retenue` ; C → B2 admet un vérificateur non aveugle qui ne note pas ; D → B2
  admet un relecteur repris. L'oracle n'a pas de niveau d'avertissement : crée-le (statut AVERT,
  sortie 0) si la règle part en avertissement, avec une fixture qui le prouve. Dis si le lien
  avec `oracle-judge --lecteur-vise`, cité par `boucle.md`, est rompu ou suivi.
  Recette, publication, copies installées des deux profils du poste (`~\.claude` et
  `~\.claude-b`) ; revue datée après 5 boucles réelles.
- Sinon : écris le constat négatif, et ne change pas le skill.
- Dans les deux cas : inscris le sujet au registre par `node todo/journaliser.mjs`, et écris une
  étude nommée selon R-4 et R-25 du pilot :
  `Digit-AI - Etude - Amelioration de la boucle de relecture L99 - 20261029<indice>.md` dans
  `output/03-etudes/`, indice par `node scripts/allouer-indice.mjs`.

GARDE-FOUS.
- Plafond : 2 000 000 de jetons pour les étapes 1 à 3. Au-delà, ou si le devis le dépasse, arrête
  et pose la suite à l'humain avec le coût mesuré.
- Ne modifie ni la revue 20261029a ni son journal : l'expérience vit dans ses propres fichiers.
- Toute nouvelle règle respecte « le juge n'est jamais l'auteur » : un relecteur avec contexte
  vérifie la clôture, il ne note jamais.
- Commits limités à tes chemins (`git commit --only -- <chemins>`), publication sous R-38 §6,
  envoi vérifié par `git rev-list --left-right --count HEAD...@{u}`.

CONTRAT DE SORTIE — chaque point avec sa preuve exécutée :
1. l'étape 0 rend ses chiffres, avec la commande qui les a tirés du journal, et le devis ;
2. M0 et le bruit sont chiffrés à partir des 5 notes du prompt de la passe 5 ;
3. chaque variante jouée porte sa médiane de jury, son gain sur M0, ses défauts graves restants,
   ses jetons et ses mots, dans un même tableau ;
4. la conclusion nomme la variante gagnante ou dit qu'aucune ne dépasse le seuil ;
5. si une variante gagne : `references/boucle.md`, l'oracle et sa recette sont changés, la recette
   sort en 0, forge-agents est publié, les deux copies installées sont alignées ;
6. le registre porte le sujet, `node todo/oracle-todo.mjs` sort en 0 ;
7. l'étude porte un nom conforme à R-4 et R-25 ;
8. les jetons dépensés sont sous le plafond ; E et D sont jouées après accord, ou posées à l'humain avec le devis recompté.
```

### Contrat de sortie

Le contrat est dans le prompt, en 8 points. Il porte le chiffrage du journal, le bruit de mesure, le tableau des variantes, la conclusion, la mise en place conditionnelle, le registre, le nom de l'étude selon **R-4** *(règle du pilot : le nom du projet ouvre le nom du fichier)* et **R-25** *(règle du pilot : le type, pris au registre des types, est le premier mot du deuxième segment)*, et le plafond de jetons.

### Protocole de tests du livrable

Le livrable mêle des mesures, une règle et du code ; chaque partie a son oracle.

- **Mesures** : chaque chiffre de l'étape 0 se recalcule par une commande sur le journal ; chaque note de jury a sa sortie JSON conservée.
- **Code (oracle de la boucle)** : `node scripts/oracle-boucle-l99.mjs --self-test`, avec un cas vert et un cas rouge par règle changée.
- **Document (étude)** : sections nommées, chiffres sourcés, oracle de lisibilité Markdown du socle.
- **Boucle bornée** : 3 itérations au plus sur l'oracle et l'étude ; après 3 échecs, livrer avec la liste des écarts restants.

### Changelog

Comment lire la liste : chaque ajout renvoie au défaut du chapitre 3 ou à la cause du chapitre 5 qu'il ferme.

- Jury fixe, médiane, distinct des relecteurs de correction : défaut n° 1, cause n° 1.
- Bruit mesuré sur 5 notes du même prompt et seuil de gain : défaut n° 2, cause n° 2.
- Plafond de 2 000 000 de jetons, étape 0 gratuite d'abord : défauts n° 3 et n° 4, cause n° 3.
- Variantes B (union recomptée) et C (clôture vérifiée) : défauts n° 5, n° 6 et n° 9, cause n° 4.
- Variantes D et E, les pistes de l'auteur : conservées, notées comme les autres.
- Mise en place dans `boucle.md`, l'oracle et sa recette, avec revue datée : défauts n° 7 et n° 11, cause n° 5.
- Garde de longueur : défaut n° 10.
- Entrées versées au journal de la première boucle, base mesurée par le jury, devis et ordre des variantes, reprise simulée dite, champs de l'oracle nommés : passe 1.
- Jury neuf par prompt jugé, consigne instanciée, variantes E et D après accord : passe 2.
- Liste fermée des changements de consigne, découpage des citations, correcteur de la variante C : passe 3.

### Écarts à la lettre

Comment lire le tableau : une ligne par endroit où le prompt réécrit s'écarte de votre texte ; tous relèvent de la manière d'exécuter, aucun n'ajoute de contenu visible à un livrable que vous n'avez pas demandé.

| Vous avez écrit | Je propose | Pourquoi | Catégorie |
|---|---|---|---|
| « améliorer encore ce score » | améliorer le prompt, mesuré par un jury fixe | sans juge fixe, une note plus haute ne prouve rien (chapitre 1) | Manière d'exécuter |
| « des relecteurs qui […] reprendraient une relecture avec contexte » | un vérificateur avec contexte qui juge la clôture et ne note pas (variante C), et la piste telle quelle (variante D) | règle du skill « le juge n'est jamais l'auteur » | Manière d'exécuter |
| « 3 ou 4 relecteurs plutôt que 2 » | 4 relecteurs (variante E), et un jury de 3 pour tout noter | un seul nombre testé limite la dépense ; 3 au jury pour une médiane | Manière d'exécuter |
| (rien sur le budget) | plafond de 2 000 000 de jetons, puis question à l'humain | la décision D-92 du 29/10/2026 a posé une dépense de 2 millions à l'humain | Manière d'exécuter |
| (pistes non nommées) | variantes B et C ajoutées | le journal les désigne (chapitre 4) ; un exemple de la demande illustre, il ne borne pas | Manière d'exécuter |
