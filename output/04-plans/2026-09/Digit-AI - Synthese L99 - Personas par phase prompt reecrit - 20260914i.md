---
destinataire: humain
---

# Synthèse L99 — le prompt « personas par phase » est analysé et réécrit : il part de l'étude du 13/08 et se mesure sur les défauts réellement échappés ; il vous reste à valider la lecture de votre intention et sept écarts (14/09/2026)

Votre demande d'amélioration du prompt est traitée : l'analyse en huit couches est déposée, elle passe l'oracle de lisibilité, et le prompt réécrit est prêt à lancer l'étude. Ce que l'analyse change pour vous : la factory a déjà jugé, le 13 août, que des personas n'améliorent pas l'exactitude d'un agent et ne doivent jamais juger un livrable. Votre prompt l'ignorait et aurait refait cette étude. Il vise pourtant une question qu'elle n'a pas mesurée, celle de savoir si un regard d'exploitant, d'utilisateur ou de support trouve des défauts que les contrôles automatiques laissent passer. Le prompt réécrit garde votre intention, sépare trois sens du mot persona, et remplace l'opinion par une mesure faite sur dix défauts réels que vous avez trouvés après un contrôle vert. Rien n'est construit ni publié. Ce qui est attendu de vous : valider la lecture de votre intention et les sept écarts, ou les amender, puis dire si l'étude se lance.

## 1. En-tête d'identification

- **quoi** — appel du skill `prompt-analyzer-l99` par le lexique d'invocation RV-6 (règle du noyau qui fait de « Améliore ce prompt » un appel de skill) sur le prompt « étudier l'opportunité de personas apportant des points de vue ou des façons d'opérer différents à chaque phase d'un projet » ; analyse L99 complète (8 couches), prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; lectures seules sur les skills installés `experts-forge`, `contre-expertise`, `prompt-analyzer-l99` et sur les références du pilot.
- **quand** — 2026-09-14 09:00 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 08:50, aucun horodatage du message reçu disponible à l'outillage ; durée mesurée ≥ 10 min.
- **qui** — pilot `a3cde26` (aucun enregistrement fait dans ce tour) ; session Opus 5, aucune délégation, escalade de modèle : aucune ; oracles joués : `check_markdown.py` (règles de lisibilité M7 (un chapitre ouvre par ce qu'il apprend), M10 (mode de lecture des tableaux), M14 (marqueurs de travail oubliés), M18 (glose des identifiants)) et `oracle-synthese` sur ce document.

## 2. Verdict en une ligne

**Prompt d'origine 20/100 → prompt réécrit 88/100 (projeté) ; 17 défauts inventoriés dont 3 bloquants, tous clôturés au changelog ; 7 écarts à la lettre soumis un à un ; `check_markdown.py` PASS, exit 0, zéro défaut ; `oracle-synthese` PASS sur 43 règles au cinquième jugement (trois refus sur S23 (règle de glose des désignateurs courts), corrigés) ; analyse ajoutée à l'index git, aucun enregistrement, aucun push.**

## 3. Décisions attendues de l'humain

> **D-1 — La lecture de votre intention et les sept écarts à la lettre sont-ils validés, et l'étude d'opportunité se lance-t-elle avec le prompt réécrit ?**
>
> Le prompt réécrit s'écarte de votre texte à sept endroits, listés au bloc 6 : l'étude expérimente en lecture seule mais ne construit rien ; le mot persona est découpé en trois objets (grille de relecture par partie prenante, utilisateur simulé en tests, mode opératoire d'un agent) ; les phases deviennent celles de la factory, dans son ordre ; une mesure est imposée, avec trois chiffres que je propose et que vous pouvez changer (10 défauts, un gain d'au moins 2 défauts sur la relecture sans persona, 3 personas au plus) ; l'étude part du verdict du 13 août ; le bénéfice n'est plus présupposé. La loi n° 7 interdit de jouer une étude sur une intention reconstruite sans votre validation.
>
> **Recommandation : (a).** Source consultée : `references\INTENTION.md` (une intention reconstruite est validée par le demandeur avant exécution), `output\03-etudes\20260813-etude-personas-agents.md` §3 (verdict déjà rendu), `REGLES-PROJET.md` l. 319-331, R-31 (règle 31 : aucun objet durable sans verdict de non-recouvrement), `gabarits\ETUDE-OPPORTUNITE.md` (forme et oracle de l'étude). Le rétro-test coûte une campagne bornée et donne un verdict opposable, là où l'étude littéraire du 13/08 ne pouvait pas mesurer la couverture.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** valider la lecture et les sept écarts, lancer l'étude avec le prompt réécrit tel quel | effort complexe × moyen : relevé de l'existant, cinq sources datées, reconstitution de 10 livrables, 3 personas × 10 livrables × 2 passes, étude jugée, candidatures | exclut toute construction avant votre GO : l'étude rend un verdict et des candidatures, pas un mécanisme |
| **(b)** valider avec amendements — répondre « D-1 (b) sauf écart n° X » ou « D-1 (b), seuil à … » | même effort, plus la reprise du prompt sur les points amendés | exclut un lancement dans ce tour : le prompt est réédité, relu, puis joué |
| **(c)** ne pas lancer l'étude | effort nul | exclut toute mesure : le verdict du 13/08 reste la seule réponse, et le trou de couverture par partie prenante reste ouvert |

> **Si rien n'est décidé** : l'option (c) s'applique — le prompt réécrit reste déposé dans l'analyse, l'étude n'est pas jouée.

## 4. Traité — avec sa preuve

- **L'analyse L99 est déposée et jugée** : huit chapitres, étalon noté, inventaire de 17 défauts (3 bloquants, 13 majeurs, 1 mineur), audit de quatre prémisses implicites (deux fausses, une vraie à moitié, une périmée pour 3 sources sur 5), cinq causes d'échec, trois attaques et lentille de robustesse, prompt réécrit, contrat de sortie, sept écarts, protocole de tests, changelog.
  - preuve : `output\03-etudes\20260914-L99-personas-par-phase.md` ; `check_markdown.py` → « Règles : M7, M10, M14, M18 — Verdict : PASS — Aucun défaut de lisibilité mécanisable détecté », exit 0.
- **Le score est mesuré dimension par dimension** : 20/100 avant (clarté 9/20, spécification 3/20, garde-fous 1/15, ancrage 2/15, vérifiabilité 2/15, robustesse 3/15), 88/100 projeté après.
  - preuve : tableaux « Étalon » du chapitre 1 et « Score avant → après » du chapitre 8 du fichier cité.
- **L'existant a été relevé en lecture seule, avec citations** : l'étude du 13/08 et son verdict, la règle de restitution qui en découle (l. 133 et 534-536), 17 fiches `experts-forge` en statut ok et leur règle d'admission A/B, les trois angles de `contre-expertise`, la règle R-31, le gabarit d'étude et ses dix règles E1-E10.
  - preuve : lectures de `20260813-etude-personas-agents.md`, `gabarits\RESTITUTION.md`, `registre-experts.md` (17 lignes `ok`), `contre-expertise\SKILL.md` l. 34-51, `REGLES-PROJET.md` l. 319-331, `oracle-etude-opportunite.mjs` l. 6-22.
- **La base de mesure est comptée** : 150 fichiers de lots de retours archivés, 74 classes de défauts.
  - preuve : `ls input/00-retours/old | wc -l` → 150 ; lecture de `todo\CLASSES.json` par `node -e` → « classes 74 ».
- **L'analyse est ajoutée à l'index git, et l'index du dossier des études ne porte que cet ajout.**
  - preuve : `git add` puis `git status -sb` → `A  output/03-etudes/20260914-L99-personas-par-phase.md` ; `git diff -- output/03-etudes/README.md` → une ligne ajoutée pour l'analyse, compteur 54 → 55.

## 5. Non traité — avec son motif

- L'étude d'opportunité elle-même (relevé, état de l'art, rétro-test, options, verdict, candidatures) — motif : dépendance à une décision humaine (D-1) ; le message entier est l'entrant du skill L99, pas une commande d'exécution, et la loi n° 7 interdit de jouer une étude sur une intention reconstruite non validée.
- L'enregistrement local et le push de l'analyse et de cette synthèse — motif : dépendance à une décision humaine ; la consigne de session n'enregistre ni ne pousse sans demande, et R-38 §4 fait du push d'un livrable un GO humain.
- Aucune candidature au registre — motif : écarté ; le seul constat en chemin (un chemin périmé dans une entrée d'archive de l'étude du 13/08) touche une archive, qui est de l'histoire et ne se réécrit pas.

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore ce prompt : … » → **j'ai fait** l'analyse L99 complète (8 couches) avec prompt réécrit, et non une simple réécriture → **pourquoi** : le lexique RV-6 du noyau fait de « Améliore ce prompt » un appel du skill `prompt-analyzer-l99`, dont le livrable est cette analyse.
- **Vous avez écrit** « Etudie l'opportunité… » → **je n'ai pas** joué l'étude → **pourquoi** : le texte est l'entrant du L99 ; l'exécution attend D-1.
- **Les sept écarts entre votre prompt et le prompt réécrit**, poste par poste au chapitre 8 de l'analyse, section « Écarts à la lettre » : (1) « concevoir, construire et exécuter » devient une expérience en lecture seule, sans construction avant GO ; (2) « des personas » devient trois objets séparés ; (3) « points de vue ou façon d'opérer » : le point de vue d'abord, la façon d'opérer à part ; (4) les phases deviennent celles de la factory, déploiement lu comme mise en production ; (5) une mesure est ajoutée, avec les chiffres 10, 2 et 3 proposés par moi ; (6) l'étude part du verdict du 13/08 ; (7) le bénéfice n'est plus présupposé, ne rien faire reste une réponse possible.

## 7. Risques

- L'étude, une fois lancée, rend un tableau phase × persona sans mesure, parce que c'est le livrable le plus rapide à écrire ;
  - signal : une étude sans annexe de mesure, ou dont l'échantillon n'est pas listé avant les résultats ;
  - parade : le contrat de sortie du prompt réécrit la rejette sur ces deux points, et l'oracle d'étude refuse « prometteur » sans mesure (E6).
- Les défauts de l'échantillon ne se reconstituent pas, parce que le livrable d'avant retour n'est plus retrouvable dans l'historique du produit ;
  - signal : moins de 10 livrables reconstitués, ou moins de trois phases couvertes ;
  - parade : le prompt réécrit exige alors un verdict sous réserve avec la trace de la tentative, jamais un verdict inventé.
- L'analyse, indexée sans être enregistrée, est emportée par l'enregistrement d'une autre session qui travaille dans le pilot ;
  - signal : un enregistrement d'une autre session contenant `20260914-L99-personas-par-phase.md` ;
  - parade : acceptation déclarée ; le contenu reste intact, seul l'auteur de l'enregistrement change ; A-2 l'enregistre sur votre demande.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-1 avant celle qui attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Jouer l'étude d'opportunité avec le prompt réécrit du chapitre 8 de l'analyse (amendé si D-1 (b)) : relevé, état de l'art, rétro-test sur 10 défauts, options O0-O4, verdict, candidatures, restitution (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 ; à défaut, l'étude n'est pas jouée | complexe × moyen |
| A-2 | Enregistrer localement l'analyse, cette synthèse et l'index du dossier des études par `git commit --only -- <chemins>`, puis pousser le pilot, la porte des noms rejouée par le hook avant envoi (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-4 ; à défaut, les fichiers restent indexés en local | simple × court |
| A-3 | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) sauf écart n° X » ou « D-1 (c) » ; l'étude est jouée par l'IA (neuve) | manuelle_utilisateur | `decision` — loi n° 7 : une intention reconstruite est validée par le demandeur ; sinon : l'étude n'est pas jouée | simple × court |
| A-4 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'un livrable est un GO humain ; sinon : l'analyse reste indexée, non enregistrée | simple × court |

## 9. Traces

- Analyse L99 : `output\03-etudes\20260914-L99-personas-par-phase.md` (indexée, non enregistrée).
- Index du dossier : `output\03-etudes\README.md` (régénéré par le hook, une ligne ajoutée).
- Oracles : `check_markdown.py` (PASS, 1 passe) ; `oracle-synthese` sur ce fichier (PASS sur 43 règles au cinquième jugement ; trois jugements rouges sur S23, désignateurs M7, M10, M14, R-31 puis S23 lui-même sans glose, verts après glose ; un avertissement de style EC-2, 12 phrases de plus de 35 mots).
- Aucune page HTML livrée dans ce tour.
