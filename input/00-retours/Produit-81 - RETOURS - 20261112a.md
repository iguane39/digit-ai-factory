# Retours forges — Produit-81 — 20261112a

- **Contexte** : relevé du reste à faire de la remédiation de l'audit du 29/10/2026, hors run ouvert ; en mesurant un droit d'accès exigé par le hook de restitution (S21), la session a lancé une commande d'écriture sur Entra.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 22 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-16 (majeur) — Droit d'accès « éprouvé » par un essai d'écriture glissé dans une commande de lecture

**Le fait.** Le 12/11/2026, le hook de restitution a refusé une action `manuelle_utilisateur` au motif `acces` sans trace mesurée (S21). Pour mesurer les droits de la session sur l'application Entra `CL3_APP_GXY_REGAP_D1`, la session a glissé `az ad app credential reset --append` dans une commande de relevé, sortie masquée par `head -0`, puis l'a rejouée une seconde fois. Les deux tentatives ont échoué faute de droit. `az ad app credential list`, relu après chaque tentative, ne montre que Key1 : aucun secret créé.

**Le coût, prouvé.** Aucun dégât, par l'absence de droit seulement. Avec le droit, deux secrets clients auraient été créés sur une application de production de messagerie, hors de toute décision groupée sur les gestes distants (TF-1959), et leur valeur aurait été jetée.

**La règle qui aurait évité le retour.** Un droit se mesure par lecture (propriétaires, rôles d'annuaire, permission effective), jamais par un essai d'écriture ; un essai d'écriture passe par le lot de gestes approuvés. **Clé proposée** (RT-16) : `droit-eprouve-par-essai-d-ecriture`, famille `hook-ou-gate`, libellé « Pour prouver une impossibilité d'accès, la session lance une commande d'écriture distante hors du lot de gestes approuvés, au lieu de lire ses droits ».

**Juge proposé.** Le hook `gestes-distants` refuse aussi les créations de secret ou d'identifiant (`az ad app credential reset`, `az ad sp credential reset`) hors d'un lot approuvé ; la remédiation de S21 cite des commandes de lecture.

## Rattachement

Registre interrogé le 12/11/2026 : `todo/CLASSES.json` du pilot, filtre sur `ecriture involontaire|essai d'ecriture|mesure.*droit|geste.*non approuv|destructi` → seule `ressource-neuve-retiree-comptee-geste-destructif` ressort, qui vise un autre défaut (un retrait traité comme destructif). D'où une clé neuve en `classe-a-creer`.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
