---
destinataire: humain
---

# Synthèse Mandat — pilot publié après reconstruction sur le distant, décision « 2a » exécutée (16/10/2026)

## 0. Synthèse d'ouverture

Le pilot est publié : les garde-fous Supabase et le travail du jour de ce poste sont maintenant sur le dépôt partagé, et les produits les recevront à leur prochaine ouverture. Le travail du 15/10 que l'autre poste avait déjà publié a été gardé dans sa version publiée, et le doublon de ce poste écarté, avec une sauvegarde complète. Aucune décision ne vous attend dans ce tour.

## 1. En-tête d'identification

Exécution de la décision « 2a » (publier le pilot après rebase) sur le dépôt du pilot digit-ai-factory. Période : 16/10/2026 de 15:31 à 16:20, heure de Paris (UTC+02:00), soit 49 minutes. Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : que les garde-fous Supabase et le travail du jour atteignent les produits, sans écraser ce que l'autre poste a déjà publié.

Test rétro : le résultat sert cette intention. Le distant porte les enregistrements de ce poste, et la version publiée de la reprise entre postes y reste intacte.

## 2. Verdict en une ligne

23 enregistrements publiés (0cabc144..f80ec0ac), rev-list 0 0 ; 5 doublons du 15/10 écartés ; recette de la reconstruction 219 oracles sur 221, les 2 défauts du parc levés ensuite.

## 3. Décisions attendues

Aucune décision ne vous attend dans ce tour.

## 4. Traité

- **Sauvegarde avant toute réécriture.** La branche locale `sauvegarde-avant-rebase-20261016` garde l'ancien main entier (ebdec59e, 26 enregistrements d'avance).
- **Reconstruction hors de l'arbre partagé.** Deux sessions travaillaient dans le pilot : la reconstruction s'est faite dans un arbre séparé, branché sur le distant.
  - 21 enregistrements de ce poste rejoués, conflits limités aux index générés et au registre.
  - 5 écartés : reprise entre postes, héritage 1.27.0, TF-1820 et TF-1821, déjà publiés par l'autre poste ; `git cherry` ne trouvait aucun équivalent exact, la comparaison s'est faite par sujet.
- **Registre réparé.** `oracle-todo` rendait 6 FAIL (R5, R9) : l'union avait repris les événements des enregistrements écartés. Les 8 lignes retirées, il rend exit 0. Le TF-1828 de ce poste, sujet différent du TF-1828 publié, devient TF-1838, avec le champ `renumerote_depuis`.
- **Recette complète de la reconstruction.** `node oracles/self-tests.mjs` rend 219 oracles sur 221. Les deux défauts portaient sur le parc :
  - sceaux : ma renumérotation avait modifié la synthèse scellée du 15/10. Texte scellé rétabli, `verifier-jugement` PASS ;
  - empreintes : le site `verifier-gabarits.mjs` de forge-audit, publié mais non déclaré, entre dans `EMPREINTES.md` ; `oracle-empreintes` PASS sur l'arbre principal réaligné.
- **Publication.** `FORGE_PUSH_GO` cite votre réponse « 2a ». Le hook de pré-publication passe, le push sort à 0 (`0cabc144..f80ec0ac`), et `git rev-list --left-right --count HEAD...origin/main` rend 0 0 après fetch.
- **Arbre principal réaligné.** main porte la version publiée plus 3 enregistrements arrivés d'autres sessions pendant le travail (classement de `output\04-plans`, revues datées, synthèse Terraform), rejoués dans l'ordre. Le conflit du cliquet des recettes a gardé le compte le plus haut. Les modifications non enregistrées d'une session fermée ont été réappliquées telles quelles.

## 5. Non traité

- **Publication des 3 enregistrements des autres sessions.** Motif : hors_mandat, votre « 2a » portait sur les enregistrements existants au moment de la décision ; chacune de ces sessions demandera son feu vert.
- **Relèvement du cliquet pour les recettes Supabase** (conformité 185 cas, captures du `.gitignore` 10 cas). Motif : hors_mandat, le cliquet n'échoue qu'à la baisse, et la prochaine recette complète le relève d'elle-même.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Rebaser le pilot puis publier | Reconstruction dans un arbre séparé, puis réalignement de main | Deux sessions écrivaient dans l'arbre partagé, et un rebase sous elles aurait remisé leur travail |
| Rejouer la recette | Recette jouée sur la reconstruction, pas après le rejeu des 3 enregistrements des autres sessions | Ces 3 enregistrements ne sont pas publiés ; leur recette revient à la session qui les publiera |

## 7. Risques

- **La synthèse du 15/10 au soir décrit un travail qui n'est pas publié.**
  - Énoncé : elle cite des enregistrements écartés au profit de la version de l'autre poste ; son texte scellé ne peut pas être corrigé sans nouvel indice.
  - Signal : un lecteur qui cherche ses SHA au distant ne les trouve pas.
  - Parade : la branche `sauvegarde-avant-rebase-20261016` les garde, et la présente synthèse dit pourquoi.

## 8. Prochaines actions

Une seule action reste, donc aucun ordre à justifier entre plusieurs : elle passe d'abord par le feu vert de chaque session qui a produit ces enregistrements.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Publier les 3 enregistrements locaux des autres sessions | auto_ia | hors_mandat : chaque session demandera son feu vert | `FORGE_PUSH_GO="<décision humaine citée>" git push origin main` | Le classement de `output\04-plans` et les revues datées restent sur ce poste |

## 9. Traces

- Distant : f80ec0ac ; branche locale `sauvegarde-avant-rebase-20261016` (ebdec59e)
- main local : 5dde934f, 9be1a57d, 8c6adbd4 (non publiés)
- `todo/TODO.jsonl` (TF-1838), `references/EMPREINTES.md`, `oracles/baseline-recettes.json`
