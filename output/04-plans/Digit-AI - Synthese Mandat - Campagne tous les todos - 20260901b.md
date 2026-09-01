---
destinataire: humain
---

# Synthèse de mandat — la liste tranchée en bloc, vingt-deux chantiers clos, tout publié (01/09/2026)

## 0. Synthèse d'ouverture

Votre mandat a tranché la liste : les trente-trois candidatures en attente sont passées en décidées d'un bloc, comme le 28/08, et la campagne a clos VINGT-DEUX chantiers — chacun avec sa correction, sa preuve et, partout où un contrôle existe, sa recette éprouvée par mutation. Deux fuites de secrets potentielles sont fermées à la source, trois voies mortes de l'outillage reprennent vie, la doctrine encaisse neuf leçons payées, et le socle de pages cesse de livrer ce que son propre juge refuse — sa règle neuve a d'ailleurs attrapé trois pages réelles dès son premier passage. Tout est poussé sur le dépôt distant, y compris la forge des skills, comme vous l'avez demandé en cours de route. Ce qui reste : vingt-deux items encore ouverts, dont dix-huit visent les forges sœurs ou des tours dédiés — ils sont nommés, avec leur raison, et rien n'est perdu.

## 1. En-tête d'identification

- **quoi** — mandat « ok, traite tous les todos de la liste » + ordre en cours de tour « pousse tout sur github » : décision en bloc, campagne de corrections, publication complète.
- **sur quoi** — le pilot `digit-ai-factory` et la forge des skills `digit-ai-forge-agents` (socle de pages) ; maquettes jetables pour les preuves.
- **quand** — fin le **01/09/2026 à 09:05 (UTC+02:00)**, durée **≈ 2 h 30**.
- **qui** — session pilot Claude Fable 5 ; pilot poussé jusqu'au commit de clôture, forge des skills poussée.

## 2. Verdict en une ligne

**33 candidats décidés en bloc** (mandat humain du 01/09, précédent du 28/08) · **22 items clos et archivés** avec preuves · banc pilot **81/81** (80 au matin) · self-test du socle de pages **127/127** (125) · **deux poussées** : pilot + forge des skills · **22 items restent ouverts**, tous nommés au bloc 8 avec leur voie.

## 3. Décisions attendues

Rien de **neuf** n'attend une décision : le mandat du jour ÉTAIT la décision, et elle est exécutée. Les cinq décisions des tours précédents restent ouvertes (la demande d'étude à la porte, les lots de travaux, le contrôle d'écriture du poste, les deux constats du banc d'avant-hier) — rappelées au bloc 8 avec leurs numéros. **Si rien n'est décidé** : leurs replis continuent de s'appliquer, et les portes concernées restent fermées.

## 4. Traité — avec sa preuve

- **La décision en bloc** : 33 candidatures passées en décidées, décideur et date tracés (R6).
  - preuve : 33 événements journalisés, registre PASS.
- **Deux fuites de secrets fermées à la source** (les deux scores 25 de la liste) : la négation `!forge/**` du socle gitignore ne rouvre plus les secrets rangés sous forge (re-exclusions au gabarit + contrat + un contrôle qui juge l'EFFET par `git ls-files`), et `.env.example` — que la règle du socle exige versionné — n'est plus ignoré par le gitignore du même socle (les deux graphies ré-incluses + un contrôle qui juge le SUIVI git).
  - preuve : maquettes git réelles dans les deux sens (secret suivi → FAIL nommé ; remède → PASS ; exemple ignoré → FAIL ; ré-inclus → PASS) ; fixture verte du banc DÉRIVÉE du contrat après s'être périmée aujourd'hui même — la classe « liste recopiée » payée et fermée dans le même geste.
- **La divergence d'héritage dit QUI a bougé** : la copie d'un produit est confrontée à l'historique git du pilot — « le PILOT a avancé depuis la version du \<date\>, aucune faute côté produit » ou « modifiée côté produit, ne pas écraser sans lire » — et un geste unique de remise à niveau existe ([recopier-heritage.mjs](scripts/recopier-heritage.mjs), exécuté PAR le produit, gardes comprises).
  - preuve : recettes 19/19 et 6/6 neuves ; sur le parc réel, le produit au gabarit divergent lit désormais « votre copie correspond à la version publiée le 2026-08-24 — le PILOT a avancé ».
- **Le gabarit des lots voyage sous un nom qui dit ce qu'il est** (GABARIT-LOT-RETOURS.md), l'ancien nom restant un alias accepté : aucun produit ne bascule en défaut le jour de la publication.
  - preuve : deux cas de recette (alias conforme → conforme ; alias périmé → divergent).
- **L'histoire d'un ledger se rectifie par AJOUT** : un run d'ouverture sans versions de forges — irréparable sans réécrire — se couvre par un événement de rectification déclaré, imprimé au verdict.
  - preuve : maquette dans les deux sens, le message d'échec portant le format exact du remède.
- **Trois voies mortes reprennent vie** : un produit à héritage conforme reçoit ses constats décidés (recette 31/31, mutation 30/31) ; la racine déclarée par un sidecar est enfin LUE (recette 10/10, mutation 8/10) ; le compteur du cliquet ne lit plus une date comme un compte de cas (recette 14/14, mutation 13/14, baseline réelle remontée 1 → 6).
- **Le socle de pages cesse de livrer ce que son juge refuse** (forge des skills) : la coupure de mots quitte les cellules de prose (réservée au repli en cartes et à une classe explicite), le passage de lecture dit qu'il n'est pas une enveloppe de chapitre, le niveau 4 de titre existe — et la garde `[hidden]` entre au squelette avec sa règle L23 : une page qui masque par attribut sans la garde est refusée.
  - preuve : self-test du socle **127/127** ; L23 a attrapé TROIS fixtures réelles du socle à son premier passage, puis la page du registre du pilot elle-même — quatre pages réelles corrigées avant publication.
- **La doctrine encaisse neuf leçons payées** : le mode d'emploi Railway (jeton, API, domaine nommé, deux pièges — quatre faits payés), le caviardage des journaux d'oracle sur données personnelles, et quatre classes au référentiel de non-répétition (périmètre des conclusions, statut des valeurs, formule d'invocation, porte discrète) — les mécanismes absents DÉCLARÉS dans la colonne prévue.
- **Publication complète** : pilot (commits `0715add`, `c211876`, `6220b99` + clôture) et forge des skills poussés ; skills du poste réalignés sur la forge (la copie installée est celle qui s'exécute).
  - preuve : banc pilot **81/81** après tout ; arbre de travail vide après le commit de clôture.

## 5. Non traité — avec son motif

- **Les items visant forge-audit** (le kit fiche-sécurité : PDF prescrit et outillé, vérificateur, colonne 32 %, allocateur importé) : *écarté pour ce tour, critère de réouverture écrit* — éditer un kit de conformité client non étudié dans l'heure qui précède une publication aurait troqué la qualité contre le compte ; c'est le premier lot du tour dédié aux forges, et les correctifs sont écrits dans les items.
- **Les items visant forge-design** (grille « typé, proposé, borné », choix exclusif avant les champs, badge acte, glose M18, motifs d'écrans de création) et **forge-tests** (croisement statique/dynamique, contrôle des nombres orphelins) : *hors mandat de ce tour* — même tour dédié.
- **Les items visant les skills de jugement** (quatre trous de quality-oracles et experts-forge) : *hors mandat de ce tour* — modifier des juges exige d'étudier leurs fixtures d'admission, tour dédié.
- **La demande d'étude stratégie de tests** : *dépendance à une décision humaine* — c'est une étude à mener (bornes, corpus produit), pas un correctif ; elle mérite son mandat propre.
- **Le contrôle d'écriture du poste** (D-33) : *dépendance à une décision humaine* — configuration de votre profil, blast radius sur tous vos projets ; il a d'ailleurs bloqué quatre fois ce tour sur des défauts préexistants aux fichiers touchés.
- **Le produit réapparu sans dépôt git** : *bloqué par un garde-fou* — « pas d'implémentation dans les produits » (24/08) tient ; le run produit à mandater est au bloc 8.
- **Les trois constats émis vers le produit de gîtes** : ils vivent dans sa boîte d'entrée depuis hier, la clôture attend son retour.

## 6. Écarts à la lettre

- **vous avez demandé** « traite tous les todos de la liste » → **22 clos sur 44, 33 décidés sur 33, 22 restent ouverts** → **pourquoi** : tout ce qui se traitait dans le pilot et au socle des pages avec preuve à l'appui l'a été ; le reste exige soit des dépôts que je n'ai pas étudiés assez pour y écrire à la hâte (kit de conformité, juges), soit une étude, soit votre décision — chaque restant est nommé avec sa voie, aucun n'est tu.
- **votre ordre en cours de tour « pousse tout sur github »** → **exécuté sur les deux dépôts modifiés, après consolidation (banc au vert, registre archivé, vues régénérées)** → **pourquoi la consolidation d'abord** : pousser un banc rouge aurait publié un état que le dépôt lui-même refuse.
- **le mandat global a valu décision pour l'item aux deux issues** (les six recettes) : l'issue recommandée hier (déclarer l'historique non mesuré) a été appliquée — si vous vouliez l'autre, dites-le, rien n'est irréversible.
- Aucun autre écart.

## 7. Risques

- **Les produits du parc verront de NOUVEAUX avertissements d'héritage** (motifs gitignore neufs, gabarit renommé) — signal : R-47 (le contrôle d'héritage du socle) plus bavard à la prochaine remise de lot ; parade : c'est le mécanisme voulu, et le geste unique de remise à niveau est nommé dans chaque message.
- **Le tour forges reste entier** (12 items) — signal : le registre ne descend plus tant qu'il n'est pas mené ; parade : action 1 du bloc 8, tout est spécifié dans les items.
- **La règle L23 du socle refusera les pages existantes du parc qui masquent par attribut sans garde** — signal : un FAIL L23 sur une page jusque-là verte ; parade : le remède est une ligne, nommée dans le message, et quatre pages réelles ont déjà été corrigées ainsi.

## 8. Prochaines actions

**Comment lire ce tableau** : une ligne par action, l'acteur dit qui peut la faire, le motif pourquoi elle n'est pas déjà faite, la dernière colonne ce que coûte l'attente. **Ordre** : le tour forges d'abord — il porte douze items déjà décidés et spécifiés ; les décisions ensuite, par coût d'attente.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Mener le tour dédié aux forges sœurs : forge-audit (4 items du kit fiche-sécurité, correctifs écrits), forge-design (5 items), forge-tests (2 items), skills de jugement (4 items), et la moitié exécutable du voile (contrôle au rendu). | `auto_ia` | `hors_mandat` — du ressort de l'IA, sur un mandat dédié : chaque dépôt exige l'étude de ses conventions avant d'y écrire, et le faire dans l'heure d'une publication aurait sacrifié la qualité. | Douze items décidés vieillissent, et le kit de conformité continue de diffuser un PDF que rien ne prescrit ni ne contrôle. |
| 2 | `neuve` | Mandater l'étude « stratégie de tests et temps de campagne » (l'item porte les données : 67 min dont 54 de mutation, axes et garde-fou de non-perte). | `manuelle_utilisateur` puis `auto_ia` | `decision` puis `dependance_bloc_3` — une étude se mandate, elle ne se glisse pas dans une campagne. | Chaque campagne de chaque produit continue de payer le coût mesuré. |
| 3 | `neuve` | Trancher les décisions ouvertes : D-30 (étude refusée à la porte), D-31 (lots de travaux), D-32 si l'issue appliquée ne convient pas, D-33 (contrôle d'écriture du poste), D-29 (deux constats du banc). | `manuelle_utilisateur` | `decision` — arbitrages posés aux synthèses des 31/08 et 01/09 matin, tableaux d'options inclus. | Les replis s'appliquent : portes fermées, péage du contrôle d'écriture à chaque édition de modèle. |
| 4 | TF-0549 | Mandater un run produit sur le site vitrine réapparu : dépôt git avec exclusions AVANT tout commit, consignes, artefacts hérités, conformité rejouée. | `auto_ia` | `hors_mandat` — exécutable par une session produit sur votre mandat ; le pilot n'implémente pas chez les produits (24/08). Remesuré hier soir : toujours aucun dépôt git. | Tout travail y reste sans historique ni sauvegarde. |
| 5 | `neuve` | Faire tourner les 2 jetons d'hébergeur et les 4 secrets relevés il y a quatre jours. | `manuelle_utilisateur` | `acces` — consoles des fournisseurs ; trace mesurée : lecture limitée à la longueur des valeurs (36 caractères), aucune authentification tentée. | Des identifiants de déploiement restent lisibles sur le disque. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Campagne tous les todos - 20260901b.md`
- Pilot : commits `0715add` (conformité et secrets) · `c211876` (trois voies mortes) · `6220b99` (doctrine) · + clôture — poussés
- Forge des skills : commit du socle (garde `[hidden]` + L23 + squelette TF-0724) — poussé
- Registre : [TODO.jsonl](todo/TODO.jsonl) — 33 décisions, 22 clôtures, 22 archivés, **22 actifs** ; vues sceau `ad2b1ab68399`
- Bancs : pilot `oracles\self-tests.mjs` **81/81** · socle `self_test.py` **127/127** · `oracle-todo` PASS · boîte PASS
- Preuves par mutation jouées ce tour : émetteur 30/31→31/31 · ingesteur R-47 8/10→10/10 · cliquet 13/14→14/14 (chaque fois sur exactement le cas visé)
