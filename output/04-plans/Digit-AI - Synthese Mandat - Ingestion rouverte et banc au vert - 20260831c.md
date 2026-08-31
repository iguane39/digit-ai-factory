---
destinataire: humain
---

# Synthèse de mandat — l'ingestion rouverte, deux journées enregistrées, et le banc entièrement vert (31/08/2026)

Vos trois actions sont faites. La boîte d'entrée était fermée depuis la remise à niveau de
mercredi : elle est rouverte, et les quatre lots qui attendaient sont entrés — vingt et une
demandes, dont les toutes premières d'un produit qui n'avait jamais rien remonté. Les deux
journées de travail sont enregistrées en quatre commits, rien n'est publié. Et le banc de contrôle
du dépôt, qui comptait sept défauts en début de tour, est désormais **entièrement vert** : deux des
trois causes venaient de la purge de noms de la semaine dernière, qui avait cassé des recettes
sans que personne ne le voie. Une erreur de ma part en chemin, rattrapée par un mécanisme du dépôt
plutôt que par moi : j'ai écrasé une recette existante en croyant la créer, et c'est le compteur
de cas qui l'a signalé.

## 1. En-tête d'identification

- **quoi** — exécution des actions 1, 3 et 4 : rouvrir l'ingestion et prendre les lots, enregistrer deux journées, traiter le lot des items de faible portée.
- **sur quoi** — le pilot `digit-ai-factory`, la forge `digit-ai-forge-agents`, et les deux tables d'anonymisation à la racine du parc.
- **quand** — fin le **31/08/2026 à 23:12 (UTC+02:00)**, durée **≈ 1 h 30**.
- **qui** — session pilot Claude Opus 5 ; pilot passé de `66c76d2` à `556459c`, forge passée à `098b959`.

## 2. Verdict en une ligne

**Banc du dépôt à 74/74 recettes vertes**, contre 7 défauts en début de tour ; ingestion rouverte et **4 lots pris, 21 demandes** entrées ; **4 commits** locaux, aucun envoi ; **2 items clos** et **2 candidats neufs** dont les correctifs sont dans le code et attendent votre décision.

## 3. Décisions attendues

**Chapeau commun.** Deux constats nés du passage du banc sont corrigés dans le code mais restent
au statut de candidat : le registre refuse le passage direct de candidat à corrigé, et il a raison
— un candidat se décide avant de se clore. C'est la seule décision de ce tour. Les dix décisions
plus anciennes sont rappelées au dernier bloc.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le
tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que
la retenir ferme définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si
vous ne tranchez pas.

> **D-29 — Décidez-vous les deux constats nés du banc, dont les correctifs sont déjà écrits ?**
> Les deux recettes cassées par la purge de noms de la semaine dernière sont réparées et vertes, mais leurs deux items restent candidats. Le registre a refusé que je les clôture moi-même, parce qu'il exige une décision humaine entre le constat et la clôture. Les décider ne change rien au code : cela autorise seulement à les inscrire comme corrigés, avec leurs gains.
> **Recommandation : (a).** Source consultée : la règle R5 de `todo\oracle-todo.mjs`, qui a refusé la transition et nommé son motif — « transition illégale candidat → corrige » —, et le mode opératoire du registre, qui pose que tout entre en candidat et que la décision reste humaine.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Les décider tous les deux, puis les clore avec leurs gains | Effort **simple × court** ; deux écritures au registre | Exclut de laisser deux corrections vivantes sans trace de clôture |
| **(b)** Les décider et demander une correction différente | Effort **moyen × court** ; les correctifs actuels sont déjà éprouvés et le banc est vert | Exclut de garder le travail fait |
| **(c)** Les laisser candidats | Effort nul | Exclut la clôture : le registre portera deux constats ouverts sur un défaut déjà réparé, ce qui le rend faux dans l'autre sens |

> **Si rien n'est décidé** : (c) s'applique, et le registre continue d'annoncer ouverts deux défauts qui ne le sont plus.

## 4. Traité — avec sa preuve

- **L'ingestion est rouverte, et les deux tables sont reconstruites par mesure et non par devinette.**
  - preuve : dérivation du croisement de `todo\TODO.jsonl` et `todo\TODO-ARCHIVE.jsonl` — 684 tâches communes, 407 substitutions relevées. Un piège évité au passage : l'indice 6 des produits, attribué sur un autre poste, est **réservé explicitement** ; sans cela le compteur aurait rendu un pseudonyme déjà pris et deux produits en auraient porté le même. Vérifié : le produit neuf a reçu **Produit-12**.
  - preuve d'une erreur rattrapée avant écriture : deux substitutions mesurées la veille — un fournisseur et une enseigne — manquaient au fichier dérivé, qui avait été filtré sur les seuls pseudonymes en `Produit-` et `Client-`. Elles sont rétablies.
- **Les 4 lots en attente sont pris**, dont les deux premiers d'un produit resté muet jusqu'ici.
  - preuve : **21 candidatures** ingérées — 5, 6, 6 et 4. Le contrôle de boîte passe de FAIL à **PASS**, sortie 0 ; le registre reste **PASS**.
- **Les deux journées sont enregistrées en 4 commits**, aucun envoi.
  - preuve : `098b959` chez la forge des skills ; puis `176bc5e`, `ba7bca0`, `b7489fe` et `556459c` chez le pilot. Arbre de travail à **0 modification**. Rien n'est publié.
- **TF-0692 est clos, avec une recette portée à 10 cas**, et la mesure a renversé la variante que l'item recommandait.
  - preuve : le sceau des livrables couvre désormais le PDF. L'item recommandait un contrôle de cohérence sans lire le fichier ; la mesure a montré que le sceau hache un **buffer**, donc que l'extension coûtait deux lignes. Effet de bord mesuré avant d'être supposé : **zéro** PDF dans ce dépôt.
- **Une erreur de ma part, rattrapée par le dépôt et non par moi** : 7 cas détruits, puis restaurés.
  - preuve : j'ai écrasé la recette existante de ce contrôle en croyant la créer — 7 cas détruits. Le **cliquet** l'a signalé, mot pour mot « 7 → 5 cas, 2 DISPARU(S) », et l'originale a été restaurée depuis l'historique. Mes trois cas sur le PDF y sont désormais **ajoutés**, dans un répertoire propre pour ne pas fausser les compteurs des sept autres. Recette à **10 cas** ; mutation jouée : sans le PDF au champ, **8/10**.
- **Deux recettes cassées par la purge de noms de la semaine dernière sont réparées.**
  - preuve, première : la recette du contrôle d'héritage isole son parc, si bien que l'anonymiseur y cherchait des tables absentes — rouge depuis le 28/08, **2 réussites sur 8**. Elle pose désormais ses propres tables jetables, vides de tout nom réel. **8 sur 8**.
  - preuve, seconde : la recette de localisation portait l'égalité « normaliser d'un pseudonyme est égal à un nom réel normalisé » — **autocontradictoire**. La substitution de masse avait réécrit le membre gauche sans toucher le droit. **11 sur 11** après correction.
- **Le banc du dépôt est entièrement vert**, ce qu'il n'était plus depuis au moins mercredi.
  - preuve : `node oracles\self-tests.mjs` rend « **74/74 recettes jouées et vertes** — oracles, fichiers de test du dépôt, état du parc — cliquet des cas tenu ». Il comptait **7 défauts** au début de ce tour.

## 5. Non traité — avec son motif

- **La clôture des deux constats neufs** : *dépendance à une décision humaine* — le registre refuse candidat → corrigé, et c'est la décision ci-dessus.
- **Les 5 lots de travaux prêts pour vos produits** : *hors mandat* — vous avez retenu les actions 1, 3 et 4, et écarté la 2. Ils restent prêts et l'émetteur reste idempotent.
- **Les 21 demandes qui viennent d'entrer** : *dépendance à une décision humaine* — elles entrent toutes en candidat par construction, et la décision reste humaine. Le registre compte désormais **44 items actifs**.
- **Les 9 autres items de faible portée visant ce dépôt** : *hors mandat de ce tour* — deux ont été traités à fond plutôt que neuf en surface, et trois des quatorze visent des dépôts frères, donc hors de portée sans mandat.
- **La classe de défaut découverte sur la seconde recette** : *écarté pour ce tour* — une substitution automatique casse toute égalité dont les deux membres dérivent du même texte, et rien ne dit qu'elle n'a frappé que là. Le balayage n'a pas été fait, et c'est écrit dans le reste-à-faire de l'item.
- **Les 10 décisions ouvertes aux tours précédents** : *hors mandat*.

## 6. Écarts à la lettre

- **vous avez demandé** l'action 4, « traiter le lot des 14 items de faible portée » → **j'ai traité 2 items et ouvert 2 constats neufs** → **pourquoi** : le premier item traité a révélé que le banc lui-même était cassé en trois endroits, et réparer le banc était le préalable — un contrôle rouge en permanence ne protège plus rien. Le lot n'est donc pas soldé, et je le dis plutôt que de le laisser croire.
- **vous avez demandé** l'action 1 → **j'ai reconstruit les tables et pris les 4 lots, pas seulement les 2 annoncés** → **pourquoi** : deux autres lots sont arrivés pendant le tour, à 21 h 15 et 21 h 23. Les laisser aurait rendu le contrôle de boîte rouge à l'arrivée, pour un travail qui était déjà fait.
- Aucun autre écart.

## 7. Risques

- **La classe de défaut de la substitution automatique n'est pas balayée.**
  - signal : une autre recette rendue rouge ou, pire, rendue verte à tort, parce que les deux membres d'une comparaison ont été réécrits de façon incohérente.
  - parade : le constat est ouvert avec son reste-à-faire écrit ; le balayage se ferait en cherchant les égalités dont les deux membres dérivent du même texte. Non fait, et déclaré comme tel.
- **Les deux tables reconstruites peuvent être incomplètes.**
  - signal : un lot entre au registre en portant encore un nom réel, ou la substitution ne rapporte rien là où un nom était attendu.
  - parade : la chaîne rapporte à chaque lot les noms qu'elle a substitués ; la table des organisations ne s'étend PAS toute seule, et cette limite est écrite dans le fichier lui-même.
- **44 items actifs, dont 21 entrés aujourd'hui.**
  - signal : le registre grossit plus vite qu'il ne se vide, et les plus anciens vieillissent sans être ni faits ni écartés.
  - parade : acceptation déclarée — rouvrir un canal fait entrer ce qui attendait, et c'est le comportement voulu. Le tri reste une décision humaine par construction.
- **Rien n'est publié.**
  - signal : un autre poste continue de travailler sur une doctrine plus ancienne, et les neuf dépôts frères restent divergés.
  - parade : la publication relève de votre feu vert ; les quatre commits sont locaux et prêts.

## 8. Prochaines actions

Ordre de traitement : décider les deux constats coûte le moins et débloque le plus — c'est la seule chose qui empêche le registre de dire faux dans les deux sens.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | TF-0725, TF-0726 | Décider les deux constats, puis les inscrire comme corrigés avec leurs gains. | `auto_ia` | `dependance_bloc_3` — le registre refuse la transition sans décision humaine, et il a raison de la refuser. | Le registre annonce ouverts deux défauts déjà réparés — il devient faux dans l'autre sens. |
| 2 | `neuve` | Publier les 4 commits vers les dépôts distants du pilot et de la forge des skills. | `auto_ia` | `gate_gouvernance` — la publication relève d'un feu vert humain par les garde-fous du noyau. | Les autres postes continuent sur une doctrine plus ancienne, et le lexique d'invocation y reste inerte. |
| 3 | `neuve` | Traiter les 9 items de faible portée restants qui visent ce dépôt, chacun avec sa correction et sa recette. | `auto_ia` | `hors_mandat` — du ressort de l'IA, mais d'un tour dédié : le banc devait être remis au vert d'abord, ce qui est fait. | Le registre ne descend pas, et 44 items actifs vieillissent. |
| 4 | `neuve` | Balayer la classe de défaut de la substitution automatique : chercher les égalités de test dont les deux membres dérivent du même texte. | `auto_ia` | `hors_mandat` — constat ouvert aujourd'hui, dont le reste-à-faire est écrit. | Une recette peut être verte à tort pour la même raison, sans que rien ne le signale. |
| 5 | `neuve` | Faire tourner les 2 jetons d'hébergeur hors dépôt et les 4 secrets publiés, relevés avant-hier. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de chaque fournisseur. Trace mesurée : la lecture n'a donné que la longueur des valeurs, 36 caractères pour les jetons ; aucune tentative d'authentification n'a été faite et aucune n'est possible d'ici sans employer l'identifiant lui-même. | Des identifiants de déploiement restent lisibles sur le disque, hors de portée de toute protection. |
| 6 | `neuve` | Trancher les 10 décisions ouvertes aux tours précédents, dont le dépôt des 5 lots de travaux. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance. | 44 tâches restent sans exécution, et les produits sans nouvelle du pilot. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Ingestion rouverte et banc au vert - 20260831c.md`
- Commits : forge des skills `098b959` · pilot `176bc5e`, `ba7bca0`, `b7489fe`, `556459c` — arbre à 0 modification, **rien de publié**
- Tables reconstruites hors dépôt : celle des organisations, figée ; celle des produits, extensible, 12 entrées dont l'indice 6 réservé
- Lots pris : 4, pour 21 candidatures — contrôle de boîte **PASS**, registre **PASS**, 44 items actifs
- Bancs : `oracles\self-tests.mjs` **74/74** · sceau des livrables 10 cas, mutation 8/10 · contrôle d'héritage à l'ingestion 8/8 · localisation 11/11 · restitution 11/11 · produits-intacts 14/14
