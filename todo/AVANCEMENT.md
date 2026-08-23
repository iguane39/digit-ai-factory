---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau ca2850d99cfb)]
verifie_le: 2026-08-23
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `ca2850d99cfb`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 4 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 56 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 1 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 61 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 4 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0519 | produit-07 : l ancien hote forge.produit-07 NE RESOUT PLUS DU TOUT — le trafic qui le connait encore tombe d | candidat | digit-ai-factory | 10 |
| TF-0514 | Produit-05 n'est PAS instancie sous la doctrine factory — ni forge\, ni clause de precedence, ni hooks : c'est ce  | candidat | digit-ai-factory | 6.7 |
| TF-0324 | Artefacts périodiques du run de delivery absents : RAID, rapport d'avancement, compte rendu, REX, suivi des bé | en_cours | digit-ai-factory | 3 |
| TF-0475 | agents, design : 18 des 20 champs de frontmatter d'un SKILL.md ne sont posés nulle part — isolation de context | en_cours | digit-ai-factory | 3 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

