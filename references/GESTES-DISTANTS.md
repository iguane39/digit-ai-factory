# Gestes destructifs distants : une décision groupée, jamais une par commande

Décision humaine D-77 (b) amendée du 26/10/2026 (TF-1959), mot pour mot : « 77b mais une décision pour
toutes les modifs en une fois, pas une décision à chaque fois qu'il y a une suppression ou modification
de droits (l'objectif est d'optimiser / réduire le nombre d'interventions de l'utilisateur en lui laissant
une maitrise totale sur ce type de sujet) ».

Le fait : un dépôt d'essai et son état Terraform ont été supprimés alors qu'une décision humaine les
réservait à plus tard, et la session a tenté 4 fois d'attribuer des rôles d'administration Azure DevOps
(refusées en 403 et en 401). R-58 range la suppression sous le motif `irreversible`, mais rien ne
l'exécutait : le geste partait sans décision.

## Pourquoi ce fichier et pas une règle numérotée

La règle de fond existe déjà : une suppression est une décision humaine (R-58, motif `irreversible`).
Ce qui manquait est un mécanisme et sa donnée : une liste fermée de commandes et un format de lot, qui
évoluent à chaque outil nouveau. Une donnée qui évolue vit dans `references\`, pas dans `REGLES-PROJET.md`
(162 Ko, règles numérotées par le pilot). Si le pilot veut une règle R-N opposable, elle citera ce fichier.

## Le geste de la session, du lot au hook

1. Elle regroupe TOUS les gestes destructifs distants qu'elle prévoit dans le tour en une seule décision au
   bloc 3, liste complète : commande, cible, effet, retour arrière. Une décision par commande est un défaut.
2. L'humain l'approuve une fois.
3. La session écrit le lot approuvé : un fichier JSON `{ decision, reponse_humaine, gestes: [{ commande,
   cible, effet, retour_arriere }] }`, puis `node oracles\hook-gestes-distants.mjs --poser --lot <lot.json>`
   au pilot, `node forge\hooks\factory.mjs gestes-distants --poser --lot <lot.json>` chez un produit.
4. Le hook `PreToolUse` sur `Bash` et `PowerShell` laisse passer les commandes du lot et refuse (exit 2) les
   autres gestes destructifs distants, avec le remède dans le message.

Le lot s'inscrit en une ligne de `todo\gestes-approuves.jsonl` (pilot) ou `forge\gestes-approuves.jsonl`
(produit). La ligne porte la décision (D-N), les mots de l'humain (`reponse_humaine`), l'horodatage,
l'expiration et, si le lot ne vaut que pour une session, son identifiant. Il vaut 24 h au plus : le hook
plafonne l'expiration à 24 heures après l'horodatage, quelle que soit la valeur écrite. Une
commande approuvée couvre un geste dont les mots commencent par les siens : `--no-wait` ajouté passe,
une autre cible ne passe pas. Un `*` dans un mot approuve toute une famille de cibles (`rg-essai-*`).

Un arbre de travail lié lit aussi les lots de l'arbre principal : une campagne qui travaille dans un
`git worktree` n'a pas à redemander ce que l'humain a approuvé pour la session qui la lance.

## La liste fermée

Chaque famille se justifie par l'effet, pas par l'outil. Source : `oracles\hook-gestes-distants.mjs`.

| Famille | Commandes | Pourquoi |
|---|---|---|
| Suppression ou purge de ressource cloud | `az …` dont la sous-commande porte `delete`, `purge` ou `remove` ; `Remove-Az*`, `Remove-Mg*` | une ressource supprimée ne se restaure pas à l'identique (données perdues) |
| État et infrastructure | `terraform` ou `tofu` : `destroy`, `apply -destroy`, `state rm`, `workspace delete` | l'état supprimé laisse des ressources orphelines |
| Droits | `az role assignment` ou `definition create\|update`, `az ad app permission add\|grant\|admin-consent`, `az keyvault set-policy`, `az devops security …`, `az devops user add\|update`, `New-AzRoleAssignment` ; requête HTTP POST, PUT ou PATCH sur un point d'accès de droits (Azure DevOps, Microsoft Graph, Azure Resource Manager, GitHub) par `az rest`, `az devops invoke`, `gh api`, `curl`, `wget`, `Invoke-RestMethod` | un droit accordé ouvre un accès que personne n'a décidé ; le fait des 4 tentatives du 26/10 |
| Suppression par HTTP ou GitHub | méthode DELETE vers un hôte autre que la machine locale ; `gh <groupe> delete` | `gh repo delete` et `gh api -X DELETE` sont des suppressions distantes comme les autres |
| Histoire distante | `git push` avec `--force`, `-f`, `--force-with-lease`, `--force-if-includes`, une référence `+x` ou `:x`, `--delete`, `-d`, `--mirror`, `--prune` | l'histoire réécrite ou une branche supprimée ne se retrouve que si quelqu'un en a une copie |

Hors liste : les lectures (`az group show`, `az role assignment list`, `terraform plan`, `gh api` en GET), les
déploiements ordinaires (`terraform apply`, `az deployment … create`) et `git push` simple.

## Limites du hook

- Un geste joué par un script dont le texte n'est pas dans la commande, une commande construite par
  variable, une commande encodée (`-EncodedCommand`), une commande envoyée par `ssh` ou `wsl`, un alias.
- Les autres nuages (`aws`, `gcloud`, `kubectl`), faute de fait fondateur ; `terraform state push|mv`,
  `gh repo archive`, `gh repo deploy-key add`.
- Que l'humain ait réellement approuvé : `reponse_humaine` cite ses mots et le fichier garde chaque ligne,
  mais une session qui écrirait un lot sans approbation ne serait pas arrêtée par le hook. La revue d'un
  lot (qui l'a posé, quand, avec quels mots) est le seul garde-fou de ce point.
- Que le champ `cible` du lot corresponde à la commande : seule la commande approuvée est comparée.

## Câblage

Au pilot : `.claude\settings.json` (matcher `Bash|PowerShell`). Chez un produit : `gabarits\settings-produit.json`
par le relais `forge\hooks\factory.mjs gestes-distants` (`gabarits\hooks-factory.mjs`), exigé par
`gabarits\HERITAGE.json` 1.37.0. Section courte du produit : `gabarits\CLAUDE-PRODUIT.md`, « Gestes
destructifs distants ». Recettes : `oracles\hook-gestes-distants.test.mjs` (cas rouges et verts, remède
joué) et `gabarits\hooks-factory.test.mjs`, cas 14.
