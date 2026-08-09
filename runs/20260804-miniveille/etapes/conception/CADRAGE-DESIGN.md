<!-- source: EXIGENCES.json -->
<!-- source-sha256: 4256dd0d73003f4ebaa526e21b473d1f56cde9da2dc13b3361f65016f766cf81 -->

# Fiche de cadrage design — Veille informationnelle personnelle

Vue dérivée. **Ne pas éditer à la main** : toute modification se fait dans `EXIGENCES.json`,
puis la vue est régénérée. Une vue éditée est détectée par `oracle-tracabilite` T3.

| Champ | Valeur | Origine |
|---|---|---|
| Secteur d'activité | Veille informationnelle, gestion des liens de veille | dérivé de `projet` |
| Cible | Consultant indépendant | dérivé de `surface[S-02].type = role` |
| Job principal | Enregistrer un lien avec tags en moins de 10 s, le retrouver par tag, le marquer lu | dérivé de `besoins[B-01]`, `besoins[B-03]`, `besoins[B-04]` |
| Ton attendu | Encre, papier, atelier | dérivé de PRODUIT-TEST.md |
| Contraintes reprises | Aucune (produit neuf) | dérivé de PRODUIT-TEST.md |
| Hypothèses | Affichage des tags et statut de lecture dans la liste · Comportement de la liste après marquage lu · Monitoring du temps d'enregistrement · Filtrage multi-tags et compteur de liens non lus | dérivé des exigences `statut_epistemique.nature = hypothèse` |

## Objets et parcours à couvrir

| Élément | Type | Exigences rattachées |
|---|---|---|
| Lien | objet | E-001, E-002, E-003, E-004, E-005 |
| Consultant (mono-utilisateur) | rôle | E-011 |
| Enregistrement d'un lien avec tags | parcours | E-001, E-002 |
| Consultation de la liste des liens | parcours | E-003, E-008, E-009, E-010 |
| Filtrage des liens par tag | parcours | E-004, E-013 |
| Marquage d'un lien comme lu | parcours | E-005, E-014 |
| Page web unique | point-entree | E-006, E-011 |
| API backend (FastAPI) | point-entree | E-007 |

## Ce que cette vue ne dit pas

Le champ `ton` et les contraintes reprises ont pu être dérivés cette fois (contrairement à l'usage
de demande systématique) car le brief PRODUIT-TEST.md les spécifie explicitement. Toute modification
ultérieure de ces champs doit transiter par PRODUIT-TEST.md, jamais par édition directe du présent document.
