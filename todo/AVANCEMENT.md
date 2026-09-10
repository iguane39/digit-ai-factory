---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau 1e92996f9ab2)]
verifie_le: 2026-09-10
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `1e92996f9ab2`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 62 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 169 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 0 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 231 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 26 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0959 | canal confidentiel : une clé DÉJÀ pseudonymisée peut entrer dans une table de noms réels, et rien ne l'en empê | candidat | digit-ai-factory | 20 |
| TF-1013 | pilot : la regle des quantificateurs REFUSAIT la reformulation que son propre message recommande — posee telle | candidat | digit-ai-factory | 20 |
| TF-1007 | parc : un commentaire et un message de commit qui documentaient un defaut de graphie ont ete rendus tautologiq | candidat | digit-ai-factory | 15 |
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0982 | pilot : les tables du canal n ont qu une date GLOBALE — chaque extension rend le passe fautif RETROACTIVEMENT, | en_cours | digit-ai-factory | 12.5 |
| TF-0988 | pilot : un mot d'EXCLUSIVITE dans une demande humaine (« uniquement », « seulement ») n'est couvert par aucune | decide | digit-ai-factory | 12.5 |
| TF-0989 | pilot : aucune recette de livrable n'a d'obligation de juger l'EXCLUSIVITE — elle compte ce qui doit etre la,  | decide | digit-ai-factory | 12.5 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | en_cours | digit-ai-factory | 10 |
| TF-0956 | pilot : le registre ne sait ni détecter ni écarter un DOUBLON de candidature — six items identiques mot pour m | decide | digit-ai-factory | 10 |
| TF-0965 | pilot : propager les skills a casse un test d'une forge voisine — une regle neuve du socle est mesuree sur le  | candidat | digit-ai-factory | 10 |
| TF-0990 | pilot : le referentiel de restitution declare une exemption que son juge n'implemente pas — un tour sans nouve | candidat | digit-ai-factory | 10 |
| TF-1008 | pilot : un clone rebati apres reecriture d historique garde l ANCIENNE histoire atteignable par le REMISAGE —  | candidat | digit-ai-factory | 10 |
| TF-1012 | pilot : la propagation des skills ecrase un fichier SANS trace, et la date du fichier ecrase MENT — elle porte | candidat | digit-ai-factory | 10 |
| TF-0966 | pilot : la pseudonymisation ne couvre pas les IDENTIFIANTS TECHNIQUES cites dans le corps d un item — cinq obj | candidat | digit-ai-factory | 8.3 |
| TF-0967 | pilot : oracle-conformite-projet n a AUCUN banc de fixtures, et son propre en-tete affirme le contraire — c es | candidat | digit-ai-factory | 8.3 |
| TF-0992 | pilot : la règle S37 du juge des restitutions accuse le NOM D'UN CHAMP de la preuve — `corriges: []`, une sort | candidat | digit-ai-factory | 8 |
| TF-0993 | parc : la chaîne d'anonymisation annonce « pseudonymisé » sans dire ce qui a RÉSISTÉ — le champ `refuses` est  | candidat | digit-ai-factory | 8 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |
| TF-0983 | pilot : les vues generees du registre sont versionnees — 1173 revisions de contenu derive, qui transforment UN | candidat | digit-ai-factory | 6.7 |
| TF-1003 | pilot : le preflight d ingestion compte des COMMITS la ou son invariant est un MAXIMUM D IDENTIFIANT — sur une | candidat | digit-ai-factory | 4.5 |
| TF-1009 | gabarits : SIX erreurs de mesure en une journee, AUCUNE trouvee par celui qui l avait commise — le seul mecani | candidat | digit-ai-factory | 4.5 |
| TF-1011 | pilot : la seconde condition de R-38 §4 — un enregistrement de restitution ne porte QUE des restitutions — est | candidat | digit-ai-factory | 4.5 |
| TF-0923 | pilot : six volets d'oracle proposés par les items du 08/09 restent non livrés, cinq d'entre eux vivant dans l | en_cours | digit-ai-factory | 3 |
| TF-0836 | pilot : le hook qo-gate-write juge un template de maquette comme un livrable | en_cours | digit-ai-factory | 1 |
| TF-0838 | pilot : le skill claude-api ne documente pas fallbacks avec messages.parse | en_cours | digit-ai-factory | 1 |
| TF-0987 | pilot : le vocabulaire ferme des motifs d'oracle-synthese est cherche dans TOUT le groupe de puce, spans de co | decide | digit-ai-factory | 1 |

### digit-ai-forge-agents — 13 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0969 | digit-ai-page-html : la regle L30 de check_html.py cherche les termes de son referentiel en SOUS-CHAINE — gate | decide | digit-ai-forge-agents | 20 |
| TF-0984 | digit-ai-forge-agents : la regle A5 du socle est un FAUX POSITIF STRUCTUREL — toute page autoportante qui emba | candidat | digit-ai-forge-agents | 20 |
| TF-0968 | digit-ai-page-html : la sonde V15 de render_page.py rend FAIL par ARITHMETIQUE sur tout tableau dont la hauteu | decide | digit-ai-forge-agents | 12.5 |
| TF-0970 | digit-ai-page-html : kpi-filter.js applique l'attribut de la carte ACTIVE a TOUS les tableaux du perimetre — c | decide | digit-ai-forge-agents | 12.5 |
| TF-0973 | digit-ai-page-html : NUANCE sur RA-24 — la sonde V15 attrape de VRAIS defauts, la corriger ne doit pas la desa | decide | digit-ai-forge-agents | 10 |
| TF-0991 | parc : un contrôle borné à 200 constats déclare son vrai total dans une ligne de prose — le pilot a publié 200 | candidat | digit-ai-forge-agents | 10 |
| TF-0994 | digit-ai-forge-agents : le garde-fou anti-écrasement de l'installeur de hameçons ne tient qu'à UNE LETTRE — il | candidat | digit-ai-forge-agents | 10 |
| TF-0997 | digit-ai-forge-agents : le champ disable-model-invocation a bien ete retire des 3 skills du lexique, mais le C | candidat | digit-ai-forge-agents | 10 |
| TF-0938 | digit-ai-forge-agents (digit-ai-schemas / digit-ai-page-html) : aucun gabarit de schéma de base de données DIF | en_cours | digit-ai-forge-agents | 6.7 |
| TF-0940 | digit-ai-forge-agents / digit-ai-forge-audit : deux implémentations du schéma de base de données coexistent (r | en_cours | digit-ai-forge-agents, digit-ai-forge-audit | 6.7 |
| TF-0947 | digit-ai-forge-agents / digit-ai-forge-audit : deux implémentations du schéma de base de données coexistent (r | decide | digit-ai-forge-agents, digit-ai-forge-audit | 6.7 |
| TF-1002 | quality-oracles : la porte de publication accuse un sigle DANS un mot ordinaire, et localise son constat sur l | candidat | digit-ai-forge-agents | 4.5 |
| TF-1006 | parc : le registre des oracles a ete ETENDU dans la copie INSTALLEE d un skill, jamais dans sa source versionn | en_cours | digit-ai-forge-agents | 4.5 |

### factory — 7 item(s)

Les items ouverts ciblant factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0962 | factory : le TEXTE de la doctrine de restitution manquait chez le produit alors que le juge et le cablage etai | decide | factory | 1 |
| TF-0963 | factory : les trois pieces de la doctrine peuvent etre toutes presentes et conformes chez le produit et ne JAM | decide | factory | 1 |
| TF-0964 | factory : une lecon payee et commentee dans un module d un produit n a aucun mecanisme pour atteindre le modul | decide | factory | 1 |
| TF-0978 | factory : les trois exemptions du paragraphe Portee sont des proprietes du MESSAGE alors que la judgeabilite e | decide | factory | 1 |
| TF-0979 | factory : la doctrine ne prescrit aucune forme pour un tour de travail INACHEVE, et ce vide est ce qui rend l  | decide | factory | 1 |
| TF-0985 | factory : un tableau de reference organise par « ce qui varie » oblige le lecteur a recoller le document, et a | decide | factory | 1 |
| TF-0986 | factory : un secret ne se publie pas, et rien ne dit comment un lecteur IDENTIFIE celui qui est en place | decide | factory | 1 |

### digit-ai-forge-audit — 5 item(s)

Les items ouverts ciblant digit-ai-forge-audit, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1000 | forge-audit : la charte d exemple fictive livree avec la forge prime sur la typographie declaree du tenant | candidat | digit-ai-forge-audit | 15 |
| TF-1001 | forge-audit : six champs que le moteur de rapport sait rendre restent vides sans que la porte machine le dise | candidat | digit-ai-forge-audit | 10 |
| TF-0940 | digit-ai-forge-agents / digit-ai-forge-audit : deux implémentations du schéma de base de données coexistent (r | en_cours | digit-ai-forge-agents, digit-ai-forge-audit | 6.7 |
| TF-0947 | digit-ai-forge-agents / digit-ai-forge-audit : deux implémentations du schéma de base de données coexistent (r | decide | digit-ai-forge-agents, digit-ai-forge-audit | 6.7 |
| TF-1005 | forge-audit : realigner les deux rapports d audit de reference sur le format courant en conservant leur conten | en_cours | digit-ai-forge-audit | 3 |

### digit-ai-forge-data — 5 item(s)

Les items ouverts ciblant digit-ai-forge-data, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0972 | forge-data : la resolution des references d'un langage de calcul n'a aucun contrat — casse et references non q | decide | digit-ai-forge-data | 10 |
| TF-0974 | forge-data : un referentiel de lineage qui DECRIT ses cibles en prose au lieu de les NOMMER rend tout re-perim | decide | digit-ai-forge-data | 8.3 |
| TF-0971 | forge-data : aucun oracle ni outil ne mesure l'USAGE REEL d'un modele de restitution — la couverture se mesure | decide | digit-ai-forge-data | 6.3 |
| TF-0975 | forge-data : aucun oracle ne rapproche un modele de restitution d'un EXTRAIT du rapport livre par le client -  | decide | digit-ai-forge-data | 1 |
| TF-0976 | forge-data : un export Power BI porte un pied de page Filtres appliques qui entre dans les donnees, et c'est e | decide | digit-ai-forge-data | 1 |

### pilot — 3 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |
| TF-0960 | pilot : aucune famille de gabarits/documents/catalogue.jsonl ne couvre un plan d'ordonnancement de mise en pro | decide | pilot | 10 |
| TF-0791 | Cascade Intention > Strategie > Tactique > Operationnel + test retro : la definition des demandes ne capture p | en_cours | pilot | 6.7 |

### forge-tests — 2 item(s)

Les items ouverts ciblant forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0749 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention | en_cours | forge-tests | 10 |
| TF-0748 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois | en_cours | forge-tests | 5 |

### digit-ai-forge-design — 1 item(s)

Les items ouverts ciblant digit-ai-forge-design, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0847 | forge-design : render_page contenu_rogne signale les champs de saisie dont la valeur dépasse la largeur | en_cours | digit-ai-forge-design | 1 |

### digit-ai-page-html — 1 item(s)

Les items ouverts ciblant digit-ai-page-html, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0961 | digit-ai-page-html : scripts/embarquer-composants.mjs ne s'importe pas et ne pose que dans le depot des skills | decide | digit-ai-page-html | 7.5 |

### digit-ai-forge-organization — 1 item(s)

Les items ouverts ciblant digit-ai-forge-organization, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0977 | forge-organization : le registre des types n'a aucun type pour un livrable de COMPARAISON a deux sens, et R-25 | decide | digit-ai-forge-organization | 1 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

