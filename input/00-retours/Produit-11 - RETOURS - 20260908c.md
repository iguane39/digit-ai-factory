# Retours forgés — Produit-11 — 20260908c

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : troisième retour humain du 08/09/2026, sur un document de référence remis
  dans le tour précédent : *« Et les informations de l'API, elles ne sont pas dans le tableau ?
  Comment je peux faire si je n'ai pas les infos les plus importantes ? Et pour les clés, mets
  les 5 premiers caractères pour pouvoir les identifier facilement. »* Les deux points portent
  sur la même chose, vue de deux côtés : **un document de référence qui contient tous les
  éléments mais qu'un lecteur ne peut pas UTILISER.**
- **Références ledger** : `forge\ledger.jsonl` seq 170 (entrée `type: retour`)
- **Lots précédents du jour** : `20260908a` et `20260908b`, remis et donc immuables. Celui-ci
  ne les corrige pas.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-09-08

**Numérotation** : BAV2 tient une séquence `RT-nn` ; RT-1 … RT-47 sont consommés. Ce lot
continue en RT-48 … RT-49.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Le fait mesuré, avant toute interprétation

Le document remis portait **quatre** tableaux pour un seul appel :

| Tableau | Ce qu'il portait |
|---|---|
| « La requête » | méthode, racine, les deux routes, les délais, la forme du corps |
| « Les trois en-têtes » | les noms d'en-têtes et leur contenu |
| « Le jeton présenté » | audience, protocoles, délais, cache |
| « Ce qui est réellement servi, par environnement » | **uniquement ce qui DIFFÈRE** entre dev et qualif |

Chaque élément de l'appel était présent, exact, et sourcé. **Aucun tableau ne permettait
d'émettre la requête.** Le lecteur qui ouvre le document pour appeler la passerelle lit le
dernier tableau — celui qui porte son environnement — et n'y trouve ni URL, ni méthode, ni
en-tête : seulement `ECS_API_BASE : absente → défaut du code`, qui le renvoie trois tableaux
plus haut.

Sur les clés, le document disait « secret d'application `ecs-subscription-key` → `<URL du
coffre>` ». Rien ne permettait de savoir si les deux environnements partagent une clé. Relevé
depuis les conteneurs après le retour : **elles sont différentes** — l'une commence par
`26f12`, l'autre par `54f1c`, toutes deux de 32 caractères.

---

## factory (`digit-ai-factory`)

Les deux retours portent sur les documents de référence d'un produit, dont la factory
prescrit l'existence et le rôle (règle 20 du socle : les huit fichiers de `docs\projet\`).

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-48 | majeur | produit+générique | **Un tableau de référence organisé par « ce qui varie » oblige le lecteur à recoller le document, et rien ne l'interdit.** Le réflexe de rédaction est de factoriser : ce qui est commun en tête, le delta par environnement en fin. C'est l'organisation la plus économique à ÉCRIRE et la plus coûteuse à LIRE, parce que le lecteur n'arrive jamais par le début — il arrive par son environnement. Fait mesuré ci-dessus : quatre tableaux, chaque élément exact, et le tableau par environnement inutilisable seul. Retour humain, mot pour mot : « Comment je peux faire si je n'ai pas les infos les plus importantes ? » **Le coût est asymétrique**, comme pour S16 au bloc 3 d'une restitution : la duplication coûte quelques lignes à l'auteur une fois, et l'absence coûte au lecteur un aller-retour à chaque consultation. | Une règle des documents de référence : **un tableau indexé par environnement, par tenant ou par instance est AUTOSUFFISANT — il porte tout ce qui est nécessaire à l'action, y compris ce qui ne varie pas.** La factorisation est admise pour l'EXPLICATION, jamais pour le tableau dont on se sert. Un oracle bon marché la mesure : dans un tableau dont une colonne d'en-tête nomme un environnement connu du produit, aucune cellule ne doit renvoyer ailleurs dans le document (« voir ci-dessus », « défaut du code », « idem » sans valeur résolue). La classe la plus proche du référentiel est `lecture-tiers-non-jugee` : personne ne juge si un lecteur sans contexte peut se servir du livrable, et c'est exactement ce qui a manqué. |
| RT-49 | majeur | générique | **Un secret ne se publie pas, et rien ne dit comment un lecteur IDENTIFIE celui qui est en place.** La doctrine interdit à juste titre d'écrire une valeur. Elle est muette sur l'autre moitié du besoin : un document qui écrit « secret, au coffre » ne permet pas de répondre à trois questions courantes et légitimes — les deux environnements partagent-ils cette clé, celle en place est-elle celle qui a été mise en circulation, et une rotation a-t-elle pris effet. Fait mesuré : le document remis ne permettait aucune des trois ; après relevé, les deux clés sont différentes, ce que personne ne pouvait savoir. Retour humain : « pour les clés, mets les 5 premiers caractères pour pouvoir les identifier facilement. » | Une **forme d'empreinte prescrite** : un secret se désigne par ses **N premiers caractères et sa longueur** (N = 5 retenu ici), jamais par sa valeur — et le relevé se fait **depuis l'exécution qui porte le secret**, jamais depuis le coffre, de sorte qu'aucune valeur ne transite par un poste de travail. Deux corollaires qui font la valeur de la règle : la longueur détecte une clé tronquée par un copier-coller, et l'empreinte permet de comparer deux environnements sans rien divulguer. **Aucune classe de `CLASSES.json` v1.3.1 ne couvre ce défaut** : la clé portée au sidecar est la voisine la plus proche. Classe proposée au pilot : `secret-non-identifiable-en-documentation`, famille `gabarit-document`. |

**Portée** (R-45, 21/08) : *générique* — le défaut vaut pour tout projet employant la forge ;
*produit+générique* — le produit l'a corrigé chez lui ET la classe vaut ailleurs.

---

## Remarques restées au produit

Ce que le produit a corrigé chez lui et **n'a pas remonté**, chacune avec son verdict de
généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le tableau par environnement du document de paramétrage ne portait que le delta | Refondu en tableau autosuffisant : méthode, URL effectives complètes, les trois en-têtes, audience et fournisseur du jeton, délais, puis les valeurs par environnement | **oui** | C'est RT-48, remonté ci-dessus. La correction locale est faite ; la règle manque au socle |
| Les deux clés d'abonnement n'étaient pas identifiables | Empreinte de cinq caractères et longueur, relevée depuis chaque conteneur, plus le mode opératoire pour la rejouer | **oui** | C'est RT-49, remonté ci-dessus |
| Les deux environnements portent des clés d'abonnement DIFFÉRENTES, ce que personne ne savait | Rien à corriger — c'est un fait, et il est désormais écrit | non | Une propriété de ce produit, sans portée ailleurs. Elle vaut d'être connue : une rotation faite d'un côté ne couvre pas l'autre |
| La session vers l'outil de livraison a expiré en cours de mandat, et aucune exécution ne peut plus être lancée ni relue | Rien à corriger : le renouvellement demande une ouverture de session par code d'appareil, geste humain | non | Contrainte de poste, déjà connue et notée dans la mémoire de travail du produit. Rien de généralisable à une forge |

---

## Retours sur les documents produits

Le document concerné est `docs\projet\PARAMETRAGE.md`, l'un des huit fichiers que la règle 20
du socle prescrit pour tout produit. Il **ne porte ni en-tête `gabarit` ni
`version_du_gabarit`** — les huit fichiers de `docs\projet\` sont nommés et décrits par la
règle, mais ils ne proviennent pas d'une famille de `gabarits\documents\`.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `docs\projet\PARAMETRAGE.md` | aucun — fichier prescrit par la règle 20, sans famille de gabarit | une règle sur l'autosuffisance des tableaux indexés par environnement, et une forme d'empreinte pour les secrets | **fait rapporté, mot pour mot** : « Et les informations de l'API, elles ne sont pas dans le tableau ? Comment je peux faire si je n'ai pas les infos les plus importantes ? » — le lecteur a ouvert le tableau de son environnement et n'a pas pu composer l'appel | le tableau autosuffisant, l'empreinte des clés, et le mode opératoire pour relever une empreinte depuis un conteneur | générique |

**Et c'est peut-être le retour le plus utile de ce lot** : les huit fichiers de `docs\projet\`
sont les documents les plus RELUS d'un produit, et les seuls que la bibliothèque de gabarits
ne couvre pas. La règle 20 dit quels fichiers doivent exister et ce qu'ils contiennent ; rien
ne dit à quoi ressemble un bon tableau de paramétrage. Une famille de gabarit pour ces huit
fichiers — ou au moins pour celui-ci — fermerait la classe de RT-48 à la source, au lieu de la
corriger produit par produit.

---

## Confirmations positives

- **Le retour humain a nommé le défaut mieux qu'un oracle ne l'aurait fait.** « Comment je
  peux faire si je n'ai pas les infos les plus importantes » désigne un critère
  d'UTILISABILITÉ, pas de complétude — et le document était complet. C'est la distinction que
  `oracle-lecture-tiers` cherche à mesurer, sur un cas où elle est nette.
- **La demande sur les clés était plus juste que la prudence qui l'a précédée.** Refuser
  d'écrire cinq caractères aurait protégé une entropie négligeable et laissé trois questions
  d'exploitation sans réponse. La règle « ne jamais publier un secret » restait tenue ; ce qui
  manquait était la moitié utile.
- **`oracle-synthese` a de nouveau nommé un défaut réel** dans la restitution du volet
  précédent, sous S25 : une incapacité affirmée doit NOMMER les chemins essayés. J'avais écrit
  « je ne peux pas lire son journal » ; deux chemins avaient été essayés et un troisième existe
  hors de portée. Les trois sont désormais écrits.
- **`oracle-lot.mjs` présent et à jour**, contrôle joué avant remise.

---

## Ordre recommandé

1. **RT-48** — la règle se formule en une phrase et se mesure par un oracle bon marché. C'est
   aussi celui dont la portée est la plus large : tout produit tient des tableaux indexés par
   environnement. Effort : simple × court.
2. **RT-49** — la forme d'empreinte est plus simple encore à écrire, mais elle touche à la
   doctrine des secrets : elle mérite d'être tranchée par une personne, pas glissée dans un
   gabarit. Effort : simple × court, décision incluse.

---

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les deux retours suivent un retour humain, et aucun des deux n'est couvert :

- **RT-48** — **aucune règle ne le couvre.** Le socle prescrit l'EXISTENCE et le RÔLE des huit
  fichiers de `docs\projet\`, jamais la forme de leurs tableaux. La classe la plus proche du
  référentiel, `lecture-tiers-non-jugee`, dit qu'aucun oracle ne juge si un lecteur sans
  contexte comprend le livrable — c'est exactement le trou, et il est déclaré comme tel : un
  domaine sans oracle au sens du § 4 de quality-oracles.
- **RT-49** — **aucune règle ne le couvre non plus.** La doctrine interdit de publier un
  secret et s'arrête là. L'interdiction est juste ; c'est son complément qui manque, et la
  classe est à créer au référentiel du pilot — jamais dans un sidecar.
