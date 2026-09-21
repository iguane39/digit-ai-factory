# Gabarit — Note de synthèse

**Famille** `gd-note-synthese` · **Version du gabarit** 1.0.0 · **Extraite le** 14/09/2026

## Quand l'employer

Porter à un commanditaire **non technique** le résultat d'un travail long — audit, diagnostic,
étude — quand ce lecteur doit décider et n'a ni le temps ni le vocabulaire du rapport complet.

*Ce qui la distingue de la synthèse exécutive* : la note de synthèse s'adresse à **une personne
ou un rôle**, et demande **une** décision ; la synthèse exécutive s'adresse à une **instance** et
porte un verdict d'audit avec son score. Employer l'une pour l'autre produit un document qui
n'engage personne.

## D'où la forme est tirée

De `gabarits/RESTITUTION.md` du pilot, et de sa doctrine : **le verdict d'abord, la décision
ensuite, le détail après** — l'ordre de lecture d'un décideur, jamais l'ordre de production.
Deux règles y sont reprises telles quelles : le bloc d'ouverture en **langage de commanditaire**,
sans identifiant nu ni chemin de fichier ; et une décision qui porte **son option par défaut**,
faute de quoi elle n'est pas un choix fermé.

## Structure — les quatre sections sont dues

### 1 · Le verdict

Trois à cinq lignes, en langage de commanditaire : ce qui va, ce qui ne va pas, ce qui est
demandé. **Un lecteur qui s'arrête ici repart avec le résultat.** Aucun identifiant nu, aucun
terme technique non expliqué, aucune mesure — les mesures fondent le verdict au chapitre suivant.

### 2 · Les trois constats qui fondent le verdict

**Trois est une borne, pas une cible.** Au-delà, un commanditaire non technique ne retient plus
rien, et la note devient un rapport court plutôt qu'une synthèse. Chaque constat porte :

| Colonne | Ce qu'elle doit contenir |
|---|---|
| **Constat** | Ce qui a été constaté, dans les mots du lecteur, sans jargon non expliqué |
| **Ce qui a été mesuré** | Le chiffre ou le fait, **avec son unité**. Un constat sans mesure est une impression |
| **Où le vérifier** | Le document, la console ou la commande qui rejoue la mesure |
| **Gravité** | Vocabulaire fermé : `bloquant` · `majeur` · `mineur` |

### 3 · La décision attendue

La décision, le rôle qui la prend, l'échéance, **et ce qui se passe si rien n'est décidé**. *Une
note qui ne demande rien n'avait pas besoin d'être écrite* ; une décision sans option par défaut
n'est pas un choix fermé, c'est une question.

### 4 · Ce que cette note ne couvre pas

Les sujets volontairement absents, chacun avec son motif. **Exclus, pas oubliés** : un lecteur
qui ne trouve pas un sujet connu doit pouvoir distinguer un arbitrage d'un oubli.

## Ce que ce gabarit refuse

- **La méthode.** Comment l'audit a été mené n'intéresse pas ce lecteur ; cela vit au rapport.
- **Plus de trois constats.** Le quatrième affaiblit les trois premiers.
- **Un verdict conditionnel.** « Il semblerait que » n'est pas un verdict — soit la mesure permet
  de trancher, soit le constat descend en « ouvert » avec ce qui manque pour le fermer.

## Le lecteur se déclare

Tout document tiré de ce gabarit déclare son lecteur en tête — frontmatter en `md`, bloc
d'identification en `html` :

```
role_destinataire: {qui lit cette note de synthèse, et pour quelle décision}
```

*Ajouté au report du 21/09/2026 : la règle D11 est née sur main le 15/09, pendant que cette
famille s'écrivait sur une branche qui ne la voyait pas.*

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas
dans ses décisions sort d'ici et vit dans le **document d'auteur** — un fichier distinct, tenu par
celui qui produit, cité en renvoi et jamais recopié :

- le **registre des arbitrages** encore ouverts, avec leur instance et leur état ;
- l'**historique des versions** du document et son statut de relecture ;
- les **notes de production** : sources à confirmer, sections à reprendre, questions à l'auteur.

**La frontière est un critère d'ACTION, pas de confort.** Une information qui change ce que le
lecteur FAIT reste chez lui, même quand elle est inconfortable : « cette règle n'est pas encore
opposable, appliquez-la et signalez tout écart » appartient au document du lecteur, parce qu'un
lecteur doit savoir sur quoi il s'engage. Une information qui ne change que ce que l'AUTEUR doit
encore obtenir part au document d'auteur. Le doute utile au lecteur se dit à l'endroit qui le
concerne ; le doute de l'auteur ne le suit pas.

**Un document long se découpe en VUES d'un fichier unique, pas en fichiers**, sauf demande
contraire de son lecteur : onze fichiers à partager sont un coût pour lui, jamais pour son auteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `check_html.py` du socle `digit-ai-page-html` — charte, accessibilité, lisibilité L1-L32 ;
- `render_page.py` du même socle — zéro défaut visuel, dont **V19** (une seule largeur de contenu) ;
- `oracle-gabarits-documents.mjs` du pilot — G1 à G5.

## Boucle de retour

Le document produit porte `gabarit: gd-note-synthese` et sa version, **visiblement**. Un retour
sur la forme se remet au pilot par un lot `RETOURS`, section « Retours sur les documents
produits » : ce qui a été **ajouté à la main** est le signal le plus fort.
