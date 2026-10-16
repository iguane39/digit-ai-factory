# Retours forges — Produit-11 — 20260911b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : mandat humain du 11/09/2026 — corriger de façon exhaustive les dix-neuf constats
  de l'audit tiers « Sécurité, maintenabilité et CI/CD » du 09/09/2026, redéployer, puis
  **remonter séparément** ce qui appartient à la Factory (process d'ingénierie logicielle,
  toutes forges) et ce qui appartient au centre Produit-64 (référentiel d'audit). Ce lot
  porte la part **Factory**. La part Client-A est remise au centre, pas ici.
- **Références ledger** : `forge\ledger.jsonl` seq 174
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` sous
  le préfixe pseudonyme — l'original reste ici (historique du produit).
- **Statut** : a_remettre

> ## ⛔ AVANT DE REMETTRE — un geste, une seconde
>
> ```
> node forge\retours\oracle-lot.mjs "forge\retours\Produit-11 - RETOURS - 20260911b.md"
> ```

**Numérotation** : BAV2 tient une séquence `RT-nn`. RT-1 … RT-54 étaient consommés au 10/09.
Ce lot continue en **RT-55 … RT-62**. ⚠️ **Une collision d'identifiants est signalée en RT-62** :
le lot `20260911a`, écrit le même jour par une autre session du même produit, a repris RT-50 à
RT-52, déjà portés par les lots `20260909b` et `20260910a`.

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou
*produit+générique*.

---

## Le fait mesuré, avant toute interprétation

Un audit tiers a rendu dix-neuf constats sur un produit qui venait de passer **deux** passes du
kit d'audit interne, **toutes deux vertes**. Neuf constats étaient neufs. En les corrigeant, huit
défauts ont été trouvés qui n'appartiennent **ni** au produit **ni** au référentiel Client-A, mais
au socle d'ingénierie logicielle que la Factory tient pour tous les projets. Ils se rangent en
deux familles.

**Famille 1 — la forme des documents produits (trois retours humains directs).** Le destinataire
du livrable a demandé, mot pour mot : « corrige le listing du tableau de synthèse, qui doit
intégrer directement les détails dans sa liste, sans recréer un deuxième listing à côté » ;
« agrandis la largeur de la page pour [faire tenir] toutes les informations dans toutes les
colonnes sans avoir des cellules trop grandes en hauteur » ; « homogénéise la largeur des
contenus de la page principale pour ne pas avoir des grandes largeurs mixées avec des petites ».
Les trois portent sur le **même document**, bâti sur le squelette Factory `gd-rapport-donnees`,
et **aucun des dix-huit domaines d'oracles** ne les a vus.

**Famille 2 — ce qu'une porte doit être.** Le rapport tiers pose une phrase que le socle
n'écrit nulle part : *« une porte est un contrôle qui peut être rouge »*. Cinq de ses dix-neuf
constats en découlent, et ils se reproduiront chez tout projet employant la chaîne.

**La mesure qui fait ce lot**, et qui vaut pour n'importe quel dépôt : cinq spécifications de
bout en bout échouaient. Trois étaient documentées. **Deux ne l'étaient pas — elles échouaient
depuis six jours**, parce qu'un correctif de sécurité avait retiré d'une réponse HTTP une donnée
qu'elles lisaient. Personne ne le savait : la suite n'était jouée par aucune chaîne.

---

## digit-ai-factory (`gabarits\documents\`, socle des pages produites)

Trois retours humains directs sur la forme d'un document, et un sur la tenue des identifiants de
lots. Les trois premiers ont été demandés explicitement « pour que ça ne se reproduise plus
jamais à l'avenir sur aucun document ».

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-55 | majeur | générique | **Un document peut porter DEUX listings de la même chose, et aucun oracle ne le voit.** Le rapport `20260910b.html` porte, au chapitre 03, un tableau filtrable de dix-neuf lignes (référence, sujet, priorité, verdict) et, au chapitre 04, dix-neuf fiches dépliables portant les **mêmes** dix-neuf références avec leur détail. Le lecteur a écrit : « sans recréer un deuxième listing à côté […] Pas de double listing qui ne sert à rien si ce n'est dupliquer l'information. » Mesure : 19 identifiants apparaissent chacun **deux fois** comme entrée de liste, dans deux structures différentes, sur la même page ; le squelette `gd-rapport-donnees` prescrit les deux composants (`table.repli-cartes` et `details.fiche`) **sans dire qu'ils ne se cumulent pas sur le même ensemble**. Coût : un aller-retour humain, et un document deux fois plus long que nécessaire. | Règle de socle : **un même ensemble d'éléments n'est énuméré qu'une fois par page**. Si le détail existe, il vit DANS la ligne (`<details>` porté par la ligne du tableau, ou `<tr>` dépliable) ; le tableau garde alors le filtrage et gagne le détail. Contrôle proposé : compter les identifiants qui sont à la fois clé de ligne d'un `table` et `summary` d'un `details` de la même page ; au-delà de zéro, FAIL. Classe voisine retenue : `page-html-liste-renvoi-sans-detail` — c'est son **symétrique** (ici le détail existe, mais dans une seconde liste). |
| RT-56 | majeur | générique | **La largeur du conteneur ne tient pas compte du nombre de colonnes, et des cellules trop hautes en sont la conséquence mécanique.** Le token du socle est `--w: clamp(75vw, 1680px, 92vw)` — une valeur **unique**, quel que soit le contenu. Sur un tableau de **huit** colonnes dont quatre portent de la prose, le plafond de 1 680 px force le retour à la ligne dans chaque cellule : la copie d'écran remise par le lecteur montre des lignes de trois lignes de haut pour un texte de quinze mots. Le lecteur : « agrandis la largeur de la page pour s'assurer toutes les informations dans toutes les colonnes sans avoir des cellules trop grandes en hauteur ». Aucune règle du socle ne relie **nombre de colonnes** et **largeur offerte** ; `render_page.py` mesure le rognage et le débordement, jamais la **hauteur** des cellules. | Faire dépendre le plafond du nombre de colonnes du plus large tableau de la page : au-delà de six colonnes, `--w: clamp(85vw, 2100px, 96vw)`. Et une règle de rendu neuve, mesurable : **aucune cellule de tableau ne dépasse trois lignes de texte à 1 920 px** — c'est le seuil à partir duquel l'œil perd l'alignement des colonnes. Les paliers de repli en cartes (TF-0558) traitent déjà le cas inverse, l'étroitesse ; celui-ci manque. Classe : `page-html-largeur-lecture-donnees`. |
| RT-57 | majeur | générique | **Deux largeurs de contenu coexistent sur la même page, sans que rien ne l'interdise.** Toujours sur `20260910b.html` : le chapitre 06 (cartes `KIT-01` à `KIT-07`) occupe toute la largeur du conteneur, le chapitre 07 (décisions) est bridé par `.chap.lire` à 1 080 px centrés. Les deux se suivent. Le lecteur l'a vu immédiatement : « homogénéise la largeur des contenus de la page principale pour ne pas avoir des grandes largeurs mixées avec des petites ». Le squelette **prescrit les deux** — `.chap.lire` pour la prose, pleine largeur pour les données — et ne dit nulle part que l'alternance entre chapitres voisins est un défaut. Mesure : sur 9 chapitres, 5 en pleine largeur et 4 bridés, dans un ordre qui suit la nature du contenu et non la lecture. | Règle : **la largeur de contenu est une propriété de la PAGE, pas du chapitre.** Soit le document est un document de lecture (tout en `.chap.lire`), soit un document de données (tout en pleine largeur), et le petit nombre d'exceptions — un encadré, une citation — se marque comme tel. Contrôle : mesurer la largeur rendue de chaque section ; plus d'une valeur distincte hors exceptions déclarées, FAIL. Classe : `page-html-grille-non-alignee`. |
| RT-58 | mineur | générique | **Deux sessions du même produit, le même jour, ont frappé les mêmes identifiants de retour.** Le lot `20260911a` (remis à 09:54) annonce « RT-1 … RT-49 sont consommés » et prend RT-50 à RT-52. Or RT-50 et RT-51 sont portés par le lot `20260909b`, et RT-52 à RT-54 par le lot `20260910a` — tous deux dans le même dossier, tous deux antérieurs. Trois identifiants désignent donc deux retours différents. `oracle-lot.mjs` ne le voit pas : R-49 compare l'empreinte d'un **chemin** déjà ingéré, pas l'unicité des identifiants **dans** les lots d'un même produit. La règle « ids uniques par produit, jamais réutilisés » est écrite dans le gabarit, et jugée par personne. | Contrôle dans `oracle-lot.mjs` : relever les `RT-nn`/`RA-nn` des lots voisins du même produit et refuser un identifiant déjà porté, en proposant le premier libre. C'est une lecture de répertoire, pas un registre. Classe : `registre-doublon-non-detecte`. |

---

## digit-ai-forge-development et digit-ai-forge-ops (socle de la chaîne de livraison)

Quatre retours, tous génériques, tous dérivés de constats que l'audit tiers a trouvés en une
lecture et que deux passes internes n'avaient pas cherchés.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-59 | bloquant | générique | **Le socle ne dit nulle part qu'une porte doit pouvoir être rouge, et les chaînes en portent la conséquence.** Mesure sur le produit avant correction : le job de plan d'infrastructure portait `continueOnError: true` et l'étage de déploiement ne l'exigeait pas dans sa condition ; six étapes de conformité sortaient en `exit 0` quand leur kit manquait ; la porte finale forçait le succès. **Aucune de ces portes ne pouvait être rouge**, et deux passes d'audit internes les ont comptées vertes. Le socle `ETAPE-MEP.md` énumère des contrôles M-1…M-7 sans exiger qu'aucun ait été **vu rouge**. Le mot « porte » y désigne indifféremment un contrôle bloquant et un contrôle informatif. | Écrire la règle, puis l'outiller : **une porte est un contrôle qui peut être rouge et dont le déploiement dépend** ; tout job qualifié de porte a été vu rouge au moins une fois sur une fixture rouge, **preuve à l'appui (identifiant de run)**. Contrôle mécanique : relever les neutralisations de code de sortie qui portent sur un contrôle, et confronter chaque étage de déploiement aux étages qu'il attend. Classe : `controle-sans-fixture-double-sens`. |
| RT-60 | majeur | générique | **Un outil de qualité déclaré par un dépôt et jamais appelé par sa chaîne est invisible au socle.** Mesure : `frontend/package.json` déclarait `lint` (ESLint, zéro avertissement toléré) et `tsc` ; `backend/pyproject.toml` configurait `ruff` avec une sélection de règles motivée sur trente lignes. **Zéro occurrence des trois dans la chaîne.** Le premier passage, une fois câblés, a trouvé un import mort et quatre erreurs de typage — tous préexistants. Aucune règle du socle ne confronte ce qu'un dépôt **déclare** à ce que sa chaîne **appelle**. | Contrôle de socle, mécanique et sans configuration : lister les scripts de qualité de `package.json`, les linters de `pyproject.toml`, les entrées de `.pre-commit-config.yaml` ; exiger que chacun apparaisse dans la chaîne, sans neutralisation. **Un outil déclaré et non appelé est un outil qui n'existe pas.** Classe : `regle-ecrite-sans-oracle-qui-la-joue`. |
| RT-61 | majeur | générique | **La parité entre l'environnement de test et l'environnement servi n'est contrôlée nulle part.** Mesure : la chaîne testait en Python 3.12 (quatre tâches `UsePythonVersion`), l'image partait de `python:3.11-slim`. Une dépendance ou une syntaxe disponible en 3.12 et absente en 3.11 faisait passer la porte de tests et échouait au démarrage du conteneur — **après** la porte. Le socle ne demande ni l'égalité des versions, ni l'inclusion du manifeste de runtime dans celui de test, ni un test d'import dans l'image finale. Second effet mesuré le même jour : les dépendances étaient épinglées **sans empreinte**, donc une version republiée sous le même numéro entrait sans être vue. | Trois vérifications mécaniques, applicables à tout projet conteneurisé : version d'interpréteur de la chaîne **=** version de l'image ; manifeste de test **⊇** manifeste de runtime ; **test d'import de tous les modules dans l'image finale au build**. Et un verrou à empreintes pour le manifeste servi. Classe : `recette-locale-ne-rejoue-pas-l-environnement-de-la-ci`. |
| RT-62 | **bloquant** | générique | **Une suite de tests qui n'est jouée par aucune chaîne ne dit pas qu'elle est verte : elle ne dit rien — et un correctif de sécurité peut la rendre muette sans que personne ne le sache.** Le fait, daté et mesuré : le 05/09, un correctif ferme le constat P0 du premier audit tiers en retirant un jeton de réinitialisation de la réponse HTTP. **Deux spécifications de bout en bout lisaient ce jeton dans cette réponse.** Elles échouent depuis ce jour. La suite n'étant jouée que sur les postes, personne ne l'a su pendant **six jours** — et le 11/09, en armant la porte, le réflexe naturel devant un rouge aurait été de « réparer » le produit pour faire passer le test, c'est-à-dire **de rouvrir la faille**. Une troisième spécification visait une route `/login/reset-password/:token/:email` supprimée le même jour pour ne plus publier l'adresse dans l'historique du navigateur. Le socle n'exige nulle part qu'une suite existante soit **exécutée par la chaîne**, ni qu'un correctif qui **retire** une donnée d'une réponse soit confronté aux tests qui la lisaient. | Deux règles, et la seconde est celle qui manque partout : (1) **toute suite présente dans le dépôt est jouée par la chaîne, ou déclarée hors porte avec son motif et sa date** — l'absence d'exécution est un état, pas un défaut, mais elle se déclare ; (2) **un correctif qui retire une donnée d'une interface publique cite les tests qui la lisaient**, et le socle refuse un correctif de sécurité dont la suite n'a pas été rejouée. Le contrôle mécanique de (2) est à portée : les tests qui échouent après un correctif de sécurité forment une liste, et cette liste doit être **vide ou justifiée**. Classe voisine : `regle-ecrite-sans-oracle-qui-la-joue` ; classe propre proposée au pilot : `correctif-de-securite-laisse-un-test-muet`. |

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le rapport tiers a trouvé dix-neuf constats que deux passes du kit d'audit **Client-A** n'avaient pas cherchés | famille transverse de dix-neuf actions d'audit, exécutée par un module neuf, et changement de grille de verdict | non | Le trou est dans le **référentiel d'audit de Client-A**, pas dans le socle Factory : le kit juge des ADR d'entreprise (SSO, APIM, Lakehouse) qui n'existent que chez ce client. Remonté au centre Produit-64, pas ici. |
| Les environnements de la chaîne, leurs verrous et leurs approbations vivent chez l'hébergeur, pas dans le dépôt | trois environnements créés avec verrou exclusif et approbation, et un contrôle qui exige leur **export** plutôt que le YAML | oui | généralisable — c'est la moitié de RT-59 : un contrôle qui juge la gouvernance sur le seul fichier versionné juge ce que le dépôt annonce, jamais ce qui protège. Porté dans la proposition de RT-59. |
| Le compte de stockage laissait deux portes ouvertes, justifiées en prose et **sans échéance** | interrupteurs par environnement, fermés en production, et deux entrées au carnet des écarts avec critère de réouverture | non | Le carnet d'écarts et sa discipline (date, coût, critère de réouverture) existent déjà au socle et ont fait leur travail. Rien à ajouter : la règle était là, elle n'était pas appliquée à ce fichier-là. |
| Un défaut d'accessibilité réel — contraste 1,83:1 sur la bascule de rôle — trouvé **en armant la porte** de bout en bout | jeton de composant corrigé, même gris que les deux corrections du 25/08 | non | Le contrôle d'accessibilité existait, il n'était simplement jamais exécuté par la chaîne. C'est RT-62, déjà remonté : le défaut n'est pas le contraste, c'est la suite qu'on n'exécute pas. |
| Le dossier hérité `client-a-env-prod/` invitait à un `docker compose up` un jour de crise | archivé sous `archive/heka-2025/` avec un document qui dit de ne pas le lancer | non | Propre à l'héritage de ce produit. La règle générale — marquer chaque manifeste actif ou archivé — est remontée au centre Client-A dans la famille transverse, pas à la Factory : elle relève de l'audit, pas du socle de fabrication. |

---

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - BAV - Réponse Audit externe Securite Maintenabilite CI-CD - 20260910b.html` | gd-rapport-donnees · 1.0.0 | une règle disant que le tableau de synthèse et les fiches détaillées ne se cumulent PAS sur le même ensemble ; un plafond de largeur qui dépende du nombre de colonnes ; une règle d'homogénéité de largeur à l'échelle de la page | **trois demandes explicites**, dans le même message : « corrige le listing du tableau de synthèse, qui doit intégrer directement les détails dans sa liste, sans recréer un deuxième listing à côté » ; « agrandis la largeur de la page […] sans avoir des cellules trop grandes en hauteur » ; « homogénéise la largeur des contenus […] comme sur l'exemple entre le chapitre 6 et le chapitre 7 » | pour l'indice suivant (`20260911a`) : un tableau à lignes dépliables portant le détail DANS la ligne, un plafond de largeur élargi pour huit colonnes, et une largeur unique sur tous les chapitres | générique |
| `Client-A - BAV - Reponse Audit externe Securite Maintenabilite CI-CD - 20260911a.html` | gd-rapport-donnees · 1.0.0 (les trois corrections ci-dessus appliquées à la main) | les mêmes trois règles — elles n'existent toujours pas au squelette, elles ont été tenues à la main | — (document du jour, pas encore relu par le destinataire) | largeur de conteneur portée à `clamp(85vw, 2100px, 96vw)`, lignes de tableau dépliables portant les six rubriques de chaque constat, `.chap.lire` retiré de tous les chapitres | générique |

---

## Confirmations positives

- **Le squelette `gd-rapport-donnees` tient**, et les trois corrections demandées par le lecteur
  se sont posées **sans le combattre** : le token `--w`, la classe `.chap.lire` et le composant
  de tableau étaient exactement les bons points d'entrée. Ce lot demande des règles, pas une
  refonte.
- **Le repli en cartes par paliers (TF-0558) a absorbé un tableau de huit colonnes** sans une
  ligne de CSS, y compris après l'élargissement du conteneur.
- **`embarquer-composants.mjs --poser` et `--constat`** font le travail en deux commandes, et la
  parité à l'octet près est restée vraie après l'élargissement.
- **Le garde-fou `gitleaks` du socle a refusé un commit**, sur une clé de signature littérale
  écrite dans mes propres tests. Il avait raison : une exception « c'est un fichier de tests »
  est précisément la voie par laquelle une vraie clé finit versionnée. La valeur est désormais
  tirée au hasard à chaque exécution. **Une porte qui mord sur l'auteur du correctif est une
  porte qui marche.**
- **`oracle-lot.mjs` reçu par l'héritage** a permis de juger ce lot **avant** sa remise, chez le
  produit. C'est exactement ce que TF-0597 visait.

---

## Ordre recommandé

1. **RT-62 d'abord** — c'est le seul dont le coût est déjà payé et mesuré : six jours pendant
   lesquels deux tests rouges invitaient à rouvrir une faille P0 fermée. Le remède (« toute suite
   présente est jouée par la chaîne, ou déclarée hors porte avec son motif ») est une règle, pas
   un outil.
2. **RT-59** — la définition de « porte ». Elle commande RT-60 et la moitié des constats d'audit
   de ce lot ; sans elle, chaque projet réinvente le seuil à partir duquel un contrôle compte.
3. **RT-55, RT-56, RT-57 ensemble** — trois règles de socle sur la même page, demandées par le
   même lecteur dans le même message. Les traiter séparément ferait trois allers-retours.
4. **RT-60 et RT-61** — deux contrôles mécaniques, sans configuration, applicables à tout dépôt.
5. **RT-58 en dernier** — une lecture de répertoire dans un oracle existant.

---

## La règle qui aurait évité le retour (TF-0779)

**RT-55, RT-56 et RT-57 suivent un retour humain direct, et aucune règle du socle ne les
couvre.** Le squelette `gd-rapport-donnees` prescrit les composants (tableau repliable, fiches
dépliables, `.chap.lire`, token `--w`) **sans dire comment ils se composent** : ni qu'un même
ensemble ne s'énumère qu'une fois, ni que la largeur doit suivre le nombre de colonnes, ni
qu'elle est une propriété de la page. `check_html.py` juge trente règles de lisibilité et
`render_page.py` quatre largeurs de rendu ; aucun des deux ne mesure la **hauteur** d'une cellule
ni la **variance** des largeurs entre sections. Trois trous du socle, nommés ici — c'est la
règle § 4 de `quality-oracles` : domaine sans oracle, on en définit un.

**RT-59 à RT-62 ne suivent pas un retour humain mais un audit tiers**, et la règle manquante est
la même pour les quatre : le socle décrit des contrôles sans exiger qu'ils **puissent échouer**,
ni qu'ils soient **exécutés**. `ETAPE-MEP.md` énumère M-1 à M-7 ; aucun n'exige une preuve d'avoir
été vu rouge. C'est la formulation que le rapport tiers apporte, et qu'il faut reprendre telle
quelle : *une porte est un contrôle qui peut être rouge.*
