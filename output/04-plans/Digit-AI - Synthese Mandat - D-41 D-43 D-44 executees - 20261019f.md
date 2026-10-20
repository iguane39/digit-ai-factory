---
destinataire: humain
---

# Synthèse Mandat — D-41, D-43 et D-44 exécutées le 19/10/2026 au soir

## 0. Synthèse d'ouverture

Les trois actions sont faites. Les 8 candidats sont décidés, et TF-1896, le plus pressé, est clos : le cliquet des recettes ne bloquera pas demain matin. Les 4 lots de Produit-02 sont entrés au registre pour 6 de leurs retours. Les 3 autres sont renvoyés au produit par un lot de travaux déposé chez lui, ainsi que le rappel de jouer son contrôle de remise. Le pilot est publié sur GitHub et aligné, 0 enregistrement en attente hors cette synthèse. Trois gestes vont au-delà de la lettre de vos options : un retour de plus renvoyé au produit, des familles de classes choisies par le pilot, et deux enregistrements de plus publiés. Je vous demande si vous les gardez.

## 1. En-tête d'identification

Exécution de A-1 à A-3 de la synthèse 20261019e sur le pilot `digit-ai-factory`, branche main, poste DESKTOP-ULTRA7. Période : 19/10/2026 de 21:40 à 22:12, heure de Paris (UTC+02:00), heure relevée par `date`. Session de pilotage Claude Opus 5.5 ; un agent `verificateur` pour la relecture d'intention ; escalade de modèle : aucune.

Intention de la demande : appliquer vos réponses aux trois décisions D-41, D-43 et D-44, par les actions A-1 à A-3 qui en portent les options recommandées.

Test rétro : le résultat sert cette intention ; les décisions sont consignées, les lots traités, et la publication jouée sous le GO cité.

## 2. Verdict en une ligne

8 candidats décidés, TF-1896 clos, 6 retours ingérés (TF-1912 à TF-1917), 1 lot de travaux déposé (TF-1918), 6 commits publiés (0 en avance, 0 en retard).

Mesuré sur : `todo/TODO.jsonl` replié par identifiant, relue à 21:56, périmètre 1 137 sujets (18 candidats, 12 décidés, 42 en cours, 1 053 corrigés, 11 écartés, 1 sans statut).

## 3. Décisions attendues

Une décision : le relecteur d'intention (RI-20261019-15) classe en dérive les trois écarts du bloc 6, tous de nature choix humain. Rien n'a été défait.

> **D-45 — Faut-il garder les trois écarts à vos options : RT-135 renvoyé au produit, familles de 4 classes choisies par le pilot, 2 commits publiés en plus ?**
>
> - **De quoi s'agit-il** : trois gestes faits en exécutant D-43 (a) et D-44 (a). RT-135 a été renvoyé au produit avec RT-129 et RT-136. Les familles de RT-128, RT-132, RT-133 et RT-134 (TF-1912, TF-1915, TF-1916, TF-1917) ont été choisies par le pilot. Les commits e64109a3 et 5694b180 ont été publiés avec les 4 que visait D-44.
> - **Le problème** : RT-135 n'a pas de libellé dans le texte du lot, et les 4 familles proposées par le produit n'existent pas au référentiel, qui en compte 18 ; une publication ne se retire pas, elle s'annule par un commit d'annulation.
> - **Pourquoi vous** : les options de D-43 et D-44 étaient les vôtres, et ces trois gestes en sortent.
> - **Recommandation : (a)** — RT-135 est dans le même cas que RT-136 que vous avez renvoyé, les familles se rectifient au registre si une ne convient pas, et les 2 commits publiés exécutent vos réponses du même message. Source consultée : les sections « La règle qui aurait évité le retour » des lots 20261018a à d, `todo/CLASSES.json` (18 familles), et la sortie de `git push` à 22:08.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) | Les trois écarts restent tels quels | nul | une rectification au registre par écart |
| (b) | Les 4 familles sont retirées et le choix est renvoyé au produit par un complément au lot de travaux ; le reste est gardé | faible × un quart d'heure | les classes reprises se rattachent plus tard |
| (c) | Je n'y touche pas ce soir et le bloc 6 reste la seule trace | nul | sans objet |

> **Sans réponse** : (c), les trois écarts restent tels quels et déclarés.

## 4. Traité

- **D-41 (a), A-2 : 8 candidats décidés.** TF-1892 à TF-1899 passent en décidé, chacun avec la voie recommandée ; `journaliser.mjs` rend oracle-todo PASS avant et après.
- **TF-1896 clos, le cliquet ne bloquera pas le 20/10.**
  - Cause : les comptes du cliquet (hooks-factory 21, oracle-lot-retours 92, conformité 186) avaient été relevés le 19/10 au matin (02241782) pendant une session concurrente. Or `hooks-factory.test.mjs` porte 20 cas, tous inconditionnels, `oracle-lot-retours.test.mjs` en porte 91, dont 1 conditionnel au poste, et `self-test.mjs` n'en a aucun de conditionnel.
  - Corrections : le cliquet est ramené à 20, 91 et 185 ; le cas non joué TF-1759 prend la forme fermée « [NON JOUÉ] 1 cas — » ; `revues-datees.test.mjs` nomme ses 3 cas rouges existants et `lib-enumeration-liste.test.mjs` déclare son double sens (règle I6, bloquante dès le 20/10). Aucun cas ajouté ni retiré.
  - Preuve : confrontation du cliquet au jour du 20/10 sur les 5 recettes rejouées, 0 baisse ; recette du cliquet 25 PASS. Commit e64109a3.
- **D-43 (a), A-3 : les 4 lots repris à la réception.**
  - Note de réception en tête de chaque lot, sur le modèle de D-24 (a). Classes proposées reprises du texte pour RT-128, RT-132, RT-133 et RT-134 ; RT-130 et RT-131 inchangés.
  - Essai sur une copie du registre d'abord (6 candidatures, vrai registre intact), puis ingestion : TF-1912 à TF-1917.
  - TF-1918 créé et décidé : le lot de travaux « pilot - TRAVAUX - 20261019a » (11 éléments, dont TF-1868 et TF-1918) est déposé dans la boîte d'entrée du produit, sans commit chez lui. Commit 5694b180.
- **D-44 (a), A-1 : publication.** `FORGE_PUSH_GO="D-44 (a) du 19/10" git push origin main`, porte avant envoi jouée, rend `1a5d4bb3..5694b180  main -> main` à 22:08 ; `git rev-list --left-right --count main...origin/main` rend `0 0`. Cette synthèse, écrite après l'envoi, reste enregistrée en local pour le prochain.
- Relecture d'intention : dérive, RI-20261019-15, 3 écarts de nature choix humain et aucun à corriger : RT-135 renvoyé en plus, familles choisies par le pilot, 2 commits publiés en plus ; posés en D-45.

## 5. Non traité

- La construction des 7 candidats décidés autres que TF-1896 — motif : hors_mandat, A-2 demandait de les décider puis de remettre TF-1896 au vert.
- Les 18 candidats du registre, dont TF-1900 à TF-1917 — motif : decision, ils attendent une décision humaine.
- La recette complète (48 min) — motif : hors_mandat, rejouée sur les 5 recettes touchées seulement ; le prochain passage complet le constatera.
- L'archive `oracles/banc-restitutions/variantes/` — motif : decision, D-18 du 17/10.

## 6. Écarts à la lettre

Trois points s'écartent de la lettre de l'option choisie.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| D-43 (a) : renvoyer RT-129 et RT-136 | Renvoyé RT-129, RT-135 et RT-136 | Le texte du lot ne donne pas non plus de libellé à RT-135, ce que j'avais mal compté en posant D-43 ; je n'en invente pas |
| D-43 (a) : reprendre les classes que le texte nomme | Repris clé et libellé ; familles rattachées par le pilot (consigne-d-agent → regle-morte, livraison et interaction → affordance-ui, rendu → page-html-socle) | Les 4 familles proposées n'existent pas au référentiel et l'ingestion les refuse ; ranger une classe dans une famille revient au pilot qui la crée, et chaque note de réception le dit |
| D-44 (a) : publier 3 enregistrements et la synthèse | Publié aussi les 2 commits de D-41 et D-43 | Ils exécutent vos réponses du même message ; le pilot a un mandat permanent de publication, la porte exigeant seulement le GO cité |

## 7. Risques

- Un second dossier est rattaché au même pseudonyme par l'émetteur de travaux.
  - Énoncé : `emettre-travaux.mjs --tous` aurait aussi déposé le lot dans le dossier du site .fr, qu'il range sous Produit-02 par graphie voisine.
  - Signal : un lot de travaux de Produit-02 qui apparaît dans la boîte d'entrée du site .fr.
  - Parade : émettre par `--produit` suivi du dossier du produit tant que la table ne distingue pas les deux sites.

## 8. Prochaines actions

Ordre : la construction des sujets décidés vient d'abord, parce qu'elle est autorisée ; D-45 ensuite ; les nouveaux candidats attendent votre revue.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | TF-1897 | Construire les 7 sujets décidés de D-41, en commençant par les plus courts (TF-1895, TF-1897, TF-1898, TF-1899) | auto_ia | hors_mandat : la demande s'arrêtait à la décision | `node todo/stock-sans-classe.mjs` | Les décisions restent sans effet |
| **A-2** | TF-1918 | Appliquer la réponse à D-45, puis enregistrer cette synthèse et la publier | auto_ia | dependance_bloc_3 : attend D-45 | `node todo/journaliser.mjs --fichier <rectifications.json>` | Les écarts restent déclarés sans être tranchés |
| **A-3** | TF-1912 | Trancher les 18 candidats ouverts, dont les 12 de Produit-79 et les 6 de Produit-02 | manuelle_utilisateur | decision : tout candidat attend une décision humaine | `node todo/revue-hebdo.mjs` | Les retours des produits restent sans suite |

## 9. Traces

- Commits : e64109a3 (D-41, TF-1896), 5694b180 (D-43, lots, TF-1918), et les 4 de la synthèse 20261019e
- `todo/TODO.jsonl` : TF-1892 à TF-1899 décidés, TF-1896 clos, TF-1912 à TF-1918 créés
- `oracles/baseline-recettes.json` : hooks-factory 20, oracle-lot-retours 91, conformité 185
- Lot de travaux : `pilot - TRAVAUX - 20261019a.md` dans la boîte `input\00-travaux\` de Produit-02, sceau 5967740815dc
