# Prompt — Suivi des agents toutes les 15 minutes

Prompt réécrit le 12/11/2026 par l'analyse L99 `output/03-etudes/Digit-AI - Revue - Prompt suivi d avancement des agents passe au crible L99 - 20261112a.md`. Il se colle tel quel dans une session ouverte au pilot `digit-ai-factory`. Son score n'est pas mesuré dans cette version : la reprise dont il dérive a été notée 82 et 40, et le 40 tenait à un compte corrigé ici. Version g : elle applique la réponse « 209a » du porteur du 12/11/2026, qui exige la preuve par bancs ; elle remplace la version e du même jour (règle 5 de `REGLES-PROJET.md` : une nouvelle version est un nouveau fichier daté).

---

Mandat au pilot `digit-ai-factory` : rendre visible, toutes les 15 minutes, l'état de tout agent qui tourne depuis plus de 15 minutes, et faire voyager ce suivi chez les produits par leur prochaine mise à niveau.

Le problème, dit par le porteur : « Certains agents tournent pendant des heures sans qu'on sache s'ils s'exécutent encore ou s'ils sont morts. » Un suivi régulier a déjà été demandé ; il ne s'est exécuté que quelques fois, sur certains produits. Ce mandat ne réécrit pas une règle de plus : il livre un mécanisme qui tourne sans compter sur la mémoire de la session, et il prouve qu'il tourne.

## Définition qui sert partout : le « point de suivi »

Un point de suivi est un message de texte de l'assistant, écrit dans le transcript de la session qui a lancé l'agent (c'est ce que le porteur voit à l'écran), dont la première ligne est `Suivi agents`. Rien d'autre ne compte comme point : ni une ligne dans un fichier, ni une sortie d'outil, ni une notification. L'ÉTAPE 2, les bancs et l'oracle de relevé détectent tous ce même motif dans le transcript de la session parente. Le relevé de secours d'une session fermée (ÉTAPE 3.6) n'est pas un point.

## ÉTAPE 0 — Remesurer l'état avant tout travail

Ces faits datent du 12/11/2026, de 17:37 à 18:42. Remesure chacun et note l'écart s'il a changé.

1. `gabarits/AGENT-CAMPAGNE.md`, section « Avancement des campagnes longues » : l'agent ÉMET une ligne JSON toutes les ~3 minutes dans un fichier nommé par la consigne ; la session pilote « arme un guetteur » et « relaie ». Aucun hook ni oracle ne vérifie ce relais.
2. Registre `todo/TODO.jsonl` et `todo/TODO-ARCHIVE.jsonl` : TF-0094 (11/08, émission de l'avancement), candidature `input/01-candidatures/old/sans-date/candidature-relais-avancement.tf.jsonl` (13/08, le relais manquant), TF-1898 et décision D-41 (a) (19/10, canal fichier ; D-41 est l'entrée `n: 41` de `decisions/REGISTRE.jsonl`, à ne pas confondre avec l'ancienne D-41 du même jour renumérotée D-48), TF-2434 (12/11, suspension pendant une commande longue ou une compaction), TF-2463 (12/11, le harnais bascule une commande longue en arrière-plan vers 175 s ; statut « decide », non corrigé).
3. `gabarits/HERITAGE.json` : aucune entrée ne porte l'avancement ni son relais (`grep -c avancement` = 0). Les 5 agents de la flotte (`.claude/agents/*.md`) voyagent, le contrat qu'ils lisent reste au pilot.
4. Journaux `forge/avancement.jsonl` : 18 produits en portent un, sur 35 dossiers `forge\` hors forges et hors fixtures. Commande : `find /c/dev -maxdepth 5 -type d -name forge -not -path '*/node_modules/*' -not -path '*/digit-ai-forge*'` ; les 2 fixtures de `digit-ai-forge-tests` en portent aussi un, exclues des deux côtés. Dernières écritures du 21/08 au 12/11.
5. Transcripts des 2 profils (`~\.claude` et `~\.claude-b`, dossiers `<session>\subagents\*.jsonl`) : aucune durée de conservation n'est présumée. La fenêtre se mesure par profil, au premier horodatage du plus ancien fichier `subagents\*.jsonl` ; le 12/11 à 18:42, 745 fichiers dans `~\.claude` depuis le 11/10/2026, 268 dans `~\.claude-b` depuis le 02/10/2026. Sur les fichiers modifiés depuis 30 jours : 980 sous-agents, dont 267 à plus de 15 minutes entre premier et dernier horodatage, 142 à plus de 60, le plus long à 1 002 minutes.
6. Capacités du harnais, chacune avec sa source citée (page de documentation lue ou essai exécuté, sortie à l'appui) : présence des outils Monitor et Workflow (ToolSearch) ; un Monitor expire au plus tard à 30 minutes et se réarme sur sa notification d'expiration ; un hook ne peut ni appeler un outil ni écrire dans la conversation, il peut injecter du contexte, réécrire l'entrée de l'outil ou lancer un processus détaché ; aucun événement de hook n'est déclenché par une horloge ; une session `claude -p` reprend-elle la parole sur une notification après la fin de son tour. Une capacité mesurée qui contredit cette liste l'emporte, et l'ÉTAPE 3.4 se revoit.
7. `gabarits/RESTITUTION.md` : la forme « point d'étape » (blocs 1, 4 et 8 pleins) et la règle S67 (une veille de session s'éteint avec elle). Le hook Stop (`oracle-synthese`) juge tout message qui clôt un tour.

Écris ces mesures avec leur commande. Un fait que tu ne peux pas remesurer se dit « non remesuré », jamais recopié.

## ÉTAPE 1 — Retrouver la demande d'origine, mot pour mot

Sources, dans cet ordre : le registre (les 5 références de l'ÉTAPE 0.2), les synthèses de `output/04-plans/` qui les citent, puis les transcripts des 2 profils sur toute la fenêtre mesurée à l'ÉTAPE 0.5, sessions et sous-agents. Cite la demande du porteur mot pour mot avec sa date et son chemin. L'hypothèse de départ est la décision D-41 (a) du 19/10, sans certitude. Introuvable : dis-le, avec la date du plus ancien transcript, et pars des 5 références. N'invente jamais une citation.

## ÉTAPE 2 — Diagnostiquer pourquoi le suivi n'a tourné que quelques fois

Population unique : les fichiers `subagents\*.jsonl` des 2 profils modifiés depuis 30 jours, dont l'écart entre premier et dernier horodatage dépasse 15 minutes. Chaque sous-agent se rattache à son appel Agent dans le transcript parent par son identifiant (`agent-<id>.jsonl`, repris dans le résultat de l'appel).

Écris un script versionné qui classe chaque cas dans une seule cause ; la première vraie l'emporte :
(a) aucun chemin `avancement` dans la consigne de l'appel Agent ;
(b) un chemin nommé, aucune écriture vers ce chemin dans le transcript de l'agent ;
(c) l'agent a écrit, et aucun appel d'outil de la session parente dont l'entrée contient ce chemin (Monitor et commande d'arrière-plan compris), du lancement inclus à la fin de l'agent ;
(d) la session l'a lu, aucun message de texte de l'assistant n'est sorti dans une fenêtre de 17 minutes pendant la course ;
(e) suivi tenu : un message de texte de l'assistant au moins toutes les 17 minutes, du lancement à la fin.
Un cas que ces règles ne tranchent pas se classe « indéterminé ». Au-delà de 15 % d'indéterminés, le script se reprend avant de rendre le tableau. Relis à la main 10 cas tirés au hasard, chacun avec son chemin, son horodatage, le verdict du script et le tien ; au moins 9 doivent concorder, sinon le script se reprend. Rends le tableau par dépôt, noms de produits pseudonymisés.

## ÉTAPE 3 — Construire le suivi

Le suivi juge la vie de l'agent depuis l'extérieur, sans sa coopération : la preuve de vie est la plus récente des deux écritures, son transcript ou son fichier d'avancement ; le fichier d'avancement donne le contenu.

1. **Déclenchement** : tout sous-agent lancé par l'outil Agent, tout Workflow si l'outil existe, et la session elle-même quand un de ses tours dépasse 15 minutes ; elle émet alors le même point sur son propre travail, rappelée par un hook qui suit ses appels d'outils. Une commande d'arrière-plan longue est couverte, ou exclue avec sa raison écrite.
2. **Cadence** : un premier point à 15 minutes de course, puis un toutes les 15 minutes. Un agent dont le harnais a notifié la fin est « fini » : il figure une dernière fois dans le point suivant, puis plus jamais. Un agent fini avant 15 minutes ne produit aucun point. Plusieurs agents d'une même session tiennent dans un seul point.
3. **Contenu du point**, une ligne par agent, ce contenu et aucun autre sur l'agent : nom de l'agent ; état « actif » (dernière preuve de vie de moins de 5 minutes), « silencieux » (de 5 à 15 minutes), « commande longue » (la dernière ligne d'avancement annonce une commande et sa fin attendue, non échue, selon TF-2434) ou « présumé arrêté » (plus de 15 minutes sans preuve de vie ni commande longue annoncée), avec l'âge mesuré ; tâches faites ; tâches restantes. Les deux listes viennent du fichier d'avancement ; sans fichier, la ligne dit « non déclaré par l'agent ».
4. **Porteur du mécanisme** : établis par mesure qui produit physiquement le message à 15 minutes quand le tour de la session est fini et que l'agent tourne en arrière-plan. Le hook `PreToolUse` sur Agent (le pilot a `oracles/hook-flotte.mjs`) peut nommer le fichier d'avancement dans la consigne et injecter l'ordre d'armer la veille ; il ne l'arme pas lui-même. Un réveil qui dépend d'un geste de la session que rien ne déclenche n'est pas un mécanisme livré.
5. **Hook Stop** : chaque point clôt un tour, donc passe le hook Stop. Voie préférée : un amendement d'`oracle-synthese` et de `hook-restitution.mjs` reconnaît la forme « point de suivi » (première ligne `Suivi agents`, puis au moins une ligne d'agent avec un âge mesuré). La recette de l'amendement rejoue les synthèses d'`output/04-plans/` sans changement de verdict et refuse une fixture « faux point » (le motif sans ligne d'agent mesurée). Voie de repli : la forme « point d'étape » de `RESTITUTION.md`, la première ligne du bloc 1 portant le motif et la mention « point d'étape », les lignes d'agents en bloc 4. Chaque point porte une mesure neuve (âges, tâches), sans quoi deux points de suite sont « un reste ».
6. **Session fermée** : un agent qui survit à sa session n'a plus de conversation, donc plus de point. Soit un guetteur détaché écrit un relevé de secours dans un fichier lisible après coup, soit la limite se déclare (S67).
7. **Cohérence** : la cadence d'émission de l'agent (~3 minutes) reste la sonde ; le point au porteur passe à 15 minutes. Mets `AGENT-CAMPAGNE.md` d'accord avec ce mécanisme, TF-2434 et TF-2463 compris.

## ÉTAPE 4 — Faire voyager le suivi chez les produits

Ajoute au contrat d'héritage (`gabarits/HERITAGE.json`, version montée) tout fichier que le mécanisme exige chez un produit, pour que chaque produit le reçoive à sa prochaine ouverture. Le relevé d'héritage (`scripts/relever-heritage.mjs`) doit le voir. Liste les produits qui ne le recevront pas seuls, sans lanceur de hooks par exemple, avec le geste humain qui manque, noms pseudonymisés.

## ÉTAPE 5 — Prouver que le suivi tourne

Le porteur a tranché le 12/11/2026 (D-209 (a), réponse « 209a ») : le suivi est exigé et prouvé. Le mandat est fini sur preuve exécutée, jamais sur une règle écrite (TF-2434 s'est clos « aucun gain chiffré avant usage »). Un banc de bout en bout rouge rend le mandat en échec : TF-2463 reste ouvert, la synthèse le dit, la cause est nommée.

- Mode du banc de bout en bout : `claude -p` sur l'abonnement si l'ÉTAPE 0.6 a prouvé qu'il reprend la parole après la fin de son tour ; sinon une session à entrée continue (`--input-format stream-json` ou le SDK), le choix déclaré dans la synthèse.
- Banc de bout en bout, obligatoire : la session lance un vrai sous-agent en arrière-plan par l'outil Agent, avec le hook réel, puis clôt son tour avant 15 minutes (fin de tour visible au transcript) ; la session ne reçoit plus aucun message jusqu'au premier point. L'agent tourne 35 minutes en écrivant son avancement. Attendu, lu par l'oracle de relevé dans le transcript : 2 points, à 15 et 30 minutes, à ± 2 minutes.
- Preuve d'acceptation par le hook Stop, pour chaque point : aucun refus au transcript ni au journal des hooks, et `oracle-synthese` rejoué sur le texte exact du point, exit 0 cité.
- Banc figé : le même agent cesse toute écriture à 12 minutes et reste en attente, sans se terminer. Attendu : « actif » au point de 15 minutes (âge d'environ 3 minutes), « présumé arrêté » à celui de 30 (environ 18 minutes).
- Banc commande longue : l'agent annonce une commande de 20 minutes avec sa fin attendue, puis se tait. Attendu : « commande longue » au point de 15 minutes, jamais « présumé arrêté » avant la fin annoncée.
- Banc court : un agent de 10 minutes. Attendu : aucun point.
- Horloge accélérée par variable d'environnement : admise pour les bancs unitaires seulement, déclarée.
- Oracle de relevé : un script qui lit les transcripts postérieurs à l'installation du mécanisme et les fixtures. Pour chaque agent de plus de 17 minutes, il mesure les écarts lancement → premier point, entre deux points, dernier point → fin ; exit 1 si l'un dépasse 17 minutes, ou si l'agent n'a aucun point. Paire de fixtures rouge et verte. Enregistre-le au registre de `quality-oracles` (règle §4).

Trois cycles de correction au plus ; au-delà, livre avec les écarts restants nommés.

## Garde-fous

- Pilot et forges : écriture et push sous le mandat permanent. Produits : aucune écriture.
- `~\.claude` et `~\.claude-b` : écriture seulement par un script versionné du pilot, avec copie du fichier avant et ligne au registre ; jamais à la main.
- Les bancs n'emploient que des agents factices : de vrais sous-agents lancés par le mandat, dont la seule tâche est d'attendre en écrivant un avancement de test. Ne tue ni ne perturbe aucun agent d'un autre travail.
- Le pilot est public : tout nom de produit se pseudonymise selon les tables du pilot dans tout fichier publié, et la porte de publication passe avant le commit.
- Aucune API tierce payante. Aucun `node -e` pour du texte : les scripts s'écrivent par fichier.
- Toute heure écrite se relève par `date`.
- Chaque correction entre au registre par `todo/journaliser.mjs`, rattachée à TF-2463 ou à la classe existante `cadence-d-avancement-non-tenue`.
- Synthèse au gabarit `gabarits/RESTITUTION.md`, nommée selon R-4 et R-25 : `Digit-AI - Synthese Mandat - Suivi des agents toutes les 15 minutes - AAAAMMJJ<indice>.md`, indice par `scripts/allouer-indice.mjs`, jugée par `oracle-synthese` et `check_markdown.py`.

## Contrat de sortie

1. La demande d'origine est citée mot pour mot avec sa date, ou déclarée introuvable avec la date du plus ancien transcript.
2. Le tableau de l'ÉTAPE 2 couvre toute la population remesurée, causes (a) à (e) et « indéterminé » sous 15 % ; le script est versionné ; les 10 cas relus à la main concordent au moins 9 fois.
3. Le porteur du mécanisme est nommé, avec la mesure qui prouve le réveil sans geste de la session.
4. Les 4 bancs et l'oracle de relevé rendent leur verdict attendu ; la sortie exécutée est citée, preuve d'acceptation du hook Stop comprise ; l'oracle est inscrit au registre de `quality-oracles`.
5. La recette de l'amendement du hook Stop est rejouée, fixture « faux point » refusée ; ou la voie de repli est déclarée.
6. `gabarits/AGENT-CAMPAGNE.md` est d'accord avec le mécanisme, TF-2434 et TF-2463 compris.
7. `gabarits/HERITAGE.json` porte le mécanisme, version montée ; le relevé d'héritage le voit.
8. La liste des produits qui ne le recevront pas seuls est rendue, pseudonymisée, avec le geste humain par produit.
9. Aucune écriture chez un produit ; aucune écriture à la main dans `~\.claude` ou `~\.claude-b`.
10. La synthèse est jugée PASS par `oracle-synthese` et par `check_markdown.py`.
