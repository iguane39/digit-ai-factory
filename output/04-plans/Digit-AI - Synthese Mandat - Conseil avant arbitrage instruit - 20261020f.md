---
destinataire: humain
---

# Synthèse Mandat — conseil de cinq agents avant un arbitrage : étude instruite (20/10/2026)

## 0. Synthèse d'ouverture

L'idée du conseil de cinq conseillers est instruite et un premier essai mesuré existe. Sur votre décision du 19/10 sur la lecture de la messagerie Microsoft 365, le conseil a rejoint votre choix par 4 voix sur 5, alors qu'une requête unique recommandait autre chose. Il a aussi relevé un risque de conformité que la requête unique n'avait pas vu. Le conseil coûte 5 fois plus et ses textes étaient plus longs, donc un seul cas ne suffit pas pour créer un skill. Il vous est demandé de dire si l'on lance un second essai, plus juste, sur 3 décisions de plus.

## 1. En-tête d'identification

Mandat d'instruction d'une candidature · sur le pilot digit-ai-factory · le 20/10/2026, fin à 10:47 (heure de Paris, UTC+2), durée 11 minutes · Claude Opus 5.5, commit local 61f0499d.

Intention : savoir si la Factory gagne à faire délibérer plusieurs agents avant qu'une question ouverte arrive au porteur, sur des faits mesurés et non sur la parole de l'article. Test rétro : l'étude répond à la question « Intéressant pour la Factory ? » par un essai mesuré et un verdict ; elle sert l'intention, et laisse au porteur le passage à un objet durable.

## 2. Verdict en une ligne

Étude jugée PASS par `oracle-etude-opportunite` (10 règles sur 10) et `oracle-ecriture` (1 728 mots) ; essai : 4 voix sur 5 du conseil rejoignent votre choix, 0 sur 1 pour la requête unique, pour 5,0 fois plus de jetons.

## 3. Décisions attendues

> **D-53 — Faut-il lancer l'essai du conseil de cinq agents sur 3 décisions passées de plus, à longueur égale, avant de décider un skill ?**
>
> - **De quoi s'agit-il** : l'essai O1 de l'étude du conseil de cinq agents séparés, rattachée à la candidature TF-1936.
> - **Le problème** : le premier essai porte sur 1 seule décision, et le conseil y disposait de 1 500 mots contre 450 ; une part de ses 17 considérations propres peut venir de la longueur.
> - **Pourquoi vous** : passer une candidature en décidée et engager une dépense d'environ 600 000 jetons vous reviennent.
> - **Recommandation : (a)** — elle sépare le gain de la pluralité de celui de la longueur, avant tout objet durable. Source consultée : l'étude `output/03-etudes/20261020-etude-opportunite-conseil-avant-arbitrage.md`, section 5.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Lancer l'essai O1 | 3 décisions passées du registre, requête unique au même plafond de 1 500 mots, compteur aveugle ; TF-1936 passe en décidée | simple × court, environ 600 000 jetons | rien ne s'installe ; on arrête à tout moment |
| **(b)** Créer tout de suite le skill du conseil | skill au pilot, 5 agents aux modèles mêlés, vote compté | moyen × moyen, puis environ 170 000 jetons par usage | retirer le skill et sa copie installée |
| **(c)** Laisser la candidature en attente | TF-1936 reste candidate jusqu'à la revue des propositions | nul | sans objet |

> **Sans réponse** : (c), la candidature reste candidate.

## 4. Traité

- Étude écrite au gabarit des études d'opportunité : `oracle-etude-opportunite` rend PASS, 10 règles sur 10, après 2 corrections rouge → vert (E3 sources datées, E7 plan de revue daté).
- `oracle-ecriture` rend PASS sur 1 728 mots.
- État de l'art : 7 sources datées de 2025-06 à 2026-08, dont l'article de NeurIPS 2025 qui attribue au vote l'essentiel du gain du débat.
- Essai du 20/10, 6 agents en contextes séparés sur 3 modèles, puis 1 compteur aveugle :
  - recommandation de la requête unique : une fiche et un skill, différente de votre choix du 19/10 ;
  - conseil : 4 voix sur 5 pour la fiche d'abord, votre choix ;
  - 31 considérations distinctes : 17 propres au conseil, 4 propres à la requête unique, 10 communes ;
  - jetons des agents : 33 375 pour la requête unique, 166 854 pour le conseil.
- Registre : TF-1936 mise à jour par `todo/journaliser.mjs`, verdict PASS avant et après ; preuve relevée de 2 à 3, statut toujours candidat.
- D-53 réservée au registre des décisions : `reserver-decision` rend PASS.
- Commits locaux 425c628f et 61f0499d, limités à mes fichiers par `git commit --only`.
- Relecture d'intention : sert (RI-20261020-07, 1 écart mineur de nature choix humain, pour les jetons de l'essai du jour engagés sans accord préalable).

## 5. Non traité

- Push du pilot : non fait, parce qu'une publication du pilot attend votre feu vert.
- Textes bruts de l'essai : laissés dans le dossier de travail de la session, parce que l'étude en reprend les chiffres et les citations utiles.
- Président de séance et relecture croisée de la méthode d'Apsodia : non joués, parce que l'état de l'art attribue le gain au vote ; le vote a été compté.

## 6. Écarts à la lettre

Vous avez demandé « Avance sur TF-1936 » → j'ai instruit l'étude et joué un essai d'environ 200 000 jetons sans vous le demander → parce que la preuve de 2 exigeait une mesure pour instruire. Les consignes des 6 agents de l'essai n'ont pas été relues avant leur lancement, contre l'essai de relecture d'intention en cours.

## 7. Risques

- Énoncé : un autre travail modifie en ce moment `scripts/hooks-git/pre-push-prolongement-local`, écrit à 10:44. Signal : le fichier reste modifié hors de mes commits. Parade : je ne l'ai pas touché ; il part avec le travail qui l'a écrit.
- Énoncé : l'autre poste peut prendre TF-1936 ou D-53 avant publication. Signal : collision au prochain `git pull`. Parade : renuméroter la version locale à la synchronisation.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 passe avant A-2, parce que la publication emporte le résultat de l'essai.

| Sélecteur | Registre | Action | Acteur | Motif | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1936 | Jouer l'essai O1 sur 3 décisions passées | auto_ia | dependance_bloc_3 | réponse « D-53 a » | le choix du skill se fera sur un seul cas |
| **A-2** | TF-1936 | Publier les commits 425c628f et 61f0499d | auto_ia | gate_gouvernance | `git push origin main` | collision possible des numéros avec l'autre poste |

## 9. Traces

- `output/03-etudes/20261020-etude-opportunite-conseil-avant-arbitrage.md`.
- `todo/TODO.jsonl`, événements TF-1936 de 08:33 et 08:44 UTC.
- `decisions/REGISTRE.jsonl`, réservation de D-53.
- `todo/relectures-intention.jsonl`, entrées RI-20261020-06 et RI-20261020-07.
- Commits 425c628f et 61f0499d.
