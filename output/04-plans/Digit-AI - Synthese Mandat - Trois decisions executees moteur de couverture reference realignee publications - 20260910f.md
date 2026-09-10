---
destinataire: humain
---

# Synthèse de mandat — vos trois décisions sont exécutées : le moteur d'audit sait couvrir, la référence réalignée est déposée sans plus aucune erreur, et deux dépôts sont publiés (10/09/2026)

Vos trois décisions ont été suivies dans l'ordre où elles se conditionnaient. Le moteur d'audit sait désormais qu'une seule remédiation peut répondre à plusieurs règles, et il le dit au lecteur comme à la machine ; avec cela, le rapport de référence du 25 août, réaligné sur le format courant, ne porte plus aucune erreur au contrôle qui en avait compté treize sur l'original. Il est déposé là où vous l'avez dit, à côté des originaux, avec les sources qui permettent de le rejouer et la mesure de l'écart du référentiel du 21 août — lequel n'est pas convertible, c'est un chantier de contenu que j'ai ouvert au registre plutôt que d'en faire une conversion boiteuse. Enfin les deux dépôts sont publiés, le vôtre et la forge des agents, et la vérification sur une copie fraîche de ce qui est en ligne ne rend aucune réserve sur le premier et aucun bloquant sur le second. Ce qui est attendu de vous : une seule décision — publier ou non la forge d'audit, qui porte le nouveau moteur —, et deux gestes que la règle vous réserve, la propagation des skills et le sort du remisage.

## 1. En-tête d'identification

- **quoi** — exécution des décisions humaines D-7 (a), D-8 (a) et D-9 (a) du 10/09/2026 : couverture des règles au plan de remédiation chez forge-audit, dépôt des livrables réalignés chez le produit porteur des références, publication du pilot et de forge-agents.
- **sur quoi** — la factory `digit-ai-factory` (le pilot) ; sous mandat humain `digit-ai-forge-audit` (D-7), `digit-ai-forge-agents` (publication, D-9) et le produit porteur des références (dépôt, D-8).
- **quand** — 2026-09-10 15:20 UTC+02:00 (Europe/Paris), durée ≈ 1 h 10, relevée à l'horloge et non estimée.
- **qui** — pilot `digit-ai-factory`, `main` publié en `5233c2a` ; forge-agents publié en `3d16b96` ; forge-audit commit local `53ca664` ; oracles joués : `verifier-rapport.mjs`, `verifier-rapport-html.mjs`, `build-rapport.mjs`, lanceur `tools\verifier.mjs` (forge-audit), `oracle-nom-client-publie` (trois fois avant push, deux fois sur clone frais), `oracle-todo`, `oracle-boite-entree`.

## 2. Verdict en une ligne

**D-7 (a) : `couverte_par` au contrat de données de forge-audit, `couvre` au plan, `covers` au YAML, gate machine et auto-test embarqué adaptés, recette à double sens de 7 cas inscrite au workflow — batterie entière 11 groupes OK, 101 tests, rendu et remédiation 28/28 ; le rapport de référence réaligné passe `verifier-rapport-html` de 13 erreurs (original) → 1 (hier) → **0** aujourd'hui, 13 actions au plan dont 6 en couvrent 11, contrat de données PASS 18 dimensions, 175 règles, 53 constats ; D-8 (a) : 4 livrables et un dossier d'accompagnement de 7 fichiers déposés dans le dossier d'entrée du produit porteur, oracle rejoué sur le fichier déposé exit 0, fichiers non commis chez le produit ; D-9 (a) : pilot publié `9500c07..5233c2a` (14 enregistrements, porte PASS 51 constats 0 bloquant avant push, clone frais 679 commits PASS 1 constat 0 antériorité 0 bloquant, N4 et R-38 §4 lus en ligne), forge-agents publié `a539fa9..3d16b96` (11 enregistrements, porte PASS 22 constats 0 bloquant avant push, clone frais 156 commits PASS 21 antériorités 0 bloquant, section §4 reportée en ligne, 0 nom réel) ; TF-1005 clos, TF-1014 ouvert (référentiel du 21/08 : 3 thèmes sur 152, 5 noms sur 17, 9 ADR sur 33) ; forge-audit `53ca664` NON poussé (D-10) ; `oracle-todo` PASS, boîte PASS.**

## 3. Décisions attendues de l'humain

Une seule décision.

> **D-10 — Le moteur d'audit qui sait couvrir plusieurs règles est enregistré chez la forge d'audit et vérifié par sa batterie entière, mais il n'est pas publié : publie-t-on la forge d'audit maintenant ?**
>
> Votre décision D-7 couvrait l'écriture chez la forge d'audit, et votre décision D-9 nommait deux dépôts à publier, le pilot et la forge des agents — pas celle-ci. Le nouveau moteur y attend donc, dans un seul enregistrement, vérifié par onze groupes de contrôles et cent une recettes dont sept neuves. Tant qu'il n'est pas publié, seul ce poste sait couvrir : un autre poste qui régénérerait le rapport réaligné retomberait sur les dix-huit doubles charges d'hier, et le produit voisin, qui importe ce moteur par son chemin local, ne le verrait pas ailleurs qu'ici.
>
> **Recommandation : (a).** Source consultée : le noyau `CLAUDE.md`, règle R-38 §4 (un feu vert sur un travail couvre sa restitution, tout autre contenu ramène au feu vert explicite) et garde-fou « push sur GO humain » ; la batterie de la forge d'audit rejouée entière après le changement, 11 groupes OK ; et la porte de publication, qui sera rejouée juste avant le geste comme pour les deux autres dépôts. Motif du choix : le moteur est la moitié structurelle de votre décision D-7, et un moteur qui ne vit que sur un poste n'est pas un format courant.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) publier la forge d'audit, porte rejouée avant | effort simple × court ; un enregistrement | exclut de relire le moteur avant sa publication |
| (b) publier après relecture du diff du moteur | effort moyen × court ; vous voyez les quatre fichiers touchés | exclut la publication immédiate ; le produit voisin reste sur l'ancien moteur ailleurs qu'ici |
| (c) ne pas publier | effort nul | exclut que la couverture existe hors de ce poste, donc que le réaligné se régénère ailleurs sans erreur |

> **Si rien n'est décidé** : l'option (c) s'applique — le moteur reste local, et le rapport réaligné déposé chez le produit ne peut se régénérer sans erreur que depuis ce poste.

## 4. Traité — avec sa preuve

- **D-7 (a) — le moteur de forge-audit sait couvrir plusieurs règles, et la dernière erreur du réaligné est tombée : `verifier-rapport-html` 1 → 0, classe `gabarit-conception-non-jugee` refermée pour le rapport.** Une règle non conforme ou partielle porte `couverte_par` ; elle n'engendre pas sa propre action ; l'action de la porteuse NOMME les règles couvertes (champ `couvre`, colonne Source du plan rendu, `covers` au YAML de la forge). Le gate machine refuse une couverture vers une règle inconnue, conforme, ou elle-même couverte ; le moteur ne suit pas une couverture invalide ; l'auto-test embarqué en tient compte.
  - preuve : recette `tests\oracles\couverture-plan.test.mjs`, **7/7** — rouge (deux règles, même remédiation, sans couverture : rendu refusé, l'état d'avant), vert (couverte : contrat PASS, rendu PASS, une action qui nomme la couverte, `covers` au YAML), trois refus de contrat avec motif, garde (couverture invalide : la règle garde son action) ; inscrite au workflow, compte 94 → 101 ; `node tools\verifier.mjs` **11 groupes OK** ; recettes du rendu et de la remédiation **28/28** ; commit local `53ca664` chez forge-audit, arbre propre.
- **Le rapport de référence du 25/08 est réaligné sans plus aucune erreur.** Le convertisseur émet `couverte_par` sur les règles dérivées d'un même ADR ; tout le reste est inchangé (aucune valeur inventée, `_provenance` écrit).
  - preuve : `verifier-rapport.mjs` → « rapport diffusable — 18 dimensions, 175 règles, 53 constats » ; `build-rapport.mjs` → 420 Ko, plan de **13 actions** ; `verifier-rapport-html.mjs` → **exit 0**, « rendu diffusable, 18 dimensions, gate intact, contrat de restitution tenu, moteur compilé et exécuté, 7 vues, 18 tableaux filtrables, plan embarqué » ; 6 actions couvrantes, 11 règles couvertes — contre 24 actions et 18 paires identiques hier, et 13 erreurs sur l'original.
- **D-8 (a) — les livrables sont déposés à côté des originaux, avec de quoi les rejouer.** Quatre fichiers dans le dossier d'entrée du produit porteur : le rapport réaligné, son plan de remédiation, le référentiel courant généré pour le tenant, le fichier d'écart du référentiel du 21/08 ; et un dossier d'accompagnement de sept fichiers — mode d'emploi, extracteur, convertisseur, données extraites des deux références, données converties, tenant dérivé.
  - preuve : `ls` du dossier d'entrée — 442 052, 8 632, 339 885 et 5 838 octets ; `verifier-rapport-html.mjs` rejoué sur le fichier DÉPOSÉ, à son emplacement : **exit 0** ; `git status` du produit : `input/` non suivi, le commit appartient au produit ; le mandat d'écriture sur ce produit, donné avec D-8 (a), est journalisé sur TF-1005.
- **TF-1005 clos, TF-1014 ouvert.** La clôture porte les deux volets et sa descente ; le référentiel du 21/08 devient un chantier de contenu à part, mesuré.
  - preuve : `oracle-todo` **PASS** ; TF-1014 ingéré (lot `eb6ed6fe81d4`) après pseudonymisation du sidecar (1 nom substitué, 0 restant) ; mesure portée : 152 thèmes de périmètre dont 3 retrouvés, 109 types de preuve, 131 livrables, 17 noms de dimension dont 5 retrouvés, 33 ADR dont 9 absents du modèle courant.
- **D-9 (a) — le pilot est publié.** Quatorze enregistrements, dont les sept de la session voisine.
  - preuve : porte sur l'arbre juste avant le push **PASS, 51 constats, 0 bloquant** ; `git merge-base --is-ancestor` vrai ; `9500c07..5233c2a` ; après `fetch`, `origin/main` = `HEAD` = `5233c2a`, 0/0 ; clone frais à branche unique hors de c:\dev : **679 commits, 44 références, PASS, 1 constat — le verdict —, 0 antériorité, 0 bloquant** ; la règle N4 par familles et R-38 §4 y sont lus.
- **D-9 (a) — la forge des agents est publiée.** Onze enregistrements : dix de campagnes antérieures et le report de la remontée §4.
  - preuve : porte sur l'arbre juste avant le push **PASS, 22 constats, 0 bloquant** ; `a539fa9..3d16b96` ; après `fetch`, 0/0 ; clone frais : **156 commits, 21 références, PASS, 22 constats dont 21 antériorités, 0 bloquant** ; la section « Oracles portés par un engagement » y est lue, **0** nom réel.
- **La session voisine est informée** des trois exécutions, de la publication de ses enregistrements, et de ce qui lui revient — rien, la propagation étant humaine.
  - preuve : message envoyé et accusé par la messagerie inter-sessions.

## 5. Non traité — avec son motif

- La publication de la forge d'audit (`53ca664`) — motif : `gate_gouvernance`, c'est la décision D-10 ; D-9 nommait deux dépôts, pas trois.
- La propagation des skills (`bootstrap --pull`) qui installerait la section reportée et remettrait K2 au vert — motif : `gate_gouvernance`, la propagation engage toutes les sessions du poste (R-29 : les dépenses et les portes de gouvernance restent humaines).
- Le chantier de contenu du référentiel du 21/08 (TF-1014) — motif : `gate_gouvernance`, c'est une candidature, et « décide TF-1014 » est votre mot ; le pilot a mesuré, extrait et déposé, il n'écrit pas la doctrine d'audit.
- Le commit des fichiers déposés chez le produit — motif : `hors_mandat`, le mandat était le dépôt ; le commit appartient au produit et à sa session.
- Le retrait du remisage — motif : `gate_gouvernance`, supprimer est un geste humain ; l'inspection est faite.
- Les 31 autres items du registre visant le pilot — motif : `borne_atteinte`, ce tour a exécuté vos trois décisions et rien d'autre.
- La relecture humaine du contenu du rapport réaligné — motif : impossible à prouver ici ; les comptes (17 dimensions, 69 ADR, 53 constats, 12 nœuds, 5 tables, 53 lignes de reprise) sont ceux de l'extraction, et aucun oracle de forme ne mesure la conservation du sens.

## 6. Écarts à la lettre

- **Vous avez demandé** D-9 « publier les enregistrements du pilot et de la forge des agents », sur l'état que la synthèse précédente décrivait. **J'ai** publié APRÈS avoir exécuté D-7 et D-8, donc avec leur journal au registre en plus — un enregistrement de plus que décrit. **Pourquoi** : c'est le travail que vous veniez de décider dans le même message ; publier avant aurait laissé ce journal en attente d'un feu vert de plus, et l'attendre vous aurait coûté un aller-retour pour publier ce que vous aviez déjà décidé. C'est une lecture, elle est écrite ici, et la porte a été rejouée sur l'état effectivement poussé.
- **Vous avez demandé** D-8 « déposer dans le dossier d'entrée du produit porteur ». **J'ai** déposé les quatre livrables ET un dossier d'accompagnement de sept fichiers. **Pourquoi** : un livrable réaligné qu'on ne peut pas rejouer est une image, pas un standard ; le mode d'emploi dit d'où vient chaque valeur et comment régénérer, et le tenant dérivé y vit parce qu'il ne peut vivre nulle part de versionné.
- Aucun autre écart : rien d'autre que `main` n'a été poussé, sur deux dépôts, aucun forçage, porte rejouée avant chacun.

## 7. Risques

- **Le moteur de couverture n'existe que sur ce poste tant que D-10 n'est pas tranchée.**
  - signal : le rapport réaligné régénéré ailleurs rend de nouveau 18 paires d'actions identiques.
  - parade : la décision D-10, option (a) ; le dossier d'accompagnement déposé le dit en toutes lettres.
- **La section reportée sera effacée si une propagation joue depuis un poste où forge-agents n'est pas à jour.**
  - signal : `oracle-skills` K2 vert avec une copie installée revenue à 372 lignes.
  - parade : forge-agents est PUBLIÉ avec le report ; un `bootstrap --pull` sur n'importe quel poste tire d'abord la source à jour, puis propage — l'ordre est celui de l'outil ; le risque ne subsiste que pour une propagation jouée SANS pull, geste qui n'existe pas dans le mode opératoire.
- **Les livrables déposés chez le produit ne sont pas commis.**
  - signal : un `git status` du produit qui ne les porte plus après un nettoyage d'arbre.
  - parade : la session du produit les commet à son prochain tour, comme tout lot reçu ; le pilot les tient aussi dans son dossier de session jusqu'à la fin de celle-ci.
- **La couverture peut être abusée pour faire disparaître un écart en le déclarant couvert par une règle sans rapport.**
  - signal : une action dont la colonne Source couvre des règles d'une autre dimension ou d'un autre ADR.
  - parade : déclarée et non outillée — le gate vérifie l'existence, l'absence de chaîne et la présence d'un écart, pas la PARENTÉ des règles ; une règle de parenté (même ADR source) est la suite naturelle, à porter au registre si l'abus se produit.
- **La copie locale du pilot garde une histoire que ce qui est publié n'a pas, par le remisage.**
  - signal : des antériorités dans un verdict local là où le clone frais n'en compte aucune.
  - parade : lire tout verdict local avec cette réserve ; l'action A-6.

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Publier la forge d'audit, porte rejouée avant (TF-1005) | auto_ia | `gate_gouvernance` — attend la décision D-10 ; à défaut, la couverture n'existe que sur ce poste et le réaligné ne se régénère sans erreur que d'ici | simple × court |
| A-2 | Faire entrer dans le pack de dimensions de forge-audit les thèmes, preuves, livrables, barèmes et 9 ADR du référentiel du 21/08, puis juger le référentiel rendu (TF-1014) | auto_ia | `gate_gouvernance` — candidature, attend « décide TF-1014 » ; à défaut, chaque audit livre un référentiel que le commanditaire ne reconnaît pas | complexe × long |
| A-3 | Porter au registre la règle de parenté des couvertures — une règle ne se couvre que par une règle du même ADR source (neuve) | auto_ia | `borne_atteinte` — hors des trois décisions du tour ; à défaut, l'abus décrit au bloc 7 reste possible sans signal | simple × court |
| A-4 | Reprendre les 31 items restants du registre visant le pilot, TF-0959 et TF-0992 en tête de score (TF-0959) | auto_ia | `borne_atteinte` — hors du tour ; à défaut, l'écart entre le registre et l'état réel croît | complexe × très long |
| A-5 | Trancher D-10 — répondre « D-10 (a) », « (b) » ou « (c) » ; le geste qui suit est un `git push` de forge-audit, joué par l'IA (TF-1005) | manuelle_utilisateur | `decision` — R-38 §4 réserve au feu vert tout enregistrement qui n'est pas une restitution ; sinon : le moteur reste local | simple × court |
| A-6 | Retirer le remisage du 01/09 si vous le décidez — `git stash drop stash@{0}` puis `stash@{1}` (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) ; 14 identifiants tous archivés et une ligne de README ; sinon : la copie locale garde 306 enregistrements de l'ancienne histoire | simple × court |
| A-7 | Jouer la propagation `node bootstrap.mjs --pull`, maintenant que forge-agents est publié avec le report (TF-1006) | manuelle_utilisateur | `decision` — la propagation engage toutes les sessions du poste (R-29) ; sinon : K2 reste rouge et la section n'est installée nulle part | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 attend D-10, A-2 attend une décision sur TF-1014, A-3 et A-4 ne dépendent de rien ; parmi les vôtres, A-5 d'abord parce qu'elle rend le moteur disponible ailleurs qu'ici, A-7 ensuite parce que sa condition — forge-agents publié — est maintenant remplie.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Trois decisions executees moteur de couverture reference realignee publications - 20260910f.md` — ce document.
- Forge-audit, commit local `53ca664` : `tools\rapport-engine.mjs` (buildPlan, colonne Source, `covers`, auto-test embarqué), `tools\verifier-rapport.mjs` (§ 3 bis), `tests\oracles\couverture-plan.test.mjs` (7 cas), `.github\workflows\ci.yml` (recette inscrite, 94 → 101).
- Produit porteur des références, dossier d'entrée, non commis : le rapport réaligné du 25/08 et son plan (`… - 20260910a.html`, `… - 20260910a.remediation-actions.yaml`), le référentiel courant (`… - 20260910a.html`), le fichier d'écart (`… - Ecart - … - 20260910a.json`), le dossier `… - Realignement - Sources et conversion - 20260910a\` (README, extracteur, convertisseur, données extraites et converties, tenant dérivé).
- Publications : pilot `git push origin main` `9500c07..5233c2a` ; forge-agents `a539fa9..3d16b96` ; clones de vérification à branche unique, `5233c2a` (679 commits) et `3d16b96` (156 commits), supprimés après mesure.
- `todo\TODO.jsonl` : TF-1005 clos, TF-1014 créé ; `input\01-candidatures\referentiel-audit-contenu-21-08-20260910a.tf.jsonl`.
- `output\04-plans\Digit-AI - Synthese Mandat - Six actions retenues cinq faites la derniere a une erreur structurelle pres - 20260910e.md` — la synthèse précédente, dont D-7, D-8 et D-9 sont les décisions exécutées ici.
- Aucun livrable HTML n'est produit par le pilot dans ce tour : les deux HTML réalignés sont des livrables du produit porteur, jugés par l'oracle que leur famille déclare (`verifier-rapport-html.mjs`, exit 0 sur le fichier déposé) ; la critique d'implémentation de forge-design n'a pas été jouée sur eux, et c'est dit plutôt que supposé.
