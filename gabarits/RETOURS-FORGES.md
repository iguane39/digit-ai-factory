# Retours forges — <produit> — <AAAAMMJJ><indice>

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Emplacement : forge\retours\<projet> - RETOURS - <AAAAMMJJ><indice>.md dans le projet.
     Le PRÉFIXE PROJET est obligatoire (décision humaine 13/08) : côté pilot, les lots de
     tous les projets cohabitent dans input\00-retours\ — le nom dit qui retourne quoi.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : <clôture du run <run-id> | inspection production v<X> | incident | autre>
- **Références ledger** : `forge\ledger.jsonl` seq <n, n…> (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "<ce fichier>.md"
> ```
>
> Il rend **0** si la forme du lot est tenue, **1** sinon — et il dit alors ce qui manque *et le
> geste qui répare*. C'est **exactement le contrôle** que la porte du pilot joue à l'ingestion :
> le même module, importé des deux côtés. Un lot qui passe ici passe là-bas.
>
> **Pourquoi ce paragraphe existe** (TF-0582, 24/08/2026). En une seule journée, **six** lots ont
> dû être admis par dérogation, tous pour les mêmes deux sections absentes. La cause a été
> cherchée jusqu'aux trois produits émetteurs et elle est **triple** : l'un n'avait jamais reçu ce
> gabarit, l'autre n'avait jamais été instancié — et le troisième l'avait **à jour, recopié le
> matin même**, et a écrit son lot huit heures plus tard sans les sections. Ce troisième cas est
> le plus fréquent (quatre lots sur six) et le seul qu'aucune recopie ne répare : la règle était
> écrite en **prose** ici, et jugée en **code** là-bas. *Une affordance non câblée n'existe pas.*
>
> Le fichier `forge\retours\oracle-lot.mjs` absent ? Alors l'héritage du produit n'est pas tenu —
> `oracle-conformite-projet` (R-47) le dit — et il se recopie depuis `gabarits\oracle-lot-retours.mjs`
> du pilot, avec ce gabarit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Si un retour se rapporte à un item du registre TODO-FORGE du pilot, citer son id
(`TF-xxxx`) — chaque retour intégré recevra le sien. **Les forges aussi** peuvent déposer un
lot avec ce gabarit, ciblant n'importe quelle autre forge (remise : `input\00-retours\` du
pilot, préfixé du nom de la forge émettrice).

**Sidecar machine (obligatoire depuis le 08/08)** : à côté de ce lot, un fichier
`<projet> - RETOURS - <AAAAMMJJ><indice>.tf.jsonl` (même nom que le `.md`) — une ligne JSON
par élément visant une forge :
`{"schema":1, "titre":…, "contenu":…, "demandeur":"<produit ou forge>", "source":"<lot +
seq ledger>", "date_demande":…, "forges_cibles_initiales":[…], "score":{gain,preuve,effort}
si estimable, "preuve_du_cout":…}`. **JAMAIS d'id** : les ids TF sont frappés à l'ingestion
par le pilot. Le sidecar est ce qui rend la remontée automatique — le `.md` reste la
lecture humaine.

**Sidecar hors format (TF-0196, 14/08)** : `ingerer-lot.mjs` rejette le lot ENTIER, motif par
motif, et le registre reste intact — c'est voulu, un rejet atomique vaut mieux qu'une
candidature mal formée. Côté pilot, `todo\normaliser-lot.mjs <sidecar>` convertit la forme
« lot de retours » (`reference`, `gravite`, `preuve`, `proposition`) vers ce contrat et écrit
un **dérivé** `.normalise.tf.jsonl` — l'original reçu n'est jamais modifié. Il **refuse** deux
choses plutôt que de les deviner : un titre où aucune forge n'est nommée (la cible ne se
devine pas — écrire « `<forge>` : … » en tête du titre), et un retour sans preuve.
**Ids uniques par produit** : préfixe par forge (RT/RC/RD/RV/RA/RS) + numéro **jamais
réutilisé** — continuer la séquence des lots précédents du même produit.

---

## <forge concernée> (`digit-ai-forge-<nom>`)

<Une phrase de contexte : ce que le run/l'usage a coûté ou révélé sur cette forge.>

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| <RX-n> | <gravité> | <générique | produit+générique> | <le fait, pas l'opinion> | <piste, jamais obligatoire> |

**Portée** (R-45, 21/08) : *générique* — le défaut vaut pour tout projet employant la forge ;
*produit+générique* — le produit l'a corrigé chez lui ET la classe vaut ailleurs. Une remarque
de portée purement PRODUIT ne figure pas ici : elle va en section « Remarques restées au
produit », avec son verdict de généralisation.

<répéter la section par forge concernée — y compris `pilot` pour les auto-retours>

## Remarques restées au produit

<!-- SECTION OBLIGATOIRE depuis le 21/08/2026 (règle R-45, mandat humain). Elle est vérifiée
     par `oracle-boite-entree` B6 et refusée à l'ingestion si elle manque. -->

Ce que le produit a corrigé chez lui et **n'a pas remonté** — parce que le défaut lui semblait
propre à son code, à ses données, à son client. Chacune porte un **verdict de généralisation** :
*rien de généralisable, parce que…*, ou *généralisable → et le retour est alors REMONTÉ
ci-dessus, pas seulement mentionné ici*.

*Pourquoi cette section existe.* Un lot du 20/08 disait, mot pour mot : « Le lot ne remonte pas
ces défauts, qui appartiennent au produit. » Le tri était honnête et le raisonnement juste ;
il était surtout **invisible**. Les défauts de forme les plus coûteux de l'écosystème — largeur
de lecture, tableaux illisibles au mobile, états vides absents — ont tous commencé leur vie
comme « un défaut de ce livrable-là ». Ce qui se perd n'est pas le défaut : c'est la **classe**
du défaut. Une remarque écartée sans verdict écrit est une leçon qu'aucune session ne
retrouvera.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| <ce qui a été constaté> | <le correctif local> | <non \| oui> | <le motif, en une phrase — si oui, l'id de la remarque remontée ci-dessus> |

**Si aucune remarque n'est restée au produit**, l'écrire : « Aucune remarque n'est restée au
produit sur ce lot — vérifié par <qui>, le <date>. » Une section vide se lit comme un oubli,
et l'omission ne vaut pas décision.

## Retours sur les documents produits

<!-- SECTION OBLIGATOIRE depuis le 22/08/2026 (règle R-46, mandat humain du 21/08). Vérifiée
     par `oracle-boite-entree` B7 et refusée à l'ingestion si elle manque. -->

Ce que la factory demande à chaque projet : **ce qui a manqué, gêné ou dû être ajouté à la main**
dans les documents produits à partir d'un gabarit de `gabarits\documents\`. C'est le seul canal
par lequel un gabarit s'améliore — un gabarit ne vieillit pas en s'usant, il vieillit parce que
la réalité des projets le dépasse et que personne ne le dit.

Reporter le couple **`gabarit` + `version_du_gabarit`** que le document porte dans son en-tête :
sans lui, un retour dit « il manquait une section » et personne ne sait à quoi l'appliquer.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| <nom du livrable remis> | <gd-xxx · 1.0.0> | <section absente, champ non prévu> | <ce que le destinataire a dit, pas ce qu'on suppose> | <ce qu'il a fallu écrire hors gabarit> | <générique \| ce projet seulement> |

**Trois précisions qui font la valeur de ce retour** — sans elles, il n'est pas exploitable :

- **« Ce qui a gêné le lecteur »** est un FAIT rapporté, pas une intuition d'auteur. Un
  destinataire qui a demandé une information deux fois, qui a cherché une section ailleurs, ou
  qui a refusé une mise en page : voilà de la matière. « On aurait pu mieux faire » n'en est pas.
- **« Ajouté à la main »** est le signal le plus fort du lot. Ce qu'un projet a dû écrire hors
  gabarit est, presque toujours, une section que le gabarit devrait porter — et c'est ainsi que
  les quatre premières familles ont été extraites, en relevant ce que les projets refaisaient.
- **La portée** se tranche ici comme partout (R-45) : ce qui est propre au projet reste chez lui,
  ce qui vaut pour la famille remonte. Dans le doute, remonter — le tri se fait mieux au registre
  qu'en silence.

**Si aucun document n'a été produit depuis un gabarit de la bibliothèque**, l'écrire :
« Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. » Une section vide se
lit comme un oubli, et l'omission ne vaut pas décision.

## Confirmations positives

<Ce qui a TENU en conditions réelles — aussi précieux que les défauts : permet de clore les
entrées du backlog comme « vérifiées ». Citer les correctifs concernés.>

## Ordre recommandé

1. <le retour au meilleur rapport gain/effort, et pourquoi>
2. …
