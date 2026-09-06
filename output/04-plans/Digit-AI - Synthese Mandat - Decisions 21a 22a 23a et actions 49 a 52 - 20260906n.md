---
destinataire: humain
---

# Synthèse de mandat — décisions 21, 22 et 23, actions 49 à 52 exécutées : neuf histoires réécrites dont celle du pilot, six lots instruits, cinq produits à niveau, la forge des outils retenue par sa propre porte (06/09/2026)

Vos trois décisions et vos quatre actions sont exécutées, et les trois actions qui dépendaient des décisions avec elles. Cinq agents mandatés ont instruit les lots des deux forges et des deux produits en retard, et joué le run d'héritage chez les trois produits anciens : les cinq dépôts rendent PASS au relevé d'héritage. La forme courte du nom de produit est un alias de la table, retirée des neuf fichiers du pilot, et l'histoire du pilot est réécrite et publiée sans elle. La campagne de réécriture a tenu sur huit forges sur neuf, chacune publiée en force avec une porte verte sur le dépôt publié ; la neuvième attend votre geste sur sa protection de branche. Un effet inattendu clôt le tour : avec l'alias, la porte rougit sur la forge des outils elle-même — cinq mentions réelles dans ses fiches d'experts et trois faux positifs d'une recherche sans frontière — et son commit du jour reste local, conformément à la règle. Ce qui change pour vous : le parc publié est vert partout sauf deux forges, et le pilot ne porte plus le nom ni dans son arbre ni dans son histoire. Ce qui est attendu de vous : la levée de protection de la forge de développement le temps d'un push, la décision sur la forge des outils, une branche locale à supprimer, et les classes que six constats attendent.

## 1. En-tête d'identification

- **quoi** — mandat humain « 21a, 22a, 23a + A49, A50, A51, A52 » sur la synthèse 20260905m : instruction des lots h (forge-conception), i (forge-agents), j (produit 02), k (produit 12) ; forme courte au pilot (A-53) ; campagne de réécriture (A-54) ; run d'héritage des produits anciens (A-55).
- **sur quoi** — huit forges réécrites et publiées ; forge-agents (commit local) ; forge-development (mesurée, non modifiée) ; cinq produits (commits locaux, jamais poussés) ; le pilot `digit-ai-factory` (arbre corrigé, histoire réécrite et publiée, registre).
- **quand** — fin le **06/09/2026 à 12:00 (UTC+02:00)**, ≈ 3 h 45 depuis votre mandat, dont 2 h 45 de travail parallèle de cinq agents.
- **qui** — Claude Fable 5.1 (extension VS Code) et cinq agents subordonnés ; pilot en version `2542bd3` avant, `39f8a12` après réécriture, cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

A-49 **fait** (forge-conception `b1a9247` + `094a341`, oracle neuf et matrice 23 × 11, self-test 14×51 → 15×55 ; TF-0822 et TF-0823 clos) ; A-50 **fait, non publié** (forge-agents `9454701` local, recette 218 → 221 ; TF-0824 clos ; porte FAIL 8 avec l'alias) ; A-51 et A-52 **faits** (produits 02 et 12 : R-47 FAIL → PASS, commits locaux) ; A-53 **fait** (alias, 30 remplacements, histoire du pilot réécrite `2542bd3 → 39f8a12`) ; A-54 **fait sur 8 forges sur 9** (forge-development protégée) ; A-55 **fait** (trois produits anciens, R-47 8 absents → PASS 13) ; 26 candidatures neuves (TF-0830 à TF-0855, dont 17 d'un produit qui a clos un run) ; parc publié avec l'alias : pilot et 11 forges PASS, forge-agents et forge-development FAIL.

## 3. Décisions attendues

Les trois décisions viennent de ce que la campagne a laissé : une forge retenue par sa porte, une branche locale de plus, et six constats sans classe. Chaque décision porte le même tableau de trois lignes, à lire ligne par ligne : la colonne « Option » nomme le choix, « Ce qu'elle coûte » donne sa complexité et sa durée, « Ce qu'elle exclut » dit ce à quoi l'on renonce ; les lignes vont de l'option recommandée à l'inaction, rien n'est trié ni omis.

> **D-24 — Que fait-on de la forge des outils, dont la porte de publication rougit depuis l'alias sur cinq mentions réelles de ses fiches d'experts et trois faux positifs, et dont le commit du jour attend, local ?**
> La porte, jouée par l'agent avant tout push, rend FAIL sur la forge des outils avec la table du jour : cinq mentions réelles du nom de produit et d'un toponyme dans trois fiches et fixtures d'experts et un manifeste, et trois faux positifs — la règle C5 cherche la clé sans frontière et la trouve dans des polices encodées en base64. Aucun constat ne vient du lot ; l'agent a suspendu le push selon la règle, et a corrigé en route un message de commit qui citait le nom. Le remède tient en un lot : les cinq mentions par commit ordinaire, la frontière de C5 (constat RC-3 — la recherche sans frontière — de la forge, en prose faute de classe), puis la réécriture de l'histoire selon le mode opératoire, et la publication du commit du jour.
> **Recommandation : (a).** Source consultée : le lot de retours de la forge des outils du jour (`…forge-agents - RETOURS - 20260906a.md`, constats RC-2 et RC-3) ; mesure de la porte sur la forge (FAIL 8, contenus courants) ; `todo\TODO.md` (TF-0855).
> Le contrat de sortie est écrit et éprouvé mais invisible du parc tant qu'il n'est pas publié ; la forge qui porte la porte doit être la première à la passer.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** un lot à forge-agents : cinq mentions corrigées, frontière de C5 avec fixture double sens (blob base64 → PASS, mot entier → FAIL), puis réécriture de son histoire et publication en force, commit du jour compris | moyen × court : un lot, une passe, un push forcé | exclut de publier le contrat de sortie avant la correction |
| **(b)** corriger les cinq mentions et publier, sans toucher C5 ni l'histoire | simple × court | exclut une porte verte : les trois faux positifs et l'histoire restent rouges |
| **(c)** ne rien faire | gratuit | exclut tout effet ; le commit du jour reste local |

> **Si rien n'est décidé** : (c) s'applique — la forge des outils publie sur une porte rouge, et le contrat de sortie n'est que sur ce poste.

> **D-25 — Supprime-t-on, sur ce poste, la branche locale de sauvegarde de la forge SEO, seule à porter huit messages de commit avec un nom de produit, comme vous l'avez décidé deux fois hier ?**
> La réécriture de la forge SEO a tenu : soixante et un commits, porte verte sur le dépôt publié, publication forcée, clone rebâti. Le clone de ce poste porte aussi une branche locale d'août, seize commits jamais poussés, dont huit messages citent un nom de produit ; la porte sur le clone entier rend FAIL, la porte sur ce qui est publié rend PASS. C'est le troisième cas identique du jour, et la branche est dans le paquet de sauvegarde, vérifié, hors dépôt. Une suppression est un geste humain.
> **Recommandation : (a).** Source consultée : mesure de la porte sur le clone local (FAIL, 8 messages) et sur le clone publié (PASS) ; `git rev-list` de la branche (16 commits hors `main`, dernier le 09/08) ; les décisions D-13 et D-16 de la veille.
> Une branche locale rouge contredit la mesure du parc à chaque relevé, et la règle a déjà été tranchée deux fois dans le même sens.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** supprimer la branche locale (`git branch -D`), le paquet faisant foi | simple × court | exclut de retrouver ces commits sans passer par le paquet |
| **(b)** la renommer en `archive/…` | simple × court | exclut une porte verte sur le clone entier |
| **(c)** ne rien faire | gratuit | exclut tout effet ; le clone reste rouge |

> **Si rien n'est décidé** : (c) s'applique — la branche reste, rouge sur ce poste seul.

> **D-26 — Crée-t-on les classes que six constats du jour attendent en prose, remis par quatre émetteurs différents, faute de pouvoir entrer au registre par un sidecar (le fichier machine qui accompagne un lot) ?**
> Les comptes rendus du jour portent six constats généralisables sans classe : chez la forge des outils, une recherche de nom sans frontière (faux positifs dans des blobs) ; chez les produits anciens, un alias de transition périmé qui survit à côté de la copie à jour sans que le relevé le regarde, et un motif d'exclusion compté absent alors qu'une graphie plus large le couvre ; chez le produit 12, un canal qui suppose la boîte d'entrée ignorée par git sans le dire, et un lot remis qu'une nouvelle écriture a pu écraser sans qu'aucun contrôle s'y oppose ; chez le produit 02, un relevé qui juge l'arbre de travail et jamais l'état versionné, rattaché par défaut à une classe qui vise autre chose. La forge de conception en avait laissé un hier (un point d'entrée qui rend FAIL sur toute cible) et la forge de développement un autre (une règle de branche annoncée qui diffère de la règle configurée) : huit en tout.
> **Recommandation : (a).** Source consultée : les lots de retours du jour (forge-agents 20260906a, produits-anciens 20260906a, Produit-12 20260906b, Produit-02 20260906a) et de la veille (forge-conception 20260905d, forge-development 20260905b), sections « La règle qui aurait évité le retour » ; `todo\CLASSES.json` (37 classes).
> Huit constats mesurés hors registre sont huit récidives que rien ne comptera ; une classe coûte dix lignes, et l'écrasement d'un lot remis vient d'arriver pour de vrai.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** créer les huit classes et journaliser les huit constats en candidats contre leur émetteur | simple × court : huit entrées, huit créations | exclut un tri préalable |
| **(b)** créer seulement les trois qui touchent le pilot (alias périmé, motif couvert, lot écrasable) | simple × court | exclut les cinq autres, dont la frontière de C5 qui bloque une forge |
| **(c)** ne rien créer | gratuit | exclut toute trace ; les huit restent en prose dans six lots |

> **Si rien n'est décidé** : (c) s'applique — les huit constats restent en prose, hors registre.

## 4. Traité — avec sa preuve

- **A-49 — TF-0822 et TF-0823 clos chez forge-conception** — classe : un champ transcrit de prose que rien ne relie à sa source, et une fixture jugée par son seul oracle ; contrôle rouge → vert : un écart socle écrit dans le JSON à côté d'un `EXIGENCES.md` d'une seule section passait cinq oracles en exit 0, l'oracle neuf `oracle-exigences-md` rend exit 1 ; un balayage manuel trouvait 18 FAIL dont 12 invisibles au self-test, la matrice attendue versionnée (23 fixtures × 11 oracles, 86 cellules) rougit sur une cellule altérée et repasse restaurée ; self-test 14×51 → 15×55, branches 12 et 7 cas tenus. La forge a prouvé qu'aucun des 14 constats C5 de sa porte ne venait de ses commits (blame, et 1 871 lignes ajoutées confrontées aux deux tables) ; son histoire a été réécrite ensuite.
  - preuve : commits `b1a9247`, `094a341` (`c8be40d..094a341`, avance rapide) ; lot `…forge-conception - RETOURS - 20260906a.md` PASS, ingéré (TF-0854) ; deux clôtures et une rectification d'identifiant (PASS).
- **A-50 — TF-0824 clos chez forge-agents, commit local** — classe : un contrat de sortie sans domicile ; contrôle rouge → vert : lanceur ramené à sa forme d'avant le 05/09 → recette rouge ; document retiré → rouge ; en-tête de compte retiré de l'expression documentée → rouge sur le cas rouge ; le document `contrat-sortie-runner.md` porte la version 1.2.0 et l'historique daté des deux changements, la recette LIT la forme documentée ; recette 218 → 221, hook 37/37, lanceur et contrat d'entrée inchangés d'un caractère. Non publié : porte FAIL 8 C5 sur la forge avec l'alias, aucun constat du lot.
  - preuve : commit `9454701` (local) ; lot `…forge-agents - RETOURS - 20260906a.md` PASS, ingéré (TF-0855, récidive marquée) ; clôture journalisée avec la mention « non publié » (PASS).
- **A-51 et A-52 — produits 02 et 12 à niveau** — classe : un canal des lots en retard d'une règle ; contrôle rouge → vert : R-47 (le relevé d'héritage du pilot chez un produit) « 0 absent, 3 périmés » → PASS chez les deux ; trois fichiers recopiés chacun (gabarit et oracle des lots 1.1.0, classes 1.2.0), commis par le produit, par ajout explicite fichier par fichier sans toucher aux modifications vivantes des deux dépôts ; l'oracle des lots imprime six règles, T6 comprise. Incident déclaré et réparé par l'agent du produit 12 : son premier compte rendu a écrasé un lot que le produit avait remis le matin même ; restauré à l'identique, indice suivant pris.
  - preuve : commits `094364a` (produit 02) et `7ba309e` (produit 12), locaux ; lots `Produit-02 - RETOURS - 20260906a.md` (TF-0848, TF-0849) et `Produit-12 - RETOURS - 20260906b.md` (TF-0851 à TF-0853) PASS, ingérés.
- **A-53 — forme courte au pilot** (D-21 (a)) — alias posé dans la table hors dépôt (donnée datée) ; 30 remplacements dans huit fichiers texte suivis et trois modules de pseudonymisation dont les fixtures inventées portaient la forme courte (remplacée par un mot inventé) ; le générateur de règles borne désormais tout nom d'un seul mot au mot entier, insensible à la casse ; contrôle rouge → vert : recherche mot entier 38 → 0 sur les fichiers suivis ; puis histoire réécrite sur un clone frais : 508 commits, la forme courte présente dans 14 commits → 0, un seul fichier courant touché (une graphie en majuscules d'un autre nom de produit dans un ancien sidecar), publication forcée, 40 étiquettes reposées, clone local rebâti.
  - preuve : bancs 6/6, 7/7, 7/7, banc du pilot 94/94 ; porte C1 (la première des quatre règles sur les noms de clients) à C5 PASS sur le pilot ; `+ 2542bd3...39f8a12 main -> main (forced update)` ; paquet `c:\dev\_sauvegardes\digit-ai-factory-avant-filter-repo-20260906.bundle` vérifié.
- **A-54 — campagne de réécriture** (D-22 (a)) — script de campagne rejouant le mode opératoire (paquet vérifié, clone frais avec toutes les branches et étiquettes publiées, règles des deux tables, passe, porte C1 à C5, publication forcée, clone rebâti) ; huit forges réécrites et publiées : audit (37 commits), data (22), design (70), ops (25), organization (31), seo-geo (61), tests (182), conception (47, après son agent) ; contrôle rouge → vert : porte FAIL → PASS sur chacune, sur le clone réécrit puis sur le clone local. Forge-development non réécrite : sa branche principale est protégée (push forcé interdit, revue obligatoire, deux contrôles) — la levée est votre geste.
  - preuve : huit lignes `main -> main (forced update)`, 64 étiquettes reposées ; huit paquets de sauvegarde du 06/09 ; mesure du parc après campagne avec l'alias : pilot et onze forges PASS.
- **A-55 — trois produits anciens à niveau** (D-23 (a)) — classe : un héritage jamais descendu ; contrôle rouge → vert : R-47 « 8 absents, 3 périmés » → PASS 13 artefacts chez chacun ; sept artefacts recopiés en un geste, quatre instanciés par le produit (réglage des hooks vérifié sans secret ni chemin absolu, écarts assumés, clause de précédence, motifs d'exclusion) ; R-43 (la précédence de la factory) FAIL → PASS chez les trois sans avoir été visée ; les modifications non commises du troisième laissées intactes.
  - preuve : commits `8549581`, `2a668aa`, `fba0efc`, locaux ; lot `produits-anciens - RETOURS - 20260906a.md` PASS, ingéré (TF-0850, récidive marquée) ; le pseudonyme parasite que l'ingestion avait créé pour ce nom de lot collectif est retiré de la table, rectification journalisée.
- **Un lot d'un produit arrivé en cours de tour** : dix-sept candidatures d'un produit qui a clos un run complet le 05/09 (jusqu'à une mise en production de qualification), héritage à jour, ingérées et pseudonymisées.
  - preuve : `Produit-61 - RETOURS - 20260905a.md` PASS, ingéré (TF-0831 à TF-0847).
- **Copies installées réalignées** sur les sources du jour (conception, agents local).
  - preuve : `oracle-skills --appliquer` puis PASS ; banc du pilot 94/94.

## 5. Non traité — avec son motif

- **La réécriture de forge-development** : *geste humain préalable* — la protection de sa branche principale interdit tout push forcé (A-56, puis A-57).
- **La publication de forge-agents** : *dépendance à une décision humaine* — D-24 ; la porte de la forge rougit sur ses propres fichiers.
- **La branche locale de forge-seo-geo** : *irréversible* — R-29 (la règle qui réserve toute suppression à l'humain), D-25.
- **Les huit constats sans classe** : *une classe ne se crée que par le pilot, sur décision* — D-26.
- **Le tri des 26 candidatures neuves** (TF-0830 à TF-0855) : *tout entre en candidat* — proposé au prochain tour, avec les dix-sept du produit 61 en tête.
- **La publication des commits des cinq produits** : *le produit décide seul* — commits locaux, jamais poussés par le pilot.
- **A-25 et A-19 (produit 02), A-6 (l'autre poste), A-17 (D-7)** : *inchangés* — A-6 s'alourdit : neuf dépôts à recloner sur l'autre poste, pilot compris.

## 6. Écarts à la lettre

- Votre réponse nommait A-49 à A-52 et pas A-53 à A-55 → les trois ont été exécutées → parce qu'elles étaient écrites « si D-N (a) » et que vous avez tranché D-21, D-22 et D-23 en (a), comme aux deux tours précédents.
- D-22 (a) disait « la forge de développement après levée de sa protection par vous » → non levée, non réécrite → parce que le réglage est le vôtre ; la mesure et le paquet sont prêts (A-56, A-57).
- La campagne a été mesurée hier sans l'alias → avec l'alias, la forge des outils rougit alors qu'elle était verte → parce que la porte cherche la clé de la table et que la clé n'existait pas ; D-24.
- Un remisage git du pilot, tenté pour mesurer l'arbre publié, a échoué deux fois parce que les hooks régénèrent les README entre le remisage et sa reprise → restauré à la main sans perte (comparaison des quatre fichiers déplacés, identiques) → règle notée en mémoire du poste : jamais de remisage dans le pilot.
- L'ingestion a pris le nom du lot collectif des produits anciens pour un produit → pseudonyme parasite créé puis retiré, demandeur réel journalisé → parce que la forme « émetteur non produit » n'est reconnue que pour les forges (TF-0807) ; à étendre.
- Le lot i disait que le contrat d'entrée vit dans `references\regles-oracles.md` → faux, il vit dans le SKILL.md → déclaré par la forge, fichier dédié créé.

## 7. Risques

- **Deux forges publient sur une porte rouge** (agents : contenus courants ; development : messages de commit) tant que D-24 et A-56 ne sont pas faites.
  - signal : un push refusé par la porte installée sur ce poste.
  - parade : D-24 (a), A-56 puis A-57.
- **Neuf dépôts réécrits sont incompatibles avec tout autre clone** (l'autre poste, tout produit qui aurait cloné une forge).
  - signal : un `git pull` qui rapporte des dizaines ou des centaines de commits divergents.
  - parade : A-6 (recloner, jamais fusionner) ; le pilot lui-même est dans la liste.
- **Un lot remis peut être écrasé par une nouvelle écriture** sans qu'aucun contrôle s'y oppose — arrivé ce jour, réparé par l'agent lui-même.
  - signal : un lot dont le contenu change après son ingestion (empreinte du registre différente du fichier).
  - parade : D-26 (a), puis une garde à l'écriture des lots.
- **Le produit 61 a clos un run entier hors du regard du pilot** et remet dix-sept candidatures d'un coup.
  - signal : un lot de dix-sept lignes ingéré sans qu'aucune décision n'ait précédé.
  - parade : tri au prochain tour, en tête de liste.

## 8. Prochaines actions

Ordre de traitement : d'abord ce qui rend le parc vert (le geste humain sur la forge de développement, la forge des outils), puis la branche et les classes, puis le tri ; les restes humains ferment la liste. Le tableau se lit ligne par ligne, dans l'ordre de traitement : la colonne « Identifiant » renvoie à l'item du registre, « Action » dit le geste, « Acteur » qui le fait, « Motif / raison » pourquoi il n'est pas déjà fait, et la dernière colonne ce qui se passe s'il ne l'est pas ; rien n'est trié autrement ni omis.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-56 | TF-0829 | Sur GitHub, forge-development, branche `main` : autoriser temporairement le push forcé (protection classique : « Allow force pushes »), puis le dire au pilot. | `manuelle_utilisateur` | `acces` — réglage de dépôt réservé au propriétaire ; trace mesurée : `allow_force_pushes: false`, revue obligatoire, contrôles `code` et `design`. | La forge publie sur cinq messages rouges. |
| A-57 | TF-0829 | Après A-56 : rejouer le script de campagne sur forge-development (paquet, passe, porte C1 à C5 PASS, push forcé, clone rebâti), puis vous rendre la main pour remettre la protection. | `auto_ia` | `dependance_externe` — A-56. | Même effet. |
| A-58 | TF-0855, TF-0824 | Si D-24 (a) : déposer et instruire un lot chez forge-agents (cinq mentions, frontière de C5 avec fixture), puis réécrire son histoire et publier `9454701`. | `auto_ia` | `dependance_bloc_3` — D-24. | Le contrat de sortie reste sur ce poste ; la porte garde ses faux positifs. |
| A-59 | `neuve` | Si D-25 (a) : `git branch -D sauvegarde/20260809` chez forge-seo-geo, rejouer la porte sur le clone entier (attendu PASS). | `auto_ia` | `dependance_bloc_3` — D-25 ; R-29. | Le clone reste rouge sur ce poste. |
| A-60 | `neuve` | Si D-26 (a) : créer les huit classes dans `todo\CLASSES.json` et journaliser les huit constats en candidats contre leur émetteur. | `auto_ia` | `dependance_bloc_3` — D-26. | Huit récidives que rien ne comptera. |
| A-61 | TF-0830 à TF-0855 | Présenter le tri des 26 candidatures neuves au prochain tour : les dix-sept du produit 61 d'abord (un run entier), puis celles des produits 02 et 12, des produits anciens et des forges. | `auto_ia` | `borne_atteinte` — ce tour porte déjà trois décisions ; un tri de 26 items est un tour à lui seul. | Vingt-six candidatures attendent sans rang. |
| A-6 | `neuve` (reprise) | Sur l'autre poste : recloner le pilot et les huit forges réécrites (audit, data, design, ops, organization, seo-geo, tests, conception) plus forge-agents ; jamais fusionner. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : neuf publications forcées ce jour. | Une fusion depuis l'autre poste réintroduit les anciennes histoires. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run). | `auto_ia` | `garde_fou` — sept fichiers modifiés non commis chez le produit ce matin, session vivante. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur ; trace mesurée : quatre fichiers non commis. | Un nettoyage efface les chemins d'échec prouvés. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Forges réécrites et publiées en force (paquets `c:\dev\_sauvegardes\<forge>-avant-filter-repo-20260906.bundle`) : audit `0a172f3`, data `ce86658`, design `1b0069c`, ops `6ba986f`, organization `d310975`, seo-geo `03748b3`, tests `609f3f1`, conception `7d93a14` (après `094a341`) ; clones locaux rebâtis.
- Forge-agents : `9454701` local, non publié ; lot 20260905i marqué traité. Forge-development : inchangée (`053fdaf`), protection relevée.
- Produits : commits locaux `094364a` (02), `7ba309e` (12), `8549581`, `2a668aa`, `fba0efc` (anciens n° 1 à 3) ; lots j et k marqués traités.
- Pilot : histoire réécrite `2542bd3 → 39f8a12` (508 commits, 42 étiquettes, paquet du 06/09) ; `todo\TODO.jsonl` — TF-0822, TF-0823, TF-0824 clos, TF-0830 à TF-0855 créés, deux rectifications ; `scripts\generer-remplacements-historique.mjs` (mot entier) ; `todo\CLASSES.json` inchangé (37) ; vues `todo\TODO.md` et `todo\AVANCEMENT.md` ; cette synthèse — dans le commit qui suit `39f8a12`.
- Table hors dépôt : alias de la forme courte ajouté (daté du 06/09) ; entrée parasite du lot collectif retirée.
- Comptes rendus ingérés : forge-conception 20260906a · forge-agents 20260906a · Produit-02 20260906a · Produit-12 20260906b · produits-anciens 20260906a · Produit-61 20260905a.
- Oracles rejoués : `oracle-nom-client-publie` avec `--produits` sur le pilot et les 13 forges (12 PASS, 2 FAIL) · `gabarits\oracle-lot-retours.mjs` ×6 (PASS) · `oracle-conformite-projet` R-47 ×5 (PASS après remise à niveau) · `oracles\self-tests.mjs` 94/94 · `oracle-skills` PASS · `oracle-todo` PASS · `readme-dossiers --check` PASS.
- Mémoire du poste : note complétée (campagne, alias, pièges du remisage et de l'ingestion, limite de C5 sur l'historique).
