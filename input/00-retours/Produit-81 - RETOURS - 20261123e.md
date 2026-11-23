# Retours forges — Produit-81 — 20261123e

- **Contexte** : support de présentation Design Authority de Produit-81 (indices g et h du 23/11/2026), produit hors run ouvert.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 47 ; seq 48 ;` (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-34 (majeur) — Une passerelle d'API placée par recopie d'un brouillon, sans jugement d'architecture

**Le fait.** Le 23/11/2026, l'annexe « WAF et APIM en production » du support Design Authority de Produit-81 (indice f) plaçait l'APIM à trois endroits faux :
- entre le front et l'API de la même application ;
- en sortie, vers PRISM ;
- pour Voyager et la gestion des baux, dont les échanges passent par la Data Factory et ne sont pas des appels d'API.

La session avait repris la demande à Connectivity préparée le 16/10 et les actions du plan d'audit, sans les juger. Le porteur l'a relevé en précisant que cela aurait dû être vu sans lui : une APIM ne se place que devant une API appelée de l'extérieur de l'application.

**Le coût, prouvé.** Une recommandation d'architecture fausse dans un support destiné à la Design Authority, relevée par le porteur. Un indice de plus (h).

**La règle qui aurait évité le retour.** Une passerelle d'API se place devant les API consommées hors de l'application. Jamais entre les composants d'une même application, ni devant un flux de données qui n'est pas une API. Un brouillon ou une action de plan d'audit repris dans un livrable se juge avant d'être recopié. **Clé proposée** : `recommandation-recopiee-sans-jugement`, famille `gabarit-document`, libellé « Un livrable recopie une recommandation d'un brouillon ou d'un plan d'audit sans la confronter aux principes du domaine : l'erreur du brouillon devient une proposition présentée en instance ».

**Juge proposé.** Relecture outillée d'un livrable d'architecture : pour chaque flux marqué APIM, deux questions doivent être tranchées dans le texte ou ses notes. L'appelant est-il hors de l'application ? Le flux est-il un appel d'API ? Un « non » à l'une des deux est signalé.

## RT-35 (mineur) — Une annexe technique qui décrit le mécanisme sans l'usage

**Le fait.** Le 23/11/2026, le porteur relève que l'annexe Power BI (indices c à g) explique l'appel à l'API et le jeton d'intégration, sans dire ce que fait le rapport ni quelles données il affiche. Relevé fait ensuite : rapports paramétrés et libellés lus en base de développement (« Liste baux avec/sans contact CA »), menus et rôles lus dans le front. Le contenu est resté illisible : modèle hors dépôt, et l'API Power BI répond 401 (compte sans licence).

**Le coût, prouvé.** Un complément demandé par le porteur, fait dans le même indice que RT-34, sans coût séparé.

**La règle qui aurait évité le retour.** Un composant présenté à une instance de décision se décrit d'abord par ce qu'il apporte à l'utilisateur : ce qu'il montre, et à qui. Son mécanisme vient ensuite, et ce qui n'a pas pu être lu est dit. **Clé proposée** : `composant-decrit-sans-son-usage`, famille `gabarit-document`, libellé « Un livrable décrit un composant par son mécanisme technique sans dire à quoi il sert ni pour qui : le décideur ne peut pas juger de son utilité ».

**Juge proposé.** Contrôle de livrable : chaque annexe ou diapositive consacrée à un composant contient une rubrique d'usage (« ce que montre », « à quoi sert ») avant le mécanisme.

## Rattachement

Registre interrogé le 23/11/2026 : `todo/CLASSES.json` du pilot (331 classes). RT-34 : la plus proche, `note-de-relecteur-integree-sans-recompte`, vise une affirmation de relecteur intégrée sans vérification ; ici, c'est une recommandation d'architecture reprise sans jugement, d'où une clé neuve. RT-35 : aucune classe proche. Les deux en `classe-a-creer`.

## Remarques restées au produit

- Menu « Rapport CA déclaré » affiché aux locataires hors France alors que l'API le leur refuse (403) : anomalie du front, à corriger dans le produit — généralisable : non.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
