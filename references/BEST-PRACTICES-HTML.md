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
| **F1** | `Nhood - Catalogue ADR par domaine - 20260707a.html` | 813 Ko | Catalogue parcourable, rendu client-side lourd (798 Ko de JS) |
| **F2** | `Nhood - Rapport Audit - Bourse aux Vacants - 20260715a.html` | 382 Ko | Rapport d'audit multi-sections, rendu client-side (315 Ko de JS) |

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
| A4 | `<title>` porteur de marque + scope + version + date | F2 | `Nhood — … — V20260715a — 15 juillet 2026` | **adopter** | Reprendre le motif `Digit-AI — {Objet} · {Client}` + indice version. |
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

## F — Accessibilité & print

| ID | Nom | Source | Repère | Verdict | Règle d'application |
|---|---|---|---|---|---|
| F1 | `@media print` (neutralise l'interactif, force l'encre) | F1, F2 | 3 blocs `@media print` (F2) | **adopter** | Obligatoire dès que le PDF est visé. |
| F2 | `break-inside/page-break-inside: avoid` sur cartes/tableaux | F2 | `break-inside`, `page-break` | **adopter** | Empêche la coupure des blocs solidaires. |
| F3 | `role` / `aria-label` / `alt` (partiel) | F2 | `role=` ×2, `aria-label` ×1, `alt=` ×1 | **adopter** | Bon départ mais **insuffisant** : généraliser aria sur composants riches (B8–B11). |
| F4 | **Absence totale d'a11y** (aucun `role/aria/alt`) | F1 | 0 attribut a11y | **rejeter** | Contre-exemple : un catalogue interactif sans a11y est un défaut. |
| F5 | `@page` (marges, page de garde, pied `counter(page)`) | — | **absent des deux sources** | **adopter** | Écart identifié : à **ajouter** (aucune source ne le fait). Voir bonnes-pratiques §6. |

---

## Delta proposé vers le skill `digit-ai-page-html` (candidat — non appliqué)

> Ne rien écrire dans le skill sans GO humain. Ci-dessous, ce qui mériterait d'y être versé.

1. **`prefers-reduced-motion`** (E2) : ajouter au `boilerplate.html` et en 🟡 dans
   bonnes-pratiques §5 — actuellement absent.
2. **Composants réutilisables** (B2 KPI, B4 badges, B5 barres, B7 légende, B13 toolbar+compteur) :
   candidats à une future page `references/composants.md` du skill, chacun charté + testé oracle.
3. **`escapeHtml` (C1)** : déjà en §7, mais y ajouter le snippet S-C1 canonique.
4. **Contre-exemples D2/D3/F4** : candidats à `references/anti-patterns.md` (hex en dur, pile de
   police sans DM Sans, composant interactif sans a11y).

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

---

## Changelog

| Date | Version | Changement |
|---|---|---|
| 2026-08-10 | a | Création. Extraction F1 (Catalogue ADR) + F2 (Rapport Audit) ; 5 catégories A–F, 34 patterns tagués adopter/adapter/rejeter ; delta candidat + 5 snippets chartés. Page-témoin passée aux oracles `check_html.py` + `render_page.py`. |
