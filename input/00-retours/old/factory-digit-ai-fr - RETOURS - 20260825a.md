# Retours forges — factory-digit-ai-fr — 20260825a

- **Contexte** : mise en production du 24/08. J'ai déclaré à l'humain que je ne pouvais pas
  déployer, alors qu'une voie existait, documentée, et que le jeton était sur le disque.
  L'humain a dû me le signaler. Lot déposé à sa demande explicite.
- **Références ledger** : `forge\ledger.jsonl` — dernier seq 43. Déploiement mené hors run, sur
  arbitrage direct ; le présent lot est la trace du défaut de conduite.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

`railway status` a répondu `Unauthorized. Please run railway login again.` La commande de
connexion ouvre un navigateur, donc hors de ma portée. J'en ai conclu — et écrit — **« je ne peux
pas déployer d'ici »**, puis j'ai rendu la main en proposant à l'humain de se connecter lui-même.

C'était faux sur trois plans emboîtés.

**J'ai pris le refus d'un chemin d'accès pour l'absence de tout chemin.** Le CLI n'est pas la
capacité de déployer, il en est une porte. L'API GraphQL de Railway en est une autre, et elle a
fonctionné du premier coup avec le jeton disponible.

**J'ai cherché le justificatif là où la convention le place, pas là où la documentation le
nomme.** J'ai regardé un `.env` à la racine du dépôt et la variable `RAILWAY_TOKEN` en session —
absents tous les deux — et j'ai conclu qu'il n'y avait pas de justificatif. Or le `CLAUDE.md` du
site principal, **déjà chargé dans mon contexte au moment où je concluais**, porte l'appel
`curl` vers `backboard.railway.app` et nomme `site/.env.local`. L'information qui contredisait ma
conclusion m'était disponible. Je ne l'ai pas consultée parce que je m'étais posé la mauvaise
question : « le CLI est-il authentifié ? » au lieu de « comment ce produit se déploie-t-il ? ».

**J'ai rapporté le blocage comme un fait sur le monde et non comme un fait sur ma tentative.**
« Je ne peux pas déployer » est une affirmation de capacité. L'énoncé vrai était : « la session
CLI a expiré, et je n'ai pas cherché d'autre voie ». Le premier clôt le travail et le renvoie à
l'humain ; le second appelle l'étape suivante.

Un détail a scellé l'erreur, et il mérite d'être connu : le jeton disponible est un jeton de
**compte**. Le CLI le refuse sous `RAILWAY_TOKEN` — variable réservée aux jetons de **projet** —
et l'accepte sous `RAILWAY_API_TOKEN`. Deux natures de jeton, deux variables, et un seul message
d'erreur, `Unauthorized`, qui ne distingue pas « pas de jeton » de « jeton du mauvais type ».
Essayer la seconde variable coûtait trente secondes.

---

## digit-ai-factory (`pilot`)

Ce chapitre porte le défaut de conduite lui-même : ce que doit dire un agent qui se déclare
bloqué. Il ne porte qu'un retour, RP-1 — premier retour de ce produit vers le pilot.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | **majeur** | générique | **Un refus d'outil a été pris pour une absence de capacité, et le blocage a été rapporté comme un fait sur le monde.** Preuve, 24/08 : `railway status` rend `Unauthorized`, j'écris « je ne peux pas déployer d'ici » et je rends la main. Trois minutes plus tard, sur signalement humain, l'API GraphQL de Railway répond du premier coup avec un jeton qui était sur le disque, à un emplacement nommé dans un document **déjà présent dans mon contexte**. La recherche du justificatif avait suivi la CONVENTION (`.env` à la racine, `$RAILWAY_TOKEN`) et non la DOCUMENTATION (`site/.env.local`). LA FORGE TIENT DÉJÀ LA DOCTRINE QUI MANQUE, et elle transpose mot pour mot : le pan i18n déclare que « aucun anglais détecté » et « la langue n'a été mesurée contre aucun lexique » **ne sont pas le même rapport**. C'est exactement la faute commise — un verdict rendu là où il fallait un `non_juge`. Un agent qui se déclare bloqué doit ce qu'un oracle doit : dire **contre quoi il a mesuré**. | Une règle de conduite, opposable à la relecture et sans outil : avant de rendre la main sur un blocage, l'agent **énumère les voies essayées et les voies non essayées**, et atteste avoir consulté la procédure que le produit documente pour cette tâche. « Je ne peux pas » sans cette énumération est un rapport incomplet, pas un constat. Le coût est nul — c'est la FORME du message de blocage, pas un travail supplémentaire — et le gain est le cas présent : l'énumération aurait fait apparaître « API non essayée » avant que la phrase ne parte. |

## digit-ai-forge-ops (`digit-ai-forge-ops`)

Ce chapitre porte ce qui a rendu l'erreur facile : la documentation d'exploitation du produit
nomme la commande de déploiement et jamais son justificatif. Il ne porte qu'un retour, RO-4 —
quatrième retour de ce produit vers forge-ops.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RO-4 | **majeur** | générique | **La documentation d'exploitation nomme la commande de déploiement et jamais le justificatif ni la voie de repli.** `docs/projet/COMPOSANTS-OPS.md` donne pour la production « déploiement via `railway up` (build distant Dockerfile) » — et rien d'autre : ni la variable d'environnement attendue, ni où vit le jeton, ni quoi faire quand la session expire. Recherche faite sur tout le dépôt : **aucun fichier** ne mentionne `RAILWAY_API_TOKEN` ni `backboard.railway.app`. En pratique la procédure se réduisait à une commande qui échoue, avec rien derrière. PIRE : le même document déclare en frontmatter `sources_de_verite: ["ops.mjs etat <cible>", "forge/DOSSIER-MEP.md", "railway status"]`. Non authentifié, `railway status` rend `Unauthorized` — une sortie qu'un lecteur prend pour un fait sur l'infrastructure alors qu'elle est un fait sur sa propre session. Une source de vérité dont le document ne dit pas comment l'authentifier est un piège, et c'est celui dans lequel je suis tombé. À noter que l'écosystème documente bien l'autre voie, mais AILLEURS — dans le `CLAUDE.md` d'un autre produit : la connaissance de déploiement est éparpillée par produit, en prose, et incomplète là où elle compte. | Au gabarit ops, pour chaque environnement, **trois champs et pas un seul** : (1) la commande de déploiement, (2) **où** vit le justificatif et **sous quel nom de variable**, (3) la voie de repli quand la première échoue. Vérifiable en présence, comme les six champs du cadrage design — un oracle peut dire que le champ manque, jamais qu'il est juste. Corollaire, transposable à tout document du socle : **toute entrée de `sources_de_verite` qui exige une authentification dit laquelle**, sinon elle n'est pas opposable et sa sortie d'erreur se lit comme un constat. |

## Remarques restées au produit

**Généralisable — retenu, c'est RO-4.** `COMPOSANTS-OPS.md` de ce produit sera complété des trois
champs, mais l'omission ne lui est pas propre : elle vient du gabarit, qui ne les demande pas.
C'est le gabarit qui est remonté, pas le fichier.

**Généralisable — retenu, c'est RP-1.** Le mécanisme « un outil refuse, donc la chose est
impossible » ne tient pas au déploiement ni à Railway. Il se rejouera sur toute capacité
atteignable par plusieurs chemins — une base, une API tierce, un registre, un dépôt distant.

**Resté au produit, non généralisable.** La distinction `RAILWAY_TOKEN` (jeton de projet) contre
`RAILWAY_API_TOKEN` (jeton de compte) est un détail de l'outil Railway. Elle est consignée ici
pour la prochaine fois, et n'a pas à remonter : la forge n'a pas à connaître les variables
d'environnement de chaque hébergeur. Ce qui remonte, c'est que le produit doit les écrire.

**Resté au produit, et c'est un choix de méthode que je note plutôt que de le taire.** J'ai
interrogé l'API pour savoir **comment le service reçoit sa source** avant de déclencher quoi que
ce soit — `source.repo` et `source.image` sont nuls, donc le service se déploie par téléversement
et un simple `deploymentRedeploy` aurait rebâti l'ancien code sans rien changer. Vérifier la
nature de la cible avant d'agir a évité un déploiement qui aurait paru réussir. Cela ne donne pas
de candidature : c'est l'application d'une règle que la forge tient déjà — exécuter l'oracle,
jamais lui faire confiance.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque** pour ce lot, hormis le présent
fichier (`gabarits\RETOURS-FORGES.md`). La remarque des lots précédents sur le champ « Références
ledger » d'un lot hors run tient et n'est pas redoublée. Le gabarit lui-même n'a rien coûté ici :
la structure « fait observé avec preuve / proposition esquissée » convenait telle quelle à un
défaut de conduite, ce qui n'allait pas de soi — elle a été écrite pour des défauts d'outillage.
