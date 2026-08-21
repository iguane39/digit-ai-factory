# Référentiel de best practices HTML — forge Digit-AI

**Source de vérité unique** des patterns HTML réutilisables extraits des livrables réels, filtrés
par la charte `digit-ai-page-html`. Ce fichier fait foi ; il n'y a pas de seconde copie. Le skill
`digit-ai-page-html` reste le **socle normatif** — ce référentiel ne le contredit jamais, il
**capitalise des patterns concrets** au-dessus de lui et pointe les candidats à y verser (§ Delta).

> Statut doctrinal : artefact du **pilot** (écriture libre). Aucune écriture dans un dépôt frère
> ni dans le skill sans mandat humain explicite (cf. `CLAUDE.md` garde-fous). Le versement des
> patterns « adopter » vers le skill est un **candidat**, pas un fait accompli (voir § Delta).

---

## Méthode & périmètre

**Sources analysées** (entrants `input\HTML`, traités comme **donnée à auditer**, jamais comme
best practices pré-validées) :

| Réf | Fichier | Taille | Nature |
|---|---|---|---|
| **F1** | `Client-A - Catalogue ADR par domaine - 20260707a.html` | 813 Ko | Catalogue parcourable, rendu client-side lourd (798 Ko de JS) |
| **F2** | `Client-A - Rapport Audit - Produit-11 - 20260715a.html` | 382 Ko | Rapport d'audit multi-sections, rendu client-side (315 Ko de JS) |

**Comment l'extraction a été menée** : profilage automatique des deux fichiers (script
`profile_html.py`) sur 8 axes — head/meta/fonts, tokens `:root`, comptage de balises, noms de
classes, attributs a11y, `@media`, fonctionnalités CSS, fonctions/API JS, attributs `data-*` —
puis dédoublonnage des patterns et confrontation de chacun à la charte
(`references/charte-et-tokens.md` + `references/bonnes-pratiques.md` du skill).

**Périmètre volontairement écarté** (loi « l'oubli n'existe pas ») :
- Le **contenu métier** (données ADR, constats d'audit) — hors sujet : on catalogue des patterns
  de forme, pas de la donnée.
- La **logique JS ligne-à-ligne** (parseurs markdown, CRC32, mise en page SVG) — capturée au
  niveau « pattern » et non « implémentation intégrale » ; l'implémentation reste dans les
  sources si besoin de la reprendre.
- Les deux fichiers étant **rendus à ~95 % côté JS**, l'inventaire porte sur les patterns
  observables (CSS, structure statique, API JS nommées), pas sur le DOM généré à l'exécution
  non instrumentée. **Ce n'est donc pas une exhaustivité du DOM final**, mais une exhaustivité
  des patterns de conception repérables statiquement — écart assumé et signalé.

**Convention de verdict** :
- **adopter** — conforme charte, réutilisable tel quel (après passage aux tokens canoniques).
- **adapter** — bonne idée, mais à retravailler (a11y, tokens, équivalent PDF) avant réemploi.
- **rejeter** — anti-pattern ou violation charte ; conservé ici comme **contre-exemple** à ne
  pas reproduire.

**Sévérité charte** : C1 Roboto titres · C2 DM Sans corps · C3 jamais Syne · C4 light · tout en
`:root`. Un pattern qui viole C1–C4 ne peut pas être « adopter ».

---

## A — Structure & `<head>`

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| A1 | Fichier unique autonome (CSS+JS inline, zéro dépendance hors web fonts) | F1, F2 | inline `<style>`+`<script>` | **adopter** | Tout livrable HistoryHtml reste auto-portant ; web fonts avec repli système. |
| A2 | Favicon SVG inline en `data:` URI | F1, F2 | `<link rel="icon" type="image/svg+xml" href="data:…">` | **adopter** | Porte le logo, zéro requête, net en PDF. Voir snippet S-A2. |
| A3 | `charset` **puis** `viewport` en tête de `<head>`, `<html lang="fr">` | F1, F2 | F1 `charset="utf-8"`, F2 `charset="UTF-8"` | **adopter** | Charset dans les 1024 premiers octets ; normaliser en `UTF-8`. |
| A4 | `<title>` porteur de marque + scope + version + date | F2 | `Client-A — … — V20260715a — 15 juillet 2026` | **adopter** | Reprendre le motif `Digit-AI — {Objet} · {Client}` + indice version. |
| A5 | `xmlns:mso` / `xmlns:msdt` sur `<html>` | F2 | `<html … xmlns:mso=…>` | **rejeter** | Artefact copier-coller Word (anti-pattern skill). À retirer sauf collage Word explicite. |

## B — Composants d'affichage

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| B1 | Header sticky (marque + sous-titre + méta-ligne) | F1, F2 | `.hwrap/.brand/.sub/.meta-line`, `position:sticky` | **adapter** | Repasser couleurs/typo en tokens ; garder `position:sticky;top:0`. |
| B2 | Grille de KPI (label · valeur · hint) | F1, F2 | `.kpis/.kpi-card/.kpi-label/.kpi-value/.kpi-hint` | **adopter** | Bloc de chiffres-clés en tête de livrable. Voir snippet S-B2. |
| B3 | Cartes de synthèse (titre · corps · puces) | F2 | `.summary-card/.sc-title/.sc-body/.sc-bullets` | **adopter** | Résumé exécutif structuré, une carte par thème. |
| B4 | Badges de statut / type / criticité (pastille **+ libellé**) | F1, F2 | `.badge`, `.pill`, `statutBadge()`/`typeBadge()` | **adopter** | Couleur **jamais seule** (C : libellé obligatoire). Mappe sur `--green/--amber/--teal`. |
| B5 | Barre de progression CSS (`track`/`fill`) | F1 | `.bar/.track/.fill` | **adopter** | Score ou avancement ; largeur en `%` via `--val`. Voir snippet S-B5. |
| B6 | Tableau de données triable, `thead` sticky | F1, F2 | `<table>`, `data-sort`, `data-tmsort` | **adopter** | Données en vrai `<table>` (`<th scope>`, `<caption>`), tri au clic sur `<th>`. |
| B7 | Légende (swatch + label) | F2 | `.leg-item/.leg-swatch/.leg-label` | **adopter** | Accompagne tout code couleur ; swatch **+** libellé texte. |
| B8 | Drawer / panneau latéral détaillé | F1 | `.dw-overlay/.drawer/.dw-close`, `openDrawer()` | **adapter** | Ajouter piège de focus, `role="dialog"` `aria-modal`, `Esc` pour fermer, équivalent statique si PDF. |
| B9 | Dropdown multi-sélection (Tout / Aucun) | F1, F2 | `.dropdown/.dd-panel`, `data-fall/-fnone` | **adapter** | Ajouter `aria-expanded`/`aria-controls`, navigation clavier. |
| B10 | Onglets de domaine (tab → panel) | F2 | `.domain-tab/.domain-panel`, `gotoDomain()` | **adapter** | Ajouter `role="tab"`/`tablist`/`tabpanel`, flèches clavier. |
| B11 | Tooltip personnalisé | F1, F2 | `data-tip`, `.tt`, `mouseover/mousemove` | **adapter** | **Trou PDF/no-JS** : exiger équivalent statique + `aria-describedby` (anti-pattern skill). |
| B12 | Schéma d'architecture rendu en SVG | F2 | `_archRenderSvg()`, 3 `<svg>` | **adapter** | Relève du skill `digit-ai-schemas` — déléguer, ne pas réimplémenter ici. |
| B13 | Toolbar de filtres + compteur de résultats | F1, F2 | `.toolbar/.filters/.count`, `currentShown()` | **adopter** | Compteur en `aria-live="polite"`. |

## C — Interactions & fonctionnalités JS

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| C1 | `escapeHtml()` sur toute donnée injectée | F1 (`esc`), F2 (`escapeHtml`) | `innerHTML` data-driven | **adopter** | **Obligatoire** dès qu'on injecte de la donnée (bonnes-pratiques §7). Voir snippet S-C1. |
| C2 | Recherche in-page + surlignage, insensible aux accents | F1, F2 | `normalize()`, `findRe/hl`, `adrHL` | **adapter** | Le skill fournit déjà `find-in-page.js` : **réutiliser le composant**, ne pas réécrire. |
| C3 | État dans l'URL via `URLSearchParams` (deep-link filtres) | F2 | `readUrl()`, `URLSearchParams` | **adopter** | Filtres/onglets partageables et rechargeables ; viewer-only. |
| C4 | Rendu data-driven `render()` depuis structure JS | F1, F2 | `render()`, données en tête de script | **adapter** | **Danger** : contenu porté par JS = page vide sans JS / en PDF. Le contenu essentiel doit exister en statique (dégradation gracieuse §7). |
| C5 | Markdown → HTML inline (`mdToHtml`) | F1 | `mdToHtml/mdInl/mdFor` | **adapter** | Optionnel ; si repris, échapper d'abord (C1) puis rendre. |
| C6 | Export ZIP client (crc32 + blob) | F1 | `dlZip/crc32/u32/blob` | **adapter** | Fonctionnalité lourde et spécifique ; garder optionnelle, viewer-only. |
| C7 | Génération `.md` par entrée + téléchargement | F1 | `genMd/mdFor` + `<a download>` | **adapter** | Optionnel (export d'une fiche depuis le catalogue). |

## D — Styles & tokens

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| D1 | `:root` centralisé | F1 (partiel) | `:root{--bg,--txt,--accent…}` | **adapter** | Bon principe, **mais noms non canoniques** : renommer vers `--ink/--muted/--blue/--line` (C8). |
| D2 | Couleurs **hex en dur** (`#404040`, `#0F766E`…) | F2 | `body{color:#404040}`, vars scoping composant | **rejeter** | Viole « tout en `:root`, aucun hex en dur ». Contre-exemple. |
| D3 | Pile de police `"Segoe UI",Roboto` **sans DM Sans** | F1 | `font-family:'Segoe UI',Roboto,…` | **rejeter** | Viole C1/C2 (corps doit être DM Sans, titres Roboto). |
| D4 | Fonts chartées Roboto + DM Sans + JetBrains Mono | F2 | `'Roboto'`, `'DM Sans'`, `'JetBrains Mono'` | **adopter** | Conforme C1/C2/C5 ; conserver la pile de repli système. |
| D5 | Palette sémantique de statut (base · `-bg` · `-txt`) | F2 | `--tm-ok/-okbg/-oktx`, `ko/part/na/todo` | **adopter** | Mappe sur `--green/--amber/--teal` du skill (base + `-fill` + `-line`). |
| D6 | Ombres douces, rayons, transitions | F1, F2 | `box-shadow`, `--r`, `transition` | **adopter** | Rayons via token `--r`/`--r-sm` ; transitions courtes. |

## E — Responsive

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| E1 | Breakpoint unique `@media(max-width:900px)` | F1, F2 | `@media(max-width:900px)` | **adopter** | Au moins un breakpoint confort ; empiler les grilles en 1 colonne. |
| E2 | `@media (prefers-reduced-motion: reduce)` | F2 | neutralise transitions/animations | **adopter** | **Manque au boilerplate du skill** → candidat delta. Voir snippet S-E2. |
| E3 | Mises en page Grid/Flex fluides | F1, F2 | `grid-template`, `display:flex` | **adopter** | Éviter les hauteurs fixes qui cassent en multi-page PDF. |
| E4 | Conteneur principal à **75-100 % de la fenêtre**, et la prose le REMPLIT | décision humaine 13/08, arbitrage 21/08 | `--w: clamp(75vw, 1680px, 92vw)` · `.chap.lire` | **adopter (obligatoire)** | Tout HTML généré occupe 75 à 100 % de la largeur de la page à toute taille de fenêtre : token canonique `clamp(75vw, 1680px, 92vw)` (92 % sous ~1826 px, plafond confort 1680 px, plancher 75 vw au-delà). Jamais de plafond px nu (`max-width:1000px`). **La mesure de lecture est portée par le CONTENEUR, jamais par le paragraphe** : c'est le CHAPITRE qu'on rétrécit (`.chap.lire`, ~1 080 px centrés), et le texte le remplit. *Arbitrage du 21/08 (TF-0441), et ce qu'il remplace* : ce texte prescrivait « la prose reste bornée en `ch` (`--prose`) : c'est le conteneur qui s'élargit, pas la ligne de texte ». Trois textes coexistaient alors sans hiérarchie — E4 (prose bornée), L2-rendu (bloc ≥ 85 % de la largeur offerte) et le boilerplate (bride sur le `<p>`, forme que L2 interdit) — et chaque run refaisait l'arbitrage. Ce que ça donnait, mesuré : 647 px de texte pour 1 130 px de conteneur à 1 280 px de fenêtre, soit la moitié de la page vide à droite, **refusée par le lecteur humain** le 21/08 sur un livrable remis. Le boilerplate a tranché le premier (TF-0421, `p, li` sans bride, `.chap.lire` / `.chap.duo` nommés) ; ce référentiel dit désormais la même chose, et il n'y a plus qu'un texte. **Un item réfuté sur un artefact outillé se clôt sur le VERDICT de l'oracle, jamais sur la citation de cette ligne** (R-35) : c'est cette substitution qui a laissé TF-0172 se rouvrir huit jours plus tard. |

**Gabarits de livrables.** Les formes de documents que la factory propose aux projets —
rapport de données, diagnostic, rapport d'audit, fiche sécurité — vivent dans
`gabaritsdocuments` (catalogue, doctrine transverse D1-D7, oracle `oracle-gabarits-documents`).
Un projet qui doit rendre un livrable y prend le gabarit de sa famille plutôt que d'inventer une
forme ; une famille absente se remonte en candidat. Les règles ci-dessous restent la contrainte
de forme : la bibliothèque prescrit la STRUCTURE, le socle prescrit le RENDU.

## F — Accessibilité & print

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| F1 | `@media print` (neutralise l'interactif, force l'encre) | F1, F2 | 3 blocs `@media print` (F2) | **adopter** | Obligatoire dès que le PDF est visé. |
| F2 | `break-inside/page-break-inside: avoid` sur cartes/tableaux | F2 | `break-inside`, `page-break` | **adopter** | Empêche la coupure des blocs solidaires. |
| F3 | `role` / `aria-label` / `alt` (partiel) | F2 | `role=` ×2, `aria-label` ×1, `alt=` ×1 | **adopter** | Bon départ mais **insuffisant** : généraliser aria sur composants riches (B8–B11). |
| F4 | **Absence totale d'a11y** (aucun `role/aria/alt`) | F1 | 0 attribut a11y | **rejeter** | Contre-exemple : un catalogue interactif sans a11y est un défaut. |
| F5 | `@page` (marges, page de garde, pied `counter(page)`) | — | **absent des deux sources** | **adopter** | Écart identifié : à **ajouter** (aucune source ne le fait). Voir bonnes-pratiques §6. |

## G — Thème sombre (pattern normatif R-30)

Pattern **non extrait de F1/F2** (ni l'un ni l'autre n'en a — écart déjà relevé) : décision
humaine directe du 12/08 (TF-0131, `REGLES-PROJET.md` §J). Obligatoire sur tout HTML autonome
livré, pas un candidat « adopter/adapter » comme les patterns extraits — un standard.

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| G1 | Bascule thème sombre en en-tête, `data-theme` sur `:root`, tokens dérivés | R-30 (TF-0131) amendé TF-0158 (13/08) | `.theme-toggle`, `:root[data-theme="dark"]` | **adopter (obligatoire)** | Voir snippet S-G1 : câblée, persistée, **clair par défaut STRICT** (l'auto-sombre `prefers-color-scheme` à la 1re visite est retiré — il a produit le retour humain du 13/08 ; le sombre est un choix du lecteur), AA dans les deux thèmes, impression toujours claire. |
| G2 | Favicon-lettre : première lettre du **client ou du projet**, SVG en `data:` URI | décision humaine 13/08 | `<link rel="icon">` + `<text>` | **adopter (obligatoire)** | Loi transverse n°3 (surface implicite proposée d'office) : tout HTML créé porte son favicon-lettre — le boilerplate du skill l'embarque (`{L}` à remplacer), les générateurs du pilot et de forge-tests le posent automatiquement. |

**Preuve exécutée** (double sens, `references\temoin\`) :

| Fixture | Rôle | Défaut testé |
|---|---|---|
| `Digit-AI - Page-Temoin Bascule-Sombre-Verte - HTML - 20260812a.html` | verte | Conforme R-30 : clair par défaut, bascule câblée et persistée, palette sombre dérivée, AA tenu dans les deux thèmes, impression forcée claire. |
| `Digit-AI - Page-Temoin Bascule-Sombre-Rouge - HTML - 20260812a.html` | rouge | Contraste sombre insuffisant (`--muted`/`--faint` trop proches de `--bg` sombre) — échoue sur V2 de `render_page.py`. Démarre volontairement en sombre (attribut `data-theme="dark"` figé dans le HTML, commenté) : c'est la seule façon de soumettre l'état sombre à un oracle de rendu statique qui ne simule aucun clic — le pattern livrable normatif, lui, reste clair par défaut (S-G1). |

Preuves d'exécution (sorties `render_page.py` / `check_html.py`) : voir § Preuves d'exécution R-30
en fin de fichier.

---

## H — Pages à listes : filtres, recherche, KPIs cliquables (pattern normatif)

Décision humaine directe du 13/08 (même statut que G — un standard, pas un candidat) : tout
HTML généré présentant une **liste parcourue** (tableau de données, cartes répétées, catalogue)
propose les trois affordances ci-dessous. Modèle de référence : le catalogue ADR (source F1),
dropdowns « Type (5) / Criticité (4) » avec Tous/Aucun, champ « Rechercher (titre, décision,
source, ADR…) » et bouton « Réinitialiser les filtres ». Loi transverse 1 : chaque affordance
est **câblée** — un filtre qui ne filtre pas est un défaut.

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| H1 | Filtres multi-sélection par colonne catégorielle (Tous / Aucun, compteur) | F1 | B9 ; `table-filters.js` du skill | **adopter (obligatoire)** | Dès 8 lignes/entrées (seuil L4 du skill) : un dropdown par dimension catégorielle, libellé « Nom (n) », boutons Tous/Aucun. Exemption : `data-filterable="off"` **+** motif. |
| H2 | Recherche plein texte + « Réinitialiser les filtres » | F1 | `input[type="search"]` ; `find-in-page.js` du skill | **adopter (obligatoire)** | Insensible aux accents, sur les champs porteurs (titre, contenu, id…). Le bouton de réinitialisation rétablit filtres **et** recherche ; compteur de résultats en `aria-live="polite"` (B13). |
| H3 | KPIs cliquables filtrant la liste | F1 + demande 13/08 | B2 + `role="button"`, `aria-pressed` | **adopter (obligatoire)** | Tout KPI qui compte des éléments **affichés dans la page** filtre la liste sur son sous-ensemble au clic (re-clic = tout réafficher ; accessible clavier). Un KPI comptant des éléments **hors page** (archives…) ne se rend pas cliquable et dit où vivent ses éléments (L3). |

| H4 | Synthèse à fait nouveau — jamais une redite | refus humain du 13/08 (TF-0176) | colonne « lecture », chapeaux | **adopter (obligatoire)** | Toute phrase de synthèse générée cite **au moins un fait absent des autres colonnes** (le constat au plus fort risque, le motif d'un non-testé…) — une synthèse qui ne fait que reformuler des chiffres déjà affichés ne se génère pas. Mécanisation : candidature L13 (delta n°6). |
| H5 | Composant livré avec son habillage | refus humain du 13/08 (TF-0176) | `table-filters.css` jumeau de `table-filters.js` | **adopter (obligatoire)** | Un composant injecté sans CSS sort en rendu brut navigateur chez TOUS ses hôtes. Le CSS charté (tokens `:root`, deux thèmes, `@media print`) s'inline avec le JS ; l'état OUVERT passe V2/V4 (`render_page.py --etats-ouverts`). |

Contrat amont : les forges propriétaires de gabarits vérifient E4/G1/H **avant génération**
(`CONTRAT-INTERFACE.md` §2 bis) ; dérive constatée → candidature TODO au pilot. **Revue
aval (TF-0176)** : un livrable UI se juge sur **états ouverts** — panneaux dépliés, détails
ouverts, recherche remplie (`--etats-ouverts`) — et l'acceptation d'une campagne de retours
joint **une capture par retour**, jamais un verdict textuel seul.

---

## Delta vers le skill `digit-ai-page-html` — TOUS SOLDÉS (resync du 14/08)

> Section historique : les six deltas candidats accumulés depuis le 10/08 sont versés au
> skill, chacun vérifié sur pièce le 14/08. Aucun delta ouvert à ce jour — tout nouveau
> delta s'ajoute ci-dessous en « candidat » daté.

1. ~~`prefers-reduced-motion` (E2)~~ **soldé** — présent au `boilerplate.html` (vérifié 14/08).
2. ~~Composants réutilisables~~ **soldé** — `references/composants.md` existe (8 composants,
   dont tableau repliable calibré RA-2 et KPI cliquables).
3. ~~`escapeHtml` S-C1~~ **soldé** — snippet dans bonnes-pratiques §7 (vérifié 14/08).
4. ~~Contre-exemples D2/D3/F4~~ **soldé** — `references/anti-patterns.md` les porte (vérifié 14/08).
5. ~~Pattern S-G1~~ **soldé** — boilerplate l'embarque (clair STRICT depuis TF-0158) et
   `check_html.py` tient le contrôle G1 (bascule morte = FAIL, fixtures g1-* double sens).
6. ~~Standard H / L13 + `kpi-filter.js`~~ **soldé le 14/08** — règle L13 (recherche statique
   dès 8 lignes = FAIL, KPI morts = avertissement) + composant `kpi-filter.js`, self-test 37/37.

---

## Snippets réutilisables (chartés)

Tous en tokens canoniques du skill — à coller tels quels.

**S-A2 — Favicon SVG inline**
```html
<link rel="icon" type="image/svg+xml"
  href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563EB'/%3E%3C/svg%3E">
```

**S-B2 — Carte KPI**
```html
<div class="kpi"><span class="kpi-label">Conformité</span>
  <span class="kpi-value">87 %</span><span class="kpi-hint">32 / 37 ADR</span></div>
```
```css
.kpi{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:16px;display:flex;flex-direction:column;gap:4px}
.kpi-label{font-family:var(--sans);color:var(--muted);font-size:.8rem}
.kpi-value{font-family:var(--head);font-weight:800;font-size:1.6rem;color:var(--ink)}
.kpi-hint{color:var(--faint);font-size:.75rem}
```

**S-B5 — Barre de progression**
```html
<div class="bar" role="img" aria-label="Score 87 %"><span class="fill" style="--val:87%"></span></div>
```
```css
.bar{background:var(--line);border-radius:999px;height:8px;overflow:hidden}
.fill{display:block;height:100%;width:var(--val);background:var(--blue);border-radius:999px}
```

**S-C1 — Échappement HTML (obligatoire avant toute injection de donnée)**
```js
const escapeHtml = s => String(s).replace(/[&<>"']/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
```

**S-E2 — Respect du mouvement réduit**
```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
}
```

**S-G1 — Bascule thème sombre (pattern canonique R-30, autonome, zéro dépendance)**

Quatre morceaux à coller tels quels : (1) le script d'initialisation, **avant** le `<style>`,
au tout début de `<head>`, pour poser `data-theme` avant la première peinture (zéro flash) ;
(2) les tokens sombres, ajoutés à la suite du bloc `:root` clair de la charte ; (3) le bouton,
dans l'en-tête du document ; (4) le script de câblage, en fin de `<body>`.

*1 — Initialisation (avant `<style>`) : **choix persisté du lecteur, sinon CLAIR — la
préférence système n'est PAS suivie** (RV-9, 14/08). Le snippet suivait encore
`prefers-color-scheme` alors que R-30 l'avait retiré le 13/08 : le pattern de référence
contredisait sa propre règle, et deux livrables du même socle pouvaient s'ouvrir
différemment sur le même poste.
Volontairement sans `defer`/`async` : différer peindrait d'abord le thème par défaut
du CSS puis re-peindrait en sombre — c'est justement le flash que ce script évite
(avertissement générique « script bloquant en head » de `check_html.py` : exception
assumée ici, documentée dans les fixtures.)*
```html
<script>
(function () {
  var stocke = localStorage.getItem('digitai-theme');
  /* Clair TOUJOURS par défaut : `prefers-color-scheme` n'est PAS suivi (R-30 amendée
     TF-0158, contradiction du pattern levée par RV-9 le 14/08). Le sombre est un choix
     explicite du lecteur, persisté — jamais un héritage du poste. */
  var theme = stocke === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
</script>
```

*2 — Tokens sombres (dérivés mécaniquement des tokens clairs — une source, deux
projections : `bg`/`surface` s'assombrissent vers une base marine, `ink`/`muted`/`faint`
s'éclaircissent en dégradé inverse, `line` reste un filet proche du fond, chaque accent
sémantique éclaircit sa teinte de base pour rester lisible sur fond sombre et assombrit son
`-fill`/`-line` en griffe basse de la même teinte)*
```css
:root[data-theme="dark"] {
  --bg: #0B1220; --surface: #121B2E; --card: #121B2E;
  --ink: #EEF2F8; --muted: #A9B4C4; --faint: #7C8AA0; --line: #263248;
  --blue: #7DA2F5;
  --amber: #FBBF6D; --amber-fill: #2B2210; --amber-line: #4A3A18;
  --teal:  #5FE6D6; --teal-fill:  #0E2A27; --teal-line:  #164E48;
  --green: #7BE0A0; --green-fill: #0F2A1B; --green-line: #1C4A30;
}
/* Impression toujours claire (R-30.2), quel que soit le thème affiché à l'écran. */
@media print {
  :root, :root[data-theme="dark"] {
    --bg:#FFFFFF; --surface:#FFFFFF; --card:#FFFFFF; --ink:#0F172A;
    --muted:#64748B; --faint:#94A3B8; --line:#E6EAF2; --blue:#2563EB;
    --amber:#D97706; --amber-fill:#FFFBEB; --amber-line:#FDE9C8;
    --teal:#0E9488;  --teal-fill:#EFFDFB;  --teal-line:#C7F0EA;
    --green:#15803D; --green-fill:#F2FCF5; --green-line:#CFEEDD;
  }
  .theme-toggle { display: none; }
}
```

*3 — Bouton (en-tête, haut à droite par défaut — geler la géométrie fine aux
tokens `--r-sm`/`--line` du gabarit qui l'accueille)*
```html
<header class="doc" style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px">
  <div>
    <p class="eyebrow">Digit-AI · {TypeDoc}</p>
    <h1>{Titre du livrable}</h1>
  </div>
  <button id="theme-toggle" class="theme-toggle" type="button"
          aria-label="Bascule thème sombre" aria-pressed="false">
    <svg class="icon-moon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>
    </svg>
    <svg class="icon-sun" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="4.5"/>
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
            stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  </button>
</header>
```
```css
.theme-toggle{appearance:none;border:1px solid var(--line);background:var(--surface);
  color:var(--ink);border-radius:999px;width:36px;height:36px;flex:none;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center}
.theme-toggle:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.theme-toggle .icon-sun{display:none}
:root[data-theme="dark"] .theme-toggle .icon-moon{display:none}
:root[data-theme="dark"] .theme-toggle .icon-sun{display:inline}
```

*4 — Câblage (fin de `<body>` : persistance + `aria-pressed`, aucune bascule muette)*
```html
<script>
(function () {
  var bouton = document.getElementById('theme-toggle');
  var racine = document.documentElement;
  function appliquer(theme) {
    racine.setAttribute('data-theme', theme);
    localStorage.setItem('digitai-theme', theme);
    bouton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  bouton.setAttribute('aria-pressed', racine.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
  bouton.addEventListener('click', function () {
    appliquer(racine.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();
</script>
```

---

## Preuves d'exécution R-30 (fixtures double sens, `references\temoin\`)

Rendues avec `render_page.py` (`--widths 1440`) et auditées avec `check_html.py` — sorties
datées, à recalculer si le pattern S-G1 change (jamais recopiées d'une campagne à l'autre).

| Fixture | `render_page.py` | `check_html.py` |
|---|---|---|
| verte (clair, par défaut) | **PASS** — 0 défaut bloquant à 1440px | PASS |
| rouge (sombre figé, palette délibérément insuffisante) | **FAIL** — V2 contraste : `--faint`/`--muted` sous le seuil AA sur `--bg` sombre | PASS (le défaut est spécifique à R-30, hors périmètre des règles charte/lisibilité génériques de `check_html.py` — candidature de mécanisation notée en Delta) |

`render_page.py` ne simule aucun clic : la preuve du thème sombre s'obtient en figeant
`data-theme="dark"` dans le HTML rendu (documenté dans chaque fixture concernée), jamais en
changeant le pattern livrable (qui reste clair par défaut, S-G1 point 1).

## Changelog

| Date | Version | Changement |
|---|---|---|
| 2026-08-10 | a | Création. Extraction F1 (Catalogue ADR) + F2 (Rapport Audit) ; 5 catégories A–F, 34 patterns tagués adopter/adapter/rejeter ; delta candidat + 5 snippets chartés. Page-témoin passée aux oracles `check_html.py` + `render_page.py`. |
| 2026-08-12 | b | R-30 (TF-0131, décision humaine) : catégorie G — pattern normatif obligatoire de bascule thème sombre (S-G1), tokens sombres dérivés + impression forcée claire. Deux fixtures double sens sous `references\temoin\` (verte PASS, rouge FAIL mesuré sur contraste V2). Delta candidat n°5 vers `boilerplate.html`/`check_html.py`. |
| 2026-08-13 | c | E4 (décision humaine) : conteneur à 75-100 % de la fenêtre, token `clamp(75vw,1680px,92vw)` — appliqué sur ordre humain direct jusqu'au skill (`boilerplate.html`, durcissement L2 de `check_html.py`, self-test 33/33). Catégorie H (décision humaine) : standard listes — filtres H1, recherche H2, KPIs cliquables H3. Contrat §2 bis : conformité pré-génération des gabarits HTML par forge propriétaire. Delta candidat n°6 (L13 + `kpi-filter.js`). |
| 2026-08-13 | d | TF-0158 (décision humaine) : G1 amendé — **clair par défaut STRICT**, auto-sombre OS retiré (cause du retour humain du 13/08), sombre = choix persisté. **G2 : favicon-lettre obligatoire** (1re lettre client/projet, SVG `data:`). Retours Produit-10 portés au skill (A1-bis script tronqué + fixture, L3 barème par colonne, indice L11, seuil de repli calibré) — self-test 34/34, **source forge-agents synchronisée** (dérive installé↔source attrapée). R-32 (gate aval HTML) encodée §L + oracle. |
