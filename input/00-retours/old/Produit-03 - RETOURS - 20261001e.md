# Retours forges — Produit-03 — 20261001e

- **Contexte** : remontée §4 du registre des oracles. Le 01/10/2026, le produit a défini 2 oracles pour 2 domaines qui n'en avaient pas, en traitant le retour `RA-60` (lot `20261001d`). La loi qualité veut qu'un oracle défini soit remonté au registre ; ce lot les remonte.
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026, au sas d'arrivée du pilot

> **Note de réception du pilot, 01/10/2026.** Après l'accueil, le titre portait encore le nom de ce produit, écrit avec ses accents et suivi du pseudonyme de son client : l'accueil ne reconnaît une clé de produit qu'écrite sans accent (TF-1456). Le pilot l'a remplacé par Produit-03 avant l'ingestion. Le reste du texte est celui du producteur.
>
> Les 2 retours de ce lot portaient comme classe « skill-ou-oracle-non-invoque », qui est le nom d'une famille du référentiel, et l'ingestion les refusait. Le pilot leur a donné la classe de cette famille qui décrit leur cas, « oracle-remplace-par-controle-maison » : un producteur écrit son propre contrôle faute d'oracle au registre, et le lot en demande l'inscription. Le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — 2 domaines sans oracle, 2 oracles définis chez le produit

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-61 | majeur | produit+générique | **Le formulaire Entra de la première visite n'avait aucun oracle.** Le 30/09, une livraison de production a été déclarée réussie, alors que son adresse répondait `AADSTS700038`, sans formulaire (`RA-57`). Le 01/10, rien ne permettait de savoir, avant d'envoyer quelqu'un à l'adresse, si le formulaire s'y afficherait. Le produit a écrit `infra/verifier-formulaire-entra.sh <adresse>`. Il lit la redirection d'Easy Auth, puis sonde l'autorisation Entra avec `prompt=none`. Entra ne renvoie `login_required` vers le site que si l'identifiant et l'adresse de retour sont reconnus. Le script lit ensuite le consentement de l'organisation. Joué le 01/10 sur 4 adresses : production, « aucun formulaire possible » (identifiant factice, `AADSTS700038`) ; qualification par son domaine public et développement, « accès ouvert » ; accès direct de qualification, HTTP 403. Non jugé, et déclaré : l'approbation, quand `az` n'est pas connecté. Écart au standard §3 : la sortie est du texte, pas le JSON commun | Inscrire au registre le domaine « authentification Entra par Easy Auth — le formulaire de la première visite », avec cet oracle comme candidat, et porter sa sortie au JSON commun. Une note de méthode : un navigateur Chrome déclenche un autre parcours d'Entra (`AADSTS50168`), et la sonde doit se présenter comme Firefox |
| RA-62 | majeur | produit+générique | **La demande à une équipe tierce n'avait aucun oracle.** La forme de `RA-59` (5 parties, exclusions) était jugée à la lecture. Le produit a écrit `scripts/controler-demande.mjs <fichier> --noms <liste>`. Il juge le premier bloc de texte de la demande : les 5 parties dans l'ordre ; un « Pourquoi » qui dit le symptôme d'aujourd'hui et ce que l'objet change ; aucun motif exclu ; et le transfert à une chaîne d'un geste que l'équipe fait elle-même (`RA-60`). Mesuré le 01/10 : la demande d'inscription est jugée conforme sur 16 contrôles. La demande retirée le même jour est refusée sur ce transfert. Un témoin écrit pour l'occasion est refusé sur 3 écarts. Non jugé, et déclaré : les noms de personnes, sans liste `--noms`. Écart au standard §3 : la sortie est du texte, pas le JSON commun | Inscrire au registre le domaine « demande remise à une équipe tierce », avec cet oracle comme candidat, et porter sa sortie au JSON commun. La liste des noms à exclure se lit chez chaque produit, et ne s'écrit pas dans l'oracle |

## La règle qui aurait évité le retour

Aucune règle n'a manqué : la loi qualité prescrit déjà de définir un oracle pour tout domaine qui n'en a pas, puis de le remonter au registre. Ce lot est cette remontée.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les 2 oracles ont été appliqués avant d'être remontés | remontés par ce lot, le jour même | non | ordre rétabli, sans effet sur leurs verdicts |
| La procédure de l'exploitant n'appelait aucun contrôle avant la visite de l'adresse | l'étape 3 appelle `infra/verifier-formulaire-entra.sh` | oui | remonté ci-dessus en `RA-61` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les 2 oracles sont des scripts du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus.

## Confirmations positives

- Le registre dit où inscrire un oracle porté par un produit : sa section « Oracles portés par un engagement » en fixe la forme.

## Ordre recommandé

1. `RA-61` : son domaine est celui d'un défaut qui a déjà fermé un site de production au public.
2. `RA-62` : son domaine a coûté 3 retours humains en un jour.
