---
destinataire: humain
---

# Étude d'opportunité — juger que les oracles qui devaient s'enclencher se sont enclenchés — 20260819c

## Seuil de déclenchement (à vérifier AVANT d'écrire)

**Franchi deux fois.** L'objet **crée un objet durable** (R-31 : une forme canonique d'événement de
ledger, un contrôle de payload, un runner par forge) **et touche ≥ 3 forges ou le noyau** — il
touche les 12 forges qui portent des oracles, plus le contrat d'interface du noyau. L'étude est
donc **obligatoire** avant tout code.

## 0. Traitement des entrants

La demande instruite est une **question** posée par l'humain le 19/08/2026 : « existe-t-il un ou
des oracles qui vérifient que les oracles qui auraient dû s'enclencher se sont bien enclenchés ? ».
Elle est une **donnée** : ce qu'elle suppose se vérifie, ne se relaie pas.

Tout ce qui suit a été **constaté en lecture seule** — y compris sur des ledgers de projets clients
(G-1). Aucun item du registre ne préexiste sur ce sujet : vérifié sur les 383 items, 0 occurrence.

## 1. Partition du problème

Quatre sous-questions disjointes. La première renverse l'ordre attendu, et c'est le résultat
principal de cette étude.

1. **Peut-on aujourd'hui SAVOIR, par machine, quels oracles ont tourné ?** Si non, aucun juge
   n'est constructible : il n'aurait pas d'entrée.
2. **D'où vient l'APPLICABILITÉ** — c'est-à-dire la liste de ce qui *aurait dû* tourner ?
3. **Qui juge, et à quel moment du run ?**
4. **Quel est le risque du méta-oracle lui-même ?** Un juge des juges qui se trompe est plus
   coûteux qu'aucun juge.

## 2. Non-recouvrement contre l'existant

Trois questions différentes sont déjà outillées, et **deux le sont entièrement**. Il faut les
séparer pour voir où est le trou.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| **I1 du pilot** — « cet oracle PEUT-il échouer ? » | `oracles/self-tests.mjs` : « tout `oracle-*.mjs` doit être couvert — par `--self-test` ou par un fichier dédié », sinon statut `SANS RECETTE` | **RECOUVRE ENTIÈREMENT** la question « a-t-il une recette double sens ». Ne dit rien de son enclenchement sur un artefact |
| **Manifeste des fixtures de quality-oracles** | `fixtures/manifest.json` : 36 fixtures, chacune avec `attendu_red` et `attendu_green` ; jouées par `scripts/self-test.mjs` — 147 contrôles | **RECOUVRE** la même question, pour 28 oracles. Vérifié en croisant : les 9 oracles du registre sans fixture ici en ont une **dans leur propre forge** (6 chez design, 3 chez conception) — **il n'existe aucun oracle sans recette dans le parc** |
| **I2 du pilot** — « la recette a-t-elle été JOUÉE ? » | `oracles/self-tests.mjs` : tout `*.test.mjs` du dépôt est joué, **les zones étant découvertes sur le disque** (TF-0367, 18/08 : la liste des zones était écrite à la main) | **RECOUVRE ENTIÈREMENT** la question. Portée : le dépôt du pilot |
| **`recette/verifier_corpus.py`** de forge-tests | 23 défauts plantés au banc rouge, chacun devant sortir `[DETECTE]` ; un contrôle muet sort `[MANQUE]` | **RECOUVRE la question POSÉE, mais sur un corpus de TEST** : c'est littéralement « les contrôles qui devaient s'enclencher se sont-ils enclenchés ». Ne dit rien d'un run réel |
| **R-32 du pilot** | `oracles/oracle-conformite-projet.mjs` l. 361 : tout `.html` d'`output\` hors `old\` a son journal sous `forge\oracles\<basename>.json`, sinon FAIL | **RECOUVRE le cas d'UN type d'artefact** : un livrable HTML non jugé est refusé. C'est le contrôle le plus proche de la question, et il ne porte que sur le HTML |
| **R-32 bis** (TF-0366, 18/08) | même fichier l. 384 : le journal porte-t-il l'**empreinte du jeu de règles** courant ? Sinon le PASS n'est plus un verdict courant | **RECOUVRE une question voisine et plus fine** : « le verdict est-il encore valide ? ». Ne dit rien des oracles absents |
| **`run-oracles-conception.mjs`** et `run-oracles-design.mjs` | « Lance chaque oracle **du dossier** sur le référentiel fourni, agrège les verdicts, et **DÉCLARE ceux qui n'ont pas pu juger** — jamais PASS par défaut, jamais de silence » | **RECOUVRE LA QUESTION, ET C'EST LE SEUL MÉCANISME QUI LE FAIT** — par découverte du dossier, donc sans liste. Portée : **2 forges sur 12** |
| **`pans_non_couverts`** de forge-tests | `forge_tests/noyau.py` : `couverts = {s.pan for s in sorties if s.verdict not in ("SKIP","NA")}`, et les pans non couverts sortent avec leur motif | **RECOUVRE la question à l'intérieur d'un pipeline** : quels pans n'ont pas mesuré. Ne porte pas sur les oracles des autres forges |
| **F4 d'`oracle-etat-forge`** | `scripts/oracle-etat-forge.mjs` l. 126-131 : la restitution porte-t-elle la ligne « domaines jugés : N · hors registre : M → M candidats écrits » | **NE RECOUVRE PAS, et le cas est instructif** : il juge la **forme de la déclaration**, pas sa vérité. Il vérifie qu'un chiffre est écrit, jamais que le chiffre est juste |
| **`ledger.mjs verify`** | `.claude/skills/forge-agents/scripts/ledger.mjs` : « vérifie l'intégrité append-only… JSON valide par ligne, `seq` strictement croissant depuis 1, horodatages non décroissants, première entrée de type `run_open` » | **NE RECOUVRE PAS** : il contrôle la **forme du journal**, jamais le **contenu d'une entrée**. Il ne peut pas savoir ce qui manque, par construction |
| **Contrat d'interface, §types de ledger** | `CONTRAT-INTERFACE.md` l. 106 : liste les types dont `oracles_verdict` ; et l. 136 prescrit `oracle: diff-doctrine` **pour un seul cas** (TF-0320) | **NE RECOUVRE PAS** : le type est nommé, **sa forme ne l'est nulle part**. Un précédent existe pourtant — le champ `oracle:` prescrit une fois, jamais généralisé |
| **`digit-ai-schemas`** | skill installé : `references/canevas-*.md`, `assets/template-*.html` | **NE RECOUVRE PAS** : ce skill produit des **schémas de diagramme**, pas des schémas de données. Aucun schéma d'événement de ledger n'existe dans le parc |

## 3. État de l'art daté

**Non instruit**, déclaré sans entre-deux. Motif : cette session n'a pas d'accès réseau, et
produire cinq sources datées de moins de 24 mois reviendrait à les écrire de mémoire, c'est-à-dire
à fabriquer la preuve que cette section existe pour exiger.

Raison de fond, en outre : l'objet n'est pas un choix d'outil. Les options se départagent sur des
faits internes — la forme réelle des entrées de ledger, le nombre de forges dotées d'un runner, et
l'endroit d'où l'applicabilité peut venir sans créer un second porteur d'état. Aucun produit du
commerce ne tranche cela.

## 3 bis. Le parc des oracles, compté

Relevé le 19/08 (`oracle-*.mjs`, `oracle_*.py`, hors `Old\`, hors dépendances, hors l'archive
`pilot_old`) :

| Forge | Oracles | Runner qui les découvre et déclare les non-jugements |
|---|---|---|
| digit-ai-forge-agents | 30 | **non** |
| digit-ai-factory (pilot) | 12 | **non** |
| digit-ai-forge-design | 11 | **oui** — `run-oracles-design.mjs` |
| digit-ai-forge-conception | 8 | **oui** — `run-oracles-conception.mjs` |
| digit-ai-forge-data | 4 | **non** |
| digit-ai-forge-agents-security | 3 | **non** |
| digit-ai-forge-organization | 3 | **non** |
| digit-ai-forge-websec | 3 | **non** |
| digit-ai-forge-ops | 1 | **non** |
| digit-ai-forge-seo | 1 | **non** |
| **Total** | **76** | **19 (25 %)** |

Registre transverse de `quality-oracles` : **47 oracles**, 42 en statut `ok`, 5 `partiel`.

**Trois oracles sur quatre ne sont donc derrière aucun mécanisme qui constate leur absence.**

## 3 ter. LE FAIT DÉCISIF : l'entrée du juge n'existe pas en forme lisible par machine

Les ledgers réels portent bien des verdicts d'oracles — **Produit-10 8 entrées, Produit-01 9,
Produit-11 22**. Relevé des champs des 8 entrées `oracles_verdict` d'un même ledger
(Produit-10, `forge/ledger.jsonl`) :

| seq | Champs de l'entrée |
|---|---|
| 2 | `seq, ts, type, etape, oracle, verdict, detail, journal, correction` |
| 5 | `seq, ts, type, etape, forge, oracles, corrections_avant_pass, journaux` |
| 7 | `seq, ts, type, etape, oracle, verdict, detail, journal` |
| 12 | `seq, ts, type, etape, oracles, non_juge` |
| 18 | `seq, ts, type, etape, oracles, journal_r32, comparaison_entrant` |
| 24 | `seq, ts, type, etape, oracles, mesures_comparatives, livrable, conclusion_contre_le_gabarit` |
| 28 | `seq, ts, type, etape, livrables, oracles, les_deux_livrables_d_un_meme_modele, defauts_de_ma_chaine_corriges_en_route` |
| 31 | `seq, ts, type, etape, livrables, oracles, vue_r20_actualisee, defauts_de_ma_chaine_corriges_en_route` |

**Six formes différentes pour huit entrées du même type dans le même fichier.** Deux portent
`oracle` + `verdict` au singulier ; six portent un `oracles` imbriqué **sans verdict de premier
niveau** ; et chacune ajoute des champs improvisés.

**Conséquence, et elle commande tout le reste** : on ne peut pas, aujourd'hui, **calculer par
machine la liste des oracles qui ont tourné sur un run**. Le méta-oracle n'est donc pas seulement
absent — **son entrée n'existe pas**. Toute option qui commence par écrire le juge construit sur
du sable.

`ledger.mjs verify` ne l'a jamais vu, et il ne pouvait pas : son contrat est l'intégrité
*append-only*, et **il ne lit aucun payload**.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** Coût du statu quo, **mesuré** : 57 oracles sur 76 (75 %) ne sont derrière
aucun mécanisme qui constaterait leur absence ; six formes de champs pour huit entrées d'un même
ledger, donc aucun calcul possible ; et le seul contrôle qui parle de couverture (F4) juge la
**forme d'une déclaration** — il vérifie qu'un chiffre est écrit, jamais que le chiffre est juste.
S'y ajoute la trajectoire : sept fois en deux jours, un contrôle a été trouvé aveugle parce qu'il
itérait sur une liste écrite à la main (TF-0333, TF-0362, TF-0371, I2, I3, TF-0384, et le pan i18n
lui-même). **Réfutée** : le coût n'est pas une projection, et la liste des oracles lancés est
précisément une liste écrite à la main.

**O1 — un méta-oracle central avec registre d'applicabilité.** Un fichier qui dit « tel oracle
s'applique à tel artefact sous telle condition », et un juge qui le confronte au ledger.
*Coût* : 3-4 j. *Ce qu'elle exclut* : elle **crée un second porteur d'état** — la vérité de
l'applicabilité vivrait à deux endroits, le registre et les oracles. Et le registre serait
exactement **la liste écrite à la main que rien ne confronte** : le défaut que l'on répare,
reproduit un cran plus haut. **Écartée**, et pour la raison même qui motive l'étude.

**O2 — le SCHÉMA de l'événement d'abord.** `oracles_verdict` reçoit une forme canonique
(`oracle`, `verdict`, `cible`, `journal`, `regles_empreinte`), le contrat d'interface la prescrit,
et `ledger.mjs verify` la **contrôle** — une entrée de ce type sans `oracle` ni `verdict` est
refusée. *Coût* : ½ à 1 j, aucun euro, aucune décision nouvelle. *Ce qu'elle apporte* : la liste
des oracles qui ont tourné devient **calculable**. *Ce qu'elle exclut* : elle ne dit toujours pas
ce qui *aurait dû* tourner.

**O3 — O2, puis un runner par forge** (retenue, voir §5). Généraliser ce qui fonctionne déjà chez
conception et design : chaque forge porte un `run-oracles-<forge>.mjs` qui **découvre** ses oracles
sur le disque, les lance tous, et déclare ceux qui n'ont pas pu juger. L'attendu devient alors
« tous les oracles du dossier de la forge mobilisée » — **découvert, jamais listé**. Le méta-oracle
se réduit à une **confrontation** entre ce que les runners ont découvert et ce que le ledger porte.
*Coût* : O2 (½-1 j) + 10 runners (½ j chacun sur le modèle existant) + le juge (½ j).
*Ce qu'elle exclut* : l'applicabilité **fine** — quel oracle s'applique à quel artefact précis —
reste hors de portée ; la granularité est la forge, pas le fichier.

**O4 — chaque oracle déclare son applicabilité.** Un champ `s_applique_a` dans chaque oracle, lu
par un juge. *Ce qu'elle exclut* : elle est **déclarative, donc contournable par omission** — un
oracle qui oublie de se déclarer devient invisible au juge, et c'est exactement le défaut que
l'étude répare. Elle a sa place **plus tard**, comme raffinement d'O3 une fois que l'attendu au
niveau de la forge est acquis : un oracle qui se déclare **en plus** d'être découvert ajoute de la
précision sans pouvoir se soustraire. **Écartée seule, retenue comme suite possible.**

## 5. Verdict

- **Option retenue** : **O3 — le schéma de l'événement d'abord, un runner par forge ensuite**,
  l'ordre étant bloquant et non indicatif.
- **Motif** : la question posée supposait qu'il manquait un juge. La mesure dit qu'il manque
  d'abord **son entrée** : six formes de champs pour huit entrées `oracles_verdict` d'un même
  ledger, donc aucun calcul possible de ce qui a tourné. Écrire le juge avant le schéma reviendrait
  à juger un texte libre. Et l'attendu ne doit pas être une liste : les runners de conception et
  design le **découvrent** sur le disque depuis le 14/08, et c'est la seule forme qui ne recrée pas
  le défaut — sept fois en deux jours, un contrôle a été trouvé aveugle parce qu'il itérait sur une
  liste écrite à la main.
- **Coût** : ½-1 j pour le schéma et son contrôle · ½ j par runner sur le modèle existant, pour
  10 forges · ½ j pour le juge. Aucun euro, aucun service tiers. Effort estimé 3.
- **Le juge est presque gratuit une fois les deux premiers temps faits**, et il n'est pas à
  inventer : `forge_tests/confrontation.py` (TF-0371, 18/08) est déjà le mécanisme générique
  « un terme PROMIS, un terme SERVI, trois issues, l'asymétrie inscrite une fois ». Les oracles
  découverts sont la promesse, les entrées du ledger le service. **Le méta-oracle est une
  instance de ce mécanisme, pas un objet neuf** — ce qui est aussi la preuve que le mécanisme
  valait d'être extrait.
- **Ce que le verdict NE dit pas** : que l'applicabilité fine devienne connue. La granularité
  retenue est **la forge mobilisée**, pas l'artefact. Un oracle qui ne s'applique pas à un artefact
  donné sortira en non-jugement déclaré, ce qui est le contrat des runners existants — « jamais
  PASS par défaut, jamais de silence » — et non un verdict.
- **Le risque du méta-oracle lui-même, nommé** : un juge des juges qui accuse à tort est plus
  coûteux qu'aucun juge, parce qu'on apprend à le contourner (R-33 bis). Sa parade est dans
  l'asymétrie déjà écrite dans `confronter` : **un oracle servi sans avoir été promis n'est jamais
  accusé**, et tout-suspendu ne rend jamais PASS. Le méta-oracle constate l'absence, il ne
  prescrit pas la présence.
- **Candidature(s) émise(s)** : **une seule**, pour le premier temps — le schéma de
  `oracles_verdict` et son contrôle au `ledger.mjs verify`. Les deux temps suivants ne s'ouvrent
  qu'au constat du premier : sans entrée calculable, un runner généralisé produirait des journaux
  que rien ne saurait relire.
- **Plan de revue** : **2026-11-17**, avec TF-0326 et R-41. Faits à confronter : (1) combien de
  formes de champs porte un ledger de run postérieur au schéma — l'objectif est une ; (2) combien
  de forges portent un runner (aujourd'hui 2 sur 12) et combien d'oracles cela met derrière un
  mécanisme (aujourd'hui 19 sur 76) ; (3) le méta-oracle a-t-il constaté au moins une absence
  réelle, ou n'a-t-il jamais rien trouvé — auquel cas c'est sa valeur qui est en question, pas
  celle des runners ; (4) F4 juge-t-il toujours la forme d'une déclaration alors que le fait est
  devenu calculable, ce qui serait une limite périmée du même genre que celle trouvée le 18/08 sur
  `oracle-plan-de-mission`.

## Les garde-fous, traités nommément

**Aucun second porteur d'état.** C'est la raison pour laquelle O1 est écartée et O4 différée.
L'attendu se **découvre** sur le disque, il ne se déclare pas ailleurs. Le ledger reste le seul
porteur de ce qui a tourné ; le dossier d'oracles de chaque forge reste le seul porteur de ce qui
existe.

**Aucun contrôle qui itère sur une liste.** Le runner lit son dossier, le juge lit le ledger.
Aucune des deux listes n'est écrite à la main, et c'est la condition posée par sept constats en
deux jours.

**Un SKIP déclaré, jamais muet.** Le contrat des runners existants est repris tel quel : un oracle
qui n'a pas pu juger est **nommé** avec son motif. La doctrine de cette factory est qu'un SKIP muet
est pire qu'un SKIP déclaré, et le méta-oracle en dépend : c'est la différence entre « n'a pas
tourné » et « a tourné sans pouvoir juger ».

**Le méta-oracle ne juge pas la QUALITÉ d'un verdict.** Il constate qu'un oracle a rendu un
verdict, pas que ce verdict est juste. Cette limite se déclare, faute de quoi un ledger complet se
lirait comme un produit conforme — la même faute que le pan i18n commettait hier en laissant croire
qu'une traduction présente est une traduction bonne.
