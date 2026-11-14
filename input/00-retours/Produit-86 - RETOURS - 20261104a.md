# Retours forges — Produit-86 — 20261104a

- **Contexte** : revue du porteur du 04/11/2026 sur la préproduction (neuf remarques, six captures) et instruction D-49 « Active les dès maintenant avec les APIs OpenAI fournies et avec un Docker en local sur ce poste », run 20261104a-evolution-ergonomie-ia-execution
- **Références ledger** : `forge\ledger.jsonl` seq 373 (instruction du porteur), 374 (ouverture du run), 375 à 380 (entrées `type: retour`), 400 (retour RO-3), 372 (retour du run 20261103e, joint à ce lot)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\`.
  Statut : `a_remettre` → `remis le <date>` (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : remis le 04/11/2026

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un
aller-retour ou une découverte par lecture de code) · **mineur** (confort/précision).

## Rattachement

Registre interrogé le 04/11/2026 :
- `grep -ciE "filtre.*(doublon|deux fois)|cases? à cocher" todo/TODO.jsonl` → 5 lignes trouvées (TF-0907, TF-1002, TF-1287…), aucune sur un filtre doublé ou un filtre de colonne aux valeurs uniques ; `grep -ciE "visite guid|onboarding.*bulle|infobulle"` → 43 lignes, dont TF-0928 et TF-0934 (infobulles de dictionnaire de colonnes), aucune sur une visite guidée exigée. RP-7 propose sa classe.
- `grep -ciE "instruction.*(option|décision).*doctrine|reformuler.*instruction"` → 0 ligne trouvée. RP-8 propose sa classe.
- `grep -ciE "relecture.*(clé|secret)|livrables\.md.*secret"` → 0 ligne trouvée. RP-9 propose sa classe.
- `grep -ciE "FORGE_TESTS_APP|sonde API muette"` → 2 lignes trouvées, TF-0839 (greffe qui fige moteur et réglages) et TF-1781 (section « Contrat du projet audité »), autres défauts. RT-12 propose sa classe.
- `grep -ciE "alignement.*(details|panneau|menu)|T4-2"` → 3 lignes trouvées, dont TF-1762 (« T4-2 : non vide lu comme un état vide ») : la moitié T4-2 de RD-6 s'y rattache, classe existante `oracle-faux-positif` ; la moitié alignement propose sa classe.
- `grep -ciE "transaction.*(modèle|fournisseur|LLM)|database is locked|pseudonym.*crochet"` → 0 ligne trouvée. RA-2 propose sa classe.
- `grep -ciE "Pool overlaps|ipam_config|plage.*réseau docker"` → 0 ligne trouvée. RO-2 propose sa classe.

## pilot (`digit-ai-factory`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-7 | majeur | générique | Le porteur relève le 04/11 sur la préproduction des défauts d'ergonomie que les oracles du run 20261103d avaient laissés passer (critique PASS, textes 11/11, `oracle-filtres-tableau` PASS) : une barre de filtres à listes déroulantes qui double les filtres de colonne du socle, une colonne Mandat dont les valeurs portent une empreinte (55 valeurs pour 3 états), des filtres à choix unique, un en-tête qui défile, aucune visite guidée, des termes (jeton d'agent, job de lab, OBSERVED) sans explication : « alors qu'elles auraient dû être intégrées d'office ». 6 captures, 9 remarques. Ledger seq 375. **RP-7** : clé proposée `ergonomie-d-office-non-exigee`. | `oracle-filtres-tableau` : refuser une colonne filtrée deux fois (liste hors tableau et filtre de colonne) et une colonne filtrable dont le nombre de valeurs approche le nombre de lignes ; `oracle-exploitabilite` : exiger une visite guidée et une infobulle par terme du lexique affiché. |
| RP-8 | majeur | générique | La demande initiale (« Des clés OpenAI sont disponibles… », « pas sur des dockers locaux » au sujet des cibles) a été lue comme interdisant le Docker local aux jobs et réservant l'IA à la qualification ; deux décisions (D-46, D-47) ont été posées en options le 03/11, et le porteur rappelle le 04/11 qu'il attendait l'IA et l'exécution actives sur ce poste. Ledger seq 376. **RP-8** : clé proposée `instruction-lue-comme-option`. | au cadrage, reformuler en une ligne chaque instruction qui touche une doctrine du produit (IA externe, démon Docker) et la faire confirmer avant d'en tirer des options. |
| RP-9 | majeur | générique | `relecture-intention.mjs --preparer fin-de-tour` recopiait dans `livrables.md` le contenu des fichiers écrits par commande, y compris un fichier de clé ignoré par git (`var/secrets/pentest_cle_foundry.cle`) : 1 occurrence de la clé de 84 caractères dans 229 045 octets le 03/11 à 23:15, partant vers l'agent relecteur ; de nouveau 1 occurrence d'un secret dans 329 209 octets le 04/11 à 14:47, caviardée avant délégation. Ledger seq 372. **RP-9** : clé proposée `releve-relit-les-secrets`. | exclure de la relève les fichiers ignorés par git sous `var/`, `secrets/` ou nommés `*.cle`, et passer la relève au caviardage des motifs de secret avant écriture. |

## forge-tests (`digit-ai-forge-tests`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-12 | majeur | générique | L'audit lancé le 04/11 sans `FORGE_TESTS_APP`, `FORGE_TESTS_MUTATION` ni `FORGE_TESTS_QUALIF_URL` rend api 0/150 (« sonde API muette »), back SKIP (« 5 modifications sous le seuil de 10 ») et qualif SKIP, verdict PARTIEL, contre api 144/144 le 03/11 avec ces variables : la configuration d'audit ne vivait que dans la transcription du run précédent. Ledger seq 377. **RT-12** : clé proposée `configuration-d-audit-non-persistee`. | un fichier de configuration d'audit au produit (par exemple `forge/etapes/tests/audit.env`, ou une clé du `PROFIL.json`) que `forge_tests` lit d'office, et un refus explicite quand `FORGE_TESTS_APP` manque sur une application à fabrique, au lieu d'un 0 %. |

## forge-design (`digit-ai-forge-design`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-6 | mineur | générique | `render_page` compte comme une rangée de contrôles les cases d'un menu à cases déplié par l'oracle : « 4 contrôles d'une même rangée sur 3 hauteurs, écart de 60 px » sur `approbations.html`, 7 constats bloquants levés par la seule déclaration `data-alignement-ok`. La moitié T4-2 se rattache à TF-1762 : `oracle-textes-application` lit « Aucun système réel n'est touché », description d'une carte de choix, comme un état vide sans invitation (2 constats le 04/11). Ledger seq 378. **RD-6** : clé proposée `alignement-compte-un-panneau-deplie` (alignement) ; `oracle-faux-positif` (T4-2). | exclure de la règle d'alignement les contrôles d'un panneau déplié (`details[open]`, `[aria-expanded=true]`) ; restreindre T4-2 aux blocs `.vide`, `[data-etat-vide]` ou aux messages seuls dans leur conteneur. |

## forge-agents (`digit-ai-forge-agents`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-2 | majeur | générique | L'agent intégré appelait le modèle dans une transaction SQLite ouverte en écriture (pseudonymes rangés avant l'envoi) : pendant les 5 à 30 s de réflexion du modèle, la fiche mission tombait en 500 « database is locked » (1 erreur au parcours navigateur du 04/11). Et le modèle a recopié les pseudonymes d'actifs sans leurs crochets (« ADRESSE-901c65babe ») : 3 propositions sur 3 refusées `ACTIF_HORS_PERIMETRE` au tour de 09:30. Ledger seq 379. **RA-2** : clé proposée `appel-de-modele-sous-verrou-et-pseudonyme-fragile`. | au gabarit de passerelle de forge-agents : aucun appel de fournisseur sous transaction d'écriture (contrôle statique), et un format de pseudonyme résistant à la reformulation, rétabli par motif et non par égalité de chaîne. |

## forge-ops (`digit-ai-forge-ops`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RO-2 | mineur | générique | Deux réseaux Docker posés par Terraform sur le démon du poste : `172.30.0.0/24` refusé (« Pool overlaps », plage déjà prise par le réseau interne du produit), puis un écart perpétuel d'`ipam_config` (passerelle et adresses auxiliaires complétées par le démon) qui forçait le remplacement du réseau du lab à chaque apply, en échec tant que des conteneurs y étaient attachés : 3 déploiements en échec le 04/11 entre 10:12 et 10:18. Ledger seq 380. **RO-2** : clé proposée `reseau-docker-sans-releve-ni-ignore`. | au gabarit Terraform docker de forge-ops : relever les plages prises avant de choisir, et poser `ignore_changes = [ipam_config]` d'office. |
| RO-3 | majeur | générique | Le frontal nginx de la préproduction (`proxy_pass http://app:8000`) résolvait l'application une seule fois au démarrage : après l'ajout de conteneurs au réseau interne, l'application recréée a changé d'adresse et le frontal a rendu 502 (santé 1/3, 1 déploiement en échec le 04/11 à 12:31). Ledger seq 400. **RO-3** : clé proposée `frontal-resout-l-amont-une-fois`. | au gabarit de frontal nginx de forge-ops : `resolver 127.0.0.11 valid=10s` et `proxy_pass` par variable, d'office. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le modèle Foundry réfléchit parfois plus de 30 s : le frontal (30 s) et le tunnel du proxy (30 s de silence) coupaient le tour de l'agent | tour de l'agent en arrière-plan, la page répond aussitôt ; silence admis porté à 120 s sur la sortie IA | non | réglage de ce produit, prouvé par le parcours navigateur |
| La fiche mission montrait l'empreinte du mandat dans la colonne Mandat du tableau | la colonne ne porte plus que l'état ; l'empreinte reste sur la fiche | non | défaut de ce produit, couvert par E-112 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

| Document | Versions | Verdict |
|---|---|---|
| Dashboard tests (`output/Produit-86 - Dashboard tests - <date><indice>.html`) | copies datées des 03/11 et 04/11, une par audit | reste au produit, parce que c'est la copie datée que forge-tests dépose à chaque audit ; sa forme appartient à la forge (déjà déclaré aux lots 20261103a à 20261103d) |

## Garde-fou de plateforme relevé

Aucun nouveau garde-fou heurté dans ce run. GFP-005 (stratégie de contrôle d'application Windows) reste celui des lots 20261103a à 20261103d.

## Confirmations positives

- La garde du socle (`garde.valider`) a servi telle quelle au lanceur des jobs : la règle testée hors ligne est celle qui filtre chaque création de conteneur sur le démon du poste.
- Le parcours navigateur de forge-tests (Playwright contre l'instance servie) a pris la chaîne entière : mandat pré-rempli, signature, agent IA sur Foundry, approbation, jobs Docker, findings interprétés, 13 parcours sur 13.

## Ordre recommandé

1. RP-7 et RP-8 : le porteur a vu lui-même ce que les oracles n'ont pas vu, et a dû redire sa demande.
2. RA-2 et RT-12 : chacun a coûté un détour mesuré à ce run, et le premier une erreur 500 visible.
3. RP-9 : une clé de fournisseur a quitté le poste vers un agent relecteur.
4. RO-3 : un déploiement en échec, réparé à la main.
5. RD-6 et RO-2 : confort, et des faux constats à lever à la main.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RP-7 et RP-8 suivent un retour humain : la revue du porteur du 04/11. La règle qui les aurait évités : un écran de données ne double jamais un filtre et explique chaque terme qu'il affiche, et une instruction du porteur qui touche une doctrine se fait confirmer avant d'en tirer des options. Les autres sont des frictions de la session pendant le run.

Sept retours n'ont aucune clé du référentiel qui convienne ; chacun propose sa classe :

- **RP-7** : clé proposée `ergonomie-d-office-non-exigee`, famille `affordance-ui`, libellé « Un défaut d'ergonomie qu'un nouvel arrivant voit d'emblée passe tous les oracles du design ».
- **RP-8** : clé proposée `instruction-lue-comme-option`, famille `contrat-interface-forge`, libellé « Une instruction du porteur qui touche une doctrine est transformée en options au lieu d'être confirmée ».
- **RP-9** : clé proposée `releve-relit-les-secrets`, famille `hook-ou-gate`, libellé « La relève d'un tour recopie un fichier de secret vers un agent ».
- **RT-12** : clé proposée `configuration-d-audit-non-persistee`, famille `contrat-interface-forge`, libellé « La configuration d'audit d'un produit ne vit que dans la transcription d'une session ».
- **RA-2** : clé proposée `appel-de-modele-sous-verrou-et-pseudonyme-fragile`, famille `contrat-interface-forge`, libellé « Un appel de modèle tient un verrou d'écriture, et ses pseudonymes ne survivent pas à la reformulation ».
- **RO-2** : clé proposée `reseau-docker-sans-releve-ni-ignore`, famille `contrat-interface-forge`, libellé « Un réseau Docker posé par Terraform ne relève pas les plages prises et dérive à chaque apply ».
- **RO-3** : clé proposée `frontal-resout-l-amont-une-fois`, famille `contrat-interface-forge`, libellé « Un frontal nginx fige l'adresse de son amont au démarrage et rend 502 après sa recréation ».

La moitié alignement de RD-6 propose aussi sa classe : `alignement-compte-un-panneau-deplie`, famille `contrat-interface-forge`, libellé « La règle d'alignement compte les contrôles d'un panneau déplié comme une rangée ».
