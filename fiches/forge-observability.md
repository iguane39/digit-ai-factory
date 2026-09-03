# Fiche d audit — forge-observability

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune par agent d audit. MISE À JOUR à chaque audit — dernière mise à jour : 2026-08-19
(création, TF-0112 — décision humaine : forge unique, trois volets sur un socle commun).

### forge-observability — self-test 30/30, née exercée sur fixtures synthétiques (12/08)

Delta : dépôt neuf (v0), public GitHub, MIT. Raison d être : tout l écosystème vérifie
one-shot ; elle surveille ENTRE les runs. Forces : socle déclaratif
`forge-observability/plan@1` (sondes commande / oracle_externe / rapport_json / manuel,
cadences et seuils déclarés) · `scripts\observer.mjs` (snapshots JSONL append-only, seq
croissant — contrat ledger, exit 0/1/2) · `scripts\derive.mjs` (dérives entre snapshots :
seuils max/min/max_delta, régression de verdict PASS→FAIL, hausse de findings, disparition
de sonde bloquante, intégrité du ledger) · volet data et volet tests prouvés sur fixtures
(faux oracle à état PASS→FAIL) · veille citation IA **déclarée** sans fausse automatisation
(`veille-ia\METHODE.md`, raisons datées). Faiblesses / dettes : pas de scheduler interne
(cadence documentaire) ; pas d alerting (le FAIL de derive est le signal) ; comparaison de
sondes par nom (renommage = disparition+apparition) ; chemins d oracles externes paramétrés
mais composition jamais exercée sur un oracle réel de forge-data — premier plan réel à
consigner ici.

### Premier plan réel — surveillance des récidives du pilot (TF-0790, 03/09/2026)

Plan `digit-ai-factory/todo/observabilite/plan-recidives.json` (format `forge-observability/plan@1`),
deux sondes : `commande` (régénère le tableau de bord `generer-recidives.mjs --json`, capture le
compteur de récidives) et `rapport_json` (six compteurs : récidives, classes, classes sans
fondateur, retours à classe suspecte, produits non équipés, manques d'héritage ; `max_delta 0` sur
quatre d'entre eux). Invoqué depuis le pilot par `todo/observer-recidives.mjs` (observer puis
derive, forge résolue comme le lanceur des hooks, rien d'écrit ici) ; cadence hebdomadaire TENUE
par le hook d'ouverture du pilot (dernier snapshot de plus de sept jours → passage). Preuve par le
geste : `todo/observer-recidives.test.mjs` — premier relevé = données insuffisantes dit, deux
relevés identiques = PASS, une récidive de plus = FAIL nommant la sonde, forge absente = SANS_OBJET
(4 cas). Premier passage réel exercé le 03/09 (N-1). Limites v0 inchangées : aucun ordonnanceur ni
alerting — le FAIL de `derive.mjs` dans le relevé d'ouverture est le signal.

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuve rejouée : self-test → **30 PASS, 0 FAIL**. 7 commits depuis le 08/08 dont 5
mécaniques (catalogue, renommage) : la forge la moins exercée de l'écosystème — « Veille
citation IA » reste déclarée, aucun run réel au delta. Aucun constat nouveau (l'état est
celui de la fiche, simplement plus vieux).
