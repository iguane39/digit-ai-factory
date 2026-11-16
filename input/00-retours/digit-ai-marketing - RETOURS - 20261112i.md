# Retours forges — digit-ai-marketing — 20261112i

- **Contexte** : autre — demande humaine du 12/11/2026 : « exécute le prompt » (série LinkedIn des 15 clips de la Factory), puis « formatter les textes pour LinkedIn directement dans le MD pour un copier-coller ».
- **Références ledger** : `forge\ledger.jsonl` seq 754 et 755 (entrées `type: retour`).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 12/11/2026 (copie dans le SAS d'arrivée du pilot)

Mesures : 30 textes préparés, 15 accroches, 15 dossiers de semaine jugés par `oracle-run-reseau`. Ce lot remonte 2 retours, tirés de 2 entrées du ledger, au pilot et à 1 forge.

---

## digit-ai-communication (`digit-ai-forge-agents`)

Le gras que le preset prescrit casse les mots accentués d'un texte français.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-28 | majeur | générique | **`linkedin_unicode_formatting.py` ne met en gras que l'ASCII : les lettres accentuées restent maigres au milieu du gras.** Faits : le preset « publication réseau » prescrit ce script pour le gras (`references/presets-livrables.md`, section Publication réseau). `to_unicode_bold` ne convertit que A-Z, a-z et 0-9 (lignes 29 à 33). Une accroche comme « De l'idée à la mise en service » sortirait avec « é » et « è » maigres. Son auto-test rend « accents preserves » PASS sans signaler l'effet. Le 12/11/2026, le gras n'a pas été appliqué aux 15 accroches. (ledger seq 754) | Le script avertit sur un texte qui porte des lettres hors ASCII, ou décompose en NFD et garde le diacritique combinant après la lettre grasse ; le preset le dit, et rappelle que le gras Unicode est mal lu par les lecteurs d'écran. Classe à créer : `mise-en-forme-incompatible-avec-la-langue-du-texte`. |

## Pilot (`digit-ai-factory`)

Le format de semaine du run de réseau n'a pas d'emplacement qui tienne la règle de nommage.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-218 | majeur | générique | **RUN-RESEAU N2 prescrit des fichiers à nom fixe sans dire où vit le dossier de semaine, et sous `output\` sans ancêtre daté chacun prend un FAIL R-4.** Faits : `oracle-run-reseau.mjs` lit un dossier de semaine (`calendrier.md`, `publication*.md`, `accord.json`) ; `oracle-conformite-projet.mjs` refuse tout `.md` d'`output\` sans ancêtre daté (ligne 467), ce que deux relecteurs aveugles ont relevé le 12/11/2026. Le produit a rangé les 15 semaines dans un dossier-livrable daté, aux noms raccourcis pour tenir le plafond de 116 caractères ; le générateur de README y a créé 16 README. (ledger seq 755) | N2 nomme l'emplacement des semaines (dossier-livrable daté par lot, ou dossier du run déclaré hors R-4), et `oracle-conformite-projet` le reconnaît ; le gabarit dit où va `accord.json` une fois le lot accordé. Classe à créer : `format-de-run-sans-emplacement-conforme`. |

## Rattachement

Registre interrogé le 12/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-28 | `grep -i "unicode" todo/TODO.jsonl \| grep -i -c "accent"` | 7 | aucun : TF-0799, TF-0805, TF-0810 et TF-1445 parlent de frontières de mot dans des gardes lexicales |
| RP-218 | `grep -i "RUN-RESEAU\|run-reseau" todo/TODO.jsonl \| grep -i -c "R-4\|dossier de semaine\|semaine.*dossier"` | 6 | voisin : TF-2388 (types « Publication » et « Mesures » au registre) ; aucun ne fixe l'emplacement des semaines |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr déclaré sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `oracle-run-reseau` a jugé les 15 semaines sans adaptation : RR1 à RR4 PASS, RR5 à RR8 FAIL pour les seules raisons attendues (accord, mesure, fiche émetteur, voix).
- `verifier-cadrage.mjs` et `oracle-transparence` ont permis de proposer au porteur trois rôles relecteurs déjà vérifiés.

## Ordre recommandé

1. RP-218, parce que tout produit qui ouvre un run de réseau y bute.
2. RA-28.

## La règle qui aurait évité le retour

Aucune règle ne confronte l'outil de mise en forme à la langue du texte, ni le format d'un run à la règle de nommage ; la colonne « Proposition esquissée » propose les deux classes.
