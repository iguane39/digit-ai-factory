---
destinataire: humain
---

# Synthèse Étude — niveaux d'intervention : l'étude est menée et passe ses 3 contrôles, le verdict retient O3 en 3 étapes ; il vous reste à valider l'étape 1 et à dire si les fichiers s'enregistrent (25/09/2026)

L'étude que vous avez lancée est faite, et elle passe ses 3 contrôles. Sa réponse tient en une phrase : il faut 3 niveaux, mais le levier n'est pas le modèle. Une question courte attend aujourd'hui 6,3 minutes en médiane et reçoit 1 813 mots, parce que la session enchaîne 14,5 requêtes du modèle et rend presque toujours le format complet. Un petit modèle n'y change rien : au banc d'essai, Haiku n'a pas répondu plus vite que Sonnet et s'est trompé 2 fois sur 3. L'étude propose donc de fixer le niveau par ce que le tour fait vraiment : une réponse directe de 150 mots quand rien n'est modifié, une réponse outillée de 400 mots quand le tour cherche sans rien changer, le format actuel dès qu'il modifie quelque chose. Rien n'est enregistré ni publié. Ce qui est attendu de vous : valider la première étape, un essai d'une semaine qui ne touche pas au juge, et dire si les fichiers de ces 2 tours s'enregistrent.

## 1. En-tête d'identification

- **quoi** — exécution du prompt réécrit par l'analyse L99 (l'analyse de prompt en 8 couches) du tour précédent : étude d'opportunité au gabarit de la Factory, avec mesure préalable, banc d'essai de 9 sous-agents et rejeu de 10 questions réelles.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit (2 fichiers : l'étude et cette synthèse) ; lectures seules : transcripts des sessions du pilot, journal des hooks, doctrine de restitution et son juge, tableau de routage des modèles, documentation de Claude Code et de la plateforme Anthropic.
- **quand** — 2026-09-25 11:25 UTC+02:00 (Europe/Paris) ; début du tour à 10:56:44, horodatage du message « exécute le prompt » lu au transcript ; durée mesurée 29 min.
- **qui** — session Opus 5.5 à l'effort « max » (champ lu au transcript de la session) sur le pilot local `71649f4` ; sous-agents : 1 de mesure (Sonnet 5, repris du tour précédent), 1 de documentation (agent guide de Claude Code, repris), 9 du banc d'essai (3 Haiku 4.5, 3 Sonnet 5, 3 Opus 5.5) ; escalade de modèle : aucune ; oracles joués : `oracle-etude-opportunite` (10 règles du gabarit d'étude), `check_markdown.py`, `oracle-ecriture` et `oracle-synthese` sur ce document.
- **intention** — obtenir des réponses rapides et courtes aux questions simples, sans relancer tout le process, en gardant le process complet et son format pour les vrais travaux. Test rétro : le verdict sert cette intention par ses 3 niveaux, fixés par les actes du tour, et par son essai borné ; ce qui ne la sert pas encore : rien n'est en service tant que l'étape 1 n'est pas validée, et les gains restent des projections jusqu'à la revue du 2026-10-02.

## 2. Verdict en une ligne

**Étude PASS à `oracle-etude-opportunite` (10 règles sur 10), à `check_markdown.py` et à `oracle-ecriture` ; verdict O3 ; mesure sur 165 tours : une question courte coûte 6,3 min et 1 813 mots en médiane, pour 14,5 requêtes à 19,4 s ; banc d'essai : Haiku 1 réponse juste sur 3 en 61,4 s médianes, Sonnet 3 sur 3 en 57,2 s ; 2 fichiers écrits, 0 enregistrement git, 0 push.**

## 3. Décisions attendues de l'humain

Les 2 bloquants qui retiennent la suite de ce travail :

- l'étape 1 et l'inscription de la candidature au registre sont à l'arrêt ; il faut votre accord sur le verdict ; si rien n'est fourni, le dispositif reste tel quel et l'étude reste une proposition.
- l'enregistrement local des 4 fichiers des 2 derniers tours est à l'arrêt ; il faut votre accord ; si rien n'est fourni, ils restent sur disque, hors de l'historique du dépôt.

> **D-3 — Le verdict de l'étude `20260925-etude-opportunite-niveaux-d-intervention.md` est-il validé, et son étape 1 se lance-t-elle ?**
>
> L'étude retient O3 (3 niveaux fixés par les effets du tour, déployés en 3 étapes). L'étape 1 met en service le seul niveau Simple, la réponse directe de 150 mots au plus, sur l'exemption qui existe déjà : une référence `references\NIVEAUX.md`, un renvoi depuis le noyau, un mot-clé au lexique d'invocation, et la candidature au registre. Le juge ne change pas, l'effort non plus, et l'essai court du 2026-09-26 au 2026-10-02. La réponse outillée du niveau Moyen n'entre qu'à l'étape 2, si l'essai tient.
>
> **Recommandation : (a).** Source consultée : l'étude elle-même, sections « Mesure préalable » et « Verdict », et la règle du registre du pilot, `CLAUDE.md` : « tout entre en `candidat`, décision humaine ». La mesure montre que le délai vient du nombre de requêtes et de la longueur des réponses, que l'étape 1 réduit sans toucher au juge.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** valider O3 : l'IA mène l'étape 1, inscrit la candidature et rejoue la mesure le 2026-10-02 | effort simple × court pour l'étape 1 ; l'étape 2, plus tard, complexe × moyen | exclut tout changement de modèle en réponse directe et tout changement du juge pendant l'essai |
| **(b)** retenir le niveau Simple seul, sans étape 2 | effort simple × court | exclut les questions de recherche : dans le rejeu, 4 questions sur 8 relèvent du niveau Moyen et resteraient au format complet |
| **(c)** ne rien changer | effort nul | exclut tout gain : une question courte garde 6,3 minutes d'attente et 9,3 minutes de lecture en médiane |

> **Si rien n'est décidé** : l'option (c) s'applique ; l'étude reste déposée et rien ne change.

> **D-4 — Les 4 fichiers des 2 derniers tours s'enregistrent-ils localement dans le dépôt `digit-ai-factory` ?**
>
> Les 2 derniers tours ont écrit 4 fichiers dans le pilot : l'analyse `20260925-L99-niveaux-d-intervention.md` et sa synthèse, puis l'étude `20260925-etude-opportunite-niveaux-d-intervention.md` et cette synthèse. Cette question reprend celle du tour précédent, restée sans réponse, en l'étendant aux 2 fichiers de ce tour. L'arbre de travail porte aussi des modifications d'autres sessions, que l'enregistrement laisserait de côté en ne prenant que ces chemins.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fous (« git local dès la naissance, push sur GO humain »). Un enregistrement local est réversible et ne publie rien.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** enregistrer localement les 4 chemins, sans push | effort simple × court | exclut toute publication : le push reste un feu vert distinct |
| **(b)** ne rien enregistrer | effort nul | exclut la traçabilité : les 4 fichiers restent non suivis et absents de l'index de leur dossier |

> **Si rien n'est décidé** : l'option (b) s'applique ; les fichiers restent sur disque, non enregistrés.

## 4. Traité — avec sa preuve

Le tour a exécuté le prompt réécrit ; chaque élément ci-dessous porte la sortie qui l'établit.

- **L'étude est menée et déposée** : mesure préalable, 4 leviers pris un à un, 3 niveaux avec leurs 6 éléments et leurs exemples, invariants, rejeu de 10 questions, conflits de doctrine, options O0 à O4, verdict, test rétro, candidature proposée.
  - preuve : `output\03-etudes\20260925-etude-opportunite-niveaux-d-intervention.md` ; `oracle-etude-opportunite` → PASS sur ses 10 règles, celles du gabarit d'étude, exit 0 ; `check_markdown.py` → PASS, exit 0 ; `oracle-ecriture` → PASS, exit 0.
- **La mesure est refaite, pas recopiée** : 165 tours et 1 583 exécutions de hooks datées ; écarts avec la mesure du matin de 1,1 % au plus, dus à 2 défauts de méthode trouvés en route.
  - preuve : scripts de mesure du dossier de travail de la session ; 2 tours revérifiés à la main, « Où est la liste des éléments ? » (329,8 s) et « 12a » (1 942,7 s).
- **Le banc d'essai mesure le chemin du sous-agent** : Haiku 1 réponse juste sur 3 en 61,4 s médianes, Sonnet 3 sur 3 en 57,2 s, Opus 3 sur 3 en 99,9 s.
  - preuve : durées relevées par Claude Code à la fin de chaque sous-agent ; justesse vérifiée contre `CONTRAT-INTERFACE.md` lignes 347-352, `oracles\hook-restitution.mjs` ligne 582 et `gabarits\RESTITUTION.md` lignes 938-947 ; effort `max` hérité, lu dans les transcripts des sous-agents.
- **La piste de l'effort maximal, ouverte ce matin, est réfutée par requête** : Opus 5.5 à `max` génère en 12,8 s par requête, contre 15,5 s pour Opus 5 à `high`.
  - preuve : table « Modèle et effort, par requête » de l'étude, 79 et 6 tours.
- **Les faits de plateforme sont revérifiés** : l'effort se règle par `/effort`, par `claude --effort` ou par la clé `effortLevel`, jamais par un hook ; le frontmatter d'un skill ne porte pas de champ `model`.
  - preuve : documentation de Claude Code, pages `cli-reference`, `settings` et `skills`, consultées le 2026-09-25 par un sous-agent.
- **Le rejeu de 10 questions réelles est joué** : le hook déterministe se trompe 2 fois, les effets du tour 2 fois, toujours vers le trop léger, et chaque erreur est rattrapée par un autre mécanisme.
  - preuve : tableau du rejeu de l'étude ; commits relus à la main dans les transcripts : 1 confirmé, 2 infirmés, 3 douteux.
- **Aucun nom de produit ni de client n'entre dans l'étude** : les exemples citent des questions sans nom, et le produit de marketing porte son pseudonyme du registre.
  - preuve : recherche insensible à la casse de 31 noms de dépôts et de dossiers clients dans l'étude → 0 occurrence.

## 5. Non traité — avec son motif

- L'étape 1 et l'inscription de la candidature — motif : dépendance à une décision humaine (D-3).
- L'enregistrement local des 4 fichiers — motif : dépendance à une décision humaine (D-4).
- La mesure des sessions ouvertes chez les produits — motif : écarté, l'agent de mesure ne l'a pas conduite faute de temps ; critère de réouverture : la revue du 2026-10-02, avec le même script.
- Un essai de l'effort à tâche égale — motif : écarté, un seul réglage change à la fois pendant l'essai ; critère de réouverture : la revue du 2026-10-02.
- La durée réelle des 2 hooks d'index qui suivent chaque commande — motif : impossible à prouver ici, les transcripts ne la datent pas ; seul le chronométrage à la main du matin la donne.

## 6. Écarts à la lettre

- **Vous avez écrit** « exécute le prompt » → **j'ai fait** l'étude dans cette session, sans rien modifier hors de son fichier, et j'ai écrit en plus cette synthèse → **pourquoi** : la règle de restitution du pilot exige une synthèse en fichier pour un tour de travail, et le critère « aucun fichier modifié hors du livrable » du prompt ne pouvait pas l'en dispenser.
- **Le prompt demandait** une intention « marquée à valider » → **l'étude la marque à valider** et la tient pour acceptée jusqu'à votre réponse → **pourquoi** : « exécute le prompt » a lancé l'étude sans commenter la reconstruction.
- **Le prompt demandait** un exemple rédigé sur une vraie question pour chaque niveau → **j'ai donné** une réponse réelle déjà servie pour Simple, la réécriture d'une réponse réelle pour Moyen, et un renvoi à cette synthèse pour Complexe → **pourquoi** : un exemple de restitution complète aurait ajouté 2 000 mots à l'étude.
- **L'analyse L99 du matin faisait de l'effort maximal une piste** → **le verdict garde l'effort constant pendant l'essai** → **pourquoi** : la re-mesure par requête la réfute, et un seul réglage à la fois rend l'essai lisible.
- **Le prompt demandait** de chronométrer tous les hooks → **j'ai daté** tous ceux que les transcripts portent, et les 2 hooks d'index restent chronométrés à la main → **pourquoi** : Claude Code n'en garde pas la durée.

## 7. Risques

- Un niveau léger mis en service sert de raccourci à un tour lourd ;
  - signal : une réponse déclarée Simple dans un tour qui a écrit, commité ou publié ;
  - parade : c'est le critère d'arrêt anticipé de l'étape 1, puis le détecteur d'effets de l'étape 2.
- Le renvoi de l'étape 1 fait déborder le noyau, qui est plein ;
  - signal : `oracle-claude-md.mjs` rend FAIL sur sa règle de taille ;
  - parade : le renvoi prend la place d'un passage de même longueur, et l'oracle se rejoue avant tout enregistrement.
- La revue du 2026-10-02 mesure la mauvaise population ;
  - signal : une médiane « Simple » calculée sur des tours qui n'ont pas déclaré ce niveau ;
  - parade : la première ligne « Niveau : X » rend le filtre exact.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-3 avant celle qui attend D-4, parce que D-3 porte le gain ; puis les décisions humaines, dans le même ordre.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Mener l'étape 1 : écrire `references\NIVEAUX.md`, placer son renvoi dans la ligne « Restitution » du noyau sans dépasser 6 144 octets, ajouter le mot-clé au lexique d'invocation, inscrire la candidature par `todo\journaliser.mjs`, rejouer `oracle-claude-md.mjs`, puis rejouer la mesure le 2026-10-02 (neuve) | auto_ia | `dependance_bloc_3` — attend D-3 | simple × court | les questions courtes gardent 6,3 minutes d'attente et 1 813 mots en médiane |
| A-2 | Enregistrer localement les 4 fichiers des 2 tours par `git commit --only`, sans push (neuve) | auto_ia | `dependance_bloc_3` — attend D-4 | simple × court | les 4 fichiers restent non suivis |
| A-3 | Trancher D-3 en répondant « D-3 a », « D-3 b » ou « D-3 c » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — changer la doctrine du pilot revient à l'humain | simple × court | rien ne change |
| A-4 | Trancher D-4 en répondant « D-4 a » ou « D-4 b » ; preuve de clôture : votre réponse (neuve) | manuelle_utilisateur | `decision` — l'enregistrement dans git attend votre accord | simple × court | rien n'est enregistré |

## 9. Traces

- Étude : `output\03-etudes\20260925-etude-opportunite-niveaux-d-intervention.md`.
- Analyse L99 du tour précédent : `output\03-etudes\20260925-L99-niveaux-d-intervention.md`.
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Etude - Niveaux d intervention verdict O3 en 3 etapes - 20260925c.md`.
- Mesure : scripts et résultats dans le dossier de travail temporaire de la session, hors dépôt.
- Sources externes : documentation de Claude Code et de la plateforme Anthropic, listée à la section « État de l'art daté » de l'étude ; vitesse de lecture : [IReST, Investigative Ophthalmology & Visual Science, 2012](https://iovs.arvojournals.org/article.aspx?articleid=2166061) et [fiche IReST de l'Institut Nazareth et Louis-Braille](https://extranet.inlb.qc.ca/recherche-et-innovation/orvis/irest-fiche-orvis/).
- Oracles : `oracle-etude-opportunite` PASS (10 règles sur 10) ; `check_markdown.py` PASS ; `oracle-ecriture` PASS ; `oracle-synthese` sur ce fichier.
- Git : aucun enregistrement dans ce tour ; pilot local `71649f4`.
- Aucune page HTML livrée dans ce tour.
