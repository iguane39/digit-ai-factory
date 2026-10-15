---
destinataire: humain
---

# Synthèse Mandat — retours du 15/10 traités, 80 sujets corrigés, 6 forges publiées, pilot en attente de votre GO (15/10/2026)

## 0. Synthèse d'ouverture

Les retours remis aujourd'hui par 5 produits sont tous entrés au registre et presque tous traités. 4 lots que la porte refusait ont été réparés à la réception, et la cause de chaque refus a été corrigée au pilot. Les corrections sont publiées dans 6 forges. Celles du pilot attendent votre accord de publication, et les produits ne les recevront qu'après. 22 produits ont déjà reçu leur lot de travaux. 3 questions vous reviennent ci-dessous, la première en tête parce qu'elle conditionne la descente.

## 1. En-tête d'identification

Synthèse de clôture de la seconde campagne « Traite tous les TODOs & retours » du 15/10/2026. Elle porte sur le pilot digit-ai-factory, les forges design, agents, tests, development, ops et audit, et les produits de ce poste. Période : 15/10/2026 de 17:56 à 20:08, heure de Paris (UTC+02:00), soit 2 h 12. Session pilote Claude Opus 5.5 ; 7 agents Opus 5.5, relancés sur les restes qu'ils ont trouvés.

Intention de la demande : qu'aucun travail remonté par un produit ne reste sans traitement. Les retours entrent au registre, les défauts sont corrigés à la racine, et la correction atteint les produits.

Test rétro : le résultat sert cette intention et pas seulement sa lettre. Les restes trouvés en corrigeant ont été corrigés à leur tour, les causes des lots refusés ont été mesurées chez les produits puis corrigées, et chaque produit présent a reçu ses gestes de reprise. Seul reste ouvert ce qui dépend de vous ou d'un produit, et la publication du pilot, qui attend votre accord.

## 2. Verdict en une ligne

80 sujets corrigés et 2 écartés sur 91, 15 lots ingérés, 6 forges publiées à 0 commit d'écart, pilot en avance de 25 commits, 22 lots de travaux déposés ; recette complète du pilot : 0 sur 219 en défaut.

## 3. Décisions attendues

3 questions vous reviennent : une publication, puis 2 questions de doctrine nées de la campagne. Je les classe par coût du statu quo.

> **D-3 — Le pilot peut-il publier ses 25 enregistrements de la campagne ?**
>
> Les corrections du pilot sont enregistrées et vertes, mais le pilot refuse de les publier sans votre accord explicite. Les produits tirent le pilot publié à leur ouverture. Tant que rien n'est publié, ils ne reçoivent ni les hooks neufs, ni la fiche produit en 1.2.0, ni le contrôle de lot corrigé. Leurs lots de travaux déjà déposés citent pourtant ces corrections.
>
> **Recommandation : (a).** Source consultée : `references/TODO-FORGE.md` et `REGLES-PROJET.md` R-38, paragraphes 4 et 5, qui réservent la publication du pilot au porteur. La recette complète rend 0 oracle en défaut sur 219, et la fusion avec l'autre poste est enregistrée : `git rev-list --left-right --count HEAD...origin/main` rend 25 et 0.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Publier maintenant ; je lance `FORGE_PUSH_GO="D-3 (a) du 15/10" git push origin main` à votre réponse | Faible × court | Aucune contrainte connue : la porte de publication des noms juge l'envoi |
| (b) Attendre votre relecture des commits avant publication | Nul tant que la relecture dure | Les produits rouverts d'ici là travaillent sur l'ancien pilot |

> **Si rien n'est décidé** : (b), les 25 enregistrements restent sur ce poste.

> **D-4 — Le contrôle de remise d'un lot doit-il échouer quand il prédit que la porte du pilot le refusera ?**
>
> Aujourd'hui, 3 lots ont été refusés à la porte alors que le contrôle du produit rendait PASS. Pour l'un d'eux, il annonçait pourtant le refus dans un avertissement. Le contrôle le dit désormais sur sa ligne de verdict. Le faire échouer rend bloquant, chez tous les produits, un contrôle qui ne l'était pas.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md`, R-32 quater, qui fait de toute promotion d'un contrôle en blocage une décision humaine. Le blocage local ne bloque rien que la porte n'aurait refusé : il évite seulement l'aller-retour.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Échouer (exit 1) dès qu'un refus est prédit | Faible × court : une ligne et 13 cas de recette à réécrire | Aucune : la porte refuse déjà ces lots |
| (b) Garder l'avertissement et la ligne de verdict explicite, déjà en place | Nul | Un producteur pressé peut encore remettre sur un PASS |

> **Si rien n'est décidé** : (b), l'avertissement explicite reste en place.

> **D-5 — La règle d'organisation des dossiers doit-elle dire où écrit le programme d'une application ?**
>
> Chez un produit d'application web, les fichiers que le programme écrit en service ont atterri dans le dossier réservé aux livrables datés. Ce sont des factures déposées, des journaux et une base d'administration. La purge de conservation a dû recevoir une liste blanche pour ne pas effacer des mois de livrables. Préciser la règle change une règle décidée.
>
> **Recommandation : (a).** Source consultée : `REGLES-PROJET.md`, règle 2 (organisation des dossiers, D-06 et D-15). Le seul produit mesuré a payé 2 fois, et le contrôle d'héritage existant peut porter le motif d'exclusion.

| Option | Coût | Exclusions |
|---|---|---|
| (a) Préciser la règle 2 : le programme écrit dans un dossier `var\` ignoré par git ; motif ajouté au gitignore des produits et contrôlé par l'héritage | Faible × court : 3 fichiers | Un produit qui servait des fichiers depuis `output\` déplace sa racine |
| (b) Une mention dans le gabarit de consignes des produits, sans contrôle | Faible × court | La collision se découvre encore à l'audit |
| (c) Écarter, comme propre au produit | Nul | Chaque produit web refera la découverte |

> **Si rien n'est décidé** : (c), la règle reste inchangée et le sujet reste ouvert au registre.

## 4. Traité

- **Lots entrés au registre.** `accueillir-lot` rend « 30 lot(s) accueilli(s), 0 refusé(s) », et 15 lots donnent 76 candidatures.
  - 4 lots refusés à l'essai ont été réparés à la réception, avec une note en tête de chacun : un numéro de retour renuméroté, des familles de classe rattachées, des classes attribuées.
  - Un nom de personne réel a été retiré avant tout enregistrement. Le détecteur des noms le relève désormais : 10 cas sur 11 avant, 11 sur 11 après, 0 faux positif sur 786 lots (TF-1812).
- **Causes des refus mesurées chez les produits, puis corrigées au pilot.** Le contrôle d'un produit ne voyait pas les renumérotations faites par le pilot ; il les lit désormais (TF-1813). Un autre exemptait par sa date un lot que la porte juge, et ne le fait plus (TF-1814). Contrôle : la recette du contrôle de lot passe de 3 cas rouges sur chacun de ces 2 sujets à 90 cas verts sur 90.
- **80 sujets corrigés, chacun avec son contrôle rouge puis vert.**
  - Pilot, 32 sujets : hooks des produits et héritage (recette du hook d'ouverture 34 sur 34, contrôle de lot 90 sur 90), conformité et écriture (184 sur 184), fiche produit avec personas et usages (31 sur 31), contrôle des scripts de chaîne (27 sur 27).
  - Forge-design, 13 sujets : « Tout vert — 56 oracles ».
  - Forge-tests, 15 sujets : 1 517 tests verts, recette du corpus TENUE.
  - Socle des pages HTML, 8 sujets : 614 cas sur 614, version 1.31.0.
  - Forges development, ops et audit, 12 sujets : 480 tests, 201 cas et 13 étapes sur 13.
- **2 sujets écartés avec leur mesure.** Un titre refusé à bon droit par une règle décidée le 16/09, et un type de livrable déjà ajouté au registre de forge-organization.
- **Doctrine écrite pour les règles neuves, toutes en avertissement.** L'historique d'un livrable, le parcours en navigateur, les 2 contrôles de chaîne et le gabarit de restitution sont en 2.39.0. `oracle-coherence-restitution` rend PASS.
- **Référentiel des classes en 1.38.0.** 10 classes y sont créées, chacune avec le contrôle qui la joue. `oracle-todo` rend PASS après chacune des 11 écritures du registre.
- **Publication des forges.** Design, agents, tests, development, ops et audit sont envoyées. Après `git fetch`, `git rev-list --left-right --count HEAD...origin/main` rend 0 et 0 sur les 6.
- **Fusion avec l'autre poste.** L'autre poste avait publié 5 commits entre-temps, dont un numéro de sujet que ce poste avait aussi frappé. Le numéro local a été renuméroté avant l'union. Les registres sont unis par ajout, et `oracle-todo` rend PASS après la fusion (88620742).
- **Skills en service.** `oracle-skills` passe de FAIL à PASS après propagation.
- **Produits servis.** `emettre-travaux --tous` rend « 22 lot(s) déposé(s), 2 déjà présent(s), 0 refusé(s) avant dépôt ». 4 produits ont aussi un sujet de reprise qui nomme leurs gestes (TF-1822, TF-1823, TF-1824, TF-1826). Aucun commit n'a été fait chez un produit.
- **Recette complète finale.** 0 oracle en défaut sur 219, et 206 recettes vertes sur 206 jouent leur cas rouge. 2 recettes ont été accusées d'avoir écrit le registre pendant le passage : c'est la session qui l'écrivait. Rejouées seules, elles passent 29 sur 29 et 13 sur 13, et le registre reste inchangé (empreinte comparée).

## 5. Non traité

- **Publication du pilot.** Motif : dependance_bloc_3, elle attend la décision D-3.
- **Contrôle de remise bloquant (TF-1814).** Motif : il attend la décision D-4.
- **Organisation des dossiers d'un produit (TF-1750).** Motif : il attend la décision D-5.
- **Gestes de reprise d'un produit dont le dossier n'est pas retrouvé (TF-1825).** Motif : `emettre-travaux` rend « aucun produit du parc ne correspond », le même défaut de localisation que TF-1630. Les gestes restent écrits au registre.
- **2 restes signalés par les agents, inscrits candidats (TF-1820, TF-1821).** Motif : l'un touche la version des gabarits du kit d'audit, l'autre 2 fichiers encore recopiés chez les produits. Les 2 sont trouvés en fin de chantier et restent à instruire.
- **Décisions posées lors des sessions précédentes.** Motif : décision humaine, inchangée par cette campagne. Les sujets sont TF-0963, TF-1160, TF-1212, TF-1319, TF-1323, TF-1396, TF-1432, TF-1540, TF-1552 et TF-1584.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| Traiter tous les TODOs et retours | J'ai aussi inscrit puis corrigé 5 restes trouvés en corrigeant | Un reste laissé en candidat repousse le travail à la prochaine campagne |
| Le 02/10 : proposer de remonter aux produits la cause d'un lot refusé | La cause est écrite dans le lot de travaux de chaque produit concerné, sans attendre votre accord | La cause était au pilot, et la correction aussi ; le produit n'a qu'à lire la ligne de verdict |
| Traiter les retours | J'ai réparé 4 lots à la réception, dont un nom de personne retiré | La porte les refusait pour des défauts que le pilot corrige à l'accueil (R-49) |

## 7. Risques

- **7 règles neuves avertiront les produits.**
  - Énoncé : les produits verront de nouveaux avertissements à leur prochaine ouverture et à leur prochain lot.
  - Signal : le relevé d'héritage et les lots de retours suivants.
  - Parade : aucune ne bloque ; la bascule en bloquant reste une décision humaine après mesure du bruit.
- **Héritage 1.24.0 chez les produits.**
  - Énoncé : 9 hooks sont désormais exigés, et les produits non rouverts seront signalés incomplets.
  - Signal : le relevé d'héritage de leur prochaine ouverture.
  - Parade : l'ouverture ajoute elle-même les hooks manquants, et le relevé nomme chaque ajout.
- **Agents concurrents dans un même dépôt.**
  - Énoncé : 3 agents ont écrit dans le pilot en même temps.
  - Signal : un commit qui emporte le travail d'un autre agent.
  - Parade : chaque commit ne portait que ses chemins, et les agents l'ont vérifié 2 fois par un index temporaire.

## 8. Prochaines actions

La publication vient d'abord, parce que la descente vers les produits en dépend. Les 2 décisions de doctrine viennent ensuite, et le nettoyage en dernier, parce que rien n'en dépend.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Publier le pilot selon D-3 | auto_ia | dependance_bloc_3 : attend D-3 | `FORGE_PUSH_GO="D-3 (a) du 15/10" git push origin main` | Les produits ne reçoivent pas les corrections du pilot |
| **A-2** | TF-1814 | Appliquer la voie choisie en D-4 au contrôle de remise, puis clore | auto_ia | dependance_bloc_3 : attend D-4 | `node gabarits/oracle-lot-retours.test.mjs` | Un produit peut encore remettre un lot que la porte refusera |
| **A-3** | TF-1750 | Appliquer la voie choisie en D-5 à la règle d'organisation et à l'héritage | auto_ia | dependance_bloc_3 : attend D-5 | `node scripts/relever-heritage.mjs` | La collision reste à découvrir par chaque produit web |
| **A-4** | `neuve` | Trancher D-3, D-4 et D-5 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-3 (a), D-4 (a), D-5 (a)` | Les options par défaut s'appliquent |
| **A-5** | `neuve` | Effacer l'archive du correctif du 13/10, déjà appliqué | manuelle_utilisateur | irreversible | `Remove-Item "input\Digit-AI - Correctif Factory - Ouverture de session sous le delai client - 20261013b.zip"` | Un fichier non suivi reste dans l'état du dépôt |

## 9. Traces

- `todo/TODO.jsonl` et `todo/CLASSES.json` (1.38.0)
- `references/GARDE-FOUS-PLATEFORME.json` (1.2.0), `gabarits/HERITAGE.json` (1.24.0), `gabarits/RESTITUTION.md` (2.39.0)
- Pilot : de 2db05e1c à 88620742, enregistrés, en attente de publication
- Forge-design : bb4c4ac, 28ab71e, 08c7771, 324ff97 ; forge-agents : 4e77ee8, 66aa752 ; forge-tests : e2d389e, 557b203 ; forge-development : bec2b5f ; forge-ops : 5802cb2 ; forge-audit : 9060d3c, 490cfce ; tous publiés
- Lots déposés : `input\00-travaux\` chez 22 produits
