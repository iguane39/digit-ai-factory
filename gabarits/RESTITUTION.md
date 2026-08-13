# Consigne de restitution — synthèses de clôture à l'humain

Référentiel versionné (loi n° 4, daté-éditable), consommé par le pilot **en clôture de run
ou de campagne** et à chaque synthèse remise à l'humain. Issu de l'étude personas du 13/08
(`output\03-etudes\20260813-etude-personas-agents.md`) : son **seul delta positif** est de
cadrer la *forme* de la restitution — jamais un persona-juge.

> **Règles de FORME uniquement, toutes vérifiables.** Aucune règle de jugement (« exigeant »,
> « satisfaisant », « de qualité ») : un persona ne remplace pas un oracle exécuté. La
> restitution rapporte ce que les oracles ont mesuré — elle ne le proclame pas.

## Les 6 règles (chacune binaire)

1. **Les décisions à prendre d'abord.** Ce qui attend l'humain vient EN TÊTE — pas noyé en
   fin de synthèse. Si rien n'attend l'humain, le dire explicitement.
2. **Options fermées.** Toute décision demandée est présentée en choix fermé (a / b / c),
   jamais une question ouverte — l'humain tranche, il ne rédige pas.
3. **Restes classés.** Ce qui reste à faire est classé **IA / développeur / utilisateur**
   (format `actions[]`, R-29) — chaque reste porte son acteur.
4. **État mesuré, pas proclamé.** Ce qui est « fait » est rapporté avec sa preuve d'oracle
   (verdict, compteur, sondage rejoué) — jamais « c'est bon » sans mesure. Un échec se dit
   avec sa sortie ; un contournement se dit.
5. **Chemins cliquables.** Fichiers et emplacements en liens/chemins relatifs, jamais décrits
   de mémoire.
6. **Concision bornée.** La synthèse tient en ≤ 400 mots hors tableaux ; le détail vit dans
   les livrables liés, pas dans la synthèse.

## Ce que la restitution ne fait jamais

- Inventer une posture (« utilisateur exigeant », « expert ») pour juger le livrable — le
  jugement vient des oracles, pas d'un rôle incarné (étude personas : effet nul à négatif sur
  l'exactitude, littérature Zheng/ACL-EMNLP-2024, PRISM/2026).
- Annoncer un ✓ sans oracle exécuté (garde-fou transverse).
- Relancer une boucle non bornée « jusqu'à satisfaction » — les bornes vivent dans les
  références (G-2, ≤ 3 cycles), pas dans un ressenti.

## Contrôle

Consigne de forme : sa tenue se vérifie à la relecture d'une synthèse (les 6 règles sont
binaires). Pas d'oracle exécuté dédié — une synthèse qui viole une règle est un défaut de
forme corrigeable, signalé comme tel. Mise à jour = nouvelle version + `challenge_date`.
