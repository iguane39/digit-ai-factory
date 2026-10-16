# Retours forges — Produit-61 — 20260906b

- **Contexte** : suite du retour humain du 06/09 (test de la lecture d'ardoise sur qualif avec la clé du commanditaire)
- **Références ledger** : `forge\ledger.jsonl` seq 83 (entrée `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-06

Ce lot porte un seul retour : une forme de clé Anthropic que ni le skill ni le gabarit de variables ne prévoient, et qui fait échouer l'appel sans que le produit sache le dire.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

La clé fournie a été posée sur qualif et la lecture d'ardoise a rendu 502 ; le diagnostic a demandé un appel direct à l'API.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-4 | majeur | générique | La clé est une clé d'organisation non rattachée à un espace de travail : `models.list` répond 400 « This API key is not scoped to a workspace, so this request must include the anthropic-workspace-id header ». Le produit rendait 502 sans nommer la cause ; ni le skill claude-api ni le gabarit `.env.example` de la factory ne prévoient une variable d'espace de travail. Ledger seq 83. | ajouter `ANTHROPIC_WORKSPACE_ID` (optionnel) au gabarit `.env.example` et au skill claude-api (`default_headers` `anthropic-workspace-id`), et citer le message d'erreur dans le diagnostic |

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec le verdict de généralisation.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le lecteur d'ardoise ne pouvait pas porter l'en-tête d'espace de travail et masquait la cause de l'échec | variable `ANTHROPIC_WORKSPACE_ID` (config, `.env.example`, PARAMETRAGE), en-tête posé par défaut sur le client, message d'échec citant la réponse de l'API, test rouge → vert `test_lecteur_claude_porte_l_espace_de_travail_quand_il_est_fourni` | oui | remonté ci-dessus, RP-4 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot. Vérifié par le pilot du run, le 06/09/2026.

## Confirmations positives

- Le refus nommé du lecteur (E-021) a tenu : la page de lecture a rendu 502 avec un message plutôt qu'une erreur muette.

## Ordre recommandé

1. RP-4 : une variable dans deux gabarits et une ligne de skill.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce retour suit un retour humain. La règle existante « un tiers absent refuse avec sa cause » (EA6) couvrait la forme du refus, pas la variable manquante ; la classe la plus proche est `surface-implicite-non-livree`.
