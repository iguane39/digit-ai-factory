# Lot de retours — Produit-64 → pilot (gabarits/documents, écriture des restitutions) — 2026-10-12, indice d

**Émetteur** : produit `Produit-64` · **Cible** : `pilot`, c'est-à-dire la bibliothèque `gabarits/documents/` et la consigne d'écriture des réponses (`references/ECRITURE.md`, `gabarits/RESTITUTION.md`).

**Origine** : deux paroles du porteur, le 12/10/2026, à propos de l'analyse des coûts Azure d'APR2.

1. La demande : « Fournis le constat et les précos dans un fichier MD, simple, bref, lisible et exploitable ».
2. Le verdict, après livraison : « Le fichier MD construit répond bien à la demande "simple, bref, lisible & exploitable". Fais en sorte que les explications données pour les futurs sujets respectent ce type de demande et remonte le à la Factory. »

Ce lot porte **2 retours** et **1 document mûr déclaré**.

- **Contexte** : diagnostic des coûts d'une souscription Azure, mené en conversation, hors run.
- **Références ledger** : sans objet, car ce produit ne tient pas de ledger de run.
- **Remise au pilot** : ce fichier et son sidecar sont copiés dans le SAS `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : **remis le 2026-10-12** dans le sas d'arrivée du pilot, empreintes SHA-256 comparées des deux côtés après la copie. L'original reste ici, historique du produit.

---

## pilot (`gabarits/documents`, `references/ECRITURE.md`, `gabarits/RESTITUTION.md`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-36 | majeur | générique | **Aucune famille ne porte la « fiche constat et préconisations », la forme qu'un lecteur technique a jugée exploitable.** Le document `output/03-Syntheses/Client-A - Couts APR2 - Constat et precos - 20261012d.md` fait 744 mots et tient sur une page. Il contient : « En bref » en 4 puces chiffrées ; un tableau de coûts ; 4 constats numérotés, chacun titré par une phrase-verdict en gras et suivi de 1 à 2 puces de preuve ; un tableau de 5 préconisations `# / Action / Gain par mois / Effort / Attention` ; une ligne « Rien à faire » motivée ; un ordre conseillé ; une ligne de sources. Verdict du porteur, cité au paragraphe « Origine ». Les deux familles voisines ne conviennent pas. `gd-note-synthese-audit` s'adresse à un commanditaire **non technique** et porte **une** décision. `gd-diagnostic` est **lourd** : 5 sections dues, commandes et sorties, causes candidates. La fiche APR2 sert une **équipe qui va agir**, avec plusieurs actions chiffrées et une page au plus. | Extraire une famille `fiche-constat-precos`, ou une variante courte de `gd-diagnostic`. **Sections dues** : En bref (3 à 4 puces chiffrées) · Constat (1 tableau, plus 3 à 5 constats titrés par leur verdict) · Préconisations (tableau `# · Action · Gain · Effort · Attention`, 5 lignes au plus) · Rien à faire (motivé) · Ordre conseillé · Sources (une ligne). **Bornes jugées** : environ 800 mots au plus, 5 actions au plus, chaque constat porteur d'au moins un chiffre, chaque action porteuse d'un gain ou d'un effet nommé. Instance fictive à tirer de la forme, jamais de la matière. |
| RT-37 | majeur | générique | **Une explication demandée est rendue sous la forme longue de la restitution, et le lecteur doit réclamer le document exploitable.** Dans la même session, le porteur a reçu ses diagnostics (détail des coûts, puis recommandations pour APR2) sous forme de restitutions en 9 blocs : synthèse d'ouverture, en-tête, verdict, décisions, traité, non traité, écarts, risques, actions, traces. Il a dû demander **deux fois** un fichier : « Fournis un MD de ce rapport ainsi que les actions à mettre en oeuvre », puis « Fournis le constat et les précos dans un fichier MD, simple, bref, lisible et exploitable ». Le contenu utile existait dès le premier tour, mais il était dispersé entre les blocs, avec les identifiants et le journal du tour. Le hook de restitution impose, à juste titre, la forme jugée du **tour**. Rien ne dit où va **l'explication elle-même** quand c'est elle que l'humain a demandée. | Ajouter une règle à `references/ECRITURE.md`, et un renvoi dans `RESTITUTION.md` : quand la demande humaine est une **explication** (expliquer, diagnostiquer, détailler, « fournis les précos »), le contenu se livre dans une **fiche datée** à la forme de RT-36. La restitution du tour **renvoie à la fiche** au lieu d'en dupliquer le contenu dans ses blocs 4 et 8. Contrôle possible dans `oracle-synthese` : une restitution dont le bloc 4 dépasse un seuil de lignes de contenu explicatif, sans fiche citée, est signalée. |

**Portée** : générique. Tout produit dont l'humain demande une analyse en conversation y est exposé.

## Rattachement

Registre interrogé le 12/10/2026 (`todo/TODO.jsonl`, termes « constat et préco », « fiche diagnostic », « simple bref », « lisible », « exploitable ») : aucun item ne vise cette forme ni cette règle.

- `gd-note-synthese-audit` (statut `a_extraire`) et `gd-diagnostic` sont les familles voisines, écartées pour les raisons données en RT-36.
- La classe `restitution-fichier-juge-mal-choisi` est voisine de RT-37 sans le couvrir : elle traite de ce que le hook juge, pas de l'endroit où l'explication doit vivre.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les diagnostics de la session étaient d'abord livrés en restitution longue | Fiche datée produite à la demande, et préférence inscrite dans la mémoire de session du produit (`explications-fiche-breve-exploitable`) | oui | remonté : RT-37 |
| Le premier rapport Markdown de la session (BAV) était plus long que la fiche APR2 | Non repris : le porteur a validé la forme APR2 | oui | remonté : RT-36, qui fixe la forme et ses bornes |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : la fiche APR2 a été écrite sans gabarit, faute de famille adaptée. C'est l'objet de RT-36.

## Documents mûrs

| Document (chemin CHEZ LE PRODUIT, jamais une copie) | Versions | Oracles du dernier indice | Verdict humain cité | Composants qu'il porte | Verdict de remontée |
|---|---|---|---|---|---|
| `output/03-Syntheses/Client-A - Couts APR2 - Constat et precos - 20261012d.md` | 1 | contrôle de colonnes des tableaux (0 défaut), sommes recalculées (écart déclaré) | « Le fichier MD construit répond bien à la demande "simple, bref, lisible & exploitable". », le 12/10/2026 | en bref chiffré, tableau de constat, constats titrés par leur verdict, tableau de préconisations gain / effort / attention, rien à faire, ordre conseillé | remonté : famille proposée `fiche-constat-precos` (RT-36) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot : aucun déploiement n'a été tenté.

## Confirmations positives

- La règle « un chiffre par affirmation » (E-14) et l'ouverture en langage de commanditaire de `RESTITUTION.md` ont tenu dans la fiche, et le porteur l'a jugée lisible. La forme proposée en RT-36 en hérite.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-36** : classe existante `gabarit-famille-manquante`, « Aucune famille de gabarit ne couvre un type de document produit ».
- **RT-37** : aucune classe existante ne convient.
  - Clé proposée : `explication-rendue-en-forme-longue`
  - Famille : `restitution-forme`
  - Libellé : « Une explication ou un diagnostic demandé par l'humain est rendu dans la forme longue de la restitution, au lieu d'une fiche brève et exploitable, et le lecteur doit réclamer le document qu'il attendait. »

## Ordre recommandé

1. **RT-37**, parce qu'une règle d'écriture agit dès la session suivante, dans tous les produits.
2. **RT-36**, parce que la famille donne à la règle sa forme jugée.
