---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau e95521468e89)]
verifie_le: 2026-09-01
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `e95521468e89`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 44 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 0 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 0 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 44 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 20 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0713 | pilot : le socle gitignore-produit impose !forge/** , qui RE-INCLUT les secrets ranges sous forge/ | candidat | digit-ai-factory | 25 |
| TF-0714 | pilot : le socle gitignore-produit ignore .env.example, que R-13 exige VERSIONNE | candidat | digit-ai-factory | 25 |
| TF-0709 | pilot : R-19 juge la PRESENCE de versions_forges sans anteriorite, alors qu'il en accorde une a la FORME de se | candidat | digit-ai-factory | 20 |
| TF-0723 | Une formule d'invocation lue comme une tournure : un skill disponible non invoque trois fois, sans laisser de  | candidat | digit-ai-factory, digit-ai-forge-agents | 20 |
| TF-0706 | pilot : deux pieges de l'API Railway a documenter au mode d'emploi de l'etape MEP | candidat | digit-ai-factory, digit-ai-forge-ops | 15 |
| TF-0725 | L'anonymisation a ete cablee a l'ingestion sans mettre a jour les recettes qui ISOLENT leur parc | candidat | digit-ai-factory | 15 |
| TF-0726 | La pseudonymisation de masse a reecrit le membre gauche d'une egalite de test, et l'a rendue autocontradictoir | candidat | digit-ai-factory | 15 |
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0705 | pilot : une URL de production anonyme est produite par la MEP — RT-14 traitait le symptome cote forge-tests | candidat | digit-ai-factory, digit-ai-forge-ops, digit-ai-forge-tests | 12.5 |
| TF-0711 | pilot : un artefact copie_conforme qui bouge chez le pilot met tout le parc en FAIL, et aucun produit ne l'app | candidat | digit-ai-factory | 12.5 |
| TF-0721 | Le perimetre de la mesure n'est pas le perimetre de la conclusion — quatre incidents, une seule erreur | candidat | digit-ai-factory | 12.5 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | decide | digit-ai-factory | 10 |
| TF-0712 | pilot : R-32 n'a pas de forme de journal pour un livrable qui porte des donnees personnelles | candidat | digit-ai-factory, digit-ai-forge-design | 10 |
| TF-0735 | pilot : le principe de connexion a Railway par jeton n'est un artefact d'aucun referentiel de la route MEP — c | candidat | digit-ai-factory, digit-ai-forge-ops | 10 |
| TF-0722 | Des valeurs de contexte ecrites comme des regles — instantane fige, valeur observable gravee, contrainte sans  | candidat | digit-ai-factory | 8 |
| TF-0710 | pilot : un artefact copie_conforme de R-47 revendique un nom generique qu'un produit occupait legitimement | candidat | digit-ai-factory | 7.5 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |
| TF-0704 | pilot : l'etape MEP pilote Railway par le CLI, qui ne sait ni renommer un service ni corriger un domaine | candidat | digit-ai-factory, digit-ai-forge-ops | 6.7 |
| TF-0684 | Six recettes échappent à toute mesure rétrospective : leur idiome de déclaration de cas n'est reconnu par rien | decide | digit-ai-factory | 5 |
| TF-0734 | La porte parle trop : les surfaces pre-authentification se jugent du point de vue de l'inconnu | candidat | digit-ai-factory | 1 |

### pilot — 7 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0731 | pilot : `racine_produit` declare par un sidecar n'est JAMAIS lu — la voie recommandee par TF-0555 est morte de | candidat | pilot | 15 |
| TF-0738 | pilot : le cliquet des recettes lit le PREMIER ratio de la ligne de resume — une date a barre oblique dans le  | candidat | pilot | 15 |
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |
| TF-0732 | poste : le gate d'ecriture C7 juge le FICHIER ENTIER, pas le delta — et sa regle « DM Sans bannie » contredit  | candidat | pilot | 10 |
| TF-0730 | pilot : un produit a heritage CONFORME ne recoit jamais ses constats — l'emetteur rend null avant de les calcu | candidat | pilot | 7.5 |
| TF-0693 | forge-audit : la famille gd-fiche-securite ne fournit aucune allocation d indice avec son gabarit, alors que t | decide | forge-audit, pilot | 1 |
| TF-0694 | digit-ai-page-html : la regle l2_gouttiere decrit EXACTEMENT ce defaut, au seuil exact, et rend PASS dessus -  | decide | digit-ai-page-html, pilot | 1 |

### digit-ai-forge-design — 6 item(s)

Les items ouverts ciblant digit-ai-forge-design, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0720 | digit-ai-page-html : M18 refuse une glose correcte quand une emphase ou un retour a la ligne s intercale entre | candidat | digit-ai-forge-design | 15 |
| TF-0707 | design : un choix exclusif se pose AVANT les champs qu'il commande, jamais au milieu d'un formulaire qui les a | candidat | digit-ai-forge-design | 10 |
| TF-0712 | pilot : R-32 n'a pas de forme de journal pour un livrable qui porte des donnees personnelles | candidat | digit-ai-factory, digit-ai-forge-design | 10 |
| TF-0719 | digit-ai-page-html : le badge acte n est pas resolvant — il affirme un statut que rien ne verifie, et il a por | candidat | digit-ai-forge-design | 10 |
| TF-0736 | forge-design : aucun referentiel ne dit qu'un champ de saisie doit etre TYPE a son format, PROPOSE selon son c | candidat | digit-ai-forge-design | 6.7 |
| TF-0708 | tests : distinguer deux motifs legitimes d'ecran de creation plutot que d'imposer le formulaire replie partout | candidat | digit-ai-forge-tests, digit-ai-forge-design | 6 |

### digit-ai-forge-agents — 6 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0723 | Une formule d'invocation lue comme une tournure : un skill disponible non invoque trois fois, sans laisser de  | candidat | digit-ai-factory, digit-ai-forge-agents | 20 |
| TF-0718 | quality-oracles : un effectif annonce en toutes lettres n est compare a rien — « sept ecarts » en tete d un ta | candidat | digit-ai-forge-agents | 15 |
| TF-0715 | quality-oracles : aucun domaine ne verifie l AUTORITE d une decision affirmee — un livrable peut ecrire « Deci | candidat | digit-ai-forge-agents | 12.5 |
| TF-0717 | experts-forge : un angle declare vide le 20/08 a produit le 31/08 exactement le defaut qu il aurait attrape —  | candidat | digit-ai-forge-agents | 8.3 |
| TF-0716 | quality-oracles : aucun domaine ne teste si une consequence declaree est LIVRABLE — « l utilisateur decouvre e | candidat | digit-ai-forge-agents | 6.7 |
| TF-0733 | Un voile [hidden] au display explicite intercepte chaque clic — invisible a seize oracles de forme | candidat | digit-ai-forge-agents | 1 |

### digit-ai-forge-tests — 5 item(s)

Les items ouverts ciblant digit-ai-forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0705 | pilot : une URL de production anonyme est produite par la MEP — RT-14 traitait le symptome cote forge-tests | candidat | digit-ai-factory, digit-ai-forge-ops, digit-ai-forge-tests | 12.5 |
| TF-0728 | forge-tests : le detecteur statique de codes declares ne voit pas une emission sous garde try/except — 4 faux  | candidat | digit-ai-forge-tests | 10 |
| TF-0727 | forge-tests : demande d'etude approfondie — strategie de tests et temps d'execution des campagnes (selection d | candidat | digit-ai-forge-tests | 6.3 |
| TF-0708 | tests : distinguer deux motifs legitimes d'ecran de creation plutot que d'imposer le formulaire replie partout | candidat | digit-ai-forge-tests, digit-ai-forge-design | 6 |
| TF-0665 | Un nombre affiché dont aucune source du dépôt ne rend compte est un nombre orphelin, et personne ne le lui dem | decide | digit-ai-forge-tests | 5.6 |

### digit-ai-forge-ops — 4 item(s)

Les items ouverts ciblant digit-ai-forge-ops, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0706 | pilot : deux pieges de l'API Railway a documenter au mode d'emploi de l'etape MEP | candidat | digit-ai-factory, digit-ai-forge-ops | 15 |
| TF-0705 | pilot : une URL de production anonyme est produite par la MEP — RT-14 traitait le symptome cote forge-tests | candidat | digit-ai-factory, digit-ai-forge-ops, digit-ai-forge-tests | 12.5 |
| TF-0735 | pilot : le principe de connexion a Railway par jeton n'est un artefact d'aucun referentiel de la route MEP — c | candidat | digit-ai-factory, digit-ai-forge-ops | 10 |
| TF-0704 | pilot : l'etape MEP pilote Railway par le CLI, qui ne sait ni renommer un service ni corriger un domaine | candidat | digit-ai-factory, digit-ai-forge-ops | 6.7 |

### forge-audit — 2 item(s)

Les items ouverts ciblant forge-audit, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0693 | forge-audit : la famille gd-fiche-securite ne fournit aucune allocation d indice avec son gabarit, alors que t | decide | forge-audit, pilot | 1 |
| TF-0697 | forge-audit : le gabarit gd-fiche-securite reserve 32 % de la page a une colonne d intitules courts - correcti | decide | forge-audit | 1 |

### digit-ai-page-html — 2 item(s)

Les items ouverts ciblant digit-ai-page-html, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0724 | Le socle de page HTML livre une declaration que son propre controle refuse, et une classe qui viole la regle d | candidat | digit-ai-page-html | 20 |
| TF-0694 | digit-ai-page-html : la regle l2_gouttiere decrit EXACTEMENT ce defaut, au seuil exact, et rend PASS dessus -  | decide | digit-ai-page-html, pilot | 1 |

### digit-ai-forge-audit — 2 item(s)

Les items ouverts ciblant digit-ai-forge-audit, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0700 | audit : le livrable DIFFUSE de la fiche securite est un PDF, que le kit ne prescrit pas, n outille pas et ne c | decide | digit-ai-forge-audit | 9 |
| TF-0701 | audit : la fiche securite n a AUCUN verificateur alors que ses deux regles sont mecaniques, et que le rapport  | decide | digit-ai-forge-audit | 6 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

