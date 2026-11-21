---
lecteur: le porteur, administrateur du poste, qui rejoue les commandes et tranche la suite des essais
---

# Essais de Codex et Gemini en ligne de commande

Note du 21/11/2026, poste Dell-XPS-16. Les essais ont été joués de 12:50 à 13:10 sous D-226 a, dans un dossier jetable hors de tout produit.

## Ce qui change pour vous

Codex fonctionne en lecture seule sans interface, mais il ne peut pas encore écrire : son bac à sable Windows demande une installation par un administrateur. Gemini CLI ne fonctionne plus avec un compte Google personnel : le serveur de Google refuse ce client et renvoie vers Antigravity, son remplaçant.

Sur les 5 essais prévus par la note 20261121d, 1 réussit, 2 échouent et 2 n'ont pas pu partir. Il reste 1 geste d'administrateur pour Codex et 1 décision pour Gemini.

## Résultats des 5 essais

Chaque ligne donne la commande jouée, le résultat mesuré et la cause quand l'essai échoue.

| N° | Essai | Résultat | Mesure |
|---|---|---|---|
| E1 | `codex exec -s read-only` : lister les fichiers et compter les lignes | réussi | code de retour 0 en 19 s ; réponse juste, « 3 lignes » ; 0 fichier modifié ; 43 779 jetons lus, dont 40 448 en cache |
| E2 | `gemini -p --approval-mode plan` sur la même consigne | échoué | code de retour 1 en 3 s : « This client is no longer supported for Gemini Code Assist for individuals » |
| E3 | `codex exec -s workspace-write` : écrire `resultat.txt` | échoué | aucun fichier écrit ; chaque commande rend « setup helper exited with status Some(143) » |
| E4 | un ticket de file factice traité sans interface | non joué | il exige qu'un agent écrive, ce qu'aucun des 2 ne fait encore |
| E5 | relais complet Claude, Codex, Gemini | non joué | même cause |

Le témoin posé hors du dossier d'essai est resté intact, et le dépôt d'essai n'a reçu aucun commit.

## Codex : la lecture marche, l'écriture attend le bac à sable

Le réglage `[windows] sandbox = "elevated"` de `~\.codex\config.toml` fait passer chaque commande d'écriture par une aide d'installation, `codex-windows-sandbox-setup.exe`. Cette aide demande les droits d'administrateur, qu'une session sans fenêtre ne peut pas accorder. Elle s'arrête alors, et Codex abandonne la commande.

3 variantes ont été jouées, chacune bornée dans le temps :

- le réglage d'origine : le tour s'est fini sur « l'accès au terminal est bloqué » après 324 464 jetons lus. Le processus est ensuite resté ouvert avec 2 aides en attente, et il a été arrêté à la main ;
- les 2 options de l'extension VS Code, `code_mode_host` et `windows_sandbox_service` : 10 commandes tentées, 10 refusées par la même aide, arrêt à 180 s ;
- le mode `windows.sandbox="unelevated"` : arrêt à 150 s sur une erreur de transport de l'hôte d'exécution de Codex.

La lecture seule n'a pas besoin de cette aide : c'est pourquoi E1 réussit. Le mode qui supprime le bac à sable, `--dangerously-bypass-approvals-and-sandbox`, reste exclu.

Le geste attendu est une installation du bac à sable, faite une fois par un administrateur, dans une fenêtre où l'invite d'élévation peut s'afficher :

1. Ouvrir PowerShell dans le dossier d'essai que la session nommera.
2. Lancer `codex` en mode interactif, puis lui demander de créer un fichier.
3. Accepter l'installation du bac à sable et l'invite d'élévation de Windows.

Ce geste est une hypothèse, non vérifiée. Rien ne prouve encore qu'une installation faite pour un dossier vaille pour les suivants. Rien ne prouve non plus que la session puisse ensuite écrire sans fenêtre.

L'essai E3 rejoué après le geste le dira.

## Gemini : le client personnel est fermé par Google

Le message de refus n'existe pas dans le paquet `@google/gemini-cli` 0.70.0 installé : il vient du serveur. Le paquet contient en revanche l'installeur de son remplaçant, Antigravity.

Les 4 fichiers de conversation laissés par l'extension Gemini Code Assist le 13/11 ne contiennent que le contexte d'ouverture. Ce constat s'accorde avec un refus déjà actif ce jour-là : l'extension n'a vraisemblablement jamais travaillé sur ce poste.

Le script d'installation d'Antigravity a été téléchargé et lu, pas exécuté. Il pose `agy.exe` dans `%LOCALAPPDATA%\agy\bin`, pour l'utilisateur seul, sans droits d'administrateur. Il télécharge le binaire depuis un service de Google sur Cloud Run, refuse de l'installer si son empreinte SHA-512 diffère de celle annoncée, puis lance `agy.exe install`.

Non vérifiés : le prix d'Antigravity pour un compte personnel, son mode sans interface et sa connexion. Une clé d'API Gemini resterait une voie facturée à l'appel, que la Factory n'autorise pas hors Claude.

## Effets sur la note 20261121d

La note d'installation reste juste pour Codex. Pour Gemini, ses étapes d'installation et de réglage restent exactes, mais la connexion « Login with Google » ne sert plus : le serveur refuse ce client. Gemini CLI 0.70.0 et `~\.gemini\settings.json` sont laissés en place, sans effet tant que la voie de Gemini n'est pas choisie.

## Sources

- les journaux JSONL de chaque essai et leurs sorties d'erreur, gardés dans le dossier temporaire de la session ;
- `codex exec --help`, `codex sandbox --help` et la liste des processus `codex*`, relevés le 21/11 à partir de 12:50 ;
- le paquet `@google/gemini-cli` 0.70.0 installé, fichier `antigravityUtils.ts` du paquet ;
- le script `https://antigravity.google/cli/install.ps1`, téléchargé et lu le 21/11, 7 165 octets.
