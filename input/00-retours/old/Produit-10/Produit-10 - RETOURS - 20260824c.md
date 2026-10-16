# Retours forges — Produit-10 — 20260824c

- **Contexte** : le destinataire des restitutions a écrit en session, le 24/08, « **le prompt de
  réponse s'affiche 2 fois, corrige** ». C'est **mot pour mot** la mesure qui a fait naître la
  version 2.5.0 de `gabarits\RESTITUTION.md` le 22/08 — le symptôme est donc **revenu deux
  jours après le correctif censé le traiter**. Le diagnostic conduit ici montre pourquoi : la
  v2.5.0 a traité la **proportionnalité** du gate, et le défaut n'est pas là.
- **Références ledger** : `forge\ledger.jsonl` seq 63.
- **Remise au pilot** : copié dans `<PILOT_ROOT>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-08-24

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `Produit-10 - RETOURS - 20260824b`, remis le même jour. La séquence d'ids
continue en **`RV-13`**.

---

## Le fait qui ouvre ce lot

**Deux refus de gate dans une seule session, donc trois affichages du même message.** Et les
deux refus portaient sur des règles que la restitution incriminée **respectait sur le fond** :
ils venaient de la **forme du titre des blocs**, jamais de leur contenu.

Le mécanisme d'affichage double n'est pas une anomalie : il est **structurel**. Un hook `Stop`
juge **après** que le message a été rendu au lecteur. Un refus ne peut donc pas retirer la
version rejetée de l'écran — il ne peut qu'en faire écrire une seconde. Le lecteur relit
l'intégralité des huit blocs à chaque tour de refus. La v2.5.0 a réduit la **fréquence** des
refus en rendant six règles avertissantes ; elle ne pouvait pas supprimer le doublon, parce que
le doublon ne dépend pas du nombre de règles bloquantes mais de **l'existence d'un refus**.

D'où la conséquence qui rend les deux défauts ci-dessous plus chers qu'ils n'en ont l'air :
**tout faux positif du gate coûte au lecteur une relecture complète.**

## factory (`digit-ai-factory`) — `oracles\oracle-synthese.mjs` v1.2.0

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-13 | **bloquant** | générique | **`S1` ne reconnaît un bloc que si son numéro est suivi d'un POINT ; un titre numéroté au tiret rend « les 8 blocs absents » sur une restitution qui les porte tous.** Le motif de `BLOCS` (l.82-91) est `#{1,4}\s*(N\.\s*)?(en-t[êe]te\|verdict\|…)` : le groupe du numéro est facultatif, mais il exige `N.` — un titre `## 1 — En-tête d'identification` place `1 — ` entre le `#` et le mot-clé, et **aucune branche ne l'absorbe**. **Mesuré par A/B le 24/08** : deux fichiers **identiques au séparateur près**, l'un titré `## N.`, l'autre `## N —`. Le premier rend **S1 PASS** (« les 8 blocs de la structure sont présents »), le second **S1 FAIL** avec les **huit** blocs déclarés absents. Le coût n'est pas le refus, c'est le **message** : « bloc(s) absent(s) » envoie l'auteur chercher du contenu manquant, alors qu'il manque un point. Le premier des deux refus de cette session est **entièrement** dû à cela — et l'auteur a réécrit huit blocs pour changer une ponctuation. Aggravant : le tiret cadratin est la ponctuation employée **par le gabarit lui-même** dans ses titres de section et dans presque tous les livrables du parc. | Élargir le groupe du numéro à `(N\s*[.\)—–-]?\s*)?` — trois caractères de plus dans un motif déjà présent. Et **faire dire au message ce qui a été vu** : quand aucun bloc n'est reconnu mais que le texte porte au moins quatre titres de niveau 2-4, dire « aucun titre de bloc reconnu — vérifier la forme du titre », jamais « blocs absents ». Un oracle qui annonce un contenu manquant là où il ne sait pas lire fait chercher au mauvais endroit. |
| RV-14 | majeur | générique | **`S9` exige que la synthèse d'ouverture ne porte AUCUN titre, ce que ni le gabarit ni le message d'échec ne disent.** L.≈300 : `premierBloc = texte.search(/(^\|\n)#{2,4}\s/)` puis `ouverture = texte.slice(0, premierBloc)`. La synthèse d'ouverture n'est donc comptée que si elle vit **avant le premier titre de niveau 2 à 4**. Une restitution qui la titre `### 0. Synthèse d'ouverture` — forme naturelle, et **c'est le nom que le gabarit lui donne** (« bloc 0 ») — rend `ouverture` **vide** et `S9` échoue en annonçant « **0 mot(s) avant le premier bloc** ». Mesuré le 24/08 sur une ouverture de 34 mots parfaitement conforme : verdict `FAIL`, décompte `0`. Le message est **exact et trompeur** : il dit vrai sur ce que l'oracle a lu, et fait conclure à l'auteur que sa prose est absente. `S9` étant avertissante depuis la v2.5.0, le défaut a traversé **quatre restitutions** de cette session sans être compris. | Deux corrections indépendantes. **(1)** Accepter un titre d'ouverture : si le premier titre rencontré correspond à un motif d'ouverture (`synth[èe]se d'ouverture`, `en bref`, `r[ée]sum[ée]`), compter le texte **entre ce titre et le titre suivant**. **(2)** Rendre le message diagnostique : « aucun texte avant le premier titre — la synthèse d'ouverture se place AVANT tout titre, ou se titre "Synthèse d'ouverture" », au lieu d'un décompte à zéro qui se lit comme une absence de prose. |

**Portée** (R-45) : *générique* — les deux défauts valent pour toute restitution de tout projet,
et ils frappent d'autant plus fort que le gate est bloquant.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les restitutions de cette session partaient à l'affichage **sans avoir été jugées**, le hook `Stop` étant le seul contrôle — donc chaque défaut de forme coûtait un affichage supplémentaire | la session **pré-juge** désormais sa restitution : elle l'écrit dans un fichier de travail et exécute `oracle-synthese` dessus **avant** de l'afficher, en itérant jusqu'au `PASS`. Vérifié sur la restitution de ce tour même : `FAIL` au premier jet, `PASS` avant affichage | **oui** | Ce n'est pas une invention locale : `RESTITUTION.md` porte le principe depuis la **v2.1.0** (TF-0249, « synthèse EN FICHIER jugée avant affichage »), appliqué aux clôtures de run et **non au gate de tour**. La généralisation utile est de l'écrire dans le gabarit comme la voie normale, le hook `Stop` restant le filet |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| les restitutions de fin de tour | `gabarits\RESTITUTION.md` v2.10.0 | rien dans le gabarit ne dit qu'un titre de bloc doit porter un **point** après son numéro, ni que la synthèse d'ouverture doit vivre **avant tout titre** | le destinataire a écrit « le prompt de réponse s'affiche 2 fois » — conséquence directe des refus que ces deux règles non écrites provoquent | la forme exacte des titres, trouvée en lisant le code de l'oracle après trois refus | **générique** — tout produit soumis au même gate |

**Aucun document produit depuis un gabarit** de `gabarits\documents\` : ce projet est une analyse de données et la bibliothèque n'en porte pas de gabarit. Le tableau ci-dessus rapporte donc ce qui a manqué **faute de gabarit**, ce qui est l'autre moitié du même signal.

## Confirmations positives

- **Le gate fait ce pour quoi il a été posé.** Les deux refus de cette session ont bien
  intercepté des restitutions non conformes au gabarit — ce lot ne demande pas de l'affaiblir,
  il demande que ses motifs soient justes.
- **Le `--self-test` de l'oracle fonctionne** et rend `2/2 PASS` ; il énumère ses règles, ce qui
  a permis de conduire les deux A/B ci-dessus sans lire tout le code.
- **La v2.5.0 avait raison sur son diagnostic** : les refus observés portaient bien sur des
  règles de forme, et la proportionnalité était la bonne réponse à la question qu'elle posait.
  Elle ne pouvait simplement pas voir que deux de ces refus étaient des faux positifs.

## Ordre recommandé

**`RV-13` d'abord** — c'est le seul des deux qui soit bloquant, et il se corrige en trois
caractères de motif. **`RV-14` ensuite**. Les deux se mesurent par le même A/B, déjà écrit :
deux fichiers identiques au titre près, passés à l'oracle.
