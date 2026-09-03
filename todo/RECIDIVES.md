# Récidives et descente — tableau de bord

<!-- VUE GÉNÉRÉE par todo/generer-recidives.mjs — NE PAS ÉDITER. Sources scellées : registre 6cf88d203459 · archive d3c801ad4540 · classes bbb2812d6329 · relevés 19bf44f4780e · héritage 23d6b9c4bee8. État au 2026-09-03T12:33:09.964Z (ts max des sources, jamais l'horloge). -->

Ce tableau de bord répond à trois questions que le registre seul ne savait pas poser : est-ce la deuxième fois, chez qui, et depuis combien de temps la correction existe sans être appliquée. Il se lit avec sa contre-métrique : un compteur de récidives qui baisse pendant que le nombre de classes monte est un compteur contourné, pas un progrès.

**Périmètre mesuré** : 790 item(s) au registre (actifs et archive), 0 portant une classe, 0 marqué(s) récidive ; référentiel de 30 classe(s) en 18 famille(s) (v1.0.0) ; 2 relevé(s) d'héritage.

## 1. Récidives par classe

Comment lire : une ligne par classe du référentiel, triée par récidives décroissantes puis par clé. *Items* compte les retours portant la classe au registre ; *fondateurs* les clôtures qui l'ont créée (elles ne comptent pas comme items) ; *récidives* les retours entrés marqués `recidive_de` ; le *taux* rapporte les récidives aux items classés — il n'a pas de sens sous trois items et le dit. *Produits* nomme qui a récidivé, avec le compte.

| Classe | Famille | Items | Fondateurs | Récidives | Taux | Produits ayant récidivé | Dernière |
|---|---|---|---|---|---|---|---|
| `anonymisation-portee-partielle` | anonymisation | 0 | 2 | 0 | — | — | — |
| `auteur-juge-son-contrat` | skill-ou-oracle-non-invoque | 0 | 1 | 0 | — | — | — |
| `boucle-retour-sans-descente` | heritage-produit | 0 | 1 | 0 | — | — | — |
| `brief-sans-regles-de-socle` | skill-ou-oracle-non-invoque | 0 | 1 | 0 | — | — | — |
| `correction-symptome-sans-classe` | lot-forme | 0 | 1 | 0 | — | — | — |
| `emplacement-livrable-hors-convention` | emplacement-livrable | 0 | 0 | 0 | — | — | — |
| `gabarit-conception-non-jugee` | gabarit-document | 0 | 3 | 0 | — | — | — |
| `gabarit-famille-manquante` | gabarit-document | 0 | 1 | 0 | — | — | — |
| `gate-ecriture-juge-fichier-entier` | hook-ou-gate | 0 | 1 | 0 | — | — | — |
| `heritage-avertissement-tardif` | heritage-produit | 0 | 1 | 0 | — | — | — |
| `l99-forme-sortie` | skill-ou-oracle-non-invoque | 0 | 1 | 0 | — | — | — |
| `lecture-tiers-non-jugee` | skill-ou-oracle-non-invoque | 0 | 1 | 0 | — | — | — |
| `livrable-ecrase-sans-indice` | versionnement-livrable | 0 | 1 | 0 | — | — | — |
| `maquette-absente-avant-code` | affordance-ui | 0 | 1 | 0 | — | — | — |
| `oracle-remplace-par-controle-maison` | skill-ou-oracle-non-invoque | 0 | 1 | 0 | — | — | — |
| `page-html-dictionnaire-colonnes` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `page-html-filtres-tableau` | page-html-socle | 0 | 4 | 0 | — | — | — |
| `page-html-grille-non-alignee` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `page-html-largeur-lecture-donnees` | page-html-socle | 0 | 2 | 0 | — | — | — |
| `page-html-liste-renvoi-sans-detail` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `page-html-polices-distantes` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `page-html-sommaire-absent` | page-html-socle | 0 | 2 | 0 | — | — | — |
| `page-html-sticky-superposes` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `page-html-teinte-refus` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `page-html-temps-affiche` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `recette-verdict-non-prononcable` | regle-morte | 0 | 3 | 0 | — | — | — |
| `restitution-action-humaine-geste-agent` | restitution-forme | 0 | 1 | 0 | — | — | — |
| `restitution-fichier-juge-mal-choisi` | restitution-forme | 0 | 1 | 0 | — | — | — |
| `restitution-rendu-visuel-non-critique` | restitution-forme | 0 | 1 | 0 | — | — | — |
| `skill-non-invoque-lexique` | skill-ou-oracle-non-invoque | 0 | 1 | 0 | — | — | — |

## 2. Délai clôture au pilot → descente constatée chez le produit

Comment lire : une ligne par classe fondée par une clôture ; *correction* est la date de la première clôture fondatrice lue au registre ; *artefact* est la pièce héritée (R-47) où la règle vit ; le *constat* compte les produits chez qui cet artefact est conforme dans un relevé d'héritage postérieur à la correction, avec le délai en jours. Ce qui n'est pas mesurable le dit — un relevé d'héritage est écrit à chaque ouverture du pilot, la mesure se remplit avec le temps.

| Classe | Correction | Artefact porteur | Constat |
|---|---|---|---|
| `anonymisation-portee-partielle` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `auteur-juge-son-contrat` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `boucle-retour-sans-descente` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `brief-sans-regles-de-socle` | 2026-09-02 | CLAUDE.md | 8 produit(s) atteint(s) en 1–1 j ; 1 non atteint(s) (_Client-A/BourseAuxVacants2/Produit-11) |
| `correction-symptome-sans-classe` | 2026-09-02 | forge/retours/GABARIT-LOT-RETOURS.md | 0 produit(s) atteint(s) ; 9 non atteint(s) (_Client-A/BourseAuxVacants2/Produit-11, _Client-A/Cockpit IA/client-a-cockpit-ia, _Client-A/Plateforme_video_IA_complet, _Client-A/Produit-01, _Client-A/Client-A-POC-to-Prod, Produit-02.com, _Client-A/Produit-10, _Client-A/Produit-04, _Client-A/COMPTA---Ventillation-de-facture-Fournisseur-A) |
| `emplacement-livrable-hors-convention` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `gabarit-conception-non-jugee` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `gabarit-famille-manquante` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `gate-ecriture-juge-fichier-entier` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `heritage-avertissement-tardif` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `l99-forme-sortie` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `lecture-tiers-non-jugee` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `livrable-ecrase-sans-indice` | 2026-08-23 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `maquette-absente-avant-code` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `oracle-remplace-par-controle-maison` | 2026-09-02 | CLAUDE.md | 8 produit(s) atteint(s) en 1–1 j ; 1 non atteint(s) (_Client-A/BourseAuxVacants2/Produit-11) |
| `page-html-dictionnaire-colonnes` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-filtres-tableau` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-grille-non-alignee` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-largeur-lecture-donnees` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-liste-renvoi-sans-detail` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-polices-distantes` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-sommaire-absent` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-sticky-superposes` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-teinte-refus` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `page-html-temps-affiche` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `recette-verdict-non-prononcable` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `restitution-action-humaine-geste-agent` | 2026-09-02 | forge/RESTITUTION.md | 0 produit(s) atteint(s) ; 9 non atteint(s) (_Client-A/BourseAuxVacants2/Produit-11, _Client-A/Cockpit IA/client-a-cockpit-ia, _Client-A/Plateforme_video_IA_complet, _Client-A/Produit-01, _Client-A/Client-A-POC-to-Prod, Produit-02.com, _Client-A/Produit-10, _Client-A/Produit-04, _Client-A/COMPTA---Ventillation-de-facture-Fournisseur-A) |
| `restitution-fichier-juge-mal-choisi` | 2026-09-02 | forge/RESTITUTION.md | 0 produit(s) atteint(s) ; 9 non atteint(s) (_Client-A/BourseAuxVacants2/Produit-11, _Client-A/Cockpit IA/client-a-cockpit-ia, _Client-A/Plateforme_video_IA_complet, _Client-A/Produit-01, _Client-A/Client-A-POC-to-Prod, Produit-02.com, _Client-A/Produit-10, _Client-A/Produit-04, _Client-A/COMPTA---Ventillation-de-facture-Fournisseur-A) |
| `restitution-rendu-visuel-non-critique` | 2026-09-02 | forge/RESTITUTION.md | 0 produit(s) atteint(s) ; 9 non atteint(s) (_Client-A/BourseAuxVacants2/Produit-11, _Client-A/Cockpit IA/client-a-cockpit-ia, _Client-A/Plateforme_video_IA_complet, _Client-A/Produit-01, _Client-A/Client-A-POC-to-Prod, Produit-02.com, _Client-A/Produit-10, _Client-A/Produit-04, _Client-A/COMPTA---Ventillation-de-facture-Fournisseur-A) |
| `skill-non-invoque-lexique` | 2026-08-14 | CLAUDE.md | 8 produit(s) atteint(s) en 20–20 j ; 1 non atteint(s) (_Client-A/BourseAuxVacants2/Produit-11) |

## 3. Taux d'héritage par règle (dernier relevé)

Comment lire : une ligne par artefact hérité déclaré dans `gabarits/HERITAGE.json`, état au relevé du 2026-09-03T12:32:32.717Z sur 9 produit(s) ; *conformes* compte les produits chez qui l'artefact est présent et à jour ; *familles* dit de quelles familles de défaut cet artefact protège.

| Artefact | Mode | Conformes | Familles protégées |
|---|---|---|---|
| forge/retours/GABARIT-LOT-RETOURS.md | copie_conforme | 0/9 | lot-forme |
| forge/retours/oracle-lot.mjs | copie_conforme | 5/9 | lot-forme |
| forge/hooks/factory.mjs | copie_conforme | 0/9 | skill-ou-oracle-non-invoque, restitution-forme, page-html-socle, heritage-produit |
| forge/RESTITUTION.md | copie_conforme | 0/9 | restitution-forme |
| .claude/settings.json | presence_et_motif | 6/9 | skill-ou-oracle-non-invoque, restitution-forme, page-html-socle, heritage-produit |
| CLAUDE.md | presence_et_motif | 8/9 | skill-ou-oracle-non-invoque |
| robots.txt | presence | 2/9 | — |
| llms.txt | presence | 2/9 | — |
| forge/travaux/TRAVAUX-PILOT.md | copie_conforme | 4/9 | heritage-produit |
| forge/travaux/ECARTS-ASSUMES.md | presence | 4/9 | heritage-produit |
| forge/travaux/oracle-travaux.mjs | copie_conforme | 4/9 | heritage-produit |
| .gitignore | presence_et_motifs | 1/9 | secret-hors-perimetre |
| forge/retours/CLASSES.json | copie_conforme | 0/9 | heritage-produit, lot-forme |

## 4. Contre-métrique : classes créées

Comment lire : le nombre de classes créées par semaine ISO, puis les classes sans clôture fondatrice et les retours entrés sous une classe signalée suspecte. Une semaine qui crée plus de classes qu'elle ne clôt de récidives demande une relecture du référentiel, pas une félicitation.

| Semaine | Classes créées |
|---|---|
| 2026-S36 | 30 |

- Classes sans clôture fondatrice : `emplacement-livrable-hors-convention`
- Retours entrés sous une classe suspecte : aucun

## Ce que cette vue ne juge pas

- la JUSTESSE d'une classe déclarée par un producteur : un retour mal classé est une récidive manquée, et seule une revue des classes (BOUCLE-AMELIORATION.md) la voit ;
- la descente d'une règle qui ne vit dans aucun artefact hérité : elle est déclarée non mesurable, jamais supposée faite ;
- les items antérieurs au 03/09/2026 sans classe : ils ne comptent ni comme items ni comme récidives — la mesure du pas 0 (output/03-etudes) les a lus une fois, à la main.
