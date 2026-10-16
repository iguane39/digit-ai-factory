# Retours forges — Produit-12 — 20260830a

- **Contexte** : mise en conformité du dépôt aux règles de la factory (`REGLES-PROJET.md`,
  `gabarits\HERITAGE.json`), hors run — mandat humain du 2026-08-30. Verdict de départ :
  `oracle-conformite-projet` FAIL, 15 constats sur 33 règles jugées ; verdict d'arrivée : 2, tous
  deux portés au carnet des écarts assumés.
- **Références ledger** : `forge\ledger.jsonl` seq 1 (le `run_open` sans `versions_forges` qui
  fonde RS-16) et seq 30 (le domaine Railway généré, contexte de RS-17).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` —
  l'original reste ici.
- **Statut** : remis le 2026-08-30 dans la boîte d’entrée du pilot (`<pilot>\input\00-retours\`) — ce lot ne se modifie plus

Convention de gravité : **bloquant** · **majeur** · **mineur**. Ids en séquence continue du
produit : le lot précédent s'arrêtait à RS-15.

---

## pilot (`digit-ai-factory`)

Six constats, tous nés du même exercice : appliquer le socle à un dépôt **qui existait déjà**.
C'est le cas de rattrapage que `REGLES-PROJET.md` prévoit en ligne 13 (« au prochain run de
version de chacun »), et il révèle des angles que l'instanciation d'un dépôt neuf ne rencontre
jamais — parce qu'un dépôt neuf n'a ni histoire, ni conventions locales, ni secrets déjà rangés.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RS-16 | majeur | générique | **R-19 juge la PRÉSENCE de `versions_forges` sans antériorité, alors qu'il en accorde une à la FORME de ses clés.** Le même contrôle, sur le même champ, dans la même boucle : les clés en noms courts d'un `run_open` antérieur au 2026-08-17 sont une « antériorité déclarée, jamais réécrite » (constante `DOCTRINE_CLES_COMPLETES`, TF-0320), mais un `run_open` sans le champ du tout est un FAIL sans échappatoire. Mesuré ici : l'entrée 1 du ledger, ouverte le 2026-08-05, ne porte pas `versions_forges`. Elle ne peut pas l'acquérir — R-42 pose que « l'histoire ne se réécrit pas », et les versions des forges au 2026-08-05 ne sont plus mesurables. Le produit est donc en FAIL **définitif** sur une règle dont la sœur immédiate sait pardonner | Étendre `DOCTRINE_CLES_COMPLETES` (ou une constante propre) à la **présence** du champ : un `run_open` antérieur à l'entrée en vigueur passe en antériorité déclarée, imprimée au rapport, jamais effacée. À défaut, ouvrir à R-19 le mécanisme de **rectification par ajout** que R-42 possède déjà (`type: rectification_versions_forges`, nommant le `seq` et la cause), pour que le produit ait au moins un geste à faire |
| RS-17 | majeur | générique | **Un artefact `copie_conforme` de R-47 revendique un nom générique qu'un produit pouvait légitimement occuper.** `gabarits\RETOURS-FORGES.md` se copie en `forge\retours\RETOURS-FORGES.md`. Ce produit tenait sous ce nom, depuis le 2026-08-05, **l'index de ses remises** — table lot ↔ fichier ↔ statut, citée par `forge\retours\LISEZMOI.md`, par `forge\PROMPT-REMISE-LOTS-03-04.md` et par ses trois sidecars d'oracles. La mise en conformité a donc coûté un renommage en cascade (`INDEX-DES-LOTS.md`, plus trois sidecars, plus deux documents à corriger), pour un fichier que R-43 imposait de céder. Le nom ne dit pas qu'il s'agit d'un gabarit : son juge, lui, le dit (`oracle-lot.mjs`) | Faire voyager le gabarit sous un nom qui annonce sa nature — `GABARIT-LOT-RETOURS.md`, symétrique de `oracle-lot.mjs` — et déclarer l'ancienne cible en alias accepté dans `HERITAGE.json` le temps d'une transition. Un artefact en `copie_conforme` prend un nom qu'aucun produit ne peut avoir choisi pour autre chose |
| RS-18 | majeur | générique | **Un artefact `copie_conforme` qui bouge chez le pilot met tout le parc en FAIL, et aucun produit ne l'apprend.** Mesuré à la minute, dans cette session : `forge\RESTITUTION.md` copié à 08:56 depuis le gabarit ; à 09:01 le gabarit du pilot passait de 2.11.0 à 2.12.0 (modification non commitée côté pilot) ; à 09:12 R-47 déclarait la copie « périmée ». Un produit qui ne rejoue pas l'oracle ne le sait pas, et le produit de référence du parc (`Produit-02.com`) porte **exactement le même FAIL** sur **exactement ce fichier** — preuve que le cas n'est pas propre à cette session. **Le fait s'est reproduit dans la même heure** : recopié à 09:11 en 2.12.0, le gabarit passait en 2.13.0 à 09:20, et R-47 redéclarait la copie périmée à 09:24 — deux dérives en une heure, sur un fichier de 46 Ko dont le produit ne lit jamais le contenu | Faire porter au gabarit une **version** lisible par l'oracle, et à R-47 un message qui distingue « le produit n'a pas recopié » de « le pilot a publié une version neuve le AAAA-MM-JJ ». Mieux : un geste unique côté produit (`node <pilot>\scripts\relever-heritage.mjs --appliquer`) qui recopie tout ce que `HERITAGE.json` déclare — aujourd'hui chaque produit refait à la main une copie que le référentiel décrit déjà entièrement |
| RS-19 | majeur | générique | **R-32 n'a pas de forme de journal pour un livrable qui porte des données personnelles.** Cinq des sept livrables HTML de ce produit sont des rapports de typologie construits sur le **courrier réel** du cabinet (locataires, propriétaires, prestataires) ; `output\02-typologie\` est gitignoré pour cette raison. Or les journaux exigés par R-32 vivent sous `forge\oracles\` et sont **versionnés** (décision C4), et les messages de `check_html.py` citent des fragments de page entre guillemets — L1 « une ligne s'ouvre sur « … » », L19 « coupure de mot : « … » ». Jouer le gate à la lettre versionnait donc des extraits de correspondance réelle. Le produit a dû **inventer** son caviardage (fragments entre `«` `»` remplacés, règle et sélecteur conservés) et le déclarer dans le journal | Prévoir au contrat du journal un champ `caviardage` normalisé et, côté `check_html.py`, une option `--sans-extraits` qui rende les mêmes constats sans citer la page. Sans cela, chaque produit à données sensibles inventera sa propre réponse — ou, plus probablement, ne jouera pas le gate |
| RS-20 | **bloquant** | générique | **Le socle `gabarits\gitignore-produit` impose le motif `!forge/**`, qui RÉ-INCLUT les secrets rangés sous `forge\`.** R-47 exige la ligne `!forge/**` telle quelle (mode `presence_et_motifs`, comparaison sur les lignes nues). Or en gitignore le dernier motif qui matche l'emporte : chez ce produit, `forge\etapes\mep\.env.recette` et `forge\etapes\mep\.admin-mdp-production.txt` étaient exclus par des lignes explicites **placées plus haut** — le `.gitignore` d'origine portait d'ailleurs le commentaire « un `!forge/**` global ré-inclurait aussi les secrets de `forge\etapes\mep\` », c'est-à-dire qu'un humain avait vu le piège et refusé la ligne. La conformité à R-47 obligeait à l'ajouter ; sans re-exclusion **placée après**, deux fichiers de secrets entraient dans l'histoire du dépôt au commit suivant | Le gabarit doit porter la contre-mesure qu'il rend nécessaire : après `!forge/**`, un bloc commenté « ce que la négation ne doit pas rouvrir » avec au moins `forge/**/.env*` et `forge/**/*mdp*`. Et R-47 gagnerait à juger, en plus de la présence du motif, qu'**aucun fichier d'apparence secrète sous `forge\` n'est suivi par git** — une négation large sans garde est un piège que le socle tend lui-même |
| RS-21 | **bloquant** | générique | **Le socle `gabarits\gitignore-produit` ignore `.env.example`, que R-13 exige VERSIONNÉ.** Le bloc « Secrets et environnement » du gabarit pose `.env`, puis `.env.*`, puis une seule négation : `!.env.*.exemple` — en **français**. Le fichier que R-13 nomme, lui, s'écrit `.env.example` (« toutes les variables attendues… valeurs par défaut sûres ou vides »), et c'est ce nom que `oracle-conformite-projet` cherche pour rendre R-13. Mesuré ici : `.env.example` créé et renseigné, R-13 PASS — et `git check-ignore .env.example` répond **IGNORE**. Le fichier n'apparaît même pas en `??` dans `git status` : rien ne signale qu'il ne sera pas commité. **Deux règles du même socle se contredisent, et celle qui perd le fait en silence** | Ajouter `!.env.example` au gabarit, à côté de `!.env.*.exemple` — les deux graphies circulent dans le parc et la négation ne coûte rien. Et faire juger par R-13 non seulement la présence du fichier mais le fait qu'il soit **suivi par git** : un `.env.example` ignoré est indiscernable d'un `.env.example` absent pour quiconque clone le dépôt |


## Remarques restées au produit

Trois constats sont restés ici, chacun avec son verdict de généralisation écrit.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Cinq commits du 2026-08-08 au 2026-08-23 sont hors Conventional Commits (R-9) | non corrigée : les réécrire changerait des empreintes citées au ledger et dans des lots déjà remis. Portée au carnet des écarts assumés, avec engagement de conformité sur tout commit à venir | non | le défaut est une **histoire** de ce dépôt, pas une classe : R-9 ne juge que vingt commits, l'écart se résorbe seul. Rien à demander à la factory — la règle a bien fonctionné, elle a nommé un fait vrai |
| `docs\projet\` était entièrement absent après cinq runs et une mise en production | les huit fiches ont été rédigées depuis le code, les migrations et le ledger, et les deux projections régénérées par les scripts du pilot | non | le manque était **local** : le socle existe, il est décrit, et le produit ne l'avait simplement jamais instancié. Le contrôle R-20 l'a dit correctement dès qu'il a été joué. Le vrai sujet — pourquoi l'oracle n'a pas été joué pendant cinq runs — est déjà couvert par R-47 et par RS-18 ci-dessus |
| Six des sept livrables HTML échouent au gate R-32 (A2 favicon absent, G1 auto-sombre hérité de l'OS, L19 coupures de mot, débordements à 390 px) | non corrigés : ce sont des livrables **déjà remis**, que R-5 interdit de réécrire à indice inchangé. Les verdicts sont consignés, datés et versionnés — c'est ce que R-32 demande | non | le gate a fait exactement son travail en le disant. La classe des défauts (favicon, thème sombre, largeur mobile) est déjà connue de la factory et portée par `check_html.py` ; la seule chose qui manquait ici était de **jouer** l'oracle. Ce qui est généralisable dans cet épisode — le caviardage — est remonté sous RS-19 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque `gabarits\documents\` sur ce lot. Les
gabarits employés ici sont ceux du **socle projet** (`gabarits\docs-projet\`, `CLAUDE-PRODUIT.md`,
`gitignore-produit`, `RETOURS-FORGES.md`, `ECARTS-ASSUMES.md`), et les retours qu'ils appellent
sont RS-17, RS-19 et RS-20 ci-dessus.

Une précision utile sur `gabarits\docs-projet\` malgré tout, parce qu'elle a bien failli produire
un défaut : le gabarit `PARAMETRAGE.md` porte une section intitulée « Un écart à R-24 se déclare
en CHAMP, jamais en prose ». Ce titre contient à la fois « écart » et « R-24 » — c'est-à-dire
exactement le motif que l'oracle cherche pour détecter une prose d'écart non déclarée. Un produit
qui recopie le gabarit sans le vider **met en défaut R-24 avec le texte du gabarit lui-même**. La
fiche a donc été rédigée sans cette section. Portée : générique, mais l'effet est mineur tant que
le gabarit est réécrit plutôt que recopié.

## Confirmations positives

Quatre mécanismes ont tenu en conditions réelles, et méritent d'être notés comme tels.

- **`oracle-conformite-projet` localise vraiment.** Quinze constats, quinze chemins exacts, aucun
  faux positif à l'arrivée. Les messages disent le geste qui répare, pas seulement la règle.
- **R-20 ter (marqueurs de gabarit non instanciés) a été utile avant même de tourner.** Sa seule
  existence a conduit à rédiger les huit fiches plutôt qu'à recopier les gabarits — ce qui est
  précisément le comportement visé par TF-0647.
- **Le refus du générateur d'architecture est bien placé.** `generer-architecture.mjs` refuse de
  rendre une vue depuis une source encore trouée : le contrôle est en amont du livrable, là où il
  coûte le moins.
- **`HERITAGE.json` comme donnée plutôt que liste en dur** a permis de dériver les dix copies à
  faire sans lire une ligne de code d'oracle. C'est le référentiel qui a piloté le rattrapage.

## Ordre recommandé

1. **RS-21** — une ligne à ajouter au gabarit, et le socle cesse de gitignorer le fichier qu'il
   rend obligatoire. Coût du correctif : une ligne. Coût du silence : un `.env.example` absent
   de tout dépôt cloné, sans qu'aucun signal ne le dise.
2. **RS-20** — le second bloquant : le socle tend un piège à secrets, et il le tend à tout le
   parc. Le correctif est une poignée de lignes dans le même gabarit — les deux se corrigent
   d'un seul passage.
3. **RS-16** — une constante à étendre, et un produit sort d'un FAIL définitif qu'aucun geste ne
   peut lever aujourd'hui.
4. **RS-18** — le geste de recopie automatique depuis `HERITAGE.json` ferait tomber, en une
   commande, une classe entière de FAIL R-47 sur tout le parc.
5. **RS-19** — l'option `--sans-extraits` est peu coûteuse et débloque les produits à données
   personnelles, qui autrement ne joueront pas le gate.
6. **RS-17** — le renommage du gabarit est le moins urgent : le coût est payé une fois par
   produit, et il vient d'être payé ici.
