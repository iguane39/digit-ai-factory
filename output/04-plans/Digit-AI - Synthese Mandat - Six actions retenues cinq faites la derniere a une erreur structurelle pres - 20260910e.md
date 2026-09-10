---
destinataire: humain
---

# Synthèse de mandat — vos six actions : cinq sont faites, la sixième bute sur une question de format que vous seul pouvez trancher, et trois décisions vous reviennent (10/09/2026)

Vous avez retenu six actions d'un coup ; j'ai lu la sixième — le mandat sur les dépôts voisins — comme couvrant les deux forges que les autres exigeaient, et je l'ai écrit tel quel au registre. Le remisage ancien est inspecté : il ne porte que des contenus déjà archivés, son retrait reste votre geste. Le registre a gagné une candidature et une classe pour la règle que vous avez adoptée hier, et deux de ses items sont clos avec la règle qui empêche la récidive du mot perdu dans le noyau — la session voisine l'a sondée avec un témoin, elle tient. La remontée d'oracle qu'une tierce session avait écrite au mauvais endroit avait déjà été effacée par une propagation, exactement comme prévu ; je l'ai reportée dans la source depuis ma lecture d'avant l'effacement, pseudonymisée. Enfin le gros chantier : le rapport de référence du 25 août est extrait, converti sans une valeur inventée et rendu par le moteur courant — de treize erreurs à une seule, et cette dernière n'est pas une erreur de données mais une différence de modèle entre « une remédiation par décision » et « une action par règle ». Le référentiel du 21 août, lui, n'est pas convertible : c'est un autre document, mesuré comme tel. Ce qui est attendu de vous : trancher cette différence de modèle, dire où déposer les livrables réalignés, et donner le feu vert de publication sur le travail de ce tour.

## 1. En-tête d'identification

- **quoi** — exécution des actions A-1 à A-6 retenues par l'humain le 10/09/2026 : réalignement des références d'audit (A-1), report de la remontée d'oracle (A-2), reprise des items du registre visant le pilot (A-3), candidature de l'oracle de R-38 §4 (A-4), inspection du remisage (A-5), mandat sur les dépôts voisins (A-6).
- **sur quoi** — la factory `digit-ai-factory` (le pilot), et sous mandat humain `digit-ai-forge-agents` et `digit-ai-forge-audit` ; en lecture seule, le produit porteur des références.
- **quand** — 2026-09-10 13:40 UTC+02:00 (Europe/Paris), durée ≈ 2 h 20, relevée à l'horloge et non estimée.
- **qui** — pilot `digit-ai-factory`, `main` local en tête du commit de ce tour, 4 en avance sur l'origine et non poussés — le mien et trois de la session voisine ; forge-agents commit local `3d16b96` ; oracles joués : `oracle-claude-md` (N4 neuve), `oracle-skills`, `oracle-todo`, `oracle-boite-entree`, lanceur `oracles\self-tests.mjs`, et chez forge-audit `verifier-rapport.mjs`, `build-rapport.mjs`, `build-referentiel.mjs`, `verifier-rapport-html.mjs`.

## 2. Verdict en une ligne

**A-6 : mandat journalisé sur TF-1005 et TF-1006, lu comme couvrant forge-audit et forge-agents, écriture seule ; A-4 : classe `regle-ecrite-sans-oracle-qui-la-joue` (référentiel 1.6.0) et candidature TF-1011 ingérées, `oracle-todo` PASS ; A-3 : TF-1004 clos sur la preuve du cliquet (banc de 11 cas enregistré le 09/09), TF-1010 clos avec la règle N4 (aucun quantificateur ne disparaît du noyau) d'`oracle-claude-md` (self-test 9 → 14, sondée par la session voisine avec témoin aveugle) ; A-2 : la remontée §4 était déjà EFFACÉE par une propagation (copie revenue à 372 lignes, date de la source rendue par `copyFileSync`), reportée dans la source versionnée chez forge-agents depuis ma lecture d'avant l'effacement, pseudonymisée (2 noms, 0 refus), commit local `3d16b96`, `oracle-skills` K2 (la copie installée diverge de sa source) FAIL dans le sens attendu jusqu'à propagation ; A-5 : remisage inspecté — 14 identifiants tous archivés (4 occurrences chacun), une ligne de README, rien de vivant ; A-1 : rapport du 25/08 extrait (17 dimensions, 69 ADR, 53 constats), converti sans valeur inventée, contrat de données PASS (18 dimensions, 175 règles, 53 constats), rendu par le moteur courant **13 erreurs → 1**, la dernière STRUCTURELLE — 24 règles non conformes derrière 13 ADR, 74 règles partageant une remédiation, 18 paires d'actions identiques ; référentiel du 21/08 mesuré NON convertible (3 thèmes sur 152, 5 noms sur 17, 9 ADR sur 33 absents) ; suite du pilot 103/104, le seul défaut étant K2 attendu ; registre 169 clos, 29 décidés, 11 en cours, 21 candidats ; rien n'est poussé.**

## 3. Décisions attendues de l'humain

Trois décisions, dans l'ordre où elles se conditionnent.

> **D-7 — Le format courant projette chaque règle non conforme en une action, la référence portait une remédiation par décision d'architecture : lève-t-on la dernière erreur en apprenant au moteur qu'une action peut couvrir plusieurs règles, ou en ré-auditant le contenu à la règle ?**
>
> Le rapport de référence jugeait soixante-neuf décisions d'architecture ; le modèle courant juge cent soixante-quinze règles, chacune dérivée d'une ou plusieurs de ces décisions. En descendant les verdicts de la décision vers ses règles — dérivation écrite, jamais présentée comme une équivalence —, vingt-quatre règles ressortent non conformes derrière treize décisions seulement, et le moteur courant fait de chacune une action du plan de remédiation : dix-huit paires d'actions au texte identique, que l'oracle de rendu refuse à raison comme doubles charges. J'ai essayé un texte « couvert par la règle voisine » : l'oracle a compté le gabarit lui-même comme redite, et il avait raison. Il reste donc une seule erreur, et elle n'est pas dans les données — elle est entre deux modèles.
>
> **Recommandation : (a).** Source consultée : `tools\rapport-engine.mjs` de forge-audit — la fonction qui construit le plan tire une action par règle non conforme « jamais écartée silencieusement », sans aucun champ qui permette de dire qu'une action en couvre d'autres ; et le message de l'oracle lui-même, qui demande de « rapprocher, ou dire pourquoi les deux sont distinctes », c'est-à-dire un moyen de le déclarer qui n'existe pas encore. Motif du choix : une décision d'architecture non tenue est UN écart, et le plan doit pouvoir le dire en une ligne ; c'est un champ, une ligne de plan et une fixture chez forge-audit, sous le mandat que vous avez donné, et cela sert tous les rapports futurs — le ré-audit à la règle coûterait un audit entier pour un document du 25 août.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) le moteur apprend qu'une action couvre plusieurs règles — un champ de règle, une ligne de plan, une fixture double sens, chez forge-audit sous mandat | effort moyen × court ; un changement du moteur que le produit voisin utilise aussi, rejoué sur sa recette | exclut de laisser le format tel qu'il est |
| (b) ré-auditer le contenu à la règle, pour que chaque règle ait sa remédiation propre | effort complexe × long ; un audit entier refait sur un livrable d'août | exclut toute livraison du réaligné avant cet audit |
| (c) accepter le réaligné avec sa dernière erreur déclarée | effort nul ; le livrable dit lui-même qu'il n'est « pas diffusable » | exclut qu'il serve de standard, ce qui était son objet |

> **Si rien n'est décidé** : l'option (c) s'applique de fait — le réaligné reste hors dépôt avec sa dernière erreur, et le commanditaire continue de comparer les rapports à des références sur un format périmé.

> **D-8 — Les deux livrables réalignés et le fichier d'écart du référentiel vivent dans un dossier de session, avec un tenant dérivé au nom du client : où les dépose-t-on ?**
>
> Le rapport réaligné du 25 août, le référentiel courant généré pour le même client et le fichier qui mesure l'écart du référentiel du 21 août sont produits, jugés, et rangés hors de tout dépôt, parce que la forge d'audit ne porte aucun client réel et que le pilot ne publie aucun nom réel. Ils appartiennent au produit qui tient les références — celui dont le commanditaire a désigné ces documents comme le standard —, et écrire chez lui n'est pas couvert par le mandat d'hier, qui nommait deux forges. Tant qu'ils ne sont pas déposés, ils n'existent que sur ce poste.
>
> **Recommandation : (a).** Source consultée : `gabarits\documents\catalogue.jsonl`, entrée `gd-rapport-audit`, qui porte votre arbitrage D-2 et écrit que le travail restant « appartient à digit-ai-forge-audit et au produit porteur des références » ; et le noyau `CLAUDE.md`, garde-fou « aucune écriture dans les dépôts frères hors mandat humain ». Motif du choix : c'est là que le commanditaire ira les chercher, à côté des originaux qu'il a désignés.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) déposer dans le dossier d'entrée du produit porteur des références, à côté des originaux — mandat d'écriture sur ce produit à donner | effort simple × court ; trois fichiers copiés, un mandat de plus | exclut de les garder hors de portée du commanditaire |
| (b) déposer dans le produit du client audité (celui de la Produit-11) — mandat à donner | effort simple × court ; même geste, autre destinataire | exclut que le produit qui les a demandés les voie sans détour |
| (c) les laisser hors dépôt jusqu'à la décision D-7 | effort nul | exclut toute relecture par le commanditaire d'ici là |

> **Si rien n'est décidé** : l'option (c) s'applique — les fichiers restent dans le dossier de session, et ils disparaîtront avec lui.

> **D-9 — Le travail de ce tour est enregistré localement dans deux dépôts, le pilot et la forge des agents : publie-t-on ces deux enregistrements ?**
>
> Chez le pilot, quatre enregistrements attendent : le mien porte la règle N4 du noyau, une classe et une candidature, le mandat journalisé, deux clôtures et l'avancement des deux items sous mandat ; les trois autres sont ceux de la session voisine — son alerte sur le référentiel installé, la rectification de cette alerte, et sa sonde de la règle N4 —, tous des restitutions et des lignes de registre. Chez la forge des agents, un enregistrement porte la remontée d'oracle reportée dans sa source, pseudonymisée. Ni l'un ni l'autre n'est une restitution : la règle que vous avez adoptée hier les renvoie donc à votre feu vert. La forge des agents porte en outre dix enregistrements antérieurs non publiés, issus de campagnes, qui partiraient avec le mien.
>
> **Recommandation : (a).** Source consultée : le noyau `CLAUDE.md`, règle R-38 §4 (un feu vert sur un travail couvre sa restitution, tout autre contenu ramène au feu vert explicite) et garde-fou « push sur GO humain ». Motif du choix : la règle N4 protège le noyau de tous les postes dès qu'elle est publiée, et la remontée reportée ne sera installée nulle part tant que sa source n'est pas publiée puis propagée.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) publier les deux, porte rejouée avant chacun | effort simple × court ; onze enregistrements chez la forge des agents, quatre chez le pilot | exclut de relire les dix enregistrements de campagne avant leur publication |
| (b) publier le pilot seul | effort simple × court | exclut que la remontée reportée soit un jour propagée |
| (c) ne rien publier | effort nul | exclut que N4 protège un autre poste que celui-ci |

> **Si rien n'est décidé** : l'option (c) s'applique — les deux enregistrements restent locaux.

## 4. Traité — avec sa preuve

- **A-6 — le mandat est journalisé, avec sa lecture.** L'action ne nommait aucune forge ; le pilot l'a lue comme couvrant les deux que A-1 et A-2 exigeaient, écriture seule, publication non couverte.
  - preuve : deux événements `maj` sur TF-1005 et TF-1006, décideur « humain (mandat A-6 du 10/09/2026) », `oracle-todo` **PASS**.
- **A-4 — la seconde condition de R-38 §4 a sa classe et sa candidature.** Aucune classe du référentiel ne couvrait « une règle écrite que rien ne joue » ; elle est créée, distinguée du contrôle sans fixture et du contrôle mort.
  - preuve : `todo\CLASSES.json` 1.5.0 → **1.6.0**, 60 classes ; candidature ingérée en TF-1011 (`ingerer-lot` OK, classe suspecte signalée par la contre-métrique comme il se doit) ; `oracle-todo` **PASS**.
- **A-3 — TF-1004 clos : le banc du générateur de réécriture est au cliquet depuis le 09/09.** La session voisine, auteure de l'item, refusait la clôture sans cette moitié ; elle est faite par construction, et elle l'a vérifié.
  - preuve : `oracles\baseline-recettes.json` porte `scripts/generer-remplacements-historique.test.mjs → {cas: 11, vu_le: 2026-09-09}` ; banc rejoué ce matin, 11 PASS ; clôture journalisée avec sa descente.
- **A-3 — TF-1010 clos : règle N4 d'`oracle-claude-md`, `oracle-claude-md` FAIL → PASS sur le cas exact du 10/09, classe `quantificateur-sacrifie-au-budget-du-texte` refermée.** Compare le noyau de travail à sa version commise, liste close de vingt formes, FAIL à toute baisse en nommant le mot et les deux comptes, déplacement à compte égal PASS, hors dépôt NON_JUGÉ.
  - preuve : self-test **9/9 → 14/14** dont « seulement » retiré → FAIL « seulement » 1 → 0 ; noyau réel PASS v1.3.0 ; sondé par la session voisine sur un dépôt jetable avec TÉMOIN — la version d'avant rend zéro constat sur le même cas, donc le rouge prouve la règle et non un cliquet préexistant ; cliquet I5 9 → 14.
- **A-2 — la remontée §4 est reportée dans la source, après avoir été effacée (TF-1006).** Mesuré : copie installée revenue à 372 lignes identiques à la source, datée du 08/09 20:02 ; `copyFileSync` sur Windows rend à la cible la date de la source (vérifié par la session voisine sur un fichier vieilli de 48 h) ; ma lecture du 10/09 à 08:30 — 378 lignes, six lignes de diff — est donc celle d'AVANT, la sienne celle d'APRÈS.
  - preuve : `git show 3d16b96` chez forge-agents, 9 lignes ajoutées ; deux pseudonymes présents (le client et le produit, un chacun), et **zéro** occurrence du nom réel du client dans la source — mesuré par `grep` insensible à la casse, la graphie réelle n'est pas recopiée ici précisément pour que ce document reste vrai après pseudonymisation ; anonymiseur : 2 noms substitués, **0 refus** ; `oracle-skills` K2 **FAIL** dans le sens attendu (source en avance) jusqu'à `bootstrap --pull`.
- **A-5 — le remisage est inspecté, et il ne porte rien de vivant.** Deux entrées du 01/09 : une ligne de README régénérée, et une réingestion de quatorze candidatures.
  - preuve : `git stash show --stat` — 1 fichier / 1 ligne, puis 2 fichiers / 25 lignes ; les quatorze identifiants TF-0700 à TF-0713 sont TOUS à l'archive du registre (4 occurrences chacun), aucun au registre actif ; son retrait reste votre geste (R-29 : les dépenses et les portes de gouvernance restent humaines).
- **A-1 — le rapport du 25/08 est extrait, converti et rendu au format courant, contrat de données PASS, rendu 13 → 1.** Extraction par appariement de crochets et évaluation de chaque littéral seul (aucun code de rendu exécuté) : 17 dimensions, 69 ADR jugés, 53 constats, 45 actions de référence, 12 nœuds d'architecture, 5 tables, 53 lignes de reprise. Conversion sans valeur inventée, chaque dérivation écrite dans `_provenance`.
  - preuve : `verifier-rapport.mjs` → « rapport diffusable — 18 dimensions, 175 règles, 53 constats » exit 0 ; `build-rapport.mjs` → 431 Ko, plan de 24 actions ; `verifier-rapport-html.mjs` → **13 erreurs sur l'original, 1 sur le réaligné** ; verdicts dérivés : 51 conformes, 24 partiels, 53 sans objet avec le motif de la référence, 47 à évaluer faute d'ADR source jugé, 128 règles portant `adr_juge` ; 18e dimension hors applicabilité avec motif ; porte calculée par le format, celle de la référence conservée en donnée.
- **A-1 — le référentiel du 21/08 est mesuré non convertible, et le référentiel courant est généré pour le même client.**
  - preuve : `build-referentiel.mjs` → 18 dimensions, 175 contrôles, 323 Ko ; écart mesuré et écrit dans un fichier à côté : 152 thèmes de périmètre dont **3** retrouvés tels quels, 109 types de preuve, 131 livrables attendus, 17 noms de dimension dont **5** retrouvés, 33 ADR cités dont **9** absents du modèle courant.

## 5. Non traité — avec son motif

- La dernière erreur du réaligné (18 paires d'actions identiques) — motif : `dependance_bloc_3`, c'est la décision D-7 ; la lever par un texte gabarit a été essayé et refusé par l'oracle, à raison.
- Le réalignement du référentiel du 21/08 — motif : `dependance_bloc_3` — ce n'est pas une conversion mais un chantier de contenu du pack de dimensions de forge-audit (thèmes, preuves, livrables, barème par dimension, 9 ADR), ouvert par D-7 s'il l'est.
- Le dépôt des livrables réalignés — motif : `dependance_bloc_3`, c'est la décision D-8 ; le produit porteur n'est pas dans le mandat.
- La propagation de la remontée reportée (`bootstrap --pull`) — motif : `gate_gouvernance`, la propagation est la décision humaine R-29 ; K2 reste rouge jusque-là.
- Le retrait du remisage — motif : `gate_gouvernance`, supprimer est un geste humain ; l'inspection est faite.
- Les 33 autres items du registre visant le pilot — motif : `borne_atteinte` ; A-3 a été traitée par score et par ce que les lots du jour désignaient, deux items clos, deux avancés.
- Les deux fichiers non suivis `oracles\pre-commit-quantificateurs.*` — motif : `hors_mandat`, c'est l'action A-109 de la session voisine, en cours chez elle ; ils ne sont pas dans mon enregistrement.

## 6. Écarts à la lettre

- **Vous avez demandé** A-6 « ouvrir un mandat, nommer les forges » sans nommer de forge. **J'ai lu** le mandat comme couvrant `digit-ai-forge-audit` et `digit-ai-forge-agents`, les deux que A-1 et A-2 exigeaient, et aucune autre. **Pourquoi** : c'est la lecture la plus étroite qui rende vos autres actions exécutables ; elle est écrite au registre comme une lecture, et le produit porteur des références, que A-1 aurait pu impliquer, n'y est pas.
- **Vous avez demandé** A-5 « inspecter puis garder ou retirer ». **J'ai** inspecté et je n'ai pas retiré. **Pourquoi** : supprimer est un geste humain, et le retrait est le vôtre sur la preuve donnée.
- **Vous avez demandé** A-1 « réaligner en conservant le contenu ». **J'ai** livré le rapport à une erreur près et déclaré le référentiel non convertible. **Pourquoi** : la dernière erreur est une différence de modèle, pas de données, et la trancher moi-même aurait été soit maquiller un doublon, soit changer le moteur d'une forge que d'autres utilisent sans vous le dire ; le référentiel est un autre document, et le dire vaut mieux qu'une conversion qui perdrait 149 thèmes sur 152.

## 7. Risques

- **La remontée reportée sera de nouveau effacée si la propagation joue AVANT la publication de forge-agents.**
  - signal : `oracle-skills` K2 vert avec une copie installée de 372 lignes — c'est-à-dire l'installée redevenue égale à une source qui n'a pas reçu le report.
  - parade : la propagation lit la source LOCALE de forge-agents, qui porte `3d16b96` ; le risque ne se réalise que sur un autre poste, après publication partielle — D-9 (a) le ferme.
- **Le moteur de forge-audit, s'il change pour D-7 (a), est celui que le produit voisin utilise.**
  - signal : sa recette rouge après le changement.
  - parade : rejouer la recette de forge-audit et le rapport du produit voisin avant tout commit — c'est la condition écrite dans l'option.
- **Les livrables réalignés portent un nom de client et des données personnelles de porteur.**
  - signal : l'un d'eux copié dans un dépôt publié.
  - parade : ils vivent dans un dossier de session non versionné, avec un tenant dérivé jamais commis ; D-8 nomme le seul lieu légitime.
- **La lecture étroite du mandat A-6 peut être plus étroite que votre intention.**
  - signal : vous attendiez que les livrables soient déjà déposés chez le produit.
  - parade : D-8 le pose ; un mot élargit le mandat.

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Apprendre au moteur de forge-audit qu'une action couvre plusieurs règles — champ, ligne de plan, fixture double sens — puis rejouer le réaligné jusqu'à exit 0 (TF-1005) | auto_ia | `dependance_bloc_3` — attend D-7 (a) ; à défaut, le réaligné garde sa dernière erreur et ne peut pas servir de standard | moyen × court |
| A-2 | Déposer les trois fichiers réalignés à l'endroit décidé, avec le tenant dérivé (TF-1005) | auto_ia | `dependance_bloc_3` — attend D-8 et son mandat ; à défaut, ils disparaissent avec le dossier de session | simple × court |
| A-3 | Publier les enregistrements du pilot et de forge-agents, porte rejouée avant chacun (TF-1006) | auto_ia | `gate_gouvernance` — attend D-9 ; à défaut, N4 ne protège que ce poste et le report n'est jamais propagé | simple × court |
| A-4 | Faire entrer dans le pack de dimensions de forge-audit les thèmes, preuves, livrables, barèmes et 9 ADR du référentiel du 21/08 (TF-1005) | auto_ia | `dependance_bloc_3` — chantier de contenu ouvert par D-7 ; à défaut, le référentiel courant reste un autre document que celui que le commanditaire désigne | complexe × long |
| A-5 | Reprendre les 33 items restants du registre visant le pilot, TF-0959 et TF-0992 en tête de score (TF-0959) | auto_ia | `borne_atteinte` — hors du tour ; à défaut, l'écart entre le registre et l'état réel croît | complexe × très long |
| A-6 | Trancher D-7, D-8 et D-9 — répondre « D-7 (a) », « D-8 (a) », « D-9 (a) » ou vos options ; les gestes qui suivent sont joués par l'IA (TF-1005) | manuelle_utilisateur | `decision` — un changement de format qui touche un moteur partagé, un dépôt chez un produit hors mandat, et deux publications réservées au feu vert (R-38 §4) ; sinon : les trois options (c) s'appliquent et rien ne bouge | simple × court |
| A-7 | Retirer le remisage du 01/09 si vous le décidez — `git stash drop stash@{0}` puis `stash@{1}` (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) ; l'inspection montre 14 identifiants tous archivés et une ligne de README ; sinon : la copie locale garde 306 enregistrements de l'ancienne histoire | simple × court |
| A-8 | Jouer la propagation `node bootstrap.mjs --pull` une fois forge-agents publié, pour installer la remontée reportée (TF-1006) | manuelle_utilisateur | `decision` — la propagation engage toutes les sessions du poste (R-29) ; sinon : K2 reste rouge et la section n'est installée nulle part | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 et A-4 attendent D-7, A-2 attend D-8, A-3 attend D-9, A-5 seule ne dépend de rien ; parmi les vôtres, A-6 d'abord parce qu'elle débloque trois des cinq actions de l'IA, A-8 après A-6 parce qu'elle suppose la publication.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Six actions retenues cinq faites la derniere a une erreur structurelle pres - 20260910e.md` — ce document.
- Pilot : `oracles\oracle-claude-md.mjs` v1.3.0 (N4) ; `todo\CLASSES.json` 1.6.0 ; `todo\TODO.jsonl` (TF-1004, TF-1010 clos ; TF-1005, TF-1006 en cours ; mandat) ; `input\01-candidatures\oracle-condition-restitution-seule-20260910a.tf.jsonl` (TF-1011) ; un enregistrement local non poussé.
- Forge-agents : `.claude\skills\quality-oracles\references\registre-oracles.md`, section reportée avec sa note, commit local `3d16b96`.
- Dossier de session (hors dépôt) : le rapport réaligné du 25/08 et son plan de remédiation, le référentiel courant généré pour le tenant dérivé, le fichier d'écart du référentiel du 21/08, le convertisseur et ses données extraites avec leur bloc de provenance.
- Aucun livrable HTML n'est DÉLIVRÉ dans ce tour : les deux HTML réalignés sont produits et jugés (`verifier-rapport-html.mjs`), mais ils restent hors dépôt jusqu'à D-8 ; la critique d'implémentation de forge-design n'a pas été jouée sur eux, et ils ne sont cités comme livrés nulle part.
