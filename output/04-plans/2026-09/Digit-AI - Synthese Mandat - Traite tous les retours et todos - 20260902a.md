---
destinataire: humain
---

# Synthèse de mandat — tous les retours pris, la boîte prouvée vide, et vingt-quatre chantiers clos sur le pilot et quatre forges sœurs (02/09/2026)

## 0. Synthèse d'ouverture

Votre demande est exécutée dans ses deux temps. Les retours d'abord : la boîte d'entrée rendait vingt-huit constats ce matin, tous provoqués par le nettoyage des noms de la veille et aucun par une vraie édition ; un outil neuf le prouve avant de le consigner, les trois lots qui attendaient hors suivi sont entrés, et la boîte est vide et vérifiée. Les todos ensuite : les six candidatures en attente ont été décidées en bloc comme les deux fois précédentes, et vingt-quatre chantiers sont clos avec leur preuve mesurée — sur le pilot, et chez quatre forges sœurs sous mandat de campagne, en commits locaux jamais poussés. Ce qui change pour vous : le registre passe de trente et un à dix-neuf actifs, et la vérité tarifaire de l'étude que vous aviez demandée est écrite. Ce qui est attendu de vous : quatre décisions, dont deux nouvelles — décider les neuf candidatures entrées ce jour, et étendre le nettoyage des noms aux forges publiques.

## 1. En-tête d'identification

- **quoi** — mandat « Traite tous les retours et todos » : boîte d'entrée, registre, campagne sur les forges sœurs, une étude.
- **sur quoi** — le pilot `digit-ai-factory` ; écritures mandatées chez `digit-ai-forge-agents`, `digit-ai-forge-design`, `digit-ai-forge-tests`, `digit-ai-forge-audit` (commits locaux, aucun push) ; lecture seule chez un produit.
- **quand** — fin le **02/09/2026 à 15:30 (UTC+02:00)**, durée **≈ 2 h 35**.
- **qui** — session pilot Claude Fable 5.1 ; dépôt passé de `9ecbc57` à `5e2cc3f` puis commit de clôture ; six agents délégués (Opus 5, construction complexe), escalade de modèle : aucune.

## 2. Verdict en une ligne

**Boîte d'entrée FAIL → PASS** (5 B1 — sidecar jamais ingéré — et 23 B2 — sidecar édité après ingestion — éteints par preuve, 3 lots ingérés, 10 candidatures entrées) · **24 items clos** (5 pilot, 19 forges sœurs) et archivés, **31 → 19 actifs** · registre PASS · empreintes PASS · porte de publication 0 constat hors historique · banc pilot **84/84 recettes vertes, cliquet tenu** · bancs des forges : page-html 127 → 141, quality-oracles 170 → 186, design 83 → 101 règles, audit 10 → 11 étapes, tests 1195 → 1227.

## 3. Décisions attendues

> **D-39 — Décide-t-on en bloc les neuf candidatures entrées ce jour depuis les trois lots du produit 12 ?**
> Trois lots remis le 31/08 par le produit de consolidation de process attendaient à la porte. Ils sont entrés ce matin : dix candidatures, dont une déjà close dans l'heure parce qu'elle bloquait l'ingestion elle-même. Les neuf autres visent le pilot : deux contradictions de doctrine sur les polices et les en-têtes fixes, une teinte de refus absente de la palette documentée, une famille de gabarit manquante pour les consolidations multi-produits, une boucle de retour qui ne redescend pas chez les producteurs, l'absence d'oracle de conception, l'absence de méthode de construction d'un livrable, une mesure juste case par case et fausse en bloc, et l'avertissement d'héritage qui arrive trop tard.
> **Recommandation : (a).** Source consultée : les trois lots eux-mêmes (`input/00-retours/Produit-12 - RETOURS - 20260831d.md`, `…e.md`, `…f.md`), dont deux candidatures portent les scores les plus hauts du registre et cinq une preuve mesurée sur un livrable refusé deux fois par son lecteur ; précédents des 28/08 et 01/09 où le tri en bloc a été retenu.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider les neuf en bloc, traitement au prochain tour | simple × court pour la décision ; chantiers de complexité moyenne × durée moyenne ensuite | exclut de trier une à une — la lecture des neuf tient dans le registre |
| **(b)** trier une à une (répondre « TF-0753 oui, TF-0754 non… ») | simple × moyen pour vous | exclut le rythme : la boucle que le lot e dénonce s'allonge d'un tour |
| **(c)** ne rien décider | gratuit | exclut tout traitement : la récidive décrite au lot e reste possible |

> **Si rien n'est décidé** : (c) s'applique — les neuf candidatures restent en attente, rien ne se dégrade, et la même boucle reste ouverte.

> **D-40 — Étend-on le nettoyage des noms de produits aux quatre forges sœurs, qui sont des dépôts publics ?**
> Le nettoyage de la veille ne couvre que le dépôt du pilot. Mesuré ce jour en essai, sans rien écrire : cinq fichiers de la forge design, quarante et un de la forge des outils, soixante-dix de la forge des tests et sept de la forge d'audit portent encore un nom de produit en clair, et une référence de conception porte le nom d'un produit client. La porte de publication ne les voit pas : elle ne connaît que les noms de clients. Le coût est connu : la passe réécrit des commentaires de code et des fixtures, elle a réécrit son propre banc au pilot ce matin, et chaque forge doit rejouer le sien après.
> **Recommandation : (a).** Source consultée : `node todo/anonymiser-suivis.mjs --essai --depot <forge>` sur les quatre dépôts (comptes ci-dessus), et la décision du 28/08 « ne pas garder de trace des clients et produits », qui ne distingue pas le pilot des forges.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** jouer la passe sur les quatre forges, banc rejoué après chacune, commits locaux | moyen × moyen (quatre bancs à rejouer, exemples de code à réinventer) | exclut de laisser des noms de produits dans des dépôts publics déjà poussés |
| **(b)** ne l'étendre qu'à la référence de conception qui porte un nom de client | simple × court | exclut les 123 fichiers à noms de produits — la doctrine du 28/08 reste à moitié appliquée |
| **(c)** ne rien décider | gratuit | exclut tout nettoyage hors pilot ; le prochain push des forges publie les noms tels quels |

> **Si rien n'est décidé** : (c) s'applique — rien n'est réécrit, et la prochaine publication des forges emporte les noms.

> **D-41 — Où s'écrit la règle de précédence entre une charte posée et la liste des fontes réflexes ?**
> Le contrôle d'écriture de votre poste a bloqué quatre éditions de trois lignes sur des gabarits conformes à la charte maison, en accusant leur police. Il a été corrigé pour ne juger que le delta d'une édition (première moitié, livrée le 01/09). Reste la seconde moitié : le conflit ne vient d'aucun détecteur mécanique mais d'un texte destiné au choix des fontes d'un travail neuf, appliqué à un livrable qui a déjà sa charte. Il manque une règle qui dit que la charte posée prime, et son emplacement se décide.
> **Recommandation : (b).** Source consultée : le contenu de l'item au registre (`todo/TODO.md`, item en cours) — le contrôle d'écriture lit le registre des oracles, pas les instructions globales ; une règle écrite là où le contrôle lit est mécanisable, une règle écrite en prose ne l'est pas.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** l'écrire dans les instructions globales du poste | simple × court | exclut la mécanisation : le contrôle ne lit pas ce fichier, la règle reste une consigne |
| **(b)** l'écrire au registre des oracles, dans le profil que le contrôle applique | simple × court, plus une fixture double sens | exclut de la laisser en prose ; un livrable chartée ne pourra plus être accusé de sa police |
| **(c)** ne rien décider | gratuit | exclut toute édition d'un gabarit chartée sans friction : chaque évolution repaie le même péage |

> **Si rien n'est décidé** : (c) s'applique — l'item reste en cours, et les éditions de gabarits continuent d'être accusées sur leur police.

> **D-38 — Réécrit-on le passé du dépôt principal, ou vit-on avec une publication fermée ?**
> Rappel de la veille : l'arbre de travail du pilot est propre, mais deux cents enregistrements passés portent encore des noms de clients, et la porte de publication refuse tant qu'ils y sont. Le retirer suppose de réécrire l'ensemble des enregistrements, ce qui change leur identité et rend inutilisable toute copie existante ; une partie du passé a déjà été publiée, donc seule l'exposition future est réduite.
> **Recommandation : (b).** Source consultée : la porte de publication rejouée ce jour (`node ~/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs .`) — 200 constats, tous dans l'historique, 0 sur l'état courant ; rien ne presse tant que la publication n'est pas nécessaire.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** réécrire le passé maintenant | complexe × moyen ; toute copie existante du dépôt devient inutilisable | exclut de garder une trace consultable de ce qui a été fait sous les anciens noms |
| **(b)** garder la publication fermée, et décider à froid | gratuit ; les enregistrements s'accumulent sur ce poste seulement | exclut la publication du dépôt principal tant que rien n'est décidé |
| **(c)** publier en contournant la porte | gratuit, et le passé part en clair | exclut tout retour en arrière : ce qui est publié est publié |

> **Si rien n'est décidé** : (b) s'applique — la publication du pilot reste fermée, le travail reste sur ce poste, et rien ne se dégrade.

## 4. Traité — avec sa preuve

**Retours**
- **La boîte d'entrée est vide et prouvée vide.** Elle rendait 5 constats B1 et 23 constats B2 à l'ouverture, pour ZÉRO édition réelle : l'empreinte consignée était celle des fichiers d'AVANT la passe d'anonymisation du 01/09 (mesuré sur un sidecar : empreinte au registre = empreinte du fichier au commit 478eb82).
  - preuve : `oracle-boite-entree` FAIL → PASS ; 22 sidecars ré-empreintés avec preuve par l'historique git, 1 par rapprochement titre à titre, 26 de plus par la passe rejouée ; `oracle-todo` PASS ; `oracle-empreintes` PASS avec les deux sites neufs déclarés.
- **Un outil neuf PROUVE avant de consigner** : [reempreinter-lot.mjs](todo/reempreinter-lot.mjs) — historique git (renommages compris, second filet par les blobs du dossier), copie d'avant, ou rapprochement ; tout le reste est refusé comme édition. `anonymiser-suivis` ré-empreinte lui-même ce qu'il réécrit.
  - preuve : recette `todo/reempreinter-lot.test.mjs` **12/12** à double sens (nom inconnu refusé, B2 reproduit puis éteint, édition réelle refusée, copie fausse refusée, rapprochement à comptes inégaux refusé) ; banc `anonymiser-suivis` 7/7.
- **Les trois lots du produit 12 sont entrés** — dix candidatures (TF-0753 à TF-0762), après réindexation (un autre lot du même produit portait déjà les indices a, b, c au registre) et anonymisation SUR DISQUE par la porte explicite `anonymiser-suivis --fichiers`, l'original restant chez le produit.
  - preuve : trois ingestions (b9fef5695040, 744ced419aa7, 476b972d7e92) ; huit fichiers désormais suivis, zéro nom interdit (grep) ; note de réindexation en tête de chaque lot ; porte de publication : 0 constat hors historique.
- **TF-0761 clos dans l'heure** : l'événement d'ingestion passe par la même substitution que la candidature (champ `fichier`, événement d'héritage). En chemin, trois défauts payés et fermés : le nom du lot découpé sur `/` seulement inscrivait le CHEMIN ENTIER comme produit (24 entrées parasites retirées de la table hors dépôt) ; un nom déjà pseudonyme était réinscrit comme produit neuf (dix candidatures substituées « Produit-13 », rectifiées avant commit, garde ajoutée) ; six recettes inscrivaient leurs noms de fixture dans la table réelle (isolées).
  - preuve : recettes `ingerer-anonymise-fichier` **4/4**, `anonymiser-entrant --self-test` **6/6**, table des pseudonymes stable à 12 entrées après rejeu des neuf recettes d'ingestion.
- **TF-0742 clos** : les variantes de graphie d'un produit (espacée, tirets, soulignés, casse) sont substituées ; la passe rejouée a réécrit 92 fichiers suivis qui portaient encore une forme espacée — registre et archive compris — et ré-empreinté les 26 sidecars concernés dans le même geste.
  - preuve : essai après passe → 0 fichier à réécrire ; boîte PASS ; registre PASS.
- **Deux règles de la boîte rallumées par l'archivage, corrigées** : la dérogation d'un lot du 27/08 avait suivi ses items clos dans l'archive, que le contrôle ne lisait pas.
  - preuve : `oracle-boite-entree --self-test` 31 → **32/32** (cas « dérogation lue dans l'archive, chemin à antislashs ») ; boîte PASS après archivage.

**Todos — pilot**
- **TF-0750 clos** : R-4 de `oracles/oracle-conformite-projet.mjs` juge désormais l'UNICITÉ de l'indice par jour et par dossier (le même radical en deux formats garde son indice) — recette 45/45.
  - preuve : recette conformité 44/44 → **45/45**, fixture rouge (deux radicaux sous 20260811a) et verte (.md + .pdf).
- **TF-0740 clos** : règle R-54 (§ AH de [REGLES-PROJET.md](REGLES-PROJET.md)) — un écart ne se déclare qu'après deux questions écrites ; référentiel [PATRONS-EPROUVES.md](references/PATRONS-EPROUVES.md) ouvert avec P-1 (heure locale sur planificateur UTC, 12 cas, exclusions écrites).
  - preuve : sections présentes et citées l'une par l'autre ; mécanisation déclarée non faite avec son critère d'ouverture.
- **TF-0741 clos** : étude DataForSEO livrée, verdict GO conditionnel sur le seul palier des volumes, campagne trimestrielle, 0,24 USD par mois ; aucune dépense engagée.
  - preuve : `oracle-etude-opportunite` E1-E8 **PASS** ; 20 pages du fournisseur relevées le jour même avec URL et date ; 7 valeurs déclarées non vérifiables plutôt qu'inventées.
- **TF-0727 clos** (étude et décision D-34 livrées le 01/09 ; ce qui reste à mesurer vit dans TF-0749) ; **TF-0693 côté catalogue** (famille de la fiche sécurité complétée : allocateur, tirage PDF, porte).
  - preuve : `oracle-catalogues` PASS et `oracle-gabarits-documents` PASS après édition de `gabarits/documents/catalogue.jsonl` ; étude `output/03-etudes/20260901-etude-opportunite-strategie-tests.md` et commits de la forge des tests 4672f7a, 2626436, 07b370b cités au registre.

**Todos — forges sœurs (commits locaux, jamais poussés)**
- **Forge des outils, skill de pages HTML — TF-0720, TF-0719, TF-0694 clos** (commit b745f08, copie installée identique) : emphase neutralisée avant l'analyse des jetons, badge « acté » résolvant (L24), gouttière d'étiquettes jugée aussi sur les tableaux.
  - preuve : banc du skill 127/127 → **141/141** ; sur la fixture du 27/08 le rendu passait PASS et rend FAIL (33 %, seuil 20 %).
- **Forge des outils, skills quality-oracles et experts-forge — TF-0715, TF-0716, TF-0718, TF-0717 clos** (commits ca3d320, 2a93e7a, 32161b8, 737076f, copies installées identiques) : deux domaines neufs (autorité d'une décision affirmée, livrabilité d'une conséquence déclarée), effectif écrit en lettres rapproché du cardinal réel, fiche expert « migration de plateforme brownfield » ADMISE par le juge avec une porte sur les angles déclarés vides.
  - preuve : self-test 170 → **186** ; bruit mesuré sur 467 à 469 documents : 0 faux positif ajouté (la première version de l'effectif en donnait 19, la livrée 0) ; juge → verdict MATÉRIEL, 5 axes sur 5 ; routage 5 → 7/7.
- **Forge design — TF-0707, TF-0736, TF-0739, TF-0708 (volet design) clos** (commits 5fb269f, 67a1e6b, acb17be) : oracle du panneau de tâche, grille TYPÉ / PROPOSÉ / BORNÉ / ATTEIGNABLE et son oracle, snippet de référence du geste d'ouverture, deux motifs légitimes d'écran de création.
  - preuve : banc 27 oracles / 83 règles → **31 / 101** ; l'écran tel que livré rend 11 écarts durs, le même corrigé rend PASS ; copies installées remises à niveau (`oracle-skills --appliquer`, K2 PASS).
- **Forge d'audit — TF-0700, TF-0701, TF-0697, TF-0693 clos** (commits 3b24854, e4271b1) : PDF imprimé depuis le HTML, porte bloquante de la fiche (FS1-FS7), colonne d'intitulés réduite, allocateur d'indice vendorisé.
  - preuve : banc 10/10 → **11/11** étapes, tests 81 → 93 ; mesure au moteur 34 % → 22 % sur 8 tables ; sans preferCSSPageSize la page imprimée vaut 612×792 pt, avec 595×842 pt.
- **Forge des tests — TF-0744, TF-0728, TF-0708 (volet tests), TF-0665 clos** (commits 949d83b, 8a44495, bdf3723, 623a618) : coût par mutant DÉRIVÉ et réconcilié, constat statique croisé avec la mesure dynamique, deux motifs d'écran admis, nombres orphelins en avertissant derrière un drapeau.
  - preuve : pytest 1195 → **1227** ; 37 s × 115 refusé comme produit impossible ; 4 → 0 faux écarts par campagne ; bruit mesuré sur corpus réel 405 → 67 → 6 sur 4 886 chaînes.
- **Registre, vues et journal** : 24 items archivés (722 → 746), 19 actifs ; vues et avancement régénérés ; entrée du 02/09 dans [BOUCLE-AMELIORATION.md](BOUCLE-AMELIORATION.md).

## 5. Non traité — avec son motif

- **TF-0752** (l'historique du dépôt porte 200 noms) : *dépendance à une décision humaine* — D-38, geste irréversible, exclu du bloc décidé.
- **TF-0732** (précédence entre charte posée et fontes réflexes, en cours) : *dépendance à une décision humaine* — D-41.
- **TF-0549** (produit sans dépôt git) : *décision humaine 3c du 24/08* — laissé ouvert à dessein.
- **TF-0674, TF-0676, TF-0682** (correctifs côté produit) : *dépendance à une décision humaine* — le dépôt des lots de travaux chez le produit (D-31 du 31/08).
- **TF-0748, TF-0749** : *dépendance externe* — une campagne réelle.
- **Les neuf candidatures du jour et les deux constats en passant** (TF-0763 : recette corpus S-01 — le verdict « la forge attrape ce qu'elle doit et se tait sur ce qui va bien » — non prononçable depuis D-34 ; TF-0764 : anonymisation des forges) : *tout entre en candidat* — D-39 et D-40.
- **`versions-livrees.json` de la forge des outils** : *hors mandat* — l'oracle d'état de forge était déjà FAIL avant la campagne sur sa règle F1 (versions livrées en retard sur les versions montées) ; le fichier est partagé entre deux chantiers, laissé au tour suivant (A-6).

## 6. Écarts à la lettre

- Vous avez demandé « traite tous les retours et todos » → j'ai lu « tous » comme le mandat global qui décide en bloc les candidatures en attente (précédents des 28/08 et 01/09) → sauf TF-0752, dont le traitement est une réécriture d'historique irréversible : une décision nominative, pas un bloc.
- Le tour précédent avait écarté « par construction » les lots non suivis → je les ai anonymisés sur disque et ajoutés au suivi → un lot qui reste hors suivi reste rouge à la boîte à chaque ouverture et se ré-ajoute par erreur au premier ajout de dossier (payé deux fois le 01/09) ; l'original reste chez le produit.
- Trois lots ont été RÉINDEXÉS à la réception (a→d, b→e, c→f) → un autre lot du même produit portait déjà ces indices au registre → deux lots sous un même nom ne s'ordonnent pas ; une note en tête de chaque lot le dit.
- Deux fichiers d'outillage modifiés avant la session (le normalisateur de lots) → commités avec le tour, recette 9/9 → laisser un travail vert hors suivi est une perte, pas une prudence.
- Les items visant les forges sœurs ont été traités sous ce mandat, par des agents écrivant dans les dépôts frères → commits locaux seulement, journalisés au journal d'amélioration → le garde-fou dit « hors mandat humain explicite » ; « traite tous les todos » est ce mandat, et la publication reste un GO humain (A-5).

## 7. Risques

- La règle des variantes de graphie réécrit désormais des COMMENTAIRES de code et des exemples de recettes : elle a réécrit son propre banc ce jour (un nom de domaine réel dans un cas de test est devenu un pseudonyme, et le cas testait autre chose).
  - signal : une recette qui change de sens sans qu'on l'ait touchée ; un commentaire absurde (« X ≡ X », vu et corrigé dans un module).
  - parade : les exemples des fichiers de code sont INVENTÉS (règle déjà écrite dans l'anonymiseur, appliquée au cas payé) ; les trois fichiers de code touchés ont été relus et leurs recettes rejouées.
- Le rapprochement titre à titre est une preuve plus faible que l'empreinte : deux sidecars aux mêmes titres et contenus différents se confondraient.
  - signal : un écart de contenu découvert entre un sidecar et ses candidatures.
  - parade : la voie est explicite (`--par-rapprochement`), l'événement porte sa preuve en clair, et elle n'a servi qu'une fois, sur un sidecar entré au suivi déjà anonymisé.
- Quatre forges sœurs portent des commits locaux non poussés et des skills montés en version (quality-oracles 2.10.0, experts-forge 1.5.0, page-html 1.16.0) sans que le fichier des versions livrées suive.
  - signal : `bootstrap --pull` qui signale « en avance » ; `oracle-etat-forge` FAIL sur F1.
  - parade : la publication est un GO humain listé au bloc 8 (A-5), et le fichier des versions se solde au tour suivant (A-6).
- Le contrôle des nombres orphelins est livré derrière un drapeau absent par défaut, à 0 % de précision mesurée.
  - signal : un produit qui l'allume et reçoit six avertissements pour un seul et même nombre.
  - parade : le taux et le seuil sont écrits dans la sortie même du contrôle, et la dette qui le rendrait bloquant est nommée au registre de dette de la forge.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, chacune ouverte par son étiquette ; l'acteur dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne dit ce que coûte l'attente. **Ordre de traitement** : d'abord ce qui dépend d'une décision de ce message, parce que chaque jour d'attente allonge la boucle que le lot e dénonce ; puis ce qui ferme un défaut connu ; puis le reste hérité.

| Action | Identifiant | Quoi | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| **A-1** | TF-0753 à TF-0760, TF-0762 | Traiter les neuf candidatures du produit 12 au tour suivant, une fois D-39 tranchée : deux contradictions de doctrine (polices, en-têtes fixes), teinte de refus, famille de gabarit, redescente des retours, oracle de conception, méthode de construction, dénominateur des mesures, avertissement d'héritage chez le produit. | auto_ia | dependance_bloc_3 — D-39. | La boucle de retour dénoncée par le lot e reste ouverte : trois récidives en quatre jours sur un seul projet. |
| **A-2** | TF-0764 | Jouer la passe d'anonymisation sur les quatre forges (`node todo/anonymiser-suivis.mjs --depot ../digit-ai-forge-<nom>`), rejouer le banc de chacune, réinventer les exemples de code réécrits, commits locaux. | auto_ia | dependance_bloc_3 — D-40. | 123 fichiers de dépôts publics gardent des noms de produits en clair, et le prochain push les emporte. |
| **A-3** | TF-0732 | Écrire la règle de précédence (une charte posée prime sur la liste des fontes réflexes) à l'emplacement tranché par D-41, avec sa fixture double sens, puis clore l'item. | auto_ia | dependance_bloc_3 — D-41. | Chaque édition d'un gabarit chartée continue d'être accusée sur sa police. |
| **A-4** | TF-0752 | Trancher D-38, puis, si l'option (a) est retenue, jouer la réécriture avec `git filter-repo` dans `c:/dev/digit-ai-factory` et prévenir tout porteur d'une copie. | manuelle_utilisateur | irreversible — une réécriture d'historique casse toute copie existante ; elle ne se décide pas ici. | La publication du dépôt principal reste fermée. |
| **A-5** | `neuve` | Publier les chantiers des forges sœurs : dans chacun des quatre dépôts (`c:/dev/digit-ai-forge-agents`, `-design`, `-tests`, `-audit`), `git log origin/main..HEAD` pour relire, puis `git push`. Preuve : `node bootstrap.mjs --pull` ne signale plus d'avance. | manuelle_utilisateur | irreversible — R-38 : aucun push sans GO humain. | Dix-neuf corrections vivent sur ce poste seulement ; un produit qui tire la forge n'en bénéficie pas. |
| **A-6** | `neuve` | Mettre à jour `versions-livrees.json` dans `c:/dev/digit-ai-forge-agents` par `node .claude/skills/quality-oracles/scripts/maj-versions-livrees.mjs --livrer` pour quality-oracles 2.10.0, experts-forge 1.5.0 et digit-ai-page-html 1.16.0, puis rejouer `oracle-etat-forge`. | auto_ia | hors_mandat — du ressort de l'IA, mais d'un mandat sur la forge des outils ; le fichier était partagé entre deux chantiers concurrents ce jour. | `oracle-etat-forge` reste FAIL (F1) et la forge annonce des versions qu'elle n'a pas livrées. |
| **A-7** | TF-0763 | Instruire la recette corpus de la forge des tests (S-01) : jouer le banc rouge avec la mutation demandée (`FORGE_TESTS_MUTATION=1`) ou déclarer H-08 et A-3 comme constats du pan à la demande, puis instruire les 3 findings du banc vert. | auto_ia | gate_gouvernance — candidat, tout entre en candidat. | Un verdict de forge non prononçable depuis le 01/09 passe pour tenu. |
| **A-8** | `neuve` | Supprimer le fichier parasite `c:/dev/null` (page de redirection vers une authentification Microsoft, 1 317 octets, vérifiée sans jeton : seuls des identifiants de locataire et d'application y figurent) : `Remove-Item c:\dev\null`. | manuelle_utilisateur | irreversible — supprimer un fichier est un geste humain (R-29) ; le contrôle d'ouverture le déclare à chaque session. | L'avertissement se répète à chaque ouverture, et un fichier hors dépôt échappe à toute recherche de secret. |
| **A-9** | `neuve` | Poser le nettoyage à l'ENREGISTREMENT : un contrôle `pre-commit` dans `c:/dev/digit-ai-factory/.git/hooks/` jouant `node todo/anonymiser-suivis.mjs --essai` et refusant l'enregistrement s'il reste quelque chose à nettoyer. | auto_ia | hors_mandat — mandat propre au socle de publication, hérité du tour précédent. | Le même défaut peut revenir à chaque ajout de dossier entier, et ne se découvre qu'à la publication. |
| **A-10** | TF-0749 | Au prochain passage en production d'un produit audité, jouer la comparaison des deux campagnes : `python recette/non_perte_ciblage.py <projet>` dans `c:/dev/digit-ai-forge-tests`. | auto_ia | dependance_externe — elle exige une campagne réelle. | Le tri des tests reste éteint sans que rien ne dise s'il aurait tenu. |
| **A-11** | TF-0674, TF-0676, TF-0682 | Trancher le dépôt des lots de travaux chez le produit 02 (D-31 du 31/08), puis déposer `forge/travaux/` chez lui par `node todo/emettre-travaux.mjs`. | manuelle_utilisateur | decision — écrire chez un produit est un mandat nominatif (« ne touche pas les produits »). | Trois correctifs côté produit restent au pilot, dont la dernière barrière avant sa production. |

## 9. Traces

- Cette synthèse : output/04-plans/Digit-AI - Synthese Mandat - Traite tous les retours et todos - 20260902a.md
- Commits du pilot : 6976320 (normalisateur), bd3eaac (retours : ré-empreinte, anonymisation, lots), 5e2cc3f (todos pilot), puis le commit de clôture (registre, vues, journal, synthèse) — locaux, publication fermée (D-38)
- Commits des forges (locaux) : forge-agents b745f08, ca3d320, 2a93e7a, 32161b8, 737076f · forge-design 5fb269f, 67a1e6b, f2f03af, acb17be · forge-audit 3b24854, e4271b1 · forge-tests 949d83b, 8a44495, bdf3723, 623a618
- Outils neufs : todo/reempreinter-lot.mjs (+ recette), todo/ingerer-anonymise-fichier.test.mjs, references/PATRONS-EPROUVES.md
- Doctrine : REGLES-PROJET.md § AH (R-54), references/TODO-FORGE.md (paragraphe du 02/09), references/EMPREINTES.md (deux sites)
- Étude : output/03-etudes/20260902-etude-opportunite-dataforseo-produit-02.md
- Registre : todo/TODO.jsonl (19 actifs), todo/TODO-ARCHIVE.jsonl (746), todo/AVANCEMENT.md ; journal : BOUCLE-AMELIORATION.md (entrée du 02/09)
- Bancs : oracles/self-tests.mjs (84/84 recettes vertes, cliquet tenu) · oracle-boite-entree 32/32 · reempreinter-lot 12/12 · anonymiser-entrant 6/6 · anonymiser-suivis 7/7 · conformité projet 45/45
