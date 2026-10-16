---
destinataire: humain
---

# Synthèse de mandat — le plancher d'écriture de la Factory est posé, jugé et câblé chez le pilot et chez les produits, la règle Full HD / 4K est écrite, trois lots sont chez les forges ; il vous reste à dire si les forges les traitent maintenant et à donner le feu vert de publication (12/09/2026)

Vos trois décisions sont exécutées. La doctrine d'écriture existe, en douze règles courtes. Elle a sa donnée de tournures creuses et son juge. Ce juge est un oracle déterministe : il compte des densités par famille, jamais un mot isolé. Le corpus déjà accepté reste au-dessus de 95 % de réussite. Le juge tourne désormais à chaque écriture d'un fichier Markdown chez le pilot. Les produits le recevront à leur prochaine ouverture par l'héritage, avec le texte de la doctrine. La restitution de fin de tour est jugée sur son style par une règle nouvelle. Votre règle de design est écrite : tout écran de bureau se conçoit à 1920 pixels de large et se vérifie sans défaut jusqu'au 4K. Les trois forges concernées ont reçu leurs lots de travaux, le socle de rendu compris. La liste de douze règles pour votre profil Claude a été éprouvée sur cette restitution, puis installée. Rien n'est publié : le pilot attend votre feu vert. Deux points restent à décider. Le premier : lancer maintenant les runs de forge sur les lots déposés, ou attendre leur prochaine ouverture. Le second : garder quatre semaines les seuils calibrés sur l'ancien corpus avant de les resserrer.

## 1. En-tête d'identification

- **quoi** — exécution du mandat « règles d'écriture de la Factory » (décisions D-1 (a), D-2 (a), D-3 (a) de la synthèse 20260911j) et de la règle de design donnée avec elles (« Full HD par défaut, responsive jusqu'au 4K ») : doctrine, donnée, oracle, hook, câblage, héritage, règle S43 (la règle de style de la restitution, déléguée à l'oracle d'écriture), lots de travaux, candidatures et décisions au registre, liste profil éprouvée et installée.
- **sur quoi** — le pilot `digit-ai-factory` (seul dépôt enregistré) ; le profil utilisateur Claude (`~/.claude/CLAUDE.md`, une section ajoutée) ; les boîtes d'entrée `input\00-travaux\` de `digit-ai-forge-agents`, `digit-ai-forge-design` et `digit-ai-forge-development` (un lot et son sidecar déposés chacune, rien d'autre écrit, aucun enregistrement chez elles).
- **quand** — 2026-09-12 16:45 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 15:45 (journalisation de la décision D-3) ; durée mesurée ≥ 60 min.
- **qui** — pilot local `3b60a98`, bâti sur `58aa3d8` (autre session, 11/09 16:40) ; `git status -sb` : le pilot est **19 enregistrements en avance**, dont trois miens (`8e454c4`, `29d81d3`, `3b60a98`) ; session Fable 5.1 ; une délégation (agent général, modèle Opus : construction de l'oracle et du hook sur spécification fermée, 54 outils, six vérifications collées ; escalade : recalibrage de deux règles de structure repris par le pilot) ; oracles joués : `check_markdown.py` (M7, M10, M14, M18), `oracle-ecriture.mjs` (`--self-test`, `--baseline`), `hook-ecriture.mjs --self-test`, `oracle-synthese.mjs --self-test` puis sur ce fichier, `oracle-travaux-pilot.mjs` (ses huit règles de forme d'un lot, de T1 (chaque élément rattaché à son item du registre) à T8 (le sort du lot reçu est dit), sur trois lots), `oracle-todo.mjs`, `oracle-claude-md.mjs` (ses quatre règles du noyau, de N1 (taille plafonnée du noyau) à N4 (quantificateurs comptés par famille de sens)), `oracle-portee-doctrine.mjs` (R-52), `oracles\self-tests.mjs` (107 recettes).

## 2. Verdict en une ligne

**Doctrine `references\ECRITURE.md` déposée (12 règles, de E-1 (le lecteur est nommé et le texte ouvre par ce qui change pour lui) à E-12 (le vocabulaire du lecteur, jamais celui du système), 12 112 octets, `check_markdown` PASS, `oracle-ecriture` PASS sans avertissement) ; donnée `references\tics-redactionnels.json` (8 familles, seuils calibrés sur 204 textes) ; `oracle-ecriture.mjs` self-test 4/4, baseline 112/117 PASS (95,7 %) sur les synthèses et 53/54 (98,1 %) sur les études ; `hook-ecriture.mjs` 9/9, câblé chez le pilot et hérité par les produits (héritage 1.9.0, 14 artefacts) ; `oracle-synthese` 1.3.0 avec S43, self-test 19/19 ; règle E5 écrite ; TF-1064 décidé, TF-1066 créé et décidé, classe neuve, `oracle-todo` PASS, 284 actifs ; 3 lots PASS sur les huit règles de forme, déposés ; `self-tests.mjs` 105/107 (2 défauts antérieurs au tour, tous deux sur la page générée du registre) ; profil Claude : 12 règles installées après épreuve ; 1 enregistrement local `3b60a98` (31 fichiers), 0 push.**

## 3. Décisions attendues de l'humain

Deux décisions.

> **D-1 — Les trois lots déposés chez les forges sont-ils traités maintenant par des runs de forge que je lance sur votre mandat, ou attendent-ils la prochaine ouverture de chaque forge ?**
>
> Il s'agit des trois lots du 12/09. Forge-agents reçoit l'entrée au registre des oracles, la délégation du style dans le socle Markdown et la grille de rendu du socle étendue à 2560 et 3840. Forge-design reçoit la largeur de conception 1920 dans son contrat technique et ses critères de sortie, la grille complète dans ses oracles, et un oracle des textes d'application à définir. Forge-development reçoit son playbook : textes du produit, messages de commit, écrans de bureau à 1920 vérifiés jusqu'au 4K. Les lots passent leur oracle de forme et sont dans les boîtes d'entrée ; rien n'est enregistré chez les forges. Le pilot n'écrit chez une forge que sur mandat humain. Les produits, eux, reçoivent le plancher d'écriture d'office à leur prochaine ouverture.
>
> **Recommandation : (b).** Source consultée : `CLAUDE.md` du pilot, garde-fou « aucune écriture dans les dépôts frères hors mandat humain (boucle mandatée, journalisée) » ; `references\RUN-MANDAT.md` (séquence d'un mandat transverse) ; `references\INTENTION.md` (loi n° 7 : votre intention vise les forges et les produits, pas le seul pilot) ; `gabarits\TRAVAUX-PILOT.md` (« le produit reste le juge de ce qu'il inscrit à son reste-à-faire »).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) attendre la prochaine ouverture de chaque forge, qui ingère son lot elle-même | effort nul maintenant ; les lots restent dans les boîtes d'entrée | exclut un délai maîtrisé : la grille de rendu du socle et le registre des oracles ne bougent qu'au prochain run de chacune des trois forges, sans date |
| (b) lancer maintenant, sur votre mandat, un run par forge qui traite son lot et remet son lot de retours au pilot | effort complexe × moyen (trois runs de forge, chacun sous ses oracles, avec un enregistrement et une publication par forge sur votre feu vert) | exclut l'autonomie des forges sur ce sujet : c'est le pilot qui joue chez elles, sous mandat journalisé |
| (c) retirer les lots | effort simple × court | exclut toute propagation aux forges : le plancher reste au pilot et chez les produits, le socle de rendu reste borné à 1920 |

> **Si rien n'est décidé** : l'option (a) s'applique — les lots restent déposés, chaque forge les traite à son ouverture.

> **D-2 — Les seuils d'échec calibrés sur l'ancien corpus (sept phrases longues d'affilée, cinq gras en ligne, quarante tirets d'incise pour mille mots) restent-ils quatre semaines avant d'être resserrés sur les textes neufs ?**
>
> Il s'agit du calibrage de l'oracle. La doctrine dit ce qu'un bon texte fait (trois phrases longues d'affilée avertissent, un tiret d'incise par phrase) ; les seuils d'échec ont été posés au maximum de ce que le corpus déjà accepté porte, pour que ce corpus reste à plus de 95 % de réussite et que l'oracle ne crie pas sur l'existant. Les avertissements, eux, sont imprimés dès aujourd'hui à chaque écriture : c'est eux qui changent les textes neufs. Le resserrement est une recalibration de la donnée, sans toucher au code.
>
> **Recommandation : (a).** Source consultée : `references\ECRITURE.md` § « Comment le plancher se joue » (« le corpus PASS reste à 95 % ou plus, sinon la donnée se recalibre, jamais la règle ne se supprime ») et § « Mesure du gain » (fenêtre de quatre semaines) ; `references\tics-redactionnels.json` (`note_calibrage` de la ponctuation de cadence) ; leçon N4 de `oracles\oracle-claude-md.mjs` (« un oracle qui crie sur l'usage légitime se fait désactiver dans la semaine »).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) garder les seuils quatre semaines, mesurer les textes neufs, resserrer ensuite sur mesure | effort simple × court au 10/10 (rejeu de la baseline sur les textes du mois, nouvelle donnée datée) | exclut un échec immédiat sur les textes neufs qui gardent le style d'incise : ils n'auront que des avertissements pendant quatre semaines |
| (b) resserrer maintenant (cinq phrases d'affilée, trois gras, trente tirets pour mille) | effort simple × court ; la baseline sur l'ancien corpus tombe sous 90 % et se déclare | exclut la garantie de non-régression : des restitutions jugées PASS hier deviennent FAIL sur S43 aujourd'hui |
| (c) ne jamais resserrer | effort nul | exclut que la doctrine et l'oracle disent la même chose : l'écart entre « trois » et « sept » reste permanent |

> **Si rien n'est décidé** : l'option (a) s'applique — les seuils du 12/09 restent en place, la baseline est rejouée au 10/10.

## 4. Traité — avec sa preuve

- **La doctrine est écrite, dans la taille prescrite, et passe ses deux oracles.** Douze règles, de E-1 (le lecteur est nommé) à E-12 (le vocabulaire du lecteur), typées sur cinq types de textes, de T1 (prompts et instructions d'agents) à T5 (messages de commit et entrées de ledger), chacune avec son juge et son statut (mécanisée, déléguée, revue), des exemples avant / après réels, la précédence gabarit > plancher > voix, la portée temporelle et la mesure.
  - preuve : `C:\dev\digit-ai-factory\references\ECRITURE.md`, 12 112 octets (sous 12 288) ; `check_markdown.py` → « Verdict : PASS » ; `node oracles\oracle-ecriture.mjs references/ECRITURE.md` → verdict PASS, 1 692 mots, aucun avertissement.
- **La donnée de tournures est mesurée sur le corpus avant d'être crue.** Huit familles (annonce vide, clôture résumante, emphase creuse, parallélisme mécanique, attribution vague, formule de conversation, transition de remplissage, ponctuation de cadence), chaque motif daté et sourcé, une liste d'antériorité de dix-neuf textes normatifs.
  - preuve : `C:\dev\digit-ai-factory\references\tics-redactionnels.json` ; script de mesure sur 204 textes du pilot → sept familles lexicales à moins de 2 ‰ (maximum observé 1,92 ‰), tirets d'incise médiane 18,55 ‰, 95e centile 35,71 ‰, maximum 60,15 ‰ ; seuils posés 25 ‰ (avertissement) et 40 ‰ (échec).
- **L'oracle juge, sait échouer, et laisse le corpus accepté au-dessus de 95 %.** Six règles EC-1 à EC-6 (densité par famille, phrases longues en série, profondeur de puces, emphase de structure, attaques répétées, antériorité) ; quatre fixtures (rouge saturée, verte sobre avec bloc de code interdit, courte, antériorité) ; deux règles de structure recalibrées après baseline (phrases longues : trois avertissent, sept échouent ; gras en ligne : les lignes qui ouvrent en gras sont exemptées, cinq échouent).
  - preuve : `node oracles\oracle-ecriture.mjs --self-test` → « 4 cas, 0 défaut (4/4 PASS — rouge FAIL sur 12 règles, verte PASS sans FAIL, courte PASS densités non jugées, antériorité SKIP) », exit 0 ; `--baseline output/04-plans` → « 112 PASS, 0 SKIP, 5 FAIL sur 117 — 95.7 % PASS » ; `--baseline output/03-etudes` → « 53 PASS, 0 SKIP, 1 FAIL sur 54 — 98.1 % PASS » ; `REGLES-PROJET.md` → SKIP (antériorité).
- **Le hook joue le plancher à chaque écriture d'un Markdown, chez le pilot et chez les produits.** Avertit, ne bloque jamais ; ignore README, LISEZMOI, `old\`, `node_modules`.
  - preuve : `node oracles\hook-ecriture.mjs --self-test` → « 9/9 PASS » ; câblage pilot `C:\dev\digit-ai-factory\.claude\settings.json` (PostToolUse Write|Edit|MultiEdit → `node oracles/hook-ecriture.mjs`) ; en conditions réelles : `[ecriture] ECRITURE.md : style PASS (8 familles, 1692 mots)` et `[ecriture] REGLES-PROJET.md : antériorité déclarée, non jugé` ; héritage : `gabarits\hooks-factory.mjs` connaît `ecriture`, `gabarits\settings-produit.json` le câble, `gabarits\HERITAGE.json` 1.9.0 (14 artefacts, `references/ECRITURE.md` → `forge/ECRITURE.md` en copie conforme, famille `ecriture-style`).
- **La restitution de fin de tour est jugée sur son style.** Règle S43 déléguée à l'oracle, non bloquante, SANS_OBJET si l'oracle manque.
  - preuve : `C:\dev\digit-ai-factory\oracles\oracle-synthese.mjs` 1.3.0 ; `--self-test` → « 19/19 PASS » ; sur la synthèse 20260911j → « S43 PASS style PASS (2933 mots) avec 1 avertissement(s) : 23 phrases de plus de 35 mots sur 166 » ; sur ce fichier : verdict au journal homonyme.
- **La règle de design est écrite et portée aux produits.** E5 : viewport de conception 1920 px, grille de vérification jusqu'à 3840.
  - preuve : `C:\dev\digit-ai-factory\references\BEST-PRACTICES-HTML.md` § E, ligne E5 ; `C:\dev\digit-ai-factory\gabarits\CLAUDE-PRODUIT.md` § « Règles de socle applicables » : cinq lignes (deux lignes HTML amendées, écran de bureau, texte Markdown, textes d'application).
- **Le registre porte les deux items et leurs décisions.** TF-1064 passé en `decide` (D-3 (a)) ; TF-1066 créé pour la règle Full HD / 4K, classe `viewport-de-conception-non-fixe` fondée par lui, passé en `decide` par votre mot.
  - preuve : `node todo\journaliser.mjs` → « TF-1064 maj decide » puis « 1 événement(s) journalisé(s) » (TF-1066) ; `node todo\ingerer-lot.mjs … viewport-de-conception-fullhd-4k-20260912a.tf.jsonl --sans-fetch` → « [OK] 1 candidature(s) ingérée(s) en CANDIDAT (lot eae49dc3c9f6) », un avertissement « CLASSE SUSPECTE » (contre-métrique, pas un refus) ; `todo\CLASSES.json` 1.12.0, 73 classes ; `node todo\oracle-todo.mjs` → « verdict : PASS » ; vues : « 284 actifs, 21 forges cibles (sceau actifs ee8ecc9064ad) », « 73 classe(s), 126 récidive(s) ».
- **Trois lots de travaux sont jugés et déposés.** forge-agents (TF-1064 registre et délégation, TF-1066 grille du socle), forge-design (TF-1066 contrat et oracles, TF-1064 textes d'application), forge-development (TF-1064 playbook, TF-1066 écrans).
  - preuve : `node gabarits\oracle-travaux-pilot.mjs` sur `output\06-travaux-confies\pilot - TRAVAUX - 20260912a.md`, `…b.md`, `…c.md` → « verdict : PASS » les trois (le lot b a d'abord échoué T6, module producteur nommé sans lecture ; corrigé après lecture de `ameliore-le-design\SKILL.md`, rejoué PASS) ; `ls` des trois boîtes `input\00-travaux\` → 6 fichiers du 12/09 ; `git status` des trois forges : fichiers non suivis, aucun enregistrement.
- **La liste profil est éprouvée puis installée.** Cette restitution est écrite sous les douze règles ; elle passe `oracle-synthese` avec S43 ; la section est ajoutée au profil.
  - preuve : verdict de ce fichier au journal `.oracles-historique.jsonl` homonyme (PASS, S43 PASS avec un avertissement de phrases longues au bloc 6, dont la forme à flèches est celle du gabarit) ; `C:\Users\iguan\.claude\CLAUDE.md`, 2 910 octets, section « Écriture — règles de base » en ligne 17, 12 règles numérotées, ouverte par « les consignes de projet priment ».
- **Le noyau, l'index, la portée des doctrines et le harnais de recettes restent verts.**
  - preuve : `node oracles\oracle-claude-md.mjs` → PASS (`references\INDEX.md` porte `ECRITURE.md` et `tics-redactionnels.json`) ; `node oracles\oracle-portee-doctrine.mjs` → PASS ; `node oracles\self-tests.mjs` → 105/107, les deux défauts antérieurs au tour : `todo\self-test.mjs` (la page générée du registre échoue `check_html`, TF-1049 du 11/09) et `oracle-caracteres-controle.mjs` sur le parc (trois octets 0x00 dans la même page générée du registre, aux lignes 589 et 911 de son code, séquence octale interprétée par le générateur) — mesurés à 2/105 avant la première écriture du tour par l'agent.
- **Tout est enregistré localement, sur les seuls chemins du tour.**
  - preuve : `git commit --only` → `3b60a98`, 31 fichiers ; `git status -sb` → `main...origin/main [ahead 19]` ; les fichiers d'autres sessions (`input\00-retours\README.md`) sont laissés hors de l'enregistrement.

## 5. Non traité — avec son motif

- L'entrée au registre des oracles, la délégation du style dans `check_markdown.py` et la grille de rendu du socle (`render_page.py`) — motif : hors mandat ; ce sont des écritures dans `digit-ai-forge-agents`, source versionnée des skills ; confiées par le lot 20260912a (D-1).
- La largeur de conception dans le contrat technique de forge-design, la grille de ses oracles, les maquettes à 1920 et l'oracle des textes d'application (T4) — motif : hors mandat ; lot 20260912b (D-1).
- Le playbook de forge-development — motif : hors mandat ; lot 20260912c (D-1).
- Le push du pilot (`58aa3d8..3b60a98`, un enregistrement) — motif : bloqué par un garde-fou, R-38 §4-5 ; l'enregistrement porte des livrables explicites.
- La mesure du gain à quatre semaines (rejeu de la baseline sur les textes du mois, resserrement des seuils) — motif : dépendance à une décision humaine (D-2) et à l'échéance du 10/10.
- Un indicateur « retours humains de lisibilité par semaine » — motif : bloqué par un garde-fou, la loi qualité (« toute valeur non vérifiable est marquée ») : aucune classe du référentiel ne nomme la lisibilité (les retours passés TF-0511 et TF-0932 ont été classés sous d'autres clés) ; l'indicateur est déclaré non mesurable aujourd'hui, à créer à la première occurrence ; les indicateurs mesurés sont le taux PASS de l'oracle (95,7 % et 98,1 %) et la médiane des tirets d'incise (18,55 ‰).

## 6. Écarts à la lettre

- **Vous avez écrit** « 1a, 2a, 3a » → **j'ai fait** les trois exécutions, et la liste profil a été installée après épreuve sur cette restitution plutôt que sur une restitution d'essai séparée. **Pourquoi** : le contrat exigeait « une restitution écrite sous ces règles, jugée PASS » ; celle-ci en est une, et l'épreuve sur un texte réel vaut plus qu'un essai fabriqué.
- **Vous avez écrit** « prends à minima par défaut FullHD (1920px) […] et du responsive design pour monter jusqu'à du 4K » → **j'ai fait** une règle E5 avec une grille qui ajoute 2560 px entre 1920 et 3840. **Pourquoi** : un écran QHD est le palier le plus courant entre les deux ; « monter jusqu'à » se vérifie par paliers, pas par ses deux bornes.
- **Le prompt réécrit disait** « règles à ne pas casser » et la doctrine dit « trois phrases longues d'affilée avertissent » → **l'oracle échoue à sept** (et à cinq gras en ligne, quarante tirets pour mille). **Pourquoi** : la baseline mesurée a montré que trois et trois condamnaient 99 textes sur 117 déjà acceptés ; le contrat du mandat impose « corpus PASS à 95 % ou plus, seuils recalibrés, jamais règle supprimée » ; l'écart est soumis en D-2.
- **Le prompt réécrit disait** « ECRITURE.md ≤ 12 Ko » → **le fichier fait 12 112 octets**. **Pourquoi** : sous 12 288 octets (12 KiB), au-dessus de 12 000 ; lu comme 12 KiB, tenu ; lu comme 12 000, dépassé de 112 octets.
- **Vous n'avez rien demandé** sur les forges autres que par le prompt réécrit → **j'ai** déposé trois lots dans leurs boîtes d'entrée sans rien y enregistrer. **Pourquoi** : c'est le seul canal que le garde-fou autorise sans mandat ; le traitement est en D-1.

## 7. Risques

- Le hook avertit à chaque écriture d'un Markdown et l'agent finit par ne plus lire ses lignes ;
  - signal : des restitutions successives qui portent le même avertissement de phrases longues sans le corriger ;
  - parade : S43 le rappelle en fin de tour dans le verdict ; D-2 resserre les seuils quand les textes neufs auront baissé ; acceptation déclarée d'ici là.
- Les produits ne reçoivent le hook et la doctrine qu'à leur prochaine ouverture, et un produit non ouvert reste sans plancher ;
  - signal : le relevé d'héritage d'ouverture (R-47) liste `forge/ECRITURE.md` absent chez un produit ;
  - parade : le relevé le dit à chaque ouverture du pilot (hook d'ouverture, lecture seule) ; la copie est faite à l'ouverture du produit.
- Les forges laissent les lots dans leur boîte sans les traiter ;
  - signal : aucun lot de retours `<forge> - RETOURS - …` reçu dans `input\00-retours\` dans les deux semaines ;
  - parade : D-1 (b) ; sinon acceptation déclarée, les lots restent visibles à chaque ouverture des forges.
- La page générée du registre porte trois octets nuls et le mot d'une police interdite dans sa prose, ce qui laisse le harnais de recettes à 105/107 ;
  - signal : `self-tests.mjs` en défaut sur la recette du registre et sur `oracle-caracteres-controle.mjs` ;
  - parade : hors de ce mandat, antérieur au tour ; TF-1049 porte le premier ; le second passe la main au bloc 8 (A-4).

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), classées par dépendance — ce qui attend D-1 avant ce qui attend D-2, le push en dernier parce qu'il attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif | Effort |
|---|---|---|---|---|
| A-1 | Lancer un run de forge par lot déposé (forge-agents 20260912a, forge-design 20260912b, forge-development 20260912c), chacun sous ses oracles, avec lot de retours remis au pilot et enregistrement local ; publication de chaque forge sur votre feu vert (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 (b) ; à défaut, les lots attendent l'ouverture de chaque forge | complexe × moyen |
| A-2 | Rejouer la baseline de l'oracle sur les textes écrits entre le 12/09 et le 10/10, publier la mesure dans `references\tics-redactionnels.json` (calibrage daté) et resserrer les seuils sur la nouvelle distribution (neuve) | auto_ia | `dependance_bloc_3` — attend D-2 (a) et l'échéance du 10/10 ; à défaut, les seuils du 12/09 restent | simple × court |
| A-3 | Journaliser les décisions D-1 et D-2 (`journaliser.mjs`), régénérer les vues, rejouer `oracle-todo` (TF-1064, TF-1066) | auto_ia | `dependance_bloc_3` — attend D-1 et D-2 ; à défaut, les deux items restent `decide` sans suite journalisée | simple × court |
| A-4 | Journaliser une candidature pour les trois octets nuls de la page générée du registre (le générateur interprète une séquence octale d'antislash dans le texte d'un item) et la rattacher à TF-1049 si la classe est la même (neuve) | auto_ia | `hors_mandat` — constat en passant, hors du mandat d'écriture ; à défaut, le harnais reste à 105/107 sans item qui le porte | simple × court |
| A-5 | Pousser le pilot (`58aa3d8..3b60a98` et l'enregistrement de cette synthèse), `FORGE_PUSH_GO` posé avec le motif, porte des noms rejouée par le hook pre-push (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain qui conditionne le geste) — attend le GO de A-8 : `3b60a98` porte des livrables explicites, R-38 §4 ; à défaut, tout reste local | simple × court |
| A-6 | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) » ou « D-1 (c) » ; les runs de forge sont joués par l'IA (neuve) | manuelle_utilisateur | `decision` — le garde-fou du noyau réserve à l'humain l'écriture chez une forge ; sinon : les lots attendent l'ouverture de chaque forge | simple × court |
| A-7 | Trancher D-2 — répondre « D-2 (a) », « (b) » ou « (c) » ; recalibrage par l'IA (neuve) | manuelle_utilisateur | `decision` — le seuil est une donnée datée, sa date de resserrement est un choix ; sinon : les seuils du 12/09 restent | simple × court |
| A-8 | Donner le feu vert de publication de `3b60a98` — répondre « pousse le pilot » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 : le push d'un enregistrement portant des livrables explicites est un GO humain ; sinon : le pilot reste 19 en avance, en local | simple × court |

## 9. Traces

- Doctrine, donnée, oracle, hook : `references\ECRITURE.md`, `references\tics-redactionnels.json`, `oracles\oracle-ecriture.mjs`, `oracles\hook-ecriture.mjs` (enregistrement `3b60a98`).
- Câblage : `.claude\settings.json`, `gabarits\hooks-factory.mjs`, `gabarits\settings-produit.json`, `gabarits\HERITAGE.json` 1.9.0, `gabarits\CLAUDE-PRODUIT.md`, `CONTRAT-INTERFACE.md` § 2, `references\INDEX.md`, `oracles\oracle-synthese.mjs` 1.3.0 (S43).
- Règle de design : `references\BEST-PRACTICES-HTML.md` E5 ; candidature `input\01-candidatures\viewport-de-conception-fullhd-4k-20260912a.tf.jsonl` (lot eae49dc3c9f6, TF-1066) ; `todo\CLASSES.json` 1.12.0.
- Lots : `output\06-travaux-confies\pilot - TRAVAUX - 20260912a.md`, `…b.md`, `…c.md` et leurs sidecars ; copies dans `input\00-travaux\` des trois forges.
- Registre : `todo\TODO.jsonl` (TF-1064 decide, TF-1066 creation et decide) ; vues `todo\TODO.md`, `todo\RECIDIVES.md`, page générée.
- Profil : `C:\Users\iguan\.claude\CLAUDE.md`, section « Écriture — règles de base ».
- Oracles : `check_markdown.py` (PASS, 3 passes sur la doctrine), `oracle-ecriture --self-test` (PASS), `--baseline` (2 dossiers), `hook-ecriture --self-test` (PASS), `oracle-synthese --self-test` (19/19) et sur ce fichier (verdict au journal `.oracles-historique.jsonl` homonyme), `oracle-travaux-pilot` (3 PASS), `oracle-todo` (PASS, 3 passes), `oracle-claude-md` (PASS), `oracle-portee-doctrine` (PASS), `self-tests.mjs` (105/107).
- Aucune page HTML livrée dans ce tour.
