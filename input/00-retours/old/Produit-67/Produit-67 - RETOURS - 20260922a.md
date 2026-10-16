# Retours forges — Produit-67 — 20260922a

- **Contexte** : premier prompt d'un projet neuf citant nommément la factory (`https://github.com/iguane39/digit-ai-factory`) — aucune mécanique de la factory ne s'est enclenchée
- **Références ledger** : **aucune** — et c'est précisément le retour : le run n'a jamais été ouvert, donc `forge\ledger.jsonl` n'existe pas. La preuve est l'état du poste, mesuré le 22/09/2026 et reproduit ci-dessous.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\`
- **Statut** : remis le 2026-09-22

---

## pilot (`digit-ai-factory`)

Un projet neuf a été ouvert dans un dossier vide, et son premier prompt citait l'URL du dépôt de la factory. La factory était installée **dans le dossier parent** (`C:\dev\digit-ai-factory`, v1.17.30-695-g09bee53), c'est-à-dire au deuxième candidat de l'ordre de résolution qu'`AGENTS.md` prescrit. Rien ne l'a cherchée. Le protocole d'accueil n'a pas été joué, aucun dossier d'héritage n'a été créé, et le livrable est sorti à la racine du projet sous un nom choisi par la session — hors `output\`, hors ledger, hors oracle.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-1 | majeur | générique | **La factory n'a aucun déclencheur au niveau du POSTE : son point d'entrée est installé par le geste qu'il est censé déclencher.** Mesure du 22/09/2026 sur le poste : (a) `bootstrap.mjs` a bien propagé **30 skills** vers `~/.claude/skills` *et* `~/.claude-b/skills` — la propagation fonctionne ; **aucun de ces 30 skills ne porte le protocole d'accueil** (liste vérifiée : aucun `accueil`, `amorcage`, `demarrer-un-run`, `factory`) ; (b) **aucun `settings.json` au poste** — ni `~/.claude/settings.json`, ni `~/.claude-b/settings.json`, ni `settings.local.json` : le hook `lexique` (`UserPromptSubmit`, qui « reconnaît le mot-clé et injecte l'appel du skill », `gabarits\hooks-factory.mjs`) n'existe qu'en portée PRODUIT, posé par `gabarits\settings-produit.json` (R-44) **à l'ouverture du run** ; (c) le dossier projet était vide — pas de `CLAUDE.md`, pas de `forge\`, pas de `settings.json`. Le seul canal ambiant qui marche déjà (la propagation de skills) ne transporte pas l'entrée ; le seul mécanisme qui a la bonne FORME (hook `UserPromptSubmit`) vit du mauvais côté de la porte. `AGENTS.md` prescrit correctement la séquence, mais il vit dans un dépôt qu'un agent doit d'abord décider de lire — une consigne que rien ne présente n'est jamais lue. **Coût mesuré sur ce cas** : un premier prompt de projet entièrement produit hors factory — sans phase 0, sans `input\`/`output\`/`forge\` (règles projet 1 et 2, mécanisme P0), sans ledger, sans oracle exécuté, livrable écrit à la racine (classe `emplacement-livrable-hors-convention`). | Faire porter l'entrée par le canal ambiant qui fonctionne déjà : **(a)** `bootstrap.mjs` propage un skill d'accueil (`SKILL.md` dont les déclencheurs couvrent « factory », « forge », « digit-ai-factory », l'URL du dépôt, et l'ouverture d'un projet sans `forge\`) au même titre que les 30 autres ; **(b)** `bootstrap.mjs` installe au POSTE le hook `UserPromptSubmit` déjà écrit (`hooks-factory.mjs lexique`), en fusion non destructive sur `~/.claude/settings.json` — le hook résout déjà le pilot tout seul et sort en 0 s'il ne le trouve pas, donc il est sûr hors projet factory ; **(c)** un oracle de non-régression qui échoue si un poste où le pilot est installé n'a ni le skill d'accueil ni le hook. La loi n° 1 s'applique ici à la factory elle-même : *une affordance non câblée n'existe pas.* |
| RP-2 | majeur | générique | **Aucun point d'entrée canonique n'existe pour un projet EXISTANT qui adopte la factory.** `PROMPT-PRODUIT.md` est explicitement « nouveau produit » et exige un **dossier vide** (« Créer un dossier vide pour le produit, y copier ce fichier »). `REGLES-PROJET.md` renvoie le cas existant à plus tard — « Rattrapage des projets existants : au prochain run de version de chacun » — c'est-à-dire à un run qui, pour un projet jamais instrumenté, n'arrivera jamais de lui-même. Il n'existe donc aucun geste nommé entre « je n'ai rien » et « je repars d'un dossier vide », alors que c'est le cas d'entrée le plus fréquent d'un patrimoine existant. | Un `PROMPT-PRODUIT-EXISTANT.md` (ou un mode du prompt canonique) dont la phase 0 est **idempotente et non destructive** : relève ce qui est déjà là, crée seulement ce qui manque (`input\`, `output\`, `forge\`, `CLAUDE.md` produit, `settings-produit.json`, `forge\retours\oracle-lot.mjs`), **ne déplace aucun fichier existant sans le dire**, et consigne l'écart initial en hypothèses plutôt que de l'imposer. Le skill d'accueil de RP-1 est le porteur naturel de ce mode : il constate l'absence de `forge\`, et propose l'adoption au lieu de supposer un dossier vide. |

**Portée** (R-45, 21/08) : les deux retours sont *génériques* — ils ne dépendent d'aucune particularité de ce projet. RP-1 se reproduit sur tout poste où le pilot est installé et où une session s'ouvre hors d'un produit instrumenté ; RP-2 se reproduit sur tout dépôt préexistant.

## Remarques restées au produit

Ce projet n'a encore produit qu'un seul livrable et n'a corrigé aucun défaut chez lui : il n'y a donc pas de tri à exposer.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le livrable d'analyse a été écrit à la racine du projet, hors `output\` | non corrigé à ce stade — le projet n'a pas encore de structure d'héritage | oui | C'est un symptôme de RP-1, pas un défaut propre : sans phase 0, aucune convention de rangement n'existait dans le projet. Remonté ci-dessus dans la preuve de RP-1 (classe `emplacement-livrable-hors-convention`), pas comme retour distinct — le traiter séparément traiterait le symptôme. |

Aucune autre remarque n'est restée au produit sur ce lot — vérifié par l'auteur du lot, le 22/09/2026.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

*Précision utile au pilot* : c'est en soi une conséquence de RP-1. Le livrable produit (une analyse de prompt) aurait pu relever du gabarit `note-de-synthese` de `gabarits\documents\` ; aucun gabarit n'a été consulté, parce que la bibliothèque n'a jamais été présentée à la session.

## Confirmations positives

- **La propagation de skills tient.** `bootstrap.mjs` a bien installé 30 skills vers `~/.claude/skills` *et* `~/.claude-b/skills`, tenus identiques. Le canal ambiant existe et fonctionne — c'est ce qui rend la correction de RP-1 peu coûteuse : il n'y a rien à construire, seulement une charge de plus à y mettre.
- **`hooks-factory.mjs` est correctement conçu pour cet usage.** Il résout le pilot seul (même ordre qu'`AGENTS.md`), délègue stdin compris, et sort en 0 en le disant si le pilot est introuvable — « un produit ne doit pas devenir inutilisable parce que la factory n'est pas sur ce poste ». Cette propriété le rend déjà sûr à installer au poste, sans garde supplémentaire.
- **`AGENTS.md` dit la bonne chose.** Le défaut n'est pas dans son contenu : l'ordre de résolution qu'il prescrit aurait trouvé la factory du premier coup (elle était dans `c:\dev`, son troisième candidat, et dans le parent du projet, son deuxième). Le défaut est que rien ne le présente.

## Ordre recommandé

1. **RP-1 (b) — le hook au poste**, d'abord : le code existe (`hooks-factory.mjs lexique`), il est déjà sûr hors contexte factory, et il ferme le cas le plus fréquent (une session qui nomme la factory) sans rien réécrire. Meilleur rapport gain/effort du lot.
2. **RP-1 (a) — le skill d'accueil** : le canal de propagation est déjà en service, la charge à y ajouter est un `SKILL.md`. Couvre le cas où le hook n'est pas installable (harnais tiers, poste verrouillé).
3. **RP-1 (c) — l'oracle de non-régression** : sans lui, (a) et (b) se perdent au prochain poste ; c'est ce qui transforme la correction en règle.
4. **RP-2 — le point d'entrée « projet existant »** : plus de conception, et il s'appuie sur le skill de (a) pour être atteignable.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

**Aucune règle existante ne couvre ces deux retours**, et la vérification a été faite : les 87 classes de `todo\CLASSES.json` ont été parcourues, aucune ne porte l'amorçage d'une session ; les 1 912 items de `todo\TODO.jsonl` ont été cherchés sur « premier prompt », « amorçage », « projet existant », « AGENTS.md », « point d'entrée », « PROMPT-PRODUIT » — 22 correspondances, toutes sur d'autres sujets (points d'entrée de manifeste d'oracle, boîte d'entrée des lots, déclencheurs d'interface). Le socle a donc un trou, et la règle § 4 de `quality-oracles` s'applique : **domaine sans oracle → en définir un**, ce que propose RP-1 (c).

**Classe proposée** (sortie conforme TF-1128, 15/09/2026) :

- **clé** : `amorcage-factory-sans-declencheur-au-poste`
- **famille** : `hook-ou-gate` *(« Un hook ou un gate absent, bloquant à tort, ou contourné » — le gate d'entrée de la factory est absent en portée poste)*
- **libellé** : Le point d'entrée d'un dispositif n'existe qu'en portée PRODUIT et n'est posé qu'à l'ouverture du run : le déclencheur est installé par le geste qu'il est censé déclencher. Une session qui nomme le dispositif, sur un poste où il est pourtant installé, n'enclenche rien — et le défaut est invisible au propriétaire du dispositif, dont tous les postes de test ont déjà un produit instrumenté sous la main.
- **voisines** : `skill-ou-oracle-non-invoque` (un contrôle existant non joué — ici rien n'existe à jouer en portée poste, la différence est la PORTÉE, pas l'oubli) ; `heritage-produit` (un artefact du pilot absent chez un produit — ici le produit n'existe pas encore comme produit) ; `exemption-hors-atteinte-par-le-chemin-prescrit` (un mécanisme exige un geste qu'aucun mode d'emploi n'impose — ici le mode d'emploi existe, `AGENTS.md`, mais rien ne le présente).
