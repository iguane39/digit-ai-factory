# Retours forges — Produit-87 — 20261124a

- **Contexte** : autre — production du dossier d'architecture technique (DAT) de Prism avec son schéma d'architecture, hors run.
- **Références ledger** : sans objet, aucun run ouvert.
- **Références hors run** : `forge/hors-run.jsonl` seq 11, 12 et 13 (entrées `type: retour`, TF-2260).
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>\input\00-retours\_arrivee\` par `node forge\retours\oracle-lot.mjs "<ce fichier>.md" --remettre`.
- **Statut** : remis le 2026-11-24

Ce lot porte **3 retours** : un gabarit de document qui suppose des sources absentes, et deux skills Client-A dont la sortie est refusée par les oracles du socle.

## digit-ai-factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-9 | mineur | générique | **Le gabarit DAT n'a pas de voie quand les documents qu'il assemble n'existent pas.** `gabarits/documents/dossier-architecture-technique/GABARIT.md` 1.1.1 fait des sections 2 et 3 des renvois à `docs/projet/ARCHITECTURE.md` et `docs/projet/COMPOSANTS-OPS.md`, et refuse « une vue logique recopiée ». Le 24/11/2026, Prism n'avait aucun des deux (produit repris, sans socle `docs/projet`). Le DAT a dû porter lui-même la vue logique et l'inventaire, avec une mention transitoire rédigée à la main (`output/06-architecture/Client-A - PRM - Dossier d'architecture technique - 20261124a.html`, section 1). | Écrire dans le gabarit le cas « source absente » : la section porte le contenu, déclare l'absence et sa mention transitoire, et devient un renvoi dès que le document de travail existe. |

## Skills Client-A (`digit-ai-forge-agents`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-10 | majeur | générique | **Une page tirée du boilerplate `client-a-page-html` passe sa charte et échoue à `quality-oracles`.** Le boilerplate charge Roboto, DM Sans et JetBrains Mono par `<link>` Google Fonts. `check_html.py` du socle Client-A rend PASS ; `run-oracles.mjs --profil generique` joue aussi `check_html.py` du socle digit-ai-page-html et refuse A1 (« 3 requête(s) réseau au chargement »), L4, L6, L7 et L10, que le boilerplate Client-A ne prévoit pas. Mesure du 24/11/2026 : 5 passes d'oracles et 4 scripts de correction (polices embarquées en `data:`, annonces de sommaire, chapeaux, exemples de lecture) pour un seul document. | Embarquer les polices dans le boilerplate Client-A et y porter les composants de lecture du socle (`.toc-d`, `.ch-apprend`, `.exemple-lecture`) ; ou faire choisir à `quality-oracles` le contrôle de charte selon la marque déclarée de la page. |
| RT-11 | mineur | générique | **Le gabarit multi-bandes de `client-a-schemas` est rouge à `render_page.py`.** Ses étiquettes `.svg-tlabel` en `--ink-muted` (#64748b) sur `--bg-soft` (#f7f8fa) mesurent 4,48:1, sous le seuil de 4,5:1 (V2 bloquant, 13 étiquettes par largeur). Les pastilles blanches de bande et le cadre pointillé que ses conventions prescrivent sont des superpositions V4 bloquantes tant qu'aucune paire `data-overlap-ok` n'est déclarée, et le gabarit n'en porte pas. Premier rendu du 24/11/2026 : 192 constats bloquants. | Foncer `.svg-tlabel` (`--ink-soft`) et déclarer dans le gabarit les paires `data-overlap-ok` des pastilles et des cadres ; jouer `render_page.py` sur le gabarit instancié avant chaque publication du skill. |

**Portée** : générique.

## La règle qui aurait évité le retour

- **RT-9** : un gabarit d'assemblage dit quoi faire quand une de ses sources manque.
- **RT-10** : une page conforme au boilerplate de sa marque passe les oracles du socle sans retouche.
- **RT-11** : un gabarit de skill est rendu par les oracles du socle avant d'être publié.

## Rattachement

Registre interrogé le 24/11/2026 dans `todo/CLASSES.json` du pilot, par les mots « gabarit », « socle », « charte », « police », « superposition » et « contraste ».

- **RT-9** : aucune classe ne vise une source d'assemblage absente ; `gabarit-famille-manquante` vise une famille absente. Classe proposée : `gabarit-d-assemblage-sans-source`.
- **RT-10** : `page-html-polices-distantes` (polices distantes au chargement) et `marque-emettrice-portee-par-deux-chartes`.
- **RT-11** : `gabarit-skill-rouge-aux-oracles-du-socle`.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Vue logique et inventaire absents du dépôt | portés par le DAT, avec mention transitoire | oui | remonté en RT-9 |
| Polices distantes et composants de lecture absents | polices embarquées, sommaire annoté, chapeaux, exemples de lecture, définitions d'en-têtes | oui | remonté en RT-10 |
| Contraste et superpositions du schéma | étiquettes en `--ink-soft`, 5 paires `data-overlap-ok` | oui | remonté en RT-11 |

## Retours sur les documents produits

`gabarit: gd-dossier-architecture` · `version_du_gabarit: 1.1.1`.

1. **Ajouté à la main** : un bloc « À retenir » en tête, un lexique des sigles, un tableau des flux numérotés du schéma, une feuille de route avec l'état de chaque étape, et une liste des 11 routes HTTP (le contrat que les consommateurs appellent).
2. **Ce qui a gêné le lecteur** : sans objet à ce jour, le document n'a pas encore été lu par son destinataire.
3. **Ce qui a manqué** : le cas « source absente » (RT-9) ; une colonne « porteur » distincte du jalon dans le tableau de trajectoire ; une place pour un statut « proposée, à valider en séance » des ADR.
4. **Portée** : famille.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `run-oracles-design.mjs --rendu` a trouvé en un passage les défauts de rendu du schéma et de la page, chacun avec sa sortie de correction écrite dans le message.
- `oracle-lecture-tiers.mjs` a exigé une phrase d'intention et la définition des 126 en-têtes : le document y a gagné un lexique utile au lecteur de la Design Authority.

## Ordre recommandé

1. **RT-10** : il touche toutes les pages Client-A, et une page conforme à sa marque ne devrait pas coûter 5 passes.
2. **RT-11** : une correction de jeton et cinq attributs dans le gabarit.
3. **RT-9** : un paragraphe de plus dans le gabarit.
