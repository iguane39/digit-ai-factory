---
destinataire: humain
---

# La boîte d'entrée est vide, 15 todos sont clos, et une campagne travaille encore

## 0. Synthèse d'ouverture

Les 7 lots de retours qui attendaient sont entrés au registre, et la boîte d'entrée est prouvée
vide. 15 todos sont clos, chacun sur une preuve que j'ai rejouée moi-même après la campagne qui
l'a corrigé. Une campagne travaille encore, au pilot, et son résultat n'est pas mesurable à cette
heure. Ce qui change pour vous : le format de restitution exige désormais qu'une option qui vous
demande un geste dise comment le faire. Ce qui est attendu de vous : une réponse, sur le moment où les outils corrigés
doivent remplacer ceux qui s'exécutent sur ce poste, et un feu vert pour publier la forge d'audit.

## 1. En-tête d'identification

- **quoi** — **point d'étape** du mandat transverse « Traite les todos et retours ».
- **sur quoi** — le pilot `digit-ai-factory` ; campagnes rendues chez `digit-ai-forge-data`,
  `digit-ai-forge-development`, `digit-ai-forge-audit`, `digit-ai-forge-agents` et au pilot ; campagne en cours au pilot.
- **quand** — le 17/09/2026, de 15h10 à 17h30 (Europe/Paris), durée 2 h 20.
- **qui** — session pilot Claude Fable 5.1 ; dépôt passé de `eb90ae0` à `26d1db9` ; 8 agents de
  campagne délégués (6 Opus 5, 2 Sonnet 5), escalade de modèle : aucune.
- **intention** — vider ce qui attend et faire baisser la file des todos. **Test rétro** : à la
  fin du mandat, la boîte d'entrée est vide et le nombre de todos ouverts a baissé, chaque clôture
  portant une preuve rejouée par le pilot.

## 2. Verdict en une ligne

**Point d'étape** · boîte d'entrée **PASS**, 7 lots ingérés · 14 demandes neuves entrées, **18
candidats décidés**, 1 laissé à votre arbitrage · **15 todos clos** sur preuve rejouée, 7 campagnes
rendues sur 8 · file ouverte à 45 todos, comme à l'ouverture, 15 étant entrés pendant le tour ·
harnais du pilot **124/125**, le seul défaut étant antérieur. Reste à mesurer : les corrections
de la campagne en cours, que le pilot sondera en rejouant la vérification native du dépôt.

## 3. Décisions attendues de vous

**Bloquants à lever pour avancer** :

- **la mise en service sur ce poste des 3 outils corrigés de `digit-ai-forge-agents` est à
  l'arrêt** ; il faut votre réponse à D-1 ; sans elle, le poste exécute encore les versions
  d'avant la correction ;
- **la preuve sur Linux de la correction des polices de `digit-ai-forge-audit` est à l'arrêt** ;
  il faut votre feu vert de publication de ce dépôt, que le pilot exécutera ; sans lui, la
  correction reste prouvée sur ce seul poste et le todo TF-1020 reste ouvert ;
- **la clôture des todos confiés à la campagne en cours est à l'arrêt** ; rien n'est à fournir,
  son rapport réveille le pilot ; si elle ne rend pas, ses todos restent ouverts et le pilot
  reprend le chantier ;
- **l'indexation au pilot de la procédure de migration Power BI est à l'arrêt** ; rien n'est à
  fournir, elle se fait quand la campagne en cours libère le dépôt du pilot ; d'ici là la
  procédure existe chez `digit-ai-forge-data` sans être citée par le pilot ;
- **l'enregistrement du registre des comptes de cas des recettes est à l'arrêt** ; il faut que l'autre
  session du jour enregistre sa ligne, ou s'arrête ; d'ici là les 6 comptes montés vivent sur le
  disque, et le cliquet des recettes les lit quand même ;
- **les 9 todos dont la correction vit chez un produit sont à l'arrêt** (TF-0549, TF-0674,
  TF-0676, TF-0682, TF-1031, TF-1078, TF-1090, TF-1105, TF-1160) ; ils s'exécutent au prochain run
  ouvert chez chaque produit concerné ; d'ici là ils restent ouverts au registre, sans rien
  dégrader d'autre.

> **D-1 — Les outils corrigés de `digit-ai-forge-agents` remplacent-ils dès maintenant ceux qui s'exécutent sur ce poste ?**
> La campagne du jour a corrigé le socle des pages HTML `digit-ai-page-html`, le registre du skill
> `quality-oracles` et le hook d'écriture `qo-gate-write.mjs`. Ces corrections vivent dans le dépôt
> `digit-ai-forge-agents`. Ce qui s'exécute sur ce poste est une copie installée sous votre profil,
> hors de tout dépôt, et elle date d'avant. Le contrôle `oracle-skills.mjs` compte 7 écarts entre
> les deux, dont une part précède ce tour. La règle du pilot réserve cette recopie à votre mot.
>
> **Recommandation : (a).** Source consultée : `gabarits/AGENT-CAMPAGNE.md`, section « Gate de
> propagation des skills » — un écart né d'une campagne se règle dans la même session, sur décision
> humaine explicite, jamais reporté ; l'écart a déjà été payé 2 fois.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** le pilot recopie maintenant, par `node oracles/oracle-skills.mjs --appliquer` | simple × court — une commande, puis le contrôle se rejoue | exclut de garder sur ce poste les versions d'avant, y compris pour les sessions ouvertes en parallèle |
| **(b)** attendre la publication de `digit-ai-forge-agents`, la recopie se jouant seule à l'ouverture de session suivante | gratuit aujourd'hui, mais la publication de 24 enregistrements reste à décider | exclut que les pages produites d'ici là bénéficient des 3 corrections |
| **(c)** ne rien décider | gratuit | exclut tout : le poste continue d'exécuter ce qui n'est plus versionné, et le harnais du pilot reste à 124/125 |

> **Si rien n'est décidé** : (c) s'applique — rien ne casse, les corrections restent sans effet sur
> ce poste.

## 4. Traité — avec sa preuve

- **La boîte d'entrée est vide : 7 lots accueillis et ingérés**, dont 4 arrivés sous un nom réel
  et pseudonymisés par `node todo/accueillir-lot.mjs`.
  - preuve : `node oracles/oracle-boite-entree.mjs` est passé de FAIL sur 3 constats B1 à **PASS**,
    rejoué après le dernier lot ; `node todo/oracle-todo.mjs` exit 0.
  - 10 demandes sont entrées par ces lots, TF-1170 à TF-1177, TF-1179 et TF-1180 ; 8 sont des
    récidives marquées, dont 5 de la classe `controle-vrai-sur-le-mauvais-invariant`.
- **18 candidats sont décidés sous votre mandat du jour**, aucun n'atteignant le seuil d'étude.
  - preuve : `node todo/appliquer-export.mjs` a rendu « 12 décidé(s) » sur
    `todo/TF-decisions-20260917b.json`, puis « 6 décidé(s) » sur `todo/TF-decisions-20260917c.json`.
  - TF-1178 reste candidat : il demande une étude complémentaire sur les réseaux sociaux, il vient
    d'une autre session, et son score le place au-dessus du seuil d'étude.
- **TF-1172 est clos : une option qui vous demande un geste dit comment le faire.** Règle `S49`
  d'`oracles/oracle-synthese.mjs`, `gabarits/RESTITUTION.md` en 2.24.0, enregistrement `be80825`.
  - preuve, rejouée : `node oracles/oracle-synthese.mjs --self-test` rend 29/29, contre 28 ; taux
    d'accusation mesuré par la campagne sur 148 synthèses : 3, soit 2,0 %.
- **TF-1169, TF-1171 et TF-1177 sont clos**, enregistrements `d72b814`, `ea3cd8f` et `12a84da` : le
  cliquet des recettes ne lit plus une date comme un compte de cas ; la recopie d'héritage ne
  refuse plus à cause de ce que le pilot vient lui-même de recopier ; le nommage daté juge un
  dossier livré, plus ses images internes.
  - preuve, rejouée : `oracles/lib-baseline-recettes.test.mjs` 17 PASS contre 16 ;
    `scripts/recopier-heritage.test.mjs` 14 PASS contre 12 ; `oracles/self-test.mjs` 82 PASS
    contre 81 ; 0 FAIL partout. Classe : `controle-vrai-sur-le-mauvais-invariant`.
- **TF-1181 est clos : l'outil d'accueil refuse une option inconnue au lieu d'accueillir pour de
  bon**, enregistrement `614f884`.
  - preuve, rejouée : `node todo/accueillir-lot.mjs --zzz` rend exit 2 sur un sas qui portait
    2 fichiers, et les portait encore après ; banc 6/6 contre 4.
- **TF-1154 et TF-1168 sont clos comme déjà faits**, preuve rejouée par la campagne du pilot : la
  règle `S47` refuse la synthèse d'origine et accepte sa version courante ; le banc
  `oracles/hook-restitution.test.mjs` rend 23/23.
- **TF-1042 est clos : la parité entre la CI et l'image servie a son contrôle**, le gate
  `runtime-parity` de `digit-ai-forge-development`, enregistrement local `69fad77`.
  - preuve, rejouée : `uv run python -m pytest tests/test_runtime_parity_gate.py -q` rend 13/13 ;
    `uv run python -m conductor.recette_locale` rend « 5/5 etape(s) verte(s) », exit 0.
  - borne déclarée : le contrôle lit les fichiers, il ne construit pas l'image.
- **TF-1176 et TF-1175 sont clos, côté Power BI** : un rapport fourni en entrée garde sa mise en
  page (`oracles/oracle-reconstruire.mjs`), les liaisons entre visuels et modèle se jugent sans
  ouvrir l'outil (`oracles/oracle-rendre.mjs`), et un OK d'audit ne se lit plus « livrable
  vérifié ». Enregistrements locaux `acbdc84` et `4fafdb7` chez `digit-ai-forge-data`, `620cfb7`
  chez `digit-ai-forge-audit`.
  - preuve, rejouée : `node oracles/self-test.mjs` de `digit-ai-forge-data` rend « 300 PASS,
    0 FAIL » contre 273 contrôles au départ, fixtures vertes PASS et rouges FAIL ; `node
    tools/verifier.mjs` de `digit-ai-forge-audit` rend 12/12 étapes, exit 0.
  - borne déclarée : ce que le lecteur voit à l'écran reste non jugé par machine ; la règle RN5
    exige que l'ouverture réelle soit déclarée, datée et résultée dans le livrable.
- **TF-1180 est clos : le périmètre d'un rapport migré se prend à ce que ses visuels lisent**,
  plus à tout ce que le modèle d'origine contient. `oracles/oracle-delimiter.mjs` de
  `digit-ai-forge-data` refuse l'excédent non motivé, enregistrement local `337896a`. La procédure
  de migration d'un rapport Power BI est écrite en 10 étapes, et `oracles/oracle-enchainer.mjs`
  refuse une étape dont le contrôle n'existe pas, enregistrement local `6dbe8de`.
  - preuve, rejouée : `node oracles/self-test.mjs` rend « 324 PASS, 0 FAIL » contre 300 ;
    `perimetre-verte` PASS, `perimetre-rouge` FAIL ; la procédure réelle rend PASS.
  - TF-1179 reste ouvert : sa part au pilot, l'indexation de la procédure, n'est pas faite.
- **TF-1173, TF-1174, TF-1087 et TF-0836 sont clos, chez `digit-ai-forge-agents`**,
  enregistrements locaux `ba75fd5`, `f93cfaf`, `832306e` et `3ac04c9`. Le socle des pages nomme les
  4 oracles de `digit-ai-forge-design` qui jugent la même page ; `scripts/check_completude.py`
  compare le texte rendu à sa source ; un logo dont 90 % de la surface est invisible n'est plus
  sauvé par son accent ; le hook d'écriture n'accuse plus un gabarit de ce que son assemblage
  injecte.
  - preuve, rejouée : recette du socle 390/390 contre 366, exit 0 ; recette de `quality-oracles`
    293 contrôles contre 289 ; banc du hook 50/50 contre 37.
  - mesure rapportée par la campagne : une page amputée rend 40,9 % de couverture et FAIL, la page
    complète 105,9 % et PASS, là où l'ancien contrôle rendait les mêmes 8 constats sur les deux.
  - écart assumé sur TF-1087 : aucun seuil de surface ne sépare un logo défectueux d'un dessin au
    trait conforme, la mesure le prouve ; la règle juge donc aussi le niveau du contraste.
- **Les 4 oracles Power BI du jour sont inscrits au registre des oracles de `quality-oracles`**,
  version 2.23.0, enregistrement local `fc764c0` chez `digit-ai-forge-agents`.
  - preuve, rejouée : `node .claude/skills/quality-oracles/scripts/self-test.mjs` rend 297
    contrôles contre 293, les 4 gagnés vérifiant que chaque oracle inscrit existe sur le disque.
  - constat de la campagne : les 10 autres oracles de `digit-ai-forge-data` n'ont aucune entrée
    au registre.
- **TF-1170 et TF-1020 sont corrigés à moitié et restent ouverts.** Un modèle déclare les
  décisions qui l'ont façonné, enregistrement `0a8d7c9` ; la police du corps voyage dans la fiche
  d'audit, enregistrement `726a7b0`.
  - preuve : les mêmes recettes, 300 PASS et 12/12.
  - TF-1170 attend sa part au pilot, confiée à la seconde vague ; TF-1020 attend sa mesure sur
    le runner Linux hébergé.
- **4 constats du tour sont entrés au registre**, TF-1181 à TF-1184, par
  `input/01-candidatures/constats-mandat-todos-retours-20260917c.tf.jsonl`.
  - preuve : `node todo/ingerer-lot.mjs` a rendu « 4 candidature(s) ingérée(s) », lot
    `958dc3426595`.
- **Le travail du tour est enregistré localement** par chemins nommés.
  - preuve : `git commit --only` a rendu l'enregistrement `26d1db9`, 18 fichiers.

## 5. Non traité

- Les todos confiés à la campagne en cours au pilot : motif `dependance_externe` — elle n'a pas
  rendu : TF-1182,
  TF-0791, TF-1047, TF-1088, TF-1150, TF-1170, TF-1184, TF-1081, TF-1136.
- TF-1179, sa part au pilot : motif `dependance_externe` — une campagne écrit en ce moment dans
  le dépôt du pilot.
- La recopie des outils corrigés vers ce poste : motif `dependance_bloc_3` — D-1.
- Les 9 todos dont la correction vit chez un produit : motif `garde_fou` — le pilot n'écrit chez
  un produit que sur run demandé.
- TF-1020, la preuve sur Linux : motif `gate_gouvernance` — la publication reste votre mot.
- `oracles/baseline-recettes.json` n'est pas enregistré : motif `garde_fou` — il porte aussi une
  ligne d'une autre session ; 6 comptes y ont monté, tous dus aux bancs du jour.
- Les autres todos ouverts des forges : motif `borne_atteinte` — une seule campagne écrit dans un
  dépôt à la fois.

## 6. Écarts à la lettre

- **Vous avez demandé** « traite les todos et retours ». **J'ai fait** : tous les retours, et 15
  todos clos sur 45 à l'ouverture. **Pourquoi** : les retours étaient bornés, les todos ne le sont
  pas ; 1 campagne tourne encore.
- **Un outil a été lancé avec une option inexistante** : `--help` sur `todo/accueillir-lot.mjs`,
  qui a exécuté l'accueil réel. Le geste était le bon à cette étape, mais pas voulu à cet instant.
  Le même écart s'était produit le 16/09 avec `--aide` : l'outil est corrigé, TF-1181.
- **Les heures des deux premiers dépôts de cette synthèse étaient estimées, et fausses** d'environ
  35 minutes. Elles sont désormais relevées à l'horloge du poste.
- **Une commande d'édition a laissé le shell interpréter des accents graves** : il a tenté
  d'exécuter des fragments de prose comme des commandes. Toutes ont échoué sans rien écrire ;
  l'édition a été refaite par l'outil d'écriture.

## 7. Risques

- **Une autre session écrit dans le pilot en même temps.**
  - signal : un todo, TF-1178, est apparu au registre entre deux de mes ingestions ; `git status`
    liste `CLAUDE.md`, `REGLES-PROJET.md` et une trentaine de fichiers indexés que ce mandat n'a
    pas écrits.
  - parade : enregistrements par chemins nommés, fichiers de l'autre session interdits aux
    campagnes.
- **Le modèle Power BI déjà livré chez le produit échouera la règle neuve sur les décisions.**
  - signal : un FAIL M7 au prochain passage d'`oracle-modeliser` chez ce produit.
  - parade : c'est l'effet voulu ; le lot de travaux le dira au produit à son prochain run.
- **5 skills de `digit-ai-forge-agents` s'exécutent dans une version qui n'est plus celle
  versionnée.**
  - signal : `oracle-skills.mjs (parc réel)` en défaut au harnais, 7 FAIL K2, antérieur à ce tour.
  - parade : votre réponse à D-1 ; à défaut, la recopie se joue au prochain démarrage de session
    sur un état publié.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Sonder le rapport de campagne à venir, rejouer les vérifications natives et clore au registre | `auto_ia` | TF-1173 | `dependance_externe` — la campagne du pilot n'a pas encore rendu | les corrections en cours restent sans preuve rejouée |
| **A-2** | Journaliser le mandat dans `BOUCLE-AMELIORATION.md` et régénérer les vues du registre | `auto_ia` | TF-1172 | `dependance_externe` — le journal porte les modifications non enregistrées d'une autre session, et les vues se régénèrent une fois la campagne rendue | le journal narratif ne dit rien de ce mandat |
| **A-3** | Déposer chez le produit concerné le lot de travaux qui annonce la règle neuve sur les décisions d'un modèle | `auto_ia` | TF-1170 | `garde_fou` — le dépôt chez un produit exige un mandat déclaré sur ce produit | le produit découvre la règle par un FAIL |
| **A-4** | Recopier les outils corrigés vers ce poste, puis rejouer `node oracles/oracle-skills.mjs` | `auto_ia` | TF-1173 | `dependance_bloc_3` — D-1 | le poste exécute ce qui n'est plus versionné |
| **A-5** | Donner le feu vert de publication de `digit-ai-forge-audit`, puis le pilot pousse et lit le job `oracles (ubuntu-latest)` | `manuelle_utilisateur` | TF-1020 | `decision` — la publication d'un dépôt reste votre mot (R-38) ; commande que le pilot jouera : `git -C ../digit-ai-forge-audit push origin main` | la correction des polices reste sans preuve sur Linux, et le todo reste ouvert |

## 9. Traces

- Fichier jugé : ce document — `oracle-synthese` PASS.
- `todo/TODO.jsonl` — 8 ingestions, 14 créations, 18 décisions, 15 clôtures ; 45 ouverts, 354 clos.
- `input/00-retours/` — 7 lots, de `Produit-62 - RETOURS - 20260916a` à `20260917d`, et
  `Produit-64 - RETOURS - 20260916b`.
- Enregistrements locaux, tous non poussés : pilot `be80825`, `d72b814`, `ea3cd8f`, `12a84da`,
  `614f884`, `26d1db9` ; `digit-ai-forge-development` `69fad77` ; `digit-ai-forge-data` `0a8d7c9`,
  `acbdc84`, `4fafdb7`, `337896a`, `6dbe8de` ; `digit-ai-forge-audit` `726a7b0`, `620cfb7` ;
  `digit-ai-forge-agents` `ba75fd5`, `f93cfaf`, `832306e`, `3ac04c9`, `fc764c0`.
