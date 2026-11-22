# Retours forges — Produit-12 — 20261122c

- **Contexte** : inspection production v0.9.0 — diagnostic de la rédaction des brouillons sans IA et plan de la version corrective 0.9.1, 22/11/2026 (décision D-83 (a))
- **Références ledger** : `forge\ledger.jsonl` seq 421, 422, 423, 424 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

Une fonction centrale du produit, la rédaction des brouillons par Claude, n'a jamais tourné du 08/08 au 22/11/2026 (seq 410). Les six étapes de fabrication ont rendu vert, parce que chacune mesurait un réglage, un format ou une présence au lieu de l'effet. Les quatre retours ci-dessous sont les causes génériques prouvées. RS-37 et RS-38 (lot 20261122a) couvrent déjà le repli silencieux et l'indicateur vide.

## tests (`digit-ai-forge-tests`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-40 | majeur | produit+générique | L'audit du 08/11 (`forge/etapes/tests/rapport-20261108.json`, `couverture_par_pan.prompts`) inventorie 15 modèles d'IA et n'en exerce aucun : ratio 0, seuil 1. Le verdict global PARTIEL (exit 3) a été accepté comme « acceptable documenté », et la 0.8.0 est partie en production alors que la rédaction par IA n'avait jamais tourné. Preuve : ledger seq 376, 410, 421 | Un pan à 0 % qui porte une fonction réglée en base comme centrale (un traitement d'IA actif) rend le verdict ÉCHEC, pas PARTIEL ; le rapport nomme le pan qui bloque |

## conception (`digit-ai-forge-conception`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-41 | majeur | produit+générique | Le code défaillant tient trois critères d'acceptation. E-041 demande « le modèle choisi par traitement est enregistré et affiché ». E-042 demande « l'appel est journalisé ». E-008 demande « un brouillon est créé à partir du template ». La configuration n'est jamais transmise au fournisseur, le journal compte « claude », et le modèle substitué tient E-008 ; `oracle-exigences` rendait 951 sur 951. Preuve : `forge/etapes/conception/EXIGENCES.json`, ledger seq 390, 410, 422 | Un critère d'acceptation porte sur l'effet observable d'un réglage, pas sur son enregistrement. `oracle-exigences` alerte sur un critère « enregistré et affiché » qui ne nomme aucun effet |

## ops (`digit-ai-forge-ops`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-42 | majeur | produit+générique | Les versions 0.8.1 et 0.9.0, cette dernière servie depuis le 08/11, sont passées en production sur un staging « oracle léger », sans audit ni qualification peuplée. Le smoke enregistre une boîte simulée et une clé d'IA factice, et le brouillon d'essai de l'activation a été relu pour sa présence, jamais pour son contenu. Preuve : ledger seq 386, 391, 400, 423 ; `forge/etapes/mep/smoke_staging.py`, lignes 31 et 42 | Une version qui touche une fonction d'IA ou le courrier ne passe jamais en oracle léger. Le smoke appelle une fois le vrai fournisseur réglé, à coût borné. Le contrôle d'activation compare le brouillon d'essai à son modèle |

## development (`digit-ai-forge-development`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-43 | majeur | produit+générique | Les fournisseurs simulés sont plus propres que le réel. Le mail simulé porte une date ISO (`mail_simule.py`, ligne 372), alors qu'OVH rend l'en-tête `Date` au format RFC 2822 (`mail_ovh.py`, ligne 334). La statistique des mails reçus vaut donc 0 en production. Le test de la règle d'échange interne prend un collègue du domaine de la boîte (`test_exigences_brouillons_boite.py`, ligne 645), alors que l'agence a deux domaines et que 41 brouillons sur 188 sont partis vers des collègues. Preuve : ledger seq 403, 406, 424 | Chaque fournisseur simulé rejoue des échantillons réels anonymisés de son homologue : formats de date, domaines, en-têtes. Une recette compare les sorties simulée et réelle sur les mêmes champs |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Cause du relevé des issues vide en production : la lecture IMAP du job fonctionne en local (178 envois en 12 s) | supervision des jobs, action P-11 du plan 20261122a | à confirmer | hypothèse, gardée au ledger hors du lot |
| Mesure « retouché » qui confond une retouche et une réponse écrite sans le brouillon (57 cas sur 62) | issue « réécrit », action P-12 | non | logique propre à la mesure du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de forge sur ce lot : le plan 20261122a est une proposition du produit.

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres BERNARD | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` |
| Exemple avant apres SAS CREER PROMOTION | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees BERNARD | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees SAS CREER PROMOTION | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

La lecture des envois par le connecteur du produit, en lecture seule (`BODY.PEEK`), a lu 178 messages sur 4 dossiers sans marquer un message comme lu : la précaution de l'exigence E-057 a tenu sur une boîte réelle.

## Ordre recommandé

1. RS-41, parce qu'un critère d'effet fait échouer à la conception ce que les autres étapes laissent passer.
2. RS-40, parce que le pan existe déjà et qu'il suffit de le rendre bloquant.
3. RS-42, puis RS-43.

## La règle qui aurait évité le retour

Aucun de ces retours ne suit une correction humaine : ils viennent du diagnostic. Les classes rattachées :

- RS-40 : `constat-non-bloquant-jamais-lu`, existante ;
- RS-41 : `controle-vrai-sur-le-mauvais-invariant`, existante ;
- RS-42 : classe à créer `mise-en-production-sur-porte-allegee` (famille `hook-ou-gate`) — une version qui touche une fonction centrale part sur une porte allégée, sans l'audit de sa chaîne ;
- RS-43 : classe à créer `simulateur-plus-propre-que-le-reel` (famille `contrat-interface-forge`) — un fournisseur simulé produit un format que le fournisseur réel ne produit pas, et les tests passent sur ce format.
