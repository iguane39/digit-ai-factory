# Retours forges — un glossaire à un seul terme est un glossaire non vérifié — 20260825f

- **Contexte** : l'exploitant demande, après le lot `20260825e`, si le glossaire ne devrait
  pas être étendu à l'ensemble du vocabulaire de l'activité, et si le principe ne devrait
  pas remonter à la Factory. La passe complète menée pour répondre a produit un résultat
  que je n'attendais pas : **trois des sept entrées du glossaire lui-même étaient fausses**,
  et trois défauts distincts dormaient en production sans qu'aucun des neuf contrôles du
  projet ne les voie.
- **Références** : `build/i18n/glossaire.json` et les sept catalogues du projet, sondes
  Google Suggest (`hl`×`gl`) et articles Wikipédia par langue. Lots précédents :
  `20260825d` (méthode de recherche, `forge-seo-geo`) et `20260825e` (RT-34/RT-35, le
  glossaire et sa règle d'usage).
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce que la passe complète a trouvé

Ce chapitre rassemble les faits avant d'en tirer les retours, parce que c'est leur nombre
et leur diversité — et non l'un d'eux — qui fait l'argument.

Le glossaire livré la veille portait **un** terme, entré parce qu'un défaut l'avait
révélé. Une passe systématique sur le vocabulaire du produit, en une heure, a produit
quatre catégories de trouvailles.

| Trouvaille | Portée | Vu par un contrôle ? |
|---|---|---|
| Terme **retenu faux** en `it`, `es`, `pt` — dans le glossaire lui-même | 3 langues sur 7 | non |
| Proscription **fausse** : `casa rural` interdit à tort en `es` | 1 langue | non |
| `title` et `H1` allemands disent `Pool`, le catalogue dit `Hallenbad` **29 fois** | 2 positions, les plus pondérées | non |
| `deposit` employé en `en` pour la **caution** et pour l'**acompte** | contractuel | non |
| « **8 gîtes** » annoncé dans les **7** langues quand `data.mjs` en déclare 5 | 7 langues | non |

Sur les termes retenus à tort, le mécanisme est le même dans les trois langues :
`alloggio`, `alojamiento` et `alojamento` complètent tous, chez Google, en **logement
social et recherches de dictionnaire** — « alloggi per sinistrati », « alloggi erp »,
« alojamiento en frances », « alojamento social », « alojamento significado ». J'allais
remplacer un mot signifiant « excursions » par un mot signifiant « logement d'urgence ».

## Les quatre retours

Le premier porte sur la constitution du glossaire, le deuxième sur sa vérification, le
troisième sur sa structure, le quatrième sur une classe de contrôle absente.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-36 | majeur | **Le glossaire se constitue par accident.** RT-34 lui a donné un lieu, RT-35 un moment ; rien ne dit **comment il se remplit**. En pratique un terme y entre quand un défaut l'a révélé — le mien en portait un seul, celui qui m'avait sauté aux yeux. Mesure : une passe systématique sur le vocabulaire du produit a fait entrer **huit** termes et révélé trois défauts en production que le glossaire à un terme ne pouvait pas voir. | Le glossaire se dresse **en amont**, en balayant le vocabulaire de la langue source, avant la première traduction. Critère de sélection à inscrire au socle — un terme mérite une entrée quand le choix **n'est pas évident**, et il y a quatre façons de ne pas l'être : contresens ou faux ami ; plusieurs rendus valables, la cohérence devenant le sujet ; poids SEO ; précision contractuelle. Corollaire à écrire aussi : un terme à rendu unique et évident (jardin, terrasse, sauna) **ne mérite rien** — un glossaire exhaustif est du bruit, et du bruit qu'il faut maintenir. |
| RT-37 | **bloquant** | **Un glossaire non vérifié est plus dangereux qu'une absence de glossaire**, parce qu'il fait autorité. Mesure : **3 entrées sur 7 étaient fausses**, plus une proscription fausse — et elles portaient toutes une date, un motif et deux sources, donc toutes les marques de la fiabilité. Cause racine identifiable : le terme **retenu** avait été choisi à partir de la sonde qui avait servi à établir le terme **proscrit**. Établir « X est faux » et établir « Y est juste » sont deux recherches distinctes ; je n'avais fait que la première et j'ai présenté la seconde comme faite. | Une entrée de glossaire porte les sources du terme **retenu**, pas seulement celles du terme écarté — deux recherches, deux jeux de sources. Ajouter un champ `confiance` avec obligation de le renseigner à **BASSE** quand les sources n'ont pas tranché, plutôt que d'énoncer un verdict fabriqué : sur ce projet le portugais est le seul cas honnête, toutes ses sondes ayant renvoyé zéro. À rapprocher de **RT-32** (deux à trois sources par recommandation) : ici la règle existait déjà et n'a pas suffi, parce qu'elle ne disait pas **sur quelle affirmation** porter les sources. |
| RT-38 | majeur | **Une liste plate de termes ne peut pas exprimer ce qui a été trouvé.** Deux structures manquent, chacune démontrée par un défaut réel. (1) Les termes n'ont pas tous la même **exigence de preuve** : un terme de visibilité se prouve par une source externe — ce que les gens tapent —, un terme contractuel par l'exactitude lexicale et la cohérence interlangue. Les confondre fait sur-chercher les évidences et sous-chercher les termes à trafic. (2) Un mot peut être **juste ici et ambigu là** : `deposit` est l'usage anglais correct pour l'acompte, et ambigu pour la caution. Le visiteur anglophone lisait « 30% deposit » puis « Deposit of €400 payable on arrival », sans que rien ne dise que le second est rendu — les six autres langues ont deux mots distincts. | Deux champs au schéma : une **catégorie** (`visibilite` / `contractuel`) qui commande le type de preuve exigé, et une **portée** (`{ cle }`) qui restreint une règle aux chaînes rangées sous une clef donnée. La portée ouvre au passage une seconde forme de règle, absente jusqu'ici : le terme **requis**. Proscrire ne suffisait pas — c'est l'**absence** de « security deposit » sous la clef `caution` qu'il fallait pouvoir exiger. Implémenté et vérifié sur ce projet : `build/i18n/glossaire.json` et `build/check-glossaire.mjs`. |
| RT-39 | majeur | **Aucun contrôle ne confronte les nombres du texte à la source de vérité.** Mesure : la meta description de la page réservation annonçait « **8 gîtes** » dans les **sept** langues, français compris, quand `data.mjs` en déclare 5. C'est un résidu du retrait des gîtes bretons — le run a mis à jour l'intégralité du site sauf cette chaîne, et le défaut est parti en production. Neuf contrôles projet ne l'ont pas vu, dont un pan i18n complet et un audit `forge-seo-geo`. | Le motif existe déjà et n'est pas appliqué au bon endroit : `check-llms.mjs` confronte `llms.txt` aux sources (surfaces, prix, capacité du groupe) et **aurait attrapé** l'équivalent. Étendre ce motif aux catalogues de langue — tout nombre suivi d'un nom dénombrable que `data.mjs` sait trancher. Portée honnête à déclarer avec l'oracle : il ne juge que les nombres **dérivables** d'une source de vérité, pas les faits rédactionnels. |

## Ce que ces retours ne couvrent pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos, et parce que c'est
la discipline que les lots précédents réclament aux oracles.

La **justesse** d'une traduction reste hors de portée d'un script, et la passe menée ici ne
l'a pas jugée : elle a comparé des rendus entre eux et à des sources, jamais évalué un
registre ni une tournure. Deux limites de sonde méritent d'être nommées, faute de quoi
elles seraient relues comme des résultats. D'abord, une requête Google Suggest qui **est
déjà** une complétion fréquente renvoie zéro : « ferienhaus frankreich » et « vakantiehuis
frankrijk » renvoient 0 alors que la sonde précédente donnait « vakantiehuis frankrijk » en
**première** complétion. Un zéro n'est donc pas un négatif. Ensuite, un terme employé en
**composition** échappe à la recherche du mot isolé — l'allemand `Reinigung` et le
néerlandais `schoonmaak` n'apparaissent que dans `Reinigungskaution` et `schoonmaakborg`.
Les deux limites sont inscrites dans le glossaire du projet plutôt que corrigées, parce
qu'aucune des deux ne se corrige par un script.

## Remarques restées au produit

> Section ajoutée le **2026-08-26**, après l'arrivée du gabarit `RETOURS-FORGES.md`
> (`TF-0626`) : ce lot avait été rédigé sans lui et ne portait donc ni R-45 ni R-46.
> L'ajout est **purement additif** — aucun retour, aucun chiffre, aucune formulation
> d'origine n'a été touché. Le contenu ci-dessous est reconstitué depuis les commits
> de la fenêtre du lot.

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Corrigé chez le produit | Verdict de généralisation |
|---|---|
| Correction de quatre défauts partis en production : « 8 gîtes » dans 7 langues, `Pool` au lieu de `Hallenbad` en allemand, `deposit` ambigu en anglais, 81 emplois d'un faux ami en italien. | **Généralisable → REMONTÉ en RT-36 à RT-39** sous leur forme de classe, chacun ayant révélé un défaut d'outillage et non seulement de contenu. |
| Correction du glossaire lui-même : trois termes retenus sur sept étaient faux, et une proscription l'était aussi. | **Généralisable → REMONTÉ en RT-37**, dont c'est la preuve principale. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit.** Aucun des gabarits de `gabarits\documents\`
n'a servi sur ce projet : aucun document du dépôt ne porte d'identifiant `gd-…`. La section
est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46, qui vise les livrables issus de
`gabarits\documents\`, et est consignée faute de canal plus juste : **ce lot lui-même a été
produit sans son gabarit de méthode**, `RETOURS-FORGES.md` étant absent du dépôt jusqu'à
`TF-0626` du 26/08/2026. C'est la cause directe de l'ajout rétroactif signalé ci-dessus.

## Confirmations positives

- **RT-34 et RT-35 étaient justes et ont produit l'effet attendu.** C'est parce que le
  glossaire existait comme fichier, avec ses motifs et ses sources, que ses erreurs ont pu
  être trouvées et datées. Une connaissance restée dans une conversation n'aurait pas été
  réfutable. RT-37 ne les corrige pas, il les complète.
- **Le mécanisme des proscriptions conditionnelles a payé immédiatement.** L'italien
  contient une occurrence **légitime** de « gite », au sens d'excursions, sous la clef
  `h2Autres` — le français dit « Les autres escapades ». Une proscription plate aurait
  détruit une chaîne correcte ; la règle conditionnelle, qui **nomme** au lieu de mesurer,
  l'a préservée et signalée à la relecture.
- **Le contrôleur a attrapé une erreur introduite pendant sa propre mise au point** : un
  remplacement trop large avait écrit `caution` comme terme requis en allemand, où le mot
  est `Kaution`. Détecté au premier lancement.

## Ordre recommandé

1. **RT-37** — la vérification ; tant qu'elle n'est pas réglée, chaque glossaire produit
   par la forge porte le même risque, avec l'autorité en plus.
2. **RT-38** — la structure ; elle conditionne ce que RT-36 peut faire entrer.
3. **RT-36** — la constitution en amont, qui suppose les deux précédents.
4. **RT-39** — indépendant des trois autres, et applicable seul.
