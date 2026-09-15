# Activer la recette pilot hébergée (TF-1018)

Geste d'activation : déplacer `ci/hebergee/recette-pilot.yml` vers `.github/workflows/recette-pilot.yml`, puis publier (`git push`) — tant qu'il reste ici, aucune exécution hébergée ne se déclenche.
Ce geste est humain (R-38) : il engage un compte tiers hébergé de façon durable, sur un GO distinct du GO donné pour la construction de ce fichier.
Le circuit rejoue exactement `node oracles/self-tests.mjs` et `node todo/self-test.mjs` sur push et pull request vers `main`, sous Node 20+, sans secret ni API tierce payante.
