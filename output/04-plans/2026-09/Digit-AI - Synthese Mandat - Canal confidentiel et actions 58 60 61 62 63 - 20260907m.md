---
destinataire: humain
---

# Synthèse de mandat — le canal confidentiel existe et les tables y vivent, la forge des outils est réécrite et publiée, huit classes et un tri de quarante candidatures proposé (07/09/2026)

Votre décision et vos cinq actions sont exécutées, à une nuance près sur l'une d'elles. Le dépôt privé existe, il porte les deux tables de pseudonymisation et une boîte pour les informations confidentielles que les produits et les forges remettent à la factory ; le bootstrap le tire, le clone s'il manque, le juge par son oracle, et tous les modules du pilot y lisent les tables par un seul résolveur. La forge des outils a corrigé la frontière de sa porte et retiré cinq mentions réelles, son histoire est réécrite avec les tables du canal et publiée en force avec son contrat de sortie. Cinq branches locales anciennes sont supprimées, huit classes créées et sept constats entrés au registre, un constat rattaché à sa vraie classe. La forge de développement a été réécrite et publiée par l'autre poste pendant ce tour — c'est l'action que vous m'aviez donnée aussi — mais avec ses tables d'avant le canal : un message y garde la forme courte. Le tri des candidatures est proposé ci-dessous, en un bloc par émetteur, les quatre constats de sécurité d'un produit en tête. Ce qui change pour vous : les deux postes auront une seule source pour ce qui ne doit jamais être publié, et le parc est vert sauf ce message. Ce qui est attendu de vous : trois décisions, dont le tri.

## 1. En-tête d'identification

- **quoi** — mandat humain « 28a : … crée un dépôt privé… » puis « Puis traite 1-65, 63, 58, 62, 60, 61 » : D-28 (a) élargie (A-64, A-65), puis A-63, A-58, A-62, A-60, A-61.
- **sur quoi** — un dépôt privé neuf `digit-ai-confidentiel` cloné hors des dépôts publiés ; le pilot (résolveur, fusion, bootstrap, mode opératoire, registre, classes) ; forge-agents (lot instruit, histoire réécrite, publiée) ; forge-development (rebâtie sur ce que l'autre poste a publié) ; cinq forges (branches locales) ; le poste (deux variables d'environnement, copies installées).
- **quand** — fin le **07/09/2026 à 23:45 (UTC+02:00)**, ≈ 2 h 15 depuis votre première réponse, dont 55 minutes de travail de l'agent chez la forge des outils.
- **qui** — Claude Fable 5.1 (extension VS Code) et un agent subordonné ; pilot `6e35592` avant, publié en `1bd9d32` puis `5014e9f`, cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

A-64 et A-65 **faits** (dépôt privé `a2c8dc4` → `76de5fe`, tables déplacées, résolveur, fusion 3/3, bootstrap étape 4 ter, oracle du canal 5/5, TF-0878 clos) ; A-58 **fait** (forge-agents : C5 (la règle sur les noms de produits) bornée, recette 221 → 224, cinq mentions retirées, histoire réécrite 114 commits, forme courte 5 → 0 commits, `db3d391 → 0e0c223` en force, porte PASS ; TF-0855 et TF-0880 clos) ; A-62 **fait** (cinq branches supprimées, cinq portes PASS) ; A-60 **fait** (huit classes, TF-0880 à TF-0886, TF-0848 rectifié) ; A-63 **fait par l'autre poste** (forge-development `4d81314`, un message rouge restant) ; A-61 **proposé** (D-30) ; parc : pilot et 12 forges PASS, forge-development FAIL 1 message ; deux candidatures neuves (TF-0879, TF-0887).

## 3. Décisions attendues

Trois décisions : la forge de développement à refaire avec les tables du canal, le hameçon de publication que le canal a cassé chez qui l'a posé, et le tri de quarante candidatures. Chaque décision porte le même tableau de trois lignes, à lire ligne par ligne : la colonne « Option » nomme le choix, « Ce qu'elle coûte » sa complexité et sa durée, « Ce qu'elle exclut » ce à quoi l'on renonce ; les lignes vont de l'option recommandée à l'inaction.

> **D-29 — Refait-on la réécriture de la forge de développement avec les tables du canal, alors que l'autre poste vient de la réécrire et de la publier avec ses tables d'avant l'alias, et que sa branche protégée exige de lever la protection une seconde fois ?**
> Pendant ce tour, l'autre poste a exécuté votre décision de la veille sur la forge de développement : protection levée puis remise à l'identique, histoire réécrite sur clone frais, publiée en force, commit du jour rejoué. Ce poste a rebâti son clone dessus. Mais l'autre poste n'avait pas l'alias de la forme courte — il vit dans ses tables libres, pas dans le canal qu'il n'a pas encore cloné — et la porte jouée ici, avec les tables du canal, rend encore un constat : un message de commit ancien porte la forme courte. Tout le reste du parc est vert. Refaire la passe coûte une levée de protection de plus et un push forcé de plus ; ne pas la refaire laisse un nom public dans un message.
> **Recommandation : (a).** Source consultée : la synthèse 20260907l de l'autre poste (A-39 puis A-37 exécutées, protection remise) ; la porte jouée ce soir sur le clone rebâti (FAIL 1, message, commit `df0223e`) ; les tables du canal (alias présent) ; `gh api …/branches/main/protection` (push forcé interdit de nouveau).
> Une réécriture de plus, avec la bonne table, ferme le dernier constat du parc ; l'attendre du prochain nom découvert reviendrait au même geste plus tard.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** après que l'autre poste a cloné le canal et fusionné ses tables (sa prochaine ouverture), une passe de plus sur forge-development avec les tables du canal : vous levez la protection, un poste réécrit et publie, vous la remettez | simple × court : deux clics avant, une passe, deux clics après | exclut de laisser le parc à 13 sur 14 |
| **(b)** la même passe, lancée depuis ce poste sans attendre l'autre (les tables du canal suffisent) | simple × court | exclut de vérifier d'abord que les tables des deux postes sont fusionnées |
| **(c)** ne rien faire | gratuit | exclut tout effet ; un message public garde la forme courte |

> **Si rien n'est décidé** : (c) s'applique — la forge de développement reste le seul dépôt rouge du parc.

> **D-30 — Comment trie-t-on les quarante candidatures entrées depuis le 06/09 (un produit qui a clos un run entier, deux produits remis à niveau, trois produits anciens, les forges), dont quatre disent qu'un produit a versionné une clé d'API et servi des identifiants sur une page publique ?**
> Le registre porte quarante candidatures sans rang, entrées en deux jours : dix-sept d'un produit qui a clos un run jusqu'à une mise en production de qualification, dont quatre touchent la sécurité — une clé d'API saisie dans un fichier d'exemple versionné parce qu'aucun fichier local n'était créé d'office, une clé d'organisation qui échoue faute d'espace de travail, une convention de démonstration qui a mis des identifiants sur une page servie sur Internet, une étape de mise en production qui ne prescrit ni comptes d'essai vides ni source des identifiants ; treize constats sur le canal des lots et le relevé d'héritage du pilot (recopie non commise, alias périmé, motif couvert, lot écrasable, boîte d'entrée) ; sept pour la forge de tests, dont une recette cassée par la pseudonymisation ; sept pour la forge de design ; cinq pour la forge de conception, dont un point d'entrée rouge sur toute cible ; deux pour la forge d'exploitation, un pour l'organisation, un pour la forge des outils, un pour la forge de développement, deux pour le pilot lui-même. Un tri fin item par item serait un tour entier ; un tri par émetteur, avec un rang par groupe, tient en une décision.
> **Recommandation : (a).** Source consultée : `todo\TODO.md` (TF-0830 à TF-0887, demandeur, classe, score) ; les six lots de retours des 06 et 07/09 ; `todo\AVANCEMENT.md` (55 ouverts).
> Les quatre constats de sécurité passent avant tout, parce qu'une clé versionnée et des identifiants publics coûtent chaque heure ; le reste se confie par lot à sa forge, et le pilot instruit les siens dans l'ordre où ils ont fait mal ce week-end.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider en bloc, par émetteur, dans cet ordre : (1) sécurité du produit 61 au pilot et à la forge de conception (TF-0869, TF-0871, TF-0870, TF-0872, TF-0874) ; (2) canal des lots et héritage au pilot (TF-0884, TF-0848, TF-0851, TF-0881, TF-0883, TF-0882, TF-0849, TF-0850, TF-0852, TF-0853, TF-0836, TF-0838, TF-0873) ; (3) forge-tests (TF-0866, TF-0839, TF-0840, TF-0876, TF-0841, TF-0842, TF-0843) ; (4) forge-design (TF-0846, TF-0875, TF-0830, TF-0833, TF-0834, TF-0835, TF-0847) ; (5) forge-conception (TF-0885, TF-0831, TF-0832, TF-0854) ; (6) forge-ops (TF-0844, TF-0845), forge-organization (TF-0837), forge-agents (TF-0887), forge-development (TF-0886), pilot (TF-0857, TF-0879) — un lot par forge, le pilot instruit les siens | moyen × moyen : six lots à déposer, treize items au pilot | exclut un tri fin item par item |
| **(b)** décider seulement le groupe (1) et le groupe (2) | simple × court | exclut les forges ; une recette cassée et un point d'entrée rouge attendent |
| **(c)** ne rien décider | gratuit | exclut toute instruction ; quarante candidatures sans rang |

> **Si rien n'est décidé** : (c) s'applique — une clé versionnée et des identifiants publics restent des candidatures.

> **D-31 — Corrige-t-on à la source, chez la forge des outils, la porte qui ne connaît pas le canal dans ses pistes par défaut et le hameçon qui l'appelle sans chemin, alors que le canal vient de rendre muette toute porte appelée sans argument ?**
> En déplaçant les tables au canal, ce tour a retiré ce que la porte cherchait par défaut : sans `--referentiel` ni `--produits`, elle rend SKIP, et le hameçon de publication — le crochet posé avant chaque push — traite SKIP en refus, à juste titre. Sur ce poste, aucun clone ne porte le hameçon, et les deux variables d'environnement que la porte lit en premier sont posées vers le canal ; mais l'autre poste et tout nouveau clone où le hameçon est posé refuseront chaque push jusqu'à ce que la porte connaisse le canal. La forge des outils l'a mesuré et remonté ce soir, sans classe ; la classe existe maintenant, et le remède tient en deux lignes de pistes par défaut.
> **Recommandation : (a).** Source consultée : le lot de retours de la forge des outils du soir (`…forge-agents - RETOURS - 20260907a.md`, constat RC-1 (le constat sur le hameçon)) ; les pistes par défaut de la porte lues dans sa source (fichiers libres à la racine, jamais le canal) ; `todo\TODO.md` (TF-0887).
> Un remède posé au poste par variable d'environnement est une béquille ; la porte doit savoir seule où vivent ses tables.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** un lot à forge-agents : pistes par défaut de la porte étendues au canal, hameçon qui passe les chemins ou les variables, fixture double sens, puis publication | simple × court | exclut de s'en remettre aux variables de poste |
| **(b)** les variables d'environnement sur chaque poste, documentées au canal (déjà fait ici), sans toucher la porte | gratuit | exclut tout nouveau clone sans les variables ; un hameçon posé y refuse tout push |
| **(c)** ne rien faire | gratuit | exclut tout effet ; une porte appelée sans argument reste muette |

> **Si rien n'est décidé** : (b) s'applique de fait — ce poste a ses variables, l'autre les posera à la lecture du canal.

## 4. Traité — avec sa preuve

- **D-28 (a), A-64 et A-65 — le canal confidentiel** — classe : deux tables libres sur deux postes sans lien ; contrôle rouge → vert : « aucun dépôt ne porte les tables » → dépôt privé vérifié PRIVATE chez l'hébergeur, `oracle-confidentiel` 5 règles PASS (privé, tables valides à 3 clients et 61 produits, aucun secret, entrants en forme, un pseudonyme par produit) ; `bootstrap` (mesure) : « canal présent, à jour, oracle PASS », aucun dépôt suspect au balayage. Les deux tables sont déplacées dans `tables\`, les anciens fichiers libres renommés (jamais supprimés) ; `scripts\lib-confidentiel.mjs` est le seul résolveur (variables, canal, sinon ancien fichier en le disant), lu par l'anonymiseur d'entrants (et par lui les fichiers suivis et l'ingestion), le générateur de règles, l'émission de lots, la reconstruction de clone ; `scripts\fusionner-tables-confidentielles.mjs` fait entrer les tables libres d'un poste au canal en deux passes, rien d'écrit tant qu'un conflit existe ; la boîte `entrants\` porte son en-tête obligatoire en cinq lignes dont « ce qu'il faut en faire » ; le mode opératoire et la mémoire du poste disent le canal.
  - preuve : `https://github.com/iguane39/digit-ai-confidentiel` (`a2c8dc4`, `76de5fe`) ; `cheminsTables()` → `origine: canal` ; bancs : anonymiseur 6/6, fichiers suivis 7/7, émission 31/31, fusion 3/3 (rouge : un conflit → rien d'écrit ni renommé, même la table sans conflit ; vert : 3 ajouts, 2 anciens renommés), bootstrap 14/14 ; TF-0878 décidé et clos (PASS).
- **A-58 — TF-0855 et TF-0880 clos chez forge-agents, histoire réécrite et publiée** (D-24 (a)) — classe : une porte qui cherche une clé courte sans frontière, et cinq mentions réelles dans l'arbre courant ; contrôle rouge → vert : trois cas de recette contre l'oracle d'avant, deux rouges (blob, clé collée) ; après, verts ; porte sur la forge 8 constats → 0 ; recette 221 → 224. Puis la passe du pilot : paquet vérifié, clone frais, règles des deux tables du canal (37), 114 commits, arbre identique, forme courte présente dans 5 commits → 0, `origin/main` vérifié inchangé avant le push forcé, `db3d391 → 0e0c223`, 19 étiquettes, clone local rebâti ; le clone réécrit rougissait d'abord sur trois blobs parce que la copie installée de la porte était l'ancienne — réalignée, il passe.
  - preuve : commits `32cd320`, `0de710c` (réécrits en `f7f8d01`, `0e0c223`) ; lot `…forge-agents - RETOURS - 20260907a.md` PASS, sidecar vide (constat RC-1 — le hameçon — en prose → TF-0887) ; porte C1 (la première des quatre règles sur les noms de clients) à C5 PASS sur le clone réécrit et sur le clone local ; deux clôtures (PASS).
- **A-62 — cinq branches locales anciennes supprimées** (conception, design, organization, seo-geo, tests) — contrôle rouge → vert : porte sur le clone entier de seo-geo FAIL 8 → PASS ; les quatre autres PASS avant comme après.
  - preuve : cinq lignes `Deleted branch sauvegarde/20260809` ; les paquets de sauvegarde du 06/09 les portent.
- **A-60 — huit classes et les constats qu'elles attendaient** (D-26 (a)) — `porte-cle-courte-sans-frontiere`, `alias-de-transition-perime-survivant`, `motif-exclusion-couvert-compte-absent`, `boite-entree-produit-statut-git-non-dit`, `lot-remis-ecrasable`, `releve-heritage-juge-arbre-pas-histoire`, `point-entree-declare-rouge-sur-toute-cible`, `regle-de-branche-annoncee-differente-configuree` ; sept constats entrent (TF-0880 à TF-0886), le constat déjà ingéré du produit 02 est rattaché à sa vraie classe par rectification ; une neuvième classe le soir, `porte-sans-chemin-des-tables`, pour le hameçon (TF-0887).
  - preuve : `todo\CLASSES.json` 37 → 46 (version 1.3.1) ; dix puis un événements journalisés (PASS) ; `oracle-todo` PASS.
- **A-63 — forge-development** — *fait par l'autre poste pendant ce tour* (sa synthèse 20260907l, 21:47 : protection levée puis remise à l'identique, `053fdaf → 181de0e` en force, commit du jour rejoué `4d81314`) ; ce poste a rebâti son clone dessus ; avec les tables du canal, un message garde la forme courte — D-29.
  - preuve : `git merge-base` DIVERGENT puis `reset --hard origin/main` → `4d81314`, branches `main` seule ; porte FAIL 1 (message, `df0223e`).
- **A-61 — le tri** — proposé en D-30 : quarante candidatures groupées par émetteur, la sécurité du produit 61 en tête.
  - preuve : `todo\TODO.md` (106 actifs, 55 ouverts) ; les quarante listées avec demandeur, classe et score.
- **Le poste** — classe : une porte appelée sans chemin de tables (`porte-sans-chemin-des-tables`) et une copie installée en retard sur sa source ; contrôle rouge → vert : la porte appelée sans argument rend SKIP, elle rend PASS avec les deux variables du poste posées vers le canal ; la copie installée de la porte accusait trois blobs sur le clone réécrit, réalignée sur la source corrigée elle rend PASS.
  - preuve : `setx` ×2 (`FORGE_NOMS_INTERDITS`, `FORGE_PRODUITS_PSEUDO`) ; `oracle-skills --appliquer` puis PASS ; porte sur le clone réécrit FAIL 3 → PASS ; le LISEZMOI du canal porte la consigne pour l'autre poste.
- **Mesure du parc** avec la porte réalignée et les tables du canal — contrôle rouge → vert : neuf forges rouges hier soir → une (forge-development, un message) ; pilot et douze forges PASS.
  - preuve : quatorze verdicts relevés dépôt par dépôt, un seul constat C5 dans tout le parc (`df0223e`).
- **Publication du pilot** en avance rapide, deux fois (`1bd9d32`, `5014e9f`), après un rebase sur une publication de l'autre poste (deux séries d'événements du registre gardées).

## 5. Non traité — avec son motif

- **La seconde passe sur forge-development** : *dépendance à une décision humaine* — D-29, et sa protection est de nouveau en place.
- **Le lot du hameçon chez forge-agents** : *dépendance à une décision humaine* — D-31 ; la béquille des variables tient sur ce poste.
- **Le tri item par item** : *borne atteinte* — D-30 propose le tri par émetteur ; les lots se déposent au tour suivant.
- **La fusion des tables de l'autre poste** : *accès* — le script existe et est prouvé ; il se joue là-bas, après clone du canal (le bootstrap le clone au prochain `--pull`).
- **La recette `rebatir-clone.test.mjs` rouge sur ce poste** : *préexistant et hors mandat* — mesuré rouge sur la version committée aussi ; candidature TF-0879 (le message tronque la valeur attendue).
- **Les quatre dépôts d'insatisfaction du produit 61** : *hors demande* — toujours non suivis, leur canal est l'instruction.
- **A-25 et A-19 (produit 02), A-6 (l'autre poste), A-17 (D-7)** : *inchangés* — A-6 s'enrichit : cloner le canal, fusionner les tables, poser les deux variables.

## 6. Écarts à la lettre

- « 1-65 » → lu comme A-64 et A-65 (créer le dépôt privé, le faire tirer et lire) → parce que D-28 (a) venait d'être choisie et que ces deux actions en dépendaient ; les deux sont faites.
- « Traite 63 » → non refait ici → parce que l'autre poste l'a exécuté pendant ce tour (21:47) ; refaire la passe sans ses tables aurait produit une troisième lignée ; le reste (un message) devient D-29.
- « Traite 58 » disait « publier `9454701` » → publié dans une histoire réécrite (`0f2777b`) → parce que D-24 (a) prescrivait la réécriture avant la publication, et que la réécriture change les empreintes.
- Le déplacement des tables a rendu muette la porte appelée sans argument → mesuré par la forge, corrigé sur ce poste par deux variables, remonté en D-31 → parce que le canal a été posé avant que la porte le connaisse ; l'ordre inverse aurait demandé un lot à forge-agents avant de pouvoir créer le canal.
- La porte installée sur ce poste était l'ancienne au moment de juger le clone réécrit → trois faux positifs, disparus après réalignement → parce que la correction de la forge n'était pas encore publiée quand le pilot a jugé ; le réalignement précède désormais toute mesure.
- Le journal du registre a été rebasé une fois sur une publication de l'autre poste (deux séries d'événements en fin de fichier) → union gardée, aucune perte, identifiants vérifiés sans collision.

## 7. Risques

- **Les tables de l'autre poste ne sont pas encore au canal** : tout ce qu'il pseudonymise d'ici son prochain `--pull` s'écrit dans ses fichiers libres.
  - signal : un pseudonyme employé là-bas absent du canal, ou une fusion qui rend un conflit.
  - parade : A-6 (bootstrap `--pull` clone le canal, puis le script de fusion) ; le script refuse d'écrire sur conflit.
- **Un hameçon posé sur un clone sans variables refuse tout push** tant que D-31 n'est pas tranchée.
  - signal : « SKIP » de la porte en tête d'un push refusé.
  - parade : D-31 (a) ; en attendant, les deux variables (LISEZMOI du canal).
- **Un message de commit public garde la forme courte** sur la forge de développement.
  - signal : la porte FAIL 1 à chaque mesure du parc.
  - parade : D-29.
- **Quatre constats de sécurité d'un produit attendent un rang** (clé versionnée, identifiants publics).
  - signal : la clé encore dans le fichier d'exemple, la page encore servie.
  - parade : D-30 (a), groupe 1 en premier.

## 8. Prochaines actions

Ordre de traitement : d'abord ce que l'autre poste doit faire à son ouverture (le canal), puis la sécurité du produit 61, puis les lots par forge. Le tableau se lit ligne par ligne : la colonne « Identifiant » renvoie à l'item du registre, « Action » dit le geste, « Acteur » qui le fait, « Motif / raison » pourquoi il n'est pas déjà fait, et la dernière colonne ce qui se passe s'il ne l'est pas.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-6 | TF-0878 | Sur l'autre poste, à l'ouverture : `git pull --ff-only` dans le pilot, `node bootstrap.mjs --pull` (clone le canal en `<racine>\_confidentiel\`), `node scripts\fusionner-tables-confidentielles.mjs --essai` puis sans `--essai`, commit et push du canal, `setx` des deux variables (LISEZMOI du canal) ; puis `--rebatir` pour tout dépôt divergé. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la forge de développement réécrite là-bas sans l'alias (porte FAIL 1 ici). | Les tables divergent au premier produit nouveau ; tout hameçon posé là-bas refuse les pushs. |
| A-66 | TF-0869, TF-0871 | Si D-30 (a) : instruire d'abord les deux constats de sécurité du produit 61 (fichier local créé d'office, aucun identifiant sur une page publique) — un lot au pilot, un à forge-conception pour la convention de démonstration. | `auto_ia` | `dependance_bloc_3` — D-30. | Une clé versionnée et des identifiants publics restent des candidatures. |
| A-67 | TF-0830 à TF-0887 | Si D-30 (a) : déposer les six lots par forge (tests, design, conception, ops, organization, agents, development) et instruire les treize items du pilot dans l'ordre du groupe (2). | `auto_ia` | `dependance_bloc_3` — D-30. | Quarante candidatures sans rang. |
| A-68 | TF-0887 | Si D-31 (a) : déposer et instruire le lot du hameçon chez forge-agents (pistes par défaut au canal, chemins passés par le hameçon, fixture), publier. | `auto_ia` | `dependance_bloc_3` — D-31. | Un hameçon posé refuse tout push sans variables. |
| A-69 | TF-0829 | Si D-29 (a) ou (b) : après votre levée de protection, une passe sur forge-development avec les tables du canal, publication forcée, clone rebâti, vous rendre la main pour remettre la protection. | `auto_ia` | `dependance_bloc_3` — D-29 ; R-38 pour le push forcé. | Le parc reste à 13 sur 14. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run). | `auto_ia` | `garde_fou` — session du produit vivante hier. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur. | Un nettoyage efface les chemins d'échec prouvés. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Canal : `https://github.com/iguane39/digit-ai-confidentiel` (privé), commits `a2c8dc4`, `76de5fe` ; clone `c:\dev\_confidentiel\` ; anciens fichiers libres renommés `c:\dev\_*.fusionne-2026-09-07.json`.
- Pilot : `scripts\lib-confidentiel.mjs`, `scripts\fusionner-tables-confidentielles.mjs` (+ recette), `bootstrap.mjs` (étape 4 ter, balayage), `scripts\generer-remplacements-historique.mjs`, `todo\anonymiser-entrant.mjs`, `todo\emettre-travaux.mjs`, `scripts\rebatir-clone.mjs`, `references\TODO-FORGE.md` ; `todo\CLASSES.json` 1.3.1 (46 classes) ; `todo\TODO.jsonl` — TF-0878, TF-0855, TF-0880 clos ; TF-0879, TF-0881 à TF-0887 candidats ; TF-0848 rectifié ; commits `1bd9d32`, `5014e9f`, puis celui de cette synthèse.
- Forge-agents : `0e0c223` publié en force (histoire réécrite, 19 étiquettes), paquet `c:\dev\_sauvegardes\digit-ai-forge-agents-avant-filter-repo-20260907.bundle` ; lot 20260907a marqué traité ; lot de retours `…forge-agents - RETOURS - 20260907a.md` PASS, ingéré (sidecar vide).
- Forge-development : clone rebâti sur `4d81314` (publié par l'autre poste) ; porte FAIL 1 (message).
- Branches locales supprimées : conception, design, organization, seo-geo, tests.
- Poste : `setx FORGE_NOMS_INTERDITS` / `FORGE_PRODUITS_PSEUDO` → canal ; `oracle-skills --appliquer` PASS.
- Oracles rejoués : `oracle-confidentiel` 5/5 · `bootstrap` (mesure) · `oracle-nom-client-publie` sur les 14 clones (13 PASS) · `gabarits\oracle-travaux-pilot.mjs` (lot 20260907a PASS) · `gabarits\oracle-lot-retours.mjs` (PASS) · `oracle-todo` PASS · `oracles\self-tests.mjs` 95/96 (`rebatir-clone.test.mjs` rouge, préexistant) · `readme-dossiers --check` PASS.
- Mémoire du poste : note complétée (canal, variables, forge-agents publiée, forge-development sans alias).
