# Retours forges — Hoopiz — 20260821a

<!-- Gabarit du pilot (gabarits\RETOURS-FORGES.md). Un fichier = UN lot de retours.
     Un fichier remis ne se modifie JAMAIS — le lot suivant est un nouveau fichier daté. -->

- **Contexte** : troisième passe sur le rapport HTML de synthèse Hoopiz (version `20260821a`),
  après une relecture client de vingt points sur la version `20260820c`. Les corrections
  demandées portaient sur la largeur de lecture, un lecteur de sources Markdown à deux vues,
  des indicateurs cliquables, et plusieurs coupures de mots. La production a rencontré
  **un bug bloquant de l'outillage** et trois faux positifs d'oracle, tous nouveaux.
- **Références ledger** : aucun ledger dans ce projet (run hors pilot, skills appelés depuis
  Claude Code). Pièces : `output/v2-architecture-cible/rapport/REVUE.md` §2 et §3,
  `rapport/old/…20260820c.html`, `rapport/…20260821a.html` (livrée).
- **Lots précédents** : `Hoopiz - RETOURS - 20260820a.md` et `20260820b.md`, **remis le
  2026-08-20**, donc immuables. Ce lot est un fichier neuf.
- **Remise au pilot** : copier ce fichier et son sidecar `.tf.jsonl` dans
  `<pilot>\input\00-retours\`. **Remise soumise à validation humaine** (règle 18).
- **Statut** : remis le 2026-08-22

**Numérotation** : les lots `20260820a` et `20260820b` ont consommé RD-1 à RD-12 et RA-1 à
RA-5. Ce lot continue en RD-13 à RD-15 et RA-6 à RA-9.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

**Vérification préalable.** Le lot `20260820a` remontait déjà que `run-oracles` écrivait ses
journaux dans l'arbre de livraison (RA-3). Le correctif existe désormais — il est référencé
`TF-0428` dans le code et **il fonctionne** : les journaux sont bien redirigés. C'est la ligne
qui l'annonce qui plante. Ce lot ne redemande donc pas le correctif : il signale que sa mise
en œuvre casse le lanceur.

---

## forge-agents (`digit-ai-forge-agents`) — skill `quality-oracles`

Quatre retours. Le premier est bloquant pour tout l'écosystème, pas seulement pour ce projet.

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RA-6 | **bloquant** | **`run-oracles.mjs` plante avant d'afficher son verdict, et retourne 1 même quand tout passe — ce qui fait bloquer le hook d'écriture.** À la ligne 221 : `if (horsLivraison && !JSON_OUT) console.error(...)`. **`JSON_OUT` n'est déclaré nulle part** → `ReferenceError: JSON_OUT is not defined`. L'exception survient *après* l'écriture du journal mais *avant* le calcul de `exitCode` : le bilan « ✅ CONFORME / ❌ NON CONFORME » n'est jamais imprimé, et le processus sort en échec. Mesuré : journal `"verdict": "PASS", {"pass": 14, "fail": 0, "skip": 3}` et **`echo $?` → 1**. Conséquence en chaîne : le hook `qo-gate-write.mjs` refuse l'écriture — `BLOQUÉ (hook C7) : oracles en échec ou inconclusifs sur « REVUE.md » après écriture` — alors que ce fichier passe les trois oracles applicables. **Reproduit deux fois** dans la même passe, sur deux fichiers différents — `REVUE.md` puis ce lot de retours : verdict `PASS` dans le journal, code de sortie 1, écriture refusée. **Toute écriture de fichier surveillée est donc refusée, quel que soit le verdict réel.** La ligne fautive appartient au correctif TF-0428, lui-même issu du retour RA-3 de notre lot du 20/08 : le correctif est juste, sa mise en œuvre casse le lanceur. | Déclarer la variable, ou tester le drapeau réellement utilisé pour le mode JSON (`--output json`). Et surtout : **un `self-test` qui exécute le lanceur de bout en bout sur une fixture verte et vérifie le code de sortie 0**. Le bug est en dernière ligne de parcours — aucun test d'oracle unitaire ne pouvait l'attraper, seul un test du lanceur le pouvait. |
| RA-7 | majeur | **`oracle-claims` analyse le JavaScript inline et y lit des montants.** Constaté : `FAIL — montant « 1 $ » sans source ni « à vérifier »`, pointant la ligne 6245 du livrable, qui est `(function () {`. La vraie cause est trois lignes plus loin : `s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')` — **la référence arrière `$1` d'une expression régulière**, lue comme un montant en dollars. Le livrable étant autoportant, tout son JavaScript est inline : la surface d'analyse contient donc l'intégralité du code. Contournement retenu : remplacer les quatre `$1`/`$2` du projet par des fonctions de remplacement. C'est un contournement, pas une correction : le prochain auteur réécrira `$1` sans savoir. | Exclure de l'analyse le contenu de `<script>` et `<style>`, comme le fait déjà la règle L1 de `check_html` (`if parent.tag in ("script", "style"): continue`). Le précédent existe dans la forge, il suffit de l'appliquer ici. |
| RA-8 | majeur | **`oracle-claims` analyse aussi le CSS, et lit les couleurs hexadécimales comme des nombres.** Constaté : `nombre « 334155 » non sourcé ; nombre « 374151 » non sourcé`. Ce sont `#334155` et `#374151`, deux tokens de couleur du bloc `:root` — c'est-à-dire **exactement ce que la charte impose d'écrire**. Seules les couleurs composées uniquement de chiffres sont touchées ; `#0F172A` passe. Contournement retenu : écrire ces deux couleurs en `rgb()`. Absurde : la charte prescrit l'hexadécimal. | Même correction que RA-7 : ne pas analyser `<style>`. Complément utile : ignorer tout nombre précédé d'un `#`, qui n'est jamais un montant. |
| RA-9 | mineur | **Confirmation de RA-4 sur un autre motif : les sources citées sont analysées comme du contenu propre.** Le lot du 20/08 signalait un caractère typographique d'une citation lu comme emoji. Cette fois : `pourcentage « 100% » non sourcé`, provenant des douze documents Markdown embarqués (11 occurrences dans le texte cité). Le rapport en contenait aussi dans son propre texte — ceux-là ont été reformulés — mais **ceux des citations sont incorrigibles sans falsifier la source**. | Reprise de RA-4 : exclure les zones marquées comme contenu cité (`<pre>`, `<code>`, `<blockquote>`, ou un attribut `data-cite`). Un seul mécanisme réglerait RA-4, RA-7, RA-8 et RA-9 : **délimiter ce que le livrable a écrit lui-même**. |

## forge-design (`digit-ai-forge-design`) — skill `digit-ai-page-html`

| id | Gravité | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|
| RD-13 | majeur | **La règle L1 « ponctuation orpheline » classe un élément comme bloc à cause d'un sélecteur qui ne le concerne pas.** La collecte fait, pour chaque règle CSS déclarant `display: block/flex/grid/table/list-item` : `re.match(r"^([a-z][a-z0-9]*)", selecteur)`. Sur le sélecteur `a.kpi .kpi-label { display: flex }`, elle capture **`a`** — alors que le `display` s'applique au descendant `.kpi-label`, pas au lien. Résultat : `a` entre dans l'ensemble des blocs, et **toute ponctuation suivant un lien** devient une faute. Six échecs bloquants d'un coup sur des phrases parfaitement formées, du type « … voir la <a>matrice §7.2</a>. » Le message ne peut pas mettre sur la voie : il désigne la phrase, pas le sélecteur qui l'a rendue fautive. Contournement retenu : réécrire huit sélecteurs pour qu'ils commencent par une classe. | Ne capturer le nom d'élément que s'il est **le sujet du sélecteur**, c'est-à-dire son dernier composant : sur `a.kpi .kpi-label`, le sujet est `.kpi-label`. Un `selecteur.split()[-1]` avant le `re.match` suffit. Fixture rouge : une page avec `a.x .y { display: flex }` et une phrase se terminant par un lien suivi d'un point. |
| RD-14 | majeur | **Aucun composant « lecteur de source » au catalogue, alors que l'autoportance impose d'embarquer les sources.** La règle A1 exige un fichier autoportant ; un rapport qui renvoie à des fichiers du dépôt perd ses sources dès qu'il part par courriel. La conséquence logique est d'embarquer les documents — et là, rien n'est prévu : un `<pre>` de 67 Ko de Markdown est illisible. Ce livrable a dû écrire un convertisseur Markdown (≈ 130 lignes : titres, tableaux, listes, code, citations, séparateurs, enrichissements de ligne), une bascule à deux vues, et un rendu **différé au premier dépliage** — sans ce dernier point, les douze documents rendus d'avance faisaient passer le DOM de 7 000 à plus de 25 000 nœuds, au-delà du seuil d'échec de l'oracle de performance. | Ajouter le composant au catalogue : `<details>` avec bascule *mis en forme* / *texte brut*, rendu paresseux, et la doctrine qui va avec — **les liens d'un document cité ne deviennent pas cliquables**, ils visent le dépôt et donc rien depuis la page ; leur cible passe en infobulle. Un lien mort ment davantage qu'une absence de lien. |
| RD-15 | mineur | **Confirmation de RD-12 : les exemples du socle emploient des glyphes absents des piles de repli.** Le lot du 20/08 signalait un chevron affiché en tofu sur mobile. En reprenant le composant `details/summary` du socle, les mêmes caractères (`▸`, `▾`) ont été repris — et présentent le même risque, puisque la pile de repli déclarée n'en garantit aucun. Corrigé ici par le chevron simple `›`, présent partout. | Corriger les exemples du socle, et ajouter la liste blanche de glyphes sûrs proposée en RD-12. |

## Confirmations positives

- **Les correctifs du lot du 20/08 fonctionnent.** Les trois écarts que nous portions depuis
  deux versions ont disparu : couleur `#FFFFFF` de la charte (S4), contraste sur des paires de
  tokens jamais réalisées (T5), caractère typographique lu comme emoji. Le rapport passe
  aujourd'hui **14 oracles sur 14, sans aucun écart documenté** — une première.
- **TF-0428 fait ce qu'il annonce** : les journaux d'oracles sont bien écrits hors de l'arbre
  de livraison. Seule la ligne qui le signale est cassée (RA-6).
- **`oracle-tokens` a trouvé quatre vrais défauts** dans notre CSS, tous corrigés à la source :
  une couleur en dur au lieu d'un token, deux espacements hors de l'échelle 4 pt, et surtout
  **un anneau de focus improvisé** au lieu de tokens prescrits — ce dernier point relève de
  l'accessibilité, et nous ne l'aurions pas vu seuls.
- **`render_page --etats-ouverts`** reste l'outil le plus utile de la chaîne : il a validé les
  panneaux de filtre ouverts et les 110 lignes dépliées, états que le rendu par défaut ne
  montre jamais.
- **La règle L1 sur les mots coupés** a confirmé un défaut signalé par le client (« Plateform /
  e » dans une colonne étroite) : la règle avait raison, notre CSS coupait trop tôt.

## Ordre recommandé

1. **RA-6** — bloquant pour tous les produits : le lanceur d'oracles rend un code d'échec sur
   un verdict PASS, et le hook d'écriture refuse alors toute écriture. Une ligne à corriger,
   plus un test de bout en bout du lanceur.
2. **RA-7 et RA-8** — même correction : ne pas analyser `<script>` ni `<style>`. Le précédent
   existe déjà dans `check_html`.
3. **RD-13** — un `split()[-1]` supprime une classe entière de faux positifs sur une règle
   bloquante.
4. **RA-9** — le mécanisme « délimiter le contenu cité » règle d'un coup RA-4, RA-7, RA-8 et
   RA-9.
5. **RD-14** — le besoin est prouvé par l'exigence d'autoportance elle-même.
6. **RD-15** — correction d'exemples, coût nul.
