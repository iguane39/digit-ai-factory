# Gabarit — Mode d'emploi d'un livrable-dossier (LISEZMOI)

> **Famille** `mode-emploi-livrable-dossier` · catalogue `gd-mode-emploi-dossier`
> **Formats** Markdown (source, et c'est le format remis — un LISEZMOI se lit là où il vit,
> à la racine du dossier livré) · HTML si le dossier est publié en page autonome
> **Règles engagées** D1 D3 D6 D8 D11 (`gabarits\documents\README.md`)
> **Provenance** retour Produit-62 RF-18 du 16/09/2026, part pilot de TF-1170. La part forge-data
> est faite : règle **M7** d'`oracle-modeliser` et **R9** d'`oracle-restituer`. Le `non_juge` de
> M7 désigne nommément ce gabarit — « reprise des mêmes décisions dans le mode d'emploi du
> livrable-dossier (LISEZMOI) — **gabarit du pilot, jamais jugé ici** ».
> **Gabarit : gd-mode-emploi-dossier** · **Version du gabarit : 1.0.0**

**Ce que ce document est, et ce qu'aucun autre ne fait.** Quand un livrable n'est pas un fichier
mais un **dossier** — un projet Power BI, un jeu de scripts, un paquet de modèles, une
arborescence d'exports —, le destinataire ouvre un répertoire et doit comprendre seul ce qu'il
tient. Le LISEZMOI est la pièce qui lui répond. Ce n'est ni un dossier d'architecture
(`gd-dossier-architecture`, qui s'adresse à un comité et décrit une cible), ni un dossier
d'exploitation (`gd-dossier-exploitation`, qui dit comment faire tourner en production), ni une
documentation technique interne. C'est **le mode d'emploi de ce qu'on vient de recevoir**.

**Pourquoi la famille existe, et le fait est précis (TF-1170, retour RF-18 du 16/09/2026).** Un
commanditaire a dénoncé comme un défaut — « une seule table de fait, et pas 4 comme actuellement »
— les **quatre tables de faits qui appliquaient sa propre décision, tranchée neuf jours plus
tôt**. La décision vivait au ledger du produit ; ni le modèle déclaré ni le mode d'emploi du
livrable ne la portaient. Les contrôles du modèle rendaient PASS : ils jugent la matrice en bus,
les clés et les granularités, **jamais qu'un lecteur retrouve le POURQUOI à l'endroit où il
rencontre le choix**. Coût mesuré : un tour d'analyse de 55 minutes pour établir que le défaut
dénoncé était une décision.

**La leçon que ce gabarit mécanise.** *Un choix d'architecture non expliqué là où le lecteur le
rencontre sera dénoncé comme un défaut — y compris par celui qui l'a pris.* La mémoire d'une
décision ne survit pas neuf jours, même chez son auteur. Ce n'est pas un défaut d'attention du
lecteur : c'est un défaut du livrable.

---

## Structure — les six sections sont dues

### 0 · En-tête

```
---
destinataire: humain
role_destinataire: {qui reçoit le dossier — commanditaire, équipe qui reprend, exploitant — et
  ce qu'il décide ou fait avec : recetter, reprendre, exploiter, faire évoluer}
---

# Mode d'emploi — {nom du livrable-dossier}

**Livrable** : {nom du dossier} · **Indice** : {AAAAMMJJ<i>} · **Date** : {JJ/MM/AAAA}
**Version de l'artefact** : {tag, commit, ou horodatage du paquet}
**Ledger du produit** : {chemin de forge\ledger.jsonl} — source des décisions citées au § 2
**Gabarit : gd-mode-emploi-dossier** · **Version du gabarit : 1.0.0**
```

Le **chemin du ledger** est un champ d'en-tête, et il n'est pas décoratif : c'est lui qui rend
les décisions du § 2 **vérifiables**. Un LISEZMOI qui affirme « décidé le 07/09 » sans dire où
cela se relit demande qu'on le croie sur parole.

### 1 · Ce que vous tenez, et par où commencer

Cinq à dix lignes, puis le **point d'entrée unique** : le fichier à ouvrir en premier, nommé.
Un dossier sans point d'entrée déclaré se parcourt au hasard, et le premier fichier ouvert
n'est presque jamais le bon.

La section dit aussi, en une phrase, **à qui ce dossier est destiné** et ce qu'il suppose connu.
Un lecteur qui découvre au troisième répertoire qu'il lui manque un prérequis a déjà perdu son
temps.

### 2 · Choix d'architecture et décisions qui les fondent

**Section obligatoire, et c'est celle pour laquelle cette famille existe.** Elle se remplit
**depuis le ledger du produit** (`forge\ledger.jsonl`, entrées `type: decision`), jamais de
mémoire.

Un tableau, colonnes fixes, une ligne par choix que le lecteur va **rencontrer dans le dossier**
et qui pourrait le surprendre :

| Choix | La décision | Qui l'a prise | Quand | Pourquoi — ce que cela apporte au lecteur |
|---|---|---|---|---|

Le vocabulaire est celui de la part forge-data, délibérément, pour que les deux côtés parlent la
même langue et qu'une reprise soit vérifiable de part et d'autre :

- **Choix** — ce que le lecteur voit en ouvrant le dossier (« quatre tables de faits », « pas de
  vue matérialisée », « deux fichiers au lieu d'un ») ;
- **La décision** (`quoi` chez forge-data) — ce qui a été tranché, en **quatre mots au moins**.
  Moins de quatre mots et le lecteur ne sait pas ce qui a été choisi ;
- **Qui l'a prise** (`qui`) — un rôle ou un nom de décideur. **Jamais « l'équipe »** : une
  décision sans décideur ne se retrouve pas au ledger. Quand c'est le commanditaire lui-même,
  **le dire est le premier intérêt de la section** — c'est exactement le cas RF-18 ;
- **Quand** (`date`) — une date **AAAA-MM-JJ**. Le QUAND est ce qui permet de relire l'entrée au
  ledger ;
- **Pourquoi** (`pourquoi`) — en prose **destinée au lecteur**, **huit mots au moins** : le
  processus servi et ce que le choix apporte. Pas la justification technique interne, pas
  « choix d'implémentation » : la phrase qui fait que le lecteur cesse de voir un défaut.

**Chaque ligne cite sa décision au ledger** (`decision_ref`, ou l'identifiant et l'horodatage de
l'entrée). Une prose sans décision citée n'est pas retrouvable ; une référence qui ne pointe
rien est pire qu'une absence.

**Ce que la section ne fait pas.** Elle ne rejuge pas les décisions et n'en discute pas la
pertinence : elle les rend **retrouvables là où le lecteur rencontre leur effet**. Une décision
révoquée depuis n'a rien à faire ici — le ledger fait foi, et un LISEZMOI qui cite une décision
périmée ment avec l'apparence de la rigueur.

**Quand il n'y a aucune décision à porter**, la section l'écrit en une ligne : « Aucun choix
d'architecture n'a fait l'objet d'un arbitrage ; le dossier suit les conventions par défaut de
{référentiel}. » Une section vide se lit comme un oubli, une section qui déclare le vide se lit
comme un fait (*l'oubli n'existe pas*, loi transverse n° 3).

### 3 · Le contenu du dossier, répertoire par répertoire

Un tableau qui liste ce qu'on trouve et **ce qu'on en fait**, jamais la seule arborescence. Une
liste de noms de répertoires n'apprend rien : ce que le lecteur cherche, c'est lequel ouvrir
pour sa question.

La colonne qui compte est la dernière : **« à ouvrir quand… »**. Elle transforme un inventaire en
mode d'emploi.

### 4 · Ce qu'il faut pour s'en servir

Les prérequis réels : version d'outil, droits d'accès, connexions, jeux de données attendus.
Chaque prérequis dit **comment on vérifie qu'on l'a** — un prérequis qu'on ne sait pas constater
se découvre au moment où il manque.

Cette section dit aussi ce qui a été **testé** et dans quel environnement. « Ouvert et rafraîchi
le 20/09/2026 sur Power BI Desktop version … » vaut mieux que toute promesse de compatibilité.

### 5 · Limites connues, et ce qui n'est pas dans ce dossier

Les écarts assumés, les parties non couvertes, les données absentes — **avec leur motif**.
C'est la section qui distingue un livrable remis d'un livrable abandonné : un lecteur qui trouve
ici le manque qu'il vient de constater sait qu'il a été vu, et n'ouvre pas un incident.

### 6 · À qui s'adresser

Un **rôle** et une voie de contact, plus la conduite à tenir devant une anomalie : ce qu'on
recueille avant de signaler (version de l'artefact, ce qui a été fait, ce qui était attendu).
Un signalement sans ces trois éléments coûte un aller-retour.

---

## Ce que ce document ne fait JAMAIS

Quatre exclusions, chacune protégeant le LISEZMOI d'un document voisin qui le ferait dériver. Le
lecteur y apprend ce qu'il doit chercher ailleurs, et où.

- **il ne décrit pas l'architecture cible** : la trajectoire existant → cible, les exigences non
  fonctionnelles et les risques appartiennent au dossier d'architecture technique
  (`gd-dossier-architecture`) ;
- **il ne dit pas comment exploiter en production** : démarrer, arrêter, revenir en arrière,
  tourner un secret, restaurer relèvent du dossier d'exploitation (`gd-dossier-exploitation`) ;
- **il ne rejuge aucune décision** : le § 2 rend les décisions retrouvables, il n'en rouvre
  aucune. Une décision qu'on veut changer se rouvre au ledger, pas dans un mode d'emploi ;
- **il ne remplace pas le ledger** : il en cite des entrées et donne son chemin. Recopier le
  ledger dans un LISEZMOI crée une seconde version qui divergera à la première décision suivante.

## Oracles

Ce que la machine juge sur cette famille, ce que la forge voisine juge de son côté, et ce qui
reste humain. Le lecteur y apprend où passe la frontière entre les deux dépôts.

| Contrôle | Invariant tenu |
|---|---|
| `oracle-gabarits-documents.mjs` **G7** | la section « Choix d'architecture et décisions qui les fondent » est **déclarée obligatoire au catalogue** et présente dans cette doctrine — la règle née de cet item |
| `oracle-gabarits-documents.mjs` (G1, G2, G4, G10) | doctrine et instance remplie, couple gabarit + version rendu, lecteur déclaré et frontière lecteur/auteur |
| `oracle-modeliser.mjs` **M7** (forge-data) | côté MODÈLE : chaque fait porte son `pourquoi` (≥ 8 mots) et son `decision_ref` ; chaque décision déclare `qui`, `date` ISO et `quoi` (≥ 4 mots) |
| `oracle-restituer.mjs` **R9** (forge-data) | côté RESTITUTION, part jumelle de M7 |
| relecture humaine — **due, et non mécanisable** | que les décisions citées soient **à jour** et non révoquées : le ledger du produit fait foi, et aucun oracle du pilot ne le lit. C'est le `non_juge` déclaré par M7, repris ici plutôt que taire la frontière |

**Frontière entre les deux dépôts, écrite pour qu'on ne la cherche pas.** forge-data juge que le
MODÈLE porte ses décisions ; le pilot juge que la BIBLIOTHÈQUE porte la forme qui les reprend au
lecteur. Aucun des deux ne juge que **cette instance-ci** cite les bonnes décisions : c'est une
lecture, déclarée des deux côtés, jamais prétendue mesurée.

## Boucle de retour

Un manque constaté sur ce gabarit remonte par la section **« Retours sur les documents
produits »** du lot de retours du projet (R-46), avec le couple `gd-mode-emploi-dossier` +
version.

---

## Document d'auteur — ce qui ne va pas au lecteur

Le lecteur de ce document est celui que déclare `role_destinataire` : celui qui reçoit le
dossier. Tout ce qui n'entre pas dans ce qu'il fait sort d'ici et vit dans le **document
d'auteur** — un fichier distinct, cité en renvoi et jamais joint :

- le **registre des arbitrages** encore ouverts et les options écartées en cours de construction ;
- l'**historique des versions** du dossier et son statut de relecture ;
- les **notes de production** : dettes techniques, raccourcis assumés en interne, sujets à
  reprendre.

**La frontière est un critère d'ACTION, pas de confort.** « Le rafraîchissement échoue si la
source dépasse 2 millions de lignes » reste chez le lecteur : elle change ce qu'il fait. « Nous
hésitons encore à refactoriser la couche de préparation » part au document d'auteur.

**Un cas particulier, propre à cette famille.** Le § 2 peut sembler relever du document
d'auteur — c'est un registre de décisions. Il n'en relève pas : une décision qui explique un
choix **que le lecteur a sous les yeux** change ce qu'il en conclut, donc elle reste chez lui.
C'est la distinction exacte que RF-18 a coûté 55 minutes à établir. Ce qui part au document
d'auteur, ce sont les arbitrages **ouverts**, ceux dont l'effet n'est pas encore dans le dossier.

*Règle D11 (`gabarits\documents\README.md`), jugée par G10 d'`oracle-gabarits-documents.mjs`.*
