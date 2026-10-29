# Fichiers `.env` : jamais lus ni affichés dans une session

Décision humaine D-106 (b) du 29/10/2026, volet pilot : poser un hook `PreToolUse` qui refuse la lecture et
l'affichage d'un fichier `.env*`.

Le fait : le 21/10/2026, une clé d'un `.env` a été affichée en clair dans une session. La règle « les `.env` ne
transitent jamais » figurait au noyau (`CLAUDE.md`), au gabarit d'agent de campagne et à `REGLES-PROJET.md`
(R-14) ; aucun hook de `oracles\hook-*.mjs` ne l'exécutait. Tout ce qu'un outil affiche entre dans la
transcription de la session : une valeur affichée est une valeur sortie du poste.

## Ce que le hook refuse

Source : `oracles\hook-fichiers-env.mjs` (exit 2, motif sur stderr). Il décide sur des noms, il n'ouvre jamais un fichier.

| Outil | Refusé |
|---|---|
| `Read` | un chemin dont le nom est `.env`, `.env.local`, `.env.production`, `.env.*` (casse indifférente) |
| `Grep` | un `path` ou un `glob` qui désigne un tel nom (`.env*`, `**/.env*`, `{.env,.env.local}`) |
| `Bash`, `PowerShell` | `cat`, `type`, `Get-Content` (`gc`), `head`, `tail`, `less`, `more`, `grep` et famille (`rg`, `findstr`), `sed`, `awk`, `Select-String` (`sls`), et `tac`, `nl`, `xxd`, `od`, `strings`, `base64`, `sort`, `cut`, `diff`… sur un `.env` ; une redirection d'entrée `< .env` ; une copie vers la sortie standard (`cp .env /dev/stdout`, `copy .env CON`, `dd if=.env`) ; `git show`, `git diff`, `git blame`, `git cat-file`, `git log -p` sur un `.env` ; `find … -exec cat` ; un `.env` passé par tuyau à un lecteur ; un code en ligne qui le nomme (`node -e`, `python -c`, `[IO.File]::ReadAllText`) ; les mêmes sous `bash -c`, `powershell -Command`, `cmd /c`, `$( … )` |

## Ce qu'il laisse passer

- Les modèles : `.env.example`, `.env.sample`, `.env.template` (et `.env.local.example`, `.env.production.template`…).
- Les faux positifs évidents : `.environment.md`, `.envrc`, `dotenv.md` (un nom qui contient « .env » au milieu d'un mot),
  un dossier nommé `.env` (environnement virtuel : `.env/bin/activate`), une recherche DE la chaîne « .env »
  (`grep -rn "\.env" docs/`), un mot entre guillemets (`git commit -m "ne jamais cat .env"`), un filtre qui EXCLUT
  (`grep --exclude=.env`, `rg -g '!.env'`).
- Les commandes qui ne lisent pas : `git add`, `git check-ignore`, `git ls-files`, `git status`, `ls`, `test -f`, `stat`,
  `cp .env.example .env`, `mv`, `Test-Path`, `Get-Item`.

## La voie permise

`node scripts\env-masque.mjs <fichier>` rend chaque affectation avec la valeur remplacée par `********` (`<vide>` si
la valeur est vide ; la longueur n'est jamais révélée) ; une clé mise en commentaire est masquée de même ; un
commentaire libre devient `# …`. Avec `--cles`, il ne rend que la liste des clés actives. Le script lit le fichier
lui-même : la session ne voit que le masqué. Chez un produit, le message de refus donne le chemin absolu du script du
pilot, sans copie chez le produit.

## Limites du hook (non jugé, déclaré)

- Un fichier lu par un script dont le texte n'est pas dans la commande (`node outil.mjs`, `python x.py`), une commande
  construite par variable ou encodée (`-EncodedCommand`), un alias.
- Un `Grep` qui vise un DOSSIER sans `glob` : l'outil peut descendre dans les fichiers cachés et rendre la ligne d'un
  `.env` rencontré. Le hook ne sait pas ce que le dossier contient, et ne refuse pas toute recherche de dossier. Seule
  la décision d'exclure les fichiers `.env*` de l'outil (réglage de permissions `deny` sur `Read(**/.env*)`, par
  exemple) ferme ce trou ; elle appartient à l'humain.
- Un `.env` désigné par une sous-expression dont le lecteur ne porte pas le nom, `xargs -a .env`, `source .env` suivi
  d'un `echo "$CLE"`, `printenv`.
- Les autres porteurs de secrets que `.env*` : `.envrc`, `prod.env`, `secrets.json`, `.pem`.

## Câblage

Au pilot : `.claude\settings.json` (matcher `Read|Grep|Bash|PowerShell`). Chez un produit : `gabarits\settings-produit.json`
par le relais `forge\hooks\factory.mjs fichiers-env` (`gabarits\hooks-factory.mjs`), exigé par `gabarits\HERITAGE.json`
1.44.0. Recettes : `oracles\hook-fichiers-env.test.mjs` (refus, exemptions, faux positifs, remède joué),
`scripts\env-masque.test.mjs` (aucune valeur ne sort) et `gabarits\hooks-factory.test.mjs`, cas 17.
