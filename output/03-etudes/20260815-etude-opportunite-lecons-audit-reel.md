# Étude d'opportunité — leçons du run d'audit réel (TF-0260..TF-0266) — 20260815c

## Seuil de déclenchement (vérifié)

Les 7 items du lot portent **gain 3 avec preuve 1** (seuil TF-0155 : gain ≥ 3 et
preuve ≤ 2 → étude obligatoire) ; TF-0266 touche en outre la **doctrine du pilot**
(RUN-MANDAT vs garde-fou « produits autonomes »).

## 0. Traitement des entrants

La candidature instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent
pas. Sources : lot `AuxPortesDeLaBaie - RETOURS - 20260815a` (ingéré le 15/08,
TF-0260..TF-0266), issu du run d'audit SEO réel clos le 15/08.

## 1. Partition du problème

- **P-a Justesse de mesure** : un outil qui rend un chiffre plausible et faux
  (crawler plafonné, détecteur sensible à l'ordre des attributs, labo pris pour du
  terrain) — TF-0261, TF-0262, TF-0264.
- **P-b Dégradation déclarée** : un service annoncé qui s'arrête net quand une donnée
  d'entrée manque, au lieu de rendre un non-mesurable motivé — TF-0260, TF-0264.
- **P-c Confrontation des sources** : conclure sur la taille d'un site depuis une
  seule source d'inventaire — TF-0263.
- **P-d Découvrabilité et doctrine** : le registre des types invisible depuis le
  projet (TF-0265) ; RUN-MANDAT exigeant un PASS de conformité que l'existant rend
  inatteignable, en contradiction avec le garde-fou d'autonomie (TF-0266).

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Correction d'amorçage du crawler | TF-0263 (le lot lui-même) : « Le crawler a corrigé l'amorçage depuis » — sitemap lu avant les liens (README forge-seo, §3 du pipeline) | recouvre l'amorçage ; ne recouvre ni le plafond menteur (TF-0261) ni l'indicateur d'écart en synthèse (TF-0263) |
| `validate.py` forge-seo | « 12/12 contrôles passés » (rejoué le 15/08) | juge l'intégrité de la mission, pas la justesse des mesures du crawl (P-a hors périmètre constaté) |
| Registre des types v1.2.0 | organization@8aa948f (15/08) : « D-04 — types Cahier, Dashboard, Jeu admis » | le registre existe et l'oracle R-25 le lit ; RIEN ne le désigne depuis le projet avant l'erreur (TF-0265, constaté : 10 constats R-25 après coup) |
| `RUN-MANDAT.md` | « oracle-conformite-projet.mjs PASS en invariant non négociable » | recouvre le cas d'un projet né sous la doctrine ; contredit le garde-fou « le pilot n'y intervient que sur run demandé » dès que l'existant est antérieur (TF-0266, constaté : 206 constats R-4 sur des fichiers antérieurs au mandat) |
| Convention non-mesurable de la grille SEO | rapport 20260815d : « non instruit — la question n'a pas été posée à ce site » (nœud 58) | le VOCABULAIRE de dégradation existe ; `agents_ia.py` et le nœud Performance ne l'utilisent pas (arrêt net, ou conforme sur la mauvaise grandeur) |
| Fixtures double sens (doctrine des oracles) | `self-tests.mjs` pilot : « 9/9 oracles : recette à double sens jouée et verte » | la discipline existe pour les ORACLES ; les détecteurs de balisage du crawler n'en ont pas (TF-0262 : href avant rel indétectable) |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche externe non mandatée ; le lot est
lui-même un état de l'art interne daté (7 constats mesurés sur un run réel du 15/08,
chacun avec ses chiffres). Revue datée en section 5.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo cité par le lot : des canoniques
  déclarées absentes sur 79 pages alors qu'elles existent (TF-0262), 89 orphelines
  annoncées pour 10 réelles (TF-0261), un nœud Performance conforme à 21 ms quand le
  terrain mesure TTFB p75 à 1 162 ms (TF-0264) — trois chiffres faux qui pouvaient
  partir en rapport client.
- **O1 — corriger les 5 défauts seo au cas par cas, sans le volet doctrine** : coût
  2-3 j ; exclut TF-0265/TF-0266 — l'aller-retour de renommage (28 fichiers) et la
  contradiction RUN-MANDAT se reproduiraient au prochain mandat sur existant.
- **O2 — trois campagnes ciblées (seo : justesse + dégradation ; pilot/organization :
  découvrabilité R-25 ; pilot : doctrine du run de mandat sur existant) + fixtures
  double sens pour tout détecteur corrigé** : coût 3-4 j au total, zéro construction
  neuve hors fixtures ; exclut l'élévation en loi transverse (assumé : voir O3).
- **O3 — élever « deux sources d'inventaire » et « terrain avant labo » en lois du
  noyau** : rejetée — règles MÉTIER d'une forge (le noyau est plafonné à 6 144 octets
  et ses lois sont transverses à toutes les étapes) ; leur place est la méthode de
  forge-seo, où l'oracle peut les jouer.
- **O4 — renvoyer le lot à forge-organization pour proposition D-** : rejetée — le
  lot est déjà instruit et chiffré ; l'aller-retour n'ajouterait ni preuve ni contrôle.

## 5. Verdict

- **Option retenue : O2** — trois campagnes ciblées, fixtures double sens exigées
  pour tout détecteur corrigé, doctrine du run de mandat amendée (socle du RUN
  distingué de la conformité du projet entier, écarts déclarés au ledger).
- **Coût** : seo 2-3 j (agent) ; tests/organization/pilot ~1 j (agents + pilot) ;
  doctrine ~0,5 j (pilot, RUN-MANDAT + oracle si un contrôle l'exige).
- **Candidature(s) émise(s)** : aucune nouvelle — TF-0260..TF-0266 décidés directement
  (mandat global « traite les todo et retours » du 15/08).
- **Plan de revue : 2026-09-15** — au prochain run d'audit réel : les chiffres du
  crawl portent-ils encore un majorant citable, un service s'est-il arrêté net sans
  verdict motivé, un mandat sur existant a-t-il exigé un rattrapage hors périmètre ?
