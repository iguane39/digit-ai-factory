---
role: la convention unique pour un dépôt du parc qu'on met de côté — un PRÉFIXE au nom, pas une exclusion dans chaque contrôle
sources_de_verite: [bootstrap.mjs §4 bis (le contrôle qui déclare), references/REGLES-DE-NON-REPETITION.md (règle N-13)]
verifie_le: 2026-08-25
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

### Si le dépôt archivé est une copie du PILOT, le renommage ne suffit pas

Vécu le 25/08/2026 en archivant `digit-ai-forge-steering_old` (TF-0525). Une copie du pilot porte une
signature **indiscernable** de l'original : `resoudre-pilot.mjs` peut la choisir. Le renommage ne l'en
écarte pas — c'est le marqueur `PERIME.md` à la racine, et lui seul, qui le fait. **Les deux gestes,
donc, jamais un seul.**

```bat
rem 1. la pierre tombale — ce qui écarte la copie du résolveur de pilot
rem    (y écrire QUOI, POURQUOI, et ce que le dépôt porte encore de non committé)
rem 2. le renommage — ce qui le sort du motif `^digit-ai` de tous les balayages
ren digit-ai-forge-machin _archive-digit-ai-forge-machin
```

**Ce marqueur ne se committe pas, et c'est délibéré.** Une copie du pilot partage son dépôt distant
avec le pilot vivant : committer puis pousser `PERIME.md` apposerait « PÉRIMÉ » **sur le dépôt
vivant**. La limite est réelle et s'écrit dans le marqueur lui-même — il ne survivrait pas à un
nouveau clonage. C'est le prix, et il est plus bas que celui de l'alternative.

**Un marqueur non versionné ne survit pas seulement mal au clonage — il peut ne pas survivre du
tout.** Fait mesuré : le 23/08, TF-0525 consigne que ce clone *porte* un `PERIME.md` non versionné,
et `bootstrap.mjs` en tire sa leçon (« un avertissement qui ne survit pas au clonage n'avertit
personne »). Le 25/08, mesuré avant d'écrire quoi que ce soit : **le fichier était absent.** Deux
jours, et la pierre tombale n'était plus là. La cause n'est pas établie et n'est pas devinée ici.

Ce que ça impose au geste : **le marqueur se repose et se remesure**, il ne se suppose jamais. Et
c'est le renommage — versionné dans le nom du répertoire, donc visible sans ouvrir le dossier — qui
porte l'avertissement durable ; le marqueur, lui, ne fait qu'une chose que le nom ne sait pas faire :
écarter la copie du résolveur de pilot.

## Ce que cette convention n'autorise pas

- **Écarter un dépôt en le nommant dans un oracle.** Si le cas ne se règle pas par le préfixe, la
  cause n'est pas traitée : elle s'écrit à côté de l'exclusion, ou elle se traite à la racine.
- **Supprimer.** Le 23/08/2026, le parc portait un clone archivé de 99 Mo contenant un `.env` et une
  histoire git de 110 commits de retard. Rien de tout cela ne s'efface sur une heuristique.

  *Remesuré le 25/08 :* ce clone-là **n'est plus dans le parc**, et le seul répertoire `_archive-`
  qui subsiste est celui du jour — le clone du pilot, **124 Mo**, 169 commits de retard. La
  convention n'en tire aucune conclusion sur ce qui lui est arrivé : supprimer est un geste humain,
  légitime, et qui n'a pas à se justifier auprès d'un document. Ce qu'elle en retient, c'est que
  **le parc d'hier n'est pas le parc d'aujourd'hui** — un exemple daté se remesure avant d'être cité.

  Et **archiver ne libère rien** : les 124 Mo restent. C'est le prix assumé de ne pas décider à la
  place de l'humain.
