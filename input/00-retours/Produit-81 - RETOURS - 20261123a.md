# Retours forges — Produit-81 — 20261123a

- **Contexte** : support de présentation Design Authority de Produit-81 (indices a à c du 23/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 42 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-29 (majeur) — Un état d'environnement repris de la documentation du dépôt, sans mesure sur la cible

**Le fait.** Le 23/11/2026, le support Design Authority de Produit-81 (indices a et b) affirmait sur trois diapositives que la branche `env/uat` n'existait pas et que la chaîne de qualification restait inerte. Le porteur l'a relevé à la lecture. Mesure faite ensuite : `env/uat` existe sur le dépôt distant, et le run GXY_App 18916 du 10/11/2026 y a réussi la promotion puis le déploiement en H1. La session avait repris l'état écrit dans `docs/ACTIONS-HUMAINES.md` (ligne 108) et `infra/README.md` (ligne 581), restés à « à créer », sans interroger `git ls-remote` ni l'API Azure DevOps.

**Le coût, prouvé.** Une affirmation fausse sur l'état de la qualification dans un support destiné à la Design Authority. Un retour du porteur, puis un indice de plus (c) pour corriger trois diapositives.

**La règle qui aurait évité le retour.** Un état d'environnement, de branche ou de déploiement porté dans un livrable se mesure sur la cible au moment de l'écrire (`git ls-remote`, API Azure DevOps, Azure), jamais sur la seule documentation du dépôt ; le livrable cite la commande ou le run qui le prouve. **Clé proposée** : `etat-d-infrastructure-repris-de-la-documentation`, famille `donnees-perissables-en-dur`, libellé « Un livrable affirme l'état d'un environnement, d'une branche ou d'un déploiement d'après la documentation du dépôt, sans le mesurer sur la cible : la documentation en retard passe pour un état ».

**Juge proposé.** Cas rouge d'un oracle de livrable de synthèse : une phrase qui dit une branche ou un environnement absent, sans référence de mesure (commande, run, relevé daté), est signalée ; la même phrase suivie de sa preuve passe.

## Rattachement

Registre interrogé le 23/11/2026 : `todo/CLASSES.json` du pilot (331 classes). La plus proche, `analyse-de-depot-sur-copie-perimee`, vise une copie locale en retard sur son distant ; ici la copie était à jour et c'est la documentation versionnée qui retardait sur l'état réel de la plateforme. D'où une clé neuve en `classe-a-creer`, dans la même famille.

## Remarques restées au produit

- Correction des deux documents périmés (`docs/ACTIONS-HUMAINES.md`, `infra/README.md`) : proposée au porteur, reste au produit — généralisable : non (contenu propre à Produit-81 ; la règle générale est portée par RT-29).

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
