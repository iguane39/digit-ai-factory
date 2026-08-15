# Retours de run — audit SEO auxportesdelabaie.fr, 15/08/2026

Run de mandat transverse `20260815-audit-seo-auxportesdelabaie`.
Forges mobilisées : forge-seo `6d19641`, forge-agents `b0931bb`, pilot `c2fa7bc`.
Tous les constats ci-dessous ont été payés pendant le run, jamais supposés.

---

## R1 — `agents_ia.py` ne dégrade pas quand les logs manquent

**Forge** : forge-seo. **Payé** : oui.

`cat-seo-06` est annoncé au catalogue comme « instrumentation de crawl avancée : sites JS,
balisage, CWV terrain et crawlers IA ». Trois des quatre volets ont tourné. Le quatrième,
`agents_ia.py`, exige `--logs` et s'arrête net sans lui.

Or l'accès aux journaux serveur est l'exception, pas la règle : hébergement mutualisé,
CDN sans export, client non administrateur. Sur cette mission, le cadrage le déclarait
dès l'ouverture.

**Effet** : un service annoncé « prouvé » n'est délivrable qu'aux deux tiers, et rien au
catalogue ne le dit.

**Piste** : soit une dégradation déclarée — le script rend un verdict `non-mesurable` avec
son motif au lieu de refuser —, soit une mention au catalogue précisant la dépendance.

---

## R2 — le crawler plafonné rend un chiffre plausible et faux

**Forge** : forge-seo. **Payé** : oui.

Premier passage à 200 pages, valeur par défaut : « pages orphelines : 89 (MAJORANT —
plafond atteint) ». L'avertissement est présent et honnête. Mais `urls_decouvertes` valait
289 : le crawler savait qu'il n'avait pas fini.

Relancé à `--max 320`, il trouve **291 pages et 10 orphelines** — un ordre de grandeur
d'écart sur un chiffre qui aurait pu partir tel quel dans un rapport.

**Piste** : quand `urls_decouvertes > plafond`, refuser d'écrire les compteurs dérivés
plutôt que de les marquer majorants, ou relever le plafond automatiquement jusqu'à
épuisement de la file. Un chiffre marqué majorant reste un chiffre qu'on cite.

---

## R3 — le contrôle de balisage doit être indifférent à l'ordre des attributs

**Forge** : forge-seo (et tout outil de crawl). **Payé** : oui, deux fois.

Le run précédent concluait « aucune balise canonique sur 79 pages » et fondait une action
là-dessus. Vérification directe : **les canoniques existent**. L'outil employé alors
cherchait `rel="canonical"` **avant** `href` ; le site écrit `href` en premier.

Le constat est sorti propre, chiffré, et faux — et rien ne pouvait l'attraper, une absence
étant indiscernable d'une non-détection.

**Piste** : les motifs de balisage passent par des assertions à double sens — une fixture
rouge portant `href` avant `rel` doit faire échouer le détecteur naïf. C'est exactement le
genre de règle qu'une fixture attrape et qu'une relecture rate.

---

## R4 — un audit qui ne lit pas le sitemap se trompe de site

**Forge** : forge-seo. **Payé** : oui.

Le run du 15/08 au matin mesurait 79 pages, en suivant les liens depuis l'accueil. Le
crawler actuel, qui amorce depuis le sitemap, en trouve **291**. Toutes les proportions
citées dans le rapport précédent — 39 % de pages minces, 44 titres distincts, 35 titres
dupliqués — portaient sur 27 % du site.

Le crawler a manifestement corrigé ce point depuis. Le retour porte sur la **leçon** :
confronter au moins deux sources d'inventaire d'URLs — liens, sitemap, Search Console —
avant de conclure sur la taille d'un site.

**Piste** : faire figurer l'écart `urls_declarees_sitemap` ↔ `pages_atteintes_par_liens`
comme un indicateur de premier plan de la synthèse de crawl. Ici, 210 pages sur 291 ne
sont atteintes que par le sitemap : c'est le constat structurel majeur du site, et il naît
de cette confrontation.

---

## R5 — laboratoire et terrain divergent d'un facteur cinquante

**Forge** : forge-seo. **Payé** : oui.

Le nœud Performance a été déclaré « conforme, ne mérite aucune action » sur un temps de
réponse serveur médian de **21 ms**. CrUX, sur utilisateurs réels : **TTFB p75 1 162 ms**,
LCP 3 128 ms, FCP 3 041 ms — trois seuils sur quatre manqués.

**Piste** : le nœud 31 ne devrait pas pouvoir être jugé conforme sur une mesure de
laboratoire. Sa méthode dit déjà « données de terrain » ; l'écart vient de ce qu'un run
sans clé CrUX se rabat sur ce qu'il a. Un verdict `non-mesure` serait plus juste qu'un
`conforme` fondé sur la mauvaise grandeur.

Accessoirement : la clé CrUX est gratuite et s'obtient en deux commandes `gcloud`. Le
message de refus pourrait le dire — il donne l'URL de documentation, mais un run
automatisé ne la lit pas.

---

## R6 — le registre des types n'est pas découvrable depuis un projet

**Forge** : forge-organization / pilot. **Payé** : oui.

En renommant 28 livrables pour R-4, j'ai improvisé les types : « Reference », « Analyse »,
« Ecarts », « Journal ». Aucun n'est admis. L'oracle me l'a renvoyé en dix constats R-25,
après coup.

Le registre existe, il est clair, et il est lu par l'oracle — mais rien, du côté du projet
audité, ne le désigne avant qu'on se soit trompé.

**Piste** : que le message d'erreur R-25 cite les types admis, ou que `oracle-conformite`
propose le type le plus proche. Le coût actuel est un aller-retour complet de renommage.

---

## R7 — `RUN-MANDAT` exige un socle PASS que l'existant rend inatteignable

**Forge** : pilot. **Payé** : oui.

`RUN-MANDAT.md` pose « `oracle-conformite-projet.mjs` PASS » en invariant non négociable.
Sur ce projet, l'oracle sortait **FAIL à 211 constats**, dont 206 R-4 portant sur des
fichiers antérieurs au mandat — captures d'écran, documents de stats, fiches d'une mission
précédente.

Atteindre le PASS a demandé de supprimer un dossier, d'en déplacer un autre, de renommer
28 fichiers et de réécrire 30 messages de commit. Le mandat demandé était un audit SEO.

Le protocole d'accueil dit par ailleurs : « le pilot n'intervient jamais dans un produit
hors d'un run explicitement demandé ». Les deux règles se contredisent dès que le projet
n'est pas né sous la doctrine.

**Piste** : distinguer le socle *nécessaire au run* — `output/`, `forge/`, ledger, git — de
la conformité *du projet entier*, et permettre un run de mandat sur écarts déclarés au
ledger. Sans cela, tout mandat sur un dépôt existant commence par un chantier de mise en
conformité que personne n'a demandé.

---

## Ce qui a bien tenu

- L'enchaînement `AGENTS.md` → `ACCUEIL.md` → `RUN-MANDAT.md` se déroule sans ambiguïté.
- Le refus d'écrasement de `new_mission.py` a évité d'écraser une mission existante.
- `livrables.py` préserve les parties de jugement et régénère le mécanique : la séparation
  est nette et se sent à l'usage.
- `scorer_actions.py` a recalculé les scores et refusé de relire ceux du contenu — l'effort
  d'A1 passant de 2 à 3, l'action est tombée sous le trait. Le barème a fait son travail
  contre mon intuition.
- `oracle-synthese` a attrapé mes intitulés de blocs non conformes du premier coup.
