# Retours forges — digit-ai-marketing — 20261109b

- **Contexte** : autre — demande humaine du 09/11/2026 : « et pourquoi rien n'est remonté à la Factory alors qu'un élément essentiel manquait dans la création des formations ? Remonte ça à la Factory ainsi que le fait que ça n'a pas été remonté à la Factory. » Le lot porte la pièce manquante, la non-remontée, et tous les retours écrits au ledger depuis le lot du 30/09/2026. Les retours antérieurs au 30/09 partent dans le lot 20261109c.
- **Références ledger** : `forge\ledger.jsonl` seq 510, 511, 525, 534, 540, 544, 551, 571, 578, 579, 609, 614, 630, 634, 645, 646, 681, 686, 692, 693, 694, 703, 704 (entrées `type: retour`) ; seq 702 (retour humain), 705 (rectification d'une restitution).
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le SAS `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : a_remettre

Mesures : `retoursSansLot` du pilot rendait 104 entrées sans lot avant ce lot ; 21 portent un seq de 506 à 697, plus les 2 retours écrits pour ce lot. Ce lot remonte 22 retours, tirés de 20 entrées du ledger, à 3 forges ; il rattache 1 entrée à TF-2264 et en garde 2 au produit.

---

## digit-ai-pptx, digit-ai-communication, digit-ai-docx et quality-oracles (`digit-ai-forge-agents`)

La chaîne de formation a livré au client des pièces cohérentes une à une et fausses ensemble, sans document du formateur ; les autres retours sont des faux positifs et des contrats d'outil relevés depuis le 30/09.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-06 | bloquant | produit+générique | **Une chaîne de formation ne produit aucun document du formateur.** Faits : Les supports d'une formation d'une journée, produits le 13/10 puis le 26/10/2026, comptaient deux pièces : support et kit du participant. Relevé le 09/11, quatre jours avant la séance : la note de la diapositive 18 renvoie à un « kit formateur » qui n'a jamais existé ; les solutions des exercices 4 et 5 sont imprimées dans le kit du participant ; la skill de démonstration de l'exercice 7 n'existe pas ; aucun minutage par diapositive, et le matin portait 226 minutes de notes pour 195 de créneau. `grep -ril formateur` dans digit-ai-pptx, digit-ai-communication, digit-ai-docx et quality-oracles : 0 fichier. Le produit a écrit sa fiche le 09/11 (`forge/oracles/supports-formations-*-20261109a/fiche-formateur.py` 1.0.0, 6 pages, tirée du même fichier de contenu). (ledger seq 703) | Le preset formation exige une troisième pièce, la fiche du formateur, générée du même fichier de contenu : préparation de la veille, déroulé et durée de chaque diapositive, solutions, questions orales, secours. `oracle-programme-formation` contrôle sa présence et l'absence de solution dans le kit. Règle qui aurait évité le retour : aucune ne le couvre, règle § 4 de quality-oracles. Classe à créer : `formation-sans-document-du-formateur`. |
| RA-07 | majeur | produit+générique | **Aucun oracle ne juge la cohérence entre les pièces d'une formation.** Faits : Le 26/10/2026, support, notes et kit ont passé tous leurs oracles (programme, charte, polices, débordements, nommage) avec 8 défauts de cohérence : durée d'un exercice différente entre diapositive, notes et kit (4 cas) ; notes d'une demi-journée supérieures à son créneau ; solution présente dans le kit ; fiche mémo contraire à la grille enseignée. La « cohérence inter-documents » de run-oracles sort SKIP sur .pptx et .pdf. Le produit a écrit `controles_coherence.py` 1.0.0 (4 classes, épreuve rouge : 4 défauts injectés, 4 relevés ; 8 relevés sur la version du 26/10). (ledger seq 692) | Promouvoir ces 4 contrôles dans `oracle-programme-formation`, lus sur le fichier de contenu commun aux pièces. Règle qui aurait évité le retour : aucune, règle § 4. Classe à créer : `coherence-entre-pieces-d-une-formation-non-jugee`. |
| RA-08 | majeur | générique | **Les modules de formation suivent la lettre de la propale, pas l'usage attendu.** Faits : Le 13/10/2026, la chaîne a construit les modules des référents sur la lettre de la propale (configuration de l'organisation, gouvernance des skills, coûts, pratique de développeur) et les a enchaînés comme s'ils étaient suivis dans l'ordre. Retour humain du 26/10/2026 : « les formations ne correspondent à rien de demandé ». Les 3 supports ont été refaits. (ledger seq 609) | Au cadrage d'un support de formation (digit-ai-communication, preset formation), demander le public réel de chaque module et s'il se suit seul, et confronter le programme aux attentes d'usage avant la lettre de la propale. Règle qui aurait évité le retour : cadrage avant tout livrable de communication, sans question sur le public par module. Classe à créer : `programme-de-formation-calque-sur-la-propale`. |
| RA-09 | majeur | générique | **Oracle-claims juge la source d'un montant sur la ligne voisine du fichier.** Faits : Sur le texte extrait d'un deck, le voisinage suit l'ordre de création des formes, pas la diapositive. Même deck : note de source créée juste après le titre, PASS ; créée en dernier, FAIL sur le montant du titre, pour une diapositive identique à l'œil (30/09/2026, fonction `para`, lignes i-1 à i+1). (ledger seq 510) | Chercher le marqueur dans la diapositive entière pour un texte de diapositives. Règle qui aurait évité le retour : un contrôle mesure l'invariant, pas un corrélat. Classe : `controle-vrai-sur-le-mauvais-invariant`. |
| RA-10 | mineur | produit+générique | **La règle « un montant vient de la grille de prix » n'est jouée par aucun contrôle.** Faits : La spécification du produit (EX-05) dit qu'un montant hors grille est refusé par oracle-claims. oracle-claims accepte tout montant suivi d'un renvoi, sans lire de grille ; la grille vit dans un générateur. Le 30/09/2026, un tarif dicté a été rapproché de la grille à la main. (ledger seq 511) | Un contrôle qui rapproche chaque montant d'un livrable de la grille (montant et unité), ou la règle déclarée sans oracle. Règle qui aurait évité le retour : une règle écrite a un contrôle qui la joue. Classe : `regle-ecrite-sans-oracle-qui-la-joue`. |
| RA-11 | majeur | produit+générique | **Un contrôle de fidélité à la source cherche le fait par deux motifs écrits par le producteur.** Faits : Le contrôle cherchait chaque fait par un motif dans le livrable et un autre dans la source, tous deux écrits par le producteur : 3 faits non sourcés sont passés, trouvés par une relecture simulée (01/10/2026, `verifier-faits.py` 1.0.0 puis 1.1.0, épreuve : 12 altérations détectées sur 12). (ledger seq 525) | L'oracle de fidélité du registre compare chaque affirmation au passage de sa source, et son épreuve altère la table des faits. Voisin : TF-1232 (fidélité d'une traduction, corrigé). Classe : `controle-vrai-sur-le-mauvais-invariant`. |
| RA-12 | bloquant | générique | **Pre-commit-anonymiser réécrit le disque, pas seulement l'index.** Faits : Le 02/10/2026, le hameçon a réécrit 40 fichiers sur le disque, dont un fichier de `input/` en lecture seule sans original dans git (143 occurrences remplacées) et un générateur de deck (`.claude/anonymisation-au-commit.jsonl`). (ledger seq 540) | Le hameçon ne touche que l'index et n'écrit jamais sous `input/`. Règle qui aurait évité le retour : une anonymisation s'applique à la copie publiée. Classe à créer : `hamecon-d-anonymisation-reecrit-l-arbre-de-travail`. |
| RA-13 | majeur | générique | **La table des produits pseudonymise un nom de lieu public homonyme.** Faits : Le pseudonyme d'un produit a remplacé le nom d'un lieu public dans un générateur, ses sources et sa table de faits : le deck régénéré portait le pseudonyme en couverture, et le contrôle de fidélité est resté vert, sa source réécrite comme le livrable (44 occurrences dans 12 fichiers, 02/10/2026). (ledger seq 544) | La table distingue un nom de produit d'un nom de lieu ou de domaine public ; un contrôle de fidélité garde une source hors de portée du hameçon. Classe : `anonymisation-portee-partielle`. |
| RA-14 | majeur | générique | **S7 d'oracle-charte-pptx-semantique compte les « ; » des entités XML.** Faits : `&gt;`, `&amp;` et `&lt;` portent chacun un point-virgule : un chemin de menu, une convention de nommage ou une balise d'exemple deviennent des listes en ligne. 6 constats bloquants faux sur 4 decks du 13/10/2026. (ledger seq 578) | Décoder les entités (`html.unescape`) avant S5, S7 et S8. Classe : `oracle-faux-positif`. |
| RA-15 | majeur | générique | **S1 prend une pastille numérotée pour un intercalaire.** Faits : Toute zone libre qui porte un nombre seul devient un « intercalaire sans entrée de sommaire » : 6 à 18 constats bloquants par deck sur 5 decks du 13/10/2026, 17 encore le 09/11/2026 sur un support de formation. S1 lit aussi la pagination du sommaire comme une entrée. (ledger seq 579) | Ne chercher les intercalaires que sur les diapositives à fond sombre ou sans titre de contenu ; exclure ftr, sldNum et dt, comme S7. Classe : `oracle-faux-positif`. |
| RA-16 | majeur | générique | **Le gabarit B de digit-ai-propale et S1 se contredisent.** Faits : Le gabarit B prescrit un sommaire sans intercalaires que S1 refuse, et S1 lit « 03 / 15 » comme une entrée ; oracle-nommage rend SKIP avec `--profil digit-ai` et n'accepte que le chemin du profil (03/11/2026). (ledger seq 630) | Aligner S1 sur le gabarit B ; accepter le nom du profil. Classe : `deux-regles-du-socle-inconciliables`. |
| RA-17 | majeur | générique | **Digit-ai-pptx déclare pptxgenjs installé globalement, absent du poste.** Faits : Le 09/11/2026, `npm root -g` ne contient pas pptxgenjs ; le script de construction sort en 1 sans message. Installé à part dans le dossier de travail (pptxgenjs@3.12.0). (ledger seq 645) | Un auto-test du skill qui vérifie la résolution du module et donne la commande d'installation. Classe à créer : `prerequis-declare-installe-absent-du-poste`. |
| RA-18 | mineur | générique | **Run-oracles écrit un tableau texte là où l'appelant attend du JSON.** Faits : Redirigé vers un fichier .json, run-oracles écrit le tableau texte ; le JSON n'existe que dans le journal `.oracles/…oracles.json` (09/11/2026). (ledger seq 646) | Une option `--json` qui écrit le journal sur la sortie standard. Classe à créer : `sortie-json-attendue-rendue-en-texte`. |
| RA-19 | mineur | générique | **Pptxgenjs remplace l'espace insécable U+00A0, que S8 exige ensuite.** Faits : Le texte source porte U+00A0 ; le PPTX brut porte une espace ordinaire (relevé octet à octet, 09/11/2026) ; S8 avertit. L'espace fine U+202F tient. (ledger seq 681) | Documenter dans digit-ai-pptx que U+00A0 se perd et que U+202F tient, ou poser l'insécable en post-passe. Classe à créer : `insecable-perdu-par-le-generateur-pptx`. |

## Pilot (`digit-ai-factory`)

Ce produit n'a remis aucun lot du 30/09 au 09/11 malgré l'alerte d'ouverture, et la restitution a laissé à l'humain ce qu'un agent pouvait faire.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-06 | bloquant | générique | **Récidive de TF-1988 : l'alerte des retours sans lot s'affiche et personne n'agit.** Faits : Le 09/11/2026, `retoursSansLot` rend 104 entrées sans lot chez ce produit, la plus ancienne de 59 jours ; 21 écrites depuis le lot du 30/09, dont 9 à classe inconnue du référentiel. Dernier item du produit au registre : TF-1535, du 01/10. L'alerte figure à l'ouverture de 7 sessions du 09/11 (102 à 104 entrées) ; aucune n'a compilé de lot. Le CLAUDE.md du produit ne compile le lot qu'« à la clôture de tout run » : le ledger compte 2 `run_open` et 0 clôture. Une restitution de ce jour a écrit « Les trois causes sont remontées à la Factory » alors qu'elles n'étaient qu'au ledger, et a passé le préjugement avec « partent avec le lot de clôture du run ». (ledger seq 704) | Faire de l'alerte une porte : le hook de restitution refuse un tour qui écrit ou cite un retour sans lot qui le cite dans le même tour, et refuse « lot de clôture » quand aucun run n'est ouvert ; remplacer « à la clôture de tout run » par « dans le tour » au CLAUDE.md des produits. Règle qui aurait évité le retour : TF-1988 existe mais n'est qu'un affichage (classe voisine `constat-non-bloquant-jamais-lu`) ; S48 ne vérifie pas qu'une remontée annoncée a un lot. Classe : `retour-de-ledger-jamais-compile`. |
| RP-07 | majeur | générique | **Rien ne déclenche une revue de préparation avant une séance datée.** Faits : La date de la séance du 13/11/2026 n'est écrite dans aucun calendrier du produit : `donnees/echeances.md` ne tient que les appels d'offres. La revue de fond n'a eu lieu que sur demande humaine, le 09/11. (ledger seq 693) | Inscrire toute date de remise ou de séance au calendrier du produit, et faire nommer par le hook d'ouverture une revue de préparation à J-5. Voisin : TF-1372 (revue de lecture avant livraison HTML, en cours). Classe à créer : `echeance-de-seance-sans-revue-declenchee`. |
| RP-08 | majeur | générique | **La restitution du 26/10 a laissé la relecture de fond à l'humain.** Faits : La restitution des supports du 26/10/2026 portait l'action A-1, relecture de fond par l'humain, au lieu de la faire. Les relecteurs neufs simulaient le participant, jamais le formateur. Retour humain du 09/11/2026 : « pourquoi suis-je obligé de demander une revue pour que des corrections soient proposées ? ». (ledger seq 693) | Une relecture de fond est un geste d'agent : S13 refuse une action humaine de relecture quand une relecture par agent est jouable. Règle qui aurait évité le retour : `restitution-action-humaine-geste-agent`, qui ne vise que créer, ajouter ou écrire. Classe : `restitution-action-humaine-geste-agent`. |
| RP-09 | majeur | générique | **Une décision posée avant de corriger des défauts évidents.** Faits : Le 09/11/2026, la revue a posé la décision D-179 (corriger tout, une partie, ou rien) au lieu de corriger d'abord les défauts sans arbitrage : solutions dans le kit, durées divergentes, pied de page. Récidive de la classe fondée par TF-2273, corrigé. (ledger seq 693) | Une revue qui trouve des défauts sans arbitrage les corrige dans le tour et ne pose que ce qui relève de l'humain. Classe : `decision-posee-hors-du-ressort-humain`. |
| RP-10 | majeur | générique | **Un engagement écrit dans un document n'a ni livrable ni contrôle.** Faits : Les documents Qualiopi du 27 et 28/10/2026 ont annoncé un QCM et une satisfaction en formulaires, et une skill installée par le formateur, sans que le support soit repris ni que ces pièces soient produites. Révélé le 09/11/2026. (ledger seq 694) | Chaque engagement d'un document client (pièce, temps, outil) a un livrable ou une action nommée, contrôlés à la production suivante de la chaîne. Classe à créer : `engagement-de-document-sans-livrable`. |
| RP-11 | mineur | générique | **Oracle-ecriture ne coupe pas la phrase après « h. ».** Faits : Une phrase qui finit sur une heure se soude à la suivante : EC-2 compte 1 phrase longue sur 2 au lieu de 0 sur 17 (2 textes d'essai, 01/10/2026). (ledger seq 534) | Ne pas compter « h » précédé d'un nombre parmi les abréviations ; ajouter la paire de fixtures. Classe : `oracle-faux-positif`. |
| RP-12 | mineur | générique | **Le hook d'ouverture prescrit un chemin d'allouer-indice absent du produit.** Faits : Il prescrit `node scripts\allouer-indice.mjs`, absent chez le produit (`ls` : No such file) ; le script vit au pilot (02/10/2026). (ledger seq 551) | Imprimer le chemin résolu du pilot dans le message. Classe : `oracle-chemin-prescrit-inoperant-sur-sa-cible`. |

## critique-le-design (`digit-ai-forge-design`)

La critique de rendu ne couvre pas le format le plus produit ici, le deck.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-15 | mineur | générique | **La critique d'implémentation n'a d'oracle que pour le HTML.** Faits : Sur un deck PPTX, le relecteur a appliqué la grille à la main et l'a déclaré (02/10/2026). Voisin : TF-1130 (domaine « support de diapositives » au registre, corrigé). (ledger seq 571) | Un mode PPTX qui juge les rendus du PDF, ou la déclaration du format non couvert dans le skill. Classe à créer : `critique-de-rendu-sans-oracle-pour-le-pptx`. |

## Rattachement

Registre interrogé le 09/11/2026, dans `C:\dev\digit-ai-factory`, une commande par retour, sans borne :

| id | Commande jouée | Lignes trouvées | Items recoupés |
|---|---|---|---|
| RA-06 | `grep -c -i -E "formateur" todo/TODO.jsonl` | 0 | aucun |
| RA-07 | `grep -c -i -E "coh[ée]rence (interne\|entre).{0,40}formation\|dur[ée]e d.un exercice" todo/TODO.jsonl` | 0 | aucun |
| RA-08 | `grep -c -i -E "lettre de la propale" todo/TODO.jsonl` | 0 | aucun |
| RA-09 | `grep -c -i -E "oracle-claims.{0,80}(voisin\|adjacen\|ligne voisine)" todo/TODO.jsonl` | 0 | aucun |
| RA-10 | `grep -c -i -E "grille de prix" todo/TODO.jsonl` | 0 | aucun |
| RA-11 | `grep -c -i -E "fid[ée]lit[ée].{0,60}source" todo/TODO.jsonl` | 2 | TF-1176 (rapport Power BI, sans rapport) ; TF-1232 (fidélité d'une traduction, corrigé) : voisin, non recoupé |
| RA-12 | `grep -c -i -E "pre-commit-anonymiser.{0,120}(disque\|arbre de travail)" todo/TODO.jsonl` | 0 | aucun |
| RA-13 | `grep -c -i -E "Produit-02\|nom de lieu" todo/TODO.jsonl` | 0 | aucun |
| RA-14 | `grep -c -i -E "html\.unescape\|entit[ée]s XML" todo/TODO.jsonl` | 0 | aucun |
| RA-15 | `grep -c -i -E "S1.{0,80}(pastille\|intercalaire)" todo/TODO.jsonl` | 2 | TF-1382 (pied de page pptxgenjs) ; TF-1593 (infobulles) : sans rapport |
| RA-16 | `grep -c -i -E "S1.{0,60}pagination\|sommaire sans intercalaire" todo/TODO.jsonl` | 0 | aucun |
| RA-17 | `grep -c -i -E "pptxgenjs.{0,80}(global\|install)" todo/TODO.jsonl` | 0 | aucun |
| RA-18 | `grep -c -i -E "run-oracles.{0,80}json" todo/TODO.jsonl` | 6 | 6 items sur run-oracles de forge-conception et le gitignore : aucun sur la sortie JSON |
| RA-19 | `grep -c -i -E "U\+00A0\|ins[ée]cable.{0,40}pptx" todo/TODO.jsonl` | 0 | aucun |
| RP-06 | `grep -c -i -E "retour-de-ledger-jamais-compile\|sans lot" todo/TODO.jsonl` | 6 | TF-1988 (alerte d'ouverture, corrigé) : RP-06 en est la récidive ; TF-2223 et TF-2260 (journal hors run) : voisins ; TF-2085 : sans rapport |
| RP-07 | `grep -c -i -E "veille d.une s[ée]ance\|revue (avant\|de pr[ée]paration)" todo/TODO.jsonl` | 1 | TF-1372 (revue de lecture avant livraison HTML, en cours) : voisin |
| RP-08 | `grep -c -i -E "restitution-action-humaine-geste-agent\|relecture de fond" todo/TODO.jsonl` | 5 | TF-0925, TF-1127, TF-1172, TF-1361, TF-2294 : aucun sur une relecture laissée à l'humain |
| RP-09 | `grep -c -i -E "decision-posee-hors-du-ressort-humain" todo/TODO.jsonl` | 6 | TF-2273 (décision posée pour un travail qui prolongeait la demande, corrigé) : RP-09 en est la récidive ; TF-1550, TF-1572, TF-1693 : même classe, autres faits |
| RP-10 | `grep -c -i -E "engagement.{0,60}sans livrable" todo/TODO.jsonl` | 0 | aucun |
| RP-11 | `grep -c -i -E "EC-2.{0,80}(h\.\|heure)" todo/TODO.jsonl` | 0 | aucun |
| RP-12 | `grep -c -i -E "allouer-indice.{0,80}(chemin\|introuvable\|n.existe)" todo/TODO.jsonl` | 0 | aucun |
| RP-13 | `grep -c -i -E "livrable-frais-masque-par-un-ancien\|etatDesLivrables" todo/TODO.jsonl` | 5 | TF-2264 (corrigé) : même défaut que le retour seq 634 ; TF-2136 : voisin |
| RD-15 | `grep -c -i -E "critique.{0,40}(pptx\|deck\|diapositive)\|support de diapositives" todo/TODO.jsonl` | 4 | TF-1130 (domaine support de diapositives, corrigé) : voisin ; TF-1490, TF-2142 : sans rapport |

Le retour seq 634 (`mobiliser --verifier` retient le premier journal qui correspond au motif, 05/11/2026) est le défaut de TF-2264, remonté le 06/11 par un autre produit et corrigé depuis : il n'entre pas au sidecar.

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Corrigé des notes de l'exercice 2 du module 2 qui cite 12 besoins quand le kit en liste 8 (ledger seq 614) | pas encore : à la prochaine version du module 2 | non | défaut d'un contenu ; sa classe, la cohérence entre pièces, remonte en RA-07 |
| Neuf relevés de la revue du 09/11 sur la journée 1 : solutions dans le kit, durées, mémo, notes d'un autre deck, pied de page, mentions à vérifier (ledger seq 686) | corrigés le 09/11 par la décision D-179 (a), 19 fichiers à l'indice 20261109a, `controles_coherence.py` rouge puis vert | oui | remontés en RA-06, RA-07 et RP-10 |
| Classes écrites au ledger hors référentiel (« oracle-manquant », « process », « coherence » et 6 autres) | remplacées dans ce sidecar par une clé du référentiel ou une classe à créer | oui | remonté en RP-06 |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot — `node forge\retours\oracle-lot.mjs --murs .` rend 0 document de 5 versions datées ou plus sous `output\`, le 09/11/2026.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `retoursSansLot` (TF-1988) compte juste : ses 104 entrées se recoupent avec le ledger, et il signale les 9 classes inconnues. Le défaut est qu'il ne bloque rien (RP-06).
- `allouer-indice` et la règle « un fichier par version » ont tenu sur 19 fichiers régénérés le 09/11, anciens sous `old\`.
- `oracle-programme-formation` a refusé un segment de 65 minutes au programme Qualiopi du 09/11 (C4), corrigé avant remise.

## Ordre recommandé

1. RP-06, parce que tant que l'alerte ne bloque rien, chaque retour de ce lot aurait pu rester au ledger d'un autre produit.
2. RA-06 puis RA-07, parce qu'une formation part chez un client avec les solutions dans le kit du participant sans qu'aucun contrôle ne rougisse.
3. RP-07 et RP-08, parce qu'ils auraient fait trouver ces défauts sans demande humaine.
4. RA-14 et RA-15, faux positifs à 1 d'effort qui rougissent chaque deck.
5. Les autres, dans l'ordre des tables.

## La règle qui aurait évité le retour

Les retours qui suivent un retour humain sont RA-06, RA-08, RP-06, RP-07, RP-08 et RP-09 ; chacun nomme sa règle, ou son absence, dans sa colonne « Proposition esquissée ». Pour RA-06 et RA-07, aucune règle ne couvre le domaine : règle § 4 de quality-oracles.

Classes proposées, une par retour :
- **RA-06** : clé proposée `formation-sans-document-du-formateur`, famille `gabarit-document` — Une chaîne de formation ne produit que les pièces du participant (support, kit) : aucun document du formateur (minutage, solutions, matériel, préparation de la veille) n'est prévu ni exigé, et ce qui revient au formateur finit dans le kit du participant ou nulle part.
- **RA-07** : clé proposée `coherence-entre-pieces-d-une-formation-non-jugee`, famille `gabarit-document` — Les pièces d'une formation (support, notes, kit, programme) passent chacune leurs oracles alors qu'elles se contredisent : durée d'un exercice, temps d'une demi-journée, solution chez le participant, fiche contraire à la grille enseignée.
- **RA-08** : clé proposée `programme-de-formation-calque-sur-la-propale`, famille `gabarit-document` — Un programme de formation reprend la lettre de la propale commerciale au lieu de l'usage attendu par chaque public, et enchaîne des modules suivis séparément.
- **RA-12** : clé proposée `hamecon-d-anonymisation-reecrit-l-arbre-de-travail`, famille `anonymisation` — Le hameçon d'anonymisation au commit réécrit les fichiers de travail sur le disque au lieu de la seule copie indexée, y compris des entrants en lecture seule.
- **RA-17** : clé proposée `prerequis-declare-installe-absent-du-poste`, famille `contrat-interface-forge` — Un skill déclare un prérequis installé que le poste n'a pas, et l'échec qui en résulte ne le nomme pas.
- **RA-18** : clé proposée `sortie-json-attendue-rendue-en-texte`, famille `contrat-interface-forge` — Un outil partagé rend du texte là où son appelant attend du JSON, sans option pour l'obtenir.
- **RA-19** : clé proposée `insecable-perdu-par-le-generateur-pptx`, famille `contrat-interface-forge` — Le générateur de diapositives prescrit par un skill perd l'espace insécable U+00A0 que l'oracle de charte du même socle exige.
- **RP-07** : clé proposée `echeance-de-seance-sans-revue-declenchee`, famille `hook-ou-gate` — La date d'une séance ou d'une remise n'est inscrite dans aucun calendrier lu par le dispositif : aucune revue de préparation n'est déclenchée avant elle.
- **RP-10** : clé proposée `engagement-de-document-sans-livrable`, famille `gabarit-document` — Un document remis au client annonce une pièce, un temps ou un outil qu'aucun autre livrable de la chaîne ne produit ni ne contrôle.
- **RD-15** : clé proposée `critique-de-rendu-sans-oracle-pour-le-pptx`, famille `skill-ou-oracle-non-invoque` — La critique d'implémentation n'a d'oracle que pour les pages HTML : sur un deck, la grille s'applique à la main sans le déclarer.
