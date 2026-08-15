# Étude d'opportunité — ce que personne ne juge : i18n, composants, produit hors run (TF-0283..TF-0286) — 20260815f

## Seuil de déclenchement (vérifié)

TF-0284 **crée un objet durable** (un pan d'audit — R-31), TF-0285 **crée une règle
transverse** touchant le pilot et forge-organization, TF-0286 crée un outil. Étude
obligatoire avant décision.

## 0. Traitement des entrants

Le lot instruit est une DONNÉE. Sources : lot ingéré le 15/08 après le correctif de
l'en-tête de digit-ai.fr, et l'insatisfaction humaine du même jour (« le menu français
est compressé et le menu anglais ne reprend pas tout […] à voir même si toutes les
pages ont été traduites »), captures à l'appui.

## 1. Partition du problème

- **P-a Surface non parsée** : les destinations de liens vivent dans des composants
  React ; le contrôle statique les déclare hors périmètre — TF-0283.
- **P-b Dimension non jugée** : le multilingue (parité de routes, parité de navigation,
  langue du contenu) n'a d'oracle nulle part — TF-0284.
- **P-c Absence de gate hors run** : un produit legacy modifié en session ad hoc
  n'hérite d'aucune obligation de vérification — TF-0285.
- **P-d Coût du geste** : une règle de vérification visuelle ne tiendra que si elle
  coûte une commande — TF-0286.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Pan interface de forge-tests | l'item : « le pan interface **déclare les composants .jsx/.tsx hors périmètre** du contrôle statique (limite documentée au playbook) » | la limite est honnête et déclarée — elle n'en est pas moins un trou : les 4 liens fautifs du 15/08 vivaient tous dans des `.tsx` |
| Pan qualif (instance servie) | TF-0268, même lot : il parcourt les routes servies — 184/184 en vert avec des canoniques `localhost` | parcourt les routes EXISTANTES d'une locale ; ne compare jamais deux locales entre elles |
| Socle `digit-ai-page-html`, règle de langue (TF-0241, ce jour) | `check_html.py` : « lang absent ou vide sur `<html>` (défaut Digit-AI : `lang="fr"`) » | juge la langue DÉCLARÉE d'une page ; ne juge ni la langue du contenu, ni l'existence de sa traduction |
| `ETAPES-RUN.md` étape 5 bis + gates de la loi n° 6 | « le produit jugé contre SA promesse design […] le rendu se juge en pixels » | s'applique **dans un run** ; le correctif du 15/08 n'était pas un run |
| Routage forge du produit | `ETAPES-RUN.md` §1 : « la section "Routage forge" est **obligatoire et remplie** : c'est elle qui garantit que les sessions ad hoc dans le produit passent par les forges pour tout verdict » — posée dans le `CLAUDE.md` du produit **à sa naissance sous la doctrine** | le mécanisme d'obligation existe et fonctionne ; un produit legacy n'a jamais reçu ce `CLAUDE.md` — le gate n'a pas été retiré, il n'a jamais été posé |
| `render_page.py` (V1-V7) | juge une page à des largeurs données, y compris `--etats-ouverts` | juge un ÉTAT ; ne compare pas un avant et un après, ne cible pas la zone modifiée |
| `oracle-baseline.mjs` (design, `cat-des-08`) | « détecter toute régression visuelle contre une **référence approuvée versionnée** » | recouvre la régression d'un produit qui possède une baseline approuvée ; un legacy modifié à chaud n'en a pas, et l'approbation est un geste de run |
| Loi transverse n° 6 (15/08) | « un rendu générique est un défaut, pas un goût — généricité et baseline en oracle (étapes 3 et 5 bis) » | vise la GÉNÉRICITÉ d'une DA ; ne dit rien d'une régression de mise en page introduite par un correctif ponctuel |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche externe non mandatée. L'instruction
repose sur trois mesures prises à la main le 15/08 sur le produit réel, citées par les
items : 1 route manquante sur 201 en parité, 4 entrées de menu contre 9, 9 pages sur
200 servant du contenu français sous locale anglaise. Revue datée en section 5.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo mesuré : des liens cassés
  **livrés en production** dans trois composants, un menu anglais amputé **depuis juin
  sans détection**, et une insatisfaction humaine formulée deux fois (« ça ne va
  toujours pas »).
- **O1 — corriger le produit seulement** : coût ½ j ; réfutée par l'expérience du jour —
  c'est ce qui a été fait, et le défaut est revenu sous une autre forme (menu compressé)
  parce qu'aucun contrôle ne juge l'expérience après correctif.
- **O2 — outiller la détection seule** (pan React + pan i18n) : coût 2-3 j ; couvre P-a
  et P-b, laisse P-c entier — les pans ne s'exécutent que si quelqu'un les lance, or
  une session ad hoc sur un legacy n'a aucune obligation de le faire (R-35 : un contrôle
  sans appelant n'existe pas).
- **O3 — outiller la détection ET poser la règle transverse avec son outil de geste
  court** (pan React + pan i18n + règle « produit legacy touché = verdicts forge » +
  CLI de rendu comparatif) : coût 3-4 j ; exclut la refonte du routage forge des
  produits legacy (un `CLAUDE.md` de rattrapage par produit reste une décision de leur
  propriétaire, hors de ce lot).
- **O4 — imposer un run de version pour toute modification d'un legacy** : coût
  prohibitif par correctif (socle, delta, tests entiers pour un lien) ; rejetée — elle
  transformerait chaque retouche en run et serait contournée dès la première urgence,
  exactement le mécanisme qu'O0 documente.

## 5. Verdict

- **Option retenue : O3** — détection outillée (deux pans), règle transverse encodée
  avec son appelant nommé, et le geste ramené à une commande pour qu'il soit tenu.
- **Coût** : pan interface étendu 1 j · pan i18n 1-1,5 j · règle transverse ½ j
  (pilot + organization) · CLI comparatif ½-1 j (design) ; dette assumée : la détection
  de langue par densité de mots-outils est une heuristique — son seuil se déclare et ses
  faux positifs se contestent, comme tout constat d'audit.
- **Candidature(s) émise(s)** : aucune nouvelle — les 4 items sont décidés directement
  (mandat global humain du 15/08).
- **Plan de revue : 2026-09-15** — la parité de navigation est-elle jugée à chaque
  build, un correctif ad hoc sur un legacy a-t-il rejoué le rendu, et l'insatisfaction
  fondatrice (INS-0001) est-elle close sans réouverture ?
