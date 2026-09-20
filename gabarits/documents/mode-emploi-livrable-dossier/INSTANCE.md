---
destinataire: humain
role_destinataire: commanditaire de Client-A — recette le modèle décisionnel livré, et décide de le mettre à disposition de ses contrôleurs de gestion
---

# Mode d'emploi — modèle décisionnel « Production et ventes »

**Livrable** : dossier `modele-production-ventes/` · **Indice** : 20260920a · **Date** : 20/09/2026
**Version de l'artefact** : paquet `v2.1.0`, horodaté du 19/09/2026
**Ledger du produit** : `forge\ledger.jsonl` — source des décisions citées au § 2
**Gabarit : gd-mode-emploi-dossier** · **Version du gabarit : 1.0.0**

> Instance de démonstration de la famille. Le client, le produit, les identifiants de décision et
> les dates sont **fictifs et pseudonymisés** (Client-A) ; le dossier décrit n'existe pas. Ce
> document prouve une FORME — et en particulier le § 2, qui rejoue en modèle réduit le cas RF-18
> du 16/09/2026 : un commanditaire dénonçant comme un défaut les quatre tables de faits qui
> appliquaient sa propre décision, tranchée neuf jours plus tôt.

---

## 1. Ce que vous tenez, et par où commencer

Ce que contient le dossier, à qui il s'adresse, et le fichier à ouvrir en premier.

Vous tenez le modèle décisionnel « Production et ventes » de Client-A : un modèle sémantique
Power BI, ses quatre tables de faits, ses neuf dimensions conformes, et les scripts qui
alimentent la couche Gold depuis l'entrepôt. Le dossier est destiné au **commanditaire et aux
contrôleurs de gestion** qui vont l'utiliser, et suppose connus les indicateurs du comité de
direction — il ne suppose aucune compétence en modélisation.

**Point d'entrée unique** : ouvrir `rapports/Production-et-ventes.pbix`. Tout le reste du dossier
sert ce fichier ; aucun autre n'est à ouvrir pour une première lecture.

## 2. Choix d'architecture et décisions qui les fondent

Les choix que vous allez rencontrer en ouvrant le dossier, et la décision qui fonde chacun.
Chaque ligne se relit au ledger du produit, cité en en-tête : rien ici n'est écrit de mémoire.

| Choix | La décision | Qui l'a prise | Quand | Pourquoi — ce que cela apporte au lecteur |
|---|---|---|---|---|
| **Quatre tables de faits** et non une seule | Séparer les faits par processus métier : production, ventes, stocks, retours | **Le commanditaire**, en comité de modélisation | 2026-09-07 | Chaque processus a sa propre granularité et son propre calendrier de disponibilité. Une table unique aurait obligé à porter des mesures nulles sur les trois quarts des lignes, et un écart de stock aurait été impossible à distinguer d'un retour. Les quatre tables partagent les mêmes dimensions : un filtre posé une fois vaut pour les quatre. |
| Pas de **vue matérialisée** sur les agrégats mensuels | Calculer les agrégats à la volée dans le modèle sémantique | Architecte de données du produit | 2026-09-09 | Les volumes mesurés (2,1 millions de lignes de faits sur 36 mois) restent sous le seuil où la matérialisation apporte quelque chose. Vous gagnez la fraîcheur : un correctif passé dans l'entrepôt se voit au rafraîchissement suivant, sans chaîne intermédiaire à relancer. |
| Dimension temps **commençant en 2023** et non en 2019 | Borner l'historique à 36 mois glissants | **Le commanditaire** | 2026-08-28 | Les données antérieures à 2023 proviennent de l'ancien système de production et ne sont pas réconciliées. Les inclure aurait fait apparaître des ruptures de série que personne n'aurait pu expliquer en comité. La borne se relève quand la reprise d'historique sera faite. |
| **Deux fichiers** de rapport et non un seul | Séparer le rapport de pilotage du rapport d'analyse détaillée | Responsable du contrôle de gestion, sur proposition du produit | 2026-09-11 | Le rapport de pilotage s'ouvre en moins de cinq secondes parce qu'il ne charge pas les détails ligne à ligne. L'analyse détaillée reste disponible, dans son propre fichier, pour qui en a besoin. |

**Références au ledger** : décisions `DEC-2026-09-07-a` (quatre tables de faits),
`DEC-2026-09-09-b` (agrégats à la volée), `DEC-2026-08-28-a` (borne d'historique) et
`DEC-2026-09-11-c` (séparation des rapports), toutes relisibles dans `forge\ledger.jsonl` aux
entrées `type: decision` correspondantes.

**Ces décisions ne sont pas rouvertes ici.** Cette section les rend retrouvables à l'endroit où
vous rencontrez leur effet. Une décision que vous souhaitez changer se rouvre au ledger, par la
voie du comité, et non dans ce mode d'emploi.

## 3. Le contenu du dossier, répertoire par répertoire

Ce qu'on trouve, ce qu'on en fait, et surtout quand il faut l'ouvrir.

| Répertoire | Ce que c'est | À ouvrir quand… |
|---|---|---|
| `rapports/` | Les deux fichiers Power BI : pilotage et analyse détaillée | …vous voulez voir les chiffres. C'est le point d'entrée |
| `modele/` | Le modèle dimensionnel déclaré (`modele.json`) et sa matrice en bus | …vous vous demandez quelles dimensions filtrent quel fait, ou quelle est la granularité d'une table |
| `sql/` | Les requêtes qui construisent la couche Gold depuis l'entrepôt | …un chiffre vous surprend et vous voulez remonter à sa source |
| `controles/` | Les jeux de contrôle de qualité et leurs derniers verdicts | …vous voulez savoir ce qui a été vérifié, et ce qui ne l'a pas été |
| `exports/` | Les extraits plats livrés à la demande du contrôle de gestion | …un outil tiers doit consommer les données sans passer par Power BI |

## 4. Ce qu'il faut pour s'en servir

Les prérequis réels, et comment constater qu'on les a. Un prérequis qu'on ne sait pas vérifier se
découvre au moment où il manque.

| Prérequis | Comment vérifier qu'on l'a |
|---|---|
| Power BI Desktop, version 2026.08 ou ultérieure | Menu Aide, « À propos » : la version s'affiche |
| Droit de lecture sur le schéma `gold_production` de l'entrepôt | Ouvrir le rapport de pilotage et lancer un rafraîchissement : il échoue explicitement sur un refus de droits |
| Connexion réseau à l'entrepôt depuis le poste | Le rafraîchissement aboutit ; à défaut, le message cite le nom du serveur |
| Jeu de données de référence du mois clos | Le fichier `controles/dernier-verdict.json` porte la date du dernier mois validé |

**Ce qui a été testé, et où.** Le dossier a été ouvert et rafraîchi intégralement le 19/09/2026
sur Power BI Desktop version 2026.08, depuis un poste du réseau interne, avec les droits de
lecture ci-dessus. Aucun autre environnement n'a été éprouvé, et aucune promesse de
compatibilité n'est faite au-delà.

## 5. Limites connues, et ce qui n'est pas dans ce dossier

Les manques constatés, avec leur motif. Si vous trouvez ici ce que vous venez de constater,
c'est que nous l'avons vu : inutile d'ouvrir un incident.

- **l'historique s'arrête à janvier 2023** — conséquence de la décision `DEC-2026-08-28-a` du
  § 2, non une perte de données. La reprise des années 2019 à 2022 est un chantier distinct, non
  engagé ;
- **les retours fournisseurs ne sont pas dans le fait « retours »** — seuls les retours clients y
  figurent. La source fournisseur n'est pas encore alimentée dans l'entrepôt ;
- **trois indicateurs du comité ne sont pas couverts** (marge par gamme, taux de service
  fournisseur, coût de non-qualité) : leurs définitions ne sont pas arbitrées, faute de
  propriétaire métier désigné ;
- **aucune sécurité au niveau des lignes** n'est posée : tout lecteur du rapport voit tous les
  sites. Si un cloisonnement est requis, il fait l'objet d'une demande séparée.

## 6. À qui s'adresser

Le contact, et ce qu'il faut recueillir avant de signaler une anomalie.

Le contact est le **responsable de produit data** de Client-A, par le canal de support habituel.
Avant tout signalement, recueillir les trois éléments qui évitent un aller-retour :

1. la **version de l'artefact** (visible en en-tête de ce document, et dans le pied du rapport) ;
2. **ce qui a été fait**, geste par geste, jusqu'à l'anomalie ;
3. **ce qui était attendu**, et ce qui s'est produit à la place.

Un écart de chiffre se signale toujours avec la **période** et le **filtre actif** : sans eux, il
n'est pas reproductible.
