# Retours forges — un socle qui déclare sa propre vérifiabilité et que rien n'exerce — 20260826a

- **Contexte** : l'exploitant demande, après la remise du lot `20260825f`, s'il reste des
  retours à faire. La revue menée pour répondre a trouvé cinq frictions, dont une qui
  n'avait été vue par aucun des cinq runs précédents : **sept des huit fiches du socle
  documentaire R-20 n'ont jamais été instanciées**, et les deux vues HTML générées à partir
  d'elles ont été produites quand même.
- **Références** : `docs/projet/` du projet, `.github/workflows/deploiement.yml` et
  `verification-production.yml`, `build/ci/oracle-consent.mjs`, `build/check-traductions.mjs`,
  `.gitignore`. Lots précédents : `20260823a` à `20260825f` (RT-1 à RT-39).
- **Remise à la Factory** : ce fichier et son sidecar sont déposés dans `input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Le socle documentaire, mesuré

Ce chapitre donne la mesure avant l'argument, parce que l'argument tient entièrement dans
le fait que le socle porte lui-même de quoi se contrôler.

Chaque fiche de `docs/projet/` ouvre sur un frontmatter qui déclare `sources_de_verite:` et
`verifie_le:`. C'est exactement la machinerie qu'il faut pour qu'un oracle compare une date
à celle de ses sources. Voici ce que ces champs contiennent aujourd'hui, après cinq runs et
une mise en production complète.

| Fiche | `verifie_le` | marqueurs `{…}` restants |
|---|---|---|
| ACCES-TEST.md | `{AAAA-MM-JJ}` | 11 |
| ARCHITECTURE.md | `{AAAA-MM-JJ}` | 29 |
| COMMANDES.md | `{AAAA-MM-JJ}` | 13 |
| COMPOSANTS-OPS.md | `{AAAA-MM-JJ}` | 31 |
| FONCTIONNEL.md | `{AAAA-MM-JJ}` | 10 |
| MODELE-DONNEES.md | `{AAAA-MM-JJ}` | 30 |
| TECHNOS.md | `{AAAA-MM-JJ}` | 13 |
| **PARAMETRAGE.md** | **2026-08-15** | **0** |

Sept fiches sur huit sont le gabarit brut, 137 marqueurs au total. Les deux **vues HTML
générées** par les scripts du pilot ont été produites à partir de ces sources vides et
portent **40** et **43** marqueurs — du HTML soigné, rempli de trous, qu'aucun script n'a
refusé de rendre.

La seule fiche instanciée est **fausse** : `PARAMETRAGE.md:38` déclare « bascule DNS non
effectuée à ce jour », dix jours après que quatre domaines convergent en 301 avec leurs
certificats émis.

## Les cinq retours

Le premier porte sur le socle documentaire, les trois suivants sur des oracles et des
règles sans porteur, le dernier sur la route MEP et l'infrastructure.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RT-40 | **bloquant** | **Le socle déclare sa propre vérifiabilité et rien ne l'exerce.** Mesure ci-dessus : 7 fiches sur 8 encore en gabarit, 137 marqueurs, `verifie_le: {AAAA-MM-JJ}` dans leur propre frontmatter — et deux vues HTML générées à partir de ces sources vides, 40 et 43 marqueurs. La seule fiche instanciée porte une affirmation fausse. Conséquence directe : une session qui ouvre `ARCHITECTURE.md` pour comprendre le projet lit un gabarit, et rien ne l'avertit. Le socle R-20 est aujourd'hui une **fiction plausible**, ce qui est pire qu'une absence — l'absence se voit. | Deux oracles, tous deux triviaux et sans ambiguïté. (1) **Un marqueur `{…}` dans une fiche livrée est un échec mécanique** — aucune interprétation requise. (2) **`verifie_le` confronté à la date des `sources_de_verite` déclarées** : une source modifiée après la date de vérification rend la fiche périmée. Les deux champs existent déjà, la conception est juste ; seul l'exercice manque. Corollaire sur les générateurs : **un script de vue doit REFUSER de rendre une source portant encore des marqueurs**. Produire du HTML fini à partir d'un gabarit vide fabrique de la fausse complétude. |
| RT-41 | majeur | **Un oracle dont l'échec d'environnement est indiscernable d'un défaut.** `oracle-consent` a échoué en local sur `Failed to launch the browser process: Code: 0`, avec un `stderr` **vide**. Cause réelle : 81 processus Edge ouverts empêchaient Puppeteer d'en lancer un de plus. Le même oracle passe au vert en CI. Coût subi : diagnostic pour établir qu'il ne s'agissait pas d'une régression, puis obligation de rapporter le contrôle comme **ni passé ni échoué** — un verdict qu'aucun tableau de bord ne sait lire. | Un oracle distingue « **je ne peux pas mesurer** » de « **la mesure est mauvaise** », par des codes de sortie distincts. Dans le premier cas il **nomme la condition et le remède** (« un navigateur est déjà lancé sur ce profil — fermez-le ou passez `--user-data-dir` »). Un `stderr` vide sur un échec de lancement est un défaut d'oracle, pas une fatalité de l'outil sous-jacent. |
| RT-42 | majeur | **Une règle de socle sans porteur mécanique se viole en silence.** « `Old\` jamais versionné » est une règle du pilot. Le `.gitignore` du projet ne l'a jamais portée : mesure, **29 archives `Old/` étaient suivies** par git, plus un `.pyc`. La règle existait en prose depuis l'ouverture du projet et personne ne l'a enfreinte sciemment — elle n'avait simplement aucun endroit où s'appliquer. | Le gabarit `.gitignore` du projet **embarque les exclusions que le socle édicte**. Règle générale à inscrire : *toute règle de socle exprimable comme un motif de fichier doit être livrée comme un motif de fichier*, jamais comme une phrase. Se rapproche de **RT-20** (« un secret attendu se prépare, il ne se décrit pas en prose ») et de **RT-21** — même mécanisme, objet différent. |
| RT-43 | majeur | **Un contrôle de détection sans exemption déclarée s'apprend à être ignoré.** `check-traductions` signale 38 chaînes ; **16 ne doivent pas être corrigées** — 10 sont le nom propre « Saint-Malo & Cancale », qu'il serait fautif de traduire, et 6 sont des chaînes de paramètres purs (`{chalet} · {j1}`) où il n'y a rien à traduire. **42 % de bruit**, et un bruit qui ne diminuera jamais tout seul. Distinct de **RT-2** et **RT-8**, qui portent sur le périmètre des FICHIERS scannés : ici le fichier est bien en périmètre, le signalement paraît légitime, et la bonne action est « ne jamais corriger ». | Tout oracle de détection porte une **liste d'exemptions déclarée**, chaque entrée avec son **motif** — même discipline que le glossaire de RT-34. Une exemption sans motif n'est pas une exemption, c'est un silence. Et la contrepartie doit être écrite avec la règle : une liste d'exemptions mal tenue masque de vrais défauts, ce qui est précisément pourquoi le motif est obligatoire. |
| RT-44 | majeur | **La route MEP n'a pas de variante « déploiement continu », et l'infrastructure n'a ni description ni revérification.** Deux constats liés. (1) La route du pilot décrit un déploiement **manuel à porte** — staging, qualif populée, GO humain, `DOSSIER-MEP.md`. Ce projet fait du **déploiement continu** : `push main` → contrôles GitHub → Railway abonné en « Wait for CI » → vérification de la production qui se place sur le **commit déclencheur** et attend que l'URL publique serve CETTE version. Le GO humain existe, c'est le `push`. La route fabrique donc une non-conformité permanente pour un projet qui fait **mieux** que ce que la règle exige. (2) Le vrai manque est ailleurs : les 4 domaines, les zones et règles Cloudflare, les enregistrements OVH, les certificats, GA4/GTM et Search Console ont été posés par appels d'API, **sans aucun artefact et sans revérification**. **RT-18** réclamait un oracle vérifiant qu'un nom de domaine *déclaré* répond — or aucun domaine n'est déclaré nulle part dans `docs/projet/`. Le chaînon manquant est la déclaration, pas la sonde. | Une **variante « déploiement continu »** de la route MEP, dont l'artefact est le run CI plutôt qu'un dossier rédigé, et dont la porte humaine est le `push`. Et une **fiche d'infrastructure déclarée** — domaines, zones, redirections, certificats, comptes de mesure — qui devienne la source de vérité que RT-18 pourra confronter au réel. Sous-point à replier ici plutôt qu'en doublon de **RT-32** : une réponse vide de l'API Search Console est **ambiguë** entre « zéro impression » et « propriété vérifiée trop récemment pour avoir collecté ». Tout nœud lisant GSC doit d'abord récupérer la fenêtre de disponibilité de la propriété, faute de quoi il prononcera un négatif qu'il n'a pas mesuré. |

## Ce que ces retours ne couvrent pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos, et parce que c'est la
discipline que les lots précédents réclament aux oracles.

Le contenu des fiches R-20 reste hors de portée d'un script : aucun oracle ne dira si un
`ARCHITECTURE.md` instancié décrit **justement** l'architecture. Ce que RT-40 rend
contrôlable, c'est qu'une fiche a été instanciée et qu'elle n'est pas plus vieille que ses
sources — rien de plus, et c'est déjà tout ce qui manquait ici.

Une question est restée ouverte faute de pouvoir la trancher depuis le projet : le filtre
`paths` du workflow de contrôles ne couvre que `site/**`, `build/ci/**`, `package.json` et
`.github/workflows/**`. Une poussée ne touchant que `build/i18n/` ne déclencherait aucun
contrôle, et le comportement de Railway dans ce cas — déployer quand même, ou attendre un
run qui ne viendra pas — n'a pas été établi. Le constat est signalé comme **question**, pas
comme défaut.

## Remarques restées au produit

> Section ajoutée le **2026-08-26**, après l'arrivée du gabarit `RETOURS-FORGES.md`
> (`TF-0626`) : ce lot avait été rédigé sans lui et ne portait donc ni R-45 ni R-46.
> L'ajout est **purement additif** — aucun retour, aucun chiffre, aucune formulation
> d'origine n'a été touché. Le contenu ci-dessous est reconstitué depuis les commits
> de la fenêtre du lot.

Ce que le produit a corrigé chez lui, avec son verdict de généralisation.

| Corrigé chez le produit | Verdict de généralisation |
|---|---|
| `.gitignore` complété (`__pycache__/`, `Old/`) et 29 archives `Old/` sorties du suivi git. | **Généralisable → REMONTÉ en RT-42** : une règle de socle sans porteur mécanique se viole en silence. |
| Classement à la main des 16 faux positifs de `check-traductions`, faute de mécanisme d'exemption. | **Généralisable → REMONTÉ en RT-43**. Le tri reste manuel chez le produit tant que le mécanisme n'existe pas. |
| Découpage du travail en trois commits (`fix` / `feat` / `chore`) plutôt qu'un seul. | **Rien de généralisable** — la convention Conventional Commits du socle le couvre déjà. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit.** Aucun des gabarits de `gabarits\documents\`
n'a servi sur ce projet : aucun document du dépôt ne porte d'identifiant `gd-…`. La section
est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46, qui vise les livrables issus de
`gabarits\documents\`, et est consignée faute de canal plus juste : **ce lot lui-même a été
produit sans son gabarit de méthode**, `RETOURS-FORGES.md` étant absent du dépôt jusqu'à
`TF-0626` du 26/08/2026. C'est la cause directe de l'ajout rétroactif signalé ci-dessus.

## Confirmations positives

- **Le pipeline de déploiement est un modèle, pas un problème.**
  `verification-production.yml` se place sur le commit qui a déclenché les contrôles et non
  sur la tête de branche, et attend que la production serve **cette** version avant de
  rejouer ses vérifications dans un vrai navigateur. Son en-tête dit pourquoi : le
  15/08/2026, une poussée réussie n'avait rien déployé et la production a servi l'ancienne
  version cinq minutes sans qu'un signal ne le dise. C'est exactement la boucle
  incident → garde-fou que les forges cherchent à produire. RT-44 demande que la route
  reconnaisse ce modèle, pas qu'elle le corrige.
- **La conception du frontmatter R-20 est juste.** `sources_de_verite` et `verifie_le` sont
  précisément les deux champs qu'il faut. RT-40 ne redessine rien : il branche ce qui est
  déjà déclaré.
- **RT-18 avait vu juste, et trop tôt.** Sa sonde n'avait rien à confronter faute de
  déclaration. C'est un cas utile pour la Factory : un retour peut être exact et rester
  inapplicable tant que son amont n'existe pas.

## Ordre recommandé

1. **RT-40** — deux oracles triviaux pour le gain le plus élevé du lot ; sans lui, tout
   socle documentaire produit par la forge reste invérifié.
2. **RT-43** — peu coûteux, et il rend leur crédibilité aux contrôles de détection.
3. **RT-42** — le porteur mécanique des règles de socle, mécanique lui aussi.
4. **RT-41** — l'oracle qui doit savoir dire qu'il ne sait pas.
5. **RT-44** — le plus lourd en conception, et le seul qui touche une route du pilot.
