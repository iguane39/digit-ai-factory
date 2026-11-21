---
destinataire: humain
---

# Démarche ROI — Parcours d'accueil des nouveaux utilisateurs — 20261121e

Découpage en lots du système recommandé par l'étude `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121d.md` (la boussole en cinq paliers). Chaque lot rend service seul, dans l'ordre donné ; aucun ne part en construction sans le GO du porteur, lot par lot.

## 1. Hypothèses et sources

La démarche ne repose sur aucun montant : le gain attendu est du temps de nouveau venu, et sa valeur de départ n'est pas encore mesurable. Les chiffres d'entrée viennent tous du diagnostic de l'étude, chapitre 2.2, où chaque mesure `M-xx` (mesure numéro xx) a sa source rejouable.

- Chez les produits, 50 sessions sur 76 voient leur premier tour refusé au contrôle de fin de tour, du 22/10 au 21/11/2026 [src: M-04].
- Les règles S1 *(un bloc toujours présent manque)* et S4 *(une décision posée sans ses options)* portent 241 refus au premier passage sur la même période [src: M-05].
- Seuls 2 journaux de run de produit sur 15 portent un verdict d'oracle entièrement vert après l'ouverture du run : le délai jusqu'au premier livrable vert n'a pas de valeur de départ fiable [src: M-07].
- Un nouvel utilisateur hérite des préférences du porteur [src: M-08].
- Coût de construction : un run par lot, en modèles Claude seulement, sans API tierce ; l'effort de chaque lot est une estimation de la session, à vérifier au premier run.

## 2. Lots

Le tableau se lit dans l'ordre des lots, qui est la trajectoire : L-01 rend service seul, chaque suivant s'appuie sur les précédents. Les trois colonnes « utile », « utilisable », « utilisé » sont les trois critères d'un lot ; un lot qui en manque un n'est pas un lot.

| lot | utile (besoin couvert) | utilisable (critère binaire de mise en service) | utilisé (mesure d'adoption, datée) | jalon (AAAA-MM-JJ) |
|---|---|---|---|---|
| L-01 Boussole minimale | le nouveau venu sait à chaque ouverture où il en est et quoi faire ensuite (M-04, M-07) | le calcul de palier rend un palier P1 à P5 sans erreur sur les 15 journaux de run de la racine et sur des journaux factices de recette ; une seule ligne en tête du relevé d'ouverture du produit | nombre de sessions de produit dont le relevé d'ouverture porte la ligne de palier, relevé le 2026-12-18 | 2026-12-04 |
| L-02 Contenus des paliers | le nouveau venu reçoit, à chaque palier, les trois phrases d'intention, la lecture des blocs 0 et 3, la réponse par lettre, puis les cinq services utiles à sa situation (étude, chapitre 5) | chaque contenu est lu dans sa source (`references/ACCUEIL.md`, `profils/`, `catalogues/catalogue.jsonl`), aucun n'est recopié, et la recette le prouve en modifiant une source factice | nombre de demandes « où en suis-je ? » au lexique d'invocation, relevé le 2027-01-08 | 2026-12-11 |
| L-03 Friction des refus de premier tour | la première réponse d'une session n'est plus réécrite pour une raison de forme (M-04, M-05) | le préjugement de la restitution est joué avant l'affichage au premier tour de chaque session de produit, vérifié par une recette du hook de fin de tour | part des sessions de produit dont le premier tour est refusé, rejouée sur le journal des hooks le 2027-01-15, à comparer aux 50 sur 76 de M-04 | 2026-12-18 |
| L-04 Préférences par utilisateur | un nouvel utilisateur n'hérite plus des règles personnelles du porteur (M-08) | un fichier de préférences propre à l'utilisateur est chargé à l'ouverture à la place de celui du porteur quand il existe, prouvé par une recette d'ouverture | nombre de postes portant un fichier de préférences d'utilisateur, relevé le 2027-01-15 | 2027-01-08, sous réserve de la réponse du porteur à la question ouverte de l'étude |

## 3. Trajectoire de construction et migration

Les quatre lots se construisent au pilot, par runs de version successifs ; aucun ne touche un produit autrement que par la propagation ordinaire du socle à l'ouverture.

- **L-01** : un script de calcul en lecture seule sous `scripts/`, sa recette sur journaux factices, puis le raccord au relevé d'ouverture du socle produit. Retour arrière : retirer la ligne du relevé ; le script ne modifie rien.
- **L-02** : les contenus de chaque palier et le skill « où en suis-je ? », propagé par `bootstrap.mjs` et déclaré au lexique d'invocation. S'appuie sur le calcul de L-01. Retour arrière : retirer le skill ; la ligne de L-01 continue de servir.
- **L-03** : le préjugement au premier tour, dans le hook de fin de tour du socle. Indépendant de L-01 et L-02 dans le code, placé ici parce que sa mesure de bénéfice réutilise la même revue. Retour arrière : revenir à la version précédente du hook.
- **L-04** : le chargement d'un fichier de préférences par utilisateur, seulement si le porteur le décide. Retour arrière : supprimer le fichier, le chargement revient aux préférences du porteur.

Aucune base ni aucune cible cloud n'est concernée : pas de plan de migration de données.

## 4. Suivi des bénéfices

Chaque gain promis se constate par une mesure déjà outillée, à une date fixée ; le tableau se lit par indicateur, avec sa valeur de départ, sa source et son rendez-vous.

| Indicateur | Valeur de départ | Source | Relevé |
|---|---|---|---|
| Délai entre l'ouverture de la première session et le premier livrable vert | non mesurée (M-07) ; calculée par la boussole dès L-01 | journal de run de chaque produit, événements `run_open` et `oracles_verdict` | 2027-01-15 |
| Sessions de produit dont le premier tour est refusé | 50 sur 76 du 22/10 au 21/11/2026 (M-04) | `.claude/hooks-journal.jsonl` du pilot, premier jugement de chaque session | 2027-01-15 |
| Refus au premier passage sur S1 et S4 | 241 du 22/10 au 21/11/2026 (M-05) | même source, champ `bloquantes` | 2027-01-15 |
| Sessions de produit affichant la ligne de palier | 0, la boussole n'existe pas | relevé d'ouverture des produits | 2026-12-18 |

## 5. Plan de revue

Première revue des bénéfices le 2027-01-15 : les quatre indicateurs ci-dessus sont rejoués sur les sources nommées, sur la fenêtre du 2026-12-15 au 2027-01-14. Règle de décision : si la part des sessions de produit dont le premier tour est refusé ne descend pas sous 50 sur 76, L-03 est rouvert avant toute autre extension ; si moins de la moitié des sessions de produit affichent la ligne de palier, L-01 est revu avant L-02 [src: règle posée par cette démarche, à vérifier par le porteur].
