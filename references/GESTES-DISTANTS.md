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
   `reponse_humaine` cite les mots que l'humain a tapés, tels quels (D-195 (b), section suivante).
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
| Exception (TF-2128, D-168 (a)) | `az … delete\|remove` ou `Remove-Az*` d'une ressource créée par la même session, consignée à sa création avec son identifiant, sans aucune dépendance consignée | passe sans décision groupée : la session retire ce qu'elle a elle-même créé ; conditions et limites ci-dessous |

Hors liste : les lectures (`az group show`, `az role assignment list`, `terraform plan`, `gh api` en GET), les
déploiements ordinaires (`terraform apply`, `az deployment … create`) et `git push` simple.

## Limites du hook

- Un geste joué par un script dont le texte n'est pas dans la commande, une commande envoyée par `ssh` ou
  `wsl`, un alias ; une commande en variable venue de l'environnement quand la commande ne porte ni outil
  distant ni verbe destructif (section suivante).
- Les autres nuages (`aws`, `gcloud`, `kubectl`), faute de fait fondateur ; `terraform state push|mv`,
  `gh repo archive`, `gh repo deploy-key add`.
- Que l'humain ait réellement approuvé : depuis D-195 (b), `reponse_humaine` doit figurer mot pour mot dans
  un message qu'il a tapé dans la transcription de la session. Restent hors de portée : une session qui
  écrirait une fausse entrée dans sa propre transcription, et le sens des mots cités (« je n'approuve pas »,
  tapé par l'humain, serait une citation valide). La revue d'un lot reste le garde-fou de ces deux points.
- Que le champ `cible` du lot corresponde à la commande : seule la commande approuvée est comparée.

## L'accord est cité, la commande est nommée (D-195 (b), 10/11/2026)

Décision humaine du 10/11/2026, même réponse, option (b) : « l'accord doit se retrouver mot pour mot dans un message humain
de la transcription, et une commande approuvée ne commence pas par un joker ». Le fait : un accord valait dès 5 caractères
quelconques (« xxxxx », « je n'approuve pas », « ????? », « ----- », « 1a »), et une commande approuvée `*`, `az *` ou
`az group` couvrait `az group delete -n prod` comme `terraform destroy`.

**La citation.** Quand un lot couvre la commande, le hook relit le `transcript_path` de son entrée. Le lot ne vaut que si sa
`reponse_humaine` figure mot pour mot dans un message tapé par l'humain : une entrée `user` d'origine humaine (`origin.kind`
« human »). Ne comptent pas : un `tool_result`, une injection de hook, un `<system-reminder>`, un corps de skill, une
`<task-notification>`, un message d'une autre session, une invite envoyée par programme, la consigne d'un sous-agent, un résumé
de compaction. La comparaison ignore la casse, les espaces multiples et les apostrophes typographiques ; elle ne prend jamais
la citation au milieu d'un mot (« 1a » ne se lit pas dans « 21a »). Une citation porte au moins une lettre ou un chiffre. La
transcription d'un sous-agent se lit avec celle de sa session, où l'humain a répondu. Sans transcription, ou sans citation,
le refus le dit et nomme le lot.

**La commande nommée.** Une commande approuvée nomme l'outil et son verbe en mots littéraux avant tout joker : ce qui précède
le premier `*` doit être, à lui seul, un geste de la liste fermée. `az group delete --name rg-essai-*` reste admis ; `*`,
`az *` et `az group` font refuser le lot. Seule exception : une commande illisible pour la garde (D-194 (b)) s'approuve par
son texte exact, sans joker.

**À l'écriture.** `--poser` refuse les deux défauts. Il lit la transcription donnée par `--transcript <session.jsonl>`, ou
celle que désigne `CLAUDE_CODE_SESSION_ID`, que le harnais donne aux commandes qu'il lance (cherchée sous `CLAUDE_CONFIG_DIR`,
puis `~\.claude`). Sans l'une ni l'autre, le lot est refusé.

**Ce que cela change.** Un lot ne couvre que les sessions dont la transcription porte les mots de l'humain : la session qui a
reçu l'accord et ses sous-agents. Retour arrière prévu par l'option : revenir au contrôle de longueur.

## Ce que la garde ne sait pas lire (D-194 (b), 10/11/2026)

Décision humaine du 10/11/2026, réponse « Choisis toutes les décisions recommandées et applique. », option (b) : « une
commande illisible pour la garde, ou une panne du juge, est refusée sauf accord ; les 12 formes entrent en recette rouge ; un
réglage rétablit l'ancien comportement ». Le fait : une revue de code du 10/11 a rejoué les fonctions des deux hooks. Une
suppression passait sous un alias PowerShell (`curl -Method Delete`), une abréviation (`irm -Me Delete`), un `eval`, un `iex`,
un `Start-Process`, une option globale placée entre les mots d'`az`, ou une apostrophe isolée qui masquait les lignes suivantes.
Côté identité sortante, `http://localhost:80@evil.com` passait pour local. Une panne du juge laissait passer les deux hooks.

**La lecture suit le dialecte de l'outil.** Bash : barre oblique inverse, `$'…'`, commentaires `#`, tableaux `NOM=( … )`,
développement arithmétique `$(( … ))`. PowerShell : accent grave, here-strings `@' … '@` (le corps est du texte), `<# … #>`,
tables `@{ … }`, alias `curl` et `wget` d'`Invoke-WebRequest`, abréviations de paramètre (`-Me`, `-Meth`). Sont résolus puis
jugés : `eval`, `iex`, `Invoke-Expression`, `Start-Process … -ArgumentList`, `ForEach-Object { … }`, `-EncodedCommand`
décodé, `"$( … )"` et le corps d'un `<<EOF` non cité, les fonctions d'enveloppe (`m(){ "$@"; }; m gh api …`), les variables
que la commande affecte elle-même (`SP="C:\…"; "$SP\x.exe"`, `$exe = "…"; Start-Process $exe`, `TF=$(where terraform-1.9.8.exe)`).

**La règle de famille.** Une commande que la garde ne sait pas lire est refusée quand elle porte un mot d'outil distant :
`az`, `gh`, `terraform`, `tofu`, `kubectl`, `helm`, `aws`, `gcloud`, `curl`, `wget`, `irm`, `iwr`, `Invoke-*`, `Start-Process`,
`ssh`, `scp`, `sftp`, `rsync`, `wrangler`, les cmdlets `*-Az*` et `*-Mg*`, `git` suivi de `push`, y compris dans un jeton
base64. Les causes d'illisibilité sont fermées : guillemets non équilibrés, document en ligne sans ligne de fin, texte évalué
non littéral (`eval "$CMD"`, `iex $c`, tube vers un interprète, bloc de script construit), commande dans une variable que rien
ne résout, méthode HTTP dans une variable, commande encodée illisible, plus de trois shells imbriqués. Renfort : une commande
en variable suivie de `delete`, `purge`, `remove` ou `destroy` compte comme un outil distant (`$AZ group delete`). Le refus
dit quoi faire : réécrire la commande lisiblement, ou poser un lot d'accord dont un geste porte son texte exact. Ce texte
couvre la seule commande identique, espaces normalisés, jamais un préfixe. Côté identité sortante, la même lecture vaut pour
une commande qui porte une adresse d'identité (`FORGE_IDENTITES` ou adresse git). Une requête dont l'hôte ne se lit pas
(variable non résolue, aucune cible) et qui porte une adresse est refusée.

**Panne et entrée illisible.** Une exception du juge, une exception qui échapperait aux gardes, une entrée qui n'est pas un
objet JSON : les deux hooks refusent (exit 2) avec un motif qui dit quoi faire. Avant, ils laissaient passer.

**Le réglage.** `FORGE_GARDE_ILLISIBLE=laisse`, posé par l'humain dans l'environnement du harnais avant d'ouvrir la session,
rétablit l'ancien comportement : la règle de famille ne s'applique plus, une panne et une entrée illisible passent. La liste
fermée et les formes résolues restent jugées : ce sont des corrections, pas un durcissement. La commande ne peut pas poser ce
réglage. Le hook lit son propre environnement, hérité du harnais, et aucun fichier : `FORGE_GARDE_ILLISIBLE=laisse az …` ne
change que l'environnement de la commande. Une commande qui l'écrit pour une session suivante est refusée (`setx`,
`SetEnvironmentVariable`, `HKCU:\Environment`, `settings.json`, profil du shell). Limite : ce hook ne voit pas les outils
Write et Edit, qui pourraient l'écrire dans `.claude\settings.json`.

**La mesure.** Rejeu des 11 921 commandes Bash et PowerShell des transcriptions du poste (profils `~\.claude` et
`~\.claude-b`, du 03/11 15:30 au 10/11 15:30 UTC), en fonctions pures, ancien juge contre nouveau. Les refus des gestes
distants passent de 10 à 11, ceux de l'identité sortante restent à 0. Le seul refus nouveau est une commande dont une
apostrophe ferme réellement la chaîne bash d'un `node -e` : bash la rejette lui-même. Faux positif : aucun.

**Limites.** Une variable venue de l'environnement ou d'une commande précédente ne se résout pas : la commande qui l'invoque
passe si elle ne porte ni outil distant ni verbe destructif. Un `& (Get-Command az) …` est refusé comme illisible, sans être
résolu. Le contenu d'un script, et d'un fichier lu par la commande, reste hors de la lecture. Une erreur de syntaxe dans le
fichier du hook arrête node avant toute garde ; le harnais lit alors un code 1, qui ne bloque pas.

Recettes : `oracles\hook-gestes-distants.test.mjs` et `oracles\hook-identite-sortante.test.mjs`, cas « D-194 », chacun vu
rouge sur le code d'avant.

## Le retrait d'une ressource que la session a créée (TF-2128, D-168 (a))

Décision humaine D-168 (a) du 04/11/2026, mot pour mot : « La liste fermée des gestes distants admet, sans décision
groupée, le retrait d'une ressource créée par la même session, consignée à sa création avec son identifiant, et sans
aucune dépendance. » Le fait (RP-6, lot Produit-86 20261103d) : changer la région d'un réseau vide créé dix minutes plus
tôt exigeait une décision groupée ; la session l'a dupliqué, et l'original est resté facturé.

**La trace.** Le hook écrit au retour d'un outil réussi (`PostToolUse`, jamais après un échec ni une interruption) dans
`forge\gestes-en-cours.jsonl`, le même fichier que les gestes en cours : `creation` (session, ressource, chemin de commande, identité
nom + groupe de ressources + options `*-name`, `id_distant` lu du champ `id` de la sortie quand elle le donne, références, horodatage),
`modification` (un geste mutant qui cite d'autres ressources) et `retrait` (la création retirée). Sont lus : `az` (`create`, `delete`,
`remove`, tout autre verbe mutant) et les cmdlets `New-Az*`, `Remove-Az*`, `Set|Update|Add-Az*`. Le pilot n'écrit pas ce registre :
l'exception n'y joue donc jamais.

**Les trois conditions**, toutes lues au registre, la première non tenue est nommée dans le refus :

- (b) la création est consignée avec son identifiant : une `creation` non retirée porte le même chemin de commande, le même nom, le même
  groupe de ressources et les mêmes options `*-name` que le retrait (ou, avec `--ids`, le même `id_distant`). Sans `--name` ni `--ids`,
  l'identifiant n'est pas déterminable : refus.
- (a) la même session : le `session_id` du hook est celui de la création, et aucune autre session n'a consigné une création de cette
  ressource (`create` vaut `upsert` : une autre session qui l'a « recréée » en ôte la certitude). Sans `session_id`, refus.
- (c) aucune dépendance, mesurée ainsi : aucune création ou modification consignée depuis ne cite la ressource (son nom comme
  segment d'une valeur de paramètre, ou son `id_distant` comme préfixe) ; aucune n'a un paramètre par variable, par fichier (`@x`) ou
  un déploiement (`az deployment`, `az stack`), dont les dépendances ne se lisent pas ; aucun `terraform` ou `tofu` n'a agi depuis.
  Une dépendance retirée (`retrait` consigné) ne compte plus : le remède est de retirer d'abord l'enfant, puis le parent.

**Jamais admis par l'exception** : un groupe de ressources (`az group delete`, `Remove-AzResourceGroup`), dont le contenu n'est pas
énumérable par le hook ; `purge` ; les droits (`az role`, `az ad`, `az devops`) ; terraform ; DELETE HTTP, `az rest`, `gh` ; l'histoire
git. Toute commande composée garde le refus tant qu'un de ses gestes n'est ni couvert par un lot ni admis par l'exception.

**Non jugé (déclaré).** Une ressource créée par un autre moyen que la liste lue (portail, script dont le texte n'est pas dans la
commande, terraform avant la création, `az … up`) et qui dépend de la ressource retirée ; les dépendances implicites que le fournisseur
crée de son côté (une carte réseau créée avec une machine virtuelle) ; le contenu de la ressource (blobs d'un compte de stockage,
secrets d'un coffre) ; un `create` rejoué sur une ressource préexistante (c'est un `upsert`, il est consigné comme création de la
session) ; une commande composée dont un élément échoue (l'outil échoue, aucun `PostToolUse`, rien n'est consigné : refus prudent) ; une
valeur de paramètre sans le nom exact (un identifiant abrégé) ; un alias ou une variable de nom. Au pilot, l'exception ne joue pas.

Recette : `oracles\hook-gestes-distants.test.mjs`, cas « TF-2128 » à double sens (admis : même session, consignée, sans dépendance, y
compris après retrait de l'enfant et par `--ids` ; refusés : autre session, non consignée, création échouée, dépendance par création,
par modification ou par variable, déploiement, terraform, groupe de ressources, autre groupe ou parent, recréation par une autre
session, session non identifiée, pilot).

## Deux sessions, une ressource : le registre des gestes en cours (TF-2084, RT-39)

Le fait du 29/10/2026, chez un produit : deux compartiments de stockage créés par deux sessions à deux
minutes d'écart, un projet d'hébergement recréé pendant le test d'une autre session, une erreur 522
attribuée à tort au fournisseur, deux bancs simultanés faussés. Chaque session lisait l'état distant, jamais
l'intention de l'autre. Le hook sait déjà lire une commande ; il tient donc aussi le registre.

- **Fichier** : `forge\gestes-en-cours.jsonl`, ajouté jamais réécrit, une ligne par événement. `debut` porte la
  session, la ressource (`wrangler r2 bucket rapports`), le périmètre qui la contient (`wrangler r2 bucket`), la
  commande résumée, l'heure et l'expiration ; `fin` porte l'identifiant du `debut`. Il est écrit dans l'arbre
  principal du dépôt et lu aussi depuis un arbre de travail lié. Gitignoré (`gabarits\gitignore-produit`).
- **Écriture** : le hook `gestes-distants` inscrit le `debut` en `PreToolUse` et la `fin` en `PostToolUse`, pour
  les gestes qui MODIFIENT l'état distant. Liste fermée : `az` dont un mot de sous-commande est `create`, `delete`,
  `update`, `deploy`, `up`, `set`, `add`, `purge`, `remove`, `start`, `stop`, `restart`, `swap`, `scale`, `import`,
  `restore`, `sync`, `upload`, `put`, `publish` ou `rollback` ; `terraform|tofu` `apply`, `destroy`, `import`, `state rm|mv|push`,
  `workspace new|delete` (la ressource est le dossier, `-chdir` compris) ; `wrangler` `create`, `delete`, `put`,
  `deploy`, `publish`, `upload`, `rollback`, `apply`, `execute`, `bulk` (un projet Pages a une seule clé, qu'il soit
  créé, supprimé ou déployé) ; `gh repo create|delete|rename|edit|archive|unarchive|fork`.
- **Lecture qui avertit** : quand une AUTRE session a un geste ouvert sur la même ressource (« même
  ressource ») ou sur le même périmètre sous un autre nom (« même périmètre » : deux compartiments pour le même
  usage), la commande part avec un avertissement (`additionalContext`) qui nomme l'autre session, depuis quand
  et ce qu'il faut faire : lire l'état distant, attendre, ne pas imputer une erreur au fournisseur. Exit 0 : le
  registre n'a pas de refus. Les refus de ce fichier (gestes destructifs sans lot) passent d'abord et
  n'inscrivent rien.
- **Un geste est ouvert** tant qu'il n'a pas de `fin` et que son expiration n'est pas passée : 15 minutes par
  défaut, 4 heures au plus. C'est la seule preuve de vie d'une session : une session tuée cesse d'être comptée à
  l'expiration, et un outil qui échoue ne déclenche pas `PostToolUse`, donc son geste dure jusqu'à l'expiration.
- **Déclarer à la main** ce que la liste fermée ne reconnaît pas (un banc, un déploiement par un autre outil) :
  `node forge\hooks\factory.mjs gestes-distants --ouvrir --ressource banc:recette --geste "banc de recette"
  --session <id> [--duree-min 60]`, puis `--clore --ressource banc:recette --session <id>` ; `--lister` montre les
  gestes ouverts. Sans `--session`, la session vaut `manuel` : deux sessions qui omettent l'option se confondent.
- **Hors liste, non jugé** : `git push` (git arbitre seul), `az rest`, `gh api`, `curl`, `vercel`, `netlify`,
  `supabase`, les autres nuages ; un geste lancé par un script dont le texte n'est pas dans la commande ; la
  vie réelle d'une session (seule l'expiration compte) ; la même ressource nommée différemment (`rapports` et
  `rapports-v2`), signalée seulement quand le périmètre est le même. Le pilot (`todo\TODO.jsonl`) n'écrit pas de
  registre : ses sessions se coordonnent par `mobilisation.jsonl` et le registre des décisions.
- **Reste à faire, non livré** : un hook `PostToolUseFailure` qui clôt un geste dont l'outil a échoué ; la lecture
  de l'état distant avant chaque geste (la session le fait, rien ne l'y oblige) ; l'extension de la liste aux
  autres outils quand un fait la justifie.

## Câblage

Au pilot : `.claude\settings.json` (matcher `Bash|PowerShell`). Chez un produit : `gabarits\settings-produit.json`
par le relais `forge\hooks\factory.mjs gestes-distants` (`gabarits\hooks-factory.mjs`), exigé par
`gabarits\HERITAGE.json` 1.37.0 ; le registre des gestes en cours ajoute l'événement `PostToolUse` (même
commande, 1.49.0) et `oracles\lib-gestes-en-cours.mjs`, recette `oracles\hook-gestes-en-cours.test.mjs`. Section courte du produit : `gabarits\CLAUDE-PRODUIT.md`, « Gestes
destructifs distants ». Recettes : `oracles\hook-gestes-distants.test.mjs` (cas rouges et verts, remède
joué) et `gabarits\hooks-factory.test.mjs`, cas 14.
