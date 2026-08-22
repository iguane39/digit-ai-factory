# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=b5ee12942871 archive=acf69e8da61a · dernier événement: 2026-08-22T11:59:23.587Z -->

**34 actifs** (candidat 29 · décidé 0 · en cours 1 · corrigé 4 · écarté 0) · **469 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-factory

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0496 | corrige | 25 | pilot : une question dont la reponse est DANS les documents fournis se pose quand meme — S4 et S15 ne verifient jamais que l'agent a cherche (regle S16) | **oui** — trois decisions sur six posees a l'humain alors que leur reponse etait dans des pieces deja fournies — dont une a la premiere ligne du document, et le lecteur a du le signaler lui-meme |

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0324 | en_cours | 3 | Artefacts périodiques du run de delivery absents : RAID, rapport d'avancement, compte rendu, REX, suivi des bénéfices | **oui** — revérifié en session le 16/08 : 0 occurrence de RAID / compte rendu / rapport d'avancement / lessons learned sur les skills installés — aucun des cinq artefacts que réclame une mission longue n'a d'équivalent dans la forge |
| TF-0484 | candidat | 25 | forge-agents : run-oracles.mjs plante sur JSON_OUT non defini, n affiche jamais son verdict et retourne 1 sur un PASS — le hook d ecriture bloque alors toute ecriture | **oui** — Bloque le hook d ecriture de tout l ecosysteme : deux ecritures refusees sur des fichiers au verdict PASS pendant cette seule passe. |
| TF-0485 | candidat | 20 | forge-agents : oracle-claims analyse le JavaScript inline et lit la reference arriere $1 d une expression reguliere comme un montant en dollars | **oui** — FAIL bloquant sur un livrable conforme ; une demi-heure a remonter d un message pointant une accolade ouvrante jusqu a une expression reguliere. |
| TF-0486 | candidat | 15 | forge-agents : oracle-claims analyse le CSS et lit les couleurs hexadecimales purement numeriques comme des nombres non sources | **oui** — FAIL sur des valeurs prescrites par la charte ; contournement contraire a la charte elle-meme. |
| TF-0487 | candidat | 10 | forge-agents : confirmation de RA-4 sur un autre motif — les sources citees verbatim sont analysees comme du contenu propre au livrable | **oui** — Deuxieme occurrence du meme mecanisme en deux passes, sur un livrable dont l autoportance impose d embarquer ses sources. |
| TF-0495 | candidat | 10 | forge-agents : aucune regle ne distingue « le contenu est present » de « le contenu est exploitable » | **oui** — Deux demandes explicites du client necessaires pour obtenir un contenu lisible, sur un livrable vert a tous les oracles. |
| TF-0501 | candidat | 10 | forge-agents : run-oracles.mjs ecrit ses journaux DANS l arbre de livraison tout en imprimant qu il les ecrit hors livraison | **oui** — Le dossier se recree a chaque ecriture surveillee, y compris celle du lot de retours qui le signale ; le supprimer avant remise ne suffit donc pas. |
| TF-0497 | candidat | 7.5 | quality-oracles : la garde TOCTOU (empreinte aux deux bords) est cablee mais NON couverte par recette — le seul mecanisme du lot dont les deux sens ne sont pas joues | **oui** — paye immediatement et mesurable : le self-test du skill passe de 152 a 156 controles, dont 4 pour ce lot — et 0 pour la garde TOCTOU. Sur les deux mecanismes livres, un seul est prouve. Le contrat de la maison est « aucun ✓ sans oracle execute » : ici le ✓ de la garde TOCTOU repose sur la lecture du code, pas sur une execution. |
| TF-0475 | candidat | 3 | agents, design : 18 des 20 champs de frontmatter d'un SKILL.md ne sont posés nulle part — isolation de contexte, cadrage du déclenchement et restriction d'outils ne sont câblés sur aucun des 17 skills | **oui** — mesuré et non payé sur pièce : 17 SKILL.md sur 17 à deux champs, 18 champs disponibles à zéro occurrence, dont les trois seuls mécanismes de la plateforme capables d'isoler un contexte, de cadrer un déclenchement et de restreindre un outil |
| TF-0478 | corrige | 6.7 | quality-oracles : un verdict ne dit pas SUR QUEL CONTENU il a ete rendu — un CONFORME cite en restitution vieillit en silence, ni re-verifiable ni invalidable | **oui** — MESURE le 22/08 sur le parc reel, et le resultat est total : sur les 2 journaux d'oracles confrontables a leur cible, 2 portent un verdict PASS rendu AVANT une modification de la cible (etude i18n : cible modifiee 5,9 min apres le verdict ; etude portefeuille : 1,5 min apres). Deux « PASS » sont donc citables aujourd'hui alors qu'ils ne portent plus sur le contenu present, et RIEN ne les distingue d'un verdict frais. Echantillon petit (2 journaux) — mais le taux de perime y est de 2/2, et le mecanisme est structurel, pas accidentel. |
| TF-0323 | corrige | 4 | Gouvernance de mission absente : ni registre de risques, ni parties prenantes, ni mesures de succès suivies | **oui** — revérifié en session le 16/08 : 0 occurrence de « risque » dans pilote-de-mission v1.0.0, 0 hit « parties prenantes » sur les skills installés — une mission client pilotée par la forge ne produit aucun des trois objets qu'un commanditaire attend en premier en comité de pilotage |

## digit-ai-forge-conception

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0498 | candidat | 15 | forge-conception : la description du skill `qualifie-l-entrant` depasse la limite de 1024 caracteres — le self-test de quality-oracles echoue sur le parc installe | **oui** — mesure le 22/08 : le self-test de quality-oracles sort en echec (1 echec) des qu'il est joue depuis la copie installee, alors qu'il rend 156 PASS et 0 echec depuis la source. Le meme harnais donne deux verdicts selon l'endroit d'ou on le joue — et c'est le verdict rouge qui correspond a l'usage reel. |

## digit-ai-forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0488 | candidat | 20 | forge-design : la regle L1 « ponctuation orpheline » classe un element comme bloc a cause d un selecteur ou le display s applique a un descendant | **oui** — Six echecs bloquants simultanes sur du texte correct ; lecture du code source de l oracle necessaire pour comprendre la cause. |
| TF-0499 | candidat | 20 | forge-design : le composant tableau repliable de composants.md met table en display:block sans sa legende, qui est alors reduite a une colonne d un mot | **oui** — Quinze tableaux d un livrable client illisibles en mobile pendant quatre versions ; trouve par la lecture, hors de portee des quatre oracles. |
| TF-0494 | candidat | 15 | forge-design : le workflow auditer ne prescrit aucune tracabilite pour une demande client multiple | **oui** — Un point sur dix-sept perdu, decouvert par le client et non par la chaine de controle. |
| TF-0491 | candidat | 12.5 | forge-design : aucun controle ne compare la largeur d un bloc de texte a celle de ses blocs freres — trois allers-retours client sur le meme defaut | **oui** — Trois allers-retours client sur un seul defaut, sur quatre versions livrees. |
| TF-0492 | candidat | 10 | forge-design : aucun controle ne detecte un mot coupe en deux au rendu (Utilisabl/e, Plateform/e, 231 occurrenc/es) | **oui** — Trois occurrences signalees par le client sur deux versions successives, dont une apres une correction incomplete. |
| TF-0493 | candidat | 8.3 | forge-design : le rendu ne couvre aucun etat d echec ou d interaction, et --etats-ouverts n y suffit pas | **oui** — Deux defauts d etat trouves par le client sur un seul livrable, tous deux reproductibles en deux clics. |
| TF-0490 | candidat | 8 | forge-design : confirmation de RD-12 — les exemples du socle emploient des glyphes absents des piles de repli declarees | **oui** — Meme defaut reproduit une seconde fois parce qu il vient de l exemple de reference. |
| TF-0483 | candidat | 6.7 | forge-design : rien n oblige a relever ce qui se fait de bien dans le domaine du produit avant de proposer une DA — les oracles jugent la discipline INTERNE, et une DA au vert complet a ete rejetee en bloc | **oui** — Un tour complet conception+design perdu sur factory.digit-ai.fr : DA au vert sur tous les oracles, rejetee integralement par le commanditaire, refaite avec releve externe et arbitrage humain sur captures. |
| TF-0489 | candidat | 6.7 | forge-design : aucun composant « lecteur de source » au catalogue alors que la regle d autoportance impose d embarquer les sources citees | **oui** — 130 lignes de convertisseur ecrites a la main, plus la decouverte du seuil de DOM par essai ; besoin cree par une regle du socle lui-meme. |
| TF-0500 | candidat | 6.7 | forge-design : la regle L2-rendu ne peut structurellement pas voir un texte ecrase en filet sur mobile — trois causes independantes | **oui** — Une famille entiere de defauts de mise en page non surveillee sous 1100 px, la ou les bascules de layout la rendent la plus probable. |

## digit-ai-forge-ops

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0482 | candidat | 12.5 | forge-ops : aucune porte de MEP ne surveille une bascule de domaine — les gates M-1..M-5 n interrogent QUE la nouvelle URL, un deploiement qui casse l ANCIENNE passe tout au vert | **oui** — Site de production injoignable le 18/08 par une redirection armee vers un domaine non resolvant ; aucun gate MEP n a pu le voir, l ancienne URL n etant interrogee nulle part. |

## digit-ai-forge-seo-geo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0476 | candidat | 10 | forge-seo-geo : le noeud 57 accepte un taux de citation sans plan de mesure — le controle « pas de verdict affirmatif sans la donnee nommee » (TF-0264) ne capte que la famille CrUX | **oui** — mesure sur les artefacts reels : noeud_exige_terrain() rend False sur la source du noeud 57 et True sur celle du noeud 31 (predicat litteral "crux") ; la reserve « ne jamais presenter le taux comme une metrique de suivi fiable » compte 1 occurrence dans le referentiel et 0 dans la fiche que l'auditeur remplit. Le cout se paie dans un livrable client remis : la forge a deja produit un rapport d'audit reel, et le service de runs recurrents (cat-seo-05) transformerait ce taux en tendance — sur une grandeur dont la litterature 2026 mesure que la marque explique 1,5 % de la variance |

## digit-ai-forge-tests

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0470 | candidat | 10 | forge-tests : les routes attendues par locale se DÉCLARENT — la parité de routes reste aveugle sur un produit dont le build ne laisse aucune arborescence | **oui** — mesuré sur digit-ai.fr, 201 pages FR / 201 EN en production : le pan sortirait en NA/SKIP sur la parité de routes pendant qu'un écart de route vit en production — et le produit est celui sur lequel le pan a été conçu, ce qui rend le trou d'autant plus coûteux : la forge ne voit plus le défaut qui l'a fait naître |
| TF-0480 | candidat | 8.3 | forge-tests : le plancher visuel (V1 debordement, V2 contraste, V4 chevauchements) n est atteignable que sur un FICHIER html local — aucun produit SERVI n est jugeable, et les trois autres portes sont fermees | **oui** — En-tete compresse et menu anglais au tiers de la largeur en production de juin a aout 2026 sur digit-ai.fr, non vus par deux campagnes de verification declarees completes. |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0481 | candidat | 10 | pilot : le preflight anti-collision de TF-0394 est un check-then-act — il detecte une divergence DEJA PUBLIEE, pas deux sessions qui frappent simultanement ; il a re-cede le 22/08 sur le lot digit-ai-fr | **oui** — Deuxieme renumerotation manuelle du registre en un mois, la premiere ayant motive TF-0394 ; cinq candidatures renumerotees et trois commits de rattrapage le 22/08. |
| TF-0479 | candidat | 7.5 | veille : le prompt de veille ne debouche sur AUCUN canal d'entree au registre — ce qu'une veille trouve n'a pas de chemin norme vers une candidature | **oui** — MESURE le 22/08 sur les deux registres : sur 473 items TF ecrits depuis l'origine, 2 seulement ont une veille pour source — 0,4 %, alors que la veille est un canal declare de l'ecosysteme et qu'elle a produit trois documents d'etude (ETUDE-EVERYTHING-CLAUDE-CODE, VEILLE-OUTILLAGE-CLAUDE-CODE, AMELIORATIONS-TIKTOK). Le canal existe, il produit, et sa production n'atteint pas le registre : c'est le dernier kilometre qui manque, pas la veille. |
| TF-0502 | candidat | 6.7 | Deux derogations a R-45 en UN JOUR, dont une hors anteriorite : la propagation des regles du pilot vers les produits reste le manque, et le mecanisme de derogation est en train de devenir la voie normale | **oui** — mesure le 22/08 sur le registre : 15 candidatures (7 + 5 + 3) n'ont pu entrer que par derogation, sur 3 lots d'un meme produit en 2 jours. Deux evenements `ingestion` portent desormais un champ `derogation` — soit 2 derogations en un seul jour, pour une regle publiee la veille. Le taux est de 3 lots derogeables sur 3 lots recus de ce produit : 100 %, ce qui ne decrit plus une exception mais un regime. |
| TF-0474 | candidat | 4.5 | pilot : cinq mécanismes d’empreinte sha256 coexistent sans format commun — la même classe de défaut est redécouverte forge par forge | **oui** — sept items archivés de la même classe, traités un par un, aucun n’ayant produit de convention : TF-0072, TF-0247, TF-0253, TF-0288, TF-0294, TF-0298, TF-0338. Deux redécouvertes strictes établies par lecture des titres au registre — le défaut de fins de ligne de TF-0072 (forge-seo) rejoué en TF-0253 (pilot), et le trou de scellement de TF-0288 rejoué en TF-0298 (forge-ops, canary). Anti-doublon exécuté le 22/08/2026 sur les 2338 événements des deux registres : aucun item existant ne porte le format partagé — une seule occurrence sur le motif « format/empreinte commun », TF-0298, qui traite un point de scellement manquant dans UNE forge, pas la convention. |
| TF-0473 | candidat | 4 | pilot : vue portefeuille du reste-a-faire — etude remise, verdict O1, DIFFEREE par decision humaine du 22/08 (« je suis chaque projet independamment pour l'instant ») | **oui** — aucun cout constate a ce jour, et c'est le fait principal : a quatre produits l'humain declare suivre chaque projet independamment sans gene. Le cout est ANTICIPE a sept ou huit produits, et le critere de reouverture est ecrit pour ne pas avoir a le deviner |
| TF-0477 | candidat | 4 | La loi 4 dit ou vit une donnee volatile, jamais qu'une note ne doit pas la RECOPIER — la derive se detecte claim par claim, sur un seul document, et la classe se re-paye | **oui** — mesure executee le 22/08 sur le clone au commit 6aa0b20 : fraicheur-claims.json porte 6 claims, TOUS sur INVENTAIRE.md — zero claim sur un README de forge, alors que les deux derniers defauts avoues de cette classe (TF-0311, TF-0334) etaient dans le README de forge-tests ; et le seul document couvert porte environ 81 assertions de denombrement (mesure par proxy, ids TF, versions et dates retires — chiffre approximatif et declare comme tel) pour 6 sondes, soit moins d'une sur dix. Cout deja paye et trace au registre : TF-0113 et TF-0115 (6 derives en deux campagnes), TF-0311 puis TF-0334 sur le meme fichier, TF-0247 (3 citations perimees dont la correction change l'empreinte de grille), TF-0358 (sous-chemin perime), TF-0456 (dates de README). Le score porte un arbitrage a revoir : l'effort est note 3 parce que la regle est bon marche mais le balayage ne l'est pas ; si la forge tranche pour la seule regle de redaction, l'effort tombe a 1 et la valeur double. |
| TF-0471 | corrige | 10 | R-45 refuse des lots rédigés AVANT sa publication — deux lots Hoopiz bloqués à l'ingestion, dont un qui signalait un plantage réel du lanceur d'oracles | **oui** — payé le 22/08 : douze candidatures de deux lots restent hors du registre, et l'une d'elles nommait un défaut BLOQUANT du lanceur d'oracles qui n'a été corrigé que parce que la session l'a rencontré par un autre chemin — un refus de forme a mis un fait de production hors de portée |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
