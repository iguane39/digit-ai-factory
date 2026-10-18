# Retours forges — Produit-79 — 20261017a

- **Contexte** : autre — retour humain du 17/10/2026 sur une restitution affichée dans le chat de l'extension VS Code
- **Références ledger** : `forge\ledger.jsonl` seq 243 (entrée `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

---

## pilot (`digit-ai-factory`)

Une restitution conforme au gabarit et jugée « affichable » par `hook-restitution --prejuger` a été refusée par son lecteur sur la forme de ses listes. Le lecteur avait déjà posé la règle le 07/10/2026 (TF-1621). Ce retour récidive donc sur un support que les juges d'E-11 ne couvrent pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-10 | majeur | générique | Retour humain du 17/10/2026, mot pour mot : « J'ai déjà dit que lorsqu'il y avait des listes, il devait y avoir des puces et sous-puces affichées, ce qui n'est pas le cas ici. Corrige et remonte à la Factory pour correction et application systématique. » Fichier : `output\06-rapports\Produit-79 - Rapport - Synthèse connexion Google Analytics Ads Search Console - 20261017c.md`. Son guide en tête comptait 4 étapes numérotées ; chacune enchaînait 3 à 6 gestes (écran, champ, bouton) et son « Résultat attendu » dans un seul paragraphe. L'option (a) de D-59 portait « Comment faire : 1) … 2) … 3) … » sur une ligne de tableau. `node oracles\hook-restitution.mjs --prejuger` : `affichable: true`, 0 bloquant. Cause : S53 (`gabarits\RESTITUTION.md`, ligne 24) prescrit « des étapes numérotées, chacune close par Résultat attendu » sans exiger une sous-puce par geste ; S49 donne en exemple la forme en ligne « Comment faire : 1) … 2) … 3) … » ; E-11 (`references\ECRITURE.md`) n'a de juge que sur HTML (L12, TF-1621, TF-1665) et sur PPTX (TF-1390). | Règle qui aurait évité le retour : E-11 de `references\ECRITURE.md` (« une liste énumère »), sans juge sur le Markdown. Proposition : (1) S53 exige une sous-puce par geste dans chaque étape, et « Résultat attendu » en dernière sous-puce ; (2) S49 remplace l'exemple en ligne par une liste numérotée placée sous le tableau des options ; (3) `oracle-synthese` et `oracle-ecriture` jouent E-11 sur le Markdown : un point de liste ou un paragraphe qui enchaîne trois gestes ou plus, ou une énumération « 1) … 2) … » en ligne, est accusé. |

## Rattachement

Registre interrogé le 17/10/2026 : `node -e "…"` sur `todo\TODO.jsonl`, filtre des entrées `creation` dont le titre ou le contenu répond à `/(sous-puce|en puces|sous forme de liste|énumér[ée]s? (par virgule|dans un paragraphe|en prose)|enumer.*(virgule|prose)|E-11|S53|étapes numérotées|etapes numerotees)/i`, sans borne → 13 ligne(s) trouvée(s).
Items recoupés : TF-1621 (corrigé ; retour RA-2 (deuxième retour de ce produit à digit-ai-forge-agents, lot 20261007e) : énumération en prose dans une page HTML, juge L12), TF-1390 (corrigé, E-11 sans juge sur un deck PowerPoint), TF-1665 (corrigé, cellule HTML qui énumère en prose). Aucun ne couvre la restitution Markdown ni la forme prescrite par S49 et S53 ; RP-10 est une récidive de la classe sur un nouveau support.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé chez lui, et s'il fallait le remonter.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Guide et option (a) de D-59 de la restitution 20261017c en paragraphes | guide réécrit : un point numéroté par étape, une sous-puce par geste, « Résultat attendu » en sous-puce ; option (a) sortie du tableau en liste numérotée | oui | remonté ci-dessus, RP-10 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- S53 a bien fait poser le guide en tête du message, avec sa source officielle et sa date de lecture ; seule la forme interne des étapes est en cause.

## Ordre recommandé

1. RP-10 : la correction du gabarit (S49, S53) est courte, et le juge E-11 sur le Markdown ferme la classe pour toutes les restitutions de l'écosystème.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RP-10 suit un retour humain. La règle est E-11 de `references\ECRITURE.md`, écrite mais sans juge sur le Markdown ; S49 et S53 de `gabarits\RESTITUTION.md` prescrivent une forme qui la contredit.
