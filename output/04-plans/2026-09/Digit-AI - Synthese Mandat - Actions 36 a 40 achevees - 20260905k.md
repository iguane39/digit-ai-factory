---
destinataire: humain
---

# Synthèse de mandat — actions 36 à 40 achevées : deux lots instruits et publiés, les branches anciennes supprimées, la forge de développement était déjà verte, deux classes et un lot de plus (05/09/2026)

Vos cinq actions sont faites, dont une autrement que prévu. Deux agents mandatés ont instruit les lots déposés chez la forge des outils et chez la forge de conception : le gate d'écriture (la porte qui juge un fichier avant d'en autoriser l'écriture) compte désormais les constats d'un même oracle et déclare son repli quand le delta n'est pas calculable, et les trois exigences socle candidates ont un champ d'écart qu'un oracle lit. Les deux commits sont publiés, les trois items clos, les copies installées sur ce poste réalignées. Les deux branches locales anciennes de la forge des outils sont supprimées et sa porte est verte sur le clone entier. La forge de développement a été rejouée selon le mode opératoire, et la mesure décisive a précédé la publication : sa branche publiée était déjà verte, les quatre-vingt-neuf constats vivaient dans une branche locale jamais poussée, et GitHub protège sa branche principale contre tout push forcé — rien n'a été réécrit en ligne, rien ne devait l'être. Le tri du sceau (l'empreinte qui scelle une vue dérivée) est fait : classe, décision, lot déposé ; le défaut du pilot qui nommait le mauvais module producteur a sa classe et son item. Ce qui change pour vous : les trois forges touchées ce jour sont publiées et vertes, et la règle de mesure avant réécriture est écrite. Ce qui est attendu de vous : une suppression de branche locale, la création de trois classes que les forges attendent, et le tri de trois candidatures neuves.

## 1. En-tête d'identification

- **quoi** — mandat humain « A-36 à A-40 » sur la synthèse 20260905j, lu avec les options recommandées de D-13, D-14 et D-15 (a) : instruction des lots chez forge-agents (A-36) et forge-conception (A-37) par agents mandatés, suppression des branches locales anciennes (A-38), réécriture de forge-development (A-39), tri du sceau et du constat sans classe (A-40).
- **sur quoi** — forge-agents (commit publié, branches supprimées) ; forge-conception (commit publié, un lot de plus déposé) ; forge-development (mesurée, sauvegardée, non modifiée en ligne) ; le pilot `digit-ai-factory` (registre, classes, mode opératoire, originaux de lots) ; les copies installées de ce poste.
- **quand** — fin le **05/09/2026 à 17:50 (UTC+02:00)**, ≈ 50 minutes depuis votre mandat, dont 26 de travail parallèle des deux agents.
- **qui** — Claude Fable 5.1 (extension VS Code) et deux agents subordonnés ; pilot en version `421cc79` avant, cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

A-36 **fait** (forge-agents `f8d81d8` publié, banc du hook 26 → 34, TF-0815 et TF-0816 clos) ; A-37 **fait** (forge-conception `be41b25` publié, self-test 12×49 → 13×50, TF-0814 clos) ; A-38 **fait** (deux branches supprimées, porte PASS sur le clone entier) ; A-39 **fait autrement** (mode opératoire rejoué, publication refusée par la protection de branche et inutile : `main` seule déjà verte, TF-0813 clos sur mesure) ; A-40 **fait** (deux classes, TF-0818 décidé et confié par le lot 20260905e, TF-0819 candidat contre le pilot) ; 3 candidatures neuves (TF-0820, TF-0821, et trois constats sans classe en prose) ; copies installées réalignées (`oracle-skills` PASS) ; pilot publié `421cc79`.

## 3. Décisions attendues

Les trois décisions viennent des comptes rendus et de la mesure du jour : une branche locale qui garde des noms, des constats que les forges ne peuvent pas remettre faute de classe, et des candidatures neuves. Chaque décision porte le même tableau de trois lignes, à lire ligne par ligne : la colonne « Option » nomme le choix, « Ce qu'elle coûte » donne sa complexité et sa durée, « Ce qu'elle exclut » dit ce à quoi l'on renonce ; les lignes vont de l'option recommandée à l'inaction, rien n'est trié ni omis.

> **D-16 — Supprime-t-on, sur ce poste, la branche locale de sauvegarde de la forge de développement, seule à porter les quatre-vingt-neuf constats, comme vous l'avez décidé ce jour pour la forge des outils ?**
> La branche publiée de la forge de développement est verte : la porte de publication, jouée sur un clone à branche unique, rend zéro constat avant toute réécriture. Les quatre-vingt-neuf constats mesurés ce matin vivent tous dans une branche locale d'août, jamais poussée, cinquante et un commits qu'aucune branche publiée ne porte. Cette branche est dans le paquet de sauvegarde du jour, vérifié, hors dépôt. C'est la situation exacte tranchée à midi pour la forge des outils, et la suppression est un geste humain.
> **Recommandation : (a).** Source consultée : `oracle-nom-client-publie` sur le clone entier (FAIL, 89) et sur un clone à branche unique de `main` (PASS) ; `git bundle verify` du paquet ; la décision D-13 (a) de ce jour.
> Tant que la branche existe, la porte sur ce clone contredit la porte sur le dépôt publié, et chaque mesure de parc la comptera.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** supprimer la branche locale (`git branch -D`), le paquet faisant foi | simple × court : une commande, porte rejouée | exclut de retrouver ces commits sans passer par le paquet |
| **(b)** la renommer en `archive/…` | simple × court | exclut une porte verte sur le clone entier |
| **(c)** ne rien faire | gratuit | exclut tout effet ; la mesure de parc reste à 12 forges vertes sur 13 |

> **Si rien n'est décidé** : (c) s'applique — la branche reste, rouge sur ce poste seul.

> **D-17 — Crée-t-on les trois classes que les deux forges ont demandées en prose, faute de pouvoir remettre leurs constats au sidecar (le fichier machine qui accompagne un lot), sachant qu'un constat sans classe n'entre jamais au registre ?**
> Les deux comptes rendus du soir portent trois constats généralisables qu'aucune classe ne couvre, chacun décrit avec la classe qui manquerait : chez la forge de conception, la transcription de la prose vers un champ n'est vérifiée par rien et le document d'exigences n'est l'entrée d'aucun oracle ; une fixture n'est déclarée verte que pour l'oracle qu'elle sert, si bien qu'une règle neuve sur un oracle partagé fait basculer les autres en silence ; chez la forge des outils, le contrat de sortie du lanceur d'oracles n'a aucun domicile écrit alors que son champ de détail a changé deux fois en dix jours. Les deux forges ont respecté la règle : une classe ne se crée jamais dans un sidecar ; le pilot en est le seul créateur.
> **Recommandation : (a).** Source consultée : les lots de retours du soir (`…forge-conception - RETOURS - 20260905c.md`, constats RC-6 (la transcription non vérifiée) et RC-7 (la fixture verte pour un seul oracle) ; `…forge-agents - RETOURS - 20260905b.md`, section « un second constat, sans classe ») ; `todo\CLASSES.json` (34 classes, familles « règle morte » et « skill ou oracle non invoqué » pertinentes).
> Trois constats mesurés qui n'entrent pas au registre sont trois récidives futures que rien ne comptera ; la création d'une classe coûte dix lignes.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** créer les trois classes et journaliser les trois constats en candidats, contre leur forge | simple × court : trois entrées, trois créations | exclut un tri préalable des trois |
| **(b)** créer seulement les deux de la forge de conception, qui touchent le référentiel d'exigences | simple × court | exclut le contrat de sortie du lanceur, pourtant celui qui vient de changer |
| **(c)** ne rien créer | gratuit | exclut toute trace ; les constats restent en prose dans deux lots |

> **Si rien n'est décidé** : (c) s'applique — les trois constats restent en prose, hors registre.

> **D-18 — Comment trie-t-on les trois candidatures entrées ce tour : le défaut du pilot qui nomme le mauvais module producteur, le nom de produit qui vit dans deux fichiers courants de la forge de développement sans que la porte le voie, et la moitié impure du gate (la porte qui juge un fichier avant d'en autoriser l'écriture) qu'aucun cas du banc n'éprouve ?**
> La première vise le pilot : son lot du matin attribuait à un verbe la production d'un champ qu'il ne produit jamais, et la forge a dû répartir ; la règle est de lire le module producteur avant d'écrire. La deuxième vient de la passe de réécriture : les règles dérivées de la table des pseudonymes de produits ont modifié deux fichiers courants, un identifiant de lot en commentaire et en docstring, alors que la porte ne connaît que la table des clients — faut-il qu'elle juge aussi les produits, et corrige-t-on les deux mentions par un commit ordinaire. La troisième vient de la forge des outils : la fonction qui va chercher la version précédente d'un fichier n'est éprouvée par aucun cas du banc, alors que les trois défauts des deux derniers jours y vivaient.
> **Recommandation : (a).** Source consultée : `todo\TODO.md` (TF-0819, TF-0820, TF-0821, source et classe) ; le diff des deux fichiers courants de la forge de développement ; le lot de retours de la forge des outils (constat RB-1, le constat sur la fonction non éprouvée).
> Les trois sont mesurés, bornés et peu coûteux ; celui du pilot se corrige chez lui en une règle d'oracle, les deux autres en un lot chacun.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider les trois : TF-0819 au pilot (règle T6 — tout module producteur nommé existe — de l'oracle des lots de travaux), TF-0820 en un lot à forge-development (deux mentions corrigées par commit ordinaire) et une candidature de règle C5 (la porte juge aussi les noms de produits) chez forge-agents, TF-0821 en un lot à forge-agents | simple × court pour la décision ; une règle, deux lots | exclut un tri fin |
| **(b)** décider seulement TF-0820, le seul qui touche un dépôt public | simple × court | exclut la règle du pilot et le banc du gate (même porte) |
| **(c)** ne rien décider | gratuit | exclut toute instruction ; les trois restent candidates |

> **Si rien n'est décidé** : (c) s'applique — les trois restent candidates, rien ne se dégrade.

## 4. Traité — avec sa preuve

- **A-36 — TF-0815 et TF-0816 clos chez forge-agents** — classe : un partage neufs/préexistants qui identifie un constat par une ligne tronquée, et un repli muet ; contrôle rouge → vert : deux notes identiques à un chapitre près rendaient une ligne de constat identique mot pour mot, elles rendent « 2 constat(s) · … » contre « 3 constat(s) · … » ; un chemin relatif rendait « delta non calculé » sans un mot, il rend le même partage que le chemin absolu, et une cible hors dépôt un refus qui dit « DELTA NON CALCULABLE — hors dépôt » ; banc du hook 26 → 34 (28/34 sans les correctifs, 34/34 avec), toutes les recettes de la forge vertes. Écarts déclarés par la forge : le hook a dû reconnaître le marqueur « constat » en plus du lanceur ; la fixture bout en bout à travers le hook n'a pas été jouée, aucun fichier suivi ne portant deux constats d'un même oracle ; un seul commit pour les deux items.
  - preuve : commit `f8d81d8`, porte PASS, poussé (`0dc0b2a..f8d81d8`) ; lot `digit-ai-forge-agents - RETOURS - 20260905b.md` PASS, ingéré (TF-0821, récidive marquée) ; deux événements de clôture (PASS).
- **A-37 — TF-0814 clos chez forge-conception** — classe : une loi sans lieu où s'écrire ; contrôle rouge → vert : une fixture privée des trois candidates socle et sans écart passait cinq oracles en exit 0, elle rend un FAIL nommant la candidate ; oracles qui jugent les trois candidates 0 → 1 (règle E10, la règle des exigences socle), verdicts prononçables 0 → 3, self-test 12×49 → 13×50, sept cas de la branche tenus. Le validateur d'écart est remonté au contrat commun, partagé par la règle de surface (renforcement déclaré, sept cas de TF-0811 rejoués verts) ; une fixture cible d'un delta passe de exit 0 à 1 sur l'oracle des exigences, non migrée, déclarée.
  - preuve : commit `be41b25` (19 fichiers), porte PASS, poussé (`d6ab8ff..be41b25`) ; lot `…forge-conception - RETOURS - 20260905c.md` PASS, sidecar vide à dessein (deux constats sans classe, en prose) ; événement de clôture (PASS).
- **A-38 — branches locales anciennes supprimées chez forge-agents** (D-13 (a)) — `master` et `sauvegarde/20260809`, qu'aucune branche publiée ne portait ; contrôle rouge → vert : porte sur le clone entier FAIL 200 → PASS.
  - preuve : `Deleted branch master (was 045c0e3)`, `Deleted branch sauvegarde/20260809 (was be0d6d4)` ; `oracle-nom-client-publie` PASS sur le clone entier ; le paquet de sauvegarde du midi les porte.
- **A-39 — mode opératoire rejoué sur forge-development, publication ni possible ni nécessaire** (D-14 (a)) — paquet `…forge-development-avant-filter-repo-20260905.bundle` vérifié, HEAD consigné ; 34 règles dérivées ; clone frais avec les deux branches de GitHub et les quinze étiquettes ; une passe, 148 commits, porte PASS sur le clone réécrit. Mesure décisive : la porte sur un clone de `main` seule rend PASS avant réécriture ; les 89 constats vivent dans la branche locale `sauvegarde/20260809`. Le push forcé de `main` est refusé par GitHub (branche protégée, avance rapide seule) ; la branche de correctif et les étiquettes sont inchangées, mêmes empreintes ; le clone local est remis sur `origin/main` (`00097b6`). La passe a modifié deux fichiers courants sur un nom de PRODUIT que la porte ne juge pas : TF-0820.
  - preuve : `remote: error: GH006: Protected branch update failed for refs/heads/main` ; `git ls-remote` identique au paquet (branches, étiquettes) ; `oracle-nom-client-publie` PASS sur un clone de `main` seule ; TF-0813 décidé et clos sur cette mesure (PASS) ; leçon écrite dans `references\TODO-FORGE.md` (mesurer sur un clone à branche unique, vérifier la protection avant de réécrire).
- **A-40 — le sceau et le constat sans classe** (D-15 (a)) — classe `sceau-de-vue-provenance-sans-contenu` existait depuis midi ; TF-0818 décidé (rang 5) et confié à forge-conception par le lot `pilot - TRAVAUX - 20260905e.md` (variante « empreinte du corps », à traiter après le lot d) ; classe `lot-de-travaux-mauvais-module-producteur` (famille « lot forme ») créée, TF-0819 journalisé contre le pilot.
  - preuve : `oracle-travaux-pilot` T1 (le moyen de vérification) à T5 (l'ordre justifié) PASS sur le lot e, déposé dans `input\00-travaux\` de la forge (vu et non traité par l'agent de A-37, comme demandé) ; `todo\CLASSES.json` 33 → 34 ; `oracle-todo` PASS après neuf événements du soir.
- **Copies installées réalignées** : le hook d'écriture et le lanceur d'oracles (forge-agents), les deux skills de conception touchés (forge-conception).
  - preuve : `oracle-skills` FAIL (K2 ×3, K6 ×1) → `--appliquer` → PASS ; le hook installé est identique à `f8d81d8` (comparaison binaire).
- **Publication du pilot** en avance rapide.
  - preuve : `git push` → jusqu'à `421cc79` ; cette synthèse part dans le commit suivant.

## 5. Non traité — avec son motif

- **La suppression de la branche locale de forge-development** : *irréversible* — R-29 (la règle qui réserve toute suppression à l'humain), D-16.
- **Les trois constats sans classe** (RC-6 et RC-7 de la forge de conception, le contrat de sortie du lanceur chez la forge des outils) : *tout entre en candidat, et une classe ne se crée que par le pilot* — D-17.
- **TF-0819, TF-0820, TF-0821** : *tout entre en candidat* — D-18.
- **L'instruction du lot 20260905e (le sceau)** : *hors mandat* — A-40 disait « déposer » ; ouvrir une session chez la forge est une action à mandater (A-44).
- **A-25 et A-19 (produit 02), A-6 (l'autre poste), A-17 (D-7)** : *inchangés* — non mandatés ce tour.
- **Le fichier `run\rapport-jouet.md.oracles.json` non suivi chez forge-agents** : *laissé en place par l'agent, non commis* — une suppression est un geste humain.

## 6. Écarts à la lettre

- A-38, A-39 et A-40 dépendaient de D-13, D-14 et D-15 non tranchées → les options recommandées (a) ont été appliquées → parce que votre mandat portait les cinq actions par leur numéro, comme pour A-31 ce matin.
- A-39 disait « push forcé, clone rebâti » → aucun push forcé (refusé par la protection de branche), clone remis sur l'histoire publiée → parce que la mesure sur `main` seule rendait déjà PASS : la prémisse de D-14 venait d'une mesure faite sur le clone entier, branche locale comprise ; la synthèse de midi disait « la forge de développement rend quatre-vingt-neuf constats », c'était vrai du clone, pas du dépôt publié.
- A-39 a laissé son paquet de sauvegarde et ses règles dérivées bien que rien n'ait été réécrit → conservés, ils coûtent 40 Mo hors dépôt et prouvent la mesure.
- A-36 disait « sans autre modification » pour le compteur du hook → la forge a ajouté un marqueur au hook → déclaré dans son lot, nécessaire (la liste fermée des marqueurs ignorait « constat »).
- A-37 disait « même critère d'écart valide » → la forge l'a lu comme un fond, pas une copie, et a remonté le validateur au contrat commun, touchant un oracle que le lot ne nommait pas → renforcement déclaré (R-43), sept cas témoins rejoués verts.

## 7. Risques

- **Une règle neuve sur un oracle partagé fait basculer les autres fixtures en silence** (constat RC-7 de la forge de conception) — mesuré ce jour : une fixture cible d'un delta est passée de exit 0 à 1 sans qu'un cas la déclare.
  - signal : un self-test vert dont une fixture rougit sur un oracle qu'elle ne sert pas.
  - parade : D-17 (a), puis un lot chez la forge de conception.
- **Le contrat de sortie du lanceur d'oracles a changé deux fois en dix jours sans domicile écrit** : toute forge qui lit le champ de détail peut se casser sans préavis.
  - signal : une recette d'une autre forge qui rougit sur la forme d'une ligne de constat.
  - parade : D-17 (a) ; la copie installée de ce poste est déjà la nouvelle.
- **Deux fichiers publics de la forge de développement portent un nom de produit** que le pilot pseudonymise partout ailleurs, et la porte ne le voit pas par construction.
  - signal : une recherche du nom sur GitHub qui le trouve.
  - parade : D-18 (a) — commit ordinaire chez la forge, règle C5 à la porte.
- **L'autre poste et tout clone de forge-agents restent incompatibles** avec l'histoire réécrite à midi.
  - signal : un `git pull` qui rapporte des centaines de commits divergents.
  - parade : A-6 (recloner, jamais fusionner).

## 8. Prochaines actions

Ordre de traitement : d'abord ce qui rend jugeable ce que les forges ont mesuré (les classes), parce que trois constats en prose ne se comptent pas ; puis les lots à déposer et le sceau (l'empreinte qui scelle une vue dérivée) à instruire ; les restes humains ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-41 | `neuve` | Si D-17 (a) : créer les trois classes dans `todo\CLASSES.json` et journaliser les trois constats en candidats contre leur forge. | `auto_ia` | `dependance_bloc_3` — D-17. | Trois récidives futures que rien ne comptera. |
| A-42 | TF-0819, TF-0820, TF-0821 | Si D-18 (a) : règle T6 de `gabarits\oracle-travaux-pilot.mjs` (tout module producteur nommé existe et produit l'artefact cité) ; un lot à forge-development (deux mentions corrigées, candidature C5) ; un lot à forge-agents (banc de la fonction qui lit la version précédente). | `auto_ia` | `dependance_bloc_3` — D-18. | Le pilot reproduit son défaut ; le nom reste public ; le gate (la porte qui juge un fichier avant d'en autoriser l'écriture) garde une moitié non éprouvée. |
| A-43 | TF-0813 | Si D-16 (a) : `git branch -D sauvegarde/20260809` chez forge-development, rejouer la porte sur le clone entier (attendu PASS). | `auto_ia` | `dependance_bloc_3` — D-16 ; R-29. | La mesure de parc reste à 12 sur 13. |
| A-44 | TF-0818 | Ouvrir une session chez forge-conception sur le lot `pilot - TRAVAUX - 20260905e.md` (agent mandaté, porte verte avant push), puis remettre le lot de retours au pilot. | `auto_ia` | `hors_mandat` — A-40 disait « déposer » ; ouvrir une session chez un dépôt frère exige un mandat. | Une vue peut perdre une décision opposable sans qu'un oracle le voie. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot ; recloner forge-agents (histoire réécrite). | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | Une fusion depuis l'autre poste réintroduit l'ancienne histoire. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run). | `auto_ia` | `garde_fou` — session vivante ce matin ; à vérifier à la reprise. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : quatre fichiers non commis. | Un nettoyage efface les chemins d'échec prouvés. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Forge-agents : `f8d81d8` publié (`0dc0b2a..f8d81d8`) ; branches `master` et `sauvegarde/20260809` supprimées ; porte PASS sur le clone entier ; lot 20260905c marqué traité.
- Forge-conception : `be41b25` publié (`d6ab8ff..be41b25`) ; lot 20260905d marqué traité ; lot `input\00-travaux\pilot - TRAVAUX - 20260905e.md` + sidecar déposés, non traités.
- Forge-development : paquet `c:\dev\_sauvegardes\digit-ai-forge-development-avant-filter-repo-20260905.bundle` (+ `…-HEAD.txt`) ; dépôt publié inchangé (`00097b6`, mêmes étiquettes) ; clone local sur `origin/main`, branche `sauvegarde/20260809` conservée (D-16).
- Comptes rendus : `input\00-retours\digit-ai-forge-agents - RETOURS - 20260905b.md` · `…forge-conception - RETOURS - 20260905c.md` (et sidecars), PASS, ingérés.
- Pilot : `todo\TODO.jsonl` — TF-0813, TF-0814, TF-0815, TF-0816 clos ; TF-0818 décidé ; TF-0819, TF-0820, TF-0821 candidats ; `todo\CLASSES.json` (34 classes) ; `references\TODO-FORGE.md` (leçon de mesure) ; `output\06-travaux-confies\` (lot e) ; vues `todo\TODO.md` et `todo\AVANCEMENT.md` ; cette synthèse — le tout dans le commit qui suit `421cc79`.
- Poste : `oracle-skills --appliquer` puis PASS ; hook installé identique à `f8d81d8`.
- Oracles rejoués : `oracle-nom-client-publie` (forge-agents clone entier PASS ; forge-development `main` seule PASS, clone entier FAIL 89 ; clone réécrit PASS) · `gabarits\oracle-lot-retours.mjs` ×2 (PASS) · `oracle-travaux-pilot` (PASS) · `oracle-todo` (PASS) · `readme-dossiers --check` (PASS).
- Mémoire du poste : note de reconstruction complétée (branche protégée, mesure sur clone à branche unique).
