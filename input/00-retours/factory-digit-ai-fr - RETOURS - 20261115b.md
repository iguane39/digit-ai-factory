# Retours forges — factory-digit-ai-fr — 20261115b

- **Contexte** : hors étape, question du créateur sur les agents de relecture : sont-ils spécialisés, et une spécialisation apporterait-elle quelque chose ? Le créateur demande ensuite d'envoyer à la Factory une demande d'étude d'opportunité sur ce sujet.
- **Références ledger** : forge/ledger.jsonl seq 213.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : remis le 15/11/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le créateur, le 15/11/2026 : « est-ce que les agents de relecture qui sont créés sont spécialisés pour apporter une valeur particulière sur la relecture ? Et si non, est-ce qu'il y a un intérêt à en avoir des spécialisés ? Et si oui, comment et pourquoi ? », puis : « Envoie une demande d'étude d'opportunités sur ce sujet à la factory en TODO ». J'ai lu la définition de l'agent `relecteur` héritée du pilot et l'étude du pilot du 06/11/2026 sur le coût et la qualité de la boucle L99.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte un retour, RP-41 : une demande d'étude d'opportunité sur des relecteurs à angle distinct.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-41 | **majeur** | générique | **Les relecteurs parallèles d'une même passe sont des copies du même généraliste.** L'agent `relecteur` n'a aucun angle propre : sa seule spécialisation est sa posture (aveugle, lecture seule, Opus en effort élevé, ligne citée). L'angle vient de la consigne. L'étude du pilot du 06/11/2026 mesure qu'à deux, ils voient environ 73 % du stock de défauts graves (Lincoln-Petersen). L'un voit 45 % de ce que trouve l'autre. 7 graves sur 22 étaient présents dès la passe 1 sans y être relevés. Le type dédié déjà retenu (TF-2241) vise le coût, pas l'angle. Preuve : `.claude/agents/relecteur.md` ; `output/03-etudes/Digit-AI - Étude - Cout et qualite de la boucle L99 - 20261106b.md` du pilot, lignes 9, 56, 57, 112 à 122 et 135. | **Étude d'opportunité demandée.** Comparer, à coût égal, deux relecteurs généralistes et un jeu de relecteurs à angle distinct, avec un généraliste conservé. Angles à tester : prémisses et faits vérifiés une fois, texte neuf issu des corrections, intention contre lettre, lecteur visé. Mesurer par capture-recapture les défauts graves trouvés. Rendre des options avec une recommandation, puis la décision humaine. |

## La règle qui aurait évité le retour

RP-41 : aucune règle ne demande que des relecteurs parallèles portent des angles distincts, ni qu'on mesure le recouvrement de leurs angles morts. Classe à créer : `relecteurs-paralleles-sans-angle-distinct`, famille `contrat-interface-forge`.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
