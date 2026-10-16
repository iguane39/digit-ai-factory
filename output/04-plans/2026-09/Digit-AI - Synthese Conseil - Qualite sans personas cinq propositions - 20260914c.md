---
destinataire: humain
---

# Synthèse Conseil — améliorer la qualité sans personas : vos deux décisions sont exécutées, et cinq propositions mesurées sur les défauts réels vous attendent ; une décision (14/09/2026)

Vos deux décisions sont faites : aucun persona ne sera construit, et le banc des défauts échappés existe. Il vit dans le pilot pour sa partie publique et dans le canal confidentiel pour les livrables, et ses contrôles passent. Pour répondre à votre question, j'ai vérifié, défaut par défaut, si un contrôle automatique attraperait aujourd'hui les dix défauts de l'étude. La réponse est rassurante et inquiétante à la fois. Sept sont désormais couverts et trois le sont en partie, mais chacun de ces contrôles est né APRÈS que le défaut vous a échappé. La factory apprend bien, mais elle apprend après coup. Les cinq propositions visent donc à apprendre avant : prouver que les contrôles attrapent vraiment les défauts, ne plus perdre les limites notées à la clôture d'un chantier, combler deux trous précis, faire redescendre les contrôles là où les défauts reviennent, et tester les contrôles avec des défauts volontairement semés. Ce qui est attendu de vous : dire lesquelles lancer.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-2 (a) et D-3 (a) du 14/09/2026 (« 2a & 3a »), puis réponse à la question « quelles autres propositions pour améliorer la qualité sans personas ? », fondée sur un relevé de couverture des dix défauts échappés de l'étude par les contrôles existants.
- **sur quoi** — le pilot `digit-ai-factory` et, sur votre mandat D-3 (a), le canal confidentiel `c:\dev\_confidentiel` ; lectures seules sur `digit-ai-forge-tests`, `digit-ai-forge-audit`, `digit-ai-forge-agents` et le socle `digit-ai-page-html`.
- **quand** — 2026-09-14 11:46 UTC+02:00 (Europe/Paris) ; décision journalisée à 09:37:41 UTC ; durée mesurée depuis votre message ≥ 10 min.
- **qui** — pilot `a3cde26` (aucun enregistrement fait) ; session Opus 5 ; une délégation au modèle Sonnet (relevé de couverture, 87 lectures, 183 030 tokens) ; escalade de modèle : aucune.

## 2. Verdict en une ligne

**D-2 (a) et D-3 (a) exécutées : TF-1073 journalisée décidée (`oracle-todo` PASS → PASS), banc versionné en 7 pièces avec recette 3/3, 10 livrables rangés au canal (`oracle-confidentiel` PASS 5/5) ; couverture des 10 défauts échappés par les contrôles d'aujourd'hui : 7 oui, 3 partielle, 0 non, tous nés après le défaut ; 103 restes déclarés sur 781 items archivés du pilot ; 5 propositions ; 0 enregistrement, 0 push.**

## 3. Décisions attendues de l'humain

Le relevé montre une boucle qui marche mais qui réagit : chaque défaut échappé a produit son contrôle, jamais l'inverse. Les cinq propositions ci-dessous déplacent l'effort avant l'échappée. Chacune porte sa mesure ; le détail est sous la décision.

> **D-4 — Quelles propositions d'amélioration de la qualité sans personas lancez-vous, et dans quel ordre ?**
>
> Cinq propositions, de la plus légère à la plus lourde. **P-1** : rejouer, sur les livrables fautifs du banc, chaque contrôle qui prétend couvrir son défaut, pour que la couverture soit prouvée par l'exécution et plus seulement par le registre. **P-2** : donner au pilot le registre de dette qu'a déjà forge-tests, pour que les 103 restes notés à la clôture d'items archivés deviennent chacun une candidature ou une limite motivée. **P-3** : combler deux trous précis, les variantes d'image identiques et la porte de fraîcheur jugée sur une seule page. **P-4** : faire redescendre les contrôles là où les défauts reviennent, deux classes récidivant à 100 % et 86 % et l'héritage de 11 produits portant 39 manques. **P-5** : semer volontairement un défaut par classe pour mesurer le rappel de chaque contrôle avant qu'un humain ne trouve.
>
> **Recommandation : (a).** Source consultée : le relevé de couverture de ce tour (7 oui, 3 partielle, 0 non, avec chemin et ligne de chaque contrôle), `oracles\banc-defauts-echappes\README.md` (règle d'usage du banc), `digit-ai-forge-tests\registre-dette.json` (le modèle d'un registre de restes qui fonctionne) et `references\TODO-FORGE.md` (« tout entre en candidat, décision humaine »). P-1 et P-2 sont simples, jouées dans le pilot seul, et conditionnent la justesse des trois autres.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** exécuter P-1 et P-2 maintenant, déposer P-3, P-4 et P-5 en candidatures pour décision séparée | effort moyen × court (rejeu de sept contrôles, relevé des 103 restes, un lot de candidatures) | exclut toute écriture chez les produits et les forges dans ce tour : P-3 et P-4 y touchent et attendent leurs runs |
| **(b)** tout déposer en candidatures, ne rien exécuter | effort simple × court | exclut la preuve de couverture : les sept « oui » restent établis sur le registre, pas sur le livrable fautif |
| **(c)** ne rien lancer | effort nul | exclut tout gain : la boucle continue d'apprendre après l'échappée, et les 103 restes restent en archive |

> **Si rien n'est décidé** : l'option (c) s'applique — rien n'est lancé, les propositions restent dans cette synthèse.

Le détail de chaque proposition, dans l'ordre recommandé : la mesure qui la fonde, ce qu'elle fait, les défauts de l'étude qu'elle touche.

- **P-1 — prouver la couverture sur le livrable fautif.**
  - mesure : les 7 « oui » du relevé sont établis par le code et le registre, jamais rejoués sur le livrable qui a fauté — R-23 (aucun identifiant affiché sur une page servie), le champ obligatoire de la fiche sécurité, L21 (toute classe de composant a sa règle de style), S13 (action humaine exécutable telle quelle), la résolution des tables par l'oracle, l'oracle d'autorité de décision, V16 (distance de couleur entre badges) ;
  - fait et couvre : chaque livrable du banc devient la fixture rouge réelle du contrôle qui dit le couvrir, et un contrôle qui ne le refuse pas perd son « oui » — les 7 défauts couverts.
- **P-2 — un registre de dette pour le pilot.**
  - mesure : 103 des 781 items archivés portent un reste non vide, sans domicile ; exemple, la porte de fraîcheur, dont la règle M-8 (fraîcheur de la mise en production) porte ce reste : « M-8 EST UNE RÈGLE DE DOSSIER, PAS UN ORACLE » ; forge-tests tient au contraire ses restes dans `registre-dette.json` (231 entrées, contrôlé par `dette.py` et deux tests) ;
  - fait et couvre : chaque reste devient une candidature ou une limite motivée et datée — la porte de fraîcheur et 102 autres restes.
- **P-3 — deux trous précis.**
  - mesure : aucun contrôle ne compare deux fichiers déclarés variantes (le seul voisin, `oracle-parite-assets`, vérifie l'inverse : qu'une copie reste identique à sa source) ; M-8 se lit au dossier, aucun script ne l'exécute ;
  - fait et couvre : un contrôle qui refuse deux variantes d'image à empreinte identique, et une preuve par perturbation qui modifie une page hors accueil en recette et vérifie que la porte de fraîcheur le voit — les logos et la porte de fraîcheur.
- **P-4 — faire redescendre les contrôles là où les défauts reviennent.**
  - mesure : `gabarit-famille-manquante` récidive dans 13 cas sur 13, `oracle-remplace-par-controle-maison` dans 12 sur 14 ; l'héritage de 11 produits porte 39 manques au relevé d'ouverture du 14/09 ;
  - fait et couvre : pour ces deux classes, un contrôle à la porte (hook) plutôt qu'une règle écrite, et la redescente de l'héritage par des runs demandés aux produits — les récidives, et tout défaut couvert chez un produit qui n'a pas le contrôle.
- **P-5 — semer des défauts.**
  - mesure : 7 classes sur 74 n'ont aucun contrôle déclaré, dont `surface-implicite-non-livree`, alors que R-23 couvre pourtant son défaut ; pour les 67 autres, rien ne prouve le rappel avant qu'un humain ne trouve, et les 10 défauts de l'étude ont tous échappé d'abord ;
  - fait et couvre : une instance semée par classe dans un livrable témoin, qui doit être refusée par le contrôle déclaré — toutes les classes.

Ce que je **ne reprends pas** en proposition, et pourquoi : étendre le contrôle d'accord de forge-tests au participe après copule (les chaînes traduites de l'étude). Ce reste a déjà son domicile : l'entrée `glossaire-009` du registre de dette de forge-tests, statut `todo`, avec le contre-exemple réel qui en fixe la difficulté — un masculin juste qu'un contrôle naïf accuserait. Le proposer ici en ferait un doublon ; c'est forge-tests qui le porte, et c'est exactement le cas qu'illustre P-2 : un reste qui a un registre ne se perd pas. En attendant, le filet est la relecture native déclarée avant remise (`oracle-remise-traduction`, règle T1).

## 4. Traité — avec sa preuve

- **La décision de TF-1073 est au registre, horodatée par l'outil.**
  - preuve : `node todo\journaliser.mjs` → `PASS -> PASS`, `2026-09-14T09:37:41.268Z TF-1073 maj decide`.
- **L'étude porte la décision humaine et reste verte.**
  - preuve : `oracle-etude-opportunite.mjs` → PASS ; `check_markdown.py` → PASS.
- **Le banc est versionné dans le pilot, exercé à double sens.**
  - preuve : `node --test oracles\banc-defauts-echappes\banc.test.mjs` → `# pass 3`, `# fail 0` ; `check_markdown.py` sur son README → PASS ; `git status` → `A` sur 7 fichiers ; 0 nom réel.
- **Les livrables reconstitués sont au canal confidentiel, qui reste privé et sans secret.**
  - preuve : 10 fichiers sous `bancs\defauts-echappes\livrables\` ; `node oracle-confidentiel.mjs .` → `"verdict": "PASS"`, K1 à K5, exit 0.
- **La couverture des dix défauts est relevée, contrôle par contrôle, avec sa source.**
  - preuve : relevé délégué (87 lectures) : E-01 → R-23 (TF-0871) ; fiche sécurité → FS1 (tout champ du canevas renseigné) et `auth.population_admise` (forge-audit `d8bb934`) ; sommaire → L21 (`check_html.py` l. 1799-1835) ; action de synthèse → S12/S13 (`oracle-synthese.mjs` l. 606-616) ; tables → résolution par l'oracle (forge-agents `bfdb251`) ; décision affirmée → `oracle-autorite-decision` A1-A4 ; badges → V16 (`render_page.py` l. 1163-1243) ; partielles : M-8, S27 et V9, `confronter_genre()`.
- **Les restes déclarés et les récidives sont mesurés au registre.**
  - preuve : `node -e` sur `todo\TODO-ARCHIVE.jsonl` → « items archives 781 avec un reste non vide 103 » ; `todo\RECIDIVES.md` → `gabarit-famille-manquante` 13 récidives sur 13 items, `oracle-remplace-par-controle-maison` 12 sur 14 ; `todo\CLASSES.json` → « classes 74 sans oracle declare 7 ».

## 5. Non traité — avec son motif

- L'exécution des cinq propositions — motif : dépendance à une décision humaine (D-4).
- L'enregistrement du pilot et du canal, et leur push — motif : bloqué par un garde-fou, R-38 §4 (publication d'un livrable sur GO humain), et la consigne de session n'enregistre rien sans demande.
- La preuve que les sept contrôles « oui » refusent réellement leur livrable fautif — motif : dépendance à une décision humaine (D-4, c'est P-1) ; le relevé les établit par le code et le registre, pas par une exécution.

## 6. Écarts à la lettre

- **Vous avez demandé** « quelles autres propositions » → **j'ai d'abord mesuré** la couverture des défauts réels par les contrôles existants, puis proposé ce que la mesure désigne → **pourquoi** : une liste de bonnes pratiques de mémoire aurait proposé des contrôles qui existent déjà ; sept des dix défauts sont couverts, et le vrai manque est ailleurs, dans l'ordre d'apparition du contrôle et du défaut.
- **Une piste naturelle n'est pas reprise** : étendre le contrôle d'accord grammatical → **pourquoi** : elle est déjà au registre de dette de forge-tests (`glossaire-009`, statut `todo`), qui la porte ; la proposer ici ferait un doublon.
- **J'avais écrit en cours de tour** que je ne proposerais pas cette extension « pour ne pas fabriquer de faux positifs » → **c'était inexact** → **pourquoi** : l'entrée de forge-tests est `todo`, pas une limite assumée ; forge-tests compte la traiter, en tenant compte du contre-exemple.

## 7. Risques

- Les sept « oui » du relevé peuvent être plus optimistes que la réalité : un contrôle écrit et câblé peut ne pas refuser le livrable réel ;
  - signal : un contrôle qui rend PASS sur le livrable fautif du banc ;
  - parade : P-1 est précisément ce test ; en attendant, la couverture est déclarée « établie par le code », pas « prouvée ».
- Les fichiers indexés du pilot et les ajouts du canal ne sont pas enregistrés ;
  - signal : un enregistrement d'une autre session emportant `oracles/banc-defauts-echappes/` ;
  - parade : A-2 enregistre les deux dépôts avec `git commit --only` sur votre feu vert.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), dans l'ordre recommandé de D-4 — la preuve de couverture avant le registre de dette, les candidatures ensuite, l'enregistrement en dernier parce qu'il attend un feu vert distinct ; puis les actions humaines.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-10 | P-1 — rejouer sur chaque livrable de `c:\dev\_confidentiel\bancs\defauts-echappes\livrables\` le contrôle qui dit le couvrir (R-23, FS1, L21, S13, résolution des tables, `oracle-autorite-decision`, V16) et consigner PASS ou FAIL par défaut (neuve) | auto_ia | `dependance_bloc_3` — attend D-4 (a) ; à défaut, la couverture reste établie par le registre seul | simple × court |
| A-11 | P-2 — relever les 103 `reste_a_faire` de `todo\TODO-ARCHIVE.jsonl` et proposer pour chacun candidature ou limite motivée, sur le modèle de `registre-dette.json` de forge-tests (neuve) | auto_ia | `dependance_bloc_3` — attend D-4 (a) ; à défaut, les restes restent sans domicile | moyen × court |
| A-12 | Déposer P-3, P-4 et P-5 en candidatures dans `input\01-candidatures\` et les ingérer par `node todo\ingerer-lot.mjs` (neuve) | auto_ia | `dependance_bloc_3` — attend D-4 (a) ou (b) ; à défaut, elles ne vivent que dans cette synthèse | simple × court |
| A-2 | Enregistrer le pilot (étude, mesure, banc, sidecar (fichier de candidature), trois synthèses, index) et le canal (`LISEZMOI.md`, `bancs\`) par `git commit --only -- <chemins>`, puis pousser les deux dépôts (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-4 ; à défaut, tout reste local, non enregistré | simple × court |
| A-13 | Trancher D-4 — répondre « D-4 (a) », « D-4 (b) » ou « D-4 (c) », en retirant au besoin une proposition (« D-4 (a) sans P-5 ») (neuve) | manuelle_utilisateur | `decision` — lancer un chantier est un arbitrage humain (`references\TODO-FORGE.md`) ; sinon : rien n'est lancé | simple × court |
| A-4 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 ; sinon : les fichiers restent non enregistrés | simple × court |

## 9. Traces

- Banc : `oracles\banc-defauts-echappes\` (README, manifeste, `construire.mjs`, `decompter.mjs`, `banc.test.mjs`, `jugement-20260914\`)
- Canal confidentiel : `c:\dev\_confidentiel\bancs\defauts-echappes\livrables\` et `c:\dev\_confidentiel\LISEZMOI.md`
- Étude : `output\03-etudes\20260914-etude-opportunite-personas-par-phase.md`
- Registre : `todo\TODO.jsonl` (TF-1073), `todo\TODO-ARCHIVE.jsonl` (103 restes), `todo\RECIDIVES.md`, `todo\CLASSES.json`
- Registre de dette de référence : `c:\dev\digit-ai-forge-tests\registre-dette.json` (lecture seule)
- Oracles : `todo\oracle-todo.mjs` (PASS), `banc.test.mjs` (3/3), `oracle-confidentiel.mjs` (PASS 5/5), `oracle-etude-opportunite.mjs` (PASS), `check_markdown.py` (PASS), `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour.
