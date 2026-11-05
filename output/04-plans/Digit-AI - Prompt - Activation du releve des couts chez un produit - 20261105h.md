---
destinataire: humain
role: prompt à coller dans une session ouverte à la racine d'un produit, pour y activer le relevé des coûts (TF-2181)
---

# Prompt — activer le relevé des coûts dans un produit (05/11/2026)

Ouvrez une session Claude Code à la racine du produit, puis collez le bloc ci-dessous. La session rattrape les sessions encore sur le disque avant leur purge à 30 jours. Elle vérifie que les hooks sont câblés pour la suite, puis enregistre le relevé en local, sans rien publier.

Ordre conseillé, de la purge la plus proche à la plus lointaine, relevé le 05/11/2026 à 17:33 sur ce poste :

| Produit | Sessions sur le disque | Plus ancienne purgée le |
|---|---|---|
| D-b (dépôt sans pseudonyme, journal ouvert le 26/08) | 6 | 08/11/2026 |
| Produit-79 | 13 | 11/11/2026 |
| Produit-12 | 7 | 13/11/2026 |
| Produit-82 | 4 | 13/11/2026 |
| Produit-83 | 2 | 14/11/2026 |
| Produit-85 | 12 | 23/11/2026 |

Produit-78, Produit-61 et un autre dépôt n'ont plus aucune session sur ce poste : rien à rattraper.

```text
Active le relevé des coûts de la Factory dans ce produit (TF-2181, hook « couts »).

1. Rattrape les sessions de ce produit encore sur le disque :
   node ../digit-ai-factory/scripts/relever-couts.mjs --ici --racine .
   (pilot ailleurs : remplace ../digit-ai-factory par son chemin, $FORGE_ROOT/digit-ai-factory)
2. Montre le résultat : node ../digit-ai-factory/scripts/relever-couts.mjs --vue forge
3. Vérifie le câblage pour les sessions suivantes : .claude/settings.json porte
   « forge/hooks/factory.mjs couts » en SessionEnd et « couts --rattraper » en SessionStart,
   et forge/hooks/factory.mjs accepte le nom « couts ». S'il manque, rejoue l'ouverture :
   node forge/hooks/factory.mjs ouverture --sans-readme
4. Enregistre par git commit --only les fichiers forge/couts-*.jsonl, et .claude/settings.json
   et forge/hooks/factory.mjs s'ils ont changé. Ne pousse rien.
5. Réponds en 3 lignes : sessions relevées, jetons et coût équivalent rendus par la vue,
   câblage présent ou réparé.
```
