---
destinataire: humain
---

# Synthèse Conseil — faire tourner L99 en boucle jusqu'à un score, étude d'opportunité (16/10/2026)

## 0. Synthèse d'ouverture

Votre intuition tient, à une condition : la boucle doit être jugée par un autre que L99. J'ai fait renoter à l'aveugle 5 prompts réécrits par L99. Ils perdent de 6 à 12 points par rapport au score qu'il leur promettait, et un relecteur neuf y trouve 22 défauts majeurs. Si L99 se renotait lui-même, la boucle s'arrêterait tout de suite : sur 28 analyses, son score projeté est toujours entre 86 et 94. L'étude recommande une boucle arbitrée par un relecteur aveugle, arrêtée à zéro défaut majeur et bornée à 3 passes. Elle est déposée dans `output\03-etudes\` et la proposition est inscrite au registre en TF-1831. Une décision vous revient : construire ce mode.

## 1. En-tête d'identification

Étude d'opportunité au gabarit `gabarits\ETUDE-OPPORTUNITE.md`, sur le skill `prompt-analyzer-l99` v2.5.0. Période : 16/10/2026 de 10:46 à 11:03, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5, 5 agents relecteurs Claude Opus 5.5 lancés en parallèle.

Intention de la demande : obtenir de L99 des prompts réécrits réellement meilleurs, sans relancer l'analyse à la main, en s'arrêtant à un score.

Test rétro : le résultat sert cette intention. La mesure dit quand une boucle rend le prompt meilleur (5 à 8 points estimés, défauts majeurs clos) et quand elle n'y peut rien (prémisses périmées à l'exécution).

## 2. Verdict en une ligne

Option O2 retenue, une boucle à relecteur aveugle ; `oracle-etude-opportunite` PASS sur 10 règles sur 10, exit 0 ; TF-1831 inscrit, `oracle-todo` PASS avant et après.

## 3. Décisions attendues

Inventaire des bloquants :

- **Construction du mode.** Ce qui est bloqué : l'ajout du mode « L99 boucle » au skill, dans forge-agents. Ce qu'il faut fournir : votre choix sur D-1. Si rien n'est fourni : TF-1831 reste `candidat` et L99 continue d'afficher un score projeté.

> **D-1 — Faut-il ajouter à L99 un mode boucle jugé par un relecteur aveugle ?**
>
> Votre demande vise un L99 qui s'améliore jusqu'à un score. Mesuré ce jour, le score projeté surestime de 6 à 12 points, et un relecteur neuf trouve 3 à 7 majeurs par prompt. Le mode coûte 1 à 3 relectures par analyse, de 69 000 à 75 000 jetons et 1 à 7 minutes chacune.
>
> **Recommandation : (a).** Source consultée : l'étude `output\03-etudes\20261016-etude-opportunite-boucle-l99-jusqu-a-un-score.md`, section 1, et ses 5 relectures du 16/10/2026.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Mode boucle à relecteur aveugle, arrêt à 0 bloquant et 0 majeur, borne 3 passes (O2) | Moyen × court | Ne juge pas la sortie réelle du prompt |
| (b) Une seule relecture aveugle qui remplace le score projeté par un score mesuré, sans boucle (O4) | Simple × court | Un défaut introduit par la correction n'est pas revu |
| (c) Ne rien changer (O0) | Nul | Les prompts partent avec leurs majeurs, invisibles derrière un score de 86 à 94 |

> **Si rien n'est décidé** : (c), TF-1831 reste au registre en `candidat`.

## 4. Traité

- **Relevé de 28 analyses L99 sous `C:\dev`.** Le score projeté va de 86 à 94, moyenne 88, pour des départs de 20 à 79 ; aucune analyse n'a fait mesurer sa réécriture.
- **5 relectures aveugles.** Projeté contre mesuré : P1 88 contre 82, P4 86 contre 74, P5 93 contre 84. P2 et P3 sont plafonnés à 40 par une prémisse périmée, et valent environ 80 et 76 hors plafond. Au total : 2 bloquants et 22 majeurs, dont au moins 11 présents le jour de la réécriture.
- **Chiffres des relecteurs recomptés à la source.** Deux étaient faux : `oracle-claims` existe chez forge-conception et chez forge-agents, et le registre compte 1 044 créations, pas 3 982. Ils sont corrigés dans l'étude, qui en tire une règle : le défaut d'un relecteur se recompte avant d'entrer dans la passe suivante.
- **Constat vérifié sur le prompt Supabase de ce matin.** Il prescrit un contrôle `oracle-secrets` qui n'existe pas : seul `oracles\oracle-secrets-hors-perimetre.mjs` existe, recherche du 16/10/2026 sur le pilot et les 13 forges.
- **Étude déposée et jugée.** `oracle-etude-opportunite` 1.2.0 PASS, E1 à E10, exit 0.
- **Constats transmis au run Supabase.** Ce run tourne dans une autre session depuis 10:49. Les 3 constats lui ont été envoyés par message entre sessions, aux 2 sessions actives du pilot, avec la consigne de les ignorer hors de ce run. Les comptes Azure cités ont été recomptés : 29 fichiers dans forge-development, 1 dans forge-conception. La session du run a répondu qu'elle les avait vérifiés à la source et pris en compte. Le contrôle de secrets est remplacé par un `git grep` de motifs Supabase sur les fichiers enregistrés, qui ne trouve rien. Les comptes Azure reçoivent un écart motivé, et forge-tests passe sans objet. Ces corrections sont dans le commit 8cac7905, local.
- **Proposition inscrite.** TF-1831 par `todo\journaliser.mjs`, classe `amelioration-jugee-sans-ses-effets`, cible forge-agents.

## 5. Non traité

- **Construction du mode.** Motif : décision humaine, D-1.
- **Publication du pilot.** Motif : décision humaine (R-38).

## 6. Écarts à la lettre

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « jusqu'à un certain score » | Arrêt d'abord à 0 bloquant et 0 majeur ; le score reste un seuil secondaire | P5 mesure 84 avec 3 majeurs ouverts : un score seul aurait arrêté la boucle trop tôt |
| « avec la boucle » | La discipline de `la-boucle`, avec un arbitre qui n'est pas l'auteur | L99 noté par L99 annonce toujours 86 à 94 |

## 7. Risques

- **Le relecteur partage les angles morts de l'auteur.**
  - Énoncé : il est du même modèle, et chaque prompt n'a eu qu'un relecteur ; 2 de ses chiffres étaient faux.
  - Signal : un défaut retenu qu'un recompte à la source dément.
  - Parade : recompter chaque défaut avant la passe suivante ; deux relecteurs pour un prompt de run, sur le modèle d'`oracle-judge --lecteur-vise`.
- **Le pilot n'est pas publié.**
  - Énoncé : l'étude, la synthèse et TF-1831 sont enregistrés en local seulement.
  - Signal : `git rev-list --count origin/main..HEAD` différent de 0.
  - Parade : publication sur votre GO (R-38).

## 8. Prochaines actions

Votre réponse à D-1 (A-2) vient d'abord, parce que la construction du mode (A-1) en dépend ; le tableau range l'action de l'IA en tête.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1831 | Construire le mode boucle dans `prompt-analyzer-l99`, avec sa recette de 2 cas | auto_ia | dependance_bloc_3 : attend D-1 | Répondre `D-1 (a)` dans cette conversation | L99 garde un score projeté non mesuré |
| **A-2** | TF-1831 | Trancher D-1 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a)` | L'option (c) s'applique |

## 9. Traces

- `output/03-etudes/20261016-etude-opportunite-boucle-l99-jusqu-a-un-score.md`
- `todo/TODO.jsonl`, événement TF-1831 du 2026-10-16T08:59:13.894Z
- Skills `prompt-analyzer-l99` (`references/couches.md`, lignes 154 à 165) et `la-boucle`
