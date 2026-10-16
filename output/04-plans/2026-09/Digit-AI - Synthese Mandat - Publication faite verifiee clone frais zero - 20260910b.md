---
destinataire: humain
---

# Synthèse de mandat — votre feu vert est exécuté, le travail est publié, et la vérification faite sur une copie fraîche de ce qui est en ligne ne rend plus aucune réserve (10/09/2026)

Votre feu vert a été exécuté dans la minute : les quatorze enregistrements de travail des deux sessions sont publiés, par avance rapide, sans aucun forçage. La vérification a été faite comme la doctrine le prescrit — non pas sur ma copie de travail, mais sur une copie fraîche téléchargée depuis ce qui est en ligne, avec une seule branche — et elle rend un résultat que ce fil n'avait encore jamais obtenu : aucun nom de client, aucune réserve d'antériorité, rien à déclarer. Les cinquante réserves que vous avez lues dans la synthèse précédente tenaient à ma copie locale seule, à cause d'un remisage ancien ; elles n'ont jamais existé dans ce qui est publié. Ce que ça change pour vous : tout autre poste peut désormais reprendre ce travail à jour. Ce qui est attendu de vous : rien d'urgent — une seule question de règle, pour éviter qu'à chaque tour un enregistrement de restitution reste en attente d'un feu vert de plus.

## 1. En-tête d'identification

- **quoi** — exécution de la décision humaine D-3 (a) : publication du travail sur le dépôt distant, puis vérification indépendante de ce qui est en ligne.
- **sur quoi** — la factory `digit-ai-factory` (le pilot), branche `main`, dépôt distant `github.com/iguane39/digit-ai-factory`.
- **quand** — 2026-09-10 10:20 UTC+02:00 (Europe/Paris), durée ≈ 10 min, relevée à l'horloge et non estimée.
- **qui** — pilot `digit-ai-factory`, `main` publié en `3a3520b` ; oracle `oracle-nom-client-publie` joué deux fois (copie locale avant publication, clone frais après) ; `git push`, `git fetch`, `git clone --single-branch`.

## 2. Verdict en une ligne

**Publication faite : `c96a32f..3a3520b`, 14 enregistrements, avance rapide, exit 0, aucun forçage ; `origin/main` = `HEAD` = `3a3520b`, 0 en avance et 0 en retard après `git fetch` ; porte rejouée sur la copie locale juste avant le push : PASS, 51 constats dont 50 antériorités et 0 bloquant ; porte rejouée sur un CLONE FRAIS À BRANCHE UNIQUE de ce qui est publié, hors de c:\dev, tables désignées explicitement : PASS, 655 commits, 44 références, **1 seul constat qui est le verdict lui-même, 0 antériorité, 0 bloquant** ; la copie locale garde ses 306 enregistrements de l'ancienne histoire par le remisage, qui n'a pas été poussé et n'est pas dans ce qui est publié ; un enregistrement de restitution reste local et non poussé, faute de feu vert le couvrant.**

## 3. Décisions attendues de l'humain

Une seule question, de règle et non d'urgence.

> **D-4 — Chaque restitution d'un tour de travail produit un enregistrement local de plus, qui attend un feu vert pour partir : adopte-t-on une règle qui couvre d'office ces enregistrements de restitution, ou reste-t-on au feu vert explicite à chaque fois ?**
>
> Le feu vert que vous venez de donner couvrait le travail des deux sessions, et il est exécuté. Mais la restitution de cette publication est elle-même un enregistrement — ce document et les vues du registre régénérées — et je ne l'ai pas poussé, parce qu'étendre de moi-même un feu vert à ce qu'il ne nommait pas serait précisément ce que la règle interdit. Résultat mécanique : la copie locale repasse à un enregistrement d'avance dès que ce document est écrit, et le restera à chaque tour. Ce n'est pas un défaut de la règle, c'est sa lettre ; la question est de savoir si vous voulez lui donner une portée qui évite l'aller-retour.
>
> **Recommandation : (a).** Source consultée : le noyau `CLAUDE.md` du pilot, règle R-38 (aucun livrable publié sur un service hébergé sans feu vert humain), qui réserve la publication à un geste humain mais ne dit rien de sa PORTÉE — un feu vert par enregistrement, ou un feu vert par nature d'enregistrement. Motif du choix : une restitution ne porte jamais que le compte rendu d'un travail déjà publié, elle passe la même barrière que lui, et l'exiger à chaque fois produit un enregistrement orphelin par tour sans qu'aucun risque nouveau ne soit couvert.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) règle : les enregistrements de restitution d'un travail déjà publié partent d'office, barrière jouée avant | effort simple × court ; une ligne au noyau ; la barrière reste jouée à chaque fois | exclut la relecture humaine de chaque restitution avant qu'elle ne soit en ligne |
| (b) feu vert explicite à chaque fois, comme aujourd'hui | effort nul ; un aller-retour par tour, et une copie locale toujours d'un enregistrement d'avance | exclut qu'un autre poste voie la restitution avant votre prochain message |
| (c) les restitutions ne sont jamais publiées, elles restent locales | effort nul ; rien à décider ensuite | exclut que la trace opposable d'un tour soit visible ailleurs que sur ce poste |

> **Si rien n'est décidé** : l'option (b) s'applique d'elle-même — ce document reste local, et je demanderai un feu vert à chaque tour.

## 4. Traité — avec sa preuve

- **D-3 (a) exécutée — le travail est publié.** Quatorze enregistrements, dont ceux de la session voisine, envoyés par avance rapide.
  - preuve : `git push origin main` sorti en 0, `c96a32f..3a3520b main -> main` ; `git merge-base --is-ancestor origin/main HEAD` vrai avant le geste, donc aucun forçage possible ni nécessaire ; après `git fetch`, `origin/main` = `HEAD` = `3a3520b`, 0 en avance et 0 en retard.
- **La barrière a été jouée juste avant, sur la copie locale.** Pas sur le verdict d'il y a une heure : sur l'état exact au moment du geste, le dépôt ayant bougé entre-temps.
  - preuve : `oracle-nom-client-publie .` exit 0, PASS, 51 constats, 50 antériorités, **0 bloquant**.
- **La vérification décisive est faite sur ce qui est EN LIGNE, pas sur ma copie.** Clone frais à branche unique dans un dossier temporaire hors de c:\dev, tables désignées par les deux variables d'environnement, comme le mode opératoire le prescrit pour toute mesure qui compte.
  - preuve : clone en `3a3520b`, 655 commits, 44 références ; porte exit 0, **PASS, 1 constat — le verdict lui-même —, 0 antériorité, 0 bloquant** ; clone supprimé après mesure. Les 50 antériorités de la copie locale n'existent pas dans ce qui est publié : elles tenaient au remisage, qui n'a pas été poussé.
- **La session voisine est informée**, avec les identifiants publiés, les deux verdicts et la borne : rien d'autre que `main` n'est parti.
  - preuve : message envoyé et accusé par la messagerie inter-sessions.

## 5. Non traité — avec son motif

- La publication de ce document et des vues régénérées — motif : `gate_gouvernance` — c'est la décision D-4 ; le feu vert reçu couvrait le travail, pas sa propre restitution.
- Le remisage local et ses 306 enregistrements de l'ancienne histoire — motif : `gate_gouvernance` — supprimer est un geste humain (R-29 : les dépenses et les portes de gouvernance restent humaines) ; il n'est pas dans ce qui est publié.
- Le réalignement des rapports de référence (TF-1005) et le report de la remontée d'oracle (TF-1006) — motif : `garde_fou`, dépôts frères sans mandat d'écriture.
- Les 32 items du registre visant ce dépôt et les 24 visant des dépôts frères — motif : `borne_atteinte`, ce tour a exécuté votre feu vert et rien d'autre.

## 6. Écarts à la lettre

- **Vous avez demandé** « 3a », publier. **J'ai fait** la publication, puis une vérification que vous n'aviez pas demandée, sur un clone frais. **Pourquoi** : la doctrine du dépôt écrit que la mesure qui compte se fait sur une copie à branche unique de ce qui est publié, jamais sur la copie de travail ; sans elle, le verdict aurait porté les 50 réserves de ma copie locale, qui ne sont pas celles de ce qui est en ligne.
- Aucun autre écart : rien d'autre que `main` n'a été poussé, aucun forçage, aucun enregistrement supplémentaire créé avant le push.

## 7. Risques

- **La copie locale et ce qui est publié ne portent plus la même histoire, à cause du remisage.**
  - signal : un verdict de la barrière sur ce poste qui compte des antériorités là où le clone frais n'en compte aucune.
  - parade : lire tout verdict local avec cette réserve, et l'action A-1 pour trancher le sort du remisage.
- **Ce document reste local tant que D-4 n'est pas tranchée.**
  - signal : un autre poste voit le travail publié mais pas sa restitution.
  - parade : la décision D-4 ; à défaut, un feu vert au prochain tour.
- **La divergence installée du skill des oracles reste en place sur ce poste.**
  - signal : `oracle-skills` rouge sur un seul fichier ; une mise à niveau du poste effacerait la section ajoutée.
  - parade : TF-1006 le nomme ; ne pas jouer la propagation des skills sur ce poste avant son traitement.

## 8. Prochaines actions

Ce tableau ne liste que les restes ; ce qui est fait est au bloc 4 avec sa preuve.

| # | Action | Acteur | Motif / raison | Effort |
|---|---|---|---|---|
| A-1 | Publier ce document et les vues régénérées du registre (TF-0995) | auto_ia | `gate_gouvernance` — attend la décision D-4 ; à défaut, la restitution de la publication reste invisible depuis tout autre poste | simple × court |
| A-2 | Réaligner les deux rapports de référence sur le format courant (TF-1005) | auto_ia | `garde_fou` — dépôt frère, aucun mandat ; à défaut, chaque rapport d'audit remis rouvre le même aller-retour | complexe × long |
| A-3 | Reporter la remontée d'oracle dans la source versionnée en pseudonymisant (TF-1006) | auto_ia | `garde_fou` — dépôt frère, et le report brut publierait un nom ; sinon : la section sera effacée à la prochaine mise à niveau | moyen × moyen |
| A-4 | Reprendre les 32 items du registre visant ce dépôt (TF-0674) | auto_ia | `borne_atteinte` — hors du feu vert de ce tour ; à défaut, l'écart entre le registre et l'état réel croît | complexe × très long |
| A-5 | Trancher D-4 — répondre « D-4 (a) », « (b) » ou « (c) » ; le geste qui suit est un `git push`, joué par l'IA (TF-0995) | manuelle_utilisateur | `decision` — la règle R-38 réserve la publication à votre feu vert et ne dit rien de sa portée ; sinon : l'option (b) s'applique, un feu vert par tour | simple × court |
| A-6 | Inspecter le remisage du 01/09, puis garder ou retirer — `git stash list` en donne les deux entrées (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) et il précède les deux sessions ; sinon : la copie locale garde 306 enregistrements de l'ancienne histoire, dont 202 portent un nom réel | simple × court |
| A-7 | Ouvrir, si vous le souhaitez, un mandat d'écriture sur les dépôts frères — nommer les forges (débloque TF-1005 et TF-1006) | manuelle_utilisateur | `decision` — engager un dépôt dont ce poste n'est pas responsable ; sinon : A-2 et A-3 restent bloquées | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance — A-1 attend D-4, A-2 et A-3 attendent un mandat, A-4 seule ne dépend de rien ; parmi les vôtres, D-4 d'abord parce qu'elle règle un aller-retour qui se répète à chaque tour.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Publication faite et verifiee sur clone frais zero anteriorite - 20260910b.md` — ce document.
- Publication : `git push origin main`, `c96a32f..3a3520b`, dépôt `github.com/iguane39/digit-ai-factory`, branche `main`.
- Clone de vérification : dossier temporaire à branche unique, `3a3520b`, 655 commits, 44 références, supprimé après mesure ; sortie de la porte conservée dans le journal de session.
- `output\04-plans\Digit-AI - Synthese Mandat - Vos deux decisions executees clone rebati porte au vert - 20260910a.md` — la synthèse précédente, dont D-3 est la décision exécutée ici.
- Aucun livrable HTML produit dans ce tour : la critique d'implémentation de forge-design est sans objet.
