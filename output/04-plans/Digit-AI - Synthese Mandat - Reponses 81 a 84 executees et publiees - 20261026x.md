---
destinataire: humain
---

# Synthèse Mandat — réponses 81 à 84 exécutées et publiées (26/10/2026)

## 0. Synthèse d'ouverture

Vos quatre réponses sont appliquées et publiées sur GitHub. Les pages trop étroites restent refusées, comme vous l'avez choisi. Deux numéros de décision ne peuvent plus être pris deux fois chez un même produit, sur ce poste. La critique des pages est désormais exigée à la fin de tout tour qui modifie une page : elle avertit jusqu'au 2 novembre, puis bloque dès le 3, et la session la joue d'elle-même, sans jamais vous la demander. L'essai du relecteur neuf est mesuré. Deux choses vous restent : la décision sur la suite de cet essai, déjà posée, et le renouvellement de deux jetons Meta trouvés en clair dans une ancienne conversation.

## 1. En-tête d'identification

Mise en œuvre des réponses « 81b, 82a, 83a, 84a » à la revue hebdomadaire, pilot digit-ai-factory, poste DESKTOP-ULTRA7, le 26/10/2026 de 21:38 à 23:19, heure de Paris. Session de pilotage Claude Opus 5.5 ; 3 agents de campagne (Sonnet) dans des arbres de travail isolés, 33 lecteurs neufs (Sonnet), 3 relecteurs d'intention (Sonnet) ; escalade de modèle : aucune.

Intention de la demande : que les quatre options choisies soient appliquées et vérifiées, sans vous laisser de validation manuelle.

Test rétro : le résultat sert cette intention ; les quatre options sont en place, publiées, et chacune vérifiée par une recette rejouée ou une mesure.

## 2. Verdict en une ligne

Pilot publié `975d7eee..bba9d080` (10 enregistrements) ; 11 recettes vertes sur l'arbre fusionné ; essai du relecteur neuf : rappel 4 sur 6, faux signalements 9 sur 27.

## 3. Décisions attendues

- **D-85** : suite de l'essai du relecteur neuf, posée le 26/10 à 22:47, inchangée.

## 4. Traité

- D-81 (b) : TF-1945 clos ; `render_page.py` ligne 3086 porte V23 « bloquant » sur la forge publiée, et le registre des échéances ne nomme pas V23.
- D-83 (a), registre commun des réservations : commits `1816064a` et `6cde28b4` fusionnés. La recette, rendue étanche à la session qui la joue, rend `reserver-decision : 107/107` sur l'arbre fusionné.
- D-82 (a), critique exigée d'office : commit `91d6f046` fusionné.
  - Contrôle CRITIQUE averti jusqu'au 02/11/2026, bloquant dès le 03/11/2026.
  - Rejeu sur 1 139 tours du poste : 18 accusés, aucun tour d'outillage du pilot.
  - Recettes : `hook-restitution : 59/59`, `hooks-factory : 29/29`.
- Fusion D-82 sur D-83 (`96b10089`) : 4 conflits levés. Une seule version 2.51.0 du gabarit de restitution et 1.40.0 du contrat d'héritage décrit les deux changements.
- Recettes rejouées sur l'arbre fusionné : `hook-restitution 59/59`, `hook-restitution-moyen 21/21`, sélection 7/7, `hooks-factory 29/29`, `reserver-decision 107/107`, `hook-ouverture 44/44`, `relever-heritage 46/46`, `recopier-heritage 20/20`, `compter-lecture-usage 35/35`, banc des restitutions 11/11, `oracle-synthese` 242/242.
- D-84 (a), essai : 33 réponses valides, comptage pré-enregistré au commit `458be603`, rejoué depuis `main`. Résultat : rappel 4 sur 6, tenu ; faux signalements 9 sur 27, non tenu. Jetons : 1 985 931, dans le budget accordé. La recette du comptage a été corrigée pour les fins de ligne CRLF (`7aea06b7`).
- Registre : TF-1911 et TF-1913 annotés de leur construction, TF-1944 de son résultat ; D-85 réservée.
- Envoi : `975d7eee..bba9d080 main -> main`, puis `git status -sb` rend `## main...origin/main`.
- Relecture d'intention : sert, pour les consignes (RI-20261026-13), la réception de D-83 (RI-20261026-14, 1 écart mineur) et celle de D-82 (RI-20261026-16).

## 5. Non traité

- La clôture de TF-1911 et TF-1913 — motif : dependance_externe, leur gain se constate en service, sur le journal des hooks après le 03/11 et chez les produits.
- Les trois arbres de travail des agents, laissés sur le disque — motif : limite, leurs branches sont fusionnées et l'outil d'arbre isolé ne retire que ceux restés sans changement.
- Les échecs préexistants de l'agrégat des recettes (`oracle-skills` 96/100, `banc-mutation` sous son plancher), relevés à l'identique avant les changements par les agents — motif : hors_mandat.

## 6. Écarts à la lettre

- Vous avez demandé un relecteur « sans outil » → chaque lecteur a lu un seul fichier d'invite → recopier 33 invites de 3 000 à 50 000 caractères exposait à des erreurs de recopie ; le fichier ne porte aucune étiquette de cas.
- La réponse de LU-15 est comptée en « essai 2 » → c'est ma recopie qui l'avait cassée, l'outil shell réduisant `\\` à `\` → sa réponse exacte a été réenregistrée par un fichier écrit directement.

## 7. Risques

- Deux jetons Meta collés en clair dans une conversation du 18/10. Signal : ils restent dans les transcriptions du poste. Parade : les renouveler (A-2).
- Le contrôle CRITIQUE accuse aussi 4 cas discutables sur 18 (instantanés « avant », script collé dans la console). Signal : avertissements sur ces formes pendant la période d'essai. Parade : relire le journal avant le 03/11 (A-1).

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 avant le 03/11, date où le contrôle CRITIQUE devient bloquant.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1913 | Relire les accusations CRITIQUE de la période d'avertissement et classer les faux positifs avant le blocage | auto_ia | dependance_externe : il faut des tours réels d'ici le 02/11 | champ `critique` de `.claude/hooks-journal.jsonl` | un faux positif bloque des tours dès le 03/11 |
| **A-2** | `neuve` | Renouveler les deux jetons Meta collés en clair le 18/10 | manuelle_utilisateur | irreversible : seul le titulaire du compte Meta peut révoquer un jeton | console Meta pour développeurs, application concernée, section des jetons d'accès : révoquer, puis régénérer | un jeton exposé reste utilisable par qui lit les transcriptions |

## 9. Traces

- Publication `975d7eee..bba9d080` sur GitHub ; fusions `790a6dc7`, `66ea37f6`, `96b10089`.
- `oracles/hook-restitution.mjs`, `oracles/lib-decisions.mjs`, `scripts/reserver-decision.mjs`, `gabarits/RESTITUTION.md` (2.51.0), `gabarits/HERITAGE.json` (1.40.0).
- `references/LECTURE-USAGE.md`, `references/LECTURE-USAGE-PREENREGISTREMENT-20261026.md`, `scripts/compter-lecture-usage.mjs`.
- `todo/TODO.jsonl`, `decisions/REGISTRE.jsonl`, `todo/relectures-intention.jsonl`.
