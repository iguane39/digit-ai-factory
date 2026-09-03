# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=62f1fa31a0eb archive=d3c801ad4540 · dernier événement: 2026-09-03T14:25:22.185Z -->

**9 actifs** (candidat 0 · décidé 6 · en cours 0 · corrigé 3 · écarté 0) · **782 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0674 | decide | 12.5 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appliqué | non |
| TF-0682 | decide | 10 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | non |
| TF-0676 | decide | 6.7 | Aucun script de capture du produit ne produit systématiquement une pleine page | non |

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0789 | corrige | 8 | digit-ai-schemas : l exemple de reference du skill deborde a 390 px (16 constats v1_overflow, tableaux et blocs de code larges) et n a pas de verdict de lecture par un tiers (T1/T2 du 02/09 non traites) — un exemple de reference qui ne tient pas ses propres regles enseigne le defaut | **oui** — render_page.py --widths 390 sur l exemple de reference : 16 constats v1_overflow, mesures le 03/09 avant et apres TF-0784 ; oracle-lecture-tiers du 02/09 : T1 + T2 en defaut sur la meme page |

## digit-ai-forge-observability

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0790 | corrige | 6 | forge-observability : surveiller le tableau de bord des récidives ENTRE les runs — une récidive ou une classe de plus par rapport au relevé précédent est une dérive | **oui** — 50 récidives déclarées en prose sur 788 items (6 %), 1 → 11 → 15 → 19 par semaine du 03/08 au 30/08 ; trois récidives en quatre jours sur un seul projet (TF-0757) ; aucun compteur ne les voyait avant le 03/09 |

## forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0749 | decide | 10 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention : elle est jouable | **oui** — surcout fixe mesure a 0,386 s par mutant contre 28,2 s de rejeu actuel ; la condition de non-perte de l'etude n'avait aucun executant avant ce lot |
| TF-0748 | decide | 5 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois sur un projet reel avant qu'il devienne le defaut | **oui** — campagne mesuree a 67 min dont 54 de mutation, 28,2 s par mutant ; surcout fixe mesure a 0,386 s |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0549 | decide | 10 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : `Produit-07` a un forge\retours\ mais rien de ce qui s'y fait n'est suivi | **oui** — mesure le 24/08 : sur les trois produits localisables du poste, DEUX sont en defaut d'heritage et UN n'a jamais ete instancie — soit zero produit conforme sur trois. Celui decouvert aujourd'hui cumule quatre artefacts absents et l'absence totale de depot git : tout travail qui y serait fait est hors de portee d'un `git log`, d'un `git diff` et de toute restauration. |
| TF-0788 | corrige | 8 | pilot : une montee de version d un skill dans la journee n est SUE d aucune forge qui le consomme — la recette de forge-tests a change de verdict entre deux executions parce que check_html et render_page avaient change de regles sur le poste, sans qu aucun signal ne lui parvienne | **oui** — le 02/09, la section dashboard de la recette de forge-tests est passee de vert a rouge entre deux executions sans qu un octet ait bouge dans son depot (mesure de TF-0786) ; sans signal cote consommateur, le meme diagnostic se refait a la main a chaque montee de version |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
