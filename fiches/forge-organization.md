# Fiche d audit — forge-organization

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture des ~32 Ko de
baseline commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque
audit (l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-19
(clôture TF-0039, circuit D-13 tracé au REGLES-PROJET §G du pilot).

### forge-organization — circuit D-13 opérationnel, Phase 3 livrée (11/08)

Delta depuis le 08/08 : les faiblesses relevées sont tombées une à une — CLAUDE.md
existe (D-05 appliquée chez soi, TF-0031), Phase 3 livrée (`oracle-conventions.mjs`
+ self-test, TF-0034 : le vérificateur a trouvé seul le défaut de TF-0061),
Q-B/Q3/Q3-bis tranchées (D-13, D-03), l auto-violation b→c corrigée (historique des
indices documenté en tête des Décisions 20260809a). Le circuit organization→pilot a
été traversé en réel : D-03 → règle 4 → oracle de conformité, traçabilité écrite au
REGLES-PROJET §G. Forces : doctrine sourcée sur 52 dossiers · oracle discriminant ·
registre des types en fichier unique (`registre-types.json`, 23 types). Faiblesses /
en attente : Q4 ouverte (conventions internes aux fichiers, hors portée de l inventaire
par noms) ; 3 propositions en attente de décision pilot (TF-0084 : précision D-06
« doctrine ≠ sortie », emplacement/graphies de `Old`, opposabilité du registre des
types) ; 4 graphies de dossier d archivage coexistent encore sur le terrain.

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuve rejouée : self-test → **12/12 fixtures + contrôle fraîcheur A0** (déclaré 1.6.0 =
installé 1.6.0), arbre propre. Depuis la fiche : D-15, D-16, D-17, D-18 décidées — le
circuit organization→pilot tourne. Restent tels quels : Q4 ouverte, TF-0084 (3 propositions
en attente pilot), graphies d'archivage. Aucun constat nouveau.
