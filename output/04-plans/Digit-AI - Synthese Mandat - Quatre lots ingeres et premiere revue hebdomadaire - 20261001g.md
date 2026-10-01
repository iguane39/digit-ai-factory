---
destinataire: humain
---

# Synthèse Mandat — 4 lots de retours ingérés et première revue hebdomadaire rendue, 7 propositions à trancher (01/10/2026)

## 0. Synthèse d'ouverture

Les 4 lots de retours qui attendaient au sas sont au registre : 8 candidatures neuves, toutes remises par Produit-03 sur sa chaîne de livraison. La première revue hebdomadaire est prête : 7 propositions, chacune relue contre le code du jour avant d'écrire sa fiche. 6 se tranchent pour un coût simple × court. Les 7 recommandations sont l'option (a) ; une ligne suffit pour répondre, par exemple « D-41 a, D-42 a, D-43 a, D-44 a, D-45 a, D-46 a, D-47 a ». Rien n'est publié.

## 1. En-tête d'identification

- **quoi** — accueil et ingestion des retours en attente, puis écriture des fiches de décision et rendu de la première revue hebdomadaire.
- **sur quoi** — le pilot `digit-ai-factory` : le sas `input/00-retours/_arrivee/`, le registre `todo/TODO.jsonl`, le dossier `output/04-plans/` ; lecture seule dans `digit-ai-forge-agents`.
- **quand** — 2026-10-01 17:48 UTC+02:00 (Europe/Paris), heure relevée par `date` ; début vers 17:42, heure du relevé d'ouverture de la session ; durée mesurée 11 min, jusqu'à 17:53.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`) ; pilot à `6e920d7a` au début, `014b2745` à la fin ; aucun sous-agent ; escalade de modèle : aucune ; oracles joués : `oracle-lot-retours`, `oracle-todo`, `oracle-boite-entree`, `revue-hebdo --self-test`, `oracle-synthese`, `oracle-ecriture`.
- **intention** — vider la file des retours et faire avancer le stock des propositions, sans qu'aucune décision vous échappe. **Test rétro** : servie ; la boîte est vide et vérifiée, et la décision D-40, ouverte plus tôt, est exécutée dans son option recommandée, que votre demande « Traite la liste des todo » désigne.

## 2. Verdict en une ligne

**Sas vidé, 4 lots ingérés (8 candidatures), registre et boîte d'entrée en exit 0 ; revue hebdomadaire rendue avec 7 fiches vérifiées contre le code, dont 1 défaut déjà corrigé et 1 travail déjà publié à clore.**

## 3. Décisions attendues de l'humain

7 décisions neuves vous attendent, celles de la revue de la semaine ; elles sont classées par valeur au registre. D-39, posée à 15:44 sur l'intégration retenue par l'étude `output/03-etudes/20261001-etude-opportunite-rsi-et-ssl.md`, reste ouverte et inchangée. D-40 est exécutée dans son option recommandée.

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



## 4. Traité — avec sa preuve

Les preuves ci-dessous sont des sorties de commandes de ce tour.

- **Les lots du sas sont accueillis** : leurs noms et contenus sont pseudonymisés et déposés à la racine suivie de `input/00-retours/`, aucune collision d'indice avec les lots a à e du même jour.
  - preuve : `node todo/accueillir-lot.mjs` → « 8 lot(s) accueilli(s), 0 refusé(s) » ; le sas ne contient plus que son README.
- **Les 4 lots sont ingérés après une note de réception** : la première ingestion les a refusés, faute d'y nommer les 7 classes proposées. Une note de réception les nomme désormais dans chaque `.md`, posée avant l'ingestion. Le lot h citait une classe proposée par un retour du matin et jamais créée : sa ligne passe à la clé réservée, avec la même proposition.
  - preuve : `oracle-lot-retours` exit 0 sur les 4 lots ; `node todo/ingerer-lot.mjs` exit 0 sur les 4 → 1, 1, 2 et 4 candidatures, TF-1542 à TF-1549.
- **Le registre et la boîte sont sains** après l'ingestion, puis après les fiches.
  - preuve : `node todo/oracle-todo.mjs` → exit 0 aux 2 passages ; `node oracles/oracle-boite-entree.mjs` → exit 0.
- **7 fiches de décision sont écrites**, chacune après relecture du code concerné. 5 défauts sont reproduits aujourd'hui, 1 est déjà réparé, 1 travail est déjà publié.
  - preuve : `todo/journaliser.mjs` → verdict PASS avant et après l'écriture ; la clé de test `sk-ant-api03-…` et le jeton `ghs_` passent la règle R-23 et sont reconnus par la constante partagée ; `git -C output ls-files` rend 475 chemins, et 2 568 avec `GIT_DIR` seul.
- **La revue de la semaine est rendue**, 7 décisions de D-41 à D-47, aucune fiche à instruire.
  - preuve : `node todo/revue-hebdo.mjs --depuis 41 --sortie <dossier>` → 7 décisions, `a_instruire` vide ; `--self-test` → PASS ; le journal `todo/observabilite/revues-hebdo.jsonl` porte la correspondance des sélecteurs.
- **Le rendu de la revue passe désormais le juge de la restitution** : la fiche accepte un champ `rappel` qui remplace le titre de la candidature, et ses listes s'écrivent sans identifiant nu, comme le dit maintenant `references/TODO-FORGE.md`.
  - preuve : `oracle-synthese` rouge au premier rendu, 5 décisions sur 7 refusées par sa règle des identifiants nus, puis 2 sur 7, puis vert, exit 0 ; `revue-hebdo --self-test` → PASS après la modification.
- **Le travail est enregistré en local** en 2 enregistrements ciblés, sans emporter les fichiers qu'une autre session a indexés.
  - preuve : `git log --oneline -2` → `014b2745 Revue hebdomadaire : premiere revue rendue…` et `30be3129 Retours : 4 lots Produit-03 du 01/10 (f a i)…`.

## 5. Non traité — avec son motif

- La création au référentiel des 7 classes proposées par les lots du jour, et des 44 autres retours qui portent encore une classe à créer — motif : `decision`, la règle de D-42 décide de la forme de la première, et chaque classe exige un contrôle qui existe.
- Les 186 autres candidatures en attente — motif : `borne_atteinte`, la revue en présente 7 par semaine.
- Les 27 candidatures décidées ou en cours — motif : `hors_mandat`, la demande portait sur le tri de la file, pas sur leur exécution.
- L'identifiant technique `AZURE_EXTENSION_DIR` relevé à l'ingestion — motif : `hors_mandat`, c'est une variable publique d'Azure CLI, rien à inscrire à la table des noms.

## 6. Écarts à la lettre

- **Vous avez écrit** « Traite la liste des todo » → **j'ai exécuté l'option recommandée de D-40 : les fiches des 7 propositions de plus forte valeur et la revue** → **pourquoi** : la décision d'une candidature vous revient, et la revue est la voie que vous avez fixée ce jour pour les trancher vite.
- **Vous avez écrit** « et retours » → **les 4 lots ont reçu une note de réception avant d'entrer** → **pourquoi** : le registre refuse un lot qui ne nomme pas la classe qu'il propose, et un lot ingéré ne se modifie plus.

## 7. Risques

- Une fiche de décision trop favorable fait adopter une proposition faible ;
  - signal : une proposition adoptée en (a) dont le gain n'apparaît pas à sa clôture ;
  - parade : chaque fiche cite sa source relue le jour même, et la clôture exige des gains constatés.
- Le stock de classes à créer grossit plus vite que la revue ne le réduit ;
  - signal : le compte des retours qui portent une classe à créer, 51 ce soir ;
  - parade : une décision dédiée à la prochaine revue si le compte dépasse 60.

## 8. Prochaines actions

Les actions sont triées, celles de l'IA d'abord ; elles suivent vos réponses au bloc 3.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Exécuter les options retenues pour D-41 à D-47, puis consigner chaque sélecteur reçu au registre par `todo/journaliser.mjs` | `auto_ia` | neuve | `dependance_bloc_3` — suit D-41 à D-47 | les 7 candidatures reviennent à la revue suivante |
| **A-2** | Donner le feu vert à la publication des enregistrements locaux du pilot, `30be3129` et `014b2745` compris — répondre « publie » | `manuelle_utilisateur` | neuve | `decision` — une publication attend votre feu vert, la session pousse ensuite | l'autre poste ne voit pas les 8 candidatures neuves |
| **A-3** | Trancher D-39 et D-41 à D-47 — répondre par exemple « D-41 a, D-42 a » | `manuelle_utilisateur` | neuve | `decision` — choisir ce qui se fait vous revient | (c) s'applique à chacune |

## 9. Traces

- Lots ingérés : `input/00-retours/Produit-03 - RETOURS - 20261001f.md` à `20261001i.md`, avec leurs sidecars.
- Registre : `todo/TODO.jsonl`, candidatures TF-1542 à TF-1549 et fiches de 7 candidatures.
- Dossier de revue : `output/04-plans/Digit-AI - Revue Hebdomadaire - Sept propositions D-41 a D-47 - 20261001f.md`.
- Journal des revues : `todo/observabilite/revues-hebdo.jsonl`.
- Revue : `todo/revue-hebdo.mjs`, mode opératoire `references/TODO-FORGE.md`.
- Commits locaux `30be3129` et `014b2745` ; rien n'est poussé.
