# Retours forges — digit-ai-forge-conception — 20260905a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905a` (TF-0799 et TF-0804), sur mandat humain du 05/09/2026. Les **deux** travaux sont faits, joués et prouvés dans les deux sens ; ce lot rend compte et remonte **trois** constats nouveaux, tous nés de l'instruction elle-même.
- **Références ledger** : ce dépôt ne tient pas de `forge\ledger.jsonl` — les références opposables sont les **commits locaux `90d3767`** (TF-0799) et **`0830694`** (TF-0804) de `digit-ai-forge-conception`, aucun `push`, et la sortie de `node oracles\self-test.mjs` (**11 oracles, 48 règles, VERT**).
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `input\00-retours\` du pilot ; le lot de travaux reste chez la forge, sa ligne de statut passée à `traite le 2026-09-05` — seule édition faite. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-09-05

## Contrôle de complétude

Le lot confiait **deux** travaux. Les deux sont instruits en entier, chacun avec le moyen de vérification que le lot énonçait comme critère de fin. Rien n'est resté en attente ; ce qui n'a **pas** été fait est nommé sous chaque travail, avec son motif mesuré.

## Ce qui a été fait — TF-0799, les frontières de mot Unicode

**Le défaut, remesuré ici avant d'être corrigé.** `\b` est ASCII dans le moteur de Node, et le défaut a deux sens, tous deux reproduits sur les gardes de cette forge : la garde des pronoms d'**E8** trouvait « elle » à l'intérieur de « arborescence **réelle** » (faux positif — le critère juste était refusé) ; et six motifs dont un bord n'est pas un caractère de mot ASCII n'atteignaient **jamais** leur cible (faux négatif) — « ça » et « celle-là » (E8), « de qualité » (E4), « `10 €` » et « `80 %` » (E3 d'`oracle-exigences` et A1 d'`oracle-claims`), « etc. » (EA2 d'`oracle-ears`). Un septième s'y ajoute, de la même cause et dans l'autre sens : un énoncé ouvrant par « **Siège** du salarié… » était lu comme la conditionnelle « si » (le `è` faisait frontière) — E7 y voyait une condition orpheline, et le classement EARS le rangeait en ambigu.

**Le correctif.** `oracles\_contrat.mjs` porte désormais deux constantes partagées, `AVANT` et `APRES`, qui généralisent **exactement** le caractère de mot d'ASCII (`[A-Za-z0-9_]`) à son équivalent Unicode (`[\p{L}\p{N}_]`), drapeau `u` exigé. Sur un texte sans accent, le verdict est **inchangé** : seul l'accent cesse de faire frontière, et aucune garde ne s'élargit au passage.

**Les motifs changés, chacun sur un défaut mesuré** : E3 `CHIFFRE` (fin de motif), E4 liste noire, E7 tête conditionnelle, E8 absolus, pourcentage total et pronoms — dans `oracle-exigences` ; A1 `CHIFFRE` dans `oracle-claims` ; EA2 (termes ambigus) et les trois têtes de patron EARS dans `oracle-ears`.

**Les motifs laissés tels quels, faute de défaut mesuré** — la consigne du lot était de ne pas élargir sans mesure : les motifs d'identifiants purement ASCII (`oracle-claims` neutralise `E-001`, `v2.1`, les années ; `oracle-vues-profil` reconnaît `RM-…`), où aucun accent ne peut être adjacent ; et les deux constructions d'`oracle-ears` (`_reTerme`, `_reStem`) qui s'appliquent à un texte **déjà plié sans accent** — `\b` y est exact, et le module le documentait déjà.

**La preuve, et le compte avant → après.** Branche `TF-0799` de `oracles\self-test.mjs`, fixtures **éphémères dérivées de la fixture verte partagée** (une seule exigence change, tout le reste est le référentiel qui passe déjà — la mesure est isolée), **six cas**, une par sens du défaut :

| Cas | Sens | Avant | Après |
|---|---|---|---|
| E8 — « réelle » ne déclenche plus la garde du pronom | (a) faux positif | FAIL | **PASS** |
| E8 — témoin : le pronom **nu** « Elle » échoue toujours | (a) contre-épreuve | FAIL | **FAIL** (voulu) |
| E8 — « ça » et « celle-là » enfin atteints | (b) faux négatif | muet | **FAIL nommant les deux** |
| E4 — « de qualité » enfin attrapé | (b) faux négatif | muet | **FAIL** |
| E3 — « `10 €` » enfin reconnu comme chiffré | (b) faux négatif | FAIL | **PASS** |
| E7 — « Siège… » n'est plus une conditionnelle orpheline | (b) faux positif | FAIL | **PASS** |

**Comment lire ce tableau** : « avant » et « après » sont deux exécutions du **même** banc, la première obtenue en remettant `\b` dans les deux constantes partagées — **1 cas tenu sur 6 avant, 6 sur 6 après**. Le témoin de la ligne 2 est ce qui distingue une garde **corrigée** d'une garde **éteinte** : le pronom nu doit continuer d'échouer, et il échoue.

**Ce qui n'a pas été fait** : `oracle-synthese` S21 du pilot n'est pas touché — le lot le réserve au run du pilot, et aucune écriture n'a eu lieu hors de ce dépôt.

## Ce qui a été fait — TF-0804, la 404 par langue à la surface implicite

**L'élément entre dans la liste close** de `skills\enumere-la-surface\references\typologie-surface.md`, avec une particularité qu'aucun autre candidat ne portait : une **condition d'applicabilité**. Il est proposé **si et seulement si** le produit a une surface web, et les trois exclusions de P-2 sont recopiées avec lui (application sans surface web ; routeur qui possède déjà sa page d'erreur par langue ; réponses d'API, qui répondent 404 en JSON et jamais en page).

**Les cinq critères d'acceptation candidats** sont les cinq exigences de P-2, écrites pour être recopiées telles quelles dans l'exigence dès que le candidat est retenu : gabarit commun par langue (menu, charte, consentement, liens de secours) · statut 404 **conservé** · `noindex` et exclusion **déclarée** du sitemap · langue au préfixe du chemin · un contrôle exécutable qui joue les cas. Le cinquième s'**écrit** ici et s'**exécute** ailleurs : la conception pose le critère, `digit-ai-forge-tests` construit le contrôle, la MEP le joue (M-9).

**La proposition devient mécanique, pas seulement écrite.** `oracle-surface` gagne la règle **S4** : dès qu'un `point-entree` au libellé web est énuméré sans 404, l'avertissement est **nommé**. S4 **n'échoue jamais**, et c'est un choix motivé, pas une timidité — `EXIGENCES.json` n'offre aucun champ où déclarer l'**écart explicite** d'un candidat d'office (cet écart vit en prose, `SURFACE.md` §3), et le lot excluait toute modification de ce format. Un FAIL refuserait donc un référentiel dont l'écart est légitime. Le verdict est l'avertissement nommé non bloquant du contrat (`SANS_OBJET`), même idiome que RC-1 sur S1. Ce trou est remonté ci-dessous (RC-2) plutôt que comblé unilatéralement.

**La preuve, double sens plus témoin.** Branche `TF-0804` du self-test, fixtures éphémères, **trois cas comptés, trois tenus** :

| Fixture | Attendu | Obtenu |
|---|---|---|
| surface web **+ 404** énumérée | PASS, la 404 nommée par son identifiant | **PASS** |
| surface web **sans** 404 | avertissement nommé, exit 0 conservé | **SANS_OBJET**, exit 0 |
| **aucune** surface web (import de nuit) | PASS motivé, la 404 n'est pas due | **PASS** |

Le deuxième cas est le témoin : sans lui, S4 serait un contrôle neuf, vert, joué par personne — le défaut que cette forge a déjà nommé une fois (R-11 bis).

**Ce qui n'a pas été fait, le lot l'excluant** : aucun changement du format d'`EXIGENCES.json` ni des vues dérivées ; aucun contrôle exécutable de la 404 servie (il relève de forge-tests et de la MEP) ; aucune rétro-application aux référentiels déjà scellés.

## pilot (`digit-ai-factory`)

Deux constats nés de l'instruction, qui portent tous deux sur le socle et non sur cette forge : le premier sur la **forme exacte** de la frontière que le lot prescrit — le pilot doit appliquer la même correction à `oracle-synthese` S21 —, le second sur le **gate d'écriture** qui a jugé ce run.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-1 | majeur | générique | La frontière **prescrite par le lot**, `(?<![\p{L}])` / `(?![\p{L}])`, corrige l'accent mais **élargit** la garde : les chiffres et le `_` cessent d'être des caractères de mot. Mesuré sur la garde des pronoms d'E8, cinq cas : la forme prescrite tient **3 cas sur 5** — elle attrape « le champ **elle2** du formulaire » et « la colonne **elle_id** » comme des pronoms, ce que `\b` refusait justement ; la généralisation exacte de `\b`, `[\p{L}\p{N}_]`, tient **5 sur 5**. Même mesure sur une unité : « un délai de 10 **j2** » devient « 10 jours » avec la forme prescrite, et ne l'est ni avant ni avec la forme retenue. | Écrire la frontière `(?<![\p{L}\p{N}_])` / `(?![\p{L}\p{N}_])` dans `oracle-synthese` S21 et partout où TF-0799 descendra : c'est la seule forme dont le verdict est **identique à `\b`** sur du texte sans accent. Publier la paire comme constante partagée plutôt que la réécrire par oracle — ici, `oracles\_contrat.mjs` la porte pour les onze oracles de la forge. |
| RC-3 | mineur | générique | Le gate d'écriture C7 (`qo-gate-write.mjs`) a **bloqué deux passes** sur `typologie-surface.md` en imputant à mon édition deux constats **M7** qui existaient à l'identique dans la version précédente du même fichier — preuve : `check_markdown.py` joué sur `git show 90d3767:…\typologie-surface.md` rend les deux mêmes M7 (lignes 6 et 92) **avant** toute édition de ma part, et le message du gate les a nommés comme imputés tout en déclarant « + 1 constat PRÉEXISTANT ». Coût mesuré : deux passes consommées sur trois, et une correction de **cinq** défauts de forme préexistants dans deux fichiers **hors du périmètre du lot** pour pouvoir écrire deux lignes de tableau. | Vérifier le partage neufs/préexistants du gate sur le cas « plusieurs constats du **même domaine** joints sur une ligne » : c'est le seul écart entre le comportement observé et ce que le module documente (masquage des nombres, donc insensibilité aux numéros de ligne). Si le partage est juste et que c'est la **collecte** de l'état antérieur qui manque, le dire dans le message — « aucun état antérieur, tout est imputé » se corrige, « imputé à tort » se contourne. |

**Portée** : les deux sont *génériques* — RC-1 porte sur la forme d'un correctif que le pilot va appliquer chez lui, RC-3 sur un hook que tous les dépôts subissent.

## digit-ai-forge-conception (`digit-ai-forge-conception`) — auto-retour

Un constat sur cette forge elle-même, découvert en câblant S4, et que le lot interdisait de corriger dans ce run : il appelle une décision, pas un correctif silencieux.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RC-2 | majeur | générique | La loi transverse n° 3 dit qu'un candidat de la surface implicite est retenu **ou écarté explicitement**, jamais absent par omission. Or `EXIGENCES.json` n'offre **aucun champ** où porter cet écart : il ne vit qu'en prose, en section 3 de `SURFACE.md`, qu'aucun oracle ne lit. Mesure : S4 a dû être conçue comme un avertissement non bloquant (`SANS_OBJET`) pour cette seule raison — un référentiel qui écarte légitimement la 404 (routeur possédant sa page d'erreur, API JSON) serait sinon refusé sans moyen de se justifier. La conséquence dépasse la 404 : **aucun** des onze candidats d'office n'est jugeable mécaniquement aujourd'hui. | Un champ optionnel du référentiel — par exemple `surface_implicite: { candidat, verdict: retenu\|ecarte, raison }` — rendrait l'écart **déclarable**, donc l'omission distinguable d'un arbitrage, et permettrait à S4 de refuser au lieu d'avertir. C'est une évolution du format d'`EXIGENCES.json` : elle appartient à une décision humaine, pas à un run d'instruction, et le lot du 05/09 l'excluait explicitement. |

## Remarques restées au produit

Une seule remarque est restée chez la forge. Elle porte sur la dette de forme d'un document de ce dépôt, et le tableau dit pourquoi elle n'a pas de valeur ailleurs.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| `oracles\registre-entrees.md`, dont ce run a mis à jour l'entrée `oracle-surface` (v1.1.0, S4), porte **huit** constats M7 préexistants de l'oracle de lisibilité Markdown : ses huit fiches d'oracle ouvrent par un tableau, sans phrase disant ce que le lecteur va y apprendre. | **Non corrigée.** Réécrire huit ouvertures de chapitre dans un document que le lot ne visait pas aurait noyé le correctif demandé sous une réfection éditoriale ; la mise à jour s'est limitée aux trois cellules factuelles (version, règles, `non_juge`). Les deux constats M7 du `README.md`, eux, ont été corrigés : le fichier était touché par ce run et c'est la porte d'entrée de la forge. | non | Une dette de forme propre à un document de cette forge, antérieure au lot et sans classe transposable : le format « fiche = un tableau » est local à ce fichier. Ce qui **est** généralisable dans l'épisode — le gate qui impute des constats préexistants à l'édition en cours — est remonté ci-dessus en RC-3, avec sa mesure. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : les livrables de ce run sont du code (deux oracles, le contrat partagé, le self-test) et deux documents de méthode propres à la forge (le skill `enumere-la-surface` et sa référence de typologie), dont aucun ne dérive d'un gabarit de `gabarits\documents\`. Le présent lot de retours suit, lui, `gabarits\RETOURS-FORGES.md` — et il est jugé par `oracle-lot-retours.mjs`, ce qui est le contrôle prévu.

## Confirmations positives

- **Le lot de travaux du pilot est directement instruisible.** Chaque travail portait son fait mesuré, son moyen de vérification et ce que le pilot ne demandait **pas** — les trois sections « Ce que le pilot a déjà fait », « Ce que le pilot NE demande PAS » et « Comment vous saurez que c'est fait » ont servi telles quelles de critère de fin, sans aucun aller-retour. Aucune interprétation n'a été nécessaire sur le périmètre.
- **Le patron P-2 est recopiable sans perte.** Ses cinq exigences et ses trois exclusions sont entrées dans la liste close du skill **mot pour mot** ; l'exclusion écrite (« ce qu'il exclut ») est ce qui a permis d'écrire la condition d'applicabilité de S4 sans l'inventer.
- **L'idiome « avertissement nommé, jamais fondu dans un ratio » tient une seconde fois.** RC-1 l'avait introduit sur S1 ; S4 s'y est branchée sans qu'une seule ligne du contrat commun ne bouge — le statut `SANS_OBJET` était déjà exactement ce qu'il fallait.
- **La fixture éphémère dérivée de la fixture verte est un banc réutilisable.** Introduite pour TF-0114 (CRLF/LF), elle a servi ici deux fois sans adaptation : une seule exigence change, le reste du référentiel est celui qui passe déjà, et la mesure est isolée sans nouveau dossier de fixtures à maintenir.

## Ordre recommandé

1. **RC-1 d'abord**, et avant d'appliquer TF-0799 à `oracle-synthese` : la correction est déjà décidée chez le pilot, et la forme prescrite y introduirait deux faux positifs mesurés. Le coût de l'écart est nul aujourd'hui, non nul dès que S21 sera corrigée.
2. **RC-2 ensuite**, parce qu'elle conditionne la valeur des onze candidats d'office : tant que l'écart n'est pas déclarable, la loi n° 3 ne peut être qu'avertie, jamais opposée. C'est une décision de format, pas un correctif.
3. **RC-3 en dernier** : le gate n'a bloqué aucun livrable, il a coûté des passes et un élargissement de périmètre. Gain réel mais moindre, et le diagnostic reste à confirmer côté pilot.

## La règle qui aurait évité le retour (TF-0779)

Aucun des trois retours ne suit un retour humain : les trois sont nés d'oracles joués et de mesures faites pendant l'instruction. La colonne « Proposition esquissée » nomme néanmoins, pour chacun, la règle ou le mécanisme visé.

- **RC-1** — la règle existe déjà et c'est elle qui a évité le défaut ici : *ne change que les motifs où une frontière ASCII produit le défaut mesuré, n'élargis pas sans mesure*. Elle figurait dans le mandat de ce run, pas dans le lot de travaux ni dans le patron : c'est là qu'elle manque. Classe déclarée : `garde-lexicale-frontiere-ascii`.
- **RC-2** — aucune règle du socle ne couvre le cas « une loi transverse dont l'écart explicite n'a nulle part où s'écrire ». Le contrôle S4 nouvellement câblé rend le trou visible mais ne le comble pas. Classe déclarée : `surface-implicite-non-livree`.
- **RC-3** — la classe existe déjà (`gate-ecriture-juge-fichier-entier`) et elle décrit exactement l'épisode ; s'il s'agit d'une récidive, c'est le pilot qui la marquera à l'ingestion, et l'information vaut d'être comptée.
