---
destinataire: humain
---

# Synthèse de mandat — votre feu vert est exécuté, le noyau corrigé est en ligne, et l'affaiblissement aura duré un peu plus d'une heure (10/09/2026)

Votre feu vert a été exécuté dans la minute : la correction du noyau est publiée, et la vérification faite sur une copie fraîche de ce qui est en ligne confirme que la phrase dit de nouveau qu'un livrable n'est accepté que sur le verdict d'un contrôle exécuté, et sur rien d'autre. L'affaiblissement aura été visible en ligne un peu plus d'une heure, entre la publication de la règle de portée et celle de sa correction ; toute session ouverte dans cet intervalle a lu un noyau qui n'interdisait plus l'acceptation sur confiance — je ne sais pas s'il y en a eu, et je le dis plutôt que de supposer qu'il n'y en a pas eu. Un enregistrement de la session voisine est parti avec le mien, parce qu'il le précédait dans l'histoire ; je l'ai inspecté avant de le laisser partir sous votre feu vert, et il ne touche pas au noyau. Ce que ça change pour vous : la doctrine en ligne est de nouveau exclusive, et ce fil de deux jours est clos. Ce qui est attendu de vous : rien qui bloque — deux gestes restent à votre main, le sort d'un remisage ancien et l'ouverture éventuelle d'un mandat sur les dépôts voisins.

## 1. En-tête d'identification

- **quoi** — exécution de la décision humaine D-5 (a) : publication de la correction du noyau, vérification indépendante de ce qui est en ligne, clôture du fil.
- **sur quoi** — la factory `digit-ai-factory` (le pilot) : le noyau `CLAUDE.md`, la branche `main` et son dépôt distant.
- **quand** — 2026-09-10 11:15 UTC+02:00 (Europe/Paris), durée ≈ 10 min, relevée à l'horloge et non estimée.
- **qui** — pilot `digit-ai-factory`, `main` publié en `189e7f7` ; oracles joués : `oracle-nom-client-publie` (copie locale avant push, clone frais après), `oracle-claude-md` sur le clone frais ; `git push`, `git fetch`, `git clone --single-branch`.

## 2. Verdict en une ligne

**D-5 (a) exécutée : publication `f0fec8f..189e7f7`, 3 enregistrements par avance rapide — la correction du noyau `68e03cb`, un enregistrement de la session voisine `85b29bd` inspecté avant push et ne touchant pas au noyau, la restitution `189e7f7` —, porte rejouée sur la copie locale juste avant : PASS, 51 constats, 0 bloquant ; `origin/main` = `HEAD` = `189e7f7`, 0/0 ; clone frais à branche unique de ce qui est publié : 663 commits, 44 références, la phrase « sur le seul verdict d'un oracle exécuté » lue à la ligne 89 du noyau publié, `oracle-claude-md` PASS sur le clone, porte PASS, 1 constat qui est le verdict lui-même, 0 antériorité, 0 bloquant ; durée de l'affaiblissement en ligne : de la publication de `d87f568` à celle de `189e7f7`, un peu plus d'une heure ; cette restitution part d'office sous R-38 §4, porte rejouée avant.**

## 3. Décisions attendues de l'humain

Rien n'attend de décision : les deux gestes qui restent à votre main — le sort du remisage ancien et l'ouverture d'un mandat sur les dépôts voisins — sont des actions déjà posées aux tours précédents, pas des arbitrages nouveaux ; ils figurent au tableau du bloc 8.

## 4. Traité — avec sa preuve

- **D-5 (a) exécutée — le noyau corrigé est publié : `oracle-claude-md` FAIL → PASS sur la copie locale puis PASS sur le clone publié, classe `regle-balaie-prose-et-identifiants` (variante budgétaire) refermée.** Trois enregistrements par avance rapide, aucun forçage.
  - preuve : `git merge-base --is-ancestor origin/main HEAD` vrai avant le geste ; porte sur la copie locale PASS, 51 constats, **0 bloquant** ; `git push` sorti en 0, `f0fec8f..189e7f7` ; après `git fetch`, `origin/main` = `HEAD` = `189e7f7`, 0 en avance et 0 en retard.
- **L'enregistrement de la session voisine parti sous votre feu vert a été inspecté avant, pas après.** Il précédait ma restitution dans l'histoire et ne pouvait pas en être séparé.
  - preuve : `git show --stat 85b29bd` — une synthèse, deux index, une ligne du registre, **zéro** modification de `CLAUDE.md` ; s'il avait touché le noyau, la publication aurait été suspendue et la question vous aurait été reposée.
- **Ce qui est en ligne est vérifié sur une copie fraîche, pas sur la mienne.** Clone à branche unique hors de c:\dev, tables désignées par les deux variables.
  - preuve : clone en `189e7f7`, 663 commits, 44 références ; `grep -n "seul verdict d'un oracle" CLAUDE.md` rend la **ligne 89** ; `oracle-claude-md` **PASS** sur le clone (6236 octets sur disque en fins de ligne Windows, 6139 après normalisation — la même mesure que celle qui a fait rougir puis verdir le noyau) ; porte exit 0, **PASS, 1 constat — le verdict lui-même —, 0 antériorité, 0 bloquant** ; clone supprimé après mesure.
- **La durée de l'affaiblissement est mesurée, pas minimisée.** Un texte doctrinal affaibli a une durée d'exposition, et elle se compte.
  - preuve : `d87f568` publié à 10:4x, `189e7f7` publié à 11:1x, heure de ce poste — un peu plus d'une heure ; le nombre de sessions ouvertes dans l'intervalle n'est mesurable par aucun outil d'ici, et il est déclaré inconnu plutôt que supposé nul.
- **La session voisine est informée de la publication, de ce qui est parti sous ce feu vert, et de la durée de l'affaiblissement.**
  - preuve : message envoyé et accusé par la messagerie inter-sessions.

## 5. Non traité — avec son motif

- Le nombre de sessions ayant lu le noyau affaibli pendant l'heure d'exposition — motif : impossible à prouver ici ; aucun outil de ce poste ne voit les ouvertures de session ailleurs, et je le déclare inconnu.
- Le remisage local et ses 306 enregistrements de l'ancienne histoire — motif : `gate_gouvernance` — supprimer est un geste humain (R-29 : les dépenses et les portes de gouvernance restent humaines) ; il n'est pas dans ce qui est publié.
- Le réalignement des rapports de référence (TF-1005) et le report de la remontée d'oracle (TF-1006) — motif : `garde_fou`, dépôts frères sans mandat d'écriture.
- Les 32 items du registre visant ce dépôt et les 24 visant des dépôts frères — motif : `borne_atteinte`, ce tour a exécuté votre feu vert et rien d'autre.
- L'outillage de la seconde condition de R-38 §4 — un contrôle qui vérifie qu'un enregistrement dit de restitution ne porte que des restitutions — motif : `borne_atteinte` ; la condition est écrite, son oracle ne l'est pas, et c'est un candidat pour le registre plutôt qu'un geste de ce tour.

## 6. Écarts à la lettre

- **Vous avez demandé** « 5a », publier la correction. **J'ai fait** la publication, puis une vérification sur clone frais que vous n'aviez pas demandée, et j'ai laissé partir un enregistrement de la session voisine qui n'était pas nommé dans la décision. **Pourquoi** : la vérification sur copie fraîche est ce que la doctrine prescrit pour toute mesure qui compte ; l'enregistrement voisin précédait le mien dans l'histoire et ne pouvait pas en être séparé sans réécriture — je l'ai inspecté avant et il ne touche pas au noyau, ce qui est écrit au bloc 4 avec sa preuve.
- Aucun autre écart : rien d'autre que `main` n'a été poussé, aucun forçage.

## 7. Risques

- **Une session ouverte pendant l'heure d'exposition a pu accepter un livrable sur autre chose qu'un oracle.**
  - signal : un livrable de cette fenêtre restitué avec un ✓ sans verdict d'oracle exécuté à côté.
  - parade : aucune rétroactive n'est possible d'ici ; le hook de fin de tour, qui exige une preuve d'oracle par élément traité, est resté en place pendant toute la fenêtre et n'a pas été affaibli — c'est lui qui aurait refusé un tel ✓.
- **La seconde condition de R-38 §4 n'est pas outillée.**
  - signal : un enregistrement dit de restitution qui modifie autre chose que des synthèses, des vues ou des index.
  - parade : déclarée au bloc 5 ; à porter au registre comme candidat.
- **Le noyau est à cinq octets de son plafond.**
  - signal : `oracle-claude-md` rouge à la prochaine ligne ajoutée.
  - parade : tout ajout passe par un renvoi vers `references\` ; et toute réduction se relit en diff, pas en octets — c'est la leçon de ce tour.
- **La copie locale garde une histoire que ce qui est publié n'a pas, par le remisage.**
  - signal : des antériorités dans un verdict local là où le clone frais n'en compte aucune.
  - parade : lire tout verdict local avec cette réserve ; l'action A-5.
- **La divergence installée du skill des oracles reste en place sur ce poste.**
  - signal : `oracle-skills` rouge sur un seul fichier.
  - parade : TF-1006 le nomme ; ne pas jouer la propagation des skills sur ce poste avant son traitement.

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Réaligner les deux rapports de référence sur le format courant (TF-1005) | auto_ia | `garde_fou` — dépôt frère, aucun mandat ; à défaut, chaque rapport d'audit remis rouvre le même aller-retour | complexe × long |
| A-2 | Reporter la remontée d'oracle dans la source versionnée en pseudonymisant (TF-1006) | auto_ia | `garde_fou` — dépôt frère, et le report brut publierait un nom ; sinon : la section sera effacée à la prochaine mise à niveau | moyen × moyen |
| A-3 | Reprendre les 32 items du registre visant ce dépôt (TF-0674) | auto_ia | `borne_atteinte` — hors du feu vert de ce tour ; à défaut, l'écart entre le registre et l'état réel croît | complexe × très long |
| A-4 | Déposer en candidature l'oracle de la seconde condition de R-38 §4 — un enregistrement de restitution ne porte que des restitutions (neuve) | auto_ia | `borne_atteinte` — hors du feu vert de ce tour ; à défaut, la condition reste une phrase que rien ne joue | simple × court |
| A-5 | Inspecter le remisage du 01/09, puis garder ou retirer — `git stash list` en donne les deux entrées (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) et il précède les deux sessions ; sinon : la copie locale garde 306 enregistrements de l'ancienne histoire, dont 202 portent un nom réel | simple × court |
| A-6 | Ouvrir, si vous le souhaitez, un mandat d'écriture sur les dépôts frères — nommer les forges (débloque TF-1005 et TF-1006) | manuelle_utilisateur | `decision` — engager un dépôt dont ce poste n'est pas responsable ; sinon : A-1 et A-2 restent bloquées | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 et A-2 attendent le mandat de A-6 ; A-3 et A-4 ne dépendent de rien et peuvent repartir au prochain tour, A-4 d'abord parce qu'elle est courte et referme une condition non outillée ; A-5 est indépendante et la moins coûteuse des vôtres.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Noyau corrige publie exclusivite retablie en ligne - 20260910d.md` — ce document.
- Publication : `git push origin main`, `f0fec8f..189e7f7`, dépôt `github.com/iguane39/digit-ai-factory` ; enregistrements `68e03cb` (noyau), `85b29bd` (session voisine), `189e7f7` (restitution précédente).
- `CLAUDE.md` publié — ligne 89 « Livrable accepté sur le seul verdict d'un oracle exécuté », 6139 octets après normalisation.
- Clone de vérification : dossier temporaire à branche unique, `189e7f7`, 663 commits, 44 références, supprimé après mesure.
- `output\04-plans\Digit-AI - Synthese Mandat - Regle de portee du GO ecrite et publiee restitution partie d office - 20260910c.md` — la synthèse précédente, dont D-5 est la décision exécutée ici.
- Aucun livrable HTML produit dans ce tour : la critique d'implémentation de forge-design est sans objet.
