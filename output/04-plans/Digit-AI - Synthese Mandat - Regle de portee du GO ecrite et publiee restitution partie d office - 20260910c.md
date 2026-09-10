---
destinataire: humain
---

# Synthèse de mandat — votre règle est écrite, publiée, et appliquée à elle-même : la restitution en attente est partie, et celle-ci part sans feu vert de plus (10/09/2026)

Votre décision de règle est exécutée et déjà en vigueur. Elle dit qu'un feu vert donné sur un travail couvre d'office le compte rendu de ce travail, à deux conditions : la barrière de publication est rejouée juste avant l'envoi et rend un verdict favorable, et l'enregistrement ne contient rien d'autre que le compte rendu. Elle est écrite en toutes lettres dans les règles du projet, et le noyau n'en porte que le renvoi, parce qu'il est à cinq octets de son plafond. Le compte rendu qui attendait depuis le tour précédent est parti avec la règle, et la vérification sur une copie fraîche de ce qui est en ligne ne rend toujours aucune réserve. Ce que ça change pour vous : plus d'aller-retour par tour pour un compte rendu ; le feu vert reste le vôtre pour tout travail nouveau. Ce qui est attendu de vous : rien qui bloque — deux gestes restent à votre main, le sort d'un remisage ancien et l'ouverture éventuelle d'un mandat sur les dépôts voisins, ils sont dans le tableau des actions.

## 1. En-tête d'identification

- **quoi** — exécution de la décision humaine D-4 (a) : rédaction de la règle de portée du feu vert (R-38 §4), publication de la restitution en attente et de la règle, vérification indépendante de ce qui est en ligne.
- **sur quoi** — la factory `digit-ai-factory` (le pilot) : `REGLES-PROJET.md`, le noyau `CLAUDE.md`, la branche `main` et son dépôt distant.
- **quand** — 2026-09-10 10:45 UTC+02:00 (Europe/Paris), durée ≈ 15 min, relevée à l'horloge et non estimée.
- **qui** — pilot `digit-ai-factory`, `main` publié en `d87f568` ; oracles joués : `oracle-claude-md`, `oracle-nom-client-publie` (copie locale avant push, clone frais après), `oracle-todo`, lanceur `oracles\self-tests.mjs`.

## 2. Verdict en une ligne

**D-4 (a) exécutée : R-38 §4 écrit dans `REGLES-PROJET.md` avec ses deux conditions et son pourquoi ; noyau `CLAUDE.md` réduit au renvoi, 6159 → 6139 octets pour un plafond de 6144, `oracle-claude-md` FAIL → PASS ; suite complète 102/103, le seul défaut restant TF-1006, externe et inchangé ; publication `3a3520b..d87f568` par avance rapide, 2 enregistrements — la restitution en attente et la règle —, porte rejouée juste avant : PASS, 51 constats, 0 bloquant ; `origin/main` = `HEAD` = `d87f568`, 0/0 ; clone frais à branche unique de ce qui est publié : 658 commits, 44 références, PASS, 1 constat qui est le verdict lui-même, 0 antériorité, 0 bloquant ; la règle est présente dans les deux fichiers publiés ; cette restitution part d'office sous la règle qu'elle restitue, porte rejouée avant.**

## 3. Décisions attendues de l'humain

Rien n'attend de décision : les deux gestes qui restent à votre main — le sort du remisage ancien et l'ouverture d'un mandat sur les dépôts voisins — sont des actions déjà posées, pas des arbitrages nouveaux ; ils figurent au tableau du bloc 8.

## 4. Traité — avec sa preuve

- **D-4 (a) — la règle est écrite, dans les deux fichiers qui la portent.** R-38 §4 dans `REGLES-PROJET.md` : le push reste un GO humain, mais un GO sur un travail couvre ses enregistrements de restitution, à deux conditions — porte rejouée juste avant et PASS, rien d'autre que la restitution dans l'enregistrement ; tout autre contenu ramène au GO explicite ; le pourquoi est écrit à côté.
  - preuve : `grep -n "Portée du GO pour le DÉPÔT" REGLES-PROJET.md` rend la ligne 564 ; le noyau porte « (R-38 §4) » sur la ligne du garde-fou.
- **Le noyau tient son plafond, et il a fallu le mesurer deux fois.** Première rédaction : 6159 octets pour 6144 ; le plafond se mesure après normalisation des fins de ligne, ce qui explique qu'un fichier de 6235 octets sur disque passait la veille.
  - preuve : `oracle-claude-md` **FAIL** (N1, 6159 > 6144) → **PASS** à 6139 octets, après réduction de la mention au seul renvoi et retrait d'un adverbe redondant de la même puce.
- **La restitution en attente et la règle sont publiées, sous la procédure que la règle prescrit.** Porte rejouée sur l'arbre juste avant le push, avance rapide vérifiée, aucun forçage.
  - preuve : porte PASS, 51 constats, **0 bloquant** ; `git merge-base --is-ancestor origin/main HEAD` vrai ; `git push` sorti en 0, `3a3520b..d87f568` ; après `git fetch`, `origin/main` = `HEAD` = `d87f568`, 0 en avance et 0 en retard.
- **Ce qui est en ligne est vérifié sur une copie fraîche, pas sur la mienne.** Clone à branche unique hors de c:\dev, tables désignées par les deux variables.
  - preuve : `d87f568`, 658 commits, 44 références ; porte exit 0, **PASS, 1 constat — le verdict lui-même —, 0 antériorité, 0 bloquant** ; la règle y est lue dans les deux fichiers ; clone supprimé après mesure.
- **La suite complète est rejouée après le changement de règle.**
  - preuve : lanceur `oracles\self-tests.mjs` : **102/103**, le seul défaut étant `oracle-skills` sur la divergence installée de `registre-oracles.md` (TF-1006), externe à ce dépôt et strictement inchangé ; `oracle-todo` PASS.
- **La session voisine est informée de la règle et de ses deux conditions**, avec la contrainte pratique qui en découle : un arbre mêlant travail et restitution se sépare en deux enregistrements.
  - preuve : message envoyé et accusé par la messagerie inter-sessions.

## 5. Non traité — avec son motif

- Le remisage local et ses 306 enregistrements de l'ancienne histoire — motif : `gate_gouvernance` — supprimer est un geste humain (R-29 : les dépenses et les portes de gouvernance restent humaines) ; il n'est pas dans ce qui est publié.
- Le réalignement des rapports de référence (TF-1005) et le report de la remontée d'oracle (TF-1006) — motif : `garde_fou`, dépôts frères sans mandat d'écriture.
- Les 32 items du registre visant ce dépôt et les 24 visant des dépôts frères — motif : `borne_atteinte`, ce tour a exécuté votre décision de règle et rien d'autre.
- Le passage de la règle aux gabarits hérités par les produits (`gabarits\CLAUDE-PRODUIT.md`) — motif : `borne_atteinte` ; la règle vit chez le pilot et s'applique à ses pushs ; sa transposition aux produits est une question distincte, non posée, et je préfère la laisser ouverte que l'inventer.

## 6. Écarts à la lettre

- **Vous avez demandé** « 4a », adopter la règle. **J'ai fait** la règle, et en plus sa publication immédiate ainsi que celle de la restitution en attente. **Pourquoi** : j'ai considéré que le feu vert sur la règle couvrait la publication de la règle elle-même — sans quoi j'aurais dû demander un feu vert pour publier la règle qui évite de demander des feux verts. C'est une interprétation, elle est écrite ici plutôt que glissée, et elle est réversible d'un mot.
- **Vous avez demandé** une règle, **j'ai écrit** deux conditions que votre décision ne formulait pas : porte rejouée juste avant, et enregistrement ne portant rien d'autre que la restitution. **Pourquoi** : sans la première, la règle ferait passer un enregistrement sur un verdict périmé ; sans la seconde, n'importe quel travail pourrait se glisser sous l'étiquette de restitution. Les deux sont ce que l'option (a) disait en clair (« barrière jouée avant ») ou impliquait.

## 7. Risques

- **L'étiquette « restitution » peut être abusée pour faire passer un travail sans feu vert.**
  - signal : un enregistrement dit de restitution qui modifie autre chose que des synthèses, des vues du registre ou des index.
  - parade : la seconde condition de R-38 §4 est écrite ; elle n'est pas outillée — aucun oracle ne vérifie aujourd'hui la nature des fichiers d'un enregistrement avant push, et je le déclare plutôt que de le promettre.
- **Le noyau est à cinq octets de son plafond.**
  - signal : `oracle-claude-md` rouge à la prochaine ligne ajoutée.
  - parade : tout ajout futur au noyau passe par un renvoi vers `references\`, jamais par du texte ; c'est ce que l'oracle prescrit et ce qui a été fait ici.
- **La copie locale garde une histoire que ce qui est publié n'a pas, par le remisage.**
  - signal : des antériorités dans un verdict local là où le clone frais n'en compte aucune.
  - parade : lire tout verdict local avec cette réserve ; l'action A-4.
- **La divergence installée du skill des oracles reste en place sur ce poste.**
  - signal : `oracle-skills` rouge sur un seul fichier.
  - parade : TF-1006 le nomme ; ne pas jouer la propagation des skills sur ce poste avant son traitement.

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Réaligner les deux rapports de référence sur le format courant (TF-1005) | auto_ia | `garde_fou` — dépôt frère, aucun mandat ; à défaut, chaque rapport d'audit remis rouvre le même aller-retour | complexe × long |
| A-2 | Reporter la remontée d'oracle dans la source versionnée en pseudonymisant (TF-1006) | auto_ia | `garde_fou` — dépôt frère, et le report brut publierait un nom ; sinon : la section sera effacée à la prochaine mise à niveau | moyen × moyen |
| A-3 | Reprendre les 32 items du registre visant ce dépôt (TF-0674) | auto_ia | `borne_atteinte` — hors de la décision de ce tour ; à défaut, l'écart entre le registre et l'état réel croît | complexe × très long |
| A-4 | Inspecter le remisage du 01/09, puis garder ou retirer — `git stash list` en donne les deux entrées (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) et il précède les deux sessions ; sinon : la copie locale garde 306 enregistrements de l'ancienne histoire, dont 202 portent un nom réel | simple × court |
| A-5 | Ouvrir, si vous le souhaitez, un mandat d'écriture sur les dépôts frères — nommer les forges (débloque TF-1005 et TF-1006) | manuelle_utilisateur | `decision` — engager un dépôt dont ce poste n'est pas responsable ; sinon : A-1 et A-2 restent bloquées | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 et A-2 attendent le mandat de A-5, A-3 seule ne dépend de rien et peut repartir au prochain tour ; A-4 est indépendante et la moins coûteuse des vôtres.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Regle de portee du GO ecrite et publiee restitution partie d office - 20260910c.md` — ce document.
- `REGLES-PROJET.md` — R-38 §4 ; `CLAUDE.md` — renvoi « (R-38 §4) » sur la ligne du garde-fou, 6139 octets.
- Publication : `git push origin main`, `3a3520b..d87f568`, dépôt `github.com/iguane39/digit-ai-factory`.
- Clone de vérification : dossier temporaire à branche unique, `d87f568`, 658 commits, 44 références, supprimé après mesure.
- `output\04-plans\Digit-AI - Synthese Mandat - Publication faite et verifiee sur clone frais zero anteriorite - 20260910b.md` — la synthèse précédente, dont D-4 est la décision exécutée ici.
- Aucun livrable HTML produit dans ce tour : la critique d'implémentation de forge-design est sans objet.
