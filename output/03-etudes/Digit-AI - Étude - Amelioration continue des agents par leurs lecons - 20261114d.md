---
type: etude
role: instruction d'un candidat entre `candidat` et `decide` (TF-0155)
destinataire: humain
date: 2026-11-14
gabarit: gabarits\ETUDE-OPPORTUNITE.md
emetteur: session pilote Claude Opus 4.6, sur le prompt du porteur du 14/11/2026
hypotheses_non_resolues:
  - le second poste (DESKTOP-ULTRA7) n'est mesuré que par ses fichiers de coûts et de frictions présents sur ce disque
  - aucune mesure ne dit encore combien de pistes d'amélioration un cycle d'apprentissage produit, parce que le cycle n'existe pas
  - la durée de vie d'un agent de moins de 17 minutes est calculée par lib-suivi-agents.mjs mais n'est publiée par aucun oracle
---

# Étude d'opportunité — Amélioration continue des agents par leurs leçons — 20261114d

Ce qui change pour vous : la Factory mesure déjà les agents (flotte, coûts, suivi, frictions, leçons), mais chaque mesure vit dans son outil et aucune boucle ne les rassemble pour en tirer des pistes. L'étude propose quatre options, de « l'existant suffit » à une boucle fermée. L'option recommandée est O2 : une fiche d'exécution d'agent, écrite par le hook de fin d'agent, agrégée au pilot, et lue par l'œil critique qui en dérive des pistes versées au registre en candidat. Aucune modification de la Factory n'est faite dans cette étude.

## Seuil de déclenchement

L'étude est due : la recommandation crée un objet durable (la fiche d'exécution d'agent et son agrégateur), touche le noyau du pilot et descend chez tous les produits par l'héritage. Le gain estimé est 3 et la preuve 2 (les signaux existent mais ne sont pas rassemblés) : le seuil « gain ≥ 3 avec preuve ≤ 2 » est atteint.

## Intention de l'utilisateur (loi n° 7, TF-0791)

Demande du porteur du 14/11/2026, citée mot pour mot :

> « Que la Factory apprenne des agents que lancent les sessions de tous les projets — organisation, planification, résultats, erreurs, optimisations — pour améliorer en continu la coordination, les agents, leurs interactions, la qualité de leurs résultats, leurs délais, et les types d'agents à spécialiser, construire et exécuter. »

Intention : le porteur veut que les agents s'améliorent d'un run à l'autre, pas seulement qu'on les mesure. Cinq familles de leçons sont nommées : organisation, planification, résultats, erreurs, optimisations. Le résultat attendu est un cycle qui capte, agrège, propose et prouve, avec une frontière claire entre ce que la boucle fait seule et ce qui reste humain.

## 0. Traitement des entrants

Les entrants sont la demande du porteur et l'existant de la Factory. Les mesures de l'étape 0 (7 relevés et 1 bis) sont en annexe ; résumé ici : 301 appels d'agent sur un mois, 300 sous-agents, 177 vers un agent nommé, 10,2 millions de jetons de sortie, 8 lignes au journal de campagnes, 22 frictions au pilot, 45 frictions chez 2 produits, 81 lignes de coûts pilot sur 2 postes, 6 lignes de coûts chez 1 produit, 67 relectures d'intention.

## 1. Partition du problème

### Q1. Capter — les signaux des cinq familles

Pour chacune des cinq familles de leçons nommées par le porteur, le tableau ci-dessous identifie le signal observable qui la représente, l'endroit où il est déjà capté, et son statut de publication. Comment le lire : chaque ligne est une famille, triée dans l'ordre de la demande ; la colonne « Signal » nomme la grandeur mesurable ; « Déjà capté où » donne le script ou le hook qui la produit ; « Statut » dit si le signal est publié dans une sortie lisible, calculé mais non publié, ou absent. Les signaux des produits ne sont comptés que pour ceux présents sur le disque de ce poste.

| Famille | Signal observable | Déjà capté où | Statut |
|---|---|---|---|
| Organisation | Type d'agent lancé, agent nommé ou générique, dérogation dite, simultanéité | `relever-flotte.mjs` (journal `flotte-campagnes.jsonl` avec `--journal`), `hook-flotte.mjs` (avertissement au lancement) | publié (MESURÉ, `relever-flotte --json`, relevé 1) |
| Planification | Durée de vie de l'agent (du lancement à la fin), jetons consommés, nombre d'appels d'outils | `relever-flotte.mjs` : jetons de sortie et relus en médiane, contexte initial, appels d'outils ; `relever-couts.mjs` : temps actif agrégé et compte de sous-agents par session ; `oracle-suivi-agents.mjs` : `courseMin` par agent au-delà de 17 min (SEUIL_MIN) ; `lib-suivi-agents.mjs` : `courseMin` calculé pour tout agent | publié au-delà de 17 min (MESURÉ, relevé 1 bis : 16 agents jugés sur 34 sessions) ; calculé, non publié en dessous de 17 min |
| Résultats | Verdict de l'oracle du livrable (PASS/FAIL), verdict de la relecture d'intention (sert/dérive), rapport final de l'agent (contrat `AGENT-CAMPAGNE.md`) | `oracle-synthese.mjs` : S79 (ligne relecture d'intention au bloc 4) ; `relectures-intention.jsonl` (chaque relecture consignée) ; les oracles de chaque livrable sont joués par le pilot | publié (DÉCOMPTÉ, 67 relectures sur un mois, relevé 1) |
| Erreurs | Frictions du tour (refus de hook, oracle FAIL, correction humaine), leçons rappelées et récidives | `lib-frictions.mjs` → `frictions.jsonl` (pilot `.claude/`, produit `forge/`) ; `hook-lecons.mjs` → `lecons-rappels.jsonl` ; `scripts/lecons.mjs --recidives` croise rappels et frictions | publié (DÉCOMPTÉ, 22 frictions pilot + 45 chez 2 produits, relevé 5) |
| Optimisations | Jetons par agent, ratio sortie/relecture, pic de simultanéité, part nommée, délégations Opus sans effort | `relever-flotte.mjs` : médiane relus par sous-agent, médiane contexte initial, simultanéité, `delegations_opus_sans_effort` ; `relever-couts.mjs` : jetons et temps actif par session | publié (MESURÉ, 42 délégations Opus sans effort sur un mois, relevé 1) |

**Manques identifiés.** Trois signaux ne sont pas captés aujourd'hui :

1. **Durée individuelle de chaque agent en dessous de 17 min** : `lib-suivi-agents.mjs` la calcule (`courseMin`), mais `oracle-suivi-agents.mjs` ne publie que les agents au-delà de SEUIL_MIN (17 min). 284 agents sur 300 (DÉCOMPTÉ, 300 − 16 jugés au relevé 1 bis) ne sont jamais publiés individuellement. Statut : calculé, non publié.
2. **Le lien entre un agent et le verdict de son livrable** : les oracles jugent le fichier, le relevé de flotte compte les agents, mais aucun journal ne lie un identifiant d'agent à un chemin de livrable et à son verdict. Statut : manque.
3. **La cause d'un échec d'agent** (abandon, timeout, dépassement de contexte, erreur de consigne) : la transcription du sous-agent la porte, mais aucun script ne l'extrait. Statut : manque.

**Fiche d'exécution d'agent — proposition minimale.** Une ligne JSON par agent, écrite au plus tard à la fin de sa course.

| Champ | Source | Point de capture |
|---|---|---|
| `ts` | horloge | écriture |
| `session` | transcription parent | fin de l'agent |
| `agent_id` | identifiant du sous-agent | lancement |
| `type` | type nommé ou `generique` | lancement (`hook-flotte.mjs` le connaît déjà) |
| `modele`, `effort` | paramètres de l'appel | lancement |
| `duree_s` | dernier message − premier message | fin de l'agent |
| `jetons_entree`, `jetons_sortie` | champs `usage` de la transcription | fin de l'agent |
| `appels_outils` | décompte des appels | fin de l'agent |
| `verdict_livrable` | verdict de l'oracle joué sur le livrable, ou null | après la réception du livrable |
| `verdict_relecture` | sert/dérive, ou null | après la relecture d'intention |
| `frictions` | nombre de frictions du tour de l'agent | fin de l'agent |
| `cause_fin` | fini/abandonne/timeout/erreur | fin de l'agent |
| `projet` | pseudonyme Produit-NN | écriture |

**Lieu d'écriture** : `todo/observabilite/fiches-agents.jsonl` au pilot ; chez un produit, `forge/fiches-agents.jsonl`. **Point de capture** : le hook SubagentStop (un événement du harnais Claude Code, qui se déclenche à la fin de chaque sous-agent). La Factory ne possède aucun hook sur SubagentStop aujourd'hui (relevé 3, DÉCOMPTÉ : 0 occurrence dans gabarits, oracles, scripts et `.claude/settings.json`). Le plugin tiers claude-mem en possède un (relevé 3 : `claude-mem hook claude-code subagent-stop`, actif, asynchrone), mais il appartient au plugin et écrit dans sa propre base.

### Q2. Agréger — de plusieurs sessions, projets et postes

Les fiches de chaque produit vivent dans `forge/fiches-agents.jsonl`, pseudonymisé par Produit-NN (le même pseudonyme que `frictions.jsonl` et `couts-*.jsonl`). L'agrégation au pilot se fait par un script de relevé (extension de `relever-flotte.mjs` ou script séparé) qui lit les fichiers de chaque produit du disque, comme le font déjà `relever-flotte.mjs` (41 dossiers lus au relevé 1, DÉCOMPTÉ) et `relever-couts.mjs` (relevé 4 : 2 fichiers pilot, 1 fichier produit).

**Pseudonymisation.** Les fiches ne portent que le pseudonyme Produit-NN et l'identifiant de session (un UUID, non nominatif). Aucun nom réel de produit, aucun chemin de produit, aucun contenu de livrable ne transite.

**Rétention face à la purge des transcriptions.** Les transcriptions de Claude Code sont purgées après un mois par le harnais. Les fiches d'exécution, elles, sont des fichiers du dépôt (pilot) ou de la forge (produit), versionnés par git : elles survivent à la purge. Le relevé de flotte actuel (`relever-flotte.mjs`) lit les transcriptions et ne voit que un mois ; les fiches d'exécution donneraient un historique sans limite, sur lequel comparer avant et après.

**Multi-postes.** Chaque poste écrit ses fiches localement. Le relevé agrège les fiches présentes sur le disque. Le poste DESKTOP-ULTRA7, mesuré seulement par ses fichiers de coûts (21 lignes, relevé 4, DÉCOMPTÉ), serait couvert dès qu'il exécute le hook qui écrit les fiches.

### Q3. Proposer — des fiches aux pistes

Le cycle proposé :

1. **Mesurer** (automatique) : le hook SubagentStop écrit la fiche d'exécution. Le relevé de flotte agrège les fiches.
2. **Regrouper** (automatique) : l'œil critique (`oeil-critique`, skill existant) lit les fiches agrégées dans sa mission « revue de code » ou une mission dédiée. Il regroupe les agents par type, par verdict, par durée et par frictions.
3. **Proposer** (automatique, borné) : l'œil critique dérive des pistes. Chaque piste dit le signal mesuré qui la fonde et l'objet de la Factory qu'elle modifierait.
4. **Décider** (humain) : chaque piste entre au registre `todo/TODO.jsonl` en `candidat`, par `journaliser.mjs`. Aucune modification de la Factory sans décision humaine.

**Vers quel objet de la Factory chaque type de piste va** :

| Type de piste | Objet cible | Mécanisme existant |
|---|---|---|
| Un type d'agent manque ou est sous-utilisé | Définition d'agent (`gabarits/flotte/*.yaml` → `compiler-flotte.mjs` → `.claude/agents/`) | `relever-flotte.mjs` mesure déjà la part nommée (MESURÉ, 58,8 %, relevé 1) |
| Un agent échoue de façon récurrente | Leçon dans `references/LECONS.json` (rappel au geste) ou contrat `gabarits/AGENT-CAMPAGNE.md` (règle du contrat) | `hook-lecons.mjs` lit la table et rappelle ; `lecons.mjs --recidives` croise rappels et frictions |
| Un agent consomme trop de jetons | Règle de lancement dans `hook-flotte.mjs` (seuil, avertissement) ou effort dans la définition | `relever-flotte.mjs` mesure les jetons en médiane (MESURÉ, 458 333 relus par sous-agent, relevé 1) |
| Une consigne d'agent dérive | Règle de la relecture d'intention (`references/RELECTURE-INTENTION-REGLES.json`) | `relecture-intention.mjs` juge déjà les consignes (67 relectures, relevé 1, DÉCOMPTÉ) |
| La coordination entre agents est déficiente | Contrat de campagne (`gabarits/AGENT-CAMPAGNE.md`) ou oracle de cohérence | La relecture d'intention a un point « cohérence » (A-3 de la v1.2.0) |

**Extension plutôt que création.** L'œil critique existe et a une dernière exécution au 10/11/2026 sur le poste Dell-XPS-16 (relevé 6, MESURÉ : `ts` 2026-11-10T10:57:43.543Z). L'ajout d'une mission « agents » à l'œil critique étend un outil existant. Le relevé de flotte (`relever-flotte.mjs`) est étendu pour lire les fiches d'exécution en plus des transcriptions.

### Q4. Prouver — chaque indicateur de délai a son indicateur de qualité

Chaque optimisation qui réduit un délai ou un coût doit être gardée par un indicateur de qualité, pour que le gain de vitesse ne se paie pas en défauts. Le tableau ci-dessous apparie chaque indicateur de délai à son gardien, avec la base mesurée à la date de l'étude et le seuil fixé avant toute mesure future.

| Indicateur de délai | Base mesurée (date de l'étude) | Indicateur de qualité gardien | Base mesurée | Seuil (fixé avant la mesure) | Méthode |
|---|---|---|---|---|---|
| Durée médiane d'un agent | Non publiée en dessous de 17 min ; 40,6 à 119,5 min pour les 16 publiés (MESURÉ, relevé 1 bis) | Part des agents dont le verdict livrable est PASS | Non mesurée (le lien agent→verdict manque) | ≥ valeur de la première mesure, sans descendre | Comparaison appariée : mêmes types d'agent, même complexité de tâche, avant et après |
| Jetons médians par agent | 458 333 relus en médiane (MESURÉ, relevé 1) | Verdicts de relecture d'intention : part « sert » | 67 relectures, détail par verdict non relevé (DÉCOMPTÉ, relevé 1) | ≥ part « sert » de la base, à 5 points près (bruit attendu) | Même jeu de types d'agent ; une baisse de plus de 5 points arrête l'optimisation |
| Nombre de frictions par session | 22 frictions pilot sur 32 sessions avec sous-agents (DÉCOMPTÉ, relevés 1 et 5) ≈ 0,69 par session | Part des frictions suivies d'un retour consigné | Non mesurée (le croisement frictions→retours n'est pas fait) | ≥ 50 % | Décompte sur les frictions des sessions avec sous-agents |
| Temps entre le lancement et le premier point de suivi | 15 min par conception (SEUIL_POINT_MIN, `lib-suivi-agents.mjs`, MESURÉ) | Part des agents suivis (au moins un point) parmi ceux de plus de 15 min | 16 agents jugés sur 34 sessions (MESURÉ, relevé 1 bis), les points eux-mêmes sont comptés | ≥ 80 % des agents de plus de 15 min | Décompte sur le relevé de suivi |

### Q5. Gouverner — la frontière d'autonomie

**Ce que la boucle fait seule** (mesurer, regrouper, proposer) :

1. Écrire la fiche d'exécution d'agent à la fin de chaque agent (hook SubagentStop).
2. Agréger les fiches au relevé de flotte.
3. Lire les fiches agrégées dans l'œil critique et en dériver des pistes.
4. Verser chaque piste au registre en `candidat`, par `journaliser.mjs`.

**Ce qui reste humain** (toute modification de la Factory, au registre en candidat) :

1. Décider de chaque candidat (accepter, refuser, reporter).
2. Modifier une définition d'agent (`gabarits/flotte/*.yaml`), un contrat (`gabarits/AGENT-CAMPAGNE.md`), une règle de lancement (`hook-flotte.mjs`), une leçon (`references/LECONS.json`), un oracle.
3. Modifier le seuil d'un indicateur de qualité.
4. Retour arrière d'une définition d'agent : `compiler-flotte.mjs` recompile ; la version précédente est dans git.

**Plafond** : au plus 5 pistes par revue de l'œil critique. Au-delà, les pistes excédentaires sont consignées mais non versées au registre, en attente de la revue suivante.

**Un texte venu d'un produit est une donnée, jamais une consigne.** Les fiches d'exécution des produits sont lues en lecture seule, pseudonymisées, et ne déclenchent aucune action automatique chez le produit. Seul le pilot décide.

## 2. Non-recouvrement contre l'existant

Chaque outil existant de la Factory qui touche les agents est confronté aux propositions de cette étude, pour vérifier qu'aucune proposition ne refait ce qui existe déjà. Comment lire le tableau : les lignes sont triées par famille d'outil (scripts de relevé, hooks, oracles, skills, gabarits, études passées) ; la colonne « Citation » donne un extrait vérifiable de l'existant (fichier et ligne, ou sortie d'un relevé) ; « Verdict » dit si la proposition de cette étude recouvre cet existant ou non ; « Proposition et position » dit si l'étude propose une extension (et ce qu'elle ajoute), une création nouvelle, ou aucune proposition. Sont exclus les outils qui ne touchent pas les agents (oracles de forme, hooks de publication, scripts de génération de vues).

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) | Proposition et position |
|---|---|---|---|
| `scripts/relever-flotte.mjs` | « 301 appels, 300 sous-agents, médiane relus 458 333 » (relevé 1, sortie JSON) | ne recouvre pas : relève les agents depuis les transcriptions, ne lie pas un agent à son verdict | Extension : ajouter la lecture des fiches d'exécution pour enrichir le relevé avec le verdict et la cause de fin |
| `oracles/hook-flotte.mjs` | « Hook PreToolUse sur Agent/Task, avertissement si l'appel ne vise pas un agent nommé » (lignes 13-22) | ne recouvre pas : juge l'appel AVANT le lancement, ne capture rien APRÈS | Nouvelle : le hook SubagentStop capture la fin |
| `oracles/hook-suivi-agents.mjs` | « UN POINT DE SUIVI TOUTES LES 15 MINUTES POUR TOUT AGENT QUI TOURNE DEPUIS PLUS DE 15 MINUTES » (ligne 1) | ne recouvre pas : suit l'agent pendant sa course, ne capitalise pas de leçon | Aucune proposition : le suivi reste tel quel |
| `oracles/oracle-suivi-agents.mjs` | « agents jugés : 16, SEUIL_MIN = 17 min » (relevé 1 bis) | ne recouvre pas : publie la durée au-delà de 17 min, pas en dessous | Extension : publier aussi le `courseMin` des agents en dessous de 17 min dans la fiche d'exécution |
| `scripts/relever-couts.mjs` et `oracles/hook-couts.mjs` | « 60 lignes pilot poste 1, 21 lignes pilot poste 2, 6 lignes Produit-d8e3 » (relevé 4) | ne recouvre pas : agrège par session, pas par agent | Aucune proposition : les coûts par session restent tels quels ; la fiche donne le grain par agent |
| `oracles/hook-lecons.mjs` et `references/LECONS.json` | « 7 leçons, hook PreToolUse sur Bash/PowerShell/Write/Edit/MultiEdit/Agent/Task » (lecture du fichier) | ne recouvre pas : rappelle une leçon connue au geste, ne découvre pas de leçon nouvelle | Aucune proposition : le hook des leçons reste tel quel ; les pistes de l'œil critique alimentent la table |
| `oracles/lib-frictions.mjs` | « refus_hook, oracle_fail, correction_humaine » (relevé 5, types) | ne recouvre pas : journalise les frictions, ne les croise pas avec les agents | Extension : la fiche d'exécution porte le nombre de frictions de l'agent |
| `oeil-critique` (skill) | « Dernière exécution : 2026-11-10T10:57:43.543Z sur Dell-XPS-16 » (relevé 6) | ne recouvre pas : analyse les échanges du poste, ne lit pas les fiches d'agent | Extension : ajouter une mission « agents » qui lit les fiches agrégées |
| `gabarits/AGENT-CAMPAGNE.md` | « rapport final par item » (en-tête du gabarit) | ne recouvre pas : définit le contrat de l'agent, ne capitalise pas ses résultats | Aucune proposition : le contrat reste tel quel |
| `scripts/compiler-flotte.mjs` | « compile gabarits/flotte/*.yaml, joue oracle-scan-agentdef, installe dans .claude/agents/ » (lignes 1-28) | ne recouvre pas : compile les définitions, ne mesure pas leur usage | Aucune proposition : la compilation reste telle quelle |
| Étude `20261018-etude-opportunite-flotte-d-agents.md` | « La flotte est faite d'agents génériques : 191 sur 201 » (M-01) | ne recouvre pas : a diagnostiqué la flotte et recommandé les agents nommés, n'a pas traité la boucle d'apprentissage | Nouvelle : cette étude traite la boucle d'apprentissage, que l'étude de la flotte n'abordait pas |
| Étude `Digit-AI - Étude - Apprentissage des erreurs … - 20261104b.md` | « O2 : un hook qui lit une table de leçons et la rappelle au geste » (bloc 0, résumé) | ne recouvre pas : a créé le mécanisme de rappel des leçons connues ; ne traite pas la découverte de leçons nouvelles depuis les agents | Nouvelle : cette étude ferme la boucle en amont (découverte), là où l'étude 20261104b a fermé la boucle en aval (rappel) |
| Étude `Digit-AI - Étude - Cout et qualite de la boucle L99 - 20261106b.md` | « 81 % des jetons de la boucle vont aux relecteurs » (bloc 0) | ne recouvre pas : traite le coût de la boucle L99, pas la boucle d'apprentissage des agents | Aucune proposition : sans rapport avec les agents |

**Vérification : aucun « sous-agent d'agent » pour les agents nommés.** Les 5 types nommés de la flotte (campagne, constructeur, explorateur, redacteur, verificateur) n'ont pas l'outil Agent dans leur définition (DÉCOMPTÉ, relevé : `grep -c Agent .claude/agents/*.md` rend 0 pour chacun). Seul l'agent générique (`general-purpose`, outils `*`) peut lancer un sous-agent. Un « sous-agent d'agent » n'existe donc que pour l'agent générique (124 agents génériques sur 300 au relevé 1, DÉCOMPTÉ).

## 3. État de l'art daté

État de l'art : non instruit. Motif : le sujet est interne à la Factory et porte sur l'orchestration d'agents Claude Code au sein d'un écosystème de forges propriétaire. Les sources externes sur l'orchestration multi-agents (Anthropic « Building effective agents », janvier 2025 ; LangChain, CrewAI, AutoGen) traitent de l'architecture d'orchestration, pas de la boucle d'apprentissage continu à partir des résultats mesurés des agents dans un système de production à oracles exécutés. L'existant interne (12 outils listés au tableau de non-recouvrement) constitue l'état de l'art effectif.

## 4. Options — jeu fermé O0-O4

### O0 — Ne rien faire

L'existant mesure les agents (flotte, coûts, suivi, frictions, leçons) mais ne ferme pas la boucle : aucun mécanisme ne transforme ces mesures en pistes d'amélioration versées au registre. Le porteur doit lire les relevés lui-même, identifier les pistes, et les formuler. **Coût du statu quo** : les 42 délégations Opus sans effort déclaré (relevé 1, MESURÉ) et les 124 agents génériques sur 300 (DÉCOMPTÉ) restent sans signal de rappel autre que le relevé de flotte à l'ouverture, que la session lit et oublie. Les leçons ne se découvrent que par l'humain ou par l'œil critique, qui ne lit pas les fiches d'agent.

### O1 — Fiche d'exécution seule

Écrire la fiche d'exécution d'agent (13 champs, tableau de Q1) par un hook SubagentStop. Le relevé de flotte est étendu pour lire les fiches.

- **Coût** : complexité simple × durée court. Un hook et une extension du relevé. Environ 200 000 jetons de développement (ESTIMÉ, par analogie avec `hook-suivi-agents.mjs` : 340 lignes).
- **Ce qu'elle exclut** : l'agrégation multi-projets, la dérivation de pistes, la preuve de qualité.
- **Indicateur** : nombre de fiches écrites par jour.
- **Risque** : les fiches s'accumulent sans être lues.

### O2 — Fiche + œil critique étendu (l'option recommandée)

O1, plus : l'œil critique reçoit une mission « agents » qui lit les fiches agrégées, dérive des pistes (≤ 5 par revue), et les verse au registre en `candidat`. Le relevé de flotte est étendu pour agréger les fiches de tous les projets du disque.

- **Coût** : complexité moyen × durée moyen. Le hook SubagentStop (O1), l'extension du relevé de flotte, et une mission de l'œil critique. Environ 500 000 jetons de développement (ESTIMÉ).
- **Compris** : la fiche d'exécution, l'agrégation, la dérivation de pistes, le versement au registre, la gouvernance (plafond de 5 pistes, décision humaine). **Non compris** : la preuve de qualité automatisée (Q4), la cause d'échec extraite de la transcription (champ `cause_fin` rempli par une heuristique, pas par une analyse). **Conséquence** : la preuve de qualité repose sur la comparaison manuelle des indicateurs avant et après, comme aujourd'hui pour les leçons (mesure de `hook-lecons.mjs`).
- **Indicateur** : nombre de pistes versées au registre par mois ; part des pistes acceptées.
- **Risque** : l'œil critique propose des pistes de faible valeur. Parade : le plafond de 5 pistes et la décision humaine.

### O3 — O2 + preuve de qualité automatisée

O2, plus : chaque indicateur de délai (Q4) est mesuré automatiquement et comparé à sa base. Un seuil franchi déclenche une alerte.

- **Coût** : complexité complexe × durée long. O2, plus un tableau de bord d'indicateurs et un mécanisme d'alerte. Environ 1 200 000 jetons de développement (ESTIMÉ).
- **Ce qu'elle exclut** : l'extraction automatique de la cause d'échec depuis la transcription.
- **Indicateur** : nombre d'alertes par mois ; part des alertes suivies d'une action.
- **Risque** : les alertes sont trop fréquentes et ignorées. Parade : les seuils sont fixés au-dessus du bruit mesuré (Q4).

### O4 — O3 + extraction de la cause d'échec

O3, plus : un agent dédié analyse la transcription d'un sous-agent échoué pour en extraire la cause (erreur de consigne, dépassement de contexte, erreur de l'outil, abandon).

- **Coût** : complexité très complexe × durée très long. O3, plus un agent d'analyse qui lit les transcriptions (des milliers de jetons par agent échoué). Environ 3 000 000 jetons de développement (ESTIMÉ), plus un coût récurrent par agent échoué.
- **Ce qu'elle exclut** : rien de connu.
- **Indicateur** : part des échecs dont la cause est identifiée ; précision de la cause (validée par l'humain).
- **Risque** : le coût récurrent dépasse le gain. Parade : ne déclencher l'analyse que sur les agents de plus de 17 min qui échouent.

## 5. Verdict

- **Option retenue** : O2 — Fiche d'exécution d'agent + œil critique étendu.
- **Coût** : complexité moyen × durée moyen ; environ 500 000 jetons de développement (ESTIMÉ).
- **Candidature(s) émise(s)** : préparée, jouée sur copie, journalisée après la décision D-219.
- **Plan de revue** : 2026-12-14, un mois après l'étude. Critères : au moins 100 fiches d'exécution écrites, au moins 1 revue de l'œil critique avec mission « agents », au moins 1 piste versée au registre.
- **Test rétro** :
  - **Opération** → **Tactique** : la fiche d'exécution d'agent (opération) sert la capture des signaux des 5 familles (tactique, Q1) ; l'extension de l'œil critique (opération) sert la transformation des mesures en pistes (tactique, Q3).
  - **Tactique** → **Stratégie** : la capture et la transformation (tactique) servent la boucle d'apprentissage continu (stratégie) : les agents s'améliorent d'un run à l'autre, par des modifications de la Factory fondées sur des mesures.
  - **Stratégie** → **Intention** : la boucle d'apprentissage (stratégie) sert l'intention du porteur : « que la Factory apprenne des agents que lancent les sessions de tous les projets ».
  - **Vérification descendante** : l'intention (apprendre) est servie par une stratégie (boucle), qui est servie par deux tactiques (capter et proposer), qui sont servies par des opérations (fiche et mission). Aucune opération orpheline, aucune stratégie sans tactique.
  - **Questions du demandeur rejouées** : les 5 familles (organisation, planification, résultats, erreurs, optimisations) sont chacune couverte par un signal au tableau de Q1 ; la coordination est couverte par la simultanéité et la cohérence de campagne ; les types d'agents à spécialiser sont couverts par la piste « un type d'agent manque » de Q3.

## Annexe A — Relevés de l'étape 0

### Relevé 1 — Flotte d'agents, un mois

- **Commande** : `node scripts/relever-flotte.mjs --jours 30 --json`
- **Heure** : 2026-11-14T17:35:05
- **Sortie résumée** : 301 appels, 300 sous-agents. Par type : verificateur 114, general-purpose 124, campagne 37, explorateur 13, redacteur 8, constructeur 3, claude-code-guide 1. Part nommée : 58,8 %. Jetons sortie sous-agents : 10 171 355. Jetons relus sous-agents : 1 967 114 431. Médiane relus par sous-agent : 458 333. Médiane contexte initial : 29 356. Médiane appels outils : 11. Pic de simultanéité : 11. Délégations Opus sans effort : 42. Essai relecture d'intention : 67 relectures, 5 358 079 jetons, seuil non franchi.
- **Durée par agent** : calculée en interne pour la simultanéité, non publiée individuellement.

### Relevé 1 bis — Oracle de suivi des agents, un mois

- **Commande** : `node oracles/oracle-suivi-agents.mjs --depuis 2026-10-15T18:35`
- **Heure** : 2026-11-14T17:35:11
- **Sortie résumée** : verdict FAIL. 34 sessions lues, 16 agents jugés (au-delà de SEUIL_MIN = 17 min), 3 FAIL (cause : manque). `courseMin` publiés de 40,6 à 119,5 min.

### Relevé 2 — Journal de campagnes

- **Commande** : `wc -l todo/observabilite/flotte-campagnes.jsonl` et `tail -1`
- **Heure** : 2026-11-14T17:35:14
- **Sortie** : 8 lignes. Dernière ligne : `ts` 2026-11-14T13:45:11.296Z.

### Relevé 3 — Hooks SubagentStop

- **Commande** : `grep -rl SubagentStop gabarits oracles scripts .claude/settings.json` puis `~/.claude/settings.json` et les plugins
- **Heure** : 2026-11-14T17:35:15
- **Sortie** : **0 occurrence dans la Factory** (gabarits, oracles, scripts, `.claude/settings.json`). **0 occurrence dans `~/.claude/settings.json`**. 5 occurrences dans les plugins claude-mem (3 en cache, 2 en marketplace). Le plugin claude-mem (actif, clé `claude-mem@thedotmack` dans `enabledPlugins`) possède un hook SubagentStop asynchrone qui exécute `claude-mem hook claude-code subagent-stop`. Il appartient au plugin tiers, pas à la Factory.

### Relevé 4 — Coûts

- **Commande** : `ls` et `wc -l` sur `todo/observabilite/couts-pilot-*.jsonl` et `c:/dev/*/forge/couts-*.jsonl`
- **Heure** : 2026-11-14T17:35:21
- **Sortie** : Pilot poste Dell-XPS-16 : 60 lignes. Pilot poste DESKTOP-ULTRA7 : 21 lignes. Produits : 1 fichier, 6 lignes (Produit-d8e3). Le champ `temps_actif_s.<seuil>.sous_agents` est la seule durée publiée pour tous les agents, agrégée par session ; `sous_agents` en est le compte.

### Relevé 5 — Frictions

- **Commande** : `wc -l` et extraction des types de `.claude/frictions.jsonl` et `forge/frictions.jsonl`
- **Heure** : 2026-11-14T17:35:23
- **Sortie** : Pilot : 22 lignes, types `refus_hook` 16, `oracle_fail` 6. Produit-d8e3 : 23 lignes, types `refus_hook` 10, `oracle_fail` 11, `correction_humaine` 2.

### Relevé 6 — Œil critique

- **Commande** : lecture de `todo/oeil-critique-*.json` et `wc -l` sur les JSONL
- **Heure** : 2026-11-14T17:35:27
- **Sortie** : Poste Dell-XPS-16 : dernière exécution `ts` 2026-11-10T10:57:43.543Z, `fin` 2026-11-05. Poste DESKTOP-ULTRA7 : `ts` 2026-10-29T18:14:04.401Z, `fin` 2026-10-29. Volume : `oeil-critique-automatiques.jsonl` 14 lignes, `oeil-critique-scelles.jsonl` 43 lignes.

### Relevé 7 — Empreintes avant

- **Commande** : `git ls-files -z -- oracles scripts gabarits references .claude/agents todo/TODO.jsonl todo/CLASSES.json .claude/settings.json | grep -zv '.oracles.*\.json' | xargs -0 sha256sum > empreintes-avant.txt`
- **Heure** : 2026-11-14T17:35:58
- **Sortie** : 977 fichiers, empreintes écrites dans `$LOCALAPPDATA/Temp/etude-amelioration-agents/empreintes-avant.txt`.

## Annexe B — Candidature préparée

```json
{
  "ev": "creation",
  "id": "TF-2563",
  "titre": "Fiche d'exécution d'agent et mission agents de l'œil critique",
  "contenu": "Écrire une fiche d'exécution (13 champs) par hook SubagentStop, agréger au relevé de flotte, et étendre l'œil critique d'une mission agents qui dérive des pistes (≤ 5 par revue) versées au registre en candidat. Option O2 de l'étude du 14/11/2026.",
  "nature": "opportunite",
  "demandeur": "pilot, étude du 14/11/2026 sur l'amélioration continue des agents",
  "source": "output/03-etudes/Digit-AI - Étude - Amelioration continue des agents par leurs lecons - 20261114d.md",
  "date_demande": "2026-11-14",
  "forges_cibles_initiales": ["pilot", "forge-agents"],
  "score": { "gain": 3, "preuve": 2, "effort": 3, "valeur": 3 },
  "statut": "candidat"
}
```

Candidature(s) émise(s) : préparée, jouée sur copie, journalisée après la décision D-219.
