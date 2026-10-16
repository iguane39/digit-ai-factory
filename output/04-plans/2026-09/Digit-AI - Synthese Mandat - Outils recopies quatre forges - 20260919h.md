---
destinataire: humain
---

# Vos 2 décisions sont exécutées : les outils corrigés tournent sur ce poste, et les 4 forges sont publiées

## 0. Synthèse d'ouverture

Vous avez répondu « 1a, 2a », et les 2 gestes sont faits et prouvés. Les outils corrigés pendant
le mandat s'exécutent maintenant sur ce poste, et le contrôle qui était rouge depuis l'ouverture
est vert. Les 4 forges sont publiées, après le passage de la porte des noms de clients sur chacune,
et la forge d'audit est verte sur son runner Linux. Ce qui change pour vous : les pages produites
ici bénéficient dès maintenant des corrections, et les autres postes peuvent les recevoir. Une
précision que je vous dois : le vert sur Linux prouve moins que ce que j'annonçais, et je le dis
plus bas. Ce qui est attendu de vous : rien.

## 1. En-tête d'identification

- **quoi** — exécution des décisions D-1 (a) et D-2 (a) du mandat « Traite les todos et retours ».
- **sur quoi** — ce poste, pour la recopie des outils ; les dépôts `digit-ai-forge-agents`,
  `digit-ai-forge-data`, `digit-ai-forge-audit` et `digit-ai-forge-development`, pour la
  publication ; le pilot `digit-ai-factory`, pour le registre.
- **quand** — le 19/09/2026, de 18h14 à 18h23 (Europe/Paris).
- **qui** — session pilot Claude Fable 5.1 ; pilot passé de `28a9779` à `328f77d` ; aucun agent
  délégué, escalade de modèle : aucune.
- **intention** — que les corrections du mandat servent : sur ce poste d'abord, chez les autres
  ensuite, et que la dernière preuve manquante soit lue. **Test rétro** : ce qui s'exécute ici est
  ce qui est versionné, 4 dépôts sur 5 n'ont plus rien en attente, et la preuve sur Linux est lue
  et dite pour ce qu'elle vaut.

## 2. Verdict en une ligne

**2 décisions exécutées et prouvées** · `oracle-skills` de FAIL sur 9 écarts à **PASS** · harnais du
pilot de 124/125 à **125/125** · 4 forges publiées, **40 enregistrements**, porte des noms **PASS**
4 fois sur 4 · run hébergé `35454372211` **success** sur ses 3 jobs · TF-1020 clos, soit **33 todos
clos** depuis l'ouverture du mandat, 42 ouverts contre 45.

## 3. Décisions attendues de vous

Aucune décision n'est attendue : les 2 qui étaient posées sont exécutées.

**Bloquants à lever pour avancer** :

- **la publication du pilot `digit-ai-factory` est à l'arrêt**, avec 21 enregistrements locaux ; il
  faut que l'autre session, qui tient une trentaine de fichiers modifiés depuis le 17/09,
  enregistre son travail ; d'ici là le travail du pilot reste sur ce seul poste, conformément à
  l'option que vous avez retenue ;
- **3 écritures du pilot sont à l'arrêt**, pour la même raison : le journal d'amélioration, l'index
  des références et le registre des comptes de cas ; d'ici là ce mandat n'est pas au journal ;
- **la demande d'étude complémentaire sur les réseaux sociaux, TF-1178, est à l'arrêt** ; il faut
  qu'elle passe par une étude d'opportunité, son score dépassant le seuil ; d'ici là elle reste
  candidate, sans rien dégrader ;
- **les 9 todos dont la correction vit chez un produit sont à l'arrêt** (TF-0549, TF-0674, TF-0676,
  TF-0682, TF-1031, TF-1078, TF-1090, TF-1105, TF-1160) ; ils s'exécutent au prochain run ouvert
  chez chaque produit ; d'ici là ils restent ouverts, sans rien dégrader d'autre.

## 4. Traité — avec sa preuve

- **D-1 (a) — les outils du mandat sont recopiés vers ce poste.** `node oracles/oracle-skills.mjs
  --appliquer` a remis à niveau 8 skills et 1 hook : `digit-ai-page-html` (33 fichiers),
  `quality-oracles` (25), `digit-ai-communication` (5), `write-an-oracle` (3),
  `prompt-analyzer-l99` (2), `digit-ai-pptx`, `digit-ai-schemas` et `la-barre` (1 chacun), et le
  hook `qo-gate-write.mjs`.
  - preuve : `node oracles/oracle-skills.mjs` rendait **FAIL** sur 9 écarts avant le geste, 8 sur
    des skills et 1 sur un hook, et rend **PASS** après ; `node oracles/self-tests.mjs` passe de
    124/125 à **125/125**.
  - avant d'écraser, j'ai lu l'outil : il refuse de remplacer une copie installée plus récente que
    sa source, et il journalise chaque recopie. 5 des 8 skills portaient un écart antérieur à ce
    mandat ; la commande que vous avez choisie les remet tous à niveau, et je le dis ici.
- **D-2 (a) — les 4 forges sont publiées, la porte des noms jouée d'abord sur chacune.**
  - preuve, avant le push : `git status --porcelain` rendait 0 ligne dans les 4 dépôts, chacun en
    avance sans aucun retard sur son origine ; `oracle-nom-client-publie.mjs` a rendu **PASS** 4
    fois sur 4.
  - preuve, après : `git push origin main` exit 0 sur les 4 — `digit-ai-forge-development`
    `79eef0b..69fad77`, `digit-ai-forge-audit` `ff1549f..620cfb7`, `digit-ai-forge-data`
    `01980e1..a3e6e18`, `digit-ai-forge-agents` `1897ee8..50e9f0c` ; `git rev-list --count
    origin/main..HEAD` rend 0 partout.
- **TF-1020 est clos sur le run Linux, et ce vert prouve moins que ce que j'annonçais.** Le run
  hébergé `35454372211` rend success sur ses 3 jobs, dont `oracles (ubuntu-latest)`.
  - preuve : sur le runner Linux, « ok 40 - TF-1020 — la police résolue est la police EMBARQUÉE,
    pas celle du poste » et « ok 118 - les DEUX formats dans la même passe ».
  - ce que j'ai trouvé en relisant les journaux : le test des 2 formats était déjà vert sur Linux
    au run `35065959974` du 16/09, avant le correctif. L'échec « 2 pages » date du run
    `34581219111` du 11/09 et avait disparu entre-temps, 6 enregistrements du 14/09 ayant changé
    la fiche. Le passage du rouge au vert n'est donc pas dû à ce correctif.
  - ce que le correctif apporte quand même, et que le run prouve : le tirage ne dépend plus des
    polices du runner. Le vert du 16/09 tenait au contenu de la fiche ; il tient maintenant par
    construction. Classe : `controle-vrai-sur-le-mauvais-invariant`, évitée de justesse dans ma
    propre restitution.
- **Le registre est à jour et enregistré.**
  - preuve : `node todo/journaliser.mjs` a rendu « 1 événement(s) journalisé(s) » ; pilot à
    `328f77d` ; les 5 générateurs de vues exit 0 ; `node oracles/oracle-boite-entree.mjs` **PASS**,
    sas vide.

## 5. Non traité

- La publication du pilot : motif `garde_fou` — votre option (a) la fait attendre l'enregistrement
  de l'autre session.
- Le journal `BOUCLE-AMELIORATION.md`, l'index des références et `oracles/baseline-recettes.json` :
  motif `garde_fou` — ces fichiers portent le travail non enregistré de l'autre session.
- Les 9 todos dont la correction vit chez un produit : motif `garde_fou` — le pilot n'écrit chez un
  produit que sur run demandé.
- Les 6 constats neufs décidés, TF-1193 à TF-1197 et TF-1199, et les todos en cours plus anciens :
  motif `borne_atteinte` — ils partent à la prochaine campagne, aucun n'est bloqué.
- TF-1178 reste candidat : motif `garde_fou` — il demande une étude, son score dépasse le seuil.

## 6. Écarts à la lettre

- **Vous avez choisi** que le pilot recopie les outils corrigés. **J'ai fait** : la recopie de 8
  skills, dont 5 que ce mandat n'avait pas touchés. **Pourquoi** : la commande de l'option
  remet à niveau tout ce qui diverge, et ces 5 écarts étaient ceux que le harnais comptait déjà à
  l'ouverture ; les laisser aurait laissé le contrôle rouge.
- **J'avais écrit** que la publication de la forge d'audit donnerait « la preuve qui manque sur
  Linux ». **J'ai trouvé** que le test visé y était déjà vert 3 jours avant. **Pourquoi je le
  dis** : la clôture tient sur une autre preuve, plus étroite, et vous deviez le savoir.

## 7. Risques

- **Les sessions ouvertes en parallèle exécutent désormais les outils recopiés.**
  - signal : une page jugée verte hier et refusée aujourd'hui par le socle, sur l'une des 7 règles
    neuves ou durcies.
  - parade : chaque règle a été mesurée sans bruit sur les gabarits du parc avant d'entrer ; un
    refus neuf se remonte en lot de retours.
- **40 enregistrements publiés n'ont été relus par aucun humain.**
  - signal : un défaut découvert chez un autre poste après son prochain démarrage.
  - parade : chaque enregistrement a sa recette verte rejouée par le pilot, et la porte des noms
    est passée 4 fois ; c'est l'exclusion que l'option (a) nommait.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Lancer la prochaine campagne par dépôt : `digit-ai-forge-agents` (TF-1193, TF-1194, TF-1197), `digit-ai-forge-data` (TF-1195, TF-1196), pilot (TF-1199, TF-1170) | `auto_ia` | TF-1193 | `borne_atteinte` — ce tour exécutait vos 2 décisions, pas une vague de plus | la file cesse de baisser |
| **A-2** | Publier le pilot `digit-ai-factory`, après la porte des noms, puis journaliser le mandat et indexer la procédure de migration | `auto_ia` | TF-1179 | `garde_fou` — l'arbre du pilot porte le travail non enregistré d'une autre session | 21 enregistrements restent sur ce seul poste |
| **A-3** | Déposer chez le produit concerné le lot de travaux qui annonce les règles neuves sur les modèles et les rapports migrés | `auto_ia` | TF-1170 | `garde_fou` — le dépôt chez un produit exige un mandat déclaré sur ce produit | le produit découvre les règles par un FAIL |
| **A-4** | Faire enregistrer ou fermer l'autre session ouverte sur le pilot | `manuelle_utilisateur` | TF-1179 | `presence` — mesuré : `git status` du pilot liste une trentaine de fichiers indexés que cette session n'a pas écrits, inchangés depuis le 17/09 ; seule la session qui les tient, ou vous, sait s'ils sont finis | la publication du pilot et 3 écritures restent en attente |

## 9. Traces

- Fichier jugé : ce document — `oracle-synthese` PASS.
- Synthèse du mandat : `Digit-AI - Synthese Mandat - Todos et retours 32 clos sur preuve rejouee -
  20260919b.md`, dans `output/04-plans/`.
- `todo/TODO.jsonl` — 1 clôture ce tour, 33 depuis l'ouverture du mandat ; 42 ouverts, 372 clos.
- Runs hébergés de `digit-ai-forge-audit` lus : `35454372211` (19/09, success), `35065959974`
  (16/09, success), `34581219111` (11/09, failure).
- Publiés le 19/09/2026 : `digit-ai-forge-agents` à `50e9f0c`, `digit-ai-forge-data` à `a3e6e18`,
  `digit-ai-forge-audit` à `620cfb7`, `digit-ai-forge-development` à `69fad77`. Non poussé : le
  pilot, à `328f77d`.
