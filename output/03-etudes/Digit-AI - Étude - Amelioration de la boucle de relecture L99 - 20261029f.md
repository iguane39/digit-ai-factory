# Amélioration de la boucle de relecture L99 : ce que l'expérience du 29/10/2026 a mesuré

Étude du 29/10/2026, pilot `digit-ai-factory`, session pilote Claude Opus 5.5. Elle exécute le prompt réécrit de la revue `Digit-AI - Revue - Prompt amelioration de la boucle de relecture passe au crible L99 - 20261029b.md`, lancé sur la réponse « A1 » du porteur. Données complètes : le fichier `.experience.json` à côté de cette étude.

## Ce qui change pour le lecteur

Aucune des trois variantes testées ne bat le prompt de départ d'un écart plus grand que le bruit de mesure. Le skill `prompt-analyzer-l99` reste donc tel quel, comme le prévoyait la règle de l'expérience. L'expérience apprend pourtant trois choses utiles. Un juge différent change la note de 4 à 7 points sans toucher au prompt. Chaque correction crée des défauts neufs, y compris la correction qui répare ceux de la précédente. Et trois jurés trouvent beaucoup plus de défauts que deux relecteurs.

## Le protocole

L'expérience part du prompt de la passe 5 de la revue `20261029a` (1 537 mots). Toutes les variantes sont notées par un jury de même configuration : 3 agents neufs et aveugles par prompt noté, modèle opus, effort high, même consigne et même rubrique que les relecteurs de la boucle. Le score d'un prompt est la médiane des 3 notes.

Les défauts qui alimentent les corrections sont ceux des 2 relecteurs de la passe 5, déjà au journal. Chaque correction est écrite par un agent neuf, qui ne reçoit que le prompt de départ et les défauts de sa variante.

Comment lire le tableau : une ligne par variante, avec la règle de retenue des défauts, ce qui a été corrigé, puis le résultat du jury.

| Variante | Règle | Défauts corrigés | Mots | Notes du jury | Médiane | Gain |
|---|---|---|---|---|---|---|
| Départ | aucune correction | 0 | 1 537 | 74, 74, 76 | 74 | — |
| A | vu par les deux relecteurs (règle actuelle) | 3 | 1 639 | 77, 77, 77 | 77 | +3 |
| B | vu par au moins un relecteur, vérifié à la source | 5 | 1 761 | 74, 79, 80 | 79 | +5 |
| C | comme B, puis un vérificateur avec contexte et une seconde correction | 5 + 4 | 1 973 | 76, 79, 82 | 79 | +5 |

Les variantes E, quatre relecteurs, et D, un ancien et un nouveau relecteur, n'ont pas été jouées : elles attendent l'accord du porteur, avec leur devis.

## Le bruit de mesure

Le seuil de victoire fixé avant l'expérience était l'écart maximal entre les 5 notes connues du prompt de départ : les 3 du jury (74, 74, 76) et les 2 de la passe 5 (81 et 78). Cet écart vaut 7 points. Aucune variante ne gagne 7 points ; aucune ne « marche » au sens fixé d'avance.

Le seuil mélange deux choses, et l'expérience permet de les séparer :

- **le biais de configuration** : les relecteurs de la passe 5 notaient 78 et 81 ; le jury, avec une consigne aux chemins et interdits adaptés, note le même texte 74 à 76. Changer de juge déplace la note de 4 à 7 points ;
- **la dispersion d'un même jury** : 2 points sur le prompt de départ, 0 sur A, 6 sur B et sur C.

Avec le seul bruit du jury, de 2 à 6 points, l'avance de B et C sur A (2 points) reste dans le bruit. Leur avance sur le départ (5 points) le dépasse sur la dispersion du départ, pas sur celle de B et C.

## Ce que montrent les variantes

**Retenir les défauts vus par un seul relecteur aide un peu, sans preuve.** A, qui écarte les 2 défauts vus par un seul relecteur, gagne 3 points ; ses 3 jurés retrouvent tous ces 2 défauts. B les corrige et gagne 5 points ; ses jurés ne les citent plus. L'écart de 2 points entre A et B est dans le bruit, mais la direction concorde avec les deux boucles du jour : 13 des 14 défauts écartés de la première boucle étaient réels.

**Vérifier une correction marche, mais la correction suivante recrée des défauts.** Le vérificateur de C a confirmé les 5 clôtures de B et trouvé 4 défauts créés par la correction, dont une commande qui sortait en erreur d'usage (`--preparer coherence` sans fichier). Un juré de B a retrouvé l'un de ces 4 défauts, sans avoir vu le vérificateur. La seconde correction les a fermés, mais en a créé un nouveau : les 3 jurés de C relèvent que la source citée pour estimer le coût des relectures, `todo/relectures-intention.jsonl`, ne porte ni jetons ni durée. Résultat : même médiane que B, 212 mots de plus.

**Trois jurés voient beaucoup plus que deux relecteurs.** Les 2 relecteurs de la passe 5 retenaient 5 défauts majeurs à eux deux. Les 3 jurés du prompt de départ en relèvent 8 distincts de ces 5, par exemple la double définition de la borne de jetons, l'emplacement non tranché du planificateur, ou des fixtures versées dans un dépôt public sans contrôle des noms. Plusieurs reviennent chez les jurés des trois variantes, que personne n'a corrigées. La couverture d'un relecteur seul est partielle, et chaque relecteur de plus en ajoute.

## Ce que cela dit des pistes du porteur

- **Un relecteur repris avec son contexte** : il sert comme vérificateur de clôture (variante C), et il y est efficace pour trouver ce que la correction casse. Il ne doit pas noter : le biais de configuration mesuré ici montre qu'un juge différent change la note.
- **Un nouveau et un ancien relecteur à chaque tour** : non joué. L'ancien, dans ce schéma, fait le travail du vérificateur de C.
- **Trois ou quatre relecteurs** : le jury à 3 trouve plus de défauts que la paire de relecteurs. C'est le signe le plus net de l'expérience en faveur de la variante E, mais il porte sur la découverte des défauts, pas sur la note.

## Limites

- Un seul cas pratique, un seul prompt de départ, une seule passe de correction par variante.
- Les défauts qui alimentent A, B et C viennent de relecteurs pris avec une consigne légèrement différente de celle du jury.
- Le jury de chaque variante est neuf : la dispersion entre jurys n'est pas mesurée, seulement la dispersion au sein d'un jury.

## Coût mesuré

1 507 706 jetons, sous le plafond de 2 000 000 : 12 jurés (1 182 811), 3 correcteurs (218 721), 1 vérificateur (80 826), 1 relecture d'intention de la consigne (25 348). Jetons rendus par chaque agent à sa fin.

## Suite proposée

Le résultat ne justifie pas de changer la règle du skill sur ce seul cas. Les deux leviers les plus prometteurs, la retenue à l'union recomptée et la vérification de chaque correction, sont peu coûteux et vont dans le même sens que les deux boucles du jour ; ils se mesureront mieux sur plusieurs prompts que par d'autres variantes sur celui-ci. La revue datée de la boucle L99, le 16/11/2026 (sujet TF-1831 du registre), est le lieu prévu pour les reprendre avec plus de cas.
