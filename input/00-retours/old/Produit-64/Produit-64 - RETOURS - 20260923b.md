# Lot de retours — Produit-64 → digit-ai-page-html, digit-ai-forge-design — 2026-09-23, indice b

**Émetteur** : produit `Produit-64` · **Cibles** : le socle `digit-ai-page-html`
(`find-in-page.js`) et la forge `digit-ai-forge-design` (`oracle-saisie`) · **Origine** : le
formulaire des valeurs de mise en production du guide développeur, posé le 23/09.

Ce lot porte **2 retours**, trouvés par une sonde navigateur écrite pour ce tour : aucun des
oracles du socle ni de la forge ne les voit.

- **Contexte** : demande du porteur du 23/09/2026 sur le guide développeur — « ajoute un
  formulaire en amont de la liste afin de pouvoir rajouter les commandes personnalisées sur chaque
  étape de la MEP en utilisant les valeurs saisies et nécessaires, comme le trigramme ». Hors run.
- **Références ledger** : sans objet — ce produit ne tient pas de ledger de run.
- **Remise au pilot** : copier ce fichier et son sidecar dans le SAS
  `<pilot>/input/00-retours/_arrivee/`.
- **Statut** : a_remettre

---

## digit-ai-page-html (`digit-ai-page-html`)

La recherche dans la page du socle rend « Aucune occurrence » sur un texte que le lecteur a sous
les yeux dès que ce texte est coupé par une balise en ligne.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-19 | majeur | générique | `find-in-page.js` applique son motif **nœud de texte par nœud de texte** (`highlight`, `TreeWalker` sur `SHOW_TEXT`) : une phrase coupée par une mise en gras, un code ou un lien est dans le texte de la page et introuvable. Mesuré le 23/09 sur `Client-A - Guide développeur POC-to-Prod - 20260922j.html`, livré avant ce tour : « application laissée arrêtée » figure **3** fois dans `#contenu.textContent`, la recherche en compte **2** — l'occurrence manquée est « application **laissée arrêtée** », coupée par un `<strong>`. Et une page qui pose une balise par valeur dans une commande rend ses noms complets introuvables : « CL3_APP_ADO_ABD » → « Aucune occurrence » | chercher dans le texte d'un BLOC (paragraphe, cellule, `pre`) plutôt que dans chaque nœud, puis poser les surlignages par plages sur les nœuds qu'une correspondance traverse ; ou, à défaut, dire au compteur que les correspondances traversant une balise ne sont pas comptées |

### RD-19 — La recherche ne trouve pas un texte coupé par une balise

**Le fait mesuré.** Sonde Chromium du 23/09/2026 sur le `20260922j` : pour « application laissée
arrêtée », `#contenu.textContent` porte 3 occurrences, le compteur du composant en affiche 2 et 2
surlignages sont posés. Le composant découpe le contenu en nœuds de texte et applique son motif à
chacun : une correspondance qui commence dans un nœud et finit dans le suivant n'existe pas pour
lui.

**Ce que le produit a fait chez lui.** Le formulaire du guide pose ses valeurs dans les commandes :
une première version en `<span>` par valeur rendait « CL3_APP_ADO_ABD » introuvable. Le produit a
gardé chaque commande en un seul nœud de texte et peint les valeurs par l'API de surlignage du
navigateur — mesuré : 2 occurrences trouvées. **Le contournement ne vaut que pour ce que le produit
écrit** : les phrases coupées par une mise en gras de la source restent introuvables partout.

## digit-ai-forge-design (`digit-ai-forge-design`)

`oracle-saisie` juge qu'un champ est typé, proposé, borné et atteignable ; il ne juge pas que la
contrainte qu'il porte s'applique.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-20 | majeur | générique | Un attribut `pattern` qui ne se compile pas sous le drapeau `v` est **ignoré** par le navigateur : le champ accepte toute valeur. Mesuré le 23/09 sur le champ « Suffixe du coffre » du guide, motif `[A-Za-z0-9]+(\-[A-Za-z0-9]+)*` — `\-` HORS d'une classe est refusé sous `v` : `new RegExp(…, 'v')` lève `SyntaxError` ; dans Chromium 148, « --!!-- » et « a b » rendent `validity.valid` vrai et `patternMismatch` faux ; la console porte « Pattern attribute value … is not a valid regular expression ». Sur cette page, **`oracle-saisie` rend PASS (« SA1–SA6 sans écart ») et `check_html` PASS** | règle SA7 : tout `pattern` se compile sous `v` — `new RegExp('^(?:' + p + ')$', 'v')` sans exception —, faute de quoi la contrainte déclarée n'existe pas ; fixture rouge : ce motif-ci |

### RD-20 — Un motif de saisie qui ne se compile pas est une contrainte qui n'existe pas

**Le fait mesuré.** La sonde du formulaire compile les 13 motifs de la page avec le drapeau `v` :
12 passent, celui du suffixe lève une exception. Rejoué ensuite sur une copie de la page qui porte
ce motif : Chromium 148 déclare valides « --!!-- » et « a b », la seule trace est une erreur de
console, et les deux oracles qui jugent cette page rendent PASS. Le champ, qui promettait « lettres
et chiffres, séparés au besoin par un tiret simple », acceptait donc n'importe quoi. Corrigé chez
le produit en écrivant le tiret nu hors des classes ; la sonde rend ensuite 13 motifs compilés.

## Ordre recommandé

1. **RD-20 d'abord** : une règle de quelques lignes dans un oracle existant, une fixture de deux
   lignes, et le défaut cesse d'être silencieux partout où un champ porte un motif.
2. **RD-19 ensuite** : le correctif touche un composant embarqué dans de nombreuses pages et demande
   ses fixtures — phrase coupée par un `<strong>`, par un `<code>`, par un `<a>`.

## La règle qui aurait évité le retour

- **RD-19** — aucune clé existante ne décrit le défaut. **Classe proposée** : clé
  `recherche-aveugle-au-balisage-en-ligne`, famille `page-html-socle`, libellé « La recherche dans
  la page compare nœud de texte par nœud de texte : une phrase coupée par une mise en gras, un code
  ou un lien est dans le texte de la page et introuvable ».
- **RD-20** — aucune clé existante ne décrit le défaut. **Classe proposée** : clé
  `contrainte-de-saisie-ignoree-en-silence`, famille `regle-morte`, libellé « Un motif de saisie
  (attribut pattern) qui ne se compile pas sous le drapeau v est ignoré par le navigateur : le champ
  accepte toute valeur, et aucun oracle ne le voit ».

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| La fin d'un identifiant de 36 caractères était rognée dans son champ à 1 440 et 768 px | police des champs à .86 rem, colonne de 21 rem pour les identifiants | non | propre aux dimensions de ce formulaire |
| Les repères des aides se coupaient au milieu (`<NOM-` puis `APPLICATION>`) | `white-space: nowrap` sur les codes des aides | non | la règle `overflow-wrap: anywhere` du guide est un choix du produit pour la prose |
| `render_page` refusait l'introduction du formulaire, étirée à 282 caractères par ligne à 3 840 px, et une rangée de champs incomplète | introduction rangée dans le conteneur de lecture `.lire`, formulaire déclaré `data-colonne-ok` | non | les deux familles ont joué juste, et le socle prévoit les deux déclarations |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot : le livrable est le guide
développeur, rendu par le générateur du produit.

## Confirmations positives

- **`oracle-saisie` a pris le formulaire en charge au premier rendu** : 13 champs, 0 écart, et son
  échappatoire `data-type-motive` a servi à déclarer que le champ « Nom du secret » porte un NOM,
  jamais une valeur.
- **`render_page` a vu deux défauts réels du formulaire** — V18 et `l2_conteneur` —, chacun avec la
  déclaration du socle qui convenait.
- **`controles_desalignes`** a tenu : la sous-grille aligne les champs d'une rangée à 0 px.
