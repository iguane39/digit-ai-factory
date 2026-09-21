# Gabarit — Synthèse exécutive

**Famille** `gd-synthese-executive` · **Version du gabarit** 1.0.0 · **Extraite le** 14/09/2026

## Quand l'employer

Donner à une **instance de décision** ce qu'elle doit lire pour trancher, et rien de plus :
verdict, score global, risques majeurs, décisions attendues. Une page.

*Ce qui la distingue de la note de synthèse* : la synthèse exécutive s'adresse à une **instance**
et porte le **score** d'un audit ; la note de synthèse s'adresse à un rôle et demande **une**
décision. Employer l'une pour l'autre produit un document qui n'engage personne.

## D'où la forme est tirée

De `digit-ai-forge-audit/deliverables/templates/synthese-executive.template.md`, 44 lignes, qui
porte le **contrat de contenu** de la famille. Ce gabarit-ci ne le duplique pas : il en fournit la
**forme HTML**, qui n'existait nulle part. *Le fond reste chez la forge qui l'a écrit ; la
bibliothèque donne la page.*

## Structure — les six sections sont dues

Les six sections suivent l'ordre de lecture d'une instance, jamais l'ordre de production de
l'audit : le verdict d'abord, ce qu'il faut trancher ensuite, le détail en renvoi. *Comment lire
ce tableau* : une ligne par section, dans l'ordre où elle apparaît au document ; la dernière
colonne est la borne, et c'est elle qui empêche la synthèse de redevenir un rapport.

| # | Section | Ce qu'elle porte | Ce qu'elle ne porte pas |
|---|---|---|---|
| 1 | **Verdict** | Le verdict et le score global, trois à cinq lignes | Aucun risque, aucune décision |
| 2 | **Les trois risques majeurs** | Trois au plus, énoncés en **impact métier** | Le plan de remédiation complet |
| 3 | **Les décisions attendues** | Ce qui est tranché, par quel rôle, avant quand, et l'option par défaut | Les arguments : ils vivent au rapport |
| 4 | **Coût et délai de remédiation** | L'ordre de grandeur, en **complexité × durée** | Aucun montant, **jamais de jours** |
| 5 | **La prochaine échéance** | La date, et ce qui y sera mesuré | Le calendrier complet |
| 6 | **Pour aller plus loin** | Les renvois vers le rapport, le registre des risques, le plan | Un résumé de plus |

## Les deux vocabulaires fermés

- **Probabilité d'un risque** : `forte` · `moyenne` · `faible`.
- **Effort de remédiation** : complexité `simple | moyen | complexe | très complexe` × durée
  `court | moyen | long | très long`. **Jamais en jours** : avec l'IA, un nombre de jours n'a pas
  de sens, et l'échelle du rapport d'audit est celle-ci.

## Ce que ce gabarit refuse

- **Un risque énoncé en vocabulaire technique.** Une instance de décision arbitre des impacts
  métier ; un risque qu'elle ne sait pas traduire, elle ne le tranche pas.
- **Plus de trois risques et trois décisions.** La borne est le sujet même du document.
- **Un résumé du rapport.** Le chapitre 6 renvoie ; un résumé de plus serait un troisième
  document à tenir à jour.

## Le lecteur se déclare

Tout document tiré de ce gabarit déclare son lecteur en tête — frontmatter en `md`, bloc
d'identification en `html` :

```
role_destinataire: {qui lit cette synthèse exécutive, et pour quelle décision}
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
- `oracle-gabarits-documents.mjs` du pilot — G1 à G5 ;
- pour le **fond** : la recette de `digit-ai-forge-audit`, qui possède le contrat de contenu.

## Boucle de retour

Le document produit porte `gabarit: gd-synthese-executive` et sa version, **visiblement**. Un
retour sur la forme se remet au pilot ; un retour sur le **fond** se remet à `digit-ai-forge-audit`.
