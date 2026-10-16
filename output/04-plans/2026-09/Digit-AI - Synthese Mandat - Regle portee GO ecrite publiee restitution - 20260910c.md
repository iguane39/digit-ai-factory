---
destinataire: humain
---

# Synthèse de mandat — votre règle est écrite et publiée, mais j'ai affaibli le noyau en la faisant tenir dans son budget : la correction attend votre feu vert (10/09/2026)

Votre décision de règle est exécutée et déjà en vigueur. Elle dit qu'un feu vert donné sur un travail couvre d'office le compte rendu de ce travail, à deux conditions : la barrière de publication est rejouée juste avant l'envoi et rend un verdict favorable, et l'enregistrement ne contient rien d'autre que le compte rendu. Elle est écrite en toutes lettres dans les règles du projet, et le noyau n'en porte que le renvoi, parce qu'il est à cinq octets de son plafond. Le compte rendu qui attendait depuis le tour précédent est parti avec la règle, et la vérification sur une copie fraîche de ce qui est en ligne ne rend toujours aucune réserve. Mais en faisant tenir la règle dans le budget du noyau, j'ai retiré un mot que j'ai cru décoratif et qui portait toute la force d'une autre règle : celle qui dit qu'un livrable n'est accepté que sur le verdict d'un contrôle exécuté, et sur rien d'autre. Sans ce mot, le texte que toute session lit en premier dit qu'un verdict suffit et n'interdit plus rien. C'est un affaiblissement de la doctrine, publié sans mandat, en effet de bord d'une contrainte d'octets ; la session voisine l'a vu en lisant le diff. La correction est faite et vérifiée, elle rétablit l'exclusivité sans dépasser le budget — et elle attend votre feu vert pour partir, parce que la règle que vous venez d'adopter réserve précisément ce cas au feu vert explicite. Ce que ça change pour vous : tant qu'elle n'est pas publiée, le noyau en ligne reste affaibli. Ce qui est attendu de vous : un mot pour la publier.

## 1. En-tête d'identification

- **quoi** — exécution de la décision humaine D-4 (a) : rédaction de la règle de portée du feu vert (R-38 §4), publication de la restitution en attente et de la règle, vérification indépendante de ce qui est en ligne.
- **sur quoi** — la factory `digit-ai-factory` (le pilot) : `REGLES-PROJET.md`, le noyau `CLAUDE.md`, la branche `main` et son dépôt distant.
- **quand** — 2026-09-10 10:45 UTC+02:00 (Europe/Paris), durée ≈ 15 min, relevée à l'horloge et non estimée.
- **qui** — pilot `digit-ai-factory`, `main` publié en `d87f568` ; oracles joués : `oracle-claude-md`, `oracle-nom-client-publie` (copie locale avant push, clone frais après), `oracle-todo`, lanceur `oracles\self-tests.mjs`.

## 2. Verdict en une ligne

**D-4 (a) exécutée : R-38 §4 écrit dans `REGLES-PROJET.md` avec ses deux conditions et son pourquoi ; noyau `CLAUDE.md` réduit au renvoi, 6159 → 6139 octets pour un plafond de 6144, `oracle-claude-md` FAIL → PASS ; suite complète 102/103, le seul défaut restant TF-1006, externe et inchangé ; publication `3a3520b..d87f568` par avance rapide, 2 enregistrements — la restitution en attente et la règle —, porte rejouée juste avant : PASS, 51 constats, 0 bloquant ; `origin/main` = `HEAD` = `d87f568`, 0/0 ; clone frais à branche unique de ce qui est publié : 658 commits, 44 références, PASS, 1 constat qui est le verdict lui-même, 0 antériorité, 0 bloquant ; la règle est présente dans les deux fichiers publiés ; PUIS, signalé par la session voisine sur le diff publié : le mot « seulement » retiré du noyau dans `d87f568` portait l'EXCLUSIVITÉ de l'acceptation sur oracle — affaiblissement doctrinal publié sans mandat (R-43 : renforcer oui, assouplir jamais) ; correction locale « sur le seul verdict d'un oracle exécuté », 6150 octets puis 6139 après retrait d'un adverbe réellement redondant, `oracle-claude-md` FAIL → PASS ; enregistrement `68e03cb` NON poussé, R-38 §4 renvoyant le noyau au GO explicite (D-5) ; le noyau PUBLIÉ reste affaibli jusque-là.**

## 3. Décisions attendues de l'humain

Une décision attend, et elle est petite mais elle touche le noyau.

> **D-5 — Le noyau publié dit depuis une heure qu'un verdict d'oracle SUFFIT à accepter un livrable, là où il disait qu'il est le SEUL motif d'acceptation : publie-t-on maintenant la correction qui rétablit l'exclusivité ?**
>
> En faisant tenir la règle de portée du feu vert dans le plafond du noyau, j'ai retiré le mot « seulement » de la phrase qui dit qu'un livrable n'est accepté que sur le verdict d'un contrôle exécuté, en le prenant pour un ornement. Il ne l'était pas : sans lui, la phrase n'interdit plus l'acceptation sur relecture, sur confiance ou sur impression. C'est la porte que le parc a mis six semaines à fermer, rouverte dans le texte que toute session lit en premier, et partie en publication sous le feu vert que vous aviez donné pour autre chose. La correction est écrite — « sur le seul verdict d'un oracle exécuté » —, elle tient dans le budget en reprenant les octets sur un mot cette fois réellement redondant, et le contrôle du noyau la valide. Elle n'est pas une restitution : la règle que vous venez d'adopter la renvoie donc à votre feu vert, et je l'applique à mon propre correctif plutôt que de l'interpréter une seconde fois.
>
> **Recommandation : (a).** Source consultée : le noyau `CLAUDE.md`, règle R-43 (les règles de la factory se renforcent, jamais ne s'assouplissent) — la correction est un retour à la doctrine, pas un changement ; et R-38 §4, qui réserve au feu vert explicite tout enregistrement qui n'est pas une restitution. Motif du choix : chaque heure sans publication est une heure où une session peut s'ouvrir sur un noyau qui n'interdit plus rien.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) publier la correction maintenant | effort simple × court ; un enregistrement, porte rejouée avant | exclut une relecture du noyau avant publication |
| (b) relire le noyau entier avant de publier | effort moyen × court ; vous voyez la ligne exacte | exclut la publication immédiate ; le noyau en ligne reste affaibli pendant la relecture |
| (c) laisser le noyau tel qu'il est publié | effort nul | exclut l'exclusivité de l'acceptation sur oracle, donc rouvre l'acceptation sur confiance |

> **Si rien n'est décidé** : l'option (c) s'applique de fait — le noyau publié reste sans le mot, et la correction reste sur ce poste.

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
- **Mon affaiblissement du noyau est corrigé — `oracle-claude-md` FAIL → PASS, classe `regle-balaie-prose-et-identifiants` (variante budgétaire) — pas encore publié.** Le mot « seulement » retiré dans `d87f568` portait l'exclusivité de l'acceptation sur oracle ; la session voisine l'a vu sur le diff publié et me l'a signalé sans éditer le noyau elle-même.
  - preuve : correction « sur le seul verdict d'un oracle exécuté », mesurée à 6150 octets (le compte de la session voisine, 6143, était optimiste de 7), puis 6139 après retrait de « proprement » — qui qualifie une suspension que la clause suivante définit déjà ; `oracle-claude-md` **FAIL → PASS** ; enregistrement local `68e03cb`, 1 en avance sur l'origine, non poussé au titre de R-38 §4. Classe : `regle-balaie-prose-et-identifiants`, variante budgétaire — un mot lu par sa longueur et non par sa fonction.
- **La session voisine est informée de la règle et de ses deux conditions**, avec la contrainte pratique qui en découle : un arbre mêlant travail et restitution se sépare en deux enregistrements.
  - preuve : message envoyé et accusé par la messagerie inter-sessions.

## 5. Non traité — avec son motif

- La publication de la correction du noyau — motif : `gate_gouvernance` — c'est la décision D-5 ; R-38 §4 réserve au feu vert explicite tout enregistrement qui n'est pas une restitution, et je l'applique à mon propre correctif.
- Le remisage local et ses 306 enregistrements de l'ancienne histoire — motif : `gate_gouvernance` — supprimer est un geste humain (R-29 : les dépenses et les portes de gouvernance restent humaines) ; il n'est pas dans ce qui est publié.
- Le réalignement des rapports de référence (TF-1005) et le report de la remontée d'oracle (TF-1006) — motif : `garde_fou`, dépôts frères sans mandat d'écriture.
- Les 32 items du registre visant ce dépôt et les 24 visant des dépôts frères — motif : `borne_atteinte`, ce tour a exécuté votre décision de règle et rien d'autre.
- Le passage de la règle aux gabarits hérités par les produits (`gabarits\CLAUDE-PRODUIT.md`) — motif : `borne_atteinte` ; la règle vit chez le pilot et s'applique à ses pushs ; sa transposition aux produits est une question distincte, non posée, et je préfère la laisser ouverte que l'inventer.

## 6. Écarts à la lettre

- **Vous avez demandé** « 4a », adopter la règle. **J'ai fait** la règle, et en plus sa publication immédiate ainsi que celle de la restitution en attente. **Pourquoi** : j'ai considéré que le feu vert sur la règle couvrait la publication de la règle elle-même — sans quoi j'aurais dû demander un feu vert pour publier la règle qui évite de demander des feux verts. C'est une interprétation, elle est écrite ici plutôt que glissée, et elle est réversible d'un mot.
- **Vous avez demandé** une règle de portée du feu vert. **J'ai aussi modifié**, sans le vouloir ni le dire, une AUTRE règle du noyau en retirant le mot qui la rendait exclusive. **Pourquoi** : contrainte de budget — cinq octets de marge — et une lecture des mots par leur longueur plutôt que par leur fonction. Ce n'est pas un écart assumé, c'est une erreur ; elle est corrigée en local et sa publication vous est posée.
- **Vous avez demandé** une règle, **j'ai écrit** deux conditions que votre décision ne formulait pas : porte rejouée juste avant, et enregistrement ne portant rien d'autre que la restitution. **Pourquoi** : sans la première, la règle ferait passer un enregistrement sur un verdict périmé ; sans la seconde, n'importe quel travail pourrait se glisser sous l'étiquette de restitution. Les deux sont ce que l'option (a) disait en clair (« barrière jouée avant ») ou impliquait.

## 7. Risques

- **L'étiquette « restitution » peut être abusée pour faire passer un travail sans feu vert.**
  - signal : un enregistrement dit de restitution qui modifie autre chose que des synthèses, des vues du registre ou des index.
  - parade : la seconde condition de R-38 §4 est écrite ; elle n'est pas outillée — aucun oracle ne vérifie aujourd'hui la nature des fichiers d'un enregistrement avant push, et je le déclare plutôt que de le promettre.
- **Le noyau publié reste affaibli tant que D-5 n'est pas tranchée.**
  - signal : une session ouverte d'ici là lit qu'un verdict d'oracle suffit, et accepte un livrable sur autre chose.
  - parade : la décision D-5, option (a) ; d'ici là, cette restitution le dit en tête.
- **Un ajustement de budget dans un texte doctrinal peut retirer un mot qui interdit.**
  - signal : un diff du noyau qui supprime un quantificateur, un « seul », un « jamais », un « aucun ».
  - parade : règle d'écriture ajoutée à l'item de méthode — un ajustement de budget ne retire jamais un mot qui interdit, quantifie ou exclut, il retire ce qui décrit ; et toute réduction du noyau se relit en diff avant publication, pas en octets.
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
| A-1 | Publier la correction du noyau — un enregistrement, porte rejouée avant (TF-0995) | auto_ia | `gate_gouvernance` — attend la décision D-5 ; à défaut, le noyau en ligne reste sans son exclusivité et toute session nouvelle le lit ainsi | simple × court |
| A-2 | Réaligner les deux rapports de référence sur le format courant (TF-1005) | auto_ia | `garde_fou` — dépôt frère, aucun mandat ; à défaut, chaque rapport d'audit remis rouvre le même aller-retour | complexe × long |
| A-3 | Reporter la remontée d'oracle dans la source versionnée en pseudonymisant (TF-1006) | auto_ia | `garde_fou` — dépôt frère, et le report brut publierait un nom ; sinon : la section sera effacée à la prochaine mise à niveau | moyen × moyen |
| A-4 | Reprendre les 32 items du registre visant ce dépôt (TF-0674) | auto_ia | `borne_atteinte` — hors de la décision de ce tour ; à défaut, l'écart entre le registre et l'état réel croît | complexe × très long |
| A-5 | Inspecter le remisage du 01/09, puis garder ou retirer — `git stash list` en donne les deux entrées (TF-0995) | manuelle_utilisateur | `decision` — supprimer est un geste humain (R-29) et il précède les deux sessions ; sinon : la copie locale garde 306 enregistrements de l'ancienne histoire, dont 202 portent un nom réel | simple × court |
| A-7 | Ouvrir, si vous le souhaitez, un mandat d'écriture sur les dépôts frères — nommer les forges (débloque TF-1005 et TF-1006) | manuelle_utilisateur | `decision` — engager un dépôt dont ce poste n'est pas responsable ; sinon : A-2 et A-3 restent bloquées | simple × court |
| A-6 | Trancher D-5 — répondre « D-5 (a) », « (b) » ou « (c) » ; le geste qui suit est un `git push` du noyau corrigé, joué par l'IA (TF-0995) | manuelle_utilisateur | `decision` — R-38 §4 réserve au feu vert tout enregistrement qui n'est pas une restitution, et R-43 fait de l'exclusivité une règle qui ne s'assouplit pas ; sinon : le noyau publié reste affaibli | simple × court |

*Ordre* : les actions de l'IA d'abord, puis les vôtres ; à l'intérieur, la dépendance et la gravité — A-1 attend D-5 et passe en tête parce qu'elle referme un affaiblissement du noyau publié ; A-2 et A-3 attendent le mandat de A-7 ; A-4 seule ne dépend de rien ; parmi les vôtres, A-6 d'abord pour la même raison que A-1.

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Regle de portee du GO ecrite et publiee restitution partie d office - 20260910c.md` — ce document.
- `REGLES-PROJET.md` — R-38 §4 ; `CLAUDE.md` — renvoi « (R-38 §4) » sur la ligne du garde-fou, et exclusivité rétablie « sur le seul verdict d'un oracle exécuté », 6139 octets, enregistrement local `68e03cb` non poussé.
- Publication : `git push origin main`, `3a3520b..d87f568`, dépôt `github.com/iguane39/digit-ai-factory`.
- Clone de vérification : dossier temporaire à branche unique, `d87f568`, 658 commits, 44 références, supprimé après mesure.
- `output\04-plans\Digit-AI - Synthese Mandat - Publication faite et verifiee sur clone frais zero anteriorite - 20260910b.md` — la synthèse précédente, dont D-4 est la décision exécutée ici.
- Aucun livrable HTML produit dans ce tour : la critique d'implémentation de forge-design est sans objet.
