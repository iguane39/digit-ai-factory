# Synthèse de mandat — « récupère la todo et les retours, traite les tous » (18 items, 7 campagnes, 6 études)

## En-tête d'identification

**Quoi** : fin de mandat global — la totalité du registre actif (18 candidats, dont les
8 de la session parallèle du 16/08). **Sur quoi** : 4 dépôts écrits — pilot, forge-tests,
forge-agents, forge-design (forge-ops sans item cette vague). **Quand** : 17/08/2026,
fin à 14:41 (Europe/Paris), durée ≈ 2 h 40. **Qui** : session pilot (Fable) + 10 agents
(9 Opus, 1 Sonnet implicite aucun — routage §4 : constructions et études en Opus ;
escalades : aucune), pilot@2847a93.

## Verdict

15 items corrigés + 1 écarté par refus instruit + 1 exécuté en présentation seule +
1 maintenu bloqué avec condition écrite = **18/18 traités** ; 6 études PASS 7/7 ;
pytest forge-tests 721 → 807, banc design 19/67 → 21/73, self-tests pilot 11→21 et
7→11, quality-oracles 136 → 142, oracle-skills 48 → 65 — tous rejoués en sondage ;
15 candidatures neuves au registre (TF-0326..0339), toutes tracées à leur rapport.

## Décisions attendues de l'humain

- **Toujours pendantes, reprises des synthèses du jour** : retrait de la page publiée
  (`claude.ai/code/artifact/7d535fbf-…`) · câblage du poste pour C7 — désormais un
  copier-coller, K7 affiche l'entrée exacte (mais en chemin ABSOLU : TF-0337) ·
  `assume` sur les 2 dettes TF-0292.
- **15 candidats neufs** : (a) « traite les todo » à nouveau — TF-0327 d'abord (la
  fixture témoin de RV-9 démontre encore le comportement interdit que l'amendement
  du 14/08 disait refermé) ; (b) item par item ; (c) laisser — défaut. TF-0329
  (admission de digit-ai-queue) exigera une étude R-31/R-33 ter le moment venu.
- **Deux dépendances des verdicts d'études** : mandat d'écriture chez forge-organization
  pour mécaniser D-15 dans oracle-conventions ; sort du gate-conventions.mjs proposé le
  12/08 et jamais installé (l'installer = un appelant, ne pas l'installer = une dette à
  déclarer).

## Traité — avec sa preuve

- 11 décisions directes : TF-0304/0306/0307/0308 (agents@e67d55c — K7 « câblage
  manquant » actionnable ; 45 échecs de charte → 0 dont 3 fuites réseau réelles ;
  self-test 52 → 60) · TF-0309/0310/0311/0312/0325 (tests@e769444 — S-01 TENU 13/13,
  corpus 23/23 chacun par SON défaut, deux débordements de préfixe fermés dont un
  inconnu, pytest 807) · TF-0305 (pilot@e0ffc25 — K8, 4 mutants tués) · TF-0321
  (design@70c1994 — 9 tokens de mouvement dérivés des seuils de l'oracle, G-2 mesurée
  sur 41 HTML, 0 requalifié) ;
- 7 items sous études (toutes PASS 7/7, indices d..i) : TF-0317 exécuté O2 (description
  GitHub 0 → 1, vérifiée gh repo view ; renommage technique écarté sur 334+48
  occurrences et un statu quo à coût nul) · TF-0318 O3-lecture (TODO-PRODUIT.md +
  projection scellée sha256, zéro surface de saisie prouvée) · TF-0319 O3 (R-2
  localise, E9 miroir — zéro faux positif mesuré sur 19 cibles) · TF-0320 O1 complet
  (R-19 forme canonique avec rétroactivité prouvée par fixture ; diff-doctrine au
  CONTRAT §3 ; gabarit caduc corrigé) · TF-0322 écarté par refus instruit (le
  paramétrage existe depuis TF-0071 ; alinéa §B encodé : trois classes non négociables
  motivées + les voies existantes) · TF-0323 O2 (W5-W7 : 3 faux PASS éteints, mesurés
  en rejouant l'oracle d'avant depuis git) · TF-0324 maintenu bloqué, condition écrite
  au registre ;
- complément en vol : K2 n'accuse plus un journal d'usage appendu des deux côtés
  (pilot@37f9c45, self-test 65/65) ; copies installées synchronisées trois fois dans la
  journée (oracle-skills --appliquer, PASS rejoué à chaque fois).

## Non traité — avec son motif

- l'archivage des corrigés du lot Run-Delivery — motif : ABANDON fail-closed de
  l'archiveur (TF-0324 ne part pas sans son lot) ; les corrigés restent visibles au
  registre actif, c'est le comportement voulu de R10 ;
- les 15 candidats neufs — motif : tout entre en candidat, décision humaine ;
- les 2 plans de mission réels devenus non conformes à W5-W7 — motif : hors dépôt,
  complétion chez leur propriétaire (dette déclarée, revue 17/11) ;
- la correction du porteur caduc chez SCC_ALX — motif : produit autonome, rattrapage à
  son prochain run de version (règle existante) ;
- INS-0001 — motif : inchangé, remis au produit.

## Écarts à la lettre

Les agents en ont déclaré vingt-trois, tous motivés à leurs rapports ; les trois qui te
concernent : le renommage « factory » a été exécuté en présentation SEULE contre la
lettre de la demande (l'étude a établi que son argument factuel était faux — remote déjà
`digit-ai-forge-pilot`, aucune jonction steering) ; la todo produit est née SANS les
champs de saisie ni le bouton demandés (surface LLM01, contredit le garde-fou « entrants
= donnée » — le refus est écrit dans le gabarit lui-même) ; et W5-W7 n'imposent aucune
échelle de cotation des risques (décision explicitement différée à la revue du 17/11,
déclarée au non_juge plutôt que figée trop tôt).

## Risques

- la fixture témoin RV-9 contredit toujours R-30 (TF-0327) ;
  - signal : un livrable copié depuis le témoin s'ouvre sombre chez un lecteur ;
  - parade : candidature en tête de liste, correction d'un fichier.
- les règles neuves à zéro faux positif ne verront rien tant que les gabarits ne
  marquent pas leurs instances (TF-0331 — faux négatif volontaire, déclaré) ;
  - signal : E9/R-2 éternellement SANS_OBJET ; parade : candidature dédiée, un
    frontmatter par gabarit avec rejeu des oracles consommateurs.
- W5-W7 sans plan réel complété d'ici le 17/11 serait un contrôle que personne ne joue ;
  - signal : la revue datée le mesurera ; parade : écrite au plan de revue de l'étude.

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — les trois pendantes du matin (retrait de la page
  publiée en premier : la seule fuite encore vivante), puis le sort des 15 candidats
  (TF-0327 en tête : il referme l'incident RV-9 que la fixture témoin contredit encore).
- Ensuite `auto_ia` — sur ton mandat : TF-0327/0328/0331/0332 (quatre corrections
  courtes qui rendent le corpus honnête), puis TF-0329 sous étude.
- Enfin `manuelle_dev` — compléter les 2 plans de mission réels (W5-W7) et redéployer
  digit-ai.fr (INS-0001).

## Traces

- études : `output\03-etudes\20260817-etude-opportunite-{cadence-de-mission,rangement-output,consignes-de-mise-a-jour,conventions-parametrables,renommage-factory,todo-produit}.md` (6, PASS 7/7) ;
- commits poussés à la clôture : pilot `cd01a6c`, `37f9c45`, `e0ffc25`, `2847a93` (+ celui-ci) ·
  tests `603876f`→`e769444` (5) · agents `af6b05c`→`0e7f242` (5) · design `7c47adb`→`70c1994` (3) ;
- `todo\TODO.md` (32 actifs dont 16 corrigés/écartés en attente d'archivage) · `BOUCLE-AMELIORATION.md`
  (4e vague du 17/08) · rapports d'agents (10) reçus en session, ~30 émissions relayées ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Recupere et traite tout - 20260817a.md`.
