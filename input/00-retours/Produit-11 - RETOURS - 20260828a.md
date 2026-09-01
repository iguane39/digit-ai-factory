# Retours forgés — Produit-11 — 20260828a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : **lot de RECTIFICATION**. Le lot `20260827b`, remis et donc immuable, contient
  une affirmation **factuellement fausse** sur le produit, et c'est le produit qui l'a écrite.
  Le destinataire humain l'a relevée le 28/08 : *« La fiche sécurité html est bien produite par
  le projet, pas par une personne manuellement. »* Vérification faite : il a raison. Ce lot
  rectifie, et remonte la classe de défaut que l'erreur a révélée — laquelle est plus grave que
  celle initialement décrite.
- **Références ledger** : `forge\ledger.jsonl` seq 167 (entrée `type: retour`)
- **Lot précédent** : `Produit-11 - RETOURS - 20260827b.md`, remis et donc immuable.
  **Ce lot ne le remplace pas** : il le corrige par surcouche, seul geste que le protocole permet.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-28

**Numérotation** : Produit-11 tient une séquence `RT-nn` ; RT-1 … RT-40 sont consommés. Ce lot
continue en RT-41 … RT-42.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## La rectification, avant les retours

**Ce que le lot `20260827b` affirme, en section « Remarques restées au produit » :**

> « La fiche de Produit-11 n'est pas produite par `build-fiche.mjs` : c'est un HTML maintenu à la
> main, dérivé une fois du gabarit puis suivi séparément. »

et, en section R-46 : « Le PDF a été produit ce jour, à la main, en rejouant le geste ».

**C'est faux.** La fiche est produite par `outils-audit\batir-fiche.py`, 346 lignes, versionné
dans le dépôt du produit. Preuve, et elle était à une commande de distance :

```
$ git log --diff-filter=A --format="%h %ad %s" --date=short -- outils-audit/batir-fiche.py
1525c69 2026-08-25 Audit POC-to-Prod : les quatre livrables et leurs generateurs
```

Le générateur a été créé **le 25/08, dans le commit même qui a livré la première fiche**, et
suivi depuis (`e7dc5a8` le 26/08, `8226f02` le 27/08, `de82e2a` le 28/08). Il n'y a jamais eu
de HTML tenu à la main. Le lot a décrit comme cause immédiate du défaut une situation qui
n'existait pas, sur le produit qui l'écrivait, et sans la vérifier.

**Portée de la rectification.** Le FAIT MESURÉ de RT-39 tient entièrement : la famille
`gd-fiche-securite` déclare `["html","pdf"]`, TF-0506 a été corrigé le 23/08, et Produit-11 a livré
sans PDF les 25 et 27/08. Les dates, les identifiants et le décompte des 73 items sont exacts et
vérifiables. **Ce qui tombe est la CAUSE proposée**, et donc en partie la justification du
correctif esquissé. La cause réelle est autre — et c'est RT-42.

**Circonstance qui limite les dégâts, et qu'il faut dire :** au 28/08, `todo\TODO.jsonl` de la
factory ne contient aucune occurrence de `RT-39`. Le lot `20260827b` n'est **pas encore ingéré**.
La rectification arrive donc avant toute décision prise sur une cause fausse. C'est une chance
de calendrier, pas une propriété du protocole — et c'est précisément l'objet de RT-41.

---

## factory (`digit-ai-factory`)

Un lot remis étant immuable — règle saine, et qui protège l'intégrité du registre — le produit
qui découvre s'être trompé n'a **aucun geste déclaré** pour l'annoncer. Et le générateur du
produit, lui, n'est pas un instance du générateur de la factory : c'en est une réécriture, ce
qui explique enfin pourquoi une correction de la factory ne peut pas l'atteindre.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-41 | majeur | générique | **Le protocole de retours n'a pas de canal de rectification.** `gabarits\RETOURS-FORGES.md` pose, à raison, qu'« un fichier remis ne se modifie JAMAIS ». Mais aucun champ du sidecar `.tf.jsonl` ne permet de désigner un retour antérieur pour le corriger ou l'annuler : le schéma porte `titre`, `contenu`, `source`, `date_demande`, `gravite`, `portee`, `score`, `preuve_du_cout` — et rien qui pointe en arrière. **Conséquence mesurée sur ce produit :** le lot `20260827b` porte une affirmation fausse (voir ci-dessus) ; une fois ingérée, elle serait devenue un item de `TODO.jsonl` indiscernable d'un item exact, et le seul moyen de la contredire serait un item CONCURRENT que rien ne relie au premier. Un registre qui ne peut pas se corriger n'accumule pas de la connaissance : il accumule aussi ses erreurs, avec le même poids. | Deux champs optionnels au sidecar : `rectifie` (id du retour visé) et `nature_de_la_rectification` (`fait_errone` \| `cause_erronee` \| `annule`). L'ingestion, en les voyant, marque l'item visé — plutôt que d'en créer un second sans lien. Corollaire d'oracle, peu coûteux : refuser un sidecar dont `rectifie` désigne un id inconnu, ce qui empêche une rectification de porter à côté. |
| RT-42 | bloquant | générique | **La vraie cause du défaut de propagation de RT-39 : les générateurs des produits sont des RÉÉCRITURES de ceux de la factory, pas des instances — et une réécriture ne reçoit aucune correction.** Fait mesuré, sur pièces : la factory tient `tools\build-fiche.mjs` (208 lignes, Node), qui produit bien les deux formats et porte même le commentaire « Le catalogue de la bibliothèque déclare deux formats pour cette famille — html ET pdf ». Produit-11 tient `outils-audit\batir-fiche.py` (346 lignes, Python). Le correctif de TF-0506 (commit `56c651c`) a été porté dans le fichier Node ; **aucun mécanisme concevable ne le fait arriver dans le fichier Python.** Et la réécriture n'est pas un caprice : `batir-fiche.py` lit `kit\compliance-pack\Client-A - Modèle Fiche Sécurité Mise à disposition - Dev - 20260710a.html`, un gabarit HTML **imposé par le client**, que `build-fiche.mjs` ne sait pas consommer — il rend depuis `deliverables\templates\fiche-securite.template.md`. Le produit avait donc le choix entre respecter le gabarit du client et employer l'outil de la factory. **Ce constat aggrave RT-39 au lieu de l'excuser** : le produit n'était pas négligent, il possédait un générateur versionné et entretenu, et la correction ne l'a pas atteint quand même. Un manifeste d'adoption (proposition de RT-39) aurait rendu le retard visible ; il n'aurait pas rendu la correction transmissible. | **Propager les ORACLES, pas les générateurs** — un oracle est agnostique du langage, un générateur ne l'est pas. La preuve que le motif fonctionne est déjà au dossier : `batir-fiche.py` appelle `oracles\verifier-pdf.mjs` de la factory, en Node, depuis Python, et s'arrête sur son verdict. Donc : (1) chaque famille du catalogue déclare, à côté de `formats`, la liste des **oracles** qu'un jeu remis doit passer ; (2) un oracle `verifier-jeu-livrables` lit le catalogue et échoue si un format déclaré manque — il aurait refusé les remises des 25 et 27/08 **sans rien savoir du générateur employé** ; (3) `build-fiche.mjs` accepte un gabarit HTML fourni par le produit (`--gabarit`), ce qui rend la réécriture inutile dans le cas Client-A au lieu de la rendre seulement mesurable. |

**Portée** (R-45, 21/08) : les deux retours sont *génériques*. RT-42 vaut pour toute famille dont
un produit doit rendre dans un gabarit imposé par son client — ce qui est la situation normale
d'un livrable remis à un exploitant, pas un cas limite.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le lot `20260827b` a affirmé sans vérifier que la fiche était tenue à la main, alors qu'un `ls outils-audit\` suffisait à le démentir. L'erreur portait sur le produit lui-même, dans un document destiné à décrire ce produit. | Rectifiée par le présent lot. Aucun correctif de code : c'est une faute de méthode de rédaction, pas un défaut d'outil. | **oui** | Généralisable, mais **pas dans la direction attendue**. Ce n'est pas « il faut vérifier avant d'écrire » — cela ne se câble pas. C'est que le protocole ne permettait pas de se dédire : le défaut exploitable est l'absence de canal, **remonté en RT-41**. |
| `20260827a.pdf` n'a pas pu être archivé dans `output\Old\` : le fichier est VERROUILLÉ par une visionneuse ouverte (Windows). | Le générateur le DIT et poursuit, au lieu d'échouer ou de faire silence : « — NON ARCHIVÉES, fichier verrouillé par un autre processus ». | non | Propre au poste Windows et au geste humain d'avoir un PDF ouvert. Aucune règle de la factory n'est en cause, et l'échec est déjà rendu visible plutôt que masqué. |
| La règle de versionnement du kit (§3 : ne jamais écraser, archiver l'ancienne version dans `output\Old\`) était tenue de mémoire, et une session l'a enfreinte — la fiche du 27/08 a été écrasée en la régénérant. | Câblée dans `batir-fiche.py` (`de82e2a`) : date du jour calculée, indice choisi en balayant courants ET archives, archivage automatique. | non | La règle est correctement écrite dans `Client-A - Méthodologie Organisation Audit - 20260724a.md` et n'est pas ambiguë. Le manquement est un défaut d'application local, pas un défaut de règle. Rien à améliorer côté factory. |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - BAV - Fiche Sécurité Mise à disposition - Dev - 20260828c` (html + pdf) | `gd-fiche-securite` · **aucune version portée par l'artefact** — le manque est RT-40 du lot précédent, encore vrai | Aucun champ pour l'authentification des accès, aucun pour la politique de mot de passe. Sur un produit sans second facteur, le mot de passe est le garde-fou principal : une fiche sécurité muette là-dessus laisse croire qu'il n'y a rien à en dire. | Le destinataire a réclamé le PDF **en signalant qu'il l'avait déjà demandé** — il avait raison (TF-0506, corrigé le 23/08). Puis il a relevé une affirmation fausse sur son propre produit dans un lot déjà remis. | Deux lignes injectées après substitution, hors gabarit : « Authentification des accès » et « Politique de mot de passe ». | **générique** — déjà remonté en RT-40 (version du gabarit) ; les deux champs manquants valent pour toute la famille, aucun produit exposé sur Internet n'échappe à la question. |

## Confirmations positives

- **`oracles\verifier-pdf.mjs` tient, et il tient depuis un autre langage.** Appelé par un
  générateur Python via `subprocess`, il rend un verdict exploitable et son code de retour arrête
  la production. C'est la preuve concrète que la proposition de RT-42 est réalisable : elle ne
  demande pas d'inventer un mécanisme, seulement de généraliser celui qui marche déjà.
- **La borne d'honnêteté de l'oracle est explicite et utile** : « il juge le CONTENANT, jamais le
  contenu ». Cette phrase a directement conduit le produit à ajouter un contrôle de parité de mots
  HTML/PDF — un oracle qui déclare son périmètre fait écrire les contrôles qui lui manquent, là où
  un oracle silencieux fait croire que tout est jugé.
- **La règle d'immuabilité des lots remis a fonctionné comme prévu, et c'est pour cela que le
  défaut est visible.** Rien n'a pu être réécrit en douce ; l'erreur a dû être déclarée. RT-41 ne
  demande pas d'assouplir cette règle — il demande de lui adjoindre le geste qui lui manque.

## Ordre recommandé

1. **RT-42** — meilleur rapport gain/effort de très loin, et seul retour qui referme la boucle
   ouverte par RT-39. Le point (2), un oracle qui confronte un jeu remis au `formats` du
   catalogue, est écrivable en une petite journée, ne dépend d'aucune décision de gouvernance,
   et aurait refusé les deux remises incomplètes de Produit-11 sans rien connaître du générateur.
   Le point (3), `--gabarit` sur `build-fiche.mjs`, supprime la cause au lieu de la mesurer.
2. **RT-41** — effort faible (deux champs et un contrôle d'ingestion), mais à traiter avant
   l'ingestion du lot `20260827b`, sans quoi la première rectification à exercer sera précisément
   celle qui manque de canal. Le présent lot est la démonstration du besoin.
