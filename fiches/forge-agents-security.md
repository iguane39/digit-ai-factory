# Fiche d audit — forge-agents-security

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune par agent d audit. MISE À JOUR à chaque audit — dernière mise à jour : 2026-08-12
(création, TF-0111 — décision humaine : forge dédiée, « le juge ne vit pas chez le jugé »).

### forge-agents-security — self-test 24/24, née exercée sur fixtures synthétiques (12/08)

Delta : dépôt neuf (v0), public GitHub. Forces : **2 oracles zéro dépendance** —
`oracle-scan-agentdef.mjs` (statique, CAP-1..4 : combinaisons de capacités dangereuses,
outils hors référentiel fermé, permissions trop larges, motifs d exfiltration dans le
prompt) et `oracle-scan-toolcalls.mjs` (dynamique, TC-1..5 sur journal JSONL : exfiltration
réseau deny-by-default, destruction, lecture de secrets, payloads encodés, écriture hors
périmètre — `--perimetre` obligatoire, fail-closed) · 20 fixtures double sens, chaque règle
prouvée avec son cas légitime voisin (faux positifs mesurés) · format de journal documenté
(`references\FORMAT-JOURNAL.md`) · catalogue README à statuts honnêtes. Faiblesses /
dettes : v0 lexicale (pas de sandbox d exécution, pas d analyse sémantique, pas de
red-teaming automatisé, pas de scan runtime branché sur le harnais — consignées README
§Limites) ; référentiel d outils tenu à la main ; aucun agent réel encore scanné en
production — premier scan à consigner ici.
