---
destinataire: humain
---

# Synthèse Mandat — reprise multi-poste construite, fusionnée avec l'autre poste, publication en attente (15/10/2026)

## 0. Synthèse d'ouverture

La reprise d'un produit d'un poste à l'autre est construite et enregistrée sur ce poste. Pendant ce travail, l'autre poste a publié 28 enregistrements qui reprenaient plusieurs des numéros que j'avais employés : j'ai fusionné son travail et renuméroté le mien, et toutes les recettes touchées sont vertes. Le harnais complet tourne sur le résultat fusionné. La publication attendra votre feu vert : le contrôle avant envoi l'exige pour cet ensemble, et je vous le demanderai avec le verdict du harnais.

## 1. En-tête d'identification

- **quoi** — point d'étape de l'exécution de « 3b » (reprise multi-poste), après une seconde fusion avec l'autre poste.
- **sur quoi** — pilot `digit-ai-factory`, enregistrements locaux `c609bfb7` (reprise multi-poste) et `808a98ca` (fusion de 28 enregistrements publiés), non publiés.
- **quand** — 2026-10-15, de 18:47 à 20:55 UTC+02:00 (Europe/Paris), heure relevée par `date`.
- **qui** — session de pilotage Claude Opus 5.5, sans agent ; escalade : aucune ; une autre session du même poste a proposé une résolution de la même fusion, comparée puis écartée.
- **intention** — qu'un développeur reprenne son produit sur n'importe lequel de ses postes sans rien copier à la main, et que les deux postes du pilot ne se contredisent pas. **Test rétro** : le mécanisme est servi et jugé sur le cas réel du 14/10 ; il ne l'est pas encore pour l'autre poste, qui ne le voit pas avant publication.

## 2. Ce qui reste à mesurer, et par quoi

Le harnais complet des recettes sur l'arbre fusionné — par `node oracles/self-tests.mjs`, lancé en arrière-plan ; au passage précédent, avant fusion, il rendait 215/220, et les 4 défauts nés du travail ont été corrigés et rejoués verts.

## 3. Décisions attendues de l'humain

Aucune décision n'est posée dans ce point d'étape. Les bloquants :

- la publication de `c609bfb7` et `808a98ca` : ce qui la lève, le verdict vert du harnais puis votre feu vert, que le contrôle avant envoi exige ; sans eux, l'autre poste ne voit pas la reprise multi-poste.

## 4. Traité — avec sa preuve

- **Seconde fusion avec l'autre poste** (28 enregistrements), 11 fichiers en conflit résolus à partir du côté publié ; mes numéros renumérotés : règle S75 → S77 (transport entre postes laissé à l'humain), restitution 2.39.0 → 2.40.0, héritage 1.24.0 → 1.26.0, classes 1.36.0 → 1.40.0, cas du lanceur 9 → 12.
  - preuve : `oracle-reprise.test` 8/8 ; `hooks-factory.test` 20/20 ; `ingerer-r47.test` 10/10 ; `relever-heritage` 41/41 ; `recopier-heritage` 20/20 ; conformité 184/184 ; `oracle-synthese --self-test` 177/177 ; `oracle-coherence-restitution` RC1 PASS (2.40.0) ; `oracle-empreintes` PASS ; `oracle-todo` PASS.
- **Défauts nés du travail avant fusion**, trouvés par le harnais (215/220) et corrigés : projets témoins mis à niveau, site d'empreinte déclaré et passé par la fonction partagée, sens rouge lisible.
  - preuve : conformité 163/172 → 172/172, `ingerer-r47` 8/10 → 10/10, `oracle-empreintes` FAIL → PASS.
- **Rouge préexistant consigné** : K11 d'`oracle-skills` (96/98), identique sur l'arbre publié, annoté sur TF-1611.
  - preuve : `oracle-skills --self-test` sur `origin/main` exporté hors du dépôt → 96/98.

## 5. Non traité — avec son motif

- La publication — motif : `dependance_externe`, le harnais n'a pas rendu son verdict, et le contrôle avant envoi exige ensuite votre feu vert.

## 6. Écarts à la lettre

Aucun écart à votre demande dans ce point d'étape ; la renumérotation est une conséquence de la fusion, consignée au registre sur TF-1736.

## 7. Risques

- L'autre poste peut publier encore avant moi et reprendre les numéros S77, 2.40.0 ou 1.26.0.
  - signal : `git status -sb` « behind » au moment de publier ;
  - parade : nouvelle fusion avant l'envoi, et numéros vérifiés à ce moment-là.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Lire le verdict du harnais complet et corriger tout rouge né de la fusion | `auto_ia` | TF-1736 | `dependance_externe` — harnais en cours | la fusion n'est pas prouvée |
| **A-2** | Vous demander le feu vert de publication, avec le verdict du harnais | `auto_ia` | TF-1736 | `dependance_externe` — attend A-1 | l'autre poste ne voit rien |

## 9. Traces

`todo/TODO.jsonl`, `todo/CLASSES.json`, `gabarits/HERITAGE.json`, `gabarits/RESTITUTION.md`, `oracles/oracle-synthese.mjs`, `gabarits/hooks-factory.test.mjs`, enregistrements `c609bfb7` et `808a98ca`.
