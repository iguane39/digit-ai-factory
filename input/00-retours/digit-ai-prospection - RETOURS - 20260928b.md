# Retours forges — digit-ai-prospection — 20260928b

- **Contexte** : run digit-ai-prospection-run-20260928a, dépôt de la restitution de fin de tour de l'étape agents
- **Références ledger** : `forge\ledger.jsonl`, entrée `type: retour` d'id_lot RV-4
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, ignoré par git. L'original reste ici.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

---

## pilot (`digit-ai-factory`)

Déposer la restitution de fin de tour d'un produit a coûté un aller-retour : les 3 textes qui en fixent le lieu et le nom ne s'accordent pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-4 | majeur | générique | `gabarits\RESTITUTION.md`, ligne 1076, prescrit d'écrire la synthèse « en fichier (`output\` du pilot ou `forge\` du produit) », marquée `destinataire: humain`. `oracle-conformite-projet` (R-2, ligne 217, `zoneDeDepot`) refuse tout fichier ainsi marqué hors de `output\` et `docs\` : la synthèse d'un produit ne peut donc pas vivre dans `forge\`. Déposée dans `output\` sous le modèle de nom du pilot (« Digit-AI - Synthese … », 244 fichiers de `output\04-plans\` le portent), elle est refusée par R-25 (ligne 455 : le type est le premier mot du 2e segment, et « Synthese » n'est pas au registre des types). Le hook de fin de tour, lui, ne reconnaît la synthèse que si son nom contient « synthese » ou « restitution » (`oracles\hook-restitution.mjs`, ligne 281). Mesuré le 28/09/2026 : R-25 FAIL, levé en nommant le fichier « Digit-AI - Note Synthese Run - … ». | Écrire dans `RESTITUTION.md` le lieu et le nom attendus chez un produit : `output\`, type admis au registre, mot « Synthese » dans l'objet ; ou ajouter « Synthese » au registre des types. Règle qui aurait évité le retour : la classe `deux-regles-du-socle-inconciliables`, les règles qui fixent un même artefact se jouent ensemble sur une instance réelle avant d'être publiées. |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par l'orchestrateur du run, le 28/09/2026. Le seul défaut rencontré, le lieu et le nom de la synthèse, est remonté en RV-4.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot : le dossier `output\` du produit ne porte qu'une restitution, en première version.

## Confirmations positives

- `oracle-synthese` a lu la décision en bloc de citation, l'inventaire de 3 bloquants et le tableau unique des actions : 52 règles PASS, 1 sans objet, à la 2e passe.
- La 1re passe a rendu 2 FAIL justes, S5 et S45, corrigés sans assouplir de règle.

## Ordre recommandé

1. RV-4 : une phrase de doctrine à réécrire, et chaque produit bute sur ce dépôt à sa première restitution.

## La règle qui aurait évité le retour

RV-4 ne suit pas un retour humain : il a été trouvé par `oracle-conformite-projet`, règle R-25, exécutée après le dépôt. La règle qui l'aurait évité est celle de la classe `deux-regles-du-socle-inconciliables` : un gabarit, son juge et le juge de conformité se jouent ensemble sur un artefact réel.
