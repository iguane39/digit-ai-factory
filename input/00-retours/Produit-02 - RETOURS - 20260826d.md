# Retours forges — Produit-02.com — 20260826d

- **Contexte** : application du plan de l'audit des traductions (`output\Produit-02 - Audit traductions SEO-GEO - 20260826a.md`), poussée sur `main`, déployée. Les
  trois retours de ce lot sont nés **après la remise** : deux d'une relecture demandée par
  l'exploitant sur un risque que le run avait lui-même signalé sans le traiter, le troisième
  d'une question de l'exploitant — « logiquement, si on pousse, ça doit déployer, non ? » —
  à laquelle la session avait répondu faux.
- **Références ledger** : `runs\20260823-retrait-domaine-bretagne\ledger.jsonl` seq 64, 65,
  66 (entrées `type: retour`) — le ledger de ce projet vit sous `runs\<run-id>\`, divergence
  déjà remontée en **RT-6**.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-08-26

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce que la remise a révélé, et que la remise elle-même n'a pas vu

Ce chapitre dit d'où viennent les retours, parce que leur origine est le sujet.

Le run a substitué le terme d'hébergement dans trois langues : `Ferienhaus` en allemand,
`casa rural` en espagnol, `casa de férias` en portugais. En espagnol et en portugais, la
substitution **change le genre grammatical** — masculin vers féminin — donc chaque article,
adjectif et participe qui s'y rapporte doit suivre. La session a traité les accords, relancé
les six contrôleurs, obtenu six verts, et livré.

Elle a aussi écrit, dans sa restitution : *« La relecture native n'a pas eu lieu. »* Puis
elle a poussé, et la production a été mise à jour.

L'exploitant a demandé la relecture. Elle a trouvé **onze fautes d'accord**, toutes en
production, toutes derrière une CI verte. Le premier retour porte sur ce que les oracles ne
peuvent pas voir ; le second sur le fait que le run l'avait vu et a livré quand même.

## `digit-ai-factory`

Trois retours. Les deux premiers forment une paire : un trou d'outillage, et la règle de
méthode qui aurait dû le compenser et qui manque aussi.

Comment lire le tableau : une ligne par retour, `id` continuant la séquence du produit
(dernier employé : RT-50). La colonne `Retour` porte le fait et sa mesure ; la colonne
`Proposition` est une piste, jamais une obligation.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-51 | bloquant | générique | **Aucun oracle ne peut juger une substitution de terme qui change le genre grammatical.** Mesure : 11 fautes d'accord (5 en espagnol, 5 en portugais, 1 calque) sont parties **en production**, derrière une CI verte et six contrôleurs au vert. Exemples relevés à la relecture : « confortables y **prácticos** » pour un nom devenu féminin, « casas rurales … están especialmente **adaptados** », « **Ningún** casa rural disponible », « 1 **otro** casa rural … ya está **reservado** », et leurs équivalents portugais. Le mécanisme est net : les accords **adjacents** au nom ont été traités par la passe de substitution, ceux qui en sont **séparés de plusieurs mots** ont survécu. Ce que les contrôleurs existants savent faire : `check-i18n` compare des arborescences de clés, `check-glossaire` cherche la présence d'un terme, `check-traductions` mesure l'écart au français, `check-seo` compte des caractères. **Aucun ne lit une phrase.** Une langue peut être structurellement conforme, terminologiquement exacte, dimensionnée pour la SERP — et fautive. | Le trou n'est pas « il manque un correcteur grammatical », il est plus étroit et plus traitable : **une substitution de terme qui change le genre est une classe d'opération connue, et elle est détectable**. Le glossaire sait déjà que `gîte` (m.) devient `casa rural` (f.) — le genre pourrait être un champ de l'entrée. Un contrôle pourrait alors signaler, dans toute chaîne portant le terme retenu, les adjectifs et participes restés au genre d'origine. Il ne remplacerait pas une relecture humaine ; il attraperait la classe qui est passée ici. À défaut, une règle de run : **une substitution qui change le genre exige une relecture déclarée avant remise**, et l'absence de relecture bloque la remise au lieu de la commenter. |
| RT-52 | bloquant | générique | **Un run qui identifie lui-même un risque non couvert le DÉCLARE et passe la main.** Mesure sur ce run : la restitution portait, en clair, *« La relecture native n'a pas eu lieu. […] Environ 180 chaînes de corps de texte sont concernées, sur des pages publiques. C'est le seul endroit du lot où le risque n'est pas couvert par un oracle. »* Le run a ensuite poussé, déployé, et attendu. Les onze fautes ont été trouvées **une demande de l'exploitant plus tard** — la demande étant, mot pour mot, de faire ce que le run avait dit ne pas avoir fait. Le défaut n'est pas d'avoir manqué le risque : il a été vu, nommé, chiffré et écrit. Le défaut est d'avoir traité **la déclaration du risque comme son traitement**. C'est la même faute de forme que R-45 corrige pour les remarques écartées — une remarque sans verdict est invisible — mais appliquée ici à un risque assumé : un risque déclaré sans traitement ni décision est un risque **transféré à l'humain sans qu'il l'ait accepté**. | Une règle de clôture symétrique de R-45 : **un risque que le run identifie et qu'aucun oracle ne couvre doit être fermé avant remise** — traité (relecture faite, corrections appliquées, remontée émise), ou explicitement **refusé par l'humain**, ce refus étant consigné. « Signalé dans la restitution » ne serait plus une fermeture valide. La forme est déjà connue de l'écosystème : c'est le carnet des écarts assumés (**RT-46**), étendu du périmètre d'un lot de travaux à celui d'un risque de run. Corollaire outillable : si un run écrit « n'a pas eu lieu », « reste à faire » ou « non vérifié » à propos de son propre livrable, un contrôle de remise peut le lire et refuser la clôture. |
| RT-53 | majeur | générique | **La route de déploiement prescrite par le gabarit contredit le mécanisme réel, et son dossier de référence n'existe pas.** Le `CLAUDE.md` de ce produit — issu du gabarit — prescrit : « Déployer : étape MEP du pilot : staging → qualif populée → **GO humain** (`forge\DOSSIER-MEP.md`) », et interdit « mise en prod à la main ». Deux faits mesurés contre ce texte : (1) `forge\DOSSIER-MEP.md` **n'existe pas** dans le dépôt — même classe que RT-46, une règle qui désigne un fichier absent ; (2) le mécanisme réel est un **déploiement automatique sur poussée** — `.github\workflows\deploiement.yml` documente que « Railway est abonné au dépôt (branche `main`) et déploie de son côté » en « Wait for CI ». Il n'y a ni staging, ni qualif, ni GO distinct : **le GO humain, c'est la poussée**. Conséquence mesurée : la session a annoncé à l'exploitant « le déploiement reste à faire » alors que la chaîne était déjà passée et la production à jour — vérifié après coup, 136 anciennes URL redirigeant en 301 et les nouvelles répondant 200. L'exploitant a dû corriger la session : « logiquement, si on pousse, ça doit déployer, non ? » | Le gabarit décrit **une** route de MEP et la présente comme la route. Un produit en déploiement continu en a une autre, non moins disciplinée : CI bloquante, abonnement en « Wait for CI », vérification de production en aval. Le tableau de routage gagnerait une **variante déclarée par le produit** — `mep: continu` contre `mep: par-paliers` — de sorte que « pousser » porte sans ambiguïté sa conséquence. Et le dossier cité doit exister ou ne pas être cité : une route qui renvoie à un fichier absent se lit comme une route qui existe ailleurs, ce qui est pire qu'une route manquante. |

## Ce que ces retours ne couvrent pas

Ce chapitre existe pour que le lot ne laisse pas croire le sujet clos.

Ce lot ne dit rien de la **qualité générale** des sept langues du site : la relecture a porté
sur les chaînes **modifiées par ce run** dans les trois langues substituées, soit environ 180
chaînes, pas sur le corpus. Les quatre langues non touchées — français, anglais, italien,
néerlandais — n'ont pas été relues à cette occasion.

Il ne dit rien non plus de la **qualité de la relecture elle-même**, qui a été faite par la
session et non par un locuteur natif. Onze fautes ont été trouvées ; rien ne garantit
qu'il n'en reste pas. C'est précisément l'argument de RT-51 : le besoin de relecture native
subsiste, le retour porte sur l'absence de tout filet **avant** elle.

## Remarques restées au produit

Ce que le produit a constaté et n'a pas remonté, chacune avec son verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Onze fautes d'accord en espagnol et en portugais, parties en production | Corrigées à la relecture, site régénéré, six contrôleurs au vert | **Généralisable → REMONTÉ en RT-51.** | La faute est propre au produit ; la classe — substitution changeant le genre, sans filet — ne l'est pas. |
| `home.pRegion` emploie un synonyme du terme retenu dans les trois langues substituées : « Ferienunterkünfte », « alojamientos vacacionales », « alojamentos de férias » | **Non corrigée** | non | **Rien de généralisable, et volontairement non corrigé.** La variation existe dans la source française (« nos hébergements ») : c'est un choix d'écriture, pas une dérive. Le glossaire n'écarte que `alojamiento` **nu**, dont les complétions sont du logement social. Signalé pour qu'un prochain audit sache que c'est vu. |
| Le calque portugais « casas de férias-refúgio », hérité de « gîtes-refuge » | Remplacé par « Os nossos refúgios para casais » | non | **Rien de généralisable** — défaut de traduction propre au produit. |
| L'e-mail de contact reste sur `Produit-02.fr` alors que le domaine canonique est en `.com` | Non corrigée — **choix de l'exploitant**, consigné dans `docs\projet\PARAMETRAGE.md` | non | **Rien de généralisable** — décision d'exploitation. Consignée plutôt que tue, pour qu'un prochain audit ne la reprenne pas comme un oubli. |
| Les oracles `check-links`, `check-seo` et `check-llms` ont dû être portés sur le contrat d'URL propre | Portés dans le même lot que le changement | non | **Généralisable → déjà REMONTÉ en RT-49** (lot `20260826c`) : c'est la même cause, des oracles qui encodaient l'ancien contrat. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.** Les deux
livrables de ce run — le rapport d'audit et son sidecar de plan — ont été structurés d'après
le prompt de l'exploitant, non d'après un gabarit de `gabarits\documents\` : ils ne portent
aucun identifiant `gd-…`. La section est déclarée vide, elle n'est pas omise.

Une observation tombe hors du périmètre de R-46 et est consignée ici faute de canal plus
juste. Le gabarit `RETOURS-FORGES.md` demande, à juste titre, de jouer `oracle-lot.mjs`
avant remise. Il ne dit rien du cas où **un lot déjà remis doit être corrigé** : ce lot-ci
porte, en RT-51 et RT-52, des faits qui affinent RT-47 du lot `20260826c`, remis quelques
heures plus tôt. La règle « un fichier remis ne se modifie jamais » est claire et bonne ; ce
qui manque est la **forme de la correction** — ici, une entrée `type: correction` au ledger
puis un renvoi dans le lot suivant, forme inventée sur place faute de convention écrite.

## Confirmations positives

- **La chaîne de déploiement a tenu, et elle est lisible.** `deploiement.yml` et
  `verification-production.yml` documentent chacun *pourquoi* ils sont séparés — Railway
  attend la CI, une vérification de production dans la même suite attendrait un déploiement
  qui l'attend. Le raisonnement est écrit, daté, et rattaché à l'incident du 15/08 où « une
  poussée réussie n'a rien déployé ». C'est ce qui a permis de trancher la question de
  l'exploitant en une lecture.
- **La règle « jamais de déploiement sans CI » a été mesurée avant d'être posée.** Le
  commentaire du workflow cite le commit `1465170` et le run absent qui l'a motivée. Une
  règle qui porte sa mesure se relit sans la rejouer.
- **`check-redirects.mjs` a payé au premier usage réel.** Joué contre la production après
  déploiement, il a confirmé 136 anciennes URL redirigeant en 301 vers une page 200 — dont
  les 112 ajoutées par ce run. L'oracle existait, il lui manquait seulement le jeu d'URL
  entrant, ce que **RT-49** dit par ailleurs.

## Ordre recommandé

1. **RT-52** — c'est la règle qui aurait rendu RT-51 inoffensif. Tant qu'un run peut fermer
   sur « signalé dans la restitution », chaque trou d'outillage se paie en production.
2. **RT-51** — le filet manquant lui-même, et le plus outillable des trois : le genre du
   terme est une donnée que le glossaire peut porter.
3. **RT-53** — ne produit pas de défaut mais un contresens de session, et il se répétera sur
   tout produit en déploiement continu tant que le gabarit ne connaîtra qu'une route.
