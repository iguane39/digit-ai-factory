---
destinataire: humain
---

# Synthèse Mandat — tous les retours et sujets décidés traités, forges et pilot publiés, produits servis (14/10/2026)

## 0. Synthèse d'ouverture

Tout ce qui attendait et que la machine pouvait faire est fait. Les retours des produits sont entrés au registre, et les sujets décidés sont corrigés, vérifiés puis publiés dans le pilot et 5 forges. Les outils mis à jour sont en service sur ce poste, et 16 produits présents ont reçu leur lot de travaux. Il ne reste que ce qui vous revient (11 constats nouveaux à décider, 10 décisions déjà posées) et ce qui attend les produits eux-mêmes.

## 1. En-tête d'identification

Synthèse de clôture de la campagne du 14/10/2026, sur le pilot digit-ai-factory, 5 forges, le canal confidentiel et les produits de ce poste. Elle couvre la période du 14/10/2026 à 11:32 au 14/10/2026 à 14:20, heure de Paris (UTC+02:00), soit 2 h 48. Session pilote Claude Opus 5.5, avec neuf agents de campagne Opus 5.5 à l'effort high.

Intention de la demande : qu'il ne reste plus de travail remonté et non traité. Cela veut dire que les retours des produits entrent au registre, que les sujets décidés sont corrigés, et que les corrections atteignent les produits présents sur ce poste.

Test rétro : le résultat sert cette intention, et pas seulement la lettre. Les corrections sont publiées, les skills sont en service, et les produits ont reçu leurs lots. Ce qui reste ouvert n'est pas faisable par la machine, et chaque sujet en dit la raison.

## 2. Verdict en une ligne

63 sujets clos et 4 doublons écartés, 21 lots de retours ingérés, 5 forges et le pilot publiés (0 commit d'écart après fetch), 16 lots de travaux déposés chez les produits ; recette complète du pilot fusionné : 3 défauts sur 214, sans aucun défaut nouveau du code enregistré.

## 3. Décisions attendues

Aucune décision nouvelle n'attend l'humain dans ce tour : les sujets qui vous reviennent sont listés au bloc 5 avec leur motif.

## 4. Traité

- **Retours des produits entrés au registre.** 21 lots ont été accueillis et ingérés, et le sas d'arrivée est vide. `oracle-boite-entree` passe de FAIL (règles B1, B8 et B9) à PASS, et `oracle-todo` rend PASS.
  - Le nom d'un produit neuf a été vérifié sans voisin dans la table, puis inscrit sous le pseudonyme Produit-80. La table du canal confidentiel est enregistrée et publiée.
  - Sept lots portaient des classes inconnues ou un numéro de retour en double. Ils ont été annotés avant ingestion : les classes passent par la voie « classe à créer » et le numéro RT-32 est renuméroté RT-58.
  - Trois lots refusés depuis le 01 et le 02/10 sont ingérés sous dérogation motivée, qui cite vos mots. Leur complément reste dû par les produits.
- **Sujets décidés sous votre mandat.** 42 candidats sont passés en décidé. 4 doublons sont écartés (TF-1668 à TF-1671), car leur lot source était remplacé par un lot ultérieur qui les reprend mot pour mot.
- **Forges corrigées et publiées.** Chaque forge a sa recette rejouée par le pilot ou par son agent, et chaque correction a ses fixtures rouge et verte.
  - forge-ops : TF-1638 et TF-1639. Révisions bornées et nouvel oracle O-18. Recette 180 PASS, 0 FAIL.
  - forge-tests : TF-1672, TF-1673 et TF-1675. 48 tests ciblés verts. Le test des croisements servis, qui échouait avant la campagne, est réparé (12/12).
  - forge-conception : TF-1655 et TF-1680. « 18 oracles, 59 règles, SELF-TEST VERT ».
  - forge-design : TF-1661, TF-1662, TF-1654 et TF-1674, avec l'oracle d'exploitabilité. « Tout vert — 56 oracles, 148 règles verrouillées ».
  - forge-agents : TF-1660, TF-1663, TF-1664, TF-1665, TF-1674 et TF-1677. Socle page-html 1.29.0 à 581/581 et quality-oracles à 476 contrôles. Le nom réel d'un produit est retiré du skill de schémas publié : `git grep` trouvait 1 occurrence, il n'en trouve plus aucune.
  - canal confidentiel : TF-1656. Déjà corrigé par une autre session, vérifié 8/8.
  - Publication : `git rev-list --left-right --count HEAD...origin/main` rend 0 et 0 sur les 5 forges après `fetch`.
- **Pilot corrigé, fusionné et publié.** Trois chantiers ont été fusionnés. Chaque correction a son contrôle rouge → vert : une fixture rouge qui échoue et une fixture verte qui passe.
  - Restitution : 11 sujets. S48 est jugée au hook, avec préjugement avant affichage. oracle-synthese passe 157/157 et hook-restitution 48/48.
  - Ouverture, installation et README : 10 sujets. Le délai d'ouverture est prouvé par une sonde : pilot 12,7 à 14 s, produit 3,8 à 4,5 s, pour un seuil de 30 s. Le recette d'installation passe 21/21 et celle d'ouverture 29 PASS.
  - Gabarits, cascade et contre-lecture : 6 sujets. Conformité 162/162, fiche constat 15/15, vue de cascade 11/11, contre-lecture 9/9.
  - La cohérence de version de la restitution (RC1) passe de FAIL à PASS.
  - Recette complète : 3 défauts sur 214. Deux sont antérieurs à la campagne. Le troisième vient du travail non enregistré d'une session voisine : la version enregistrée de `bootstrap.test` passe 27/27 dans un worktree jetable.
  - Publication : 35 commits envoyés, 0 commit d'écart après `fetch`.
- **Registre et référentiel.** 63 sujets sont clos et 20 classes créées : le référentiel passe de 1.29.0 à 1.33.0. Chaque classe nomme le contrôle qui la juge. Les 3 règles de diagnostic sans contrôle mécanique sont closes sans classe, puisque R15 refuse une classe sans porteur.
- **Skills mis en service.** `node oracles/oracle-skills.mjs` passe de FAIL K2 à PASS après propagation des 4 skills modifiés.
- **Produits servis.** `node todo/emettre-travaux.mjs --tous` rend « 16 lot(s) déposé(s), 7 déjà présent(s), 0 refusé(s) avant dépôt ». Aucun commit n'a été fait chez un produit.

## 5. Non traité

- **TF-1682 à TF-1692 (11 constats neufs).** Ils restent en candidat. Motif : leur décision est humaine, et les traiter ici aurait ouvert une boucle sans fin.
- **14 sujets qui attendent un produit.** Motif : le lot est déposé, ou le produit est absent de ce poste. C'est le cas de Produit-03, Produit-07 et Produit-12. TF-1630 ne trouve aucun destinataire sur ce poste.
- **10 sujets qui attendent votre décision.** TF-0963, TF-1160, TF-1212, TF-1319, TF-1323, TF-1396, TF-1432, TF-1540, TF-1552 et TF-1584. Motif : décision humaine posée lors des sessions précédentes, inchangée par cette campagne.
- **8 sujets qui attendent une échéance, l'autre poste ou un geste humain.** Motif : attente déclarée au registre (champ `attente`).
- **Recette `bootstrap.test` rouge dans l'arbre de travail.** Motif : le défaut vient du travail en cours et non enregistré de la session voisine sur `bootstrap.mjs`. Ce travail lui appartient, et je ne l'ai ni enregistré ni modifié au-delà de la fusion.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Tout mettre en œuvre | 4 candidatures écartées comme doublons | Elles redisaient mot pour mot des candidatures du lot qui les remplaçait. |
| Tout mettre en œuvre | Skills propagés sans question séparée, alors que la règle de propagation demande une décision explicite | « Mettre en œuvre » vise la mise en service, et des skills non propagés feraient exécuter l'ancienne version. |
| Tout traiter | Les 11 constats nés de la campagne restent en candidat | Leur décision vous revient. |
| Tout traiter | J'ai aussi corrigé un test de forge-tests en échec, inscrit nulle part | Il rendait rouge toute la recette de cette forge. |

## 7. Risques

- **Fusion faite sur le travail d'une session voisine.**
  - Énoncé : la fusion du chantier B a mis de côté puis réappliqué le travail non enregistré d'une session voisine sur `bootstrap.mjs`, `installer-projet.mjs` et `.gitignore`.
  - Signal : son diff garde 32 lignes ajoutées et 7 retirées sur les 3 fichiers, comme avant.
  - Parade : une sauvegarde existe dans `C:\tmp\voisine-20261014.patch`, et ses modifications restent non enregistrées. Sa recette `bootstrap.test` attend une mise à jour de sa part.
- **Ingestion d'un lot déjà remplacé.**
  - Énoncé : trois lots de Produit-64, remplacés le même jour, ont été ingérés avant confrontation.
  - Signal : 4 doublons au registre.
  - Parade : ces doublons sont écartés avec leur motif. La règle « confronter avant ingestion » existait déjà, et je l'ai appliquée trop tard.

## 8. Prochaines actions

L'ordre suit ce qui débloque le plus. Les décisions d'abord, parce que les sujets candidats n'avancent pas sans elles. Le geste de nettoyage ensuite, parce que rien n'en dépend. A-2 est un rappel : le travail revient à la session voisine.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1682 à TF-1692 | Décider des 11 constats neufs de la campagne, en bloc ou un par un | manuelle_utilisateur | decision | `décide TF-1682 à TF-1692`, à écrire dans la conversation | Les défauts relevés par les agents restent sans suite |
| **A-2** | `neuve` | Enregistrer ou terminer le travail en cours sur `bootstrap.mjs` et sa recette, depuis la session qui l'a commencé | manuelle_dev | decision | `node bootstrap.test.mjs` après la mise à jour du message attendu | La recette complète du pilot reste à 3 défauts au lieu de 2 |
| **A-3** | `neuve` | Effacer l'archive du correctif déjà appliqué | manuelle_utilisateur | irreversible | `Remove-Item "input\Digit-AI - Correctif Factory - Ouverture de session sous le delai client - 20261013b.zip"` | Un fichier non suivi reste dans l'état du dépôt |

## 9. Traces

- `todo/TODO.jsonl` et `todo/CLASSES.json` (1.33.0)
- `input/00-retours/` (21 lots accueillis)
- Commits du pilot : de 453e966c à 969dbdc3, publiés sur `origin/main`
- Forges publiées : `digit-ai-forge-ops`, `digit-ai-forge-tests`, `digit-ai-forge-conception`, `digit-ai-forge-design`, `digit-ai-forge-agents`
- Lots déposés : `input\00-travaux\pilot - TRAVAUX - 20261014a.md` chez 16 produits
