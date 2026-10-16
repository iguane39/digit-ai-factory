# Retours forges — Produit-62 — 20260915a

- **Contexte** : friction interne observée en séance, sans retour humain. En jugeant la note de synthèse du déploiement Power BI, `oracle-synthese` a refusé au titre de S8 une puce du bloc 4 dont le seul tort est de contenir la locution « aurait fait échouer », c'est-à-dire un irréel du passé décrivant un défaut ÉVITÉ. S8 cherche une affirmation de complétion — un ✓ sans preuve — et elle retire déjà deux familles de tournures qui contiennent le mot « fait » sans rien affirmer : la conditionnelle de S19 (« si elle n'est pas faite ») et la locution que le gabarit prescrit au bloc 6 (« j'ai fait »). L'irréel du passé appartient à la même famille et n'y est pas.
- **Références ledger** : `forge\ledger.jsonl`, entrée du 2026-09-15 (friction observée), entrée du 2026-09-15 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-15

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `oracles\oracle-synthese.mjs` S8)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-16 | mineur | générique | **S8 lit une affirmation de complétion dans un irréel du passé : « là où elle aurait fait échouer la publication » est refusé comme un ✓ sans preuve.** Fait observé le 2026-09-15 sur `output\05-syntheses\Client-A - Note Synthese Deploiement Power BI Tenancy Schedule Asset - 20260915a.md` : la puce du bloc 4 « La liaison du rapport au modèle est traitée dans le client, là où elle **aurait fait** échouer la publication » rend S8 FAIL, « 1 affirmation(s) « fait » sans preuve citée ». La puce porte pourtant sa preuve en sous-puce, exécutée. Lecture du code : S8 teste `(✓|\bfait\b|\btermin[ée]\|\bsold[ée]\|\bclos\b)` après avoir retiré deux familles de tournures innocentes — la conditionnelle de S19 (`\bsi\b[^.;]*?\bfaite?\b`, ajoutée le 22/08 après un faux positif du même jour) et la locution prescrite au bloc 6 (`j'ai fait`). L'irréel du passé — « aurait fait », « eût fait », « aurait pu faire » — décrit un événement qui n'a PAS eu lieu, exactement comme la conditionnelle ; il désigne même, ici, un défaut que le code ÉVITE, soit le contraire d'une complétion revendiquée. La correction subie a consisté à écrire « aurait bloqué » à la place, sans aucun gain de sens. *Le commentaire du code dit lui-même la doctrine : « une conséquence n'est pas un ✓, et une règle neuve qui met une règle ancienne en défaut sur du texte conforme est un défaut de la NOUVELLE » — l'irréel relève du même raisonnement, il a seulement été oublié.* | **(1)** Ajouter une troisième soustraction à `sansConditionnel`, de la forme `/\baur(?:ai[ts]|ions|iez|aient)\s+(?:pu\s+)?fait\b/gi` et `/\beût\s+fait\b/gi` — le temps du verbe suffit à trancher, aucune analyse sémantique n'est requise. **(2)** Fixture double sens, dans l'esprit des paires déjà en place : « le garde-fou aurait fait échouer la publication » doit rendre PASS (irréel, rien n'est revendiqué), « le garde-fou a fait échouer la publication » doit rester FAIL sans preuve. **(3)** Piste de fond, pour le jour où ces soustractions se multiplient : les trois familles retirées à ce jour partagent un trait mécanique — le mot « fait » n'y est pas au passé composé de l'indicatif à la première personne. Une règle qui testerait le TEMPS plutôt que le lemme couvrirait les trois d'un coup et n'aurait pas à grandir d'une soustraction par tournure découverte. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le verdict annonçait un comportement du client de publication jamais exécuté (« `exit 3` prévu si un nom existe déjà ») | un banc de fixtures à double sens a été écrit et joué, 5 contrôles verts sur 5, et le verdict cite désormais la recette au lieu d'annoncer une intention | non : c'est la règle 40 du pilot appliquée correctement, et S8 a eu raison de mordre — le constat était fondé | resté au produit |
| Quatre autres constats de la première passe (S14, S16, S24, S25) portaient sur des défauts réels de la note | mention `neuve` portée sur les deux actions reprises, chemins de documents cités dans les deux recommandations, recherche par structure ajoutée à la recherche par nom, deux chemins nommés dans chaque phrase d'incapacité | non : défauts d'auteur, correctement détectés | resté au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le gabarit `RESTITUTION.md` n'est pas en cause : c'est une soustraction manquante dans le détecteur de S8.

## Confirmations positives

- S8 a rendu un service réel dans le même passage : elle a refusé un verdict qui annonçait le comportement d'un garde-fou jamais exécuté. La correction a produit un banc de fixtures à double sens et 5 contrôles verts, c'est-à-dire exactement ce que la règle 40 du pilot demande. Un oracle qui force à jouer un test plutôt qu'à l'annoncer vaut son coût.
- Le message de S25 nomme la conduite attendue plutôt que la tournure — « nommer au moins DEUX chemins, ou déclarer qu'un seul existe » — ce qui a permis de corriger trois phrases sans les deviner.

## Ordre recommandé

1. RF-16 — coût faible et fréquence faible, mais la soustraction est de trois lignes et la fixture existe déjà en modèle ; tant qu'elle manque, toute restitution qui décrit un défaut évité au conditionnel passé paie une passe d'oracle.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

L'item ne suit pas un retour humain mais une friction observée en séance. Classe : **RF-16** → `regle-balaie-prose-et-identifiants` (famille `regle-morte`, correspondance APPROCHÉE : la classe vise une règle qui lit dans une même expression deux natures de texte ; ici la règle lit dans un même lemme deux temps verbaux, l'accompli et l'irréel, et n'en distingue que ceux qu'on lui a déjà signalés. Classe candidate `detecteur-de-lemme-sans-temps`, même famille, libellé proposé : « un détecteur cherche un lemme là où seul le TEMPS du verbe tranche : chaque tournure innocente doit lui être signalée une par une, et la liste ne se ferme jamais »).
