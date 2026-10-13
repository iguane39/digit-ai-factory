---
destinataire: humain
---

# Synthèse Mandat — dépôts privés hors d'accès non bloquants pour un poste tiers (13/10/2026)

## 0. Synthèse d'ouverture

Le développeur n'avait pas de défaut réel : son compte n'a pas accès aux 2 dépôts privés de la file de tickets et du canal confidentiel, dont vous êtes le seul collaborateur, et l'amorçage du poste les jugeait obligatoires. Sa capture me montre le même refus de GitHub par 2 voies, le clone et l'outil en ligne de commande. Ses 3 défauts venaient de là : 2 clones refusés, puis la preuve de la file de tickets jugée absente faute de clone. Désormais un dépôt privé refusé se dit en avertissement, avec le geste pour obtenir l'accès, et le poste est jugé sur le reste du parc. Le correctif est publié : sa prochaine mise à jour du poste doit rendre « Poste prêt ».

## 1. En-tête d'identification

- **quoi** — mandat : expliquer les 3 défauts du bootstrap d'un développeur tiers, empêcher qu'ils se reproduisent, appliquer.
- **sur quoi** — pilot `digit-ai-factory`, commit `10d7d389`, publié.
- **quand** — 2026-10-13, de 16:50 à 17:10 UTC+02:00 (Europe/Paris), heure de fin relevée par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `gh repo view`, `gh api …/collaborators`, `bootstrap.test.mjs`, `bootstrap-parc.test.mjs`, recettes des consommateurs de `scripts/lib-parc.mjs`.
- **intention** — qu'un autre développeur puisse utiliser la Factory sans être déclaré « non prêt » pour des dépôts réservés au propriétaire. **Test rétro** : servie sur le poste simulé de la recette, où le dépôt privé refusé laisse le poste prêt ; chez le développeur, elle se constatera à son prochain `--pull`.

## 2. Verdict en une ligne

**TENU — un dépôt privé refusé ne bloque plus le poste ; recette `bootstrap.test.mjs` 27/27, sens rouge joué sur l'ancien bootstrap (exit 1 et « preuve absente »), publié jusqu'à `10d7d389`.**

## 3. Décisions attendues de l'humain

- aucune décision en attente : l'accès des autres développeurs aux 2 dépôts privés reste un choix que vous pouvez faire à tout moment, sans qu'il conditionne leur poste (A-2).

## 4. Traité — avec sa preuve

- **Cause mesurée** : les 2 dépôts sont privés et n'ont qu'un collaborateur.
  - preuve : 2 sondes de nature différente, depuis votre compte qui a l'accès : l'API GraphQL par `gh repo view` → `"visibility":"PRIVATE"` pour les 2, et l'API REST par `gh api repos/iguane39/digit-ai-queue/collaborators` → `iguane39` seul. Côté développeur, sa capture montre le même refus par 2 voies : `git clone` (« remote: Repository not found ») et `gh repo view` (« Could not resolve to a Repository »).
- **Cause dans le code** : `digit-ai-queue` figure dans la liste des forges de `scripts/lib-parc.mjs` depuis TF-0535, et le canal confidentiel est tiré comme une forge ; tout clone refusé y était un défaut, et la preuve `protocole/README.md` était jugée même sans clone.
  - preuve : lecture de `bootstrap.mjs` lignes 290 et 318 avant correction.
- **Correctif** : drapeau `prive: true` sur les 2 dépôts et motif `ACCES_REFUSE` dans `scripts/lib-parc.mjs` ; dans `bootstrap.mjs`, un clone refusé d'un dépôt privé devient un avertissement qui nomme le geste d'accès, et sa preuve n'est plus jugée. Une panne réseau ou une forge publique introuvable restent des défauts.
  - preuve : cas 4 bis ajouté à `bootstrap.test.mjs`, deux sens ; recette 27/27 et `bootstrap-parc.test.mjs` 7/7.
- **Sens rouge** : le même cas joué sur la version publiée avant correction échoue.
  - preuve : « exit 1, attendu 0 — [DEFAUT] digit-ai-queue — clone en échec » et « la preuve d'un dépôt privé hors d'accès est encore jugée en défaut » ; fichier restauré, `git diff --stat` → 20 insertions, 3 suppressions.
- **Non-régression** des autres lecteurs de la liste du parc.
  - preuve : `installer-projet.test.mjs`, `lib-parc.test.mjs` (5 PASS), `relever-heritage.test.mjs` → exit 0.
- **Publication** du pilot, mandat permanent d'écriture et de push du pilot.
  - preuve : `git push` → « 5ecdee34..10d7d389 main -> main », `git rev-list --count origin/main..HEAD` → 0.

## 5. Non traité — avec son motif

- L'essai sur le poste du développeur lui-même — motif : `hors_mandat`, son poste n'est pas joignable d'ici ; la recette simule son cas avec un dépôt source retiré.
- Les fichiers modifiés par d'autres sessions dans le pilot (hook d'ouverture, contrat d'héritage) — motif : `hors_mandat`, enregistrement limité à mes 3 fichiers par `git commit --only`.

## 6. Écarts à la lettre

- **La demande disait** « propose des solutions, puis applique les » → **une seule solution appliquée, l'accès donné aux dépôts n'est pas fait** → **pourquoi** : inviter un compte sur un dépôt privé ouvre des tables de pseudonymisation et des entrants confidentiels ; c'est votre choix (A-2), et le poste du développeur n'en dépend plus.

## 7. Risques

- Ma publication a emporté les 37 commits locaux antérieurs du pilot, qu'une autre session du jour avait posés sous sa décision D-1 de 17:02.
  - signal : la synthèse `20261013d` demande encore cette publication ;
  - parade : le commit `b6e66279` de cette session est arrivé par `fetch` à 17:05, publié depuis l'autre côté ; la question est donc close.
- Sur votre propre poste, un accès retiré par erreur à un dépôt privé ne serait plus qu'un avertissement.
  - signal : la ligne « dépôt PRIVÉ hors d'accès » apparaît chez vous ;
  - parade : le motif ne joue qu'à l'absence du clone ; vos clones présents restent jugés comme avant, retard compris.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Faire relancer `node bootstrap.mjs --pull` au développeur et vérifier « Poste prêt » avec 2 lignes « dépôt PRIVÉ hors d'accès » | `manuelle_utilisateur` | neuve | `presence` — la commande se joue sur son poste ; essai : `ls /Users/onyai/.digit-ai-forge` → « No such file or directory », exit 2 | le correctif reste non constaté chez lui |
| **A-2** | Si vous voulez qu'il lise la file de tickets : `gh api -X PUT repos/iguane39/digit-ai-queue/collaborators/<son compte>` | `manuelle_utilisateur` | neuve | `decision` — ouverture d'un dépôt privé | il travaille sans la file, ce qui est admis |

## 9. Traces

`bootstrap.mjs`, `bootstrap.test.mjs`, `scripts/lib-parc.mjs`, commit `10d7d389`.
