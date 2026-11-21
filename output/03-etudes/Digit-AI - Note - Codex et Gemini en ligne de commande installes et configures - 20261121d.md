---
lecteur: le porteur, administrateur du poste, qui rejoue les commandes sur son autre poste avant les essais
---

# Codex et Gemini en ligne de commande : installés et configurés

Note du 21/11/2026, poste Dell-XPS-16.

## Ce qui change pour vous

Les 2 agents se lancent désormais depuis un terminal, sans ouvrir leur extension VS Code. `codex` 0.171.0 et `gemini` 0.70.0 sont installés sur ce poste.

Chacun réutilise la connexion déjà faite dans son extension : aucune nouvelle authentification n'a été demandée. Il reste 3 gestes avant les essais, listés en fin de note ; un seul est une décision.

## Le travail repris chez Produit-79

Produit-79 organise depuis le 12/11/2026 le travail entre Claude et Codex par la file `digit-ai-queue`, dans son dossier `queue\`. Le relevé du 21/11 à 12:30 donne :

- 9 tickets terminés, du 12/11 au 13/11, par relais Claude vers Codex puis Codex vers Claude ;
- 1 ticket en attente de Codex depuis le 13/11, `T-2026-1113-005`, 5 remplacements de texte dans les campagnes Facebook ;
- la revue L99 du 13/11 a livré un prompt de refonte du relais, noté 78 ; il n'a pas été exécuté, `queue\local\relais.mjs` n'a ni présence ni `statut` ;
- Gemini n'a aucun rôle dans la file : `QUEUE_ASSIGNEES` vaut `claude codex humain` dans `queue\local\config.env`.

Gemini n'a servi que par l'extension Gemini Code Assist 2.107.0. Le 13/11 à 15:48, elle s'est connectée au compte Google et a ouvert 8 dossiers de `C:\dev`, dont Produit-79 et le pilot. Les journaux `~\.gemini\tmp\*\chats\` ne contiennent que le contexte d'ouverture, aucun échange de travail.

2 règles encadrent la suite. Le `CLAUDE.md` de Produit-79 range « lancer Codex soi-même » dans la colonne « Jamais » de son routage, par décision humaine du 12/11.

Le fichier `local\INSTANCES.md` de `digit-ai-queue` dit que `codex exec` n'est pas câblé, parce qu'il consomme l'abonnement sans geste de l'utilisateur. Les binaires installés ici ne changent aucune de ces 2 règles.

## État du poste, mesuré le 21/11/2026

Chaque ligne donne la valeur relevée et la commande qui la rejoue.

| Élément | Valeur relevée | Commande de mesure |
|---|---|---|
| Node.js | 24.16.0 | `node -v` |
| npm | 11.13.0, préfixe `%APPDATA%\npm` | `npm -v`, `npm config get prefix` |
| Codex CLI | 0.171.0, dernière publiée le 21/11 | `codex --version`, `npm view @openai/codex version` |
| Gemini CLI | 0.70.0, dernière publiée le 21/11 | `gemini --version`, `npm view @google/gemini-cli version` |
| Connexion Codex | « Logged in using ChatGPT » | `codex login status`, code de retour 0 |
| Diagnostic Codex | 17 contrôles verts, 2 avertissements, 0 échec | `codex doctor` |
| Connexion Gemini | jeton de rafraîchissement présent, valeurs non lues | noms des champs de `~\.gemini\oauth_creds.json` |
| Réglages Gemini | chargés sans erreur | `gemini --list-extensions`, code de retour 0 |

Les 2 avertissements de `codex doctor` sont facultatifs. Le premier demande une exclusion Microsoft Defender pour `codex.exe` et ses aides. Le second conseille un Dev Drive pour accélérer les dépôts.

## Étape 1 — Installer les binaires

Sur ce poste, l'étape est faite. Sur l'autre poste, DESKTOP-ULTRA7, la rejouer en PowerShell :

```powershell
node -v                       # 20 ou plus exigé par Gemini CLI
npm install -g @openai/codex@0.171.0 @google/gemini-cli@0.70.0
codex --version               # attendu : codex-cli 0.171.0
gemini --version              # attendu : 0.70.0
```

Les versions sont épinglées pour que les 2 postes testent la même chose. La mise à jour se fait par `codex update` et `npm install -g @google/gemini-cli@<version>`, notée ensuite dans cette note.

## Étape 2 — Codex : configuration et authentification

### Authentification

Codex lit sa connexion dans `~\.codex\auth.json`, partagé avec l'extension VS Code. Sur ce poste, `codex login status` répond « Logged in using ChatGPT » : rien à faire.

Sur un poste neuf, la connexion passe par le compte ChatGPT :

```powershell
codex login                   # ouvre le navigateur, connexion au compte ChatGPT
codex login --device-auth     # variante sans navigateur local : un code à saisir sur une page
codex login status            # attendu : Logged in using ChatGPT
```

`codex login --with-api-key` est exclu : une clé OpenAI facture chaque appel, et la Factory n'autorise aucune API tierce payante hors Claude. Le fichier `auth.json` ne se lit pas, ne se copie pas et ne se commite pas.

### Configuration

Le fichier `~\.codex\config.toml` existe déjà, réglé par l'extension :

```toml
model = "gpt-5.6-sol"
model_reasoning_effort = "low"

[projects.'<dossier de Produit-79>']   # et 2 autres dépôts

trust_level = "trusted"

[windows]
sandbox = "elevated"
```

Aucune modification n'est nécessaire pour les essais. L'appel sans interface se règle par options, ce qui garde le fichier commun à l'extension intact :

```powershell
codex exec -C <dossier> -s read-only --json -o <reponse.txt> "<consigne>"        # lecture seule
codex exec -C <dossier> -s workspace-write --json -o <reponse.txt> "<consigne>"  # écrit dans <dossier> seulement
```

| Option | Effet | Choix pour les essais |
|---|---|---|
| `-s read-only` | aucun fichier écrit | défaut des premiers essais |
| `-s workspace-write` | écrit dans le dossier de travail seulement | essais d'écriture |
| `--json`, `-o <fichier>` | journal d'événements JSONL, dernière réponse dans un fichier | toujours, pour juger sur pièce |
| `--ephemeral` | aucune session gardée sur disque | essais jetables |
| `--dangerously-bypass-approvals-and-sandbox` | aucun bac à sable | exclu |

Un profil propre aux essais peut s'ajouter plus tard dans `~\.codex\essai.config.toml`, appelé par `codex exec -p essai`. Il n'est pas créé : les options suffisent tant que les essais ne sont pas définis.

## Étape 3 — Gemini : configuration et authentification

### Authentification

Gemini lit sa connexion dans `~\.gemini\oauth_creds.json`, posé par l'extension le 13/11 et partagé avec elle.

Le mode sans interface exige en plus que la méthode soit déclarée. Sans elle, le code installé répond « Please set an Auth method in your settings.json ». La session a donc écrit `~\.gemini\settings.json`, qui n'existait pas :

```json
{
  "security": {
    "auth": { "selectedType": "oauth-personal" },
    "folderTrust": { "enabled": true }
  },
  "general": { "defaultApprovalMode": "default" },
  "privacy": { "usageStatisticsEnabled": false }
}
```

`oauth-personal` correspond au choix « Login with Google », celui de l'extension. Le contrôle des dossiers de confiance reste actif et l'approbation reste demandée par défaut. Les statistiques d'usage envoyées à Google sont coupées.

Sur un poste neuf, la connexion se fait une fois en mode interactif :

```powershell
gemini                        # choisir « Login with Google », le navigateur s'ouvre
```

`GEMINI_API_KEY` et Vertex AI sont exclus pour la même raison que la clé OpenAI : ce sont des voies facturées à l'appel.

### Configuration de l'appel sans interface

Le code installé pose 2 conditions, relevées dans le paquet 0.70.0. La méthode de connexion doit être déclarée, ce que fait le fichier ci-dessus. Le dossier doit être de confiance : le confirmer une fois en mode interactif, ou passer `--skip-trust` pour un seul appel.

```powershell
gemini -p "<consigne>" --approval-mode plan --output-format json         # lecture seule
gemini -p "<consigne>" --approval-mode auto_edit --output-format json    # écrit des fichiers sans demander
```

| Option | Effet | Choix pour les essais |
|---|---|---|
| `--approval-mode plan` | lecture seule | défaut des premiers essais |
| `--approval-mode auto_edit` | approuve les éditions de fichiers, pas les commandes | essais d'écriture |
| `--output-format json` ou `stream-json` | réponse structurée, jugeable par script | toujours |
| `--yolo` | approuve toute commande | exclu |

### Fichier de consignes

Gemini lit `GEMINI.md` à la racine du projet. Le réglage `context.fileName` lui ferait lire `AGENTS.md` à la place. Il n'est pas posé : le `AGENTS.md` de Produit-79 s'adresse à Codex par son nom et lui dicte la signature `par codex`.

## Étape 4 — Ce que la file de Produit-79 demandera pour Gemini

Ces fichiers appartiennent à Produit-79 et ne s'écrivent que depuis une session ouverte chez lui. La session du pilot n'a aucun mandat d'écriture dans les produits. Le contenu est prêt :

- `queue\local\config.env` : `QUEUE_ASSIGNEES="claude codex gemini humain"` ;
- `queue\local\routage.md` : une ligne par type de travail confié à Gemini, avec sa raison ;
- `GEMINI.md` à la racine : la copie des règles de `AGENTS.md`, signature `par gemini`, mêmes interdits ;
- `queue\local\RELAIS.md` : l'écoute de Gemini, qui n'a pas d'équivalent du `wait` de Codex.

Le type de travail confié à Gemini reste à choisir après les essais, sur ce qu'ils montreront.

## Ce qui reste avant les essais

1. **Décision D-226 : qui lance les agents pendant les essais.** Les commandes `codex exec` et `gemini -p` consomment l'abonnement à chaque appel. Elles peuvent être lancées par la session dans un dossier d'essai jetable, ou par vous seul. Lancer Codex chez Produit-79 reste interdit par son `CLAUDE.md` tant que ce produit n'a pas décidé autrement.
2. **Preuve de la connexion Gemini.** Le jeton est présent, mais aucun appel n'a été fait : le premier essai le prouvera ou le démentira.
3. **Autre poste.** DESKTOP-ULTRA7 n'a reçu ni les binaires ni `~\.gemini\settings.json` : rejouer les étapes 1 à 3 à sa prochaine ouverture.

L'exclusion Microsoft Defender signalée par `codex doctor` est facultative. Elle demande des droits d'administrateur ; à poser seulement si un essai bute sur un blocage de l'antivirus.

## Essais envisagés, pour la suite

Ces 5 essais vont du plus sûr au plus complet ; chacun a son résultat attendu, à juger sur pièce.

| N° | Essai | Résultat attendu |
|---|---|---|
| E1 | `codex exec -s read-only` dans un dossier jetable : « liste les fichiers » | code de retour 0, réponse dans `-o`, aucun fichier modifié |
| E2 | `gemini -p --approval-mode plan` sur la même consigne | JSON valide, aucun fichier modifié, connexion prouvée |
| E3 | écriture d'un fichier par chaque agent en mode d'écriture borné | fichier créé dans le dossier, rien au-dehors |
| E4 | un ticket de file factice traité sans interface par chaque agent | claim, reçu et commit `par <agent>` conformes au protocole |
| E5 | relais complet Claude, Codex, Gemini sur 1 ticket | 3 reçus datés, aucune relance humaine |

## Sources

- `queue\local\config.env`, `queue\local\routage.md`, `queue\relais.json`, `queue\tickets\` et `AGENTS.md` de Produit-79, lus le 21/11/2026 ;
- `local\INSTANCES.md` de `digit-ai-queue`, ligne 28 ;
- la revue L99 du 13/11 de Produit-79, chapitre 8, « Ce qui reste à votre décision » ;
- `codex --help`, `codex exec --help`, `codex login --help`, `codex doctor`, joués le 21/11 sur Codex CLI 0.171.0 ;
- `gemini --help` et le paquet `@google/gemini-cli` 0.70.0 installé, schéma des réglages et contrôles du mode sans interface.
