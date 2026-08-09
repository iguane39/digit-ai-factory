# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=1a860796b7db archive=e3b0c44298fc · dernier événement: 2026-08-09T10:39:57Z -->

**60 actifs** (candidat 54 · décidé 0 · en cours 1 · corrigé 5 · écarté 0) · **0 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## (nouvelle)

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0040 | candidat | 2 | Créer forge-ops (exploitation) | **oui** — MEP portée par le steering faute de forge ; déploiement Railway artisanal |
| TF-0041 | candidat | 0.4 | forge-contenu — à re-proposer sur preuve | non |

## agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0021 | candidat | 6 | Régression CRLF digit-ai-page-html/SKILL.md | **oui** — 2 échecs réels du self-test quality-oracles constatés le 08/08 |
| TF-0057 | candidat | 6 | find-in-page.js : même classe pour le conteneur de recherche et le surlignage | **oui** — défaut visible en production sur un rapport client ; écart mesuré 606 px, ramené à 0 px |
| TF-0060 | candidat | 4.5 | digit-ai-schemas : l'exemple de reference viole 25 fois les regles du socle, dont 7 fois une regle anterieure | **oui** — 25 echecs sur l'asset de reference d'un skill de production, dont 7 sur une regle en vigueur depuis le 08/08 |
| TF-0058 | candidat | 4 | render_page.py écrit ses PNG dans le dossier du fichier audité | **oui** — 12 fichiers d'oracle déposés dans un dossier de livrables client |
| TF-0024 | candidat | 2.7 | Script de sync/diff repo ↔ ~/.claude | **oui** — Constatée deux fois (05/08 et 08/08), dans les deux directions |
| TF-0022 | candidat | 2 | Committer le travail du 08/08 (file-candidats, gabarit A0) | non |
| TF-0059 | candidat | 2 | render_page V7 : 288 avertissements de rythme vertical noient le signal V1/V4 | **oui** — 288 avertissements V7 contre 8 constats bloquants réels sur le même run |
| TF-0023 | candidat | 1.5 | Réparer le self-test de l'installation (6 échecs) | non |
| TF-0025 | candidat | 1 | Statuer sur le skill méta dormant | non |

## conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0011 | candidat | 2 | Enregistrer les 4 oracles au registre quality-oracles | non |
| TF-0012 | candidat | 2 | Installer les 4 skills sous ~/.claude/skills | non |
| TF-0013 | candidat | 1.5 | Exercer MISSION.md sur un run réel | non |
| TF-0014 | candidat | 1.5 | Manifeste + protocole machine « bloqué sous seuil » | non |
| TF-0015 | candidat | 1 | Coder E7-E9 (EARS/ISO 29148) dans oracle-exigences | non |

## design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0017 | candidat | 4 | Committer le chantier oracle-motion | non |
| TF-0016 | candidat | 2 | Rebuild + commit dist/*.skill | non |
| TF-0019 | candidat | 1.5 | Premier appel réel Gemini (lever R-D3) | non |
| TF-0018 | candidat | 1 | Installer les 4 skills verbes | non |
| TF-0020 | candidat | 1 | Producteur d'images complet | non |

## development

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0008 | candidat | 4 | Arbitrage D-V3 : l'amont officiel | **oui** — Décision re-payée à chaque produit construit |
| TF-0007 | candidat | 3 | Source unique des disciplines de livrable | non |
| TF-0010 | candidat | 2.7 | Gates de livrable exécutables | **oui** — 3 défauts sortis en production v0.1.0 |
| TF-0009 | candidat | 2.5 | HumanGate déléguable + dogfooding | **oui** — D-V1 payée à chaque étape 4 en mode dégradé |

## organization

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0031 | candidat | 3 | CLAUDE.md + trancher Q3-bis | non |
| TF-0052 | candidat | 3 | Trancher les 3 arbitrages « Leviers de qualité générique » (organization) | non |
| TF-0032 | candidat | 2 | Se conformer à sa propre doctrine | non |
| TF-0033 | candidat | 1 | Le registre des types devient un fichier | non |
| TF-0034 | candidat | 1 | Phase 3 : vérificateur machine des conventions | non |

## seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0030 | en_cours | 0.8 | Généraliser les moteurs ad hoc des missions | non |
| TF-0042 | candidat | 10 | livrables.py : dette() écrit noeud_id en chaîne, le schéma exige un entier | **oui** — Pipeline officiel bloqué sur la mission livrée : 11 écarts au schéma, aucun livrable écrit. Contourné à la main pour produire le rapport. |
| TF-0056 | candidat | 6 | validate.py ne contrôle aucune cohérence référentielle entre actions-*.csv et la grille | **oui** — le défaut de rattachement a traversé la génération de 8 versions du rapport sans être signalé |
| TF-0048 | candidat | 4 | Une évolution de la grille sans table de correspondance réassigne silencieusement les constats | **oui** — 9 fiches sur 13 reprises se sont révélées assignées au mauvais nœud — performance serveur dans Canonical, données structurées dans Performance, GA4 dans Génération De Pages. Détecté par recoupement manuel, aucun outil ne le signalait. |
| TF-0055 | candidat | 4 | front_matter() rend des chaînes : aucune action n'était rattachée à son nœud, en silence | **oui** — 0 action sur 10 rattachée à un nœud sur la mission livrée ; détecté en relisant le rendu, aucun contrôle ne le signalait |
| TF-0028 | candidat | 3 | validate --mission contrôle schema_version | **oui** — Observée sur la mission réelle livrée |
| TF-0026 | candidat | 2 | --json sur validate.py | non |
| TF-0027 | candidat | 2 | Trancher le working tree en cours | non |
| TF-0029 | candidat | 1 | Générateurs des 3 livrables manquants | non |
| TF-0043 | corrige | 8 | crawler.py ne lit pas sitemap.xml : l'inventaire du site est celui du graphe de liens | **oui** — Sur auxportesdelabaie.fr le crawler annonce 79 URLs découvertes ; le sitemap en déclare 286, soit 73 % du site absent de l'inventaire. |
| TF-0044 | corrige | 8 | crawler.py : la métrique pages_orphelines ne peut structurellement pas être non nulle | **oui** — « pages orphelines : 0 » affiché sur un site à 208 orphelines, découvertes seulement en confrontant sitemap et graphe de liens hors outil. |
| TF-0045 | corrige | 6 | rapport_html.py lit actions-*.csv sans dialecte : un CSV en points-virgules sort en n/d | **oui** — 10 actions sorties intégralement en « n/d » dans une version du rapport, qui se présentait par ailleurs comme complète. |
| TF-0046 | corrige | 3 | rapport_html.py échappe le markdown des fiches au lieu de le rendre | **oui** — Tableaux de preuve illisibles dans le rapport ; fiches réécrites en prose et convertisseur de tableaux développé côté mission pour contourner. |
| TF-0047 | corrige | 2 | Le « blocage principal » de la synthèse est choisi par l'ordre de la grille, pas par la gravité | **oui** — Sur la mission, le blocage affiché n'était pas le principal, et le texte repris renvoyait à « cette fiche » et à une action non encore introduite. |

## steering

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0050 | candidat | 6 | Gabarit d'agent de campagne — contraintes standard mutualisées | **oui** — ~25 prompts × ~3 Ko de contraintes dupliquées relevés sur la semaine |
| TF-0035 | candidat | 4 | versions_forges/run_precedent réellement consignés | **oui** — 0/76 entrées sur ASD malgré 2 versions livrées |
| TF-0036 | candidat | 3 | Archive du run pilote sous git | non |
| TF-0049 | candidat | 3 | TODO-FORGE : l'écriture directe contourne l'écrivain unique — la détecter par oracle | **oui** — 7 créations sans trace d'ingestion dans le registre réel |
| TF-0051 | candidat | 3 | Protocole de mesure du routage Sonnet/Opus | non |
| TF-0053 | candidat | 3 | CLAUDE.md steering découpé en références à la demande (mécanisme de TF-0037) | **oui** — trajectoire CLAUDE.md 4590→17278 octets mesurée sur git |
| TF-0037 | candidat | 1.5 | Plafond de taille CLAUDE.md + alerte | non |
| TF-0038 | candidat | 1.3 | Exercer une vraie reprise de run interrompu | non |
| TF-0039 | candidat | 1 | Circuit organization→steering opérationnel | non |
| TF-0054 | candidat | 1 | Baseline d'audit packagée par forge | non |

## tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0001 | candidat | 8 | RT-13 : champs manquants dérivés du pan | **oui** — 16 actions manuelle_utilisateur fausses au rapport ASD du 07/08 |
| TF-0003 | candidat | 4 | Audit complet sur projet libre (MiniVeille) | **oui** — Audit ASD du 07/08 déclaré dégradé (produit en travaux pendant l'audit) |
| TF-0002 | candidat | 3 | Contrôle sync registre-dette ↔ code en recette | non |
| TF-0004 | candidat | 2 | Sémantique du registre de dette | **oui** — Indicateur « 27 résolues » publié à l'inventaire steering sur une base non vérifiée |
| TF-0005 | candidat | 0.7 | Sélecteur de recette --section | **oui** — Coût mesuré à chaque itération de campagne |
| TF-0006 | candidat | 0.6 | Suite unitaire propre de forge-tests | non |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
