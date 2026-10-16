---
destinataire: humain
---

# Synthèse de mandat — décisions 16, 17 et 18 exécutées : le parc des treize forges est vert, trois classes et trois items de plus, la règle T6 juge les lots du pilot, deux lots déposés (05/09/2026)

Vos trois décisions sont exécutées. La branche locale de sauvegarde de la forge de développement est supprimée : la porte de publication rend PASS sur les treize clones du parc, sans exception ni branche cachée. Les trois constats que les forges ne pouvaient pas remettre faute de classe ont chacun leur classe et leur item au registre. Le défaut du pilot qui nommait le mauvais module producteur a son contrôle : l'oracle des lots de travaux porte une règle T6, avec sa recette à deux sens, et cette règle, rejouée sur les lots déjà déposés ce jour, en refuse deux — preuve qu'elle mord. Deux lots sont déposés et jugés : le nom de produit à corriger chez la forge de développement, la règle C5 (la porte de publication juge aussi les noms de produits) et le banc de la moitié impure du gate (la porte qui juge un fichier avant d'en autoriser l'écriture) chez la forge des outils. Ce qui change pour vous : plus rien de rouge dans le parc, et un lot du pilot ne peut plus nommer un producteur sans l'avoir lu. Ce qui est attendu de vous : le mandat d'instruire les trois lots qui attendent dans les boîtes des forges, et le tri des trois candidatures neuves.

## 1. En-tête d'identification

- **quoi** — mandat humain « 16a, 17a, 18a » sur la synthèse 20260905k : suppression de la branche locale (A-43), trois classes et trois candidats (A-41), règle T6 au pilot et deux lots de travaux (A-42).
- **sur quoi** — forge-development (branche locale supprimée, un lot déposé) ; forge-agents (un lot déposé) ; le pilot `digit-ai-factory` (registre, classes, oracle des lots, gabarit, dossier des originaux, tables des familles).
- **quand** — fin le **05/09/2026 à 18:25 (UTC+02:00)**, ≈ 30 minutes depuis votre mandat, sans agent subordonné.
- **qui** — Claude Fable 5.1 (extension VS Code) ; pilot en version `8aaa4a2` avant, cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

A-43 **fait** (branche supprimée, porte PASS sur le clone entier ; parc 13 forges sur 13 vertes) ; A-41 **fait** (classes 34 → 37, TF-0822, TF-0823, TF-0824 candidats) ; A-42 **fait** (oracle des lots 1.0.0 → 1.1.0 avec T6, recette 14 → 18, gabarit mis à jour, TF-0819 clos ; TF-0820 et TF-0821 décidés, lots 20260905f chez forge-development et 20260905g chez forge-agents déposés, T1-T6 PASS) ; banc du pilot 94/94 ; trois lots en attente d'instruction (e, f, g).

## 3. Décisions attendues

Deux décisions restent, toutes deux nées des comptes rendus du soir : trois candidatures entrées par les classes neuves, et une copie héritée que la règle neuve laisse en retard. Chaque décision porte le même tableau de trois lignes, à lire ligne par ligne : la colonne « Option » nomme le choix, « Ce qu'elle coûte » donne sa complexité et sa durée, « Ce qu'elle exclut » dit ce à quoi l'on renonce ; les lignes vont de l'option recommandée à l'inaction, rien n'est trié ni omis.

> **D-19 — Comment trie-t-on les trois candidatures entrées ce tour par les classes neuves : la transcription de la prose vers un champ que rien ne vérifie, la fixture jugée par son seul oracle, et le contrat de sortie du lanceur d'oracles sans domicile ?**
> Les deux premières viennent de la forge de conception. Depuis ce jour, deux champs machine sont déclarés transcrits d'une prose qu'aucun de ses onze oracles ne lit : l'oracle prouve que l'écart est écrit, jamais qu'il a été décidé ; et une fixture n'est déclarée verte que pour l'oracle qu'elle sert, si bien que la règle neuve du jour a fait basculer une fixture voisine sans qu'un cas le dise. La troisième vient de la forge des outils : le format de ce que rend le lanceur d'oracles a changé deux fois en dix jours, dont une fois ce jour, sans qu'un document versionné le porte. Les trois sont mesurés, bornés, et chacun tient en un lot chez sa forge.
> **Recommandation : (a).** Source consultée : `todo\TODO.md` (TF-0822, TF-0823, TF-0824, source, classe, score) ; les deux lots de retours du soir ; `todo\CLASSES.json` (classes créées ce tour, familles « règle morte », « skill ou oracle non invoqué », « contrat d'interface entre forges »).
> Le premier est celui qui touche une décision de produit (un écart non décidé passe) ; les deux autres sont des filets de recette dont le coût croît avec chaque règle ajoutée.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider les trois : un lot à forge-conception pour les deux siens (correspondance prose ↔ champ, matrice fixture × oracle), un lot à forge-agents pour le contrat de sortie | simple × court pour la décision ; deux lots à déposer | exclut un tri fin |
| **(b)** décider seulement le premier, le seul qui touche une décision de produit | simple × court | exclut les deux filets de recette, dont un vient de mordre ce jour |
| **(c)** ne rien décider | gratuit | exclut toute instruction ; les trois restent candidates |

> **Si rien n'est décidé** : (c) s'applique — les trois restent candidates, rien ne se dégrade.

> **D-20 — Fait-on descendre la règle T6 de l'oracle des lots de travaux chez les produits qui en portent une copie héritée, alors que cette copie est déclarée conforme par l'héritage et que la règle vient de changer ?**
> L'oracle des lots de travaux est la source unique des deux côtés du canal : le pilot le joue avant d'émettre, le produit en reçoit une copie conforme par l'héritage (le relevé d'héritage, la règle qui juge ce que le pilot a transmis à un produit). Ce tour lui ajoute une règle et change sa version. Toute copie installée chez un produit est donc en retard d'une règle : un lot que le pilot juge T6 PASS y serait jugé par un oracle qui ne connaît pas T6, ce qui ne refuse rien à tort, mais rend le canal asymétrique — exactement ce que l'oracle est né pour empêcher. Le pilot n'écrit pas chez un produit hors mandat ; le relevé d'héritage sait mesurer l'écart.
> **Recommandation : (a).** Source consultée : `gabarits\oracle-travaux-pilot.mjs` (en-tête : « le produit en reçoit une copie conforme par l'héritage ») ; `oracles\oracle-conformite-projet.mjs` (R-47, le relevé d'héritage du pilot chez un produit) ; `ETAPE-MEP.md` et `references\TODO-FORGE.md` (produits autonomes, écriture sur mandat seulement).
> Une copie en retard d'une règle est un écart que le relevé mesure ; le corriger est un geste par produit, sur mandat.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** mesurer l'écart par le relevé d'héritage chez chaque produit (lecture seule), puis un lot de travaux par produit en retard | simple × court pour la mesure ; un lot par produit | exclut une descente immédiate sans lot |
| **(b)** laisser la copie héritée telle quelle jusqu'au prochain run de chaque produit | gratuit maintenant | exclut la symétrie du canal jusqu'à ce run |
| **(c)** ne rien faire | gratuit | exclut toute mesure ; l'écart reste invisible |

> **Si rien n'est décidé** : (c) s'applique — les copies restent en retard, le relevé ne les compte pas.

## 4. Traité — avec sa preuve

- **A-43 — branche locale de forge-development supprimée** (D-16 (a)) — `sauvegarde/20260809`, cinquante et un commits qu'aucune branche publiée ne portait ; contrôle rouge → vert : porte sur le clone entier FAIL 89 → PASS.
  - preuve : `Deleted branch sauvegarde/20260809 (was b49e2d0)` ; `oracle-nom-client-publie` PASS sur le clone entier ; le paquet de sauvegarde du soir la porte ; parc mesuré : 13 forges sur 13 vertes.
- **A-41 — trois classes et trois candidats** (D-17 (a)) — `champ-transcrit-de-prose-sans-correspondance` (famille « règle morte », voisine du sceau, l'empreinte qui scelle une vue dérivée), `fixture-jugee-par-son-seul-oracle` (famille « skill ou oracle non invoqué »), `contrat-de-sortie-sans-domicile` (famille « contrat d'interface entre forges ») ; les constats RC-6, RC-7 (les deux constats en prose de la forge de conception) et celui du contrat de sortie (forge des outils) entrent au registre sous TF-0822, TF-0823, TF-0824, chacun avec sa source, sa classe et son score.
  - preuve : `todo\CLASSES.json` 34 → 37 (version 1.2.0) ; trois créations journalisées (PASS) ; `oracle-todo` PASS.
- **A-42 — règle T6 au pilot, TF-0819 clos** (D-18 (a)) — classe : un lot qui nomme un producteur sans l'avoir lu ; contrôle rouge → vert : les lots déposés d et e, qui nomment `derive-les-vues` sans lecture déclarée, rendent FAIL T6 avec la règle neuve (ils ne sont pas modifiés : un lot déposé ne change jamais) ; les lots c, f, g rendent PASS ; recette de l'oracle 14 → 18 cas (deux rouges, deux verts), banc du pilot 94/94. La règle : quand « ce qui est demandé » dit qu'un artefact est transcrit, produit, écrit, dérivé, généré ou porté par un module, le lot porte une ligne « Module producteur lu » qui cite la source lue ; le gabarit des lots porte la ligne.
  - preuve : `gabarits\oracle-travaux-pilot.mjs` 1.0.0 → 1.1.0 ; `oracle-travaux-pilot.test.mjs` 18/18 ; `oracles\self-tests.mjs` 94/94 (cliquet des cas tenu) ; événement de clôture de TF-0819 (PASS).
- **A-42 — deux lots déposés** — `pilot - TRAVAUX - 20260905f.md` chez forge-development (TF-0820 : trois mentions d'un nom de produit dans deux fichiers courants, à remplacer par le pseudonyme par un commit ordinaire — le nom réel n'apparaît nulle part au pilot) ; `pilot - TRAVAUX - 20260905g.md` chez forge-agents (TF-0821 : la fonction qui lit la version précédente d'un fichier devient éprouvable, sur dépôt jetable, et le banc n'avale plus une erreur en échec muet ; TF-0820 volet porte : règle C5 lue depuis la table des pseudonymes, absence de table déclarée) ; TF-0820 et TF-0821 décidés (rangs 8 et 9).
  - preuve : `oracle-travaux-pilot` T1 (le moyen de vérification) à T6 (le module producteur lu) PASS sur les deux ; sidecars écrits ; copies déposées dans `input\00-travaux\` des deux forges ; originaux dans `output\06-travaux-confies\` ; aucune occurrence du nom de produit dans les originaux (recherche : zéro).
- **Famille d'output déclarée** — le dossier `06-travaux-confies\` créé à midi manquait à la table des familles du LISEZMOI d'output ; le banc du pilot l'a vu (I3, la règle qui confronte les familles du disque aux tables).
  - preuve : `familles-numerotees.test.mjs` 5/6 → 6/6 ; `readme-dossiers --check` PASS.
- **Publication du pilot** en avance rapide.
  - preuve : `git push` → jusqu'à `8aaa4a2` ; cette synthèse part dans le commit suivant.

## 5. Non traité — avec son motif

- **L'instruction des trois lots déposés (e chez forge-conception, f chez forge-development, g chez forge-agents)** : *hors mandat* — vos décisions disaient « déposer » ; ouvrir une session chez un dépôt frère exige un mandat (A-44, A-45, A-46).
- **TF-0822, TF-0823, TF-0824** : *tout entre en candidat* — D-19.
- **La descente de T6 chez les produits** : *écriture chez un produit hors mandat* — D-20.
- **La modification des lots d et e déjà déposés**, que T6 refuserait aujourd'hui : *un lot déposé ne se modifie jamais* — écart déclaré, la forge de conception a d'ailleurs confirmé que le lot d nommait le bon producteur.
- **A-25 et A-19 (produit 02), A-6 (l'autre poste), A-17 (D-7)** : *inchangés* — non mandatés ce tour.

## 6. Écarts à la lettre

- Votre réponse portait trois décisions, aucune action → les trois actions qui en dépendaient (A-41, A-42, A-43) ont été exécutées → parce que chacune était écrite « si D-N (a) » et ne dépendait de rien d'autre, comme au tour précédent.
- D-18 (a) disait « une candidature de règle C5 chez forge-agents » → la candidature est portée comme second élément du lot g, pas comme item séparé du registre → parce que TF-0820 porte déjà les deux volets (mentions, porte) et qu'un item par volet dupliquerait la source.
- Le lot f ne nomme le produit que par son pseudonyme et cite les lignes exactes → parce que l'original du lot est un fichier suivi du pilot, et que la règle d'anonymisation s'applique au pilot avant tout.
- T6 exige une lecture déclarée, pas sa justesse → même borne que T1, déclarée dans l'en-tête de l'oracle.

## 7. Risques

- **Les copies héritées de l'oracle des lots chez les produits sont en retard d'une règle** tant que D-20 n'est pas tranchée.
  - signal : un lot jugé T6 PASS au pilot et jugé par cinq règles seulement chez le produit.
  - parade : D-20 (a), relevé d'héritage puis lot par produit.
- **Trois lots attendent dans trois boîtes** ; le nom de produit reste public jusqu'à l'instruction du lot f.
  - signal : une recherche du nom sur GitHub qui le trouve encore demain.
  - parade : A-45 en premier.
- **La règle C5 n'existe pas encore** : la porte reste verte sur un dépôt qui porte un nom de produit.
  - signal : la prochaine passe de réécriture qui modifie un fichier courant que la porte laissait passer.
  - parade : A-46.
- **L'autre poste et tout clone de forge-agents restent incompatibles** avec l'histoire réécrite à midi.
  - signal : un `git pull` qui rapporte des centaines de commits divergents.
  - parade : A-6.

## 8. Prochaines actions

Ordre de traitement : d'abord le lot qui retire un nom public, puis la règle qui empêchera le prochain, puis le sceau (l'empreinte qui scelle une vue dérivée) ; les décisions et les restes humains ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-45 | TF-0820 | Ouvrir une session chez forge-development sur le lot `pilot - TRAVAUX - 20260905f.md` (agent mandaté, porte verte avant push, avance rapide), puis remettre le lot de retours au pilot. | `auto_ia` | `hors_mandat` — ouvrir une session chez un dépôt frère exige un mandat. | Le nom de produit reste public dans deux fichiers. |
| A-46 | TF-0821, TF-0820 | Ouvrir une session chez forge-agents sur le lot `pilot - TRAVAUX - 20260905g.md`, puis remettre le lot de retours au pilot. | `auto_ia` | `hors_mandat` — même règle. | La porte ne juge pas les produits ; le gate (la porte qui juge un fichier avant d'en autoriser l'écriture) garde une moitié non éprouvée. |
| A-44 | TF-0818 | Ouvrir une session chez forge-conception sur le lot `pilot - TRAVAUX - 20260905e.md`, puis remettre le lot de retours au pilot. | `auto_ia` | `hors_mandat` — même règle. | Une vue peut perdre une décision opposable sans qu'un oracle le voie. |
| A-47 | TF-0822, TF-0823, TF-0824 | Si D-19 (a) : déposer un lot chez forge-conception (correspondance prose ↔ champ, matrice fixture × oracle) et un chez forge-agents (contrat de sortie du lanceur). | `auto_ia` | `dependance_bloc_3` — D-19. | Un écart non décidé passe ; une fixture bascule en silence ; un format change sans lecteur. |
| A-48 | TF-0819 | Si D-20 (a) : jouer le relevé d'héritage (lecture seule) chez chaque produit, puis un lot de travaux par produit dont la copie de l'oracle des lots est en retard. | `auto_ia` | `dependance_bloc_3` — D-20 ; écriture chez un produit sur mandat seulement. | Le canal des lots reste asymétrique chez les produits. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot ; recloner forge-agents (histoire réécrite). | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | Une fusion depuis l'autre poste réintroduit l'ancienne histoire. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run). | `auto_ia` | `garde_fou` — session vivante ce matin ; à vérifier à la reprise. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : quatre fichiers non commis. | Un nettoyage efface les chemins d'échec prouvés. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Forge-development : branche `sauvegarde/20260809` supprimée (paquet `c:\dev\_sauvegardes\digit-ai-forge-development-avant-filter-repo-20260905.bundle` la porte) ; porte PASS sur le clone entier ; lot `input\00-travaux\pilot - TRAVAUX - 20260905f.md` + sidecar déposés.
- Forge-agents : lot `input\00-travaux\pilot - TRAVAUX - 20260905g.md` + sidecar déposés ; rien d'autre.
- Forge-conception : lot e du tour précédent toujours en attente.
- Pilot : `todo\TODO.jsonl` — TF-0819 décidé et clos ; TF-0820, TF-0821 décidés ; TF-0822, TF-0823, TF-0824 créés ; `todo\CLASSES.json` 1.2.0 (37 classes) ; `gabarits\oracle-travaux-pilot.mjs` 1.1.0, sa recette (18 cas), `gabarits\TRAVAUX-PILOT.md` ; `output\LISEZMOI.md` (famille 06 déclarée) ; `oracles\baseline-recettes.json` (cliquet des cas) ; `output\06-travaux-confies\` (lots f, g) ; vues `todo\TODO.md` et `todo\AVANCEMENT.md` ; cette synthèse — le tout dans le commit qui suit `8aaa4a2`.
- Oracles rejoués : `oracle-nom-client-publie` sur forge-development (clone entier PASS) · `oracle-travaux-pilot` ×5 (c, f, g PASS ; d, e FAIL T6, mesure seulement) · `oracles\self-tests.mjs` 94/94 · `oracle-todo` PASS · `readme-dossiers --check` PASS.
