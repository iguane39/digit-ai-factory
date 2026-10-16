# Synthèse de mandat — « traite les todo et retours » (14 items, 3 campagnes)

## En-tête d'identification

**Quoi** : fin de mandat global (TF-0253..TF-0266, lots BdL + leçons d'audit réel).
**Sur quoi** : 6 dépôts — pilot, forge-tests, forge-conception, forge-ops, forge-agents,
forge-seo. **Quand** : 15/08/2026, fin à 18:20 (Europe/Paris), durée ≈ 45 minutes.
**Qui** : session pilot (Fable) + 3 agents (2 Opus, 1 Sonnet — routage §4, escalades
consignées au journal), pilot@eec9128.

## Verdict

14 items sur 14 corrigés et archivés (registre : 266 archivés, oracle R1-R10 PASS),
6 dépôts poussés, ~200 cas de test neufs ou étendus tous verts — et première vague
sous le §Avancement : 12 relais émis et transmis en direct.

## Décisions attendues de l'humain

- 8 candidats nés pendant la vague attendent — en choix fermé :
  - (a) « traite les todo » à nouveau : je route TF-0267..0274 comme cette vague —
    coût ~30-45 min, mais 3 sont des requalifications à trancher, pas du code ;
  - (b) décider item par item (TF-0271 mérite le premier regard : ETAPES-RUN prescrit
    un `--livrables` DANS le projet, source probable des deux exécutions perdues) ;
  - (c) laisser en candidats — rien ne se perd, rien ne presse.
  - Recommandation : (b) sur TF-0271 et TF-0272 (une prescription fausse et une
    requalification `assume` : deux décisions d'une minute), (c) pour le reste.
  - Par défaut : (c) s'applique.

## Traité — avec sa preuve

- lot BdL, 7 items (TF-0253..0259) — preuve : banc pilot 9/9 (dont fixtures CRLF et
  héritage), oracle-skills 18/18, self-test conception vert (8 oracles / 30 règles),
  self-test ops 50 PASS, pytest forge-tests 502 passed rejoué par le pilot ;
- lot leçons d'audit réel, 7 items (TF-0260..0266) — preuve : étude 20260815c PASS 7/7
  avant décision ; 138 cas verts côté seo (validate 12/12 et test_crawl_plafond 22/22
  rejoués par le pilot), grille hachée intacte ; RUN-MANDAT amendé (doctrine pilot) ;
- catalogue v1.6.2 (cat-seo-06 dit ses dépendances) — preuve : generer-vues --check
  PASS, miroir forge-seo synchronisé (seo@84989c8) ;
- complément TF-0253 corrigé en vol (faux positif inverse sur ingestion héritée) —
  preuve : fichier identique bit à bit à son commit du 14/08, fixtures héritage
  vert/rouge, boîte réelle PASS ;
- 6 dépôts poussés — preuve : fast-forwards listés (steering eec9128, tests 4e1ad86,
  conception bf27bd6, ops dc60643, agents 055d952, seo 84989c8).

## Non traité — avec son motif

- les 8 candidats TF-0267..0274 — motif : nés pendant la vague, hors du mandat reçu
  (tout entre en candidat, la décision est humaine) ;
- ruff sur forge-seo — motif : absent de l'environnement et non déclaré par le README
  de la forge ; dit par l'agent, consigné dans TF-0274.

## Écarts à la lettre

Les agents en ont déclaré cinq, tous motivés dans leurs rapports ; les deux qui te
concernent : TF-0261 — les compteurs d'échantillon continuent de s'écrire avec leur
dénominateur nommé (les annuler rendrait tout crawl tronqué inutile) ; TF-0262 — les
détecteurs du dépôt étaient déjà sains, le fautif était un outil ad hoc du run : la
correction a fermé le vrai trou (compteur produit par l'outil) et gardé le naïf comme
témoin de fixture.

## Risques

- les corrections seo changent la FORME des sorties de crawl (null + mesures_refusees
  au lieu de compteurs) : un consommateur non repéré pourrait lire null comme zéro ;
  - signal : un rapport aval affichant 0 orpheline sur un crawl tronqué ;
  - parade : `rapport_html.py` est le seul consommateur connu (vérifié par l'agent) et
    la prochaine mission le constatera au premier run — revue du 2026-09-15.

## Prochaines actions — ordonnées, et par acteur

- D'abord `manuelle_utilisateur` — trancher TF-0271 et TF-0272 (une minute chacune),
  parce que TF-0271 corrige une prescription qui fabrique des refus à chaque run.
- Ensuite `auto_ia` — router le reste des candidats sur ton mandat, puis confronter la
  vague à la revue du 2026-09-15 — l'usage avant le bilan.

## Traces

- rapports d'agents (3) reçus en session · `BOUCLE-AMELIORATION.md` (5e vague) ;
- `todo\TODO.md` (8 actifs) · `todo\TODO-ARCHIVE.jsonl` (266) ;
- `output\03-etudes\20260815-etude-opportunite-lecons-audit-reel.md` ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Traite les todo et retours - 20260815a.md`.
