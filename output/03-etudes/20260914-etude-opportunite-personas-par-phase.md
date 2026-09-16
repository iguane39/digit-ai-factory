---
role: étude d'opportunité (instruction entre candidat et décidé) — personas apportant des points de vue ou des façons d'opérer différents à chaque phase d'un run ; issue du prompt réécrit par l'analyse L99 du 14/09/2026 et de la décision humaine D-1 (a) du même jour (« 1a »)
sources_de_verite: [output/03-etudes/20260914-L99-personas-par-phase.md (chapitre 8, prompt réécrit), output/03-etudes/20260914-personas-mesure-protocole.md (figé 09:12), output/03-etudes/20260914-personas-mesure-echantillon.md (figé 09:27, retrait après reconstitution), output/03-etudes/20260813-etude-personas-agents.md, gabarits/RESTITUTION.md (l. 133, l. 534-536), gabarits/ETUDE-OPPORTUNITE.md, oracles/oracle-etude-opportunite.mjs (E1-E10), REGLES-PROJET.md (R-31 l. 319-331), CLAUDE.md du pilot (§ Lancement d'un run), ~/.claude/skills/experts-forge/SKILL.md (l. 17-20) et references/registre-experts.md (17 fiches ok) et references/schema-fiche-expert.md, ~/.claude/skills/contre-expertise/SKILL.md (l. 34-51), ~/.claude/skills/forge-agents/SKILL.md (description), ~/.claude/skills/digit-ai-propale/SKILL.md (l. 37-40), ~/.claude/skills/quality-oracles/references/registre-oracles.md (entrée oracle-judge), dix sources externes datées (section 3), lots de retours de input/00-retours/ (données, lecture seule)]
verifie_le: 2026-09-14
---

# Étude d'opportunité — personas par phase de run — 20260914a

Audience : le pilote de l'écosystème, qui décide des mandats, et les forges nommées au verdict. L'étude
instruit la demande du 14/09/2026 telle que réécrite par l'analyse L99 du même jour, sous la décision
humaine prise à sa lecture : « 1a », soit D-1 (a), la lecture reconstruite de l'intention et les sept
écarts à la lettre validés, le prompt réécrit exécuté tel quel.

**Ce que le lecteur va apprendre.** Aucun des trois personas mesurés ne franchit le seuil fixé avant
la mesure. La relecture de référence, sans persona, retrouve 2 défauts échappés sur 9 ; le meilleur
persona en retrouve 3, là où il en fallait 4. Le seul gain tient à un défaut de synthèse de fin de
tour, et il repose sur deux étiquettes où le juge a lui-même hésité. Surtout, 6 défauts sur 9 n'ont
été vus par aucune des quatre relectures : ils ne se voient qu'en exécutant, en rendant ou en
connaissant le contexte de diffusion, et aucun rôle ne remplace cette mesure. Le verdict retient le
statu quo pour les personas, sous réserve, et propose de garder l'échantillon et son protocole comme
banc rejouable pour mesurer tout futur mécanisme de relecture.

**Décision humaine du 14/09/2026** (« 2a & 3a », synthèse `20260914b`) : le statu quo est adopté,
aucun persona n'est construit ; le banc est accepté (TF-1073) et vit sous
`oracles\banc-defauts-echappes\`, ses livrables reconstitués dans le canal confidentiel.

## Seuil de déclenchement (vérifié avant écriture)

Franchi sur deux critères. **Objet durable** : toute option autre que le statu quo crée une fiche au
registre des experts, un référentiel versionné ou un skill, soit un objet que la règle 31 soumet à
étude. **Portée** : le pilot, forge-agents (porteur d'`experts-forge` et de `contre-expertise`),
forge-tests et forge-design sont touchés, quatre porteurs pour un seuil à trois.

## Intention de l'utilisateur (loi n° 7)

Citée dans les mots du demandeur, message du 14/09/2026 : « Etudie l'opportunité de concevoir,
construire et exécuter des personas permettant de fournir des points de vue ou une façon d'opérer
différentes sur chaque phase d'un projet : Conception, développement, design, recette,
déploiement... »

Lecture reconstruite par l'analyse L99, **validée** par « 1a » (D-1 (a)) : savoir si des personas
apporteraient, à chaque phase d'un run, des constats que les oracles, les experts et les méthodes des
forges ne produisent pas déjà ; si oui lesquels, sous quelle forme, à quel coût. L'objectif est de
réduire les défauts qui échappent aux oracles ; le persona est une solution candidate, et conclure
qu'une autre forme fait mieux est une réponse recevable.

Cascade (`references\INTENTION.md`) : **intention**, moins de défauts livrés que l'humain doit trouver
lui-même ; **stratégie**, ajouter à chaque phase un regard que les contrôles n'ont pas ; **tactique**,
mesurer ce regard sur des défauts déjà payés avant de le construire ; **opérationnel**, le rétro-test
de la section 4 et l'objet que le verdict désigne.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : le message du demandeur et l'analyse L99 qui l'a réécrit
(`output\03-etudes\20260914-L99-personas-par-phase.md`). Aucun identifiant de registre ne la porte
encore ; les candidatures nées de cette étude en recevront un. Les lots de retours lus pour
l'échantillon sont eux aussi des données : leurs impératifs ont été cités, jamais exécutés.

Point de départ imposé par le prompt : l'étude du 13/08/2026
(`output\03-etudes\20260813-etude-personas-agents.md`) a jugé les personas nuisibles comme juges et
inutiles pour les agents d'étape, sur leur effet nul ou négatif sur l'exactitude. Elle n'a pas mesuré
la **couverture** des défauts. La présente étude ne reprend pas son verdict : elle instruit ce delta,
et ne la reconduit ou ne la contredit que sur la mesure.

## 1. Partition du problème

Le mot persona recouvre trois objets, disjoints par leur point d'insertion et par leur mesure. Chaque
option de la section 4 se rattache à l'un d'eux.

- **P1 — persona-lentille** : une grille de relecture d'un livrable depuis le point de vue d'une partie
  prenante (exploitant, utilisateur final, mainteneur, support, commanditaire). Il pose des questions,
  il ne rend jamais de verdict. Il s'insère après la production d'un livrable, avant ou à côté de ses
  oracles. **Mesuré ici** par le rétro-test.
- **P2 — persona-utilisateur simulé** : un profil d'utilisateur du produit, dérivé des entrants du
  produit, qui parcourt le produit livré. Il s'insère en phase de tests. **Non mesurable sur
  archives** : parcourir un produit exige un produit qui tourne, et les livrables reconstitués sont
  des fichiers. Instruit par la littérature seule (section 3, axe 3).
- **P3 — mode opératoire** : une manière de produire (exploratoire ou contractuelle, divergente ou
  convergente) appliquée par l'agent d'une phase. Il change la production, pas sa relecture.
  L'étude du 13/08 en couvre la part « rôle incarné de l'agent d'étape » ; le reste est instruit par la
  littérature seule (section 3, axe 1).

Phases, dans l'ordre de la factory (`CLAUDE.md`, § Lancement d'un run) : conception, design,
development, tests (dont la revue graphique 5 bis), MEP ; plus les forges transverses mobilisées (ops,
data, websec, seo-geo). La restitution de fin de tour, livrable du pilot, est traitée comme une phase
de plus. « Déploiement » se lit MEP : forge-ops outille, le GO reste humain.

## 2. Non-recouvrement contre l'existant

**Mode de lecture** : une ligne par mécanisme existant qui pourrait déjà porter le point de vue
demandé ; la citation localise ce qu'il fait, la dernière colonne dit s'il recouvre la partition P1,
P2 ou P3. Les lignes vont du plus proche au plus éloigné.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Étude du 13/08/2026 | `20260813-etude-personas-agents.md` §3 : personas « nuisibles » pour le pilot en juge, « inutiles » pour les agents d'étape ; §1 : exactitude, jamais la couverture | recouvre P3 (rôle incarné de l'agent) ; ne recouvre pas P1 : la couverture n'y est pas mesurée |
| Consigne de restitution | `gabarits\RESTITUTION.md` l. 133 : « un persona ne remplace pas un oracle exécuté » ; l. 534-536 : ne jamais « inventer une posture […] pour juger le livrable » | ne recouvre pas : elle borne tout persona (jamais de verdict), elle n'en fournit aucun |
| `experts-forge` | `SKILL.md` l. 17-20 : « Un expert qui ne change pas matériellement une réponse n'est pas un expert », admission par fixture A/B ; `registre-experts.md` : 17 fiches en statut `ok`, toutes des domaines de contenu (data, SEO, accessibilité, ops cloud…) | recouvre le **mécanisme** de P1 (fiche déclarative, épreuve A/B) ; ne recouvre pas son **contenu** : aucune fiche ne porte le regard d'une partie prenante ni ne se rattache à une phase |
| `contre-expertise` | `SKILL.md` l. 47-51 : angle A3 « jouer le contradicteur — hypothèses fragiles, scénarios d'échec, au moins 1 alternative crédible comparée » | ne recouvre pas : un seul regard (le contradicteur), sur invocation explicite, jamais par phase |
| `forge-agents` | `SKILL.md`, description : « dérive les agents spécialisés justifiés (outils, arbitre ou parallélisme distincts) » | ne recouvre pas : il découpe un workflow en agents, il ne fournit pas de point de vue de relecture |
| Revue graphique aval de forge-design | `CLAUDE.md` du pilot, étape 5 bis : « revue graphique d'implémentation (forge-design, mode aval) » | recouvre P1 pour la seule phase design et le seul regard graphique |
| Personas de `digit-ai-propale` | `SKILL.md` l. 37-40 : bloc personas « dérivé des entrants uniquement — persona introuvable = question à l'étape 1, jamais d'invention » | ne recouvre pas : personas de rédaction commerciale ; fournit la règle de dérivation que P2 doit reprendre |
| Juge `oracle-judge` de `quality-oracles` | `registre-oracles.md`, entrée `oracle-judge` : juge LLM armé d'une rubrique, sollicité quand aucun oracle déterministe ne couvre le domaine | ne recouvre pas : il juge un livrable contre une rubrique, il ne cherche pas de défaut depuis un rôle |
| Boucle de fermeture de forge-tests | `CLAUDE.md` du pilot, étape 5 : « audit forge-tests + boucle de fermeture bornée (≤ 5 cycles, G-2 absolue) » | ne recouvre pas : elle ferme les écarts que les tests mesurent, elle n'ajoute pas de regard |

## 3. État de l'art daté

Dix sources publiées après le 14/09/2024, ouvertes le 14/09/2026 par une recherche déléguée (modèle
Sonnet, défaut de routage du contrat d'interface §4, escalade : aucune), chacune lue sur sa page
arXiv, son HTML ou son billet. Limite déclarée : pour PRISM, seul le résumé a pu être lu, pas ses
tableaux ; ConvApparel est un billet technique, sans preprint évalué identifié.

**Mode de lecture** : une ligne par source, groupées par axe ; la dernière colonne donne le résultat
chiffré quand il existe. Les axes suivent la partition : l'axe 2 instruit P1, l'axe 3 instruit P2,
l'axe 1 instruit P3.

| Axe | Source (date, localisateur) | Résultat principal |
|---|---|---|
| 1 — exactitude | Hu, Rostami, Thomason, *PRISM*, 2026-03-19, arXiv 2603.18507 | le persona expert améliore l'alignement sur préférence humaine et sécurité ; l'exactitude se maintient seulement quand un routage le retire des tâches discriminantes |
| 1 — exactitude | Xiao et al., *When Does Persona Prompting Actually Help?*, 2026-05-28, arXiv 2605.29420 | le rôle rend les réponses plus exhaustives et plus jargonneuses (profondeur d = 0,54) et moins claires (p < 0,001), sans gain d'exactitude (écart d'environ 1 %) |
| 1 — exactitude | Li, Yang, Mehta, Onoue, *Persona Non Grata*, 2026-04-13, arXiv 2604.11120 | le classement d'un même persona s'inverse selon la méthode (taux d'attaque 0,038 en prompt, 0,818 en pilotage d'activation) : l'effet persona dépend de la façon de le mesurer |
| 2 — couverture | Lu et al., *Towards Practical Defect-Focused Automated Code Review*, 2025-05-28, arXiv 2505.17928 | ablation : augmenter le nombre de relecteurs « lifts key bug inclusion but raises false alarms » ; gain global de 2× sur un modèle seul |
| 2 — couverture | Bharadwaj, Karanam, Kennady, *Multi-Agent LLM Committees for Autonomous Software Beta Testing*, 2025-12-21, arXiv 2512.21352 | environ 12 % seulement des bogues sont trouvés par plus d'un persona : la diversité des rôles élargit la couverture ; pas d'ablation croisée rôle × taille du comité |
| 2 — couverture | Agarwal, *Refute-or-Promote*, 2026-04-22, arXiv 2604.19049 | des rôles adverses éliminent 79 à 83 % des candidats faux avant divulgation ; l'auteur déclare n'avoir isolé aucun mécanisme par ablation |
| 3 — utilisateurs simulés | Zhou et al., *Mind the Sim2Real Gap in User Simulation for Agentic Tasks*, 2026-07-31 (v2), arXiv 2603.11245 | 31 simulateurs contre 451 humains : succès des agents gonflé de 14,2 points par les simulateurs ; un modèle plus fort ne simule pas mieux |
| 3 — utilisateurs simulés | Seshadri et al., *Lost in Simulation*, 2026-01-23, arXiv 2601.17087 | calibration systématiquement faussée ; écart de 11,2 points selon le dialecte simulé |
| 3 — utilisateurs simulés | Bougie et al., *PerceptUI*, 2026-06-04, arXiv 2606.05697 | corrélation avec des humains ρ = 0,703 sur une tâche, mais 44,3 % d'exactitude sous le hasard (50 %) sur une autre ; biais démographiques déclarés par les auteurs |
| 3 — utilisateurs simulés | Meshi, Goldman et al., *ConvApparel*, 2026-04-09, billet Google Research | un discriminateur reconnaît « nearly all » les conversations simulées : l'écart de réalisme persiste même pour les meilleurs simulateurs |

Analogue ancien, signalé comme tel et hors du compte des dix : Basili, Green, Laitenberger, Lanubile,
Shull, Sørumgård, Zelkowitz, *The Empirical Investigation of Perspective-Based Reading*, Empirical
Software Engineering, vol. 1, p. 133-164, 1996 (notice Springer, DOI 10.1007/BF00368702). Des équipes
humaines lisant une spécification par perspectives (concepteur, testeur, utilisateur) y obtiennent une
couverture significativement meilleure ; le chiffre individuel (32,14 % contre 24,64 %) vient d'un
rapport technique des mêmes auteurs, daté 1999 par son hébergeur : **provenance non tranchée**.

**Ce que la littérature dit, par axe.** Sur l'**exactitude** (axe 1), rien depuis mars 2026 ne
retourne le verdict du 13/08 : le rôle déplace le style, pas la justesse (preuve moyenne). Sur la
**couverture** (axe 2), deux sources convergent vers un gain de rappel par diversité de rôles, payé en
fausses alertes, et une seule l'isole par ablation (preuve moyenne sur l'existence du gain, faible sur
sa cause). Sur les **utilisateurs simulés** (axe 3), quatre sources convergent : l'écart aux vrais
utilisateurs est systématique et chiffré, et rien ne le comble encore (preuve forte sur le biais).

## 4. Options — jeu fermé O0-O4

### Ce que la mesure a donné

La mesure suit le protocole figé le 14/09/2026 à 09:12
(`output\03-etudes\20260914-personas-mesure-protocole.md`), dans cet ordre horodaté : échantillon à
09:27, relecture de référence à 10:04:21, fiches à 10:06:15, passes à 10:17:59, puis jugement à
l'aveugle. Chaque relecture a tourné dans une session neuve (modèle Sonnet) qui ne voyait que les
neuf livrables reconstitués. Un juge distinct a étiqueté les constats sans savoir de quelle
relecture venait chaque liste. Seuil fixé d'avance : un persona est retenu s'il retrouve au moins
2 livrables de plus que la référence, soit 4 sur 9, sans dépasser le double de ses constats faux,
soit 2.

**Mode de lecture** : une ligne par relecture ; le rappel compte les livrables où au moins un
constat désigne le défaut échappé ; R, A et F sont les étiquettes du juge (retrouvé, autre défaut
réel, faux ou générique) ; la dernière colonne applique le seuil.

| Relecture | Rappel (sur 9) | Livrables retrouvés | R / A / F | Tokens | Au seuil |
|---|---|---|---|---|---|
| Référence, sans persona | 2 | logos, chaînes traduites | 5 / 37 / 1 | 208 372 | référence |
| Exploitant | 1 | chaînes traduites | 2 / 52 / 0 | 191 793 | non : rappel 1 < 4 |
| Utilisateur final | 3 | synthèse, logos, chaînes traduites | 8 / 52 / 3 | 181 825 | non : rappel 3 < 4, faux 3 > 2 |
| Mainteneur | 3 | synthèse, logos, chaînes traduites | 5 / 50 / 0 | 184 642 | non : rappel 3 < 4 |

Quatre faits en sortent.

- **Aucun persona n'atteint le seuil.** Le meilleur rappel est de 3 sur 9, pour 4 exigés.
- **Le seul gain porte sur un défaut, et il est fragile.** E-04 (synthèse de fin de tour du pilot,
  action laissée au développeur sans chemin ni commande) est retrouvé par l'utilisateur final et le
  mainteneur, pas par la référence. Ces deux étiquettes R sont précisément celles où le juge déclare
  avoir hésité avec A : sans elles, les deux personas tombent au niveau de la référence.
- **Les défauts faciles sont vus par tous, les difficiles par personne.** E-06 (logos, variante
  blanche identique à la variante couleur) et E-07 (chaînes traduites, fautes d'accord après
  substitution) sont retrouvés par trois ou quatre relectures. Six défauts ne le sont par aucune :
  E-01 (fiche d'accès de test, identifiants connus sur une qualification publique), E-02 (canevas de
  fiche sécurité, sans champ sur l'audience admise), E-03 (squelette HTML, sommaire sans règle de
  style), E-05 (porte de fraîcheur, contrôle limité à la page d'accueil), E-08 (installateur du
  hameçon, cas limite : tables désignées par un emplacement deviné) et E-15 (badges de statut, fonds
  trop proches pour être distingués). Le juge note quatre constats « proches » sur deux d'entre eux
  (E-01 et E-08), aucun ne les désignant.
- **Plus de regards, plus de bruit.** L'union des trois personas retrouve 3 livrables, autant que
  le meilleur persona seul. La relecture qui produit le plus de constats (utilisateur final, 63) est
  aussi celle qui en produit le plus de faux (3), comme l'ablation de Lu et al. (2025) le mesure en
  revue de code. Trois lentilles coûtent 558 260 tokens, soit 2,7 fois la référence, pour au plus un
  livrable de plus.

Ce que ces six défauts ont en commun est la vraie leçon de la mesure : ils ne se lisent pas, ils se
constatent. Un sommaire sans règle de style se voit au rendu, une distance entre couleurs se
calcule, un contrôle limité à une page se prouve en déployant une autre page, une qualification
publique se sait par son adresse. Le regard qui manque à ces phases est **exécuté**, pas incarné, et
c'est le domaine des oracles de `quality-oracles` (règle §4 : domaine sans oracle, en définir un).

Un constat n'a pas été étiqueté par le juge (le sixième du mainteneur sur les logos) : 215 constats
jugés sur 216. Il ne peut pas changer le verdict, puisque le mainteneur a déjà retrouvé ce défaut et
qu'un F de plus le laisserait sous le plafond.

### Les options

**Mode de lecture** : une ligne par option du jeu fermé ; la colonne « sur la mesure » dit ce que
les chiffres ci-dessus en font. Les options vont de la plus légère à la plus lourde.

| Option | Contenu | Coût | Ce qu'elle exclut | Sur la mesure |
|---|---|---|---|---|
| **O0 — ne rien faire** | le verdict du 13/08 tient et s'étend à la couverture : aucun persona n'est construit | nul | un regard de partie prenante outillé | **retenue** : aucun persona n'atteint le seuil fixé d'avance |
| **O1 — fiches de point de vue dans `experts-forge`** | trois fiches « exploitant », « utilisateur final », « mainteneur » admises par l'épreuve A/B du registre | moyen × court, plus environ 180 000 tokens par relecture et par phase | rien d'autre : le mécanisme existe | **réfutée** : cette mesure EST l'épreuve A/B que l'admission exigerait, et aucune fiche ne change matériellement le rappel ; la loi du registre les refuse d'elle-même |
| **O2 — grille de lentilles par phase** | référentiel versionné de questions par phase, branché dans `contre-expertise` ou dans la boucle de fermeture de forge-tests | moyen × moyen, plus 2,7 fois les tokens d'une relecture à chaque phase | l'épreuve A/B : la grille entrerait sans admission | **réfutée** : même contenu que O1 sans l'épreuve, pour au plus un livrable gagné et plus de faux constats |
| **O3 — utilisateur simulé en tests** | profils dérivés des entrants, qui parcourent le produit livré chez forge-tests | complexe × long (un banc de parcours à construire) | un produit sans environnement de test exécutable | **réfutée à ce stade** : non mesurable sur archives, et l'axe 3 chiffre un écart systématique aux vrais utilisateurs (Zhou et al. 2026 : succès gonflé de 14,2 points) ; réouverture si un banc de parcours réels existe |
| **O4 — skill neuf** | un skill « personas de phase » | complexe × moyen | la réutilisation d'`experts-forge` | **réfutée** : aucun verbe outillé absent ailleurs (règle 31, critère 1), et O1 à O3 sont réfutées par la mesure |

La partition P3 (mode opératoire de l'agent de phase) n'a pas d'option propre : elle reste sous le
verdict du 13/08 et de l'axe 1 (le rôle déplace le style, pas la justesse), aucune mesure neuve ne
l'ayant rouverte.

## 5. Verdict

- **Option retenue : O0**, sous réserve. Aucun persona n'est construit ; le verdict du 13/08 s'étend
  de l'exactitude à la couverture des défauts échappés.
- **Coût** : nul pour O0. Coût de l'étude elle-même : complexe × moyen, 1 920 959 tokens délégués à
  neuf sessions Sonnet (recherche, sélection, reconstitution, quatre relectures, fiches, jugement).
- **Réserves**, qui font du verdict un verdict sous réserve : 9 livrables au lieu de 10 ; phase de
  tests absente de l'échantillon ; fiches sans corpus, choix fait pour que la doctrine née de ces
  défauts ne les fasse pas retrouver après coup ; un seul juge, du même modèle que les relecteurs ;
  deux étiquettes hésitantes qui portent tout le gain observé ; un constat non jugé.
- **Candidature émise** : `input\01-candidatures\personas-banc-defauts-echappes-20260914a.tf.jsonl`.
  Ce n'est pas un persona : elle propose de garder l'échantillon, son protocole et ses quatre
  relectures comme **banc rejouable**, pour mesurer tout futur mécanisme de relecture (persona,
  expert, juge) contre les mêmes défauts déjà payés. La décision reste humaine.
- **Plan de revue** : 2026-12-14. Rejouer le banc avec au moins dix nouveaux défauts échappés
  remontés d'ici là ; rouvrir O1 si un persona y franchit le seuil.
- **Test rétro** : l'élément opérationnel (aucun persona construit, banc proposé) remonte à la
  tactique (mesurer avant de construire : faite, seuil non atteint), puis à la stratégie (ajouter à
  chaque phase un regard que les contrôles n'ont pas : la mesure montre que ce regard est exécuté,
  pas incarné), puis à l'intention (moins de défauts livrés que l'humain doit trouver lui-même : servie
  par les oracles d'exécution et de rendu, et par un banc qui chiffre tout mécanisme proposé). Aucune
  rupture. Les mots du demandeur rejoués un à un : « concevoir » → trois fiches conçues ;
  « construire » → aucun objet durable, l'épreuve en tient lieu ; « exécuter » → quatre relectures
  sur neuf livrables ; « points de vue différents » → différents dans leurs constats, pas dans les
  défauts échappés retrouvés ; « façon d'opérer » → non mesurée, verdict du 13/08 ; « chaque phase »
  → quatre phases et la restitution, les tests faute de livrable relisable.

## Annexe — détail de la mesure par livrable

**Mode de lecture** : une ligne par livrable de l'échantillon, dans l'ordre des phases ; chaque
cellule donne les étiquettes R / A / F de la relecture en colonne. Les données brutes sont dans
`20260914-personas-mesure-baseline.md` et `20260914-personas-mesure-passes.md` ; les étiquettes du
juge et la clé de correspondance ont été produites par deux scripts, dans l'espace de travail de la
session.

| Livrable | Phase | Référence | Exploitant | Utilisateur final | Mainteneur |
|---|---|---|---|---|---|
| E-02 | conception | 0 / 6 / 0 | 0 / 6 / 0 | 0 / 8 / 0 | 0 / 6 / 0 |
| E-03 | design | 0 / 5 / 0 | 0 / 7 / 0 | 0 / 8 / 0 | 0 / 8 / 0 |
| E-15 | design | 0 / 4 / 0 | 0 / 4 / 0 | 0 / 5 / 0 | 0 / 4 / 0 |
| E-06 | development | 2 / 2 / 0 | 0 / 4 / 0 | 2 / 2 / 1 | 2 / 3 / 0 |
| E-07 | development | 3 / 2 / 0 | 2 / 4 / 0 | 5 / 3 / 0 | 2 / 4 / 0 |
| E-08 | development | 0 / 4 / 0 | 0 / 6 / 0 | 0 / 6 / 0 | 0 / 6 / 0 |
| E-01 | MEP | 0 / 5 / 1 | 0 / 8 / 0 | 0 / 8 / 0 | 0 / 6 / 0 |
| E-05 | MEP | 0 / 5 / 0 | 0 / 8 / 0 | 0 / 7 / 0 | 0 / 8 / 0 |
| E-04 | restitution | 0 / 4 / 0 | 0 / 5 / 0 | 1 / 5 / 2 | 1 / 5 / 0 |

Délégations et routage : neuf sessions au modèle Sonnet, défaut du contrat d'interface §4 ;
escalade de modèle : aucune.
