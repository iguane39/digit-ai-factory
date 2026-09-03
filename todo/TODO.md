# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=ce06cd466e72 archive=d3c801ad4540 · dernier événement: 2026-09-03T19:07:47.872Z -->

**21 actifs** (candidat 11 · décidé 6 · en cours 1 · corrigé 3 · écarté 0) · **782 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0674 | decide | 12.5 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appliqué | non |
| TF-0682 | decide | 10 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | non |
| TF-0676 | decide | 6.7 | Aucun script de capture du produit ne produit systématiquement une pleine page | non |
| TF-0802 | candidat | 1 | La 404 personnalisee, menu et toutes langues : un standard d'office pour tout site cree par la factory | non |

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0789 | corrige | 8 | digit-ai-schemas : l exemple de reference du skill deborde a 390 px (16 constats v1_overflow, tableaux et blocs de code larges) et n a pas de verdict de lecture par un tiers (T1/T2 du 02/09 non traites) — un exemple de reference qui ne tient pas ses propres regles enseigne le defaut | **oui** — render_page.py --widths 390 sur l exemple de reference : 16 constats v1_overflow, mesures le 03/09 avant et apres TF-0784 ; oracle-lecture-tiers du 02/09 : T1 + T2 en defaut sur la meme page |

## digit-ai-forge-observability

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0790 | corrige | 6 | forge-observability : surveiller le tableau de bord des récidives ENTRE les runs — une récidive ou une classe de plus par rapport au relevé précédent est une dérive | **oui** — 50 récidives déclarées en prose sur 788 items (6 %), 1 → 11 → 15 → 19 par semaine du 03/08 au 30/08 ; trois récidives en quatre jours sur un seul projet (TF-0757) ; aucun compteur ne les voyait avant le 03/09 |

## forge-conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0799 | candidat | 1 | forge-conception : remplacer les frontieres \b ASCII des gardes lexicales par des frontieres Unicode - E8 lit elle dans reelle, et cote pilot mesure ne matche jamais | **oui** — delta v0.5.0 : critere « exemples issus de l arborescence reelle » refuse pour pronom elle ; enonce reecrit pour esquiver la garde (seq 125, 13 FAIL E3/E8 dont 3 de cette classe) |

## forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0796 | candidat | 1 | forge-design : un composant genere par script et affiche en sur-couche porte TOUT son habillage depuis les jetons - jamais le rendu par defaut du navigateur, et color-scheme est declare par theme | **oui** — capture utilisateur du 2026-09-01 (mots de l utilisateur : des trucs moches sortis de nulle part) ; composant pourtant PASS campagne v0.4.0 api 483/483 et suite 989/989 |
| TF-0797 | candidat | 1 | forge-design : semantique des declencheurs - une action se declenche par un bouton qui a l air d un bouton, un lien navigue, la variante fantome n est jamais l unique acces a une fonctionnalite | **oui** — mots de l utilisateur du 2026-09-01 : mets-le sous forme de bouton, pas de lien - le lien a une signification particuliere, tout comme le bouton a la sienne ; la veille, premier retour je ne vois pas de changement sur la meme fonctionnalite livree |
| TF-0800 | candidat | 1 | forge-design : B-T2/B-T3 declarent morte une bascule cablee par ecouteur delegue et cle en constante - documenter la convention exigee ou elargir l heuristique | **oui** — session du 2026-09-01 : app.js reecrit (ecouteur attache, cle en litteral, data-theme-toggle) pour obtenir le PASS - l adaptation a une vertu (verifiabilite) mais la regle jugeait une convention, pas le comportement |

## forge-development

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0798 | candidat | 20 | forge-development : toute adresse de fichier statique porte la version de l application (ou une empreinte), des le gabarit de projet, et la route MEP le verifie | **oui** — mesure du 2026-09-01 : curl -sI sur app.css de production = 200, feuille a jour, aucun Cache-Control, pendant que le poste utilisateur rendait une feuille d avant le composant |

## forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0749 | decide | 10 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention : elle est jouable | **oui** — surcout fixe mesure a 0,386 s par mutant contre 28,2 s de rejeu actuel ; la condition de non-perte de l'etude n'avait aucun executant avant ce lot |
| TF-0748 | decide | 5 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois sur un projet reel avant qu'il devienne le defaut | **oui** — campagne mesuree a 67 min dont 54 de mutation, 28,2 s par mutant ; surcout fixe mesure a 0,386 s |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0791 | en_cours | 6.7 | Cascade Intention > Strategie > Tactique > Operationnel + test retro : la definition des demandes ne capture pas l'intention initiale de l'utilisateur | **oui** — etude output/03-etudes/20260901-etude-opportunite-dataforseo.md : conforme a sa definition, PASS a ses controles, et refusee par son destinataire — sept questions du retour du 01/09 sans reponse dans le texte ; cout paye : une etude entiere a redefinir et rejouer |
| TF-0549 | decide | 10 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : `Produit-07` a un forge\retours\ mais rien de ce qui s'y fait n'est suivi | **oui** — mesure le 24/08 : sur les trois produits localisables du poste, DEUX sont en defaut d'heritage et UN n'a jamais ete instancie — soit zero produit conforme sur trois. Celui decouvert aujourd'hui cumule quatre artefacts absents et l'absence totale de depot git : tout travail qui y serait fait est hors de portee d'un `git log`, d'un `git diff` et de toute restauration. |
| TF-0793 | candidat | 1 | pilot : la declaration racine_web demandee par TF-0654 n'est lue par AUCUN script — le critere de cloture du lot est hors de portee du produit | **oui** — deux constats HORS RACINE re-rendus a chaque releve du parc pour ce produit, et pour tout produit dont la racine web n'est pas la racine du depot |
| TF-0794 | candidat | 1 | pilot : le remede que R-42 prescrit ne solde pas le defaut qu'il vise, et l'ecriture concurrente du ledger collisionne par construction | **oui** — un FAIL R-42 incurable a chaque conformite tant que la collision n'est pas consommable ; le lot 20260901b a compile son controle de completude SANS voir la seq 75 ecrite 3 minutes plus tot par l'autre session |
| TF-0795 | candidat | 1 | pilot : CI3 rend PASS sur des controles qui declarent leurs codes de sortie sans posseder AUCUN chemin d'echec — etre declare n'est pas etre rendu | **oui** — un controle qui ne sait pas echouer rassure au lieu de juger — les trois defauts dormants de TF-0679 ont coute un chantier entier avant d'etre vus |
| TF-0801 | candidat | 1 | pilot : R-19 sans voie de rectification pour une cle malformee de versions_forges, et le depot digit-ai-queue innommable sous son vrai nom | **oui** — cloture du run v0.6.0 : run_open seq 134 avec cle digit-ai-queue (nom reel du depot au bootstrap) -> FAIL R-19 ; rectification seq 141 deposee et SANS EFFET ; issue prise : cle reecrite en forme canonique, geste que la doctrine reprouve, choisi faute de voie |
| TF-0788 | corrige | 8 | pilot : une montee de version d un skill dans la journee n est SUE d aucune forge qui le consomme — la recette de forge-tests a change de verdict entre deux executions parce que check_html et render_page avaient change de regles sur le poste, sans qu aucun signal ne lui parvienne | **oui** — le 02/09, la section dashboard de la recette de forge-tests est passee de vert a rouge entre deux executions sans qu un octet ait bouge dans son depot (mesure de TF-0786) ; sans signal cote consommateur, le meme diagnostic se refait a la main a chaque montee de version |

## seo-geo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0792 | candidat | 6 | Ingerer l'expertise « donnees de recherche multilingues » (references/SEO-RECHERCHE.md du pilot) dans le corpus propre de forge-seo-geo | **oui** — l'expertise capitalisee vit chez le pilot ; un run forge-seo-geo qui ne la charge pas re-derivera la doctrine de cadence et le pattern d'escalier depuis zero, comme l'etude 20260901a l'a fait avant d'etre refusee |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
