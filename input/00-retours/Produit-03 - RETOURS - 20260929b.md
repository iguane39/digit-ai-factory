# Retours forges — Produit-03 — 20260929b

- **Contexte** : suite de l'incident de mise en production du 29/09/2026 (lot `20260929a`, `RA-48`).
  Le commanditaire demande, mot pour mot : « dans les vérifications, à remonter à la Factory ce manque
  de vérification ». Ce lot porte le défaut des VÉRIFICATIONS elles-mêmes : celles qui ont précédé
  l'approbation du plan de production ont rendu vert sans dire ce qu'elles ne mesuraient pas.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` :
  le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du
  produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 29/09/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — un feu vert et une contre-lecture qui ne publient pas ce qu'ils ne vérifient pas

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-49 | bloquant | produit+générique | **Les vérifications d'avant production n'ont compté que des nombres.** Le critère d'approbation écrit dans la procédure de l'exploitant (`docs/ops/procedure-mep-exploitant.md`, étape 1, points 6 et 7) est : « Si c'est bien **11 / 1 / 0**, et que la seule modification porte sur `azurerm_resource_group.rg` : **Review → Approve** ». La restitution du 28/09 qui donne le feu vert (`20260928e`, jugée `PASS` par `oracle-synthese`) reprend le même critère, et fonde le feu vert sur 3 contrôles : l'objet du gabarit, les retours transmis, la connexion de service. Aucun des deux textes ne dit ce que ces vérifications ne mesurent pas : les valeurs que le plan envoie à la plateforme, ni leur validité à la date d'application. Le 29/09 à 10h11, l'exploitant demande « Plan: 11 to add, 1 to change, 0 to destroy. est ce un résultat acceptable? » ; la réponse, à 10h12, se fonde sur le compte ; le plan est approuvé. Il portait pourtant, lisible dans `plan.txt` (journal du plan de l'exécution 15452, ligne 208), `start_date = "2026-08-01T00:00:00Z"`, qu'Azure a refusé à l'application : `400 … Start date for monthly time grain should not be prior to current month`. Le vert s'est lu comme une absence de limite. **Récidive** de la classe `oracle-perimetre-de-non-mesure-non-publie`, créée le 16/09 : son remède, le bloc `non_juge` obligatoire (`quality-oracles` §3), vaut pour la sortie d'un oracle exécuté. Il n'a pas atteint un critère de vérification écrit en prose, dans une procédure ou dans une restitution, qui est pourtant ce qu'un humain lit au moment d'approuver | (1) Étendre le remède de la classe à tout critère de vérification écrit pour un humain : procédure d'approbation, contre-lecture, feu vert. Il porte sa ligne « Ne vérifie pas : … ». (2) Dans `gabarits\RESTITUTION.md`, un verdict de feu vert, ou de mise en production possible, nomme ce que ses contrôles n'ont pas mesuré, avec une règle d'`oracle-synthese` qui le juge. (3) La contre-lecture d'un plan d'infrastructure lit les valeurs datées du plan contre la date d'application : c'est la règle maison proposée en `RA-48`, qu'elle rendrait exécutable |

## La règle qui aurait évité le retour

La règle existe pour les oracles : `quality-oracles` §3, contrat commun, « le bloc `non_juge` est
obligatoire dans toute sortie d'oracle, PASS compris » (classe `oracle-perimetre-de-non-mesure-non-publie`,
créée le 16/09/2026). Elle ne couvre pas un critère de vérification écrit en prose pour un humain, et
c'est par là que le défaut est revenu. La règle générale qui l'aurait évité : toute vérification qui
autorise un geste irréversible publie ce qu'elle ne vérifie pas, qu'elle soit exécutée par un script ou
lue par une personne.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le critère d'approbation de la procédure de l'exploitant ne porte que les comptes du plan | la relance du 29/09 lit aussi la valeur du budget, « (known after apply) », et la contre-lecture de l'agent lit le fichier de variables publié avec le plan | oui | remonté ci-dessus en `RA-49` |
| La date de début du budget était écrite en dur | calculée à la création, sur les 3 environnements, par correctif urgent de production (décisions `D-57 (a)` et `D-58 (a)`) | oui | remonté dans le lot `20260929a` (`RA-48`) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le document en cause est
une restitution, qui suit `gabarits\RESTITUTION.md` (version 2.30.0 ou 2.31.0, toutes deux du 28/09 ;
la version jouée au tour n'est pas consignée), et une procédure d'exploitation écrite à la main. Ce
qui leur a manqué, le périmètre de non-mesure du feu vert, est remonté en `RA-49`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de
`output\` repris cinq fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot
`20260929a`.

## Confirmations positives

- La garde du nombre de créations a tenu son rôle, borné : elle refuse un plan qui crée trop, et le
  29/09 elle a lu le bon compte, « Plan : 11 creation(s) proposee(s) ». C'est un contrôle de forme du
  plan ; il ne prétendait pas juger ses valeurs.

## Ordre recommandé

1. `RA-49` (1) et (2) d'abord : une ligne « Ne vérifie pas : … » coûte peu à écrire, et elle aurait
   fait poser la question de la date avant l'approbation. (3) suit avec la règle maison de `RA-48`.
