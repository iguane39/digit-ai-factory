## 0. Synthèse d'ouverture

Vos 2 demandes sont faites. La campagne a clos 9 des 10 sujets, rejoués par moi puis publiés dans 5 dépôts. Le dixième est fait côté pilot ; sa part dans forge-agents reste ouverte. La flotte d'agents du pilot passe maintenant l'oracle des définitions d'agent, et l'oracle des expressions régulières rend PASS sur tout le parc. Le tri a décidé les 9 candidats. Aucune décision ne vous attend.

Livré : [synthèse de l'après-midi du 13/11](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20A1%20et%20A2%20de%20l%20apres-midi%20du%2013-11%20-%2020261113h.md)

## 1. En-tête d'identification

Synthèse du mandat « A1 & A2 », sur le pilot et 4 forges, le 13/11/2026 à 18:01, par l'orchestrateur du pilot (Claude Opus 5.5). L'intention est de corriger les 10 sujets décidés au tour précédent et de trier les 9 candidats nés de la campagne d'avant. Test rétro : chaque sujet finit clos sur une recette rejouée par le pilot, ou reste ouvert avec ce qui manque, et le registre ne garde aucun candidat de ce tri.

## 3. Décisions attendues

Aucune décision nouvelle n'est posée dans ce tour.

D-180 : moment de traiter les 7 sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

- A-1, pilot (TF-2487) : la flotte de 5 agents se compile sous l'oracle des définitions d'agent. Un constat non déclaré bloque l'installation. Les 4 constats relevés sont déclarés et motivés par l'emploi mesuré de chaque outil sur 30 jours. J'ai rejoué le compilateur sur main : PASS.
- A-1, pilot (TF-2496, classe garde-lexicale-frontiere-ascii) : 3 expressions mortes sont corrigées, dont 1 dans forge-audit, que j'ai corrigée moi-même. Avant, « 1.2 à confirmer » n'était pas reconnu ; après, il l'est. L'oracle ne compte plus 4 expressions justes. Rejoué sur main : PASS sur 1 482 fichiers de 16 dépôts, contre 66 constats avant.
- A-1, pilot (TF-2489, TF-2495, TF-2488, TF-2494) : les étapes de run nomment l'oracle des dépendances. L'oracle de conformité lit les familles de dossiers de sortie. Il signale un journal de page qui consigne un échec. Le relevé d'appelants nomme la nature de chaque appel. Le journal de versions hérité accepte son remède. Recette de conformité : 254 cas, contre 241 avant.
- A-1, forge-agents (TF-2492, TF-2493, TF-2488) : chaque règle de lisibilité a son propre identifiant. Un manifeste de versions en retard rend la recette rouge, et chaque oracle hors registre nomme la nature de son appel. Rejoué : 778 contrôles PASS, et 863 cas sur 864 au socle des pages. Le seul rouge est un cas instable sous charge, vert 3 fois sur 3 rejoué seul.
- A-1, forge-websec (TF-2490) et forge-design (TF-2491) : le README ne porte plus de compte en dur, et les skills de design prescrivent le lanceur. Rejoué : 281 PASS, et 81 oracles et 190 règles tout vert.
- A-2, tri : les 9 candidats sont décidés par le pilot, sans ressort humain.
- La référence des comptes de recettes (TF-2480) suit 7 comptes, mesurés à la fusion, sans aucune baisse.
- Les restes des agents deviennent 10 candidats, de TF-2506 à TF-2515. Le plus sérieux : aucun contrôle ne lit le paramètre qui rend bloquant le gate de sécurité d'un produit.

Relecture d'intention : sert.

## 5. Non traité

- La part de TF-2494 dans forge-agents : l'écrivain du journal en Node refuse encore le remède — motif : hors_mandat, la consigne bornait le lot au pilot.
- Les 24 échecs restants chez Produit-02 — motif : decision. Il y a 8 noms de photos que citent des prompts remis, 12 indices partagés et 15 sauts du journal de versions.
- 3 classeurs de gestion restés sur le Drive alors qu'ils n'existent plus sur le poste — motif : decision, les supprimer est un geste irréversible que la sauvegarde vous laisse.

## 8. Prochaines actions

Deux actions suivent, toutes deux automatiques.

| Sélecteur | Action | Identifiant | Acteur | Motif de non-exécution | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lancer la campagne qui corrige les 9 candidats décidés au tri, avec la part restante de TF-2494 | TF-2497 | auto_ia | hors_mandat : la demande portait sur leur tri | `todo/TODO.jsonl`, décisions du 13/11 ; agents de campagne en arbres de travail | si rien n'est fait, le balayage passif continue de soumettre les formulaires des cibles |
| A-2 | Trier les 10 candidats nés de cette campagne | TF-2506 | auto_ia | hors_mandat : nés pendant ce tour | `node todo/journaliser.mjs --fichier <décisions.json>` | si rien n'est fait, le contrôle de sécurité avant mise en production d'un produit reste non bloquant sans qu'aucun contrôle le dise |

Ordre : la campagne d'abord, parce qu'elle ferme une soumission de formulaires non voulue ; le tri ensuite, parce qu'il ne bloque rien.

## 9. Traces

- Forges publiées et vérifiées par `git rev-list --count origin/main..main` à 0 : forge-websec d075157, forge-design 438dff8, forge-agents 4f781cb, forge-audit 89570e2.
- Pilot : la fusion des lots pc et pd et la remontée du cliquet, a86f397d, publiées avec le commit de ce tour ; héritage en 1.63.0 ; skills propagés au poste, verdict PASS.
- `todo/TODO.jsonl` : 9 décisions de tri, 9 clôtures, 1 note, 10 candidats ; oracle du registre PASS après chaque écriture. `todo/relectures-intention.jsonl` : la relecture RI-20261113-05.
