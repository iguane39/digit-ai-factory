---
destinataire: humain
role: restitution de fin de tour, demande « synchronise avec github » du 25/09/2026
sources_de_verite: git des 16 dépôts gouvernés · todo/TODO.jsonl · journal de la session du 24/09 au soir sur ce poste (D-22 à D-24) · output/04-plans/Digit-AI - Synthese Mandat - Parc synchronise et le retour de coherence devenu oracle - 20260924a.md (D-15, D-17 à D-21) · gabarits/RESTITUTION.md (v2.27.0)
verifie_le: 2026-09-25
---

# Digit-AI — Synthèse de mandat — Parc synchronisé et décisions des deux postes réunies — 25/09/2026

## 0. Synthèse d'ouverture

C'est synchronisé. Aucun des deux postes n'avait rien publié depuis hier soir : la seule différence
entre ce poste et GitHub était le relevé d'héritage écrit à l'ouverture de cette session, et il est
publié. Avant l'envoi, la garde qui interdit de publier un nom de client ou de produit a d'abord
refusé : elle lisait une mise de côté locale d'hier soir, jamais publiée, qui porte deux noms réels.
Jugée sur ce qui partait vraiment, elle a rendu vert. Retirer cette mise de côté suffit à la rendre
verte partout, et ce retrait vous revient. Les deux postes avaient aussi laissé hier des décisions
ouvertes, chacun de son côté : je les réunis ici, sept reprises et deux neuves. L'une est pressée :
un lot de retours attend son accueil, et il passera ce soir à 21:52 le délai de 24 heures au-delà
duquel le contrôle d'ouverture le déclare oublié.

## 1. En-tête d'identification

- **quoi** — synchronisation du parc avec GitHub, sur votre message « synchronise avec github ».
- **sur quoi** — les 16 dépôts gouvernés de `c:\dev` : le pilot `digit-ai-factory`, les 13 forges
  `digit-ai-forge-*`, `digit-ai-queue` et le canal confidentiel cloné sous `_confidentiel` ; les
  dépôts de produits n'en font pas partie.
- **quand** — le 25/09/2026, de 18:28 à 18:55 (UTC+02:00), soit 27 minutes, heures relevées par
  `date` ; la fin est l'heure de dépôt de cette synthèse, son envoi suit.
- **qui** — session de pilotage Claude Opus 5.5 ; pilot passé de `68de89b7` à `948b945d` ; aucun
  agent délégué ; escalade de modèle : aucune.
- **intention** — que ce poste et GitHub portent le même état, sans perdre le travail d'aucun des
  deux postes et sans publier un nom que la table des pseudonymes protège.
  **Test rétro** : l'intention est servie sur l'état — les 16 dépôts rendent `0 0` face à GitHub
  après le dernier `git fetch` — et sur les noms : la porte rend PASS sur ce qui est parti. Elle ne
  l'est qu'en partie sur la porte elle-même : jouée sur le dossier du pilot, elle reste rouge tant
  que le remisage local d'hier soir existe (bloc 6).

## 2. Verdict en une ligne

**16 dépôts sur 16 à égalité avec GitHub** (`0 0` à 18:40, après `git fetch`) · **1 enregistrement
publié** : pilot `68de89b7..948b945d`, le relevé d'héritage du 25/09 · porte des noms **FAIL** sur le
dossier du pilot (4 bloquants, tous dans un remisage local jamais publié), **PASS** sur le paquet de
la seule branche envoyée (0 bloquant, 43 antériorités) · **9 décisions** attendues, dont 2 neuves.

## 3. Décisions attendues de l'humain

Les 3 bloquants qui retiennent un geste de suppression, énoncés ici en entier :

- **La mise de côté locale d'hier soir, un « remisage » git, ne se supprime pas sans vous**, en vertu
  de R-29 (une suppression reste un geste humain décidé). Elle porte les relevés d'héritage du 22 au
  24/09, écrits par un code en retard, avec 2 noms réels de produits ; c'est elle, et elle seule, qui
  fait refuser la porte des noms. Pour la lever : vérifier par
  `git -C C:/dev/digit-ai-factory stash list` qu'elle est en tête, libellée « Releves locaux du
  22-24/09 », puis lancer `git -C C:/dev/digit-ai-factory stash drop stash@{0}`. Si rien n'est
  fait : la porte des noms jouée sur le dossier du pilot rend FAIL sur ce poste, et chaque envoi
  doit être jugé sur un paquet de la branche envoyée.
- **Le fichier « null » de 117 octets, à la racine du parc, ne se supprime pas sans vous**, pour la
  même règle. Une commande Windows l'a écrit le 24/09 à 19:03 en croyant jeter sa sortie : c'est une
  réponse de refus « Unauthorized », dont la seule chaîne longue, `b1768…` (25 caractères), est la
  cible de la requête refusée. Pour le lever : l'ouvrir, vérifier qu'aucun jeton n'y figure, puis le
  supprimer. Si rien n'est fait : le relevé d'ouverture le signale à chaque session.
- **L'arborescence liée laissée par un agent le 14/09 ne se retire pas sans vous**, pour la même
  règle. Sa branche est déjà fusionnée, et ses 11 modifications ne sont que des index régénérés. Pour
  la lever : `git -C C:/dev/digit-ai-factory worktree remove --force .claude/worktrees/agent-ac087535fe0698917`,
  puis `git -C C:/dev/digit-ai-factory branch -d worktree-agent-ac087535fe0698917`. Si rien n'est
  fait : le pilot garde un dossier non suivi, compté à chaque ouverture parmi ses modifications
  locales.

Comment lire les tableaux : chaque tableau porte une option par ligne ; la colonne Coût dit la
complexité et la durée, la colonne Exclusions ce que retenir l'option ferme. La recommandation et sa
source précèdent le tableau ; la ligne « Si rien n'est décidé » le suit. Pour répondre, un sélecteur
suffit, par exemple « D-26 a ». D-25 et D-26 sont neuves. D-24 a été posée hier soir sur ce poste,
après D-22 et D-23 que vous avez tranchées ; D-15 et D-17 à D-21 ont été posées le même jour par
l'autre poste, dans la synthèse 20260924a. Les 7 sont reprises à l'identique, sauf les repères de
temps et de poste, réécrits en dates, le titre de D-24 et la glose d'une de ses règles, rendus
lisibles hors de leur message, et une mesure du jour ajoutée à D-20.

> **D-26 — Voulez-vous que j'accueille et ingère maintenant le lot de retours arrivé au sas de ce poste le 24/09 à 21:52, avant qu'il ne passe ce soir le délai de 24 heures ?**
>
> Un produit a déposé un lot de retours, 2 fichiers, dans `input\00-retours\_arrivee\`, le sas
> d'arrivée du pilot : la salle d'attente ignorée par git où un lot attend d'être pseudonymisé puis
> versé au registre. Le relevé d'ouverture le comptait à 21 heures d'attente ; à 21:52 ce soir, le
> contrôle de la boîte d'entrée le déclarera oublié et rendra un échec à chaque ouverture.
> `todo\accueillir-lot.mjs` pseudonymise le nom et le contenu du lot, puis `todo\ingerer-lot.mjs`
> inscrit ses retours au registre comme candidatures, sans rien décider.
>
> **Recommandation : (a).** Source consultée : `oracles/oracle-boite-entree.mjs`,
> règle B9 (un lot qui attend au sas plus de 24 heures est un oubli), et le précédent de D-22 (a) du
> 24/09, tranchée pour le lot précédent de ce même sas. Accueillir ne décide rien : les candidatures qui en naissent
> vous attendront comme les autres.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* J'accueille puis j'ingère le lot après l'avoir confronté au registre publié, et je publie l'enregistrement | simple × court | aucune |
| **(b)** Le laisser au sas jusqu'à un mandat qui le demande | nul | à partir de 21:52 ce soir, le contrôle de la boîte d'entrée rend un échec à chaque ouverture |

> **Si rien n'est décidé** : (b).

> **D-25 — Faut-il décider les 7 candidatures nées du lot de retours d'un produit, ingéré le 24/09 au soir sur ce poste, pour que je les traite ensuite ?**
>
> Le lot, daté du 22/09 et remis par le produit pseudonymisé Produit-02, raconte la mise en ligne de
> campagnes publicitaires sur une plateforme tierce. Il a donné 7 candidatures : la procédure d'un
> écran tiers livrée en cellules de tableau plutôt qu'en guide, redemandée 5 fois en 56 minutes ; des
> parcours d'interface écrits de mémoire ; un fichier d'import écrit sur un format supposé, refusé en
> entier ; l'absence de cette plateforme dans les références ; une garde de vocabulaire qui ne juge
> pas les annonces ; un journal de run qui ignore en silence un argument mal formé, 11 entrées
> écrites vides puis citées comme preuves ; une écriture concurrente de ce même journal. Trois d'entre
> elles attendent aussi leur classe de défaut, objet de D-24. La session d'hier soir les avait
> laissées en action, sans recommandation.
>
> **Recommandation : (b).** Source consultée : les scores inscrits à leur création dans
> `todo/TODO.jsonl` le 24/09, et le seuil que D-19 et D-21 retiennent, une valeur de 10 ou plus. Le
> journal qui accepte des entrées vides fait mentir des preuves ; le fichier d'import jamais confronté
> au modèle officiel a coûté un dépôt refusé en entier.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 7 | complexe × moyen | le mandat suivant traite aussi 5 candidatures de valeur inférieure à 10 |
| **(b)** *(recommandée)* Décider les 2 de valeur 10 ou plus : TF-1366 (le journal de run, valeur 20) et TF-1363 (le fichier d'import, valeur 10) | moyen × court | TF-1361, TF-1362, TF-1364, TF-1365 et TF-1367 restent candidates |
| **(c)** Ne rien décider | nul | les 7 restent candidates, et le journal de run continue d'accepter des entrées vides |

> **Si rien n'est décidé** : (c).

> **D-24 — Puisque la classe de défaut « interface tierce écrite de mémoire » ne peut pas naître sans un contrôle qui la vérifie, que faisons-nous des trois retours qui l'attendent ?**
>
> Trois des sept retours du lot de D-25 décrivent le même défaut, qui n'a pas de catégorie : un
> parcours d'écran, un format de fichier d'import ou un prérequis d'accès d'une plateforme tierce est
> écrit de mémoire. La catégorie ne peut exister qu'avec un contrôle existant qui la vérifie. Aucun
> n'existe aujourd'hui, et en construire un revient à trancher la candidature qui porte ce défaut.
>
> **Recommandation : (a).** Sources consultées : `todo\CLASSES.json`, champ `cliquet_porteur`, posé
> par votre décision D-3 (c) du 16/09 ; `todo\oracle-todo.mjs`,
> règle R15 (une catégorie neuve doit nommer un contrôle existant), appliquée à chaque catégorie ; et
> la note de TF-1307 du 22/09, où le même cas a été tranché ainsi : « La classe se creera quand son
> juge existera ». L'option (b) est le bon état final, mais c'est exactement la correction de
> TF-1362, encore candidate : la construire maintenant trancherait cette candidature à votre place.
> L'option (c) respecte la lettre de la règle sans rien vérifier ici.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Laisser les trois retours en « catégorie à créer » ; la catégorie naîtra avec son contrôle | nul | ils restent hors du compteur des récidives d'ici là |
| **(b)** Construire d'abord le contrôle que le lot propose, puis créer la catégorie et rattacher les trois retours. Ce contrôle serait une règle du contrôle des restitutions : toute action laissée à l'humain qui vise une interface tierce doit citer sa source officielle et la date où elle a été lue. | moyen × moyen | nouvelle version du gabarit de restitution, recopiée chez les produits ; taux de fausses accusations à mesurer sur les restitutions existantes avant mise en service ; revient à retenir TF-1362 |
| **(c)** Créer la catégorie en nommant le contrôle des contrats d'intégration comme son contrôle | simple × court | la règle n'est tenue qu'à la lettre : ce contrôle n'est appelé par aucune étape, il rend « sans objet » chez ce produit, qui n'a pas de contrat d'intégration, et il n'aurait pas vu ce défaut ; c'est ce que le précédent du 22/09 a refusé |

> **Si rien n'est décidé** : (a). C'est l'état actuel, rien n'est écrit.

> **D-15 — Faut-il inscrire à la table des pseudonymes les 8 noms de produits que `todo/HERITAGE-RELEVES.jsonl` écrivait en clair, au prix de corriger tous les fichiers suivis qui les citent ?**
>
> Le journal ne les écrit plus : il pose un marqueur. Mesuré avec la porte de publication et une
> table jetable, les inscrire rendrait bloquantes 174 occurrences dans l'arbre courant du pilot et
> de 3 forges. Parmi elles figure l'archive du registre, que la règle R8 (l'archive du registre
> reste immuable) interdit de réécrire. S'y ajoutent 12 occurrences dans des messages
> d'enregistrement déjà publiés, pour 5 des noms : seule une réécriture d'histoire les efface. Aucun
> des 8 ne porte un nom, un identifiant ni un sigle de client, et 2 sont des noms publics de la marque.
>
> **Recommandation : (a).** Source consultée : la simulation de `oracle-nom-client-publie` du 23/09
> sur `digit-ai-factory`, `digit-ai-forge-conception`, `digit-ai-forge-tests` et
> `digit-ai-forge-design` ; la lecture des 10 valeurs contre la table des clients ; la doctrine de
> TF-1293, « un domaine public n'est pas un nom à pseudonymiser ». La fuite qui continuait, celle du
> journal, est arrêtée ; ce qui reste lisible est antérieur et ne désigne aucun client.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Les laisser hors table : le journal garde le marqueur, rien d'autre ne bouge | nul | les 8 noms restent lisibles dans 174 occurrences suivies et dans l'histoire publiée ; le journal ne mesure pas la descente de ces 8 produits |
| **(b)** Inscrire les 3 noms absents de tout message et corriger leurs 40 occurrences au pilot par un enregistrement ordinaire, archive du registre comprise | moyen × court | une exception à l'immuabilité de l'archive ; les 5 autres restent hors table |
| **(c)** Inscrire les 8 et purger l'histoire publiée du pilot et de 3 forges | complexe × long | envois forcés sur 4 dépôts, l'autre poste se rebâtit, et les produits qui portent leur propre nom voient leurs envois bloqués |

> **Si rien n'est décidé** : (a), qui est l'état présent.

> **D-17 — Faut-il valider les 3 étapes que la chaîne `references/CHAINE-TRADUCTION.md` laisse manuelles ?**
>
> Chaque étape de la chaîne « audite les traductions » a désormais un porteur, sauf 3 résidus.
> B2 (la carte des sources de vérité du produit) : savoir quel fichier en régénère un autre exige de
> connaître le build du produit. B4 (la preuve de marché de chaque terme) : l'outil sait rendre une
> preuve échue, mais aucune durée par défaut n'est fixée. B7 (les entités et la citabilité GEO) :
> elles exigent le site en ligne et une recherche web.
>
> **Recommandation : (a).** Source consultée : le lot source `Produit-02 - RETOURS - 20260826f`,
> section « Chaîne B » ; la mesure de l'agent sur ce lot : aucun incident lié à l'âge d'une preuve,
> donc aucun fondement mesuré pour une durée par défaut.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Valider les 3 propositions : B2 et B7 restent manuelles avec leur motif écrit, B4 n'a pas de durée par défaut et chaque glossaire déclare la sienne | nul | aucune |
| **(b)** Même chose, mais B4 à 365 jours par défaut, la cadence annuelle de forge-seo-geo | simple × court | une preuve de 366 jours devient échue partout, sans mesure qui fonde ce seuil |
| **(c)** Ne rien décider | nul | les 3 étapes restent au statut « décision proposée », et TF-1318 ne se clôt pas |

> **Si rien n'est décidé** : (c).

> **D-18 — Où brancher le juge `oracles/oracle-enclenchement.mjs` dans un run, et faut-il rendre obligatoire la liste des forges mobilisées ?**
>
> Le juge confronte les oracles que chaque forge mobilisée découvre sur son disque aux verdicts
> consignés au ledger du run. Jugé sur les 2 seuls runs réels qui déclarent le schéma et leurs
> forges, il rend FAIL : ces runs consignent tous les verdicts d'un lanceur en une seule entrée, et
> l'outil qui consignerait un verdict par oracle n'existe pas encore. La liste des forges mobilisées
> est facultative au ledger ; la rendre obligatoire ouvre un schéma 1.1. La recommandation garde les
> choix de classement de l'agent : les 9 gates de forge-development comptent comme oracles, les
> vérificateurs de forge-audit n'en sont pas.
>
> **Recommandation : (a).** Source consultée : les 2 ledgers réels jugés le 23/09, en échec par
> regroupement et non par oubli ; `scripts/ledger.mjs`, qui dit qu'étendre sa table des champs dus
> est une décision.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Informatif à la clôture du run, liste des forges obligatoire au prochain schéma du ledger, bloquant une fois l'outil de consignation livré | moyen × moyen | aucun run n'est bloqué avant l'outil |
| **(b)** Bloquant au gate (le contrôle qui autorise la mise en production) dès maintenant | simple × court | tout run qui regroupe ses verdicts est bloqué à la mise en production |
| **(c)** Ne pas le brancher | nul | le juge existe et ne juge aucun run |

> **Si rien n'est décidé** : (c).

> **D-19 — Faut-il décider les 12 candidatures nées du tour du 23/09 dans `todo/TODO.jsonl` ?**
>
> Toutes sont des constats faits en passant pendant l'exécution de vos décisions. Les plus coûteuses
> sont dans le registre des tables : l'écrivain de la table ne pose pas la date d'inscription, et 2
> produits récents ont une histoire jugée sans borne. Viennent ensuite la règle de sceaux qui
> présente une modification réelle comme un simple écart de fins de ligne, et 2 octets de contrôle
> dans une expression du socle des pages. Une dernière garde la recette complète du pilot rouge : un
> contrôle prend le produit de marque pour une forge.
>
> **Recommandation : (b).** Source consultée : les scores des 12 créations du 23/09 au registre, et la
> recette complète du pilot, rouge sur le seul écart du produit de marque.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 12 | complexe × moyen | le mandat suivant les traite toutes, dont 5 de valeur inférieure à 10 |
| **(b)** *(recommandée)* Décider les 7 de valeur 10 ou plus (TF-1328, TF-1330, TF-1333, TF-1331, TF-1334, TF-1326, TF-1332), plus TF-1327 qui garde la recette du pilot rouge | moyen × court | TF-1337 (frappée TF-1325, renumérotée le 24/09), TF-1329, TF-1335 et TF-1336 restent candidates |
| **(c)** Ne rien décider | nul | les 12 restent candidates, et la recette complète du pilot reste rouge sur ce poste |

> **Si rien n'est décidé** : (c).

> **D-20 — Faut-il corriger les 2 générateurs d'index d'output qui dépendent du poste et du moment de leur passage, pour qu'un poste cesse de s'ouvrir « non prêt » après chaque synchronisation croisée ?**
>
> Le 23/09 au soir, sur l'un des deux postes, `node bootstrap.mjs --pull` a refusé de rapatrier le
> pilotage. Les index `output/README.md` et `output/04-plans/README.md`, régénérés localement par
> `scripts/readme-dossiers.mjs` après la dernière publication, entraient en conflit avec ceux que
> l'autre poste avait publiés. La cause est mesurée : chaque synthèse part avec un index généré avant
> qu'elle soit suivie par git, donc en retard d'un fichier, et le passage suivant du hook le corrige
> en local. Le troisième index, `output/LISEZMOI.md`, pèse les fichiers sur le disque : il se
> réécrit sur 316 lignes à chaque changement de poste, sans qu'aucun livrable ait changé. Mesuré de
> nouveau à l'ouverture de ce tour, le 25/09 : 318 lignes réécrites.
>
> **Recommandation : (a).** Source consultée : les candidatures TF-1325 (23/09 au soir) et
> TF-1243 (du 20/09) du registre `todo/TODO.jsonl`, et le remède imprimé par `node bootstrap.mjs --pull`,
> « résoudre (stash/commit), relancer --pull », qui renvoie à l'humain un geste que l'outillage
> provoque lui-même. Les 2 correctifs restent dans le pilotage et ne touchent aucun livrable.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Décider TF-1325 et TF-1243 : l'index se régénère une fois la synthèse suivie par git, au moment de l'enregistrement, et le troisième index lit le poids des fichiers dans git plutôt que sur le disque ; recette jouée avant et après | simple × court | aucune |
| **(b)** Décider TF-1325 seule | simple × court | le troisième index continue de se réécrire sur plus de 300 lignes à chaque changement de poste |
| **(c)** Ne rien décider | nul | le poste s'ouvre « non prêt » après chaque synchronisation croisée, et chaque synthèse publiée porte un index faux d'un fichier |

> **Si rien n'est décidé** : (c). Je continue de remettre les index à l'état du dépôt avant chaque
> rapatriement, et les 2 candidatures restent au registre.

> **D-21 — Faut-il décider les 22 candidatures ouvertes le 24/09 dans `todo/TODO.jsonl`, nées des lots reçus ce jour-là et du tour de l'autre poste ?**
>
> La plus urgente est née du tour du 24/09 : un envoi dont la sortie part dans un filtre qui échoue
> publie malgré le refus de la garde `pre-push`. C'est arrivé le 24/09 à 13:49 sur 13 dépôts, sur
> l'autre poste, et la parade d'une ligne est éprouvée sur un dépôt jetable. Les lots de Produit-64
> portent 11 candidatures, presque toutes sur la recherche dans la page du socle `digit-ai-page-html`,
> et sur 2 juges de `digit-ai-forge-design`. Les 2 lots du produit UIA en portent 7, venues d'un audit
> « du prototype à la production » : faux positifs d'oracles et une fiche de sécurité à livrer
> aussi en PDF ; leur sidecar (le fichier d'accompagnement du lot) ne portait pas de score utile,
> d'où une valeur de 1. Le tour du 24/09 en ajoute 3 autres au pilot : les noms de personnes que
> l'accueil laisse passer, un lot daté d'un jour à venir, l'indice que 2 postes prennent le même jour.
>
> **Recommandation : (b).** Source consultée : les scores inscrits à l'ingestion du 24/09 ; l'essai
> reproductible de la garde contournée ; le risque de publier un nom de personne, qui pèse plus
> que sa valeur calculée.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** Décider les 22 | complexe × long | le mandat suivant traite aussi les 7 candidatures du produit UIA sans score |
| **(b)** *(recommandée)* Décider les 9 de valeur 10 ou plus (TF-1360 la garde contournée, puis TF-1338, TF-1341, TF-1343, TF-1359, TF-1339, TF-1340, TF-1353, TF-1358), plus TF-1357 sur les noms de personnes | moyen × moyen | 12 restent candidates, dont les 7 du produit UIA en attendant un score |
| **(c)** Ne rien décider | nul | les 22 restent candidates, la garde de publication reste contournable par un filtre cassé, et un lot qui nomme une personne passe l'accueil sans alerte |

> **Si rien n'est décidé** : (c).

## 4. Traité — avec sa preuve

Le relevé d'ouverture n'avait rien rapatrié ; après `git fetch`, rien d'autre que le relevé du jour
ne séparait ce poste de GitHub.

- **Le relevé avant tout geste.** Les 16 dépôts rendaient `0 0`, ni avance ni retard. Le dernier
  enregistrement publié du parc datait du 24/09 à 20:25, un envoi de ce poste.
  - preuve : `git fetch` puis `git rev-list --left-right --count HEAD...origin/main` sur chaque
    dépôt, à 18:29 ; `git reflog` ne porte aucune entrée du 25/09 avant ce tour dans les 16 dépôts ;
    `git log -1 --format=%cI origin/main~1` au pilot rend `2026-09-24T20:25:02+02:00`.
- **La seule différence était la ligne du relevé d'héritage du jour, et elle est enregistrée seule.**
  8 produits relevés : 5 sous leur pseudonyme, 3 sous le marqueur « produit hors table ».
  - preuve : lecture de la ligne ajoutée dans `git diff` ; enregistrement `948b945d` ;
    `scripts/verifier-avance-publication.mjs` le classe `restitution` et rend PASS.
- **La porte des noms a d'abord refusé sur le dossier du pilot.** 4 constats bloquants de la règle
  C5 (un nom de produit de la table des pseudonymes), soit 2 noms dans les 2 enregistrements du
  remisage local créé le 24/09 à 20:01, qu'aucun envoi de branche ne publie.
  - preuve : `oracle-nom-client-publie` sur `C:/dev/digit-ai-factory`, de 18:33 à 18:36, sortie 1,
    verdict FAIL, 4 bloquants et 44 antériorités ; les 2 enregistrements ne sont atteignables que
    par `refs/stash` (`git for-each-ref --contains`).
- **Jugée sur ce qui part, la porte rend PASS.** Un paquet `git bundle` de la seule branche `main`,
  à `948b945d`, jugé avec les tables du canal : c'est la mesure que TF-1008 prescrit, une copie à
  branche unique de ce qui est publié.
  - preuve : de 18:37 à 18:39, sortie 0, verdict PASS, 0 bloquant, 43 antériorités.
- **Le pilot est publié, sortie de l'envoi non filtrée.**
  - preuve : `git push origin main` rend `68de89b7..948b945d` à 18:39:51, sortie 0 ; feu vert
    déclaré `FORGE_PUSH_GO="demande humaine « synchronise avec github » du 25/09"`.
- **Le relevé final.**
  - preuve : après un nouveau `git fetch`, les 16 dépôts rendent `0 0` à 18:40:08.
- **Retirer le remisage suffit à rendre la porte verte sur le dossier.** Simulé sans rien toucher au
  pilot : un paquet de `main` et du remisage qui prendrait sa place, le précédent de la pile, daté du
  21/09.
  - preuve : de 18:45 à 18:47, sortie 0, verdict PASS, 0 bloquant, 44 antériorités.
- **Les décisions ouvertes des deux postes sont réunies au bloc 3.** Hier, l'autre poste avait posé
  D-15 et D-17 à D-21 ; ce poste, le soir, D-22 à D-24 sans reprendre les 6 premières. D-22 a été
  tranchée et exécutée, D-23 tranchée et son geste arrêté par la règle R15 d'`oracle-todo` (une
  classe neuve nomme un contrôle existant) ; D-24 attend.
  - preuve : `todo/TODO.jsonl` ne porte aucun événement de décision depuis le 24/09 à 14:23 (UTC) ;
    le journal de la session du 24/09 au soir finit sur D-24, posée à 21:45, sans réponse.

## 5. Non traité — avec son motif

- Le remisage local du 24/09, le fichier « null » de la racine du parc et l'arborescence liée du
  14/09 : motif `garde_fou` — R-29, une suppression reste un geste humain ; inventoriés au bloc 3.
- L'accueil du lot arrivé au sas le 24/09 à 21:52 : motif `decision` — l'accueillir est un mandat
  que ce tour n'a pas reçu ; D-26 le pose.
- Les 9 décisions ouvertes et les gestes qui en dépendent : motif `decision` — D-15, D-17 à D-21 et
  D-24 à D-26.
- Les fichiers non suivis de 4 forges, tous datés des 05 et 06/09 — des entrées et sorties de runs
  dans `digit-ai-forge-conception`, `digit-ai-forge-tests` et `digit-ai-forge-agents`, 5 dossiers de
  références visuelles de produits dans `digit-ai-forge-design` : motif `hors_mandat` — aucun n'est
  né de ce tour, les publier serait un contenu de produit qui demande un feu vert explicite, et
  plusieurs portent le nom d'un produit dans leur chemin.
- Le constat laissé hier soir sur la doctrine de la « classe à créer » : motif `hors_mandat` — sa
  mise au registre relève de la tenue du registre, que ce tour de synchronisation n'a pas reçue.

## 6. Écarts à la lettre

- **Vous avez demandé** de synchroniser. **J'ai aussi enregistré et publié** la ligne du relevé
  d'héritage du jour. **Pourquoi** : c'était la seule différence entre ce poste et GitHub ; le même
  geste a été fait le 24/09 (`4b3b7587`), et l'outil de R-38 §4-5 (le feu vert d'un travail couvre
  sa restitution) le classe restitution.
- **La porte des noms rendait FAIL** sur le dossier du pilot. **J'ai publié** sur son verdict PASS
  rendu sur le paquet de la seule branche envoyée. **Pourquoi** : `git push origin main` n'envoie
  pas les remisages, et TF-1008 établit que seule la mesure sur une copie à branche unique répond à
  la question « que publie-t-on ? ». C'est un contournement de la mesure sur le dossier, déclaré
  comme tel : le refus reste visible sur ce poste tant que le remisage existe.
- **J'ai déclaré** le feu vert en citant vos mots, « synchronise avec github ». **Pourquoi** : les 2
  postes l'ont lu ainsi le 23 et le 24/09. Ce poste n'a pas de hameçon `pre-push` : les 2 portes,
  classement des enregistrements et noms, ont été jouées à la main avant l'envoi.
- **Vous avez demandé** de synchroniser. **J'ai aussi réuni** au bloc 3 les décisions ouvertes des 2
  postes, et j'en pose 2 neuves. **Pourquoi** : la session d'hier soir avait posé D-24 sans reprendre
  les 6 de l'autre poste ; D-25 donne une recommandation aux 7 candidatures qu'elle laissait sans avis,
  et D-26 tient au lot qui passe son délai ce soir.
- **Je publie cette synthèse et les index régénérés** sous la même demande, dans un enregistrement
  qui suit `948b945d` ; aucun autre contenu ne part avec eux.

## 7. Risques

- **Le remisage d'hier soir reste sur ce poste**, avec 2 noms réels de produits, tant que son
  retrait n'est pas fait.
  - signal : la porte des noms jouée sur le dossier du pilot rend FAIL C5 sur `14172cd7` et
    `adfd6cd7`.
  - parade : juger chaque envoi sur un paquet de la branche envoyée — `git bundle create <fichier> main`,
    puis la porte sur ce paquet avec `FORGE_ROOT=C:\dev` ; ne jamais envoyer par `git push --mirror`,
    qui publierait le remisage.
- **Le lot du sas passe ce soir à 21:52 le délai de 24 heures.**
  - signal : `oracle-boite-entree` rend FAIL B9 à l'ouverture suivante.
  - parade : D-26 (a).
- **L'index `output/LISEZMOI.md` publié d'ici sera réécrit par l'autre poste** sur plus de 300 lignes
  à sa prochaine ouverture.
  - signal : `node bootstrap.mjs --pull` y signale des modifications locales sur les index, ou refuse
    de rapatrier.
  - parade : D-20 (a) ; d'ici là, remettre les index à l'état du dépôt avant de rapatrier.
- **Les 2 postes peuvent encore frapper le même numéro de décision.** Ce tour continue à D-25 parce
  que j'ai lu le journal de la session d'hier soir, que l'autre poste ne voit pas.
  - signal : 2 synthèses qui posent un même `D-N` sur 2 sujets différents.
  - parade : cette synthèse, publiée, porte la numérotation jusqu'à D-26 ; tout tour qui pose une
    décision commence par `git fetch` et la lecture de la dernière synthèse publiée.

## 8. Prochaines actions

Les actions ci-dessous sont triées, celles de l'IA d'abord. L'ordre : le lot du sas en tête, parce
qu'il passe son délai ce soir ; puis ce qui suit vos réponses ; côté humain, trancher d'abord, puisque
tout en dépend, puis le remisage, qui fait refuser la porte des noms.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Accueillir puis ingérer le lot du sas : `node todo\accueillir-lot.mjs`, puis `node todo\ingerer-lot.mjs` sur le fichier d'accompagnement `.tf.jsonl` que l'accueil dépose | `auto_ia` | neuve | `dependance_bloc_3` — suit D-26 | à partir de 21:52 ce soir, le contrôle de la boîte d'entrée rend un échec à chaque ouverture |
| **A-2** | Exécuter D-15, D-17 à D-21, D-24 et D-25 selon vos réponses | `auto_ia` | TF-1323, TF-1318, TF-1319, TF-1243, TF-1325, TF-1362, TF-1363, TF-1366 | `dependance_bloc_3` — attend vos réponses | les candidatures et les constructions restent en l'état |
| **A-3** | Créer au référentiel `todo/CLASSES.json` les classes que les lots du 24/09 proposent, chacune seulement avec le contrôle existant qui la vérifie, puis y rattacher leurs candidatures ; une classe sans contrôle reste « à créer » | `auto_ia` | TF-1340, TF-1342, TF-1343, TF-1353, TF-1354, TF-1355, TF-1360, TF-1362, TF-1363, TF-1364 | `dependance_bloc_3` — suit D-21 et D-24 ; la règle R15 d'`oracle-todo` refuse depuis le 16/09 une classe sans contrôle existant | 10 candidatures restent sans classe, hors du compte des récidives |
| **A-4** | Inscrire au registre, en candidature, le constat du 24/09 au soir : la doctrine de la « classe à créer » ne dit pas qu'une classe neuve doit nommer un contrôle existant, et le texte de R15 dit « famille » là où le code vérifie chaque classe | `auto_ia` | neuve | `hors_mandat` — tenue du registre, que ce tour de synchronisation n'a pas reçue | une prochaine session recommandera la même création impossible, comme D-23 l'a fait |
| **A-5** | Trancher D-15, D-17 à D-21 et D-24 à D-26, reprises en entier au bloc 3 — répondre par exemple « D-26 a, D-25 b, D-24 a, D-15 a, D-17 a, D-18 a, D-19 b, D-20 a, D-21 b » | `manuelle_utilisateur` | neuve | `decision` — décider des candidatures, des classes et de l'accueil d'un lot vous revient | D-15 (a), D-24 (a) et D-26 (b) s'appliquent, les autres (c) |
| **A-6** | Retirer le remisage d'hier soir : `git -C C:\dev\digit-ai-factory stash list` doit le montrer en `stash@{0}`, libellé « Releves locaux du 22-24/09… », puis `git -C C:\dev\digit-ai-factory stash drop stash@{0}` ; preuve : la porte des noms jouée sur le dossier du pilot rend PASS | `manuelle_utilisateur` | neuve | `irreversible` — une suppression reste un geste humain (R-29) | la porte des noms reste FAIL sur le dossier du pilot, et chaque envoi doit être jugé sur un paquet de la branche |
| **A-7** | Ouvrir `C:\dev\null`, vérifier qu'il ne porte aucun jeton, puis le supprimer ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve | `irreversible` — une suppression reste un geste humain (R-29) | le relevé d'ouverture le signale à chaque session |
| **A-8** | Retirer l'arborescence liée du 14/09 : `git -C C:\dev\digit-ai-factory worktree remove --force .claude/worktrees/agent-ac087535fe0698917`, puis `git -C C:\dev\digit-ai-factory branch -d worktree-agent-ac087535fe0698917` ; preuve : `git -C C:\dev\digit-ai-factory worktree list` ne liste plus que le pilot | `manuelle_utilisateur` | neuve | `irreversible` — une suppression reste un geste humain (R-29) | le pilot garde un dossier non suivi, compté à chaque ouverture parmi ses modifications locales |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Publié : pilot `68de89b7..948b945d` à 18:39:51, le relevé d'héritage du 25/09 ; cette synthèse et
  les index régénérés partent par un dernier envoi du pilot, porte des noms jouée sur le paquet de la
  branche.
- Sorties des portes et de la simulation : fichiers de la session, hors dépôt
  (`porte-noms-pilot-1.json`, `porte-noms-pilot-bundle.json`, `porte-noms-sim.json`).
- Relus : le journal de la session du 24/09 au soir sur ce poste, pour D-22 à D-24 ; la synthèse
  `output/04-plans/Digit-AI - Synthese Mandat - Parc synchronise et le retour de coherence devenu oracle - 20260924a.md`,
  pour D-15 et D-17 à D-21.
- `todo/TODO.jsonl` : aucun événement dans ce tour.
- Aucune page HTML livrée dans ce tour.
