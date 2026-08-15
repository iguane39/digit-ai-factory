# Proposition — Refonte du rapport d'audit SEO d'Produit-02.com

**Statut : PROPOSITION — aucune implémentation.** Mandat humain explicite du 15/08/2026,
scopé à CE livrable du produit Produit-02.com. Cas d'application de la doctrine
« restitution lisible » (proposition jointe, TF-0235). Rien n'est écrit dans le projet
produit ni dans forge-seo à ce stade.

**Fichier concerné** :
`seo\livrables\Produit-02 - Audit SEO - 20260809k.html` (491 Ko, 11 chapitres,
31 sections sur une page, 0 graphique).

**Maquette jointe** :
`Produit-02 - Maquette Vue d'ensemble - Rapport SEO - 20260815a.html`

---

## 1. Nature du livrable — c'est un rapport d'audit, pas un dashboard

Famille **F1** de la doctrine : état des lieux daté, verdicts et preuves, lu quelques
fois puis rejoué au prochain run. La CX cible est un **guidage narratif** — constat →
impact → action — avec exploration à la demande. Pas un mur de KPIs : les chiffres
existent pour porter la décision, chaque affirmation reste adossée à sa preuve
(la traçabilité nœuds → verdicts → actions est la valeur du rapport, elle est
intégralement conservée).

## 2. Lecteurs types de CE rapport

| Lecteur | Qui, concrètement | Question d'entrée | Ce que la refonte lui donne |
|---|---|---|---|
| **Le commanditaire** | le propriétaire des gîtes — novice SEO | « mon site est dans quel état ? ça vaut quoi en clients ? je décide quoi ? » | la vue d'ensemble : verdict, 4 chiffres lus, 3 actions, trajectoire en € |
| **Le metteur en œuvre** | webmaster / agence / lui-même outillé | « je fais quoi, dans quel ordre, c'est quoi le détail technique ? » | la vue Plan d'action : 10 actions triables, prérequis, échéances de mesure |
| **L'expert SEO** | consultant qui vérifie ou reprend | « les verdicts tiennent ? méthode, barèmes, preuves ? » | les vues Constats, Grille (87 nœuds) et Méthode, intactes et outillées |

## 3. Architecture cible — 6 vues dans un fichier unique autonome

Fichier HTML unique consultable hors ligne (invariant), navigation permanente par
vues (ancres/onglets), thème clair, socle et charte respectés. Chaque vue déclare son
objectif (RL-2) :

| Vue | Objectif déclaré | Lecteur premier | Contenu et interactions |
|---|---|---|---|
| **V1 · Synthèse** | « l'état du site et les 3 gestes qui comptent, en un écran » | commanditaire | verdict + 4 KPIs contextualisés (RL-3) + 2 graphiques (grille, trajectoire) + top 3 actions + chemins d'entrée par lecteur (RL-9) |
| **V2 · Plan d'action** | « les 10 actions, triées comme VOUS travaillez » | metteur en œuvre | tableau exploitable (RL-5) : tri gain/effort/échéance, filtres quadrant (IA/manuel × gratuit/payant) et régime, détail par action replié |
| **V3 · Constats** | « ce qui a été trouvé, ce que ça change, ce qui y répond » | expert, metteur en œuvre | les 15 points faibles + 7 points forts en pattern constat → impact → action, preuves repliées à la demande (RL-7, RL-8) |
| **V4 · Couverture de la grille** | « les 87 nœuds : instruits, non mesurables, hors portée » | expert | tableau 87 lignes : tri, filtres par statut/thème, recherche (RL-5) |
| **V5 · Données analysées** | « requêtes, pages, et ce que Search Console voit » | expert, metteur en œuvre | requêtes et résultats + pages analysées, tableaux outillés |
| **V6 · Méthode & traçabilité** | « comment ce rapport juge, et ce qu'il ne peut pas dire » | expert | barèmes, formule de score, dette d'instrumentation, limites — le contenu générique vit ici et seulement ici (RL-7) |

## 4. Inventaire iso-contenu (L4) — chaque chapitre de l'original a sa destination

Rien n'est résumé, rien ne disparaît ; on réorganise.

| Chapitre original | Destination |
|---|---|
| 1 · Synthèse (couverture, maturité, actions, cible, 3 actions, « comment lire ») | **V1** (KPIs refondus en composants RL-3 ; « comment lire » → V6 + aide contextuelle) |
| 2 · Depuis le run précédent | **V1** (encart delta) + détail en **V3** |
| 3 · L'existant — 15 points faibles, 7 points forts | **V3** (pattern constat → impact → action) |
| 4 · Actions à mettre en œuvre | **V2** (table maître) — le détail par action y est replié |
| 5 · Gains et priorités (gain × effort, 4 quadrants) | **V2** (les quadrants deviennent des filtres + un graphique gain × effort) |
| 6 · Trajectoire 12-24 mois (clics, CA, jalons, sensibilité) | **V1** (graphique + KPI cible) ; jalons et sensibilité en détail **V2** |
| 7 · Requêtes et résultats | **V5** |
| 8 · Pages analysées | **V5** |
| 9 · Couverture de la grille | **V4** |
| 10 · Dette d'instrumentation | **V6** (+ rappel en V1 si elle plafonne un verdict) |
| 11 · Méthode et traçabilité (+ « ce que ce rapport ne peut pas dire ») | **V6** |

Contrôle à la refonte : inventaire mécanique des sections/relevés de l'original
confronté à la cible (RL-8) — l'écart éventuel se liste, jamais silencieux.

## 5. Ce que la maquette jointe démontre

La maquette couvre **V1 complète** et **V2 fonctionnelle** (tri et filtres réels sur
les 10 actions), les vues V3-V6 présentes en squelette avec objectif déclaré et
inventaire de contenu — aucune affordance morte : ce qui n'est pas maquetté est dit
tel quel. Elle est construite sur les **données réelles du rapport** (67/87 nœuds,
maturité 1/5, 2 514 clics/an, cible 3 200-3 940, actions A1-A10 avec leurs gains
extraits) ; les valeurs non extraites sont affichées « — », jamais inventées.

Critère L3 à vérifier sur pièce : un lecteur novice doit répondre en < 30 s à —
quel est l'état du site · quelles 3 actions d'abord · où cliquer pour creuser.

## 6. Plan de refonte (après GO)

1. **Gabarit** : squelette 6 vues sur le socle + composants RL (1 j).
2. **Migration du contenu** : chapitres → vues selon §4, contrôle iso-contenu (1 j).
3. **Outillage** : tris/filtres/recherche V2-V4-V5, graphiques V1-V2 (0,5-1 j).
4. **Contrôles** : socle + `render_page` + test des 30 s + inventaire iso-contenu (0,5 j).

**Décision structurante — corriger le fichier ou le producteur ?** Ce rapport est
généré par forge-seo : refondre le seul fichier 20260809k donne un gain local
éphémère (le prochain run régénère l'ancien format) ; porter la refonte dans le
générateur de forge-seo (campagne mandatée) fait naître tous les rapports futurs au
bon format. Recommandation : maquette validée → campagne forge-seo, et le fichier
Produit-02 est régénéré, pas retouché à la main.

## 7. Décisions humaines attendues (L5)

- **D1** — Valider l'architecture 6 vues (§3) et les lecteurs types (§2).
- **D2** — Juger la maquette sur le critère des 30 secondes (L3) — au besoin la faire
  itérer avant tout GO d'implémentation.
- **D3** — Trancher fichier vs générateur (§6) : mandat produit one-shot, ou campagne
  forge-seo (recommandé).
- **D4** — Si campagne forge-seo : la lier à la doctrine TF-0235 (P2 de son plan) pour
  que le cas serve de preuve avant généralisation.
