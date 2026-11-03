---
destinataire: humain
---

# Synthèse Conseil — prompt « compétences OpenAI et Gemini » passé au crible L99, aucune décision attendue (03/11/2026)

## 0. Synthèse d'ouverture

Le prompt est réécrit et rien n'est encore étudié ni construit. Pour vous, il change une chose : votre question en cachait deux, aider un produit qui appelle OpenAI ou Gemini, ce que la doctrine permet, et faire appeler ces fournisseurs par la Factory elle-même, ce qu'elle interdit sans votre accord. Le prompt les traite à part et fixe d'avance ce que « pertinent » veut dire. Il vous reste à relire les 4 écarts à votre texte, puis à dire « exécute » pour lancer l'étude.

Livré : [Prompt de l'étude OpenAI et Gemini](output/04-plans/Digit-AI%20-%20Prompt%20-%20Competences%20OpenAI%20et%20Gemini%20dans%20la%20Factory%20-%2020261103i.md) · [Analyse L99 du prompt](output/03-etudes/Digit-AI%20-%20Revue%20-%20Prompt%20competences%20OpenAI%20et%20Gemini%20passe%20au%20crible%20L99%20-%2020261103c.md)

## 1. En-tête d'identification

Analyse L99 (examen d'un prompt en 8 couches) en mode boucle, sur le pilot `digit-ai-factory`, le 03/11/2026 de 14:54 à 15:25, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, skills `prompt-analyzer-l99` et `quality-oracles`, 10 agents `verificateur` en lecture seule ; escalade de modèle : aucune.

Intention de la demande : savoir s'il faut ajouter à la Factory des compétences pour les API et bibliothèques d'OpenAI et de Gemini, par un prompt amélioré qui le fera établir.

Test rétro : le résultat sert cette intention. Le prompt fait rendre 4 verdicts fondés sur des faits mesurés, et chaque « oui » doit nommer la compétence, sa forge et son véhicule.

## 2. Verdict en une ligne

Le prompt passe de 22 à 86 sur 100, mesuré à la passe 3 par 2 relecteurs aveugles (86 et 88) ; la version remise y ajoute 11 corrections vérifiées et non renotées.

## 3. Décisions attendues

Aucune décision ne vous revient : les 4 écarts du bloc 6 se valident avec le prompt, au lancement.

## 4. Traité

- **Existant mesuré par `git grep`.** 3 dépôts appellent OpenAI ou Gemini dans leur code (14:55) : Produit-12 porte les deux fournisseurs en REST, forge-design génère des images avec Gemini, Produit-64 n'en a qu'une fixture. 1 dépôt déclare `openai>=1.50` (15:09). 28 dépôts et 3 copies de travail en font mention (15:14).
- **Accès à la documentation mesuré par `curl` à 14:56.** Code 200 sur 8 adresses, dont les deux index `llms.txt` (40 et 225 liens à 15:09) ; 403 sur `platform.openai.com`, porte fermée alors que `developers.openai.com` répond.
- **Deux trous de la Factory trouvés.** L'oracle de dépense reconnaît `OPENAI_API_KEY` mais ni `GEMINI_API_KEY` ni l'adresse de l'API Gemini (`oracle-depense-voie-par-defaut.mjs:54`). `INVENTAIRE.md`, ligne 59, dit le générateur d'images Gemini non implémenté alors que `generer-images.mjs` existe.
- **Le skill `claude-api` se tait devant OpenAI et Gemini**, d'après sa description relevée dans la liste des skills de la session ; aucune des 20 fiches d'experts ne cite ces fournisseurs.
- **Boucle de relecture.** Passes mesurées à 74, 84 puis 86 ; arrêt sur un gain de 2 points, sous le minimum de 3. Avant chaque relecture, un vérificateur qui ne note pas a contrôlé les clôtures : 5 sur 6 deux fois, 6 défauts créés au total, tous corrigés.
- **Après l'arrêt.** 8 défauts fermés dans la version remise, 8 clôtures confirmées par un vérificateur, puis 3 défauts créés corrigés.
- **Prémisse corrigée par la session seule.** Mon relevé disait 0 dépendance déclarée ; rejoué avec un motif plus large, il en trouve 1. Aucun des 6 relecteurs ne l'avait vu.
- **Collision d'indice réparée.** Une autre session a pris l'indice « g » pendant mon travail ; le prompt est renommé en « i », renvois corrigés.
- **Chemin réparé après la porte des noms.** Le crochet de commit a pseudonymisé le nom du dossier client dans un chemin du relevé, qui ne menait plus nulle part. Le périmètre s'énumère désormais par `find`, qui liste 56 dépôts et 4 copies de travail à 15:20, sans nommer le dossier ; commit `8a852c1c`.
- **Publication du pilot** sous le GO permanent `D-54 (b) du 03/10` : commits `fb45dcb2` et `8a852c1c` limités à mes fichiers et à leurs index. `git push` exit 0, puis `git rev-list --left-right --count` rend 0 0. Le même envoi a publié 8 commits déjà enregistrés par une autre session du poste, ce que la règle admet ; cette synthèse part ensuite par le même geste.
- **Contrôles.**
  - `quality-oracles` sur l'analyse : 6 PASS, 1 SKIP, 0 échec.
  - `quality-oracles` sur le prompt : 6 PASS, 1 SKIP, 0 échec.
  - `oracle-ecriture` : exit 0 sur les 2.
  - `check_markdown.py` : PASS sur les 2.
  - `oracle-premisse-acces` sur l'analyse : PASS.
  - `oracle-boucle-l99` sur le journal : PASS.

Relecture d'intention : sans objet, les agents de ce tour notent ou vérifient un texte et n'écrivent rien ; le résultat a été confronté à votre demande au test rétro du bloc 1.

## 5. Non traité

- **L'étude elle-même** : motif, dépendance à une décision humaine ; elle attend votre « exécute », et vous demandiez d'améliorer le prompt.
- **L'inscription au registre des 2 trous de la Factory** : motif, hors mandat de ce tour ; le prompt les fait inscrire par le run, et le registre porte des écritures non enregistrées d'une autre session que je ne veux pas emporter.
- **La renotation de la version remise** : motif, écarté ; la règle arrête la boucle sur un gain inférieur à 3 points, critère de réouverture : une demande « L99 boucle » sur ce prompt.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « rajouter des compétences » | étudier et recommander, la construction par un mandat séparé | construire avant de savoir si un produit en a besoin |
| « dans la Factory » | deux questions, compétence produit et usage par la Factory | la doctrine les traite à l'opposé |
| « APIs et/ou Bibliothèques » | les fonctionnalités des deux API, plus les bibliothèques officielles Node et Python | ce sont les langages du parc mesuré |
| « Vois s'il est pertinent » | 4 verdicts fondés sur un critère mesuré | un avis sans critère ne se contredit pas |

Les 4 sont des écarts de manière d'exécuter ; aucun contenu visible n'est ajouté au-delà de la réponse.

## 7. Risques

- **Score surévalué.** Énoncé : les 3 passes notées portaient la prémisse fausse des dépendances, et une prémisse fausse vaut un bloquant. Signal : un autre chiffre de l'étape 0 démenti au rejeu. Parade : le prompt dit que le rejeu fait foi, et l'étude écrit l'ancien et le nouveau chiffre.
- **Texte non renoté.** Énoncé : la version remise compte 2 369 mots, et sa dernière note porte sur la passe 3, de 2 019 mots. Signal : un défaut qui apparaît à l'exécution. Parade : le protocole de tests du prompt contrôle chaque extrait et rejoue le relevé.

## 8. Prochaines actions

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lancer l'étude OpenAI et Gemini avec ce prompt, après avoir relu les 4 écarts | neuve | manuelle_utilisateur | decision, le lancement et les écarts vous reviennent | répondre « exécute » dans cette conversation ; le prompt est sous `output/04-plans/` | sans lancement, la question reste sans réponse et les 2 trous de garde restent ouverts |

## 9. Traces

- Prompt : `output/04-plans/Digit-AI - Prompt - Competences OpenAI et Gemini dans la Factory - 20261103i.md`.
- Analyse : `output/03-etudes/Digit-AI - Revue - Prompt competences OpenAI et Gemini passe au crible L99 - 20261103c.md`.
- Journal des passes : le même chemin, suffixé `.boucle.json`.
- Passes de travail et défauts : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\a0b92278-318b-4727-aa5e-4ab9fb1eb010\scratchpad\l99`.
