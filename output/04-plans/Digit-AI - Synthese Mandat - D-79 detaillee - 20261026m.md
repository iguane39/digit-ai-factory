---
destinataire: humain
---

# Synthèse Mandat — D-79 détaillée : contrôle audit et data seul, ou T4 entière après T2 (26/10/2026)

## 0. Synthèse d'ouverture

D-79 choisit quand la Factory cessera d'oublier les forges qu'une demande appelle. La version courte (b) ajoute une règle de fin de tour pour les seules forges audit et data, les deux qu'aucune demande n'a appelées cette semaine. La version longue (c) installe toute la transformation T4 : une carte des forges, un verdict motivé pour chacune des 13 forges à chaque demande, un verrou avant « livré » et un héritage des produits allégé. Je recommande (c), lancée dès que le chantier du compte rendu allégé sera fusionné, pour ne pas toucher deux fois le même contrôle de fin de tour.

## 1. En-tête d'identification

Détail de D-79 demandé · sur la transformation T4 du diagnostic d'œil critique, pilot digit-ai-factory · le 26/10/2026 à 16:58 (heure de Paris, UTC+1) · Claude Opus 5.5.

Intention : vous donner de quoi trancher D-79 sans relire le diagnostic. Test rétro : la décision porte le contenu, le coût, l'ordre et l'effet de chaque option.

## 2. Verdict en une ligne

1 décision détaillée sur 1 demandée, 3 options chiffrées, recommandation (c) inchangée depuis 16:02.

## 3. Décisions attendues

> **D-79 — Faut-il avancer, avant T2 et T3, le contrôle de fin de tour qui exige forge-audit et forge-data quand la demande les appelle ?**
>
> - **De quoi s'agit-il** :
>   - le constat : sur 7 jours de ce poste, aucune trace de forge-audit sur une douzaine de demandes d'audit ou de conformité, aucune trace de forge-data sur les demandes de données, design (marque) rarement tracé sur les documents ;
>   - l'option (b) : une règle de l'oracle de fin de tour, dans `oracles/oracle-synthese.mjs` ; une demande d'audit cite au bloc 4 sa trace forge-audit (un rapport `forge/audit/…` ou l'appel de `tools/verifier-rapport.mjs`), une demande de données sa trace forge-data, ou le motif de leur absence ; sinon la restitution est refusée ;
>   - l'option (c) : T4 entière, TF-1949 ; une carte des forges privilégiées en 7 types de demande ; à chaque demande, un verdict « mobilisée » ou « écartée » avec motif pour chacune des 13 forges, écrit dans un fichier de trace chez le produit et résumé en une ligne à l'écran ; un verrou qui refuse « livré » si un livrable d'une forge mobilisée manque ; le fichier hérité par les produits, `gabarits/CLAUDE-PRODUIT.md`, ramené de 28 040 octets à 6 Ko au plus ;
>   - l'ordre : le chantier T2 (compte rendu allégé), lancé à 16:00, réécrit en ce moment le même hook et le même oracle de fin de tour.
> - **Le problème** : (b) se fait seul en un court chantier, mais ne couvre que 2 forges sur 13 et sera repris par T4. (c) couvre les 13 forges et allège le contexte de tous les produits, mais touche les fichiers que T2 modifie ; lancée en même temps, elle se heurterait à T2. Votre réponse 69a place T4 après T3.
> - **Pourquoi vous** : c'est l'ordre des transformations que vous avez arrêté par 69a.
> - **Recommandation : (c)** — elle ferme l'oubli pour les 13 forges en une fois, sans écrire une règle que T4 remplacerait ; partant après la fusion de T2, elle ne se heurte à rien. Source consultée : diagnostic `output/03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261026a.md`, §d-T4, et la mission 5 des 6 lots de l'analyse.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| **(a)** Garder l'ordre de T4, après T3 | Les forges audit et data restent oubliées jusqu'à T3 ; aucun chantier de plus | nul | sans objet |
| **(b)** Contrôle audit et data seul, maintenant | Une règle de fin de tour pour 2 forges, sans attendre T2 ; T4 la remplacera | simple × court | retirer la règle |
| **(c)** *(recommandée)* T4 entière dès la fusion de T2 | Carte, 13 verdicts motivés, verrou « livré » et héritage allégé chez les 26 produits relevés, non rétroactif | moyen × moyen | rétablir l'héritage complet et retirer le verrou |

> **Sans réponse** : (a), T4 garde son ordre.

## 4. Traité

- Taille du fichier hérité par les produits mesurée par `wc -c` : 28 040 octets aujourd'hui.
- Item de la transformation T4 relu au registre : TF-1949, décidé par 69a.
- Décision reposée en entier, contenu de chaque option détaillé.
- Relecture d'intention : sans objet, le tour n'écrit que ce détail.

## 5. Non traité

- Chantiers T2 et D-78 : toujours en cours, non rendus.
- Publication du pilot : elle suivra leur fusion.

## 6. Écarts à la lettre

Aucun écart : vous avez demandé le détail de D-79, et c'est ce qui est rendu.

## 7. Risques

- Énoncé : avec (c), le verrou « livré » refuse une livraison dont la forme attendue est mal calibrée. Signal : un livrable exigé qui n'a pas de sens pour le produit. Parade : chaque forge mobilisée porte son motif, et un écart se corrige dans la carte, sans rouvrir les livraisons passées.

## 8. Prochaines actions

Ordre : trié auto_ia d'abord ; A-2 suit votre réponse.

| Sélecteur | Registre | Action | Acteur | Motif ou raison | Commande | Coût de ne pas la faire |
|---|---|---|---|---|---|---|
| **A-1** | TF-1947 | Fusionner T2 et D-78 à leur retour, rejouer les recettes, publier le pilot | auto_ia | dependance_externe | retour des 2 agents lancés à 16:00, puis `git push origin main` | l'autre poste ne reçoit aucune de ces règles |
| **A-2** | TF-1949 | Lancer T4 selon votre réponse à D-79 | auto_ia | dependance_bloc_3 | réponse « 79c » ou autre lettre | les forges audit et data restent oubliées |

## 9. Traces

- `output/03-etudes/Digit-AI - Diagnostic Factory - Oeil critique - 20261026a.md`, §d-T4.
- `todo/TODO.jsonl`, TF-1949.
- `gabarits/CLAUDE-PRODUIT.md`, 28 040 octets.
