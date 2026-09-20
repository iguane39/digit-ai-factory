# Fiche de conception — exemple rempli

> Exemple **fictif et pseudonymisé** (Client-A), livré à côté de `FICHE-CONCEPTION.md` pour que
> le gabarit ne reste pas une forme jamais remplie — c'est exactement le défaut que
> `oracle-gabarits-documents` existe pour attraper (G1 : un squelette sans instance n'a jamais
> été éprouvé). Il passe **G6** : `node oracles\oracle-gabarits-documents.mjs --fiche
> gabarits\documents\FICHE-CONCEPTION-EXEMPLE.md`.
> **Version de la fiche : 1.0.0**

## La fiche

Ce que l'agent remplit avant d'écrire. Le lecteur y voit à quoi ressemble une fiche tenue, champ
par champ, sur un cas où l'enjeu est fort.

```
famille: gd-rapport-donnees
titre_pressenti: Client-A - Rapport de donnees - Etat des 63 rapports decisionnels - 20260920a
enjeu: fort
motif_enjeu: 1 (remis au client) et 3 (chiffres opposables : taux de service, comptes par statut)
valide_par: le pilote de l'ecosysteme, 2026-09-20

decisions_attendues: arbitrer en comite quels rapports sont maintenus, lesquels sont retires, et lesquels attendent un proprietaire metier
savoir_prealable: connait ses indicateurs metier, son organisation et ses sites ; a deja vu un tableau de bord decisionnel
vocabulaire_absent: lineage, granularite, dimension conforme, table de faits, couche Gold
contexte_de_lecture: en comite de direction, vingt minutes, projete sur ecran partage, puis relu seul sur portable

parties:
  - titre: Ce qui a ete mesure, et sur quelle population
    intention: le lecteur sait a quoi se rapporte chaque chiffre avant qu'on lui demande de trancher
    type_de_contenu: fait
  - titre: Les 63 rapports, leur statut et son motif
    intention: le lecteur repere en un coup d'oeil les rapports qui le concernent et ce qui bloque chacun
    type_de_contenu: classification
  - titre: Comment relire un chiffre jusqu'a sa source
    intention: le lecteur retrouve seul l'origine d'un agregat qui le surprend, sans nous rappeler
    type_de_contenu: tache
  - titre: Ce qui n'a pas pu etre trace, et pourquoi
    intention: le lecteur distingue un manque assume d'un oubli, et sait quelle decision leverait chacun
    type_de_contenu: principe

format: html
volume_attendu: 4 parties, un tableau de 63 lignes a 6 colonnes, un tableau de 5 lignes
justification: 63 lignes a filtrer et a trier imposent des filtres embarques (L4/L13) et un repli en cartes sous 900 px (D3), que le Markdown ne porte pas ; la lecture projetee puis relue sur portable impose une page autonome responsive, jugee par check_html et render_page
```

## Ce qui ne sera PAS dans ce document

La frontière tranchée avant d'écrire, par un critère d'ACTION (D11). Le lecteur y apprend ce qui
part ailleurs, et où.

- le **registre des arbitrages** internes de la mission, l'historique des versions du rapport et
  son statut de relecture → document d'auteur, cité en renvoi ;
- le **détail d'implémentation** des requêtes de la couche Gold → dossier technique du produit ;
- la **liste des personnes** rencontrées en atelier → note interne, jamais un livrable client.

En revanche, la phrase « trois divergences restent ouvertes faute de propriétaire métier désigné »
**reste chez le lecteur** : elle est inconfortable, et elle change ce qu'il doit décider.

## Le coût de cette fiche, mesuré

Le coût est le seul argument sérieux contre une conception amont : il se mesure donc, plutôt que
de se supposer. Mesure du 20/09/2026, reproductible par les commandes citées.

| Ce qu'on mesure | Valeur | Comment c'est mesuré |
|---|---|---|
| Taille de la fiche remplie (le bloc ci-dessus, hors commentaires) | **28 lignes, 279 mots** | comptage sur le bloc `famille:` → `justification:` |
| Taille du fichier complet, prose d'exemple comprise | **80 lignes, 4 962 octets** | `Measure-Object` sur ce fichier |
| Taille du gabarit à lire une fois | **186 lignes** | `Measure-Object` sur `FICHE-CONCEPTION.md` |
| Temps de jugement par G6 | **45 ms** (médiane de 5 passes : 60, 44, 47, 45, 45 ms), **démarrage de Node compris** | `Measure-Command { node oracles\oracle-gabarits-documents.mjs --fiche <ce fichier> }`, 5 passes |
| Temps de REMPLISSAGE par l'agent | **non mesuré, et c'est déclaré** | aucun instrument ne le relève aujourd'hui ; l'annoncer serait une estimation déguisée en mesure |

**Ce que ce tableau dit, et ce qu'il ne dit pas.** Il dit que la fiche est courte et que son
jugement est gratuit à l'échelle d'un tour de travail. Il **ne dit pas** que la conception amont
coûte peu : le coût réel est la pensée que la fiche force — fixer le lecteur, trancher les types
de contenu, dériver le format. C'est précisément la dépense qu'on veut faire **avant** plutôt
qu'après, puisque le rétro-test du 14/09/2026 attribue à cette seule conception **11 des 20
griefs** relevés, contre un seuil fixé d'avance à 6.

**Réserve, reprise de l'étude et non tue** : ces 20 griefs ont été classés par une seule session,
sans second classeur à l'aveugle ; la revue est fixée au **2026-10-14**. Rien ici ne prétend
au-delà de cette mesure.
