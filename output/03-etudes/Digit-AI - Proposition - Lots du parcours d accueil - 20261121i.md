---
destinataire: humain
---

# Démarche ROI — Parcours d'accueil des nouveaux utilisateurs, version intégrée — 20261121i

Découpage en lots du système recommandé par l'étude `output/03-etudes/Digit-AI - Étude - Parcours d accueil des nouveaux utilisateurs - 20261121h.md` : la boussole, avec un niveau qui suit l'utilisateur d'un projet à l'autre, une note sur 100 et une progression synchronisée entre postes. Cette version remplace `output/03-etudes/Digit-AI - Proposition - Lots du parcours d accueil - 20261121e.md`. Chaque lot rend service seul, dans l'ordre donné ; aucun ne part en construction sans le GO du porteur, lot par lot.

## 1. Hypothèses et sources

La démarche ne repose sur aucun montant : le gain attendu est du temps de nouveau venu. Les chiffres d'entrée viennent des diagnostics des études « g » et « h », où chaque mesure `M-xx` (mesure numéro xx) a sa source rejouable.

- Chez les produits, 50 sessions sur 76 voient leur premier tour refusé, du 22/10 au 21/11/2026 [src: M-04, étude « g »].
- Un refus coûte une réécriture d'environ 1 minute en médiane, 344 minutes au total sur la même période [src: M-11, étude « g »].
- Seuls 2 journaux de run sur 15 portent un verdict d'oracle entièrement vert [src: M-07, étude « g »].
- Les traces des jalons manquent souvent : 8 ouvertures de run sur 29 déclarent leur type, 3 produits sur 15 tracent la mobilisation des forges, 30 étapes closes sur 1 382 portent un nom normalisé [src: M-13 à M-15, étude « h »].
- La reprise d'un poste à l'autre par un dossier synchronisé existe déjà pour les produits [src: règle R-64 de `REGLES-PROJET.md`].
- Coût de construction : un run par lot, en modèles Claude seulement, sans API tierce ; l'effort est une estimation de la session, à vérifier au premier run.

## 2. Lots

Le tableau se lit dans l'ordre des lots, qui est la trajectoire : L-01 rend service seul, chaque suivant s'appuie sur les précédents, sauf L-05, indépendant. Les colonnes « utile », « utilisable », « utilisé » sont les trois critères d'un lot.

| lot | utile (besoin couvert) | utilisable (critère binaire de mise en service) | utilisé (mesure d'adoption, datée) | jalon (AAAA-MM-JJ) |
|---|---|---|---|---|
| L-01 Boussole sur tous les projets | l'utilisateur ne repart pas de zéro à chaque projet et sait quoi faire à l'ouverture | le niveau se calcule sans erreur sur les 15 journaux de run de la racine et sur des journaux factices de recette ; deux projets du même utilisateur rendent le même niveau ; une seule ligne en tête du relevé d'ouverture | nombre de sessions de produit dont le relevé d'ouverture porte la ligne de la boussole, relevé le 2026-12-18 | 2026-12-04 |
| L-02 Niveau annoncé et contenus des niveaux | l'utilisateur expérimenté n'est pas traité en débutant, et chaque niveau dit ce qui lui sert | une annonce est marquée « annoncée » et n'entre jamais dans la note ; une décision tranchée en phrase fait redescendre d'un niveau ; la question du poste vierge n'est posée qu'une fois, prouvé par recette | nombre d'annonces de niveau et de demandes « où en suis-je ? », relevé le 2027-01-08 | 2026-12-11 |
| L-03 Traces normalisées et note sur 100 | la note reflète le vrai parcours d'un utilisateur, pas les lacunes des traces | toute ouverture de run déclare son type, toute étape close porte son nom normalisé, toute demande écrit sa mobilisation, vérifié par l'oracle de conformité du socle ; la note se calcule sur les 30 jalons | part des ouvertures de run qui déclarent leur type, rejouée le 2027-01-15, à comparer aux 8 sur 29 de M-13 | 2026-12-18 |
| L-04 Progression synchronisée | l'utilisateur retrouve son niveau et ses jalons sur un autre poste | le fichier de progression s'écrit en fin de tour dans le dossier synchronisé déclaré et se relit à l'ouverture ; deux postes qui progressent en parallèle additionnent leurs jalons sans en perdre, prouvé par recette ; aucun nom de projet dans le fichier | nombre de postes qui lisent un fichier de progression à l'ouverture, relevé le 2027-01-15 | 2027-01-08 |
| L-05 Friction de premier tour | la première réponse d'une session ne se réécrit plus pour une raison de forme | le préjugement est joué avant l'affichage au premier tour de chaque session de produit, vérifié par une recette du hook de fin de tour | part des sessions de produit dont le premier tour est refusé, rejouée le 2027-01-15, à comparer aux 50 sur 76 de M-04 | 2027-01-08 |
| L-06 Préférences par utilisateur | un nouvel utilisateur n'hérite plus des règles personnelles du porteur | un fichier de préférences propre à l'utilisateur est chargé à l'ouverture à la place de celui du porteur quand il existe, prouvé par une recette d'ouverture | nombre de postes portant un fichier de préférences d'utilisateur, relevé le 2027-01-15 | 2027-01-15, sous réserve de la réponse du porteur à la question ouverte de l'étude |

## 3. Trajectoire de construction et migration

Les six lots se construisent au pilot, par runs de version successifs, et atteignent les produits par la propagation ordinaire du socle à l'ouverture.

- **L-01** : un script de calcul en lecture seule sous `scripts/`, qui lit les journaux de run de tous les projets instrumentés de la racine ; sa recette ; le raccord au relevé d'ouverture du socle produit. Retour arrière : retirer la ligne ; le script ne modifie rien.
- **L-02** : l'annonce de niveau, la question du poste vierge, les messages de chaque niveau et le skill « où en suis-je ? », propagé par `bootstrap.mjs` et déclaré au lexique d'invocation. Retour arrière : retirer le skill ; L-01 continue de servir.
- **L-03** : le type de run, le nom normalisé d'étape et la mobilisation deviennent obligatoires dans les écrivains du journal de run, avec leur contrôle au socle ; les journaux passés ne sont pas réécrits, la note les lit tels quels. Retour arrière : rendre ces champs facultatifs à nouveau.
- **L-04** : le fichier de progression sur le canal de reprise R-64, écrit et relu par le hook `reprise`. Le dossier synchronisé se nomme une fois, par l'utilisateur. Retour arrière : supprimer le fichier ; le niveau se recalcule sur les projets du poste.
- **L-05** : le préjugement au premier tour, dans le hook de fin de tour du socle. Retour arrière : revenir à la version précédente du hook.
- **L-06** : le chargement d'un fichier de préférences par utilisateur, seulement si le porteur le décide. Retour arrière : supprimer le fichier.

Aucune base ni aucune cible cloud n'est concernée : pas de plan de migration de données.

## 4. Suivi des bénéfices

Chaque gain promis se constate par une mesure déjà outillée, à une date fixée ; le tableau se lit par indicateur, avec sa valeur de départ, sa source et son rendez-vous.

| Indicateur | Valeur de départ | Source | Relevé |
|---|---|---|---|
| Délai entre l'ouverture de la première session et le premier livrable vert | non mesurée (M-07) ; calculée par la boussole dès L-01 | journal de run de chaque produit | 2027-01-15 |
| Sessions de produit dont le premier tour est refusé | 50 sur 76 du 22/10 au 21/11/2026 (M-04) | `.claude/hooks-journal.jsonl` du pilot | 2027-01-15 |
| Ouvertures de run qui déclarent leur type | 8 sur 29 (M-13) | journaux de run des produits | 2027-01-15 |
| Sessions de produit affichant la ligne de la boussole | 0, la boussole n'existe pas | relevé d'ouverture des produits | 2026-12-18 |
| Postes lisant un fichier de progression | 0 | hook `reprise` des produits | 2027-01-15 |

## 5. Plan de revue

Première revue des bénéfices le 2027-01-15 : les cinq indicateurs ci-dessus sont rejoués sur les sources nommées, sur la fenêtre du 2026-12-15 au 2027-01-14. Règle de décision : si la part des sessions de produit dont le premier tour est refusé ne descend pas sous 50 sur 76, L-05 est rouvert avant toute extension ; si moins de la moitié des sessions de produit affichent la ligne de la boussole, L-01 est revu avant L-02 ; si moins de la moitié des ouvertures de run déclarent leur type, la note sur 100 n'est pas affichée [src: règle posée par cette démarche, à vérifier par le porteur].
