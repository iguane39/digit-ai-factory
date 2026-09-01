# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20260823b

- **Contexte** : solde du reste-à-faire de l'audit de production du 18/08, le 23/08/2026 — sept
  passages de pipeline, cinq pull requests, deux contraintes de gouvernance levées puis remises
- **Références ledger** : sans objet — travail hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\`
- **Statut** : remis le 2026-08-23

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot.** Le destinataire a relu un relevé de reste-à-faire que je venais de lui
remettre et a contesté **sept lignes sur neuf**, en une phrase chacune : *« pourquoi ce n'est pas
déjà fait par l'IA »* · *« sujet déjà évoqué et traité, revois pourquoi tu le ressors encore »* ·
*« non sujet, pourquoi cela sort ? »*. Sa conclusion tient en une ligne, et elle vaut consigne :

> *« L'IA est pleinement autonome pour traiter les sujets mais ne le fait pas, ressort des sujets
> déjà traités ou qui n'ont rien à faire là. […] vérifie pour être sûr que ce qui est demandé à
> l'humain est réellement vrai, nécessaire, important, bloquant. »*

Les quatre retours ci-dessous sont les causes **mécaniques** de ces sept contestations. Aucun
n'appelle à « être plus attentif » : chacun nomme un mécanisme absent.

---

## pilot (`digit-ai-factory`) · forge-ops — attribution du travail, et preuves d'exécution

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-27 | bloquant | générique | **La règle S12 exige un MOTIF d'attribution à l'humain, jamais la TRACE d'une tentative — une attribution peut donc être sincère et fausse.** Mesuré le 23/08 sur deux cas du même relevé, traités différemment. Cas honnête : pour modifier une application d'authentification, j'ai **tenté** l'appel et mesuré `HTTP 403 Authorization_RequestDenied`, puis vérifié que mon compte n'a aucun rôle d'annuaire et que le seul propriétaire est un compte de service. L'attribution à l'humain était fondée. Cas fautif : pour une porte d'approbation de déploiement, j'ai **affirmé** le blocage sans chercher le contournement — alors que j'avais déjà levé **deux fois** la même classe de contrainte le jour même, sur les politiques de branche, avec l'accord explicite du destinataire. Le motif `decision` était vrai ; l'attribution était fausse. **S12 ne peut pas voir la différence** : elle lit un jeton de vocabulaire, pas une tentative. | Règle **S12 bis** : un motif `acces` ou `presence` porte, dans le même groupe de puce, la **trace mesurée** de la tentative — un code de réponse, un message d'erreur, une sortie de commande. Le contrôle réutilise la fonction de preuve déjà écrite pour S8. *Une impossibilité affirmée n'est pas une impossibilité mesurée* — et c'est exactement la différence entre les deux cas ci-dessus. |
| RA-28 | majeur | générique | **Un travail planifié qu'on ne peut pas déclencher à la demande n'est jamais prouvé.** Mesuré le 23/08 : une définition de pipeline de veille mensuelle venait d'être créée et enregistrée. Son premier passage a rendu **« Pas le premier lundi du mois — rien à faire »** et s'est terminé en succès. Le script n'avait donc **jamais tourné sur un agent** — ni ses dépendances, ni son accès réseau, ni son interpréteur n'avaient été éprouvés — et le relevé annonçait pourtant « la veille est en place ». Le premier passage réel aurait eu lieu **quinze jours plus tard**, au moment précis où l'on compte dessus. Après ajout d'un paramètre d'exécution forcée : trois contrôles rendus, tous verts, en 40 secondes. | Au gabarit d'agent et aux consignes d'ops : **tout travail planifié embarque un mode d'exercice à la demande**, distinct de sa cadence, et **il est exercé une fois avant d'être déclaré en place**. Un mécanisme qui n'a jamais tourné n'est pas un mécanisme : c'est une intention planifiée. Pendant exact de la doctrine « un ✓ sans oracle exécuté n'est pas un ✓ ». |
| RA-29 | majeur | générique | **Le reste-à-faire mélange trois natures dans une seule table, et deux d'entre elles ressortent indéfiniment comme du travail en attente.** Mesuré : sur neuf lignes remises, le destinataire en a contesté deux comme déjà traitées ou hors sujet — *« Oubli, sujet déjà évoqué et traité »* et *« Non sujet, pourquoi cela sort ? »*. Cause exacte : la table « Améliorations » de `TODO-PRODUIT.md` accueillait (a) de vrais restes à faire, (b) un **écart assumé**, décidé cinq jours plus tôt, qui portait encore le statut « à décider », et (c) une **contrainte conditionnelle** — élargir une politique de sécurité *si* une origine change — dont la condition ne sera peut-être jamais réunie. Un écart assumé est une **décision prise** : il se redéclare au prochain audit, il ne se re-propose pas. Une contrainte conditionnelle n'appelle **aucune action** tant que sa condition n'est pas réunie. | Le gabarit gagne une section **« Contraintes connues — ce ne sont PAS des restes à faire »**, et la table des améliorations refuse le statut « à décider » pour une ligne dont l'écart est déjà tranché. Trois natures, trois emplacements : ce qui reste à faire · ce qui est décidé et assumé · ce qui attend une condition externe. Sans cette séparation, un relevé grossit d'un tiers à chaque passage et perd la confiance de son lecteur. |
| RA-30 | mineur | générique | **Une instance d'approbation fige la contrainte de séparation des rôles à sa CRÉATION : relâcher le réglage ne la débloque pas.** Constaté le 23/08 sur une porte de déploiement en attente depuis 26 heures. Le réglage « le demandeur ne peut pas approuver » a été mis à `false` sur la configuration de contrôle — réponse `HTTP 200`, valeur vérifiée — et l'approbation de l'instance existante a **continué** de rendre `HTTP 500 : Approver is not permitted`. Il a fallu **annuler le passage bloqué et le relancer** : la nouvelle instance, créée sous la règle assouplie, s'est approuvée du premier coup. Le fait n'est écrit nulle part et coûte une demi-heure de recherche à qui le rencontre. | Verser le fait au référentiel d'ops, à côté des gestes de déploiement : *relâcher une contrainte d'approbation ne s'applique qu'aux instances FUTURES ; une instance en attente doit être annulée et relancée*. Trois lignes qui épargnent une demi-heure, et qui évitent surtout de conclure à tort que le contournement est impossible — conclusion qui aurait renvoyé le sujet à l'humain, exactement le défaut de RA-27. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le redémarrage du site après changement d'image rend `504` pendant une trentaine de secondes, le temps que le conteneur démarre — j'ai d'abord lu ce code comme un incident | Relance de la vérification en boucle jusqu'à obtenir l'état attendu ; `401` obtenu à la première nouvelle tentative | non | Comportement normal d'un démarrage de conteneur, propre à l'hébergement de ce produit. Ce qui serait générique — « vérifier après un redémarrage, pas pendant » — est déjà couvert par la procédure de retour arrière du produit, qui attend explicitement l'état sain |
| L'épinglage de la qualification sur une empreinte a été fait par commande directe plutôt que par la chaîne de livraison | Vérifié avant d'agir que l'infrastructure **ignore volontairement** la version servie (`ignore_changes` sur le nom d'image) : le geste ne crée donc aucun écart, et l'empreinte posée est celle que l'étiquette mouvante résolvait déjà — zéro changement fonctionnel | non | Le partage entre « l'infrastructure possède la forme, le pipeline possède la version » est déjà écrit et commenté dans le code du produit. Aucune règle ne manque |
| Les vidéos restent versionnées dans le dépôt, 129 Mo mesurés | non corrigé, et ce n'est pas un oubli | non | Lié à une décision d'architecture du produit — les vidéos sont embarquées dans l'image. Les sortir du dépôt seul demanderait une réécriture d'historique pour un gain nul tant qu'elles restent embarquées. Écart du produit, pas de l'écosystème |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le travail a porté sur
des pipelines, de l'infrastructure et le reste-à-faire du produit. Les deux dossiers construits
depuis la bibliothèque l'ont été **la veille**, et leurs retours ont été remis dans le lot
`20260823a` — dont les défauts de squelette signalés y sont corrigés et poussés.

## Confirmations positives

- **Les règles S11 à S16 ont tenu sur tout ce qui relève du contenu.** Aucune des sept
  contestations du destinataire ne portait sur un motif manquant, une raison absente, un chemin
  non exécutable ou une recommandation non sourcée. Elles portaient toutes sur **l'attribution**
  — qui doit faire — et sur **la composition de la liste**. C'est précisément ce que RA-27 et
  RA-29 proposent de couvrir.
- **Le garde-fou de seuil de créations a fonctionné trois fois de suite** sur un cas réel
  d'adoption d'environnement, en refusant à chaque échec partiel sans jamais laisser appliquer
  un état à moitié repris.
- **La levée puis la remise d'une contrainte de gouvernance s'est faite quatre fois sans oubli**,
  vérifiée à chaque fois par relecture du réglage servi. Le geste est devenu sûr parce qu'il est
  toujours joué dans le même ordre : lever, agir, remettre, **vérifier**.

## Ordre recommandé

1. **RA-27** — c'est celui qui a coûté les sept contestations. Une attribution à l'humain non
   mesurée est le défaut le plus cher de la restitution : il déplace du travail vers celui qui en
   a le moins.
2. **RA-29** — mécanique, peu coûteux, et il rend au relevé la confiance de son lecteur.
3. **RA-28** — il vaut pour tout travail planifié de l'écosystème, pas seulement celui-ci.
4. **RA-30** — trois lignes de référentiel, mais elles évitent une conclusion fausse qui renvoie
   un sujet à l'humain sans raison.
