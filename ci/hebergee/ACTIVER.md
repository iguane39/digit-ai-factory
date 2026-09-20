# Activer la recette pilot hébergée (TF-1018)

Avant tout geste, jouer la simulation locale de l'exécution hébergée : `node scripts/simuler-recette-hebergee.mjs --racine <dossier court et vide>` (TF-1133).
Elle clone le HEAD local du pilot à la profondeur que le circuit demande, clone ses dépôts frères depuis leur adresse publique sans aucun identifiant, retire tout ce qui vient de ce poste (variables `FORGE_*` et `CLAUDE*`, répertoire personnel, canal confidentiel), puis joue chaque commande du circuit.
On n'active que sur son verdict VERT. Un verdict ROUGE nomme chaque défaut ; le circuit serait rouge de même à sa première exécution.
Ce qu'elle ne rejoue pas est écrit dans son verdict : la chaîne d'outils (Node, Python et leurs paquets) est celle de ce poste, et le système de fichiers est Windows.

Geste d'activation, après ce verdict : déplacer `ci/hebergee/recette-pilot.yml` vers `.github/workflows/recette-pilot.yml`, puis publier (`git push`). Tant qu'il reste ici, aucune exécution hébergée ne se déclenche.
Ce geste est humain (R-38) : il engage un compte tiers hébergé de façon durable, sur un GO distinct du GO donné pour la construction de ce fichier.
Le circuit rejoue exactement `node oracles/self-tests.mjs` et `node todo/self-test.mjs` sur push et pull request vers `main`, sous Node 20+ et Python 3, sans secret ni API tierce payante.
Il récupère le pilot avec son historique complet et les dépôts frères publics `digit-ai-forge-organization` et `digit-ai-forge-agents` à côté de lui, et pose `FORGE_ROOT` sur leur parent commun.
Les contrôles du parc réel dont la matière n'est pas sur le runner (canal confidentiel, forges non clonées, `~/.claude`) s'y déclarent sans objet, motif écrit ; le critère est écrit dans `oracles/self-tests.mjs` (I4).
