# Gabarit — Rapport de données

> **Famille** `rapport-de-donnees` · catalogue `gd-rapport-donnees`
> **Formats** HTML (squelette fourni) · Markdown
> **Règles engagées** D1 D2 D3 D4 D6 D7 (`gabarits\documents\README.md`)
> **Provenance** extrait du gabarit produit par le projet SCC_ALX le 13/08/2026 sous trois
> barres externes qualifiées (Datasette · analytics.usa.gov · Tufte CSS), et de quatre
> rapports de mapping bâtis dessus entre le 14 et le 19/08.

Un rapport de données s'adresse à **quelqu'un qui ne connaît pas les données**. Le lecteur
doit pouvoir s'arrêter après la première page et avoir compris le résultat ; tout ce qui suit
est de la preuve, dans cet ordre : ce qu'on a regardé, ce qu'on a trouvé élément par élément,
ce qu'on en conclut, ce qui reste à décider, d'où viennent les chiffres.

---

## Structure — les six sections sont dues

### 0 · En-tête

```
---
destinataire: humain
role_destinataire: {qui lit ce rapport, et pour quelle décision}
---

# {Objet du rapport} — {Client} — {AAAAMMJJ<indice>}

> **Périmètre** {ce qui est couvert, et ce qui ne l'est pas}
> **Sources** {jeux de données, dates d'extraction, volumes}
> **Établi le** {date} · **Méthode** {comment les mesures ont été faites}
> **Gabarit** gd-rapport-donnees · **Version du gabarit** 1.0.0
```
**`destinataire` est dû, et il est LU PAR UN ORACLE** (TF-0504, 22/08/2026). `R-2` d'`oracle-conformite-projet` ne juge la localisation que des artefacts MARQUÉS : sans cette ligne, un document né de ce gabarit est invisible au contrôle — et c'est arrivé, une fiche écrite hors `output\` qu'aucun oracle ne pouvait voir, trouvée par relecture humaine. La valeur est FERMÉE : `humain` pour un livrable, `aucun` pour un document normatif. Le rôle du lecteur, lui, vit sous `role_destinataire` — utile, mais ce n'est pas la marque.

**`gabarit` et `version_du_gabarit` sont dus** — c'est le fil qui rend un retour exploitable.
Un lecteur qui trouve un manque dans ce document ne peut le remonter utilement que s'il peut dire
DE QUEL gabarit et de QUELLE version il vient : sans ce couple, le retour dit « il manquait une
section » et personne ne sait à quoi l'appliquer. Voir la boucle de retour en fin de gabarit.

Valeurs pour cette famille : `gabarit: gd-rapport-donnees` · `version_du_gabarit: 1.0.0`.


Le périmètre **dit ce qu'il exclut**. Un périmètre qui n'énumère que ce qu'il couvre laisse le
lecteur supposer le reste.

### 1 · Le résultat en une page

Le verdict, en langage de commanditaire, avant toute mécanique. Trois à cinq phrases, puis un
tableau de trois à six chiffres qui portent le résultat — chacun avec son unité et sa source.

> **Interdit** : ouvrir sur la méthode. Le lecteur qui s'arrête ici doit repartir avec le
> résultat, pas avec la façon dont on l'a obtenu.

### 2 · Ce que contiennent les données

Ce qu'on a reçu : volumes, période couverte, complétude, anomalies structurelles. C'est la
section qui permet au lecteur de juger si le reste tient.

### 3 · Le détail, élément par élément

La table longue. **D3 s'applique ici** : au-delà de trois colonnes, le repli en cartes sous
900 px est dû — un conteneur qui défile rend le tableau consultable, pas lisible.
**D4 s'applique** dès qu'un filtre, un tri ou une recherche est offert : l'état vide est écrit
en toutes lettres, avec le moyen de revenir.

Chaque ligne porte, au minimum : l'élément, son état, la mesure qui l'établit.

### 4 · Synthèse

Ce que le détail donne quand on le regroupe. Pas une répétition de la section 1 : celle-ci
répondait « quel est le résultat », celle-ci répond « qu'est-ce que ça dessine ».

### 5 · Décisions restantes

Ce qui n'est pas tranché et **qui doit trancher**. Une décision sans porteur nommé n'est pas
une décision restante, c'est un vœu.

| Décision | Options | Conséquence de chaque option | Qui tranche | Pour quand |
|---|---|---|---|---|

### 6 · Traçabilité

D'où vient chaque chiffre : requête, fichier, date d'extraction, empreinte si le jeu est figé.
Un rapport de données dont les chiffres ne se rejouent pas est une opinion.

---

## Ce que le gabarit refuse

- **Un chiffre sans source** (section 6 vide ou partielle). Chaque nombre cité dans le corps
  se retrouve en traçabilité — c'est ce que `oracle-restituer.mjs` de forge-data vérifie.
- **Des chapeaux interchangeables** (D6). Si le chapeau d'une section pourrait être collé
  sous une autre sans que rien ne cloche, il n'apprend rien : le retirer ou le réécrire.
- **Un tableau large sans repli** (D3), **un filtre sans état vide** (D4).
- **Un texte bridé dans un conteneur large** (D1, D2) : soit la prose remplit le conteneur,
  soit le conteneur se resserre. Jamais la moitié de page vide à droite.

## Avant de remettre

1. `python check_html.py <fichier>` — conformité de charte, sémantique, print.
2. `python render_page.py <fichier> --widths 1280,768,390` — largeur de lecture, débordements,
   contraste, chevauchements. **Les deux** : le premier ne mesure rien de ce que voit le second
   (D7).
3. Aucun `{…}` restant dans le document remis.

## Après la remise — ce que la factory attend de vous

Ce gabarit s'améliore par vos retours, et **par eux seuls**. À la clôture du run, la section
« Retours sur les documents produits » de votre lot (`gabarits\RETOURS-FORGES.md`) attend
quatre choses, dans cet ordre d'utilité :

1. **Ce qu'il a fallu ajouter à la main.** C'est le signal le plus fort : ce que vous avez écrit
   hors gabarit est presque toujours une section que le gabarit devrait porter.
2. **Ce qui a gêné le LECTEUR** — un destinataire qui a demandé deux fois la même information,
   qui a cherché une section ailleurs, qui a refusé une mise en page. Un fait rapporté, pas une
   appréciation d'auteur.
3. **Ce qui a manqué** : section absente, champ non prévu, cas que le gabarit n'anticipe pas.
4. **La portée** : propre à votre projet, ou valable pour la famille. Dans le doute, remontez —
   le tri se fait mieux au registre qu'en silence.

Reportez le couple `gabarit: gd-rapport-donnees` et `version_du_gabarit` tel qu'il figure en en-tête de
votre document : c'est lui qui rend le retour applicable. Sans lui, « il manquait une section »
ne se rattache à aucune famille et à aucune version (R-46).
