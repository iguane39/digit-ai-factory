# Étude d'opportunité — câbler `orchestrer-boucle.mjs` en appelant réel — 20260818b

<!-- TF-0360. Instruction d'un candidat entre `candidat` et `decide` (TF-0155).
     Émise le 2026-08-18 par le pilot, sur mandat humain (boucle des 17 restants).
     Second temps de l'arbitrage TF-0351 du 18/08 — le premier temps (invariant I2) est fait. -->

## Seuil de déclenchement (vérifié AVANT d'écrire)

**Franchi sur deux critères.** L'intégration touche **trois dépôts** — `digit-ai-factory`,
`digit-ai-forge-tests`, `digit-ai-forge-development` — soit ≥ 3 forges au sens de TF-0155 ; et
elle **crée un objet durable** (R-31) : un contrat d'interface de boucle entre trois forges,
qui survivra à la campagne qui l'écrit. TF-0360 le disait de lui-même : « à instruire donc, pas
à improviser ».

## 0. Traitement des entrants

Le candidat instruit (TF-0360) est une donnée du registre. Son contenu prescrit un ordre — « TF-0352/0353
d'abord, ce câblage ensuite » — qui est **cité, examiné, et se trouve avoir été suivi** : les
deux items ont été livrés le 18/08 dans `digit-ai-forge-tests` avant que cette étude soit
écrite. Ce n'est pas une exécution de la consigne du ticket, c'est un fait que l'instruction
constate et dont elle tire les conséquences en §4.

Sources : TF-0360 (candidat, 18/08) · TF-0351 (tranché le 18/08 : câbler, non retirer) ·
`outillage-tests-e2e\README.md` §« Arbitrage du 18/08 » · TF-0352 / TF-0353 (`decide`, livrés
le 18/08 dans forge-tests).

## 1. Partition du problème

- **P1 — qui PORTE la boucle ?** Le pilot orchestre-t-il forge-tests, ou forge-tests
  porte-t-il sa propre boucle et le pilot lit-il son verdict ? C'est la question que TF-0360
  nomme comme engageant le contrat d'interface entre trois forges.
- **P2 — qui décide de la FIN ?** Une boucle a besoin d'une définition de terminaison
  opposable, et d'un seul endroit où elle vit.
- **P3 — qui exécute les actions ?** Router `auto_ia` vers development, `tests-suite` vers la
  suite, `mep-config` vers l'exploitant : c'est un appel réel à un autre dépôt.
- **P4 — que devient `orchestrer-boucle.mjs` ?** Il existe, il est testé, il n'a aucun
  appelant : il est câblé, réduit, ou retiré.
- **P5 — quel est le coût réel, et qu'est-ce qui l'a fait baisser depuis le 17/08 ?**

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Doctrine de boucle du pilot | `references\ETAPES-RUN.md` : « **Boucle de fermeture bornée** … Au plus 5 cycles toutes étapes confondues, extensibles à 7 si chaque cycle réduit strictement le reste d'`auto_ia` … Garde G-2 absolue » | **recouvre P1 et P2 en doctrine** : la boucle du pilot EXISTE, bornée et écrite. Ce qui manque n'est pas la règle, c'est son exécutant |
| Routage des actions | `references\ETAPES-RUN.md` : « chaque item `actions[]` du rapport porte son `etape_cible` ; router les `auto_ia` — `development`, `tests-suite`, `design`, `mep-config`, `forge` » | **recouvre P3 en doctrine** : la table de routage est écrite et le rapport la porte déjà (`forge_tests/actions.py`, section `actions[]`). Le manque est l'APPEL |
| Définition de fin d'une campagne | `digit-ai-forge-tests\forge_tests\boucle.py` (TF-0352/0353, livré le 18/08) : cinq points opposables — portes à 0, aucun `xfail` sans arbitrage daté, N ≥ 2 passages verts, chaque anomalie corrigée ou assumée par écrit, dernier tour rejoué APRÈS le dernier correctif | **recouvre P2 ENTIÈREMENT, et c'est le fait nouveau de cette étude** : la définition de fin est désormais outillée, et elle vit chez forge-tests |
| Verdict de boucle au rapport | `digit-ai-forge-tests\forge_tests\noyau.py` : section `boucle` présente dans TOUT rapport d'audit — « juge la CAMPAGNE quand `verdict` juge CE run » ; journal absent → la section le dit | **recouvre P1 par le haut** : le pilot n'a plus besoin de dériver l'état de la boucle, il le LIT dans le rapport qu'il persiste déjà |
| L'orchestrateur lui-même | `outillage-tests-e2e\README.md` : « `auditer`/`reprendre`/`declencherDevelopment` sont **injectés** par l'appelant ; ce fichier ne câble aucun appel réel … La CLI ci-dessus ne rejoue qu'une séquence de fixtures » | **ne recouvre pas P3** : les points d'injection existent, les appels n'existent pas. Le câblage est un DÉVELOPPEMENT, pas un branchement |
| Ses tests | `oracles\self-tests.mjs` l.21 : « INVARIANT (I2, TF-0351 du 18/08) : tout `*.test.mjs` du dépôt est JOUÉ ici » | **recouvre P4 en partie** : l'outil n'est plus un mort-vivant non joué — 7/7 et 8/8 verts et joués par la recette. Il reste sans appelant |
| Reprise ciblée de forge-tests | `digit-ai-forge-tests\forge_tests\reprise.py` + CLI `--reprendre <rapport.json>` : ne rejoue que les pans non verts, fusionne avec la provenance de chaque élément | **recouvre la moitié « réexécution » de P3** : le mécanisme de re-audit incrémental est livré et éprouvé. Un orchestrateur qui le réécrirait ferait diverger deux lectures de la même chose |
| Cycle de vie de l'instance auditée | `digit-ai-forge-tests\forge_tests\instance.py` (TF-0340/0341, clos le 18/08) : contrat de montage/démontage déclaré par le projet, provenance de l'instance confrontée à l'arbre de travail | **lève la CONDITION posée par l'étude 20260817** : une boucle qui réexécute sans savoir ce qu'elle laisse debout mesurait un code qui n'était plus celui du dépôt (fenêtre de 2 h 25 mesurée le 17/08) |

## 3. État de l'art daté

**Non instruit** (déclaré sans entre-deux, comme la section l'exige). Motif : la question posée
n'est pas « comment l'industrie orchestre des boucles de remédiation » mais « lequel de deux
dépôts de CET écosystème porte une boucle qui existe déjà en double ». Les faits qui tranchent
sont tous internes, datés et cités en §2. Produire cinq sources externes ici — sans accès
réseau dans cette session — reviendrait à les écrire de mémoire, c'est-à-dire à fabriquer la
preuve exigée. L'état de l'art redevient nécessaire si l'on veut un jour **remplacer** ce
mécanisme par un ordonnanceur du marché ; ce n'est pas l'objet.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : l'orchestrateur reste sans appelant. *Réfutation, sur pièces* : le
  coût du statu quo est mesuré et daté. L'outil est livré depuis le 13/08 pour la finalité
  exacte du mandat du 17/08, et l'étude 20260817 a dû l'**exhumer par `grep`** plutôt que par le
  corpus. Tant qu'il n'a aucun appelant, chaque campagne qui a besoin de cette boucle la
  réécrit ou s'en passe — c'est déjà arrivé le 17/08, où la boucle a été tenue à la main sur
  quatre tours. O0 est réfutée.
- **O1 — retirer `orchestrer-boucle.mjs`.** *Contenu* : supprimer l'outil et sa dette R-35 avec
  lui. *Réfutation* : arbitrage déjà rendu le 18/08 (TF-0351), et sur un motif que rien n'a
  renversé — « l'arbitrage est câbler, non retirer : l'outil sert une finalité désormais
  atteignable ». Retirer coûterait aussi les 15 tests verts qui le couvrent depuis I2.
- **O2 — le PILOT orchestre.** *Contenu* : le pilot câble `auditer`, `reprendre` et
  `declencherDevelopment` en appels réels (sous-processus vers forge-tests et
  forge-development), tient le compteur de cycles, applique la borne ≤ 5/7 et prononce la fin.
  *Coût* : 3-5 jours sur trois dépôts (chiffrage de l'étude 20260817). *Ce qu'elle exclut* :
  elle fait naître **deux définitions de fin** — celle d'`ETAPES-RUN.md` tenue par le pilot, et
  celle de `forge_tests/boucle.py` livrée le 18/08. C'est exactement le danger que TF-0360
  nommait (« deux boucles concurrentes »), aggravé depuis que la seconde est outillée.
- **O3 — forge-tests PORTE la boucle, le pilot LIT son verdict et exécute le routage.**
  *Contenu* : la définition de fin reste unique et vit chez forge-tests (`boucle.verdict`,
  section `boucle` de chaque rapport) ; le pilot ne la réimplémente pas — il lit
  `rapport.boucle.statut`, et tant qu'il vaut `en_cours` il route les `auto_ia` par leur
  `etape_cible` et déclenche un nouveau tour. `orchestrer-boucle.mjs` devient ce lecteur-routeur :
  ses trois points d'injection sont câblés (`auditer` → `python -m forge_tests --json`,
  `reprendre` → `--reprendre`, `declencherDevelopment` → l'entrée CLI de forge-development), et
  sa borne locale ≤ N reste un **garde-fou de sécurité**, jamais le critère de fin. Le journal
  de boucle est écrit par le pilot chez le PRODUIT (`forge/journal-boucle.jsonl`) : c'est sa
  campagne. *Coût* : nettement inférieur à O2 — la définition de fin, le compteur de tours, la
  détection du « non rejoué après correctif » et la mesure de convergence sont **déjà écrits et
  testés** (17 tests, livrés le 18/08). Reste l'écriture des trois appels réels, le format du
  journal côté pilot, et une fixture d'intégration bout en bout. *Ce qu'elle exclut* : le pilot
  renonce à décider seul qu'une campagne est finie — c'est le prix, et c'est le point à
  arbitrer.
- **O4 — les deux, séquencé** : O3 d'abord, puis reprise progressive de l'orchestration par le
  pilot. *Réfutation* : une migration prévue entre deux porteurs d'une même règle est le patron
  de la double vérité, avec en prime une date de fin que personne ne tiendra. Si O3 doit être
  révisée, ce sera sur un constat, pas sur un calendrier.

## 5. Verdict

- **Option retenue** : O3 — forge-tests porte la boucle et sa définition de fin, le pilot lit
  son verdict et exécute le routage.
- **Motif opposable** : la question que TF-0360 laissait ouverte — « qui pilote la boucle » — a
  reçu sa réponse par un **fait daté**, pas par une préférence. Le 18/08, TF-0352 et TF-0353 ont
  livré chez forge-tests une définition de fin opposable en cinq points, un journal de tours, et
  une section `boucle` présente dans tout rapport d'audit. La règle « le dernier tour doit avoir
  été rejoué APRÈS son dernier correctif » y est mécanisée : le pilot ne peut pas la
  réimplémenter sans créer la seconde vérité que l'écosystème solde partout ailleurs. Le
  principe qui tranche est celui déjà appliqué au mouvement chez forge-design (TF-0335) :
  **la forge qui PRESCRIT une règle est celle qui la JUGE**. Ici, forge-tests prescrit ce
  qu'est une campagne terminée ; c'est donc elle qui le juge, et le pilot lit.
- **Ce que le verdict refuse explicitement** : le pilot ne recalcule aucun des cinq points de
  la définition de fin ; `ETAPES-RUN.md` cessera de porter une seconde définition et renverra à
  celle de forge-tests (la borne ≤ 5/7, elle, RESTE au pilot — c'est un plafond de dépense, pas
  un critère de fin, et la loi 5 la garde côté humain). Aucun câblage n'est autorisé par cette
  étude : elle instruit, elle ne mandate pas.
- **Coût** : trois appels réels à écrire (≈ 1 j), le format du journal de boucle côté pilot et
  son écriture chez le produit (≈ 0,5 j), une fixture d'intégration bout en bout sur un projet
  jouet (≈ 0,5 j), plus la mise en cohérence d'`ETAPES-RUN.md` et du contrat d'interface
  (≈ 0,5 j). Soit **≈ 2,5 jours sur deux dépôts** au lieu des 3-5 jours sur trois dépôts
  chiffrés le 17/08 : forge-development n'est plus touchée en écriture (elle est appelée par
  son entrée CLI existante), et la moitié la plus délicate — savoir quand s'arrêter — est déjà
  livrée. **Dette créée, déclarée** : un couplage du pilot au format de la section `boucle` de
  forge-tests ; il se borne par une fixture de contrat côté pilot, qui échoue si le format
  bouge, plutôt que par une lecture défensive qui masquerait le changement.
- **Candidature(s) émise(s)** : aucune candidature nouvelle. Cette étude propose UN mouvement :
  **TF-0360 passe en `decide` avec O3 pour plan**, sa frontière écrite (fin chez forge-tests,
  borne et routage chez le pilot) et son plan de revue.
- **Plan de revue** : 2026-09-15. Faits confrontés : (1) une campagne réelle a-t-elle été close
  sur `rapport.boucle.statut == terminee`, et le journal de boucle du produit existe-t-il ?
  (2) `ETAPES-RUN.md` porte-t-il encore une définition de fin concurrente ? (3) le pilot a-t-il
  réimplémenté l'un des cinq points — si oui, la frontière a échoué et il faut la réécrire, pas
  la répéter ; (4) la borne ≤ 5/7 a-t-elle été atteinte au moins une fois, et qu'a-t-on fait à
  ce moment-là ?
