# Retours forges — Produit-12 — 20260831c

- **Contexte** : retour utilisateur du 2026-08-31 sur les champs de dates de l'écran de
  génération (« si tu mets des champs date, il devrait y avoir un datepicker ; le "jusqu'au"
  doit afficher la date du jour ; le "depuis le", idéalement la dernière fois, sinon quelque
  chose d'intelligent »), corrigé chez le produit dans la même session, **et mandat humain de
  généralisation** : porter le principe à tous les types de champs de saisie, de format et de
  contexte, pour faciliter toutes les saisies.
- **Références ledger** : `forge\ledger.jsonl` seq 103 (le correctif produit), seq 104 (le
  retour), seq 105 (la remise)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-08-31 dans la boîte d'entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : la série RV s'arrêtait à RV-4 (lot 02).

---

## forge-design (`digit-ai-forge-design`)

Le cas mesuré tient en une phrase : un écran **promettait** en texte d'aide un comportement
(« la période part de la dernière lecture ») que **rien ne câblait dans les champs** — deux
dates vides, sans valeur proposée, sans borne, sur une donnée que le système connaissait.
L'utilisateur l'a vu en une capture d'écran.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-5 | majeur | produit+générique | **Aucun référentiel de la forge ne dit qu'un champ de saisie doit être TYPÉ à son format, PROPOSÉ selon son contexte et BORNÉ par son sens — chaque écran improvise, et le produit vient d'en payer un cas complet.** Mesuré sur l'écran de génération d'Produit-12 (retour utilisateur du 2026-08-31, capture à l'appui) : deux champs `type="date"` rendus VIDES avec pour seule aide « Vide : la lecture remonte aussi loin que la boîte le permet », alors que (1) le système connaissait la dernière position de lecture (curseurs par dossier, affichés en texte à trois lignes des champs) et ne la proposait pas ; (2) « Jusqu'au » acceptait une date future — le courrier ne vient pas du futur ; (3) la promesse d'aide « la période part de là » n'était pas câblée : vérifié dans le code, le curseur n'était JAMAIS appliqué à la lecture, champ vide = tout lire. Le même dépôt contenait pourtant le bon motif ailleurs : les trois écrans de statistiques préremplissent leurs dates (valeur servie par le serveur) — mais sans borne `max`. Deux écrans du même produit, deux conventions, aucun référentiel pour trancher. Correctif produit livré le jour même : valeur proposée = dernière lecture (la plus ancienne des boîtes affichées) sinon 3 mois, fin = aujourd'hui, `max` = aujourd'hui sur les deux champs, garde serveur sur la période inversée, 4 tests | Verser au référentiel de la forge (maquette, exigences d'interface, oracle) la règle **« typé, proposé, borné »**, applicable à TOUT champ : **typé** — un format connu prend son type d'entrée natif (date → sélecteur de date, nombre → `number` avec `step`, courriel → `email`), jamais un texte libre ; **proposé** — la valeur par défaut est la meilleure hypothèse du système selon le contexte (une fin de période = aujourd'hui ; un début = la dernière position connue, sinon une profondeur métier justifiée — 1/3/6 mois selon le cas ; un port = celui du protocole ; une périodicité = la valeur d'usage), et une promesse faite en texte d'aide DOIT être câblée dans le champ ; **borné** — `min`/`max` posés par le sens (pas de date future quand le passé seul a un sens, pas de zéro quand la valeur est une période), bornes cohérentes entre champs liés, et garde serveur symétrique (le client propose, le serveur garantit). Et un **contrôle** : à la maquette comme à l'implémentation, un champ au format connu non typé, ou un champ date sans valeur proposée ni borne, est un défaut nommé — à motiver quand le vide est un sens (« vide = tout ») |

## Remarques restées au produit

Deux constats restent chez le produit, chacun avec son verdict de généralisation écrit.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'écran de génération : champs de dates vides, sans proposition ni borne, promesse d'aide non câblée | `periode_proposee()` (dernière lecture → aujourd'hui, 3 mois en première lecture), `value` + `max` sur les deux champs, garde serveur période inversée, textes d'aide réécrits, 4 tests neufs — suite complète verte | oui | c'est le cas fondateur de RV-5 ci-dessus, remonté avec sa mesure |
| Les trois écrans de statistiques (courriels, stockage, IA) préremplissent leurs dates mais n'ont pas de borne `max` — une date future y est saisissable pour un rapport qui compte le passé | non corrigée dans ce lot : alignement au prochain run de version, avec la grille RV-5 si la forge la verse d'ici là | non (le cas est déjà porté par RV-5) | même classe que RV-5 ; le relevé exhaustif des templates du produit est fait, ces trois écrans sont les seuls autres porteurs de dates |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot —
vérifié par la session du 2026-08-31.

## Confirmations positives

Deux choses ont bien fonctionné et méritent d'être dites.

- **Le type d'entrée natif suffit au sélecteur de date** : les champs étaient déjà
  `type="date"` (sélecteur du navigateur, sans JavaScript) — le manque n'était pas le
  composant, mais la valeur proposée et les bornes. La règle RV-5 n'appelle aucune
  bibliothèque : elle s'implémente en attributs HTML et en contexte serveur.
- **Le motif « valeur servie par le serveur » des écrans de statistiques a tenu** : c'est lui
  qui a servi de modèle au correctif — la bonne pratique existait dans le produit, il ne lui
  manquait qu'un référentiel pour devenir la norme.

## Ordre recommandé

Un seul retour ; l'ordre interne de sa proposition va du moins cher au plus structurant.

1. **RV-5** — la grille « typé, proposé, borné » d'abord (un référentiel court), le contrôle
   ensuite : sans le contrôle, la grille restera une prose que les écrans suivants oublieront —
   c'est exactement ce que ce produit vient de mesurer avec sa propre aide de champ.
