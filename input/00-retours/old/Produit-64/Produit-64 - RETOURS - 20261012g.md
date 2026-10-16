# Lot de retours — Produit-64 → pilot (hook de restitution : message refusé APRÈS affichage, doublon à l'écran) — 2026-10-12, indice g

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire `oracles/hook-restitution.mjs`, `oracles/oracle-synthese.mjs` et `gabarits/RESTITUTION.md`.

**Origine** : question du porteur, le 12/10/2026 vers 16:10 : « Il y a encore un doublon du prompt de sortie. Comment faire en sorte que ce bug ne se reproduise plus ? »

Ce lot porte **1 retour** (RT-43).

- **Contexte** : une session de conversation de ce produit (pré-audit Architecture Socle), hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-12** dans le sas d’arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L’original reste ici, historique du produit.

---

## pilot (`oracles/hook-restitution.mjs`, `oracles/oracle-synthese.mjs`, `gabarits/RESTITUTION.md`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-43 | majeur | générique | **Le hook `Stop` juge le message final quand il est DÉJÀ affiché : chaque refus produit un doublon à l'écran, que l'humain voit et signale comme un bug.** Le hook ne peut pas retirer un message rendu ; il ne peut qu'exiger sa réécriture, qui s'affiche sous le premier. Mesuré le 12/10/2026 : journal `.claude/hooks-journal.jsonl` du pilot, session `ff0426c0` de ce produit, 12 jugements, **3 refus au premier passage** (09:12:45, 09:23:16, 14:07:37 UTC), donc 3 doublons affichés ; sur tout le journal, **1 393 refus au premier passage pour 4 549 jugements**, soit environ 3 messages finaux sur 10 affichés deux fois. Rejeu le même jour : les 11 restitutions de la session, extraites de la transcription à l'octet et passées à `node oracles/oracle-synthese.mjs <fichier>`, retrouvent **exactement** les deux refus rejouables (S4 sur le message de 09:23:16, S3 sur celui de 14:07:36) et aucune règle bloquante sur les 9 autres : l'oracle lancé sur un brouillon AVANT l'affichage aurait évité les deux doublons. Rien ne l'impose aujourd'hui : le `RAPPEL` du hook dit quoi corriger, jamais de pré-juger. | (1) Une commande de pré-jugement qui rend le MÊME verdict bloquant que le hook (ensemble `BLOQUANTES` S1, S3, S4, S6, plus le contrôle GESTE quand le dernier message humain est un sélecteur de décision) : `node forge/hooks/factory.mjs prejuger <brouillon.md>`, exit 0 = affichable. (2) Une ligne dans `gabarits/RESTITUTION.md` et dans le `RAPPEL` : « écris la restitution dans un fichier, pré-juge-la, n'affiche que la version PASS, recopiée telle quelle ». (3) Au journal du hook, un champ `prejuge: true/false` (le transcript montre-t-il un appel de pré-jugement sur un texte identique au message final ?) pour mesurer l'adoption et faire baisser le taux de 30 %. |

**Portée** : générique. Tout produit et toute forge sous le hook de restitution est exposé : le taux de 1 393 sur 4 549 couvre tout le journal du pilot.

## Rattachement

Registre interrogé le 12/10/2026 (`todo/TODO.jsonl`, termes « doublon », « deux fois », « affich », « réécri », « pré-juge », « avant d'afficher », croisés avec « hook restitution » et « stop hook ») : aucun item ne traite du refus après affichage. Voisins sans recouvrement : `TF-0891` (le hook compare le message affiché au fichier jugé), `TF-0904` (portée du jugement), `TF-1019` (geste absent après une décision), `TF-1228` (version du gabarit citée par le `RAPPEL`).

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| 3 doublons affichés dans la session du 12/10 | Pré-jugement par `oracle-synthese.mjs` sur un brouillon avant tout affichage, appliqué dès la réponse de 16:15 ; mémoire de session `prejuger-restitution-avant-affichage` | oui | remonté : RT-43 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr nouveau sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : le comportement en cause (un hook `Stop` ne retire pas un message rendu) est celui de Claude Code, documenté comme tel, et il n'a rien bloqué.

## Confirmations positives

- Le hook et l'oracle sont cohérents : le même module juge le même texte, et le rejeu sur fichier reproduit ses verdicts à l'identique. C'est ce qui rend le pré-jugement possible sans rien réécrire.
- La garde anti-boucle a tenu : chaque refus n'a coûté qu'une réécriture.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-43** : aucune classe existante ne convient (`restitution-fichier-juge-mal-choisi` vise le choix du texte jugé, pas le moment du jugement).
  - Clé proposée : `restitution-jugee-apres-affichage`
  - Famille : `restitution-forme`
  - Libellé : « Le message final est jugé après son affichage : chaque refus du hook se lit à l'écran comme un doublon, faute d'un pré-jugement du brouillon qui rende le même verdict avant l'affichage »

## Ordre recommandé

1. **RT-43 (2)**, parce qu'une ligne dans le gabarit et le `RAPPEL` suffit à changer le geste dès la prochaine session.
2. **RT-43 (1)**, parce que la commande garantit l'équivalence avec le hook, contrôle GESTE compris.
3. **RT-43 (3)**, pour mesurer la baisse du taux de doublons.
