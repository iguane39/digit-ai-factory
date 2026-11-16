# Retours forges — Produit-79 — 20261112e

- **Contexte** : le 12/11/2026, l'exploitant demande de noter, pour le projet et pour la Factory, que GitHub n'est pas fiable pour publier à l'heure sur les réseaux sociaux, et de proposer une solution de référence
- **Références ledger** : `forge\ledger.jsonl` seq 1217 (entrée `type: retour`) ; décision du projet seq 1216 ; réponses D-992 (b) et D-993 (b) seq 1213 et 1214
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Un geste qui doit partir à une heure précise ne tient pas sur GitHub Actions : sa planification saute des passages, et un runner qui attend coûte des minutes sans alerte de plus.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-29 — publication à l'heure confiée à GitHub Actions | majeur | générique | Le 20/10/2026, la planification `schedule` de GitHub n'a tourné qu'une fois sur 18 pour les publications Instagram du produit (en-tête de `.github/workflows/reseaux-echeances.yml`) ; l'exploitant a alors réservé à Railway « tout ce qui est à l'heure » (D-128 a, ledger seq 725). Le 12/11/2026, une session l'a oublié : elle a confié la garde et l'Instagram du soir à un workflow GitHub qui attend l'heure dans un runner (`reseaux-echeances-du-jour`, 15h56), et ce workflow avalait l'erreur d'une échéance (corrigé à 16h10). L'exploitant l'a relevé à 16h28 ; à 17h11, le passage GitHub est annulé et Railway reprend la soirée. | Règle qui aurait évité le retour : D-128 (a), décision de ce produit, que rien ne rappelait au moment d'écrire le workflow ; classe à créer `geste-a-l-heure-sur-github` (famille `hook-ou-gate`). Solution de référence proposée : tout geste à l'heure passe par un planificateur hébergé dédié (ici des tâches Railway en cron), qui se replanifie à chaque passage pour les jours suivants ; un second service « filet », à heures décalées du premier (ici :15 et :45 contre :00 et :30), rattrape les replanifications manquées et les ajouts du jour ; GitHub ne garde que le code, la préparation, la relecture et la fusion. Garde-fou proposé : un contrôle qui refuse, dans un workflow GitHub de produit, un `schedule` ou une attente (`sleep`) qui porte une publication. |

## Rattachement

Registre interrogé le 12/11/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 7 178 entrées dont le texte répond à `/github.{0,60}(schedule|cron|planification|planifi)/i` → 2 lignes trouvées.

Items recoupés :

- TF-2298 (décidé, forge-tests) : chaque workflow GitHub planifié est déclaré « trigger-non-cable » en bloquant. Il juge qu'un déclencheur planifié existe, pas qu'il est fiable ni qu'il porte un geste à l'heure : RP-29 en est le prolongement côté exploitation.

## Remarques restées au produit

Ce chapitre dit ce que le produit garde chez lui, et pourquoi.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le workflow `reseaux-echeances-du-jour` jouait une échéance à l'heure sur GitHub, contre D-128 (a) | retiré le 12/11 à 17h13 (demande de fusion n° 7) ; le filet Railway passe toutes les 30 minutes en journée, à :15 et :45 | oui pour la règle, remontée en RP-29 ; non pour le réglage de Railway | corrigée au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot.

## Documents mûrs

Trois documents mûrs, mesurés par le contrôle du lot ; verdicts repris du lot 20261112a :

- « Guide - E-mail de la veille d'arrivée », 9 versions datées. Verdict : reste au produit, parce qu'il décrit un modèle d'e-mail de la plateforme de réservation propre à ce produit, sans forme générique à verser au catalogue.
- « Guide - E-mails Beds24 en HTML », 7 versions datées. Verdict : reste au produit, pour la même raison, déjà déclarée au lot 20261110a.
- « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le planning Railway a été calculé à blanc avant d'être posé, puis relu par l'API : les tours de 17h30 et 19h00 étaient en place avant l'annulation du passage GitHub, sans aucun trou.
