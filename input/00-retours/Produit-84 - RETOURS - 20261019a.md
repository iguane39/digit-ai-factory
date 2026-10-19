# Retours forges — Produit-84 — 20261019a

- **Contexte** : autre — demande humaine hors run du 19/10/2026 : « Construis une architecture cible de l'application avec Cloudflare Pages & Supabase », livrée en page HTML avec schéma multi-bandes Client-A
- **Références ledger** : `forge\ledger.jsonl` seq 14 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 19/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre non interrogé dans ce lot : le pilot rattache à l'accueil. RT-9 entre comme neuf.

## digit-ai-factory (pilot)

Le skill de schémas Client-A et les oracles du socle HTML ne s'accordent pas. Une page instanciée fidèlement depuis le gabarit du skill échoue aux trois oracles, et la mise en conformité a demandé six passes de correction.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-9 | majeur | générique | Page `output\05-architectures\Client-A - Architecture cible Produit-84 - Pages et Supabase - 20261019a.html`, instanciée depuis `assets/template-multi-bandes.html` du skill `client-a-schemas` le 19/10. Premier passage : `check_html.py` FAIL (A1, 3 requêtes Google Fonts prescrites par le gabarit ; G1 ; L2, `max-width` du gabarit ; L4 et L13) ; `run-oracles-design.mjs` FAIL sur 4 oracles, dont `oracle-tokens` à 147 écarts durs (80 couleurs hexadécimales que `conventions-communes.md` § 1 et § 3 déclarent « non négociables ») et `oracle-bascule` à 19 (palette `--c-*` sans variante sombre) ; `render_page.py` V4 sur les cadres et pastilles de bande, que le gabarit ne groupe pas dans un `<g>` titré. PASS sur les trois après six passes. Ledger seq 14 | Aligner le gabarit du skill sur le socle : polices locales ou déclarées par `data-police-de-marque`, couleurs du schéma en jetons `var(--…)` avec leur projection sombre, cadres et pastilles de bande groupés dans un `<g>` titré, pastilles hors des couloirs de flèches, `data-page="donnees"`. Puis jouer les trois oracles sur `exemple-reference.html` du skill comme recette |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La page livrée porte ses corrections en propre : jetons `--nh-*`, repli en cartes des tableaux sous 720 px, barre de chapitres collée | Corrigé sur place, oracles rejoués à PASS | généralisable : oui, par RT-9 | Remonté en RT-9 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque documentaire sur ce lot ; la page vient du gabarit du skill `client-a-schemas`, traité en RT-9.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

`embarquer-composants.mjs --poser` a posé le composant `table-filters` sans geste à la main, et `--constat` confirme la parité de sa copie.

## Ordre recommandé

1. RT-9 : un seul retour sur ce lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-9** : aucune recette ne joue les oracles du socle sur le gabarit d'un skill de schémas avant sa diffusion. Classe à créer : clé `gabarit-skill-hors-oracles-du-socle`, famille `skill-ou-oracle-non-invoque`, libellé « Le gabarit d'un skill produit une page que les oracles du socle refusent : chaque page instanciée fidèlement repart en échec et se corrige à la main ».
