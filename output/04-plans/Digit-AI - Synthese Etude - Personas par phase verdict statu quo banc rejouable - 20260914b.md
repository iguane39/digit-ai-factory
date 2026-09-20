---
destinataire: humain
---

# Synthèse Étude — personas par phase : aucun persona ne franchit le seuil fixé d'avance, six défauts échappés sur neuf ne sont vus par aucune relecture ; statu quo retenu sous réserve, un banc rejouable proposé ; deux décisions vous attendent (14/09/2026)

L'étude que vous avez lancée ce matin est rendue. Elle a été mesurée, pas seulement argumentée. Neuf défauts réels, trouvés par vous ou par un client après que les contrôles automatiques avaient dit « vert », ont été relus quatre fois : une fois sans persona, trois fois avec le regard d'un exploitant, d'un utilisateur final et d'un mainteneur. Aucun de ces regards ne fait assez mieux que la relecture simple pour justifier d'être construit. Six défauts sur neuf n'ont été vus par personne. Ils ne se lisent pas : ils se constatent en exécutant ou en affichant. Ce qui change pour vous : aucun mécanisme de personas n'est à construire, et le levier contre ces défauts reste les contrôles exécutés. Ce qui est attendu de vous : adopter ce verdict, ou demander une mesure plus large, puis dire si l'on garde ce jeu de défauts comme banc d'essai pour juger toute future proposition du même genre.

## 1. En-tête d'identification

- **quoi** — exécution de l'étude d'opportunité « personas par phase » sur la décision D-1 (a) du 14/09/2026 (« 1a ») : protocole figé, échantillon de défauts échappés, reconstitution des livrables, relecture de référence, trois fiches de persona, trois relectures avec persona, jugement à l'aveugle, étude au gabarit, une candidature au registre.
- **sur quoi** — le pilot `digit-ai-factory`, seul dépôt écrit ; lectures seules sur `digit-ai-forge-audit`, `digit-ai-forge-agents` et deux dépôts produits désignés par leur pseudonyme ; livrables reconstitués dans l'espace temporaire de la session, hors de tout dépôt.
- **quand** — 2026-09-14 10:38 UTC+02:00 (Europe/Paris) ; première mesure d'horloge de l'exécution 09:12:24 (protocole figé) ; durée mesurée ≥ 1 h 26 min.
- **qui** — pilot `a3cde26` (aucun enregistrement fait) ; session Opus 5 ; neuf sessions déléguées au modèle Sonnet (défaut de routage du contrat d'interface §4), 1 920 959 tokens délégués ; escalade de modèle : aucune.

## 2. Verdict en une ligne

**Statu quo retenu, sous réserve : rappel de la relecture de référence 2/9, des personas 1/9, 3/9 et 3/9 pour un seuil fixé d'avance à 4/9 ; 6/9 défauts vus par aucune relecture ; 215 constats jugés sur 216 ; `oracle-etude-opportunite` PASS 10/10, `check_markdown.py` PASS sur les 7 fichiers de l'étude ; TF-1073 ingérée en candidat ; 0 enregistrement, 0 push.**

## 3. Décisions attendues de l'humain

L'étude a mesuré si un regard de partie prenante (exploitant, utilisateur final, mainteneur), donné à un agent qui relit un livrable, retrouve plus de défauts échappés qu'une relecture sans rôle. Le seuil a été fixé avant la mesure, et la mesure a été jouée à l'aveugle ; il reste à dire si l'on adopte ce qu'elle donne, et ce que l'on fait de l'outil de mesure lui-même.

> **D-2 — Adoptez-vous le statu quo pour les personas, c'est-à-dire ne construire aucune fiche, grille ni skill de personas par phase ?**
>
> Aucune des trois relectures avec persona n'atteint le seuil fixé à 09:12, avant tout résultat : 4 livrables sur 9, sans dépasser le double des constats faux de la référence. La meilleure en retrouve 3, la référence 2. Le seul gain porte sur la synthèse de fin de tour, et il repose sur deux étiquettes où le juge a lui-même hésité. Le verdict est sous réserve : 9 livrables, un seul juge, fiches sans corpus, phase de tests absente.
>
> **Recommandation : (a).** Source consultée : `output\03-etudes\20260914-etude-opportunite-personas-par-phase.md` sections 4 et 5 (mesure et options), `output\03-etudes\20260914-personas-mesure-protocole.md` section 5 (seuil figé), et la loi du registre `experts-forge` (`SKILL.md` l. 17 : « Un expert qui ne change pas matériellement une réponse n'est pas un expert »), qui refuserait d'elle-même ces fiches sur ces chiffres. Une mesure plus large coûterait une campagne entière pour trancher un gain d'au plus un livrable.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** adopter le statu quo : aucun persona construit, le verdict du 13/08 étendu à la couverture des défauts | effort nul | exclut tout regard de partie prenante outillé, jusqu'à ce qu'un banc le justifie |
| **(b)** commander une seconde mesure plus large avant de trancher : davantage de défauts dont la phase de tests, un second juge, fiches avec corpus daté d'avant les défauts | effort complexe × moyen, de l'ordre de la campagne de ce matin (1,9 million de tokens délégués) | exclut une décision dans ce tour |
| **(c)** construire quand même les trois fiches de point de vue dans `experts-forge`, contre la mesure | effort moyen × court, plus environ 180 000 tokens par relecture et par phase | exclut la règle d'admission du registre, que ces fiches ne passent pas |

> **Si rien n'est décidé** : l'effet est celui de (a) sans être acté — aucun persona n'est construit, et l'étude reste en instruction.

> **D-3 — La candidature qui propose de garder ce jeu de défauts échappés comme banc d'essai rejouable est-elle acceptée ?**
>
> La mesure a coûté 1,9 million de tokens, dont l'essentiel serait à refaire pour chaque future proposition de relecture : retrouver les défauts, reconstituer les livrables dans leur état d'avant correction, contrôler que rien ne trahit le défaut, juger à l'aveugle. La candidature propose de conserver cet ensemble et d'exiger qu'un mécanisme de relecture passe ce banc avant d'être adopté. Deux points sont à trancher avec elle : les livrables reconstitués portent du contenu produit sous pseudonyme, donc leur rangement doit respecter la confidentialité ; et sa classe au registre (« règle neuve sans mesure de bruit ») est un rattachement au plus proche, que l'ingestion a signalé comme classe suspecte.
>
> **Recommandation : (a).** Source consultée : `references\TODO-FORGE.md` (« tout entre en candidat, décision humaine, clôture sur gains constatés ») et le constat de l'étude section 4 : la reconstitution et le contrôle des fuites sont la part la plus chère de la mesure, et la seule qu'un banc supprime. Aucune source ne tranche le lieu de rangement confidentiel : c'est la question que (a) vous pose.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** accepter : banc versionné dans le pilot (protocole, échantillon, relectures, jugement), livrables reconstitués rangés dans le canal confidentiel sur votre mandat pour ce dépôt | effort moyen × court (rangement, script de jugement versionné, règle d'usage) | exclut toute adoption d'un mécanisme de relecture sans passage au banc |
| **(b)** accepter sans les livrables reconstitués : seuls protocole, échantillon, relectures et jugement sont gardés | effort simple × court | exclut le rejeu direct : chaque future mesure refait la reconstitution |
| **(c)** laisser en candidat | effort nul | exclut le banc : les livrables reconstitués disparaissent avec l'espace temporaire de cette session |

> **Si rien n'est décidé** : l'option (c) s'applique — TF-1073 reste en candidat, et les livrables reconstitués sont perdus à la fin de la session.

## 4. Traité — avec sa preuve

- **L'étude est rendue au gabarit, avec sa mesure en annexe, et passe ses deux oracles au premier jugement.**
  - preuve : `output\03-etudes\20260914-etude-opportunite-personas-par-phase.md` ; `node oracles\oracle-etude-opportunite.mjs` → PASS, dix règles E1 à E10 (sections du gabarit, citations, sources datées, jeu fermé, verdict unique, termes subjectifs, plan de revue, effort, intention, test rétro) ; `check_markdown.py` → PASS, exit 0.
- **La mesure a suivi un ordre horodaté qui rend la ligne de base indépendante des fiches.**
  - preuve : protocole figé 09:12 (`fige_le`), échantillon indexé 09:27:00, relecture de référence `stat` 10:04:21, fiches `stat` 10:06:15, passes `stat` 10:17:59 ; les sept fichiers de mesure et d'étude passent `check_markdown.py`.
- **Le jugement est anonymisé et décompté par script, le seuil appliqué mécaniquement.**
  - preuve : `construire-jugement.mjs` → `decompte {"B":43,"X":54,"U":63,"M":56} total 216` ; `decompter-jugement.mjs` → `seuil_rappel 4/9`, `plafond_faux 2`, rappels 2/9, 1/9, 3/9, 3/9, `retenu : non` pour les trois personas, `constats jugés au total : 215`.
- **Trois fuites de défaut dans les livrables reconstitués ont été trouvées et traitées avant toute relecture** — classe : fuite du défaut dans le livrable relu, que le contrôle de l'agent reconstituteur n'avait pas vue.
  - preuve : contrôle rouge — recherche de mots révélateurs trouvant une phrase sur l'identité des deux logos, un en-tête décrivant la contradiction d'un rapport, une note de contraste reprise d'un retour ; contrôle vert — `grep -c` de la formule sur le fichier des logos → `0` ; un livrable retiré de la mesure, consigné dans l'échantillon.
- **La porte des noms est tenue sur tout ce qui entre au pilot.**
  - preuve : `grep -c -i -E` de cinq noms de lieu et du nom du produit → `0` sur les sept fichiers du jour ; deux noms de lieu remplacés dans la passe de l'utilisateur final, déclarés en frontmatter.
- **La candidature du banc est au registre en candidat** (TF-1073).
  - preuve : `node todo\ingerer-lot.mjs … --sans-fetch` → « [OK] 1 candidature(s) ingérée(s) en CANDIDAT (lot 173575e0a3f0) », un avertissement « CLASSE SUSPECTE » ; `node todo\oracle-todo.mjs` → exit 0 ; `generer-page.mjs` → « 291 items, 21 forges » ; `generer-recidives.mjs` → « 74 classe(s), 129 récidive(s) ».
- **Tout est indexé, rien n'est enregistré ni poussé.**
  - preuve : `git status -s` → `A` sur les sept fichiers de `output\03-etudes\` et sur le sidecar de `input\01-candidatures\`.

## 5. Non traité — avec son motif

- La construction du banc rejouable (TF-1073) — motif : dépendance à une décision humaine (D-3), et le rangement des livrables reconstitués touche un dépôt frère, qui demande votre mandat.
- La phase de tests dans l'échantillon — motif : impossible à prouver ici ; son seul candidat n'avait pas de livrable relisable sans révéler le défaut.
- Le persona-utilisateur simulé et le mode opératoire de l'agent — motif : impossible à prouver ici ; aucun des deux ne se rejoue sur des fichiers archivés, ils sont instruits par la littérature seule.
- L'enregistrement et le push — motif : bloqué par un garde-fou, R-38 §4 (publication d'un livrable sur GO humain), et la consigne de session n'enregistre rien sans demande.
- Un constat sur 216 non étiqueté par le juge (le sixième du mainteneur sur les logos) — motif : écarté ; il ne peut pas changer le verdict, le mainteneur ayant déjà retrouvé ce défaut, et un constat faux de plus le laissant sous le plafond.

## 6. Écarts à la lettre

- **Le prompt demandait** 10 défauts → **j'ai mesuré** 9 livrables → **pourquoi** : un livrable ne se relisait qu'à travers des fragments choisis autour du défaut ; le protocole figé prévoyait ce cas (seuil à la même proportion, verdict sous réserve).
- **Le prompt demandait** des fiches « sur le modèle des fiches experts-forge », qui exigent un corpus → **j'ai fait** des fiches fondées sur le seul rôle → **pourquoi** : une partie de la doctrine de la factory est née de ces défauts mêmes ; la donner en corpus les aurait fait retrouver par la connaissance après coup.
- **Le prompt demandait** au moins trois phases, sans exclure les tests → **j'ai couvert** conception, design, développement, mise en production et restitution, sans les tests → **pourquoi** : aucun défaut de tests n'avait de livrable relisable.
- **Le contrat interdisait** tout fichier écrit hors `output\03-etudes\` et `input\01-candidatures\`, et **exigeait aussi** la candidature « ingérée en candidat » → **j'ai ingéré**, ce qui écrit le registre et ses vues sous `todo\` → **pourquoi** : les deux clauses du prompt que j'ai moi-même réécrit se contredisaient ; l'ingestion est le seul chemin vers une décision humaine, et c'est celui du mode opératoire du registre.
- **J'avais annoncé** 223 constats → **le décompte machine en donne** 216 → **pourquoi** : un constat de la référence se déclare lui-même « non retenu », et mon compte à la lecture était faux.

## 7. Risques

- Le verdict repose sur un seul juge, du même modèle que les relecteurs, et tout le gain observé tient à deux étiquettes hésitantes ;
  - signal : un second juge qui classe autrement ces deux constats de la synthèse de fin de tour ;
  - parade : D-2 (b) le rejoue ; en l'état, le verdict est déclaré sous réserve dans l'étude et ici.
- Les livrables reconstitués vivent dans l'espace temporaire de la session et disparaîtront avec elle ;
  - signal : le dossier des livrables absent à la prochaine ouverture ;
  - parade : D-3 (a) les range sur votre mandat ; à défaut, la reconstitution (505 814 tokens) serait à refaire.
- La classe retenue pour TF-1073 est comptée par la contre-métrique du tableau de bord comme classe suspecte ;
  - signal : la ligne « classe suspecte » du tableau de bord du registre ;
  - parade : D-3 valide le rattachement, ou fait créer une classe propre, datée et sourcée.
- Huit fichiers indexés et non enregistrés peuvent être emportés par l'enregistrement d'une autre session du pilot ;
  - signal : un enregistrement d'une autre session contenant `20260914-etude-opportunite-personas-par-phase.md` ;
  - parade : A-2 les enregistre avec `git commit --only` sur votre feu vert ; le contenu resterait intact dans tous les cas.

## 8. Prochaines actions

Ordre du tableau : les actions de l'IA d'abord (tri par acteur), la journalisation des décisions avant le banc qu'elle déclenche, le push en dernier parce qu'il attend un feu vert distinct ; puis les actions humaines, dans l'ordre des décisions qu'elles tranchent.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-5 | Journaliser D-2 et D-3 par `node todo\journaliser.mjs`, décider TF-1073, régénérer les vues et rejouer `node todo\oracle-todo.mjs` (TF-1073) | auto_ia | `dependance_bloc_3` — attend D-2 et D-3 ; à défaut, l'étude reste en instruction et TF-1073 en candidat | simple × court |
| A-6 | Construire le banc rejouable : versionner protocole, échantillon, relectures et scripts de jugement dans le pilot, ranger les livrables reconstitués selon D-3 (TF-1073) | auto_ia | `dependance_bloc_3` — attend D-3 (a) ou (b) ; à défaut, les livrables reconstitués sont perdus à la fin de la session | moyen × court |
| A-2 | Enregistrer localement les sept fichiers de l'étude, le sidecar (fichier de candidature), cette synthèse et les index par `git commit --only -- <chemins>`, puis pousser le pilot, porte des noms rejouée par le hook avant envoi (neuve) | auto_ia | `gate_gouvernance` (un feu vert humain conditionne le geste) — attend A-4 ; à défaut, tout reste indexé en local | simple × court |
| A-7 | Trancher D-2 — répondre « D-2 (a) », « D-2 (b) » ou « D-2 (c) » (neuve) | manuelle_utilisateur | `decision` — adopter un verdict d'étude est humain (`references\TODO-FORGE.md`) ; sinon : aucun persona construit, l'étude reste en instruction | simple × court |
| A-8 | Trancher D-3 — répondre « D-3 (a) », « D-3 (b) » ou « D-3 (c) » ; pour (a), votre réponse vaut mandat de rangement dans le canal confidentiel (TF-1073) | manuelle_utilisateur | `decision` — la décision sur un candidat est humaine, et l'écriture dans un dépôt frère exige un mandat ; sinon : TF-1073 reste en candidat | simple × court |
| A-4 | Donner le feu vert d'enregistrement et de publication — répondre « enregistre et pousse » ou « enregistre seulement » (neuve) | manuelle_utilisateur | `decision` — R-38 §4 ; sinon : les fichiers restent indexés, non enregistrés | simple × court |

## 9. Traces

- Étude : `output\03-etudes\20260914-etude-opportunite-personas-par-phase.md`
- Mesure : `output\03-etudes\20260914-personas-mesure-protocole.md`, `…-echantillon.md`, `…-baseline.md`, `…-fiches.md`, `…-passes.md`
- Analyse L99 (analyse de prompt en huit couches) d'origine : `output\03-etudes\20260914-L99-personas-par-phase.md`
- Candidature : `input\01-candidatures\personas-banc-defauts-echappes-20260914a.tf.jsonl` (lot 173575e0a3f0, TF-1073) ; registre `todo\TODO.jsonl`, sa page générée et `todo\RECIDIVES.md` (vues régénérées, pas des livrables)
- Scripts de jugement et livrables reconstitués : espace temporaire de la session (`construire-jugement.mjs`, `decompter-jugement.mjs`, `jugement\`, `livrables\`)
- Oracles : `oracle-etude-opportunite.mjs` (PASS), `check_markdown.py` (PASS sur les sept fichiers), `todo\oracle-todo.mjs` (exit 0), `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour.
