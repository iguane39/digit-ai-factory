# Retours forges — Produit-82 — 20261126a

- **Contexte** : six maquettes du portail confiées à Codex et Gemini, en arrière-plan, pendant une vingtaine de minutes. Les lignes d'attente écrites à l'humain pendant ce temps ont été refusées par le hook de fin de tour.
- **Références ledger** : `forge\ledger.jsonl` seq 368
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-26

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-factory, hook de restitution

Le retour porte sur une réponse courte d'attente que le hook juge comme une restitution.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-56 | mineur | générique | Le 26/11/2026, 6 gestes `concevoir` tournaient en arrière-plan. La réponse « Gemini 1 a fini : verdict PASS en 662 secondes. J'attends les cinq autres. » (14 mots) a été refusée comme « message portant un VERDICT », en S1 et S4. Une seconde ligne d'attente de 94 mots l'a été aussi. La forme « Suivi agents » passe le même juge, mais aucun message ne la propose avant le premier refus. Preuve : `forge\ledger.jsonl` seq 368. | Reconnaître comme point de suivi une réponse courte, sans écriture, qui relaie l'état d'agents en arrière-plan. À défaut, rappeler la forme « Suivi agents » dès qu'un agent est lancé en fond. |

## Remarques restées au produit

Aucune remarque restée au produit sur ce lot : rien à dire, le seul défaut observé relève du hook du pilot (généralisable : sans objet).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Le lanceur `agent-tiers.mjs concevoir` a rendu 6 PASS sur 6, de 662 à 1347 secondes, sans aucune écriture hors des dossiers jetables.

## Ordre recommandé

1. RT-56 : chaque refus coûte un aller-retour et affiche un doublon à l'écran pendant une attente où rien n'a été écrit.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle est qu'une ligne d'attente sans écriture, qui cite le verdict d'un outil en arrière-plan, se juge comme un point de suivi et pas comme une restitution. Classe proposée : `attente-agent-jugee-comme-restitution`.
