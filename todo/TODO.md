# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=b7a25e192b74 archive=e9c36f97ba63 · dernier événement: 2026-08-31T20:43:43.233Z -->

**40 actifs** (candidat 28 · décidé 12 · en cours 0 · corrigé 0 · écarté 0) · **693 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0674 | decide | 12.5 | La porte de fraîcheur de déploiement empreinte encore un échantillon — le correctif d'ensemble n'est pas appliqué | non |
| TF-0682 | decide | 10 | Quinze contrôles du produit ne sont exercés par AUCUNE recette — être cité n'est pas être joué | non |
| TF-0676 | decide | 6.7 | Aucun script de capture du produit ne produit systématiquement une pleine page | non |
| TF-0684 | decide | 5 | Six recettes échappent à toute mesure rétrospective : leur idiome de déclaration de cas n'est reconnu par rien | non |
| TF-0713 | candidat | 25 | pilot : le socle gitignore-produit impose !forge/** , qui RE-INCLUT les secrets ranges sous forge/ | **oui** — deux fichiers de secrets reels (.env.recette, .admin-mdp-production.txt) auraient ete re-inclus par l'application litterale du motif exige. |
| TF-0714 | candidat | 25 | pilot : le socle gitignore-produit ignore .env.example, que R-13 exige VERSIONNE | **oui** — R-13 rendu PASS sur un fichier que git ignore : la conformite affichee et l'etat reel du depot divergent, sans aucun signal. |
| TF-0709 | candidat | 20 | pilot : R-19 juge la PRESENCE de versions_forges sans anteriorite, alors qu'il en accorde une a la FORME de ses cles | **oui** — oracle-conformite-projet rend FAIL R-19 sur forge/ledger.jsonl (run_open #1) apres mise en conformite complete du depot ; aucun geste du produit ne peut le lever. |
| TF-0723 | candidat | 20 | Une formule d'invocation lue comme une tournure : un skill disponible non invoque trois fois, sans laisser de trace | **oui** — Trois demandes d'analyse non honorees sans qu'aucune trace ne le signale, et une construction lancee sur un prompt qui valait 39/100 avec quatre defauts bloquants — arretee par l'interruption humaine, pas par un controle. |
| TF-0706 | candidat | 15 | pilot : deux pieges de l'API Railway a documenter au mode d'emploi de l'etape MEP | **oui** — deux impasses de diagnostic dans une seule session, dont un 403 qui a d'abord ete lu comme un probleme de jeton. |
| TF-0725 | candidat | 15 | L'anonymisation a ete cablee a l'ingestion sans mettre a jour les recettes qui ISOLENT leur parc | **oui** — recette R-47 a 2 PASS et 6 FAIL depuis le 28/08 ; apres correction, 8 PASS et 0 FAIL. Le banc complet passe de 2 defauts a 1. |
| TF-0726 | candidat | 15 | La pseudonymisation de masse a reecrit le membre gauche d'une egalite de test, et l'a rendue autocontradictoire | **oui** — recette a 10 PASS et 1 FAIL ; l assertion attendait qu un pseudonyme normalise rende un nom de produit reel. |
| TF-0705 | candidat | 12.5 | pilot : une URL de production anonyme est produite par la MEP — RT-14 traitait le symptome cote forge-tests | **oui** — une campagne de tests a audite la mauvaise application ; le renommage effectue le 2026-08-16 rend R-24 conforme et l'ancien hote repond desormais 404. |
| TF-0711 | candidat | 12.5 | pilot : un artefact copie_conforme qui bouge chez le pilot met tout le parc en FAIL, et aucun produit ne l'apprend | **oui** — deux derives du meme gabarit en une heure sur un poste, et deux produits du parc en FAIL R-47 sur ce fichier le meme jour. |
| TF-0721 | candidat | 12.5 | Le perimetre de la mesure n'est pas le perimetre de la conclusion — quatre incidents, une seule erreur | **oui** — Une regression en production sur un budget publicitaire d'environ 100 EUR par mois, rendue definitive jusqu'a reparation ; et une recommandation de suppression qui aurait detruit 59 commits que ne detient aucun distant, arretee par le seul choix humain de verifier d'abord. Les deux mesures sont rejouables : inventaire du conteneur et des liens publicitaires d'un cote, comparaison des sujets de commit entre branche de sauvegarde et origin de l'autre. |
| TF-0712 | candidat | 10 | pilot : R-32 n'a pas de forme de journal pour un livrable qui porte des donnees personnelles | **oui** — sept journaux ecrits sous forge/oracles/, dont cinq ont du etre caviardes par un mecanisme invente par le produit faute de contrat. |
| TF-0722 | candidat | 8 | Des valeurs de contexte ecrites comme des regles — instantane fige, valeur observable gravee, contrainte sans point de bascule | **oui** — Trois hypotheses fausses dans un seul prompt destine a piloter une construction, dont une qui aurait fait transformer un site statique en application sans decision humaine. Les trois ont ete relevees par l'humain lors d'une relecture, aucune par l'agent. |
| TF-0710 | candidat | 7.5 | pilot : un artefact copie_conforme de R-47 revendique un nom generique qu'un produit occupait legitimement | **oui** — renommage de forge/retours/RETOURS-FORGES.md en INDEX-DES-LOTS.md plus trois sidecars d'oracles, et correction de deux documents qui le citaient. |
| TF-0704 | candidat | 6.7 | pilot : l'etape MEP pilote Railway par le CLI, qui ne sait ni renommer un service ni corriger un domaine | **oui** — domaine de production anonyme laisse en l'etat du 2026-08-05 au 2026-08-16, corrige seulement par un appel d'API hors du chemin outille. |

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0718 | candidat | 15 | quality-oracles : un effectif annonce en toutes lettres n est compare a rien — « sept ecarts » en tete d un tableau qui en porte huit, dans trois versions livrees | **oui** — Decalage present dans trois versions livrees et vert a quatre portes ; trouve a la main, hors de tout controle. |
| TF-0715 | candidat | 12.5 | quality-oracles : aucun domaine ne verifie l AUTORITE d une decision affirmee — un livrable peut ecrire « Decideur : le prestataire, pour le client » et sortir vert | **oui** — Defaut alle jusqu au client sur un livrable vert a quatre portes ; correction d une phrase par le client, puis regeneration complete du rapport et reprise de cinq emplacements. |
| TF-0717 | candidat | 8.3 | experts-forge : un angle declare vide le 20/08 a produit le 31/08 exactement le defaut qu il aurait attrape — fiche « migration de plateforme brownfield » jamais ecrite | **oui** — Angle vide declare le 20/08 et non comble ; defaut correspondant trouve par le client le 31/08, apres qu une contre-expertise complete et quatre portes automatiques l aient laisse passer. |
| TF-0716 | candidat | 6.7 | quality-oracles : aucun domaine ne teste si une consequence declaree est LIVRABLE — « l utilisateur decouvre en production » passe les quatre portes | **oui** — Formulation presente dans six versions livrees et validee par quatre portes ; reaction directe du client, quatre lignes du rapport reecrites et un ecart neuf declare. |

## digit-ai-forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0700 | decide | 9 | audit : le livrable DIFFUSE de la fiche securite est un PDF, que le kit ne prescrit pas, n outille pas et ne controle pas — le projet a diffuse une IMAGE, d un indice anterieur au HTML depose a cote | **oui** — PDF diffuse le 24/07 : 1 page, 0 caractere extractible, 9 images, 653169 octets, indice c — contre un HTML voisin d indice d. Aucune porte ne l a vu. |
| TF-0701 | decide | 6 | audit : la fiche securite n a AUCUN verificateur alors que ses deux regles sont mecaniques, et que le rapport d audit, lui, a une porte bloquante | **oui** — Deux regles ecrites au paragraphe 10 et tenues par personne ; le seul artefact relu est celui qui n est pas diffuse. |

## digit-ai-forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0720 | candidat | 15 | digit-ai-page-html : M18 refuse une glose correcte quand une emphase ou un retour a la ligne s intercale entre le jeton et sa parenthese — deuxieme fois que le balisage casse une adjacence | **oui** — Quatre refus successifs a l ecriture de ce lot, dont deux sur du contenu conforme ; meme cause qu un faux positif deja signale le 22/08 sur un autre oracle. |
| TF-0707 | candidat | 10 | design : un choix exclusif se pose AVANT les champs qu'il commande, jamais au milieu d'un formulaire qui les affiche deja tous | **oui** — inspection utilisateur en production : l'ecran a ete mal compris par son destinataire, qui a deduit une alternative inexistante entre deux moitiees du meme flux. |
| TF-0719 | candidat | 10 | digit-ai-page-html : le badge acte n est pas resolvant — il affirme un statut que rien ne verifie, et il a porte une decision qui n a jamais ete prise | **oui** — Badge acte pose a tort sur cinq emplacements d un livrable client, vert a check_html et render_page ; corrige seulement apres intervention du client. |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0665 | decide | 5.6 | Un nombre affiché dont aucune source du dépôt ne rend compte est un nombre orphelin, et personne ne le lui demande | non |
| TF-0728 | candidat | 10 | forge-tests : le detecteur statique de codes declares ne voit pas une emission sous garde try/except — 4 faux ecarts par campagne | **oui** — 4 faux ecarts a analyser a la main par campagne, contredits par une section du meme rapport (rapport-20260831.json, divergences statiques vs pan api). |
| TF-0727 | candidat | 6.3 | forge-tests : demande d'etude approfondie — strategie de tests et temps d'execution des campagnes (selection d'impact, mutation ciblee, parallelisation, distribution), sans perte de qualite | **oui** — 67 min de campagne dont ~54 min de mutation mesurees au rapport-20260831.json et au journal forge/avancement.jsonl, pour une suite produit qui tourne en ~52 s ; 37 s/mutant contre 52 s de suite complete = le rejeu est quasi integral par mutant. |
| TF-0708 | candidat | 6 | tests : distinguer deux motifs legitimes d'ecran de creation plutot que d'imposer le formulaire replie partout | **oui** — un test d'exigence d'interface a du etre assoupli pour laisser passer une refonte qui corrigeait un defaut d'ergonomie reel. |

## digit-ai-page-html

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0694 | decide | 1 | digit-ai-page-html : la regle l2_gouttiere decrit EXACTEMENT ce defaut, au seuil exact, et rend PASS dessus - elle ne regarde que les grilles CSS, jamais les table | **oui** — Execute le 27/08/2026 : python render_page.py sur la fiche fautive 'Client-A - CAL - Fiche Securite Mise a disposition - Dev - 20260827b.html' (colonne d intitules a 32 %), --widths 1440 --output json. Resultat : verdict PASS, et l2_gouttiere : 0 constat - de meme que v1_overflow, v2_contrast, v4_overlap, l2_width, l2_conteneur, l2_filet, l2_freres, tous a 0. Le socle rend donc PASS sur le document meme que la regle est faite pour condamner. Cout constate : le defaut a traverse DEUX fiches livrees et TROIS regenerations avant qu un humain ne l ouvre et ne le dise. Mesure du gaspillage : 12,6 % a 19,4 % de la largeur de page perdus sur 7 tables sur 8. |
| TF-0724 | candidat | 20 | Le socle de page HTML livre une declaration que son propre controle refuse, et une classe qui viole la regle de largeur qu'il enonce | **oui** — Deux echecs d'oracle sur un livrable, imputables au seul CSS du socle et non a son auteur, dont la correction a exige de modifier le squelette a l'assemblage — une surcharge ne suffisant pas, l'oracle lisant la declaration et non la cascade. Et un defaut de largeur releve par le destinataire humain que l'oracle ne voit pas. |

## factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0689 | decide | 1 | factory : une correction marquee `corrige` n est jamais suivie jusqu au produit | **oui** — un jeu de livrables remis incomplet DEUX FOIS sur le meme produit apres correction, et trois produits ayant remonte la meme classe en trois jours. Le destinataire a du reclamer le PDF en disant qu il l avait deja demande — il avait raison, la demande etait tracee en TF-0506 et corrigee quatre jours plus tot |

## forge-audit

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0693 | decide | 1 | forge-audit : la famille gd-fiche-securite ne fournit aucune allocation d indice avec son gabarit, alors que toute fiche est regeneree plusieurs fois par jour | **oui** — Le commanditaire a demande a la relecture, le 27/08/2026 : pourquoi la regle de nouvelle version de fichier avec nouvel indice n est pas respectee dans la generation de nouveaux fichiers comme la fiche securite ? La question porte sur le NOM du livrable et non sur son contenu : c est le premier signal recu que quatre versions s etaient ecrasees. Cout direct : quatre ecrasements, dont deux pousses, et un aller-retour humain. |
| TF-0697 | decide | 1 | forge-audit : le gabarit gd-fiche-securite reserve 32 % de la page a une colonne d intitules courts - correctif mesure disponible | **oui** — Mesure avant correction : 32 % reserves, 12,6 % a 19,4 % GASPILLES sur 7 tables sur 8. Apres : 0,6 % a 7,4 %, soit 68 % -> 80 % de largeur rendue au texte, sans debordement (scrollWidth == clientWidth verifie a 739 px). Le commanditaire a demande la correction apres avoir ouvert le PDF, le 27/08/2026 : reduire la premiere colonne 'afin de laisser plus d espace pour la largeur de la deuxieme colonne qui contient plus de texte'. Le defaut avait traverse deux fiches livrees et trois regenerations. |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0549 | decide | 10 | R-47 trouve des son premier rejeu un TROISIEME produit sans heritage — et celui-la n'a meme pas de depot git : `Produit-07` a un forge\retours\ mais rien de ce qui s'y fait n'est suivi | **oui** — mesure le 24/08 : sur les trois produits localisables du poste, DEUX sont en defaut d'heritage et UN n'a jamais ete instancie — soit zero produit conforme sur trois. Celui decouvert aujourd'hui cumule quatre artefacts absents et l'absence totale de depot git : tout travail qui y serait fait est hors de portee d'un `git log`, d'un `git diff` et de toute restauration. |
| TF-0731 | candidat | 15 | pilot : `racine_produit` declare par un sidecar n'est JAMAIS lu — la voie recommandee par TF-0555 est morte depuis sa pose | **oui** — aucun cout paye visible — et c'est le probleme : une voie morte derriere une heuristique qui marche est indiscernable d'une voie vivante, jusqu'au produit qu'on ne localise pas alors qu'il avait declare sa racine (le cas exact pour lequel TF-0555 l'a fait poser) |
| TF-0732 | candidat | 10 | poste : le gate d'ecriture C7 juge le FICHIER ENTIER, pas le delta — et sa regle « DM Sans bannie » contredit la charte maison : tout gabarit HTML de la bibliotheque est inedittable sans friction | **oui** — quatre editions de trois lignes bloquees en un tour pour des defauts anterieurs ; sans arbitrage, CHAQUE evolution future d'un gabarit HTML de la bibliotheque paiera le meme peage, et la regle de police fera accuser tout livrable conforme a la charte maison |
| TF-0730 | candidat | 7.5 | pilot : un produit a heritage CONFORME ne recoit jamais ses constats — l'emetteur rend null avant de les calculer | **oui** — aucun cout paye a ce jour — le defaut est structurel et date de la seconde source (TF-0673, 26/08) ; il se paiera le jour ou un produit a heritage conforme portera un constat decide, et rien ne le dira |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
