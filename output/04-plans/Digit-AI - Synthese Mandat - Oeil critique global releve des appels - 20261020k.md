---
destinataire: humain
---

# Synthèse Mandat — l'étude de l'œil critique global reçoit le relevé des appels : aucun process abandonné, 5 documents jamais lus (20/10/2026)

## 0. Synthèse d'ouverture

Le dernier relevé de l'étude est arrivé, et il précise le diagnostic. Les process de la Factory ne sont pas abandonnés : sur plus de 600, aucun de ceux que la Factory suit n'est resté sans usage en 30 jours. Le coût vient donc de leur taille et de leur nombre, pas de reliquats à balayer. 5 documents de référence n'ont pourtant été lus par aucune session en un mois, dont le gabarit qui sert à recueillir vos insatisfactions. Cela renforce le scénario qui transforme vos reprises en insatisfactions suivies. La décision posée tout à l'heure reste la même et vous revient toujours.

## 1. En-tête d'identification

Complément de l'étude de l'œil critique global, sur réception du relevé des appels des process, délégué à un `explorateur`. Pilot digit-ai-factory, poste Dell-XPS-16. Période : 20/10/2026, de 14:22 à 14:24, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; aucun nouvel agent délégué ; escalade de modèle : aucune.

Intention de la demande : juger si les process de la Factory, des forges et des produits sont les mieux à même de répondre aux demandes, et identifier lesquels ajouter, modifier, optimiser ou supprimer.

Test rétro : le complément sert cette intention. Il mesure le critère « process sans demande », que l'étude déclarait non mesuré, et il ajoute un fait au scénario 12.

## 2. Verdict en une ligne

606 process relevés sur 933 transcripts : 0 process suivi orphelin, 192 sur 210 appelés au pilot, 5 documents jamais lus ; étude toujours PASS ; 307 195 jetons de sous-agents au total, sous le budget de 600 000.

## 3. Décisions attendues

Aucune décision neuve.

**D-60** : mise en service de l'œil critique et lancement des scénarios 3, 1 et 12, posée le 20/10 à 14:22, inchangée.

## 4. Traité

- **Relevé des appels intégré à l'étude.** Section 2 (inventaire), critère g de la section 3, scénario 12 et section 11. Preuve : `node oracles/oracle-ecriture.mjs` rend PASS sur l'étude après les éditions.
- **Chiffres repris du relevé.** Ils ont été relus :
  - 606 process ;
  - 0 orphelin parmi les process suivis par git ; les 86 orphelins sont des modules Python non suivis ;
  - 5 gabarits et références sans lecture en 30 jours ;
  - `oracle-synthese.mjs` est le process suivi le plus gros (6 262 lignes) et l'un des plus appelés (2 426 appels).
- **Recompte à la source (S76).** Mon recompte trouve 4 mentions de `INSATISFACTION.md` dans les appels d'outils. Elles peuvent viser `AGENT-INSATISFACTION.md`, que la même chaîne contient ; l'agent n'a compté que les chemins complets. L'étude cite donc ce point comme relevé d'agent, avec cette réserve.
- **Jetons.** 307 195 jetons pour les 5 sous-agents de l'étude, dont 98 704 pour ce relevé.
- **Relecture d'intention : sans objet.** Ce tour intègre des chiffres dans une étude déjà relue à l'aveugle (`RI-20261020-14`), sans en changer le périmètre ni les conclusions.

## 5. Non traité

- **Ce que chaque produit emploie de son héritage.** Motif : le relevé distingue les sessions de produits en bloc, pas produit par produit ; le scénario 11 reste une hypothèse.
- **Les appels de 9 process au nom partagé.** Motif : un appel n'est attribué que sur chemin complet ; leurs comptes sont des planchers.

## 6. Écarts à la lettre

Aucun écart nouveau : ce tour complète l'étude sans changer son périmètre.

## 7. Risques

- **Lire « aucun orphelin » comme « rien à retirer ».**
  - Énoncé : un process appelé peut rester disproportionné à ce qu'il rend.
  - Signal : une proposition de l'œil critique écartée au seul motif que le process est appelé.
  - Parade : l'étude juge aussi la taille et le rendement (scénarios 1, 2 et 5), pas seulement l'usage.

## 8. Prochaines actions

Ordre : les gestes de l'IA d'abord, votre décision ensuite ; A-1 attend D-60.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Mettre en service les relevés et lancer la campagne des scénarios 3, 1 et 12 | auto_ia | dependance_bloc_3 : attend D-60 | Scripts de l'étude, à reprendre comme sondes ; une campagne d'agents par scénario | L'œil critique reste une photographie |
| **A-2** | `neuve` | Enregistrer les études, analyses et synthèses du jour et les items TF-1939 à TF-1941 | auto_ia | hors_mandat : enregistrement non demandé dans ce tour | `git commit --only -- <chemins>` | L'autre poste ne voit pas ce travail |
| **A-3** | `neuve` | Trancher D-60 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `60a` | Rien n'est mis en service |

## 9. Traces

- Étude : `output/03-etudes/Digit-AI - Étude - Oeil critique global des process - 20261020a.md`
- Synthèse précédente : `output/04-plans/Digit-AI - Synthese Mandat - Oeil critique global des process etudie - 20261020j.md`
- Relevé : `releve-process-v3.json` et `orphelins-v3.tsv`, dans le dossier temporaire de la session
- Rien n'est enregistré ni poussé.
