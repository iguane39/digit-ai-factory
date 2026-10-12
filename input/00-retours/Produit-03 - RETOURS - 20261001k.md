# Retours forges — Produit-65 — 20261001k

- **Contexte** : le 01/10/2026 vers 18h00, le commanditaire a dû redire une consigne donnée une heure plus tôt, et il demande que ce point remonte à la factory : « pour qu'une demande que je réalise soit réellement appliquée, que je n'ai pas à le répéter plusieurs fois et que lorsque je demande des étapes (ou autre chose), on ne fasse pas référence à d'autres références qui font référence à d'autres références, sinon on ne s'en sort pas ».
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une consigne appliquée au seul livrable qu'elle visait, et des étapes données par renvoi

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-73 | bloquant | générique | **Une consigne réduite au livrable qu'elle visait.** Vers 17h40, le commanditaire refuse un message qui disait « Lancer la relance demandée à 16h38 » et demande les étapes exactes. La session corrige le message envoyé à l'exploitant et le contrôle qui juge ces messages. La restitution du même tour écrit pourtant « exécuter les 8 gestes du message publié à 17h41 » et « Il faut la relance ci-dessus ». Le commanditaire, vers 18h00 : « Pourquoi ça n'a pas été appliqué ? Pourquoi est-ce qu'on a encore ce texte qui revient alors que j'avais demandé à le supprimer ? » | Qu'une consigne du commanditaire soit lue comme une règle générale : la session l'applique à tous les livrables du tour, la restitution d'abord, et elle le vérifie sur chacun avant de la déclarer appliquée |
| RA-74 | majeur | générique | **Un message envoyé sans être montré.** La session a publié le message réécrit pour l'exploitant et l'a seulement décrit dans sa restitution (« 8 gestes écran par écran »). Le commanditaire : « Et pourquoi le prompt pour Nicolas n'est pas affiché ? » Il ne pouvait ni le vérifier ni le reprendre | Qu'un message envoyé au nom du commanditaire s'affiche en entier dans la restitution du tour qui l'envoie, et que l'oracle de restitution le vérifie dès qu'un envoi est déclaré |
| RA-75 | majeur | générique | **Des renvois en chaîne au lieu du contenu.** La forme de restitution désigne tout par des sélecteurs et des identifiants (actions, décisions, retours, entrées du projet commun). Une ligne d'action y renvoyait à un message, qui renvoyait lui-même à une relance antérieure. Le contrôle des renvois écrit au produit rend 10 renvois dans la restitution `20261001s` et 9 dans `20261001t`, et 0 dans le message publié. L'oracle de restitution avait jugé PASS les 2 restitutions | Qu'une action laissée à un humain porte ses étapes en entier dans sa ligne ou dans le guide ; que l'oracle de restitution refuse un renvoi à la place d'un contenu à exécuter (« les gestes du message de … », « ci-dessus », « comme demandé ») ; le motif du contrôle du produit peut servir de point de départ |
| RA-76 | majeur | générique | **Un oracle qui impose la tournure interdite.** Le commanditaire demande des étapes ; le hook de restitution rend alors bloquante la règle de guide, qui n'admet qu'une clôture en « Ce que vous devez voir ». Le commanditaire interdit cette tournure, règle du porteur `RT-15` redite le 01/10 vers 15h20. La session a dû choisir entre écrire la tournure interdite et classer l'action de l'exploitant hors de la règle, en `manuelle_dev`, geste technique d'un tiers. Le conflit avait été remonté en `RA-66`, lot `20261001h`, vers 15h32 ; il est devenu bloquant à 18h05 | Que la règle de guide admette une clôture sans « Ce que », par exemple « Résultat attendu : » ; et qu'un oracle ne rende jamais bloquante une formule qu'une règle du porteur interdit |

## La règle qui aurait évité le retour

La règle existe en partie : la loi de restitution interdit un renvoi par position (« ligne 5 »), et une preuve par « voir A-N ». Elle ne couvre ni le renvoi à un autre message, ni la portée d'une consigne. La règle manquante : une consigne vaut pour tout le tour, et ce qui doit être fait s'écrit en entier là où on le lit.

> **Note de réception du pilot (12/10/2026)** : le sidecar du produit portait les classes proposées ci-dessous sans que ce .md les nomme. Le pilot les reprend ici mot pour mot depuis le sidecar, sans les modifier, avant l'ingestion (même traitement que D-57 (a) du 04/10/2026).

- `RA-73` : clé `consigne-reduite-au-livrable-vise`, famille `contrat-interface-forge`, libellé « Une consigne du commanditaire est appliquee au seul livrable qu elle visait, pas aux autres livrables du tour ».
- `RA-74` : clé `message-envoye-non-affiche`, famille `contrat-interface-forge`, libellé « Un message envoye au nom du commanditaire est decrit au lieu d etre affiche dans la restitution ».
- `RA-75` : clé `renvoi-au-lieu-du-contenu`, famille `hook-ou-gate`, libellé « Une restitution renvoie a un autre message ou a une autre liste au lieu de donner le contenu a executer ».
- `RA-76` : clé `oracle-impose-tournure-interdite`, famille `hook-ou-gate`, libellé « Un oracle de restitution impose une formule que la regle du porteur interdit, et le hook la rend bloquante ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La consigne n'était appliquée qu'aux messages pour une autre équipe | règle de portée générale dans `CLAUDE.md` et dans la mémoire de la session | oui | remonté ci-dessus en `RA-73` |
| Le message publié n'était pas affiché | la restitution suivante l'affiche en entier | oui | remonté ci-dessus en `RA-74` |
| Les restitutions renvoyaient à d'autres messages | `scripts/controler-renvois.mjs`, joué avant chaque affichage ; les étapes de l'exploitant écrites dans sa ligne d'action | oui | remonté ci-dessus en `RA-75` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont les restitutions du tour, selon le gabarit de restitution du pilot, et un message à l'exploitant.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus.

## Confirmations positives

- Le contrôle des renvois a rendu le défaut mesurable sur les 2 restitutions qui le portaient, et il a confirmé que le message publié en était exempt.

## Ordre recommandé

1. `RA-73` : sans elle, le commanditaire répète chaque consigne.
2. `RA-75` : l'oracle qui rend le défaut visible avant l'affichage.
3. `RA-76` : un oracle ne doit pas imposer ce que le porteur interdit.
4. `RA-74` : l'affichage de tout message envoyé.
