# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=8a70ba2008bb archive=d3c801ad4540 · dernier événement: 2026-09-05T14:45:18.090Z -->

**37 actifs** (candidat 3 · décidé 9 · en cours 1 · corrigé 24 · écarté 0) · **782 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0674 | decide | 12.5 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appliqué | non |
| TF-0682 | decide | 10 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | non |
| TF-0676 | decide | 6.7 | Aucun script de capture du produit ne produit systématiquement une pleine page | non |
| TF-0802 | corrige | 1 | La 404 personnalisee, menu et toutes langues : un standard d'office pour tout site cree par la factory | non |
| TF-0808 | corrige | 1 | digit-ai-factory : M-9 fonde sa preuve sur « le controle executable du produit » et ne nomme pas le controle generique du socle, qui existe desormais | **oui** — la realisation de reference du patron a coute 14 pages et 5 controles d'oracle sur un seul produit (P-2, references/PATRONS-EPROUVES.md) ; tant que M-9 ne nomme pas le controle du socle, chaque produit a surface web repaie cette ecriture a sa MEP |
| TF-0809 | corrige | 1 | digit-ai-factory : M-9 (a) ne juge que les adresses inconnues SOUS un prefixe, la racine sans prefixe que l'exigence 4 de P-2 demande sort du jugement | **oui** — ecart constate entre les cinq exigences de P-2 et les trois cas de M-9 : une exigence sur cinq n'est jugee qu'a moitie, et l'ecart n'etait visible qu'en traduisant le patron en mesures — aucune relecture du texte ne l'avait signale entre le 03/09 et le 05/09 |
| TF-0810 | corrige | 1 | digit-ai-factory : la frontiere Unicode prescrite par TF-0799 elargit les gardes sur les chiffres et le tiret bas — la generalisation exacte de \b est [\p{L}\p{N}_] | **oui** — Banc de mesure joue le 05/09/2026 sur les trois formes de frontiere : ASCII 3/5, forme prescrite 3/5 (deux faux positifs neufs : elle2, elle_id), forme retenue 5/5. Sans ce constat, la descente de TF-0799 vers oracle-synthese S21 et vers les autres forges introduit deux faux positifs mesures la ou elle corrige un faux positif. |
| TF-0812 | corrige | 1 | digit-ai-factory : le gate d'ecriture C7 a impute a l'edition en cours deux constats presents a l'identique dans la version precedente du fichier | **oui** — Preuve reproductible : `check_markdown.py` joue sur `git show 90d3767:skills/enumere-la-surface/references/typologie-surface.md` (version anterieure a toute edition de ce run) rend les deux memes constats M7 (lignes 6 et 92) que le gate a ensuite imputes a l'edition suivante. Cout mesure : deux passes consommees sur trois, et cinq corrections de forme hors perimetre du lot. |

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0815 | decide | 1 | digit-ai-forge-agents : le partage au delta identifie un constat par une ligne tronquee a deux raisons, donc au troisieme constat du meme oracle le gate d ecriture s ouvre sur du travail neuf | **oui** — Mesure du 05/09/2026 : deux notes Markdown identiques a un chapitre pres — l'une avec deux chapitres ouverts sur un tableau nu, l'autre avec trois — passees a run-oracles.mjs --profil digit-ai --niveau note. Les deux lignes rendues sont identiques mot pour mot, seul le nom de fichier differe : « [Lisibilite d'un document (Markdown)] <fichier> — M7 chapitre sans ouverture : « Chapitre A » (ligne 5) ... ; M7 chapitre sans ouverture : « Chapitre B » (ligne 11) ... ». Le troisieme chapitre fautif n'apparait dans aucune des deux. Apres normalisation du chemin (correction de TF-0806, commit 966402a), ces deux lignes produisent la meme cle : un fichier dont HEAD porte deja deux constats du meme oracle et dont l'edition en ajoute un troisieme obtient « 0 neuf » et l'ecriture est acceptee. |
| TF-0816 | decide | 1 | digit-ai-forge-agents : le delta du gate d ecriture se rend silencieusement non calculable quand la cible est un chemin relatif, et le repli n est pas declare | **oui** — Mesure du 05/09/2026, meme fichier et meme edition que la reproduction de TF-0806 (run/rapport-jouet.md du depot de la forge, dont HEAD porte un constat M7, edition d'une phrase sans rapport en fin de fichier). Avec un file_path ABSOLU : delta=true, 1 neuf, 1 preexistant. Avec le meme file_path RELATIF (« run/rapport-jouet.md ») : delta=false, 2 neufs, 0 preexistant, et le verdict bloquant ne mentionne nulle part que le delta n'a pas ete calcule. Trace obtenue en instrumentant temporairement le hook (ligne de trace retiree avant commit). |
| TF-0789 | corrige | 8 | digit-ai-schemas : l exemple de reference du skill deborde a 390 px (16 constats v1_overflow, tableaux et blocs de code larges) et n a pas de verdict de lecture par un tiers (T1/T2 du 02/09 non traites) — un exemple de reference qui ne tient pas ses propres regles enseigne le defaut | **oui** — render_page.py --widths 390 sur l exemple de reference : 16 constats v1_overflow, mesures le 03/09 avant et apres TF-0784 ; oracle-lecture-tiers du 02/09 : T1 + T2 en defaut sur la meme page |
| TF-0817 | corrige | 5 | digit-ai-forge-agents : l'historique du depot porte 200 constats de la porte de publication (1 message, 199 contenus de fichiers anciens — fiches et fixtures d'experts, manifest des oracles) — reecrire l'histoire selon le mode operatoire du pilot (TF-0752), puis push force | **oui** — 200 constats bloquants de la porte sur un depot public qui porte les skills installes chez tous les produits ; chaque publication de cette forge contredit la regle « porte verte avant push » tant que l'histoire n'est pas reecrite |
| TF-0806 | corrige | 1 | digit-ai-forge-agents : le delta neufs/preexistants du hook d'ecriture est inoperant des que le constat porte le chemin du fichier | **oui** — Mesure du 05/09/2026 sur Produit-60 : une edition de 5 lignes dans docs/run-playbook.md, dans un chapitre situe 250 lignes plus bas, a ete BLOQUEE en passe 1/3 sur deux constats M7 visant les chapitres « Matrice de contexte (Phase -1) » (ligne 30) et « Options de cadrage du CLI » (ligne 193). Les deux constats sont presents A L'IDENTIQUE dans HEAD : verifie en rejouant run-oracles.mjs sur `git show HEAD:docs/run-playbook.md` ecrit dans un dossier temporaire — sortie mot pour mot identique, seul le chemin differe. Le hook a lui-meme declare « + 1 constat(s) PREEXISTANT(S) » : la seule ligne sans chemin, le bilan « NON CONFORME — 1 oracle(s) en echec ». Cout paye : deux chapitres sans rapport avec l'edition ont du etre reecrits pour livrer TF-0798. |

## digit-ai-forge-conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0814 | decide | 1 | digit-ai-forge-conception : les trois exigences socle candidates ont le meme trou que la surface implicite avant TF-0811 — leur ecart vit en prose, aucun oracle ne le lit | **oui** — Mesure du 05/09/2026 sur le depot de la forge : sur les onze oracles, zero ne prend EXIGENCES.md en entree, et les huit qui jugent EXIGENCES.json n'ont aucun champ a lire pour ces trois candidates. Cout de reference : TF-0811 a comble le meme trou pour la surface implicite en une passe, avec 7 cas de fixtures et un champ de quatre sous-champs — le meme profil de travail rendrait jugeables trois lois transverses de plus. |
| TF-0818 | candidat | 3 | digit-ai-forge-conception : le sceau d'une vue dérivée prouve sa provenance, jamais son contenu — oracle-tracabilite T3 rend PASS sur une vue amputée d'un tiers | **oui** — mesure du 05/09 : un tiers d'une vue dérivée retiré, deux écarts déclarés perdus, oracle-tracabilite PASS et exit 0 — la perte d'une décision opposable est invisible à tout oracle de la forge |
| TF-0804 | corrige | 6 | forge-conception : la 404 par langue entre dans la surface implicite proposee d'office par enumere-la-surface (loi transverse n 3), avec ses cinq exigences comme criteres d'acceptation candidats | **oui** — meme fait que TF-0802 : 404 nue en production une semaine, vue par l'exploitant et par aucune revue |
| TF-0811 | corrige | 1 | Produit-62 : l'ecart explicite d'un candidat de la surface implicite n'a nulle part ou s'ecrire dans EXIGENCES.json — la loi n° 3 ne peut qu'avertir | **oui** — Mesure du 05/09/2026 : sur les trois fixtures de la branche TF-0804 du self-test, le cas « surface web sans 404 » ne peut rendre qu'un SANS_OBJET — un FAIL refuserait aussi les deux ecarts que P-2 declare legitimes, sans qu'aucun champ ne permette de les declarer. Onze candidats d'office concernes, un seul (la 404) outille aujourd'hui. |

## digit-ai-forge-development

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0813 | candidat | 5 | digit-ai-forge-development : l'historique du depot porte 89 constats de la porte de publication (38 messages de commit, 51 chemins anciens) — reecrire l'histoire selon le mode operatoire du pilot (TF-0752), puis push force | **oui** — 89 constats bloquants de la porte sur un depot public ; une regle « porte verte avant push » que chaque publication de cette forge contredit tant que l'histoire n'est pas reecrite |

## digit-ai-forge-observability

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0790 | corrige | 6 | forge-observability : surveiller le tableau de bord des récidives ENTRE les runs — une récidive ou une classe de plus par rapport au relevé précédent est une dérive | **oui** — 50 récidives déclarées en prose sur 788 items (6 %), 1 → 11 → 15 → 19 par semaine du 03/08 au 30/08 ; trois récidives en quatre jours sur un seul projet (TF-0757) ; aucun compteur ne les voyait avant le 03/09 |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0803 | corrige | 6 | forge-tests : un controle executable generique de la 404 (adresse inconnue par langue, prefixe respecte, non-HTML nu, statut 404 conserve, noindex), consommable comme preuve du controle M-9 de la MEP | **oui** — un site multilingue a servi le 404 nu du serveur en production du 25/08 au 01/09 sans qu'aucun controle le voie (TF-0802) ; la realisation de reference a coute 14 pages et 5 controles sur un seul produit |

## forge-conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0799 | corrige | 1 | forge-conception : remplacer les frontieres \b ASCII des gardes lexicales par des frontieres Unicode - E8 lit elle dans reelle, et cote pilot mesure ne matche jamais | **oui** — delta v0.5.0 : critere « exemples issus de l arborescence reelle » refuse pour pronom elle ; enonce reecrit pour esquiver la garde (seq 125, 13 FAIL E3/E8 dont 3 de cette classe) |

## forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0796 | corrige | 1 | forge-design : un composant genere par script et affiche en sur-couche porte TOUT son habillage depuis les jetons - jamais le rendu par defaut du navigateur, et color-scheme est declare par theme | **oui** — capture utilisateur du 2026-09-01 (mots de l utilisateur : des trucs moches sortis de nulle part) ; composant pourtant PASS campagne v0.4.0 api 483/483 et suite 989/989 |
| TF-0797 | corrige | 1 | forge-design : semantique des declencheurs - une action se declenche par un bouton qui a l air d un bouton, un lien navigue, la variante fantome n est jamais l unique acces a une fonctionnalite | **oui** — mots de l utilisateur du 2026-09-01 : mets-le sous forme de bouton, pas de lien - le lien a une signification particuliere, tout comme le bouton a la sienne ; la veille, premier retour je ne vois pas de changement sur la meme fonctionnalite livree |
| TF-0800 | corrige | 1 | forge-design : B-T2/B-T3 declarent morte une bascule cablee par ecouteur delegue et cle en constante - documenter la convention exigee ou elargir l heuristique | **oui** — session du 2026-09-01 : app.js reecrit (ecouteur attache, cle en litteral, data-theme-toggle) pour obtenir le PASS - l adaptation a une vertu (verifiabilite) mais la regle jugeait une convention, pas le comportement |

## forge-development

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0798 | corrige | 20 | forge-development : toute adresse de fichier statique porte la version de l application (ou une empreinte), des le gabarit de projet, et la route MEP le verifie | **oui** — mesure du 2026-09-01 : curl -sI sur app.css de production = 200, feuille a jour, aucun Cache-Control, pendant que le poste utilisateur rendait une feuille d avant le composant |

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
| TF-0805 | corrige | 9 | pilot : les gardes lexicales d'oracle-synthese (S21 et voisines) emploient des frontieres de mot ASCII (la sequence barre-oblique-inverse b) — un motif accentue comme « mesuree » n'est jamais atteint ; passer aux frontieres Unicode avec fixture double sens | **oui** — un motif accentue jamais atteint = une regle qui ne juge jamais ce qu'elle croit juger (S21 sur « mesuree ») ; 3 des 13 FAIL du delta v0.5.0 du produit 02 relevaient de cette classe cote conception |
| TF-0788 | corrige | 8 | pilot : une montee de version d un skill dans la journee n est SUE d aucune forge qui le consomme — la recette de forge-tests a change de verdict entre deux executions parce que check_html et render_page avaient change de regles sur le poste, sans qu aucun signal ne lui parvienne | **oui** — le 02/09, la section dashboard de la recette de forge-tests est passee de vert a rouge entre deux executions sans qu un octet ait bouge dans son depot (mesure de TF-0786) ; sans signal cote consommateur, le meme diagnostic se refait a la main a chaque montee de version |
| TF-0807 | corrige | 6 | pilot : l'ingestion d'un lot remis par une FORGE pseudonymise la forge comme un produit client (digit-ai-forge-development → Produit-60, entree ajoutee a la table hors depot) — une forge est publique, son nom ne se cache pas | **oui** — un demandeur illisible au registre (Produit-60) pour un constat de forge, une entree parasite dans la table des pseudonymes, un R-47 joue a vide — a chaque lot de forge tant que ce n'est pas corrige |
| TF-0793 | corrige | 1 | pilot : la declaration racine_web demandee par TF-0654 n'est lue par AUCUN script — le critere de cloture du lot est hors de portee du produit | **oui** — deux constats HORS RACINE re-rendus a chaque releve du parc pour ce produit, et pour tout produit dont la racine web n'est pas la racine du depot |
| TF-0794 | corrige | 1 | pilot : le remede que R-42 prescrit ne solde pas le defaut qu'il vise, et l'ecriture concurrente du ledger collisionne par construction | **oui** — un FAIL R-42 incurable a chaque conformite tant que la collision n'est pas consommable ; le lot 20260901b a compile son controle de completude SANS voir la seq 75 ecrite 3 minutes plus tot par l'autre session |
| TF-0795 | corrige | 1 | pilot : CI3 rend PASS sur des controles qui declarent leurs codes de sortie sans posseder AUCUN chemin d'echec — etre declare n'est pas etre rendu | **oui** — un controle qui ne sait pas echouer rassure au lieu de juger — les trois defauts dormants de TF-0679 ont coute un chantier entier avant d'etre vus |
| TF-0801 | corrige | 1 | pilot : R-19 sans voie de rectification pour une cle malformee de versions_forges, et le depot digit-ai-queue innommable sous son vrai nom | **oui** — cloture du run v0.6.0 : run_open seq 134 avec cle digit-ai-queue (nom reel du depot au bootstrap) -> FAIL R-19 ; rectification seq 141 deposee et SANS EFFET ; issue prise : cle reecrite en forme canonique, geste que la doctrine reprouve, choisi faute de voie |

## seo-geo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0792 | candidat | 6 | Ingerer l'expertise « donnees de recherche multilingues » (references/SEO-RECHERCHE.md du pilot) dans le corpus propre de forge-seo-geo | **oui** — l'expertise capitalisee vit chez le pilot ; un run forge-seo-geo qui ne la charge pas re-derivera la doctrine de cadence et le pattern d'escalier depuis zero, comme l'etude 20260901a l'a fait avant d'etre refusee |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
