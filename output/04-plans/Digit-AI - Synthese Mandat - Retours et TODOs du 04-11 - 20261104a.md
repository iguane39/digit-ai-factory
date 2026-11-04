---
destinataire: humain
---

# Synthèse Mandat — retours du 03/11 ingérés, 23 sujets du registre clos (04/11/2026)

## 0. Synthèse d'ouverture

Les retours remis hier soir par le produit de tests d'intrusion sont traités, et 23 sujets du registre sont clos, chacun avec sa recette rejouée par la session. Les forges savent désormais refuser un commit pendant qu'une campagne de mutation altère un produit, signaler 2 sessions qui touchent la même ressource distante, juger un logo à 16 px et exiger une instance servie pour critiquer une page d'application. Les 7 forges sont publiées. Le pilot reste à publier : une autre session règle en ce moment son historique, et je lui laisse ce geste. Cinq décisions vous reviennent, dont le budget des relectures, dépassé hier.

## 1. En-tête d'identification

Exécution de votre demande « Traite les retours et les TODOs » du 04/11/2026, sur le pilot `digit-ai-factory` et 7 forges (tests, conception, design, audit, websec, ops, agents). Période : 04/11/2026 de 09:18 à 11:10, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, avec 9 agents de campagne Claude Sonnet 5.5 à l'effort high.

Intention de la demande : vider la boîte des retours et faire avancer le registre des améliorations, en exécutant tout ce qui ne vous revient pas.

Test rétro : le résultat sert cette intention. Le sas est vide, 23 sujets sont clos sur 25 confiés, et les 5 questions posées relèvent de la doctrine, d'un produit, des secrets ou d'une dépense.

## 2. Verdict

23 sujets clos au registre sur 25 décidés, 2 restés en cours avec leur preuve ; `oracle-todo` rend PASS après chacune des 7 écritures ; 7 forges publiées, 0 commit en avance après vérification par `rev-list`.

## 3. Décisions attendues

> **D-165 — Le seuil de 4 millions de jetons de relecture d'intention a été franchi le 03/11 (5,6 millions) : faut-il suspendre les relectures jusqu'à la revue du 08/11 ?**
>
> - **De quoi s'agit-il** : la relecture qui fait lire chaque consigne d'agent et chaque réponse par un relecteur neuf, contre votre demande citée mot pour mot (`scripts/relecture-intention.mjs`).
> - **Le problème** : le 03/11, les relectures ont consommé 5 620 487 jetons, au-delà du seuil de 4 000 000 par jour. La règle impose alors d'arrêter et de vous demander. Ce matin, j'ai lancé les 9 agents sans relecture de leurs consignes.
> - **Pourquoi vous** : c'est une dépense de jetons, et le seuil vient de votre décision D-25 du 18/10.
> - **Recommandation : (a)** — la revue du 08/11 jugera l'essai sur ses critères dans 4 jours ; reprendre avant ne change pas ce jugement et coûte jusqu'à 4 millions de jetons par jour. Source consultée : `references/RELECTURE-INTENTION.md`, section « Dates, seuil, revue ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Suspendre jusqu'au 08/11 | Aucune relecture jusqu'à la revue ; les consignes partent sans relecture, et la restitution le dit | Nul | Possible : la relecture reprend sur votre mot |
| (b) Reprendre dès aujourd'hui | Les relectures reprennent sous le même seuil, arrêt au prochain dépassement | Jusqu'à 4 millions de jetons par jour | Possible |
| (c) Relever le seuil à 6 millions | La journée du 03/11 passe sous le seuil ; les relectures reprennent | Jusqu'à 6 millions de jetons par jour | Possible |

> **Sans réponse** : (a), suspendre jusqu'à la revue du 08/11.

> **D-166 — Faut-il qu'un run ne puisse plus se déclarer prêt pour la production sans un parcours réel par persona joué sur l'instance servie (TF-2124) ?**
>
> - **De quoi s'agit-il** : le contrat « prêt client » qui clôt un run, et deux contrôles livrés ce matin, le pan de parcours par persona de forge-tests et le contrôle d'exploitabilité sur instance de forge-design (`parcours-personas`, `oracle-exploitabilite`).
> - **Le problème** : le produit de tests d'intrusion s'est déclaré prêt avec 85 exigences tenues sur 85, sur un référentiel écrit par la session ; le porteur l'a jugé inexploitable et a fait 12 remarques.
> - **Pourquoi vous** : c'est une règle de doctrine, elle change ce que « prêt » veut dire pour tous les produits.
> - **Recommandation : (a)** — un avertissement de 2 semaines mesure combien de runs le manqueraient avant de bloquer. Source consultée : le lot de retours `Produit-86 - RETOURS - 20261103c`, remarque RP-3.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Avertir 2 semaines, puis bloquer | « Prêt » exige les deux contrôles verts ; un manque avertit jusqu'au 18/11, puis bloque | Une session de construction au pilot | Possible : la règle se retire |
| (b) Bloquer tout de suite | Un run sans parcours par persona joué ne peut plus se dire prêt | Une session, et des runs en cours arrêtés | Possible |
| (c) Ne rien changer | « Prêt » reste jugé sur les exigences seules | Nul | Sans objet |

> **Sans réponse** : (c), ne rien changer.

> **D-167 — Faut-il donner aux produits un geste qui range au coffre local un secret reçu en session, consigné au ledger par son nom et son empreinte (TF-2127) ?**
>
> - **De quoi s'agit-il** : le passage d'un secret, une clé d'API par exemple, d'une session d'un produit à la suivante ; le ledger est le journal du produit (`forge/ledger.jsonl`).
> - **Le problème** : une clé collée le 03/11 à 09:24 dans une session manquait au produit à 21:31 ; la session suivante l'a retrouvée en relisant une transcription.
> - **Pourquoi vous** : le geste touche aux secrets, que la règle « les .env ne transitent jamais » garde.
> - **Recommandation : (a)** — le secret reste sur le poste, dans un fichier que git ignore, et le ledger ne porte jamais sa valeur. Source consultée : le lot `Produit-86 - RETOURS - 20261103d`, remarque RP-5.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Ranger au fichier local ignoré | La session écrit le secret dans le fichier d'environnement local du produit, jamais versionné, et consigne au ledger son nom et son empreinte | Une session de construction au pilot | Possible : le geste se retire |
| (b) Ranger au coffre du système | Même geste, mais dans le gestionnaire d'identification de Windows | Une session et demie | Possible |
| (c) Ne rien changer | Un secret se redonne à chaque session qui le demande, comme le 03/11 | Nul, sauf le temps de le redonner | Sans objet |

> **Sans réponse** : (c), ne rien changer.

> **D-168 — Faut-il admettre sans décision groupée le retrait d'une ressource distante créée dans le même tour et jamais employée (TF-2128) ?**
>
> - **De quoi s'agit-il** : la liste fermée des gestes qu'une session d'un produit peut faire sur une ressource distante, chez Azure ou Cloudflare par exemple, sans vous demander d'abord une décision groupée (`references/GESTES-DISTANTS.md`).
> - **Le problème** : changer la région d'un réseau vide créé 10 minutes plus tôt aurait exigé une décision groupée ; la session l'a dupliqué, et l'original reste facturé.
> - **Pourquoi vous** : c'est un geste destructif, que la doctrine vous réserve ; l'admettre assouplit une garde.
> - **Recommandation : (a)** — les trois conditions rendent le retrait vérifiable, et une ressource orpheline coûte chaque mois. Source consultée : le lot `Produit-86 - RETOURS - 20261103d`, remarque RP-6.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Admettre sous trois conditions | Le retrait passe si la ressource a été créée par la même session, consignée à sa création avec son identifiant, et n'a aucune dépendance | Une session au pilot | Possible : la ligne se retire de la liste |
| (b) Ne rien changer | Tout retrait reste une décision groupée | Les ressources dupliquées restent facturées | Sans objet |

> **Sans réponse** : (b), ne rien changer.

> **D-169 — Faut-il signaler par un lot de travaux aux 3 produits qui citent des modèles OpenAI arrêtés le 11/12/2026 ou le 14/01/2027 qu'ils doivent en changer (TF-2115) ?**
>
> - **De quoi s'agit-il** : le calendrier d'arrêt des modèles OpenAI et Gemini, que le pilot croise avec le parc depuis le 03/11 (`oracles/oracle-modeles-tiers.mjs`), et le lot de travaux, le canal par lequel le pilot confie un geste à un produit (`todo/emettre-travaux.mjs`).
> - **Le problème** : Produit-12 et un autre produit citent gpt-5, gpt-5-mini et gpt-5-nano, arrêtés le 11/12/2026 ; Produit-82 cite un modèle arrêté le 14/01/2027.
> - **Pourquoi vous** : le pilot n'intervient chez un produit que sur un run demandé.
> - **Recommandation : (a)** — le lot n'écrit rien chez le produit : il lui signale le geste, qu'il fera à sa prochaine session, avant l'arrêt. Source consultée : la page des dépréciations d'OpenAI, relue le 03/11/2026 à 19:58 et citée au registre sous TF-2115.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Émettre un lot de travaux aux 3 produits | Chaque produit lit le geste à sa prochaine ouverture | Quelques minutes | Possible : un lot non traité se retire |
| (b) Attendre leur prochain run demandé | Rien n'est signalé avant que vous ne lanciez un run | Nul ; risque de panne au 11/12 | Sans objet |

> **Sans réponse** : (b), attendre leur prochain run.

## 4. Traité

Le tour a d'abord vidé le sas, puis confié les 25 sujets décidés à 9 agents, un par dépôt. Il a vérifié chaque rapport en rejouant la recette du dépôt, puis inscrit les clôtures.

- **Sas des retours** : 3 lots de Produit-86 du 03/11 accueillis puis ingérés, exit 0 pour chacun ; 12 sujets créés, TF-2118 à TF-2129. RT-11 n'est pas un doublon de TF-2091 : le correctif d'hier laissait le côté lecture du verrou de mutation « à câbler ».
- **Registre** : 25 sujets décidés par R-58, la règle qui réserve à l'humain la dépense, la publication, l'irréversible, la doctrine, l'arbitrage et le produit ; 8 classes de défaut créées, référentiel en 1.64.0 ; TF-1924 et TF-2057 remis sur leur vraie attente.
- **Mesure due de TF-1947** : 79 refus du hook de fin de tour en 7 jours sur ce poste après le 26/10, contre 95 la semaine précédente, pour une cible de 15.
- **forge-tests**, recette rejouée par la session : 1 694 tests passés.
  - Le pan prompts n'impute plus au produit un fichier non suivi par git (TF-2118) ; 5 faux constats en moins sur la fixture du cas réel.
  - Le tableau de bord généré passe la critique d'implémentation (TF-2101) ; 69 écarts durs ramenés à 0.
- **forge-conception**, self-test rejoué : vert, 19 oracles et 60 règles. Un écart de surface implicite exige une décision humaine référencée (TF-2119), et la surface implicite demande aide de champ, filtre et tri des listes, garde de saisie (TF-2120).
- **forge-design**, self-test rejoué : 779 contrôles verts, 67 oracles.
  - La critique refuse une page d'application sans instance servie (TF-2121), et une instance locale en https auto-signé se joint (TF-2122).
  - Un logo se juge rendu à 16 et 32 px (TF-2074), et le skill de marque guide un produit sans logo (TF-2073).
  - Le producteur d'images ne vise plus de modèle Gemini arrêté (TF-2111), sans appel réel.
- **forge-audit**, tests neufs rejoués : 17 sur 17. 7 fichiers de test entrent à l'intégration continue (TF-2104), une option de dossier refuse un tiret (TF-2105), une copie périmée dans un kit fait échouer la recette (TF-2106).
- **forge-websec**, self-test rejoué : 99 PASS, 0 FAIL. La capture masque les jetons dans l'URL, Location, Authorization et Cookie (TF-2107).
- **forge-ops**, self-test rejoué : 386 PASS, 0 FAIL. Le plan Azure déclare une région de repli et vérifie la capacité avant le réseau (TF-2129).
- **forge-agents**, self-test rejoué : 23 cas PASS. `oeil-critique` refuse une modification automatique sur un fichier changé depuis la liste (TF-2070).
- **Pilot**, recettes rejouées sur l'arbre principal avant les commits 886fc0d3 et c0b53934 :
  - un produit ne commite ni ne déploie pendant une mutation (TF-2126), recette 37 sur 37 ;
  - 2 sessions d'un produit voient leurs gestes distants ouverts (TF-2084), recettes 25 et 82 sur 82 ;
  - une écriture dans le dossier temporaire ne fait plus un tour de travail (TF-2079), et une extension de skill sans retour est avertie (TF-2078), recette 64 sur 64 ;
  - le faux positif de dépense est corrigé (TF-2113), classe `oracle-faux-positif` : rouge avant sur le parc (1 faux FAIL), vert après, recette 21 sur 21 ; la revue hebdomadaire joue le calendrier des modèles tiers (TF-2116) ;
  - la table de socle d'un produit est confrontée à ses écrans (TF-2125), 202 sur 202 ; l'inventaire de forge-design est remesuré (TF-2114).
- **Restes des agents** : le rappel de la critique du hook nomme désormais les remèdes de la règle X7 (la règle de forge-design qui exige une instance servie pour une page d'application) ; la ligne d'empreinte du script neuf d'oeil-critique est ajoutée, `oracle-empreintes` PASS ; 5 constats hors périmètre inscrits en candidats, TF-2131 à TF-2135.
- **Publication** : les 7 forges sont poussées sous le GO permanent des forges (D-53 (b) du 03/10), dont 5 déjà par l'autre session ; les 7 skills touchés sont propagés au poste, rejeu PASS.

Relecture d'intention : sans objet, motif : le seuil de 4 000 000 jetons par jour a été franchi le 03/11, et la règle impose d'arrêter et de vous demander (D-165).

## 5. Non traité

- TF-2094, le script de recherche des projections sans version — motif : `non_clos`, le correctif proposé casse le sceau des composants embarqués ; la cause est un commentaire d'usage copié dans la page, à reformuler chez forge-agents.
- TF-2123, le parcours par persona joué contre l'instance — motif : `borne_atteinte`, livré en version minimale qui constate l'absence ; le jeu sous l'identité de chaque rôle reste à construire.
- Publication du pilot — motif : `hors_mandat`, une autre session règle son historique publié sous D-170 ; le pilot est à 25 commits devant et 2 derrière le distant.
- TF-2115, TF-2124, TF-2127 et TF-2128 — motif : `decision`, posés sous D-169, D-166, D-167 et D-168.
- Essai réel du producteur d'images Gemini — motif : `decision`, c'est une dépense.

## 6. Écarts à la lettre

- Vous avez demandé de traiter les TODOs → j'ai lancé les agents sans relire leurs consignes → la règle du seuil de relecture l'impose jusqu'à votre réponse à D-165.
- Vous avez demandé de traiter les TODOs → j'ai laissé de côté la publication du pilot → une autre session vivante règle son historique publié, et deux publications concurrentes se seraient écrasées.

## 7. Risques

- **Référentiels de produit refusés au prochain rejeu** : un écart de surface implicite décidé « par le porteur » sans référence échoue désormais à S4 (le contrôle de forge-conception qui juge la surface implicite) ; une page d'application critiquée sans instance échoue à X7.
  - Signal : un produit voit S4 ou X7 rouge au prochain run.
  - Parade : le message d'échec nomme le remède, une référence de décision ou `--instance`.
- **Une autre session écrit dans le même registre** : elle a créé TF-2130 et posé D-170 pendant ce tour.
  - Signal : `oracle-todo` refuse une création pour « seconde creation pour le même id ».
  - Parade : relever le dernier numéro juste avant d'écrire ; mes candidats ont été renumérotés ainsi.

## 8. Prochaines actions

Ordre : le seul geste qui vous revient d'abord, puis les actions de la session par coût décroissant de ne pas les faire.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Supprimer le dossier vide laissé par erreur par un agent à la racine du disque | `neuve` | manuelle_utilisateur | acces : identité de la session, `rmdir` refusé par la garde de sécurité du harnais (commande non exécutée) ; identité de l'agent de campagne, suppression refusée de même ; automatisation du dépôt, aucun script du parc ne nettoie la racine du disque ; pas d'API de plateforme pour un dossier local | `rmdir C:	mp-IVSd` | si rien n'est fait, un dossier vide reste à la racine du disque |
| A-2 | Publier le pilot une fois son historique réglé, avec les 2 commits de cette campagne | `neuve` | auto_ia | dependance_externe : la session qui traite D-170 tient ce geste | `git push origin main` sous `FORGE_PUSH_GO` | si rien n'est fait, les corrections du pilot restent sur ce poste |
| A-3 | Reformuler le commentaire d'usage du script de recherche pour lever le faux constat des projections | TF-2094 | auto_ia | borne_atteinte : hors du dépôt des agents de ce tour | `digit-ai-forge-agents`, `digit-ai-page-html/assets/find-in-page.js` | si rien n'est fait, 2 faux constats à chaque porte de cache |
| A-4 | Traiter les 5 constats des agents inscrits ce jour | TF-2131 | auto_ia | borne_atteinte : nés en fin de tour | `todo/TODO.jsonl`, TF-2131 à TF-2135 | si rien n'est fait, 5 défauts connus restent ouverts |
| A-5 | Lire le motif des 79 refus du hook pour viser la cible de 15 | TF-1947 | auto_ia | borne_atteinte : le compte par motif n'est pas lisible tel quel | transcriptions des profils `.claude` et `.claude-b` | si rien n'est fait, chaque refus continue à coûter un tour |

## 9. Traces

- `input/00-retours/Produit-86 - RETOURS - 20261103b.md`, `…20261103c.md`, `…20261103d.md` et leurs sidecars
- `todo/TODO.jsonl`, `todo/CLASSES.json` (1.64.0), `references/EMPREINTES.md`, `decisions/REGISTRE.jsonl` (D-165 à D-169)
- Commits du pilot : 886fc0d3, c0b53934 ; forges : websec 0a1c577, ops 3338850, audit e49a7cf à c0328fd, agents c0aae92, conception edc5488, design c37d2c0 à d20ad6c, tests 0180456 à 678ba56
