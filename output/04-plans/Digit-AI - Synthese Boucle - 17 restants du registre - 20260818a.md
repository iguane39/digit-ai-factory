---
destinataire: humain
---

# Digit-AI — Synthèse de boucle : les 17 restants du registre — 20260818a

## 1. En-tête d'identification

- **quoi** — boucle d'amélioration mandatée, multi-dépôts, sur les 17 items restants du registre TODO-FORGE (14 décidés, 3 candidats).
- **sur quoi** — `digit-ai-forge-tests` · `digit-ai-forge-agents` · `digit-ai-forge-design` · `digit-ai-forge-websec` · pilot (`digit-ai-factory`).
- **quand** — fin le 2026-08-18 à 11h49 (+02:00), durée ≈ 5 h.
- **qui** — pilot `digit-ai-factory` @ `4357250`, sur mandat humain « Boucle pour implémenter les 17 éléments ».

## 2. Verdict en une ligne

**16 items sur 17 clos en `corrige` avec gains constatés, 1 maintenu candidat avec sa condition de blocage écrite** — registre `oracle-todo` R1-R10 PASS (55 actifs, 307 archivés), recette du pilot 14/14, et 5 commits en dépôts frères.

## 3. Décisions attendues de l'humain

Trois décisions, chacune en choix fermé. Le travail est livré dans les trois cas : ce qui se décide ici est la suite, pas un déblocage.

- **D1 — `pilote-de-mission` (TF-0326) : existe-t-il ailleurs ?** Recherche exhaustive faite sur ce poste : 16 fichiers le mentionnent, zéro ne le contient.
  - **(a)** vous le retrouvez (autre poste, autre compte, espace claude.ai) → il est versionné chez sa forge, TF-0324 se débloque de moitié. *Coût* : une remise du fichier. *Exclut* : rien.
  - **(b)** il n'existe plus → les mentions vivantes se requalifient en « inspiration non versionnée » et TF-0323/TF-0324 se réinstruisent sur des mesures faites ailleurs. *Coût* : une passe de requalification. *Exclut* : la preuve amont du lot Run-Delivery, définitivement.
  - **Recommandation : (a) d'abord, une recherche de 5 minutes de votre côté** — (b) est irréversible et coûte deux réinstructions.
  - **Si rien n'est décidé** : la marque `PROVENANCE NON REJOUABLE` reste dans le code et aucune décision ne s'appuie sur son contenu. C'est tenable indéfiniment.
- **D2 — TF-0360 : le câblage existe (10 tests verts) mais aucune campagne réelle ne l'a exercé.**
  - **(a)** l'exercer au prochain run produit qui atteint l'étape tests. *Coût* : nul en plus du run. *Exclut* : rien.
  - **(b)** l'exercer maintenant sur un produit choisi. *Coût* : un run complet, démon de conteneurs requis. *Exclut* : rien.
  - **Recommandation : (a)** — un bout-en-bout forcé hors run mesurerait un cas artificiel, et la revue du 2026-09-15 confronte ce point en premier.
  - **Si rien n'est décidé** : (a) s'applique par défaut.
- **D3 — R-41 (TF-0329) admet trois règles portant sur un objet que le pilot n'exécute pas.**
  - **(a)** garder la borne écrite : retrait automatique à la revue du 2026-11-17 si aucune n'a tranché une question réelle.
  - **(b)** les retirer tout de suite et ne garder que la fiche d'inventaire. *Coût* : nul. *Exclut* : la réponse à « qui est l'écrivain unique », qui redeviendrait introuvable.
  - **Recommandation : (a)** — la dette est déclarée et datée, ce qui est exactement le régime que R-35 demande.
  - **Si rien n'est décidé** : (a) s'applique, la borne est déjà écrite.

## 4. Traité — avec sa preuve

**forge-tests (10 items, 3 commits)**

- TF-0334 — comptes du README dérivés, classes de findings à source unique. *Preuve* : 7 tests neufs ; 5 comptes périmés corrigés, dont 3 que le verrou a trouvés lui-même.
- TF-0354 — voie « proposition » fermée, et la contradiction entre deux forges sur `cas-ecartes.jsonl` résolue. *Preuve* : 10 tests sur ce fichier ; un produit qui suit R-40 n'est plus puni.
- TF-0355 — solde des cas et surface non couverte opposés. *Preuve* : 5 tests ; « solde 0 » avec 8 non couverts ne se dit plus SOLDÉ.
- TF-0333 — locale promise et jamais servie enfin confrontée. *Preuve* : 5 tests double sens, plus un second silence fermé (`continue` muet).
- TF-0352 / TF-0353 — définition de fin en 5 points et journal de boucle. *Preuve* : 17 tests ; la boucle réelle du 17/08 (4 → 9 → 1 → 0) rejouée telle quelle.
- TF-0344 / TF-0345 — revue statique des faux verts, câblée au pan `front`. *Preuve* : 12 tests ; sort même quand la suite ne peut pas tourner.
- TF-0343 / TF-0342 — matrice des droits exécutable, recette multi-profils exigée. *Preuve* : 15 tests ; fichier généré vérifié compilable.
- *Preuve d'ensemble* : suite unitaire verte, `ruff` 0, recette 12 sections sur 13 OK.

**forge-agents (2 items, 1 commit)**

- TF-0336 — `.bak` retirés, manifeste réaligné, famille L tranchée, polices embarquées. *Preuve* : les 6 gabarits PASS sur TOUTES les règles ; `quality-oracles` 142 contrôles PASS ; `digit-ai-page-html` 60/60.
- TF-0326 — recherche consignée, provenance marquée non rejouable. *Preuve* : constat daté `constats/…-20260818a.md`, périmètre de recherche écrit.

**forge-design (1 item, 1 commit)**

- TF-0335 — registre, autorité du mouvement, fixtures, démos, README vendor, self-test du générateur. *Preuve* : self-test 21 oracles / 73 règles + 27 cas neufs ; `oracle-motion` PASS sur les 4 maquettes.

**pilot et websec (4 items, 2 commits)**

- TF-0358 — note de revue produite, chemin websec corrigé. *Preuve* : websec self-test 36 PASS.
- TF-0329 — instruit puis O2 appliquée (INVENTAIRE + R-41). *Preuve* : `oracle-etude-opportunite` E1-E7 PASS.
- TF-0360 — instruit puis O3 câblée. *Preuve* : E1-E7 PASS ; 10 tests neufs joués par I2 (14/14).
- Registre — 21 événements. *Preuve* : `oracle-todo` R1-R10 PASS, self-test TODO-FORGE 38 PASS.

## 5. Non traité — avec son motif

- **TF-0324, les cinq artefacts de cadence de mission** — *motif* : dépendance à une décision humaine et à une donnée absente. Son critère d'acceptation n°1 exige « au moins une instanciation sur une mission réelle, jamais un gabarit seul » ; vérifié ce jour, aucune mission réelle n'existe dans les dépôts. Le livrer aujourd'hui violerait son propre critère. Condition de déblocage écrite au registre : une mission réelle instrumentée **et** un porteur d'état versionné (suspendu à D1).
- **Le bout-en-bout réel de la boucle TF-0360** — *motif* : impossible à prouver ici. Les tests couvrent la frontière et les refus ; un audit complet en test prendrait des minutes et dépendrait d'un démon de conteneurs absent de ce poste.
- **Section `corpus` de la recette forge-tests** — *motif* : bloqué par un prérequis d'environnement. Démon de conteneurs injoignable : 9 défauts non mesurables. Un dixième, H-06, sort `[MANQUE]` — **vérifié pré-existant** par rejeu de l'adaptateur `batch` depuis le commit antérieur à la campagne, mêmes fixtures, même résultat.
- **Injection de l'entrée `oracle-motion` au registre installé de `quality-oracles`** — *motif* : bloqué par un garde-fou. Écrire dans une copie installée depuis un dépôt recréerait la divergence que TF-0290 dénonce. L'entrée à jour est prête dans `registre-entrees.md`, l'injection est un geste de poste.

## 6. Écarts à la lettre

- **Vous avez demandé** « implémenter les 17 éléments » → **j'ai fait** 16 implémentations et 1 instruction avec condition de blocage → **pourquoi** : TF-0324 interdit lui-même sa propre livraison tant qu'aucune mission réelle n'existe. Le livrer aurait produit cinq gabarits sans instanciation, c'est-à-dire exactement ce que son critère n°1 refuse.
- **Vous avez demandé** l'implémentation → **j'ai fait**, pour TF-0329 et TF-0360, une étude d'opportunité d'abord (`oracle-etude-opportunite` E1-E7 PASS sur les deux) → **pourquoi** : les deux franchissent le seuil TF-0155 (objet durable, ≥ 3 forges), et l'un des deux a pour titre « Instruire… ». L'étude a changé le résultat de TF-0360 : le coût est passé de 3-5 jours sur 3 dépôts à ≈ 2,5 sur 2, et l'arbitrage « qui porte la boucle » a été tranché par un fait du jour même.
- **Vous avez demandé** de traiter le registre → **j'ai aussi** synchronisé les skills installés → **pourquoi** : sans elle, `oracle-skills` restait ROUGE en K2 et les corrections ne valaient que pour les copies versionnées. C'est un geste de poste, déclaré ici parce qu'il modifie l'environnement de vos prochaines sessions.
- **Vous avez demandé** les 17 → **j'ai aussi** corrigé deux défauts trouvés en chemin → **pourquoi** : le bundle Motion vendoré cassé par `core.autocrlf` **bloquait** la reconstruction de la démo forge-design, et le rectificatif de `oracle-adoption-tests.mjs` corrigeait une affirmation fausse sur le comportement d'une autre forge. Les deux autres constats en passant sont partis en candidats (TF-0361, TF-0362), non corrigés.

## 7. Risques

- **La frontière TF-0360 n'a jamais été exercée en réel.** *Signal* : au premier run produit, un rapport dont `boucle.statut` vaut `en_cours` alors que la campagne se croit finie — ou l'inverse. *Parade* : la revue du 2026-09-15 le confronte en premier ; le triplet reste une condition nécessaire (`cibleAtteinte`), donc un faux verdict de fin ne peut pas rendre vert un écart résiduel.
- **Trois règles neuves (R-41) portent sur un objet non exécuté.** *Signal* : à la revue du 17/11, aucune trace d'une question tranchée par l'une d'elles. *Parade* : retrait automatique déclaré à cette date — la dette est bornée, pas espérée.
- **L'exemption L11 des gabarits pourrait être lue comme un affaiblissement.** *Signal* : quelqu'un ajoute un gabarit à `assets/` et s'étonne qu'il échoue. *Parade* : l'exemption est nominative et s'apparie au CHEMIN — un gabarit ajouté échoue jusqu'à ce qu'on le déclare, et le contrôle imprime ce qu'il écarte à chaque exécution.
- **Les 5 commits ne sont pas poussés.** *Signal* : un autre poste synchronise et ne voit rien. *Parade* : le push est un geste sur GO humain (noyau) — c'est l'action `manuelle_utilisateur` n°1 ci-dessous.

## 8. Prochaines actions — ordonnées, et par acteur

L'ordre est dérivé : d'abord ce qui rend le travail visible ailleurs (les 5 commits restent locaux tant que le push n'est pas donné), puis ce qui débloque le plus d'items en aval (D1 lève la moitié de la condition de TF-0324), puis les candidats neufs par score.

- **manuelle_utilisateur — 1.** Relire les 5 commits et donner le GO de push (pilot, forge-tests, forge-agents, forge-design, forge-websec).
- **manuelle_utilisateur — 2.** Trancher D1 (`pilote-de-mission` existe-t-il ailleurs ?) — c'est la seule des trois décisions qui débloque un autre item.
- **manuelle_utilisateur — 3.** Trancher D2 et D3, ou laisser leurs options par défaut s'appliquer.
- **manuelle_utilisateur — 4.** Décider TF-0361 et TF-0362, les deux candidats nés de cette boucle (score 8 chacun).
- **manuelle_dev — 5.** Injecter l'entrée `oracle-motion` à jour (10 règles) dans le registre installé de `quality-oracles` — geste de poste, entrée prête dans `registre-entrees.md`.
- **auto_ia — 6.** Au prochain run produit atteignant l'étape tests : exercer la boucle câblée et vérifier que `forge/journal-boucle.jsonl` se remplit.
- **auto_ia — 7.** Rejouer la section `corpus` de la recette forge-tests quand un démon de conteneurs est disponible — 9 défauts redeviennent mesurables.

## 9. Traces

- Registre : `todo/TODO.jsonl` (21 événements du 18/08), vues `todo/TODO.md` et `todo/TODO.html` régénérées, sceau `ce748084237b`.
- Études : `output/03-etudes/20260818-etude-opportunite-admission-digit-ai-queue.md` · `output/03-etudes/20260818-etude-opportunite-cablage-orchestrer-boucle.md`.
- Note de revue : `output/04-plans/Digit-AI - Note Revue - Denominateur des freres - 20260818a.md`.
- Constat : `digit-ai-forge-agents/constats/Digit-AI - Constat Forge - Recherche pilote-de-mission - 20260818a.md`.
- Commits : pilot `4357250` · forge-tests `afa6b41`, `201ee81`, `c5a5915` · forge-agents `528220b` · forge-design `251d89d` · forge-websec `e2473a6`.
- Code neuf : `forge_tests/{boucle,revue,droits,classes}.py` · `outillage-tests-e2e/appels-reels.mjs` · `digit-ai-forge-agents/maj-versions-livrees.mjs` · `digit-ai-schemas/scripts/embarquer-polices.mjs` · `systeme-de-marque/scripts/self-test.mjs`.
