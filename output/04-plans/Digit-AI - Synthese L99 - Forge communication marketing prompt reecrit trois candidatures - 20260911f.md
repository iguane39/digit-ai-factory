---
destinataire: humain
---

# Synthèse L99 — le prompt « forge communication & marketing » est réécrit et jugé, trois constats en passant sont au registre ; il vous reste à valider la lecture de votre intention pour que l'étude d'opportunité soit jouée (11/09/2026)

Votre demande d'amélioration du prompt est traitée : l'analyse en huit couches est déposée et passe l'oracle de lisibilité, et le prompt réécrit est prêt à lancer l'étude d'opportunité au gabarit du pilot. Ce que l'analyse change pour vous : l'existant est bien plus fourni que le prompt ne le supposait (quatre skills de communication et de propale, un pipeline qui a déjà produit une propale réelle, un expert des marchés publics), mais il est fragile : ces skills ne sont versionnés par aucune forge, l'archive du skill PowerPoint ne porte pas la charte qu'elle promet, et la marque Digit-AI est écrite en dur avec deux valeurs contradictoires selon le support. Ces trois faits sont au registre des candidats. Rien de ce tour n'est publié. Ce qui est attendu de vous : valider ou corriger la lecture reconstruite de votre intention et les huit écarts à la lettre, puis dire si l'étude se lance avec ce prompt.

## 1. En-tête d'identification

- **quoi** — appel du skill `prompt-analyzer-l99` par le lexique d'invocation RV-6 (la règle du noyau qui fait de « Améliore le prompt » un appel de skill, jouée par le hook `hook-lexique`) sur le prompt « forge communication & marketing » ; analyse L99 complète (8 couches), prompt réécrit, contrat de sortie, protocole de tests ; trois constats en passant journalisés au registre TODO-FORGE.
- **sur quoi** — le pilot `digit-ai-factory` (seul dépôt écrit) ; lectures seules sur `digit-ai-forge-agents` (archives de skills, agents compilés, registre des experts), `digit-ai-forge-design` (catalogue), le socle `digit-ai-page-html` installé et le canal confidentiel.
- **quand** — 2026-09-11 11:25 UTC+02:00 (Europe/Paris) ; la première mesure d'horloge du tour est 11:02 (aucun horodatage du message reçu n'est disponible à l'outillage) ; durée estimée ≈ 35 min, mesurée ≥ 23 min.
- **qui** — pilot local `b1c80b4`, bâti sur `d65c578` qui est la synthèse 20260911e d'une autre session (D-13 (a) exécutée à 10:57, pilot publié jusqu'à `d65c578` puis `0da9a54`) ; `origin/main` relu par `git fetch` : le pilot est **1 enregistrement en avance**, le mien ; session Fable 5.1, aucune délégation (escalade : aucune) ; oracles joués : `check_markdown.py` avec ses quatre règles de lisibilité du Markdown : M7 (ouverture de chapitre par ce que le lecteur apprend), M10 (mode de lecture de chaque tableau), M14 (marqueurs de travail laissés dans le texte), M18 (glose de tout identifiant à son premier emploi) ; `todo\ingerer-lot.mjs`, `todo\oracle-todo.mjs`, `oracle-synthese` (ce document, trois passes : FAIL 9 règles, FAIL 4 règles, PASS).

## 2. Verdict en une ligne

**Prompt d'origine 30/100 → prompt réécrit 88/100 (projeté) ; 21 défauts inventoriés dont 3 bloquants, tous clôturés au changelog ; 8 écarts à la lettre soumis un à un ; `check_markdown.py` PASS (1 avertissement M14 légitime : le document parle du registre TODO) ; 3 candidatures ingérées en candidat (lot accaa8bb822b, TF-1021 à TF-1023), `CLASSES.json` 1.9.0 → 1.10.0 (66 → 69 classes, 3 avertissements « classe suspecte » non bloquants), `oracle-todo` PASS, vues régénérées (241 actifs, 69 classes, 112 récidives) ; 1 enregistrement local `b1c80b4` (10 fichiers), 0 push ; une collision d'indice (deux « 20260911e » dans `output\04-plans\`, l'autre session ayant enregistré la sienne à 10:57) résolue en prenant l'indice « f ».**

## 3. Décisions attendues de l'humain

Deux décisions.

> **D-1 — La lecture reconstruite de votre intention et les huit écarts à la lettre sont-ils validés, et l'étude d'opportunité se lance-t-elle avec le prompt réécrit ?**
>
> Le prompt réécrit conserve vos mots (l'intention y est citée mot pour mot) mais il s'écarte de la lettre à huit endroits, tous listés au bloc 6 : le mot « forge » devient une hypothèse à prouver ; le jeu d'options est rouvert, de O0 (l'option de ne rien faire) à O4 (la forge unique telle que demandée), en passant par l'extension de forge-agents, un type de run du pilot, et une forge sur la seule partition qui passe la règle d'admission ; « communication & marketing » est partitionné en trois métiers ; « tous ses livrables » devient une typologie fermée à valider ; la capacité générique est séparée de l'instance Digit-AI confidentielle ; l'interne est posé en question ; le tour est borné à l'étude ; le marketing digital est renvoyé à forge-seo-geo. La loi n° 7 interdit de jouer une étude sur une intention devinée : c'est vous qui validez la lecture.
>
> **Recommandation : (a).** Source consultée : `references\INTENTION.md` (« si elle est reconstruite par l'agent, elle est VALIDÉE par le demandeur avant d'exécuter ») et `gabarits\ETUDE-OPPORTUNITE.md` (seuil : l'étude est obligatoire, l'item crée un objet durable et touche au moins trois forges ; jeu fermé O0-O4 ; verdict unique) ; `REGLES-PROJET.md` §H R-28 pour l'hypothèse « forge ».

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) valider la lecture et les huit écarts, lancer l'étude avec le prompt réécrit tel quel | effort complexe × moyen (relevé de onze sources, trois tests R-28, état de l'art, cinq options, test rétro) | exclut de partir de la lettre « une ou plusieurs forges » : la forge devra prouver son admission comme toute autre option |
| (b) valider avec amendements — répondre « D-1 (b) sauf écart n° X » ou « D-1 (b), interne oui/non » | même effort, plus la reprise du prompt sur les points amendés avant le lancement | exclut un lancement dans ce tour : le prompt est réédité, rejugé, puis joué |
| (c) ne pas lancer l'étude maintenant | effort nul | exclut toute suite : les quatre skills restent hors versionnement et la marque contradictoire, sans porteur désigné |

> **Si rien n'est décidé** : l'option (c) s'applique — le prompt réécrit reste déposé dans l'analyse, l'étude n'est pas jouée, les trois candidatures restent en candidat.

> **D-2 — Les trois candidatures nées des constats en passant sont-elles décidées, et leurs trois classes neuves conservées au référentiel ?**
>
> Il s'agit des trois faits relevés en chemin sur l'existant de communication : des skills exercés dans un run réel qui ne sont versionnés par aucune forge, une archive de skill PowerPoint qui charge une charte qu'elle ne contient pas, et une marque Digit-AI portée par deux chartes contradictoires sans source unique. Tout entre en candidat et la décision est humaine. Les trois classes ont été créées au référentiel parce qu'aucune clé existante ne nommait la règle qui aurait évité chaque constat ; l'ingestion les a marquées « classe suspecte » (créées sans clôture fondatrice, moins de trente jours après un retour d'une classe voisine), ce qui est une contre-métrique du tableau de bord, pas un refus. Si vous jugez qu'une voisine suffit (`contrat-de-sortie-sans-domicile`, `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas`, `deux-regles-du-socle-inconciliables`), la classe neuve se retire et la candidature se rattache ; les identifiants des trois candidatures sont au bloc 4.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (« tout entre en candidat, décision humaine, clôture sur gains constatés ») et `todo\CLASSES.json` (règle : « une clé nouvelle se crée ICI, datée, sourcée, rattachée à sa famille » ; une classe est « la règle qui aurait évité le retour », et les voisines nomment d'autres règles).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) décider les trois candidatures et conserver les trois classes | effort simple × court (trois décisions journalisées) ; les remèdes eux-mêmes sont des mandats d'écriture chez forge-agents et forge-design | exclut de réduire le référentiel : trois clés de plus, dont la fécondité se mesurera aux récidives |
| (b) décider les trois candidatures mais les rattacher aux classes voisines et retirer les trois clés neuves | effort simple × court, plus la réédition de `CLASSES.json` et la rectification des trois lignes du registre | exclut que le registre nomme la règle exacte (versionnement en source, chemin cité résolu dans le paquet, marque à source unique) |
| (c) laisser les trois en candidat | effort nul | exclut tout porteur : les skills restent en archive ignorée, la charte absente, la marque double |

> **Si rien n'est décidé** : l'option (c) s'applique — les trois restent en candidat, les classes restent au référentiel et comptent à la contre-métrique.

## 4. Traité — avec sa preuve

- **L'analyse L99 est déposée et jugée** : huit chapitres, étalon noté, inventaire de 21 défauts (3 bloquants, 16 majeurs, 2 mineurs), factcheck de six prémisses, cinq causes d'échec, trois attaques et lentille de robustesse, implications d'échelle, prompt réécrit, contrat de sortie, huit écarts à la lettre, protocole de tests, changelog.
  - preuve : `C:\dev\digit-ai-factory\output\03-etudes\20260911-L99-forge-communication-marketing.md` (7 888 mots, chemin absolu vérifié par l'oracle qui l'a lu) ; `check_markdown.py` **Verdict : PASS**, règles M7, M10, M14, M18, exit 0, un avertissement M14 (le mot TODO désigne le registre) ; rejoué après l'édition qui retire deux prénoms d'interlocuteurs (porte de publication) : **PASS**.
- **Le score est mesuré dimension par dimension** : 30/100 avant (clarté 12/20, spécification 4/20, garde-fous 2/15, ancrage 4/15, vérifiabilité 3/15, robustesse 5/15), 88/100 projeté après.
  - preuve : tableau « Score avant → après » du chapitre 8 du fichier cité.
- **L'existant a été relevé en lecture seule, avec citations** : quatre archives de skills sous `input\03-skills\` de forge-agents, dossier ignoré par git ; les quatre agents compilés du pipeline P4 (le pipeline de propale à quatre agents de forge-agents : contenu, chiffrage, rendu, revue) chargeant ces skills ; propale réelle du 24/07/2026 ; trois experts « ok » ; catalogue cat-des-01, cat-des-06, cat-seo-01…07 ; canal confidentiel.
  - preuve : `git check-ignore -v` joué dans `C:\dev\digit-ai-forge-agents` sur l'archive de communication → `.gitignore:35 input/` ; `unzip -l digit-ai-pptx.skill` → 4 fichiers, aucun `references\charte.md`, `layouts.md`, `assets.md` ; `ls ~/.claude/skills` → 24 skills, aucun des quatre ; `registre-experts.md` l.13, 16, 19 ; `find MARQUE.md / tokens.css` → 0 fichier.
- **Trois constats en passant sont au registre en candidat, classés** (TF-1021 `capacite-hors-versionnement-de-forge`, TF-1022 `reference-chargee-toujours-absente-du-paquet`, TF-1023 `marque-emettrice-portee-par-deux-chartes`), et les trois classes portent leur candidature fondatrice.
  - preuve : `node todo\ingerer-lot.mjs … --sans-fetch` → « [OK] 3 candidature(s) ingérée(s) en CANDIDAT (lot accaa8bb822b) », 3 avertissements « CLASSE SUSPECTE » ; `C:\dev\digit-ai-factory\todo\CLASSES.json` version 1.10.0, 69 classes, `fondee_par` posées ; `node todo\oracle-todo.mjs` → **verdict PASS** (rejoué après la pose des `fondee_par` : PASS).
- **Les vues du registre sont régénérées.**
  - preuve : `generer-vue.mjs` → « TODO.md générée — 241 actifs, 19 forges cibles » exit 0 ; `generer-page.mjs` → « 241 items, 19 forges » exit 0 (vue générée du registre, pas un livrable) ; `generer-recidives.mjs` → « 69 classe(s), 112 récidive(s), 20 relevé(s) » exit 0.
- **Tout est enregistré localement, sur les seuls chemins du tour, et l'état du dépôt est relu à la source.**
  - preuve : `git commit --only` → `b1c80b4`, « 10 files changed, 785 insertions(+), 17 deletions(-) » ; `git fetch origin` puis `git status -sb` → `main...origin/main [ahead 1]` ; `git log -1 -- <synthèse 20260911e de l'autre session>` → `d65c578 2026-09-11 10:57:33` ; les fichiers modifiés par d'autres sessions (`input\00-retours\README.md`, `todo\HERITAGE-RELEVES.jsonl`, deux lots de retours non ingérés) sont laissés hors de l'enregistrement.

## 5. Non traité — avec son motif

- L'étude d'opportunité elle-même (le « construis une étude d'opportunités » du prompt d'origine) — motif : dépendance à une décision humaine (D-1) ; la loi n° 7 interdit de jouer une étude sur une intention reconstruite non validée, et l'appel du skill fait du message entier l'entrant du L99, pas une commande d'exécution.
- L'audit `ameliore-un-skill` des quatre skills existants et la recherche par STRUCTURE de l'antériorité au registre (la recherche par nom a rendu 0 candidat) — motif : dépendance à une décision humaine (D-1) ; ce sont les deux premiers gestes du prompt réécrit, ils se jouent avec l'étude.
- Le push du pilot (`d65c578..b1c80b4`, un enregistrement) — motif : bloqué par un garde-fou, R-38 §4-5 ; `b1c80b4` porte un livrable explicite (l'analyse) et une évolution de référentiel (`CLASSES.json`), pas seulement des candidatures, donc hors de la couverture d'office du paragraphe 5.
- Le remède des trois constats (versionner les skills en source, reconstituer la charte du skill PowerPoint, jouer `systeme-de-marque` pour Digit-AI) — motif : hors mandat ; ce sont des écritures dans forge-agents et forge-design, dépôts frères, qui attendent D-2 puis un mandat.

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore ce prompt : … » → **j'ai fait** l'analyse L99 complète (8 couches) avec prompt réécrit, et non une simple réécriture → **pourquoi** : le lexique RV-6 du noyau fait de « Améliore le prompt » un appel du skill `prompt-analyzer-l99`, dont le livrable est cette analyse.
- **Vous avez écrit** « Construis une étude d'opportunités » → **j'ai fait** un prompt prêt à la lancer, sans la construire → **pourquoi** : le message entier est l'entrant du skill ; l'étude se joue après validation de l'intention (D-1, loi n° 7).
- **Vous n'avez rien demandé** sur le registre → **j'ai** journalisé trois candidatures et créé trois classes → **pourquoi** : noyau, garde-fous : « constat en passant → candidat » ; `CLASSES.json` : une clé nouvelle se crée au référentiel, jamais dans un sidecar.
- **Les huit écarts entre votre prompt et le prompt réécrit** (forge = hypothèse ; jeu fermé de l'option O0 à l'option O4 ; trois métiers ; typologie fermée ; capacité / instance ; interne à confirmer ; tour borné à l'étude ; SEO/GEO → forge-seo-geo) sont détaillés poste par poste au chapitre 8 de l'analyse, section « Écarts à la lettre », et se valident ou se rejettent un à un par D-1.

## 7. Risques

- L'étude, une fois lancée, conclut quand même à une forge parce que le demandeur l'a nommée ;
  - signal : un verdict O4 (ou O2) sans verdict de non-recouvrement écrit ni v0 exerçable nommée ;
  - parade : R-28 testé par partition et jeu fermé O0-O4 sont dans le prompt réécrit ; `oracle-etude-opportunite` E4/E5 refuse un verdict multiple ou un O0 tu.
- Les quatre skills, en archive dans un dossier ignoré par git, disparaissent d'un poste sans trace ;
  - signal : `input\03-skills\` absent sur un clone frais de forge-agents, ou un agent P4 qui ne trouve plus le skill qu'il charge ;
  - parade : TF-1021 (versionner en source) ; en attendant, acceptation déclarée — le pilot ne peut pas écrire chez forge-agents sans mandat.
- Les trois classes neuves gonflent la contre-métrique « classes suspectes » du tableau de bord et diluent le référentiel ;
  - signal : `RECIDIVES.md` montre trois classes à zéro récidive après le prochain relevé hebdomadaire (`observer-recidives.mjs`, prochain passage dans 6,9 j) ;
  - parade : D-2 (b) rattache aux voisines et retire les clés ; sinon, acceptation déclarée jusqu'au relevé.
- Deux sessions écrivent le même jour dans `output\04-plans\` et prennent le même indice ;
  - signal : deux fichiers « 20260911e » dans le dossier (déjà vu ce tour, résolu par « f ») ;
  - parade : relire `ls` du dossier juste avant de nommer, comme fait ici ; acceptation déclarée pour le reste, aucun contrôle ne réserve un indice.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), classées par dépendance — ce qui attend D-1 avant ce qui attend D-2, le push en dernier parce qu'il attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-1 | Jouer l'étude d'opportunité avec le prompt réécrit (chapitre 8 de l'analyse) : relevé des onze sources, audit `ameliore-un-skill` des quatre skills en lecture seule, antériorité par structure, trois tests R-28, état de l'art, options O0-O4, verdict, candidatures, `oracle-etude-opportunite` 10/10 et `check_markdown.py` PASS (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 ; à défaut, l'étude n'est pas jouée | complexe × moyen |
| A-2 | Rééditer le prompt réécrit sur les écarts amendés, rejouer le L99 sur la seule section modifiée et faire juger la lisibilité, si D-1 (b) (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 (b) ; à défaut, le prompt reste tel quel | simple × court |
| A-3 | Journaliser les décisions D-1 et D-2 (`journaliser.mjs`), régénérer les vues, rejouer `oracle-todo` (TF-1021, TF-1022, TF-1023) | auto_ia | `dependance_bloc_3` — attend D-1 et D-2 ; à défaut, les trois candidatures restent en candidat | simple × court |
| A-4 | Pousser le pilot (`d65c578..b1c80b4` et l'enregistrement de cette synthèse), `FORGE_PUSH_GO` posé avec le motif, porte des noms rejouée par le hook pre-push (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain qui conditionne le geste) — attend le GO de A-8 : `b1c80b4` porte un livrable explicite et une évolution de référentiel, R-38 §4 ; à défaut, tout reste local | simple × court |
| A-5 | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) sauf écart n° X », ou « D-1 (c) » ; l'étude est jouée par l'IA (neuve) | manuelle_utilisateur | `decision` — loi n° 7 : une intention reconstruite est validée par le demandeur avant exécution ; sinon : l'étude n'est pas jouée | simple × court |
| A-6 | Dire si la communication interne (collaborateurs, recrutement) entre au périmètre — répondre « interne oui » ou « interne non » (neuve) | manuelle_utilisateur | `decision` — c'est l'hypothèse H1 (la typologie de livrables proposée par l'étude) ; sinon : l'étude la traite en question ouverte | simple × court |
| A-7 | Trancher D-2 — répondre « D-2 (a) », « (b) » ou « (c) » ; journalisation et rattachement par l'IA (TF-1021, TF-1022, TF-1023) | manuelle_utilisateur | `decision` — TODO-FORGE : la décision sur un candidat est humaine ; sinon : les trois restent en candidat | simple × court |
| A-8 | Donner le feu vert de publication de `b1c80b4` — répondre « pousse le pilot » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'un enregistrement portant un livrable explicite est un GO humain ; sinon : le pilot reste 1 en avance, en local | simple × court |

## 9. Traces

- Analyse L99 : `output\03-etudes\20260911-L99-forge-communication-marketing.md` (commit `b1c80b4`).
- Sidecar des candidatures : `input\01-candidatures\forge-communication-constats-l99-20260911a.tf.jsonl` (lot accaa8bb822b) ; registre `todo\TODO.jsonl` (TF-1021, TF-1022, TF-1023) ; référentiel `todo\CLASSES.json` 1.10.0 ; vues `todo\TODO.md`, `todo\RECIDIVES.md` et la page générée du registre.
- Enregistrement local : `b1c80b4` (10 fichiers) ; cette synthèse et les index régénérés sont enregistrés à sa suite.
- Oracles : `check_markdown.py` (PASS, 2 passes), `todo\ingerer-lot.mjs` (OK, 3 candidatures), `todo\oracle-todo.mjs` (PASS, 2 passes), `oracle-synthese` sur ce fichier (verdict au journal `.oracles-historique.jsonl` homonyme).
- Aucune page HTML livrée dans ce tour.
