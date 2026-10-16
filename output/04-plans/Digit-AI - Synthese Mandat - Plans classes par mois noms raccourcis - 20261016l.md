---
destinataire: humain
---

# Synthèse Mandat — plans classés par mois, noms trop longs raccourcis (16/10/2026)

## 0. Synthèse d'ouverture

Votre choix est appliqué : les synthèses d'août et de septembre sont rangées dans un dossier par mois, et celles d'octobre restent à la racine, là où les nouvelles s'écrivent. Pour que ce rangement ne casse pas le clonage du dépôt sous Windows, 101 documents ont reçu un nom plus court, et les dépassements de longueur passent de 63 à 1. Le rangement faisait aussi réapparaître 21 numéros de version partagés par deux documents depuis août : ils sont corrigés, il n'en reste aucun. Les anciens noms restent retrouvables dans un journal de correspondance. Une question vous revient : publier ces enregistrements, qui ne sont pas encore sur GitHub.

## 1. En-tête d'identification

Exécution de la réponse « 1b » à D-1 sur le pilot `digit-ai-factory` : `output\04-plans\` classé par mois clos, et noms raccourcis sous le plafond de chemin de R-4. Période : 16/10/2026 de 15:31 à 16:24, heure de Paris (UTC+02:00), heure de début relevée sur le premier fichier écrit du tour. Session pilote Claude Opus 5.5, aucun agent ; la session `digit-ai-factory-1e` a publié puis réaligné le pilot pendant le tour.

Intention de la demande : retrouver une synthèse en ouvrant le dossier de son mois, sans réintroduire les échecs de clonage et de contrôle que les règles de nommage évitent.

Test rétro : le résultat sert cette intention. Le dossier est classé, et l'oracle de conformité compte 68 constats non verts au lieu de 155 avant le classement, sans aucun constat nouveau.

## 2. Verdict en une ligne

559 chemins renommés ou déplacés en 2 commits ; plafond R-4 : 63 dépassements → 1 ; indices partagés : 21 → 0 ; recette complète 0 oracle en défaut sur 220.

## 3. Décisions attendues

> **D-2 — Faut-il publier maintenant sur GitHub les 6 enregistrements locaux du pilot, dont ce classement ?**
>
> Le pilot porte 6 enregistrements non publiés : le classement par mois et le raccourcissement des noms, la réindexation des 21 doublons, cette synthèse, et 3 enregistrements de la session `digit-ai-factory-1e` (revues datées, synthèse Terraform, synthèse de publication). Publier est votre geste (R-38). Tant qu'ils restent locaux, l'autre poste ne voit pas le nouveau rangement.
>
> **Recommandation : (a).** Source consultée : `CLAUDE.md` du pilot, garde-fou « push : R-38 §4-6 » ; `git rev-list --left-right --count main...origin/main` rend 6 en avance après l’enregistrement de cette synthèse, et 0 en retard, donc la publication se fait sans fusion.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Publier maintenant, porte de publication jouée | Faible × court | Aucune contrainte connue |
| (b) Attendre la fin de la journée de travail | Nul | L'autre poste travaille sur l'ancien rangement et peut recréer des conflits de chemins |

> **Si rien n'est décidé** : (b), rien n'est publié.

## 4. Traité

- **Classement par mois.** 59 fichiers dans `output\04-plans\2026-08\` et 199 dans `2026-09\`, avec leurs sceaux et leurs caches `.oracles\`. Octobre reste à la racine, là où écrivent les producteurs et où l'allocation d'indice lit.
- **101 livrables raccourcis.** L'<Objet> du nom perd d'abord ses mots vides, puis ses derniers mots, sans finir sur un nombre. C'est le remède que R-4 prescrit lui-même (`oracle-conformite-projet.mjs`, « Raccourcir l'<Objet> du nom »). Exemple : « Branche du pilot reportee sur une branche locale prete a publier » devient « Branche pilot reportee branche ».
- **21 indices partagés corrigés.** Le déplacement faisait passer pour neufs des doublons anciens (du 15/08 au 22/09), que le relevé d'ouverture aurait affichés en défaut. Dans chaque doublon, le livrable entré le plus tard au dépôt prend la lettre libre suivante, comme l'a fait le distant le 15/10. `indices-uniques` rend 0 doublon.
- **Sceaux intacts.** Un sceau se lit à côté de son livrable et porte l'empreinte du contenu : renommés ensemble, ils restent valides. `verifier-jugement` rend PASS avant comme après.
- **Mesure de l'effet.** `oracle-conformite-projet` : 155 constats non verts avant le classement, 68 après. Les dépassements de plafond passent de 63 à 1, les autres constats de R-4 de 45 à 20, et aucun constat n'est nouveau.
- **Anciens noms retrouvables.** `references\RENOMMAGES-LIVRABLES.jsonl` consigne 262 correspondances. Les synthèses scellées et le registre, qui ne se réécrivent pas, citent l'ancien nom.
- **Citations réécrites.** 20 citations hors livrables scellés : référentiel des classes, registre de dette, modèles en service, boucle d'amélioration, outillage de tests. La recherche des chemins morts dans le code, les JSON et les documents ne trouve rien, et aucun ancien nom n'est cité dans la mémoire de session.
- **Le classement se rejoue.** `node scripts\ranger-dossiers.mjs` classe aussi `04-plans` et raccourcit, au moment du rangement, tout nom qui dépasserait le plafond. Il refuse d'agir si un chemin dépasse encore. Rejoué sur l'état final, il trouve 0 fichier à déplacer.
- **Recettes.** `readme-dossiers` 35 sur 35, familles numérotées 11 sur 11, `indices-uniques` 5 sur 5, `generer-lisezmoi-output` 4 sur 4, banc de mutation 14 sur 14, banc des défauts échappés 3 sur 3, `oracle-lot-retours` 92 sur 92. Recette complète de 15:35 à 16:06 : 0 oracle en défaut sur 220. Elle sort en code 1 sur la garde I7, qui nomme 3 recettes : `oracle-conformite-projet` pour mes renommages enregistrés pendant le passage, et 2 autres pour des fichiers que d'autres sessions écrivaient.
- **Enregistrement.** Commits 5dde934f (classement et noms raccourcis, rejoué par la session `digit-ai-factory-1e` après son réalignement) et 969ae182 (indices), locaux. Cette synthèse a pris l'indice « l » : « j » et « k » étaient pris par les synthèses de l'autre session.

## 5. Non traité

- **Une ancienne version archivée dépasse encore de 2 caractères.** C'est le sceau d'une maquette de Produit-02 du 15/08, dans `output\01-revues-et-propositions\old\`. Motif : la renommer la séparerait de sa version courante, qui porte le même radical.

## 6. Écarts à la lettre

| Vous avez écrit | J'ai fait | Pourquoi |
|---|---|---|
| Raccourcir les libellés qui risquent de poser problème | Raccourci 101 livrables, et réindexé en plus 34 livrables aux indices partagés | Le rangement les aurait fait échouer au relevé d'ouverture : même but, réduire les échecs |

## 7. Risques

- **Un nom raccourci perd du sens.**
  - Énoncé : quelques libellés deviennent brefs, par exemple « Ce poste rattrape fusion » ; justesse non mesurée hors de la règle de longueur.
  - Signal : une synthèse qu'on ne reconnaît plus à son nom.
  - Parade : l'index `README.md` de chaque mois donne le titre complet, lu dans le document, et le journal donne l'ancien nom.
- **L'autre poste renomme sur l'ancien rangement.**
  - Énoncé : tant que D-2 n'est pas tranchée, l'autre poste ne voit pas ces 559 chemins.
  - Signal : un conflit de renommage au prochain tirage de l'autre poste.
  - Parade : publier (D-2) ; sinon `node scripts\ranger-dossiers.mjs` se rejoue après la fusion.

## 8. Prochaines actions

La publication vient d'abord, parce qu'elle évite que l'autre poste travaille sur l'ancien rangement. Le rangement suivant vient ensuite, parce qu'il n'a lieu qu'en novembre, une fois octobre clos.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Publier les 6 enregistrements locaux, porte de publication jouée | auto_ia | dependance_bloc_3 : attend D-2 | `git push origin main` | L'autre poste travaille sur l'ancien rangement |
| **A-2** | `neuve` | Ranger à chaque fin de mois, octobre compris en novembre | auto_ia | dependance_externe : le mois d'octobre n'est pas clos | `node scripts\ranger-dossiers.mjs` | La racine de `04-plans\` se remplit à nouveau |
| **A-3** | `neuve` | Trancher D-2 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-2 (a)` | L'option par défaut s'applique |

## 9. Traces

- `scripts\ranger-dossiers.mjs`, commit 5dde934f (local)
- Réindexation des indices, commit 969ae182 (local)
- `references\RENOMMAGES-LIVRABLES.jsonl`, 262 lignes
- `oracles\oracle-conformite-projet.mjs:408`, plafond de chemin
