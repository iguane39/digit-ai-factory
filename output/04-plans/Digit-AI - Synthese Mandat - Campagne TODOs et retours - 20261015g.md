---
destinataire: humain
---

# Synthèse Mandat — reprise entre postes câblée, 3 sujets clos, publication du pilot à décider (15/10/2026)

## 0. Synthèse d'ouverture

Aucun retour nouveau n'était arrivé, et les 3 sujets que la session pouvait traiter sont clos. Un produit dont vous avez déclaré le dossier de reprise se reprendra désormais sur vos deux postes sans geste de votre part, comme vous l'aviez décidé. L'autre poste a corrigé en même temps un de ces sujets : sa version publiée est gardée. Une seule question vous revient, la publication du pilot.

## 1. En-tête d'identification

Synthèse de clôture de la campagne « traite les TODOs et retours » du 15/10/2026 au soir. Elle porte sur le pilot digit-ai-factory et la forge d'audit. Période : 15/10/2026 de 20:46 à 21:50, heure de Paris (UTC+02:00), soit 1 h 04. Session pilote Claude Opus 5.5 ; 2 agents Opus 5.5.

Intention de la demande : qu'aucun travail remonté ne reste sans traitement, et que la correction atteigne les produits.

Test rétro : le résultat sert cette intention. La reprise entre postes est câblée là où un produit la rencontre, à son ouverture et à chaque fin de tour, et l'héritage l'exige. Il reste à publier le pilot pour que les produits la reçoivent.

## 2. Verdict en une ligne

3 sujets clos sur 3, 0 lot à accueillir, pilot en avance de 6 commits ; recettes touchées vertes (40, 21, 44, 92, 177 et 185 cas).

## 3. Décisions attendues

Inventaire des bloquants :

- **Publication du pilot.** Ce qui est bloqué : l’envoi des 6 enregistrements de ce soir. Ce qu’il faut fournir : votre accord sur D-6. Si rien n’est fourni : ils restent sur ce poste, et les produits rouverts ne reçoivent pas la reprise entre postes.

> **D-6 — Le pilot peut-il publier ses 6 enregistrements de ce soir ?**
>
> Ces enregistrements portent la reprise automatique entre vos postes, la lecture au pilot du référentiel des classes, et l'héritage en 1.27.0. Le pilot refuse de les publier sans votre accord explicite. Tant qu'ils ne sont pas publiés, les produits rouverts ne reçoivent ni la reprise ni le hook qui l'envoie.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md` R-38, paragraphes 4 et 5, qui réservent la publication du pilot au porteur. Les recettes des outils touchés sont vertes, et `git rev-list --left-right --count HEAD...origin/main` rend 6 et 0.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Publier maintenant ; je lance `FORGE_PUSH_GO="D-6 (a) du 15/10" git push origin main` à votre réponse | Faible × court | Aucune contrainte connue : la porte de publication des noms juge l'envoi |
| (b) Attendre que l'autre poste ait publié son propre travail du soir | Nul tant que l'attente dure | Les produits rouverts d'ici là n'ont pas la reprise |

> **Si rien n'est décidé** : (b), les 6 enregistrements restent sur ce poste.

## 4. Traité

- **Sas d'arrivée vide.** Aucun lot n'attendait d'accueil.
- **Reprise d'un produit sur tous vos postes (TF-1736, décision « 3b »).** Les 5 gestes décidés sont câblés, avec la règle R-64 (reprise sur tous les postes), le manifeste du produit et la restauration à l'ouverture. Un envoi part en fin de tour sous feu vert consigné, et une règle de restitution avertit si un transport est laissé à la main. Chaque geste a son contrôle rouge puis vert :
  - hook d'ouverture : 34 sur 40 avant, 40 sur 40 après ;
  - lanceur des hooks : 18 sur 21 avant, 21 sur 21 après ;
  - juge de restitution : 4 cas rouges avant, 177 sur 177 après ;
  - héritage : 43 sur 44 avant le motif exigé, 44 sur 44 après.
- **Durées mesurées sur 358 fichiers (61 Mo).** La restauration prend 610 ms sur un poste vide et 58 ms sur un poste à jour ; l'envoi 781 ms puis 61 ms.
- **Classes et gabarit des lots lus au pilot (TF-1821).** Les copies chez les produits dérivaient chez 21 produits sur 21. Elles ne sont plus qu'un repli hors ligne, et le relevé du parc passe de 332 manques à 291. Le contrôle de lot rend 90 sur 92 avant, 92 sur 92 après.
- **Version des gabarits du kit d'audit (TF-1820).** L'autre poste a corrigé le même sujet en parallèle et l'a publié. Sa version est gardée, et sa recette rend 13 étapes sur 13 ici. Celle de ce poste reste sur une branche locale de sauvegarde, non publiée. Le registre des empreintes déclare le contrôle publié, et `oracle-empreintes` rend PASS.
- **Registre.** Une classe neuve porte le référentiel en 1.40.0, et `oracle-todo` rend PASS après chaque écriture.

## 5. Non traité

- **Publication du pilot.** Motif : dependance_bloc_3, elle attend la décision D-6.
- **Un cas de recette qui dépend du temps (TF-1838).** Motif : inscrit en candidat, il est sans lien avec les sujets du soir et passe 40 sur 40 au second passage.
- **Gestes de reprise d'un produit dont le dossier n'est pas retrouvé (TF-1825).** Motif : même défaut de localisation que TF-1630, inchangé.
- **Décisions des sessions précédentes.** Motif : décision humaine, inchangée. Les sujets sont TF-0963, TF-1160, TF-1212, TF-1307, TF-1319, TF-1323, TF-1396, TF-1432, TF-1540, TF-1552 et TF-1584.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Traiter les TODOs | Pour un sujet corrigé 2 fois, j'ai gardé la version de l'autre poste et retiré la mienne de la forge | Elle était déjà publiée, et deux contrôles du même défaut se contrediraient |

## 7. Risques

- **Les deux postes travaillent le même registre ce soir.**
  - Énoncé : l'autre poste a pris un des sujets de ce soir ; son travail sur le pilot n'est pas encore publié.
  - Signal : un `git fetch` qui montre le distant en avance au moment de publier.
  - Parade : la fusion se fait par ajout au registre, et un numéro frappé des deux côtés se renumérote côté non publié avant l'union, comme à 20:05.

## 8. Prochaines actions

La publication vient d'abord, parce que les produits en dépendent. Le nettoyage vient ensuite, parce que rien n'en dépend.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1736 | Publier le pilot selon D-6 | auto_ia | dependance_bloc_3 : attend D-6 | `FORGE_PUSH_GO="D-6 (a) du 15/10" git push origin main` | Les produits ne reçoivent pas la reprise entre postes |
| **A-2** | `neuve` | Trancher D-6 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-6 (a)` | L'option par défaut s'applique |
| **A-3** | `neuve` | Effacer l'archive du correctif du 13/10, déjà appliqué | manuelle_utilisateur | irreversible | `Remove-Item "input\Digit-AI - Correctif Factory - Ouverture de session sous le delai client - 20261013b.zip"` | Le relevé d'ouverture compte ce fichier non suivi en défaut |

## 9. Traces

- `todo/TODO.jsonl` et `todo/CLASSES.json` (1.40.0)
- `REGLES-PROJET.md` (R-64), `gabarits/CLAUDE-PRODUIT.md`, `gabarits/HERITAGE.json` (1.27.0), `gabarits/RESTITUTION.md` (2.40.0), `oracles/lib-reprise.mjs`, `oracles/hook-reprise.mjs`
- Pilot : de 268b7c26 à la tête locale, enregistrés, en attente de publication
- Forge-audit : f82aa77 (publié par l'autre poste) ; branche locale `sauvegarde-tf1820-poste-dell`
