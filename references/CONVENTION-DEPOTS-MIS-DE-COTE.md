---
role: la convention unique pour un dépôt du parc qu'on met de côté — un PRÉFIXE au nom, pas une exclusion dans chaque contrôle
sources_de_verite: [bootstrap.mjs §4 bis (le contrôle qui déclare), references/REGLES-DE-NON-REPETITION.md (règle N-13)]
verifie_le: 2026-08-23
---

# Un dépôt mis de côté se RENOMME, il ne s'exclut pas

## La règle, en une ligne

**Un dépôt du parc dont on ne veut plus se renomme `_archive-<son nom>`.** Il sort ainsi du motif
`^digit-ai` que tous les balayages emploient — **une fois, à un seul endroit** — au lieu d'être
écarté nommément dans chaque contrôle.

## Le fait qui l'a produite, et il a coûté deux fois

Le 23/08/2026, un clone **périmé** du dépôt renommé en `forge-seo-geo` vivait encore dans le parc :
même dépôt distant, trois commits de retard. Il avait été contourné **par son nom** dans un seul
oracle (`^digit-ai-forge-seo$`). Conséquence mesurée : tous les autres balayages le comptaient comme
un dépôt **vivant** — le contrôle des promesses annonçait « 16 dépôts » pour 15 et lisait 26 fichiers
de trop. *Un contournement local règle le symptôme là où on regarde et laisse la cause fausser tout
le reste* (règle **N-13**).

La même journée, deux autres répertoires ont montré la version durable du problème : ils étaient
écartés par des **suffixes** (`_old$`, `_vide$`, `.bundle$`) répétés dans plusieurs oracles. Ces
alternatives ont été retirées le jour où les répertoires ont pris le préfixe `_archive-` : **plus
aucune cible**, donc des règles mortes qui donnaient l'illusion d'une protection.

## Ce que la convention garantit, et ce qu'elle ne garantit pas

**Elle garantit** qu'un dépôt archivé disparaît de tous les balayages qui filtrent sur `^digit-ai`
— présent et futurs, sans qu'un seul contrôle ait à connaître son nom.

**Elle ne le fait pas disparaître de tout.** Deux contrôles continuent de le voir, et c'est voulu :

- `bootstrap.mjs` §4 bis **le déclare à chaque ouverture** — « SECOND CLONE de … », avec son retard
  en commits. Un dépôt archivé reste un piège : on peut y travailler par mégarde, et *y travailler
  écrit dans un registre mort*. Le contrôle le dit et **ne l'efface jamais** : supprimer un
  répertoire est un geste humain (R-29).
- `oracles/resoudre-pilot.mjs` continue de l'examiner, parce qu'une copie du pilot porte une
  signature indiscernable de l'original. C'est le marqueur **`PERIME.md`** à la racine du dépôt qui
  l'écarte, pas son nom — un fichier, pas une convention de nommage, parce que le résolveur doit
  pouvoir se tromper *bruyamment* plutôt que choisir en silence entre deux dépôts qui se ressemblent.

## Le geste, en pratique

```bat
ren digit-ai-forge-quelquechose _archive-digit-ai-forge-quelquechose
```

Puis relancer `node bootstrap.mjs --pull` : le dépôt doit apparaître **une fois**, en avertissement,
avec son retard. S'il n'apparaît plus du tout, ce n'est pas un progrès — c'est un piège redevenu
silencieux, et le contrôle est à corriger.

## Ce que cette convention n'autorise pas

- **Écarter un dépôt en le nommant dans un oracle.** Si le cas ne se règle pas par le préfixe, la
  cause n'est pas traitée : elle s'écrit à côté de l'exclusion, ou elle se traite à la racine.
- **Supprimer.** Le parc porte au 23/08/2026 un clone archivé de 99 Mo qui contient un `.env` et une
  histoire git de 110 commits de retard. Rien de tout cela ne s'efface sur une heuristique.
