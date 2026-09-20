---
destinataire: humain
role_destinataire: directeur financier ou directeur des systèmes d'information d'une ETI industrielle — décide de nous contacter pour un diagnostic, ou d'écarter
---

# Onze semaines pour savoir lesquels de ses 63 rapports étaient justes

**Client** : Client-A (groupe industriel, désignation pseudonymisée pour cette instance)
**Indice** : 20260920a · **Date de publication** : 20/09/2026
**Accord de publication** : référence AP-2026-07, signé le 12/09/2026 par le directeur financier
de Client-A, **valide jusqu'au 12/09/2027** — au-delà, cette étude est retirée ou renégociée
**Période de la mission** : du 05/05/2026 au 21/07/2026
**Gabarit : gd-etude-de-cas-client** · **Version du gabarit : 1.0.0**

> Instance de démonstration de la famille. Le client, les chiffres, les dates et l'accord de
> publication sont **fictifs et pseudonymisés** (Client-A, Émetteur-A) : aucune mission réelle
> n'est décrite. Ce document prouve une FORME — accord daté en en-tête, problème du client
> d'abord, ce qui avait déjà été tenté, résultats avec leur dénominateur, limites dites,
> transparence article 50 —, jamais une référence opposable.

---

## 1. La situation de départ

Le problème de Client-A, tel qu'il se posait avant notre arrivée. Le lecteur y apprend s'il
reconnaît sa propre situation.

Le comité de direction de Client-A recevait chaque mois un tableau de bord de 63 rapports,
construits sur douze ans par quatre équipes successives. Deux sites publiaient des volumes de
production différents pour le même mois, à 4 % près, et personne ne savait lequel des deux
chiffres était le bon. La question qui a déclenché la mission n'était pas technique : le
commissaire aux comptes avait formulé une réserve sur la traçabilité d'un agrégat financier, et
la direction financière ne pouvait pas dire d'où venait le chiffre.

Le coût de ce doute n'était pas dans les outils : il était dans les trois jours passés chaque
mois, par deux contrôleurs de gestion, à rapprocher à la main des chiffres qui auraient dû
concorder.

## 2. Ce qui avait déjà été tenté

Pourquoi le problème n'était pas résolu, alors que Client-A y avait déjà travaillé. Le lecteur y
apprend que la solution évidente avait été essayée.

Deux tentatives avaient précédé la mission, l'une et l'autre raisonnables :

- **un catalogue de données** avait été déployé dix-huit mois plus tôt. Il inventoriait
  correctement les tables, mais pas les rapports : il disait ce qui existait, jamais ce qui
  alimentait quoi. Le rapprochement entre deux chiffres divergents restait manuel ;
- **une reprise partielle** avait reconstruit six rapports jugés critiques. Elle avait réussi sur
  ces six, et n'avait rien dit des 57 autres — dont l'agrégat qui portait la réserve du
  commissaire aux comptes.

Ces deux travaux n'étaient pas des erreurs, et la mission s'est appuyée sur le catalogue existant
plutôt que d'en construire un second.

## 3. La démarche

Ce qui a été fait, dans quel ordre, et ce que cela a coûté en temps aux équipes de Client-A. Le
lecteur y apprend ce qu'une telle mission demande de lui.

| Étape | Durée | Charge côté Client-A |
|---|---|---|
| Reconstruction du lineage des 63 rapports jusqu'aux systèmes sources | 4 semaines | 2 demi-journées d'un architecte, pour les accès et les zones d'ombre |
| Contrôles de qualité outillés sur les 17 indicateurs du comité de direction | 3 semaines | 1 atelier de 3 heures par domaine, 4 domaines, avec les propriétaires métier |
| Arbitrage des divergences avec les propriétaires métier | 2 semaines | 4 ateliers de 2 heures, décideurs présents |
| Transfert aux équipes data de Client-A | 2 semaines | 3 jours de 2 personnes |

Le principe de la démarche tient en une phrase : **remonter chaque chiffre du comité de direction
jusqu'à son système source, et faire trancher chaque divergence par un propriétaire métier
nommé** — jamais par nous. Les détails d'implémentation appartiennent à Client-A et ne sont pas
décrits ici.

## 4. Les résultats

Ce qui a été obtenu, chiffre par chiffre, avec la population sur laquelle chacun se calcule. Le
lecteur y apprend ce qui est mesuré et ce qui ne l'est pas.

| Résultat | Chiffre | Formule et population | Mesuré le |
|---|---|---|---|
| Rapports dont le lineage est reconstruit jusqu'aux systèmes sources | **58 sur 63** | Rapports tracés de bout en bout ÷ rapports du périmètre initial (63) | 21/07/2026 |
| Rapports déclarés justes après arbitrage | **41 sur 63** | Rapports dont tous les indicateurs passent les contrôles ET dont un propriétaire métier a validé la définition ÷ 63 | 21/07/2026 |
| Rapports déclarés faux, et retirés du tableau de bord | **9 sur 63** | Rapports dont au moins un indicateur est contredit par le système source ÷ 63 | 21/07/2026 |
| Divergences entre sites tranchées | **11 sur 14** | Divergences arbitrées par un propriétaire nommé ÷ divergences relevées (14) | 21/07/2026 |
| Temps mensuel de rapprochement manuel | **passé de 6 à 1 jour-homme** | Relevé déclaratif des 2 contrôleurs de gestion, moyenne sur les 3 mois précédents contre le mois de septembre 2026 | 15/09/2026 |

**Ce qui n'a pas été atteint, et qui compte autant.** Cinq rapports sur 63 n'ont pas pu être
tracés : leurs sources sont un tableur alimenté à la main depuis 2019, sans historique. La
mission l'a constaté et n'a pas pu le résoudre — la reprise de ces cinq rapports est un chantier
distinct, non engagé à ce jour. Trois divergences sur quatorze restent ouvertes, faute de
propriétaire métier désigné sur le domaine concerné : c'est une décision d'organisation, hors de
notre portée.

**Limite du dernier chiffre.** Le gain de temps de rapprochement est **déclaratif**, relevé
auprès de deux personnes sur un seul mois de comparaison. Il n'est pas instrumenté et n'a pas la
même valeur de preuve que les quatre premières lignes, qui se recomptent sur les artefacts.

## 5. Ce que le client en dit

La parole de Client-A, validée par écrit par son auteur. Le lecteur y apprend ce que le client
retient, dans ses mots et non dans les nôtres.

> « Nous ne cherchions pas un outil de plus. Nous voulions pouvoir dire, devant notre commissaire
> aux comptes, d'où vient un chiffre. Aujourd'hui nous le pouvons pour 41 rapports sur 63, et
> nous savons précisément pourquoi pas pour les 22 autres. »
>
> — Directeur financier de Client-A, citation validée par écrit le 12/09/2026.

## 6. Ce que cela dit pour un autre lecteur

À quelles situations ce cas se transpose, et à quelles situations il ne se transpose pas. La
seconde moitié donne sa valeur à la première.

Ce cas se transpose à une organisation qui a **un patrimoine décisionnel ancien, plusieurs
équipes successives, et une contrainte externe** — certification, réserve d'un auditeur, fusion —
qui oblige à trancher. C'est la contrainte externe qui rend les arbitrages possibles : sans elle,
les divergences se discutent sans se décider.

Il ne se transpose **pas** à une organisation qui n'a pas de propriétaires métier identifiables
pour ses indicateurs. Sur ce cas, trois divergences sur quatorze sont restées ouvertes pour cette
seule raison, et aucune démarche technique ne l'aurait évité. Il ne se transpose pas davantage à
un périmètre de moins d'une quinzaine de rapports, où la reconstruction coûte plus cher que la
refonte.

## 7. Transparence des contenus générés, et mentions

La conformité due sur toute étude de cas publiée, et les mentions ordinaires. Le lecteur y
apprend comment ce document a été produit et jusqu'à quand il est valide.

La règle applicable est celle du dépôt (`references\PLATEFORME-LINKEDIN.md` § 3), citée et non
réécrite :

> - **Information du lecteur** : due depuis le **2026-08-02** (règlement européen sur l'IA,
>   article 50 ; lignes directrices de la Commission mises à jour le 2026-08-06). La règle de
>   marque de l'émetteur porte la formule ; le contrôle exécutable est la candidature TF-1030.
> - **Marquage lisible par machine** : reporté au **2026-12-02** pour les systèmes déjà sur le
>   marché, sous un accord qualifié de provisoire le 2026-06-22. Adoption finale non vérifiée : à
>   relire à la péremption.

**Pour cette instance de démonstration, la mention n'est pas reprise d'un `MARQUE.md` : Émetteur-A
est fictif et n'en possède pas.** C'est précisément le cas que le gabarit interdit de publier —
sans règle de marque portant la formule, une étude de cas réelle ne sort pas. L'instance le
montre plutôt que de fabriquer une formule maison, qui créerait une seconde vérité sur une
obligation réglementaire.

**Mentions.** Accord de publication AP-2026-07, valide jusqu'au **12/09/2027** ; au-delà, cette
étude est retirée ou renégociée. Les marques citées appartiennent à leurs détenteurs. Les
chiffres du § 4 portent chacun leur formule et leur date de mesure ; aucun n'est extrapolé.
