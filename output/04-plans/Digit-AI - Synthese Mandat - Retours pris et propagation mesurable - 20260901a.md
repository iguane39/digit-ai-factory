---
destinataire: humain
---

# Synthèse de mandat — trois lots pris, la propagation devient mesurable, et le banc monte à 80 (01/09/2026)

## 0. Synthèse d'ouverture

Votre demande est exécutée dans ses deux temps. Les retours d'abord : trois lots arrivés hier soir pendant la clôture ont été pris — quatre demandes entrent au registre, dont deux règles de contrôle proposées par un produit et un principe de connexion au déploiement perdu deux fois. Un outil de la chaîne d'entrée supposait conforme ce qu'il aurait dû vérifier et bloquait deux de ces retours : corrigé dans l'heure, avec sa recette. Les todos ensuite : le dernier chantier que vous aviez décidé et qui visait ce dépôt est clos — une correction marquée « corrigée » peut désormais être SUIVIE jusqu'aux produits qu'elle concerne, au lieu de voyager au hasard des sessions. Tout est enregistré et publié. Rien de neuf n'attend votre arbitrage : les quatre décisions d'hier restent ouvertes telles quelles, et les nouveaux candidats attendent leur tri.

## 1. En-tête d'identification

- **quoi** — mandat « traite les todos et retours, puis publie à nouveau » : relevé de la boîte, ingestion, dernier item décidé visant ce dépôt, publication.
- **sur quoi** — le pilot `digit-ai-factory` ; lecture seule chez deux produits (localisation et confrontation).
- **quand** — fin le **01/09/2026 à 06:35 (UTC+02:00)**, durée **≈ 1 h 45**.
- **qui** — session pilot Claude Fable 5 ; dépôt passé de `a3882e8` à `d8123bb` + commit de clôture, publié en fin de tour.

## 2. Verdict en une ligne

**3 lots ingérés, 4 candidatures entrées** (TF-0733 à TF-0736) · **TF-0737 corrigé dans l'heure** (le normalisateur supposait conforme, recette 6/6, mutation 3/6) · **TF-0689 clos** — oracle de propagation 8/8, câblé à l'arrivée de chaque lot · **TF-0738 candidat** (le cliquet lisait une date comme un compte de cas — libellé corrigé à la source, baseline remontée 1 → 6) · boîte **PASS** · registre **PASS, 44 actifs** · banc **80/80** · publié.

## 3. Décisions attendues

Rien de **neuf** n'attend une décision ce tour. Les quatre décisions d'hier soir restent ouvertes et leurs replis s'appliquent depuis : la demande d'étude du produit de gîtes reste à la porte, les quatre lots de travaux restent chez le pilot, l'item des six recettes reste sans suite, et le contrôle d'écriture de votre poste continuera de bloquer l'édition des modèles. Elles sont rappelées au bloc 8 avec leurs numéros d'hier — répondre « D-30 (a) » suffit, la synthèse d'hier porte leurs tableaux d'options. S'y ajoute le tri ordinaire des candidats du registre, dont les quatre entrés ce matin. **Si rien n'est décidé** : les replis d'hier continuent de s'appliquer — c'est l'option par défaut, et elle a un effet : les portes restent fermées.

## 4. Traité — avec sa preuve

- **Les trois lots arrivés pendant la clôture d'hier sont pris** — deux du produit de gestion de courrier (le principe de connexion au déploiement perdu deux fois ; la grille « typé, proposé, borné » des champs de saisie), un du produit de gîtes (deux défauts que seize contrôles verts n'ont pas vus : un voile invisible qui interceptait chaque clic, une porte de connexion qui divulguait sa politique de sécurité).
  - preuve : 4 candidatures **TF-0733 à TF-0736** au registre ; `oracle-boite-entree` **PASS** ; ingestions consignées (lots `4b51217c6bcf`, `ecdd728acb74`, `f2cf493ae7b7`).
- **TF-0737, correction immédiate : le normalisateur cesse de supposer conforme ce qui porte `schema: 1`** — le lot du produit de gîtes était bloqué à la porte par l'outil censé le faire entrer.
  - preuve : recette neuve `todo\normaliser-lot.test.mjs` **6/6** ; mutation jouée : passe-droit remis → **3/6**, restauré → 6/6 ; le lot réel renormalisé puis ingéré dans l'heure.
- **TF-0689 clos — la propagation d'une correction se mesure des deux côtés** : critères interrogeables au registre (`criteres_beneficiaires`), manifeste d'adoption chez le produit (`forge\socle-adopte.jsonl`, une ligne datée et prouvée par adoption), et [oracle-propagation.mjs](oracles/oracle-propagation.mjs) qui confronte les deux — un produit n'est jugé QUE sur ce qu'il produit.
  - preuve : self-test **8/8** dans les deux sens (concerné sans manifeste → échec ; adoption prouvée → succès ; antidatée → échec ; adoption vers un id inconnu → échec ; produit non concerné → sans objet déclaré) ; mutation jouée sur le cas central ; **câblé** à l'arrivée de chaque lot dans [ingerer-lot.mjs](todo/ingerer-lot.mjs) après la règle d'héritage, vérifié sur un rejeu de lot réel ; convention documentée dans [TODO-FORGE.md](references/TODO-FORGE.md).
- **TF-0738, constat en passant consigné avec sa mesure : le cliquet (le compteur qui interdit à une recette de perdre des cas) lisait « 01/09 » d'un libellé comme un compte de 1 cas** — une baseline fausse dès son premier enregistrement.
  - preuve : entrée `{cas: 1}` mesurée dans la baseline pendant que la recette rend 6 PASS ; libellé corrigé à la source, banc rejoué : **cliquet 1 → 6** ; le motif de fond (ratio non ancré, lu en premier) est au registre en candidat.
- **Le piège d'arguments payé hier s'est représenté et a été attrapé avant publication** — l'index d'un drapeau absent vaut -1, et « +1 » excluait le premier argument.
  - preuve : corrigé dans l'oracle de propagation avec un commentaire qui nomme la classe ; vérifié en exécution sur le produit réel.
- **Registre, vues et banc** : 2 items archivés (TF-0689, TF-0737), 44 actifs, vues et avancement régénérés (sceau `e95521468e89`) ; banc **80/80** (78 hier), 2 recettes neuves au cliquet.
- **Publication** : commits `373bbe5`, `d8123bb` + commit de clôture, poussés.

## 5. Non traité — avec son motif

- **Les 4 candidatures du jour et les 25 autres candidats** : *dépendance à une décision humaine* — tout entre en candidat, le tri vous revient. Les deux règles proposées par le produit de gîtes (le voile, la porte bavarde) sont dans le lot.
- **Les quatre décisions d'hier** (étude refusée à la porte, lots de travaux, six recettes, contrôle d'écriture du poste) : *dépendance à une décision humaine* — replis appliqués, rappel au bloc 8.
- **Les items décidés visant les forges sœurs** : *bloqué par un garde-fou* — aucune écriture chez un dépôt frère sans mandat.
- **L'héritage divergent signalé chez le produit de courrier** (son gabarit de lots retarde d'une version sur celui du pilot, modifié hier pour le canal de rectification) : *dépendance à une décision humaine* — la remise à niveau voyage par les lots de travaux, c'est-à-dire par la décision sur leur dépôt.
- **Le premier armement réel de la propagation** : *écarté pour ce tour, critère de réouverture écrit* — aucun item clos ne porte encore de critères ; la première clôture touchant une famille de gabarit les portera, et l'oracle mordra à ce moment-là. L'écrire aujourd'hui sur un item inventé simulerait la mesure.

## 6. Écarts à la lettre

- **vous avez demandé** « traite les todos et retours » → **j'ai traité les trois lots et UN item décidé** → **pourquoi** : c'était le dernier item décidé traitable dans ce dépôt — tout le reste du registre est soit candidat (votre tri), soit suspendu à une décision d'hier, soit chez une forge sœur (garde-fou). Le tour a préféré finir le chantier de modèle en entier — mécanisme, recette, câblage, doctrine — plutôt que de l'entamer.
- Aucun autre écart.

## 7. Risques

- **La convention de propagation reste désarmée tant qu'aucune clôture ne porte de critères.**
  - signal : l'oracle rend « sans objet » sur tout le parc, durablement.
  - parade : la prochaine clôture touchant une famille de gabarit les porte — c'est écrit au mode opératoire du registre, et le champ est une structure fermée qu'un oubli rend visible.
- **Les produits n'apprendront le manifeste d'adoption qu'au premier avertissement.**
  - signal : un premier échec de propagation chez un produit qui n'a jamais vu le format.
  - parade : le message d'échec porte le format complet et le remède ; acceptation déclarée — livrer un gabarit de plus avant le premier cas réel serait de la doctrine sans mesure.
- **Le motif du cliquet peut encore lire un faux compte ailleurs.**
  - signal : une baseline qui ne colle pas au compte affiché d'une recette.
  - parade : le constat est au registre avec ses pistes (ratio le plus à droite, ou ratio suivi d'un mot de la famille) — c'est un candidat, il attend son tour.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, l'acteur dit qui peut la faire, le motif dit pourquoi elle n'est pas déjà faite, la dernière colonne ce que coûte l'attente. Les actions à décision reprennent les numéros d'hier — la synthèse d'hier porte leurs tableaux d'options. **Ordre de traitement** : le tri des candidats d'abord, parce que deux d'entre eux portent des règles qui fermeraient des classes entières de défauts déjà payés ; puis les décisions d'hier par coût d'attente décroissant — l'étude et les lots de travaux laissent des produits sans réponse, le reste peut attendre sans s'aggraver.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Trier les 4 candidats du jour — deux règles de contrôle proposées (le voile au display explicite, la surface pré-authentification), le principe de connexion au déploiement, la grille des champs de saisie. | `manuelle_utilisateur` | `decision` — tout entre en candidat par construction ; trace mesurée : TF-0733 à TF-0736 au registre, chacun avec sa preuve d'origine. | Deux défauts que seize contrôles verts n'ont pas vus restent sans règle, et le principe de déploiement se reperdra une troisième fois. |
| 2 | `neuve` | Trancher la décision D-30 d'hier (la demande d'étude refusée à la porte) puis, si (a) : faire compléter le lot par le produit et l'ingérer. | `manuelle_utilisateur` puis `auto_ia` | `decision` puis `dependance_bloc_3` — repli (c) en cours : le fichier attend, versionné. | La demande d'étude du produit de gîtes reste sans réponse. |
| 3 | `neuve` | Trancher D-31 (les 4 lots de travaux) — leur dépôt porterait aussi la remise à niveau du gabarit de lots, dont un produit diverge déjà. | `manuelle_utilisateur` puis `auto_ia` | `decision` puis `dependance_bloc_3` — repli (c) en cours depuis trois jours. | Les manques d'héritage et le nouveau canal de rectification restent inconnus des produits. |
| 4 | TF-0684 | Trancher D-32 (les six recettes) puis, si (b) : clore par la déclaration d'historique non mesuré. | `manuelle_utilisateur` puis `auto_ia` | `decision` puis `dependance_bloc_3`. | L'item décidé vieillit pour un choix d'une ligne. |
| 5 | TF-0732 | Trancher D-33 (le contrôle d'écriture du poste contre la charte maison) et appliquer l'option retenue. | `manuelle_utilisateur` | `acces` — la configuration des automatismes du poste vit dans votre profil, hors des dépôts ; trace mesurée hier : quatre blocages pour trois lignes, motifs identiques sur un fichier non touché. | Chaque édition d'un modèle de la bibliothèque paie le péage. |
| 6 | TF-0725, TF-0726 | Trancher D-29 d'avant-hier puis clore les deux constats du banc avec leurs gains. | `manuelle_utilisateur` puis `auto_ia` | `decision` puis `dependance_bloc_3`. | Le registre annonce ouverts deux défauts déjà réparés. |
| 7 | `neuve` | Faire tourner les 2 jetons d'hébergeur et les 4 secrets relevés il y a quatre jours. | `manuelle_utilisateur` | `acces` — consoles des fournisseurs ; trace mesurée : lecture limitée à la longueur des valeurs (36 caractères), aucune authentification tentée. | Des identifiants de déploiement restent lisibles sur le disque. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Retours pris et propagation mesurable - 20260901a.md`
- Commits : `373bbe5` (normalisateur, TF-0737) · `d8123bb` (propagation, TF-0689) · + commit de clôture — poussés
- Registre : [TODO.jsonl](todo/TODO.jsonl) — TF-0733 à 0738 créés, TF-0689 et TF-0737 clos et archivés, 44 actifs, vues sceau `e95521468e89`
- Lots pris : `Produit-02 - RETOURS - 20260831b` (via dérivé normalisé) · `Produit-12 - RETOURS - 20260831b` et `20260831c`
- Bancs : `oracles\self-tests.mjs` **80/80** · `oracle-propagation --self-test` 8/8 · `normaliser-lot.test.mjs` 6/6 · `oracle-boite-entree` PASS · `oracle-todo` PASS
- Doctrine : [TODO-FORGE.md](references/TODO-FORGE.md) § propagation (TF-0689)
