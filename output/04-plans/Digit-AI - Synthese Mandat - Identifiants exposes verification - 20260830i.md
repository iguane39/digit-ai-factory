---
destinataire: humain
---

# Synthèse de mandat — ce qu'ouvrent réellement les onze porteurs de secrets du poste (30/08/2026)

Vous avez demandé de vérifier ce que ces identifiants ouvrent avant de faire quoi que ce soit.
C'est fait, fichier par fichier, sans qu'aucune valeur ne soit reproduite nulle part — ni dans mes
commandes, ni dans ce document, qui vit dans un dépôt. Le résultat est nettement plus étroit que
l'alerte : sur les onze fichiers signalés, deux ne contiennent aucun mot de passe, trois ne
portent que des adresses et des chemins, et un seul jeu d'identifiants applicatifs est réellement
publié — dans un dépôt privé, pas public. En revanche deux jetons de déploiement traînent hors de
tout dépôt, donc hors de toute protection, et ceux-là ouvrent une infrastructure entière. La
hiérarchie de traitement en est renversée : ce n'est pas ce qui est publié qui est le plus
urgent. Rien n'a été déplacé, supprimé ni modifié ; la rotation vous appartient, et deux points
mineurs attendent votre arbitrage.

## 1. En-tête d'identification

- **quoi** — exécution de l'arbitrage D-17 (a) : vérifier ce qu'ouvrent les identifiants signalés avant toute rotation, sans rien modifier.
- **sur quoi** — les 11 fichiers relevés par `oracles\oracle-secrets-hors-perimetre.mjs` à la racine du parc, en lecture seule.
- **quand** — fin le **30/08/2026 à 15:04 (UTC+02:00)**, durée **≈ 30 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2`, arbre de travail non committé.

## 2. Verdict en une ligne

Sur 11 porteurs signalés, **1 seul jeu d'identifiants applicatifs est publié** — 4 secrets dans un dépôt GitHub **privé** — et **2 jetons de déploiement vivent hors de tout dépôt** ; 2 fichiers ne portent **aucun** motif d'authentification, 3 ne contiennent ni mot de passe ni jeton, et l'URI de base publiée pointe vers **localhost**.

## 3. Décisions attendues

**Chapeau commun.** Le mandat portait sur la vérification, et elle est faite : la rotation
elle-même se joue chez les fournisseurs et vous appartient. Deux points mineurs, découverts en
vérifiant, appellent un arbitrage. Les huit décisions posées aux tours précédents restent
ouvertes et sont rappelées au dernier bloc.

**Comment lire ce qui suit.** Chaque décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, la recommandation arrive avec sa source. Le tableau donne les
options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que la retenir ferme
définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si vous ne tranchez pas.

> **D-18 — Le contrôle des secrets signale deux fichiers qui n'en portent aucun : corrige-t-on ce faux positif ?**
> Deux des onze porteurs sont des fichiers de configuration d'installeur de paquets. Lus ligne à ligne, ils ne contiennent qu'un réglage d'installation et aucun motif d'authentification — ni jeton, ni mot de passe, ni identifiant. Ils sont signalés sur leur NOM, pas sur leur contenu, et l'un des deux figure parmi les cinq annoncés comme publiés, ce qui gonfle l'alerte d'un tiers.
> **Recommandation : (a).** Source consultée : lecture des deux fichiers, respectivement 2 et 1 ligne utile, aucune ne portant de motif d'authentification ; et `oracles\oracle-secrets-hors-perimetre.mjs`, dont la règle SP2 les range parmi les porteurs sans avoir regardé ce qu'ils portent.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Exiger un motif d'authentification dans le CONTENU avant de signaler ce type de fichier | Effort **simple × court** ; un fichier au format inhabituel pourrait échapper au motif et ne plus être signalé | Exclut de continuer à compter comme exposé un fichier qui ne l'est pas |
| **(b)** Garder le signalement par nom et écrire la nuance dans le message | Effort **simple × court** ; l'alerte reste gonflée, mais elle s'explique | Exclut la réduction du bruit : le lecteur devra vérifier lui-même à chaque passage |
| **(c)** Ne rien changer | Effort nul | Exclut la confiance dans le compte : une alerte qui surestime d'un tiers finit par être lue au rabais |

> **Si rien n'est décidé** : (c) s'applique, et le contrôle continuera d'annoncer plus d'exposition qu'il n'en mesure.

> **D-19 — Que fait-on des trois fichiers de configuration de tests suivis par git chez trois produits ?**
> Ils sont suivis par git, ce qui les rend publiables, mais leur lecture ne montre ni mot de passe ni jeton : des chemins, des adresses de site et un identifiant de projet d'hébergeur. Le socle d'exclusions que les produits héritent ne les couvre pas, et c'est délibéré — le référentiel d'héritage écrit qu'un produit peut légitimement écrire son exclusion sous plusieurs graphies, et qu'exiger une forme exacte ferait crier sur une protection équivalente.
> **Recommandation : (b).** Source consultée : le référentiel `gabarits\HERITAGE.json`, qui déclare le socle d'exclusions en mode « présence et motifs » et explique pourquoi les fichiers de configuration en sont écartés ; et la lecture des trois fichiers, qui ne fait apparaître aucun secret.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Ajouter le motif d'exclusion au socle hérité, pour que tous les produits le reçoivent | Effort **simple × court** ; réintroduit exactement le débat de graphie que le référentiel a tranché en août | Exclut de laisser chaque produit choisir sa forme d'exclusion |
| **(b)** Laisser en l'état, ces fichiers ne portant aucun secret, et s'en remettre au contrôle qui les signalera le jour où ils en porteront un | Effort nul | Exclut une protection préventive : si un jeton y était ajouté un jour, il serait suivi dès sa première écriture |
| **(c)** Demander à chaque produit d'exclure lui-même ce fichier, par un lot de travaux | Effort **simple × moyen** ; trois lots à déposer, trois produits à attendre | Exclut la simplicité de (b) pour un risque aujourd'hui nul |

> **Si rien n'est décidé** : (b) s'applique, ce qui est aussi la recommandation — les trois fichiers restent suivis et sans secret.

## 4. Traité — avec sa preuve

- **Les 11 porteurs ont été lus et classés sans qu'aucune valeur ne soit reproduite.**
  - preuve de méthode : chaque fichier est lu par un relevé qui rend le NOM de la clé, la LONGUEUR de la valeur et son empreinte de fournisseur — jamais la valeur. Aucune commande de ce tour n'a affiché un secret, et ce document n'en porte aucun.
- **Un seul jeu d'identifiants applicatifs est réellement publié**, et le dépôt est privé.
  - preuve : le fichier de chaîne d'intégration d'un projet de messagerie porte 25 entrées, dont 4 secrets — une clé de signature de 49 caractères, un mot de passe de superutilisateur de 23, un mot de passe de base de données de 23, une clé de chiffrement de secrets de 44. Il est publié sur `origin/main`, et le dépôt distant est **PRIVATE** (dernier envoi le 04/08/2026). Le second fichier signalé est le MÊME contenu vu depuis un arbre de travail secondaire du même dépôt : les deux empreintes de contenu sont égales, `8f6778fce4b0afef` de part et d'autre — c'est l'empreinte qui l'établit, la taille identique de 1127 octets ne prouverait rien. Une seule exposition, donc, et non deux.
- **Deux jetons de déploiement vivent hors de tout dépôt**, et c'est le vrai point haut du relevé.
  - preuve : deux fichiers de configuration portent chacun un jeton d'hébergeur de 36 caractères, et leur emplacement n'appartient à aucun dépôt — donc ni exclusion, ni état git, ni recherche de secret ne les voit. Ils ne sont pas publiés : ils sont **hors de portée de toute protection**, ce qui est un autre problème et pas un moindre.
- **L'URI de base publiée ne pointe pas vers un service distant.**
  - preuve : l'adresse de connexion contenue dans le fichier de test d'un produit tiers a été analysée sans être affichée — hôte `localhost`, identifiant présent, mot de passe de 8 caractères. Publiée sur un dépôt GitLab tiers, elle n'ouvre aucun service accessible depuis l'extérieur.
- **Deux fichiers ne portent aucun motif d'authentification.**
  - preuve : lus intégralement, ils comptent 2 et 1 ligne utile, et la recherche des motifs d'authentification n'y rend rien. L'un des deux figure pourtant parmi les cinq annoncés comme publiés.
- **Trois fichiers de configuration de tests ne contiennent ni mot de passe ni jeton.**
  - preuve : leurs 12 entrées cumulées portent des noms de chemins, d'adresses de site et de routes, plus un identifiant de projet d'hébergeur de 24 caractères — aucun nom de clé ne relève du vocabulaire des secrets.
- **Une erreur de ma part a été trouvée et corrigée avant d'être écrite.**
  - preuve : j'ai d'abord conclu que deux dépôts n'avaient aucun distant, et j'allais en déduire que le contrôle surestimait l'exposition. J'avais interrogé les mauvais répertoires : les racines de dépôt réelles sont plus profondes de un et deux niveaux, et elles portent bien des distants — un dépôt GitLab tiers et un dépôt GitHub d'organisation. Le contrôle avait raison.

## 5. Non traité — avec son motif

- **La rotation des identifiants** : *dépendance externe* — elle se joue dans la console de chaque fournisseur, sur des comptes qui vous appartiennent. Le relevé ci-dessus donne l'ordre et la portée de chacun ; le geste, lui, est le vôtre.
- **Le rangement des fichiers hors dépôt** : *bloqué par un garde-fou* — déplacer ou supprimer un fichier est un geste humain, et ces fichiers vivent hors du pilot.
- **Le faux positif du contrôle** et **les trois fichiers de tests suivis** : *dépendance à une décision humaine* — les deux décisions ci-dessus.
- **La clé d'accès à une banque d'images**, hors de tout dépôt : *écarté du traitement urgent* — c'est une clé d'interface publique dont le détournement coûte un quota, non un accès. Elle reste à ranger avec les deux jetons, sans la même urgence. Critère de réouverture : si cette clé était liée à un compte payant.
- **Les 8 décisions ouvertes aux tours précédents** : *hors mandat* — durcissement des deux règles neuves, sort des copies périmées, enregistrement du travail, tables d'anonymisation, 9 dépôts frères divergés, ordre d'exécution des 23 tâches, 4 produits sans pièce, arriéré du registre.

## 6. Écarts à la lettre

- **vous avez demandé** de traiter d'abord les identifiants PUBLIÉS → **j'ai fait** la vérification demandée, et elle **renverse cet ordre** → **pourquoi** : sur les cinq annoncés comme publiés, deux ne portent aucun secret, deux sont le même fichier vu deux fois, et le cinquième pointe vers une base locale. Le seul jeu réellement publié l'est dans un dépôt privé. Pendant ce temps, deux jetons de déploiement vivent hors de toute protection. Je ne réordonne pas votre priorité de moi-même : je la mesure et je vous la rends, l'ordre proposé au dernier bloc étant le mien et non le vôtre.
- **vous avez demandé** de vérifier ce que ces identifiants ouvrent → **j'ai fait** cette vérification **sans jamais afficher ni recopier une valeur** → **pourquoi** : ce document vit dans un dépôt et ma sortie est journalisée ; y reproduire un secret pour l'analyser aurait créé une exposition de plus, dans un endroit que le contrôle ne surveille pas encore.
- Aucun autre écart.

## 7. Risques

- **Un jeton de déploiement hors dépôt reste invisible à toutes les protections.**
  - signal : aucun — c'est précisément le problème ; ni l'état git, ni les exclusions, ni une recherche de secret dans un dépôt ne le montrent. Seul le contrôle joué à la racine du parc le voit.
  - parade : ce contrôle existe et vient de le trouver ; il n'est pas joué à chaque ouverture de session, ce qui pourrait être proposé le jour où vous le voudrez.
- **Un dépôt privé peut cesser de l'être, ou être partagé.**
  - signal : un changement de visibilité, l'ajout d'un collaborateur, un essaimage du dépôt.
  - parade : la rotation des 4 secrets rend le contenu publié inoffensif quel que soit ce qui arrive au dépôt ensuite. C'est le seul geste qui ne dépend pas de la suite.
- **Ma classification repose sur la FORME des valeurs, pas sur un essai d'usage.**
  - signal : un identifiant classé « valeur opaque » qui serait en réalité un exemple, ou l'inverse.
  - parade : acceptation déclarée — éprouver un identifiant reviendrait à s'authentifier avec, ce qui n'est ni dans le mandat ni souhaitable. La longueur, l'empreinte de fournisseur et le nom de la clé sont les trois indices retenus, et ils sont donnés pour que vous puissiez me contredire.
- **Rien n'est enregistré depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et la journée disparaît — doctrine en quatre versions, huit corrections d'oracle, deux règles neuves, un contrôle rendu réparateur.
  - parade : la décision d'enregistrement posée ce matin, toujours ouverte.

## 8. Prochaines actions

Ordre de traitement : les deux jetons de déploiement passent devant, parce qu'ils ouvrent une infrastructure et qu'aucune protection ne les voit ; le jeu publié vient ensuite, parce que le dépôt est privé et que le risque y est conditionnel ; le reste est de l'hygiène.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Faire tourner les 2 jetons d'hébergeur qui vivent hors de tout dépôt, puis ranger les 3 fichiers concernés dans un emplacement couvert par une exclusion. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de l'hébergeur. Trace mesurée : la lecture ne donne que la longueur, 36 caractères pour chacun ; aucune tentative d'authentification n'a été faite et aucune n'est possible d'ici sans employer le jeton lui-même. | Deux jetons de déploiement restent lisibles sur le disque, hors de portée de toute protection et de toute recherche. |
| 2 | `neuve` | Faire tourner les 4 secrets applicatifs publiés dans le dépôt privé : clé de signature, mot de passe de superutilisateur, mot de passe de base, clé de chiffrement des secrets. | `manuelle_utilisateur` | `acces` — chacun se régénère dans l'application ou son hébergeur, hors de portée de l'agent. Trace mesurée : le dépôt distant est déclaré `PRIVATE` par l'interface GitHub, et le fichier est présent sur `origin/main` ainsi que sur 3 branches distantes. | Le contenu publié reste valide : le retirer du disque ou de l'historique n'y changerait rien. |
| 3 | `neuve` | Restreindre le signalement des fichiers d'installeur de paquets à ceux portant réellement un motif d'authentification, puis rejouer le contrôle et vérifier que le compte des porteurs baisse de 2. | `auto_ia` | `dependance_bloc_3` — attend la première décision ci-dessus. | L'alerte continue de compter comme exposés deux fichiers qui ne le sont pas, et se fera lire au rabais. |
| 4 | `neuve` | Committer localement la journée : doctrine de 2.11.0 à 2.14.0, deux règles neuves, huit corrections d'oracle, comparateur du crochet, contrôle d'héritage réparateur, gabarit de configuration complété. | `auto_ia` | `dependance_bloc_3` — attend l'arbitrage d'enregistrement posé ce matin. | Une fermeture de session perd la journée entière : rien n'existe dans l'historique. |
| 5 | `neuve` | Trancher les 8 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Identifiants exposes verification - 20260830i.md`
- Contrôle d'origine : `oracles\oracle-secrets-hors-perimetre.mjs`, règles SP1 et SP2 — 11 porteurs, dont 3 hors de tout dépôt et 8 dans un dépôt qui ne les exclut pas
- Méthode de lecture : relevé par nom de clé, longueur de valeur et empreinte de fournisseur, sans reproduction d'aucune valeur ; visibilité des dépôts distants obtenue par l'interface GitHub, racines de dépôt confirmées par `git rev-parse --show-toplevel`
- **Aucune écriture** : aucun fichier déplacé, supprimé ni modifié hors du pilot ; ce tour n'a produit que ce document
- Dépôt : `66c76d2`, arbre non committé — rien n'est publié
