---
destinataire: humain
---

# Synthèse Mandat — skill make-it-better construit et publié, test à lancer sur vos documents (02/11/2026)

## 0. Synthèse d'ouverture

Le skill et sa page de versions existent, sont publiés et installés sur ce poste. Vous pouvez les utiliser dès maintenant, mais la question de fond reste ouverte : seul le test sur vos documents dira si l'itération a un intérêt. Un premier signal est à lire avec prudence : sur 12 tours d'essai, le modèle n'a jamais répondu « rien à changer », ni proposé un simple retrait. Il me faut maintenant vos 5 ou 6 documents, et pour chacun son lecteur, son objectif et ses sources.

## 1. En-tête d'identification

Construction d'un skill, sur le dépôt `digit-ai-forge-agents`, pilotée depuis `digit-ai-factory`, le 02/11/2026 de 10:29 à 13:05, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, 1 agent `constructeur` Opus de 10:30 à 12:51 et 836 967 jetons, 1 agent `verificateur` de relecture ; escalade de modèle : aucune, Opus retenu d'emblée pour une construction d'ampleur.

Intention de la demande : disposer d'un skill d'itération par l'abonnement, avec une page qui centralise les versions, pour vérifier sur 5 ou 6 documents si l'itération a un intérêt.

Test rétro : le résultat sert cette intention pour l'outil. Le test lui-même attend vos documents, comme vous l'avez prévu en écrivant « on fera le test ».

## 2. Verdict en une ligne

Recette rejouée par le pilot : 675 contrôles sur 675 du skill, `oracle-skills` PASS, 39 fichiers publiés ; chez l'agent, 12 tours réels sur fixtures et 61 contrôles sur 61 en navigateur.

## 3. Décisions attendues

Aucune décision ne vous revient à ce stade.

## 4. Traité

- **Votre « 214a ».** `D-214` n'existe pas, le registre s'arrêtant à D-125 : je l'ai lu comme `D-124 (a)` et comme le feu vert.
- **Le skill.** `make-it-better` accepte Markdown, HTML, Word et PDF, par `lancer.mjs`, `serveur-versions.mjs` et `bilan.mjs`. Commits `b29590c` et `44a8cde`, `git push` exit 0, puis `git rev-list --left-right --count` rend 0 0.
- **Vos conditions, mesurées.** 16 appels réels sur 16 avec `apiKeySource` à `none`, donc l'abonnement. `--bare` absent, Opus par défaut, Sonnet par `--modele sonnet`.
- **La page.** Menu à gauche avec commentaire et mots ajoutés ou retirés, filtre Toutes, Pertinentes, Non jugées, aperçu et onglet Comparer. J'ai regardé 4 captures, sur écran large et à 390 px : la revue à l'aveugle ne montre ni numéro ni commentaire.
- **Mon contrôle sur la copie installée.** Un espace dans un dépôt git est refusé, un `.txt` est refusé, et la page répond 200 sur les 4 essais de recette.
- **Oracles de la page, chez l'agent.** `check_html.py`, `render_page.py` et `run-oracles-design.mjs` en exit 0, après sa dernière écriture.
- **Faits inventés.** `oracle-faits-sources` entre au registre de `quality-oracles`, version 2.49.0, avec une paire rouge et verte.
- **Registre.** TF-2061 pour le skill, TF-2062 pour 2 constats sur Word en automation. L'agent proposait de clore TF-2050 et TF-2051 : je les laisse ouverts avec une note, car ces briques ne valent que dans ce skill.
- **Nettoyage de mes tests.** L'entrée désactivée de Word `646A9B`, qui citait mon PDF de banc, est retirée. Le serveur du port 4799 est arrêté. Aucun Word ne reste ouvert.

Relecture d'intention : sert, entrée `RI-20261102-06` sur la consigne, 2 écarts mineurs : votre « 214a » et le test renvoyé à plus tard.

## 5. Non traité

- **Le test sur vos documents** : motif `decision`, vous seul pouvez les désigner.
- **Le rejeu des 12 tours réels et du parcours navigateur par le pilot** : motif `hors_perimetre`, j'ai rejoué le banc sans modèle et regardé les captures, pour ne pas consommer de quota une 2e fois.
- **TF-2050 et TF-2051 hors de ce skill** : motif `hors_perimetre`, une page servie de produit, `ameliore-le-design`, `critique-le-design` et `la-boucle` ne changent pas.

## 6. Écarts à la lettre

Le construit s'écarte du prompt sur 4 points visibles, et sur 5 points de détail listés sous le tableau.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Installation par `bootstrap`, écrit dans mon prompt | `oracle-skills --appliquer` | `bootstrap` n'installe pas un skill nouveau ; mon prompt se trompait |
| Python seul hors de Node | Aussi un script PowerShell pour Word | `pywin32` est absent du poste |
| Rejets PDF prévus : 2 | 6 de plus, dont une ligne ambiguë et un caractère sans glyphe | chacun casserait la page en silence |
| Rien sur le budget de quota | `bilan.mjs --restants <n>` en plus | il outille la prévision que le prompt demande |

Points de détail, relevés dans le rapport de l'agent :

- une balise changée dans le XML d'un Word sans casser le fichier n'est pas rejetée, alors que la consigne l'interdit au modèle ;
- le XML d'un Word est présenté à une ligne par paragraphe, pour que `Read` lise un long document ;
- sans version entre les tours 10 et 20, la version cible est la première retenue de numéro 10 ou plus ;
- une réponse « rien » ne compte pas comme une version gardée, ni à l'aveugle ni au bilan ;
- une source `.docx` doit venir avec un `.txt`, faute de quoi le lancement est refusé.

## 7. Risques

- **Votre feu vert.** Énoncé : j'ai interprété « 214a » comme un lancement. Signal : ce n'était pas votre intention. Parade : le skill se retire du dépôt, et aucun document réel n'a été touché.
- **Quota inconnu.** Énoncé : `utilization` ne bouge pas sur ces petits tours, lue au centième, de 22 à 103 secondes par tour. Signal : l'écart relevé sur votre premier document. Parade : il tourne seul, puis la pause à 0,80 et `bilan.mjs --restants` s'appliquent.
- **Branches peu éprouvées.** Énoncé : sur 12 tours réels, 0 réponse « rien » et 0 retrait ; ces branches ne sont prouvées qu'en simulation. Signal : un rejet inattendu sur un vrai tour. Parade : le contrôle écrit son motif dans `controle.json`.
- **Échec intermittent.** Énoncé : le cas de coupure a échoué 1 fois sous charge, sans cause prouvée, puis jamais sur 21 rejeux. Signal : une reprise refusée. Parade : `--reprendre` refuse sans perdre de tour.
- **Word.** Énoncé : l'entrée désactivée « Générateur d'aperçu Microsoft Word » reste au registre, sans origine établie, et mes tests peuvent l'avoir créée. Signal : un aperçu de Word absent dans l'Explorateur ou Outlook. Parade : Word, Fichier, Options, Compléments, Éléments désactivés, puis Activer.

## 8. Prochaines actions

Ordre : la première action débloque le test, et la seconde reste facultative, pour voir la page avant.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Me donner vos 5 ou 6 documents, et pour chacun son lecteur, son objectif et ses sources, pour que je prépare les espaces et lance le premier | TF-2061 | manuelle_utilisateur | decision, seul le porteur sait quels documents tester | répondre dans cette conversation avec les chemins ; lancement : `node "$env:USERPROFILE\.claude\skills\make-it-better\scripts\lancer.mjs" --document "<chemin>" --espace "C:\dev\_essais-make-it-better\<AAAAMMJJ>-<nom court>" --tours 50` | si rien n'est fait, la question de l'intérêt reste sans réponse |
| A-2 | Ouvrir la page sur les 4 essais fictifs de la recette, à l'adresse `http://127.0.0.1:4750/`, pour la voir avant le test | TF-2061 | manuelle_utilisateur | presence, la page se regarde à l'écran et un serveur laissé ouvert sans vous ne servirait à rien | `node "$env:USERPROFILE\.claude\skills\make-it-better\scripts\serveur-versions.mjs" --espace "C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\0b4662f2-8eb1-4522-a97d-3a9afc6510cd\scratchpad\make-it-better-recette\reel"` | si rien n'est fait, vous découvrirez la page sur votre premier document |

## 9. Traces

- Skill : `digit-ai-forge-agents/.claude/skills/make-it-better/`, commits `b29590c` et `44a8cde`.
- Prompt suivi : `output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102g.md`.
- Registre : `todo/TODO.jsonl`, TF-2050, TF-2051, TF-2061 et TF-2062.
- Recette et captures : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\0b4662f2-8eb1-4522-a97d-3a9afc6510cd\scratchpad\make-it-better-recette`.
