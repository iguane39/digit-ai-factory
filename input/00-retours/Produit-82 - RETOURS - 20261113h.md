# Retours forges — Produit-82 — 20261113h

- **Contexte** : le porteur constate le 13/11/2026 que le produit, après 2 runs, ne sert pas le public qu'il visait depuis le départ ; il demande d'identifier ce que l'initialisation a raté, de l'ajouter, de l'implémenter et de remonter le manquement et la façon de ne plus le rater ; run `Produit-82-20261110-version`, étape `version-20261113-usage-sans-code`.
- **Références ledger** : `forge\ledger.jsonl` seq 276, 277, 282, 283, 285
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-13

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Pilot et forge de conception, ouverture d'un produit

Le retour porte sur la façon dont l'intention d'un produit est saisie à son ouverture.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-42 | bloquant | générique | Le 13/11/2026, le porteur écrit : « il ne s'agit pas de développeur, mais d'utilisateurs basiques qui connaissent à peine les IAs. C'est tout l'objectif du projet ». Depuis le 14/10, le produit avait été conçu, construit et déployé pour des programmes. 7 manques, relevés dans `forge/etapes/version-20261113/BRIEF-DELTA.md`, section « Manques de l'initialisation du projet ». Les principaux : (1) les 4 rôles du référentiel et sa partie prenante client ne nomment aucun utilisateur final ; (2) la cascade 1.0.0 dit avoir reconstruit l'intention « depuis la fiche », elle-même tirée d'un brief écrit sur une analyse comparative de solutions, sans une phrase du porteur sur l'usage ; (3) « sans abonnement », le besoin économique, n'apparaît dans aucun des 13 besoins ; (4) aucun des 14 parcours ne fait écrire une personne à un modèle. Les oracles de conception rendaient PASS : ils jugent qu'un lien existe, pas qu'un utilisateur final en est le bout. Coût : 2 runs construits sur une intention incomplète, puis une nouvelle cascade de niveau I (2.0.0), 18 exigences et une étape de version. Ledger seq 282 et 285. **RT-42** : clé proposée `intention-sans-usager`. | 3 garde-fous. (a) À l'ouverture d'un produit, une question fermée au porteur, citée mot pour mot dans l'intention de la cascade : « Qui se servira du produit chaque jour, pour faire quoi, et que fait-il aujourd'hui à la place ? ». Un entrant écrit à partir d'une comparaison de solutions ne la remplace pas. (b) Un contrôle de la cascade : chaque partie prenante a un rôle au référentiel et au moins un parcours qui lui livre l'effet de sa stratégie. (c) Une citation au moins de l'intention vient d'une réponse humaine du ledger, pas seulement d'un document. |

## Forge des tests et pilot, campagnes sur une instance hébergée

Le retour porte sur ce qu'une campagne de tests laisse dans la base d'une instance hébergée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-43 | majeur | générique | Le 13/11/2026, la base de recette compte 315 organisations, dont 281 nommées `t-…` et 16 `e2e-…`, et 465 identités non marquées comme test. Le porteur demande « comment ce nombre a pu atterrir en BDD ». Cause : la suite du produit est rejouée à chaque déploiement sur la base réelle de la recette (`ROLE=recette`). Ses tests créent des organisations et des identités sans les effacer (`tests/test_personas.py` l.36, `tests/test_portail_compose.py` l.114). Aucune règle ni aucun contrôle de la factory ne compare l'état de l'instance avant et après une campagne. Les pages d'administration de la recette en sont illisibles, et une purge sous sauvegarde a été nécessaire (D-30). Ledger seq 277 et 283. **RT-43** : clé proposée `campagne-residus-instance`. | Faire inscrire par chaque campagne jouée sur une instance hébergée le décompte de ses objets métier avant et après, et rendre FAIL un écart. La règle côté produit est ENF-38 d'Produit-82. |

## Pilot, `oracle-lot.mjs --remettre`

Le retour porte sur la remise d'un lot que la porte du pilot refusera.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-44 | mineur | générique | Le 13/11/2026, `node forge/retours/oracle-lot.mjs "Produit-82 - RETOURS - 20261113f.md" --remettre` rend « verdict : PASS — AVEC AVERTISSEMENT : la porte du pilot REFUSERA ce lot tel quel (LOT-SIDECAR) » pour une famille de classe inconnue. Il copie pourtant le lot au sas et sort en exit 0. Un lot remis ne se modifie plus : il a fallu un second lot (20261113g) pour la même candidature. **RT-44** : clé proposée `remise-malgre-refus-annonce`. | Avec `--remettre`, ne pas copier au sas un lot dont l'oracle annonce le refus par la porte, et sortir en échec. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le commit `984f37e`, censé ne porter que la consigne, a embarqué le ledger et 2 fichiers de suivi modifiés (`git commit -am`) | non corrigé : contenu juste, message incomplet | non | documentée |
| `oracle-ears` rend FAIL sur ENF-10 et ENF-26, constats présents avant le delta du 13/11 | non corrigé dans l'étape, déclaré à `ETAT.json` | non | ouverte |

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La relecture d'intention de la consigne du constructeur a relevé, avant le lancement, une partie de la demande sans répondant (la remontée à la factory) et une borne du porteur absente (5 à 10 identités par organisation) : les 2 sont corrigées dans la consigne.

## Ordre recommandé

1. RT-42 : un produit entier peut être construit pour le mauvais public sans qu'aucun oracle ne le voie.
2. RT-43 : chaque déploiement d'une recette dégrade l'instance qu'il est censé vérifier.
3. RT-44 : il coûte un lot de plus, sans risque pour le registre.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ces retours suivent une correction humaine du 13/11/2026. La règle qui aurait évité RT-42 : l'intention d'un produit cite son utilisateur final dans les mots du porteur, et chaque partie prenante a un parcours.
