---
destinataire: humain
---

# Synthèse Mandat — T4 fusionnée : carte des forges, 13 verdicts par demande et verrou « livré » en place (26/10/2026)

## 0. Synthèse d'ouverture

T4 est dans le pilot : à chaque demande chez un produit, la session donne un verdict motivé pour chacune des 13 forges, l'écran en garde une ligne, et un produit ne peut plus se dire livré s'il manque le livrable d'une forge mobilisée. Le fichier hérité par un nouveau produit passe de 28 Ko à 6 Ko, le détail restant consultable à part. Les travaux de l'autre poste sont réunis aux miens ; deux de mes décisions avaient pris des numéros déjà utilisés là-bas, elles deviennent D-85 et D-86. Il vous reste ces deux choix et le feu vert pour publier.

## 1. En-tête d'identification

Fusion de T4 et synchronisation avec l'autre poste · sur le pilot digit-ai-factory · le 26/10/2026 à 20:05 (heure de Paris, UTC+1) · Claude Opus 5.5 et 1 agent constructeur relancé à 18:31 après l'arrêt du premier, pilot à 8 commits d'avance sur GitHub.

Intention : ne plus jamais oublier une forge pertinente pour le produit, sans figer la liste. Test rétro : T4 sert l'intention, car chaque forge reçoit un verdict argumenté à chaque demande, et le verrou porte sur les forges que la session a elle-même mobilisées.

## 2. Verdict en une ligne

4 items sur 4 fusionnés, 11 recettes vertes sur 11 après fusion, héritage de 27 762 à 6 011 octets, 2 décisions renumérotées pour collision.

## 3. Décisions attendues

> **D-85 — Faut-il rendre de nouveau bloquants le contrôle GESTE et l'heure non relevée (S84), passés en avertissement par T2 ?**
>
> - **De quoi s'agit-il** : la décision posée à 17:58 sous le numéro D-81, que l'autre poste avait déjà pris pour une autre question. GESTE refuse une réponse qui, après votre lettre de décision, rejoue la restitution au lieu d'exécuter l'option ; S84 refuse une heure d'en-tête écrite sans relevé d'horloge.
> - **Le problème** : T2 ne garde bloquants que les contrôles qui protègent d'un faux vert sur un fait. GESTE protège pourtant de votre intervention répétée (le 11/09, une synthèse renvoyée 2 fois à l'identique après « 11a »), et l'heure fausse est une récidive notée 6 fois en mémoire.
> - **Pourquoi vous** : c'est la doctrine de restitution que T2 vient d'alléger sur votre décision.
> - **Recommandation : (b)** — GESTE sert votre objectif de ne pas intervenir deux fois ; l'heure se relève sans coût par une commande, son avertissement suffit. Source consultée : rapport du chantier T2, section « À trancher par l'humain ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Garder les deux en avertissement | Un geste non exécuté ou une heure estimée passent avec un avertissement | nul | sans objet |
| **(b)** *(recommandée)* Rendre GESTE bloquant, garder S84 en avertissement | Une lettre de décision exige la preuve du geste ; l'heure reste avertie | simple × court | repasser GESTE en avertissement |
| **(c)** Rendre les deux bloquants | Le geste et l'heure sont tous deux exigés | simple × court | repasser en avertissement |

> **Sans réponse** : (a), les deux restent en avertissement.

> **D-86 — Faut-il lever la borne « sans mot de verdict » de la réponse courte ?**
>
> - **De quoi s'agit-il** : la décision posée à 17:58 sous le numéro D-82, renumérotée pour la même raison. Une réponse courte sans écriture ne doit pas contenir PASS, conforme, garanti, exhaustif ou verdict, sinon elle repasse en restitution complète.
> - **Le problème** : la borne a fait refuser 3 réponses courtes en 7 jours (23, 94 et 94 mots) ; sans elle, une réponse courte pourrait affirmer « conforme » sans fichier jugé qui le mesure.
> - **Pourquoi vous** : c'est une borne de la doctrine des niveaux, que votre réponse 75c a élargie sans la retirer.
> - **Recommandation : (a)** — 3 refus par semaine coûtent moins qu'une affirmation de conformité non mesurée dans une réponse que rien ne juge. Source consultée : rapport du chantier T2, section « Écarts à la lettre ».

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** *(recommandée)* Garder la borne | Une réponse courte qui rend un verdict passe en restitution complète | nul | sans objet |
| **(b)** Lever la borne | Une réponse courte peut dire PASS ou conforme sans restitution | simple × court | rétablir la borne |
| **(c)** Lever la borne si la réponse cite la commande qui mesure | « conforme » passe en court avec sa source, sinon restitution | simple × court | rétablir la borne |

> **Sans réponse** : (a), la borne reste.

## 4. Traité

- T4, TF-1949, fusionné (commits bbc91287, 09541b90, ba580bdb, aa594650 de l'agent) :
  - `references/CARTE-FORGES.json` : 7 types, 13 forges, 15 livrables, daté et sourcé ; juge `scripts/verifier-carte-forges.mjs`, 13/13 ;
  - `scripts/mobiliser.mjs` : écrit `forge/mobilisation.jsonl` chez le produit, un verdict motivé par forge, refuse un motif vide ; rend la ligne « Je mobilise » ; recette 10/10 ;
  - verrou : S85 bloque une livraison déclarée sans les livrables des forges mobilisées ; S86, livraison sans trace, avertit jusqu'au 2026-11-02 puis bloque ; S72 devient un avertissement quand le verrou juge ;
  - `gabarits/CLAUDE-PRODUIT.md` de 27 762 à 6 011 octets, le corps d'origine gardé mot pour mot dans `references/CLAUDE-PRODUIT-DETAIL.md` ; `gabarits/HERITAGE.json` 1.40.0 ; `gabarits/RESTITUTION.md` 2.51.0.
- Relecture d'intention : la recette `scripts/relecture-intention.test.mjs` est passée de 76 PASS à 75 PASS et 1 FAIL, parce que 3 règles citaient des ancres déplacées par T4 ; leurs sources pointent maintenant le fichier de détail, recette 76 PASS.
- Synchronisation avec l'autre poste : 2 commits fusionnés ; registre des sujets uni ; registre des décisions uni, mes D-81 et D-82 renumérotées D-85 et D-86 avec leur motif ; `reserver-decision --verifier` et `oracle-todo` PASS.
- Recettes rejouées après la dernière fusion : restitution 59/59, `oracle-synthese --self-test` 251/251, relais des produits 26/26, ouverture 44, héritage 46 et 22, mobilisation 10, relecture d'intention 76, gestes distants 74, saisie 23, `oracle-claude-md` PASS.
- Relecture d'intention du tour : sans objet, le tour fusionne des chantiers vérifiés par leurs recettes et reprend 2 décisions déjà posées.

## 5. Non traité

- Publication du pilot : non faite, 8 commits d'avance ; elle attend votre feu vert (A-1).
- Les 26 produits existants gardent leur ancien fichier hérité : il ne se recopie jamais seul, un run par produit le remplacera.
- 9 des 15 chemins de livrables de la carte sont une convention posée par l'agent, à confirmer à l'usage.
- Gabarit de restitution : 148 247 octets pour 130 Ko visés ; « 8 blocs » encore écrit dans 6 références.

## 6. Écarts à la lettre

L'agent a gardé la règle S72 dans l'oracle, en avertissement quand le verrou juge, au lieu de la retirer comme le diagnostic le prévoyait ; elle ne bloque plus rien.

## 7. Risques

- Énoncé : un chemin de livrable mal choisi fait refuser une vraie livraison. Signal : un refus S85 sur un livrable présent ailleurs. Parade : le chemin se corrige dans la carte, une donnée, sans toucher au code.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-1 publie dès votre feu vert, A-2 suit vos réponses.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1949 | Publier le pilot | auto_ia | gate_gouvernance | `git push origin main` | l'autre poste n'a ni T4 ni la synchronisation |
| **A-2** | TF-1947 | Appliquer vos réponses à D-85 et D-86 | auto_ia | dependance_bloc_3 | réponses « 85b, 86a » ou autres lettres | les deux contrôles restent dans leur état actuel |
| **A-3** | TF-1947 | Réduire le gabarit à 130 Ko et remplacer « 8 blocs » dans les 6 références | auto_ia | dependance_bloc_3 | après A-2, qui touche le même gabarit | 18 Ko chargés de trop |

## 9. Traces

- `references/CARTE-FORGES.json`, `scripts/mobiliser.mjs`, `gabarits/CLAUDE-PRODUIT.md`, `references/CLAUDE-PRODUIT-DETAIL.md`.
- `references/RELECTURE-INTENTION-REGLES.json`, 3 sources repointées.
- `decisions/REGISTRE.jsonl`, D-85 et D-86 ; `todo/TODO.jsonl`, TF-1949.
