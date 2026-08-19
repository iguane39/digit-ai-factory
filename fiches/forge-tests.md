# Fiche d audit — forge-tests

Baseline d audit par forge (TF-0054) : cette fiche remplace la relecture des ~32 Ko de
baseline commune (INVENTAIRE + BOUCLE) par agent d audit. Elle est MISE À JOUR à chaque
audit (l agent la reçoit seule, la rend annotée) — dernière mise à jour : 2026-08-19
(revue écosystème 20260808a, source de l extraction initiale).

### forge-tests — santé S-01 TENU (08/08, 90 vérifications, 2 runs identiques)
Delta : 27 commits (04→07/08) — robustesse, pans interface+qualif (12 adaptateurs), mutation
totale, seuils opposables, actions[] ternaire, livrables dérivés. Forces : recette falsifiante
90/90 · G-1 prouvé 2 sens · livrables scellés · dashboard testé contre le mensonge · usage réel
(interface 196/196 en service, mutation 0,505 sur produit « 100 % vert »). Faiblesses :
**registre de dette à sémantique trompeuse** (« resolue » = énoncé disparu, pas corrigé ; 0
« ok »/89 ; +36 todo en 4 j sans fermeture — l'inventaire steering a publié « 27 résolues » sur
cette base) · RT-13 vivant (payé) · recette monolithique 3 min 22 s sans sélecteur · aucune
mesure terrain valide en cours (dernier audit réel dégradé).

### Annotation — revue écosystème 20260819 (preuves rejouées le 19/08)

Preuve rejouée : recette complète `verifier_corpus.py` → **S-01 TENU, exit 0**.
Périmées : « recette monolithique 3 min 22 s sans sélecteur » (sélecteur `--section` livré,
65dbcd2) ; « registre de dette à sémantique trompeuse » (v2 : `retiree` = « énoncé disparu
SANS preuve, PAS une fermeture » — la tromperie est nommée par la note elle-même).
État du registre de dette au 19/08 : 147 entrées — 84 assume · 33 todo · 27 retiree · 3 ok.
94 commits depuis la fiche (TF-0333→0383 en rafale). Aucun constat nouveau hors registre —
TF-0384 (collecteur de dette) reste candidat.
