# Retours forges — Produit-02.com — 20260826e

- **Contexte** : relecture des quatre langues que l'application de l'audit n'avait pas
  touchées — français (la source), anglais, italien, néerlandais — demandée par l'exploitant
  après la relecture des trois langues substituées. Elle a trouvé cinq défauts, dont deux
  d'une classe que l'audit avait déclarée close.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 67
  (entrée `type: retour`) et seq 68 (`type: correction` portant sur l'audit lui-même).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce que la relecture des langues non touchées a trouvé

Ce chapitre dit pourquoi un seul retour suffit, alors que la relecture a trouvé cinq défauts.

Trois des cinq sont propres au produit et restent chez lui : un titre de héros italien au
singulier là où le site compte cinq hébergements, un sujet composé italien avec un verbe au
singulier, et deux faits que l'application de l'audit avait fait tomber de descriptions en
les raccourcissant. Ils sont corrigés, ils ne généralisent rien.

Les deux autres sont d'une même classe, et cette classe est le retour. L'audit du 26/08 avait
conclu, mesure à l'appui : *« Aucune incohérence factuelle interlangue. C'est un résultat,
pas une absence de contrôle. »* La conclusion est exacte et le reste. Elle ne dit simplement
rien de ce qui a été trouvé ensuite : **deux contradictions internes, fidèlement traduites
dans les sept langues**, donc parfaitement cohérentes entre elles, et fausses partout.

## `digit-ai-forge-seo-geo`

Un retour, sur ce qu'une comparaison interlangue ne peut pas voir par construction.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-54 | majeur | générique | **Vérifier que sept langues disent la même chose ne vérifie pas qu'une seule soit cohérente avec elle-même.** L'audit du 26/08 a comparé six familles de faits sur les sept langues — distance, nombre d'hébergements, capacité groupe, surfaces, prix, ouverture annuelle — et rendu zéro écart. Un contrôle mécanique des nombres, clé par clé, a ensuite confirmé : 25 divergences relevées sur 735 chaînes, dont **22 sont des formats de localisation légitimes** (horloge de 12 heures en anglais, notation `11.00` en néerlandais, séparateurs de milliers). La comparaison interlangue est donc saine. Elle a pourtant laissé passer deux faits faux : (1) **Granville** est annoncée à **40 minutes** dans `listing.intro` et à **45 minutes** dans `contact.distances` et dans sa propre page `villes.granville.intro` — deux affirmations contre une, dans les sept langues ; (2) la **capacité séminaire** est de **23 personnes** dans `meta.profilSeminaire.desc` et de **30** dans `profils.seminaire.intro`, sur la même page, quand `data.mjs` donne **22** pour les trois hébergements que ce profil sélectionne — le nombre 23 ne correspond à aucune source du dépôt. Le mécanisme est le même dans les deux cas : **une erreur de la langue source se traduit fidèlement**, et une comparaison entre langues la valide au lieu de la voir. Plus les langues sont nombreuses et bien traduites, plus le faux est unanime. | Deux contrôles distincts sont nécessaires là où l'axe GEO n'en prescrit qu'un. Le premier existe et fonctionne : la **cohérence interlangue**. Le second manque : la **cohérence interne d'une langue**, c'est-à-dire deux affirmations du même corpus qui portent sur le même fait et donnent des valeurs différentes. Il est outillable sans traitement du langage : extraire les couples (entité, nombre, unité) — « Granville, 40, minutes » — et signaler les entités portant plusieurs valeurs. Le cas séminaire montre en outre l'intérêt de confronter ces couples à la **source de données** : `data.mjs` savait que la somme valait 22, et personne ne le lui a demandé. Un troisième contrôle, plus simple encore, aurait attrapé le même défaut : tout nombre affiché dont aucune source du dépôt ne rend compte est un nombre orphelin, et un nombre orphelin mérite d'être nommé. |

## Ce que ces retours ne couvrent pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

La relecture a porté sur **les sept langues du corpus** — les trois substituées d'abord, les
quatre autres ensuite — mais elle a été conduite par la session, **pas par des locuteurs
natifs**. Onze fautes d'accord avaient été trouvées au premier passage, cinq défauts au
second ; rien ne garantit qu'il n'en reste pas. Le besoin de relecture native subsiste
entier, et c'est l'objet de **RT-51** remonté au lot précédent.

Ce lot ne dit rien non plus de la **valeur juste** de la capacité séminaire. Trois nombres
s'affrontent — 23 affiché, 30 sur la même page, 22 calculable depuis `data.mjs` — et aucun
raisonnement ne les départage sans une information que le dépôt ne porte pas. Le point est
**ouvert et remis à l'exploitant**, pas résolu.

## Remarques restées au produit

Ce que le produit a corrigé chez lui, chacune avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Granville annoncée à 40 minutes dans `listing.intro`, à 45 ailleurs | Alignée sur 45 dans les 7 langues — deux affirmations contre une | **Généralisable → REMONTÉ en RT-54.** | La valeur est propre au produit ; la classe — un fait contredit à l'intérieur d'une même langue et traduit fidèlement partout — ne l'est pas. |
| `home.heroTitle` italien au singulier (« Casa vacanze ») quand les six autres langues sont au pluriel et que le site compte 5 hébergements | Passé au pluriel (« Case vacanze ») | non | **Rien de généralisable** — défaut de traduction antérieur à ce run, vérifié dans l'historique git. |
| Italien : « Le Familial **e** la sua grande tavolata da 12 **diventa** » — sujet composé, verbe au singulier | Réécrit en « Le Familial, **con** la sua grande tavolata da 12, diventa » | non | **Rien de généralisable** — le français disait « avec sa grande tablée », un complément rendu par une coordination. |
| Le prix « dès 95 € » avait disparu de `meta.gites.desc` en espagnol et en portugais, et l'acompte de 30 % de `meta.reservation.desc` en espagnol et en italien | Rétablis, sous les seuils de longueur | non | **Rien de généralisable, et c'est un défaut de ce run** : les raccourcis de longueur ont supprimé des faits au lieu de mots. La leçon — un raccourci de description ne doit pas faire tomber un fait que les autres langues gardent — est un cas particulier de RT-54 et n'ajoute rien au registre. |
| `home.pRegion` emploie un synonyme du terme retenu dans plusieurs langues | Non corrigée | non | **Déjà consigné au lot `20260826d`** — variation présente dans la source française, choix d'écriture. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** La relecture n'a
produit aucun livrable : elle a modifié des chaînes de traduction et alimenté le ledger. Ses
constats vivent dans ce lot et dans les entrées seq 67 et 68. La section est déclarée vide,
elle n'est pas omise.

Une observation hors périmètre de R-46, consignée ici faute de canal plus juste. Le livrable
d'audit du 26/08 porte une section « Incohérences factuelles interlangues » qui conclut
« Aucune ». Cette conclusion est exacte et vérifiable, mais **son titre promet plus que ce
qu'elle mesure** : un lecteur pressé y lit « les faits du site sont cohérents », alors qu'elle
dit « les langues sont d'accord entre elles ». Une entrée `type: correction` au ledger (seq
68) rattache désormais les deux contradictions internes à cette section. Si un gabarit de
rapport d'audit multilingue devait naître, la distinction mériterait d'être portée par le
gabarit lui-même, pas par la vigilance de l'auteur.

## Confirmations positives

- **Le contrôle mécanique des nombres a un excellent rapport signal/bruit.** Comparer les
  nombres clé par clé sur sept langues a produit 25 signalements sur 735 chaînes, dont 22
  identifiables en une lecture comme des formats de localisation légitimes. Les 3 restants
  étaient tous réels. Ce contrôle n'existait pas : il a été écrit pendant la relecture et
  mérite d'être gardé.
- **`check-i18n` a rendu la relecture possible.** Les sept langues portant exactement la même
  arborescence de clés, chaque chaîne a pu être comparée à son équivalent dans les six autres
  — c'est ce qui a fait ressortir le singulier italien et les faits tombés des descriptions.
  Sans cette garantie structurelle, la relecture aurait été une lecture, pas une comparaison.
- **La chaîne de déploiement a tenu sur trois poussées successives** dans la même journée,
  contrôles verts et vérification de production verte à chaque fois.

## Ordre recommandé

1. **RT-54** — seul retour du lot. Il porte sur un angle mort de méthode, pas sur un outil
   défaillant : le contrôle interlangue fonctionne, il répond simplement à une autre question
   que celle qu'on croit lui poser. Le contrôle manquant est mécanisable sans traitement du
   langage, et le cas « nombre orphelin, qu'aucune source ne justifie » est le plus simple
   des trois à écrire pour le gain le plus immédiat.
