# Retours forges — bourse-aux-vacants — 20260814c

- **Contexte** : lecture du dashboard v3 (livré cet après-midi, TF-0185) par l'humain
  destinataire. Deux propositions de RT-12 y sont **déjà appliquées** — voir les confirmations.
  Le constat qui suit porte sur ce que ce dashboard rend maintenant visible : la part du rapport
  qui ne parle pas du produit.
- **Références ledger** : `forge\ledger.jsonl` seq 114
- **Lots précédents** : `RETOURS-20260814a.md` et `…b.md`, remis et donc immuables.
- **Statut** : a_remettre

---

## forge-tests (`digit-ai-forge-tests`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-16 | **bloquant** | **Un pan qui a échoué sa précondition émet quand même des constats sur le PRODUIT.** Le pan `qualif` n'a jamais franchi l'authentification — il l'a lui-même consigné : `erreur console : Failed to load resource: 401 (UNAUTHORIZED)` sur **les six** routes. Il a donc photographié l'écran de connexion six fois, et en a tiré **13 findings** : 6 `route-en-defaut` (« marqueur de contenu absent »… parce que la page n'est pas celle qu'il croit), 6 `affordance-sans-effet` citant **mot pour mot le même** texte de formulaire de connexion, et 1 `seuil:qualif` qui n'est que leur somme. Tous portent le **même risque, 27**, ce qui les fait remonter en bloc dans le classement. Sur 33 findings au rapport, **13 (39 %) viennent de ce seul angle mort**. Le pan `api` sait faire l'inverse dans la même situation : inventaire VIDE, « surface non énumérable », zéro constat produit. C'est le bon comportement — `qualif` devrait l'adopter. | Une **garde de précondition** : si le pan ne peut pas établir l'état qu'il exige (ici : une session authentifiée), il déclare son inventaire **non mesurable** avec son motif, et n'émet **aucun** constat produit. Un pan aveugle qui se tait est utile ; un pan aveugle qui accuse coûte un audit entier à démentir. |
| RT-17 | majeur | **Treize findings pour un seul défaut : rien ne les regroupe par cause.** Les 13 ci-dessus partagent une cause unique et le rapport les présente comme 13 défauts indépendants — le dashboard affiche « KO · 13 » là où il y a **un** problème, côté auditeur. Effet mesuré sur ce projet : le classement par risque est saturé par des occurrences d'une même cause (13 × risque 27), et chaque élément en défaut engendre en outre **4 cas dérivés**, soit 52 propositions issues d'un seul angle mort. Un lecteur qui trie par risque voit donc d'abord ce qui ne concerne pas son produit. | Regrouper par cause racine : **un** finding, N occurrences énumérées, un risque porté une fois. La clé de regroupement est déjà dans les données — les 6 constats `affordance-sans-effet` ont un message identique au caractère près, et les 6 `route-en-defaut` partagent le même code console. |
| RT-18 | majeur | **Un constat réfuté par le projet revient à chaque audit, indéfiniment.** RT-1 et RT-2 ont été remis le 13/08 ; les 13 findings correspondants sont revenus identiques les 14/08 (six audits successifs). Rien ne permet au projet de déclarer, une fois, « ce constat est contesté, voici la contre-preuve », et rien ne permet à l'auditeur d'en tenir compte. Ce projet tient donc sa propre déclaration à côté (`forge/constats-contestes.jsonl`, 14 lignes, chacune avec le test qui établit le contraire), mais elle est invisible au rapport. **C'est le troisième retour de la même famille** : RT-13 demandait un mécanisme d'adoption pour les cas dérivés, RT-15 un état « bloqué par configuration » pour les mutants de code supplanté. Trois fois le même manque : le projet n'a aucun moyen de dire quelque chose que l'auditeur retient. | Un canal de déclaration lu par l'auditeur, avec **exigence de contre-preuve** — un constat contesté sans test à l'appui reste au rapport. Le finding passerait à `contesté` avec le chemin du test en regard, comptabilisé à part plutôt que supprimé : la mesure reste opposable, et la contestation aussi, puisqu'un relecteur peut l'attaquer. Un seul mécanisme couvrirait RT-13, RT-15 et RT-18. |

## Confirmations positives

- **RT-12 est appliqué, et vite.** Le dashboard v3 affiche désormais « **Proposition (non
  adoptée)** » sur les cas dérivés — le « Non joué » qui avait fait trébucher le lecteur a
  disparu — et la colonne « CONSTAT MESURÉ — POURQUOI » remonte le contexte de l'écran, `401`
  compris, là où il fallait aller le chercher deux sous-chapitres plus loin. C'est exactement ce
  que le retour demandait, sur les deux points.
- **La colonne « OBJECTIF DU TEST » répond à un besoin qui n'avait pas été formulé.** Elle dit
  ce que le test cherche à établir (« vérifier que ce formulaire est câblé : sa soumission doit
  produire un effet observable ») avant de dire ce qui a été mesuré. Sur un constat faux, c'est
  ce qui permet de voir tout de suite que l'objectif est légitime et que c'est la mesure qui a
  dévié — distinction qu'aucune autre colonne ne portait.
- **Le passage en état KO d'un élément qu'un finding nomme est juste.** L'ancien « Non joué »
  masquait un constat mesuré derrière un état d'attente. Le nouvel affichage est plus dur à lire
  pour le projet, et c'est bien : il ne laisse pas un défaut se déguiser en tâche à faire.

## Ordre recommandé

1. **RT-16** — il supprime 13 des 33 findings à la source, et rétablit ce que le pan sait déjà :
   qu'il n'a rien vu. Le pan `api` fournit le modèle de comportement.
2. **RT-17** — sans regroupement, le classement par risque reste inexploitable dès qu'une cause
   se répète.
3. **RT-18** — le plus structurant, et à instruire avec RT-13 et RT-15 : un seul mécanisme de
   déclaration projet → auditeur les couvre tous les trois.
