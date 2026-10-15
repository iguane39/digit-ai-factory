# Retours forges — Produit-12 — 20261014a

- **Contexte** : autre — boucle d'amélioration de la qualité du classement des fichiers (normes 2.7 à 2.14), remontée sur décision humaine D-46 (a) du 14/10/2026
- **Références ledger** : `forge\ledger.jsonl` seq 314, 315 (entrées `type: retour` et `reponse_humain`)
- **Remise au pilot** : copier ce fichier, son sidecar et ses deux pièces jointes dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 2026-10-14

Pièces jointes, remises avec le lot :
- `Produit-12 - RETOURS - 20261014a - PJ - Etude qualite du classement.md` : l'étude du 14/10, dont le chapitre 7 décrit la méthode ;
- `Produit-12 - RETOURS - 20261014a - PJ - Principe d'analyse critique.md` : la proposition de principe du 14/10 (règles PC-1 à PC-6).

---

## pilot (`digit-ai-factory`)

Une sortie automatisée de classement a été jugée pendant huit versions sur la part de fichiers rangés et sur des portes de forme. Mesurée le 14/10 sur un échantillon étiqueté à l'aveugle, sa justesse est de 63 à 66 % ; la boucle d'amélioration qui a suivi a montré deux défauts de méthode que la loi transverse de qualité n'outille pas.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RS-31 | majeur | produit+générique | Le classement de 9 662 fichiers affichait 97 % de fichiers « rangés » en norme 2.7 ; toutes les portes étaient vertes (grammaire, dates de baux). Mesuré sur 150 fichiers tirés au hasard et étiquetés par trois agents qui ne voyaient pas le résultat, le dossier est juste dans 63,3 % des cas (intervalle de Wilson 55,4 à 70,6), puis 66,0 % après deux versions. Jusqu'à la 2.9, la seule relecture était celle de l'auteur des règles. Preuve : `output\06-dossiers-dropbox\reference\mesure-norme-2.9.json`, ledger seq 313, étude jointe chapitres 1 à 3 | Ajouter au registre de `quality-oracles` un domaine « sortie automatisée de tri, de classement ou de rédaction », jugé sur un échantillon de référence étiqueté hors du système, avec le principe PC-1 à PC-6 de la pièce jointe |
| RS-32 | majeur | produit+générique | Deux versions d'une boucle d'amélioration auraient été mal jugées par la seule mesure sur l'échantillon. La v2.11 gagnait 2,7 points de justesse du type sans un faux sur l'échantillon, mais ses 201 changements dans la population comptaient 4 faux sur 12 relus : l'en-tête des diagnostiqueurs cite tous leurs métiers. La v2.10 annonçait une correction des années comptables qui ne touchait aucune ligne existante, puisqu'elle ne s'appliquait qu'aux rangements neufs. Un test de la v2.14 passait aussi sur le code précédent. Preuve : `mesure-norme-2.11-rejetee.json`, `passes.py` règles RV-4 et RV-5, ledger seq 313, étude jointe chapitre 4. Classe proposée : `amelioration-jugee-sans-ses-effets` (famille `regle-morte`), « Une version améliorée est jugée sur son échantillon sans contrôle de ses changements dans la population ni de son effet sur l'existant » | Porter dans `la-boucle` et dans la loi de qualité la méthode en huit étapes du chapitre 7 de l'étude : test rouge sur le code précédent, règle appliquée à l'existant, tirage des changements dans la population à chaque version, rejet tracé, arrêt chiffré et borné |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Les règles de rangement elles-mêmes (passes RP, RL, RD, RV) se trompaient sur des cas propres au courrier du cabinet : Kbis pris pour une pièce de candidat, en-têtes de diagnostiqueurs, garants mal placés | règles et tests dans `passes.py` et `tests_passes.py`, normes 2.8 à 2.14 | non | Rien de généralisable dans les règles elles-mêmes, parce qu'elles décrivent le courrier d'un cabinet ; la méthode qui les a jugées est remontée en RS-31 et RS-32 |
| 65 désaccords entre l'outil et le lecteur restent à trancher | questions fermées au cabinet, `questions-cabinet-norme-2.14.csv` | non | Rien de généralisable : c'est une décision de métier propre au cabinet |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : l'étude ci-dessous a été écrite hors famille, et c'est ce manque que la ligne rapporte.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| Produit-12 - Etude qualite du classement - 20261014o | aucun gabarit (étude hors famille) | une famille de document pour une étude de qualité mesurée : échantillon, mesures par version, décisions de rejet, méthode | rien n'a encore été rapporté par le lecteur | tout le document, en particulier le tableau des versions avec leur décision et le chapitre de méthode | générique |

## Documents mûrs

| Document | Versions datées | Verdict |
|---|---|---|
| Exemple avant apres BERNARD | 7 | reste au produit, parce que sa matière est le courrier d'un cabinet et que sa forme suit déjà le socle `digit-ai-page-html` sans composant à extraire |
| Exemple avant apres SAS CREER PROMOTION | 7 | reste au produit, pour la même raison |
| Exemple reponses contextualisees BERNARD | 5 | reste au produit, parce que sa forme (mail reçu, brouillon, règles appliquées) est propre au produit de rédaction de réponses |
| Exemple reponses contextualisees SAS CREER PROMOTION | 5 | reste au produit, pour la même raison |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot. Le renommage des copies rangées, refusé par Windows tant que l'Explorateur et Google Drive tenaient les dossiers, a été repris au tour suivant ; il ne relève d'aucune stratégie de plateforme.
