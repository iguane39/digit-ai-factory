---
role: rapport d'avancement — VUE GÉNÉRÉE du registre, jamais éditée à la main
sources_de_verite: [todo/TODO.jsonl (sceau 7da0e049564b)]
verifie_le: 2026-09-14
---

# Rapport d'avancement — TODO-FORGE

> **Vue générée** par `node scripts\generer-avancement.mjs`, jamais éditée à la main.
> Source : `todo\TODO.jsonl`, sceau `7da0e049564b`. Aucun chiffre de ce document n'est
> saisi : tous sont comptés dans le registre au moment de la génération — c'est la seule
> façon d'être sûr qu'un nombre est juste, ne jamais l'écrire.

## Où en est-on

Trois nombres suffisent à situer la mission : ce qui reste ouvert, ce qui a été clos sur
gains constatés, et ce qui a été écarté avec son motif. Un relevé qui ne compterait que
les corrections donnerait l'illusion d'un progrès net.

| Grandeur | Compte | Ce que ça dit |
|---|---|---|
| Ouverts | 117 | candidats, décidés ou en cours — le reste à faire réel |
| Clos sur gains constatés | 202 | corrigés avec leur mesure avant/après |
| Écartés avec motif | 2 | décidés non faits, motif écrit — jamais un silence |
| Total suivi | 321 | tout ce que le registre a jamais porté |

## Ce qui reste ouvert, par forge

La table se lit par forge cible : c'est l'unité de décision, puisqu'une correction se
livre dans un dépôt. L'ordre suit le NOMBRE d'items ouverts, jamais leur priorité — la
priorité vit dans la colonne de score.

### digit-ai-factory — 56 item(s)

Les items ouverts ciblant digit-ai-factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1054 | digit-ai-factory : le sas d'arrivee des lots est cable chez le pilot et absent du gabarit que les produits lis | candidat | digit-ai-factory | 25 |
| TF-1078 | pilot : le tableau de routage du produit ignore la forge d'audit et envoie le mot « audit » vers la forge de t | candidat | digit-ai-factory | 25 |
| TF-0959 | canal confidentiel : une clé DÉJÀ pseudonymisée peut entrer dans une table de noms réels, et rien ne l'en empê | candidat | digit-ai-factory | 20 |
| TF-1013 | pilot : la regle des quantificateurs REFUSAIT la reformulation que son propre message recommande — posee telle | candidat | digit-ai-factory | 20 |
| TF-1007 | parc : un commentaire et un message de commit qui documentaient un defaut de graphie ont ete rendus tautologiq | candidat | digit-ai-factory | 15 |
| TF-1039 | digit-ai-factory : deux sessions du meme produit ont frappe les memes identifiants de retour le meme jour, et  | candidat | digit-ai-factory | 15 |
| TF-0674 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appli | decide | digit-ai-factory | 12.5 |
| TF-0982 | pilot : les tables du canal n ont qu une date GLOBALE — chaque extension rend le passe fautif RETROACTIVEMENT, | en_cours | digit-ai-factory | 12.5 |
| TF-0682 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | en_cours | digit-ai-factory | 10 |
| TF-0965 | pilot : propager les skills a casse un test d'une forge voisine — une regle neuve du socle est mesuree sur le  | candidat | digit-ai-factory | 10 |
| TF-0990 | pilot : le referentiel de restitution declare une exemption que son juge n'implemente pas — un tour sans nouve | candidat | digit-ai-factory | 10 |
| TF-1008 | pilot : un clone rebati apres reecriture d historique garde l ANCIENNE histoire atteignable par le REMISAGE —  | candidat | digit-ai-factory | 10 |
| TF-1012 | pilot : la propagation des skills ecrase un fichier SANS trace, et la date du fichier ecrase MENT — elle porte | candidat | digit-ai-factory | 10 |
| TF-1018 | parc : UN SEUL depot sur six a une CI hebergee — le pilot, qui porte la doctrine et 104 oracles, n en a AUCUNE | candidat | digit-ai-factory | 10 |
| TF-1036 | digit-ai-factory : un document peut porter DEUX listings du meme ensemble — tableau de synthese ET fiches deta | candidat | digit-ai-factory, digit-ai-forge-agents | 10 |
| TF-1037 | digit-ai-factory : la largeur du conteneur ne depend pas du nombre de colonnes, et des cellules de trois ligne | candidat | digit-ai-factory, digit-ai-forge-design | 10 |
| TF-1038 | digit-ai-factory : deux largeurs de contenu coexistent sur la meme page, et le squelette prescrit les deux san | candidat | digit-ai-factory, digit-ai-forge-design | 10 |
| TF-1041 | socle de la chaine : un outil de qualite declare par le depot et jamais appele par la chaine est invisible — t | candidat | digit-ai-forge-development, digit-ai-factory | 10 |
| TF-1050 | pilot : le generateur d'index (readme-dossiers.mjs, hook PostToolUse) descend dans un livrable-dossier au form | candidat | digit-ai-factory | 10 |
| TF-1055 | digit-ai-factory : le protocole du sas d'arrivee n'existe que dans un dossier ignore par git, et le README sui | candidat | digit-ai-factory | 10 |
| TF-1049 | forge-agents (digit-ai-page-html) : check_html declare << Police Syne detectee >> des que le MOT Syne apparait | candidat | digit-ai-forge-agents, digit-ai-factory | 9 |
| TF-1085 | pilot : la porte pre-commit (todo/pre-commit-anonymise.mjs) reecrit un sidecar DEJA INGERE sans le re-empreint | candidat | digit-ai-factory | 9 |
| TF-1089 | pilot / forge-ops : le controle de secrets de la MEP (M-5) cherche des CLES reelles et laisse passer un secret | candidat | digit-ai-factory, digit-ai-forge-ops | 9 |
| TF-0966 | pilot : la pseudonymisation ne couvre pas les IDENTIFIANTS TECHNIQUES cites dans le corps d un item — cinq obj | candidat | digit-ai-factory | 8.3 |
| TF-0967 | pilot : oracle-conformite-projet n a AUCUN banc de fixtures, et son propre en-tete affirme le contraire — c es | candidat | digit-ai-factory | 8.3 |
| TF-1040 | socle de la chaine : rien n'ecrit qu'une porte doit pouvoir etre ROUGE, et les chaines en portent la consequen | candidat | digit-ai-forge-development, digit-ai-forge-ops, digit-ai-factory | 8.3 |
| TF-1045 | pilot : TF-0936 est clos << corrige >> et rien n'en est redescendu jusqu'au producteur — ni JARGON-A-GLOSER, n | candidat | digit-ai-factory | 8.3 |
| TF-1053 | socle de pages de donnees : aucun oracle ne compare une cellule rendue a la source dont elle se reclame, une p | candidat | digit-ai-forge-agents, digit-ai-factory | 8.3 |
| TF-1084 | pilot : un produit franchit toutes les portes de la construction et échoue 125 contrôles du référentiel d'audi | candidat | digit-ai-factory | 8.3 |
| TF-0992 | pilot : la règle S37 du juge des restitutions accuse le NOM D'UN CHAMP de la preuve — `corriges: []`, une sort | candidat | digit-ai-factory | 8 |
| TF-0993 | parc : la chaîne d'anonymisation annonce « pseudonymisé » sans dire ce qui a RÉSISTÉ — le champ `refuses` est  | candidat | digit-ai-factory | 8 |
| TF-0676 | Aucun script de capture du produit ne produit systématiquement une pleine page | decide | digit-ai-factory | 6.7 |
| TF-0983 | pilot : les vues generees du registre sont versionnees — 1173 revisions de contenu derive, qui transforment UN | candidat | digit-ai-factory | 6.7 |
| TF-1025 | pilot : un type de run « reponse a appel d offres » (references/RUN-AO.md) sur le modele de RUN-CONSEIL — go/n | decide | digit-ai-factory | 6 |
| TF-1031 | produit digit-ai-communication : un registre date des issues d appels d offres et de propales (gagne, perdu, s | decide | digit-ai-factory | 6 |
| TF-1067 | pilot (todo/generer-page.mjs) : la page generee du registre porte trois octets nuls la ou des items citent un  | candidat | digit-ai-factory | 6 |
| TF-1087 | pilot (oracle-boite-entree) : une PIECE JOINTE annoncee par son lot est jugee comme un lot sans sidecar (B3, B | candidat | digit-ai-factory | 6 |
| TF-1096 | pilot (gabarit AGENT-CAMPAGNE) : la verification native d un skill modifie ne prescrit pas de rejouer la recet | candidat | digit-ai-factory | 6 |
| TF-1100 | pilot : le RAPPEL que hook-restitution affiche a l agent cite une version du gabarit de restitution, et aucun  | candidat | digit-ai-factory | 6 |
| TF-1103 | pilot : dans un worktree lie, FORGE_ROOT se resout sous .claude/worktrees — check_html et oracle-conformite-pr | candidat | digit-ai-factory | 6 |
| TF-1003 | pilot : le preflight d ingestion compte des COMMITS la ou son invariant est un MAXIMUM D IDENTIFIANT — sur une | candidat | digit-ai-factory | 4.5 |
| TF-1009 | gabarits : SIX erreurs de mesure en une journee, AUCUNE trouvee par celui qui l avait commise — le seul mecani | candidat | digit-ai-factory | 4.5 |
| TF-1011 | pilot : la seconde condition de R-38 §4 — un enregistrement de restitution ne porte QUE des restitutions — est | candidat | digit-ai-factory | 4.5 |
| TF-1024 | pilot : faire naitre le produit autonome digit-ai-communication (depot prive sous doctrine) qui porte l instan | decide | digit-ai-factory | 4.5 |
| TF-1071 | pilot et parc : la porte des noms ne juge les MESSAGES de commit qu au pre-push — un nom de produit reel entre | candidat | digit-ai-forge-agents, digit-ai-factory | 4.5 |
| TF-1086 | pilot : la boite d entree des retours est LOCALE AU POSTE — quinze fichiers deposes sur un poste du 06/09 au 1 | candidat | digit-ai-factory | 4.5 |
| TF-1093 | produits : des fichiers de configuration porteurs de secrets sont PUBLIES sur les depots distants de deux prod | candidat | digit-ai-factory | 4.5 |
| TF-1029 | pilot (gabarits/documents) : quatre familles de gabarits absentes du catalogue — kit partenaire, charte de par | decide | digit-ai-factory | 4 |
| TF-1033 | pilot / forge-agents : la porte des noms remonte un sigle de trois lettres de la table dans digit-ai-schemas,  | candidat | digit-ai-forge-agents, digit-ai-factory | 4 |
| TF-0923 | pilot : six volets d'oracle proposés par les items du 08/09 restent non livrés, cinq d'entre eux vivant dans l | en_cours | digit-ai-factory | 3 |
| TF-1102 | pilot (gabarits/documents) : les huit fichiers docs/projet d un produit n ont aucune famille au catalogue des  | candidat | digit-ai-factory | 2 |
| TF-0836 | pilot : le hook qo-gate-write juge un template de maquette comme un livrable | en_cours | digit-ai-factory | 1 |
| TF-0838 | pilot : le skill claude-api ne documente pas fallbacks avec messages.parse | en_cours | digit-ai-factory | 1 |
| TF-1068 | digit-ai-factory : le controle ⛔ « obligatoire » d un lot de travaux pointe un chemin qui n existe chez aucune | candidat | digit-ai-factory | 1 |
| TF-1069 | digit-ai-factory : le plafond de 100 caracteres par ligne de TF-1066 et le token .chap.lire de E4 ne peuvent p | candidat | digit-ai-factory | 1 |
| TF-1070 | digit-ai-factory : le domaine << style redactionnel >> entre au registre sans declencheur automatique, faute d | candidat | digit-ai-factory | 1 |

### digit-ai-forge-agents — 25 item(s)

Les items ouverts ciblant digit-ai-forge-agents, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0984 | digit-ai-forge-agents : la regle A5 du socle est un FAUX POSITIF STRUCTUREL — toute page autoportante qui emba | candidat | digit-ai-forge-agents | 20 |
| TF-1051 | digit-ai-page-html : la note de cardinalite d'une colonne a valeur unique n'est lisible qu'a panneau ouvert, l | candidat | digit-ai-forge-agents | 20 |
| TF-1052 | digit-ai-page-html : data-tf-forme est prescrit par le referentiel G7 et n'est jamais pose dans le DOM, donc l | candidat | digit-ai-forge-agents | 20 |
| TF-0991 | parc : un contrôle borné à 200 constats déclare son vrai total dans une ligne de prose — le pilot a publié 200 | candidat | digit-ai-forge-agents | 10 |
| TF-0994 | digit-ai-forge-agents : le garde-fou anti-écrasement de l'installeur de hameçons ne tient qu'à UNE LETTRE — il | candidat | digit-ai-forge-agents | 10 |
| TF-0997 | digit-ai-forge-agents : le champ disable-model-invocation a bien ete retire des 3 skills du lexique, mais le C | candidat | digit-ai-forge-agents | 10 |
| TF-1036 | digit-ai-factory : un document peut porter DEUX listings du meme ensemble — tableau de synthese ET fiches deta | candidat | digit-ai-factory, digit-ai-forge-agents | 10 |
| TF-1022 | forge-agents : l archive digit-ai-pptx.skill charge << toujours >> references/charte.md, layouts.md et assets. | candidat | digit-ai-forge-agents | 9 |
| TF-1030 | forge-design / forge-agents : la transparence des contenus generes (AI Act article 50, en vigueur depuis le 20 | en_cours | digit-ai-forge-design, digit-ai-forge-agents | 9 |
| TF-1049 | forge-agents (digit-ai-page-html) : check_html declare << Police Syne detectee >> des que le MOT Syne apparait | candidat | digit-ai-forge-agents, digit-ai-factory | 9 |
| TF-1053 | socle de pages de donnees : aucun oracle ne compare une cellule rendue a la source dont elle se reclame, une p | candidat | digit-ai-forge-agents, digit-ai-factory | 8.3 |
| TF-0938 | digit-ai-forge-agents (digit-ai-schemas / digit-ai-page-html) : aucun gabarit de schéma de base de données DIF | en_cours | digit-ai-forge-agents | 6.7 |
| TF-0940 | digit-ai-forge-agents / digit-ai-forge-audit : deux implémentations du schéma de base de données coexistent (r | en_cours | digit-ai-forge-agents, digit-ai-forge-audit | 6.7 |
| TF-1094 | forge-agents (digit-ai-page-html) : le SKILL.md du socle echoue au controle generique C1 avec huit chemins cit | candidat | digit-ai-forge-agents | 6 |
| TF-1095 | forge-agents : le manifeste versions-livrees.json n a jamais vu quatre skills (communication, pptx, propale, p | candidat | digit-ai-forge-agents | 6 |
| TF-1002 | quality-oracles : la porte de publication accuse un sigle DANS un mot ordinaire, et localise son constat sur l | candidat | digit-ai-forge-agents | 4.5 |
| TF-1021 | forge-agents : quatre skills exerces (communication, propale, propale-review, pptx) ne sont versionnes par auc | candidat | digit-ai-forge-agents | 4.5 |
| TF-1023 | forge-design / forge-agents : la marque Digit-AI est portee par deux chartes contradictoires (pptx : Montserra | en_cours | digit-ai-forge-design, digit-ai-forge-agents | 4.5 |
| TF-1026 | forge-agents (digit-ai-propale) : construire de facon outillee le referentiel d exigences depuis un reglement  | en_cours | digit-ai-forge-agents, digit-ai-forge-conception | 4.5 |
| TF-1071 | pilot et parc : la porte des noms ne juge les MESSAGES de commit qu au pre-push — un nom de produit reel entre | candidat | digit-ai-forge-agents, digit-ai-factory | 4.5 |
| TF-1033 | pilot / forge-agents : la porte des noms remonte un sigle de trois lettres de la table dans digit-ai-schemas,  | candidat | digit-ai-forge-agents, digit-ai-factory | 4 |
| TF-1099 | hook global qo-gate-write : sur une page HTML, le wrapper du bucket « Rendu HTML / visuel » annonce que l orac | candidat | digit-ai-forge-agents | 4 |
| TF-1028 | forge-agents (la-barre) : trois barres externes pour les livrables de communication — propale privee, memoire  | en_cours | digit-ai-forge-agents | 3 |
| TF-1032 | forge-agents : digit-ai-propale et digit-ai-propale-review restent NON CONFORMES a run-oracles sur des defauts | candidat | digit-ai-forge-agents | 3 |
| TF-1097 | forge-agents (digit-ai-page-html) : render_page.py coute environ 30 s par page — une mesure de bruit sur le pa | candidat | digit-ai-forge-agents | 2 |

### digit-ai-forge-design — 12 item(s)

Les items ouverts ciblant digit-ai-forge-design, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1056 | forge-design : la regle S1 d'oracle-slop refuse un triangle CSS comme un bandeau lateral, et ce refus plafonne | candidat | digit-ai-forge-design | 25 |
| TF-1062 | quality-oracles : oracle-a11y compte les identifiants dupliques a l'interieur des commentaires de script et re | candidat | quality-oracles, digit-ai-forge-design | 20 |
| TF-1057 | forge-design : oracle-tokens lit les jetons d'un bloc @media print comme ceux du theme sombre, et declenche un | candidat | digit-ai-forge-design | 12.5 |
| TF-1037 | digit-ai-factory : la largeur du conteneur ne depend pas du nombre de colonnes, et des cellules de trois ligne | candidat | digit-ai-factory, digit-ai-forge-design | 10 |
| TF-1038 | digit-ai-factory : deux largeurs de contenu coexistent sur la meme page, et le squelette prescrit les deux san | candidat | digit-ai-factory, digit-ai-forge-design | 10 |
| TF-1030 | forge-design / forge-agents : la transparence des contenus generes (AI Act article 50, en vigueur depuis le 20 | en_cours | digit-ai-forge-design, digit-ai-forge-agents | 9 |
| TF-1034 | forge-design : le corpus tokens-digit-ai.tokens.json (mode digit-ai de systeme-de-marque) n est plus la charte | candidat | digit-ai-forge-design | 9 |
| TF-1059 | digit-ai-page-html : les composants du socle portent 40 ecarts durs, et l'exemption prevue pour cela est hors  | candidat | digit-ai-page-html, digit-ai-forge-design | 8.3 |
| TF-1058 | forge-design : la regle T8 confronte l'anneau de focus a tout jeton nomme -bg, remplissages de composants comp | candidat | digit-ai-forge-design | 7.5 |
| TF-1035 | forge-design (systeme-de-marque) : deux outils du systeme de marque ne tiennent pas leur propre contrat — gene | candidat | digit-ai-forge-design | 6 |
| TF-1023 | forge-design / forge-agents : la marque Digit-AI est portee par deux chartes contradictoires (pptx : Montserra | en_cours | digit-ai-forge-design, digit-ai-forge-agents | 4.5 |
| TF-1091 | forge-tests / forge-design : la loi n 1 (toute affordance est cablee ou n existe pas) n a aucun controle de PE | candidat | digit-ai-forge-tests, digit-ai-forge-design | 1.3 |

### factory — 10 item(s)

Les items ouverts ciblant factory, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1073 | factory : readme-dossiers.mjs et generer-lisezmoi-output.mjs lances depuis un depot produit sans --base ecrive | candidat | factory | 20 |
| TF-1076 | factory : forge/ledger.py accepte et ecrit une entree sans aucun champ (type connu, ni etape ni resume) | candidat | factory | 20 |
| TF-1077 | factory : forge/ledger.py ecrit l entree puis plante a l affichage (UnicodeEncodeError cp1252) et sort en code | candidat | factory | 10 |
| TF-1074 | factory : recopier-heritage.mjs depose robots.txt et llms.txt (gabarits a placeholders) a la racine d un produ | candidat | factory | 7.5 |
| TF-1075 | factory : R-42 (integrite du ledger) rend FAIL sans voie de declaration pour une anteriorite — verdict permane | candidat | factory | 5 |
| TF-0963 | factory : les trois pieces de la doctrine peuvent etre toutes presentes et conformes chez le produit et ne JAM | decide | factory | 1 |
| TF-0964 | factory : une lecon payee et commentee dans un module d un produit n a aucun mecanisme pour atteindre le modul | en_cours | factory | 1 |
| TF-1046 | factory : un controle de securite ecrit a la main faute d avoir cherche l oracle du domaine (digit-ai-forge-we | candidat | factory, digit-ai-forge-websec | 1 |
| TF-1047 | factory : une session a racine ENGLOBANTE echappe au hook de restitution et livre une sortie non jugee (recidi | candidat | factory | 1 |
| TF-1048 | factory : un ecart socle detecte en cours de mandat n est remonte qu apres relance humaine, faute d obligation | candidat | factory | 1 |

### digit-ai-forge-audit — 8 item(s)

Les items ouverts ciblant digit-ai-forge-audit, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1079 | forge-audit : le moteur de rapport borne les dimensions à D16 alors que le référentiel en porte dix-huit | candidat | digit-ai-forge-audit | 20 |
| TF-1000 | forge-audit : la charte d exemple fictive livree avec la forge prime sur la typographie declaree du tenant | candidat | digit-ai-forge-audit | 15 |
| TF-1001 | forge-audit : six champs que le moteur de rapport sait rendre restent vides sans que la porte machine le dise | candidat | digit-ai-forge-audit | 10 |
| TF-1080 | forge-audit : le contrôle de redite applique le seuil des paires d'un même domaine à tout le plan | candidat | digit-ai-forge-audit | 10 |
| TF-1020 | forge-audit : sur le runner Linux la fiche PDF sort sur DEUX pages au lieu d une et le juge la refuse (P3), pe | candidat | digit-ai-forge-audit | 9 |
| TF-0940 | digit-ai-forge-agents / digit-ai-forge-audit : deux implémentations du schéma de base de données coexistent (r | en_cours | digit-ai-forge-agents, digit-ai-forge-audit | 6.7 |
| TF-1092 | forge-audit : sur ce poste, deux etapes de la recette locale (portes de la fiche securite, batterie des oracle | candidat | digit-ai-forge-audit | 6 |
| TF-1081 | forge-audit : le runbook d'onboarding fait écrire l'espace tenant dans le dépôt de la forge | candidat | digit-ai-forge-audit | 1 |

### digit-ai-forge-tests — 7 item(s)

Les items ouverts ciblant digit-ai-forge-tests, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1043 | socle de la chaine : une suite non jouee par la chaine ne dit RIEN, et un correctif de securite peut la rendre | candidat | digit-ai-forge-development, digit-ai-forge-tests, digit-ai-forge-agents-security | 12.5 |
| TF-1082 | forge-tests : la forge ne monte pas l'instance et son motif d'échec ne le dit pas | candidat | digit-ai-forge-tests | 10 |
| TF-1088 | forge-tests / forge-websec : aucun controle ne lit le TEXTE SERVI d une page pour y trouver un identifiant ou  | candidat | digit-ai-forge-tests, digit-ai-forge-websec | 4.5 |
| TF-1090 | forge-tests : aucun controle ne verifie qu un ETAT CLIENT survit a une navigation — le panier se vidait en ouv | candidat | digit-ai-forge-tests | 4.5 |
| TF-1101 | forge-tests ou forge-websec : aucun oracle statique ne signale un fournisseur de jetons construit sans identif | candidat | digit-ai-forge-tests, digit-ai-forge-websec | 3 |
| TF-1091 | forge-tests / forge-design : la loi n 1 (toute affordance est cablee ou n existe pas) n a aucun controle de PE | candidat | digit-ai-forge-tests, digit-ai-forge-design | 1.3 |
| TF-1083 | forge-tests : la clé du document de provenance de l'instance n'est pas documentée dans sa forme légère | candidat | digit-ai-forge-tests | 1 |

### digit-ai-forge-development — 5 item(s)

Les items ouverts ciblant digit-ai-forge-development, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1043 | socle de la chaine : une suite non jouee par la chaine ne dit RIEN, et un correctif de securite peut la rendre | candidat | digit-ai-forge-development, digit-ai-forge-tests, digit-ai-forge-agents-security | 12.5 |
| TF-1041 | socle de la chaine : un outil de qualite declare par le depot et jamais appele par la chaine est invisible — t | candidat | digit-ai-forge-development, digit-ai-factory | 10 |
| TF-1042 | socle de la chaine : la parite entre l'environnement de test et l'image servie n'est controlee nulle part — CI | candidat | digit-ai-forge-development, digit-ai-forge-ops | 10 |
| TF-1072 | digit-ai-forge-development : le controle heberge << double-gate >> echoue depuis le 08/09 sur trois lignes tro | candidat | digit-ai-forge-development | 9 |
| TF-1040 | socle de la chaine : rien n'ecrit qu'une porte doit pouvoir etre ROUGE, et les chaines en portent la consequen | candidat | digit-ai-forge-development, digit-ai-forge-ops, digit-ai-factory | 8.3 |

### digit-ai-forge-ops — 3 item(s)

Les items ouverts ciblant digit-ai-forge-ops, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1042 | socle de la chaine : la parite entre l'environnement de test et l'image servie n'est controlee nulle part — CI | candidat | digit-ai-forge-development, digit-ai-forge-ops | 10 |
| TF-1089 | pilot / forge-ops : le controle de secrets de la MEP (M-5) cherche des CLES reelles et laisse passer un secret | candidat | digit-ai-factory, digit-ai-forge-ops | 9 |
| TF-1040 | socle de la chaine : rien n'ecrit qu'une porte doit pouvoir etre ROUGE, et les chaines en portent la consequen | candidat | digit-ai-forge-development, digit-ai-forge-ops, digit-ai-factory | 8.3 |

### digit-ai-forge-data — 3 item(s)

Les items ouverts ciblant digit-ai-forge-data, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1065 | forge-data : fastparquet, seul moteur Parquet disponible sous controle d'application, ecrit des horodatages en | candidat | digit-ai-forge-data | 20 |
| TF-1044 | forge-data : la correction TF-0936 garde << grain >> dans un registre machine (commentaires DDL, messages d'or | candidat | digit-ai-forge-data | 10 |
| TF-1098 | forge-data : les lecteurs livres le 14/09 lisent les formats TEXTE (PBIR, CSV) et non les fichiers BINAIRES qu | candidat | digit-ai-forge-data | 3 |

### digit-ai-forge-websec — 3 item(s)

Les items ouverts ciblant digit-ai-forge-websec, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1088 | forge-tests / forge-websec : aucun controle ne lit le TEXTE SERVI d une page pour y trouver un identifiant ou  | candidat | digit-ai-forge-tests, digit-ai-forge-websec | 4.5 |
| TF-1101 | forge-tests ou forge-websec : aucun oracle statique ne signale un fournisseur de jetons construit sans identif | candidat | digit-ai-forge-tests, digit-ai-forge-websec | 3 |
| TF-1046 | factory : un controle de securite ecrit a la main faute d avoir cherche l oracle du domaine (digit-ai-forge-we | candidat | factory, digit-ai-forge-websec | 1 |

### digit-ai-page-html — 3 item(s)

Les items ouverts ciblant digit-ai-page-html, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1060 | digit-ai-page-html : la regle V15 de render_page signale comme masque un en-tete collant que son propre tablea | candidat | digit-ai-page-html | 10 |
| TF-1061 | digit-ai-page-html : la regle V4 signale comme chevauchement un en-tete position: sticky recouvrant le contenu | candidat | digit-ai-page-html | 10 |
| TF-1059 | digit-ai-page-html : les composants du socle portent 40 ecarts durs, et l'exemption prevue pour cela est hors  | candidat | digit-ai-page-html, digit-ai-forge-design | 8.3 |

### pilot — 2 item(s)

Les items ouverts ciblant pilot, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-0549 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : | decide | pilot | 10 |
| TF-0791 | Cascade Intention > Strategie > Tactique > Operationnel + test retro : la definition des demandes ne capture p | en_cours | pilot | 6.7 |

### digit-ai-forge-conception — 1 item(s)

Les items ouverts ciblant digit-ai-forge-conception, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1026 | forge-agents (digit-ai-propale) : construire de facon outillee le referentiel d exigences depuis un reglement  | en_cours | digit-ai-forge-agents, digit-ai-forge-conception | 4.5 |

### digit-ai-forge-agents-security — 1 item(s)

Les items ouverts ciblant digit-ai-forge-agents-security, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1043 | socle de la chaine : une suite non jouee par la chaine ne dit RIEN, et un correctif de securite peut la rendre | candidat | digit-ai-forge-development, digit-ai-forge-tests, digit-ai-forge-agents-security | 12.5 |

### quality-oracles — 1 item(s)

Les items ouverts ciblant quality-oracles, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1062 | quality-oracles : oracle-a11y compte les identifiants dupliques a l'interieur des commentaires de script et re | candidat | quality-oracles, digit-ai-forge-design | 20 |

### digit-ai-schemas — 1 item(s)

Les items ouverts ciblant digit-ai-schemas, du score le plus fort au plus faible. Le score est
celui du registre (gain x preuve / effort) : il ordonne, il ne decide pas.

| Id | Titre | Statut | Forge(s) | Score |
|---|---|---|---|---|
| TF-1063 | digit-ai-schemas : le canevas de modele de donnees ne definit sa palette qu'en theme clair — 36 ecarts durs, e | candidat | digit-ai-schemas | 20 |

## Ce que ce rapport ne dit pas

- **Il ne dit pas l'effort restant** : le registre porte un score de valeur, pas une charge.
  Un rapport qui additionnerait des scores fabriquerait une charge qui n'a jamais été estimée.
- **Il ne dit pas la cadence** : la date de la prochaine émission est une donnée d'instance
  (`gabarits\cadence\README.md`), jamais une valeur codée dans ce script.
- **Il ne juge aucun gain** : les gains constatés sont ceux que les items déclarent. Leur
  vérification est le travail de l'oracle du registre, pas de cette vue.

