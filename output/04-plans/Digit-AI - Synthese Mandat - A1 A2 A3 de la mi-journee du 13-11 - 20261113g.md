## 0. Synthèse d'ouverture

Vos 3 demandes sont faites. Les 14 commits de Produit-02 sont publiés, relus avant l'envoi : aucun secret, aucun trou de gabarit. La campagne a clos ses 11 sujets dans 4 dépôts, rejoués par moi puis publiés. Les 2 oracles de chemin du pilot rendent maintenant PASS sur main. Le tri a décidé les 10 candidats. Aucune décision ne vous attend dans ce tour.

Livré : [synthèse de la mi-journée du 13/11](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20A1%20A2%20A3%20de%20la%20mi-journee%20du%2013-11%20-%2020261113g.md)

## 1. En-tête d'identification

Synthèse du mandat « A1, A2, A3 », sur le pilot, 3 forges et le produit Produit-02, le 13/11/2026 à 13:46, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de publier Produit-02 après relecture, de corriger les 11 sujets décidés au tour précédent et de trier les 10 candidats nés de la campagne d'avant. Test rétro : le dépôt distant du produit porte les 14 commits, chaque sujet finit clos sur une recette rejouée par le pilot, et le registre ne garde aucun candidat de ce tri.

## 3. Décisions attendues

Aucune décision nouvelle n'est posée dans ce tour.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

- A-1, Produit-02 (TF-2470) : la recherche de fichiers sensibles et de motifs de secret dans le diff rend 0, comme celle des trous de gabarit. Les 14 commits sont envoyés, et le dépôt distant est à e9e75353.
- A-2, pilot (TF-2479 à TF-2483, TF-2473) : les oracles de chemin prescrit et de chemin ancré rendent PASS sur main, contre 31 commandes introuvables et 6 constats avant. Les sources de la relecture se recalent en une commande. Une recette jouée dans un arbre de campagne ne réécrit plus la référence du cliquet. J'ai remonté cette référence sur 7 comptes mesurés. Recette entière des 2 lots : 262 recettes sur 262 chacune.
- A-2, forge-agents (TF-2474, TF-2475, TF-2478) : la recette du socle des pages rejoue celle des schémas, et l'exception de décodage a disparu. Un skill livré sans version est refusé. Rejoué : 861 cas sur 861, et 776 contrôles PASS.
- A-2, forge-websec (TF-2476, TF-2477) : l'image ZAP est épinglée par empreinte, et la règle levée le 12/11 hors de l'image n'apparaît plus. Le référentiel nomme les règles du mode passif. Le conflit avec le travail d'une autre session est résolu par l'agent. Rejoué : 277 PASS.
- A-2, forge-design (TF-2473) : le rendu sauté dit au produit quelle commande pose sa variable. Rejoué : 81 oracles et 190 règles, tout vert.
- A-3, tri : les 10 candidats sont décidés par le pilot, sans ressort humain. Le commit d'une autre session a publié ces décisions avec le registre entier.
- Les restes des agents deviennent 9 candidats, de TF-2497 à TF-2505. Le plus sérieux : le mode passif du balayage dynamique soumet les formulaires qu'il trouve.
- Incident : j'ai lancé par erreur la recette entière dans l'arbre principal du pilot. Je l'ai arrêtée, aucun processus ne reste et aucun fichier n'a changé.

Relecture d'intention : sert.

## 5. Non traité

- Les 24 échecs restants chez Produit-02 — motif : decision. Il y a 8 noms de photos que citent des prompts remis, 12 indices partagés et 15 sauts du journal de versions.
- 3 classeurs de gestion restés sur le Drive alors qu'ils n'existent plus sur le poste — motif : decision, les supprimer est un geste irréversible que la sauvegarde vous laisse.

## 8. Prochaines actions

Deux actions suivent, toutes deux automatiques.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lancer la campagne qui corrige les 10 candidats décidés au tri, dont les agents du pilot jugés en échec | TF-2487 | auto_ia | hors_mandat : la demande portait sur leur tri | `todo/TODO.jsonl`, décisions du 13/11 ; agents de campagne en arbres de travail | si rien n'est fait, 4 des 5 agents du pilot restent en échec à l'oracle des définitions d'agent |
| A-2 | Trier les 9 candidats nés de cette campagne | TF-2497 | auto_ia | hors_mandat : nés pendant ce tour | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, le balayage passif continue de soumettre les formulaires des cibles |

Ordre : la campagne d'abord, parce qu'elle touche la flotte d'agents du pilot ; le tri ensuite, parce qu'il ne bloque rien.

## 9. Traces

- Produit-02 : e9e75353 publié, vérifié par `git rev-list --count origin/main..main` à 0.
- Forges publiées et vérifiées par rev-list à 0 : forge-design 36ec68f, forge-websec ce9c4df, forge-agents 237d3ee.
- Pilot : la fusion des lots pa et pb et la remontée du cliquet, 1f2ab3fa, publiées avec le commit de ce tour ; skills propagés au poste, verdict PASS.
- `todo/TODO.jsonl` : 10 décisions de tri, 11 clôtures, 9 candidats ; oracle du registre PASS après chaque écriture. `todo/relectures-intention.jsonl` : la relecture RI-20261113-03.
