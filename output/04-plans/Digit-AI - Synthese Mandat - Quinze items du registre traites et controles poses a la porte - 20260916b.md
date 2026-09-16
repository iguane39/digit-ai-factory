---
destinataire: humain
---

# Quinze items du registre traités, et trois contrôles posés là où l'on produit

Vous aviez demandé de traiter tous les todos et les retours. Les retours étaient déjà tous entrés
au registre : ce qui restait à faire, c'était la file des améliorations décidées. Quinze y sont
closes ce matin, chacune avec sa preuve rejouée. L'essentiel du reste n'attend pas du travail mais
votre mot : plus de la moitié de la file demande d'écrire chez des dépôts voisins, et rien ne s'y
écrit sans votre mandat. Trois questions vous attendent plus bas, et la première débloque à elle
seule la moitié de ce qui dort.

## 1. En-tête

- **Quoi** : mandat « traiter tous les todos et retours » · **sur quoi** : le registre d'améliorations
  du pilot et les contrôles de la factory.
- **Quand** : le 2026-09-16, de 07h48 à 11h20 (Europe/Paris), durée 3 h 32.
- **Qui** : pilot, doctrine de restitution v2.22.0, registre v1.13.0.

## 2. Verdict

15 items clos sur 58 ouverts à l'ouverture, 6 règles neuves et 2 contrôles neufs posés, harnais
122/122 vert, registre PASS, boîte d'entrée PASS — 44 items restent ouverts, dont 29 hors de portée
sans mandat ou sans arbitrage.

Coût du reste implémentable : complexité complexe × durée long.

## 3. Décisions attendues de vous

**Bloquants à lever pour avancer** — chacun dit ce qu'il arrête, ce qu'il faut fournir, et ce qui
se passe si rien ne vient :

- **vingt-deux améliorations qui visent les forges voisines sont à l'arrêt** ; il faut un mandat
  d'écriture nommant les dépôts concernés et la fenêtre de travail ; sans lui, la file se remplit
  sans se vider et leurs récidives continuent d'être comptées sans pouvoir être traitées ;
- **sept améliorations étiquetées « pilot » dont le travail vit chez un produit sont à l'arrêt** ;
  il faut soit le même mandat, soit leur réétiquetage vers le produit émetteur ; sans cela, elles
  pèsent sur la file du pilot en donnant l'illusion qu'il peut les traiter ;
- **l'arbitrage des vues du registre recopiées à chaque régénération est à l'arrêt** ; il faut
  choisir entre cesser de les versionner, les régénérer à la lecture, ou assumer et écrire le
  coût ; sans ce choix, le compteur de révisions dérivées continue de monter à chaque tour ;
- **le déclenchement automatique du juge de style sur les textes des produits est à l'arrêt** ; il
  faut trancher entre abaisser le seuil de réussite attendu et corriger les textes qui n'y
  arrivent pas, la mesure rendant 90,3 % là où 95 % sont exigés ; sans ce choix, le juge reste
  joignable à la main et les textes des produits continuent de sortir sans être jugés ;
- **les deux derniers volets d'oracle d'un item ouvert sont à l'arrêt** ; il faut la lecture
  retenue pour les études, puis une spécification exécutable pour le second volet, qui n'en a
  aucune à ce jour ; sans cela, deux règles de doctrine restent écrites et jouées par personne ;
- **la pose automatique du sceau (l'empreinte qui fige un livrable au moment où il est jugé bon)
  en fin de jugement est à l'arrêt** ; il faut lever
  la contradiction entre sceller au premier verdict et remettre le fichier à jour au tour suivant,
  ce que la doctrine prescrit ; sans cette levée, un livrable modifié après jugement garde son
  indice et personne ne le voit.

> **D-1 — Donnez-vous un mandat d'écriture sur les dépôts voisins, et sur lesquels ?**
>
> La règle du noyau interdit toute écriture chez un dépôt frère hors mandat humain, et le relevé
> d'ouverture le redit à chaque session. La moitié exactement de la file ouverte tombe sous cette
> interdiction : vingt-deux améliorations décidées ou en cours visent la forge des agents, celle du
> design, celle des données, celle des tests, celle de l'audit ou le socle des pages. Aucune ne
> peut avancer ici, quel que soit le temps qu'on y passe.
>
> **Recommandation : (a).** Source consultée : le noyau `CLAUDE.md`, paragraphe Garde-fous, qui
> réserve l'écriture chez un frère à un mandat humain journalisé, et la boucle mandatée qu'il
> décrit. Un mandat borné à trois dépôts tient la règle sans l'assouplir : il la rend explicite,
> daté et consigné, au lieu de laisser la file grossir.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) mandat borné à trois dépôts, une fenêtre de travail nommée | une session par dépôt, effort moyen × moyen ; le mandat se journalise au registre | exclut de traiter les vingt-deux d'un coup |
| (b) mandat global sur les quatorze forges | effort complexe × long, et un arbre de travail ouvert partout à la fois | exclut de mesurer ce que chaque dépôt a reçu |
| (c) aucun mandat | rien à payer aujourd'hui ; la file reste à quarante-quatre et croît | exclut toute fermeture de ces vingt-deux items |

> **Si rien n'est décidé** : (c) — les vingt-deux restent ouverts, et le pilot continue de les
> compter sans pouvoir les traiter.

> **D-2 — Que fait-on des vues du registre, qui sont du contenu recopié et versionné ?**
>
> Le registre a une source unique et deux vues qui la recopient entièrement. La mesure du huit
> septembre compte mille cent soixante-treize révisions pour un contenu dérivé, régénérable en une
> commande ; un nom écrit une seule fois dans la source apparaît dans soixante-quinze révisions de
> l'histoire, et sur les cent quatre-vingt-quatorze occurrences historiques d'un nom relevées ce
> jour-là, soixante-quinze viennent de cette seule amplification. Un contenu dérivé versionné
> multiplie par le nombre de régénérations le coût de toute erreur dans sa source.
>
> **Recommandation : (c).** Source consultée : l'entrée du registre elle-même, lisible en clair dans
> `todo\TODO.md`, dont la campagne qui a posé la mesure recommande d'écrire le coût tant que les vues
> servent la lecture sur l'hébergeur ; aucune règle de `REGLES-PROJET.md` ne tranche le cas d'un
> contenu dérivé publié, et c'est pourquoi la question vous revient.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (c) assumer et écrire le coût au registre de dette | effort simple × court ; le compteur continue de monter | exclut de réduire l'amplification |
| (a) cesser de versionner les vues, les régénérer à la lecture | effort moyen × moyen ; la lecture sur l'hébergeur perd les vues | exclut de consulter le registre sans cloner |
| (b) réécrire l'histoire des deux vues | effort complexe × long, et une republication de tout le parc | exclut de garder l'histoire telle qu'elle est |

> **Si rien n'est décidé** : (c) — rien ne bouge, et le coût continue d'être payé sans être écrit.

> **D-3 — Une étude d'opportunité est-elle une « proposition remise à un humain » ?**
>
> La doctrine des runs de mandat dit depuis le sept septembre que toute proposition remise à un
> humain se remet aussi en page autoportante, sauf écart déclaré. Le contrôle qui la joue n'existe
> pas encore, et c'est l'un des deux volets qui restent d'un item ouvert. En préparant ce contrôle,
> la mesure a rendu cinq études d'opportunité postérieures à la doctrine, toutes sans page : soit
> la doctrine n'est pas appliquée, soit elle ne visait pas les études, qui sont des documents
> d'instruction interne et non des propositions remises.
>
> **Recommandation : (b).** Source consultée : `references\RUN-MANDAT.md`, qui parle de « proposition
> remise à un humain » et non d'étude, et `gabarits\ETUDE-OPPORTUNITE.md`, qui ne prescrit aucune
> page. Écrire l'exception avant le contrôle évite de poser une règle qui crie sur cinq documents
> conformes à l'intention de leur gabarit.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (b) borner la règle aux propositions et trajectoires, études exclues par écrit | effort simple × court ; le contrôle part avec zéro accusation sur l'existant | exclut d'obtenir une page pour les études |
| (a) tenir la règle telle qu'elle est écrite | cinq pages à produire, effort moyen × moyen | exclut de considérer une étude comme un document interne |
| (c) laisser la règle sans contrôle | rien à payer ; la doctrine reste une consigne | exclut toute mesure de son application |

> **Si rien n'est décidé** : (c) — la règle reste écrite et jouée par personne, et le volet reste
> ouvert.

## 4. Traité

- Trois défauts d'assiette de lecture du juge des restitutions, corrigés et prouvés contre le code
  d'avant le correctif — preuve : self-test restitution 19/19 puis 24/24, et la variante sans les
  correctifs nomme les trois règles en échec.
  - la règle du motif d'action lisait le nom d'une colonne de livrable comme un motif ; elle lit
    désormais la cellule ou le libellé où un motif se déclare ;
  - la règle de correction comptait un nom de champ cité dans une sortie verte ; les citations
    entre accents graves sortent du balayage ;
  - la règle de complétion lisait l'irréel du passé comme un travail revendiqué ; la famille
    entière est retirée, le temps du verbe suffisant à trancher.
- Cinq vides de la doctrine de restitution comblés, version 2.22.0 — preuve : `oracle-synthese`
  passe de 42 à 46 règles, recette du hameçon de fin de tour 20/20 puis 22/22.
  - aucune exemption ne s'applique à un tour de travail, la précédence étant écrite avant le
    tableau qui la faisait oublier ;
  - le point d'étape existe, forme jugée pour un tour dont le résultat n'est pas encore mesurable ;
  - l'exemption « rien de neuf » est implémentée et bornée par trois absences mécanisables ;
  - un secret se désigne par ses cinq premiers caractères et sa longueur ;
  - un traitement arrêté ouvre par l'inventaire de ses bloquants, et un mot d'exclusivité dans la
    demande oblige à dire ce que le livrable contient en plus.
- Le vocabulaire du destinataire descend jusqu'au producteur — preuve : `oracle-ecriture` 4 puis
  7 cas, `oracle-synthese` 24 puis 27, les deux dans leurs trois sens ; le relevé d'héritage nomme
  l'absence du lexique chez les onze produits localisables, 63 puis 74 manques.
- Deux contrôles neufs posés au moment où l'on produit, sur les deux classes qui récidivaient le
  plus — preuve : sur les 218 livrables du dépôt, le premier accuse 37 documents, soit 17 % ; sur
  les 57 contrôles du dépôt, le second en accuse 1, soit 1,8 %.
  - un livrable écrit sans famille au catalogue est nommé à l'écriture ; la classe récidivait dans
    treize cas sur treize parce que la règle qu'elle déclarait n'existait pas ;
  - un contrôle écrit à la main pour un domaine déjà couvert au registre est nommé, avec sa sortie
    d'exemption écrite dans le fichier ; la classe récidivait dans douze cas sur quatorze.
- Le banc des défauts échappés est joué, compté et opposable — preuve : harnais 121 puis 122
  recettes, le banc y entre nommé et sous cliquet, 3 cas ; sa recette était verte et jouée par
  personne, l'énumération du harnais ne descendant pas dans les sous-dossiers.
- Deux items vérifiés comme déjà outillés par des travaux postérieurs à leur constat, et clos sur
  preuve rejouée plutôt que sur lecture — preuve : le relevé d'héritage distingue cinq états par
  artefact sur onze produits, et le classement des enregistrements en avance sur l'origine est joué
  par le hameçon de pré-push, recette 7/7.
- Un défaut introduit dans le tour, trouvé et corrigé par le contrôle qui existe pour cela — preuve :
  `oracle-caracteres-controle` rend 1 oracle sur 122 en défaut sur deux caractères invisibles, puis
  122/122 après réparation ; la cause est celle qu'il nomme, un chemin écrit par une redirection.
- Un constat en passant versé au registre en candidature, trouvé par le premier passage du contrôle
  neuf — preuve : identifiant `TF-1136` au registre, ingestion marquée récidive de sa classe.

## 5. Non traité

- Vingt-deux améliorations visant les forges voisines : motif `gate_gouvernance` — aucune écriture chez
  un dépôt frère sans mandat humain, et le relevé d'ouverture déclare qu'aucun mandat n'est posé.
- Sept améliorations étiquetées « pilot » dont le texte place le travail chez un produit : motif
  `dependance_externe` — le pilot n'intervient chez un produit que sur run demandé.
- L'arbitrage des vues du registre versionnées : motif `dependance_bloc_3` — il attend la
  décision D-2 ci-dessus.
- Le déclencheur automatique du style rédactionnel sur les fichiers des produits : motif
  `gate_gouvernance` — la mesure existe et rend 90,3 % de réussite là où le seuil posé est de 95 %,
  et la décision est calée au 15 octobre.
- Les deux volets d'oracle qui restent sur les six d'un item ouvert : motif `dependance_bloc_3` —
  le premier attend la décision D-3, le second n'a pas de spécification exécutable à ce jour.
- La pose automatique du sceau d'un livrable en fin de run d'oracles : motif `garde_fou` — sceller
  au premier verdict rendrait fautive la remise à jour que la doctrine prescrit dans le tour
  suivant, et la sortie de cette contradiction n'est pas écrite.

## 6. Écarts à la lettre

Vous avez demandé de traiter **tous** les todos et retours → j'en ai traité quinze sur
cinquante-huit → parce que vingt-neuf des quarante-quatre restants sont hors de portée sans votre
mandat ou sans un arbitrage, et que les traiter ici violerait la règle qui protège les dépôts
voisins. Ce message ne contient rien d'autre que le compte rendu de ce mandat : aucun travail
d'un autre sujet n'y a été ajouté.

## 7. Risques

- Deux règles neuves accusent respectivement 17 % et 7,7 % du corpus existant.
  - signal : un producteur qui voit le même avertissement à chaque écriture cesse de le lire ;
  - parade : les deux sont avertissantes et non bloquantes, et leur taux est écrit au registre pour
    être recomparé à la prochaine revue.
- Le lexique du destinataire est posé chez le pilot et vide chez les produits.
  - signal : la règle rend « non jugé » partout et personne ne s'en aperçoit ;
  - parade : le relevé d'héritage nomme son absence chez les onze produits à chaque ouverture.
- Le harnais découvre désormais les recettes sur deux niveaux, pas davantage.
  - signal : une recette rangée trois niveaux plus bas resterait invisible, comme celle du banc
    l'était ce matin ;
  - parade : la borne est écrite dans le code plutôt que promise, et la même classe a déjà été
    payée quatre fois sous d'autres formes.

## 8. Prochaines actions

Trois travaux que le pilot peut mener seul dès que la file le permet, et quatre gestes qui vous
reviennent — trois arbitrages et le feu vert de publication. Les premiers sont listés d'abord.

| Sélecteur | Action | Acteur | Identifiant | Motif / raison | Où | Si rien n'est fait |
|---|---|---|---|---|---|---|
| **A-1** | Traiter les deux volets restants des six volets d'oracle une fois D-3 tranchée | `auto_ia` | TF-0923 | `dependance_bloc_3` — le premier volet attend la lecture retenue pour les études | `oracles\oracle-gabarits-documents.mjs`, mode `--livrable` | la doctrine des pages de proposition reste jouée par personne |
| **A-2** | Semer une instance de défaut par classe dotée d'un contrôle et mesurer lesquels l'acceptent | `auto_ia` | TF-1079 | `borne_atteinte` — effort complexe × moyen, hors de ce qui restait de la session | `todo\CLASSES.json`, 83 classes dont 6 sans contrôle déclaré | la couverture déclarée des classes reste invérifiée |
| **A-3** | Comparer les verdicts des consommateurs d'un skill avant et après propagation | `auto_ia` | TF-0965 | `borne_atteinte` — effort moyen × moyen, point d'insertion mesuré et non écrit | `oracle-skills --appliquer`, joué par `bootstrap.mjs --pull` | une règle neuve du socle continue de casser une suite voisine sans que rien ne le dise |
| **A-4** | Trancher D-1, le mandat d'écriture chez les dépôts voisins | `manuelle_utilisateur` | neuve | `decision` — la règle réserve à l'humain l'ouverture d'un dépôt frère | bloc 3 de cette synthèse, option (a), (b) ou (c) | vingt-deux items restent ouverts et leurs récidives continuent d'être comptées |
| **A-5** | Trancher D-2, le sort des vues du registre versionnées | `manuelle_utilisateur` | TF-0983 | `decision` — trois voies dont aucune n'est prescrite par un texte | bloc 3 de cette synthèse, option (c) recommandée | le coût de l'amplification continue d'être payé sans être écrit |
| **A-6** | Trancher D-3, la portée de la règle des pages de proposition | `manuelle_utilisateur` | TF-0923 | `decision` — la doctrine parle de proposition, la mesure porte sur des études | bloc 3 de cette synthèse, option (b) recommandée | le contrôle ne peut pas être écrit sans risquer d'accuser cinq documents justes |
| **A-7** | Donner le feu vert de publication des sept enregistrements de ce tour | `manuelle_utilisateur` | neuve | `decision` — la porte du dépôt réserve la publication au mot humain | `FORGE_PUSH_GO="<motif>" git push` depuis `c:\dev\digit-ai-factory` | le travail reste local et les produits ne reçoivent pas la doctrine v2.22.0 |

## 9. Traces

- `output\04-plans\Digit-AI - Synthese Mandat - Quinze items du registre traites et controles poses a la porte - 20260916b.md`
- `todo\TODO.jsonl`, `todo\TODO.md`, `todo\RECIDIVES.md` — registre et vues régénérées
- `gabarits\RESTITUTION.md` v2.22.0, `gabarits\LEXIQUE-PRODUIT.json`, `gabarits\HERITAGE.json` v1.11.0
- `oracles\oracle-synthese.mjs`, `oracles\oracle-ecriture.mjs`, `oracles\lib-lexique.mjs`
- `oracles\oracle-controle-maison.mjs`, `oracles\oracle-gabarits-documents.mjs`, `oracles\hook-ecriture.mjs`
- `oracles\self-tests.mjs`, `oracles\banc-defauts-echappes\`
- `input\01-candidatures\oracle-cadence-en-double-20260916a.tf.jsonl`
