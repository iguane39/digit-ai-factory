---
role: étude d'opportunité (instruction entre candidat et décidé) — faut-il ajouter une revue hebdomadaire de l'existant à la boucle d'amélioration de la factory et des forges ; jouée le 17/09/2026 sur décision humaine D-1 (a), avec le prompt réécrit du chapitre 8 de l'analyse L99 du même jour
sources_de_verite: [output/03-etudes/20260917-L99-revue-hebdomadaire-amelioration-continue.md (prompt réécrit), output/03-etudes/20260917-revue-hebdomadaire-mesure-pas0.md (annexe de mesure), BOUCLE-AMELIORATION.md (l. 12-13, 44-85, 109-130), todo/observabilite/plan-recidives.json, oracles/hook-ouverture.mjs (l. 50-58, 257-284, 324-344), todo/RECIDIVES.md (état au 16/09/2026), references/TODO-FORGE.md (l. 85-132, 258-276), scripts/relever-appelants.mjs, todo/emettre-travaux.mjs (l. 9-38), REGLES-PROJET.md (R-29 l. 262-274, R-38 l. 578-600), references/REGLES-DE-NON-REPETITION.md (l. 30), synthèses 20260830j, 20260830k, 20260903b et 20260903c de output/04-plans]
verifie_le: 2026-09-17
---

# Étude d'opportunité — revue hebdomadaire de l'existant — 20260917a

Audience : le pilote de l'écosystème, qui décide. Ce que l'étude change pour lui : la mesure ne
justifie pas une revue hebdomadaire neuve. Le pilot décide et clôt un item en moins d'un jour en
médiane, et le dépôt porte 6 objets dormants. Le retard mesuré se loge ailleurs : plus de la
moitié des corrections mesurables n'arrivent pas chez les produits, parce que chaque descente
attend qu'un humain ouvre une session chez le produit. L'étude retient d'étendre la sonde
hebdomadaire qui tourne déjà, et dépose 4 candidatures. Rien n'est construit, rien n'est supprimé.

## Seuil de déclenchement (vérifié avant écriture)

Le seuil est franchi par deux critères de `gabarits\ETUDE-OPPORTUNITE.md` l. 15-17. Le sujet
touche le noyau, puisque la cadence est tenue par le hook d'ouverture du pilot. Il touche aussi
plus de trois forges, puisque la chaîne étudiée traverse le pilot, forge-observability et toute
forge qui reçoit un lot.

## Intention de l'utilisateur (loi n° 7)

L'intention, dans les mots du demandeur, le 17/09/2026 :

> « mettre en oeuvre un processus d'amélioration continue des outils […] en limitant les
> interventions humaines […] et accélération systématique de ses processus d'amélioration
> continue. »

Sa demande d'origine nommait cinq objets : une analyse « hebdomadaire de l'existant de la factory
et des forges », « l'optimisation de l'existant, le nettoyage du code mort », « l'analyse des
retours et todos traités et la façon dont ils ont été traités et appliqués », « les prochaines
actions à mettre en oeuvre », et l'automatisation des retours « en limitant les interventions
humaines ».

L'intention a été reformulée par l'analyse L99 du 17/09/2026, puis validée par le demandeur le
même jour par sa réponse « 1a », qui tranche la décision D-1 en option (a). La formulation validée :
que la boucle d'amélioration tourne plus vite et demande moins de gestes, sans retirer au
demandeur une seule décision que les règles du projet lui réservent.

## 0. Traitement des entrants

Le prompt réécrit est une donnée : ses impératifs sont cités, et ses quatre seuils sont des
valeurs proposées que le demandeur a validées en bloc. Sources de la proposition : le message du
demandeur du 17/09/2026, l'analyse
`output\03-etudes\20260917-L99-revue-hebdomadaire-amelioration-continue.md`, et la décision D-1 (a).
Les forges et les produits ont été lus comme des données, par leurs traces au pilot. Aucun de
leurs dépôts n'a été ouvert en écriture.

Le sort des deux décisions du 30/08/2026 sur l'émetteur de retours côté produit : sans trace
d'exécution. La synthèse `20260830k` les a refondues en une décision sur le partage entre la
machine et l'agent, avec pour repli « le canal reste ce qu'il est ». Aucun émetteur hérité
n'existe sous `gabarits\`, `gabarits\HERITAGE.json` n'en déclare aucun, et le hook d'ouverture ne
porte aucun rappel de silence.

## 1. Partition du problème

La question se découpe en quatre objets disjoints, plus une question transverse de cadence.

- **A. Revue de l'existant** : que regarderait une revue périodique que la sonde hebdomadaire et
  la revue des classes ne regardent pas ?
- **B. Existant dormant** : combien d'objets du dépôt ne servent plus, par type, et que vaut un
  relevé récurrent ?
- **C. Bilan des items traités** : quelles mesures du traitement méritent un suivi dans le temps ?
- **D. Automatisation de la chaîne** : quels gestes humains sont mécaniques, et quel mécanisme les
  retire ?
- **Cadence et porteur** : semaine, quinzaine ou seuil de volume ; hook de session, tâche locale
  ou agent hébergé.

## 2. Non-recouvrement contre l'existant

L'existant couvre déjà la cadence, le tableau de bord et trois des quatre mesures du traitement.
Il ne couvre ni la descente par produit, ni l'âge des items ouverts, ni le silence des sources.

Le tableau se lit ligne par ligne : un mécanisme existant, la citation qui le prouve, puis ce
qu'il recouvre de la question. Les lignes suivent l'ordre des objets A à D.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Sonde hebdomadaire des récidives (`todo\observabilite\plan-recidives.json` l. 4, 9, 17) | « cadence hebdomadaire tenue par le hook d'ouverture du pilot » ; « rien n'est appliqué automatiquement (R-29) » | recouvre la cadence et le porteur de A ; ne recouvre que 6 compteurs |
| Déclencheur de la sonde (`oracles\hook-ouverture.mjs` l. 324-339) | « LA CADENCE D'UN PLAN DE SURVEILLANCE EST TENUE PAR QUI L'INVOQUE » | recouvre le porteur en session ; ne recouvre pas une exécution hors session |
| Revue des classes (`BOUCLE-AMELIORATION.md` l. 53-54 et 64-67) | « au plus UNE revue par quinzaine, jouée à l'ouverture d'un tour du pilot » | recouvre l'anticipation par classe et sa contre-lecture ; ne recouvre pas l'existant dormant |
| Tableau des récidives (`todo\RECIDIVES.md` l. 5) | « est-ce la deuxième fois, chez qui, et depuis combien de temps la correction existe sans être appliquée » | recouvre C pour les récidives, le délai de descente par classe et la contre-métrique ; ne recouvre pas une vue par produit ni une sonde sur les non atteints |
| Descente exigée à la clôture (`references\TODO-FORGE.md` l. 85-94) | « R12 refuse la clôture qui n'en porte aucun » | recouvre C depuis le 02/09 ; ne recouvre pas les 737 clôtures antérieures |
| Relevé des contrôles sans appelant (`scripts\relever-appelants.mjs` l. 3-18) | « quels contrôles du dépôt ne sont APPELÉS par rien » ; « Le relevé NOMME ; il ne condamne pas » | recouvre B pour les contrôles du pilot ; ne recouvre ni les forges ni un passage périodique, aucun lanceur ne l'appelle |
| Registre de dette (`todo\registre-dette.json`, affiché par `oracles\hook-ouverture.mjs` l. 312-320) | « limite(s) assumée(s) », « reste(s) à instruire » | recouvre B pour la dette déclarée |
| Boîte d'entrée bloquante (`oracles\hook-ouverture.mjs` l. 280-282) | « À TRAITER AVANT TOUT AUTRE TRAVAIL de cette session » | recouvre D pour l'ingestion au pilot ; ne recouvre pas l'émission chez le produit |
| Canal descendant (`todo\emettre-travaux.mjs` l. 24-32) | « CE SCRIPT N'ÉCRIT QUE DANS `input\00-travaux\` DU PRODUIT » ; « IL NE COMMITE RIEN chez le produit » | recouvre D pour le dépôt d'un travail ; ne recouvre pas son déclenchement, il se lance sur demande |
| Recopie de l'héritage à l'ouverture du produit (`oracles\hook-ouverture.mjs` l. 50-58) | « le contrôle RECOPIE lui-même les artefacts déclarés en COPIE IDENTIQUE » | recouvre D pour la descente une fois la session ouverte ; ne recouvre pas l'ouverture elle-même, qui reste un geste humain |
| Études antérieures (synthèses `20260903b`, `20260903c`, `20260830j`, `20260830k`) | « ce qui s'automatise, ce n'est pas le CONTENU d'un retour, c'est l'OBLIGATION d'en produire un et le TRANSPORT » | recouvre le cadrage de D ; la décision du 30/08 est restée sans exécution |

## 3. État de l'art daté

Six sources, toutes de moins de 24 mois. Elles convergent sur trois points : régler le débit d'un
automate sur la capacité de revue, ne jamais passer du relevé à la suppression, et garder
l'approbation humaine en ancrant l'amélioration à une spécification.

- DORA, « State of AI-assisted Software Development », 2025-09, https://dora.dev/dora-report-2025/ :
  l'IA amplifie ce que l'organisation est déjà ; le gain vient de la clarté des flux de travail,
  pas de l'outil.
- Andrew Nesbitt, « 16 Best Practices for Reducing Dependabot Noise », 2026-01-10,
  https://nesbitt.io/2026/01/10/16-best-practices-for-reducing-dependabot-noise.html : un automate
  périodique se règle sur la capacité réelle de revue, en groupant et en ralentissant la cadence.
- « Find Dead Code with Knip », 2026-05-02,
  https://recca0120.github.io/en/2026/05/02/knip-dead-code-detector/ : la détection statique
  dépend des points d'entrée déclarés ; la suppression se fait par étapes, jamais directement
  depuis le relevé.
- « Self-Improving AI Coding Agents Through Accumulated Behavioral Rules », arXiv 2607.13091,
  2026-07 : chaque remarque de revue acceptée devient une règle persistante. C'est le mécanisme
  que le registre et ses classes tiennent déjà.
- « The Kitchen Loop: User-Spec-Driven Development for a Self-Evolving Codebase », arXiv
  2603.25697, 2026-03 : une auto-amélioration ancrée à une spécification évite d'optimiser un
  indicateur pendant que le produit se dégrade.
- « Human-In-the-Loop Software Development Agents », arXiv 2411.12924, 2024-11 : 433 plans
  approuvés sur 527, soit 82 % ; l'approbation humaine reste le point de contrôle, elle n'est pas
  le goulot.

Limite déclarée : les sources ont été lues par leurs résumés de recherche le 17/09/2026, pas en
texte intégral. La planification d'agents hébergés par l'éditeur de Claude Code n'a été retrouvée
que dans des sources tierces ; elle n'entre pas dans le raisonnement au-delà de l'option O4.

## 4. Options — jeu fermé O0-O4

### Ce que la mesure établit

Les chiffres viennent de l'annexe `output\03-etudes\20260917-revue-hebdomadaire-mesure-pas0.md`,
relevée le 17/09/2026 sur la fenêtre du 20/08 au 17/09.

- Le pilot n'est pas lent. Sur 709 items clos, le délai entre l'entrée et la décision humaine est
  de 0,0 jour en médiane et de 2,0 jours au 90e centile. Le délai entre l'entrée et la clôture
  est de 0,1 jour en médiane. La décision humaine n'est pas le goulot.
- Le stock d'items décidés mais non clos est passé de 3 à 40 en quatre semaines, et 12 items
  ouverts ont plus de 7 jours. Aucune sonde ne regarde ce stock.
- La descente chez les produits est le retard mesuré. Sur 164 couples produit × classe
  mesurables, 88 ne sont pas atteints. Le gabarit de restitution hérité est conforme chez 0
  produit sur 11. Sur 87 classes, 75 ont une descente déclarée non mesurable.
- Les sources se taisent : silence médian de 11 jours au 17/09, contre 8 jours mesurés le 30/08 ;
  16 sources sur 23 n'ont rien remis depuis plus de 7 jours.
- L'existant dormant est petit : 4 contrôles sans appelant sur 55, 1 script et 1 référence cités
  par rien d'exécutable, soit 6 objets. S'y ajoutent 15 entrées de dette à instruire, déjà
  affichées à chaque ouverture.
- Les gestes mécaniques comptés au pilot sont de 3,0 par semaine, tous de la forme « traite tous
  les todos et retours ». Les ouvertures de session chez les produits ne sont comptées nulle part.

Confrontation aux seuils validés. Délai médian de bout en bout supérieur à 7 jours : non atteint
au pilot, et atteint sous réserve pour la descente, puisque le couple médian n'est pas atteint du
tout. Au moins 10 objets dormants confirmés : non atteint, 6. Au moins 5 gestes mécaniques par
semaine : non atteint sur ce qui est mesurable, 3,0. Un seuil sur trois est franchi, et c'est
celui de la descente.

Cadence : la semaine est gardée. Le débit va de 106 à 289 items créés par semaine, et le délai
médian entre une clôture et sa récidive est de 5,6 jours ; une quinzaine laisserait passer deux
récidives avant le premier regard. L'alternative écartée est le seuil de volume, qui suppose un
compteur tenu hors session, donc un ordonnanceur.

### Les options

Coût récurrent : chaque option dit ce qu'un passage coûte en lecture et en décisions demandées.

- **O0 — ne rien ajouter.** Coût : nul. Le statu quo laisse 88 descentes non constatées sans
  aucun signal, un stock de 40 items décidés non clos sans sonde, et un silence des sources passé
  de 8 à 11 jours. Réfutée par ces trois chiffres.
- **O1 — étendre le plan de sondes et le relevé d'ouverture existants, sans objet neuf.** Contenu :
  quatre sondes de plus dans `plan-recidives.json` (couples non atteints, items ouverts de plus de
  7 jours, contrôles sans appelant, sources silencieuses), même cadence, même porteur, même
  signal ; une vue de la descente par produit dans le tableau des récidives ; une relance de
  descente par le canal de travaux existant. Coût : moyen × court. Coût récurrent : quatre lignes
  de plus au relevé d'ouverture, zéro décision tant que rien ne dérive. Exclut : un rapport
  hebdomadaire rédigé, et toute exécution sans session ouverte.
- **O2 — revue périodique jouée en session, rendant un rapport daté et des candidatures.**
  Contenu : O1, plus un rapport et jusqu'à 5 candidatures par passage. Coût : complexe × moyen.
  Coût récurrent : une restitution à lire et jusqu'à 5 décisions par semaine, soit 40 % de plus
  que les 12,7 messages de décision hebdomadaires mesurés. Exclut : la sobriété d'O1. Réfutée : la
  mesure ne montre aucun objet que ce rapport verrait et que les sondes ne verraient pas, et
  l'état de l'art règle le débit d'un automate sur la capacité de revue.
- **O3 — revue lancée hors session par une tâche planifiée locale.** Coût : complexe × moyen, plus
  une dette d'exploitation (journaux, pannes sans lecteur, exercice à la demande exigé par la
  règle N-1 de `references\REGLES-DE-NON-REPETITION.md` l. 30). Réfutée : des sessions du pilot
  ont été ouvertes 21 jours sur 28, et aucune semaine de la fenêtre n'est restée sans ouverture ;
  le besoin d'une exécution sans session n'est pas mesuré.
- **O4 — revue lancée par un agent planifié hébergé.** Coût : complexe × long. Réfutée : le dépôt
  sortirait vers un service hébergé, ce que R-38 (`REGLES-PROJET.md` l. 579-583) soumet à un GO
  humain préalable, pour un besoin qu'O3 montre déjà non mesuré.

Par objet, ce qu'O1 retient et écarte :

- **A** : les quatre sondes. Pas de revue rédigée.
- **B** : le relevé des contrôles sans appelant entre au passage hebdomadaire ; les 4 contrôles
  relevés sont instruits un par un, câblés ou proposés au retrait par décision humaine. Le mot
  « mort » n'est employé pour aucun : un relevé d'usage chez les produits n'a pas été fait.
- **C** : le suivi garde trois mesures déjà générées (récidives par classe, délai de descente,
  contre-métrique) et ajoute l'âge des items ouverts. Le reclassement des 737 clôtures en prose
  est écarté : coût élevé, aucun gain mesurable attendu, critère de réouverture : une récidive
  dont l'item répété est antérieur au 02/09 et introuvable.
- **D** : deux gestes mécaniques sont candidats. La relance de descente devient une sonde qui
  nomme les produits en retard et propose le dépôt d'un lot de travaux. L'émission des retours
  repose la décision du 30/08, restée sans exécution. L'ouverture d'une session chez un produit
  reste humaine : la lancer depuis le pilot reviendrait à exécuter dans un dépôt frère, ce que le
  noyau réserve à un mandat. Aucun gate n'est touché.

## 5. Verdict

- **Option retenue : O1** — étendre le plan de sondes et le relevé d'ouverture existants, sans
  objet neuf.
- **Coût** : complexité moyen · durée court ; tokens : un passage de sonde par semaine, déjà payé,
  plus quatre lectures de fichiers ; dette : aucune pièce neuve à entretenir, quatre seuils à
  régler après deux passages.
- **Candidature(s) émise(s)** : sidecar
  `input\01-candidatures\revue-hebdomadaire-de-l-existant-20260917a.tf.jsonl`, 4 candidatures :
  (1) quatre sondes ajoutées au plan de surveillance, avec la contre-mesure du stock ; (2) vue de
  la descente par produit et relance par lot de travaux au-delà de 7 jours ; (3) instruction des 4
  contrôles sans appelant et câblage du relevé au passage hebdomadaire ; (4) émission des retours :
  reposer la décision du 30/08 sur l'obligation d'émettre et son rappel de silence.
- **Plan de revue** : 2026-10-15. Le verdict sera confronté à trois faits : le nombre de couples
  non atteints (88 aujourd'hui), le stock d'items décidés non clos (40), le silence médian des
  sources (11 jours). Si aucun n'a baissé après quatre passages, O1 est relue.
- **Test rétro** : chaque élément remonte à l'intention citée.
  - Les quatre sondes → tactique : voir ce qui dérive sans lecture humaine → stratégie : le manque
    est un signal sur la descente et le stock, pas une revue → intention : « limiter les
    interventions humaines », une sonde ne demande rien tant qu'elle est verte.
  - La relance de descente → tactique : nommer les produits en retard → stratégie : le retard
    mesuré est la descente → intention : « accélération » de la boucle là où elle est lente.
  - L'instruction des 4 contrôles → tactique : relevé récurrent, décision au cas par cas →
    stratégie : l'existant dormant est petit, 6 objets → intention : « nettoyage du code mort »,
    servi à sa taille réelle et sans suppression automatique.
  - L'émission des retours → tactique : reposer une décision restée sans exécution → stratégie :
    le silence des sources s'allonge → intention : « automatisant plus les retours depuis les
    produits ».
  - Rupture déclarée : « l'optimisation de l'existant » n'a pas d'élément opérationnel. Aucune
    grandeur à optimiser n'a été nommée, et la mesure n'en a fait ressortir aucune. L'objet est
    retiré, et non servi en silence.
  - Questions du demandeur rejouées. Un process hebdomadaire est-il opportun ? Oui sous la forme
    de sondes, non sous la forme d'une revue rédigée. Le code mort ? 6 objets, relevé câblé, rien
    de supprimé. La façon dont les items ont été traités et appliqués ? Traités en moins d'un
    jour ; appliqués chez les produits pour 76 couples sur 164. Les prochaines actions ? Les 4
    candidatures. Moins d'interventions humaines ? Le geste répété est l'ouverture de session
    chez les produits ; il reste humain, et la relance le rend visible et ciblé. L'accélération ?
    Elle se joue sur la descente, pas sur la décision.
