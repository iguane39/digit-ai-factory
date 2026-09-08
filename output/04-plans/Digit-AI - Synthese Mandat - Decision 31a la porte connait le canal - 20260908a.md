---
destinataire: humain
---

# Synthèse de mandat — décision 31 (a) exécutée : la porte de publication trouve seule les tables du canal, le hameçon répète son motif, la forge des outils publiée (08/09/2026)

Votre décision est exécutée. La forge des outils a été instruite par un agent mandaté : la porte de publication cherche désormais les deux tables de pseudonymisation dans le canal confidentiel par ses propres pistes, après les arguments et les variables d'environnement et avant les anciens fichiers libres, et nomme la table qu'elle a lue ; le hameçon de publication — le crochet joué avant chaque push — ne grave plus aucun chemin, laisse la porte résoudre et répète en clair le motif d'un refus. Le défaut a été reproduit avant correction, sur la porte et sur le hameçon, puis la forge a publié en avance rapide par-dessus un commit que l'autre poste y avait déposé entre-temps. La copie installée sur ce poste est réalignée, et la preuve est faite depuis le pilot : appelée sans argument ni variable, la porte rend un verdict et cite les deux tables du canal. Ce qui change pour vous : les deux variables posées hier sur ce poste ne sont plus qu'une béquille facultative, et l'autre poste n'aura rien à poser. Ce qui est attendu de vous : les deux décisions d'hier soir toujours ouvertes (la forge de développement, le tri), et une petite décision sur la béquille.

## 1. En-tête d'identification

- **quoi** — mandat humain « 31a » sur la synthèse 20260907m : D-31 (a), action A-68 — lot chez forge-agents (pistes par défaut au canal, hameçon), instruction, publication.
- **sur quoi** — forge-agents (un lot déposé, instruit, publié) ; le pilot (registre, original du lot, copies installées) ; rien d'écrit ailleurs.
- **quand** — fin le **08/09/2026 à 08:20 (UTC+02:00)**, ≈ 1 h 45 depuis votre réponse, dont 65 minutes de travail de l'agent.
- **qui** — Claude Fable 5.1 (extension VS Code) et un agent subordonné ; pilot `aac41d6` avant, `d5a44b8` publié en cours de tour, cette synthèse part dans le commit suivant.

## 2. Verdict en une ligne

A-68 **fait** : lot `pilot - TRAVAUX - 20260908a` déposé (T1-T6 PASS) et instruit ; forge-agents `bfdb251` publié en avance rapide (`edfdb2e → bfdb251`) ; recette de `quality-oracles` 224 → 226, banc du hameçon 7 → 10 ; porte appelée sans argument ni variable : SKIP → PASS C1 (la première des quatre règles sur les noms de clients) à C5 (la règle sur les noms de produits), tables du canal nommées ; TF-0887 clos ; copie installée réalignée ; deux candidatures neuves (TF-0888, TF-0889).

## 3. Décisions attendues

Une décision nouvelle, petite ; les deux d'hier soir (D-29, la forge de développement ; D-30, le tri) restent ouvertes et ne sont pas répétées. Le tableau se lit ligne par ligne : la colonne « Option » nomme le choix, « Ce qu'elle coûte » sa complexité et sa durée, « Ce qu'elle exclut » ce à quoi l'on renonce ; les lignes vont de l'option recommandée à l'inaction.

> **D-32 — Garde-t-on sur ce poste les deux variables d'environnement posées hier vers le canal, devenues inutiles depuis que la porte trouve seule ses tables, ou les retire-t-on pour que la mesure ne dépende plus du poste ?**
> Hier soir, en attendant la correction de la forge, ce poste a reçu deux variables d'environnement qui disent à la porte où vivent les tables ; c'était une béquille, documentée comme telle au LISEZMOI du canal. Depuis ce matin, la porte lit le canal par ses propres pistes, et la preuve a été faite en retirant les variables du processus : même verdict, mêmes tables nommées. Les garder ne casse rien — elles priment et pointent au même endroit — mais elles masquent : une régression des pistes par défaut ne se verrait plus sur ce poste, elle se verrait chez l'autre ou sur un nouveau clone. Les retirer coûte deux commandes et rend ce poste aussi nu que les autres.
> **Recommandation : (a).** Source consultée : `setx` du 07/09 (les deux variables au niveau utilisateur) ; la mesure de ce matin depuis le pilot, variables retirées du processus (PASS, tables nommées) ; le LISEZMOI du canal (section « deux variables d'environnement ») ; le lot de retours de la forge du jour (RC-2 : le constat sur la copie installée).
> Un poste qui mesure comme les autres est un poste qui voit les régressions avant les autres.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** retirer les deux variables du poste et retirer la consigne du LISEZMOI du canal (elle date d'avant la correction) | simple × court : deux commandes, une ligne | exclut la béquille en cas de régression des pistes |
| **(b)** les garder, en les documentant comme facultatives | gratuit | exclut de voir sur ce poste une régression des pistes par défaut |
| **(c)** ne rien faire | gratuit | exclut de mettre le LISEZMOI à jour ; l'autre poste posera des variables inutiles |

> **Si rien n'est décidé** : (c) s'applique — les variables restent, le LISEZMOI les prescrit encore.

## 4. Traité — avec sa preuve

- **A-68 — TF-0887 clos chez forge-agents** (D-31 (a)) — classe : une porte appelée sans chemin de tables ; contrôle rouge → vert : contre la porte d'origine, les deux cas neufs de la recette sont rouges (SKIP malgré le canal sous la racine du dépôt jugé ; motif de SKIP absent), le cas 5 du banc du hameçon est rouge (dépôt porteur ET dépôt propre refusés — la panne du 07/09 à l'identique), le cas 4 rouge (refus sans motif lisible) ; après, tous verts ; la porte sur la forge, appelée sans argument ni variable, passe de SKIP à PASS C1 à C5 avec les deux tables du canal nommées. Les résolveurs poussent le canal après les arguments et les variables, avant les anciens fichiers libres (aucune piste retirée) ; le hameçon ne grave aucun chemin (écart déclaré et motivé : un chemin gravé à la pose périme en silence) et préfixe le motif « porte SKIP : » ; C1 à C5 et le contrat de sortie inchangés, aucune table copiée.
  - preuve : commit `bfdb251` (9 fichiers, +322/−38), push `edfdb2e → bfdb251` en avance rapide (l'agent a rebasé son commit local sur cinq commits que l'autre poste venait de publier) ; recette 224 → 226, hameçon 7 → 10, hook 37/37, registre des oracles 2.18.0 → 2.19.0 ; lot `…forge-agents - RETOURS - 20260908a.md` PASS, ingéré (TF-0889, récidive marquée) ; clôture journalisée (PASS).
- **Le lot déposé** — `pilot - TRAVAUX - 20260908a.md` + sidecar, T1 (le moyen de vérification) à T6 (le module producteur lu) PASS après une reformulation : T6 avait pris le nom « porte » pour le verbe « porter » et refusé une phrase qui nommait une option de commande — constat entré au registre.
  - preuve : `oracle-travaux-pilot` FAIL T6 puis PASS ; TF-0888 journalisé (candidat) ; TF-0887 décidé (rang 1) ; original dans `output\06-travaux-confies\`.
- **La copie installée** — classe : une copie en retard sur sa source (le constat RC-2 de la forge : le hameçon cherche l'oracle d'abord dans la copie installée) ; contrôle rouge → vert : la porte installée d'hier soir ne connaissait pas le canal, réalignée elle rend PASS sans argument ni variable depuis le pilot, en nommant `noms-interdits.json` (5 termes) et `produits-pseudonymes.json` du canal.
  - preuve : `oracle-skills --appliquer` puis PASS ; comparaison binaire porte installée = source `bfdb251` ; mesure `env -u FORGE_NOMS_INTERDITS -u FORGE_PRODUITS_PSEUDO` → PASS.
- **Synchronisation en ouverture** — pilot en avance rapide d'un commit de l'autre poste ; forge-agents et forge-development alignées ; canal à jour.
  - preuve : `HEAD = origin/main` sur les trois dépôts et sur le canal avant le dépôt du lot.

## 5. Non traité — avec son motif

- **D-29 (forge de développement) et D-30 (le tri)** : *dépendance à une décision humaine* — ouvertes depuis hier soir, non répétées.
- **Le retrait des variables du poste** : *dépendance à une décision humaine* — D-32.
- **TF-0888 et TF-0889** : *tout entre en candidat* — la règle T6 qui confond le nom et le verbe ; quatre fixtures de la forge qui dépendaient de la machine (corrigées par la forge dans le même commit, remontées pour la classe).
- **Les quatre dépôts d'insatisfaction du produit 61** : *hors demande* — toujours non suivis.
- **A-6, A-25, A-19, A-17** : *inchangés*.

## 6. Écarts à la lettre

- Le lot disait « `main` à `0e0c223` » → l'origine portait cinq commits de plus de l'autre poste à l'heure du push → l'agent a rebasé son commit jamais publié, rejoué recettes et portes, puis publié en avance rapide → parce que l'histoire publiée ne se touche pas et que le rebase d'un commit local n'en est pas une réécriture.
- Le lot ouvrait deux voies pour le hameçon (graver les chemins ou laisser résoudre) → la forge a choisi de ne rien graver → parce qu'un chemin gravé à l'installation périme en silence, motif écrit dans le hameçon lui-même.
- Le lot demandait « mêmes pistes pour tout autre lecteur des tables » → aucun autre lecteur dans la forge → déclaré, rien à faire.
- La règle T6 du pilot a refusé le lot sur un faux positif → phrase reformulée, constat au registre → parce qu'un lot déposé ne se modifie pas après coup, et qu'un juge de forme se corrige par une candidature, pas en le contournant.

## 7. Risques

- **Un autre poste où la copie installée est plus vieille que la source** verra encore SKIP tant qu'il n'a pas réaligné ses copies (le hameçon lit la copie installée d'abord).
  - signal : « porte SKIP : … » en tête d'un push refusé malgré le canal cloné.
  - parade : `node bootstrap.mjs --pull` (réaligne les copies installées) à l'ouverture, ce que A-6 prescrit déjà.
- **Deux variables de poste masquent une régression des pistes** tant que D-32 n'est pas tranchée.
  - signal : une porte verte ici, muette ailleurs.
  - parade : D-32 (a).
- **L'autre poste publie sur les mêmes forges en parallèle** (cinq commits sur forge-agents pendant ce tour) : chaque agent doit fetch et rebaser avant de publier.
  - signal : « non-fast-forward » au push.
  - parade : la consigne des lots (fetch, ancêtre, rebase du seul commit local) ; l'agent l'a appliquée.

## 8. Prochaines actions

Ordre de traitement : d'abord les décisions ouvertes d'hier (elles portent le parc et la sécurité), puis la béquille. Le tableau se lit ligne par ligne : la colonne « Identifiant » renvoie à l'item du registre, « Action » dit le geste, « Acteur » qui le fait, « Motif / raison » pourquoi il n'est pas déjà fait, et la dernière colonne ce qui se passe s'il ne l'est pas.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-66 | TF-0869, TF-0871 | Si D-30 (a) : instruire d'abord les deux constats de sécurité du produit 61 — un lot au pilot, un à forge-conception. | `auto_ia` | `dependance_bloc_3` — D-30, non tranchée. | Une clé versionnée et des identifiants publics restent des candidatures. |
| A-67 | TF-0830 à TF-0889 | Si D-30 (a) : déposer les lots par forge et instruire les items du pilot dans l'ordre du groupe (2), TF-0888 et TF-0889 compris. | `auto_ia` | `dependance_bloc_3` — D-30. | Quarante-deux candidatures sans rang. |
| A-69 | TF-0829 | Si D-29 (a) ou (b) : après votre levée de protection, une passe sur forge-development avec les tables du canal, publication forcée, clone rebâti, protection remise. | `auto_ia` | `dependance_bloc_3` — D-29 ; R-38 pour le push forcé. | Le parc reste à 13 sur 14. |
| A-70 | TF-0887 | Si D-32 (a) : retirer les deux variables du poste (`setx` à vide), retirer la consigne du LISEZMOI du canal, rejouer la porte sans argument (attendu PASS). | `auto_ia` | `dependance_bloc_3` — D-32. | Une régression des pistes par défaut resterait invisible sur ce poste. |
| A-6 | TF-0878 | Sur l'autre poste, à l'ouverture : `git pull --ff-only` dans le pilot, `node bootstrap.mjs --pull` (clone le canal, réaligne les copies installées), fusion des tables libres, commit et push du canal ; `--rebatir` pour tout dépôt divergé. Les deux variables ne sont plus nécessaires. | `manuelle_utilisateur` | `acces` — ce poste n'atteint pas l'autre ; trace mesurée : cinq commits publiés depuis là-bas pendant ce tour, sur des clones qui ne connaissent pas encore le canal. | Les tables divergent au premier produit nouveau. |
| A-25 | TF-0794 | Quand le journal du produit 02 est inchangé depuis plus d'une heure : ajouter la rectification de la seq 118 en un seul append, rejouer R-42 (l'intégrité du journal de run). | `auto_ia` | `garde_fou` — session du produit vivante le 06/09. | Le produit garde un R-42 rouge. |
| A-19 | TF-0795 | Depuis le produit 02 : relire et commettre les deux contrôles statistiques et leurs recettes déposés par le pilot. | `manuelle_utilisateur` | `irreversible` — entrer dans l'historique d'un produit est un geste dont il est seul auteur. | Un nettoyage efface les chemins d'échec prouvés. |
| A-17 | `neuve` | Si D-7 (b) : renommer le dépôt de file de tickets et retirer l'exception nommée. | `auto_ia` | `dependance_bloc_3` — D-7, non tranchée. | Rien : l'exception tient. |

## 9. Traces

- Forge-agents : `bfdb251` publié (`edfdb2e → bfdb251`, avance rapide) ; lot 20260908a marqué traité ; lot de retours `input\00-retours\digit-ai-forge-agents - RETOURS - 20260908a.md` PASS, ingéré.
- Pilot : `output\06-travaux-confies\pilot - TRAVAUX - 20260908a.md` (+ sidecar) ; `todo\TODO.jsonl` — TF-0887 décidé et clos, TF-0888 et TF-0889 candidats ; commit `d5a44b8` publié en cours de tour, cette synthèse dans le commit suivant.
- Poste : `oracle-skills --appliquer` PASS, porte installée = `bfdb251` ; porte jouée sans argument ni variable depuis le pilot : PASS, tables du canal nommées.
- Oracles rejoués : `gabarits\oracle-travaux-pilot.mjs` (FAIL T6 puis PASS) · `gabarits\oracle-lot-retours.mjs` (PASS) · `oracle-todo` PASS · `oracle-skills` PASS · `oracle-nom-client-publie` sur le pilot sans argument (PASS).
- Mémoire du poste : note complétée (la porte trouve seule le canal ; fetch et ancêtre avant tout geste, l'autre poste publie en parallèle).
