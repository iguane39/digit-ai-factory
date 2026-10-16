---
destinataire: humain
---

# Synthèse L99 — le prompt « revue hebdomadaire de l'existant » est analysé et réécrit : il part de la boucle qui tourne déjà et sépare les gestes que la loi vous réserve de ceux qu'on peut vous retirer ; il vous reste à valider neuf écarts (17/09/2026)

Votre demande d'amélioration du prompt est traitée : l'analyse en huit couches est déposée, elle passe le contrôle de lisibilité, et le prompt réécrit est prêt à lancer l'étude. Ce que l'analyse change pour vous : la factory porte déjà une boucle d'amélioration, avec une sonde hebdomadaire des récidives et une revue des classes de défauts par quinzaine, et un prompt voisin a produit cinq livrables le 3 septembre. Votre texte l'ignorait et aurait fait concevoir ce qui existe. Il vise pourtant trois questions jamais mesurées : ce qui dort dans le dépôt sans servir, ce que deviennent les items une fois clos, et quels gestes humains sont mécaniques plutôt que des décisions. Le prompt réécrit garde votre intention et remplace « moins d'humain » par une carte des interventions où vos décisions restent intouchables. Rien n'est construit ni publié. Ce qui est attendu de vous : valider ou amender les neuf écarts, puis dire si l'étude se lance.

## 1. En-tête d'identification

- **quoi** — appel du skill `prompt-analyzer-l99` par le lexique d'invocation RV-6 (règle du noyau qui fait de « Améliore ce prompt » un appel de skill) ; analyse L99 complète en 8 couches, prompt réécrit, contrat de sortie, écarts à la lettre, protocole de tests.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; lectures seules sur ses références, son registre et ses études antérieures.
- **quand** — 2026-09-17 07:50 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 07:31 ; durée mesurée ≈ 20 min.
- **qui** — pilot `b284504` (aucun enregistrement fait dans ce tour) ; session Fable 5.1, une délégation à un agent d'exploration en lecture seule pour le relevé de l'existant, escalade de modèle : aucune ; oracles joués : `check_markdown.py` *(contrôle de lisibilité du Markdown)* et `oracle-synthese` sur ce document.
- **intention** — obtenir un prompt qui commande une étude utile sur l'amélioration continue de la factory, avec moins de gestes humains. Test rétro : le prompt réécrit sert cette intention en mesurant d'abord où passent vos gestes ; il ne la sert pas à la lettre sur un point, puisqu'il interdit à l'étude de proposer le retrait d'une de vos décisions.

## 2. Verdict en une ligne

**Prompt d'origine 20/100 → prompt réécrit 87/100 (projeté) ; 17 défauts inventoriés dont 3 bloquants et 13 majeurs, tous clôturés au changelog ; 9 écarts à la lettre soumis un à un ; `check_markdown.py` PASS, exit 0, un avertissement sans échec ; analyse et synthèse ajoutées à l'index git, aucun enregistrement, aucun push.**

## 3. Décisions attendues de l'humain

Bloquants — un travail est à l'arrêt, et voici ce qui le lève :

- **ce qui est bloqué** : l'étude d'opportunité sur la revue hebdomadaire de l'existant n'est pas jouée ; **ce qu'il faut décider** : si les neuf écarts entre votre texte et le prompt réécrit vous conviennent, en particulier les quatre seuils chiffrés que j'ai proposés et la lecture retenue de « ses processus » comme la boucle d'amélioration ; **si rien n'est fourni** : le prompt réécrit reste déposé, l'étude n'est pas lancée, et les trois questions jamais mesurées le restent.

> **D-1 — Les neuf écarts à la lettre sont-ils validés, et l'étude d'opportunité se lance-t-elle avec le prompt réécrit ?**
>
> Votre prompt commandait une étude « pour la mise en place » d'un process hebdomadaire couvrant l'optimisation, le code mort, le bilan des items traités et l'automatisation des retours, « en limitant les interventions humaines ». Le prompt réécrit s'en écarte à neuf endroits, listés au bloc 6 : la question devient ouverte et ne rien ajouter reste possible ; la semaine devient une hypothèse à justifier par le débit mesuré ; l'étude lit les forges et les produits sans y écrire ; le nettoyage devient un relevé sans suppression ; l'optimisation n'a plus de chantier propre ; vos gestes sont classés en trois familles dont les décisions réservées par les règles sont intouchables ; les six étapes citées sont lues comme la chaîne d'amélioration et non comme les étapes d'un run de produit ; l'accélération devient un délai mesuré ; quatre seuils sont proposés par moi.
>
> **Recommandation : (a).** Source consultée : `references\INTENTION.md` l. 27-29 (une intention reconstruite est validée par le demandeur avant exécution), `BOUCLE-AMELIORATION.md` l. 12-13 et 109-130 (la boucle existe et s'interdit toute application sans validation humaine), `gabarits\ETUDE-OPPORTUNITE.md` l. 15-17 et 54 (seuil franchi, option « ne rien faire » obligatoire), synthèse `20260903b` de `output\04-plans\` (la mesure préalable avait changé la forme de la réponse le 03/09). L'étude coûte une campagne bornée en lecture seule et rend des candidatures prêtes à décider.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** valider les neuf écarts et lancer l'étude avec le prompt réécrit tel quel | effort complexe × moyen : relevé de l'existant, 5 mesures datées sur quatre semaines, carte des gestes humains, cinq sources, options, étude jugée, cinq candidatures au plus | exclut toute construction et toute suppression avant votre décision sur les candidatures |
| **(b)** valider avec amendements — répondre « D-1 (b) sauf écart n° X » ou « D-1 (b), seuil à … » | même effort, plus la reprise du prompt sur les points amendés | exclut un lancement dans le même tour : le prompt est réédité, relu, puis joué |
| **(c)** ne pas lancer l'étude | effort nul | exclut toute mesure : l'existant dormant, le délai de bout en bout et vos gestes mécaniques restent non comptés |

> **Si rien n'est décidé** : l'option (c) s'applique — le prompt réécrit reste déposé dans l'analyse, l'étude n'est pas jouée.

## 4. Traité — avec sa preuve

- **L'analyse L99 est déposée et jugée** : huit chapitres, étalon noté, chaîne logique avec deux ruptures et une collision, inventaire de 17 défauts, audit de six prémisses implicites, cinq causes d'échec, trois attaques et lentille de robustesse, trois effets de second ordre, prompt réécrit, contrat de sortie, neuf écarts, protocole de tests, changelog.
  - preuve : `output\03-etudes\20260917-L99-revue-hebdomadaire-amelioration-continue.md` ; `check_markdown.py` → « Verdict : PASS », exit 0, un avertissement sans échec sur les marqueurs de travail : le mot TODO apparaît 2 fois, légitime puisque le document parle du registre TODO-FORGE.
- **Le score est mesuré dimension par dimension** : 20/100 avant (clarté 10/20, spécification 3/20, garde-fous 1/15, ancrage 2/15, vérifiabilité 1/15, robustesse 3/15), 87/100 projeté après.
  - preuve : tableaux « Étalon » du chapitre 1 et « Score avant → après » du chapitre 8 du fichier cité.
- **L'existant a été relevé en lecture seule, avec citations et lignes** : le cycle de la boucle et ses deux cadences, l'absence d'ordonnanceur, les 4 mesures de traitement du registre, les deux outils qui relèvent les contrôles sans appelant, le précédent des composants inutilisés, les études du 30/08 et du 03/09.
  - preuve : relevé d'un agent d'exploration, puis vérification directe de trois citations par `grep -n` → `todo\RECIDIVES.md` l. 15 (« boucle-retour-sans-descente | heritage-produit | 15 | 1 | 15 | 100 % »), `oracles\hook-ouverture.mjs` l. 260, `gabarits\docs-projet\COMPOSANTS-OPS.md` l. 60 ; deux numéros de ligne corrigés dans l'analyse après cette vérification.
- **Le registre est compté à la date du jour** : 1 153 items, dont 372 actifs (328 corrigés, 28 en cours, 12 décidés, 3 écartés, 1 candidat) et 781 archivés ; 87 classes en 18 familles ; 64 entrées au registre de dette.
  - preuve : lecture de `todo\TODO.jsonl` et `todo\TODO-ARCHIVE.jsonl` par `node -e`, jouée par l'agent d'exploration ; total recoupé avec `todo\RECIDIVES.md` l. 7 (« 1153 item(s) au registre »).

## 5. Non traité — avec son motif

- L'étude d'opportunité elle-même — motif : dépendance à une décision humaine (D-1) ; le message est l'entrant du skill L99, pas une commande d'exécution, et la loi transverse n° 7 du noyau *(le résultat sert l'intention, pas la lettre)* interdit de jouer une étude sur une intention reconstruite non validée.
- Le sort des deux décisions du 30/08 sur l'émetteur de retours côté produit — motif : impossible à prouver ici ; aucun émetteur n'a été trouvé sous `gabarits\` ni au registre (une recherche par mots-clés ne rend que TF-1048, un item clos sur la remontée des écarts de socle en cours de mandat), mais une absence de trace n'est pas une preuve de non-exécution. Le prompt réécrit confie ce relevé à l'étude.
- L'enregistrement local et le push de l'analyse et de cette synthèse — motif : dépendance à une décision humaine ; R-38 §4 *(règle 38 : le push d'un dépôt est un GO humain)*.
- Aucune candidature au registre — motif : écarté ; l'analyse n'a relevé aucun défaut du pilot, et les trous qu'elle nomme sont l'objet de l'étude à venir. Critère de réouverture : l'étude lancée rend ses candidatures.

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore ce prompt : … » → **j'ai fait** l'analyse L99 complète en 8 couches avec prompt réécrit, et non une simple réécriture → **pourquoi** : le lexique RV-6 fait de cette formule un appel du skill, dont le livrable est cette analyse.
- **Vous avez écrit** « Construis une étude d'opportunité… » → **je n'ai pas** joué l'étude → **pourquoi** : le texte est l'entrant du L99 ; l'exécution attend D-1.
- **Les neuf écarts entre votre prompt et le prompt réécrit**, poste par poste au chapitre 8 de l'analyse, section « Écarts à la lettre » : (1) « pour la mise en place » devient une question ouverte ; (2) « hebdomadaire » devient une hypothèse à justifier par le débit ; (3) l'existant des forges et des produits est lu, jamais écrit ; (4) « nettoyage du code mort » devient un relevé de l'existant dormant, sans suppression ; (5) « optimisation de l'existant » n'a plus de chantier propre, faute de grandeur nommée ; (6) « en limitant les interventions humaines » devient une carte en trois familles, vos décisions intouchables ; (7) les six étapes citées sont lues comme la chaîne produit, pilot, forge, produit ; (8) « accélération systématique » devient un délai de bout en bout mesuré avec une contre-mesure sur le stock ; (9) quatre seuils sont ajoutés, proposés par moi : 7 jours de délai médian, 10 objets dormants, 5 gestes mécaniques par semaine, 5 candidatures par passage.

## 7. Risques

- L'étude, une fois lancée, rend un catalogue d'idées favorable à chaque objet, parce que c'est le livrable le plus rapide à écrire ;
  - signal : une étude sans annexe de mesure, ou une option « ne rien faire » écartée sans chiffre ;
  - parade : le contrat de sortie du prompt réécrit exige les 5 mesures datées avec leur commande, et l'oracle d'étude refuse une option « ne rien faire » passée sous silence.
- Une revue hebdomadaire retenue par l'étude vous apporte plus de décisions qu'elle ne vous retire de gestes ;
  - signal : le stock de candidats monte deux passages de suite ;
  - parade : le prompt réécrit impose un plafond de cinq candidatures par passage et une relecture du dispositif sur ce signal.
- L'analyse, déposée sans être enregistrée, est emportée par l'enregistrement d'une autre session qui travaille dans le pilot ;
  - signal : un enregistrement d'une autre session contenant le fichier de l'analyse ;
  - parade : acceptation déclarée ; le contenu reste intact, et A-2 l'enregistre sur votre demande.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-1 avant celle qui attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Jouer l'étude d'opportunité avec le prompt réécrit du chapitre 8 de l'analyse (amendé si D-1 (b)) : relevé, 5 mesures sur quatre semaines, carte des gestes humains, options, verdict, candidatures, restitution (neuve) | auto_ia | `dependance_bloc_3` — attend D-1 ; à défaut, l'étude n'est pas jouée | complexe × moyen |
| A-2 | Enregistrer localement l'analyse, cette synthèse et les index de dossiers par `git commit --only -- <chemins>`, puis pousser le pilot si vous le demandez (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-4 ; à défaut, les fichiers restent non enregistrés en local | simple × court |
| A-3 | Trancher D-1 — répondre « D-1 (a) », « D-1 (b) sauf écart n° X » ou « D-1 (c) » ; l'étude est jouée par l'IA (neuve) | manuelle_utilisateur | `decision` — une intention reconstruite est validée par le demandeur ; sinon : l'étude n'est pas jouée | simple × court |
| A-4 | Donner le feu vert d'enregistrement — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — le push d'un dépôt est un GO humain ; sinon : l'analyse reste déposée, non enregistrée | simple × court |

## 9. Traces

- Analyse L99 : `output\03-etudes\20260917-L99-revue-hebdomadaire-amelioration-continue.md` (ajoutée à l'index git, non enregistrée) ; index des dossiers régénérés par `scripts\readme-dossiers.mjs` → « README régénérés (3) ».
- Cette synthèse : `output\04-plans\Digit-AI - Synthese L99 - Revue hebdomadaire de l existant prompt reecrit - 20260917b.md`.
- Oracles : `check_markdown.py` (PASS, 1 passe) ; `oracle-synthese` sur ce fichier (PASS au deuxième jugement ; un premier refus sur la glose de deux désignateurs et sur le style, corrigé).
- Aucune page HTML livrée dans ce tour.
