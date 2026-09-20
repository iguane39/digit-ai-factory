# Retours forges — Produit-11 — 20260914b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : suite directe du lot `20260914a`. Celui-ci portait ce que la **refonte** de
  `COMPOSANTS-OPS.md` avait révélé ; ce lot-ci porte ce que le **nettoyage** a révélé, c'est-à-dire
  le passage à l'acte sur les dix composants que ce document déclarait inutilisés. Mandat humain :
  « Si les composants inutilisés du chapitre 8 sont confirmés comme inutiles, supprime les », puis
  « remonte à la Factory ces problèmes pour s'assurer qu'ils ne seront pas reproduits sur un autre
  projet futur ».
- **Références ledger** : `forge\ledger.jsonl` seq 180 (entrée `type: retour`), sur le run de
  nettoyage consigné en seq 179
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le sas d'arrivée du pilot
  `digit-ai-factory\input\00-retours\_arrivee\` — l'original reste ici (historique du produit).
- **Statut** : **remis le 2026-09-14** — les deux fichiers déposés dans le sas d'arrivée du pilot
  `digit-ai-factory\input\00-retours\_arrivee\`, ignoré par git (protocole TF-0981 du 08/09).
  Empreintes SHA-256 au moment du dépôt, vérifiées identiques entre l'original et la copie ;
  elles figurent à l'entrée `seq 181` du ledger. L'ingestion appartient au pilot
  (`accueillir-lot.mjs` puis `ingerer-lot.mjs`), pas à ce produit.

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "forge\retours\Produit-11 - RETOURS - 20260914b.md"
> ```

**Numérotation** : BAV2 tient une séquence `RT-nn`. RT-1 … RT-67 sont consommés au 14/09. Ce lot
continue en **RT-68 … RT-71**.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou
*produit+générique*.

---

## Le fait mesuré, avant toute interprétation

Dix composants étaient déclarés inutilisés par un document d'ouvrage exécuté relu la veille, chacun
avec sa preuve d'absence de consommateur et son geste de suppression. À l'exécution, **cinq n'étaient
pas supprimables, et une ne l'était qu'à moitié**.

Le plus grave n'est pas le taux. C'est que **le geste prescrit pour l'un d'eux aurait coupé un
environnement entier.** Le document prescrivait, pour refermer une règle de pare-feu ouverte à
`0.0.0.0` sur la base de qualification : mesurer l'adresse de sortie de l'application, l'inscrire
au pare-feu, supprimer la règle ouverte. Cette prescription était la transposition d'un correctif
réussi sur l'environnement de développement le 25/08, et elle était plausible.

La mesure sur la cible l'a démentie en une commande :

| Environnement | `properties.outboundIpAddresses` |
|---|---|
| `cae-bav-dev` | **1** adresse |
| `cae-bav-hpr` | **161** adresses |

Une règle nommée sur l'adresse observée n'en couvre qu'une sur 161. L'API aurait perdu sa base au
premier réplica sortant par une autre. Le geste a été joué puis défait, l'état du serveur restauré
à l'identique, et la connexion à la base vérifiée avant et après sur la même mesure de 1 267
annonces. **Rien, dans le document ni dans aucune règle du socle, ne distinguait ce geste déduit
d'un geste éprouvé.**

Deux autres composants étaient faussement inutiles. Une règle de pare-feu classée « nominative,
hors description » portait l'adresse **vivante du poste de travail**, mesurée le jour même : la
retirer coupait l'accès humain à la base. Deux connexions de service sans pipeline consommateur
sont les **seules identités fédérées** capables d'appliquer la pile d'infrastructure de la
plateforme partagée dont ce produit dépend.

---

## pilot (`digit-ai-factory`) et digit-ai-forge-ops

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-68 | **bloquant** | générique | Un geste de remédiation **transposé sans mesure de faisabilité sur la cible** est écrit avec l'autorité d'un correctif éprouvé, et il peut couper l'environnement qu'il prétend protéger. Mesure : le correctif « retirer la règle `AllowAllAzureServicesAndResources`, autoriser la seule adresse de sortie » a été appliqué avec succès sur `psql-bav-dev-l7762t` le 25/08/2026, et `MATRICE-DE-FLUX.md` se déclare depuis « appliqué ». Écrit ensuite comme geste à jouer sur `psql-bav-hpr-q7k2x9`, il était **infaisable** : `az containerapp show --query properties.outboundIpAddresses` rend **161 adresses** pour `cae-bav-hpr` contre **une seule** pour `cae-bav-dev`, les deux environnements étant pourtant de même type et de même région. Le pool de sortie d'un environnement Container Apps hors réseau virtuel n'est ni unitaire ni stable, et rien ne le dit avant la mesure. Le geste a été joué puis défait ; sans la vérification de non-régression posée par prudence, la base de qualification aurait été perdue par l'application, l'incident se manifestant à la révision suivante et non au moment du geste. | **Marquer la maturité de tout geste prescrit sur une infrastructure**, comme les exigences marquent `[FAIT]` et `[HYP]` : *éprouvé sur cette cible le <date>*, ou *déduit d'une autre cible — à mesurer avant exécution*, avec la commande de mesure qui tranche. Contrôle possible sans exécution : dans un document d'exploitation ou un carnet d'écarts, tout bloc impératif portant un verbe destructif (`supprimer`, `retirer`, `fermer`, `purger`, `détruire`) doit porter l'une des deux marques, sinon FAIL. *Un geste jamais joué sur sa cible n'est pas une procédure, c'est une hypothèse rédigée à l'impératif.* Classe propre proposée : `geste-prescrit-transpose-sans-mesure-de-sa-cible`. |
| RT-69 | majeur | générique | **« Sans consommateur » n'est pas « supprimable »** : un inventaire qui confond les deux fabrique des suppressions dangereuses. Mesure : sur dix lignes déclarées inutilisées avec preuve d'absence de consommateur, **cinq n'étaient pas supprimables et une ne l'était qu'à moitié**, pour des motifs qu'aucune recherche de consommateur ne pouvait produire. La règle de pare-feu `poste-spesmecansar` n'avait aucun consommateur déclaré : son adresse `[adresse IP du poste, masquée le 15/09/2026]` est celle **du poste en service**, mesurée le jour même, et la retirer coupait l'accès humain à la base. Les connexions de service `azrm-bav-dev-wif` et `azrm-bav-hpr-wif` n'étaient nommées par aucun pipeline depuis la suppression des définitions 188 et 197 : ce sont les seules identités capables d'appliquer la pile Terraform qui **possède** l'environnement d'exécution, le coffre et la base du produit. Deux inscriptions Entra inertes sont gouvernées par Terraform : les supprimer à la main aurait produit une divergence annulée au déploiement suivant. Ma propre proposition RT-65 du lot `20260914a` est donc **incomplète** : une colonne « preuve d'inutilité » ne suffit pas à décider. | Deux colonnes, pas une, et la seconde est celle qui protège : **« ce qui cesse de fonctionner si on le supprime »**, renseignée par une mesure et non par une intuition, plus un **statut de supprimabilité** à vocabulaire fermé — `supprimable` · `non supprimable, droit absent` · `non supprimable, décision` · `non supprimable, tiers propriétaire`. La règle : *l'absence de consommateur ouvre une question, elle ne rend pas un verdict.* Elle vaut pour tout inventaire qui sert à décider d'un retrait — composants, dépendances, tables, permissions, fichiers morts. Classe retenue : `controle-vrai-sur-le-mauvais-invariant` — l'inventaire mesure une grandeur corrélée, « a-t-il un consommateur », au lieu de l'invariant qu'il prétend protéger, « peut-il partir sans rien casser ». |
| RT-70 | majeur | générique | Un geste destructif prescrit **sans sa mesure de non-régression** ne laisse aucun moyen de savoir qu'il a cassé quelque chose, et les dégâts se révèlent à retardement. Mesure : les dix lignes portaient chacune un geste de suppression et son titulaire ; aucune ne portait la vérification qui prouve que la suppression **n'a rien rompu**. La vérification a été posée par prudence, et elle a servi trois fois : connexion base après retrait d'une règle de pare-feu en développement, base `bav2` et 1 284 annonces ; connexion base avant et après l'essai en qualification, 1 267 annonces les deux fois ; inventaire du registre d'images après suppression de trois dépôts, le registre jumeau restant intact. Le risque propre aux suppressions d'infrastructure est le **décalage** : un pare-feu refermé ne casse rien tant qu'aucune connexion neuve ne s'ouvre, une image supprimée ne casse rien tant qu'aucun réplica ne redémarre. Le geste paraît réussi, et l'incident arrive à la révision suivante, sans lien visible avec lui. | Tout geste destructif écrit dans un livrable **porte sa mesure de non-régression**, exécutable, à jouer immédiatement après. Et pour les ressources à effet différé, cette mesure doit **forcer** l'événement plutôt que l'attendre : redémarrer un réplica, ouvrir une connexion neuve, relancer la tâche. C'est le prolongement direct de RT-64 du lot `20260911c` — « un archivage qui ne peut pas échouer n'archive rien » — appliqué aux gestes destructifs : *une suppression dont rien ne peut révéler l'échec est une suppression qu'on croit réussie.* Classe retenue : `controle-sans-fixture-double-sens`. |
| RT-71 | majeur | générique | La Factory livre un carnet d'écarts, le produit en tient un second ailleurs, et **celui de la Factory reste au gabarit brut** sans qu'aucun oracle ne le voie. Mesure du 14/09/2026 : `forge/travaux/ECARTS-ASSUMES.md`, reçu par héritage, porte encore `<produit>` dans son titre, `verifie_le: 2026-08-26` (la date du gabarit) et **zéro écart**, dix-neuf jours après sa réception. Pendant ce temps `docs/projet/CARNET-ECARTS.md`, créé à la main le 01/09 au titre d'une règle du référentiel d'audit client, porte **onze écarts** dont celui ouvert aujourd'hui. **Aucun des deux fichiers ne renvoie à l'autre**, et `oracle-conformite-projet` rend **zéro finding** sur l'ensemble : sa règle R-20 ter, « une fiche qui porte encore ses marqueurs de gabarit n'est pas une fiche », est **bornée au dossier `docs\projet\`** alors que le défaut qu'elle traite ne connaît aucune frontière de dossier. Conséquence directe : une session qui lirait le carnet prescrit par la Factory conclurait « aucun écart assumé » — réponse **fausse et plausible**, exactement le motif qui a fait naître la section « environnements de données » (TF-0594). | Deux corrections indépendantes. (1) **Étendre R-20 ter à tout fichier issu d'un gabarit**, quel que soit son dossier : la liste des fichiers hérités est connue de `gabarits\HERITAGE.json`, le contrôle existe déjà et il lui manque seulement son périmètre. Un marqueur non instancié y est un FAIL, et une date de vérification restée égale à celle du gabarit un avertissement. (2) **Trancher la cohabitation** : soit le carnet de la Factory absorbe les écarts de conformité et le gabarit le dit, soit il déclare explicitement sa frontière et **exige un renvoi** vers l'autre carnet. Un produit qui reçoit deux contenants pour une même notion en remplit un et abandonne l'autre ; le seul résultat garanti est que l'un des deux ment. Classe retenue : `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas`. |

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le paragraphe 8 de `COMPOSANTS-OPS.md` annonçait « cinq supprimées, cinq conservées » alors que sa seconde table en portait six, une ligne ayant été scindée à l'exécution | décompte réécrit en « quatre intégralement, une pour moitié, cinq conservées », vérifié contre les deux tables | non | Effectif annoncé contredit par son ancre : la classe est déjà couverte par le volet N1 d'`oracle-calculs`, qui ne l'a pas vu ici parce que l'annonce et la table sont séparées par un intertitre. Le cas est trop étroit pour une règle neuve, et le retour serait un doublon de l'existant. |
| Deux documents avaient été datés du jour alors que seule une partie de leur contenu avait été revérifiée | dates de vérification restaurées à leur valeur d'origine, et le motif écrit au ledger | **oui, et c'est déjà écrit** | « Une déclaration éprouvée n'est pas une déclaration plausible » est la doctrine même du champ `verifie_le`, énoncée dans le gabarit `COMPOSANTS-OPS.md`. Rien à ajouter : la règle existe et elle a joué, par relecture. Ce qui manque est un contrôle, et c'est RT-66 du lot précédent. |
| `TECHNOS.md` déclare treize versions de dépendances périmées face à `azure/backend-requirements.txt` — Flask 3.0.3 déclaré contre 3.1.3 épinglé, gunicorn 23.0.0 contre 26.0.0 | signalé au porteur, **non corrigé** : hors du périmètre du mandat, et la correction exige de revérifier aussi le front | non | La règle R-21 du pilot couvre exactement ce cas — « fraîcheur TECHNOS contre lockfiles » — et elle est écrite. Le produit est en dette, la Factory n'est pas en cause. |
| Le dépôt portait deux Dockerfiles hérités qu'aucune chaîne ne bâtissait, et un script de création de secrets qu'aucun appelant ne nommait | retirés par `git rm`, contenu conservé dans l'historique, et la référence morte de `TECHNOS.md` corrigée | non | Code mort propre à ce produit. La classe générique — « un inventaire doit dire l'usage » — est déjà remontée en RT-65. |

## Retours sur les documents produits

Trois documents ont été produits ou modifiés sur ce lot. Le couple `gabarit` + `version_du_gabarit`
n'est reportable pour aucun : **les gabarits de `gabarits\docs-projet\` ne portent pas de numéro de
version dans leur en-tête**, déjà signalé au lot `20260914a` et confirmé ici sur un second passage.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `docs/projet/COMPOSANTS-OPS.md` | `gabarits/docs-projet/COMPOSANTS-OPS.md` · sans version | la distinction entre un composant sans consommateur et un composant supprimable ; la conséquence d'une suppression ; la maturité du geste prescrit | le porteur a demandé la suppression sur la foi du document, et le document se trompait sur un point qui aurait coupé un environnement | statut de supprimabilité, colonne « ce qui cesse de fonctionner », journal daté des gestes joués et défaits | générique — RT-68 et RT-69 |
| `docs/projet/CARNET-ECARTS.md` | **aucun gabarit** : créé à la main le 01/09 au titre d'une règle du référentiel d'audit client, alors que `gabarits/ECARTS-ASSUMES.md` existe et vise `forge/travaux/` | une règle disant lequel des deux carnets reçoit quoi, et un renvoi de l'un vers l'autre | — (défaut trouvé par mesure, pas par un lecteur) | l'écart E-11 a été écrit dans le carnet le plus vivant, par choix non arbitré | générique — RT-71 |
| `docs/projet/TECHNOS.md` | `gabarits/docs-projet/TECHNOS.md` · sans version | rien pour ce lot : seule une référence à un fichier supprimé a été corrigée | — | — | — |

## Confirmations positives

- **La vérification de non-régression a payé au premier usage.** Posée par prudence et non par
  prescription, c'est elle qui a établi que l'état du serveur de qualification était bien restauré
  après l'essai, sur la même mesure de 1 267 annonces avant et après. Sans elle, le retour arrière
  aurait été déclaré sur la seule foi des commandes jouées.
- La frontière « un nom en `-bav-` sans 2 n'est pas un vestige » **a tenu une seconde fois**, sous
  pression de suppression cette fois. Aucun composant partagé n'a été touché, et le registre
  d'images de la qualification, qui porte les mêmes noms que celui nettoyé, est resté intact.
- Le contrôle de complétude écrit au lot précédent **a été rejoué après les suppressions** et rend
  toujours 56 ressources sur 56 citées, zéro absente. Un contrôle écrit pour une refonte a servi
  une seconde fois pour un nettoyage, sans modification.

## Ordre recommandé

1. **RT-68 d'abord**, et de loin. C'est le seul du lot dont la conséquence est une coupure de
   service, et sa correction ne coûte qu'une marque dans un gabarit plus un contrôle textuel sur
   les verbes destructifs. Tant qu'un geste déduit est indiscernable d'un geste éprouvé, chaque
   document d'exploitation de l'écosystème porte des pièges de ce type sans que personne le sache.
2. **RT-69 ensuite**, parce qu'il complète RT-65 du lot précédent et qu'il vaut mieux les ingérer
   ensemble : la section « inutilisés » proposée là-bas serait livrée incomplète sans les deux
   colonnes demandées ici.
3. **RT-71**, dont la première moitié est presque gratuite : R-20 ter existe, il lui manque son
   périmètre. La seconde moitié demande un arbitrage sur la cohabitation des deux carnets.
4. **RT-70** enfin, le plus large à mettre en œuvre puisqu'il touche la rédaction de tout geste
   destructif, mais celui dont la règle est la plus simple à énoncer.

## La règle qui aurait évité le retour (TF-0779)

**Pour RT-68**, aucune règle du socle ne distingue un geste éprouvé d'un geste déduit. La doctrine
existe pourtant tout près, dans le marquage `[FAIT]` / `[HYP]` des exigences et dans le champ
`verifie_le` des fiches de `docs\projet\` : *une déclaration éprouvée n'est pas une déclaration
plausible.* Elle n'a simplement jamais été étendue aux **gestes**. C'est le cas de figure § 4 de
`quality-oracles` : la doctrine est connue, elle n'est jugée par personne sur ce type de contenu.

**Pour RT-69**, la règle manquante est celle que mon propre lot de la veille proposait, et qu'il
proposait incomplète. La leçon n'est pas dans la colonne oubliée mais dans la méthode : une
proposition de règle écrite depuis un inventaire n'a pas été éprouvée par l'acte qu'elle prétend
outiller. Un retour qui propose une règle gagnerait à déclarer si elle a été jouée.

**Pour RT-70**, la règle la plus proche est `controle-sans-fixture-double-sens` — un contrôle qui
n'a jamais été vu rouge n'est pas un contrôle. La variante ici est un geste dont l'échec ne peut
apparaître qu'après coup, à la révision suivante.

**Pour RT-71**, la règle existe et elle est juste : R-20 ter, « une fiche qui porte encore ses
marqueurs n'est pas une fiche ». Elle ne s'applique qu'à un dossier. Une règle bornée à un chemin
alors que son défaut ne l'est pas laisse exactement autant de trous qu'il y a d'autres chemins.
