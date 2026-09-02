---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau a6351cd03ba7)]
verifie_le: 2026-09-02
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `a6351cd03ba7`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 19 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 0 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 0 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 19 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 13 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0753 | digit-ai-factory : RT-1 toujours ouvert -- l'item A1 autorise les web fonts que l'oracle normatif refuse, et i | candidat | digit-ai-factory | 25 |
| TF-0755 | digit-ai-factory : la ligne D5 ne documente pas la teinte de refus, que le livrable conforme de la maison empl | candidat | digit-ai-factory | 15 |
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0758 | digit-ai-factory : aucun oracle ne juge la CONCEPTION d'un livrable -- 17 controles de forme verts, deux refus | candidat | digit-ai-factory, digit-ai-forge-agents | 12.5 |
| TF-0764 | digit-ai-factory : la passe d'anonymisation (D-37) ne couvre que le pilot — les quatre forges soeurs, depots p | candidat | digit-ai-factory, digit-ai-forge-design, digit-ai-forge-agents, digit-ai-forge-tests, digit-ai-forge-audit | 12.5 |
| TF-0754 | digit-ai-factory : B1 « header sticky » et B6 « thead sticky » se superposent, et aucun des deux textes ne dit | candidat | digit-ai-factory, digit-ai-forge-agents | 12 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | decide | digit-ai-factory | 10 |
| TF-0760 | digit-ai-factory : une mesure exacte case par case peut etre fausse dans son ensemble, et aucun controle ne le | candidat | digit-ai-factory | 10 |
| TF-0762 | digit-ai-factory : l'avertissement R-47 sur l'heritage arrive a l'ingestion, donc apres la remise, chez celui  | candidat | digit-ai-factory | 10 |
| TF-0757 | digit-ai-factory : la boucle de retour ne redescend pas -- trois recidives en quatre jours sur un seul projet | candidat | digit-ai-factory | 8.3 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |
| TF-0759 | digit-ai-factory : il manque une methode de construction d'un livrable -- le socle prescrit le rendu, les gaba | candidat | digit-ai-factory | 6.7 |
| TF-0756 | digit-ai-factory : aucune famille de gabarit ne couvre une consolidation de process multi-produits, et G8 ne p | candidat | digit-ai-factory | 6 |

### pilot — 3 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |
| TF-0732 | poste : le gate d'ecriture C7 juge le FICHIER ENTIER, pas le delta — et sa regle « DM Sans bannie » contredit  | en_cours | pilot | 10 |
| TF-0752 | L'HISTOIRE du depot porte encore 200 noms de clients, et aucun outil du parc ne peut les en retirer | candidat | pilot | 5 |

### digit-ai-forge-agents — 3 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0758 | digit-ai-factory : aucun oracle ne juge la CONCEPTION d'un livrable -- 17 controles de forme verts, deux refus | candidat | digit-ai-factory, digit-ai-forge-agents | 12.5 |
| TF-0764 | digit-ai-factory : la passe d'anonymisation (D-37) ne couvre que le pilot — les quatre forges soeurs, depots p | candidat | digit-ai-factory, digit-ai-forge-design, digit-ai-forge-agents, digit-ai-forge-tests, digit-ai-forge-audit | 12.5 |
| TF-0754 | digit-ai-factory : B1 « header sticky » et B6 « thead sticky » se superposent, et aucun des deux textes ne dit | candidat | digit-ai-factory, digit-ai-forge-agents | 12 |

### forge-tests — 2 item(s)

Les items ouverts ciblant forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0749 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention | decide | forge-tests | 10 |
| TF-0748 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois | decide | forge-tests | 5 |

### digit-ai-forge-tests — 2 item(s)

Les items ouverts ciblant digit-ai-forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0764 | digit-ai-factory : la passe d'anonymisation (D-37) ne couvre que le pilot — les quatre forges soeurs, depots p | candidat | digit-ai-factory, digit-ai-forge-design, digit-ai-forge-agents, digit-ai-forge-tests, digit-ai-forge-audit | 12.5 |
| TF-0763 | forge-tests : la recette corpus (verdict S-01) n'est plus prononcable depuis D-34 — banc rouge 21/23, banc ver | candidat | digit-ai-forge-tests | 6 |

### digit-ai-forge-design — 1 item(s)

Les items ouverts ciblant digit-ai-forge-design, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0764 | digit-ai-factory : la passe d'anonymisation (D-37) ne couvre que le pilot — les quatre forges soeurs, depots p | candidat | digit-ai-factory, digit-ai-forge-design, digit-ai-forge-agents, digit-ai-forge-tests, digit-ai-forge-audit | 12.5 |

### digit-ai-forge-audit — 1 item(s)

Les items ouverts ciblant digit-ai-forge-audit, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0764 | digit-ai-factory : la passe d'anonymisation (D-37) ne couvre que le pilot — les quatre forges soeurs, depots p | candidat | digit-ai-factory, digit-ai-forge-design, digit-ai-forge-agents, digit-ai-forge-tests, digit-ai-forge-audit | 12.5 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

