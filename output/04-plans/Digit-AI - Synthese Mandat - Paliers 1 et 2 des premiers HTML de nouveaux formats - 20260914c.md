---
destinataire: humain
---

# Synthèse de mandat — le premier palier est fait et prouvé, le deuxième est écrit et bute sur une porte que vous seul ouvrez (14/09/2026)

Vos deux arbitrages sont exécutés et j'ai enchaîné aussi loin que le périmètre le permettait. Le premier palier est terminé : le catalogue des livrables dit maintenant, pour chacune des vingt familles qui produisent des pages web, où vit son point de départ et de quelle nature il est, et un contrôle le vérifie sur le disque à chaque passage de la recette. Le fait le plus utile de ce tour est que ce contrôle a mordu dès son premier passage — sur trois déclarations que je venais d'écrire moi-même et qui étaient fausses. Les cinq constats sont ouverts au registre, dont un que j'ai trouvé en chemin et que j'ai ouvert parce que la doctrine l'exige. Le deuxième palier est entièrement rédigé, chiffré et vérifié, mais il ne peut pas partir : les trois règles qu'il porte doivent s'écrire dans le socle, et le socle vit dans un dépôt voisin où je n'ai pas le droit d'écrire sans votre accord. Le troisième palier, lui, dépend du deuxième et l'entamer maintenant reviendrait à choisir la méthode que l'état de l'art mesure comme la plus faible. Ce qui est attendu de vous : deux arbitrages, l'un pour ouvrir la porte du socle, l'autre pour dire si l'on attend ou si l'on prend de l'avance.

## 1. En-tête d'identification

- **quoi** — exécution des décisions humaines D-4 (a) et D-5 (a) du 14/09/2026, puis enchaînement des paliers suivants jusqu'à la première porte qui demande un arbitrage.
- **sur quoi** — le pilot `digit-ai-factory` : catalogue `gabarits/documents/`, oracle `oracles/oracle-gabarits-documents.mjs`, registre `todo/`, lot de travaux `output/06-travaux-confies/`. Dépôts frères et skills installés : **lus seulement**.
- **quand** — 2026-09-14 12:05 CEST (UTC+02:00), durée ≈ 1 h 05, relevée à l'horloge du poste.
- **qui** — pilot `digit-ai-factory`, branche `claude/html-quality-new-formats-qhfgvj`, enregistrements `b1d52b0` et `bd04359` ; oracles exécutés : `oracle-gabarits-documents.mjs` — G1 (une famille porte sa doctrine et au moins un exemplaire rempli), G2 (l'exemplaire est rempli, sans marqueur de substitution), G3 (squelette et exemplaire passent le contrôle de marquage du socle), G4 (le document rend son gabarit et sa version, visiblement) et G5, la règle posée dans ce tour, `oracle-todo.mjs` (intégrité du registre), `oracle-travaux-pilot.mjs` — T1 (chaque élément confié porte son moyen de vérification) à T8 (l'en-tête dit le sort du lot reçu), les huit règles de forme d'un lot de travaux, et la recette complète du pilot `oracles/self-tests.mjs`.

## 2. Verdict en une ligne

**Palier 1 TERMINÉ et prouvé : champ `point_de_depart` posé sur les 20 familles déclarant `html` (3 squelette · 2 générateur · 1 canevas · 14 aucun, catalogue porté en 1.2.0), règle G5 posée sur `oracle-gabarits-documents.mjs` qui exige le champ, borne son type au jeu fermé, refuse un « aucun » accompagné d'un chemin et VÉRIFIE le chemin sur disque — G5 PASS sur les 20 familles, self-test de l'oracle porté de 7 à 12 cas tous verts, G5 jouée dans ses CINQ sens, et bruit mesuré à ZÉRO : la recette rend la MÊME liste de 14 oracles en défaut avant et après, mesurée par remisage ; la règle a mordu dès son premier passage sur DEUX déclarations fausses que j'avais écrites (trois chemins du pilot mal ancrés, un skill déclaré comme un dépôt), corrigées avant enregistrement. Registre : TF-1073 ouvert, décidé et CLOS `corrige` avec sa descente ; TF-1074, TF-1075, TF-1076 et TF-1077 ouverts en candidats — `oracle-todo` PASS. Palier 2 ÉCRIT et NON REMIS : lot `pilot - TRAVAUX - 20260914a` spécifiant trois règles proposées — L32 (un même ensemble n'est énuméré qu'une fois par page), V19 (la largeur de contenu est une propriété de la page, pas du chapitre) et V20 (une information qui lève un doute est visible au repos) — avec mesure, exemption déclarée, fixtures rouge et verte, entrée avertissante et exigence de mesure de bruit sur les dépôts consommateurs — `oracle-travaux-pilot` PASS 8/8 après un T8 rouge au premier passage ; aucune écriture chez la forge. Palier 3 NON ENTAMÉ : sa porte d'entrée est la mesure de bruit du palier 2.**

## 3. Décisions attendues de l'humain

> **D-6 — M'accordez-vous le mandat d'écrire les trois règles dans le socle, ou préférez-vous que la forge les traite elle-même ?**
>
> Les trois règles de composition sont entièrement spécifiées : ce qu'elles mesurent, l'exemption qu'elles admettent, la paire de fixtures qui prouve qu'elles jugent dans les deux sens, et l'obligation de mesurer leur bruit sur les dépôts qui consomment le socle avant toute mise en service. Le travail restant est de l'écriture de code dans un dépôt voisin, celui qui porte le socle des pages web. Le garde-fou du noyau me l'interdit sans votre accord explicite, et je m'y suis tenu.
>
> **Recommandation : (b).** Source consultée : `CLAUDE.md` § Garde-fous — « aucune écriture dans les dépôts frères hors mandat humain (boucle mandatée, journalisée) » ; et `gabarits/documents/README.md`, qui pose que la bibliothèque indexe et renvoie plutôt que de dupliquer. **Deux chemins ont été cherchés avant de conclure**, et aucun ne lève le garde-fou : écrire dans la copie installée du skill (`~/.claude/skills/digit-ai-page-html/`) ne propage rien, sa source de vérité étant le dépôt voisin — vérifié, le dossier `digit-ai-forge-agents/.claude/skills/digit-ai-page-html/` existe bien sur ce poste ; et passer par le canal des lots de travaux dépose le fichier dans la boîte d'entrée de ce même dépôt voisin, donc y écrit tout autant. La troisième voie est la vôtre, et c'est cette décision.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Me mandater pour écrire les trois règles dans le socle | complexité complexe × durée moyenne ; une écriture dans un dépôt voisin, journalisée | exclut que la forge arbitre la numérotation et la frontière de V19, qui sont son métier |
| **(b)** Remettre le lot à la forge et la laisser traiter | complexité simple × durée courte pour la remise ; le délai de traitement de la forge | exclut un résultat dans ce fil : le compte rendu reviendra par un lot de retours |
| **(c)** Ne rien remettre pour l'instant | rien | exclut les trois règles, donc le palier 3 : la classe de défaut continue de se rejouer sans être vue |

*Si rien n'est décidé* : (c) s'applique — le lot reste chez le pilot, écrit et jugé, et rien ne part.

> **D-7 — Attend-on le deuxième palier, ou prend-on de l'avance en écrivant les premiers points de départ tout de suite ?**
>
> Le troisième palier consiste à donner un point de départ aux familles qui n'en ont pas, en commençant par les plus employées. Sa porte d'entrée, telle que l'étude l'a posée, est la mesure de bruit du palier précédent : on règle d'abord ce qui se combine avec quoi, on fabrique ensuite les pages vides et leurs exemplaires. L'inverser produirait des exemplaires qui ne portent aucune règle de composition, et c'est exactement la condition que la source de novembre 2025 mesure comme la plus faible des trois testées.
>
> **Recommandation : (a).** Source consultée : `output/03-etudes/20260914-etude-opportunite-premiers-html-nouveaux-formats.md` § 3, où la source arXiv 2511.13972 mesure que la combinaison directive **plus** exemplaire l'emporte, les instructions seules suivent de près, et les exemplaires seuls n'apportent qu'une réduction modeste ; et § 5, où la porte d'entrée du palier 3 est écrite.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| **(a)** Attendre le deuxième palier | rien dans l'immédiat ; le délai de D-6 | exclut tout bénéfice visible avant que les règles existent |
| **(b)** Écrire dès maintenant le point de départ du premier rang | complexité moyenne × durée moyenne ; une page vide et son exemplaire, jugés par les deux oracles du socle | exclut la séquence recommandée, et produit un exemplaire qui ne porte aucune règle de composition |
| **(c)** Écrire les trois premiers rangs d'un coup | complexité complexe × durée longue | exclut la mesure intermédiaire : trois exemplaires produits avant de savoir si le premier tenait |

*Si rien n'est décidé* : (a) s'applique — le palier 3 attend, et la revue du 15 octobre se tient sur ce que les paliers 1 et 2 auront produit.

## 4. Traité — avec sa preuve

- **Palier 1, premier geste : le catalogue déclare enfin où vit le point de départ de chaque famille.**
  - preuve : `gabarits/documents/catalogue.jsonl` porté de 1.1.0 à 1.2.0 ; champ `point_de_depart` {type, chemin, porte_par, releve_le} sur les 20 familles déclarant `html` ; répartition rejouée après écriture — `{"squelette":3,"aucun":14,"generateur":2,"canevas":1}`, et les 12 familles non HTML restent sans le champ.
- **Palier 1, second geste : la règle G5 rend la déclaration opposable.**
  - preuve : `node oracles/oracle-gabarits-documents.mjs` → `VERDICT: PASS`, dont **G5 PASS ×20** ; la règle exige le champ, borne le type au jeu fermé `squelette|generateur|canevas|aucun`, refuse un « aucun » accompagné d'un chemin, vérifie le chemin sur disque, et rend SKIP motivé — jamais PASS silencieux — quand le dépôt porteur est absent du poste.
- **La règle a mordu dès son premier passage, sur mes propres déclarations — contrôle rouge → vert rejoué, et la classe nommée.**
  - preuve : premier passage `G5 FAIL ×3` sur `rapport-de-donnees`, `dossier-exploitation` et `dossier-architecture-technique` (chemins écrits relatifs au pilot au lieu de la racine du parc) et `G5 SKIP` sur `schema-technique` (un skill installé déclaré comme un dépôt) ; après correction des déclarations **et** écriture de la convention de chemin dans l'oracle, `G5 PASS ×20`. Classe du défaut : un artefact reconnu par la forme de son chemin plutôt que par un champ déclaré — la cause même que le palier 1 supprime.
- **Self-test de l'oracle porté de 7 à 12 cas, G5 jouée dans ses cinq sens.**
  - preuve : `node oracles/oracle-gabarits-documents.mjs --self-test` → `Self-test gabarits-documents : 12/12 PASS` — catalogue conforme → PASS, famille `html` sans champ → FAIL, chemin déclaré introuvable → FAIL, « aucun » avec un chemin → FAIL, dépôt porteur absent du poste → SKIP et jamais PASS ; cliquet de la recette `oracle-gabarits-documents.mjs : 7 → 12 cas`.
- **Bruit de la règle neuve mesuré à ZÉRO, par remisage et non par raisonnement.**
  - preuve : `oracles/self-tests.mjs` joué avant et après ; la liste des oracles en défaut est **identique mot pour mot** dans les deux passages — 14 oracles, les mêmes, dont aucun n'est `oracle-gabarits-documents`, qui rend « PASS sur le parc ». La mesure a été prise en remisant les deux fichiers modifiés puis en les restaurant.
- **Les cinq constats sont au registre, dont un clos sur gains constatés — `oracle-todo` PASS après écriture.**
  - preuve : `node todo/journaliser.mjs` → 7 événements écrits, `verdict_avant: PASS -> verdict_apres: PASS` ; TF-1073 créé, `maj decide` (décideur humain, 14/09) puis `maj corrige` avec sa `descente` ; TF-1074, TF-1075, TF-1076 et TF-1077 en candidats. Vues régénérées : `TODO.md` 295 actifs, `TODO.html` 295 items, `RECIDIVES.md` 74 classes.
- **Une clôture refusée puis admise, et c'est la règle qui avait raison.**
  - preuve, contrôle **rouge → vert** rejoué et la règle nommée : première tentative d'écriture **annulée** par `journaliser.mjs` — « le registre passait et ne passe plus (FAIL) — écriture ANNULÉE, fichier repris à 1252807 octets » ; cause lue en rejouant `oracle-todo.mjs` sur une copie : **R12**, une clôture en `corrige` sans champ `descente`. Le champ ajouté — la règle du catalogue et l'oracle G5 qui la joue — l'écriture passe.
- **Un cinquième constat trouvé en chemin, ouvert parce que la doctrine l'exige.**
  - preuve : le README de la bibliothèque annonçait une série de règles allant jusqu'à G7 (la septième d'une série qui s'arrête en réalité à la quatrième) et un G8 (présenté comme exigeant de tout document son couple gabarit + version) ; relevé dans le source de l'oracle avant modification : G1, G2, G3, G4 et rien d'autre — les G5 à G8 trouvés ailleurs appartiennent à `oracle-glossaire.mjs`, un autre espace de noms. TF-1077 ouvert, README réaligné sur G1-G5.
- **Palier 2 : les trois règles sont spécifiées, et le lot est jugé.**
  - preuve : `output/06-travaux-confies/pilot - TRAVAUX - 20260914a.md` et son sidecar ; `node gabarits/oracle-travaux-pilot.mjs` → `verdict : PASS`, **T1 à T8 verts**. Chaque règle porte sa mesure, son exemption déclarée, sa paire de fixtures rouge et verte, son entrée avertissante et l'exigence de mesure de bruit sur les dépôts consommateurs.
- **Le lot de travaux a été refusé une fois par son propre juge, avant d'être écrit au propre.**
  - preuve : premier passage `T8 FAIL` — « l'en-tête ne dit pas le SORT DU LOT REÇU » ; ligne ajoutée avec la commande qui départage les deux cas, second passage `T8 PASS`.
- **Travail enregistré et publié, sans aucune écriture hors du pilot.**
  - preuve : enregistrements `b1d52b0` et `bd04359` poussés sur `claude/html-quality-new-formats-qhfgvj` ; les dépôts frères `digit-ai-forge-audit`, `digit-ai-forge-tests`, `digit-ai-forge-data`, `digit-ai-forge-agents` et les skills installés ont été **lus seulement**.

## 5. Non traité — avec son motif

- **Les trois règles ne sont pas écrites dans le socle** — motif : bloqué par un garde-fou, « aucune écriture dans les dépôts frères hors mandat humain » ; le socle vit dans `digit-ai-forge-agents/.claude/skills/digit-ai-page-html/`. C'est l'objet de la décision D-6.
- **Le lot de travaux n'est pas remis à la forge** — motif : bloqué par le même garde-fou, la remise écrit dans la boîte d'entrée d'un dépôt voisin ; il est écrit, jugé et prêt à partir sans une ligne de plus.
- **Le palier 3 n'est pas entamé** — motif : dépendance à une décision humaine, sa porte d'entrée est la mesure de bruit du palier 2, et l'inverser choisirait la méthode que l'état de l'art mesure comme la plus faible. C'est l'objet de la décision D-7.
- **Les quatre candidats TF-1074 à TF-1077 ne sont pas décidés** — motif : dépendance à une décision humaine, le passage de `candidat` à `decide` exige un décideur et une date, et c'est un geste qui vous appartient.
- **Les onze familles dont le point de départ n'a pas été contre-vérifié dépôt par dépôt** — motif : écarté, avec son critère de réouverture — le champ déclaré remplace ce balayage, et la règle G5 rendra SKIP motivé sur tout chemin dont le porteur est absent plutôt que de conclure.
- **La demande de fusion reste en brouillon** — motif : dépendance à une décision humaine.

## 6. Écarts à la lettre

*Comment lire ce tableau* : votre texte à gauche, ce que j'ai fait au milieu, le motif à droite. Un « non » sur une ligne annule cette ligne seule.

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| « 4a » — ouvrir **les quatre** constats | J'en ai ouvert **cinq** | Le cinquième — le README annonçait trois règles qui n'existaient pas — a été trouvé en greffant G5. **Ajout assumé** : le noyau pose qu'un constat en passant devient un candidat, et le taire aurait été le perdre |
| « enchaîner les autres paliers directement » | Le palier 2 est **écrit mais non remis**, le palier 3 **non entamé** | Les deux butent sur votre exception « sauf s'ils nécessitent des décisions » : écrire dans le socle est un mandat, et inverser la séquence est un arbitrage. **Je me suis arrêté aux portes plutôt que de les forcer** |
| (non dit) | J'ai réaligné le README de la bibliothèque sur les règles que l'oracle joue réellement, G1 à G5 | C'est la documentation de l'objet que je venais de modifier. **Écriture ajoutée** au périmètre, dans le pilot uniquement |
| (non dit, et c'est une erreur de ma part) | Mes trois premières déclarations de chemin étaient fausses, et une quatrième prenait un skill pour un dépôt | Corrigées avant enregistrement, et **la règle les a trouvées elle-même** — c'est la meilleure preuve qu'elle mesure ce qu'elle prétend mesurer, et elle est consignée comme telle plutôt que tue |

## 7. Risques

- **Le lot de travaux reste chez le pilot et personne n'y revient.**
  - signal : au 15 octobre, TF-1074 est toujours `candidat` et aucun lot de retours de la forge n'est arrivé.
  - parade : le lot porte son empreinte de contenu, donc il ne se redéposera jamais en double ; et la revue datée du 15 octobre porte explicitement la question du nombre de constats produits par les règles du palier 2 — une revue sans réponse est elle-même un constat.
- **Les trois règles, une fois posées, font rougir les dépôts qui consomment le socle.**
  - signal : une recette qui passait chez un produit ne passe plus après propagation, et l'équipe croit l'échec préexistant.
  - parade : le lot l'exige en toutes lettres dans sa section « Ce que le pilot NE demande PAS » — entrée avertissante, et mesure de bruit sur les dépôts consommateurs, pas seulement chez l'auteur.
- **Le champ du catalogue se périme sans que personne le voie.**
  - signal : un point de départ déplacé ou supprimé, et le champ qui le pointe encore.
  - parade : G5 vérifie le chemin **sur disque** à chaque passage de la recette du pilot, et non à l'écriture : un chemin qui cesse d'exister rend FAIL le jour même.
- **La correction du README laisse croire que trois règles ont été écartées : G6 — annoncée sans jamais être spécifiée, G7 — annoncée sans jamais être spécifiée, et G8 — celle qui prétendait exiger de tout document son couple gabarit et version.**
  - signal : quelqu'un cite « le socle n'a que cinq règles de gabarit » comme une décision.
  - parade : TF-1077 est ouvert et dit explicitement ce qui reste — écrire G6, G7 et G8 — les trois règles annoncées et jamais implémentées —, ou retirer du README ce qu'elles prétendaient couvrir.

## 8. Prochaines actions

*Comment lire ce tableau* : une ligne par action, l'acteur en colonne, les actions exécutables par l'IA en tête par le tri ; la dernière colonne dit ce qu'il en coûte de ne pas la faire. L'ordre est dérivé : d'abord ce qui débloque une décision, ensuite ce qui en dépend, enfin ce qui attend une date. Les sélecteurs `A-N` désignent des actions et ne partagent aucune numérotation avec les décisions `D-N` du bloc 3 ; la numérotation continue celle des restitutions précédentes de ce jour.

| # | Action | Acteur | État / motif | Si elle n'est pas faite |
|---|---|---|---|---|
| **A-12** | Répondre `D-6` et `D-7` par leur lettre — par exemple « D-6 b, D-7 a » | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, ouvrir l'écriture dans un dépôt voisin et arbitrer l'ordre des paliers vous appartiennent. Fichier à lire d'abord : `output/06-travaux-confies/pilot - TRAVAUX - 20260914a.md` | les options par défaut (c) et (a) s'appliquent : le lot ne part pas, les trois règles n'existent pas, et la classe de défaut continue de se rejouer sans être vue |
| **A-13** | Décider le sort des quatre candidats TF-1074 à TF-1077 — retenir, écarter, ou différer | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, le passage de candidat à décidé exige un décideur humain et sa date. Commande de lecture : `node todo/generer-vue.mjs` puis `todo/TODO.md` | quatre constats restent en attente indéfiniment, et le compteur de récidives les ignore |
| **A-14** | Sortir la demande de fusion du brouillon, ou demander le retrait de la branche | manuelle_utilisateur | action `neuve` — raison d'impossibilité IA : `decision`, la fusion engage la branche principale. Écran : `https://github.com/iguane39/digit-ai-factory/pull/1`, bouton « Ready for review » | tout le travail des trois tours reste sur une branche latérale |
| **A-15** | Remettre le lot de travaux dans la boîte d'entrée de la forge qui porte le socle | auto_ia | action `neuve`, **non exécutée** — motif : `garde_fou`, « aucune écriture dans les dépôts frères hors mandat humain » ; attend D-6 (option (b)) | les trois règles restent une spécification que personne ne lit chez celui qui peut les écrire |
| **A-16** | Écrire les trois règles dans le socle, avec leurs fixtures et la mesure de bruit sur les dépôts consommateurs | auto_ia | action `neuve`, **non exécutée** — motif : `garde_fou`, même garde-fou ; attend D-6 (option (a)) | le socle continue de ne juger que des propriétés locales, et les défauts globaux ne sont vus que par le destinataire du document |
| **A-17** | Écrire le point de départ du premier rang, `ordonnancement-mep` : page vide et exemplaire rempli | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_bloc_3`, attend D-7 (option (b) ou (c)) | les quatorze familles démunies le restent, et chaque premier rendu d'un format neuf se paie en allers-retours |
| **A-18** | Tenir la revue datée : nombre de constats produits par les règles du palier 2, et retours humains par famille outillée contre famille démunie | auto_ia | action `neuve`, **non exécutée** — motif : `dependance_externe`, la date du 2026-10-15 n'est pas atteinte | le verdict de l'étude n'est jamais confronté aux faits, et l'hypothèse du manque reste indémontrable |

Chaque action se déclare `neuve` : aucune ne porte d'identifiant du registre produit, les cinq items ouverts ce jour étant des items de forge et non de produit.

## 9. Traces

- `gabarits/documents/catalogue.jsonl` — 1.2.0, champ `point_de_depart` sur les 20 familles déclarant `html`.
- `oracles/oracle-gabarits-documents.mjs` — règle G5 et sa convention de chemin ; self-test 12 cas, `PASS` sur le parc.
- `gabarits/documents/README.md` — réaligné sur G1-G5, la mention d'un G8 non implémenté datée et rattachée à TF-1077.
- `todo/TODO.jsonl`, `todo/TODO.md`, `todo/TODO.html`, `todo/RECIDIVES.md` — TF-1073 clos, TF-1074 à TF-1077 candidats ; `oracle-todo` PASS.
- `output/06-travaux-confies/pilot - TRAVAUX - 20260914a.md` et son sidecar — lot du palier 2, `oracle-travaux-pilot` PASS 8/8, **non remis**.
- `output/03-etudes/20260914-etude-opportunite-premiers-html-nouveaux-formats.md` — l'étude dont ces paliers exécutent le verdict.
- Enregistrements `b1d52b0` et `bd04359` sur `claude/html-quality-new-formats-qhfgvj`, poussés ; `https://github.com/iguane39/digit-ai-factory/pull/1` en brouillon, surveillée.
- **Aucun livrable HTML n'est cité comme livré dans ce tour** : la critique d'implémentation de forge-design est sans objet ici, et c'est dit plutôt que tu.
