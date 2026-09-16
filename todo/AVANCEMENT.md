---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau e4f789376dfb)]
verifie_le: 2026-09-16
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `e4f789376dfb`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Lecture |
|---|---|---|
| Ouverts | 58 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 310 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 3 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 371 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 23 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1153 | pilot : une valeur, une heure et une date s'ecrivent en chiffres — E-3 exigeait « un chiffre » sans dire sous  | candidat | digit-ai-factory | 15 |
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | en_cours | digit-ai-factory | 10 |
| TF-0965 | pilot : propager les skills a casse un test d'une forge voisine — une regle neuve du socle est mesuree sur le  | en_cours | digit-ai-factory | 10 |
| TF-1018 | parc : UN SEUL depot sur six a une CI hebergee — le pilot, qui porte la doctrine et 104 oracles, n en a AUCUNE | en_cours | digit-ai-factory | 10 |
| TF-1136 | pilot / quality-oracles : le domaine « Cadence de mission » est jugé par DEUX oracles homonymes — oracles/orac | decide | digit-ai-factory | 10 |
| TF-1149 | digit-ai-factory : la proscription de la tournure « Ce que » n'est descendue ni dans le plancher d'écriture, n | en_cours | digit-ai-factory | 10 |
| TF-1150 | digit-ai-factory : le lexique du destinataire est borné au produit alors que l'humain proscrit « grain » pour  | decide | digit-ai-factory | 10 |
| TF-1140 | digit-ai-factory : quatre classes creees le 3 septembre se reproduisent le 15 septembre dans un livrable neuf, | decide | digit-ai-factory | 8.3 |
| TF-1105 | Produit-66 : le contrôle exécutable de la règle de transparence des contenus générés (article 50), scr | decide | digit-ai-factory | 7.5 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |
| TF-0983 | pilot : les vues generees du registre sont versionnees — 1173 revisions de contenu derive, qui transforment UN | en_cours | digit-ai-factory | 6.7 |
| TF-1031 | produit digit-ai-communication : un registre date des issues d appels d offres et de propales (gagne, perdu, s | decide | digit-ai-factory | 6 |
| TF-1088 | oracle-conformite-projet R-23 lit la fiche d acces mais jamais la page de connexion servie : des identifiants  | decide | digit-ai-factory | 6 |
| TF-1078 | heritage des produits : 39 manques sur 11 produits au releve d ouverture du 14/09 — un oracle ne d un defaut n | decide | digit-ai-factory | 4.5 |
| TF-1090 | reste archive TF-0616 : 14 porteurs de secrets hors perimetre chez les produits, dont des fichiers publies sur | decide | digit-ai-factory | 4.5 |
| TF-1029 | pilot (gabarits/documents) : quatre familles de gabarits absentes du catalogue — kit partenaire, charte de par | en_cours | digit-ai-factory | 4 |
| TF-0923 | pilot : six volets d'oracle proposés par les items du 08/09 restent non livrés, cinq d'entre eux vivant dans l | en_cours | digit-ai-factory | 3 |
| TF-1097 | conception documentaire amont : une fiche courte remplie par l agent AVANT chaque document (intention D8, lect | en_cours | digit-ai-factory, digit-ai-forge-design | 3 |
| TF-1079 | semer des defauts : 7 classes sur 74 sans controle declare, et aucune preuve de rappel pour les 67 autres avan | en_cours | digit-ai-factory | 2 |
| TF-1081 | reste archive TF-0523 : le sceau d un livrable est pose a la main, pas a la fin d un run d oracles — un livrab | en_cours | digit-ai-factory | 2 |
| TF-0836 | pilot : le hook qo-gate-write juge un template de maquette comme un livrable | en_cours | digit-ai-factory | 1 |
| TF-1070 | digit-ai-factory : le domaine << style redactionnel >> entre au registre sans declencheur automatique, faute d | en_cours | digit-ai-factory | 1 |

### digit-ai-forge-agents — 13 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1030 | forge-design / forge-agents : la transparence des contenus generes (AI Act article 50, en vigueur depuis le 20 | en_cours | digit-ai-forge-design, digit-ai-forge-agents | 9 |
| TF-0940 | digit-ai-forge-agents / digit-ai-forge-audit : deux implémentations du schéma de base de données coexistent (r | en_cours | digit-ai-forge-agents, digit-ai-forge-audit | 6.7 |
| TF-1152 | digit-ai-forge-agents : le lexique du destinataire n'est joué sur aucun texte de présentation PowerPoint (RA-0 | decide | digit-ai-forge-agents | 6 |
| TF-1006 | parc : le registre des oracles a ete ETENDU dans la copie INSTALLEE d un skill, jamais dans sa source versionn | en_cours | digit-ai-forge-agents | 4.5 |
| TF-1023 | forge-design / forge-agents : la marque Digit-AI est portee par deux chartes contradictoires (pptx : Montserra | en_cours | digit-ai-forge-design, digit-ai-forge-agents | 4.5 |
| TF-1026 | forge-agents (digit-ai-propale) : construire de facon outillee le referentiel d exigences depuis un reglement  | en_cours | digit-ai-forge-agents, digit-ai-forge-conception | 4.5 |
| TF-1066 | forge-design / socle page-html : aucune regle ne fixe la largeur de CONCEPTION par defaut d un ecran de bureau | en_cours | digit-ai-forge-design, digit-ai-forge-agents, digit-ai-forge-development | 4.5 |
| TF-1027 | forge-agents : un skill de rendu DOCX/PDF a trame imposee, frere de digit-ai-pptx, sous les gates de PRODUCTIO | en_cours | digit-ai-forge-agents | 3 |
| TF-1028 | forge-agents (la-barre) : trois barres externes pour les livrables de communication — propale privee, memoire  | en_cours | digit-ai-forge-agents | 3 |
| TF-1032 | forge-agents : digit-ai-propale et digit-ai-propale-review restent NON CONFORMES a run-oracles sur des defauts | en_cours | digit-ai-forge-agents | 3 |
| TF-1064 | quality-oracles : le style redactionnel des textes de la Factory n est juge par aucun oracle deterministe du r | en_cours | digit-ai-forge-agents, digit-ai-forge-design | 3 |
| TF-1082 | restes archives TF-0679 et TF-0681 : une recette peut rester verte sans exercer le sens rouge de son controle, | en_cours | digit-ai-forge-agents | 2 |
| TF-1084 | restes archives TF-0650, TF-0657, TF-0579 : la justesse d une preuve rejouee n est pas jugee, seulement sa pre | en_cours | digit-ai-forge-agents, digit-ai-forge-seo-geo, digit-ai-forge-ops | 2 |

### digit-ai-forge-design — 10 item(s)

Les items ouverts ciblant digit-ai-forge-design, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1139 | digit-ai-page-html : render_page.py ne juge aucune famille d image au-dela d une certaine hauteur de page, et  | decide | digit-ai-forge-design | 20 |
| TF-1141 | digit-ai-page-html : check_html.py rend PASS sans publier son perimetre de non-mesure, et deux verdicts verts  | decide | digit-ai-forge-design | 10 |
| TF-1030 | forge-design / forge-agents : la transparence des contenus generes (AI Act article 50, en vigueur depuis le 20 | en_cours | digit-ai-forge-design, digit-ai-forge-agents | 9 |
| TF-1074 | controle manquant : deux fichiers declares VARIANTES (logo et logo-white, favicon clair et sombre) a empreinte | en_cours | digit-ai-forge-design | 6 |
| TF-1023 | forge-design / forge-agents : la marque Digit-AI est portee par deux chartes contradictoires (pptx : Montserra | en_cours | digit-ai-forge-design, digit-ai-forge-agents | 4.5 |
| TF-1066 | forge-design / socle page-html : aucune regle ne fixe la largeur de CONCEPTION par defaut d un ecran de bureau | en_cours | digit-ai-forge-design, digit-ai-forge-agents, digit-ai-forge-development | 4.5 |
| TF-1064 | quality-oracles : le style redactionnel des textes de la Factory n est juge par aucun oracle deterministe du r | en_cours | digit-ai-forge-agents, digit-ai-forge-design | 3 |
| TF-1087 | render_page.py V9 retient le MEILLEUR pixel d un actif : un logo bicolore dont 90 % de la surface est de la co | en_cours | digit-ai-forge-design | 3 |
| TF-1097 | conception documentaire amont : une fiche courte remplie par l agent AVANT chaque document (intention D8, lect | en_cours | digit-ai-factory, digit-ai-forge-design | 3 |
| TF-1093 | restes archives TF-0480 et TF-0493 : les controles visuels et d interaction ne sont jamais joues sur une insta | en_cours | digit-ai-forge-tests, digit-ai-forge-design | 1.3 |

### digit-ai-page-html — 6 item(s)

Les items ouverts ciblant digit-ai-page-html, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1147 | digit-ai-page-html : une reference SVG valide dans le FICHIER et cassee dans l INSTANCE SERVIE — sept schemas  | decide | digit-ai-page-html | 25 |
| TF-1148 | digit-ai-page-html : la revue de lecture est declaree OBLIGATOIRE avant toute livraison et aucun des trois scr | decide | digit-ai-page-html | 25 |
| TF-1144 | digit-ai-page-html : la regle d impression que L16 PRESCRIT dans son message de refus fait echouer L1 sur six  | decide | digit-ai-page-html | 12.5 |
| TF-1143 | digit-ai-page-html : le facteur d echelle --scale de render_page.py, documente comme une aide a la capture, RE | decide | digit-ai-page-html | 10 |
| TF-1145 | digit-ai-page-html : L6 et la famille sommaire_perdu lisent le MEME premier nav du document, et leurs deux exi | decide | digit-ai-page-html | 6.7 |
| TF-1146 | digit-ai-page-html : data-overlap-ok eteint V4 sur l element entier, et V4 mesure un recouvrement de rectangle | decide | digit-ai-page-html | 4 |

### pilot — 2 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |
| TF-0791 | Cascade Intention > Strategie > Tactique > Operationnel + test retro : la definition des demandes ne capture p | en_cours | pilot | 6.7 |

### forge-tests — 2 item(s)

Les items ouverts ciblant forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0749 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention | en_cours | forge-tests | 10 |
| TF-0748 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois | en_cours | forge-tests | 5 |

### digit-ai-forge-audit — 2 item(s)

Les items ouverts ciblant digit-ai-forge-audit, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1020 | forge-audit : sur le runner Linux la fiche PDF sort sur DEUX pages au lieu d une et le juge la refuse (P3), pe | en_cours | digit-ai-forge-audit | 9 |
| TF-0940 | digit-ai-forge-agents / digit-ai-forge-audit : deux implémentations du schéma de base de données coexistent (r | en_cours | digit-ai-forge-agents, digit-ai-forge-audit | 6.7 |

### factory — 2 item(s)

Les items ouverts ciblant factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0963 | factory : les trois pieces de la doctrine peuvent etre toutes presentes et conformes chez le produit et ne JAM | decide | factory | 1 |
| TF-1047 | factory : une session a racine ENGLOBANTE echappe au hook de restitution et livre une sortie non jugee (recidi | decide | factory | 1 |

### digit-ai-forge-conception — 2 item(s)

Les items ouverts ciblant digit-ai-forge-conception, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1026 | forge-agents (digit-ai-propale) : construire de facon outillee le referentiel d exigences depuis un reglement  | en_cours | digit-ai-forge-agents, digit-ai-forge-conception | 4.5 |
| TF-1094 | reste archive TF-0664 : sept des dix etapes de la chaine de traduction et d audit d un produit ne sont ecrites | en_cours | digit-ai-forge-tests, digit-ai-forge-conception | 1.3 |

### digit-ai-forge-development — 2 item(s)

Les items ouverts ciblant digit-ai-forge-development, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1042 | socle de la chaine : la parite entre l'environnement de test et l'image servie n'est controlee nulle part — CI | en_cours | digit-ai-forge-development, digit-ai-forge-ops | 10 |
| TF-1066 | forge-design / socle page-html : aucune regle ne fixe la largeur de CONCEPTION par defaut d un ecran de bureau | en_cours | digit-ai-forge-design, digit-ai-forge-agents, digit-ai-forge-development | 4.5 |

### digit-ai-forge-ops — 2 item(s)

Les items ouverts ciblant digit-ai-forge-ops, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1042 | socle de la chaine : la parite entre l'environnement de test et l'image servie n'est controlee nulle part — CI | en_cours | digit-ai-forge-development, digit-ai-forge-ops | 10 |
| TF-1084 | restes archives TF-0650, TF-0657, TF-0579 : la justesse d une preuve rejouee n est pas jugee, seulement sa pre | en_cours | digit-ai-forge-agents, digit-ai-forge-seo-geo, digit-ai-forge-ops | 2 |

### digit-ai-forge-data — 2 item(s)

Les items ouverts ciblant digit-ai-forge-data, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1151 | digit-ai-forge-data : « grain » reste dans la prose du README et du CLAUDE.md, recopié par un producteur (RD-0 | decide | digit-ai-forge-data | 15 |
| TF-1044 | forge-data : la correction TF-0936 garde << grain >> dans un registre machine (commentaires DDL, messages d'or | en_cours | digit-ai-forge-data | 10 |

### digit-ai-forge-tests — 2 item(s)

Les items ouverts ciblant digit-ai-forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1093 | restes archives TF-0480 et TF-0493 : les controles visuels et d interaction ne sont jamais joues sur une insta | en_cours | digit-ai-forge-tests, digit-ai-forge-design | 1.3 |
| TF-1094 | reste archive TF-0664 : sept des dix etapes de la chaine de traduction et d audit d un produit ne sont ecrites | en_cours | digit-ai-forge-tests, digit-ai-forge-conception | 1.3 |

### digit-ai-forge-seo-geo — 1 item(s)

Les items ouverts ciblant digit-ai-forge-seo-geo, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1084 | restes archives TF-0650, TF-0657, TF-0579 : la justesse d une preuve rejouee n est pas jugee, seulement sa pre | en_cours | digit-ai-forge-agents, digit-ai-forge-seo-geo, digit-ai-forge-ops | 2 |

## Hors de portée de ce rapport

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

