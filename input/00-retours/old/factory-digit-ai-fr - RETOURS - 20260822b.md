# Retours forges — factory-digit-ai-fr — 20260822b

- **Contexte** : inspection d'exploitation du 22/08/2026, hors run — relecture de deux incidents
  de ce produit dont la classe n'a jamais été remontée : la bascule de domaine du 18/08 et le
  rejet de la première direction artistique.
- **Références ledger** : `forge\ledger.jsonl` — **aucune entrée `type: retour`** ; les deux
  incidents ont été traités dans le produit (drapeau `REDIRIGER_HOTE_HISTORIQUE`, refonte de la
  DA) sans que la classe soit remontée. Le présent lot corrige cette omission. Dernier seq au
  moment de l'écriture : 43.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## digit-ai-forge-ops (`digit-ai-forge-ops`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RO-2 | **bloquant** | générique | **Aucune porte de MEP ne surveille une bascule de domaine — recherche faite sur les 479 items du registre, ZÉRO candidature sur l'ancien hôte, la redirection ou le domaine historique.** INCIDENT DU 18/08 : le renommage `forge.digit-ai.fr` → `factory.digit-ai.fr` a été livré avec une redirection 301 **dure** depuis l'hôte historique vers un domaine **qui ne résolvait pas encore**. Le site est devenu injoignable — rétabli en une vingtaine de secondes en conditionnant le 301 à un drapeau `REDIRIGER_HOTE_HISTORIQUE`, désarmé par défaut. LA RAISON POUR LAQUELLE AUCUNE PORTE N'A VU : les gates M-1…M-5 s'exercent contre **une seule base** (`FORGE_SMOKE_BASE` dans `forge/etapes/mep/smoke_staging.py`), c'est-à-dire la **nouvelle** URL. Un déploiement qui casse l'**ancienne** passe tous les contrôles au vert, parce que l'ancienne n'est interrogée nulle part. Deux angles morts distincts, tous deux scriptables en une requête : (a) la CIBLE d'une redirection n'est pas vérifiée résolvante **avant** que la redirection soit armée ; (b) l'hôte SORTANT n'est pas interrogé **après** déploiement. | Deux contrôles au gate MEP, dès qu'un produit déclare un hôte historique. (a) **Avant armement** : résolution DNS + une requête sur la cible ; une cible qui ne répond pas rend l'armement bloquant, pas déconseillé. (b) **Après déploiement** : interroger l'ancien hôte et exiger soit un 200, soit un 301 vers un emplacement **qui répond** — chemin et requête préservés. La forme de déclaration existe déjà côté produit (`HOTES_HISTORIQUES`) ; il manque la porte qui l'exerce. Corollaire de doctrine : **une bascule de domaine se fait en deux temps** — armer par drapeau, vérifier la cible, puis basculer — et le gate est ce qui rend les deux temps obligatoires plutôt que disciplinés. |

## digit-ai-forge-design (`digit-ai-forge-design`)

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-9 | **majeur** | générique | **Rien n'oblige à regarder ce qui se fait de bien dans le domaine du produit avant de proposer une direction artistique.** Les oracles de design jugent la discipline **interne** — `oracle-slop`, `oracle-dtcg` (tokens), `oracle-motion`, `oracle-bascule`, `oracle-taste` (accent, filets, système), `oracle-mobile` — et le font bien. Aucun ne peut dire « ce n'est pas désirable pour la cible ». Recherche faite dans les documents et les oracles de forge-design : **aucune notion de barre externe, de référence du domaine ou d'état de l'art**. PREUVE DU COÛT : la première DA de factory.digit-ai.fr a passé les oracles au vert et a été **rejetée en bloc** par le commanditaire (« ça ne présente rien et ça ne donne pas du tout envie »). La sortie de crise a consisté exactement en l'entrant manquant — un relevé de dix sites reconnus du même domaine, trois directions neuves, puis un **arbitrage humain sur captures**. Un tour complet de conception+design perdu. À NOTER, ET C'EST LA MOITIÉ DU SUJET : la forge tient déjà la bonne doctrine ailleurs — « la justesse d'une voix n'est pas décidable par script… ce qui EST vérifiable, c'est la constance » (socle de marque, repris par TF-0383). Le présent retour ne demande pas à un oracle de juger le beau : il demande que **l'entrant manquant soit exigé** et que **l'arbitrage humain soit une étape, pas un rattrapage**. | Deux artefacts, aucun jugement automatique de goût. (1) Une **barre externe** au dossier de cadrage design : N références du domaine du produit, relevées et datées, avec ce qui est retenu et ce qui est écarté — un oracle peut vérifier qu'elle **existe, est datée et cite ses sources**, jamais qu'elle est juste. (2) Un **gate humain explicite sur captures** avant le développement de la DA retenue : ce que le commanditaire arbitre, ce sont des images, pas une description. Les deux sont vérifiables en présence/complétude, à l'image de ce que `CADRAGE-DESIGN.md` fait déjà pour les six champs — le champ « ton attendu » y est même déjà une *hypothèse à valider à la revue design*, donc le crochet existe et n'est pas armé. |

## Remarques restées au produit

**Généralisable — retenu, c'est RO-2.** Le drapeau `REDIRIGER_HOTE_HISTORIQUE` et les tests qui
l'exercent dans les deux positions (armé / désarmé) restent au produit : c'est une
implémentation, pas une règle. Ce qui se généralise est la **porte** qui rend les deux temps
obligatoires, et elle est remontée.

**Généralisable — retenu, c'est RD-9.** Le rejet de la DA n'était pas un accident de goût
isolé : il vient de ce que la chaîne pouvait produire un vert complet sans qu'aucun humain
n'ait regardé une image. Cela se reproduira sur tout produit vitrine.

**Resté au produit, non généralisable.** L'empreinte des feuilles de style
(`EMPREINTES_STYLES`), posée après qu'un intermédiaire de cache a servi le CSS de la veille avec
la page du jour : c'est du cache-busting standard, largement documenté hors forge, et je ne vois
pas de règle à en tirer que la forge ne suppose pas déjà connue. Noté ici pour que le choix de
ne pas le remonter soit **déclaré** plutôt que silencieux.

**Resté au produit, arbitrage humain en attente.** Les treize pages de forge exposent encore du
détail d'ingénierie interne (chemins de scripts, drapeaux de CLI, identifiants `TF-xxxx`). La
question « filtrer ou assumer » est posée au commanditaire et n'a pas été tranchée ; ce n'est
pas un défaut de forge.

## Retours sur les documents produits

**Aucun document produit depuis un gabarit de la bibliothèque** pour ce lot, hormis le présent
fichier (`gabarits\RETOURS-FORGES.md`), dont une chose a gêné, mineure et déjà signalée au lot
`digit-ai-fr - 20260822a` sous une autre forme : le gabarit demande des « Références ledger »
sans prévoir le cas d'un lot **hors run**. Ce produit a bien un ledger, mais aucune entrée
`type: retour` à citer puisque les deux incidents ont été traités sans remontée — l'absence est
ici l'information, et le champ a été renseigné en ce sens plutôt que laissé vide.
