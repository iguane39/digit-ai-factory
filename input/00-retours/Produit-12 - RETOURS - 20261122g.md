# Retours forges — Produit-12 — 20261122g

> Annoté par le pilot le 28/11/2026 (D-247 (a)) : les noms de 2 correspondants des clients du produit, en titre de documents d'exemple, sont remplacés par « Correspondant-A » et « Correspondant-B » ; le dépôt du pilot est public.

- **Contexte** : run — frictions de l'outillage de la Factory vécues pendant le run 0.9.1, non consignées sur le moment, relevées sur question du porteur le 22/11/2026
- **Références ledger** : `forge\ledger.jsonl` seq 452 à 456 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

Le run 0.9.1 a remonté ses défauts de produit au moment même, dans les lots a à f. Cinq frictions de l'outillage de la Factory ont en revanche été contournées sans être consignées. Le porteur a demandé si tout avait été remonté, et la réponse était non : ce lot les rattrape.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-50 | majeur | générique | `oracle-lot` a rendu PASS, puis a remis au sas, le lot 20261122f dont l'en-tête porte un octet NUL à la place de « \00 » dans le chemin du sas. Le texte venait d'un heredoc (leçon L-001) ; le contrôle ne lit pas les caractères de contrôle d'un `.md`. Preuve : lot 20261122f, ligne 5 ; ledger seq 447, 454 | Refuser, avant la remise, un lot qui contient un octet NUL ou un caractère de contrôle hors tabulation et fin de ligne |
| RS-51 | mineur | générique | `mobiliser --verifier` juge la fraîcheur des livrables contre l'heure de la ligne de trace. Une trace écrite en fin de run rend « périmés » l'exigence, le rapport d'audit et le dossier produits pendant ce run, sans moyen de dater l'ouverture de la demande. Un livrable jamais créé chez le produit (`DESIGN.md`) ne peut pas non plus être déclaré inchangé. Preuve : `forge/mobilisation.jsonl`, lignes du 22/11 à 15:47 et 15:49 ; ledger seq 448, 453 | Accepter une heure d'ouverture attestée par le ledger, et une forme « livrable sans objet chez ce produit » distincte de « inchangé » |
| RS-52 | mineur | générique | Le contrôle RÉAFFICHAGE du hook de restitution tient D-83 pour ouverte à chaque restitution, alors que sa réponse est au ledger (`reponse_humain`, seq 417). Six restitutions l'ont motivée à la main. Preuve : ledger seq 414, 417, 455 | Lire les entrées `reponse_humain` du ledger du produit avant de déclarer une décision ouverte |

## tests (`digit-ai-forge-tests`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-48 | mineur | générique | Le pan « prompts » ne reconnaît une constante de consigne que si le mot-clé (`PROMPT`, `INSTRUCTIONS`, `SYSTEME`, `SYSTEM`) suit au moins un caractère du nom. `INSTRUCTIONS_REDACTION` n'a pas été vue : l'audit de 15:05 a rendu le pan à 1/19 au lieu de 3/21, et un audit complet de 10 minutes a été rejoué après renommage. Preuve : `rapport-20261122b.json` et `rapport-20261122c.json` ; ledger seq 452 | Accepter le mot-clé en tête du nom, et publier au rapport les constantes candidates écartées avec leur motif |

## design (`digit-ai-forge-design`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-49 | mineur | générique | La critique d'une page d'application ne vaut pour le hook qu'avec `--instance`. Derrière une connexion, l'instance rend SKIP (X0, redirection vers la connexion) tant qu'un état de connexion Playwright n'est pas fourni, et sa fabrication n'est décrite nulle part : deux passages perdus. Preuve : `forge/etapes/design/*-rendu-091.instance.json` ; ledger seq 456 | Fournir un utilitaire qui produit l'état de connexion depuis une URL de connexion et un fichier de mot de passe, et le citer dans le message du hook |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `qualif_populee.py` dépend de Playwright, absent de l'environnement du backend, et la dernière version exige un navigateur non installé | lancé avec `uv run --with playwright==1.62.0` | non | propre à l'outillage local du produit |
| Le contrôle après mise en production compte comme « servies par Claude » des lignes écrites par la 0.9.0 avant la bascule | écart déclaré au dossier ; la preuve d'appel réel est le test de connexion | non | propre au journal du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot.

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres Correspondant-A | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres Correspondant-B | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees Correspondant-A | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees Correspondant-B | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Les 18 retours de produit du 22/11 ont été remis au moment même, dans les lots a à f, et chacun cite son entrée du ledger.

## Ordre recommandé

1. RS-50, parce qu'un lot altéré passe la porte de remise sans bruit.
2. RS-48, parce qu'il fausse la mesure du pan « prompts » de tout produit.
3. RS-51, RS-52 et RS-49, parce qu'ils coûtent des allers-retours sans changer le livrable.

## La règle qui aurait évité le retour

- RS-50 : classe proposée, à créer au pilot : `remise-sans-controle-des-octets` (famille `restitution-forme`), pour une porte de remise qui ne lit pas les caractères de contrôle d'un fichier texte.
- RS-48 : classe proposée, à créer au pilot : `inventaire-de-prompts-a-motif-trop-etroit` (famille `contrat-interface-forge`), pour un inventaire qui écarte en silence une forme de nom légitime.
- RS-51, RS-52 et RS-49 : classe proposée, à créer au pilot : `controle-de-session-qui-ignore-le-ledger` (famille `contrat-interface-forge`), pour un contrôle qui juge sans lire ce que le ledger ou l'outillage atteste déjà.
