# Produit-02 — Candidature : étude poussée de la stratégie DataForSEO — 20260831a

Demande d'étude adressée à la factory par le produit *Produit-02*, sur décision
de l'exploitant du 31/08/2026. L'objet : établir si, comment et à quel coût la plateforme
**DataForSEO** — un fournisseur d'API de données de recherche facturé à l'usage — doit
entrer dans le dispositif de mesure et d'acquisition du produit. Ce document pose le
contexte qui borne l'étude, les questions auxquelles elle doit répondre, et la forme que son
livrable doit prendre. Il ne préjuge d'aucune réponse : plusieurs issues possibles de
l'étude sont un NO-GO, et elles sont nommées.

## Pourquoi cette étude, et pourquoi maintenant

Le produit sort de deux arbitrages qui créent le besoin sans le satisfaire. Le premier : les
outils SaaS de suivi de position, facturés autour de trois chiffres par mois, ont été jugés
disproportionnés face à un budget publicitaire du même ordre — la position y est d'ailleurs
« surveillée, jamais pilotée » tant qu'elle n'entre pas dans la zone des 5ᵉ à 20ᵉ rangs. Le
second : le plan de campagnes publicitaires attend des volumes de recherche par pays et par
langue que la Search Console ne fournit pas, et que le compte publicitaire — non créé à ce
jour — ne fournira qu'après coup. DataForSEO se présente précisément dans cet interstice :
des données de SERP, de volumes et de concurrence **à l'acte**, sans abonnement. L'étude
doit dire si cette promesse tient, pour ce produit-ci, à son échelle réelle.

## Le contexte qui borne l'étude

Toute recommandation qui ignorerait l'un de ces faits serait inapplicable en l'état. Ils ne
sont pas négociables par l'étude ; s'ils doivent bouger, l'étude le dit et chiffre ce que ça
coûte.

- **Le produit** : site statique de location de 5 gîtes près du Mont-Saint-Michel, 203 pages
  en 7 langues, 6 marchés cibles (France, Allemagne, Espagne, Italie, Pays-Bas et Belgique
  néerlandophone, Portugal — plus l'anglais transverse).
- **L'échelle réelle, mesurée au 31/08/2026** : 43 impressions sur la fenêtre, 0 clic,
  13 requêtes nommées, position moyenne 37 et instable du simple au double d'un jour à
  l'autre. Toute projection de l'étude part de là, pas d'un site établi.
- **La mesure existante** : relevé Search Console hebdomadaire exécuté par l'intégration
  continue, série JSON en ajout seul, console de suivi authentifiée qui l'affiche. **Seul le
  runner d'intégration continue détient des identifiants** ; le serveur exposé n'en détient
  aucun. Toute intégration DataForSEO respecte cette ligne ou explique pourquoi elle ne peut
  pas.
- **La référence de coût** : le budget publicitaire visé est d'environ 100 €/mois. C'est
  l'étalon contre lequel tout coût de mesure se juge — la session du 30/08 a établi qu'un
  suivi qui coûte autant que le média qu'il mesure ne se justifie pas à ce stade.
- **La doctrine de mesure du produit** : le résultat (clics, réservations) prime le rang ;
  une mesure d'absence ne prouve rien hors de son périmètre ; toute valeur citée porte sa
  source et sa date.

## Les questions auxquelles l'étude répond

Huit questions, celles de la demande de l'exploitant, dans son ordre. Chacune attend une
réponse tranchée et sourcée, pas un panorama.

1. **Intérêt** — Qu'apporte DataForSEO que le dispositif actuel (Search Console gratuite,
   relevé hebdomadaire) n'apporte pas ? Pour chaque apport revendiqué : lequel a une valeur
   d'usage *à l'échelle actuelle du produit*, lequel n'en aura qu'après un seuil, et lequel
   est superflu.
2. **Utilisation** — Par quel canal le produit l'emploierait : appels directs depuis le
   runner d'intégration continue, tâches différées, fréquence, gestion du solde de crédits.
   Avec le squelette du flux : qui appelle, quand, où atterrit la donnée, qui l'affiche.
3. **Services à utiliser** — Le catalogue est large (SERP, volumes de mots-clés, Labs,
   backlinks, on-page, concurrence, avis). Lesquels servent ce produit, lesquels non, et
   pourquoi — service par service, avec le refus motivé aussi précisément que l'adoption.
4. **Pour quels objectifs** — Rattacher chaque service retenu à un objectif existant du
   produit : alimenter le plan de campagnes en volumes par pays et langue avant la création
   du compte publicitaire ; suivre la position sur un jeu borné de requêtes quand elle
   deviendra pilotable ; surveiller la concurrence locale. Un service sans objectif
   rattaché est écarté.
5. **Avec quelles données** — Ce qu'on envoie (requêtes, localisations, langues) et ce
   qu'on reçoit, précision et fraîcheur, limites connues par marché — dont la fiabilité des
   volumes sur des marchés petits comme le Portugal néerlandophone n'existe pas : dire ce
   que valent les données là où le produit vend réellement.
6. **Pour quels suivis** — Ce qui entre dans la série de relevés existante et à quelle
   cadence, ce qui reste ponctuel (une étude de volumes se refait-elle chaque mois ou une
   fois par saison ?), et le critère qui fait passer un suivi de ponctuel à récurrent.
7. **Avec quels résultats** — À quoi ressemble le succès à 3 et 6 mois, en indicateurs
   observables ; et le critère d'arrêt symétrique : qu'est-ce qui, mesuré, ferait couper la
   dépense.
8. **Pour quels coûts** — Trois scénarios chiffrés en €/mois (minimal, croisière, étendu),
   chaque prix confronté à la grille publiée **le jour de l'étude** avec sa date de relevé,
   plus le dépôt minimal, la durée de vie des crédits, et la comparaison à deux références :
   le budget publicitaire (~100 €/mois) et l'option SaaS déjà étudiée et écartée.

## Ce que le livrable doit être

La forme conditionne l'usage : une étude qui aligne des faits sans verdict reproduirait le
défaut déjà remonté sur l'étude d'outils du 30/08. Quatre exigences.

- **Un verdict** : GO, NO-GO, ou GO conditionnel avec sa condition datée et mesurable
  (« quand X impressions/semaine » vaut mieux que « plus tard »). Le NO-GO est une issue
  respectable de l'étude, pas un échec.
- **Toute affirmation chiffrée sourcée et datée** — prix, quotas, couvertures — par
  confrontation à la documentation et à la grille tarifaire du jour, jamais de mémoire. Un
  prix de mémoire dans une étude de coûts est un défaut bloquant.
- **Un schéma d'intégration** conforme à l'architecture du produit : secrets sur le runner
  seulement, série en ajout seul, restitution dans la console existante — ou l'explication
  de pourquoi c'est impossible, chiffrée.
- **Les modes d'échec nommés** : ce que l'étude ne peut pas savoir (volumes réels sur
  micro-marchés, dérive tarifaire, évolution de l'anonymisation Google) et le signal qui
  dirait que l'un d'eux se réalise.

## Ce que cette candidature n'engage pas

Aucune dépense, aucune création de compte, aucun appel d'API payant : l'étude se mène sur
documentation publique et grille tarifaire publiée. Si elle exige un essai payant pour
trancher une question, elle s'arrête là-dessus et le chiffre — la décision d'essayer
appartient à l'exploitant. La décision d'exécuter l'étude elle-même appartient à la
factory, selon son registre et ses priorités : ceci est une candidature, pas un ordre.
