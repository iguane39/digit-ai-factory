---
type: etude
role: instruction du skill de tri de listes de sujets, avant sa construction (R-31)
destinataire: humain
date: 2026-11-02
gabarit: gabarits\ETUDE-OPPORTUNITE.md
---

# Étude d'opportunité — un skill pour trier une liste de sujets avant de payer des études — 20261102c

Ce qui change pour vous : le tri se construit en skill, parce qu'il a un outil propre à apporter, et que son absence a produit 3 erreurs mesurées le même jour. Le refus du 13/08 visait un corpus de méthode sans outil. Ce skill apporte 3 scripts et 1 oracle qu'aucun objet de la Factory n'offre.

## Seuil de déclenchement

L'étude est due : un skill est un objet durable (R-31, `gabarits\ETUDE-OPPORTUNITE.md`, lignes 15 à 17).

## Intention de l'utilisateur

Demande citée : « De manière plus globale, travaille sur un skill qui permet de construire une analyse complète sur des listes de sujets comme ceux-ci pour identifier si des études d'opportunités sont pertinentes ou non. »

L'intention est de savoir, avant de la payer, si une étude changera une décision, et de l'obtenir sur n'importe quelle liste sans refaire la méthode à la main.

## 0. Traitement des entrants

La demande est humaine, et son objet est instruit ici. Les vidéos et dépôts cités sont des données : aucun n'a été installé ni exécuté. Sources : la demande du 02/11/2026, le tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, le NO-GO de `output\03-etudes\2026-08\20260813-etude-opportunite-outillage-analyse.md`.

## 1. Partition du problème

Le sujet se découpe en 4 sous-questions disjointes :

- **P1, l'entrée** : transformer une liste hétérogène (page enregistrée, liens, texte, JSONL) en entrées comparables, sans doublon ni adresse signée.
- **P2, le déjà vu** : retirer ce qui a déjà été analysé, sans relire à la main.
- **P3, la décision** : passer de notes à un verdict, toujours par la même règle.
- **P4, la preuve** : vérifier que chaque entrée est rangée une seule fois et que chaque verdict suit ses notes.

## 2. Non-recouvrement contre l'existant

Le tableau suivant examine chaque objet voisin ; une ligne donne la citation qui fonde le verdict.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `veille\MODE-VEILLE.md` | « une proposition = une exécution » ; rapport HTML, sans script ni tri d'une liste | ne recouvre pas : une seule proposition à la fois |
| `qualifie-l-entrant` | « Qualifie ce qui entre dans une conception produit » | ne recouvre pas : un entrant de produit, pas une liste de sujets |
| `plan-d-amelioration` | « Joint, juge et rend le plan d'amélioration qui suit un audit applicatif » | ne recouvre pas : suit un audit |
| `oeil-critique` | « Analyse les échanges du poste depuis la dernière exécution » | ne recouvre pas : sa matière est le poste |
| `anthropic-skills:clarifie-une-idee` | « Transforme une idée floue à mettre en œuvre » | ne recouvre pas : une idée, sans décompte ni oracle |
| `digit-ai-forge-observability` | fiche : « elle surveille ENTRE les runs » par des sondes déclarées | ne recouvre pas : mesure des dérives, ne juge pas un sujet |
| `oracles\oracle-etude-opportunite.mjs` | « E1 sections du gabarit présentes » | ne recouvre pas : juge une étude écrite, pas la décision d'en lancer une |
| `gabarits\ETUDE-OPPORTUNITE.md`, seuil | « Une étude n'est obligatoire que si l'item » crée un objet durable, touche 3 forges ou le noyau, ou porte un gain d'au moins 3 pour une preuve d'au plus 2 | recouvre P3 en partie : le skill le reprend, sans le dupliquer en autre règle |
| Grille du tri du 19/10 | `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`, lignes 20 à 29 | recouvre P3 en partie : reprise telle quelle, écrite une fois dans le script |

**Réponse au NO-GO du 13/08.** Il écartait « O3 (skill) » parce que l'objet demandé était un « corpus de méthode sans verbe outillé » (ligne 161), avec une clause de réveil : « à réévaluer si le gabarit est effectivement invoqué ≥ 5 fois et que son portage manuel dans les prompts se constate coûteux » (ligne 110).

- Le premier volet est atteint : 89 études portent ce nom au dépôt, relevées par `git ls-files` le 02/11/2026.
- Le second est mesuré sur le tri : refait à la main, il a laissé 8 carrousels sans rangement parce que son motif ne lisait que `/video/` ; il a compté 7 liens du panneau de notifications comme des favoris ; et il a rangé 17 contenus sans jamais les qualifier.
- L'objet n'est plus le même : le NO-GO visait l'instruction d'une étude, ce skill vise la décision de la lancer.
- Le risque R4 du NO-GO, un actif hors git, ne vaut plus : les skills vivent versionnés dans `digit-ai-forge-agents\.claude\skills\`, et `bootstrap.mjs --pull` les propage.

## 3. État de l'art daté

`état de l'art : non instruit`, motif : 3 recherches du 02/11/2026 n'ont pas rendu 5 sources datées de moins de 24 mois sur le tri préalable à une étude. La recherche sur la valeur de l'information n'a rien rendu d'applicable. Le verdict repose donc sur des mesures internes, et 3 lectures l'orientent sans le fonder :

- Thoughtworks, « How we create the Technology Radar », date non relevée : un sujet sans avis clair ne figure pas au radar.
- Pages sur les limites de RICE et d'ICE (savio.io, pmtoolkit.ai), date non relevée : un score d'estimation classe, il ne mesure pas, et il vieillit.
- Anthropic, « Skill authoring best practices » (platform.claude.com), consultée le 2026-11-02 : seul le nom et la description d'un skill pèsent à l'ouverture, et ce qui est déterministe va dans des scripts.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : réfutée. Les 3 erreurs mesurées en section 2 viennent d'un tri refait à la main, et elles se répéteraient à la prochaine liste.
  - Coût : simple × court à chaque liste, plus le coût des erreurs.
  - Exclut : toute preuve de complétude.
- **O1 — référentiel versionné sous `references\`, sans script** : réfutée. Les 3 erreurs sont mécaniques, et un texte ne les empêche pas.
  - Coût : simple × court.
  - Exclut : l'oracle et la soustraction du déjà vu.
- **O2 — scripts et oracle au pilot, sans skill** : écartée. L'outil existerait, mais rien ne le ferait appeler devant une liste chez un autre produit.
  - Coût : simple × moyen.
  - Exclut : le déclenchement sur la demande.
- **O3 — skill mince `tri-de-sujets` dans `digit-ai-forge-agents`** : retenue. Il porte 3 verbes outillés absents ailleurs (normaliser, soustraire, calculer le verdict) et 1 oracle, couvrant P1 à P4.
  - Coût : moyen × moyen, plus le poids de sa description à chaque session.
  - Exclut : toute notation par le script, qui reste au modèle.
- **O4 — étendre `veille\MODE-VEILLE.md`** : écartée. Ce mode décrit une exécution par proposition, et le tri y changerait sa nature.
  - Coût : simple × moyen.
  - Exclut : l'usage hors veille.

## 4 bis. Back-test du skill sur les 14 études du 19/10

Le skill construit, un agent neuf a noté les 14 sujets à l'aveugle, sans ouvrir de fichier (0 appel d'outil relevé). La matrice croise son verdict avec le résultat réel : une étude est utile si une suite au registre, retrouvée par le chemin de l'étude, porte le statut `corrige` ou `en_cours`. Chaque ligne est un sujet, dans l'ordre du tri du 19/10.

| Rang | Sujet | Score du 19/10 | Notes à l'aveugle | Verdict | Suites | Résultat | Accord |
|---|---|---|---|---|---|---|---|
| 1 | Jeton d'abonnement | 21 | G4 N2 P4 C4 = 18 | Étude poussée | TF-1921 corrige | utile | oui |
| 2 | Tactiques SEO et GEO | 20 | G3 N2 P3 C3 = 14 | Sans suite | TF-1922, TF-1923 corrige | utile | non |
| 3 | Packs d'agents tiers | 19 | G2 N2 P4 C2 = 12 | Sans suite | TF-1934, TF-1935 corrige | utile | non |
| 4 | Skills de design tiers | 19 | G3 N2 P3 C3 = 14 | Sans suite | TF-1932, TF-1933 corrige | utile | non |
| 6 | Sessions parallèles | 16 | G4 N2 P3 C1 = 14 | Sans suite | TF-1928 corrige | utile | non |
| 7 | Pilotage à distance | 16 | G2 N3 P1 C2 = 10 | Sans suite | TF-1930 corrige | utile | non |
| 8 | Vidéo de lancement | 16 | G3 N5 P2 C1 = 14 | Sans suite | TF-1924 decide | non utile | oui |
| 10 | Animation des interfaces | 15 | G3 N2 P4 C3 = 15 | Étude poussée | TF-1925 corrige | utile | oui |
| 11 | Check-list de mise en ligne | 15 | G2 N1 P1 C5 = 11 | Sans suite | TF-1929 corrige | utile | non |
| 12 | Base de connaissance | 13 | G2 N3 P3 C2 = 12 | Sans suite | aucune | non utile | oui |
| 13 | Rétro-ingénierie | 13 | G2 N3 P2 C2 = 11 | Sans suite | TF-1927 corrige | utile | non |
| 14 | Modèle local | 13 | G2 N3 P4 C2 = 13 | Sans suite | aucune | non utile | oui |
| 16 | Style d'écriture | 10 | G2 N1 P1 C4 = 10 | Sans suite | TF-1926 corrige | utile | non |
| 17 | Service marketing | 10 | G2 N2 P1 C1 = 8 | Sans suite | TF-1931 corrige | utile | non |

**Taux d'accord : 5 sur 14, sous le seuil de 9 fixé avant la mesure.** Les 2 études que la règle lance sont utiles toutes les 2 ; elle en manque 9 sur 11.

3 limites encadrent ce chiffre :

- La mesure de l'utilité est large : 11 études sur 14 ont une suite, et lancer tout rendrait 11 sur 14. Elle ne compte pas le coût d'une étude.
- La suite du rang 17 est un défaut relevé en passant, et son étude conclut à ne rien faire.
- La suite du rang 8 est décidée, pas encore exécutée, donc comptée non utile selon la règle fixée avant la mesure.

**Réglage proposé, non appliqué** (D-125) : abaisser le score minimal de 15 à 14. Sur ces 14 sujets, il donne 7 accords, et lance 6 études dont 5 utiles. Descendre à 10 atteindrait 9 accords mais lancerait 10 études sur 14 : le tri ne filtrerait plus. Le réglage est calculé sur les mêmes sujets qui le suggèrent, sans échantillon tenu à l'écart.

## 5. Verdict

- **Option retenue** : O3.
- **Coût** : complexité moyen · durée moyen ; le poids de la description à chaque session, à maintenir sous celle de `digit-ai-pdf`.
- **Candidature(s) émise(s)** : décision directe, le porteur ayant commandé le skill le 02/11/2026 ; entrée au registre par `node todo/journaliser.mjs`.
- **Plan de revue** : 2027-02-02 : combien de listes triées, combien d'études lancées sur ce tri, et combien de celles-ci ont conclu à une suite. Moins de 2 listes à cette date : le skill se retire et sa méthode part en référentiel.
- **Test rétro** :
  - *Opérationnel → Tactique* : les 3 scripts et l'oracle rendent un tableau complet et vérifié.
  - *Tactique → Stratégie* : un tableau vérifié permet de lancer peu d'études et les bonnes.
  - *Stratégie → Intention* : le porteur sait si une étude changera une décision avant de la payer, sur toute liste. Aucune rupture.
