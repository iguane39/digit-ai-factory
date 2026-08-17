# Synthèse de mandat — « traite tous les retours et tous les todos » (8 items, 3 campagnes)

## En-tête d'identification

**Quoi** : fin de mandat global (TF-0288..TF-0295 — la totalité du registre actif — plus la
boîte d'entrée prouvée vide). **Sur quoi** : 3 dépôts écrits — pilot, forge-tests, forge-ops.
**Quand** : 17/08/2026, fin à 10:16 (Europe/Paris, 08:16Z), durée ≈ 55 minutes.
**Qui** : session pilot (Fable) + 3 agents (2 Opus, 1 Sonnet — routage §4 : Sonnet sur le
volet ops bien borné, Opus sur les deux constructions ; escalades : aucune), pilot@d973c7d.

## Verdict

8 items sur 8 corrigés et archivés (registre : 296 archivés, oracle R1-R10 PASS avant et
après archivage), S-01 TENU 13/13 sur arbre stable, pytest forge-tests 568 → 637, self-test
ops 54 → 63, self-test oracle-skills 18 → 37 — chaque campagne rejouée par le pilot en sondage.

## Décisions attendues de l'humain

- **Le gate C7 ne bloque plus rien sur ce poste** (constat K6 : `~\.claude\hooks` absent,
  `settings.json` sans qo-gate — le hook est versionné chez forge-agents, jamais installé) :
  - (a) réinstaller : `node oracles\oracle-skills.mjs --appliquer` puis recâbler le
    `PostToolUse` dans settings — coût 2 min, le gate le plus joué du 15/08 revit ;
  - (b) déclarer le gate abandonné — coût nul, mais plus aucun blocage C7 à l'écriture ;
  - recommandation : (a) — 5 blocages réels en une journée prouvent qu'il sert.
  - Par défaut : rien ne change, K6 continuera de déclarer le trou à chaque run.
- **Poser `assume` sur les 2 entrées neuves du registre de dette** (TF-0292 : vendored,
  URLs auto-référentes) — décision d'une minute, sinon elles restent `todo` sans mentir.
- **6 candidats neufs (TF-0296..0301)** nés des campagnes : (a) « traite les todo » à
  nouveau (~20-30 min, le plus gros est TF-0297) ; (b) décider item par item ; (c) laisser
  en candidats — rien ne presse. Par défaut : (c).

## Traité — avec sa preuve

- boîte d'entrée : vide prouvée (B1-B3 PASS, 18 sidecars ingérés) ; doublon
  `candidature-trous-detection` classé `old\` sans ingestion (ses 4 items = TF-0283..0286,
  archivés le 15/08 avec gains) ;
- ouverture R-35 : self-tests 10/10 ; oracle-skills FAIL K2 (2 skills design en retard sur
  la source tirée au pull) → `--appliquer` → PASS rejoué ;
- TF-0288 (étude 20260817a PASS 7/7, verdict O3) — détection : le cas fondateur INS-0001
  rejoué en fixture (8 entrées promises, 3 servies → FAIL nommant les 5 manquantes,
  destinataire `mep-config`, « ne PAS toucher au code ») ; prévention : empreinte sha256
  scellée au `deployer`, règle O-7 la compare (self-test ops 54 → 63, rejoué pilot) ;
- TF-0294 — la recette refuse de conclure sur un arbre qui bouge (exit 2, 14 tests ; 253
  fichiers empreintés à la recette finale) ; TF-0292 — dette 127 → 129, règle et mesure
  distinguées ; TF-0291 — auto-accusation 7 → 0 constats, un vrai secret reste détecté ;
  TF-0293 — corpus 19 → 22, H-17/18/19 [DETECTE] ; TF-0295 — 4 limites levées, 30 tests,
  un faux positif réel ôté (logo correct vers `/en` accusé sur le patron d'INS-0001) ;
- TF-0289 — 50 % de faux positifs K2 supprimés (mesures du 15/08), troncature corrigée ;
  TF-0290 — hooks sous contrôle d'intégrité (K6), fixtures prouvées par mutation (3 mutants
  tués) ; vérifié pilot : 37/37, agrégateur 10/10, run réel PASS v1.1.0 ;
- journal (7e vague), vues TODO régénérées, ETAPES-RUN et REGLES-PROJET disent K1-K6.

## Non traité — avec son motif

- INS-0001 reste ouvert — motif : le correctif est REMIS au produit digit-ai.fr (garde-fou :
  le pilot n'écrit jamais dans un produit hors run demandé) ; il se ferme sur release
  constatée, pas sur intention ;
- les 6 candidats TF-0296..0301 — motif : nés pendant la vague, tout entre en candidat, la
  décision est humaine ;
- le nettoyage des 13 sidecars committés chez forge-agents (TF-0296) — motif : dépôt frère,
  aucune campagne n'y était mandatée aujourd'hui ;
- revue datée du 15/09 (étude TF-0288) — motif : échéance future, consignée au plan de revue.

## Écarts à la lettre

Les agents en ont déclaré neuf, tous motivés dans leurs rapports ; les trois qui te
concernent : le verdict d'écart ops vit dans `oracle-ops.mjs` (règle O-7) et non dans le
verbe `etat` — idiome du dépôt, « ops outille et ne juge jamais » ; le motif d'exclusion K2
refuse le séparateur `-` pour que `registre-oracles.json` reste jugé ; un hook versionné
non installé est DÉCLARÉ, pas mis en échec — sinon le run réel serait FAIL sur l'état
actuel du poste, que la décision en tête doit d'abord trancher.

## Risques

- l'exclusion des bancs par SIGNATURE (TF-0291) pourrait taire un vrai secret si quelqu'un
  déposait du code produit sous `fixtures\` de la forge ;
  - signal : un secret réel committé là ne sort dans aucun scan ;
  - parade : l'exclusion est publiée à chaque sortie du pan (dossiers nommés), et la
    fixture « vrai secret dans forge_tests\ détecté » verrouille le périmètre.
- l'empreinte O-7 ne couvre pas la voie canary (TF-0298 ouvert) ;
  - signal : O-7 SKIP permanent sur une cible pourtant déployée ;
  - parade : le SKIP est motivé et nominal — jamais un PASS ; candidature au registre.

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — trancher C7 (option (a), 2 minutes) : un gate mort
  laisse passer ce qu'il bloquait il y a deux jours ; puis `assume` sur les 2 dettes.
- Ensuite `auto_ia` — sur ton mandat : router TF-0296..0301 (TF-0297 en premier, il ferme
  la moitié « câblage » du trou C7 que K6 ne voit pas).
- Enfin `manuelle_dev` — côté digit-ai.fr : redéployer depuis la source courante (le
  contrôle TF-0288 saura désormais le vérifier) et clore INS-0001 sur release constatée.

## Traces

- `output\03-etudes\20260817-etude-opportunite-ecart-servi-versionne.md` (PASS 7/7) ;
- commits : pilot `1c6f431`, `d973c7d` (+ celui-ci) ; tests `e71879f`→`fda3a29` (6) ;
  ops `da8d375` ;
- `todo\TODO.md` (6 actifs) · `todo\TODO-ARCHIVE.jsonl` (296) · `BOUCLE-AMELIORATION.md`
  (vague du 17/08) ;
- rapports d'agents (3) reçus en session, ~25 émissions d'avancement relayées ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Traite retours et todos - 20260817a.md`.
