---
destinataire: humain
---

# Synthèse Mandat — reprise réseau de l'installateur publiée, chantier d'installation sans question clos (13/10/2026)

## 0. Synthèse d'ouverture

La dernière amélioration de l'installateur est en ligne : une coupure réseau passagère pendant l'installation déclenche désormais une seconde tentative au lieu d'un échec. Tout le chantier est donc publié : un développeur qui donne l'adresse du dépôt à son agent obtient la factory installée sur son projet, sans question, avec la bannière « FACTORY DIGIT-AI OPÉRATIONNELLE » à la fin. Rien n'attend de décision de votre part ; le seul reste est la mesure de la variante macOS et Linux, faute de poste Linux ici.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « 3a » : publication de la reprise réseau de l'installateur.
- **sur quoi** — pilot `digit-ai-factory`, de `efb3c06a` à `03cc4af5`.
- **quand** — 2026-10-13, de 19:49 à 19:57 UTC+02:00 (Europe/Paris), heures relevées par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `git push` avec le feu vert cité, `git fetch`, `git rev-list`, `curl`.
- **intention** — qu'un développeur qui ne connaît que l'adresse du dépôt obtienne la factory installée sur son projet, sans question, avec une fin claire. **Test rétro** : servie, la commande publiée a été mesurée verte sur poste neuf au tour précédent, et la reprise réseau publiée couvre l'échec passager observé.

## 2. Verdict en une ligne

**TENU — `03cc4af5` publié (`efb3c06a..03cc4af5 main`), présent sur `origin/main`, et l'adresse publique de `scripts/installer-projet.mjs` porte la reprise réseau (2 occurrences de `RESEAU_PASSAGER`).**

## 3. Décisions attendues de l'humain

Rien n'attend de décision de votre part.

## 4. Traité — avec sa preuve

Ce tour a publié le seul enregistrement autorisé, sans emporter le travail des autres sessions.

- **Publication de `03cc4af5` seul**, par `git push origin 03cc4af5:main` : les 3 enregistrements locaux arrivés depuis, d'autres sessions, restent locaux.
  - preuve : sortie « efb3c06a..03cc4af5 03cc4af5 -> main », exit 0 ; `git branch -r --contains 03cc4af5` → `origin/main`.
- **Adresse publique à jour**.
  - preuve : `curl` de `scripts/installer-projet.mjs` publié → 2 occurrences de `RESEAU_PASSAGER`.

## 5. Non traité — avec son motif

- `installer.sh` joué sous Linux — motif : `borne_atteinte` ; 2 voies essayées dans la session : `wsl -l -q` ne liste que la distribution interne `docker-desktop`, `docker version` rend « failed to connect to the docker API ».
- Les 3 enregistrements locaux d'autres sessions (`0a88a65c`, `f4a94bff`, `4536d105`) — motif : `hors_mandat`, hors de votre réponse « 3a ».

## 6. Écarts à la lettre

Aucun écart.

## 7. Risques

- `installer.sh` n'a jamais été exécuté.
  - signal : un développeur sous macOS ou Linux rapporte une erreur du script ;
  - parade : le jouer dans un conteneur Linux vierge dès que le démon Docker tourne.

## 8. Prochaines actions

Une seule action reste, et elle attend un moyen extérieur.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Jouer `installer.sh` dans un conteneur Linux vierge dès que le démon Docker tourne | `auto_ia` | TF-1637 | `dependance_externe` — `docker version` → « failed to connect to the docker API » | la voie macOS et Linux reste non mesurée |

## 9. Traces

`scripts/installer-projet.mjs`, commit `03cc4af5` (publié).
