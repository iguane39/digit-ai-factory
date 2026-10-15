---
destinataire: humain
---

# Synthèse Mandat — vos trois décisions appliquées, pilot publié, campagne du 15/10 close (15/10/2026)

## 0. Synthèse d'ouverture

Vos trois choix sont appliqués. Le pilot est publié, et les produits recevront ses corrections à leur prochaine ouverture. La règle des dossiers dit désormais où un programme écrit en service, et chaque produit la recevra avec son héritage. Le contrôle de remise d'un lot reste en avertissement, comme vous l'avez choisi. Rien d'autre n'est attendu de vous pour cette campagne, hormis le nettoyage d'une archive déjà appliquée.

## 1. En-tête d'identification

Synthèse de clôture de la seconde campagne « Traite tous les TODOs & retours » du 15/10/2026, après votre réponse « 3a, 4b, 5a ». Elle porte sur le pilot digit-ai-factory et l'héritage des produits. Période : 15/10/2026 de 20:13 à 20:23, heure de Paris (UTC+02:00), soit 10 minutes. Session pilote Claude Opus 5.5.

Intention de la demande : qu'aucun travail remonté par un produit ne reste sans traitement, et que la correction atteigne les produits.

Test rétro : le résultat sert cette intention. La publication du pilot ouvre la descente vers les produits, et les 2 décisions de doctrine sont écrites là où un produit les rencontre : le gitignore hérité et le contrôle de remise.

## 2. Verdict en une ligne

3 décisions appliquées sur 3, 82 sujets corrigés et 2 écartés sur 91, pilot publié à 0 commit d'écart (`55a1105c..3d01b1ec`).

## 3. Décisions attendues

Aucune décision nouvelle ne vous est demandée.

## 4. Traité

- **D-3 (a), publication du pilot.** `FORGE_PUSH_GO="D-3 (a) du 15/10" git push origin main` rend 0. Après `git fetch`, `git rev-list --left-right --count HEAD...origin/main` rend 0 et 0.
- **D-4 (b), contrôle de remise gardé en avertissement (TF-1814 clos).** Le contrôle porte le refus prédit sur sa ligne de verdict sans échouer, et l'exemption par date a disparu. La recette du contrôle de lot rend 90 cas verts sur 90.
- **D-5 (a), règle 2 précisée (TF-1750 clos).** Un programme écrit en service sous `var\`, ignoré par git. Le motif entre au gitignore des produits et aux motifs exigés de l'héritage, qui passe en 1.25.0. Le banc du gitignore rend 7 sur 8 avec les fichiers d'avant, et 8 sur 8 après. Les recettes de l'héritage rendent 41, 10, 20 et 184 cas verts.
- **Registre.** Une classe neuve, référentiel 1.39.0. `journaliser.mjs` rend PASS après l'écriture des 4 événements.

## 5. Non traité

- **Gestes de reprise d'un produit dont le dossier n'est pas retrouvé (TF-1825).** Motif : `emettre-travaux` ne le localise pas, même défaut que TF-1630.
- **2 restes à instruire (TF-1820, TF-1821).** Motif : candidats inscrits en fin de chantier, pour la prochaine campagne.
- **Décisions des sessions précédentes.** Motif : décision humaine, inchangée. Les sujets sont TF-0963, TF-1160, TF-1212, TF-1319, TF-1323, TF-1396, TF-1432, TF-1540, TF-1552 et TF-1584.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| D-3 (a) : publier les 25 enregistrements | J'ai publié 27 enregistrements : les 25, plus la synthèse et l'application de D-4 et D-5 | Les 2 derniers appliquent vos choix du même message ; les laisser hors publication aurait retenu D-5 chez ce seul poste |

## 7. Risques

- **Héritage 1.25.0 chez les produits.**
  - Énoncé : un `.gitignore` sans `var/` sera relevé incomplet à la prochaine ouverture du produit.
  - Signal : le relevé d'héritage de l'ouverture.
  - Parade : `recopier-heritage.mjs` ajoute le motif en fin de fichier ; un produit dont le programme écrit encore sous `output\` reçoit le geste dans son relevé.

## 8. Prochaines actions

Le nettoyage reste seul, parce que rien d'autre n'attend.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Effacer l'archive du correctif du 13/10, déjà appliqué | manuelle_utilisateur | irreversible | `Remove-Item "input\Digit-AI - Correctif Factory - Ouverture de session sous le delai client - 20261013b.zip"` | Un fichier non suivi reste dans l'état du dépôt, et le relevé d'ouverture le compte en défaut |

## 9. Traces

- `todo/TODO.jsonl` et `todo/CLASSES.json` (1.39.0)
- `REGLES-PROJET.md` (règle 2), `gabarits/gitignore-produit`, `gabarits/HERITAGE.json` (1.25.0), `scripts/gitignore-captures.test.mjs`
- Pilot : 3d01b1ec, publié
