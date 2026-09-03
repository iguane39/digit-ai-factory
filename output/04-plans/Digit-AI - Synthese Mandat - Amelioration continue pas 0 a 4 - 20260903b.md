---
destinataire: humain
---

# Synthèse de mandat — amélioration continue, du pas 0 au pas 4 (03/09/2026, après validation de D-1 en option a)

Vous avez validé ce matin que le mandat commence par mesurer, puis complète le système existant au lieu d'en construire un second. C'est fait : la mesure est écrite, les cinq livrables sont construits, chacun jugé par une recette exécutée, et le référentiel de trente classes de défaut est né de la mesure elle-même. Ce qui change pour vous : à partir d'aujourd'hui, un lot de retours sans classe est refusé à la porte, une récidive entre marquée comme telle, avec le nom du contrôle qui couvre sa classe, et un tableau de bord généré dit qui récidive, sur quoi, et depuis combien de temps la correction attend chez chaque produit. Ce qui reste à vous : une candidature à décider, la pose du lanceur chez cinq produits, et le feu vert de publication.

## 1. En-tête d'identification

- **quoi** — exécution du mandat d'amélioration continue selon le prompt réécrit de l'analyse L99 du matin : pas 0 de mesure, puis cinq livrables (classe et récidive à l'ingestion, descente mesurée, hook du lexique, tableau de bord, revue des classes).
- **sur quoi** — le pilot `digit-ai-factory` seul ; aucun produit ni dépôt frère touché.
- **quand** — fin le **03/09/2026 à 11:55 (UTC+02:00)**, durée **≈ 2 h 05** depuis la validation de D-1.
- **qui** — session pilot Claude Fable 5.1, dépôt à `6a3296c` plus l'arbre de travail décrit au bloc 9 ; une seconde session pilot active en parallèle sur le même dépôt (voir bloc 7).

## 2. Verdict en une ligne

Pas 0 mesuré (50 récidives déclarées sur 788 items, courbe hebdomadaire 1 → 11 → 15 → 19), cinq livrables construits et jugés — recettes neuves 8/8, 7/7 + 4/4, 5/5, registre 50 → 52 cas, oracle du registre PASS sur le vrai registre, recette entière du pilot 89/90 puis 90/90 après déclaration du site de scellement — et une candidature TF-0790 entrée au registre par la première revue des classes.

## 3. Décisions attendues

**Chapeau commun.** Une seule décision nouvelle. Les gestes qui restent aux mains humaines sont des actions, listées au bloc 8, pas des décisions.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la prose rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que la retenir ferme. La ligne encadrée qui clôt la décision dit ce qui se passe si vous ne tranchez pas.

> **D-2 — Décidez-vous la candidature qui demande à forge-observability de surveiller le tableau de bord des récidives entre les runs ?**
> Il s'agit de la candidature entrée ce matin au registre par la première revue des classes (numéro de registre 0790). La factory sait désormais compter les récidives et les produits non protégés, mais rien ne relit ce compteur entre deux tours du pilot. La première revue des classes, jouée sur la mesure du pas 0, propose une sonde de forge-observability sur le tableau de bord généré : une récidive de plus, une classe de plus ou un produit non protégé de plus depuis le relevé précédent est une dérive signalée par l'outil de dérive existant, sans alerting à construire. La sonde lit, elle ne décide rien.
> **Recommandation : (a).** Source consultée : la règle N-1 de `references/REGLES-DE-NON-REPETITION.md` (un travail planifié s'exerce avant d'être déclaré en place) ; la fiche `fiches/forge-observability.md` (sondes `rapport_json`, `derive.mjs` à seuils déclarés, « le FAIL de derive est le signal ») ; la section « Revue des classes » écrite ce jour dans `BOUCLE-AMELIORATION.md`.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Décider TF-0790 et laisser le pilot écrire le plan de sonde chez lui, premier passage exercé à la main | Effort **simple × court** : un plan déclaratif, une sonde, un premier passage | Exclut toute action automatique : la sonde constate, la décision reste humaine |
| **(b)** Écarter TF-0790 et relire le tableau de bord à la main à chaque ouverture du pilot | Effort nul aujourd'hui, une lecture humaine à chaque tour | Exclut la détection entre deux tours : une dérive attend le prochain regard |
| **(c)** Différer sans décider | Effort nul | Exclut la mesure de la surveillance elle-même ; la candidature reste en `candidat` |

> **Si rien n'est décidé** : (c) s'applique, TF-0790 reste candidat et le tableau de bord n'est relu qu'à la main.

## 4. Traité — avec sa preuve

- **Pas 0 — la récidive est mesurée, avec sa méthode, et la mesure a décidé la forme du référentiel.**
  - preuve : `output/03-etudes/20260903-recidives-mesure.md`, `check_markdown.py` M7 / M10 / M14 / M18 : PASS. Chiffres exécutés sur 788 items : 50 récidives déclarées en toutes lettres (6 %), 13 en famille HTML, 10 en versionnement, 19 imputables au pilot lui-même ; par semaine depuis le 03/08 : 1, 11, 15, 19, puis 4 sur les quatre jours de septembre.
  - preuve, méthode : le classement automatique par famille de mots-clés rend 94 % de « récidives » sur les grandes familles, 321 items dans plusieurs familles, 196 dans aucune — écarté, et c'est pourquoi la classe est déclarée par le producteur et fine (le défaut, pas la famille).
- **Pas 1 — la classe se déclare, la récidive se compte, jamais refusée.**
  - preuve : `todo/CLASSES.json` v1.0.0, 30 classes en 18 familles, chaque classe avec sa règle, son oracle et les clôtures qui l'ont fondée ; `todo/ingerer-lot.mjs` étendu (refus d'un lot daté du 03/09 ou après sans classe ou à classe inconnue, avec les clés proches ; marquage `recidive_de` ; signal `classe_suspecte`) ; recette `todo/ingerer-classe.test.mjs` : **8 PASS, 0 FAIL** — dont le refus sans classe, le refus à clé inconnue, la récidive admise et marquée avec son oracle, l'antériorité d'un lot du 01/09, la candidature hors lot, la classe suspecte et le référentiel illisible.
  - preuve, oracle : `todo/oracle-todo.mjs` v1.3.0 règle R13 (classe hors référentiel : FAIL ; récidive : AVERT) ; `todo/self-test.mjs` **50 → 52 PASS** ; l'oracle rejoué sur le vrai registre : **PASS**.
- **Pas 2 — la descente atteint le produit, ou le relevé dit de quoi il n'est pas protégé.**
  - preuve : `gabarits/HERITAGE.json` 1.7.0 → **1.8.0** — `todo/CLASSES.json` hérité en copie identique, chaque artefact déclare ses `familles_protegees` ; le relevé d'ouverture rejoué ce matin nomme pour chacun des cinq produits sans lanceur « NON PROTÉGÉ des familles : heritage-produit, lot-forme, page-html-socle, restitution-forme, … » (sortie de `oracles/hook-ouverture.mjs --sans-bootstrap`).
  - preuve, lexique : `oracles/hook-lexique.mjs` (UserPromptSubmit) — self-test **7 PASS** (quatre appels reconnus, trois messages ordinaires ignorés), recette `hook-lexique.test.mjs` **4 PASS** ; câblé dans `.claude/settings.json` du pilot et dans `gabarits/settings-produit.json` par le lanceur hérité (`hooks-factory.mjs`, hook `lexique`) ; exercé depuis la voie produit : la commande `node gabarits/hooks-factory.mjs lexique` sur « Améliore ce prompt : … » rend la ligne de contexte nommant `prompt-analyzer-l99`, exit 0.
- **Pas 3 — trois mesures et une contre-métrique, dans une vue générée.**
  - preuve : `todo/generer-recidives.mjs` → `todo/RECIDIVES.md` généré sur le vrai registre : 30 classes, 0 récidive marquée (aucun lot classé n'est encore entré), 1 relevé d'héritage ; le premier relevé journalisé ce matin dans `todo/HERITAGE-RELEVES.jsonl` (9 produits, 13 artefacts chacun) ; recette `generer-recidives.test.mjs` **5 PASS** — récidive comptée avec son produit, « non mesurable encore » dit et non mis à zéro, délai en jours mesuré dès qu'un relevé postérieur existe, contre-métrique, déterminisme (deux générations, même octet).
  - preuve, scellement : `oracle-empreintes` avait mis la recette entière en défaut (89/90) sur ce générateur, sixième site de hachage non déclaré ; corrigé par la fonction partagée `lib-empreinte` et la déclaration dans `references/EMPREINTES.md` — `oracle-empreintes` rejoué : **PASS** ; recette entière rejouée : voir la ligne ci-dessous.
- **Pas 4 — la revue des classes est écrite, et sa première candidature est au registre.**
  - preuve : section « Revue des classes » dans `BOUCLE-AMELIORATION.md` (cadence au plus une par quinzaine, seuil 2 produits ou 3 occurrences, sortie en candidature, contre-lecture obligatoire, format d'échange versionné) ; sidecar `input/01-candidatures/revue-classes-20260903a.tf.jsonl` ingéré → **TF-0790** en `candidat` ; `oracle-boite-entree` : **PASS**.
- **Les documents que les producteurs lisent disent la règle.**
  - preuve : `references/TODO-FORGE.md` (paragraphe « Un retour porte sa CLASSE, et une récidive se COMPTE — R13 ») ; `gabarits/RETOURS-FORGES.md` (classe obligatoire dans le sidecar, copie identique héritée) ; vue `TODO.md` régénérée, ainsi que la vue de consultation du registre par son générateur (jugée par la recette du registre, 52/52).
- **Recette entière du pilot rejouée après la correction du scellement.**
  - preuve : `oracles/self-tests.mjs`, second passage — exit 0, 90 oracles et recettes joués, 0 en défaut (dont les quatre recettes neuves et le cliquet du registre 50 → 52).

## 5. Non traité — avec son motif

- **Le plan de sonde forge-observability** : *dépendance à une décision humaine* — D-2 ; la candidature TF-0790 porte la proposition, rien n'est écrit chez la forge.
- **La pose du lanceur de hooks chez les cinq produits qui n'en ont pas** : *garde-fou nommé* — N-5, le pilot n'écrit pas chez un produit ; le relevé nomme désormais les familles dont chacun n'est pas protégé, pour que le geste soit un choix informé.
- **La classe sur les 780 items archivés** : *hors mandat* — l'archive est immuable (règle R8 de l'oracle) ; la mesure du pas 0 les a lus une fois, et les trente classes seed portent leurs clôtures fondatrices par identifiant, ce qui suffit à détecter une récidive dès le prochain lot.
- **Le contrôle de la classe côté produit, avant remise** : *écarté pour ce tour* — `forge/retours/oracle-lot.mjs` juge le `.md`, pas le sidecar (vérifié : `gabarits/oracle-lot-retours.mjs`, fonction `verifier(cheminLot)`, lit le lot Markdown et ses sections R-45/R-46 seulement) ; le refus reste à l'ingestion, avec les clés proches. Critère de réouverture : un lot refusé pour classe manquante après que le produit a reçu `CLASSES.json`.
- **Le durcissement de R13 et de la classe suspecte** : *borne atteinte* — règles neuves avertissantes par doctrine (v2.5.0) ; elles se durciront sur corpus propre, quand des lots classés seront entrés.
- **La vérification de collision inter-sessions à l'ingestion de TF-0790** : *dépendance externe* — `git fetch` a expiré ; trace mesurée à l'ingestion : « [préflight TF-0394] fetch/comparaison origin impossible » puis « [post-contrôle TF-0481] … CAUSE RÉELLE : spawnSync git ETIMEDOUT » ; l'ingestion locale est assumée.
- **Le rouge pré-existant de `oracle-secrets-hors-perimetre` sur le parc** : *hors mandat* — 11 porteurs de secrets hors dépôt et 3 dans des dépôts qui ne les ignorent pas, tous chez des produits, constat antérieur à ce mandat et relevé par la recette comme état du parc.

## 6. Écarts à la lettre

Le mandat validé est le prompt réécrit du matin. Chaque endroit où l'exécution s'en écarte est listé ici, poste par poste.

| Le mandat demandait | Ce qui est fait | Pourquoi |
|---|---|---|
| « un hook UserPromptSubmit chez le pilot, hérité par les produits » | Câblé au pilot et dans le gabarit de configuration produit ; un produit ne le reçoit qu'à sa prochaine ouverture, et seulement s'il porte le lanceur | N-5 : le pilot ne pose rien chez un produit ; cinq produits restent sans lanceur (bloc 8) |
| « ingerer-lot.mjs REFUSE un lot sans classe » | Refus pour les lots datés du **03/09 ou après** ; les lots antérieurs et les candidatures hors lot passent sans classe | Rétro-compatibilité exigée par le même mandat (pas 4) : casser les lots en attente ferait re-remonter ce qui l'était |
| « une clé créée moins de 30 jours après un retour voisin est signalée » | Signalée seulement si la clé est créée **sans clôture fondatrice** | Les trente classes seed sont toutes créées ce jour, à moins de 30 jours de leurs voisines : sans cette borne, le signal aurait crié sur tout le référentiel dès le premier lot |
| « génère un tableau de bord … si tu produis une page HTML, elle respecte le socle » | Vue Markdown générée, aucune page HTML | Le mandat laissait la page HTML conditionnelle ; la vue Markdown suffit à la revue et évite un livrable à critiquer |
| « le délai clôture → descente constatée chez le produit » | Mesuré à partir du premier relevé journalisé ce jour ; dit « non mesurable encore » pour toutes les classes | Aucun relevé n'existait avant ce matin ; la mesure se remplit à chaque ouverture du pilot |
| « une candidature … portant la forme proposée : règle, oracle, gabarit, ou changement du contrat d'échange » | La première candidature demande une surveillance entre les runs, pas une règle | Les trente classes seed portent déjà chacune une règle et un oracle ; ce qui manquait n'était pas une règle de plus mais quelqu'un qui relise le compteur |
| « classe au minimum les quatre exemples du mandat » | Classés par lecture manuelle des 50 récidives déclarées ; les comptes automatiques par famille sont donnés comme bornes hautes inexploitables | L'heuristique s'est révélée fausse à l'usage ; le dire vaut mieux que publier 94 % |

## 7. Risques

- **Une seconde session pilot travaille sur le même dépôt et a déjà emporté des fichiers de celle-ci dans ses commits** (elle l'a déclaré dans `6a3296c`).
  - signal : un commit de l'autre session qui contient des fichiers de ce mandat à moitié écrits, ou un identifiant TF frappé deux fois.
  - parade : ce tour ne committe que ses propres chemins, nommés au bloc 9 ; l'identifiant TF-0790 a été frappé après le dernier commit de l'autre session ; le fetch étant impossible, la collision distante reste non vérifiée et sera revue au push.
- **Le contrat d'héritage 1.8.0 fait passer le parc de 72 à 81 manques** — un artefact de plus, et le lanceur devenu divergent chez tous.
  - signal : les relevés d'ouverture affichent plus de manques qu'hier.
  - parade : les copies identiques se remettent à niveau à la prochaine ouverture de chaque produit équipé ; les cinq produits sans lanceur sont nommés avec les familles non protégées.
- **R13 avertit et ne bloque pas : une récidive peut être lue et laissée là.**
  - signal : le tableau de bord montre des récidives sans clôture ni candidature de revue.
  - parade : la revue des classes par quinzaine et, si D-2 est décidée, la sonde entre les runs.
- **Le hook du lexique reconnaît quatre formes ; une cinquième formulation passera sans appel.**
  - signal : un retour « skill oublié » sur une formulation absente du self-test.
  - parade : la classe `skill-non-invoque-lexique` existe ; le retour entre marqué récidive et la forme s'ajoute au lexique avec son cas de test.
- **Le journal des relevés grossit à chaque ouverture du pilot.**
  - signal : `todo/HERITAGE-RELEVES.jsonl` dépasse quelques mégaoctets.
  - parade : une ligne par ouverture, une dizaine de produits par ligne ; l'archivage par mois est une candidature à ouvrir le jour où la taille gêne.

## 8. Prochaines actions

Ordre de traitement : décider TF-0790 passe devant, parce qu'il rend le compteur relu ; la pose du lanceur vient ensuite, parce qu'elle supprime à la source la moitié des manques ; le push ferme la journée.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-5 | `neuve` | Écrire le plan de sonde forge-observability chez le pilot et exercer son premier passage. | `auto_ia` | `dependance_bloc_3` — attend D-2. | Le tableau de bord n'est relu qu'à la main. |
| A-6 | `neuve` | Décider TF-0790. | `manuelle_utilisateur` | `decision` — arbitrage de priorité sur une surveillance. | (c) de D-2 s'applique. |
| A-7 | `neuve` | Poser le lanceur de hooks et la configuration produit chez les cinq produits qui n'en ont aucun, nommés au relevé d'ouverture avec leurs familles non protégées. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit (N-5, votre mandat du 23/08). Trace mesurée : relevé du 03/09, cinq produits « SANS lanceur de hooks », chacun « NON PROTÉGÉ des familles : heritage-produit, lot-forme, page-html-socle, restitution-forme, skill-ou-oracle-non-invoque ». | Ces cinq produits ne reçoivent ni les classes, ni le hook du lexique, ni aucune descente. |
| A-8 | `neuve` | Donner le GO de publication du pilot (douze commits locaux en avance, dont celui-ci). | `manuelle_utilisateur` | `decision` — R-38, aucun push sans GO humain. Trace mesurée : `git fetch` a expiré pendant l'ingestion, la collision distante n'est pas vérifiée. | Les règles neuves ne vivent que sur ce poste ; un produit ouvert ailleurs hérite de l'ancien contrat. |

## 9. Traces

- Mesure du pas 0 : `output\03-etudes\20260903-recidives-mesure.md` — `check_markdown.py` PASS.
- Référentiel : `todo\CLASSES.json` v1.0.0 (30 classes, 18 familles) — hérité par `gabarits\HERITAGE.json` 1.8.0.
- Ingestion : `todo\ingerer-lot.mjs` (classe, `recidive_de`, `classe_suspecte`, `--classes`), recette `todo\ingerer-classe.test.mjs` 8/8.
- Oracle du registre : `todo\oracle-todo.mjs` v1.3.0 (R13), `todo\self-test.mjs` 52/52, PASS sur le vrai registre.
- Hook du lexique : `oracles\hook-lexique.mjs` (self-test 7/7), `oracles\hook-lexique.test.mjs` 4/4, `.claude\settings.json`, `gabarits\settings-produit.json`, `gabarits\hooks-factory.mjs`.
- Descente : `oracles\hook-ouverture.mjs` (familles non protégées, journal des relevés), `todo\HERITAGE-RELEVES.jsonl` (1 relevé).
- Tableau de bord : `todo\generer-recidives.mjs` → `todo\RECIDIVES.md`, recette 5/5 ; site de scellement déclaré dans `references\EMPREINTES.md`, `oracle-empreintes` PASS.
- Revue des classes : `BOUCLE-AMELIORATION.md` § « Revue des classes » ; candidature `input\01-candidatures\revue-classes-20260903a.tf.jsonl` → TF-0790 ; `oracle-boite-entree` PASS.
- Documents : `references\TODO-FORGE.md`, `gabarits\RETOURS-FORGES.md` ; vue `todo\TODO.md` régénérée (et la vue de consultation par `todo\generer-page.mjs`).
- Recette entière : `oracles\self-tests.mjs` — premier passage 89/90 (site de scellement non déclaré), second passage exit 0, 90 oracles et recettes joués, 0 en défaut (dont les quatre recettes neuves et le cliquet du registre 50 → 52).
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Amelioration continue pas 0 a 4 - 20260903b.md` — jugée par `oracle-synthese` avant affichage.
- Commit local : commit de clôture du 03/09 sur `main`, chemins de ce mandat seulement (message « Mandat amélioration continue … », voir `git log -1`) — aucun push.
