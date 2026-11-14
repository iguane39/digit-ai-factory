# Retours forges — Produit-02 — 20261112a

- **Contexte** : autre — synchronisation GitHub et Drive du 12/11/2026, hors run de version (`forge\ledger.jsonl` seq 742, entrée `type: etape_close`).
- **Références ledger** : `forge\ledger.jsonl` seq 740, 741 (entrées `type: retour`). Correspondance : RT-149 = seq 740, RT-150 = seq 741.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT de ce produit (dernier défini : RT-148, lot 20261105a).

---

## Factory (`digit-ai-factory`)

Le canal de reprise par le Drive entre deux postes copie fichier contre fichier : une fusion de secrets faite sur un poste ne survit pas à la resynchronisation depuis l'autre, et un dossier renommé revient sous son ancien nom.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-149 | mineur | générique | **La fusion des `.env` faite le 11/11 ne tenait plus le 12/11.** Fait (ledger seq 740) : le 11/11, seq 695 consigne 11 clés ajoutées au `.env` du poste et une sauvegarde Drive à 100 sur 100 identiques. Le 12/11, `build/sauvegarde-drive.py --verifier` relève le `.env` différent : le poste n'a plus les 11 clés, le `.env` du Drive est daté du 09/11 22:00 et n'a pas les 3 clés du poste. Le jeton Railway du poste est refusé par l'API (« Not Authorized »), celui du Drive accepté. Fusion refaite par union : 40 clés, aucune perdue de part et d'autre, SHA-256 identiques ensuite. Cause non établie ; une resynchronisation du Drive depuis l'autre poste est probable. | Règle qui aurait évité le retour : aucune ne dit comment fusionner un fichier de secrets entre deux postes. Piste : que le script de sauvegarde hérité fusionne les `.env` clé par clé et refuse de copier un fichier qui perdrait une clé, au lieu d'écraser fichier contre fichier. |
| RT-150 | mineur | générique | **Un dossier ignoré puis renommé revient du Drive sous son ancien nom, que `.gitignore` ne couvre plus.** Fait (ledger seq 741) : le Drive porte encore `input/Tableau de gestion/`, 3 classeurs de gestion commerciale nominatifs, identiques au SHA-256 à ceux de `input/03-tableaux-de-gestion/`. Rapatriés au poste, ils sont apparus non suivis à `git status`, donc commitables. Copies retirées du poste dans le tour ; 3 orphelins restent sur le Drive. | Règle qui aurait évité le retour : aucune connue. Piste : quand un dossier ignoré change de nom, garder l'ancien chemin dans `.gitignore` ; le script de rapatriement refuse de poser un fichier qui ne serait pas ignoré. |

## Rattachement

Registre interrogé le 12/11/2026 : classes lues dans `todo/CLASSES.json` du pilot.
RT-149 : classe `reprise-multi-poste-declaree-non-cablee` (famille `heritage-produit`), qui porte déjà le canal Drive entre postes ; ce retour en ajoute un cas, l'écrasement d'un fichier de secrets fusionné.
RT-150 : classe `secret-porte-hors-perimetre` (famille `hook-ou-gate`), un fichier sensible dans un dépôt qui ne l'ignore pas.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'ancien dossier des tableaux de gestion reste sur le Drive | Non supprimé ; suppression laissée au porteur | non | Rien de généralisable, parce que c'est un reste de l'historique de ce Drive |

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

- **Le relevé `--verifier` du script de sauvegarde** a montré l'écart des `.env` avant toute copie : aucune clé n'a été écrasée.

## Ordre recommandé

1. RT-150 : il protège des données nominatives.
2. RT-149.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ni RT-149 ni RT-150 ne suivent un retour humain ; aucune règle ne couvre la fusion des secrets entre postes ni l'ancien chemin d'un dossier ignoré renommé.
