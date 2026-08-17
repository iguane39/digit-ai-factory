# Étude d'opportunité — séquencement du renommage `digit-ai-forge-pilot` → `digit-ai-factory` — 20260817i

<!-- Instruit TF-0346 au gabarit gabarits\ETUDE-OPPORTUNITE.md (TF-0155), jugé par
     oracles\oracle-etude-opportunite.mjs. Cette étude n'instruit PAS le « faut-il » : la
     décision d'identité est prise par l'humain, qui a ROUVERT TF-0317 en connaissance du
     verdict 20260817h (présentation seule). Elle instruit le COMMENT sans casse — les
     options O0-O4 de §4 sont des SÉQUENCES D'EXÉCUTION alternatives, pas des alternatives
     à la décision. Tous les relevés sont datés du 17/08/2026 sur pilot@949a69c, commandes
     citées avec eux. -->

## Seuil de déclenchement (à vérifier AVANT d'écrire)

Franchi sur deux critères indépendants. **Touche le noyau** : `CLAUDE.md` porte le nom du dépôt
(`digit-ai-forge-pilot`, 1 occurrence) et le motif de résolution de chemins `digit-ai-forge-*`
(§Chemins), sous plafond de 6 Ko tenu par `oracles\oracle-claude-md.mjs`. **Touche ≥ 3 forges** :
les 14 dépôts frères portent 48 occurrences de `forge-pilot` (relevé ci-dessous, dépôt par dépôt).
Le troisième critère n'est pas franchi (`score.gain: 2`) et n'a pas à l'être : la séquence est
exigée nommément par l'entrant (« étude de séquencement courte »), et le seuil TF-0155 est ici
atteint par le périmètre, pas par le gain.

## 0. Traitement des entrants

La proposition instruite est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.

Sources : **TF-0346** (`todo\TODO.jsonl` l.94, `ev:creation`, `ts: 2026-08-17T13:47:55Z`,
`statut: candidat`), réouverture explicite de **TF-0317** (`todo\TODO.jsonl` l.11, clos `corrige`
le 2026-08-17 sur verdict O2). Demandeur : `"humain — mandat direct du 17/08 (prompt réécrit L99,
écarts validés poste par poste)"`. Antécédent chiffré : `output\03-etudes\20260817-etude-opportunite-renommage-factory.md`
(ci-après **20260817h**). Dette connexe : **TF-0332** (`todo\TODO.jsonl`, `ts: 2026-08-17T12:40:35Z`,
`statut: candidat`, « Solder la dette de traçabilité D-14 : trois affirmations de conformité
fausses au corpus »).

**Ce que l'entrant impose et que cette étude ne rediscute pas** — cité, non exécuté :
la décision d'identité (« sa décision d'identité est prise, elle ne se rediscute pas ») ; les deux
gates humains ; l'interdit de réutiliser l'ancien nom pour un nouveau dépôt ; l'interdit
d'archiver sans `gains_constates`. L'entrant déclare lui-même
`preuve_du_cout: "décision humaine d'identité — le coût du statu quo reste non mesuré"` :
la séquence est donc conçue pour un renommage **dont le bénéfice n'est pas mesurable**, ce qui a
une conséquence de méthode et une seule — chaque fenêtre doit être réversible ou prouvée, puisque
aucun gain ne pourra justifier après coup une casse constatée.

**Vérification par sondage des chiffres de 20260817h** (l'entrant demande de les citer, non de les
refaire ; trois ont été rejoués) :

| Chiffre de 20260817h | Rejoué le 17/08 sur `949a69c` | Verdict du sondage |
|---|---|---|
| 48 occurrences de `forge-pilot` chez les 14 frères | agents 2 · agents-security 5 · audit 2 · conception 2 · data 2 · design 2 · development 2 · observability 2 · ops 2 · organization 16 · seo 2 · tests 3 · websec 6 = **48** | **confirmé au nombre exact** ; `digit-ai-forge-audit_client-a` porte 0 et reste hors bootstrap |
| 2 identifiants de schéma sous §3 bis | `pilot/catalogue@1` (5 sites : `oracles\oracle-catalogues.mjs` ×3, `catalogues\generer-vues.mjs`, `catalogues\catalogue.jsonl`) · `pilot/fraicheur-claims@1` (3 sites : `oracles\oracle-fraicheur-doc.mjs` ×2, `oracles\fraicheur-claims.json`) | **confirmé** |
| 334 occurrences vivantes de « pilot » / 58 fichiers | **367 / 61** avec les mêmes exclusions, après 11 commits du même jour | **dérive mesurée de +33 en une journée** — voir §1 (P0) : ce n'est pas une erreur de 20260817h, c'est un fait de séquencement |

## 1. Partition du problème

Découpage exhaustif et disjoint. Chaque option de §4 se rattache à ces partitions.

**P0 — le périmètre lui-même : ce qui se renomme n'est pas ce qu'on croyait compter.** Le mot
« pilot » a deux emplois disjoints dans le corpus, et l'entrant n'en vise qu'un.

- **Nom de dépôt** (ce que le renommage change) : **30 occurrences de `forge-pilot` dans 12
  fichiers vivants** — `README.md` 8 · `AGENTS.md` 4 · `PROMPT-PRODUIT.md` 4 ·
  `BOUCLE-AMELIORATION.md` 3 · `oracles\self-test.mjs` 2 · `CLAUDE.md` 1 ·
  `CONTRAT-INTERFACE.md` 1 · `REGLES-PROJET.md` 1 · `fiches\pilot.md` 1 ·
  `references\ACCUEIL.md` 1 · `references\RUN-VERSION.md` 1 · `todo\normaliser-lot.mjs` 1.
  Commande : `git grep -I -o -w forge-pilot` avec exclusion de l'histoire.
- **Rôle** (ce que le renommage ne change pas) : les ~337 occurrences restantes du mot
  « pilot » désignent une fonction, pas un dépôt — `CLAUDE.md` « **organization organise, pilot
  pilote** », `README.md` l.205 « le pilot est le seul conducteur », `catalogues\catalogue.jsonl`
  l.1 `"ecrivain": "pilot"`. L'entrant ne demande pas de renommer le rôle, et rien dans TF-0346
  ne l'implique.

Cette partition est la condition de décidabilité du critère de fin exigé par l'entrant : « zéro
occurrence vivante non justifiée » est **indécidable** sur 367 occurrences et **vérifiable** sur
30. Elle doit donc être posée avant la bascule, pas après (§4, fenêtre A).

**P1 — l'identité publiée.** Le nom GitHub, le remote, et les 27 occurrences vivantes de l'URL
`https://github.com/iguane39/digit-ai-forge-pilot` ou du segment de dépôt : `README.md` 8 (dont
les 7 prompts d'usage l.95-144), `AGENTS.md` 4 (dont le clone de secours l.13-14),
`PROMPT-PRODUIT.md` 4 (dont la voie de bootstrap l.21-22), le reste en prose.

**P2 — le nom du DOSSIER local et ce qui s'y indexe.** Distinct de P1 : GitHub ignore le nom du
dossier, et le poste ignore le nom GitHub. Trois indexations mesurées hors dépôt (§4).

**P3 — les identifiants et les listes blanches.** `pilot/catalogue@1`, `pilot/fraicheur-claims@1`,
les clés `versions_forges` des ledgers produits, et la liste blanche d'entrants
`todo\normaliser-lot.mjs` l.44-48.

**P4 — les consommateurs sous garde-fou d'écriture.** Les 14 frères (48 occurrences) et les
produits (9 occurrences vivantes, 3 fichiers, 1 produit — Produit-10), qu'aucune écriture du pilot ne
peut toucher hors mandat humain.

**P5 — la preuve de fin, et l'histoire qui ne se réécrit jamais.**

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Étude 20260817h sur le même objet | `output\03-etudes\20260817-etude-opportunite-renommage-factory.md` §5 : « O2 — renommage de présentation seule » (son verdict) | **recouvre le « faut-il », pas le « comment »** : 20260817h chiffre le périmètre et n'ordonne aucune séquence ; sa seule prescription de séquencement est le gate `gh repo rename`, reprise ici en GATE n°2 |
| Doctrine de non-réécriture de l'histoire | `BOUCLE-AMELIORATION.md` l.384-386 : « l'HISTOIRE n'est pas réécrite (ledgers, TODO.jsonl, entrées passées de ce journal, livrables datés d'output\) : le mot "steering" y reste un fait d'époque » | **recouvre — et définit « justifiée »** : la doctrine existe déjà, mot pour mot, pour l'ancien renommage ; le critère de fin de TF-0346 s'y adosse au lieu d'inventer sa propre exclusion (§4, fenêtre C) |
| Précédent de séquencement D-14 | `BOUCLE-AMELIORATION.md` l.379-386 : « Dépôt GitHub renommé (`digit-ai-forge-pilot`, l'ancien nom redirige), dossier local renommé avec **jonction de compatibilité** » | **recouvre — c'est le seul précédent exécuté sur cet objet** ; sa séquence est connue et son mode de défaillance mesuré (ligne suivante) |
| Item de rattrapage du précédent | `todo\TODO-ARCHIVE.jsonl`, TF-0062 : `{"ev":"maj","ts":"2026-08-11T13:54:28Z","id":"TF-0062","statut":"archive"}` — sans `gains_constates`, `date_correction` ni `corrections_realisees`, contre `references\TODO-FORGE.md` l.47 « gains_constates exigés à la clôture » | **recouvre — et donne le mode de défaillance à éviter** : la fenêtre de rattrapage a été *classée* et non *faite* ; d'où la fenêtre C bornée par une mesure exécutable, pas par une date (§4) |
| Dette du précédent, déjà candidate | `todo\TODO.jsonl`, TF-0332 `statut: candidat`, « Solder la dette de traçabilité D-14 : trois affirmations de conformité fausses au corpus » | **recouvre** : la dette n'a pas à être re-instruite ici ; elle devient une **tâche de la fenêtre A** (§4, O1) pour que le corpus ne porte jamais deux renommages non soldés en même temps |
| Affirmation de conformité de D-14 | `REGLES-PROJET.md` l.131 : « \| D-14 `forge-steering` → `forge-pilot` \| répercuté partout (bootstrap, README, schéma) \| constatée \| » | **recouvre — et se contredit** : `references\RUN-VERSION.md` l.11 porte encore la consigne de rattraper `digit-ai-forge-steering`, donc « répercuté partout » est faux au moment où on s'apprête à ajouter un troisième nom |
| Garde-fou d'écriture chez les frères | `CLAUDE.md` §Garde-fous : « **Aucune écriture dans les dépôts frères** hors mandat humain (boucle mandatée, journalisée) » | **recouvre — et impose la fenêtre C** : les 48 occurrences des frères ne peuvent pas être dans la même fenêtre que le pilot, quelle que soit la séquence choisie |
| Garde-fou d'écriture chez les produits | `CLAUDE.md` §Garde-fous : « **Produits autonomes** : le pilot n'y intervient que sur run demandé » | **recouvre** : les 9 occurrences vivantes de Produit-10 relèvent de son prochain run de version, pas d'une campagne du pilot |
| Loi des référentiels à identifiants | `CONTRAT-INTERFACE.md` §3 bis : « une évolution qui déplace ou retire des identifiants **embarque** une table de correspondance versionnée (`ancien_id → nouvel_id \| retiré`), et les consommateurs refusent un artefact dont… » | **recouvre — et impose un ORDRE** : « embarque » exclut la table écrite après coup ; la table est donc un livrable de la fenêtre A, avant tout déplacement (§4) |
| Forme canonique des clés de ledger | `CONTRAT-INTERFACE.md` §3 (TF-0320) : « la forme CANONIQUE des clés est le nom de dépôt COMPLET » ; contrôle exécutable `oracles\oracle-conformite-projet.mjs` l.427 `RE_CLE_DEPOT = /^digit-ai-forge-[a-z0-9_-]+$/`, appliqué l.452 | **recouvre — et c'est le contrôle qui arbitre le NOM** : la clé `versions_forges` du pilot suit obligatoirement le nom du dépôt ; le motif exigé commence par `digit-ai-forge-` (voir GATE n°1, §4) |
| Clé déjà émise par un produit | `_Client-A\Produit-10\forge\ledger.jsonl` : `versions_forges` contient la clé `digit-ai-forge-pilot` (14 clés complètes) | **recouvre** : un consommateur a déjà écrit la clé complète ; la table de correspondance de la fenêtre A doit la couvrir explicitement |
| Résolution de la racine des forges | `bootstrap.mjs` l.49-50 : `iRacine >= 0 ? args[iRacine + 1] : process.env.FORGE_ROOT \|\| dirname(ICI)` ; liste `FORGES` l.19-45 = 14 entrées, aucune n'étant le pilot | **ne recouvre pas — et c'est ce qui rend P2 peu coûteux** : la racine se déduit du PARENT du dépôt, jamais de son nom ; `bootstrap.mjs` ne cherche jamais un dossier nommé d'après le pilot |
| Balayage des dépôts par préfixe | `oracles\oracle-skills.mjs` l.184, l.203, l.453 : `if (!depot.isDirectory() \|\| !depot.name.startsWith("digit-ai-forge-")) continue;` | **ne recouvre pas aujourd'hui, piège latent** : vérifié le 17/08, le pilot n'a **aucun** dossier `.claude\` (ni skill, ni hook, ni `settings.json` versionné) — les 3 balayages ne voient donc rien de lui ; un nom hors préfixe rendrait cette absence définitive et silencieuse le jour où le pilot versionnerait un skill |
| Raccourci de chemins du noyau | `CLAUDE.md` §Chemins : « `c:\dev\digit-ai-forge-*` se lit `<racine>\…` » | **touché — et c'est un enjeu de GATE n°1** : le raccourci couvre le pilot tant que son nom reste dans `digit-ai-forge-*` ; hors préfixe, tout chemin vers lui s'écrit en entier dans un noyau plafonné à 6 Ko |
| Liste blanche des entrants | `todo\normaliser-lot.mjs` l.44-48 : `const FORGES = [ … "digit-ai-forge-pilot", "pilot" ]` | **recouvre — et impose « élargir, jamais remplacer »** : des lots produits antérieurs au renommage continueront d'arriver dans `input\00-retours\` ; la liste doit accepter les deux noms pendant toute la fenêtre C |
| Fixtures d'auto-test des oracles | `oracles\self-test.mjs` l.321 et l.356 : `versions_forges: { "digit-ai-forge-pilot": "e0ffc25" }` | **touché** : deux fixtures VERTES embarquent le nom ; elles basculent ROUGE si le nom cible ne satisfait plus `RE_CLE_DEPOT` (GATE n°1) |
| Gabarits produits : chemin vers le pilot | `gabarits\CLAUDE-PRODUIT.md` l.31, `gabarits\docs-projet\ARCHITECTURE.md` l.14, `MODELE-DONNEES.md` l.14, `TODO-PRODUIT.md` l.11 — tous en jeton `<pilot>` ; relevé `git grep -I -o -E 'FORGE_ROOT[\\/>]{1,3}digit-ai-forge-pilot'` → **0** | **ne recouvre pas — et c'est un gain acquis** : les gabarits n'ont jamais figé le segment de dossier ; aucun produit né après le renommage n'héritera du défaut, contrairement à D-14 |
| Outil de campagne multi-dépôts | `gabarits\AGENT-CAMPAGNE.md` l.13-14 : « Tu écris UNIQUEMENT dans le dépôt cible désigné par ton prompt. Tous les autres dépôts (forges sœurs, pilot, produits, missions) sont en LECTURE SEULE » | **recouvre — c'est l'outil de la fenêtre C** : la forme d'exécution du rattrapage des 14 frères existe déjà, elle ne s'invente pas |
| Forme du mandat transverse | `references\RUN-MANDAT.md` l.1-7 : « Run de mandat transverse — quand le livrable est un document, pas un logiciel » | **recouvre** : le rattrapage des frères est un mandat documentaire ; sa forme (socle, ledger, oracles, nommage R-4) est déjà encodée |
| Consigne de rattrapage au run de version | `references\RUN-VERSION.md` l.11-13 : « Au rattrapage, corriger aussi les **références `digit-ai-forge-steering`** … la jonction de compatibilité ne se supprime qu'une fois tous les produits du poste rattrapés » | **recouvre — et se répète** : le mécanisme de rattrapage produit existe ; la fenêtre C le **remplace** au lieu de le dupliquer (une consigne à deux renommages successifs n'est pas exécutable) |
| Fondement des gates humains | `REGLES-PROJET.md` l.181-182 : « Les gates déjà en place (GO production, mandats humains) priment toujours sur R-29 » | **recouvre — et fonde GATE n°2** : la voie automatisée par défaut (R-29) ne s'applique pas au geste irréversible |
| Indexation hors dépôt de la mémoire de sessions | `~\.claude\projects\c--dev-digit-ai-forge-pilot\` : **10 transcriptions, 108 Mo**, répertoire nommé d'après le chemin de travail translittéré | **ne recouvre pas — aucun document du corpus n'en parle** : c'est la surface que le renommage du DOSSIER touche et que ni D-14 ni 20260817h n'ont instruite (§4, P2) |
| Réglages installés du poste | `~\.claude.json`, clé `projects./c:/dev/digit-ai-forge-pilot` : `allowedTools` 0 · `mcpServers` 0 · `hasTrustDialogAccepted` false · `projectOnboardingSeenCount` 0 · `hasClaudeMdExternalIncludesApproved` false | **ne recouvre pas — et le risque redouté est mesuré nul** : l'entrée existe mais est **vide** ; le renommage du dossier coûte au pire une boîte de confiance à revalider, aucun réglage perdu |
| Hook installé du poste | `~\.claude\hooks\qo-gate-write.mjs` l.129 : `[runner, cible, '--profil', 'digit-ai', '--niveau', 'note']` — aucun chemin `digit-ai-forge-pilot` | **ne recouvre pas** : le seul hook installé ne porte aucun chemin vers le pilot (`grep -i -E 'digit-ai\|c:.dev'` → 1 ligne, celle-ci) |
| Chemins absolus vers le pilot | `git grep -n -I -i -e 'c:\dev\digit-ai-forge-pilot' -e 'c:/dev/digit-ai-forge-pilot'` (hors histoire) → **0** ; même relevé sur `_Client-A`, `Produit-10`, `VCA`, `BeefProject` → **0** | **ne recouvre pas** : aucun chemin absolu vers le pilot n'existe ni dans le pilot ni chez les produits — la jonction de compatibilité de D-14 n'avait déjà plus de consommateur mesurable |
| Segment de dossier figé chez un produit | `_Client-A\Produit-10\CLAUDE.md` l.40 `node <FORGE_ROOT>\digit-ai-forge-pilot\oracles\oracle-conformite-projet.mjs .` ; `docs\projet\COMMANDES.md` l.39, l.46, l.47 (même forme) | **recouvre — c'est le SEUL consommateur mesuré du nom de dossier** : 4 lignes de commande documentées dans 1 produit autonome, à traiter en fenêtre C |
| Surfaces GitHub non redirigées | `gh repo view iguane39/digit-ai-forge-pilot --json name,description,visibility,hasWikiEnabled,homepageUrl` → `{"hasWikiEnabled":false,"homepageUrl":"","visibility":"PUBLIC","name":"digit-ai-forge-pilot"}` ; aucun `.github\workflows` au pilot ; aucun workflow des 3 frères qui en ont ne cite `iguane39/digit-ai-forge-pilot` | **ne recouvre pas — les deux exceptions de GitHub sont inertes ici** : ni Actions, ni site de projet, ni wiki (§3 et §4) |

## 3. État de l'art daté

Cinq sources datées, plus la contrainte de fournisseur qui gouverne la fenêtre de transition.
Le corpus externe applicable n'est **pas** une littérature sur les noms de dépôts — il n'en existe
pas d'utilisable pour un écosystème privé de 15 dépôts sur un poste — mais une littérature sur le
**séquencement d'un changement cassant**, dont le transfert est partiel et se dit ici.

1. **GitHub Docs, *Renaming a repository*** — consultée le **2026-08-17**,
   `https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository`.
   Redirigé : « all `git clone`, `git fetch`, or `git push` operations targeting the previous
   location will continue to function as if made on the new location », ainsi que *issues, wikis,
   stars, followers* et le trafic web. **Non redirigé** : « GitHub will not redirect calls to an
   action hosted by a renamed repository. Any workflow that uses that action will fail with the
   error `repository not found` », et les URL de site de projet. Réserve **dure** : « If you create
   a new repository under your account in the future, do not reuse the original name of the renamed
   repository. If you do, redirects to the renamed repository will no longer work. »
   Recommandation : « we strongly recommend updating any existing local clones to point to the new
   repository URL » via `git remote set-url origin NEW_URL`.
2. **GitHub CLI, manuel `gh repo rename`** — consulté le **2026-08-17**,
   `https://cli.github.com/manual/gh_repo_rename`. Usage `gh repo rename [<new-name>] [flags]`,
   drapeaux `-R/--repo`, `-y/--yes`. **Fait négatif à consigner** : la page ne documente pas si la
   commande met à jour le remote local. Conséquence opposable pour la fenêtre B : ne pas le
   supposer — vérifier par `git remote -v` et poser `git remote set-url` explicitement.
3. **« Learning Notes #46 — Expand Contract Pattern »**, parottasalna.com, **2025-01-08**,
   `https://parottasalna.com/2025/01/08/learning-notes-46-expand-contract-pattern-refactor-pattern/`.
   Séquence en trois temps : *expand* (ajouter le nouveau sans retirer l'ancien), *migrate*
   (basculer les consommateurs), *contract* (retirer l'ancien une fois seulement les consommateurs
   passés).
4. **« Database Migrations Without Drama: Expand/Contract in Practice »**,
   blogs.reliablepenguin.com, **2025-11-16**,
   `https://blogs.reliablepenguin.com/2025/11/16/database-migrations-without-drama-expand-contract-in-practice`.
   Propriété visée : « every step is independently deployable and independently reversible » ; le
   renommage direct est décrit comme le cas d'école du changement à ne pas faire d'un bloc.
5. **Précédent interne mesuré, D-14** — `BOUCLE-AMELIORATION.md` l.379-386, geste du **2026-08-09**,
   dette relevée 8 jours après : `REGLES-PROJET.md` l.131 déclare « répercuté partout » pendant que
   `references\RUN-VERSION.md` l.11 porte encore la consigne de rattrapage, et TF-0062 est passé à
   `archive` sans un champ de clôture. C'est la source la plus applicable des cinq : même objet,
   même poste, même geste.
6. **Étude 20260817h** — `output\03-etudes\20260817-etude-opportunite-renommage-factory.md`,
   **2026-08-17**, PASS 7/7 : fournit le chiffrage du périmètre, réutilisé ici sans être refait.

**Ce qui transfère du patron expand/contract, et ce qui ne transfère pas.** Transfère : les trois
temps, et la règle « ne retirer l'ancien qu'après bascule prouvée des consommateurs » — c'est
exactement ce que D-14 a manqué. Ne transfère pas : l'écriture double. Un dépôt ne porte qu'un nom
à la fois ; il n'y a pas de phase où l'ancien et le nouveau coexistent **par notre fait**. La phase
*expand* est ici **fournie par le fournisseur** : la redirection GitHub EST la coexistence, elle est
gratuite, elle démarre au geste et elle ne s'éteint que si l'on réutilise l'ancien nom. Cette
asymétrie a une conséquence de séquencement précise : ce qui doit être préparé AVANT le geste n'est
pas la compatibilité des URL (GitHub la donne) mais la compatibilité des **identifiants** et des
**listes blanches**, que GitHub ne redirige pas.

## 4. Options — jeu fermé O0-O4

Les options sont des **séquences d'exécution** du renommage décidé, pas des alternatives à la
décision. Elles se jugent sur trois critères mesurables : (a) existe-t-il un état intermédiaire où
une casse est diagnosticable ; (b) la table de correspondance §3 bis est-elle écrite avant le
déplacement des identifiants, comme « embarque » l'exige ; (c) le critère de fin est-il vérifiable
par une commande.

### Les deux gates humains, communs à toute séquence qui renomme

**GATE HUMAIN n°1 — confirmation du nom cible.** Placé à la **fin de la fenêtre de préparation**,
avant tout geste. Ce que l'humain confirme n'est pas un goût mais un motif : le nom cible proposé
par TF-0346 est `digit-ai-factory`, qui **sort du motif `digit-ai-forge-*`**. Voici, mesuré, ce que
ce choix change par rapport à la variante préfixée `digit-ai-forge-factory` :

| Site mesuré | Avec `digit-ai-forge-factory` | Avec `digit-ai-factory` |
|---|---|---|
| `oracles\oracle-conformite-projet.mjs` l.427 `RE_CLE_DEPOT = /^digit-ai-forge-[a-z0-9_-]+$/`, appliqué l.452 aux clés `versions_forges` des ledgers **produits** | inchangé : la clé `digit-ai-forge-factory` satisfait le motif | **contrôle en échec** : la clé `digit-ai-factory` ne satisfait pas le motif ; l.427 et l.430 (`cleCanonique`, qui proposerait `digit-ai-forge-factory`) à reprendre, plus la doctrine `CONTRAT-INTERFACE.md` §3 |
| `oracles\self-test.mjs` l.321 et l.356 (fixtures VERTES portant la clé) | 2 chaînes à mettre à jour, fixtures restent vertes | 2 chaînes **et** l'élargissement de l.427 : sans lui, une fixture verte devient rouge — un auto-test cassé par le renommage |
| `oracles\oracle-skills.mjs` l.184, l.203, l.453 (`startsWith("digit-ai-forge-")`) | inchangé | le dossier du pilot sort des 3 balayages ; **inerte au 17/08** (aucun `.claude\` versionné au pilot, vérifié) mais définitivement silencieux ensuite |
| `CLAUDE.md` §Chemins, raccourci `c:\dev\digit-ai-forge-*` | le raccourci couvre encore le pilot ; noyau inchangé | le pilot sort du raccourci : chaque chemin vers lui s'écrit en entier, dans un noyau plafonné à 6 Ko (`oracle-claude-md.mjs`) |
| `bootstrap.mjs` l.49-50 (`dirname(ICI)`) et liste `FORGES` l.19-45 | inchangé | **inchangé** : la racine se déduit du parent, le pilot n'est pas dans `FORGES` |
| `_Client-A\Produit-10\forge\ledger.jsonl` (clé `digit-ai-forge-pilot` déjà émise) | correspondance directe dans la table §3 bis | correspondance **plus** une exception de doctrine à écrire, sinon le prochain `run_open` de Produit-10 échoue sur R-19 |

Solde chiffré de GATE n°1 : `digit-ai-forge-factory` coûte **0 site de code supplémentaire** ;
`digit-ai-factory` coûte **4 sites de code** (`oracle-conformite-projet.mjs` ×2 lignes,
`self-test.mjs` ×2 fixtures) **+ 2 lignes de doctrine** (`CONTRAT-INTERFACE.md` §3, `CLAUDE.md`
§Chemins) et rend silencieux 3 balayages de `oracle-skills.mjs`. L'entrant nomme
`digit-ai-factory` : le gate consiste à payer ces 6 sites en connaissance de cause, ou à retenir la
variante préfixée. **Deuxième objet du même gate** : confirmer que le mot « pilot » **comme rôle**
reste (P0 — 337 occurrences, dont « organization organise, pilot pilote » au noyau) ; sans cette
confirmation, le critère de fin n'est pas décidable.

**GATE HUMAIN n°2 — le geste.** `gh repo rename` (et `gh repo edit` si la description suit) lancé
par **l'humain seul**, jamais par un agent. Fondement : `REGLES-PROJET.md` l.181-182 (« les gates
déjà en place — GO production, mandats humains — priment toujours sur R-29 ») ; motif :
l'irréversibilité pratique de la réserve GitHub (réutiliser l'ancien nom éteint définitivement les
redirections, GitHub Docs 2026-08-17) sur un dépôt **PUBLIC** (`gh repo view` → `"visibility":"PUBLIC"`).
Le pilot prépare la commande exacte, l'inventaire figé et la liste de vérifications ; il ne
l'exécute pas.

### Comportement pendant la fenêtre de transition

- **Ce qui continue de fonctionner sans intervention** : les 27 occurrences vivantes de l'URL et du
  segment de dépôt (P1), dont les 7 prompts d'usage du `README.md` l.95-144, le clone de secours
  d'`AGENTS.md` l.13-14 et la voie de bootstrap de `PROMPT-PRODUIT.md` l.21-22 — GitHub redirige
  `clone`/`fetch`/`push` et le trafic web (source 1). Ces 27 sites sont donc **non urgents** : ils
  se corrigent pour la justesse du corpus, pas pour éviter une panne.
- **Ce qui ne serait pas redirigé, et se trouve inerte ici** : les références d'Action GitHub
  (`repository not found`) et les URL de site de projet. Mesuré : pas de `.github\workflows` au
  pilot, `hasWikiEnabled: false`, `homepageUrl: ""`, et aucun des 3 frères qui ont des workflows ne
  cite `iguane39/digit-ai-forge-pilot`. **Aucune des deux exceptions ne s'applique.**
- **Ce que GitHub ne redirige jamais parce que cela ne lui appartient pas** : les identifiants (P3).
  `RE_CLE_DEPOT`, les clés `versions_forges`, la liste blanche de `normaliser-lot.mjs`.
- **Le remote local** : `git remote set-url` recommandé par la source 1 ; comportement de
  `gh repo rename` sur le remote non documenté (source 2) — donc `git remote -v` vérifié après le
  geste, sans supposition.

### Le nom du DOSSIER local : doit-il changer, et qu'est-ce que cela casse

**Réponse : oui, dans la même fenêtre que le remote — et le coût réel est l'inverse de celui qu'on
redoute.** Ce qui est mesuré, le 17/08 :

- **Ne casse rien** : `bootstrap.mjs` résout la racine par `dirname(ICI)` (l.49-50) et ne cherche
  jamais un dossier nommé d'après le pilot (liste `FORGES` l.19-45, 14 entrées) ; **zéro** chemin
  absolu `c:\dev\digit-ai-forge-pilot` dans les fichiers versionnés du pilot comme chez les
  produits (deux `grep` vides, §2) ; le seul hook installé du poste
  (`~\.claude\hooks\qo-gate-write.mjs`) ne porte aucun chemin vers le pilot ; les gabarits produits
  utilisent le jeton `<pilot>` et **zéro** segment `<FORGE_ROOT>\digit-ai-forge-pilot`.
- **Casse, mesuré n°1 — la mémoire de sessions.** `~\.claude\projects\c--dev-digit-ai-forge-pilot\`
  contient **10 transcriptions, 108 Mo**, et ce répertoire est nommé d'après le chemin de travail
  translittéré. Depuis un dossier renommé, `--continue` et `--resume` ne voient plus rien : les
  fichiers restent sur le disque, l'index ne les trouve plus. **Traitement** : avant la première
  session dans le nouveau dossier, **copier** (ne pas déplacer) le répertoire vers
  `c--dev-digit-ai-factory\` — l'histoire ne se réécrit pas, la doctrine de
  `BOUCLE-AMELIORATION.md` l.384-386 vaut aussi pour la mémoire de sessions. Coût : 108 Mo.
- **Casse, mesuré n°2 — rien dans les réglages installés.** `~\.claude.json`, clé
  `projects./c:/dev/digit-ai-forge-pilot` : `allowedTools` 0, `mcpServers` 0,
  `hasTrustDialogAccepted` false, `projectOnboardingSeenCount` 0. L'entrée est **vide**. Le
  renommage du dossier coûte au pire une revalidation de confiance ; **il n'y a aucun réglage à
  migrer**. Ce point est celui que l'intuition surestime le plus : il est chiffré à zéro.
- **Casse, mesuré n°3 — 4 lignes de commande chez un produit.** `_Client-A\Produit-10\CLAUDE.md` l.40 et
  `docs\projet\COMMANDES.md` l.39/46/47 ont **développé** le jeton en segment de dossier :
  `node <FORGE_ROOT>\digit-ai-forge-pilot\oracles\…`. Ces 4 lignes pointent vers un répertoire
  inexistant après renommage. Produit-10 est un produit autonome : fenêtre C.

**Décision de séquencement sur la jonction de compatibilité : ne pas en créer.** Motif opposable, et
c'est la leçon exacte de D-14 : la jonction du 09/08 avait pour rôle de tenir ce même genre de
lignes ; elle a rendu la défaillance **silencieuse**, elle a disparu du poste avant que le
rattrapage soit prouvé (`references\RUN-VERSION.md` l.13 ordonnait de ne la supprimer qu'après), et
TF-0062 a pu être archivé sans un champ de clôture. Sans jonction, le seul consommateur mesuré (4
lignes documentaires, 1 produit) échoue **fort et tout de suite** au premier appel, ce qui déclenche
la fenêtre C au lieu de la dispenser. La béquille est remplacée par la mesure : le `grep` du critère
de fin, rejouable par quiconque, est ce que la jonction n'a jamais été.

### Critères de fin, mesurables

1. **`bootstrap.mjs --pull` vert sur poste nu.** Définition de « poste nu » : clone du pilot dans un
   répertoire parent vide, `node bootstrap.mjs --pull --racine <parent vide>`, les 14 frères clonés
   et leur preuve trouvée (liste `FORGES` l.19-45), **exit 0** et aucun `[DEFAUT]`. Vaut aussi
   preuve que le nom du dossier n'entre pas dans la résolution.
2. **Zéro occurrence vivante non justifiée.** Mesure : `git grep -I -o -w forge-pilot` avec les
   exclusions d'histoire, attendu **0** hors la liste des justifications ci-dessous ; la mesure de
   référence est **30 occurrences dans 12 fichiers** (P0), relevée sur `949a69c` et **figée au
   GATE n°1** — la dérive constatée de +33 en 11 commits d'une journée interdit de comparer à un
   relevé plus ancien.
   **« Justifiée » se définit par énumération fermée, pas par appréciation** :
   - **a. L'histoire, jamais réécrite** — motif cité : `BOUCLE-AMELIORATION.md` l.384-386.
     `todo\TODO-ARCHIVE.jsonl` (47 occurrences de l'URL), `todo\TODO.jsonl`, `todo\TODO.html` (vue
     générée depuis la source), `output\**` (livrables datés, dont cette étude), `input\**`
     (entrants reçus : 6 lots portent l'URL), `runs\**`, `*.oracles.json` et `*.oracles-cache.json`,
     les entrées antérieures de `BOUCLE-AMELIORATION.md`, `insatisfactions\REGISTRE.jsonl`,
     `veille\**` et `references\temoin\**`, ainsi que les `forge\ledger.jsonl` des produits.
   - **b. Les traces du renommage lui-même** : l'entrée `D-xx` de `REGLES-PROJET.md` qui l'encode,
     la ligne du jour de `BOUCLE-AMELIORATION.md`, et la table de correspondance §3 bis. Un
     renommage doit se nommer quelque part.
   - **c. Les listes blanches d'entrants** : `todo\normaliser-lot.mjs` l.44-48 **doit** garder
     `"digit-ai-forge-pilot"` et `"pilot"` aussi longtemps qu'un lot antérieur peut arriver dans
     `input\00-retours\`. C'est un *contract* différé, pas un oubli — sa suppression est le dernier
     geste de la séquence, pas le premier.
   - **d. Les faits d'époque cités dans un document vivant** : une ligne comme
     `references\RUN-VERSION.md` l.11 se **reformule** en fait daté, elle ne se supprime pas.
   - **e. Le mot « pilot » comme rôle** (P0), si GATE n°1 le confirme : ~337 occurrences, hors
     périmètre par décision explicite et non par omission.
3. **Correspondances au ledger.** Le `run_open` de la fenêtre B porte `versions_forges` avec la clé
   **complète** du nouveau nom (`CONTRAT-INTERFACE.md` §3), et un événement
   `type: oracles_verdict` par oracle rejoué. La table de correspondance §3 bis est référencée au
   ledger et versionnée. Contrôle : R-19 de `oracles\oracle-conformite-projet.mjs`.
4. **Oracles rejoués, verdicts au journal (R-32, R-35).** `node oracles\self-tests.mjs` (les
   auto-tests d'abord — ce sont eux que les fixtures du nom cassent), puis
   `oracle-claude-md.mjs` (plafond 6 Ko), `oracle-catalogues.mjs` (identifiant `pilot/catalogue@1`),
   `oracle-fraicheur-doc.mjs` (`pilot/fraicheur-claims@1`), `oracle-ecosysteme.mjs`,
   `oracle-skills.mjs`, `oracle-boite-entree.mjs`, `oracle-conformite-projet.mjs`.
5. **Clôture sur gains constatés.** TF-0346 ne passe pas à `archive` : il passe à `corrige` avec
   `gains_constates`, `corrections_realisees`, `date_correction` et `version_forge_corrigee`
   renseignés (`references\TODO-FORGE.md` l.47). C'est l'interdit explicite de l'entrant, et c'est
   le mode de défaillance exact de TF-0062.

### Le jeu fermé

- **O0 — ne pas séquencer : tout en un jour, un seul lot** (geste GitHub + dossier + prose + 30
  sites du nom + identifiants + 14 frères + produit, dans une seule fenêtre, gates compris).
  *Coût du statu quo de cette option — c'est-à-dire ce que coûte l'absence de séquence* : les 48
  occurrences des 14 frères exigent chacune un **mandat humain d'écriture**
  (`CLAUDE.md` §Garde-fous) ; 14 mandats obtenus, exécutés et vérifiés dans une journée n'est pas
  un plan mais un pari, et les 9 occurrences de Produit-10 exigent en plus un run demandé par le
  produit. La table §3 bis serait écrite dans le même lot que le déplacement qu'elle documente, ce
  que « **embarque** » (`CONTRAT-INTERFACE.md` §3 bis) n'autorise pas. Surtout, un lot unique ne
  laisse **aucun état intermédiaire diagnosticable** : si un oracle tombe rouge, rien ne distingue
  la cause parmi cinq surfaces changées ensemble — c'est le mode de défaillance que la source 4
  décrit et que D-14 a réalisé.
  **O0 est réfutée.** Une propriété lui est cependant reprise et conservée dans la séquence
  retenue : la prose du pilot (les 30 sites du nom) se fait en **un seul lot contigu**, jamais
  étalée sur plusieurs jours — la dérive mesurée de +33 occurrences en 11 commits d'une seule
  journée rendrait sinon le critère de fin incomparable à sa mesure de référence.

- **O1 — séquence en trois fenêtres : préparer, basculer, rattraper** (*expand* fourni par la
  redirection GitHub, *migrate*, *contract*). ← **retenue, §5**
  - **Fenêtre A — préparation, aucun renommage, entièrement réversible.** (1) Solder la dette D-14
    en exécutant TF-0332 : corriger `REGLES-PROJET.md` l.131 (« répercuté partout » est faux),
    reformuler `references\RUN-VERSION.md` l.11 en fait daté, rouvrir la clôture de TF-0062 sans
    réécrire son histoire — pour que le corpus ne porte jamais deux renommages non soldés à la
    fois. (2) Produire la **partition P0 figée** : les 30 sites du nom, fichier par fichier, contre
    les occurrences de rôle. (3) Écrire la **table de correspondance §3 bis** avant tout
    déplacement : clés `versions_forges` (`digit-ai-forge-pilot → <nouveau nom complet>`, avec la
    clé déjà émise par Produit-10 couverte explicitement) et statut des deux identifiants de schéma —
    au choix du GATE n°1, `pilot/catalogue@1` et `pilot/fraicheur-claims@1` **gelés** comme espace
    de noms historique (coût 0 site, la table déclarant « inchangé, préfixe gelé ») ou versionnés en
    `@2` (coût 8 sites + 4 consommateurs : `oracle-catalogues.mjs` ×3, `generer-vues.mjs`,
    `oracle-fraicheur-doc.mjs` ×2, `fraicheur-claims.json`). (4) **Élargir** la liste blanche
    `todo\normaliser-lot.mjs` l.44-48 pour accepter les **deux** noms — c'est la seule vraie phase
    *expand* de notre fait. (5) Préparer la commande exacte du geste et la liste de vérifications.
    → **GATE HUMAIN n°1**.
  - **Fenêtre B — bascule, une seule session, un seul jour.** **GATE HUMAIN n°2** : l'humain lance
    `gh repo rename` seul. Puis, dans l'ordre : `git remote set-url` et vérification `git remote -v`
    (le manuel du CLI ne garantit rien, source 2) ; copie de
    `~\.claude\projects\c--dev-digit-ai-forge-pilot\` vers le nouveau nom translittéré ; renommage
    du dossier local, **sans jonction** ; les 30 sites du nom en un lot contigu ; les oracles
    rejoués et leurs verdicts au journal ; `bootstrap.mjs --pull` sur poste nu ; ledger et entrée
    `D-xx` au corpus. Réversibilité : tout est réversible sauf le geste du gate n°2, dont
    l'irréversibilité est bornée par le seul interdit « ne jamais réutiliser l'ancien nom ».
  - **Fenêtre C — rattrapage des consommateurs, bornée par une mesure et non par une date.**
    Les 14 frères sous **un** mandat humain d'écriture, en campagne
    (`gabarits\AGENT-CAMPAGNE.md`, périmètre d'écriture à un seul dépôt par agent), dans l'ordre
    d'exposition décroissante : `organization` (16 occurrences, 6 fichiers, dont une section
    entière `CLAUDE.md` l.47-51 qui **raconte** D-14 — elle se cite, ne se réécrit pas) ; `websec`
    (6, 2 fichiers) ; `agents-security` (5, 2) ; `tests` (3, 2 — dont
    `forge_tests\avancement.py` l.3 qui déclare une provenance datée, donc justifiée par le critère
    d.) ; puis les 9 frères à 2 occurrences chacun, où la surface est **une seule ligne** de
    `README.md` (le lien retour vers le catalogue). Vérification **par dépôt**, identique et
    exécutable : `git grep -I -o -i forge-pilot` → 0 hors justifications, `git status` propre, un
    commit en français, et le compte relevé avant/après consigné au journal de campagne. Les
    produits : **pas de campagne** — Produit-10 (9 occurrences vivantes, dont les 4 lignes de commande
    au segment de dossier) au **prochain run de version**, par la consigne existante
    `references\RUN-VERSION.md` l.11-13, qui est **remplacée** et non dupliquée : elle cesse de
    viser `digit-ai-forge-steering` pour viser le nom courant. Les 12 autres `CLAUDE.md` de
    produits ne citent pas le pilot et n'ont rien à rattraper.
    **Dernier geste de la séquence, et de lui seul dépend la fin** (*contract*) : retirer l'ancien
    nom de la liste blanche `normaliser-lot.mjs`, uniquement quand les critères 1 à 4 sont verts et
    qu'aucun lot au nom ancien n'est plus attendu.
  *Coût* : 3 fenêtres, 2 gates, 1 mandat de campagne, 1 consigne de run de version réécrite ; 30
  sites du nom au pilot + 48 chez les frères + 9 chez 1 produit + 6 sites de code si le nom sort du
  préfixe (GATE n°1) ; 108 Mo copiés. *Ce qu'elle exclut* : elle interdit de renommer avant que la
  table §3 bis existe, et interdit de clore avant la fenêtre C — donc elle interdit de déclarer
  « répercuté partout » le jour du geste, ce qui est précisément la faute de D-14.

- **O2 — séquence « le geste d'abord, la préparation ensuite »** : `gh repo rename` en premier
  jour, inventaire, table §3 bis et listes blanches produits après, en profitant de la redirection
  GitHub comme filet. *Coût* : le plus faible en apparence — un geste, puis du rattrapage au fil de
  l'eau. *Ce qu'elle exclut, et qui la disqualifie* : la table de correspondance écrite **après** le
  déplacement contredit « embarque » (`CONTRAT-INTERFACE.md` §3 bis) ; la liste blanche non élargie
  fait refuser tout lot produit portant l'ancien nom pendant l'intervalle, alors que 6 lots au nom
  ancien sont déjà en `input\` ; et si le nom cible sort du préfixe, `RE_CLE_DEPOT` fait échouer
  R-19 au premier `run_open` d'un produit avant que quiconque ait décidé de l'élargir. C'est la
  séquence de D-14, dont le résultat est mesuré (source 5).

- **O3 — séquence « dépôt et prose, dossier local inchangé »** : renommer GitHub, le remote, les 30
  sites du nom et les identifiants, mais **garder** le dossier `c:\dev\digit-ai-forge-pilot`.
  *Coût* : nul sur les trois surfaces de P2 — 0 Mo copié, 0 boîte de confiance, et les 4 lignes de
  Produit-10 continuent de fonctionner, donc la fenêtre C perd son seul poste urgent. *Ce qu'elle
  exclut* : elle installe durablement une divergence nom du dépôt / nom du dossier — exactement la
  situation que TF-0317 croyait décrire (« aujourd'hui `digit-ai-forge-steering` ») et qui avait
  été démentie. Elle exige alors d'écrire la divergence comme délibérée, faute de quoi un run
  futur la relit comme un défaut et la « corrige » sans mandat. Recevable seulement si GATE n°1
  choisit un nom **hors** préfixe et veut simultanément garder le pilot dans les 3 balayages de
  `oracle-skills.mjs` — c'est-à-dire comme conséquence d'un autre choix, pas comme séquence.

- **O4 — séquence différée : n'ouvrir la fenêtre A qu'après clôture prouvée de TF-0332.** *Contenu* :
  D-14 soldé, vérifié et clos sur `gains_constates` dans un premier run ; le renommage instruit dans
  un second. *Coût* : nul en dette, une fenêtre de délai. *Ce qu'elle exclut* : elle repousse une
  décision humaine déjà prise et déjà assumée par écrit, pour un bénéfice que O1 obtient sans délai
  en faisant du solde de D-14 la **première tâche** de sa fenêtre A — la sérialisation par run
  n'ajoute rien à la sérialisation par tâche, sauf l'attente.

## 5. Verdict

- **Option retenue** : O1 — séquence en trois fenêtres (préparer / basculer / rattraper).
- **Motif opposable** : les trois critères de jugement posés en tête de §4 sont tenus par O1 seule.
  (a) *État intermédiaire diagnosticable* : la fenêtre A ne renomme rien et est intégralement
  réversible ; la fenêtre B est bornée à une session et un seul lot de prose ; la fenêtre C est
  vérifiable dépôt par dépôt par une commande unique. (b) *Table §3 bis avant déplacement* : elle
  est un livrable de la fenêtre A, ce que « embarque » exige et que O2 viole. (c) *Critère de fin
  vérifiable* : la mesure de référence est figée à 30 occurrences dans 12 fichiers au GATE n°1, et
  « justifiée » est définie par une énumération fermée de cinq classes, pas par appréciation. À quoi
  s'ajoute le fait décisif de méthode : le renommage précédent sur ce même objet a échoué non par
  panne mais par **traçabilité** — trois affirmations de conformité fausses, un item de rattrapage
  archivé sans un champ de clôture, une jonction disparue avant preuve. O1 est la seule séquence qui
  place le solde de cette dette **avant** son propre geste, et qui remplace la béquille silencieuse
  (la jonction) par une mesure rejouable.
- **Coût** : trois fenêtres, deux gates humains, un mandat de campagne pour 14 dépôts, une consigne
  de run de version réécrite. Périmètre d'écriture : 30 sites du nom au pilot (12 fichiers) + 48
  chez les 14 frères (21 fichiers) + 9 chez 1 produit (3 fichiers) + 8 sites d'identifiants si le
  GATE n°1 les dégèle + 6 sites de code si le nom cible sort du motif `digit-ai-forge-*`. Hors
  dépôt : 108 Mo de mémoire de sessions copiés, zéro réglage à migrer (mesuré). **Dette créée** : un
  corpus à trois noms successifs (`steering` → `pilot` → cible), dont le porteur est l'entrée `D-xx`
  de la fenêtre B ; et la liste blanche `normaliser-lot.mjs` qui reste large jusqu'au dernier geste
  — dette **datée et mesurable**, contrairement à celle de D-14.
- **Candidature(s) émise(s)** : aucune candidature nouvelle. La présente étude n'écrit rien au
  registre (écrivain unique : le pilot, `references\TODO-FORGE.md` l.6). Elle propose deux
  mouvements au pilot : (1) TF-0346 passe en `decide` avec cette séquence pour plan, ses deux gates
  placés et ses cinq critères de fin ; (2) **TF-0332 est ordonnancé en préalable interne à la
  fenêtre A** de TF-0346 plutôt que traité séparément — sa clôture propre est la première preuve
  que la séquence sait clore. Aucun geste de renommage n'est autorisé par cette étude : GATE n°1
  n'est pas franchi.
- **Plan de revue** : première revue le **2026-08-24** (une semaine après la bascule, si elle a
  lieu), seconde le **2026-11-17** pour aligner sur la revue de 20260817h. Faits confrontés, dans
  cet ordre : (1) `node bootstrap.mjs --pull --racine <parent vide>` sur poste nu → exit 0 ?
  (2) `git grep -I -o -w forge-pilot` au pilot → 0 hors les cinq classes justifiées, et le compte
  des 30 sites soldé fichier par fichier ? (3) même relevé chez chacun des 14 frères → 0 hors
  justifications, et le mandat de campagne journalisé ? (4) TF-0346 est-il en `corrige` avec
  `gains_constates`, `corrections_realisees` et `date_correction` renseignés — ou a-t-il été
  archivé comme TF-0062 ? (5) la jonction absente a-t-elle produit une casse observée, et laquelle
  (c'est la mesure qui valide ou infirme la décision de ne pas en créer) ? (6) `oracle-skills.mjs`
  voit-il toujours le pilot, si le nom retenu est sorti du préfixe ? **Si (4) est faux, la séquence
  a reproduit exactement le défaut qu'elle prétendait éviter, et le constat se porte au journal des
  campagnes avant toute nouvelle décision de renommage.**
