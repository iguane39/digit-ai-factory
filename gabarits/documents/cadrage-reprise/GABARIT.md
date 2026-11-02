# Gabarit — Cadrage de reprise

**Famille** `gd-cadrage-reprise` · **Version du gabarit** 1.0.0 · **Écrite le** 02/11/2026

> **Formats** Markdown
> **Règles engagées** D6 D8 D9 D11 (`gabarits\documents\README.md`)
> **Provenance** le dossier de cadrage de la reprise d'un produit, écrit le 28/10/2026 chez
> `Produit-84` pour préparer un Build (lot `Produit-84 - RETOURS - 20261030a`, RT-31, TF-2047).
> Aucune famille ne le couvrait : `gd-dossier-architecture` vise une remise à un comité, la fiche
> de conception a déclaré « aucune » et G6 n'a jugé aucun gabarit. Les cinq parties sont celles que
> le retour énumère ; le pilot n'ouvre pas le dossier chez le produit, donc leur contenu détaillé est
> posé ici et se corrigera au premier dossier remis (boucle de retour). La forme est reprise,
> jamais la matière : l'instance est fictive.

## La règle qui commande toutes les autres

**Un cadrage de reprise se lit pour approuver : ce qui va être touché, où, et qui l'approuve, avant
que le Build commence.** Chaque geste qui écrit ailleurs que dans le dépôt porte sa cible, son effet,
sa réversibilité et son approbateur. *Un geste distant dont l'approbateur n'est pas nommé s'exécute
quand même, et personne ne l'a décidé.*

## Quand l'employer

Préparer la reprise d'un produit existant, par une session de Build ou par une équipe qui ne l'a pas
construit : fixer le besoin, relever les configurations de chaque environnement, découper le travail
en lots, dire comment chaque lot se recette, et lister les gestes qui touchent un système distant
(hébergement, domaine, service de données, dépôt distant) pour les faire approuver un par un.

Le livrable se nomme `<Marque> - Cadrage de reprise - <sujet> - AAAAMMJJ<indice>.md` : « Cadrage »
est au registre des types (R-25), et « Cadrage de reprise » ouvre le champ `<Objet>` de R-4, sinon
`oracle-gabarits-documents` (G8) ne le rattache à aucune famille.

**Frontière avec `gd-dossier-architecture`.** Celui-ci remet à un comité ou à un repreneur la
structure d'un produit, les décisions qui l'ont façonnée et l'écart entre l'existant et la cible. Le
cadrage prépare un travail : il ne décrit pas l'architecture, il dit ce qui sera fait, dans quel
ordre et sous quelles approbations.

**Frontière avec `gd-ordonnancement-mep`.** Celui-ci rend à un comité de changement l'ordre d'une
mise en production. Le cadrage vient avant le Build et couvre tous les environnements, la mise en
production n'en est qu'un lot.

**Frontière avec `gd-fiche-produit`.** Celle-ci remet le périmètre fonctionnel d'un produit à
concevoir, en paliers. Le cadrage de reprise part d'un produit qui existe déjà.

## Structure — les cinq parties sont dues, plus les sources

| # | Partie | Porte | Ne porte pas |
|---|---|---|---|
| 1 | **Le besoin** | La demande citée dans les mots du demandeur, le résultat attendu, le périmètre et ce qui en est exclu | La solution, ni l'architecture visée |
| 2 | **Les configurations par environnement** | Un tableau élément × environnement : la valeur, ou l'emplacement du secret quand la valeur est secrète, la source où elle se lit, l'écart entre environnements | Une valeur secrète, une clé, un jeton |
| 3 | **Les lots** | Un tableau `# · Lot · Contenu · Dépend de · Preuve de fin`, dans l'ordre d'exécution | Les tâches fines d'un lot |
| 4 | **La recette** | Pour chaque lot, un critère binaire, qui le joue, avec quoi, et où le résultat se lit | « Vérifier que cela fonctionne » |
| 5 | **Les gestes distants à approuver** | Un tableau `# · Geste · Cible distante · Effet · Réversible · Approbateur · État` | Un geste local au dépôt |
| 6 | **Sources** | Une ligne : les fichiers, relevés et commits lus, avec leur date | La démarche qui y a mené |

## Les vocabulaires fermés

- **Environnement** : les noms que le produit emploie (`dev`, `recette`, `production`, ou les siens),
  les mêmes dans les parties 2, 3, 4 et 5.
- **Réversible** : `oui` suivi du retour arrière en quelques mots, ou `non`.
- **Approbateur** : une personne ou un rôle nommé, jamais « l'équipe ».
- **État du geste** : `à approuver` · `approuvé le JJ/MM/AAAA` · `refusé`.
- **Preuve de fin** (lot) et **critère** (recette) : un fait qui se constate (un fichier, un code de
  retour, un affichage), jamais une intention.

## Les refus de ce gabarit

- **Un geste distant sans approbateur nommé.** La colonne se remplit pour chaque ligne, sinon le
  lecteur ne sait pas à qui s'adresser.
- **Un geste exécuté avant son état « approuvé ».** Le Build ne joue que les gestes passés à
  `approuvé le …` ; les dépenses et les mises en production restent des décisions humaines (R-29).
- **Une valeur secrète écrite.** On nomme l'emplacement (gestionnaire de secrets, variable
  d'environnement), jamais le contenu ; les fichiers `.env` ne transitent pas.
- **Une configuration sans source.** Une valeur se lit quelque part (fichier, console, commande) ; sans
  cette source, elle n'est pas vérifiable et se marque « non vérifiée ».
- **Un lot sans preuve de fin, une recette sans critère binaire.** Un lot qui ne se constate pas ne se
  clôt pas.
- **Un environnement manquant en silence.** Un environnement sans configuration relevée s'écrit
  « non relevé » avec son motif, sinon le lecteur croit à un oubli.

## Le lecteur se déclare

Tout document tiré de ce gabarit déclare son lecteur en tête, frontmatter en `md` :

```
role_destinataire: {qui approuve les gestes et le découpage, et ce qu'il décide à la lecture}
```

## Avant de remettre

1. Chaque geste de la partie 5 a un approbateur nommé et un état du vocabulaire fermé.
2. Chaque environnement cité en partie 2 revient en parties 4 et 5, ou dit pourquoi non.
3. Aucune valeur secrète dans le document : relire la partie 2.
4. Aucun `{…}` restant.

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire`. Tout ce qui n'entre pas dans ses
décisions sort d'ici et vit dans le **document d'auteur** : un fichier distinct, tenu par celui qui
produit, cité en renvoi et jamais recopié :

- le **journal du relevé** : commandes jouées, sorties brutes, pistes abandonnées ;
- l'**historique des versions** du cadrage et ce qui a changé d'un indice à l'autre ;
- les **notes de production** : valeurs à confirmer, questions à l'auteur.

**La frontière est un critère d'ACTION, pas de confort.** Une information qui change ce que le lecteur
FAIT reste chez lui, même quand elle est inconfortable : « ce geste supprime des données de la
recette » appartient à la colonne Effet. Une information qui ne change que ce que l'AUTEUR doit
encore obtenir part au document d'auteur.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*

## Oracles

- `oracle-gabarits-documents.mjs` du pilot : G1 (gabarit, squelette et instance), G2 (instance
  remplie), G4 (le couple rendu), G7 (les sections déclarées), G8 (le nom du livrable résout sa
  famille), G10, G13 ;
- `oracle-ecriture.mjs` du pilot sur le cadrage (tournures creuses, phrases longues).

Aucun oracle propre à la famille n'existe : les cinq parties et le vocabulaire des états ne sont pas
jugés sur un cadrage remis. Le premier dossier réel dira si un oracle de forme se justifie.

## Limites du jugement

- **La justesse des valeurs** de la partie 2 : rien ne les relit à la source.
- **L'exhaustivité des gestes** de la partie 5 : un geste distant omis passe tous les contrôles.
- **Le choix de la famille** : un document qui aurait dû être un dossier d'architecture passe les
  contrôles s'il tient la forme.
- **Le couple gabarit et version** : G4 le trouve aussi dans le frontmatter, donc un pied de page
  absent n'est pas vu sur un document Markdown.

## Boucle de retour

Le document produit porte `gabarit: gd-cadrage-reprise` et sa version, en tête et en pied. Un retour
sur la **forme** se remet au pilot, par la section « Retours sur les documents produits » du lot
(`gabarits\RETOURS-FORGES.md`).
