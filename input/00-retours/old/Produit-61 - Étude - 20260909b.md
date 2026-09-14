---
role: étude à l'usage du pilot — pourquoi la construction a laissé passer ce que l'audit trouve
destinataire: humain
sources_de_verite: ["forge/etapes/audit/output/00 - Rapport d'audit/rapport-data.json", "forge/ledger.jsonl", "CLAUDE.md du pilot (contrat « prêt client »)", "ETAPE-MEP.md du pilot"]
verifie_le: 2026-09-09
---

# Pourquoi la construction a laissé passer ce que l'audit trouve

Cette étude répond à une question posée par le commanditaire du produit : la même maison a construit l'application et l'audite, et l'audit remonte des remédiations que la construction aurait dû éviter. Le lecteur y trouve le fait chiffré, trois causes mesurées, ce qui n'est pas imputable à la construction, ce qui a bien tenu, et quatre pistes de correction pour le pilot.

## Le fait

La construction s'est déroulée en cinq étapes, toutes closes avec leurs oracles au vert et le contrat de fin de construction tenu. Quatre jours plus tard, le référentiel d'audit de la même maison, appliqué au même produit, rend le verdict suivant sur ses 175 contrôles.

| Verdict | Contrôles |
|---|---|
| conforme | 36 |
| partiel | 49 |
| non conforme | 76 |
| sans objet motivé | 14 |

Douze contrôles de criticité fatale ne sont pas tenus. Aucun de ces écarts n'a été signalé pendant la construction, et aucun oracle de construction n'a rendu autre chose que PASS aux étapes correspondantes.

## Cause 1 — le contrat de fin de construction ignore le référentiel d'audit

Le contrat qui autorise à déclarer un produit prêt tient en six termes : oracles des trois premières étapes au vert, audit de couverture de test en sortie acceptable, oracle de mise en production complet, dossier de mise en production complet, traçabilité des exigences vers les tests à cent pour cent, journal de bord vérifié.

Aucun de ces six termes ne touche aux 175 contrôles du référentiel d'audit. Un produit peut donc franchir toutes les portes de la maison et échouer 125 contrôles de la même maison, sans qu'aucune contradiction ne se voie. Le déroulé du run le confirme : ses cinq étapes sont conception, design, développement, tests, mise en production. **Il n'existe pas d'étape d'audit.**

## Cause 2 — cinq dimensions n'ont aucun propriétaire dans le run

Le tableau se lit ligne par ligne : une dimension du référentiel, le nombre d'écarts qu'elle porte, et l'étape de construction qui aurait dû la couvrir. La dernière colonne est la seule qui compte.

| Dimension | Écarts | Étape qui aurait dû la couvrir |
|---|---|---|
| Observabilité et journaux | 12 | aucune |
| Coûts et gestion financière | 9 | aucune |
| Performance et charge | 8 | aucune |
| Principes data by design | 8 | aucune |
| Gouvernance de l'intelligence artificielle | 3 | aucune |
| Sécurité applicative | 11 | développement |
| Exploitation | 9 | mise en production |
| Conformité et intelligence artificielle | 11 | conception |
| Modèles et prompts | 6 | développement |
| Identités et secrets | 6 | développement et mise en production |
| Chaîne de livraison | 6 | mise en production |
| Architecture | 7 | conception et développement |
| Périmètre et valeur | 6 | conception |
| Données | 5 | développement |
| Tests | 5 | tests |
| Interface et accessibilité | 5 | design |
| Documentation | 4 | ouverture et toutes étapes |
| Schéma de base de données | 4 | développement |

Quarante écarts sur cent vingt-cinq, soit près d'un tiers, appartiennent à des dimensions qu'aucune étape du run ne regarde. Ce n'est pas une négligence de session : rien dans le déroulé ne prévoit de les regarder.

Le plus frappant est ailleurs : la maison possède déjà une forge de données et une forge d'observabilité, toutes deux déclarées à jour à l'ouverture du run. Sur quatorze forges déclarées, cinq n'ont jamais été mobilisées, dont ces deux-là et la forge d'audit elle-même, ouverte seulement aujourd'hui et sur signalement humain.

## Cause 3 — la doctrine de construction contredit le référentiel d'audit

Trois contradictions portent sur des contrôles de criticité fatale. Dans les trois cas, la construction a fait exactement ce que la doctrine prescrit, et l'audit le classe en défaut.

- **Le déploiement.** La doctrine de mise en production déclare pour ce produit une route manuelle à porte humaine, et le produit l'a suivie. Le contrôle de chaîne de livraison exige que tout déploiement transite exclusivement par un pipeline automatisé produisant un journal immuable. Suivre la doctrine, c'est échouer au contrôle.
- **La sauvegarde des données.** L'oracle de mise en production porte neuf contrôles : construction de l'image, santé, parcours, retour arrière applicatif, propreté de l'image, hôte historique, travail planifié, jalon de fraîcheur, page introuvable. Aucun ne regarde la sauvegarde ni la restauration des données. Trois contrôles fatals du référentiel l'exigent, sur trois dimensions différentes.
- **L'authentification.** Aucune règle de construction n'impose un fournisseur d'identité central ni un second facteur ; le référentiel l'exige en criticité fatale pour tout accès humain.

## Ce qui n'est pas imputable à la construction

L'honnêteté de cette étude tient à cette section. Une dizaine d'écarts ne pouvaient pas être tenus au moment de construire, et les compter à charge fausserait le diagnostic.

- Les contrôles qui exigent un usage réel : valeur métier démontrée par des résultats mesurés, essai par un utilisateur représentatif, revues périodiques tenues, adoption relevée. Un produit qui n'a jamais servi ne peut pas les satisfaire.
- Les contrôles qui attendent la production : environnement de production distinct, promotion tracée d'un environnement au suivant, transfert vers une équipe d'exploitation.

Restent environ cent quinze écarts qui relèvent bien de la construction.

## Ce qui a tenu, et pourquoi c'est la clé du diagnostic

Les dimensions où l'audit trouve le moins sont exactement celles où une forge dédiée est intervenue pendant la construction.

| Dimension | Résultat | Forge intervenue |
|---|---|---|
| Documentation | 5 conformes sur 9, aucun fatal | socle du pilot à chaque étape |
| Schéma de base de données | 5 conformes sur 9, toutes les contraintes exercées par violation | développement, avec l'ancrage au schéma réel |
| Interface et accessibilité | 3 conformes, 4 partiels, aucun fatal | design, oracles de rendu et de contraste |
| Modèles et prompts | 3 conformes dont les garde-fous d'entrée et de sortie et la supervision humaine | développement, sur la doctrine du skill dédié |

La règle se lit d'elle-même : **là où une forge a jugé, l'audit trouve peu ; là où aucune n'a jugé, l'audit trouve tout.** Le problème n'est pas la qualité des forges, il est leur mobilisation.

## Quatre pistes pour le pilot

Ces pistes sont des propositions, pas des décisions : elles engagent le déroulé de tout run et relèvent de la gouvernance du pilot.

1. **Faire entrer le référentiel d'audit dans le contrat de fin de construction**, soit par une étape d'audit avant le GO, soit par un septième terme au contrat. Sans cela, le vert de la construction continuera de ne rien dire sur l'audit.
2. **Faire du journal d'ouverture une déclaration de couverture** : pour chaque dimension du référentiel, la forge qui la porte, ou la mention « aucune » assumée. Le produit applique déjà ce principe à ses référentiels de mesure, où « absent » est une réponse valide et le silence est refusé. La même discipline, appliquée aux dimensions, aurait rendu visibles les cinq dimensions orphelines dès le premier jour.
3. **Trancher les trois contradictions** entre doctrine de construction et référentiel d'audit. Chacune se règle par une décision écrite : soit la doctrine change, soit le contrôle porte une dérogation motivée pour les produits de ce profil.
4. **Faire de l'audit un entrant du brief plutôt qu'un verdict de sortie.** Un produit qui connaît ses 175 contrôles avant la première ligne de code arbitre en connaissance de cause ; un produit qui les découvre après coup paie chaque écart deux fois, une fois en construction et une fois en remédiation.
