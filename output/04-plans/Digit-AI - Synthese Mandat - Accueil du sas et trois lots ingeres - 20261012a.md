---
destinataire: humain
---

# Synthèse Mandat — 4 lots du sas accueillis, 3 ingérés au registre (7 candidats), publication et 2 lots en attente de votre décision (12/10/2026)

## 0. Synthèse d'ouverture

Le pilot et ses 13 forges sont à jour du dépôt distant. La boîte d'entrée ne l'était pas. J'ai accueilli 4 lots qui attendaient au sas depuis le 01/10. Ils sont pseudonymisés sous les noms Produit-03 et Produit-64. Les 3 lots ingérés ajoutent 7 candidats au registre. Le 4e lot de Produit-03 est refusé, car il lui manque une section obligatoire. Les 3 lots du produit Produit-79 restent au sas : leur nom n'a pas de pseudonyme, et l'accueil refuse d'en inscrire un sans vous. Le commit est fait sur ce poste. Sa publication attend votre feu vert. 3 décisions vous reviennent.

## 1. En-tête d'identification

- **quoi** — votre réponse « ok » à ma proposition d'accueillir et d'ingérer les 9 lots en attente.
- **sur quoi** — pilot `digit-ai-factory`, de `e11ffcff` au commit `c461b2a6`, non publié ; sas `input/00-retours/_arrivee/`.
- **quand** — 2026-10-12, de 10:58 à 11:05 UTC+02:00 (Europe/Paris), heures relevées par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `todo/accueillir-lot.mjs` (essai puis réel), `todo/ingerer-lot.mjs` (essai sur une copie jetable du registre, puis réel), un script de notes de réception écrit pour ce tour, `oracle-todo`, `oracle-boite-entree`.
- **intention** — que le travail remonté par les produits entre au registre au lieu d'attendre. **Test rétro** : servie en partie. 7 retours sur 13 sont au registre. Les 6 autres attendent une décision ou une remise du produit, et chacun a son motif ci-dessous.

## 2. Verdict en une ligne

**PARTIEL — 4 lots accueillis sur 7 au sas, 3 ingérés sur 4 (7 candidats, TF-1603 à TF-1609), registre PASS après écriture, commit non publié.**

## 3. Décisions attendues de l'humain

Les 3 bloquants qui retiennent la suite, ce qui les lève, et ce qui se passe sinon :

- la publication du commit `c461b2a6` : votre décision D-58 ; sans elle, le registre et les lots restent sur ce poste, et l'autre poste peut frapper les mêmes numéros TF.
- les 3 lots Produit-79 au sas : votre décision D-59 ; sans elle, ils y restent, et la boîte d'entrée reste rouge à chaque ouverture.
- le lot Produit-03 du 02/10 (indice e) : votre décision D-60 ; sans elle, ses retours restent hors du registre.

> **D-58 — Publiez-vous le commit `c461b2a6` du pilot `digit-ai-factory` ?**
>
> Rappel du sujet : le commit ajoute 8 fichiers de lots pseudonymisés sous `input/00-retours/` et 13 lignes à `todo/TODO.jsonl`. Le contrôle d'avant-publication l'a refusé sans feu vert humain, parce que des lots entrants y figurent.
>
> **Recommandation : (a).** Source consultée : la sortie du refus, qui demande `FORGE_PUSH_GO` ; relecture des 8 fichiers, aucun nom réel restant (`grep -il` sur les noms d'origine : 0 fichier). Le seul identifiant signalé, `span.st`, est un sélecteur CSS.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier maintenant avec votre feu vert cité | complexité faible · durée courte | aucune |
| (b) attendre la fin des décisions D-59 et D-60, puis tout publier ensemble | complexité faible · durée courte | le registre reste local d'ici là |

> **Si rien n'est décidé** : (b) — le commit reste local et sera repris au prochain tour.

> **D-59 — Quel nom donnez-vous au produit `Produit-79`, dont 3 lots attendent au sas `input/00-retours/_arrivee/` depuis le 07/10 ?**
>
> Rappel du sujet : `todo/accueillir-lot.mjs` refuse d'inscrire ce nom, car il est inconnu de la table des pseudonymes et déjà cité dans 2 dépôts du parc (un dépôt de livrets et le site `Produit-02.fr`). Le pilot est public, donc le nom réel ne peut pas y entrer tel quel.
>
> **Recommandation : (a).** Source consultée : le motif du refus de l'accueil ; ma mémoire de la règle du 01/10, selon laquelle un nom de l'écosystème non tranché reste au sas avec une décision posée.

| Option | Coût | Exclusions |
|---|---|---|
| (a) inscrire `Produit-79` sous un pseudonyme neuf, puis accueillir et ingérer ses 3 lots | complexité moyenne · durée courte | aucune |
| (b) le rattacher au pseudonyme d'un produit existant que vous désignez (Produit-02, dont le site cite déjà ce nom, par exemple) | complexité moyenne · durée courte | exige que vous nommiez le produit visé |
| (c) laisser les lots au sas | aucun | exclut leurs retours du registre |

> **Si rien n'est décidé** : (c) — les lots restent au sas et la boîte d'entrée reste rouge.

> **D-60 — Renvoyez-vous à Produit-03 son lot `Produit-03 - RETOURS - 20261002e`, comme vous l'avez fait le 04/10 pour Produit-12 ?**
>
> Rappel du sujet : `todo/ingerer-lot.mjs` refuse ce lot, car la section « Garde-fou de plateforme relevé » est absente. Seul le produit peut dire s'il a heurté un garde-fou de plateforme ; le pilot ne peut pas l'écrire à sa place.
>
> **Recommandation : (a).** Source consultée : votre réponse « 57a » du 04/10, qui a renvoyé 2 lots au même motif avec un lot de travaux ; `todo/emettre-travaux.mjs` dépose ce lot dans la boîte d'entrée du produit.

| Option | Coût | Exclusions |
|---|---|---|
| (a) item de travaux au registre et lot de travaux déposé chez le produit | complexité faible · durée courte | aucune |
| (b) annoter le lot « aucun garde-fou de plateforme relevé » à la réception et l'ingérer | complexité faible · durée courte | le pilot affirmerait à la place du produit un fait qu'il n'a pas mesuré |

> **Si rien n'est décidé** : (a) au prochain tour, puisque c'est le précédent que vous avez posé le 04/10.

## 4. Traité — avec sa preuve

Ce tour a vidé une partie du sas et fait entrer au registre ce qui pouvait y entrer.

- **Fraîcheur** : le pilot et les 13 forges sont à jour du dépôt distant.
  - preuve : `bootstrap --pull` à l'ouverture, exit 0 ; `git fetch` puis `git rev-list --left-right --count main...origin/main` → `0 0` à 10:58.
- **Accueil** : 4 lots (8 fichiers) déplacés du sas vers `input/00-retours/`, sous les pseudonymes Produit-03 et Produit-64.
  - preuve : `accueillir-lot.mjs` → « 8 lot(s) accueilli(s), 6 refusé(s) » (le compte de l'outil est en fichiers) ; `grep -il` des noms d'origine sur les 8 fichiers : 0.
- **Notes de réception, posées avant l'ingestion** : au lot Produit-64 du 12/10, son retour RT-31 (une infobulle qui recopie la page) devient RT-32, car ce numéro était déjà défini par son lot 20261001b ; aux lots Produit-03 j et k, les 6 classes proposées par le sidecar sont recopiées mot pour mot dans le texte du lot.
  - preuve : contrôle `LOT-IDS` rouge à l'essai, puis vert ; « classe proposée non nommée dans le .md » rouge 6 fois à l'essai, puis vert.
- **Ingestion** : 2 candidats (lot `93e95ebd4a66`), 4 candidats (lot `9fbeec774d12`) et 1 candidat (lot `3277e8e6ee51`), soit TF-1603 à TF-1609.
  - preuve : essai sur une copie jetable du registre, puis réel ; « [OK] … ingérée(s) en CANDIDAT », exit 0, 3 fois ; `oracle-todo` PASS après écriture.
- **Commit** `c461b2a6`, limité aux fichiers de ce tour (`git commit --only`).
  - preuve : `git log --oneline -1` ; les fichiers modifiés avant ce tour (études, relevés d'observabilité) ne sont pas dans le commit.

## 5. Non traité — avec son motif

- La publication du commit — motif : `decision`, refusée sans votre feu vert (D-58).
- Les 3 lots Produit-79 au sas — motif : `decision`, nom sans pseudonyme (D-59).
- Le lot Produit-03 du 02/10 (indice e) — motif : `decision`, renvoi au produit (D-60).
- Les 2 lots Produit-12 du 01/10 et du 02/10 — motif : `dependance_externe`, ils attendent la nouvelle remise du produit depuis votre réponse « 57a » du 04/10. La boîte d'entrée les signale encore, à tort, comme oubliés.
- La création au référentiel des 7 classes proposées par les lots ingérés — motif : `dependance_externe`, revue hebdomadaire ; les candidats sont au registre sans classe.
- La revue hebdomadaire due depuis le 01/10 et le re-test des modèles servis — motif : `hors_mandat`, votre « ok » portait sur les lots.

## 6. Écarts à la lettre

- **Vous avez répondu** « ok » à « accueillir et ingérer les 9 lots » → **3 lots sur 9 sont ingérés** → **pourquoi** : 2 lots attendaient déjà leur renvoi au produit, 3 sont arrêtés par un nom sans pseudonyme, 1 manque une section que seul le produit peut écrire. Mon compte de 9 confondait ces cas.
- **J'ai annoté 3 lots du produit à la réception** → **pourquoi** : un numéro en double et 6 classes absentes du texte, recopiées depuis le sidecar du même produit ; aucune valeur n'est inventée, comme le 04/10 avec votre réponse « 57a ».

## 7. Risques

- L'autre poste peut ingérer d'autres lots et frapper les mêmes numéros TF tant que le commit reste local.
  - signal : un refus de publication pour divergence au prochain `git fetch` ;
  - parade : publier vite (D-58), sinon renuméroter la version locale au rebase.
- Le contrôle de la boîte d'entrée continue de signaler comme oubliés les 2 lots Produit-12 que vous avez déjà renvoyés.
  - signal : la même alerte « BLOQUANT » à chaque ouverture ;
  - parade : une candidature pour que ce contrôle lise le renvoi consigné au registre.

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier `c461b2a6` avec `FORGE_PUSH_GO` citant votre réponse | `auto_ia` | `neuve` | `dependance_bloc_3` — D-58 | le registre reste local |
| **A-2** | Accueillir et ingérer les 3 lots Produit-79 selon votre choix | `auto_ia` | `neuve` | `dependance_bloc_3` — D-59 | ils restent au sas |
| **A-3** | Renvoyer le lot Produit-03 du 02/10 avec un lot de travaux | `auto_ia` | `neuve` | `dependance_bloc_3` — D-60 | ses retours restent dehors |
| **A-4** | Créer les 7 classes proposées et y rattacher TF-1603 à TF-1609 | `auto_ia` | TF-1603 | `dependance_externe` — revue hebdomadaire | les candidats restent sans classe |
| **A-5** | Répondre à D-58, D-59 et D-60 | `manuelle_utilisateur` | `neuve` | `decision` | les 3 bloquants restent en place |

Traces : `todo/TODO.jsonl` (TF-1603 à TF-1609), `input/00-retours/Produit-64 - RETOURS - 20261012a.md`.
