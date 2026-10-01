# Retours forges — Produit-03 — 20260929a

- **Contexte** : incident de mise en production du 29/09/2026. L'application de l'infrastructure de
  production (exécution 15452) a créé 10 ressources sur 11, puis échoué sur un budget dont la date de
  début, écrite en dur, était périmée. Le correctif a été jugé par le contrôle de mise en forme
  standard de Terraform, et par un oracle de date écrit pour l'occasion, faute d'oracle au registre
  pour ce domaine.
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

## `pilot` — un domaine sans oracle au registre : la configuration d'infrastructure

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-48 | bloquant | produit+générique | **Une date d'effet écrite en dur a périmé avant son application.** Le fichier de variables de production portait `budget_start_date = "2026-08-01T00:00:00Z"`, écrit pour une mise en production prévue le 26/08. Appliqué le 29/09, il a été refusé : `400 (400 Bad Request) … Start date for monthly time grain should not be prior to current month` (requête `f3a6412d-3be5-439d-992d-90e8ba9a6c64`). La valeur était juste le jour où elle a été écrite ; rien ne l'a rejugée contre la date d'application. **Même défaut en juillet** sur la qualification (commit `4ed10bd` du 23/07) : la correction avait déplacé la date dans un fichier par environnement, sans la calculer, et la classe est restée ouverte. **Chez les voisins, mesuré le 29/09** : 3 produits sur 4 écrivent la même date en dur ; 1 seul la calcule à la création, `formatdate("YYYY-MM-01'T'00:00:00'Z'", timestamp())` avec `ignore_changes`. **Aucun oracle du registre ne juge une configuration d'infrastructure** : `registre-oracles.md` (v2.30.0) ne porte aucune ligne pour Terraform, un fichier de variables ou une infrastructure. Les seuls contrôles du fichier étaient ceux de la chaîne, `terraform fmt -check -recursive`, `terraform validate` et le plan relu, et aucun ne juge une valeur contre la date où elle s'appliquera. Deuxième fait du même tour : la première écriture du correctif rendait `fmt -check` à 3, un commentaire ayant coupé le groupe d'alignement ; elle aurait fait échouer le plan, et seul un passage local du contrôle standard l'a arrêtée | Inscrire au registre un domaine « Configuration d'infrastructure (Terraform) » : l'oracle standard `terraform fmt -check -recursive` puis `terraform validate` (R3, standards avant maison), plus une règle maison qui juge toute valeur datée d'une configuration contre la date d'application. Banc de la règle maison, joué le 29/09 : août au 29/09 `REFUSÉE`, septembre au 29/09 et au 30/09 `ACCEPTÉE`, septembre au 01/10 `REFUSÉE`, étalonnée sur 4 faits d'Azure connus (juin refusé en juillet, juin et juillet acceptés à leur mois). Pour la classe, prescrire la forme calculée à la création plutôt qu'une date écrite |

## La règle qui aurait évité le retour

Aucune règle existante ne couvre ce retour : ni le socle, ni un gabarit, ni un oracle du registre ne
juge une configuration d'infrastructure. C'est le cas que la règle § 4 de `quality-oracles` traite
(domaine sans oracle → en définir un), et le domaine est défini dans la proposition de `RA-48`.

La classe n'existe pas au référentiel. Elle est proposée dans la famille `donnees-perissables-en-dur`,
voisine de `compte-cite-en-dur-perime`, qui porte sur un document et non sur une configuration :
clé `date-d-effet-en-dur-perimee-a-la-creation`, libellé « Une date d'effet écrite en dur dans une
configuration périme avant la création de la ressource : valide le jour où on l'écrit, refusée le
jour où on l'applique ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La date de début du budget de production était périmée | correctif urgent d'une ligne, `2026-09-01T00:00:00Z`, commit `64ffc77` sur une branche issue de la production, en attente de l'accord du commanditaire | oui | remonté en `RA-48` ; la forme calculée à la création attend une décision du commanditaire |
| Trois produits voisins écrivent la même date en dur | constat inscrit pour le projet commun Client-A, qui tient le guide des produits (`RPC-14`, à transmettre) | oui | remonté en `RA-48`, sans nommer les produits voisins |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les pièces du jour sont une
restitution, qui suit `gabarits\RESTITUTION.md`, un correctif de configuration et une ligne du
registre de retours au projet commun.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de
`output\` repris cinq fois et plus, et aucun lecteur n'a rendu de verdict sur une forme depuis le lot
précédent.

## Confirmations positives

- Le contournement de la correspondance d'adoption du 28/09 (commit `c571df4`) a tenu en conditions
  réelles : « adoption : azurerm_resource_group.rg », puis « Import successful! » (exécution 15452).
- La garde du nombre de créations a lu le bon compte : « Plan : 11 creation(s) proposee(s) ».

## Ordre recommandé

1. `RA-48`, la règle maison d'abord : elle se joue sans état ni accès à Azure, sur le seul fichier
   de variables, et elle aurait arrêté l'incident avant l'approbation du plan.
