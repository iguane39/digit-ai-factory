# Retours forges — Produit-02 — 20260912a

- **Contexte** : session du 12/09/2026, mandat humain « 13a, A58, A59, A60, A61, A62, A63 » — résorption de la conformité du dépôt (T-101), remise du poste en état de fraîcheur (R-19), régénération du rapport d'audit SEO, console en cartes sous 640 px.
- **Références ledger** : `forge\ledger.jsonl` seq 155, 156, 157 (entrées `type: retour`) ; contexte des étapes seq 151 (A-61) et 153 (A-63).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-12

## Factory (`digit-ai-factory`)

Trois frictions subies pendant la résorption de la conformité — deux outils du pilot lancés depuis un dépôt produit, une règle sans voie de déclaration.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-88 | majeur | générique | **`scripts/readme-dossiers.mjs` et `scripts/generer-lisezmoi-output.mjs`, lancés depuis un dépôt PRODUIT sans `--base`, résolvent la racine du PILOT et y écrivent.** Fait : le 12/09 à 06:50 UTC, `node c:\dev\digit-ai-factory\scripts\readme-dossiers.mjs` joué depuis `c:\dev\Produit-02.com` a imprimé « README régénérés (5) : input\README.md · input\00-retours\README.md · … » et `generer-lisezmoi-output.mjs` « index régénéré → c:\dev\digit-ai-factory\output\LISEZMOI.md (269 livrables) » : 6 fichiers suivis du pilot modifiés (`git status` du pilot), annulés par `git checkout`. L'option `--base <dépôt>` existe (en-tête du script, ligne 26) mais rien ne l'exige et le verdict ne NOMME pas le dépôt écrit avant de l'écrire. Convention découverte en lisant le code après coup. | Un outil qui ÉCRIT prend pour racine le `cwd` quand celui-ci porte un `CLAUDE.md`, ou refuse sans `--base` explicite ; dans tous les cas, la sortie nomme le dépôt cible AVANT d'écrire (« dépôt : c:\dev\… »). Classe : contrôle ancré sur un chemin que la session ne charge pas — ici un écrivain, pas un contrôle. |
| RT-89 | majeur | générique | **`scripts/recopier-heritage.mjs` dépose `gabarits/web/robots.txt` et `llms.txt` à la RACINE du dépôt produit, alors que ce produit sert `site/`.** Fait : après recopie le 12/09, `git status` montre `?? llms.txt` et `?? robots.txt` à la racine, à l'état de gabarit (« # {Produit} », « {Ce que fait le produit…} ») ; le site sert `site/robots.txt` et `site/llms.txt` (ce dernier généré à chaque build par `build/build.mjs`, contrôlé par `build/check-llms.mjs`). `oracle-conformite-projet` R-27 juge ensuite « 2 robots.txt ouverts » — dont un non servi. `HERITAGE.json` (entrées 90-99) porte la cible en dur (`"cible": "robots.txt"`) avec le motif « le contenu diverge légitimement ». Contourné : les deux fichiers de racine réduits à des pointeurs vers `site/`. | `HERITAGE.json` accepte une cible DÉCLARÉE par le produit (ex. `site/`) ou saute l'artefact quand une cible déclarée existe déjà ; R-27 ne juge qu'un robots.txt par surface servie. Même classe que RT-88 : l'emplacement est codé en dur là où l'exécution réelle en charge un autre. |
| RT-90 | mineur | générique | **R-42 (intégrité du ledger) rend FAIL sans voie de déclaration pour une antériorité.** Fait : `oracle-conformite-projet` du 12/09 : « intégrité rompue — 5 écart(s) : seq 118 là où 119 était attendu · seq 127 … · horodatage décroissant (2026-09-05T14:17:41Z après 2026-09-05T15:05:00Z) · seq 133 là où 129 était attendu » — écarts du 05/09, antérieurs à la session. Un journal en ajout seul ne se réécrit pas (c'est la règle même) ; le verdict FAIL est donc permanent par construction, et la seule « correction » possible violerait la règle qu'il protège. Le relevé du produit restera FAIL sur cette seule règle (33 PASS, 1 FAIL, 6 sans objet le 12/09). | Tolérance déclarée : une entrée `type: antériorité` (ou un champ du ledger) datée, qui borne les écarts connus ; R-42 ne juge alors que ce qui suit. Classe : règle qui interdit son propre remède. |

## Remarques restées au produit

Trois défauts corrigés chez le produit sans être remontés, chacun avec son verdict de généralisation : les trois sont des instances de classes déjà connues, aucune règle nouvelle n'en sort.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Deux attentes de l'oracle navigateur de la console étaient des constantes (« 957 mots-clés attendus le 02/09 », « première campagne ») : rouges à la deuxième campagne sans aucun défaut du produit | `build/check-console-ui.py` lit désormais l'attendu dans la série copiée pour le test (1 117 au dernier relevé par marché, 2 campagnes) | non | rien de généralisable : la classe « un contrôle mesure une grandeur figée au lieu de la lire dans sa source » existe déjà au référentiel (contrôle mesurant une grandeur corrélée) — instance locale, corrigée localement, sans règle nouvelle |
| Le contenu source des fiches SEO (`runs/…/fiches-com.py`) tenait la fiche 4 en reprise « partiel T3 » alors que la fiche générée disait « non-conforme T1 » depuis le 06/09 : deux sources de vérité qui divergeaient | fiche 4 portée dans le contenu source (A-60) | non | rien de généralisable : forge-seo-geo impose déjà que le contenu vive dans un fichier unique ; l'écart vient d'une édition à la main de la fiche générée, geste que la méthode interdit déjà |
| Quatre journaux R-32 écrits à la main jusqu'ici ; trois livrables HTML sortis sans journal | `build/journal-oracles.py` produit le journal au format des journaux existants (check_html + render_page + empreinte des règles) | non | rien de généralisable : le socle `digit-ai-page-html` fournit déjà les deux oracles ; c'est le geste de consignation qui manquait chez ce produit, et il est désormais outillé ici — un lot ultérieur le remontera si un second produit refait le même script |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — vérifié par la session, le 12/09/2026 (les documents écrits sont des vues `docs\projet\` déjà instanciées et un lot de retours).

## Confirmations positives

- **`git cherry` a suffi à requalifier une « divergence 423 devant / 588 derrière » en historique réécrit** : 412 commits locaux déjà en amont par contenu, 7 restants présents par sujet — réalignement sans perte, branche de sauvegarde et stash conservés. Le remède du bootstrap (« rebase ou merge à la main ») était le mauvais verbe ; le bon diagnostic tient en une commande.
- **`recopier-heritage.mjs` a bien ramené la règle T6** (oracle-travaux 126 lignes, TRAVAUX-PILOT, oracle-lot, gabarit) ; R-47 rend PASS sur 13 artefacts après commit.
- **`oracle-conformite-projet` a nommé chaque geste réparateur** (R-2 : trois issues, R-4 : réindexer, R-25 : types admis, R-26 : `## Table :` + provenance, R-7 bis : `git mv` vers `old/`) : 33 PASS après une session, sans lecture du code de l'oracle sauf pour R-26.

## Ordre recommandé

1. RT-88 d'abord : un outil qui écrit chez le mauvais dépôt coûte une annulation à chaque produit qui l'appelle, et la parade est une ligne de garde.
2. RT-89 ensuite : chaque produit qui sert `site/` recevra les mêmes deux gabarits parasites à la prochaine recopie.
3. RT-90 en dernier : mineur, mais permanent tant qu'aucune déclaration n'existe.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : les trois sont des frictions d'outil observées par la session. RT-88 et RT-89 relèvent de la classe `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` (l'emplacement est codé en dur là où l'exécution réelle en charge un autre) — la classe existe, c'est son périmètre qui s'étend aux ÉCRIVAINS et aux ARTEFACTS HÉRITÉS, pas seulement aux contrôles. RT-90 relève de `regle-qui-interdit-son-propre-remede`. Aucune classe nouvelle n'est demandée.
