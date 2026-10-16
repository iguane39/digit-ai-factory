---
destinataire: humain
---

# Synthèse Mandat — D-4 (a) exécutée : les contrôles ne couvrent réellement que 2 défauts échappés sur 9, un bug dans notre propre juge de restitution, un risque de sécurité remonté des archives, une analyse du prompt « conception documentaire en amont » ; cinq décisions vous attendent (14/09/2026)

Votre décision de lancer les propositions d'amélioration est exécutée en entier. La preuve la plus attendue a changé le tableau. Hier, en lisant le code, on comptait sept défauts échappés sur dix couverts par un contrôle. Joués pour de vrai sur les livrables fautifs, ces contrôles n'en attrapent exactement que deux sur neuf, en attrapent trois à moitié, et en laissent passer quatre. L'un d'eux est le contrôle qui juge chacune de nos restitutions : il ne voit pas une action impossible à exécuter dès qu'elle est écrite comme le modèle le demande. Les 103 notes de fin de chantier archivées sont triées, et ce tri a fait remonter un risque de sécurité : des fichiers d'identifiants publiés chez trois produits, que la vérification du 30 août vous demandait de faire changer, et que le contrôle concerné signale sans que personne ne le lise. Seize candidatures sont au registre. Votre nouveau prompt est analysé : l'outil de conception demandé existe déjà en morceaux, et le vrai manque est de le faire jouer avant l'écriture. Ce qui est attendu de vous : confirmer la rotation des identifiants, dire si l'on corrige notre juge de restitution, valider la lecture de votre prompt, et trancher deux questions de méthode.

## 1. En-tête d'identification

- **quoi** — exécution de la décision D-4 (a) du 14/09/2026 (« 4a ») : P-1 (preuve de couverture sur le banc) rendue, P-2 (tri des restes archivés) rendue avec ses candidatures, P-3 (deux contrôles manquants à outiller), P-4 (redescente des contrôles chez les produits) et P-5 (défauts semés dans des livrables témoins) déposées en candidatures ; vérification actuelle du risque de secrets remonté par P-2 ; analyse L99 (analyse de prompt en huit couches) du prompt « conception documentaire en amont, gabarits sans retour, amélioration continue ».
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; lectures seules sur le canal confidentiel, `digit-ai-forge-tests`, `digit-ai-forge-audit`, le socle `digit-ai-page-html` et l'oracle des secrets hors périmètre, joué sur le parc sans ouvrir aucun fichier de secrets.
- **quand** — 2026-09-14, dernier horodatage mesuré 12:29 UTC+02:00 (registre, 10:29:32 UTC) ; durée mesurée depuis votre message ≥ 40 min.
- **qui** — pilot `a3cde26` (aucun enregistrement fait) ; session Opus 5 ; deux délégations au modèle Sonnet (P-1 : 101 appels d'outils, 378 817 tokens ; P-2 : 221 333 tokens) ; escalade de modèle : aucune.

## 2. Verdict en une ligne

**D-4 (a) exécutée à 5 propositions sur 5 : couverture jouée des 9 défauts mesurés du banc — 2 exactes, 3 partielles, 4 aucune (le relevé lu en comptait 7) ; bug de S13 reproduit dans les deux sens ; 16 candidatures ingérées (TF-1074 à TF-1089, `oracle-todo` exit 0, 307 items, 140 récidives) ; 103 restes archivés triés — 49 limites à assumer, 44 candidatures en 15 regroupements (5 ingérés, 10 sans classe exacte), 5 repris, 5 caducs ; `oracle-secrets-hors-perimetre` FAIL aujourd'hui (11 porteurs hors dépôt, 3 dans des dépôts qui ne les ignorent pas, dont des fichiers publiés), exit 0 donc invisible ; analyse L99 28/100 → 88/100 projeté ; `check_markdown.py` PASS sur les quatre documents du tour ; 0 enregistrement, 0 push.**

## 3. Décisions attendues de l'humain

**Chapeau commun.** Deux faits de ce tour touchent la sûreté du dispositif lui-même. Quatorze fichiers d'identifiants sont hors de leur place chez des produits, dont certains publiés sur le dépôt distant de trois produits ; la vérification du 30/08 vous a demandé leur rotation, et le contrôle qui les surveille rend un échec à chaque fin de tour sans que personne ne le lise. Et la règle qui vérifie qu'une action laissée à l'humain est exécutable ne la vérifie pas quand l'action est écrite au format du gabarit. Les trois premières décisions portent sur ces deux faits, les deux suivantes sur les propositions du jour.

> **D-5 — La rotation des identifiants demandée par la vérification du 30/08 a-t-elle été faite ?**
>
> Il s'agit des identifiants contenus dans les fichiers publiés chez trois produits ; retirer ces fichiers ne change rien, seul le changement de l'identifiant chez son fournisseur réduit le risque.
>
> **Recommandation : (b).** Source consultée : `output\04-plans\Digit-AI - Synthese Mandat - Identifiants exposes verification - 20260830i.md` (« la rotation vous appartient », l. 15 et 84 ; « la rotation des 4 secrets rend le contenu publié inoffensif », l. 103) et la sortie de `oracle-secrets-hors-perimetre` du 14/09 (règle SP2 (secret dans un dépôt qui ne l'ignore pas), « seule une ROTATION de l'identifiant réduit le risque »). L'oracle ne peut pas voir une rotation ; sans votre réponse, le risque doit être tenu pour ouvert.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** elle est faite — répondre « D-5 (a) » ; je la consigne au registre et j'annote le constat de l'oracle | effort simple × court | exclut toute nouvelle alerte sur ces identifiants |
| **(b)** elle n'est pas faite — vous la faites maintenant, dans la console de chaque fournisseur, dans l'ordre du relevé du 30/08 | effort simple × court par identifiant, geste qui vous appartient | exclut de laisser des identifiants publiés actifs |
| **(c)** risque accepté, sans rotation | effort nul | exclut la protection des comptes concernés ; le constat reste rouge |

> **Si rien n'est décidé** : l'option (c) s'applique de fait — les identifiants publiés restent actifs s'ils l'étaient.

> **D-6 — Rend-on visibles les constats de l'oracle des secrets, qui sort sans bloquer sur les produits et que personne ne lit ?**
>
> L'oracle est câblé en fin de tour ; par construction il ne bloque que ce que le pilot peut réparer, et un hook de fin de tour qui ne bloque pas n'affiche rien. Ses constats sur les produits n'atteignent donc aucun lecteur, tour après tour.
>
> **Recommandation : (a).** Source consultée : `.claude\settings.json` l. 20-31 (oracle joué au hook Stop) et `oracles\oracle-secrets-hors-perimetre.mjs` l. 356-372 (« il nomme, et il ne bloque que ce qu'il peut faire réparer », exit 1 seulement sur le pilot et les forges). Nommer sans montrer n'est pas nommer.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** afficher ses constats produits au relevé d'ouverture de session, comme l'héritage, et déposer une candidature pour la classe « constat non bloquant jamais lu » | effort simple × court | exclut un échec silencieux de plus de quelques heures |
| **(b)** déposer seulement la candidature | effort simple × court | exclut toute visibilité avant sa décision |
| **(c)** laisser en l'état | effort nul | exclut tout signal : le prochain secret mal placé restera invisible |

> **Si rien n'est décidé** : l'option (c) s'applique — l'oracle continue de constater sans que personne ne le lise.

> **D-9 — Corrige-t-on maintenant la règle S13 de notre juge de restitution, qui laisse passer toute action humaine non exécutable écrite au format du gabarit ?**
>
> La preuve de couverture l'a montré sur une synthèse réelle du 17/08, puis je l'ai reproduit : même fichier, S13 rend PASS quand l'acteur est entre accents graves et FAIL sans eux. Le retrait du nom d'acteur laisse deux accents graves autour d'une espace, que la règle prend pour un chemin. Corriger S13, c'est corriger le contrôle qui juge aussi mes propres restitutions : sa correction doit donc mesurer d'abord combien de synthèses existantes elle aurait refusées.
>
> **Recommandation : (a).** Source consultée : `oracles\oracle-synthese.mjs` l. 207, 584 et 613 ; `oracles\banc-defauts-echappes\preuve-couverture-20260914.md` (reproduction dans les deux sens) ; `gabarits\RESTITUTION.md` § Contrôle, « Calibration mesurée d'une règle neuve » (une règle entre avec son taux d'accusation relevé sur le corpus réel).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** corriger S13, lui donner sa paire de fixtures rouge et verte, mesurer son taux d'accusation sur les synthèses de `output\04-plans\` avant de l'activer, puis clore TF-1085 | effort simple × court | exclut qu'une restitution porte encore une action humaine sans chemin ni commande en passant le juge |
| **(b)** laisser la correction en candidature (TF-1085) pour un mandat séparé | effort nul dans ce tour | exclut toute protection d'ici là : chaque restitution peut porter le défaut que S13 existe pour voir |
| **(c)** ne pas corriger | effort nul | exclut la règle elle-même : S13 reste décorative pour le format canonique |

> **Si rien n'est décidé** : l'option (b) s'applique — TF-1085 reste en candidat, S13 reste aveugle au format canonique.

> **D-7 — La lecture reconstruite de votre prompt « conception documentaire en amont » et ses sept écarts sont-ils validés, et l'étude se lance-t-elle avec le prompt réécrit ?**
>
> Le prompt réécrit garde vos trois intentions — concevoir en amont par type de document, de contenu et de lecteur ; améliorer les gabarits sans retour ; boucler à chaque retour — mais il part de l'existant (règle de conception D8, typologie des lecteurs, catalogue de 32 familles, deux oracles), définit le lecteur par ce qu'il doit décider plutôt que par un personnage, éprouve les gabarits avant de les modifier, et mesure un taux de retours par document compté au lieu de viser « documents sans retour ». Les sept écarts sont au chapitre 8 de l'analyse, un par ligne, dont un seuil que je propose (6 griefs évités sur 20). La preuve de couverture du jour renforce le point de départ : les contrôles lus couvrent moins que ce qu'on croyait.
>
> **Recommandation : (a).** Source consultée : `output\03-etudes\20260914-L99-conception-documentaire-amont.md` chapitre 8, `references\INTENTION.md` (une intention reconstruite est validée par le demandeur avant exécution), `gabarits\documents\README.md` D8 et D9.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** valider et lancer l'étude avec le prompt réécrit | effort complexe × moyen (mesure de départ, rétro-test sur 20 griefs, étude, candidatures) | exclut tout outil construit avant votre GO |
| **(b)** valider avec amendements — « D-7 (b) sauf écart n° X » | même effort, plus la reprise du prompt | exclut un lancement dans ce tour |
| **(c)** ne pas lancer | effort nul | exclut toute mesure ; les trois classes du sujet continuent de récidiver |

> **Si rien n'est décidé** : l'option (c) s'applique — l'analyse reste déposée, l'étude n'est pas jouée.

> **D-8 — Que fait-on des dix regroupements de restes sans classe exacte et des 49 limites à assumer ?**
>
> Le tri des restes archivés propose 15 candidatures regroupées ; cinq avaient une classe existante et sont ingérées ; dix n'ont aucune classe exacte au référentiel, et l'ingestion refuse une classe approchée. Les 49 restes à assumer demandent seulement d'être écrits comme limites datées, ce que le pilot n'a nulle part où faire.
>
> **Recommandation : (a).** Source consultée : `output\03-etudes\20260914-releve-restes-archives.md`, `todo\ingerer-lot.mjs` l. 229-265 (une classe nouvelle se crée dans le référentiel, datée et sourcée, jamais dans le sidecar) et `digit-ai-forge-tests\registre-dette.json` (le modèle de registre de limites).

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** créer un registre de dette du pilot avec les 49 limites, créer les classes manquantes datées et sourcées, puis ingérer les dix regroupements | effort moyen × court | exclut que ces restes retournent dormir en archive |
| **(b)** ingérer seulement les dix regroupements, classes créées, sans registre de dette | effort simple × court | exclut la distinction entre travail oublié et limite assumée |
| **(c)** laisser le relevé comme seule trace | effort nul | exclut tout porteur : les restes restent visibles dans une étude, pas dans le registre |

> **Si rien n'est décidé** : l'option (c) s'applique — le relevé reste la seule trace.

## 4. Traité — avec sa preuve

- **P-1 est rendue : chaque contrôle réputé couvrir un défaut du banc a été exécuté sur le livrable fautif.** Exactes : L21 (sommaire) et V16 (badges) ; partielles : R-23 (fiche d'accès, pas la page), `confronter_genre()` (1 fragment sur 7), S12 (autre grief) ; aucune : fiche sécurité (règles formelles), synthèse (S13), logo (V9), porte de fraîcheur, installateur du hameçon.
  - preuve : `oracles\banc-defauts-echappes\preuve-couverture-20260914.md` ; `check_markdown.py` → PASS ; sorties probantes citées ligne par ligne (par exemple V16 : « écart de couleur (Delta-E CIE76) 19.5 < 20 ET écart de luminance 0.013 < 0.25 », bloquant).
- **Le bug de S13 est reproduit dans les deux sens.** Classe : `controle-sans-fixture-double-sens`.
  - preuve : contrôle rouge — `node oracles\oracle-synthese.mjs` sur la synthèse du 17/08 → « S13 PASS » ; contrôle vert — même fichier, seuls les accents graves autour de l'acteur retirés (`diff` → 2 lignes) → « S13 FAIL, une action laissée à l'humain sans chemin, commande ni libellé d'écran ».
- **Les cinq défauts de contrôles révélés par P-1 sont au registre en candidat** (TF-1085 à TF-1089).
  - preuve : `node todo\ingerer-lot.mjs input\01-candidatures\preuve-couverture-p1-20260914a.tf.jsonl --sans-fetch` → « [OK] 5 candidature(s) ingérée(s) en CANDIDAT (lot fd9b4bd949d3) » ; `node todo\oracle-todo.mjs` → exit 0 ; `generer-page.mjs` → « 307 items » ; `generer-recidives.mjs` → « 140 récidive(s) ».
- **P-3 à P-5 sont au registre en candidat** (TF-1074 à TF-1079).
  - preuve : `node todo\ingerer-lot.mjs input\01-candidatures\qualite-sans-personas-p3-p5-20260914a.tf.jsonl --sans-fetch` → « [OK] 6 candidature(s) ingérée(s) en CANDIDAT (lot 3ae6780aed67) ».
- **P-2 est rendue : les 103 restes archivés sont triés et publiés, et cinq regroupements à classe valide sont au registre** (TF-1080 à TF-1084).
  - preuve : `output\03-etudes\20260914-releve-restes-archives.md` ; `check_markdown.py` → PASS ; `node todo\ingerer-lot.mjs input\01-candidatures\restes-archives-p2-20260914a.tf.jsonl --sans-fetch` → « [OK] 5 candidature(s) ingérée(s) en CANDIDAT (lot 8b06ce0d326b) ».
- **Le risque de secrets est vérifié actuel, sans ouvrir un seul fichier de secrets, et la cause de son invisibilité est établie.**
  - preuve : `node oracles\oracle-secrets-hors-perimetre.mjs` → verdict FAIL, SP1 FAIL (« 11 porteur(s) de secrets HORS DE TOUT DÉPÔT »), SP2 FAIL (« 3 porteur(s) de secrets DANS un dépôt qui ne les IGNORE PAS, état le plus grave : PUBLIÉ ») ; même commande rejouée → « exit reel=0 » ; `.claude\settings.json` l. 20-31 (joué au hook Stop).
- **L'analyse L99 du prompt est rendue et jugée.**
  - preuve : `output\03-etudes\20260914-L99-conception-documentaire-amont.md` ; `check_markdown.py` → PASS, exit 0 ; 0 nom réel.

## 5. Non traité — avec son motif

- La rotation des identifiants — motif : dépendance à une décision humaine (D-5) ; elle se joue dans la console de chaque fournisseur, sur des comptes qui vous appartiennent.
- La correction de S13 — motif : dépendance à une décision humaine (D-9) ; elle modifie le juge de mes propres restitutions et doit d'abord mesurer son taux d'accusation.
- Les dix regroupements sans classe exacte et les 49 limites — motif : dépendance à une décision humaine (D-8).
- L'enregistrement et le push — motif : bloqué par un garde-fou, R-38 §4 (publication d'un livrable sur GO humain).

## 6. Écarts à la lettre

- **Vous avez écrit** « Améliore ce prompt : 4a + … » → **j'ai fait** l'exécution de D-4 (a) et l'analyse L99 du reste → **pourquoi** : « 4a » est un sélecteur de décision, qui reçoit la preuve de son geste ; « Améliore ce prompt » appelle le skill L99 (lexique RV-6).
- **La synthèse précédente annonçait** 7 défauts sur 10 couverts, « établis par le code et le registre » → **la mesure donne** 2 couvertures exactes sur 9 → **pourquoi** : lire un contrôle ne dit pas ce qu'il refuse ; le chiffre de 7 était déclaré « non prouvé », et P-1 existait pour l'éprouver.
- **D-4 (a) disait** « exécuter P-2 » → **j'ai ingéré** 5 des 15 regroupements → **pourquoi** : l'ingestion refuse une classe approchée ; les dix autres attendent des classes que D-8 fait créer.
- **Le relevé délégué a affiché** des noms réels de produits et de clients dans ma sortie de travail → **j'ai fait** en sorte qu'aucun ne soit recopié dans un fichier du pilot → **pourquoi** : porte des noms ; les trois produits concernés sont désignés par leur nombre, jamais par leur nom.
- **Les sept écarts** entre votre prompt et le prompt réécrit sont au chapitre 8 de l'analyse, section « Écarts à la lettre », et se valident par D-7.

## 7. Risques

- Des identifiants publiés sur le dépôt distant de trois produits sont peut-être encore actifs ;
  - signal : `oracle-secrets-hors-perimetre` SP2 en échec ;
  - parade : D-5 (b), la rotation ; tant qu'elle n'est pas confirmée, le risque est tenu pour ouvert.
- Des restitutions passées ont pu porter des actions humaines non exécutables en passant S13, et les prochaines le peuvent encore ;
  - signal : une action `manuelle_utilisateur` ou `manuelle_dev` sans chemin ni commande dans une synthèse jugée PASS ;
  - parade : D-9 (a), avec la mesure du taux d'accusation sur le corpus, qui dira combien de synthèses sont concernées.
- Un contrôle qui constate sans être lu redonnera le même silence sur le prochain secret mal placé ;
  - signal : un échec de l'oracle des secrets absent du relevé d'ouverture ;
  - parade : D-6 (a).
- Le registre grossit de seize candidatures en un jour ;
  - signal : la contre-métrique « classe suspecte » et le compte des récidives, passé de 129 à 140 aujourd'hui ;
  - parade : les candidatures regroupent les restes par manque commun ; leur décision reste la vôtre.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), la sécurité en tête parce qu'elle réduit un risque ouvert, puis la correction du juge, les suites des décisions, l'enregistrement en dernier ; puis les actions humaines, la rotation en tête.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-14 | Faire afficher les constats produits d'`oracle-secrets-hors-perimetre` par `oracles\hook-ouverture.mjs` et déposer la candidature de la classe « constat non bloquant jamais lu » (neuve) | auto_ia | `dependance_bloc_3` — attend D-6 (a) ; à défaut, l'échec reste silencieux | simple × court |
| A-19 | Corriger S13 dans `oracles\oracle-synthese.mjs` (retirer l'acteur et ses accents graves avant `_LOCALISATEURS`), ajouter la paire de fixtures, mesurer le taux d'accusation sur `output\04-plans\`, puis clore (TF-1085) | auto_ia | `dependance_bloc_3` — attend D-9 (a) ; à défaut, S13 reste aveugle au format canonique | simple × court |
| A-15 | Créer le registre de dette du pilot (49 limites), les classes manquantes datées et sourcées dans `todo\CLASSES.json`, puis ingérer les dix regroupements (neuve) | auto_ia | `dependance_bloc_3` — attend D-8 ; à défaut, le relevé reste la seule trace | moyen × court |
| A-16 | Jouer l'étude « conception documentaire en amont » avec le prompt réécrit du chapitre 8 de l'analyse (neuve) | auto_ia | `dependance_bloc_3` — attend D-7 ; à défaut, l'étude n'est pas jouée | complexe × moyen |
| A-2 | Enregistrer le pilot et le canal par `git commit --only -- <chemins>`, puis pousser les deux dépôts (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-4 ; à défaut, tout reste local | simple × court |
| A-17 | Trancher D-5 — répondre « D-5 (a) » si la rotation est faite, sinon la faire dans la console de chaque fournisseur selon le relevé de `Digit-AI - Synthese Mandat - Identifiants exposes verification - 20260830i.md` puis répondre « D-5 (a) » (neuve) | manuelle_utilisateur | `decision` — arbitrage de risque sur des comptes qui vous appartiennent ; sinon : les identifiants publiés restent actifs s'ils l'étaient | simple × court |
| A-18 | Trancher D-6, D-9, D-7 et D-8 — répondre par exemple « 6a 9a 7a 8a » (neuve) | manuelle_utilisateur | `decision` — corriger un juge, lancer une étude et créer des classes sont des arbitrages humains (`references\TODO-FORGE.md`) ; sinon : rien n'est lancé | simple × court |
| A-4 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 ; sinon : les fichiers restent non enregistrés | simple × court |

## 9. Traces

- Preuve de couverture : `oracles\banc-defauts-echappes\preuve-couverture-20260914.md`
- Analyse L99 : `output\03-etudes\20260914-L99-conception-documentaire-amont.md`
- Relevé des restes : `output\03-etudes\20260914-releve-restes-archives.md`
- Candidatures : `input\01-candidatures\qualite-sans-personas-p3-p5-20260914a.tf.jsonl` (TF-1074 à TF-1079), `input\01-candidatures\restes-archives-p2-20260914a.tf.jsonl` (TF-1080 à TF-1084), `input\01-candidatures\preuve-couverture-p1-20260914a.tf.jsonl` (TF-1085 à TF-1089)
- Registre : `todo\TODO.jsonl`, `todo\RECIDIVES.md`
- Contrôle des secrets : `oracles\oracle-secrets-hors-perimetre.mjs`, `.claude\settings.json`
- Oracles : `check_markdown.py` (PASS sur l'analyse, le relevé et la preuve de couverture), `todo\oracle-todo.mjs` (exit 0), `oracle-secrets-hors-perimetre.mjs` (FAIL, exit 0), `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour.
