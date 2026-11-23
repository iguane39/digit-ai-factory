# Retours forges — Produit-02 — 20261123a

- **Contexte** : autre — migration de la reprise entre postes au canal unique et rangement du Drive au modèle D-238 (a), demandée par le porteur (« A1 », TF-2796 du pilot), hors run de version.
- **Références ledger** : `forge\ledger.jsonl` seq 764 (entrée `type: retour`). Correspondance : RT-153 = seq 764.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut). Non remis dans le tour : la consigne du porteur interdisait toute écriture dans le pilot.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT de ce produit (dernier défini : RT-152, lot 20261117a).

---

## Factory (`digit-ai-factory`)

Le hook avant outil `fichiers-env` refuse une commande dont le texte cite le nom d'un fichier d'environnement, même quand elle n'en ouvre aucun.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-153 | majeur | générique | **Trois refus sans lecture de secret.** Le 23/11/2026, le hook `fichiers-env` (D-106 (b), `forge\hooks\factory.mjs`) a refusé trois commandes Bash par « LECTURE DE .env REFUSÉE — un code de lecture de fichier nomme `.env` » : un script Node qui remplaçait des phrases dans `docs\projet\*.md`, un heredoc qui écrivait une section de documentation dans le dossier temporaire, et l'écriture du retour au ledger par `python forge/ledger.py retour --resume "…"`. Aucune n'ouvrait un fichier d'environnement : seul leur texte en citait le nom (ledger seq 764). Contournement coûteux : passer par les outils Write et Edit, et reformuler le retour sans le nom. | Règle qui aurait évité le retour : aucune. Piste : ne refuser que quand le chemin d'un fichier d'environnement est l'argument d'une lecture (`cat`, `grep`, `readFileSync`, `open`) ; une chaîne de texte passée en argument, un remplacement ou une option `--resume` ne lit rien. Une fixture rouge : `python forge/ledger.py retour --resume "le hook cite .env"` doit passer. |

## Rattachement

Registre interrogé le 23/11/2026 : classes lues dans `forge\retours\CLASSES.json`.
Registre du pilot lu : `todo/CLASSES.json`. RT-153 : aucune classe ne porte une garde de secrets qui juge la mention du nom au lieu de l'ouverture ; classe à créer `garde-secret-juge-la-mention`, dans la famille `hook-ou-gate`.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| RP11 d'oracle-reprise FAIL : 55 fichiers aux fins de ligne divergentes, `.gitattributes` sans `* text=auto eol=lf` | non corrigée dans ce tour : la correction réécrit l'arbre de travail du dépôt entier | non | Reste au produit, parce que c'est un défaut d'héritage déjà signalé par l'ouverture, avec son remède `recopier-heritage.mjs` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| `output\02-suivi-indexation-positions\Produit-02 - Rapport de statut Analytics et Ads - 20261026c.html` | 9 | non relevés sur ce lot | aucun | rapport de statut de mesure et de campagnes | Reste au produit, parce que ses versions suivent l'état des comptes de mesure de ce gîte ; mesuré par `oracle-lot.mjs` |
| `output\06-supports-de-communication\Produit-02 - Guide Notice Piscine A3 - 20261105c.html` | 8 | non relevés sur ce lot | aucun | affiche A3 à étapes et QR-code vidéo | Reste au produit, parce que ses versions suivent le matériel d'une piscine précise ; mesuré par `oracle-lot.mjs` |
| `output\06-supports-de-communication\Produit-02 - Guide Notice Sauna A3 - 20261105d.html` | 7 | non relevés sur ce lot | aucun | affiche A3 à étapes et deux QR-codes | Reste au produit, parce que ses versions suivent le matériel et la réservation d'un sauna précis ; mesuré par `oracle-lot.mjs` |
| `output\03-strategie-campagnes\Produit-02 - Dossier Plan de campagnes Google Ads - 20260912g.html` | 5 | non relevés sur ce lot | aucun | plan de campagnes | Reste au produit, parce que ses versions sont des itérations d'un plan propre à ce gîte ; mesuré par `oracle-lot.mjs` |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- **`ranger-drive.mjs`** a refusé de ranger tant qu'un sous-dossier hors modèle restait, puis a rangé en un renommage, sans écart restant ; **`synchro-drive.mjs --essai`** a confirmé `a_jour` dans la foulée.

## Ordre recommandé

1. RT-153.
