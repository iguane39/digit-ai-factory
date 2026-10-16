# Retours forges — Produit-11 — 20260818a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : demande humaine du 18/08 — « étudie les anomalies du board Azure DevOps
  `Client-A-DevOps / APP-IA / APP-IA Team / Stories` et dis lesquelles subsistent ». Treize
  anomalies ouvertes les 29 et 30/07, jamais triées depuis. Vérification faite sur le code
  ET sur l'instance `dev` servie (sondes en lecture seule) : **4 corrigées, 1 partielle,
  8 toujours servies**. Le lot ci-dessous ne remonte pas les anomalies — elles appartiennent
  au produit — mais les **quatre classes d'angle mort** que leur relecture a rendues visibles
  dans l'outillage, et une au pilot.
- **Références ledger** : `forge\ledger.jsonl` seq 132
- **Lot précédent** : `Produit-11 - RETOURS - 20260817b.md`, remis et donc immuable.
  D'où ce lot neuf.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-18

**Numérotation** : Produit-11 tient une séquence `RT-nn` ; RT-1 … RT-23 sont consommés. Ce lot
continue en RT-24 … RT-28.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Vérification préalable, faite avant rédaction** (doctrine du lot 20260817b : un retour qui
réclame l'existant se fait renvoyer). Recherche dans `digit-ai-forge-tests` hors `.venv/` :
aucun mécanisme de relecture-après-écriture ; aucun contrôle de domaine sur une valeur de
données (les occurrences de « plausible » relèvent de la pureté de fonction et de la revue) ;
aucune lecture des `url()` d'une feuille servie. En revanche `ecart_servi_versionne`
(TF-0288) existe et fait EXACTEMENT le bon geste sur un autre terme — RT-26 en demande la
généralisation, pas l'invention. Et `livrables/exigences.py` calcule déjà la réciproque
« ce que AUCUN cas ne touche » — RT-27 demande de la réemployer sur un second référentiel,
pas d'en écrire une seconde.

---

## forge-tests (`digit-ai-forge-tests`)

Quatre retours, une même racine : **la forge mesure le produit contre lui-même.** Elle le dit
d'ailleurs, à l'endroit exact où cela se décide — `invariants.py` : « on extrait l'invariant
TEL QU'IMPLÉMENTÉ, pas tel que voulu. Si la garde est fausse, le cas généré confirmera le bug
au lieu de le révéler. » Cette limite est déclarée, et c'est à son honneur. Les quatre
retours ci-dessous nomment quatre endroits où un terme de comparaison EXTERNE, bon marché,
était disponible et n'a pas été réclamé.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-24 | majeur | **Rien ne vérifie que ce que le produit accepte d'écrire est ce qu'il relit.** Deux défauts de Produit-11 partagent cette signature exacte, tous deux **dans le périmètre couvert** (parcours 6 « alertes », 69 tests verts, mutation 0,90) et tous deux invisibles. (1) `alerts.created_at` porte `default=datetime.now(timezone.utc)` — l'appel est évalué UNE fois au chargement du module : toute alerte est datée de l'instant de démarrage du conteneur. Le rapport terrain (board APP-IA #9870, ouvert le 30/07) mesure l'écart : « alerte créée le 29/07, enregistrée au 24/07 », soit cinq jours, exactement l'âge du processus. Le même défaut est sur `push_subscriptions.created_at`. (2) `POST /alerts` écrase `email_notifications` à `False` en dur (`07_alerts.py:206`) alors que l'écran envoie le choix de l'utilisateur (`CreateAlertModal:155`) : la case cochée disparaît sans un mot. Le parcours 6 relit les **critères** de l'alerte, jamais ses scalaires — et une valeur figée reste **cohérente avec elle-même** tant qu'on n'observe qu'une occurrence. Sur le poste local, le processus vient de naître : l'écart serait de quelques secondes, invisible même en regardant. | Un axe de cas dérivé **aller-retour**, dérivable sans spécification puisque la surface est déjà inventoriée : pour chaque route d'écriture, un cas « ce que je viens d'écrire, je le relis **champ par champ** » — et pour un champ temporel, la comparaison se fait **à l'horloge**, jamais à lui-même. C'est le seul oracle qui attrape la classe « le produit répond 200 et range autre chose », que ni la couverture, ni la mutation, ni un parcours ne peuvent voir : le parcours passe, parce que le produit fait ce que le parcours regarde. |
| RT-25 | majeur | **Les contrôles de données cherchent le vide, jamais le faux.** Le second étage (§12.4) a établi É-2 — 5 annonces sans commune — en testant `city-insee-code === null`. Or **11 annonces sur 1 249** portent `latitude=0, longitude=0`, soit le point (0,0) du golfe de Guinée, **au large de l'Afrique** : c'est le board APP-IA #9873 (priorité 1, ouvert le 30/07, « des annonces sont localisées dans la mer bordant l'Afrique »), et j'ai relu les 11 lignes en direct aujourd'hui, adresses françaises réelles à l'appui (`#4860 501 BD DE WESTPHALIE, Barentin 76360`, `#5370 2 RUE JACQUELINE AURIOL, Fléville-devant-Nancy`…). Elles passent **les cinq invariants du parc** : clé métier présente, unique, à la bonne forme, code INSEE à cinq caractères, coordonnées **présentes**. Le repli `COALESCE(ads.latitude, ST_Y(cities.centroid))` ne joue pas non plus : `0` n'est pas `NULL`. La mesure a donc trouvé le voisin immédiat — le champ vide — et manqué le champ faux, qui est le cas rapporté par l'utilisateur. | Un second contrôle par champ inventorié, jumeau du premier : **« présent »** puis **« plausible »**. Le domaine n'est pas à deviner dans la plupart des cas — il est déjà déclaré dans le schéma que la forge lit (`marshmallow validate.Range` / `OneOf`, ici `AdvertSchema`), et pour les grandeurs qui n'en portent pas, un domaine déclaré par le projet vaut mieux que rien. Trois issues comme ailleurs : conforme · hors domaine, **avec les lignes nommées** · domaine non déclarable, en le disant. Une coordonnée à `0,0` est le cas d'école : c'est la valeur par défaut d'un entier, elle est toujours « présente », et elle est toujours fausse. |
| RT-26 | **bloquant** | **Rien ne confronte ce que le code APPELLE à ce que l'instance SERT — ni pour les routes, ni pour les ressources.** Deux défauts de Produit-11, mesurés en direct aujourd'hui, qu'aucun parcours ne pouvait voir. (1) Le blueprint `08_push_subscriptions.py` n'est pas dans `endpoint_modules` de l'hôte déployé (`azure/standalone_backend.py:487`) : `GET /api/c13s/vapid/public-key` et `GET /api/c13s/push-subscriptions` rendent **404**, alors que le front appelle les deux (`services.ts:515`, `notificationUtils.ts:71`). Toute une fonction est morte en production — board APP-IA #9858, ouvert le 29/07. (2) La feuille servie `/assets/AdvertCard-BKnn2WVw.css` porte `url(src/assets/images/placeholder-image.jpg)`, résolue par le navigateur en `/assets/src/assets/images/placeholder-image.jpg` → **404**, et le fichier n'est pas dans le build. Aucune des 1 249 annonces n'a donc d'image de repli — board #9875. **Ce n'est pas RT-1 / RT-2 sous un autre nom** : les deux contrôles proposés ne franchissent aucune mire. J'ai lu cette feuille et obtenu son 404 **sans être authentifié**, en trois appels `fetch`. | Généraliser le comparateur de `ecart_servi_versionne` (TF-0288) à deux paires de termes de plus — il fait déjà le bon geste sur les entrées de `<nav>`, avec les trois issues déclarées qu'il faut : (a) **routes appelées / routes servies** — les appels client sont littéraux et lisibles statiquement (`axios.get('c13s/…')`, `fetch`), l'instance répond ou ne répond pas ; une route appelée qui rend 404 est un FAIL nommé ; (b) **ressources référencées / ressources servies** — lire les `url()` du CSS construit et les `src`/`href` du HTML servi, résoudre, demander : tout ce qui n'est pas 200 est nommé. C'est la **troisième** généralisation demandée du même comparateur (RT-23 demandait déjà de le porter de la page à l'instance entière) : il y a probablement un mécanisme unique à en tirer plutôt que trois. |
| RT-27 | majeur | **Le cahier dérivé n'a qu'un seul terme de comparaison externe possible — un `EXIGENCES.json` — c'est-à-dire, en pratique, aucun.** Le sceau de tous les cahiers de Produit-11 porte `exigences_source: (absent)` et la ligne « les cas sont dérivés de la SEULE SURFACE inventoriée ». C'est honnête et déclaré. Mais un référentiel d'exigences est rare, alors qu'une **liste d'anomalies ouvertes** existe sur presque tout produit vivant — et sur celui-ci elle existait : **13 anomalies** dans Azure Boards (`Client-A-DevOps / APP-IA`), ouvertes les 29 et 30/07, priorités 1 à 3. Le coût de leur absence est mesurable : six campagnes d'audit entre le 11 et le 18/08, 131 entrées au ledger, verdict PARTIEL — et **pas une ligne, dans aucun rapport, aucun cahier, aucun ledger, ne mentionne un seul de ces treize identifiants**. Aujourd'hui, huit sont toujours servies, dont quatre visibles par n'importe quel utilisateur à chaque écran. Le recouvrement fortuit qui a eu lieu (D-5, D-6, D-7 recoupent #9871 et #9857) prouve la valeur du contrôle sans le rendre fiable : il tenait au hasard de la séquence de test. | **Réemployer la mécanique d'`exigences.py`, pas en écrire une seconde.** Ce module calcule déjà exactement ce qu'il faut : le rattachement déclaré ou lexical avec sa provenance, et — c'est la partie qui compte ici — « la réciproque, que personne ne regarde jamais : les exigences qu'AUCUN cas ne touche ». Un second référentiel `FORGE_TESTS_ANOMALIES` (JSONL : id, titre, statut, priorité), alimenté par le projet depuis son gestionnaire de tickets, passerait dans la même moulinette et rendrait le chapitre qui manque : **« anomalies déclarées : couverte par tel cas / non couverte, motif »**. Le refus déjà en place vaudrait tel quel — un chemin déclaré et introuvable est un refus, pas un silence. |

## factory (`digit-ai-factory`, ex `digit-ai-forge-pilot`)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-28 | majeur | **L'ouverture de run ne demande jamais ce que le client sait déjà de ses défauts, donc une campagne peut se clore « pans au vert » à côté d'un lot d'anomalies ouvertes — sans que rien ne le signale.** Ce que `run_open` consigne aujourd'hui, vérifié sur le ledger de Produit-11 (seq 1, et les cinq ouvertures suivantes) : `run_id`, `objet`, `projet`, `versions_forges`, `bootstrap`. Rien sur les **entrées de connaissance** du produit : ni référentiel d'exigences, ni liste d'anomalies, ni source de tickets. Conséquence mesurée ici : treize anomalies clients vivaient dans Azure Boards depuis le 29/07 ; six campagnes ont tourné entre le 11 et le 18/08 ; **aucune n'a su qu'elles existaient**, et le sujet n'est apparu que le 18/08 parce qu'un humain a collé une URL de board dans une conversation. Le défaut n'est pas que la forge ne les ait pas trouvées — cinq relèvent d'exclusions écrites et légitimes — c'est que **leur absence n'a jamais été un terme déclaré de la mesure**, alors que la doctrine de cette factory est précisément qu'un SKIP muet est pire qu'un SKIP déclaré. | Ajouter à la phase 0 une **déclaration des référentiels disponibles**, sur le modèle de ce que le cahier fait déjà en tête : exigences, anomalies, contrat d'interface — chacun *déclaré présent avec son chemin*, ou *déclaré absent*. Trois effets, tous gratuits : le `run_open` du ledger porte la trace de ce sur quoi on ne pouvait pas s'appuyer ; le rapport de fin cesse de pouvoir dire « au vert » sans dire « au vert **contre quoi** » ; et le jour où un projet en branche un (RT-27), la boucle se referme d'elle-même. La question n'a besoin d'être posée qu'une fois par produit. |

## Confirmations positives

- **Les exclusions écrites du §6 ont tenu, et elles ont eu raison.** Sur les neuf anomalies non
  refermées, **cinq** tombent exactement dans ce que la stratégie déclare ne pas couvrir :
  photos (stockage objet désactivé), courriel, push, traitement d'alertes, rendu visuel. Une
  forge qui aurait « testé » ces surfaces aurait rendu du vert faux. La discipline du SKIP
  déclaré n'est pas ici une excuse : c'est la raison pour laquelle le périmètre réellement
  mesuré est **opposable**. Ce lot ne demande à personne de tester un job qui n'est pas
  déployé.
- **Le second étage (recette sur instance servie, §12) est le seul dispositif qui ait touché
  la vraie base — et il a payé dès sa première exécution.** É-1, É-2, D-14 et D-15 sont hors
  d'atteinte du premier étage. RT-25 ne le conteste pas : il demande d'élargir d'un cran le
  prédicat de ces mêmes invariants, là où ils sont déjà branchés au bon endroit.
- **D-4 tient en production.** Les codes INSEE à zéro de tête sont servis intacts sur 56
  communes des départements 01 à 09, vérifié par la recette. C'était la cause d'une classe
  entière d'annonces invisibles sur la carte ; elle est éteinte.
- **`ecart_servi_versionne` (TF-0288) est le bon geste, et c'est pour cela qu'on le réclame
  trois fois.** RT-23 hier, RT-26 aujourd'hui : les deux demandent d'appliquer son schéma —
  deux termes, trois issues déclarées, l'écart nommé — à un couple de termes de plus. Un
  mécanisme qu'on veut réutiliser est un mécanisme réussi.

## Ordre recommandé

1. **RT-26** — le meilleur rapport gain/effort du lot, et de loin. Deux confrontations
   statiques, sans navigateur, sans authentification, sans instance montée par personne :
   elles attrapaient ici une fonction entièrement morte en production et l'absence d'image
   sur 1 249 annonces. Le comparateur existe déjà.
2. **RT-24** — un axe de cas, dérivable de la surface déjà inventoriée, qui attrape une classe
   que rien d'autre ne voit : le produit répond 200 et range autre chose. Deux défauts réels
   sur ce seul produit.
3. **RT-27 puis RT-28** — les deux moitiés du même trou, et elles se traitent ensemble : le
   pilot demande le référentiel à l'ouverture, la forge sait quoi en faire. Aucune des deux
   ne sert seule.
4. **RT-25** — le plus dépendant d'une déclaration de domaine, donc le plus lent à généraliser.
   À traiter en dernier, mais le cas des coordonnées à `0,0` mérite un domaine par défaut :
   c'est la valeur par défaut d'un entier, elle est toujours présente et toujours fausse.
