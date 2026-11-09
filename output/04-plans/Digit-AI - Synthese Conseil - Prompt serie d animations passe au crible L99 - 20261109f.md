## 0. Synthèse d'ouverture

Votre prompt est réécrit et prêt à lancer dans le dépôt marketing. Deux relecteurs qui n'avaient pas vu l'analyse l'ont noté 84 sur 100. Votre version d'origine est estimée à 34 par l'analyse, une note qu'aucun relecteur n'a mesurée. Le prompt fixe ce qui manquait : le format d'une animation (page HTML animée de 60 à 120 secondes), un décideur par épisode, et une table de preuves qui interdit de montrer une capacité absente des forges. Deux capacités que vous citez sont seulement partielles : le TDD et l'implémentation des couches Bronze, Silver et Gold. Le prompt les fait présenter pour ce qu'elles sont. Il garde 13 défauts majeurs, listés avec leur correction ; 5 de ces corrections sont déjà écrites et vérifiées. À vous de lancer le prompt chez le produit, et de dire si je reporte d'abord ces 5 corrections.

Livré : [Revue L99 du prompt série d'animations](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20s%C3%A9rie%20d'animations%20de%20la%20Factory%20pass%C3%A9%20au%20crible%20L99%20-%2020261109b.md)

Livré : [Journal de la boucle de relecture](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20s%C3%A9rie%20d'animations%20de%20la%20Factory%20pass%C3%A9%20au%20crible%20L99%20-%2020261109b.md.boucle.json)

## 1. En-tête d'identification

- Quoi : analyse L99 (grille de 8 couches du skill d'analyse de prompt) en mode boucle, sur le prompt « série d'animations présentant les pans de la Factory ». Restitution finale.
- Quand : 09/11/2026 17:11, heure relevée par `date`.
- Qui : session pilot, Opus 5.5, skill `prompt-analyzer-l99`.
- Intention : obtenir un prompt prêt à lancer, qui produise des animations de vente fidèles à ce que font les forges, et des idées d'animations en plus.
- Test rétro : le prompt retenu couvre-t-il les 5 pans et la demande d'idées ? Oui. Il porte une table des 5 épisodes et une section « Autres idées » qui demande au moins 6 idées, en 7 colonnes.

## 2. Verdict

Prompt retenu : passe 2, mesurée à 84 sur 100 (les deux relecteurs l'ont notée 84). La boucle s'est arrêtée pour régression. La passe 3 (74) et sa reprise (82) ont été notées plus bas, bien qu'elles ferment 5 majeurs de la passe 2. Le journal de boucle rend PASS à `oracle-boucle-l99.mjs`, exit 0. L'analyse rend PASS à `check_markdown.py` et à `oracle-ecriture.mjs`, exit 0 pour les deux.

## 3. Décisions attendues

Aucune décision ne vous revient : lancer le prompt et choisir d'y reporter les corrections sont deux actions du bloc 8.

## 4. Traité

- Analyse en 8 couches : 12 défauts inventoriés dans votre prompt d'origine, dont 7 majeurs et aucun bloquant.
- Prémisses mesurées dans les forges :
  - TDD : 2 fichiers de forge-development le citent (`git grep -l -w TDD`).
  - Fiche produit : 0 occurrence de « fiche produit » dans forge-conception, qui produit un PRD.
  - Couches de données : le `CLAUDE.md` de forge-data, ligne 14, dit qu'elle « vérifie la forme de la discipline, pas le contenu des données ».
  - Outillage : FFmpeg est absent du poste (`which ffmpeg` sans résultat), et `oracle-motion.mjs` existe.
- Boucle de relecture : 4 passes, 8 relecteurs aveugles, 4 vérificateurs de clôture. Tous les défauts graves ont été recomptés à la source ; 1 a été démenti, parce que l'oracle des noms charge bien sa table (11 termes, 51 noms).
- Pistes d'animations en plus des 5 pans, que le prompt fait vérifier contre les preuves :
  - un run complet, de l'idée à la mise en production, en une animation d'environ 90 secondes (durée estimée) ;
  - la qualité jugée par des oracles exécutés ;
  - la sécurité du livrable et des agents ;
  - l'audit d'un produit existant ;
  - la reprise d'un produit par rétro-modèle ;
  - la direction artistique dérivée de la marque ;
  - la mise en production gardée par un accord humain ;
  - la traçabilité des exigences jusqu'aux tests.
- Critique d'implémentation jouée à 17:15 sur la page témoin d'une ligne écrite pour essayer l'oracle des noms : FAIL, attendu pour une page sans charte, puis la page a été supprimée ; aucune page servie ne fait partie des livrables.
- Livrables enregistrés localement par `git commit --only`.
- Relecture d'intention : sert.

## 5. Non traité

- Correction des 13 majeurs ouverts dans le prompt retenu — motif : la règle de boucle garde la passe la mieux notée, et une modification faite après l'arrêt ne serait plus mesurée.
- Production des animations — motif : le prompt lance un run chez le produit marketing, où cette session n'a pas de mandat d'écriture.

## 6. Écarts à la lettre

- « une série de plusieurs animations » → 5 épisodes après un cadrage commun → une même barre pour toute la série.
- « animations » → page HTML animée de 60 à 120 s, MP4 seulement si FFmpeg est présent → FFmpeg absent, et seul le HTML a un oracle de mouvement.
- « pour vendre » → un décideur nommé par épisode → un message de vente s'adresse à quelqu'un.
- les 5 pans tels quels → une capacité partielle est montrée pour ce qu'elle est, une capacité absente n'apparaît pas → TDD et couches Bronze, Silver, Gold sont partiels.

## 7. Risques

- Énoncé : une animation affirme une capacité plus large que sa preuve. Signal : une scène liée à une preuve « partielle » emploie un verbe comme « implémente ». Parade : la correction de formulation listée dans l'analyse, à reporter avant le lancement.
- Énoncé : le run s'épuise avant l'épisode 5. Signal : la restitution nomme un dernier épisode jugé inférieur à 5. Parade : la priorité de coupe listée dans l'analyse (cadrage et épisodes 1 à 3 d'abord).

## 8. Prochaines actions

Rangées par dépendance : le report des corrections précède le lancement, et la publication du pilot est indépendante.

| Sélecteur | Action | Identifiant | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Reporter dans le prompt retenu les 5 corrections déjà vérifiées en passe 3 | neuve | auto_ia | garde_fou : une modification faite après l'arrêt de la boucle n'est plus mesurée ; elle se fait sur votre demande | revue du 09/11/2026, chapitre 8, table des majeurs ouverts | si rien n'est fait : le run garde 5 défauts connus, dont la contradiction sur l'enchaînement des épisodes |
| A-2 | Lancer le prompt retenu dans une session ouverte dans le dépôt marketing | neuve | manuelle_utilisateur | decision : vous avez demandé d'améliorer le prompt, pas de lancer le run ; un run chez un produit se lance sur votre demande (R-58, produit), et le relevé d'ouverture déclare refusée toute écriture de cette session chez les produits | `C:\dev\digit-ai-marketing`, prompt du chapitre 8 | si rien n'est fait : aucune animation produite |
| A-3 | Publier le commit de la revue au dépôt distant du pilot | neuve | auto_ia | garde_fou : une autre session du poste écrit au pilot en ce moment (2 synthèses du jour sont arrivées pendant ce tour), et l'envoi demande des mots humains cités dans `FORGE_PUSH_GO` ; il se fait sur un « publie » de votre part | `git fetch` puis `git push`, sortie dans un fichier | si rien n'est fait : la revue reste sur ce poste seulement |

## 9. Traces

- `output/03-etudes/Digit-AI - Revue - Prompt série d'animations de la Factory passé au crible L99 - 20261109b.md`
- `output/03-etudes/Digit-AI - Revue - Prompt série d'animations de la Factory passé au crible L99 - 20261109b.md.boucle.json`
- `output/04-plans/Digit-AI - Synthese Conseil - Prompt serie d animations passe au crible L99 - 20261109f.md`
