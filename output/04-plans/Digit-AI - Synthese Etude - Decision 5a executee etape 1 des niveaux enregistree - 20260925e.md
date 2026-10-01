---
destinataire: humain
---

# Synthèse Étude — décision 5a exécutée : les 5 fichiers de l'étape 1 des niveaux sont enregistrés localement, rien n'est publié (25/09/2026)

Votre décision est exécutée : les 5 fichiers de la première étape des niveaux d'intervention sont enregistrés dans l'historique local du pilot, sans publication. L'enregistrement a aussi pris la mise à jour automatique d'un index de dossier, qui ne change qu'un compte de fichiers. Ce que ça change pour vous : l'étape 1 est protégée d'une remise à niveau du poste, et la réponse directe reste disponible dès maintenant, sur demande par « vite : » en tête de message. Rien n'est attendu de vous avant la revue du 2 octobre, sauf si vous voulez l'étape 1 sur l'autre poste : il faut alors publier le pilot.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-5 a : enregistrer localement les 5 fichiers de l'étape 1 des niveaux d'intervention, sans push.
- **sur quoi** — le pilot `digit-ai-factory` : 1 commit local, cette synthèse.
- **quand** — 2026-09-25 14:35 UTC+02:00 (Europe/Paris) ; début du tour à 14:33:20, horodatage du message « 5a » lu au transcript ; durée mesurée 2 min.
- **qui** — session Opus 5.5 à l'effort « max » (champ lu au transcript de la session) sur le pilot local `1a747f5` ; aucun sous-agent ; escalade de modèle : aucune ; oracle joué : `oracle-synthese` sur ce document, et les contrôles de pré-commit du dépôt.
- **intention** — garder l'étape 1 à l'abri pendant l'essai, dans l'historique local, sans rien publier. Test rétro : servie, les 5 chemins sont dans le commit et l'arbre de travail ne les montre plus modifiés ; rien n'est poussé.

## 2. Verdict en une ligne

**D-5 a exécutée : commit local `1a747f5`, 6 fichiers dont les 5 de l'étape 1 et 1 index régénéré par le hook de pré-commit ; 11 commits d'avance sur l'origine, 0 de retard ; 0 push.**

## 3. Décisions attendues de l'humain

Rien n'attend de décision de votre part dans ce tour ; le seul bloquant qui retient la suite est daté :

- la mesure de revue est à l'arrêt jusqu'au 2 octobre ; il faut que la semaine d'essai s'écoule ; si elle n'est pas rejouée, l'essai ne dit rien.

## 4. Traité — avec sa preuve

La décision reçue a son geste ; les preuves ci-dessous sont des sorties de commandes du tour.

- **Les 5 fichiers de l'étape 1 sont enregistrés localement** : `CLAUDE.md`, `references\NIVEAUX.md`, `oracles\hook-lexique.mjs`, `oracles\hook-lexique.test.mjs`, `todo\TODO.jsonl`.
  - preuve : `git commit --only` sur ces 5 chemins → commit `1a747f5`, 217 insertions, 11 suppressions, `references/NIVEAUX.md` créé ; `git status --short` sur les 5 chemins → sortie vide.
- **Le registre enregistré ne porte que l'inscription de ce jour** : 3 événements de TF-1391, création, décision et mise en cours.
  - preuve : `git diff --unified=0 -- todo/TODO.jsonl` avant l'enregistrement → 3 lignes ajoutées, toutes de TF-1391, 0 ligne retirée.
- **L'historique local n'a pas divergé de l'origine** : `git fetch` joué avant l'enregistrement.
  - preuve : `git rev-list --left-right --count HEAD...origin/main` → 10 et 0 avant, 11 et 0 après ; aucun push.

## 5. Non traité — avec son motif

- Le push du pilot — motif : hors mandat, la décision reçue enregistre sans publier.
- La mesure de revue — motif : dépendance externe, la semaine d'essai ; elle se rejoue le 2026-10-02.

## 6. Écarts à la lettre

- **Vous avez écrit** « 5a », qui enregistre les 5 chemins → **le commit en porte 6** → **pourquoi** : le hook de pré-commit du dépôt régénère et indexe l'index du dossier des synthèses ; seule y change la ligne qui compte les fichiers présents sur le poste et non suivis, de 1 à 2, parce que cette synthèse en cours d'écriture s'y ajoutait.

## 7. Risques

- L'autre poste n'a pas l'étape 1 tant que le pilot n'est pas publié ;
  - signal : sur l'autre poste, « vite : » ne produit aucune ligne de niveau ;
  - parade : la publication, sur votre feu vert ; la mesure de revue ne lit que les transcripts de ce poste.
- La publication, le jour où elle vient, emporte 11 commits, dont 9 d'autres sessions ;
  - signal : la porte de publication rend un constat sur un commit qui n'est pas de ce tour ;
  - parade : la porte joue avant tout envoi, et un constat bloque l'envoi entier.

## 8. Prochaines actions

Ordre du tableau : une seule action, datée du 2026-10-02, parce que rien d'autre n'attend avant la revue.

| Sélecteur | Action | Acteur | Motif / raison | Effort | Si elle n'est pas faite |
|---|---|---|---|---|---|
| A-1 | Rejouer les scripts de mesure de l'étude sur les tours du 2026-09-26 au 2026-10-02 et confronter l'essai à ses cibles (TF-1391) | auto_ia | `dependance_externe` — la semaine d'essai, jusqu'au 2026-10-02 | simple × court | l'essai ne dit rien, et l'étape 2 se déciderait sans mesure |

## 9. Traces

- Commit local : `1a747f5`, « Niveaux d intervention, etape 1 : references/NIVEAUX.md, renvoi du noyau, mots-cles vite et complet au lexique (pilot seul), TF-1391 en cours ».
- Commit précédent du même travail : `1b2c6bd`.
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Etude - Decision 5a executee etape 1 des niveaux enregistree - 20260925e.md`.
- Oracles : `oracle-synthese` sur ce fichier ; contrôles de pré-commit du dépôt, passés.
- Aucune page HTML livrée dans ce tour.
