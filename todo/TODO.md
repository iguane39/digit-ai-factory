# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=9f6512bd7b40 archive=34adbc5c6769 · dernier événement: 2026-08-11T12:17:38Z -->

**27 actifs** (candidat 27 · décidé 0 · en cours 0 · corrigé 0 · écarté 0) · **66 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0077 | candidat | 4 | render_page.py : UnicodeEncodeError cp1252 à l'impression du rapport JSON sans PYTHONUTF8=1 | **oui** — plantage reproduit ; PYTHONUTF8=1 requis dans chaque invocation du 09/08 |
| TF-0066 | candidat | 2 | render_page V3 : même biais de mesure que V7 sur les rangées d'éléments de largeurs variables | **oui** — biais démontré sur V7 (40 faux avertissements), même mécanique |
| TF-0069 | candidat | 2 | oracle-filtres-tableau sans entrée au manifest : ses fixtures ne sont jamais rejouées | **oui** — un oracle au registre sans preuve à double sens contredit la doctrine du registre |
| TF-0067 | candidat | 1.5 | exemple-reference (digit-ai-schemas) : V4 ×450 au rendu, probable faux positif de masse sur SVG | **oui** — le même faux positif de masse a coûté une itération complète au schéma pilot du 09/08 |
| TF-0025 | candidat | 1 | Statuer sur le skill méta dormant | non |
| TF-0068 | candidat | 1 | Self-test quality-oracles : 24 dossiers .tmp-niv-* fuient dans fixtures/ | **oui** — 24 dossiers résiduels mesurés |
| TF-0071 | candidat | 1 | profils/generique.json sans bloc nommage : le domaine reste en SKIP permanent hors Digit-AI/Q3-bis | **oui** — domaine non contrôlé sur tout projet hors convention |

## conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0070 | candidat | 2 | oracle-surface : la fixture verte de conception échoue au seuil par défaut depuis le registre central | **oui** — constaté à l'enregistrement des 4 oracles au registre |
| TF-0013 | candidat | 1.5 | Exercer MISSION.md sur un run réel | non |

## contenu (nouvelle)

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0041 | candidat | 0.4 | forge-contenu — à re-proposer sur preuve | non |

## design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0017 | candidat | 4 | Committer le chantier oracle-motion | non |
| TF-0016 | candidat | 2 | Rebuild + commit dist/*.skill | non |
| TF-0019 | candidat | 1.5 | Premier appel réel Gemini (lever R-D3) | non |
| TF-0020 | candidat | 1 | Producteur d'images complet | non |

## development

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0008 | candidat | 4 | Arbitrage D-V3 : l'amont officiel | **oui** — Décision re-payée à chaque produit construit |

## organization

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0076 | candidat | 4 | Contrôle de fraîcheur du gabarit A0 : la version de socle déclarée n'est vérifiée par rien | **oui** — dérive de 4 itérations constatée avant TF-0061 |
| TF-0052 | candidat | 3 | Trancher les 3 arbitrages « Leviers de qualité générique » (organization) | non |
| TF-0075 | candidat | 1 | Types Revue, Proposition, Schéma absents du registre des types (employés dans pilot/output) | **oui** — 3 types improvisés mesurés au corpus |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0065 | candidat | 6 | Le hook qualité sème ses journaux .oracles* dans tout dépôt édité — à canaliser une fois pour toutes | **oui** — 2 commits pollués défaits par git reset pendant la campagne agents ; nettoyage manuel ×3 campagnes |
| TF-0062 | candidat | 2 | Rattrapage du renommage pilot chez les produits et missions | non |

## seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0074 | candidat | 2 | etat.json : etape_courante et statuts d'étapes ne sont mis à jour par aucun script de la forge seo | **oui** — trou constaté au rapatriement des moteurs (TF-0030) |
| TF-0072 | candidat | 1.5 | forge-seo : l'empreinte de grille dépend des fins de ligne — un clone Linux déclarerait toutes les études périmées | **oui** — portabilité cassée par construction, constatée à l'implémentation de TF-0048 |
| TF-0073 | candidat | 1 | Rapatrier la production du CSV d'actions scoré (livrables-gen.py de la mission) — complément de TF-0056 | **oui** — le BOM du CSV réel trahit déjà un producteur hors forge |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0064 | candidat | 6 | forge-tests : 27 erreurs ruff préexistantes dont une syntaxe invalide en Python 3.11 | **oui** — incompatibilité mesurée avec la version Python minimale déclarée |
| TF-0003 | candidat | 4 | Audit complet sur projet libre (MiniVeille) | **oui** — Audit ASD du 07/08 déclaré dégradé (produit en travaux pendant l'audit) |
| TF-0063 | candidat | 4 | Le dashboard de forge-tests ne tient plus les règles L1-L12 du socle HTML | **oui** — S-01 NON TENU sur le dépôt depuis l'évolution du socle — la recette entière est rouge |
| TF-0078 | candidat | 2 | Registre de dette forge-tests : poser les premières fermetures ok sur preuve (0 sur 90) | **oui** — 27 fausses résolutions historiques requalifiées retiree — le registre ne prouve encore aucune fermeture |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
