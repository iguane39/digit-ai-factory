---
destinataire: humain
---

# Synthèse Conseil — prompt make-it-better avec Word et PDF, 1 décision attendue (02/11/2026)

## 0. Synthèse d'ouverture

Vos 2 choix sont intégrés au prompt, et rien n'est encore construit. Word fonctionne dans son format, un vrai tour l'a prouvé. Le PDF, lui, ne tient pas ce que je vous avais annoncé : le modèle ne peut y remplacer ou retirer que des lignes, et il faut une bibliothèque sous licence AGPL. Il vous reste à trancher ce point ci-dessous, puis à dire « exécute » pour lancer la construction.

Livré : [Prompt du skill make-it-better, avec Word et PDF](output/04-plans/Digit-AI%20-%20Prompt%20-%20Skill%20make-it-better%20et%20page%20de%20versions%20-%2020261102g.md)

## 1. En-tête d'identification

Mise à jour du prompt et banc de faisabilité, sur le pilot `digit-ai-factory`, le 02/11/2026 de 10:18 à 10:26, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5, skill `quality-oracles`, 1 agent `verificateur` en lecture seule ; escalade de modèle : aucune.

Intention de la demande : faire entrer vos réponses dans le prompt, pour que le skill compare les versions et traite Markdown, HTML, Word et PDF dans leur format.

Test rétro : le résultat sert cette intention pour Markdown, HTML et Word. Pour le PDF, il la sert en partie seulement, et l'écart vous est posé en D-124 *(voie du PDF)*.

## 2. Verdict en une ligne

2 tours réels sur des fichiers fictifs : le Word modifié passe `oracle-docx` en exit 0, et le PDF n'accepte qu'un remplacement de ligne, 1 texte plus long débordant de la page.

## 3. Décisions attendues

> **D-124 — Comment le skill make-it-better doit-il traiter un PDF gardé dans son format : remplacer des lignes par pymupdf, sous licence AGPL, ou refuser le PDF ?**
>
> - **De quoi s'agit-il** : la façon de faire itérer un PDF, avec `pymupdf`, la bibliothèque qui sait réécrire du texte dans un PDF existant.
> - **Le problème** : l'option (c) de D-123 disait que le modèle modifierait le fichier d'origine, sans que je l'aie mesuré. Le banc montre qu'il ne peut remplacer ou retirer que des lignes, sans paragraphe neuf ni remise en page : un PDF testé ainsi mesure une retouche, pas une vraie itération. `pymupdf` est aussi en AGPL, et le skill `digit-ai-pdf` l'écarte pour cette raison.
> - **Pourquoi vous** : c'est une règle sur les licences admises dans la Factory, et vous seul savez si vos documents de test seront des PDF.
> - **Recommandation : (a)** — elle tient votre demande pour le PDF, avec une limite que le bilan écrit, et `pymupdf` reste une dépendance locale, sans copie dans le dépôt public. Source consultée : `digit-ai-forge-agents/.claude/skills/digit-ai-pdf/SKILL.md`.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Remplacer et retirer des lignes par `pymupdf` | Le PDF reste un PDF, avec des modifications ligne à ligne. Le bilan marque ces documents. Sans `pymupdf`, le PDF est refusé. | moyen × court | Possible, retirer ce format du skill |
| (b) Refuser le PDF | Le skill le refuse avec un message. Vous exportez le document en Word avant le test, et il itère alors sans cette limite. | aucun coût ajouté | Possible, ajouter ce format plus tard |
| (c) Refaire le PDF à partir de son texte à chaque tour | Le modèle réécrit librement, et le lanceur régénère un PDF sans `pymupdf`. La mise en page d'origine est perdue. Voie non mesurée. | complexe × moyen | Possible, retirer ce format du skill |

> **Sans réponse** : (b), le PDF reste refusé et les 3 autres formats fonctionnent.

## 4. Traité

- **Vos réponses.** « 122a » : la comparaison côte à côte entre dans la page, sans courbe, et disparaît en revue à l'aveugle. « 123 MD, HTML, Word, PDF dans leur format » : je le lis comme l'option (c) de D-123.
- **Word, banc réel.** 1 tour en Opus par l'abonnement, `apiKeySource` à `none`, 15 secondes, sans Bash : le modèle modifie le texte du XML, le fichier est rempaqueté, et `oracle-docx` rend exit 0.
- **PDF, banc réel.** 1 tour : le modèle lit le PDF et rend un remplacement que `pymupdf` applique. Un texte plus long atteint 596 pour une page de 595 : le prompt le rejette.
- **Aperçu Word.** LibreOffice est absent du poste. Word en automation exporte en PDF en 1,3 seconde, puis `pypdfium2` en fait une image.
- **Voie écartée.** Faire ouvrir un PDF par Word sans intervention bloque : aucun résultat après 60 secondes. Le prompt borne donc tout export à 120 secondes.
- **Quota.** `utilization` passe de 0,23 à 0,24 sur 7 jours, avec les 2 tours du banc et les mesures du matin.
- **Vérification du prompt.** Un agent qui ne note pas confirme 8 intégrations sur 8 et relève 7 défauts créés, fermés ensuite, dont la définition de « document inchangé » pour chaque format.
- **Contrôles.** `quality-oracles` sur le prompt : 4 PASS, 3 SKIP, 0 échec ; `oracle-ecriture` : PASS.
- **Version précédente.** Le prompt `20261102e` passe sous `output/04-plans/old/`.

Relecture d'intention : sans objet, l'agent de ce tour relit un texte et n'écrit rien ; le résultat a été confronté à vos réponses au test rétro du bloc 1.

## 5. Non traité

- **La construction du skill et de la page** : motif `decision`, votre message tranche 2 choix sans dire « exécute », et la construction dépend aussi de D-124.
- **Le test sur vos documents** : motif `decision`, vous donnerez les documents, chacun avec son brief et ses sources.
- **Une nouvelle note à l'aveugle** : motif `hors_perimetre`, la boucle s'est arrêtée à 84 sur le texte d'avant. Cette version ajoute Word et PDF, et elle n'est pas renotée.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| PDF « dans leur format » | PDF gardé, mais modifié ligne à ligne seulement, si vous choisissez (a) | le banc ne permet pas plus sans perdre la mise en page |
| réponse à D-123 sans sa lettre | lue comme l'option (c) | votre phrase reprend son contenu : dites-le si vous pensiez autre chose |

## 7. Risques

- **PDF biaisé.** Énoncé : un PDF limité à des lignes réduit ses chances d'être jugé favorable. Signal : les PDF sont tous défavorables au bilan. Parade : le bilan marque ces documents, et un export en Word reste possible avant le test.
- **Word en automation.** Énoncé : Word peut bloquer sur une boîte de dialogue, comme dans mon test sur le PDF, qui a laissé un processus caché que j'ai arrêté (numéro 25876, lancé par ce test, aucune fenêtre). Signal : un export qui dépasse 120 secondes. Parade : le serveur arrête son seul processus et affiche le texte extrait ; la recette vérifie qu'un Word ouvert par vous reste ouvert.
- **Prompt long.** Énoncé : 3 517 mots, dont la dernière note à l'aveugle porte sur un texte antérieur. Signal : un défaut qui apparaît à la construction. Parade : la recette nomme ses cas par format.

## 8. Prochaines actions

Une seule action, parce que la construction dépend de votre accord.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Lancer la construction du skill et de sa page avec ce prompt, et trancher la voie du PDF | neuve | manuelle_utilisateur | decision, le lancement et la licence vous reviennent | répondre dans cette conversation, par exemple « exécute, D-124 a » ; le prompt est dans `output/04-plans/` | si rien n'est fait, le skill n'existe pas et le test ne peut pas commencer |

## 9. Traces

- Prompt : `output/04-plans/Digit-AI - Prompt - Skill make-it-better et page de versions - 20261102g.md`.
- Analyse d'origine, antérieure à vos 2 choix : `output/03-etudes/Digit-AI - Revue - Prompt skill make-it-better passe au crible L99 - 20261102d.md`.
- Registre des décisions : `decisions/REGISTRE.jsonl`, D-124.
- Banc et fichiers fictifs : `C:\Users\iguan\AppData\Local\Temp\claude\c--dev-digit-ai-factory\0b4662f2-8eb1-4522-a97d-3a9afc6510cd\scratchpad\banc-formats`.
