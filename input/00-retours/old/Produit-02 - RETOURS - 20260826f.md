# Retours forges — Produit-02.com — 20260826f

- **Contexte** : retour de synthèse sur la session du 26/08/2026, qui a produit un audit des
  traductions sur 7 langues, l'a appliqué, puis l'a corrigé trois fois. Le résultat final est
  bon et vérifié. Ce lot porte sur **le chemin pour y arriver**, et sur une chose que les
  cinq lots précédents ne disent pas.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 69
  (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Le journal des tours, et sa classification

Ce chapitre existe parce qu'un nombre de tours, seul, ne s'ingère pas : il se lit comme un
reproche. Ce qui s'ingère, c'est le motif de chaque tour.

La session a compté **17 tours** avant que le résultat soit de qualité. Chacun est rangé
dans une seule des trois classes ci-dessous, et **une seule remonte**.

Comment lire le tableau : un tour par ligne, dans l'ordre où il a eu lieu. La colonne
`Classe` porte le verdict, la colonne `Pourquoi ce tour a existé` le motive. Les tours de
classe **DÉCISION** ne sont pas un gâchis : ils sont ce que la forge doit **préserver**.

| # | Ce qui a été demandé | Pourquoi ce tour a existé | Classe |
|---|---|---|---|
| 1 | « améliore ce prompt » (audit des traductions) | Il n'existe aucune chaîne outillée pour « auditer les traductions » : la méthode a dû être écrite à la main | **DÉFAUT** |
| 2 | « complète avec GEO en plus de SEO » | L'axe GEO — entités, citabilité, directives IA — n'était pas dans la méthode : il a fallu le nommer | **DÉFAUT** |
| 3 | « fournis un tableau avantages / inconvénients / recommandations » | Le format d'un livrable d'arbitrage a dû être spécifié à la main | **DÉFAUT** |
| 4 | « fais que ce soit directement applicable par l'IA suivante » | Le format d'un plan applicable — ancres verbatim, sidecar machine, carte des sources de vérité — a dû être spécifié à la main | **DÉFAUT** |
| 5 | « le site venant de sortir, les changements d'URL ont un impact minime » | Fait métier apporté par l'exploitant. **Partiellement découvrable** : les 36 redirections héritées et la fraîcheur du sitemap étaient dans le dépôt, l'âge d'indexation ne l'était pas | DÉCOUVERTE |
| 6 | « fournis le prompt complet » | Assemblage — conséquence des tours 1 à 4 | **DÉFAUT** |
| 7 | « évite d'écrire en colonne, prends toute la largeur » | Un livrable long a été rendu dans le fil de conversation au lieu d'un fichier | **DÉFAUT** (mineur) |
| 8 | « affiche le prompt » | Idem tour 7 | **DÉFAUT** (mineur) |
| 9 | « exécute le prompt » | Lancement — ce tour est le seul qui aurait dû suffire | — |
| 10 | « l'analyse précédente disait que *casa rural* n'était pas le bon terme, vérifie » | La preuve du glossaire n'était pas rejouable : il a fallu réécrire la sonde. Découverte au passage : les titles proposés avaient sacrifié « Mont-Saint-Michel » | **DÉFAUT** |
| 11 | « oui » (amender le rapport) | Autorisation | DÉCISION |
| 12 | « des éléments à remonter à la Factory ? » | Les frictions avaient été **vues et énoncées en prose**, mais pas consignées ni compilées. Il a fallu le demander | **DÉFAUT** |
| 13 | « oui » (compiler et remettre) | Autorisation | DÉCISION |
| 14 | « applique tous les éléments » | Porte **4 arbitrages** : forme de la marque, exposition aux crawlers IA, modèle de slug localisé, périmètre `llms.txt` | DÉCISION |
| 15 | « pousse » | GO de mise en production | DÉCISION |
| 16 | « si on pousse ça doit déployer, non ? » · « pourquoi ça n'a pas été relu » · « on laisse le `.fr` » | Trois motifs : route MEP contradictoire, risque déclaré sans être fermé, et une décision d'exploitation | **DÉFAUT** ×2 + DÉCISION |
| 17 | « il faut les relire » | La relecture s'était bornée aux langues substituées ; les quatre autres portaient des défauts du **même run** | **DÉFAUT** |

**Compte : 11 tours de classe DÉFAUT, 5 de classe DÉCISION, 1 de classe DÉCOUVERTE.**

Le chiffre qui compte est **11**, pas 17. Les cinq tours de DÉCISION doivent survivre à
toute automatisation : ils portent la forme de la marque, la politique d'exposition aux
moteurs génératifs, le modèle d'URL, la mise en production et le choix du domaine de
contact. Une forge qui les supprimerait retirerait à l'exploitant ce qui lui revient.

## Ce que ce retour ajoute aux cinq lots du jour

Ce chapitre existe parce qu'un sixième lot qui redirait les cinq premiers coûterait plus
qu'il ne rapporterait.

| Retour déjà remis | Ce qu'il dit | Relation |
|---|---|---|
| **RT-47** | Une règle conditionnelle de glossaire n'est jamais évaluée | **AJOUTE** — RT-47 corrige un oracle ; ce retour dit que cet oracle est une **étape** d'une chaîne qui n'existe pas |
| **RT-48** | Le glossaire cite une sonde qu'aucun script ne rejoue | **SUBSUME le tour 10** — mais RT-48 traite l'artefact, pas sa place dans la séquence |
| **RT-49** | Aucun oracle ne vérifie qu'une URL déclarée répond 200 | Orthogonal — hors du domaine de la traduction |
| **RT-50** | Le journal d'oracles perd la raison de l'échec | Orthogonal — défaut d'outillage transverse |
| **RT-51** | Aucun oracle ne juge une substitution qui change le genre | **AJOUTE** — RT-51 est l'outil manquant ; ici c'est l'**ordre** dans lequel il aurait dû s'exécuter |
| **RT-52** | Un risque déclaré n'est pas un risque traité | **AJOUTE** — RT-52 ferme la boucle en fin de run. Ce retour dit qu'avec la règle de clôture, le run aurait **quand même** dû inventer les étapes |
| **RT-53** | La route MEP du gabarit contredit le mécanisme réel | Orthogonal — défaut de routage de déploiement |
| **RT-54** | La cohérence interlangue ne vérifie pas la cohérence interne | **AJOUTE** — même relation que RT-51 : un contrôle manquant, sans place assignée |

Quatre de ces huit retours — **RT-47, RT-48, RT-51, RT-54** — sont **chacun une étape
manquante de la même chaîne absente**. Remis un par un, ils seront traités un par un, et le
produit suivant les découvrira dans le même désordre. C'est cette observation, et elle
seule, qui justifie ce lot.

## `digit-ai-factory`

Un retour. La forge cible est le pilot et non `forge-seo-geo` : le défaut n'est pas une
capacité métier manquante — les quatre briques sont déjà remontées — mais l'**absence d'une
séquence déclarée** qui les ordonne et les rend bloquantes.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-55 | bloquant | générique | **Il n'existe aucune chaîne déclarée pour « traduire un produit » ni pour « auditer ses traductions », et son absence se paie en tours.** Mesure sur cette session : **11 tours sur 17 ont existé parce qu'une étape, un format ou une règle manquait** ; 5 relevaient d'une décision humaine légitime, 1 d'une information que le dépôt ne portait pas. Les 8 premiers tours ont servi à **écrire la méthode à la main** — axe GEO, format d'arbitrage, format de plan applicable, carte des sources de vérité — c'est-à-dire à reconstituer ce qu'une chaîne outillée aurait fourni sur une phrase. Le coût réel n'est pas le temps de l'exploitant : ce sont **11 fautes d'accord parties en production derrière une CI verte**, **2 faits faux servis dans les 7 langues**, et une qualité qui n'a émergé que parce que l'exploitant a insisté trois fois. Preuve que le défaut est structurel et non local : **RT-47, RT-48, RT-51 et RT-54**, remontés séparément le même jour, sont chacun **une étape manquante de la même séquence**. Remis un par un, ils seront traités un par un — et le produit suivant les redécouvrira dans le même désordre. | Déclarer les deux chaînes comme des **séquences ordonnées d'étapes**, chacune avec son entrant, son sortant, son oracle et son **critère de blocage** — c'est le critère de blocage qui fait la différence entre une méthode écrite et une méthode tenue. Le détail des deux séquences et la confrontation avec ce que cette session a fait dans le désordre figurent au chapitre suivant. Deux principes à y inscrire : (1) **les étapes d'arbitrage sont des étapes de la chaîne**, elles se posent explicitement à l'humain et ne s'automatisent pas ; (2) une étape sans oracle **bloque la remise** au lieu d'être signalée — c'est RT-52 appliqué à la séquence plutôt qu'au run. |

## La chaîne demandée, et ce que cette session en a fait

Ce chapitre est la substance de la proposition : sans lui, RT-55 serait un vœu. Chaque
étape porte son oracle quand il existe, le retour qui le réclame quand il manque, et le
tour de cette session où elle a réellement eu lieu.

### Chaîne A — « traduis ce produit dans N langues »

Onze étapes, dont deux n'ont jamais eu lieu sur cette session et une n'a eu lieu qu'après la mise en production. C'est là que se logent les défauts partis en production.

Comment lire le tableau : les étapes sont dans l'ordre d'exécution attendu. La colonne `Oracle` dit ce qui garantit l'étape aujourd'hui — le nom du contrôleur quand il existe, l'identifiant du retour qui le réclame quand il manque. La colonne `Où elle a eu lieu ici` renvoie au numéro de tour du premier chapitre, et « jamais » y est un verdict, pas une omission de relevé.

| # | Étape | Oracle | Où elle a eu lieu ici |
|---|---|---|---|
| A1 | Inventaire de la surface traduisible | `check-i18n` — existe | En amont, hors session |
| A2 | Glossaire constitué **par balayage**, portant catégorie, portée **et genre grammatical** | partiel — le genre manque (**RT-51**) | La veille, par accident plutôt que par balayage |
| A3 | Preuve de marché **rejouable et périssable** par terme de visibilité | absent (**RT-48**) | Tour 10, à la demande |
| A4 | **Arbitrage humain** sur les termes à enjeu | aucun, et c'est voulu | Tour 14 — **étape légitime** |
| A5 | Traduction | `check-glossaire` + `check-traductions` | En amont |
| A6 | Contrôle du genre et de l'accord après substitution | absent (**RT-51**) | **Jamais** — 11 fautes en production |
| A7 | Cohérence **interne** de chaque langue, confrontée aux sources de données | absent (**RT-54**) | **Jamais** — 2 faits faux dans 7 langues |
| A8 | Cohérence **interlangue** | partiel — `check-llms` ne couvre que `llms.txt` | Tour 9 |
| A9 | **Relecture native déclarée**, bloquante si absente | absent (**RT-52**) | Tours 16 et 17, après la mise en production |
| A10 | Dimensionnement SERP | `check-seo` — existe | Tour 14 |
| A11 | Remise, avec déclaration des risques **fermés ou refusés** | absent (**RT-52**) | Tour 12, à la demande |

### Chaîne B — « audite les traductions de ce produit »

Dix étapes, dont trois ont été écrites à la main par l'exploitant pendant la session. Ce sont des étapes de méthode, identiques d'un produit à l'autre — donc exactement ce qu'une chaîne déclarée devrait porter.

| # | Étape | Où elle a eu lieu ici |
|---|---|---|
| B1 | Ligne de base mécanique : jouer les contrôleurs existants | Tour 9 |
| B2 | **Carte des sources de vérité** — quel fichier est source, lequel est artefact | **Écrite à la main par l'exploitant**, tour 4 |
| B3 | Confrontation glossaire ↔ emploi réel, par langue | Tour 9 |
| B4 | Preuve de marché rejouée, et sa péremption vérifiée | Tour 10, à la demande |
| B5 | Cohérence interne, interlangue, et contre les sources de données | Tours 9 et 17, incomplètement |
| B6 | Dimensionnement SERP | Tour 9 |
| B7 | Entités, citabilité, directives IA (axe GEO) | **Ajouté à la main**, tour 2 |
| B8 | Plan applicable : ancres **verbatim** vérifiées + sidecar machine | **Spécifié à la main**, tour 4 |
| B9 | Arbitrages isolés et **posés à l'humain**, jamais tranchés seuls | Tour 14 — **a bien fonctionné** |
| B10 | Critère d'arrêt et déclaration explicite de ce qui n'est pas couvert | Tour 9, puis corrigé aux tours 16 et 17 |

**Ce qui saute aux yeux de cette confrontation** : les étapes que la session a **inventées à
la demande** (B2, B7, B8) sont des étapes de méthode, identiques d'un produit à l'autre.
Les étapes qu'elle **n'a pas faites** (A6, A7) sont celles dont l'oracle n'existe pas. Et
la seule étape qui a bien fonctionné du premier coup sans outil (B9, l'arbitrage) est
précisément celle qui doit rester humaine.

## Le critère de réussite

Ce chapitre existe pour qu'on puisse dire, un jour, que c'est réglé — autrement qu'à
l'impression.

Au prochain produit, la demande **« audite les traductions »**, formulée en une phrase et
sans autre instruction, doit produire :

1. un rapport dont **100 % des ancres verbatim du plan existent** dans les fichiers visés,
   vérifiable par script ;
2. **zéro défaut détectable mécaniquement** au moment de la remise sur les classes genre/
   accord et cohérence interne — les oracles de RT-51 et RT-54 devant exister pour cela ;
3. la **liste explicite des arbitrages posés à l'humain**, non vide ;
4. une **déclaration de relecture native** : faite, ou explicitement refusée et consignée.

**Mesure de l'objectif** : sur un run comparable, le nombre de tours de classe **DÉFAUT**
tombe à **0**, et le nombre de tours de classe **DÉCISION** reste **supérieur ou égal à 1**.
La seconde moitié de la mesure est aussi importante que la première : un run qui n'aurait
plus aucun tour de décision aurait cessé de demander à l'exploitant ce qui lui revient.

## Ce que ce retour ne couvre pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

Il ne dit rien de la **valeur** des deux chaînes proposées : elles sont dérivées d'**une**
session, sur **un** produit, dans **un** domaine — un site touristique multilingue. Rien ici
n'établit qu'elles valent pour un produit applicatif, ni que l'ordre des étapes est le bon
ailleurs. Elles sont une proposition à confronter, pas un standard.

Il ne chiffre pas non plus le **coût de mise en œuvre**. Quatre oracles manquants (RT-47,
RT-48, RT-51, RT-54) et une règle de clôture (RT-52) sont cités comme les briques de la
chaîne ; ce lot ne dit pas lesquelles valent l'effort, ni dans quel ordre. Ce tri appartient
au registre.

Enfin, il ne traite pas la question de la **relecture native** elle-même. RT-51 demande un
filet mécanique **avant** elle ; personne ne remplace un locuteur natif, et ce lot ne
prétend pas le contraire.

## Remarques restées au produit

Ce que le produit a constaté et n'a pas remonté, chacune avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Deux tours (7 et 8) ont porté sur la **restitution** d'un livrable long rendu dans le fil de conversation plutôt qu'en fichier | Le livrable a été écrit en fichier, puis affiché en pleine largeur | oui, mais **non remonté séparément** | **Généralisable, volontairement fondu dans RT-55** comme preuve et non comme retour distinct. Un livrable de plus de quelques dizaines de lignes se remet en fichier ; c'en est un cas particulier, et lui donner un id propre diluerait le lot. |
| La capacité séminaire reste annoncée à 23 personnes, sans source | Non corrigée — **ouverte, remise à l'exploitant** | non | **Rien de généralisable** — la classe est déjà remontée en RT-54 ; la valeur juste appartient à l'exploitant. |
| Les cinq lots du jour ont été remis séparément, sans qu'aucun ne dise ce qu'il ajoutait aux précédents | Ce lot-ci porte le chapitre de positionnement | oui, mais **non remonté** | **Rien de généralisable au registre** : le gabarit `RETOURS-FORGES.md` n'exige pas ce chapitre, et il a raison — il ne se justifie que quand plusieurs lots partent le même jour sur le même sujet. Consigné ici pour que la pratique soit visible. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** Ce lot est une
synthèse : il ne produit aucun livrable et n'en consomme aucun. La section est déclarée
vide, elle n'est pas omise.

Une observation hors périmètre de R-46, consignée ici faute de canal plus juste. Le gabarit
`RETOURS-FORGES.md` demande, pour chaque retour, une **portée** — *générique* ou
*produit+générique*. Il ne prévoit rien pour un retour dont la portée est **un autre
retour** : RT-55 ne parle pas du produit, il parle de la façon dont RT-47, RT-48, RT-51 et
RT-54 se composent — ou ne se composent pas. La colonne `Portée` porte donc « générique »
faute de mieux, et le chapitre de positionnement supplée en prose. Si les retours de
second ordre deviennent fréquents, le gabarit gagnerait à les nommer.

## Confirmations positives

- **La classe DÉCISION a bien fonctionné, sans outil.** Les quatre arbitrages du tour 14 ont
  été isolés, posés avec leurs branches et leurs conséquences, et aucun n'a été tranché par
  la session. C'est la seule étape de méthode que ce run a exécutée correctement du premier
  coup, et elle est aussi la seule qui doit rester humaine. Elle est citée ici pour qu'une
  future chaîne ne l'automatise pas par mégarde.
- **Le ledger a tenu son rôle malgré l'absence de chaîne.** Onze entrées ont été consignées
  au fil de la session — retours, décisions, corrections — dont **deux corrections portant
  sur des lots déjà remis**. C'est ce qui a permis à ce lot de se construire sur des faits
  datés plutôt que sur un souvenir de fin de run, exactement comme la consigne du produit le
  prescrit.
- **La boucle de retour fonctionne, et vite : RT-50 a été corrigé pendant la session.** Remonté
  le matin (lot `20260826c`), il est ingéré et traité l'après-midi sous **TF-0659** :
  `run-oracles.mjs` lit désormais **les deux contrats** — `findings[].msg` et `fails[]` — et le
  correctif porte la mesure d'origine verbatim dans son commentaire, « trois tours pour retrouver
  le registre d'oracles […] un hook BLOQUANT qui rend la main sans dire quoi corriger coûte plus
  cher qu'un hook verbeux ». Un `self-test.mjs` couvre le cas. Vérifié en écrivant ce lot :
  l'échec M7 a été rendu **avec son motif en clair**, là où le même oracle rendait un détail vide
  le matin. C'est la démonstration que ce lot-ci demande pour les quatre autres retours — un
  défaut nommé avec sa mesure se traite.
- **`oracle-lot.mjs` a rendu PASS sur les cinq lots du jour**, avant chaque remise. Aucune
  dérogation n'a été nécessaire, contre treize refus mesurés sur les lots antérieurs à son
  arrivée.

## Ordre recommandé

1. **RT-55** — seul retour du lot, et il conditionne le traitement des quatre autres. Traités
   isolément, RT-47, RT-48, RT-51 et RT-54 donneront quatre oracles sans place assignée dans
   une séquence, donc quatre contrôles qu'un run pourra jouer dans le désordre ou pas du
   tout — ce qui est précisément ce qui s'est produit ici.
