---
destinataire: humain
---

# Synthèse Mandat — D-214 (a) et actions A-2 à A-7 exécutées (14/11/2026)

## 0. Synthèse d'ouverture

Vos réponses sont appliquées. Le site public de la Factory est désormais reconnu comme un nom public : 13 de ses 14 lots de retours sont entrés au registre, le dernier est refusé pour une erreur de forme. La variable de votre poste est retirée, et les forges du dossier habituel sont remises à jour, sauf une qui attend votre réponse sur une décision ancienne. Les skills installés sont à jour, sans régression mesurée. Les 2 produits dont les lots étaient refusés ont reçu une demande de travaux. J'ai corrigé au passage la cause que j'avais annoncée pour ce refus : elle était fausse. Une seule question vous revient : demander ou non la correction du lot refusé au site public.

Livré : [Synthèse du 14/11, D-214 et actions A-2 à A-7](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20D-214%20et%20actions%20A-2%20a%20A-7%20executees%20-%2020261114b.md)

## 1. En-tête d'identification

Exécution de votre réponse « 214a Site web portant la présentation complète de la Factory et ses forges. A2, 3, 4, 5, 6 & 7 » à la synthèse 20261114a, sur le pilot `digit-ai-factory`, les forges de `C:\dev` et 2 produits. Synthèse relevée le 14/11/2026 à 16:17, heure de Paris (`date`). Session pilote Claude Opus 5.5, sans agent.

Intention de la demande : exécuter la décision et les six actions acceptées, jusqu'à leur preuve.

Test rétro : la synthèse sert cette intention, et pas seulement sa lettre. Chaque action acceptée est faite et prouvée, ou son écart est dit avec sa cause mesurée (A-5).

## 2. Verdict

D-214 (a) et 6 actions exécutées sur 6, dont A-5 sous une autre forme que celle proposée ; 2 sujets clos (TF-2556, TF-2501) et 20 décidés par le tri de A-7 ; 15 candidatures neuves ingérées (TF-2541 à TF-2555) et 4 sujets créés (TF-2556 à TF-2559). `oracle-todo` PASS après chaque écriture.

## 3. Décisions attendues

Aucune décision nouvelle ne vous revient ; trois gestes vous attendent, inventoriés ci-dessous.

Bloquants de ce tour, chacun avec ce qui le lève :
- Le lot 20261114i du site public de la Factory est refusé à l'ingestion : ses 2 lignes proposent une classe neuve dans les familles « oracles » et « restitution », que le référentiel ne connaît pas. Le produit le lève en remettant un lot neuf aux familles existantes ; l'action A-1 le lui demande par un lot de travaux, dès votre accord. Tant qu'il ne l'a pas fait, les 2 retours restent hors du registre.
- forge-design, sous `C:\dev`, diverge de son distant (1 commit local, 49 derrière) : le commit local applique l'option (b) de la décision sur les verdicts sans mesure réelle, rappelée ci-dessous et jamais tranchée ; votre réponse à cette décision le lève.
- 15 clones de forges, de la file et du canal confidentiel, dans le dossier des arbres d'agents du pilot, ne servent plus depuis le retrait de la variable : votre geste de suppression les retire.

Aucune décision nouvelle ne vous revient.

D-108 : aucun verdict favorable sans mesure réelle, posée le 29/10 à 19:13, inchangée.

D-180 : moment de traiter les sujets de la boucle L99, posée le 06/11 à 16:13, inchangée.

D-183 : conclusion de la revue de la relecture d'intention, posée le 09/11 à 14:31, inchangée.

## 4. Traité

- D-214 (a), TF-2556 : les deux graphies du site entrent à `PRODUITS_DE_L_ECOSYSTEME` (`scripts/lib-parc.mjs`, votre réponse citée en commentaire) ; lib-parc.test 5 PASS, anonymiseur 13 sur 13, bootstrap.test 29 sur 29, relever-heritage.test 51, emettre-travaux.test 40 ; pilot 106184bd.
- Lots du site : 14 accueillis (28 fichiers, 0 refusé, aucun nom ni adresse à qualifier) ; 13 ingérés, 15 candidatures TF-2541 à TF-2555 ; 1 refusé en bloc (20261114i, familles de classe inconnues).
- A-2 : la variable Utilisateur `FORGE_ROOT` est retirée, aucune variable Machine ne la remplace (relu par `GetEnvironmentVariable`) ; `bootstrap.mjs --pull` sur `C:\dev` a remis 9 forges et la file à jour de leur distant, forge-design exceptée (bloc 3).
- A-3 et A-4, TF-2501 : `node oracles\oracle-skills.mjs --appliquer` a remis à niveau les 13 skills ; `oracle-skills` PASS (13 K2 avant) ; consommateurs rejoués avant et après sans échec neuf (forge-design, forge-data, forge-audit PASS ; forge-tests : ses 5 échecs déjà présents, identiques un à un) ; `oracle-etat-forge` PASS sur l'installation du poste.
- A-5, TF-2557 et TF-2558 : un lot de travaux déposé chez chaque produit (`todo/emettre-travaux.mjs`, juge du lot PASS, 18 et 12 éléments, aucun commit chez eux) : remettre un lot neuf complété des 4 sections absentes, jugé avant remise ; pour Produit-02, s'y ajoutent le rattrapage d'un déploiement sauté et le lancement de Chrome à borner.
- A-6 : 3 arbres liés retirés, 3 branches fusionnées supprimées (lot-pe, lot-pf, lot-fa2) ; `git worktree list` n'en liste plus.
- A-7 : TF-2521 à TF-2540 décidés sous R-58, 19 à faire par une session, 1 au premier cas réel chez un produit (TF-2538).
- TF-2559, candidat : un lot se remet au sas alors que le juge de lot du produit rend FAIL, 2 produits sur 2 aujourd'hui.
- Note du poste en mémoire corrigée : la racine est redevenue `C:\dev`, et l'envoi du pilot déclare le feu vert permanent D-54 (b).

Relecture d'intention : sans objet, motif : aucun agent lancé dans ce tour, chaque action exécutée par moi et prouvée par sa commande.

## 5. Non traité

- Lot 20261114i du site public — motif : `dependance_bloc_3`, votre « A1 ».
- forge-design sous `C:\dev` — motif : `dependance_bloc_3`, D-108.
- Les 15 candidatures TF-2541 à TF-2555 et TF-2559 — motif : `borne_atteinte`, ingérées dans ce tour, à trier au prochain.
- Les clones de forges sous `.claude\worktrees` (13 forges, la file, le canal) — motif : `garde_fou`, une suppression reste un geste humain ; ils ne servent plus depuis le retrait de la variable.

## 6. Écarts à la lettre

- A-5 demandait de recopier l'héritage puis d'ajouter la section aux 2 lots → j'ai déposé un lot de travaux chez chaque produit, sans recopie ni retouche des lots → mesuré chez les produits : leur gabarit de lot est un relais à jour vers le pilot, leur juge rend FAIL sur 4 sections (R-45, R-46, R-57, GFP-LOT) et non sur une seule, un lot remis ne se modifie plus qu'à sa ligne de statut, et la recopie aurait écrasé des modifications non enregistrées de leurs sessions (`forge/hooks/factory.mjs`, `forge/ledger.py`).
- La synthèse 20261114a donnait pour cause du refus une copie du gabarit non rafraîchie → c'était faux → la vraie cause est un lot remis malgré le FAIL de son juge (TF-2559).

## 7. Risques

- Une session déjà ouverte avant le retrait de la variable garde l'ancienne racine ; signal : une ouverture qui ne relève aucun produit ; parade : rouvrir la session.

## 8. Prochaines actions

Le tableau dit qui agit et ce qui se passe si rien n'est fait ; la première vous revient.

| A-N | Action | Statut | Acteur | Nature | Déclencheur | Si rien n'est fait |
|---|---|---|---|---|---|---|
| A-1 | Écrire « A1 » dans la conversation pour que je dépose chez le site public un lot de travaux (`node todo\emettre-travaux.mjs --produit forge-digit-ai-fr`) qui fait remettre le lot 20261114i avec des familles de classe existantes | neuve | manuelle_utilisateur | decision : écriture chez un produit, sur run demandé | ce message | 2 retours du site restent hors du registre |
| A-2 | Répondre à D-108 (verdict favorable sans mesure réelle) en écrivant sa lettre, ce qui décide du sort du commit local de forge-design sous `C:\dev` | neuve | manuelle_utilisateur | decision : doctrine des verdicts | ce message | forge-design reste divergée sous `C:\dev`, signalée à chaque ouverture |
| A-3 | Retirer les clones devenus inutiles : `Remove-Item -Recurse -Force C:\dev\digit-ai-factory\.claude\worktrees\digit-ai-forge-*`, `…\digit-ai-queue` et `…\_confidentiel`, après avoir vérifié qu'ils sont à 0 commit d'écart | neuve | manuelle_utilisateur | irreversible : une suppression reste un geste humain (R-29) | ce message | 15 clones inutiles restent sur le disque |
| A-4 | Trier les 16 candidatures TF-2541 à TF-2555 et TF-2559 | neuve | auto_ia | borne_atteinte : ingérées dans ce tour | prochaine demande « TODOs et retours » | elles attendent la revue du 16/11 |

## 9. Traces

Registre `todo\TODO.jsonl` (TF-2501, TF-2556 clos ; TF-2521 à TF-2540 et TF-2557, TF-2558 décidés ; TF-2541 à TF-2555 et TF-2559 candidats) ; pilot 106184bd ; lots de travaux `input\00-travaux\pilot - TRAVAUX - 20261114a.md` chez les 2 produits ; `scripts/lib-parc.mjs`.
