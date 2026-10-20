---
role: la fiche datée du jeton d'abonnement `claude setup-token` pour les tâches sans écran (commande, variable, priorité des identifiants, limites, réserves contractuelles), consignée sans être adoptée
sources_de_verite: [output/03-etudes/20261019-etude-opportunite-jeton-abonnement-taches-sans-ecran.md (étude 20261019b, option O2 retenue par la décision D-48 (a) du 19/10/2026 ; section 3 « État de l'art daté » : neuf sources d'Anthropic lues le 2026-10-19), oracles/oracle-depense-voie-par-defaut.mjs (R-34), REGLES-PROJET.md R-29 et R-34 et R-38]
verifie_le: 2026-10-19
revue_prevue: 2026-11-19
---

# Jeton d'abonnement `claude setup-token` : consigné, pas adopté

Ce que change ce document pour vous : la Factory n'a aucune tâche sans écran qui appelle un modèle, donc aucun
jeton n'est créé et aucune dépense n'est engagée. La fiche garde, datés, les faits qui coûteraient un aller-retour
le jour où une telle tâche apparaîtrait, et le critère qui rouvre la question. Elle découle de la décision humaine
D-48 (a) du 19/10/2026 (candidat TF-1921). Une règle de plateforme se périme sans avertir (loi transverse n° 4) :
chaque fait porte sa source, et la revue est fixée au 2026-11-19.

Provenance : les neuf sources ci-dessous sont des pages d'Anthropic lues le 2026-10-19 par l'étude 20261019b, non
relues pour cette fiche. Les mesures du poste de la section suivante ont été rejouées le même jour pour cette fiche.
Une page de documentation n'a pas de date de publication : la date est celle de la lecture. Ce n'est pas un avis juridique.

## Ce qui est établi

- **La commande et la variable.** `claude setup-token` génère « a one-year OAuth token » pour les pipelines d'intégration
  continue, les scripts et les environnements sans connexion par navigateur. Il n'est enregistré nulle part : on le copie
  dans la variable `CLAUDE_CODE_OAUTH_TOKEN`. Il exige un plan Pro, Max, Team ou Enterprise et « can only make model requests »
  (source 1).
- **La priorité des identifiants.** Le jeton passe au 5e rang, après `ANTHROPIC_API_KEY` au 3e. En mode non interactif
  (`claude -p`), la clé d'API est toujours employée quand elle est présente (source 1). Si `ANTHROPIC_API_KEY` est posée,
  Claude Code l'emploie à la place de l'abonnement, et la facturation passe à l'usage (source 8).
- **Le mode `--bare`.** Il ne lit aucun identifiant OAuth et exige une clé d'API. La documentation le recommande pour les appels
  scriptés et annonce qu'il deviendra le défaut de `-p` dans une version future (source 5). Le jour de ce changement, tout
  `claude -p` qui tourne sur la connexion du poste demandera une clé d'API.
- **Le quota.** L'usage d'un jeton est inclus dans l'abonnement et consomme les limites de 5 heures et hebdomadaire, partagées
  entre Claude et Claude Code. Le dépassement peut basculer sur des crédits d'usage mesurés, si le compte les a activés (sources 8 et 9).
- **Les routines.** Elles s'exécutent chez Anthropic, en aperçu de recherche, et consomment l'abonnement comme une session
  interactive ; elles exigent un dépôt GitHub cloné chez Anthropic, donc une exécution hébergée soumise à R-38 (source 7).
- **Le partage d'un secret.** Pour un secret partagé entre dépôts, la documentation de GitHub Actions conseille une clé d'API,
  car le jeton est lié à l'abonnement de la personne qui l'a créé ; supprimer un secret ne révoque pas l'identifiant qu'il contenait (source 6).

## Les trois réserves contractuelles

Elles tiennent à l'offre, pas au jeton. Aucune n'est tranchée ici.

1. Les Conditions grand public (Free, Pro, Max) interdisent l'accès par des moyens automatisés, « bot, script, or otherwise »,
   sauf par une clé d'API ou « where we otherwise explicitly permit it » ; la documentation du jeton le présente comme une voie
   prévue pour les scripts, ce qui plaide pour la permission explicite, mais cette lecture est la nôtre, non celle d'Anthropic (sources 1 et 3).
2. Les mêmes Conditions disent : « You agree that you will not use our Services for any commercial or business purposes ».
   Le compte Max du poste est personnel : un travail professionnel peut tomber sous cette clause (source 3). La question existe
   déjà pour chaque `claude -p` du poste, le jeton ne la change pas.
3. Les limites des plans Pro et Max supposent un usage « ordinary, individual », et Anthropic ne permet pas de faire passer l'usage
   d'un client par vos identifiants (source 2). La voie contractuellement nette pour un usage d'entreprise est un plan Team ou
   Enterprise, sous Conditions commerciales (source 4) : c'est une dépense, donc votre décision (R-29).

## État de la Factory au 2026-10-19

Le tableau donne ce qui a été mesuré sur le poste, sans appel de modèle et sans création de jeton ; le paragraphe qui le suit dit ce que la règle R-34 en tire.

| Mesure | Commande | Résultat |
|---|---|---|
| Version de la CLI | `claude --version` | 2.1.299 |
| La commande existe | `claude setup-token --help` | « Set up a long-lived authentication token (requires Claude subscription) » |
| Authentification du poste | `claude auth status` | `loggedIn: true`, `authMethod: claude.ai`, `apiProvider: firstParty`, `subscriptionType: max` (identifiants du compte non reproduits) |
| Clés ou jetons posés | variables `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN` | 0 sur 3 définie dans l'environnement du shell |
| R-34 sur le parc | `node oracles\oracle-depense-voie-par-defaut.mjs` | PASS, 186 fichiers lus, 0 porteur d'un appel payant |
| Fichiers qui lancent `claude -p` dans digit-ai-forge-agents | recherche du motif `claude` suivi de `-p` | 3 : `oracle-agent-evals.mjs`, `oracle-judge.mjs`, `oracle-lecture-tiers.mjs` |

Les mesures décrivent ce poste et ce profil, pas les autres postes ni le profil `~\.claude-b`.

**R-34 est tenue par absence, pas par contrôle.** Le motif `RE_APPEL_PAYANT` de `oracles\oracle-depense-voie-par-defaut.mjs`
(ligne 54) voit `ANTHROPIC_API_KEY` mais ne voit ni `CLAUDE_CODE_OAUTH_TOKEN` ni le lancement de `claude -p` : une clé d'API
qui entrerait dans l'environnement ferait facturer à l'usage chaque `claude -p`, sans que l'oracle le signale. Le jeton ne
l'assouplirait pas : un abonnement n'est pas une API payante au sens de `CLAUDE.md`. Élargir le motif demande une décision de
conception préalable, que l'étude pose sans la prendre : `oracle-judge.mjs` ligne 142 deviendrait un appel « au niveau module »
et ferait échouer DP1, alors qu'il s'invoque à la main. Ce chantier n'est pas ouvert ici.

## Le jeton n'est pas adopté

Décideur : l'humain, par sa réponse « 41a » du 19/10/2026 (D-48 (a)), consignée au registre `todo\TODO.jsonl` sous TF-1921
(événement `maj`, statut `decide`, date de décision 2026-10-19). Il a retenu l'option O2 de l'étude : consigner sans adopter.

Aucune tâche sans écran n'appelle un modèle ; le jeton serait créé pour rien. Aucun jeton n'est créé, aucun secret n'est
placé, aucun oracle n'est modifié.

## Critère de réouverture

La revue est fixée au 2026-11-19, ou à la première tâche sans écran qui appelle un modèle si elle arrive plus tôt.

- Le nombre de circuits hébergés ou de tâches planifiées qui portent un secret ou un `claude -p` (aujourd'hui 0 sans écran) :
  au moins 1 rouvre l'adoption du jeton (option O1) ou le passage par les routines (O4), instruites sur la mesure de cette tâche.
- Les sources 1, 2 et 3 se relisent à la revue, pour y repérer un changement de conditions (Conditions grand public
  en vigueur le 2025-10-08, Conditions commerciales le 2025-06-17).
- L'élargissement de R-34 à la CLI et au jeton (option O3) se rouvre avec le premier cas réel, après la décision de conception ci-dessus.

## Non résolu

- Le type de compte : le compte Max du poste est personnel. La levée de la réserve 2 passe par une confirmation d'Anthropic
  ou par un plan Team (dépense, R-29).
- Les crédits d'usage payants du compte sont-ils activés ? Lisible dans `/usage`, pas hors ligne.
- Des routines existent-elles déjà sur votre compte ? La liste (`/schedule list`) appelle un modèle ; elle n'a pas été jouée.
- Le profil `~\.claude-b` et les autres postes n'ont pas été mesurés.

## Les neuf sources (lues le 2026-10-19 par l'étude 20261019b)

1. Claude Code, « Authentication » : `code.claude.com/docs/en/authentication`
2. Claude Code, « Legal and compliance » : `code.claude.com/docs/en/legal-and-compliance`
3. Anthropic, « Consumer Terms of Service », en vigueur le 2025-10-08 : `anthropic.com/legal/consumer-terms`
4. Anthropic, « Commercial Terms of Service », en vigueur le 2025-06-17 : `anthropic.com/legal/commercial-terms`
5. Claude Code, « Run Claude Code programmatically » : `code.claude.com/docs/en/headless`
6. Claude Code, « GitHub Actions » : `code.claude.com/docs/en/github-actions`
7. Claude Code, « Routines » : `code.claude.com/docs/en/routines`
8. Centre d'aide Claude, « Using Claude Code with your Pro or Max plan » : `support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan`
9. Claude Code, « Manage costs effectively » : `code.claude.com/docs/en/costs`
