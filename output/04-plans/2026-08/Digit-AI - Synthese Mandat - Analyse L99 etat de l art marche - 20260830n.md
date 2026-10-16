---
destinataire: humain
---

# Synthèse de mandat — analyse L99 (le niveau complet du skill d'analyse de prompt, 8 couches) de votre idée d'état de l'art de marché (30/08/2026)

Le skill que vous vouliez invoquer a fonctionné dès que le blocage a été levé, et son analyse a
trouvé quelque chose que je n'attendais pas : quatre affirmations implicites de votre message sont
contredites par l'écosystème lui-même. Une forge dédiée à ce domaine existe déjà et tourne, un
mode opératoire complet de veille existe dans le pilot, et le skill de recherche de marché a déjà
été exécuté sur l'exemple exact que vous citez, il y a vingt-sept jours. Votre intuition n'est pas
fausse pour autant — elle vise un besoin réel — mais elle demande de construire avant d'avoir
regardé. Le prompt réécrit change donc un mot, et c'est un changement que je dois vous soumettre
plutôt que de le glisser : il remplace « construire » par « instruire l'opportunité de
construire », et rend valide l'issue « on ne construit rien ».

## 1. En-tête d'identification

- **quoi** — invocation du skill d'analyse de prompt sur votre message, après levée du blocage ; analyse en 8 couches et prompt réécrit.
- **sur quoi** — votre message du 30/08 sur un dispositif d'état de l'art de marché, confronté à l'inventaire réel de l'écosystème.
- **quand** — fin le **30/08/2026 à 20:26 (UTC+02:00)**, durée **≈ 25 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2` ; forge `digit-ai-forge-agents` à `158dbbb`, 3 fichiers modifiés non committés.

## 2. Verdict en une ligne

Prompt noté **23/100**, réécrit à **88/100 projeté** : 3 défauts bloquants, dont 2 établis par confrontation à l'écosystème — une forge du domaine existe, un mode de veille existe, et le skill de recherche a déjà tourné sur l'exemple cité il y a 27 jours ; le 3ᵉ bloquant est la contrainte d'interface tierce payante, que la mesure de positions concerne frontalement.

## 3. Décisions attendues

**Chapeau commun.** Le skill impose de vous soumettre chaque endroit où le prompt réécrit s'écarte
du texte de votre demande, plutôt que de le noyer dans un prompt long que vous valideriez en bloc.
Un seul écart est substantiel et il porte sur le verbe. Les onze décisions posées aux tours
précédents restent ouvertes et sont rappelées au dernier bloc.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le
tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que
la retenir ferme définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si
vous ne tranchez pas.

> **D-25 — Validez-vous que « construire » devienne « instruire l'opportunité de construire » ?**
> Votre message demande de construire un skill ou une forge. Le prompt réécrit demande d'abord d'inventorier ce qui existe, puis de trancher — en rendant l'issue « aucun artefact neuf » aussi valide que les autres. C'est un affaiblissement de votre demande, et je vous le soumets plutôt que de le laisser passer dans un texte long.
> **Recommandation : (a).** Source consultée : l'inventaire de l'écosystème — la forge `digit-ai-forge-seo-geo` est présente avec son référentiel complet et sa fiche d'audit à 12 contrôles ; `veille\MODE-VEILLE.md` porte un mode opératoire de veille avec vérification web réelle et fiabilité chiffrée ; et le relevé d'ouverture de cette session indique que le skill de recherche multi-sources a tourné sur votre exemple il y a 27 jours, pour 25 résultats.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Valider l'écart et lancer l'étude d'opportunité que le prompt réécrit prescrit | Effort **moyen × court** ; un tour d'instruction avant toute construction | Exclut de construire tout de suite, donc exclut aussi de construire un doublon de la forge existante |
| **(b)** Refuser l'écart et construire directement, comme votre message le demandait | Effort **moyen × moyen** ; le risque nommé est le doublon, et l'écosystème compte déjà 13 forges | Exclut la vérification préalable — si le besoin est déjà couvert, on l'apprendra après avoir construit |
| **(c)** Ne rien lancer pour l'instant et garder l'analyse comme dossier | Effort nul | Exclut toute suite : l'analyse reste un document et le besoin reste entier |

> **Si rien n'est décidé** : (c) s'applique, l'analyse reste au dossier et rien n'est instruit ni construit.

## 4. Traité — avec sa preuve

- **Le blocage levé au tour précédent a produit son effet immédiatement**, contrairement à ce que j'avais annoncé.
  - preuve : j'avais écrit que la correction ne prendrait effet qu'à la prochaine session, le registre des skills étant lu au démarrage. Il s'est rafraîchi dans le tour : les 3 skills du lexique sont apparus comme disponibles, et l'invocation a réussi. **Ma prévision était fausse et le fait la corrige.**
- **L'analyse en 8 couches a été produite selon la spécification du skill**, chargée avant exécution.
  - preuve : le fichier de référence des couches a été lu — 191 lignes, double ancrage, tags de sévérité, rubrique de notation en 6 dimensions —, et les 8 chapitres sont rendus, dont les 4 conditionnels avec leur condition évaluée.
- **Le prompt est noté 23 sur 100**, dimension par dimension.
  - preuve : clarté de l'intention 9/20, spécification 3/20, garde-fous 1/15, ancrage 6/15, vérifiabilité de la sortie 0/15, robustesse 4/15. La vérifiabilité à zéro est le chiffre le plus parlant : rien dans le message ne permet de dire si le résultat serait bon.
- **Quatre affirmations implicites sont contredites par l'écosystème**, et c'est le cœur de l'analyse.
  - preuve, FORGE : `digit-ai-forge-seo-geo` existe et porte `grille-noeuds.md`, `methode.md`, `scoring.md`, `sources-donnees.md`, `snapshot.schema.json` et des prompts de phase A et B ; le noyau la déclare « post-MEP, SEO+GEO » ; sa fiche d'audit relève 12 contrôles tenus et une mission réelle en 6ᵉ itération.
  - preuve, VEILLE : `veille\MODE-VEILLE.md` est un mode opératoire réutilisable qui impose la confrontation de chaque affirmation à une recherche web réelle, son marquage `réel / promotionnel / non confirmé`, une fiabilité chiffrée de 0 à 1 et une historisation datée.
  - preuve, EXEMPLE DÉJÀ TRAITÉ : le relevé d'ouverture de cette session indique, pour le skill de recherche multi-sources, « Last run : "Produit-02 Vessey" — 27d ago — 25 results », sur 8 sources actives.
  - preuve, DONNÉES : la mesure de positions suppose une source. La console de recherche du moteur est gratuite et appartient au site ; un fournisseur de positions tiers est payant, donc interdit par les garde-fous du noyau. La faisabilité est donc **invérifiable sans une vérification d'accès**, et c'est écrit comme tel plutôt que tranché.
- **Le métier sépare deux choses que votre formulation fusionne.**
  - preuve : « performances des recherches » désigne les données propriétaires du site — impressions, clics, taux de clic, position moyenne, par requête et par pays — quand « mots-clés » désigne des données de marché, volumes et concurrence, qui existent indépendamment du site. Deux sources, deux méthodes, deux niveaux d'accès.
- **Le prompt réécrit clôt les 3 bloquants et les 8 majeurs**, chacun rattaché à son défaut.
  - preuve : le journal de modifications du chapitre 8 rattache les 12 changements à un défaut nommé de l'inventaire, sans qu'aucune correction ne sorte du chapeau ; score projeté 88/100.

## 5. Non traité — avec son motif

- **L'exécution de l'étude d'opportunité** : *dépendance à une décision humaine* — c'est la décision ci-dessus ; lancer l'étude est un tour de travail entier, et l'écart de verbe doit être validé avant.
- **La construction d'un skill ou d'une forge** : *hors mandat* — votre message proposait de construire ; l'analyse conclut qu'il faut d'abord inventorier, et je n'ai construit aucun artefact.
- **La vérification de l'accès aux données de recherche du site** : *acces* — elle suppose un compte propriétaire du site, hors de portée d'ici. Elle est inscrite comme précondition dans le prompt réécrit plutôt que supposée acquise.
- **L'examen détaillé de ce que couvre exactement la forge du domaine** : *écarté pour ce tour* — le relevé établit son existence, son référentiel et sa santé ; savoir si elle couvre précisément la mesure multilingue demandée est justement l'objet de l'étape 1 de l'étude. Critère de réouverture : le lancement de l'étude.
- **Les 11 décisions ouvertes aux tours précédents** : *hors mandat* — enregistrement du travail du pilot et de la forge, durcissement des deux règles neuves, copies périmées, tables d'anonymisation, 9 dépôts frères, ordre des 23 tâches, 4 produits sans pièce, faux positif du contrôle des secrets, fichiers de configuration de tests, ligne de partage du canal de remontée.

## 6. Écarts à la lettre

Le skill impose de lister chaque écart entre votre texte et le prompt réécrit, poste par poste.

| Vous avez écrit | Je propose | Pourquoi |
|---|---|---|
| « construire un skill … et/ou une forge » | **instruire l'opportunité** avant de construire, et rendre valide l'issue « on ne construit rien » | Trois pièces existantes recouvrent une partie du besoin, dont une forge dédiée au domaine. **C'est l'écart le plus important et il fait l'objet de la décision ci-dessus** |
| « une activité, un service, une spécialisation, une étude... » | périmètre **borné au cas cité** pour la première instance | Un périmètre ouvert produit un gabarit générique que personne n'instancie. Votre ellipse est restreinte, et la restriction est assumée |
| « la mesure des performances des recherches et mots-clés Google » | deux natures de données **explicitement séparées** | Votre formulation les fusionne ; elles n'ont ni la même source ni le même niveau d'accès |
| le nom du site en clair | le site désigné sans être nommé dans le prompt réécrit | La chaîne d'ingestion substitue les noms de produits avant écriture au registre ; le conserver dans un prompt réutilisable le ferait ressortir ailleurs |

- **Correction d'une prévision que je vous ai faite au tour précédent** : j'ai annoncé que la levée du blocage ne prendrait effet qu'à la prochaine session. C'est **faux** — le registre des skills s'est rafraîchi dans le tour, et l'invocation a réussi immédiatement.

## 7. Risques

- **L'analyse conclut contre la construction, et c'est une conclusion confortable pour moi.**
  - signal : l'étude d'opportunité conclurait elle aussi « rien à construire », sans avoir sérieusement examiné le manque.
  - parade : le protocole de tests du livrable impose un cas d'essai où le besoin est déjà couvert ET un cas où il ne l'est pas, en exigeant que les deux issues soient également développées. C'est le cas d'essai qui distingue une étude honnête d'une justification.
- **Un état de l'art produit par un modèle peut être entièrement plausible et entièrement inventé.**
  - signal : des volumes de recherche crédibles, des concurrents vraisemblables, aucune source citée.
  - parade : le prompt réécrit interdit tout chiffre sans source ni date et impose le marquage `mesuré / estimé / non confirmé` — reprise directe de la discipline déjà écrite dans le mode de veille du pilot.
- **Le blocage levé au tour précédent n'est enregistré nulle part.**
  - signal : le skill cesse de fonctionner un jour, après un rapatriement de la forge qui le publie.
  - parade : la décision d'enregistrement posée au tour précédent, toujours ouverte. Ce tour vient de démontrer l'utilité de la correction ; la perdre serait doublement coûteux.
- **Rien n'est enregistré côté pilot depuis la remise à niveau de ce matin.**
  - signal : une fermeture de session, et la journée disparaît — doctrine en quatre versions, huit corrections d'oracle, deux règles neuves, un contrôle rendu réparateur, et la présente analyse.
  - parade : la décision d'enregistrement posée ce matin, toujours ouverte.

## 8. Prochaines actions

Ordre de traitement : enregistrer passe devant, parce que la correction qui a permis ce tour n'existe dans aucun historique ; l'étude vient ensuite, une fois l'écart de verbe validé.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Committer chez `digit-ai-forge-agents` le retrait du réglage sur les 3 fiches, puis côté pilot la journée entière — doctrine de 2.11.0 à 2.14.0, deux règles neuves, huit corrections d'oracle, contrôle d'héritage réparateur, gabarit de configuration complété, et les analyses produites. | `auto_ia` | `dependance_bloc_3` — attend les arbitrages d'enregistrement posés ce matin et au tour précédent ; la publication relève d'un feu vert humain. | Une fermeture de session perd la journée entière, y compris la correction qui vient de rendre ce skill utilisable. |
| 2 | `neuve` | Lancer l'étude d'opportunité selon le prompt réécrit, en commençant par l'inventaire des 3 pièces existantes. | `auto_ia` | `dependance_bloc_3` — attend la validation de l'écart de verbe ci-dessus. | Le besoin reste entier et l'analyse reste un document sans suite. |
| 3 | `neuve` | Vérifier l'accès aux données de recherche du site cité, préalable inscrit dans le prompt réécrit. | `manuelle_utilisateur` | `acces` — l'accès suppose un compte propriétaire du site, hors de portée de l'agent. Trace mesurée : aucune tentative n'a été faite, et aucune n'est possible d'ici sans identifiant du propriétaire ; c'est pourquoi la faisabilité est classée invérifiable plutôt que tranchée. | L'étude décrira une méthode sans jamais pouvoir produire un chiffre. |
| 4 | `neuve` | Faire tourner les 2 jetons d'hébergeur hors dépôt et les 4 secrets publiés, relevés il y a cinq tours. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de chaque fournisseur. Trace mesurée : la lecture n'a donné que la longueur des valeurs, 36 caractères pour les jetons ; aucune tentative d'authentification n'a été faite et aucune n'est possible d'ici sans employer l'identifiant lui-même. | Des identifiants de déploiement restent lisibles sur le disque, hors de portée de toute protection. |
| 5 | `neuve` | Trancher les 11 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- Analyse complète en 8 couches : `output\03-etudes\20260830-L99-etat-de-l-art-marche.md`
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Analyse L99 etat de l art marche - 20260830n.md`
- Spécification suivie : `references\couches.md` du skill, 191 lignes, chargée avant exécution
- Pièces de l'écosystème confrontées au prompt : la forge du domaine et son référentiel · `veille\MODE-VEILLE.md` · le skill de recherche multi-sources et sa dernière exécution
- Dépôt du pilot : `66c76d2`, arbre non committé — rien n'est publié
