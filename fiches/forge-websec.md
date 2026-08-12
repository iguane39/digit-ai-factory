# Fiche d audit — forge-websec

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture de la baseline
commune par agent d audit. MISE À JOUR à chaque audit — dernière mise à jour : 2026-08-12
(création, TF-0123 — étude d opportunité du 12/08, verdict forge dédiée, modèle forge-seo).

### forge-websec — self-test 23/23, née exercée avec sens rouge sur vraies CVE (12/08)

Delta : dépôt neuf (v0), public GitHub, MIT. Périmètre : sécurité du PRODUIT web livré —
délimitation croisée affichée avec forge-agents-security (outillage agentique). Forces :
`oracle-exposition.mjs` (11 règles EX-1..EX-11 : CSP non triviale, HSTS,
X-Content-Type-Options, anti-clickjacking, Referrer/Permissions-Policy, cookies
Secure/HttpOnly/SameSite, fuite de version) sur capture JSON produite par
`scripts\capturer.mjs` (fetch natif, ne juge pas) · `oracle-sca.mjs` enveloppe npm audit +
pip-audit en verdict machine à seuils, SKIP motivé jamais silencieux — sens rouge démontré
sur CVE réelles (lodash 4.17.15, django 1.4) · `referentiels\asvs-l1.md` : 32 exigences
ASVS 5.0.0 L1 curées sur le texte source (CC BY-SA 4.0, mapping Top 10:2025), 9 chapitres
non curés listés explicitement. Faiblesses / dettes : pas de DAST en v0 (ZAP consigné v1) ;
osv-scanner non enveloppé (absent du poste) ; sonde de chemins exposés (.git) en v1 ;
récurrence différentielle post-MEP documentée mais jamais exercée sur produit réel —
premier mandat à consigner ici.
