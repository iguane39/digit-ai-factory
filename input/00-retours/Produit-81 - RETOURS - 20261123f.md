# Retours forges — Produit-81 — 20261123f

- **Contexte** : support de présentation Design Authority de Produit-81 (indice i du 23/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 49 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-36 (majeur) — La règle Client-A d'usage de l'APIM, non écrite, déduite deux fois de travers

**Le fait.** Le 23/11/2026, après une première correction du porteur (pas d'APIM entre les composants d'une même application, ni avec PRISM, ni pour la Data Factory ; RT-34, lot 20261123e), la session a gardé l'APIM devant l'API de déclaration des enseignes. Son motif : les appelants sont des systèmes tiers. Le porteur précise que cette API est interne à l'application et ne passe pas non plus par l'APIM : aucune API de Produit-81 n'y passe. La règle Client-A qui dit quelles API passent par l'APIM n'est écrite ni dans le dépôt ni dans le projet commun. La demande à Connectivity préparée le 16/10 et le plan d'audit disaient l'inverse.

**Le coût, prouvé.** Deux indices successifs faux sur l'APIM (f puis h), relevés par le porteur. Un indice de plus (i).

**La règle qui aurait évité le retour.** La règle Client-A d'usage de l'APIM est écrite dans le projet commun : quelles API y passent, lesquelles non. Un livrable la cite au lieu de la déduire. Faute de règle écrite, la session pose la question au porteur avant de placer une APIM. **Rattachement proposé** : la clé `recommandation-recopiee-sans-jugement` proposée par RT-34 couvre la première erreur. Celle-ci tient à une règle de référentiel absente, d'où une clé neuve : `regle-de-referentiel-absente-deduite`, famille `donnees-perissables-en-dur`, libellé « Une règle du référentiel de l'organisation n'est écrite nulle part ; la session la déduit de principes généraux et se trompe, là où une question au porteur aurait suffi ».

**Juge proposé.** Relecture d'un livrable d'architecture : chaque placement d'APIM (ou de tout composant mutualisé) cite la règle du projet commun qui le fonde ; sans citation, le placement est signalé comme une déduction à faire valider.

## Rattachement

Registre interrogé le 23/11/2026 : `todo/CLASSES.json` du pilot (331 classes) ; aucune classe ne vise une règle d'organisation absente du référentiel. Clé neuve en `classe-a-creer`.

## Remarques restées au produit

- Demande à Connectivity (`docs/decisions/demandes/connectivity-apim-waf.md`) à recadrer sur le WAF de production seul — généralisable : non.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
