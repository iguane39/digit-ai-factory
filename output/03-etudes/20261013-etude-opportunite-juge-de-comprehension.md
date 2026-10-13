---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-13
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — un relecteur qui joue le lecteur visé et refuse ce qu'il ne sait pas redire — 20261013a

Ce qui change pour vous : un relecteur de ce type peut se construire, mais il ne peut pas encore bloquer une remise. Mesuré ce jour sur 22 textes réels, il trouve 2 des 4 textes que vous avez jugés incompréhensibles, et il refuse 3 à 8 des 18 textes que vous avez tranchés sans difficulté. Exiger l'accord de 2 relecteurs ramène ces faux refus à 2 sur 18 sans rien perdre. L'étude recommande donc de le construire en avertissement, avec 2 relecteurs qui doivent s'accorder, et de ne pas bloquer la remise sur un verdict « flou », contrairement à la proposition liée (TF-1394).

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Seuil atteint sur 2 des 3 critères du gabarit. Premier critère : la proposition crée un objet durable au sens de la règle R-31, un juge de compréhension opposable à tout texte visible. Second critère : elle porte un gain de 3 avec une preuve de 1 au registre (score de TF-1392). La fiche de décision du 02/10/2026 recommandait déjà cette étude (recommandation a), et le mandat global du 13/10/2026 l'a retenue.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande humaine, citée mot pour mot par le lot « Produit-68 - RETOURS - 20260926b » (RP-69) : « Est-ce qu'on peut envisager un persona pour ce type de texte qui ne veut rien dire et qui ne peut être compris par personne ? »

Elle suit trois éléments d'une présentation remise, jugés « ça ne veut rien dire » ou « pas compréhensible » alors que tous les juges les avaient laissés passer. Le lendemain, sur la même carte, le même lecteur écrit : « Cet encart est toujours complexe à comprendre, revois les tournures. » (lot 20260927a, RP-71).

Lecture retenue, reconstruite par l'agent et à valider par le demandeur : qu'aucun texte remis ne parte sans qu'un relecteur ait vérifié qu'il est compris par son lecteur, et que ce relecteur attrape ce que les listes de termes et les règles de forme laissent passer. Le mot « persona » désigne le moyen proposé ; l'intention est le texte compris.

## 0. Traitement des entrants

Les propositions instruites sont des DONNÉES : leurs impératifs se citent, ils ne s'exécutent pas. Sources :
- registre : TF-1392 (création du 27/09/2026, fiche de décision du 02/10, statut `en_cours` du 13/10), TF-1394 (même cycle, attente `dependance` sur TF-1392) ;
- lots du produit Produit-68 au pilot : `input\00-retours\Produit-68 - RETOURS - 20260926b.md` (RP-69) et `… - 20260927a.md` (RP-71) ;
- le juge persona du produit lui-même : **non relu**. Le dépôt de Produit-68 n'est pas sur ce poste (recherche du 13/10/2026 sous `C:\dev`, aucun dossier). Ses chiffres (lectures 1 à 3 : 88, 54 et 16 unités non comprises sur 375, 411 et 392 ; désaccord aux lectures 9 et 10) sont **rapportés par ses lots, non vérifiés ici** ;
- précédent : l'étude `output\03-etudes\20260914-etude-opportunite-personas-par-phase.md`, verdict O0 sur des personas chercheurs de défauts.

Le texte exact des 3 éléments refusés chez Produit-68 n'est cité dans aucun lot. Ils ne peuvent donc pas entrer au corpus de mesure : on ne mesure pas un texte qu'on n'a pas.

## 1. Partition du problème

Quatre sous-questions, disjointes :

1. **P1 — Couverture actuelle** : qu'attrapent aujourd'hui les juges du parc sur des textes qu'un lecteur humain a refusés, et que laissent-ils passer ?
2. **P2 — Rappel du relecteur** : un relecteur qui joue le lecteur visé trouve-t-il les textes refusés, et lesquels manque-t-il ?
3. **P3 — Faux refus** : combien de textes acceptés par leur lecteur refuse-t-il, et un second relecteur réduit-il ou accroît-il ce bruit ?
4. **P4 — Forme et force** : où le poser (quelle pièce existante le porte), et à quelle force (avertissement ou blocage) ; c'est là que se règle TF-1394.

## 2. Non-recouvrement contre l'existant

Une ligne par juge du parc qui pourrait déjà tenir la compréhension ; la citation localise ce qu'il fait, et la colonne de droite dit s'il couvre la proposition.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Règle E-12 | `references\ECRITURE.md`, « E-12 — Le vocabulaire du lecteur, jamais celui du système », ligne « Juge : `glossaire-restitution.json` (forge-data), contrat `voix.md` (T4). Revue. » | ne recouvre pas : elle énonce l'exigence, ses juges ne lisent que des termes |
| Listes fermées de termes | `gabarits\JARGON-A-GLOSER.json` (8 termes), `jargon-a-gloser.json` du socle des pages (8 termes), `gabarits\LEXIQUE-TRANSVERSE.json` (1 terme), `glossaire-restitution.json` de forge-data (1 terme) | ne recouvre pas : 0 texte refusé sur 4 attrapé au corpus (section 4) ; un mot remplacé par une image passe, comme « jeton » devenu « badge » chez Produit-68 |
| `oracle-ecriture` | `oracles\oracle-ecriture.mjs`, en-tête : « Il compte des tournures par DENSITÉ […] et par FAMILLE, jamais un mot isolé » ; EC-1 et EC-2 rendent SKIP sous 150 mots ; EC-7 rend SKIP sans lexique du produit | ne recouvre pas : 22 PASS sur 22 au corpus, il juge le style, pas le sens |
| `oracle-synthese` S47 | message de S47 : « décision(s) […] dont le rappel de sujet ne NOMME rien », règle née du retour du 16/09/2026 (TF-1154) | recouvre une classe étroite : le sujet non nommé d'une décision de restitution ; attrape le cas P1, 0 faux refus sur 17 décisions acceptées |
| Revue de lecture du socle des pages | `digit-ai-page-html\references\lisibilite.md`, table « Ce qui n'est PAS mécanisable », ligne « Langue du lecteur : Le constat est-il écrit comme le lecteur le reformulerait, ou comme l'auteur l'a mesuré ? » ; trace obligatoire `REVUE.md` (TF-0422) | recouvre la question, pas la mesure : chez Produit-68, revue PASS sur « Langue » et 3 éléments refusés par le lecteur (rapporté par RP-69) |
| `oracle-judge` de `quality-oracles` | `scripts\oracle-judge.mjs` : « AVIS OUTILLÉ, pas verdict », seconde instance par `claude -p`, rubrique figée chargée par `--profil` (`juge.rubrique`) ; `references\rubrique-juge.md`, axe « 1. CLARTÉ — le propos est compréhensible sans contexte externe » | recouvre le **mécanisme** (juge externe, rubrique versionnée, avis jamais promu en verdict) ; ne recouvre pas le **contenu** : une note par document, 5 constats au plus, aucun lecteur déclaré, aucune reformulation par unité |
| Fiche de conception | `gabarits\documents\FICHE-CONCEPTION.md`, section « 2 · Le lecteur — défini par ce qu'il doit DÉCIDER », champs `decisions_attendues` et `contexte_de_lecture` | ne recouvre pas : elle définit le lecteur, personne ne relit le texte avec lui ; c'est la source du rôle à jouer |
| Étude des personas par phase | `20260914-etude-opportunite-personas-par-phase.md`, verdict O0 : « aucun persona n'atteint le seuil fixé d'avance » | ne recouvre pas : elle mesurait la couverture des défauts par des rôles de partie prenante, pas la compréhension d'un texte par son lecteur |

## 3. État de l'art daté

Six sources de moins de 24 mois. Les deux premières ont été ouvertes ce jour sur leur page arXiv ; les quatre suivantes ont été lues le 14/09/2026 par l'étude des personas par phase et sont **rapportées, non relues ici**.

1. **Guo, Sohn, Leroy, Cohen**, « Are LLM-generated plain language summaries truly understandable? », 2025-05-15, arXiv 2505.10409. 150 lecteurs : les résumés écrits par un modèle paraissent aussi bons que ceux écrits par un humain aux notes subjectives, mais la compréhension mesurée par questionnaire est nettement meilleure sur les résumés humains ; dix métriques automatiques ne suivent pas le jugement humain.
2. **Cachola, Khashabi, Dredze**, « Evaluating the Evaluators: Are readability metrics good measures of readability? », 2025-08-26, arXiv 2508.19221. Sur 8 métriques de lisibilité, la plupart corrèlent mal avec le jugement humain ; un modèle de langue fait mieux, avec une corrélation de Pearson de 0,56 au meilleur.
3. **Xiao et al.**, « When Does Persona Prompting Actually Help? », 2026-05-28, arXiv 2605.29420 (rapporté) : le rôle rend les réponses plus jargonneuses et moins claires, sans gain d'exactitude.
4. **Lu et al.**, « Towards Practical Defect-Focused Automated Code Review », 2025-05-28, arXiv 2505.17928 (rapporté) : ajouter des relecteurs augmente les défauts trouvés et les fausses alertes.
5. **Zhou et al.**, « Mind the Sim2Real Gap in User Simulation for Agentic Tasks », version 2 du 2026-07-31, arXiv 2603.11245 (rapporté) : 31 simulateurs contre 451 humains, succès gonflé de 14,2 points par les simulateurs.
6. **Seshadri et al.**, « Lost in Simulation », 2026-01-23, arXiv 2601.17087 (rapporté) : calibration des utilisateurs simulés faussée, écart de 11,2 points selon le dialecte simulé.

Ce que la littérature dit pour ce sujet : un modèle juge mieux la lisibilité qu'une formule (2), sans atteindre le jugement humain (0,56) ; un lecteur simulé reste décalé du vrai (1, 5, 6) ; plusieurs relecteurs trouvent plus et crient plus (4). Rien ne soutient un relecteur simulé en position de blocage. La mesure de la section 4 dit la même chose sur nos propres textes.

## 4. Options — jeu fermé O0-O4

### Mesure du 13/10/2026 : juges existants et relecteur persona

**Corpus**, constitué ce jour dans le dépôt du pilot, 22 unités. 4 unités ont été refusées par leur lecteur humain, mot pour mot :
- P1, la décision D-1 de la synthèse 20260916e avant correction (commit `8e3f9f13`), « on ne comprend absolument rien au charabia » ;
- P2, la cellule « préalable : ligne 8 (droit IAM) puis ligne 5 (merge) » (lot Produit-03 20260822b), « C'est incompréhensible » ;
- P3, un message d'échec du contrôle des pages (lot Produit-05 20260820b), « incompréhensible sans lire le code de l'oracle » ;
- P4, le bloquant « il suppose une session ouverte dans le compte » (lot Produit-02 20260922a), « Je ne comprends pas ».

18 unités ont été tranchées par le porteur sans retour de compréhension : les décisions D-17, D-19 à D-21, D-24, D-25, D-27 à D-29, D-36, D-37, D-58 à D-63 de leurs synthèses, et la fiche de décision tranchée en D-70. « Tranchée sans retour » ne prouve pas « claire » : c'est la meilleure approximation disponible, et elle compte comme telle.

**Juges existants**, joués ce jour sur chaque unité :

| Juge | Refusées attrapées (sur 4) | Acceptées refusées (sur 18) |
|---|---|---|
| 4 listes fermées de termes | 0 | 1 (« sidecar » dans D-21) |
| `oracle-ecriture`, unité seule | 0 (22 PASS) | 0 |
| `oracle-synthese` S9, S15, S23, S47, sur la synthèse source | 1 (P1, par S47) | 0 sur 17 décisions jouées |

S47 attrape P1 parce qu'elle est née de ce cas : son rappel n'est pas indépendant de son banc.

**Relecteur persona**, joué par 3 sous-agents isolés, à l'aveugle (unités mélangées, sans leur statut), chacun avec la consigne du produit : redire l'unité en une phrase au lecteur nommé, puis rendre COMPRIS, FLOU ou INCOMPRIS avec la question du lecteur.

| Relecteur | Refusées attrapées (sur 4) | Acceptées refusées (sur 18) |
|---|---|---|
| A, modèle Sonnet, ordre A | 2 (P3, P4) | 3 |
| B, modèle Sonnet, ordre B | 2 (P3, P4) | 8 |
| C, modèle Haiku, ordre A | 2 (P2, P4) | 3 |
| A et B, un désaccord vaut FLOU (règle proposée par TF-1394) | 2 | 9 |
| A et B, refus seulement s'ils s'accordent | 2 | 2 |
| Majorité de A, B et C | 2 | 4 |

Pris ensemble, les 3 relecteurs trouvent 3 refusées sur 4 (P2, P3, P4), mais aucune règle de combinaison mesurée ne garde ce gain sans faire monter les faux refus. Avec la règle d'accord de A et B, les 2 faux refus sont D-24 et D-61 ; celui de D-61 est utile (troisième constat ci-dessous).

Accord entre relecteurs sur le verdict refusé ou non : A et B 15 sur 22, A et C 16 sur 22, B et C 11 sur 22. Coût mesuré de la passe : 199 541 jetons pour 66 lectures d'unité (3 appels de sous-agent, 64 135, 64 658 et 70 748 jetons, comptes rendus par le harnais), dont l'essentiel est le contexte fixe de chaque appel.

Trois constats tirés de cette mesure :
- **Le relecteur manque la périphrase.** Les 3 relecteurs ont jugé P1 COMPRIS. Le relecteur A l'a redite ainsi : « Le pilot ne peut pas être publié à cause d'un nom de dépôt présent dans la table des noms à masquer ». La reformulation garde le flou (« un nom de dépôt ») sans le voir. Le porteur, lui, ne savait pas de quel dépôt il s'agissait. C'est la règle S47, mécanique, qui attrape ce cas.
- **Le relecteur manque ce qui dépend d'un message précédent.** P2 est devenu faux parce que la liste avait été renumérotée d'un message à l'autre ; lue seule, la cellule paraît claire à 2 relecteurs sur 3.
- **Une partie des « faux refus » est utile.** Sur D-61, A et B posent la même question : « Si je publie, la porte […] bloque-t-elle le pilot ? ». Le texte la laisse en effet ouverte. Le porteur a tranché quand même, mais la question améliorait le texte. Un avertissement garde cette valeur, un blocage la paie en remises arrêtées.

Le désaccord observé par Produit-68 aux lectures 9 et 10 se reproduit ici : B refuse 8 acceptées là où A en refuse 3, sur les mêmes textes et le même modèle, dans un autre ordre.

### Les options

- **O0 — ne rien faire** : réfutée. Coût du statu quo cité par les lots : 3 éléments d'une présentation remise refusés par leur lecteur, 154 textes réécrits le même jour d'après le tableau avant → après du produit, une carte relevée le 26/09 puis le 27/09 (RP-69, RP-71) ; au pilot, une décision tranchée à l'aveugle (D-1 du 16/09). Les juges existants n'attrapent qu'1 refusée sur 4, par une règle née du cas même.
- **O1 — règles mécaniques seules** : porter hors des restitutions la règle du sujet nommé (S47) et enrichir les listes fermées. Coût : complexité moyen · durée court. 0 faux refus mesuré pour S47 sur 17 décisions. Exclut ce que seul un lecteur voit : P3 et P4, un acteur absent (« il »), une étiquette sans légende.
- **O2 — relecteur persona en avertissement, deux relecteurs qui doivent s'accorder** :
  - une rubrique « lecteur visé » chargée par `oracle-judge` (`--profil`), qui prend le lecteur dans la fiche de conception, relit chaque unité visible, la redit en une phrase, rend COMPRIS, FLOU ou INCOMPRIS et la question du lecteur ;
  - 2 relecteurs indépendants ; un constat n'est retenu que si les deux refusent ; chaque constat retenu reçoit une suite écrite dans `REVUE.md` : réécrit, ou maintenu avec le fait qu'une réécriture changerait, cité ;
  - la question qui revient d'une lecture à l'autre remonte à l'humain avant la remise ;
  - la règle du sujet nommé d'O1, portée en avertissement après une mesure de bruit, pour la périphrase que le relecteur ne voit pas ;
  - aucune remise bloquée. Promotion au blocage seulement après une mesure sur 100 unités au moins, dont 10 refusées par un humain, avec un taux de faux refus de 10 % au plus.
  - Coût : complexité moyen · durée court à construire (une rubrique, un profil, une section du gabarit de revue, une ligne « Juge » à E-12). À l'usage, environ 3 000 jetons par lecture d'unité au contexte mesuré ; une présentation de 400 unités lue par 2 relecteurs ferait de l'ordre de 2,4 millions de jetons par passe (extrapolation, non mesurée).
  - Exclut un arrêt automatique de la remise sur un texte flou.
- **O3 — relecteur persona bloquant, un relecteur** (forme jouée par le produit, RP-69) : faux refus mesuré de 3 à 8 sur 18 selon le relecteur, soit 17 % à 44 %. Coût : complexité moyen · durée court. Exclut de remettre un livrable dont 1 unité sur 4 ou 5 est refusée à tort ; la leçon N4 du noyau dit ce qui arrive ensuite : « un oracle qui crie sur l'usage légitime se fait désactiver dans la semaine ».
- **O4 — relecteur persona bloquant, deux relecteurs, un désaccord vaut FLOU, exception validée par l'humain** (TF-1394, option a de sa fiche) : faux refus mesuré de 9 sur 18, rappel inchangé à 2 sur 4. Coût : complexité moyen · durée moyen. Exclut toute remise sans exception humaine écrite pour la moitié des textes acceptés.

## 5. Verdict

- **Option retenue** : O2, relecteur persona en avertissement, deux relecteurs qui doivent s'accorder, complété de la règle du sujet nommé.
- **Pourquoi** : c'est la seule forme dont le bruit mesuré (2 sur 18) ne paralyse pas la remise, au même rappel que les formes bloquantes (2 sur 4). Le relecteur et S47 se complètent : chacun attrape ce que l'autre manque (P3 et P4 pour le premier, P1 pour la seconde). Le rappel reste faible et mesuré sur 4 unités seulement : un avertissement le dit, un blocage le cacherait.
- **Ce que cela implique pour TF-1394** : elle fait trois propositions. Première : une unité FLOU ou INCOMPRISE à la dernière lecture bloque la remise, sauf exception validée par l'humain. Deuxième : 2 relecteurs par unité, un désaccord vaut FLOU. Troisième : la question répétée d'une lecture à l'autre remonte à l'humain avant la remise. La mesure réfute les deux premières à ce stade. Un désaccord qui vaut FLOU porte les faux refus à 9 sur 18, contre 3 à 8 pour un relecteur seul, sans trouver un texte de plus. Bloquer la remise sur FLOU suppose un bruit qui n'est pas atteint. La troisième tient et passe dans O2 : la question répétée d'une lecture à l'autre remonte à l'humain avant la remise, et un motif « changerait un fait » cite ce fait. C'est l'option b de sa fiche de décision, complétée de la citation du fait.
- **Avertissement d'abord** : toute règle de ce verdict opposable aux produits entre en avertissement, jamais en blocage. Précédent : la décision humaine D-70 (b) du 13/10/2026 a fait entrer en avertissement la règle de revue de lecture des pages remises, à rendre bloquante après une mesure du bruit. La promotion au blocage est une décision humaine, prise sur la mesure prévue au plan de revue.
- **Coût** : complexité moyen · durée court à construire, en une campagne de `digit-ai-forge-agents` (rubrique, profil d'`oracle-judge`, section du gabarit de revue de lecture) et une édition au pilot (ligne « Juge » de E-12). Usage : environ 3 000 jetons par lecture d'unité. Dette évitée : les réécritures après remise, 154 textes en un jour chez Produit-68.
- **Risque de faux refus** : 11 % mesurés (2 sur 18) avec l'accord des deux relecteurs, sur un petit corpus ; 17 % à 44 % avec un seul relecteur. Un faux refus coûte une suite écrite dans `REVUE.md`, jamais une remise arrêtée.
- **Candidature(s) émise(s)** : aucune par cette étude. La construction est l'objet de TF-1392 et la remontée des questions celui de TF-1394 ; les deux attendent une décision humaine, parce qu'elles posent une règle neuve opposable à tous les livrables.
- **Plan de revue** : le 2026-11-10, ou à la première présentation relue par le relecteur si elle vient avant. Ce jour-là, on compte sur au moins 100 unités les refus retenus, les refus jugés utiles par le producteur et les textes refusés ensuite par l'humain. Sans relecteur construit à cette date, le retard se constate et se date.
- **Test rétro** :
  - rubrique « lecteur visé » → tactique : un relecteur redit chaque unité au lecteur de la fiche → stratégie : un texte non compris est vu avant la remise → intention : « un persona pour ce type de texte qui ne veut rien dire » ;
  - deux relecteurs qui s'accordent → tactique : 2 faux refus sur 18 au lieu de 3 à 9 → stratégie : un juge qu'on ne désactive pas → intention : que le juge serve encore dans un mois ;
  - question répétée remontée à l'humain → tactique : RP-71 ne se reproduit pas, la carte floue 3 fois ne part plus sans que l'humain le sache → intention : « toujours complexe à comprendre » ne revient pas après la remise ;
  - règle du sujet nommé → tactique : la périphrase de P1 est vue → stratégie : couvrir ce que le relecteur manque → intention : « ne peut être compris par personne », y compris quand le relecteur croit comprendre ;
  - avertissement plutôt que blocage → stratégie : rappel de 2 sur 4, non prouvé pour un blocage → intention servie sans arrêter des remises justes ;
  - question rejouée : « est-ce qu'on peut envisager un persona ? » → oui, en avertissement, avec 2 relecteurs ; non, pas encore en blocage ;
  - aucun élément sans parent.

## Annexe — détail de la mesure par unité

Verdicts des relecteurs A, B et C, dans cet ordre (C = COMPRIS, F = FLOU, I = INCOMPRIS).

| Unité | Statut humain | A | B | C |
|---|---|---|---|---|
| P1 (D-1, 16/09) | refusée | C | C | C |
| P2 (ligne 8, ligne 5) | refusée | C | C | F |
| P3 (message du contrôle des pages) | refusée | F | F | C |
| P4 (« il suppose une session ») | refusée | F | F | I |
| D-17 | tranchée | C | F | F |
| D-19 | tranchée | C | F | C |
| D-20 | tranchée | C | C | C |
| D-21 | tranchée | C | F | C |
| D-24 | tranchée | F | F | C |
| D-25 | tranchée | C | F | C |
| D-27 | tranchée | C | C | C |
| D-28 | tranchée | C | C | C |
| D-29 | tranchée | C | C | C |
| D-36 | tranchée | C | C | F |
| D-37 | tranchée | C | F | C |
| D-58 | tranchée | C | C | C |
| D-59 | tranchée | C | F | C |
| D-60 | tranchée | C | C | C |
| D-61 | tranchée | F | F | C |
| D-62 | tranchée | C | C | C |
| D-63 | tranchée | C | C | C |
| D-70 (fiche) | tranchée | F | C | F |

Rejouer : le corpus, les deux ordres aveugles et les scripts de calcul ont été construits dans le répertoire temporaire de la session, hors dépôt ; les textes viennent des fichiers suivis cités en section 4 (synthèses de `output\04-plans\`, lots de `input\00-retours\`, registre).

## Interdits (l'oracle les tient)

Aucun critère subjectif sans mesure, aucune option hors du jeu fermé, aucune ligne de non-recouvrement sans citation, aucune source non datée comptée comme datée, O0 jamais passée sous silence.
