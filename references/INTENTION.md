# ISTO — la cascade de l'intention : Intention → Stratégie → Tactique → Opération

Référentiel versionné (loi n° 4, daté-éditable) — **version 2.0.0, 03/10/2026** (ISTO devient
contrôlable : format commun de cascade et son oracle, indicateurs structurés, validation tracée de
l'intention, grille de profondeur, propagation des changements, contraintes et non-objectifs,
phases transverses ; décision humaine « 1b » du 03/10/2026 sur le diagnostic des huit manques ;
précédentes : 1.2.0, 03/10/2026, le nom ISTO et le tableau par phase ; 1.1.0, 20/09/2026, le
contrôle s'étend aux restitutions, S51 ; 1.0.0, 01/09/2026). Porté par la
**loi transverse n° 7** du noyau ; né du retour humain du 01/09/2026 (TF-0791) et décidé le
même jour (D-2, option a).

## Le terme

**ISTO** — acronyme des quatre niveaux, dans l'ordre de la descente : **I**ntention,
**S**tratégie, **T**actique, **O**pération. Nommé par l'humain le 03/10/2026 : « le
principe/terme ISTO (Intention, Stratégie, Tactique, Opération) ». Il désigne le principe
entier — la descente ET le test rétro qui la remonte —, jamais la seule liste des niveaux.
Le quatrième niveau, appelé « opérationnel » jusqu'à la version 1.1.0, se nomme désormais
**Opération** : c'est la même chose, un élément concret et exécutable (un chiffre, une
exigence, une ligne de code, un test, une commande).

Emplois admis : « appliquer ISTO », « la cascade ISTO », « le test rétro ISTO », « une
rupture ISTO » (une opération qui ne remonte à aucune intention).

## Le fait fondateur

L'étude d'opportunité DataForSEO du 01/09 (20260901a) a répondu aux huit questions écrites de
sa candidature, rendu un verdict chiffré, passé ses contrôles de forme — et son destinataire
l'a refusée, mot pour mot : *« Le problème est que cette étude n'explique rien. Je ne sais pas
ce qu'on peut faire avec ces outils, les datas qu'ils permettent de récolter, pour quels
usages, avec quels intérêts, pourquoi 6 marchés et pas 7, quelles profondeurs, quels
périmètres ? »* Le défaut n'était pas dans l'exécution mais dans la **définition** : les
questions écrites étaient déjà tactiques et opérationnelles, et l'intention de l'utilisateur —
*comprendre pour décider lui-même* — n'était écrite nulle part. Répondre à la lettre d'une
demande peut donc échouer complètement à la servir.

## La règle, mot pour mot (retour humain du 01/09)

> « Intention > Stratégie > Tactique > Opérationnel, puis test rétro dans l'autre sens pour
> s'assurer que le résultat correspond à l'intention initiale de l'utilisateur. À appliquer
> sur tous types de demande, pas uniquement sur les études d'opportunité. »

## Les quatre niveaux, à la descente

1. **Intention** — ce que l'utilisateur cherche à obtenir, écrit **dans ses mots** (cité,
   jamais seulement reformulé). Si elle est reconstruite par l'agent, elle est **validée par
   l'utilisateur avant d'exécuter** — jouer un travail sur une intention devinée reproduit le
   défaut fondateur. L'intention est souvent un entonnoir ou une capacité (« comprendre pour
   décider »), pas la question littérale posée.
2. **Stratégie** — les décisions ou effets que le livrable doit permettre. C'est le manque
   (de donnée, de capacité, de preuve) qui définit le besoin — jamais l'offre d'un outil ou
   la commodité de l'agent.
3. **Tactique** — les moyens choisis, **chaque choix expliqué et justifié avec son
   alternative écartée** : un nombre de périmètre (« 6 marchés »), une profondeur, une
   cadence se motivent (« pourquoi 6 et pas 7 »). Un choix non justifié est une dette de
   confiance : le lecteur ne peut ni le contester ni se l'approprier.
4. **Opération** (« opérationnel » jusqu'à 1.1.0) — les chiffres, coûts, câblages, seuils,
   exigences, lignes de code, tests, commandes. Chaque élément cite la ligne tactique qu'il
   sert ; ce qui ne sert rien est retiré.

## Le test rétro, à la remontée — avant toute restitution

Depuis **chaque opération**, remonter sans rupture : Opération → Tactique → Stratégie →
Intention. Une rupture de chaîne = un élément retiré, ou sa présence justifiée
par écrit. Deux vérifications complètent la remontée : les questions posées par l'utilisateur
(explicites ou dans un retour) sont **rejouées une à une** contre le livrable ; et tout terme
de domaine porte sa glose à son premier emploi — un lecteur qui ne connaît pas le domaine
doit pouvoir juger (même raisonnement que S9/S20/S23 des restitutions : une information non
comprise a le même effet qu'une information tue).

Le test rétro joue aussi **dans l'autre sens** : depuis chaque tactique et chaque stratégie,
redescendre vers ses opérations. Un niveau supérieur qu'aucune opération ne réalise est une
promesse non tenue, aussi grave qu'une opération orpheline.

## La validation de l'intention, et sa trace

L'intention est le seul niveau qu'aucun oracle ne peut juger sur le fond ; sa validation humaine
est donc le seul contrôle du fond, et **un contrôle sans trace n'a pas eu lieu**. La validation
se prouve par une pièce opposable, jamais par « l'utilisateur a dit oui » :

- chez un produit, une entrée `question_humain` du ledger cite l'intention (citation +
  reformulation), et l'entrée `reponse_humain` qui la valide porte son numéro de séquence ; ou une
  décision numérotée (« D-N (a) ») dont la restitution a porté la reformulation ;
- la cascade du produit (format commun ci-dessous) la nomme dans `intention.validation` :
  `date`, `par`, `trace` — la séquence de ledger ou la décision ;
- une intention qui change se **revalide** de la même façon : la validation précédente ne couvre
  pas la nouvelle.

Hors produit (mandat, étude, conseil), la trace est la question et sa réponse citées dans la
restitution qui les a portées (S51 juge la présence de l'intention au bloc 1).

## Ce qui borne la cascade : contraintes, non-objectifs, parties prenantes

Trois choses ne sont ni une stratégie ni une tactique, et toutes trois cassent une chaîne si
elles ne sont écrites nulle part :

- **Les contraintes** — budget, droit (RGPD, AI Act), sécurité, plateforme, délai. Elles ne
  servent pas l'intention, elles la bornent : une tactique qui en viole une est écartée quel que
  soit son effet. Chacune porte sa source.
- **Les non-objectifs** — ce que le produit ne cherche PAS à faire, avec leur motif. Ils arrêtent
  la dérive de périmètre avant qu'elle ne devienne une exigence, et ils se déclarent : une liste
  vide vaut « aucun », l'omission ne vaut rien.
- **Les parties prenantes** — dès que deux intentions coexistent (un cabinet et ses clients, un
  commanditaire et l'utilisateur final), un **arbitrage** écrit dit laquelle prime et ce qui est
  garanti à l'autre. Sans lui, deux tactiques servent deux intentions opposées et la cascade est
  incohérente sans qu'aucune remontée ne casse.

## Des stratégies mesurables

Une stratégie sans mesure ne se vérifie jamais : le test rétro de la mise en production
(« l'effet promis est-il là ? ») n'a alors rien à lire. Chaque stratégie porte donc :

- un **indicateur structuré** — formule, numérateur, **dénominateur**, source de la mesure (même
  règle que D9 de la fiche de conception : une mesure dit son dénominateur) ;
- sa **valeur actuelle** — mesurée (valeur, date, source rejouable), ou déclarée non mesurée avec
  son motif ; jamais devinée ;
- sa **cible** — fixée, ou par jalons quand la valeur de départ est inconnue (« jalon 1 : mise en
  service ; jalon 2 : la valeur du premier mois mesuré, sans descendre ensuite »). Une cible
  « à fixer » se mesure (M1) sans bloquer : elle dit ce qui reste à décider.

## ISTO à chaque phase du développement logiciel

Chaque phase d'un run reçoit les niveaux supérieurs **comme donnés** et produit son propre
niveau d'Opération ; elle ne réécrit jamais l'intention en silence. Une phase qui découvre
que l'intention reçue est fausse ou incomplète **remonte** (retour au ledger, question à
l'humain) au lieu de corriger en aval. Le test rétro se joue à la sortie de chaque phase,
sur ses propres opérations, et une dernière fois à la clôture, de bout en bout.

Comment lire le tableau : une ligne par phase, dans l'ordre d'un run (fiche produit, conception,
design, implémentation, tests, déploiement), puis les quatre phases transverses (sécurité,
données, exploitation, référencement), qui courent en parallèle des autres, et la clôture.
Les colonnes vont du niveau le plus haut au plus bas : la colonne « Intention » dit si la phase
la pose ou la reçoit, la colonne « Opération » nomme ce que la phase produit (et, entre accents
graves, le type d'élément qui le déclare dans la cascade), la dernière colonne dit la question
à jouer avant de quitter la phase. Les phases hors logiciel (étude, mandat, conseil) n'y
figurent pas : la grille de profondeur plus bas les couvre.

| Phase | Intention (reçue ou posée) | Stratégie | Tactique | Opération | Test rétro de sortie |
|---|---|---|---|---|---|
| **Fiche produit / qualification de l'entrant** | posée ICI, citée dans les mots du demandeur et validée par lui (`DEMANDE-PRODUIT.md`, `ENTRANT.md`) | les effets attendus chez l'utilisateur final : ce qui doit devenir possible, plus rapide, plus sûr | le périmètre retenu (MVP, V1, V2) et ce qui est écarté, chaque choix avec son alternative | le seuil de suffisance, les questions ouvertes indicées | chaque élément du périmètre répond-il à un effet visé, et chaque effet à l'intention citée ? |
| **Conception** | reçue de la fiche produit | stratégies écrites en effets mesurables, chacune avec son indicateur | tactiques : les capacités du produit qui produisent l'effet, justifiées | **les exigences** (`EXIGENCES.json`), chacune rattachée à une tactique et à une seule, critère d'acceptation binaire ou chiffré | aucune exigence orpheline, aucune tactique sans exigence, aucune stratégie sans tactique (porte de cascade) |
| **Design** | reçue | l'expérience visée : ce que l'utilisateur doit ressentir et comprendre | direction artistique, parcours, hiérarchie de l'information, choix de marque justifiés (`DESIGN.md`) | jetons (`tokens.css`), écrans de maquette, états, textes d'interface | chaque écran sert-il un parcours, chaque parcours une tactique ? un écran qui ne sert rien est retiré |
| **Implémentation** | reçue | l'architecture qui rend les tactiques possibles et durables (ce qui doit rester simple, ce qui doit tenir la charge) | découpage en composants, choix de technologies, chacun avec l'alternative écartée (`ARCHITECTURE.md`, `TECHNOS.md`) | le code, les migrations, la configuration ; chaque modification cite l'exigence qu'elle sert | chaque fichier modifié remonte à une exigence ; un ajout sans exigence est soit retiré, soit déclaré et rattaché |
| **Tests** | reçue | la confiance à établir avant de livrer : ce dont la défaillance coûterait le plus à l'intention | la stratégie de test : niveaux, risques couverts en premier, ce qui n'est pas testé et pourquoi | les cas de test, chacun citant son exigence ; les campagnes et leurs rapports | 100 % des exigences MVP citées par un test ; et à l'envers, un test vert sur une exigence qui ne sert plus l'intention ne prouve rien |
| **Déploiement (MEP)** | reçue | la mise à disposition sans rupture du service rendu à l'utilisateur | la route de déploiement (staging, qualification, GO humain), le plan de retour arrière, la fenêtre | les commandes, les variables, la vérification après lancement (`DOSSIER-MEP.md`) | le service en production rend-il l'effet promis à l'intention, mesuré sur les indicateurs des stratégies, et pas seulement « l'application répond » ? |
| **Sécurité** (transverse : forge-websec, forge-agents-security) | reçue | ce dont la compromission coûterait le plus à l'intention (données de tiers, accès, réputation) | les mesures retenues contre chaque menace, avec l'alternative écartée ; les contraintes de sécurité de la cascade | contrôles, en-têtes, droits, scans — éléments `controle_securite` | chaque contrôle protège-t-il un actif que l'intention rend précieux ? un contrôle sans actif est du bruit, un actif sans contrôle une faille |
| **Données** (transverse : forge-data) | reçue | quelles données l'intention rend nécessaires, et lesquelles elle n'exige pas | lignage, qualité, conservation, minimisation | flux, schémas, règles de qualité — éléments `flux_donnees` | chaque donnée collectée sert-elle une stratégie ? une donnée sans usage est un coût et un risque |
| **Exploitation et observabilité** (forge-ops, forge-observability) | reçue | savoir à temps si l'effet promis se dégrade | quels signaux suivre, à quel seuil, qui alerter | sondes, tableaux de bord, alertes — éléments `indicateur_exploitation`, qui lisent les indicateurs des stratégies | chaque indicateur de stratégie a-t-il sa sonde en production ? sinon le test rétro de clôture est aveugle |
| **Référencement** (forge-seo-geo, sur mandat) | reçue | être trouvé par ceux que l'intention vise | requêtes et marchés retenus, avec l'alternative écartée | pages, balises, contenus — éléments `page_referencement` | chaque page sert-elle une requête que l'intention vise ? |
| **Clôture, exploitation et run de version** | reçue, puis **re-confrontée** à la mesure réelle | les écarts entre l'effet promis et l'effet mesuré | ce qu'on corrige, ce qu'on assume, ce qu'on remonte aux forges | retours au ledger, lot de retours, brief delta du run suivant | la restitution de clôture cite l'intention initiale et dit, chiffres à l'appui, si elle est servie (S51) ; un écart ouvre le run de version suivant |

**Ce qui ne se délègue pas.** Seule la fiche produit POSE l'intention ; toutes les autres
phases la REÇOIVENT. Une stratégie, une tactique ou une exigence ajoutée en cours de route se
rattache dans le même tour à un niveau supérieur existant, ou fait remonter la question à
l'humain : *une opération sans parent est une rupture ISTO.*

**Les identifiants qui portent la chaîne.** Les exigences sont les opérations de la
conception ; les autres phases déclarent les leurs comme **éléments typés** d'une tactique
(`ecran`, `composant`, `test`, `commande_mep`, `indicateur_exploitation`, `controle_securite`,
`flux_donnees`, `page_referencement`, `document`, `autre`). Les tests citent l'identifiant de
l'exigence, les commits et les retours citent l'exigence ou la décision, un écran de maquette
porte l'identifiant de son élément. C'est cette chaîne d'identifiants qui rend le test rétro
**exécutable** au lieu de déclaratif.

## Le format commun de la cascade, et son juge

Un produit tient sa cascade dans **une source unique** au format `pilot/cascade-isto@1`,
gabarit `gabarits\CASCADE-ISTO.json`, rangée sous `forge\etapes\conception\cascade\CASCADE.json`
(sa vue lisible, s'il en a une, se génère et ne s'édite jamais à la main). Le référentiel
d'exigences garde sa forme : c'est la cascade qui cite les exigences, pas l'inverse.

Le juge est `oracles\oracle-cascade-isto.mjs`, la moitié **structurelle** du test rétro,
mécanisée :

```
node <PILOT_ROOT>/oracles/oracle-cascade-isto.mjs <CASCADE.json> --exigences <EXIGENCES.json> --tests <dossier des tests>
```

Il bloque (F1, U1, I1 à I4, S1 à S3, T1 à T4, O1, H1, H2) : format, identifiants uniques,
intention citée et **validée avec sa trace**, arbitrage entre parties prenantes, contraintes et
non-objectifs déclarés, indicateur structuré et valeur actuelle de chaque stratégie, stratégie
servie, tactique justifiée avec son alternative, rattachée et opérée, exigence rattachée à une
tactique et à une seule, historique versionné avec le niveau touché, retrait motivé. Il mesure
sans bloquer : cibles à fixer (M1), justifications reconstruites (M2), exigences qu'aucun test
ne cite (M3), stratégies non mesurées (M4). Il se joue à la sortie de la conception, à chaque
run de version et avant la clôture.

## Profondeur — proportionnée à la demande

La question se pose toujours ; la quantité d'écrit, non.

| Demande | Ce qu'ISTO exige | Où cela s'écrit |
|---|---|---|
| Question simple, explication | une phrase d'intention et son test rétro | bloc 1 de la restitution (S51) |
| Correction d'anomalie | rattacher la correction à l'exigence existante qu'elle rétablit ; aucune nouvelle cascade | le retour au ledger et le commit citent l'exigence |
| Document à enjeu, étude, mandat | les quatre niveaux, rédigés | la fiche de conception (D8) ou la section « Intention » de l'étude (E9, E10) |
| Évolution d'un produit (run de version) | le delta : éléments ajoutés, modifiés ou retirés, et le plus haut niveau touché | la cascade du produit, mise à jour en place, et une entrée d'`historique` qui porte le niveau (H1) |
| Nouveau produit | la cascade complète, intention validée avant la première exigence | `CASCADE.json` au format commun, oracle vert |

Dans le doute entre deux lignes, la plus haute s'applique ; en cas de doute sur l'intention, on
demande — c'est le seul aller-retour qui coûte moins qu'il ne rapporte.

## Quand la cascade change

Un changement se propage **vers le bas, jamais en silence** :

1. **Déclarer le niveau touché.** Le brief d'un run de version dit le plus haut niveau ISTO qu'il
   modifie (I, S, T ou O) ; la cascade ajoute une entrée d'`historique` qui le porte, avec la
   décision qui l'a voulu (H1).
2. **Retirer sans effacer.** Un élément qui sort garde sa place, marqué `retiree`, avec son motif
   ou son remplaçant (H2). Ses enfants encore actifs deviennent des **ruptures** (T2) : chacun se
   rattache ailleurs ou se retire à son tour.
3. **Élaguer l'aval.** Une exigence retirée entraîne le retrait, ou le rattachement explicite,
   de son code, de ses tests et de ses écrans ; un test vert sur une exigence retirée ne prouve
   rien et se supprime.
4. **Revalider** l'intention si c'est elle qui change (section « La validation de l'intention »).

Plus le niveau touché est haut, plus l'aval à rejouer est large : une opération touchée se
rejoue seule, une tactique touchée rejoue ses exigences et leurs tests, une stratégie touchée
rejoue ses indicateurs et ses cibles, une intention touchée rouvre la conception.

## Exemples

**Chaîne tenue.** Intention : « gagner du temps sur le courrier sans rien perdre » (citée,
validée par décision). Stratégie : le collaborateur relit au lieu d'écrire — indicateur
« brouillons déposés ÷ mails entrants typés », valeur actuelle 0 sur 14, cible par jalons.
Tactique : déposer un brouillon plutôt qu'envoyer, alternative écartée « envoi automatique »,
justifiée par le brief. Opérations : les exigences du dépôt de brouillon, chacune citée par un
test. Chaque test remonte à l'intention en quatre pas.

**Rupture.** Un écran de statistiques détaillées est ajouté en cours de développement parce
qu'il « pourrait servir ». Il ne cite aucune tactique ; remonté, il ne sert aucune stratégie, et
l'indicateur qu'il affiche n'est celui d'aucune stratégie. Verdict ISTO : rupture. L'écran se
retire, ou une tactique et son indicateur sont proposés à l'humain, qui décide. Le coder
d'abord et le justifier après, c'est le défaut fondateur à l'échelle d'un écran.

Première application à un produit : la cascade d'un produit du parc du 02/10/2026
(1 intention, 5 stratégies, 15 tactiques, chaque exigence rattachée à une tactique et à une
seule), écrite à son propre format avant que le format commun n'existe ; sa migration est le
premier usage de l'oracle.

## Portée — tous types de demande

Études d'opportunité, runs produit, mandats transverses, runs de conseil, code : partout où
un livrable répond à une demande humaine. La profondeur suit la grille ci-dessus, mais la
question se pose toujours : *le résultat sert-il l'intention, ou la lettre ?*

## Contrôles

- **Études d'opportunité** : `oracles\oracle-etude-opportunite.mjs` — **E9** (section
  « Intention de l'utilisateur » présente, citation dans les mots du demandeur) et **E10**
  (test rétro présent et joué). Gabarit porteur : `gabarits\ETUDE-OPPORTUNITE.md`.
- **Restitutions — tout message de fin de traitement** (décision du 08/09, option 1 ; TF-0791) :
  `oracles\oracle-synthese.mjs` **S51**, depuis le 17/09/2026 — le bloc 1 porte l'intention
  initiale de la demande et son test rétro ; un écart s'écrit au bloc 6. Présence des deux pièces,
  jamais leur justesse. Gabarit porteur : `gabarits\RESTITUTION.md`, bloc 1.
- **Cascade d'un produit** (depuis le 03/10/2026, 2.0.0) : `oracles\oracle-cascade-isto.mjs`
  — la chaîne structurelle de bout en bout, la validation tracée, les indicateurs, l'historique
  (section « Le format commun de la cascade »). Gabarit porteur : `gabarits\CASCADE-ISTO.json`.
- **Le fond n'est pas mécanisable** et c'est déclaré : aucun oracle ne mesure qu'une
  remontée est *juste*, ni qu'une intention citée est *la vraie*. La validation de
  l'intention par l'utilisateur (niveau 1) est le seul contrôle du fond — humaine, et tracée
  (I2 exige la trace, jamais sa justesse).

Première application : cadrage v2 puis étude v2 « données de recherche » du 01/09/2026
(`output\03-etudes\`). Mise à jour = nouvelle version + date.
