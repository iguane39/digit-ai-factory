---
destinataire: humain
---

# Vos trois décisions sont exécutées, et la question que vous n'avez pas pu lire est reposée

## 0. Synthèse d'ouverture

Vous avez tranché trois points et signalé qu'un quatrième était illisible. Les trois sont
exécutés et prouvés. Le quatrième est reposé en nommant la chose dont il parle, et le défaut qui
l'avait rendu flou a maintenant un contrôle qui le refuse : une décision qui ne nomme pas son
sujet est désormais rejetée avant d'arriver sous vos yeux. Ce qui change pour vous : le tableau
d'options ne porte plus la tournure que vous aviez proscrite, une famille de défaut ne peut plus
être déclarée close sans que rien ne la joue, et l'ancienne forme d'exemption de recouvrement a
une date de fin. Ce qui est attendu de vous : une seule réponse, sur le statut du dépôt qui porte
votre communication — est-ce votre marque, ou un client dont le nom doit être masqué ?

## 1. En-tête d'identification

- **quoi** — mandat transverse « Traite tous les todos & les retours », puis exécution des
  décisions D-2 (a), D-3 (c) et D-4 (b).
- **sur quoi** — le pilot `digit-ai-factory` ; écritures mandatées chez `digit-ai-forge-data`,
  `digit-ai-forge-design` et `digit-ai-forge-agents` (commits locaux, aucun push).
- **quand** — le 16/09/2026, de 14h10 à 19h30 (Europe/Paris), durée 5 h 20.
- **qui** — session pilot Claude Opus 5 ; dépôt passé de `b485ca3` à `caac307` ; 4 agents de
  campagne délégués (3 Opus 5, 1 Sonnet 5), escalade de modèle : aucune.
- **intention** — vider ce qui attend, faire baisser la file, et exécuter ce que vous tranchez.
  **Test rétro** : la file passe de 60 à 41 items ouverts *alors que* 17 demandes neuves y sont
  entrées ; vos 3 décisions sont exécutées dans le tour où vous les avez prises, et le défaut de
  communication que vous avez relevé est corrigé à sa cause, pas à son symptôme.

## 2. Verdict en une ligne

**3 décisions exécutées et prouvées** · **20 items clos sur gains mesurés**, 41 ouverts contre 60 ·
**4 règles neuves**, chacune avec sa preuve à double sens : EC-8 (une tournure d'annonce
refusée en titre et en en-tête de colonne), EC-10 (un bloc de code jugé sur le lecteur déclaré
du document), R15 (le cliquet qui refuse une famille de défaut sans contrôle qui la joue) et
S47 (une décision doit nommer la chose dont elle parle) · recettes :
`oracle-ecriture` **17/17**, `oracle-synthese` **27/27**, `hook-restitution` **22/22**,
`todo/self-test` **58 PASS**, socle des pages **366/366**, forge-data **273 PASS**, forge-design
**48 oracles / 132 règles**, quality-oracles **269 contrôles** — toutes exit 0 · harnais du pilot
**123/124** · **1 incident** : une écriture accidentelle dans la table des pseudonymes, réparée.

## 3. Décisions attendues de vous

**Bloquants à lever pour avancer** — chacun dit ce qu'il arrête, ce qu'il faut fournir, et ce qui
se passe si rien ne vient :

- **la publication du dépôt `digit-ai-factory` est à l'arrêt**, et elle l'était avant ce tour ;
  il faut dire si `Produit-66` est votre marque ou un client à masquer ; sans ce choix,
  les 24 enregistrements locaux du pilot restent sur ce poste seul ;
- **la propagation vers les copies installées des skills est à l'arrêt** ; elle se joue au
  prochain démarrage de session, qui rejoue la fraîcheur du poste, et elle écrit hors de tout
  dépôt ; jusque-là ce qui s'exécute sur ce poste n'est plus ce qui est versionné, sur 5 skills ;
- **l'unification des 2 moteurs de schéma de base de données est à l'arrêt** ; il faut qu'un
  mandat couvre `digit-ai-forge-audit`, où vit l'autre moitié, puis trancher si l'on accepte de
  perdre le rendu anglais des rapports ou si l'on assume 2 moteurs déclarés ; sans cela, les 2
  continuent de diverger.

> **D-1 — `Produit-66` est-il votre marque, ou un client à masquer ?**
> Ce dépôt porte votre communication. Il vit dans `c:\dev\Produit-66`, avec son propre
> dépôt distant, et vous l'avez créé le 11 septembre. Mais son nom figure aussi dans la table des
> noms de clients à masquer : la porte de publication le traite donc comme un nom à cacher, et
> elle refuse de publier `digit-ai-factory` tant qu'il y apparaît. Elle rend 299 constats, et tous
> portent ce seul mot — dans 82 fichiers suivis, dans le registre d'améliorations, et dans des
> messages d'enregistrement déjà écrits. Ce n'est pas un défaut de ce tour : il précède mon
> travail, et je n'y ai rien ajouté.
>
> **Recommandation : (a).** Source consultée : `oracle-nom-client-publie.mjs`, la porte de
> publication, rejouée ce jour sur le dépôt — 299 constats, tous de la règle C5, tous sur ce nom.
> Et le relevé d'ouverture du poste, qui déclare `Produit-66` « hors liste, avec son
> propre dépôt distant, jamais vérifié ». Les deux disent la même chose : ce dépôt n'a pas de
> statut tranché, et il est traité à la fois comme votre marque et comme un client.

| Option | Coût | Exclusions |
|---|---|---|
| **(a)** retirer `Produit-66` de la table des noms à masquer : c'est votre marque | simple × court — une ligne de table, puis la porte se rejoue | exclut de le masquer si vous confiez un jour ce dépôt à un tiers |
| **(b)** le garder masqué et réécrire les 82 fichiers qui le nomment | complexe × long, et réécrire le passé du dépôt rendrait inutilisable toute copie existante | exclut de nommer ce dépôt en clair dans vos propres documents, y compris ceux que vous lisez |
| **(c)** ne rien décider | gratuit aujourd'hui | exclut toute publication de `digit-ai-factory` : les 24 enregistrements locaux s'accumulent sur ce poste, et le nombre monte à chaque tour |

> **Si rien n'est décidé** : (c) s'applique — la publication reste fermée, rien ne se dégrade, et
> le travail des sessions du jour reste sur ce seul poste.

## 4. Traité — avec sa preuve

- **D-2 (a) — les 2 libellés du tableau d'options sont réécrits** : « Coût » et « Exclusions »
  remplacent la tournure que vous aviez proscrite, dans `gabarits/RESTITUTION.md`, ses 3 juges,
  1 recette et 6 fixtures — 29 remplacements. `S31` les accepte sans changement de code : ses
  expressions reconnaissaient déjà « coût » et « exclu ».
  - **une mesure a corrigé ce que je vous avais écrit**, et la classe en cause est
    `annonce-nominalisee` : la règle de position n'a JAMAIS refusé ces 2 libellés. Son motif
    exigeait un verbe de contenance — tient, contient, porte — et ni « coûte » ni « exclut »
    n'y figurent. L'exemption protégeait un cas que la règle ne voyait pas, et je
    l'avais posée sans mesurer qu'elle servait à quelque chose.
  - preuve : la famille porte maintenant un motif de POSITION plus large que celui de densité, et
    le banc porte un 4e cas qui prouve la levée — les 2 anciens libellés doivent échouer, sans
    quoi un banc qui ne teste que la forme neuve serait vert avec l'exemption comme sans elle.
    `oracle-ecriture` 16/16 → **17/17**, exit 0.
  - 2 défauts de mon code trouvés au passage : les expressions partagées ne remettaient pas leur
    position de départ à zéro entre 2 appels — ce qui rend une règle ancrée entièrement muette —,
    et un antislash mangé par un interpréteur de commande avait transformé le motif en une
    expression qui ne correspondait à rien.
- **D-3 (c) — le cliquet des familles de défaut sans juge est posé**, règle `R15` de
  `todo/oracle-todo.mjs` : une famille CRÉÉE à partir du 16/09/2026 nomme un contrôle qui existe,
  ou elle ne se crée pas.
  - preuve : la règle a immédiatement attrapé les 2 familles créées le matin même par la session
    qui l'écrivait ; leurs juges existaient depuis l'après-midi, ils sont nommés, et le compte des
    familles sans porteur passe de 30 à 28. Banc à TROIS sens — famille neuve sans juge FAIL, la
    même avec un juge PASS, et une famille ANTÉRIEURE au seuil PASS : sans ce dernier cas le
    cliquet mettrait 28 familles au rouge du jour au lendemain. `todo/self-test` 55 → **58 PASS**.
- **D-4 (b) — l'ancienne forme d'exemption de recouvrement a une date de fin**, le **16/12/2026**,
  soit 3 mois. La date vit en donnée, pas en dur : elle se décale ou se lève sans republier le
  socle, et le constat porte la date et les jours restants à chaque exécution.
  - preuve : le sens est UNIQUE et c'est vérifié — une échéance dépassée DURCIT un avertissement
    en bloquant, elle n'adoucit JAMAIS un bloquant, sans quoi la première urgence venue s'en
    servirait pour éteindre un contrôle. Banc à 4 sens ; recette du socle 357/357 → **366/366**.
  - pourquoi 3 mois : la migration suit les pages qu'on rouvre et ne mobilise aucun tour dédié ;
    plus court forcerait le tour dédié que votre option écarte, plus long sortirait du champ de
    vision.
- **Le défaut que vous avez relevé sur D-1 a désormais son juge**, règle `S47` de
  `oracles/oracle-synthese.mjs` : le rappel de sujet d'une décision porte au moins un désignateur
  — un nom propre, un chemin, un identifiant, un fragment entre accents graves, ou un nom de dépôt.
  - classe : `decision-sans-designateur`, créée au référentiel avec `S47` pour juge — le cliquet
    posé le matin même la refusait tant qu'aucun contrôle ne la portait.
  - preuve : `S47` refuse D-1 dans la version que vous avez lue, et elle a aussi accusé
    5 fixtures du parc dont la décision ne nommait rien — elles sont corrigées, une fixture devant
    modéliser la bonne forme. Banc à 2 sens ; `oracle-synthese` **27/27**, `hook-restitution`
    **22/22**.
  - 3 bornes trouvées en écrivant la règle, chacune la rendant muette : le titre est une question,
    donc il ouvre par une capitale comptée comme un nom propre ; le mot « Recommandation » suit
    chaque rappel ; et un nom de dépôt n'a pas de majuscule.
- **Les 17 items du mandat restent clos**, avec leurs preuves : le sas d'arrivée vidé (4 lots,
  16 demandes), 19 candidats décidés, et les campagnes de `digit-ai-forge-data`,
  `digit-ai-forge-design` et `digit-ai-forge-agents` rendues et sondées.
  - preuve : `oracle-todo` exit 0 · harnais du pilot **123/124**, le seul défaut étant la
    propagation des skills, connue et laissée à votre geste.

## 5. Non traité

- La migration des 1 716 exemptions de recouvrement en forme ancienne : motif `borne_atteinte` —
  elle a maintenant sa date et son recensement page par page, et elle se fait au fil des pages
  qu'on rouvre.
- La propagation vers les copies installées des 5 skills touchés : motif `gate_gouvernance` —
  elle écrit hors de tout dépôt, sous le profil du poste.
- TF-0940, deux moteurs pour le même schéma : motif `garde_fou` — l'autre moitié vit chez
  `digit-ai-forge-audit`, hors du mandat d'écriture ouvert.
- La généralisation du périmètre de non-mesure au contrat commun des oracles, seconde moitié de
  TF-1141 : motif `borne_atteinte`.
- TF-1087, le contraste jugé sur son meilleur pixel, et TF-1150, le vocabulaire proscrit pour
  toute une forge : motif `borne_atteinte` — diagnostics faits, corrections à écrire.
- Les 41 items encore ouverts : motif `borne_atteinte` — aucun n'est bloqué, le mandat d'écriture
  ouvert ce matin les rend tous exécutables.
- La rotation des identifiants publiés : motif `acces` — elle se joue dans la console de chaque
  fournisseur.

## 6. Écarts à la lettre

- **Vous avez demandé** « traite tous les todos & les retours ». **J'ai fait** : tous les retours,
  et 21 des 60 todos. **Pourquoi** : les retours étaient bornés ; les todos ne le sont pas.
- **Vous avez demandé** de remonter aux produits l'information pour application. **J'ai fait** :
  le contrat d'héritage passe en 1.12.0, et son évolution DIT au producteur ce qui change pour
  lui, au lieu de lui livrer 3 copies silencieuses. **Pourquoi** : les 3 pièces descendent déjà en
  copie conforme — `RESTITUTION.md`, `CLASSES.json`, `ECRITURE.md` — mais une recopie muette se
  subit au lieu de se lire.
- **Un outil a été lancé avec une option inexistante** : `--aide` sur l'accueil des lots, qui a
  donc exécuté l'accueil réel. Le geste était le bon à cette étape, mais pas voulu à cet instant.
- **INCIDENT — une écriture accidentelle dans la table des pseudonymes, et sa réparation.** En
  déposant un lot de retours nommé d'après le rôle du pilot, l'outil d'accueil a inscrit ce rôle
  dans la table des produits à masquer. Le mot est le nom du RÔLE et du dépôt de la factory,
  employé 762 fois dans le seul registre : le hook de pré-commit l'a réécrit partout, jusqu'à
  casser un identifiant de format. **Le commit a été refusé** par la porte, et c'est elle qui a
  rendu l'incident visible. Réparation : l'entrée est retirée de la table, les 4 fichiers
  réécrits sont restaurés depuis leur dernier enregistrement, mon travail est ré-appliqué, et le
  constat est redéposé par le canal des candidatures, qui n'a pas de machinerie de nommage.
  Vérifié après coup : **0 occurrence** du pseudonyme dans le registre, l'oracle, la recette et le
  référentiel.

## 7. Risques

- **La table des pseudonymes peut recevoir un nom qui n'est pas un client.**
  - signal : un pré-commit qui annonce des centaines de substitutions dans des fichiers qu'on
    n'a pas touchés — c'est ce qui est arrivé, et c'est ce qui a permis de le voir.
  - parade : l'entrée fautive est retirée. Ce qui reste ouvert est la CAUSE : rien n'empêche
    qu'un lot nommé d'après un rôle de la factory inscrive ce rôle comme un produit. Aucun
    contrôle ne le refuse aujourd'hui, et c'est déclaré ici plutôt que supposé résolu.
- **2 sessions écrivent dans le pilot en même temps.**
  - signal : une règle numérotée 2 fois dans le même fichier, ce qui est arrivé ce tour.
  - parade : coordination écrite entre les 2 sessions, numérotation séparée, enregistrements sur
    chemins nommés et jamais sur l'index entier.
- **4 règles neuves entrent le même jour, et chacune accuse du corpus existant.**
  - signal : un avertissement à chaque écriture d'un texte ancien, qui finit par être ignoré.
  - parade : les producteurs sont corrigés à la source, le corpus historique n'est pas réécrit,
    et chaque règle a son cas vert qui prouve qu'elle n'accuse pas un travail juste.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-1** | Reprendre les 41 items ouverts, par score décroissant | `auto_ia` | TF-1018 | `borne_atteinte` | la file cesse de baisser |
| **A-2** | Poser le contrôle qui refuse l'inscription d'un rôle de la factory dans la table des produits | `auto_ia` | neuve | `borne_atteinte` — l'entrée fautive est retirée, la cause reste | l'incident du jour peut se rejouer au prochain lot mal nommé |
| **A-3** | Étendre le périmètre de non-mesure au contrat commun des oracles | `auto_ia` | TF-1141 | `borne_atteinte` | la correction reste bornée à un seul oracle |
| **A-4** | Construire la liste de vocabulaire transverse | `auto_ia` | TF-1150 | `borne_atteinte` | un mot refusé reste proscrit chez un seul produit |
| **A-5** | Corriger le contraste jugé sur son meilleur pixel, chez `digit-ai-forge-agents` | `auto_ia` | TF-1087 | `borne_atteinte` — diagnostic mesuré, ligne nommée | un visuel dont 90 % de la surface est invisible passe encore |
| **A-6** | Rejouer la porte de publication après arbitrage, puis publier | `auto_ia` | neuve | `dependance_bloc_3` — D-1, puis `gate_gouvernance` : la publication reste votre mot | le travail de la journée reste sur ce seul poste |
| **A-7** | Trancher D-1, le statut de `Produit-66` | `manuelle_utilisateur` | neuve | `decision` — dire si ce dépôt est votre marque ou un client n'est pas un geste d'agent | rien ne se publie, et le nombre d'enregistrements locaux monte à chaque tour |
| **A-8** | Propager les 5 skills modifiés vers leurs copies installées | `manuelle_utilisateur` | neuve | `decision` — la propagation écrit hors de tout dépôt, sous le profil du poste | ce qui s'exécute ici n'est plus ce qui est versionné |
| **A-9** | Ouvrir un mandat d'écriture sur `digit-ai-forge-audit` | `manuelle_utilisateur` | TF-0940 | `decision` — le mandat du jour ne le couvre pas | les 2 moteurs de schéma continuent de diverger |
| **A-10** | Faire tourner les identifiants publiés | `manuelle_utilisateur` | TF-1090 | `acces` — mesuré : l'oracle des secrets rend FAIL sur le parc à chaque ouverture, et aucune console de fournisseur n'est joignable depuis ce poste | des identifiants publiés restent valides |

## 9. Traces

- Fichier jugé : ce document — `oracle-synthese` PASS, `oracle-ecriture` PASS.
- `oracles/oracle-synthese.mjs`, `oracles/oracle-ecriture.mjs` et `todo/oracle-todo.mjs` — les
  4 règles neuves, chacune avec son banc.
- `gabarits/RESTITUTION.md`, `gabarits/HERITAGE.json` 1.12.0, `todo/CLASSES.json` 1.17.0,
  `references/tics-redactionnels.json`, `references/ECRITURE.md` — la doctrine et ce qui descend.
- `digit-ai-forge-agents`, skill `digit-ai-page-html` : `references/echeances.json` — la date du
  16/12/2026, en donnée.
- `todo/TODO.jsonl` — 24 événements écrits ce tour ; vues régénérées. 41 ouverts, 328 clos.
- Enregistrements locaux, tous non poussés : pilot `1e87947`, `453b29b`, `a5b4cf1`, `d61c90d`,
  `3612a6e`, `cf798e0`, `8e3f9f1`, `4c30a53`, `caac307` ; forge-data `0d7f31f`, `a1ed23c` ;
  forge-design `6add530`, `857785c` ; forge-agents `498bb0d`, `5a23b16`, `250e6c0`, `efff210`,
  `3fbee06`, `93454d8`, `dc84777`, `823882a`, `d1240b9`, `89d2792`, `aa0cbba`, `a96f187`,
  `11da7be`.
