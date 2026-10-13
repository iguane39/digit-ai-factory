# Banc des paires « fautif, corrigé » tirées du git (TF-1551)

Troisième banc de l'étape 1 de l'option O2 de `output\03-etudes\20261001-etude-opportunite-rsi-et-ssl.md`, après le banc
de mutation et celui des restitutions refusées (`oracles\banc-mutation\README.md`). Aucun appel de modèle, lecture seule
sur les dépôts et sur les oracles.

## Paires fautif et corrigé, rejouées

Une session qui corrige un livrable refusé par un oracle écrit souvent « oracle-x FAIL -> PASS » dans son message de
commit. Le fichier au parent du commit est le fautif, le fichier posé par le commit est le corrigé. Le banc rejoue
chaque paire devant l'oracle d'aujourd'hui : le fautif doit rester refusé, le corrigé doit rester accepté.

`node oracles\banc-paires\paires.mjs --extraire` puis `--rejouer`. Le corpus porte des livrables et des messages de
commit, qui peuvent nommer un client : il vit hors du dépôt, dans `<racine>\_confidentiel\bancs\paires\`. Le résultat
ne publie que des comptes et des identifiants de paire (`dépôt@commit:oracle:n`).

## La règle d'extraction

Elle est écrite en tête de `paires.mjs` et chaque clause a son cas dans `paires.test.mjs`.

1. **P1, le message.** Une proposition du message nomme un oracle et un sens rouge → vert : « FAIL -> PASS », « passe
   de FAIL a PASS », « FAIL devient PASS sous… », « FAIL avant, PASS apres », « PASS (il etait FAIL) », « rouge vers
   vert ». L'oracle retenu est celui qui précède la marque. Un compte de cas de recette (« 20/20 -> 21/21 ») n'en est
   pas une.
2. **P2, l'oracle.** Son script existe dans l'arbre du commit, au même dépôt.
3. **P3, le livrable.** Tout fichier modifié par le commit, hors le script de l'oracle et sa recette.
4. **P4, la confirmation.** Le juge de l'époque, joué dans l'arbre du commit extrait par `git archive`, refuse le
   fautif et accepte le corrigé. Les oracles qui jugent un dossier ou le dépôt s'écartent d'eux-mêmes : le fichier
   passé en argument ne change pas leur verdict.

## Mesure du 13/10/2026

Les 14 dépôts du pilot et des forges, soit 2 448 commits sans fusion, ont été lus par ce script. P1 retient
30 commits : 22 au pilot, 6 dans `digit-ai-forge-agents`, 2 dans `digit-ai-forge-conception`. Ils donnent
217 paires candidates. Le juge de l'époque en confirme 5.

| Oracle | Paires confirmées | Fautif toujours refusé | Corrigé toujours accepté | Paires tenues |
|---|---|---|---|---|
| `oracle-ecriture` | 1 | 1 | 1 | 1 |
| `oracle-todo` | 1 | 1 | 1 | 1 |
| `oracle-synthese` | 1 | 1 | 0 | 0 |
| `oracle-lecture-tiers` (forge-agents) | 1 | 1 | 1 | 1 |
| `oracle-ears` (forge-conception) | 1 | 1 | 1 | 1 |
| Total | 5 | 5 (100 %) | 4 | 4 (80 %) |

Lecture faite à la main le 13/10/2026 :

- **Aucun défaut de juge.** Les 5 fautifs restent refusés : aucun oracle n'a perdu la détection que son commit
  annonçait.
- **Le corrigé refusé n'est pas une régression.** Le corrigé `oracle-synthese` du commit `8fbe7e4a` (10/09/2026) est
  refusé aujourd'hui par S43, S47 et S51, nées les 12, 16 et 17/09/2026. La règle qu'il corrigeait, S8, refuse
  toujours le fautif et accepte le corrigé.
- **212 paires non confirmées.** P4 en écarte 206 : 106 où l'oracle ne rend pas de verdict sur un fichier seul
  (`oracle-boite-entree`, `oracle-chemin-prescrit` et les autres qui jugent le dépôt), 63 refusées des deux côtés,
  37 acceptées des deux côtés. P2 en écarte 5 : chaque fois, l'oracle cité vit dans un autre dépôt que le
  commit, comme `oracle-slop` de forge-design cité par forge-agents. P3 en écarte une.
- **Limite de P4 : elle juge le verdict global.** Le commit `6c8267d0` annonce S54 rouge → vert sur
  `gabarits\RESTITUTION.md`, mais le verdict global reste FAIL des deux côtés : la paire n'est pas confirmée.
  Confirmer sur la règle nommée par le message élargirait le corpus.

Un autre gisement de l'étude a été mesuré et écarté. Les 214 historiques `*.oracles-historique.jsonl` du pilot
donnent 42 passages d'un FAIL à un PASS sur deux versions différentes d'un livrable. La version refusée ne se retrouve
dans le git que 2 fois sur 42 : un livrable refusé est corrigé avant d'être enregistré.
