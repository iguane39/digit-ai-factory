---
lecteur: le porteur, administrateur du poste, qui décide de confier des tickets de la file à un agent Google
---

# Essais d'Antigravity en ligne de commande

Note du 21/11/2026, poste Dell-XPS-16. Les essais ont été joués de 13:42 à 13:52, sous D-227 a, dans le dossier d'essai jetable de la note 20261121e.

## Ce qui change pour vous

Antigravity CLI remplace Gemini CLI sur ce poste, et il traite un ticket de file de bout en bout sans interface. Il prend le ticket, rend son reçu et signe ses 2 commits `par gemini`.

Une condition pèse sur son usage : son outil de commande ne s'ouvre qu'avec une autorisation générale, `command(*)`. Les autorisations nommées, comme `command(git mv)`, n'ont jamais été appliquées. L'essai réussi a donc tourné dans son bac à sable, `--sandbox`, sur un dossier jetable.

## Installation et connexion

L'installation et la connexion ont été vérifiées avant les essais.

| Élément | Valeur relevée | Commande de mesure |
|---|---|---|
| Binaire | `agy.exe` 1.5.14, 238 615 704 octets, dans `%LOCALAPPDATA%\agy\bin` | `agy --version` |
| Signature | Authenticode valide, signataire Google LLC | `Get-AuthenticodeSignature` |
| Connexion | faite par le porteur au navigateur ; 23 modèles listés, dont Gemini 4 et Gemini 3.8 Flash | `agy models`, code de retour 0 |
| Réglages | `~\.gemini\antigravity-cli\settings.json` | lu, aucune autorisation permanente |

Le fichier de réglages déclare tout `C:\Users\iguan` comme espace de travail de confiance, choix fait à la connexion. Les autorisations des essais ont été passées par `--settings`, pour une session seulement, sans rien écrire dans ce fichier.

## Résultats des essais

Chaque essai a été borné à 180 ou 300 s ; un fichier témoin hors du dossier vérifie qu'aucune écriture n'en sort.

| Essai | Réglage | Résultat | Mesure |
|---|---|---|---|
| Lecture et listage | `--mode plan`, sans autorisation | refusé | « a tool required the "command" permission that headless mode cannot prompt for » |
| Lecture par l'outil de fichiers | `--mode plan` | réussi en partie | « 3 lignes » juste en 61 s ; listage impossible sans commande |
| Listage autorisé nommément | `command(ls)`, `command(Get-ChildItem)` | refusé | moniteur de sûreté : `unknown_command` |
| Écriture d'un fichier | `--mode accept-edits`, `write_file(<dossier>)` | réussi | `resultat.txt` = ALPHA, BETA, GAMMA en 23 s ; témoin intact |
| `git status` | `command(git)` | réussi | fichier non suivi nommé juste en 10 s ; verdict `allowed_subcommand` |
| Ticket factice, autorisations nommées | `command(git mv)`, `command(git add)`, `command(git commit)` | refusé | `git mv` jugé `unknown_command`, 4 essais |
| Ticket factice, autorisation générale | `command(*)` avec `--sandbox` | réussi | 2 commits `claim` et `done` signés `par gemini`, `compte.txt` = 3, reçu sans écart, arbre propre ; 173 s, 48 588 jetons |

Le premier refus du ticket venait de commandes enchaînées, verdict `unquoted_shell_operators`. La consigne « une seule commande git par appel, sans opérateur de shell » l'a levé.

## Limites des essais

3 limites restent ouvertes, chacune à mesurer avant tout usage réel :

- le bac à sable `--sandbox` n'a pas été attaqué : le témoin intact montre que l'agent n'a rien écrit au-dehors, pas qu'il ne le pourrait pas ;
- le prix du compte personnel n'a pas été lu par la session ; l'écran de connexion l'a montré au porteur ;
- le relais complet entre Claude, Codex et Antigravity n'a pas été joué, parce que Codex n'écrit toujours pas sans l'installation de son bac à sable.

## Réglages retenus pour la file

Pour confier un ticket à Antigravity, la session passerait ces réglages, et seulement dans un dépôt dédié :

```powershell
agy -p "<consigne du ticket>" --mode accept-edits --sandbox --settings <reglages.json> --output-format json --print-timeout 290s
```

Le fichier de réglages autorise `command(*)`, la lecture et l'écriture du seul dossier du dépôt. La consigne impose une commande git par appel, sans opérateur. Chez Produit-79, il faudrait encore un fichier de consignes pour Antigravity, une ligne de routage, et la valeur `gemini` dans `QUEUE_ASSIGNEES`.

## Sources

- les journaux JSON des essais, gardés dans le dossier `resultats\` du dossier temporaire de la session ;
- `~\.gemini\antigravity-cli\cli.log`, verdicts du moniteur `agy_tool_safety`, relevés le 21/11 de 13:42 à 13:52 ;
- `agy --help`, `agy models` et `Get-AuthenticodeSignature`, joués le 21/11 ;
- le dépôt d'essai : `git log` et `git status` après chaque essai.
