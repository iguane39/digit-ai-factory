# Retours forges — Produit-86 — 20261112d

- **Contexte** : run `20261112a-comptes-et-ecritures`. Le porteur demande, le 12/11/2026, que la Factory enchaîne les étapes déjà validées, à la suite ou en parallèle selon leurs dépendances, sans le relancer à chaque étape, et qu'elle le lui propose d'elle-même. Sa demande, passée au crible L99, est dans `output/Produit-86 - Revue - Prompt enchaînement des actions validées passé au crible L99 - 20261112a.md`.
- **Références ledger** : `forge\ledger.jsonl` seq 960 (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Le registre interrogé le 12/11/2026 est `todo/CLASSES.json` du pilot. RP-66 s'y rattache à `decision-posee-hors-du-ressort-humain` : une validation de simple passage à l'étape suivante est posée à l'humain, sans motif qui lui revienne. La classe voisine `tour-clos-sur-une-attente` décrit l'effet du hook.

## digit-ai-factory

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-66 | majeur | générique | Voir le détail sous ce tableau : le fait, les règles existantes et ce qu'elles ne couvrent pas. | Une règle d'enchaînement des étapes validées, détaillée sous ce tableau, avec la modification du hook et un essai borné. |

### Le fait

Les sessions posent à l'humain des validations de simple passage, une par tour.

- **La mesure** : au ledger de Produit-86, 14 réponses humaines sur 49, du 03/11 au 12/11/2026, ne font que valider des actions numérotées A-N. Mesure faite sur `forge/ledger.jsonl`, entrées `reponse_humain`.
- **Trois réponses, mot pour mot** :
  - « A1 puis A3 » (seq 803) ;
  - « lance tout maintenant » (seq 918) ;
  - « A1 : Envoyer à la Factory. A2, A3, A4, A5, A6, A7 » (seq 958).
- **Les relances du 12/11/2026**. Le porteur a écrit : « Lorsque les agents auront terminés, lance directement toutes les actions suivantes […] pour que je n'ai qu'à récupérer le résultat final entièrement terminé ». Il a ensuite demandé s'il pouvait signer en avance un mandat « pour que les actions suivantes s'exécutent également à la suite sans perte de temps ».
- **Le hook de restitution** refuse un message d'attente pendant qu'un travail tourne en arrière-plan : 36 refus sur 83, du 29/10 au 05/11/2026 (leçon L-006, TF-1947). Chaque attente d'agent produit donc un compte rendu complet, que l'humain doit lire.

### Les règles existantes, et ce qu'elles ne couvrent pas

- **La loi n° 5, voie automatique d'abord**, dit qui fait un geste. Elle ne dit pas quand enchaîner l'étape suivante d'un plan déjà validé.
- **R-58** : une décision n'est posée que si elle relève de l'humain. Elle n'interdit pas de reposer à chaque tour un « on continue ? » sur des étapes déjà acceptées.
- **La décision groupée des gestes distants** (`references/GESTES-DISTANTS.md`) groupe les seuls gestes destructifs.
- **Le feu vert de publication**, une fois par produit, ne couvre que la publication.

### La proposition

1. **Proposer, d'office.** Quand une demande ou une restitution porte 2 actions ou plus qui ne dépendent que du succès des précédentes, la session propose en une ligne de les enchaîner, avec une réponse fermée (« tout »).
2. **Consigner le consentement unique** au ledger : les étapes, leur ordre (à la suite ou en parallèle, selon les dépendances) et une durée, sur le modèle du lot de gestes approuvés (24 h au plus).
3. **Enchaîner sans revenir vers l'humain**, y compris après les notifications d'agents. Chaque étape garde son oracle, et la session reste comptable de chacune.
4. **S'arrêter sur 4 conditions seulement** :
   - un invariant de `references/NIVEAUX.md` : geste irréversible, poussée ou publication sans feu vert écrit dans la chaîne, signature ou geste réservé à l'humain, dépense ;
   - un échec d'oracle non corrigé dans sa borne ;
   - un résultat qui change le périmètre, ou qui appelle une décision absente de la chaîne ;
   - l'expiration du consentement.
5. **Adapter le hook.** Sous une chaîne consignée, le hook de fin de tour admet un message d'attente court. La restitution complète n'est due qu'à la fin de la chaîne ou à un arrêt, et elle liste chaque étape avec sa preuve.
6. **Faire un essai borné d'abord**, jugé sur un critère écrit d'avance : le nombre de réponses de pure validation par run, avant et après.

Forge associée : `digit-ai-forge-agents`, pour la reprise d'une chaîne après la notification d'un agent d'arrière-plan.

## La règle qui aurait évité le retour

- `decision-posee-hors-du-ressort-humain` (RP-66) : une étape déjà acceptée dans un plan ne se repose pas à l'humain ; seul un arrêt nommé le fait revenir.

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré au lot 20261109b) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- La consigne du porteur, « lance directement toutes les actions suivantes », a suffi pour que la session enchaîne sans revenir : poussée, chaîne de contrôle, chargement de la base et vérification se sont suivis dans les tours suivants, sans aucune question.
