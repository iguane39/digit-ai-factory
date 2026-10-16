# Retours forges — Produit-02 — 20261001a

- **Contexte** : autre — remontée demandée par l'exploitant le 01/10/2026, après qu'un réglage du compte Google Ads lui eut été laissé à faire à la main pendant trois jours, alors qu'un accès automatisé capable de l'exécuter existait depuis le 23/09. Demande, mot pour mot : « remonte à la Factory le fait que tu as demandé des actions manuelles alors qu'elles auraient pu être faites automatiquement et que l'objectif est de maximiser les opérations automatisées et réduire au minimum les opérations manuelles, ce qui n'a pas été le cas ici ». Heures en heure de Paris.
- **Références ledger** : `forge\ledger.jsonl` seq 362 (entrée `type: retour`, destinataire `digit-ai-factory`) ; contexte : seq 359 (question de l'exploitant), seq 360 (retour au produit, même fait vu du produit), seq 361 (etape_close).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` : le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre
- **Complétude** : ce lot ne porte que le retour demandé par l'exploitant. Les 26 autres entrées `type: retour` destinées à la factory depuis le dernier lot (seq 292 à 353) n'y sont pas : elles restent en instance pour le lot de clôture du prochain run, comme le prévoit le routage du produit.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Factory (`digit-ai-factory`)

Trois restitutions jugées conformes ont confié à l'humain un geste que l'agent pouvait faire seul. Le réglage est resté hors du compte pendant trois jours, jusqu'à ce que l'exploitant demande pourquoi. Une fois la question posée, il a suffi d'une exécution d'une minute.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-100 | majeur | générique | **Une action est laissée à l'humain alors qu'un accès automatisé capable de l'exécuter existe déjà, et aucune règle ne demande d'essayer cette voie d'abord.** Le 22/09, le produit écrit un outil qui calcule les changements à porter dans le compte Google Ads et les sort en fichier « pour que l'exploitant le dépose ». Son en-tête dit : « Il n'appelle jamais une méthode d'écriture de l'API : le seul geste qui modifie le compte reste celui de l'exploitant ». Ce jour-là, seul un accès en lecture existe. Le 23/09, un compte de service en écriture est créé, et il écrit 3 fois dans le compte le soir même : conversion, activation, date de départ (journal du compte). Le circuit manuel n'est jamais réexaminé. Le 28/09, l'exploitant retient des exclusions et 2 plafonds d'enchère ; les restitutions du 28/09, du 29/09 et du 01/10 lui laissent le dépôt, en action `manuelle_utilisateur` à raison `decision`, avec un guide en tête redonné 3 fois. Le dépôt n'est pas fait en 3 jours ; pendant ce temps, 3,19 € sont dépensés le 29/09 sur des recherches que ces exclusions bloquaient. Le 01/10, l'exploitant demande : « Pourquoi est-ce que je dois faire des opérations manuelles ? Pourquoi ce n'est pas automatisé ? ». Mesure faite ensuite, en quelques minutes : un essai `validate_only` avec l'accès en écriture → 92 exclusions et 2 plafonds acceptés par Google. Après son accord, l'application se fait à 19:53 en une exécution, et le relevé de conformité tombe de 7 écarts à 0. Les 3 restitutions étaient PASS : S13, S34, S49, S52 et S53 jugent qu'un geste humain est exécutable, accompagné et sourcé, mais aucune ne juge qu'il DEVAIT être humain. La raison `decision` était fausse : la décision (appliquer les réglages) était prise depuis le 28/09, et ce qui restait n'était plus qu'une exécution. R-29 (« voie automatisée par défaut dans toute démarche proposée ») est écrite au `CLAUDE.md` du produit, et rien ne la joue. Ledger seq 362. | **(1)** Dans `oracle-synthese`, le symétrique de S25 pour l'automatisation : une action `manuelle_utilisateur` à raison `decision` ou `acces` porte la TRACE de la voie automatique essayée (code de retour, sortie d'un `validate_only` ou d'un essai à blanc), ou cite la source qui établit qu'aucun accès automatisé ne peut la faire. **(2)** La raison `decision` ne vaut que pour un CHOIX encore ouvert, jamais pour l'exécution d'un choix déjà rendu par sélecteur : « 101a » autorise l'agent à exécuter ce qu'il peut exécuter. **(3)** Quand un accès change (nouveau compte de service, nouveau droit, nouvelle clé), l'inventaire des actions manuelles en cours se rejoue à l'ouverture de session. **(4)** Rendre l'objectif mesurable : chaque restitution compte ses actions `manuelle_utilisateur`, et le relevé du pilot suit ce compte par produit, pour que « réduire le manuel au minimum » se voie. Règle qui aurait évité le retour : R-29, écrite mais jouée par aucun oracle — classe à créer. |

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé chez lui, et pourquoi la classe est malgré tout remontée.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| L'outil des changements Google Ads ne prévoit qu'un dépôt manuel, conçu avant l'accès en écriture | réglages appliqués par l'accès de gestion le 01/10 (journal du compte, avant → après) ; un mode « plan » de l'outil de gestion, avec aperçu, écriture et journal, est prévu au prochain run (ledger seq 360) | oui | généralisable : remonté en RT-100, la classe vaut pour tout produit dont les accès évoluent en cours de vie |
| `ads-delta.py --help` écrit un fichier de changements au lieu d'afficher l'usage | fichier retiré dans le tour ; garde des arguments prévue au prochain run (ledger seq 357) | non | rien de généralisable au-delà de ce script : la règle « refuser un argument inconnu » est déjà remontée pour `ledger.py` (RT-98) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — vérifié par la session, le 01/10/2026. Les restitutions en cause suivent `gabarits\RESTITUTION.md`, hors de la bibliothèque `gabarits\documents\` : ce qui y manque est remonté en RT-100.

## Confirmations positives

- **Le guide en tête (S53, TF-1361)** a tenu sa promesse : l'exploitant n'a plus redemandé la procédure. C'est aussi ce qui a rendu le défaut visible : un geste bien accompagné reste un geste qui n'aurait pas dû lui revenir.
- **L'aperçu `validate_only` de l'API Google Ads** joue le rôle de l'écran d'aperçu humain : 94 opérations contrôlées par Google sans effet, puis appliquées à l'identique et journalisées avant → après. Le contrôle que le circuit manuel prétendait garder est conservé.
- **Le relevé de conformité au plan** a prouvé l'application en sortie : 7 écarts avant, 0 écart après, et l'outil des changements rend « Aucun changement ».

## Ordre recommandé

1. **RT-100 (2) d'abord** — interdire la raison `decision` pour l'exécution d'un choix déjà rendu : c'est une ligne de règle, et elle aurait suffi ici, la décision étant rendue depuis le 28/09.
2. **RT-100 (1)** ensuite — la trace de la voie automatique essayée : même forme que S25, déjà éprouvée.
3. **RT-100 (3) et (4)** — le réexamen à chaque changement d'accès, et le compte des actions manuelles, qui rend l'objectif lisible.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- **RT-100** suit un retour humain (« Pourquoi est-ce que je dois faire des opérations manuelles ? Pourquoi ce n'est pas automatisé ? »). La règle existe — R-29, « voie automatisée par défaut dans toute démarche proposée, actions restantes classées IA / développeur / utilisateur » — mais aucun oracle ne la joue : le classement des actions est jugé sur sa FORME (acteur, raison, guide), jamais sur sa JUSTESSE. **Classe à créer** — clé proposée `geste-humain-substitue-a-une-voie-automatisable`, famille `restitution-forme`, libellé : « Une action est laissée à l'humain (manuelle_utilisateur) alors qu'un accès automatisé capable de l'exécuter existe : la raison d'impossibilité est déclarée sans que la voie automatique ait été essayée, ou un circuit manuel conçu sous un état d'accès dépassé survit à l'arrivée d'un accès plus large. » Aucune clé existante ne convient : `restitution-action-humaine-geste-agent` (S34) vise une ligne ou un fichier à ÉCRIRE par l'humain, pas un réglage que l'agent peut appliquer par une API.
