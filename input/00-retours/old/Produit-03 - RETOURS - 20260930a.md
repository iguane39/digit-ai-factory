# Retours forges — Produit-03 — 20260930a

- **Contexte** : relecture du constat `RPC-16` par le projet commun, le 30/09/2026. Il signale que l'identifiant de permission que nous lui avons transmis ne désigne pas `Application.ReadWrite.OwnedBy`. La cause est chez nous : un script du produit porte depuis le 16/09 un identifiant faux, et l'étape qui devait accorder cette permission l'aurait annoncée « consentie » sans rien accorder, ou se serait arrêtée en erreur. Suite du lot `20260929e` (`RA-52`).
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 30/09/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — un identifiant de plateforme écrit en dur, jamais résolu contre la plateforme

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-53 | majeur | produit+générique | **Un identifiant de permission écrit de mémoire, et une étape qui annonce son effet sans le relire.** `infra/creer-connexion.sh` écrit `GRAPH_APP_RW_OWNEDBY="18a4783c-866b-4cc7-a460-3d0e455740fd"` depuis le 16/09 (commit `6d06517`, le jour du passage aux identités dédiées). Microsoft Graph et sa documentation officielle donnent `18a4783c-866b-4cc7-a460-3d5e5662c884` : réponse de l'API du 29/09 (rôles du principal de service Graph), page « Microsoft Graph permissions reference » lue le 30/09. Les 2 identifiants ont les mêmes 26 premiers caractères, et diffèrent sur les 10 derniers. Les fiches du produit des 07/09 et 08/09 portaient la bonne valeur. L'étape `entra` du script, celle que l'administrateur d'annuaire devait jouer pour accorder la permission, ajoute l'identifiant faux en masquant son échec (`2>/dev/null \|\| true`), puis écrit « Application.ReadWrite.OwnedBy consentie » après le consentement, sans relire l'annuaire. Découvert par le projet commun, qui a résolu l'identifiant contre Graph avant de l'écrire dans son registre | (1) Tout identifiant de plateforme écrit en dur (permission, rôle, application first-party) se résout contre la plateforme dans le tour qui l'écrit, et porte en commentaire la commande qui le résout. (2) Une étape qui accorde un droit relit son effet dans la plateforme avant d'écrire « ok » ; une erreur d'ajout ne se masque pas. (3) Un oracle de dépôt peut comparer les identifiants de permission Graph d'un script à la table officielle, lue le jour du jugement |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour. La classe voisine, `interface-tierce-ecrite-de-memoire`, vise les gestes et les écrans d'une plateforme tierce prescrits à l'humain, et elle se juge sur la restitution. Ici, l'identifiant est une constante du code, que rien ne compare à la plateforme, et l'étape qui l'emploie proclame un succès qu'elle ne vérifie pas. La règle manquante : un identifiant de plateforme se résout contre la plateforme avant d'entrer dans le code, et un geste qui accorde un droit relit son effet.

La classe est proposée dans la famille `tracabilite-ledger`, voisine de `interface-tierce-ecrite-de-memoire` : clé `identifiant-de-plateforme-en-dur-jamais-resolu`, libellé « Un identifiant de plateforme (permission, rôle, application first-party) est écrit en dur dans le code sans être résolu contre la plateforme, et l'étape qui l'emploie annonce son effet sans le relire ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'identifiant faux de `infra/creer-connexion.sh` | remplacé par celui de Graph, commentaire daté avec sa source ; la correction part par une demande de fusion vers `env/dev` | oui | remonté ci-dessus en `RA-53` |
| L'identifiant faux a été transmis au projet commun dans un message du 30/09 | corrigé par le projet commun avant écriture, accusé de réception envoyé | non | reste au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le fichier en cause est un script du produit, sans gabarit ; ce qui lui a manqué est remonté en `RA-53`.

## Documents mûrs

Aucun document mûr sur ce lot : aucun document de `output\` n'a été repris sur ce lot, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot `20260929e`.

## Confirmations positives

- La relecture croisée a fonctionné : le projet commun a résolu l'identifiant contre Graph au lieu de le recopier, et le défaut a été trouvé avant que l'administrateur d'annuaire ne joue le script.

## Ordre recommandé

1. `RA-53` (2) d'abord : relire l'effet d'un geste qui accorde un droit coûte une requête, et rend visible tout identifiant faux ; (1) ensuite, à l'écriture ; (3) si le pilot veut un juge pour les dépôts.
