# Retours forges — Produit-85 — 20261116b

- **Contexte** : demande humaine du 16/11/2026 après 2 vols bloqués à Pontorson, « Il y a un problème dans les parcours […] Dans les 2 cas, j'ai dû le forcer à rentrer automatiquement à la base. Analyse en détails les problèmes […] Mets des IDs et des couleurs différentes pour chaque parcours sur la RC2 et sur la page web ». Les missions ont été refaites sans pivot du drone, avec un contrôle G6, des identifiants P1 à P12 et une couleur par mission.
- **Références ledger** : `forge\ledger.jsonl` seq 137, 138, 139, 140, 141 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 16/11/2026

---

## pilot (`digit-ai-factory`)

Une copie du boilerplate du socle, gardée dans le produit, a dérivé sans qu'aucune règle ne le signale.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-6 — copie du boilerplate du socle non suivie | majeur | générique | 16/11/2026 : `run-oracles-design` rend FAIL `oracle-surcouche` SC4 (aucun `color-scheme` en CSS) sur la page de fiches de vol, jugée PASS par le même orchestrateur le 10/11 (ledger seq 132). Le boilerplate de `digit-ai-page-html` porte ces déclarations depuis TF-2384 ; la copie du produit, `scripts/apdlb/gabarit.html`, datait d'avant. `diff --strip-trailing-cr` : 3 déclarations `color-scheme` et 1 commentaire d'écart. L'en-tête de `page.py` prescrit une copie « telle quelle », mais ni l'héritage R-47 ni l'ouverture de session ne la comparent au socle. Le retour seq 139 l'avait d'abord attribué à la forge ; rectifié en seq 141. | Classe `boucle-retour-sans-descente` : la correction TF-2384 n'est pas descendue chez le produit. Règle qui aurait évité le retour : aucune ne suit une copie de fichier du socle chez un produit. Piste : `gabarits/HERITAGE.json` déclare les fichiers du socle qu'un produit copie (ici `assets/boilerplate.html` vers `scripts/apdlb/gabarit.html`), et le contrôle d'héritage de l'ouverture compare leur empreinte. |

## Rattachement

Registre interrogé le 16/11/2026 : `grep -i "color-scheme" todo/TODO.jsonl` sur le pilot, sans borne → 26 lignes trouvées.

Item recoupé : TF-2384 porte la correction du boilerplate, déjà faite ; aucun item ne porte la descente de cette correction chez les produits qui copient le boilerplate.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Deux vols bloqués le 16/11/2026, retour automatique forcé : l'oblique nord-sud au demi-tour de cap de 174°, la grille au crochet de 129° du premier bout de ligne (seq 137). Journaux de vol v14 chiffrés : cause interne à DJI Fly non lisible. Les mêmes pivots avaient réussi à Bray le 25/10 à 3,2 m/s. | Cap fixe sur toute mission, une vue par mission oblique en aller-retour, virages de 90° au plus ; contrôle G6 `valider.dynamique`, rouge sur les 2 KMZ volés gardés dans `tests/donnees`, vert sur les 12 nouveaux, relus depuis la RC2 ; tests 86 sur 86. | non | propre aux missions DJI Fly de ce produit |
| Vignettes de la RC2 sans identifiant, tracés de toutes les missions mêlés (seq 138). | `identite.py` : P1 à P12 et une couleur nommée par mission, reprises par la vignette, les plans et la page ; planche relue. | non | propre à ce produit |
| `render_page.py` lancé par `uv run` sort en code 1, Playwright absent de l'environnement du produit (seq 140). | Rendu joué par le Python du poste, qui porte Playwright. | non | réglage du poste et du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Fiches de vol APDLB - Missions | 4 | reste au produit : chaque version est générée par `apdlb-fiches` depuis les missions du site et suit une évolution des missions, pas une reprise de forme |
| Fiches de vol Bray - Missions | 5 | reste au produit, pour la même raison : même générateur `apdlb-fiches`, autre site |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `oracle-surcouche` a vu le gabarit périmé du produit, que `check_html.py` laissait passer.
- `render_page.py` a refusé le tableau de synthèse à 11 colonnes, qui débordait de 79 px à 1024 px.

## Ordre recommandé

1. RP-6, seul retour aux forges de ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RP-6 nomme sa règle dans « Proposition esquissée » : la classe existante `boucle-retour-sans-descente` le porte, aucune clé nouvelle n'est proposée.
