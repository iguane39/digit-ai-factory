# Retours forges — Produit-85 — 20261024a

- **Contexte** : incident — un calcul photogrammétrique de 612 photos perdu au redémarrage de Docker Desktop le 24/10/2026, puis demande humaine du même jour : « Remonte le problème de persistance des fichiers Docker dans un volume Docker à la Factory pour que cela ne se reproduise plus. Ce problème aurait dû remonter de lui-même à la Factory, c'est aussi un problème à remonter à la Factory pour que les remontées soient meilleures. » Le lot reprend aussi les cinq retours du ledger restés sans lot depuis le 22/10.
- **Références ledger** : `forge\ledger.jsonl` seq 11, 12, 15, 20, 38, 40, 41 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 24/10/2026

---

## pilot (`digit-ai-factory`)

Un service à état lancé par le produit a perdu trois heures de calcul faute de volume. Le défaut n'est pas remonté de lui-même : la restitution a déclaré « rien à remonter » et les retours du ledger dormaient sans lot.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 — conteneur à état sans volume | bloquant | produit+générique | 24/10/2026 : le conteneur NodeODM `apdlb-nodeodm` tournait sans volume. Le README ne portait que `docker start apdlb-nodeodm`, et la commande de création n'était écrite nulle part : sur ce poste, le conteneur a été recréé à la main, sans volume. À 19:59:42, le journal de Docker Desktop porte « engine linux/wsl shutdown requested », puis « selected recovery action: Restart ». Le conteneur sort en code 255 (`OOMKilled` faux), et au retour `/task/list` rend `[]` : la tâche de 612 photos, à 7 % après 3 h, est perdue. Corrigé au produit : volume nommé `apdlb-nodeodm-data`, `--restart unless-stopped`, commande de création écrite au README. | Règle qui aurait évité le retour : aucune ne le couvre, d'où la clé proposée. **RP-1** : clé proposée `conteneur-a-etat-sans-volume`, famille `contrat-interface-forge`, libellé « Un service à état lancé par la chaîne d'un produit (conteneur local ou géré) garde ses données de travail dans sa couche éphémère : un redémarrage du moteur efface le travail en cours ». Piste : `COMPOSANTS-OPS` déclare pour chaque composant à état son volume et la commande qui le crée, et un oracle refuse un `docker run` d'un composant à état sans `-v` ni `--mount`. |
| RP-2 — remontée déclarée nulle après la correction | majeur | générique | 24/10/2026 : la restitution du tour qui recréait le moteur avec un volume a écrit « Remontée à la factory : rien à remonter ». `node forge/hooks/factory.mjs restitution --prejuger` l'a rendue affichable, et le hook de fin de tour l'a laissée passer. Le défaut n'est monté qu'après la demande humaine citée en tête. La correction ne touchait pas un fichier de la session mais un conteneur : le hook S48 cherche une correction dans le dossier du tour et ne voit pas une correction d'infrastructure. | Récidive de la classe `remontee-declaree-nulle-apres-correction` (TF-1643, TF-1644). Règle qui aurait évité le retour : S48 de `gabarits/RESTITUTION.md` 2.37.0, qui ne lit que les fichiers. Piste : S48 lit aussi les commandes du tour (`docker rm`, `docker run`, recréation, redémarrage de service) comme une correction. |
| RP-3 — retours du ledger jamais compilés | majeur | générique | Cinq entrées `type: retour` du ledger (seq 11, 12, 15, 20, 38), dont la première date du 22/10/2026 à 08:31, n'avaient jamais été mises en lot avant ce lot. Aucune ouverture ni fin de tour ne l'a signalé. Leurs cinq classes (`brief-charte-perimee`, `oracle-bande-defilante-comptee-debordement`, `ledger-type-go-publication-absent`, `ledger-aide-ecrite-comme-entree`, `outil-ledger`) n'existent pas dans `todo/CLASSES.json` du pilot : le lot aurait été refusé tel quel, et `forge/ledger.py` les a écrites sans contrôle. | Règle qui aurait évité le retour : la remontée automatique du `CLAUDE.md` du produit, qui n'a pas d'oracle ; TF-1758 ne lit que les lots déjà écrits. **RP-3** : clé proposée `retour-de-ledger-jamais-compile`, famille `tracabilite-ledger`, libellé « Un retour consigné au ledger d'un produit reste sans lot, et rien ne compte les retours en attente ni ne valide leur classe ». Piste : le hook d'ouverture compte les `type: retour` sans lot, et `forge/ledger.py retour` refuse une classe absente du référentiel du pilot. |
| RP-4 — `--help` écrit une entrée au ledger | mineur | générique | `python forge/ledger.py reponse_humain --help` a écrit `{"help": true}` au ledger le 22/10/2026 (seq 20, retirée à la main), puis de nouveau le 24/10/2026 à 13:43Z (seq 37, retirée à la main avant commit, consignée en seq 38). | Complément de TF-1204 et TF-1366, qui portent d'autres arguments mal lus. Règle qui aurait évité le retour : aucune ne le couvre. **RP-4** : clé proposée `outil-qui-ecrit-sur-son-option-d-aide`, famille `tracabilite-ledger`, libellé « Un outil d'écriture de registre traite son option d'aide comme une donnée et écrit une entrée au lieu d'afficher l'usage ». Piste : `--help` et `-h` affichent l'usage et sortent sans écrire. |
| RP-5 — type `go_publication` refusé | mineur | générique | Le `CLAUDE.md` du produit prescrit une entrée `go_publication` au ledger pour le feu vert de publication (R-38). `forge/ledger.py` refuse ce type (liste fermée) : le feu vert a été consigné en `reponse_humain` avec un champ `go_publication` (seq 14, 22/10/2026). | Classe `regle-qui-interdit-son-propre-remede`. Règle qui aurait évité le retour : R-38, dont l'outil ne connaît pas le type qu'elle prescrit. Piste : `go_publication` entre dans la liste des types de `gabarits/ledger.py`. |

## digit-ai-forge-agents (`digit-ai-forge-agents`)

Deux retours du 22/10/2026 sur des skills de cette forge, restés au ledger sans lot.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 — brief à la charte périmée | majeur | générique | Le brief APDLB du 22/10/2026 impose Roboto et DM Sans (paramètre D31). Or `digit-ai-page-html` aligne les pages sur Montserrat et Inter depuis la v1.25.0 du 23/09/2026 (D-5 (a)). Le producteur a dû trancher contre le brief (ledger seq 11). | Classe `boucle-retour-sans-descente` : la correction de charte n'est pas redescendue dans `forge-brief`. Piste : `forge-brief` lit les polices dans le skill du socle au lieu de les écrire en dur. |
| RA-2 — bande de sommaire comptée comme débordement | majeur | générique | `render_page.py` V1 compte comme débordement bloquant une bande de sommaire à défilement horizontal (`overflow-x: auto`) sous 900 px, alors que la bande repliable est le geste prescrit par L25. Contourné par `flex-wrap` (ledger seq 12, 22/10/2026). | Classe `regle-qui-interdit-son-propre-remede` : V1 refuse ce que L25 prescrit. Piste : V1 exclut d'elle-même la bande de sommaire déclarée. |

## Rattachement

Registre interrogé le 24/10/2026 : `python -I -X utf8 cherche.py` → 49 ligne(s) trouvée(s), sur `todo/TODO.jsonl` du pilot, sans borne, avec cinq motifs :

- `/docker|conteneur|nodeodm/i` → 31 lignes ;
- `/rien (a|à) remonter|S48|remont\w* (automatique|de fin)|retours? (du|au) ledger|ledger.{0,30}type: ?retour/i` → 7 lignes ;
- `/ledger\.py|go_publication/i` → 7 lignes ;
- `/bande.{0,30}(d[ée]fil|sommaire)|d[ée]filement horizontal/i` → 4 lignes ;
- `/brief.{0,80}(roboto|charte|police|montserrat)|(roboto|montserrat).{0,80}brief/i` → 0 ligne.

Items recoupés :

- TF-1643 et TF-1644 (candidats, S48 et « rien à remonter ») : RP-2 en est la récidive ;
- TF-1048 (candidat, écart au socle remonté seulement après relance humaine) et TF-1166 (candidat, obligation d'émettre restée sans exécution) : RP-2 et RP-3 les recoupent ;
- TF-1204 et TF-1366 (candidats, `forge/ledger.py` qui écrit sur des arguments mal lus) : RP-4 les complète ;
- TF-1113 (COMPOSANTS-OPS ne dit pas l'usage) et TF-1805 (restauration d'un conteneur Docker local) : voisins de RP-1, sans le recouper ;
- aucun item pour RP-5, RA-1 et RA-2 : les 4 lignes du motif « bande » portent sur V9, V15 et l'en-tête collant, pas sur V1.

Les 29 autres lignes du motif « docker » portent sur des conteneurs CSS de pages HTML ou sur des images de chaîne, jamais sur les données d'un service à état.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le moteur NodeODM tournait sans volume | conteneur recréé avec le volume `apdlb-nodeodm-data`, commande de création écrite au README | oui | remonté en RP-1 |
| Le script de traitement lisait la configuration de Vessey et aurait nommé les résultats de Bray « APDLB » | option `--site` ajoutée à `apdlb-traitement`, test `test_nom_livrable_suit_le_site` (22 tests passent) | non | code propre au produit |
| Un téléchargement d'image Docker figé une heure sans le dire | arrêté, relancé avec l'heure à chaque ligne | non | incident de réseau du poste |
| La veille du PC a suspendu le calcul deux heures | processus d'éveil limité à la durée du calcul | non | réglage du poste |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le journal de Docker Desktop a nommé la cause de l'arrêt (« engine linux/wsl shutdown requested ») : la perte se diagnostique sans supposition.
- `uv run apdlb-ingestion` a copié et vérifié 685 photos sur un lien USB instable, 0 échec d'empreinte.

## Ordre recommandé

1. RP-1 : le défaut a coûté trois heures de calcul et se reproduit chez tout produit qui lance un service à état.
2. RP-3 puis RP-2 : sans eux, le prochain RP-1 dormira de nouveau au ledger ou sera déclaré nul.
3. RA-1 et RA-2, puis RP-5 et RP-4.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Chaque ligne nomme sa règle dans « Proposition esquissée ». Trois clés nouvelles sont proposées :

- **RP-1** : `conteneur-a-etat-sans-volume`, famille `contrat-interface-forge`, « Un service à état lancé par la chaîne d'un produit (conteneur local ou géré) garde ses données de travail dans sa couche éphémère : un redémarrage du moteur efface le travail en cours » ;
- **RP-3** : `retour-de-ledger-jamais-compile`, famille `tracabilite-ledger`, « Un retour consigné au ledger d'un produit reste sans lot, et rien ne compte les retours en attente ni ne valide leur classe » ;
- **RP-4** : `outil-qui-ecrit-sur-son-option-d-aide`, famille `tracabilite-ledger`, « Un outil d'écriture de registre traite son option d'aide comme une donnée et écrit une entrée au lieu d'afficher l'usage ».
