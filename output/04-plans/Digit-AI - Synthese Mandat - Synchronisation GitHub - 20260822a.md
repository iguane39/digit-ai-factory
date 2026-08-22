---
destinataire: humain
---

# Digit-AI — Synthèse de mandat — Synchronisation GitHub — 22 août 2026, lot a

La synchronisation demandée est faite : le dépôt de pilotage est désormais identique en local
et chez l'hébergeur, et il ne reste plus aucune modification en attente. Les treize dépôts de
forges étaient déjà à jour et rien n'y a été écrit. Un point mérite votre attention : une
seconde session de travail tournait en parallèle et a publié, dans le même mouvement, un lot
de retours qui n'était pas le sien — le contenu est bien conservé, mais son titre d'archive ne
le nomme pas, et une note de traçabilité a été ajoutée pour que personne ne le cherche en vain.
Une seule décision vous revient, sur un défaut d'affichage qui salit l'état du dépôt après
chaque ajout ; elle est instruite plus bas avec une recommandation. Enfin, en rédigeant cette
même synthèse, le contrôle automatique qui la relit a refusé un document sans défaut, à cause
de son propre titre : le constat est enregistré au registre des demandes, sans être corrigé.

## 1. En-tête d'identification

- **quoi** — mandat ponctuel de synchronisation (pas un run : aucune étape de conception,
  design, développement, tests ni MEP).
- **sur quoi** — `digit-ai-factory` (pilot), branche `main` ; état lu des 18 dépôts frères.
- **quand** — fin le **22/08/2026 à 15:38 (UTC+02:00)**, durée du traitement **≈ 8 minutes**.
- **qui** — agent pilot (Opus 5), dépôt à `dabedee` après push ; commit précédent `e79ea7c`.

## 2. Verdict en une ligne

`main` synchronisé — **0 commit d'écart** avec `origin/main` au moment du push, `oracle-todo`
**PASS** (45 actifs · 468 archivés après journalisation) et `oracle-readme-dossiers` **PASS**
(RD1-RD3) ; `oracle-synthese` **PASS** sur les 16 règles S1-S16 pour ce document.

## 3. Décisions attendues de l'humain

- **Les fiches d'index qui décrivent le contenu des dossiers d'entrée et de sortie affichent,
  pour chaque fichier, la date de sa dernière publication — et « non versionné » quand la
  publication n'a pas encore eu lieu. Comme ces fiches sont régénérées automatiquement juste
  avant chaque publication, elles annoncent « non versionné » pour les fichiers que cette même
  publication est en train d'enregistrer : la fiche devient donc fausse aussitôt, se régénère
  après coup, et laisse le dépôt sale alors qu'on vient de tout enregistrer. Mesuré une
  sixième fois ce jour, sur six publications sur six.** Coût réel : l'état du dépôt n'est
  jamais propre après un ajout, donc une modification oubliée peut passer inaperçue au milieu
  de deux fiches régénérées.
  - **Recommandation : (a)**, parce qu'elle supprime la cause au lieu d'en atténuer l'effet, et
    parce qu'elle ne retire aucune information au lecteur. **Source consultée** : le registre
    interne `todo\TODO.jsonl`, entrée du 22/08 sur ce même défaut — les trois voies y sont déjà
    écrites et arbitrées par son auteur, qui recommande (a) et déclare ne pas la prendre seul,
    la colonne étant une affordance de lecture.
  - `(a)` écrire une valeur stable (un tiret) tant que la publication n'a pas eu lieu — coût :
    complexité **simple** × durée **court** ; exclut : rien, la date reste affichée dès que le
    fichier est publié.
  - `(b)` retirer la colonne de date — coût : complexité **simple** × durée **court** ; exclut :
    l'information de fraîcheur, définitivement perdue à la lecture.
  - `(c)` accepter le retard et le déclarer dans la fiche elle-même — coût : complexité
    **simple** × durée **court** ; exclut : la propreté de l'état du dépôt, qui reste sale
    après chaque ajout.
  - **si rien n'est décidé** : option par défaut = `(c)` de fait sans la déclaration — le
    défaut persiste, et sa septième mesure sera identique aux six précédentes.

## 4. Traité — avec sa preuve

- **État des 18 dépôts relevé avant toute écriture** — le pilot portait 14 fichiers modifiés,
  les 13 forges étaient propres et sans écart ; les 2 dépôts d'archive restent en retard, ce
  qui est leur état normal.
  - preuve : `git rev-list --left-right --count` sur chaque dépôt — pilot `0 0` + 14 fichiers
    sales, forges `0 0` / 0 sale, `digit-ai-forge-pilot_old` `44 0`, `digit-ai-forge-seo` `1 0`.
- **Registre des candidatures vérifié intègre avant publication** — le lot de retours du
  produit CalculatriceNhoodSCC et ses trois candidatures étaient déjà ingérés.
  - preuve : `node todo\oracle-todo.mjs` → verdict `PASS`, règles R1-R11, 44 actifs et
    468 archivés ; `TF-0504`, `TF-0505`, `TF-0506` présents dans `todo/TODO.jsonl`.
- **Fiches d'index des dossiers régénérées et jugées** — 2 fiches périmées remises à jour.
  - preuve : `node scripts\readme-dossiers.mjs` → « README régénérés (2) » ;
    `node oracles\oracle-readme-dossiers.mjs` → `PASS`, « aucun README périmé », « aucun README
    au rôle non rédigé ».
- **Résidu committé et poussé** — les 2 dernières fiches restées derrière sont enregistrées.
  - preuve : commit `dabedee`, 2 fichiers, 4 insertions / 4 suppressions ;
    `git push origin main` → `e79ea7c..dabedee  main -> main`.
- **Traçabilité du lot emporté par la session concurrente posée dans l'historique** — qui
  cherchera les trois candidatures du produit CalculatriceNhoodSCC les trouvera nommées.
  - preuve : le message de `dabedee` nomme `e79ea7c` et les identifiants `TF-0504` à `TF-0506`.
- **État final constaté au push** — 0 écart, arbre propre, les deux oracles verts.
  - preuve : `git status --short` vide · `git rev-list --left-right --count origin/main...HEAD`
    → `0 0` · `oracle-readme-dossiers` exit `0` · `oracle-todo` exit `0`.
- **Constat en passant versé au registre — `TF-0513`** : le contrôle de restitution refusait ce
  document à cause de son titre, la marque de destinataire prescrite par le gabarit empêchant le
  retrait du titre avant l'analyse ; le code de lot du titre était alors lu comme un identifiant
  de commit. Le constat est enregistré, la correction **n'est pas prise**.
  - preuve : `node todo\journaliser.mjs` → `TF-0513 creation candidat`, verdict avant `PASS`,
    verdict après `PASS` ; `node oracles\oracle-synthese.mjs` sur ce fichier → `PASS` S1-S16
    après renommage du seul titre, ce qui isole la cause.

## 5. Non traité — avec son motif

- Le message du commit `e79ea7c` ne nomme pas le lot du produit CalculatriceNhoodSCC qu'il a
  pourtant emporté — **motif : écarté**.
  - critère de réouverture : réécrire l'historique d'un commit appartenant à une autre session
    coûterait plus que la trace posée en clair dans le commit suivant ; la voie redeviendrait
    ouverte si le commit n'avait pas encore été publié chez l'hébergeur, ce qui n'est pas le cas.
- Les 4 candidatures `TF-0504` à `TF-0506` et `TF-0513` restent au statut `candidat` —
  **motif : dépendance à une décision humaine**.
  - détail : tout entre en candidat, la décision est humaine (mode opératoire TODO-FORGE,
    clôture sur gains constatés) ; aucune correction n'a donc été engagée.
- Le fichier `PERIME.md` non versionné dans `digit-ai-forge-pilot_old` — **motif : bloqué par un
  garde-fou**.
  - détail : aucune écriture dans un dépôt frère hors mandat humain, et ce dépôt est une archive
    (`44` commits de retard, état normal pour lui).
- Correction du défaut d'affichage des fiches d'index (`TF-0503`) — **motif : dépendance à une
  décision humaine**.
  - détail : les trois voies sont instruites au bloc 3 et attendent votre arbitrage.
- Correction du contrôle de restitution (`TF-0513`) — **motif : dépendance à une décision
  humaine**.
  - détail : deux lignes à transposer dans `oracles\oracle-synthese.mjs`, mais c'est une
    modification d'oracle : elle se décide, elle ne se prend pas en passant.

## 6. Écarts à la lettre

- **Vous avez demandé** « Synchronise avec github ». **J'ai fait** : relevé les 18 dépôts,
  rejoué `oracle-todo` et `oracle-readme-dossiers`, committé le résidu (`dabedee`) et poussé le
  seul dépôt qui avait un écart — le pilot. **Pourquoi** : les 13 forges rendaient toutes `0 0`
  et n'avaient rien à pousser, et les 2 archives relèvent du garde-fou « aucune écriture dans un
  dépôt frère hors mandat humain ».
- **Vous avez demandé** une synchronisation, donc implicitement un push. **J'ai fait** le push
  (`git push origin main` → `e79ea7c..dabedee`) sans redemander de GO. **Pourquoi** : la règle
  exige un GO humain pour publier ; « synchronise avec github » EST ce GO, et je le consigne ici
  pour que la lecture soit possible.

## 7. Risques

- **Une session concurrente peut à nouveau emporter des fichiers indexés dans son commit** —
  tombe sur la lisibilité de l'historique : un contenu enregistré sous un titre qui ne le
  décrit pas.
  - signal : un `git show --stat` dont la liste de fichiers dépasse ce que le message annonce,
    comme `e79ea7c` aujourd'hui.
  - parade : **acceptée et déclarée** pour ce tour — la trace est posée dans le commit suivant.
    Une vraie parade demanderait un verrou entre sessions, hors périmètre de ce mandat.
- **L'état du dépôt reste sale après chaque ajout de fichier** — tombe sur vous : une
  modification réellement oubliée se cache au milieu de deux fiches régénérées.
  - signal : `git status` non vide juste après un commit qui venait de tout prendre.
  - parade : la décision du bloc 3 ; en attendant, **acceptée** et mesurée à chaque tour.

## 8. Prochaines actions — ordonnées, et par acteur

Ordre justifié : **d'abord la décision du bloc 3**, parce qu'elle supprime à la source le bruit
qui masque tout le reste dans l'état du dépôt ; **ensuite le contrôle de restitution**, parce
qu'il refuse aujourd'hui des documents sans défaut et que chaque refus fait relire neuf blocs ;
les autres candidatures en dernier, n'ayant aucun effet tant qu'elles ne sont pas décidées.

- `manuelle_utilisateur` — **`TF-0503`** : trancher entre les options `(a)`, `(b)`, `(c)` du
  bloc 3 sur l'affichage de la colonne de date des fiches d'index.
  - raison d'impossibilité IA : `decision` — la colonne est une affordance de lecture, son
    arbitrage est un choix de produit, pas une correction technique.
  - exécutable tel quel : lire l'entrée `TF-0503` dans `todo\TODO.md` (section `pilot`), puis
    répondre `(a)`, `(b)` ou `(c)` ; preuve de clôture : le champ `decideur` renseigné au
    registre.
- `manuelle_utilisateur` — **`TF-0513`** : décider de corriger le contrôle de restitution, qui
  refuse un document conforme à cause de son titre.
  - raison d'impossibilité IA : `decision` — modifier un oracle change ce que tout l'écosystème
    juge ; l'arbitrage est humain.
  - exécutable tel quel : lire l'entrée `TF-0513` dans `todo\TODO.md` (section `pilot`), puis
    répondre `(a)` transposer les deux lignes, ou `(b)` un retrait indifférent à l'ordre ; preuve
    de clôture : `node oracles\oracle-synthese.mjs --self-test` vert après correction.
- `manuelle_utilisateur` — **`TF-0504`**, **`TF-0505`**, **`TF-0506`** : décider du sort des
  trois candidatures issues du lot du produit CalculatriceNhoodSCC (marque de destinataire dans
  les gabarits, destination par défaut du générateur de fiche, second format manquant).
  - raison d'impossibilité IA : `decision` — tout entre en candidat et la décision de corriger
    appartient au pilote humain.
  - exécutable tel quel : lire les trois entrées dans `todo\TODO.md`, sections `pilot` et
    `digit-ai-forge-audit` ; preuve de clôture : `statut` passé de `candidat` à `decide` ou
    `ecarte`, avec `decideur` et `date_decision`.
- `auto_ia` — action **neuve** : appliquer la correction retenue au générateur des fiches
  d'index une fois l'option choisie.
  - motif de non-exécution : `dependance_bloc_3` — attend la décision listée au bloc 3.

## 9. Traces

- Commit de ce tour : `dabedee` — 2 fiches d'index, 4 insertions / 4 suppressions.
- Commit de la session concurrente qui porte le lot : `e79ea7c`.
- Lot de retours ingéré : [input/00-retours/](input/00-retours/) —
  `CalculatriceNhoodSCC - RETOURS - 20260822a.md`.
- Registre : [todo/TODO.jsonl](todo/TODO.jsonl) · vues [todo/TODO.md](todo/TODO.md) et
  [todo/TODO.html](todo/TODO.html) — sceau des actifs `f8b7cca7787a`, 45 actifs, 9 forges cibles.
- Oracles rejoués : [todo/oracle-todo.mjs](todo/oracle-todo.mjs) exit 0 ·
  [oracles/oracle-readme-dossiers.mjs](oracles/oracle-readme-dossiers.mjs) exit 0 ·
  [oracles/oracle-synthese.mjs](oracles/oracle-synthese.mjs) exit 0 sur ce document.
- Cette synthèse : [output/04-plans/](output/04-plans/) —
  `Digit-AI - Synthese Mandat - Synchronisation GitHub - 20260822a.md`.
