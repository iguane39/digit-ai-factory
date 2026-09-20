---
destinataire: humain
---

# Synthèse L99 — le prompt « forge pour la gestion de réseaux sociaux » est analysé et réécrit : il part de l'étude du 11/09 et pose la forge comme une question ; il vous reste à dire pour qui la capacité est construite et à valider neuf écarts (17/09/2026)

Votre demande d'amélioration du prompt est traitée : l'analyse en huit couches est déposée, elle passe le contrôle de lisibilité, et le prompt réécrit est prêt à lancer l'étude. Ce que l'analyse change pour vous : la factory a déjà répondu à la moitié de la question il y a 6 jours. L'étude du 11 septembre sur une forge de communication et de marketing a refusé toute forge nouvelle, a rangé la publication sur un réseau parmi les livrables couverts sans contrôle, et a écarté le raccordement à un réseau social. Votre prompt l'ignorait et aurait refait cette étude. Il vise pourtant ce qu'elle n'a pas instruit, la gestion dans la durée avec une cible, un calendrier, une mesure et un suivi de l'engagement. Le prompt réécrit garde votre intention, part du verdict du 11 septembre, et exige de vérifier d'où viendront les chiffres de performance avant de promettre leur suivi. Rien n'est construit ni publié. Ce qui est attendu de vous : dire pour qui cette capacité est construite, valider ou amender les neuf écarts, puis dire si l'étude se lance.

## 1. En-tête d'identification

- **quoi** — appel du skill `prompt-analyzer-l99` par le lexique d'invocation RV-6 (règle du noyau qui fait de « Améliore ce prompt » un appel de skill) sur le prompt « Lance une étude d'opportunités sur une forge pour la gestion de réseaux sociaux particuliers et professionnels… » ; analyse L99 complète (8 couches), prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; lectures seules sur le produit `digit-ai-marketing`, sur le skill installé `linkedin-post-generator` et sur les références du pilot.
- **quand** — 2026-09-17 07:45 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 07:33, aucun horodatage du message reçu disponible à l'outillage ; durée mesurée ≥ 12 min.
- **qui** — pilot `b284504` (aucun enregistrement fait dans ce tour) ; session Fable 5.1, aucune délégation, escalade de modèle : aucune ; oracles joués : `check_markdown.py` (règles de lisibilité M7 (un chapitre ouvre par ce qu'il apprend), M10 (mode de lecture des tableaux), M14 (marqueurs de travail oubliés), M18 (glose des identifiants)) et `oracle-synthese` sur ce document.

## 2. Verdict en une ligne

**Prompt d'origine 22/100 → prompt réécrit 87/100 (projeté) ; 22 défauts inventoriés dont 3 bloquants, tous clôturés au changelog ; 9 écarts à la lettre soumis un à un ; `check_markdown.py` PASS, exit 0, un avertissement non bloquant ; `oracle-synthese` PASS au second jugement (un refus sur S43 (règle de style de la restitution), corrigé) ; analyse ajoutée à l'index git, aucun enregistrement, aucun push.**

## 3. Décisions attendues de l'humain

> **D-1 — Pour qui la gestion de réseaux sociaux est-elle construite, et l'étude d'opportunité se lance-t-elle avec le prompt réécrit et ses neuf écarts ?**
>
> Votre phrase sur la gestion de réseaux sociaux admet trois bénéficiaires, et chacun produit un objet différent : la présence de Digit-AI elle-même (profil du dirigeant et page de l'entreprise, logés dans le produit de communication né le 11 septembre), des clients de Digit-AI (capacité à plusieurs marques), ou un logiciel de gestion de réseaux sociaux vendu à des particuliers et des professionnels. Le prompt réécrit retient par défaut la première lecture, lit « particuliers et professionnels » comme deux types de comptes, propose LinkedIn comme premier réseau, et s'écarte de votre texte à neuf endroits listés au bloc 6. La loi n° 7 interdit de jouer une étude sur une intention reconstruite sans votre validation.
>
> **Recommandation : (a).** Source consultée : `references\INTENTION.md` (une intention reconstruite est validée par le demandeur avant exécution) ; `output\03-etudes\20260911-etude-opportunite-communication-marketing-ao.md` §2 ter, §5 et §5.4 (forge refusée, produit de communication né, raccordement à un réseau social écarté) ; `REGLES-PROJET.md` l. 235-248, R-28 (règle 28 : les quatre conditions de naissance d'une forge) ; le fichier `output\03-publications\README.md` du produit `digit-ai-marketing` (« vide. Ce dossier ouvre au palier V2 »). La première lecture est la seule qui dispose déjà d'un porteur, d'une marque et d'un premier cas réel ; les deux autres restent ouvertes par une réponse d'un mot.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** valider la première lecture (la présence de Digit-AI) et les neuf écarts, lancer l'étude avec le prompt réécrit tel quel | effort complexe × moyen : relevé de neuf existants, état des onze candidatures du 11/09, vérification de l'accès aux chiffres par réseau et type de compte, cinq sources datées, étude et page jugées, candidatures | exclut toute construction et toute publication avant votre accord ; exclut d'instruire une offre pour des clients ou un logiciel à vendre |
| **(b)** valider avec amendements — répondre « D-1 (b) lecture clients », « D-1 (b) lecture logiciel », « D-1 (b) sauf écart n° X » ou « D-1 (b) réseaux : … » | même effort, plus la reprise du prompt sur les points amendés ; la lecture logiciel fait de l'étude l'amont d'un run de construction | exclut un lancement dans ce tour : le prompt est réédité, relu, puis joué |
| **(c)** ne pas lancer l'étude | effort nul | exclut toute réponse sur la durée, la mesure et l'engagement ; le verdict du 11/09 reste seul, sa revue du 2026-10-09 inchangée |

> **Si rien n'est décidé** : l'option (c) s'applique — le prompt réécrit reste déposé dans l'analyse, l'étude sur la gestion de réseaux sociaux n'est pas jouée.

## 4. Traité — avec sa preuve

- **L'analyse L99 est déposée et jugée** : huit chapitres, étalon noté, inventaire de 22 défauts (3 bloquants, 17 majeurs, 2 mineurs), audit de quatre prémisses implicites (deux fausses à date, deux invérifiables), cinq causes d'échec, trois attaques et lentille de robustesse, prompt réécrit, contrat de sortie, neuf écarts, protocole de tests, changelog.
  - preuve : `output\03-etudes\20260917-L99-gestion-reseaux-sociaux.md` ; `check_markdown.py` → « Règles : M7, M10, M14, M18 — Verdict : PASS », exit 0, un avertissement M14 sur le nom de fichier `TODO.jsonl` cité comme source.
- **Le score est mesuré dimension par dimension** : 22/100 avant (clarté 10/20, spécification 5/20, garde-fous 1/15, ancrage 1/15, vérifiabilité 2/15, robustesse 3/15), 87/100 projeté après.
  - preuve : tableaux « Étalon » du chapitre 1 et « Score avant → après » du chapitre 8 du fichier cité.
- **L'existant a été relevé en lecture seule, avec citations** : l'étude du 11/09 et son verdict, l'état de ses onze candidatures, le produit `digit-ai-marketing` (publications et personas vides), le skill `linkedin-post-generator` installé hors de toute forge, la liste des intégrations déclarées.
  - preuve : lecture de `todo\TODO.jsonl` par `node -e` → TF-1021, TF-1022, TF-1024, TF-1025 « corrige » ; TF-1023, TF-1026 à TF-1030 « en_cours » ; TF-1031 « decide » ; recherche d'un nom de réseau social dans `references\INTEGRATIONS-FOURNISSEURS.md` → 0 occurrence ; `output\03-publications\README.md` du produit → « État au 11/09/2026 : vide ».
- **L'antériorité au registre est bornée par nom** : 372 items, quatre titres répondent au lexique des réseaux sociaux, un seul porte sur le sujet (la barre de qualité d'une publication, encore en cours).
  - preuve : même lecture par `node -e` → « items 372 hits 4 » ; la recherche par structure est prescrite à l'étude, pas faite ici.
- **L'analyse est ajoutée à l'index git.**
  - preuve : `git add -- output/03-etudes/20260917-L99-gestion-reseaux-sociaux.md` → exit 0, un avertissement de fin de ligne.

## 5. Non traité — avec son motif

- L'étude d'opportunité elle-même (relevé, accès aux données, état de l'art, options, verdict, candidatures, page) — motif : dépendance à une décision humaine (D-1) ; le message entier est l'entrant du skill L99, pas une commande d'exécution, et la loi n° 7 interdit de jouer une étude sur une intention reconstruite non validée.
- La vérification de l'accès aux chiffres de chaque plateforme — motif : écarté de ce tour ; l'analyse classe cette prémisse « invérifiable » et prescrit la vérification à l'étude, avec des sources datées, plutôt que de trancher de mémoire.
- L'enregistrement local et le push de l'analyse et de cette synthèse — motif : dépendance à une décision humaine ; R-38 §4 (règle 38 : publication et push sur accord humain) fait du push d'un livrable un geste sur accord.
- La candidature sur le skill `linkedin-post-generator` (hors de toute forge, nom d'une personne dans sa description, règles d'algorithme de 2025 en dur) — motif : écarté de ce tour ; l'étude l'examine à sa table de non-recouvrement et émettra la candidature avec sa preuve d'audit. Si D-1 (c), A-3 la journalise seule.

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore ce prompt : … » → **j'ai fait** l'analyse L99 complète (8 couches) avec prompt réécrit, et non une simple réécriture → **pourquoi** : le lexique RV-6 du noyau fait de « Améliore ce prompt » un appel du skill `prompt-analyzer-l99`, dont le livrable est cette analyse.
- **Vous avez écrit** « Lance une étude… » → **je n'ai pas** joué l'étude → **pourquoi** : le texte est l'entrant du L99 ; l'exécution attend D-1.
- **Les neuf écarts entre votre prompt et le prompt réécrit**, poste par poste au chapitre 8 de l'analyse, section « Écarts à la lettre » : (1) « Lance » devient une exécution après validation de trois hypothèses ; (2) « sur une forge » devient une hypothèse, avec un jeu de cinq options où forge, extension, type de run et logiciel sont de plein droit ; (3) l'étude du 11/09 devient le point de départ obligatoire ; (4) « particuliers et professionnels » est lu comme deux types de comptes, le profil d'une personne et la page d'une organisation ; (5) une liste fermée de réseaux est ajoutée, LinkedIn d'abord, ordre proposé par moi ; (6) vos cinq fonctions deviennent une chaîne fermée de dix, où j'ajoute objectifs, ligne éditoriale, publication, animation et itération ; (7) performance et engagement sont conditionnés à une vérification d'accès aux chiffres, et écartés si aucune voie gratuite n'existe ; (8) « gestion » n'inclut ni publication ni création de compte par l'étude ; (9) l'achat d'un outil du marché est chiffré dans chaque option, comme dépense à décider par vous.

## 7. Risques

- L'étude, une fois lancée, décrit un suivi de performance et d'engagement sans avoir vérifié l'accès aux chiffres, parce que c'est la partie la plus rapide à écrire ;
  - signal : une étude sans tableau d'accès par réseau et par type de compte, ou dont une fonction de mesure n'a pas de source nommée ;
  - parade : le contrat de sortie du prompt réécrit la rejette sur ce point, et toute fonction sans voie d'accès doit être écartée par écrit.
- La lecture par défaut (la présence de Digit-AI) est fausse, et l'étude instruit le mauvais objet ;
  - signal : votre réponse à D-1 nomme des clients ou un logiciel ;
  - parade : l'option (b) rouvre le prompt sur un mot ; aucune exécution n'a lieu avant cette réponse.
- L'analyse, indexée sans être enregistrée, est emportée par l'enregistrement d'une autre session qui travaille dans le pilot ;
  - signal : un enregistrement d'une autre session contenant `20260917-L99-gestion-reseaux-sociaux.md` ;
  - parade : acceptation déclarée ; le contenu reste intact, seul l'auteur de l'enregistrement change ; A-2 l'enregistre sur votre demande.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-1 avant celles qui attendent un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Jouer l'étude d'opportunité avec le prompt réécrit du chapitre 8 de l'analyse (amendé si D-1 (b)) : relevé, accès aux chiffres, état de l'art, options O0-O4 (jeu fermé de cinq options du gabarit d'étude), verdict, candidatures, page, restitution (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 ; à défaut, l'étude n'est pas jouée | complexe × moyen |
| A-2 | Enregistrer localement l'analyse, cette synthèse et les index de dossiers par `git commit --only -- <chemins>`, puis pousser le pilot, la porte des noms rejouée par le hook avant envoi (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-5 ; à défaut, les fichiers restent indexés en local | simple × court |
| A-3 | Journaliser seule la candidature sur le skill `linkedin-post-generator` par `todo\journaliser.mjs`, si l'étude n'est pas lancée (neuve) | auto_ia | `dependance_bloc_3` — ne vaut que si D-1 (c) ; à défaut, le constat reste écrit dans l'analyse sans entrer au registre | simple × court |
| A-4 | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) lecture clients », « D-1 (b) sauf écart n° X » ou « D-1 (c) » ; l'étude est jouée par l'IA (neuve) | manuelle_utilisateur | `decision` — loi n° 7 : une intention reconstruite est validée par le demandeur ; sinon : l'étude n'est pas jouée | simple × court |
| A-5 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'un livrable est un geste sur accord ; sinon : l'analyse reste indexée, non enregistrée | simple × court |

## 9. Traces

- Analyse L99 : `output\03-etudes\20260917-L99-gestion-reseaux-sociaux.md` (indexée, non enregistrée).
- Index des dossiers : `output\03-etudes\README.md` et `output\04-plans\README.md` (régénérés par le hook).
- Oracles : `check_markdown.py` (PASS, 1 passe) ; `oracle-synthese` sur ce fichier (PASS au second jugement ; un jugement rouge sur S43 (règle de style de la restitution, qui applique le plancher d'écriture), une durée écrite en toutes lettres, verte après passage en chiffres ; un avertissement de style EC-2 (phrases de plus de 35 mots), 15 phrases sur 105).
- Aucune page HTML livrée dans ce tour.
- Signalement de session, sans lien avec ce travail : le connecteur claude.ai « Vibe Prospecting » attend une autorisation dans les réglages des connecteurs de claude.ai ; il reste indisponible d'ici là.
