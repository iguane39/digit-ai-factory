---
destinataire: humain
---

# Synthèse de mandat — l'étude d'opportunité conclut de ne rien construire, et signale une fenêtre qui se referme (31/08/2026)

L'étude que vous avez autorisée est faite, et elle ne recommande aucun outil neuf. La raison n'est
pas une prudence : c'est que les trois pièces nécessaires existent déjà et qu'aucune ne manque à
l'appel — la méthode d'audit, la discipline d'honnêteté, et surtout les données. La vérification
d'accès, qui était la précondition de tout, a donné un résultat que je n'attendais pas : votre site
possède **déjà** ses données de performance de recherche, réelles et quotidiennes, sur près de cinq
cents relevés depuis avril 2025. Ce qui manque n'est donc pas un dispositif mais une jointure — et
elle vient tout juste de devenir possible, parce que les adresses localisées ont été posées hier.
Cela crée une urgence que rien n'annonçait : la photographie de l'état d'avant localisation ne
pourra plus jamais être reprise après coup, et sans elle vous ne saurez jamais ce que le passage
au multilingue a produit.

## 1. En-tête d'identification

- **quoi** — exécution du prompt réécrit après validation de l'écart de verbe : étude d'opportunité d'un dispositif d'état de l'art de marché, sans construction.
- **sur quoi** — l'inventaire de 3 pièces de l'écosystème, et la vérification d'accès aux données de recherche du site cité.
- **quand** — fin le **31/08/2026 à 10:18 (UTC+02:00)**, durée **≈ 40 minutes**.
- **qui** — session pilot Claude Opus 5, dépôt à `66c76d2` ; forge `digit-ai-forge-agents` à `158dbbb`, 3 fichiers non committés.

## 2. Verdict en une ligne

Étude rendue à **1 398 mots**, **9 critères sur 9** du contrat de sortie tenus après 1 passe de correction sur 3 autorisées — conclusion : **aucun artefact neuf**, les 3 pièces examinées couvrent méthode, discipline et écoute ; la vérification d'accès établit **487 relevés journaliers du 07/04/2025 au 31/08/2026** déjà présents chez le produit, et une fenêtre de mesure qui se referme.

## 3. Décisions attendues

**Chapeau commun.** L'étude recommande deux gestes concrets, et tous deux se jouent chez le
produit, non chez le pilot. L'un est urgent au sens propre : il porte sur une donnée qui disparaît.
Les onze décisions posées aux tours précédents restent ouvertes et sont rappelées au dernier bloc.

**Comment lire ce qui suit.** La décision est un bloc encadré : le titre pose la question, la
prose rappelle de quoi il s'agit, la recommandation arrive avec la source d'où elle sort. Le
tableau donne les options — la colonne du milieu dit ce que l'option coûte, celle de droite ce que
la retenir ferme définitivement. La ligne encadrée qui ferme la décision dit ce qui se passe si
vous ne tranchez pas.

> **D-26 — Comment fait-on parvenir au produit les deux gestes recommandés, et dans quel ordre ?**
> L'étude recommande de capturer immédiatement la photographie de l'état d'avant localisation, puis de croiser les données de recherche existantes avec la langue désormais lisible dans les adresses. Ces deux gestes s'exécutent chez le produit, où le pilot n'écrit pas. Le premier est contraint par le temps, pas par la charge.
> **Recommandation : (a).** Source consultée : le canal du pilot vers le produit, décrit par `gabarits\TRAVAUX-PILOT.md` et servi par `todo\emettre-travaux.mjs`, qui n'écrit que dans une boîte d'entrée et laisse au produit la décision d'ingérer — c'est exactement son usage, et il refuse de redéposer un contenu déjà remis.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Déposer un lot de travaux chez le produit, la photographie d'abord et la jointure ensuite | Effort **simple × court** côté pilot ; l'exécution reste à la main du produit, à son rythme | Exclut de faire soi-même chez le produit, ce que la doctrine réserve au produit |
| **(b)** Attendre le prochain run demandé sur ce produit pour lui transmettre | Effort nul maintenant ; la fenêtre de mesure se referme pendant l'attente | Exclut la capture de la ligne de base, qui est précisément ce qui ne se rattrape pas |
| **(c)** Ne rien transmettre et garder l'étude au dossier | Effort nul | Exclut toute suite : le produit ignorera qu'il détient déjà la matière et qu'une fenêtre se ferme |

> **Si rien n'est décidé** : (c) s'applique, et la comparaison avant-après localisation devient impossible dans quelques semaines.

## 4. Traité — avec sa preuve

- **Les 3 pièces ont été examinées et jugées nommément**, ce qui était l'étape 1 obligatoire.
  - preuve, MÉTHODE : la forge du domaine porte une grille de 88 nœuds, un barème et des garde-fous, couvre les moteurs classiques ET génératifs, traite le multilingue jusqu'aux balises d'alternance, et range chaque étude dans le dossier du projet hôte. **Verdict : couvert.**
  - preuve, DISCIPLINE : le mode opératoire de veille du pilot impose la confrontation de chaque affirmation à une recherche réelle, son marquage `réel / promotionnel / non confirmé`, une fiabilité chiffrée de 0 à 1 et une historisation datée. **Verdict : couvert.**
  - preuve, ÉCOUTE : le skill de recherche multi-sources compte 8 sources actives et a tourné sur ce site le 30/08/2026, pour 25 résultats. Il dit ce qui se raconte, pas où le site est classé. **Verdict : couvert.**
- **La forge déclare elle-même la limite qui bloquait la question**, ce qui évite de la redécouvrir.
  - preuve : sa matrice des sources écrit que la console de recherche, la mesure d'audience, les index de liens et toute source de volume sont « absents, sans exception » ; sans export, 53 nœuds sur 87 restent instrumentés et 24 basculent en non mesurable ; la recherche web ne rend qu'une page de résultats approximée, sans position exacte ni géolocalisation contrôlée.
- **L'accès aux données a été VÉRIFIÉ, et non supposé** — c'était la précondition inscrite au prompt réécrit, et elle a renversé la conclusion.
  - preuve : le produit possède sa propre chaîne de traitement des exports de console — trois scripts d'analyse et de contrôle — et des données réelles : **487 relevés journaliers du 07/04/2025 au 31/08/2026**, portant clics, impressions, taux de clic et position moyenne, plus 1 000 requêtes, 255 pages et 184 pays.
- **Le manque réel est identifié, et il est étroit** : la console donne le pays, jamais la langue.
  - preuve : les 255 pages mesurées s'écrivent sans segment de langue — `/gite`, `/contact/gites`, `/bretagne/bain-nordique`. Le rattachement d'une impression à une version linguistique était donc impossible faute de clé, et non par négligence.
- **La fenêtre de mesure a été datée au 30/08/2026**, et c'est le point le plus urgent de l'étude.
  - preuve : les adresses localisées ont été posées le 30/08/2026, quarante-deux adresses et quarante-deux redirections. La jointure devient possible à partir de maintenant, et la ligne de base d'avant ne pourra plus être reconstituée — le moteur ne conserve ses données que sur une fenêtre glissante et les anciennes adresses redirigent désormais.
- **L'enjeu a été chiffré sur les données du produit**, plutôt qu'affirmé.
  - preuve : la France pèse 133 938 impressions à une position moyenne de 18,4 ; les États-Unis 8 020 à 40,6 ; le Brésil 4 219 à 36,8 ; l'Allemagne 1 730 à 25,7 ; le Royaume-Uni 1 532 à 36,4 ; les Pays-Bas 994 à 25,3 ; l'Espagne 768 à 21,6. Environ dix-neuf mille impressions hors France, toutes à des positions nettement moins bonnes que le marché domestique.
- **Le critère skill-contre-forge a été appliqué, pas seulement cité**, et il ne désigne ni l'un ni l'autre.
  - preuve : le référentiel existe déjà, les données datées existent déjà, la discipline existe déjà. Créer une forge porterait une seconde vérité sur un objet qui en a une ; créer un skill réécrirait une discipline déjà écrite. Si un artefact devenait nécessaire, le bon niveau serait **un nœud de plus dans la grille existante**, héritant de son barème et de ses garde-fous.
- **Le contrat de sortie est tenu sur ses 9 critères**, après une passe de correction.
  - preuve : passe 1 — 7 tenus sur 9, longueur à 1 456 mots et un faux positif de mon propre contrôleur sur « 27 jours » ; passe 2 — **9 sur 9**, longueur ramenée à 1 398 mots. Le protocole autorisait 3 passes, une a suffi.

## 5. Non traité — avec son motif

- **La capture de la photographie d'avant localisation** : *bloqué par un garde-fou* — elle s'exécute chez le produit, où le pilot n'écrit pas. C'est l'objet de la décision ci-dessus, et c'est le geste contraint par le temps.
- **La jointure entre données de recherche et langue** : *bloqué par un garde-fou* — même raison ; elle vit dans la chaîne de traitement du produit.
- **Les données de marché — volumes de recherche, concurrence** : *dependance_externe* — la forge les déclare absentes sans exception, et un fournisseur payant est interdit par les garde-fous du noyau. Toute estimation serait à marquer `non confirmé`, jamais présentée comme mesurée.
- **L'examen nœud par nœud de ce que la grille couvre déjà du multilingue** : *écarté* — l'étude établit que le multilingue y est traité et que la limite est la source, pas la méthode. Critère de réouverture : si le produit décidait d'ajouter le nœud « performance par langue » à la grille.
- **Les 11 décisions ouvertes aux tours précédents** : *hors mandat* — enregistrement du travail du pilot et de la forge, durcissement des deux règles neuves, copies périmées, tables d'anonymisation, 9 dépôts frères, ordre des 23 tâches, 4 produits sans pièce, faux positif du contrôle des secrets, fichiers de configuration de tests, ligne de partage du canal de remontée.

## 6. Écarts à la lettre

- **vous avez validé** que « construire » devienne « instruire l'opportunité » → **j'ai fait** l'étude, et elle **conclut de ne rien construire** → **pourquoi** : c'est le résultat de l'inventaire, pas une préférence. Je le signale parce que cette conclusion m'arrange trop pour être livrée sans être nommée — le protocole imposait d'ailleurs de développer l'issue « besoin déjà couvert » autant que l'autre, ce qui a été fait au chapitre 3 de l'étude.
- **vous aviez écrit** « Produit-02.com » → **les données mesurées portent** `Produit-02.fr` → **pourquoi** : ce n'est pas une reformulation de ma part mais un fait relevé dans les adresses des 255 pages mesurées. La correction est mineure et sans effet sur l'analyse, mais elle change la cible d'une vérification future.
- Aucun autre écart.

## 7. Risques

- **La fenêtre de ligne de base se referme, et c'est le seul risque irréversible du lot.**
  - signal : dans quelques semaines, la comparaison avant-après localisation devient impossible, et personne ne saura ce que le passage au multilingue a produit.
  - parade : la décision ci-dessus, voie (a), en plaçant la capture avant tout autre geste. Aucune autre parade n'existe : la donnée disparaît, elle ne se reconstruit pas.
- **Ma conclusion « ne rien construire » pourrait être une paresse déguisée en rigueur.**
  - signal : le manque réel serait plus large que la seule jointure, et l'étude l'aurait sous-estimé pour s'épargner un chantier.
  - parade : la conclusion est adossée à des faits vérifiables et contredisables — le nombre de nœuds de la grille, la déclaration d'absence de sources, le nombre de relevés journaliers, l'absence de segment de langue dans les 255 adresses. Chacun peut être rejoué contre moi.
- **Les chiffres de recherche cités vieillissent vite.**
  - signal : ils sont repris dans trois mois comme s'ils décrivaient encore la situation.
  - parade : la date de péremption est écrite dans l'étude, au 30/09/2026, avec ce qu'elle coûte de la rejouer.
- **Rien n'est enregistré depuis la remise à niveau d'hier matin.**
  - signal : une fermeture de session, et deux journées disparaissent — doctrine en quatre versions, huit corrections d'oracle, deux règles neuves, un contrôle rendu réparateur, deux analyses et cette étude.
  - parade : la décision d'enregistrement, ouverte depuis hier matin. C'est le risque le plus simple à fermer et le plus coûteux à laisser courir.

## 8. Prochaines actions

Ordre de traitement : la capture de la ligne de base passe devant tout, parce qu'elle est la seule action de ce dossier dont l'objet **disparaît avec le temps** ; l'enregistrement suit, parce que son absence peut faire perdre le reste.

| # | Identifiant | Action | Acteur | Motif / raison | Si elle n'est pas faite |
|---|---|---|---|---|---|
| 1 | `neuve` | Déposer chez le produit un lot de travaux portant les 2 gestes : capturer la photographie d'avant localisation, puis croiser les données de recherche avec le segment de langue des adresses. | `auto_ia` | `dependance_bloc_3` — attend la décision ci-dessus ; l'exécution reste au produit, le pilot ne dépose que dans sa boîte d'entrée. | La comparaison avant-après localisation devient impossible, et le produit ignore qu'il détient déjà la matière. |
| 2 | `neuve` | Committer chez la forge des skills le retrait du réglage, puis côté pilot les deux journées — doctrine de 2.11.0 à 2.14.0, deux règles neuves, huit corrections d'oracle, contrôle d'héritage réparateur, gabarit complété, deux analyses et cette étude. | `auto_ia` | `dependance_bloc_3` — attend les arbitrages d'enregistrement posés hier ; la publication relève d'un feu vert humain. | Une fermeture de session perd deux journées entières : rien n'existe dans l'historique. |
| 3 | `neuve` | Faire tourner les 2 jetons d'hébergeur hors dépôt et les 4 secrets publiés, relevés hier. | `manuelle_utilisateur` | `acces` — la rotation se fait dans la console de chaque fournisseur. Trace mesurée : la lecture n'a donné que la longueur des valeurs, 36 caractères pour les jetons ; aucune tentative d'authentification n'a été faite et aucune n'est possible d'ici sans employer l'identifiant lui-même. | Des identifiants de déploiement restent lisibles sur le disque, hors de portée de toute protection. |
| 4 | `neuve` | Trancher les 11 décisions ouvertes aux tours précédents, ou dire lesquelles abandonner. | `manuelle_utilisateur` | `decision` — arbitrages de risque, de priorité et de gouvernance, dont deux touchent des données de clients. | La boîte d'entrée reste fermée, le poste reste déclaré non prêt, et 23 tâches arbitrées restent sans exécution. |

## 9. Traces

- **L'étude** : `output\03-etudes\20260831-opportunite-etat-de-l-art-marche.md` — 1 398 mots, 9 critères sur 9 tenus, date de péremption au 30/09/2026
- L'analyse du prompt qui l'a produite : `output\03-etudes\20260830-L99-etat-de-l-art-marche.md`
- Cette synthèse : `output\04-plans\Digit-AI - Synthese Mandat - Etude opportunite etat de l art - 20260831a.md`
- Pièces inventoriées : la forge du domaine et sa matrice des sources · `veille\MODE-VEILLE.md` · le skill de recherche multi-sources et sa dernière exécution
- Vérification d'accès : chaîne de traitement et données de console présentes chez le produit, en lecture seule ; **aucune écriture chez le produit**
- Dépôt du pilot : `66c76d2`, arbre non committé — rien n'est publié
