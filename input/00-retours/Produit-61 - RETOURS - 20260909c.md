# Retours forges — Produit-61 — 20260909c

- **Contexte** : demande humaine du 09/09/2026 — le rapport d'audit remis ne respecte pas la forme attendue, deux livrables de référence étant désignés comme le standard (`input\Client-A - Référentiel POC-to-Prod - Audit - 20260821a.html` et `input\Client-A - BAV - Rapport d'audit POC-to-Prod - 20260825a.html`)
- **Références ledger** : `forge\ledger.jsonl` seq 124, 126 (entrées `type: oracles_verdict` de l'étape audit)
- **Remise au pilot** : copier ce fichier et son sidecar dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-09

Ce lot remonte un écart de FORME entre deux livrables que le commanditaire désigne comme le standard et ce que le générateur de la forge d'audit produit aujourd'hui. Le fait central n'est pas une préférence de goût : les deux références **échouent** l'oracle que le catalogue de gabarits déclare pour leur propre famille, pendant que la sortie du générateur le **passe**. Les deux formes sont donc en contradiction mesurée, et rien dans la factory ne l'enregistre.

L'identifiant RP-10 est le dixième retour adressé au pilot par ce produit ; RA-4 et RA-5 sont les quatrième et cinquième adressés à la forge d'audit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le catalogue renvoie vers un générateur dont la sortie ne ressemble plus aux livrables de référence, et aucune pièce ne mesure l'écart.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-10 | bloquant | générique | L'entrée `gd-rapport-audit` de `gabarits\documents\catalogue.jsonl` est en statut `porte_ailleurs` et déclare pour oracle `digit-ai-forge-audit — tools/verifier-rapport-html.mjs`. Son champ `sources` s'arrête à « huit rapports d'audit produits entre le 12 et le 20/08 » : les deux livrables que le commanditaire désigne aujourd'hui comme le standard, datés des 21 et 25/08, n'y figurent pas. Mesure exécutée le 09/09/2026 avec cet oracle : `Client-A - BAV - Rapport d'audit POC-to-Prod - 20260825a.html` → **exit 1, 13 erreurs** ; `Client-A - Référentiel POC-to-Prod - Audit - 20260821a.html` → **exit 1, 12 erreurs** (sections `D00..D17` absentes, `data-restitution` non déclaré, `.verdict` absent, 0 `.kpi`, 0 `[data-vue]`, 0 chemin de lecteur, aucun manifeste d'écarts) ; `Produit-61 - Rapport d'audit - 20260909a.html` → **exit 0**. Un projet qui lit le catalogue croit que le générateur rend la forme des références ; il rend une autre forme, et la divergence n'est écrite nulle part. | Inscrire les deux références au champ `sources` avec leur verdict mesuré, et trancher laquelle des deux formes fait foi : soit les références sont périmées et le catalogue le dit, soit le générateur doit regagner ce qu'elles portent (bandeau de verdict, cartes de synthèse fonctionnelle/technique/audit, grille de KPI avec radar, en-tête collant avec export PDF, bascule de vues). Tant que l'arbitrage n'est pas écrit, tout audit remis rouvrira le même aller-retour. |

## forge-audit (`digit-ai-forge-audit`)

Deux défauts de l'espace de travail d'audit, tous deux invisibles à la porte machine.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-4 | majeur | générique | `tools\build-theme.mjs` fusionne le frontmatter de `branding.design_md` PAR-DESSUS `branding.typography` (ligne 28 : `typography = { ...typography, ...(fm.typography ?? {}) }`). L'espace de travail initialisé pour ce produit portait `design_md: DESIGN.md`, et ce `DESIGN.md` est la charte d'exemple **fictive** livrée avec la forge (`name: ACME — charte livrables d'audit (exemple fictif, RAF-030)`, `body: system-ui, Segoe UI, Roboto, Arial`). Résultat mesuré : `theme.css` portait `--font-body:system-ui, Segoe UI, Roboto, Arial` alors que `tenant.yaml` déclare `DM Sans, system-ui, -apple-system, Segoe UI` — le rapport d'audit d'un client a été rendu dans la typographie d'un client fictif, sans qu'aucun contrôle le voie. | Ne pas pointer `branding.design_md` sur la charte d'exemple à l'initialisation d'un espace de travail, ou faire primer la typographie explicitement déclarée au `tenant.yaml` sur celle d'un fichier de charte. Un contrôle possible : refuser un `design_md` dont le frontmatter porte la mention d'exemple fictif. |
| RA-5 | majeur | générique | Le `rapport-data.json` produit pour cet audit laissait vides six champs que `tools\rapport-engine.mjs` sait rendre : `projet`, `date`, `indice`, `auditeur`, `syntheses`, `reprise`. Conséquences mesurées sur le livrable du 09/09 : titre dédoublé « Digit-AI — Rapport d'audit — Rapport d'audit — Produit-61 » (le moteur compose `${tenant} — ${L.rapport} — ${projet}` et `titre` valait déjà « Rapport d'audit — Produit-61 ») ; plan de remédiation embarqué portant `"date": null` et `"projet": "Rapport d'audit — Produit-61"` ; et le manifeste d'écarts du rapport déclarant lui-même deux absences (« Aucun élément de reprise applicative déclaré », « Aucune synthèse rédigée transmise avec les données ») que personne n'a lues. La porte machine `tools\verifier-rapport.mjs` rend **exit 0** sur ces données. Le rapport disait son manque ; aucune porte ne l'a escaladé. | Porter ces six champs à la porte machine, au moins en avertissement nommé, et refuser un `titre` qui répète le libellé de document que le moteur ajoute déjà. Les cartes de synthèse des livrables de référence n'ont pas d'autre source que `data.syntheses` : le champ existe, il n'était pas alimenté. |

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec le verdict de généralisation de chacune.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La charte fictive ACME faisait autorité sur la typographie du rapport | ligne `design_md: DESIGN.md` retirée de `forge\etapes\audit\config\tenant.yaml`, thème régénéré : `--font-body:DM Sans, …` | oui | remonté en RA-4 — la cause est dans l'initialisation de l'espace de travail, pas chez ce produit |
| Six champs rendus par le moteur restaient vides dans les données d'audit | `rapport-data.json` complété (projet, date, indice, auditeur, 3 synthèses, 12 lignes de reprise applicative), toutes valeurs tirées d'un document du produit ou d'une mesure exécutée | oui | remonté en RA-5 — le manque venait des données produites par l'étape, pas du moteur |
| Le livrable du 09/09 aurait été écrasé par la reprise | rapport reconstruit sous l'indice `20260909b`, version `a` archivée dans `output\Old\` | non | règle déjà écrite au `README.md` de l'espace d'audit, appliquée |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Produit-61 - Rapport d'audit - 20260909a.html` | `gd-rapport-audit` · statut `porte_ailleurs`, sans version de gabarit exposée dans le document | le couple `gabarit` / `version_du_gabarit` exigé par G8 n'est porté nulle part dans le HTML rendu : « il manquait une section » ne se rattache à rien | le lecteur a comparé le livrable à deux rapports de référence et conclu au non-respect du format ; rien dans le document ne lui disait de quel gabarit ni de quelle version il descend | les trois synthèses et les douze lignes de reprise applicative ont dû être écrites hors de l'étape d'audit, à partir du socle documentaire du produit | générique |

## Confirmations positives

- La porte machine et l'oracle de rendu de la forge d'audit ont tous deux rendu **exit 0** sur le rapport reconstruit, sans dérogation ni contournement.
- Le manifeste d'écarts du moteur avait correctement déclaré les deux absences (reprise, synthèses) : la pièce qui dit le manque existait et fonctionnait.
- La recette complète de la forge d'audit rejouée le 09/09 avant toute intervention : **11/11 étapes vertes, 94 tests d'oracles** — la baseline de non-régression était disponible et exécutable en une commande.
- Le générateur a produit le livrable conforme sans qu'une seule ligne de la forge partagée n'ait été modifiée.

## Ordre recommandé

1. RP-10 d'abord : tant que la factory n'a pas tranché laquelle des deux formes fait foi, RA-4 et RA-5 corrigent une forme dont le statut n'est pas établi.
2. RA-5 ensuite : il touche le contenu du livrable, et son correctif est mécanisable à la porte machine.
3. RA-4 en dernier : le défaut est réel mais son effet est cosmétique, et son correctif est une ligne d'initialisation.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucune règle du socle n'oblige un livrable généré à porter le gabarit et la version dont il descend, alors que la boucle de retour de `gabarits\documents\README.md` déclare ce couple exigé par G8 : le rapport d'audit est rendu par un générateur, et le générateur n'écrit ni l'un ni l'autre dans sa sortie. C'est ce trou qui a transformé un désaccord de forme en enquête : sans le couple, le lecteur ne peut ni situer le livrable ni dire ce qui a bougé entre deux versions.

Deux classes de `CLASSES.json` couvrent partiellement ce lot et sont employées au sidecar : `contrat-de-sortie-sans-domicile` pour RP-10, `gabarit-conception-non-jugee` pour RA-5. **Aucune clé ne couvre RA-4** : un artefact d'EXEMPLE livré avec un outil est resté câblé comme configuration réelle et a primé sur la déclaration explicite du tenant. La clé voisine `alias-de-transition-perime-survivant` est employée par défaut au sidecar ; la classe qui manque pourrait s'appeler `exemple-livre-comme-configuration`, et il revient au pilot de la créer — une classe ne se crée jamais dans un sidecar.
