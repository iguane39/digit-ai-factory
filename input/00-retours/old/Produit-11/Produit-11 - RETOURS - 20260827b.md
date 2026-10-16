# Retours forgés — Produit-11 — 20260827b

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : production de la fiche sécurité `20260827a`, livrée en HTML seul. Demande
  humaine : *« le fichier est généré en html mais il devrait aussi être généré en pdf, comme
  déjà demandé. Remonte ce point à la factory en indiquant que cette demande de génération en
  pdf avait déjà été faite, qu'elle a été implémentée mais que visiblement elle n'est pas
  redescendue dans les produits […] et que cela fait plusieurs demandes remontées, traitées,
  redescendues et toujours pas à jour pour les produits. Certaines actions n'ont pas été prises
  en compte par les produits, ne permettant pas d'être à jour des exigences implémentées au
  niveau de la factory. A corriger une fois pour toute. »*
- **Références ledger** : `forge\ledger.jsonl` seq 166 (entrée `type: retour`)
- **Lot précédent** : `Produit-11 - RETOURS - 20260827a.md`, remis et donc immuable.
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-27

**Numérotation** : Produit-11 tient une séquence `RT-nn` ; RT-1 … RT-38 sont consommés. Ce lot
continue en RT-39 … RT-40.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## Le fait mesuré, avant toute interprétation

La demande humaine décrit un défaut de propagation. La vérification sur pièces le confirme et
en donne l'ampleur : **ce n'est pas un oubli, c'est l'absence d'un mécanisme.**

### Ce que la factory a déjà décidé, et quand

`todo\TODO.jsonl`, item **TF-0506**, trois événements :

| Date | Événement |
|---|---|
| 22/08/2026 | **création** — demandeur `Produit-04`. Titre : *« forge-audit : la famille gd-fiche-securite declare deux formats (html, pdf) et la forge n en produit qu un »* |
| 23/08/2026 | **décidé** — décideur : *« Sebastien (pilote humain) — mandat du 23/08 »* |
| 23/08/2026 | **corrigé** — `version_forge_corrigee` : *« forge-audit — oracles/verifier-pdf.mjs + build-fiche a deux formats (commit 56c651c) ; pilot — catalogue des gabarits »* |

Et le champ qui rend le défaut opposable :

> `produits_beneficiaires` : **`['tout produit recevant une fiche securite', "tout run d'audit
> produisant un jeu de livrables a deux formats"]`**

Le catalogue confirme, `gabarits\documents\catalogue.jsonl`, entrée `gd-fiche-securite` :
`"formats":["html","pdf"]`, et sa preuve porte noir sur blanc : *« COMPLÉTÉE le 23/08
(TF-0506) : les deux formats déclarés ci-dessus étaient déclarés et UN SEUL était produit […]
build-fiche.mjs rend désormais HTML et PDF en une passe. »*

### Ce que le produit a livré, après cette correction

| Livrable | Date | HTML | PDF |
|---|---|---|---|
| `Client-A - BAV - Fiche Sécurité … - 20260825a.html` | 25/08 | oui | **non** |
| `Client-A - BAV - Fiche Sécurité … - 20260827a.html` | 27/08 | oui | **non** |

**Deux occasions manquées, à deux et quatre jours de la correction**, sur un produit
explicitement nommé bénéficiaire. Le PDF a été produit ce jour, à la main, en rejouant le geste
de `build-fiche.mjs` (Edge `--headless=new --print-to-pdf`) puis en le faisant juger par
`oracles\verifier-pdf.mjs` de la forge : verdict **PASS**, code 0 — P1 complet, P2 A4 portrait
lu dans le fichier, P3 deux pages, P4 fraîcheur. Contrôle ajouté de mon côté, que l'oracle
déclare hors de son périmètre (*« l'oracle juge le CONTENANT, jamais le contenu »*) :
**2 100 mots dans le HTML, 2 100 dans le PDF, aucune perte**.

### Ce qui prouve que le cas n'est pas isolé

`Produit-03` a remonté **la même classe deux fois de plus**, les 24/08a et
24/08b, sur la même famille de gabarit. Son lot du 24/08a écrit, mot pour mot :

> *« le document ne porte **aucune version de gabarit dans son en-tête**, et c'est déjà un
> manque en soi »* … *« Le destinataire a demandé le PDF de cette fiche. Le PDF rendait 1 132
> mots pour 1 313 dans la page : sections 7 et 8 et pied de page absents. »*

Donc : **trois produits, trois demandes, du 22 au 24/08**, sur un sujet corrigé le 23/08.

Et le décompte qui donne l'échelle : dans `todo\TODO.jsonl`, **73 items sont au statut
`corrige` avec des `produits_beneficiaires` de la forme « tout produit »**. Aucun mécanisme, ni
côté factory ni côté produit, ne dit lesquels un produit donné a effectivement absorbés.

### La preuve que la propagation est sélective, pas absente

Le plus révélateur n'est pas ce que Produit-11 a manqué, c'est ce qu'il a **absorbé**. La feuille de
style de sa fiche porte ce commentaire :

> *« Hauteur dimensionnée par le CONTENU (plus de min-height:297mm) — vaut aussi à l'ÉCRAN : une
> capture/rasterisation (média screen) d'une carte forcée à 297mm + marge débordait sur une 2e
> page A4. »*

C'est exactement la leçon du lot `Produit-03 - 20260824a`, celle de la
troncature. Elle est arrivée chez Produit-11. Le PDF du même lot, non.

**Une correction voyage donc quand une session tombe sur le bon fichier, et pas autrement.**
`produits_beneficiaires` est une déclaration d'intention, jamais une livraison suivie. TF-0502
avait déjà nommé le sujet le 22/08 — *« la propagation des règles du pilot vers les produits
reste le manque »* — et son correctif n'a traité qu'un cas particulier : la recopie du gabarit
de retours à chaque ouverture de run.

---

## factory (`digit-ai-factory`)

Un item passe à `corrige` quand la **forge** est réparée. Rien ne mesure si le **produit** l'a
reçu. Les deux retours ci-dessous visent ce chaînon, pas la qualité des corrections — qui, elle,
est bonne : `verifier-pdf.mjs` a jugé le tirage de Produit-11 du premier coup.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RT-39 | **bloquant** | générique | **Une correction marquée `corrige` n'est jamais suivie jusqu'au produit.** TF-0506, corrigé le 23/08, porte `produits_beneficiaires: ['tout produit recevant une fiche securite']` — Produit-11 a livré une fiche le 25/08 et une autre le 27/08, **les deux sans PDF**. Trois produits avaient remonté la même classe du 22 au 24/08. Et **73 items** au statut `corrige` déclarent des bénéficiaires « tout produit », sans qu'aucun registre ne dise lesquels un produit a absorbés. Le champ est en PROSE, donc non interrogeable : on ne peut même pas produire la liste des obligations d'un produit donné. Preuve de la sélectivité : Produit-11 a absorbé la leçon de troncature du lot 24/08a (commentaire dans sa feuille de style) et pas le PDF du même lot. | Rendre la propagation **mesurable des deux côtés**. (1) Côté factory : `produits_beneficiaires` devient une liste de critères interrogeables (`famille_de_gabarit`, `type_de_livrable`) et non de la prose — sans quoi aucun contrôle n'est écrivable. (2) Côté produit : un manifeste `forge\socle-adopte.jsonl` — un item TF par ligne, avec date d'adoption et **preuve** (fichier, commande, empreinte). (3) Un oracle qui confronte les deux et **ÉCHOUE** quand le produit est en retard, sur le modèle de `oracle-conformite-projet` (R-47), déjà employé pour la recopie du gabarit de retours. Une obligation non câblée n'existe pas — c'est la leçon TF-0597, appliquée à la propagation elle-même. |
| RT-40 | **majeur** | générique | **Un livrable produit ne porte pas l'identifiant ni la version du gabarit qui l'a produit**, donc une instance périmée est invisible sur l'artefact. La fiche de Produit-11 porte en en-tête sa date et sa référence documentaire, rien d'autre : ni `gd-fiche-securite`, ni version. Un lecteur — exploitant, auditeur, RSSI — ne peut pas savoir si la fiche qu'il tient respecte le catalogue en vigueur. `Produit-03` l'a écrit le 24/08 (*« c'est déjà un manque en soi »*) et c'est encore vrai trois jours plus tard, sur un autre produit. Conséquence pratique constatée : la section R-46 du présent gabarit demande de reporter `gabarit` + `version_du_gabarit`, et un produit honnête ne peut que répondre « aucun » — ce qui prive la factory du seul signal dont elle a besoin. | Le bloc d'en-tête de chaque gabarit porte `gabarit: <id>` et `version_du_gabarit: <semver>`, **rendus dans le document livré** — visibles, pas seulement en commentaire HTML. Corollaire qui ferme la boucle avec RT-39 : un oracle peut alors juger un artefact SANS registre, en comparant la version qu'il porte à celle du catalogue. C'est le contrôle le moins cher de la chaîne, et le seul qui fonctionne sur un document reçu par courriel, hors de tout dépôt. |

---

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La fiche de Produit-11 n'est pas produite par `build-fiche.mjs` : c'est un HTML maintenu à la main, dérivé une fois du gabarit puis suivi séparément. | Non corrigée. Le PDF a été produit en rejouant le geste de l'outil, pas en employant l'outil. | **oui** | Généralisable, et c'est la cause immédiate du défaut : un livrable détaché de son générateur ne peut recevoir aucune correction de ce générateur. **Remonté en RT-39** — le manifeste et l'oracle proposés le rendent visible ; sans eux, chaque produit détaché redécouvre chaque correction. |
| La fiche `20260827a` fait désormais **deux pages A4** au tirage, contre une pour les versions précédentes, du fait des deux lignes ajoutées sur l'authentification et les mots de passe. | Assumé : la hauteur est dimensionnée par le contenu depuis l'absorption de la leçon du 24/08. Deux pages complètes valent mieux qu'une page tronquée. | non | Le nombre de pages d'une fiche dépend de ce que le produit a à déclarer. La classe — « une fiche à hauteur fixe tronque » — est déjà remontée et corrigée (lot 24/08a) ; rien à ajouter. |
| `pypdf` a été installé dans le venv de développement pour comparer le texte du HTML et celui du PDF. | Volontaire, hors dépendances de l'image déployée. | non | Outillage de vérification local, propre au produit. La classe utile — « comparer le contenu, pas seulement le contenant » — appartient à l'oracle et **est déjà déclarée** dans son `reste_a_faire` (TF-0506) : rien de neuf à remonter. |

---

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `Client-A - BAV - Fiche Sécurité Mise à disposition - Dev - 20260827a.html` et `.pdf` | `gd-fiche-securite` · **aucune version portée par le document** — le gabarit est `porte_ailleurs`, dans `digit-ai-forge-audit\deliverables\templates\`, et l'instance n'inscrit ni son identifiant ni sa version en en-tête (RT-40) | **Le second format déclaré au catalogue**, `pdf` : le jeu remis était incomplet, comme le 25/08 et comme le 22/08 chez un autre produit. Manque aussi une ligne d'en-tête déclarant le gabarit et sa version | Le destinataire a **réclamé le PDF**, en disant qu'il l'avait *« déjà demandé »* — et il avait raison : la demande existait, tracée en TF-0506, corrigée quatre jours plus tôt. C'est un fait rapporté, pas une intuition d'auteur | Le tirage PDF (Edge `--headless=new --print-to-pdf`, le geste même de `build-fiche.mjs`), sa validation par `oracles\verifier-pdf.mjs`, et la comparaison du texte HTML contre le texte PDF — 2 100 mots contre 2 100 | **générique** |

Deux précisions qui font la valeur de ce retour :

- **Ce qui a gêné le lecteur est daté et tracé.** La phrase *« comme déjà demandé »* est
  vérifiable : TF-0506, créé le 22/08, corrigé le 23/08. Le destinataire n'a pas exprimé une
  préférence, il a constaté qu'une exigence connue n'était pas tenue.
- **Ce qui a été ajouté à la main est exactement ce que la forge sait déjà faire.** Le geste
  existe, l'oracle existe, la recette existe — treize tests. Ce qui n'existe pas, c'est le
  chemin par lequel un produit apprend qu'il doit s'en servir.
