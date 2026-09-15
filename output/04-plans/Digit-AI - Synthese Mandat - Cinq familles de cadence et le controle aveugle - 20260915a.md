---
destinataire: humain
---

# Synthèse de mandat — les cinq familles de cadence sont écrites, et j'ai trouvé pourquoi les premiers HTML étaient mauvais (15/09/2026)

Vos deux arbitrages sont exécutés, et le tour a trouvé autre chose que ce qu'il cherchait. Les cinq familles d'artefacts de cadence ont leur page, leur exemplaire et leur doctrine ; la contradiction que vous aviez à trancher est levée par une division du travail que les cinq doctrines écrivent noir sur blanc. Les familles dont les sources sont ailleurs portent désormais un champ à vocabulaire fermé, et un oracle compte la répartition à chaque passage. Mais en vérifiant mes propres pages au périmètre complet de l'oracle, j'ai découvert que les dix pages que je vous ai annoncées vertes hier étaient rouges, et que la cause n'était pas une inattention : le contrôle de rendu du pilot mesurait toutes les pages à une seule largeur de fenêtre, quand l'oracle du socle en juge six. Trois familles de défauts ne se déclenchent qu'en dehors de cette fenêtre. C'est la cause racine du mandat que vous avez ouvert le 14 septembre, elle est corrigée, et la correction est prouvée dans les deux sens sur les fichiers d'hier. Ce qui est attendu de vous : un mandat d'écriture au socle, et l'ordre de chercher la même classe de défaut ailleurs.

## 1. En-tête d'identification

- **quoi** — exécution des décisions humaines D-10 (a) et D-11 (b) du 15/09/2026 : écrire la forme des cinq artefacts de cadence, et rendre mesurable la distinction entre une dette de travail et une dépendance d'environnement.
- **sur quoi** — le pilot `digit-ai-factory` : bibliothèque de gabarits, catalogue, oracles, contrôle de rendu, registre. Le socle `digit-ai-page-html` et le skill `pilote-de-mission` ont été **lus seulement**.
- **quand** — 2026-09-15 de 14:15 à 15:25 CEST (UTC+02:00), relevé à l'horloge du poste.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrements `ef23b04` et `6a0a6a8` ; oracles exécutés : `check_html.py` (41 règles, empreinte `6d1f8858afdf`), `render_page.py` (27 familles, empreinte `134b408b62d7`), `check_markdown.py`, `oracle-gabarits-documents.mjs` — dont G1 (une famille porte sa doctrine et au moins un exemplaire) et G6 (une famille sans point de départ dit ce qui l'empêche) — `oracle-todo.mjs`, `scripts/verifier-rendu-instances.mjs` et la recette complète du pilot.

## 2. Verdict en une ligne

Les **cinq** familles de cadence sont écrites — `revue-raid`, `rapport-avancement`, `compte-rendu`, `rex-de-fin`, `suivi-benefices` — chacune avec squelette, exemplaire et doctrine ; l'objection du skill propriétaire est levée sur ses deux termes, dans le texte des cinq doctrines. Le catalogue passe en **1.4.0** avec le champ `empechement` à vocabulaire fermé, tenu par la règle neuve G6, qui rend la mesure à chaque passage : **15 familles outillées sur 20, 5 nues — dont 4 dépendances d'environnement et 1 dette de travail**, contre 7 sur 20 hier. Et le tour a produit un résultat que je ne cherchais pas : les **10** pages que je vous ai annoncées vertes hier étaient **rouges** au périmètre par défaut de l'oracle, parce que `scripts/verifier-rendu-instances.mjs` figeait **une seule largeur de fenêtre** — 1440 px — là où le socle en juge **six**, et que trois familles bloquantes ne parlent qu'en dehors de celle-là : V18 (la mesure de lecture au-delà de 100 caractères par ligne) dès 2560 px ; le sommaire perdu au défilement, à 768 et 390 px ; V1 (le débordement horizontal) à 390 px. Corrigé et prouvé dans les deux sens sur les fichiers d'hier — **PASS 10/10 avant, FAIL 10/10 après**. Toute la bibliothèque est désormais verte au périmètre complet : **24 pages sur 24**, zéro échec et zéro avertissement aux deux oracles. Recette du pilot : **13/107** en défaut, liste identique à celle d'avant ce tour.

## 3. Décisions attendues de l'humain

> **D-12 — M'autorisez-vous à écrire au socle les trois correctifs que la bibliothèque vient d'éprouver ?**
>
> Trois défauts du socle ont été trouvés en construisant les pages, chacun mesuré et chacun corrigé localement dans la bibliothèque : sa recette de sommaire collant laisse le sommaire hors de la fenêtre sous 900 px, alors que son propre contrôle le refuse ; sa forme de badge donnée en exemple est celle que sa propre règle V16 rejette ; et sa doctrine ne dit pas de quel côté égaliser les largeurs, ce qui m'a fait prendre le mauvais hier. Le socle est un dépôt frère : je n'y écris pas sans mandat. Tant qu'il n'est pas corrigé, chaque consommateur retrouve les trois défauts et les répare dans son coin, avec ses propres valeurs.
>
> **Recommandation : (a).** Source consultée : `scripts/verifier-rendu-instances.mjs`, commentaire de la constante `familles` — « LA LISTE N'EST PLUS ÉCRITE ICI (choix humain du 23/08, option source unique) : elle est LUE dans le socle, qui la publie ». Le parc a déjà tranché cette question de principe une fois : ce qui fait autorité vit au socle, et une copie locale se décale.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Mandat pour les trois correctifs, avec leurs fixtures | complexité moyenne × durée courte ; trois éditions et leurs contrôles rejoués | exclut que le socle reste la référence non touchée pendant que ses consommateurs divergent |
| **(b)** Les laisser en candidats au registre, corrigés seulement ici | rien de plus | exclut la propagation : tout autre dépôt qui suit la doctrine du socle reproduira les trois défauts |
| **(c)** Ne porter que la phrase sur le sens de l'égalisation | complexité simple × durée courte | exclut les deux correctifs visuels, qui sont ceux dont un retour humain avait déjà payé le prix |

*Si rien n'est décidé* : (b) s'applique — les trois constats restent ouverts au registre avec leur mesure, et le socle garde ses trois défauts.

> **D-13 — Faut-il chercher ailleurs la classe de défaut qui vient d'être trouvée ?**
>
> Le contrôle de rendu mesurait toutes les pages du parc à une seule largeur, sans que rien ne le dise, et c'est ce qui a laissé dix points de départ propager leurs défauts. Le défaut n'est pas dans la valeur choisie : il est qu'un périmètre de mesure soit écrit en dur dans un contrôle au lieu d'être lu chez celui qui fait autorité. Rien ne garantit que ce contrôle soit le seul. La recette du pilot compte 107 contrôles.
>
> **Recommandation : (a).** Source consultée : `todo/RECIDIVES.md`, relevé du 15/09 — 74 classes de défaut, 129 récidives. Le registre montre que dans ce parc, une classe trouvée une fois se retrouve ailleurs plus souvent qu'elle ne reste seule.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Balayer les 107 contrôles et déclarer chaque périmètre trouvé en dur | complexité moyenne × durée moyenne ; un passage de lecture et un constat par cas | exclut de continuer à lire « PASS sur le parc » sans savoir sur quel périmètre |
| **(b)** Écrire une règle qui refuse un périmètre écrit en dur, sans balayage préalable | complexité moyenne × durée courte | exclut de connaître l'ampleur avant de poser la règle, donc de mesurer son bruit avant de la rendre bloquante |
| **(c)** S'en tenir au contrôle corrigé | rien | exclut toute assurance sur les 106 autres : la classe reste vivante et invisible |

*Si rien n'est décidé* : (c) s'applique — le contrôle de rendu est corrigé, et les autres périmètres restent inconnus.

## 4. Traité — avec sa preuve

- **Une erreur annoncée hier, corrigée — contrôle rouge → vert rejoué sur les fichiers mêmes, et la classe nommée : un verdict cité sans son périmètre de mesure.**
  - preuve : j'ai écrit le 14/09 « `render_page.py` rend `Verdict : PASS` à 1920 px sur les six ». Mesure rejouée sur les fichiers extraits de l'enregistrement `385b1ae` : **FAIL sur les 10 pages** au périmètre par défaut de l'oracle, qui juge six largeurs. À 1920 px, toutes rendaient « aucun défaut mesuré » — la fenêtre exacte où aucune des trois familles ne parle. Constat ouvert : **TF-1083**.
- **La cause racine du mandat est trouvée — `scripts/verifier-rendu-instances.mjs` rejoué sur les fichiers de `385b1ae` rend PASS 10/10 puis FAIL 10/10 — et ce n'est pas une inattention : contrôle rouge → vert joué sur pièce.**
  - preuve : `scripts/verifier-rendu-instances.mjs` passait `--widths 1440` en dur, quand `render_page.py` publie `DEFAULT_WIDTHS = [3840, 2560, 1920, 1280, 768, 390]`. Sur les dix pages de `385b1ae` : **PASS 10/10 à 1440 px**, **FAIL 10/10 au périmètre du socle**. La recette rendait donc « PASS sur le parc » sur des pages que l'oracle du socle déclare en défaut.
- **Le contrôle est corrigé par la doctrine que le fichier portait déjà — contrôle rouge → vert rejoué, et la classe nommée : un périmètre de mesure écrit en dur au lieu d'être lu chez celui qui en porte la référence.**
  - preuve : sans `--largeur`, aucun `--widths` n'est envoyé — le périmètre est celui du socle ; `--largeur` reste pour restreindre, et le résumé le dit désormais. Chaque constat nomme la fenêtre où le défaut se voit. Sens vert : **PASS 12/12** sur le parc corrigé. Constat **TF-1086**, ouvert, décidé et clos avec sa descente dans le tour.
- **Les cinq familles de cadence sont écrites, et l'objection du skill propriétaire est levée sur ses deux termes.**
  - preuve : 10 pages et 5 doctrines. `check_html.py` rend **« Aucun problème détecté »** sur les 10 ; `render_page.py` rend **PASS aux six largeurs** sur les 10 ; `check_markdown.py` rend PASS sur les 5 doctrines. L'argument « sans juge » tombe sur ces deux oracles ; l'argument « objet durable » tombe sur le bandeau de dérivation, qui déclare la page dérivée de l'état de mission et datée du relevé, à l'écran et pas seulement en doctrine.
- **Ce que la décision D-11 (b) demandait de rendre mesurable l'est, par une règle et non par une note.**
  - preuve : catalogue en **1.4.0**, champ `empechement` à vocabulaire fermé — `poste-porteur`, `arbitrage`, `reclassement`, `aucun` — et `sources_attendues_sur` sur les `poste-porteur`. Règle G6 écrite dans `oracles/oracle-gabarits-documents.mjs`, avec ses **deux sens rouges** au self-test, qui passe de **12 à 14 cas**. Elle rend à chaque passage : « couverture : 15 famille(s) html outillée(s), 5 sans point de départ — dont 4 dépendance(s) d'environnement et 1 dette(s) de travail ».
- **Deux dettes du socle de la bibliothèque, trouvées en voulant les dupliquer cinq fois — contrôle rouge → vert rejoué, et la classe nommée : une affordance employée sans être câblée, et une étiquette héritée d'une autre famille.**
  - preuve : `.muted` et `.badge` étaient **employées sans aucune règle CSS** sur les cinq familles — un `<span class="badge ok">` se rendait en texte nu, et l'état qu'il annonce ne se voyait pas ; et le pied de page des cinq disait « Rapport de données », y compris sur la synthèse exécutive. Mesure du câblage : **6 classes employées sans règle** — `muted`, `badge`, `part`, `ok`, `ko`, `info` — sur 5 familles avant, **0 après** sur les 24 pages ; étiquette fausse sur **8 pages sur 10** avant, **0 après**.
- **Le câblage des badges a réveillé un défaut que leur absence cachait — contrôle rouge → vert rejoué, et la classe nommée : une forme donnée en exemple par une référence et refusée par une règle du même socle.**
  - preuve : la forme pastel reprise de `references/composants.md` § 2 du socle a rendu 108 constats V16 (les états ne se distinguent pas entre eux) sur quatre pages. Forme reprise de la fixture verte du même socle : fonds pleins, encre blanche, un glyphe par palier. **108 → 0**. Constat **TF-1082**.
- **La correction d'hier était du mauvais côté de l'égalisation, et l'oracle disait lui-même lequel prendre.**
  - preuve : `render_page.py`, bloc `non_juge` — « un paragraphe TENU par un conteneur de lecture déclaré n'est jamais bloqué, même au-delà de 100 caractères par ligne ». Hier j'avais **retiré** `.lire` de trois sections pour satisfaire V19 (une seule largeur de contenu entre sections sœurs) ; il fallait **l'étendre** aux autres. Les 24 pages portent désormais `chap lire` sur toutes leurs sections, ce qui satisfait V18 et V19 ensemble. Constat **TF-1085**.
- **La recette de sommaire collant que le socle donne en exemple échoue son propre contrôle — contrôle rouge → vert rejoué, et la classe nommée : un commentaire qui promet ce que son code ne fait pas.**
  - preuve : `references/lisibilite.md` § **L25** — au-delà de trois chapitres, un sommaire visible en permanence — donne `@media (max-width: 900px) { .toc { position: static; } }` avec, en commentaire, « bande repliable sur mobile » que le CSS ne fournit pas. Mesure : **24 constats bloquants** « sommaire perdu », deux par famille, à 768 et à 390 px. Remède posé dans la bibliothèque, **24 → 0**. Constat **TF-1081**.
- **Le modèle de référence était le moins conforme des cinq — contrôle rouge → vert rejoué, et la classe nommée : un point de départ moins tenu que les pages qui en dérivent.**
  - preuve : `gd-rapport-donnees` rendait **6 avertissements L30** — aucun de ses six chapitres ne disait ce qu'il contient — alors que les quatre familles dérivées de lui le disaient toutes. Les six `.contenu` sont écrits, **6 → 0**.
- **Deux familles plus anciennes, que je n'avais pas vues hier, étaient en défaut et ne le sont plus — contrôle rouge → vert rejoué, et la classe nommée : un point de départ que le balayage du 14/09 n'avait pas atteint.**
  - preuve : `dossier-architecture-technique` et `dossier-exploitation` rendaient **21 et 24 constats V18** plus 2 « sommaire perdu » chacune, et **8 avertissements L30** chacune. Après traitement : `check_html` « Aucun problème détecté », `render_page` PASS aux six largeurs sur les quatre pages.
- **Le statut infondé de `dashboard-tests` est reclassé — contrôle rouge → vert rejoué, et la classe nommée : une couverture affirmée sans test d'existence derrière.**
  - preuve : statut porté de `porte_ailleurs` à `a_extraire`, empêchement `reclassement`, et le champ `preuve` cite la vérification qui a défait l'affirmation. Constat **TF-1079** clos avec sa descente.
- **La recette complète du pilot ne perd rien, périmètre élargi compris.**
  - preuve : `node oracles/self-tests.mjs` rend **13 oracles en défaut sur 107**, liste identique à celle d'avant ce tour, et le contrôle de rendu rend « PASS sur le parc » au périmètre complet. Le cliquet enregistre l'enrichissement : `oracle-gabarits-documents.mjs : 12 → 14 cas`.
- **Registre tenu et travail publié.**
  - preuve : `oracle-todo` rend PASS, **304** actifs ; TF-1078, TF-1079, TF-1080 et TF-1086 décidés puis clos avec leur descente, TF-1081 à TF-1085 ouverts en candidats. Enregistrements `ef23b04` et `6a0a6a8` poussés sur `claude/html-quality-new-formats-qhfgvj`.

## 5. Non traité — avec son motif

- **Les trois correctifs du socle** — motif : hors mandat, `digit-ai-forge-agents` étant un dépôt frère où la règle du pilot interdit toute écriture sans mandat humain ; les trois vivent corrigés dans la bibliothèque et ouverts au registre, verdict `oracle-todo` PASS. C'est l'objet de la décision D-12.
- **Les 106 autres contrôles de la recette** — motif : hors mandat de ce tour, et leur balayage est précisément ce que la décision D-13 arbitre.
- **Les quatre familles à sources client** — motif : impossible à prouver ici, les livrables ne sont pas sur ce poste ; elles sont désormais marquées `poste-porteur` avec l'endroit où leurs sources vivent, et comptées à part.
- **Le socle n'est toujours pas publié** — motif : accès, éprouvé le 14/09 — **deux** chemins essayés, tous deux refusés au même endroit — `git -C /home/user/digit-ai-forge-agents push origin main` rend une erreur HTTP 403 du relais git, et l'API GitHub de cette session est bornée au même ensemble autorisé, qui ne contient que `iguane39/digit-ai-factory`. Le refus ne vient pas de l'outil mais de la portée de la session, et aucun troisième chemin ne la contourne depuis ce poste.
- **Le critère d'acceptation de TF-0324 reste ouvert sur sa seconde moitié** — motif : dépendance externe, il exige une instanciation sur mission **réelle**, et aucune mission réelle n'est instrumentée dans les dépôts. Les cinq exemplaires livrés sont explicitement illustratifs.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « 10a » — la bibliothèque écrit la forme, le skill garde le fond | Fait pour les cinq familles — `check_html.py` rend « Aucun problème détecté » sur les 10 pages, `render_page.py` PASS aux six largeurs, `check_markdown.py` PASS sur les 5 doctrines — et la division du travail est écrite dans chacune d'elles | Conforme à la lettre. **L'écriture dans les doctrines est un ajout** : sans elle, la contradiction se rejouerait au premier retour du skill propriétaire |
| « 11b » — marquer les familles qui attendent un poste porteur, et rendre la distinction mesurable | Fait, avec un champ à vocabulaire fermé **et** une règle d'oracle qui le tient : `oracle-gabarits-documents.mjs` rend PASS G1 à G6 et publie « 15 famille(s) html outillée(s), 5 sans point de départ — dont 4 dépendance(s) d'environnement et 1 dette(s) de travail » | Conforme à la lettre. J'ai traité « mesurable » comme exigeant un juge exécuté : un champ sans contrôle redevient de la prose, ce qui était déjà arrivé au champ `sources` |
| (non dit) | J'ai corrigé les dix pages d'hier, et deux familles plus anciennes que je n'avais pas vues | **Périmètre élargi.** Dupliquer cinq fois un socle dont je venais de mesurer les défauts aurait fait exactement ce que le mandat du 14/09 combat |
| (non dit) | J'ai changé le périmètre de mesure d'un contrôle de la recette du pilot | **Changement structurant, assumé et mesuré avant bascule** : j'ai joué les cinq largeurs manquantes une par une sur le parc avant de basculer, et vérifié qu'aucune ne rend un défaut neuf. Ce n'était pas un réglage de confort mais un défaut avéré du contrôle, dans mon périmètre d'écriture |
| (non dit) | J'ai ouvert six constats et en ai clos quatre | Le registre est le seul endroit où un défaut du socle survit à ce tour : **aucun autre chemin** n'existe depuis ce poste — l'écriture directe est interdite par la règle des dépôts frères, et le seul contournement possible est un mandat humain, que la décision D-12 met précisément à votre main |

## 7. Risques

- **Les trois correctifs restent dans la bibliothèque seule, et le parc diverge du socle.**
  - signal : un autre dépôt livre une page dont les badges sont pastel, ou dont le sommaire disparaît sur mobile.
  - parade : les trois constats sont ouverts au registre avec leur mesure et leur remède éprouvé ; la décision D-12 les sort de là ou les y laisse, explicitement.
- **Le périmètre élargi allonge la recette et quelqu'un la restreint pour gagner du temps.**
  - signal : un `--largeur 1920` réapparaît dans un script ou une habitude de commande.
  - parade : le résumé du contrôle dit désormais « périmètre RESTREINT par --largeur » quand il l'est, et le commentaire du fichier porte la mesure qui a justifié la bascule.
- **La même classe de défaut vit dans un autre contrôle et continue de rendre des verts trompeurs.**
  - signal : un livrable accepté sur une recette verte revient en retour humain pour un défaut qu'un oracle aurait dû voir.
  - parade : c'est exactement l'objet de la décision D-13, et le registre porte la classe sous TF-1086 avec sa preuve jouée.
- **Les cinq exemplaires de cadence portent des données inventées qu'on prend pour des faits.**
  - signal : quelqu'un cite un chiffre de l'exemplaire de `suivi-benefices` comme une mesure réelle.
  - parade : les cinq portent un client pseudonymisé et une mention explicite en sous-titre — exemplaire illustratif, aucune donnée réelle ; et la doctrine de la bibliothèque interdit toute donnée client dans un gabarit.
- **Les cinq formes sont écrites sans qu'aucune mission réelle les ait employées.**
  - signal : la première mission qui s'en sert demande un champ qu'aucune des cinq ne porte.
  - parade : le contrat de contenu reste chez `pilote-de-mission`, qui décide des champs dus ; la bibliothèque ne tient que la forme, et un champ nouveau s'y ajoute sans rien casser.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-33** | Répondre `D-12` et `D-13` par leur lettre — par exemple « D-12 a, D-13 a » | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, écrire dans un dépôt frère demande un mandat humain, et ouvrir un balayage de 107 contrôles engage un tour entier. Fichier à lire d'abord : `todo/TODO.md`, entrées TF-1081, TF-1082, TF-1085 et TF-1086 | les options par défaut (b) et (c) s'appliquent : le socle garde ses trois défauts, et les 106 autres périmètres restent inconnus |
| **A-34** | Publier l'enregistrement `d75d76e` du socle depuis un poste autorisé sur `digit-ai-forge-agents` | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `acces` — tentative jouée le 14/09 : `git -C /home/user/digit-ai-forge-agents push origin main` rend `access denied by the git proxy […] not in this session's authorized repository set`, erreur HTTP 403 ; l'API GitHub de la session est bornée au même ensemble, seule autre voie existante | les trois règles de composition du 14/09 ne vivent que sur ce poste, et tout autre poste juge encore avec 40 règles |
| **A-35** | Sortir la demande de fusion du brouillon, ou demander le retrait de la branche | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | tout le travail des six tours reste sur une branche latérale |
| **A-36** | Porter au socle les trois correctifs éprouvés, avec leurs fixtures rouges | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-12 (option (a)) | chaque consommateur du socle répare les trois défauts dans son coin, avec ses propres valeurs |
| **A-37** | Balayer les contrôles de la recette à la recherche d'un périmètre de mesure écrit en dur | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-13 (option (a)) | un verdict vert continue de se lire comme « conforme » là où il vaut « conforme sur le périmètre que ce contrôle a choisi » |
| **A-38** | Décider le sort des candidats TF-1075 à TF-1085 encore en attente | auto_ia | action `neuve`, **non exécutée** — motif : `gate_gouvernance`, le passage de candidat à décidé exige un décideur humain nommé et sa date | les constats restent en attente, et le compteur de récidives les ignore |
| **A-39** | Tenir la revue datée : familles outillées, constats produits par les règles neuves, retours humains par famille | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict de l'étude du 14/09 n'est jamais confronté aux faits |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les items ouverts ce jour étant des items de forge.

## 9. Traces

- `gabarits/documents/{revue-raid,rapport-avancement,compte-rendu,rex-de-fin,suivi-benefices}/` — squelette, exemplaire et doctrine ; dix pages neuves.
- `gabarits/documents/catalogue.jsonl` — 1.4.0 ; champ `empechement` à vocabulaire fermé et `sources_attendues_sur`.
- `oracles/oracle-gabarits-documents.mjs` — règle G6 et ses deux sens rouges ; self-test 12 → 14 cas.
- `scripts/verifier-rendu-instances.mjs` — le périmètre se lit dans le socle ; le constat nomme la fenêtre du défaut.
- `todo/TODO.jsonl`, `todo/TODO.md`, `todo/TODO.html`, `todo/RECIDIVES.md` — 304 actifs ; TF-1078, TF-1079, TF-1080 et TF-1086 clos avec leur descente, TF-1081 à TF-1085 ouverts.
- Enregistrements `ef23b04` et `6a0a6a8` sur `claude/html-quality-new-formats-qhfgvj`, poussés ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- **Les vingt-quatre pages HTML citées comme livrées ou corrigées dans ce tour** portent le verdict de la critique d'implémentation : **non jouée**, faute de mandat forge-design ; les deux oracles du socle sont verts sur les vingt-quatre au périmètre complet, et ce n'est pas la même chose, donc c'est dit plutôt que tu.
