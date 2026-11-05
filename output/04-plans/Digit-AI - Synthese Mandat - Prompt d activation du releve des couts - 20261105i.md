---
destinataire: humain
---

# Synthèse Mandat — prompt court pour activer le relevé des coûts dans un produit (05/11/2026)

## 0. Synthèse d'ouverture

Le prompt est prêt : vous le collez dans une session ouverte à la racine d'un produit. Il rattrape les sessions de ce produit encore sur le disque, vérifie le câblage des hooks et enregistre le relevé en local. Commencez par D-b, un dépôt sans pseudonyme dont la plus ancienne session sera purgée le 08/11, puis Produit-79, purgé le 11/11. Pendant un essai, j'ai écrit un fichier chez Produit-79 sans run demandé. Je l'ai retiré, le produit est revenu à son état, et la cause est corrigée.

Livré : [Prompt — activer le relevé des coûts dans un produit](output/04-plans/Digit-AI%20-%20Prompt%20-%20Activation%20du%20releve%20des%20couts%20chez%20un%20produit%20-%2020261105h.md)

## 1. En-tête d'identification

Mandat au pilot `digit-ai-factory`, suite de la construction du relevé des coûts. Période : 05/11/2026 de 17:31 à 17:45, heure de Paris (UTC+01:00). Session pilote Claude Opus 5.5 ; aucun agent ; escalade de modèle : aucune.

Intention de la demande : obtenir un prompt court qui active le relevé dans les produits que vous choisissez de traiter en premier.

Test rétro : le résultat sert cette intention. Le prompt tient en 5 étapes, et le tableau qui le précède classe les produits par date de purge pour vous aider à choisir.

## 2. Verdict en une ligne

Prompt livré et son étape de câblage jouée sur une copie jetable d'un produit : 2 hooks ajoutés en 39 s ; recette du relevé à 14/14 après l'option `--ici`.

## 3. Décisions attendues

Aucune décision nouvelle : l'ordre des produits est le vôtre, le tableau du prompt le propose par date de purge.

## 4. Traité

Le tour a simplifié la commande à coller, mesuré l'urgence par produit et vérifié le câblage à l'ouverture.

- **Option `--ici` du relevé.** Elle trouve seule les transcriptions du projet courant dans tous les profils du poste, par le nom encodé de son chemin. Le prompt tient ainsi en une commande. La recette passe 14/14, avec un cas neuf dont le mutant est attrapé.
- **Incident et sa cause.** Mon essai de `--ici` depuis le pilot a écrit `forge/couts-Dell-XPS-16.jsonl` chez Produit-79, car le rattrapage ignorait `--sortie`. Le fichier, neuf et non suivi, est retiré : `git status` du produit est vide. Le rattrapage respecte désormais `--sortie`, cas rouge ajouté à la recette.
- **Urgence par produit**, relevée à 17:33 : 6 produits ont des sessions sur le disque, 3 n'en ont plus. La date de purge est celle de la plus ancienne session, plus 30.
- **Câblage vérifié.** Sur une copie jetable du dépôt de Produit-83, l'ouverture a ajouté les hooks `couts` en fin de session et à l'ouverture, et a mis à jour le lanceur, en 39 s. Le vrai dépôt n'a pas changé.
- **Oracles du prompt.** `oracle-ecriture.mjs` rend exit 0 et `check_markdown.py` PASS.
- **Relecture d'intention :** sans objet, motif : le tour livre l'outil que l'action A-1 nommait, sans contenu hors de la demande.

## 5. Non traité

- **L'exécution du prompt chez les produits** — motif : hors_mandat, le pilot n'écrit chez un produit que sur run demandé ; c'est vous qui ouvrez la session.
- **Le pseudonyme de D-b** — motif : decision, l'inscription d'un dépôt à la table des pseudonymes reste l'action A-2 de l'étude ; le prompt le désigne par D-b.
- **La publication du pilot** — motif : hors_mandat, non demandée ; l'enregistrement reste local.

## 8. Prochaines actions

Une action, d'abord pour D-b, parce que sa plus ancienne session sera purgée le 08/11.

| Sélecteur | Action | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| A-1 | Ouvrir une session à la racine de chaque produit choisi et y coller le prompt, dans l'ordre du tableau | TF-2181 | manuelle_utilisateur | decision : le choix des produits et l'ouverture d'une session chez eux vous reviennent, le pilot n'y écrit pas sans run demandé | bloc de code de `output/04-plans/Digit-AI - Prompt - Activation du releve des couts chez un produit - 20261105h.md`, collé dans une session ouverte à `C:\dev\<produit>` | si rien n'est fait, D-b perd ses premières sessions le 08/11 |

## 9. Traces

- Prompt : `output/04-plans/Digit-AI - Prompt - Activation du releve des couts chez un produit - 20261105h.md`.
- Code : `scripts/relever-couts.mjs` et sa recette, commit local 4d46c770.
- Incident : fichier retiré chez Produit-79, `git status --short forge/` du produit vide après retrait.
- Enregistrement : commit local au pilot, non publié ; son numéro se lit par `git log -1`.
