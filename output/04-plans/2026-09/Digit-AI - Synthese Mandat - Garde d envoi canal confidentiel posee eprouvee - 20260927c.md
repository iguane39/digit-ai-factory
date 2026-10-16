---
destinataire: humain
role: restitution de fin de tour, décision « 30a » du 27/09/2026
sources_de_verite: git du pilot, de digit-ai-forge-agents et du canal confidentiel · todo/TODO.jsonl · output/04-plans/Digit-AI - Synthese Mandat - Trois decisions executees lots adresse et garde de publication - 20260927b.md (la décision D-30)
verifie_le: 2026-09-27
---

# Digit-AI — Synthèse de mandat — La garde d'envoi du canal confidentiel posée et éprouvée — 27/09/2026

## 0. Synthèse d'ouverture

Votre décision de ce soir est exécutée : le canal confidentiel a maintenant sa propre garde d'envoi.
Avant chaque envoi vers GitHub, elle vérifie que le dépôt est toujours privé et qu'aucun secret n'y
est entré, et elle refuse l'envoi sinon. Elle est éprouvée dans les 2 sens, et le premier envoi réel
du canal est parti à travers elle. Ce que cela change pour vous : sur ce poste, les 16 dépôts
gouvernés ont chacun leur garde. Ce qui est attendu de vous : rien de neuf à trancher. Le remisage
du 24/09 retient toujours la publication du pilot, et les 2 autres suppressions restent ouvertes.
Pendant ce travail, une autre session s'est ouverte sur le pilot, à 18:34.

## 1. En-tête d'identification

- **quoi** — exécution de votre décision « 30a » : la garde d'envoi du canal confidentiel,
  construite, éprouvée, publiée et posée.
- **sur quoi** — la forge `digit-ai-forge-agents` (l'installeur des gardes et sa recette), le canal
  `digit-ai-confidentiel` (sa documentation et sa garde) et le registre du pilot ; aucun dépôt de
  produit n'a été modifié.
- **quand** — message reçu le 27/09/2026 à 18:20 (UTC+02:00) ; travail de 18:20 à 18:45, heures
  relevées au journal de la session ; la fin est l'heure de dépôt de cette synthèse.
- **qui** — session de pilotage Claude Opus 5.5, sans agent de campagne. Escalade de modèle :
  aucune. Pilot passé de `55087f79` à `a97f9bd3`, puis cette synthèse.
- **intention** — qu'aucun envoi du canal ne parte sans que son contrôle l'ait jugé, sans geste de
  votre part, et que cette garde se pose, se vérifie et se retire comme celles des 15 autres dépôts.
  **Test rétro** : servie. Le refus est prouvé de bout en bout, avec le vrai contrôle, sur un canal
  jetable ; le premier envoi réel est passé à travers la garde ; et la garde est un gabarit de
  l'installeur du parc, avec sa recette, pas un fichier écrit à la main.

## 2. Verdict en une ligne

**D-30 exécutée** · garde posée sur le canal : sur ce poste, **16 dépôts gouvernés sur 16** ont leur
garde · recette de l'installeur **50/50** (8 échecs sur l'installeur d'avant, tous au nouveau cas) ·
recette de quality-oracles **PASS, 353 contrôles** · refus prouvé de bout en bout, premier envoi réel
parti à travers la garde en 3 s · 1 item clos au registre sur preuve · forge-agents et canal
publiés ; le pilot retient les enregistrements de ce travail, cette synthèse comprise.

## 3. Décisions attendues de l'humain

Aucune décision neuve n'attend votre réponse : D-30 est exécutée, et rien de ce tour n'en appelle une
autre. Restent 3 bloquants qui retiennent un geste de suppression, énoncés ici en entier ; le premier
retient aussi la publication du pilot :

- **Le remisage local du 24/09 au soir ne se supprime pas sans vous**, en vertu de la règle
  R-29 (une suppression reste un geste humain décidé). Il porte des relevés d'héritage écrits par un
  code en retard, avec 2 noms réels de produits ; la garde du pilot a refusé son envoi pour
  4 bloquants, tous dans ce remisage, et la porte des noms rend PASS sans lui. Pour le lever :
  vérifier par `git -C C:/dev/digit-ai-factory stash list` qu'il est en tête, libellé « Releves
  locaux du 22-24/09 », puis lancer `git -C C:/dev/digit-ai-factory stash drop stash@{0}`. Si rien
  n'est fait : les enregistrements des 2 derniers tours et cette synthèse restent sur ce poste, et
  tout envoi du pilot est refusé.
- **Le fichier « null » à la racine du parc ne se supprime pas sans vous**, pour la même règle. Il
  n'a pas changé depuis le 26/09 à 11:49 : 13 530 octets, la page « introuvable » d'un site de
  produit, écrite par une commande qui croyait jeter sa sortie, sans aucune chaîne à forme de
  jeton. Pour le lever : l'ouvrir, vérifier, puis le supprimer. Si rien n'est fait : le relevé
  d'ouverture le signale à chaque session.
- **L'arborescence liée laissée par un agent le 14/09 ne se retire pas sans vous**, pour la même
  règle. Sa branche est déjà fusionnée. Pour la lever :
  `git -C C:/dev/digit-ai-factory worktree remove --force .claude/worktrees/agent-ac087535fe0698917`,
  puis `git -C C:/dev/digit-ai-factory branch -d worktree-agent-ac087535fe0698917`. Si rien n'est
  fait : le pilot garde un dossier non suivi, compté à chaque ouverture.

## 4. Traité

La décision, avec la preuve exécutée de son geste :

- **D-30 (a)** — la garde d'envoi du canal est construite, éprouvée, publiée et posée.
  - La garde est un gabarit de l'installeur du parc, posé sur demande par `--seul=pre-push-canal`
    (forge-agents `e3da518`). Elle joue le contrôle du canal, `oracle-confidentiel.mjs`, et
    n'accepte l'envoi que sur un code de sortie 0 **et** un verdict PASS lu dans sa sortie ; un
    contrôle introuvable ou une sortie muette font refuser l'envoi.
  - Recette de l'installeur : 50 PASS, 0 FAIL ; sur l'installeur d'avant, 42 PASS et 8 FAIL, tous au
    nouveau cas. Recette de quality-oracles : PASS, 353 contrôles.
  - De bout en bout, avec le vrai contrôle copié dans un canal jetable aux tables fictives : dépôt
    dit public, envoi refusé (exit 1), la règle K1 (le dépôt distant est privé chez GitHub) nommée,
    rien n'arrive au distant ; dépôt dit privé, envoi accepté.
  - Sur le canal réel : posée à 18:37 et reconnue par `--verifier` ; premier envoi réel à travers
    elle, `580319e..9aea531`, en 3 s ; appelée directement, exit 0 en 0,7 s, et exit 1, K1 nommée,
    quand un témoin fait passer le dépôt pour public.
  - Le canal documente sa garde : sa règle 1, et une section qui dit comment la poser et la vérifier
    sur chaque poste (`9aea531`).
  - Registre : TF-1398 créé, décidé sur votre réponse, clos sur ces preuves ; TF-1360 note que la
    garde du canal s'ajoute à ce qui reste à faire sur l'autre poste (`a97f9bd3`, `oracle-todo` PASS).
- **Publication** — forge-agents `e53bd20..e3da518` à 18:36, à travers sa propre garde (29 s, porte
  des noms PASS), après le contrôle d'avance avec votre feu vert ; canal `580319e..9aea531` à 18:37,
  à travers la sienne.
- **Propagation** — `bootstrap --pull` : poste prêt, copie installée de l'installeur et de sa recette
  identique à la source.

## 5. Non traité

- **L'autre poste** (TF-1360, en cours) — motif : cette session ne le voit pas. La garde du canal
  s'ajoute aux gestes à y faire, et sa commande est écrite dans la documentation du canal.
- **La ligne ajoutée à 18:34 au relevé d'héritage du pilot** — motif : elle n'est pas de ce
  travail. Le hook d'ouverture de l'autre session, ouverte sur le pilot à 18:34, l'a écrite ; elle
  ne porte que des pseudonymes, et je la laisse à cette session.
- **Les 3 suppressions** — motif : gestes humains (R-29), inventaire en tête du bloc 3.

## 6. Écarts à la lettre

- **Vous avez choisi** D-30 (a), une garde qui joue le contrôle du canal (dépôt privé, aucun
  secret). **J'ai** fait refuser l'envoi sur l'échec de n'importe laquelle des 7 règles du contrôle,
  et non des 2 nommées à elles seules. **Pourquoi** : l'option dit « refuse l'envoi sur un échec » de son
  contrôle, et une table invalide, une entrée non datée ou un indice vacant ne doivent pas partir
  vers l'autre poste ; chaque refus nomme la règle en échec.
- **Vous avez choisi** de poser une garde sur le canal. **J'ai aussi** construit cette garde comme un
  gabarit de l'installeur du parc, avec sa recette, plutôt que comme un fichier écrit à la main dans
  le canal. **Pourquoi** : elle se pose, se vérifie et se retire comme les 15 autres, sur les
  2 postes. Un hameçon écrit à la main ne voyage pas, et une repose l'effacerait : c'est le défaut
  déjà relevé pour la section de contrôle d'avance du pilot.

## 7. Risques

- **Un envoi du canal est refusé quand l'outil GitHub en ligne de commande ne répond pas**,
  l'exclusion que vous avez acceptée avec l'option (a).
  - signal : « ENVOI DU CANAL REFUSE », règle K1, « l'hébergeur ne répond pas ».
  - parade : `gh auth status`, puis se reconnecter si besoin ; sinon `git push --no-verify`, en
    connaissance de cause.
- **Une autre règle du contrôle peut refuser un envoi** : une entrée de table sans date, un indice
  de produit vacant.
  - signal : le refus nomme la règle.
  - parade : corriger la table, puis envoyer.
- **2 sessions travaillent dans le même dossier du pilot.**
  - signal : `git status` montre un fichier que la session n'a pas touché.
  - parade : chaque session n'enregistre que ses propres fichiers ; une seule session sur le pilot
    quand c'est possible.

## 8. Prochaines actions

Les actions ci-dessous sont triées, celles de l'IA d'abord. L'ordre : la publication retenue, puis
l'autre poste, puis la construction laissée ; côté humain, le remisage d'abord, parce qu'il retient
la publication.

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Publier le pilot dès le remisage retiré : `FORGE_PUSH_GO="D-27 (a), D-28 (a) et D-30 (a) du 27/09" git push origin main`, lancé en tâche de fond, sortie vers un fichier ; preuve : l'origine porte cette synthèse | `auto_ia` | TF-1360 | `dependance_bloc_3` — attend le retrait du remisage | les enregistrements des 2 derniers tours restent sur ce poste |
| **A-2** | À la prochaine ouverture de l'autre poste : `node <forge-agents>\.claude\skills\quality-oracles\scripts\installer-hamecon-publication.mjs <dépôts> --verifier`, repose des hameçons manquants ou antérieurs à la parade du 26/09, section de contrôle d'avance du pilot, puis le même installeur sur `<racine>\_confidentiel` avec `--seul=pre-push-canal` | `auto_ia` | TF-1360 | `dependance_externe` — l'autre poste n'est pas visible de cette session | un envoi refusé peut encore y partir, et le canal y reste sans garde |
| **A-3** | Capitaliser le kit Google Ads dans une forge : générateur de l'import web confronté aux modèles, relevé en lecture seule, fichier des changements, rangés dans une forge hors de tout produit | `auto_ia` | TF-1364 | `borne_atteinte` — construction complexe × long, hors de ce tour qui exécute 1 décision | le kit reste chez le produit et se réécrit au prochain |
| **A-4** | Retirer le remisage du 24/09 : `git -C C:\dev\digit-ai-factory stash list` doit le montrer en `stash@{0}`, libellé « Releves locaux du 22-24/09… », puis `git -C C:\dev\digit-ai-factory stash drop stash@{0}` ; preuve : l'envoi du pilot n'est plus refusé | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | tout envoi du pilot reste refusé, cette synthèse comprise |
| **A-5** | Ouvrir `C:\dev\null`, vérifier qu'il ne porte aucun jeton, puis le supprimer ; preuve : le relevé d'ouverture ne le signale plus | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | le relevé d'ouverture le signale à chaque session |
| **A-6** | Retirer l'arborescence liée du 14/09 : `git -C C:\dev\digit-ai-factory worktree remove --force .claude/worktrees/agent-ac087535fe0698917`, puis `git -C C:\dev\digit-ai-factory branch -d worktree-agent-ac087535fe0698917` ; preuve : `git -C C:\dev\digit-ai-factory worktree list` ne liste plus que le pilot | `manuelle_utilisateur` | neuve (reprise du 25/09) | `irreversible` — une suppression reste un geste humain (R-29) | le pilot garde un dossier non suivi, compté à chaque ouverture |

## 9. Traces

- Fichier jugé : ce document — verdict d'`oracle-synthese` au journal homonyme.
- Forge-agents `e3da518` publié à 18:36 ; canal `9aea531` à 18:37.
- Pilot : `a97f9bd3` (registre), puis cette synthèse, retenus par la garde avec ceux du tour
  précédent.
- Garde du canal : son hameçon d'envoi, posé à 18:37:26, seul hameçon du canal ; il vit dans le
  dossier des hameçons du canal, qui ne voyage pas.
- Registre `todo/TODO.jsonl` : 3 événements de TF-1398 (création, décision, clôture) et 1 note de
  TF-1360 ; `oracle-todo` PASS avant et après.
- Sorties des recettes, de l'essai de bout en bout et des envois : fichiers de la session, hors
  dépôt (`recette-hamecon-canal-2.txt`, `recette-ancien/sortie.txt`, `recette-qo-canal.txt`,
  `e2e-canal/`, `envoi-canal-garde.txt`).
- Aucune page HTML livrée dans ce tour.
