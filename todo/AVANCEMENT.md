---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau bdd0c42b75a1)]
verifie_le: 2026-08-23
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `bdd0c42b75a1`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 0 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 61 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 3 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 64 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

