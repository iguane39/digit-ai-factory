## 0. Synthèse d'ouverture

Vos 3 demandes sont faites. Chez le produit Produit-02, la sauvegarde ne perd plus de clé de secret et trouve sa destination seule sur ce poste. Ces 2 commits restent locaux : leur envoi vous revient. La campagne A-2 a clos ses 11 sujets dans 5 dépôts, rejoués par moi et publiés. Le premier, l'hameçon d'anonymisation du pilot, ne peut plus emporter dans un commit les lignes d'une autre session. Le tri A-3 a décidé les 8 candidats. Rien n'attend de décision de votre part.

## 1. En-tête d'identification

Synthèse du mandat « A1, A2, A3 », sur le pilot, 4 forges et le produit Produit-02, le 12/11/2026 à 20:09, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de câbler chez le produit la sauvegarde décidée par D-208 (a), de corriger les 11 candidats triés, et de trier les 8 suivants. Test rétro : chaque sujet finit clos sur une recette rejouée par le pilot, et ce qui touche le produit reste local jusqu'à votre envoi.

## 3. Décisions attendues

Rien n'attend de décision nouvelle de votre part : ce tour exécute vos 3 demandes.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

Six agents ont travaillé chacun dans son arbre ; 3 se sont figés et ont été relancés, et j'ai rejoué chaque lot avant de le publier.
- Produit-02, A-1 (TF-2439, TF-2440) : les 3 scripts de sauvegarde lisent leur destination dans une variable de poste, puis dans une liste d'emplacements. La sauvegarde des fichiers de secrets passe par le script de fusion : 0 clé perdue, contre 1 perdue en silence par l'ancienne copie qui affichait COMPLET. Banc du produit rejoué à 25 constats verts. Ses 2 commits sont sur son main local, non publiés.
- Pilot (TF-2457, TF-2447, TF-2451) : l'hameçon d'anonymisation ne lit et n'écrit plus que l'index, avec 17 cas verts au lieu de 12. Le contrôle de nommage lève 8 refus à tort sur des noms réels. La porte de MEP cite O-30 et O-31. Conformité rejouée à 241 PASS, 0 FAIL.
- forge-agents (TF-2450, TF-2452, TF-2453, TF-2454) : l'audit de dépendances nomme chaque avis avec sa version et sa sévérité. 104 oracles du pilot et des forges sont inscrits ou déclarés hors registre. quality-oracles est rejoué à 767 contrôles, et les skills sont propagés au poste.
- forge-tests (TF-2448, TF-2449) : le dashboard déclare color-scheme par thème, et un oracle qui rend SKIP n'est plus compté joué ; 18 tests ciblés rejoués verts.
- forge-websec (TF-2455) : pip-audit est épinglé et son délai unifié ; 231 PASS, 0 FAIL, 0 SKIP.
- forge-organization (TF-2456) : le gabarit A0 couvre 38 règles de lisibilité sur 38, contre 14 avant ; recette rejouée verte.
- Tri A-3 : 8 candidats décidés sous R-58. La consigne de la campagne a été relue « sert », sans écart.
- Les restes des agents deviennent 6 candidats, de TF-2466 à TF-2471. Le plus sérieux : l'hameçon d'anonymisation ne juge jamais un fichier dont le nom porte un accent.
- 4 commits déjà enregistrés d'une autre session sont partis avec la publication du pilot.

Relecture d'intention : sert.

## 5. Non traité

- L'envoi des 2 commits de Produit-02 vers son dépôt distant — motif : decision, la publication d'un produit est votre geste.

## 8. Prochaines actions

Trois actions suivent, dont une vous revient.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Relire puis publier les 2 commits de Produit-02, et lancer sa première sauvegarde réelle | TF-2439 | manuelle_utilisateur | decision | dans le dossier du produit : `git log origin/main..main`, puis `git push`, puis `python build/sauvegarde-drive.py` | si rien n'est fait, la sauvegarde corrigée ne tourne jamais et l'ancienne copie reste la seule publiée |
| A-2 | Lancer la campagne qui corrige les 8 candidats triés en A-3 | TF-2458 | auto_ia | hors_mandat : la demande portait sur leur tri | `todo/TODO.jsonl`, décisions du 12/11 ; agents de campagne en arbres de travail | si rien n'est fait, les rouges de digit-ai-schemas restent au self-test |
| A-3 | Trier les 6 candidats nés de cette campagne, dont l'hameçon et les noms accentués | TF-2471 | auto_ia | hors_mandat : nés pendant ce tour | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, un nom réel peut passer dans un fichier au nom accentué |

Ordre : votre publication d'abord, parce que la sauvegarde corrigée n'agit qu'après elle ; la campagne ensuite ; le tri en dernier, parce qu'il ne bloque rien.

## 9. Traces

- Forges publiées et vérifiées par `git rev-list --count origin/main..main` à 0 : forge-organization 8772869, forge-websec e7282e7, forge-agents 069342f, forge-tests 2c1a45b.
- Pilot : la fusion du lot pi, ab4a0e20, publiée ; le commit de ce tour part avec cette synthèse.
- Produit-02 : e8289418 et 9c127446 sur son main local, non publiés.
- `todo/TODO.jsonl` : 8 décisions de tri, 12 clôtures et une note, 6 candidats ; oracle du registre PASS après chaque écriture. `todo/relectures-intention.jsonl` : la relecture RI-20261112-11.
