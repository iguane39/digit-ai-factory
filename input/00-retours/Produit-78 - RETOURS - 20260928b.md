# Retours forges — Produit-78 — 20260928b

- **Contexte** : reprise du run Produit-78-20260928-mandat-etude après sa clôture (ledger seq 37, reprise seq 38). L'enclenchement demandait un verdict par oracle des forges mobilisées ; joués un par un, 3 oracles ont relevé des défauts réels de l'étude et de sa page, corrigés dans ce tour.
- **Références ledger** : `forge\ledger.jsonl` seq 117, 118, 119, 120, 121, 122 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\` ; l'original reste ici.
- **Statut** : remis le 2026-09-28

> **Note de réception du pilot, 28/09/2026.** Le fichier d'accompagnement portait, au 4e retour,
> 2 caractères de contrôle U+0008 à la place de la séquence `\b` : la trace d'une chaîne Python non
> brute. L'ingestion l'a refusé (TF-1067). Le pilot y a rétabli `\b`, comme ce lot l'écrit au même
> passage ; le reste du texte est celui du producteur.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort ou précision).

## pilot (`digit-ai-factory`)

Le générateur de page et le juge de l'enclenchement portent 3 frictions mineures, dont une échéance datée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-6 | mineur | générique | `scripts\generer-page-etude.mjs`, par la coquille de `scripts\lib-socle-page.mjs`, ne pose ni `<meta name="ai-generated">` ni `<meta name="generator">` à marqueur d'IA. `oracle-transparence` TR2 avertit sur la page de l'étude : « L'absence reste admise jusqu'au 2026-12-02, soit 65 jour(s) au 2026-09-28 ». Le lendemain, chaque page générée du parc passe au rouge, et un produit ne corrige pas à la main une page générée. Preuve : ledger seq 119. | Poser la balise dans la coquille du socle, avec un contenu lu dans le frontmatter de la source. |
| RP-7 | mineur | générique | `scripts\generer-page-etude.mjs`, `decrireColonnes` : le motif de la note exige 2 caractères au moins entre les balises `strong`. La colonne « X », le réseau, garde sa note sous le tableau, mais son en-tête ne reçoit pas `aria-describedby`, contrairement aux 39 autres en-têtes de la page. Preuve : ledger seq 120. | Accepter un nom de colonne d'un caractère. |
| RP-8 | mineur | générique | `oracles\oracle-enclenchement.mjs`, EN2 : « 4 hors mobilisation (oracle-conformite-projet ← digit-ai-factory, oracle-etude-opportunite ← digit-ai-factory, oracle-ecriture ← digit-ai-factory, oracle-lot-retours ← digit-ai-factory) : la liste des forges mobilisées est peut-être incomplète ». Tout run de produit joue au moins la conformité et le contrôle du lot. Ni `CONTRAT-INTERFACE.md` §3 ni `references\ETAPES-RUN.md` ne disent s'il faut déclarer `digit-ai-factory` dans `forges_mobilisees`, ce qui ferait exiger par EN1 un verdict pour chacun de ses oracles. Preuve : ledger seq 121. | Écrire la règle au contrat, et exclure le pilot d'EN2 s'il ne se déclare pas. |

## quality-oracles, dans l'atelier des skills qualité (`digit-ai-forge-agents`)

Un oracle ne voit pas une glose présente, l'orchestrateur n'appelle pas 3 oracles qui trouvent des défauts réels, et le motif d'un SKIP n'a pas de place fixe.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RQ-2 | majeur | générique | `scripts\oracle-lecture-tiers.mjs`, T2 : la glose d'un en-tête se cherche par une expression qui commence par `\b`, sans drapeau `u`. Devant « É », `\b` ne correspond jamais : « État au 2026-09-28 » n'est glosable ni par glossaire ni par définition en prose. Mesuré sous Node 24 : `/\bÉtat au\s*:/i.test(' État au : x')` rend `false`. L'en-tête porte aussi `aria-describedby` vers sa note, posé par le générateur du pilot, et T2 ignore cet attribut. Verdict rendu : FAIL, « 1 en-tête(s) de colonne sur 40 ». Le seul geste qui le lève, renommer la colonne, est un contournement. Preuve : ledger seq 116 et 117. | Frontières Unicode (lettre Unicode exclue avant et après, drapeau `u`) ; accepter comme glose un `aria-describedby` qui désigne un élément non vide. |
| RQ-3 | majeur | générique | `scripts\run-oracles.mjs` a rendu CONFORME sur l'étude (6 PASS, 1 SKIP) et sur sa page (14 PASS, 2 SKIP). Joués un par un pour l'enclenchement, 3 oracles qu'il n'appelle pas ont relevé 3 défauts réels, corrigés depuis : `oracle-transparence` TR1, aucune mention d'IA ; `oracle-premisse-acces` A3, une mesure d'accès sans date ni identité ; `oracle-lecture-tiers` T1 et T2, aucune phrase d'intention et 33 en-têtes sur 40 sans glose. Leurs règles sont déterministes et sans coût ; seul T4 appelle un modèle. Voisin de TF-1319. Preuve : ledger seq 118. | Router T1 à T3 de `oracle-lecture-tiers` sur toute page `.html` sous `output\`, `oracle-transparence` sur tout livrable, `oracle-premisse-acces` sur tout document qui rapporte une mesure d'accès. |
| RQ-4 | mineur | générique | Contrat JSON commun des oracles : le motif d'un SKIP n'a pas de place fixe. `oracle-conception-livrable` le range en fin de `non_juge`, `oracle-post-linkedin` en tête, `oracle-sast` dans un constat de niveau `info`. Sur les 29 SKIP de ce run, un premier relevé qui lisait le 1er élément de `non_juge` a produit des limites déclarées à la place des motifs ; vu avant consignation, il a fallu relire les sorties brutes. Preuve : ledger seq 122. | Un champ `motif` obligatoire sur tout SKIP, vérifié par la recette commune des oracles. |

## La règle qui aurait évité le retour

2 retours n'ont pas de classe au référentiel ; chacun porte la clé réservée `classe-a-creer` et une classe proposée.

- RP-6 : clé proposée `echeance-connue-non-portee-par-le-generateur`, famille `page-html-socle`, libellé « Une échéance est inscrite en donnée et son oracle avertit, mais le générateur partagé ne pose pas le geste de migration : chaque page générée passe au rouge le lendemain de l'échéance ».
- RP-7 : clé proposée `generateur-perd-la-structure-de-sa-source`, famille `page-html-socle`, déjà proposée par RP-2 du lot « Produit-78 - RETOURS - 20260928a ».

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'étude ne disait pas qu'elle a été rédigée avec une IA | mention ajoutée en tête, dans le texte que Seb lit | non | Défaut de rédaction de la session ; la règle TR1 existe, c'est son appel qui manquait (RQ-3). |
| Une mesure d'accès de l'étude ne portait ni sa date ni l'identité employée | date, identité et contrôle positif ajoutés à la ligne | non | Défaut de rédaction de la session ; la règle A3 existe. |
| La page ne disait pas ce qu'elle permet de décider, et ses 40 colonnes n'étaient pas définies | phrase d'intention en tête ; une note par colonne sous chaque tableau, selon la convention du générateur | non | Défaut de rédaction de la session, même cause d'appel que RQ-3. |
| Dans la matrice, une colonne « Source » voisinait avec « Source datée » | la première devient « Origine » | non | Choix de clarté pour le lecteur, sans règle de forge en cause. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. L'étude du lot « Produit-78 - RETOURS - 20260928a » a été complétée, sans nouveau gabarit ; sa remarque de gabarit reste celle de ce lot.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| aucun document nouveau | — | — | — | — | — |

## Documents mûrs

Aucun document mûr sur ce lot : aucun document du produit n'a été repris 5 fois, et aucun verdict de lecteur n'a été rendu.

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| aucun | — | — | — | — | reste au produit, parce qu'aucun document n'est mûr |
