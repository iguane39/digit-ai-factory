# Retours forges — factory-digit-ai-fr — 20260824a

- **Contexte** : refonte de la page d'accueil du 24/08/2026, sur constat du commanditaire —
  « la landing page n'est pas assez claire sur ce qu'est la Factory et ce qu'elle peut apporter
  à son public ». Le diagnostic a mis au jour une contradiction entre deux artefacts produits
  par le même run, et trois défauts d'exploitation trouvés en chemin.
- **Références ledger** : `forge\ledger.jsonl` — dernier seq 43. Refonte menée hors run, sur
  arbitrage direct ; le présent lot en est la trace.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Le constat central

La une du site promettait : **« Votre produit, livré avec ses preuves. »** Un visiteur en déduit
une livraison — vous fabriquez mon produit, vous me le remettez.

Les six services, produits par le **même run**, vendent tout autre chose. *Conseil* : « nous
évaluons **votre** chaîne ». *Formation* : « **vos équipes** apprennent à travailler sous
oracles ». *Accompagnement* : « à la fin, **vos équipes exécutent les oracles et tiennent le
ledger sans nous** ». *Intégration* : « nous branchons les forges sur **votre** existant ».
Aucun des six ne dit « nous construisons votre produit ».

Le produit réel est **l'installation et le transfert d'une chaîne de fabrication vérifiable chez
le client**. La une vendait un prestataire de livraison. L'attente formée en trois secondes était
démentie quatre sections plus bas, et **rien ne l'a vu** : oracle-slop, oracle-taste,
oracle-exigences, oracle-traçabilité, oracle-surface, oracle-claims et oracle-ears étaient tous
au vert, et le site est parti en production dans cet état le 15/08.

La cause est en amont des oracles. `CADRAGE-DESIGN.md` porte six champs — secteur, cible, job
principal, ton attendu, contraintes, hypothèses — et **aucun ne dit ce que le produit PROMET**.
Le « job principal » y est celui de la *page* (« donner à voir l'offre forge et convertir en
prise de rendez-vous »), jamais le gain du *client*. La promesse n'étant écrite nulle part, elle
ne pouvait être contredite par rien : elle a été décidée par défaut, au moment de rédiger un
titre, c'est-à-dire au plus bas niveau de la chaîne — alors que la liste des six services, elle,
était une **décision humaine datée** (15/08, consignée dans `app/contenu.py`).

---

## digit-ai-forge-conception (`digit-ai-forge-conception`)

Ce chapitre porte la cause première : le référentiel produit par cette forge décrit tout ce que
le site doit FAIRE et rien de ce qu'il doit DIRE. C'est ce vide qui a laissé la promesse se
décider en rédigeant un titre.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RC-2 | **bloquant** | générique | **Le référentiel ne porte nulle part ce que le produit PROMET à son client.** `CADRAGE-DESIGN.md` a six champs et le « job principal » y est celui de la page, pas le gain du client : « donner à voir l'offre forge de façon consultable et convertir en prise de rendez-vous ». Les 61 exigences décrivent ce que le site DOIT FAIRE (EX-001 servie à la racine, EX-002 accès aux quatre pages, EX-007 six services sur la page services…) et jamais ce qu'il doit DIRE. Conséquence mesurée : la une a promis une livraison pendant neuf jours quand les six services vendaient un transfert de capacité, sans qu'aucun artefact ne soit en défaut — la promesse n'était opposable à rien. Une décision de POSITIONNEMENT s'est prise en rédigeant un titre. | Un champ **`promesse`** au cadrage, en une phrase, dans les mots du client et non du produit : ce qu'il gagne, et ce qu'il n'a plus à faire. Et une exigence dérivée, vérifiable par simple lecture humaine : *la promesse de la page d'accueil est celle du cadrage*. Le contrôle n'a pas besoin d'être automatique pour être opposable — il a besoin d'exister et d'avoir un porteur. Corollaire : le champ `promesse` est de la même nature que la liste fermée des services, donc **décision humaine datée**, pas dérivation. |

## digit-ai-forge-design (`digit-ai-forge-design`)

Ce chapitre porte la porte manquante : les oracles de design jugent une page en vase clos, donc
aucun ne pouvait voir qu'elle contredisait l'offre décrite dans un autre artefact du même run.
Il ne porte qu'un retour, RD-10 — dixième retour de ce produit vers forge-design.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-10 | **majeur** | générique | **Rien n'oppose la promesse d'une page à l'offre décrite ailleurs dans le même run.** Les oracles de design jugent la page en vase clos : `oracle-slop` la généricité de l'écriture, `oracle-taste` la discipline d'accent et de filets, `oracle-mobile` le contrat tactile, `oracle-dtcg` les jetons. Aucun ne lit un SECOND artefact du même run pour vérifier qu'ils racontent la même chose. La contradiction une/services était pourtant lisible en trente secondes par un humain, et détectable par script au moins grossièrement (le sujet grammatical : « votre produit, **livré** » contre « **vos équipes** exécutent »). À DISTINGUER de TF-0483 (barre externe avant une DA), déposé le 22/08 : celui-là porte sur la **désirabilité** — a-t-on regardé ce qui se fait de bien ; celui-ci porte sur la **cohérence interne** — la page dit-elle la même chose que l'offre. Les deux sont indépendants et se cumulent. | Un contrôle de **cohérence inter-artefacts** à la revue design : la promesse de la une, la liste des services et le champ `promesse` du cadrage (RC-2) sont mis côte à côte, et l'écart est un constat. Automatisable en partie — la présence du champ, sa reprise littérale — jamais en totalité, et c'est acceptable : le pan i18n a montré qu'un contrôle partiel qui DIT sa limite vaut mieux qu'un vert muet. |

## digit-ai-forge-ops (`digit-ai-forge-ops`)

Ce chapitre sort du sujet du message et porte sur l'exploitation : un gate de mise en production
a été rouge six jours sans arrêter personne. Il est ici parce que R-45 demande de remonter la
classe de ce qu'un produit a corrigé chez lui, pas parce qu'il tient au reste du lot.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RO-3 | **bloquant** | générique | **Un gate de MEP est resté ROUGE six jours et le déploiement a eu lieu quand même.** Le smoke M-3 contrôle EX-026 par `'href="/static/tokens.css"' in accueil`. Le 18/08, le correctif de cache a versionné les feuilles par empreinte (commit `7519d4f`) : le HTML sert désormais `/static/tokens.css?v=…`. L'égalité stricte sur le chemin nu échoue depuis. `git log -S` sur cette ligne du smoke ne rend **aucun commit** : personne ne l'a ajustée, et personne n'a été arrêté. Le gate a donc été soit non rejoué, soit rejoué et son échec ignoré — dans les deux cas, un gate dont l'échec n'empêche rien n'est pas un gate. Réparé côté produit le 24/08 (le contrôle porte sur la consommation des tokens, pas sur la forme de l'URL). | Deux choses, indépendantes du produit. (a) Un **verdict de MEP horodaté et archivé** : sans trace, « les gates sont passés » est une affirmation invérifiable, exactement ce que le site reproche à un fournisseur. (b) Un gate qui échoue **bloque**, ou déclare explicitement qu'il est consultatif — le mélange des deux régimes sans le dire est ce qui a permis de passer outre sans décision. |

## digit-ai-forge-tests (`digit-ai-forge-tests`)

Ce chapitre porte le second défaut d'exploitation, de la même famille : une donnée périmée ne
lève aucun drapeau, elle s'affiche — et c'est arrivé sur le chiffre le plus visible d'un site
dont l'argument est la preuve datée.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-22 | **majeur** | générique | **Rien ne détecte qu'une copie vendorisée a divergé de sa source.** Le `Dockerfile` pose `ENV FORGE_ROOT=/app/vendor` : en production, `vendor/digit-ai-factory/catalogues/catalogue.jsonl` **est** la source qui alimente la base. Aucun mécanisme ne la rafraîchit et aucun contrôle ne la compare à l'amont. Constat du 24/08 : le site annonçait **v1.6.2 et 80 services** quand le catalogue en portait **v1.8.0 et 83**, deux versions de retard — sur un site dont l'argument entier est la **preuve datée**. Le retard était en outre masqué par un second effet : l'amont a renommé la forge `seo` en `seo-geo`, ce qui fait échouer la régénération avec un refus net (`forges hors regroupement connu`) — un bon refus, mais que personne ne voit tant que personne ne lance le script. Une donnée périmée ne lève aucun drapeau ; elle s'affiche. | Un contrôle de **fraîcheur des copies vendorisées** : pour toute copie déclarée d'une source connue, comparer l'empreinte et rendre l'écart en constat daté. Ce n'est ni un test unitaire ni un test d'intégration — c'est la même famille que la parité de routes du pan i18n : deux arborescences qu'on met en regard. Et le corollaire de doctrine, valable au-delà de ce cas : **un chiffre affiché sur une vitrine doit être compté au rendu, jamais recopié** — c'est ce qui a été fait côté produit (les comptes de la nouvelle une sont des `SELECT`, pas des littéraux). |

---

## Remarques restées au produit

**Généralisable — retenu, ce sont RO-3 et RT-22.** Le gate rouge et la copie périmée ont été
réparés dans le produit le 24/08 ; les deux classes sont remontées, conformément à R-45. Sans
quoi le produit repartait avec la leçon et la forge restait exposée aux mêmes.

**Preuve fraîche pour un item déjà déposé, non redoublé.** La refonte a produit six défauts de
rendu que rien dans le projet ne pouvait voir et que seules les captures ont révélés : un
chevauchement du bandeau chiffré sur le bouton d'appel, trois chevauchements de notes sur le
bloc précédent (chapitres I, II, IV — tous causés par la marge haute **négative** de
`.chapitre-note`, correcte sous un titre et destructrice ailleurs), et deux défauts de contraste
(une note d'encre sombre posée sur la plaque sombre, une exergue de lettres claires posée sur le
papier crème). Aucun n'était détectable au HTML : ce sont des faits de cascade. Ils confirment
**TF-0480** (« le plancher visuel V1/V2/V4 n'est atteignable que sur un fichier HTML local »)
avec un cas de plus, et ne donnent donc pas de candidature nouvelle.

**Resté au produit, et signalé au commanditaire — un défaut de PRODUCTION non corrigé.** À 390 px
et **en état défilé**, l'en-tête compacté déborde horizontalement : `scrollWidth` 402 contre 390,
sur les entrées « À propos » et « Contact ». Mesuré identique en local et sur
`https://factory.digit-ai.fr` — le défaut est donc antérieur, introduit avec l'en-tête figé, et
il est en ligne. Il n'apparaît **ni au chargement ni sans défilement**, ce qui le met hors de
portée de tout contrôle statique et de tout crawl. Non corrigé faute de mandat : la refonte
portait sur le message, pas sur la navigation.

**Resté au produit, non généralisable.** Le renommage `seo` → `seo-geo` a été absorbé en
acceptant les deux clés (regroupement et rôles) plutôt qu'en substituant : un clone non
rafraîchi ne doit pas perdre sa page. C'est une tolérance d'implémentation, pas une règle.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque** pour ce lot, hormis le présent
fichier (`gabarits\RETOURS-FORGES.md`). La remarque des lots `20260822a` et `20260822b` sur le
champ « Références ledger » d'un lot **hors run** tient ; renseignée ici de la même manière et
non redoublée en candidature.
