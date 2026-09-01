# Retours forges — Produit-10 — 20260813c

- **Contexte** : incident d'invocation constaté deux fois en session, puis étape gabarit HTML
  du run `20260813-scc-alx-mapping-bronze-silver`
- **Références ledger** : `forge\ledger.jsonl` seq 19 et 20
- **Remise au pilot** : copier ce fichier dans `<pilot>\input\` — l'original reste ici.
- **Statut** : a_remettre

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `RETOURS-20260813a.md` et `RETOURS-20260813b.md` (remis) — la séquence d'ids
continue.

---

## pilot (`digit-ai-forge-pilot`) — l'incident et sa cause

### Le fait

Deux demandes humaines ont été exécutées **sans le skill qu'elles invoquaient**. La première
commençait par « Améliore le prompt », la seconde par « Améliore le prompt : » — dans le
vocabulaire de l'utilisateur, ce sont les noms d'appel de `prompt-analyzer-l99`. Les deux fois,
la phrase a été lue comme une entrée en matière et le travail conduit à la main. La seconde
occurrence est survenue **après** que l'utilisateur avait explicitement nommé le skill : la
connaissance était présente au contexte, et l'erreur s'est reproduite.

Ce que cela établit : **le défaut n'est pas la découverte du skill, c'est la reconnaissance
d'une phrase comme invocation.** Toute correction qui se contente de rendre un skill
découvrable ne l'adresse pas.

### La cause de fond

Le protocole d'accueil (`references\ACCUEIL.md`, pas 4) prescrit d'afficher les catalogues
depuis `catalogues\CATALOGUES.md`. Ce catalogue a été suivi comme s'il était exhaustif. Il ne
l'est pas :

| Forge | Services déclarés au catalogue | Skills réellement exposés | Écart |
|---|---|---|---|
| forge-agents | **6** | **11** (`.claude\skills\`) | `prompt-analyzer-l99`, `ameliore-un-skill`, `contre-expertise`, `experts-forge`, `write-an-expert` absents |

`digit-ai-page-html`, `quality-oracles`, `data-quality-auditor`, `digit-ai-schemas` et
`write-an-oracle` sont mentionnés ailleurs (`BEST-PRACTICES-HTML.md`, `fiches\`) mais ne sont
pas des entrées de catalogue. Et `la-barre` n'est dans **aucune** forge : c'est une archive
dans l'`input` d'un autre projet (`_Client-A\Produit-01\input\skills\la-barre.zip`) — aucune
correction du catalogue ne l'atteint.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RV-6 | **bloquant** | Aucun lexique d'invocation n'existe. Une demande formulée avec le nom d'appel d'un skill est traitée comme une intention à interpréter. Constaté deux fois dans la même session, la seconde fois alors que la correspondance était connue. Conséquence mesurée : un prompt réécrit à la main là où un skill de 8 couches existait, puis une seconde réécriture pour rattraper. | Une ligne au **noyau `CLAUDE.md`** — voir l'arbitrage de taille ci-dessous. Le noyau est le seul document chargé à chaque session ; `CATALOGUES.md` est consulté à l'ouverture d'un run et `references\` se charge à l'ouverture d'une étape, ce qui est trop tard pour un mot-clé arrivant au tour 30. |
| RV-7 | majeur | `CATALOGUES.md` déclare 6 services pour forge-agents quand la forge en expose 11. Le protocole d'accueil le présente comme la source à afficher, sans dire qu'il n'est pas exhaustif. Un run qui s'y fie ignore les skills non catalogués. | Deux voies : compléter le catalogue, **ou** ajouter au pas 4 d'`ACCUEIL.md` l'obligation de lister `.claude\skills\` des forges mobilisées. La seconde est plus robuste : elle ne dépend pas de la fraîcheur du catalogue. |
| RV-8 | majeur | `la-barre` est un skill opérationnel — protocole en 7 pas, fixtures double sens jouées et vertes, outil `test_existence.py` exécuté sur 4 candidats réels — qui ne vit dans aucune forge. Il n'est ni catalogué, ni versionné, ni atteignable par un run d'un autre projet. | Admission dans forge-agents (aux côtés de `prompt-analyzer-l99`, même nature : skill de méthode sur un artefact), ou décision explicite de le laisser hors périmètre et de le dire. |

### L'arbitrage que RV-6 exige — mesuré

Le noyau `CLAUDE.md` est à **6 048 octets sur un plafond de 6 144** (contrôle
`oracles\oracle-claude-md.mjs`). Marge disponible : **96 octets**. Aucune des trois formes
possibles n'y tient :

| Variante | Coût | Verdict |
|---|---|---|
| A — pointeur seul vers `references\LEXIQUE-INVOCATION.md` | 139 octets | dépasse de **43** |
| B — inline terse (mots-clés + « le reste est l'entrant » + catalogue non exhaustif) | 296 octets | dépasse de **200** |
| C — inline complet (texte proposé ci-dessous) | 403 octets | dépasse de **307** |

Et la variante A, la seule presque finançable, est aussi **la plus faible** : un pointeur se
charge « quand c'est pertinent », or l'incident consiste précisément à ne pas savoir que c'est
pertinent. Un lexique doit être inline pour fonctionner.

**Il faut donc libérer entre 200 et 307 octets, ou décider de relever le plafond.** C'est une
décision humaine, pas un choix d'implémentation. Trois candidats compressibles, mesurés :

| Bloc du noyau | Poids | Remarque |
|---|---|---|
| Garde-fous (« Les projets produits sont autonomes… ») | 1 166 octets | le plus lourd ; largement redondant avec `ACCUEIL.md` § garde-fous et `AGENTS.md` |
| Lois transverses (5 items commentés) | 857 octets | les commentaires pourraient vivre dans une référence, les 5 énoncés suffisent au noyau |
| Documents de référence (liste avec parenthèses explicatives) | 358 octets | les parenthèses sont de la glose |

Le pilot est seul juge de ce qui doit céder. Le retour se borne à établir que **la place n'est
pas disponible** et que le choix est entre un trim, un relèvement de plafond, et le renoncement
au garde-fou.

### Texte proposé pour la ligne (variante C, à ajuster selon l'arbitrage)

> **Lexique d'invocation** — certaines demandes sont des appels de skill, pas des intentions à
> interpréter : « Améliore le prompt … » et « l99 » → `prompt-analyzer-l99` · « barre … » en
> tête de message → `la-barre`. Retirer le mot-clé, traiter le reste comme l'entrant. À
> l'ouverture de tout run : lister `.claude\skills\` des forges mobilisées, le catalogue n'est
> pas exhaustif.

La dernière phrase couvre RV-7 en même temps que RV-6 : elle rend le catalogue non exhaustif
par construction, ce qui retire à RV-7 son caractère bloquant même si le catalogue n'est jamais
complété.

### Ce que ce retour ne prétend pas

Une ligne au noyau **réduit** la probabilité, elle ne la supprime pas : elle dépend encore de
la lecture de l'agent. Le seul mécanisme qui n'en dépende pas est un hook `UserPromptSubmit`
au niveau du harnais, hors périmètre du pilot. Le dire est plus honnête que promettre une
garantie que le dispositif ne donne pas.

---

## forge-agents (`digit-ai-forge-agents`) — skill `digit-ai-page-html`

Constats de l'étape gabarit, tous mesurés en construisant un gabarit qui passe les deux
oracles.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-5 | majeur | La règle L4 du socle exige « filtre, **tri** et recherche » dès 8 lignes ; `table-filters.js` ne fournit que le filtre. Un livrable conforme au composant reste non conforme à la règle qui l'impose. Le tri, l'état du parcours dans l'URL et l'export du sous-ensemble ont dû être écrits par-dessus (module `GabaritTableau`, 180 lignes, composé avec le composant et non substitué à lui). | Verser le tri au composant, ou aligner L4 sur ce que le composant fournit réellement. Le module écrit ici est réutilisable tel quel. |
| RA-6 | **bloquant** | Piège d'extension non documenté : armer un tri en réécrivant `th.textContent` **détruit le bouton de facette et son panneau** déjà injectés par le composant — silencieusement. La colonne perd son filtre, et les deux oracles du socle rendent PASS sur la version défectueuse. Trouvé par un test d'interactions. | Documenter dans `composant-filtres-tableau.md` que le `th` est possédé par le composant après `init()`, ou exposer une API d'extension. Correctif appliqué côté produit : ne retirer que les nœuds texte. |
| RA-7 | majeur | Ni `check_html.py` ni `render_page.py` ne voient une affordance **câblée mais fausse**. Trois défauts de ce type dans la journée, tous trouvés par des tests Playwright hors socle : un indicateur annonçant 35 éléments n'en filtrait que 34 ; le tri détruisant les facettes (RA-6) ; une valeur non mesurable remontant en tête du tri décroissant, là où le lecteur attend le maximum. | Verser au socle un test d'interactions à fixtures double sens, à côté des deux oracles existants. Les deux scripts écrits ici (`test_interactions_html.py`, `test_interactions_gabarit.py`, 34 contrôles) sont des points de départ éprouvés. |

## la-barre (skill hors forge)

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RB-1 | mineur | Le contrat d'une barre porte un champ `reference` **unique**. Une cible dont le niveau se décompose en dimensions indépendantes — parcours d'une table, clarté pour un profane, densité typographique — exige trois entrées, donc trois cibles voisines artificiellement découpées. L'humain a d'ailleurs répondu « les trois, en trois entrées » au pas 5, ce que le format ne prévoit pas nativement. | Un champ `dimension` à côté de `cible`, ou documenter explicitement le découpage par cible comme la façon normale de traiter un niveau multidimensionnel. |

## Confirmations positives

- **Le protocole de `la-barre` a tenu intégralement** : fixtures du skill jouées avant usage
  (verte exit 0, rouge exit 1), 4 candidats testés dont 1 éliminé pour injoignabilité sans
  repêchage, filtre de légitimité appliqué, **arrêt au pas 5** pour validation humaine, niveaux
  décomposés ensuite. Le garde-fou « barre gameable » a fonctionné : la barre retenue est
  au-dessus du contrat existant, et le skill l'a signalé lui-même en imposant une ré-passe L50.
- **`prompt-analyzer-l99` a trouvé ce qu'une réécriture manuelle avait manqué** : 5 défauts,
  dont une dépendance circulaire entre deux étapes du prompt et deux définitions concurrentes
  du même indicateur. La règle d'arrimage (« un bloquant plafonne à 40/100 ») a produit un
  score qui reflète l'échec réel plutôt qu'une moyenne flatteuse.
- **La boucle d'amélioration a tourné dans la journée** : le retour RV-4 du lot `b` (aucun gate
  aval sur les livrables HTML) est encodé en règle **R-32** de `oracle-conformite-projet`
  quelques heures plus tard, et le commentaire de la règle cite le constat nommément.
- **R-7 inversée en cours de run** (TF-0150) a été rattrapée par l'oracle rejoué à la clôture,
  pas par le pull d'ouverture. Argument pour rejouer l'oracle de conformité avant chaque remise.

## Ordre recommandé

1. **RV-6** (lexique d'invocation) — c'est l'incident, il s'est reproduit, et il coûte un
   contournement de forge à chaque occurrence. Exige l'arbitrage de taille ci-dessus.
2. **RA-6** (piège d'extension du `th`) — quelques lignes de documentation, et il évite un
   livrable dont un filtre a disparu sans signal.
3. **RA-7** (test d'interactions au socle) — trois défauts bloquants dans la journée qu'aucun
   oracle existant ne voyait ; le code est écrit.
4. **RV-7** (catalogue non exhaustif) — couvert en grande partie par la dernière phrase du
   texte de RV-6 ; à traiter pour sa propre valeur.
5. **RA-5** (tri au composant), **RV-8** (admission de `la-barre`), **RB-1** — à arbitrer.
