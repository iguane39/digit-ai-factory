# Retours forges — Produit-02.com — 20260826c

- **Contexte** : audit des traductions sur les 7 langues, axes SEO et GEO, livré en
  `output\Produit-02 - Audit traductions SEO-GEO - 20260826a.md`. Les quatre
  retours de ce lot sont nés **de l'audit lui-même** : trois portent sur des contrôles qui
  ont laissé passer ce que l'audit a trouvé à la main, le quatrième sur un hook qui a
  bloqué sans dire pourquoi.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 58, 59,
  60, 61 (entrées `type: retour`) — le ledger de ce projet vit sous `runs\<run-id>\`,
  divergence déjà remontée en **RT-6**.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce que l'audit a révélé sur les contrôles

Ce chapitre dit d'où viennent les retours, parce que leur origine change ce qu'ils valent.

L'audit portait sur le vocabulaire et la visibilité des 7 langues du site. Il a trouvé deux
défauts systémiques que **rien n'avait signalé** : trois langues sur sept n'employaient
jamais le terme retenu à leur propre glossaire, et les 203 URL canoniques du site
répondaient 301. Les deux étaient en production. Les deux étaient mesurables par script.

Le critère de tri appliqué à ce lot est celui du produit : *si deux personnes compétentes
trancheraient identiquement sans information supplémentaire, ce n'est pas un arbitrage,
c'est un défaut d'automatisation.* Les quatre retours ci-dessous le passent tous.

## `digit-ai-forge-seo-geo`

Trois retours, tous nés du même mécanisme : un contrôle existe, il voit la bonne chose, et
il ne conclut pas.

Comment lire le tableau : une ligne par retour, `id` continuant la séquence du produit
(dernier employé : RT-46). La colonne `Retour` porte le fait et sa mesure — jamais l'opinion ;
la colonne `Proposition` est une piste, jamais une obligation. La `Portée` distingue ce qui
vaut pour toute la forge (*générique*) de ce que le produit a aussi corrigé chez lui.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-47 | bloquant | générique | **Une règle conditionnelle de glossaire ne bloque jamais, et l'arbitrage prouvé reste inappliqué.** `build\check-glossaire.mjs` rend `glossaire OK — 8 termes × 7 langues, aucun écart`, puis liste à part 10 règles « non jugé — à relire à l'œil », dont trois portent le terme d'hébergement en `de`, `es` et `pt`. Mesure : le terme **retenu** au glossaire y est employé **zéro fois** — `Ferienhaus` 0, `casa rural` 0, `casa de férias` 0 — quand le mot qu'il devait remplacer l'est **82, 79 et 82 fois**. Le glossaire avait été corrigé le 2026-08-25, motif rédigé et sonde citée ; les chaînes n'ont jamais suivi, et le défaut est parti en production dans trois langues sur sept. Aucun œil ne l'a relu, et l'audit du lendemain l'a trouvé en une commande. | Une règle conditionnelle qui peut se **mesurer** ne doit pas se déléguer à une relecture. Un terme `retenu` à **0 occurrence** dans une langue où le concept est employé 82 fois est un échec, pas une nuance : aucune information supplémentaire n'est nécessaire pour trancher. La condition « Gîte seul, sans terme allemand, dans un title ou un H1 » gagnerait un seuil dur en amont — *si `retenu` a zéro emploi dans la langue, échouer* — et ne rester conditionnelle que **au-dessus** de ce seuil. C'est la loi que **RT-42** énonce pour les règles de socle, appliquée ici à une règle de vocabulaire : ce qui est exprimable en code ne se prescrit pas en prose. |
| RT-48 | majeur | générique | **Le glossaire cite une sonde qu'aucun script ne rejoue.** Les motifs de `build\i18n\glossaire.json` portent des preuves nommées et datées — « google-suggest hl=es gl=ES « casa rural francia » -> 10 completions », `verifie: 2026-08-25`, `confiance: haute`. Aucun script du dépôt ne les reproduit : `grep -rl "suggestqueries\|google-suggest\|complete/search"` sur les sources rend **zéro fichier**. Coût mesuré : pour répondre à une question du commanditaire sur la validité du terme espagnol, la sonde a dû être **réécrite en `curl`** pendant la session. En la rejouant, deux choses sont apparues que le motif ne dit pas — le terme est confirmé, mais la requête témoin est **polluée par un homonyme** (« Francia » est aussi un village de la Sierra de Francia, d'où la première complétion « casa rural francia quilamas »). C'est le mécanisme exact qui avait produit la proscription **fausse** de « casa rural », corrigée un jour plus tard : une preuve qu'on ne rejoue pas ne se corrige que par accident. | La sonde qui fonde un terme de **visibilité** est un artefact, pas une anecdote de motif. Un script versionné — `sonde-vocabulaire.mjs <terme> <langue>` — rendrait la preuve reproductible, datable et **périssable** : au-delà de N mois, le champ `verifie` se périme et le contrôle le dit, au lieu de laisser une confiance `haute` vieillir en silence. Le champ `sources` deviendrait alors vérifiable plutôt que déclaratif. |
| RT-49 | bloquant | produit+générique | **Aucun oracle ne vérifie qu'une URL déclarée répond 200.** Mesure en production sur `https://www.Produit-02.com` : `/gites.html` → **301** → `/gites`, et la page servie en `/gites` déclare `<link rel="canonical" href=".../gites.html">`. Ampleur : **203 canoniques sur 203**, **203 `<loc>` de sitemap sur 203**, **1 624 alternates hreflang**, **15 liens de `llms.txt`** et environ **81 liens internes par page**. Les 7 pages d'accueil portent une **chaîne de deux redirections** (`/index.html` → `/index` → `/`). Aucun contrôle ne pouvait le voir, et c'est le point du retour : `check-seo.mjs` ligne 52 vérifie que la balise canonique **existe**, jamais où elle mène ; `check-links.mjs` vérifie que les cibles existent **sur le disque**, et sur le disque `gites.html` existe — c'est le serveur qui redirige (`serve.json`, `cleanUrls: true`) ; `check-redirects.mjs` teste les **anciennes** URL du site Webflow, jamais les nouvelles. Trois oracles au vert, un défaut site-entier. | Un oracle manque, et il est simple : **toute URL que le site déclare de lui-même — canonique, hreflang, `<loc>`, `llms.txt` — doit répondre 200 sans redirection**. Une canonique qui redirige n'a pas d'arbitrage possible, et un cluster hreflang dont les membres redirigent n'est plus garanti valide côté moteur. La forme du contrôle existe déjà chez `check-redirects.mjs` : il sait suivre une chaîne et juger le statut final. Il lui manque le jeu d'URL entrant — celles que le build vient d'écrire, plutôt que celles que l'ancien site laissait derrière lui. |

## `digit-ai-factory`

Un retour, sur un hook bloquant qui ne dit pas pourquoi il bloque.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-50 | majeur | générique | **Le journal d'oracles perd la raison de l'échec.** Le hook C7 a bloqué l'écriture du livrable d'audit sur `❌ [Lisibilité d'un document (Markdown)]`, et le journal `.oracles.json` porte `{"domaine":"Lisibilité d'un document (Markdown)","verdict":"FAIL","detail":""}` — **`detail` vide**. La cause est localisée : `run-oracles.mjs` ligne 208 lit `obj.findings[].msg`, alors que l'oracle appelé, `digit-ai-page-html\scripts\check_markdown.py`, émet un objet `{"verdict","fails":[…],"warns":[…],"non_juge":[…]}` — une liste de **chaînes** nommée `fails`, jamais `findings`. La raison est donc produite, puis jetée au passage du contrat. Coût mesuré : trois tours pour retrouver le registre d'oracles, y lire la commande, puis rejouer `check_markdown.py` à la main — après quoi les 9 constats M7 et M10 se sont affichés en clair, avec leur ligne et leur motif. Le hook est **bloquant** : il rend la main sans dire ce qu'il faut corriger. | Deux contrats coexistent pour la même chose. Soit le lecteur du runner accepte les deux formes (`findings[].msg` **ou** `fails[]`), soit les oracles CLI convergent vers une forme unique — mais tant qu'ils divergent, le silence est le comportement par défaut, et c'est le pire des trois. Une garde utile en attendant : si un oracle rend `FAIL` avec un `detail` vide, le dire — *« l'oracle a échoué et n'a pas su expliquer pourquoi ; rejouez `<commande>` »*, la commande étant déjà connue du registre. Un échec muet coûte plus cher qu'un échec verbeux. |

## Ce que ces retours ne couvrent pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

Ce lot ne juge **pas la qualité des traductions elles-mêmes** : l'audit a rendu 25 constats
et 20 propositions au produit, et rien de cela ne remonte ici — ce sont des défauts de
contenu, pas de forge. Il ne juge pas non plus les **seuils** des contrôles cités (75
caractères pour un title, 165 pour une description) : ils ont fait leur travail, 55 titles
et 42 descriptions hors norme ont été signalés sans ambiguïté.

Enfin, **RT-49 n'a pas été vérifié ailleurs que sur ce produit**. La classe est générique —
tout site statique servi avec des URL propres pendant que le générateur émet des `.html`
porte le même défaut — mais la mesure ne vaut que pour `Produit-02.com`.

## Remarques restées au produit

Ce que le produit a constaté et n'a pas remonté, chacune avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 38 chaînes identiques au français signalées par `check-traductions`, dont 20 `altBase` et 8 faux positifs (gabarits `{chalet} · {j1}`, noms propres « Saint-Malo & Cancale ») | Non corrigée — classée dans l'audit, proposition `P-11` pour les vraies, `P-20` `NE PAS FAIRE` pour les faux positifs | non | **Rien de généralisable** — le mécanisme d'exemption manquant est déjà remonté en **RT-43** (lot `20260826a`) ; ce lot n'ajoute qu'une occurrence de plus. |
| Le calque allemand « Seite Normandie » pour « côté Normandie », à un CTA et un suptitre, alors que la même page dit ailleurs « auf der normannischen Seite » | Non corrigée — proposition `P-10` de l'audit | non | **Rien de généralisable** — défaut de traduction propre au produit ; aucun contrôle mécanique ne peut distinguer un calque d'une tournure voulue. |
| Deux formes de la marque coexistent — « Produit-02 » (154 emplois, et raison sociale au RCS) et « Produit-02 » (logo, `llms.txt`) | Non corrigée — posée en arbitrage `P-08`, deux branches, aucune recommandée | non | **Rien de généralisable** — c'est une décision de marque, pas un défaut : le critère de discrimination du produit l'exclut explicitement, deux personnes compétentes pouvant trancher différemment. |
| Le sidecar `.plan.jsonl` du livrable d'audit prescrivait *un objet par fiche* ; une fiche portant 14 substitutions distinctes, l'écart a été assumé et déclaré (un objet par édition atomique, champ `fiche` en renvoi) | Écart déclaré dans le livrable, §8 | non | **Rien de généralisable — et surtout, pas à la Factory.** Ce gabarit de sidecar a été défini dans le prompt de l'audit, avec le commanditaire ; il n'appartient à aucune forge. Le remonter noierait le signal des quatre autres retours, ce que la consigne du produit interdit explicitement. Consigné ici pour que l'écartement soit visible plutôt que tu. |
| L'e-mail de contact est sur `Produit-02.fr` quand le domaine canonique du site est `.com` | Non corrigée — proposition `P-16`, conditionnée à une réponse du propriétaire | non | **Rien de généralisable** — donnée de configuration du produit, possiblement volontaire. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** Le livrable
d'audit `Produit-02 - Audit traductions SEO-GEO - 20260826a.md` a été structuré
d'après le prompt du commanditaire, non d'après un gabarit de `gabarits\documents\` : il ne
porte aucun identifiant `gd-…`. La section est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46 et est consignée ici faute de canal plus
juste. Les règles de lisibilité **M7** (un chapitre ouvre par ce qu'il apprend) et **M10**
(un chapitre de plus de 12 lignes de tableau dit comment le lire) ont été **utiles** : elles
ont attrapé quatre chapitres ouvrant sur un tableau nu et cinq tableaux sans mode d'emploi,
sur un livrable de 56 Ko. Deux passes ont été nécessaires, dont une inutile : la première
correction plaçait la phrase de mode d'emploi **à l'intérieur d'une puce**, et M10 la
comptait absente. La règle est juste, sa détection aussi ; c'est son message qui ne dit pas
qu'une phrase de mode d'emploi doit être un paragraphe autonome.

## Confirmations positives

- **Le glossaire terminologique a tenu sa promesse là où il est joué.** Les huit termes sur
  sept langues sont cohérents, `check-glossaire` rend `aucun écart`, et l'entrée italienne
  a évité un contresens actif — « gite » est le pluriel de « gita », une excursion. L'audit
  a vérifié : l'unique occurrence de « gite » en italien est `villes.commun.h2Autres`,
  « Le altre gite », usage **correct** du mot italien. Ce que **RT-34** et **RT-35** ont
  installé fonctionne ; c'est sa condition de blocage qui manque, et c'est tout l'objet de
  RT-47.
- **`check-llms.mjs` a fait exactement ce qu'on attend d'un oracle de cohérence.** Il
  confronte `llms.txt` aux sources — 5 gîtes, surfaces, prix, capacité groupe 30 égale à la
  somme des `capMax` — et rend un vert argumenté ligne par ligne. C'est ce contrôle qui a
  permis de clore en une commande le point le plus lourd de l'audit GEO : **aucune
  incohérence factuelle interlangue**, sur 7 langues et 6 familles de faits.
- **`check-i18n.mjs` garantit ce sur quoi tout le reste repose.** Les 6 langues cibles
  portent exactement l'arborescence de clés du français. Sans cette garantie, aucune des 67
  substitutions du plan d'application n'aurait pu être adressée par chemin de clé.
- **`oracle-lot.mjs` continue de payer.** Joué sur ce lot avant remise, comme le gabarit le
  demande.

## Ordre recommandé

1. **RT-49** — c'est le seul des quatre dont le défaut est **actif en production sur tout un
   site**, et le seul qui échappe simultanément à trois oracles au vert. Le contrôle
   manquant est aussi le plus simple à écrire.
2. **RT-47** — même classe de trou, coût moindre : le contrôle existe déjà et voit la bonne
   chose, il lui manque un seuil. Tant qu'une règle mesurable se délègue à un œil, un
   arbitrage prouvé peut rester inappliqué sans que personne le sache.
3. **RT-50** — ne produit pas de défaut, produit une perte de temps garantie à chaque
   échec. Deux lignes de lecture dans le runner.
4. **RT-48** — le plus structurant à long terme, le moins urgent : il protège contre la
   **péremption silencieuse** d'une preuve, dont ce projet a déjà payé une occurrence.
