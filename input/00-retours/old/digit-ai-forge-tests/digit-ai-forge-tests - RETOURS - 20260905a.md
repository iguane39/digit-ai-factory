# Retours forges — digit-ai-forge-tests — 20260905a

- **Contexte** : instruction de la candidature **TF-0803** reçue par le lot `digit-ai-factory - RETOURS - 20260905a` (RT-1, classe `surface-implicite-non-livree`), sur mandat humain du 05/09/2026. La recette générique demandée est **écrite, jouée et prouvée dans les deux sens** ; ce lot rend compte et remonte deux constats **nouveaux**, découverts en l'écrivant, qui portent tous deux sur le pilot.
- **Références ledger** : ce dépôt ne tient pas de `forge\ledger.jsonl` — la référence opposable est le **commit local `23c7622`** de `digit-ai-forge-tests` (aucun `push`), et la sortie de `uv run pytest` (**1257 → 1286 cas**, 0 échec).
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `input\00-retours\` du pilot ; l'original reste chez la forge. Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-05

## Contrôle de complétude

Le lot reçu portait **une seule** candidature (RT-1 / TF-0803). Elle est instruite **en entier** : les trois cas de M-9 sont joués, le refus exigé (200 sur une adresse inconnue) est prononcé et éprouvé. Ce lot-ci remonte **deux** constats, tous deux nouveaux et tous deux nés de l'écriture de la recette ; aucun autre constat n'est resté en attente.

## Ce qui a été fait — TF-0803 instruite

**Le livrable** : `recette/quatre_cent_quatre.py`, recette **générique** paramétrée par exactement deux valeurs — la **liste des préfixes de langue** et l'**URL de préproduction**. Tout le reste est optionnel et déclaré : `--langue-par-defaut` (la racine sans préfixe, exigence 4 de P-2), `--marqueur-menu` (site sans `<nav>`), `--page-404` (page d'erreur à chercher au sitemap), `--sortie` (la pièce jointe au dossier de MEP). L'adresse sondée est **fixe** (`sonde-404-forge-tests`) : une preuve de MEP se rejoue à l'identique.

**La commande exacte qu'un produit joue pour prouver M-9** :

```bash
uv run python recette/quatre_cent_quatre.py https://preprod.exemple --prefixes fr,en,nl \
    --langue-par-defaut fr --sitemap /sitemap.xml --sortie preuve-m9.json
```

`preuve-m9.json` est la pièce que le dossier de MEP joint à M-9 : elle nomme le contrôle qu'elle sert (`"controle": "M-9 …"`), la candidature dont elle est issue, l'URL et les préfixes mesurés, l'horodatage, **chaque cas avec son URL, son code HTTP, son verdict et son motif**, et le champ `non_mesure` qui publie les limites de la mesure. Le **code de sortie** est le verdict : `0` tenu · `1` défaut mesuré · `2` je ne peux pas mesurer.

**Les trois cas de M-9, joués** : (a) adresse inconnue sous chaque préfixe → statut **404**, page HTML, `<html lang>` égal au préfixe, et **menu complet** — comparé aux liens de `<nav>` de la page de référence du préfixe, pas à une supposition ; (b) la page 404 porte `noindex` (meta robots **ou** en-tête `X-Robots-Tag`) et le sitemap ne liste **aucune** adresse sondée ni page 404 déclarée ; (c) `.png` et `.js` inconnus rendent un **404 nu**, jamais une page HTML.

**Le double sens, prouvé** (contrat TF-0679) : `tests/test_tf_0803_404_par_langue.py`, **29 cas**. Le jugement est une **fonction pure** éprouvée sans réseau ni environnement ; le sondage est éprouvé **bout en bout** contre **sept serveurs HTTP locaux** montés sur port libre — un conforme, et six qui portent chacun **un** refus : 200 sur une adresse inconnue (**le refus que la candidature exigeait nommément**), 404 nu du serveur de fichiers (le fait fondateur rejoué), page HTML servie à la place d'un 404 nu, `noindex` absent, 404 unique servie en français sous `/en/`, sitemap listant l'adresse sondée, et **réponse pendue**. Aucun site réel, aucune API, aucun appel sortant : `127.0.0.1` et rien d'autre.

**Le piège mesuré est câblé, pas raconté** : une réponse pendue (code 000) sort en échec avec un motif qui **nomme** la cause — envelopper `writeHead` sans envelopper `write()` fait partir le corps nu du serveur avant les en-têtes différés. Sans ce motif, un code 000 se lit comme un incident réseau et la cause se cherche dans l'infrastructure au lieu du code. Un serveur de fixture le déclenche pour de vrai (réponse différée au-delà du délai), et le test vérifie que le verdict est **FAIL** et non « non mesurable » : c'est un défaut, pas une absence de mesure.

**Une mesure partielle n'est jamais un PASS** : un seul cas `NON_MESURABLE` fait basculer le verdict global en code 2. Deux situations y mènent et sont **déclarées** dans la sortie plutôt que supposées — un sitemap injoignable (une absence non lue n'est pas une absence prouvée) et une page de référence sans `<nav>` ni marqueur déclaré (le « même gabarit » n'a alors pas de référence).

**Preuve d'exécution** : `uv run pytest` **1257 → 1286** cas, 0 échec ; `uv run ruff check .` **0 constat** ; sections `unitaire`, `lint` et `dette` de `recette/verifier_corpus.py` **OK** (le registre de dette reste synchronisé). Les 29 cas nouveaux sont joués par la section `unitaire` de la recette officielle, donc **sous S-01**. Commit local `23c7622` (3 fichiers : la recette, ses tests, le README — catalogue de services et section dédiée). **Aucun `push`.**

**Ce qui n'a pas été fait, et pourquoi** : (1) la recette n'entre pas dans `recette/verifier_corpus.py` comme quatorzième section de S-01 — elle exige une **instance servie d'un produit**, que le dépôt de la forge n'a pas ; son double sens est prouvé par ses tests, eux jugés sous S-01. (2) La **déclaration** de l'exclusion du sitemap dans l'oracle SEO du produit (M-9 (b), seconde moitié) n'est pas mesurée : elle vit dans le dépôt du produit, pas dans une réponse HTTP — la recette le publie dans son champ `non_mesure`. (3) Le lot reçu reste dans `input\00-retours\` de la forge, **non suivi par git** et non déplacé en `old\` : `input\` est hors du périmètre d'audit de la forge (TF-0536) et aucune convention de ce dépôt ne prescrit de suivre les lots ingérés. Sa ligne de statut est passée à `traite le 2026-09-05`, seule édition faite.

## pilot (`digit-ai-factory`)

Écrire la recette générique a fait apparaître deux écarts entre le patron **P-2** et son lieu de jugement **M-9** — aucun des deux n'était visible tant que le contrôle restait à écrire chez chaque produit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-1 | majeur | générique | `ETAPE-MEP.md` ligne M-9 fonde la preuve sur « la sortie du **contrôle exécutable du produit** jouant ces trois cas ». La formulation *prescrit* que chaque produit écrive le sien : c'est exactement le coût que TF-0803 vient de solder (14 pages et 5 contrôles d'oracle sur un seul produit, pour un standard qui vaut partout). Le contrôle générique existe depuis le commit `23c7622` de `digit-ai-forge-tests` (`recette/quatre_cent_quatre.py`, 29 cas de banc, double sens prouvé) et **rien dans M-9 ne le nomme** : un produit qui lit M-9 aujourd'hui repart écrire le sien. | M-9 nomme la recette du socle comme source de preuve recevable (`recette/quatre_cent_quatre.py` de `digit-ai-forge-tests`, sortie JSON + code de sortie), et ne renvoie au contrôle maison que par écart déclaré. Même geste côté P-2, exigence 5 (« un contrôle exécutable qui joue les cas ») : dire **lequel**. |
| RT-2 | mineur | générique | P-2 exigence 4 demande deux choses : « la langue choisie au préfixe du chemin (`/fr/inconnu` → 404 en français ; **sans préfixe → langue par défaut**) ». M-9 (a) n'en juge qu'une : « une adresse inconnue **sous chaque préfixe de langue** ». La racine — l'adresse la plus visitée d'un site — sort donc du jugement. Mesure : la recette a dû câbler ce cas sous une **option** (`--langue-par-defaut`), parce qu'un produit qui joue strictement M-9 ne le demande pas ; le test `test_bout_en_bout_un_serveur_conforme_rend_le_code_0` le joue avec, et le cas passe en `prefixe: ""` dans la sortie. | M-9 (a) ajoute la racine sans préfixe, avec la langue par défaut déclarée par le produit — sinon l'exigence 4 de P-2 n'a de lieu de jugement que pour sa moitié préfixée. |

**Portée** : les deux sont *génériques* — ils portent sur le texte du socle (M-9, P-2), pas sur un produit.

## Remarques restées au produit

Un seul constat est resté chez la forge, et le tableau ci-dessous dit lequel, comment il a été traité sur place, et pourquoi il ne remonte pas : il porte sur un mécanisme que ce dépôt est le seul de l'écosystème à posséder.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le registre de dette de la forge (`registre-dette.json`) ne collecte les `NON_JUGE` que des modules de `forge_tests\` ; une limite de mesure déclarée par une recette de `recette\` n'entre à **aucun** registre. Les deux limites de `quatre_cent_quatre.py` (la déclaration de l'exclusion du sitemap ; le « même gabarit » sans page de référence) vivent donc dans le champ `non_mesure` de sa sortie et dans le README, invisibles à `python -m forge_tests.dette --verifier`. | Non corrigée : les deux limites sont **publiées à chaque exécution** dans la sortie JSON (champ `non_mesure`) et documentées au README, plutôt que laissées en prose de code. | non | Le registre de dette est un mécanisme propre à `digit-ai-forge-tests` (regénéré depuis ses propres modules) ; aucun autre dépôt de l'écosystème n'en porte l'équivalent. Rien de généralisable au socle : la classe reste chez la forge, qui l'instruira dans un run à elle. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la recette et ses tests sont du code, et le seul document touché — le `README.md` de la forge — n'est pas dérivé d'un gabarit de `gabarits\documents\`.

## Confirmations positives

- **Le contrat des recettes double sens (TF-0679) a tenu, et il a produit sa valeur ici** : c'est en cherchant le serveur qui déclenche chaque refus que le cas « réponse pendue » est devenu un **FAIL** explicite plutôt qu'un silence, et que le piège de la réalisation de référence (`writeHead` sans `write()`) est passé du texte du patron au **motif d'un verdict machine**. Six serveurs de fixture, six refus prononcés : aucun contrôle de ce lot n'est resté sans chemin d'échec (règle CI5).
- **Le patron P-2 est exploitable tel qu'il est écrit** : ses cinq exigences se traduisent en mesures sans arbitrage — statut, langue au préfixe, gabarit commun, `noindex`, 404 nu. La section « Ce qu'il exclut » a évité deux fausses pistes (les réponses d'API en JSON, les applications sans surface web) : la recette ne les sonde pas et ne les accuse pas.
- **La classe `surface-implicite-non-livree` a désigné juste** : le défaut n'était pas la 404 d'un produit, c'était l'absence d'un contrôle générique. La recette est le remède de la classe, pas du cas.

## Ordre recommandé

1. **RT-1 d'abord**, et seul si un seul geste est possible : tant que M-9 dit « le contrôle exécutable du produit », le contrôle générique existe sans être trouvé, et chaque MEP repaie les 14 pages. Une ligne de `ETAPE-MEP.md` et une ligne de l'exigence 5 de P-2 suffisent ; gain immédiat, effort d'une phrase.
2. **RT-2 ensuite** : il ajoute un cas à un contrôle qui existera alors, et son remède (la racine sans préfixe) est déjà **câblé et testé** côté forge — il ne reste qu'à le rendre obligatoire dans le texte de M-9.

## La règle qui aurait évité le retour

Les deux retours de ce lot suivent une **écriture d'outil**, pas un retour humain — ils sont nés de la traduction d'un patron en mesures. La règle qui les aurait évités existe pourtant : la classe **`oracle-remplace-par-controle-maison`** (`todo\CLASSES.json`) — *un producteur écrit son propre contrôle de conformité faute d'avoir trouvé l'oracle du socle*. RT-1 en est le cas exact, au niveau du texte qui prescrit : un contrôle du socle qui n'est nommé nulle part où il se joue **est** un contrôle introuvable, et la loi transverse n° 1 le dit déjà — *toute affordance est câblée ou n'existe pas*. Un standard d'office qui nomme son lieu de jugement (M-9) sans nommer l'outil du jugement laisse le geste à réinventer.

Pour RT-2, la classe est **`surface-implicite-non-livree`** : la 404 de la racine sans préfixe est un état de la surface implicite qu'aucune demande de fonctionnalité ne fait émerger — et que M-9, en ne parlant que des préfixes, ne fait pas juger non plus. La règle générale qu'elle appelle : **quand un patron énumère N exigences et qu'un contrôle en juge N-1, l'écart se déclare** ; ici il ne l'était pas, et seule l'écriture de l'outil l'a rendu visible.
