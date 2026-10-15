# Retours forges — Produit-83 — 20261014b

- **Contexte** : clôture du run `Produit-83-20261014-fiche-produit`, restitution finale refusée par le hook de fin de tour
- **Références ledger** : `forge\ledger.jsonl` seq 32 (run_close)
- **Remise au pilot** : copie dans `<pilot>\input\00-retours\_arrivee\`, avec le sidecar.
- **Statut** : a_remettre

---

## Pilot (`digit-ai-factory`)

Le hook de restitution a jugé l'écran contre un document de projet, et non contre une synthèse.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-6 | majeur | générique | Le 14/10/2026 à 18:58, `forge/hooks/factory.mjs restitution` a refusé une restitution préjugée PASS (exit 0) en la comparant à `docs\projet\COMPOSANTS-OPS.md` : « options par défaut nommées : 0 dans le fichier jugé, 1 à l'écran ». Ce document porte `destinataire: humain` par son gabarit (`gabarits\docs-projet\COMPOSANTS-OPS.md`) et avait été écrit dans le tour ; `syntheseDuTour` le retient faute d'une synthèse nommée. | Ne retenir comme synthèse qu'un fichier hors `docs\projet\`, ou exiger le nom « synthèse » ou « restitution ». Le préjugement `--prejuger` devrait jouer le même choix de fichier que le hook de fin de tour. |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par Claude, le 2026-10-14.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

Le préjugement a rendu exit 0 sur la restitution, conformément à TF-1647.

## Ordre recommandé

1. RT-6, seul retour du lot.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Aucun retour de ce lot ne suit un retour humain : RT-6 vient du refus d'un hook.
