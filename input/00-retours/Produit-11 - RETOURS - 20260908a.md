# Retours forgés — Produit-11 — 20260908a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : retour humain du 08/09/2026, en fin de session de travail sur le produit :
  *« Le prompt de sortie ne respecte pas le format de la factory, corrige et remonte à la
  factory. »* La session avait rendu, au cours du même mandat, trois messages de fin de
  traitement de 400 à 800 mots, **aucun** portant la structure en dix blocs, **aucun** écrit en
  fichier, **aucun** jugé. Ce lot remonte la cause, qui n'est pas la rédaction.
- **Références ledger** : `forge\ledger.jsonl` seq 168 (entrée `type: retour`)
- **Lot précédent** : `Produit-11 - RETOURS - 20260828a.md`, remis et donc immuable.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-09-08

**Numérotation** : BAV2 tient une séquence `RT-nn` ; RT-1 … RT-42 sont consommés. Ce lot
continue en RT-43 … RT-45.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Le fait mesuré, avant toute interprétation

Trois relevés faits sur ce poste le 08/09/2026, après le retour humain :

| Ce qui a été relevé | Commande | Résultat |
|---|---|---|
| le juge, chez le produit | `ls Produit-11\forge\hooks\` | `factory.mjs` **présent** |
| le câblage, chez le produit | lecture de `Produit-11\.claude\settings.json` | hooks `SessionStart`, `Stop`, `PostToolUse`, `UserPromptSubmit` **tous déclarés** |
| le texte, chez le produit | `ls Produit-11\forge\RESTITUTION.md` | **absent** |
| la racine de la session | `pwd` | `c:\dev\_Client-A\BourseAuxVacants2` — le **parent** du produit |
| le câblage à la racine de session | `ls c:\dev\_Client-A\BourseAuxVacants2\.claude` | **inexistant** |
| le pilot, sur ce poste | `ls c:\dev\digit-ai-factory\oracles\hook-restitution.mjs` | **présent**, avec `oracle-synthese.mjs` et `bootstrap.mjs` |

Le pilot était donc complet, le produit à moitié équipé, et **le câblage se trouvait un étage
plus bas que la racheté de la session** — de sorte qu'aucun hook, ni d'ouverture ni de fin de
tour, ne s'est exécuté une seule fois pendant une session de plusieurs heures qui a produit
trois commits, un déploiement et deux restitutions.

---

## factory (`digit-ai-factory`)

Le produit a rendu trois messages de fin de traitement hors norme sans qu'aucun mécanisme ne
s'en aperçoive, alors que les trois pièces de la doctrine sont censées le rendre impossible.
Les deux premiers retours portent sur la manière dont la doctrine arrive et se déclenche ; le
troisième sur une classe voisine, observée dans le code du produit le même jour.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-43 | majeur | produit+générique | **Le TEXTE de la doctrine manquait chez le produit, et le tableau de portée de `gabarits\RESTITUTION.md` prédit mot pour mot ce que cela produit : « le juge refuse sans que rien n'apprenne la forme : l'agent devine ».** Relevé ci-dessus : `forge\hooks\factory.mjs` présent, `.claude\settings.json` portant les quatre hooks présent, `forge\RESTITUTION.md` **absent**. `forge\retours\CLASSES.json` manquait de la même façon, alors que ce gabarit l'exige depuis le 03/09 pour toute remontée — un lot n'aurait pas pu être écrit conformément sans le recopier d'abord. La session a donc deviné : dix blocs absents, aucun fichier écrit, aucun jugement. Le retour humain reçu est **la phrase même** que la v2.18.0 de la doctrine cite comme son propre retour fondateur (ligne 18 du gabarit) : le défaut se reproduit à l'identique chez un produit deux jours après avoir été corrigé chez le pilot. | Le produit a recopié les deux artefacts et les a **versionnés** (commit `6322ffe`), pour qu'un clone les porte sans dépendre d'une session d'ouverture. Côté pilot : que `scripts\relever-heritage.mjs` (R-47) distingue, pour chaque artefact déclaré en copie identique dans `gabarits\HERITAGE.json`, « absent » de « présent périmé » — un absent est silencieux alors qu'il coûte le plus cher — et que ce relevé soit **jouable sans ouvrir de session** sur le produit, puisque c'est précisément l'ouverture qui ne s'était pas produite. Règle qui aurait évité ce retour : `oracles\hook-ouverture.mjs` § « Héritage des produits », qui recopie les copies identiques — elle existe et n'a pas été jouée, ce qui est l'objet de RT-44. |
| RT-44 | bloquant | générique | **Les trois pièces peuvent être toutes présentes et correctes chez le produit et ne JAMAIS s'exécuter, si la session s'ouvre au-dessus de la racine du produit — et rien ne le dit.** Fait mesuré : la session travaillait depuis `c:\dev\_Client-A\BourseAuxVacants2`, qui contient `Produit-11\` (le produit instancié, avec son `forge\` et son `.claude\settings.json`) et deux dossiers voisins. La racine de session **n'a aucun `.claude\`** : ni `SessionStart` ni `Stop` n'ont été déclenchés, une seule fois, en plusieurs heures. Conséquences enchaînées, toutes constatées : le hook d'ouverture n'a pas recopié la doctrine (d'où RT-43), le hook de fin de tour n'a refusé aucun des trois messages, et **la session n'a eu aucun signal** — un hook qui ne s'exécute pas ne se distingue pas d'un hook qui approuve. Le tableau de portée du gabarit nomme trois modes de défaillance (juge absent, câblage absent, texte absent) ; **celui-ci est un quatrième**, il n'y figure pas, et c'est le seul où les trois pièces sont conformes. Il est aussi le plus probable en pratique : un produit livré dans un dossier de travail client se retrouve presque toujours imbriqué. | Trois pistes, la première suffisant à rendre le défaut visible : **(1)** que `oracles\oracle-portee-doctrine.mjs` (PD1-PD2) ajoute un contrôle **PD3 — le câblage est-il à la racine où les sessions s'ouvrent** : si un `forge\` est trouvé dans un SOUS-dossier du répertoire courant et non dans le répertoire courant, le dire, avec le geste qui répare ; **(2)** que l'héritage propose un `.claude\settings.json` au niveau de l'espace de travail ENGLOBANT quand le produit est imbriqué, déléguant au hook du sous-dossier ; **(3)** une détection bon marché et rétrospective : un produit dont `forge\ledger.jsonl` porte des entrées du jour sans aucune trace d'ouverture du même jour a travaillé hors doctrine — c'est exactement le cas ici, et personne ne pouvait le voir. **Aucune classe de `CLASSES.json` v1.3.1 ne couvre ce défaut** : `heritage-avertissement-tardif` vise l'avertissement qui arrive trop tard, pas le mécanisme qui ne se déclenche jamais. Classe proposée au pilot : `doctrine-non-declenchee-racine-au-dessus-du-produit`, famille `heritage-produit`. |
| RT-45 | majeur | produit+générique | **Une leçon payée, écrite et commentée dans un module d'un produit n'a aucun mécanisme pour atteindre le module suivant du MÊME produit.** Fait mesuré le 08/09 sur ce dépôt : `backend\src\alerts\expedition.py` porte, depuis le 06/09, un commentaire de neuf lignes intitulé « le client_id est EXIGÉ ici, et ce n'est pas de la prudence décorative », qui explique que l'application ne porte qu'une identité managée assignée par l'utilisateur et qu'un fournisseur de jetons sans `client_id` échoue avec un message qui ne nomme pas la cause. Le module de stockage d'images écrit deux jours plus tard a construit `DefaultAzureCredential()` **sans argument**, et a échoué exactement de cette façon dans le conteneur servi — trois écrans énumérant PowerShell, Azure Developer CLI et un courtier interactif, la vraie cause absente. Ni la revue, ni `ruff`, ni `bandit`, ni 819 tests verts ne pouvaient le voir : les tests de route remplacent le client de stockage, ceux du client remplacent le container. **Le défaut n'a été trouvé qu'en exécutant le code dans le conteneur déployé.** | Deux pistes distinctes. **(a)** Un oracle générique et bon marché : `DefaultAzureCredential()` construit sans `managed_identity_client_id` dans un dépôt dont le déploiement pose une identité assignée par l'utilisateur est un défaut détectable par lecture statique, et la classe est fréquente hors de ce produit. **(b)** Plus général et plus utile : la doctrine exige une **preuve d'oracle exécuté** au bloc 4 d'une restitution, mais rien n'exige que la preuve soit produite **là où le code tourne**. Ici, tous les oracles étaient verts et la fonctionnalité était cassée. Une règle du type « une chaîne d'authentification à un service externe se prouve dans l'environnement cible, pas au banc » fermerait la classe. Règle existante la plus proche : aucune — ce qui, au sens du § « La règle qui aurait évité le retour », désigne un trou du socle. |

**Portée** (R-45, 21/08) : *générique* — le défaut vaut pour tout projet employant la forge ;
*produit+générique* — le produit l'a corrigé chez lui ET la classe vaut ailleurs.

---

## Remarques restées au produit

Ce que le produit a corrigé chez lui et **n'a pas remonté**, chacune avec son verdict de
généralisation. Toutes viennent du même mandat : la chaîne d'images d'annonces était coupée en
huit endroits, et le stockage n'était câblé nulle part.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Ni `AZURE_STORAGE_ACCOUNT` ni `PROJECT_CONFIG` n'étaient posés sur l'API servie : la lecture d'une photo rendait 503, le dépôt 500 | `deployment.yml` les pose, en RÉSOLVANT le compte dans le groupe de ressources au lieu de le nommer | non | Câblage propre à ce produit et à son pipeline. Rien de la classe « une variable d'environnement manque » n'est transposable sans devenir une banalité |
| Trois cibles de stockage contradictoires cohabitaient : un script visait un container qui n'a jamais existé, le code en nommait un autre, l'infrastructure un troisième | Les trois lisent désormais les mêmes variables d'environnement ; les défauts codés ne servent qu'au lancement local | non | Le fond — trois sources de vérité pour un même nom — est un défaut connu et déjà couvert par la doctrine de nommage. Ce qui était propre au produit est le triplet lui-même |
| La route d'ÉCRITURE de photos n'avait pas le garde « stockage indisponible » que la route de LECTURE avait depuis l'audit du 17/08 : elle rendait 500 avec une trace technique | Le garde vit dans un seul module, et les deux routes posent la même question au même endroit | **oui** | La classe est « une correction d'audit appliquée à un seul des appelants d'une même dépendance ». Elle n'est PAS remontée telle quelle : c'est la même racine que RT-45 — une leçon locale sans mécanisme de propagation — et la remonter deux fois diluerait le retour au lieu de le renforcer |
| Une suppression de blob absent levait une exception traduite en 500, rendant 44 annonces définitivement immodifiables | La suppression est idempotente ; un objet déjà absent est une suppression réussie | non | Sémantique propre au stockage objet, déjà admise par la profession |
| Le type MIME était `image/jpeg` en dur alors que le dépôt accepte `.png` | Le type vient du nom et du blob, aux deux bouts | non | Défaut ordinaire de ce module |
| Le nom de fichier arrivait de la requête et devenait une clé de blob par concaténation | Assaini à l'écriture, refusé à la lecture | non | Classe archi-connue (validation d'entrée), couverte par les revues de sécurité |
| Le client de stockage était reconstruit à chaque image servie, avec toute la chaîne d'identité | Construit une fois par processus, paresseusement | non | Optimisation locale |
| Un `<img>` en échec dessinait son icône cassée PAR-DESSUS l'image de remplacement que la feuille de style porte en fond depuis le 18/08 | Un composant retire l'image qui a échoué, ce qui découvre le fond déjà prévu | **oui, mais déjà couvert** | La classe est `surface-implicite-non-livree` de `CLASSES.json` (« une page ou un état de la surface implicite … »). Elle existe, elle est close, et le produit l'a reproduite : à traiter comme récidive si le pilot le souhaite, pas comme classe neuve |
| `adopter.sh` : Git Bash sous Windows réécrivait les identifiants Azure commençant par `/` en chemins Windows, faisant échouer TOUS les imports du script joué à la main | Deux variables d'environnement neutralisent la conversion ; sans effet sur l'agent Linux | non | Spécificité de poste, et le dépôt le documente à l'endroit du défaut |

---

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot. Les deux
artefacts de la factory employés pendant ce mandat sont `gabarits\RESTITUTION.md` et
`gabarits\RETOURS-FORGES.md`, qui sont des **référentiels normatifs** et non des familles de
la bibliothèque de documents — ils n'ont ni en-tête `gabarit` ni `version_du_gabarit` à
reporter. Le retour qui les concerne est RT-43, ci-dessus.

Une précision qui vaut d'être écrite plutôt que tue : le seul reproche que ce mandat pourrait
faire à `gabarits\RESTITUTION.md` est sa **longueur** — 822 lignes, dont l'essentiel est
l'historique daté des versions, la structure normative tenant en une centaine. Ce n'est pas
remonté comme un défaut : le format est daté-éditable par construction (loi n° 4), et
l'historique est ce qui rend chaque règle opposable à son retour fondateur. La lecture a coûté
quatre appels d'outil, une fois.

---

## Confirmations positives

- **La doctrine, une fois lue, s'est appliquée sans interprétation.** Les dix blocs, le
  squelette de décision en bloc de citation, le tableau `Option | Ce qu'elle coûte | Ce qu'elle
  exclut`, les sélecteurs `D-N` et `A-N` et le vocabulaire gelé des acteurs se sont posés
  directement. Aucune règle n'a demandé d'arbitrage. *C'est ce qui rend RT-43 coûteux : le
  texte manquait, il n'était pas difficile.*
- **`CLASSES.json` v1.3.1 a nommé la classe voisine immédiatement** pour RT-43
  (`heritage-avertissement-tardif`), et son champ `voisines` a permis de vérifier en une
  lecture qu'aucune clé ne couvrait RT-44. Un référentiel fermé de 49 clés a été plus rapide
  qu'une recherche libre.
- **`forge\retours\oracle-lot.mjs` était présent et à jour** chez le produit (25/08), et son
  contrôle a été joué avant remise — le paragraphe « AVANT DE REMETTRE » du gabarit a
  fonctionné comme prévu.
- **`az containerapp exec` comme banc de vérité.** Ce n'est pas une règle de la factory, mais
  c'est ce qui a trouvé RT-45 là où 819 tests verts ne pouvaient rien voir. Verser au socle :
  une chaîne d'authentification se prouve dans l'environnement cible.

---

## Ordre recommandé

1. **RT-44** — c'est le seul qui rende les autres invisibles. Tant qu'une session peut
   travailler des heures hors doctrine sans le savoir, chaque correction du pilot est un pari
   sur l'endroit d'où la prochaine session s'ouvrira. Effort : simple × court pour le contrôle
   PD3, qui suffit à rendre le défaut visible.
2. **RT-43** — le remède local est déjà appliqué et versionné ; ce qui reste est le relevé
   d'héritage jouable sans ouverture de session, pour que l'absence cesse d'être silencieuse.
   Effort : simple × court.
3. **RT-45** — la classe est réelle et coûteuse, mais son remède est le plus ouvert des trois
   et il touche au socle des preuves. Effort : moyen × moyen.

---

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les trois retours de ce lot suivent un retour humain. Chacun nomme sa règle dans sa colonne
« Proposition esquissée », et il faut lire les trois réponses comme trois états différents du
socle :

- **RT-43** — la règle EXISTE et n'a pas été jouée : `oracles\hook-ouverture.mjs`
  § « Héritage des produits », qui recopie les artefacts déclarés en copie identique dans
  `gabarits\HERITAGE.json`. Le défaut n'est pas dans la règle, il est dans son déclenchement,
  ce qui renvoie à RT-44.
- **RT-44** — **aucune règle ne le couvre.** Le tableau de portée de `gabarits\RESTITUTION.md`
  nomme trois modes de défaillance et suppose, sans l'écrire, que la session s'ouvre à la
  racine du produit. C'est un domaine sans oracle, au sens du § 4 de quality-oracles : il en
  faut un, et la classe est à créer au référentiel du pilot — jamais dans un sidecar.
- **RT-45** — **aucune règle ne le couvre non plus.** La doctrine exige une preuve d'oracle
  exécuté, sans exiger qu'elle le soit dans l'environnement cible. Tous les oracles étaient
  verts et la fonctionnalité était cassée : c'est la définition d'un trou de socle, pas d'un
  défaut de rédaction.
