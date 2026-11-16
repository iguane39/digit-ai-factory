# Retours forges — Produit-82 — 20261113k

- **Contexte** : mise à jour des vues du dossier projet par un agent rédacteur après l'étape usage sans code (commits `cda459a` à `ea03639`, puis `a815f46`) ; run `Produit-82-20261110-version`, étape `version-20261113-usage-sans-code`.
- **Références ledger** : `forge\ledger.jsonl` seq 296
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Pilot, générateurs des vues HTML du dossier projet

Le retour porte sur les pages que le pilot génère pour un produit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-47 | mineur | générique | Le 13/11/2026, `docs/projet/ARCHITECTURE.html`, produite par `scripts/generer-architecture.mjs`, rend FAIL à `check_html.py` : L25, page à 12 chapitres sans sommaire. `docs/projet/MODELE-DONNEES.html`, produite par `scripts/generer-modele-donnees.mjs`, rend FAIL : L25 (10 chapitres sans sommaire) et L3 (valeurs codées `mise_en_service`, `desactivee_par_operateur` sans légende). Le verdict est le même sur la version d'avant ce tour (`54b6bc3`). Le produit ne peut pas corriger : ses règles interdisent d'éditer ces pages à la main. Ledger seq 296. **RT-47** : clé proposée `vue-generee-hors-socle-html`. | Faire poser par les deux générateurs un sommaire collant (`nav aria-label="Sommaire"`, une entrée par `h2`) et une légende `title` sur les valeurs codées des tableaux, puis jouer `check_html.py` dans leurs tests. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `ARCHITECTURE.md` disait encore « aucun composant n'existe encore » et « le déploiement hébergé attend l'arbitrage D8 » | réécrites sur le produit construit et sa recette, page régénérée, commit `a815f46` | non | corrigée |
| `oracle-conformite-projet` R-22 ne compare la liste `variables` de `PARAMETRAGE.md` qu'au `.env.example` de la racine, alors que le produit en porte deux ; 8 variables de plus cette version | non corrigé : déjà consigné le 13/11/2026 (ledger seq 268) | non | ouverte |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- L'agent rédacteur a rejoué chaque générateur sur une copie et obtenu une page identique à celle qu'il commitait.

## Ordre recommandé

1. RT-47 : chaque produit qui génère ses vues hérite de 2 pages hors socle.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour ne suit aucune correction humaine. La règle qui l'aurait évité : un générateur du pilot joue sur ses sorties l'oracle de forme que le socle impose aux pages du même type.
