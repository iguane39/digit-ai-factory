---
destinataire: humain
---

# Synthèse Conseil — trois formats pour qu'une décision se comprenne et se tranche sans rien d'autre (17/10/2026)

## 0. Synthèse d'ouverture

La décision sur le sigle était impossible à trancher pour deux raisons : elle ne disait pas de quel sigle il s'agissait, et elle parlait le langage interne du pilot. Je l'ai réécrite sous trois formats, avec les faits vérifiés ce matin. Le sigle est l'abréviation d'un projet du client Client-A, dont le nom complet est déjà masqué ; ce fait, absent de la fiche du 15/10, rend la réponse presque évidente. Les trois formats partagent sept règles d'écriture. Vous choisissez le format (D-1) ; je l'appliquerai ensuite au gabarit des restitutions et à son juge, puis à toutes les décisions ouvertes. Rien n'a été modifié dans ce tour.

## 1. En-tête d'identification

Synthèse de conseil, réponse à la demande du 17/10/2026 : « travaille sur les textes affichés et les choix quand tu demandes des décisions […] fais 3 propositions », sur le pilot digit-ai-factory, poste DESKTOP-ULTRA7. Période : 17/10/2026 de 08:02 à 08:09, heure de Paris (UTC+02:00). Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : qu'une personne qui ne lit que le bloc de décision comprenne de quoi il s'agit et puisse choisir, sans ouvrir le registre ni connaître le vocabulaire du pilot.

Test rétro : le résultat sert cette intention. Chaque exemple nomme l'objet, dit pourquoi la question vous revient et ce que chaque réponse change concrètement. Le test appliqué : un lecteur qui n'a que ce bloc peut-il répondre ? Pour les trois exemples, oui, à condition de reconnaître le projet de Client-A derrière « B••2 ».

## 2. Verdict en une ligne

3 formats proposés sur la même décision, 7 règles communes ; la fiche du 15/10 omettait le fait décisif : le nom complet du projet est déjà masqué, pas son abréviation.

## 3. Décisions attendues

Une seule décision : le format à appliquer partout. Les trois sont montrés en entier au bloc 4, sur la décision du sigle.

> **D-1 — Quel format voulez-vous pour toutes les décisions qui vous sont demandées ?**
>
> Les trois formats suivent les mêmes règles d'écriture ; ils diffèrent par la forme. Le format A tient une question, trois phrases de contexte et un tableau « ce qui se passe ». Le format B découpe le contexte en quatre lignes titrées, puis le même tableau, avec le coût en plus. Le format C pose une question fermée oui ou non, sans tableau.
>
> **Recommandation : (a).** Source consultée : les trois exemples du bloc 4, comptés à environ 120, 170 et 80 mots. A sert toutes les décisions, y compris celles à trois options ou plus ; C ne sert que les questions oui ou non ; B est le plus complet mais le plus long à lire.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Format A, « question et conséquences » | Moyen × court : réécrire la section décisions du gabarit et adapter son juge | Le coût de chaque option n'a plus de colonne, il est dit dans la conséquence quand il compte |
| (b) Format B, « fiche en quatre lignes » | Moyen × court, même travail | Plus long : environ 170 mots par décision |
| (c) Format C, « oui ou non » | Moyen × court, même travail | Ne convient pas aux décisions à plus de deux réponses, qui garderaient un autre format |

> **Si rien n'est décidé** : rien ne change, les décisions gardent leur format actuel.

## 4. Traité

Ce bloc montre les sept règles communes, puis la même décision écrite dans chacun des trois formats.

**Faits vérifiés pour l'exemple, ce matin.**

- Le sigle est l'abréviation du nom du dossier projet de Produit-11, chez le client Client-A : lot `input/00-retours/Produit-11 - RETOURS - 20260908a.md`, paragraphe « Numérotation », et dossier cité par TF-0963.
- Le nom complet du projet est dans la table des pseudonymes de produits ; le sigle n'y est pas, ni dans la liste des noms interdits : lecture des deux tables du canal confidentiel.
- Le sigle figure dans 30 fichiers suivis de la branche publiée (`git grep -l -i` sur `origin/main`) et dans 0 message d'enregistrement.
- Le dépôt du pilot est public : `gh repo view --json visibility` rend PUBLIC.

**Les sept règles communes aux trois formats.**

1. Nommer l'objet. On dit de quoi on parle, jamais « un produit » ou « ce sigle ». Une valeur sensible se montre masquée, première et dernière lettre visibles : « B••2 ».
2. Dire pourquoi la question vous revient, en une phrase : vous seul savez, c'est une dépense, c'est irréversible, c'est une règle qui s'imposera à tous.
3. Pas de vocabulaire interne. « Porte », « tables », « substituer », « oracle » sont remplacés par ce qu'ils font. Le numéro du sujet va en fin de titre, entre parenthèses.
4. Chaque option dit ce qui se passe concrètement après le choix, et si l'on peut revenir en arrière.
5. Un ou deux chiffres seulement : ceux qui changent la décision.
6. La phrase « Sans réponse » dit ce qui s'applique.
7. Avant affichage, un test : un lecteur qui n'a que ce bloc peut-il répondre ? Sinon, réécrire.

**Format A — question et conséquences** (environ 120 mots).

*Le sigle « B••2 » doit-il être masqué dans le dépôt public ? (TF-1540)*

« B••2 » est l'abréviation du projet de votre client Client-A, dont le produit s'appelle Produit-11 dans nos fichiers. Le nom complet du projet est déjà masqué ; son abréviation ne l'est pas, et elle apparaît dans 30 fichiers du pilot, qui est public sur GitHub. Vous seul savez si ce sigle permet de reconnaître le client.

Ma recommandation : oui, par cohérence avec le nom complet ; cela ne bloque aucun envoi.

| Votre réponse | Ce qui se passe | Retour arrière |
|---|---|---|
| Oui, masquer | Je remplace le sigle par le pseudonyme dans les 30 fichiers et dans les lots à venir. Les anciennes versions sur GitHub le gardent lisible ; les effacer est une décision séparée. | Possible |
| Non, il n'est pas sensible | Rien ne change ; je note votre réponse pour ne plus la poser. | Possible |
| Plus tard | Chaque nouveau lot de ces produits l'ajoute à d'autres fichiers publics. | Sans objet |

Sans réponse : « plus tard ».

**Format B — fiche en quatre lignes** (environ 170 mots).

*Le sigle « B••2 » doit-il être masqué dans le dépôt public ? (TF-1540)*

- **De quoi s'agit-il** : « B••2 » est l'abréviation du projet de votre client Client-A (Produit-11 dans nos fichiers).
- **Le problème** : le nom complet est masqué, l'abréviation non ; elle apparaît dans 30 fichiers du pilot, public sur GitHub.
- **Pourquoi vous** : vous seul savez si ce sigle permet de reconnaître le client.
- **Ma recommandation** : oui, par cohérence avec le nom complet, sans effet sur les envois.

| Votre réponse | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| Oui, masquer | Remplacé dans les 30 fichiers et dans les lots à venir ; les anciennes versions sur GitHub le gardent lisible, les effacer est une décision séparée | Faible, moins d'une heure | Possible |
| Non | Rien ne change, votre réponse est notée | Nul | Possible |
| Plus tard | Chaque nouveau lot l'ajoute à d'autres fichiers publics | Nul aujourd'hui, croissant | Sans objet |

Sans réponse : « plus tard ».

**Format C — oui ou non** (environ 80 mots).

*Le sigle « B••2 », abréviation du projet de Client-A (Produit-11), doit-il être masqué dans le dépôt public ? (TF-1540)*

Il apparaît dans 30 fichiers publics sur GitHub, alors que le nom complet du projet est déjà masqué. Vous seul savez s'il permet de reconnaître le client.

- **Oui** (recommandé) : je le remplace par le pseudonyme dans les 30 fichiers et dans les lots à venir. Les anciennes versions sur GitHub restent lisibles.
- **Non** : rien ne change, je note votre réponse.

Sans réponse : rien ne change, et chaque nouveau lot l'ajoute à d'autres fichiers.

## 5. Non traité

- **L'application du format.** Motif : vous choisirez d'abord ; la réécriture du gabarit, de son juge et des onze autres décisions ouvertes suit votre choix.
- **Le masquage du sigle lui-même.** Motif : c'est la décision d'exemple, elle reste ouverte.

## 6. Écarts à la lettre

Un écart, qui sert la demande.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Reformuler la décision en 3 propositions | J'ai aussi écrit les 7 règles communes | Le format seul ne suffit pas : la fiche du 15/10 aurait échoué dans n'importe quel format, faute de nommer l'objet |

## 7. Risques

- **Le masquage partiel laisse deux caractères visibles.**
  - Énoncé : « B••2 » est publié dans ce fichier ; deux caractères sur quatre ne suffisent pas à retrouver le client sans le contexte, mais ce n'est pas rien.
  - Signal : votre lecture de cette synthèse.
  - Parade : si vous le jugez trop parlant, la règle 1 passe à un masquage total avec une description (« l'abréviation à quatre caractères du projet »).
- **Le nom complet du projet est lui aussi publié.**
  - Énoncé : bien que présent dans la table des pseudonymes, il figure dans 16 fichiers suivis de la branche publiée (`git grep -l -i` sur `origin/main`, ce matin).
  - Signal : ce comptage.
  - Parade : l'inscrire au registre comme candidat, action A-2.

## 8. Prochaines actions

Votre choix de format passe en premier, puisque le reste en dépend.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Appliquer le format retenu : gabarit des restitutions, son juge, puis réécriture des décisions ouvertes | auto_ia | dependance_bloc_3 : attend D-1 | `node oracles/hook-restitution.mjs --prejuger <synthèse>` pour vérifier chaque réécriture | Les décisions restent difficiles à trancher |
| **A-2** | `neuve` | Inscrire au registre le constat du nom complet publié dans 16 fichiers | auto_ia | attend votre accord | `node todo/journaliser.mjs` | Le constat se perd |
| **A-3** | `neuve` | Choisir le format | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-1 (a)` | Rien ne change |

## 9. Traces

- Lot d'origine du sigle : `input/00-retours/Produit-11 - RETOURS - 20260908a.md`, paragraphe « Numérotation »
- Tables lues : `scripts/lib-confidentiel.mjs`, fonction `cheminsTables`
- Comptages : `git grep -l -i -F` et `git log -i -F --grep` sur `origin/main` ; `gh repo view --json visibility`
- Synthèse précédente : `output/04-plans/Digit-AI - Synthese Conseil - Decisions a traiter en detail - 20261017a.md`
