---
role: les deux chaînes déclarées de la traduction — « traduire un produit », « auditer ses traductions »
destinataire: orchestrateur (pilot) et forges mobilisées
sources_de_verite: ["retour Produit-02 20260826f (TF-0664)", "todo/TODO.jsonl — TF-0660, TF-0663, TF-0661, TF-1318", "gabarits/GLOSSAIRE.md", "forge_tests/adaptateurs/i18n.py", "oracles/oracle-remise-traduction.mjs", "scripts/verifier-sonde-glossaire.mjs", "scripts/produire-plan-ancres.mjs"]
verifie_le: 2026-09-23
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
qui n'a émergé que parce que l'exploitant a insisté 3 fois.

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
| A3 | preuve de marché **rejouable et périssable** par terme de visibilité | glossaire | colonne `preuve`, ≥ 2 sources de nature différente | G5 + G7 — **existe** ; rejeu et péremption de `verifie_le` : `scripts\verifier-sonde-glossaire.mjs`, S-1 à S-4 — **livré le 23/09** (TF-1318, voir B4) | une ligne de visibilité sans commande rejouable ; une preuve échue |
| A4 | **ARBITRAGE HUMAIN** sur les termes à enjeu | glossaire + preuves | décision datée, consignée | **aucun oracle, et c'est voulu** (principe 1) | liste d'arbitrages VIDE |
| A5 | traduction | glossaire arbitré | catalogues par locale | `check-glossaire` + `check-traductions` (produit) — **existent** | terme retenu absent, terme proscrit employé |
| A6 | **contrôle du genre et de l'accord après substitution** | catalogues + `genre` déclaré | écarts d'accord nommés par clé | contrôle **(j)** du pan i18n de forge-tests — **livré le 26/08** (TF-0660) | un déterminant du genre opposé collé au terme retenu |
| A7 | **cohérence INTERNE de chaque langue**, confrontée aux sources de données | catalogues + données du produit | contradictions intra-locale nommées par clé | contrôle **(i)** du pan i18n — **livré le 26/08** (TF-0663) ; nombres confrontés à la donnée : contrôle (g), TF-0644 | un sujet portant deux valeurs pour la même unité |
| A8 | cohérence interlangue | catalogues | divergences par clé | **existe (partiel)** — et *il a rendu ZÉRO écart sur un corpus portant deux faits faux* : voir A7 | divergence non expliquée par un format de localisation |
| A9 | **RELECTURE NATIVE DÉCLARÉE** | catalogues | déclaration datée : faite, par qui — ou **explicitement refusée avec son motif** | `oracles\oracle-remise-traduction.mjs` **T1** — **livré le 27/08** (TF-0670) | *l'absence de déclaration BLOQUE la remise* (principe 2) — et elle l'arrête désormais pour de bon |
| A10 | dimensionnement SERP | catalogues | longueurs par balise | `check-seo` (produit) — **existe** ; hors du produit, contrôle **(l)** du pan i18n de forge-tests — **livré le 23/09** (TF-1318, voir B6) | titre ou description hors gabarit |
| A11 | remise avec risques **fermés ou refusés** | tout ce qui précède | restitution + lot de retours | S29 de `oracles\oracle-synthese.mjs` — **livré le 26/08** (TF-0661) | un risque déclaré non couvert sans action correspondante |

**Trois des quatre étapes manquantes nommées par le retour ont été outillées le 26/08** — A2
(`genre`), A6, A7 — et A11 avec elles. **A9 est outillée depuis le 27/08** (T1) — et c'est la seule étape que rien ne
remplace : *personne ne remplace un locuteur natif.* Le filet mécanique va AVANT lui, jamais à
sa place.

## Chaîne B — « audite les traductions »

**Le retour nomme ses dix étapes, B1 à B10** — tableau de la section « Chaîne B » du lot
`Produit-02 - RETOURS - 20260826f`, avec le tour de session où chacune a eu lieu. **RECTIFICATION
du 22/09/2026 (TF-1094)** : cette fiche écrivait jusqu'ici que le retour « annonce dix étapes et
n'en NOMME que trois », et ne déclarait que B2, B7 et B8. C'était une erreur de lecture : le lot
dit « dix étapes, **dont** trois ont été écrites à la main par l'exploitant » — les trois étaient
celles que la session avait INVENTÉES, pas les seules nommées. Les sept autres sont transcrites
ci-dessous depuis le lot, mot pour mot quant à leur libellé ; rien n'y est deviné. La colonne
« porteur » dit ce qui, dans le parc, tient réellement l'étape.

**Mise à jour du 23/09/2026 (TF-1318, décision humaine D-13 (a)).** Chaque étape nomme désormais
son porteur, ou une décision proposée avec son motif. 2 gloses et 2 lignes de porteur du 22/09
étaient fausses ; elles sont rectifiées sur place, chacune avec sa source :

- **B4** glosait « la preuve qu'une locale vaut d'être servie ». Au tour 10, c'est la preuve d'un
  terme du glossaire qui n'était pas rejouable : B4 est la preuve de marché de A3, terme par terme.
- **B5** déclarait son volet « contre les sources de données » sans porteur. Le contrôle (g) du pan
  i18n le tient depuis le 26/08 (TF-0644), et la ligne A7 de cette fiche le citait déjà.
- **B6** glosait « l'ampleur de la recherche par locale ». Le lot `20260826d` dit que `check-seo`
  « compte des caractères » : B6 est la longueur des titres et descriptions, la même étape que A10.
- **B3** attribuait la confrontation à l'emploi au seul `check-glossaire` du produit. Le contrôle (h)
  du pan i18n la tient aussi depuis le 26/08 (TF-0656).

| # | étape (libellé du lot) | sortant | porteur au 23/09/2026 | état |
|---|---|---|---|---|
| B1 | ligne de base mécanique : jouer les contrôleurs existants | les constats de ce qui existe déjà, avant tout jugement neuf | pan i18n de forge-tests (`forge_tests/adaptateurs/i18n.py`) ; chez le produit, `check-glossaire` et `check-traductions` (étape A5) | **porté** |
| B2 | **carte des sources de vérité**, distinguant la SOURCE de l'ARTEFACT | pour chaque fichier visé par le plan, s'il est source ou artefact, et ce qui le régénère | section `## Sources de vérité` de la fiche d'audit, jugée par **T7** d'`oracles\oracle-remise-traduction.mjs` (C1–C4) ; rendue depuis le sidecar `plan-ancres@1` par `scripts\produire-plan-ancres.mjs` | **porté** — écrire la carte reste à l'auditeur : décision proposée D-B2 |
| B3 | confrontation glossaire ↔ emploi réel, par langue | les termes retenus absents, les proscrits employés | `oracles\oracle-glossaire.mjs` (G1–G8) juge le glossaire lui-même ; le contrôle **(h)** du pan i18n accuse un retenu à zéro emploi quand un proscrit est employé (TF-0656) ; `check-glossaire` chez le produit | **porté en partie** — un proscrit employé à côté d'un retenu employé n'est pas accusé, borne déclarée de (h) |
| B4 | preuve de marché rejouée, et sa péremption vérifiée | la preuve de marché de chaque terme de visibilité, rejouée et encore valide | `scripts\verifier-sonde-glossaire.mjs` : rejeu par `--rejouer` (S-1, S-2, TF-1084) ; péremption par l'âge de `verifie_le`, déclarée au glossaire ou passée par `--peremption` (S-3, S-4, TF-1318) ; G7 exige la commande ; la méthode de la preuve est le nœud 21 de forge-seo-geo | **porté** — la durée par défaut est une décision proposée : D-B4 |
| B5 | cohérence interne, interlangue, et contre les sources de données | les contradictions d'une locale avec elle-même, entre locales, et avec les données qu'elle cite | interne : contrôle **(i)** (TF-0663) ; genre : **(j)** (TF-0660) ; interlangue : **(d)–(f)** du catalogue et `oracles\oracle-invariants-traduction.mjs` F1–F4 ; données : **(g)** (TF-0644), nombres rapprochés de `FAITS.json`, et **(k)** (TF-0665), éteint par défaut ; **T8** exige la citation | **porté** — seuls les NOMBRES sont confrontés à la donnée |
| B6 | dimensionnement SERP | la longueur des titres et descriptions servis, par locale, contre la borne de troncature | contrôle **(l)** du pan i18n de forge-tests (TF-1318), contre des bornes déclarées, sourcées et datées (`FORGE_TESTS_SERP_BORNES`) ; chez le produit, `check-seo` (A10) | **porté** |
| B7 | **axe GEO** : entités, citabilité, directives IA | ce qu'un moteur génératif peut citer, et ce qu'on lui interdit | directives IA : règle **R-27** d'`oracles\oracle-conformite-projet.mjs` (agent IA bloqué sans décision consignée, `llms.txt` absent) ; le périmètre de `llms.txt` par locale est un ARBITRAGE, posé en B9 ; T5 exige le verdict de l'axe | **porté en partie** — entités et citabilité : décision proposée D-B7 |
| B8 | **plan applicable à ancres verbatim** + sidecar machine | un plan dont chaque ancre existe littéralement dans le fichier visé | production : `scripts\produire-plan-ancres.mjs` depuis le sidecar `plan-ancres@1` (P1–P5 : ancre présente, unique ou dénombrée, remplacement effectif, format de fiche, aucun chevauchement) ; remise : **T2** | **porté** |
| B9 | arbitrages isolés et **posés à l'humain**, jamais tranchés seuls | la liste des décisions laissées à l'humain | règle T3 d'`oracles\oracle-remise-traduction.mjs` (liste des arbitrages non vide) | **porté** — c'est la seule étape qui a bien fonctionné du premier coup, sans outil |
| B10 | critère d'arrêt et déclaration explicite de ce qui n'est pas couvert | quand l'audit s'arrête, et ce qu'il n'a pas regardé | **T5** : chaque étape B1–B10 porte son verdict, et une étape non jouée dit son motif ; **T6** : chaque locale servie est couverte ou déclarée non couverte, et `--catalogue` confronte la liste au catalogue réel | **porté** — l'audit s'arrête quand T1 à T8 rendent PASS |

*Ce sont des étapes DE MÉTHODE, identiques d'un produit à l'autre.* Les faire réécrire à la main
au produit suivant est exactement le coût que cette fiche existe pour supprimer.

**Le dimensionnement SERP ne se branche pas sur forge-seo-geo, et c'est voulu.** forge-seo-geo
audite un site en ligne, sur mandat humain, après la mise en production. Son nœud 50 juge la
longueur des titres sur un échantillon de 20, en session, et son robot ne relève pas la
méta-description. B6 se joue avant la remise, sur le build servi : c'est le point d'observation du
pan i18n. Les nœuds 21 et 50 restent la méthode de l'audit du site en ligne.

### La chaîne B, commande par commande

La chaîne appelle chaque porteur à son étape ; la fiche de remise relit tous les verdicts. `<produit>`
désigne la racine du produit audité, et les commandes du pilot se jouent depuis la racine du pilot.

1. **B1, B3 (emploi), B5 (interne, genre, données) et B6** — `uv run python -m forge_tests <produit> --pans i18n --json`,
   joué depuis forge-tests. `FORGE_TESTS_FAITS` ouvre le contrôle (g), `FORGE_TESTS_SERP_BORNES` le
   contrôle (l) ; rien de déclaré, rien de jugé, et le rapport le dit.
2. **B3 (forme du glossaire)** — `node oracles\oracle-glossaire.mjs <GLOSSAIRE.md>`.
3. **B4** — `node scripts\verifier-sonde-glossaire.mjs <GLOSSAIRE.md> --peremption <jours>`, qui sort en
   1 sur une preuve échue. Appelé par `oracle-glossaire.mjs --sondes`, le même verdict reste
   consultatif : le code de sortie y est celui de l'oracle de forme, mesuré à 0 sur une preuve échue
   le 23/09. Le rejeu effectif ajoute `--rejouer --rejouer-hors-depot` : le glossaire d'un produit
   est une donnée, et l'exécuter se décide.
4. **B5 (interlangue)** — `node oracles\oracle-invariants-traduction.mjs --paires <paires.json> --langue-cible <code> --invariants <liste.json>`.
5. **B7** — `node oracles\oracle-conformite-projet.mjs <produit> --regles R-27`.
6. **B8 et B2** — `node scripts\produire-plan-ancres.mjs <plan-ancres.json> --racine <produit> --markdown`,
   qui rend les sections à coller dans la fiche ; un plan qui échoue n'est jamais rendu.
7. **B9, B10 et la remise** — `node oracles\oracle-remise-traduction.mjs <FICHE-AUDIT.md> --racine <produit> --catalogue <dossier du catalogue>`.

### La fiche de remise d'un AUDIT : 4 sections de plus

Une remise d'audit est une fiche de remise dont le `role:` dit « audit ». Son frontmatter déclare
aussi `locales:`, la liste des locales servies. Elle porte les 4 sections décrites plus bas, et 4 de
plus, que T5 à T8 jugent. Une remise de run (chaîne A) garde ses 4 règles : T5 à T8 y rendent
SANS_OBJET.

| Section | Contenu exigé | Règle | Défaut arrêté, tel qu'il a été mesuré |
|---|---|---|---|
| `## Étapes de la chaîne` | une ligne par étape, `- B4 : PASS — …` ; une étape non jouée s'écrit `SANS_OBJET`, `MANUELLE` ou `NON COUVERTE`, suivie de son motif | T5 | une étape oubliée sans un mot : l'axe GEO l'a été, et il a fallu l'ajouter à la main au tour 2 |
| `## Couverture des locales` | `- de : couverte`, ou `- nl : non couverte — <motif>`, pour chaque locale déclarée | T6 | une relecture bornée aux langues substituées, quand les quatre autres portaient des défauts du même run (tour 17) |
| `## Sources de vérité` | un tableau à 4 colonnes — fichier, nature, source, régénéré par — où la nature vaut `source` ou `artefact` | T7 | une correction posée sur l'une des 203 pages que le build régénère, écrasée au build suivant (lot `20260823a` : 9 sources modifiées, 203 pages régénérées) |
| `## Contrôles mécaniques` | en plus de l'accord et de la cohérence interne : « confrontation aux données : <verdict> » | T8 | « 8 gîtes » servi dans les sept langues quand la donnée en déclare 5 |

Le plan vit dans un sidecar `plan-ancres@1` : la liste des modifications et la carte des sources.
`scripts\produire-plan-ancres.mjs` le juge, puis rend les sections `## Sources de vérité`,
`## Ancres verbatim` et `## Plan applicable`. Le format vit dans `scripts\lib-plan-ancres.mjs`,
que le producteur et T7 partagent : un format, un seul lecteur.

### Les décisions proposées, non tranchées

3 résidus restent manuels. Ils sont proposés à l'humain avec leur motif ; aucun n'est tranché ici,
et l'outil livré ne présume pas de la réponse.

- **D-B2 — écrire la carte des sources de vérité reste à l'auditeur.** Motif : savoir quel fichier
  régénère lequel exige de connaître le build du produit, et le pilot n'exécute pas le build d'un
  produit autonome. T7 juge la forme de la carte et sa conséquence sur les ancres ; il ne la devine
  pas. Réouverture : un gabarit de build commun au parc, qui déclare ses sorties.
- **D-B4 — la durée de validité d'une preuve de marché.** Option (a) : aucune durée par défaut ;
  chaque glossaire déclare `peremption_preuves_jours`, et sans elle l'âge n'est pas jugé, ce que la
  fiche dit en B4. Option (b) : 365 jours par défaut, d'après la cadence « re-ratisser une fois par
  an » de forge-seo-geo (`referentiel/recherche-multilingue.md` §3). L'outil applique (a) aujourd'hui.
- **D-B7 — entités et citabilité, laissées manuelles.** Motif : leur jugement demande le site en
  ligne et une recherche web — nœuds 54 à 58 de forge-seo-geo, preuves `[T3]`, résultat du nœud 58
  « non reproductible et non stable ». Aucun corpus du parc ne permet de mesurer la précision d'un
  contrôle mécanique d'entités multilingues. Or le parc mesure la précision d'un contrôle avant de
  le publier, et refuse celui qui accuse à côté : la règle large du genre l'a été
  (`gabarits\GLOSSAIRE.md`), et les nombres orphelins sont livrés éteints. Réouverture : un produit
  fournit un corpus JSON-LD multilingue sur lequel mesurer cette précision.

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
| `## Contrôles mécaniques` | le verdict de l'accord **et** de la cohérence interne | les 2 classes qui ont réellement franchi la chaîne : onze fautes d'accord, deux faits faux identiques dans les sept langues |

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
- **La chaîne B n'a été jouée de bout en bout sur aucun produit.** Depuis le 23/09, chaque étape
  a son porteur ou sa décision proposée ; le prochain audit est la première mesure de l'ensemble.
- **La confrontation aux données ne voit que les nombres.** Une adresse, une date ou un nom propre
  faux de la même façon dans toutes les langues passe (g) et (k).
- **Le pan i18n ne lit un catalogue qu'en JSON, et jamais sous un dossier `build\`.** Mesuré le
  23/09 : un catalogue `build/i18n/*.mjs`, la forme du produit d'origine (lot `20260823a`), n'y est
  ni lu ni déclaré non lu. Sur ce produit, (d) à (k) se tairaient sans le dire.
- **Le coût de mise en œuvre de ce qui manque n'est pas chiffré** ; ce tri appartient au registre
  TODO-FORGE, pas à cette fiche.
- **La justesse d'une traduction.** Aucun oracle ne la dit. La chaîne réduit la classe de fautes
  qu'une machine peut voir ; elle ne rend pas la relecture humaine facultative.
