---
destinataire: humain
---

# Synthèse Mandat — trois chantiers fusionnés sur quatre : écrits à un tiers rejoués au lieu d'être bloqués (26/10/2026)

## 0. Synthèse d'ouverture

Votre troisième décision de code est en place : un courriel ou une fiche destinés à un tiers sont désormais mesurés pour leur longueur et leur langue, et un écart déclenche une réécriture en trois passes au plus au lieu d'un blocage. Un texte anglais passe dès que la langue attendue est l'anglais. Il reste le chantier du compte rendu allégé, après lequel partira T4. Rien ne vous est demandé.

## 1. En-tête d'identification

Point d'étape · fusion du chantier de votre réponse D-78 (c) amendée · sur le pilot digit-ai-factory · le 26/10/2026 à 17:07 (heure de Paris, UTC+1) · Claude Opus 5.5 et 1 agent de campagne, fusion 058459b1, locale.

Intention : ne plus avoir à redemander des textes courts, sans bloquer une remise. Test rétro : le chantier sert l'intention, car l'écart se corrige par réécriture et la remise n'est jamais refusée pour ce seul motif.

## 2. Ce qui reste à mesurer, et par quoi

- Effet sur vos reprises de longueur : par la prochaine analyse d'œil critique, qui compte les reprises sur les écrits à un tiers (8 en 7 jours au départ).
- Compte rendu allégé (T2) : par `oracles/hook-restitution.test.mjs` au retour de l'agent constructeur.

## 3. Décisions attendues

Aucune décision nouvelle.

## 4. Traité

- D-78 (c) amendée, TF-1960, fusionné (058459b1) :
  - `oracles/oracle-ecriture.mjs` : règle EC-14, paragraphe de 3 phrases et 60 mots au plus, phrase de 25 mots au plus, énumération en prose de 3 éléments au plus ; règle EC-15, langue dominante égale à la langue attendue, donnée par `--langue`, l'en-tête `langue:` ou, à défaut, le français ;
  - ces 2 règles rendent « à rejouer » avec les passages et la consigne, jamais FAIL ; le hook d'écriture les affiche après chaque écriture, sans bloquer ;
  - `references/ECRITURE.md` : règle E-17 et la boucle de réécriture, 3 passes au plus, puis remise avec les écarts nommés ;
  - `references/PREFERENCES-PORTEUR.md` : ligne « la réponse suit la langue de l'utilisateur » ; conflit avec la ligne du chantier D-76 résolu en gardant les deux, 1 499 octets sur 2 048.
- Recettes rejouées sur le pilot fusionné : `oracle-ecriture --self-test` 69 cas, exit 0 ; `hook-ecriture --self-test` exit 0 ; hook d'ouverture 44 PASS ; hook de saisie 23 PASS ; hook des gestes distants 74 PASS ; `oracle-claude-md` PASS.
- Relecture d'intention : sans objet pour ce point d'étape, le dernier chantier n'étant pas rendu ; l'agent a joué ses fixtures contre la consigne qui citait vos mots.

## 5. Non traité

- Chantier T2 : en cours, non rendu ; T4 attend sa fusion.
- Copie de `references/ECRITURE.md` chez les produits : elle suit la prochaine ouverture de chaque produit, par l'héritage.
- Deux recettes du harnais complet en échec, hors de ces chantiers : le compte des produits cités et 2 index d'`output` périmés ; je les reprends à la fusion de T2.
- Publication du pilot : non faite ; elle suivra la fusion de T2.

## 6. Écarts à la lettre

L'agent a compté comme internes, non concernés, les documents destinés à l'orchestrateur, au pilot ou aux agents, en plus de ceux destinés à vous : sur 364 en-têtes du dépôt, aucun ne nomme un tiers, et un document pour agents aurait été jugé comme un courriel.

## 7. Risques

- Énoncé : la règle n'a encore jugé aucun vrai courriel du dépôt, 0 sur 608 fichiers relus. Signal : le premier courriel à un tiers produit. Parade : la prochaine analyse d'œil critique vérifie qu'il a été rejoué.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-2 suit A-1.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1947 | Fusionner T2 à son retour, reprendre les 2 recettes en échec, publier le pilot | auto_ia | dependance_externe | retour de l'agent constructeur lancé à 16:00, puis `git push origin main` | T4 ne peut pas partir |
| **A-2** | TF-1949 | Lancer T4 entière dans un arbre de travail isolé | auto_ia | dependance_externe | après la fusion de T2, agent constructeur | les forges restent oubliées |

## 9. Traces

- Fusion 058459b1 (TF-1960).
- `oracles/oracle-ecriture.mjs`, `oracles/hook-ecriture.mjs`, `references/ECRITURE.md`, `references/PREFERENCES-PORTEUR.md`.
- `todo/TODO.jsonl`, TF-1960.
