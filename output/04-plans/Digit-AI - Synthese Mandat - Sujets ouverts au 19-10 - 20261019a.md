---
destinataire: humain
---

# Synthèse Mandat — sujets ouverts au 19/10/2026

## 0. Synthèse d'ouverture

Il restait un seul sujet neuf : un lot de retours de Produit-73, arrivé au sas ce matin. Je l'ai accueilli et ingéré, et ses 2 retours entrent en candidat au registre : un fichier hérité du pilot refusé par le lint du produit, et un réglage de sécurité du produit écrasé à chaque ouverture. Les traitements hebdomadaires n'ont rien à trancher : la revue des propositions ne trouve aucune fiche complète, aucune revue datée n'est due, et le relevé des récidives a été fait ce matin. Les 4 études d'opportunité du 18/10 sont toutes décidées, et leurs revues tombent entre le 01/11 et le 18/12. Ce qui retient le plus de sujets, c'est la publication : 12 sujets du registre sur les 14 qui attendent votre décision n'attendent plus que votre accord pour publier le pilot sur GitHub.

## 1. En-tête d'identification

Relevé des sujets ouverts du pilot `digit-ai-factory` : sas des retours, registre TODO-FORGE, traitements hebdomadaires, études d'opportunité. Période : 19/10/2026 de 12:04 à 12:12, heure de Paris (UTC+02:00), heures relevées par `date`. Session pilote Claude Opus 5.5, aucun agent de travail.

Intention de la demande : savoir s'il reste du travail à engager, retours, tâches, traitements périodiques ou études, au-delà de ce qui a été tranché ce matin.

Test rétro : le résultat sert cette intention. Chaque source citée par la question a été relue, et le seul travail automatique trouvé, le lot au sas, est fait dans le tour.

## 2. Verdict en une ligne

1 lot ingéré, 2 candidats neufs ; revues hebdomadaires et datées : rien à trancher ; 4 études sur 4 décidées ; 1 décision vous revient, la publication du pilot.

## 3. Décisions attendues

Les 12 bloquants qui retiennent des sujets du registre tiennent tous à la publication du pilot, posée ci-dessous.

> **D-38 — Faut-il publier maintenant sur GitHub les enregistrements locaux du pilot ?**
>
> De quoi s'agit-il : la branche `main` du pilot `digit-ai-factory` porte 18 enregistrements absents de GitHub, dont vos décisions de ce matin, le lot ingéré dans ce tour et cette synthèse.
>
> Le problème : 12 sujets ouverts du registre ne gardent que la publication comme reste à faire, et l'autre poste travaille sur l'état publié tant qu'elle n'a pas lieu.
>
> Pourquoi vous : la publication sur un service hébergé attend votre accord explicite, selon les garde-fous du `CLAUDE.md` du pilot.
>
> **Recommandation : (a).** Source consultée : `git rev-list --left-right --count main...origin/main` rend 18 en avance et 0 en retard après l'enregistrement de cette synthèse, donc la publication se fait sans fusion ; le champ « reste à faire » de `todo\TODO.jsonl` cite la publication pour 12 des 14 sujets en attente de décision.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Publier maintenant, porte de publication jouée | Les 18 enregistrements partent ; les 12 sujets passent à leur constat de clôture | Faible × court | Un commit d'annulation, l'historique publié reste visible |
| (b) Attendre la fin de la journée | Rien ne part ; l'autre poste reste sur l'état du distant | Nul | Sans objet |

> **Sans réponse** : (b), rien n'est publié.

## 4. Traité

Le tour a relu 6 sources et n'a écrit que le lot ingéré, le numéro de décision réservé et cette synthèse.

- **Lot Produit-73 du 19/10 accueilli et ingéré.** `node todo/accueillir-lot.mjs` l'a pseudonymisé et déplacé hors du sas, puis `node todo/ingerer-lot.mjs` l'a ingéré. Le premier retour signale que `gabarits/ledger.py`, recopié chez le produit, échoue à `ruff check .` avec 7 erreurs. Le second signale qu'un réglage de sécurité posé dans `.claude/settings.json` du produit est écrasé à chaque ouverture par l'héritage. Commits 3c52a950 et eef85015 (locaux) ; le second consigne la ré-empreinte du sidecar, dont le hook d'enregistrement a pseudonymisé un chemin de plus.
- **Contrôles après ingestion.** `oracle-boite-entree` rend PASS et `oracle-todo` rend PASS. Le registre compte 1 111 sujets : 2 candidats, 51 en cours, 4 décidés, 1 043 clos, 11 écartés.
- **Revue hebdomadaire des propositions.** Elle est due, la dernière date du 01/10, mais `todo/revue-hebdo.mjs` ne trouve aucune candidature portant une fiche de décision complète : rien à trancher.
- **Revues datées.** `todo/revues-datees.mjs` ne rend aucune revue due ; la prochaine est TF-1831, le 16/11.
- **Récidives.** Le relevé hebdomadaire a été fait ce matin à 10:43 (commit 856280bc) ; le prochain passe dans 7 jours.
- **Études d'opportunité du 18/10.** Les 4 sont décidées : sources Google (TF-1852, corrigé, revue le 18/12), tableau de bord de pilotage (TF-1855 corrigé, sa règle de lecture TF-1856 attend une page née du squelette, revue le 18/11), flotte d'agents (TF-1843, revue le 01/11), relecteur d'intention (TF-1865, essai jusqu'au 08/11).
- **Écriture de ma revue à blanc retirée.** Ma première lecture de la revue hebdomadaire avait ajouté 2 entrées sans décision à `todo/observabilite/revues-hebdo.jsonl` ; `git checkout` les a retirées, le fichier est revenu à sa version enregistrée.
- Relecture d'intention : sert, un écart mineur relevé par le `verificateur` : la question demandait un relevé, et le tour a aussi ingéré le lot ; l'ingestion est le traitement automatique que le relevé d'ouverture prescrit.

## 5. Non traité

Ces sujets sont ouverts mais aucun ne demandait un geste dans ce tour.

- **Les 2 retours de Produit-73 en candidat** — motif : decision, la réparation de l'héritage se décide au registre ; chacun propose une classe neuve à créer dans `todo/CLASSES.json`.
- **Les 2 sujets en attente de décision qui ne tiennent pas à la publication** — motif : decision, déjà posés : TF-1323 attend votre qualification nom par nom, et TF-1552 la campagne d'environ 70 exécutions de la synthèse du 17/10.
- **Les publications de forges** — motif : hors_mandat, `digit-ai-forge-agents` porte 6 commits en avance et 16 fichiers modifiés depuis moins d'une heure par une autre session ; `digit-ai-forge-design` 3, `digit-ai-forge-tests` 1 et `digit-ai-forge-seo-geo` 1 appartiennent aux sessions qui les ont faits.
- **Le re-test de la règle de challenge des modèles** — motif : hors_mandat, dû depuis le 25/09 selon le relevé d'ouverture, il se joue au premier run ou à la première campagne qui porte 2 tranches comparables.
- **L'effort du poste à « medium » dans les 2 profils** — motif : decision, le relevé attend « high » ; c'est votre réglage, dans `~\.claude\settings.json` et `~\.claude-b\settings.json`.
- **4 secrets publiés dans un dépôt** — motif : decision, déjà décidé en geste humain (TF-1090) : la rotation se fait dans la console de chaque fournisseur ; le détail se lit par `node oracles/oracle-secrets-hors-perimetre.mjs`.
- **22 sujets qui attendent un produit** — motif : hors_mandat, 17 attendent un produit et 5 un produit absent du poste ; ils se reprennent quand un run est demandé chez eux.
- **`todo/relectures-intention.jsonl` modifié par une autre session** — motif : hors_mandat, 7 lignes écrites il y a une heure par la session 20c74d78 ; je ne les enregistre pas à sa place.

## 6. Écarts à la lettre

Aucun écart : la question demandait un relevé, et le seul geste fait, l'ingestion du lot, est le traitement automatique prescrit par le relevé d'ouverture.

## 7. Risques

- **L'autre poste reste sur l'état du distant.**
  - Énoncé : tant que D-38 n'est pas tranchée, il ne voit ni les décisions de ce matin ni le lot ingéré.
  - Signal : un numéro TF frappé des 2 côtés au prochain tirage.
  - Parade : publier ; sinon renuméroter la version locale avant l'union, selon le mode opératoire du registre.

## 8. Prochaines actions

La publication vient d'abord, parce qu'elle libère 12 sujets ; la réparation de l'héritage vient ensuite, parce qu'elle touche tous les produits.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Publier le pilot, porte de publication jouée | auto_ia | dependance_bloc_3 : attend D-38 | `git push origin main` | L'autre poste travaille sur l'état du distant |
| **A-2** | TF-1892 | Rendre `gabarits/ledger.py` conforme à ruff, ou l'exclure du lint chez le produit | auto_ia | gate_gouvernance : un candidat attend la décision du registre | `ruff check gabarits/ledger.py` | Le premier commit du fichier casse la CI de Produit-73 |
| **A-3** | TF-1893 | Instruire une surcouche de permissions par produit que l'héritage préserve | auto_ia | gate_gouvernance : un candidat attend la décision du registre | `node bootstrap.mjs --pull` pour constater l'écrasement | Un réglage de sécurité exigé par une politique d'entreprise reste impossible à tenir |
| **A-4** | `neuve` | Trancher D-38 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-38 a` | L'option par défaut s'applique |

## 9. Traces

- `input\00-retours\Produit-73 - RETOURS - 20261019a.md`, commits 3c52a950 et eef85015 (locaux)
- `todo\TODO.jsonl`, TF-1892 et TF-1893
- `decisions\REGISTRE.jsonl`, D-38 réservée à 12:08
