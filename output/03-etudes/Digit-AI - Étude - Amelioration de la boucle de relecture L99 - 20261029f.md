# Amélioration de la boucle de relecture L99 : ce que l'expérience du 29/10/2026 a mesuré

Étude du 29/10/2026, pilot `digit-ai-factory`, session pilote Claude Opus 5.5. Elle exécute le prompt réécrit de la revue `Digit-AI - Revue - Prompt amelioration de la boucle de relecture passe au crible L99 - 20261029b.md`, lancé sur la réponse « A1 » du porteur, puis prolongé par les variantes E et D sur sa réponse « 110c » à la décision D-110. Données complètes : le fichier `.experience.json` à côté de cette étude.

## Ce qui change pour le lecteur

Aucune des cinq variantes ne bat le prompt de départ d'un écart plus grand que le bruit de mesure fixé d'avance. Le skill `prompt-analyzer-l99` reste donc tel quel. Mais la variante qui corrige le plus de défauts, E, nourrie par quatre relecteurs, finit la plus basse : 40, contre 74 au départ. Sa correction a introduit un défaut bloquant, celui-là même qu'un vérificateur avait attrapé dans la variante C. Le levier le plus utile n'est donc pas d'ajouter des relecteurs. C'est de vérifier chaque correction avant de la garder : plus on corrige de défauts à la fois, plus la correction risque d'en créer un grave.

## Le protocole

L'expérience part du prompt de la passe 5 de la revue `20261029a` (1 537 mots). Toutes les variantes sont notées par un jury de même configuration : 3 agents neufs et aveugles par prompt noté, modèle opus, effort high, même consigne et même rubrique que les relecteurs de la boucle. Le score d'un prompt est la médiane des 3 notes.

Chaque correction est écrite par un agent neuf, qui ne reçoit que le prompt de départ et les défauts de sa variante. Pour tenir la dépense, les relecteurs qui fournissent les défauts sont repris de relectures déjà faites sur ce même prompt : les 2 relecteurs de la passe 5 pour A, B et C ; ces 2 et 2 jurés du départ pour E ; le troisième juré du départ pour D, avec un relecteur repris.

Comment lire le tableau : une ligne par variante, avec la règle de retenue des défauts, ce qui a été corrigé, puis le résultat du jury.

| Variante | Règle | Défauts corrigés | Mots | Notes du jury | Médiane | Gain |
|---|---|---|---|---|---|---|
| Départ | aucune correction | 0 | 1 537 | 74, 74, 76 | 74 | — |
| A | vu par les deux relecteurs (règle actuelle) | 3 | 1 639 | 77, 77, 77 | 77 | +3 |
| B | vu par au moins un relecteur, vérifié à la source | 5 | 1 761 | 74, 79, 80 | 79 | +5 |
| C | comme B, puis un vérificateur avec contexte et une seconde correction | 5 + 4 | 1 973 | 76, 79, 82 | 79 | +5 |
| D | un relecteur neuf et un relecteur repris avec son contexte, retenue comme B | 7 | 1 675 | 76, 78, 80 | 78 | +4 |
| E | quatre relecteurs, retenue comme B | 10 | 1 849 | 40, 40, 76 | 40 | −34 |

## Le bruit de mesure

Le seuil de victoire fixé avant l'expérience était l'écart maximal entre les 5 notes connues du prompt de départ : les 3 du jury (74, 74, 76) et les 2 de la passe 5 (81 et 78). Cet écart vaut 7 points. Aucune variante ne gagne 7 points ; aucune ne « marche » au sens fixé d'avance.

Le seuil mélange deux choses, et l'expérience permet de les séparer :

- **le biais de configuration** : les relecteurs de la passe 5 notaient 78 et 81 ; le jury, avec une consigne aux chemins et interdits adaptés, note le même texte 74 à 76. Changer de juge déplace la note de 4 à 7 points ;
- **la dispersion d'un même jury** : 0 à 6 points sans défaut bloquant ; 36 points sur E, où 2 jurés sur 3 voient un bloquant qui plafonne la note à 40.

Avec le seul bruit du jury, l'écart entre A, B, C et D (77 à 79) reste dans le bruit. Seule la chute de E le dépasse nettement.

## Ce que montrent les variantes

**Corriger beaucoup sans vérifier peut tout faire tomber.** E corrige 10 défauts, deux fois plus que B. Sa correction écrit que le coût des relectures de réception et de cohérence se mesure sur la campagne de référence, qui n'en contient aucune. Deux jurés sur trois y voient un défaut bloquant. Le même défaut était né dans la correction de B ; le vérificateur de C l'a signalé, et la seconde correction de C l'a réparé. D l'a aussi écrit, et ses 3 jurés le relèvent comme majeur. Sans vérification, deux corrections sur trois ont reproduit la même erreur.

**Vérifier une correction marche, mais il faut vérifier aussi la suivante.** Le vérificateur de C a confirmé les 5 clôtures de B et trouvé 4 défauts créés par la correction, dont une commande qui sortait en erreur d'usage (`--preparer coherence` sans fichier). La seconde correction les a fermés, mais en a créé un nouveau : les 3 jurés de C relèvent que la source citée pour estimer le coût des relectures, `todo/relectures-intention.jsonl`, ne porte ni jetons ni durée. C reste à 79, comme B, et ne tombe pas comme E.

**Retenir les défauts vus par un seul relecteur aide un peu, sans preuve.** A, qui écarte les 2 défauts vus par un seul relecteur, gagne 3 points ; ses 3 jurés retrouvent tous ces 2 défauts. B les corrige et gagne 5 points. L'écart de 2 points est dans le bruit, mais la direction concorde avec les deux boucles du jour : 13 des 14 défauts écartés de la première boucle étaient réels.

**Le relecteur repris voit ce que la correction a cassé.** Dans D, le relecteur qui avait lu la passe 4 juge 3 de ses 4 anciens défauts fermés, et relève que 2 des corrections ont créé des défauts neufs. Il joue le même rôle que le vérificateur de C, sans l'avoir pour consigne. D obtient 78, dans le groupe de tête.

**Plus de relecteurs trouvent plus de défauts.** Les 2 relecteurs de la passe 5 retenaient 5 défauts majeurs ; les 3 jurés du départ en relèvent 8 de plus. Mais trouver plus de défauts ne suffit pas : E en a corrigé 10 et finit la plus basse.

## Ce que cela dit des pistes du porteur

- **Un relecteur repris avec son contexte** : utile pour dire si une correction a fermé les défauts et ce qu'elle a cassé (D et C). Il ne doit pas noter : changer de juge déplace la note de 4 à 7 points.
- **Un nouveau et un ancien relecteur à chaque tour** : D obtient 78, au niveau de B et C. L'ancien relecteur y fait le travail d'un vérificateur de clôture.
- **Trois ou quatre relecteurs** : plus de défauts trouvés, mais E montre le revers. Un lot de corrections plus gros, non vérifié, augmente le risque d'en créer un bloquant. Plus de relecteurs n'aide que si chaque correction est vérifiée.

## Limites

- Un seul cas pratique, un seul prompt de départ, une seule passe de correction par variante.
- Les défauts qui alimentent les variantes viennent de relectures déjà faites, avec des consignes légèrement différentes de celle du jury.
- Le jury de chaque variante est neuf : la dispersion entre jurys n'est pas mesurée, seulement la dispersion au sein d'un jury.
- La chute de E tient à un seul défaut ; une autre correction des mêmes 10 défauts aurait pu l'éviter.

## Coût mesuré

2 360 934 jetons au total, dont 1 507 706 pour le départ et les variantes A, B et C, sous le plafond de 2 000 000, et 853 228 pour E et D, sous le devis de 1 200 000 accepté par le porteur. Détail : 18 jurés, 5 correcteurs, 1 vérificateur, 1 relecteur repris, 2 relectures d'intention de consigne. Jetons rendus par chaque agent à sa fin.

## Suite proposée

Le résultat ne justifie pas de changer la règle par défaut du skill sur ce seul cas, et il désigne la piste à mesurer en premier : vérifier chaque correction avant de la garder, par un vérificateur avec contexte qui ne note pas, et rejeter une passe qui régresse. La retenue des défauts vus par un seul relecteur vient ensuite. Le nombre de relecteurs n'a d'intérêt qu'une fois la vérification en place. La revue datée de la boucle L99, le 16/11/2026 (sujet TF-1831 du registre), est le lieu prévu pour les reprendre sur plusieurs prompts.
