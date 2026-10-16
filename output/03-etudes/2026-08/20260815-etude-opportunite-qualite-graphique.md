# Étude d'opportunité — qualité graphique par défaut (TF-0236, TF-0237, TF-0238) — 20260815b

## Seuil de déclenchement (vérifié)

Le lot **touche le noyau** (TF-0238 : loi transverse dans `CLAUDE.md`, plafonné 6 Ko —
son propre texte exige l'instruction TF-0155) et **modifie des référentiels durables**
(profils UI, `ETAPES-RUN.md`). Étude obligatoire avant `decide`.

## 0. Traitement des entrants

La candidature instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.
Sources : lot `candidature-qualite-graphique-par-defaut.tf.jsonl` (ingéré le 15/08,
sha 77ac336b…, TF-0236..TF-0238), mandat humain global du 15/08 (« fais tout »).

## 1. Partition du problème

- **P-a Dérivation de la DA** : la direction artistique naît de l'expérience que le
  produit veut apporter à ses clients, jamais d'un template.
- **P-b Contrôles mécaniques** : généricité du rendu et régression visuelle jugées par
  oracles existants.
- **P-c Câblage au run** : les contrôles jouent par défaut aux étapes design et 5 bis,
  sans décision humaine ajoutée.
- **P-d Élévation en loi** : formulation au noyau et coût en octets (plafond 6 Ko,
  état mesuré : 6 143 / 6 144 octets).

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Profils UI (ex. `profils\webapp.md` §1) | tableau « Norme / métrique · Seuil · Oracle gratuit qui juge » : CWV, ARIA, PWA, DTCG — aucune ligne DA, généricité ou baseline | ne recouvre pas P-a/P-b au niveau profil |
| Catalogue `cat-des-09` | « Contrôler la généricité d'une interface (règles importées) — `oracle-taste.mjs` — prouve — experimental » | recouvre le MÉCANISME de P-b ; opt-in, jamais joué par défaut |
| Catalogue `cat-des-08` | « Baseline de régression visuelle — `oracle-baseline.mjs` — 0,0000 % conforme / 17,3 % divergent mesurés » | même verdict : mécanisme prouvé, opt-in |
| `references\ETAPES-RUN.md` §3 | « Appliquer la méthode `systeme-de-marque` […] Champs `ton` et `contraintes reprises` non dérivables → question humaine » | dérive une DA mais n'exige ni l'ancrage expérience client ni la généricité PASS |
| `references\ETAPES-RUN.md` §5 bis | « le produit jugé contre SA promesse design (tokens du run, écrans/états, CTA, rendu 2 thèmes, voix) » | juge la fidélité à la promesse, pas la généricité de la promesse elle-même |
| `CLAUDE.md`, lois transverses 1-4 | « Toute affordance est câblée ou n'existe pas » … « Une donnée volatile est une donnée, pas du code » | aucune loi ne porte sur le rendu |
| `REFERENTIEL-RESTITUTION.md` (design) | « l'étage au-dessus du socle […] la page fait-elle son travail auprès de son lecteur ? » | couvre les restitutions, pas l'UI produit |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche externe non mandatée ; l'instruction
s'appuie sur les contrats exécutables internes cités en section 2 (dont `cat-des-09`,
lui-même issu d'une source externe MIT consultée le 14/08 et déjà passée au crible :
deux règles rétrogradées après mesure). Revue datée en section 5.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo cité par la candidature et
  l'usage : les trois contrôles existent au catalogue mais « un brief qui ne les
  demande pas ne les déclenche pas » — le slop constaté sur les rendus (lot TF-0089/
  TF-0090 du 09/08, règles S1-S10 nées de cas réels) revient à chaque produit.
- **O1 — la loi seule au noyau, sans câblage** : coût minimal en octets ; rejetée —
  R-35 : « un contrôle qui existe sans être joué n'existe pas » ; une loi sans gate
  reste un vœu.
- **O2 — le câblage seul (profils + gates), sans loi** : couvre les produits routés
  par profil ; rejetée — un produit hors profil ou un run improvisé y échappe, et la
  règle resterait négociable au brief, ce que la candidature récuse (« sans que le
  brief ait à y penser »).
- **O3 — les trois étages (loi courte au noyau + gates par défaut + lignes standard
  des profils UI)** : coût ≈ 1 jour pilot + ~200 octets de noyau à compenser par
  compression à sens constant ; exclut toute nouvelle construction (les trois oracles
  cités existent et sont prouvés).
- **O4 — renvoyer à forge-organization pour une proposition D-** : rejetée — la
  candidature est déjà instruite et scorée ; un aller-retour n'ajouterait ni preuve
  ni contrôle (« organization organise, pilot pilote » : la disposition revient au
  pilot sous mandat).

## 5. Verdict

- **Option retenue : O3** — loi transverse n° 5 au noyau (formulation courte, coût
  compensé octet pour octet), gates par défaut aux étapes 3 et 5 bis d'`ETAPES-RUN.md`,
  lignes standard « DA dérivée · généricité · baseline » dans les profils UI —
  les six nommés par la candidature plus `mobile.md`, profil UI au même titre
  (loi n° 3 : proposé d'office, écarté explicitement si l'humain le refuse).
- **Coût** : ~1 jour pilot, zéro construction neuve ; noyau : +≈200 octets compensés,
  contrôle `oracle-claude-md` rejoué ; dette : `cat-des-08`/`cat-des-09` restent
  `experimental` — leur passage en `standard` se constatera à l'usage.
- **Candidature(s) émise(s)** : aucune nouvelle — le lot TF-0236..TF-0238 est décidé
  directement (mandat global humain du 15/08).
- **Plan de revue : 2026-09-15** — premier run produit UI après câblage : les gates
  ont-ils joué sans décision humaine ajoutée, l'oracle de généricité a-t-il attrapé
  du slop réel, la baseline a-t-elle été posée ?
