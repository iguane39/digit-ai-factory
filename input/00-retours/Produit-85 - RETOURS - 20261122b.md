# Retours forges — Produit-85 — 20261122b

- **Contexte** : réponse « 34a » du porteur du 22/11/2026, qui lance la construction de la visite 3D APDLB selon le brief `output\apdlb\Digit-AI - Brief APDLB - Visionneuse 3D autonome - 20261122b.md`. Le vol combiné est codé et testé, le calcul ODM et la compilation de `build-lod` tournent.
- **Références ledger** : `forge\ledger.jsonl` seq 154, 155, 156 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 22/11/2026

---

Aucun retour aux forges sur ce lot : les 3 retours du tour restent au produit, chacun avec son motif ci-dessous.

## Rattachement

Registre interrogé le 22/11/2026 sur le pilot, sans borne :

- `grep -ciE "App Control|controle d.application|Smart App" todo/TODO.jsonl` → 1 ligne, TF-1065 (forge-data, moteur Parquet sous contrôle d'application, au statut candidat).
- `grep -ciE "en double entre postes|double.*poste|poste.*double" todo/TODO.jsonl` → 53 lignes ; les premières (TF-0877, TF-0913 à TF-0915) portent sur la pseudonymisation et les index, pas sur des numéros de décision.

Item recoupé : TF-1065 est voisin de seq 154 par sa cause (contrôle d'application Windows), sans porter sur `rasterio`. Seq 156 récidive la classe `identifiants-registre-en-double-entre-postes` déjà écrite au ledger du produit le 25/10/2026 (seq 68, destinataire pilot, pas encore compilée en lot).

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Sur Dell-XPS-16, `import rasterio` échoue : « DLL load failed while importing _base : Une stratégie de contrôle d'application a bloqué ce fichier ». `tests/test_exploitation.py` et `tests/test_missions.py` ne se chargent plus ; 57 autres tests passent (seq 154). | Non corrigée : la chaîne 3D n'importe pas `rasterio` (`visionneuse.py`, `splats.py`, `traitement.py`), le chantier continue ; la campagne de clôture le dira PARTIEL. | non | propre à la politique de sécurité de ce poste ; voisin de TF-1065, sans le même composant |
| La session a conclu à l'absence des photos du 18/11 dans le canal de reprise en cherchant le chemin de l'autre poste, inexistant ici (seq 155). | Chemin de ce poste lu dans `forge\REPRISE.json` et vérifié ; conclusion confirmée après coup par les dates de création (16:28 à 16:32) ; correction dite au porteur. | non | erreur de lecture de la session, aucun outil de la forge en cause |
| D-34 réservée sur ce poste alors qu'une D-34 existe sur l'autre depuis le 30/10/2026, citée par le commit `16e0422` et `scripts/visionneuse/verifier.py` (seq 156). | Le brief 20261122b distingue les deux et cite la seconde par son commit. | oui | reste au produit, parce que c'est une récidive de seq 68, à compiler avec elle au lot de clôture du run |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Fiches de vol APDLB - Missions | 4 | reste au produit, parce que chaque version est générée par `apdlb-fiches` depuis les missions du site ; déjà déclarée au lot 20261117b |
| Fiches de vol Bray - Missions | 5 | reste au produit, parce que le même générateur la produit pour un autre site ; déjà déclarée au lot 20261116b |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. Le blocage de `rasterio` par Windows App Control (seq 154) est une politique du poste, déclarée dans les remarques restées au produit.

## Confirmations positives

- Le hook `reprise` a envoyé les 744 photos du 18/11 au canal Google Drive dans le tour qui les a copiées, sans geste humain.
- Les plafonds de Brush relevés à Bray (`plafond_taches`) et le contrôle de reprojection se réemploient tels quels pour APDLB.

## Ordre recommandé

Aucun retour aux forges sur ce lot.
