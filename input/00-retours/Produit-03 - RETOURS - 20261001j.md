# Retours forges — Produit-65 — 20261001j

- **Contexte** : le commanditaire a corrigé, le 01/10/2026 vers 17h40, un complément de relance proposé à l'exploitant de production. 2 règles de forme en sortent, valables pour toute demande remise à une équipe tierce, et elles prolongent celles du même jour remises plus tôt.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une demande à une équipe tierce renvoyait à un message précédent, et son statut était illisible

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-71 | majeur | produit+générique | **Une relance qui renvoie à un message.** Le complément proposé disait « Lancer la relance demandée à 16h38 » au lieu de redonner les gestes. Le commanditaire : « on ne répète pas "Lancer la relance de telle heure". Recommence avec les étapes exactes à exécuter. » Le message réécrit redonne 8 gestes, écran par écran, avec le geste à faire si l'étape s'arrête ; publié à 17h41 dans le fil 22494 de la demande de fusion 4025. `scripts/controler-demande.mjs` refuse désormais le renvoi (« demandée à 16h38 ») | Qu'une demande se suffise à elle-même dans la consigne de rédaction de la factory : une relance redonne les gestes exacts, et un contrôle refuse un renvoi à un message précédent par son heure ou par « comme demandé » |
| RA-72 | majeur | produit+générique | **Un statut que l'exploitant ne peut pas lire.** Le statut du complément faisait 5 phrases et 106 mots, et racontait la revue, les correctifs et les numéros de demande de fusion de l'équipe produit. Le commanditaire : « le statut est incompréhensible, simplifie, raccourcie et corrige ». Il contenait aussi une conséquence fausse : un arrêt y précédait l'affichage du formulaire. Le statut réécrit tient en 3 phrases et 63 mots ; le contrôle refuse l'ancien, et refuserait aussi celui de 16h38 (4 phrases) | Qu'un statut adressé à une équipe tierce tienne en 3 phrases et 80 mots au plus, dans les mots du lecteur : la situation et sa cause, puis l'effet des gestes ; et que l'oracle d'écriture le mesure |

## La règle qui aurait évité le retour

Aucune règle ne couvre ces 2 retours. La forme du jour fixait les 4 parties et leurs exclusions, sans borne de longueur ni règle d'autonomie. La règle manquante : une demande se lit seule, et son statut se lit en trois phrases.

> **Note de réception du pilot (12/10/2026)** : le sidecar du produit portait les classes proposées ci-dessous sans que ce .md les nomme. Le pilot les reprend ici mot pour mot depuis le sidecar, sans les modifier, avant l'ingestion (même traitement que D-57 (a) du 04/10/2026).

- `RA-71` : clé `demande-renvoie-a-un-message`, famille `contrat-interface-forge`, libellé « Une demande a une equipe tierce renvoie a un message precedent au lieu de redonner les gestes exacts ».
- `RA-72` : clé `statut-de-demande-illisible`, famille `contrat-interface-forge`, libellé « Le statut d une demande raconte le travail de l equipe au lieu de dire la situation et l effet, sans borne de longueur ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le complément renvoyait à la relance de 16h38 | message réécrit avec les 8 gestes ; contrôle du renvoi dans `scripts/controler-demande.mjs` | oui | remonté ci-dessus en `RA-71` |
| Le statut faisait 5 phrases et 106 mots | statut réécrit en 3 phrases ; borne de 3 phrases et 80 mots dans le contrôle | oui | remonté ci-dessus en `RA-72` |
| La contrainte 4 du `CLAUDE.md` du produit faisait porter à la demande la liste des opérations que seule la production exécute | cette liste va dans la restitution ; la demande garde le geste à faire en cas d'arrêt | non | traité au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. L'écrit en cause est un message à l'exploitant, rédigé selon `docs/ops/demande-equipe-tierce.md` du produit.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus.

## Confirmations positives

- Le contrôle des demandes a rendu la correction mesurable dans le tour : rouge sur le complément d'origine, vert sur le message publié.

## Ordre recommandé

1. `RA-72` : un statut illisible fait douter l'exploitant au moment d'agir.
2. `RA-71` : la règle d'autonomie d'une demande.
