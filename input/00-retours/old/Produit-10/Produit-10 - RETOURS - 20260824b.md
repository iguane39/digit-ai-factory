# Retours forges — Produit-10 — 20260824b

- **Contexte** : le destinataire des livrables a signalé en session, le 24/08, qu'aucun lien
  vers un livrable ne s'ouvrait au clic. Le défaut a été isolé par un **test à deux liens**
  conduit avec lui, puis contourné localement. Il a demandé la remontée pour traitement.
- **Références ledger** : `forge\ledger.jsonl` seq 61.
- **Remise au pilot** : copié dans `<PILOT_ROOT>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-08-24

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `Produit-10 - RETOURS - 20260824a`, remis le même jour. La séquence d'ids
continue en **`RV-12`** côté factory.

---

## Le fait qui ouvre ce lot

Le nommage daté du socle (**R-4**) produit des noms de fichiers **à espaces** :
`Produit-10 - Prompt Construction du mapping ALX vers Silver referentiels - 20260824a.md`.
Le résolveur de liens de la session de travail **coupe le chemin au premier espace** : aucun
lien Markdown vers un livrable ne s'ouvre, quelle que soit la forme employée.

**Mesuré le 24/08, par test à deux liens sur un fichier créé pour l'occasion**, `TEST-LIEN.md`,
sans aucun espace dans son nom :

| Lien testé | Cible | Résultat |
|---|---|---|
| `[TEST-LIEN.md](TEST-LIEN.md)` | fichier **sans espace**, chemin relatif à la racine du produit | **s'ouvre** |
| `[TEST-LIEN.md](_Client-A/Produit-10/TEST-LIEN.md)` | même fichier, chemin préfixé du dossier parent | n'ouvre pas |
| `[…](output/Produit-10%20-%20Prompt%20…%20-%2020260824a.md)` | livrable **à espaces**, espaces encodés | n'ouvre pas |
| `[…](<output/Produit-10 - Prompt … - 20260824a.md>)` | même livrable, forme à chevrons | n'ouvre pas |

Le premier test **écarte** l'hypothèse de la racine de workspace — elle est correcte — et
**isole** l'espace comme cause unique. Ni l'encodage `%20`, ni la forme à chevrons du Markdown,
qui sont les deux parades standard, ne franchissent l'obstacle.

## factory (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-12 | majeur | générique | **Le nommage daté du socle rend tout livrable inatteignable au clic, et le garde-fou qui existe est conditionnel, non mécanisé, et lui-même à espaces.** R-4 impose `<Projet> - <Objet> - AAAAMMJJ<indice>.<ext>` : trois espaces au minimum, six en pratique. Mesuré le 24/08 par le test ci-dessus : le lien vers un fichier sans espace s'ouvre, celui vers un livrable ne s'ouvre pas — encodé ou non. Conséquence sur ce seul produit : **22 livrables**, **0 atteignable au clic**, sur toute la durée du projet ; le destinataire les ouvrait à la main, chemin absolu par chemin absolu, sans que personne ait nommé la cause pendant onze jours. La classe est **générique** : elle vaut pour tout produit du parc qui applique R-4, et le parc en compte 22 sous le seul dossier `_Client-A`. Le socle **anticipe** pourtant le besoin — **D-15 al. e** prévoit un `LISEZMOI.md` de mapping dans `output\` — mais il est (1) **conditionnel** : « obligatoire **si références antérieures** », donc absent partout où il n'y a pas de renumérotage à documenter ; (2) **non mécanisé** : sa mécanisation dans `oracle-conventions` est un **candidat** depuis le 13/08 (`TF-0149`), et le rapport de `oracle-conformite-projet` déclare en toutes lettres que la structure interne d'`output\` « n'est PAS jugée ici » ; (3) **non outillé** : aucun gabarit ni générateur ne le produit, là où `TODO-PRODUIT` et les vues `docs\projet\` en ont un. Instancié ici à la main le 24/08 : il fonctionne — le fichier s'ouvre au clic, et les liens qu'il porte s'ouvrent depuis l'éditeur. | Trois pistes, par ordre de coût croissant. **(1)** Rendre `LISEZMOI.md` **inconditionnel** dans `output\` — il cesse d'être un document de renumérotage pour devenir la **porte d'entrée** du dossier — et le doter d'un générateur, sur le modèle de `todo\generer-todo-produit.mjs` : le dossier connaît les fichiers qu'il contient, aucun émetteur n'a à tenir un index à la main. **(2)** L'ajouter au contrôle de `oracle-conformite-projet` : présence, fraîcheur (un livrable présent et non indexé est un défaut), et **absence d'espace dans son propre nom** — c'est la seule contrainte qui compte, et elle est mécanique. **(3)** N'exempter R-4 pour aucun livrable : le nom daté porte la version et la traçabilité, il n'est pas le problème. Ce qui manque est **un point d'entrée que l'outillage sait atteindre**, pas un renommage du parc. |

**Portée** (R-45) : *générique* — le défaut vaut pour tout projet appliquant le socle.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Aucun des 22 livrables de `output\` n'était atteignable au clic depuis la session | `output\LISEZMOI.md` créé le 24/08, nom sans espace, indexant 22 fichiers en 15 familles avec source Markdown et vue HTML en regard ; vérifié ouvrant au clic par le destinataire | **oui** | Le contournement est local ; ce qui est généralisable, c'est que **le socle prévoyait déjà l'index, sous condition, sans outil et sans contrôle** → remonté en **`RV-12`** |
| `output\` porte **deux versions courantes** pour la famille « Rapport mapping Bronze al2 vers Silver Client-A » : `20260813a` et `20260819a`, la seconde remplaçant la première | **non corrigée** : le constat est écrit sous le tableau de `LISEZMOI.md`, la décision de déplacer un livrable déjà remis appartient à l'humain | **non** | Écart local à D-15 (« une version courante à la racine »), découvert **en construisant l'index** — ce qui est en soi un argument pour la piste (2) de `RV-12` : un index mécanisé aurait vu le doublon dès le 19/08 |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output\LISEZMOI.md` — index des livrables | **aucun** — ce document n'existe dans aucun gabarit | un gabarit d'index de dossier de livrables, alors que `D-15 al. e` le prévoit en prose | le destinataire a écrit « aucun des 2 liens n'ouvre le fichier », puis a demandé un essai sans espace dans le nom | l'index entier, sa structure, son regroupement par famille et son en-tête explicatif | **générique** — tout projet dont les livrables portent le nommage daté a le même besoin |

**Aucun document produit depuis un gabarit** de `gabarits\documents\` : ce projet est une analyse de données et la bibliothèque n'en porte pas de gabarit. Le tableau ci-dessus rapporte donc ce qui a manqué **faute de gabarit**, ce qui est l'autre moitié du même signal.

## Confirmations positives

- La commande d'ouverture directe (`code "<chemin absolu>"`) fonctionne et a servi de parade
  immédiate pendant le diagnostic — le poste de travail n'est pas en cause.
- Le nommage daté lui-même n'a **jamais** été mis en défaut par ce lot : il porte la version et
  la traçabilité, et le lot ne demande pas de l'assouplir.

## Ordre recommandé

Un seul retour : **`RV-12`**. Sa piste (1) — index inconditionnel et générateur — suffit à
supprimer le défaut chez tous les consommateurs ; la piste (2) est ce qui l'empêche de se
reperdre, et elle n'a de sens qu'après.
