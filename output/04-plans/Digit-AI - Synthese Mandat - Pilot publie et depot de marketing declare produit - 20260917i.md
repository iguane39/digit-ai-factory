---
destinataire: humain
---

# Synthèse de mandat — votre « 5a » est exécuté : le dépôt de marketing est déclaré produit de l'écosystème, son nom n'est plus interdit, et le pilot est publié, avance 0 (17/09/2026)

Votre décision est exécutée : le nom du dépôt de marketing est sorti de la table des noms à cacher, ce dépôt est déclaré produit de l'écosystème dans le contrôle d'ouverture du poste, et la publication du pilot est passée. Ce que cela change pour vous : les 34 enregistrements qui attendaient sont publiés, l'avance du dépôt est à 0, et l'ouverture du poste affiche un avertissement de moins. Le travail de ce matin est donc en ligne : l'étude, les sondes de surveillance, la vue de descente par produit, la règle qui oblige un produit à dire ce qu'il remonte. Rien n'a été contourné, et aucun fichier n'a été réécrit. Ce qui est attendu de vous : rien d'urgent ; il reste un geste qui vous appartient, ouvrir les 2 produits les plus en retard.

## 1. En-tête d'identification

- **quoi** — exécution de votre décision « 5a », c'est-à-dire l'option (a) de la décision sur le nom refusé par la porte de publication : table des noms corrigée, dépôt déclaré, porte rejouée, pilot publié.
- **sur quoi** — le pilot `digit-ai-factory` et son dépôt distant ; la table des pseudonymes du canal confidentiel, modifiée sur votre ordre et enregistrée en local seulement ; le dépôt de marketing lu, jamais écrit.
- **quand** — 2026-09-17 11:03 UTC+02:00 (Europe/Paris) ; première mesure d'horloge du tour 10:51 ; durée mesurée ≈ 12 min.
- **qui** — pilot `33ac918`, publié ; canal confidentiel `83cfacb`, non publié ; session Fable 5.1, aucune délégation, escalade de modèle : aucune ; oracles joués : recette du contrôle d'ouverture du poste, porte de publication, `oracle-todo` *(juge du registre)* et `oracle-synthese` sur ce document.
- **intention** — publier le travail de ce matin en corrigeant la cause du refus, pas son symptôme. Test rétro : la cause est corrigée à sa source, la table ; aucun des 11 fichiers refusés n'a été touché, et la porte passe.

## 2. Verdict en une ligne

**Pilot publié : `71bca78..33ac918`, exit 0, avance 0 après publication (34 avant) ; porte de publication PASS au troisième passage, 0 nom refusé (40 avant) ; recette du contrôle d'ouverture du poste 15/15 PASS, avertissements d'ouverture 4 → 3 ; indice 66 réservé dans la table, enregistrement local `83cfacb` au canal confidentiel ; constat du cliquet des recettes entré au registre, TF-1169 ; `oracle-todo` PASS.**

## 3. Décisions attendues de l'humain

Rien n'attend de décision : les 5 décisions de cette session sont tranchées et exécutées.

## 4. Traité — avec sa preuve

- **Votre « 5a » a reçu son geste : le nom du dépôt de marketing sort des noms interdits.** Son indice, le 66, reste réservé et ne sera jamais réattribué, parce que des fichiers déjà suivis le portent. Une copie de la table d'avant est gardée hors dépôt.
  - preuve : relecture de la table après écriture → 66 entrées, 1 seule portant l'indice 66, libellée réserve ; `git log --oneline -1` au canal confidentiel → « 83cfacb Table des pseudonymes : l indice 66 est reserve ».
- **Le dépôt de marketing est déclaré produit de l'écosystème**, et non forge : il porte un dossier de forge, un prompt de produit et remet des lots de retours. Il n'entre donc pas dans la liste des dépôts clonés et tirés à l'ouverture ; il se déclare à part, et le balayage du poste cesse de poser la question.
  - preuve : `node bootstrap.test.mjs` → « bootstrap : 15/15 » ; `node bootstrap.mjs` → « Poste prêt … (3 avertissement(s) non bloquant(s)) », 4 ce matin ; le nom du dépôt n'apparaît plus dans la sortie.
- **Le pilot est publié.**
  - preuve : `FORGE_PUSH_GO="D-4 (b) et D-5 (a) du 17/09" git push origin main` → « 71bca78..33ac918  main -> main », exit 0, la porte des noms ayant joué avant l'envoi sans rien refuser ; `git rev-list --count origin/main..HEAD` → 0.
- **Le constat laissé de côté au tour précédent est versé au registre** : le cliquet des recettes lit une date dans un message comme un compte de cas.
  - preuve : `node todo/ingerer-lot.mjs` → « [OK] 1 candidature(s) ingérée(s) en CANDIDAT », TF-1169 ; `node todo/oracle-todo.mjs` → `"verdict": "PASS"`.

## 5. Non traité — avec son motif

- La publication du canal confidentiel — motif : hors mandat ; votre décision portait sur la table, pas sur la publication de ce dépôt, qui portait déjà d'autres modifications en attente avant ce tour. L'enregistrement est local.
- L'enregistrement des 6 fichiers de l'autre session sur la gestion des réseaux sociaux — motif : hors mandat ; ils appartiennent à une session en cours. Ils ne bloquent plus rien : la porte ne les refuse plus.
- Cette synthèse et l'entrée de TF-1169 au registre ne sont pas encore publiées au moment où ces lignes sont écrites — motif : écarté ; elles partent dans l'enregistrement de restitution qui suit, couvert par le GO déjà donné sur ce travail.

## 6. Écarts à la lettre

- **L'option (a) disait** « l'inscrire à la liste des dépôts suivis » → **je l'ai déclaré dans une liste à part**, celle des produits de l'écosystème, et non dans la liste des forges → **pourquoi** : la liste des forges clone et tire chaque dépôt à l'ouverture du poste, et un retard y fait échouer l'ouverture ; ce dépôt est un produit, avec 97 fichiers modifiés en attente, où le pilot n'intervient que sur run demandé.
- **Hors du périmètre demandé**, 2 gestes : l'enregistrement local de la table au canal confidentiel, pour que la correction ne reste pas un fichier modifié sans trace ; et l'entrée au registre du constat sur le cliquet, annoncée au tour précédent.

## 7. Risques

- Le nom du dépôt de marketing apparaît désormais en clair dans le dépôt public du pilot, y compris dans des livrables d'étude ;
  - signal : vous jugez qu'un de ces documents ne devait pas être public ;
  - parade : acceptation déclarée par votre décision ; le dépôt de marketing est lui-même public sous votre compte.
- Un autre poste garde l'ancienne table et pseudonymise encore ce nom à l'enregistrement ;
  - signal : le pseudonyme de l'indice 66 réapparaît dans un fichier neuf ;
  - parade : publier le canal confidentiel, geste listé en A-2.
- La synthèse précédente porte le pseudonyme à la place du nom, parce que le garde d'enregistrement l'a remplacé avant la correction de la table ;
  - signal : vous la relisez et ne reconnaissez pas le sujet de la décision ;
  - parade : acceptation déclarée ; cette synthèse nomme le sujet, et un fichier enregistré ne se réécrit pas.

## 8. Prochaines actions

Ordre du tableau : l'action de l'IA d'abord (tri par acteur) ; puis les actions humaines, celle qui protège la correction avant celle qui fait baisser les compteurs.

| Sélecteur | Action | Acteur | Motif et conséquence si elle n'est pas faite | Effort |
|---|---|---|---|---|
| A-1 | Instruire TF-1168 et TF-1169, les 2 constats du jour sur les contrôles du pilot, quand vous les déciderez | auto_ia | `gate_gouvernance` (seul un mandat humain fait passer un candidat en décidé) ; à défaut, un fichier renommé après son dépôt échappe encore au contrôle de fin de tour, et une date dans un message de recette rend un faux « cas perdus » | simple × court |
| A-2 | Publier le canal confidentiel — répondre « publie le canal confidentiel », l'IA joue le push ; preuve de clôture : avance 0 sur ce dépôt (neuve) | manuelle_utilisateur | `decision` — la publication d'un dépôt est un GO humain, et celui-ci porte d'autres modifications que je n'ai pas écrites ; sinon : la table corrigée ne vit que sur ce poste | simple × court |
| A-3 | Ouvrir une session chez les 2 produits en tête de la section 5 du tableau de bord `todo\RECIDIVES.md`, en retard de 34 jours ; preuve de clôture : leur ligne passe à 0 classe en retard à la génération suivante (neuve) | manuelle_utilisateur | `presence` — l'ouverture d'une session chez un produit est votre geste, trace mesurée : la recopie de l'héritage ne se joue qu'à l'ouverture du produit, et le tableau de bord rend 12 et 11 classes non atteintes chez eux ; sinon : 23 des 88 couples restent non atteints, et le gabarit de restitution 2.23.0 n'y descend pas | simple × court |

## 9. Traces

- Publication : pilot `71bca78..33ac918` ; enregistrements du jour `ba68fbc`, `0b79bd0`, `33ac918`.
- Déclaration du produit : `bootstrap.mjs`, liste des produits de l'écosystème, et sa recette.
- Table des noms : canal confidentiel, enregistrement local `83cfacb` ; copie d'avant gardée dans le dossier temporaire de la session.
- Registre : `input\01-candidatures\cliquet-recettes-date-lue-comme-compte-20260917a.tf.jsonl`, item TF-1169.
- Synthèses de la session : indices `20260917b`, `20260917d`, `20260917f`, `20260917g` et `20260917h` de `output\04-plans\`.
- Oracles : porte de publication (PASS, exit 0) ; recette du contrôle d'ouverture (15/15) ; `oracle-todo` (PASS) ; `oracle-synthese` sur ce fichier.
- Aucune page HTML livrée dans ce tour.
