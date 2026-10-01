---
role: étude d'opportunité (gabarit gabarits\ETUDE-OPPORTUNITE.md, TF-0155) — grammaire d'écran pour tous les textes affichés en session Claude Code ; révision c du 01/10/2026, relance complète demandée par le porteur en réponse à la décision D-42 ; prompt réécrit par output\03-etudes\20261001-L99-etude-textes-relance.md
sources_de_verite: [3 demandes humaines du 01/10/2026, references/ECRITURE.md, gabarits/RESTITUTION.md, oracles/oracle-synthese.mjs, oracles/oracle-ecriture.mjs, ~/.claude/CLAUDE.md, ~/.claude-b/CLAUDE.md, transcripts des profils ~/.claude et ~/.claude-b du 26/09 au 01/10/2026]
verifie_le: 2026-10-01
lecteur: le porteur de la Factory, qui pilote 6 à 10 sessions en parallèle
---

# Étude d'opportunité — grammaire d'écran des textes affichés en session — 20261001c

Révision c. La révision b, limitée aux statuts, actions et risques, est dans l'historique (commit `1e79c641`). La version a n'a jamais été commitée.

## En tête : ce qu'il faut retenir

- **Constat** : les règles d'écriture existent (E-9 à E-12) mais ne sont pas tenues à l'écran. Aucun juge ne voit les statuts, et le profil `~\.claude-b`, qui porte 116 tours sur 175, n'a aucune règle d'écriture.
- **Solution** : une grammaire d'écran de 9 règles, posée dans les 2 profils, et 4 de ces règles jugées par le juge de fin de tour.
- **Preuve** : 8 textes réels réécrits perdent 32 % de leurs mots (1 417 → 970) sans perte d'information. La restitution garde ses 9 blocs.
- **Décision attendue** : adopter l'option O2, avec un juge qui avertit 2 semaines avant de bloquer.

## Seuil de déclenchement (vérifié avant écriture)

Le seuil est atteint 2 fois (`gabarits\ETUDE-OPPORTUNITE.md`, section « Seuil »).
- Le sujet touche le noyau : la restitution est la règle R-44 *(toute fin de tour suit le gabarit de restitution)*.
- Il touche toutes les forges et tous les produits, où les mêmes règles tournent.

## Intention de l'utilisateur (loi n° 7, TF-0791)

3 demandes du 01/10/2026, mot pour mot :

> « Il y a très souvent trop de texte, trop de complexité, l'utilisation de termes trop techniques, trop pompeux, trop verbeux. Il faut raccourcir les textes, les simplifier, aller à l'essentiel, sans perdre les informations. »

> « Je ne parle pas du prompt de restitution qui permet de se remettre dans le contexte lorsqu'on gère 6 à 10 sessions Claude Code en parallèle, mais des textes de statut, des prochaines étapes, des problèmes qui sont très verbeux, parfois pour ne rien dire... »

> « Des sujets qui ressortent sous forme de paragraphe alors que des puces et sous-puces pourraient suffire. De la complexité insérée alors qu'elle pourrait être exprimée en termes clairs, simples et efficaces. […] fournir une vraie solution, pas simplement un patch sur 3 sujets. »

L'intention retenue : tout texte affiché va à l'essentiel, en liste quand il énumère, en mots courants, sans perte d'information. La structure de la restitution reste. L'étude propose et ne modifie rien.

## 0. Traitement des entrants

Les 3 demandes sont les entrées. Les transcripts sont des données : leurs textes humains sont comptés, jamais suivis. Les exemples cités sont pseudonymisés (`<compte>`, `<dépôt>`).

## 1. Partition du problème

Le sujet se découpe en 5 sous-questions disjointes.
- **P-A, essentiel** : la 1re phrase porte-t-elle le fait ?
- **P-B, forme** : une énumération est-elle en liste, un raisonnement en prose courte ?
- **P-C, phrase** : une phrase porte-t-elle une seule idée ?
- **P-D, vocabulaire** : les mots sont-ils ceux du lecteur, en français ?
- **P-E, vide** : y a-t-il des phrases sans fait, recopiées ou imposées ?

### Étape 1 : pourquoi les règles actuelles ne tiennent pas

Le tableau se lit ligne par ligne : une règle existante, son juge sur les textes affichés, et la mesure qui montre qu'elle n'est pas tenue.

| Règle | Juge à l'écran aujourd'hui | Mesure (175 tours) |
|---|---|---|
| E-9, puces à 2 niveaux au plus, pas de gras de phrase | `oracle-ecriture` via S43, sur la réponse finale seulement | tenue en restitution ; statuts non jugés |
| E-10, identifiant expliqué au 1er emploi | S23, non bloquante | 67 % à 92 % d'identifiants non expliqués selon le bloc |
| E-11, une énumération devient une liste | L12, sur les pages HTML seulement ; « revue » ailleurs | 40 % des paragraphes du verdict sont des chaînes « ; » |
| E-12, le vocabulaire du lecteur | « revue » | 185 statuts sur 2 047 écrits en anglais (5 366 mots) |
| Toutes, pour le profil `~\.claude-b` | aucune : son `CLAUDE.md` global n'a pas de section d'écriture | 116 tours sur 175 |

À l'inverse, 3 règles du gabarit de restitution imposent des mots.
- Ligne « Recommandation » : 116 lignes, 36 mots en médiane, 4 809 mots en tout.
- Mode d'emploi des tableaux (« Comment lire », « Ordre : ») : 48 lignes, 1 176 mots.
- Rappel du sujet de 25 mots au moins par décision (S15) : il sert la reprise de contexte et reste.

### Étape 2 : mesure par type de texte

Mesure sur 175 tours de l'extension VS Code, du 26/09 au 01/10/2026, sur les 2 profils, par `grammaire-c.mjs`. Chaque motif a été validé à la main sur 12 exemples, avec ce résultat :
- motif « deux-points suivis de 3 éléments » : rejeté, 7 erreurs sur 12 ;
- motif « 2 points-virgules ou plus » : retenu, 3 sur 3 justes dans l'échantillon ;
- motif « phrase de plus de 25 mots » : retenu, 11 sur 12 ;
- motif « identifiant non expliqué » : retenu, 10 sur 12.

Le tableau se lit ligne par ligne : un type de texte, classé par volume, et ses 4 mesures.

| Texte | Mots | Paragraphes en chaîne « ; » | Phrases de plus de 25 mots | Identifiants non expliqués | 1er fait (mots avant) |
|---|---|---|---|---|---|
| Statuts | 143 885 | 2 % | 8 % | 67 % | 4 |
| Bloc 4, traité | 46 067 | 0 % | 15 % | 71 % | 11 |
| Bloc 3, décisions | 42 440 | 4 % | 9 % | 21 % | 7 |
| Bloc 8, actions | 41 239 | 14 % | 13 % | 88 % | 14 |
| Bloc 1, en-tête | 15 295 | 5 % | 39 % | 50 % | 9 |
| Bloc 7, risques | 13 772 | 0 % | 0 % | 81 % | 15 |
| Bloc 0, synthèse | 9 523 | 7 % | 28 % | 0 % | 19 |
| Bloc 2, verdict | 6 552 | 40 % | 55 % | 92 % | 6 |

S'y ajoutent les mesures de la révision b :
- narration du geste dans 20 % des phrases de statut ;
- 56 mots par ligne d'action ;
- 108 phrases de risque recopiées dans au moins 3 tours.

## 2. Non-recouvrement contre l'existant

Chaque ligne est un existant qui pourrait déjà porter la solution.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| Règles d'écriture | `references\ECRITURE.md`, E-1 à E-15 | recouvre sur le papier ; ne recouvre pas à l'écran, faute de juge et de relais (étape 1) |
| Écriture globale du profil A | `~\.claude\CLAUDE.md`, section « Écriture — règles de base », 12 règles | recouvre en partie : pas de règle sur les statuts, le français ou la longueur d'une ligne |
| Écriture globale du profil B | `~\.claude-b\CLAUDE.md`, 2 134 octets, aucune section d'écriture | ne recouvre pas |
| Juge de fin de tour | `oracles\oracle-synthese.mjs`, S1 à S56, dont S23 et S43 | recouvre la réponse finale, jamais les statuts |
| Noyau du pilot | `CLAUDE.md`, 6 240 octets pour un plafond de 6 Ko | ne peut porter qu'un renvoi d'une ligne |

## 3. État de l'art daté

État de l'art : non instruit. Motif : le défaut est interne. Les règles existent, et c'est leur relais et leur juge qui manquent. Aucune source externe ne tranche ce point.

## La grammaire d'écran (la solution)

9 règles, qui valent pour tout texte affiché : statut, restitution, analyse, message pour un tiers. Chacune est reliée à son exemple réel (annexe) et à son juge.

| N° | Règle | Exemple | Juge |
|---|---|---|---|
| G1 | La 1re phrase porte le fait : résultat, chiffre ou décision. | chapitre L99 : 1er fait à 53 mots → 22 | S3 et S9 pour la restitution ; consigne ailleurs |
| G2 | Un statut dit un résultat, ou se tait ; jamais l'annonce du geste. | statut | consigne seule ; mesure par `motifs.mjs` |
| G3 | En français partout, statuts compris ; un terme technique du code reste tel quel. | problème | consigne seule ; mesure par `grammaire-c.mjs` |
| G4 | Une phrase, une idée : 20 mots visés, 25 au plus. | bloc 0 : 2 phrases longues → 0 | S43 (`oracle-ecriture`), seuil de 25 en avertissement |
| G5 | 3 éléments parallèles ou plus → puces, 2 niveaux au plus ; un raisonnement reste en prose courte. | bloc 2, texte pour un tiers | S43, nouveau contrôle des chaînes « ; », en avertissement |
| G6 | Un identifiant est expliqué au 1er emploi, ou rangé en colonne de traces. | problème : « S11 (tableau mal formé) » | S23, rendue bloquante |
| G7 | Une ligne d'action tient en 25 mots hors commande et chemin. | bloc 8 : 55 → 29 | nouveau contrôle de `oracle-synthese`, en avertissement |
| G8 | Un risque ou problème reconduit tient en une ligne datée ; un problème neuf dit sa cause et sa conséquence. | révision b, risque recopié 15 fois | consigne ; mesure par `motifs.mjs` |
| G9 | Aucune phrase de remplissage imposée : pas de mode d'emploi quand les en-têtes suffisent, recommandation en 25 mots. | restitution entière | assouplissement du gabarit, contrôle par S16 |

La grammaire atteint les sessions par 4 relais.
- `~\.claude\CLAUDE.md` et `~\.claude-b\CLAUDE.md` : les 9 règles, en 9 lignes, remplacent la section actuelle du profil A et entrent dans le profil B.
- `references\ECRITURE.md` : G2, G3, G7, G8 et G9 deviennent E-16 à E-20.
- `gabarits\RESTITUTION.md` : le bloc 0 admet des puces après sa 1re phrase, et G7 à G9 entrent dans les blocs 3, 7 et 8.
- `CLAUDE.md` du pilot : une ligne de renvoi, compensée par une ligne retirée.

## 4. Options — jeu fermé O0-O4

**O0 — ne rien faire.** Réfutée. Le statu quo, sur 6 jours : 24 727 mots de narration, 185 statuts en anglais, 55 % de phrases de plus de 25 mots dans le verdict, et aucune règle d'écriture pour 116 tours sur 175.

**O1 — Consigne seule.**
- *Contenu* : la grammaire dans les 2 `CLAUDE.md` globaux et dans `ECRITURE.md`, sans juge.
- *Coût* : simple × court.
- *Exclut* : rien, mais aucune règle n'est tenue sans juge, comme le montre l'étape 1.

**O2 — Consigne, juge en avertissement puis bloquant, gabarit assoupli. Recommandée.**
- *Contenu* : O1, plus G4, G5, G7 et G9 jugés en avertissement pendant 2 semaines, puis bloquants si la revue le confirme. S23 devient bloquante, et le gabarit admet les puces au bloc 0.
- *Preuve* : 8 textes réels, 1 417 → 970 mots (−32 %) ; aucune phrase de plus de 25 mots après réécriture ; test de conservation tenu sur les 8 (annexe).
- *Coût* : moyen × moyen.
- *Exclut* : rien ; les 9 blocs restent.

**O3 — O2 bloquant d'emblée.**
- *Exclut* : la stabilité des tours, car chaque refus affiche un rappel de 2 434 mots et une réécriture. Bloquer sans mesure préalable allongerait les tours, contre l'intention.

**O4 — Réécrire le gabarit de restitution en entier.**
- *Exclut* : la parole du porteur du 01/10 ; la structure actuelle lui sert à reprendre le contexte entre ses sessions.

## 5. Verdict

- **Option retenue** : O2.
- **Coût** : moyen × moyen ; 2 `CLAUDE.md` globaux, `ECRITURE.md`, `RESTITUTION.md`, `oracle-synthese.mjs` et ses tests.
- **Candidature(s) émise(s)** : aucune avant la décision ; une après.
- **Plan de revue** : le 2026-10-15, rejouer `grammaire-c.mjs` et `motifs.mjs`. Critères :
  - narration sous 8 % des phrases de statut ;
  - statuts en anglais sous 2 % ;
  - phrases de plus de 25 mots sous 25 % au verdict ;
  - identifiants non expliqués sous 40 % ;
  - ligne d'action à 30 mots au plus en médiane ;
  - pas plus de refus du juge par tour qu'aujourd'hui (23 pour 21 tours).
- **Test rétro** :
  - Opérationnel : 8 textes réels raccourcis de 32 % sans perte.
  - Tactique : 9 règles, relayées dans les 2 profils et jugées.
  - Stratégie : les règles d'écriture qui existent deviennent tenues.
  - Intention : chaque question est traitée. « Trop de texte » et « verbeux » par G1, G2, G7 et G9 ; « complexité » par G4 et G6 ; « termes trop techniques » par G3 et G6 ; « puces et sous-puces » par G5 ; « sans perdre les informations » par le test de conservation ; « pas un patch sur 3 sujets » par l'application à tout texte affiché.

## Question à l'humain

Adopter O2 ? Le choix est posé en décision dans la restitution du tour.

## Annexe — 8 textes réels réécrits

Le tableau se lit ligne par ligne : un texte réel, ses mots avant et après, ses phrases de plus de 25 mots et la place de son 1er fait. Le test de conservation (décisions, actions, chiffres avec source, chemins, réserves) est tenu sur les 8.

| Texte | Mots | Phrases > 25 mots | 1er fait (mots avant) |
|---|---|---|---|
| Statut | 19 → 15 | 0 → 0 | 3 → 0 |
| Problème | 31 → 26 | 0 → 0 | 5 → 4 |
| Bloc 2, verdict | 36 → 31 | 0 → 0 | 0 → 1 |
| Bloc 0, synthèse | 103 → 72 | 2 → 0 | 5 → 4 |
| Bloc 8, action | 55 → 29 | 1 → 0 | 1 → 1 |
| Chapitre L99 | 85 → 42 | 2 → 0 | 53 → 22 |
| Texte pour un tiers | 212 → 146 | 0 → 0 | 4 → 8 |
| Restitution entière (révision b) | 876 → 609 | non mesuré | non mesuré |

**Statut.**
- Avant : « Je lance les 6 agents du cycle 1 en parallèle : données, API, backend, adaptateurs, interface, et la revue graphique. »
- Après : « 6 agents du cycle 1 lancés en parallèle : données, API, backend, adaptateurs, interface, revue graphique. »

**Problème.**
- Avant : « Root cause of the S11 fail found: A-2's cell contains an unescaped `|` inside the `git … | grep` command, which breaks that row's table columns. I'll fix that, plus the other 6 items. »
- Après : « Cause du refus S11 (tableau mal formé) : la cellule de A-2 contient un `|` non échappé dans la commande `git … | grep`. 6 autres points restent à corriger. »

**Bloc 2, verdict.**
- Avant : « 8 polices embarquées sur 8 illisibles dans le PPTX `20260930d` (Inter Regular : 232 contours faux sur 235) ; PDF sain, 0 contour faux ; copie de travail réparée : contrôle passé de FAIL à PASS, 8 polices sur 8. »
- Après :
  - PPTX `20260930d` : 8 polices embarquées sur 8 illisibles (Inter Regular : 232 contours faux sur 235).
  - PDF : sain, 0 contour faux.
  - Copie de travail réparée : contrôle FAIL → PASS, 8 polices sur 8.

**Bloc 0, synthèse.**
- Avant : « Votre décision est exécutée : les 14 lots de retours qui attendaient au sas d'arrivée (la salle d'attente des lots) sont accueillis, pseudonymisés et versés au registre, soit 34 candidatures. Le sas est vide, et le contrôle d'ouverture qui échouait à chaque session peut repasser au vert. Pour qu'aucun nom réel n'entre en clair dans le dépôt, j'ai inscrit 2 produits à la table des pseudonymes avant l'accueil, et corrigé 4 lots à la réception, chacun annoté. L'inscription inexpliquée de ce matin est élucidée : le lot du produit concerné la décrit lui-même. Ce qui vous attend : 1 décision, choisir lesquelles des 34 candidatures traiter. »
- Après : « Votre décision est exécutée : 14 lots accueillis, pseudonymisés et versés au registre, soit 34 candidatures. »
  - Sas d'arrivée (salle d'attente des lots) vide ; le contrôle d'ouverture peut repasser au vert.
  - Aucun nom réel en clair : 2 produits inscrits à la table des pseudonymes avant l'accueil, 4 lots corrigés et annotés.
  - L'inscription inexpliquée de ce matin est élucidée par le lot du produit concerné.
  - Il vous reste 1 décision : lesquelles des 34 candidatures traiter.

**Bloc 8, action.**
- Avant : « Clore : lot de retours remis au pilot, journal fermé, synthèse finale en 8 blocs jugée par l'oracle de synthèse (neuve) | auto_ia | lot de retours au gabarit de la forge ; `oracle-lot.mjs`, `oracle-synthese.mjs` | `dependance_bloc_3` : attend D-1 ; à défaut, ce que le travail apprend ne remonte pas à la forge | simple × court »
- Après : « Clore le run : lot de retours, journal fermé, synthèse jugée (neuve) | auto_ia | `oracle-lot.mjs`, `oracle-synthese.mjs` | attend D-1 ; sinon rien ne remonte à la forge | simple × court »

**Chapitre L99** *(analyse de prompt en 8 couches)*.
- Avant : « La chaîne est la suivante : les textes sont verbeux, sous forme de paragraphes et complexes → la cause est un défaut d'écriture général → il faut une solution générale. Elle rompt sur la cause. La version a a mesuré qu'une partie de la longueur vient des règles du pilot elles-mêmes, par exemple le rappel de 25 mots au moins pour chaque décision, ou la phrase « Comment lire le tableau ». Une vraie solution doit pouvoir toucher ces règles, sans retirer de bloc. Le prompt ne le dit pas. »
- Après : « Rupture : le prompt attribue la longueur au seul style. »
  - Mesuré en version a : des règles du pilot imposent des mots (rappel de 25 mots par décision, « Comment lire le tableau »).
  - Donc la solution doit pouvoir assouplir ces règles, sans retirer de bloc.

**Texte pour un tiers** (courriel montré par le porteur le 01/10, pseudonymisé). Les 2 premiers paragraphes deviennent une liste ; les listes existantes sont resserrées.
- Avant : « C'est fait : « Edit policies » (Modifier les stratégies) est en Allow pour `<compte>` sur le dépôt `<dépôt>` depuis 8 h 34, sans aucun droit de contournement. Le droit est posé au niveau du dépôt : il couvre aussi master, et couvrira env/uat et env/prd quand elles existeront. La validation de construction posée sur env/dev à 9 h 04 est bien en place : `<pipeline>`, bloquante, sans relecteur obligatoire. C'est ce que prévoient GOUVERNANCE-BRANCHES.md et le guide du développeur. » (suivi de 2 listes, 212 mots en tout)
- Après : « C'est fait sur le dépôt `<dépôt>` : »
  - « Edit policies » (Modifier les stratégies) en Allow pour `<compte>` depuis 8 h 34, sans contournement ; posé au niveau du dépôt, il couvre master et couvrira env/uat et env/prd.
  - Validation de construction sur env/dev depuis 9 h 04 : `<pipeline>`, bloquante, sans relecteur obligatoire, comme le prévoient GOUVERNANCE-BRANCHES.md et le guide.

**Restitution entière.** C'est la restitution de la révision b, réécrite avec ses 9 blocs. Elle passe de 876 à 609 mots, et le juge de fin de tour y relève le même défaut mineur avant et après (S23, un identifiant dans un chemin). Les 2 textes sont conservés dans le répertoire temporaire de la session : `resti-b-avant.md`, `resti-b-apres.md`.
