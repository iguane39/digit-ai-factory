# Retours forges — Produit-03 — 20261020a

- **Contexte** : le 19/10/2026, un prompt de réalignement des pipelines a prescrit une conception contraire à une règle commune écrite (`GDE0202-R05`) ; trois relectures l'ont laissée passer ; le commanditaire l'a relevée le 20/10 par une question.
- **Références ledger** : `forge\ledger.jsonl` seq 6 (D-72, question mal cadrée) et 21 (D-79, correction)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation. L'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## `pilot` — une conception écrite sur des résumés de la règle, jamais sur son texte, et des relecteurs qui n'ont pas la règle

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-79 | majeur | générique | **La règle était écrite et claire ; la conception s'est faite sur trois résumés successifs, et aucun relecteur ne l'avait sous les yeux.** `GDE0202-R05` dit « Un artefact se construit une seule fois, puis se promeut de développement en qualification puis en production ». Chaîne observée : (1) plan du 19/10 à 12h06 conforme (« construite une fois sur `env/dev`/`main`, importée … dans les registres hpr puis prd »), écrit d'après la ligne MOD-01 du comparatif ; (2) question D-72 posée à l'humain sous une forme rétrécie, « importée par digest depuis la qualification », tirée du contrôle « empreinte production = empreinte qualification » et d'un ancien retour (`RPC-02`) — l'humain répond « 72a » sur ce cadrage ; (3) le prompt (15h30) dérive du libellé de D-72, pas de la règle : « la livraison de qualification la construit » ; `grep -c` du texte de la règle dans le prompt et le plan : 0 et 0 ; (4) deux passes L99 et deux relectures d'intention jugent la cohérence interne et la conformité à la demande — aucune n'a reçu le texte de la règle ; la passe 2 renforce l'erreur (« la qualification ne construit que depuis une étiquette `v*` ») ; (5) le plan, juste, est réaligné sur le prompt, faux. Rien ne l'a arrêté : l'humain l'a vu le 20/10 en demandant « Que dit la règle ? ». La règle de restitution « quand la doctrine régit le mot, c'est elle la source » existe, mais aucun contrôle ne la joue sur un prompt, un plan ni une décision. | Trois gestes : (a) toute D-N, tout plan, tout prompt qui met en œuvre une règle nommée (`GDE…`, `R-…`, `MOD-…`) porte son texte cité mot pour mot avec sa source (fichier et commit), et un contrôle vérifie que la citation se retrouve à la source ; (b) la relecture d'intention et l'analyse L99 reçoivent, en plus de la demande, le texte des règles que le livrable cite, et une question de conformité (« le livrable contredit-il une règle citée ? ») ; (c) quand deux livrables d'un même chantier divergent (plan contre prompt), la divergence arrête le travail et renvoie à la source, au lieu d'être alignée d'un côté. |

## Rattachement

Registre interrogé le 20/10/2026 : `grep -c -i "texte de la règle\|résumé de la règle\|règle source\|sans citer la règle" todo/TODO.jsonl` → 5 ligne(s) trouvée(s).
Items recoupés : aucun ; les 5 lignes désignent TF-1208 (seuil de redite de forge-audit), TF-1472 (type de projet documentaire) et TF-1829 (résumé du relevé R-47), sans rapport.

## La règle qui aurait évité le retour

Une conception qui met en œuvre une règle commence par en citer le texte à la source ; un relecteur juge le livrable contre ce texte, pas seulement contre la demande. **RA-79** : clé proposée `conception-sur-resume-sans-texte-de-regle`, famille `regle-morte`, libellé « Un livrable met en œuvre une règle écrite d'après des résumés successifs (comparatif, décision, retour antérieur), sans en citer le texte, et ses relecteurs ne la reçoivent pas : il la contredit sans qu'aucun contrôle le voie ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Prompt et plan prescrivaient la construction en qualification | règle citée mot pour mot dans les deux, lieu de construction mis en attente de D-79 | oui | remonté ci-dessus en `RA-79` |
| La restitution du 20/10 08h56 déclarait « reste au produit » | requalifiée : l'écart est généralisable | oui | remonté ci-dessus en `RA-79` |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- La règle « une décision déjà posée se rappelle en une ligne » a laissé la décision D-79 se poser en entier : la correction a pu être tranchée par l'humain, pas imposée.

## Ordre recommandé

1. `RA-79` : un seul retour.
