# Retours forges — Client-A-POC-to-Prod — 20260831b

- **Contexte** : deuxième lot du jour. Le premier (`20260831a`) remontait des défauts de
  **forme** relevés en produisant un rapport HTML. Celui-ci remonte ce que la **revue humaine du
  livrable** a mis au jour, et qui est d'un autre ordre : des défauts de **conception** que ni le
  socle, ni les gabarits, ni aucun oracle ne cherchent — et une **récidive** qui dit que la
  boucle d'amélioration de la factory ne se referme pas.
- **Références** : livrable `output/03-Syntheses/Client-A - Process Ingénierie POC-to-Prod -
  Consolidation et cible - 20260831c.html` ; indices supplantés `a` et `b` dans
  `output/old/03-Syntheses/` ; prompt corrigé `output/01-Referentiel-audit/Client-A - Prompt
  Consolidation Process Ingénierie - 20260831b.md`
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : **remis le 2026-08-31** — les deux fichiers déposés dans la boîte d'entrée du pilot
  `digit-ai-factory/input/00-retours/`, hors git ; l'original reste ici (historique du produit).

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Ce que ce lot documente, et pourquoi il n'est pas un lot de forme.** Le livrable a passé
**17 contrôles de forme sur 17** et a été **refusé deux fois par son lecteur**. Les griefs ne
portaient sur aucune règle du socle : un vocabulaire employé sans être défini, des listes qui
renvoient ailleurs dans la page, un chapitre entier dont personne ne voyait l'objet, et une
mesure dont les résultats étonnaient qui connaît le terrain. **Un livrable peut être
intégralement conforme et illisible** : c'est le trou que ce lot remonte. Et l'un des quatre
griefs — la liste qui renvoie ailleurs — **avait déjà été remonté à la factory par un autre
projet**. Il s'est reproduit ici. C'est le retour le plus important du lot.

---

## digit-ai-factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-7 | **bloquant** | générique | **La boucle de retour ne redescend pas, et le même défaut se rejoue chez le projet suivant.** Trois récidives mesurées en quatre jours, sur ce seul projet : (1) *charger des polices distantes dans un HTML livré* — remonté par nous-mêmes le 27/08 en **RT-1**, reproduit le 31/08 sur un autre livrable, découvert en relisant **notre propre lot** ; (2) *écrire son propre contrôle de conformité faute de trouver l'oracle* — remonté en **RT-2** le 27/08, reproduit deux fois le 31/08 ; (3) *une liste qui renvoie ailleurs dans la page au lieu de porter son détail* — **déjà remontée à la factory par un autre projet**, et reproduite ici sans que rien dans le socle, les gabarits ou les oracles ne l'empêche. Le point commun des trois : la remontée est **montée** et n'est jamais **redescendue** sous une forme qu'un producteur rencontre au moment où il produit. Un registre de candidatures n'est pas une redescente. | Fermer la boucle par un **mécanisme de descente**, et le rendre obligatoire : tout retour traité produit (a) **une règle générique écrite** au socle ou au gabarit concerné, (b) **un oracle** qui la contrôle — ou l'énoncé explicite qu'elle n'est pas mécanisable et pourquoi, (c) une **ligne dans un digest versionné** que les produits héritent, comme `oracle-lot.mjs` est déjà hérité. La loi transverse de la maison le dit déjà : *toute affordance est câblée ou n'existe pas*. Une correction qui vit dans le registre du pilot et nulle part chez le producteur n'est pas câblée. **Proposition de règle : un retour clos sans règle générique ni oracle associé se rouvre automatiquement.** |
| RT-8 | **bloquant** | générique | **Aucun oracle ne juge la CONCEPTION d'un livrable, et personne ne s'en aperçoit tant qu'un humain ne lit pas.** Le livrable passait 17 contrôles de forme sur 17 quand son lecteur l'a refusé pour la deuxième fois. Les quatre griefs, tous invisibles aux contrôles existants : *(a)* « 17 dimensions » écrit trente fois sans que le document dise ce qu'est une dimension ni ne les nomme — **le lecteur a parlé de « charabia »** ; *(b)* une liste de décisions dont chaque ligne renvoyait à un chapitre plus bas ; *(c)* un chapitre « table de réconciliation » alignant étapes, phases, dimensions et deux comptes, exact colonne par colonne, dont le lecteur a écrit « on ne sait absolument pas de quoi on parle » ; *(d)* une carte de chaleur arithmétiquement juste et globalement fausse (voir RT-10). La doctrine documents énonce pourtant **D6** — « conformité mécanique n'est pas qualité » — et la mesure : douze chapeaux identiques au mot près satisfont la règle qui les exige. D6 nomme le mal ; **rien ne le cherche**. | Trois contrôles bon marché, tous mécanisables, qui auraient attrapé trois griefs sur quatre : **(1) glossaire** — tout terme de méthode employé plus d'une fois est défini dans le livrable, et un ensemble annoncé par son cardinal (« les 17 dimensions ») est énuméré quelque part ; **(2) liste autoportante** — une liste dont les entrées portent un renvoi interne comme unique porteur de détail est un défaut, le détail se replie dans la ligne (`<details>` natif) ; **(3) intention de chapitre** — tout chapitre de niveau 2 porte un bloc « question du lecteur / ce que ce chapitre apporte / ce qu'il permet de décider ». Le troisième est le plus utile : il **force la conception avant l'écriture**, et un chapitre qui ne peut pas l'écrire sans paraphraser son titre se supprime. |
| RT-9 | **majeur** | générique | **Il manque à la maison une méthode de construction d'un livrable, et chacun réinvente la sienne.** Le socle prescrit le **rendu**, la bibliothèque de gabarits prescrit la **structure** d'une famille — rien ne prescrit **comment on décide de ce qu'un chapitre doit apporter**. Conséquence observée ici : six chapitres écrits parce que le plan les prévoyait, dont un que le lecteur n'a pas su lire. Le lecteur a formulé lui-même l'attente, et elle est juste : partir de l'**intention de l'utilisateur**, en dériver une **stratégie** de bout en bout, la décliner en **tactique**, puis en **opérationnel**, et **vérifier en remontant** — opérationnel → tactique → stratégie → intention — que l'ensemble répond bien à l'intention de départ. | Écrire cette chaîne comme **doctrine transverse D8** de la bibliothèque de gabarits, au même rang que D1-D7, avec l'état de l'art qui la fonde plutôt qu'une invention maison : **Goal–Question–Metric** (Basili, 1994 — aucune métrique sans sa question, aucune question sans son but : c'est la même chaîne appliquée aux chiffres) ; **la pyramide de Minto** (situation, complication, question, réponse — la réponse d'abord) ; **Rumelt** (*Good Strategy / Bad Strategy*, 2011 — diagnostic, politique directrice, actions cohérentes ; une liste d'ambitions n'est pas une stratégie) ; **Double Diamond** du Design Council ; **le V-model** pour la vérification remontante. Le livrable en porte l'application dans son prompt (`Client-A - Prompt Consolidation Process Ingénierie - 20260831b`, §0) — disponible pour être repris et généralisé. |
| RT-10 | **majeur** | générique | **Une mesure peut être exacte case par case et fausse dans son ensemble, et rien ne le voit.** La carte de chaleur du livrable donnait `Produit-01` à **0 %** en tests. `Produit-01` porte une porte de couverture bloquante à 70 %. Deux défauts de conception cumulés, tous deux invisibles à un contrôle de forme : le **dénominateur était fabriqué par les déclarations des autres acteurs** — une règle déclarée par un seul produit rendait les trois autres « en écart » alors qu'ils n'avaient jamais eu à se prononcer ; et la règle d'`Produit-01` **avait été routée hors du corpus** parce qu'elle était générique, ce qui privait le produit du crédit de ce qu'il fait. Le défaut a été trouvé par **l'étonnement du lecteur**, pas par un contrôle. | Une règle de doctrine, et un contrôle. **La règle** : tout chiffre publié énonce son dénominateur et ce qu'il inclut ; on ne mesure un acteur que sur ce qu'il a eu l'occasion de faire ; une absence de déclaration n'est pas un échec et ne se compte pas comme un zéro ; un objet écarté d'un canal n'est pas retiré de la mesure ; préférer un compte à un pourcentage quand le dénominateur est petit ou hétérogène. **Le contrôle** : un pourcentage affiché sans sa formule écrite à côté est un défaut — mécanisable, et il aurait forcé à écrire le dénominateur, donc à le regarder. **Et la pratique qui coûte le moins** : l'*épreuve de l'étonnement* — faire lire les résultats à qui connaît le terrain, et instruire **la mesure** d'abord quand un résultat surprend. C'est ce qui a fonctionné ici, après coup. |

**Portée** (R-45) : les quatre retours sont de portée *générique*. Aucun ne dépend du contenu du
livrable, ni de ce projet, ni de son client. RT-7 et RT-8 concernent le **mécanisme** de la
factory ; RT-9 et RT-10 sa **doctrine**.

## Le lien entre les quatre, en une phrase

RT-8 dit qu'il manque des contrôles de conception, RT-9 qu'il manque la méthode que ces
contrôles devraient vérifier, RT-10 en donne un cas mesuré — et **RT-7 dit pourquoi les trois
reviendront** si le mécanisme de descente n'existe pas. La règle demandée par le lecteur tient
en deux propositions, et elle vaut d'être écrite telle quelle au socle :

> **Un problème remonté une fois ne doit plus se reproduire — sinon il n'y a pas d'amélioration
> continue.** Et **un problème remonté doit produire une ou plusieurs règles génériques qui
> permettent d'anticiper les prochaines générations, afin de faire bien du premier coup.**

## Confirmations — ce qui a bien fonctionné

| Objet | Constat |
|---|---|
| **Doctrine D6** | « Conformité mécanique n'est pas qualité » décrit exactement ce qui s'est passé, avec sa mesure — douze chapeaux identiques satisfaisant les règles qui les exigent. Le diagnostic était **déjà écrit** ; c'est le contrôle qui manque. RT-8 ne demande pas une doctrine nouvelle, il demande d'outiller celle-là. |
| **La séparation socle / gabarits** | « La bibliothèque prescrit la STRUCTURE, le socle prescrit le RENDU » est une frontière nette et utile. Elle rend visible le troisième manque : personne ne prescrit la **conception**. RT-9 se loge exactement dans cet interstice, sans rien déplacer. |
| **L'oracle de boîte d'entrée** | Il a refusé notre premier lot du jour sur **B7** avec un message qui disait quoi corriger. Corrigé en une minute. C'est le contre-exemple utile de RT-8 : quand le contrôle existe et que son message nomme la chose attendue, le défaut ne survit pas. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| J'ai écrit « les 17 dimensions » trente fois sans jamais les nommer ni définir ce qu'est une dimension. | Glossaire obligatoire inscrit au prompt (R1) : tout terme défini dans le livrable, les 17 dimensions énumérées avec leur objet, les trigrammes produits explicités. | **oui** | La faute est mienne ; la **classe** ne l'est pas — rien dans la maison ne demande qu'un livrable définisse son vocabulaire. Remonté en **RT-8**. |
| Ma liste de décisions renvoyait au chapitre 7 au lieu de porter son détail. | Règle de liste autoportante inscrite au prompt (R2), `<details>` natif. | **oui** | Défaut **déjà remonté à la factory par un autre projet** et reproduit ici : c'est la preuve de RT-7, pas seulement une erreur de plus. |
| Ma carte de chaleur donnait 0 % à un produit qui fait la chose mesurée. | Modèle de mesure réécrit au prompt (§3.1, cinq règles) : dénominateur nommé, non-déclaration distincte de l'échec, générique conservé au corpus. | **oui** | Remonté en **RT-10**. Le livrable servi porte encore l'ancienne mesure — la correction est inscrite au registre du produit, à jouer au prochain indice. |
| Trois indices de livrable publiés dans la même journée, puis un quatrième dû. | Versions supplantées versées dans `output/old/`. | non | Coût de mon apprentissage. Il est néanmoins la mesure de ce que RT-7 à RT-10 coûtent à un producteur qui découvre la maison. |

## Retours sur les documents produits

**Aucun document produit depuis un gabarit** — et c'est le retour lui-même : la famille qui
conviendrait, une consolidation de process multi-produits, est absente du catalogue (remontée en
**RT-6** du lot `20260831a`). Le livrable porte en en-tête `gabarit : candidat
« consolidation-process »`, faute de pouvoir renseigner **G8**.

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - Process Ingénierie POC-to-Prod - Consolidation et cible - 20260831c.html` | **aucun** — famille absente, candidat déclaré en en-tête | Une **méthode de conception** de chapitre (RT-9), un **glossaire obligatoire** (RT-8), une **doctrine de mesure** (RT-10). Aucun des trois n'est une question de gabarit de famille : ils manqueraient à n'importe quel livrable de n'importe quelle famille. | Deux refus successifs, tous deux sur la **conception** et non sur la structure ni sur le fond : vocabulaire non défini, listes qui renvoient ailleurs, un chapitre sans objet lisible, une mesure étonnante. Le fond — 102 lignes consolidées en 55 règles, 13 décisions instruites — n'a été contesté à aucun des trois indices. | Le glossaire, les blocs d'intention par chapitre, le pliage des listes, la reformulation du modèle de mesure : tous **ajoutés au prompt** plutôt qu'au seul livrable, pour que la prochaine génération les porte d'emblée. | **générique** |
