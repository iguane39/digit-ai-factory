# Retours forges — Produit-02 — 20261116a

- **Contexte** : autre — publication de la vidéo Netatmo et de sa carte QR-code du 16/11/2026, hors run de version (`forge\ledger.jsonl` seq 751, entrée `type: etape_close`).
- **Références ledger** : `forge\ledger.jsonl` seq 752 (entrée `type: retour`). Correspondance : RT-151 = seq 752.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT de ce produit (dernier défini : RT-150, lot 20261112a).

---

## Factory (`digit-ai-factory`)

Le CLAUDE.md du produit interdit de committer le `.env` mais ne nomme pas la voie pour en lister les clés ; une session l'a donc tentée par `grep`, et seul le hook l'a arrêtée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-151 | mineur | générique | **Une session liste les clés du `.env` par `grep` avant de connaître la voie masquée.** Fait (ledger seq 752) : le 16/11/2026, pour savoir si un stockage objet était configuré, la session a lancé `grep -oE "^[A-Z_]+=" .env`. Le hook `fichiers-env` l'a refusé (D-106 b) et a indiqué `env-masque.mjs --cles`, utilisé aussitôt : 41 clés listées, aucune valeur affichée. Le CLAUDE.md du produit, section Conventions locales, dit « `.env` jamais committé » et la voie de rangement d'un secret, pas celle de lecture. | Règle qui aurait évité le retour : aucune dans le CLAUDE.md du produit. Piste : que le gabarit CLAUDE-PRODUIT nomme, à côté de `ranger-secret.mjs`, la voie de lecture `env-masque.mjs <fichier> --cles`, pour que la session la prenne avant le refus. |

## Rattachement

Registre interrogé le 16/11/2026 : classes lues dans `todo/CLASSES.json` du pilot.
RT-151 : aucune classe ne porte l'absence de voie de lecture nommée ; classe à créer `voie-de-lecture-des-secrets-non-nommee`, dans la famille `secret-hors-perimetre` (un fichier d'environnement qui aurait transité dans la transcription sans le hook).

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `node_modules` du poste en retard sur `package.json` (module `ical.js` absent au démarrage local) | `npm ci` rejoué, 87 paquets | non | Rien de généralisable, parce que c'est l'état d'un poste après des tirages sans installation |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

La carte QR-code Netatmo de ce lot en est à sa première version. Les quatre documents mûrs relevés par le juge du lot :

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| `output\02-suivi-indexation-positions\Produit-02 - Rapport de statut Analytics et Ads - 20261026c.html` | 9 | non relevés sur ce lot | aucun | rapport de statut de mesure et de campagnes | Reste au produit, parce que ses versions suivent l'état des comptes de mesure de ce gîte ; mesuré par `oracle-lot.mjs` |
| `output\06-supports-de-communication\Produit-02 - Guide Notice Piscine A3 - 20261105c.html` | 8 | non relevés sur ce lot | aucun | affiche A3 à étapes et QR-code vidéo | Reste au produit, parce que ses versions suivent le matériel d'une piscine précise ; mesuré par `oracle-lot.mjs` |
| `output\06-supports-de-communication\Produit-02 - Guide Notice Sauna A3 - 20261105d.html` | 7 | non relevés sur ce lot | aucun | affiche A3 à étapes et deux QR-codes | Reste au produit, parce que ses versions suivent le matériel et la réservation d'un sauna précis ; mesuré par `oracle-lot.mjs` |
| `output\03-strategie-campagnes\Produit-02 - Dossier Plan de campagnes Google Ads - 20260912g.html` | 5 | non relevés sur ce lot | aucun | plan de campagnes | Reste au produit, parce que ses versions sont des itérations d'un plan propre à ce gîte ; mesuré par `oracle-lot.mjs` |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- **Le hook `fichiers-env`** a refusé la lecture du `.env` et donné la voie permise dans le même message : aucune valeur n'est entrée dans la transcription.

## Ordre recommandé

1. RT-151.
