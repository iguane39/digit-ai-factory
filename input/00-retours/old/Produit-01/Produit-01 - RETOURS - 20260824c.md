# Retours forges — Produit-01 — 20260824c

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : mise en œuvre de la bascule d'authentification sur Produit-01 (PR 3685,
  branche `feat/bascule-entra-lots-1-2-3`). Le produit dépend d'une identité déléguée
  (Microsoft Entra ID) qu'aucun test automatisé ne peut exercer, et le contournement mis en
  place il y a neuf jours a produit un défaut qui n'a été vu qu'au premier passage réel de la
  recette en intégration continue.
- **Références ledger** : `forge\ledger.jsonl` seq 60, 61 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-24

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-24 consommés). Ce lot porte
RG-25 et RG-26.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## La mesure qui porte ce lot

Un produit qui délègue son authentification à un fournisseur d'entreprise — Entra ID, Google
Workspace, Okta — hérite d'une contrainte que rien dans les forges n'anticipe :

> **On ne peut pas tester de bout en bout ce qu'on ne peut pas authentifier**, et on ne peut
> pas authentifier N identités distinctes sans N comptes réels chez le fournisseur.

Or les tests qui comptent le plus sont précisément ceux qui traversent plusieurs identités :
une demande créée par l'un, approuvée par un deuxième, refusée par un troisième, consultée par
un quatrième. Sur Produit-01, ce sont **cinq workflows inter-profils** — le passage de main
séquentiel, le refus qui prime en parallèle, la copie en lecture seule, l'administrateur qui
annule sans jamais décider à la place d'un approbateur.

**Personne n'avait posé le principe, donc chaque produit l'invente.** Produit-01 l'a inventé de
la façon la plus tentante et la plus fausse : en **fabriquant** les sessions — écrire
directement dans le `localStorage` du navigateur une clé calculée à la main, en sautant la
redirection.

### Ce que le contournement a coûté, mesuré

| Fait | Mesure |
|---|---|
| Le contrôle d'audience de la bibliothèque cliente était **sauté** pour les 5 profils | une session désérialisée n'est pas revalidée |
| Un `client_id` faux a survécu | **neuf jours**, du 12/08 au 21/08 |
| Trois fichiers portaient trois valeurs différentes du même identifiant, deux fausses | `.env.development`, `ecrire-env-config.mjs`, `profils.ts` |
| Les 5 workflows ont échoué au **premier** passage réel en CI | run 13894 |
| Ils n'avaient **jamais** été verts en conditions réelles | ni à leur écriture, ni depuis |
| Coût du diagnostic une fois la recette lancée | une demi-journée |

### Et le piège du substitut, qui se referme sur qui l'utilise

En remplaçant la fabrication par une vraie connexion par profil, le premier correctif passait
`tsc`, `eslint`, 137 tests unitaires **et** le harnais de connexion — et cassait quand même les
cinq workflows. Cause : le choix de profil était mémorisé dans `sessionStorage`, que le
`storageState` de Playwright **ne sauvegarde pas**. La règle générale qui en sort :

> **La clé qui permet de relire une session doit vivre au même endroit que la session.**
> Les séparer, c'est recréer la divergence qu'on corrige, sous une forme moins visible.

---

## conception (`digit-ai-forge-conception`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-25 | bloquant | **Aucune doctrine n'exige qu'un produit à identité déléguée porte un interrupteur d'authentification, et son absence rend les tests de bout en bout multi-identités impossibles.** Produit-01 délègue à Entra ID. Aucun test automatisé ne peut s'y authentifier sans comptes réels du locataire, et les tests les plus utiles sont ceux qui traversent plusieurs identités. Le produit a donc invente son contournement, et il etait faux : sessions fabriquées, contrôle d'audience sauté, `client_id` faux survivant **neuf jours**, cinq workflows inter-profils échouant au premier passage réel (run 13894) après n'avoir jamais été verts. **Le point structurel** : ce n'est pas une lacune du produit mais une lacune de la CONCEPTION. Le cahier des charges dit « SSO via Microsoft Entra ID / OIDC » (§11, §13) et s'arrête — comme il disait « conversion asynchrone » et s'arrêtait (RG-18), et « formats acceptés » sans dire ce que l'utilisateur en apprend (RG-21). **Troisième instance du même patron** : une décision technique énoncée sans sa contrepartie observable. Ici la contrepartie manquante est : *comment teste-t-on ce que ce choix rend intestable ?* | Une **exigence-type obligatoire** dans `cat-con-03`, déclenchée par le vocabulaire de l'identité déléguée — « SSO », « OIDC », « Entra », « Google », « SAML », « fournisseur d'identité » : toute exigence qui délègue l'authentification doit énoncer (a) le **mode de substitution local**, (b) les **identités de test** qu'il rend disponibles, (c) le **mécanisme de bascule** entre substitut et fournisseur réel, et (d) **ce qui empêche le substitut d'être atteignable en cible**. Le point (d) n'est pas une précaution de rédaction : un mode d'authentification simulé accessible sur un environnement servi est une faille, pas une commodité. Le gabarit de mise en œuvre est disponible et éprouvé — `etudes\Client-A - APR - Proposition - Bascule Entra local-cible - 20260824a.md` et son implémentation (PR 3685) : un réglage `AUTH_MODE` déclaré, défaut au mode **sûr**, et deux gardes **fail-closed** portant sur des FAITS vérifiables et non sur le nom de l'environnement — le mode local exige un émetteur privé, le mode cible exige une audience unique. `environment == "dev"` ne discrimine rien : Dev Azure porte exactement cette valeur avec un fournisseur réel. |

## tests (`digit-ai-forge-tests`)

| id | Gravité | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|
| RG-26 | majeur | **Un substitut d'identité local doit JOUER la connexion, jamais la fabriquer — et rien ne le dit.** La solution tentante est d'écrire la session directement dans le stockage du navigateur : c'est rapide, ça marche tout de suite, et ça saute le seul mécanisme qui aurait détecté l'erreur. Sur Produit-01 : contrôle d'audience sauté pour les 5 profils, `client_id` faux invisible neuf jours, trois fichiers portant trois valeurs du même identifiant. Le **corollaire** est aussi générique, et le premier correctif s'y est repris : le choix d'identité doit voyager DANS LE MÊME STOCKAGE que la session — mémorisé ailleurs (ici `sessionStorage`, que le `storageState` de Playwright ne sauvegarde pas), il est perdu au rejeu et l'application retombe silencieusement sur son identité nominale. Ce second défaut passait `tsc`, `eslint`, 137 tests unitaires et le harnais de connexion lui-même. | Une règle de `cat-tst-*`, formulable en une phrase et vérifiable : **dans une recette de bout en bout, une session s'obtient par le parcours d'entrée réel du produit ; toute session écrite directement dans un stockage est un défaut**. Mécanisable par analyse statique : dans un répertoire de recette, une écriture directe dans `localStorage`/`sessionStorage`/cookies portant une clé de session est signalée. Complément de doctrine : le substitut local doit rendre le parcours d'entrée **rejouable par identité**, ce qui suppose que l'IdP simulé sache émettre une audience par identité — la contrainte `aud == client_id` des bibliothèques OIDC clientes est le vrai verrou, et elle se lève en acceptant une liste d'audiences **bornée au mode local** (implémentation de référence : PR 3685). |

## Confirmations positives

- **La bascule a été validée sur la pile locale AVANT d'être poussée, et c'est ce qui a
  rattrapé le second défaut.** Le premier correctif passait toutes les portes statiques et le
  harnais de connexion ; seule l'exécution réelle des cinq workflows a montré qu'il ne
  corrigeait rien. Sans validation locale, la découverte aurait coûté un cycle
  d'intégration continue complet — et surtout, le doute aurait porté sur le mauvais objet.
  La règle « on rejoue avant de pousser ce qu'on ne peut pas prouver autrement » vaut d'être
  écrite dans la doctrine plutôt que redécouverte.
- **Le test d'accessibilité de l'écran de décision, jusqu'ici toujours sauté, s'exécute
  désormais.** Son garde conditionnel (`test.skip` faute d'approbation en attente) ne se
  déclenchait jamais parce qu'aucun workflow réel ne produisait cet état. La recette est
  passée de 27 exécutés + 1 sauté à **28 exécutés**. Un test qui ne s'exécute jamais est un
  test qui ment sur la couverture, et c'est un effet de bord qu'aucune métrique ne signalait.

## Ordre recommandé

1. **RG-26** — la règle est formulable en une phrase, mécanisable par analyse statique, et
   elle ferme le contournement le plus tentant. C'est le meilleur rapport gain/effort du lot.
2. **RG-25** — durcissement de conception, à embarquer avec **RG-18** et **RG-21** : les trois
   sont la même mécanique d'exigence-type déclenchée par le vocabulaire, sur trois
   déclencheurs différents (asynchrone, limite, identité déléguée). Les traiter ensemble coûte
   moins que trois fois séparément, et rend le patron visible.
