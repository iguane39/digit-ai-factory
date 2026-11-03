# Retours forges — Produit-84 — 20261103b

- **Contexte** : reprise des retours du ledger restés sans lot depuis plus de 24 h, signalés par le relevé d'ouverture (TF-1988). Demande du porteur du 03/11/2026 : « A2 & A3 ».
- **Références ledger** : `forge\ledger.jsonl` seq 24, 27, 33, 43, 50, 64, 65, 66, 77, 100, 139 et 160 pour les forges ; seq 109 à 138 restées au produit.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-03
- **Complétude** : 42 entrées `type: retour` qu'aucun lot ne citait, relues le 03/11/2026 à 10:53 dans `forge\ledger.jsonl` : 11 vont au sidecar, 1 se rattache à un item corrigé (seq 160), 30 restent au produit (seq 109 à 138). La seq 165, écrite le 03/11/2026 par une autre session du produit, lui est laissée.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **Les retours.** Écrits au ledger au moment de chaque friction, du 29/10 au 02/11/2026, pendant la préparation, la remédiation de dev et la qualification.
- **Le trou.** Les lots 20261029a et 20261030a n'en ont repris qu'une partie. Le relevé d'ouverture de la Factory nommait 41 entrées sans lot ; ce lot les reprend toutes, sauf la seq 165, plus récente.

## Factory (`digit-ai-factory`) — hooks, ledger, sessions concurrentes

7 retours.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-34 | mineur | générique | **Une suppression dans le dossier temporaire compte comme écriture.** Le 29/10/2026 à 11:33, une question de procédure en lecture seule a été jugée tour de travail, parce que la session avait effacé par Python 2 fichiers JSON temporaires. La réponse courte a été refusée et réécrite en restitution complète. Ledger seq 24. | Le hook de restitution exclut du compte des écritures les suppressions dans le dossier temporaire de la session. Règle qui aurait évité le retour : aucune, NIVEAUX.md ne distingue pas ce cas. **RT-34** : classe proposée `ecriture-temporaire-comptee-tour-de-travail`. |
| RT-35 | majeur | générique | **Le verrou « livré » cherche le verdict de design ailleurs que là où il s'écrit.** `mobiliser.mjs --verifier` cherche `output/**/*.oracles.json` (CARTE-FORGES, `etabli: false`), alors que `run-oracles` écrit ce journal sous `.oracles/output/…` (TF-0428, TF-0501). Le 29/10/2026 à 11:44 : verdict PASS produit, vérification MANQUE. Ledger seq 27. | Ajouter `.oracles/output/**/*.oracles.json` aux chemins du livrable `verdict-format` dans `CARTE-FORGES.json`. Règle qui aurait évité le retour : aucune ; S85 lit un chemin que l'outil n'écrit pas. **RT-35** : classe existante `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas`. |
| RT-36 | majeur | générique | **RÉSERVATION ne voit qu'une décision au format en citation.** Le 29/10/2026 à 13:20, `--prejuger` a rendu affichable un bloc 3 qui posait D-1, D-2 et D-3 en puces, sans réservation ; D-1 était déjà pris (seq 16). Le tour suivant a renuméroté en D-5 à D-7. Ledger seq 33. | Le contrôle repère toute « D-N » en gras du bloc 3, quel que soit son format, et la confronte au registre. Règle qui aurait évité le retour : RÉSERVATION (TF-1849, corrigé), bornée au format B. **RT-36** : classe proposée `reservation-bornee-au-format-en-citation`. |
| RT-37 | mineur | générique | **Le hook gestes-distants refuse la réponse que la préférence du porteur impose.** Lot du 29/10/2026 à 14:18 refusé : `reponse_humaine` vaut « 10a », moins de 5 caractères. La préférence du 26/10/2026 demande justement la lettre de la décision. La session a dû habiller la citation pour passer. Ledger seq 43. | Accepter une `reponse_humaine` de la forme `^\d+[a-z]$`, ou exiger une citation entre guillemets au lieu d'une longueur. Règle qui aurait évité le retour : aucune, la garde de longueur ignore la préférence. **RT-37** : classe proposée `garde-contraire-a-une-preference-du-porteur`. |
| RT-38 | mineur | générique | **`ledger.py` refuse le type que le CLAUDE.md du produit prescrit.** R-43 du gabarit CLAUDE.md demande `type: conflit_regles` ; `forge/ledger.py`, copie du gabarit du pilot, répond « type inconnu » le 29/10/2026 à 15:45. Le conflit du jour (nommage du modèle Client-A de fiche sécurité contre R-4) a été consigné hors de son type. Ledger seq 66. Même classe que RT-28 (lot 20261029a), sur un autre type. | Ajouter `conflit_regles` au vocabulaire de `ledger.py`, et dériver ce vocabulaire des types que les gabarits prescrivent. Règle qui aurait évité le retour : aucune ne confronte les types prescrits aux types admis. **RT-38** : classe proposée `type-de-ledger-prescrit-refuse-par-l-ecrivain`. |
| RT-39 | majeur | générique | **Deux sessions du produit ont agi sur les mêmes ressources distantes sans se voir.** Le 29/10/2026 : 2 compartiments R2 `cdc-tfstate` créés à 17:09 (juridiction UE) et 17:11 (par défaut) ; le projet Pages recréé pendant qu'une autre session testait un aperçu ; un 522 attribué à tort à une panne Cloudflare ; 2 bancs RLS simultanés faussés. Ledger seq 77. Voisin de TF-2045 (trace de mobilisation partagée) et de TF-1872 (décisions), sans les couvrir. | Un registre des gestes distants en cours, partagé par les sessions d'un produit, lu avant tout geste distant et avant de diagnostiquer une panne. Règle qui aurait évité le retour : aucune pour les gestes distants. **RT-39** : classe proposée `gestes-distants-concurrents-sans-registre`. |
| RT-40 | majeur | générique | **Rien ne définit ni ne juge un jeu fictif.** Le 29/10/2026, la session a livré un « jeu fictif » de 2 coquilles vides, sans lot, budget ni facture. Le porteur l'a rejeté : « un jeu fictif qui n'a rien n'est pas un jeu fictif ». Ledger seq 50. | Définir le jeu fictif dans forge-data ou forge-tests : chaque écran alimenté, chaque type d'enregistrement présent, une histoire cohérente par stade. Un oracle compare les totaux affichés par l'application à ceux du générateur. Règle qui aurait évité le retour : aucune. **RT-40** : classe proposée `jeu-fictif-sans-definition-ni-oracle`. |

## Forge audit (`digit-ai-forge-audit`)

4 retours sur les outils de la fiche sécurité et de l'espace d'audit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-1 | majeur | générique | **`verifier-fiche-securite.mjs` rejette le modèle Client-A de fiche sécurité.** Le 29/10/2026 à 15:44 : FS4 FAIL, il prend la première ligne dont l'intitulé contient « Dev » (« Dev-team / run », section 1) au lieu de la ligne de l'URL. FS5 ne lit la largeur que sur `th{` ou `td.k{`, pas sur `th.k{` (SKIP silencieux). Les intitulés en `td.k` sont invisibles pour FS8 à FS11. Ledger seq 64. | FS4 cherche la ligne qui porte une URL parmi celles dont l'intitulé nomme DEV ou URL ; FS5 accepte `th.<classe>` ; les champs se lisent en `th` ou `td.k`. Règle qui aurait évité le retour : aucune fixture du modèle Client-A. **RU-1** : classe existante `oracle-faux-positif`. |
| RU-2 | majeur | générique | **`verifier-fiche-securite.mjs` ne juge que la fiche de dev.** FS3 n'admet que la référence `<TRI>-SEC-DEV-<date><indice>` (`RE_REF`, ligne 70) et FS4 cherche une ligne « DEV » ou « développement » (ligne 181). La fiche de qualification `CDC-SEC-HPR-20261030a` rend FS3 et FS4 FAIL alors que sa référence et son URL sont bien formées ; rejouées pour HPR : PASS. Ledger seq 139. | Paramétrer l'environnement (DEV, HPR, PRD) dans `RE_REF` et FS4, lu dans le nom ou l'en-tête de la fiche. Règle qui aurait évité le retour : aucune fixture hors dev. **RU-2** : classe existante `oracle-faux-positif`. |
| RU-3 | mineur | générique | **`fiche-en-pdf.mjs` ne passe pas au moteur suivant.** Le 29/10/2026 à 15:40, Edge, choisi par défaut, n'annonce pas son port en 30 s (exit 3) ; Chrome, présent, imprime en quelques secondes. Ledger seq 65. Récidive de TF-1408, corrigé dans `tools/verifier.mjs`, pas dans `fiche-en-pdf.mjs`. | Sur échec de démarrage, essayer les autres moteurs trouvés (Chrome, Chromium de Playwright) avant de rendre 3. Règle qui aurait évité le retour : TF-1408, appliqué à un seul outil. **RU-3** : classe proposée `outil-sans-repli-de-moteur`. |
| RU-4 | mineur | générique | **`init-audit-workspace.mjs` prend `--help` pour un dossier.** Le 30/10/2026 vers 09:25, un relecteur aveugle L99 a lancé `node tools/init-audit-workspace.mjs --help` dans le dépôt de la forge et y a créé un dossier « --help » (14 `.gitkeep` et un README), supprimé aussitôt. Ledger seq 100. Même classe que TF-1181 (accueil réel sur `--aide`). | Refuser comme dossier cible un argument qui commence par « - » et afficher l'usage ; même garde pour les autres outils de `tools/`. Règle qui aurait évité le retour : aucune garde d'argument commune. **RU-4** : classe proposée `outil-sans-garde-d-argument`. |

## Rattachement

Registre interrogé le 03/11/2026, chaque commande jouée sans borne au pilot :

- `grep -ciE "dossier temporaire|suppression.*temporaire" todo/TODO.jsonl` → 18 ligne(s) trouvée(s) : aucune ne porte le compte d'une suppression temporaire comme écriture (RT-34).
- `grep -ciE "\.oracles/output|verdict-format" todo/TODO.jsonl` → 2 ligne(s) trouvée(s) : TF-1015 et TF-1241, sans rapport avec le chemin de S85 (RT-35).
- `grep -ciE "RÉSERVATION|reserver-decision" todo/TODO.jsonl` → 12 ligne(s) trouvée(s) : TF-1849 (corrigé), TF-1872, TF-1911, TF-1939 ; aucun ne porte le format hors citation (RT-36).
- `grep -ciE "reponse_humaine" todo/TODO.jsonl` → 0 ligne(s) trouvée(s) (RT-37).
- `grep -ciE "conflit_regles" todo/TODO.jsonl` → 0 ligne(s) trouvée(s) (RT-38).
- `grep -ciE "sessions? (concurrentes|simultanées|parallèles)|deux sessions" todo/TODO.jsonl` → 25 ligne(s) trouvée(s) : TF-2045 et TF-1872 voisins, aucun sur les gestes distants (RT-39).
- `grep -ciE "jeu fictif" todo/TODO.jsonl` → 0 ligne(s) trouvée(s) (RT-40).
- `grep -ciE "verifier-fiche-securite" todo/TODO.jsonl` → 5 ligne(s) trouvée(s) : TF-1089, TF-1095, TF-1102, sur d'autres champs (RU-1, RU-2).
- `grep -ciE "fiche-en-pdf" todo/TODO.jsonl` → 9 ligne(s) trouvée(s) : TF-1220, TF-1351, TF-1408 (corrigé dans `tools/verifier.mjs`) (RU-3).
- `grep -ciE "init-audit-workspace" todo/TODO.jsonl` → 1 ligne(s) trouvée(s) : TF-1735, sur le routage d'un audit, sans rapport (RU-4).
- `grep -ciE "make-it-better" todo/TODO.jsonl` → 8 ligne(s) trouvée(s) : TF-2061 porte le format PowerPoint, livré en make-it-better 1.1.0 (commit `207698c` de digit-ai-forge-agents). La seq 160 s'y rattache et n'entre pas au sidecar.

Items recoupés : TF-1849 (RT-36), TF-2045 et TF-1872 (RT-39), TF-1408 (RU-3), TF-1181 (RU-4), TF-2061 (seq 160).

## Remarques restées au produit

- Seq 109 à 138, écarts EC-HPR-01 à EC-HPR-30 de la qualification `cdc-hpr` à la Design Review : intrusion et dossier de sécurité absents, branches non protégées, double vérification non imposée, base ouverte à 0.0.0.0/0, sauvegardes, journaux, SAML. Ils sont tenus par l'audit `output/05-audits/Produit-84 - Audit - Ecarts de hpr a la Design Review - 20261030a.md`. Généralisable : non, ce sont des gestes de ce produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les retours ont été écrits au ledger au moment de chaque friction, avec les 4 réponses du test de généralité : ce lot n'a rien eu à reconstituer de mémoire.
- Le relevé d'ouverture (TF-1988) a nommé les entrées sans lot et leurs classes inconnues : c'est lui qui a déclenché ce lot.

## Ordre recommandé

1. RT-39 : 2 sessions sur la même infrastructure ont produit un doublon distant et un diagnostic faux.
2. RU-2 et RU-1 : chaque fiche sécurité hors dev ou au modèle Client-A rend des FAIL faux.
3. RT-35 : le verrou « livré » refuse un verdict de design existant.
4. RT-36 : des numéros de décision en double passent le préjugement.
5. RT-40 : sans définition, un jeu fictif vide peut repartir devant le porteur.
6. RT-37, RT-38, RT-34, RU-3, RU-4 : frictions d'outil, corrections courtes.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-34, RT-37, RT-38, RT-39, RT-40, RU-4 : aucune règle ne couvre le cas ; chaque proposition la crée.
- RT-35 : S85 lit un chemin que `run-oracles` n'écrit pas.
- RT-36 : RÉSERVATION (TF-1849), bornée au format en citation.
- RU-1, RU-2 : aucune fixture du modèle Client-A ni d'un environnement hors dev.
- RU-3 : TF-1408, appliqué à `tools/verifier.mjs` seulement.
