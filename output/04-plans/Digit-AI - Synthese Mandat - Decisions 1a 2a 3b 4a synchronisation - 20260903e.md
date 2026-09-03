---
destinataire: humain
---

# Synthèse de mandat — exécution des décisions 1a, 2a, 3b et 4a de la synchronisation (03/09/2026)

Vos quatre décisions sont exécutées et publiées. La branche de sauvegarde qui gardait la porte de publication rouge sur ce poste a été retirée, et la porte est verte sur le clone entier. Les quarante-deux versions du pilot désignent de nouveau des points de la branche publiée, et GitHub les porte. Le noyau cite un index des références, et le contrôle du noyau, qui restait rouge sur sept documents depuis avant ce mandat, est vert. Les cinq lots de retours en attente sont entrés au registre sous pseudonyme : dix candidatures nouvelles vous attendent. Ce qui change pour vous : le poste est publiable sans réserve, et rien de ce qui a été fait n'a réécrit d'histoire. Ce qui est attendu de vous : le tri des dix candidatures, présenté ici en une seule décision.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-1 (a), D-2 (a), D-3 (b) et D-4 (a) prises sur la synthèse de synchronisation du 03/09 ; suppression, ré-étiquetage, index et oracle, ingestion.
- **sur quoi** — le pilot `digit-ai-factory` seul ; aucun dépôt frère ni produit n'a été modifié ; deux produits ont été lus pour juger l'héritage de leurs lots.
- **quand** — fin le **03/09/2026 à 21:12 (UTC+02:00)**, durée depuis vos réponses ≈ 25 minutes.
- **qui** — Claude Fable 5.1 (extension VS Code), pilot en version `b399e5f` après publication, base `19e58f3` avant.

## 2. Verdict en une ligne

Quatre décisions sur quatre exécutées : porte de publication **PASS** sur le clone entier, 42/42 étiquettes reposées et publiées, `oracle-claude-md` **PASS** (9/9 au self-test), 10 candidatures ingérées (registre PASS, boîte d'entrée PASS), banc 92/93 (défaut préexistant), commit `b399e5f` poussé.

## 3. Décisions attendues

Une seule décision ce tour, et elle découle de la quatrième de ce matin : les lots sont entrés, et le registre n'avance jamais sans vous — tout ce qui entre est candidat jusqu'à votre tri.

> **D-5 — Comment trie-t-on les dix candidatures nées de l'ingestion des cinq lots, dont six visent le pilot lui-même ?**
> Les dix candidatures viennent de deux produits. Six concernent le pilot : une déclaration de racine web que personne ne lit, un remède prescrit qui ne solde pas son défaut et un ledger qui collisionne à l'écriture concurrente, un contrôle qui rend vert des sorties jamais exercées, une clé de versions malformée sans voie de rectification, et une page 404 à ériger en standard pour tout site produit. Trois visent la forge de design (habillage complet d'un composant généré, sémantique des déclencheurs, bascule déclarée morte à tort), une la forge de développement (adresses de fichiers statiques versionnées) et une la forge de conception (frontières Unicode dans les gardes lexicales). Le registre les tient toutes en candidat, avec leur preuve du coût quand le lot en donnait une.
> **Recommandation : (a).** Source consultée : `todo\TODO.md` (les dix candidatures TF-0793 à TF-0802, leur forge cible et leur source) et `references\TODO-FORGE.md` (tout entre en candidat, décision humaine, clôture sur gains constatés).
> Les six candidatures pilot portent chacune une preuve du coût mesurée par le produit ; les trois de la forge de design décrivent des défauts vus sur un rendu réel ; rien ne justifie de les écarter, et les décider en bloc épargne dix aller-retours.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** décider les dix en bloc, ordre de traitement : pilot d'abord (six), puis design (trois), puis développement et conception | simple × court pour la décision ; les chantiers eux-mêmes se mesurent ensuite, un par un, complexité moyenne pour la plupart | exclut un tri fin dès maintenant ; une candidature jugée sans intérêt à l'instruction sera écartée avec son motif |
| **(b)** décider seulement les six candidatures pilot, laisser les quatre de forges en candidat jusqu'à un mandat chez elles | simple × court ; quatre candidatures restent visibles au registre sans porteur | exclut que les forges reçoivent leur descente avant un prochain mandat qui les concerne |
| **(c)** ne rien décider ce tour | gratuit | exclut toute instruction : les dix restent candidates et la garde d'ouverture les compte à chaque session |

> **Si rien n'est décidé** : (c) s'applique — les dix restent candidates, rien ne se dégrade, le registre les affiche en tête des actifs.

## 4. Traité — avec sa preuve

- **D-1 (a) — la branche de sauvegarde du 30/08 supprimée** du clone, après nouvelle vérification de son paquet.
  - preuve : `git bundle verify` : « is okay » ; `git branch -D` : « Deleted branch (was 8caf46d) » ; branches restantes : `main` seule.
- **La porte de publication verte sur le clone entier**, branches et étiquettes comprises, et non plus seulement sur la branche publiée.
  - preuve : `oracle-nom-client-publie` sur le dépôt : verdict PASS, 1 constat d'information, 0 bloquant ; rejoué après le commit sur un clone à branche unique : PASS.
- **D-2 (a) — les quarante-deux étiquettes reposées** sur la branche publiée par correspondance de sujet et de date d'auteur, sans ambiguïté, les étiquettes annotées reconstituées avec leur message et leur date d'origine.
  - preuve : 42 correspondances « OK », 0 ambiguë, 0 absente ; 0 étiquette hors de la branche publiée après repose ; `git push --tags --force` : 42 mises à jour ; la 1.17.30 distante et locale à `02b0d41`.
- **D-3 (b) — l'index des références** écrit, une ligne par document, et cité par le noyau en une ligne ; le noyau ramené sous son plafond.
  - preuve : `references\INDEX.md`, 17 entrées ; noyau 6 138 octets ≤ 6 144 (règle N1).
- **Le contrôle du noyau étendu à la citation transitive** : un document cité par un document que le noyau cite est atteint ; une entrée d'index vers un fichier absent tombe sous N2 (une référence citée doit exister sur disque) ; un index que le noyau ne cite pas reste orphelin avec ce qu'il cite.
  - preuve : `oracles\oracle-claude-md.mjs` v1.2.0, self-test 9/9 (trois cas neufs, double sens) ; verdict sur le dépôt PASS, N3 (chaque référence est citée depuis le noyau) « aucune référence orpheline » ; cliquet des recettes 6 → 9 consigné dans `oracles\baseline-recettes.json`.
- **Une citation cassée trouvée par la lecture transitive et traitée** : le chemin d'un fichier d'un skill (`skills\…\references\…`) était lu comme une référence du pilot ; la règle ne lit plus qu'une citation en tête de chemin.
  - preuve : verdict N2 FAIL sur `critique-implementation.md` avant, PASS après ; self-test toujours 9/9.
- **D-4 (a) — les cinq lots ingérés**, dix candidatures créées, tout en candidat.
  - preuve : `ingerer-lot.mjs` : « 3 + 3 + 2 + 1 + 1 candidature(s) ingérée(s) en CANDIDAT » ; identifiants TF-0793 à TF-0802 ; `oracle-todo` PASS ; vues régénérées, 21 actifs.
- **Deux formes de sidecar refusées au premier passage, corrigées sans toucher au contenu** — classe : la forme de l'entrant (encodage, schéma), jamais son contenu ; contrôle : ingestion REFUS → PASS sur les quatre lots concernés. Trois sidecars portaient une marque d'ordre des octets en tête (refus « JSON invalide ligne 1 »), un sidecar était en forme produit sans champ source (passé par le normalisateur).
  - preuve : trois marques retirées, trois ingestions REFUS → PASS ; `normaliser-lot.mjs` : « 1 candidature(s) normalisée(s) », ingestion du dérivé REFUS → PASS.
- **Les lots pseudonymisés avant d'être suivis** : nom de fichier et contenu, plus deux synthèses du 01/09 qui portaient encore un chemin réel de produit.
  - preuve : `anonymiser-suivis.mjs` : 11 fichiers renommés ou réécrits, 6 ré-empreintes consignées au registre ; `oracle-boite-entree` PASS ; 0 nom réel dans l'index git au commit.
- **Publication** en avance rapide.
  - preuve : `git push` → `19e58f3..b399e5f main -> main`, 25 fichiers ; banc `oracles\self-tests.mjs` 92/93.
- **Mémoire du poste mise à jour** : branche retirée, étiquettes reposées, lots ingérés, piège de la marque d'ordre des octets.
  - preuve : fichier de mémoire réécrit (voir traces).

## 5. Non traité — avec son motif

- **Le remède de l'oracle des skills** (règle K2 (les empreintes des skills installés sur le poste sont relevées à l'ouverture)) : *hors mandat* — vos réponses ne le sélectionnaient pas ; c'est le seul défaut du banc, et il préexistait.
- **Les dix candidatures** : *tout entre en candidat* — décision D-5.
- **Le déplacement des lots ingérés vers le sous-dossier des lots archivés** : *écarté* — les lots ingérés le même jour par l'autre session sont restés à la racine, et l'oracle de boîte d'entrée rend PASS sur cet état ; suivre le voisin plutôt que déplacer seul. Critère de réouverture : un constat de l'oracle de boîte d'entrée sur un lot ingéré resté à la racine.
- **L'héritage non tenu chez les deux produits** (un fichier absent, trois périmés, signalés à chaque ingestion par le contrôle R-47 (l'héritage du pilot est jugé chez le produit à chaque lot ingéré)) : *chez le produit* — le pilot n'écrit pas chez un produit ; la remise à niveau tient en une commande jouée depuis le produit, nommée au bloc 8.
- **La seconde copie du pilot, le fichier « null » et le lien brisé** à la racine du parc : *geste humain* — inchangé depuis ce matin.

## 6. Écarts à la lettre

- Vous avez choisi 2a, « ré-étiqueter par correspondance de sujet et de date » → j'ai apparié par sujet ET date d'auteur, et exigé une correspondance unique → parce qu'un sujet seul peut se répéter dans l'histoire ; les 42 ont été uniques, aucune n'a demandé d'arbitrage.
- Vous avez choisi 3b, « un index cité par le noyau » → le noyau a perdu sa phrase « le détail vit dans references » au profit de l'index → parce que la ligne d'index dépassait le plafond de 29 octets ; la phrase retirée disait la même chose, moins précisément.
- L'ingestion devait être « une commande par lot » → quatre lots sur cinq en ont demandé deux → parce que trois sidecars portaient une marque d'ordre des octets et un quatrième était en forme produit ; les contenus n'ont pas été touchés, seule la forme.
- Rien ne demandait de réécrire des synthèses du 01/09 → deux l'ont été → parce que l'anonymiseur des fichiers suivis y a trouvé un chemin réel de produit, et que la règle du 01/09 dit que les noms sortent de tout ce que git suit.

## 7. Risques

- **Une session qui ouvre ce poste avec un ancien clone d'étiquettes** verra ses étiquettes locales diverger des distantes.
  - signal : `git fetch` qui annonce « would clobber existing tag ».
  - parade : `git fetch --tags --force`, la commande jouée ici ce matin ; les étiquettes distantes sont la référence.
- **Une référence ajoutée sans entrée à l'index** rougit N3 comme avant, mais le message dit désormais « ni par le noyau ni par un document qu'il cite ».
  - signal : verdict N3 FAIL à l'ouverture après création d'un document sous `references\`.
  - parade : une ligne à l'index ; l'index le dit en tête.
- **Un sidecar avec marque d'ordre des octets sera encore refusé** par l'outil d'ingestion, avec un message qui ne nomme pas la cause.
  - signal : « JSON invalide ligne 1 » sur un sidecar dont la première ligne se lit pourtant.
  - parade : retirer la marque avant ingestion ; candidat possible pour l'outil, non créé ce tour (constat en passant, à verser au registre si vous le décidez).
- **Les deux produits n'ont pas la version courante de l'héritage** ; leurs prochains lots sortiront avec la même divergence.
  - signal : l'avertissement R-47 répété à chaque ingestion.
  - parade : la commande de remise à niveau jouée depuis le produit (bloc 8).

## 8. Prochaines actions

Ordre de traitement : la décision de ce message d'abord, parce que dix chantiers en dépendent ; puis le geste produit, qui supprime un avertissement répété ; les restes humains de ce matin ferment la liste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-8 | TF-0793 à TF-0802 | Appliquer votre tri : passer les candidatures retenues en « décidé » au registre et ouvrir l'instruction de la première du pilot (la déclaration de racine web que rien ne lit). | `auto_ia` | `dependance_bloc_3` — D-5. | Dix candidatures restent en tête des actifs sans porteur ; les six défauts du pilot continuent de coûter aux produits. |
| A-9 | `neuve` | Verser au registre le constat en passant : l'outil d'ingestion refuse un sidecar (le fichier de candidatures qui accompagne un lot de retours) à marque d'ordre des octets sans nommer la cause (trois cas ce soir). | `auto_ia` | `hors_mandat` — constat en passant, tout entre en candidat ; mandat de traitement des retours. | Le prochain lot produit sous un éditeur Windows sera refusé avec un message trompeur. |
| A-1 | `neuve` | Rejouer le remède de l'oracle des skills : `node oracles\oracle-skills.mjs --racine "C:\dev"` puis relire son verdict (règle K2). | `auto_ia` | `hors_mandat` — préparation du poste, non sélectionné dans vos réponses. | La garde d'ouverture annonce « poste non prêt » à chaque session ; banc à 92/93. |
| A-10 | `neuve` | Depuis chaque produit concerné (produits 02 et 12), jouer la remise à niveau de l'héritage : `node <PILOT_ROOT>\scripts\recopier-heritage.mjs .` dans le dépôt du produit, puis vérifier que l'avertissement R-47 disparaît à la prochaine ingestion. | `manuelle_utilisateur` | `decision` — le pilot n'écrit pas chez un produit (votre mandat du 23/08) ; trace mesurée : R-47 « 1 absent, 3 périmés » sur les cinq ingestions de ce soir. | Chaque nouveau lot des deux produits répète l'avertissement, et leurs hooks de restitution jugent avec une doctrine du 01/09. |
| A-6 | `neuve` (reprise de la synthèse 20260903d) | Sur l'autre poste, avant tout travail : `git pull --ff-only` et `git fetch --tags --force` dans le dépôt du pilot, puis vérifier que la garde d'ouverture rend « à jour (b399e5f) ». | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : la synthèse GitHub du 03/09 mentionne « le vôtre sur un autre poste ». | La prochaine publication depuis l'autre poste est refusée, ou forcée par-dessus les enregistrements de ce soir. |
| A-7 | `neuve` (reprise de la synthèse 20260903d) | Décider du sort des trois restes de la racine du parc : la seconde copie du pilot, le fichier « null » (à lire avant suppression), le lien brisé. | `manuelle_utilisateur` | `irreversible` — trois suppressions, R-29 ; la garde les déclare et ne les efface pas. | La garde d'ouverture répète les trois avertissements à chaque session. |

## 9. Traces

- Publication : commit `b399e5f` sur `main`, poussé (`19e58f3..b399e5f`), 25 fichiers ; 42 étiquettes poussées en force (`v1.7.0` à `v1.17.30`).
- Index et oracle : `references\INDEX.md` · `CLAUDE.md` (ligne « détail : références INDEX ») · `oracles\oracle-claude-md.mjs` v1.2.0 · `oracles\baseline-recettes.json` (cliquet 6 → 9).
- Registre : `todo\TODO.jsonl` — TF-0793 à TF-0802 (création, candidat), 6 événements de ré-empreinte ; vues `todo\TODO.md`, `todo\AVANCEMENT.md` régénérées (21 actifs, sceau `ce06cd466e72`).
- Lots suivis sous pseudonyme : `input\00-retours\Produit-12 - RETOURS - 20260901b`, `…20260901c`, `…20260902a` · `input\00-retours\Produit-02 - RETOURS - 20260901b` (et son dérivé normalisé) · `…20260902a`.
- Sauvegardes hors dépôt, inchangées : `c:\dev\_sauvegardes\digit-ai-factory-branche-avant-remise-a-niveau-20260830.bundle` (branche supprimée du clone) · `…-ancienne-histoire-20260903.bundle`.
- Oracles rejoués : `oracle-nom-client-publie` (PASS, clone entier puis branche unique) · `oracles\oracle-claude-md.mjs` (PASS, self-test 9/9) · `todo\oracle-todo.mjs` (PASS) · `oracles\oracle-boite-entree.mjs` (PASS) · `oracles\self-tests.mjs` (92/93) · `scripts\readme-dossiers.mjs --check` (PASS).
- Mémoire du poste : `~\.claude\projects\c--dev-digit-ai-factory\memory\reconstruction-clone-historique-reecrit-20260903.md`.
