---
destinataire: humain
---

# Synthèse de mandat — vos deux sélecteurs désignaient un travail déjà fait, vérifié plutôt que refait (15/09/2026)

Votre message reprenait les deux mêmes sélecteurs qu'au tour précédent. Ces deux arbitrages ont déjà été exécutés dans ce même tour : les cinq familles d'artefacts de cadence sont écrites, et la distinction entre une dette de travail et une dépendance d'environnement est tenue par une règle qui la compte à chaque passage. Plutôt que de rejouer le travail ou de vous répondre sur ma mémoire, j'ai remesuré l'état : le registre et l'oracle du catalogue disent tous deux que c'est fait. Ce tour ne produit donc aucun livrable neuf, et je ne vous représente pas la synthèse précédente à l'identique. Deux arbitrages restent réellement ouverts, posés au tour précédent et jamais tranchés : autoriser ou non l'écriture des trois correctifs au socle partagé, et lancer ou non la recherche de la même classe de défaut dans les autres contrôles. Ce qui est attendu de vous : leurs deux lettres.

## 1. En-tête d'identification

- **quoi** — vérification de l'état des deux décisions désignées par votre message, et réponse sans rejouer un travail déjà exécuté.
- **sur quoi** — le pilot `digit-ai-factory` : registre des constats et catalogue des familles de gabarits. Aucun autre dépôt n'a été touché ni lu.
- **quand** — 2026-09-15 de 16:20 à 16:25 CEST (UTC+02:00), durée ≈ 5 min, relevée à l'horloge du poste.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrement de départ `139ae0b` ; oracles exécutés : `oracle-gabarits-documents.mjs` — dont G6 (une famille sans point de départ dit ce qui l'empêche, et la répartition est rendue à chaque passage) — et lecture directe de `todo/TODO.jsonl`.

## 2. Verdict en une ligne

Les deux arbitrages désignés étaient **déjà exécutés** : le registre rend `TF-1078`, `TF-1079` et `TF-1080` en statut **`corrige`** — **3 sur 3** — et `oracle-gabarits-documents` rend « couverture : **15** famille(s) html outillée(s), **5** sans point de départ — dont **4** dépendance(s) d'environnement et **1** dette(s) de travail ». **Zéro** livrable produit dans ce tour, **zéro** fichier de la bibliothèque modifié, **1** ligne de relevé d'héritage enregistrée. Les décisions réellement ouvertes restent au nombre de **deux**, inchangées depuis le tour précédent.

## 3. Décisions attendues de l'humain

Ces deux arbitrages ont été posés au tour précédent et n'ont jamais été tranchés ; ils sont repris ici sans changement de contenu, parce qu'un sélecteur qui désigne un travail déjà fait ne les fait pas disparaître. Ils portent sur ce qui sort du pilot : écrire dans un dépôt partagé, et engager un balayage de la recette.

> **D-12 — M'autorisez-vous à écrire au socle les trois correctifs que la bibliothèque a éprouvés ?**
>
> Trois défauts du socle partagé ont été trouvés en construisant les pages, chacun mesuré et chacun corrigé localement : sa recette de sommaire collant laisse le sommaire hors de la fenêtre sur petit écran, alors que son propre contrôle le refuse ; sa forme de badge donnée en exemple est celle que sa propre règle de discernement rejette ; et sa doctrine ne dit pas de quel côté égaliser les largeurs de contenu.
>
> **Recommandation : (a).** Source consultée : `scripts/verifier-rendu-instances.mjs`, commentaire de la constante `familles` — « LA LISTE N'EST PLUS ÉCRITE ICI (choix humain du 23/08, option source unique) : elle est LUE dans le socle, qui la publie ». Le parc a déjà tranché cette question de principe une fois : ce qui fait référence vit au socle, et une copie locale se décale.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Mandat pour les trois correctifs, avec leurs fixtures | complexité moyenne × durée courte ; trois éditions et leurs contrôles rejoués | exclut que le socle reste intact pendant que ses consommateurs divergent |
| **(b)** Les laisser en candidats au registre, corrigés seulement dans la bibliothèque | rien de plus | exclut la propagation : tout autre dépôt qui suit la doctrine du socle reproduira les trois défauts |
| **(c)** Ne porter que la phrase sur le sens de l'égalisation | complexité simple × durée courte | exclut les deux correctifs visuels, qui sont ceux dont un retour humain avait déjà payé le prix |

> **Si rien n'est décidé** : (b) s'applique — les trois constats restent ouverts au registre avec leur mesure, et le socle garde ses trois défauts.

> **D-13 — Faut-il chercher dans les autres contrôles la classe de défaut trouvée hier ?**
>
> Le contrôle de rendu mesurait toutes les pages du parc à une seule largeur de fenêtre sans que rien ne le dise, et c'est ce qui a laissé dix points de départ propager leurs défauts. Le défaut n'est pas la valeur choisie : il est qu'un périmètre de mesure soit écrit en dur dans un contrôle au lieu d'être lu chez celui qui en porte la référence. La recette compte cent sept contrôles.
>
> **Recommandation : (a).** Source consultée : `todo/RECIDIVES.md`, relevé du 15/09 — 74 classes de défaut, 129 récidives. Le registre montre que dans ce parc, une classe trouvée une fois se retrouve ailleurs plus souvent qu'elle ne reste seule.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Balayer les 107 contrôles et déclarer chaque périmètre trouvé en dur | complexité moyenne × durée moyenne ; un passage de lecture et un constat par cas | exclut de continuer à lire « PASS sur le parc » sans savoir sur quel périmètre |
| **(b)** Écrire une règle qui refuse un périmètre écrit en dur, sans balayage préalable | complexité moyenne × durée courte | exclut de connaître l'ampleur avant de poser la règle, donc de mesurer son bruit avant de la rendre bloquante |
| **(c)** S'en tenir au contrôle déjà corrigé | rien | exclut toute assurance sur les 106 autres : la classe reste vivante et invisible |

> **Si rien n'est décidé** : (c) s'applique — le contrôle de rendu est corrigé, et les autres périmètres restent inconnus.

## 4. Traité — avec sa preuve

- **L'état des trois constats que vos deux sélecteurs commandaient a été remesuré, pas rappelé de mémoire — le contrôle rouge → vert qui les a fermés a été joué au tour précédent, et la classe y était nommée : une contradiction écrite entre deux textes du parc, et une couverture affirmée sans test d'existence derrière.**
  - preuve : lecture directe de `todo/TODO.jsonl` — `TF-1078 -> corrige`, `TF-1079 -> corrige`, `TF-1080 -> corrige`. Les trois portent leur descente, écrite au tour précédent, avec leur contrôle rouge → vert et leur classe nommée : pour les cinq familles de cadence, 13 familles nues → 5 et une contradiction écrite entre deux textes du parc ; pour le statut reclassé, une couverture affirmée sans test d'existence derrière. Rien de cela n'a été refait ici : la lecture constate, elle ne corrige pas.
- **La couverture que la seconde option commandait a été rejouée par son oracle.**
  - preuve : `node oracles/oracle-gabarits-documents.mjs` rend « couverture : 15 famille(s) html outillée(s), 5 sans point de départ — dont 4 dépendance(s) d'environnement et 1 dette(s) de travail (poste-porteur: 4, reclassement: 1) ». C'est exactement ce que la décision demandait de rendre mesurable.
- **Le relevé d'héritage produit par l'ouverture de session est enregistré.**
  - preuve : `git diff --stat todo/HERITAGE-RELEVES.jsonl` rend « 1 file changed, 1 insertion(+) » — une ligne de relevé, contrat 1.9.0, aucun produit suivi.

## 5. Non traité — avec son motif

- **Le geste que vos deux sélecteurs auraient commandé** — motif : sans objet, il était déjà exécuté au tour précédent et les trois constats correspondants sont en statut `corrige`. Le refaire aurait réécrit dix pages et un catalogue déjà conformes.
- **Les trois correctifs du socle** — motif : hors mandat, `digit-ai-forge-agents` étant un dépôt frère où la règle du pilot interdit toute écriture sans mandat humain. C'est l'objet de la décision D-12.
- **Les 106 autres contrôles de la recette** — motif : dépendance à un arbitrage, leur balayage est précisément ce que la décision D-13 tranche.
- **La recette complète du pilot** — motif : sans objet dans ce tour, aucun fichier de code ni de gabarit n'ayant été modifié ; son dernier passage, au tour précédent, rend 13 oracles en défaut sur 107.
- **Le socle n'est toujours pas publié** — motif : accès, éprouvé le 14/09 — deux chemins essayés, tous deux refusés au même endroit : `git -C /home/user/digit-ai-forge-agents push origin main` rend une erreur HTTP 403 du relais git, et l'API GitHub de cette session est bornée au même ensemble autorisé, qui ne contient que `iguane39/digit-ai-factory`.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « 10a » — la bibliothèque écrit la forme des cinq artefacts de cadence | Rien réexécuté : j'ai vérifié que c'était fait, et rendu la preuve | **Écart assumé.** Le geste avait été exécuté au tour précédent, sur ce même sélecteur ; le refaire aurait réécrit dix pages conformes. La preuve remplace le geste, et elle est rejouée, pas citée de mémoire |
| « 11b » — marquer les familles qui attendent un poste porteur, et rendre la distinction mesurable | Rien réexécuté : j'ai rejoué l'oracle qui rend la répartition | **Écart assumé**, même raison. L'oracle rend « 4 dépendance(s) d'environnement et 1 dette(s) de travail » : la mesure existe et vit |
| (non dit) | Je vous ai signalé que les sélecteurs ouverts sont D-12 et D-13 | Sans ce rappel, un troisième envoi des mêmes lettres laisserait les deux vraies décisions ouvertes indéfiniment |

## 7. Risques

- **Un même sélecteur renvoyé une troisième fois, et les deux décisions ouvertes restent en attente.**
  - signal : un prochain message reprend « 10a, 11b » plutôt que « D-12 … , D-13 … ».
  - parade : le bloc 3 ne porte plus que les deux décisions ouvertes, avec leurs lettres propres ; et l'action qui les appelle nomme la forme exacte de la réponse attendue.
- **La vérification tient lieu de travail et le tour paraît productif alors qu'il ne l'est pas.**
  - signal : quelqu'un relit cette synthèse et croit que cinq familles ont été écrites aujourd'hui.
  - parade : le verdict dit « zéro livrable produit dans ce tour », et le bloc des écarts déclare les deux gestes comme non réexécutés.
- **Les trois correctifs du socle vieillissent dans la bibliothèque seule pendant que le parc diverge.**
  - signal : un autre dépôt livre une page dont les badges sont pastel, ou dont le sommaire disparaît sur mobile.
  - parade : les trois constats sont ouverts au registre avec leur mesure et leur remède éprouvé ; la décision D-12 les sort de là ou les y laisse, explicitement.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-40** | Répondre `D-12` et `D-13` par leur lettre — la forme attendue est « D-12 a, D-13 a », les sélecteurs `10a` et `11b` ne désignant plus rien d'ouvert | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, écrire dans un dépôt frère demande un mandat humain, et ouvrir un balayage de 107 contrôles engage un tour entier. Fichier à lire d'abord : `todo/TODO.md`, entrées TF-1081, TF-1082, TF-1085 et TF-1086 | les options par défaut (b) et (c) s'appliquent : le socle garde ses trois défauts, et les 106 autres périmètres restent inconnus |
| **A-34** | Publier l'enregistrement `d75d76e` du socle depuis un poste autorisé sur `digit-ai-forge-agents` | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `acces` — tentative jouée le 14/09 : `git -C /home/user/digit-ai-forge-agents push origin main` rend `access denied by the git proxy […] not in this session's authorized repository set`, erreur HTTP 403 ; l'API GitHub de la session est bornée au même ensemble, seule autre voie existante | les trois règles de composition du 14/09 ne vivent que sur ce poste, et tout autre poste juge encore avec 40 règles |
| **A-35** | Sortir la demande de fusion du brouillon, ou demander le retrait de la branche | manuelle_utilisateur | action reconduite, `neuve` au registre — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | tout le travail des six tours reste sur une branche latérale |
| **A-36** | Porter au socle les trois correctifs éprouvés, avec leurs fixtures rouges | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `dependance_bloc_3`, attend D-12 (option (a)) | chaque consommateur du socle répare les trois défauts dans son coin, avec ses propres valeurs |
| **A-37** | Balayer les contrôles de la recette à la recherche d'un périmètre de mesure écrit en dur | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `dependance_bloc_3`, attend D-13 (option (a)) | un verdict vert continue de se lire comme « conforme » là où il vaut « conforme sur le périmètre que ce contrôle a choisi » |
| **A-38** | Décider le sort des candidats TF-1075 à TF-1085 encore en attente | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `gate_gouvernance`, le passage de candidat à décidé exige un décideur humain nommé et sa date | les constats restent en attente, et le compteur de récidives les ignore |
| **A-39** | Tenir la revue datée : familles outillées, constats produits par les règles neuves, retours humains par famille | auto_ia | action reconduite, `neuve` au registre, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict de l'étude du 14/09 n'est jamais confronté aux faits |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les items ouverts ces deux jours étant des items de forge.

## 9. Traces

- `todo/TODO.jsonl` — `TF-1078`, `TF-1079` et `TF-1080` en statut `corrige`, lus dans ce tour.
- `todo/HERITAGE-RELEVES.jsonl` — une ligne de relevé ajoutée à l'ouverture de session, contrat 1.9.0.
- `gabarits/documents/catalogue.jsonl` — 1.4.0, inchangé dans ce tour ; sa couverture rejouée par `oracles/oracle-gabarits-documents.mjs`.
- `output/04-plans/Digit-AI - Synthese Mandat - Cinq familles de cadence et le controle aveugle - 20260915a.md` — la synthèse du tour précédent, où vivent les preuves des deux gestes.
- Enregistrement `139ae0b` sur `claude/html-quality-new-formats-qhfgvj` ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- **Aucune page HTML n'a été produite ni modifiée dans ce tour** : la question du verdict de la critique d'implémentation ne se pose pas ici, et les vingt-quatre pages du tour précédent restent sur le leur — critique **non jouée**, faute de mandat forge-design.
