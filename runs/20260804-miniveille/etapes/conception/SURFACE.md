# SURFACE.md — MiniVeille

## 1. Origine

`ENTRANT.md`, section 3 (« Extractible obtenu »), lui-même issu de
`PRODUIT-TEST.md` (2026-08-04) et de la consigne de cadrage du run (bloc PÉRIMÈTRE du prompt
d'orchestration de l'étape conception, même date).

## 2. Tableau

| id | type | libellé | d'où il vient |
|---|---|---|---|
| S-01 | objet | Lien | Job principal, `PRODUIT-TEST.md` ligne 5 : « enregistrer un lien avec des tags… » |
| S-02 | role | Consultant (mono-utilisateur, sans authentification) | Cible, `PRODUIT-TEST.md` ligne 4 ; contrainte « pas d'authentification » de la consigne de cadrage du run |
| S-03 | parcours | Enregistrement d'un lien avec tags | Job principal, `PRODUIT-TEST.md` ligne 5 |
| S-04 | parcours | Consultation de la liste des liens | Consigne de cadrage du run (« lister ») + job principal « le retrouver » |
| S-05 | parcours | Filtrage des liens par tag | Job principal, `PRODUIT-TEST.md` ligne 5 : « le retrouver par tag » |
| S-06 | parcours | Marquage d'un lien comme lu | Job principal, `PRODUIT-TEST.md` ligne 5 : « le marquer lu » |
| S-07 | point-entree | Page web unique | Palier visé, `PRODUIT-TEST.md` ligne 6 ; consigne de cadrage du run |
| S-08 | point-entree | API backend (FastAPI) | Palier visé, `PRODUIT-TEST.md` ligne 6 : « backend FastAPI » |
| S-09 | regle | L'enregistrement d'un lien s'effectue en moins de 10 secondes | Job principal, `PRODUIT-TEST.md` ligne 5, chiffre cité littéralement |

Numérotation continue S-01 à S-09. Aucun identifiant retiré à ce stade.

## 3. Écartés

- **Tag comme objet à cycle de vie propre** : envisagé, puis écarté. L'entrant ne cite aucune
  gestion de tag indépendante (pas de création, modification ou suppression de tag en tant que
  tel) — le tag est traité comme un attribut du lien (S-01), pas comme un objet distinct, au
  sens de la typologie (« si la chose n'a pas d'état, ce n'est pas un objet — c'est un
  attribut »).
- **Suppression d'un lien** : envisagée comme parcours distinct, puis écartée de l'énumération —
  non citée par l'entrant. Elle réapparaît en `EXIGENCES.md` uniquement de façon indirecte, comme
  partie du cycle de vie de l'objet Lien (S-01), pas comme parcours numéroté à part.
- **Recherche plein texte** : non citée par l'entrant (seul le filtre par tag l'est) — écartée,
  pas énumérée.
- **Rôle distinct « visiteur » ou « administrateur »** : écarté — l'entrant et la consigne de
  cadrage affirment un usage mono-utilisateur sans authentification, donc un rôle unique.

## 4. Non énumérable

Repris de `ENTRANT.md` section 4 : modèle de données détaillé, schéma d'API, écrans au-delà de
la page unique, volumétrie, règles de gestion fines (nombre maximal de tags, caractères
autorisés, doublons), persistance et infrastructure, design d'interface au-delà du ton de
marque, feuille de route au-delà de V1.
