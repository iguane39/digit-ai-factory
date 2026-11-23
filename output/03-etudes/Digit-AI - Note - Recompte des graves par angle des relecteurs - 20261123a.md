---
role: étape à sec de l'étude 20261122b, décidée par D-233 (a)
destinataire: humain
lecteur: le porteur de la Factory, qui doit savoir si le banc de 3 textes contre 3 bras part ou non
emetteur: agent redacteur (famille sonnet), sur mandat de la session pilote
verdict_arbitre:
  - "Gabarit : note libre à en-tête de provenance, la consigne n'en nomme pas d'autre. Oracle joué : oracle-ecriture 1.2.0 PASS, avertissements restants EC-19 (2 phrases de plus de 25 mots, dont la citation du porteur) et EC-13 (revue de la donnée tics, hors de ce texte) — ✓"
  - "Chaque chiffre porte sa source : lignes de l'étude 20261122b, du registre et de 20261115a, ou script rejoué dans le dossier de travail ; recompte à la main du journal 20261121p identique au script — ✓ sous les réserves ci-dessous"
  - "Seul ce fichier est écrit sous le dépôt ; scripts et sorties vivent dans le dossier de travail de la session — ✓"
hypotheses_non_resolues:
  - "Étiquetage par angle : règle posée par ce recompte, lue sur la citation et le recompte de chaque journal ; lecture large du lecteur visé (33,7 %) et lecture maximale (59,5 %) données en sensibilité"
  - "10 journaux sur 39 (29 passes, 207 graves) ne notent pas qui a vu quoi : hors des comptes A, B et AB"
  - "Les textes des passes ont disparu (0 fichier sur 155) : l'angle texte neuf tient aux seuls marqueurs des journaux"
  - "Corpus de TF-2237 (48 journaux, 143 passes) non retrouvé à l'identique : écart de 1 journal et 3 passes inexpliqué"
  - "Départ de contexte du type relecteur (3e geste de l'étape à sec) non mesuré : hors de ce mandat"
---

# Recompte des graves par angle des relecteurs — 20261123a

## Ce qui change pour vous

Le seuil n'est pas passé, le banc ne part pas. Une des deux conditions de l'étude 20261122b est tenue, l'autre ne l'est pas.

Deux généralistes laissent passer beaucoup de graves : la couverture estimée est de 54,8 %, pour un seuil à 85 %. Mais aucun angle ne regroupe plus de la moitié des graves qui échappent à un relecteur. Les deux angles non couverts par un essai en cours pèsent 0,8 % et 3,5 %.

Aucune action n'est attendue de vous. Une seule lecture de l'étiquetage, la plus large, renverserait le verdict : elle est écartée plus bas et signalée comme décision possible.

Recompte du 23/11/2026, relevé à 10:00 (commande `date`). Il exécute D-233 (a). Le porteur a retenu, mot pour mot : « je recompte les journaux et étiquette chaque grave par angle ; le banc de 3 textes contre 3 bras ne part que si le seuil est passé ».

## Ce qui a été recompté

La définition vient de l'étude 20261122b, l.195 à l.202, appliquée telle quelle. Le seuil est posé d'avance à l.202 : deux conditions réunies.

- La couverture de deux généralistes, estimée par Chao sur ces journaux, est inférieure à 85 %.
- Une étiquette d'angle regroupe plus de la moitié des graves qui échappent à au moins un relecteur, sans être déjà couverte par TF-2236 ou TF-2242.

Périmètre : tous les fichiers `*.boucle.json` sous `C:\dev` (230 fichiers, worktrees compris), recherchés par `find`. Le schéma est `l99-boucle@1` pour les 230. 3 règles les ramènent à des journaux distincts.

- Un nom de fichier vaut un journal. Quand des copies d'un même nom diffèrent, la plus complète est gardée (le plus de passes, puis la plus récente).
- Des noms au contenu identique valent un journal : 20261114l et 20261114m, puis 20261116b, 20261116c et 20261116d.
- 20261114f est retiré : ses 47 défauts sont les mêmes que ceux de 20261114g, même boucle rejouée.

Résultat : 39 journaux, 116 passes, 781 graves retenus (annexe). Un grave est un défaut de sévérité bloquant ou majeur, au statut `retenu` (même règle que `releve-boucles.mjs` l.33, dans la forge `digit-ai-forge-agents`).

Le champ `vu_par` de chaque défaut dit quel relecteur l'a vu. Il existe dans 29 journaux, soit 87 passes et 572 graves. Les 10 autres journaux, 29 passes et 207 graves, ne le portent pas : ils sortent des comptes (liste en annexe). Dans les 87 passes, chacune compte exactement 2 relecteurs.

Les comptes se rejouent par `recompte.mjs` et `final.mjs`, rangés dans `C:\Users\iguan\AppData\Local\Temp\claude\14c1dda92227c354\fd3aedb0-8c30-41f5-81c0-bd06b7cfa1ef\scratchpad\agent-recompte\`. La sortie des chiffres est dans `final-sortie.txt` du même dossier. Un recompte à la main du journal 20261121p (passes 1 à 3) rend les mêmes A, B et AB que le script.

## Comptes A, B et AB, et couverture

A est le nombre de graves vus par le premier relecteur d'une passe, B par le second, AB par les deux. S = A + B − AB.

| Total sur 87 passes | Valeur |
|---|---|
| A | 347 |
| B | 429 |
| AB | 204 |
| S, graves vus par au moins un | 572 |
| Vus par un seul relecteur | 368 |

Sur la couverture, l'étude demande Chao, calculé par passe puis sommé, comme pour Chapman (l.197). Le tableau donne aussi les autres estimateurs, pour borner le résultat.

| Estimateur | Stock estimé | Couverture S / stock |
|---|---|---|
| Chao par passe, sommé (retenu) | 1 044,7 | 54,8 % |
| Chao sur les comptes cumulés | 901,4 | 63,5 % |
| Chao, passes avec AB > 0 seules (73 passes) | 735,7 | 66,6 % |
| Chapman par passe, sommé | 818,7 | 69,9 % |
| Lincoln-Petersen par passe, 73 passes avec AB > 0 | 705,9 | 69,4 % |
| Lincoln-Petersen sur les sommes, mêmes 73 passes | 584,2 | 83,9 % |

Les six valeurs sont sous 85 %. Le plus haut, 83,9 %, vient de l'estimateur qui suppose des captures indépendantes. Il est donc le plus optimiste pour deux copies d'un même agent (étude 20261122b, l.91). La condition 1 est tenue.

Vérification demandée au premier geste (l.197) : l'étude du 06/11 donne 45 %, 69 % et 73 % (20261106b, l.57), qui ne se recoupent pas. Sur ces journaux, la part moyenne par passe de ce que l'un voit de l'autre est de 56 % et 67 %. Avec ces parts, l'union serait de 85 % si les relecteurs étaient indépendants. Le rapport des sommes par passe donne 69,4 %. L'écart vient du mode d'agrégation, ce que l'étude supposait à l.101. Le même motif se retrouve, sur un autre échantillon (73 passes, non 17).

Les graves qui échappent aux deux relecteurs ne se lisent pas dans un journal. Chapman et Chao en estiment 247 et 473 (stock estimé moins S) : des ordres de grandeur, non des graves étiquetables.

## Graves qui échappent à un relecteur, par angle

Population : les 368 graves vus par un seul relecteur. Chacun reçoit une seule étiquette, par la première règle qui s'applique, lue sur sa citation et son recompte.

| Étiquette | Règle | Graves | Part |
|---|---|---|---|
| Texte neuf | le journal marque le défaut comme créé par une correction (`origine` ou `cree_par_la_correction`) | 6 | 1,6 % |
| Indéterminé | le recompte se borne à constater que la citation est présente, sans dire la nature du défaut | 57 | 15,5 % |
| Prémisse | le recompte confronte le prompt à une source hors de lui : commande, fichier, journal, diapositive, norme | 140 | 38,0 % |
| Intention | le recompte compare le prompt à la demande de son auteur | 3 | 0,8 % |
| Lecteur visé, lecture étroite | le recompte décrit une conséquence à l'exécution ou une ambiguïté (« passent à vide », « écarté à tort », « ambigu ») | 13 | 3,5 % |
| Autre, lacune statique | une absence ou un terme non défini, constatés par lecture ou par `grep` du prompt | 111 | 30,2 % |
| Autre, reste | contradiction interne, chiffre ou format | 38 | 10,3 % |
| Total | | 368 | 100 % |

L'étiquetage demande un jugement, et voici sa règle. Une étiquette d'angle ne se pose que sur une preuve lisible dans le journal. Sans elle, le grave reste dans « indéterminé » ou « autre ».

Contrôle de l'étiquetage : les 13 graves du lecteur visé et les 3 de l'intention ont été relus un par un. 1 des 13 est mal étiqueté : c'est une lacune statique sur R-25. Sur les 140 de la prémisse, 24 ont été relus. 1 est mal étiqueté : un comptage des points du contrat du prompt, qui relève de « autre ». Ces erreurs pèsent moins de 1 point de part.

L'étiquetage a deux limites.

- Les textes des passes ont disparu. Aucun des 155 fichiers de passe désignés par les journaux (52 contenus avant dédoublonnage) n'existe plus, vérifié par `fs.existsSync`. Le test de citation de l'étude du 06/11 (15 graves sur 22 dans un texte de correction) ne se rejoue donc pas. Texte neuf n'a que 6 graves marqués.
- Les angles texte neuf et prémisse sont de toute façon couverts par TF-2242 et TF-2236 (registre l.8048 et l.8046, au statut `en_cours`). Leur part exacte ne change pas la condition 2.

## Comparaison au seuil

| Condition | Mesure | Seuil | Verdict |
|---|---|---|---|
| 1. Couverture de deux généralistes, Chao | 54,8 % | moins de 85 % | tenue |
| 2. Un angle non couvert regroupe plus de la moitié des 368 graves | 3,5 % pour le lecteur visé, 0,8 % pour l'intention | plus de 50 % | non tenue |

La condition 2 décide. Le plus gros angle non couvert est le lecteur visé, à 3,5 %, très loin de 50 %.

Sensibilité du lecteur visé, pour dire jusqu'où l'étiquetage pèse sur le verdict.

| Lecture du lecteur visé | Graves | Part | Verdict |
|---|---|---|---|
| Étroite (règle ci-dessus) | 13 | 3,5 % | non tenue |
| Large : plus les 111 lacunes statiques | 124 | 33,7 % | non tenue |
| Maximale : plus les 38 « autre, reste » et les 57 indéterminés | 219 | 59,5 % | tenue |

Je retiens la lecture étroite, et la large ne change pas le verdict. La lecture maximale verse 95 graves sans preuve, car le journal ne dit pas leur nature. Elle fait aussi du lecteur visé tout ce que les généralistes relèvent déjà par lecture statique : l'angle ne se distinguerait plus d'eux. Aucun indice écrit dans les journaux ne la fonde. Si vous la préférez, le verdict devient « le banc part ». C'est le seul point où votre arbitrage peut le renverser.

## Verdict

Le seuil n'est pas passé, le banc ne part pas.

## Étude du 15/11 sur les affirmations ajoutées (4e geste)

L'étude `Digit-AI - Étude - Preuve de chaque affirmation ajoutée par une correction - 20261115a.md` est lue. Elle ne tranche pas l'angle « texte neuf » : elle ne mesure aucun rappel par relecteur.

Elle estime que 10 des 11 défauts créés échappés aux vérificateurs sont des affirmations ajoutées sans preuve (l.53, estimation de son auteur). Elle recommande l'option O2 (l.119). Son test coûte environ 450 000 jetons, avec un seuil de 2 graves de moins que le témoin. Il est dû avant la revue du 14/12/2026 (l.121 et l.123). Ce seuil est celui de TF-2242 (registre l.8048, « le banc du 15/11 rejoué avec au moins 2 défauts graves de moins »).

## Non vérifié

- Corpus de TF-2237 : 48 journaux et 143 passes (registre l.8038). Ici 52 contenus et 155 passes avant de ne garder qu'une version par nom. Trois journaux sont postérieurs au 16/11 (20261121g, 20261121p, 20261122a, 9 passes), ce qui ramène à 49 et 146. L'écart d'un journal et de 3 passes reste inexpliqué.
- Le 3e geste de l'étape à sec n'est pas joué. Il mesure le départ réel du type `relecteur` (critère de TF-2241, sous 25 000 jetons) sur le transcript d'une boucle de test, hors de ce mandat.
- La formule de Chao suit celle de l'étude (l.158), non revérifiée en ligne.
- Un grave vu par un seul relecteur peut avoir été vu par l'autre à la passe suivante. Chaque passe est comptée seule, comme l'étude le fait.

## Annexe : les 39 journaux recomptés

Chaque ligne donne l'indice du fichier (R-4), le produit, le sujet, le nombre de passes, les graves retenus et les graves attribués à un relecteur (S). « sans vu_par » : le journal ne dit pas qui a vu quoi. Il sort des comptes A, B et AB.

| Indice | Produit | Sujet | Passes | Graves | S |
|---|---|---|---|---|---|
| 20261016b | Digit-AI | Competences Supabase dans les forges | 2 | 5 | sans vu_par |
| 20261029a | Digit-AI | strategie de lancement des agents | 5 | 20 | 20 |
| 20261029b | Digit-AI | amelioration de la boucle de relecture | 4 | 17 | 17 |
| 20261030a | Produit-84 | Ecarts de hpr a la Design Review | 3 | 26 | 26 |
| 20261030b | Produit-84 | Ecarts de hpr a la Design Review | 2 | 9 | 9 |
| 20261102a | Digit-AI | tri des sujets TikTok et skill | 2 | 14 | 14 |
| 20261102d | Digit-AI | skill make-it-better | 4 | 31 | 31 |
| 20261102j | Digit-AI | pentest automatise de bout en bout | 2 | 8 | sans vu_par |
| 20261103c | Digit-AI | competences OpenAI et Gemini | 3 | 19 | 19 |
| 20261104a | Digit-AI | apprentissage des erreurs | 3 | 14 | 14 |
| 20261104c | Digit-AI | suivi des temps et couts des produits | 3 | 14 | 14 |
| 20261105a | Produit-84 | Couts de Build Azure face a l'architecture alternative | 2 | 21 | 21 |
| 20261105a | Client-A | pack sans ADR generes | 3 | 19 | 19 |
| 20261105a | Produit-86 | revue du porteur du 05-11 | 2 | 18 | 17 |
| 20261105b | Client-A | audit des regles de developpement et de deploiement | 4 | 21 | 21 |
| 20261105b | Produit-86 | tests de bout en bout et retrait de la machine Azure | 4 | 34 | sans vu_par |
| 20261105e | Produit-84 | Couts de Build Azure face a l'architecture alternative | 3 | 25 | 25 |
| 20261105f | Produit-84 | Reprise d'activite et sauvegarde | 3 | 21 | 21 |
| 20261106a | Produit-84 | Securite par defaut dans la Factory | 3 | 20 | 20 |
| 20261106b | Produit-84 | Securite par defaut dans la Factory | 2 | 10 | 10 |
| 20261106g | Produit-84 | Optimisation de la boucle d'agents L99 | 1 | 7 | 7 |
| 20261109a | Produit-02 | suivi piscine | 3 | 29 | sans vu_par |
| 20261109b | Digit-AI | série d'animations de la Factory | 4 | 21 | 21 |
| 20261109b | Produit-86 | périmètre et profondeur des pentests | 2 | 24 | 24 |
| 20261112a | Produit-82 | portail unique | 3 | 30 | sans vu_par |
| 20261112a | Digit-AI | suivi d avancement des agents | 3 | 19 | 19 |
| 20261112a | Digit-AI | LinkedIn des clips | 4 | 30 | sans vu_par |
| 20261112i | Produit-79 | questions sur le relais Codex | 3 | 20 | sans vu_par |
| 20261113d | Produit-79 | refonte du relais Claude et Codex | 3 | 28 | sans vu_par |
| 20261114a | forge-digit-ai-fr | refresh du site et clips LinkedIn | 3 | 30 | 30 |
| 20261114g | forge-digit-ai-fr | retours sur la direction B et les contenus | 5 | 42 | 41 |
| 20261114i | forge-digit-ai-fr | coordination des sessions multiples | 2 | 6 | sans vu_par |
| 20261114k | forge-digit-ai-fr | defauts crees par les corrections des agents | 5 | 26 | 26 |
| 20261114m | forge-digit-ai-fr | amelioration continue des agents par leurs lecons | 3 | 16 | 16 |
| 20261114o | forge-digit-ai-fr | textes de la page forge des tests à refaire | 2 | 16 | 16 |
| 20261116d | forge-digit-ai-fr | traduction du site en six langues et SEO GEO | 2 | 20 | 20 |
| 20261121g | Digit-AI | mise a jour competences | 3 | 17 | sans vu_par |
| 20261121p | Digit-AI | plan multi-agents | 3 | 13 | 13 |
| 20261122a | Produit-12 | brouillons | 3 | 21 | 21 |
| Total | | 39 journaux | 116 | 781 | 572 |
