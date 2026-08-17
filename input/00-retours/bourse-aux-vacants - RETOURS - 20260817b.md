# Retours forges — bourse-aux-vacants — 20260817b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : constat humain en fin de campagne du 17/08 — « pourquoi les tests e2e en local
  tournent-ils toujours ? ». Ils ne tournaient pas : c'était la **topologie** montée pour
  l'audit, restée debout sans usage. La question a ouvert un écart plus grave que l'encombrement
  qu'elle visait.
- **Références ledger** : `forge\ledger.jsonl` seq 130
- **Lot précédent** : `bourse-aux-vacants - RETOURS - 20260817a.md`, remis et donc immuable.
  D'où ce lot neuf.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-17

**Numérotation** : BAV2 tient une séquence `RT-nn` ; RT-1 … RT-21 sont consommés. Ce lot
continue en RT-22 / RT-23.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## forge-tests (`digit-ai-forge-tests`)

Quatre pans — `front`, `qualif`, `accessibilite`, `visuel` — exigent une instance **servie**.
La forge dit qui la monte : le projet, et c'est le bon partage, lui seul sait ce que « peuplé »
veut dire chez lui. Elle ne dit à personne qui la **démonte**, ni comment savoir de quoi elle a
été bâtie. Les deux retours ci-dessous sont les deux moitiés de ce trou.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-22 | majeur | **Le cycle de vie de l'instance servie n'appartient à personne, et le rapport ne dit pas ce qu'il laisse debout.** Mesuré le 17/08 sur BAV2 : `node e2e/preparer.mjs` monte 3 conteneurs et un réseau (≈ 4 min à froid) parce que les pans l'exigent ; l'audit se termine à **11:30** ; les conteneurs tiennent les ports **8091, 8092 et 5544 jusqu'à 13:55** — **2 h 25 sans le moindre usage**, jusqu'à ce qu'un humain s'en étonne. Le `POUR_COUVRIR` du pan `qualif` dit « servir une instance PEUPLÉE du produit et déclarer son URL » : le montage est délégué, le démontage n'est délégué à personne. Aucune ligne du rapport ne mentionne ce qui reste en service après l'audit. Conséquence immédiate au-delà de l'encombrement : les ports sont pris, donc **un second projet audité sur le même poste, ou un second run du même projet, se heurte à une instance qu'il n'a pas montée** — et il n'a aucun moyen de savoir si elle est la sienne. | Un **contrat de cycle de vie déclaré par le projet** — deux commandes, monter et démonter — et une règle en une phrase : **la forge démonte ce qu'elle a monté, et publie ce qu'elle laisse debout quand elle ne l'a pas monté.** C'est la doctrine déjà tenue partout ailleurs dans cette forge : un SKIP muet est pire qu'un SKIP déclaré. Une instance laissée en service sans le dire est de la même famille. |
| RT-23 | **bloquant** | **Une instance laissée debout est indiscernable d'une instance fraîche : l'audit peut mesurer un code qui n'est plus celui du dépôt, et le publier comme courant.** Le fait, sur cette campagne : la topologie a été bâtie à **10:47** depuis l'arbre de travail d'alors. Le correctif D-14 (`src/02_get_advert.py`) a été écrit **après**. Entre 11:30 et 13:55, l'instance servait donc un code **antérieur au correctif**, et rien ne l'aurait signalé — ni l'instance, ni le rapport. Un audit relancé dans cette fenêtre aurait mesuré l'ancien code et publié ses chiffres comme l'état courant du produit. Le risque n'est pas la mémoire du poste, c'est de **mesurer autre chose que ce qu'on croit mesurer**, sans aucun signal. La forge connaît déjà cette classe et sait la nommer : `TF-0288` confronte le SERVI au VERSIONNÉ sur les liens d'un `<nav>`, et son cas fondateur est exactement celui-là — un code juste, un servi qui a dérivé, deux « toujours pas » avant que quiconque regarde le bon terme. Sa recette porte d'ailleurs un second témoin de la même famille : « le 17/08, Docker Desktop arrêté a rendu 10 défauts du corpus en [MANQUE] (12/22) » — l'état de l'environnement change silencieusement ce qui est mesuré. | Généraliser le terme de comparaison de `TF-0288` de la page à **l'instance entière** : relever de quoi l'instance auditée a été bâtie (empreinte des images, commit, horodatage de build) et le confronter à l'arbre de travail audité. Trois issues **déclarées**, comme pour `TF-0288` : concordant · divergent, avec l'écart nommé et la phrase qui compte — *ce n'est pas le code qui est en retard, c'est l'instance* · non déterminable, en disant **lequel des deux termes manque**. Le scellement d'empreinte existe déjà côté `forge-ops` pour les déploiements (`TF-0288`, volet prévention) : il y a probablement un mécanisme à reprendre plutôt qu'à écrire. |

## Confirmations positives

- **Le partage « le projet peuple, la forge mesure » est le bon, et il n'est pas remis en
  cause.** Ces deux retours ne demandent pas à la forge de savoir monter une application
  quelconque — elle ne le peut pas, et prétendre le contraire serait le vrai défaut de
  conception. Ils demandent que ce que le projet sait faire soit **déclaré** au lieu d'être
  implicite, et que ce qui reste debout soit **dit** au lieu d'être tu.
- **La garde de précondition (`TF-0211`) et le canal de session (`TF-0222`) ont tous deux
  servi sur cette campagne**, et c'est ce qui a permis d'aller assez loin pour voir ce trou-ci.
  Un pan qui échoue bruyamment fait progresser ; un pan qui échoue en silence coûte un audit.

## Ordre recommandé

1. **RT-23** — c'est celui qui protège une mesure. Tant qu'il n'est pas traité, tout rapport
   produit contre une instance montée par un tiers porte un doute qu'aucun lecteur ne peut
   lever.
2. **RT-22** — le démontage devient presque gratuit une fois le cycle de vie déclaré, et les
   deux se traitent avec la même déclaration côté projet.
