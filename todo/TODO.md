# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=695283e9c6ec archive=30285155be8e · dernier événement: 2026-09-02T16:54:10.695Z -->

**11 actifs** (candidat 5 · décidé 6 · en cours 0 · corrigé 0 · écarté 0) · **777 archivés**.
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
| TF-0784 | candidat | 15 | digit-ai-schemas : l'asset de reference embarque une COPIE FIGEE de table-filters.js (donc d'avant les correctifs du 02/09) et porte neuf chapitres sans sommaire (L25) | **oui** — une copie figee d'un composant corrige trois fois le meme jour, dans le meme depot, hors de portee des trois correctifs ; 1 constat L25 reel sur un asset de reference |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0786 | candidat | 10 | forge-tests : un verdict de la recette (dashboard) depend des oracles du skill de pages INSTALLES sur le poste, non epingles — les regles ont change PENDANT la session (L25, render_page) sans qu'un octet du depot ne bouge | **oui** — une section de recette passee de vert a rouge entre deux executions sans changement du depot ; 2 constats (L17, render_page) restent non instruits sur le tableau de bord de la forge |
| TF-0785 | candidat | 7.5 | forge-tests : la section lint de la recette est rouge depuis une derive de version de ruff non epinglee (ruff>=0.5, 0.16.1 installe) — 100 constats anterieurs a la campagne, S-01 non tenu | **oui** — S-01 non prononcable sur la recette entiere depuis une date inconnue, pour 100 constats qu'aucun commit n'a introduits — le verdict depend de la version d'un outil que personne n'a epinglee |

## forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0749 | decide | 10 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention : elle est jouable | **oui** — surcout fixe mesure a 0,386 s par mutant contre 28,2 s de rejeu actuel ; la condition de non-perte de l'etude n'avait aucun executant avant ce lot |
| TF-0748 | decide | 5 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois sur un projet reel avant qu'il devienne le defaut | **oui** — campagne mesuree a 67 min dont 54 de mutation, 28,2 s par mutant ; surcout fixe mesure a 0,386 s |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0549 | decide | 10 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : `Produit-07` a un forge\retours\ mais rien de ce qui s'y fait n'est suivi | **oui** — mesure le 24/08 : sur les trois produits localisables du poste, DEUX sont en defaut d'heritage et UN n'a jamais ete instancie — soit zero produit conforme sur trois. Celui decouvert aujourd'hui cumule quatre artefacts absents et l'absence totale de depot git : tout travail qui y serait fait est hors de portee d'un `git log`, d'un `git diff` et de toute restauration. |
| TF-0787 | candidat | 10 | pilot : les trois familles HTML de la bibliotheque de gabarits (dossier d architecture, dossier d exploitation, rapport de donnees) ne portent pas de sommaire lateral collant — la regle neuve « sommaire visible en permanence » les met en defaut au rendu | **oui** — deux controles du banc du pilot rouges sur le parc reel depuis l entree de la regle ; trois familles de gabarits que tout produit instancie rendent des documents que le socle refuse desormais |
| TF-0752 | candidat | 5 | L'HISTOIRE du depot porte encore 200 noms de clients, et aucun outil du parc ne peut les en retirer | **oui** — 200 constats de regle C4 avec 0 constat sur l'arbre de travail ; toute publication du pilot reste refusee |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
