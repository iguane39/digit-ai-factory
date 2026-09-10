# Retours forges — Produit-62 — 20260909c

- **Contexte** : friction interne observée en séance, sans retour humain : en jugeant la note de synthèse sur l'accès Power BI (20260909e), `oracle-synthese` a refusé au titre de S24 une ligne ordinaire du bloc 5 qui ne rapportait aucune recherche. La cause est dans le détecteur lui-même : son vocabulaire de « recherche par nom » contient le mot **motif**, qui est précisément le libellé que le gabarit impose à chaque ligne du bloc 5 (« — motif : … »). Le gabarit nourrit donc le détecteur, et toute ligne de non-traité qui porte un mot d'absence et nomme une table, une vue ou un espace de travail est lue comme une recherche par nom qui n'a rien trouvé.
- **Références ledger** : `forge\ledger.jsonl` seq 86 (friction observée), seq 88 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-09

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## digit-ai-factory (pilot, `oracles\oracle-synthese.mjs` S24 et `gabarits\RESTITUTION.md` bloc 5)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-14 | majeur | générique | **Le détecteur de « recherche par nom » de S24 compte le mot « motif », que le gabarit prescrit à chaque ligne du bloc 5 : une ligne de non-traité ordinaire est lue comme une recherche par nom qui n'a rien trouvé.** Fait observé le 2026-09-09 sur `output\Client-A - Note Synthese Acces Power BI Tenancy Schedule Asset - 20260909e.md` : la ligne « Publier, actualiser ou interroger quoi que ce soit dans l'espace de travail — motif : `garde_fou` (R-38, aucune publication sur un service hébergé sans GO humain consigné) » a rendu S24 FAIL : « 1 absence(s) sur 1 conclue(s) d'une recherche PAR NOM ». Lecture du code (`oracle-synthese.mjs`, bloc S24) : une phrase est risquée quand elle cumule `ABSENCE_TROUVEE` (ici « aucune »), `OBJET_DE_CATALOGUE` (ici « espace de travail ») et `RECHERCHE_PAR_NOM`, dont l'expression est `(%\w+%|LIKE\s|ILIKE\s|grep|motif|pattern|nom contenant|…)`. Le seul terme de recherche présent dans la phrase est « motif », c'est-à-dire le libellé imposé par `RESTITUTION.md` (« chacun avec le motif ») pour toute ligne du bloc 5. Aucune recherche n'était rapportée : la ligne dit qu'une publication est interdite par une règle. La correction a consisté à retirer « aucune » de la parenthèse (« R-38 : toute publication … exige un GO »), sans gain de sens, et S24 est passé à la seconde passe. *Un détecteur dont le vocabulaire recouvre un mot que le gabarit impose se déclenche sur la forme prescrite elle-même : il ne juge plus une tournure de l'auteur, il pénalise l'obéissance au gabarit.* Même famille que RF-13 (lot 20260908l : un nom de donnée lu comme un motif d'action), mais règle et mécanisme distincts : ici c'est le libellé du gabarit, pas une donnée citée, qui alimente le détecteur. | **(1)** Retirer « motif » de `RECHERCHE_PAR_NOM`, ou le borner à « motif de nom » / « motif de recherche » — le sens visé (un motif SQL ou une expression rationnelle) est déjà couvert par `%…%`, `LIKE`, `grep`, `pattern`. **(2)** Faire lire S24 hors du libellé structurel : ôter le préfixe « — motif : » d'une ligne du bloc 5 avant de la juger, comme S21 devrait lire la seule cellule « Motif / raison » (RF-13). **(3)** Fixture double sens : une ligne du bloc 5 « X non fait — motif : `garde_fou` (aucune écriture sur l'espace de travail sans GO) » doit rendre PASS ; une ligne « aucune table dont le nom contient `taux` (grep sur les 206 tables) » doit rester FAIL. Une recette qui joue le gabarit lui-même contre chaque détecteur lexical (chaque libellé prescrit soumis à chaque vocabulaire fermé) trouverait ces collisions avant qu'un produit ne les paie. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La ligne du bloc 5 a perdu son mot d'absence pour satisfaire l'oracle | reformulée en obligation positive (« toute publication exige un GO ») | oui : la forme positive est aussi lisible, mais la contrainte vient de l'oracle, pas du lecteur — remontée (RF-14) | remontée |
| Deux autres constats du même passage (S21 : une tentative `acces` sans trace mesurée ; S23 : « L4 » employé deux fois sans glose) étaient fondés | trace mesurée ajoutée (`grep -c` rendant 0), glose « le lot de construction du modèle Power BI » au premier emploi | non : défauts d'auteur, correctement détectés | resté au produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Le gabarit `RESTITUTION.md` n'est pas en cause par son contenu : c'est la collision entre son libellé prescrit et le vocabulaire d'un détecteur qui l'est.

## Confirmations positives

- Les deux autres constats du même passage (S21 et S23) désignaient des défauts réels, et le message de S23 nommait le désignateur fautif et son nombre d'emplois : la correction a été immédiate.
- Le message de S24 explique le raisonnement de la règle (nom ≠ chose) ; c'est ce qui a permis de comprendre en une lecture du code que la ligne refusée ne contenait aucune recherche et que le déclencheur était le libellé du gabarit.

## Ordre recommandé

1. RF-14 — tant que « motif » figure dans le vocabulaire de S24, toute restitution dont le bloc 5 nomme une table ou un espace de travail avec un mot d'absence est refusée à la première passe, sur tous les produits de la forge.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

L'item ne suit pas un retour humain mais une friction observée en séance. Classe : **RF-14** → `regle-balaie-prose-et-identifiants` (famille `regle-morte`, correspondance APPROCHÉE : la classe vise une règle qui lit dans la même expression la prose de l'auteur et les identifiants qu'il cite ; ici la règle lit dans la même expression la prose de l'auteur et le libellé structurel que le gabarit lui impose. Classe candidate `detecteur-nourri-par-le-gabarit`, même famille, libellé proposé : « le vocabulaire fermé d'un détecteur lexical recouvre un libellé que le gabarit prescrit : la forme obéissante déclenche le refus »).
