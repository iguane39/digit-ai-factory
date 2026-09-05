# Retours forges — digit-ai-forge-agents — 20260905a

- **Contexte** : traitement du lot `pilot - TRAVAUX - 20260905a` (items TF-0806 et TF-0812,
  un seul chantier), reçu dans `input\00-travaux\` de la forge et joué sur mandat humain du
  05/09/2026 (« A-32 »).
- **Références ledger** : aucune — le dépôt `digit-ai-forge-agents` ne porte pas de
  `forge\ledger.jsonl` (c'est une forge, pas un produit instancié). La preuve tient au commit
  local `966402a` et aux recettes rejouées, citées ci-dessous.
- **Remise au pilot** : ce fichier et son sidecar sont déposés dans `<pilot>\input\00-retours\`.
- **Statut** : remis le 2026-09-05

## Ce que le lot de travaux a produit (TF-0806 et TF-0812)

Le lot confiait un seul chantier en trois parties, et les trois sont faites. Le tableau dit ce
qui a été écrit et par quelle preuve exécutée chaque partie se vérifie ; le détail de la mesure
avant/après suit juste en dessous.

| Partie du lot | Ce qui a été fait | Preuve exécutée |
|---|---|---|
| (1) normaliser la ligne AVANT masquage, chemin retiré ou remplacé par un jeton fixe | `normaliserChemin()` posée dans `.claude\hooks\qo-gate-write.mjs`, exportée, pure : tout chemin de fichier de la ligne de constat devient le jeton `<fichier>` ; ne restent que la règle, le message et la position, masquée ensuite avec les chiffres. `masque()` et `compteur()` de `partagerConstats()` travaillent désormais sur la ligne normalisée. La fonction est déclarée AU-DESSUS du dispatch `--self-test`, pour la raison déjà payée le 01/09 (zone morte temporelle : le banc appelle avant l'évaluation des `const` du corps). | Banc du hook `node .claude\hooks\qo-gate-write.mjs --self-test` : **26/26** (21/21 avant). Bout en bout sur un fichier réel : voir la mesure ci-dessous. |
| (2) fixture double sens dans la recette du hook | Cinq cas ajoutés au banc, dont les deux demandés : même constat des deux côtés malgré deux chemins différents → 0 neuf, 1 préexistant ; la même édition qui AJOUTE un constat → 1 neuf, nommé, le préexistant restant non imputé. Trois cas de garde les accompagnent : normaliser ne confond pas deux règles distinctes, le jeton remplace bien le chemin des deux côtés, et ce qui n'est pas un chemin (« 2/3 », « ligne 12 ») reste intact. | Banc privé du seul correctif (copie hors dépôt, `masque()` rendu à sa version d'avant) : **24/26**, et les deux cas rouges sont exactement les deux fixtures demandées. Avec le correctif : **26/26**. |
| (3) le message du refus cite le nombre de préexistants non imputés | Le verdict bloquant écrit désormais `(+ N constat(s) PRÉEXISTANT(S) sur ce fichier, non imputé(s) à cette édition — reconnus sur la ligne NORMALISÉE, chemin remplacé par « <fichier> » : …)` et montre jusqu'à quatre de ces lignes sous leur forme normalisée. C'est la ligne qui a servi de clé : la montrer est le seul moyen pour un lecteur de voir sur quoi la reconnaissance a porté. | Sortie réelle du hook au second sens de la mesure ci-dessous, citée mot pour mot. |

**La mesure, avant puis après.** Le défaut a été reproduit d'abord, pour disposer du sens rouge
avant tout correctif. Le fichier support est `run\rapport-jouet.md` du dépôt de la forge, dont la
version `HEAD` porte déjà un constat M7 (« Racine du projet (premier niveau) », ligne 36) ;
l'édition appliquée est une phrase ajoutée en fin de fichier, sans rapport avec ce chapitre.

| Passe | Partage rendu par le hook | Verdict |
|---|---|---|
| Avant correctif, édition sans rapport | `delta=true`, **1 neuf**, 1 préexistant — le M7 de `HEAD` imputé à l'édition, la seule ligne reconnue étant le bilan « NON CONFORME », qui ne porte pas de chemin | **exit 2, BLOQUÉ** |
| Après correctif, même édition | **0 neuf**, 2 préexistants | **exit 0, PASSE** — « les 2 constat(s) de ce fichier PRÉEXISTENT à cette édition », dette nommée |
| Après correctif, second sens : la même édition ajoute un chapitre ouvert sur un tableau nu | **1 neuf** (le M7 « Annexe jouet », ligne 145), 1 préexistant | **exit 2, BLOQUÉ**, le constat neuf nommé, suivi de « + 1 constat(s) PRÉEXISTANT(S) … reconnus sur la ligne NORMALISÉE, chemin remplacé par « `<fichier>` » » |

Le fichier support a été restauré à l'identique après la mesure (`git checkout --`, comparaison
binaire avec la copie de sauvegarde : identique). Aucun document de la forge n'a été modifié pour
passer un gate.

**Ce que le moyen de vérification du lot demandait, et ce qui n'a pas pu être joué.** Le lot
propose de rejouer le cas sur `docs\run-playbook.md` de la forge de développement, à sa version
`00097b6`. Cela n'a **pas** été fait, et le motif est de périmètre, pas de difficulté : jouer le
hook sur un fichier d'un dépôt frère y ferait écrire les journaux d'oracles de `run-oracles.mjs`,
c'est-à-dire une écriture hors mandat. Le cas équivalent a donc été construit **dans la forge**,
sur un fichier dont `HEAD` porte le même type de constat M7 — même mécanisme, même chemin de
code, preuve exécutée ci-dessus.

**Les recettes de la forge, toutes rejouées après le correctif** : banc du hook 26/26 ·
`forge-agents\scripts\self-test.mjs` exit 0 · `quality-oracles\scripts\self-test.mjs` exit 0 ·
`self-test-hamecon-publication.mjs` exit 0 · `experts-forge\scripts\self-test-routage.mjs` exit 0 ·
`write-an-expert\scripts\self-test-scaffold.mjs` 2/2 PASS · `self-test-gates-jq.sh` et
`self-test-gate-budget.sh` exit 0 · `oracle-promesses.mjs` sur `.claude\hooks\` : PASS (le hook a
signé l'adhésion, et les noms cités par les commentaires ajoutés existent tous dans le code).

**La source, jamais la copie installée.** Seule la source versionnée
`digit-ai-forge-agents\.claude\hooks\qo-gate-write.mjs` a été modifiée. La copie installée sous
`~\.claude\hooks\` n'a pas été touchée : c'est au pilot de réaligner les copies par son oracle
des skills. Tant que ce réalignement n'a pas eu lieu, les sessions en cours jouent encore la
version défaillante.

## digit-ai-forge-agents (`digit-ai-forge-agents`)

La correction de TF-0806 a été mesurée avec ses effets de bord, et deux constats en sont sortis
— tous deux sur le même mécanisme de partage au delta, tous deux auto-retours de cette forge. Le
premier est le plus important : il n'était pas atteignable avant ce correctif, parce que le
défaut corrigé le masquait.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | majeur | générique | **L'identité d'un constat est une ligne qui ne dit pas combien de constats elle résume : au troisième, le gate s'ouvre sur du travail neuf.** `run-oracles.mjs` (`runCli`) construit le champ `detail` avec `raisons.filter(Boolean).slice(0, 2)` — les DEUX premières raisons seulement. Le partage neufs/préexistants du hook C7 identifie un constat par cette ligne : deux fichiers dont l'un porte deux violations du même oracle et l'autre trois rendent donc la MÊME ligne, au chemin près — donc la même clé une fois le chemin normalisé. **Mesure du 05/09/2026** : deux notes Markdown identiques à un chapitre près (deux chapitres ouverts sur un tableau nu contre trois), passées à `run-oracles.mjs --profil digit-ai --niveau note` ; les deux lignes `❌ [Lisibilité d'un document (Markdown)]` rendues sont identiques mot pour mot, seul le nom de fichier diffère — elles nomment « Chapitre A » et « Chapitre B », jamais « Chapitre C ». Conséquence : un fichier dont `HEAD` porte déjà deux constats d'un même oracle et dont l'édition en ajoute un troisième obtient « 0 neuf » et passe. Le défaut existait avant TF-0806, masqué par lui : tout comptait comme neuf, donc rien ne s'ouvrait à tort. La limite déclarée du hook (« deux constats de même classe dont aucun compteur ne bouge se confondent ») le couvre en prose, pas en mesure. | Faire porter à la ligne le NOMBRE de constats de l'oracle, pas seulement les deux premiers messages — par exemple `— 3 constat(s) · <les deux premiers>`. Le mécanisme de comptage existe déjà dans `partagerConstats()` (`compteur()` reconnaît « × n », « n occurrences », « n cas ») : une occurrence de plus serait alors traitée comme neuve sans aucune autre modification. Le choix reste au pilot : allonger le `detail` de tous les oracles est un changement de contrat de sortie, pas une correction locale. |
| RA-2 | mineur | générique | **Le delta se rend silencieusement non calculable quand la cible est un chemin RELATIF.** `constatsAvant()` interroge git par `git -C <dossier de la cible> ls-files --full-name --error-unmatch -- <la cible telle que reçue>` : le chemin de la cible est réinterprété relativement au dossier passé à `-C`, donc un chemin relatif ne s'y résout jamais. La fonction rend alors `null`, tout compte comme neuf, et le gate bloque comme avant D-33 — sans dire que le delta a été abandonné. **Mesure du 05/09/2026**, même fichier et même édition que la mesure de TF-0806 : avec `file_path` absolu, `delta=true`, 1 neuf, 1 préexistant ; avec `file_path` relatif (`run/rapport-jouet.md`), `delta=false`, 2 neufs, 0 préexistant. L'outil d'édition passe aujourd'hui des chemins absolus, ce qui rend le cas latent — c'est pourquoi la gravité est mineure et non majeure : le défaut est fail-closed, il ne peut pas ouvrir le gate à tort. | Résoudre la cible en entrée de `constatsAvant()` (`path.resolve`) ; et surtout **déclarer** le repli : quand le delta n'est pas calculable, le verdict devrait le dire avec son motif (« hors dépôt », « absent de HEAD », « chemin non résolu »), comme le hook déclare déjà ses exemptions. Un gate qui revient au comportement d'avant sans le dire est indistinguable d'un gate qui juge le delta et ne trouve rien de préexistant. |

## Remarques restées au produit

Aucune remarque n'est restée au produit sur ce lot — vérifié par la forge digit-ai-forge-agents,
le 2026-09-05. Les deux constats trouvés pendant la mesure visent la forge elle-même et sont
remontés ci-dessus (RA-1, RA-2) plutôt que corrigés en silence : le lot borne explicitement ce
qui est demandé, et élargir le périmètre sans mandat est précisément le défaut que TF-0806 fait
payer aux autres forges.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — le chantier est
entièrement du code de hook et sa recette. Le seul gabarit employé est celui du présent lot de
retours (`gabarits\RETOURS-FORGES.md`, `version_du_gabarit` non portée par le fichier reçu), et
il n'a rien manqué à sa lecture.

## Confirmations positives

Trois choses ont tenu en conditions réelles pendant ce run, et méritent d'être closes comme
vérifiées.

- **La doctrine du delta (D-33 (a), 01/09) est juste, et elle fonctionne dès que sa clé est
  juste.** Une fois le chemin normalisé, une édition sans rapport sur un fichier endetté passe,
  la dette restant nommée au verdict — c'est exactement le comportement décrit par la décision.
- **Le banc du hook était le bon endroit, et sa discipline a payé.** Les cinq cas ajoutés sont
  rouges sans le correctif et verts avec lui ; le commentaire du 01/09 sur la zone morte
  temporelle a évité de reproduire l'erreur en déclarant la nouvelle fonction trop bas.
- **La précédence de charte (D-41 (b), 02/09) n'a pas bougé.** Ses six cas restent verts avec la
  normalisation en place : le partage au delta et la neutralisation de police n'interfèrent pas.

## Ordre recommandé

1. **RA-1 d'abord** — c'est le seul des deux qui peut ouvrir le gate sur du travail neuf, et il
   est devenu atteignable par le correctif de ce lot. Le geste est petit côté hook (le compteur
   existe) et se décide côté `run-oracles.mjs` (contrat de sortie du `detail`).
2. **Le réalignement de la copie installée du hook ensuite** — la source est corrigée, les
   sessions jouent encore l'ancienne ; tant qu'elles ne sont pas réalignées, les trois forges
   continuent de payer le péage mesuré le 05/09.
3. **RA-2 en dernier** — fail-closed, latent tant que l'outil d'édition passe des chemins
   absolus ; sa vraie valeur est la déclaration du repli, pas la résolution du chemin.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

Ce lot ne suit pas un retour humain sur un livrable : il traite un lot de travaux, et les deux
constats remontés viennent d'une mesure, pas d'une correction demandée. La règle nommée l'est
donc pour la classe, pas pour un symptôme.

- **RA-1 et RA-2 relèvent tous deux de la classe `gate-ecriture-juge-fichier-entier`**, celle
  que TF-0732 avait close et que TF-0806/TF-0812 ont fait récidiver. La règle qui les aurait
  évités est celle que ce lot vient de câbler : *une identité de constat se prouve sur deux
  contextes différents, jamais sur deux lignes déjà identiques*. Les six cas de banc écrits le
  01/09 comparaient des lignes construites à la main, identiques par construction — aucun ne
  faisait varier le contexte d'exécution, et c'est pourquoi le défaut y a survécu.
- **Réserve honnête sur la classe de RA-1** : le libellé de `gate-ecriture-juge-fichier-entier`
  dit « juge le fichier entier au lieu du delta », c'est-à-dire le défaut fail-closed. RA-1 est
  le défaut inverse — le delta ouvre sur du neuf. Aucune clé du référentiel ne nomme ce sens-là.
  La classe existante est retenue parce qu'elle porte le même mécanisme et le même code, mais
  le pilot est mieux placé pour trancher s'il vaut une classe propre (par exemple « un gate au
  delta identifie un constat par une ligne tronquée »). Une classe ne se crée jamais dans un
  sidecar, la réserve est donc écrite ici.
