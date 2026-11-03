# Bancs auto-étiquetés, étape 1 (TF-1551)

Étape 1 de l'option O2 de `output\03-etudes\20261001-etude-opportunite-rsi-et-ssl.md`. Deux bancs jouables, sans
appel de modèle, lecture seule sur les oracles. Le troisième banc de l'étude, les paires « fautif, corrigé » tirées du
git, vit dans `oracles\banc-paires\` avec son propre README.

## Banc de mutation des oracles

`node oracles\banc-mutation\banc-mutation.mjs [--sortie <dossier>] [--seuil 0.9]`

Pour chaque oracle du manifeste, le banc joue l'oracle sur son livrable vert, puis sur ce même livrable recopié
ailleurs (le témoin, qui écarte un oracle qui juge l'emplacement), puis sur chaque mutant. Un FAIL est une détection,
un PASS un survivant. Le critère d'arrêt de l'étude (moins de 5 mutations pertinentes appliquées) fait échouer le
banc. L'empreinte de chaque script d'oracle est relevée avant et après : un oracle modifié pendant le banc le fait
échouer.

Mesure du 12/10/2026 (10 oracles, 69 mutations, jouées par ce script) :

| Oracle | Mutations jouées | Détectées | Survivants | Taux |
|---|---|---|---|---|
| `oracle-synthese` | 11 | 10 | 1 | 91 % |
| `oracle-ecriture` | 5 | 3 | 2 | 60 % |
| `oracle-lot-retours` | 5 | 5 | 0 | 100 % |
| `oracle-travaux-pilot` | 6 | 5 | 1 | 83 % |
| `oracle-etude-opportunite` | 10 | 10 | 0 | 100 % |
| `oracle-ecart-normal` | 5 | 5 | 0 | 100 % |
| `oracle-glossaire` | 5 | 5 | 0 | 100 % |
| `oracle-verdict-visuel` | 5 | 5 | 0 | 100 % |
| `oracle-revue-deck` | 8 | 8 | 0 | 100 % |
| `oracle-demande-tierce` | 9 | 9 | 0 | 100 % |
| Total | 69 | 65 | 4 | 94 % |

Lecture des 4 survivants, faite à la main le 12/10/2026 (le script ne tranche pas) :

- `oracle-synthese`, bloc « Risques » vidé de son corps, titre conservé : **défaut de juge, inconnu du registre**
  (recherche par mots-clés le 12/10). S1 ne teste que la présence du titre, alors que son message dit « un bloc sans
  contenu se DIT en une ligne ». Un bloc au titre seul passe.
- `oracle-ecriture`, cinq phrases de remplissage ajoutées à un texte de 1 700 mots : hors périmètre déclaré. EC-1
  juge une densité pour mille mots, jamais une phrase isolée.
- `oracle-ecriture`, titre « Dans cette section, nous allons voir… » : hors périmètre déclaré. EC-8 ne refuse à la
  position d'un titre que la famille `annonce-nominalisee` (« ce que X apprend ») ; « nous allons voir » compte à la
  densité seulement.
- `oracle-travaux-pilot`, ligne « Si ce n'est pas fait » retirée : hors périmètre. Aucune des règles T1 à T5 ne la
  cite.

Mise à jour du 02/11/2026 (TF-2066). Le banc mesurait 62 détections sur 69, soit 89,86 %, sous le plancher de 90 %, et
l'affichage à l'entier le lisait « 90 % » : les taux se lisent désormais avec leur décimale (`pourcent`) et le message
d'échec donne le rapport exact (`tauxExact`). Quatre mutations de `oracle-synthese` ne visaient plus ce que l'oracle juge,
aucune n'était une détection perdue. Le gabarit 2.50.0 (T2, TF-1947) rend les blocs 2, 6 et 7 facultatifs : retirer
« Verdict », « Écarts » ou « Risques » n'est plus un défaut, et ces trois mutations sont remplacées par le retrait des
blocs 3, 8 et 9, toujours exigés. La puce « ✓ fait » ajoutée en fin de document tombait dans le bloc 9, que S8 ne juge pas
par construction ; elle est posée dans le bloc 4. Le survivant « Risques vidé » de la lecture ci-dessus est détecté depuis
(`section-videe:Risques`). Le plancher de 90 % ne bouge pas.

Les cinq oracles les plus cités qui jugent un dossier, le registre ou le poste sont déclarés `hors_banc` au manifeste,
avec leur raison. La sollicitation est un proxy (fichiers du dépôt qui citent l'oracle), pas un compte d'appels.

## Banc des restitutions refusées

`node oracles\banc-restitutions\restitutions.mjs --extraire` puis `--rejouer`. Les transcriptions gardent le texte
refusé par le hook de fin de tour et le motif règle par règle : l'étiquette est gratuite. Le corpus contient des textes
de restitution, donc il vit hors du dépôt, dans `<racine>\_confidentiel\bancs\restitutions\`. Le résultat, lui, ne
porte que des comptes.

Mesure du 12/10/2026 sur les transcriptions des deux profils de ce poste (33 refus de restitution, extraits des
dossiers `projects\c--dev-digit-ai-factory`) :

- 26 refus sur 33 se rejouent sur le seul texte. Les 7 autres (AFFICHAGE, GESTE, PROCÉDURE) comparent le message à une
  synthèse déposée ou à la demande humaine, et ne se rejouent pas ici.
- 26 sur 26 restent refusés aujourd'hui sur toutes les règles que le hook nommait, S1, S3, S4 et S6. Aucun refus n'est
  devenu un PASS : le juge n'a perdu aucune détection sur ce corpus.
- 32 refus sont suivis d'un texte rendu, dont 27 sont acceptés aujourd'hui et 5 seraient refusés. Le banc ne peut pas
  distinguer un texte accepté parce qu'il passait d'un texte accepté par la garde anti-boucle du hook (« déjà refusé
  une fois, on ne boucle pas »).

Limite : les 25 refus de S1 sont quasi tous des textes sans le format, donc l'étiquette est peu variée. L'étude estimait
50 à 75 paires dans 16 fichiers à partir de 74 marqueurs de texte ; le compte mesuré des messages de refus du hook de
restitution est de 33, dans 17 transcriptions.
