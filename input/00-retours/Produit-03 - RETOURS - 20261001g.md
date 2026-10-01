# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20261001g

- **Contexte** : sixième retour humain du 01/10/2026 sur le même sujet, en réponse à la décision `D-66`. Il complète les lots `20261001d` (`RA-60`) et `20261001f` (`RA-63`).
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 01/10/2026, au sas d'arrivée du pilot

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une étape de déploiement confiée à un script de la session, au lieu de la chaîne

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-64 | majeur | produit+générique | **Une étape de déploiement hors de la chaîne.** La restitution `20261001n` (13h51) posait `D-66`. Ses 3 options faisaient créer la fiche Entra par un script que la session lancerait elle-même : ouverture d'une autorisation, exécution, fermeture. Le commanditaire a répondu, après 13h51 : « 66 : Non, cette étape doit être dans le pipeline. Ajoute là au pipeline de prod et demande à Nicolas de rejouer uniquement l'étape manquante pour finaliser cette étape qui me permettra d'afficher ce formulaire. » Aucune option ne mettait l'étape dans la chaîne de production, rejouable par l'exploitant. Elle y est désormais : un paramètre de la chaîne de livraison ne compile que cet étage, et la chaîne compilée sans lui reste identique (aperçu Azure DevOps sur 3 environnements). Coût : 1 aller-retour de plus, le 7e du jour sur ce sujet | (1) **Règle d'écriture** : une étape de déploiement, ou de mise en service, vit dans une chaîne que l'exploitant rejoue ; une restitution ne propose jamais que la session la joue à sa place par un script. (2) **Contrôle** : une option de décision qui fait lancer un script de déploiement par la session, au lieu d'une chaîne, est signalée par l'oracle de restitution. (3) **Forme** : quand une étape manque en production, la proposer d'abord comme un étage rejouable seul, avec la preuve que la chaîne est inchangée sans lui |

## La règle qui aurait évité le retour

Aucune règle ne couvre ce retour. La loi n° 5 (voie automatique d'abord) pousse à faire par la session ce qui peut se faire automatiquement ; elle ne dit pas qu'une étape de déploiement se fait par la chaîne, pas par la session. La règle manquante : « automatique » signifie « dans la chaîne, rejouable », pas « par un script de la session ».


> **Note de réception du pilot (01/10/2026, avant ingestion).** Le sidecar propose une classe que le référentiel `todo/CLASSES.json` ne porte pas encore ; elles sont nommées ici, comme l'exige l'ingestion (TF-1128) :
> - `etape-de-deploiement-hors-de-la-chaine` (famille `restitution-forme`) : Une restitution propose qu une etape de deploiement ou de mise en service soit jouee par la session, par un script, au lieu d etre un etage de la chaine que l exploitant rejoue.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La fiche Entra se créait par une chaîne séparée et un script de la session | étage « Fiche Entra » de `deployment.yml`, paramètre `ficheEntra` ; chaîne 190 retirée ; demande de fusion 4025 fusionnée sur `env/prd` | oui | remonté ci-dessus en `RA-64` (1) |
| L'autorisation de la connexion partagée restait à ouvrir et fermer à la main | `infra/fenetre-connexion-partagee.sh`, avec une garde qui lit la chaîne avant d'ouvrir ; un guetteur la referme après l'exécution de l'exploitant | non | traité au produit |
| La demande à l'exploitant | dans la forme des demandes, jugée conforme par `scripts/controler-demande.mjs`, adressée par une mention dans la demande de fusion | non | traité au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les écrits en cause sont une restitution, une chaîne et une procédure du produit, sans gabarit de `gabarits\documents\`.

## Documents mûrs

Aucun document mûr sur ce lot : `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de `output\` repris 5 fois et plus.

## Confirmations positives

- L'aperçu de compilation d'Azure DevOps est un oracle fort pour une chaîne modifiée : il compile sans rien exécuter, et la comparaison des étages compilés avant et après prouve qu'un paramètre décoché ne change rien.

## Ordre recommandé

1. `RA-64` (1) : une règle d'écriture, à joindre à la loi n° 5.
2. `RA-64` (3) : la forme de la proposition.
3. `RA-64` (2) : le contrôle, à mesurer d'abord sur le corpus des restitutions.
