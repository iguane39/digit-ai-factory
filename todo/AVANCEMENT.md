---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau 5b4934007ae3)]
verifie_le: 2026-09-01
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `5b4934007ae3`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 24 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 0 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 0 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 24 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-forge-design — 6 item(s)

Les items ouverts ciblant digit-ai-forge-design, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0720 | digit-ai-page-html : M18 refuse une glose correcte quand une emphase ou un retour a la ligne s intercale entre | decide | digit-ai-forge-design | 15 |
| TF-0707 | design : un choix exclusif se pose AVANT les champs qu'il commande, jamais au milieu d'un formulaire qui les a | decide | digit-ai-forge-design | 10 |
| TF-0719 | digit-ai-page-html : le badge acte n est pas resolvant — il affirme un statut que rien ne verifie, et il a por | decide | digit-ai-forge-design | 10 |
| TF-0739 | forge-design : la cible de geste d'un composant composite n'est un critere d'aucun referentiel — sur un champ  | candidat | digit-ai-forge-design | 10 |
| TF-0736 | forge-design : aucun referentiel ne dit qu'un champ de saisie doit etre TYPE a son format, PROPOSE selon son c | decide | digit-ai-forge-design | 6.7 |
| TF-0708 | tests : distinguer deux motifs legitimes d'ecran de creation plutot que d'imposer le formulaire replie partout | decide | digit-ai-forge-tests, digit-ai-forge-design | 6 |

### pilot — 4 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |
| TF-0732 | poste : le gate d'ecriture C7 juge le FICHIER ENTIER, pas le delta — et sa regle « DM Sans bannie » contredit  | decide | pilot | 10 |
| TF-0693 | forge-audit : la famille gd-fiche-securite ne fournit aucune allocation d indice avec son gabarit, alors que t | decide | forge-audit, pilot | 1 |
| TF-0694 | digit-ai-page-html : la regle l2_gouttiere decrit EXACTEMENT ce defaut, au seuil exact, et rend PASS dessus -  | decide | digit-ai-page-html, pilot | 1 |

### digit-ai-forge-tests — 4 item(s)

Les items ouverts ciblant digit-ai-forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0728 | forge-tests : le detecteur statique de codes declares ne voit pas une emission sous garde try/except — 4 faux  | decide | digit-ai-forge-tests | 10 |
| TF-0727 | forge-tests : demande d'etude approfondie — strategie de tests et temps d'execution des campagnes (selection d | decide | digit-ai-forge-tests | 6.3 |
| TF-0708 | tests : distinguer deux motifs legitimes d'ecran de creation plutot que d'imposer le formulaire replie partout | decide | digit-ai-forge-tests, digit-ai-forge-design | 6 |
| TF-0665 | Un nombre affiché dont aucune source du dépôt ne rend compte est un nombre orphelin, et personne ne le lui dem | decide | digit-ai-forge-tests | 5.6 |

### digit-ai-factory — 4 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | decide | digit-ai-factory | 10 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |
| TF-0740 | Gestion des heures : l'ecart declare qui remplacait la solution disponible, et le patron heure-locale-sur-plan | candidat | digit-ai-factory | 1 |

### digit-ai-forge-agents — 4 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0718 | quality-oracles : un effectif annonce en toutes lettres n est compare a rien — « sept ecarts » en tete d un ta | decide | digit-ai-forge-agents | 15 |
| TF-0715 | quality-oracles : aucun domaine ne verifie l AUTORITE d une decision affirmee — un livrable peut ecrire « Deci | decide | digit-ai-forge-agents | 12.5 |
| TF-0717 | experts-forge : un angle declare vide le 20/08 a produit le 31/08 exactement le defaut qu il aurait attrape —  | decide | digit-ai-forge-agents | 8.3 |
| TF-0716 | quality-oracles : aucun domaine ne teste si une consequence declaree est LIVRABLE — « l utilisateur decouvre e | decide | digit-ai-forge-agents | 6.7 |

### forge-audit — 2 item(s)

Les items ouverts ciblant forge-audit, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0693 | forge-audit : la famille gd-fiche-securite ne fournit aucune allocation d indice avec son gabarit, alors que t | decide | forge-audit, pilot | 1 |
| TF-0697 | forge-audit : le gabarit gd-fiche-securite reserve 32 % de la page a une colonne d intitules courts - correcti | decide | forge-audit | 1 |

### digit-ai-forge-audit — 2 item(s)

Les items ouverts ciblant digit-ai-forge-audit, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0700 | audit : le livrable DIFFUSE de la fiche securite est un PDF, que le kit ne prescrit pas, n outille pas et ne c | decide | digit-ai-forge-audit | 9 |
| TF-0701 | audit : la fiche securite n a AUCUN verificateur alors que ses deux regles sont mecaniques, et que le rapport  | decide | digit-ai-forge-audit | 6 |

### digit-ai-page-html — 1 item(s)

Les items ouverts ciblant digit-ai-page-html, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0694 | digit-ai-page-html : la regle l2_gouttiere decrit EXACTEMENT ce defaut, au seuil exact, et rend PASS dessus -  | decide | digit-ai-page-html, pilot | 1 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

