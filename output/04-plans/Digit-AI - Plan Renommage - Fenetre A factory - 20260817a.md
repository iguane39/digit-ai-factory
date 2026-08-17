# Plan de renommage `digit-ai-forge-pilot` → `digit-ai-factory` — fenêtre A exécutée, gate n°2 armé

Séquence O1 de l'étude `output\03-etudes\20260817-etude-opportunite-sequencement-factory.md`
(PASS 7/7). Gate n°1 franchi le 17/08 : **`digit-ai-factory`**, décision humaine, les 6 sites
hors motif payés en connaissance de cause.

## Fenêtre A — faite (aucun renommage, entièrement réversible)

1. **Dette D-14 soldée (TF-0332)** : `REGLES-PROJET.md` §G ligne D-14 corrigée (« répercuté
   partout » était faux — 26 `forge-steering` subsistent en faits d'époque, déclarés) ;
   `references\RUN-VERSION.md` reformulé en fait daté (la jonction disparue avant preuve,
   remplacée par le critère rejouable) ; la défaillance de clôture de TF-0062 est nommée
   au corpus sans réécrire son archive.
2. **Mesure P0 figée au gate n°1** : `git grep -I -w forge-pilot` hors classes justifiées =
   **25 occurrences / 11 fichiers** — AGENTS.md (4), CLAUDE.md (1), CONTRAT-INTERFACE.md (1),
   PROMPT-PRODUIT.md (4), README.md (8), REGLES-PROJET.md (1), fiches\pilot.md (1),
   oracles\self-test.mjs (2 — fixtures R-19), references\ACCUEIL.md (1),
   references\RUN-VERSION.md (1 — fait d'époque, classe d.), todo\normaliser-lot.mjs
   (1 — liste blanche, classe c.). Cible fenêtre B : 0 hors classes a-e.
3. **Table §3 bis écrite** : `references\CORRESPONDANCE-RENOMMAGE-FACTORY.md` — clés R-19,
   ids `pilot/*@1` GELÉS (coût 0), « pilot » comme rôle hors périmètre (classe e.).
4. **Liste blanche élargie** (`todo\normaliser-lot.mjs`) : les deux noms acceptés — phase
   *expand* ; la réduction sera le dernier geste.

## Gate n°2 — À TOI SEUL (l'étude l'exige : l'humain lance le geste)

```
gh repo rename digit-ai-factory --repo iguane39/digit-ai-forge-pilot --yes
```

GitHub redirigera l'ancien URL. **Ne jamais recréer un dépôt nommé `digit-ai-forge-pilot`**
(la réutilisation casse définitivement les redirections). Dis-moi « renommé » quand c'est fait.

## Fenêtre B — ce que je ferai à ton signal (une session, un jour)

`git remote set-url` + vérification · les 25 sites de prose en UN lot contigu · les 6 sites
du choix `digit-ai-factory` : `RE_CLE_DEPOT` + `cleCanonique` (oracle-conformite-projet),
2 fixtures de self-test, doctrine `CONTRAT-INTERFACE.md` §3, raccourci de chemins du noyau
(`CLAUDE.md` §Chemins — sous plafond 6 Ko) · renommage du dossier local `c:\dev\digit-ai-factory`
(l'étude a mesuré : 0 réglage à migrer, la mémoire de sessions se copie) · l'entrée D-xx chez
organization · rejeu des 8 oracles (self-tests d'abord — ce sont eux que les fixtures cassent),
verdicts au journal · `bootstrap.mjs --pull` sur poste nu = critère 1.

## Fenêtre C — rattrapage (après B)

Mandat de campagne : les 48 occurrences des 14 frères (21 fichiers, un commit par dépôt,
vérification `git grep` par dépôt) · SCC_ALX : 9 occurrences / 3 fichiers, à son prochain
run de version (4 lignes de commande développées casseront FORT — voulu, pas de jonction).
Clôture TF-0346 : `corrige` avec gains/corrections/date — **jamais** archivé nu (le mode de
défaillance exact de TF-0062). Revues : 2026-08-24 et 2026-11-17 (6 critères de l'étude).
