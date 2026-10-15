---
destinataire: humain
---

# Synthèse Mandat — retours et sujets de ce poste, après fusion avec l'autre poste (15/10/2026)

## 0. Synthèse d'ouverture

Ce poste avait 99 enregistrements de retard sur l'autre, qui avait déjà traité 3 des 4 lots en attente. Après la fusion, le seul retour encore dehors était celui de Produit-12 sur la reprise d'un produit d'un poste à l'autre par Google Drive. Il est maintenant au registre, en candidat. Pour cela, le lot a changé de nom : le produit avait remis deux lots différents sous le même nom, un depuis chaque poste. Le registre et la boîte d'entrée sont verts. La publication est refusée par le contrôle avant envoi tant que vous n'avez pas donné votre feu vert. 3 décisions vous reviennent.

## 1. En-tête d'identification

- **quoi** — exécution de votre demande « Traite tous les TODOs et retours qui concernent ce poste » : remise à jour du poste, boîte d'entrée, sujets du registre qui attendent ce poste, réglages du poste.
- **sur quoi** — pilot `digit-ai-factory`, enregistrements locaux `2ffb218f` (fusion) et `d5269a8f`, non publiés ; forges conception, design et tests lues sans écriture ; produits lus par l'essai d'émission, sans écriture.
- **quand** — 2026-10-15, de 18:29 à 18:43 UTC+02:00 (Europe/Paris), heure relevée par `date`.
- **qui** — session de pilotage Claude Opus 5.5, sans agent ; escalade : aucune ; outils joués : `git merge`, `oracle-todo`, `journaliser`, `oracle-boite-entree`, `ingerer-lot`, `emettre-travaux --essai`, `allouer-indice`, `readme-dossiers`.
- **intention** — que rien de ce qui dépend de ce poste ne reste bloqué faute d'y avoir été fait, et que les deux postes ne se contredisent pas. **Test rétro** : servie pour le registre et la boîte d'entrée, désormais communs aux deux postes et verts. Elle ne l'est pas encore pour l'autre poste, qui ne verra rien de ce travail avant la publication (D-1).

## 2. Verdict en une ligne

**TENU, publication retenue — boîte d'entrée FAIL → PASS (4 lots en attente, puis 1, puis 0), registre PASS après fusion de 99 enregistrements et 5 écritures, 1 candidature neuve (TF-1736) ; 3 enregistrements locaux en attente de votre feu vert.**

## 3. Décisions attendues de l'humain

Chaque décision suit le même ordre : la question, le rappel du sujet, la recommandation et sa source, puis un tableau dont chaque ligne est une option, avec son coût et ce qu'elle exclut. La ligne de repli dit ce qui s'applique sans réponse. Les 3 bloquants, ce qui les lève, et ce qui se passe sinon :

- la publication des 3 enregistrements : votre décision D-1 ; sans elle, l'autre poste peut refaire la même fusion et frapper le même numéro TF-1736.
- le réglage d'effort du poste : votre décision D-2 ; sans elle, TF-1557 reste ouvert et le contrôle MS5 reste rouge à chaque ouverture.
- la reprise multi-poste demandée par Produit-12 : votre décision D-3 ; sans elle, TF-1736 attend la revue hebdomadaire.

> **D-1 — Publiez-vous les 3 enregistrements locaux du pilot `digit-ai-factory` (`f900813b`, `2ffb218f`, `d5269a8f`) ?**
>
> Rappel du sujet : ils portent le travail du 14/10 de ce poste, la fusion avec l'autre poste et l'ingestion du retour de Produit-12 sur la reprise multi-poste. Le contrôle avant envoi les refuse : deux d'entre eux ajoutent des fichiers de lot de retours, et la règle de publication exige pour cela un feu vert humain cité à l'envoi. Le feu vert permanent du 03/10, qui vaut pour le reste, ne couvre pas ce cas.
>
> **Recommandation : (a).** Sans publication, l'autre poste refera la fusion et peut attribuer TF-1736 à un autre sujet. Source consultée : sortie du contrôle avant envoi (« PUBLICATION REFUSEE - un enregistrement en avance exige le GO humain explicite ») et `git status -sb` (« ahead 3 »).

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier maintenant, avec votre feu vert cité au contrôle avant envoi | complexité faible · durée courte (environ 9 min de contrôle) | aucune |
| (b) garder local | aucun | l'autre poste ne voit ni la fusion ni TF-1736 |

> **Si rien n'est décidé** : l'option (b) s'applique, les enregistrements restent locaux.

> **D-2 — Quel effort de réflexion gardez-vous sur ce poste pour Opus 5.5 : « medium » ou « high » ?**
>
> Rappel du sujet : le 14/10 au matin, ce poste avait été réglé sur « high », comme le veut la table de réglage par type de tâche décidée le 13/10. Le fichier `~/.claude/settings.json` a été réécrit le 14/10 à 23:39, hors de toute session tracée, et Opus 5.5 y est revenu à « medium ». Je n'écrase pas un réglage que vous avez peut-être fait vous-même.
>
> **Recommandation : (b) si le changement vient de vous, (a) sinon.** La table décidée le 13/10 vaut tant qu'elle n'est pas révisée ; un choix de votre part à 23:39 en est une révision de fait. Source consultée : contrôle MS5 (effort conforme à la table) d'`oracle-modeles-en-service` à l'ouverture, et date du fichier (`ls -la`, 14/10 23:39).

| Option | Coût | Exclusions |
|---|---|---|
| (a) reposer « high » et clore TF-1557 | complexité faible · durée courte | chaque tour coûte plus de réflexion |
| (b) garder « medium » et réviser la table de réglage | complexité faible · durée courte | la table du 13/10 change pour ce type de tâche |

> **Si rien n'est décidé** : rien ne change, « medium » reste en place et TF-1557 reste ouvert.

> **D-3 — Que décidez-vous pour la reprise automatique d'un produit sur tous les postes du développeur quand il a déclaré un canal (Google Drive ou équivalent) ?**
>
> Rappel du sujet : chez un produit dont le développeur avait créé un dossier de reprise sur Google Drive, ce canal existait et contenait les 58 générateurs, mais une session de l'autre poste les a déclarés introuvables, et une session de ce poste a laissé leur transport à l'humain. Le lot propose 5 gestes : une règle, une ligne au gabarit du produit, un manifeste, une restauration à l'ouverture, et un envoi vers le canal en fin de tour. Ce dernier geste fait partir des fichiers vers un service hébergé : c'est le cas que la règle de publication encadre.
>
> **Recommandation : (a).** Lire le canal depuis son miroir local ne publie rien, et règle à lui seul le cas mesuré : les fichiers étaient sur le Drive, c'est la lecture qui a manqué. Source consultée : le lot `Produit-12 - RETOURS - 20261014b.md` (section « Confirmations positives » : « le défaut n'est pas dans le transport ») et R-38 (règle de publication des livrables) de `REGLES-PROJET.md`.

| Option | Coût | Exclusions |
|---|---|---|
| (a) décider les gestes 1, 2, 3 et 5 du lot : règle, gabarit, manifeste lu à l'ouverture, refus d'oracle-synthese ; pas d'envoi automatique vers le canal | complexité moyenne · durée moyenne | ce qui change hors de git sur un poste se pousse encore à la main |
| (b) décider les 5 gestes, envoi automatique compris, sous un feu vert de publication donné une fois par produit | complexité élevée · durée longue | aucune |
| (c) laisser à la revue hebdomadaire | aucun | la reprise reste manuelle d'ici là |

> **Si rien n'est décidé** : l'option (c) s'applique.

> **D-2 du 14/10 (règles perdues du socle des pages, TF-1307), posée le 14/10 à 12:10 : inchangée.**

## 4. Traité — avec sa preuve

Ce tour a remis le poste à jour, vidé la boîte d'entrée et rangé ce qui portait le même nom des deux côtés.

- **Fusion avec l'autre poste** (1 enregistrement local, 99 publiés). Le lot publié garde son nom ; nos écritures au registre sont réinjectées, sauf la clôture de TF-1637, déjà close de l'autre côté.
  - preuve : `oracle-todo` → FAIL R9 (« ts décroissant » sur TF-1637) après la première résolution, PASS après réécriture par `journaliser.mjs`.
- **Lot Produit-12 renommé de 20261014a en 20261014b** : deux lots différents du produit portaient ce nom et le même identifiant de retour, RS-31 (numéro de retour du produit). Une note de réception le dit dans le lot.
  - preuve : `git diff :2: :3:` sur le lot → deux contenus distincts (reprise multi-poste d'un côté, qualité du classement de l'autre).
- **Lot ingéré sous TF-1736, en candidat**, après deux compléments faits à la réception : la classe proposée (clé, famille, libellé), qui manquait, et la renumérotation de RS-31 en RS-33.
  - preuve : `ingerer-lot.mjs` → « [REJET ATOMIQUE] … RS-31 déjà défini », puis « [OK] 1 candidature(s) ingérée(s) en CANDIDAT » ; `oracle-boite-entree` → FAIL (B1) → PASS.
- **Classe proposée non créée** : R15 (classe neuve sans juge) refuse une classe neuve dont le juge n'existe pas encore (décision D-3 (c) du 16/09). Elle naîtra avec le correctif de TF-1736.
  - preuve : `oracle-todo` → FAIL R15 sur la clé créée, PASS après retrait.
- **Clôture de TF-1557 non inscrite**, annotée pour D-2.
  - preuve : `grep effortLevel ~/.claude/settings.json` → « medium » ; date du fichier 14/10 23:39.
- **Synthèse du poste du 14/10 réindexée en « b »**, l'indice « a » étant pris par une synthèse publiée de l'autre poste.
  - preuve : `allouer-indice` (portée dossier) ; liste des synthèses du 14/10 dans `output/04-plans/`.
- **Relevé d'héritage de ce matin** ajouté au journal, après contrôle : il ne porte que des pseudonymes.
  - preuve : `grep -o '"produit":…'` → « Produit-02, Produit-12, Produit-61, Produit-68, Produit-69, (produit hors table) ».
- **Enregistrements** `2ffb218f` et `d5269a8f`, publication tentée.
  - preuve : contrôle avant envoi → « PUBLICATION REFUSEE … exige le GO humain explicite (R-38 (règle de publication des livrables) par. 4-5) ».

## 5. Non traité — avec son motif

- La publication — motif : `dependance_bloc_3`, D-1.
- La clôture de TF-1557 — motif : `dependance_bloc_3`, D-2.
- Le traitement de TF-1736 — motif : `dependance_bloc_3`, D-3.
- Le dépôt de 10 nouveaux lots de travaux aux produits de ce poste, que l'essai d'émission proposait — motif : `hors_perimetre`. Les lots du 04/10 sont encore « a_traiter » chez Produit-12, et aucun mandat d'écriture chez les produits n'est déclaré à l'ouverture.
- TF-1536, TF-1630, TF-1631 et TF-1023 — motif : `hors_perimetre` : leurs produits (Produit-01, Produit-03, Produit-77, un produit marketing) ne sont pas non plus sur ce poste.
- Les 3 indices du 01/10 portés chacun par deux synthèses (g, h, i), signalés à l'ouverture — motif : `hors_perimetre` : elles viennent des deux postes, sont citées par le registre, et un renommage casserait ces citations sans décision.
- Les fichiers non suivis des forges conception, design et tests (entrants, et références visuelles qui portent des noms réels de produits), ainsi que le fichier `null` et les deux dossiers non versionnés à la racine du parc — motif : `decision` : supprimer est un geste humain (R-29), et rien de cela ne doit entrer dans un historique.

## 6. Écarts à la lettre

- **Vous aviez laissé l'entrée du lot à votre choix (D-1 du 14/10)** → **je l'ai fait entrer** par l'option (b) que je recommandais, sans dérogation, sans créer la classe, et sans lot de travaux au produit → **pourquoi** : votre demande, renouvelée, porte sur « tous les retours de ce poste ». Une fois sa classe proposée complétée, le lot passe la porte normalement. L'item reste un candidat, et la décision de fond vous revient (D-3).
- **J'ai joué `ingerer-lot.mjs` avec l'option `--essai`, qu'il ne connaît pas** → l'ingestion a eu lieu pour de bon → **pourquoi** : je le voulais comme essai à blanc. Le résultat est celui que je visais, et le registre est PASS. Je vous le signale, parce que le geste a été fait sans que je l'aie voulu ainsi.

## 7. Risques

- L'autre poste peut ingérer de nouveaux lots avant la publication, et attribuer TF-1736 à un autre sujet.
  - signal : une création TF-1736 dans le registre publié qui n'est pas la nôtre ;
  - parade : D-1, puis renumérotation par `todo/renumeroter.mjs` à la fusion si la collision a eu lieu.
- Produit-12 peut à nouveau émettre depuis ses deux postes sous le même nom de lot.
  - signal : un conflit « add/add » sur un lot à la prochaine fusion ;
  - parade : TF-1736 option (a), qui rend le produit identique sur ses postes.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier les 3 enregistrements avec votre feu vert cité | `auto_ia` | TF-1736 | `dependance_bloc_3` — D-1 | l'autre poste ne voit rien |
| **A-2** | Poser l'effort choisi, puis clore TF-1557 ou réviser la table | `auto_ia` | TF-1557 | `dependance_bloc_3` — D-2 | MS5 reste rouge |
| **A-3** | Décider et traiter TF-1736 selon l'option choisie | `auto_ia` | TF-1736 | `dependance_bloc_3` — D-3 | la reprise reste manuelle |
| **A-4** | Répondre à D-1, D-2 et D-3 | `manuelle_utilisateur` | TF-1736 | `decision` | les 3 bloquants restent en place |

## 9. Traces

`todo/TODO.jsonl`, `todo/HERITAGE-RELEVES.jsonl`, `input/00-retours/Produit-12 - RETOURS - 20261014b.md` et son sidecar, synthèse du 14/10 réindexée `… - 20261014b.md`, enregistrements `2ffb218f` et `d5269a8f` (locaux).
