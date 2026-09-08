---
destinataire: humain
---

# Synthèse de mandat — tous les retours sont pris et la boîte d'entrée est verte pour la première fois de la journée ; les soixante-cinq todos ouverts sont décidés et cinq campagnes travaillent dessus (08/09/2026)

Votre demande de tout traiter est engagée sur les deux fronts. Côté retours, la boîte d'entrée rendait douze lots « jamais ingérés » alors qu'ils l'avaient été le matin même : c'est leur pseudonymisation qui avait changé leur identité, et le lien avec le registre était cassé. Chacun a été rattaché à son ingestion réelle, un treizième lot édité après coup a été réconcilié par son contenu, et le contrôle de la boîte est vert. Côté todos, les soixante-cinq items encore ouverts sont désormais tous décidés et répartis entre huit dépôts, sur lesquels cinq campagnes travaillent en parallèle. Rien n'est publié : leurs corrections vivront en commits locaux jusqu'à votre feu vert. Ce qui est attendu de vous : rien tant que les campagnes tournent ; le feu vert de publication viendra à leur retour.

## 1. En-tête d'identification

- **quoi** — mandat humain « Traite tous les todos et retours » : ingestion et réconciliation de la boîte d'entrée, décision de tous les items ouverts, lancement des campagnes de correction.
- **sur quoi** — la boîte d'entrée et le registre du pilot ; huit dépôts cibles (pilot, forge des outils, conception, données, design, tests, conventions, référencement).
- **quand** — 2026-09-08 11:10 UTC+02:00 (Europe/Paris), durée ≈ 15 min depuis votre message ; campagnes en cours, première émission reçue.
- **qui** — pilot digit-ai-factory ce948df ; `oracles\oracle-boite-entree.mjs`, `todo\reempreinter-lot.mjs`, `todo\journaliser.mjs`, `todo\oracle-todo.mjs` ; cinq agents de campagne sous `gabarits\AGENT-CAMPAGNE.md`.

## 2. Verdict en une ligne

Boîte d'entrée : 13 constats bloquants → 0, verdict PASS (12 lots rattachés à leur ingestion d'origine, 1 réconcilié par rapprochement de ses titres) ; registre : 33 candidatures décidées, 65 items ouverts tous en décidé ou en cours, oracle PASS ; 5 campagnes lancées sur 8 dépôts (33 items au pilot, 14 à la forge des outils, 6 en conception, 4 en données, 4 en design, 2 en tests, 1 en conventions, 1 en référencement) ; la forge des données a fini ses 4 items, sondés et clos (self-test 166 → 210 cas verts) ; la forge des conventions a rendu le sien, sondé et clos ; 11 autres items annoncés corrigés ailleurs, pas encore sondés ; la campagne des trois petits dépôts a rendu son rapport, ses 4 items sondés (2 clos, 2 laissés en cours avec leur préalable nommé) ; 3 candidatures neuves nées du sondage et du gate lui-même ; registre : 92 items clos, 60 décidés, 4 en cours ; la campagne du pilot a posé 2 commits couvrant 7 items, dont un balayage neuf qui a trouvé 7 caractères de contrôle dans 6 fichiers suivis, quatre pièces de doctrine comprises ; la forge de conception a rendu ses 6 items, sondés et clos, son point d entrée déclaré rendant enfin un verdict sur cible verte ; registre après ces clôtures : 98 items clos, 54 décidés, 4 en cours ; 2 lots de plus arrivés, ingérés et pseudonymisés ; le pilot a repris lui-même un item que la campagne ne pouvait pas écrire ; la campagne des données et du design a rendu son rapport, ses 4 items de design sondés (3 clos, 1 laissé en cours faute de pouvoir écrire chez le socle) ; le pilot a corrigé lui-même l anonymiseur qui appariait la clé la plus courte en premier, recette 7 sur 7 puis 9 sur 9 ; la campagne du socle a corrigé son faux positif et signalé en retour un défaut réel de la page d archive du pilot, corrigé dans la foulée (12 constats bloquants → 0, recette du registre 51 sur 52 → 52 sur 52) ; 0 publication, 3 rapports finaux reçus sur 5, tous confirmant le sondage du pilot item par item.

## 3. Décisions attendues de l'humain

Aucune décision n'attend pendant que les campagnes travaillent. La seule qui viendra est la publication de leurs corrections, à leur retour, comme ce matin. Si rien n'est décidé : les corrections resteront en commits locaux sur ce poste et l'autre poste ne les verra pas.

## 4. Traité — avec sa preuve

- Douze lots que la boîte d'entrée déclarait jamais ingérés ont été rattachés à leur ingestion réelle. Contrôle rouge → vert : douze constats « sidecar JAMAIS ingéré », dont huit vieux de près de quatre heures → un événement de rattachement par lot, portant la nouvelle empreinte, l'ancienne, et le compte de créations d'origine → zéro constat ; classe : un lot renommé et réécrit par la pseudonymisation perd le lien avec son ingestion, parce que le registre l'identifie par son nom.
  - preuve : `oracle-boite-entree.mjs` → 12 constats de cette famille avant, 0 après ; `journaliser.mjs` → « 12 événement(s) journalisé(s) » ; chaque rattachement prouvé par la date du lot, identique des deux côtés.
- Un treizième lot, édité après son ingestion, a été réconcilié par le contenu et non par le nom. Contrôle rouge → vert : la ré-empreinte refusait, aucune version de l'histoire ne portant l'empreinte consignée → mode par rapprochement → « 2 titres du sidecar = 2 créations de l'ingestion consignée », ré-empreinte consignée ; classe : un entrant anonymisé avant son entrée au suivi n'a aucune version d'avant à retrouver.
  - preuve : `reempreinter-lot.mjs --par-rapprochement` → « CONSIGNE » ; `oracle-boite-entree.mjs` → « PASS | FAIL : 0 ».
- Trente-trois candidatures décidées en bloc sous votre mandat, ce qui met les soixante-cinq items ouverts en état d'être corrigés.
  - preuve : `journaliser.mjs` → « 33 événement(s) journalisé(s) » ; `oracle-todo.mjs` → PASS ; répartition mesurée par dépôt cible.
- Cinq campagnes lancées sur huit dépôts, chacune avec son dossier d'items écrit depuis le registre et trié par score, sous le contrat de campagne : écriture dans le seul dépôt désigné, vérifications natives vertes avant chaque commit, commits locaux, jamais de publication.
  - preuve : dossiers écrits → « {"digit-ai-factory": 33, "digit-ai-forge-agents": 14, "digit-ai-forge-conception": 6, "digit-ai-forge-data": 4, "digit-ai-forge-design": 4, "digit-ai-forge-tests": 2, "digit-ai-forge-organization": 1, "digit-ai-forge-seo-geo": 1} » ; trois dépôts non encore touchés de la journée mesurés propres et alignés avant lancement ; première émission d'avancement reçue de la campagne du pilot.
- Registre et boîte d'entrée commités.
  - preuve : commit ce948df, arbre propre hors fichiers non suivis.

- Une candidature neuve née du gate de restitution lui-même : il délimite un tour par le dernier message humain, si bien qu’une notification de tâche de fond n’en ouvre pas un nouveau et que tout message suivant est jugé comme la restitution du mandat entier, accusé de réception compris. Contrôle rouge → vert : quatre accusés brefs refusés d’affilée → cause lue dans le code du gate (la frontière de tour et la fonction qui décide si un message est jugé), constat journalisé avec sa fixture double sens attendue ; classe : le juge de restitution choisit mal ce qu’il juge.
  - preuve : `jugeable()` rend « accusé de réception ou réponse courte » pour un texte de 10 mots sans verdict, mais la frontière de tour laisse `travail` vrai pendant tout le mandat ; `journaliser.mjs` → « 1 événement(s) journalisé(s) » ; `oracle-todo.mjs` → PASS.

- Une candidature neuve née du gate de restitution lui-même : il délimite un tour par le dernier message humain, si bien qu'une notification de tâche de fond n'en ouvre pas un nouveau et que tout message suivant est jugé comme la restitution du mandat entier, accusé de réception compris. Contrôle rouge → vert : quatre accusés brefs refusés d'affilée → cause lue dans le code du gate, constat journalisé avec sa fixture double sens attendue ; classe : le juge de restitution choisit mal ce qu'il juge.
  - preuve : la fonction qui décide si un message est jugé rend « accusé de réception ou réponse courte » pour un texte de 10 mots sans verdict, mais la frontière de tour laisse l'état « travail » vrai pendant tout le mandat ; `journaliser.mjs` → « 1 événement(s) journalisé(s) » ; `oracle-todo.mjs` → PASS.
- Les 4 items de la forge des données, sondés et clos : verbe de projection des évolutions et son oracle, mode d'inventaire fermant la chaîne vers la couverture, glossaire de restitution en donnée jugée, boucle de résolvabilité lue sur le disque. Contrôle rouge → vert : l'oracle des évolutions rejoué ici rend PASS sur sa fixture verte et FAIL sur sa rouge ; classe : une correction acceptée sur le rapport de son auteur plutôt que sur un oracle rejoué.
  - preuve : 4 commits locaux, arbre propre ; `node oracles/self-test.mjs` → « 210 PASS, 0 FAIL » (166 au départ) ; mode d'inventaire → « sortie: OK », document au format de couverture portant 26 objets et aucun mapping ; porte → PASS 0 bloquant.
- L'item de la forge des conventions, sondé et clos : deux règles admettent qu'une initialisation et une règle d'impression vivent dans un fichier externe déclaré, ce qui lève l'obligation de dupliquer du code en ligne sous une politique de sécurité stricte. Contrôle rouge → vert : recette rejouée par le pilot sur une arborescence temporaire à l'état d'avant, puis d'après — 11 fixtures conformes sur 12 des deux côtés, le seul échec étant préexistant ; classe : une exigence de contenu qui n'admet qu'une seule forme de mise en œuvre.
  - preuve : 1 commit local, arbre propre ; `node oracles/self-test.mjs` → « 11/12 fixtures conformes » avant et après ; porte → PASS 0 bloquant ; l'échec restant journalisé comme candidature neuve.
- Incident de concurrence dans le dépôt du pilot, constaté et corrigé pendant le tour : cette synthèse a été ramenée à sa version commitée par les passes de recette « parc réel » d'une campagne travaillant dans le même dépôt, qui restaure des fichiers à leur état publié. Contrôle rouge → vert : le gate a comparé l'écran au fichier et signalé que la trace ne portait plus les chiffres affichés → mises à jour réappliquées et fichier redéposé ; classe : deux écrivains dans un même dépôt, dont l'un restaure à l'état publié ce que l'autre vient d'écrire.
  - preuve : le gate a rendu « l'écran avance 11, 56, 96, 166, 210 que la trace ne porte pas » ; `grep -c` des trois chiffres dans le fichier → 0 avant réapplication.

- Le rapport de la campagne des trois petits dépôts, reçu et sondé : l expertise de recherche multilingue entre dans le corpus de la forge du référencement, et les deux paliers de mutation de la forge des tests restent en cours, leur préalable étant nommé au lieu d être contourné. Contrôle rouge → vert : la recette de non-perte rejouée par le pilot rend SANS OBJET en sortie 2 et nomme désormais le préalable manquant dans son rapport, là où elle renvoyait fouiller l adaptateur ; classe : un verdict d abstention qui ne dit pas ce qui lui manque.
  - preuve : `python scripts/validate.py` → « 13/13 controles passes » et `python scripts/autotest.py` → « 31/31 cas conformes », identiques avant et après ; recette de non-perte → « verdict: SANS_OBJET », motif « aucun mutant viable des deux cotes », sortie 2 ; l agent signale lui-même un compte de tests erroné dans un message de commit, consigné au registre.

- Les six items de la forge de conception, sondés et clos : surface implicite complétée, point d entrée qui rend enfin un verdict, vues scellées sur leur corps, tables closes confrontées à leur prose, double sceau documenté. Contrôle rouge → vert : le lanceur de la forge échouait sur TOUTE cible, verte comprise → rejoué par le pilot sur la fixture verte du dépôt, il rend « verdict: PASS » avec 11 oracles joués et sortie 0 ; classe : un oracle qui échoue hors de son domaine au lieu de s abstenir.
  - preuve : 5 commits locaux, arbre propre ; `node oracles/self-test.mjs` → « 16 oracles, 56 regles. SELF-TEST VERT » ; porte → PASS 0 bloquant ; `journaliser.mjs` → « 6 événement(s) journalisé(s) », `oracle-todo.mjs` → PASS.

- Un item que la campagne du pilot ne pouvait pas écrire, repris par le pilot lui-même : le second volet du correctif remis par un produit sur la vue de suivi générée, dont le fichier vit dans un dossier interdit à l agent. Contrôle rouge → vert : contrôle à blanc du correctif, puis application, puis vérification passage par passage — les cinq cibles sont tenues ; classe : une correction remise en deux volets dont l un tombe hors du périmètre d écriture de celui qui traite l autre.
  - preuve : `git apply --check` → sortie 0 ; `git diff --stat` → 8 insertions, 8 suppressions ; module toujours importable et rendant son usage ; `oracle-todo.mjs` → PASS.

- Les 4 items de la forge du design, sondés (3 clos, 1 en cours) : bibliothèque de sélecteurs partagée, page dédiée admise comme troisième motif de création, deux conflits sur trois arbitrés entre les juges et la doctrine du socle. Contrôle rouge → vert : sur la fixture piégée, le code d avant faisait DISPARAÎTRE la règle du contour — la fixture rouge devenait verte pour la mauvaise raison — et la bibliothèque partagée fait de nouveau déclencher les quatre règles ; classe : deux implémentations divergentes du même geste, dont une seule avait été corrigée.
  - preuve : 3 commits locaux, arbre propre ; `node oracles/self-test.mjs` → « Tout vert — 39 oracles, 120 règles verrouillées » (36 et 117 au départ) ; base verte ; porte → PASS 0 bloquant.
- L anonymiseur du pilot corrigé sur la cause de deux incidents du jour. Contrôle rouge → vert : sur une table à clés recouvrantes, le lot du produit long recevait le pseudonyme du produit court → tri par longueur décroissante avant substitution → chaque produit reçoit le sien, nom de fichier et contenu ; classe : l alias le plus court apparié avant le nom complet.
  - preuve : rejeu sur table jouet → « le lot Produit-62 du jour, et le produit Produit-10 » ; recette embarquée « 7/7 PASS » → « 9/9 PASS » ; les recettes voisines du registre rendent le même compte avant et après.

- La page d archive du registre marque désormais la prose qu elle CITE, et tient les règles de style du socle. Contrôle rouge → vert : 12 constats bloquants d identifiant muet, tous dans des champs cités, invisibles parce que personne ne jouait le contrôle sur cette page → marquage des cartes et des champs longs comme la vue courante le fait depuis août → 5 constats → coupure de mot réservée aux jetons techniques, classe de chapeau stylée, garde de masquage posée → 0 ; classe : une vue qui rend la prose d un émetteur sans la marquer comme citation.
  - preuve : contrôle statique sur la page d archive → « Verdict : FAIL » avec 12 constats, puis 5, puis « Verdict : PASS » ; recette du registre « 51 PASS, 1 FAIL » → « 52 PASS, 0 FAIL ».
- Un faux positif d une règle neuve, mesuré et renvoyé à la campagne qui l écrit : la règle étendue « chaque chapitre dit ce qu il contient » refuse la vue du registre — page générée, non livrée à un client, donc sans critique d implémentation à produire — alors qu elle porte son chapeau de chapitre juste après son titre. Contrôle rouge → vert impossible ici : la règle vit chez le socle, dépôt confié à une autre campagne ; classe : une règle neuve mise en bloquant sans mesure du bruit sur les documents conformes du parc.
  - preuve : `node todo/self-test.mjs` → « [FAIL] page courante … x L30 chapitre ne dit pas CE QU IL CONTIENT » ; la copie installée du socle rend PASS sur la MÊME page (38 règles, empreinte 9dffeac5d60f) ; cas transmis à la campagne avec la forme exacte du chapeau.

## 5. Non traité — avec son motif

- Les corrections elles-mêmes : en cours dans les cinq campagnes ; rien ne sera clos au registre avant que j'aie rejoué chaque preuve.
- La publication : geste humain, elle viendra au retour des campagnes.
- Les deux paliers de stratégie de tests : leur condition de clôture exige une campagne de mutation sur un produit réel, que ce poste n'a pas ; la campagne les rendra non clos avec leur diagnostic plutôt que corrigés à tort.
- Un item de design dont la correction vit chez le socle des pages : traité par la campagne propriétaire de ce socle, jamais en double.
- La propagation des skills modifiés vers leur copie installée : cinq skills divergent, dont trois touchés par la campagne de conception ; le geste écrit hors du dépôt cible et reste une décision explicite, à prendre après la publication.

## 6. Écarts à la lettre

- Vous avez demandé de traiter tous les todos → j'ai d'abord décidé les trente-trois candidatures restantes → pourquoi : un item candidat ne se corrige pas, il se décide d'abord ; votre mandat vaut décision, et chaque événement le dit.
- Les deux items dont la cible n'est pas le propriétaire du code (un item de design chez le socle, un item de tests chez le design) sont attribués au dépôt qui porte le code → pourquoi : corriger chez le demandeur produirait deux implémentations divergentes de la même règle.
- Aucun autre écart.

## 7. Risques

- **Une campagne de trente-trois items qui bâcle pour finir sa liste** : signal = un item clos sans sortie native avant et après ; parade = l'agent a pour consigne de s'arrêter sur un commit vert et de dire ce qui reste, et je sonde chaque commit avant clôture.
- **Deux campagnes qui écrivent dans le même dépôt** : signal = un commit inattendu dans un dépôt cible ; parade = un dépôt n'est confié qu'à une seule campagne, et les items à double cible sont attribués au propriétaire du code.
- **Un lot renommé qui casse à nouveau son lien au registre** : signal = la boîte d'entrée redevient rouge après une pseudonymisation ; parade = le rattachement est désormais un geste connu, et la cause est déjà au registre comme item à corriger.
- **L'autre poste qui travaille en même temps** : signal = un push refusé pour non-avance rapide ; parade = fusionner, jamais rebaser.

## 8. Prochaines actions — un tableau, l'acteur en colonne

| Sélecteur | Action | Identifiant | Acteur | Motif ou raison | Exécutable par | Si non faite |
|---|---|---|---|---|---|---|
| A-69 | Recevoir les cinq rapports, sonder chaque commit (diff lu, vérification native rejouée ici), clore ou renvoyer au registre avec gains constatés, régénérer les vues | TF-0674, TF-0676, TF-0682, TF-0549, TF-0791, TF-0792, TF-0825 à TF-0938 (les 65 items ouverts) | auto_ia | dependance_externe (campagnes en cours) | rapports puis `node todo/journaliser.mjs --fichier <clotures.json>`, `node todo/generer-vue.mjs`, `node todo/generer-page.mjs` | soixante-cinq items restent décidés sans correction constatée |
| A-70 | Publier les huit dépôts après vérification, porte jouée avant chacun | TF-0674, TF-0676, TF-0682, TF-0549, TF-0791, TF-0792, TF-0825 à TF-0938 | auto_ia | gate_gouvernance (publication sur feu vert humain, règle 38) | `git push origin main` dans chaque dépôt, porte jouée avant | les corrections restent locales à ce poste |
| A-66 | Porter dans l'oracle du canal la règle apprise ce matin : une clé déjà pseudonymisée n'entre jamais dans une table de noms réels, avec sa fixture rouge | neuve | auto_ia | gate_gouvernance (candidature à journaliser puis décider) | `node todo/journaliser.mjs --fichier <evenement.json>` puis campagne sur le canal | le même arbitrage refera le même défaut |
| A-67 | Sur l'autre poste, à sa prochaine ouverture : rebâtir le clone de la forge de développement, dont l'histoire a été réécrite ce matin | TF-0829 | manuelle_dev | presence : commandes à jouer sur l'autre poste, hors de portée de ce poste — la mesure locale ne dit rien de l'autre machine | `node bootstrap.mjs --pull` puis `node bootstrap.mjs --rebatir ..\digit-ai-forge-development` | l'autre poste travaillera sur une histoire incompatible |
| A-68 | Rattacher le lot de retours du 3 septembre à un produit, pour qu'il porte un pseudonyme comme les autres | neuve | manuelle_utilisateur | decision : le rattachement suppose de savoir quel produit a émis ce lot, information que ce poste n'a pas | répondre ici avec le nom du produit émetteur ; le lot concerné est `input\00-retours\Produit-65 - RETOURS - 20260903a.md` et je l'inscris au canal et le renomme | un lot reste nommé sans pseudonyme dans un dépôt publié |

Ordre : A-69 au fil des rapports, parce qu'une clôture non vérifiée est un item qui ment ; A-70 ensuite, parce qu'elle publie et demande votre feu vert ; A-66 avec la campagne suivante ; A-67 dès que l'autre poste ouvre une session ; A-68 quand vous voulez.

## 9. Traces

- pilot ce948df — `todo\TODO.jsonl` (12 rattachements, 1 ré-empreinte, 33 décisions) et ses vues, publié jusqu'au commit précédent.
- Dossiers de campagne : scratchpad `campagne2\` — un fichier par dépôt cible, items triés par score.
- Dépôts cibles : `.`, `..\digit-ai-forge-agents`, `..\digit-ai-forge-conception`, `..\digit-ai-forge-data`, `..\digit-ai-forge-design`, `..\digit-ai-forge-tests`, `..\digit-ai-forge-organization`, `..\digit-ai-forge-seo-geo`.
- `input\00-retours\` — 89 sidecars, tous ingérés ou rattachés ; `oracle-boite-entree` PASS.
