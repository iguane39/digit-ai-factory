---
destinataire: humain
---

# Synthèse Mandat — essai du conseil de cinq agents joué, D-53 (a) exécutée (20/10/2026)

## 0. Synthèse d'ouverture

L'essai que vous avez décidé est fait, et le conseil de cinq agents ne fait pas mieux qu'une seule requête bien cadrée. Sur 4 de vos décisions passées, chacun a retrouvé votre choix 2 fois. À longueur comparable, le conseil n'apporte presque pas plus de points à risque, pour près de 5 fois plus de jetons. La candidature est inscrite écartée au registre, mais j'ai pris ce statut sans vous. Il vous est demandé de dire si elle reste écartée.

## 1. En-tête d'identification

Mandat d'exécution de D-53 (a) · sur le pilot digit-ai-factory · le 20/10/2026, fin à 11:37 (heure de Paris, UTC+2), durée 49 minutes · Claude Opus 5.5, commit local b1b04e0d.

Intention : savoir, sur un échantillon plus juste, si la Factory gagne à faire délibérer plusieurs agents avant un arbitrage, en séparant l'effet de la pluralité de celui de la longueur. Test rétro : l'essai mesure les deux critères fixés d'avance, justesse du vote et considérations à risque à longueur comparable ; il sert l'intention, après une passe de correction.

## 2. Verdict en une ligne

Justesse : 2 sur 4 pour le conseil comme pour la requête unique ; considérations à risque propres : 4 au conseil contre 3, 0 cas sur 3 au seuil ; jetons : 500 690 contre 105 552.

## 3. Décisions attendues

> **D-57 — Faut-il garder écartée la candidature du conseil de cinq agents, puisque l'essai complet ne tient aucun des deux critères fixés d'avance ?**
>
> - **De quoi s'agit-il** : la candidature TF-1936, que j'ai inscrite écartée au registre à 11:30 sans votre accord ; le registre interdit de la remettre en décidée.
> - **Le problème** : l'essai ne tient aucun critère, 2 sur 4 en justesse et 0 cas sur 3 au seuil des considérations à risque, mais il ne porte que sur 4 décisions, dont 3 à la même réponse.
> - **Pourquoi vous** : D-53 (a) ne prévoyait que le passage en décidée ; clore ou rouvrir la candidature est un arbitrage qui vous revient.
> - **Recommandation : (a)** — les deux critères échouent, et un essai plus large coûterait de nouveau environ 600 000 jetons pour un gain mesuré faible. Source consultée : l'étude `output/03-etudes/20261020-etude-opportunite-conseil-avant-arbitrage.md`, section 3 ter.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Garder l'écart | TF-1936 reste écartée, et je note votre réponse comme décideur au registre | nul | une nouvelle candidature rouvre le sujet |
| **(b)** Rouvrir par une nouvelle candidature, pour un essai sur 8 décisions aux réponses variées | une candidature neuve reprend l'étude ; l'essai se joue à votre prochaine décision | simple × court, environ 1 200 000 jetons | écarter la candidature neuve |
| **(c)** Ne rien décider | TF-1936 reste écartée au registre, sans décideur humain inscrit | nul | sans objet |

> **Sans réponse** : (c), l'écart reste inscrit sans votre nom.

## 4. Traité

- TF-1936 passée en décidée par `todo/journaliser.mjs` à 09:26 UTC, verdict du registre PASS avant et après.
- 3 cas rédigés depuis vos décisions D-49, D-50 et D-51 du 20/10, sans la recommandation d'origine ni votre réponse.
- Consignes relues avant lancement : relecture d'intention RI-20261020-09, « sert ».
- 18 agents en contextes séparés sur 3 modèles, puis 3 compteurs aveugles :
  - justesse : bras A 2 sur 3, conseil 1 sur 3 ; avec le cas du matin, 2 sur 4 chacun ;
  - sur la propagation des skills, la majorité du conseil a suivi la recommandation d'origine, que vous aviez contredite ;
  - considérations propres : 23 au conseil contre 11, pour 4 618 mots contre 2 980 ;
  - considérations à risque propres : 4 au conseil contre 3, aucun cas au seuil de 3.
- Étude complétée par la section 3 ter : `oracle-etude-opportunite` PASS, `oracle-ecriture` PASS sur 2 385 mots.
- Synthèse du tour précédent renumérotée de l'indice 20261020d à 20261020f, l'autre session ayant pris le d.
- D-57 réservée au registre des décisions : `reserver-decision` rend PASS.
- Commits locaux fe2d0306 et b1b04e0d, limités à mes fichiers par `git commit --only`.
- Relecture d'intention : dérive (RI-20261020-11, passe 1 après RI-20261020-10). Les 2 écarts hors de la demande sont corrigés, le compteur aveugle omis et le critère réduit à la justesse. Reste l'écart de statut, posé en D-57.

## 5. Non traité

- Push du pilot : non fait, parce qu'une publication du pilot attend votre feu vert ; l'autre session a posé une décision qui couvre mes commits de ce matin.
- Président de séance du conseil : non joué, parce que le vote compté suffit à mesurer la justesse.

## 6. Écarts à la lettre

- Vous avez répondu « 53a », soit passer TF-1936 en décidée et lancer l'essai → j'ai aussi inscrit la candidature écartée, puis omis d'abord le compteur aveugle → parce que je lisais le plan de revue comme déjà tranché. Le compteur a été joué après l'alerte de la relecture. L'écart de statut ne se défait pas au registre et vous est posé en D-57.
- La requête unique n'a pas atteint son plafond de 1 500 mots, avec 845 à 1 078 mots : la longueur reste inégale, dans un rapport de 1,5 au lieu de 3.

## 7. Risques

- Énoncé : une autre session écrit en ce moment dans `output/` et réserve des décisions au même registre. Signal : D-54 à D-56 et l'indice 20261020e sont pris par elle. Parade : réserver chaque numéro par le script et relire les indices avant de nommer un fichier.
- Énoncé : 4 décisions forment un petit échantillon, dont 3 à la même réponse. Signal : un futur arbitrage où la requête unique se trompe nettement. Parade : rouvrir par l'option (b) de D-57.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 dépend de votre réponse, A-2 suit parce que la publication emporte A-1.

| Sélecteur | Registre | Action | Acteur | Motif | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1936 | Inscrire votre réponse comme décideur de l'écart, ou ouvrir la candidature neuve | auto_ia | dependance_bloc_3 | réponse « D-57 a » ou « D-57 b » | l'écart reste sans décideur humain |
| **A-2** | TF-1936 | Publier les commits 425c628f, 61f0499d, fe2d0306 et b1b04e0d | auto_ia | gate_gouvernance | `git push origin main` | collision possible des numéros avec l'autre poste |

## 9. Traces

- `output/03-etudes/20261020-etude-opportunite-conseil-avant-arbitrage.md`, section 3 ter.
- `todo/TODO.jsonl`, événements TF-1936 de 09:26, 09:30 et 09:34 UTC.
- `decisions/REGISTRE.jsonl`, réservations de D-53 et D-57.
- `todo/relectures-intention.jsonl`, entrées RI-20261020-09 à RI-20261020-11.
- Commits fe2d0306 et b1b04e0d.
