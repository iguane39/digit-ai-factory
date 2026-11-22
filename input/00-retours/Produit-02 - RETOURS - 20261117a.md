# Retours forges — Produit-02 — 20261117a

- **Contexte** : autre — correction du porteur sur la restitution de la publication de la vidéo Netatmo (16/11/2026), hors run de version (`forge\ledger.jsonl` seq 751, entrée `type: etape_close`).
- **Références ledger** : `forge\ledger.jsonl` seq 753 (entrée `type: retour`). Correspondance : RT-152 = seq 753.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici. Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT de ce produit (dernier défini : RT-151, lot 20261116a).

---

## Factory (`digit-ai-factory`)

La ligne « Livré : » du bloc 0 cache le chemin du livrable derrière son nom lisible ; le porteur demande de voir le chemin complet à l'écran, à chaque fois.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-152 | majeur | générique | **Le porteur ne voit pas où est le livrable.** Consigne du porteur du 17/11/2026, mot pour mot : « Lorsque tu affiches les fichiers dans le chapitre 0, ajoute le chemin complet entre parenthèses juste après, tout le temps. Et remonte à la Factory. » Fait (ledger seq 753) : la restitution du 16/11/2026 liait trois livrables par `Livré : [Carte QR-code A6, PDF à imprimer](output/06-supports-de-communication/Aux%20Portes%20...pdf)`, forme exacte prescrite par S87 (`gabarits\RESTITUTION.md` v2.71.0, ligne 17). La capture d'écran du chat VS Code jointe à la consigne montre les trois lignes réduites au seul nom lisible : le chemin n'apparaît nulle part. | Règle qui aurait évité le retour : aucune ; S87 prescrit le lien seul. Piste : S87 exige, juste après chaque lien « Livré : », le chemin complet du fichier entre parenthèses, par exemple `Livré : [Carte QR-code A6](output/...%20...pdf) (C:\dev\<produit>\output\06-...\<fichier>.pdf)` ; l'oracle refuse ou avertit une ligne « Livré : » sans parenthèse de chemin. La même règle vaut pour « À ouvrir : » si le porteur l'étend. Préférence à inscrire aussi dans `references\PREFERENCES-PORTEUR.md`, avec sa date. |

## Rattachement

Registre interrogé le 17/11/2026 : classes lues dans `todo/CLASSES.json` du pilot.
RT-152 : aucune classe ne porte un lien de livrable dont le chemin est masqué à l'écran ; classe à créer `livre-sans-chemin-visible`, dans la famille `restitution-forme` (une restitution de fin de tour hors gabarit).

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Aucune remarque restée au produit : la seule remarque du tour remonte en RT-152 | sans objet | non | Rien à dire, parce que la consigne du porteur part entière au pilot |

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

- **Le préjugement de la restitution** (`hook-restitution.mjs --prejuger`) a tenu la forme de S87 et S92 avant l'affichage ; le défaut tient à la règle elle-même, pas à son contrôle.

## Ordre recommandé

1. RT-152.
