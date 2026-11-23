# Retours forges — Produit-85 — 20261123a

- **Contexte** : construction de la visite 3D APDLB selon le brief `output\apdlb\Digit-AI - Brief APDLB - Visionneuse 3D autonome - 20261122b.md`, phase P2. Le calcul ODM du vol combiné 20261116-18-3d a échoué à la texture, après l'alignement et le maillage.
- **Références ledger** : `forge\ledger.jsonl` seq 157 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 23/11/2026

---

Aucun retour aux forges sur ce lot : le retour du tour reste au produit, avec son motif ci-dessous.

## Rattachement

Registre interrogé le 23/11/2026 sur le pilot, sans borne :

- `grep -ciE "texrecon|mvs_texturing|out of memory|Not enough memory" todo/TODO.jsonl` → 0 ligne.

Aucun item recoupé : la cause est la mémoire allouée à WSL sur ce poste, aucun outil de la forge n'est en jeu.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La tâche NodeODM `954d27c0` (827 photos à 4096 px, `mesh-size` 2 000 000, `mesh-octree-depth` 12) échoue à `mvs_texturing` le 22/11/2026 à 23:41 UTC. Le noyau tue `texrecon` à 21,6 Go résidents sur 24 Go alloués à WSL, code 137, après 7 h 29 de calcul (seq 157). | Contournée : la chaîne 3D ne lit pas la texture ODM. `odm_mesh.ply` (3 655 206 faces) est copié par `docker cp`, la reconstruction OpenSfM et le nuage filtré se lisent dans le conteneur. L'orthophoto et le MNS du vol combiné ne sont pas produits ; le critère P2 « la tâche finit » n'est pas tenu, et le porteur le sait. | non | propre à la mémoire de ce poste et au maillage fin demandé par le brief (D3) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Fiches de vol APDLB - Missions | 4 | reste au produit, parce que chaque version est générée par `apdlb-fiches` depuis les missions du site ; déjà déclarée au lot 20261117b |
| Fiches de vol Bray - Missions | 5 | reste au produit, parce que le même générateur la produit pour un autre site ; déjà déclarée au lot 20261116b |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. L'arrêt de `texrecon` vient du noyau Linux de WSL, faute de mémoire, et non d'une politique de la plateforme.

## Confirmations positives

- L'alignement OpenSfM a placé 825 photos sur 827 dans une seule reconstruction de 661 310 points, à partir de deux vols pris à deux jours d'écart.

## Ordre recommandé

Aucun retour aux forges sur ce lot.
