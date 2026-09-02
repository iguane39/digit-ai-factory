# Retours forges — Produit-02 — 20260902b

- **Contexte** : run de version « console v2 » (brief `forge/PROMPT-CONSOLE.md` v2 après analyse
  L99), et session de pose des secrets DataForSEO du même jour.
- **Références ledger** : `forge\ledger.jsonl` seq 87, 89, 96 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-02

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "<ce fichier>.md"
> ```
>
> Il rend **0** si la forme du lot est tenue, **1** sinon.

Convention de gravité : **bloquant** · **majeur** · **mineur** (voir gabarit). Ids : suite de la
séquence RT du produit (dernier employé : RT-68).

---

## Factory (`digit-ai-factory`)

Un run a livré une console avec cinq tableaux de données sans le composant de filtres du socle,
alors que la règle est écrite, outillée et jugée ailleurs dans l'écosystème. La cause n'est pas
l'ignorance de la règle : c'est que rien, dans la chaîne du produit, ne la portait.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-69 | majeur | générique | **Le brief d'un produit HTML ne cite pas les règles de socle qui s'appliquent à lui, et ses hooks ne jouent pas l'oracle correspondant.** Fait : `forge/PROMPT-CONSOLE.md` du 31/08 (issu d'une analyse L99 à 89/100) exige « tri et filtres » sans nommer L4 ni le composant de filtres de colonne ; `.claude/settings.json` du produit ne câble pas `oracle-filtres-tableau.mjs` ; la console a été livrée avec un tri maison et des listes déroulantes hors en-tête, jugée conforme par ses trois oracles. Le 02/09, l'humain a dû redemander « des tris et filtres sur les entêtes avec listbox de cases à cocher, tous / aucun, comme demandé par la factory ». Preuve : `forge/etapes/ANALYSE-L99-PROMPT-CONSOLE-20260902.md` (chapitre 3, défauts #10 et #11) et le rapport de l'agent d'exploration du 02/09 (aucune occurrence de L4, G1-G6 ni du composant dans le dépôt hors livrables `output/`). | (1) Le gabarit `CLAUDE-PRODUIT.md` porte une section « règles de socle applicables » remplie à l'ouverture du run selon le type de livrable (HTML → L4 : toute liste longue se filtre, se trie et se cherche ; composant de filtres de colonne ; R-30 : thème clair par défaut et bascule sombre ; RA-6 : l'en-tête de colonne appartient au composant après initialisation) ; (2) `settings-produit.json` câble `oracle-filtres-tableau.mjs` sur tout `*.html` du produit, comme il câble `restitution` ; (3) le skill L99, quand le livrable est une page HTML, injecte d'office ces règles dans le prompt réécrit (le protocole de tests du Ch8 cite déjà `check_html.py` : il devrait citer aussi l'oracle de filtres). |
| RT-70 | majeur | générique | **Une action « manuelle_utilisateur » a demandé à l'humain de créer une ligne de configuration que la session pouvait créer.** Fait : le 02/09, la session a demandé de coller un jeton sur une ligne `GITHUB_JETON=` « déjà présente » du `.env` ; la ligne n'existait pas (lecture de `.env.example` au lieu de `.env`). L'humain a dû la créer et a posé la règle : « l'humain doit en faire le moins possible, le plus simplement possible, le plus rapidement possible ». Deux heures plus tard, une restitution a annoncé « lignes DataForSEO préparées » sans qu'elles existent (ledger seq 89). Preuve : ledger seq 87 et 89. | `oracle-synthese` (hook restitution) refuse une action `manuelle_utilisateur` dont le libellé demande de *créer* un fichier ou une ligne (verbes : créer, ajouter une ligne, écrire dans) — une session peut toujours préparer l'emplacement et ne demander que la valeur ; et exige, pour toute puce du bloc 4, une preuve issue d'une sortie de commande (pas un renvoi « voir A-17 »). |
| RT-71 | mineur | générique | **Le hook de restitution a jugé un document qui n'était pas la restitution.** Fait : l'analyse L99 déposée en `forge/etapes/` avec `destinataire: humain` a été prise pour la synthèse de la session (« options par défaut nommées : 0 dans le fichier jugé, 2 à l'écran ») et la restitution affichée refusée, alors qu'elle était conforme. Il a fallu retirer l'analyse du frontmatter `humain` et déposer une restitution séparée. Preuve : message du hook du 02/09 ~13:50 UTC, commit `06fedfc`. | Le hook sélectionne le fichier jugé par son NOM (`RESTITUTION-*.md`) et non par le seul frontmatter, ou le gabarit réserve `destinataire: humain` aux restitutions et prescrit `destinataire: forge` pour les analyses et plans. |

## digit-ai-page-html (`digit-ai-page-html`)

Le composant du socle a été réutilisé tel quel dans la console ; deux frottements de fond,
au-delà du produit.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-72 | majeur | générique | **Le tri opt-in du composant lit le texte formaté, pas la valeur.** `armerTri` fait `parseFloat` sur `textContent` : « 1 000 » (séparateur fr-FR) se lit 1, « 0,72 $ » se lit 0,72 mais « 11 350 » se lit 11. Toute page en français qui formate ses nombres trie faux avec `tri: true`. Preuve : `assets/table-filters.js`, fonction `armerTri`, `parseFloat(String(va).replace(',', '.').replace('%', ''))` ; la console a dû armer son propre tri par `data-v` (`console/tableaux.js`). | Lire `data-v` (ou `data-sort`) sur la cellule quand il existe, sinon retirer les espaces et espaces insécables avant `parseFloat` ; le documenter dans la fiche du composant (section RA-5 : tri opt-in du composant, ajouté le 14/08). |
| RT-73 | mineur | générique | **Le composant ne se ré-initialise pas et n'expose pas son état** : `data-tf-ready` bloque un second `init`, et la sélection par colonne vit dans une fermeture. Une page dont les tableaux se re-rendent (autre campagne, recherche par texte) doit reconstruire le `<table>` et relire les cases décochées dans le DOM pour les réappliquer par des événements `change`. Preuve : `console/tableaux.js`, fonctions `relever` / `restaurer`. | Exposer `api.etat()` → `{colonne: [valeurs décochées]}` et `init(table, { etat })` pour re-rendre sans perdre la sélection ; ou une méthode `api.rafraichir(lignes)`. |

## Remarques restées au produit

Trois défauts corrigés dans le produit sans être remontés comme retours distincts, chacun avec
son verdict de généralisation ; le premier rejoint la classe portée par RT-69.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le résumé DataForSEO servi à la console ne transmettait que 10 mots-clés par marché (sur 957) et la page n'en affichait que 5 : les « mots-clés voisins » collectés étaient invisibles | route dédiée `dataforseo/<campagne>` chargée à l'ouverture de l'onglet, tous les mots-clés affichés | oui | généralisable comme classe : « un résumé qui cache la donnée principale » — remonté implicitement par RT-69 (le brief ne disait pas quoi montrer) ; pas de retour distinct |
| Le mot de passe de la console est écrit entre apostrophes dans `.env` ; une lecture shell brute l'envoyait avec ses apostrophes (faux 401, faux « écart de paramétrage ») | lecture déquotée ; mémoire de projet écrite | non | propre à la lecture shell d'un `.env` par une session ; la règle « lire un .env comme dotenv » est une hygiène de session, pas une règle de forge |
| Les tokens du composant (`--ink`, `--line`, `--blue`…) ne sont pas ceux de la console (`--texte`, `--trait`, `--primaire`…) | pont de variables dans `:root` de la console | non | la fiche du composant nomme déjà ses tokens ; un hôte qui a sa palette pose le pont, c'est prévu |

## Retours sur les documents produits

Un document produit depuis un gabarit du pilot sur ce run, la restitution du brief v2 ; le
tableau dit ce que son gabarit n'a pas fourni et ce qu'il a fallu ajouter à la main.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `forge/etapes/RESTITUTION-brief-console-v2-20260902.md` | gd-restitution (`gabarits\RESTITUTION.md`) · 2.15.0 | rien | le tableau des écarts à la lettre (7 lignes) a été refusé par l'oracle M10 « sans mode d'emploi » alors qu'il est prescrit par le gabarit lui-même | une phrase de mode de lecture avant le tableau | générique : le gabarit devrait fournir cette phrase d'emblée pour le tableau des écarts |

## prompt-analyzer-l99 (`prompt-analyzer-l99`)

Le skill a produit l'analyse qui a fondé le brief v2 ; sa sortie a demandé quatre passes de
forme avant de passer les oracles du socle.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-74 | mineur | générique | **La sortie L99 ne respecte pas d'emblée `oracle-lisibilite`** : quatre itérations (M7 ouvertures de chapitre, M10 modes de lecture des tableaux de plus de 12 lignes, M18 glose d'identifiant, traçabilité des pourcentages) sur `forge/etapes/ANALYSE-L99-PROMPT-CONSOLE-20260902.md` avant CONFORME. Preuve : historique `…ANALYSE-L99….md.oracles-historique.jsonl`, 5 passages. | `references/couches.md` prescrit, pour chaque chapitre à tableau, une phrase d'ouverture et un mode de lecture, et la glose de tout identifiant à sa première occurrence ; le skill cite la source de tout chiffre repris du prompt. |

## Confirmations positives

- **Le composant de filtres du socle s'est branché en une heure** sur une console qui ne le
  connaissait pas : API `init`, `data-filterable`, compteur `data-tf-count-for`, état vide,
  tout a fonctionné au premier essai une fois le pont de tokens posé.
- **`oracle-lisibilite` a rendu les documents meilleurs** : chaque refus (M7, M10, M18) était
  fondé et la correction courte.

## Ordre recommandé

RT-69 d'abord (c'est la cause de l'aller-retour humain le plus coûteux), RT-70 ensuite (règle
humaine posée en séance), RT-72 (tri faux silencieux), puis RT-71 et RT-73.
