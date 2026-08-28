# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=f7057cd488af archive=72692a35ee91 · dernier événement: 2026-08-28T07:54:29.488Z -->

**26 actifs** (candidat 22 · décidé 2 · en cours 0 · corrigé 2 · écarté 0) · **678 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0674 | candidat | 12.5 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appliqué | non |
| TF-0682 | candidat | 10 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | non |
| TF-0680 | candidat | 7.5 | Un lot de travaux dont le contenu est un SOUS-ENSEMBLE d'un lot déjà déposé est redéposé quand même | non |
| TF-0676 | candidat | 6.7 | Aucun script de capture du produit ne produit systématiquement une pleine page | non |
| TF-0684 | candidat | 5 | Six recettes échappent à toute mesure rétrospective : leur idiome de déclaration de cas n'est reconnu par rien | non |
| TF-0685 | candidat | 4 | hook-produits-intacts : tout ce qui DISCULPE un mouvement est avalé dès qu'un seul écart existe — `declares` est rendu après un `process.exit(0)` | non |
| TF-0699 | corrige | 40 | pilot : une decision du bloc 3 n'a jamais porte de NUMERO, et le destinataire l'inventait pour pouvoir repondre | **oui** — Deux restitutions repondues par une numerotation INVENTEE par le lecteur (« 1b, 2a, 3a », puis « a »), et une troisieme ou il a declare ne pas pouvoir selectionner. La regle neuve, jouee sur la restitution incriminee, rend « 3 decision(s) sur 3 SANS NUMERO ». |
| TF-0698 | corrige | 20 | pilot : l'archiveur DEFINISSAIT depuis six jours la fonction qui fait suivre les rectifications a leurs cibles, et ne l'APPELAIT jamais | **oui** — Six constats R9 et un registre entier en FAIL, sur un archivage par ailleurs correct. Le cout n'est pas l'archivage rate : c'est qu'un correctif ECRIT et COMMENTE six jours plus tot n'a servi a rien faute d'un appel, et que son commentaire decrivait exactement l'incident qu'il n'a pas empeche. |

## digit-ai-forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0700 | candidat | 9 | audit : le livrable DIFFUSE de la fiche securite est un PDF, que le kit ne prescrit pas, n outille pas et ne controle pas — le projet a diffuse une IMAGE, d un indice anterieur au HTML depose a cote | **oui** — PDF diffuse le 24/07 : 1 page, 0 caractere extractible, 9 images, 653169 octets, indice c — contre un HTML voisin d indice d. Aucune porte ne l a vu. |
| TF-0701 | candidat | 6 | audit : la fiche securite n a AUCUN verificateur alors que ses deux regles sont mecaniques, et que le rapport d audit, lui, a une porte bloquante | **oui** — Deux regles ecrites au paragraphe 10 et tenues par personne ; le seul artefact relu est celui qui n est pas diffuse. |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0665 | decide | 5.6 | Un nombre affiché dont aucune source du dépôt ne rend compte est un nombre orphelin, et personne ne le lui demande | non |

## digit-ai-page-html

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0694 | candidat | 1 | digit-ai-page-html : la regle l2_gouttiere decrit EXACTEMENT ce defaut, au seuil exact, et rend PASS dessus - elle ne regarde que les grilles CSS, jamais les table | **oui** — Execute le 27/08/2026 : python render_page.py sur la fiche fautive 'Client-A - CAL - Fiche Securite Mise a disposition - Dev - 20260827b.html' (colonne d intitules a 32 %), --widths 1440 --output json. Resultat : verdict PASS, et l2_gouttiere : 0 constat - de meme que v1_overflow, v2_contrast, v4_overlap, l2_width, l2_conteneur, l2_filet, l2_freres, tous a 0. Le socle rend donc PASS sur le document meme que la regle est faite pour condamner. Cout constate : le defaut a traverse DEUX fiches livrees et TROIS regenerations avant qu un humain ne l ouvre et ne le dise. Mesure du gaspillage : 12,6 % a 19,4 % de la largeur de page perdus sur 7 tables sur 8. |

## factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0686 | candidat | 1 | factory : un paquet OOXML genere peut etre invalide sans que rien ne le signale a la generation | **oui** — un livrable remis au client, refuse a l ouverture par PowerPoint, plus un aller-retour complet de correction ; la reparation proposee degrade le formatage sans le dire |
| TF-0687 | candidat | 1 | factory : quand un document de reference est fourni, la charte est deduite au lieu d etre relevee | **oui** — un livrable entierement refait apres le verdict du destinataire : « ne respecte pas DU TOUT la charte Client-A du document fourni en entree ». Le support ne portait pas non plus de schema d architecture, dans une Design Review d architecture |
| TF-0688 | candidat | 1 | factory : la destination des documents produits n est declaree nulle part | **oui** — une reprise demandee explicitement par le destinataire |
| TF-0689 | candidat | 1 | factory : une correction marquee `corrige` n est jamais suivie jusqu au produit | **oui** — un jeu de livrables remis incomplet DEUX FOIS sur le meme produit apres correction, et trois produits ayant remonte la meme classe en trois jours. Le destinataire a du reclamer le PDF en disant qu il l avait deja demande — il avait raison, la demande etait tracee en TF-0506 et corrigee quatre jours plus tot |
| TF-0690 | candidat | 1 | factory : un livrable produit ne porte ni l identifiant ni la version de son gabarit | **oui** — impossible de dater la conformite d une fiche remise ; la section R-46 du gabarit de retours ne peut etre remplie par aucun produit de la famille, ce qui rend muet le seul canal d amelioration des gabarits |
| TF-0702 | candidat | 1 | factory : les generateurs des produits sont des REECRITURES de ceux de la factory, donc hors d atteinte de toute correction | **oui** — une correction de la factory datee du 23/08 n a pu atteindre ni la remise du 25/08 ni celle du 27/08 du produit explicitement nomme beneficiaire, parce que le generateur du produit est ecrit dans un autre langage et lit un gabarit impose par le client que l outil de la factory ne sait pas consommer ; la cause proposee en RT-39, un livrable detache de son generateur, etait fausse |
| TF-0703 | candidat | 1 | factory : le protocole de retours n a aucun canal de rectification d un lot remis | **oui** — un lot deja remis porte une affirmation fausse sur son propre produit, relevee par le destinataire humain le 28/08 ; le protocole n offrait aucun geste pour la dedire, et seule l absence d ingestion a ce jour empeche la factory d agir sur une cause erronee |

## forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0693 | candidat | 1 | forge-audit : la famille gd-fiche-securite ne fournit aucune allocation d indice avec son gabarit, alors que toute fiche est regeneree plusieurs fois par jour | **oui** — Le commanditaire a demande a la relecture, le 27/08/2026 : pourquoi la regle de nouvelle version de fichier avec nouvel indice n est pas respectee dans la generation de nouveaux fichiers comme la fiche securite ? La question porte sur le NOM du livrable et non sur son contenu : c est le premier signal recu que quatre versions s etaient ecrasees. Cout direct : quatre ecrasements, dont deux pousses, et un aller-retour humain. |
| TF-0697 | candidat | 1 | forge-audit : le gabarit gd-fiche-securite reserve 32 % de la page a une colonne d intitules courts - correctif mesure disponible | **oui** — Mesure avant correction : 32 % reserves, 12,6 % a 19,4 % GASPILLES sur 7 tables sur 8. Apres : 0,6 % a 7,4 %, soit 68 % -> 80 % de largeur rendue au texte, sans debordement (scrollWidth == clientWidth verifie a 739 px). Le commanditaire a demande la correction apres avoir ouvert le PDF, le 27/08/2026 : reduire la premiere colonne 'afin de laisser plus d espace pour la largeur de la deuxieme colonne qui contient plus de texte'. Le defaut avait traverse deux fiches livrees et trois regenerations. |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0549 | decide | 10 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : `Produit-07` a un forge\retours\ mais rien de ce qui s'y fait n'est suivi | **oui** — mesure le 24/08 : sur les trois produits localisables du poste, DEUX sont en defaut d'heritage et UN n'a jamais ete instancie — soit zero produit conforme sur trois. Celui decouvert aujourd'hui cumule quatre artefacts absents et l'absence totale de depot git : tout travail qui y serait fait est hors de portee d'un `git log`, d'un `git diff` et de toute restauration. |
| TF-0691 | candidat | 1 | pilot : le cablage de la regle 5 DETECTE apres coup, il n ALLOUE jamais avant d ecrire - un livrable produit par script n est donc protege par rien | **oui** — Mesure sur le depot Produit-04 le 27/08/2026 : le nom Client-A - CAL - Fiche Securite Mise a disposition - Dev - 20260827a.html a designe TROIS contenus differents - empreintes SHA-256 dac2a310e9acb164 (commit 25c59fd), e0ace645febd37ce (commit 7e3e9ff), 54ceefbdb0bbd68b (arbre de travail) - dont DEUX ont ete POUSSES sur origin/main. Quatre ecritures horodatees 15:45, 15:46, 16:05 et 16:24, soit quatre ecrasements en 80 minutes. Aucun controle n a rien vu, et il n y avait rien a voir : le fichier n etait pas scelle. Defaut trouve par relecture humaine du commanditaire, qui a demande pourquoi la regle d indice n etait pas respectee. |
| TF-0692 | candidat | 1 | pilot : le sceau ne couvre pas les PDF, alors que des familles declarent deux formats - la paire se desynchronise sans que rien ne le dise | **oui** — Fait observe le 27/08/2026 sur le depot Produit-04 : apres regeneration, le HTML portait le contenu de 16:24 et le PDF celui de 16:05, le PDF n ayant pas pu etre reecrit (verrou de visionneuse Windows). Verifie par empreinte : le PDF sur disque etait identique a celui du commit precedent (cf2e64cdbee70f0c) tandis que le HTML etait modifie dans l arbre. Les deux fichiers ont coexiste sous le meme nom de base, disant deux choses differentes, pendant huit minutes, et ils etaient a un git add de partir ensemble. Le seul rempart a ete un controle LOCAL au produit (fraicheur du PDF), pas le sceau du pilot, qui ne regardait pas ce fichier. |
| TF-0695 | candidat | 1 | pilot : le controle de rendu ne s execute jamais sur un livrable de produit, il ne balaie que les instances de reference du pilot | **oui** — Lecture du code le 27/08/2026 : ligne 78 de scripts\verifier-rendu-instances.mjs, const dossier = join(PILOT, 'gabarits', 'documents'). Cout constate sur ce produit : la fiche securite, document lu par un RSSI, a ete produite et remise trois fois sans qu aucun controle de rendu ne s execute dessus - alors que le socle capable de la juger est installe sur le meme poste. Le defaut de mise en page a ete trouve par l oeil du commanditaire. |
| TF-0696 | candidat | 1 | pilot : les FICHES sont explicitement hors du perimetre de l oracle de gabarits, et aucun autre controle ne les reprend | **oui** — Le non_juge cite est lisible aux lignes 218-223 de oracles\oracle-gabarits-documents.mjs, releve le 27/08/2026. Cout constate : le gabarit Client-A de la fiche securite (20260710a) portait td.k{width:32%} depuis sa creation en juillet et n a jamais ete juge par quoi que ce soit, ni sur sa forme ni sur son rendu, jusqu a la relecture humaine du 27/08. |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
