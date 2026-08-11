# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=35f787aacafd archive=e3b0c44298fc · dernier événement: 2026-08-11T08:26:29Z -->

**82 actifs** (candidat 27 · décidé 0 · en cours 2 · corrigé 53 · écarté 0) · **0 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## (nouvelle)

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0041 | candidat | 0.4 | forge-contenu — à re-proposer sur preuve | non |

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
| TF-0021 | corrige | 6 | Régression CRLF digit-ai-page-html/SKILL.md | **oui** — 2 échecs réels du self-test quality-oracles constatés le 08/08 |
| TF-0057 | corrige | 6 | find-in-page.js : même classe pour le conteneur de recherche et le surlignage | **oui** — défaut visible en production sur un rapport client ; écart mesuré 606 px, ramené à 0 px |
| TF-0060 | corrige | 4.5 | digit-ai-schemas : l'exemple de reference viole 25 fois les regles du socle, dont 7 fois une regle anterieure | **oui** — 25 echecs sur l'asset de reference d'un skill de production, dont 7 sur une regle en vigueur depuis le 08/08 |
| TF-0058 | corrige | 4 | render_page.py écrit ses PNG dans le dossier du fichier audité | **oui** — 12 fichiers d'oracle déposés dans un dossier de livrables client |
| TF-0024 | corrige | 2.7 | Script de sync/diff repo ↔ ~/.claude | **oui** — Constatée deux fois (05/08 et 08/08), dans les deux directions |
| TF-0011 | corrige | 2 | Enregistrer les 4 oracles au registre quality-oracles | non |
| TF-0022 | corrige | 2 | Committer le travail du 08/08 (file-candidats, gabarit A0) | non |
| TF-0059 | corrige | 2 | render_page V7 : 288 avertissements de rythme vertical noient le signal V1/V4 | **oui** — 288 avertissements V7 contre 8 constats bloquants réels sur le même run |
| TF-0023 | corrige | 1.5 | Réparer le self-test de l'installation (6 échecs) | non |

## conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0070 | candidat | 2 | oracle-surface : la fixture verte de conception échoue au seuil par défaut depuis le registre central | **oui** — constaté à l'enregistrement des 4 oracles au registre |
| TF-0013 | candidat | 1.5 | Exercer MISSION.md sur un run réel | non |
| TF-0012 | corrige | 2 | Installer les 4 skills sous ~/.claude/skills | non |
| TF-0014 | corrige | 1.5 | Manifeste + protocole machine « bloqué sous seuil » | non |
| TF-0015 | corrige | 1 | Coder E7-E9 (EARS/ISO 29148) dans oracle-exigences | non |

## design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0017 | candidat | 4 | Committer le chantier oracle-motion | non |
| TF-0016 | candidat | 2 | Rebuild + commit dist/*.skill | non |
| TF-0019 | candidat | 1.5 | Premier appel réel Gemini (lever R-D3) | non |
| TF-0020 | candidat | 1 | Producteur d'images complet | non |
| TF-0079 | corrige | 6 | oracle-tokens T4 contredisait la doctrine du thème clair — sombre rendu optionnel | **oui** — 3 blocs sombres imposés au schéma du 09/08 pour satisfaire un contrat que la doctrine contredit |
| TF-0018 | corrige | 1 | Installer les 4 skills verbes | non |

## development

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0008 | candidat | 4 | Arbitrage D-V3 : l'amont officiel | **oui** — Décision re-payée à chaque produit construit |
| TF-0007 | corrige | 3 | Source unique des disciplines de livrable | non |
| TF-0010 | corrige | 2.7 | Gates de livrable exécutables | **oui** — 3 défauts sortis en production v0.1.0 |
| TF-0009 | corrige | 2.5 | HumanGate déléguable + dogfooding | **oui** — D-V1 payée à chaque étape 4 en mode dégradé |

## ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0081 | corrige | 4 | Extension cloud de forge-ops — expertises + plans : Railway, GCP, Azure, AWS | **oui** — D-P1 : v0 cible locale seulement ; cas réel Railway (ASD) déployé artisanalement |

## ops (nouvelle)

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0040 | corrige | 2 | Créer forge-ops (exploitation) | **oui** — MEP portée par le steering faute de forge ; déploiement Railway artisanal |

## organization

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0076 | candidat | 4 | Contrôle de fraîcheur du gabarit A0 : la version de socle déclarée n'est vérifiée par rien | **oui** — dérive de 4 itérations constatée avant TF-0061 |
| TF-0052 | candidat | 3 | Trancher les 3 arbitrages « Leviers de qualité générique » (organization) | non |
| TF-0075 | candidat | 1 | Types Revue, Proposition, Schéma absents du registre des types (employés dans pilot/output) | **oui** — 3 types improvisés mesurés au corpus |
| TF-0061 | corrige | 6 | Aligner le gabarit A0 (organization) sur L1(b), L2-au-rendu et le nommage Q3-bis | **oui** — la même dérive a déjà été payée 2 fois (skills install↔repo, disciplines dupliquées) |
| TF-0031 | corrige | 3 | CLAUDE.md + trancher Q3-bis | non |
| TF-0032 | corrige | 2 | Se conformer à sa propre doctrine | non |
| TF-0033 | corrige | 1 | Le registre des types devient un fichier | non |
| TF-0034 | corrige | 1 | Phase 3 : vérificateur machine des conventions | non |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0065 | candidat | 6 | Le hook qualité sème ses journaux .oracles* dans tout dépôt édité — à canaliser une fois pour toutes | **oui** — 2 commits pollués défaits par git reset pendant la campagne agents ; nettoyage manuel ×3 campagnes |
| TF-0062 | candidat | 2 | Rattrapage du renommage pilot chez les produits et missions | non |
| TF-0050 | corrige | 6 | Gabarit d'agent de campagne — contraintes standard mutualisées | **oui** — ~25 prompts × ~3 Ko de contraintes dupliquées relevés sur la semaine |
| TF-0080 | corrige | 6 | Oracle d'exhaustivité de l'écosystème (matrice forges × surfaces) | **oui** — 3 trous réels le 11/08 : fiche forge-audit absente, forge-audit hors noyau, README à « cinq forges » |
| TF-0035 | corrige | 4 | versions_forges/run_precedent réellement consignés | **oui** — 0/76 entrées sur ASD malgré 2 versions livrées |
| TF-0036 | corrige | 3 | Archive du run pilote sous git | non |
| TF-0049 | corrige | 3 | TODO-FORGE : l'écriture directe contourne l'écrivain unique — la détecter par oracle | **oui** — 7 créations sans trace d'ingestion dans le registre réel |
| TF-0051 | corrige | 3 | Protocole de mesure du routage Sonnet/Opus | non |
| TF-0053 | corrige | 3 | CLAUDE.md steering découpé en références à la demande (mécanisme de TF-0037) | **oui** — trajectoire CLAUDE.md 4590→17278 octets mesurée sur git |
| TF-0082 | corrige | 2.7 | Socle documentaire produit docs\projet\ — règles R-20..R-23 | **oui** — aucun produit n'a d'état des lieux standardisé ; les runs de version redécouvrent technos/config/accès à chaque ouverture |
| TF-0037 | corrige | 1.5 | Plafond de taille CLAUDE.md + alerte | non |
| TF-0038 | corrige | 1.3 | Exercer une vraie reprise de run interrompu | non |
| TF-0054 | corrige | 1 | Baseline d'audit packagée par forge | non |

## seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0029 | en_cours | 1 | Générateurs des 3 livrables manquants | non |
| TF-0074 | candidat | 2 | etat.json : etape_courante et statuts d'étapes ne sont mis à jour par aucun script de la forge seo | **oui** — trou constaté au rapatriement des moteurs (TF-0030) |
| TF-0072 | candidat | 1.5 | forge-seo : l'empreinte de grille dépend des fins de ligne — un clone Linux déclarerait toutes les études périmées | **oui** — portabilité cassée par construction, constatée à l'implémentation de TF-0048 |
| TF-0073 | candidat | 1 | Rapatrier la production du CSV d'actions scoré (livrables-gen.py de la mission) — complément de TF-0056 | **oui** — le BOM du CSV réel trahit déjà un producteur hors forge |
| TF-0042 | corrige | 10 | livrables.py : dette() écrit noeud_id en chaîne, le schéma exige un entier | **oui** — Pipeline officiel bloqué sur la mission livrée : 11 écarts au schéma, aucun livrable écrit. Contourné à la main pour produire le rapport. |
| TF-0043 | corrige | 8 | crawler.py ne lit pas sitemap.xml : l'inventaire du site est celui du graphe de liens | **oui** — Sur produit-02.fr le crawler annonce 79 URLs découvertes ; le sitemap en déclare 286, soit 73 % du site absent de l'inventaire. |
| TF-0044 | corrige | 8 | crawler.py : la métrique pages_orphelines ne peut structurellement pas être non nulle | **oui** — « pages orphelines : 0 » affiché sur un site à 208 orphelines, découvertes seulement en confrontant sitemap et graphe de liens hors outil. |
| TF-0045 | corrige | 6 | rapport_html.py lit actions-*.csv sans dialecte : un CSV en points-virgules sort en n/d | **oui** — 10 actions sorties intégralement en « n/d » dans une version du rapport, qui se présentait par ailleurs comme complète. |
| TF-0056 | corrige | 6 | validate.py ne contrôle aucune cohérence référentielle entre actions-*.csv et la grille | **oui** — le défaut de rattachement a traversé la génération de 8 versions du rapport sans être signalé |
| TF-0048 | corrige | 4 | Une évolution de la grille sans table de correspondance réassigne silencieusement les constats | **oui** — 9 fiches sur 13 reprises se sont révélées assignées au mauvais nœud — performance serveur dans Canonical, données structurées dans Performance, GA4 dans Génération De Pages. Détecté par recoupement manuel, aucun outil ne le signalait. |
| TF-0055 | corrige | 4 | front_matter() rend des chaînes : aucune action n'était rattachée à son nœud, en silence | **oui** — 0 action sur 10 rattachée à un nœud sur la mission livrée ; détecté en relisant le rendu, aucun contrôle ne le signalait |
| TF-0028 | corrige | 3 | validate --mission contrôle schema_version | **oui** — Observée sur la mission réelle livrée |
| TF-0046 | corrige | 3 | rapport_html.py échappe le markdown des fiches au lieu de le rendre | **oui** — Tableaux de preuve illisibles dans le rapport ; fiches réécrites en prose et convertisseur de tableaux développé côté mission pour contourner. |
| TF-0026 | corrige | 2 | --json sur validate.py | non |
| TF-0027 | corrige | 2 | Trancher le working tree en cours | non |
| TF-0047 | corrige | 2 | Le « blocage principal » de la synthèse est choisi par l'ordre de la grille, pas par la gravité | **oui** — Sur la mission, le blocage affiché n'était pas le principal, et le texte repris renvoyait à « cette fiche » et à une action non encore introduite. |
| TF-0030 | corrige | 0.8 | Généraliser les moteurs ad hoc des missions | non |

## steering

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0039 | en_cours | 1 | Circuit organization→steering opérationnel | non |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0064 | candidat | 6 | forge-tests : 27 erreurs ruff préexistantes dont une syntaxe invalide en Python 3.11 | **oui** — incompatibilité mesurée avec la version Python minimale déclarée |
| TF-0003 | candidat | 4 | Audit complet sur projet libre (MiniVeille) | **oui** — Audit ASD du 07/08 déclaré dégradé (produit en travaux pendant l'audit) |
| TF-0063 | candidat | 4 | Le dashboard de forge-tests ne tient plus les règles L1-L12 du socle HTML | **oui** — S-01 NON TENU sur le dépôt depuis l'évolution du socle — la recette entière est rouge |
| TF-0078 | candidat | 2 | Registre de dette forge-tests : poser les premières fermetures ok sur preuve (0 sur 90) | **oui** — 27 fausses résolutions historiques requalifiées retiree — le registre ne prouve encore aucune fermeture |
| TF-0001 | corrige | 8 | RT-13 : champs manquants dérivés du pan | **oui** — 16 actions manuelle_utilisateur fausses au rapport ASD du 07/08 |
| TF-0002 | corrige | 3 | Contrôle sync registre-dette ↔ code en recette | non |
| TF-0004 | corrige | 2 | Sémantique du registre de dette | **oui** — Indicateur « 27 résolues » publié à l'inventaire steering sur une base non vérifiée |
| TF-0005 | corrige | 0.7 | Sélecteur de recette --section | **oui** — Coût mesuré à chaque itération de campagne |
| TF-0006 | corrige | 0.6 | Suite unitaire propre de forge-tests | non |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
