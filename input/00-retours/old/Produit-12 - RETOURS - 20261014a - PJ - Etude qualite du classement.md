---
lecteur: porteur du produit, puis la Factory pour la méthode (chapitre 7)
role: étude de la qualité du classement des fichiers de six propriétaires, de la norme 2.1 à la 2.14, mesurée sur un échantillon de référence étiqueté à l'aveugle
date: 2026-10-14
sources: forge/ledger.jsonl (seq 176 à 312) ; output/06-dossiers-dropbox/<slug>/norme-2.*/ ; output/06-dossiers-dropbox/reference/ (échantillon, étiquettes, mesures, écarts, questions) ; forge/etapes/conception/norme-rangement/ (passes.py, reference.py, tests_passes.py) ; proposition « Principe d'analyse critique » 20261014a (D-46)
---

# Qualité du classement : ce que mesure un échantillon de référence

Le classement des 9 662 fichiers des six propriétaires range juste environ deux fichiers sur trois, et non 97 % comme le laissait croire la part de fichiers rangés. Cette mesure vient d'un échantillon de 150 fichiers, tiré au hasard et étiqueté par trois agents qui ne voyaient pas le résultat de l'outil. Quatre versions ont été construites et mesurées sur ce même échantillon. Deux ont été retenues ; deux ont été rejetées, l'une parce que la mesure baissait, l'autre parce que le contrôle de ses changements sur toute la population montrait des erreurs que l'échantillon ne voyait pas. La boucle s'arrête à 66,0 % de justesse du dossier. Ce qui reste demande des réponses du cabinet, pas une règle de plus. La mesure est provisoire tant que le cabinet n'a pas tranché les 65 désaccords.

## 1. Les process, de la norme v2 à la 2.14

Ce chapitre retrace ce que chaque version a décidé, et sur quelle preuve. Mode de lecture : une ligne par version, dans l'ordre ; la colonne Mesure dit ce qui a jugé la version à l'époque, et c'est là que se lit le manque.

| Version | Date | Ce qu'elle ajoute | Mesure à l'époque |
|---|---|---|---|
| v2 | 28/09 | grammaire des dossiers (propriétaire, biens, locataires datés) et des noms TYPE_Libellé | part rangée (BERNARD 410 sur 416), ledger seq 178 |
| 2.1 | 29/09 | niveau immeuble chez un propriétaire à plusieurs immeubles | part rangée (5 462 sur 7 764), seq 182 |
| 2.2 | 01/10 | contenu lu : texte, OCR des scans (`lecture.py`), type, dates et personnes (`faits.py`) ; dates d'entrée lues dans le bail | dates fausses 113 sur 161 avant, 0 tirée d'un fichier après, seq 195 et 210 |
| 2.3 | 02/10 | noms sans date, période des quittances | grammaire, seq 224 et 226 |
| 2.4 | 03/10 | tirets, sous-dossiers par immeuble, 00-COMPTABILITE et 01-PROPRIETAIRE | grammaire (0 écart), seq 256 |
| 2.5 et 2.6 | 03/10 | cinq propriétaires de plus, lecture étendue, fiches mémento | part rangée par propriétaire, seq 272 et 288 |
| 2.7 | 14/10 | passe critique : doublons, pièces sensibles, procédure, année comptable (400 changements) | portes de forme, seq 300 |
| 2.8 | 14/10 | passes métier (RP) et rattachement au bail (RL) des fichiers à trier : 164 → 96 | relecture de 30 rangements par l'exécutant, 1 faux, seq 306 |
| 2.9 | 14/10 | déduction par recoupement (RD) et dossiers _A_TRIER : 96 → 92 | relecture des 4 déductions par l'exécutant, seq 308 |
| 2.10 | 14/10 | révision des lignes rangées : pièce sensible lue dans une image (RV-1), caution d'un autre bailleur (RV-2), dossier du garant (RV-3) | échantillon de référence (ce document) |
| 2.11 | 14/10 | sous-type de diagnostic lu dans le contenu (RV-4) | **rejetée** au contrôle de ses changements |
| 2.12 | 14/10 | tableau comptable dans l'année de son nom, appliqué aux lignes déjà rangées (RV-5) | échantillon de référence |
| 2.13 | 14/10 | pièce de candidature sous le dossier existant de la personne (RV-6 large) | **rejetée** : justesse −0,7 point |
| 2.14 | 14/10 | RV-6 réduite aux garants dont le chemin dit « garant » et dont le nom et le prénom sont lus | échantillon de référence |

Jusqu'à la 2.9, aucune version n'a été jugée sur la justesse de ce qu'elle range. Les portes contrôlaient la forme : grammaire, dates, compteurs. Les relectures étaient faites par celui qui écrivait les règles.

## 2. La mesure

Ce chapitre dit comment la justesse est mesurée, pour qu'une autre équipe puisse la refaire. L'outil est `reference.py` (actions `tirer`, `paquets`, `mesurer`).

- **Échantillon** : 150 fichiers sur 7 260 (hors copies macOS et doublons), graine 20261014, cinq strates selon l'origine du rangement : règles de la norme (95 sur 6 943), passe critique (20 sur 159), passes 2.8 (15 sur 62), passe 5 (4 sur 4), à trier (16 sur 92). La justesse pondérée corrige la sur-représentation des petites strates.
- **Étiquettes** : trois agents distincts, 50 fichiers chacun. Chacun lisait le chemin d'origine, le texte lu, les faits lus, le squelette des dossiers et, au besoin, le fichier d'origine, sans jamais voir la table. Confiance déclarée : 82 haute, 63 moyenne, 5 basse.
- **Mesures** : justesse du dossier (le dossier complet, personne de la candidature comprise), du type et du locataire, avec intervalle de Wilson à 95 % ; couverture ; erreurs pondérées par gravité (3 pour une pièce sensible mal placée, 2 pour un mauvais locataire, 1 sinon).
- **Statut** : provisoire. Les 65 désaccords de la v2.14 sont dans `reference\questions-cabinet-norme-2.14.csv`, une question fermée par fichier.

## 3. Les résultats, version par version

Ce chapitre donne les chiffres sur lesquels la boucle a décidé. Mode de lecture : une ligne par version mesurée ; la dernière colonne dit ce qui a été fait de la version.

| Version | Dossier | Dossier pondéré | Type | Locataire | Couverture | Gravité 3 / 2 / 1 | Décision |
|---|---|---|---|---|---|---|---|
| 2.9 | 63,3 % (55,4–70,6) | 73,2 % | 70,0 % | 78,3 % | 89,3 % | 23 / 15 / 30 | point de départ |
| 2.10 | 64,0 % (56,1–71,2) | 74,2 % | 70,0 % | 79,3 % | 88,7 % | 23 / 14 / 30 | retenue (+0,7) |
| 2.11 | 64,0 % | 74,2 % | 72,7 % | 79,3 % | 88,7 % | 23 / 14 / 27 | rejetée : 4 retypages faux sur 12 relus dans la population |
| 2.12 | 66,0 % (58,1–73,1) | 74,3 % | 70,0 % | 79,3 % | 88,7 % | 23 / 14 / 28 | retenue (+2,0) |
| 2.13 | 65,3 % | 73,3 % | 70,0 % | 79,3 % | 88,7 % | 24 / 14 / 28 | rejetée : −0,7, une erreur de gravité 3 de plus |
| 2.14 | 66,0 % (58,1–73,1) | 74,3 % | 70,0 % | 79,3 % | 88,7 % | 23 / 14 / 28 | retenue, identique à la 2.12 ligne pour ligne |

L'arrêt est atteint deux fois : deux versions consécutives (2.13 et 2.14) gagnent moins d'un point, et la borne de cinq versions est épuisée. À chaque version retenue, les portes de forme passent sur les six tables : contrôle de dérive à 0 écart, porte des dates de baux en code 0.

## 4. Analyse critique

Ce chapitre classe les 65 erreurs restantes par cause. Il dit lesquelles une règle peut encore corriger, et lesquelles ne le peuvent pas. Mode de lecture : une ligne par cause, classée de la plus grave à la moins grave ; la dernière colonne dit qui peut la lever.

| Cause | Fichiers | Gravité | Qui la lève |
|---|---|---|---|
| Personne sous la candidature : le lecteur place la pièce sous GARANT-… ou LOCATAIRE-…, l'outil à la racine de la candidature, ou l'inverse | 10 | 3 | le cabinet : faut-il toujours un dossier par personne ? |
| Quittance ou RIB d'un locataire rangé en justificatif de domicile de candidature, au lieu de LOYERS (règle RG-08 de la passe critique) | 4 | 3 | le cabinet : une quittance de frais avant l'entrée est-elle une pièce du bail ? |
| Image dont la lecture OCR ne dit rien (avis d'impôt, carte d'identité, plan) | 6 | 1 à 3 | une lecture d'image plus forte ; aucune règle ne range sans texte |
| Régularisation ou compte d'un locataire nommé : comptabilité ou LOYERS du locataire | 7 | 2 | le cabinet : décision de norme |
| Fichier à trier que le lecteur range (souvent en ouvrant l'original) | 10 | 1 à 3 | le cabinet, ou une lecture d'image |
| Type seul (diagnostic générique ou précis, facture d'eau en COMPTEUR ou FACTURE) | 14 | 1 | le cabinet pour COMPTEUR ou FACTURE ; RV-4 a montré qu'une lecture du titre ne suffit pas |
| Autres emplacements (année comptable, diagnostic du bail ou du lot, photo du lot) | 14 | 1 à 3 | cas par cas |

Trois enseignements se tirent de la boucle elle-même.

- **La part rangée trompait.** 97 % des fichiers étaient « rangés » en 2.7, et ce chiffre a tenu lieu de qualité jusqu'à la 2.9.
- **Une règle sûre sur l'échantillon peut être fausse ailleurs.** RV-4 améliorait le type de 2,7 points sur l'échantillon, sans un seul faux. Elle retypait 201 diagnostics dans la population, et 4 sur 12 relus étaient faux : l'en-tête du diagnostiqueur cite tous ses métiers.
- **Une règle testée sur des cas neufs peut ne rien faire.** La correction des années comptables de la v2.10 ne touchait que les rangements nouveaux ; il a fallu RV-5 pour l'appliquer aux lignes déjà rangées.

## 5. Propositions et élargissement

Ce chapitre dit ce qui ferait encore progresser la qualité, par ordre de gain attendu.

1. **Les réponses du cabinet aux 65 questions.** Elles transforment la mesure provisoire en mesure validée. Les quatre questions de norme (personne sous la candidature, quittance avant l'entrée, régularisation d'un locataire, facture d'eau) deviennent des règles qui touchent chacune des dizaines de fichiers dans la population.
2. **La lecture des images sans texte.** Les agents ont rangé juste des images que l'OCR ne lisait pas, en les regardant. Faite dans la session, comme pour l'étiquetage, sans service externe (D-53), cette lecture vise environ 6 fichiers sur 150, soit 4 points.
3. **L'archive des mails du poste.** Une pièce jointe reçue d'un locataire désigne son dossier sans ambiguïté. C'est la source locale la plus riche que le classement n'utilise pas.
4. **L'échantillon comme actif.** Le même échantillon, une fois validé par le cabinet, juge chaque nouvelle norme et chaque nouveau propriétaire.

## 6. Ce que l'étude ne dit pas

Ce chapitre borne les conclusions. La justesse est mesurée contre des étiquettes d'agents, pas encore validées. L'intervalle de confiance reste large, à plus ou moins 7,5 points sur 150 fichiers. La mesure du dossier est stricte : une pièce juste au mauvais niveau de candidature compte comme une erreur. La copie rangée du Drive est encore en 2.9.

## 7. La méthode, pour d'autres sujets

Ce chapitre est écrit pour la Factory. Il décrit la méthode d'amélioration incrémentale telle qu'elle a été appliquée et corrigée le 14/10, pour toute sortie automatisée qui trie, classe, range ou rédige.

1. **Mesurer avant d'améliorer.** Tirer un échantillon de référence par strates d'origine, graine écrite, que la sortie jugée n'a pas choisi.
2. **Étiqueter à l'aveugle.** Le lecteur ne voit pas la sortie ; ses désaccords vont au métier en questions fermées ; tant que le métier n'a pas répondu, la mesure est dite provisoire.
3. **Mesurer plusieurs justesses et la gravité**, jamais la seule couverture.
4. **Une version = des règles nouvelles, chacune avec un test rouge puis vert sur le code précédent.** Un test qui passe déjà sur l'ancien code ne prouve rien et se réécrit.
5. **Appliquer chaque règle aux lignes déjà traitées, pas seulement aux nouvelles.**
6. **Mesurer la version sur le même échantillon, et contrôler en plus un tirage des changements qu'elle fait dans toute la population.** L'échantillon ne voit pas les effets rares d'une règle.
7. **Rejeter une version** qui fait baisser une justesse, augmente les erreurs graves, ou dont le contrôle des changements trouve des faux ; garder son numéro et sa raison dans l'historique.
8. **S'arrêter** quand deux versions consécutives gagnent moins d'un point, ou à la borne fixée d'avance ; dire alors ce que seul le métier peut lever.

Les étapes 5 et 6 et le test discriminant de l'étape 4 sont nés de cette boucle : sans eux, la v2.11 aurait été retenue et la v2.10 aurait annoncé une correction sans effet.
