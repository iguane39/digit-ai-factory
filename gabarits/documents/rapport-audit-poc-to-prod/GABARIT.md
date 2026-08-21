# Gabarit — Rapport d'audit POC-to-Prod

> **Famille** `rapport-audit-poc-to-prod` · catalogue `gd-rapport-audit`
> **Formats** HTML (page autonome, onglets)
> **Règles engagées** D1 D3 D5 D6 D7 (`gabarits\documents\README.md`)
> **Provenance** extrait du modèle canonique `Client-A - Modèle Rapport d'audit POC-to-Prod -
> 20260820a.html` (forge-audit_client-a) et du `Catalogue ADR par domaine - 20260817b`, après les
> correctifs du 20/08 : effort en niveaux, largeur du conteneur, rendu des données par liste
> fermée de balises.

Un rapport d'audit POC-to-Prod répond à **une seule question** : ce produit peut-il passer en
production, et à quelles conditions. Tout le reste — dimensions, contrôles, ADR — est la preuve
de la réponse. Un rapport qui n'énonce pas son verdict en tête a déjà manqué son lecteur.

---

## Structure — les sept blocs sont dus

### 0 · En-tête et verdict

```
{Client} · Rapport d'audit POC-to-Prod — {Produit} — {AAAAMMJJ<indice>}

Verdict : {GO | GO sous conditions | NO-GO}
Conditions : {liste fermée, chacune rattachée à un constat}
Audit mené du {date} au {date} · {N} contrôles sur {M} dimensions
```

### 1 · Comment lire ce rapport

Ce que le lecteur trouve où, et **ce que l'audit n'a pas regardé**. Un périmètre muet se lit
comme un périmètre total.

### 2 · Dimensions et notes

Une ligne par dimension : note, ce qui la porte, ce qui la plombe. **D6** : la justification
d'une note doit être propre à la dimension — si elle pourrait être collée sous une autre, elle
n'apprend rien.

### 3 · Conformité aux ADR de gouvernance

Une ligne par ADR : statut (conforme / écart / sans objet), preuve, écart s'il y a lieu. Le
**sans objet se motive** — un « sans objet » sans motif est un contrôle qu'on n'a pas joué.

### 4 · Contrôles exécutés

Le détail. **D3 s'applique** : ces tableaux dépassent largement trois colonnes, repli en cartes
sous 900 px dû. Chaque contrôle porte sa sortie, jamais un « conforme » nu.

### 5 · Schéma d'infrastructure et d'architecture

**D5 s'applique** : toute superposition voulue déclarée (`data-overlap-ok`), tout glyphe employé
en `content` CSS prouvé présent dans la pile de repli, légende et unités dues. Les éléments
**relevés à l'audit** et les éléments **cibles** se distinguent visuellement (les cibles en
pointillé), et la distinction est en légende.

### 6 · Plan de remédiation consolidé

| Constat | Gravité | Remédiation | Complexité | Durée | Réversible ? | Porteur |
|---|---|---|---|---|---|---|

**Jamais de jours** : complexité × durée, la règle de dérivation déclarée en tête du tableau
(E8). Une remédiation sans porteur n'entre pas au plan.

### 7 · Informations attendues par le RUN

Ce que l'exploitant doit recevoir pour prendre le produit : accès, sauvegardes, supervision,
astreinte, procédure de retour arrière.

---

## Ce que le gabarit refuse

- **Un verdict absent de la première page**, ou un verdict sans ses conditions énumérées.
- **Un effort en jours** (E8).
- **Un « sans objet » sans motif**, un « conforme » sans sa sortie.
- **Un schéma sans légende** ou mélangeant relevé et cible sans les distinguer (D5).
- **Un tableau de contrôles sans repli mobile** (D3).
- **Un texte bridé dans un conteneur large** (D1).

## Avant de remettre

1. `check_html.py` **et** `render_page.py --widths 1280,768,390` (D7).
2. Le nombre de contrôles annoncé en tête = le nombre de lignes de la section 4. Un compte
   qui ne se recompte pas est un chiffre inventé.
3. Aucun `{…}` restant.
