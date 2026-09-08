# Gabarit — Ordonnancement des étapes de mise en production

> **Famille** `ordonnancement-mep` · catalogue `gd-ordonnancement-mep`
> **Formats** Markdown (source) · HTML (rendu remis au comité)
> **Règles engagées** D1 D3 D4 D6 D7 (`gabarits\documents\README.md`)
> **Provenance** extrait du livrable `Client-A - Ordonnancement des etapes de MEP -
> Produit-03 - 20260903a` (48 étapes, 7 lots), jugé PASS par `check_html.py` (36/36),
> `render_page.py` (4 largeurs, fermé et états ouverts) et `oracle-filtres-tableau.mjs`.
> **Gabarit : gd-ordonnancement-mep** · **Version du gabarit : 1.0.0**

**Ce que ce document est, et ce qu'aucun autre ne fait.** Le dossier de MEP (`ETAPE-MEP.md`)
dit ce qu'il faut PROUVER ; la checklist de GO production (forge-audit) dit ce qu'il faut
CONSTATER le jour J. Aucun des deux ne dit **dans quel ordre**, ni **qui doit agir**, ni **ce
qui casse si on inverse deux étapes**. C'est le trou que cette famille comble : un
ordonnancement est un graphe de dépendances rendu lisible, pas une liste de tâches.

**Pourquoi la famille existe (TF-0889, 03/09/2026).** Sur les trente familles du catalogue,
`dossier-mep` est portée ailleurs (format Markdown), `checklist-go-prod` chez forge-audit,
`dossier-cab` à extraire — aucune ne décrivait un ordonnancement. Conséquence mesurée : une
page de 127 Ko écrite intégralement à la main sur le boilerplate, dont l'en-tête déclarait
« aucun gabarit ». *Un document sans fil gabarit ne peut recevoir aucun retour de forme* : la
section R-46 des lots de retours reste vide, et le défaut se rejoue au projet suivant.

---

## Structure — les cinq sections sont dues

### 0 · En-tête

```
---
destinataire: humain
role_destinataire: {qui décide sur ce document — comité de changement, porteur, RSSI}
---

# Ordonnancement des étapes de mise en production

**Projet** : {nom} · **Indice** : {AAAAMMJJ<i>} · **Date** : {JJ/MM/AAAA}
**Commit de référence de ce document** : {branche @ date} · **Artefact visé** : {tag, commit}
**Sources** : {dossier de changement, constats d'audit, état du dépôt vérifié le …}
**Gabarit : gd-ordonnancement-mep** · **Version du gabarit : 1.0.0**
```

Le **commit de référence** et l'**artefact visé** sont dus, et ils ne sont pas décoratifs : un
ordonnancement décrit un ÉTAT du dépôt. Sans eux, une étape « à construire » devient
incompréhensible dès que quelqu'un a poussé, et le lecteur ne peut pas savoir si le document
parle encore de ce qu'il a sous les yeux.

`destinataire: humain` est **lu par un oracle** (R-2 d'`oracle-conformite-projet` ne juge la
localisation que des artefacts MARQUÉS). `gabarit` et `version_du_gabarit` sont **rendus
visiblement**, jamais seulement en commentaire — c'est le fil qui rend un retour de forme
rattachable (G4 d'`oracle-gabarits-documents`).

### 1 · Comment lire ce tableau

Trois choses, et rien d'autre :

- **le compte** — « N étapes, M lots, un seul ordre » ; puis la phrase qui dit que l'ordre est
  une contrainte établie, pas une préférence de rédaction, et qui annonce combien
  d'inversions cassent la MEP (renvoi à la section 4) ;
- **la légende des NATURES**, en tableau, vocabulaire FERMÉ à cinq valeurs :

  | Nature | Ce que cela veut dire |
  |---|---|
  | **Décider** | Un arbitrage ou une signature. Ne produit aucun artefact technique, mais débloque ceux qui suivent. N'appartient pas au projet. |
  | **Construire** | Un objet qui n'existe pas — code, pipeline, objet de plateforme, attestation. |
  | **Corriger** | Un objet qui existe et porte un écart mesuré. |
  | **Configurer** | Un réglage sur un objet existant. |
  | **Exécuter** | Un geste du mode opératoire, à date et heure. |

  *Pourquoi fermé* : « Décider » et « Construire » ne se plannifient pas de la même façon et ne
  s'adressent pas aux mêmes personnes. Un vocabulaire ouvert laisse écrire « à traiter », qui
  ne dit ni qui ni quoi.
- **la légende du BLOCAGE**, vocabulaire fermé à trois valeurs : `MEP` (sans lui, la mise en
  production ne peut pas être prononcée) · `fenêtre` (sans lui, la fenêtre du jour J ne peut
  pas être engagée) · `—` (l'écart peut être assumé et signé). **Deux niveaux ne suffisent
  pas** : confondre « bloque la MEP » et « bloque la fenêtre » fait reporter un changement pour
  une étape qui n'avait besoin que d'un autre créneau.

Cette section dit enfin **ce que le tableau ne couvre pas**, avec le renvoi à la section 3 —
les écarts exclus sont exclus, pas oubliés (loi transverse n° 3).

### 2 · Les lots ordonnés — un chapitre par lot, un tableau à COLONNES FIXES

Un lot = un groupe d'étapes qui partagent une fenêtre temporelle et un propriétaire dominant.
Son titre porte sa fenêtre relative (`T-5 → T-2 jours`, `J-1`, `J`, `J+1`), jamais une date
absolue tant que le créneau n'est pas attribué — c'est une étape « Décider » qui l'attribue.

Les colonnes sont **fixes, dans cet ordre, pour tous les lots** :

| # | Objet | Nature | Ce qu'il y a à faire | Dépend de | Propriétaire | Bloquant | Preuve de fin |
|---|---|---|---|---|---|---|---|

- **#** — identifiant stable et continu sur tout le document (`S-01`, `S-02`, …). Continu
  ENTRE les lots : c'est lui qui sert dans la colonne « Dépend de » et dans la section 4 ;
- **Ce qu'il y a à faire** — l'ÉTAT CONSTATÉ d'abord (« le pipeline ne porte aujourd'hui aucun
  des trois gestes : zéro occurrence de … dans le fichier »), puis le geste. *Une étape écrite
  sans son état constaté se conteste* ; écrite avec, elle se vérifie ;
- **Dépend de** — la liste des `#`, ou `—`. C'est la seule colonne qui porte l'ordre ; les lots
  ne sont qu'une mise en page de lecture ;
- **Propriétaire** — un RÔLE, jamais un nom de personne (le document circule et survit aux
  affectations) ;
- **Bloquant** — une des trois valeurs de la légende ;
- **Preuve de fin** — ce qu'on doit VOIR pour dire que c'est fini : une sortie de commande, un
  objet visible dans une console, un document signé. « Fait » n'est pas une preuve de fin.

**D3 s'applique** : huit colonnes, donc repli en cartes sous 900 px. **D4** : les colonnes qui
portent une date ou une fenêtre portent `data-v` avec la valeur triable, sinon le tri du
tableau range `J-1` après `J`.

### 3 · Écarts déclarés, maintenus hors du chemin

> **Exclus, pas oubliés.** Un lecteur qui ne trouve pas un sujet connu dans le tableau doit le
> trouver ICI avec son motif — sans quoi il ne peut pas distinguer un arbitrage d'un oubli, et
> c'est exactement ce qu'un comité cherche.

| Objet | Statut | Motif de l'exclusion | Décision attendue de |
|---|---|---|---|

Statuts admis : `accepté, mesuré` (l'écart porte un chiffre) · `assumé` · `ouvert` ·
`partiel` · `hors périmètre`. Un écart `accepté` sans mesure est un écart `ouvert` qui se
présente bien : la colonne du motif porte le chiffre, ou le statut redescend.

### 4 · Les inversions qui cassent la MEP

**Le reste du tableau se réordonne sans dommage ; celles-là, non.** Une par entrée numérotée,
et chacune dit les TROIS choses : quelles étapes, dans quel ordre, **et ce qui casse si on les
inverse** — en toutes lettres, jamais « cela peut poser problème ».

*C'est la section qui justifie le document.* Sans elle, un ordonnancement est un planning de
plus ; avec elle, il porte l'information que personne d'autre ne détient. Sur le livrable
d'origine, sur 48 étapes, exactement **trois** inversions étaient destructrices — et les trois
étaient invisibles dans le dossier de changement.

### 5 · La lecture pour le comité

Cinq à dix lignes, en langage de décideur, qui répondent à une seule question : **qu'est-ce
qui manque vraiment ?** On y compte, sur le total des étapes, combien relèvent du code, combien
d'objets de plateforme absents, combien de décisions ou de signatures, et combien de mode
opératoire déjà écrit. Puis la phrase qui tranche — sur le livrable d'origine : « le produit
est prêt ; ce qui manque est essentiellement de l'autorité et deux objets de plateforme ».

Cette section se rédige **en dernier et se lit en premier**. Un comité qui doit dériver ce
constat lui-même de 48 lignes de tableau ne le dérivera pas.

---

## Ce que ce document ne fait JAMAIS

- **il ne remplace pas le mode opératoire** : une étape « Exécuter » renvoie au runbook, elle
  ne le recopie pas — deux copies d'une commande divergent au premier correctif ;
- **il ne date pas ce qui n'est pas décidé** : tant que le créneau n'est pas attribué, les
  fenêtres restent relatives. Écrire une date probable la fait citer comme un engagement ;
- **il ne juge pas le produit** : il ordonne des étapes. Le verdict sur la sécurité, la
  qualité ou l'exploitabilité appartient aux livrables de ces familles.

## Oracles

| Contrôle | Ce qu'il tient |
|---|---|
| `check_html.py` (digit-ai-page-html) | charte, sémantique, accessibilité, robustesse d'impression du rendu HTML |
| `render_page.py` (digit-ai-page-html) | zéro défaut visuel sur 4 largeurs, **états ouverts compris** — un tableau de 48 lignes se juge déplié |
| `oracle-filtres-tableau.mjs` | tout tableau de 8 lignes ou plus embarque ses filtres (L4/L13) |
| `oracle-gabarits-documents.mjs` (G1-G4) | cette famille porte sa doctrine, son instance remplie, et rend son couple gabarit + version |

## Boucle de retour

Un manque constaté sur ce gabarit remonte par la section **« Retours sur les documents
produits »** du lot de retours du projet (R-46), avec le couple `gd-ordonnancement-mep` +
version. Sans ce couple, le retour dit « il manquait une section » et personne ne sait à quoi
l'appliquer.
