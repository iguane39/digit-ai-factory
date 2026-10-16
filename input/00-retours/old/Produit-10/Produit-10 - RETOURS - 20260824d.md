# Retours forges — Produit-10 — 20260824d

- **Contexte** : le destinataire des restitutions a écrit en session, le 24/08, en pointant le
  bloc des décisions d'un message : « **Sans puce, ce texte est illisible. À réorganiser pour
  faciliter la lecture, comprendre les choix possibles et les impacts.** » Puis, une fois la
  cause identifiée : « **remonte cette demande à la Factory pour pouvoir être généralisé** ».
  Le pavé qu'il a signalé n'était pas un choix de rédaction : c'était **la seule mise en page
  que le contrôle de forme accepte**.
- **Références ledger** : `forge\ledger.jsonl` seq 67.
- **Remise au pilot** : copié dans `<PILOT_ROOT>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-08-24

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).
Ce lot succède à `Produit-10 - RETOURS - 20260824c`, remis le même jour. La séquence d'ids
continue en **`RV-15`**.

---

## Le fait qui ouvre ce lot

**Une règle de lisibilité dicte une mise en page que le lecteur juge illisible.**

`S15` et `S16` cherchent, pour chaque décision du bloc 3, un chapeau et une recommandation
sourcée — deux exigences justes, nées de retours humains réels. Mais elles les cherchent **dans
le groupe qui contient `(a)`**, et un groupe s'arrête à la première puce fille ou à la première
ligne vide. Conséquence mécanique : **toute décision dont les options sont des puces, ou dont
les options tiennent dans un tableau, échoue** — non pas faute de chapeau, mais parce que le
chapeau est resté de l'autre côté d'une frontière de groupe.

Il ne reste alors qu'une forme conforme : **une puce unique** portant le chapeau, les trois
options, la recommandation, sa source et l'option par défaut. Au rendu, c'est un pavé de douze
lignes sans respiration — celui que le destinataire a signalé de lui-même, capture à l'appui,
sans savoir qu'une règle le lui imposait.

### Ce qui a été mesuré, avant d'écrire ce lot

Quatre mises en page de **la même décision**, soumises à `oracle-synthese` :

| Mise en page | Verdict | Ce que ça dit |
|---|---|---|
| Puce unique + **tableau d'options** séparé par une ligne vide | **FAIL** `S15` `S16` | la ligne vide coupe le groupe : le tableau part sans son chapeau |
| **Tableau d'options sans puce**, chapeau en prose au-dessus | **FAIL** `S15` `S16` | aucun groupe ne contient `(a)` au sens de `actionsGroupees` |
| Puce unique, options en **lignes continues** | **PASS** | conforme, et **illisible** — c'est la version que le lecteur a refusée |
| Puce unique, options en **sauts durs Markdown** (deux espaces en fin de ligne) | **PASS** | conforme **et** lisible — retenu comme contournement |

Le quatrième cas est un contournement typographique, pas une solution : il tient parce que deux
espaces invisibles en fin de ligne produisent un retour à la ligne sans créer de nouveau groupe.
Aucun rédacteur ne trouvera cela sans lire le code de l'oracle — nous l'avons trouvé en le
lisant, après trois refus.

## factory (`digit-ai-factory`) — `oracles\oracle-synthese.mjs` v1.2.0

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RV-15 | majeur | générique | **`S15`/`S16` imposent au bloc 3 une mise en page que son lecteur déclare illisible, et c'est le lecteur lui-même qui l'a signalé.** `S15` construit `groupesDecisions = actionsGroupees(bDecisions).filter(g => /\(a\)/.test(g))`, puis `chapeau = g.split("(a)")[0]` : le chapeau est donc cherché **dans le groupe qui porte la première option**. Or `actionsGroupees` — via `puces()` — ne réunit qu'**une puce et ses lignes de continuation indentées non-puces**. Trois formes naturelles échouent donc, toutes mesurées ci-dessus : options en **puces filles** (chapeau vide, `S15` FAIL), options en **tableau** (ligne vide coupante, ou aucun groupe portant `(a)`), et `S16` tombe avec `S15` puisqu'il cherche la recommandation dans le même groupe. **La seule forme conforme est la puce unique**, soit un pavé de 12 lignes. Le destinataire des restitutions l'a relevé spontanément le 24/08, capture d'écran à l'appui, et a demandé la généralisation du correctif. Coût : la règle qui existe pour que les décisions soient **comprises** produit des décisions qu'on ne lit pas. | Deux pistes, indépendantes et cumulables. **(1) Chercher le chapeau dans le groupe PARENT** quand le groupe portant `(a)` n'en a pas : une décision s'écrit naturellement « une puce d'énoncé, ses options en puces filles » — c'est la forme que le gabarit lui-même emploie pour illustrer `(a)`/`(b)`/`(c)`. **(2) Reconnaître un tableau d'options** : si le bloc 3 porte un tableau dont une cellule vaut `(a)`, prendre pour chapeau le texte qui précède le tableau et pour recommandation le texte qui le suit. Les deux préservent l'intention de `S15` et `S16` — un sujet rappelé, une recommandation sourcée — sans dicter la typographie. **En attendant**, documenter le contournement des sauts durs dans `RESTITUTION.md` : aujourd'hui il n'est écrit nulle part, et il ne se devine pas. |

**Portée** (R-45) : *générique* — le bloc 3 est prescrit à toute restitution de tout projet.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le bloc des décisions de nos restitutions était rendu en un pavé | mise en page à sauts durs, et impacts rendus en **trois champs constants** — *Coût*, *Exclut*, *Débloque* — pour que trois options se comparent en balayage vertical | **oui** pour la cause, **non** pour les trois champs | La cause est dans l'oracle → **`RV-15`**. Les trois champs constants sont un choix de rédaction local ; ils vont plus loin que le gabarit, qui exige le coût et l'exclusion mais pas le gain. Nous ne le remontons pas comme défaut : c'est un renforcement, et `R-43` nous autorise à renforcer |

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| le bloc 3 des restitutions | `gabarits\RESTITUTION.md` v2.10.0 | le gabarit illustre une décision par des options `(a)`/`(b)`/`(c)` **en puces**, forme que son propre oracle refuse | le destinataire a écrit « sans puce, ce texte est illisible », capture à l'appui, et a demandé une réorganisation | des **sauts durs Markdown** — deux espaces en fin de ligne — pour rendre lisible la puce unique que l'oracle impose. Aucun gabarit ne mentionne ce contournement | **générique** |

**Aucun document produit depuis un gabarit** de `gabarits\documents\` : ce projet est une analyse de données et la bibliothèque n'en porte pas de gabarit. Le tableau ci-dessus rapporte donc ce qui a manqué **faute de gabarit**, ce qui est l'autre moitié du même signal.

## Confirmations positives

- **`S15` et `S16` visent juste.** Les deux retours humains qui les ont fait naître le 22/08 —
  « je ne peux pas me rappeler TF-0469 » et « tu aurais dû déduire son nom du dossier fourni » —
  décrivent des défauts réels, et nos restitutions sont meilleures depuis. Ce lot ne demande pas
  de les affaiblir : il demande qu'elles cessent de contraindre la typographie.
- **Le pré-jugement fonctionne.** Le contournement a été trouvé, mesuré et validé **avant**
  affichage, sans coûter un seul refus visible au lecteur — c'est la correction locale posée au
  lot `20260824c` qui l'a permis.
- **Troisième lot du jour sur le même oracle**, et c'est en soi une mesure : `RV-13` sur `S1`,
  `RV-14` sur `S9`, `RV-15` sur `S15`/`S16`. Les trois sont de la même famille — l'oracle juge
  une **forme** plus étroite que celle que le gabarit décrit. Le fond des règles n'est jamais en
  cause dans aucun des trois.

## Ordre recommandé

**`RV-13` d'abord** (lot `20260824c`, bloquant, trois caractères de motif), puis **`RV-15`**,
puis **`RV-14`**. `RV-15` avant `RV-14` parce que sa piste (1) touche `actionsGroupees`, dont
dépendent aussi `S11` à `S14` : la corriger une fois profite à quatre autres règles.
