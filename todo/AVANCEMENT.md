---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau e7dbdfd1e147)]
verifie_le: 2026-08-24
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `e7dbdfd1e147`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 7 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 71 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 4 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 82 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 5 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0544 | Un commentaire de code a fait autorite contre une API, et a fonde une decision humaine fausse | candidat | digit-ai-factory | 12.5 |
| TF-0545 | Rien ne joue l'ensemble des controles : CI et local sont deux ensembles disjoints | candidat | digit-ai-factory, digit-ai-forge-tests | 12.5 |
| TF-0547 | Aucun contrat d'integration n'est declare : chaque session redecouvre et se trompe | candidat | digit-ai-factory | 8 |
| TF-0540 | Règle de socle : une forge ne sollicite l'humain que s'il y a un arbitrage à rendre | candidat | digit-ai-factory | 6.7 |
| TF-0546 | Un negatif sur une ressource externe ne se prononce jamais depuis une source unique | candidat | digit-ai-factory | 6.7 |

### digit-ai-forge-tests — 2 item(s)

Les items ouverts ciblant digit-ai-forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0545 | Rien ne joue l'ensemble des controles : CI et local sont deux ensembles disjoints | candidat | digit-ai-factory, digit-ai-forge-tests | 12.5 |
| TF-0537 | Oracle secrets : clés API de tiers dans du JS minifié aspiré, comptées bloquantes | candidat | digit-ai-forge-tests | 10 |

### pilot — 1 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

