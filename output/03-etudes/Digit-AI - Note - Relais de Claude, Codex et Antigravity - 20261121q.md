---
lecteur: le porteur, administrateur du poste, qui décide de confier des tickets de la file à Codex et à Antigravity
---

# Relais de Claude, Codex et Antigravity

Note du 21/11/2026, poste Dell-XPS-16. Les essais ont été joués de 16:07 à 16:17, sous D-226 a, dans le dossier d'essai jetable de la note 20261121e. Cette version corrige la note 20261121o, remise telle que livrée : son appel de Codex était écrit pour PowerShell, qui le refuse.

## Ce qui change pour vous

Codex écrit désormais sans interface, et sans aucun geste de votre part. L'installation élevée de son bac à sable était déjà faite depuis le 12/11 ; le blocage venait d'un réglage, levé à chaque appel.

Le relais complet a été joué sur 2 tickets chaînés créés par Claude. Codex a traité le premier, Antigravity le second à partir de la sortie de Codex. Une limite reste : Codex ne peut pas écrire dans `.git`, donc la session orchestratrice fait ses commits de prise et de clôture.

## Ce qui bloquait Codex

Le journal `~\.codex\.sandbox\sandbox.2026-11-21.log` montre la cause. À chaque essai d'écriture, Codex ouvrait en écriture tout `%TEMP%` pour son compte de bac à sable. Ce dossier compte des milliers de fichiers ; le rafraîchissement des droits était coupé au bout d'environ 60 s, code 143.

Le fichier `setup_marker.json` du même dossier date l'installation élevée au 12/11 à 09:44. Les comptes `CodexSandboxOffline` et `CodexSandboxOnline` et les 12 filtres réseau sont en place. L'invite d'élévation de Windows n'était donc pas nécessaire.

Le correctif retire `%TEMP%` et `/tmp` des racines d'écriture, pour l'appel seulement :

```bash
codex exec -C <dépôt> -s workspace-write -c sandbox_workspace_write.exclude_tmpdir_env_var=true -c sandbox_workspace_write.exclude_slash_tmp=true --ephemeral --json -o <dernier-message.txt> "<consigne>" < /dev/null
```

L'appel se lance depuis Bash, comme tous les essais du 21/11. PowerShell refuse l'opérateur `<` (« L'opérateur « < » est réservé à une utilisation future », relevé le 21/11 par un essai d'analyse de la commande).

Avec ce réglage, le rafraîchissement traite 1 racine en moins d'une seconde, sans erreur. Le fichier `~\.codex\config.toml` n'a pas été modifié, parce que l'extension de VS Code le partage.

## Résultats des essais de Codex

Chaque essai a été borné à 300 s ; un fichier témoin hors du dossier vérifie qu'aucune écriture n'en sort.

| Essai | Résultat | Mesure |
|---|---|---|
| Écriture, consigne libre | refusé | PowerShell du bac à sable en mode de langage restreint : `CannotCreateTypeConstrainedLanguage` |
| Écriture, `Set-Content` imposé | réussi | `sonde-codex.txt` = « ok » en 8 s ; témoin intact |
| `git add` et `git commit` | refusé | `.git/index.lock` : `Permission denied` ; le journal note « applied deny ACE to protect …\.git » |
| `git add` avec `.git` en racine d'écriture | refusé | même refus ; la protection de `.git` prime |

La protection de `.git` est voulue par Codex : les crochets de git s'exécutent hors du bac à sable, un agent qui les écrirait en sortirait. Elle n'a pas été contournée.

## Le relais complet

Le relais enchaîne 3 agents sur 2 tickets, dans le même dépôt d'essai.

| Étape | Agent | Résultat | Mesure |
|---|---|---|---|
| Création de T-ESSAI-002 et T-ESSAI-003 | Claude | réussi | commit `753a17a` |
| Prise de T-ESSAI-002 | Claude, pour Codex | réussi | commit `3194d4b` « claim: T-ESSAI-002 par codex » |
| Travail de T-ESSAI-002 | Codex | réussi | `sortie/majuscules.txt` = ALPHA, BETA, GAMMA et reçu sans écart, en 29 s, 77 216 jetons d'entrée |
| Clôture de T-ESSAI-002 | Claude, après lecture du reçu | réussi | commit `bb5336d` |
| T-ESSAI-003 de bout en bout | Antigravity | réussi | `sortie/inverse.txt` = GAMMA, BETA, ALPHA ; commits `ed57a1d` et `10c3daf` signés `par gemini` ; 164 s, 50 240 jetons |

Après le relais, les 3 tickets sont dans `termine`, l'arbre est propre, le témoin est intact et le dépôt n'a aucun distant.

Un écart de forme est relevé chez Codex : son `Set-Content` écrit une marque d'ordre d'octets UTF-8 et des fins de ligne Windows. Antigravity l'a lu sans erreur, mais un outil plus strict pourrait buter. La consigne d'un vrai ticket devrait imposer l'encodage, par exemple `Set-Content -Encoding ascii` pour un fichier sans accent.

## Réglages retenus pour la file

Pour Codex, la session passe l'appel ci-dessus et fait elle-même les gestes git du protocole. La consigne interdit toute commande git et impose `Get-Content` et `Set-Content`.

Pour Antigravity, l'appel de la note 20261121f reste valable : `--mode accept-edits --sandbox`, avec `command(*)` et l'écriture du seul dossier du dépôt. Antigravity fait lui-même ses commits.

Chez Produit-79, `AGENTS.md` demande à Codex de prendre et clore ses tickets par git. Le protocole de la file devra donc confier ces gestes à l'orchestrateur quand l'agent est Codex sous bac à sable.

## Sources

- `~\.codex\.sandbox\sandbox.2026-11-21.log` et `setup_marker.json`, lus le 21/11 à 16:07 ;
- les journaux JSON des essais, gardés dans le dossier `resultats\` du dossier temporaire de la session ;
- le dépôt d'essai : `git log`, `git status` et le contenu des fichiers produits, relus après chaque essai.
