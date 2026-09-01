# Retours forges — lot 03 (2026-08-06)

Run `Produit-12-20260805a`, cycle de maintenance v0.2.1 → v0.2.2. Ce lot ne contient
**que les retours postérieurs au lot 02** — convention : un fichier par remise au steering,
jamais ré-augmenté après transmission. Références ledger : seq 48 (2ᵉ inspection), 50
(campagne), 51 (audit v0.2.2).

Gravités : **bloquant** / **majeur** / **mineur** / **confirmation** (retour positif à solder
au backlog).

---

## forge-tests

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RT-9 | mineur | L'analyse statique des divergences (`codes_par_fonction`, AST) n'accepte qu'un `raise … status_code=<littéral>` **dans le corps de la fonction de route** : un helper projet (`_refuser_doublon()`) qui lève le 409 n'est pas reconnu — 2 passes de correction sur produit réel avant de trouver la forme attendue, règle documentée nulle part | Documenter la contrainte au « Contrat du projet audité » (complément RT-3/A-6) ; ou résoudre un niveau d'appel : un helper local dont le corps lève avec `status_code` constant compte comme garde |
| RT-10 | mineur | Un montage `StaticFiles` (`GET /static/app.js` → 200) déclenche la divergence « code émis mais absent de sa déclaration `responses=` » alors qu'un montage FastAPI **ne peut pas** déclarer de `responses` — finding « signalé » incorrigeable côté produit | Exclure les montages statiques du contrôle de divergence (ou les réputer déclarés 200/404) |
| RT-11 | **confirmation** | Les chantiers RT-6 et RT-7 livrés le 05/08 au soir sont **vérifiés en service sur produit réel** : pan `interface` 196/196 sur ASD Mail Manager v0.2.2 (16 écrans, états vides/peuplés), `non_testables[]` et `--reprendre` présents au rapport ; l'audit a de plus attrapé 4 divergences réelles (RT-9) puis validé leur correction — l'outil discrimine | Solder RT-6/RT-7 au backlog ; il reste à absorber le prototype de qualif populée navigateur (`c:\dev\Produit-12\forge\etapes\mep\qualif_populee.py`, 14 pages Playwright sur staging peuplé) dans le pan qualif — chantier A-4 du prompt de campagne |
| RT-12 | **majeur** (demande utilisateur explicite, 2026-08-06) | « Les périmètres couverts doivent être plus importants que les standards ; beaucoup de modules ne sont finalement pas testés, ce n'est pas acceptable » — la mutation ne couvre que 8 modules du socle, `services/` et `fournisseurs/` (la logique métier) ne sont jamais mutés | Campagne complète rédigée avec critères de sortie exécutables : `c:\dev\Produit-12\forge\PROMPT-AMELIORATION-FORGE-TESTS.md` (A-1 mutation totale, A-2 aucun module silencieux, A-3 seuils au-dessus des standards, A-5 chemins de couverture) — à dérouler |

## forge-conception + forge-design (2ᵉ inspection utilisateur, v0.2.1)

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RC-4 | majeur | Précision du critère d'acceptation de RC-3 (lot 02) : un onboarding est une **expérience dominante de première connexion** (panneau de bienvenue en tête, progression x/6, badge persistant, actions directes, disparition à complétion) — la carte repliable livrée en v0.2.0 « existait » mais n'a pas été perçue comme un onboarding par l'utilisateur | La surface implicite SaaS de `enumere-la-surface` (RC-3) doit porter ce critère, pas seulement le mot « onboarding » |
| RD-6 | majeur | Précision de RD-4 (lot 02) : rendre les CTA dupliqués *fonctionnels* ne suffit pas — le pattern canonique est « **un seul CTA visible par écran** » (état vide OU en-tête, formulaire replié, soumission visible seulement une fois ouvert) ; l'utilisateur a re-signalé les 3 boutons après le premier correctif | `patterns-interaction.md` : spécifier le pattern un-seul-CTA + le test-garde au lecteur de texte visible (implémentation de référence : `backend/tests/test_exigences_interface.py` d'ASD Mail Manager) |
| RD-7 | majeur | L'aide utilisateur attendue est à **trois niveaux** — par page (rôle/circuit/piège), par encart (sections non évidentes), par champ — une page d'aide unique ne suffit pas | Ajouter ce standard à l'inventaire d'écrans / la surface implicite SaaS ; implémentation de référence : macros `aide_de_page`/`aide-encart` d'ASD Mail Manager v0.2.2 |

## steering

| id | Gravité | Retour | Proposition esquissée |
|---|---|---|---|
| RS-8 | mineur | Convention de remise adoptée à la demande de l'utilisateur : **un fichier `RETOURS-FORGES-<NN>.md` par remise**, jamais ré-augmenté après transmission (un fichier cumulatif force le steering à re-trier les lots déjà traités) ; `RETOURS-FORGES.md` devient un index | Inscrire la convention dans `BOUCLE-AMELIORATION.md` (format d'entrée des retours de runs produit) |
| RS-9 | **confirmation** | Le circuit retours → campagne → application → vérification **a fonctionné en boucle complète et rapide** : lot 01 remis le 05/08 au soir → RT-6/RT-7 implémentés dans la nuit → constatés en service par le run produit le 06/08 (pan interface 196/196) — première itération complète de la boucle d'amélioration inter-forges | À consigner comme cas nominal dans `BOUCLE-AMELIORATION.md` §État |
