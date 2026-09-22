---
role: plan de mise en œuvre des huit rangs de verdicts d'opportunité favorables non traités, relevés le 22/09/2026 — mandat humain du 22/09 « construis le plan, puis enchaîne rang par rang du 1 au 8 »
sources_de_verite: [todo/TODO.jsonl (état au 2026-09-22T18:10Z), output/03-etudes/ (79 fichiers), references/TODO-FORGE.md, references/REGLES-PROJET.md, CLAUDE.md (garde-fous), oracles/hook-produits-intacts.mjs]
verifie_le: 2026-09-22
---

# Plan de mise en œuvre — les huit rangs d'opportunités à verdict favorable non traité

Mandat humain du 22/09/2026 : *« Travaille de façon détaillée la liste des rangs 1 à 8 en
construisant le plan de mise en œuvre, puis enchaîne successivement le plan rang par rang, du 1
au 8. »* Ce document est le plan. Son chapitre 7 est le journal d'exécution, rempli au fil.

## 1. Ce que ce plan couvre, et ce qu'il ne couvre pas

Il couvre **20 items du registre** répartis en huit rangs, tous issus d'une étude d'opportunité
dont le verdict est favorable (une option autre que « ne rien faire ») et dont la mise en œuvre
est restée partielle ou nulle. Le classement en rangs est celui du relevé du 22/09 : par portée
structurelle sur la Factory, et non par le score du registre — ce score est calibré pour des
défauts et classe à 1,0 un item qui ouvre une capacité entière.

Il ne couvre pas : la construction de la **vue** portefeuille (l'étude du 22/08 la diffère
explicitement, et rien ne l'a rouverte) ; les paliers 2 à 4 du verdict des familles de gabarits
(leur ouverture est conditionnée à la mesure du palier 1) ; et les quatre études du 14/09 citées
dix fois par le registre mais absentes du disque et de l'historique — leur verdict est hors de
portée tant que TF-1248 n'est pas traité.

## 2. Les trois régimes d'écriture — ce qui décide de ce qui est exécutable

C'est la première chose à poser, parce qu'elle détermine à elle seule ce qui peut être fait dans
ce mandat et ce qui ne le peut pas.

| Régime | Périmètre | Autorisation | Conséquence pour ce plan |
|---|---|---|---|
| Pilot | `digit-ai-factory` | la session travaille chez lui | tout est exécutable |
| Forges | les treize dépôts `digit-ai-forge-*` | **mandat d'écriture permanent** du 17/09 (`CLAUDE.md`, garde-fous) — aucune décision humaine à demander, le résultat remonte | exécutable, les treize sont présents sur ce poste |
| Produits | tout dépôt produit | le pilot n'intervient que sur **run demandé** ; le relevé d'ouverture du 22/09 affiche « aucun mandat déclaré : toute écriture chez eux sera refusée » | **non exécutable** sans mandat nommé |

À quoi s'ajoute un fait mesuré, plus dur encore qu'une autorisation manquante : **les deux
produits visés par les rangs 5 et 6 ne sont pas sur ce poste**. `ls` sur la racine du parc rend
les treize forges, le pilot et `digit-ai-queue` — ni `digit-ai-marketing`, ni
`digit-ai-communication`. Un mandat ne suffirait donc pas : il faudrait d'abord cloner.

Deux garde-fous s'appliquent partout : aucun `git push` sans GO humain (R-38), et aucun livrable
publié sur un service hébergé sans GO humain.

## 3. Ordonnancement général et dépendances

L'ordre demandé est celui des rangs, du 1 au 8. Trois dépendances internes le contraignent, et
les respecter coûte moins que de les découvrir en chemin.

- **Le rang 4 précède techniquement la fin du rang 1.** Le livrable du rang 1 est une page HTML
  bâtie sur le socle ; le rang 4 corrige précisément les juges qui rendent FAIL sur une page au
  socle conforme. Faire naître le gabarit avant de les réparer reviendrait à le juger sous des
  verdicts faux. **Décision de plan, qui préserve l'ordre demandé** : l'enchaînement reste 1 → 8 ;
  à l'intérieur du rang 1, tout ce qui ne dépend pas de ces juges est joué à son tour, et les deux
  items qui en dépendent (TF-1234 et TF-1236) sont explicitement reportés *après* le rang 4, avec
  leur dépendance écrite au registre plutôt que dissimulée dans un ordre remanié.
- **Le rang 1 porte sa propre séquence, écrite dans son verdict** : la mission réelle d'abord,
  l'extraction du skill ensuite (règle R-31 : un objet durable naît exercé). Elle n'est pas
  négociable et elle est coûteuse — elle suppose de jouer un plan d'amélioration sur un audit
  réel.
- **Le rang 8 n'a aucun porteur au registre.** Avant de pouvoir l'exécuter, il faut l'ouvrir :
  c'est une écriture de candidature, pas une construction.

## 4. Rang par rang

Pour chaque rang : les objets, leur cible, la séquence, le juge qui prononce la fin, et la
définition de fin. L'effort est en complexité × durée, jamais en jours.

### Rang 1 — Plan d'amélioration post-audit (7 items, aucun exécuté)

Verdict O2 de l'étude du 19/09, décision humaine D-3 (a) du même jour.

| Item | Cible | Objet | Juge de fin |
|---|---|---|---|
| TF-1238 | socle `digit-ai-page-html` | replis du gabarit et feuille du composant de filtres passés par les jetons ; reposer les blocs scellés | `oracle-tokens` et `oracle-slop` de forge-design, 0 écart dur |
| TF-1239 | pilot | le hook du lexique d'invocation n'examine que les messages humains ; fixture rouge (notification portant le mot-clé) et verte (message humain) | recette du hook, 2 cas |
| TF-1240 | pilot | `fiches/forge-audit.md` réalignée sur le dépôt ; un contrôle d'ouverture porte l'écart entre les compteurs de la fiche et ceux du README de la forge | contrôle neuf, à double sens |
| TF-1235 | forge-audit | schéma des actions de remédiation déclaré contrat d'interface versionné ; export de la liste des contrôles évalués et de leur verdict | recette de la forge |
| TF-1234 | forge-agents | le skill `plan-d-amelioration` : méthode datée, trois verbes (joindre, juger, rendre), quatre fiches d'expert | oracle du contrat de sortie, fixtures rouge et verte |
| TF-1236 | forge-design | critique d'implémentation et contrôle de généricité sur une instance réelle du gabarit | `run-oracles-design` PASS |
| TF-1237 | pilot | bloc C3 du run de conseil amendé, entrée au catalogue, situation « audit puis amélioration » au routage, `oracle-livrable-conseil` inscrit au registre des oracles | `oracle-livrable-conseil` joué sur un document réel |

**Séquence** : TF-1238 → TF-1239 et TF-1240 (indépendants, petits) → TF-1235 → mission réelle →
TF-1234 → TF-1236 → TF-1237. Coût d'ensemble : complexe × long. Les trois premiers : simple ×
court chacun.

**Ce que le plan assume** : la mission réelle exige un audit réel. Celui de `Produit-61` est
dans la boîte d'entrée du pilot avec son fichier d'actions de remédiation — c'est la matière, et
elle est disponible sans écrire chez aucun produit.

### Rang 2 — Référentiel de produits (1 item)

Verdict O1 de l'étude du 22/08, porteur rouvert le 22/09 sous TF-1313.

Objet : `references/PRODUITS.md`, donnée datée et éditable (loi transverse n° 4), sur le patron
de `INVENTAIRE.md` — un produit par entrée, avec son nom pseudonymisé, son dépôt, son état
(vivant, mis de côté, jamais instancié), la date du dernier constat et la source de ce constat.
Couvert par `oracle-fraicheur-doc` comme `INVENTAIRE.md` l'est déjà. Cible : pilot seul.
Juge de fin : `oracle-fraicheur-doc` reconnaît le fichier et le date. Coût : simple × court.

**Ce que ce rang ne fait pas** : il ne construit pas la vue portefeuille, et il ne remplace pas
le scan de disque du relevé d'ouverture — il lui donne un référent déclaré auquel se comparer.

### Rang 3 — Familles de gabarits, palier 1 (3 items)

Verdict O4 de l'étude du 14/09, décision humaine D-4 (a).

| Item | Objet | Juge de fin |
|---|---|---|
| TF-1256 | écrire G6, G7 et G8 dans `oracle-gabarits-documents`, ou retirer du README ce qu'elles prétendaient couvrir | recette de l'oracle, fixtures à double sens |
| TF-1254 | le statut `ok` du catalogue cesse de mentir sur les formats : soit il se lit par format, soit il exige un point de départ pour chaque format déclaré | contrôle d'existence à la recette du pilot |
| TF-1255 | poser le protocole de mesure « retours par famille outillée contre famille nue » sur les documents produits après le 14/09 | aucun avant la revue du 2026-10-15 — c'est une mesure, pas une construction |

Cible : pilot. Coût : moyen × court pour TF-1256 et TF-1254 ; TF-1255 est un plan de mesure, son
exécution est datée au 15/10.

### Rang 4 — Le socle des pages n'est pas jugé par la forge design (3 items)

Ce rang répare des **juges**, pas des livrables : trois contrôles de la forge design rendent FAIL
sur une page que le socle prescrit, pour du code que l'auteur de la page n'a pas le droit de
modifier. Le lecteur y trouvera quel contrôle accuse à tort, ce qui le corrige, et pourquoi le
troisième cas n'est pas un correctif mais une question de doctrine.

| Item | Cible | Objet | Juge de fin |
|---|---|---|---|
| TF-1242 | forge-design | `oracle-mobile` M4 reconnaît un repli dès que le seuil de la media query **couvre** 768 px ; fixture verte au seuil 900, rouge sans repli | recette de l'oracle |
| TF-1241 | quality-oracles | le lanceur général joue `oracle-tokens` et `oracle-slop` **par** le point d'entrée de forge-design, ou reprend sa passe d'imputation ; fixture à double sens sur le sceau | recette du lanceur |
| TF-1244 | pilot + forge-design | arbitrage de doctrine : les pages générées du pilot sortent du périmètre d'`oracle-bascule` par exemption déclarée, ou le socle admet la bascule pour ce type de page | banc `scripts/oracles-design-page-generee.test.mjs` étendu |

TF-1244 porte une **question de doctrine**, pas un correctif : elle est posée à l'humain au bloc
des décisions plutôt que tranchée seule.

### Rang 5 — Réseaux sociaux, la mesure du gain (2 items)

Verdict O2 des études des 17/09 et 21/09 ; 11 objets sur 13 sont clos, les deux restants portent
la mesure. TF-1159 (plan de mesure à sonde manuelle hebdomadaire) et TF-1160 (ouverture du palier
V2 des publications, premier cas réel de quatre semaines) visent tous deux le **produit**.

**Statut dans ce plan : non exécutable.** Le produit n'est pas sur ce poste et aucun mandat
n'est déclaré. Ce qui reste faisable sans lui, et qui est fait : vérifier côté
`digit-ai-forge-observability` qu'une sonde « manuel » sur un fichier tableur est jouable — c'est
la question que TF-1159 pose explicitement à la forge, et elle, elle est joignable.

### Rang 6 — Communication et réponse à appel d'offres (3 items)

Huit objets sur onze sont clos ; ce rang dit où passe la frontière entre ce qui reste faisable
ici et ce qui ne l'est pas. Le lecteur y verra que le seul volet réellement construisible est
celui de la marque, que le deuxième dépend de sources publiques, et que le troisième bute sur un
dépôt absent.

| Item | Cible | Statut dans ce plan |
|---|---|---|
| TF-1023 | forge-design + forge-agents | **exécutable** — jouer `systeme-de-marque` pour Digit-AI, trancher entre les deux chartes, faire consommer les jetons par les skills de rendu |
| TF-1028 | forge-agents | **partiellement** — trois barres externes qualifiées par test d'existence ; la qualification suppose des sources publiques réelles |
| TF-1031 | produit | **non exécutable** — le produit n'est pas sur ce poste |

TF-1023 porte une question qui n'appartient pas à l'agent : **laquelle des deux chartes est la
marque**. Elle est posée à l'humain.

### Rang 7 — Module de traduction (2 items)

TF-1232 : aucun oracle du registre ne juge la fidélité d'une traduction. L'item nomme lui-même
trois issues NO-GO recevables, dont « durcir le juge rédactionnel existant plutôt que créer un
oracle neuf ». Cible : pilot et forge-agents. La première marche est **l'instruction**, pas la
construction : trancher entre oracle neuf et durcissement de l'existant se fait sur la mesure du
juge rédactionnel actuel, dont l'outil n'accepte aujourd'hui aucun texte de référence.

TF-1094 : sept des dix étapes de la chaîne de traduction et d'audit ne sont écrites nulle part.
Objet : écrire un porteur pour chaque étape, ou la marquer « à écrire » avec sa candidature.

Coût : moyen × moyen. Cible : pilot, forge-tests, forge-conception.

### Rang 8 — Méta-oracle d'enclenchement (0 item, à ouvrir)

Verdict O3 de l'étude du 19/08, en trois temps d'ordre déclaré bloquant. Le temps 1 est livré
(forme canonique de l'événement de verdict, TF-0385, clos). Les temps 2 (un runner par forge) et
3 (le juge, instance du mécanisme de confrontation promis/servi déjà extrait) n'ont jamais été
ouverts : aucun des 91 oracles du pilot ne porte cet objet.

**Première marche : ouvrir un porteur au registre**, comme le rang 2 l'a fait. Sans quoi le rang
8 n'est pas exécutable — il n'y a rien à exécuter, seulement un verdict sans item.

## 5. Ce qui est bloqué, et par quoi

Quatre objets de ce plan ne peuvent pas aboutir dans ce mandat, et il vaut mieux les nommer
d'emblée que de les découvrir au moment de les jouer. Deux butent sur un dépôt absent du poste,
deux sur une question qui n'appartient pas à l'agent. Chacun porte ci-dessous ce qu'il faut
fournir pour le lever.

| Objet | Bloquant | Ce qu'il faut fournir pour le lever |
|---|---|---|
| TF-1160, TF-1031 | le produit visé n'est pas sur ce poste (mesure : la racine du parc ne le contient pas) | cloner le dépôt, puis ouvrir un run chez lui |
| TF-1159, volet produit | idem | idem ; le volet forge est instruit sans lui |
| TF-1244 | question de doctrine — deux juges inconciliables sur le même artefact | un arbitrage humain entre exemption déclarée et bascule admise |
| TF-1023, volet charte | question de marque | dire laquelle des deux chartes fait foi, ou motiver la divergence par support |

## 6. Définition de fin du mandat

Le mandat est tenu quand, pour chacun des huit rangs : soit les items sont clos en `corrige` avec
leurs `gains_constates`, `corrections_realisees` et leur `descente` (R7, R12) ; soit ils portent
un motif de non-exécution nommé et opposable, écrit au registre et repris au bloc des restes.
Aucun rang n'est déclaré fini sur un verdict non exécuté.

## 7. Journal d'exécution

Rempli au fil de l'enchaînement. Une ligne par geste, avec son contrôle. L'ordre des lignes est
l'ordre chronologique d'exécution, qui suit l'ordre des rangs.

**Comment lire le tableau.** La première colonne dit le rang du plan ; la deuxième, le geste et
l'item qu'il sert ; la troisième, le contrôle EXÉCUTÉ qui l'établit — un geste sans contrôle y
porte un tiret, et c'est alors un constat ou une suspension, jamais une correction. Une ligne dont
la date est un tiret n'est pas faite : elle est suspendue ou attend une décision, et son motif est
dans la colonne du geste. Aucune ligne n'est retirée quand la situation change : on en ajoute une.

| Rang | Geste | Verdict | Date |
|---|---|---|---|
| — | plan écrit, et les 15 items des rangs passés en `decide` | `oracle-todo` PASS avant et après | 2026-09-22 |
| 1 | **blocage levé** : `generer-page-etude.mjs` levait `ReferenceError: ASSETS is not defined` au premier appel réel — référence morte laissée par le refactor du jour. Corrigé, et la recette reçoit le cas qui l'aurait vue | self-test 7/7 → **9/9 PASS**, cas neuf rouge quand le socle est absent | 2026-09-22 |
| 1 | TF-1238 — replis littéraux du gabarit retirés à la source, skills réinstallés | `run-oracles-design` : `oracle-tokens` **PASS**, `oracle-slop` **PASS** (22 écarts avant) | 2026-09-22 |
| 1 | TF-1239 — marqueur `NOT USER INPUT` reconnu, six cas de provenance à double sens | self-test **19 PASS / 0 FAIL** (13 avant) ; banc `hook-lexique.test` 6/6 | 2026-09-22 |
| 1 | TF-1240 — fiche réalignée sur le dépôt, trois claims et deux sondes neuves | `oracle-fraicheur-doc` **FAIL (5) → PASS (9 claims)** ; self-test 4 → 8 fixtures | 2026-09-22 |
| 1 | TF-1315 ouvert — les pages générées embarquent le socle sans le déclarer | mesure : 8 occurrences du composant, 0 bloc déclaré | 2026-09-22 |
| 1 | TF-1235 — schéma des actions déclaré contrat d'interface 1.1.0, export des contrôles évalués, borne D16 retirée (TF-1207 rattaché) | forge-audit : batterie **151 → 155 tests, 0 échec**, recette locale 13/13 ; ancien moteur prouvé rouge sur D17 | 2026-09-22 |
| 1 | la mission réelle : **ouverte chez la plateforme le 20/09 et bloquée** sur quatre décisions humaines posées dans SA session ; non jouable depuis le pilot | — (constat, rien d'écrit chez le produit) | 2026-09-22 |
| 1 | TF-1237 volet (4) — `oracle-livrable-conseil` indexé au registre des oracles (2.26.0) | `{pilot}` résolu, self-test de l'oracle 4/4 | 2026-09-22 |
| 1 | TF-1316 ouvert — le skill `accueil-factory` commité avec une description de 1 244 caractères, recette de `quality-oracles` rouge depuis | mesure : 1 échec, antérieur à ce tour | 2026-09-22 |
| 2 | TF-1313 — `references\PRODUITS.md` posé, 17 produits, compte jugé | `oracle-fraicheur-doc` claim `produits-connus-du-registre` **17 == 17** ; N2 PASS | 2026-09-22 |
| 3 | TF-1256 — G10 reçoit ses trois fixtures | self-test **36/36 → 39/39**, mutant rouge | 2026-09-22 |
| 3 | TF-1254 — soldé par TF-1252 et G11, vérifié ; le catalogue n'était plus jugé selon la graphie du chemin — corrigé | G11 PASS sur 25 familles, 9 règles sur toutes les graphies (7 avant) | 2026-09-22 |
| 3 | TF-1255 — mesure jouée : aveugle par construction aux familles nues ; contre-proposition pour la revue du 15/10 | 138 lots, 15 documents, 0 famille nue citée | 2026-09-22 |
| 4 | TF-1242 — déjà corrigé (6fb8d00, 15/09), vérifié par l'exécution | fixture du socle PASS, fixture sans repli FAIL | 2026-09-22 |
| 4 | TF-1241 — point d'entrée de forge-design empruntable par le lanceur, socle d'essai | recette forge-design : direct FAIL, mode lanceur PASS, sceau altéré FAIL ; tout vert | 2026-09-22 |
| 4 | TF-1317 ouvert — cause commune : le générateur de pages d'étude écrit sa propre coquille | 3 tables sans repli, 0 `data-label` | 2026-09-22 |
| 4 | TF-1244 — **suspendu** : la prémisse de D-4 était fausse (R-30 point 2 exige la bascule) | — | — |
| 5 | TF-1159 — question posée à la forge tranchée (une sonde manuel lit un JSON, jamais un tableur) ; le reste bloqué par présence | — | 2026-09-22 |
| 6 | TF-1023 — bloqué par présence : le dossier de marque Digit-AI vit dans un produit absent du poste | `lire-marque.mjs` : « dossier de marque introuvable » | 2026-09-22 |
| 6 | TF-1028 — deux barres soumises à la validation humaine depuis le 21/09 : reposées en décision | — | — |
| 7 | TF-1094 — les dix étapes de la chaîne B transcrites depuis le lot source ; TF-1318 ouvert pour les étapes sans porteur | chaîne B : 3 → 10 étapes déclarées | 2026-09-22 |
| 7 | TF-1232 — `oracle-invariants-traduction` (F1-F5), indexé | self-test **8/8** ; CLI : prix changé → FAIL F1 | 2026-09-22 |
| 8 | TF-1319 ouvert — porteur des temps 2 et 3 du méta-oracle | — | 2026-09-22 |
| — | D-9 (a) — travail des deux tours enregistré localement, quatre dépôts, sans publication ; le journal des relevés et l'étude de l'autre session laissés hors du commit | commits `5c58d0ec`, `310bcf8`, `dc065d6`, `4d0b762` ; pre-commit du pilot PASS | 2026-09-22 |
| — | TF-1323 ouvert — le nom réel d'un produit client est dans l'histoire publiée du dépôt public, écrit par le relevé d'ouverture | mesure : 4 lignes dans HEAD, 3 de plus non enregistrées, présent sur `origin/main` | 2026-09-22 |
| 6 | D-8 (a) — deux barres validées (propale privée ; mémoire technique, deux dimensions), pré-vol et en ligne branchés dans trois skills (TF-1028) | test d'existence rejoué : 4 PASS ; `oracle-repere-externe` recette 13/13 | 2026-09-22 |
| 4 | D-6 (b) — la coquille des pages d'étude dérive du socle (TF-1317, TF-1315, TF-1244) ; sept pages régénérées | point d'entrée forge-design PASS dont bascule ; `render_page` PASS 6 largeurs ; recette 12/12 ; banc 11/11 | 2026-09-22 |
| 4 | TF-1320 — la passe d'imputation effaçait une faute de l'auteur placée après un composant du socle : corrigé | recette forge-design : rouge (« PASS, au socle ») puis vert (« FAIL, à l'auteur ») | 2026-09-22 |
| 4 | TF-1321 et TF-1322 ouverts — deux générateurs restent hors socle ; le contrat mobile appliqué à toute page par le lanceur | mesures du 22/09 | 2026-09-22 |
