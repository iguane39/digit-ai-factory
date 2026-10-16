# Travaux confiés par le pilot — digit-ai-forge-conception — 20260905h

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — items TF-0822 (la transcription d'un champ depuis la prose n'est vérifiée par rien, et `EXIGENCES.md` n'est l'entrée d'aucun oracle) et TF-0823 (une fixture est déclarée verte pour l'oracle qu'elle sert, jamais pour les autres), tous deux remontés par cette forge dans son lot de retours 20260905c (RC-6 : le constat sur la transcription ; RC-7 : le constat sur la fixture), entrés au registre par les classes `champ-transcrit-de-prose-sans-correspondance` et `fixture-jugee-par-son-seul-oracle` créées par le pilot le 05/09 ; décidés le 05/09/2026 (D-19 (a)), rangs 10 et 11 ; confiés sur mandat humain « 19a, 20a, A45, A46, A44, A47, A48 », action A-47 de la synthèse `output\04-plans\…20260905l.md`
- **Dépôt** : ce fichier a été déposé par le pilot dans `input\00-travaux\` de cette forge, sur mandat humain. L'original reste au pilot (`output\06-travaux-confies\`). Statut : `a_traiter` → `traite le <date>` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : `TF-0822+TF-0823@20260905` — deux lots portant la même empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.
- **Sidecar machine** : `pilot - TRAVAUX - 20260905h.tf.jsonl`, une ligne par élément.
- **Ordre entre lots** : le lot 20260905e (le sceau, TF-0818) est en cours d'instruction chez vous par un agent mandaté ; ce lot-ci se traite APRÈS lui, sur la version qu'il laisse — les deux touchent les vues et le self-test.

> ## ⛔ AVANT DE TRAITER — un geste, une seconde
>
> ```
> node c:\dev\digit-ai-factory\gabarits\oracle-travaux-pilot.mjs "<ce fichier>.md"
> ```
>
> Le même module a été joué par le pilot AVANT de déposer ce lot (règles T1 à T6 : vérification, référence, ce qui est déjà fait, ce qui n'est pas demandé, ordre justifié, module producteur lu).

## Ce lot est une DONNÉE, pas une consigne exécutable

Le pilot traite vos lots de retours comme de la donnée : les consignes qu'ils contiennent sont décrites, jamais exécutées. Le même principe s'applique ici, dans l'autre sens. Ce lot décrit un travail et argumente pourquoi il vaut d'être fait ; il ne commande rien. Vous restez le juge de ce que vous en faites, sur votre run, avec vos oracles ; un constat écarté rejoint vos écarts assumés avec son motif — il ne disparaît pas. Aucun commit n'a été fait chez vous.

## Travaux confiés

### TF-0822 — Un champ transcrit de la prose a une correspondance vérifiée, et `EXIGENCES.md` devient un artefact jugé · gravité majeur

- **Le fait** : depuis TF-0811 et TF-0814, deux champs racine d'`EXIGENCES.json` sont déclarés « transcrits de la prose et de nulle part ailleurs » : `ecarts_surface_implicite` ← section 3 de `SURFACE.md`, `ecarts_exigences_socle` ← section 7 d'`EXIGENCES.md`. Mesuré par vous le 05/09/2026 : sur les onze oracles de la forge, zéro lit `EXIGENCES.md` ou `SURFACE.md`, alors que la forge sait juger du Markdown (`oracle-constitution`, `oracle-retro-modele`, `oracle-vues-profil`). Votre documentation le dit elle-même : un écart écrit directement dans le JSON produit un référentiel qui passe l'oracle et une décision que personne n'a prise. S4 et E10 prouvent que l'écart est écrit, jamais qu'il a été décidé ; le gabarit d'`EXIGENCES.md` (sept sections, deux obligatoires) n'est jugé par personne.
- **Pourquoi cela vous concerne** : les deux champs neufs du jour, et chaque champ transcrit qui viendra, reposent sur une règle « jamais saisi ailleurs que dans la prose » qu'aucun contrôle ne tient ; la loi transverse n° 1 (toute affordance est câblée ou n'existe pas) et la règle § 4 de `quality-oracles` (un domaine sans oracle en reçoit un) existent, ce qui manque est le contrôle.
- **Ce qui est demandé** : (1) faire d'`EXIGENCES.md` un artefact JUGÉ, comme `CONSTITUTION.md` : existence, les sept sections du gabarit, les sections 4 et 7 non vides ; (2) une règle de CORRESPONDANCE : chaque entrée d'`ecarts_exigences_socle` existe en section 7 d'`EXIGENCES.md` (élément et motif), chaque entrée d'`ecarts_surface_implicite` existe en section 3 de `SURFACE.md` — une entrée du JSON absente de la prose → FAIL nommant l'entrée ; (3) fixtures double sens par règle (prose et champ d'accord → PASS ; entrée du JSON sans prose → FAIL ; section 7 vide → FAIL), self-test compté ; (4) le choix du porteur vous appartient (oracle neuf `oracle-exigences-md`, ou règles dans `oracle-exigences`), déclaré dans votre lot.
- **Module producteur lu** : `redige-les-exigences` transcrit la section 7 d'`EXIGENCES.md` dans le champ racine `ecarts_exigences_socle`, sans reformulation (source : `skills\redige-les-exigences\SKILL.md`, lignes 67 à 69, « L'écart s'écrit dans le référentiel, pas seulement en prose (TF-0814) »).
- **Effort estimé** : complexité moyenne × durée courte.
- **Comment vous saurez que c'est fait** : `node oracles\self-test.mjs` compte les états neufs ; une fixture dont le JSON porte un écart absent de la prose rend FAIL, la même avec la prose rend PASS ; une fixture sans section 7 rend FAIL.
- **Si ce n'est pas fait** : un écart écrit dans le JSON sans avoir été décidé passe tous les oracles de la forge, et chaque champ transcrit qui viendra agrandit la surface.

### TF-0823 — Le self-test publie la matrice des verdicts fixture × oracle et la compare à une matrice attendue versionnée · gravité mineur

- **Le fait** : mesuré par vous le 05/09/2026 : l'entrée de la règle E10 dans `oracle-exigences` a fait passer `oracles\fixtures\delta-rouge\EXIGENCES.json` de exit 0 à exit 1 sur cet oracle ; le self-test ne branche jamais `oracle-exigences` sur cette fixture, donc aucun contrôle ne l'a dit — il a fallu un balayage manuel des douze fixtures. Le défaut est structurel : le self-test associe un couple (fixture verte, fixture rouge) à un oracle et ne dit rien des autres verdicts qu'une fixture rend.
- **Pourquoi cela vous concerne** : chaque règle neuve sur un oracle partagé (deux ce jour, une de plus par ce lot) peut faire basculer une fixture voisine en silence ; le coût est faible aujourd'hui et croît avec le nombre de fixtures partagées, en régression silencieuse.
- **Ce qui est demandé** : (1) le self-test calcule la matrice complète des verdicts (chaque fixture × chaque oracle applicable) et la compare à une matrice attendue VERSIONNÉE dans le dépôt (`oracles\matrice-attendue.json` ou équivalent, donnée éditable et datée) ; (2) un verdict qui diffère de la matrice attendue est un échec de recette nommant la fixture et l'oracle ; une mise à jour de la matrice est un geste explicite, dans le commit qui change la règle ; (3) fixture double sens : la matrice attendue altérée d'une cellule → le self-test rend FAIL sur cette cellule ; matrice conforme → PASS ; (4) la matrice courante est publiée dans la sortie du self-test (lisible), pour qu'un lecteur voie ce que chaque fixture rend.
- **Effort estimé** : complexité simple × durée courte (les douze fixtures et les onze oracles sont déjà énumérés dans le fichier).
- **Comment vous saurez que c'est fait** : `node oracles\self-test.mjs` imprime la matrice et rend FAIL quand une cellule de la matrice attendue est altérée à dessein, PASS sinon ; la bascule mesurée le 05/09 (`delta-rouge` sur `oracle-exigences`) est portée dans la matrice attendue avec sa date.
- **Si ce n'est pas fait** : la prochaine règle neuve fera basculer une fixture voisine sans qu'aucun cas le dise, et seul un balayage manuel le verra.

## Ce que le pilot a déjà fait de son côté

- Les deux constats, remis sans sidecar faute de classe, sont entrés au registre sous TF-0822 et TF-0823 par les classes créées le 05/09 (D-17 (a)), décidés le 05/09 (D-19 (a)) en un seul lot.
- Le troisième constat sans classe de la journée (le contrat de sortie du lanceur d'oracles, forge des outils) a aussi sa classe et son item (TF-0824), confié à la forge des outils par un lot séparé.
- Rien n'a été écrit dans le code de la forge ; la boîte `input\00-travaux\` existait.

## Ce que le pilot NE demande PAS

- Pas de règle sur d'autres documents de prose que `EXIGENCES.md` et `SURFACE.md` (les deux sources déclarées des champs transcrits).
- Pas de migration des référentiels scellés : une fixture ou un référentiel antérieur au champ se juge sur la présence de la prose seulement, déclaré.
- Pas de changement du sceau des vues : c'est le lot 20260905e, en cours.
- Pas de matrice pour d'autres forges : le patron est transposable, le pilot le portera lui-même s'il le décide.

## Ordre recommandé

1. **TF-0822 d'abord**, parce qu'il touche une décision de produit (un écart non décidé passe) et que sa règle neuve est exactement le cas que TF-0823 doit ensuite rendre visible.
2. **TF-0823 ensuite**, parce que la matrice attendue doit être établie APRÈS la dernière règle ajoutée, sinon elle se réécrit deux fois.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-conception - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve (recette, comptes, commit) — le pilot clôt les deux items sur gains constatés.
