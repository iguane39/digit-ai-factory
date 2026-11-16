# Retours forges — Produit-81 — 20261112c

- **Contexte** : remédiation de l'audit du 29/10/2026 en autonomie, hors run ouvert ; correction du porteur sur un mandat traité comme un lot borné.
- **Références ledger** : aucune (pas de run ouvert).
- **Références hors run** : `forge/hors-run.jsonl seq 26 ;` (entrée `type: retour`).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `C:\dev\digit-ai-factory\input\00-retours\_arrivee\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : a_remettre

Convention de gravité : **majeur** (temps perdu ou geste bloqué en cours de route) ; **mineur** (écart rattrapé sans coût mesurable).

## RT-17 (majeur) — Mandat « jusqu'à épuisement » arrêté après un lot, reste classé « hors mandat »

**Le fait.** Le 12/11/2026, le porteur a demandé d'avancer sur toutes les actions urgentes et prioritaires traitables sans dépendance. La session s'est arrêtée après un premier lot. Au point d'état suivant, elle a classé le lot restant (A-3) en `auto_ia` avec le motif `hors_mandat` (« la question demandait un état ; le lot se lance sur votre demande »). Le hook de restitution a accepté ce motif. Le porteur a dû demander : « pourquoi suis-je obligé de répondre continue afin de relancer une action qui aurait pu être exécutée complètement ? ».

**Le coût, prouvé.** Un aller-retour humain et un lot différé : 28 actions de plus ont été faites dans le tour qui a suivi la relance (70 → 98 sur 324), alors qu'elles relevaient toutes du mandat initial.

**La règle qui aurait évité le retour.** Un mandat donné « jusqu'à épuisement » vaut pour toutes les demandes suivantes de la session, tant qu'il reste du travail `auto_ia` dans son périmètre. La session enchaîne les lots et ne s'arrête que sur une décision qui revient à l'humain, regroupée en une seule à la fin. **Clé proposée** (RT-17) : `mandat-autonome-interrompu-par-hors-mandat`, famille `restitution-forme`, libellé « Une action auto_ia qui relève d'un mandat en cours est classée hors_mandat ou laissée au feu vert de l'humain ».

**Juge proposé.** `oracle-synthese` refuse le motif `hors_mandat` sur une action `auto_ia` quand une demande antérieure de la session porte un mandat d'exécution jusqu'à épuisement (formules « avance sur toutes », « jusqu'au bout », « sans dépendance »). Le hook de fin de tour signale une restitution qui se clôt avec du travail `auto_ia` dans le périmètre du mandat.

## Rattachement

Registre interrogé le 12/11/2026 : `todo/CLASSES.json` du pilot, aucune clé sur `hors_mandat`, `mandat` ou `épuisement` ; la plus proche, `restitution-bloquants-disperses`, vise la dispersion des bloquants, pas l'arrêt d'un mandat. D'où une clé neuve en `classe-a-creer`.

## Remarques restées au produit

Aucune remarque n'est restée au produit.

## Retours sur les documents produits

Aucun document produit depuis un gabarit.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
