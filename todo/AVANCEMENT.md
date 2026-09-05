---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau e7cb40d67f90)]
verifie_le: 2026-09-05
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `e7cb40d67f90`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 14 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 29 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 0 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 43 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 3 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | decide | digit-ai-factory | 10 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |

### digit-ai-forge-conception — 3 item(s)

Les items ouverts ciblant digit-ai-forge-conception, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0818 | digit-ai-forge-conception : le sceau d'une vue dérivée prouve sa provenance, jamais son contenu — oracle-traca | decide | digit-ai-forge-conception | 3 |
| TF-0822 | digit-ai-forge-conception : la transcription d'un champ depuis la prose n'est vérifiée par rien, et EXIGENCES. | candidat | digit-ai-forge-conception | 3 |
| TF-0823 | digit-ai-forge-conception : une fixture est déclarée verte pour l'oracle qu'elle sert, jamais pour les autres  | candidat | digit-ai-forge-conception | 2 |

### digit-ai-forge-agents — 3 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0820 | digit-ai-forge-development : un nom de produit réel vit dans deux fichiers courants (catalogue du conductor, u | decide | digit-ai-forge-development, digit-ai-forge-agents | 3 |
| TF-0824 | digit-ai-forge-agents : le contrat de sortie de run-oracles.mjs n'a aucun domicile écrit — le champ detail a c | candidat | digit-ai-forge-agents | 2 |
| TF-0821 | digit-ai-forge-agents : la moitie IMPURE du gate d ecriture (constatsAvant, celle qui va chercher HEAD) n est  | decide | digit-ai-forge-agents | 1 |

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
| TF-0749 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention | decide | forge-tests | 10 |
| TF-0748 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois | decide | forge-tests | 5 |

### seo-geo — 1 item(s)

Les items ouverts ciblant seo-geo, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0792 | Ingerer l'expertise « donnees de recherche multilingues » (references/SEO-RECHERCHE.md du pilot) dans le corpu | candidat | seo-geo | 6 |

### digit-ai-forge-development — 1 item(s)

Les items ouverts ciblant digit-ai-forge-development, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0820 | digit-ai-forge-development : un nom de produit réel vit dans deux fichiers courants (catalogue du conductor, u | decide | digit-ai-forge-development, digit-ai-forge-agents | 3 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

