# Retours forges — Produit-61 — 20260909a

- **Contexte** : audit complet du produit, mené le 09/09/2026 par la forge d'audit après un retour humain sur le routage
- **Références ledger** : `forge\ledger.jsonl` seq 112, 119, 120, 121 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 2026-09-09

Ce lot remonte un défaut de routage signalé par le commanditaire et trois frictions rencontrées en menant l'audit avec la forge dédiée. Il se lit par forge : une phrase de contexte, puis un tableau où chaque ligne est un fait mesuré avec sa preuve.

Les identifiants numérotent les retours par forge, en continuité des lots précédents de ce produit : RP-8 est le huitième retour adressé au pilot ; RA-1, RA-2 et RA-3 sont les trois premiers retours adressés à la forge d'audit ; RT-7 et RT-8 sont les septième et huitième retours adressés à la forge de tests.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## pilot (`digit-ai-factory`)

Le tableau de routage du produit envoie le mot « audit » vers la forge de tests, et ne nomme jamais la forge d'audit.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-8 | bloquant | générique | Le tableau « Routage forge » du CLAUDE.md produit, hérité du gabarit du pilot, ne cite que la forge de tests pour « valider, clore » et ne mentionne nulle part la forge d'audit ni son référentiel de 175 contrôles sur 18 dimensions. Deux audits complets ont été rendus au commanditaire sans qu'aucune session n'ouvre la forge dédiée ; le défaut a été signalé par l'humain, pas par un oracle. Ledger seq 119. | ajouter une ligne de routage « auditer le produit » vers la forge d'audit dans le gabarit de CLAUDE.md, et distinguer en toutes lettres : la forge de tests mesure la couverture de test, la forge d'audit prononce l'audit du produit |

## forge-audit (`digit-ai-forge-audit`)

La chaîne complète a tourné du premier coup jusqu'au rendu ; deux bornes codées en dur ont coûté quatorze reformulations et trois actions perdues.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | majeur | générique | Le moteur de rapport borne sa reconnaissance des dimensions à celles allant de D00 à D16, alors que le référentiel fusionné en porte dix-huit, D00 à D17. Les trois écarts de gouvernance de l'intelligence artificielle sortent sous un identifiant de dimension non rattachée, hors du plan de remédiation remis à la forge de développement, avec un simple avertissement. Ledger seq 120. | étendre la borne à D17 et vérifier les autres bornes codées en dur ; un référentiel qui gagne une dimension ne doit pas perdre ses actions |
| RA-2 | majeur | générique | Le contrôle de redite applique le seuil bas de 25 %, réservé aux paires d'un même domaine, à l'ensemble du plan : la fonction qui détermine le domaine prend les trois premiers caractères de la source, or la source d'une action dérivée est l'identifiant de sa règle, dont les trois premiers caractères sont une constante commune à toutes. Vingt-six paires ont été refusées sur du vocabulaire d'audit partagé (« déclarer », « seuil », « procédure ») ; quatorze remédiations ont dû être reformulées sans gain pour le lecteur. Ledger seq 121. | lire la dimension de la règle plutôt que le préfixe de son identifiant, ou n'appliquer le seuil bas que lorsque le domaine est réellement renseigné |
| RA-3 | mineur | générique | Le runbook d'onboarding fait créer l'espace tenant sous `config/tenants/<slug>/` du dépôt de la forge, ce que le garde-fou « aucune écriture dans un dépôt de forge » interdit à une session produit. L'outil d'initialisation d'espace de travail permet de tout héberger chez le produit, mais le runbook ne le dit pas. | écrire dans le runbook que l'espace tenant d'un produit vit chez le produit, et donner la commande d'initialisation correspondante |

## forge-tests (`digit-ai-forge-tests`)

L'audit de couverture reste utile et complémentaire ; deux frictions déjà rencontrées se confirment.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-7 | majeur | générique | La forge ne monte pas l'instance malgré la commande de montage déclarée par le projet. Une session qui libère le port avant de lancer obtient quatre domaines à zéro avec le motif « navigation impossible », qui ne dit ni que l'instance devait être debout, ni que la commande déclarée n'a pas été jouée. Rapport du premier passage du 09/09. Ledger seq 112. | sonder l'adresse de base avant les domaines navigateur et refuser tôt en citant la commande de montage déclarée |
| RT-8 | mineur | générique | Le document de provenance de l'instance est lu par une clé nommée `format`, que le README ne documente pas pour la forme légère : il n'en cite que les champs. Un document écrit avec la clé `schema` sort en provenance non déterminable, sans que le motif nomme la clé attendue. | documenter la clé dans la forme légère et nommer la clé absente dans le motif de refus |

## Remarques restées au produit

Ce que le produit a corrigé chez lui, avec le verdict de généralisation de chacune.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le référentiel de classes de retours était périmé face au pilot | recopié depuis le pilot pendant l'audit, contrôle de conformité rouge → vert | non | l'oracle du socle a fait son travail, la copie est un geste de produit |
| Le document de provenance de l'instance portait la mauvaise clé | régénéré avec la clé attendue et le commit courant | oui | remonté ci-dessus, RT-8 |
| Le rapport d'audit de couverture n'avait pas de lecture humaine | une page de synthèse a été produite sur le socle de pages, en attendant que la forge de tests produise à nouveau son tableau de bord | non | le défaut de la forge est déjà remonté au lot précédent |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` sur ce lot : le rapport d'audit suit le gabarit de la forge d'audit, qui n'appartient pas à la bibliothèque documentaire du pilot. Vérifié par le pilot du run, le 09/09/2026.

## Confirmations positives

- La chaîne de la forge d'audit tient de bout en bout : validation de configuration, fusion des packs, porte machine du rapport, construction du rendu et vérification finale, toutes passées sur un produit qu'elle n'avait jamais vu.
- L'outil d'initialisation d'espace de travail permet d'auditer sans rien écrire dans le dépôt de la forge, ce qui rend le garde-fou tenable.
- Le refus des placeholders et le contrôle des critères de clôture ont attrapé un plan de remédiation incomplet que rien d'autre n'aurait signalé : cent vingt-cinq actions sans critère seraient parties telles quelles.

## Ordre recommandé

1. RP-8 : sans la ligne de routage, la prochaine session refera le même détour.
2. RA-2, puis RA-1 : le premier coûte des reformulations à chaque rapport, le second perd des actions.
3. RT-7, RA-3, RT-8.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RP-8 suit un retour humain direct. Aucune règle du socle n'oblige un tableau de routage à couvrir toutes les forges disponibles : une forge absente du tableau est invisible pour la session qui le lit, et rien ne le signale. La classe la plus proche du référentiel est `surface-implicite-non-livree` ; le pilot est invité à créer « forge disponible absente du tableau de routage ». RA-1 et RA-2 viennent d'oracles et relèvent de `fixture-jugee-par-son-seul-oracle`.
