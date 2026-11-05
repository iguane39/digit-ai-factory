# Retours forges — Produit-84 — 20261104a

- **Contexte** : audit complet de l'application par forge-audit, le 04/11/2026, puis deux questions du porteur : « Pourquoi le rapport d'audit ne reprend pas le format standard des rapports d'audit de la Factory ? » et « Pourquoi ce sujet n'est pas remonté à la Factory ? ».
- **Références ledger** : `forge\ledger.jsonl` seq 167, 168, 169, 170 et 171.
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-04
- **Complétude** : 5 entrées `type: retour` écrites le 04/11/2026 (seq 167 à 171), relues à 10:25 dans `forge\ledger.jsonl` ; les 5 vont au sidecar. La seq 165, d'une autre session du 03/11/2026, lui reste laissée.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **L'audit.** 185 contrôles instruits sur le commit afcbe76 ; `verifier-rapport` et `verifier-rapport-html` à exit 0, rapport rendu par `build-rapport.mjs`.
- **Le format.** Le porteur a constaté que le rapport ne suit pas le gabarit standard de la famille `gd-rapport-audit`. Les deux gates étaient verts.
- **La remontée.** La session a différé la remontée de cet écart par une promesse au bloc 9, que le préjugement a acceptée. Le porteur a dû la réclamer.

## Factory (`digit-ai-factory`) — verrou « livré » et remontée

2 retours.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-41 | majeur | générique | **`mobiliser.mjs --verifier` accepte les livrables d'une demande antérieure.** Pour la demande d'audit du 04/11/2026 (ts 08:49:54Z), il rend PRESENT en retenant `forge/etapes/tests/rapport-20261030.json`, `forge/audit/20261030/rapport-data.json` et `forge/etapes/websec/capture-cdc-dev-20261029.json`, tous d'octobre. Ledger seq 168. | N'accepter qu'un livrable écrit après le `ts` de la demande (date du nom, sinon date de modification), sinon MANQUANT. Règle qui aurait évité le retour : aucune, S85 ne lit que la présence. **RT-41** : classe proposée `verrou-livre-sans-fraicheur`. |
| RT-42 | majeur | générique | **S48 accepte une remontée promise au futur.** Le 04/11/2026 à 10:23, `--prejuger` rend affichable un bloc 9 « Remontée à la factory : reste au produit, parce que le retour sera consigné avec A-2 », et une action A-2 auto_ia qui consigne un retour, marquée `hors_mandat`. Le porteur : « Pourquoi ce sujet n'est pas remonté à la Factory ? ». Ledger seq 171. Récidive de TF-1982, corrigé pour une remontée renvoyée à une clôture inexistante, et de la seq 164 du 03/11. | S48 refuse « reste au produit » quand le motif nomme un retour non encore écrit (futur, « sera consigné »), et S11 refuse `hors_mandat` sur une action qui consigne un retour. Règle qui aurait évité le retour : TF-1982, bornée à la clôture de run. **RT-42** : classe existante `remontee-declaree-nulle-apres-correction`. |

## Forge audit (`digit-ai-forge-audit`)

3 retours sur le rapport d'audit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RU-5 | majeur | générique | **Les deux gates rendent diffusable un rapport qui ne remplit pas son gabarit.** Le 04/11/2026, exit 0 sur un `rapport-data.json` sans cartes de synthèse Fonctionnelle, Technique et Audit, sans page D00, sans `architecture`, sans `tests`, `analyses` ni `composants`, et sans `gate` ; tous sont attendus par `rapport-audit.template.md`. Pour lever le refus des redites, la seule issue trouvée a été de vider `actions`, ce qui laisse vide la colonne « Plan d'action » de chaque dimension. Ledger seq 169. Voisin de TF-1001, corrigé en avertissements seulement. | Un contrôle de complétude du gabarit, en erreur : chaque champ attendu par `rapport-audit.template.md` présent dans les données. Un mode documenté qui garde une action par constat en déclarant ses règles couvertes. Règle qui aurait évité le retour : TF-1001, qui avertit sans bloquer. **RU-5** : classe existante `gabarit-conception-non-jugee`. |
| RU-6 | majeur | générique | **Le rapport rendu échoue à la critique d'implémentation de forge-design.** Le 04/11/2026 à 10:12, `run-oracles-design --rendu` sur le rapport : oracle-slop FAIL (12 écarts, dont `border-left` de 3 et 4 px et les accents `#ede9fe`, `#c4b5fd`, `#dbeafe`), oracle-tokens FAIL (77 couleurs en dur hors `var(--token)`). Le hook de fin de tour exige cette critique sur tout HTML écrit ; le produit ne peut pas corriger le moteur. Ledger seq 167. | Passer la feuille de style de `rapport-engine.mjs` sur les jetons du thème du tenant, retirer les bandeaux latéraux, et jouer `run-oracles-design` dans `verifier-rapport-html`. Règle qui aurait évité le retour : aucune, les deux forges ne se confrontent pas. **RU-6** : classe proposée `gabarit-de-forge-hors-critique-design`. |
| RU-7 | mineur | générique | **La Synthèse du rapport compte faux.** Le 04/11/2026 : la carte Bloquants liste D14 (`applicability: off`, sans score) parmi les 16 dimensions notées 2 ou moins ; la carte Règles écrit « le reste est conforme » alors que ce reste compte 5 `a_evaluer` et 5 conformes. Ledger seq 170. | Exclure les dimensions `off` du décompte des bloquants ; nommer les `a_evaluer` dans la phrase des règles. Règle qui aurait évité le retour : aucune fixture avec dimension `off` et `a_evaluer`. **RU-7** : classe existante `oracle-faux-positif`. |

## Rattachement

Registre interrogé le 04/11/2026 au pilot, `todo/TODO.jsonl` :

- `verifier-rapport|rapport-audit.template` → TF-0999, TF-1001, TF-1005, TF-1014, TF-1246, TF-1276 : TF-1001 porte les champs vides en avertissement, pas la complétude du gabarit en erreur (RU-5).
- `rapport-engine` → TF-0940, TF-0947, TF-1207, TF-1235, TF-1208, TF-1820 : aucun sur le décompte des bloquants (RU-7).
- `S48|remontee-declaree-nulle` → TF-1643, TF-1644, TF-1982, TF-1987, TF-2078 : TF-1982 couvre la clôture inexistante, pas la promesse au futur (RT-42).
- `mobiliser --verifier` → TF-2045, TF-2080 : session concurrente et chemin du verdict de design, pas la fraîcheur (RT-41).
- `slop|oracle-tokens` avec `rapport` → TF-1274, sur les gabarits de la bibliothèque, pas sur le moteur de forge-audit (RU-6).

Items recoupés : TF-1001 (RU-5), TF-1982 (RT-42).

## Remarques restées au produit

- Les 146 règles en écart et les 43 constats de l'audit : ce sont des gestes de ce produit, tenus par le plan de remédiation du rapport. Généralisable : non.

## Retours sur les documents produits

- `gd-rapport-audit` : le rapport rendu par le moteur n'a pas tenu le gabarit de sa famille (RU-5, RU-6).

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le moteur de rapport et ses deux gates ont tenu 185 contrôles, 43 constats et un plan de 87 actions avec critère de clôture, sans placeholder résiduel.
- `init-audit-workspace.mjs` refuse désormais un argument en « - » (RU-4 du lot 20261103b, TF-2089).

## Ordre recommandé

1. RT-42 : le porteur doit encore réclamer lui-même les remontées, deux jours de suite.
2. RU-5 : un rapport hors gabarit passe les deux gates verts.
3. RT-41 : « livré » peut s'appuyer sur la preuve d'une autre demande.
4. RU-6 : chaque audit est remis avec une critique de design en échec.
5. RU-7 : décompte de la synthèse, correction courte.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RT-41, RU-6 : aucune règle ne couvre le cas ; chaque proposition la crée.
- RT-42 : TF-1982, bornée à la clôture de run.
- RU-5 : TF-1001, qui avertit sans bloquer.
- RU-7 : aucune fixture avec dimension `off` et `a_evaluer`.
