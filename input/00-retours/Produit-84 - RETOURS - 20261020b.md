# Retours forges — Produit-84 — 20261020b

- **Contexte** : autre — travail hors run du 20/10/2026, renvoi par l'utilisateur de la proposition de sécurité jugée trop longue
- **Références ledger** : `forge\ledger.jsonl` seq 55 et 56 (entrées `type: retour`)
- **Pièce jointe** : `Produit-84 - RETOURS - 20261020b - PJ - mesure_concision.py`, la mesure jouée au produit
- **Remise au pilot** : copie de ce fichier, de son sidecar et de la pièce jointe dans `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`
- **Statut** : remis le 20/10/2026

Convention de gravité : **bloquant** · **majeur** · **mineur**.

## Rattachement

Registre non interrogé dans ce lot : le pilot rattache à l'accueil.
- RT-24 est une récidive, signalée par l'utilisateur comme « déjà demandé plusieurs fois ».
- Il prolonge RT-16 et RT-17 du lot 20261019e, restés sans contrôle exécuté.

## digit-ai-factory

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-24 | majeur | générique | Proposition `output\04-cadrages\...Proteger sans contraindre - 20261020b.md`, section 1 : 1 paragraphe de 306 mots et 9 phrases, dont une de 52 mots. `oracle-ecriture.mjs` : PASS. Mesure jointe : 94 défauts. Cause au produit : le prompt imposait « la réponse en 10 phrases ». Citation : « J'ai déjà demandé plusieurs fois des textes courts, simples, clairs et précis, pourquoi n'est-ce toujours pas appliqués ? ». Ledger seq 55 | Voir les 4 points sous le tableau |
| RT-25 | mineur | générique | Même fichier, 14 lignes portent deux signes dollar. L'aperçu Markdown rend `194 $ par mois, dont 105 $` en formule mathématique (capture de l'utilisateur). Aucun oracle ne le voit. Ledger seq 56 | Signaler deux signes dollar non échappés sur une ligne hors code ; prescrire « USD » |

Propositions pour RT-24, à appliquer à tout prompt et tout document qui informe :
- un plancher chiffré dans `references\ECRITURE.md` :
  - paragraphe de 3 phrases et 60 mots au plus ;
  - phrase de 25 mots au plus ;
  - énumération de 3 éléments ou plus en liste, sur 2 niveaux au plus ;
- `oracle-ecriture.mjs` le rend bloquant, pas seulement sur 7 phrases longues d'affilée ;
- les prompts réécrits (`prompt-analyzer-l99`) ne commandent jamais « N phrases », mais « N puces au plus » ;
- un plafond de longueur se déclare dans le contrat de sortie de tout livrable commandé par prompt.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Proposition trop longue, énumérations en prose | version c structurée en puces, puis coupée ; mesure de concision à 0 défaut | oui, par RT-24 | Remonté en RT-24 |
| Prompt qui imposait une réponse en phrases | prompt c : « 10 puces au plus », forme courte au contrat | oui, par RT-24 | Remonté en RT-24 |
| Montants en « $ » rendus en formule | montants écrits « USD » ; script de clauses adapté | oui, par RT-25 | Remonté en RT-25 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque documentaire sur ce lot.

## Documents mûrs

- « Etude comparative - Pages Supabase ou Azure » : déclaré au lot 20261020a, reste au produit.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

La mesure jointe, jouée en 1 seconde, a ramené les défauts de structure de 94 à 0 sur la version c.

## Ordre recommandé

1. RT-24 : récidive vue par l'utilisateur sur chaque livrable.
2. RT-25.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-24** : E-2 n'est jugée que sur des séries de phrases longues, et aucun plafond ne vise le paragraphe ni l'énumération en prose. Classe à créer : clé `texte-long-non-structure`, famille `hook-ou-gate`, libellé « Un texte qui informe porte des paragraphes longs ou des énumérations en prose ».
- **RT-25** : aucun contrôle du rendu des signes monétaires. Classe à créer : clé `dollar-rendu-mathematique`, famille `hook-ou-gate`, libellé « Deux signes dollar sur une ligne sont rendus en formule mathématique ».
