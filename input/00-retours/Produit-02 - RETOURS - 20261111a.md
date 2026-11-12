# Retours forges — Produit-02 — 20261111a

- **Contexte** : autre — synchronisation GitHub et Drive du 11/11/2026, hors run de version, sur un poste neuf.
- **Références ledger** : `forge\ledger.jsonl` seq 693 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT au registre du pilot (dernier relevé : RT-142).

---

## Factory (`digit-ai-factory`)

Le canal de sauvegarde Drive du produit a cessé de fonctionner au changement de poste, sans que rien ne le signale avant la demande humaine.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-143 | mineur | générique | **Les deux scripts de sauvegarde Drive du produit visent un chemin de poste écrit en dur, absent du poste neuf.** Fait : `build/sauvegarde-drive.py` et `build/piscine/sauvegarde-locale.mjs` portent `D:\10-Google Drive\dev\Produit-02.com\…`. Sur le poste Dell-XPS-16, `Test-Path D:\` rend False ; le Drive y est en miroir sous `C:\Users\<compte>\Mon Drive`. Le script rend exit 2 « destination injoignable ». La session a dû chercher le dossier à la main, puis passer `--destination` ; le crochet d'ouverture `rappel-sauvegarde.mjs` vise le même chemin. Avec la bonne destination : 8 fichiers absents copiés, SHA-256 identiques, 96 sur 98 identiques ensuite. | Règle qui aurait évité le retour : aucune ne déclare l'emplacement du canal de reprise par poste. Piste : un gabarit hérité porte la destination Drive en variable d'environnement de poste, avec une liste d'emplacements connus (`D:\10-Google Drive`, `%USERPROFILE%\Mon Drive`, `G:\Mon Drive`) essayés dans l'ordre. |

## Rattachement

Registre interrogé le 11/11/2026 : classe `reprise-multi-poste-declaree-non-cablee` lue dans `todo/CLASSES.json` du pilot (famille `heritage-produit`).
Items recoupés : la classe porte déjà le canal Drive entre postes non câblé ; ce retour en ajoute un cas, le chemin de destination écrit en dur.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les `.env` du Drive (12/10) portent 11 clés absentes des `.env` du poste (02/09) | Non écrasés ; 3 clés propres au poste ajoutées au Drive sans rien retirer ; rapatriement soumis au porteur | non | Rien de généralisable, parce que l'écart vient de l'historique de ce poste |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| `output\06-supports-de-communication\Produit-02 - Notice Piscine A3 - 20261105c.html` | 8 | non relevés sur ce lot | aucun | affiche A3 à étapes et QR-code vidéo | Reste au produit, parce que ses versions suivent le matériel d'une piscine précise ; mesuré par `oracle-lot.mjs` |
| `output\06-supports-de-communication\Produit-02 - Notice Sauna A3 - 20261105d.html` | 7 | non relevés sur ce lot | aucun | affiche A3 à étapes et deux QR-codes | Reste au produit, parce que ses versions suivent le matériel et la réservation d'un sauna précis ; mesuré par `oracle-lot.mjs` |
| `Dossier Plan de campagnes Google Ads` (famille de ce produit) | 5 | non relevés sur ce lot | aucun | non relevés sur ce lot | Reste au produit, parce que ses versions sont des itérations d'un plan propre à ce gîte ; mesuré par `oracle-lot.mjs` |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- **Le script de sauvegarde versionné (T-105)** a rendu un relevé exact dès qu'on lui a donné la destination : il a refusé d'écraser rien côté Drive et listé les orphelins sans les supprimer.

## Ordre recommandé

1. RT-143 : seul retour du lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RT-143 ne suit pas un retour humain ; aucune règle ne déclare la destination du canal de reprise par poste.
