---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-10-21
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: redacteur (famille sonnet)
arbitre: oracle-etude-opportunite PASS (10 règles E1-E10, version 1.2.0) ; oracle-ecriture sans FAIL, relevés le 2026-10-21
hypotheses_non_resolues: texte de la politique du client non lu (seul le résumé du lot Produit-73 est connu) ; relevé d'ouverture de Produit-73 non vu, donc les 10 artefacts qu'il cite ne sont pas nommés ; aucun essai de Claude Code avec les règles proposées (documentation lue, effet non joué) ; version de Claude Code du poste de Produit-73 inconnue ; pages de documentation sans date de publication (date de lecture seule) ; aucun standard ni guide tiers lu ; seul le poste courant est mesuré
---

# Étude d'opportunité — surcouche de permissions par produit que l'héritage préserve — 20261021a

Ce qui change pour vous : la surcouche demandée existe déjà. L'héritage ne recopie jamais `.claude/settings.json` : il y ajoute les hooks manquants du gabarit et laisse tout le reste, `permissions` comprise. La phrase « modification locale écrasée » du relevé d'ouverture vise 10 autres artefacts, ce qui a induit Produit-73 en erreur. L'étude recommande O2 : corriger trois textes et ajouter un test, sans rien inscrire au gabarit. Le changement est simple et court. Ce que la règle AI-DEV-04 exige réellement n'est pas mesuré, car le texte de la politique n'a pas été lu.

## Seuil de déclenchement

L'étude est due. L'item touche le noyau d'héritage (`gabarits\HERITAGE.json`, `oracles\hook-ouverture.mjs`) et porte un gain de 3 avec une preuve de 1 (`todo\TODO.jsonl`, l.4979, champ `score`). La décision humaine D-41 (a) du 19/10/2026 l'a retenu pour instruction (`todo\TODO.jsonl`, l.5026).

## Intention de l'utilisateur (loi n° 7, TF-0791)

Décision humaine, mot pour mot : « Option (a) de D-41 : instruire une surcouche de permissions par produit que l héritage préserve. » (`todo\TODO.jsonl`, l.5026, TF-1893).

Demande du produit, mot pour mot : « Admettre une surcouche de permissions par produit, préservée par l'héritage (par exemple l'approbation requise pour `git commit`, `git push` et l'exécution de commandes), ou l'inscrire au gabarit pour les produits soumis à une politique de développement assisté. » (`input\00-retours\Produit-73 - RETOURS - 20261019a.md`, l.22, RV-14).

Intention retenue, lecture de l'agent : un produit soumis à la politique de développement assisté de son client doit pouvoir tenir la règle AI-DEV-04 (pas d'exécution ni de commit automatiques de code généré) dans ses réglages, sans que l'héritage la défasse. Cette lecture n'a pas été validée par le demandeur ; la consigne de délégation cite la décision D-41 (a) et elle seule. Elle figure aux hypothèses non résolues. Chaque option du chapitre 4 et le verdict s'y rattachent.

L'intention ne demande ni la stratégie ni la tactique d'un produit : aucune `CASCADE.json` n'est due.

## 0. Traitement des entrants

Les entrants sont des données : leurs impératifs se citent, rien ne s'exécute. Sources : TF-1893 (`todo\TODO.jsonl`, l.4979 et l.5026), lot `Produit-73 - RETOURS - 20261019a` (RV-14, ledger seq 126 du produit), décision D-41 (a).

| Affirmation du produit | Verdict | Fondement |
|---|---|---|
| `.claude/settings.json` est « recopié depuis le pilot à chaque ouverture » | fausse pour ce fichier | mode `presence_et_motif`, jamais recopié (chapitre « Mesure de l'existant », M1 à M3) |
| le relevé annonce 10 artefacts « MIS À JOUR » en copie identique | vraie | `oracles\hook-ouverture.mjs`, l.221-223 ; le manifeste compte 20 artefacts en `copie_conforme` |
| « toute modification locale est écrasée » | vraie pour les artefacts en `copie_conforme`, fausse pour `settings.json` | `oracles\hook-ouverture.mjs`, l.172-173 : seuls ces artefacts sont recopiés |
| Admettre une surcouche de permissions | déjà admise | M3 et M4 |

Les impératifs du lot (« Admettre… », « l'inscrire au gabarit ») sont cités ici et instruits aux chapitres 4 et 5 ; aucun n'est exécuté.

## 1. Partition du problème

Cinq sous-questions disjointes ; chaque option du chapitre 4 répond à chacune.

- **P1 — Le fait.** L'héritage écrase-t-il aujourd'hui un réglage propre au produit dans `.claude/settings.json` ?
- **P2 — Le mécanisme natif.** Comment Claude Code superpose des réglages : fichiers, portée, précédence, fusion des listes.
- **P3 — L'exigence.** Ce que la règle AI-DEV-04 demande, et ce qu'un réglage de permissions peut en tenir ou non.
- **P4 — Le parc.** Ce que les produits portent aujourd'hui en réglages et en `settings.local.json`.
- **P5 — La gouvernance.** Qui écrit le contenu de la surcouche (le produit ou le pilot) et à partir de quel seuil le pilot s'en charge.

## Mesure de l'existant

Mesures du 2026-10-21, en lecture seule, depuis `C:\dev\digit-ai-factory`. Rien n'a été écrit chez un produit.

- **M1 — Mode déclaré.** `gabarits\HERITAGE.json` v1.36.0 porte 27 artefacts : 20 en `copie_conforme`, 2 en `presence_et_motif`, 4 en `presence`, 1 en `presence_et_motifs`. L'entrée `.claude/settings.json` (l.109-110) est en `presence_et_motif`, avec ce motif : « Le fichier est LÉGITIMEMENT personnalisé par chaque projet (permissions, serveurs MCP) : exiger une copie conforme mettrait en échec tout produit qui l'a adapté. »
- **M2 — Ce que le hook recopie.** `oracles\hook-ouverture.mjs`, l.149-153 : « SEULS les artefacts en mode `copie_conforme` sont touchés » ; l.173 : `if (a.mode !== "copie_conforme") continue;`. Les agents `.claude/agents/*.md` (5), `forge/hooks/factory.mjs`, `forge/RESTITUTION.md` et 13 autres pièces sont dans ce cas ; `settings.json` n'y est pas.
- **M3 — Ce que le hook fait à `settings.json`.** Deux gestes, tous deux chirurgicaux : `fusionnerHooksDuGabarit` (`oracles\lib-ouverture-async.mjs`, l.52-85, TF-1755 du 2026-10-15) ajoute les entrées de hook absentes ; `passerOuvertureEnAsync` (l.87-109, TF-1635 du 2026-10-13) passe l'ouverture en `async`. Le commentaire de tête (l.33-35) le dit : « Rien n'est retiré, rien n'est modifié : permissions, serveurs MCP, hooks du produit, délais qu'il a réglés restent intacts ». Le gabarit lui-même n'a que deux clés racine, `_commentaire` et `hooks` ; il ne porte aucune clé `permissions`.
- **M4 — Preuve rejouée.** Sur un faux `settings.json` du scratchpad portant `permissions` avec `ask` (`Bash(git commit *)`, `Bash(git push *)`), `deny`, `allow` et `defaultMode`, un appel à `fusionnerHooksDuGabarit` rend `corrige` avec 11 entrées de hook ajoutées ; `permissions` est identique avant et après (comparaison de la sérialisation JSON : `true`) ; une seconde passe rend `deja`. La recette du dépôt couvre le même sens, mais pour `allow` seulement (`oracles\hook-ouverture.test.mjs`, l.256-281 et l.306-340).
- **M5 — Le texte qui a induit en erreur.** `oracles\hook-ouverture.mjs`, l.221-223 : « 10 artefact(s) MIS À JOUR à l'instant depuis le pilot (mode "copie identique") » puis « Si l'un d'eux portait une modification locale, elle a été écrasée ». La phrase ne dit pas que `settings.json` est hors de cette liste. Autre source possible, non vérifiée : `references\ETAPES-RUN.md`, l.139 (« la RECOPIER à chaque ouverture de run », à propos de `RETOURS-FORGES.md`) puis l.147 (« Copier enfin `gabarits\settings-produit.json` → `.claude\settings.json` ») se lisent dans le même paragraphe, donc comme un geste répété.
- **M6 — Parc.** `C:\dev` compte 74 dossiers, dont 15 portent `forge\` (les produits). Parmi ces 15, 14 ont un `.claude\settings.json` ; aucun ne déclare de règle `allow`, `ask` ou `deny`, ni de `defaultMode`, ni d'exclusion `_hooks_factory_exclus` ; aucun n'a de `.claude\settings.local.json`. Sur l'ensemble des 74 dossiers, 10 portent un `settings.local.json` (tous hors des 15 produits) : 225 règles `allow` cumulées, 0 `ask`, 0 `deny`, 0 `defaultMode`. Seuls le nombre et la présence des clés ont été relevés, aucun contenu recopié.
- **M7 — Le fichier local n'est pas géré par l'héritage.** Aucun script du pilot ne l'écrit : `settings.local` n'apparaît que dans 3 oracles de lecture (`oracle-modeles-en-service.mjs`, `oracle-portee-doctrine.mjs`, `oracle-amorcage-poste.mjs`). Le `.gitignore` hérité ne le liste pas (motifs exigés de `HERITAGE.json`).
- **M8 — Natif.** Détaillé au chapitre 3. Points qui décident : la précédence va de `settings.local.json` (au-dessus) à `settings.json`, puis au fichier utilisateur ; les listes `permissions` des fichiers se combinent ; l'ordre d'évaluation est deny, puis ask, puis allow, quel que soit le fichier.
- **M9 — Limites du motif de commande.** La documentation donne `Bash(git push *)` comme règle qui ne couvre pas `git -C . push origin main` (page « Configure permissions », tableau « what a Bash rule doesn't match »). Une règle `ask` sur `git commit` est donc un garde-fou, non une preuve de conformité.
- **M10 — Mode de départ.** La page « Security » indique que le mode auto est le mode de départ des sessions interactives du terminal et de VS Code. Une exigence « pas d'exécution automatique » demande donc `defaultMode` et `disableAutoMode`, pas seulement des règles `ask`.

## 2. Non-recouvrement contre l'existant

Ce non-recouvrement se joue ligne à ligne : l'existant est cité, puis jugé.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Mode de `settings.json` au contrat d'héritage | `gabarits\HERITAGE.json`, l.110 et `motif` : « LÉGITIMEMENT personnalisé par chaque projet (permissions, serveurs MCP) » | recouvre : la surcouche demandée existe de droit |
| Fusion additive des hooks | `oracles\lib-ouverture-async.mjs`, l.33-35 : « Rien n'est retiré, rien n'est modifié : permissions, serveurs MCP… restent intacts » | recouvre : même garantie, déjà codée |
| Bornes du hook de recopie | `oracles\hook-ouverture.mjs`, l.149-153 : « SEULS les artefacts en mode `copie_conforme` sont touchés » | recouvre : `settings.json` est hors du périmètre de recopie |
| Recette de préservation | `oracles\hook-ouverture.test.mjs`, l.306-308 : « sans perdre ses hooks, ses permissions ni ses délais » | recouvre pour `allow` ; ne recouvre pas pour `ask`, `deny`, `defaultMode`, jamais testés |
| Phrase du relevé d'ouverture | `oracles\hook-ouverture.mjs`, l.223 : « elle a été écrasée » | ne recouvre pas : elle ne nomme pas les fichiers exclus |
| Consigne de copie au lancement d'un run | `references\ETAPES-RUN.md`, l.139 et l.147 | ne recouvre pas : la copie initiale et la recopie répétée se confondent à la lecture |
| Contenu de politique au gabarit | `gabarits\settings-produit.json` : clés racine `_commentaire` et `hooks` | ne recouvre pas : aucun gabarit de permissions n'existe |
| Hook qui refuse des commandes git | `gabarits\settings-produit.json`, hook `remisage` : refuse `git stash` nu, `pop`, `apply` sans SHA | ne recouvre pas : il vise la pile de remisage, non le commit ni le push |
| Push du produit sur GO humain | `references\ETAPES-RUN.md`, l.133 : « remote/push sur GO humain seulement » | recouvre pour le push ; ne recouvre pas pour le commit ni l'exécution |
| Classe voisine du registre | lot Produit-73, l.58 : « Voisine : `reglage-projet-ignore-par-la-forge` » | ne recouvre pas : elle vise un réglage lu trop tôt, non un réglage écrasé |

## 3. État de l'art daté

Cet état de l'art repose sur la documentation de l'éditeur de Claude Code, seule source qui définit la superposition de réglages. Ses pages ne portent pas de date de publication : la date est celle de la lecture, et la fraîcheur de moins de 24 mois relève de la revue. Aucun standard ni guide tiers n'a été lu.

- Claude Code, « Settings files and precedence », code.claude.com/docs/en/settings, lue le 2026-10-21. Sections « Settings precedence » (ordre : géré, ligne de commande, local au projet, projet partagé, utilisateur), « Lists merge instead of overriding » (« Claude Code combines the lists instead of picking one »), « Keep personal settings out of a repository » (le fichier local ne se commite pas).
- Claude Code, « Configure permissions », code.claude.com/docs/en/permissions, lue le 2026-10-21. « Rules are evaluated in order: deny, then ask, then allow » ; « if user settings allow a permission and project settings deny it, the deny rule blocks it » ; modes `default`, `auto`, `bypassPermissions` ; `disableAutoMode` et `disableBypassPermissionsMode` valables « in any settings file » ; tableau des limites d'une règle Bash.
- Claude Code, « Deploy managed settings », code.claude.com/docs/en/managed-settings, lue le 2026-10-21. Fichier `managed-settings.json` au niveau le plus haut, `C:\Program Files\ClaudeCode\` sous Windows ; un administrateur local peut l'éditer.
- Claude Code, « Security », code.claude.com/docs/en/security, lue le 2026-10-21. « Use project-specific permission settings for sensitive repositories » ; « Share approved permission configurations through version control » ; « Use managed settings to enforce organizational standards ».
- Pilot, `oracles\lib-ouverture-async.mjs`, état du 2026-10-15 (TF-1755), pour le comportement de la fusion.
- Pilot, `gabarits\HERITAGE.json` v1.36.0, état du 2026-10-18, pour le contrat de mode.

## 4. Options — jeu fermé O0-O4

Chaque option est décrite par son contenu, sa réponse aux cinq sous-questions, son coût, son retour arrière et ce qu'elle exclut.

- **O0 — ne rien faire.** Le produit garde `settings.json` tel quel et la phrase du relevé reste. **Réfutée** : le statu quo a un coût mesuré. Produit-73 a classé l'écart « majeur » (RV-14), TF-1893 est ouvert, et le lot propose de créer la classe `reglage-securite-produit-ecrase-par-heritage`, qui serait fondée sur un fait faux (M1 à M5). Un produit qui croit ses réglages écrasés renonce à les poser : la règle AI-DEV-04 resterait sans réglage. Coût : aucun travail, mais la méprise se reproduit chez tout produit soumis à une politique (P1, P5).
- **O1 — utiliser `settings.local.json`, que l'héritage ne recopie pas.** Vrai : aucun script du pilot ne l'écrit (M7) et il se place au-dessus de `settings.json` (M8). Contenu : le produit y pose ses règles `ask`. Ce qu'elle exclut : un réglage versionné. Le fichier reste hors du dépôt, donc absent de l'autre poste et des autres développeurs ; la documentation dit qu'on l'ajoute soi-même au `.gitignore` si on le crée à la main ; aucun des 15 produits n'en a un (M6) ; il ne figure pas dans le dépôt remis au client. Coût : complexité simple · durée court. Retour arrière : supprimer le fichier. Elle répond à P2 mais pas à P3 ni à P5 : une exigence de sécurité qui ne se commite pas ne se démontre pas.
- **O2 — le produit pose ses règles dans le `.claude/settings.json` versionné ; le pilot corrige ses textes et son test.** Contenu : (a) le produit écrit lui-même `permissions.ask`, `defaultMode` et `disableAutoMode` dans son fichier, que l'héritage préserve (M3, M4) ; (b) la phrase du relevé nomme les fichiers exclus de la recopie (`oracles\hook-ouverture.mjs`, l.221-223) ; (c) `references\ETAPES-RUN.md`, l.139-149, dit que la copie du gabarit est un geste de création, suivi d'une fusion en ajout seul ; (d) la recette de fusion ajoute un cas `ask`, `deny` et `defaultMode` (`oracles\hook-ouverture.test.mjs`, après l.340). Illustration à valider par le produit : `{"permissions":{"defaultMode":"default","disableAutoMode":"disable","disableBypassPermissionsMode":"disable","ask":["Bash(git commit *)","Bash(git push *)","PowerShell(git commit *)","PowerShell(git push *)"]}}`. Coût : complexité simple · durée court ; dette : un cas de test de plus. Retour arrière : annuler quatre modifications de texte et de recette. Ce qu'elle exclut : tout contenu de politique fourni par le pilot ; chaque produit rédige ses règles (P5).
- **O3 — inscrire un profil de permissions au gabarit.** Contenu : un second gabarit `settings-politique-dev-assiste.json`, une entrée de `HERITAGE.json`, et une fusion de `permissions` en ajout seul, armée par une déclaration du produit. C'est la seconde proposition du lot. Coût : complexité moyen · durée moyen ; dette : la fusion écrit dans un champ que le contrat tient pour personnel (M1) et qu'aucun produit n'a rempli (M6). Retour arrière : moyen, car chaque produit aurait reçu des règles à retirer de son dépôt. Ce qu'elle exclut : le principe « le produit rédige » (P5), sur la foi d'une seule demande.
- **O4 — un contrôle dur hors des règles de permission.** Contenu : un hook `PreToolUse` de la factory sur Bash et PowerShell, armé par un manifeste du produit, qui refuse ou fait confirmer `commit`, `push` et l'exécution, y compris sous les formes que les motifs ratent (`git -C . push`, M9) ; ou un `managed-settings.json` posé par le client sur les postes (chapitre 3). Coût : complexité complexe · durée long ; dette : un douzième hook à maintenir dans le lanceur. Retour arrière : retirer le hook du gabarit et du lanceur copié. Ce qu'elle exclut : la simplicité ; la voie `managed-settings.json` sort du pilot, qui n'écrit pas chez un poste ni chez un produit.

Le texte de la politique n'étant pas lu, on ne sait pas si l'exécution « automatique » vise aussi les hooks de la factory (`page-html`, `ecriture`, `reprise --pousser`). Ces hooks ne sont pas des appels d'outil et échappent aux règles de permission. Ce point oriente vers O4 s'il se confirme ; il est repris au plan de revue.

## 5. Verdict

- **Option retenue** : O2.
- **Coût** : complexité simple · durée court ; quelques lignes de texte et un cas de test, aucune dette de maintenance, aucun hook ni gabarit nouveau.
- **Candidature(s) émise(s)** : aucune écrite par cette étude (la consigne interdit de toucher à `todo\`). À émettre par l'orchestrateur : C1 corriger la phrase du relevé et le motif de l'entrée `settings.json` de `gabarits\HERITAGE.json` ; C2 ajouter le cas `ask`, `deny`, `defaultMode` à la recette de fusion ; C3 lever l'ambiguïté de `references\ETAPES-RUN.md`, l.139-149 ; C4 répondre à Produit-73 que la surcouche existe et lui proposer les règles de l'illustration, à poser par lui-même (seuls les produits se modifient eux-mêmes). La classe `reglage-securite-produit-ecrase-par-heritage` est à refuser au vu de M1 à M4.
- **Plan de revue** : 2026-11-18, confrontation aux faits : (a) après deux ouvertures de Produit-73, la clé `permissions` de son `settings.json` est intacte ; (b) le texte de la politique est lu et dit si les hooks de la factory sont visés, auquel cas O4 est rouverte ; (c) si au moins 2 produits déclarent une politique de développement assisté, O3 est rouverte.
- **Test rétro** : l'élément C1 (phrase du relevé) remonte à la tactique « lever la fausse croyance d'un écrasement », puis à la stratégie « un produit tient une exigence de sécurité propre sans que l'héritage la défasse », puis à l'intention citée ; C2 (cas de test) remonte à la tactique « rendre la préservation opposable pour les règles que la politique emploie », même chaîne ; C3 (ETAPES-RUN) ferme la voie d'écrasement par un geste d'agent, même chaîne ; C4 (réponse au produit) donne au demandeur de quoi agir. Aucune rupture. Un élément a été retiré faute de remontée : l'inscription d'un profil au gabarit (O3), qui sert la seconde proposition du lot mais non l'intention tant que la capacité existe déjà et qu'une seule demande la porte. Les questions du demandeur, rejouées : « peut-on admettre une surcouche de permissions préservée par l'héritage ? » oui, elle existe (M3, M4) ; « faut-il l'inscrire au gabarit ? » non pour l'instant, à rouvrir si 2 produits déclarent une politique.
