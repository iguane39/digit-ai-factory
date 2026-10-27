---
destinataire: humain
---

# Synthèse Mandat — skill oeil-critique créé et installé, 3 retraits faits (21/10/2026)

## 0. Synthèse d'ouverture

Le skill d'œil critique existe et il est installé sur ce poste : il suffit de taper « œil critique » dans une session du pilot pour lancer l'analyse des échanges depuis le 20/10. Il lit les échanges du poste, n'écrit rien et rend la liste des modifications à faire. Le relevé d'ouverture affiche désormais sa dernière sortie à la place de 2 anciennes sections. Il vous reste à lancer la première analyse sur chaque poste, et à donner votre feu vert pour publier le pilot.

## 1. En-tête d'identification

Exécution de vos réponses D-67 (a), D-64 (a), D-65 (a) et D-66 (a) · sur le pilot digit-ai-factory et la forge digit-ai-forge-agents · le 21/10/2026, fin à 10:26 (heure de Paris, UTC+2), durée 23 minutes · Claude Opus 5.5, commits 829e7b8a au pilot et 5870e92 à la forge.

Intention : disposer d'un outil que vous lancez à la main sur chaque poste et qui transforme les échanges récents en une liste de modifications, sans rien écrire lui-même. Test rétro : le skill tient ce rôle sur ses 2 scripts testés ; il n'a pas encore tourné sur une analyse complète, ce que seule votre première exécution permettra.

## 2. Verdict en une ligne

Skill `oeil-critique` 1.0.0 publié dans sa forge et installé : 2 auto-tests à 5 cas sur 5, `oracle-skills` PASS sur les 2 profils, recette du hook d'ouverture 40 PASS sur 40 ; 3 retraits sur 3 traités.

## 3. Décisions attendues

Rien n'attend de décision ; la publication du pilot attend votre feu vert, en A-2.

## 4. Traité

- Skill `oeil-critique` dans `digit-ai-forge-agents/.claude/skills/oeil-critique/` :
  - `SKILL.md` : déclenchement, 5 missions sur des outils existants, liste fermée des majeures, format B et ses 6 lignes, plafond de 5 décisions ;
  - `scripts/repere.mjs` : repère par poste, première exécution depuis le 20/10/2026, auto-test 5 PASS ;
  - `scripts/extraire.mjs` : extraction pseudonymisée par `todo/anonymiser-entrant.mjs` du pilot, session courante exclue, auto-test 5 PASS.
- Extraction jouée sur ce poste : 16 sessions, 99 messages humains, 795 447 caractères, aucun des noms réels cherchés en sortie.
- Correction rouge → vert du script d'extraction : la première version lisait 26 messages humains sur 16 sessions, presque tous des retours de hook. Vos messages arrivent dans VS Code en liste de blocs de texte. L'auto-test porte désormais ce cas, et la version corrigée lit 99 messages.
- Même correction dans la proposition du 21/10 et dans l'analyse L99 : 1,30 million de caractères devient 795 447 ; `oracle-ecriture` PASS sur les 2 après correction.
- Publication de la forge : `git push` puis `git rev-list --left-right --count main...origin/main` rend `0 0`, commit 5870e92.
- Installation : `oracle-skills.mjs --appliquer` sur les 2 profils, puis `oracle-skills` PASS sur chacun.
- Retrait 1, relevé d'ouverture : « Surveillance des récidives » et « Flotte d'agents » remplacées par « Œil critique ». La section garde 2 alarmes : la dérive hebdomadaire des récidives et le seuil de l'essai de relecture. Preuves : relevé rejoué, 0 occurrence des 2 anciennes sections ; recette `hook-ouverture.test.mjs` 40 PASS.
- Retrait 2 : `references/RELECTURE-INTENTION.md` dit que la relecture par tour n'est pas prolongée après le 2026-11-01, la mission 2 du skill la reprenant.
- Retrait 3 : la revue mensuelle à la main n'avait jamais été créée ; rien à retirer.
- Registre : TF-1942 créée, décidée, puis en cours en attente de votre première exécution ; `journaliser` PASS avant et après.
- Relecture d'intention : sert (RI-20261021-04, 0 écart).

## 5. Non traité

- Première analyse réelle : non lancée, parce que votre réponse D-65 (a) laisse la première exécution à votre geste.
- Clôture de TF-1942 : non faite, parce qu'une clôture exige des gains constatés, que seule une exécution réelle donnera.
- Sources muettes des retours : elles ne s'affichent plus à l'ouverture et passent à la mission 4 du skill, comme la proposition le prévoit ; la décision D-3 (a) du 17/09 qui les affichait est ainsi remplacée par votre réponse D-64 (a).
- Push du pilot : non fait, parce qu'il attend votre feu vert ; le pilot a 10 commits d'avance et 3 de retard sur GitHub.

## 6. Écarts à la lettre

Aucun écart : vous avez retenu la création du skill avec ses 3 retraits, le skill seul au départ et l'abonnement du poste, et c'est ce qui est fait.

## 7. Risques

- Énoncé : la première analyse peut dépasser le plafond d'un million de jetons si l'autre poste porte beaucoup plus d'échanges. Signal : la sortie de l'exécution sur l'autre poste. Parade : découper l'analyse sur plusieurs exécutions, comme le skill le prévoit.
- Énoncé : le pilot diverge de GitHub, 10 commits d'avance et 3 de retard. Signal : `git rev-list --left-right --count main...origin/main` rend `10 3` à 10:22. Parade : rebase avant la publication.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 publie le pilot dès votre feu vert, A-2 et A-3 sont vos lancements, sur ce poste puis sur l'autre.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1942 | Rebaser le pilot sur GitHub et publier | auto_ia | gate_gouvernance | `git pull --rebase origin main` puis `git push origin main` | l'autre poste n'a ni la section « Œil critique » ni le repère |
| **A-2** | TF-1942 | Lancer la première analyse sur ce poste | manuelle_utilisateur | decision : D-65 (a) laisse le lancement à votre geste | taper « œil critique » dans une session du pilot | aucune liste de modifications n'est produite |
| **A-3** | TF-1942 | Lancer la même analyse sur l'autre poste, après A-1 | manuelle_utilisateur | decision : même réponse D-65 (a) | taper « œil critique » dans une session du pilot de l'autre poste | la moitié des échanges reste non analysée |

## 9. Traces

- `C:\dev\digit-ai-forge-agents\.claude\skills\oeil-critique\`, commit 5870e92 publié.
- `oracles/hook-ouverture.mjs` et `oracles/hook-ouverture.test.mjs`.
- `references/RELECTURE-INTENTION.md`, section « Dates, seuil, revue ».
- `todo/TODO.jsonl`, TF-1942.
- `todo/relectures-intention.jsonl`, entrée RI-20261021-04.
- Commit 829e7b8a.
