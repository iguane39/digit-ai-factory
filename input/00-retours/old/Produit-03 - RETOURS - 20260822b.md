# Retours forges — Bibliothèque vidéo IA Enseigne-A — 20260822b

- **Contexte** : session du 22/08/2026, sur la **forme des listes de tâches** remises au
  développeur. Second lot du jour ; le premier (`20260822a`) portait sur le classement par
  acteur, celui-ci sur la **présentation** et sur ce que chaque ligne doit contenir.
- **Références ledger** : sans objet — retour hors run
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\`
- **Statut** : remis le 2026-08-22

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Origine de ce lot, et sa mesure principale.** Dans une seule session, le destinataire des
restitutions a dû **reformuler cinq fois la même exigence de forme** avant de l'obtenir :

1. *« Pourquoi ma demande précédente d'avoir une liste claire et exhaustive n'est pas traitée ?
   Pourquoi tout n'est pas dans un seul tableau ? »*
2. *« Et j'avais dit tous les IAs en premier qui peuvent être faits. Si plusieurs étapes, crée
   plusieurs tableaux »*
3. *« Tes textes ne sont pas assez précis ou ne veulent rien dire […] Des textes abscons avec des
   références qu'on ne connaît pas ou comprend pas ne permettent pas de décider rapidement et
   facilement. Revois complètement ta présentation »*
4. *« toujours pas claire, recommence »*
5. *« tableau !! »*

Les règles S11 à S16, livrées le matin même de cette session, tiennent le **contenu** d'une
action et d'une décision. **Aucune ne tient la FORME de la liste ni sa stabilité d'un message au
suivant** — et c'est exactement là que la session a coûté cinq allers-retours. Un contenu juste
présenté autrement à chaque fois oblige le lecteur à réapprendre la mise en page avant de lire.

---

## pilot (`digit-ai-factory`) — forme des listes, et stabilité de la restitution

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-17 | bloquant | générique | **Un renvoi par NUMÉRO DE LIGNE désigne une autre ligne au message suivant, parce que la liste est renumérotée à chaque fois.** Mesuré sur pièce : une restitution renvoyait « préalable : ligne 8 (droit IAM) puis ligne 5 (merge) », et le lecteur a répondu mot pour mot *« Que veut dire ligne 8 (droit IAM) puis ligne 5 (merge). C'est incompréhensible. »* Les deux numéros avaient effectivement changé de sens entre deux messages — le tri par urgence les avait déplacés. C'est le pendant, au niveau du RENVOI, de ce que **S14** corrige au niveau de l'item : S14 exige un identifiant stable **pour** l'action, rien n'interdit de la **désigner** par sa position. | Règle **S17** : un renvoi entre lignes nomme le **sujet**, jamais une position. Testable : dans le bloc 8 comme au bloc 3, un motif de la forme `ligne \d+`, `point \d+`, `n° \d+` est un défaut ; l'identifiant stable ou le sujet en clair sont les seules désignations acceptées. |
| RA-18 | majeur | générique | **Le classement par acteur a été rendu par des SECTIONS SÉPARÉES, ce qui détruit la liste unique que le lecteur demandait.** La consigne dit « par acteur ET par ordre » ; j'ai lu « une section par acteur », et le lecteur a dû demander deux fois : *« Pourquoi tout n'est pas dans un seul tableau ? »*, puis *« Et j'avais dit tous les IAs en premier »*. Les deux exigences sont compatibles et je les avais opposées : **l'acteur est une COLONNE, l'ordre est le TRI, et les IA remontent en tête par le tri**. Découper en sections oblige à scanner N listes et à recoller pour avoir le total. | Écrire au §8 de `RESTITUTION.md` que le classement par acteur est une **colonne**, pas un découpage ; qu'un découpage n'est légitime que par **ÉTAPE de calendrier** (ce que le lecteur a lui-même précisé : « si plusieurs étapes, crée plusieurs tableaux ») ; et que le tri place en tête ce qui est **exécutable par l'IA sans préalable**. |
| RA-19 | majeur | générique | **La forme change d'un message au suivant : prose, puis tableaux, puis fiches en prose, puis tableaux à colonnes différentes.** Relevé sur la même session : au moins cinq mises en page pour le même contenu, dont une réponse mêlant six sections et quatre formes de tableau distinctes. Le lecteur a tranché en trois mots — *« tableau !! »* — après avoir déjà écrit *« toujours pas claire, recommence »*. Le coût n'est pas esthétique : **à chaque changement, le lecteur réapprend la mise en page avant de pouvoir lire**, et perd la comparaison avec le message précédent. | Règle **S18** : la restitution d'un même sujet garde la **même structure de colonnes** d'un tour au suivant. Testable en tenant, à côté de la synthèse, l'empreinte des en-têtes de tableau du tour précédent : un changement d'en-têtes non déclaré est un défaut. À défaut de contrôle, l'écrire au référentiel comme règle de forme opposable. |
| RA-20 | majeur | générique | **Une ACTION ne porte ni son impact ni sa recommandation, alors qu'une DÉCISION les porte depuis S15/S16.** Demande littérale du lecteur : *« fournir des actions claires, les impacts de ces actions, les recos sur ces actions, des décisions claires, les impacts de ces décisions, les recos des décisions »*. Les deux moitiés sont symétriques dans sa phrase, et le référentiel n'en couvre qu'une : au bloc 8, S11 à S14 exigent le motif, la raison, l'exécutabilité et l'identifiant — **jamais ce qui se passe si l'action n'est pas faite**, ni ce que l'agent recommande. Or c'est cette colonne qui permet d'arbitrer ce qu'on laisse tomber. | Règle **S19** : toute action du bloc 8 porte **ce qui se passe si elle n'est pas faite**. Symétrique de S16 côté décisions. Le « et alors ? » d'une ligne de reste-à-faire est ce qui distingue une liste utile d'un inventaire. |
| RA-21 | majeur | générique | **Le langage commanditaire n'est exigé qu'au bloc 0 (S9) : tout le reste peut être écrit en jargon, et l'a été.** Mesuré sur cette session : le lecteur a demandé **deux fois de suite** l'explication du même point — *« détaille 5 »*, puis *« Explique 5 »* — parce que la première explication, pourtant longue et structurée, employait « justificatif fédéré », « identité system-assigned », « UAMI », « constat H2 », « filet » sans les gloser. La seconde, écrite sans aucun de ces termes, a été acceptée immédiatement. S9 traite l'ouverture parce que « une information remontée et non comprise a le même effet qu'une information tue » — **le même raisonnement vaut ligne par ligne**, et c'est au bloc 3 et au bloc 8 qu'il coûte le plus cher, puisque ce sont eux qu'on exécute. | Étendre la doctrine de S9 aux **cellules de sujet** des blocs 3 et 8 : un terme technique y porte sa glose d'une ligne, ou disparaît. Contrôle possible : une liste fermée d'acronymes internes détectés hors bloc 4-9 sans glose adjacente. À défaut, le poser comme règle de forme et l'exercer à la relecture. |
| RA-22 | mineur | générique | **Un journal de pipeline masque une adresse de tenant en la prenant pour un secret, ce qui rend une commande de secours inutilisable telle qu'imprimée.** Constaté le 22/08 sur un mode de test conçu pour imprimer son retour arrière AVANT le geste risqué : la commande est bien apparue, mais avec l'URL de l'émetteur remplacée par `***`. La précaution — imprimer le rollback avant d'agir — est donc annulée par le masquage au moment précis où elle servirait. Ce n'est pas propre à ce pipeline : tout secours imprimé dans un journal est exposé au même effet. | Au gabarit d'agent et aux consignes d'ops : un retour arrière **ne se publie pas seulement dans un journal**. L'écrire aussi en artefact, ou le composer à partir de valeurs non masquées, et **vérifier après coup qu'il est lisible** — une procédure de secours non testée à la lecture n'existe pas. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Une correction automatique du reste-à-faire a **supprimé** une ligne au lieu de la mettre à jour : le filtre de suppression et la boucle de réécriture visaient le même motif, et le filtre passait en premier | Ligne remise dans la minute, repérée par le compteur de la projection qui affichait 12 améliorations au lieu de 13 | non | Défaut de mon script d'édition, pas du référentiel. Ce qui l'a rattrapé est en revanche déjà générique : la projection **compte** ce qu'elle rend, et c'est ce compteur qui a montré l'écart. La leçon est déjà tenue par l'outil. |
| Un `git add -A` a versionné un dossier de comité de changement dont le versionnement avait été **explicitement écarté** — écarter n'est pas répondre oui | Retiré du suivi, fichiers intacts, dossiers entrés au `.gitignore` | non | Le défaut est un geste trop large de ma part, pas une règle manquante : la doctrine dit déjà de ne pas élargir le périmètre décidé. |
| Trois casses d'identifiants Azure ont cassé l'adoption d'un environnement, une par passage | Types canoniques écrits dans le pipeline, avec la raison | non | Spécifique au fournisseur Azure et au provider Terraform ; aucune forge de l'écosystème n'est concernée. Reste dans le produit, documenté sur place. |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot. Les seuls référentiels
mobilisés sont `gabarits\RESTITUTION.md` (version_du_gabarit 2.8.0 au moment du lot) — consigne
normative, non marquée comme livrable — et `gabarits\RETOURS-FORGES.md` pour ce lot lui-même, dont
les sections R-45 et R-46 ont été trouvées et remplies sans ajout hors gabarit.

## Confirmations positives

- **S11 à S16 ont tenu leur promesse sur le CONTENU.** Les motifs de non-exécution, les raisons
  d'impossibilité, les chemins exécutables et les recommandations sourcées ont été écrits sans
  effort une fois les règles en place. Aucun des cinq rappels du lecteur ne portait sur ces
  points — ils portaient tous sur la **forme** et sur la **stabilité**, que rien ne tient encore.
- **S16 a été utile le jour même de sa livraison**, et sur le cas qui l'avait fait naître : le
  nom d'un rôle réclamé au lecteur se trouvait à la première ligne d'un dossier déjà fourni. La
  règle a transformé une question en réponse sourcée.
- **La règle « le retour arrière s'imprime AVANT le geste »** a fonctionné exactement comme prévu
  sur un geste coupant réel — sous réserve de RA-22, qui en signale la limite.

## Ordre recommandé

1. **RA-17** — le moins cher et le plus immédiat : un renvoi par numéro est faux dès le message
   suivant, et le lecteur l'a signalé mot pour mot.
2. **RA-18** puis **RA-19** — les deux qui ont coûté les cinq rappels. La première est une phrase
   à écrire au référentiel, la seconde demande de décider si la stabilité de forme se contrôle ou
   s'énonce.
3. **RA-20** — symétrie avec S16, faible effort, et c'est la colonne qui permet d'arbitrer ce
   qu'on abandonne.
4. **RA-21** — le plus structurant : il étend au corps de la restitution la doctrine que le
   bloc 0 tient déjà seul.
5. **RA-22** — mineur, mais il annule une précaution au moment précis où elle sert.
