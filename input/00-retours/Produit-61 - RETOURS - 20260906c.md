# Retours forges — Produit-61 — 20260906c

- **Contexte** : run de version 20260906 (quatre retours humains après le premier essai de la qualif par le commanditaire)
- **Références ledger** : `forge\ledger.jsonl` seq 85, 86, 87, 88 (entrées `type: retour`, source production)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-06

Ce lot remonte ce que quatre retours humains révèlent d'incohérent dans les forges : à chaque fois, le produit a passé ses oracles au vert et le commanditaire a trouvé le défaut en une minute d'essai. Il se lit par forge, une phrase de contexte puis un tableau de faits avec leur preuve.

Les identifiants RP-n (retour au pilot), RC-n (retour à forge-conception), RD-n (retour à forge-design) et RT-n (retour à forge-tests) numérotent les retours par forge, en continuité des lots précédents de ce produit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Les conventions de démonstration et de MEP ont été écrites pour une instance locale ; appliquées à une qualif servie sur Internet, elles exposent des identifiants et laissent le commanditaire sans compte d'essai.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-5 | bloquant | générique | La convention R-23 (ACCES-TEST.md : « identifiants volontairement triviaux et notoires » listés dans une fiche versionnée) et l'aide de la page de connexion sous MODE_DEMO ont mis `admin@demo.local / demo-admin` sur une page servie sur Internet et dans un dépôt poussé sur GitHub. Retour humain du 06/09 (lot INSATISFACTION 20260906a) ; `git show 6e23fce:docs/projet/ACCES-TEST.md` porte les valeurs. | R-23 : une fiche d'accès nomme des VARIABLES, jamais des valeurs ; interdire tout identifiant dans une page servie ; oracle R-14 étendu aux gabarits Jinja |
| RP-6 | majeur | générique | ETAPE-MEP § 3 bis (« qualif populée ») prescrit un peuplement par drapeau mais ne prescrit ni comptes d'essai vides pour le commanditaire, ni la source des identifiants d'une qualif publique. Le commanditaire a dû demander trois comptes (lot 20260906b). | § 3 bis : un compte populé + N comptes vides, identifiants par variables `DEMO_ACCOUNT_N_*`, gabarit `.env.example` du pilot |
| RP-7 | mineur | générique | Une session parallèle (Claude sur GitHub) a déposé les quatre lots d'insatisfaction dans un dépôt vide nommé `command-manager`, avec un `.env.example` et un ACCES-TEST.md propres, sans lien avec le dossier produit `Produit-61` du run : deux noms, deux socles, une convergence à la main (`git fetch` puis import). | lier le dépôt GitHub au produit dès l'ouverture (`docs/projet/COMPOSANTS-OPS.md`, champ dépôt) et faire porter au gabarit INSATISFACTION le nom du produit du run |

## forge-conception (`digit-ai-forge-conception`)

La surface implicite SaaS a laissé passer deux affordances évidentes pour un restaurateur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-3 | majeur | générique | `enumere-la-surface` (58 éléments) n'a proposé ni « partage du lien client depuis l'administration » ni « comptes d'essai pour le commanditaire » : deux retours humains (lots 20260906b, c) sur un référentiel à 73 exigences PASS. | ajouter à la liste close de la surface implicite : « lien public partageable (copie, QR) » pour tout produit à page publique, « comptes d'essai vides » pour tout produit multi-tenant |

## forge-design (`digit-ai-forge-design`)

La revue d'implémentation juge des captures statiques ; l'état conservé entre écrans n'est ni dans la doctrine ni dans les parcours.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-6 | majeur | générique | Le panier client (formulaire rendu par le serveur) se vidait après « Aide » puis « La carte » : mesuré au navigateur sur qualif (quantité 2 → 0), 18 pages PASS aux oracles et parcours C13 3/3 sur la maquette mono-fichier, où la navigation ne recharge pas la page. Retour humain lot 20260906d. | règle mobile : « un état saisi survit à la navigation de la barre basse » ; parcours C13 joué sur le produit rendu, pas seulement sur la maquette |

## forge-tests (`digit-ai-forge-tests`)

Le pan qualif a compté comme exercés des boutons sans effet utile.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-6 | majeur | générique | Le pan qualif rend 68/68 « exercés » alors que « Ma commande » menait à la page d'aide et que « Panier » n'avait aucun effet visible pour le commanditaire ; le smoke M-3 en HTTP direct ne pouvait pas le voir. `rapport-20260905g.json` (qualif 100 %), lot 20260906d. | un élément interactif est exercé quand son EFFET est observé (navigation attendue, changement de DOM), pas quand il est cliqué ; M-3 au navigateur pour les exigences d'impact maximal |

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec le verdict de généralisation de chacune.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Lien client en texte brut dans l'administration | lien cliquable + bouton « Copier le lien » (presse-papiers, repli `execCommand`), E-074 | oui | RC-3 |
| Identifiants de démo affichés et versionnés | comptes lus dans `DEMO_ACCOUNT_N_*`, aide de connexion neutre, fiche d'accès sans valeur, E-075 | oui | RP-5, RP-6 |
| Panier perdu entre écrans, boutons Panier et Ma commande sans effet perçu | panier conservé par restaurant sur l'appareil et vidé à la commande, Panier = défilement + mise en évidence + focus, Ma commande = cookie de dernière commande ou message, E-076 à E-078 ; contrôle rouge → vert `forge/etapes/tests/parcours-client-qualif.json` | oui | RD-6, RT-6 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot. Vérifié par le pilot du run, le 06/09/2026.

## Confirmations positives

- Le run de version (RUN-VERSION.md) a tenu en delta : conception (oracles PASS sur le référentiel entier), design par `vue_inchangee` motivées, développement sous les mêmes gates, audit complet, MEP qualif.
- Le gabarit INSATISFACTION du pilot a permis au commanditaire de déposer quatre retours exploitables tels quels.

## Ordre recommandé

1. RP-5 (un secret de démo exposé sur Internet, corrigé mais reproductible sur tout produit).
2. RT-6 puis RD-6 (un vert qui ne voit pas un bouton sans effet vaut moins qu'un rouge).
3. RC-3, RP-6, RP-7.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Les quatre retours de ce lot suivent des retours humains. RP-5 : R-14 (aucun secret committé) couvrait le dépôt mais pas la page servie ni la fiche d'accès ; RC-3 et RP-6 : aucune règle ne nomme le lien partageable ni les comptes d'essai (surface implicite à compléter) ; RD-6 et RT-6 : aucune règle ne dit qu'un élément interactif se juge par son effet. Classes déclarées au sidecar parmi celles de `CLASSES.json` v1.2.0, la plus proche à chaque fois ; le pilot est invité à créer « élément interactif jugé par son clic, pas par son effet ».
