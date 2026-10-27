---
destinataire: humain
---

# Synthèse Mandat — A-1 et A-2 faites, A-3 en cours : barrière outillée, pilot publié, première analyse d'œil critique lancée (26/10/2026)

## 0. Synthèse d'ouverture

Deux de vos trois actions sont faites. Une récidive ne peut plus être close au registre sans une barrière nommée, et le pilot est publié sur GitHub après fusion avec l'autre poste, les numéros en collision renumérotés. La première analyse d'œil critique tourne : 44 sessions de ce poste depuis le 20/10 sont lues par 6 agents, et un 7e relit le code de la période. Sa liste de modifications vous sera rendue dès leur retour ; rien ne vous est demandé d'ici là.

## 1. En-tête d'identification

Point d'étape · exécution de vos actions A-1, A-2 et A-3 · sur le pilot digit-ai-factory et GitHub · le 26/10/2026 à 14:56 (heure de Paris, UTC+1) · Claude Opus 5.5, commits a320a3c5 (barrière) et 974cb89a (fusion), publiés.

Intention : fermer le chemin des récidives, mettre les 2 postes au même niveau et obtenir la première mesure des transformations. Test rétro : les 2 premières servent l'intention et sont prouvées ; la 3e ne se juge qu'à la sortie de l'analyse.

## 2. Ce qui reste à mesurer, et par quoi

- La liste de modifications de l'œil critique et les 3 indicateurs du poste : par les 7 agents lancés à 14:55, consolidés selon l'étape 5 du skill `oeil-critique`, puis par `repere.mjs avancer`.

## 3. Décisions attendues

Aucune décision nouvelle. Rappel : D-71, publication du pilot après rebase, posée à 10:22, exécutée par votre A-2.

## 4. Traité

- A-1, barrière dès la 2e fois :
  - règle R17 de `todo/oracle-todo.mjs` : une création marquée `recidive_de` ne passe pas en corrige sans `barriere` (hook, oracle, défaut ou script, avec son chemin), à partir du 26/10 à 15:00 UTC ; 483 clôtures antérieures comptées, non jugées ;
  - recette `todo/oracle-todo-r17.test.mjs` : 4 PASS, dont 2 cas rouges et le registre réel ;
  - commit a320a3c5.
- A-2, synchronisation et publication :
  - branche de sauvegarde `sauvegarde-avant-fusion-20261026` posée avant la fusion ;
  - fusion de 17 enregistrements de l'autre poste et 21 locaux, 9 conflits résolus, tous des registres, des journaux ou des index ;
  - TF-1936 à TF-1942 locaux renumérotés TF-1951 à TF-1957 (`todo/renumeroter.mjs`, et à la main pour TF-1942, cité par TF-1946) ; `oracle-todo` PASS sur le registre uni ;
  - D-53 à D-56, prises des 2 côtés, déclarées en collision ; `reserver-decision.mjs --verifier` PASS ;
  - recettes après fusion : hook d'ouverture 44 PASS, `hooks-factory` 22/22, `ledger.py` 21 PASS, relever-flotte 16 PASS, R17 4 PASS, `oracle-claude-md` PASS ;
  - publication : `git push origin main` de 3067054b à 974cb89a, puis `git rev-list --left-right --count` rend `0 0`.
- A-3, première analyse d'œil critique :
  - repère du poste : aucune exécution, départ au 20/10 ;
  - extraction : 44 sessions, 204 messages humains, 1 010 réponses, 73 refus de hook, 1 548 581 caractères, session courante exclue ;
  - mission 4 jouée par `todo/observer-recidives.mjs` : récidives de 505 à 508, items ouverts anciens de 32 à 46, sources muettes de 34 à 38, 4 seuils franchis ;
  - missions 1, 2, 3 et 5 confiées à 7 agents lancés à 14:55.
- Relecture d'intention : sans objet pour ce point d'étape, la liste de l'œil critique n'étant pas encore produite.

## 5. Non traité

- Liste des modifications et avancée du repère : en attente du retour des 7 agents.
- Analyse sur l'autre poste : elle se lance depuis une session de l'autre poste, où sont ses échanges.

## 6. Écarts à la lettre

Le skill prévoit un agent par session ; j'ai regroupé les 44 sessions en 6 lots d'environ 288 000 caractères, parce que 44 agents dépasseraient le plafond d'un million de jetons par exécution. L'écart sera consigné dans la sortie de l'analyse, comme le skill le demande à sa première exécution.

## 7. Risques

- Énoncé : 2 relectures d'intention de postes différents portent le même identifiant du jour (16 cas après fusion). Signal : un relevé qui compte une relecture pour une autre. Parade : un identifiant de relecture préfixé par le poste, à proposer dans la liste de l'œil critique.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1957 | Consolider les 7 analyses, rendre la liste des modifications, exécuter les automatiques, avancer le repère | auto_ia | dependance_externe | retour des 7 agents lancés à 14:55, puis `repere.mjs avancer` | la première mesure de T1 n'existe pas |
| **A-2** | TF-1957 | Lancer la même analyse sur l'autre poste | manuelle_utilisateur | presence : les échanges de l'autre poste ne se lisent que sur lui, `extraire.mjs` lit le seul dossier `~/.claude/projects` de ce poste | taper « œil critique » dans une session du pilot de l'autre poste | la moitié des échanges reste non analysée |

## 9. Traces

- `todo/oracle-todo.mjs`, règle R17 ; `todo/oracle-todo-r17.test.mjs`.
- Commits a320a3c5 et 974cb89a, publiés ; branche `sauvegarde-avant-fusion-20261026`.
- `todo/TODO.jsonl`, TF-1951 à TF-1957 ; `decisions/REGISTRE.jsonl`, D-53 à D-56.
- `todo/observabilite/snapshots-recidives.jsonl`, relevé n° 12.
