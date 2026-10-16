---
role: synthèse de fin de tour (R-44) — décision D-5 (a) exécutée le 04/09/2026 (TF-0856)
destinataire: humain
sources_de_verite: [todo/TODO.jsonl, git log de digit-ai-forge-agents, oracles de digit-ai-forge-design et du socle digit-ai-page-html]
verifie_le: 2026-09-04
---

# Synthèse — décision 5a du 04/09/2026 : le skill de schémas émet des jetons

Le skill de schémas n'enseigne plus une couleur ni une police en dur : ses cinq gabarits, son exemple de référence et ses canevas passent tous par des jetons nommés, le bandeau latéral qui plafonnait la critique de design a disparu, et le mouvement réduit est respecté. Ce que ça change pour vous : tout schéma produit désormais hérite d'une palette rectifiable en un point, et la critique de design ne rend plus de red flag sur ce skill. Ce qui est attendu de vous : trancher trois désaccords entre les oracles de design et le socle, que ce chantier a mis à nu et qu'aucun skill ne peut résoudre seul ; dire comment réconcilier ce poste avec ce qu'une autre session du pilot vient de publier, car deux numéros de registre ont été frappés deux fois ; et donner le GO de publication de forge-agents.

## 1. En-tête d'identification

- **quoi** : exécution de la décision D-5 (a), chantier TF-0856 chez forge-agents, avec constat en passant TF-0857 ;
- **sur quoi** : digit-ai-forge-agents, skill `digit-ai-schemas` (12 fichiers) ; registre du pilot ;
- **quand** : 2026-09-04, 08:55 Europe/Paris, durée environ 40 minutes ;
- **qui** : Claude Fable 5.1, forge-agents au commit 24308f6, pilot au commit 74f70df.

## 2. Verdict en une ligne

Sur l'exemple de référence, couleurs en dur 239 → 2 (les deux restantes appartiennent au socle), polices en dur 32 → 0, bandeaux latéraux 3 → 0, mouvement réduit posé ; `check_html`, `render_page` (quatre largeurs), lecture tierce et parité des composants PASS ; TF-0856 clos, TF-0857 entré candidat, registre à 11 actifs (4 corrigés) ; à la clôture, pilot divergé `9 4` (une autre session a publié) avec collision de deux numéros, et un lot non ingéré en boîte d'entrée.

## 3. Décisions attendues de l'humain

> **D-6 — Décidez-vous le constat en passant sur les désaccords entre les oracles de design et le socle ?**
> Le sujet est le candidat entré au registre ce matin sous le numéro sept cent quatre-vingt-douze. Après correction complète, la critique de design rend encore FAIL sur ses trois oracles, pour des motifs que le skill de schémas ne peut pas corriger : la police de corps de la charte est bannie comme « police réflexe » par l'oracle de style ; le repli en cartes que le socle prescrit masque l'en-tête de tableau que l'oracle mobile exige ; deux couleurs pures vivent dans un composant du socle que le poseur interdit de retoucher sur place. S'y ajoutent des défauts préexistants des gabarits, mesurés identiques avant et après.
> **Recommandation : (a).** Source consultée : verdicts d'`oracle-slop` S3, `oracle-mobile` M4, `oracle-tokens` T1 sur la copie embarquée, joués le 04/09 ; `check_html` et `composants.md` §6 du socle.
> Parce qu'un oracle qui contredit le socle qu'il juge rend « Refondre » par construction : tant que l'arbitrage n'est pas écrit, chaque page au socle Digit-AI rendra le même faux rouge.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Décider TF-0857 : forge-design et forge-agents arbitrent S3 et M4 (exemption déclarée ou règle amendée), le socle corrige son composant et rejoue le poseur, les gabarits passent les mêmes oracles que l'exemple | Moyen × moyen, chez deux forges | Rien |
| **(b)** Écrire seulement les exemptions S3 et M4 dans les oracles de forge-design | Simple × court | Les gabarits gardent leurs défauts de rendu, le composant du socle ses couleurs pures |
| **(c)** Laisser le candidat au registre | Rien | Toute page au socle Digit-AI rend « Refondre » à la critique de design |

> **Si rien n'est décidé** : (c), TF-0857 reste candidat.

> **D-7 — Comment réconcilier les deux registres, celui de ce poste et celui que l'autre session vient de publier ?**
> Une autre session du pilot, sur un autre poste, a rebâti son clone sur l'histoire réécrite hier et publié neuf commits ce matin : elle y rapporte son travail des 1er et 2 septembre et y décide dix candidatures en bloc. Elle a frappé les numéros sept cent quatre-vingt-onze et sept cent quatre-vingt-douze pour deux sujets qui ne sont pas les miens (cascade d'intention des demandes ; expertise multilingue chez forge-seo-geo), le 1er septembre, avant que ce poste ne les frappe pour les schémas. Ses commits sont publiés ; les miens sont locaux. Ce poste est donc à quatre commits devant et neuf derrière, et son ouverture se déclarera « non prêt ».
> **Recommandation : (a).** Source consultée : `git log HEAD..origin/main`, les événements de création des deux registres (`todo/TODO.jsonl` des deux côtés), `todo/renumeroter.mjs` et sa règle (deux lots sous un même nom ne s'ordonnent pas, classe du 28/08).
> Parce que ce qui est publié ne se réécrit pas une troisième fois, et que mes deux items ne sont référencés que localement, plus un message de commit chez forge-agents qui restera tel quel et sera dit.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Renuméroter mes deux items (TF-0791 → TF-0803, TF-0792 → TF-0804, numéros libres au 04/09 ; réalisé le 07/09 en TF-0856 et TF-0857, numéros libres à cette date) par l'outil, corriger le texte du skill et des synthèses, rebaser mes quatre commits sur la publication de l'autre session, régénérer les vues, puis publier sur GO | Moyen × court ; un commit de plus chez forge-agents ; le message du commit 24308f6 garde l'ancien numéro | Rien |
| **(b)** Renuméroter les items de l'autre session | Réécrire une histoire publiée, une troisième fois | Exclu par la règle de publication : recloner, jamais fusionner |
| **(c)** Ne rien réconcilier | Rien | Deux registres, un poste « non prêt », un lot en boîte d'entrée qui ne peut pas être ingéré proprement |

> **Si rien n'est décidé** : (c), le poste reste divergé et le nouveau lot attend.

## 4. Traité — avec sa preuve

Désignateurs employés ci-dessous, glosés une fois. Règles d'`oracle-tokens` (forge-design) : T0 (aucun jeton déclaré dans la page), T1 (couleur littérale hors bloc de jetons), T2 (police littérale hors bloc de jetons), T3 (espacement hors échelle de quatre points), T5 (contraste texte sur fond non mesuré). Règles d'`oracle-slop` : S1 (bandeau latéral coloré sur un bloc), S3 (police réflexe bannie par impeccable), S6 (emoji employé dans l'interface rendue). Grille de critique : RF3 (red flag du bandeau latéral coloré). Règles d'`oracle-mobile` : M2 (cible tactile plus petite que 44 px), M4 (tableau sans repli en cartes mobile), M5 (aucune règle pour l'orientation paysage), M6 (mouvement réduit non respecté par le style). Mesures de `render_page` : V1 (débordement horizontal hors de la fenêtre), V4 (chevauchement de deux éléments rendus), V7 (rythme d'espacement irrégulier entre blocs), C (contraste insuffisant mesuré au rendu). Classe de défaut de ce chantier : « valeur de charte en dur là où un jeton existe ».

- **Mesure avant** (forge-agents bec13c2) : `oracle-tokens` T1 239 couleurs littérales (173 dans des `style=""` de textes SVG, 66 en CSS), `oracle-slop` S1 3 bandeaux de 3 px (`pre`, encadrés, exemples de lecture), `oracle-mobile` M6 absent ; les cinq gabarits et les six canevas de `references/` prescrivaient les mêmes hexadécimaux (conventions : 67 valeurs en dur, dont les classes SVG de flèches et de nœuds). Le script `render_schema.py` ne fait que rendre l'image : la cause était la doctrine, pas un générateur.
- **Transformation** (deux scripts déterministes, rejoués sur les 12 fichiers) : couleurs → `var(--token)` dans les déclarations CSS, les `style=""` et les attributs SVG `fill=`/`stroke=` (fusionnés dans `style`), neuf jetons nommés et déclarés au `:root` des conventions, des pages et de l'exemple, un jeton de voile pour le modèle de données ; polices → `var(--head/--sans/--mono)` ; `border-left` de 3 à 4 px → bordure fine complète de la même couleur (arbitrage : ban d'impeccable, identité par bordure et teinte) ; bloc `prefers-reduced-motion` du socle ; cible tactile du bouton de réinitialisation 36 → 44 px. Blocs `COMPOSANT-EMBARQUE` non touchés — un premier passage les avait effleurés, le poseur les a reposés depuis le socle (`embarquer-composants --ecrire`, parité PASS).
- **Mesure après, exemple de référence** : `oracle-tokens` T1 2 bloquants (`.tf-btn.tf-on`, `.tf-opts label:hover`, tous deux dans la copie embarquée de `table-filters.css`, asset du socle), T2 0 ; `oracle-slop` 0 bloquant (S1 levé, red flag RF3 levé) ; `oracle-mobile` 0 bloquant (M6 et M2 levés) ; `check_html` PASS ; `render_page` PASS aux quatre largeurs, 0 débordement à 390 px ; `oracle-lecture-tiers` PASS ; `oracle-parite-assets` PASS ; rendu 390 px lu (cartes lisibles).
  - **critique d'implémentation forge-design (`critique-le-design`, mode aval dégradé en critique classique, déclaré)** : red flags 0 (RF3 levé) ; dimensions notées sur les oracles cités : intention 4 (lecture tierce PASS, un emoji S6), système 3 (T1 propre hors socle, 72 écarts T3 d'échelle 4 pt), hiérarchie 3 (avertissements V7 de rythme), accessibilité 3 (`oracle-a11y` PASS, contrastes T5 non mesurés), adaptation 4 (`render_page` PASS, M4 en conflit avec le socle), interaction 3 (M2 levé, filtres masqués sous 640 px), contenu 4 (67 en-têtes glosés) ; moyenne 3,4 → verdict **Renforcer** (≥ 3/5, zéro red flag) ; il rendait Refondre la veille.
- **Mesure après, gabarits** : T1 0 bloquant sur les cinq (les trois fragments rendent T0 « aucun :root » par conception, ils héritent du gabarit multi-bandes) ; S1 0 ; défauts préexistants mesurés identiques avant et après : `render_page` 390 px multi-bandes 9 bloquants V4, modèle de données 18 (V4 11, V1 2, C 5) ; `check_html` FAIL sur les trois fragments et multi-bandes (19, 22, 19, 7 échecs, listes identiques avant/après par `diff`). Consignés en TF-0857.
- **Propagation** : `sync-skills --sync --vers installation` 12 fichiers recopiés, `--diff` aligné ; le relevé d'ouverture du pilot (TF-0788) a rendu « RÈGLES DU SOCLE CHANGÉES — digit-ai-schemas e14fe6941a8d → 9b41892a5c08 ».
- **Découverte à la clôture du tour** : `git rev-list --left-right --count origin/main...HEAD` rend `9 4` — neuf commits publiés par une autre session du pilot depuis le push forcé d'hier (3670336 → 16e425b), dont 36 événements de registre parmi lesquels des créations TF-0856 et TF-0857 datées du 1er septembre, pour d'autres sujets que les miens ; `oracle-boite-entree` rend FAIL : un lot de retours déposé le 03/09 par le produit 03 n'a jamais été ingéré (« sidecar JAMAIS ingéré »). Rien n'est fusionné ni ingéré : les deux gestes dépendent de D-7.
- **Registre** : TF-0856 décidé, en cours, clos avec descente ; TF-0857 entré candidat ; contrôle `oracle-todo` R1-R13 vert avant et vert après chacune des quatre écritures (`journaliser.mjs` refuse l'écriture sinon) ; classe nommée à la clôture : « valeur de charte en dur là où un jeton existe » ; vues régénérées (11 actifs : 6 décidés, 4 corrigés, 1 candidat).

## 5. Non traité — avec son motif

- **Les deux couleurs pures de la copie embarquée de `table-filters.css`** : *garde-fou*, le poseur interdit de retoucher une copie ; c'est l'asset du socle qui doit changer, puis toutes les copies être reposées (TF-0857).
- **Les conflits S3 et M4 entre forge-design et le socle** : *dépendance à une décision humaine*, D-6.
- **Les défauts préexistants des gabarits** (`render_page` V4/C, `check_html` sur les fragments malgré les exemptions annoncées par le skill) : *hors mandat*, D-5 visait couleurs, bandeau et mouvement ; consignés en TF-0857.
- **La publication de forge-agents (24308f6 et bec13c2)** : *gate de gouvernance*, R-38.
- **L'intégration des neuf commits de l'autre session et la renumérotation de mes deux items** : *dépendance à une décision humaine*, D-7 ; une fusion à l'aveugle du registre laisserait deux sujets sous un même numéro.
- **L'ingestion du lot du produit 03 déposé le 03/09** : *dépendance à une décision humaine*, D-7 — l'ingérer avant la réconciliation allouerait un numéro sur un registre qui va bouger.

## 6. Écarts à la lettre

| Vous avez décidé | Ce qui est fait | Pourquoi |
|---|---|---|
| D-5 (a) « le générateur émet des jetons » | Les canevas, gabarits et l'exemple émettent des jetons ; le script de rendu n'a pas changé | `render_schema.py` ne produit aucune couleur : il rend une page en image ; le « générateur » réel est la doctrine que l'agent recopie |
| D-5 (a) parlait des couleurs | Les polices sont passées en jetons aussi (T2, 32 écarts) | Même classe de défaut, même transformation, mesurée par le même oracle |
| D-5 (a) « le bandeau est arbitré » | Bordure fine complète de la même couleur, sur les cinq motifs qui portaient un bandeau | S1 est un ban absolu d'impeccable ; l'identité de couleur est conservée par la bordure et la teinte de fond |

## 7. Risques

- **Un schéma déjà produit à partir des anciens canevas garde ses hexadécimaux.**
  - signal : `oracle-tokens` T1 sur un livrable de schéma antérieur au 04/09.
  - parade : la transformation est un script rejouable ; un produit peut la demander sur mandat.
- **Les fragments sans `:root` rendent T0 chez tout oracle de jetons joué sur eux isolément.**
  - signal : un rouge T0 sur un fragment.
  - parade : SKILL.md le déclare ; le fragment se juge inséré dans le gabarit multi-bandes.
- **Deux sessions du pilot frappent des numéros de registre en parallèle sur deux postes : la collision se reproduira à chaque journée à deux sessions.**
  - signal : `git fetch` qui rend le pilot divergé alors qu'aucun clone mort n'existe plus ; deux créations sous un même numéro dans les deux registres.
  - parade : ouvrir toute session par `bootstrap --pull` (le hook le fait) et publier en fin de tour ; un allocateur de numéros qui lit le distant avant de frapper est une candidature à ouvrir.
- **Une bordure fine remplace le bandeau : la hiérarchie visuelle des encadrés s'affaiblit.**
  - signal : un retour « on ne distingue plus les encadrés » sur un schéma produit.
  - parade : la teinte de fond reste ; un token de bordure plus soutenu est un ajustement d'un jeton, pas d'un motif.

## 8. Prochaines actions

Ordre de traitement : le GO de publication d'abord, parce que deux commits de forge-agents ne vivent que sur ce poste ; puis D-6 ; puis ce qui est hérité.

| # | Identifiant | Action | Acteur | Motif / raison | Exécutable par | Si elle n'est pas faite |
|---|---|---|---|---|---|---|
| **A-18** | `neuve` | Publier forge-agents (bec13c2 et 24308f6) | auto_ia | `gate_gouvernance` : R-38 | `git -C c:/dev/digit-ai-forge-agents push origin main` | Les jetons du skill ne vivent que sur ce poste |
| **A-19** | `neuve` | Réconcilier les registres : renuméroter mes deux items, corriger le texte du skill et des synthèses, rebaser les quatre commits locaux sur la publication de l'autre session, régénérer les vues, rejouer oracle-todo et la porte | auto_ia | `dependance_bloc_3` : D-7 | `node todo/renumeroter.mjs TF-0856 TF-0803 --motif "…"` puis `git rebase origin/main` | Le poste reste divergé, deux sujets partagent un numéro |
| **A-27** | `neuve` | Publier le pilot une fois réconcilié (porte à rejouer avant) | auto_ia | `gate_gouvernance` : R-38, et A-19 avant | `node ~/.claude/skills/quality-oracles/scripts/oracle-nom-client-publie.mjs .` puis `git push origin main` | Les clôtures TF-0788, 0789 et celle des schémas ne vivent que sur ce poste |
| **A-28** | `neuve` | Ingérer le lot de retours du produit 03 déposé le 03/09 (boîte d'entrée FAIL : son sidecar (fichier compagnon du lot, qui porte ses candidatures) n'a jamais été ingéré) | auto_ia | `dependance_bloc_3` : D-7, le registre doit être réconcilié avant d'allouer | `node todo/ingerer-lot.mjs "<lot du produit 03 - 20260903a>"` | Le travail du produit est arrivé et n'est pas pris |
| **A-20** | TF-0857 | Arbitrer S3 et M4 chez forge-design, corriger `table-filters.css` au socle et reposer ses copies, passer les gabarits aux oracles de l'exemple | auto_ia | `dependance_bloc_3` : D-6 | `oracles/oracle-slop.mjs`, `oracle-mobile.mjs` de forge-design ; `digit-ai-page-html/assets/table-filters.css` | Toute page au socle rend un faux rouge à la critique de design |
| **A-21** | `neuve` | Reproduire chez forge-design et forge-audit la consignation d'identité des oracles joués | auto_ia | `hors_mandat` | modèle : `recette/verifier_corpus.py` de forge-tests | Leurs recettes peuvent changer de verdict sans le dire |
| **A-22** | `neuve` | Poser le contrôle pre-commit d'anonymisation dans le pilot | auto_ia | `hors_mandat` : proposé le 03/09, non décidé | `node todo/anonymiser-suivis.mjs --essai` dans `.git/hooks/pre-commit` | Le prochain écrivain à noms réels ne se découvre qu'à la publication |
| **A-23** | TF-0674, TF-0676, TF-0682 | Chez le produit 02, ingérer le lot de travaux du 03/09 et exécuter les trois correctifs | auto_ia | `garde_fou` : le produit exécute ses propres travaux | session chez le produit 02 | La porte de fraîcheur du produit 02 reste sur un échantillon |
| **A-24** | TF-0749 | Comparer les deux campagnes au prochain passage en production d'un produit audité | auto_ia | `dependance_externe` : une campagne réelle | `python recette/non_perte_ciblage.py <projet>` dans forge-tests | Le ciblage par ligne mutée reste éteint sans preuve |
| **A-25** | `neuve` | Ouvrir une session chez chacun des cinq produits équipés le 03/09 : leur hook recopie les artefacts restants et enregistre le lanceur | manuelle_utilisateur | `presence` : la session d'un produit s'ouvre chez lui ; trace mesurée : relevé du 03/09 après pose, 69 manques dont 55 chez ces cinq produits | Les artefacts restent absents jusqu'à leur prochaine ouverture |
| **A-26** | `neuve` | Répondre à D-6 et D-7, et donner le GO des publications A-18 et A-27 | manuelle_utilisateur | `decision` : R-38 et tout entre en candidat | ce message | Deux forges désaccordées continuent de rendre un faux rouge ; le poste reste divergé ; le tour ne vit que sur ce poste |

## 9. Traces

- `c:/dev/digit-ai-forge-agents` 24308f6 : `.claude/skills/digit-ai-schemas/SKILL.md`, `assets/exemple-reference.html`, `assets/template-*.html` (5), `references/conventions-communes.md`, `references/canevas-*.md` (4)
- `todo/TODO.jsonl` (TF-0856 décidé → clos ; TF-0857 candidat), `todo/TODO.md`, `todo/TODO.html`, `todo/AVANCEMENT.md`
- Oracles joués : `c:/dev/digit-ai-forge-design/oracles/oracle-tokens.mjs`, `oracle-slop.mjs`, `oracle-mobile.mjs` ; `~/.claude/skills/digit-ai-page-html/scripts/check_html.py`, `render_page.py` ; `~/.claude/skills/quality-oracles/scripts/oracle-lecture-tiers.mjs`, `oracle-a11y.py`, `oracle-parite-assets.mjs` ; `embarquer-composants.mjs --constat/--ecrire`
- Rendus : `c:/dev/digit-ai-forge-agents/.claude/skills/digit-ai-schemas/assets/.oracles/exemple-reference-w*.png`

## 9. Annotation de réconciliation (07/09/2026)

Cette synthèse a été écrite le 04/09/2026 avec les numéros TF-0791 (jetons de digit-ai-schemas) et TF-0792 (conflits entre oracles de design et socle). La décision D-7 ci-dessus a été exécutée en option (a) le 07/09 : les deux numéros, frappés le 01/09 par l'autre session du pilot pour d'autres sujets, sont réécrits en TF-0856 et TF-0857 par `todo/renumeroter.mjs` (premiers numéros libres au distant, dont le registre atteignait TF-0855), motif consigné dans chaque événement de création ; le message du commit forge-agents 24308f6 garde l'ancien numéro, comme l'option le prévoyait. Rien d'autre n'a changé.
