---
destinataire: humain
---

# Synthèse Mandat — dépôts privés silencieux et confirmation d'installation en fin de commande (13/10/2026)

## 0. Synthèse d'ouverture

Chez un développeur sans accès à vos 2 dépôts privés, la mise à jour du poste n'en dit plus un mot : ni erreur, ni avertissement, ni contrôle de leur contenu. Elle se termine par un bandeau « FACTORY DIGIT-AI CORRECTEMENT INSTALLÉE » quand aucun défaut ne reste. Je l'ai vérifié en conditions réelles depuis GitHub, sur un poste simulé sans aucun identifiant : 13 forges clonées, sortie 0, aucune ligne qui nomme un dépôt privé, bandeau affiché. Sur votre poste, où ces dépôts sont clonés, rien ne change : ils restent contrôlés comme avant. Le correctif est publié.

## 1. En-tête d'identification

- **quoi** — mandat : ne plus afficher les erreurs des dépôts privés absents, ne plus les compter comme erreurs, et confirmer en fin de commande que la Factory est bien installée.
- **sur quoi** — pilot `digit-ai-factory`, commit `3f12d78d`, publié ; suite du commit `10d7d389` du même jour.
- **quand** — 2026-10-13, de 17:15 à 17:35 UTC+02:00 (Europe/Paris), heure relevée par `date` à 17:33.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `bootstrap.test.mjs`, `bootstrap-parc.test.mjs`, `scripts/installer-projet.test.mjs`, `bootstrap.mjs` contre GitHub sans identifiants.
- **intention** — que l'autre développeur voie une installation propre et sache sans interpréter que la Factory est prête. **Test rétro** : servie sur le poste simulé sans identifiants, qui reproduit son cas ; chez lui, elle se constatera à sa prochaine mise à jour.

## 2. Verdict en une ligne

**TENU — poste simulé sans identifiants : exit 0, 0 ligne sur les dépôts privés, bandeau « FACTORY DIGIT-AI CORRECTEMENT INSTALLÉE — 13 dépôt(s) de forge présent(s) et à jour, 0 défaut » ; recette 27/27, sens rouge joué.**

## 3. Décisions attendues de l'humain

- aucune décision en attente.

## 4. Traité — avec sa preuve

- **Silence** : un dépôt déclaré privé dont le clone est refusé pour cause d'accès n'écrit plus aucune ligne, n'entre ni dans les défauts ni dans les avertissements, et son fichier témoin n'est pas contrôlé. Une panne réseau ou une forge publique introuvable restent des défauts.
  - preuve : cas 4 bis de `bootstrap.test.mjs`, qui exige qu'aucune ligne de sortie ne contienne le nom du dépôt privé ; recette 27/27, `bootstrap-parc.test.mjs` 7/7.
- **Bandeau de confirmation** en fin de `bootstrap.mjs` quand il n'y a aucun défaut, avec le nombre de forges présentes.
  - preuve : même cas 4 bis, qui exige le bandeau ; `scripts/installer-projet.test.mjs` 17/17, l'installateur qui lit cette sortie reste vert.
- **Sens rouge** : le cas joué sur la version précédente échoue.
  - preuve : « motif absent (/FACTORY DIGIT-AI CORRECTEMENT INSTALLÉE/) » et « le dépôt privé hors d'accès s'affiche encore — [avert] digit-ai-queue — dépôt PRIVÉ hors d'accès » ; fichier restauré, `git diff --stat` → 14 insertions, 9 suppressions.
- **Essai réel** : `bootstrap.mjs` joué contre GitHub dans une racine neuve, configuration git vide et invite d'identifiants coupée, ce qui reproduit un compte sans droit.
  - preuve : exit 0 ; `grep -ciE "queue|confidentiel"` sur la sortie → 0 ; 13 dossiers de forge clonés ; bandeau affiché. Racine d'essai supprimée ensuite.
- **Publication**, mandat permanent d'écriture et de push du pilot.
  - preuve : `git push` → « 7d4816aa..3f12d78d main -> main », `git rev-list --count origin/main..HEAD` → 0.

## 5. Non traité — avec son motif

- L'essai sur le poste du développeur lui-même — motif : `hors_mandat`, son poste n'est pas joignable d'ici ; l'essai réel ci-dessus reproduit son cas.
- La ligne « skills alignés » s'imprime aussi quand les skills ne sont pas jugés, en mode d'essai seulement — motif : `hors_mandat`, sans effet sur une installation normale, qui juge les skills.

## 6. Écarts à la lettre

- **La demande disait** « que ces erreurs ne s'affichent plus » → **sur votre poste, un dépôt privé déjà cloné reste contrôlé et peut encore signaler un défaut** → **pourquoi** : le silence ne vaut que pour un dépôt absent et refusé ; un dépôt présent mais en retard est un vrai défaut que vous devez voir.

## 7. Risques

- Si vous perdiez l'accès à un dépôt privé sur un poste neuf, son absence passerait sans un mot.
  - signal : le dossier `_confidentiel` ou `digit-ai-queue` manque après la mise à jour d'un de vos postes ;
  - parade : vos postes existants les portent déjà clonés, et un clone présent est contrôlé comme une forge.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Faire relancer `node bootstrap.mjs --pull` au développeur et vérifier le bandeau « FACTORY DIGIT-AI CORRECTEMENT INSTALLÉE » | `manuelle_utilisateur` | neuve | `presence` — la commande se joue sur son poste ; essai : `ls /Users/onyai/.digit-ai-forge` → « No such file or directory », exit 2 | le résultat chez lui reste non constaté |

## 9. Traces

`bootstrap.mjs`, `bootstrap.test.mjs`, commit `3f12d78d`.
