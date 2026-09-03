# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=348efc45a017 archive=79fea665313e · dernier événement: 2026-09-03T09:00:39.846Z -->

**8 actifs** (candidat 1 · décidé 7 · en cours 0 · corrigé 0 · écarté 0) · **781 archivés**.
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
| TF-0784 | decide | 15 | digit-ai-schemas : l'asset de reference embarque une COPIE FIGEE de table-filters.js (donc d'avant les correctifs du 02/09) et porte neuf chapitres sans sommaire (L25) | **oui** — une copie figee d'un composant corrige trois fois le meme jour, dans le meme depot, hors de portee des trois correctifs ; 1 constat L25 reel sur un asset de reference |

## forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0749 | decide | 10 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention : elle est jouable | **oui** — surcout fixe mesure a 0,386 s par mutant contre 28,2 s de rejeu actuel ; la condition de non-perte de l'etude n'avait aucun executant avant ce lot |
| TF-0748 | decide | 5 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois sur un projet reel avant qu'il devienne le defaut | **oui** — campagne mesuree a 67 min dont 54 de mutation, 28,2 s par mutant ; surcout fixe mesure a 0,386 s |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0549 | decide | 10 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : `Produit-07` a un forge\retours\ mais rien de ce qui s'y fait n'est suivi | **oui** — mesure le 24/08 : sur les trois produits localisables du poste, DEUX sont en defaut d'heritage et UN n'a jamais ete instancie — soit zero produit conforme sur trois. Celui decouvert aujourd'hui cumule quatre artefacts absents et l'absence totale de depot git : tout travail qui y serait fait est hors de portee d'un `git log`, d'un `git diff` et de toute restauration. |
| TF-0788 | candidat | 8 | pilot : une montee de version d un skill dans la journee n est SUE d aucune forge qui le consomme — la recette de forge-tests a change de verdict entre deux executions parce que check_html et render_page avaient change de regles sur le poste, sans qu aucun signal ne lui parvienne | **oui** — le 02/09, la section dashboard de la recette de forge-tests est passee de vert a rouge entre deux executions sans qu un octet ait bouge dans son depot (mesure de TF-0786) ; sans signal cote consommateur, le meme diagnostic se refait a la main a chaque montee de version |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
