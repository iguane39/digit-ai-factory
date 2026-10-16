# Étude d'opportunité — doctrine « restitution lisible » (TF-0235) — 20260815a

## Seuil de déclenchement (vérifié)

TF-0235 **crée des objets durables** (référentiel, gabarit exécutable, oracle — R-31)
et sa cible finale **touche ≥ 3 forges** (toutes les forges productrices de
restitutions : tests, seo, audit, data, observability, en plus de design). Étude
obligatoire avant `decide`.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.
Sources : TF-0235 (candidat du 15/08), mandat humain du 15/08 (analyse L99 du prompt
« dashboards »), `output\01-revues-et-propositions\Digit-AI - Proposition Forge -
Restitution lisible - 20260815a.md`, maquette de preuve
`Produit-02 - Maquette Vue d'ensemble - Rapport SEO - 20260815a.html`
(verdict oracles : CONFORME, 13 PASS).

## 1. Partition du problème

Découpage disjoint et exhaustif — chaque option de la section 4 se rattache à ces
partitions :

- **P-a Conception par lecteurs** : qui lit chaque famille de livrable, pour décider quoi.
- **P-b Architecture d'information** : organisation en vues, une question par vue,
  vue d'ensemble en un écran.
- **P-c Exploitabilité de la donnée** : tableaux (tri/filtre/recherche), visualisations,
  KPIs portant leur lecture.
- **P-d Mécanique d'application** : comment la discipline s'impose aux forges
  productrices sans se renégocier à chaque livrable.
- **P-e Gouvernance** : où vit la règle opposable, qui la fait respecter.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Socle `digit-ai-page-html` — `check_html.py` | règles L6 (« entrée sans annonce : un élément .toc-d ≥ 12 caractères est attendu »), L7 (« chapitre sans chapeau .ch-apprend ≥ 40 caractères »), L10 (« chapitre de données sans exemple de lecture »), L3 (« valeur sans légende »), L4 (« filtre, tri et recherche obligatoires dès 8 lignes ») — constatées sur pièce le 15/08 en jugeant la maquette | recouvre P-c au niveau de la PAGE ; ne recouvre ni P-a ni P-b (aucune notion de lecteur ni de vue) |
| `render_page.py` (socle) — V1-V7 | sortie mesurée du 15/08 : `v1_overflow`, `v2_contrast`, `v4_overlap` sur 3 breakpoints | recouvre le rendu ; ne recouvre pas la conception |
| Composant filtres-tableau (forge-organization) | `oracle-filtres-tableau.mjs`, règles G1-G6 (« Tableau de 10 lignes … sans data-filterable ni exemption motivee », « Aucun compteur data-tf-count-for ») — rejoué le 15/08 | recouvre l'outillage d'UN tableau (P-c partiel) ; ne recouvre ni familles ni lecteurs ni vues |
| Skill `critique-le-design` (forge-design) | SKILL.md : « grille en sept dimensions notées, adossée à des oracles lancés » — aucune dimension ne porte sur la lecture de données | ne recouvre pas ; point d'accroche pour la 8e dimension (P-d) |
| Skill `ameliore-le-design` (forge-design) | SKILL.md : « maquette navigable … landing, connexion, tableau de bord, CRUD » — produit des maquettes de PRODUITS | ne recouvre pas la restitution de données d'audit/suivi |
| Skill `dataviz` (poste, bundle Claude Code) | SKILL.md : « form heuristic, color formula avec validateur exécutable, mark specs » — appliqué à la maquette le 15/08 (palette validée 5/5) | recouvre le graphique unitaire ; ne recouvre ni P-a, ni P-b, ni P-d |
| `REGLES-PROJET.md` (pilot) | 17 règles décidées le 06/08 + amendements — aucune ne porte sur la restitution HTML | ne recouvre pas ; réceptacle possible de la règle opposable (P-e, décision humaine) |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche web externe non
mandatée dans ce run ; l'instruction s'appuie sur l'existant interne cité en
section 2, qui fournit les contrats exécutables contre lesquels la doctrine se
positionne. La revue datée (section 5) confrontera la doctrine aux références
externes lors de la première migration d'une forge productrice.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo cité : rapport SEO 20260809k =
  491 Ko sur une page, 0 graphique pour des centaines de valeurs, constat humain du
  15/08 (« imbitable », « ne permettent pas de comprendre le fichier ») ; chaque
  nouveau dashboard reproduit le défaut puisque rien ne l'interdit.
- **O1 — doctrine en prose seule (référentiel sans gabarit ni oracle)** : coût 1-2 j ;
  exclut la convergence mécanique — le précédent du socle montre que ce qui n'est pas
  jugé par oracle n'est pas tenu (loi du dépôt : « un livrable d'étape n'est accepté
  que sur verdict d'oracle exécuté »).
- **O2 — référentiel + gabarit consommable + oracle chez forge-design, 8e dimension
  de critique-le-design** : coût 3-5 j (P1) + 1-2 j (P3), puis campagnes de migration
  par forge productrice (P4) ; exclut l'application immédiate à toutes les forges
  (migration progressive, mandatée par campagne).
- **O3 — tout encoder dans le socle `digit-ai-page-html`** : coût 2-3 j ; exclu car
  le socle juge une PAGE rendue (L1-L12, V1-V7), pas une conception par lecteurs et
  par vues — y loger familles et personas mélangerait deux niveaux de contrôle et
  ferait peser les exigences de conception sur toute page HTML, y compris hors
  restitution.
- **O4 — refondre chaque dashboard au cas par cas, sans doctrine** : coût répété à
  chaque livrable (2-3 j pièce, constaté sur la maquette SEO) ; exclut toute
  capitalisation — le défaut renaît à chaque génération.

## 5. Verdict

- **Option retenue : O2** — référentiel + gabarit + oracle chez forge-design,
  extension de critique-le-design, migrations par campagnes mandatées.
- **Coût** : P1 3-5 j (référentiel, gabarit, oracle, fixtures) ; P3 1-2 j (8e
  dimension) ; P4 par campagnes successives, une forge productrice à la fois ;
  dette assumée : le gabarit vit chez design, les producteurs vivent ailleurs —
  le lien est le contrat d'oracle, pas un import de code.
- **Candidature(s) émise(s)** : TF-0235, déjà au registre ; décision directe
  mandatée (« committe et implémente tout », humain, 15/08/2026).
- **Plan de revue : 2026-09-15** — confronter l'oracle-restitution aux premiers
  livrables migrés (SEO au minimum) : taux de règles tenues sans exemption,
  écarts déclarés, et instruction de l'état de l'art externe resté non instruit.
