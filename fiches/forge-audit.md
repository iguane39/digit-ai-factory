# Fiche d audit — forge-audit

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque audit
(l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-09-22
(TF-1240 : réalignement des compteurs sur le dépôt et pose de leur juge ; création le
2026-08-19, la fiche manquant depuis l enregistrement de la forge le 10/08, trou détecté
par contrôle croisé humain).

**Les trois compteurs de cette fiche sont désormais JUGÉS** (TF-1240, 22/09/2026). Les claims
`fiche-audit-adr`, `fiche-audit-controles` et `fiche-audit-dimensions` d
`oracles\fraicheur-claims.json` les confrontent aux ARTEFACTS du dépôt — les fichiers du
sous-arbre des ADR, les entrées des jeux de contrôles, les jeux de dimensions — et non au README
de la forge, qui est de la prose et pouvait dériver avec la fiche. La phrase « elle est MISE À
JOUR à chaque audit » était restée vraie sur le papier et fausse en fait pendant un mois : la
fiche annonçait 65 / 162 / 17 quand le dépôt portait 84 / 184 / 18. *Une convention de tenue à
jour que rien n exécute est une convention dormante ; ce qui la réveille est un contrôle, jamais
une relecture.*

### forge-audit — produit public, engagement séparé, exploration à mener (11/08)

Delta : renommages du 11/08 stabilisés (produit `digit-ai-forge-audit` public MIT, ex
auditcore ; engagement `digit-ai-forge-audit_client-a` privé, pin submodule recalé). Forces :
**séparation produit/tenant réalisée et vérifiée** (gate lint N0 : 0 mention tenant dans le
produit ; 2 CI vertes, iso-parité produit/engagement) · référentiels riches (`core/` : 84
ADRs, 184 contrôles, 18 dimensions, `invariants.json` = preuve bootstrap) · oracles présents
(`oracles/smoke-parcours.mjs`, `verifier-couverture-fonctionnelle.mjs`) · sur mandat humain
uniquement, jamais de déclenchement automatique. Faiblesses / dettes : **exploration
exhaustive au standard des autres forges jamais menée** (entrées, sorties, contrat
d invocation pilot↔audit à formaliser — pas de ligne « mode natif/dégradé » consolidée
par un run réel) · l exécution des contrôles n a pas encore été exercée PAR le pilot dans
un run (les 2 CI tournent côté produit/engagement, hors orchestration) · articulation avec
l étape MEP (l audit sert les revues d architecture et la gouvernance, pas le gate M-1…M-5)
documentée nulle part. Premier audit orchestré par le pilot à consigner ici.

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuves rejouées : `lint-agnostic.mjs` → **0 finding (175 contrôles + N0 sur 320
fichiers)** · `test-golden-buckets.mjs` → **9/9**. Depuis la fiche : migration ASVS 5.0.0
(TF-0205/0220/0221), restitution lisible (TF-0235), sidecars hors dépôt (TF-0065).
Constat nouveau (mineur) : `npm test` répond « Error: no test specified » alors que la CI
joue les vraies preuves — point d'entrée trompeur pour l'opérateur npm.
→ candidature `revue-20260819-audit`.
