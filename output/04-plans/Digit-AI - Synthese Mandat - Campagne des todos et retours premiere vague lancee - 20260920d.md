---
destinataire: humain
---

# Point d'étape — campagne des todos et retours : 17 items clos au registre, 8 constats entrés en candidats, 1 dernier agent termine le jeu des contrôles visuels sur une page servie

## 0. Synthèse d'ouverture

La boîte d'entrée des retours ne portait aucun lot en attente, et le poste est réaligné sur GitHub.
La campagne porte sur les 36 items que vous avez déjà décidés, comme vous l'avez choisi ; les 44
candidats restent en l'état. 20 de ces items sont traitables par l'IA. À cette heure, 17 items sont
clos au registre après rejeu de leurs preuves par le pilot, et les 8 constats que les agents ont vus
en passant sont entrés au registre en candidats, où ils attendent votre décision. La régression que ce rejeu avait trouvée
chez la forge des outils est corrigée : l'outil de l'agent avait réécrit des fichiers avec les fins
de ligne de Windows, ce que git ne montrait pas. 1 item reste ouvert parce qu'il suppose 2 choix de
conception qui vous reviennent. 1 dernier agent termine le jeu des contrôles visuels sur une page servie : sa part chez la forge des
outils est enregistrée, il travaille chez la forge des tests. Je rejoue pendant ce temps le harnais
complet du pilot. Rien n'est attendu de vous à cette étape : la restitution complète,
avec les décisions à prendre, suivra les derniers rapports. Rien n'est publié.

## 1. En-tête d'identification

- **quoi** — **point d'étape** de la campagne « Traite tous les todos et retours » : première vague
  reçue aux trois quarts, clôtures écrites, seconde vague lancée ; le résultat d'ensemble n'est pas
  encore mesurable.
- **sur quoi** — le pilot `digit-ai-factory` et 3 forges : `digit-ai-forge-agents`,
  `digit-ai-forge-data`, `digit-ai-forge-audit`.
- **quand** — le 20/09/2026 à 20h18 (Europe/Paris), heure relevée par commande ; l'heure de reprise
  de la session n'a pas été relevée, la durée n'est donc pas mesurée.
- **qui** — session pilot Claude Fable 5.1, pilot à `3d87a2b8` au lancement et à `0695e76d` à cette
  heure ; 7 agents de campagne délégués (6 sur le modèle Opus pour la construction complexe, 1 sur
  Sonnet pour forge-data) ; escalade de modèle : aucune.
- **intention** — que tout ce que vous avez déjà décidé au registre soit réellement corrigé, prouvé
  et clos, et que rien de ce qui est arrivé par les retours ne reste hors registre. **Test rétro** :
  partiel à cette étape — 17 items sur 36 sont clos avec preuve rejouée et descente ; la mesure
  finale attend 1 agent et le harnais complet du pilot.

## 2. Ce qui reste à mesurer, et par quoi

L'état du harnais complet du pilot après 10 enregistrements d'agents, mesuré par
`node oracles/self-tests.mjs`, lancé à cette heure ; et le dernier item, mesuré par le rejeu de
`self_test.py` du socle des pages chez forge-agents et de la suite `pytest` de forge-tests, puis sa
clôture, que `node todo/journaliser.mjs` refuse sans preuve ni descente.

## 3. Décisions attendues de vous

Rien n'attend de décision à cette étape. Les 3 bloquants ci-dessous seront repris à la restitution complète : le premier vous y sera posé en
choix fermé, le deuxième tient à la fin du dernier agent, le troisième à un run chez un produit.

Inventaire des bloquants :

- **La bascule du schéma de base de données du rapport d'audit sur le canevas de schémas** — il faut
  décider d'où viennent 4 attributs visuels que les données du rapport ne portent pas, et quelle forme
  prend la copie conforme du canevas chez la forge d'audit — si rien n'est décidé, le rapport d'audit
  garde l'ancien rendu, déclaré comme tel.
- **Le jeu des contrôles visuels sur une page servie** — il faut que son agent, parti chez la forge
  des outils puis la forge des tests, rende la main — sinon l'item reste ouvert.
- **Les 7 étapes non écrites de la chaîne de traduction et d'audit** — il faut un run réel sur un
  second produit pour observer ces étapes au lieu de les inventer — sinon l'item reste ouvert.

## 4. Traité — avec sa preuve

- **La boîte d'entrée des retours ne porte aucun lot en attente.**
  - preuve : `node oracles/oracle-boite-entree.mjs` rend `"verdict": "PASS"`, exit 0 — « 119
    sidecar(s) présent(s), tous ingérés », « aucun lot non ingéré depuis plus de 24 h ».
- **Le poste est réaligné sur GitHub, et les 36 items décidés ou en cours sont triés** : 20
  traitables par l'IA, 16 en attente d'un geste humain ou d'un run chez un produit.
  - preuve : `git pull --ff-only` a amené le pilot à `3d87a2b8` ; `git rev-list --left-right --count
    HEAD...origin/main` rendait `0 0` ; script de lecture de `todo/TODO.jsonl` sur les 17 décidés et
    les 19 en cours.
- **forge-data : une réconciliation dit combien d'entités sont en écart et combien sont identiques
  (TF-1195), et la garde du terme proscrit lit la liste des oracles sur le disque (TF-1196).**
  Classes : résultat rendu sans dénominateur ; liste écrite à la main qui dérive de son disque.
  - preuve : enregistrements locaux `b58213f` et `7d55120` ; rejoué par le pilot,
    `node oracles/self-test.mjs` rend « 362 PASS, 0 FAIL », exit 0 (356 au départ) ; la règle neuve
    RC7 et son champ `compte` sortent sur la fixture verte.
- **forge-audit : la forme native des expressions d'un rapport Power BI est jugée (TF-1183).**
  Classe : défaut réel sans contrôle.
  - preuve : enregistrement local `f209679` ; rejoué par le pilot sous Git Bash,
    `node tools/verifier.mjs` rend « 12/12 étape(s) … toutes vertes », batterie de 141 tests (135 au
    départ) ; la fixture rouge de `verifier-rapport-pbir.mjs` sort en exit 1.
- **Pilot : la coquille des pages générées passe les 2 contrôles de design de forge-design
  (TF-1162).** Classe : défaut porté par un générateur, donc par toutes ses pages.
  - preuve : enregistrement local `82a39726` ; rejoué par le pilot,
    `node scripts/oracles-design-page-generee.test.mjs` rend « 7 PASS, 0 FAIL » — la page générée
    passe, et la même page ramenée à son état d'avant est refusée par S1, S4, T1 et T3.
- **Pilot : la règle 5 dit ce que le hook fait, et le suivi des sceaux de synthèse est écrit
  (TF-1199).**
  - preuve : enregistrement local `fecca12d` ; mesure de l'agent : 23 sceaux de synthèse sont déjà suivis par
    git dans le dossier des plans du pilot, et aucune règle d'exclusion ne les écarte.
- **Pilot : les 2 derniers volets d'oracle du 08/09 sont livrés (TF-0923)** — refus d'une proposition
  sans page homonyme, refus d'une exemption d'existant que la date du premier enregistrement
  contredit.
  - preuve : enregistrement local `e6e4b469` ; rejoué par le pilot, `node oracles/self-test.mjs` rend
    « 93 PASS, 0 FAIL » (84 au départ, et non 68 comme le disait la note du 14/09).
- **Pilot : le harnais mesure pour la première fois si une recette exerce le sens rouge de son
  contrôle (TF-1082).**
  - preuve : enregistrement local `6b996b07` ; rejoué par le pilot,
    `node oracles/lib-sens-rouge.test.mjs` rend « 15/15 PASS » ; mesure de l'agent sur le parc : 72
    recettes sur 114 déclarent un cas rouge joué, 42 aucune, toutes nommées, en avertissement.
- **Les 7 clôtures et le reste de TF-0940 sont au registre, enregistrés localement.**
  - preuve : `node todo/journaliser.mjs` rend « 8 événement(s) journalisé(s) », `verdict_avant`
    PASS et `verdict_apres` PASS ; `node todo/oracle-todo.mjs` rend `"verdict": "PASS"` après
    régénération des vues ; enregistrement `827d7f6c`.
- **forge-agents : 4 items clos après 1 régression trouvée au rejeu du pilot, puis corrigée.** Classes :
  outil qui réécrit un fichier entier pour un ajout (TF-1194) ; oracles absents du registre
  (TF-1197) ; espacements hors échelle dans ce qui se copie (TF-1193, 124 mesurés pour 117
  annoncés) ; gabarit hors charte (TF-1032, réécrit sur le socle des pages). La régression : 8
  copies de travail réécrites avec des fins de ligne Windows par l'outil de recalage de l'agent,
  alors que le dépôt déclare l'autre forme — git restait muet, et la parité de 3 copies embarquées
  du socle était rompue. Ma première lecture, une retouche à la main des copies, était fausse ;
  l'agent l'a établi par mesure.
  - preuve : enregistrements locaux `5d6c716`, `4d5970c`, `c6200ac`, `7c048af`, `bb5c4a1`, `a57662d` ;
    rejoué par le pilot : le self-test de `quality-oracles` rend « 3 échec(s) », exit 1, sur
    `bb5c4a1`, puis « PASS (313 contrôles) », exit 0, sur `a57662d` ; `self_test.py` du socle rendait
    « 417/417 cas passés » sur `bb5c4a1` ; le banc du générateur d'oracles rend « PASS (6
    contrôles) ». Un cas de banc neuf refuse désormais toute fin de ligne Windows dans les skills.
- **Ces 4 clôtures sont au registre.**
  - preuve : `node todo/journaliser.mjs` rend « 4 événement(s) journalisé(s) », `verdict_avant` PASS
    et `verdict_apres` PASS ; enregistrement local `db334682`.
- **Pilot, seconde vague : 5 familles de gabarits créées et la conception d'un document jugée avant
  son écriture.** Kit partenaire, charte de partenariat, courrier fournisseur, étude de cas client
  (TF-1029) ; mode d'emploi d'un livrable remis en dossier, avec sa section obligatoire sur les choix
  d'architecture et les décisions qui les fondent, règle G7 neuve (TF-1170) ; champs « lecteur » et
  « type de contenu » au catalogue, fiche de conception et règle G6 neuve (TF-1097). Classes :
  famille de gabarit manquante ; conception d'un document non jugée.
  - preuve : enregistrements locaux `7565c8d6`, `86e195b7`, `7df3fd34`, `72db1d74` ; rejoué par le
    pilot : `node oracles/oracle-gabarits-documents.mjs --self-test` rend « 29/29 PASS » (18 au
    départ), le parc rend `"verdict": "PASS"`, le mode `--fiche` rend PASS sur l'exemple rempli et
    FAIL sur le gabarit non rempli ; 10 dossiers de famille sur disque contre 5 au départ.
- **Pilot, troisième vague : 3 items clos.** Un outil sur appel rejoue la sonde citée par une ligne de
  glossaire et confronte son résultat à un attendu daté, sans jamais exécuter de commande sans
  drapeau explicite, et le seul contrôle du pilot cité sans être appelé a désormais un appelant, en
  avertissement (TF-1084). La propagation des skills joue la vérification native de 4 dépôts
  consommateurs avant et après, et nomme celui qui passait et ne passe plus, sans jamais revenir en
  arrière (TF-0965). Un outil sème un défaut par classe et le confronte à son contrôle : 5
  couvertures prouvées, 0 déclarée et fausse, 2 non concluantes, 31 classes sans contrôle (TF-1079,
  5 classes semées pour 10 à 20 visées, écart déclaré). Classes : preuve dont la présence est jugée
  et jamais la justesse ; règle neuve mesurée chez son auteur seulement ; contrôle déclaré jamais
  éprouvé.
  - preuve : enregistrements locaux `40114ddf`, `cdf5af1f`, `a1266c8a` ; rejoué par le pilot :
    `node scripts/verifier-sonde-glossaire.test.mjs` rend « 12 PASS, 0 FAIL »,
    `node oracles/consommateurs-skills.test.mjs` rend « 14 PASS, 0 FAIL »,
    `node todo/semer-defauts.test.mjs` rend « 11 PASS, 0 FAIL », `node scripts/relever-appelants.mjs`
    rend « 109 contrôle(s), 0 sans appelant exécutable » ; la copie installée des skills porte toujours
    45 dossiers, aucun skill de banc.
- **Ces 3 clôtures, 8 constats en candidats et 2 occurrences notées sont au registre.** Les 8
  candidats : TF-1244 à TF-1251 — dont le conflit entre le contrôle de bascule de thème et le thème
  clair strict du socle, et 4 études du 14/09 citées 10 fois par le registre et absentes du disque
  comme de l'historique git. Les 2 occurrences : la recette de reconstruction d'un clone, en défaut
  sur ce poste avant toute modification (TF-1231) ; un agent qui ne rejoue pas le self-test des
  skills consommateurs (TF-1224).
  - preuve : `node todo/journaliser.mjs` rend « 3 événement(s) journalisé(s) » puis « 2
    événement(s) journalisé(s) » ; `node todo/ingerer-lot.mjs` rend « 8 candidature(s) ingérée(s) en
    CANDIDAT (lot dc2ac1df4483) » ; `node todo/oracle-todo.mjs` rend `"verdict": "PASS"` ;
    enregistrements locaux `8edd107c` et `0695e76d`.
- **Contrôles visuels sur une page servie, part de la forge des outils enregistrée, preuve rapportée
  par l'agent et non encore rejouée par le pilot (TF-1093).** Classe : contrôle joué sur fichier,
  jamais sur l'instance servie.
  - preuve : enregistrement local `aa89b18` chez forge-agents ; selon l'agent, `self_test.py` passe
    de 419 à 436 cas sans échec, et un défaut qui n'existe que sur la page servie, comme un
    croisement de 2 filtres qui vide le tableau, sont invisibles à l'ancien mode et vus par le neuf.
- **Ces 3 clôtures sont au registre, avec le routage rectifié de TF-1084.**
  - preuve : `node todo/journaliser.mjs` rend « 4 événement(s) journalisé(s) », `verdict_avant` PASS
    et `verdict_apres` PASS ; enregistrement local `02db01ab`.
## 5. Non traité — avec son motif

- La bascule du schéma de base de données du rapport d'audit sur le canevas du skill de schémas
  (TF-0940) : motif `dependance_bloc_3` — aucun mécanisme d'héritage n'existe chez forge-audit et 4
  attributs visuels du canevas ne se déduisent pas des données du rapport ; les 2 choix seront posés
  à la restitution complète.
- Le jeu des contrôles visuels sur une page servie (TF-1093) : motif `dependance_externe` — son
  agent a enregistré la part de forge-agents et travaille chez forge-tests.
- Les 7 étapes non écrites de la chaîne de traduction et d'audit (TF-1094) : motif
  `dependance_externe` — la décision d'origine interdit de les deviner ; elles se transcrivent d'un
  run réel sur un second produit, qui n'a pas eu lieu.
## 6. Écarts à la lettre

- **Vous avez demandé** de traiter tous les todos. **Je traite** les 36 items décidés ou en cours, et
  pas les 44 candidats. **Pourquoi** : c'est le périmètre que vous avez choisi à la question posée en
  début de tour, et la gouvernance du registre réserve à votre décision le passage d'un candidat en
  décidé.
- **Pour les 5 familles de gabarits neuves, l'item demandait** gabarit, squelette et instance. **L'agent
  a livré** gabarit et instance en Markdown, sans squelette HTML, au statut « ok ». **Pourquoi** : 2
  des 5 familles existantes, dont la plus récente, sont en Markdown seul, et l'oracle n'impose aucun
  format ; la nuance est écrite au catalogue : ces familles naissent d'un manque mesuré, pas d'un
  corpus. Le choix vous sera soumis à la restitution complète.
- **TF-1199 demandait de décider** si les sceaux de synthèse se suivent ou s'ignorent. **J'ai fait
  écrire** la règle qui correspond à l'état de fait : 23 sceaux déjà suivis, dont 1 publié ce
  20/09. **Pourquoi** : écrire l'inverse aurait contredit le dépôt ; le choix reste réversible.
- **J'ai enregistré localement** le registre sans vous le demander. **Pourquoi** : la règle du
  projet est l'enregistrement local dès l'écriture et la publication sur votre feu vert ; rien n'est
  publié.

## 7. Risques

- **Un agent modifie un skill versionné et la copie installée prend du retard.** C'est déjà le cas :
  5 skills de forge-agents sont en avance sur leur copie installée.
  - signal : `node oracles/oracle-skills.mjs` rend FAIL K2 ; la recette du harnais sur le parc réel
    est en défaut.
  - parade : la propagation vous sera soumise en décision à la restitution complète, elle n'est
    jamais faite en silence.
- **Un agent rejoue le self-test du skill qu'il modifie, pas celui des skills qui le consomment.**
  C'est ce qui a laissé passer la régression de ce tour jusqu'au rejeu du pilot.
  - signal : un self-test sans échec chez l'agent, en échec au rejeu du pilot.
  - parade : le pilot rejoue les self-tests de tous les skills touchés avant toute clôture ; la
    consigne est ajoutée au contrat de l'agent relancé.

## 8. Prochaines actions

Les 2 actions qui suivent sont à la charge de l'IA et s'enchaînent dans cet ordre : la réception des
rapports et leurs clôtures d'abord, la fin de la seconde vague et la restitution complète ensuite.
Aucune n'attend un geste de votre part.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Recevoir le dernier rapport (contrôles visuels sur une page servie), rejouer ses vérifications natives, écrire sa clôture au registre par `node todo/journaliser.mjs` | `auto_ia` | TF-1093 | `dependance_externe` — l'agent n'a pas encore rendu la main ; le pilot reprend à sa notification | 1 item décidé reste ouvert |
| **A-2** | Lire le harnais complet du pilot lancé à cette heure, journaliser la campagne, puis rendre la restitution complète avec les décisions sur les 16 items qui attendent un geste humain, sur le schéma du rapport d'audit, sur la propagation des skills et sur la publication | `auto_ia` | neuve | `dependance_externe` — suit A-1 et la fin du harnais, qui dure plusieurs minutes | 17 items restent sans question posée |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Enregistrements locaux, aucun publié : forge-data `7d55120`, `b58213f` ; forge-audit `f209679` ;
  forge-agents `5d6c716`, `4d5970c`, `c6200ac`, `7c048af`, `bb5c4a1`, `a57662d`, `aa89b18` ; pilot `82a39726`, `fecca12d`,
  `e6e4b469`, `6b996b07`, `827d7f6c`, `7565c8d6`, `86e195b7`, `7df3fd34`, `72db1d74`, `02db01ab`, `40114ddf`, `db334682`, `cdf5af1f`, `a1266c8a`, `8edd107c`, `0695e76d`.
- `todo/TODO.jsonl` : 17 clôtures, 2 restes, 2 occurrences notées, 8 créations en candidat ce tour ;
  lot de candidatures `input/01-candidatures/constats-campagne-20260920c.tf.jsonl`.
- Aucune page HTML livrée dans ce tour.
