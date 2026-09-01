# Retours forges — Produit-01 — 20260827a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : régénération de la **fiche sécurité de mise à disposition (DEV)** d'Produit-01
  le 27/08, à la demande du propriétaire du produit, après le lot de recette consolidé du
  26/08. La fiche a été produite en HTML selon le §10 de `compliance.skill.md`, puis le
  propriétaire a demandé « la fiche doit également être générée en PDF ». Le kit ne le dit
  nulle part — et l'inspection du PDF précédemment diffusé a montré ce que cette absence de
  prescription avait produit.
- **Références ledger** : `forge\ledger.jsonl` seq 65, 66 (entrées `type: retour`)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici (historique du produit).
- **Statut** : remis le 2026-08-27

**Numérotation** : séquence produit `RG-nn` continuée (RG-01 … RG-29 consommés). Ce lot porte
RG-30 et RG-31.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

---

## La mesure qui porte ce lot

Le §10 de `compliance-pack/compliance.skill.md` prescrit la fiche sécurité en **quatre lignes**,
et ne parle que de HTML :

> - Nom du fichier de sortie : `Client-A - <PROJET> - Fiche Securite Mise a disposition - Dev - <AAAAMMJJ>.html` ; Ref. interne `<TRIGRAMME>-SEC-DEV-<AAAAMMJJ><indice>`.
> - Zero placeholder `{{...}}` restant ; inclure le lien du projet deploye en DEV. La fiche accompagne le rapport d'audit.

Le `README.md` du pack décrit de même le gabarit comme produisant un `.html`.

Or **le livrable réellement diffusé est un PDF** : c'est sous cette forme qu'il part vers
l'équipe sécurité, et c'est ce que le propriétaire du produit a demandé le 27/08. Le kit ne
prescrit ni ce format, ni le moyen de le produire, ni aucun contrôle sur lui.

**Ce que l'absence de prescription a produit, mesuré sur le dossier de livraison d'Produit-01
tel qu'il était avant aujourd'hui :**

| Fichier | Taille | Ce que l'inspection montre |
|---|---|---|
| `…Fiche Sécurité Mise à disposition - Dev - 20260724c.pdf` | 653 169 o | **1 page, 0 caractère de texte extractible, 9 images incorporées** |
| `…Fiche Sécurité Mise à disposition - Dev - 20260724d.html` | 14 203 o | indice **d** — une révision **postérieure** à celle du PDF déposé à côté |

Deux défauts, dans un seul dossier, qu'aucune porte n'a vus :

1. **le PDF diffusé est une IMAGE.** Il a été obtenu par capture/rastérisation, pas par une
   impression. Conséquences vérifiables : il n'est pas recherchable (aucun `Ctrl-F` sur une
   référence), il est **muet pour un lecteur d'écran** — pour un document adressé à l'équipe
   sécurité, ce n'est pas un détail —, il ne peut être contrôlé par aucune machine, et il pèse
   **cinq fois** le même document imprimé en texte (653 Ko contre 124 Ko mesurés aujourd'hui) ;
2. **le PDF et le HTML ne sont pas au même indice.** Le PDF porte `c`, le HTML voisin porte
   `d`. Le HTML d'indice `c` n'existe plus que dans `Old/`. Ce qui a été diffusé n'est donc pas
   la révision de référence conservée à côté de lui, et **rien ne l'a signalé**.

Le second défaut découle du premier : un PDF qu'aucun outil ne produit est un PDF qu'on
régénère à la main, quand on y pense, à partir de la version qu'on a sous les yeux.

---

## RG-30 · Le livrable diffusé de la fiche sécurité est un PDF, que rien ne prescrit, n'outille ni ne contrôle

**Gravité : majeur** · impact 3 · effort **S**

**Constat.** Le §10 ne décrit que la sortie HTML. Le PDF — la forme sous laquelle la fiche est
réellement transmise — n'est mentionné ni dans `compliance.skill.md`, ni dans le `README.md` du
pack, et aucun outil du `compliance-pack/` ne le produit, alors que le pack en fournit pour le
rapport d'audit (`verifier-rapport-audit.mjs`, `verifier-remediation.mjs`, `maj-versions.mjs`).

**Cause.** La prescription s'arrête au fichier de référence et ne suit pas le livrable jusqu'à
sa forme diffusée. Chaque projet improvise donc sa propre chaîne d'export — et une capture
d'écran est, pour qui n'a pas d'outil sous la main, le chemin le plus court.

**Ce qui rend la correction facile** : le gabarit fait déjà le plus dur. Il porte
`@media print` et `@page{size:A4 portrait;margin:8mm}`, avec un commentaire qui explique le
dimensionnement par le contenu. Il est **conçu pour être imprimé** ; il ne manque que
l'instruction et l'outil qui s'en servent.

**Action proposée.**

1. **§10 prescrit les DEUX sorties** : `.html` (référence, conservée) et `.pdf` (diffusion),
   avec la règle explicite que **le PDF est IMPRIMÉ depuis le HTML, jamais capturé**.
2. **Le pack fournit le moyen** — un `compliance-pack/fiche-en-pdf.mjs` d'une vingtaine de
   lignes. Celui écrit ici aujourd'hui fait le travail et peut être repris tel quel :
   Playwright/Chromium, `emulateMedia({media:'print'})`, `printBackground: true`,
   `preferCSSPageSize: true` — ce dernier étant le point non évident : sans lui, Chromium
   impose ses propres format et marges et **ignore le `@page` du gabarit**, donc deux sources
   décident de la mise en page et la fiche imprimée cesse de ressembler à la fiche relue.
3. **Règle d'indice** : le PDF porte le **même indice** que le HTML dont il est imprimé. Une
   fiche rendue sans son PDF de même indice n'est pas complète.

---

## RG-31 · La fiche sécurité n'a aucun vérificateur, alors que ses règles sont mécaniques

**Gravité : mineur** · impact 2 · effort **S**

**Constat.** Le rapport d'audit dispose d'une porte **bloquante** (`verifier-rapport-audit.mjs`,
§9 : « le rapport n'est CONFORME (diffusable) que si exit code = 0 »). La fiche sécurité, elle,
n'a aucun contrôle — alors que le §10 pose deux règles parfaitement vérifiables par machine :
« zéro placeholder `{{...}}` restant » et « inclure le lien du projet déployé en DEV ».

**Cause.** Le pack a outillé le document le plus volumineux et laissé l'autre à la relecture
humaine. C'est défendable pour une fiche de deux pages — sauf que la relecture humaine porte
sur le HTML, et que **ce qui est diffusé est le PDF** (RG-30). Aucun œil ne relit l'artefact
réellement transmis.

**Action proposée.** Un `compliance-pack/verifier-fiche-securite.mjs` sur le modèle de son aîné :
zéro placeholder, les 8 sections présentes, référence interne au format
`<TRIGRAMME>-SEC-DEV-<AAAAMMJJ><indice>` et cohérente entre en-tête et pied, lien DEV présent.
Et — si RG-30 est retenu — deux contrôles de plus, qui auraient chacun attrapé un des deux
défauts constatés : **indice du PDF égal à celui du HTML**, et **PDF porteur de texte
extractible** (un seuil grossier suffit : un PDF de fiche sous quelques centaines de caractères
est une image).

---

## Confirmations positives

- **Le gabarit de fiche est bien conçu pour l'impression**, et cela a été vérifié en
  l'imprimant : le `@page{size:A4;margin:8mm}` et le dimensionnement par le contenu produisent
  un PDF propre du premier coup, sans réglage. Le commentaire du gabarit documente même
  pourquoi le `min-height:297mm` a été retiré — un cas où l'intention est écrite là où elle
  sert. **Le manque n'est pas dans le gabarit, il est dans ce qui l'entoure.**
- **La structure en 8 sections a tenu une régénération à quatre semaines d'écart.** La fiche du
  27/08 reprend celle du 24/07 en ne modifiant que ce qui a changé : les sections n'ont eu ni à
  être renommées ni à être réordonnées, et les écarts d'une version à l'autre restent lisibles.
  C'est exactement ce qu'on attend d'un gabarit de document récurrent.

## Ordre recommandé

1. **RG-30** — la prescription et l'outil. Vingt lignes de script et trois lignes de skill, et
   le défaut disparaît pour tous les projets à la fois. C'est aussi le préalable de RG-31 : sans
   règle d'indice, il n'y a rien à vérifier.
2. **RG-31** — le vérificateur, qui transforme deux règles écrites en deux règles tenues. À
   embarquer avec RG-30 : les deux contrôles les plus utiles du second n'existent que si le
   premier est retenu.
