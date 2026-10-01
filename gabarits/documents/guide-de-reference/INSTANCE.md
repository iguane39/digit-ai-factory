---
marque: Digit-AI
marque_html: Digit<em>-</em>AI
objet: Guide du développeur
sous_titre: Plateforme Atelier
description: Guide du développeur de la plateforme Atelier, en cinq vues : démarrer, installer le poste, standards de code, livrer en production et référence. Chaque règle citée ouvre sa fiche, et le fichier source s'ouvre sans quitter le guide.
role_destinataire: les développeurs qui rejoignent la plateforme Atelier, pour installer leur poste, appliquer les règles opposables et livrer une première version en production sans aide
version: 20260924a
source_affichee: docs/GUIDE-DEVELOPPEUR.md
cle_theme: atelier-guide-theme
favicon_lettre: a
gabarit: gd-guide-de-reference
version_du_gabarit: 1.0.0
---

# Guide du développeur — Plateforme Atelier

## Démarrer — le parcours et les trois premiers gestes
<!-- vue: cle="demarrer" libelle="Démarrer" annonce="le parcours en quatre étapes et les questions fréquentes" inventaire="Cette vue porte le parcours d'arrivée en quatre étapes, la table des douze questions les plus posées avec la vue qui y répond, et la formule à coller dans un prompt pour que l'agent applique ce guide." -->

Ce guide dit ce qu'un développeur doit faire pour passer d'un poste vierge à une première version en production sur la plateforme Atelier, et où se lit chaque règle qui l'engage.

### 1 — Le parcours en quatre étapes

Quatre étapes, dans cet ordre : chacune suppose la précédente faite, et la dernière est la seule qui engage la production.

| Étape | Ce que vous faites | Vue qui le détaille | Durée constatée |
|---|---|---|---|
| 1 | Installer le poste et vérifier chaque outil | [Installer le poste](#installer-le-poste) | une demi-journée |
| 2 | Lire les trois règles opposables | [Standards de code](#standards-de-code) | une heure |
| 3 | Ouvrir le dépôt de votre service | [Standards de code](#standards-de-code) | une heure |
| 4 | Livrer une première version | [Livrer en production](#livrer-en-production) | une journée |

**Exemple de lecture.** La quatrième ligne se lit : livrer une première version prend une journée, et la vue « Livrer en production » en donne les six étapes.

### 2 — Les questions les plus fréquentes

Les douze questions posées le plus souvent par les nouveaux arrivants, chacune renvoyée à la vue qui y répond ; la table se filtre et se trie par colonne.

| Question | Vue qui répond | Thème |
|---|---|---|
| Quels outils installer, et dans quelle version ? | [Installer le poste](#installer-le-poste) | poste |
| Comment savoir que l'éditeur est bien installé ? | [Installer le poste](#installer-le-poste) | poste |
| Qui me donne l'accès au dépôt de mon service ? | [Installer le poste](#installer-le-poste) | accès |
| Comment nommer un nouveau dépôt ? | [Standards de code](#standards-de-code) | règle |
| Puis-je laisser une dépendance sans version figée ? | [Standards de code](#standards-de-code) | règle |
| Quel format donner à mes journaux ? | [Standards de code](#standards-de-code) | règle |
| Qui approuve une demande de fusion ? | [Livrer en production](#livrer-en-production) | livraison |
| Combien de temps dure une mise en production ? | [Livrer en production](#livrer-en-production) | livraison |
| Comment revenir à la version précédente ? | [Livrer en production](#livrer-en-production) | livraison |
| Que veut dire « artefact » dans ce guide ? | [Référence](#reference) | vocabulaire |
| À qui signaler une règle qui ne tient pas ? | [Référence](#reference) | contact |
| Où se trouve la source de ce guide ? | [Référence](#reference) | contact |

**Exemple de lecture.** La septième ligne se lit : la personne qui approuve une demande de fusion est nommée dans la vue « Livrer en production ».

### 3 — Faire appliquer ce guide par un agent

Un agent de code applique ce guide si on le lui cite : la formule ci-dessous se colle en tête d'un prompt, telle quelle.

```
Applique le guide du développeur de la plateforme Atelier (docs/GUIDE-DEVELOPPEUR.md) : ses règles STD-R01 à STD-R03 sont opposables, et toute exception se déclare dans la demande de fusion avec son motif.
```

**Attention.** La formule cite la source Markdown et non la page : l'agent lit le fichier du dépôt, qui fait foi, et la page n'en est que le rendu.

## Installer le poste — outils, accès, vérifications
<!-- vue: cle="poste" libelle="Installer le poste" annonce="l'éditeur, la ligne de commande et les accès" inventaire="Cette vue porte les trois gestes de préparation d'un poste, tous faisables sans droits d'administrateur : l'éditeur, la ligne de commande de la plateforme et la demande d'accès. Chaque geste finit par sa commande de vérification." -->

Un poste est prêt quand ses trois vérifications répondent : rien d'autre ne se suppose, et chaque geste se fait sans droits d'administrateur.

### 1 — Installer l'éditeur

L'éditeur s'installe dans le profil de l'utilisateur, ce qui évite toute demande de droits et toute attente d'un service support.

**Télécharger l'installeur utilisateur.** Prendre la version « utilisateur » et non la version « système » : seule la première s'installe sans élévation de droits.

**Ajouter les deux extensions de la plateforme.** Le formateur de code et le vérificateur de style : ce sont eux que la chaîne de livraison rejoue, et les avoir au poste évite de découvrir un écart à la fusion.

**Vérification.** La commande `editeur --version` répond par un numéro, et la palette de l'éditeur liste les deux extensions.

### 2 — Installer la ligne de commande

La ligne de commande de la plateforme publie, observe et reprend un service ; elle se pose par un paquet décompressé dans le profil.

```
atelier --version
atelier connexion --locataire atelier-interne
atelier services lister
```

**Vérification.** La troisième commande liste au moins un service : la connexion est faite et les droits de lecture sont posés.

### 3 — Obtenir ses accès

L'accès au dépôt de votre service se demande par un formulaire unique, et le délai constaté est d'un jour ouvré.

> Une demande qui ne nomme pas le service visé est renvoyée sans suite : écrivez son nom exact, tel qu'il figure au catalogue de la plateforme.

**Vérification.** Le dépôt s'ouvre dans l'éditeur, et une branche de travail s'y crée sans message d'erreur.

## Standards de code — les trois règles opposables
<!-- vue: cle="standards" libelle="Standards de code" annonce="nommer, verrouiller, journaliser" inventaire="Cette vue porte les trois règles opposables de la plateforme — nommage des dépôts, dépendances verrouillées, format de journal — chacune avec son niveau, sa source et ses exceptions, puis la table des contrôles qui les rejouent." -->

Trois règles sont opposables : une demande de fusion qui en enfreint une est refusée, sauf exception déclarée avec son motif.

### `STD-R01` — Nommer les dépôts

**Niveau : obligatoire**

**Source** : charte de la plateforme, révision de septembre 2026.

**Exceptions** : les dépôts d'archives, qui gardent leur nom d'origine.

Un dépôt se nomme `<domaine>-<service>` en minuscules, séparé par un tiret : le nom se lit alors dans tout outil sans table de correspondance.

**Choisir le domaine.** Le domaine est celui du catalogue de la plateforme, jamais un sigle d'équipe : une équipe se réorganise, un domaine reste.

**Exemple de lecture.** Le nom `paiement-remboursements` est conforme ; `PaiementRemb` ne l'est pas deux fois, par la casse et par l'abréviation.

### `STD-R02` — Verrouiller les dépendances

**Niveau : obligatoire**

**Source** : incident de construction du 12/05/2026, constaté sur trois services.

**Exceptions** : aucune.

Toute dépendance porte une version exacte dans le fichier de verrouillage versionné : une construction rejouée un mois plus tard produit alors le même artefact.

**Vérifier le verrouillage.** La commande `atelier dependances verifier` échoue si une dépendance flotte ; elle se joue avant chaque demande de fusion, comme le dépôt nommé selon `STD-R01`.

### `STD-R03` — Journaliser au format commun

**Niveau : recommandé**

**Source** : guide d'observabilité de la plateforme.

**Exceptions** : les scripts ponctuels de migration, dont les journaux ne sont pas collectés.

Chaque ligne de journal est un objet JSON portant `horodatage`, `niveau`, `service` et `message` : la collecte le lit sans analyseur propre au service.

**Attention.** Une valeur secrète ne se journalise jamais, même tronquée : un fragment de jeton suffit parfois à le rejouer.

### Les contrôles qui rejouent ces règles

Chaque règle est rejouée par un contrôle de la chaîne de livraison ; le tableau dit lequel, et quand il bloque.

| Règle | Contrôle | Quand il bloque |
|---|---|---|
| `STD-R01` | vérification du nom à la création du dépôt | à la création |
| `STD-R02` | `atelier dependances verifier` | à la demande de fusion |
| `STD-R03` | échantillonnage des journaux en qualification | au passage en production |

**Exemple de lecture.** La deuxième ligne se lit : une dépendance qui flotte bloque la demande de fusion, par la commande de vérification du verrouillage.

## Livrer en production — les six étapes et leurs preuves
<!-- vue: cle="production" libelle="Livrer en production" annonce="six étapes, une approbation, un retour arrière" inventaire="Cette vue porte les six étapes d'une livraison, chacune dépliable dans sa ligne avec son geste et sa vérification, puis la conduite d'un retour arrière." -->

Une livraison suit six étapes ; chacune se déplie dans sa ligne et dit son geste et la preuve qui la clôt.

### 1 — Le déroulé en six étapes

Le tableau porte les six étapes dans l'ordre ; ouvrir une ligne affiche son geste et sa vérification sans quitter le tableau.

<!-- deplier:etapes -->
| # | Étape | Qui |
|---|---|---|
| 1 | Ouvrir la demande de fusion | le développeur |
| 2 | Faire relire | un pair de l'équipe |
| 3 | Construire l'artefact | la chaîne de livraison |
| 4 | Déployer en qualification | la chaîne de livraison |
| 5 | Faire approuver | le responsable du service |
| 6 | Déployer en production | la chaîne de livraison |

**Exemple de lecture.** La cinquième ligne se lit : c'est le responsable du service qui approuve, et sa ligne ouverte dit sur quelles preuves.

**Étape 1 · Ouvrir la demande de fusion.** Depuis la branche de travail, vers la branche principale, en citant l'exigence servie.

**Vérification.** La demande porte un lien vers son exigence et passe le contrôle de nommage.

**Étape 2 · Faire relire la modification.** Un pair relit le code et les tests ; une remarque bloquante se lève avant la fusion.

**Étape 3 · Construire l'artefact versionné.** La chaîne construit l'artefact une seule fois et lui donne son numéro de version.

**Vérification.** L'artefact porte le numéro de la version et son empreinte est consignée.

**Étape 4 · Déployer en qualification.** Le même artefact est déployé en qualification, où les journaux sont échantillonnés.

**Étape 5 · Faire approuver la livraison.** Le responsable du service approuve au vu des preuves des étapes précédentes.

**Étape 6 · Déployer en production.** Le même artefact, jamais reconstruit, passe en production.

**Vérification.** Le point de vérification d'état du service répond, et la version affichée est celle de l'artefact.

### 2 — Revenir en arrière

Un retour arrière redéploie l'artefact précédent ; il ne reconstruit rien et se décide sans nouvelle approbation.

**Redéployer l'artefact précédent.** La commande `atelier deployer --version <precedente>` remet en service la version antérieure, telle qu'elle a été approuvée.

**Vérification.** La version affichée par le point de vérification d'état redevient la précédente, en moins de cinq minutes.

## Référence — vocabulaire et contacts
<!-- vue: cle="reference" libelle="Référence" annonce="le vocabulaire du guide et à qui s'adresser" inventaire="Cette vue porte le vocabulaire employé par le guide, défini une fois, et la table des contacts par sujet." -->

Les mots de ce guide ont un sens précis, défini ici une fois ; les contacts disent à qui s'adresser selon le sujet.

### 1 — Vocabulaire

Chaque terme employé par le guide, avec le sens qu'il y prend et la vue où il sert le plus.

| Terme | Sens dans ce guide | Vue où il sert |
|---|---|---|
| artefact | le paquet construit une fois et déployé tel quel partout | Livrer en production |
| branche de travail | la branche où une modification se prépare, avant fusion | Livrer en production |
| demande de fusion | la proposition de verser une branche dans la principale | Livrer en production |
| domaine | la famille de services du catalogue de la plateforme | Standards de code |
| exception | un écart à une règle, déclaré avec son motif | Standards de code |
| fichier de verrouillage | le fichier qui fige la version de chaque dépendance | Standards de code |
| point de vérification d'état | l'adresse qui dit si le service répond | Livrer en production |
| qualification | l'environnement où l'artefact est éprouvé avant production | Livrer en production |
| retour arrière | le redéploiement de l'artefact précédent | Livrer en production |

**Exemple de lecture.** La sixième ligne se lit : le fichier de verrouillage fige la version de chaque dépendance, et c'est la règle `STD-R02` qui l'exige.

### 2 — À qui s'adresser

Un sujet, un rôle : le rôle répond, et il renvoie au bon interlocuteur s'il ne l'est pas.

| Sujet | Rôle à contacter | Délai de réponse constaté |
|---|---|---|
| accès au dépôt | l'équipe plateforme | un jour ouvré |
| règle qui ne tient pas | le responsable des standards | trois jours ouvrés |
| source de ce guide | le responsable des standards | trois jours ouvrés |

**Exemple de lecture.** La deuxième ligne se lit : une règle qui ne tient pas se signale au responsable des standards, qui répond en trois jours ouvrés.
