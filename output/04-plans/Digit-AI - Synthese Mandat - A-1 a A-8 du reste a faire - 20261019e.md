---
destinataire: humain
---

# Synthèse Mandat — A-1 à A-8 du reste à faire, traités le 19/10/2026 au soir

## 0. Synthèse d'ouverture

Cinq des huit actions sont faites : le sas est vidé, le fichier `null` supprimé, 4 sujets clos, l'indice en double corrigé et le pilot entièrement enregistré en 3 commits locaux. Trois choses vous reviennent, posées en D-41, D-43 et D-44. D'abord la publication de ces 3 commits : la porte avant envoi l'a refusée sans un GO nommé, et votre A-2 visait un commit que GitHub portait déjà. Ensuite les 4 lots de Produit-02 refusés à l'ingestion. Enfin les 8 candidats, dont trancher reste votre décision : je vous en donne une recommandation pour chacun. Sur les secrets (A-7), il n'y a probablement rien à faire tourner : les valeurs publiées sont des valeurs de test locales, et les deux `.npmrc` signalés n'en contiennent aucune.

## 1. En-tête d'identification

Exécution des actions A-1 à A-8 de la synthèse 20261019d sur le pilot `digit-ai-factory`, branche main, poste DESKTOP-ULTRA7. Période : 19/10/2026 de 21:20 à 21:40, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; un agent `verificateur` pour la relecture d'intention ; escalade de modèle : aucune.

Intention de la demande : solder le reste à faire relevé dans la synthèse 20261019d, chaque action jusqu'à son terme ou jusqu'à la décision qui la bloque.

Test rétro : le résultat sert cette intention ; chaque action est faite ou s'arrête sur une porte qui exige votre GO, et rien n'a été forcé ni décidé à votre place.

## 2. Verdict en une ligne

5 actions sur 8 faites (A-1 en partie, A-3, A-4, A-5, A-8), 3 en attente de vous (D-41, D-43, D-44), et A-7 requalifiée : aucune rotation certaine à faire.

Mesuré sur : `todo/TODO.jsonl` replié par identifiant, relue à 21:36, périmètre 1 130 sujets (20 candidats, 4 décidés, 42 en cours, 1 052 corrigés, 11 écartés, 1 sans statut).

## 3. Décisions attendues

Trois décisions, rangées de la plus rapide à trancher à la plus longue ; chacune se lit seule, et son tableau donne, par option, ce qui se passe, ce que cela coûte et comment revenir en arrière. Le relecteur d'intention (RI-20261019-14) relève les mêmes trois écarts à votre demande : la publication non faite, les candidats renvoyés à vous, la rotation remplacée par un relevé. Les deux premiers sont D-44 et D-41 ; le troisième se tranche par votre réponse à A-4, la conclusion « probablement sans objet » restant une inférence tant que vous n'avez pas dit où servent ces valeurs.

> **D-44 — Puis-je publier sur GitHub les 3 enregistrements du pilot faits dans ce tour ?**
>
> De quoi s'agit-il : les commits 8ca51d0a (registre, lots, réservations), dfba060b (journaux et index) et 290c52a0 (synthèses restées hors enregistrement), et celui de cette synthèse.
>
> Le problème : `git push origin main` a été refusé par la porte avant envoi, qui exige un GO humain nommé pour tout enregistrement en avance (R-38 §4-5) ; votre A-2 visait 1a5d4bb3, déjà sur GitHub au moment de l'envoi.
>
> Pourquoi vous : la porte n'accepte qu'un GO humain explicite, cité dans `FORGE_PUSH_GO`.
>
> Recommandation : (a). Source : `git rev-list --left-right --count main...origin/main` rend `3 0` après `git fetch`, donc l'envoi se fait sans fusion ; la sortie de la porte nomme les 3 commits et leurs fichiers.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) | Je publie avec `FORGE_PUSH_GO="D-44 (a) du 19/10"`, porte jouée | faible × une dizaine de minutes | un commit d'annulation, l'historique publié reste visible |
| (b) | Rien ne part ce soir | nul | sans objet |

Sans réponse : (b), rien n'est publié.

> **D-43 — Faut-il faire entrer au registre les 4 lots du 18/10 de Produit-02, en reprenant à la réception les classes que leur texte nomme ?**
>
> De quoi s'agit-il : les lots `Produit-02 - RETOURS - 20261018a` à `20261018d`, 9 retours (RT-128 à RT-136), refusés par `ingerer-lot.mjs` parce que 7 lignes portent « classe-a-creer » sans `classe_proposee`.
>
> Le problème : le texte de chaque lot nomme la clé, la famille et le libellé de 6 classes à créer ; RT-129 n'en nomme aucune, et RT-136 n'a pas de libellé. Cause mesurée chez le produit, en lecture seule : son contrôle de remise `forge/retours/oracle-lot.mjs` délègue au module à jour du pilot, qui refuse ces lots, et son journal `forge/ledger.jsonl` ne porte aucune trace de ce contrôle entre les lignes 440 et 509. Le contrôle n'a donc pas été joué avant la remise, une récidive de TF-1868.
>
> Pourquoi vous : corriger un lot à la réception est une dérogation au rejet atomique ; le précédent D-24 (a) du 18/10 a été tranché par vous.
>
> Recommandation : (a). Source : le précédent D-24 (a), exécuté le 18/10 (synthèse 20261018m, lignes 112 à 115), et les sections « La règle qui aurait évité le retour » des 4 lots, lues à 21:30.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) | Je reprends à la réception les classes nommées dans le texte (note en tête de chaque lot), j'ingère, et je renvoie RT-129 et RT-136 au produit par un lot de travaux qui rappelle aussi de jouer le contrôle de remise | moyen × une demi-heure | les événements d'ingestion se rectifient au registre |
| (b) | Je renvoie les 4 lots au produit par un lot de travaux, sans rien ingérer | faible × un quart d'heure | sans objet |
| (c) | Les 4 lots restent à la racine du dossier des retours, non ingérés | nul | sans objet |

Sans réponse : (c), et `oracle-boite-entree` les signale à chaque ouverture.

> **D-41 — Faut-il décider les 8 candidats TF-1892 à TF-1899 selon mes recommandations ?**
>
> De quoi s'agit-il : les 8 candidats relevés ce 19/10, dont 6 viennent des agents de la campagne du jour et 2 d'un produit.
>
> Le problème : un candidat ne se construit pas tant qu'il n'est pas décidé ; TF-1896 presse, car le cliquet des recettes devient bloquant le 20/10.
>
> Pourquoi vous : tout candidat entre au registre en attente d'une décision humaine (`references/TODO-FORGE.md`).
>
> Recommandation : (a), par sujet :
>
> - TF-1892 : rendre `gabarits/ledger.py` conforme à ruff, plutôt que l'exclure chez le produit ;
> - TF-1893 : instruire une surcouche de permissions par produit que l'héritage préserve ;
> - TF-1894 : corriger les 4 textes de forge-seo-geo et étendre le contrôle 15 au-delà de la matrice ;
> - TF-1895 : ajouter `screen` aux `@media` des 3 fichiers du skill de schémas ;
> - TF-1896 : remettre au vert les 3 recettes avant le 20/10 ;
> - TF-1897 : câbler `oracles/hook-page-html.mjs` dans `.claude/settings.json` du pilot ;
> - TF-1898 : réécrire dans `gabarits/AGENT-CAMPAGNE.md` un avancement que l'agent peut émettre sans SendMessage ;
> - TF-1899 : inscrire le garde-fou Entra au registre des garde-fous.
>
> Source : le contenu des 8 sujets dans `todo/TODO.jsonl`, lu à 21:31 ; 7 sur 8 portent un effort de 1 à 3.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) | Les 8 passent en décidé, chacun avec la voie ci-dessus | faible × un quart d'heure pour les décisions, puis la construction | une décision se rectifie au registre |
| (b) | Seuls TF-1894 à TF-1899 passent en décidé ; TF-1892 et TF-1893 restent en candidat | faible × un quart d'heure | idem |
| (c) | Rien n'est décidé ce soir | nul | sans objet |

Sans réponse : (c), les 8 restent en candidat.

## 4. Traité

- **A-8, `C:\dev\null` supprimé.** Lu avant : une page 404 publique d'un site produit, 13 530 octets, 0 occurrence de jeton, mot de passe, clé ou en-tête d'autorisation. TF-1584 clos.
- **A-1, sas vidé.** `node todo/accueillir-lot.mjs` rend « 14 lot(s) accueilli(s), 0 refusé(s) », soit 7 lots et leurs sidecars. Ingérés : Produit-79 du 18/10 (a) 7 retours et (b) 4 retours, Produit-02 du 19/10 (a) 1 retour, soit TF-1900 à TF-1911 en candidat. Refusés en bloc, registre intact : les 4 lots de Produit-02 du 18/10, posés en D-43.
- **A-3, 4 sujets clos sur publication constatée.** TF-1584, TF-1829, TF-1830 et TF-1840 passent en corrigé, preuves rejouées : recette hook-puits-windows 8 PASS, recette du hook d'ouverture 40 PASS, self-test oracle-boite-entree 47/47 ; leurs commits sont sur origin/main (4f3e973d). 7 autres sujets gardent un reste à faire, mis à jour sans la publication (TF-0963, TF-1212, TF-1307, TF-1319, TF-1838, TF-1839, TF-1841). `journaliser.mjs` : oracle-todo PASS avant et après.
- **A-5, indice en double corrigé.** La synthèse « publication cédée à la session d'origine », non suivie et la plus récente, passe de 20261015g à 20261015n, avec ses 3 caches d'oracle.
- **A-4, pilot enregistré.** 8ca51d0a (registre, 7 lots, réservations), dfba060b (journaux, sceaux, README), 290c52a0 (synthèses du 15 au 19/10 et caches). 3 journaux temporaires du 02/10, que rien ne référence, mis de côté dans le dossier temporaire de la session. `git status` ne montre plus que `oracles/banc-restitutions/variantes/`.
- **A-2, publication refusée par la porte.** 1a5d4bb3 était déjà sur GitHub ; les 3 commits neufs exigent un GO nommé, posé en D-44.
- **A-7, secrets relevés sans afficher de valeur.** `oracle-secrets-hors-perimetre` : 3 porteurs hors dépôt, 9 dans un dépôt. Parmi les 4 publiés : les 2 `.npmrc` ne portent que `auto-install-peers` ; `.env.ci` (5 mots de passe et clés) décrit un environnement `local` sur `localhost` avec un hôte SMTP vide ; `.env.test` pointe une base sur `localhost`.
- **Décisions réservées.** D-41, D-43 et D-44 au registre ; ma réservation D-42 a été retirée avant tout affichage, parce que le commit 8a542749 de l'autre poste cite déjà une D-42 ; `reserver-decision.mjs --verifier` : aucun numéro pris deux fois.
- Relecture d'intention : dérive, RI-20261019-14, 3 écarts de nature choix humain et aucun à corriger : A-2 non publiée (D-44), A-6 renvoyée à vous (D-41), A-7 remplacée par un relevé dont la conclusion est une inférence (A-4).

## 5. Non traité

- La construction des 8 candidats — motif : decision, D-41.
- L'ingestion des 4 lots de Produit-02 du 18/10 — motif : decision, D-43.
- La publication — motif : decision, D-44.
- L'archive `oracles/banc-restitutions/variantes/` — motif : decision, son enregistrement attend D-18 de la synthèse 20261017e.
- La rotation des identifiants — motif : decision, elle ne s'impose que si les valeurs de test servent aussi ailleurs, ce que seul vous savez ; reprise en A-4.
- TF-1432, TF-1540 et TF-1552 — motif : decision, leur reste à faire tient au canal confidentiel ou à D-18, non vérifiables d'ici.

## 6. Écarts à la lettre

Trois actions demandées n'ont pas été faites comme écrites.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| A-2 : publier | Envoi tenté, refusé par la porte, posé en D-44 | Le GO visait 1a5d4bb3, déjà publié ; les 3 commits neufs exigent un GO nommé |
| A-6 : trancher les 8 candidats | Recommandation par sujet, posée en D-41 | Décider un candidat revient à l'humain |
| A-7 : faire la rotation | Relevé sans valeur, rotation probablement sans objet | Elle se fait dans la console des fournisseurs, et les valeurs relevées sont des valeurs de test locales |

## 7. Risques

- Le cliquet des recettes devient bloquant le 20/10.
  - Énoncé : TF-1896 laisse 3 recettes en baisse ; la recette complète refusera alors tout enregistrement qui la joue.
  - Signal : l'avertissement I6 de la recette complète devient un refus.
  - Parade : D-41 (a) ou (b), puis TF-1896 en premier.
- Une D-42 sans réservation existe déjà sur l'autre poste.
  - Énoncé : le commit 8a542749 cite « D-42 (a) », absent du registre ; mon numéro suivant est D-43.
  - Signal : une réponse « 42 » sans autre mot.
  - Parade : cette synthèse n'affiche aucune D-42.

## 8. Prochaines actions

Ordre : la publication d'abord, parce qu'elle tient en un geste ; puis les candidats, parce que TF-1896 presse ; puis les lots.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | aucun | Publier les commits du pilot | auto_ia | dependance_bloc_3 : attend D-44 | `FORGE_PUSH_GO="D-44 (a) du 19/10" git push origin main` | L'autre poste ne voit ni les lots ni les clôtures |
| **A-2** | TF-1892 | Décider les candidats, puis remettre TF-1896 au vert | auto_ia | dependance_bloc_3 : attend D-41 | `node todo/journaliser.mjs --fichier <decisions.json>` | Le cliquet bloque la recette complète dès le 20/10 |
| **A-3** | aucun | Reprendre et ingérer les 4 lots, puis émettre le lot de travaux au produit | auto_ia | dependance_bloc_3 : attend D-43 | `node todo/emettre-travaux.mjs` | Les retours de Produit-02 restent hors registre |
| **A-4** | TF-1090 | Dire si les valeurs de test publiées servent aussi en production | manuelle_utilisateur | decision : seul vous connaissez leur usage | `node oracles/oracle-secrets-hors-perimetre.mjs` | Une rotation utile peut manquer |

## 9. Traces

- Commits locaux : 8ca51d0a, dfba060b, 290c52a0 ; publiés : aucun (porte avant envoi, R-38 §4-5)
- `todo/TODO.jsonl` : TF-1900 à TF-1911 créés ; TF-1584, TF-1829, TF-1830, TF-1840 clos
- `decisions/REGISTRE.jsonl` : D-41, D-43, D-44
- Lots : `input/00-retours/Produit-79 - RETOURS - 20261018a` et `b`, `Produit-02 - RETOURS - 20261018a` à `d` et `20261019a`
- Journaux mis de côté : dossier temporaire de la session, `mis-de-cote\`
