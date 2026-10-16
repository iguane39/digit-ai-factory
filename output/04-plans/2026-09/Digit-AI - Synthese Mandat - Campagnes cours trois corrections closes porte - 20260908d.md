---
destinataire: humain
---

# Synthèse de mandat — campagnes en cours : trois corrections vérifiées et closes, trois campagnes relancées après un blocage, et la porte rejouée avec les tables du canal révèle un sigle client dans l'histoire publiée de la forge de développement (08/09/2026, second point d'étape)

Les campagnes avancent : deux sont terminées et leurs trois corrections ont été vérifiées par sondage puis closes au registre, trois autres se sont arrêtées sur un blocage de flux et ont été relancées là où elles en étaient sans rien perdre, deux continuent normalement. En rejouant la porte de publication sur tout le parc avec les tables du canal, deux faits nouveaux apparaissent. Le premier est grave : l'histoire publiée de la forge de développement, réécrite hier, porte encore dans un message de commit d'août le sigle de trois lettres d'un client, que seule la table du canal connaît ; réécrire cette histoire une seconde fois est votre décision. Le second est bénin : trois forges de l'autre poste gardent sur ce poste une branche d'ancienne histoire, jamais poussée, que la porte compte ; leurs paquets de sauvegarde sont faits, supprimer les branches est votre geste. Ce qui est attendu de vous : ces deux décisions, et toujours la lecture des six lignes d'arbitrage dans le canal.

## 1. En-tête d'identification

- **quoi** — suite du mandat « fais tous les retours et todos » sous vos réponses 13, 14a et 15a : réception et sondage des rapports de campagne, clôtures au registre, relance des campagnes bloquées, porte rejouée sur le parc.
- **sur quoi** — les six forges cibles et le pilot (campagnes) ; le registre du pilot (arbre de travail, non commité) ; les quatorze dépôts du parc (porte) ; `c:\dev\_sauvegardes` (trois paquets neufs).
- **quand** — 2026-09-08 08:40 UTC+02:00 (Europe/Paris), durée ≈ 40 min depuis le point d'étape précédent ; campagnes restantes en cours (données : fin annoncée vers 09:20 ; tests, design, socle des pages : relancées à 08:25 ; pilot : fin annoncée vers 11:30).
- **qui** — pilot digit-ai-factory 6a33b3e (+ registre en arbre de travail) ; porte `oracle-nom-client-publie` (copie installée) avec les tables du canal ; `todo\journaliser.mjs`, `todo\oracle-todo.mjs` ; sept agents de campagne.

## 2. Verdict en une ligne

Rapports finaux reçus : 3 sur 7 (exploitation, développement, données) ; items sondés et clos « corrige » : 6 (TF-0844, TF-0845, TF-0886, TF-0893, TF-0911, TF-0894), preuves rejouées par le pilot (« Self-test forge-ops : 100 PASS, 0 FAIL », pytest forge-development suite complète verte, « Self-test forge-data : 166 PASS, 0 FAIL », aller-retour TMDL → `oracle-modeliser` PASS avec complément et FAIL sans, porte PASS sur les trois) ; « 3 événement(s) journalisé(s) » × 2, oracle du registre PASS ; 3 candidatures neuves journalisées (TF-0915 à TF-0917) et 5 ids renumérotés après collision avec l'autre poste (son TF-0889 devenu TF-0912 en 51460e2) ; catalogue : cat-dat-07 corrigé (tabulation dans le point d'entrée), cat-dat-12 et cat-dat-13 ajoutés, vues régénérées ; commits locaux mesurés dans les autres forges : tests 2 (+1 annoncé), design 2, socle des pages 2, pilot 2 (par la campagne pilot) ; 3 campagnes relancées après « no progress for 600s », toutes ont émis depuis ; porte sur 14 dépôts : 10 PASS, 4 FAIL (15 constats C5 : 1 publié chez développement, 14 dans trois branches locales jamais poussées) ; 3 paquets de sauvegarde écrits.

## 3. Décisions attendues de l'humain

Deux décisions nées de la porte rejouée avec les tables du canal, qui connaît depuis hier soir un sigle de trois lettres d'un client que les tables d'hier ignoraient ; toutes deux portent sur des histoires git, l'une publiée, les autres locales.

> **D-16 — L'histoire publiée de la forge de développement, qui porte dans un message de commit d'août le sigle de trois lettres d'un client, se réécrit-elle une seconde fois ?**
> Hier soir, cette histoire a été réécrite et publiée en force avec les tables de l'époque, protection de branche levée puis remise, et la porte l'a déclarée verte. Ce matin, le canal confidentiel porte un alias de trois lettres pour un produit, et la porte, rejouée avec lui, trouve ce sigle suivi d'un nom de domaine dans le corps d'un message de commit du 20 août, présent sur la branche principale publiée (150 commits, 15 étiquettes). C'est un nom de domaine de client en clair sur un dépôt public. Le même mode opératoire qu'hier s'applique : paquet, clone frais, réécriture par les règles des deux tables, protection levée le temps du push forcé et remise à l'identique, clone local rebâti par l'outil et commit de campagne du jour rejoué.
> **Recommandation : (a).** Source consultée : porte rejouée sur les quatorze dépôts → « digit-ai-forge-development: FAIL 1 C5 df0223e » ; `git branch -r --contains df0223e` → origin/main ; le jeton condamné contient la clé de trois lettres que le canal attribue à un produit pseudonymisé ; `references\TODO-FORGE.md` § réécrire l'historique d'un dépôt (mode opératoire TF-0752) ; précédent d'hier soir (D-10 a, D-11 b).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Réécrire une seconde fois par le mode opératoire, protection levée par l'interface de l'hébergeur le temps du geste et remise à l'identique, puis rebâtir le clone local et rejouer le commit de campagne | Moyen × court : le mode opératoire est rodé, l'outil de reconstruction aussi ; une seconde histoire réécrite à répercuter sur l'autre poste | Rien : le paquet d'avant reste ; un domaine client cesse d'être public |
| (b) Ne pas réécrire et retirer le sigle de la table du canal | Aucun coût immédiat | La table du canal n'est plus la source unique ; le domaine reste public |
| (c) Rien | Aucun coût | La forge de développement ne se publie plus tant que la porte compte ce commit |

> **Si rien n'est décidé** : (c) — aucune publication de la forge de développement ; sa correction de campagne reste locale.

> **D-17 — Les trois branches d'ancienne histoire que les forges de conception, d'organisation et de SEO-GEO gardent sur ce poste se suppriment-elles, leurs paquets étant écrits ?**
> Hier, la reconstruction de ces trois clones sur l'histoire réécrite par l'autre poste a posé dans chacun une branche locale d'ancienne histoire, jamais poussée, comme chez la forge des outils ce matin. La porte compte toute branche : quatorze constats y vivent, tous sur des messages de commit d'août portant des noms longs. Les trois clones sont par ailleurs alignés sur leur distant, sans commit local. Aucun paquet n'existait pour ces trois branches ; je viens d'en écrire un par forge, vérifié. Supprimer une branche est un geste humain.
> **Recommandation : (a).** Source consultée : porte → « forge-conception: FAIL 5 C5 », « forge-organization: FAIL 2 C5 », « forge-seo-geo: FAIL 7 C5 » ; `git for-each-ref --contains` → `sauvegarde/ancienne-histoire-20260907` seule pour chaque commit condamné ; « 0/0 (avance/retard) » pour les trois ; précédents D-8 a (données, hier) et D-15 a (outils, ce matin).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Supprimer les trois branches, porte rejouée ensuite | Trois `git branch -D`, simple × court | Rien : les trois paquets conservent l'ancienne histoire |
| (b) Garder les branches et déclarer les trois forges non publiables depuis ce poste | Aucun coût | Toute publication future de ces forges depuis ce poste, jusqu'à suppression |
| (c) Rien | Aucun coût | Même effet que (b), sans le dire |

> **Si rien n'est décidé** : (c) — les trois forges restent rouges à la porte sur ce poste ; l'autre poste, qui les tient, n'est pas affecté.

## 4. Traité — avec sa preuve

- Campagne exploitation reçue et sondée : deux items corrigés en deux commits locaux, diff lu (garde-fou explicite par fichier de déclaration, jamais déduit du nom du dossier ; avertissement dans le plan généré et fait G-04 daté), self-test rejoué par le pilot, porte PASS. Contrôle rouge → vert de l'item principal : sur fixture, cible vide déclarée plateforme → FAIL 2 bloquants avant, SKIP 0 bloquant après ; sans déclaration → FAIL inchangé ; classe : oracle jugeant un contrat de fichiers qu'une cible ne porte pas par construction.
  - preuve : `git log 538ccb1..HEAD` → 666b94b, 7b86064 ; `node oracles/self-test.mjs` → « Self-test forge-ops : 100 PASS, 0 FAIL » ; porte → « PASS constats 0 ».
- Campagne développement reçue et sondée : un item corrigé en un commit local (description sourcée et datée de la protection réelle, lecteur et tests à double sens), pytest complet rejoué par le pilot.
  - preuve : `git log 4d81314..HEAD` → 8029348, « 4 files changed, 327 insertions(+) » ; `uv run pytest -q` → suite complète verte (barre à 100 %).
- Trois clôtures journalisées avec gains constatés, version locale de la forge, descente règle et oracle ; part pilot de l'item de développement laissée ouverte et décrite (règle T1 (moyen de vérification écrit, jamais vérifié) de l'oracle des lots, gabarit des lots, classe manquante).
  - preuve : `journaliser.mjs` → « 3 événement(s) journalisé(s) » ; `oracle-todo.mjs` → « PASS ».
- Campagne données reçue et sondée : trois items corrigés en trois commits locaux (seconde voie d'entrée du lignage par l'API, oracle de couverture à six règles chaîné à la restitution, verbe de lecture d'un modèle sémantique TMDL vers le modèle dimensionnel avec complément humain pour ce que TMDL ne porte pas), chaque verbe et oracle rejoué par le pilot sur ses fixtures vertes et rouges, sorties de sondage retirées du dépôt (arbre propre).
  - preuve : `git log 10cca3b..HEAD` → 5c15870, 189b6c0, 28a2b0c, « 24 files changed, 1391 insertions(+) » ; `node oracles/self-test.mjs` → « 166 PASS, 0 FAIL » ; `oracle-couvrir` verte → PASS, rouge → FAIL ; `traduire-modele-semantique` verte + complément → `oracle-modeliser` PASS, sans complément → FAIL, rouge → « sortie: ECHEC » ; voie API → « sortie: OK voie: api-lineage-tracking » ; porte → PASS 0 bloquant.
- Trois clôtures données journalisées, trois candidatures neuves nées des rapports (règle T1 (moyen de vérification écrit, jamais vérifié) de l'oracle des lots côté pilot ; boucle de résolvabilité du self-test de forge-data écrite à la main ; chaînage TMDL → couverture), cinq ids locaux renumérotés après collision (l'autre poste a publié son TF-0889 renuméroté TF-0912 pendant que ce poste frappait TF-0912 à TF-0916), vues régénérées. Contrôle rouge → vert : « dernier id local TF-0913, dernier id distant TF-0912 » → cinq renumérotations par `todo\renumeroter.mjs` (décalage de un, en ordre décroissant) → oracle PASS ; classe : collision de numéros entre deux postes.
  - preuve : `journaliser.mjs` → « 3 événement(s) journalisé(s) » deux fois ; `renumeroter.mjs` → « 1 ligne(s) réécrite(s) » × 5 ; `oracle-todo.mjs` → « PASS » ; ids ≥ 0912 présents : TF-0913 à TF-0917.
- Catalogue du pilot : cat-dat-07 corrigé et décrit avec sa seconde voie ; cat-dat-12 (Couvrir) et cat-dat-13 (Traduire un modèle sémantique) ajoutés ; JSONL validé, vues régénérées. Contrôle rouge → vert : le README généré de forge-data affichait le point d’entrée du traducteur amputé de sa première lettre (une tabulation écrite dans le catalogue à la place de la séquence antislash-t) → compte des tabulations dans le catalogue 1 → 0 après correction, JSONL valide ; classe : garde-lexicale-frontiere-ascii (séquence d’échappement JSON prise pour un antislash).
  - preuve : script → « {"cat_dat_07_maj":1,"ajoutees":["cat-dat-12","cat-dat-13"],"lignes":92} » ; « jsonl valide » ; `grep -c` tabulation → 0 ; `generer-vues.mjs` → « [ok] CATALOGUES.md régénéré », « [ok] section CATALOGUE du README régénérée ».
- Trois campagnes arrêtées par le garde-temps du harnais (« Agent stalled: no progress for 600s ») relancées sur leur état mesuré, sans perte : chacune a reçu la liste de ce qui est commité, de ce qui est en cours et la consigne de lancer ses vérifications longues en arrière-plan avec un guetteur.
  - preuve : `git log origin/main..HEAD` → tests 095ba72, 2581da7 ; design a79584d + « M oracles/oracle-mobile.mjs » et deux autres ; socle des pages 8ab3d14 ; relance → « Resuming agent » × 3.
- Porte rejouée sur les quatorze dépôts avec les tables du canal, constats localisés commit par commit (publié ou non, référence porteuse, forme du jeton).
  - preuve : « 10 PASS, 4 FAIL » ; développement : « df0223e … publié=2 (origin/main) », jeton de forme « AAA » contenant la clé de trois lettres du canal ; conception, organisation, SEO-GEO : « publié=0 », référence unique `sauvegarde/ancienne-histoire-20260907`.
- Trois paquets de sauvegarde écrits pour les trois branches d'ancienne histoire, vérifiés.
  - preuve : `git bundle verify` → exit 0 pour les trois, tailles 407 270, 2 411 836 et 606 257 octets, une référence chacun.

## 5. Non traité — avec son motif

- Clôture des items des cinq campagnes en cours : attend leurs rapports finaux, puis le sondage.
- Commit du registre au pilot (trois clôtures, deux candidatures neuves) : différé tant que la campagne pilot écrit dans le même dépôt (deux fichiers de doctrine modifiés par elle, non commités).
- Réécriture de la forge de développement : attend D-16, parce qu'une réécriture publiée est un geste humain.
- Suppression des trois branches d'ancienne histoire : attend D-17, geste humain.
- Fusion des tables : attend votre lecture des six lignes dans le canal.
- Le lot du 03/09 non suivi, le fichier `null`, les deux réserves du 01/09 : inchangés.

## 6. Écarts à la lettre

- Le contrat de campagne veut un rapport final par agent → trois agents se sont arrêtés avant de le rendre → je les ai relancés sur leur état mesuré plutôt que de relancer des campagnes neuves → pourquoi : leurs commits locaux sont propres et vérifiés, un agent neuf aurait refait le travail.
- Aucune campagne n'a été lancée sur les trois forges rouges de l'autre poste → pourquoi : leurs constats vivent dans des branches locales et non dans leur histoire publiée ; c'est un geste de suppression, pas une correction.
- Aucun autre écart.

## 7. Risques

- **Un domaine client public dans l'histoire de la forge de développement** : signal = la porte FAIL sur le commit du 20 août avec les tables du canal ; parade = D-16 (a), et d'ici là aucune publication de cette forge.
- **Nouveau blocage de flux d'un agent** : signal = notification « no progress for 600s » ; parade = vérifications longues en arrière-plan avec guetteur (consigne donnée), relance sur état mesuré.
- **Commit d'agent qui emporte le registre** : signal = `todo/` dans un commit de la campagne pilot ; parade = commit du registre par le pilot seul, après la fin de cette campagne, diff lu avant.
- **Sigle de trois lettres dans d'autres histoires publiées** : signal = la porte rouge sur un dépôt vert hier ; parade = la porte rejouée ce matin sur les quatorze dépôts n'en trouve qu'un ; à rejouer après chaque extension du canal.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-54 | Recevoir les cinq rapports restants, sonder chaque commit, clore ou renvoyer au registre, régénérer les vues | TF-0889 à TF-0911, TF-0833 à TF-0847, TF-0866, TF-0875, TF-0876, TF-0748, TF-0749 | auto_ia | dependance_externe (campagnes en cours) | rapports puis `node todo/journaliser.mjs --fichier <clotures.json>`, `node todo/generer-vue.mjs`, `node todo/generer-page.mjs` | trente-neuf items restent décidés sans clôture |
| A-55 | Commiter le registre (six clôtures, cinq candidatures neuves, catalogue) après la fin de la campagne pilot, rebase sur l'avance simple du distant (e2744ac) puis publier | TF-0844, TF-0845, TF-0886, TF-0893, TF-0894, TF-0911, TF-0913 à TF-0917 | auto_ia | dependance_externe (campagne pilot en cours dans le même dépôt) | `git add todo/TODO.jsonl todo/TODO.md todo/TODO.html` puis `git push origin main` dans `c:\dev\digit-ai-factory` | l'autre poste ne voit ni les clôtures ni les constats |
| A-58 | Réécrire l'histoire de la forge de développement par le mode opératoire, protection levée puis remise, publier en force, rebâtir le clone, rejouer le commit de campagne 8029348 | TF-0829 (classe), neuve | auto_ia | dependance_bloc_3 (D-16) | `references\TODO-FORGE.md` § réécriture (TF-0752) puis `node bootstrap.mjs --rebatir ..\digit-ai-forge-development` | un domaine client reste public |
| A-59 | Supprimer les trois branches d'ancienne histoire et rejouer la porte sur les trois forges | neuve | auto_ia | dependance_bloc_3 (D-17) | `git branch -D sauvegarde/ancienne-histoire-20260907` dans `..\digit-ai-forge-{conception,organization,seo-geo}` puis porte | trois forges restent rouges à la porte sur ce poste |
| A-48 | Fusionner les tables selon vos six réponses, renommer mes fichiers libres, rejouer la porte sur le parc, rectifier les pseudonymes périmés au registre | neuve | auto_ia | dependance_bloc_3 (lecture humaine des six lignes) | `node scripts/fusionner-tables-confidentielles.mjs` après édition du canal | deux tables continuent de vivre |
| A-56 | Publier les commits des campagnes après vérification, forge par forge (ops et développement prêts, développement après A-58) | TF-0844, TF-0845, TF-0886 et items des campagnes en cours | auto_ia | gate_gouvernance (publication sur GO humain, règle 38) | `git push origin main` dans chaque forge, porte jouée avant | les corrections restent locales |
| A-60 | Décider les trois candidatures nées des rapports (règle T1 (moyen de vérification écrit, jamais vérifié) côté pilot ; boucle de self-test de forge-data ; chaînage TMDL → couverture) et les joindre à une campagne suivante | TF-0915, TF-0916, TF-0917 | auto_ia | gate_gouvernance (décision humaine sur candidature) | `node todo/journaliser.mjs --fichier <decisions.json>` après votre mot | un lot peut encore affirmer une règle de branche sans la lire |
| A-57 | Lire les six lignes du fichier d'arbitrage et inscrire par ligne `neuf`, `même` ou `écarter` | neuve | manuelle_utilisateur | decision : chaque ligne se tranche au vu d'un nom réel | ouvrir `c:\dev\_confidentiel\arbitrages\20260908-D13-fusion-tables-poste-A.md`, renseigner la colonne Décision, puis me dire « D-13 arbitré » | six pseudonymes restent ambigus entre les deux postes |
| A-52 | Supprimer le fichier `c:\dev\null` | neuve | manuelle_utilisateur | irreversible : supprimer un fichier est un geste humain (règle 29) ; contenu lu par deux sondes | `Remove-Item c:\dev\null` | un fichier parasite reste à la racine du parc |

Ordre : A-54 au fil des rapports, parce que chaque clôture non vérifiée est un item qui ment ; A-58 dès D-16, parce qu'un domaine client est public ; A-59 dès D-17, parce qu'elle ne coûte rien ; A-55 après la campagne pilot, parce que deux écrivains dans un même index se mêlent ; A-60 sur votre mot, parce qu'une candidature ne se décide pas seule ; A-48 dès vos six réponses ; A-56 en dernier, parce qu'elle publie ; A-57 et A-52 à votre convenance.

## 9. Traces

- `..\digit-ai-forge-ops` — 666b94b, 7b86064 (locaux) ; `..\digit-ai-forge-development` — 8029348 (local) ; `..\digit-ai-forge-tests` — 095ba72, 2581da7 ; `..\digit-ai-forge-design` — a79584d + trois fichiers en cours ; `..\digit-ai-forge-agents` — 8ab3d14 ; `..\digit-ai-forge-data` — 5c15870, 189b6c0.
- pilot — `todo\TODO.jsonl` (arbre de travail : 3 clôtures, 2 candidatures neuves), `REGLES-PROJET.md` et `references\ETAPES-RUN.md` modifiés par la campagne pilot (non commités) ; `output\04-plans\… - 20260908d.md` (cette synthèse).
- `c:\dev\_sauvegardes\digit-ai-forge-{conception,organization,seo-geo}-ancienne-histoire-20260907.bundle` — trois paquets vérifiés.
- scratchpad `campagne-d14\clotures-ops-development.json` — les trois clôtures ; `tasks\biayfaszq.output` — porte sur les quatorze dépôts.
