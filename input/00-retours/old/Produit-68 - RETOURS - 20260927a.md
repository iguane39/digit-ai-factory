# Retours forges — Produit-68 — 20260927a

- **Contexte** : retouche de la présentation des 10 points bloquants, le 27/09/2026, sur un retour humain. La carte « Ce qui tient » de la diapositive du verdict, réécrite la veille et remise dans les versions 20260926d et 20260926e, reste « complexe à comprendre ». Le juge persona l'avait jugée floue à 3 lectures, et rien n'avait bloqué sa remise.
- **Références ledger** : `forge\ledger.jsonl`, entrées `type: retour` : seq 291 (RP-71). La seq 289 porte le retour humain, destiné au produit. Contrôle de complétude : les 2 retours au journal de l'étape « retouche-carte-ce-qui-tient » sont dans ce lot, ou cités ici pour la seq 289 ; aucun retour du journal n'est postérieur au lot 20260926b hors de cette étape.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, le 27/09/2026, à la clôture de l'étape.
- **Statut** : remis le 27/09/2026 au sas `<pilot>\input\00-retours\_arrivee\`

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort, précision).

---

## pilot (`digit-ai-factory`)

Le juge persona, proposé la veille sous RP-69 (aucun juge ne vérifie qu'un texte est compris), a vu ce défaut 3 fois. Aucun de ses verdicts n'a arrêté la remise, et l'humain a dû le relever une seconde fois.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-71 — un verdict FLOU du juge persona ne bloque pas la remise | majeur | générique | **Un verdict lu, puis écarté par un motif faux** : la carte « Ce qui tient » est jugée FLOU aux lectures 1, 2 et 3 du 26/09/2026, avec la même question : « 58 quoi ? qui a fait ces demandes ? qu'est-ce que le service central ? ». Elle part dans les versions 20260926d et 20260926e. La revue de lecture la range parmi 8 unités « sans suite : les réécrire changerait un fait de l'audit ». Le 27/09, l'humain écrit : « Cet encart est toujours complexe à comprendre, revois les tournures. » La réécriture du jour ne change aucun fait : elle regroupe autrement les 58 réponses du même relevé et cite 3 gardes du code. Le motif était faux, et rien ne l'a vérifié. Second fait, sur le juge : la même phrase, glosée de la même façon, est comprise par 2 agents sur 2 à la lecture 9, puis floue pour 2 agents sur 2 à la lecture 10, sur une question de motif que la lecture 9 ne posait pas. | Dans la règle du juge persona : une unité FLOU ou INCOMPRISE à la dernière lecture bloque la remise, sauf exception écrite que l'humain valide avant la remise, et un motif « changerait un fait » cite ce fait. Chaque unité est lue par 2 agents indépendants au moins, et un désaccord vaut FLOU. La question que le persona répète d'une lecture à l'autre remonte à l'humain avant la remise, telle quelle. Forme jouée par le produit : 3 lectures ciblées, 7 variantes, 1 agent par variante, verdicts sous `forge\etapes\audit\mesures\rendu\deck\persona\`. |

## Remarques restées au produit

3 remarques sont restées à la mission ; chacune porte son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| « 57 ont rejeté sa demande » se lisait comme un obstacle pour l'audit, pas comme un refus fait à un inconnu. | « L'audit a aussi joué l'inconnu », puis « 57 lui ont refusé l'accès ». | oui | Un mot exact dont la valeur, bonne ou mauvaise nouvelle, reste ambiguë est ce que le juge persona attrape ; aucun retour neuf, la classe est celle de RP-69. |
| Au 1er rendu d'essai, « marche. » occupait seul la 6e ligne de la carte. | « la dernière » au lieu de « la seule à répondre », carte de 1,3 pouce. | oui | Même famille que la classe proposée au lot 20260926a, `typographie-coupure-de-ligne-non-jugee` ; aucun retour neuf. |
| Les notes du présentateur comptaient 54 refus, la carte en affiche 57. | Notes réécrites : 54 demandes d'identification, 3 rejets pour une autre raison, 3 gardes du code citées. | non | Rien de généralisable : rapprochement propre à ce relevé. |

## Retours sur les documents produits

2 documents de l'étape se rattachent au catalogue : la fiche de conception, produite depuis son gabarit, et la présentation, qui n'a pas de famille.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| Fiche de conception de la présentation | `gabarits/documents/FICHE-CONCEPTION.md` du pilot, version du gabarit 1.0.0 | Rien pour cette étape : ni le lecteur, ni les parties, ni la forme ne changent. | Rien de relevé. | Le titre pressenti à l'indice du jour et une phrase de contexte. | propre au projet |
| Présentation des 10 points bloquants, version 20260927a | Aucun : pas de famille, retour RP-61 (aucune famille pour une présentation de points bloquants) du lot 20260926a | Un arrêt de la remise sur une unité que le persona ne sait pas redire. | Une carte jugée complexe 2 jours de suite. | 3 lectures ciblées du persona sur 7 variantes, archivées avec leurs textes. | générique, remonté sous RP-71 |

## Confirmations positives

- La comparaison des textes extraits de la version remise et de l'essai a montré que 2 textes seulement changeaient.
- La capture de chaque diapositive par la passe PowerPoint a montré le mot seul en fin de carte avant la remise.
- La conformité du dossier repasse au vert dès que les versions remplacées sont rangées.

## Ordre recommandé

1. RP-71 : le juge persona existe au produit, mais un verdict qui ne bloque rien laisse repartir le défaut qu'il a vu.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

1 retour de ce lot suit un retour humain : RP-71.

- RP-71 : la règle existait dans la ligne de la présentation du `CLAUDE.md` du produit, « chaque unité qu'il ne sait pas redire est réécrite », sans contrôle à la remise. Classe `constat-non-bloquant-jamais-lu`.
