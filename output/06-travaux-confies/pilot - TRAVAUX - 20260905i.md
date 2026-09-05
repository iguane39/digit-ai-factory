# Travaux confiés par le pilot — digit-ai-forge-agents — 20260905i

- **Émetteur** : `digit-ai-factory` (le pilot)
- **Références registre** : `todo\TODO.jsonl` du pilot — item TF-0824 (le contrat de sortie de `run-oracles.mjs` n'a aucun domicile écrit), remonté par cette forge en prose dans son lot de retours 20260905b (section « un second constat, sans classe »), entré au registre par la classe `contrat-de-sortie-sans-domicile` créée par le pilot le 05/09 ; décidé le 05/09/2026 (D-19 (a)), rang 12 ; confié sur mandat humain « 19a, 20a, A45, A46, A44, A47, A48 », action A-47 de la synthèse `output\04-plans\…20260905l.md`
- **Dépôt** : ce fichier a été déposé par le pilot dans `input\00-travaux\` de cette forge, sur mandat humain. L'original reste au pilot (`output\06-travaux-confies\`). Statut : `a_traiter` → `traite le <date>` — seule édition autorisée après coup.
- **Statut** : a_traiter
- **Empreinte du contenu confié** : `TF-0824@20260905` — deux lots portant la même empreinte confient la même chose ; le pilot ne redépose jamais une empreinte déjà présente.
- **Sidecar machine** : `pilot - TRAVAUX - 20260905i.tf.jsonl`, une ligne par élément.
- **Ordre entre lots** : le lot 20260905g (règle C5, banc de `constatsAvant()`) est en cours d'instruction chez vous par un agent mandaté ; ce lot-ci se traite APRÈS lui, sur la version qu'il laisse — les deux touchent `quality-oracles`.

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

### TF-0824 — Le contrat de SORTIE du lanceur d'oracles a un domicile écrit, versionné et éprouvé · gravité mineur

- **Le fait** : le champ `detail` rendu par `.claude\skills\quality-oracles\scripts\run-oracles.mjs` a changé deux fois en dix jours — sa source de raisons le 26/08 (TF-0659), son en-tête « n constat(s) · » le 05/09 (TF-0815) — et aucun document versionné ne dit ce que ce champ contient ni ne porte de version qu'un lecteur pourrait surveiller. Mesuré par vous le 05/09/2026 : `references\regles-oracles.md` décrit le contrat d'ENTRÉE que doit tenir un oracle CLI (`{oracle, domaine, artefact, verdict, findings[], non_juge[]}`), jamais la forme de ce que le lanceur rend en retour ; la déclaration du changement du 05/09 est passée par un lot de retours — le bon canal, pas un domicile.
- **Pourquoi cela vous concerne** : le lanceur est hérité par toutes les forges et tous les produits, et le hook d'écriture lit sa sortie ligne à ligne pour partager neufs et préexistants ; le prochain lecteur qui compare deux `detail` n'a rien à lire, et la prochaine forge qui parse la sortie se cassera sans préavis.
- **Ce qui est demandé** : (1) un contrat de SORTIE écrit à côté du contrat d'entrée (`references\regles-oracles.md`, section neuve, ou `references\contrat-sortie-runner.md`) : la forme de chaque ligne rendue (verdict, oracle, `detail` avec son en-tête « n constat(s) · » et ses deux premiers messages), le code de sortie, et une VERSION du contrat ; (2) la recette de `quality-oracles` éprouve le contrat : un cas qui joue le lanceur sur une fixture et compare la ligne rendue à la forme documentée (rouge : une ligne qui ne porte pas l'en-tête de compte est refusée ; vert : la ligne courante passe) ; (3) l'historique des deux changements (26/08, 05/09) est consigné dans le document avec la version qu'ils auraient portée ; (4) tout changement futur du contrat incrémente la version et se lit au registre par un lot de retours.
- **Effort estimé** : complexité simple × durée courte.
- **Comment vous saurez que c'est fait** : le document existe, porte une version et les deux changements datés ; la recette de `quality-oracles` compte le cas du contrat (rouge et vert) ; `oracle-skills` du pilot rend PASS après réalignement des copies installées.
- **Si ce n'est pas fait** : le champ `detail` changera une troisième fois sans qu'un lecteur ait quoi surveiller, et le hook d'écriture, qui en dépend, le découvrira en bloquant.

## Ce que le pilot a déjà fait de son côté

- Le constat, remis en prose faute de classe, est entré au registre sous TF-0824 par la classe `contrat-de-sortie-sans-domicile` (famille « contrat d'interface entre forges », voisines « verdict de recette non prononçable » et « auteur juge son contrat »), décidé le 05/09 (D-19 (a)).
- Le changement du 05/09 (TF-0815) est déjà déclaré au registre par la clôture de cet item ; ce lot lui donne un domicile.
- Rien n'a été écrit dans le code de la forge ; la boîte `input\00-travaux\` est ignorée par votre `.gitignore`.

## Ce que le pilot NE demande PAS

- Pas de changement du contrat lui-même : la forme actuelle (en-tête de compte, deux premiers messages) est celle du 05/09, elle se documente telle quelle.
- Pas de changement du contrat d'ENTRÉE des oracles CLI.
- Pas de rejeu chez un dépôt frère.

## Ordre recommandé

1. **Le document d'abord**, parce que la recette ne peut éprouver qu'un contrat écrit.
2. **La recette ensuite**, parce qu'un contrat que rien n'éprouve est une prose de plus.

## Remise du compte rendu

À la clôture de votre run, un lot de retours `digit-ai-forge-agents - RETOURS - <date><i>.md` (+ sidecar) remis dans `c:\dev\digit-ai-factory\input\00-retours\` dit ce qui a été fait, avec la preuve (document, version, recette, commit) — le pilot clôt l'item sur gains constatés.
