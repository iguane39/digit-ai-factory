# Retours forges — Produit-82 — 20261113j

- **Contexte** : vérification du travail de l'agent constructeur de l'étape usage sans code (commits `07c50cf`, `c68a922`, `ee0bd65`) ; run `Produit-82-20261110-version`, étape `version-20261113-usage-sans-code`.
- **Références ledger** : `forge\ledger.jsonl` seq 290, 291, 292
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Pilot, consigne d'un agent

Le retour porte sur la forme d'une consigne d'agent avant son lancement.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-45 | mineur | générique | La consigne du constructeur du 13/11/2026 (`forge/etapes/version-20261113/CONSIGNE-CONSTRUCTEUR.md`) ne nomme ni dossier temporaire, que `AGENT-CAMPAGNE.md` exige depuis TF-2437, ni la raison de l'affectation à Opus. Sa version de départ (`757ceb3`) précède le commit qui la porte (`984f37e`). La relecture d'intention, jouée avant le lancement, ne lit pas ces rubriques ; l'agent les a relevées à son arrivée (fichier d'avancement de la campagne, entrée du 13/11/2026 à 14:21). Ledger seq 290. **RT-45** : clé proposée `consigne-rubriques-contrat`. | Un contrôle de forme de la consigne, joué par `relecture-intention.mjs --preparer consigne` : dossier temporaire, fichier d'avancement, motif d'affectation pour un agent Opus, version de départ égale à HEAD ou qui n'en diffère que sous `forge/`. |

## Forge des tests, constats contestés

Le retour porte sur la tenue d'une déclaration quand le code bouge.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-46 | mineur | générique | Le rapport `forge/etapes/tests/rapport-20261113c.json` compte comme nouveaux 5 constats SAST de `Produit-82/scripts/comptes.py` (lignes 404, 768, 776, 786, 1108). Ce sont les requêtes contestées le matin même aux lignes 362, 708, 716, 726 et 814, décalées par 3 commits. Les déclarations portaient le champ `texte`, mais plusieurs constats partagent le même message, et l'ancrage ne les a pas suivis. 11 déclarations ont été ajoutées à la main dans `forge/constats-contestes.jsonl`. Ledger seq 292. **RT-46** : clé proposée `declaration-ne-suit-pas-la-ligne`. | Ancrer la déclaration sur le contenu de la ligne visée (empreinte de la ligne normalisée) plutôt que sur son numéro et son message, et nommer au rapport les déclarations restées sans constat. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les réponses de la page Conversation, relayées en flux, ne passent pas le masquage des numéros de carte appliqué aux réponses entières ; les données saisies restent masquées avant l'envoi au fournisseur (ledger seq 291) | non corrigé : décision du porteur D-31 | non | ouverte |
| La consigne des vues du dossier projet a été écrite avec dossier temporaire, fichier d'avancement et motif d'affectation | corrigé dans `forge/etapes/version-20261113/CONSIGNE-VUES-PROJET.md` | non | corrigée |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- L'agent constructeur a joué chaque test nouveau en rouge sur la version de départ avant de le rendre vert : 20 sur 20 pour la conversation, 5 sur 5 pour les campagnes, 13 étapes de parcours.

## Ordre recommandé

1. RT-46 : chaque commit qui décale des lignes fait réapparaître des constats déjà jugés.
2. RT-45 : il coûte un relevé à l'agent, sans effet sur le code.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours ne suivent aucune correction humaine. La règle qui aurait évité RT-45 : une consigne d'agent se contrôle sur les rubriques du contrat d'agent avant son lancement.
