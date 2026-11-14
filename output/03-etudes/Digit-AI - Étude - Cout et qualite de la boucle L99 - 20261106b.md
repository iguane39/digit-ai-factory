# Coût et qualité de la boucle L99 : pourquoi elle ne s'arrête jamais où elle le dit, et ce qui la rendrait moins chère

Étude du 06/11/2026, pilot `digit-ai-factory`, session pilote Claude Opus 5.5. Elle répond à une question du porteur, posée par un prompt construit chez Produit-84 le même jour. Elle alimente la revue de l'essai D-111 (a) du 16/11/2026 (TF-2026), sans la remplacer. Aucun agent n'a été lancé, aucune boucle rejouée : tout part des journaux et des transcriptions existants.

Natures des chiffres : MESURÉ (lu par une commande sur une trace), DÉCOMPTÉ (compté par une commande sur des journaux), ESTIMÉ (calcul ou jugement, hypothèse dite).

## Ce qui change pour le lecteur

La boucle L99 ne s'arrête jamais sur son critère « 0 bloquant et 0 majeur » : aucune des 59 passes relevées n'y arrive. Trois causes se cumulent, toutes chiffrées ci-dessous. Les corrections écrivent du texte neuf, et c'est là que naissent les deux tiers des défauts suivants. Deux relecteurs ne voient qu'environ trois quarts des défauts présents, donc chaque passe en découvre d'anciens. Enfin, la règle qui garde ou rejette une passe décide sur des écarts de 2 points, plus petits que le désaccord ordinaire entre deux relecteurs.

Côté coût, 81 % des jetons de la boucle vont aux relecteurs. Plus de la moitié de chaque relecteur est un contexte de départ fixe. Les deux tiers de ses commandes revérifient des prémisses qu'un autre relecteur vient de vérifier. Sept optimisations sont retenues et ouvertes au registre (TF-2236 à TF-2242). Une expérience de 3 millions de jetons au plus est proposée pour la revue du 16/11, avec son seuil fixé ici.

## 0. Données

Relevé entre 11:51 et 12:04 (heure de Paris, lue par `date`). Chemins chez Produit-84 non écrits ici : on dit « le dossier des prompts de Produit-84 ».

| Heure | Commande | Sortie résumée | Nature |
|---|---|---|---|
| 11:51:41 | `git -C digit-ai-forge-agents status --porcelain -- .claude/skills/prompt-analyzer-l99` | vide ; HEAD `afcbffc` | MESURÉ |
| 11:51:49 | `node <skill>/scripts/releve-boucles.mjs C:\dev --json` | 19 journaux lisibles, 1 illisible ; arrêts : 0 sur « 0 bloquant et 0 majeur », 11 gains insuffisants, 5 régressions, 3 bornes ; gain médian 7,5 | MESURÉ |
| 11:52 | lecture de l'étude du 29/10 et de son `.experience.json` | bruit de 4 à 7 points d'un jury à l'autre, de 0 à 6 dans un même jury ; 2 360 934 jetons | MESURÉ |
| 11:53 | `grep '"id":"TF-2026"' todo/TODO.jsonl` | 6 lignes ; statut `en_cours`, D-111 (a), `attente_jusqu_au` 2026-11-16 | MESURÉ |
| 11:53 | lecture de `<skill>/scripts/oracle-boucle-l99.mjs` | règles B1 à B12 ; B8 borne `bruit_tolere` à [0,2], défaut 0 | MESURÉ |
| 11:55 | transcriptions de la session Produit-84 du 06/11 (`1a69e60e`) : 17 agents | 15 agents de la liste du contexte, jetons et secondes identiques à 1 seconde près ; 2 relecteurs de plus, ceux de la passe 1 du présent prompt | MESURÉ |
| 11:58:14 | lecture de la trace de la session pilote `de1103cb` et de son étude | étude présente, 12 943 mots ; dernier appel du modèle à 11:55:39 | MESURÉ |
| 12:03:13 | `node scripts/allouer-indice.mjs --dossier output/03-etudes --prefixe "…Cout et qualite de la boucle L99" --jour 20261106 --extension .md` | `b` | MESURÉ |

Écarts avec le point de départ du prompt (relevé de 11:40) :

- Le relevé de 11:51 rend les mêmes 19 journaux et les mêmes arrêts. Le journal illisible est celui de la boucle en cours sur le présent prompt : son arbitre est écrit, sa liste de passes vide.
- Le relevé exclut les dossiers `old/`. Deux journaux de Produit-84 y dorment, dont la première boucle du 06/11 (indice a). Un journal de produit est copié à l'identique dans un second dossier du même produit. Le corpus de cette étude compte donc 20 journaux distincts (DÉCOMPTÉ) : 18 relevés, moins la copie, plus les 2 de `old/`. Arrêts sur ces 20 : 12 gains insuffisants, 6 régressions, 2 bornes.
- La session pilote à mesurer pour la question 2 a démarré à 11:05:22, pas vers 11:16 (MESURÉ, premier horodatage de sa trace).
- Le relevé d'ouverture signale que les règles du skill ont changé depuis son relevé de 11:35 (empreinte `df197f37e392` devenue `e52276879e8e`, 8 puis 10 fichiers). B11 et B12 (TF-2202) s'appliquent aux journaux qui les déclarent ; aucun des 2 journaux du 06/11 ne le fait.

Les 2 boucles du 06/11 dont le contexte donne les coûts sont, chez Produit-84, la boucle d'indice a (3 passes, la troisième rejetée) puis celle d'indice b (2 passes). Les versions du prompt de chaque passe sont encore dans le scratchpad de la session : elles servent aux tests de citation de la section 1.

## 1. Qualité de la construction

Mode d'emploi : chaque hypothèse porte son verdict, le chiffre qui le fonde, et sa source. « Graves » veut dire bloquants et majeurs retenus après recompte.

### H1. Le bruit de notation dépasse le gain minimal et le bruit toléré

**Confirmée.**

- Écart entre les 2 relecteurs d'une même passe : de 0 à 24 points, médiane 3, sur 21 passes notées par 2 relecteurs (DÉCOMPTÉ). 11 passes sur 21 ont un écart de 3 points ou plus, au-dessus du bruit toléré maximal de B8 (2) et égal au gain minimal (3).
- Écart de score d'une passe à la passe gardée : 15 sur 39 sont sous 3 points en valeur absolue, 27 sur 39 sous 6 points (DÉCOMPTÉ). Six points, c'est la dispersion maximale d'un même jury mesurée le 29/10.
- Rejets pour régression : 9 sur 20 journaux, de −2 à −39 points. Trois tiennent à une baisse de 2 points exactement (DÉCOMPTÉ). Les baisses de −32 et −39 sont des plafonds à 40 sur un bloquant : de vraies régressions.
- Le score d'une passe est le minimum des 2 relecteurs (journal du 05/11 d'indice e, clé `score_de_passe`, et toutes les passes du 06/11). Le minimum de 2 notes bruitées est plus bruité que leur moyenne.

Jeu d'essai, la passe rejetée du 06/11 : boucle d'indice a, passe 3 notée 80 et 81, passe 2 gardée notée 83 et 82. Écart de 2 points, sous le biais de jury de 4 à 7 points du 29/10. Le vérificateur y confirmait 4 clôtures. Le journal déclarait un bruit toléré de 0, écrit après la passe 3. Avec le bruit de 2 déclaré par la boucle d'indice b une heure plus tard, la même passe était gardée. Résultat attendu : un rejet dans le bruit. **Constaté.** Nuance : la passe 3 portait 8 graves contre 4 à la passe 2, mais vus par d'autres relecteurs ; les deux comptes ne se comparent pas (H2).

### H2. Des relecteurs neufs à chaque passe trouvent de nouvelles classes de défauts : la cible bouge

**Confirmée.**

- Test de citation sur les 2 boucles du 06/11 : chaque citation de défaut grave est cherchée dans le texte de la passe 1 (1 189 mots). 7 des 22 graves relevés après la passe 1 citent un texte déjà présent en passe 1, que ses 2 relecteurs n'avaient pas relevé (DÉCOMPTÉ). Trois d'entre eux (R2, R4, R5) ont survécu sans signalement à 2 jurys de suite.
- Capture-recapture sur les 17 passes où les 2 relecteurs partagent au moins un grave : 107 graves trouvés pour un stock estimé de 146 (ESTIMÉ, estimateur de Lincoln-Petersen, `A × B / AB`). Deux relecteurs voient environ 73 % du stock. Pris seul, l'un voit 45 % de ce que l'autre trouve, l'autre 69 %.

Jeu d'essai, la boucle arrêtée à la borne (journal Produit-84 du 05/11, indice e, 3 passes, 79 puis 40 rejetée puis 82). Ses 9 majeurs finaux ont tous une citation absente des 16 défauts des passes 1 et 2 : ils sont neufs (DÉCOMPTÉ). Deux citent un texte déjà présent à la passe 1 : la cible a bougé. Au moins 4 citent un texte écrit par une correction, 3 ne se retrouvent pas mot pour mot. Résultat attendu : un exemple de cible mouvante. **Constaté, mêlé à H4.**

### H3. Chaque correction allonge le prompt, et la longueur crée des défauts

**Allongement confirmé ; « la longueur crée des défauts » réfutée sous cette forme.**

- Les 39 passes comparables grossissent toutes, médiane +27 % par passe, maximum +98 % (DÉCOMPTÉ). De la passe 1 à l'arrêt, médiane +47 % ; 16 boucles sur 20 dépassent 15 %, la garde de B4 qui ne se juge que d'une passe à l'autre.
- Le 06/11 : 1 189, 1 533, 1 693 (rejetée), 2 188, 2 773 mots, puis 3 004 à la version lancée (MESURÉ, `wc -w`).
- Mais le nombre de graves ne suit pas la longueur : 8 à 1 189 mots, 4 à 2 773. La densité tombe de 6,7 à 1,4 graves pour 1 000 mots (DÉCOMPTÉ). Ce n'est pas la longueur qui crée les défauts : c'est le texte ajouté (H4).

### H4. Les corrections créent des défauts, que le vérificateur ne rattrape qu'en partie

**Confirmée.**

- Sur les 22 graves relevés après la passe 1 le 06/11, 15 citent un texte écrit par une correction (DÉCOMPTÉ). Onze sont dans le texte de la correction immédiatement précédente, que le vérificateur venait de lire.
- Le texte ajouté pèse 22 % à 57 % du prompt selon la passe, et porte 50 % à 83 % de ses graves (ESTIMÉ : part ajoutée bornée par `1 − 1 189 / mots`). Par passe, il est 2 à 6 fois plus dense en défauts que le texte d'origine (ESTIMÉ, borne basse).
- Les vérificateurs du 06/11 ont relevé 10 défauts créés, dont 3 graves ; les relecteurs aveugles en ont trouvé 11 de plus après eux (DÉCOMPTÉ).
- Sur les 20 journaux : 123 défauts créés relevés pour 227 clôtures, soit 0,54 par défaut fermé (DÉCOMPTÉ). Ratio par journal de 0,18 à 1,33.

### H5 (hypothèse de cette étude). L'arrêt « 0 bloquant et 0 majeur » est hors d'atteinte par construction

**Confirmée.**

- 0 passe sur 59 sans grave retenu ; minimum 2, médiane 6 par passe, médiane 5,5 à la passe d'arrêt (DÉCOMPTÉ).
- Mécanisme (ESTIMÉ) : chaque défaut fermé en crée environ 0,54 (H4), et environ 27 % du stock échappe à 2 relecteurs (H2). Corriger 6 graves en laisse ou en crée environ 3 à 5. En 3 passes, la suite ne descend pas à 0.
- Conséquence : l'arrêt réel se fait toujours sur le gain insuffisant, la régression ou la borne. Ces trois arrêts se jugent sur des écarts de score pris dans le bruit (H1). La boucle livre sa dernière passe gardée avec ses majeurs, ce que le Ch8 dit déjà.

## 2. Temps de la construction

Source : la liste du contexte, recoupée aux transcriptions d'agents de la session `1a69e60e`. Les 15 coûts concordent : le chiffre du harnais est le contexte final de l'agent, sortie comprise (MESURÉ).

| Rôle | Boucle 1 (indice a) | Boucle 2 (indice b) | Total, jetons | Part | Secondes cumulées |
|---|---|---|---|---|---|
| Relecteur aveugle (Opus, `general-purpose`) | 6 agents, 483 552 | 4 agents, 351 907 | 835 459 | 80,8 % | 3 408 |
| Vérificateur de clôture (Sonnet, `verificateur`) | 2 agents, 70 831 | 3 agents, 127 384 | 198 215 | 19,2 % | 1 287 |
| Recompte | fait par l'orchestrateur, 0 agent | idem | 0 | 0 % | — |
| Orchestration | session principale, hors liste | idem | 0 | 0 % | — |
| **Total** | 554 383 | 479 291 | **1 033 674** | 100 % | 4 695 |

Le total est égal à celui de la liste, à 0 jeton près (DÉCOMPTÉ). Moyenne : 83 546 jetons par relecteur, 39 643 par vérificateur.

Hors liste, mesuré dans la transcription principale entre 09:18 et 11:09 : l'orchestrateur fait 146 appels au modèle. Son contexte passe de 88 315 à 413 565 jetons, pour 168 894 jetons de sortie (MESURÉ). Le recompte et les corrections sont faits là. Ce coût ne s'additionne pas à la liste : ce n'est pas la même mesure.

Durées, décomptées sur les horodatages de lancement et de fin (heure de Paris) :

- Boucle 1 : de 09:47:46 à 10:13:11, 25 min. Attente des agents sur le chemin critique : 21 min ; orchestrateur entre deux agents : 4 min.
- Entre les boucles : 20 min, de 10:13 à 10:33 (Ch8 de la boucle 1, reprise en boucle 2).
- Boucle 2 : de 10:33:28 à 11:03:45, 30 min. Agents : 21 min ; orchestrateur : 10 min.
- Le relecteur de 1 248 s a rendu son résultat en 325 s. Une commande dépassant 60 s est passée en arrière-plan, et l'agent l'a attendue 905 s. Cette attente n'était pas sur le chemin critique : le vérificateur suivant était déjà lancé.

Travail répété, mesuré sur les 165 appels d'outil des 10 relecteurs :

| Prémisse revérifiée | Relecteurs | Appels |
|---|---|---|
| règles R-4 et R-25, registre des types | 10 sur 10 | 23 |
| `bootstrap.mjs --pull` | 10 sur 10 | 29 |
| `allouer-indice.mjs` | 10 sur 10 | 16 |
| `journaliser.mjs` | 8 sur 10 | 13 |
| audit du cas témoin de Produit-84 | 8 sur 10 | 12 |
| `reserver-decision.mjs`, ledger | 7 sur 10 | 11 |
| oracles du protocole de tests | 7 sur 10 | 11 |
| réglages Supabase dans forge-ops | 6 sur 10 | 10 |

112 appels sur 165 (68 %) touchent une de ces prémisses (DÉCOMPTÉ). Chaque relecteur ouvre avec 46 190 à 46 279 jetons de contexte avant sa première lecture, soit 55 % de ses jetons ; chaque vérificateur avec 17 362 à 17 435 (MESURÉ). La différence tient au type d'agent : général pour le relecteur, dédié pour le vérificateur. L'exploration propre d'un relecteur coûte en moyenne 34 366 jetons (MESURÉ, contexte final moins contexte de départ).

## 3. Optimisations

Mode d'emploi : une ligne par optimisation. Les gains sont ESTIMÉS sur la journée du 06/11 (2 boucles, 5 passes, 15 agents). La dernière colonne situe la ligne face à l'étude du 29/10. « Retenue » renvoie au retour ouvert en section 6.

| Optimisation | Gain de qualité (ESTIMÉ) | Gain de temps (ESTIMÉ) | Risque de perte de défauts graves | Journaux qui la soutiennent ou la contredisent | Face à l'étude du 29/10 |
|---|---|---|---|---|---|
| O1. Fiche de prémisses vérifiée une fois, donnée aux relecteurs (retenue, TF-2236) | neutre à léger gain : l'attention va au texte | 150 000 à 200 000 jetons ; 1 à 2 min par passe | moyen : une prémisse fausse ou absente aveugle tous les relecteurs ; 5 des 8 majeurs de la passe 1 du 06/11 venaient de prémisses | soutient : 68 % des appels répétés (06/11) ; contredit : M2, M3, M5 trouvés par ces vérifications | ajoute : l'étude ne mesurait pas le coût des relecteurs |
| O2. Score de passe à la moyenne des relecteurs, bruit toléré égal au bruit mesuré (retenue, TF-2237) | évite des rejets à tort : 3 des 9 rejets à −2 points | 0 jeton ; évite une passe de reprise | faible : une vraie régression passe par un bloquant à 40, toujours rejeté | soutient : 20 journaux, médiane d'écart 3 ; passe rejetée du 06/11 ; contredit : aucun | confirme le bruit de 0 à 6 points ; contredit le plafond de 2 posé après |
| O3. Arrêt atteignable : 0 bloquant, 0 majeur dans le texte de la dernière correction, majeurs restants listés (retenue, TF-2238) | arrêt honnête : la cible affichée devient vérifiable | 0 à 1 passe par boucle, environ 200 000 jetons et 10 min | moyen : livrer des majeurs connus, ce qui se fait déjà (médiane 5,5) | soutient : 0 passe sur 59 à l'arrêt actuel ; contredit : aucun | ajoute : l'étude ne testait pas la règle d'arrêt |
| O4. Garde de longueur cumulée depuis la passe 1, par exemple +30 % (retenue, TF-2239) | moins de texte neuf, moins de défauts créés | 5 000 à 10 000 jetons par relecteur ; 50 000 par boucle | moyen : un ajout nécessaire refusé laisse un majeur ouvert | soutient : 16 boucles sur 20 au-delà de 15 % ; 15 graves sur 22 dans le texte ajouté ; contredit : les gains de 38 et 39 points se font avec la longueur | confirme : la variante C, la plus longue, ne gagne pas sur B |
| O5. Jugement apparié : chaque relecteur note les 2 versions, l'ancienne et la nouvelle, sans étiquette (retenue, TF-2240) | supprime le biais de jury dans la décision de garder | coût : +10 000 à 20 000 jetons par relecteur, +1 min | faible : les relecteurs restent neufs et aveugles | soutient : biais de jury de 4 à 7 points ; 7 graves sur 22 anciens et non vus ; contredit : aucun mesuré | prolonge D : le relecteur repris ne devait pas noter, l'apparié note sans changer de juge |
| O6. Type d'agent relecteur dédié, lecture seule, même modèle (retenue, TF-2241) | neutre si consigne et modèle inchangés | environ 29 000 jetons par relecteur, 290 000 pour la journée ; 0 min | faible, à mesurer | soutient : départ 46 000 contre 17 000 pour le vérificateur dédié ; contredit : aucun | ajoute |
| O7. Vérificateur sur le diff : chaque phrase ajoutée a sa prémisse vérifiée (retenue, TF-2242) | environ la moitié des graves de la passe suivante | coût : +10 000 à 15 000 jetons par vérificateur, +1 à 2 min ; gain : 0 à 1 passe | faible : le contrôle s'ajoute | soutient : 11 graves dans le texte que le vérificateur venait de lire ; 0,54 défaut créé par clôture ; contredit : aucun | prolonge C : vérifier la correction marche, il faut vérifier chaque ajout |
| O8. Relecteurs sur un modèle moins cher (non retenue) | inconnu | jetons inchangés ; prix et durée par jeton plus bas, non mesurés | inconnu : aucune mesure | aucun journal n'a de relecteur Sonnet | hors de l'étude ; à tester (section 5) |
| O9. Boucle réservée aux prompts à fort enjeu (non retenue) | aucun sur les prompts bouclés | environ 500 000 jetons par prompt non bouclé | réel sur les autres : 1 relecteur voit 45 à 69 % du stock | gain médian 7,5 ; 38 % des écarts sous 3 points | règle déjà posée par TF-1831 ; décision du porteur au 16/11 |

O8 et O9 ne sont pas retenues : la première n'a aucune mesure, la seconde relève déjà de la règle de revue de TF-1831 et d'une décision humaine.

## 4. Exécution au pilot

La trace existe : session pilote `de1103cb`, lancée en non interactif à 11:05:22. Elle exécute le prompt de 3 004 mots sorti de la boucle d'indice b. À 12:03:43, le dernier appel du modèle date de 11:55:39 et l'étude de 11:54:18 (MESURÉ).

Ce qu'elle a coûté :

- 50 min de 11:05:22 à 11:55:39 ; 124 appels au modèle, 0 agent, 0 compactage (MESURÉ).
- Contexte de 54 185 à 382 012 jetons ; 142 615 jetons de sortie (MESURÉ).
- Étape 0 : 24 min, de 11:05:55 à 11:30:06, selon l'étude elle-même : référence et instantané de 14 dépôts.
- L'étude fait 12 943 mots pour un prompt de 3 004. L'annexe A, 56 blocs de recherches « absent », en porte 3 483 ; l'annexe B, l'instantané détaillé, 2 168 (MESURÉ, `wc -w`). Les annexes font 44 % du document : le contrat 3 du prompt demande chaque « absent » avec sa commande.

Respect du contrat de sortie :

| Item | Vérifié par cette étude | Déclaré par l'étude exécutée |
|---|---|---|
| 1, 3, 4, 5, 6 | non rejoué | tenu |
| 2. Réfutations avant mesures | non rejoué | tenu, écart déclaré : H1 réutilise des recherches faites avant ses réfutations |
| 7. Retours au registre | 9 sur 9 trouvés, TF-2225 à TF-2233 (MESURÉ, `grep -c`) | tenu |
| 8. Décision réservée | D-178 présente 1 fois à `decisions/REGISTRE.jsonl` (MESURÉ) | tenu |
| 9. Instantané de fin | non rejoué | écart : forge-design changée par le commit d'une autre session |
| 10. Noms réels et jetons | `grep -ilEf <motifs.txt>` sur l'étude et son JSON : aucun fichier (MESURÉ) | tenu |

Ce qui aurait évité les écarts :

- Item 2 : placer les réfutations attendues dans l'étape 0, avant toute recherche. Le prompt les plaçait en A, après l'étape 0 qui faisait déjà les recherches de la matrice.
- Item 9 : borner l'instantané aux écritures de la session, prouvées par son propre journal de commandes. Le prompt supposait un parc sans autre session ; une autre session a enregistré un commit dans forge-design à 11:30, pendant le run.
- Coût : la moitié du temps passe dans l'étape 0. Un instantané limité aux dépôts que le prompt lit, et des preuves « absent » en sidecar JSON plutôt qu'en annexe Markdown, auraient réduit les deux.

## 5. Expérience proposée pour la revue du 16/11

Non lancée. Elle compare la règle D-111 (a) à 3 variantes, sur un même prompt de départ, sous un jury fixe.

**Étape 1, à sec (0 jeton).** Rejouer les décisions des 20 journaux sous O2 et O3 : quelles passes rejetées seraient gardées, quels arrêts changeraient. Un script lit les journaux ; aucun agent.

**Étape 2, avec agents.** Départ : la passe 1 de la boucle d'indice a du 06/11 (1 189 mots, 8 majeurs recomptés). Ses défauts servent d'entrée commune ; 2 passes par variante.

| Variante | Règle | Jetons (ESTIMÉ) |
|---|---|---|
| T, témoin | D-111 (a) telle qu'en service | 420 000 |
| V1, coût | T + fiche de prémisses (O1) + relecteur dédié (O6) | 250 000 |
| V2, qualité | T + vérificateur sur le diff (O7) + garde cumulée de 30 % (O4) | 450 000 |
| V3, décision | T + jugement apparié (O5) + moyenne et bruit mesuré (O2) + arrêt O3 | 480 000 |
| Jury | 3 relecteurs Opus neufs et aveugles par version finale, consigne du jury du 29/10 ; recompte de l'union de leurs graves | 4 × 3 × 95 000 = 1 140 000 |

Budget : 2 740 000 jetons estimés, plafond de 3 000 000. Le plafond atteint, l'expérience s'arrête et rend ce qu'elle a. Un second prompt de départ, pour T et la meilleure variante seulement, coûterait 900 000 de plus, sur décision du porteur.

**Seuil de décision, fixé avant tout lancement :**

- Critère premier : les graves recomptés dans la version finale, union du jury. Le score médian est second ; un écart de score de 6 points ou moins est du bruit (dispersion maximale d'un jury, 29/10).
- « Pas pire » : graves au plus ceux de T + 1, aucun bloquant, médiane au moins celle de T − 6.
- V1 est adoptée si elle est « pas pire » et coûte au plus 70 % des jetons de T.
- V2 est adoptée si ses graves sont au plus ceux de T − 2, sans bloquant.
- V3 est adoptée si l'étape 1 change au moins 3 décisions sur 20 journaux et si V3 est « pas pire ».
- Sinon, la règle D-111 (a) reste telle quelle, et le résultat est écrit au registre sous TF-2026.

Limites : un seul prompt de départ, un jury neuf par version, la dispersion entre jurys non mesurée. Les mêmes que le 29/10, que le second prompt optionnel réduit en partie.

## 6. Retours ouverts

Écrits par `node todo/journaliser.mjs --fichier <evenements.json>`, joué d'abord avec `--essai`. Le fichier d'événements vit dans un dossier temporaire hors des dépôts. Statut `candidat`, forge destinataire `digit-ai-forge-agents`.

| Identifiant | Optimisation | Classe |
|---|---|---|
| TF-2236 | O1, fiche de prémisses vérifiée une fois | à créer : `agent-remesure-ce-qu-un-autre-a-deja-mesure` |
| TF-2237 | O2, score moyen et bruit toléré mesuré | à créer : `boucle-decide-sous-le-bruit-de-ses-juges` |
| TF-2238 | O3, arrêt atteignable | à créer : `boucle-decide-sous-le-bruit-de-ses-juges` |
| TF-2239 | O4, garde de longueur cumulée | `amelioration-jugee-sans-ses-effets` |
| TF-2240 | O5, jugement apparié | à créer : `boucle-decide-sous-le-bruit-de-ses-juges` |
| TF-2241 | O6, type d'agent relecteur dédié | à créer : `agent-remesure-ce-qu-un-autre-a-deja-mesure` |
| TF-2242 | O7, vérificateur sur le diff | `amelioration-jugee-sans-ses-effets` |

Aucun ne modifie le skill avant le 16/11 : l'essai D-111 (a) court jusque-là.

## Contrôles du contrat de sortie

Joués entre 12:08 et 12:10, après la dernière écriture de fond.

| Item | Preuve | Verdict |
|---|---|---|
| 1. Étape 0 écrite | section 0 : 8 commandes, sorties résumées, heures | tenu |
| 2. Hypothèses jugées | H1 à H5, chacune avec verdict et chiffre décompté des journaux | tenu |
| 3. Coût par rôle | 835 459 + 198 215 = 1 033 674, égal à la liste du contexte | tenu, écart 0 % |
| 4. Tableau des optimisations | script de contrôle : 9 lignes, 6 cellules chacune, 0 vide | tenu |
| 5. Question 2 | section 4, trace mesurée | tenu |
| 6. Expérience | plafond de 3 000 000 jetons, seuil fixé en section 5 | tenu |
| 7. Retours au registre | `grep -c` : TF-2236 à TF-2242, 1 création chacun ; `journaliser.mjs` PASS avant et après ; `node todo/oracle-todo.mjs` exit 0 | tenu |
| 8. Skill inchangé | `git status --porcelain` du skill vide à 11:51:41 et à 12:10:12, HEAD `afcbffc` aux deux | tenu |
| 9. Aucun nom réel | `grep -inEf <motifs.txt>` sur l'étude : exit 1, aucune ligne ; même motifs sur les lignes ajoutées au registre : 0 | tenu |

Le fichier `<motifs.txt>` vit dans le scratchpad de la session, hors des dépôts : 14 motifs, sha256 `f2bef2f39c6744669dcc8867694147b03d2311e57ef31683bc846c7ccfec120d`.

Oracles du protocole : `node oracles/oracle-ecriture.mjs` PASS, avec des avertissements de longueur de phrase et de paragraphe (EC-2, EC-14) ; `check_markdown.py` PASS sur M7, M10, M14 et M18. Boucle bornée : passe 1 au vert sur les oracles ; 6 corrections de fond faites à la relecture avant les oracles (heure de la boucle 2, gain d'O3, ligne O8, densité du texte ajouté, commit concurrent, heure du relevé d'ouverture), et 1 après (un sigle d'audit retiré).
