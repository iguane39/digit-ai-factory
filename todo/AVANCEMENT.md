---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau e384616b71d3)]
verifie_le: 2026-08-24
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `e384616b71d3`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 8 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 81 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 4 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 93 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-forge-agents — 4 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0557 | forge-agents, socle de rendu : composant-recherche.md prescrit mark.find-hit { color: inherit }, qui rend un b | candidat | digit-ai-forge-agents | 9 |
| TF-0558 | forge-agents, composants.md §6 : la regle de calibrage du repli des tableaux est ecrite en prose et sans mecan | candidat | digit-ai-forge-agents, digit-ai-factory | 6 |
| TF-0554 | forge-agents, check_html L19 : la regle refuse ce que composants.md §6 rend OBLIGATOIRE, et elle juge un selec | candidat | digit-ai-forge-agents | 4.5 |
| TF-0559 | forge-agents, render_page V4 : la boite d'un element inline vaut la hauteur d'em, pas l'interligne — deux inli | candidat | digit-ai-forge-agents | 1.5 |

### digit-ai-factory — 4 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0555 | factory, R-47 a l'ingestion d'un lot : un produit range sous un dossier client est introuvable, et le cercle q | candidat | digit-ai-factory | 9 |
| TF-0560 | factory, R-4 nommage date : les espaces du nom rendent tout livrable inatteignable au clic, et le garde-fou D- | candidat | digit-ai-factory | 9 |
| TF-0558 | forge-agents, composants.md §6 : la regle de calibrage du repli des tableaux est ecrite en prose et sans mecan | candidat | digit-ai-forge-agents, digit-ai-factory | 6 |
| TF-0556 | factory : les vues docs\projet\ produites par ses propres scripts echouent au check_html du socle, et R-26 int | candidat | digit-ai-factory | 4.5 |

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

