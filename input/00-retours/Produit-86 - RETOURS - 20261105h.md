# Retours forges — Produit-86 — 20261105h

- **Contexte** : clôture du run `20261105d-evolution-lexique-des-ecrans`. Sur la lettre « 477a » du porteur, chaque écran du portail déclare son lexique (règle X9 de forge-design, exigée pour le statut « prêt pour la production » à partir du 19/11/2026). Préproduction `21e8df7` redéployée et rejouée de bout en bout.
- **Références ledger** : `forge\ledger.jsonl` seq 580, 581 et 589 (entrées `type: retour`) ; seq 587 pour le défaut resté au produit ; retour antérieur cité : RP-25 (lot 20261105e).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 05/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 05/11/2026 : `todo/CLASSES.json` du pilot, 241 classes, filtré sur `lexique|infobulle|details|verifier|livrable|mobilis|identifiant`. RP-39 se rattache à `regle-balaie-prose-et-identifiants` : la règle X9 reconnaît un terme dans une adresse ou un nom d'hôte. RP-40 se rattache à `oracle-faux-positif` : render_page juge un panneau fermé à une largeur qu'aucun lecteur ne voit. Aucune classe ne décrit un vérificateur qui exige un livrable que la demande ne touche pas : RP-41 propose la sienne.

## digit-ai-forge-design

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-39 | majeur | générique | La règle X9 d'`oracle-exploitabilite` exige une infobulle sur chaque occurrence visible d'un terme déclaré au lexique. Elle reconnaît aussi le terme dans un identifiant : « approbateur » dans l'adresse `approbateur@pentests.test`, « SYNTHETIC » dans le nom d'hôte `lab-juice.synthetic`, « agent » dans `agent-ia`. Une fois le lexique déclaré, le portail rendait 28 constats X9 sur 8 écrans, dont « approbateur » 28 fois sur la file d'approbation, surtout dans des adresses. Souligner et rendre focalisable chaque occurrence aurait ajouté des dizaines d'arrêts de tabulation par écran. Ledger seq 580. | Dans X9, ne pas reconnaître un terme collé à « @ », « . » ou « - » d'un identifiant, et admettre en clair la forme « première occurrence accessible, occurrences suivantes en `title` ». |
| RP-40 | mineur | générique | `render_page.py` (appelé par `run-oracles-design --rendu`) a jugé en bloquant L2 et `prose_etroite` le `<dl>` d'un `<details>` fermé, à la largeur de son résumé : 154 px pour des fenêtres de 1 440 à 3 840 px. Le même `<details>` ouvert mesure 1 376 px dans Chromium. Mesure : 4 L2 et 4 `prose_etroite` par thème sur l'écran du tableau, 0 après avoir donné au `<details>` fermé le reste de sa ligne. Ledger seq 581. | Mesurer un `<details>` après l'avoir ouvert et laissé reprendre sa mise en page, ou ne pas juger la prose d'un panneau fermé. |

## pilot (mobilisation)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-41 | mineur | générique | `mobiliser.mjs --verifier` exige les 2 livrables de design (`DESIGN.md` et `tokens.css`) écrits après la demande dès que design est mobilisée, quel que soit le type de la demande. Ici, l'évolution ajoute un composant posé sur les jetons existants, donc `tokens.css` n'a pas à changer. Le vérificateur rend MANQUE « jetons périmé », et seule une écriture sans objet de `tokens.css` le ferait passer. La carte du type « evolution » n'exige pourtant aucun livrable de design. Ledger seq 589. | Pour une forge mobilisée hors des forges privilégiées du type, n'exiger que les livrables que la demande touche, ou accepter un livrable inchangé quand le motif de mobilisation le dit. |

## La règle qui aurait évité le retour

- `regle-balaie-prose-et-identifiants` (RP-39) : une règle sur la prose ne juge pas les identifiants machine qui s'y trouvent.
- `oracle-faux-positif` (RP-40) : un oracle juge ce que le lecteur voit, dans l'état où il le voit.
- `livrable-exige-hors-perimetre-de-la-demande` (RP-41) : un vérificateur n'exige que les livrables que la demande change.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le rappel des termes insérait un `span` dans le bouton « Lancer l'agent IA », un `inline-flex` avec écart : le libellé se coupait et le nom accessible devenait « Lancer l' agent IA ». Les 2 parcours de l'agent IA échouaient en préproduction `1b6e8d9`. | Dans un contrôle ou un conteneur flex ou grid, la définition va sur le parent en `title` (commit `21e8df7`) ; les 2 parcours repassent au vert en préproduction | oui, mais déjà couvert | reste au produit, parce que la classe `composant-qui-reecrit-le-dom-de-ses-voisins` du registre le décrit déjà ; consigné au ledger seq 587 |
| La bulle de visite guidée (L2) et le formulaire du mandat (EF1, EF4) restent en écart à la critique de rendu | non corrigés dans ce run : présents à l'identique sur le code d'avant | non : propres à ce produit | reste au produit, parce que ce sont des écarts du portail, hors du lexique ; consigné au ledger seq 588 |
| forge-tests rend PARTIEL sur la page « adresse inconnue » voulue par un test | aucune correction côté produit | oui | déjà remonté (RP-24) |
| `mobiliser --verifier` retient le rapport forge-tests du 03/11 et masque celui du jour | aucune correction côté produit | oui | déjà remonté (RP-25) |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261105g) |

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.

## Confirmations positives

- Les tests de bout en bout écrits au run précédent ont attrapé en préproduction un défaut que l'oracle d'exploitabilité, la critique de rendu et la suite unitaire laissaient passer : le bouton coupé de l'agent IA.
- Rejouer la même critique de rendu sur le code d'avant, avec les mêmes données, a départagé en une passe les écarts neufs des écarts préexistants.

## Ordre recommandé

RP-39 d'abord (il fixe la forme attendue des infobulles), puis RP-41, puis RP-40.
