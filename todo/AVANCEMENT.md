---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau 302e7ba60653)]
verifie_le: 2026-09-07
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `302e7ba60653`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 56 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 49 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 0 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 105 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 24 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0869 | pilot : aucun .env local créé d'office, le commanditaire a saisi sa clé Anthropic dans .env.example versionné | candidat | digit-ai-factory | 25 |
| TF-0870 | pilot : une clé Anthropic d'organisation sans espace de travail échoue en 400, variable ANTHROPIC_WORKSPACE_ID | candidat | digit-ai-factory | 20 |
| TF-0872 | pilot : ETAPE-MEP § 3 bis ne prescrit ni comptes d'essai vides ni source des identifiants d'une qualif publiqu | candidat | digit-ai-factory | 20 |
| TF-0866 | digit-ai-forge-tests : tests/test_tf_0401_manifeste_racines.py ne se collecte plus — un nom de produit pseudon | candidat | digit-ai-forge-tests, digit-ai-factory | 15 |
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0871 | pilot : la convention de démonstration (R-23, aide MODE_DEMO) a mis des identifiants sur une page servie sur I | candidat | digit-ai-factory | 12.5 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | decide | digit-ai-factory | 10 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |
| TF-0884 | digit-ai-factory : rien n'empêche d'écraser un lot de retours déjà remis et ingéré — arrivé le 06/09, réparé p | candidat | digit-ai-factory | 5 |
| TF-0881 | digit-ai-factory : l'alias de transition périmé (ancien gabarit de lot, 62 lignes du 14/08) survit à côté de l | candidat | digit-ai-factory | 3 |
| TF-0886 | digit-ai-forge-development : la règle de branche annoncée par le pilot (« avance rapide seulement ») diffère d | candidat | digit-ai-forge-development, digit-ai-factory | 3 |
| TF-0879 | pilot : la recette scripts/rebatir-clone.test.mjs (écrite sur l'autre poste le 07/09) échoue sur ce poste avan | candidat | digit-ai-factory | 2 |
| TF-0882 | digit-ai-factory : R-47 compte « absent » un motif d'exclusion qu'une graphie plus large du .gitignore couvre  | candidat | digit-ai-factory | 2 |
| TF-0883 | digit-ai-factory : le canal des lots suppose la boîte d'entrée du produit ignorée par git sans le dire — chez  | candidat | digit-ai-factory | 2 |
| TF-0826 | digit-ai-factory : le depot PUBLIC du pilot porte lui-meme, dans 9 fichiers suivis, le nom de produit que TF-0 | candidat | digit-ai-factory | 1 |
| TF-0836 | pilot : le hook qo-gate-write juge un template de maquette comme un livrable | candidat | digit-ai-factory | 1 |
| TF-0838 | pilot : le skill claude-api ne documente pas fallbacks avec messages.parse | candidat | digit-ai-factory | 1 |
| TF-0848 | digit-ai-factory : R-47 juge l'arbre de travail — un heritage recopie mais NON COMMIS rend PASS pendant que le | candidat | digit-ai-factory | 1 |
| TF-0849 | digit-ai-factory : le message d'attribution de divergence date la copie du produit par la date du COMMIT du pi | candidat | digit-ai-factory | 1 |
| TF-0850 | digit-ai-factory : le « geste unique » de remise à niveau de l'héritage ne rend pas R-47 vert, et le message d | candidat | digit-ai-factory | 1 |
| TF-0851 | digit-ai-factory : la descente d'heritage atteint le disque du poste et jamais l'histoire git du produit, et R | candidat | digit-ai-factory | 1 |
| TF-0852 | digit-ai-factory : le lot de travaux demande a la main le geste que le hook d'ouverture fait seul depuis le 30 | candidat | digit-ai-factory | 1 |
| TF-0853 | digit-ai-factory : oracle-conformite-projet rend 242 constats sur 247 dans un dossier que le .gitignore du pro | candidat | digit-ai-factory | 1 |
| TF-0873 | pilot : une session parallèle a déposé les lots d'insatisfaction dans un dépôt vide au nom différent du produi | candidat | digit-ai-factory | 1 |

### digit-ai-forge-design — 9 item(s)

Les items ouverts ciblant digit-ai-forge-design, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0875 | forge-design : un état saisi ne survit pas à la navigation de la barre basse et rien ne le juge | candidat | digit-ai-forge-design | 12.5 |
| TF-0846 | forge-design : la barre basse sticky de la doctrine mobile chevauche le contenu (V4) hors coquille défilante | candidat | digit-ai-forge-design | 10 |
| TF-0830 | digit-ai-forge-design : la critique d implementation juge le CSS herite du socle digit-ai-page-html (table-fil | candidat | digit-ai-forge-design, pilot | 7.5 |
| TF-0857 | digit-ai-schemas : ce que la critique forge-design laisse apres TF-0791 — trois CONFLITS entre oracles de forg | candidat | digit-ai-forge-design, digit-ai-forge-agents | 2.7 |
| TF-0833 | forge-design : oracle-declencheurs DE3 apparie les sélecteurs par jeton et non par sélecteur complet | candidat | digit-ai-forge-design | 1 |
| TF-0834 | forge-design : oracle-surcouche SC1 prend un box-shadow commençant par 0 pour un contour nul | candidat | digit-ai-forge-design | 1 |
| TF-0835 | forge-design : check_maquette C2 ne reconnaît pas une route référençant une fonction nommée | candidat | digit-ai-forge-design | 1 |
| TF-0843 | forge-tests : le pan interface et oracle-panneau-tache PA6 s'excluent sur une page-formulaire dédiée | candidat | digit-ai-forge-tests, digit-ai-forge-design | 1 |
| TF-0847 | forge-design : render_page contenu_rogne signale les champs de saisie dont la valeur dépasse la largeur | candidat | digit-ai-forge-design | 1 |

### digit-ai-forge-tests — 7 item(s)

Les items ouverts ciblant digit-ai-forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0866 | digit-ai-forge-tests : tests/test_tf_0401_manifeste_racines.py ne se collecte plus — un nom de produit pseudon | candidat | digit-ai-forge-tests, digit-ai-factory | 15 |
| TF-0839 | forge-tests : la greffe FORGE_TESTS_APP importe app avant conftest et fige moteur et réglages | candidat | digit-ai-forge-tests | 12.5 |
| TF-0840 | forge-tests : les cas --generer du pan data passent sur une erreur de syntaxe SQL | candidat | digit-ai-forge-tests | 8.3 |
| TF-0876 | forge-tests : le pan qualif compte comme exercé un bouton cliqué sans effet utile | candidat | digit-ai-forge-tests | 8.3 |
| TF-0841 | forge-tests : les livrables sont refusés parce qu'une clé de cas reprend un chemin de route lu dans .env.forge | candidat | digit-ai-forge-tests | 1 |
| TF-0842 | forge-tests : INSTANCE_MONTER sans secrets de session et INSTANCE_DEMONTER qui ne libère pas le port | candidat | digit-ai-forge-tests | 1 |
| TF-0843 | forge-tests : le pan interface et oracle-panneau-tache PA6 s'excluent sur une page-formulaire dédiée | candidat | digit-ai-forge-tests, digit-ai-forge-design | 1 |

### digit-ai-forge-conception — 6 item(s)

Les items ouverts ciblant digit-ai-forge-conception, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0874 | forge-conception : la surface implicite ne propose ni lien public partageable ni comptes d'essai | candidat | digit-ai-forge-conception | 20 |
| TF-0885 | digit-ai-forge-conception : le point d'entrée déclaré au manifeste rend FAIL sur toute cible, même verte — ora | candidat | digit-ai-forge-conception | 5 |
| TF-0827 | digit-ai-forge-conception : la seconde famille de vues garde le sceau de provenance seul, et la variante « lis | candidat | digit-ai-forge-conception | 1 |
| TF-0831 | forge-conception : run-oracles-conception sans --seulement juge EXIGENCES.json comme un RETRO-MODELE | candidat | digit-ai-forge-conception | 1 |
| TF-0832 | forge-conception : T5 attend corps-sha256 que ni derive-les-vues ni vues.md ne documentent | candidat | digit-ai-forge-conception | 1 |
| TF-0854 | digit-ai-forge-conception : les tables closes des oracles sont elles aussi des transcriptions de prose que rie | candidat | digit-ai-forge-conception | 1 |

### digit-ai-forge-agents — 5 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0880 | digit-ai-forge-agents : la règle C5 de la porte cherche une clé courte sans frontière — trois faux positifs su | decide | digit-ai-forge-agents | 3 |
| TF-0857 | digit-ai-schemas : ce que la critique forge-design laisse apres TF-0791 — trois CONFLITS entre oracles de forg | candidat | digit-ai-forge-design, digit-ai-forge-agents | 2.7 |
| TF-0825 | digit-ai-forge-agents : etendre la porte de publication aux noms de produits demande deux garde-fous, parce qu | candidat | digit-ai-forge-agents | 1 |
| TF-0828 | digit-ai-forge-agents : la regle C5 de la porte de publication juge trois angles sur les quatre que C1-C4 couv | candidat | digit-ai-forge-agents | 1 |
| TF-0855 | digit-ai-forge-agents : la porte de publication rend FAIL sur main — cinq mentions reelles d un nom de produit | decide | digit-ai-forge-agents | 1 |

### pilot — 3 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |
| TF-0830 | digit-ai-forge-design : la critique d implementation juge le CSS herite du socle digit-ai-page-html (table-fil | candidat | digit-ai-forge-design, pilot | 7.5 |
| TF-0791 | Cascade Intention > Strategie > Tactique > Operationnel + test retro : la definition des demandes ne capture p | en_cours | pilot | 6.7 |

### forge-tests — 2 item(s)

Les items ouverts ciblant forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0749 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention | decide | forge-tests | 10 |
| TF-0748 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois | decide | forge-tests | 5 |

### digit-ai-forge-ops — 2 item(s)

Les items ouverts ciblant digit-ai-forge-ops, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0844 | forge-ops : oracle-ops exige COURANT et journal.jsonl sur une cible Railway qui ne les porte pas | candidat | digit-ai-forge-ops | 1 |
| TF-0845 | forge-ops : railway up -p ne remplace pas railway link (« prefix not found ») | candidat | digit-ai-forge-ops | 1 |

### seo-geo — 1 item(s)

Les items ouverts ciblant seo-geo, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0792 | Ingerer l'expertise « donnees de recherche multilingues » (references/SEO-RECHERCHE.md du pilot) dans le corpu | candidat | seo-geo | 6 |

### digit-ai-forge-organization — 1 item(s)

Les items ouverts ciblant digit-ai-forge-organization, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0837 | forge-organization : oracle-filtres-tableau G3/G6 exigent init et règle print dans le document | candidat | digit-ai-forge-organization | 1 |

### digit-ai-forge-development — 1 item(s)

Les items ouverts ciblant digit-ai-forge-development, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0886 | digit-ai-forge-development : la règle de branche annoncée par le pilot (« avance rapide seulement ») diffère d | candidat | digit-ai-forge-development, digit-ai-factory | 3 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

