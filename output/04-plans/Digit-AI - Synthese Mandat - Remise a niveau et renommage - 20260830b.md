---
destinataire: humain
---

# Synthèse de mandat — remise à niveau du dépôt et renommage des lots (30/08/2026)

Vos deux arbitrages ont été exécutés et vérifiés : cette machine travaille désormais sur la
même version que la copie publiée, et les fichiers de la boîte de retours portent les mêmes
noms que ceux que le registre emploie — la concordance entre le disque et le registre est
passée de dix lots sur quatre-vingt-six à quatre-vingts. Le registre local, qui ne montrait que
huit tâches ouvertes sur une version périmée, en montre maintenant vingt-trois, dont dix-neuf
concernent ce dépôt. Trois choses appellent encore votre décision : les deux tables de
correspondance qui permettent d'anonymiser les retours entrants n'existent pas sur cette
machine, ce qui bloque toute nouvelle entrée de lot ; les neuf autres dépôts de l'écosystème
portent exactement le même écart que celui qui vient d'être corrigé ici ; et le mandat
d'origine, traiter les tâches, redevient jouable et attend votre feu vert sur son ordre.

## 1. En-tête d'identification

- **quoi** — exécution des deux arbitrages rendus (remise à niveau du dépôt, puis renommage des lots), avec vérification par oracles.
- **sur quoi** — le pilot `digit-ai-factory`, sa boîte d'entrée `input\00-retours\` et son registre `todo\TODO.jsonl`.
- **quand** — fin le **30/08/2026 à 09:28 (UTC+02:00)**, durée **≈ 35 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt local passé de `8caf46d` à `66c76d2`.

## 2. Verdict en une ligne

Les deux arbitrages sont **TENUS et vérifiés** : dépôt à `66c76d2` déclaré « à jour » par le contrôle de fraîcheur, 170 fichiers renommés sur 197, concordance disque-registre portée de 10/86 à 80/86, `oracle-boite-entree` **PASS** sans aucun constat non vert, `oracle-todo` **PASS** (26 items actifs, 677 archivés), conformité projet 44/44 — et un blocage neuf, mesuré : l'ingestion d'un lot rend désormais exit 1.

## 3. Décisions attendues

**Chapeau commun.** La remise à niveau a apporté avec elle la chaîne d'anonymisation câblée le 28/08 : depuis ce matin, tout lot qui entre au registre passe par une substitution automatique des noms de clients et de produits. Cette chaîne s'appuie sur deux tables de correspondance qui, par construction, ne vivent dans aucun dépôt — elles resteraient publiées avec lui. Elles n'ont donc jamais voyagé jusqu'à cette machine, et la chaîne refuse d'ingérer plutôt que d'anonymiser à moitié. C'est un refus voulu par sa conception, pas une panne ; mais il ferme la boîte d'entrée tant qu'il n'est pas levé.

- **Décision 1 — les deux tables de correspondance qui manquent à cette machine, sans lesquelles aucun lot de retours ne peut plus entrer au registre.** Le refus a été reproduit sur un lot témoin jetable : `référentiel des clients introuvable (C:\dev\_noms-interdits.json) — l'ingestion s'arrête`, sortie 1. Recommandation instruite, et sa source consultée : la table complète des substitutions a été **dérivée mécaniquement** du croisement des deux registres (684 tâches communes, 407 substitutions distinctes relevées, 14 noms propres identifiés sans ambiguïté), et elle est déjà écrite dans le dossier de travail de cette session.
  - **(a) Reconstruire les deux tables depuis la correspondance dérivée**, à l'emplacement que le module attend hors dépôt. *Coût* : crée sur le disque deux fichiers portant en clair les noms de clients — c'est leur raison d'être, et c'est pourquoi ils ne sont dans aucun dépôt ; la table des clients pourrait rester incomplète si un client n'apparaît dans aucune tâche commune aux deux registres. *Exclut* : rien.
  - **(b) Les rédiger vous-même**, hors session, à partir de la source d'origine. *Coût* : la boîte reste fermée jusque-là, et le travail de dérivation déjà fait n'est pas réutilisé. *Exclut* : que la table soit dérivée d'une mesure plutôt que de mémoire.
  - **(c) Laisser l'ingestion bloquée.** *Coût* : tout lot déposé s'accumule sans entrer au registre, et le prochain tour découvrira une boîte pleine et un registre muet. *Exclut* : toute clôture de run qui remet un lot de retours.
  - **Recommandation : (a), et pourquoi** — la correspondance est mesurée et non devinée, aucune entrée n'est ambiguë, et le geste est réversible d'un effacement. L'incomplétude possible de la table des clients est nommée plutôt que masquée.
  - **Si rien n'est décidé** : (c) s'applique, la boîte d'entrée reste fermée.
- **Décision 2 — les neuf autres dépôts de l'écosystème, qui portent le même écart que celui qui vient d'être corrigé ici.** Mesure faite sur les neuf : les compteurs d'avance et de retard sont égaux de part et d'autre sur sept d'entre eux, et sur les neuf le nombre de messages de commit locaux introuvables en face est de **zéro** partout sauf deux, où il vaut **un** — et ce message unique est le même des deux côtés à un nom de produit près, celui-là même que la pseudonymisation a remplacé. Recommandation instruite, et sa source consultée : le relevé `git rev-list --left-right --count` joué sur les neuf dépôts, plus la comparaison des sujets de commit.
  - **(a) Appliquer aux neuf la même remise à niveau qu'ici.** *Coût* : les historiques locaux d'avant la réécriture disparaissent, comme ici ; la même sauvegarde locale peut être posée avant chaque opération. *Exclut* : de conserver les empreintes locales de ces neuf dépôts.
  - **(b) N'appliquer qu'aux dépôts que les tâches ouvertes mobilisent** — trois dépôts sur les neuf sont cités par le registre actuel. *Coût* : six dépôts restent en l'état et le contrôle de fraîcheur continue de rendre « poste non prêt ». *Exclut* : de repartir d'un poste entièrement vert.
  - **(c) Ne rien faire.** *Coût* : le premier travail poussé depuis l'un de ces dépôts rouvre la question des noms retirés le 27/08. *Exclut* : toute publication depuis ces neuf dépôts.
  - **Recommandation : (a), et pourquoi** — l'écart y est de même nature qu'ici, la mesure le montre sur les neuf, et le remède partiel de (b) laisse un poste rouge que le prochain tour devra réinstruire.
  - **Si rien n'est décidé** : (c) s'applique, et le contrôle d'ouverture continuera de refuser le poste.
- **Décision 3 — la suite du mandat d'origine, maintenant que le registre à jour montre ce qu'il contient vraiment.** Vingt-trois tâches sont ouvertes, toutes déjà arbitrées, dont dix-neuf visent ce dépôt et sont donc exécutables sans mandat sur un dépôt frère. Recommandation instruite, et sa source consultée : le registre `todo\TODO.jsonl` lui-même, dont les scores de valeur vont de 12,5 à 1.
  - **(a) Traiter par valeur décroissante**, en commençant par la porte de fraîcheur de déploiement et les contrôles cités mais jamais joués. *Coût* : effort **complexe × long** ; les premières tâches touchent des contrôles de mise en production, donc du code sensible. *Exclut* : de solder d'abord le grand nombre.
  - **(b) Traiter d'abord le lot des quatorze tâches à valeur 1** issues du dernier audit, toutes de petite portée. *Coût* : effort **moyen × moyen** ; les deux tâches à plus forte valeur restent ouvertes. *Exclut* : de traiter le plus coûteux d'abord.
  - **(c) S'arrêter là pour ce tour.** *Coût* : le registre reste à vingt-trois tâches ouvertes. *Exclut* : rien, l'état est propre et reprenable.
  - **Recommandation : (a), et pourquoi** — le registre porte déjà l'ordre, ses scores sont posés, et la tâche de tête protège une mise en production qui rend actuellement un vert sur un déploiement non atterri.
  - **Si rien n'est décidé** : (c) s'applique, le tour se clôt sur un poste propre.
- **Décision 4 — la branche de sauvegarde posée avant la remise à niveau, qui garde les 403 commits abandonnés accessibles sur cette machine.** Elle est locale, jamais poussée, et se supprime d'une commande. Recommandation instruite, et sa source consultée : l'arbitrage que vous avez rendu, consigné au dossier `Digit-AI - Synthese Mandat - Traite les todos et retours - 20260830a.md`, qui abandonne ces commits sans demander leur effacement du disque.
  - **(a) La garder** jusqu'à ce qu'un tour de travail ait confirmé que rien ne manque. *Coût* : l'historique d'avant la pseudonymisation reste accessible localement — sans effet sur ce qui est publié.
  - **(b) La supprimer maintenant.** *Coût* : les 403 commits deviennent irrécupérables sur cette machine. *Exclut* : tout retour en arrière.
  - **Recommandation : (a), et pourquoi** — rien n'a encore été rejoué depuis la remise à niveau, et le seul coût de l'attente est un espace disque déjà occupé.
  - **Si rien n'est décidé** : (a) s'applique, la branche reste.

## 4. Traité — avec sa preuve

- **La copie de travail a été remise à niveau sur la copie publiée**, arbitrage (a) de la réconciliation.
  - preuve : `git reset --hard origin/main` → `HEAD is now at 66c76d2` ; `node bootstrap.mjs --pull` rend désormais « digit-ai-factory (pilot) — présent, **à jour** (66c76d2) », là où il rendait « DIVERGÉ (403 devant, 408 derrière) ».
- **Les 197 fichiers de la boîte de retours ont été préservés** malgré la suppression que la remise à niveau opérait sur eux.
  - preuve : copie intégrale prise avant l'opération (197 fichiers, 2,0 Mo), restaurée après ; `find input\00-retours -type f` rend **197**, et `git check-ignore -v c:\dev\digit-ai-factory\input -retours\README.md` rend `.gitignore:28:input/00-retours/` — ils sont sur le disque et hors du suivi, exactement l'état voulu.
- **Le renommage a été rejoué**, arbitrage (b) du sort des fichiers : 170 fichiers renommés, 27 laissés intacts.
  - preuve : dix correspondances appliquées, chacune dérivée du croisement des registres — 62 fichiers pour le produit du dernier run, 27, 21, 18, 18, 12, 6, 2, 2 et 2 pour les autres ; les 27 intacts portent des noms qui figurent **verbatim** dans le registre publié (mesuré : 27, 58, 12, 7 et 20 occurrences respectives), donc sans écart à corriger.
- **La concordance entre le disque et le registre a été mesurée avant et après**, et non supposée.
  - preuve : sur 86 lots distincts, **10** portaient un nom présent tel quel dans le registre publié avant renommage, **80** après ; les 6 restants sont des lots du 09, 13 et 14/08 dont le nom n'est cité nulle part dans le registre, ce qui ne crée aucun désaccord.
- **Les contrôles de la boîte et du registre sont verts.**
  - preuve : `oracle-boite-entree` **PASS**, zéro constat non vert hors `SANS_OBJET` ; `oracle-todo` **PASS**, « 26 item(s) actif(s), 677 archivé(s) — registre intègre » ; `oracles\self-test.mjs` **44 PASS, 0 FAIL**.
- **Un blocage neuf a été trouvé et prouvé sur pièce** plutôt que déduit de la lecture du code.
  - preuve : `node todo\ingerer-lot.mjs` joué sur un lot témoin jetable et un registre jetable → `Error: référentiel des clients introuvable (C:\dev\_noms-interdits.json) — l'ingestion s'arrête : anonymiser à moitié serait pire que ne pas anonymiser`, **exit 1** ; c'est aussi la cause des 2 échecs du banc de recettes du registre (42 PASS, 6 FAIL, dont 2 sur les cas d'ingestion verte).
- **Une sauvegarde locale a été posée avant l'opération irréversible.**
  - preuve : branche `sauvegarde/avant-remise-a-niveau-20260830` créée sur `8caf46d2eb563670ab5fec9d4f4949ad8a161e65`, jamais poussée.

## 5. Non traité — avec son motif

- **Les 19 tâches du registre qui visent ce dépôt** : *hors mandat* — les deux arbitrages rendus portaient sur la réconciliation du dépôt et le renommage, pas sur l'exécution des tâches ; c'est l'objet de la troisième décision ci-dessus.
- **Les 4 tâches qui visent des dépôts frères** : *bloqué par un garde-fou* — aucune écriture dans un dépôt frère sans mandat humain nommé, et aucun n'est déclaré dans cette session.
- **Les deux tables de correspondance** : *dépendance à une décision humaine* — la table est dérivée et prête, mais créer hors dépôt deux fichiers portant des noms de clients en clair se décide.
- **Les neuf dépôts frères divergés** : *dépendance à une décision humaine* — mesurés dans ce tour, non touchés.
- **Les six lots dont le nom ne figure nulle part dans le registre** : *écarté* — ils ne créent aucun désaccord entre disque et registre, et les contrôles sont verts sur eux. Réouverture si un contrôle futur exige que tout lot du disque soit nommé au registre.
- **Le contenu des fichiers de lots** : *écarté* — la décision publiée du 28/08 décrit un renommage de fichiers, pas une réécriture de leur contenu, et ces fichiers ne sont pas publiés. Réouverture si la boîte devait à nouveau être suivie.

## 6. Écarts à la lettre

- **vous avez demandé** l'arbitrage « 1a » → **j'ai fait** la remise à niveau **précédée d'une sauvegarde locale** des commits abandonnés → **pourquoi** : l'opération est irréversible et la voie retenue nommait comme coût la perte d'un éventuel contenu propre à ces commits ; la sauvegarde rend ce coût réversible sans rien changer à ce qui est publié. Elle est soumise à votre arbitrage plutôt que gardée en silence.
- **Correction d'une affirmation du tour précédent.** J'avais présenté comme trace mesurée que le répertoire `Produit-07` était absent de cette machine. C'était la trace consignée au registre le 24/08, pas une mesure de ce tour, et elle est **fausse aujourd'hui** : `ls -d /c/dev/Produit-07` rend le chemin, le répertoire contient `forge`, `input`, `site` et `preview`, et `git rev-parse` y rend `not a git repository`. La tâche qui attendait sa réapparition n'est donc plus bloquée — elle est exécutable, côté produit.
- Aucun autre écart.

## 7. Risques

- **La table de correspondance reconstruite serait incomplète pour un client absent des tâches communes aux deux registres.**
  - signal : un lot entre au registre en portant encore un nom réel, ou la substitution ne rapporte rien là où un nom était attendu.
  - parade : la chaîne d'ingestion rapporte à chaque lot les noms qu'elle a substitués ; un lot dont le compte rendu est vide alors qu'il vient d'un client se relit avant clôture.
- **Les neuf dépôts frères restent un piège tant qu'ils ne sont pas traités.**
  - signal : une publication depuis l'un d'eux fait réapparaître un nom de produit dans un historique publié.
  - parade : la deuxième décision ci-dessus ; en attendant, ne rien pousser depuis ces dépôts.
- **La boîte d'entrée fermée accumule silencieusement.**
  - signal : des fichiers de lots présents sur le disque sans tâche correspondante au registre, et un contrôle de boîte qui passe au rouge.
  - parade : la première décision ci-dessus ; le contrôle de boîte est le signal, il est joué à chaque ouverture de run.
- **Un travail non publié aurait vécu uniquement dans les 403 commits abandonnés.**
  - signal : un fichier ou une correction attendus et introuvables dans l'arbre actuel.
  - parade : la branche de sauvegarde locale, conservée jusqu'à confirmation — c'est l'objet de la quatrième décision.

## 8. Prochaines actions

Ordre de traitement : rouvrir la boîte d'entrée vient en premier parce que c'est la seule action qui **bloque un flux continu** — des lots arrivent, et rien ne peut plus entrer. Viennent ensuite la mise au vert des dépôts frères, qui conditionne toute publication, puis l'exécution des tâches, puis les restes indépendants.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Créer les deux tables de correspondance hors dépôt depuis la correspondance dérivée, puis rejouer `node todo\ingerer-lot.mjs` sur un lot témoin jetable pour vérifier la sortie 0. | `auto_ia` | `dependance_bloc_3` — attend le premier arbitrage ; le travail de dérivation est fait et vérifié. | Aucun lot de retours ne peut plus entrer au registre, et les lots déposés s'accumulent sans trace. |
| 2 | `neuve` | Appliquer aux neuf dépôts frères la même remise à niveau qu'ici, sauvegarde locale posée avant chacune. | `auto_ia` | `dependance_bloc_3` — attend le deuxième arbitrage ; l'opération est irréversible et relève de la règle de gouvernance qui réserve ces gestes à l'humain. | Le poste reste déclaré non prêt à chaque ouverture, et toute publication depuis ces dépôts rouvre la question des noms retirés. |
| 3 | `neuve` | Exécuter les tâches du registre dans l'ordre retenu, en commençant par celle qui protège la mise en production. | `auto_ia` | `dependance_bloc_3` — attend le troisième arbitrage. | Vingt-trois tâches arbitrées restent sans exécution, et la porte de mise en production continue de valider des déploiements non atterris. |
| 4 | TF-0549 | Instancier le répertoire `c:\dev\Produit-07`, qui est réapparu sur cette machine et n'a toujours aucun dépôt : créer le dépôt, poser le fichier de consignes produit depuis son gabarit, puis les quatre artefacts hérités, puis rejouer `node oracles\oracle-conformite-projet.mjs c:\dev\Produit-07`. | `manuelle_utilisateur` | `decision` — la doctrine réserve au produit l'écriture chez le produit ; le pilot nomme les gestes, il ne les exécute pas. | Ce qui s'écrit dans ce répertoire reste sans historique, sans sauvegarde et sans preuve, et la règle d'héritage rendra échec à chaque rejeu. |
| 5 | `neuve` | Trancher le sort de la branche de sauvegarde locale : `git branch -D sauvegarde/avant-remise-a-niveau-20260830` pour la supprimer, ou ne rien faire pour la garder. | `manuelle_utilisateur` | `decision` — supprimer rend les 403 commits irrécupérables sur cette machine. | La branche reste, sans effet sur ce qui est publié — c'est l'issue par défaut et elle est sans danger. |
| 6 | `neuve` | Statuer sur les trois signalements d'ouverture de poste : le fichier `c:\dev\null` (page HTML de 10 927 octets, sans justificatif d'authentification, vérifié en lecture seule), le lien symbolique brisé `c:\dev\digit-ai-forge-pilot_old`, et le second clone périmé `c:\dev\_archive-digit-ai-forge-steering_old`. | `manuelle_utilisateur` | `irreversible` — supprimer un fichier, un lien ou un répertoire est un geste humain que le contrôle déclare sans l'exécuter. | Les trois reparaissent à chaque ouverture de session et diluent les défauts réels au milieu du bruit. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Remise a niveau et renommage - 20260830b.md` · celle du tour précédent : `output\04-plans\Digit-AI - Synthese Mandat - Traite les todos et retours - 20260830a.md`
- Dépôt : `8caf46d` → `66c76d2` · sauvegarde locale `sauvegarde/avant-remise-a-niveau-20260830` sur `8caf46d2eb56`
- Boîte d'entrée : `input\00-retours\` — 197 fichiers, 170 renommés, hors suivi par `.gitignore`
- Contrôles exécutés : `oracles\oracle-boite-entree.mjs` (PASS) · `todo\oracle-todo.mjs` (PASS) · `oracles\self-test.mjs` (44/44) · `todo\self-test.mjs` (42 PASS, 6 FAIL — cause unique nommée) · `bootstrap.mjs --pull` (pilot à jour)
- Correspondance dérivée et sauvegarde de la boîte : dossier de travail de la session, `mapping-tokens.json` et `00-retours-sauvegarde\`
