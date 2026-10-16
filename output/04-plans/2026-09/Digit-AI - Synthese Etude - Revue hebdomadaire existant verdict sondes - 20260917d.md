---
destinataire: humain
---

# Synthèse d'étude — votre « 1a » est exécuté : l'étude est jouée, elle écarte la revue hebdomadaire rédigée et retient d'étendre la sonde qui tourne déjà ; 4 candidatures attendent votre décision (17/09/2026)

Votre décision est exécutée : l'étude d'opportunité est jouée, jugée verte par son contrôle, et ses 4 candidatures sont entrées au registre des améliorations. Ce qu'elle change pour vous : la mesure ne justifie pas une revue hebdomadaire de plus à lire. Le pilot décide et clôt un item en moins d'un jour en médiane, et le dépôt ne porte que 6 objets dormants. Le retard mesuré est ailleurs : plus de la moitié des corrections mesurables n'arrivent pas chez les produits, parce que chaque descente attend que vous ouvriez une session chez le produit. L'étude retient donc d'ajouter 4 sondes à la surveillance hebdomadaire existante, qui ne vous demande rien tant qu'elle est verte. Rien n'est construit, rien n'est supprimé, rien n'est publié. Ce qui est attendu de vous : dire lesquelles des 4 candidatures passent en décidé.

## 1. En-tête d'identification

- **quoi** — exécution de votre décision « 1a », c'est-à-dire l'option (a) de la décision sur les 9 écarts du prompt réécrit : étude d'opportunité jouée avec ce prompt, mesure de base, état de l'art, options, verdict, candidatures.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; les forges et les produits lus par leurs traces au pilot, aucun de leurs dépôts ouvert en écriture.
- **quand** — 2026-09-17 07:58 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 07:48 ; durée mesurée ≈ 10 min à l'horloge du poste.
- **qui** — pilot `b284504` (aucun enregistrement fait dans ce tour) ; session Fable 5.1, aucune délégation, escalade de modèle : aucune ; oracles joués : `oracle-etude-opportunite`, `check_markdown.py` *(contrôle de lisibilité du Markdown)*, `oracle-todo` *(juge du registre)* et `oracle-synthese` sur ce document.
- **intention** — que la boucle d'amélioration tourne plus vite et vous demande moins de gestes, sans vous retirer une décision que les règles vous réservent. Test rétro : le verdict sert cette intention, puisqu'une sonde ne demande rien tant qu'elle est verte et qu'aucun de vos gates n'est touché. Il ne sert pas la lettre sur 2 points, dits au bloc 6 : pas de revue rédigée, et « l'optimisation de l'existant » retirée faute de grandeur à optimiser.

## 2. Verdict en une ligne

**Étude jouée, option retenue : étendre le plan de sondes existant, sans objet neuf ; 1 seuil franchi sur 3 (88 couples produit × classe non atteints sur 164 ; 6 objets dormants pour un seuil de 10 ; 3,0 gestes mécaniques par semaine pour un seuil de 5) ; `oracle-etude-opportunite` PASS, exit 0 ; 4 candidatures ingérées en `candidat`, TF-1163 à TF-1166 ; `oracle-todo` PASS ; aucun enregistrement git, aucun push.**

## 3. Décisions attendues de l'humain

Bloquants — un travail est à l'arrêt, et voici ce qui le lève :

- **ce qui est bloqué** : la mise en œuvre des 4 améliorations sorties de l'étude, qui sont entrées au registre en attente ; **ce qu'il faut décider** : lesquelles passent en décidé, en répondant par le sélecteur ci-dessous ; **si rien n'est fourni** : les 4 restent en attente, et les 88 descentes non constatées, le stock de 40 items décidés non clos et le silence des sources restent sans aucun signal.

> **D-2 — Les 4 candidatures de l'étude passent-elles en décidé ?**
>
> L'étude a mesuré où la boucle d'amélioration perd du temps, sur 4 semaines. Elle propose 4 améliorations, toutes au pilot, toutes sans objet neuf : ajouter 4 sondes à la surveillance hebdomadaire (descentes non constatées, items ouverts de plus de 7 jours, contrôles sans appelant, sources silencieuses) ; générer une vue de la descente par produit, avec la proposition d'un lot de travaux pour tout produit en retard de plus de 7 jours ; instruire un par un les 4 contrôles que rien n'appelle et faire jouer leur relevé chaque semaine ; vous reposer, avec sa mesure, la décision du 30 août sur l'obligation d'émettre des retours, restée sans exécution. Aucune ne supprime un fichier, n'écrit chez un produit ni ne retire une de vos décisions.
>
> **Recommandation : (a).** Source consultée : l'étude, section « Ce que la mesure établit » (88 couples non atteints sur 164, stock d'items décidés non clos passé de 3 à 40, silence des sources allongé depuis le 30/08) ; `references\TODO-FORGE.md` l. 128 (seul un mandat humain fait passer un candidat en décidé) ; `REGLES-PROJET.md` l. 262-274, la règle 29 (la voie automatisée est le défaut, les gates restent humains). Les 4 sont d'effort faible et s'appuient sur des pièces qui existent.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** décider les 4 | effort moyen × court pour l'ensemble, tout au pilot | exclut d'attendre le plan de revue du 15/10 pour agir sur la descente |
| **(b)** en décider une partie — répondre « D-2 (b) : TF-1163, TF-1164 » par exemple | effort au prorata | exclut les améliorations non nommées, qui restent en attente |
| **(c)** n'en décider aucune | effort nul | exclut tout signal sur la descente, le stock et le silence des sources jusqu'à nouvel ordre |

> **Si rien n'est décidé** : l'option (c) s'applique — les 4 candidatures restent en attente au registre.

## 4. Traité — avec sa preuve

- **Votre « 1a » a reçu son geste : l'étude est jouée et jugée.** Verdict unique, option « ne rien ajouter » réfutée par 3 chiffres, 3 autres options réfutées, test rétro écrit, plan de revue au 2026-10-15.
  - preuve : `output\03-etudes\20260917-etude-opportunite-revue-hebdomadaire-de-l-existant.md` ; `node oracles/oracle-etude-opportunite.mjs <ce fichier>` → `"verdict": "PASS"`, exit 0 ; `check_markdown.py` → « Verdict : PASS ».
- **La mesure de base est relevée, datée et rejouable** : débit par semaine, délais, qualité du traitement, existant dormant, gestes humains, émission des retours. Le script est embarqué dans l'annexe. Il a été joué 2 fois : les semaines closes rendent les mêmes chiffres, les items ouverts sont passés de 41 à 48 parce qu'une autre session écrivait au registre.
  - preuve : `output\03-etudes\20260917-revue-hebdomadaire-mesure-pas0.md` ; `check_markdown.py` → « Verdict : PASS » ; `node scripts/relever-appelants.mjs` → « 55 contrôle(s), 4 sans appelant exécutable ».
- **Ce que la mesure dit** : 709 items clos en 4 semaines ; de l'entrée à votre décision, 0,0 jour en médiane et 2,0 jours au 90e centile ; de l'entrée à la clôture, 0,1 jour en médiane ; 756 passages en décidé ; 88 couples produit × classe non atteints sur 164 mesurables ; gabarit de restitution hérité conforme chez 0 produit sur 11 ; silence médian des sources 11 jours.
  - preuve : sections 1, 2, 5 et 6 de l'annexe ; `todo\RECIDIVES.md` sections 2 et 3, état au 16/09/2026.
- **L'état de l'art est instruit** : 6 sources datées de moins de 24 mois, lues par leurs résumés de recherche, ce que l'étude déclare.
  - preuve : section 3 de l'étude ; règle des sources datées de `oracle-etude-opportunite` au vert.
- **Les 4 candidatures sont au registre, en attente de votre décision.**
  - preuve : `node todo/ingerer-lot.mjs` → « [OK] 4 candidature(s) ingérée(s) en CANDIDAT (lot ef5e50022ba3) » ; identifiants TF-1163, TF-1164, TF-1165, TF-1166 relus au registre ; `node todo/oracle-todo.mjs` → `"verdict": "PASS"` ; vues régénérées → « TODO.md générée — 384 actifs ».
- **Le sort de la décision du 30 août sur l'émetteur de retours est établi** : sans exécution. Aucun émetteur hérité, aucune déclaration d'héritage, aucun rappel de silence au hook d'ouverture.
  - preuve : `grep -n -i silence` sur le hook d'ouverture, le lanceur hérité et le gabarit de lot → aucune occurrence liée à l'émission ; `ls gabarits` → aucun émetteur.

## 5. Non traité — avec son motif

- La mise en œuvre des 4 candidatures — motif : dépendance à une décision humaine (D-2) ; le prompt de l'étude interdit de construire un mécanisme.
- Le relevé d'usage des 4 contrôles sans appelant chez les produits — motif : hors mandat ; l'étude lit les produits par leurs traces au pilot, et ce relevé appartient à la candidature TF-1165.
- Le balayage de l'existant dormant dans les 13 forges — motif : impossible à prouver ici ; le relevé des appelants ne lit que le pilot, ce que l'étude et l'annexe déclarent.
- Le compte des ouvertures de session chez les produits — motif : impossible à prouver ici ; aucun journal ne les compte. C'est pourtant le geste mécanique le plus coûteux de la chaîne selon la mesure.
- La page HTML de l'étude — motif : écarté ; le prompt validé ne la demande pas. Critère de réouverture : vous la demandez, et elle passe alors par la critique d'implémentation de forge-design.
- L'enregistrement local et le push — motif : dépendance à une décision humaine ; le push d'un dépôt est un GO humain.

## 6. Écarts à la lettre

- **Vous avez écrit** « 1a » → **j'ai fait** l'étude avec le prompt réécrit tel quel, sans amender ses 4 seuils → **pourquoi** : l'option (a) validait les 9 écarts en bloc.
- **Vous aviez demandé** une étude « pour la mise en place d'un process d'analyse et d'étude hebdomadaire » → **l'étude conclut** contre une revue rédigée et pour 4 sondes de plus sur la cadence hebdomadaire existante → **pourquoi** : le pilot traite en moins d'un jour, et une revue ajouterait jusqu'à 5 décisions par semaine aux 12,7 messages de décision que vous rendez déjà.
- **Vous aviez demandé** « l'optimisation de l'existant » → **l'étude la retire** du verdict → **pourquoi** : aucune grandeur à optimiser n'est nommée, et la mesure n'en fait ressortir aucune. C'est dit dans le test rétro, pas servi en silence.
- **Vous aviez demandé** « le nettoyage du code mort » → **l'étude rend** un relevé de 6 objets et une candidature d'instruction, sans suppression → **pourquoi** : supprimer est un geste humain, et le précédent des composants inutilisés montre que 5 retraits « évidents » sur 10 étaient faux.
- **Le prompt validé demandait** 5 candidatures au plus → **j'en ai émis 4**, aucun contenu au-delà de ce périmètre : 1 étude, 1 annexe, 1 fichier de candidatures, cette synthèse.

## 7. Risques

- Les 4 sondes, une fois posées, virent au rouge dès le premier passage et y restent, parce que 88 descentes sont déjà en retard ;
  - signal : un relevé d'ouverture rouge 2 semaines de suite sur la même sonde ;
  - parade : la candidature des sondes prévoit de régler les seuils après 2 passages, et la vue par produit dit quel produit ouvrir en premier.
- La mesure des gestes humains sous-estime votre charge, parce que les sessions ouvertes chez les produits ne sont comptées nulle part ;
  - signal : vous jugez que 3,0 relances par semaine ne ressemble pas à votre semaine ;
  - parade : acceptation déclarée ; l'étude le dit, et le plan de revue du 15/10 confronte le verdict à 3 chiffres qui ne dépendent pas de cette mesure.
- Les fichiers du tour, non enregistrés, sont emportés par l'enregistrement d'une autre session qui travaille dans le pilot en ce moment ;
  - signal : un enregistrement d'une autre session contenant l'étude ou le fichier de candidatures ;
  - parade : acceptation déclarée ; le contenu reste intact, et A-2 enregistre sur votre demande.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui attend D-2 avant celle qui attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Mettre en œuvre les candidatures décidées, dans cet ordre : les 4 sondes (TF-1163), la vue de descente par produit (TF-1164), l'instruction des 4 contrôles (TF-1165), la décision sur l'émission des retours reposée avec sa mesure (TF-1166) | auto_ia | `dependance_bloc_3` — attend D-2 ; à défaut, aucune sonde ne regarde la descente ni le stock | moyen × court |
| A-2 | Enregistrer localement l'analyse du prompt, l'étude, l'annexe, le fichier de candidatures, le registre et les 2 synthèses par `git commit --only -- <chemins>`, puis pousser si vous le demandez (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-4 ; à défaut, les fichiers restent non enregistrés en local | simple × court |
| A-3 | Trancher D-2 — répondre « D-2 (a) », « D-2 (b) : TF-… » ou « D-2 (c) » ; la mise en œuvre est jouée par l'IA (neuve) | manuelle_utilisateur | `decision` — seul un mandat humain fait passer un candidat en décidé ; sinon : les 4 candidatures restent en attente | simple × court |
| A-4 | Donner le feu vert d'enregistrement — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — le push d'un dépôt est un GO humain ; sinon : rien n'est enregistré | simple × court |

## 9. Traces

- Étude : `output\03-etudes\20260917-etude-opportunite-revue-hebdomadaire-de-l-existant.md`.
- Annexe de mesure, script embarqué : `output\03-etudes\20260917-revue-hebdomadaire-mesure-pas0.md`.
- Candidatures : `input\01-candidatures\revue-hebdomadaire-de-l-existant-20260917a.tf.jsonl` ; registre `todo\TODO.jsonl`, items TF-1163 à TF-1166.
- Analyse du prompt d'origine : `output\03-etudes\20260917-L99-revue-hebdomadaire-amelioration-continue.md`.
- Oracles : `oracle-etude-opportunite` (PASS, 1 passe) ; `check_markdown.py` (PASS sur l'étude et sur l'annexe) ; `oracle-todo` (PASS) ; `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour.
