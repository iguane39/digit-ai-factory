---
destinataire: humain
---

# Synthèse Conseil — prompt du skill make-it-better passé au crible L99, 2 décisions attendues (02/11/2026)

## 0. Synthèse d'ouverture

Le prompt est réécrit, et rien n'est encore construit. Pour vous, il change surtout une chose : le test dira vraiment si l'itération a un intérêt, car ma première règle de conclusion réussissait par hasard près d'une fois sur 2. Il garantit aussi l'abonnement, l'option d'isolation la plus évidente exigeant une clé API, et il tient vos documents hors des dépôts publics. Vous avez 2 choix à faire ci-dessous, sur la comparaison dans la page et sur les formats, puis à dire « exécute » pour lancer la construction.

Livré : [Prompt du skill make-it-better](output/04-plans/Digit-AI%20-%20Prompt%20-%20Skill%20make-it-better%20et%20page%20de%20versions%20-%2020261102e.md) · [Analyse L99 du prompt](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20skill%20make-it-better%20passe%20au%20crible%20L99%20-%2020261102d.md)

## 1. En-tête d'identification

Analyse L99 (examen d'un prompt en 8 couches) en mode boucle, sur le pilot `digit-ai-factory`, le 02/11/2026 de 09:39 à 10:06, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, skills `prompt-analyzer-l99` et `quality-oracles`, 12 agents `verificateur` en lecture seule ; escalade de modèle : aucune.

Intention de la demande : obtenir un prompt qui fasse construire un skill d'itération et sa page de versions par l'abonnement, pour vérifier sur 5 ou 6 documents si l'itération a un intérêt.

Test rétro : le résultat sert cette intention. Le prompt construit l'outil et fixe d'avance comment conclure, et le test reste pour plus tard, comme vous l'écrivez.

## 2. Verdict en une ligne

Le prompt passe de 37 à 84 sur 100, mesuré à la passe 3 par 2 relecteurs aveugles (86 et 84) ; la version remise y ajoute 14 corrections vérifiées et non renotées.

## 3. Décisions attendues

> **D-122 — Faut-il ajouter à la page de versions du skill make-it-better la comparaison côte à côte et la courbe des mots, comme sur la vidéo ?**
>
> - **De quoi s'agit-il** : 2 éléments de la page de la vidéo, en plus du menu de gauche que vous décrivez : un onglet qui montre 2 versions côte à côte, et une courbe du volume de texte par tour.
> - **Le problème** : vous citez « comme sur la vidéo » puis vous ne décrivez que le menu, le commentaire et le filtre. La comparaison montre ce qu'une version apporte, mieux que son commentaire écrit par le modèle ; elle ajoute du code à recetter, et elle se coupe en revue à l'aveugle.
> - **Pourquoi vous** : c'est du contenu visible que vous n'avez pas demandé nommément, et je n'ajoute pas ce contenu sans votre accord.
> - **Recommandation : (a)** — la comparaison sert votre jugement à chaque version, alors que la courbe répète ce que le menu chiffre déjà. Source consultée : `output/03-etudes/Digit-AI - Revue - Prompt skill make-it-better passe au crible L99 - 20261102d.md`, chapitre 8.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Ajouter la comparaison côte à côte | Un onglet compare une version à la précédente, et il disparaît en revue à l'aveugle. Pas de courbe. | simple × court | Possible, retirer l'onglet |
| (b) Ajouter la comparaison côte à côte et la courbe des mots | Les 2 éléments, comme sur la vidéo. | moyen × court | Possible, retirer les 2 |
| (c) Ne pas ajouter la comparaison ni la courbe | La page garde le menu, le commentaire, les mots ajoutés et retirés, le filtre et l'aperçu. | aucun | Sans objet |

> **Sans réponse** : (c), la page reste celle que vous décrivez.

> **D-123 — Quels formats le skill make-it-better doit-il accepter pour vos 5 ou 6 documents de test : Markdown et HTML seuls, ou aussi Word et PDF convertis ?**
>
> - **De quoi s'agit-il** : le type de fichier que le skill sait faire itérer, puis afficher dans l'aperçu de la page.
> - **Le problème** : votre message dit « documents » après avoir parlé de « pages de contenus ». Markdown et HTML se modifient et s'affichent directement ; un Word ou un PDF passerait par une conversion qui perd sa mise en page.
> - **Pourquoi vous** : vous seul savez quels documents vous donnerez au test.
> - **Recommandation : (a)** — elle couvre des pages de contenu sans conversion, et je ne connais encore aucun de vos documents. Source consultée : aucune source disponible ne répond, la réponse dépend de vos documents.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Markdown et HTML seuls | Le skill refuse tout autre format, avec un message qui le nomme. Un Word se convertit avant de lancer. | aucun coût ajouté | Possible, ajouter un format plus tard |
| (b) Ajouter Word et PDF, convertis en Markdown avant le premier tour | Le test porte sur le texte, et la mise en page d'origine ne compte plus. | moyen × court | Possible, retirer la conversion |
| (c) Garder Word et PDF dans leur format à chaque tour | Le modèle modifie le fichier d'origine, et l'aperçu passe par un rendu à chaque version. | complexe × moyen | Possible, retirer ces formats |

> **Sans réponse** : (a), le skill accepte Markdown et HTML.

## 4. Traité

- **Mesures de votre condition « abonnement ».** `claude -p` rend exit 0 à 09:40, `apiKeySource` à `none`, modèle servi `claude-opus-5-5`. L'option `--bare` exige une clé API selon `claude --help` : le prompt l'interdit.
- **Mesure du confinement.** À 09:53, 2 appels réels : une lecture et une écriture hors du dossier sont refusées, avec et sans `--restricted`. Le prompt retient `--restricted`.
- **Mesure du quota.** `rate_limit_event` rend `utilization` à 0,23 sur 7 jours, retour à zéro le 05/11/2026 à 08:00. Le lanceur fait une pause à 0,80 et ne passe jamais en dépassement.
- **Piège trouvé.** Depuis Node sous Windows, `spawnSync("claude")` rend ENOENT ; le prompt impose `claude.exe`, sans shell.
- **Règle de conclusion.** Ma 1re version était atteinte par hasard dans 48,5 % des cas sur 6 documents. Celle du prompt compare une seule version par document et rend 3 issues : intérêt, pas d'intérêt démontré, non concluant.
- **Conflit résolu.** Votre page montre numéros et commentaires, alors que vous devez juger à l'aveugle : le prompt prévoit un mode de revue séparé, sous des lettres tirées au hasard, puis levé après votre classement.
- **Votre filtre.** Toutes, Pertinentes, Non jugées ; c'est vous qui jugez, et le modèle n'écrit jamais ce fichier.
- **Passes de relecture.** 76, 80, 84, puis 78. La passe 4 est rejetée par la règle fixée d'avance, bien que 6 de ses 8 défauts existaient déjà en passe 3.
- **Après l'arrêt.** Les 14 défauts ouverts sont fermés dans la version remise, et un agent qui ne note pas les vérifie : 8 clôtures confirmées sur 8, et 2 défauts créés, fermés ensuite.
- **Contrôles.**
  - `quality-oracles` sur l'analyse : 6 PASS, 1 SKIP, 0 échec.
  - `quality-oracles` sur le prompt : 4 PASS, 3 SKIP, 0 échec.
  - `oracle-ecriture` : PASS sur les 2.
  - `oracle-boucle-l99` sur le journal : PASS.
  - `oracle-premisse-acces` sur l'analyse : SKIP, aucune règle jouée.
- **Publication du pilot** sous le GO permanent `D-54 (b) du 03/10` : commit `3dcb03c5` limité à mes fichiers et à leurs index, `git push` exit 0, puis `git rev-list --left-right --count` rend 0 0. Cette synthèse part ensuite par le même geste.

Relecture d'intention : sans objet, les agents de ce tour notent un texte et n'écrivent rien ; le résultat a été confronté à votre demande au test rétro du bloc 1.

## 5. Non traité

- **La construction du skill et de la page** : motif `decision`, elle attend votre « exécute » ; vous demandiez d'améliorer le prompt.
- **Le test sur vos documents** : motif `decision`, vous donnerez les 5 ou 6 documents, chacun avec son brief et ses sources.
- **La renotation de la version remise** : motif `borne_atteinte`, la règle arrête la boucle après la passe 4 rejetée.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| les conditions citées : 2 essais au moins | 1 essai compté par document, un 2e sur le premier seulement | sinon 10 à 12 essais de 50 tours |
| les conditions citées : tours 5, 10, 20, 35, 50 | origine et tours 1, 5, 10, 20, 35, 50 | il faut comparer à une seule passe et à l'original |
| « vérifier si cela a un intérêt » | une règle à 3 issues, tour 20 contre tour 1 et origine | une règle fixée après coup ne prouverait rien |
| Opus, sans effort précisé | effort `medium` par défaut, modifiable | c'est celui de la vidéo, et il ménage le quota |
| livrables sous `output\` | versions de travail hors de tout dépôt, bilan sous `output\` | `output\` du pilot est public |

Le détail, poste par poste, est au chapitre 8 de l'analyse.

## 7. Risques

- **Quota.** Énoncé : au rythme de la vidéo, 6 documents à 50 tours en Opus prendraient environ 25 h, et votre travail courant partage la même fenêtre de 7 jours. Signal : le quota par tour relevé sur le premier document. Parade : le premier document tourne seul, puis la prévision et la pause à 0,80 s'appliquent.
- **Juge unique.** Énoncé : un seul juge sur 5 ou 6 documents donne une indication, pas une preuve. Signal : un résultat proche du seuil. Parade : l'issue « non concluant » existe, et le bilan écrit ses limites.
- **Texte non renoté.** Énoncé : la version remise compte 2 893 mots, et sa dernière note à l'aveugle porte sur un texte voisin. Signal : un défaut qui apparaît à la construction. Parade : la recette du prompt le fera sortir, et ses cas sont nommés.

## 8. Prochaines actions

Une seule action, parce que la construction dépend de votre accord.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lancer la construction du skill et de sa page avec ce prompt, et trancher les 2 choix | neuve | manuelle_utilisateur | decision, les écarts du prompt et les 2 choix vous reviennent | répondre dans cette conversation, par exemple « exécute, D-122 a, D-123 a » ; le prompt est dans `output/04-plans/` | si rien n'est fait, le skill n'existe pas et le test ne peut pas commencer |

## 9. Traces

- Prompt : `output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102e.md`.
- Analyse : `output/03-etudes/Digit-AI - Revue - Prompt skill make-it-better passe au crible L99 - 20261102d.md`.
- Journal des passes : le même chemin, suffixé `.boucle.json`.
- Registre des décisions : `decisions/REGISTRE.jsonl`, D-122 et D-123.
- Passes de travail et mesures : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\0b4662f2-8eb1-4522-a97d-3a9afc6510cd\scratchpad\l99`.
