---
destinataire: humain
---

# Synthèse de mandat — les retours sont tous pris, et le registre passe de 87 candidatures à 3 (14/09/2026)

Tous les retours reçus sont pris. Presque tout le registre des améliorations est traité : il restait 87 candidatures ce matin, il en reste 3, et les items clos passent de 176 à 265, dans le pilot et dans huit forges sœurs. Chaque correction a été rejouée ici avant d'être inscrite, et toutes les campagnes sont terminées. Rien n'est publié : le travail vit en commits locaux sur ce poste. Quatre décisions vous reviennent, et le feu vert de publication viendra après elles.

## 1. En-tête d'identification

- **quoi** : mandat humain « Traite tous les todos & retours ». Réconciliation de la boîte d'entrée, décision des candidatures, cinq études d'opportunité, six campagnes de correction et leurs reprises, sondage de chaque rapport, clôtures au registre.
- **sur quoi** : la boîte d'entrée et le registre du pilot ; huit forges sœurs (outils, design, données, audit, tests, développement, exploitation, conventions) ; le produit marketing, lu sans écriture.
- **quand** : 2026-09-14, de 12:50 à environ 19:10 UTC+02:00 (Europe/Paris), soit environ 6 h 20.
- **qui** : pilot digit-ai-factory ae088c9, avec `todo/journaliser.mjs`, `todo/ingerer-lot.mjs`, `todo/reempreinter-lot.mjs`, `todo/oracle-todo.mjs`, `oracles/oracle-boite-entree.mjs`, `oracles/oracle-etude-opportunite.mjs`, `oracles/oracle-empreintes.mjs` ; sept agents sous `gabarits/AGENT-CAMPAGNE.md` (Opus pour les outils et le pilot, Sonnet pour les autres).

## 2. Verdict en une ligne

**Registre : candidats 87 → 3, décidés 37 → 21, en cours 14 → 36, clos 176 → 265, écartés 0 → 3, `oracle-todo` PASS ; boîte d'entrée FAIL (5 constats) → PASS (0) ; 98 décisions, 89 clôtures et 29 passages en cours journalisés ; 12 constats du jour inscrits, dont 11 déjà corrigés ; 46 commits locaux sur 8 forges à arbre propre et 34 au pilot, tous rejoués ici ; 0 publication.**

## 3. Décisions attendues de l'humain

Les quatre décisions portent sur ce que les campagnes ont laissé en attente de vous. Chacune a une option recommandée, et l'option par défaut ne casse rien : elle laisse une situation en l'état.

> **D-10 — Faut-il écraser, à la fin du mandat, les copies installées des skills par l'état sondé et commité ?**
>
> La propagation qui s'exécutait à chaque ouverture de session a recopié des états intermédiaires des skills pendant les campagnes. Le pilot l'a corrigée, et elle ne recopie plus une source non publiée. Mais les copies intermédiaires sont restées installées sur ce poste, et l'une d'elles fait rougir une fixture du design.
>
> **Recommandation : (a).** Source consultée : la règle de propagation des skills (le contrôle qui compare copies installées et versions du dépôt) de `gabarits/AGENT-CAMPAGNE.md` (TF-0391), qui réserve cette décision à l'humain.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Propager l'état sondé et commité, rejouer le contrôle, puis resceller la fixture du design | une commande, le rejeu du contrôle et un rescellement, environ 15 min | rien : l'état installé devient celui qui a été vérifié |
| (b) Restaurer les copies installées depuis la dernière version publiée, et ne propager qu'après publication | environ 10 min, puis une propagation après votre feu vert | les corrections du jour sur ce poste jusqu'à la publication |
| (c) Ne rien décider | rien | la concordance entre ce qui est versionné et ce qui s'exécute |

> **Si rien n'est décidé** : (c). Les copies intermédiaires restent installées jusqu'à la publication, et la fixture du design reste rouge.

> **D-11 — Faut-il reporter les 16 items du pilot qui touchent le juge des restitutions, le contrôle d'ouverture de session ou le référentiel des classes, jusqu'à ce que la session voisine ait enregistré son travail ?**
>
> Une autre session du pilot a modifié ces fichiers, dont une correction du juge des restitutions, et attend votre feu vert pour les enregistrer. Si ma campagne les modifiait aussi, mon enregistrement emporterait son travail non validé avec le mien.
>
> **Recommandation : (a).** Source consultée : la section Git du contrat de campagne (`gabarits/AGENT-CAMPAGNE.md`), qui interdit de toucher aux fichiers modifiés d'une session vivante.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Reporter ces 16 items après l'enregistrement de la session voisine | un second passage de campagne, complexité moyenne × environ 1 h 15 | rien : le report prend fin avec votre feu vert à la session voisine |
| (b) Les traiter maintenant en enregistrant les deux travaux ensemble | aucun délai | la séparation des deux travaux |
| (c) Les laisser ouverts sans date | rien | 16 corrections du juge, de la doctrine et du contrôle d'ouverture |

> **Si rien n'est décidé** : (c). Les 16 items restent ouverts.

> **D-12 — Faut-il construire maintenant l'intégration continue du pilot sous une forme inactive, et ne l'activer que sur votre accord séparé ?**
>
> Aujourd'hui, rien ne rejoue la recette du pilot quand il est publié. L'étude du socle de la chaîne recommande un circuit minimal. Mais un circuit posé à l'emplacement habituel s'exécuterait sur le service hébergé dès la prochaine publication, c'est-à-dire sans votre accord.
>
> **Recommandation : (a).** Source consultée : l'étude du socle de la chaîne (option O3, décidée sous réserve) et la règle R-38 (toute publication sur un service hébergé attend un feu vert humain) du noyau `CLAUDE.md`.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Construire le circuit hors de l'emplacement actif, puis l'activer par un geste distinct sur votre accord | complexité faible × environ 45 min, puis un déplacement de fichier | rien : le circuit est prêt et vérifiable, mais inactif |
| (b) Le construire directement actif | complexité faible × environ 45 min | la séparation entre publier le pilot et activer un service hébergé |
| (c) Ne rien construire | rien | toute vérification de la recette du pilot à la publication |

> **Si rien n'est décidé** : (c). Le pilot continue d'être publié sans que rien ne rejoue sa recette.

> **D-13 — Faut-il porter de 100 à 135 caractères le plafond de longueur de ligne que vous aviez fixé le 12/09, pour qu'il soit compatible avec la largeur de lecture des chapitres ?**
>
> Deux règles du socle des pages ne peuvent pas être tenues ensemble : la largeur de lecture des chapitres, 1 080 pixels, et le plafond de 100 caractères par ligne fixé par votre décision du 12/09. L'étude recommande de garder la largeur et de relever le plafond. Relever un plafond que vous avez fixé revient à assouplir une règle humaine, et ce n'est pas à moi de le faire.
>
> **Recommandation : (a).** Source consultée : l'étude des lots de travaux et du style (option O1 puis O2) ; la règle de précédence du noyau (`CLAUDE.md`, R-43 : renforcer oui, assouplir jamais) m'interdit de le décider seul.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) Relever le plafond à 135 caractères et garder la largeur de 1 080 pixels | complexité faible × environ 30 min, dans le pilot puis dans le socle des pages | la ligne de 100 caractères comme cible de lisibilité |
| (b) Garder 100 caractères et réduire la largeur de lecture des chapitres | complexité moyenne × environ 1 h, avec les pages existantes à revoir | la largeur actuelle, la plus répandue dans le socle |
| (c) Laisser les deux règles en conflit | rien | toute page conforme aux deux règles à la fois |

> **Si rien n'est décidé** : (c). Aucune page ne peut satisfaire les deux règles : l'une ou l'autre la refuse toujours.

## 4. Traité, avec sa preuve

- **Retours : la boîte d'entrée est réconciliée.** Cinq lots du 11/09 étaient entrés au suivi déjà anonymisés ; ils sont rattachés à leur ingestion réelle par rapprochement de titres. Classe : un lot anonymisé avant son suivi n'a aucune version d'avant.
  - preuve : `reempreinter-lot.mjs --par-rapprochement` → CONSIGNE sur les 5 ; `oracle-boite-entree.mjs` passe de « FAIL, 5 constats B2 » à PASS.
- **Décisions : 98 candidatures décidées.** 72 sous le seuil d'étude, 12 sur le verdict de cinq études d'opportunité jugées ici, les autres constats du jour et deux candidatures de la session voisine ; une vous est renvoyée (D-13) parce qu'elle assouplirait une règle humaine, et trois items sont écartés avec leur motif (un doublon, une erreur de mesure, une cible hors de l'écosystème versionné).
  - preuve : `oracle-etude-opportunite.mjs` → PASS sur les 5 études ; `journaliser.mjs` → 98 événements « decide », `oracle-todo` PASS avant et après chaque lot.
- **Corrections : 89 items portés au statut corrigé**, chacun avec la façon dont sa correction redescend chez les producteurs, et 12 d'entre eux étaient livrés depuis des jours sans événement de clôture. Contrôle rouge → vert : chaque item porte au registre le sien, une fixture rouge qui échoue avant la correction et passe après. Classe dominante : un contrôle qui accuse ce que le socle impose, ou qui mesure une grandeur voisine de son invariant. Preuve d'ensemble : `journaliser.mjs` → 89 événements « corrige », `oracle-todo` PASS, et chaque campagne rejouée ici sur une extraction de son état commité, comme suit.
  - preuve socle des pages et oracles : `self_test.py` → « 300/300 cas passés » (264 au départ), skill des oracles « PASS (259 contrôles) » (254), hameçons « 28 PASS, 0 FAIL » (23).
  - preuve données, audit, exploitation : « 269 PASS, 0 FAIL » (229), audit « 12/12 étape(s) … toutes vertes » et fiche « 16/16 PASS », exploitation « 111 PASS, 0 FAIL » (100).
  - preuve développement, tests, design : « recette locale : 5/5 », tableau de bord des tests vert au test ciblé (8 cas) et à la recette de rendu, dette « 235 entrées, aucun écart », fixtures des items du design rouge et verte avec les seuls échecs externes connus.
  - preuve pilot : registre « 55 PASS, 0 FAIL », harnais « 2/111 oracle(s) en défaut », les deux nés hors campagne.
- **Un incident de propagation, établi dans le code puis corrigé.** L'ouverture de chaque session lançait la mise à jour du poste, qui recopiait les skills en présumant une décision humaine. Classe : un automate qui présume une décision humaine.
  - preuve : `.claude/settings.json` (SessionStart) → `oracles/hook-ouverture.mjs` → `bootstrap.mjs --pull`, dont la ligne 16 disait « lancer --pull EST la décision humaine de propagation » ; après la correction 53ed2ba, `node bootstrap.test.mjs` → « bootstrap : 15/15 ».
- **Le hook du lexique ne détourne plus un tour sur un faux mot-clé.** Il s'était déclenché deux fois sur des rapports d'agents, sur un numéro de ligne « L99 » puis sur un nom de skill. Classe : un faux positif qui injecte une consigne impérative.
  - preuve : correction 55052d9, `node oracles/hook-lexique.test.mjs` → « 6 PASS, 0 FAIL ».
- **Deux clôtures mises en doute, vérifiées contre la bonne source.** Un test déclaré « préexistant » lisait un contrôle dans la copie installée ; une clôture reposait sur un test ciblé. Classe : une preuve d'antériorité qui ne remet pas en arrière tout ce que le test lit.
  - preuve : `check_html.py` extrait de 38310c7 → exit 1 et 7 constats L30 ; recette du corpus des tests sur 5fdea1c → « 1 failed, 1373 passed », sur 259dd63 → plus aucun échec pytest ; défaut voisin daté par `git log -S` au 14/08 (506efce), puis corrigé en ae9e2a6.
- **Douze constats du jour inscrits au registre (TF-1099 à TF-1110)**, du hook de propagation au rendu du tableau de bord des tests ; onze sont déjà corrigés, et l'ingestion a compté quatre récidives de classes closes — c'est la mesure de la descente, pas un refus.
  - preuve : `ingerer-lot.mjs` → six lots ingérés, avec les lignes « [RÉCIDIVE] » affichées ; le dernier, rendu du tableau de bord, clos sur 8bd2387 après rejeu ici (arbre propre, `tests/test_tf_0117.py` vert, 8 cas) ; `oracle-todo` PASS.
- **Le site de scellement neuf du design est déclaré** dans la table des empreintes du pilot.
  - preuve : commit ae088c9, 1 fichier ; `oracle-empreintes.mjs` passe de 2 sites non déclarés à 1, puis à PASS quand la session voisine a levé le second (son banc employait sha256 comme graine de mélange, non comme sceau).

## 5. Non traité, avec son motif

- **3 candidats restent ouverts** — motif : l'arbitrage de lisibilité attend D-13, et la rotation des secrets publiés comme l'héritage manquant de onze produits demandent des gestes chez les produits, sans mandat d'écriture déclaré.
- **21 items décidés restent en attente** — motif : 16 d'entre eux touchent des fichiers réservés à la session voisine et dépendent de D-11 ; les autres attendent un produit, un projet réel, D-10 ou D-12.
- **36 items sont en cours, chacun avec un reste écrit** : une étude pour un oracle neuf, un plan chiffré pour un gros chantier, une part chez un autre dépôt, ou un run réel.
  - les trois constructions décidées par vous le 11/09 (référentiel d'appel d'offres, rendu de documents, barres externes) — motif : leur taille dépasse une campagne partagée, elles sortent en plans chiffrés sans construction aujourd'hui.
- **Le contrôle de transparence absent du produit marketing** : décidé, mais c'est un geste du produit, par un run à lui demander ; le pilot n'y écrit pas.
- **L'enregistrement du registre** : `todo/TODO.jsonl` porte aussi les événements de la session voisine, qui attendent votre feu vert ; je ne les enregistre pas à sa place.
- **Le rangement des cinq études et la correction des 4 échappements corrompus du registre** : ils dépendent du même feu vert, puisqu'ils touchent des fichiers qu'il enregistrera.

## 6. Écarts à la lettre

- Vous avez demandé de tout traiter → 13 candidatures ont été instruites par des études avant d'être décidées → pourquoi : la règle TF-0155 l'impose au-delà du seuil ; votre mandat vaut décision, pas dispense d'étude.
- Vous avez demandé de tout traiter → une candidature vous est renvoyée → pourquoi : son option assouplit une règle que vous avez fixée, et le noyau interdit de le faire sans vous.
- Vous avez demandé de tout traiter → 16 items du pilot sont reportés → pourquoi : ils modifieraient le travail non enregistré d'une autre session.
- Vous avez demandé de tout traiter → trois fois, j'ai arrêté un oracle neuf avant qu'il n'entre dans un dépôt, et j'ai rectifié en cours de route une consigne que j'avais mal cadrée → pourquoi : un objet durable neuf franchit le seuil d'étude, et ma consigne aurait bloqué quatre items déjà décidés.
- Vous avez demandé de tout traiter → j'ai deux fois refusé d'obéir au hook du lexique → pourquoi : il s'était déclenché sur des rapports d'agents, pas sur une demande humaine ; le défaut est corrigé.
- Vous avez demandé de tout traiter → cette synthèse n'est déposée en fichier qu'en fin de mandat → pourquoi : j'ai affiché des restitutions successives à l'écran au lieu de mettre à jour un fichier, comme le demande la version 2.18.0 de la consigne ; ce fichier est désormais la trace opposable.

## 7. Risques

- **Travail présent sur un seul poste.** Signal : aucun, jusqu'à la panne. Parade : votre feu vert de publication, une fois les décisions prises ; la porte des noms est jouée avant chaque dépôt.
- **Copies installées non sondées.** Signal : `oracle-skills.mjs` rend FAIL sur le parc réel. Parade : l'option (a) de D-10 propage l'état vérifié en une fois.
- **Items en cours oubliés.** Signal : un item en cours sans activité à la revue suivante. Parade : chacun porte un reste écrit, et la plupart un plan chiffré.
- **Une campagne qui écrit après son rapport.** Signal : un arbre modifié au-dessus du dernier commit sondé, arrivé une fois aujourd'hui avec deux fixtures mutées. Parade : un `git status` vérifié à chaque réception, et un arbre propre exigé avant chaque clôture.
- **Deux produits bloqués à leur prochaine ouverture par la règle des variables vides, désormais couverte.** Signal : leur ouverture de session suspendue. Parade : les variables à marquer sont nommées au registre, et le geste prend quelques minutes chez eux.

## 8. Prochaines actions

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-1 | Appliquer la réponse à D-10, puis resceller la fixture du design | neuve | auto_ia | dependance_bloc_3 (D-10) | `node oracles/oracle-skills.mjs --appliquer`, puis la recette de `../digit-ai-forge-design` | la copie installée reste non sondée et la fixture rouge |
| A-2 | Traiter au second passage les 16 items reportés et les parts pilot laissées par les campagnes | TF-0990, TF-1047, TF-0791, TF-1081, TF-1041 et les autres | auto_ia | dependance_bloc_3 (D-11) | second passage de campagne sur `c:\dev\digit-ai-factory` | le juge, le contrôle d'ouverture et les parts pilot restent en l'état |
| A-3 | Construire l'intégration continue et appliquer l'arbitrage de lisibilité selon les réponses | TF-1018, TF-1069 | auto_ia | dependance_bloc_3 (D-12, D-13) | campagne sur le pilot, puis sur `../digit-ai-forge-agents` | pas de vérification à la publication, et deux règles en conflit |
| A-4 | Ranger les études, corriger les échappements du registre, régénérer les vues et enregistrer le tout avec le travail voisin | TF-1067, TF-1099 | auto_ia | dependance_externe (feu vert humain attendu par la session voisine) | `node todo/generer-vue.mjs`, `node todo/generer-page.mjs`, puis `git commit --only -- todo/ output/03-etudes/ input/01-candidatures/constat*-20260914?.tf.jsonl` | le registre du jour n'existe que sur ce poste, non enregistré |
| A-5 | Aligner la version de ruff du poste sur celle épinglée par la forge des tests | neuve | manuelle_dev | acces : installer un outil au poste est un geste d'environnement ; mesuré ici « ruff joue 0.15.21 alors que le depot epingle 0.16.1 » | `uv tool install ruff==0.16.1`, puis la recette de `../digit-ai-forge-tests` | la recette de cette forge reste rouge sur ce poste pour une raison d'environnement |
| A-6 | Relire le prochain run hébergé Linux de l'audit pour trancher le correctif de police | TF-1020 | manuelle_dev | presence : le rendu Linux ne se joue pas sur ce poste Windows ; la recette mesurée ici rend « Roboto ABSENTE », sans exécuteur Linux disponible | page des runs de `../digit-ai-forge-audit` chez l'hébergeur, après publication | le défaut de deux pages reste non prouvé et non corrigé |
| A-7 | Donner le feu vert de publication des neuf dépôts, une fois vos décisions prises | neuve | manuelle_utilisateur | decision : R-38 réserve la publication au feu vert humain | répondre « publie » dans cette conversation ; l'agent joue alors la porte des noms puis `git push origin main` dans chaque dépôt | 80 commits restent sur ce seul poste |

Ordre : A-1, A-2 et A-3 dès vos réponses à D-10, D-11, D-12 et D-13, parce que plus rien d'autre n'est en cours ; A-4 après votre feu vert à la session voisine, pour enregistrer le registre en une fois ; A-7 ensuite, parce qu'on ne publie que ce qui a été sondé ; A-5 quand vous voulez, elle ne bloque rien ; A-6 après la publication, qui seule déclenche le run Linux.

## 9. Traces

- `todo/TODO.jsonl` : 98 décisions, 89 clôtures, 3 écartements, 29 passages en cours, 14 créations et 11 ingestions de ce mandat, non enregistrés.
- `input/01-candidatures/` : `constats-campagnes-mandat-20260914c.tf.jsonl`, `constats-sondages-mandat-20260914d.tf.jsonl`, `constat-anneau-raccourci-20260914e.tf.jsonl`, `constat-legende-cas-derives-20260914f.tf.jsonl`, `constat-rendu-tableau-de-bord-20260914g.tf.jsonl`.
- `references/EMPREINTES.md` : commit ae088c9.
- Commits locaux, aucun publié : pilot 33 de campagne (228debc à 3d51ee6) plus ae088c9 ; `../digit-ai-forge-agents` 13 (jusqu'à d059cb4) ; `../digit-ai-forge-design` 8 (06d8074) ; `../digit-ai-forge-data` 7 (01980e1) ; `../digit-ai-forge-audit` 6 (ff1549f) ; `../digit-ai-forge-tests` 5 (8bd2387) ; `../digit-ai-forge-development` 4 (e3b3d3b) ; `../digit-ai-forge-ops` 2 (2fe5f3d) ; `../digit-ai-forge-organization` 1 (487c6fc).
- Scratchpad de session : `etudes/` (cinq études PASS, à ranger dans `output/03-etudes/`), fichiers de clôtures, extractions rejouées.
- Ce fichier : `output/04-plans/Digit-AI - Synthese Mandat - Traite tous les todos et retours registre de 87 candidats a 3 - 20260914f.md`.
