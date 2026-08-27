---
role: les deux chaînes déclarées de la traduction — « traduire un produit », « auditer ses traductions »
destinataire: orchestrateur (pilot) et forges mobilisées
sources_de_verite: ["retour Produit-02 20260826f (TF-0664)", "todo/TODO.jsonl — TF-0660, TF-0663, TF-0661", "gabarits/GLOSSAIRE.md", "forge_tests/adaptateurs/i18n.py"]
verifie_le: 2026-08-27
---

# Traduire, auditer : deux chaînes déclarées

## Le fait qui l'exige, et le chiffre qui compte

**Dix-sept tours** ont été nécessaires, sur la session du 26/08, avant que le résultat soit de
qualité. Chaque tour a été classé par son **motif**, une seule classe retenue par tour :

| classe | tours | ce que la classe dit |
|---|---|---|
| **DÉFAUT** | 11 | une étape, un format ou une règle manquait |
| **DÉCISION** | 5 | l'arbitrage appartient à l'exploitant |
| **DÉCOUVERTE** | 1 | une information absente du dépôt |

**Le chiffre qui compte est 11, pas 17.** Les cinq tours de DÉCISION portent la forme de la
marque, la politique d'exposition aux crawlers IA, le modèle d'URL localisé, le GO de mise en
production, le choix du domaine de contact. **Une chaîne qui les supprimerait retirerait à
l'exploitant ce qui lui revient.** Ils sont comptés ici pour être **PRÉSERVÉS**, pas pour être
optimisés — c'est la loi n° 5 lue dans le bon sens : *l'IA fait, l'humain décide*.

**Les huit premiers tours ont servi à écrire la méthode à la main** — axe GEO, format
d'arbitrage, format de plan applicable à ancres verbatim, carte des sources de vérité
distinguant source et artefact. C'est-à-dire à reconstituer, sur une phrase, ce qu'une chaîne
outillée aurait fourni.

**Le coût réel n'est pas le temps de l'exploitant.** C'est : onze fautes d'accord parties EN
PRODUCTION derrière une CI verte ; deux faits faux servis dans les sept langues ; une qualité
qui n'a émergé que parce que l'exploitant a insisté trois fois.

**La preuve que le défaut est structurel et non local.** Quatre retours remontés *séparément le
même jour* — règle de glossaire jamais évaluée, sonde non rejouable, aucun oracle du genre
grammatical, cohérence interne contre cohérence interlangue — sont **chacun une étape manquante
de la MÊME séquence**. Remis un par un, ils seraient traités un par un, et le produit suivant
les redécouvrirait dans le même désordre. *C'est la séquence qui manquait, pas les pièces.*

## Deux principes, et ils ne sont pas décoratifs

1. **Les étapes d'arbitrage SONT des étapes.** Elles se posent explicitement à l'humain et ne
   s'automatisent pas. Une chaîne dont la liste d'arbitrages est VIDE n'a pas été économe : elle
   a décidé à la place de quelqu'un.
2. **Une étape sans oracle BLOQUE la remise au lieu d'être signalée.** C'est ce qui sépare une
   méthode écrite d'une méthode tenue. Un avertissement qui n'arrête rien est un avertissement
   qu'on apprend à lire sans le voir.

## Chaîne A — « traduis ce produit dans N langues »

*Onze étapes. La colonne « oracle » dit ce qui juge l'étape AUJOURD'HUI — pas ce qu'on
souhaiterait qu'elle ait.*

| # | étape | entrant | sortant | oracle | critère de blocage |
|---|---|---|---|---|---|
| A1 | inventaire de la surface | catalogue de langue servi | arborescence des clés | `check-i18n` (produit) — **existe** | une clé sans traduction dans une locale servie |
| A2 | glossaire constitué **par balayage**, portant `categorie`, `portee` **et `genre`** | vocabulaire servi | `docs\projet\GLOSSAIRE.md` (R-53) | `oracles\oracle-glossaire.mjs` G1–G8 — **existe**, `genre` livré le 26/08 (TF-0660) | un terme servi absent du glossaire ; un `genre` hors jeu fermé |
| A3 | preuve de marché **rejouable et périssable** par terme de visibilité | glossaire | colonne `preuve`, ≥ 2 sources de nature différente | G5 + G7 — **existe**, `verifie_le` **non confronté à une péremption** : partiel | une ligne de visibilité sans commande rejouable |
| A4 | **ARBITRAGE HUMAIN** sur les termes à enjeu | glossaire + preuves | décision datée, consignée | **aucun oracle, et c'est voulu** (principe 1) | liste d'arbitrages VIDE |
| A5 | traduction | glossaire arbitré | catalogues par locale | `check-glossaire` + `check-traductions` (produit) — **existent** | terme retenu absent, terme proscrit employé |
| A6 | **contrôle du genre et de l'accord après substitution** | catalogues + `genre` déclaré | écarts d'accord nommés par clé | contrôle **(j)** du pan i18n de forge-tests — **livré le 26/08** (TF-0660) | un déterminant du genre opposé collé au terme retenu |
| A7 | **cohérence INTERNE de chaque langue**, confrontée aux sources de données | catalogues + données du produit | contradictions intra-locale nommées par clé | contrôle **(i)** du pan i18n — **livré le 26/08** (TF-0663) ; nombres confrontés à la donnée : contrôle (g), TF-0644 | un sujet portant deux valeurs pour la même unité |
| A8 | cohérence interlangue | catalogues | divergences par clé | **existe (partiel)** — et *il a rendu ZÉRO écart sur un corpus portant deux faits faux* : voir A7 | divergence non expliquée par un format de localisation |
| A9 | **RELECTURE NATIVE DÉCLARÉE** | catalogues | déclaration datée : faite, par qui — ou **explicitement refusée avec son motif** | `oracles\oracle-remise-traduction.mjs` **T1** — **livré le 27/08** (TF-0670) | *l'absence de déclaration BLOQUE la remise* (principe 2) — et elle l'arrête désormais pour de bon |
| A10 | dimensionnement SERP | catalogues | longueurs par balise | `check-seo` (produit) — **existe** | titre ou description hors gabarit |
| A11 | remise avec risques **fermés ou refusés** | tout ce qui précède | restitution + lot de retours | S29 de `oracles\oracle-synthese.mjs` — **livré le 26/08** (TF-0661) | un risque déclaré non couvert sans action correspondante |

**Trois des quatre étapes manquantes nommées par le retour ont été outillées le 26/08** — A2
(`genre`), A6, A7 — et A11 avec elles. **A9 est outillée depuis le 27/08** (T1) — et c'est la seule étape que rien ne
remplace : *personne ne remplace un locuteur natif.* Le filet mécanique va AVANT lui, jamais à
sa place.

## Chaîne B — « audite les traductions »

**Le retour annonce dix étapes et n'en NOMME que trois.** Elles sont déclarées ici telles
quelles ; **les sept autres ne sont pas inventées** — une séquence devinée aurait exactement le
défaut qu'elle prétend corriger, celui d'une méthode écrite que rien ne tient.

| # | étape nommée | ce qu'elle produit | état |
|---|---|---|---|
| B2 | **carte des sources de vérité**, distinguant la SOURCE de l'ARTEFACT | pour chaque fait servi, d'où il vient et ce qui le régénère | écrite à la main pendant la session — **à outiller** |
| B7 | **axe GEO** : entités, citabilité, directives IA | ce qu'un moteur génératif peut citer, et ce qu'on lui interdit | écrite à la main — recoupe `forge-seo-geo` |
| B8 | **plan applicable à ancres verbatim** + sidecar machine | un plan dont chaque ancre existe littéralement dans le fichier visé | écrite à la main — **à outiller** |

*Ce sont des étapes DE MÉTHODE, identiques d'un produit à l'autre.* Les faire réécrire à la main
au produit suivant est exactement le coût que cette fiche existe pour supprimer.

## Le critère de réussite, et il est mesurable

Au prochain produit, « audite les traductions » formulé **en une phrase** doit produire :

1. un rapport dont **100 % des ancres verbatim existent** dans les fichiers visés, vérifiable par
   script ;
2. **zéro défaut détectable mécaniquement** sur les classes genre/accord et cohérence interne au
   moment de la remise ;
3. la liste explicite des **arbitrages posés à l'humain, NON VIDE** ;
4. une **déclaration de relecture native**, faite ou explicitement refusée.

**Les points 1, 3 et 4 sont désormais JUGÉS** par `oracle-remise-traduction.mjs` (T2, T3, T1) et le point 2 par les contrôles (i) et (j) du pan i18n de forge-tests, dont T4 exige la citation. Voir « La FICHE DE REMISE » ci-dessous.

**La mesure a deux moitiés, et la seconde compte autant que la première** : le nombre de tours de
classe DÉFAUT tombe à **0**, ET le nombre de tours de classe DÉCISION reste **≥ 1**. Une chaîne
qui ferait tomber les deux aurait supprimé l'arbitrage, pas le défaut.

## La FICHE DE REMISE, et ce que sa forme empêche

**Les quatre critères de réussite ci-dessus étaient rédigés en prose et rejoués par aucune
commande** — la classe de défaut de R-49 et de G7 : *une preuve nommée et datée qu'aucun script
ne reproduit vieillit en silence.* Depuis le 27/08, un run de traduction rend une **fiche de
remise** que `oracles\oracle-remise-traduction.mjs` juge (T1–T4, exit 0/1/2).

La fiche déclare `role:` … *remise* … *traduction* dans son frontmatter — un document qui ne s'en
réclame pas n'est pas jugé, sans quoi l'oracle accuserait n'importe quel markdown du dépôt. Elle
porte **quatre sections**, et chacune empêche une chose précise :

| Section | Ce qu'elle doit porter | Ce que son absence laisserait passer |
|---|---|---|
| `## Relecture native` | « Faite par *<nom>*, *AAAA-MM-JJ* » **ou** « Refusée — *<motif>* » | onze fautes d'accord parties en production, la relecture ayant eu lieu APRÈS la mise en ligne |
| `## Ancres verbatim` | une ligne par ancre : ``- `le texte exact` → chemin/du/fichier`` | un plan **inapplicable** : celui qui l'applique cherche un texte qui n'existe pas et ne peut pas trancher entre un plan faux et un fichier modifié |
| `## Arbitrages posés à l'humain` | une puce par arbitrage, **liste non vide** | une chaîne qui a décidé à la place de quelqu'un — l'inverse de la loi n° 5 |
| `## Contrôles mécaniques` | le verdict de l'accord **et** de la cohérence interne | les deux classes qui ont réellement franchi la chaîne : onze fautes d'accord, deux faits faux identiques dans les sept langues |

**Le REFUS est une réponse valide, le silence ne l'est pas.** T1 accepte « Refusée — aucun
locuteur natif disponible avant la date de remise, et l'exploitant a tranché » exactement comme
elle accepte une relecture faite. Ce qu'elle refuse est une section présente et vide : *un titre
sans contenu est indiscernable d'un oubli*, et un titre suffirait alors à passer la porte.

**Ce que l'oracle ne fait pas, et il vaut mieux le lire avant de s'y fier.** Il ne juge pas la
QUALITÉ d'une relecture — personne ne remplace un locuteur natif. Il ne rejoue pas les contrôles
qu'il exige de citer : T4 vérifie qu'un verdict est **rapporté**, pas qu'il est **vrai**. Et il ne
mesure pas la seconde moitié du critère de réussite — « les tours de DÉCISION restent ≥ 1 » se
compte sur une session, pas sur un document.

## Ce que cette fiche NE couvre PAS

- **Les deux chaînes sont dérivées d'UNE session, sur UN produit, dans UN domaine** — un site
  touristique multilingue. Elles sont **une proposition à confronter, pas un standard.** Le
  second produit qui les emploiera est la première mesure de leur généralité.
- **Sept des dix étapes de la chaîne B ne sont pas écrites.** Elles s'établiront au prochain
  audit, pas ici.
- **Le coût de mise en œuvre de ce qui manque n'est pas chiffré** ; ce tri appartient au registre
  TODO-FORGE, pas à cette fiche.
- **La justesse d'une traduction.** Aucun oracle ne la dit. La chaîne réduit la classe de fautes
  qu'une machine peut voir ; elle ne rend pas la relecture humaine facultative.
