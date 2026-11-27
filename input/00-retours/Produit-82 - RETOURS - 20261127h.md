# Retours forges — Produit-82 — 20261127h

> Réindexé à la réception (pilot, 27/11/2026) : remis sous l'indice 20261127c, déjà porté par un autre lot du même produit ingéré le même jour ; indice suivant libre : 20261127h. Contenu inchangé.
> Annoté à la réception (pilot, 27/11/2026, D-241 (a)) : RT-64, RT-65 et RT-66, déjà définis par le lot 20261127c du même produit, sont renumérotés RT-73, RT-74 et RT-75.

- **Contexte** : construction des budgets en euros et des clés d'API du portail par un agent constructeur, le 27/11/2026, puis vérification par la session principale.
- **Références ledger** : `forge\ledger.jsonl` seq 444, 445, 446
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-11-27

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## digit-ai-forge-design, outillage de la critique d'implémentation

Les deux retours portent sur ce que le point d'entrée de la critique rend sans le dire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-73 | majeur | générique | Le 27/11/2026, `scripts/fabriquer-etat-connexion.mjs` a rendu « ok » sur un état sans session. Son bouton par défaut était « Afficher » le mot de passe, et non l'envoi. L'URL finale restait `/connexion`, avec le seul cookie de pré-session. 10 critiques ont rendu SKIP X0 avant que l'agent ne passe `--bouton "#form-connexion button[type=submit]"` et `--attendre-url`. Preuve : `forge\ledger.jsonl` seq 444. | Le fabricant vérifie, avant de rendre « ok », que l'URL finale n'est plus la page de connexion. Son bouton par défaut est le bouton d'envoi du formulaire. |
| RT-74 | mineur | générique | `run-oracles-design --rendu` ne passe pas `--etats-ouverts` à render_page. Les états d'un inspecteur ou d'un panneau ouvert ne sont jugés que si l'on appelle render_page à part. L'agent l'a fait : 168 états mesurés, 18 PASS. Preuve : `forge\ledger.jsonl` seq 445. | Le point d'entrée transmet `--etats-ouverts`, ou le juge par défaut quand la page porte des éléments repliés. |

## digit-ai-forge-agents, composant find-in-page.js du socle

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-75 | mineur | générique | `find-in-page.js` surligne aussi dans les boutons inline-flex. Le libellé surligné devient insécable, et un tableau mesure alors 1027 px dans une fenêtre de 1024 (page Organisations sous /Fit-Retail2, recherche « a »). Contourné au produit en plaçant le libellé du bouton dans un `<span>`. Preuve : `forge\ledger.jsonl` seq 446. | Le composant ignore les boutons et les contrôles, ou surligne sans changer le type de boîte du libellé. |

## Remarques restées au produit

- D9 face à D-35 (b) : le coût affiché est le prix des fournisseurs converti en euros, et le tarif de Digit-AI reste non affiché. Conflit consigné au ledger (seq 447) (généralisable : non).
- L'agent n'a pas tenu la cadence d'avancement de 3 minutes, et sa consigne ne disait pas pourquoi elle l'affectait à Opus. Corrigé pour les prochaines consignes du produit (généralisable : non).

## Retours sur les documents produits

Aucun document produit depuis un gabarit dans ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- Les mesures d'alignement et de débordement écrites le matin même ont servi telles quelles à l'agent, et ont trouvé 4 défauts qu'il a corrigés avant de rendre.

## Ordre recommandé

1. RT-73 : un faux succès d'outil a fait passer 10 critiques pour indéterminées.
2. RT-74, puis RT-75.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit aucune correction humaine. La règle est qu'un outil qui fabrique un état le vérifie avant de rendre « ok », qu'un point d'entrée juge tout ce que la page peut montrer, et qu'un composant ne change pas la mise en page de ce qu'il marque. Classes proposées : `faux-succes-d-outil`, `etats-ouverts-non-juges` et `surlignage-qui-change-la-mise-en-page`.
