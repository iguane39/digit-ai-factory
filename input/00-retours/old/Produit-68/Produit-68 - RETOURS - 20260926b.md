# Retours forges — Produit-68 — 20260926b

- **Contexte** : correction de la présentation des 10 points bloquants, l'après-midi du 26/09/2026, sur 6 retours humains faits sur la version 20260926c remise le matin. 3 d'entre eux demandent la remontée, mot pour mot : « Applique et remonte à la Factory. » pour les listes en puces, « Fais le retour à la Factory. » pour un persona qui juge les textes que personne ne comprend, et « Remonte à la Factory. » pour une mention du chapitre 4 jamais demandée. S'y ajoute la remise à niveau de l'héritage décidée le même jour (D-65), qui a buté sur une garde.
- **Références ledger** : `forge\ledger.jsonl`, entrées `type: retour` : seq 273 (RP-68 du journal, repris ici sous RG-19), seq 275 (RP-70, sous RG-20), seq 274 (RP-69) et seq 271 (RP-67). La seq 272 porte les 6 retours humains, destinés au produit. Contrôle de complétude : les 5 retours au journal postérieurs au lot 20260926a sont dans ce lot, ou cités ici pour la seq 272.
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, le 26/09/2026, sur les 3 demandes humaines citées au contexte.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort, précision).

---

## forge-agents (`digit-ai-forge-agents`, skills `digit-ai-pptx`, `quality-oracles` et `prompt-analyzer-l99`)

L'humain a trouvé, sur une présentation verte à tous ses juges, des listes écrites en ligne et une mention qu'il n'avait jamais demandée. La première règle existait sans juge pour un deck ; la seconde venait d'une analyse de prompt validée d'un bloc.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RG-19 — la règle des listes n'a pas de juge sur un deck | majeur | générique | **E-11 sans juge pour un deck** : la règle E-11 de `ECRITURE.md` du pilot, « Un paragraphe qui énumère devient une liste », vaut pour le type T2, livrables en Markdown, HTML et PowerPoint. Son seul juge, L12 (une énumération de données n'est pas une phrase), vit dans `check_html.py`, pour les pages. Ni le skill `digit-ai-pptx`, ni `oracle-charte-pptx-semantique`, ni `oracle-pptx`, ni `oracle-ecriture` sur le texte extrait ne la jouent sur un deck. Mesuré le 26/09/2026 sur la présentation Produit-68 20260926c : 7 listes en ligne sur la diapositive des composants, de 2 à 6 éléments séparés par « · », et `oracle-ecriture` PASS. L'humain l'a vu et a demandé pourquoi la règle n'était pas appliquée. | Jouer E-11 sur le rendu d'un deck : un paragraphe visible qui porte un « · » hors du pied de page, ou 2 « ; », est une liste en ligne, FAIL. Règle de référence : `enumeration-en-ligne` de `forge/etapes/audit/outils/qa-presentation-powerpoint.py` ; fixture rouge, la version Produit-68 20260926c, 28 constats ; fixture verte, la version 20260926d, 0 constat. Une première écriture à 2 séparateurs ne voyait que 3 des 7 listes. |
| RG-20 — une analyse de prompt ajoute du contenu visible et le fait valider en bloc | majeur | générique | **Un garde-fou d'analyse devenu texte du livrable** : le 26/09/2026, l'analyse L99 de la reprise de la présentation a listé 17 écarts à la lettre, comme l'exige sa règle 5 bis (TF-0176). L'écart 11 ajoutait sous le chapitre 4 la source « Déclaration du commanditaire de l'audit, 26/09/2026. Hors du périmètre de l'audit. », et une distinction audit / commanditaire sur la diapositive des sources, titre compris. L'humain a répondu « exécute le prompt », ce qui a validé les 17 écarts d'un bloc. L'exécution en a fait un contrôle bloquant du générateur. Après la remise, l'humain a écrit : « Supprimer le descriptif de demande chapitre 4 de ce slide. Jamais demandé d'écrire ça, pourquoi ça a été fait ? » | Au chapitre 8 du skill, séparer les écarts qui changent la manière d'exécuter, validables avec le prompt, de ceux qui ajoutent au livrable un contenu visible non demandé. Ces derniers deviennent chacun une décision distincte, avec l'option « ne pas l'ajouter ». Aucune règle existante ne l'aurait évité : la règle 5 bis impose de lister les écarts, pas de les faire trancher. |

## pilot (`digit-ai-factory`)

Trois textes verts à tous les juges ont été jugés « ça ne veut rien dire » par l'humain, qui a proposé lui-même le remède. La remise à niveau de l'héritage, elle, a demandé `--forcer` pour un fichier que le script n'écrit pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-69 — aucun juge ne vérifie qu'un texte est compris par son lecteur | majeur | générique | **Des termes remplacés par des images** : la règle E-12 de `ECRITURE.md`, le vocabulaire du lecteur, n'a pour juge qu'un glossaire et une revue. Sur la présentation Produit-68 20260926c, écrite pour des décideurs sans formation technique : 0 terme proscrit, `oracle-ecriture` PASS, revue de lecture PASS sur son critère « Langue ». L'humain a pourtant jugé 3 éléments « ça ne veut rien dire » ou « pas compréhensible » : la carte « Ce qui tient », la ligne 10 du tableau et toute la diapositive du point 10. Remplacer « jeton » par « badge », ou « opérations » par « points d'entrée », passe la liste proscrite sans rendre le fait compréhensible. Proposition humaine, mot pour mot : « Est-ce qu'on peut envisager un persona pour ce type de texte qui ne veut rien dire et qui ne peut être compris par personne ? » | Un juge persona : un agent qui tient le lecteur de la fiche de conception relit chaque texte visible et le redit en une phrase à lui ; une unité qu'il ne sait pas redire est FAIL, avec sa reformulation archivée près de la revue. Forme jouée par le produit le 26/09/2026 : lecture 1, 88 unités non comprises sur 375 ; lecture 2, 54 sur 411 ; lecture 3, 16 sur 392. Il a aussi relevé 3 erreurs de fond, dont une somme de 23 + 158 annoncée pour 184 règles. |
| RP-67 — la garde de la recopie de l'héritage retient des fichiers qu'elle n'écrit pas | majeur | générique | **Un risque calculé sur tout le contrat** : la garde de `scripts/recopier-heritage.mjs` juge le risque d'écrasement sur tous les artefacts de `HERITAGE.json`. Mesuré le 26/09/2026 chez Produit-68 : l'essai liste 1 copie, 8 fichiers conformes et 7 laissés au produit, dont `CLAUDE.md` en mode `presence_et_motif`. Le geste réel passe pourtant en essai, « CLAUDE.md — MODIFIÉ et non commis ». Le code n'écrit jamais un artefact présent dans ce mode. Le remède que R-47 prescrit en un geste exige donc `--forcer` dès qu'un `CLAUDE.md` porte du travail non commis. Contournement tenu : `--forcer` après lecture du code, empreintes des 16 cibles avant et après, 1 seul fichier changé. | Ne calculer le risque que sur les cibles que le geste va écrire : copies conformes qui diffèrent, `presence_et_motifs` à compléter, absents à instancier. Fixture rouge : un `CLAUDE.md` modifié non commis en mode `presence_et_motif`, qui ne doit plus faire basculer le geste en essai ; fixture verte conservée : une copie conforme modifiée et divergente. |

## Remarques restées au produit

4 remarques sont restées à la mission ; chacune porte son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| « Code » désignait le programme et un mot de passe sur la même diapositive. | « mot de passe qui a fuité ». | oui | Un même mot pour 2 choses est ce que le juge persona attrape ; la classe est remontée sous RP-69. |
| La diapositive des sources annonçait 23 + 158 règles sur 184. | « et 3 sont sans objet », d'après les données de l'audit. | oui | Une somme incomplète est un cas relevé par le juge persona ; la classe est remontée sous RP-69. |
| « Urgent : à traiter avant toute mise en production » s'écrivait pour une plateforme déjà en service. | « avant d'accueillir un nouveau client », comme le verdict. | non | Rien de généralisable : libellé propre à cette présentation. |
| La grille de 2 × 2 des composants donnait la même hauteur aux 2 rangées : l'une débordait, l'autre restait à moitié vide. | Hauteurs selon le contenu de chaque rangée. | non | Rien de généralisable : mise en page de ce générateur. |

## Retours sur les documents produits

2 documents de l'étape se rattachent au catalogue : la fiche de conception, produite depuis son gabarit, et la présentation, qui n'a pas de famille.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| Fiche de conception de la présentation | `gabarits/documents/FICHE-CONCEPTION.md` du pilot, version du gabarit 1.0.0 | Un champ pour la relecture du texte par un lecteur-type avant la remise. | 3 textes jugés incompréhensibles par l'humain, après la remise. | La relecture par un agent qui tient le lecteur, écrite dans `contexte_de_lecture`. | générique |
| Présentation des 10 points bloquants, version 20260926d | Aucun : pas de famille (RP-61 du lot 20260926a) | Une règle de listes et un juge du sens pour le lecteur. | Des listes en ligne, des images au lieu des faits, un tableau à identifiants. | Un tableau avant → après de 154 textes, écrit par un script du produit. | générique, remonté sous RG-19 et RP-69 |

## Confirmations positives

- La passe PowerPoint a vu chaque débordement créé par la réécriture, jusqu'à 0 constat sur la version remise.
- `recopier-heritage.mjs --essai` a listé exactement ce que le geste écrirait : 1 copie, 8 fichiers conformes, 7 laissés.
- `oracle-lot-retours.mjs` 1.3.0, recopié ce jour, juge ce lot au produit comme au pilot.

## Ordre recommandé

1. RP-69 : le juge persona a trouvé en 3 lectures ce que tous les autres juges laissaient passer, dont 3 erreurs de fond.
2. RG-19 : la règle de référence tourne chez le produit, avec sa fixture rouge et sa fixture verte.
3. RP-67 : la correction est courte, et tant qu'elle manque, le remède de R-47 exige un mot qui annonce un écrasement.
4. RG-20 : un changement de forme du chapitre 8 du skill, sans code.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

3 retours de ce lot suivent un retour humain : RG-19, RG-20 et RP-69.

- RG-19 : la règle E-11 existait, sans juge pour un deck. Classe `regle-ecrite-sans-oracle-qui-la-joue`.
- RP-69 : la règle E-12 existait, sans juge de compréhension. Classe `regle-ecrite-sans-oracle-qui-la-joue`.
- RG-20 : aucune règle existante ne l'aurait évité. Classe à créer : clé `ecart-de-contenu-valide-en-bloc`, famille `restitution-forme`, libellé « Un contenu visible, ajouté au livrable sans demande humaine, est validé en bloc avec un prompt au lieu d'être tranché à part ».

RP-67 vient d'une mesure du produit, sans retour humain. Classe `controle-vrai-sur-le-mauvais-invariant`.
