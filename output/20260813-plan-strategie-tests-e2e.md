# Plan de mise en œuvre — stratégie de tests de bout en bout, complète et autonome-sous-gates

**Mandat humain du 13/08/2026** (prompt barré L99) — motivé par l'insatisfaction sur un run réel
(BourseAuxVacants2 : « la plupart des pans ne sont même pas construits, encore moins exécutés »).
**Livrable = ce plan** (document), pas l'implémentation. Il **redéfinit la mission de forge-tests**
(aujourd'hui elle *audite* des suites, ne les écrit pas — CDC §4.4) : R-28 s'applique, la décision
reste humaine, et la feuille de route (§8) est une liste de **candidatures**. Aucune écriture dans
forge-tests ni forge-development.

---

## 1. Diagnostic Produit-11 (sur pièces — `forge/rapport-tests.json` du 11/08, verdict PARTIEL)

Le run n'est pas « cassé » : il **constate correctement** l'état et fournit le `pour_couvrir` de
chaque pan. Ce qui manque, c'est **l'exécution de ces recettes**. Cause **par pan** :

| Pan | État réel | Cause racine (classe) |
|---|---|---|
| interface | 6/6 exercés (1.0) | ✅ seul pan couvert — mais sur un **HTML de reporting**, pas l'app |
| qualif | 2/4 (0.5 < 1.0) | suite incomplète : `form` et route `/` non exercés |
| **front** | 4 routes inventoriées, **non mesurable** | **environnement** : `frontend/node_modules` absent, suite Playwright non verte |
| **api** | **inventaire VIDE** | **contrat projet** : app ASGI non déclarée (`FORGE_TESTS_APP` absent de `.env.forge-tests`) |
| **data / migrations** | non mesurable | **surface** : aucune instruction SQL observée (ni SQLAlchemy ni sqlite3 pendant la suite) |
| **batch** | 0 branche inventoriée | **surface** : aucun module `batch`/`traitement` exposé, suite non jouée sous sonde |
| **fichiers** | indisponible | **surface + environnement** : pas de module `import`/`parse`, ou suite rouge |
| **visuel** | non mesurable | **environnement** : front non servi (pas de capture) ; + acceptation golden = humaine |
| mutation back | **0,1132** (6/53 tués, seuil 0,70) | **suite du projet faible** : 84 actions, majorité `auto_ia` (renforcer la suite) |

**Trois familles de cause, aucune n'est un bug de forge-tests** : (a) **environnement non préparé**
(deps non installées, front non servi) ; (b) **contrat projet non renseigné** (app ASGI, marqueurs
de migrations, emplacements attendus) ; (c) **surface réellement absente ou faible** (pas de batch,
suite de mutation à 11 %). forge-tests **nomme** tout cela ; il ne le **corrige** pas. Le plan comble
ce saut — sans jamais confondre *auditer* et *construire*.

---

## 2. Cadre non négociable (les lois que le plan intègre, jamais ne contourne)

- **Trois acteurs, trois rôles.** forge-**tests** audite, génère des cas *en proposition*, exécute,
  mesure (jamais d'écriture dans le projet — **G-1 lecture seule**). forge-**development** écrit le
  code produit en remédiation, **sous run, double gate**. Le **pilot** orchestre la boucle. Chaque
  geste du plan porte son acteur.
- **« Tout vert en autonomie » est banni.** Remplacé partout par **autonomie sous gates, bornée, à
  état terminal mesuré** : boucle ≤ N cycles (défaut 3, **G-2 absolue**) ; au-delà, on **livre l'état
  avec les écarts résiduels classés** (IA / development / décision humaine). Jamais une boucle infinie
  ni un vert forcé.
- **« Aucun ✓ sans oracle exécuté ».** Un test vert est un vrai test qui passe, prouvé par
  **couverture de surface ET score de mutation** (anti-tests-fantômes) — pas un `skip`, pas une
  assertion vide, pas un seuil abaissé.
- **Un test ROUGE qui trouve un vrai bug est un SUCCÈS de l'audit**, pas un échec du plan : il devient
  une action de remédiation classée, jamais un motif de tricher.
- **La qualité est mesurée, pas proclamée** : la sortie est un triplet chiffré + K écarts classés,
  pas « c'est vert ».

---

## 3. Les trois mesures distinctes (à ne jamais confondre)

Le mot « couvert » recouvre trois choses que le plan sépare, chacune avec son oracle :

1. **COUVERTURE** = part de la **surface énumérée** réellement exercée (par pan). Oracle : couverture
   de surface de forge-tests (déjà en place). Cible : 100 % de la surface *pertinente*.
2. **PASSAGE** = part des **cas adoptés** qui sont **verts**. Oracle : exécution réelle de la suite.
   Cible : 100 % des cas adoptés.
3. **FORCE** = **score de mutation** (les tests détectent-ils un changement de comportement ?). Oracle :
   pan mutation. Cible : ≥ seuil (0,70 back par défaut). *C'est cette mesure qui a démasqué Produit-11 (0,11).*

Un pan **non pertinent** est un **verdict `SANS_OBJET` motivé** (ex. pas de couche SQL → data sans
objet), jamais un trou silencieux. « Tous les pans pertinents » = *dérivés de la surface réelle*.

---

## 4. Les huit phases (objectif · acteur · livrable · oracle · critère d'arrêt binaire)

### Phase 0 — Préparer l'environnement d'audit (le trou n° 1 de Produit-11)
- **Objectif** : rendre le projet *mesurable* — installer les dépendances (`frontend/node_modules`,
  `.venv` back), servir le front sur un **port dédié** (cf. TF-0137), renseigner le **contrat projet**
  (`.env.forge-tests` : `FORGE_TESTS_APP=module:attribut`, base URL, emplacements attendus).
- **Acteur** : pilot (orchestration) + forge-ops (service/port) ; **jamais forge-tests** (lecture seule).
- **Livrable** : un `contrat-audit.json` du projet (app, ports, deps, emplacements) + environnement prêt.
- **Oracle** : healthcheck (front servi répond, back importable, deps présentes).
- **Arrêt** : environnement prêt OU liste précise de ce qui manque et **qui doit le fournir** (ex. un
  secret, une instance) — `bloque_question` si humain requis.

### Phase 1 — Analyser l'existant & fixer la cible de couverture
- **Objectif** : énumérer la surface **par pan** ; classer chaque pan *pertinent* / `SANS_OBJET` motivé ;
  poser la **cible chiffrée** (couverture 100 % surface pertinente · passage 100 % cas adoptés ·
  mutation ≥ seuil).
- **Acteur** : forge-tests (audit, mode inventaire).
- **Livrable** : cartographie de surface + tableau cible par pan.
- **Oracle** : le rapport d'inventaire (surface énumérée depuis le code, pas supposée — cf. correctifs
  TF-0097/0100/0135 de cette semaine : lire la config réelle, pas une arborescence en dur).
- **Arrêt** : chaque pan a un statut (pertinent+cible OU `SANS_OBJET`+motif).

### Phase 2 — Construire / compléter la stratégie (générer les cas manquants)
- **Objectif** : pour chaque élément de surface non exercé, **générer un cas de test** couvrant le
  besoin (nominal + limite + rejet).
- **Acteur** : forge-tests (`--generer`, **en PROPOSITION hors projet — G-1**).
- **Livrable** : cas générés + `non-generables.json` (ce qui exige un humain, avec raison).
- **Oracle** : chaque cas généré est **exécutable** (compile/collecte) — un cas qui ne tourne pas n'est
  pas un cas.
- **Arrêt** : surface pertinente couverte par des cas OU `non-generables` motivés.
- **Adoption** : l'insertion des cas dans le projet est une **remédiation produit** (phase 6, acteur
  development sous run) — jamais forge-tests qui écrit dans le projet.

### Phase 3 — Construire la volumétrie de données
- **Objectif** : des données **suffisantes** = *chaque cas a les siennes* (pas « beaucoup »).
- **Acteur** : forge-tests (générateur de données).
- **Livrable** : jeu de données **seedé** (rejouable à l'identique), **synthétique** (jamais de donnée
  réelle), **persisté hors projet** (G-1), **complétable**.
- **Oracle** : déterminisme (même seed → même jeu) + anonymat (grep zéro donnée réelle) + suffisance
  (chaque cas trouve ses données).
- **Arrêt** : tout cas adopté a un jeu déterministe associé.

### Phase 4 — Exécuter tous les cas & produire le rapport exhaustif
- **Objectif** : exécuter la suite complète ; produire le **rapport test-par-test**.
- **Acteur** : forge-tests (exécution réelle sous couverture ET mutation).
- **Livrable** : rapport où **chaque test** porte son verdict **PASSANT / NON-PASSANT / NON-EXÉCUTÉ**
  (+ **POURQUOI** pour les deux derniers) + le détail + le triplet **couverture / passage / mutation**
  chiffré par pan.
- **Oracle** : « aucun ✓ sans oracle » — un vert non couvert ou de mutation nulle est signalé.
- **Arrêt** : rapport complet, aucun test sans verdict motivé.

### Phase 5 — Plan d'action de remédiation (classé par acteur)
- **Objectif** : transformer chaque non-passant / non-exécuté en **action** exécutable.
- **Acteur** : forge-tests (production du plan) ; classement **R-29** :
  - **IA** : renforcer un test faible, tuer un mutant survivant, compléter un cas (côté suite) ;
  - **development** : écrire/corriger le **code produit** (route manquante, bug réel, module batch) —
    **sous run de version, double gate** ;
  - **humain** : trancher un vrai bug métier, accepter un golden visuel, renoncer à couvrir un pan.
- **Livrable** : `actions[]` priorisées (le format existe déjà), chacune avec acteur + attendu.
- **Oracle** : chaque non-passant/non-exécuté a **exactement une** action classée.
- **Arrêt** : zéro finding orphelin.

### Phase 6 — Boucle bornée remédiation ↔ réexécution
- **Objectif** : corriger puis réexécuter, **≤ N cycles** (défaut 3, G-2).
- **Acteur** : pilot (orchestre) → forge-tests (réaudit `--reprendre`, ne rejoue que le non-vert) +
  forge-development (remédie le produit sous run pour les actions `development`).
- **Livrable** : à chaque cycle, un rapport de tendance (`--precedent`) montrant la progression du
  triplet.
- **Oracle** : G-2 absolue — **jamais** assouplir un seuil, neutraliser un test ou marquer `skip` pour
  « faire vert » ; la mutation garde les tests honnêtes.
- **Arrêt (état terminal, cœur du plan)** : **soit** cible atteinte (couverture/passage/mutation aux
  seuils, 0 écart) ; **soit** N cycles épuisés → **on livre l'état mesuré avec les K écarts résiduels
  classés** (IA / development / humain). **Jamais « on boucle jusqu'au vert »** : un vrai bug produit,
  un pan inconstructible ou un cas non déterministe ne convergent pas, et le mensonge de la boucle
  infinie est pire que l'écart déclaré.

### Phase 7 — Autonomie & frontière de la décision humaine
- **La boucle fait seule** : préparer l'environnement, énumérer, générer cas + données, exécuter,
  renforcer un test faible / tuer un mutant (action IA), réexécuter, mesurer.
- **Exige un GO humain** : un vrai bug métier à trancher, l'acceptation d'un golden visuel (« ce
  changement est-il voulu ? »), le renoncement motivé à un pan, et **toute mise en production**
  (domaine MEP, jamais dans la boucle de tests).
- **Livrable** : à la fin, une **liste courte de ce qui attend l'humain** — c'est *elle* qui donne la
  confiance, pas un « tout vert ».

### Phase 8 — Feuille de route d'implémentation (candidatures R-28)
Ce qui **existe déjà** et se réutilise : `--generer` (cas en proposition), `--livrables` (cahiers,
jeu de données, dashboard), pan **mutation** (anti-triche), **registre-dette**, `--precedent`/
`--reprendre` (tendance/reprise ciblée), les correctifs de détection de surface de cette semaine
(TF-0097/0098/0099/0100/0122/0135/0136/0138). Ce qui est **nouveau** (chaque item = une candidature
avec verdict de non-recouvrement — voir sidecar) :
1. **Harnais de préparation d'environnement** (phase 0) — installer deps, servir front (port dédié),
   renseigner le contrat projet. *Non couvert* : forge-tests suppose l'environnement prêt aujourd'hui.
2. **Générateur de cas EXÉCUTABLES par pan** (phase 2) — au-delà de la proposition actuelle, des cas
   qui compilent/collectent, nominal+limite+rejet. *Étend* `--generer`.
3. **Générateur de volumétrie seedé/synthétique/par-cas** (phase 3). *Étend* le jeu de données actuel.
4. **Orchestrateur de boucle de remédiation** (phases 5-6), porté par le **pilot**, appelant tests
   (audit/exécution) et development (remédiation produit), borné, à état terminal classé. *Non couvert* :
   arbitre le recouvrement development/tests que l'INVENTAIRE signale déjà comme non tranché.
5. **Rapport exhaustif test-par-test** (phase 4) — verdict + pourquoi pour chaque test. *Étend* le
   rapport actuel (agrégé par pan aujourd'hui).

---

## 5. Ce que l'utilisateur obtient, au bout du run autonome (la vraie attente : la confiance)

Un rapport qui, pour Produit-11 comme pour tout projet :
- **liste chaque test** avec son verdict (passant / non-passant / non-exécuté + pourquoi) ;
- donne la **couverture, le passage et la mutation chiffrés** par pan, avec la cible ;
- fournit un **plan d'action priorisé et classé** (IA / development / humain) ;
- se termine par la **liste courte de ce qui exige *sa* décision** (les bugs produits, les pans qu'on
  renonce à couvrir) — jamais un « tout vert » indifférencié.

C'est la définition opérable de « résultat de qualité et de confiance » : **mesuré, exhaustif,
honnête sur ce qui reste** — pas proclamé.

---

## Annexe — traçabilité
Diagnostic ancré sur `BourseAuxVacants2/Produit-11/forge/rapport-tests.json` (verdict PARTIEL,
mutation back 0,1132, 8 pans non couverts avec leur `pour_couvrir`). Cadre : CDC §4.4 (frontière
actuelle), CONTRAT-INTERFACE §5 (dettes D-T*), REGLES-PROJET (G-1, G-2, R-28, R-29). Aucune écriture
hors pilot (`git status` des forges inchangé). Feuille de route → 5 candidatures TODO-FORGE.
