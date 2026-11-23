# Retours forges — Produit-61 — 20261123a

- **Contexte** : run du 23/11/2026 demandé par le porteur (réponse « A1 » dans la session du pilot) pour migrer le produit vers la reprise unique entre postes (R-64, D-224 (a)) et le modèle Drive D-238 (a), TF-2796 du pilot.
- **Références ledger** : `forge\ledger.jsonl` seq 137
- **Remise au pilot** : copier ce fichier et son sidecar dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre. La consigne du tour interdisait d'écrire dans le pilot, la remise attend donc la prochaine session autorisée.

L'identifiant RP-11 est le onzième retour adressé au pilot par ce produit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Rattachement

Registre interrogé le 23/11/2026 : `grep -i -E "autocrlf|renormali" todo/TODO.jsonl` → 9 ligne(s) trouvée(s).
Items recoupés : TF-2697 (RP11 d'oracle-reprise : sans `.gitattributes` au socle, un même commit se sert différemment selon le poste Windows). Le retour RP-11 s'y rattache : il porte sur le remède que RP11 prescrit.

## pilot (`digit-ai-factory`)

Le remède que RP11 prescrit ne suffit pas sur un poste en `core.autocrlf=true`, et aucun outil du pilot ne fait le geste qui manque.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-11 | majeur | générique | RP11 d'`oracles/oracle-reprise.mjs` 1.7.0 prescrit : poser le `.gitattributes` du socle (`* text=auto eol=lf`), `git add --renormalize .`, puis un commit. Mesuré le 23/11/2026 sur Produit-61, poste Dell-XPS-16, `core.autocrlf=true` : l'index était déjà en LF partout, et 265 fichiers suivis étaient en CRLF dans l'arbre (`git ls-files --eol`). Le renormalize ne touche pas l'arbre : une fois le `.gitattributes` commité, le clone neuf extrait du LF et RP11 vire au rouge sur ces 265 fichiers. Il a fallu réécrire l'arbre depuis l'index fichier par fichier (renommer, `git checkout-index`, supprimer la copie) pour 260 fichiers propres, puis `git add --renormalize` ciblé pour effacer les « M » sans contenu. L'autre poste devra refaire le même geste après le pull. | Donner à RP11 ou à `scripts/recopier-heritage.mjs` un mode `--renormaliser` qui réécrit depuis l'index les seuls fichiers suivis et propres, et ajouter ce geste au remède du message RP11. Règle qui aurait évité le retour : aucune ne couvre la remise en LF de l'arbre ; § 4 de quality-oracles (le remède d'un oracle se joue sur une fixture autocrlf=true). |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le garde utilisateur `garde-rm-variable` a refusé `rm "$f.tmp-eol"` pendant la remise en LF | suppression faite dans le script node déjà lancé (`fs.rmSync`) | non | rien de généralisable, parce que le garde a joué son rôle et que son message donnait le remède exact |
| Le lanceur `forge/hooks/factory.mjs` du produit datait d'avant le hook `reprise`, alors que `.claude/settings.json` l'appelait déjà | lanceur recopié depuis `gabarits/hooks-factory.mjs` | non | rien de généralisable, parce que le câblage TF-1755 du 23/11 a été posé à l'ouverture de cette même session et que l'héritage du lanceur suit au prochain rafraîchissement |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `oracle-reprise.mjs` 1.7.0 rend PASS sur 17 constats une fois le manifeste écrit et l'arbre remis en LF.
- Le passage réel `reprise --pousser` envoie 1 fichier au canal, exit 0.
- `synchro-drive.mjs --essai` rend `a_jour` avec 0 écart D-238 pour le produit.

## Ordre recommandé

1. RP-11 : un seul mode d'outil évite le même geste manuel sur chaque produit et chaque poste.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RP-11 ne suit pas un retour humain : il vient d'un oracle rouge après l'application de son propre remède. Aucune règle ne couvre la remise en LF de l'arbre de travail. La classe voisine `releve-heritage-juge-arbre-pas-histoire` est employée au sidecar ; la classe qui manque pourrait s'appeler `remede-prescrit-incomplet`, et il revient au pilot de la créer.
