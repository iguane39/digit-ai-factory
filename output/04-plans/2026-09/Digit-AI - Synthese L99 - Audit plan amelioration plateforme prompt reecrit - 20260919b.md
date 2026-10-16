---
destinataire: humain
---

# Synthèse L99 — le prompt « audit, et en plus un plan d'amélioration complet » est analysé et réécrit en mandat de run de conseil ; il vous reste à valider la lecture de votre intention et neuf écarts, puis à lancer le run (19/09/2026)

Votre demande d'amélioration du prompt est traitée : l'analyse en huit couches est déposée, elle passe le contrôle de lisibilité, et le prompt réécrit est prêt à l'emploi. Ce que l'analyse change pour vous : votre prompt demandait deux choses de nature différente sans le dire. Une remédiation répare un écart à une norme, et l'audit suffit à la produire ; une amélioration vise un écart à une ambition, et cette ambition n'était écrite nulle part — le plan rendu aurait été un catalogue de bonnes pratiques valable pour n'importe quelle application. Or l'ambition existe déjà, par écrit, dans la documentation de la plateforme elle-même, et la Factory possède déjà la voie qui enchaîne diagnostic, recommandations et lotissement. Le prompt réécrit branche l'un sur l'autre : l'audit d'abord, le plan d'amélioration ensuite, une seule trajectoire pour les deux, et un contrat de douze critères vérifiables. Rien n'a été écrit chez la plateforme, rien n'est enregistré ni publié. Ce qui est attendu de vous : valider ou corriger la lecture de votre intention et les neuf écarts, dire si les fichiers du tour s'enregistrent localement, puis lancer le run depuis le dossier de la plateforme.

## 1. En-tête d'identification

- **quoi** — appel du skill `prompt-analyzer-l99` par le lexique d'invocation du noyau (la règle qui fait de « Améliore ce prompt » un appel de skill, jouée par le hook de lexique) ; analyse complète en huit couches, prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit (deux fichiers) ; lectures seules sur l'archive locale de la plateforme visée (README racine, arborescence, dossiers de documentation), sur `references\RUN-CONSEIL.md`, `references\INTENTION.md`, `fiches\forge-audit.md`, et sur le dernier rapport d'audit reçu dans la boîte d'entrée (autre produit, lu comme exemple de forme).
- **quand** — 2026-09-19 12:51 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour à 12:43, prise après les lectures de cadrage (l'horodatage du message reçu n'est pas disponible à l'outillage) ; durée mesurée ≥ 8 min.
- **qui** — session Fable 5.1 sur le pilot local `1514d3e4` ; aucune délégation à un sous-agent (escalade : aucune) ; oracles joués : `check_markdown.py` (quatre règles de lisibilité du Markdown : ouverture de chapitre, mode de lecture des tableaux, marqueurs de travail, glose des identifiants) et `oracle-synthese` sur ce document.

## 2. Verdict en une ligne

**Prompt d'origine 20/100 → prompt réécrit 86/100 (projeté) ; 16 défauts inventoriés dont 3 bloquants, tous rattachés au changelog ; 9 écarts à la lettre soumis un à un ; `check_markdown.py` PASS, exit 0, zéro défaut ; 2 fichiers écrits dans le pilot, 0 écriture chez la plateforme, 0 enregistrement git, 0 push.**

## 3. Décisions attendues de l'humain

Deux décisions.

> **D-1 — La lecture reconstruite de votre intention et les neuf écarts à la lettre sont-ils validés, et le run se lance-t-il avec le prompt réécrit ?**
>
> Le prompt réécrit garde vos deux livrables — l'état des lieux avec ses remédiations, et le plan d'amélioration — mais s'écarte de vos mots à neuf endroits, listés au bloc 6 : « complet » devient treize domaines fermés ; vos six domaines sont gardés et sept sont ajoutés ; « connectivités » est lu comme connecteurs de sources, intégrations tierces et fédération d'identité ; « l'application » devient la plateforme entière, le code amont du fork exclu ; « performances » rend un plan de mesure tant qu'aucune instance n'est joignable ; l'audit devient le bloc de diagnostic d'un run de conseil ; « en plus » devient « après » ; le lotissement planifie aussi les remédiations ; et la forme du résultat est fixée. L'intention que j'ai reconstruite — disposer d'une trajectoire unique et priorisée pour décider où investir — n'est pas dans vos mots : c'est à vous de la valider.
>
> **Recommandation : (a).** Source consultée : `references\INTENTION.md` (« si elle est reconstruite par l'agent, elle est validée par l'utilisateur avant d'exécuter ») et `references\RUN-CONSEIL.md` (blocs de la séquence, lecture seule sur le système étudié, remise en page HTML). Les neuf écarts ferment chacun un défaut nommé de l'analyse ; aucun ne retire un de vos domaines.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** valider la lecture et les neuf écarts, lancer le run avec le prompt réécrit tel quel | effort complexe × long pour le run lui-même (diagnostic, plan, lotissement, page) ; rien de plus pour ce prompt | exclut un plan sans frontière avec l'audit et tout chiffre de performance non mesuré |
| **(b)** valider avec amendements — répondre « D-1 (b) sauf écart n° X » | effort simple × court : le prompt est réédité sur les écarts refusés et rejugé avant lancement | exclut un lancement immédiat |
| **(c)** ne pas retenir le prompt réécrit | effort nul | exclut le bénéfice de l'analyse : le prompt d'origine reste noté 20 sur 100, avec ses trois défauts bloquants |

> **Si rien n'est décidé** : l'option (c) s'applique — le prompt réécrit reste déposé dans l'analyse, aucun run n'est lancé.

> **D-2 — Les deux fichiers de ce tour s'enregistrent-ils localement dans le dépôt du pilot ?**
>
> Ce tour a écrit deux fichiers dans le pilot — l'analyse et cette synthèse — et les index de dossiers se sont régénérés d'eux-mêmes. Le noyau du pilot demande un historique local dès la naissance d'un travail ; vos instructions personnelles demandent une autorisation explicite avant tout enregistrement dans git. Les deux textes se concilient par une question : je n'ai donc rien enregistré. L'arbre de travail porte par ailleurs des modifications d'autres sessions, que l'enregistrement laisserait de côté en ne prenant que les chemins de ce tour.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« git local dès la naissance, push sur GO humain ») et vos instructions de profil (« les actions à blast-radius élevé — commit, push […] — exigent toujours une autorisation explicite »). Un enregistrement local est réversible et ne publie rien.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** enregistrer localement les seuls chemins de ce tour, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** ne rien enregistrer | effort nul | exclut la traçabilité : les deux fichiers restent des modifications non suivies, exposées à la prochaine synchronisation du dépôt |

> **Si rien n'est décidé** : l'option (b) s'applique — les fichiers restent sur disque, non enregistrés.

## 4. Traité — avec sa preuve

- **L'analyse en huit couches est déposée et jugée** : étalon noté, chaîne logique (trois ruptures et une collision), inventaire de 16 défauts (3 bloquants, 12 majeurs, 1 mineur), factcheck de quatre prémisses, cinq causes d'échec, trois attaques et lentille de robustesse, implications d'échelle, prompt réécrit, contrat de douze critères, neuf écarts à la lettre, protocole de tests, changelog.
  - preuve : `output\03-etudes\20260919-L99-audit-et-plan-d-amelioration-plateforme.md` ; `check_markdown.py` → « Règles : M7, M10, M14, M18 — Verdict : PASS — Aucun défaut de lisibilité mécanisable détecté », exit 0.
- **Le score est mesuré dimension par dimension** : 20/100 avant (clarté 9/20, spécification 3/20, garde-fous 0/15, ancrage 4/15, vérifiabilité 1/15, robustesse 3/15), 86/100 projeté après.
  - preuve : tableaux « étalon » du chapitre 1 et « Score avant → après » du chapitre 8 du fichier cité.
- **Le prompt est ancré sur la plateforme réelle, relevée en lecture seule** : archive extraite sous le dossier de la plateforme, huit composants et un fork tenu par 17 patchs, 39 fichiers de décision d'architecture, 12 recettes datées, un audit de sécurité du fork du 15/05/2026.
  - preuve : sorties de `ls` sur la racine de l'archive, sur son dossier de patchs et sur `docs\decisions`, `docs\gates`, `docs\audits` ; `git log --oneline -5` dans le dossier de la plateforme → sortie vide.
- **Le nom du produit n'entre dans aucun fichier du pilot** : il est écrit `<plateforme>` dans l'analyse et dans cette synthèse.
  - preuve : `pseudonymeProduit()` de `scripts\lib-pseudonyme-produit.mjs` appelé sur le nom du dossier → rend le nom inchangé, donc sans pseudonyme au registre ; recherche du nom réel dans les deux fichiers du tour → 0 occurrence (commande au bloc 9).

## 5. Non traité — avec son motif

- Le run de conseil lui-même (diagnostic, plan d'amélioration, lotissement, page) — motif : dépendance à une décision humaine (D-1) ; vous avez demandé d'améliorer un prompt, pas de l'exécuter, et la loi n° 7 interdit de jouer un travail sur une intention reconstruite non validée.
- L'enregistrement local des fichiers du tour — motif : dépendance à une décision humaine (D-2).
- L'inscription d'un pseudonyme pour ce produit — motif : hors mandat ; la bibliothèque des pseudonymes écrit que l'inscription appartient à l'ingestion du premier lot du produit, pas à un relevé de lecture.
- La remise à niveau du poste signalée à l'ouverture (sept dépôts divergés de leur origine, dont le pilot) — motif : hors mandat ; elle relève de la synthèse du jour sur la synchronisation suspendue, et elle devra être réglée avant l'ouverture du run (règle de fraîcheur).

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore ce prompt : … » → **j'ai fait** l'analyse complète en huit couches avec prompt réécrit, et non une simple reformulation → **pourquoi** : le lexique d'invocation du noyau fait de ces mots un appel du skill `prompt-analyzer-l99`, dont c'est le livrable.
- **Vous avez écrit** le nom de la plateforme → **j'ai écrit** `<plateforme>` dans les deux fichiers, et le nom réel seulement à l'écran → **pourquoi** : le pilot ne fait entrer aucun nom de produit dans un fichier suivi (décision du 03/09).
- **Vous n'avez rien demandé** sur la plateforme elle-même → **j'ai lu** son README et son arborescence, sans rien y écrire → **pourquoi** : un prompt réécrit sans connaître l'objet aurait été aussi générique que le plan qu'il cherche à éviter ; lecture seule, déclarée ici.
- **Les neuf écarts entre votre prompt et le prompt réécrit**, à valider un par un par D-1 — le numéro est celui du tableau du chapitre 8 de l'analyse :

| N° | Vous avez écrit | Je propose | Pourquoi |
|---|---|---|---|
| 1 | « un plan d'amélioration complet » | treize domaines fermés, chacun couvert par des fiches ou par une ligne motivée | la complétude se mesure contre une liste fermée |
| 2 | « fonctionnels, architecture, performances, front, back, connectivités... » | vos six domaines gardés, sept ajoutés : IA et recherche documentaire, fork, exploitation, qualité et tests, sécurité au-delà de l'audit, coûts, documentation | ce sont les axes propres à cette plateforme que la liste ne nommait pas |
| 3 | « connectivités » | connecteurs de sources, API et intégrations tierces, fédération d'identité | le mot admet quatre lectures ; le prompt vous demande de corriger la mienne |
| 4 | « de l'application » | la plateforme : huit composants, et le fork analysé par ses patchs, code amont exclu | le code amont n'appartient pas à l'éditeur et absorberait le budget de lecture |
| 5 | « performances » | sans instance joignable : un plan de mesure, pas des conclusions | un chiffre non mesuré présenté comme une performance est une invention |
| 6 | « Je vais faire un audit » | l'audit devient le bloc de diagnostic du run ; mené à part, son rapport est l'entrant | une seule trajectoire exige que le plan consomme l'audit |
| 7 | « en plus » | « après » : le plan commence une fois le diagnostic accepté, avec une table de jonction | en parallèle, une amélioration peut annuler une remédiation déjà payée |
| 8 | « plan de remédiation » supposé fourni par l'audit | le lotissement du run planifie aussi les remédiations | l'audit rend des actions priorisées, sans effort ni ordre |
| 9 | rien sur la forme ni sur les limites | cinq questions d'ouverture à défauts déclarés, fiche à dix champs, fichier de données, page HTML, lecture seule, pseudonyme | ajouts purs : aucun ne restreint votre demande |

Intention : « Améliore ce prompt : […] Je souhaiterais en plus un plan d'amélioration complet de l'application sur les différents domaines » — reconstruite pour le fond : obtenir un prompt qui fasse produire un plan réellement utilisable pour décider, et pas seulement un prompt mieux tourné.

Test rétro : le prompt réécrit sert cette intention par sa frontière norme / ambition, sa cible dérivée de la documentation de la plateforme, sa fiche à dix champs et son contrat de douze critères ; ce qui ne la sert pas encore : la cible dépend de cinq réponses que vous seul pouvez donner, et le score de 86 est une projection tant que le run n'a pas été joué.

## 7. Risques

- Le run est lancé avant que le poste soit remis à niveau ;
  - signal : le contrôle de fraîcheur de l'ouverture affiche encore « Poste NON prêt » ;
  - parade : la règle de fraîcheur l'interdit (remèdes avant tout run) ; le sujet est porté par la synthèse du jour sur la synchronisation.
- La session du run s'ouvre dans l'archive au lieu du dossier de mission et charge les consignes d'agents de la plateforme comme des instructions ;
  - signal : la session cite des règles qui ne sont pas celles de la Factory, ou propose d'écrire dans l'archive ;
  - parade : le prompt réécrit fixe le lieu du run, traite ces consignes en donnée et exige l'empreinte de l'archive avant et après.
- Le plan rendu reste générique malgré le contrat, parce que la documentation produit de la plateforme est plus pauvre que prévu ;
  - signal : des fiches dont la cible cite une réponse par défaut plutôt qu'un document ;
  - parade : les cinq questions d'ouverture ; une fiche sans cible est retirée, pas adoucie.
- Le nom réel du produit entre dans un fichier suivi du pilot lors du run ;
  - signal : la porte de publication rejouée avant un push rend un constat bloquant ;
  - parade : le prompt réécrit impose le pseudonyme du registre et le nommage des livrables.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-1 avant celle qui attend D-2 ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent, le lancement du run en dernier parce qu'il dépend de D-1.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Rééditer le prompt réécrit sur les écarts refusés, rejouer `check_markdown.py` sur l'analyse, redéposer la synthèse (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 (b) | simple × court | le prompt reste tel qu'il est au chapitre 8 de l'analyse |
| A-2 | Enregistrer localement les seuls chemins de ce tour (l'analyse, cette synthèse, les index régénérés), sans push (neuve) | auto_ia | `dependance_bloc_3` — attend D-2 (a) | simple × court | les fichiers restent non enregistrés dans l'arbre de travail |
| A-3 | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) sauf écart n° X » ou « D-1 (c) » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — une intention reconstruite se valide par son auteur (loi n° 7) | simple × court | aucun run n'est lancé, le prompt d'origine reste à 20 sur 100 |
| A-4 | Trancher D-2 — répondre « D-2 (a) » ou « D-2 (b) » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — vos instructions réservent l'enregistrement git à votre autorisation | simple × court | rien n'est enregistré |
| A-5 | Ouvrir une session Claude Code dans le dossier de la plateforme (`<racine>\<plateforme>\`, pas dans l'archive extraite) et y lancer le prompt réécrit affiché sous cette restitution ; preuve de clôture : la session rend ses cinq questions d'ouverture (neuve) | manuelle_utilisateur | `decision` — le lancement d'un run est un feu vert humain, et la session s'ouvre chez le produit, jamais chez le pilot | simple × court | le plan d'amélioration n'est pas produit |

## 9. Traces

- Analyse : `output\03-etudes\20260919-L99-audit-et-plan-d-amelioration-plateforme.md` (prompt réécrit au chapitre 8).
- Cette synthèse : `output\04-plans\Digit-AI - Synthese L99 - Audit et plan d amelioration plateforme prompt reecrit - 20260919b.md`.
- Oracles : `check_markdown.py` (PASS, 1 passe) ; `oracle-synthese` sur ce fichier (verdict au journal d'oracles homonyme).
- Contrôle du nom : recherche insensible à la casse du nom du dossier de la plateforme dans les deux fichiers du tour → 0 occurrence.
- Git : aucun enregistrement dans ce tour ; pilot local `1514d3e4`.
- Aucune page HTML livrée dans ce tour.
