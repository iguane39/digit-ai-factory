# Retours forges — quatre fois la même erreur en une session — 20260823c

- **Contexte** : analyse commandée par l'humain après un blocage de 1 h 20 sur la validation
  d'un domaine Railway, dont la cause — un enregistrement TXT que j'avais déclaré inutile —
  a été trouvée par l'utilisateur et non par moi. L'analyse a mis au jour trois autres
  occurrences du même mécanisme dans la même session.
- **Références** : session du 23/08/2026 sur `Produit-02.com`, commits `7444077`,
  `f6fd9bb`, `be9f3f8`. Lots antérieurs du même jour : `20260823a`, `20260823b`.
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

**La cause racine, en une phrase** — *j'ai affirmé une conclusion, le plus souvent un
négatif, à partir d'une source unique dont je n'avais pas établi qu'elle faisait autorité
ni qu'elle était exhaustive.* Les quatre occasions ci-dessous ont quatre causes immédiates
différentes et une seule cause profonde. La quatrième est la plus grave : elle applique le
défaut à ma propre méthode de vérification.

---

## Les quatre occurrences, et ce qui les relie

Ce chapitre établit le motif avant de proposer quoi que ce soit : sans les quatre cas
posés côte à côte, la généralisation ne serait qu'une intuition. Les causes immédiates
diffèrent — méthode HTTP, champ d'API, commentaire de code, outillage de test — ce qui
explique qu'aucune n'ait alerté sur la précédente.

| # | Source consultée | Ce que j'ai affirmé | La réalité | Coût |
|---|---|---|---|---|
| 1 | `curl -I` (HEAD) sur l'URL OVH de création de jeton | « la page est morte, 404 » | `GET` répondait **200** — OVH renvoie 404 sur HEAD pour ses pages applicatives | une fausse affirmation, corrigée dans le même échange |
| 2 | champ `dnsRecords` de l'API GraphQL Railway | « aucun TXT n'est requis, Railway valide sans passer par le DNS » | deux enregistrements exigés ; le second vivait dans `verificationDnsHost` / `verificationToken`, **mêmes types GraphQL**, non énumérés | 1 h 20 de blocage, un retrait/réajout qui a fait tourner la cible CNAME, une écriture DNS de rattrapage |
| 3 | commentaire de `build/data.mjs` : « Identifiants de suivi repris de l'ancien site » | « `GTM-MW8X3G8X` et `G-TM75JS7QHJ` appartiennent au `.fr` » | l'API GA4 Admin dit l'inverse : compte « APB.com », flux créé le 15/08 à 12:12, `updateTime == createTime`, `defaultUri = https://www.Produit-02.com` | **une décision humaine prise sur une prémisse fausse que j'avais fournie**, puis une régression, puis un correctif |
| 4 | mes quatre contrôleurs locaux | « tout passe, le commit est bon » | la CI exécute **deux autres** contrôles ; recouvrement **nul** ; 12 échecs | CI rouge sur `main`, bascule de domaine bloquée plusieurs heures |

Deux circonstances aggravantes méritent d'être écrites. Pour [2], **j'avais déjà utilisé
l'introspection GraphQL plus tôt dans la même session** pour corriger des erreurs de nom de
champ : l'outil était connu, disponible, employé — ce n'est pas une lacune de connaissance
mais un déclencheur manquant. Pour [3], la source trompeuse était **le code du projet
lui-même**, ce qui interdit de réduire le problème aux API de tiers.

### Les signaux disponibles et non lus

Chacune des trois premières occurrences portait un signal qui aurait suffi à faire douter,
et qui a servi *a posteriori* pour établir la vérité — donc qui était lisible avant.

- **[2]** — `verified: false` sur `CustomDomainStatus`. Un domaine dont le seul
  enregistrement exigé est marqué `PROPAGATED` mais qui reste `verified: false` est un
  aveu que quelque chose d'autre manque.
- **[3]** — `createTime == updateTime` sur le flux GA4, plus le `defaultUri` pointant sur
  le `.com`, plus le conteneur GTM **nommé** `www.Produit-02.com`. Trois indices
  concordants, tous à un appel d'API.
- **[1]** — le code 404 sur une page réputée existante, alors qu'une sonde différente
  n'avait pas été essayée.

## Ce que la Factory doit porter

Trois familles de sources sont en cause, et non une seule : les sources **externes** (API
et interfaces de tiers qui divergent entre elles), les sources **internes** au dépôt
(commentaires et documentation, ni datés ni sourcés, jamais invalidés) et l'**outillage de
vérification** lui-même. Chaque famille appelle un artefact distinct.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-9 | majeur | **Un commentaire de code a fait autorité contre une API.** `build/data.mjs` affirmait que les identifiants de suivi venaient de l'ancien site. Ni date, ni source, ni moyen de rejouer la vérification — et pourtant traité comme un fait, au point de fonder une décision humaine. La réfutation a demandé un appel d'API de trente secondes. Le même dépôt contient d'autres constantes de configuration dans le même état : `SITE_URL`, `BEDS24_BASE`, les `propid`, `BEDS24_LANGS`. | Règle de socle (numérotation libre après **R-46**) : toute constante de configuration désignant une ressource externe porte un en-tête à trois champs — **date de vérification**, **source faisant autorité**, **commande pour la rejouer**. Un commentaire sans ces trois champs est une hypothèse, et se lit comme telle. Oracle associé : contrôle statique qui échoue si une constante exportée d'un fichier de configuration porte un commentaire sans date au format `AAAA-MM-JJ` ou `JJ/MM/AAAA`. Fixture rouge : un `data.mjs` dont une constante porte un commentaire non daté. |
| RT-10 | majeur | **Rien ne joue l'ensemble des contrôles.** Mesuré sur ce dépôt : la CI exécute `build/ci/verif-pages.py` et `build/ci/oracle-consent.mjs` ; j'exécutais en local `check-seo`, `check-i18n`, `check-links`, `check-redirects`. **Six contrôles, deux ensembles, recouvrement nul** — `verif-pages.py` est autonome et n'appelle aucun `check-*`. Valider en local ne dit donc rien de la CI, et réciproquement. C'est ce qui a laissé passer une régression jusqu'à `main` et bloqué le déploiement. | Ne pas documenter la liste — la **dériver**. Une cible unique (`npm run verifier`, `make verifier`) qui lit le workflow GitHub et rejoue ses étapes, plus les contrôles locaux. Toute divergence entre l'habitude locale et le workflow devient impossible par construction. Oracle associé : échec si une commande `run:` du workflow n'est atteignable par aucune cible locale. Fixture rouge : un workflow auquel on ajoute une étape non câblée. Bénéfice second : le coût d'exécution devient visible, donc arbitrable. |
| RT-11 | majeur | **Deux négatifs affirmés depuis une sonde unique.** [1] et [2] partagent la forme exacte : une seule sonde, une réponse partielle ou trompeuse, une conclusion négative annoncée à l'humain sans réserve. Aucune des deux réponses ne portait de marqueur d'exhaustivité — `dnsRecords` ne dit pas qu'il est complet, un 404 ne dit pas quelle méthode HTTP l'a produit. | Règle comportementale opposable : **un négatif sur une ressource externe ne se prononce jamais depuis une source unique.** Trois obligations avant d'annoncer une absence — énumérer le schéma quand il est introspectable (GraphQL, OpenAPI), essayer une seconde sonde de nature différente (autre méthode HTTP, autre point d'entrée, autre résolveur), et formuler le résultat comme *« cette source me montre X »* plutôt que *« il n'y a pas de X »*. Cette règle relève de la Factory car elle vaut pour toute session, pas seulement ce projet. |
| RT-12 | mineur | **Aucun contrat d'intégration n'est déclaré nulle part.** Ce projet dépend de onze sources externes. Pour aucune, le dépôt ne dit où est la source faisant autorité, ni quelle sonde donne une réponse exhaustive. Chaque session redécouvre — et se trompe, comme ici deux fois. | Un fichier `docs\projet\INTEGRATIONS.md` (socle R-20) listant par service : source faisant autorité, sonde exhaustive, écart connu entre API et interface, et date de dernière vérification. Le tableau du chapitre suivant en est le premier contenu. |

## Les onze sources de ce projet, passées en revue

Ce chapitre applique le niveau 3 : plutôt que d'énoncer un principe, il nomme chaque
intégration réellement en jeu et dit où le piège s'y trouve. Un verdict « aucun risque
comparable » est un traitement, pas un silence.

| Source | API et interface concordent ? | Risque de blocage silencieux | Sonde exhaustive |
|---|---|---|---|
| **Railway** | **Non — écart mesuré.** `dnsRecords` omet le TXT que la console exige | **Élevé** — c'est l'occurrence [2] | introspection GraphQL du type, puis lecture de `verified` |
| **OVH** | Oui pour la zone DNS ; les **pages web** renvoient 404 sur HEAD | Moyen — trompe sur la disponibilité, pas sur les données | `GET`, jamais `HEAD`, sur les pages ; `/auth/currentCredential` pour la portée réelle d'un jeton |
| **GA4 Admin API** | Oui — c'est elle qui a réfuté [3] | Faible | `dataStreams` par propriété ; `createTime` vs `updateTime` comme témoin |
| **Tag Manager API** | Oui | Faible | `containers` par compte ; `publicId` fait foi, pas le nom |
| **Search Console** | **Non vérifié** — jamais appelée dans cette session | Inconnu, à établir avant usage | à déterminer |
| **Google Cloud / gcloud** | **Non.** `gcloud` est ici un **`.ps1`** : PowerShell recolle une valeur non quotée avec des espaces au lieu des virgules, produisant un message d'erreur qui accuse à tort le scope manquant. Et Google **bloque** le client OAuth intégré sur les portées Analytics | Élevé — deux blocages successifs le 23/08 | toujours quoter les valeurs à virgules ; passer par un **compte de service**, pas par `application-default login` |
| **Beds24** | **Non documenté.** Paramètres découverts empiriquement : `checkin`/`checkout` acceptés, `numadult` plafonné en silence à la capacité, langues rabattues sur le français sans le dire | **Élevé** — le rabat silencieux est le pire cas rencontré | comparer les corps de réponse **octet à octet** entre variantes ; ne jamais croire un paramètre accepté sans mesurer son effet |
| **GitHub Actions** | Sans objet, mais **écart local/CI total** | Élevé — c'est l'occurrence [4] | dériver la liste depuis le fichier de workflow |
| **Cloudflare** (zone du `.fr`) | Non vérifié — hors de notre contrôle | Faible tant que le `.fr` n'est pas basculé | à établir au moment de la bascule |
| **Microsoft 365** (mail du `.fr`) | Non vérifié | Faible — aucune opération prévue | à établir si un jour on y touche |
| **Le dépôt lui-même** | **Non — c'est l'occurrence [3]** | **Élevé**, et le plus insidieux : un commentaire ne se périme jamais tout seul | l'API de la ressource décrite, jamais le commentaire |

Le classement qui compte : **Railway, Beds24, GitHub Actions, gcloud et le dépôt lui-même**
peuvent produire un blocage ou une décision fausse **sans rien signaler**. Les autres
échoueraient bruyamment, donc sans danger.

## Ce que je ne propose pas, et pourquoi

Trois correctifs apparemment évidents sont écartés, et il vaut mieux le dire que les
laisser suggérer par omission.

- **« Lire la documentation »** — la documentation Railway ne mentionne pas
  `verificationToken`. C'est l'introspection du schéma qui l'a révélé, pas la doc.
- **« Vérifier dans la console web »** — une console n'est pas accessible en session non
  interactive. Un correctif qui suppose un humain devant un navigateur ne corrige rien.
- **« Être plus prudent »** — une exhortation n'est pas un artefact. Les quatre occurrences
  se sont produites alors que j'avais l'intention d'être rigoureux.

## Remarques restées au produit

> Section ajoutée le **2026-08-26**, après l'arrivée du gabarit `RETOURS-FORGES.md`
> (`TF-0626`) : ce lot avait été rédigé sans lui et ne portait donc ni R-45 ni R-46.
> L'ajout est **purement additif** — aucun retour, aucun chiffre, aucune formulation
> d'origine n'a été touché. Le contenu ci-dessous est reconstitué depuis les commits
> de la fenêtre du lot.

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Corrigé chez le produit | Verdict de généralisation |
|---|---|
| Rétablissement des identifiants de mesure GA4 et GTM, supprimés à tort sur la foi d'un commentaire de code. | **Généralisable → REMONTÉ en RT-9** : un commentaire de code a fait autorité contre une API. |
| Bascule du site sur `www.Produit-02.com`, favicon et icône iOS. | **Rien de généralisable** — travaux de produit. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit.** Aucun des gabarits de `gabarits\documents\`
n'a servi sur ce projet : aucun document du dépôt ne porte d'identifiant `gd-…`. La section
est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46, qui vise les livrables issus de
`gabarits\documents\`, et est consignée faute de canal plus juste : **ce lot lui-même a été
produit sans son gabarit de méthode**, `RETOURS-FORGES.md` étant absent du dépôt jusqu'à
`TF-0626` du 26/08/2026. C'est la cause directe de l'ajout rétroactif signalé ci-dessus.

## Confirmations positives

- **L'oracle de consentement a fait exactement son travail.** Il a refusé une modification
  que je croyais défendable — conditionner la bannière à la présence d'un identifiant — et
  il avait raison : la bannière et sa mémoire de choix sont un contrat vérifié dans sept
  langues, qu'un état transitoire ne doit pas pouvoir éteindre. Un oracle qui contredit son
  auteur est un oracle qui sert.
- **Le contrôle de préservation a tenu sur les quatre zones DNS.** Le script d'écriture
  vérifiait après chaque zone qu'aucun enregistrement à préserver n'avait disparu :
  0 perdu sur 4 zones, `MX`, `SPF`, `DKIM` et `SRV` intacts. La messagerie n'a jamais été
  menacée, et c'est le contrôle qui le prouve, pas la prudence de l'auteur.
- **L'humain a trouvé en une capture d'écran ce que quatre appels d'API m'avaient caché.**
  C'est l'argument le plus fort en faveur de RT-11 : la seconde source n'est pas un luxe.

## Ordre recommandé

1. **RT-10** — meilleur rapport gain/effort et le seul dont l'absence a déjà bloqué `main`.
   Une cible dérivée du workflow supprime toute une classe d'erreurs par construction.
2. **RT-11** — la règle qui couvre [1] et [2], donc la moitié des occurrences, et qui vaut
   pour toutes les sessions de toutes les forges.
3. **RT-9** — l'en-tête daté sur les constantes ; c'est celui qui a coûté le plus cher
   puisqu'il a fait décider un humain sur une prémisse fausse.
4. **RT-12** — le contrat d'intégration ; il capitalise ce que cette session a découvert
   au lieu de le laisser se reperdre.
