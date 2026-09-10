# Récidives et descente — tableau de bord

<!-- VUE GÉNÉRÉE par todo/generer-recidives.mjs — NE PAS ÉDITER. Sources scellées : registre 1e92996f9ab2 · archive 6ce2fe14c2bb · classes ad5c003a9022 · relevés 87cfd092d942 · héritage 23d6b9c4bee8. État au 2026-09-10T14:07:19.521Z (ts max des sources, jamais l'horloge). -->

Ce tableau de bord répond à trois questions que le registre seul ne savait pas poser : est-ce la deuxième fois, chez qui, et depuis combien de temps la correction existe sans être appliquée. Il se lit avec sa contre-métrique : un compteur de récidives qui baisse pendant que le nombre de classes monte est un compteur contourné, pas un progrès.

**Périmètre mesuré** : 1012 item(s) au registre (actifs et archive), 196 portant une classe, 110 marqué(s) récidive ; référentiel de 62 classe(s) en 18 famille(s) (v1.6.0) ; 18 relevé(s) d'héritage.

## 1. Récidives par classe

Comment lire : une ligne par classe du référentiel, triée par récidives décroissantes puis par clé. *Items* compte les retours portant la classe au registre ; *fondateurs* les clôtures qui l'ont créée (elles ne comptent pas comme items) ; *récidives* les retours entrés marqués `recidive_de` ; le *taux* rapporte les récidives aux items classés — il n'a pas de sens sous trois items et le dit. *Produits* nomme qui a récidivé, avec le compte.

| Classe | Famille | Items | Fondateurs | Récidives | Taux | Produits ayant récidivé | Dernière |
|---|---|---|---|---|---|---|---|
| `gabarit-famille-manquante` | gabarit-document | 13 | 1 | 13 | 100 % | Produit-03 ×1, Produit-10 ×5, Produit-62 ×6, Produit-65 ×1 | 2026-09-09 |
| `oracle-remplace-par-controle-maison` | skill-ou-oracle-non-invoque | 13 | 1 | 11 | 85 % | Produit-61 ×1, Produit-03 ×1, Produit-10 ×5, Produit-62 ×3, Produit-65 ×1 | 2026-09-09 |
| `heritage-avertissement-tardif` | heritage-produit | 7 | 1 | 7 | 100 % | Produit-02 ×2, Produit-10 ×3, Produit-11 ×2 | 2026-09-08 |
| `lecture-tiers-non-jugee` | skill-ou-oracle-non-invoque | 7 | 1 | 7 | 100 % | Produit-10 ×3, Produit-62 ×2, Produit-11 ×2 | 2026-09-08 |
| `recette-verdict-non-prononcable` | regle-morte | 8 | 3 | 7 | 88 % | Produit-61 ×3, Produit-10 ×1, pilot ×1, Produit-62 ×2 | 2026-09-09 |
| `surface-implicite-non-livree` | affordance-ui | 15 | 1 | 7 | 47 % | Produit-61 ×6, Produit-10 ×1 | 2026-09-07 |
| `boucle-retour-sans-descente` | heritage-produit | 6 | 1 | 6 | 100 % | Produit-62 ×1, Produit-12 ×2, Produit-10 ×2, Produit-11 ×1 | 2026-09-08 |
| `gate-ecriture-juge-fichier-entier` | hook-ou-gate | 7 | 1 | 6 | 86 % | Produit-60 ×1, Produit-62 ×1, pilot ×3, Produit-61 ×1 | 2026-09-05 |
| `anonymisation-portee-partielle` | anonymisation | 16 | 2 | 5 | 31 % | pilot ×4, Produit-12 ×1 | 2026-09-06 |
| `page-html-filtres-tableau` | page-html-socle | 5 | 4 | 5 | 100 % | Produit-12 ×1, Produit-61 ×1, Produit-62 ×3 | 2026-09-08 |
| `page-html-sticky-superposes` | page-html-socle | 5 | 1 | 5 | 100 % | Produit-61 ×1, Produit-10 ×4 | 2026-09-08 |
| `page-html-dictionnaire-colonnes` | page-html-socle | 4 | 1 | 3 | 75 % | Produit-10 ×3 | 2026-09-08 |
| `skill-non-invoque-lexique` | skill-ou-oracle-non-invoque | 3 | 1 | 3 | 100 % | Produit-10 ×1, Produit-62 ×1, Produit-11 ×1 | 2026-09-09 |
| `alias-de-transition-perime-survivant` | heritage-produit | 3 | 1 | 2 | 67 % | Produit-11 ×1, Produit-61 ×1 | 2026-09-09 |
| `auteur-juge-son-contrat` | skill-ou-oracle-non-invoque | 2 | 1 | 2 | 2/2 (sous 3 items, taux non significatif) | Produit-11 ×2 | 2026-09-08 |
| `contrat-de-sortie-sans-domicile` | contrat-interface-forge | 3 | 1 | 2 | 67 % | Produit-62 ×1, Produit-61 ×1 | 2026-09-09 |
| `gabarit-conception-non-jugee` | gabarit-document | 2 | 3 | 2 | 2/2 (sous 3 items, taux non significatif) | Produit-61 ×2 | 2026-09-10 |
| `page-html-largeur-lecture-donnees` | page-html-socle | 3 | 2 | 2 | 67 % | Produit-10 ×2 | 2026-09-08 |
| `page-html-sommaire-absent` | page-html-socle | 2 | 2 | 2 | 2/2 (sous 3 items, taux non significatif) | Produit-10 ×2 | 2026-09-08 |
| `porte-cle-courte-sans-frontiere` | hook-ou-gate | 4 | 1 | 2 | 50 % | Produit-62 ×2 | 2026-09-09 |
| `restitution-fichier-juge-mal-choisi` | restitution-forme | 2 | 1 | 2 | 2/2 (sous 3 items, taux non significatif) | Produit-10 ×2 | 2026-09-08 |
| `compte-total-hors-canal-des-constats` | contrat-interface-forge | 4 | 1 | 1 | 25 % | pilot ×1 | 2026-09-08 |
| `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` | regle-morte | 2 | 0 | 1 | 1/2 (sous 3 items, taux non significatif) | pilot ×1 | 2026-09-10 |
| `correction-symptome-sans-classe` | lot-forme | 3 | 1 | 1 | 33 % | Produit-62 ×1 | 2026-09-09 |
| `date-de-fichier-menteuse-apres-copie` | hook-ou-gate | 1 | 1 | 1 | 1/1 (sous 3 items, taux non significatif) | pilot ×1 | 2026-09-10 |
| `garde-lexicale-frontiere-ascii` | regle-morte | 9 | 2 | 1 | 11 % | Produit-62 ×1 | 2026-09-08 |
| `page-html-liste-renvoi-sans-detail` | page-html-socle | 1 | 1 | 1 | 1/1 (sous 3 items, taux non significatif) | Produit-10 ×1 | 2026-09-08 |
| `page-html-teinte-refus` | page-html-socle | 1 | 1 | 1 | 1/1 (sous 3 items, taux non significatif) | Produit-10 ×1 | 2026-09-08 |
| `point-entree-declare-rouge-sur-toute-cible` | regle-morte | 3 | 1 | 1 | 33 % | Produit-62 ×1 | 2026-09-09 |
| `texte-sur-la-graphie-detruit-par-sa-pseudonymisation` | anonymisation | 1 | 1 | 1 | 1/1 (sous 3 items, taux non significatif) | pilot ×1 | 2026-09-10 |
| `banc-etend-referentiel-production` | anonymisation | 1 | 0 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `boite-entree-produit-statut-git-non-dit` | contrat-interface-forge | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `brief-sans-regles-de-socle` | skill-ou-oracle-non-invoque | 0 | 1 | 0 | — | — | — |
| `champ-transcrit-de-prose-sans-correspondance` | regle-morte | 3 | 1 | 0 | 0 % | — | — |
| `controle-sans-fixture-double-sens` | skill-ou-oracle-non-invoque | 2 | 0 | 0 | 0/2 (sous 3 items, taux non significatif) | — | — |
| `controle-vrai-sur-le-mauvais-invariant` | regle-morte | 1 | 0 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `deux-regles-du-socle-inconciliables` | page-html-socle | 1 | 0 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `emplacement-livrable-hors-convention` | emplacement-livrable | 3 | 0 | 0 | 0 % | — | — |
| `fixture-jugee-par-son-seul-oracle` | skill-ou-oracle-non-invoque | 7 | 1 | 0 | 0 % | — | — |
| `gate-cout-invite-au-contournement` | hook-ou-gate | 3 | 0 | 0 | 0 % | — | — |
| `l99-forme-sortie` | skill-ou-oracle-non-invoque | 0 | 1 | 0 | — | — | — |
| `livrable-ecrase-sans-indice` | versionnement-livrable | 0 | 1 | 0 | — | — | — |
| `lot-de-travaux-mauvais-module-producteur` | lot-forme | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `lot-remis-ecrasable` | lot-forme | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `maquette-absente-avant-code` | affordance-ui | 0 | 1 | 0 | — | — | — |
| `marque-de-propriete-devinee-par-sous-chaine` | hook-ou-gate | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `motif-exclusion-couvert-compte-absent` | heritage-produit | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `page-html-grille-non-alignee` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `page-html-polices-distantes` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `page-html-temps-affiche` | page-html-socle | 0 | 1 | 0 | — | — | — |
| `porte-sans-chemin-des-tables` | hook-ou-gate | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `quantificateur-sacrifie-au-budget-du-texte` | regle-morte | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `registre-doublon-non-detecte` | lot-forme | 1 | 0 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `regle-balaie-prose-et-identifiants` | regle-morte | 3 | 1 | 0 | 0 % | — | — |
| `regle-de-branche-annoncee-differente-configuree` | contrat-interface-forge | 2 | 1 | 0 | 0/2 (sous 3 items, taux non significatif) | — | — |
| `regle-ecrite-sans-oracle-qui-la-joue` | skill-ou-oracle-non-invoque | 1 | 0 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `regle-neuve-sans-mesure-de-bruit` | page-html-socle | 1 | 0 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `regle-qui-interdit-son-propre-remede` | hook-ou-gate | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `releve-heritage-juge-arbre-pas-histoire` | heritage-produit | 0 | 1 | 0 | — | — | — |
| `restitution-action-humaine-geste-agent` | restitution-forme | 1 | 1 | 0 | 0/1 (sous 3 items, taux non significatif) | — | — |
| `restitution-rendu-visuel-non-critique` | restitution-forme | 0 | 1 | 0 | — | — | — |
| `sceau-de-vue-provenance-sans-contenu` | regle-morte | 3 | 1 | 0 | 0 % | — | — |

## 2. Délai clôture au pilot → descente constatée chez le produit

Comment lire : une ligne par classe fondée par une clôture ; *correction* est la date de la première clôture fondatrice lue au registre ; *artefact* est la pièce héritée (R-47) où la règle vit ; le *constat* compte les produits chez qui cet artefact est conforme dans un relevé d'héritage postérieur à la correction, avec le délai en jours. Ce qui n'est pas mesurable le dit — un relevé d'héritage est écrit à chaque ouverture du pilot, la mesure se remplit avec le temps.

| Classe | Correction | Artefact porteur | Constat |
|---|---|---|---|
| `alias-de-transition-perime-survivant` | 2026-09-08 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `anonymisation-portee-partielle` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `auteur-juge-son-contrat` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `banc-etend-referentiel-production` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `boite-entree-produit-statut-git-non-dit` | 2026-09-08 | forge/travaux/TRAVAUX-PILOT.md | 3 produit(s) atteint(s) en 0–1 j ; 8 non atteint(s) (Produit-11, client-a-cockpit-ia, Produit-01, Produit-02, COMPTA---Ventillation-de-facture-Fournisseur-A, Produit-10, Produit-04, Produit-64) |
| `boucle-retour-sans-descente` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `brief-sans-regles-de-socle` | 2026-09-02 | CLAUDE.md | 11 produit(s) atteint(s) en 1–7 j ; 1 non atteint(s) (Produit-11) |
| `champ-transcrit-de-prose-sans-correspondance` | 2026-09-06 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `compte-total-hors-canal-des-constats` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `contrat-de-sortie-sans-domicile` | 2026-09-06 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `controle-sans-fixture-double-sens` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `controle-vrai-sur-le-mauvais-invariant` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `correction-symptome-sans-classe` | 2026-09-02 | forge/retours/GABARIT-LOT-RETOURS.md | 2 produit(s) atteint(s) en 6–7 j ; 10 non atteint(s) (Produit-11, client-a-cockpit-ia, Plateforme_video_IA_complet, Produit-01, Produit-12, Produit-02, Produit-10, Produit-04, COMPTA---Ventillation-de-facture-Fournisseur-A, Produit-64) |
| `date-de-fichier-menteuse-apres-copie` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `deux-regles-du-socle-inconciliables` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `emplacement-livrable-hors-convention` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `fixture-jugee-par-son-seul-oracle` | 2026-09-06 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `gabarit-conception-non-jugee` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `gabarit-famille-manquante` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `garde-lexicale-frontiere-ascii` | 2026-09-05 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `gate-cout-invite-au-contournement` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `gate-ecriture-juge-fichier-entier` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `heritage-avertissement-tardif` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `l99-forme-sortie` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `lecture-tiers-non-jugee` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `livrable-ecrase-sans-indice` | 2026-08-23 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `lot-de-travaux-mauvais-module-producteur` | 2026-09-05 | forge/travaux/TRAVAUX-PILOT.md | 8 produit(s) atteint(s) en 2–4 j ; 4 non atteint(s) (Produit-11, client-a-cockpit-ia, Plateforme_video_IA_complet, Produit-64) |
| `lot-remis-ecrasable` | 2026-09-08 | forge/retours/oracle-lot.mjs | 9 produit(s) atteint(s) en 0–1 j ; 2 non atteint(s) (client-a-cockpit-ia, Produit-64) |
| `maquette-absente-avant-code` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `marque-de-propriete-devinee-par-sous-chaine` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `motif-exclusion-couvert-compte-absent` | 2026-09-08 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `oracle-remplace-par-controle-maison` | 2026-09-02 | CLAUDE.md | 11 produit(s) atteint(s) en 1–7 j ; 1 non atteint(s) (Produit-11) |
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
| `point-entree-declare-rouge-sur-toute-cible` | 2026-09-08 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `porte-cle-courte-sans-frontiere` | 2026-09-07 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `porte-sans-chemin-des-tables` | 2026-09-08 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `quantificateur-sacrifie-au-budget-du-texte` | 2026-09-10 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `recette-verdict-non-prononcable` | 2026-09-02 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `registre-doublon-non-detecte` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `regle-balaie-prose-et-identifiants` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `regle-de-branche-annoncee-differente-configuree` | 2026-09-08 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `regle-ecrite-sans-oracle-qui-la-joue` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `regle-neuve-sans-mesure-de-bruit` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `regle-qui-interdit-son-propre-remede` | — | — | non mesurable : aucune clôture fondatrice au registre |
| `releve-heritage-juge-arbre-pas-histoire` | 2026-09-08 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `restitution-action-humaine-geste-agent` | 2026-09-02 | forge/RESTITUTION.md | 1 produit(s) atteint(s) en 7–7 j ; 11 non atteint(s) (Produit-11, client-a-cockpit-ia, Plateforme_video_IA_complet, Produit-01, Produit-12, Produit-02, Produit-10, Produit-04, COMPTA---Ventillation-de-facture-Fournisseur-A, Client-A-POC-to-Prod, Produit-64) |
| `restitution-fichier-juge-mal-choisi` | 2026-09-02 | forge/RESTITUTION.md | 1 produit(s) atteint(s) en 7–7 j ; 11 non atteint(s) (Produit-11, client-a-cockpit-ia, Plateforme_video_IA_complet, Produit-01, Produit-12, Produit-02, Produit-10, Produit-04, COMPTA---Ventillation-de-facture-Fournisseur-A, Client-A-POC-to-Prod, Produit-64) |
| `restitution-rendu-visuel-non-critique` | 2026-09-02 | forge/RESTITUTION.md | 1 produit(s) atteint(s) en 7–7 j ; 11 non atteint(s) (Produit-11, client-a-cockpit-ia, Plateforme_video_IA_complet, Produit-01, Produit-12, Produit-02, Produit-10, Produit-04, COMPTA---Ventillation-de-facture-Fournisseur-A, Client-A-POC-to-Prod, Produit-64) |
| `sceau-de-vue-provenance-sans-contenu` | 2026-09-05 | — | non mesurable : la règle ne vit dans aucun artefact hérité (R-47) — descente par le pilot seul |
| `skill-non-invoque-lexique` | 2026-08-14 | CLAUDE.md | 11 produit(s) atteint(s) en 20–26 j ; 1 non atteint(s) (Produit-11) |
| `surface-implicite-non-livree` | 2026-09-05 | CLAUDE.md | 11 produit(s) atteint(s) en 2–4 j ; 1 non atteint(s) (Produit-11) |
| `texte-sur-la-graphie-detruit-par-sa-pseudonymisation` | — | — | non mesurable : aucune clôture fondatrice au registre |

## 3. Taux d'héritage par règle (dernier relevé)

Comment lire : une ligne par artefact hérité déclaré dans `gabarits/HERITAGE.json`, état au relevé du 2026-09-09T12:44:25.664Z sur 10 produit(s) ; *conformes* compte les produits chez qui l'artefact est présent et à jour ; *familles* dit de quelles familles de défaut cet artefact protège.

| Artefact | Mode | Conformes | Familles protégées |
|---|---|---|---|
| forge/retours/GABARIT-LOT-RETOURS.md | copie_conforme | 3/10 | lot-forme |
| forge/retours/oracle-lot.mjs | copie_conforme | 3/10 | lot-forme |
| forge/hooks/factory.mjs | copie_conforme | 8/10 | skill-ou-oracle-non-invoque, restitution-forme, page-html-socle, heritage-produit |
| forge/RESTITUTION.md | copie_conforme | 3/10 | restitution-forme |
| .claude/settings.json | presence_et_motif | 10/10 | skill-ou-oracle-non-invoque, restitution-forme, page-html-socle, heritage-produit |
| CLAUDE.md | presence_et_motif | 9/10 | skill-ou-oracle-non-invoque |
| robots.txt | presence | 4/10 | — |
| llms.txt | presence | 4/10 | — |
| forge/travaux/TRAVAUX-PILOT.md | copie_conforme | 3/10 | heritage-produit |
| forge/travaux/ECARTS-ASSUMES.md | presence | 5/10 | heritage-produit |
| forge/travaux/oracle-travaux.mjs | copie_conforme | 3/10 | heritage-produit |
| .gitignore | presence_et_motifs | 2/10 | secret-hors-perimetre |
| forge/retours/CLASSES.json | copie_conforme | 3/10 | heritage-produit, lot-forme |

## 4. Contre-métrique : classes créées

Comment lire : le nombre de classes créées par semaine ISO, puis les classes sans clôture fondatrice et les retours entrés sous une classe signalée suspecte. Une semaine qui crée plus de classes qu'elle ne clôt de récidives demande une relecture du référentiel, pas une félicitation.

| Semaine | Classes créées |
|---|---|
| 2026-S36 | 37 |
| 2026-S37 | 25 |

- Classes sans clôture fondatrice : `emplacement-livrable-hors-convention`, `registre-doublon-non-detecte`, `banc-etend-referentiel-production`, `gate-cout-invite-au-contournement`, `regle-neuve-sans-mesure-de-bruit`, `controle-sans-fixture-double-sens`, `deux-regles-du-socle-inconciliables`, `controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas`, `controle-vrai-sur-le-mauvais-invariant`, `regle-ecrite-sans-oracle-qui-la-joue`
- Retours entrés sous une classe suspecte : TF-0995 (controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas), TF-1003 (controle-vrai-sur-le-mauvais-invariant), TF-1006 (controle-ancre-sur-un-chemin-que-la-session-ne-charge-pas), TF-1011 (regle-ecrite-sans-oracle-qui-la-joue)

## Ce que cette vue ne juge pas

- la JUSTESSE d'une classe déclarée par un producteur : un retour mal classé est une récidive manquée, et seule une revue des classes (BOUCLE-AMELIORATION.md) la voit ;
- la descente d'une règle qui ne vit dans aucun artefact hérité : elle est déclarée non mesurable, jamais supposée faite ;
- les items antérieurs au 03/09/2026 sans classe : ils ne comptent ni comme items ni comme récidives — la mesure du pas 0 (output/03-etudes) les a lus une fois, à la main.
