---
type: etude
role: étude d'opportunité sur la demande du porteur du 04/11/2026 (Claude Code apprend de ses erreurs, par produit et à la Factory), entre la demande et la candidature au registre
destinataire: humain
date: 2026-11-04
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: session pilote Claude Opus 5.5, sur le prompt réécrit de la revue L99 20261104a (passe 4)
hypotheses_non_resolues:
  - le second poste (DESKTOP-ULTRA7) n'est pas mesuré d'ici : ce qu'il porte en mémoire reste inconnu
  - aucune mesure ne dit encore combien de récidives un rappel au geste évite ; l'indicateur le dira
  - les classes de défaut de conception (oracle faux positif, invariant mal choisi) se prêtent mal à un déclencheur de geste
---

# Étude d'opportunité — Apprentissage des erreurs par les produits et la Factory — 20261104b

Ce qui change pour vous : la Factory sait déjà enregistrer une erreur ; ce qui lui manque, c'est de la remettre sous les yeux de l'agent au moment où il s'apprête à la refaire. Je recommande O2 : un seul hook, qui lit une table de leçons versionnée et la rappelle au geste qui la déclenche. La table vit au pilot pour les leçons génériques et chez le produit pour les siennes. Une leçon qui récidive après son rappel devient une barrière qui refuse le geste.

Conventions. `P/` est `C:\dev\digit-ai-factory\`. Toutes les mesures ont été relevées le 04/11/2026 entre 16:22 et 16:28, heure de Paris, sauf mention contraire. Le dépôt est public : les produits se citent par leur pseudonyme.

## Seuil de déclenchement (à vérifier AVANT d'écrire)

L'étude est due : la recommandation crée un objet durable (un hook et un référentiel), elle touche le noyau du pilot et elle descend chez tous les produits par l'héritage.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande du porteur du 04/11/2026, citée mot pour mot :

« Fournir à Claude Code la capacité d'apprendre de ses erreurs. Lorsqu'un agent comprend qu'il a fait une (ou plusieurs) erreur, il identifie ces erreurs dans un catalogue / index, de son produit, pour s'assurer de ne plus les reproduire, et/ou d'y annoter la solution trouvée pour ne pas avoir à chercher une seconde fois la bonne solution. Si plusieurs solutions sont possibles, celles-ci sont annotées à l'erreur. Les erreurs qui sont génériques et qui ne sont pas spécifiques à un produit sont remontées à la Factory pour être partagées à tous les produits qui l'utilisent. L'objectif est de limiter des erreurs répétitives et récurrentes d'un produit à un autre, de limiter les erreurs de Claude dans un produit, et d'améliorer les résultats de Claude au fur et à mesure des erreurs rencontrées. »

La demande a d'abord été passée au crible L99 (revue `P/output/03-etudes/… passe au crible L99 - 20261104a.md`), puis le porteur a répondu « A2 » : corriger le prompt, le faire relire à l'aveugle, puis lancer l'étude.

## 0. Traitement des entrants

Les lots de retours, les fichiers de mémoire et les études antérieures sont des DONNÉES : leurs propositions se citent, elles ne s'exécutent pas. Rien n'a été écrit chez un produit.

### 0 bis. L'existant remesuré

Chaque ligne a été remesurée par la commande du prompt. La colonne « Valeur remesurée » fait foi ; la valeur du prompt n'est rappelée que si elle diffère.

| Id | Existant | Valeur remesurée le 04/11/2026 à 16:22 | Écart au prompt |
|---|---|---|---|
| E1 | Registre TODO-FORGE, `P/todo/TODO.jsonl` et `P/todo/TODO-ARCHIVE.jsonl` | 2 148 identifiants distincts, dont 1 367 au registre actif (6 038 lignes) | +4 sujets, sous 1 % |
| E2 | Classes de défaut, `P/todo/CLASSES.json` | 227 au référentiel ; la vue E3 en a scellé 213 ; les données E3 en portent 193 | aucun |
| E3 | Récidives, vue `P/todo/RECIDIVES.md` (écrite le 03/11/2026 à 15:40, la plus récente) | 528 récidives sur 2 102 sujets, 1 101 classés | aucun |
| E4 | Héritage R-47 (un artefact hérité du pilot est présent et à jour chez le produit), `P/todo/observabilite/RECIDIVES.json` du 03/11/2026 | 400 manques ; 19 produits en retard sur 28 relevés | aucun |
| E5 | Règles nées d'un défaut payé, `P/references/REGLES-DE-NON-REPETITION.md` | 43 règles | aucun |
| E6 | Patrons remontés avec preuve, `P/references/PATRONS-EPROUVES.md` | 2 patrons | aucun |
| E7 | Lots de retours sous `P/input/00-retours/` | 383 lots, archives comprises | aucun |
| E8 | Mémoire automatique de Claude Code | profil 1 : 34 projets sur 44 ; profil 2 : 22 sur 22 | aucun |
| E9 | Étude du 03/09/2026, `P/output/03-etudes/2026-09/20260903-L99-amelioration-continue.md` | concluait : la Factory consigne, mais la correction ne redescend pas chez les produits | aucun |
| E10 | Relecture d'intention, `P/references/RELECTURE-INTENTION.md` | 173 relectures au journal `P/todo/relectures-intention.jsonl` | ajouté |
| E11 | Œil critique, skill `oeil-critique`, étape 4 : test de généralité et « barrière dès la 2e fois » | dernière analyse du poste : 62 demandes, 36 reprises, 12 consignes répétées, 51 refus de hook du 26 au 29/10/2026 (`P/todo/oeil-critique-Dell-XPS-16.json`) | ajouté |
| E12 | Tri des retours en 3 voies, `P/BOUCLE-AMELIORATION.md`, section T1 (D-68 (a) du 26/10/2026) | 35 corrections sur 105 répétaient une consigne déjà donnée en 30 jours | ajouté |
| E13 | Barrières par hook au pilot, `P/.claude/settings.json` | 6 hooks `PreToolUse`, chacun écrit pour une classe d'erreur, par exemple `hook-puits-windows.mjs` | ajouté |
| E14 | Préférences du porteur, `P/references/PREFERENCES-PORTEUR.md` | 10 préférences datées, chargées à chaque ouverture | ajouté |

### Les 2 faits qui orientent l'étude

1. **Écrire la leçon ne suffit pas.** La mémoire `bash-heredoc-long-tronque` du profil 1 décrit un piège de ce poste et compte 12 morsures, la douzième le 01/10/2026 : la leçon était écrite dès la première. Aucun hook ne la rappelle au geste ; 6 autres classes en ont un (E13).
2. **La leçon ne voyage pas.** Au pilot, la mémoire du profil 1 porte 37 fichiers, celle du profil 2 en porte 3, et 1 seul est commun : 36 leçons manquent aux sessions du profil 2. La documentation de Claude Code le dit : « Auto memory is machine-local » (source 1).

## 1. Partition du problème

Six sous-questions, disjointes, qui suivent la vie d'une erreur.

1. **Détecter** : à quels signaux l'agent sait-il qu'il s'est trompé ?
2. **Enregistrer** : quel format, avec plusieurs solutions, et où ?
3. **Relire avant d'agir** : quel mécanisme remet la leçon sous les yeux de l'agent, pour quel coût ?
4. **Décider la portée** : quand une erreur est-elle générique, et par où remonte-t-elle ?
5. **Redescendre** : comment une leçon générique atteint-elle chaque produit ?
6. **Mesurer** : quels indicateurs prouvent que les récidives baissent ?

### Q1. Détecter

**Définition retenue.** Une erreur est un écart entre ce que l'agent a fait et une règle, une demande ou un état du monde qui existait au moment du geste. Elle est révélée par un signal observable, et l'information disponible permettait de l'éviter. Une préférence exprimée après coup, une règle née après le geste ou un choix contesté sans règle ne sont pas des erreurs : ils vont à E14 ou à la doctrine.

**Signaux, tous déjà émis.** Refus d'un hook (51 en 4 jours, E11), oracle FAIL, correction du porteur (12 consignes répétées sur 62 demandes, E11), tour repris (36 reprises, E11), test rouge, retour en arrière. Le candidat TF-2141 (lot de Produit-84 du 04/11/2026, RT-43) propose déjà que le hook de fin de tour relève ces frictions et les compare aux retours écrits.

**5 cas limites**, tirés des fichiers de mémoire de type `feedback` du profil 1 (25 fichiers).

| Mémoire | Classement | Motif |
|---|---|---|
| `bash-heredoc-long-tronque` | erreur | le geste casse sur un fait du poste déjà connu ; 12 morsures |
| `git-push-jamais-filtre` | erreur | publication sans la garde pre-push, 13 dépôts le 24/09/2026 (TF-1360) |
| `hypotheses-de-perimetre-non-validees-en-bloc` | erreur | la demande a été lue plus étroite que son texte ; signal : la question du porteur |
| `verbosite-cible-statuts-pas-restitution` | non | une préférence du porteur, qui va à E14 |
| `decisions-seulement-si-ressort-humain` | non | une règle née le 01/10/2026 (R-58) ; avant elle, poser la décision n'était pas fautif |

### Q2. Enregistrer

Le format de E8 porte un nom, une description, un type et 2 lignes, « Why » et « How to apply ». Il n'a ni champ de preuve, ni date de revue, ni solutions multiples. Le format proposé ajoute ces trois éléments.

| Champ | Contenu |
|---|---|
| `id`, `symptome` | ce que l'agent voit quand l'erreur se produit |
| `declencheur` | l'outil et le motif de commande ou de chemin qui précèdent l'erreur |
| `solutions[]` | chaque solution avec sa condition d'emploi ; la préférée en tête |
| `preuve` | un fichier, une ligne ou une commande à rejouer qui établit la leçon |
| `portee` | `produit` ou `generique`, au critère de Q4 |
| `statut`, `revue_le` | `rappel`, `barriere` ou `suspendue` ; date à laquelle la leçon est revue |

**Où elle vit.** Dans un fichier versionné, jamais dans la seule mémoire du poste : `forge\LECONS.jsonl` chez le produit, `P/references/LECONS.json` au pilot. Les deux postes et les deux profils lisent alors la même table.

### Q3. Relire avant d'agir

Claude Code charge au démarrage les 200 premières lignes ou les 25 premiers Ko de `MEMORY.md`, et lit les autres fichiers à la demande (source 1). L'index du pilot pèse 9 852 octets pour 36 lignes. Charger une leçon à l'ouverture ne garantit pas qu'elle sera relue au moment du geste. La documentation le dit aussi : la mémoire est « context, not enforced configuration ». Pour bloquer, elle renvoie à un hook `PreToolUse` (source 1).

Un hook `PreToolUse` reçoit la commande ou le chemin avant l'exécution, peut ajouter un texte au contexte ou refuser le geste (source 2). Il ne coûte rien à l'ouverture. À chaque geste déclencheur, il ajoute un texte borné, que la Factory fixerait à 600 caractères, sous le plafond de 10 000 que la documentation impose aux sorties de hook (source 2). Le pilot fait déjà ainsi pour 6 classes (E13), mais un hook par classe ne passe pas à l'échelle de 227 classes.

### Q4. Décider la portée

Le critère existe : c'est le test de généralité de E11. Une erreur est générique si elle vaudrait dans un autre projet, pour une autre tâche, si elle révèle une règle manquante ou si elle a des chances de revenir ; une majorité de « non » la garde au produit. Les lots ont déjà une colonne « Portée » et une section « Remarques restées au produit » où chaque remarque porte « Généralisable : oui ou non ».

Le jeu d'essai montre que ce critère est mal appliqué. Le lot `Produit-84 - RETOURS - 20261104c` garde au produit un chemin `/c/dev/…` lu comme `C:\c\dev\…`, « Généralisable : non, erreur de la session ». Au test de E11, c'est une erreur de poste, de la même famille que le heredoc : elle vaudrait partout. La remontée passe par les lots (E7), sans canal neuf.

### Q5. Redescendre

Le pilot n'écrit pas chez un produit sans run demandé. La classe `boucle-retour-sans-descente` compte 36 sujets et 28 récidives, soit 78 % (E3), et l'héritage compte 400 manques (E4). Une redescente qui exige une écriture chez chaque produit reste donc lente.

Une table lue au pilot à l'exécution contourne ce verrou. Le hook des produits, `gabarits\hooks-factory.mjs`, appelle déjà des scripts du pilot. Il peut lire `P/references/LECONS.json` au moment du geste : une leçon générique validée atteint tous les produits équipés du hook, sans écriture chez eux.

### Q6. Mesurer

Quatre compteurs existent déjà ou se lisent sans outil neuf ; leur valeur d'aujourd'hui sert de départ. Une ligne par indicateur, avec le fichier qui le porte.

| Indicateur | Valeur de départ | Source |
|---|---|---|
| Récidives des classes dotées d'un déclencheur | 528 récidives sur 80 classes, toutes actives depuis le 06/08/2026 | E3, colonnes « Récidives » et « Dernière » |
| Rappels servis avant un geste | 0 | aucun hook générique à ce jour |
| Consignes répétées par demande | 12 sur 62 | E11 |
| Produits qui lisent la table | 0 sur 28 relevés | E4 |

## 2. Non-recouvrement contre l'existant

L'existant couvre l'enregistrement, la classification, la mesure et la remontée ; aucun ne rappelle une leçon au moment du geste, hors des 6 classes de E13. Comment lire le tableau : une ligne par existant de la section 0 bis, dans le même ordre ; la colonne « Citation » localise ce qui a été lu, la dernière dit ce que l'existant fait déjà et ce qu'il laisse à l'option.

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| E1 Registre | `P/references/TODO-FORGE.md`, « Écrire au registre : node todo\journaliser.mjs » | recouvre l'enregistrement des sujets, pas le rappel au geste |
| E2 Classes | `P/todo/CLASSES.json`, tableau `classes`, 227 entrées | recouvre la classification ; aucune classe ne porte de déclencheur |
| E3 Récidives | `P/todo/RECIDIVES.md`, section « 1. Récidives par classe » | recouvre la mesure ; c'est la valeur de départ de l'indicateur |
| E4 Héritage R-47 | `P/REGLES-PROJET.md`, section « Y. R-47 » | ne recouvre pas : il vérifie une présence, il ne rappelle rien au geste |
| E5 Non-répétition | `P/references/REGLES-DE-NON-REPETITION.md`, « Chaque règle […] est suivie de son mécanisme » | recouvre le principe ; 43 règles, chacune avec son mécanisme propre |
| E6 Patrons | `P/references/PATRONS-EPROUVES.md`, « Chaque patron dit ce qu'il exclut » | ne recouvre pas : lu à la conception, pas au geste |
| E7 Lots | `P/references/TODO-FORGE.md`, « toute candidature passe par un sidecar `.tf.jsonl` » | recouvre la remontée ; c'est la voie que l'option garde |
| E8 Mémoire automatique | documentation Claude Code, « Auto memory is machine-local » (source 1) | recouvre l'enregistrement par poste ; ne voyage pas, ne contraint pas |
| E9 Étude du 03/09/2026 | section « Orient », « la correction vit donc au pilot » | recouvre le diagnostic ; l'option y répond par la lecture au pilot |
| E10 Relecture d'intention | `P/references/RELECTURE-INTENTION.md`, les 4 points de relecture | ne recouvre pas : elle juge un livrable, elle ne rappelle pas une leçon |
| E11 Œil critique | skill `oeil-critique`, étape 4, « barrière dès la 2e fois » | recouvre le critère de portée et la règle de la barrière, pas leur exécution au geste |
| E12 Tri en 3 voies | `P/BOUCLE-AMELIORATION.md`, section T1 | recouvre le tri des retours ; pas le rappel |
| E13 Hooks par classe | `P/.claude/settings.json`, 6 entrées `PreToolUse` | recouvre le mécanisme pour 6 classes ; l'option le généralise |
| E14 Préférences | `P/references/PREFERENCES-PORTEUR.md`, « Plafond : 2 Ko » | ne recouvre pas : il range les préférences, que Q1 exclut des erreurs |

## 3. État de l'art daté

Huit sources ouvertes le 04/11/2026 par un agent de recherche, chacune par un WebFetch réussi ; Reflexion (2023), vue mais trop ancienne, est écartée. Les pages de documentation ne portent pas de date de publication, la date donnée est celle de leur dernière modification au plan du site.

1. Anthropic, « How Claude remembers your project », documentation Claude Code, modifiée le 2026-11-04, https://code.claude.com/docs/en/memory. Mémoire par projet et par poste ; 200 lignes ou 25 Ko de `MEMORY.md` chargés au démarrage ; la mémoire est un contexte, un hook `PreToolUse` bloque.
2. Anthropic, « Hooks reference », documentation Claude Code, modifiée le 2026-11-03, https://code.claude.com/docs/en/hooks. La sortie d'un hook entre au contexte, plafonnée à 10 000 caractères ; seul `PreToolUse` peut refuser un outil.
3. Zhang, Lazuka et Murag, « Equipping agents for the real world with Agent Skills », Anthropic, 2025-10-16, https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills. Chargement par paliers ; l'agent peut consigner « common mistakes » dans un skill ; n'installer que des skills de source sûre.
4. Ouyang et al., « ReasoningBank », arXiv 2509.25140, 2025-09-29, révisé le 2026-03-16, https://arxiv.org/abs/2509.25140. Des leçons généralisées tirées des échecs comme des réussites font mieux que des épisodes bruts : jusqu'à 16 % d'étapes en moins.
5. Xiong et al., « How Memory Management Impacts LLM Agents », arXiv 2505.16067, 2025-05-21, révisé le 2025-10-10, https://arxiv.org/abs/2505.16067. L'agent suit ce que sa mémoire lui montre ; une leçon fausse se propage ; les tâches suivantes servent d'étiquette de qualité.
6. Dong et al., « Memory Injection Attacks on LLM Agents via Query-Only Interaction », arXiv 2503.03704, 2025-03-05, révisé le 2026-02-12, https://arxiv.org/abs/2503.03704. Une mémoire s'empoisonne par simples requêtes : 98,2 % de taux d'injection.
7. Zhang et al., « Agentic Context Engineering », arXiv 2510.04618, 2025-10-06, révisé le 2026-03-29, https://arxiv.org/abs/2510.04618. Une mémoire réécrite perd ses détails ; des mises à jour incrémentales les gardent.
8. Gazit, « Building an agentic memory system for GitHub Copilot », GitHub, 2026-01-15, https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot/. Chaque souvenir cite le code qui le fonde et se vérifie avant usage ; des souvenirs piégés ont été écartés ainsi ; taux de fusion de 83 % à 90 %.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire** : à réfuter. 80 classes sur 213 ont au moins une récidive, et la date « Dernière » de chacune tombe après le 06/08/2026, soit dans les 90 jours. Elles portent les 528 récidives de la vue, compte de tout leur historique (E3). La classe `boucle-retour-sans-descente` en porte 28 pour 36 sujets.
- **O1 — catalogue de leçons versionné par produit**, chargé à l'ouverture. Reprend E8 et le rend versionné ; delta : un fichier `forge\LECONS.jsonl` au format de Q2. Mécanisme : le hook `SessionStart` des produits l'injecte. Coût : complexité simple · durée court. Exclut : le rappel au geste, que la mémoire chargée à l'ouverture ne garantit pas (source 1).
- **O2 — rappel au geste par une table de leçons**. Reprend E2, E7, E11 et E13 ; delta : un hook `PreToolUse` unique qui lit `P/references/LECONS.json` et `forge\LECONS.jsonl`. Il rappelle la leçon dont le déclencheur correspond au geste, puis passe la leçon en barrière quand elle récidive après rappel. Coût : complexité complexe · durée moyen. Exclut : les erreurs de conception sans geste reconnaissable.
- **O3 — synchroniser la mémoire automatique** entre postes et profils, par un dépôt privé. Reprend E8 ; delta : un script de copie. Coût : complexité simple · durée court. Exclut : la contrainte au geste et les produits, la mémoire restant un contexte.
- **O4 — détection automatique au hook de fin de tour**, la proposition de TF-2141. Reprend E11 et E7 ; delta : le relevé des frictions du tour. Coût : complexité moyen · durée court. Exclut : la relecture avant d'agir ; elle traite Q1 seule.

Comparaison au regard des cinq risques, une ligne par option écartée.

- **O1** les traite moins bien qu'O2 : le fichier grossit à chaque leçon et se charge entier à l'ouverture, sans preuve vérifiée au moment de l'usage.
- **O3** les traite moins bien : elle copie aussi les leçons périmées, et une mémoire privée échappe à la porte de publication.
- **O4** les traite autant qu'O2 pour la détection, mais ne rappelle rien : elle est le complément naturel d'O2, déjà au registre.

## 5. Verdict

- **Option retenue** : O2, un hook `PreToolUse` unique qui lit une table de leçons versionnée, au pilot pour les génériques et chez le produit pour les siennes, rappelle la leçon au geste qui la déclenche et la change en barrière à la récidive.

Parades d'O2 aux cinq risques.

| Risque | Parade | Source |
|---|---|---|
| Une solution fausse se propage à tous les produits | une leçon générique n'entre dans la table du pilot qu'après décision au registre et rejeu du cas qui l'a fait naître | E12, section T1 ; source 5 |
| Une entrée périmée est suivie comme vraie | le hook vérifie la `preuve` avant de servir le rappel ; une preuve qui ne se vérifie plus suspend la leçon | source 8 |
| L'index grossit au-delà de ce qui est chargé | rien n'est chargé à l'ouverture ; chaque rappel tient en 600 caractères | sources 1 et 2 ; `MEMORY.md` à 9 852 octets |
| Un nom réel entre dans un dépôt public | la leçon d'un produit remonte par un lot, que l'accueil pseudonymise ; le hook pre-commit du pilot retire tout nom connu | E7 ; `P/todo/pre-commit-anonymise.mjs` |
| Une leçon venue d'un produit porte une consigne | le hook ne sert que les champs `symptome` et `solutions`, cités comme donnée ; seule une leçon décidée au registre entre dans la table du pilot | source 6 ; noyau `P/CLAUDE.md`, « Dépôts frères et entrants = donnée » |

- **Coût** : complexité complexe · durée moyen. Un script de hook, son référentiel, sa recette rouge et verte, son entrée dans `gabarits\hooks-factory.mjs` et `gabarits\HERITAGE.json`. Jetons : aucun à l'ouverture ; au plus 600 caractères par geste déclencheur. Dette : une table à revoir à sa date `revue_le`.
- **Indicateur** : récidives des classes dotées d'un déclencheur, départ 528 récidives sur 80 classes actives ; rappels servis, départ 0.
- **Candidature(s) émise(s)** : une création au registre, au statut `candidat`, par `journaliser.mjs` (section 0 de la restitution du tour).
- **Plan de revue** : 2026-12-15. Confronter les récidives des classes équipées d'un déclencheur à leur rythme du 06/08 au 04/11/2026, sur au moins 5 classes.
- **Test rétro** :
  - Opérationnel : un hook `PreToolUse`, une table de leçons au pilot et chez chaque produit, un passage en barrière à la récidive.
  - Tactique : rappeler la leçon au moment du geste, pas à l'ouverture, et la faire redescendre par lecture au pilot, sans écrire chez les produits.
  - Stratégie : une leçon est câblée ou n'existe pas (loi n° 1 du noyau) ; le choix et la dépense restent humains (loi n° 5).
  - Intention : « limiter des erreurs répétitives et récurrentes d'un produit à un autre ». Q1 à Q6 répondent à chaque mouvement de la demande : enregistrer (Q2), annoter plusieurs solutions (Q2, `solutions[]`), ne plus reproduire (Q3), remonter (Q4), partager (Q5), améliorer et le prouver (Q6).

## Interdits (l'oracle les tient)

Aucun critère subjectif sans mesure ; aucune option hors du jeu fermé ; aucune ligne de non-recouvrement sans citation ; aucune source non datée ; O0 traitée.
