---
role: mesure du pas 0 du mandat d'amélioration continue (03/09/2026) — combien de retours sont une seconde occurrence d'une classe déjà traitée, sur quelles classes, chez quels produits, avec quelle méthode de comptage
sources_de_verite: [todo/TODO.jsonl et todo/TODO-ARCHIVE.jsonl (788 items lus le 03/09 à 09:30 Z), todo/CLASSES.json v1.0.0 (référentiel né de cette mesure)]
verifie_le: 2026-09-03
---

# Récidives au registre — mesure du pas 0 (03/09/2026)

Ce document répond à la première question du mandat validé le 03/09 : avant de construire, combien
de retours sont une seconde occurrence d'un défaut déjà corrigé ? La réponse tient en deux chiffres
et un constat de méthode. Cinquante retours sur 788 le disent en toutes lettres, et la courbe monte
chaque semaine. Et le comptage automatique par famille de mots-clés, essayé en premier, est
inexploitable — ce qui a décidé de la forme du référentiel de classes construit ensuite.

## 1. Ce qui a été compté, et comment

Comment lire cette section : chaque chiffre est suivi de sa méthode de comptage ; ce qui n'est pas
comptable est marqué « non mesurable » avec le motif, jamais mis à zéro.

- **Périmètre** : 788 items — tous les événements `creation` de `todo/TODO.jsonl` et de
  `todo/TODO-ARCHIVE.jsonl`, repliés avec leurs `maj` (le dernier statut hors `archive` est
  retenu). Lus le 03/09 à 09:30 Z, avant l'ingestion de TF-0790.
- **Récidive déclarée** : un item dont le titre ou le contenu porte l'un des mots « récidive »,
  « déjà corrigé », « déjà traité », « déjà remonté », « redécouvert », « reproduit », « de
  nouveau », « à nouveau », « deuxième / seconde / troisième fois », « encore une fois »
  (expression régulière, insensible aux accents et à la casse). C'est une **borne basse** : un
  retour qui récidive sans le dire n'est pas compté.
- **Producteur** : `Produit-NN` lu dans `demandeur` ou `source` ; à défaut, « pilot » quand le
  demandeur est le pilot, une campagne, une revue, un mandat ou l'humain.
- **Semaine** : semaine glissante à partir du lundi 03/08/2026 (S1), date de demande de l'item.
- **Non mesurable** : le délai entre la clôture au pilot et la récidive chez le produit, item par
  item — aucun champ ne relie un retour à l'item qu'il répète (c'est le champ `recidive_de` que le
  pas 1 ajoute). Les seuls délais connus sont ceux que TF-0757 cite en prose : quatre jours entre
  RT-1 du 27/08 et sa reproduction du 31/08.

## 2. Les récidives déclarées

Cinquante items déclarent une récidive, soit 6 % du registre. Comment lire les trois tableaux :
une ligne par valeur, triée par compte décroissant ; la famille est celle du référentiel
`todo/CLASSES.json`, attribuée ici **à la main** par lecture du titre — pas par l'heuristique de
la section 3.

| Famille (lecture manuelle) | Récidives déclarées |
|---|---|
| page-html-socle | 13 |
| versionnement-livrable | 10 |
| aucune famille du référentiel (recette forge-tests, dette, doublons de lots) | 7 |
| restitution-forme | 4 |
| heritage-produit | 4 |
| emplacement-livrable | 3 |
| regle-morte | 3 |
| skill-ou-oracle-non-invoque | 2 |
| contrat-interface-forge | 2 |
| lot-forme | 2 |

| Producteur | Récidives déclarées |
|---|---|
| pilot (ses propres outils et campagnes) | 19 |
| Produit-02 | 11 |
| Produit-03 | 4 |
| Produit-12 | 4 |
| Produit-10 | 3 |
| Produit-11 | 3 |
| Produit-05 | 3 |
| Produit-01 et deux entrants hors produit | 3 |

| Semaine (depuis le 03/08) | Récidives déclarées |
|---|---|
| S1 (03–09/08) | 1 |
| S2 (10–16/08) | 11 |
| S3 (17–23/08) | 15 |
| S4 (24–30/08) | 19 |
| S5 (31/08–03/09, quatre jours) | 4 |

Trois lectures. **La courbe monte** : le registre absorbe plus de retours chaque semaine, et la part
qui répète un défaut connu monte avec lui. **Le pilot récidive sur lui-même** : dix-neuf des
cinquante concernent ses propres oracles, hooks et registres — la boucle ne ferme pas mieux chez
son auteur que chez les produits. **Les quatre exemples du mandat sont dans le compte** : formats
HTML (13), versions de fichiers (10), dossiers de génération (3), skills non invoqués (2, dont
TF-0177 du 13/08 « aucun lexique d'invocation », qui est la naissance même du lexique RV-6).

## 3. Le comptage automatique par famille est inexploitable, et c'est un résultat

Comment lire : le tableau donne, pour les familles les plus peuplées, ce que rend une heuristique
qui classe chaque item par mots-clés puis compte comme « récidive » tout item postérieur à une
clôture `corrige` de la même famille. Le taux est le rapport récidives / items de la famille.

| Famille (heuristique) | Items | Clos corrigés | « Récidives » | Taux |
|---|---|---|---|---|
| page-html-socle | 185 | 180 | 174 | 94 % |
| versionnement-livrable | 88 | 85 | 83 | 94 % |
| emplacement-livrable | 58 | 54 | 54 | 93 % |
| restitution-forme | 41 | 40 | 40 | 98 % |
| skill-ou-oracle-non-invoque | 11 | 11 | 9 | 82 % |

Et hors tableau : 321 items tombent dans plusieurs familles à la fois, 196 dans aucune. Un taux
de 94 % ne mesure pas des récidives : il mesure qu'une famille est trop large pour être un
défaut. « Page HTML » recouvre les polices distantes, le contraste, les filtres de tableau et le
sommaire — quatre règles, quatre oracles, quatre classes. **Conséquence tirée** : le référentiel
`todo/CLASSES.json` a deux niveaux, la famille pour lire et la classe pour compter ; la classe est
un défaut généralisé avec sa règle et son oracle ; et c'est le producteur qui la déclare, parce
qu'aucune heuristique ne la devine à sa place.

## 4. Ce que cette mesure a décidé pour la suite du mandat

- **Trente classes seed**, fondées sur les 35 clôtures avec descente du 02/09 et sur les trois
  récidives que TF-0757 nomme (polices distantes, contrôle maison à la place de l'oracle, liste qui
  renvoie ailleurs) ; deux classes sans clôture fondatrice pour les exemples du mandat qui n'en
  ont pas encore (emplacement hors convention, versionnement — cette dernière fondée par TF-0523).
- **La récidive se compte à l'ingestion et ne refuse jamais** : refuser un lot pour récidive
  effacerait le seul signal que ce document a dû aller chercher dans la prose.
- **La contre-métrique** (classes créées par semaine, classes sans fondateur) accompagne le
  compteur dès le premier jour, parce que la façon la moins chère de faire baisser un taux de
  récidive est d'inventer des clés.
- **Le jeu d'essai** du protocole de tests reprend les trois récidives de TF-0757 : une mesure
  future qui ne les retrouve pas est fausse par construction.

## Ce que cette mesure ne dit pas

- Elle ne compte que les récidives **déclarées** : la borne basse. Le compteur mécanique du
  pas 1 en verra davantage, et la première lecture de `todo/RECIDIVES.md` à classes remplies dira
  de combien.
- Elle n'a pas relu les 94 fichiers de `input/00-retours/` un par un : les lots ingérés sont dans
  le registre, les lots en attente n'y sont pas encore, et `oracle-boite-entree` rend PASS ce
  jour — rien n'attend.
- Elle ne dit pas si une récidive est **imputable** au produit ou au pilot : la question est
  précisément celle que le délai clôture → descente constatée répondra, une fois les relevés
  d'héritage journalisés (`todo/HERITAGE-RELEVES.jsonl`, premier relevé écrit le 03/09).
