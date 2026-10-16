---
destinataire: humain
---

# Synthèse Mandat — installateur publié, commande Windows fiabilisée après mesure sur l'adresse publique (13/10/2026)

## 0. Synthèse d'ouverture

L'installateur est en ligne : votre accord de publier avait déjà été exécuté par une autre session, et la page publique le sert. En le jouant depuis cette adresse sur un poste neuf, j'ai trouvé un vrai défaut : la commande d'une ligne que nous documentions pour Windows a échoué 2 fois sur 3, en découpant le script. La commande documentée télécharge désormais l'installateur dans un fichier avant de l'exécuter ; sur un poste neuf, elle finit sur « FACTORY DIGIT-AI OPÉRATIONNELLE », 8 contrôles sur 8. Cette correction n'est pas encore en ligne, car elle est enregistrée au-dessus d'un enregistrement d'une autre session que vous n'avez pas autorisé : j'attends votre accord pour publier les deux.

## 1. En-tête d'identification

- **quoi** — exécution de votre réponse « 1a » : publication du pilot, puis passage de l'installateur par son adresse publiée sur un poste simulé neuf.
- **sur quoi** — pilot `digit-ai-factory`, publié jusqu'à `b6e66279` ; correctif `61a21c63` enregistré, non publié.
- **quand** — 2026-10-13, de 17:07 à 18:15 UTC+02:00 (Europe/Paris), heures relevées par `date`.
- **qui** — session de pilotage Claude Opus 5.5 (`claude-opus-5-5[1m]`), sans agent ; escalade : aucune ; outils joués : `git fetch` et `git rev-list`, `installer.ps1` téléchargé depuis `raw.githubusercontent.com`, `Parser::ParseFile`.
- **intention** — qu'un développeur qui ne connaît que l'adresse du dépôt obtienne la factory installée sur son projet, sans question. **Test rétro** : l'installateur publié sert cette intention par la voie fichier, mesurée verte ; la commande une-ligne publiée, elle, échoue encore 2 fois sur 3 tant que `61a21c63` n'est pas en ligne (D-2).

## 2. Verdict en une ligne

**PARTIEL — publication de `b6e66279` constatée (0 commit d'écart avec GitHub) ; la commande `irm | iex` publiée échoue 2 fois sur 3, la commande corrigée « télécharger puis exécuter » rend 8/8 contrôles verts et exit 0 sur poste neuf, non publiée.**

## 3. Décisions attendues de l'humain

Le seul bloquant qui retient la suite, ce qui le lève, et ce qui se passe sinon :

- la publication de la commande Windows corrigée : votre décision D-2 ; sans elle, l'agent d'un développeur Windows lit encore la commande `irm | iex`, qui a échoué 2 fois sur 3 au poste neuf.

> **D-2 — Publiez-vous le pilot `digit-ai-factory` jusqu'à `61a21c63`, qui emporte aussi l'enregistrement `22cee592` d'une autre session ?**
>
> Rappel du sujet : ma correction `61a21c63` change la commande Windows dans `AGENTS.md`, `README.md`, les 2 prompts canoniques et l'en-tête de `installer.ps1`. Elle est enregistrée au-dessus de `22cee592`, le registre de la campagne du 13/10 d'une autre session, non publié et hors de votre accord « 1a ». Publier l'une publie l'autre.
>
> **Recommandation : publier les deux maintenant.** Source consultée : `git log --oneline origin/main..HEAD`, qui liste ces 2 enregistrements et rien d'autre, et le passage vert de la voie fichier sur poste neuf.

| Option | Coût | Exclusions |
|---|---|---|
| (a) publier `22cee592` et `61a21c63` ensemble | complexité faible · durée courte | aucune |
| (b) attendre que l'autre session publie `22cee592`, puis publier `61a21c63` | complexité faible · durée inconnue | la commande défaillante reste en ligne d'ici là |

> **Si rien n'est décidé** : la seconde option par défaut, la correction reste locale.

## 4. Traité — avec sa preuve

Ce tour a constaté la publication, mesuré l'installateur par son adresse publique, trouvé un défaut et corrigé la commande.

- **Publication de « 1a » constatée** : une autre session avait déjà publié le pilot ; `b6e66279` est sur GitHub.
  - preuve : `git rev-list --left-right --count HEAD...origin/main` → « 0 0 » à 17:07, `git branch -r --contains b6e66279` → `origin/main`.
- **Adresse publiée servie** : `installer.ps1` répond, identique à l'octet près au fichier enregistré.
  - preuve : `curl -sI` → « HTTP/1.1 200 OK », 7 111 octets ; `od -c` du publié et de `git show origin/main:installer.ps1` identiques.
- **Défaut trouvé, sens rouge mesuré** : sur 3 passages par `irm … | iex`, 1 a réussi et 2 ont échoué ; `iex` reçoit le script ligne à ligne, avec 4 erreurs « chaîne vide » puis « accolade fermante manquante ».
  - preuve : journaux des 3 passages ; une sonde dans le même environnement rend `System.String`, 1 élément, script analysable. La cause n'est pas élucidée ; un petit script de même forme servi en local passe.
- **Voie corrigée, mesurée verte** : télécharger l'installateur publié dans un fichier puis l'exécuter, sur un poste neuf (sans node, sans git, sans identifiants, pilot cloné depuis GitHub par MinGit, le git portable de Git for Windows).
  - preuve : « FACTORY DIGIT-AI OPÉRATIONNELLE », « 8/8 contrôle(s) exécuté(s) verts », `EXIT=0`, 0 erreur « chaîne vide ».
- **Commande documentée remplacée** dans 5 fichiers, écrite sans `$` pour passer telle quelle depuis Bash, cmd ou PowerShell.
  - preuve : script de remplacement → « remplacé, relu » pour les 5 fichiers ; `Parser::ParseFile` → 0 erreur ; 0 caractère non ASCII dans `installer.ps1`. Commande exacte lancée par `cmd` → 0 erreur « chaîne vide », installateur exécuté jusqu'à sa bannière, code de sortie 1 transmis à l'appelant.
- **Enregistrement** `61a21c63` (5 fichiers).
  - preuve : `git commit --only`, exit 0.

## 5. Non traité — avec son motif

- La publication de `61a21c63`, et la mesure de la commande corrigée depuis l'adresse publique qui en dépend — motif : `dependance_bloc_3`, l'enregistrement `22cee592` d'une autre session est dessous (D-2).
- La cause de l'échec de `irm | iex` — motif : `borne_atteinte` ; 3 sondes faites (type renvoyé, éléments dans le tuyau, script local de même forme), toutes saines. La voie fichier rend la question sans objet pour le développeur.

## 6. Écarts à la lettre

- **Vous avez répondu** « 1a », publier maintenant → **je n'ai rien publié de plus que ce qu'une autre session venait de publier** → **pourquoi** : les 39 commits étaient déjà en ligne, et le seul enregistrement neuf que je pourrais pousser emporte celui d'une autre session, hors de votre accord.
- **Le passage de la commande exacte par `cmd` n'est pas vert** → **son poste simulé a trouvé le pilot réel sous `c:\dev`**, après un clone préparatoire en échec (code 128) → **pourquoi** : l'installateur cherche le pilot dans `c:\dev` par conception ; il a joué une mise à jour du parc réel, équivalente à une ouverture de session, avec une configuration Claude isolée, et il n'a rendu que le défaut du canal confidentiel déjà relevé à l'ouverture.

## 7. Risques

- Les développeurs qui ont copié la commande `irm | iex` avant la publication de la correction.
  - signal : un retour « Invoke-Expression … chaîne vide » ;
  - parade : la commande corrigée, publiée dès D-2.
- La cause de l'échec de `irm | iex` reste inconnue.
  - signal : une autre commande documentée en `irm | iex` échoue de la même façon ;
  - parade : documenter partout « télécharger puis exécuter ».

## 8. Prochaines actions

Les actions sont triées par ordre de déblocage, celles de la session d'abord.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier `22cee592` et `61a21c63` avec votre feu vert cité au contrôle de publication | `auto_ia` | TF-1637 | `dependance_bloc_3` — D-2 | la commande défaillante reste en ligne |
| **A-2** | Rejouer la commande corrigée depuis l'adresse publique sur un poste neuf | `auto_ia` | TF-1637 | `dependance_bloc_3` — D-2 | la voie réelle reste mesurée sur fichier local seulement |
| **A-3** | Répondre à D-2 | `manuelle_utilisateur` | TF-1637 | `decision` | la correction reste locale |

## 9. Traces

`AGENTS.md`, `README.md`, `PROMPT-PRODUIT.md`, `PROMPT-PRODUIT-EXISTANT.md`, `installer.ps1`, commits `b6e66279` (publié) et `61a21c63` (local).
