---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau ce06cd466e72)]
verifie_le: 2026-09-03
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `ce06cd466e72`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 18 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 3 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 0 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 21 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### pilot — 6 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |
| TF-0791 | Cascade Intention > Strategie > Tactique > Operationnel + test retro : la definition des demandes ne capture p | en_cours | pilot | 6.7 |
| TF-0793 | pilot : la declaration racine_web demandee par TF-0654 n'est lue par AUCUN script — le critere de cloture du l | candidat | pilot | 1 |
| TF-0794 | pilot : le remede que R-42 prescrit ne solde pas le defaut qu'il vise, et l'ecriture concurrente du ledger col | candidat | pilot | 1 |
| TF-0795 | pilot : CI3 rend PASS sur des controles qui declarent leurs codes de sortie sans posseder AUCUN chemin d'echec | candidat | pilot | 1 |
| TF-0801 | pilot : R-19 sans voie de rectification pour une cle malformee de versions_forges, et le depot digit-ai-queue  | candidat | pilot | 1 |

### digit-ai-factory — 4 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | decide | digit-ai-factory | 10 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |
| TF-0802 | La 404 personnalisee, menu et toutes langues : un standard d'office pour tout site cree par la factory | candidat | digit-ai-factory | 1 |

### forge-design — 3 item(s)

Les items ouverts ciblant forge-design, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0796 | forge-design : un composant genere par script et affiche en sur-couche porte TOUT son habillage depuis les jet | candidat | forge-design | 1 |
| TF-0797 | forge-design : semantique des declencheurs - une action se declenche par un bouton qui a l air d un bouton, un | candidat | forge-design | 1 |
| TF-0800 | forge-design : B-T2/B-T3 declarent morte une bascule cablee par ecouteur delegue et cle en constante - documen | candidat | forge-design | 1 |

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

### forge-development — 1 item(s)

Les items ouverts ciblant forge-development, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0798 | forge-development : toute adresse de fichier statique porte la version de l application (ou une empreinte), de | candidat | forge-development | 20 |

### forge-conception — 1 item(s)

Les items ouverts ciblant forge-conception, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0799 | forge-conception : remplacer les frontieres \b ASCII des gardes lexicales par des frontieres Unicode - E8 lit  | candidat | forge-conception | 1 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

