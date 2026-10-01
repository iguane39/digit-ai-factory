# Revue hebdomadaire des propositions — 2026-10-01

7 proposition(s) à trancher cette semaine, classées par valeur au registre. Chacune dit ses avantages, ses inconvénients et ses impacts, puis ses 3 options ; la colonne Coût dit la complexité et la durée, la colonne Exclusions ce que retenir l'option ferme.

Pour répondre, une ligne suffit, par exemple : « D-41 a, D-42 a, D-43 a, D-44 a, D-45 a, D-46 a, D-47 a ». Une décision sans réponse prend son option (c).

> **D-41 — Faut-il clore en corrigé la candidature d'intégration du guide de référence, publiée depuis le 28/09 avec sa règle de remontée ?**
>
> La famille de gabarits `gd-guide-de-reference` et la règle sur la remontée des documents mûrs ont été reportées sur main et publiées le 28/09 ; la candidature est restée en attente, faute d'avoir consigné les mots du porteur.
>
> **Avantages** : le registre dit enfin ce qui est fait : la candidature de plus forte valeur (25) n'est plus en attente ; la descente est déjà écrite : la règle de remontée dans `REGLES-PROJET.md` et le contrôle `LOT-MURS` de `gabarits/oracle-lot-retours.mjs`.
> **Inconvénients** : aucun autre produit n'a encore remonté de document mûr par cette règle : son usage n'est pas mesuré.
> **Impacts** : pilot seul : une ligne au registre, aucune écriture chez les produits ni dans les forges.
>
> **Recommandation : (a).** Source consultée : les notes du 28/09 de TF-1413 au registre, le commit 80c126f et REGLES-PROJET.md relus le 01/10/2026. Le travail demandé est publié ; l'usage de la règle se mesurera par LOT-MURS, que la clôture n'empêche pas.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Clore en corrigé sur l'intégration 80c126f, descente : R-57 et LOT-MURS | simple × court | aucune |
| **(b)** Passer en cours et ne clore qu'à la première remontée d'un document mûr par un autre produit | simple × long | la candidature reste ouverte plusieurs semaines |
| **(c)** Laisser la candidature en attente | nul | le registre continue de présenter comme à faire un travail publié |

> **Si rien n'est décidé** : (c) Laisser la candidature en attente.

> **D-42 — Faut-il écrire au gabarit de restitution qu'une voie proposée suit le processus du commanditaire étape par étape, et non seulement acteur par acteur ?**
>
> Le produit Produit-03 a reçu 7 retours humains en 4 heures le 01/10 : la session a ajouté 2 fois une étape absente du processus que le commanditaire avait décrit, une demande à l'administrateur Entra avant la visite de l'application.
>
> **Avantages** : ferme la cause des 7 retours humains reçus en 4 heures le 01/10 (09h46 à 13h20) ; réunit les 2 retours du jour sur ce processus sous une seule classe, élargie aux étapes ajoutées.
> **Inconvénients** : la relecture d'un processus étape par étape n'est pas mécanisable : aucun oracle ne la jouera ; la règle s'ajoute à un gabarit déjà long.
> **Impacts** : pilot : `gabarits/RESTITUTION.md` et la classe `processus-du-commanditaire-reattribue` dans `todo/CLASSES.json` ; produits : la règle leur descend par l'héritage du socle à leur prochaine ouverture.
>
> **Recommandation : (a).** Source consultée : le lot Produit-03 - RETOURS - 20261001f et TF-1518 (lot 20261001d), relus le 01/10/2026. La règle proposée le matin, appliquée à la lettre, a produit la demande refusée à 13h20 : il faut la compléter, pas la répéter.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Créer la classe élargie, écrire la règle au gabarit et y joindre la voie de la loi n° 5 : mesurer les voies automatiques avant toute étape ajoutée | moyen × court | aucune |
| **(b)** Créer la classe seulement, sans règle au gabarit | simple × court | la récidive se comptera sans être prévenue |
| **(c)** Laisser la candidature en attente | nul | les 2 retours du jour sur ce processus restent sans classe au registre |

> **Si rien n'est décidé** : (c) Laisser la candidature en attente.

> **D-43 — Faut-il corriger oracle-sca de quality-oracles pour qu'il lance npm sous Windows, au lieu de rendre SKIP ?**
>
> Le script `oracle-sca.mjs` du skill `quality-oracles` rend SKIP sous Windows : il appelle npm sans passer par `npm.cmd`, et l'appel échoue sans sortie alors que npm répond sur le même poste.
>
> **Avantages** : l'audit des dépendances npm redevient un verdict sur les postes Windows du parc, au lieu d'un SKIP qui ne juge rien.
> **Inconvénients** : un audit npm qui tourne peut faire apparaître des vulnérabilités jusqu'ici non vues : non mesuré.
> **Impacts** : digit-ai-forge-agents : .claude/skills/quality-oracles/scripts/oracle-sca.mjs et une fixture ; aucun produit à modifier : ils lisent le skill installé.
>
> **Recommandation : (a).** Source consultée : `oracle-sca.mjs` relu le 01/10/2026, à l'appel de `npm audit --json`, et le constat du 24/09 au registre. Le constat montre que npm audit --json et l'oracle de forge-websec répondent sur le même poste : le défaut est dans l'appel, pas dans l'outil.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Lancer npm.cmd sous Windows, avec une fixture qui exige un verdict et non un SKIP | simple × court | aucune |
| **(b)** Déclarer la limite au non_juge de l'oracle sans la corriger | simple × court | l'audit npm reste aveugle sous Windows |
| **(c)** Laisser la candidature en attente | nul | chaque appel sous Windows continue de rendre SKIP |

> **Si rien n'est décidé** : (c) Laisser la candidature en attente.

> **D-44 — Faut-il clore en corrigé la candidature sur la vue active perdue par la recherche, puisque la correction du 23/09 a appliqué le remède qu'elle proposait ?**
>
> Le composant de recherche `find-in-page.js` ramenait la vue active à celle du chargement à chaque frappe ; la correction publiée le 23/09 par `b010251` ne réécrit plus le conteneur, ce qui était le remède proposé.
>
> **Avantages** : retire du stock une candidature dont le défaut n'existe plus dans le code publié.
> **Inconvénients** : l'effet propre à cette candidature, la vue active ramenée à celle du chargement, n'a pas été rejoué au navigateur après `b010251`.
> **Impacts** : pilot seul : une ligne au registre.
>
> **Recommandation : (a).** Source consultée : `find-in-page.js` de `digit-ai-forge-agents` relu le 01/10/2026, son avertissement d'en-tête et sa fonction `unhighlight`, et le journal git du fichier. La cause nommée par la candidature est la réaffectation de `innerHTML` ; elle n'existe plus, donc ses 2 effets non plus.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Clore en corrigé sur `b010251`, descente : l'avertissement en tête de `find-in-page.js` et la recette de la correction du 23/09 | simple × court | aucune |
| **(b)** Rejouer d'abord la sonde de la page du 24/09 au navigateur, puis clore | simple × court | aucune ; un tour de plus |
| **(c)** Laisser la candidature en attente | nul | le stock garde un défaut déjà corrigé |

> **Si rien n'est décidé** : (c) Laisser la candidature en attente.

> **D-45 — Faut-il retirer GIT_DIR et GIT_WORK_TREE de l'environnement du relevé git de generer-lisezmoi-output.mjs ?**
>
> Le générateur `scripts/generer-lisezmoi-output.mjs` relève les livrables par git avec l'environnement de l'appelant : un commit fait depuis un arbre de travail lié publie un index des livrables faux, sans alerte.
>
> **Avantages** : un commit fait depuis un arbre de travail lié, la voie pour ne pas gêner une session en cours, ne publie plus un index des livrables faux.
> **Inconvénients** : le cas exact de l'arbre lié n'est pas rejoué sur la version publiée : la fixture le fera.
> **Impacts** : pilot : la fonction de relevé de `scripts/generer-lisezmoi-output.mjs` et une recette ; aucune écriture chez les produits.
>
> **Recommandation : (a).** Source consultée : scripts/generer-lisezmoi-output.mjs relu et rejoué le 01/10/2026, constat du 24/09 au registre. Le relevé change déjà de résultat avec GIT_DIR seul (475 contre 2 568) : la variable est la cause, la retirer suffit.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Retirer les deux variables de l'environnement du git lancé, avec une fixture d'arbre lié qui garde ses livrables | simple × court | aucune |
| **(b)** Interdire au garde d'écrire l'index quand GIT_DIR est présent, sans corriger le relevé | simple × court | l'index n'est plus mis à jour depuis un arbre lié |
| **(c)** Laisser la candidature en attente | nul | un commit depuis un arbre lié peut publier un index faux sans que personne le voie |

> **Si rien n'est décidé** : (c) Laisser la candidature en attente.

> **D-46 — Faut-il faire résoudre les deux chemins à embarquer-composants.mjs avant de comparer, et sortir en erreur quand il ne pose aucun bloc ?**
>
> Le poseur `embarquer-composants.mjs` du skill `digit-ai-page-html` ne pose rien et sort 0 quand on l'appelle par une jonction de répertoire : sa garde compare un chemin résolu à un chemin qui ne l'est pas.
>
> **Avantages** : une page ne part plus sans recherche ni filtres alors que le poseur a rendu 0 ; le défaut touche tout poste dont le dossier des skills est une jonction, cas mesuré le 24/09 sur un profil de ce poste.
> **Inconvénients** : un appel qui posait 0 bloc par choix sortira en erreur : non mesuré, aucun cas connu.
> **Impacts** : digit-ai-forge-agents : .claude/skills/digit-ai-page-html/scripts/embarquer-composants.mjs et une fixture par jonction ; les produits reçoivent la correction par le skill installé.
>
> **Recommandation : (a).** Source consultée : `embarquer-composants.mjs` de `digit-ai-forge-agents` relu le 01/10/2026, sa garde de point d'entrée, et le constat du 24/09 au registre. La garde de point d'entrée est la cause lue ; le code de sortie est ce qui a caché la cause.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Résoudre les deux chemins par realpathSync et sortir non nul quand --poser ne pose rien, avec une fixture par jonction | simple × court | aucune |
| **(b)** Résoudre les chemins seulement, sans changer le code de sortie | simple × court | un autre échec silencieux du poseur resterait à 0 |
| **(c)** Laisser la candidature en attente | nul | le poseur continue de réussir sans rien faire sur un chemin par jonction |

> **Si rien n'est décidé** : (c) Laisser la candidature en attente.

> **D-47 — Faut-il faire lire à la règle de secret d'oracle-conformite-projet la constante partagée MOTIF_SECRET_EX ?**
>
> La règle de secret d'`oracles/oracle-conformite-projet.mjs` qui juge les projets porte un motif plus étroit que la constante partagée `MOTIF_SECRET_EX` : une clé d'API Anthropic et les jetons GitHub `ghs_` lui échappent.
>
> **Avantages** : une clé d'API Anthropic et les jetons GitHub `ghu_`, `ghs_` et `ghr_` ne passent plus la règle de secret ; un seul motif de secret dans l'oracle au lieu de 2 qui divergent.
> **Inconvénients** : la règle de secret peut rendre des constats neufs sur des projets déjà verts : non mesuré.
> **Impacts** : pilot : `oracles/oracle-conformite-projet.mjs`, le motif de la règle de secret, et un cas de recette ; les produits jugés par l'oracle voient la règle durcie.
>
> **Recommandation : (a).** Source consultée : `oracle-conformite-projet.mjs` relu et rejoué le 01/10/2026, la constante partagée et le motif local de la règle. La constante partagée sert déjà 2 autres règles de l'oracle : celle-ci est la seule copie restée étroite.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** *(recommandée)* Remplacer le motif local par `MOTIF_SECRET_EX`, avec un cas rouge `sk-ant` et `ghs_` | simple × court | aucune |
| **(b)** Élargir le motif local sans le partager | simple × court | les deux motifs pourront de nouveau diverger |
| **(c)** Laisser la candidature en attente | nul | une clé d'API Anthropic reste invisible à la règle de secret |

> **Si rien n'est décidé** : (c) Laisser la candidature en attente.


