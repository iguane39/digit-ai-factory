# Fiche d audit — forge-audit

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque audit
(l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-11
(création — la fiche manquait depuis l enregistrement de la forge le 10/08, trou détecté
par contrôle croisé humain).

### forge-audit — produit public, engagement séparé, exploration à mener (11/08)

Delta : renommages du 11/08 stabilisés (produit `digit-ai-forge-audit` public MIT, ex
auditcore ; engagement `digit-ai-forge-audit_client-a` privé, pin submodule recalé). Forces :
**séparation produit/tenant réalisée et vérifiée** (gate lint N0 : 0 mention tenant dans le
produit ; 2 CI vertes, iso-parité produit/engagement) · référentiels riches (`core/` : 65
ADRs, 162 contrôles, 17 dimensions, `invariants.json` = preuve bootstrap) · oracles présents
(`oracles/smoke-parcours.mjs`, `verifier-couverture-fonctionnelle.mjs`) · sur mandat humain
uniquement, jamais de déclenchement automatique. Faiblesses / dettes : **exploration
exhaustive au standard des autres forges jamais menée** (entrées, sorties, contrat
d invocation pilot↔audit à formaliser — pas de ligne « mode natif/dégradé » consolidée
par un run réel) · l exécution des contrôles n a pas encore été exercée PAR le pilot dans
un run (les 2 CI tournent côté produit/engagement, hors orchestration) · articulation avec
l étape MEP (l audit sert les revues d architecture et la gouvernance, pas le gate M-1…M-5)
documentée nulle part. Premier audit orchestré par le pilot à consigner ici.
