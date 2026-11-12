## 0. Synthèse d'ouverture

Vos 3 demandes sont faites. La sauvegarde corrigée de Produit-02 est publiée et a tourné pour de vrai : 115 fichiers copiés et vérifiés, aucune clé de secret perdue. La campagne a clos ses 8 sujets dans 4 dépôts, rejoués par moi puis publiés. Le tri a décidé 5 candidats sur 6. Le sixième demande d'écrire chez Produit-02 hors d'un run : il vous revient, avec une recommandation ci-dessous.

Livré : [synthèse de la nuit du 12/11](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20A1%20A2%20A3%20de%20la%20nuit%20du%2012-11%20-%2020261112k.md)

## 1. En-tête d'identification

Synthèse du mandat « A1, A2, A3 », sur le pilot, 3 forges et le produit Produit-02, le 12/11/2026 à 22:52, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de publier la sauvegarde corrigée du produit et de la faire tourner, de corriger les 8 sujets triés au tour précédent, et de trier les 6 candidats nés de la dernière campagne. Test rétro : la sauvegarde rend COMPLET sur le poste, chaque sujet finit clos sur une recette rejouée par le pilot, et tout ce qui écrit chez le produit hors de votre demande vous est posé.

## 3. Décisions attendues

Les bloquants qui retiennent la suite :
- la remise en conformité de Produit-02, qui attend votre réponse à la décision ci-dessous.

> **D-210 — Faut-il ouvrir un run chez Produit-02 pour remplir son fichier d'instructions resté au gabarit et réparer son journal de versions, que l'oracle de conformité juge en échec ?**
> - **De quoi s'agit-il** : le fichier d'instructions qu'une session lit en entrant chez le produit (`CLAUDE.md`), et le journal qui consigne ses versions (`forge/ledger.jsonl`). Le premier porte encore les trous du gabarit, le second a une ligne réécrite alors qu'il ne doit qu'être complété.
> - **Le problème** : rejoué ce soir en lecture, l'oracle de conformité rend 114 échecs et 78 réussites chez le produit. Le gros des échecs vient de noms de fichiers hors convention : 59 sur la règle des dossiers et 16 sur les types de documents. Trois touchent le cœur : le fichier d'instructions, 3 variables non documentées et le journal rompu.
> - **Pourquoi vous** : la correction écrit chez un produit autonome hors d'un run que vous avez demandé, et cela vous revient.
> - **Recommandation : (a)** — chaque session qui entre chez le produit lit aujourd'hui un fichier d'instructions vide, et le run borné ne touche ni ses documents ni ses noms de fichiers. Source consultée : la sortie de l'oracle de conformité rejouée ce soir sur le produit.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Run borné | je remplis le fichier d'instructions, je documente les 3 variables et je répare le journal ; commits locaux, l'envoi reste votre geste | un run court ; les 111 autres échecs restent listés | annuler les commits locaux |
| (b) Run complet | même chose, plus le renommage des fichiers hors convention, dont 75 documents | un run long qui renomme des livrables déjà remis | revenir aux anciens noms par git |
| (c) Rien ne change | le sujet reste candidat jusqu'au prochain run que vous demanderez chez le produit | les sessions du produit gardent un fichier d'instructions vide | trancher plus tard |

> **Sans réponse** : rien n'est écrit chez le produit, et le sujet reste au registre en attente de votre choix.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

- A-1, Produit-02 (TF-2439) : ses 2 commits, rebasés sur 2 commits distants sans fichier commun, sont publiés ; le dépôt distant est à jour. Le banc de la sauvegarde a été rejoué avant l'envoi à 25 constats verts. La première sauvegarde réelle a trouvé sa destination dans la liste d'emplacements, rafraîchi 2 fichiers et vérifié 115 empreintes sur 115 : COMPLET.
- A-2, pilot (TF-2462 à TF-2465) : au pilot, un commit se vérifie par les recettes des fichiers touchés et de leurs consommateurs, la recette entière restant due avant la fusion. Une commande longue se lance en arrière-plan et s'attend par tranches bornées. Le référentiel des niveaux nomme `--prejuger`. Les sources de la relecture d'intention passent de 29 avertissements à 1. La fusion a résolu un conflit avec un commit d'une autre session, qui couvrait déjà la commande longue ; recettes rejouées vertes : 90, 29, 26 et 22 cas.
- A-2, forge-agents (TF-2458, TF-2459) : les gabarits de schémas déclarent leur schéma de couleurs par thème ; leur recette passe de 6 rouges à 31 contrôles verts. La recette du socle des pages instancie le pied de page avec une signature de test : 847 cas sur 847. Le socle passe en 1.46.1, et les skills sont propagés au poste.
- A-2, forge-design (TF-2461) : le rendu ne choisit plus son interpréteur Python selon le dossier de lancement, et le rapport nomme celui qui a joué. Recette rejouée : 81 oracles et 190 règles, tout vert.
- A-2, forge-websec (TF-2460) : le référentiel des cas de test dit ce que couvre le mode actif du balayage dynamique, et sous quelle autorisation. Recette rejouée : 236 PASS contre 231 avant, 0 FAIL.
- A-3, tri : 5 candidats décidés par le pilot sans ressort humain ; le sixième devient la décision D-210.
- Les restes des agents deviennent 11 candidats, de TF-2473 à TF-2483. Le plus sérieux : un produit qui comptait sur l'ancien repli de l'interpréteur rend désormais un rendu non joué tant qu'il ne pose pas la variable.
- Un commit déjà enregistré par une autre session, le suivi des agents, part avec la publication du pilot.

Relecture d'intention : sert.

## 5. Non traité

- La remise en conformité de Produit-02 — motif : decision, elle écrit chez le produit hors d'un run demandé (D-210).
- 3 classeurs de gestion restés sur le Drive alors qu'ils n'existent plus sur le poste — motif : decision, les supprimer est un geste irréversible que la sauvegarde laisse à vous.

## 8. Prochaines actions

Trois actions suivent, dont une vous revient.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Choisir l'étendue de la remise en conformité de Produit-02 | TF-2470 | manuelle_utilisateur | decision | répondre `210a`, `210b` ou `210c` dans cette conversation | si rien n'est fait, les sessions du produit gardent un fichier d'instructions vide |
| A-2 | Lancer la campagne qui corrige les 5 candidats décidés au tri, dont l'hameçon d'anonymisation et les noms accentués | TF-2471 | auto_ia | hors_mandat : la demande portait sur leur tri | `todo/TODO.jsonl`, décisions du 12/11 ; agents de campagne en arbres de travail | si rien n'est fait, un nom réel peut passer dans un fichier au nom accentué |
| A-3 | Trier les 11 candidats nés de cette campagne | TF-2473 | auto_ia | hors_mandat : nés pendant ce tour | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, un produit peut rendre un rendu non joué sans savoir pourquoi |

Ordre : votre décision d'abord, parce qu'elle seule attend un humain ; la campagne ensuite, parce qu'elle ferme une fuite possible de nom réel ; le tri en dernier, parce qu'il ne bloque rien.

## 9. Traces

- Produit-02 : 8a15a1a3 publié, vérifié par `git rev-list --count origin/main..main` à 0 ; sauvegarde COMPLET, 115 sur 115.
- Forges publiées et vérifiées par rev-list à 0 : forge-websec 4848385, forge-design b6ebb1a, forge-agents 97e72ae.
- Pilot : la fusion du lot pj, 53f38801, publiée avec le commit de ce tour ; `gabarits/HERITAGE.json` en 1.62.0.
- `todo/TODO.jsonl` : 5 décisions de tri, 8 clôtures, 2 notes, 11 candidats ; oracle du registre PASS après chaque écriture. `todo/relectures-intention.jsonl` : la relecture RI-20261112-15. `decisions/REGISTRE.jsonl` : la réservation de D-210.
