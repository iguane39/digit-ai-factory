# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=11c886e22f59 archive=ccd0c3192f84 · dernier événement: 2026-09-01T13:25:13.281Z -->

**31 actifs** (candidat 7 · décidé 23 · en cours 1 · corrigé 0 · écarté 0) · **721 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0674 | decide | 12.5 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appliqué | non |
| TF-0682 | decide | 10 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | non |
| TF-0676 | decide | 6.7 | Aucun script de capture du produit ne produit systématiquement une pleine page | non |
| TF-0742 | candidat | 25 | digit-ai-factory : l'anonymisation ne connaît qu'UNE graphie du nom d'un produit — la forme espacée traverse et entre au registre | **oui** — 2 occurrences du nom réel d'un produit entrées au registre suivi malgré un message [ANONYMISE] affiché ; récidive de la classe TF-0712 en un jour |
| TF-0740 | candidat | 1 | Gestion des heures : l'ecart declare qui remplacait la solution disponible, et le patron heure-locale-sur-planificateur-UTC | non |
| TF-0741 | candidat | 1 | Etude poussee de la strategie DataForSEO pour Produit-02 : interet, services, objectifs, donnees, suivis, resultats, couts | non |

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0718 | decide | 15 | quality-oracles : un effectif annonce en toutes lettres n est compare a rien — « sept ecarts » en tete d un tableau qui en porte huit, dans trois versions livrees | **oui** — Decalage present dans trois versions livrees et vert a quatre portes ; trouve a la main, hors de tout controle. |
| TF-0715 | decide | 12.5 | quality-oracles : aucun domaine ne verifie l AUTORITE d une decision affirmee — un livrable peut ecrire « Decideur : le prestataire, pour le client » et sortir vert | **oui** — Defaut alle jusqu au client sur un livrable vert a quatre portes ; correction d une phrase par le client, puis regeneration complete du rapport et reprise de cinq emplacements. |
| TF-0717 | decide | 8.3 | experts-forge : un angle declare vide le 20/08 a produit le 31/08 exactement le defaut qu il aurait attrape — fiche « migration de plateforme brownfield » jamais ecrite | **oui** — Angle vide declare le 20/08 et non comble ; defaut correspondant trouve par le client le 31/08, apres qu une contre-expertise complete et quatre portes automatiques l aient laisse passer. |
| TF-0716 | decide | 6.7 | quality-oracles : aucun domaine ne teste si une consequence declaree est LIVRABLE — « l utilisateur decouvre en production » passe les quatre portes | **oui** — Formulation presente dans six versions livrees et validee par quatre portes ; reaction directe du client, quatre lignes du rapport reecrites et un ecart neuf declare. |

## digit-ai-forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0700 | decide | 9 | audit : le livrable DIFFUSE de la fiche securite est un PDF, que le kit ne prescrit pas, n outille pas et ne controle pas — le projet a diffuse une IMAGE, d un indice anterieur au HTML depose a cote | **oui** — PDF diffuse le 24/07 : 1 page, 0 caractere extractible, 9 images, 653169 octets, indice c — contre un HTML voisin d indice d. Aucune porte ne l a vu. |
| TF-0701 | decide | 6 | audit : la fiche securite n a AUCUN verificateur alors que ses deux regles sont mecaniques, et que le rapport d audit, lui, a une porte bloquante | **oui** — Deux regles ecrites au paragraphe 10 et tenues par personne ; le seul artefact relu est celui qui n est pas diffuse. |

## digit-ai-forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0720 | decide | 15 | digit-ai-page-html : M18 refuse une glose correcte quand une emphase ou un retour a la ligne s intercale entre le jeton et sa parenthese — deuxieme fois que le balisage casse une adjacence | **oui** — Quatre refus successifs a l ecriture de ce lot, dont deux sur du contenu conforme ; meme cause qu un faux positif deja signale le 22/08 sur un autre oracle. |
| TF-0707 | decide | 10 | design : un choix exclusif se pose AVANT les champs qu'il commande, jamais au milieu d'un formulaire qui les affiche deja tous | **oui** — inspection utilisateur en production : l'ecran a ete mal compris par son destinataire, qui a deduit une alternative inexistante entre deux moitiees du meme flux. |
| TF-0719 | decide | 10 | digit-ai-page-html : le badge acte n est pas resolvant — il affirme un statut que rien ne verifie, et il a porte une decision qui n a jamais ete prise | **oui** — Badge acte pose a tort sur cinq emplacements d un livrable client, vert a check_html et render_page ; corrige seulement apres intervention du client. |
| TF-0736 | decide | 6.7 | forge-design : aucun referentiel ne dit qu'un champ de saisie doit etre TYPE a son format, PROPOSE selon son contexte et BORNE par son sens — chaque ecran improvise | **oui** — retour utilisateur avec capture sur un ecran livre et audite (campagne v0.4.0 : interface 233/235, le defaut n'etait pas mesurable — les affordances etaient cablees, c'est la valeur et la borne qui manquaient) ; correctif produit : 1 service, 1 contexte, 2 champs, 4 tests, une soiree. |
| TF-0739 | candidat | 10 | forge-design : la cible de geste d'un composant composite n'est un critere d'aucun referentiel — sur un champ date natif, seule une icone de vingt pixels ouvre le calendrier | **oui** — second retour utilisateur en deux jours sur le meme composant d'un ecran livre et audite (apres la valeur et les bornes, la cible de geste) ; correctif produit : 8 lignes de script global, 1 test, une demi-heure — le cout est dans la redecouverte par chaque produit, pas dans le correctif. |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0728 | decide | 10 | forge-tests : le detecteur statique de codes declares ne voit pas une emission sous garde try/except — 4 faux ecarts par campagne | **oui** — 4 faux ecarts a analyser a la main par campagne, contredits par une section du meme rapport (rapport-20260831.json, divergences statiques vs pan api). |
| TF-0727 | decide | 6.3 | forge-tests : demande d'etude approfondie — strategie de tests et temps d'execution des campagnes (selection d'impact, mutation ciblee, parallelisation, distribution), sans perte de qualite | **oui** — 67 min de campagne dont ~54 min de mutation mesurees au rapport-20260831.json et au journal forge/avancement.jsonl, pour une suite produit qui tourne en ~52 s ; 37 s/mutant contre 52 s de suite complete = le rejeu est quasi integral par mutant. |
| TF-0708 | decide | 6 | tests : distinguer deux motifs legitimes d'ecran de creation plutot que d'imposer le formulaire replie partout | **oui** — un test d'exigence d'interface a du etre assoupli pour laisser passer une refonte qui corrigeait un defaut d'ergonomie reel. |
| TF-0665 | decide | 5.6 | Un nombre affiché dont aucune source du dépôt ne rend compte est un nombre orphelin, et personne ne le lui demande | non |
| TF-0744 | candidat | 20 | digit-ai-forge-tests : la valeur « ~37 s par mutant » publiee au rapport ne se reconcilie ni avec la duree de mutation ni avec celle de la campagne | **oui** — une valeur publiee arithmetiquement impossible (115 x 37 s = 71 min > 67 min de campagne) ; tout gain calcule dessus est surevalue d'environ 31 % |

## digit-ai-page-html

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0694 | decide | 1 | digit-ai-page-html : la regle l2_gouttiere decrit EXACTEMENT ce defaut, au seuil exact, et rend PASS dessus - elle ne regarde que les grilles CSS, jamais les table | **oui** — Execute le 27/08/2026 : python render_page.py sur la fiche fautive 'Client-A - CAL - Fiche Securite Mise a disposition - Dev - 20260827b.html' (colonne d intitules a 32 %), --widths 1440 --output json. Resultat : verdict PASS, et l2_gouttiere : 0 constat - de meme que v1_overflow, v2_contrast, v4_overlap, l2_width, l2_conteneur, l2_filet, l2_freres, tous a 0. Le socle rend donc PASS sur le document meme que la regle est faite pour condamner. Cout constate : le defaut a traverse DEUX fiches livrees et TROIS regenerations avant qu un humain ne l ouvre et ne le dise. Mesure du gaspillage : 12,6 % a 19,4 % de la largeur de page perdus sur 7 tables sur 8. |

## forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0693 | decide | 1 | forge-audit : la famille gd-fiche-securite ne fournit aucune allocation d indice avec son gabarit, alors que toute fiche est regeneree plusieurs fois par jour | **oui** — Le commanditaire a demande a la relecture, le 27/08/2026 : pourquoi la regle de nouvelle version de fichier avec nouvel indice n est pas respectee dans la generation de nouveaux fichiers comme la fiche securite ? La question porte sur le NOM du livrable et non sur son contenu : c est le premier signal recu que quatre versions s etaient ecrasees. Cout direct : quatre ecrasements, dont deux pousses, et un aller-retour humain. |
| TF-0697 | decide | 1 | forge-audit : le gabarit gd-fiche-securite reserve 32 % de la page a une colonne d intitules courts - correctif mesure disponible | **oui** — Mesure avant correction : 32 % reserves, 12,6 % a 19,4 % GASPILLES sur 7 tables sur 8. Apres : 0,6 % a 7,4 %, soit 68 % -> 80 % de largeur rendue au texte, sans debordement (scrollWidth == clientWidth verifie a 739 px). Le commanditaire a demande la correction apres avoir ouvert le PDF, le 27/08/2026 : reduire la premiere colonne 'afin de laisser plus d espace pour la largeur de la deuxieme colonne qui contient plus de texte'. Le defaut avait traverse deux fiches livrees et trois regenerations. |

## forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0749 | decide | 10 | Le ciblage par ligne mutee reste eteint jusqu'a sa verification, et la verification cesse d'etre une intention : elle est jouable | **oui** — surcout fixe mesure a 0,386 s par mutant contre 28,2 s de rejeu actuel ; la condition de non-perte de l'etude n'avait aucun executant avant ce lot |
| TF-0748 | decide | 5 | Palier 1 de la strategie de tests livre derriere un drapeau : la CONDITION DE NON-PERTE reste a jouer une fois sur un projet reel avant qu'il devienne le defaut | **oui** — campagne mesuree a 67 min dont 54 de mutation, 28,2 s par mutant ; surcout fixe mesure a 0,386 s |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0732 | en_cours | 10 | poste : le gate d'ecriture C7 juge le FICHIER ENTIER, pas le delta — et sa regle « DM Sans bannie » contredit la charte maison : tout gabarit HTML de la bibliotheque est inedittable sans friction | **oui** — quatre editions de trois lignes bloquees en un tour pour des defauts anterieurs ; sans arbitrage, CHAQUE evolution future d'un gabarit HTML de la bibliotheque paiera le meme peage, et la regle de police fera accuser tout livrable conforme a la charte maison |
| TF-0549 | decide | 10 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : `Produit-07` a un forge\retours\ mais rien de ce qui s'y fait n'est suivi | **oui** — mesure le 24/08 : sur les trois produits localisables du poste, DEUX sont en defaut d'heritage et UN n'a jamais ete instancie — soit zero produit conforme sur trois. Celui decouvert aujourd'hui cumule quatre artefacts absents et l'absence totale de depot git : tout travail qui y serait fait est hors de portee d'un `git log`, d'un `git diff` et de toute restauration. |
| TF-0751 | candidat | 8.3 | Le pilot n'est PAS publiable : 200 constats de nom de client sur 56 fichiers suivis, et la porte de publication le refuse depuis avant ce jour | **oui** — 200 constats C1 sur 56 fichiers suivis ; les commits du jour restent locaux sur le pilot alors que forge-tests et forge-agents ont ete publies sans reserve |
| TF-0750 | candidat | 7.5 | Deux livrables du meme jour ont porte le meme indice sans que rien ne le voie : R-4 juge la FORME du nom, jamais l'unicite de l'indice | **oui** — deux fichiers de output/04-plans/ portant l'indice 20260901b le 01/09 ; R-4 rend PASS sur les deux, aucun controle ne compare deux noms entre eux |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
