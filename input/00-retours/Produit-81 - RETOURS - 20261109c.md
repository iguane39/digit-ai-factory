# Retours forges — Produit-81 — 20261109c

- **Contexte** : incident de restitution — demandé par le porteur, hors run ouvert ; fait suite aux lots 20261109a et 20261109b.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl` seq 9 et 10 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu par l'utilisateur ; remontée obtenue seulement sur son ordre).

## RT-11 (majeur) — Voie manuelle proposée à l'utilisateur alors que la session pouvait l'automatiser

**Le fait.** Le 09/11/2026, pour déblocage de l'accès à la base de dev, la session a proposé à l'utilisateur, tour après tour, des gestes **manuels** : d'abord écrire à une tierce personne, puis « faites-le vous-même au portail ». Or la session pouvait exécuter elle-même le geste (désigner l'administrateur Entra), au besoin après une approbation groupée — ce qu'elle n'a proposé qu'au tour où l'utilisateur a demandé « tu ne peux pas le faire automatiquement ? ». C'est contraire à la **loi n° 5 (voie automatique d'abord)** : tout ce qui peut être fait automatiquement ne se laisse pas à l'humain.

**Le coût, prouvé.** Plusieurs tours de va-et-vient, un message Teams rédigé pour rien, et l'utilisateur contraint de réclamer lui-même l'automatisation.

**La règle qui aurait évité le retour.** Quand une action est laissée à l'humain, prouver d'abord qu'aucune voie automatique n'existe — y compris une voie exécutable par la session après approbation groupée. Si elle existe, la proposer **en premier**. **Clé proposée** (RT-11) : `voie-manuelle-proposee-alors-qu-automatisable`, famille `restitution-forme`, libellé « Une voie propose à l'humain un geste manuel que la session pouvait exécuter elle-même, au besoin après une approbation groupée, au lieu de proposer d'abord la voie automatique (loi n° 5) ».

**Juge proposé.** Un contrôle de restitution refuse une action `manuelle_utilisateur` / `manuelle_dev` dont le même geste figure ailleurs dans le tour en commande exécutable par la session, sans preuve d'impossibilité mesurée.

## RT-12 (majeur, RÉCIDIVE) — Défaut du point précédent non remonté avant l'ordre du porteur

**Le fait.** L'information du RT-11 a été connue de la session (produit) sans qu'elle la remonte à la Factory de sa propre initiative : il a fallu que le porteur l'ordonne explicitement (« remonte ces 2 points »). Même schéma que le défaut déjà remonté le jour même en lot 20261109b.

**Le coût, prouvé.** Un défaut réel serait resté chez le produit sans l'intervention du porteur — exactement ce que la classe décrit.

**La règle qui aurait évité le retour.** Tout défaut que la session constate sur elle-même se remonte sans attendre une consigne de l'humain.

## Rattachement

Registre interrogé le 09/11/2026 pour RT-11 : `python … CLASSES.json` (clés filtrées sur `manuel|automat|voie auto|loi n|humain|reattribu`) → aucune clé ne couvre « voie manuelle proposée alors qu'automatisable » ; les plus proches, `processus-du-commanditaire-reattribue` et `decision-posee-hors-du-ressort-humain`, visent un autre défaut (réattribution d'étape, décision hors ressort), pas le choix du manuel quand l'auto existe. D'où une clé neuve en `classe-a-creer`.
Pour RT-12 : classe existante **`remontee-declaree-nulle-apres-correction`** (ouverte, récidivante : TF-1643, 1982, 1987, 2078, 2137, 2141, 2156), recoupée — récidive.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
