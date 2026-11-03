---
destinataire: humain
---

# Synthèse Mandat — 2 restes sur 3 corrigés et publiés, 1 décision pour la largeur des gabarits (03/11/2026)

## 0. Synthèse d'ouverture

Les gates de forge-development disent enfin quand ils n'ont rien jugé, et forge-tests reconnaît les appels de table écrits en supabase-js. Ces 2 restes sont clos et publiés. Le harnais du pilot n'a plus qu'une cause de rouge : 18 gabarits de documents sur 20 n'occupent pas assez la largeur d'un très grand écran, et la façon de corriger vous revient, en une ligne. Les autres rouges rapportés hier étaient soit déjà verts, soit corrigés ce matin. Le poste a dormi pendant le travail, de 17:55 à 21:19 d'après un agent, sans perte : le lot interrompu a été repris. Le remplacement de la consigne page HTML sur vos 2 comptes attend toujours votre geste.

## 1. En-tête d'identification

Exécution de votre réponse « A2 » du 02/11/2026 à l'action A-2 de la synthèse 20261102p, sur le pilot `digit-ai-factory`, forge-development et forge-tests. Période : du 02/11/2026 à 17:00 au 03/11/2026 à 09:29, heure de Paris (UTC+01:00), poste en veille une partie de la nuit. Session pilote Claude Opus 5.5, 3 agents de campagne Sonnet 5.5 et 3 relectures d'intention.

Intention de la demande : corriger les restes ouverts sans vous laisser ce qui s'exécute seul, et ne vous poser que ce qui vous revient.

Test rétro : le résultat sert cette intention. Chaque reste a son issue au registre, et le seul point de doctrine est posé en entier.

## 2. Verdict

2 items clos, 1 corrigé en partie et en attente de D-154. Mesuré sur : `todo/TODO.jsonl`, relue à 09:26, périmètre les 3 éléments de l'action A-2. Le pilot, forge-development et forge-tests sont publiés, 0 commit d'écart à 09:28.

## 3. Décisions attendues

Pour répondre, une ligne suffit, par exemple : « 154a », qui suit ma recommandation.

> **D-154 — Comment faire tenir la règle de largeur sur grand écran aux 18 gabarits de documents qui la manquent ? (TF-2066)**
>
> - **De quoi s'agit-il** : les gabarits de documents de lecture du pilot, sous `gabarits/documents/` (note de synthèse, compte rendu, rapport d'avancement et 15 autres), rendus sur un écran de 2560 ou 3840 px.
> - **Le problème** : la règle V23 (contenu sur 75 % au moins d'une fenêtre large) du socle des pages, du 21/10/2026, exige que le contenu occupe au moins 75 % d'une fenêtre large. 18 gabarits sur 20 la manquent, par exemple 56 % à 3840 px pour la synthèse exécutive, et `node oracles/self-tests.mjs` reste rouge pour cette seule cause. Une colonne de prose plus large dépasserait la limite de 135 caractères par ligne.
> - **Pourquoi vous** : les 2 sorties touchent la doctrine de lecture. Soit les documents déclarent leur colonne étroite et sortent du contrôle de largeur, soit ils passent en 2 colonnes, ce qui change l'ordre de lecture.
> - **Recommandation : (a)** — un document de lecture a une colonne étroite par nature, et la règle prévoit cette déclaration ; la grille change ce que lit le lecteur pour satisfaire un contrôle. Source consultée : `lisibilite.md` et `zero-defaut-visuel.md` du skill digit-ai-page-html, règle V23 ; mesure de `scripts/verifier-rendu-instances.mjs` du 03/11/2026 ; prototypes sur une copie de la synthèse exécutive.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) *(recommandée)* Déclarer la colonne de lecture | Chaque gabarit porte l'attribut `data-colonne-ok`, la sortie prévue par la règle et déjà prise par le guide de référence ; la largeur de lecture ne change pas, mais V23 ne juge plus ces documents | Simple × court, 36 fichiers | Possible |
| (b) Grille à 2 colonnes dès 2000 px | Le corps du document passe en 2 colonnes sur grand écran ; V23 est tenue, mais l'ordre de lecture change et le chapô dépasse 135 caractères à 3840 px ; essayé sur 1 gabarit sur 18 | Moyen × 1 jour, 18 familles à rendre et relire | Possible |
| (c) Ne rien faire | Les 18 gabarits restent rouges à V23, et le harnais complet rend exit 1, ce qui cache tout autre rouge derrière celui-là | Nul | Sans objet |

> **Sans réponse** : (c), ne rien faire.

## 4. Traité

Chaque chiffre de recette ci-dessous a été rejoué par moi après intégration, sauf mention « rapporté ».

**Les 2 forges**

- **Gates qui taisaient leur SKIP** (TF-2059, forge-development 618fc58, d216564, 4a18489, 99f9bb9) : `static_cache`, `runtime_parity` et `porte_neutralisee` impriment « SKIP (non jugé) » avec leur motif. `supabase_ssr` juge exactement un `package.json` qui n'est pas un objet, `mutants/` est ignoré, et la citation de 94,25 % est datée du 12/08, avec la mesure du 02/11 à côté. `pytest` 539 passed et 1 skipped, `ruff` vert, workflow `double-gate` en `success` sur 99f9bb9. Le seuil de 75 % ne bouge pas.
- **Tables supabase-js** (TF-2060, forge-tests c2f8a39, 5c2d627) : `.from("table")` compte comme un exercice dans les fichiers JS et TS, sans les faux amis comme `Array.from`. Une déclaration de table exercée exige désormais un chemin de preuve lisible, sinon elle est publiée comme non jugée. Aucun verdict existant ne change : aucun des 29 dépôts du poste ne cite cette déclaration hors forge-tests et le registre du pilot. Tests du pan supabase verts, recette `verifier_corpus` exit 0 avec `S-01 TENU`, registre de dette à jour sur 266 entrées. Rapporté par l'agent, non recompté : 1 598 tests passés.

**Le harnais du pilot**

- **Banc de mutation** (TF-2066, pilot e9ac53a6) : 62 détections sur 69 font 89,86 %, que l'arrondi affichait 90 % ; 4 mutations visaient des blocs devenus facultatifs, elles visent de nouveau ce que l'oracle juge. Recette 15 PASS ; rapporté par l'agent, non recompté : 66 détections sur 69. Le plancher de 90 % ne bouge pas.
- **Cas du pre-push sans `sh`** (pilot 59dc1dad) : le cas se joue quel que soit le lanceur, `verifier-hooks-git.test` 20 PASS.
- **Chiffre « visé »** (pilot 988c11da) : il n'est plus accusé de chiffre sans relevé, `lib-chiffres-releves.test` 20 PASS.
- **Cliquet des recettes** (pilot 40058034) : écrit par le harnais complet lui-même, sans baisse, rapporté par l'agent et non recompté. Ce passage rend exit 1 sur 2 oracles, la largeur V23 et un rouge propre au worktree.
- **Déjà verts** : `oracle-skills` et `oracle-readme-dossiers` rendent exit 0 sur le main, rejoués à 17:01 le 02/11.

Relecture d'intention : sert, gravité mineure, 2 écarts, verdict consigné sous RI-20261103-01 ; la consigne de campagne a été relue avant le lancement, dérive à la passe 0 sous RI-20261102-24, corrigée puis jugée « sert » sous RI-20261102-25.

## 5. Non traité

- La largeur V23 des 18 gabarits — motif : `decision`, voir D-154.
- Le registre des mutants équivalents de forge-development, 21 survivants listés pour 93 mesurés, et la cause de la baisse du score — motif : `hors_mandat`, rapportés par l'agent et ouverts en candidat TF-2068.
- L'écriture de `todo/observabilite/RECIDIVES.json` par une recette du pilot — motif : `hors_mandat`, retirée de la consigne par la relecture et ouverte en candidat TF-2067.
- Le remplacement de la consigne page HTML sur vos 2 comptes (TF-1991) — motif : `acces`, voir A-2.

## 6. Écarts à la lettre

- Vous avez demandé de corriger 3 restes → j'ai ouvert 2 candidats de plus (TF-2067 et TF-2068) → ce sont des constats mesurés pendant le travail, qui se seraient perdus dans les rapports d'agents.
- Vous avez demandé de corriger le harnais rouge → il reste rouge pour la largeur des gabarits → la seule correction mécanique aurait été de baisser la règle V23, ce que la doctrine interdit.
- J'ai publié avec le pilot un commit d'une autre session du poste, déjà enregistré sur `main`, et des numéros de décision qu'elle avait réservés → l'envoi du pilot porte toute la branche, et le hook de publication l'a jugé avant l'envoi.

## 7. Risques

- **Harnais rouge tant que D-154 n'est pas tranchée** : un nouveau rouge resterait caché derrière celui de V23.
  - Signal : `node oracles/self-tests.mjs` rend exit 1 sur 2 oracles au lieu de 0.
  - Parade : D-154.
- **Faux ami de `.from` non mesuré** : un `knex.from("table")` serait lu comme un appel supabase si la table porte le même nom.
  - Signal : une table comptée exercée chez un produit qui n'utilise pas supabase-js.
  - Parade : élargir la liste des faux amis dans `forge_tests/adaptateurs/supabase.py`.
- **Score de mutation en baisse inexpliquée** : 85,76 % au lieu de 94,25 %, encore au-dessus du seuil de 75 %.
  - Signal : la ligne du job `mutation` de `double-gate`.
  - Parade : TF-2068.

## 8. Prochaines actions

Ordre : votre décision d'abord, car la correction du harnais en dépend.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Trancher D-154, pour que je rende les 18 gabarits conformes | TF-2066 | manuelle_utilisateur | `decision` : doctrine de lecture | répondre en une ligne, par exemple « 154a » | si rien n'est fait, le harnais reste rouge et peut cacher un nouveau défaut |
| A-2 | Remplacer la consigne page HTML sur vos 2 comptes, pour que les sessions hors dépôt lisent les bonnes polices | TF-1991 | manuelle_utilisateur | `acces` : API de la plateforme https://api.anthropic.com/v1/skills HTTP 401 et https://claude.ai/api/skills HTTP 403, relevés le 02/11/2026 ; identité de la session sans clé ; aucune identité de service ; script du dépôt `sync-skills.mjs` 0 mention du compte | suivre le guide de la synthèse 20261102k | si rien n'est fait, un brief écrit hors du dépôt peut reprendre Roboto et DM Sans |
| A-3 | Corriger les restes neufs : recette qui écrit le registre d'observabilité, registre des mutants périmé, candidat de chemin jamais développé | TF-2067, TF-2068 | auto_ia | `hors_mandat` : ouverts dans ce tour, hors de votre réponse | instruire et traiter ces candidats par R-58 (seules dépense, publication, irréversible, doctrine et arbitrage reviennent à l'humain) | si rien n'est fait, le registre des mutants ne sert plus de référence |

## 9. Traces

- Registre : `todo/TODO.jsonl` ; décision réservée dans `decisions/REGISTRE.jsonl` ; relectures dans `todo/relectures-intention.jsonl`.
- Pilot : commits e9ac53a6, 988c11da, 59dc1dad, 40058034, c03232d9.
- Forges : forge-development 618fc58, d216564, 4a18489, 99f9bb9 ; forge-tests c2f8a39, 5c2d627.
- Consigne de campagne : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\2071e2c2-a550-4861-af6a-8b64f7aafe28\scratchpad\campagne-a2b.md`.
