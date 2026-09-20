---
destinataire: humain
---

# Synthèse de mandat — votre « 4b » est exécuté à moitié : l'enregistrement est fait, la publication est refusée par la porte des noms sur 11 fichiers qui ne sont pas de ce travail ; il vous reste à dire quoi faire du nom refusé (17/09/2026)

Votre décision est exécutée pour sa première moitié : le travail de ce matin est enregistré dans git, par chemins nommés, sans emporter celui de l'autre session. La seconde moitié a échoué, et c'est voulu par vos règles : la porte qui juge un dépôt avant tout envoi refuse la publication, parce que 11 fichiers suivis portent le nom du dépôt de marketing de l'écosystème, que sa table tient pour un nom de produit interdit. Aucun de ces 11 fichiers ne vient de ce travail. Je n'ai pas contourné la porte. Ce que cela change pour vous : rien n'a quitté le poste, et le dépôt est maintenant en avance de 33 enregistrements. En chemin, le contrôle de fin de tour a refusé ma réponse précédente pour une raison fausse, que j'ai corrigée. Ce qui est attendu de vous : dire si ce nom est vraiment à cacher.

## 1. En-tête d'identification

- **quoi** — exécution de votre décision « 4b », c'est-à-dire l'option (b) de la décision sur l'enregistrement et la publication des 4 tours de ce matin ; plus la correction du contrôle de fin de tour qui bloquait la remise.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; son dépôt distant, non modifié.
- **quand** — 2026-09-17 10:40 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 10:17 ; durée mesurée ≈ 23 min, dont 10 min pour 2 recettes complètes du pilot.
- **qui** — pilot `ba68fbc` (enregistrement de ce tour, sur `b284504`) ; session Fable 5.1, aucune délégation, escalade de modèle : aucune ; oracles joués : recette du hook de fin de tour, recette complète du pilot, porte de publication (2 passages), `oracle-todo` *(juge du registre)* et `oracle-synthese` sur ce document.
- **intention** — protéger le travail de ce matin et le publier. Test rétro : le travail est protégé ; il n'est pas publié, et la cause est hors de ce travail.

## 2. Verdict en une ligne

**Enregistrement `ba68fbc` fait : 29 fichiers, par chemins nommés ; publication REFUSÉE, exit 1, par la porte des noms : 40 occurrences d'un nom interdit dans 11 fichiers suivis, 0 dans les fichiers de ce travail ; dépôt en avance de 33 enregistrements, distant inchangé ; contrôle de fin de tour corrigé, recette 23/23 PASS (22 avant), candidature TF-1168 ; recette complète du pilot 123 oracles sur 124, même échec antérieur.**

## 3. Décisions attendues de l'humain

Bloquants — un travail est à l'arrêt, et voici ce qui le lève :

- **ce qui est bloqué** : la publication du pilot, 33 enregistrements en attente ; **ce qu'il faut décider** : si le nom du dépôt de marketing de l'écosystème, `Produit-66`, est un nom à cacher, puisque c'est lui seul que la porte refuse ; **si rien n'est fourni** : rien n'est publié, l'avance du dépôt continue de grandir, et les skills de la forge des outils restent non propagés.

> **D-5 — Le nom `Produit-66` doit-il rester interdit dans le dépôt public du pilot, et que fait-on des 11 fichiers qui le portent ?**
>
> La porte de publication refuse l'envoi du pilot parce que 11 fichiers suivis portent `Produit-66`, que sa table range parmi les noms de produits interdits. Ce nom désigne un dépôt de votre écosystème, publié sous votre compte, que le relevé d'ouverture signale par ailleurs comme « hors liste : ni forge suivie, ni second clone, ni mise de côté ». Les 11 fichiers sont : la spécification produit du 11/09 qui porte ce nom jusque dans son titre, l'étude sur la communication et le marketing du 11/09 et sa page, 2 fichiers de candidatures du 11/09, et 6 fichiers de l'étude d'aujourd'hui sur la gestion des réseaux sociaux, écrits par une autre session. Aucun ne vient du travail sur la revue hebdomadaire.
>
> **Recommandation : (a).** Source consultée : la sortie de la porte de publication jouée 2 fois aujourd'hui (règle des noms de produits, 40 occurrences, 11 fichiers) ; le relevé d'ouverture de cette session, qui nomme ce dépôt avec son origine publique et demande de l'inscrire ou de le déclarer hors périmètre ; `REGLES-PROJET.md`, la règle 38, qui fait de toute publication un GO humain. Un dépôt public de votre propre écosystème n'est pas un client à protéger : le retirer de la table corrige la cause, là où réécrire 11 fichiers traite le symptôme et se refera au prochain livrable.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** déclarer ce dépôt membre de l'écosystème : le retirer des noms interdits et l'inscrire à la liste des dépôts suivis, puis republier | effort simple × court ; la table des noms vit hors du dépôt, je la modifie sur votre ordre et je rejoue la porte | exclut de cacher ce nom à l'avenir |
| **(b)** garder l'interdit : pseudonymiser le nom dans les 11 fichiers, dont 6 appartiennent à l'autre session et 1 le porte dans son nom de fichier, puis republier | effort moyen × court ; renommage d'un livrable déjà cité ailleurs | exclut la lisibilité de ces documents pour vous, qui possédez le nom |
| **(c)** ne pas publier | effort nul | exclut toute publication du pilot tant que ces fichiers existent |

> **Si rien n'est décidé** : l'option (c) s'applique — le dépôt reste en avance, rien n'est publié.

## 4. Traité — avec sa preuve

- **Votre « 4b » a reçu son geste, première moitié : l'enregistrement.** 29 fichiers, désignés un par un, pour que le travail de l'autre session présent à l'index ne parte pas avec.
  - preuve : `git commit --only -F <message> -- <29 chemins>` → exit 0 ; `git log --oneline -1` → « ba68fbc Revue hebdomadaire de l existant : etude jouee, sondes etendues, descente par produit, S48 ».
- **Seconde moitié : la publication est tentée, et refusée 2 fois.** Le premier refus demandait le GO humain nommé ; je l'ai fourni tel que vous l'avez donné. Le second vient de la porte des noms.
  - preuve : `git push origin main` → « PUBLICATION REFUSEE - un enregistrement en avance exige le GO humain explicite », suivie de la liste des enregistrements en avance ; puis `FORGE_PUSH_GO="D-4 (b) du 17/09" git push origin main` → 40 lignes « C5 … nom de produit interdit », exit 1, « failed to push some refs » ; `git rev-list --count origin/main..HEAD` → 33.
- **Les fichiers de ce travail ne portent pas le nom refusé.**
  - preuve : `git grep -l` du nom sur les 9 livrables et les fichiers de sondes de ce travail → aucune ligne ; décompte des refus par fichier → 11 fichiers, tous d'une autre origine.
- **Le contrôle de fin de tour jugeait le mauvais fichier, et c'est corrigé.** Il a refusé ma réponse précédente en la comparant au gabarit de restitution, pris pour la synthèse du tour : le gabarit cite le marqueur des synthèses dans sa prose, et je l'avais édité dans le tour. Classe : `restitution-fichier-juge-mal-choisi`. Le marqueur se lit maintenant en tête de ligne seulement.
  - preuve : contrôle rouge → vert : l'ancienne expression rend « true » sur l'en-tête du gabarit, la nouvelle « false » ; `node oracles/hook-restitution.test.mjs` → « 23/23 », 3 cas neufs qui ne diffèrent que par la position du marqueur ; candidature ingérée → « [OK] 1 candidature(s) ingérée(s) en CANDIDAT », TF-1168.
- **Rien d'autre n'est cassé.**
  - preuve : `node oracles/self-tests.mjs` → 123 oracles sur 124, cliquet « hook-restitution.test.mjs : 22 → 23 cas » ; un premier passage avait rendu « 22 → 17 cas » parce que le cliquet lisait la date de mon message comme un compte, message reformulé et rejoué ; `node todo/oracle-todo.mjs` → `"verdict": "PASS"`.

## 5. Non traité — avec son motif

- La publication du pilot — motif : bloqué par un garde-fou, la porte des noms, que je n'ai pas contournée ; dépendance à une décision humaine (D-5).
- La correction des 11 fichiers — motif : dépendance à une décision humaine (D-5) ; 6 d'entre eux appartiennent à une autre session en cours.
- Le défaut voisin du contrôle de fin de tour, un fichier renommé hors outil d'écriture après son dépôt qui sort de la liste du tour — motif : hors mandat ; consigné dans TF-1168.
- La faiblesse du cliquet des recettes, qui prend une date pour un compte — motif : hors mandat ; constat en passant, à verser au registre avec le prochain lot.

## 6. Écarts à la lettre

- **Vous avez écrit** « 4b », enregistrer et pousser → **j'ai enregistré, et la publication a échoué** → **pourquoi** : la porte de publication est un garde-fou voulu ; la commande de contournement qu'elle affiche n'est pas un geste que je prends.
- **Vous avez demandé** l'enregistrement des 4 tours → **l'enregistrement porte aussi** le registre entier, donc les événements écrits ce matin par l'autre session, et le relevé des comptes de recettes, dont 2 lignes ne sont pas de moi → **pourquoi** : ces 2 fichiers sont uniques et partagés, ils ne se découpent pas par auteur.
- **Hors du périmètre demandé**, 1 correction : le choix du fichier jugé par le contrôle de fin de tour, parce qu'il bloquait la remise de la réponse précédente.

## 7. Risques

- L'avance du dépôt grandit, et la prochaine publication emporte encore plus d'enregistrements à relire ;
  - signal : le relevé d'ouverture affiche une avance supérieure à 33 ;
  - parade : trancher D-5 ; l'option (a) débloque en un passage.
- L'autre session enregistre ses 6 fichiers tels quels, et le refus de la porte s'étend à ses propres tentatives ;
  - signal : le même refus rendu dans son tour ;
  - parade : D-5 règle les 2 cas d'un coup, puisque la cause est la table et non les fichiers.
- La synthèse précédente, affichée avant la correction du contrôle, dit « aucun enregistrement » et date de 10:16 ;
  - signal : vous la relisez sans celle-ci ;
  - parade : acceptation déclarée ; elle était vraie à son heure, et cette synthèse la suit dans le même dossier.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), celle qui débloque la publication avant le constat à verser ; puis la décision humaine.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Appliquer l'option choisie en D-5, rejouer la porte de publication, puis pousser le pilot sous le GO déjà donné (neuve) | auto_ia | `dependance_bloc_3` — attend D-5 ; à défaut, 33 enregistrements restent sur le poste | simple × court |
| A-2 | Verser au registre le constat sur le cliquet des recettes qui lit une date comme un compte de cas (neuve) | auto_ia | `hors_mandat` — relève du prochain mandat de traitement des retours et candidatures ; à défaut, le prochain message de recette portant une date rendra un faux « cas perdus » | simple × court |
| A-3 | Trancher D-5 — répondre « D-5 (a) », « D-5 (b) » ou « D-5 (c) » (neuve) | manuelle_utilisateur | `decision` — dire si un nom est à cacher est votre arbitrage ; sinon : rien n'est publié | simple × court |

## 9. Traces

- Enregistrement : `ba68fbc`, sur `b284504` ; dépôt distant inchangé, dernier enregistrement publié `71bca78`.
- Correction du contrôle de fin de tour : `oracles\hook-restitution.mjs` et sa recette ; candidature `input\01-candidatures\hook-restitution-gabarit-juge-a-la-place-20260917a.tf.jsonl`, item TF-1168.
- Synthèse précédente, vraie à son heure : indice `20260917g` de `output\04-plans\`.
- Oracles : porte de publication (2 refus, exit 1) ; recette du hook de fin de tour (23/23) ; recette complète du pilot (123 sur 124, échec antérieur) ; `oracle-todo` (PASS) ; `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour.
